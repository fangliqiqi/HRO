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
            <a-form-item label="结算月份">
              <j-month
                placeholder="请选择结算月份"
                v-model="queryParam.settlementMonth"
                date-format="YYYYMM"
              ></j-month>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算金额">
              <a-input
                placeholder="请输入结算金额"
                v-model="queryParam.settlementAmount"
              />
            </a-form-item>
          </a-col>
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
        @click="exportHandle"
        v-has="'wxhr:settlementautoform_export'"
      >导出</a-button>
    </div>
    <!-- table区域-begin -->
    <div>
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
          slot="status"
          slot-scope="text"
        >
          <a-tag :color="color[text]">{{ filterDictText(statusOptions, text) }}</a-tag>
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleAudit(record)"
            v-has="'wxhr:auto_settlementform_audit'"
            v-if="record.status == 1"
          >审核</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:insurance_scan_detail'"
            v-if="record.status == 1"
          />
          <a
            @click="handleDetail(record)"
            v-has="'wxhr:insurance_scan_detail'"
          >查看</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <settlement-audit-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></settlement-audit-modal>
    <insurance-scan-detail-modal ref="InsuranceScanDetailForm"></insurance-scan-detail-modal>
    <dispatch-apply-export-modal
      ref="DispatchApplyExportModal"
      @ok="modalFormOk"
    ></dispatch-apply-export-modal>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import JMonth from '@/components/jeecg/JMonth'
  import SettlementAuditModal from './modules/SettlementAuditModal'
  import InsuranceScanDetailModal from './modules/InsuranceScanDetailModal'
  import DispatchApplyExportModal from './modules/DispatchApplyExportModal' //导出办理
  import { httpAction } from '@/api/manage'

  export default {
    name: 'InsuranceScan',
    mixins: [JeecgListMixin],
    components: {
      SettlementAuditModal,
      JMonth,
      InsuranceScanDetailModal,
      DispatchApplyExportModal
    },
    data() {
      return {
        description: '商险扫描审核',
        statusOptions: [],
        settleTypeOptions:[], // 结算类型
        color:['orange','#e08d33','cyan','green','red','blue','#72bd4d','#f1a95c','##ffc107','##aeec94'],
        // 表头
        columns: [
          {
            title: '发票号',
            align: 'center',
            dataIndex: 'invoiceNo'
          },
          {
            title: '结算金额',
            align: 'center',
            dataIndex: 'settlementAmount',
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '结算月份',
            align: 'center',
            dataIndex: 'settlementMonth',
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/tinsurancesettlementautoform/page',
          queryAllInfoById:'/busiInsurance/tinsurancesettlementautoform/getVo/',
          exportFields:'/busiInsurance/tinsurancesettlementautoform/getExportFieldName',
          exportXlsUrl:'/busiInsurance/tinsurancesettlementautoform/scan/export'
        }
      }
    },
    methods: {
      filterDictText,
      // 导出
      exportHandle(){
        this.$refs.DispatchApplyExportModal.title = '商险扫描导出'
        this.$refs.DispatchApplyExportModal.url.exportFields = this.url.exportFields
        this.$refs.DispatchApplyExportModal.url.exportXlsUrl = this.url.exportXlsUrl
        this.$refs.DispatchApplyExportModal.type = 2
        this.$refs.DispatchApplyExportModal.params = this.getQueryParams()//查询条件
        this.$refs.DispatchApplyExportModal.add(this.selectedRowKeys)
      },
      // 审核
      handleAudit: function(record) {
        this.$refs.modalForm.title = '商险扫描件审核'
        this.$refs.modalForm.url.auditUrl = '/busiInsurance/tinsurancesettlementautoform/audit'
        this.$refs.modalForm.type = 'scan'
        this.$refs.modalForm.insuranceSettlementAutoFormId = record.id
        this.$refs.modalForm.edit()
      },
      // 查看
      handleDetail: function(record) {
        this.$refs.InsuranceScanDetailForm.title = '详情'
        httpAction(this.url.queryAllInfoById + record.id, '','GET',20000).then((res) => {
          if(res.code===200){
            // 商险派单信息表
            this.$refs.InsuranceScanDetailForm.settleTypeOptions = this.settleTypeOptions
            this.$refs.InsuranceScanDetailForm.businessInsuranceVos = res.data.businessInsuranceVos || []
            this.$refs.InsuranceScanDetailForm.forcastBusinessInsuranceVos = res.data.forcastBusinessInsuranceVos || []
            // settleFormType 0普通工资发放 1工程类工资发放2预估发放
            if(res.data.settleFormType == 1){ //1工程类工资发放
              this.$refs.InsuranceScanDetailForm.type = 1
              this.$refs.InsuranceScanDetailForm.statementBill = res.data.engineerSettlementDetailVo
            }else if(res.data.settleFormType == 2){ //2预估发放
              this.$refs.InsuranceScanDetailForm.type = 2
              this.$refs.InsuranceScanDetailForm.statementBill = res.data.forecastVo
            }else if(res.data.settleFormType == 0){ //0普通工资发放
              this.$refs.InsuranceScanDetailForm.type = 0
              this.$refs.InsuranceScanDetailForm.statementBill = res.data.salaryDetailVo
            }
            res.data.insuranceSettlementCover.map(item=>{
              const arr = []
              if(/,/.test(item.customerName)){
                const customerNameArr = item.customerName.split(',')
                const departNameArr = item.departName.split(',')
                customerNameArr.forEach((items,index)=>{
                  arr[index] = `${items}-${departNameArr[index]}`
                })
              }else{
                arr[0] = `${item.customerName}-${item.departName}`
              }
              item.customerArr = arr
              return item
            })
            //封面信息
            this.$refs.InsuranceScanDetailForm.isCanModifyInvoiceNo = true
            this.$refs.InsuranceScanDetailForm.insuranceSettlementCover = res.data.insuranceSettlementCover
            this.$refs.InsuranceScanDetailForm.payTypeOptions = this.payTypeOptions
            //明细
            this.$refs.InsuranceScanDetailForm.detail = {
              id:record.id,
              settlementMonth:res.data.settlementMonth,
              ticketAmountSum:res.data.ticketAmountSum,
              createUser:res.data.createUser,
              createTime:res.data.createTime,
            }
            this.$refs.InsuranceScanDetailForm.show(res.data)
          }else{
            this.$message.error(res.msg)
          }

        })
      },
      // 数据字典
      initDictConfig() {
        // 状态
        initDictOptions('insurance_settle_status').then((res) => {
          if (res.code === 200) {
            this.statusOptions = res.data
          }
        })
        initDictOptions('insurance_payType').then((res) => {
          if (res.code === 200) {
            this.payTypeOptions = res.data
          }
        })
        //结算类型
        initDictOptions('settlementType').then((res) => {
          if (res.code === 200) {
            this.settleTypeOptions = res.data
          }
        })
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
</style>
