<template>
  <a-modal
    :title="title"
    :width="800"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        :loading="confirmLoading"
        @click="handleOk()"
      >批量导入</a-button>
    </template>
    <a-form
      :form="form"
      class="ant-disabled-form"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-form-item
        label="结算主体"
        class="stepFormText"
      >
        <select-page
          :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
          :title="'departName'"
          placeholder="请选择结算主体"
          :id="'id'"
          :triggerChange="true"
          v-decorator="['deptId', {rules: [{required: true, message: '请选择结算主体！'}]}]"
        ></select-page>
      </a-form-item>
      <a-form-item
        label="生成月份"
        class="stepFormText"
      >
        <a-month-picker
          v-decorator="['createMonth', {rules: [{required: true, message: '请选择生成月份！'}]}]"
          :format="'YYYYMM'"
          style="width:100%;"
        />
      </a-form-item>
      <a-form-item
        label="上传导入模板"
        class="stepFormText"
      >
        <a-row>
          <a-col :span="24">
            <a-upload-dragger
              v-decorator="['file', {rules: [{required: true, message: '请上传导入文件！'}]}]"
              name="file"
              :fileList="fileList"
              :multiple="false"
              :beforeUpload="beforeUpload"
              :remove="removeFile"
              accept=".xls,.xlsx"
            >
              <a-button>
                <a-icon type="upload" /> 点击上传附件 </a-button>
            </a-upload-dragger>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
    <error-modal ref="errorModal"></error-modal>
  </a-modal>
</template>
<script>
import SelectPage from '@/components/jeecg/SelectPage'
import XLSX from 'xlsx'
import ErrorModal from '../../../global/modules/ErrorModal'
import { httpActionHeader } from '@/api/manage'

