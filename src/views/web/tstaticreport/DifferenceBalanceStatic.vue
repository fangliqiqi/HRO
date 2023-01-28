<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24" >
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算月份" class="labelTxt">
              <a-month-picker
                placeholder="年月选择"
                format="YYYYMM"
                style="width:100%"
                v-model="queryParam.settlementMonth"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户名称">
              <a-input
                allowClear
                placeholder="客户名称"
                v-model="queryParam.unitName"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户编码">
              <a-input
                allowClear
                placeholder="客户编码"
                v-model="queryParam.unitNo"
              />
            </a-form-item>
          </a-col>
          

          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体">
                <select-page
                  :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                  :title="'departName'"
                  :placeholder="'结算主体'"
                  v-model="queryParam.departId"
                  :id="'id'"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体编码">
                <a-input
                  allowClear
                  placeholder="结算主体编码"
                  v-model="queryParam.departNo"
                />
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
    <div class="table-operator">
      <a-button
        type="primary"
        icon="download"
        @click="exportHandle"
        style="margin-right:10px;"
      >导出</a-button>
    </div>
    <!-- table区域-begin -->
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
        :scroll="{x: 1}"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a-button type="link" @click="showDetail(record)">明细</a-button>
        </span>
      </a-table>
    </div>
    <balance-detail-modal ref="BalanceDetailForm"></balance-detail-modal>
    <export-balance-modal ref="ExportBalanceForm"></export-balance-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction } from '@/api/manage'
import SelectPage from '@/components/jeecg/SelectPage'
import BalanceDetailModal from './modules/BalanceDetailModal'
import ExportBalanceModal from './modules/ExportBalanceModal'
import moment from "moment"

export default {
  name: 'DifferenceBalanceStatic',
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
    ExportBalanceModal,
    BalanceDetailModal
  },
  data(){
    return {
      loading: false,
      btnLoading:false,
      confirmLoading: false,
      dataSource:[],
      visible:false,
      selectCurrentDate:null,
      selectedRowKeys: [],
      selecteNum:0,
      queryParam:{
        settlementMonth:moment().format('YYYYMM')  //默认当前月份
      },
      // 表头
      columns: [
        {
          width: 250,
          ellipsis: true,
          title: '客户名称',
          align: 'center',
          dataIndex: 'unitName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '客户编码',
          align: 'center',
          dataIndex: 'unitNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 250,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'departName',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'departNo',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 160,
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
          width: 160,
          ellipsis: true,
          title: '上月累计差余额',
          align: 'center',
          dataIndex: 'prevPoorBalance',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '本月差余额',
          align: 'center',
          dataIndex: 'nowPoorBalance',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '本月累计差余额',
          align: 'center',
          dataIndex: 'curPoorBalance',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 160,
          fixed:'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/salary/tstatisticsbalance/getMainPage',
      },
    }
  },
  methods:{
    async exportHandle(){
      const res1 = await httpAction(`/admin/user/userDic`, null ,'GET');
      if(res1.code==200){
        this.$refs.ExportBalanceForm.show(res1.data);
      }else{
        this.$message.warn(res1.msg);
      }
      
    },
    // 多选
    onSelectChange(selectedRowKeys,selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selecteNum = selectedRows.filter(items=>items.alertStatus==1&&items.settleStatus==0).length
    },
    showDetail(record){
      this.$refs.BalanceDetailForm.show(record);
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
.anty-row-operator button {
  margin: 0 5px;
}
.labelTxt{
  :global(.ant-form-item-label) {
    width: 76px !important;
  }
}

</style>