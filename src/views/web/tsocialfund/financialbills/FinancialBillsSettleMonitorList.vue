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
            <a-form-item label="结算月份">
              <a-month-picker
                :allowClear="false"
                placeholder="请选择结算月份"
                v-model="queryParam.settleMonth"
                style="width: 100%"
                format="YYYYMM"
                valueFormat="YYYYMM"
                :defaultValue="queryParam.settleMonth"
                :disabledDate="disabledDate"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户名称">
              <select-page
                :id="'id'"
                :title="'customerName'"
                placeholder="请选择客户名称"
                v-model="queryParam.unitId"
                :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户编码">
              <a-input
                placeholder="请输入客户编码"
                allowClear
                v-model="queryParam.unitNo"
              ></a-input>
            </a-form-item>
          </a-col>
          
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <!-- <a-form-item label="结算主体名称">
                <select-page
                  :id="'id'"
                  :title="'departName'"
                  placeholder="请选择结算主体查询"
                  v-model="queryParam.departId"
                  :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                ></select-page>
              </a-form-item> -->
              <a-form-item label="结算主体">
                <a-input
                  placeholder="请输入结算主体名称"
                  v-model="queryParam.departName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体编码">
                <a-input
                  allowClear
                  placeholder="请输入结算主体编码"
                  v-model="queryParam.departNo"
                ></a-input>
              </a-form-item>
            </a-col>
            
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="结算状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.status"
                  placeholder="请选择状态查询"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, index) in statusOptions"
                    :key="index"
                    :value="index"
                  >{{ value }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="服务客服"
              >
                <a-input
                  allowClear
                  placeholder="请输入服务客服"
                  v-model="queryParam.customerServerName"
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        type="primary"
        @click="handleExport"
        :loading="downLoading"
      >导出</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
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
          <a @click="handleSettle(record)">关联结算单</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import moment from 'moment'
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: 'FinancialBillsSettleMonitorList',//财务账单结算监控
    mixins: [JeecgListMixin],
    components: {
      SelectPage,
    },
    data() {
      return {
        form: this.$form.createForm(this),
        visible:false,
        confirmLoading:false,
        downLoading:false,//导出
        description: '财务账单结算监控',
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        selectedRowKeys:[],
        statusOptions: ['未结算','已结算'],
        employData:{},
        queryParam:{
          settleMonth:moment().format('YYYYMM')
        },
        // 表头
        columns: [
          {
            width: 120,
            ellipsis: true,
            title: '结算月份',
            align: 'center',
            dataIndex: 'settleMonth',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '客户名称',
            align: 'center',
            dataIndex: 'unitName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '客户编码',
            align: 'center',
            dataIndex: 'unitNo',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体名称',
            align: 'center',
            dataIndex: 'departName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体编码',
            align: 'center',
            dataIndex: 'departNo',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
            ellipsis: true,
            title: '服务客服',
            align: 'center',
            dataIndex: 'customerServerName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '实缴金额',
            align: 'center',
            dataIndex: 'sumAll',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算状态',
            align: 'center',
            dataIndex: 'status',
            customRender:(text) => {
              const str = text !=null? this.statusOptions[text]: '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: '/hrSocial/tmonitorprojectmonth/page', // 列表
          exportUrl:'/hrSocial/tmonitorprojectmonth/getMonitorProjectMonthList' ,//导出
          settleUrl:'/hrSocial/tfinancebill/getTFinanceBillByIdStr',//结算监控-按idStr查询结算单
         
        },
      }
    },
    created() {},
    methods: {
      moment,
      // 结算月份
      handleMonth(value){
        if(value){
          this.queryParam.settleMonth= moment(value).format('YYYYMM')
        }
      },
      // 结算月份只能选择202201至今的时间
      disabledDate(current){
        return current < moment('202112').endOf('month')||current > moment().endOf('month')
      },
      // 关联结算单
      handleSettle(record){
       console.log(record);
       if(!record.billIds){
         this.$message.warning('此结算主体还未进行结算，请尽快结算!')
         return false
       }
       httpAction(`${this.url.settleUrl}?idStr=${record.billIds}`,{},'GET').then(res=>{
         if(res.code==200){
          if(res.data.records.length>0){
            this.$router.push({
               path:'/iweb/FinancialBillsSearchList',
               query:{deptId:record.departId,deptName:record.departName,settleMonth:record.settleMonth}
            })
          }else{
            this.$message.warning('此结算主体还未进行结算，请尽快结算!')
          }
         }else{
           this.$message.warning(res.msg);
         }
       })

      },

      // 重置
      searchReset() {
        this.queryParam = {}
        this.selectedRowKeys = []
        this.queryParam.settleMonth = moment().format('YYYYMM')
        this.$router.push({
           query:{}
        })
        this.loadData(1)
      },
      // 导出
      handleExport(){
       
        const qs = require('qs')
        let params = {}
        if(Object.keys(this.queryParam).length){
          params = Object.assign({},this.queryParam)
        }
       
        if(this.selectedRowKeys.length>0){
           params = Object.assign(params,{ids:this.selectedRowKeys.join(',')})
        }
        this.downLoading = true
         httpAction(`${this.url.exportUrl}?${qs.stringify(params)}`,null,'get').then(res=>{
           if(res.code==200){
             const lists = res.data.map(item=>{
              return {
                settleMonth:item.settleMonth||'-',
                unitName:item.unitName||'-',
                unitNo:item.unitNo||'-',
                departName:item.departName||'-',
                departNo:item.departNo||'-',
                customerServerName:item.customerServerName ||'-',
                sumAll:item.sumAll || '-',
                status:this.statusOptions[item.status]||'-',
              }
            })
            let excelDatas = [{
              tHeader: ["结算月份", "客户名称","客户编码","结算主体名称","结算主体编码","服务客服","实缴金额","结算状态"],
              filterVal: ['settleMonth','unitName',"unitNo", "departName","departNo","customerServerName","sumAll","status"],
              tableDatas: lists,
              sheetName: "财务账单结算监控"
            }]
            this.json2excel(excelDatas, '财务账单结算监控', true, "xlsx")
            this.downLoading = false
            this.selectedRowKeys = []
           }else{
             this.$message.error(res.msg)
           }
         })
      },
      json2excel(tableJson, filenames, autowidth, bookTypes){
      var that = this
      //这个是引用插件
      import("@/vendor/EmployeeContractListExportExcel").then(excel => {
        var tHeader = []
        var dataArr = []
        var sheetnames = []
        for (var i in tableJson) {
          tHeader.push(tableJson[i].tHeader)
          dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
          sheetnames.push(tableJson[i].sheetName)
        }
        excel.export_json_to_excel_more_sheet({
          header: tHeader,
          data: dataArr,
          sheetname: sheetnames,
          filename: filenames,
          autoWidth: autowidth,
          bookType: bookTypes,
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
      
      
      // 数据字典
      initDictConfig() {

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

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
