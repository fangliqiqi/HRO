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
                :placeholder="'请输入结算主体'"
                :id="'id'"
                v-model="queryParam.settleDomainId"
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
            v-has="'wxhr:costapprovalrecord_audit'"
          >审核</a>

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
          </div>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <cost-audit-module
      ref="modalForm"
      @ok="modalFormOk"
    ></cost-audit-module>
    <process-audit-module ref="processModal"></process-audit-module>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import CostAuditModule from './modules/CostAuditModule'
import { httpAction } from '@/api/manage'
import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
import SelectPage from '@/components/jeecg/SelectPage'
import ProcessAuditModule from './modules/ProcessAuditModule'

export default {
  name: 'CostAudit',
  mixins: [JeecgListMixin],
  components: {
    CostAuditModule,
    SelectPage,
    ProcessAuditModule
  },
  data() {
    return {
      loading: false,
      fromTypeOption: [], //来源类型
      color: ['pink','red','orange','green','cyan','blue','purple'],
      auditOption:['待提交','待审核','审核通过','审核不通过'],
      // 表头
      columns: [
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'customerName',
          scopedSlots: { customRender: 'customerName' }
        },
        {
          title: '结算主体',
          align: 'center',
          dataIndex: 'departName',
        },
        {
          title: '成本名称',
          align: 'center',
          dataIndex: 'costName'
        },
        {
          title: '成本金额',
          align: 'center',
          dataIndex: 'costAmount',
        },
        {
          title: '申请单位',
          align: 'center',
          dataIndex: 'applyUnitName'
        },
        {
          title: '申请人',
          align: 'center',
          dataIndex: 'applyUser',
        },
        {
          title: '申请时间',
          align: 'center',
          dataIndex: 'applyDate'
        },
        {
          title: '审批状态',
          align: 'center',
          dataIndex: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/hrApproval/tcostinfo/audit/page',
        getDetail:'/hrApproval/tcostinfo/',
        process:'/hrApproval/tapproveauditinfo/getAllAuditInfo/'
      }
    }
  },
  methods: {
    
    handleAudit(record) {
      this.$refs.modalForm.title = '审核'
      httpAction(this.url.getDetail + record.id, null, 'GET').then((res) => {
        if(res.code == 200 && res.data) {
          res.data.fromTypeName = filterDictText(this.fromTypeOption,record.fromType)
          this.$refs.modalForm.show(res.data);
        }
      })
    },
    showProcess(record){ //查看流程
      httpAction(this.url.process+record.id,null,'get').then((res)=>{
        if(res.code == 200){
          this.$refs.processModal.show(res.data) 
        }else{
          this.$message.warning(res.msg)
        }
      })
    },

    initDictConfig() {
      initDictOptions('COST_APPROVAL_FROM_TYPE').then((res) => {
        if (res.code === 200) {
          this.fromTypeOption = res.data
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
</style>
