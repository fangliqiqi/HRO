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
  name: 'CounterofferModal',
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
        doExport: '/salary/tstatisticscurrentreportmarket/uploadScrm'
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
      //this.loadSettlementList()
    },
    handleOk(){
      if(this.isUpload){
        this.form.validateFields((err) => {
          if(!err){
            let contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
            this.excelLoading = true
            //this.sheetData[0]['settleDepartId'] = values.settleDepart
            httpActionHeader(this.url.doExport, JSON.stringify(this.sheetData), 'post', contextType,10000 * 6).then((res) => {
              this.excelLoading = false
              if(res.code == 200){
                this.$message.success("导入成功")
                this.$emit('ok')
                this.visible = false
              }
              if(res.code == 1){
                if(res.data){
                  this.$refs.errorModal.showModal(res.data)
                }else{
                  this.$message.error(res.msg)
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
      this.confirmLoading = true
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
          //let contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
          const sheetArr = []
          //sheetArr.push({'settleDepartId':''})
          
          for(const c of newData){
            sheetArr.push({'invoiceTitle':c['封面抬头全称'],'empName':c['姓名'],'empIdcardType':c['证照类型'],
            'empIdcard':c['证照号码'],'createStart':c['税款所属期起'],'createEnd':c['税款所属期止'],
            'item':c['所得项目'],'realSalary':c['本期收入'], 'currentExpenses':c['本期费用'], 'currentTaxFreeIncome':c['本期免税收入'], 
            'personalPensionMoney':c['本期基本养老保险费'], 'personalMedicalMoney':c['本期基本医疗保险费'], 'personalUnemploymentMoney':c['本期失业保险费'],
            'personalProvidentFee':c['本期住房公积金'], 'enterpriseAnnuity':c['本期企业(职业)年金'], 'nowTakingRisks':c['本期商业健康保险费'],
             'nowTaxDeferred':c['本期税延养老保险费'], 
            'nowOther':c['本期其他扣除(其他)'], 
            'allIncome':c['累计收入额'], 'specialDeduction':c['累计专项扣除'],'childEduinfoMoney':c['累计子女教育支出扣除'],'continuingEducationExpenseMoney':c['累计继续教育支出扣除'],
            'housingLoanInterestExpenseMoney':c['累计住房贷款利息支出扣除'],'housingRentalinfoMoney':c['累计住房租金支出扣除'],'supportElderlyExpenseMoney':c['累计赡养老人支出扣除'],
            'sumBabyMoney':c['累计3岁以下婴幼儿照护'],'sumPrivatePension':c['累计个人养老金'],'allOther':c['累计其他扣除'],'allDonate':c['累计准予扣除的捐赠'],
            'taxable':c['累计应纳税所得额'],'taxFee':c['税率'],'quickDeducation':c['速算扣除数'],'salaryTax':c['累计应纳税额'],'allTaxDeduction':c['累计减免税额'],
            'allWithholdingTax':c['累计应扣缴税额'],'allTaxPrepaid':c['累计已预缴税额'],
            'allTaxPayable':c['累计应补(退)税额'],'remark':c['备注']
            })
          }
          this.sheetData = sheetArr
          this.isUpload = true
          this.confirmLoading = false
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
        console.log(res)
        this.settlementList = res.data
      })
    },
  }
}
</script>
