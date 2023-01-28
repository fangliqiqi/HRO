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
                v-model="queryParam.deptId"
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
                placeholder="请选择结算月份"
                v-model="queryParam.settleMonth_extra"
                @change="onChangeMonth"
                style="width: 100%"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.status"
                  placeholder="请选择状态查询"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in statusOptions"
                    :key="key"
                    :value="key"
                  >{{ value.option }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="创建人"
              >
                <select-page
                  :id="'userId'"
                  :title="'nickname'"
                  placeholder="请选择创建人查询"
                  v-model="queryParam.createUser"
                  :searchUrl="'/admin/user/page/wxhr?nickname='"
                ></select-page>
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

    <!-- 导出 -->
    <div class="table-operator">

      <a-button
        type="primary"
        @click="handleExport"
      >按客户导出</a-button>

      <a-button
        type="primary"
        @click="handleInExport"
      >按班组导出</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{ x: 1 }"
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
    <agency-statement-detail
      ref="agencyStatementDetail"
      @ok="modalFormOk"
    ></agency-statement-detail>
    <agency-inaugural-team
      ref="agencyInauguralTeam"
      @ok="modalFormOk"
    ></agency-inaugural-team>
    <agency-customer ref="agencyCustomer"></agency-customer>

  </a-card>
</template>

<script>
  import moment from 'moment'
  import SelectPage from '@/components/jeecg/SelectPage'
  import ErrorModal from '../../global/modules/ErrorModal'
  import { httpAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import { getUnitSelectVos } from '@/api/api'
  import AgencyStatementDetail from './modules/AgencyStatementDetail'
  import AgencyInauguralTeam from './modules/AgencyInauguralTeam'
  import AgencyCustomer from './modules/AgencyCustomer'

  export default {
    name: 'AgencyStatementSearch',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      SelectPage,
      AgencyStatementDetail,
      AgencyInauguralTeam,
      AgencyCustomer
    },
    data() {
      return {
        description: '代理结算单查询',
        // 枚举字段
        settleDomainDisabled: true,  // 结算主体不可选择
        buyTypeOptions: [], // 购买类型
        settleTypeOptions: [],  // 结算类型
        settleDomainItems: [],  // 结算主体数组
        settleDomainOptions: {},  // 结算主体和所属单位
        unitOptions: [], // 单位和结算主体
        dateFormat: 'YYYYMM', // 时间格式化
        yearMonthArrOptions: [],  // 年和月组成的字符串的数组
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        statusOptions: {'0': {'option': '待提交', 'color': 'blue'},'1': {'option': '待审核', 'color': 'red'},
        '2': {'option': '审核通过', 'color': 'green'}, '3': {'option': '审核不通过', 'color': 'red'}},
        // excel表头数据
        exportFields: [],
        employData:[],
        // 表头
        columns: [
          {
            width: 200,
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
            width: 180,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'deptName',
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
            dataIndex: 'deptNo',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '结算月份',
            align: 'center',
            dataIndex: 'settleMonth',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '开票金额合计',
            align: 'center',
            dataIndex: 'settleMoney',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
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
            width: 120,
            ellipsis: true,
            title: '创建人',
            align: 'center',
            dataIndex: 'createUser',
            customRender:(text) => {
              const str = ((Object.keys(this.employData).length) && (this.employData).hasOwnProperty(text)) ? (this.employData)[text] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 170,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createDate',
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
          list: 'hrSocial/tagent/page', // 列表
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
      // getAllSettleDomainSelectVos().then((res) => {
      //   if (res.code === 200) {
      //     this.settleDomainOptions = res.data
      //   } else {
      //     this.$message.error('结算主体和所属单位数据请求失败！')
      //   }
      // })

      // 获取前半年、后半年年和月组成的字符串的数组
      let yearMonthArr = []

      for (let i = 6; i >= -6; i--) {
        let monthsKey = moment().subtract(i, 'months').format(this.dateFormat)
        yearMonthArr.push(monthsKey)
      }

      this.yearMonthArrOptions = yearMonthArr

      // 系统人员
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if (Number(res.code) === 200) {
          this.employData = res.data
        }
      })
    },
    methods: {
      onChangeMonth(date){
        this.queryParam.settleMonth = date ? date.format('YYYYMM') : null
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.agencyStatementDetail.show(record)
        this.$refs.agencyStatementDetail.status = 2
        this.$refs.agencyStatementDetail.title = '代理结算单详情'
      },
      // 重置按钮
      searchReset() {
        this.queryParam = {}
        this.settleDomainDisabled = true
        this.settleDomainItems = []
        this.loadData(1)
      },

      // 按班组导出
      handleInExport(){
        this.$refs.agencyInauguralTeam.title = '按班组导出'
        this.$refs.agencyInauguralTeam.yearMonthArrBelongs = this.yearMonthArrOptions
        this.$refs.agencyInauguralTeam.add()
        
      },
      handleExport(){
        this.$refs.agencyCustomer.title = '按客户导出'
        this.$refs.agencyCustomer.unitBelongs = this.unitOptions
        this.$refs.agencyCustomer.add()
      },
      // 数据字典
      initDictConfig() {
        // 购买类型
        initDictOptions('insurance_buyType').then((res) => {
          if (res.code === 200) {
            this.buyTypeOptions = res.data
          }
        })
        // 结算类型 
        initDictOptions('settlementType').then((res) => {
          if (res.code === 200) {
            this.settleTypeOptions = res.data
          }
        })
        // 状态
        initDictOptions('Insurance_record_status').then((res) => {
          if (res.code === 200) {
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
