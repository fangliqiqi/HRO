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
                v-model="queryParam.empName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <a-input
                allowClear
                placeholder="请输入结算主体"
                v-model="queryParam.settleDepartName"
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
            @click="handleSalaryFail(record)"
            v-have="'wxhr:lostandfoundinfo_edit'"
          >重新发放</a>
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
  import BillingSalaryFailAddModal from './modules/NoPersonTaxFailModule'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'NoPersonTaxFail',
    mixins: [JeecgListMixin],
    components: {
      BillingSalaryFailAddModal,
    },
    data() {
      return {
        description: '非扣税发放失败认领',
        // 枚举字段
        bankOptions: [],
        // 开户行excel表头数据
        exportFields: [],
        // 表头
        columns: [
          {
            title: '账户名',
            align: 'center',
            dataIndex: 'empName',
            customRender: (text) => {
              return text ? text : '-'
            },
          },
          {
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDepartName',
            customRender: (text) => {
              return text ? text : '-'
            },
          },
          {
            title: '结算月份',
            align: 'center',
            dataIndex: 'settlementMonth',
            customRender: (text) => {
              return text ? text : '-'
            },
          },
          {
            title: '开户行',
            align: 'center',
            dataIndex: 'bankName',
            customRender: (text) => {
              let bankName = filterDictText(this.bankOptions, text)
              if(bankName == '-' && text){
                return text;
              }
              return bankName
            },
          },
          {
            title: '银行账号',
            align: 'center',
            dataIndex: 'bankNo',
            customRender: (text) => {
              return text ? text : '-'
            },
          },
          {
            title: '发放金额',
            align: 'center',
            dataIndex: 'money',
            customRender: (text) => {
              return text ? text.toLocaleString() : '-'
            },
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'salary/lostandfoundinfo/getClaimPage?accountType=2',
        },
      }
    },
    created() {
    },
    methods: {
      // 重新发放
      handleSalaryFail: function(record) {
        this.$refs.billingSalaryFailAddModal.title = '重新发放'
        this.$refs.billingSalaryFailAddModal.bankOptions = this.bankOptions
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
