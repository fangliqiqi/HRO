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
                v-model="queryParam.empName"
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
                v-model="queryParam.empIdcard"
              ></a-input>
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
            v-has="'wxhr:lostandfoundinfo_doBilling'"
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
    <salary-fail-modal
      ref="salaryFailModal"
      :bankOptions="bankOptions"
      @ok="modalFormOk"
    ></salary-fail-modal>
    <salary-billing-fail-modal
      ref="billingSalaryFailAddModal"
      @ok="modalFormOk"
    ></salary-billing-fail-modal>

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SalaryFailModal from './modules/SalaryFailModal' 
  import { httpAction } from '@/api/manage'
  import SalaryBillingFailModal from './modules/SalaryBillingFailModal'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'SalaryFailList',
    mixins: [JeecgListMixin],
    components: {
      SalaryFailModal,
      SalaryBillingFailModal
    },
    data() {
      return {
        description: '发放失败出账',
        // 枚举字段
        statusOptions: {'0': {'option': '待认领', 'color': 'blue'}, '1': {'option': '待出账', 'color': 'cyan'}, '2': {'option': '已发放', 'color': 'purple'}, '3': {'option': '再次失败待认领', 'color': 'green'}},
        // excel表头数据
        exportFields: [],
        // 银行字典
        bankOptions:[],
        employData:[],
        // 表头
        columns: [
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
            width: 100,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
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
            title: '认领人',
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
            width: 170,
            ellipsis: true,
            title: '开户行',
            align: 'center',
            dataIndex: 'bankName',
            customRender: (text) => {
              // const resultText = filterDictText(this.bankOptions, text) || '-'
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            },
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
            width: 160,
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'salary/lostandfoundinfo/getBillingPage?accountType=9',
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
      // 添加
      handleBilling: function(record) {
        this.$refs.salaryFailModal.show(record)
      },
      // 标记发放失败
      handleSalaryFail: function(record) {
        this.$refs.billingSalaryFailAddModal.title = '发放失败登记'
        this.$refs.billingSalaryFailAddModal.edit(record)
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
</style>
