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

    <error-modal ref="errorModal"></error-modal>
  </a-modal>
</template>
<script>
import XLSX from 'xlsx'
import { getSettlementAuthorityByUser } from '@/api/api'
import { httpActionHeader } from '@/api/manage'
import { handleImportData } from '@/utils/common'
import ErrorModal from '../../../global/modules/ErrorModal'
export default {
  name: 'LaborExport',
  components: {
    ErrorModal
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      excelLoading:false,
      form: this.$form.createForm(this),
      settlementList: [],
      fileList:[],
      sheetData:[],
      isUpload:false,
      url:{
        doExport: '/salary/tnetincome/uploadNi'
      }
    }
  },
  methods:{
    add() {
      this.edit({})
    },
    edit() {
      this.visible = true
      this.fileList = []
      this.form.resetFields()
      this.loadSettlementList()
    },
    handleOk(){
      if(this.isUpload){
        this.form.validateFields((err,values) => {
          if(!err){
            const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
            console.log(values)
            httpActionHeader(this.url.doExport, JSON.stringify(this.sheetData), 'post', contextType).then((res) => {
              if(Number(res.code) === 200){
                this.$message.success("导出成功")
                this.$emit('ok')
                this.visible = false
              }
              if(Number(res.code) === 1){
                if(res.data.length > 0){
                  this.$refs.errorModal.showModal(res.data)
                }
              }
            })
          }
        })
      }else{
        this.$message.error("请上传文件")
      }
      
    },
    handleCancel() {
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
          let i = 1
          // 遍历每张工作表进行读取（这里默认只读取第一张表）
          for (const sheet in workbook.Sheets) {
            if(i == 1){
              // esline-disable-next-line
              if (workbook.Sheets.hasOwnProperty(sheet)) {
                sheetName = sheet
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                data[sheet] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet],{defval:'',blankrows:true}))
              }
            }
            i++
          }
          // 去除空格
          const newData = handleImportData(data[sheetName])
          const sheetArr = []
          for(const c of newData){
            sheetArr.push({'moneyMonth':c['费用月份'],'settleMonth':c['结算月份'],'personTime':c['人次'],
            'contactMan':c['客户联系人'],'contactPhone':c['客户联系方式'],'customerService':c['客服'],
            'developer':c['客户开发人'],'settleDepartName':c['结算主体'], 'settleDepartNo':c['结算主体编码'], 'stopMonth':c['停止结算年月'], 
            'settleMoney':c['结算金额'], 'cardPay':c['银付'], 'moneyPay':c['现付'],
            'managementMoney':c['管理费'], 'countTax5':c['5%税金'], 'countTax6':c['6%税金'], 'ticketMoneySum':c['开票金额'], 
            'getMoneyDate':c['到款日期'], 
            'getMoneyValue':c['到款金额'], 'getMoneyWay':c['到款方式'],'getMoneyUnit':c['到款单位'],'remark':c['备注']
            })
          }
          this.sheetData = sheetArr
          this.isUpload = true
          
          //let requestTimeOut = 50000  // 请求过期时间
          //开始异步提交
          // httpActionHeader(importUrl, JSON.stringify(sheetArr), this.importMethod, contextType,requestTimeOut).then((res) => {
          //   this.spinning = false
          //   let msg = res.message || res.msg
          //   if (Number(res.code) === 200) {
          //     if (res.errorMessageList) {
          //       this.$refs.errorModal.title = '导入错误: ' + msg
          //       this.$refs.errorModal.message = msg
          //       this.$refs.errorModal.showModal(res.errorMessageList)
          //       this.loadData()
          //       return false
          //     }
          //     this.$message.success("导入成功！")
          //     this.loadData()
          //   } else {
          //     if (res.data != null && res.data.length > 0) {
          //       this.$refs.errorModal.title = '导入错误: ' + msg
          //       this.$refs.errorModal.message = msg
          //       this.$refs.errorModal.showModal(res.data)
          //     } else if (res.errorMessageList) {
          //       this.$refs.errorModal.title = '导入错误: ' + msg
          //       this.$refs.errorModal.message = msg
          //       this.$refs.errorModal.showModal(res.errorMessageList)
          //     } else {
          //       this.$message.error(msg)
          //     }
          //     if ((data[sheetName].length > res.errorMessageList.length)) {
          //       this.loadData()
          //     }
          //   }
          // })
        } catch (e) {
          // 这里可以抛出文件类型错误不正确的相关提示
          this.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
    },
    handleRemove(){
      this.sheetData = []
      this.isUpload = false
    },
    loadSettlementList() {
      getSettlementAuthorityByUser({}).then((res) => {
        this.settlementList = res.data
      })
    },
  }
}
</script>
