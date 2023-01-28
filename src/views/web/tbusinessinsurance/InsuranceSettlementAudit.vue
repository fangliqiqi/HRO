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
            <a-form-item label="结算主体">
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :id="'id'"
                :placeholder="'请输入结算主体'"
                v-model="queryParam.departId"
              ></select-page>
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
          
          <!-- <a-col
            :md="5"
            :sm="7"
          >
            <a-form-item label="状态">
              <a-select
                v-model="queryParam.status"
                placeholder="请选择状态"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option
                  v-for="(item, index) in statusOptions"
                  :key="index"
                  :value="item.value"
                  v-if="item.value == 1 || item.value == 3"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->

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
          slot="settlementAmount"
          slot-scope="text"
        >
          <a-tag color="orange">{{ text }}</a-tag>
        </span>
        <span
          slot="settlementMonth"
          slot-scope="text"
        >
          <a-tag color="cyan">{{ text }}</a-tag>
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleDetail(record)"
            v-has="'wxhr:settlementform_detail'"
          >查看</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:settlementform_detail'"
            v-if="record.status == 1 || 5"
          />
          <a
            @click="handleAudit(record)"
            v-has="'wxhr:settlementform_audit'"
            v-if="record.status == 1 || 5"
          >审核</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <settlement-audit-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></settlement-audit-modal>
    <error-modal ref="errorModal"></error-modal>
    <assignment-modal
      ref="AssignmentModalForm"
      @ok="modalFormOk"
    ></assignment-modal>
    <insurance-settlement-apply-detail-modal ref="InsuranceSettlementApplyDetailForm"></insurance-settlement-apply-detail-modal>
  </a-card>
</template>

<script>
  import ErrorModal from './modules/ErrorModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import JMonth from '@/components/jeecg/JMonth'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { httpAction } from '@/api/manage'
  import SettlementAuditModal from './modules/SettlementAuditModal'
  import AssignmentModal from './modules/AssignmentModal' //委托办理
  import InsuranceSettlementApplyDetailModal from './modules/InsuranceSettlementApplyDetailModal'

  export default {
    name: 'InsuranceSettlementAudit',
    mixins: [JeecgListMixin],
    components: {
      AssignmentModal,
      SettlementAuditModal,
      InsuranceSettlementApplyDetailModal,
      JMonth,
      SelectPage,
      ErrorModal
    },
    data() {
      return {
        description: '商险单独结算审核',
        statusOptions: [],
        payTypeOptions:[], //商险结算付款方式
        settleTypeOptions:[],
        flag:['未到账','已到账'],
        color:['orange','#e08d33','cyan','green','red','blue','#72bd4d','#f1a95c','##ffc107','##aeec94'],
        // 表头
        columns: [
           {
            title: '到账情况',
            align: 'center',
            dataIndex: 'accountReceiveFlag',
            customRender: (text) => {
              return this.flag[text]
            }
          },
          {
            title: '结算主体编码',
            align: 'center',
            dataIndex:'departNo'
          },
          {
            title: '结算主体名称',
            align: 'center',
            dataIndex: 'departName'
          },
          {
            title: '结算金额',
            align: 'center',
            dataIndex: 'settlementAmount',
            scopedSlots: { customRender: 'settlementAmount' },
          },
          {
            title: '结算月份',
            align: 'center',
            dataIndex: 'settlementMonth',
            scopedSlots: { customRender: 'settlementMonth' },
          },
          {
            title: '差额比对',
            align: 'center',
            dataIndex: 'balanceCompare'
          },
          {
            title: '部门余额',
            align: 'center',
            dataIndex: 'balance'
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '创建人',
            align: 'center',
            dataIndex: 'createUser'
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/tinsurancesettlementform/audit/page?status=1',
          queryAllInfoById: '/busiInsurance/tinsurancesettlementform/getVo/',
          submitUrl:'/busiInsurance/tinsurancesettlementform/submit'
        }
      }
    },
    methods: {
      filterDictText,
      // 审核
      handleAudit: function(record) {
        this.$refs.modalForm.title = '商险单独结算审核'
        this.$refs.modalForm.insuranceSettlementFormId = record.id
        this.$refs.modalForm.type = 'settlement'
        this.$refs.modalForm.edit()
      },
      // 查看
      handleDetail(record){
        this.$refs.InsuranceSettlementApplyDetailForm.title = '详情'
        httpAction(this.url.queryAllInfoById+record.id, '','GET').then((res) => {
          if(res.code===200){
            // 商险结算单
            this.$refs.InsuranceSettlementApplyDetailForm.insuranceBill = res.data.insuranceBill
            this.$refs.InsuranceSettlementApplyDetailForm.settleTypeOptions = this.settleTypeOptions
            // 商险派单信息表
            this.$refs.InsuranceSettlementApplyDetailForm.businessInsuranceVos = res.data.businessInsuranceVos || []
            this.$refs.InsuranceSettlementApplyDetailForm.settleDomain = res.data.departName
            this.$refs.InsuranceSettlementApplyDetailForm.departNo = res.data.departNo
            if(res.data.insuranceSettlementCover.length){
              for(const [index, val] of res.data.insuranceSettlementCover.entries()){
                res.data.insuranceSettlementCover[index].payType = filterDictText(this.payTypeOptions,val.payType)
              }
            }
            //封面信息
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
            this.$refs.InsuranceSettlementApplyDetailForm.isCanModifyInvoiceNo = true
            this.$refs.InsuranceSettlementApplyDetailForm.insuranceSettlementCover = res.data.insuranceSettlementCover
            //明细
            this.$refs.InsuranceSettlementApplyDetailForm.detail = {
              id:record.id,
              settlementMonth:res.data.settlementMonth,
              departName:res.data.departName,
              departNo:res.data.departNo,
              createUser:res.data.createUser,
              createTime:res.data.createTime,
              remark:res.data.remark,
              settlementAmountSum:res.data.insuranceBill.settlementAmountSum || null,
              ticketAmountSum:res.data.insuranceBill.ticketAmountSum || null,
              settlementDate:res.data.insuranceBill.settlementDate || null,
            }
            this.$refs.InsuranceSettlementApplyDetailForm.show(res.data)
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      // 提交
      handleDelegate: function(record) {
        const _this = this
        this.$confirm({
          content: '确认提交？',
          onOk() {
            httpAction(_this.url.submitUrl,{id:record.id},'put').then(res=>{
              if(res.code == 200){
                _this.$message.success('提交成功！')
                _this.loadData()
              }else{
                _this.$message.warning(res.msg)
              }
            })
          },
        })
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      // 数据字典
      initDictConfig() {
        // 状态
        initDictOptions('insurance_settle_status').then((res) => {
          if (res.code === 200) {
            this.statusOptions = res.data
          }
        });
        // 付款方式
        initDictOptions('insurance_payType').then((res) => {
          if (res.code === 200) {
            this.payTypeOptions = res.data
          }
        });
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
.formLabel {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
