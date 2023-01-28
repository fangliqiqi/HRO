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
            <a-form-item label="垫付编号">
              <a-input
                placeholder="垫付编号"
                allowClear
                v-model="queryParam.advancePaymentNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户名称">
              <a-input
                placeholder="客户名称"
                v-model="queryParam.customerName"
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
                :placeholder="'请输入结算主体'"
                v-model="queryParam.settleDomainId"
                :id="'id'"
              ></select-page>
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
        :scroll="{ x: 1500 }"
        @change="handleTableChange"
      >
        <span
          slot="customerName"
          slot-scope="text,record"
        >
          <span
            style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;"
            :title="record.customerName"
          >
            {{ record.customerName }}
          </span>
        </span>

        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleAudit(record)"
            v-has="'wxhr:tpaymentapprovalrecord_audit'"
          >审核</a>
        </span>

        <span
          slot="moutsourcingItemVos"
          slot-scope="text, record"
        >
          <a-tag
            v-for="(item,index) in record.moutsourcingItemVos"
            :key="index"
            :color="color[index]"
          >{{ item.itemName }}</a-tag>
        </span>

        <span
          slot="customerType"
          slot-scope="text,record"
        >
          <a-tag color="green">{{ filterDictText(customerTypeDicts, record.customerType) }}</a-tag>
        </span>
        <span
          slot="advanceType"
          slot-scope="text,record"
        >
          <a-tag color="cyan">{{ filterDictText(advanceTypeDicts, record.advanceType) }}</a-tag>
        </span>
        <span
          slot="advanceNotPayback"
          slot-scope="text,record"
        >
          <a-tag
            v-if="record.advanceNotPayback == 0"
            color="green"
          >{{ numFormat(record.advanceNotPayback) }}</a-tag>
          <a-tag
            v-else-if="record.advanceNotPayback < 0"
            color="red"
          >{{ numFormat(record.advanceNotPayback) }}</a-tag>
        </span>
        <span
          slot="advanceMoney"
          slot-scope="text,record"
        >
          <a-tag
            v-if="record.advanceMoney < 100000"
            color="green"
          >{{ numFormat(record.advanceMoney) }}</a-tag>
          <a-tag
            v-else
            color="red"
          >{{ numFormat(record.advanceMoney) }}</a-tag>
        </span>

        <span
          slot="customerName"
          slot-scope="text,record"
        >
          <span
            style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;"
            :title="record.customerName"
          >
            {{ record.customerName }}
          </span>
        </span>

        <span
          slot="settleDate"
          slot-scope="text,record"
        >
          <a-tag
            v-if="record.settleDate == null"
            color="red"
          >未结算</a-tag>
          <span v-if="record.settleDate != null">{{ record.settleDate }}</span>
        </span>

        <span
          slot="auditStatus"
          slot-scope="text, record"
        >
          <div @click="showProcess(record)">
            <a-tag
              v-if="record.auditStatus == 0"
              color="cyan"
            >待提交</a-tag>
            <a-tag
              v-if="record.auditStatus == 1"
              color="orange"
            >待审核</a-tag>
            <a-tag
              v-if="record.auditStatus == 2"
              color="green"
            >审核通过</a-tag>
            <a-tag
              v-if="record.auditStatus == 3"
              color="red"
            >审核不通过</a-tag>
            <a-tag
              color="#969494"
              v-if="record.auditStatus == 4"
            >已作废</a-tag>
          </div>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <advance-payment-audit-module
      ref="advancePaymentAuditModal"
      @ok="modalFormOk"
    ></advance-payment-audit-module>
    <process-audit-module ref="processModal"></process-audit-module>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction } from '@/api/manage'
import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
import { numFormat } from '@/utils/util'
import AdvancePaymentAuditModule from './modules/AdvancePaymentAuditModule'
import ProcessAuditModule from './modules/ProcessAuditModule'
import SelectPage from '@/components/jeecg/SelectPage'

