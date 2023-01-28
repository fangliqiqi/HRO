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
            <a-form-item label="账户名">
              <a-input
                allowClear
                placeholder="请输入账户名"
                v-model="queryParam.name"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="金额">
              <a-input
                allowClear
                placeholder="请输入金额"
                v-model="queryParam.money"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="银行卡号">
              <a-input
                allowClear
                placeholder="请输入银行账号"
                v-model="queryParam.bankNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="项目说明">
                <a-input
                  allowClear
                  placeholder="请输入项目说明"
                  v-model="queryParam.itemName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="项目类别">
                <a-input
                  allowClear
                  placeholder="请输入项目类别"
                  v-model="queryParam.itemTypeName"
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
        :scroll="{x: 1}"
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
          <a
            @click="handleSalaryFail(record)"
            v-have="'wxhr:lostandfoundinfo_add'"
          >发放失败</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <billing-salary-fail-add-modal
      ref="billingSalaryFailAddModal"
      @ok="modalFormOk"
    ></billing-salary-fail-add-modal>

  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BillingSalaryFailAddModal from './modules/NoPersonBillingFailModule'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
export default {
  name: 'NoPersonTaxBillFail',
  mixins: [JeecgListMixin],
  components: {
    BillingSalaryFailAddModal
  },
  data() {
    return {
      description: '非扣税重新发放',
      salaryStyleOption: { '0': '现金', '1': '转账' },
      // 枚举字段
      bankOptions: [], // 开户行
      // excel表头数据
      exportFields: [],
      // 表头
      columns: [
        {
          width: 140,
          ellipsis: true,
          title: '账户名',
          align: 'center',
          dataIndex: 'name',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '金额',
          align: 'center',
          dataIndex: 'money',
          customRender: text => {
            return text ? text : '-'
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '开户行',
          align: 'center',
          dataIndex: 'bankName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
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
          width: 150,
          ellipsis: true,
          title: '银行卡号',
          align: 'center',
          dataIndex: 'bankNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '项目说明',
          align: 'center',
          dataIndex: 'itemName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '项目类别',
          align: 'center',
          dataIndex: 'itemTypeName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '发放方式',
          align: 'center',
          dataIndex: 'salaryStyle',
          customRender: text => {
            return this.salaryStyleOption[text]
          }
        },
        {
          width: 170,
          ellipsis: true,
          title: '发放时间',
          align: 'center',
          dataIndex: 'revenueTime',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '操作',
          key: 'operation',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: 'salary/tnontaxsalaryaccount/page?deleteFlag=0&distributionFlag=1'
      }
    }
  },
  created() {},
  methods: {
    // 标记发放失败
    handleSalaryFail: function(record) {
      this.$refs.billingSalaryFailAddModal.title = '发放失败标记'
      this.$refs.billingSalaryFailAddModal.bankOptions = this.bankOptions
      this.$refs.billingSalaryFailAddModal.edit(record)
    },
    // 隐藏列样式
    handleColumnStyle(width) {
      if (width) {
        return `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: ${width}px;`
      }
      return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
    },
    // 数据字典

    initDictConfig() {
      // 开户行
      initDictOptions('bank').then(res => {
        if (Number(res.code) === 200) {
          this.bankOptions = res.data
        }
      })
    }
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
