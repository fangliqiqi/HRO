<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="员工姓名">
              <a-input
                v-model="queryParam.name"
                placeholder="请输入员工姓名"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="身份证号">
              <a-input
                v-model="queryParam.idCard"
                placeholder="请输入身份证号"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <!-- <a-select
                v-model="queryParam.settleDepartName"
                showSearch
                placeholder="选择结算主体"
                allowClear
              >
                <a-select-option
                  v-for="(item, index) in settlementList"
                  :key="index"
                  :value="item.departName"
                >{{ item.departName }}</a-select-option>
              </a-select> -->
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

    <!-- 列表 -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
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
          <a @click="handleRecord(record)">发放记录</a>
          <a-divider type="vertical" />
          <a @click="handleDetail(record)">工资表</a>
        </span>
      </a-table>
    </div>
    <!-- 发放记录 -->
    <pause-record-modal ref="pauseModal"></pause-record-modal>

    <!-- 工资表详情 -->
    <pause-salary-detail-modal ref="salaryDetailModal"></pause-salary-detail-modal>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import PauseRecordModal from './modules/PauseRecordModal'
import PauseSalaryDetailModal from './modules/PauseSalaryDetailModal'
import { getSettlementAuthorityByUser } from '@/api/api'
import {mapGetters} from 'vuex'
export default {
  name: 'SearchStandardPauseList',
  mixins: [JeecgListMixin],
  components:{
    PauseRecordModal,
    PauseSalaryDetailModal
  },
  data(){
    return{
      columns:[
        {
          // width: 140,
          ellipsis: true,
          title: '员工姓名',
          align: 'center',
          dataIndex: 'name',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          // width: 180,
          ellipsis: true,
          title: '身份证号',
          align: 'center',
          dataIndex: 'idCard',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          // width: 200,
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
          // width: 160,
          ellipsis: true,
          title: '工资日期',
          align: 'center',
          dataIndex: 'salaryDate',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          // width: 180,
          ellipsis: true,
          title: '余额',
          align: 'center',
          dataIndex: 'balance',
          customRender: (text) => {
            return text ? text.toLocaleString() : 0
          }
        },
        {
          // width: 170,
          ellipsis: true,
          title: '创建日期',
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
          align: 'center',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        }
      ],
      url:{
        list: '/salary/tpausesalary/page?type=1',
      },
      settlementList: [],
    }
  },
  created() {
    this.loadSettlementList()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods:{
    // 发放记录
    handleRecord(record){
      this.$refs.pauseModal.show(record)
    },
    // 工资表详情
    handleDetail(record){
      this.$refs.salaryDetailModal.show(record)
      this.$refs.salaryDetailModal.title = '工资表'
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
