<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="5"
            :sm="7"
          >
            <a-form-item label="客户单位">
              <select-page
                :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                :title="'customerName'"
                :placeholder="'请输入客户单位'"
                v-model="queryParam.unitId"
                :id="'id'"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="5"
            :sm="7"
          >
            <a-form-item label="结算主体">
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :placeholder="'请输入结算主体'"
                v-model="queryParam.deptId"
                :id="'id'"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="4"
            :sm="6"
          >
            <a-form-item label="月份">
              <a-month-picker
                placeholder="月份"
                @change="changeMonth"
                format="YYYYMM"
                :disabled-date="disabledDate"
                v-model="staticMonth.increase"
                :allowClear="false"
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
                icon="download"
                style="margin-left: 8px"
                :loading="confirmLoading"
                @click="exportIncreaseEmploee"
              >导出报表</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="column"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange"
    >
    </a-table>
  </a-card>
</template>

<script>

import { httpAction,getAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
import SelectPage from '@/components/jeecg/SelectPage'
import moment from 'moment'

export default {
  name: 'DecreaseEmployeesModal',
  components:{
    SelectPage
  },
  data() {
    return {
      loading:false,
      confirmLoading:false,
      dataSource:[],
      queryParam:{
      },
      staticMonth:{
        increase:''
      },
      ipagination:{
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0
      },
      column:[
        {
          title: '月份',
          align: 'center',
          dataIndex: 'month',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '档案地',
          align: 'center',
          dataIndex: 'address',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'empName',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '身份证',
          align: 'center',
          dataIndex: 'empIdcard',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '员工类型',
          align: 'center',
          dataIndex: 'empType',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '单位名称',
          align: 'center',
          dataIndex: 'customerName',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '结算主体',
          align: 'center',
          dataIndex: 'departName',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'departNo',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
      ],
      url: {
        list: '/hrBase/tempaddreport/page',
      },
    }
  },
  created() {
    const lastMonth = moment(new Date()).subtract(1,'months')
    this.staticMonth.increase = lastMonth
    this.queryParam.month = lastMonth.format('YYYYMM')
  },
  methods:{
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },
    changeMonth(val,option){
      this.queryParam.month = option
    },
    handleTableChange(pagination){
      this.ipagination = pagination
      this.loadRemoteData(pagination.current)
    },
    searchQuery(){
      this.loadRemoteData()
    },
    handleParams(){
      this.queryParam.current = this.ipagination.current
      this.queryParam.size = this.ipagination.pageSize
      // eslint-disable-next-line
      return filterObj(_.cloneDeep(this.queryParam))
    },
    loadRemoteData(page){
      this.ipagination.current = page ? page : 1
      const param = this.handleParams()
      this.loading = true
      getAction(this.url.list, param).then((res) => {
        if(res.code === 200){
          this.dataSource = res.data.records
          this.ipagination.total = res.data.total
        }else{
          this.$message.warn(res.msg)
        }
      }).finally(()=>{
        this.loading = false
      })
    },
    exportIncreaseEmploee(){
      const param = this.handleParams()
      delete param.current
      delete param.size
      const qs = require('qs')
      const params = qs.stringify(param)
      this.confirmLoading = true
      httpAction(`/hrBase/tempaddreport/exportList?${params}`,null,'get').then(res=>{
        if(res.code === 200){
          if(res.data.length === 0){
            this.$message.warn('暂无数据!')
            this.confirmLoading = false
            return
          }
          // 封面数据
          const excelDatas = [{
            tHeader: ['地市','姓名','身份证','人员类型','单位','结算主体','结算主体编码'],
            filterVal: ['address','empName','empIdcard','empType','customerName','departName','departNo'],
            tableDatas: res.data,
            sheetName: "当月增加人员明细统计"
          }]
          this.json2excel(excelDatas, `档案月报-增员${param.month}`, true, "xlsx",true)
        }else{
          this.$message.warn(res.msg)
        }
      })
    },
    json2excel(tableJson, filenames, autowidth, bookTypes,typeLength) {
      var that = this
      import('./ExportEmployee').then(excel => {
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
          bookType: bookTypes,
          autoLength: typeLength, // 所有类型长度
        })
        that.confirmLoading = false
      });
    },
    formatJson(filterVal, jsonData) {
      const res = jsonData.map(v => filterVal.map(j => {
        return v[j] || 0
      }))
      return res
    },

  }

}
</script>