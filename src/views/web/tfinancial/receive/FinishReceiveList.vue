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
            <a-form-item label="来款单位">
              <a-input
                placeholder="请输入来款单位查询"
                v-model="queryParam.incomeBelong"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="到款单位">
              <a-input
                placeholder="请输入到款单位查询"
                v-model="queryParam.paymentUnitName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="进账起始时间">
              <a-date-picker
                style="width: 97%"
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
            <a-form-item label="进账截止时间">
              <a-date-picker
                style="width: 97%"
                placeholder="请选择截止时间查询"
                format="YYYY-MM-DD HH:mm:ss"
                v-model="queryParam.dateTemp1"
                @change="handleTimeEndChange"
                :showTime="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="进账金额">
                <a-input-group compact>
                  <a-input
                    style=" width: 43%; text-align: center"
                    placeholder="最小金额"
                    @change="changeIncomFee1"
                    v-model="queryParam.incomeFee1"
                  />
                  <a-input
                    style=" width: 14%; border-left: 0; pointer-events: none; background-color: #fff"
                    placeholder="~"
                    disabled
                  />
                  <a-input
                    style="width: 43%; text-align: center; border-left: 0"
                    placeholder="最大金额"
                    @change="changeIncomFee2"
                    v-model="queryParam.incomeFee2"
                  />
                </a-input-group>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              
              <a-form-item
                label="发布人"
              >
                <select-page
                  :searchUrl="'admin/user/page/wxhr?nickname='"
                  :title="'nickname'"
                  placeholder="请选择发布人查询"
                  :id="'userId'"
                  v-model="queryParam.releaseUser"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="发布起始时间">
                <a-date-picker
                  style="width: 100%"
                  placeholder="请选择起始时间查询"
                  format="YYYY-MM-DD HH:mm:ss"
                  v-model="queryParam.dateTemp2"
                  @change="handleTimeBeginChange1"
                  :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="发布截止时间">
                <a-date-picker
                  style="width: 100%"
                  placeholder="请选择截止时间查询"
                  format="YYYY-MM-DD HH:mm:ss"
                  v-model="queryParam.dateTemp3"
                  @change="handleTimeEndChange1"
                  :showTime="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="财务备注">
                <a-input
                  placeholder="请输入财务备注查询"
                  v-model="queryParam.financeRemark"
                ></a-input>
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
    <finish-receive-detail-modal
      ref="finishReceiveDetailModal"
      @ok="modalFormOk"
    ></finish-receive-detail-modal>
  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  // import { getAllSettleDomainSelectVos } from '@/api/api'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import FinishReceiveDetailModal from './modules/FinishReceiveDetailModal'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'FinishReceiveList',
    mixins: [JeecgListMixin],
    components: {
      FinishReceiveDetailModal,
      SelectPage
    },
    data() {
      return {
        description: '已认领款项',
        // 枚举字段
        employData: {}, // 发布人
        settleDomainOptions: {},  // 结算主体
        dateFormat: "YYYY-MM-DD HH:mm:ss",  // 时间格式化
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        statusOptions: {'0': {'option': '发布认领', 'color': 'cyan'}, '1': {'option': '部分认领', 'color': 'purple'}, '2': {'option': '全部认领', 'color': 'green'}},
        // excel表头数据
        exportFields: [],
        // 表头
        columns: [
          {
            width: 250,
            ellipsis: true,
            title: '来款单位',
            align: 'center',
            dataIndex: 'incomeBelong',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 250,
            ellipsis: true,
            title: '到款单位',
            align: 'center',
            dataIndex: 'paymentUnitName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '进账金额',
            align: 'center',
            dataIndex: 'incomeFee',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '进账时间',
            align: 'center',
            dataIndex: 'incomeDate',
            customRender:(text) => {
              const str = text ? text.substring(0, 10) : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '发布人',
            align: 'center',
            dataIndex: 'releaseUser',
            customRender:(text) => {
              const str = this.employData.hasOwnProperty(text) ? this.employData[text] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
            ellipsis: true,
            title: '财务备注',
            align: 'center',
            dataIndex: 'financeRemark',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '待认领金额',
            align: 'center',
            dataIndex: 'associcationFee',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '已认领金额',
            align: 'center',
            dataIndex: 'associcationedFee',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
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
            width: 150,
            ellipsis: true,
            title: '发布时间',
            align: 'center',
            dataIndex: 'releaseDate',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'salary/trecive/page?status=2',
          delete: 'salary/trecive/',
          queryAllInfoById: 'salary/trecive/', // 详情
        },
      }
    },
    created() {
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
      //     this.settleDomainOptions = res.data
      //   } else {
      //     this.$message.error('结算主体和所属单位数据请求失败！')
      //   }
      // })
      // 发布人员数据
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if (Number(res.code) === 200) {
          this.employData = res.data
        } else {
          this.$message.error('发布人数据请求失败！')
        }
      })
    },
    methods: {
      // 详情
      handleDetail: function(record) {
        this.$refs.finishReceiveDetailModal.title = '认领详情'
        this.$refs.finishReceiveDetailModal.settleDomainBelongs = this.settleDomainOptions
        if (Object.keys(this.settleDomainOptions).length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.finishReceiveDetailModal.edit(res.data,this.employData)
              this.$refs.finishReceiveDetailModal.loadData(1)
            } else {
              this.$message.error('数据请求失败！')
            }
          })
        } else {
          if (Object.keys(this.settleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
          }
        }
      },
      // 起始时间选择
      handleTimeBeginChange(date) {
        // 时间格式化
        this.queryParam.incomeDateStart = date ? (date.format(this.dateFormat)) : null
      },
      // 截止时间选择
      handleTimeEndChange(date) {
        // 时间格式化
        this.queryParam.incomeDateEnd = date ? (date.format(this.dateFormat)) : null
      },
      // 起始时间选择
      handleTimeBeginChange1(date) {
        // 时间格式化
        this.queryParam.releaseDateStart = date ? (date.format(this.dateFormat)) : null
      },
      // 截止时间选择
      handleTimeEndChange1(date) {
        // 时间格式化
        this.queryParam.releaseDateEnd = date ? (date.format(this.dateFormat)) : null
      },
      // 替换入账金额,
      changeIncomFee1(e) {
        /* eslint-disable */
        const incomeFee = e.target.value.replace(/\,/g, '')
        this.queryParam.incomeFee1 = incomeFee
      },
      // 替换入账金额,
      changeIncomFee2(e) {
        /* eslint-disable */
        const incomeFee = e.target.value.replace(/\,/g, '')
        this.queryParam.incomeFee2 = incomeFee
      },
      // 数据字典
      initDictConfig() {
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

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
