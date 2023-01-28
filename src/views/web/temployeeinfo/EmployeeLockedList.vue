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
            <a-form-item label="申请人员">
              <a-input
                placeholder="请输入申请人员"
                v-model="queryParam.apllyUserName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="起始时间">
              <a-date-picker
                style="width: 100%"
                placeholder="请选择起始时间查询"
                format="YYYY-MM-DD HH:mm:ss"
                v-model="queryParam.dateTemp"
                @change="handleTimeBeginChange"
                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="截止时间">
              <a-date-picker
                style="width: 100%"
                placeholder="请选择截止时间查询"
                format="YYYY-MM-DD HH:mm:ss"
                v-model="queryParam.dateTemp1"
                @change="handleTimeEndChange"
                :showTime="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }"
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

    <div class="table-operator">
      <!-- 批量办理公积金 -->
      <a-dropdown 
        :disabled="selectedRowKeys.length > 0?false:true"
      >
        <a-button
          type="primary"
          icon="plus"
          @click="handleBatchLockVerification"
        >批量审核</a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{x: 1}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">详情</a>
          <a-divider
            v-if="record.applyStatus == 0"
            type="vertical"
            v-has="'wxhr:temployeeinfo_unLockAudit'"
          />
          <a
            v-if="record.applyStatus == 0"
            @click="handleVerify(record)"
            v-has="'wxhr:temployeeinfo_unLockAudit'"
          >审核</a>
          <a-divider
            v-if="record.applyStatus == 0"
            type="vertical"
            v-has="'wxhr:temployeeinfo_unLockAuditDelegate'"
          />
          <a
            v-if="record.applyStatus == 0"
            @click="handleDelegateVerify(record)"
            v-has="'wxhr:temployeeinfo_unLockAuditDelegate'"
          >委派审核</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <employee-unlock-detail-modal
      ref="employeeUnlockDetailModal"
      @ok="modalFormOk"
    ></employee-unlock-detail-modal>
    <employee-unlocking-audit-modal
      ref="employeeUnlockingAuditModal"
      @ok="modalFormOk"
    ></employee-unlocking-audit-modal>
    <employee-delegate-unlocking-audit-modal
      ref="employeeDelegateUnlockingAuditModal"
      @ok="modalFormOk"
    ></employee-delegate-unlocking-audit-modal>
    <audit-process-modal ref="auditProcessModal"></audit-process-modal>

  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import AuditProcessModal from './modules/AuditProcessModal'
  import EmployeeUnlockDetailModal from './modules/EmployeeUnlockDetailModal'
  import EmployeeUnlockingAuditModal from './modules/EmployeeUnlockingAuditModal'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import EmployeeDelegateUnlockingAuditModal from './modules/EmployeeDelegateUnlockingAuditModal'

  export default {
    name: 'EmployeeLockedList',
    mixins: [JeecgListMixin],
    components: {
      AuditProcessModal,
      EmployeeUnlockDetailModal,
      EmployeeUnlockingAuditModal,
      EmployeeDelegateUnlockingAuditModal,
    },
    data() {
      return {
        description: '解锁审核列表',
        filterDictText,
        // 枚举字段
        dateFormat: "YYYY-MM-DD HH:mm:ss",  // 时间格式化
        nextUserIdOptions: [],  // 审核人
        auditReasonOptions: [], // 解锁审核不同意原因
        unlockReasonOptions: [], // 解锁原因
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        applyStatusOptions: {
          '0': {'option': '等待审核', 'color': 'cyan'},
          '1': {'option': '审核通过', 'color': 'green'},
          '2': {'option': '审核退回', 'color': 'red'}
        },
        // 表头
        columns: [
          {
            width: 80,
            ellipsis: true,
            title: '申请人员',
            align: 'center',
            dataIndex: 'apllyUserName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 250,
            ellipsis: true,
            title: '解锁原因',
            align: 'center',
            dataIndex: 'unlockReason',
            customRender:(text) => {
              const str = filterDictText(this.unlockReasonOptions, text)
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 270,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDomainName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '员工姓名',
            align: 'center',
            dataIndex: 'empName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcard',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '审核状态',
            align: 'center',
            dataIndex: 'applyStatus',
            customRender:(text) => {
              const color = this.applyStatusOptions.hasOwnProperty(text) ? this.applyStatusOptions[text].color : 'blue'
              const str = this.applyStatusOptions.hasOwnProperty(text) ? this.applyStatusOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 220,
            ellipsis: true,
            title: '申请时间',
            align: 'center',
            dataIndex: 'applyTime',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrBase/tunlockapplyinfo/pageByOperator?applyStatus=0',
          auditProcessUrl: 'hrBase/tunlockauditinfo/getListByApplyId',
        },
      }
    },
    created() {
      // 获取权限的用户
      httpAction('admin/user/findUserBypPrmission?permissionStr=wxhr:temployeeinfo_unLockAudit', {}, 'GET').then((res) => {
        if (Number(res.code) === 200) {
          this.nextUserIdOptions = res.data
        } else {
          this.$message.error('审核人数据请求失败！')
        }
      })
    },
    methods: {
      // 详情
      handleDetail: function(record) {
        this.$refs.employeeUnlockDetailModal.title = '申请详情'
        this.$refs.employeeUnlockDetailModal.applyStatusBelongs = this.applyStatusOptions
        this.$refs.employeeUnlockDetailModal.unlockReasonBelongs = this.unlockReasonOptions
        if (this.unlockReasonOptions.length > 0) {
          this.$refs.employeeUnlockDetailModal.edit(record, this.url.auditProcessUrl)
        } else {
          if (this.unlockReasonOptions.length === 0) {
            this.$message.error(`"解锁原因"${this.loadMessage}`)
          }
        }
      },
      // 解锁审核
      handleVerify: function(record) {
        this.$refs.employeeUnlockingAuditModal.title = '解锁审核'
        this.$refs.employeeUnlockingAuditModal.unlockApplyId = record.id
        this.$refs.employeeUnlockingAuditModal.auditReasonBelongs = this.auditReasonOptions
        this.$refs.employeeUnlockingAuditModal.isBatch = 0
        
        if (this.auditReasonOptions.length > 0) {
          this.$refs.employeeUnlockingAuditModal.add()
        } else {
          if (this.auditReasonOptions.length === 0) {
            this.$message.error(`"不同意原因"${this.loadMessage}`)
          }
        }
      },
      // 批量审核
      handleBatchLockVerification() {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        }
        let ids = ""
        for (let a = 0; a < this.selectedRowKeys.length; a++) {
          if (a == this.selectedRowKeys.length - 1) {
            ids += this.selectedRowKeys[a]
          } else {
            ids += this.selectedRowKeys[a] + ','
          }
        }
        this.$refs.employeeUnlockingAuditModal.title = '解锁审核'
        this.$refs.employeeUnlockingAuditModal.unlockApplyId = ids
        this.$refs.employeeUnlockingAuditModal.auditReasonBelongs = this.auditReasonOptions
        this.$refs.employeeUnlockingAuditModal.isBatch = 1
        if (this.auditReasonOptions.length > 0) {
          this.$refs.employeeUnlockingAuditModal.add()
        } else {
          if (this.auditReasonOptions.length === 0) {
            this.$message.error(`"不同意原因"${this.loadMessage}`)
          }
        }
      },
      // 委派审核
      handleDelegateVerify: function(record) {
        this.$refs.employeeDelegateUnlockingAuditModal.id = record.id
        this.$refs.employeeDelegateUnlockingAuditModal.title = '委派审核'
        this.$refs.employeeDelegateUnlockingAuditModal.nextUserIdBelongs = this.nextUserIdOptions
        if (this.nextUserIdOptions.length > 0) {
          this.$refs.employeeDelegateUnlockingAuditModal.add()
        } else {
          if (this.nextUserIdOptions.length === 0) {
            this.$message.error(`"审核人"${this.loadMessage}`)
          }
        }
      },
      // 起始时间选择
      handleTimeBeginChange(date) {
        // 时间格式化
        this.queryParam.applyTime_begin = date ? (date.format(this.dateFormat)) : null
      },
      // 截止时间选择
      handleTimeEndChange(date) {
        // 时间格式化
        this.queryParam.applyTime_end = date ? (date.format(this.dateFormat)) : null
      },
      // 数据字典
      initDictConfig() {
        // 解锁原因
        initDictOptions('unlock_reason').then((res) => {
          if (Number(res.code) === 200) {
            this.unlockReasonOptions = res.data
          }
        })
        // 解锁审核不同意原因
        initDictOptions('audit_reason').then((res) => {
          if (Number(res.code) === 200) {
            this.auditReasonOptions = res.data
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
.range-picker-new-style {
  :global(.ant-calendar-range-picker-input) {
    font-size: 13px;
  }
}
</style>
