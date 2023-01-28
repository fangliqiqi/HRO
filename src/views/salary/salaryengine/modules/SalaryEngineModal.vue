<template>
  <a-modal
    title="报表制作"
    :width="1200"
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

    <a-spin :spinning="confirmLoading">
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
                <!-- <a-select
                  v-decorator="['settleDepart ', validatorRules.settleDepart ]"
                  @change="handleIdSettlement"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  style="width: 191px"
                >
                  <a-select-option
                    v-for="(item, index) in settlementList"
                    :key="index"
                    :value="item.id"
                  >{{ item.departName }}</a-select-option>
                </a-select> -->
                <select-page
                  :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                  :title="'departName'"
                  :placeholder="'请选择结算主体'"
                  :id="'id'"
                  :triggerChange="true"
                  :newRequest="newRequest"
                  v-decorator="['settleDepart ', validatorRules.settleDepart ]"
                  @change="handleIdSettlement"
                  style="width:200px;"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="选择报表配置方案"
                style="margin-left: 0px"
              >
                <a-select
                  v-decorator="['configId ', validatorRules.configId ]"
                  @change="handleIdSettlementConfig"
                  style="width: 191px"
                >
                  <a-select-option
                    v-for="(item, index) in configsalaryList"
                    :key="index"
                    :value="item.id"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="报表类型"
                style="margin-left: 0px"
              >
                <a-select
                  :disabled="formDisable"
                  v-decorator="['salaryType ', validatorRules.salaryType ]"
                  @change="handleIdFormType"
                  style="width: 191px"
                >
                  <a-select-option
                    v-for="(item, index) in formTypeList"
                    :key="index"
                    :value="item.id"
                  >{{ item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-card>
            <a-row>
              <a-col :span="6">预缴企业所得税(%)</a-col>
              <a-col
                :span="6"
                style="font-weight:bold"
              >{{ configDetail.unitIncomeTax }}</a-col>
              <a-col :span="6">单卡限额金额</a-col>
              <a-col
                :span="6"
                style="font-weight:bold"
              >{{ configDetail.limitMoney }}</a-col>
            </a-row>
            <a-row>
              <a-col :span="6">预缴个人所得税(%)</a-col>
              <a-col
                :span="6"
                style="font-weight:bold"
              >{{ configDetail.personIncomeTax }}</a-col>
              <a-col :span="6">应发工资税点(%)</a-col>
              <a-col
                :span="6"
                style="font-weight:bold"
              >{{ configDetail.salarySumTax }}</a-col>
            </a-row>
            <a-row>
              <a-col :span="6">管理费税点(%)</a-col>
              <a-col
                :span="6"
                style="font-weight:bold"
              >{{ configDetail.managementTax }}</a-col>
              <a-col :span="6">增值税金及附加税点(%)</a-col>
              <a-col
                :span="6"
                style="font-weight:bold"
              >{{ configDetail.valueDaddedTax }}</a-col>
            </a-row>
          </a-card>
          <a-row style="margin-top:20px">
            <a-col
              :span="3"
              align="left"
            >
              <a-form-item>
                <a-upload
                  :disabled="uploadDisabled"
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
            <a-col
              :span="4"
              align="left"
            >
              <a-form-item
                label=""
                style="margin-left: 0px"
              >
                <a-select
                  v-decorator="['excelSheetName', validatorRules.excelSheetName ]"
                  @change="handleIdExcelSheetName"
                  style="width: 191px"
                >
                  <a-select-option
                    v-for="(item, index) in sheetData"
                    :key="index"
                    :value="item"
                  >{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col
              :span="8"
              style="color:#bfbfbf"
            >
              请选择要导入的工资报表 Sheet ，再开始导入
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-spin>
    <salary-engine-export-list-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></salary-engine-export-list-modal>
    <error-modal ref="errorModal" @checked="checkedFlag"></error-modal>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction, postActionHeader } from '@/api/manage'
  import { handleImportData,handleImportFail } from '@/utils/common'
  // import { getSettlementAuthorityByUser } from '@/api/api'
  // import {mapGetters} from 'vuex'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import SalaryEngineExportListModal from './SalaryEngineExportListModal'
  // import ErrorModal from './ErrorModal'
  import ErrorModal from '../../../salarystandard/modules/ErrorModal'
  import SelectPage from '@/components/jeecg/SelectPage'
  //import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import XLSX from 'xlsx'

  export default {
    name: 'SalaryEngineModal',
    components: {
      SalaryEngineExportListModal,
      ErrorModal,
      SelectPage
    },
    //mixins: [JeecgListMixin],
    data() {
      return {
        moment,
        model: {
          settleDepart:'',
          configId:'',
          salaryType :'',
          jsonString:'' 
        },
        title: '操作',
        visible: false,
        confirmLoading: false,
        excelLoading:false,
        form: this.$form.createForm(this),
        settlementList: [],
        formTypeList: [],
        configsalaryList:[],
        dateFormat: "YYYY-MM-DD",
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          settleDepart: { rules: [{ required: true, message: '请选择结算主体!' }] },
          configId: { rules: [{ required: true, message: '请选择报表配置方案!' }] },
          salaryType : { rules: [{ required: true, message: '请选报表类型!' }] },
          excelSheetName: { rules: [{ required: true, message: '请选要导入的工资报表类型!' }] },
        },
        configDetail:{},
        needMonth:'',
        url: {
          importUrl: '/salary/engineer/upload',
          configsalaryList:"/salary/tengineeringset/getTEngineeringSetList",
          salaryAccountNumUrl:"/salary/tsalaryaccount/getSalaryAccoutNum"
        },
        fileList:[],
        excelOptionsData:[],
        sheetData: [],
        excelOptions:[],
        excelSheetName:'',
        formDisable:true,
        uploadDisabled:false,
        newRequest:false
      }
    },
    // computed: {
    //   ...mapGetters(['userInfo'])
    // },
    created() {
      
    },
    methods: {
      add() {
        this.edit({})
      },
      edit() {
        this.newRequest = true
        this.form.resetFields()
        this.settlementList = []
        this.formTypeList = []
        this.configsalaryList = []
        //this.loadSettlementList()
        this.loadFormType()
        this.visible = true
        this.model.settleDepart = ''
        this.model.configId = ''
        this.model.salaryType = ''
        this.model.jsonString = ''
        this.excelOptionsData = []
        this.sheetData = []
        this.configDetail = {}
      },
      // 是否允许重复导入
      checkedFlag(data){
        if(data){
          this.importData(1)
        }
      },
      // 导入数据
      importData(repeatFlag){
        //触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            this.excelLoading = true
            let contextType = {'Content-Type': 'application/json;charset=UTF-8'};
            let formData = Object.assign(this.model, values)
            const url = this.url.importUrl + "?settleDepart=" + formData.settleDepart + "&configId=" + formData.configId +
            "&salaryType=" + formData.salaryType+"&repeatFlag=" + repeatFlag

            // 获取excel数据
            let excelData = {}
            let failData = []
            for (const sheet in this.excelOptionsData) {
              if(sheet == formData.excelSheetName){
                excelData =  [].concat(XLSX.utils.sheet_to_json(this.excelOptionsData[sheet],{defval:'',blankrows:true}))
                // 获取原表单数据 
                failData = handleImportFail(excelData)
                // 去除空格 最后的空格行
                excelData = handleImportData(excelData)
              }
            }
            postActionHeader(url, JSON.stringify(excelData),contextType).then((res) => {
              if(Number(res.code) === 200){
                this.$refs.modalForm.show(res.data)
              }
              if(res.code == 1){
                if(res.data){
                  this.$refs.errorModal.showModal(res.data,failData,'工程薪资')
                }else{
                  this.$message.error(res.msg);
                }
              }
              this.newRequest = false
              this.confirmLoading = false
              this.excelLoading = false
            })
          }
        })
      },
      // 保存按钮
      handleOk() {
        this.importData(0)
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
        //this.disableSubmit = false
      },
      loadSettlementList() {
        // getSettlementAuthorityByUser({userId:this.userInfo.id}).then((res) => {
        //   this.settlementList = res.data
        // })
      },
      loadFormType() {
        //报表类型
        initDictOptions('form_type').then((res) => {
          if (Number(res.code) === 200) {
            this.formTypeList = res.data
            this.formTypeList.splice(2,1)
          }
        })
      },
      // 获取报表配置方案
      handleIdSettlement(value) {
        this.model.configId = ''
        this.form.resetFields()
        this.configsalaryList = []
        this.model.settleDepart = value
        if(this.model.configId != '' && this.model.configId != 0){
          this.formDisable = false
        }else{
          this.formDisable = true
        }
        httpAction(this.url.configsalaryList + '?settleDepart=' + value,null,'POST').then((res) => {
          if(Number(res.code) === 200){
            if(res.data.length){
              this.model.configId = res.data[0].id
            }else{
              this.$message.error("暂时没有配置,请到薪酬服务-薪酬配置,创建新配置。")
            }
            this.configsalaryList = res.data
          }
        })
      },
      handleIdSettlementConfig(value) {
        this.model.configId = value
        if(this.model.settleDepart != '' && value != 0){
          this.formDisable = false
        }else{
          this.formDisable = true
        }
        for(var c of this.configsalaryList){
          if(value == c.id){
            this.configDetail = c
          }
        }
      },
      handleIdFormType(value) {
        for(var c of this.formTypeList){
          if(c.id == value){
            this.model.salaryType = c.value
          }
        }
        // for(var d of this.configsalaryList){
        //   if(d.id == this.model.configId){
        //     this.getNeedMonth(d.settleMonth)
        //   }
        // }
        // let url = this.url.salaryAccountNumUrl + '?salaryType=' + salaryValue + '&settleDepart=' + this.model.settleDepart + '&settleMonth=' + this.needMonth
        // httpAction(url,null,'POST').then((res) => {
        //   if(salaryValue < 2){
        //     if(res.data > 0){
        //       this.$message.error('一月只能导入一次');
        //       this.uploadDisabled = true
        //     }else{
        //       this.uploadDisabled = false
        //     }
        //   }else{
        //     this.uploadDisabled = false
        //   }
        // })
      },
      beforeUploadExcel(file) {
        this.fileList = []
        this.form.validateFields([this.validatorRules.settleDepart,this.validatorRules.configId,this.validatorRules.salaryType],(err) => {
          if(!err){
            this.fileList = [...this.fileList, file]
            return false
          }
        })
      },
      handleImportSalaryExcel() {
        this.form.validateFields([this.validatorRules.settleDepart,this.validatorRules.configId,this.validatorRules.salaryType],(err) => {
          if(!err){
            this.confirmLoading = true
            const { fileList } = this
            const formData = new FormData()
            fileList.forEach((file) => {
              formData.append('files[]', file)
            })
            this.uploadFilesChange(fileList[0])
          }
        })
      },
      uploadFilesChange(file) {
        this.spinLoading = true
        // 通过FileReader对象读取文件
        const fileReader = new FileReader()
        fileReader.onload = event => {
          try {
            const { result } = event.target
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary' })
            // 存储获取到的数据
            //let data = {}
            let arr = []
            // 遍历每张工作表进行读取（这里默认只读取第一张表）
            for (const sheet in workbook.Sheets) {
              arr.push(sheet)
              // let tempData = []
              // // esline-disable-next-line
              // if (workbook.Sheets.hasOwnProperty(sheet)) {
              //   // 利用 sheet_to_json 方法将 excel 转成 json 数据
              //   data[sheet] = tempData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
              // }
            }
            this.excelOptionsData = workbook.Sheets
            this.sheetData = arr
            this.confirmLoading = false
            // let arr = []
            // for(const sheet in data){
            //   arr.push(sheet)
            // }
            this.model.excelSheetName = arr[0]
            this.form.setFieldsValue(pick(this.model,'excelSheetName'))
            this.excelSheetName = arr[0]
          } catch (e) {
            console.log(e);
            // 这里可以抛出文件类型错误不正确的相关提示
            this.$message.error('文件上传错误！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file)
      },
      handleIdExcelSheetName(value){
        this.excelSheetName = value
      }
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
// .ant-btn {
//   margin-left: 30px;
//   margin-bottom: 30px;
//   float: right;
// }
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
</style>