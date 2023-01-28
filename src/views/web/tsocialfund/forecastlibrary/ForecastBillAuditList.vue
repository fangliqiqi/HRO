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
            <a-form-item label="账单日期">
              <a-month-picker
                allowClear
                placeholder="请选择账单日期查询"
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
          <a
            v-if="record.status==3"
            @click="handleAudit(record)"
            v-has="'wxhr:tforecastform_audit'"
          >审核</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <forecast-bill-detail-modal
      ref="forecastBillDetailModal"
      @ok="modalFormOk"
    ></forecast-bill-detail-modal>
    <error-modal ref="errorModal"></error-modal>

  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import ErrorModal from '../../global/modules/ErrorModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import { getUnitSelectVos } from '@/api/api'
  import ForecastBillDetailModal from './modules/ForecastBillDetailModal'

  export default {
    name: 'ForecastBillAuditList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      SelectPage,
      ForecastBillDetailModal,
    },
    data() {
      return {
        description: '预估账单审核',
        // 枚举字段
        settleDomainDisabled: true,  // 结算主体不可选择
        buyTypeOptions: [], // 购买类型
        nextUserIdOptions: [],  // 下一步审核人
        settleTypeOptions: [],  // 结算类型
        settleDomainItems: [],  // 结算主体数组
        settleDomainOptions: {},  // 结算主体和所属单位
        unitOptions: [], // 单位和结算主体
        dateFormat: 'YYYYMM', // 时间格式化
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        statusOptions: {
          '0': {'option': '未提交', 'color': 'blue'},
          '1': {'option': '审核不通过', 'color': 'red'},
          '2': {'option': '客户已确认', 'color': 'cyan'},
          '3': {'option': '待审核', 'color': 'orange'},
          '4': {'option': '已审核', 'color': 'green'}
        },

        // excel表头数据
        exportFields: [],
        // 表头
        columns: [
          {
            width: 180,
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
            width: 165,
            ellipsis: true,
            title: '客户编码',
            align: 'center',
            dataIndex: 'unitNo',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
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
            width: 165,
            ellipsis: true,
            title: '结算主体编码',
            align: 'center',
            dataIndex: 'departNo',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '账单月份',
            align: 'center',
            dataIndex: 'orderDate',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '结算金额',
            align: 'center',
            dataIndex: 'billFee',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '到账状态',
            align: 'center',
            dataIndex: 'matchSort',
            customRender:(text) => {
              const str = (String(text)==='1') ? '已到账' : '未到账'
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
            width: 120,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrSocial/tforecastform/pageAudit?status=1', // 列表
          queryAllInfoById: 'hrSocial/tforecastform/getAllInfoById/', // 详情
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
      // 结算主体和所属单位
      httpAction('hrBase/tsettledomain/selectAllUnitDeptVo',null,'get').then((res) => {
        if (Number(res.code) === 200) {
          this.settleDomainOptions = res.data
        } else {
          this.$message.error('结算主体和所属单位数据请求失败！')
        }
      })
      // getAllSettleDomainSelectVos().then((res) => {
      //   if (res.code === 200) {
      //     console.log(res.data);
      //     this.settleDomainOptions = res.data
      //   } else {
      //     this.$message.error('结算主体和所属单位数据请求失败！')
      //   }
      // })
      // 获取权限的用户
      httpAction('admin/user/findUserBypPrmission?permissionStr=wxhr:tinvoice_saveInvoice', '', 'GET').then((res) => {
        if (res.code === 200) {
          this.nextUserIdOptions = res.data
        } else {
          this.$message.error('审核人数据请求失败！')
        }
      })
    },
    methods: {
      // 详情
      handleDetail: function(record) {
        this.$refs.forecastBillDetailModal.isVerify = false
        this.$refs.forecastBillDetailModal.title = '预估账单详情'
        this.$refs.forecastBillDetailModal.isEdit = false
        this.$refs.forecastBillDetailModal.buyTypeBelongs = this.buyTypeOptions
        this.$refs.forecastBillDetailModal.settleTypeBelongs = this.settleTypeOptions
        this.$refs.forecastBillDetailModal.settleDomainBelongs = this.settleDomainOptions
        this.$refs.forecastBillDetailModal.dispatchStatusBelongs = this.dispatchStatusOptions
        if (this.buyTypeOptions.length > 0 && this.settleTypeOptions.length > 0 && this.dispatchStatusOptions.length > 0 && Object.keys(this.settleDomainOptions).length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.forecastBillDetailModal.edit(res.data, this.url.auditProcessUrl,record.status)
            } else {
              this.$message.error('数据请求失败！')
            }
          })
        } else {
          if (this.buyTypeOptions.length === 0) {
            this.$message.error(`"购买类型"${this.loadMessage}`)
            return false
          }

          if (this.settleTypeOptions.length === 0) {
            this.$message.error(`"结算类型"${this.loadMessage}`)
            return false
          }

          if (this.dispatchStatusOptions.length === 0) {
            this.$message.error(`"商险状态"${this.loadMessage}`)
            return false
          }

          if (Object.keys(this.settleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return false
          }
        }
      },
      // 审核
      handleAudit: function(record) {
        this.$refs.forecastBillDetailModal.isVerify = false
        this.$refs.forecastBillDetailModal.title = '预估账单审核'
        this.$refs.forecastBillDetailModal.auditStatus = this.$refs.forecastBillDetailModal.isEdit = true
        this.$refs.forecastBillDetailModal.buyTypeBelongs = this.buyTypeOptions
        this.$refs.forecastBillDetailModal.settleTypeBelongs = this.settleTypeOptions
        this.$refs.forecastBillDetailModal.nextUserIdBelongs = this.nextUserIdOptions
        this.$refs.forecastBillDetailModal.settleDomainBelongs = this.settleDomainOptions
        this.$refs.forecastBillDetailModal.dispatchStatusBelongs = this.dispatchStatusOptions
        
        if (this.buyTypeOptions.length > 0 && this.settleTypeOptions.length > 0 && this.dispatchStatusOptions.length > 0 && this.nextUserIdOptions.length > 0 && Object.keys(this.settleDomainOptions).length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.forecastBillDetailModal.edit(res.data, this.url.auditProcessUrl,record.status)
            } else {
              this.$message.error('数据请求失败！')
            }
          })
        } else {
          if (this.buyTypeOptions.length === 0) {
            this.$message.error(`"购买类型"${this.loadMessage}`)
            return false
          }

          if (this.settleTypeOptions.length === 0) {
            this.$message.error(`"结算类型"${this.loadMessage}`)
            return false
          }

          if (this.dispatchStatusOptions.length === 0) {
            this.$message.error(`"商险状态"${this.loadMessage}`)
            return false
          }

          if (this.nextUserIdOptions.length === 0) {
            this.$message.error(`"审核人"${this.loadMessage}`)
            return false
          }

          if (Object.keys(this.settleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return false
          }
        }
      },
      // 重置按钮
      searchReset() {
        this.queryParam = {}
        this.settleDomainDisabled = true
        this.settleDomainItems = []
        this.loadData(1)
      },
      // 数据字典
      initDictConfig() {
        // 购买类型
        initDictOptions('insurance_buyType').then((res) => {
          if (Number(res.code) === 200) {
            this.buyTypeOptions = res.data
          }
        })
        // 结算类型 
        initDictOptions('settlementType').then((res) => {
          if (Number(res.code) === 200) {
            this.settleTypeOptions = res.data
          }
        })
        // 状态
        initDictOptions('Insurance_record_status').then((res) => {
          if (Number(res.code) === 200) {
            this.dispatchStatusOptions = res.data
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
