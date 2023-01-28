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
            <a-form-item label="结算主体">

              <a-input
                v-model="queryParam.settleDepartName"
                placeholder="请输入结算主体"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体编码">
              <a-input
                placeholder="请输入结算主体编码"
                v-model="queryParam.settleDepartNo"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <!-- <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算月份">
                <a-month-picker
                  v-model="queryParam.settleDate"
                  style="width: 100%"
                  placeholder="请选择月份"
                  format="YYYYMM"
                />
              </a-form-item>
            </a-col> -->
            <!-- <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="发放状态">
                <a-select
                  v-model="queryParam.chargeStatus"
                  placeholder="请选择"
                  default-value="0"
                  :allowClear="true"
                >
                  <a-select-option
                    v-for="(item,index) in statusOptions"
                    :key="index"
                    :value="index"
                  >{{ item.option }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
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
              <!-- <a
                @click="handleToggleSearch"
                style="margin-left: 8px"
              >
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
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
            @click="handleBilling(record)"
            v-have="'wxhr:tchargerecord_doIssuePause'"
          >出账</a>
        </span>

        <!-- 状态 -->
        <span
          slot="chargeStatus"
          slot-scope="text, record"
        >
          <template v-for="(status, key) in statusOptions">
            <a-tag
              :key="key"
              v-if="record.chargeStatus == key"
              :color="status.color"
            >{{ status.option }}</a-tag>
          </template>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <customize-salary-pause-modal
      ref="customizeSalaryPauseModal"
      :bankOptions="bankOptions"
      @ok="modalFormOk"
    ></customize-salary-pause-modal>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import CustomizeSalaryPauseModal from './modules/CustomizeSalaryPauseModal'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import { getSettlementAuthorityByUser } from '@/api/api'
  export default {
    name: 'CustomizeSalaryPauseList',
    mixins: [JeecgListMixin],
    components: {
      CustomizeSalaryPauseModal,
    },
    data() {
      return {
        description: '自定义暂停发出账',
        // excel表头数据
        exportFields: [],
        bankOptions:[],
        settlementList:[],
        statusOptions:{
          '0':{'option': '待发放', 'color': 'green'},
          '1':{'option': '已发放', 'color': 'red'},
          '2':{'option': '发放失败', 'color': 'blue'},
        },
        // 表头
        columns: [
          {
            title: '发放状态',
            align: 'center',
            dataIndex: 'chargeStatus',
            scopedSlots: { customRender: 'chargeStatus' },
          },
          {
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDepartName',
          },
          {
            title: '自定义项名称',
            align: 'center',
            dataIndex: 'name',
          },
          {
            title: '发放金额',
            align: 'center',
            dataIndex: 'chargeMoney',
            customRender: (text) => {
              return text ? text.toLocaleString() : '-'
            }
          },
          {
            title: '发放方式',
            align: 'center',
            dataIndex: 'chargeType',
            customRender: (text) => {
              if(text == 1){
                return '银付'
              }
              if(text == 0){
                return '现金'
              }
              if(text == 2){
                return '线下'
              }
              return ''
            },
          },
          {
            title: '收款卡号',
            align: 'center',
            dataIndex: 'bankNo',
          },
          {
            title: '收款银行',
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
            title: '提交时间',
            align: 'center',
            dataIndex: 'chargeDate',
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'salary/tchargerecord/getPendingDiyPausePage',
        },
      }
    },
    created() {
      this.loadSettlementList()
    },
    methods: {
      // 添加
      handleBilling: function(record) {
        this.$refs.customizeSalaryPauseModal.title = '自定义薪资暂停发放出账';
        this.$refs.customizeSalaryPauseModal.show(record)
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
      // 获取结算主体列表
      loadSettlementList() {
        getSettlementAuthorityByUser({}).then((res) => {
          this.settlementList = res.data
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
