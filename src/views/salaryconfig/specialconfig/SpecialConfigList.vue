<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="姓名">
              <a-input
                v-model="queryParam.name"
                placeholder=""
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="申报单位">
              <a-input
                v-model="queryParam.declareTitle"
                placeholder=""
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="身份证号">
              <a-input
                v-model="queryParam.idNumber"
                placeholder=""
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="导入月份">
                <a-month-picker placeholder="请选择月份" format="YYYYMM" v-model="queryParam.createMonth_extra" @change="changeMonth"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col
            :md="6"
            :sm="8"
          >
            <span
              style="float: left;overflow: hidden;"
              class="table-page-search-submitButtons"
            >
              <a-button
                type="primary"
                @click="searchQuery"
                icon="search"
              >查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
              <a
                @click="handleToggleSearch"
                style="margin-left: 8px"
              >
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div
      class="table-operator"
      style="margin-bottom:10px"
    >
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :beforeUpload="beforeUpload"
        @change="handleImport1(url.importExcelUrl)"
        accept=".xls,.xlsx"
      >
        <a-button
          type="primary"
          icon="import"
        >专项扣除导入</a-button>
      </a-upload>
      <a-button
        style="margin-left:20px"
        type="primary"
        icon="download"
        @click="downloadLocalTemplate('/templates/专项扣税模板.xlsx')"
      >下载模板</a-button>
      <a-button
        style="margin-left:20px"
        type="primary"
        icon="minus"
        @click="handleBatchDelete"
        v-has="'wxhr:tspecialdeducationsum_del'"
      >批量删除</a-button>
    </div>
    <div>
      <a-spin :spinning="spinning">
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <span
            slot="action"
            slot-scope="text, record"
          >
            <a @click="handleDetail(record)">查看</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确认删除吗?"
              @confirm="handleDelete(record.id)"
              okText="确定"
              cancelText="取消"
            >
              <a
                href="#"
                v-has="'wxhr:tspecialdeducationsum_del'"
              >删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </a-spin>

    </div>

    <a-modal
      :width="600"
      :visible="visible"
      title="删除本月数据"
      @cancel="handleCancel"
      @ok="handleOk"
      cancelText="取消"
      :confirmLoading="loading"
      :maskClosable="false"
    >
      <a-form :form="form">
        <a-row>
          <a-col :span="10">
            <a-form-item
              label="申报单位:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-decorator="['declareTitle', validatorBasicRules.declareTitle ]"
                style="width:191px"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 表单区域 -->
    <special-config-modal ref="modalForm"></special-config-modal>
    <error-modal ref="errorModal"></error-modal>
  </a-card>
