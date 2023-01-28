<template>
  <a-modal
    title="数据校验"
    :width="1000"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="取消"
    okText="确定"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
  >
    <a-spin
      :spinning="spinningLoading"
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
            <a-col
              :span="4"
              align="left"
            >
              <a-form-item>
                <a-upload
                  name="file"
                  :showUploadList="false"
                  :beforeUpload="beforeUploadExcel"
                  :multiple="false"
                  @change="handleImportSalaryExcel"
                  accept=".xls,.xlsx"
                >
                  <a-button
                    type="primary"
                    icon="import"
                  >选择文件</a-button>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col :span="9">
              <a-form-item
                label="工资主表"
                :labelCol="{span: 8}"
                :wrapperCol="{span: 10}"
              >
                <a-select
                  v-decorator="['salaryMainForm', validatorRules.salaryMainForm ]"
                  style="width: 191px"
                  placeholder="请选择"
                  @change="changeMain"
                >
                  <a-select-option
                    v-for="(item, index) in mainOptions"
                    :key="index"
                    :value="item"
                  >{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="11">
              <a-form-item label="数据子表">
                <a-select
                  v-decorator="['salarySonForm', validatorRules.salarySonForm ]"
                  mode="multiple"
                  style="width: 300px"
                  placeholder="请选择"
                  @change="changeSon"
                >
                  <a-select-option
                    v-for="(item, index) in sonOptions"
                    :key="index"
                    :value="item"
                  >{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :offset="3">
              <a-form-item
                label="选择结算主体"
                :labelCol="{span: 10}"
                :wrapperCol="{span: 10}"
              >
                <a-select
                  v-decorator="['settleDepart', validatorRules.settleDepart ]"
                  @change="handleIdSettlement"
                  style="width: 191px"
                >
                  <a-select-option
                    v-for="(item, index) in settlementList"
                    :key="index"
                    :value="item.id"
                  >{{ item.departName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="mainFlag == true">
            <a-col>
              <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                <a-checkbox
                  @change="onCheckAllChange"
                  :checked="checked"
                >
                  全选
                </a-checkbox>
              </div>
              <br />
              <a-form-item label="数据列表">
                <a-checkbox-group
                  class="checkbox-group-style"
                  v-decorator="['dataList', validatorRules.dataList ]"
                  :options="plainOptions"
                  @change="onChange"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

      </a-card>
    </a-spin>
    <!-- 错误信息 -->
    <salary-check-error-modal ref="salaryCheckErrorModal"></salary-check-error-modal>
  </a-modal>
</template>
<script>
import XLSX from 'xlsx'
import pick from 'lodash.pick'
import { httpAction } from '@/api/manage'
import { getSettlementAuthorityByUser } from '@/api/api'
import SalaryCheckErrorModal from './SalaryCheckErrorModal'
import {mapGetters} from 'vuex'
export default {
  name: "SalaryCheckModal",
  components: {
    SalaryCheckErrorModal
  },
  data() {
    return{
      form: this.$form.createForm(this),
      visible:false,
      confirmLoading:false,
      spinningLoading:false,
      checked: false,
      plainOptions:[], // 数据列表
      excelOptions:[],
      excelOptionsData: [],
      mainOptions: [], // 工资主表
      sonOptions: [], // 数据子表
      settlementList: [], // 结算主体
      configMainData: [], // 数据配置列表
      mainValue: '', // 主表数据
      mainFlag: false,
      validatorRules:{
        salaryMainForm: { rules: [{ required: true, message: '请选择工资主表!' }] },
        salarySonForm: { rules: [{ required: true, message: '请选择数据子表!' }] },
        dataList: { rules: [{ required: true, message: '请选择数据子表!' }] },
        settleDepart: { rules: [{ required: true, message: '请选择结算主体!' }] },
      },
      model:{},
      url: {
        checkList: '/salary/tsalaryexcelcheck/getTSalaryExcelCheckList',
        doCheck: '/salary/tsalaryexcelcheck/doCheck'
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    show() {
      this.form.resetFields()
      this.visible = true
      this.mainOptions = []
      this.sonOptions = []
      this.plainOptions = []
      this.configMainData = []
      this.checked = false
      this.mainFlag = false
      this.model = {}
      this.loadSettlementList()
    },
    loadSettlementList() {
      getSettlementAuthorityByUser({}).then((res) => {
        this.settlementList = res.data
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.visible = false
    },
    onChange(checkedList) {
      this.checked = checkedList.length === this.plainOptions.length;
    },
    onCheckAllChange(e) {
      if(e.target.checked){
        this.model.dataList = this.plainOptions
        this.checked = true
      }else{
        this.model.dataList = []
        this.checked = false
      }
      this.form.setFieldsValue(pick(this.model,'dataList'))
    },
    beforeUploadExcel(file) {
      this.fileList = []
      this.fileList = [...this.fileList, file]
      return false
    },
    // 选择文件
    handleImportSalaryExcel() {
      this.spinningLoading = true
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('files[]', file)
      })
      this.uploadFilesChange(fileList[0])
    },
    uploadFilesChange(file) {
      // 通过FileReader对象读取文件
      const fileReader = new FileReader()
      fileReader.onload = event => {
        try {
          const { result } = event.target
          // 以二进制流方式读取得到整份excel表格对象
          const workbook = XLSX.read(result, { type: 'binary' })
          // 存储获取到的数据
          const data = {}
          // 遍历每张工作表进行读取（这里默认只读取第一张表）
          for (const sheet in workbook.Sheets) {
            // esline-disable-next-line
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              // 利用 sheet_to_json 方法将 excel 转成 json 数据
              data[sheet] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
            }
          }
          this.spinningLoading = false
          this.excelOptionsData = data
          const sheetArr = []
          for(const sheet in data){
            sheetArr.push(sheet)
          }
          this.excelOptions = sheetArr
          this.mainOptions = sheetArr
          this.sonOptions = sheetArr
        } catch (e) {
          console.log(e);
          // 这里可以抛出文件类型错误不正确的相关提示
          this.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
    },
    // 确定
    handleOk() {
      this.form.validateFields((err,values) => {
        if(!err){
          this.confirmLoading = true
          this.spinningLoading = true
          let formData = Object.assign(this.model,values)
          let postData = {}
          postData.mainSheet = JSON.stringify(this.excelOptionsData[formData.salaryMainForm])
          let sonSalaryData = []
          for(let c of formData.salarySonForm){
            for(let d of this.excelOptionsData[c]){
              sonSalaryData.push(d)
            }
          }
          postData.subSheet = JSON.stringify(sonSalaryData)
          postData.newCheck = formData.dataList.join()
          postData.settleDepart = formData.settleDepart
          let oldCheckIdArr = []
          for(let c of formData.dataList){
            for(let d of this.configMainData){
              if(c == d.mainName){
                oldCheckIdArr.push(d.id)
              }
            }
          }
          
          postData.oldCheckId = oldCheckIdArr.join()
          httpAction(this.url.doCheck,postData,'POST').then((res) => {
            this.confirmLoading = false
            this.spinningLoading = false
            if(Number(res.code) === 200){
              this.$message.success("校验成功")
              this.close()
            }else{
              this.close()
              this.$refs.salaryCheckErrorModal.show(res.data)
            }
          })
        }
      })
    },
    // 改变数据子表的选项
    changeMain(value){
      this.mainValue = value
      this.mainFlag = true
      let arr = []
      this.plainOptions = []
      let commonOptions = []
      for(let c in this.excelOptions){
        if(this.excelOptions[c] != value){
          arr.push(this.excelOptions[c])
        }
      }
      for(let d in this.excelOptionsData){
        if(d == value){
          // 获取主表头信息
          for(let m in this.excelOptionsData[value][0]){
            this.plainOptions.push(m)
            // 匹配主表头信息
            for(let n of this.configMainData){
              if(n.mainName == m){
                commonOptions.push(n.mainName)
              }
            }
          }
        }
      }
      this.model.dataList = commonOptions
      this.checked = commonOptions.length === this.plainOptions.length;
      this.form.setFieldsValue(pick(this.model,"dataList"))
      this.sonOptions = arr
    },
    // 改变主表的选项
    changeSon(value){
      // 取出两数组不同元素
      this.mainOptions = value.concat(this.excelOptions).filter(function(v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v);
      });
    },
    // 选择结算主体
    handleIdSettlement(value){
      let url = this.url.checkList +'?deptId=' + value
      httpAction(url,{},'POST').then((res) => {
        this.configMainData = res
        let commonOptions = []
        for(let m in this.excelOptionsData[this.mainValue][0]){
          for(let n of this.configMainData){
            if(n.mainName == m){
              commonOptions.push(n.mainName)
            }
          }
        }
        this.model.dataList = commonOptions
        this.checked = commonOptions.length === this.plainOptions.length;
        this.form.setFieldsValue(pick(this.model,"dataList"))
      })
    }
  }
}
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
.checkbox-group-style {
  :global(.ant-checkbox-wrapper) {
    margin-left: 20px;
    line-height: 50px;
    width: 102px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
}
</style>