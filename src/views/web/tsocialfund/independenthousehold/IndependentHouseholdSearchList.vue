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
            <a-form-item label="单位名称">
              <select-page
                :id="'id'"
                :title="'customerName'"
                placeholder="请选择单位名称查询"
                v-model="queryParam.unitId"
                :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <select-page
                :id="'id'"
                :title="'departName'"
                placeholder="请选择结算主体查询"
                v-model="queryParam.departId"
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算月份">
              <a-month-picker
                allowClear
                placeholder="请选择结算月份查询"
                v-model="queryParam.orderDate"
                style="width: 100%"
                format="YYYYMM"
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
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">详情</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <bill-apply-modal
      ref="billApplyModal"
      @ok="modalFormOk"
    ></bill-apply-modal>
    <bill-detail-modal
      ref="billDetailModal"
      @ok="modalFormOk"
    ></bill-detail-modal>
    <error-modal ref="errorModal"></error-modal>

  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { getUnitSelectVos } from '@/api/api'
  import BillApplyModal from './modules/BillApplyModal'
  import BillDetailModal from './modules/BillDetailModal'
  import SelectPage from '@/components/jeecg/SelectPage'
  import ErrorModal from '../../global/modules/ErrorModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: 'IndependentHouseholdSearchList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      SelectPage,
      BillApplyModal,
      BillDetailModal,
    },
    data() {
      return {
        description: '预估账单查询',
        // 枚举字段
        employData: [], // 创建人员
        unitOptions: [], // 单位和结算主体
        invoiceTypeOptions: {'0': {'option': '专票', 'color': 'green'}}, // 发票类型
        statusOptions: {'0': {'option': '待提交', 'color': 'blue'}, '1': {'option': '待审核', 'color': 'orange'}, '2': {'option': '审核未通过', 'color': 'red'}, '3': {'option': '已结算', 'color': 'green'}},
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        // excel表头数据
        exportFields: [],
        // 表头
        columns: [
          {
            width: 230,
            ellipsis: true,
            title: '单位名称',
            align: 'center',
            dataIndex: 'unitName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 230,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'departName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '管理费',
            align: 'center',
            dataIndex: 'billFee',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '开票金额',
            align: 'center',
            dataIndex: 'ticketFee',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '结算月份',
            align: 'center',
            dataIndex: 'orderDate',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            customRender:(text) => {
              const color = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].color : 'blue'
              const str = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 80,
            ellipsis: true,
            align: 'center',
            title: '创建人员',
            dataIndex: 'createUser',
            customRender:(text) => {
              const Str = ((Object.keys(this.employData).length) && (this.employData).hasOwnProperty(text)) ? (this.employData)[text] : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 170,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrSocial/tforecastoneselfform/page', // 列表
          delete: 'hrSocial/tforecastoneselfform/',  // 删除
          queryAllInfoById: 'hrSocial/tforecastoneselfform/selectForecastOneselfFormAllInfoById', // 详情
          auditProcessUrl: 'hrSocial/tauditinfo/getAuditInfoByIdAndType',  // 流程进展明细
        },
      }
    },
    created() {
      // 获取登录用户拥有结算主体权限的单位信息（包含结算主体）
      getUnitSelectVos().then((res) => {
        if (res.code === 200) {
          this.unitOptions = res.data
        } else {
          this.$message.error('单位信息数据请求失败！')
        }
      })
      // 创建人员数据
      httpAction('/admin/user/userDic', '', 'GET').then((res) => {
        if (Number(res.code) === 200) {
          this.employData = res.data
        } else {
          this.$message.error('认领人员数据请求失败！')
        }
      })
    },
    methods: {
      // 详情
      handleDetail: function(record) {
        this.$refs.billDetailModal.title = '结算单详情'
        this.$refs.billDetailModal.invoiceTypeOptions = this.invoiceTypeOptions
        httpAction(`${this.url.queryAllInfoById}?id=${record.id}`, {}, 'GET').then((res) => {
          if (Number(res.code) === 200 && res.data) {
            this.$refs.billDetailModal.edit(res.data, this.url.auditProcessUrl)
          } else {
            this.$message.error('数据请求失败！')
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

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
