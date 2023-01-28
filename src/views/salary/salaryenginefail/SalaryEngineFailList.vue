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

    <!-- 表格区域 -->
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleEdit(record)">重新发放</a>
        </span>
      </a-table>
    </div>

    <!-- 表单区域 -->
    <salary-engine-fail-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></salary-engine-fail-modal>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SalaryEngineFailModal from './modules/SalaryEngineFailModal'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
export default {
    name: 'SalaryEngineFailList',
    mixins: [JeecgListMixin],
    components: {
      SalaryEngineFailModal,
    },
    data(){
      return{
        // 表头
        columns: [
          {
            title: '员工姓名',
            align: 'center',
            dataIndex: 'empName',
            customRender: (text) => {
              return text ? text : '-'
            },
          },
          {
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcard',
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
          list: 'salary/lostandfoundinfo/getClaimPage?accountType=1',
        },
        bankOptions:[]
      }
    },
    created(){
      this.initDictConfig()
    },
    methods:{
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
