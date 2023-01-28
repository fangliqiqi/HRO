<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="6"
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
            :sm="6"
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
            :sm="6"
          >
            <a-form-item label="银行卡号">
              <a-input
                placeholder="请输入银行卡号"
                v-model="queryParam.bankNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算月份">
              <a-month-picker
                v-model="queryParam.settlementMonth"
                style="width: 100%"
                placeholder="请选择结算月份"
                :defaultValue="moment()"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="发放金额">
              <a-input
                placeholder="请输入发放金额"
                v-model="queryParam.money"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="6"
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
            @click="handleEdit(record)"
            v-has="'wxhr:lostandfoundinfo_add'"
          >发放失败</a>
        </span>

        <!-- 状态 -->
        <span
          slot="statusSlot"
          slot-scope="text, record"
        >
          <template v-for="(status, key) in statusOptions">
            <a-tag
              :key="key"
              v-if="record.status == key"
              :color="status.color"
            >{{ status.option }}</a-tag>
          </template>
        </span>
        <span
          slot="settleDepartName"
          slot-scope="text"
          :style="handleColumnStyle(80)"
        >
          <a-tooltip
            placement="topLeft"
            :title="text"
          >
            {{ text }}
          </a-tooltip>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <engine-billing-fail-modal
      ref="modalForm"
      :bankOptions="bankOptions"
      @ok="modalFormOk"
    ></engine-billing-fail-modal>

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import EngineBillingFailModal from './modules/EngineBillingFailModal' 
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'


  export default {
    name: 'EngineBillingFailList',
    mixins: [JeecgListMixin],
    components: {
      EngineBillingFailModal,
    },
    data() {
      return {
        description: '工程薪资重新发放',
        // 枚举字段
        salaryStyleOptions: {'0': {'option': '确认入账', 'color': 'blue'}, '1': {'option': '发布认领', 'color': 'cyan'}, '2': {'option': '部分认领', 'color': 'purple'}, '3': {'option': '全部认领', 'color': 'green'}},
        // excel表头数据
        exportFields: [],
        bankOptions:[],
        // 表头
        columns: [
          {
            title: '员工姓名',
            align: 'center',
            dataIndex: 'empName',
          },
          {
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcard',
          },
          {
            title: '结算月份',
            align: 'center',
            dataIndex: 'settlementMonth',
          },
          {
            title: '工资月份',
            align: 'center',
            dataIndex: 'salaryDate',
          },
          {
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDepartName',
          },
          {
            title: '银行账号',
            align: 'center',
            dataIndex: 'bankNo',
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
            title: '开户行',
            align: 'center',
            dataIndex: 'bankName',
            customRender: (text) => {
              // let bankName = filterDictText(this.bankOptions, text)
              let bankName = text
              if(bankName == '-' && text){
                return text;
              }
              return bankName
            },
          },
          {
            title: '发放时间',
            align: 'center',
            dataIndex: 'revenueTime',
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'salary/tengineeraccount/getTEngineerAccountByLostVoPage',
        },
      }
    },
    created() {
      
    },
    methods: {
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
        initDictOptions('bank').then((res) => {
          if (res.code === 200) {
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
