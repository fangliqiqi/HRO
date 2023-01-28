<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form 
        layout="inline"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-row 
          :gutter="24" 
        >
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="出账月份">
              <a-month-picker
                placeholder="请选择出账月份"
                style="width:100%"
                format="YYYYMM"
                valueFormat="YYYYMM"
                :defaultValue="queryParam.billMonth"
                v-model="queryParam.billMonth"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="二级归属部门">
              <a-select 
                :allowClear="true"
                placeholder="请选择二级归属部门" 
                show-search 
                v-model="queryParam.incomeBelongSubName"
              >
                <a-select-option
                  v-for="item in incomeBelongSubOptions"
                  :key="item.id"
                  :value="item.organName"
                >
                  <a-tooltip>
                    <template slot="title">
                      {{ item.organName }}
                    </template>
                    {{ item.organName }}
                  </a-tooltip>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体名称">
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :placeholder="'结算主体'"
                v-model="queryParam.deptId"
                :id="'id'"
              ></select-page>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体编码">
                <a-input
                  allowClear
                  placeholder="结算主体编码"
                  v-model="queryParam.deptNo"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="回款状态">
                <a-select
                  showSearch
                  mode="multiple"
                  placeholder="请选择回款状态"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  @change="handleMulChange"
                  v-model="queryParam.backPayStatus_extra"
                >
                  <a-select-option v-for="(item, index) in returnOption" :key="index" :value="index">
                    {{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="占用产生月份">
                <a-month-picker
                  placeholder="请选择占用产生月份"
                  style="width:100%"
                  format="YYYYMM"
                  valueFormat="YYYYMM"
                  :defaultValue="queryParam.createMonth"
                  v-model="queryParam.createMonth"
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
        :loading="downLoading"
        @click="exportExcel"
        style="margin-right:10px;"
      >导出</a-button>
    </div>
    <!-- table区域-begin -->
    <div style="text-align:right;margin-bottom: 10px;">
      占用额度:{{ allUseMoney }}
    </div>
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
          <a @click="handleDetail(record)">详情</a>
        </span>
      </a-table>
    </div>

    <advance-payment-detail-module ref="detailModal"></advance-payment-detail-module>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SelectPage from '@/components/jeecg/SelectPage'
import AdvancePaymentDetailModule from '../approvalcenter/modules/AdvancePaymentDetailModule'
import {initDictOptions} from '@/components/dict/JDictSelectUtil'
import { httpAction} from '@/api/manage'
import moment from 'moment'

export default {
  name: 'AdvanceAmountUseList',
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
    AdvancePaymentDetailModule
  },
  data(){
    return {
      loading: false,
      downLoading:false, //导出
      returnOption:['待回款','部分回款','已回款'],//回款状态
      dataSource:[],//列表数据
      incomeBelongSubOptions:[],//二级归属部门
      queryParam:{
        billMonth:moment().add(-1,'months').format('YYYYMM')
      },
      allUseMoney:0,//占用额度
      customerTypeDicts:[],
      advanceTypeDicts: [],
      labelCol: {
        xs: { span: 6 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span:14}
      },
      // 表头
      columns: [
        {
          width: 120,
          ellipsis: true,
          title: '垫付出账月份',
          align: 'center',
          dataIndex: 'billMonth',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '二级归属部门',
          align: 'center',
          dataIndex: 'incomeBelongSubName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '垫付编号',
          align: 'center',
          dataIndex: 'advancePaymentNo',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        
        {
          width:160,
          ellipsis: true,
          title: '垫付金额',
          align: 'center',
          dataIndex: 'advanceMoney',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '结算主体名称',
          align: 'center',
          dataIndex: 'deptName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'deptNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '申请日期',
          align: 'center',
          dataIndex: 'advanceCreateTime',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '出账时间',
          align: 'center',
          dataIndex: 'salaryRevenueTime',
          customRender: text => {
            const resultText = moment(text).format('YYYY-MM-DD') || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '回款状态',
          align: 'center',
          dataIndex: 'backPayStatus',
          customRender: text => {
            const res =this.returnOption[text]||'-'
            return <a-tooltip title={res}>{res}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '占用额度',
          align: 'center',
          dataIndex: 'useMoney',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '占用产生月份',
          align: 'center',
          dataIndex: 'createMonth',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 120,
          fixed:'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/hrApproval/tadvanceusedetail/page',
        getAllUseMoney:'/hrApproval/tadvanceusedetail/getAllUseMoney',//暂用额度
        exportExcel:'/hrApproval/tadvanceusedetail/exportTAdvanceUseDetail',
        getOrgForCus:'/admin/organizationinfo/getOrgForCus?type=0&useType=2',//二级归属部门
        getContractInfo: '/hrBase/tcustomercontract/',
        getAttaInfos: '/hrApproval/tpaymentattainfo/geteAttas/',
      },
    }
  },
  created(){
    this.getAllUseMoney()
  },
  methods:{
    // 下拉多选
    handleMulChange(val){
      if(val.length!=0){
        this.queryParam.backPayStatus = val.join(',')
      }else{
        delete this.queryParam.backPayStatus
      }
    },
    // 获取占用额度
    getAllUseMoney(){
      // eslint-disable-next-line
      const queryParam =  _.cloneDeep(this.queryParam)
      delete queryParam.backPayStatus_extra
      let params = ''
      if(Object.keys(queryParam).length){
        const qs = require('qs')
        params = qs.stringify(queryParam)
      }
      const url = `${this.url.getAllUseMoney}?${params}`
      httpAction(url,null,'get').then(res=>{
        if(res.code === 200){
          this.allUseMoney = res.data
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    //查询
    searchQuery(){
      this.getAllUseMoney()
      this.loadData(1)
    },
    // 重置
    searchReset() {
      this.queryParam = {}
      this.getAllUseMoney()
      this.loadData(1)
    },
    // 详情
    handleDetail(record) {
      record.id = record.advanceId
      this.$refs.detailModal.title = '详情'
      this.$refs.detailModal.customerTypeDicts = this.customerTypeDicts //字典数据
      this.$refs.detailModal.advanceTypeDicts = this.advanceTypeDicts //字典
      httpAction(this.url.getAttaInfos + record.id, null, 'GET').then((re) => {
        this.$refs.detailModal.fileList = re.data
        this.$refs.detailModal.show(record)
      })
      
    },

    // 导出
    exportExcel(){
      this.downLoading = true
      const qs = require('qs')
      const url =JSON.stringify(this.queryParam) != '{}'? this.url.exportExcel + '?' + qs.stringify(this.queryParam):this.url.exportExcel
      httpAction(url,{},'GET').then(res=>{
        if(res.code == 200){
          let lists = res.data.map((item)=>{
            return {
              billMonth:item.billMonth||'-',
              incomeBelongSubName:item.incomeBelongSubName||'-',
              advancePaymentNo:item.advancePaymentNo||'-',
              advanceMoney:item.advanceMoney||'-',
              deptName:item.deptName||'-',
              deptNo:item.deptNo||'-',
              advanceCreateTime:item.advanceCreateTime||'-',
              salaryRevenueTime:item.salaryRevenueTime||'-',
              backPayStatus:this.returnOption[item.backPayStatus],
              useMoney:item.useMoney||'-',
              createMonth:item.createMonth||'-'
            }
          })
          let excelDatas = [{
            tHeader: ["垫付出账月份", "二级归属部门","垫付编号","垫付金额","结算主体名称","结算主体编码","申请日期","出账时间","回款状态","占用额度","占用产生月份"],
            filterVal: ['billMonth','incomeBelongSubName',"advancePaymentNo", "advanceMoney","deptName","deptNo","advanceCreateTime","salaryRevenueTime","backPayStatus","useMoney","createMonth"],
            tableDatas: lists,
            sheetName: "垫付额度使用明细"
          }]
          this.json2excel(excelDatas, '垫付额度使用明细', true, "xlsx")
          this.downLoading = false
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

    // 初始
    initDictConfig(){
      // 获取二级部门
      httpAction(this.url.getOrgForCus,'','GET').then(res=>{
        if(res.code==200){
          this.incomeBelongSubOptions = res.data
        }else{
          this.$message.error(res.msg);
        }
      })
      initDictOptions('ADVANCE_CUSTOMER_TYPE').then((res) => {
        if (res.code === 200) {
          this.customerTypeDicts = res.data;
        }
      });
      initDictOptions('ADVANCE_ADVANCE_TYPE').then((res) => {
        if (res.code === 200) {
          this.advanceTypeDicts = res.data;
        }
      });
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
.labelTxt{
  :global(.ant-form-item-label) {
    width: 100px !important;
  }
}

</style>
