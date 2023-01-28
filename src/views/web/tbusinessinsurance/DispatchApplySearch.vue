<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="员工姓名">
              <a-input
                placeholder="请输入员工姓名"
                v-model="queryParam.empName"
              ></a-input>
            </a-form-item>
          </a-col>

          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="身份证号">
              <a-input
                placeholder="请输入身份证号"
                v-model="queryParam.empIdcardNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="办理状态">
              <a-select
                v-model="queryParam.status"
                placeholder="请选择"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option
                  v-for="(item, index) in statusOptions"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>

            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="出险状态">
                <a-select
                  v-model="queryParam.useStatus"
                  placeholder="请选择"
                >
                  <a-select-option
                    v-for="(item, index) in outstatusOptions"
                    :key="index"
                    :value="item.value"
                  >{{ item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体编码">
                <a-input
                  placeholder="请输入结算主体编码"
                  v-model="queryParam.settlementOrganNo"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体">
                <select-page
                  :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                  :title="'departName'"
                  :id="'id'"
                  :placeholder="'请输入结算主体'"
                  v-model="queryParam.settlementOrgan"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="派单日期">
                <a-range-picker
                  v-model="rangeTime"
                  @change="changeRange"
                  :showTime="{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                  }"
                  format="YYYY-MM-DD HH:mm:ss"
                  style="width:100%"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="失效状态">
                <a-select
                  v-model="queryParam.validFlag"
                  placeholder="请选择"
                >
                  <a-select-option value="0">有效</a-select-option>
                  <a-select-option value="1">无效</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="派单人">
                <a-input
                  placeholder="请输入派单人"
                  v-model="queryParam.createUser"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="派单人所属部门">
                <a-input
                  placeholder="请输入派单人所属部门"
                  v-model="queryParam.userDeptName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="客户名称">
                <a-input
                  placeholder="请输入客户名称"
                  v-model="queryParam.customerName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="保单号">
                <a-input
                  placeholder="请输入保单号"
                  v-model="queryParam.policyNo"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="发票号">
                <a-input
                  placeholder="请输入发票号"
                  v-model="queryParam.invoiceNo"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="保单日期">
                <a-range-picker
                  v-model="rangeTime1"
                  @change="changePolicy"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="是否过期">
                <a-select
                  v-model="queryParam.expireFlag"
                  placeholder="请选择"
                  allowClear
                >
                  <a-select-option value="1">是</a-select-option>
                  <a-select-option value="0">否</a-select-option>
                </a-select>
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        type="primary"
        icon="download"
        v-has="'wxhr:insurance_exportList'"
        @click="exportHandle"
      >导出明细</a-button>
      <a-button
        type="primary"
        icon="undo"
        @click="batchBack"
        :disabled="!selectedRowKeys.length"
      >批量退保</a-button>
      <a-button
        type="primary"
        icon="download"
        @click="exportFinance"
      >财务审核导出</a-button>
      <a-dropdown v-has="'wxhr:insurance_batchupdateuseutatus'">
        <a-menu slot="overlay" >
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.importExcelBatchAddUrl,'post')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />批量更新出险状态
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/批量更新出险状态模板.xls')">
            <a-icon type="download" />模板下载</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量更新出险状态
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div
        class="ant-alert ant-alert-info"
        style="margin-bottom: 16px;"
      >
        已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> 项
        <a
          style="margin-left: 24px"
          @click="onClearSelected"
        >清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        :scroll="{ x: 1}"
      >
        <span
          slot="settleType"
          slot-scope="text"
        >
          <a-tag color="blue">{{ filterDictText(settleTypeOptions, text) }}</a-tag>
        </span>
        <span
          slot="policyRange"
          slot-scope="text,record"
        >
          {{ record.policyStart }} ~ {{ record.policyEnd }}
        </span>
        <span
          slot="buyStandard"
          slot-scope="text"
        >
          <a-tag color="pink">{{ text }}</a-tag>
        </span>
        <span
          slot="status"
          slot-scope="text"
        >
          <a-tag :color="color[text]">{{ filterDictText(statusOptions, text) }}</a-tag>
        </span>
        <span
          slot="replaceStatus"
          slot-scope="text"
        >
          <a-tag
            color="blue"
            v-if="text == 1"
          >未替换</a-tag>
          <a-tag
            color="cyan"
            v-else
          >已替换</a-tag>
        </span>
        <span
          slot="fromEmpName"
          slot-scope="text"
        >
          <template v-if="text">
            <a-tag color="purple">替换</a-tag>
          </template>
          <template v-else>
            <a-tag color="blue">新增</a-tag>
          </template>
        </span>
        <span
          slot="validFlag"
          slot-scope="text"
        >
          <template v-if="text == 0">
            <a-tag color="green">有效</a-tag>
          </template>
          <template v-else>
            <a-tag color="red">无效</a-tag>
          </template>
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleDetail(record)"
            v-has="'wxhr:tbusinessinsurance_detail'"
          >查看</a>
          <a-divider
            type="vertical"
            v-if="Number(record.status) === 12"
          />
          <a
            @click="handleBack(record)"
            v-if="Number(record.status) === 12"
          >退费</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <dispatch-apply-detail-modal ref="DispatchApplyDetailForm"></dispatch-apply-detail-modal>
    <back-list-modal ref="BackListModalForm" @ok="modalFormOk"></back-list-modal>
    <refund-modal ref="RefundModalForm" @ok="modalFormOk"></refund-modal>
    <financial-audit-modal ref="FinancialAuditForm"></financial-audit-modal>
    <dispatch-apply-export-modal
      ref="dispatchApplyExportModal"
      @ok="modalFormOk"
    ></dispatch-apply-export-modal>
    <error-modal ref="errorModal" @ok="modalFormOk"></error-modal>

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import moment from 'moment'
  import JDate from '@/components/jeecg/JDate'
  import DispatchApplyDetailModal from './modules/DispatchApplyDetailModal' //派单申请详情
  import DispatchApplyExportModal from './modules/DispatchApplyExportModal' //导出明细
  import RefundModal from './modules/RefundModal'
  import BackListModal from './modules/BackListModal'
  import FinancialAuditModal from './modules/FinancialAuditModal'
  import ErrorModal from '../global/modules/ErrorModal'
  import SelectPage from '@/components/jeecg/SelectPage'
  // import { getAllSettleDomainSelectVos } from '@/api/api'
  import { httpAction ,httpActionHeader} from '@/api/manage'
  import XLSX from 'xlsx'
  import { handleImportData } from '@/utils/common'

  export default {
    name: 'DispatchApplySearch',
    mixins: [JeecgListMixin],
    components: {
      JDate,
      DispatchApplyDetailModal,
      DispatchApplyExportModal,
      BackListModal,
      RefundModal,
      FinancialAuditModal,
      ErrorModal,
      SelectPage
    },
    data() {
      return {
        description: '商险派单查询',
        rangeTime:null,
        rangeTime1:null,
        startValue: null,
        endValue: null,
        endOpen: false,
        endOpen1: false,
        //枚举字段
        buyTypeOptions: [], //险种
        statusOptions: [], //状态
        status: [], //出险状态
        outstatusOptions:[{label:'未出险',value:'0'},{label:'已出险',value:'1'}],//出险状态
        replaceStatusOptions:[],//替换状态
        settleTypeOptions:[], //结算类型
        settleDomainOptions:[], //结算主体
        color:['orange','#e08d33','cyan','green','red','blue','#72bd4d','#f1a95c','#ffc107','#aeec94'],
        importUrl: '', //导入地址
        importMethod: '', //导入方法
        fileList: [],
        // 表头
        columns: [
          {
            width: 180,
            ellipsis: true,
            title: 'ID',
            align: 'center',
            dataIndex: 'id',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '员工姓名',
            align: 'center',
            dataIndex: 'empName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:160,
            ellipsis: true,
            title: '结算主体编码',
            align: 'center',
            dataIndex: 'settlementOrganNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:180,
            ellipsis: true,
            title: '结算主体名称',
            align: 'center',
            dataIndex: 'settlementOrganName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:200,
            ellipsis: true,
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcardNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:170,
            ellipsis: true,
            title: '结算类型',
            align: 'center',
            dataIndex: 'settleType',
            scopedSlots: { customRender: 'settleType' }
          },
          {
            width:180,
            ellipsis: true,
            title: '保险公司',
            align: 'center',
            dataIndex: 'insuranceCompanyName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:220,
            ellipsis: true,
            title: '险种',
            align: 'center',
            dataIndex: 'insuranceTypeName',
            customRender: text => {
              return <a-tag color="cyan">{{ text }}</a-tag> || '-'
            }
          },
          {
            width:250,
            ellipsis: true,
            title: '保单起止时间',
            align: 'center',
            dataIndex: 'policyStart',
            scopedSlots: { customRender: 'policyRange' },
          },
          {
            width:100,
            ellipsis: true,
            title: '购买标准',
            align: 'center',
            dataIndex: 'buyStandard',
            scopedSlots: { customRender: 'buyStandard' },
          },
          {
            width:120,
            ellipsis: true,
            title: '商险预估金额',
            align: 'center',
            dataIndex: 'forecastBuyPay',
            customRender: text => {
              const resultText = text || (parseFloat(text) === 0?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:100,
            ellipsis: true,
            title: '派单类型',
            align: 'center',
            dataIndex: 'fromEmpName',
            scopedSlots: { customRender: 'fromEmpName' },
          },
          {
            width:100,
            ellipsis: true,
            title: '是否有效',
            align: 'center',
            dataIndex: 'validFlag',
            scopedSlots: { customRender: 'validFlag' },
          },
          {
            width:100,
            ellipsis: true,
            title: '是否过期',
            align: 'center',
            dataIndex: 'expireFlag',
            customRender:(text)=>{
              return (text == 0) ? '未过期' : '已过期'
            }
          },
          {
            width:130,
            ellipsis: true,
            title: '办理状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            width:130,
            ellipsis: true,
            title: '出险状态',
            align: 'center',
            dataIndex: 'useStatus',
            customRender: text => {
              const resultText = this.outstatusOptions[text].label || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:170,
            ellipsis: true,
            title: '派单人所属部门',
            align: 'center',
            dataIndex: 'userDeptName',
            customRender: text => {
              const resultText =  text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:170,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:150,
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed:'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          queryAllInfoById: '/busiInsurance/tbusinessinsurance/', //详情
          list: '/busiInsurance/tbusinessinsurance/getVopage', //列表请求地址
          exportXlsUrl:'/busiInsurance/tbusinessinsurance/doexport', //导出
          backUrl:'/busiInsurance/tbusinessinsurance/batchRefund', // 点击批量退保获取id
          detailUrl:'/busiInsurance/tinsurancerefund/', // 商险退保记录详情
          importExcelBatchAddUrl:'/busiInsurance/tbusinessinsurance/batchUpdateUseStatus'//批量更新退保状态
        }
      }
    },
    created() {
      // 结算主体和所属单位
      // getAllSettleDomainSelectVos().then((res) => {
      //   if (res.code === 200) {
      //     this.settleDomainOptions = res.data
      //   } else {
      //     this.$message.error('结算主体和所属单位数据请求失败！')
      //   }
      // })
    },
    watch:{
      'queryParam':function(val){
        if(!val.createTimeStart){
          this.rangeTime = null
        }
        if(!val.policyStart){
          this.rangeTime1 = null
        }
      }
    },
    methods: {
      filterDictText,
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectionRows = selectionRows
      },
      handleBack(record){
        this.$refs.RefundModalForm.show(record)
      },
      // 下载
      handleDownloadTemplate(templateUrl) {
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
        window.location.href = url
      },
      exportFinance(){
        this.$refs.FinancialAuditForm.show()
      },
      batchBack(){
        const query = []
        this.selectedRowKeys.forEach(item => {
          query.push({id:item})
        })
        httpAction(this.url.backUrl,query,'put').then(res=>{
          if(res.code === 200){
            this.loadBusinessDetail(res.data || '')
          }else{
            this.$message.warning(res.msg || '数据获取失败')
          }
        })
      },
      // 获取商险退保详情
      loadBusinessDetail(Id){
        httpAction(this.url.detailUrl + Id,null,'GET').then(res=>{
          if(Number(res.code) === 200){
            this.$refs.BackListModalForm.downBtn = true
            this.$refs.BackListModalForm.show(res.data)
          }else{
            this.$message.warning(res.msg || '数据获取失败!')
          }
        })
      },
      changeRange(value, dateString){
        this.queryParam.createTimeStart = dateString[0]
        this.queryParam.createTimeEnd = dateString[1]
      },
      changePolicy(value, dateString){
        this.queryParam.policyStart = dateString[0]
        this.queryParam.policyEnd = dateString[1]
      },
      //导出办理
      exportHandle:function(){
        this.$refs.dispatchApplyExportModal.title = '导出明细'
        this.$refs.dispatchApplyExportModal.url.exportXlsUrl = this.url.exportXlsUrl
        this.$refs.dispatchApplyExportModal.params = this.getQueryParams()//查询条件
        this.$refs.dispatchApplyExportModal.add(this.selectedRowKeys)
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.DispatchApplyDetailForm.title = '详情'
        this.$refs.DispatchApplyDetailForm.statusName = filterDictText(this.statusOptions, record.status)
        this.$refs.DispatchApplyDetailForm.buyTypeName = filterDictText(this.buyTypeOptions,record.buyType)
        this.$refs.DispatchApplyDetailForm.settleType = filterDictText(this.settleTypeOptions, record.settleType)
        // this.$refs.DispatchApplyDetailForm.settleDomainBelongs = this.settleDomainOptions
        this.$refs.DispatchApplyDetailForm.edit(record)
      },
      moment,
      disabledStartDate (startValue) {
        const endValue = this.queryParam.createTimeEnd;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
      },
      disabledStartDate1 (startValue) {
        const endValue = this.queryParam.policyEnd1;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
      },
      changePolicyStart(val){
        this.queryParam.policyStart = val.format("YYYY-MM-DD")
      },
      changePolicyEnd(val){
        this.queryParam.policyEnd = val.format("YYYY-MM-DD")
      },
      disabledEndDate (endValue) {
        const startValue = this.queryParam.createTimeStart;
        if (!endValue || !startValue) {
          return false;
        }
        return startValue.valueOf() >= endValue.valueOf();
      },
      disabledEndDate1 (endValue) {
        const startValue = this.queryParam.policyStart1;
        if (!endValue || !startValue) {
          return false;
        }
        return startValue.valueOf() >= endValue.valueOf();
      },
      handleStartOpenChange (open) {
        if (!open) {
          this.endOpen = true;
        }
      },
      handleStartOpenChange1 (open) {
        if (!open) {
          this.endOpen1 = true;
        }
      },
      handleEndOpenChange (open) {
        this.endOpen = open;
      },
      handleEndOpenChange1 (open) {
        this.endOpen1 = open;
      },
      // 导入
      beforeUpload(file) {
        this.fileList = [file]
        return false
      },
      //单个文件上传
      handleImport(url, method) {
        this.importUrl = url
        this.importMethod = method
        const { fileList } = this
        const formData = new FormData()
        fileList.forEach(file => {
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
          // 去除空格 最后的空格行
          const newData = handleImportData(data[sheetName])
          //数据转换
          const allData = newData.reduce((acc,items)=>{
              const obj = {}
              obj['id']= items['ID']
              obj['useStatus']= items['出险状态']=='未出险'?'0':items['出险状态']=='已出险'?'1':''
              acc.push(obj)
              return acc
          },[])
          const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
          const requestTimeOut = 600000 // 请求过期时间
          httpActionHeader(
            this.importUrl,
            JSON.stringify(allData),
            this.importMethod,
            contextType,
            requestTimeOut
          ).then(res => {
            const msg = res.message || res.msg
            if (res.code === 200) {
              if (res.errorMessageList && res.errorMessageList.length) {
                this.$refs.errorModal.title = `导入提示: ${msg}`
                this.$refs.errorModal.message = msg
                this.$refs.errorModal.showModal(res.errorMessageList)
                return false
              }
              this.$message.success(msg)
              this.loadData()
            } else {
              if (res.data != null && res.data.length > 0) {
                this.$refs.errorModal.title = `导入提示: ${msg}`
                this.$refs.errorModal.message = msg
                this.$refs.errorModal.showModal(res.data)
              } else {
                this.$message.error(msg)
              }
            }
          })
        } catch (e) {
          // console.log(e)
          // 这里可以抛出文件类型错误不正确的相关提示
          this.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
    },
      // 数据字典
      initDictConfig() {
        initDictOptions('insurance_buyType').then((res) => {
          if (res.code === 200) {
            this.buyTypeOptions = res.data
          }
        });
        //结算类型
        initDictOptions('settlementType').then((res) => {
          if (res.code === 200) {
            this.settleTypeOptions = res.data
          }
        });
        // 状态
        initDictOptions('Insurance_record_status').then((res) => {
          if (res.code === 200) {
            this.statusOptions = res.data
          }
        });
        //替换状态
        initDictOptions('insurance_replace_status').then((res) => {
          if (res.code === 200) {
            this.replaceStatusOptions = res.data
          }
        });
      },
    }
  }
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.ant-card-body .table-operator {
  margin-bottom: 18px;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}

.ant-btn-danger {
  background-color: #ffffff;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}
.formLabel {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
