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
      >批量派增</a-button>
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
          v-decorator="['departId', {rules: [{required: true, message: '请选择结算主体！'}]}]"
        ></select-page>
      </a-form-item>
      <a-form-item
        label="社保/公积金户"
        class="stepFormText"
      >
        <a-select
          showSearch
          optionFilterProp="children"
          placeholder="请选择社保/公积金户"
          v-decorator="['houseId', {rules: [{required: true, message: '请选择社保/公积金户！'}]}]"
          :dropdownMatchSelectWidth="false"
        >
          <a-select-option
            v-for="(value, key) in fundHouseholdOptions"
            :key="key"
            :value="value.id"
            @click="handleDepartChange(value)"
          >{{ value.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <!-- <a-form-item
        label="合同开始日期"
        class="stepFormText"
      >
        <a-date-picker
          v-decorator="['contractStart', {rules: [{required: true, message: '请选择合同开始日期！'}],initialValue:this.getCurrentMonthFirst()}]"
          :format="'YYYY-MM-DD'"
          @change="dateOnChange"
          style="width:100%;"
        />
      </a-form-item> -->
      <a-form-item
        label="上传派增模板"
        class="stepFormText"
      >
        <a-row>
          <a-col :span="24">
            <a-upload-dragger
              v-decorator="['file', {rules: [{required: true, message: '请上传派增文件！'}]}]"
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
    <error-modal
      ref="errorModal"
      @ok="errorModalFormOk"
    ></error-modal>
  </a-modal>
</template>
<script>
import moment from 'moment'
import SelectPage from '@/components/jeecg/SelectPage'
import { httpActionHeader } from '@/api/manage'
import XLSX from 'xlsx'
import ErrorModal from '../../../global/modules/ErrorModal'
import { getSettlementAuthorityByUser } from '@/api/api'
import { formatExcelDate,handleImportData } from '@/utils/common'


export default {
  components: {
    SelectPage,
    ErrorModal
  },
  data() {
    return {
      title: '预派单批量派增弹出页面',
      visible: false,
      form: this.$form.createForm(this),
      confirmLoading: false, // 点击确认编辑加载动画
      fundHouseholdOptions: [], // 社保公积金户
      settlementList: [], // 结算主体
      fileList: [], // 附件上传
      url: {
        dispathAdd: '/hrSocial/tpredispatchinfo/analysisJsonStringImportAdd' // 批量派增
      }
    }
  },
  created(){
    this.getCurrentMonthFirst()
  },
  methods: {
    moment,
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
    // 获取结算列表
    loadSettlementList() {
      getSettlementAuthorityByUser({}).then(res => {
        if (Number(res.code) === 200) {
          this.settlementList = res.data
        }
      })
    },
    // 社保公积金户选择
    handleDepartChange() {},
    // 合同开始日期选择
    dateOnChange() {},
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
    // 点击批量派增
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          // const selectedDate = `${values.contractStart.format('YYYY-MM-DD')}`
          // values.contractStart = selectedDate
          // 校验文件
          const fileList = that.fileList
          if (!fileList.length) {
            that.$message.error('请选择上传派增模板!')
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
              data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name], { defval: '', blankrows: true}))
              break
            }
          }
          // 去除每个字段的前后空格以及最后的空格行
          let newData = handleImportData(data[sheetName])
          newData = newData.map(item=>{
            for(const key in item){
              if(/日期/g.test(key) && typeof(item[key]) ==='number' && String((item[key])).length<7){
                item[key] = formatExcelDate(item[key],'-')
              }
            }
            return item
          })
          const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
          // const requestUrl = `${that.url.dispathAdd}?contractStart=${values.contractStart}&departId=${values.departId}&houseId=${values.houseId}`
          const requestUrl = `${that.url.dispathAdd}?departId=${values.departId}&houseId=${values.houseId}`
          //开始异步提交
          httpActionHeader(requestUrl, encodeURI(JSON.stringify(newData)), 'POST', contextType, 600000).then(res => {
            const msg = res.message || res.msg
            if (res.errorMessageList !== null && res.errorMessageList.length) {
              that.$refs.errorModal.title = `批量派增提示: ${msg}`
              that.$refs.errorModal.message = msg
              that.$refs.errorModal.showModal(res.errorMessageList)
            } else {
              if (Number(res.code) === 200) {
                that.$message.success('批量派增成功！')
                that.$emit('ok')
                that.handleCancel()
              }else {
                that.confirmLoading = false
                that.$message.warn(res.msg || '批量派增出错！')
              }
            }
          })
        } catch (e) {
          console.log(e)
          that.confirmLoading = false
          // 这里可以抛出文件类型错误不正确的相关提示
          that.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
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
    // 出错弹出窗回调
    errorModalFormOk() {
      this.$emit('ok')
      this.handleCancel()
    },
    // 获取当前月1号
    getCurrentMonthFirst () {
      const date = new Date()
      date.setDate(1)
      let month = parseInt(date.getMonth() + 1)
      let day = date.getDate()
      if (month < 10){
        month = `0${month}`
      }
      if (day < 10){
        day = `0${day}`
      }
      const initValue = `${date.getFullYear()}-${month}-${day}`
      return moment(initValue, 'YYYY-MM-DD')
    }
  }
}
</script>