</template>
<script>
import XLSX from 'xlsx'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { handleImportData } from '@/utils/common'
import SpecialConfigModal from './modules/SpecialConfigModal'
import ErrorModal from '../../web/global/modules/ErrorModal'
import { httpActionHeader,httpAction } from '@/api/manage'
export default {
  name: 'SpecialConfigList',
  mixins: [JeecgListMixin],
  components: {
    SpecialConfigModal,
    ErrorModal
  },
  data(){
    return{
      visible:false,
      loading:false,
      spinning:false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      validatorBasicRules:{
        declareTitle:{ rules: [{ required: true, message: '请输入申报单位' }] },
      },
      columns:[
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '工号',
          align: 'center',
          dataIndex: 'jobNumber',
        },
        {
          title: '导入月份',
          align: 'center',
          dataIndex: 'createMonth',
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'idNumber',
        },
        {
          title: '税前扣除项目合计',
          align: 'center',
          dataIndex: 'preTaxDeduction',
        },
        {
          title: '申报单位',
          align: 'center',
          dataIndex: 'declareTitle',
        },
        {
          title: '减除费用',
          align: 'center',
          dataIndex: 'costReduction',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
        }
      ],
      url:{
        list:'/salary/tspecialdeducationsum/page',
        delete:'/salary/tspecialdeducationsum/',
        importExcelUrl: '/salary/tspecialdeducationsum/uploadSds',
        deleteAll: '/salary/tspecialdeducationsum/doDeleteTSumSpecialDeducationAll'
      }
    }
  },
  methods: {
    //下载模板
    downloadLocalTemplate(templateUrl) {
      const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
      window.location.href = url
    },
    changeMonth(date){
      this.queryParam.createMonth = date ? date.format('YYYYMM') : null
    },
    //批量删除
    handleBatchDelete(){
      this.form.resetFields()
      this.visible = true
    },
    handleOk(){
      this.form.validateFields((err, values) => {
        if(!err){
          let url = this.url.deleteAll + '?declareTitle=' + values.declareTitle
          httpAction(url,{},'POST').then((res) => {
            if(res.code == 200){
              this.$message.success('删除成功')
              this.loadData()
              this.visible = false
            }else{
              this.$message.error(res.msg);
            }
          })
        }
      })
    },
    handleCancel(){
      this.visible = false
    },
    // 导入功能
    handleImport1(importUrl) {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('files[]', file)
      })
      this.uploadFilesChange1(fileList[0], importUrl)
    },
    // 实现导入
    uploadFilesChange1(file, importUrl) {
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
          
          // 遍历每张工作表进行读取（这里默认只读取第一张表）
          // for (const sheet in workbook.Sheets) {
          //   // esline-disable-next-line
          //   if (workbook.Sheets.hasOwnProperty(sheet)) {
          //     sheetName = sheet
          //     // 利用 sheet_to_json 方法将 excel 转成 json 数据
          //     data[sheet] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
          //   }
          // }
          const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
          const sheetArr = []
          for(const c of newData){
            sheetArr.push({'enterpriseAnnuity':c['企业(职业)年金'],'fund':c['住房公积金'],'otherMoney':c['其它'],
            'donationAmount':c['准予扣除的捐赠额'],'taxSavings':c['减免税额'],'takingRisks':c['商业健康保险'],
            'insurancePension':c['基本养老保险费'],'insuranceMedical':c['基本医疗保险费'],'remark':c['备注'],
            'insuranceUnemployment':c['失业保险费'],'name':c['姓名'],'jobNumber':c['工号'],'createStart':c['所得期间起'],
            'createEnd':c['所得期间止'],'currentIncomeTaxFree':c['本期免税收入'],'currentIncome':c['本期收入'],
            'declareTitle':c['申报单位'],'preTaxDeduction':c['税前扣除项目合计'],'taxDeferredInsurance':c['税延养老保险'],
            'sumHousingRentMoney':c['累计住房租金'],'sumHousingLoanMoney':c['累计住房贷款利息'],'sumChildEduMoney':c['累计子女教育'],
            'sumContinuingEducationMoney':c['累计继续教育'],'sumSupportElderlyMoney':c['累计赡养老人'],'sumBabyMoney':c['累计3岁以下婴幼儿照护'],
            'sumPrivatePension':c['累计个人养老金'],'idNumber':c['证件号码'],'type':c['证件类型'],'costReduction':c['减除费用标准'],'taxesWithheld':c['已缴税额']
            })
          }

          const requestTimeOut = 50000  // 请求过期时间
          httpActionHeader(importUrl, JSON.stringify(sheetArr), this.importMethod, contextType,requestTimeOut).then((res) => {
            this.spinning = false
            const msg = res.message || res.msg
            if (Number(res.code) === 200) {
              if (res.errorMessageList) {
                this.$refs.errorModal.title = '导入错误: ' + msg
                this.$refs.errorModal.message = msg
                this.$refs.errorModal.showModal(res.errorMessageList)
                this.loadData()
                return false
              }
              this.$message.success("导入成功！")
              this.loadData()
            } else {
              if (res.data != null && res.data.length > 0) {
                this.$refs.errorModal.title = '导入错误: ' + msg
                this.$refs.errorModal.message = msg
                this.$refs.errorModal.showModal(res.data)
              } else if (res.errorMessageList) {
                this.$refs.errorModal.title = '导入错误: ' + msg
                this.$refs.errorModal.message = msg
                this.$refs.errorModal.showModal(res.errorMessageList)
              } else {
                this.$message.error(msg)
              }
            }
          })
        } catch (e) {
          // 这里可以抛出文件类型错误不正确的相关提示
          this.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
    },
  }
}
</script>