export default {
  name: 'ForecastBatchImportModal',
  components: {
    SelectPage,
    ErrorModal
  },
  data() {
    return {
      description: '导入预估明细弹窗',
      title: '导入预估明',
      visible: false,
      form: this.$form.createForm(this),
      confirmLoading: false, // 点击确认加载动画
      fileList: [], // 附件上传
      url: {
        dispathImport: '/hrSocial/tforecastlibrary/addTForecastLibrary' // 批量导入
      }
    }
  },
  methods:{
    // 显示
    show() {
      this.visible = true
    },
    // 关闭。取消
    handleCancel() {
      this.form.resetFields()
      this.confirmLoading = false
      this.fileList = []
      this.visible = false
    },
    // 上传附件前
    beforeUpload(file) {
      this.fileList = [file]
      return false
    },
    // 删除上传的附件
    removeFile() {
      const that = this
      this.$confirm({
        title: '删除',
        content: '确定删除该附件？',
        okText: '确认',
        cancelText: '取消',
        onOk: function() {
          //删除该附件
          that.fileList.splice(0, 1)
        }
      })
    },
    // 点击确定
    handleOk(){
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          const selectedDate = `${values.createMonth.format('YYYYMM')}`
          values.createMonth = selectedDate
          // 校验文件
          const fileList = that.fileList
          if (!fileList.length) {
            that.$message.error('请选择上传导入模板!')
            return
          }
          const file = fileList[0]
          that.handleCommit(file, values)
        }
      })
    },
    handleCommit(file, values) {
      var that = this
      // 通过FileReader对象读取文件
      const fileReader = new FileReader()
      fileReader.onload = event => {
        try {
          that.confirmLoading = true
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
            if (workbook.Sheets.hasOwnProperty(name) && allSheets[index].Hidden === 0) {
              sheetName = name
              // 利用 sheet_to_json 方法将 excel 转成 json 数据
              data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name], { defval: '', blankrows: true }))
              break
            }
          }
          that.handleImportEvent(data,values,sheetName)
        } catch (e) {
          that.confirmLoading = false
          // 这里可以抛出文件类型错误不正确的相关提示
          that.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
    },
    handleImportEvent(data,values,sheetName){
      const that = this
      // 去除每个字段的前后空格以及最后的空格行
      const newData = that.handleEmptyRow(data[sheetName])
      const sheetArr = []
      for(const item of newData){
        const obj = {
          'empName':item['员工姓名'],'empIdcard':item['身份证'],'socialPayMonth':item['缴费月份'],
          'providentPayMonth':item['缴费月份'],'socialArea':item['社保缴纳地'],'fundArea':item['公积金缴纳地'],
          'unitPensionBase':item['社保基数'],'unitMedicalBase':item['社保基数'],'unitUnemploymentBase':item['社保基数'],
          'unitInjuryBase':item['社保基数'],'unitBirthBase':item['社保基数'],'unitBigailmentBase':item['社保基数'],
          'personalPensionBase':item['社保基数'],'personalMedicalBase':item['社保基数'],'personalUnemploymentBase':item['社保基数'],
          'personalBigailmentBase':item['社保基数'],
          'unitPersionPro':item['单位养老比例'],'personalPersionPro':item['个人养老比例'],'unitMedicalPro':item['单位医疗比例'],
          'personalMedicalPro':item['个人医疗比例'],'unitUnemploymentPro':item['单位失业比例'],'personalUnemploymentPro':item['个人失业比例'],
          'unitInjuryPro':item['单位工伤比例'],'unitBirthPro':item['单位生育比例'],'unitPensionFee':item['单位养老'],
          'unitMedicalFee':item['单位医疗'],'unitUnemploymentFee':item['单位失业'],'unitWorkInjuryFee':item['单位工伤'],
          'unitBirthFee':item['单位生育'],'personalPensionFee':item['个人养老'],'personalMedicalFee':item['个人医疗'],
          'personalUnemploymentFee':item['个人失业'],'unitBitmailmentFee':item['大病（单位）'],'personalBigmailmentFee':item['大病（个人）'],
          'unitSocialSum':item['单位社保合计'],'personalSocialSum':item['个人社保合计'],
          'unitFundBase':item['公积金基数'],'personalFundBase':item['公积金基数'],
          'unitFundProp':item['缴费比例'],'personalFundProp':item['缴费比例'],
          'unitFundSum':item['单位公积金'],'personalFundSum':item['个人公积金'],'remark':item['备注'],
        }
        sheetArr.push(obj)
      }
      const paramterStr = JSON.stringify(sheetArr,function(key,value){
        if(value === undefined){
          return ''
        }
        return value
      })
      const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
      const requestUrl = `${that.url.dispathImport}?createMonth=${values.createMonth}&deptId=${values.deptId}`
      //开始异步提交
      httpActionHeader(requestUrl, paramterStr, 'POST', contextType, 600000).then(res => {
        const msg = res.message || res.msg
        if(Number(res.code) === 200){
          that.confirmLoading = false
          if (res.errorMessageList !== null && res.errorMessageList.length) {
            that.$refs.errorModal.title = `导入提示: ${msg}`
            that.$refs.errorModal.message = msg
            that.$refs.errorModal.showModal(res.errorMessageList)
            return
          }
          that.$message.success('导入成功！')
          that.$emit('ok')
          that.handleCancel()
        }else {
          that.confirmLoading = false
          if (res.errorMessageList !== null && res.errorMessageList.length) {
            that.$refs.errorModal.title = `导入提示: ${msg}`
            that.$refs.errorModal.message = msg
            that.$refs.errorModal.showModal(res.errorMessageList)
          }else {
            that.$message.warn(res.msg || '导入出错！')
          }
        }
      })
    },
    // 处理文件空行问题
    handleEmptyRow(newData) {
      // 去除最后的空格行
      for (let i = newData.length - 1; i >= 0; i--) {
        // 判断数组是否全为空
        const flag = Object.values(newData[i]).find(item => {
          return String(item).replace(/^\s*|\s*$/g,"").length
        })
        if (!flag) {
          newData.splice(i, 1)
        } else {
          break
        }
      }
      return newData
    },
  }
}
</script>
<style scoped>
</style>