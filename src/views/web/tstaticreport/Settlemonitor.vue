<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24" >
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="月份">
              <a-month-picker
                placeholder="年月选择"
                format="YYYYMM"
                style="width:100%"
                v-model="queryParam.settleMonth"
                @change="changMonth"
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
            <a-form-item label="结算主体">
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
              <a-form-item label="服务客服">
                <a-input
                  allowClear
                  placeholder="服务客服"
                  v-model="queryParam.customerServerName"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="服务项目">
                <!-- <a-input
                  allowClear
                  placeholder="服务项目"
                  v-model="queryParam.project"
                /> -->
                <a-select
                  showSearch
                  placeholder="服务项目"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.project"
                >
                  <a-select-option v-for="(item, index) in projectOption" :key="index" :value="item">
                    {{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="提醒状态">
                <a-select
                  showSearch
                  placeholder="提醒状态"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.alertStatus"
                >
                  <a-select-option v-for="(item, index) in remindOption" :key="index" :value="index">
                    {{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算状态">
                <a-select
                  showSearch
                  placeholder="结算状态"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.settleStatus"
                >
                  <a-select-option v-for="(item, index) in settleOption" :key="index" :value="index">
                    {{ item }}</a-select-option>
                </a-select>
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
        @click="exportExcel"
        :loading="exportLoading"
        style="margin-right:10px;"
      >导出</a-button>
      <a-button
        type="primary"
        icon="sync"
        :loading="exportLoading"
        @click="synchronism"
      >批量提醒</a-button>
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
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
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
          <a-popconfirm v-if="record.alertStatus == 1&&record.settleStatus == 0" title="确定再次提醒?" @confirm="() => adjustSettle(record,record.id)">
            <a-button type="link" :loading="record.btnLoading">
              再次提醒
            </a-button>
          </a-popconfirm>
          <span v-else>-</span>
        </span>
      </a-table>
    </div>
    
    <!--批量提醒-->
    <a-modal
      title="批量提醒"
      :visible="visible"
      :destroyOnClose="true"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p style="textAlign:center">共选中{{ selecteNum }}条数据，是否再次发送提醒？</p>
    </a-modal>

  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SelectPage from '@/components/jeecg/SelectPage'
import { httpAction} from '@/api/manage'

export default {
  name: 'Settlemonitor',
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
  },
  data(){
    return {
      loading: false,
      btnLoading:false,
      confirmLoading: false,
      exportLoading:false,
      remindOption:['待提醒','已提醒'],
      settleOption:['未结算','已结算'],
      projectOption:['社保、公积金','商险单独','薪资','非人事'],
      dataSource:[],
      visible:false,
      selectCurrentDate:null,
      selectedRowKeys: [],
      selecteNum:0,
      // 表头
      columns: [
        {
          width: 120,
          ellipsis: true,
          title: '月份',
          align: 'center',
          dataIndex: 'settleMonth',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
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
          width: 180,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'deptName',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'deptNo',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '服务客服',
          align: 'center',
          dataIndex: 'customerServerName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '服务项目',
          align: 'center',
          dataIndex: 'project',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '结算周期',
          align: 'center',
          dataIndex: 'cycle',
          customRender: text => {
            const resultText = text>=0?`${text}个月`:'-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '应提醒日期',
          align: 'center',
          dataIndex: 'alertDate',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '提醒状态',
          align: 'center',
          dataIndex: 'alertStatus',
          customRender: text => {
            const res = this.remindOption[text]
            return <a-tooltip title={res}>{res}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '结算状态',
          align: 'center',
          dataIndex: 'settleStatus',
          customRender: text => {
            const res =this.settleOption[text]
            return <a-tooltip title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 150,
          fixed:'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/hrBase/tsettlealertstatistics/page',
        exportExcel:'/hrBase/tsettlealertstatistics/list',
        exportId:'/hrBase/tsettlealertstatistics/getListByIds',
      },
    }
  },
  methods:{
    changMonth(date,dateString){
      this.queryParam.settleMonth = dateString
    },

    // 导出
    exportExcel(){
      let url,method,data;
      if(this.selectedRowKeys.length){
        url = this.url.exportId
        method = 'POST'
        data = this.selectedRowKeys
      }else{
        const qs = require('qs')
        url =JSON.stringify(this.queryParam) != '{}'? this.url.exportExcel + '?' + qs.stringify(this.queryParam):this.url.exportExcel
        method = 'GET'
        data = null
      }
      this.exportLoading = true
      httpAction(url,data,method).then(res=>{
        if(res.code == 200){
          let lists = res.data.map((item)=>{
            return {
              settleMonth:item.settleMonth||'-',
              unitName:item.unitName||'-',
              deptName:item.deptName||'-',
              deptNo:item.deptNo||'-',
              customerServerName:item.customerServerName||'-',
              project:item.project||'-',
              cycle:item.cycle?`${item.cycle}个月`:'-',
              alertDate:item.alertDate||'-',
              alertStatus:this.remindOption[item.alertStatus],
              settleStatus:this.settleOption[item.settleStatus]
            }
          })
          let excelDatas = [{
            tHeader: ["月份", "客户名称","结算主体","结算主体编码","服务客服","服务项目","结算周期","应提醒日期","提醒状态","结算状态"],
            filterVal: ['settleMonth','unitName',"deptName", "deptNo","customerServerName","project","cycle","alertDate","alertStatus","settleStatus"],
            tableDatas: lists,
            sheetName: "结算监控"
          }]
          this.json2excel(excelDatas, '结算监控', true, "xlsx")
        }else{
          this.$message.error(res.msg)
        }
      }).finally(()=>{
        this.exportLoading = false

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
        this.$message.success('导出成功！')
        this.exportLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },

    // 多选
    onSelectChange(selectedRowKeys,selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selecteNum = selectedRows.filter(items=>items.alertStatus==1&&items.settleStatus==0).length
    },

    // 批量提醒
    handleOk(){
      this.confirmLoading = true
       httpAction('/hrBase/tsettlealertstatistics/batchRemind',this.selectedRowKeys,'post').then(res=>{
         if(res.code==200){
           this.$message.success(res.msg)
           this.selectedRowKeys = []
           this.visible = false
           this.confirmLoading = false
         }else{
          this.$message.warning(res.msg)
          this.confirmLoading = false
         }
       }).catch(req=>{
         this.$message.warning(req.msg)
         this.confirmLoading = false
       })
    },
    handleCancel(){
      this.visible = false
      this.selectedRowKeys = []
    },
    // 批量更新
    synchronism(){
      if(!this.selecteNum){
        this.$message.warning('请先选择已提醒未结算的数据！')
      }else{
        this.visible = true
      }
    },
    // 再次提醒
    adjustSettle(record,id){
       this.$set(record, 'btnLoading', true)
       httpAction(`/hrBase/tsettlealertstatistics/remind?id=${id}`,null,'get').then(res=>{
         if(res.code==200){
           this.$message.success(res.msg)
         }else{
          this.$message.warning(res.msg) 
         }
       }).catch((req)=>{
         this.$message.warning(req.msg)
       }).finally(()=>{
         this.$set(record, 'btnLoading', false)
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
.labelTxt{
  :global(.ant-form-item-label) {
    width: 100px !important;
  }
}

</style>


      