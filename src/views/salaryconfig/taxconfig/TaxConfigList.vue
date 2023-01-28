<template>
  <a-card>
    <div
      class="table-operator"
      style="margin-bottom:10px"
    >
      <a-button
        type="primary"
        @click="handleSalaryAdd"
        icon="plus"
        v-has="'wxhr:tsalarytaxconfig_add'"
      >添加工资个税</a-button>
    </div>
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="salaryColumns"
      :dataSource="salaryDatasource"
      :pagination="false"
    >
      <span
        slot="action"
        slot-scope="text, record"
      >
        <a @click="handleDetail(record)">查看</a>
        <a-divider type="vertical" />
        <a
          @click="handleSalaryEdit(record)"
          v-has="'wxhr:tsalarytaxconfig_edit'"
        >编辑</a>
        <a-divider type="vertical" />
        <a
          @click="handleDelete(record.id)"
          v-has="'wxhr:tsalarytaxconfig_del'"
        >删除</a>
      </span>
    </a-table>

    <div
      class="table-operator"
      style="margin-bottom:10px;margin-top:20px"
    >
      <a-button
        type="primary"
        icon="plus"
        @click="handleYearAdd"
        v-has="'wxhr:tsalarytaxconfig_add'"
      >添加年终奖个税</a-button>
    </div>
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="awardColumns"
      :dataSource="yearDatasource"
      :pagination="false"
    >
      <span
        slot="action"
        slot-scope="text, record"
      >
        <a @click="handleDetail(record)">查看</a>
        <a-divider type="vertical" />
        <a
          @click="handleYearEdit(record)"
          v-has="'wxhr:tsalarytaxconfig_edit'"
        >编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定删除吗?"
          @confirm="handleDelete(record.id)"
          okText="确定"
          cancelText="取消"
        >
          <a
            href="#"
            v-has="'wxhr:tsalarytaxconfig_del'"
          >删除</a>
        </a-popconfirm>
      </span>
    </a-table>

    <!-- 工资个税表单 -->
    <salary-modal
      ref="modalSalary"
      @ok="modalFormOk"
    ></salary-modal>

    <!-- 年终奖表单 -->
    <year-modal
      ref="modalYear"
      @ok="modalFormOk"
    ></year-modal>

    <!-- 详情 -->
    <tax-config-detail-modal ref="modalDetail"></tax-config-detail-modal>
  </a-card>
</template>
<script>
import { httpAction } from '@/api/manage'
import SalaryModal from './modules/SalaryModal'
import YearModal from './modules/YearModal'
import TaxConfigDetailModal from './modules/TaxConfigDetailModal'
export default {
  components:{
    SalaryModal,
    YearModal,
    TaxConfigDetailModal
  },
  data(){
    return{
      salaryColumns: [
        {
          title: '级数',
          dataIndex: 'level',
          align:'center',
        },
        {
          title: '全月应纳税所得额下限',
          dataIndex: 'minIncome',
          align:'center',
        },
        {
          title: '全月应纳税所得额上限',
          dataIndex: 'maxIncome',
          align:'center',
        },
        {
          title: '税率（%）',
          dataIndex: 'withholdingRate',
          align:'center',
        },
        {
          title: '个税起征点',
          dataIndex: 'startPoint',
          align:'center',
        },
        {
          title: '速算扣除数（元）',
          dataIndex: 'quickDeducation',
          align:'center',
        },
        {
          title: '操作',
          align:'center',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
        }
      ],
      awardColumns: [
        {
          title: '级数',
          dataIndex: 'level',
          align:'center',
        },
        {
          title: '年终奖应纳税所得额下限',
          dataIndex: 'minIncome',
          align:'center',
        },
        {
          title: '年终奖应纳税所得额上限',
          dataIndex: 'maxIncome',
          align:'center',
        },
        {
          title: '税率（%）',
          dataIndex: 'withholdingRate',
          align:'center',
        },
        {
          title: '个税起征点',
          dataIndex: 'startPoint',
          align:'center',
        },
        {
          title: '速算扣除数（元）',
          dataIndex: 'quickDeducation',
          align:'center',
        },
        {
          title: '操作',
          align:'center',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
        }
      ],
      salaryDatasource:[],
      yearDatasource:[],
      url:{
        salaryList: '/salary/tsalarytaxconfig/salaryPage',
        yearList: '/salary/tsalarytaxconfig/yearPage',
        delete: '/salary//tsalarytaxconfig/'
      }
    }
  },
  created() {
    this.loadData()
  },
  methods:{
    loadData() {
      // 工资个税列表
      httpAction(this.url.salaryList,{},'GET').then((res) => {
        if(res.code == 200){
          this.salaryDatasource = res.data.records
        }
      })
      // 年终奖个税列表
      httpAction(this.url.yearList,{},'GET').then((res) => {
        if(res.code == 200){
          this.yearDatasource = res.data.records
        }
      })
    },
    handleSalaryAdd(){
      this.$refs.modalSalary.add()
      this.$refs.modalSalary.title = '新增'
    },
    handleYearAdd(){
      this.$refs.modalYear.add()
      this.$refs.modalYear.title = '新增'
    },
    handleSalaryEdit(record){
      this.$refs.modalSalary.edit(record)
      this.$refs.modalSalary.title = '编辑'
    },
    handleYearEdit(record){
      this.$refs.modalYear.edit(record)
      this.$refs.modalYear.title = '编辑'
    },
    modalFormOk() {
      this.loadData()
    },
    
    handleDelete(id){
      httpAction(this.url.delete + id, {}, 'DELETE').then((res) => {
        if(res.code == 200){
          this.$message.success("删除成功")
          this.loadData()
        }
      })
    },
    handleDetail(record){
      this.$refs.modalDetail.show(record)
    }
  }
}
</script>
