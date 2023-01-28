<template>
  <a-modal
    title="报表导入"
    :width="900"
    placement="right"
    :closable="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="开始导入"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="excelLoading"
  >
    <a-spin
      :spinning="confirmLoading"
      tip="加载中..."
    >
      <a-card
        :bordered="false"
        style="background:#f5f5f5"
      >
        <a-form
          :form="form"
          layout="inline"
          class="ant-advanced-search-form"
        >
          <a-row>
            <a-col :span="8">
              <a-form-item
                label="选择结算主体"
                style="margin-left: 28px"
              >
                <select-page
                  :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                  :title="'departName'"
                  :placeholder="'请选择结算主体'"
                  :id="'id'"
                  :triggerChange="true"
                  :newRequest="newRequest"
                  v-decorator="['settleDepart', validatorRules.settleDepart ]"
                  style="width:200px;"
                ></select-page>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-upload-dragger
              name="file"
              :multiple="false"
              @change="handleChange"
              :beforeUpload="beforeUploadExcel"
              :fileList="fileList"
              accept=".xls,.xlsx"
              :remove="handleRemove"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">选择要上传的文件或者拖拽上传</p>

            </a-upload-dragger>
          </a-row>
        </a-form>
      </a-card>
    </a-spin>
    <error-modal ref="errorModal" @checked="checkedFlag"></error-modal>
  </a-modal>
</template>
<script>
import XLSX from 'xlsx'
import { getSettlementAuthorityByUser } from '@/api/api'
import { httpActionHeader } from '@/api/manage'
import { handleImportData,getNameFromArr,handleImportFail} from '@/utils/common'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import ErrorModal from '../../../salarystandard/modules/ErrorModal'
import SelectPage from '@/components/jeecg/SelectPage'
export default {
  name: 'NoPersonExport',
  components: {
    ErrorModal,
    SelectPage
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      excelLoading:false,
      form: this.$form.createForm(this),
      settlementList: [],
      validatorRules: {
        settleDepart: { rules: [{ required: true, message: '请选择结算主体!' }] },
      },
      fileList:[],
      sheetData:[],
      paushTypeTwoOption:[],
      isUpload:false,
      url:{
        doExport: '/salary/salary/uploadNontaxSalaryAccount'
      },
      newRequest:false,
      failData:[]
    }
  },
  methods:{
    add() {
      this.edit({})
    },
    edit() {
      this.newRequest = true
      this.form.resetFields()
      this.visible = true
      this.fileList = []
      //this.loadSettlementList()
      initDictOptions('PAUSH_DIY_TYPE_TWO').then(res => {
        if (Number(res.code) === 200) {
          this.paushTypeTwoOption = res.data
        }
      })
    },
    // 是否允许重复导入
    checkedFlag(data){
      if(data){
        this.importData(1)
      }
    },
    // 数据导入
    importData(repeatFlag){
      this.form.validateFields((err,values) => {
          if(!err){
            let contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
            this.sheetData[0]['settleDepartId'] = values.settleDepart
            const url = this.url.doExport + "?repeatFlag=" + repeatFlag
            httpActionHeader(url, JSON.stringify(this.sheetData), 'post', contextType).then((res) => {
              if(Number(res.code) === 200){
                this.$message.success("导入成功")
                this.$emit('ok')
                this.visible = false
                this.newRequest = false
                this.isUpload = false
              }
              if(res.code == 1){
                if(res.data){
                  this.$refs.errorModal.showModal(res.data,this.failData,'非扣税薪资')
                }else{
                  this.$message.error(res.msg)
                }
              }
            })
          }
        })
    },
    handleOk(){
      if(this.isUpload){
        this.importData(0)
      }else{
        this.$message.error("请上传文件")
      }
    },
    handleCancel() {
      this.newRequest = false
      this.close()
      this.$emit('ok')
    },
    modalFormOk() {
      this.close()
      this.$emit('ok')
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.isUpload = false
      //this.disableSubmit = false
    },
    beforeUploadExcel(file){
      if(this.fileList.length > 0){
        this.fileList.splice(0, 1);
        this.fileList = [...this.fileList, file];
      }else{
        this.fileList = [...this.fileList, file];
      }
      return false
    },
    handleChange() {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('files[]', file)
      })
      this.uploadFilesChange1(fileList[0])
    },
    // 获取导入数据
    uploadFilesChange1(file) {
      this.spinning = true
      // 通过FileReader对象读取文件
      const fileReader = new FileReader()
      fileReader.onload = event => {
        try {
          const { result } = event.target
          // 以二进制流方式读取得到整份excel表格对象
          const workbook = XLSX.read(result, { type: 'binary' })
          // 存储获取到的数据
          const data = {}
          let sheetName = ''
          // 遍历获取每张工作表 除去隐藏表
          const allSheets = workbook.Workbook.Sheets
          for (const index in allSheets) {
            const name = allSheets[index].name
            if (workbook.Sheets.hasOwnProperty(name) && String(allSheets[index].Hidden) === '0') {
              sheetName = name
              // 利用 sheet_to_json 方法将 excel 转成 json 数据
              data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name],{defval:'',blankrows:true}))
              break
            }
          }
   
          // 去除空格 去除最后的空格行
          const newData = handleImportData(data[sheetName])
          // 获取原表单数据
          this.failData = handleImportFail(data[sheetName])
          let sheetArr = []
          for(const c of newData){
            sheetArr.push({'name':c['账户名'],'money':c['金额'],'bankName':c['开户行'],'bankNo':c['银行卡号'],
            'itemType':getNameFromArr(this.paushTypeTwoOption,c['项目类别'],'label','value'),
            'itemTypeName':c['项目类别'],'itemName':c['项目说明'],'salaryStyle':c['工资发放方式（现金、银行）'],
            'management':c['管理费'],'settleMonth':c['结算月份']
            })
          }
          this.sheetData = sheetArr
          this.isUpload = true
        } catch (e) {
          console.log(e);
          // 这里可以抛出文件类型错误不正确的相关提示
          this.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
    },
    handleRemove(){
      this.sheetData = []
      this.fileList.splice(0, 1);
      this.isUpload = false
    },
    loadSettlementList() {
      getSettlementAuthorityByUser({}).then((res) => {
        console.log(res)
        this.settlementList = res.data
      })
    },
  }
}
</script>
