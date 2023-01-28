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
                placeholder="请选择结算月份查询"
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
      <!--
        <a-button
          type="primary"
          icon="plus"
          @click="handleAdd"
        >按结算主体生成</a-button>
      -->
      <a-button
        type="primary"
        icon="plus"
        @click="handleCusAdd"
      >生成实缴账单</a-button>
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
          <a @click="handleAddApply(record)">提交</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tagent_del'"
          />
          <a-popconfirm
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
            v-has="'wxhr:tagent_del'"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <agency-statement-modal
      ref="AgencyStatementModal"
      @ok="modalFormOk"
    ></agency-statement-modal>
    <agency-statement-detail
      ref="agencyStatementDetail"
      @ok="modalFormOk"
    ></agency-statement-detail>
    <agency-cust-statement
      ref="agencyCustStatement"
      @ok="modalFormOk"
    ></agency-cust-statement>
    <error-modal ref="errorModal"></error-modal>

  </a-card>
</template>

<script>
  import moment from 'moment'
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import ErrorModal from '../../global/modules/ErrorModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import AgencyStatementModal from './modules/AgencyStatementModal'
  import AgencyStatementDetail from './modules/AgencyStatementDetail'
  import AgencyCustStatement from './modules/AgencyCustStatement'
  import { getUnitSelectVos } from '@/api/api'

  export default {
    name: 'AgencyStatementList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      SelectPage,
      AgencyStatementModal,
      AgencyStatementDetail,
      AgencyCustStatement
    },
    data() {
      return {
        description: '代理结算单申请',
        // 枚举字段
        dateFormat: 'YYYYMM', // 时间格式化
        settleDomainDisabled: true,  // 结算主体不可选择
        unitOptions: [], // 单位和结算主体
        buyTypeOptions: [], // 购买类型
        nextUserIdOptions: [],  // 下一步审核人
        settleTypeOptions: [],  // 结算类型
        settleDomainItems: [],  // 结算主体数组
        settleDomainOptions: {},  // 结算主体和所属单位
        yearMonthArrOptions: [],  // 年和月组成的字符串的数组
        dispatchStatusOptions: [],  // 商险状态
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        statusOptions: {'0': {'option': '待提交', 'color': 'blue'},'1': {'option': '待审核', 'color': 'red'},
        '2': {'option': '审核通过', 'color': 'green'}, '3': {'option': '审核不通过', 'color': 'red'}},
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
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'deptName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 165,
            ellipsis: true,
            title: '结算主体编码',
            align: 'center',
            dataIndex: 'deptNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 160,
            ellipsis: true,
            title: '结算月份',
            align: 'center',
            dataIndex: 'settleMonth',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 160,
            ellipsis: true,
            title: '开票金额合计',
            align: 'center',
            dataIndex: 'settleMoney',
            customRender: text => {
              const resultText = text || (parseFloat(text) === 0?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
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
            width: 170,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createDate',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrSocial/tagent/getApplayPage', // 列表
          delete: 'hrSocial/tagent/',  // 删除
          queryAllInfoById: 'hrSocial/tforecastform/getAllInfoById/', // 详情
          auditProcessUrl: 'hrSocial/tauditinfo/getAuditInfoByIdAndType',  // 流程进展明细
        },
      }
    },
    created() {
      // 获取登录用户拥有结算主体权限的单位信息（包含结算主体）
      getUnitSelectVos().then((res) => {
        if (Number(res.code) === 200) {
          this.unitOptions = res.data
        } else {
          this.$message.error('单位信息数据请求失败！')
        }
      })
      // 结算主体和所属单位
      // getAllSettleDomainSelectVos().then((res) => {
      //   if (Number(res.code) === 200) {
      //     this.settleDomainOptions = res.data
      //   } else {
      //     this.$message.error('结算主体和所属单位数据请求失败！')
      //   }
      // })
      // 获取权限的用户（预估账单审核）
      httpAction('admin/user/findUserBypPrmission?permissionStr=wxhr:tforecastform_audit', '', 'GET').then((res) => {
        if (Number(res.code) === 200) {
          this.nextUserIdOptions = res.data
        } else {
          this.$message.error('审核人数据请求失败！')
        }
      })
      // 获取前半年、后半年年和月组成的字符串的数组
      let yearMonthArr = []
      for (let i = 6; i >= -6; i--) {
        let monthsKey = moment().subtract(i, 'months').format(this.dateFormat)
        yearMonthArr.push(monthsKey)
      }
      this.yearMonthArrOptions = yearMonthArr
    },
    methods: {
      onChangeMonth(date){
        this.queryParam.settleMonth = date ? date.format('YYYYMM') : null
      },
      // 生成预估账单
      handleAdd: function() {
        this.$refs.AgencyStatementModal.title = '生成代理结算单'
        this.$refs.AgencyStatementModal.yearMonthArrBelongs = this.yearMonthArrOptions
        if (this.yearMonthArrOptions.length > 0) {
          this.$refs.AgencyStatementModal.add()
        } else {
          this.$message.error(`"缴纳月份"${this.loadMessage}`)
          return false
        }
      },
      // 提交
      handleAddApply: function(record) {
        this.$refs.agencyStatementDetail.show(record)
        this.$refs.agencyStatementDetail.status = 0
        this.$refs.agencyStatementDetail.title = '代理结算单提交'
      },
      // 重置按钮
      searchReset() {
        this.queryParam = {}
        this.settleDomainDisabled = true
        this.settleDomainItems = []
        this.loadData(1)
      },
      // 按客户生成
      handleCusAdd(){
        this.$refs.agencyCustStatement.title = '生成实缴账单'
        this.$refs.agencyCustStatement.unitBelongs = this.unitOptions
        this.$refs.agencyCustStatement.yearMonthArrBelongs = this.yearMonthArrOptions
        
        if (this.unitOptions.length > 0 && this.yearMonthArrOptions.length > 0) {
          this.$refs.agencyCustStatement.add()
        } else {
          if (this.unitOptions.length === 0) {
            this.$message.error(`"单位"${this.loadMessage}`)
            return false
          }
          if (this.yearMonthArrOptions.length === 0) {
            this.$message.error(`"缴纳月份"${this.loadMessage}`)
            return false
          }
        }
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
