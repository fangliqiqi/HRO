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
            <a-form-item label="员工姓名" class="labTxt">
              <a-input
                placeholder="请输入员工姓名"
                v-model="queryParam.empName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="身份证号" class="labTxt">
              <a-input
                placeholder="请输入身份证号"
                v-model="queryParam.empIdcard"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="结算主体"
              class="labTxt"
            >
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :placeholder="'请选择结算主体'"
                :id="'id'"
                v-model="queryParam.settleDepartId"
              ></select-page>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体编码" class="labTxt">
                <a-input
                  placeholder="请输入结算主体编码"
                  v-model="queryParam.settleDepartNo"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算月份" class="labTxt">
                <a-month-picker
                  v-model="queryParam.settlementMonth"
                  style="width: 100%"
                  placeholder="请选择结算月份"
                  format="YYYYMM"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="银行账号" class="labTxt">
                <a-input
                  placeholder="请输入银行账号"
                  v-model="queryParam.bankNo"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="收款单位" class="labTxt">
                <a-input
                  placeholder="请输入收款单位"
                  v-model="queryParam.orgName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="申请人" class="labTxt">
                <select-page
                  :searchUrl="'admin/user/page/wxhr?nickname='"
                  :title="'nickname'"
                  placeholder="请选择申请人"
                  :id="'userId'"
                  v-model="queryParam.claimUser"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="申请发放时间" class="labTxt">
                <a-range-picker @change="changeDate" v-model="queryParam.chargeDate_extra"/>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="发放金额" class="labTxt">
                <a-input-number
                  allowClear
                  v-model="queryParam.money"
                  placeholder="发放金额"
                  :parser="limitAccount"
                  style="width:100%"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="数据来源" class="labTxt">
                <a-select
                  v-model="queryParam.pauseDataType"
                  placeholder="请选择数据来源"
                >
                  <template v-for="(item, index) in typeOption">
                    <a-select-option
                      :key="index"
                      :value="item.values"
                    >{{ item.title }}</a-select-option>
                  </template>
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

    <!-- table区域-begin -->
    <div>
      <div
        class="ant-alert ant-alert-info"
        style="margin-bottom: 16px;"
      >
        已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> 项
        <a
          style="margin-left: 24px"
          @click="onClearSelected"
        >清空</a>
      </div>
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            v-if="record.status == 1"
            @click="handleBilling(record)"
            v-has="'wxhr:lostandfoundinfo_doBilling1'"
          >出账</a>
          <a
            v-if="record.status == 2"
            @click="handleSalaryFail(record)"
          >发放失败</a>
        </span>
        <span
          slot="status"
          slot-scope="text, record"
        >
          <a-tag
            v-if="record.status == 1"
            color="pink"
          >待发放</a-tag>
          <a-tag
            v-if="record.status == 2"
            color="green"
          >已发放</a-tag>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <pause-fail-modal
      ref="pauseFailModal"
      :bankOptions="bankOptions"
      @ok="modalFormOk"
    ></pause-fail-modal>
    <pause-billing-fail-modal
      ref="pauseBillingFailModal"
      @ok="modalFormOk"
    ></pause-billing-fail-modal>

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import PauseFailModal from './modules/PauseFailModal' 
  import { httpAction } from '@/api/manage'
  import PauseBillingFailModal from './modules/PauseBillingFailModal'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { limitAccount } from '@/utils/common'

  export default {
    name: 'PauseFailList',//暂停发失败出账
    mixins: [JeecgListMixin],
    components: {
      PauseFailModal,
      PauseBillingFailModal,
      SelectPage
    },
    data() {
      return {
        description: '发放失败出账',
        // excel表头数据
        exportFields: [],
        // 银行字典
        bankOptions:[],
        employData:[],
        typeOption:[{title:'普通薪资暂停发',values:'0'},{title:'工程薪资暂停发',values:'1'},{title:'工程批量暂停发',values:'3'}],
        chargeTypeOption:['现金','银付','线下'],
        // 表头
        columns: [
          {
            title: '数据来源',
            align: 'center',
            dataIndex:'pauseDataType',
            width: 120,
            ellipsis: true,
            customRender: text => {
              const resultText =text>=0?this.typeOption.find(item=>item.values==text).title:'-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 100,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            width: 120,
            ellipsis: true,
            title: '员工姓名',
            align: 'center',
            dataIndex: 'empName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 160,
            ellipsis: true,
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcard',
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
            dataIndex: 'settleDepartName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体编码',
            align: 'center',
            dataIndex: 'settleDepartNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 100,
            ellipsis: true,
            title: '结算月份',
            align: 'center',
            dataIndex: 'settlementMonth',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 100,
            ellipsis: true,
            title: '工资月份',
            align: 'center',
            dataIndex: 'salaryDate',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '发放金额',
            align: 'center',
            dataIndex: 'money',
            customRender: text => {
              const resultText = text || (parseFloat(text) === 0?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            title: '发放方式',
            align: 'center',
            dataIndex: 'type',
            width: 120,
            ellipsis: true,
            customRender: text => {
              const res = this.chargeTypeOption[text]
              return <a-tooltip title={res}>{res}</a-tooltip>
            }
          },
          {
            title: '收款单位/个人',
            align: 'center',
            dataIndex: 'orgName',
            width: 120,
            ellipsis: true,
            customRender: text => {
              return <a-tooltip title={text}>{text}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '银行账号',
            align: 'center',
            dataIndex: 'bankNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 170,
            ellipsis: true,
            title: '开户行',
            align: 'center',
            dataIndex: 'bankName',
            customRender: (text) => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '申请人',
            align: 'center',
            dataIndex: 'claimUser',
            customRender:(text) => {
              for(const c in this.employData){
                if(String(c) === String(text)){
                  return this.employData[c]
                }
              }
              return '-'
            }
          },
          {
            title: '申请发放时间',
            align: 'center',
            dataIndex: 'claimDate',
            width: 150,
            ellipsis: true,
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 160,
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'salary/lostandfoundinfo/getBillingPage?accountType=3',
          userUrl:'/admin/user/userDic'
        },
      }
    },
    created() {
      this.initDictConfig()
      httpAction(this.url.userUrl,'','GET').then((res) => {
        if(Number(res.code) === 200){
          this.employData = res.data
        }
      })
    },
    methods: {
      limitAccount,
      changeDate(val,dateString){
        this.queryParam.claimDateStart = dateString[0]
        this.queryParam.claimDateEnd = dateString[1]
      },

      // 出账
      handleBilling: function(record) {
        this.$refs.pauseFailModal.show(record)
      },
      // 标记发放失败
      handleSalaryFail: function(record) {
        this.$refs.pauseBillingFailModal.title = '发放失败登记'
        this.$refs.pauseBillingFailModal.add(record)
      },
      // 数据字典
      initDictConfig() {
        // 开户行
        initDictOptions('bank').then((res) => {
          if (Number(res.code) === 200) {
            this.bankOptions = res.data
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
.labTxt{
  :global(.ant-form-item-label){
    width: 97px !important;
  }
}
</style>
