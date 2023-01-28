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
                v-model="queryParam.employeeName"
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
                v-model="queryParam.employeeIdCard"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="审核状态">
              <a-select
                placeholder="请选择审核状态"
                v-model="queryParam.auditStatus"
              >
                <a-select-option value="0">待审核</a-select-option>
                <a-select-option value="1">审核通过</a-select-option>
                <a-select-option value="2">审核不通过</a-select-option>
              </a-select>
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
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleAudit(record,0)">查看</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tproveapply_audit'"
            v-if="record.auditStatus == 0"
          />
          <a
            v-has="'wxhr:tproveapply_audit'"
            v-if="record.auditStatus == 0"
            @click="handleAudit(record,1)"
          >审核</a>
        </span>

        <span
          slot="applyDate"
          slot-scope="text, record"
        >
          {{ record.startMonth }} ~ {{ record.endMonth }}
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 弹出框 -->
    <prove-audit-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></prove-audit-modal>
  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  // import { getSettleDomainSelectVos } from '@/api/api'
  import ProveAuditModal from './modules/ProveAuditModal'
  

  export default {
    name: 'ProveAudit',
    mixins: [JeecgListMixin],
    components:{
      ProveAuditModal,
    },
    data() {
      return {
        description: '证明审核',
        statusOption:['待审核','通过','不通过'],
        sumTypeOption:['实发平均','应发平均'],
        // 表头
        columns: [
          {
            title: '姓名',
            align: 'center',
            dataIndex: 'employeeName',
          },
          {
            title: '身份证号',
            align: 'center',
            dataIndex: 'employeeIdCard',
          },
          {
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDomainName',
          },
          {
            title: '工资证明时间',
            align: 'center',
            scopedSlots: { customRender: 'applyDate' },
          },
          {
            title: '计算类型',
            align: 'center',
            dataIndex: 'sumType',
            customRender: (text) => {
              return this.sumTypeOption[text]
            }
          },
          {
            title: '实际工资',
            align: 'center',
            dataIndex: 'salary',
          },
          {
            title: '证明工资',
            align: 'center',
            dataIndex: 'proveSalary',
          },
          {
            title: '申请人',
            align: 'center',
            dataIndex: 'creatUserName',
          },
          {
            title: '申请时间',
            align: 'center',
            dataIndex: 'creatDate',
          },
          {
            title: '审核人',
            align: 'center',
            dataIndex: 'auditUserName',
          },
          {
            title: '审核时间',
            align: 'center',
            dataIndex: 'auditDate',
          },
          {
            title: '审核状态',
            align: 'center',
            dataIndex: 'auditStatus',
            customRender: (text) => {
              return this.statusOption[text]
            }
          },
          {
            title: '申请理由',
            align: 'center',
            dataIndex: 'applyReason',
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrBase/salaryProve/proveApplyPage',
        },
      }
    },
    methods: {
      // 审核
      handleAudit(record,isShow) {
        this.$refs.modalForm.show(record,isShow)
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
</style>