export default {
  name: 'AdvancePaymentAuditList',
  mixins: [JeecgListMixin],
  components: {
    AdvancePaymentAuditModule,
    ProcessAuditModule,
    SelectPage
  },
  data() {
    return {
      loading: false,
      //字典数组缓存
      customerTreeData: [],
      color: ['pink','red','orange','green','cyan','blue','purple'],
      sysUsers: [],
      customerTypeDicts: [],
      advanceTypeDicts: [],
      organs: [],
      bankOptions: [],
      // 表头
      columns: [
        {
          width: 140,
          ellipsis: true,
          title: '垫付编号',
          align: 'center',
          dataIndex: 'advancePaymentNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'customerName',
          scopedSlots: { customRender: 'customerName' }
        },
        {
          title: '结算主体名称',
          align: 'center',
          dataIndex: 'departName'
        },
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'departNo'
        },
        {
          title: '商务主体',
          align: 'center',
          dataIndex: 'applyUnitName'
        },
        {
          title: '申请人',
          align: 'center',
          dataIndex: 'createUser',
        },
        // {
        //   title: '垫付客户类型',
        //   align: 'center',
        //   dataIndex: 'customerType',
        //   scopedSlots: { customRender: 'customerType' }
        // },
        {
          title: '垫付类型',
          align: 'center',
          dataIndex: 'advanceType',
          scopedSlots: { customRender: 'advanceType' }
        },
        {
          title: '期望打款日期',
          align: 'center',
          dataIndex: 'applyAdvanceDate'
        },
        {
          title: '审核状态',
          align: 'center',
          dataIndex: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
        },
        {
          title: '本次已垫付未回款金额',
          align: 'center',
          dataIndex: 'advanceNotPayback',
          scopedSlots: { customRender: 'advanceNotPayback' }
        },
        {
          title: '结算金额',
          align: 'center',
          dataIndex: 'settleMoney',
          customRender: (text) => {
            return numFormat(text);
          }
        },
        {
          title: '开票金额',
          align: 'center',
          dataIndex: 'ticketMoney',
          customRender: (text) => {
            return numFormat(text);
          }
        },
        {
          title: '垫付金额',
          align: 'center',
          dataIndex: 'advanceMoney',
          scopedSlots: { customRender: 'advanceMoney' }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width:60,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/hrApproval/tadvancepayment/audit/page',
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        getSysUsers: '/admin/user/findWxUsers',
        getCustomerInfo: '/hrBase/tcustomerinfo/vo/',
        getSettleDomainInfo: '/hrBase/tsettledomain/vo/',
        getOrgan: '/admin/organizationinfo/getOrgForCus?type=1',
        getContractInfo: '/hrBase/tcustomercontract/',
        getAttaInfos: '/hrApproval/tpaymentattainfo/geteAttas/',
        approvalSubmit: '/hrApproval/tpaymentapprovalrecord/submit',
        process:'/hrApproval/tapproveauditinfo/getAllAuditInfo/',
        getDetail:'/hrApproval/tadvancepayment/',
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {
    this.getSysUsers();
    this.loadCustomerTreeData();
    this.loadOrgans();
  },
  methods: {
    filterDictText,
    numFormat,
    handleAudit(record) {
      this.$refs.advancePaymentAuditModal.title = '审核详情'
      this.$refs.advancePaymentAuditModal.customerTypeDicts = this.customerTypeDicts
      this.$refs.advancePaymentAuditModal.advanceTypeDicts = this.advanceTypeDicts
      this.$refs.advancePaymentAuditModal.bankOptions = this.bankOptions
      if(record.contractId){
        httpAction(this.url.getContractInfo + record.contractId, null, 'GET').then((res) => {
          if(res.data) {
            this.$refs.advancePaymentAuditModal.settleDomain.contractName = res.data.contractName;
            httpAction(this.url.getAttaInfos + record.id, null, 'GET').then((re) => {
              this.$refs.advancePaymentAuditModal.fileList = re.data;
              this.$refs.advancePaymentAuditModal.show(record);
            })
          }
        })
      }else{
        this.$refs.advancePaymentAuditModal.settleDomain.contractName = '-'
        httpAction(this.url.getAttaInfos + record.id, null, 'GET').then((re) => {
          this.$refs.advancePaymentAuditModal.fileList = re.data;
          this.$refs.advancePaymentAuditModal.show(record);
        })
      }
    },
    showProcess(record){ //查看流程
      httpAction(this.url.getDetail+record.id,null,'get').then(res=>{
        if(res.code == 200){
          this.$refs.processModal.show(record.id,res.data.oldProcesFlag)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    makeIncomeBelong(record) {
      console.log(record)
    },
    handleDetail(record) {
      console.log(record)
    },
    loadOrgans() {
      httpAction(this.url.getOrgan,'','GET').then((res) => {
        if(res.code === 200 && res.data.length > 0) {
          this.organs = res.data;
        }
      });
    },
    /**
     * 获取系统用户数据
     */
    getSysUsers() {
      httpAction(this.url.getSysUsers, null ,'GET').then((res) => {
        this.sysUsers = res.data;
      });
    },
    businessNewModalOk() {
      this.loadData();
    },
    auditModalOk() {
      this.loadData();
    },
    initDictConfig() {
      initDictOptions('ADVANCE_CUSTOMER_TYPE').then((res) => {
        if (res.code === 200) {
          this.customerTypeDicts = res.data;
        }
      });
      initDictOptions('ADVANCE_ADVANCE_TYPE').then((res) => {
        if (res.code === 200) {
          this.advanceTypeDicts = res.data;
        }
      });
      // 开户行
      initDictOptions('bank').then((res) => {
        if (res.code === 200) {
          this.bankOptions = res.data
        }
      })
    },
    /**
     * 加载客户单位树形结构
     */
    loadCustomerTreeData() {
      httpAction(this.url.getTreeData,null,'get').then((res) => {
        this.customerTreeData = res.data;
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
.ant-tag{
  cursor: pointer;
}
</style>
