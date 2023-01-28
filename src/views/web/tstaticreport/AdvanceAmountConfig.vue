<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form 
        layout="inline"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        class="labelTxt"
      >
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="年份">
              <a-date-picker
                placeholder="年份选择"
                format="YYYY"
                valueFormat="YYYY"
                mode="year"
                :open="isOpen"
                :defaultValue="moment()"
                style="width:100%"
                v-model="queryParam.year"
                @panelChange="changYear"
                @openChange="changeOpen"
                :allowClear="false"
              />
            </a-form-item>
          </a-col>

          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="二级归属部门" >
              <a-select 
                :allowClear="true"
                placeholder="请选择二级归属部门" 
                show-search
                v-model="queryParam.incomeBelongSubName"
                :defaultValue="'集团客户部'"
                style="width:100%"
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
            <a-form-item label="占用状态" :labelCol="{ span:7 }">
              <a-select
                showSearch
                placeholder="请选择占用状态"
                optionFilterProp="children"
                :allowClear="true"
                :dropdownMatchSelectWidth="false"
                v-model="queryParam.useStatus"
              >
                <a-select-option v-for="(item, index) in holdOption" :key="index" :value="index">
                  {{ item }}</a-select-option>
              </a-select>
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
    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        v-has="'wxhr:tadvanceuseset_add'"
        @click="handleAdd"
      >新增</a-button>
      <!-- 导入 -->
      <a-dropdown v-has="'wxhr:tadvanceuseset_add'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.importExcelUrl)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />导入
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downTemplate('/templates/垫付额度配置模板.xlsx')">
            <a-icon type="download" />模板下载
          </a-menu-item>
        </a-menu>
        <a-button>导入
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-button
        type="primary"
        icon="download"
        @click="exportExcel"
      >导出</a-button>
      <a-button
        type="primary"
        icon="delete"
        v-has="'wxhr:tadvanceuseset_del'"
        @click="handleDeletes"
      >批量删除</a-button>
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
          slot="advanceLimitUsed"
          slot-scope="text, record"
        >
          <a-tooltip>
            <template slot="title">
              {{ (Number(record.advanceLimitUsed) + Number(record.advanceLimitUsedTemp)).toFixed(2) }}
            </template>
            {{ (Number(record.advanceLimitUsed) + Number(record.advanceLimitUsedTemp)).toFixed(2) }}
          </a-tooltip>
        </span>
        <span
          slot="useStatus"
          slot-scope="text, record"
        >
          <a-tooltip>
            <template slot="title">
              {{ record | getuseStatus }}
            </template>
            {{ record | getuseStatus }}
          </a-tooltip>
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">占用明细</a>
          <a-divider type="vertical" v-has="'wxhr:tadvanceuseset_edit'"/>
          <a 
            v-has="'wxhr:tadvanceuseset_edit'"
            @click="handleEdit(record)"
          >编辑</a>
          <a-divider type="vertical" v-has="'wxhr:tadvanceuseset_del'" v-if="record.useStatus!=0"/>
          <a-popconfirm
            v-has="'wxhr:tadvanceuseset_del'"
            v-if="record.useStatus !=0"
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>

    <!-- 新增、编辑弹窗 -->
    <advance-amount-config-modal ref="modalForm" @ok="modalFormOk"></advance-amount-config-modal>
    <error-modal ref="errorModal"></error-modal>
    <!-- 占用明细 -->
    <advance-amount-use-detail-modal ref="detailmodelForm"></advance-amount-use-detail-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SelectPage from '@/components/jeecg/SelectPage'
import AdvanceAmountConfigModal from './modules/AdvanceAmountConfigModal'
import AdvanceAmountUseDetailModal from './modules/AdvanceAmountUseDetailModal' //占用明细
import ErrorModal from '../../web/global/modules/ErrorModal'
import { httpAction} from '@/api/manage'
import moment from 'moment'

export default {
  name: 'AdvanceAmountConfig',//垫付额度配置
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
    AdvanceAmountConfigModal,
    AdvanceAmountUseDetailModal,
    ErrorModal
  },
  data(){
    return {
      loading: false,
      isOpen:false,
      holdOption:['未占用','部分占用','全部占用'],
      dataSource:[],
      incomeBelongSubOptions:[],//二级归属部门
      visible:false,
      exportLoading:false,
      queryParam:{
        year:moment().format('YYYY')
      },
      labelCol: {
        sm: { span: 7 }
      },
      wrapperCol: {
        sm: { span:16 }
      },
      // 表头
      columns: [
        {
          width: 200,
          ellipsis: true,
          title: '年份',
          align: 'center',
          dataIndex: 'year',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 380,
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
          width: 200,
          ellipsis: true,
          title: '垫付额度',
          align: 'center',
          dataIndex: 'advanceLimit',
          customRender: text => {
            const resultText = text!=null?text:'-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        
        {
          width: 200,
          ellipsis: true,
          title: '已占用额度',
          align: 'center',
          dataIndex: 'advanceLimitUsed',
          scopedSlots: { customRender: 'advanceLimitUsed' },
        },
        {
          width: 200,
          ellipsis: true,
          title: '剩余可用额度',
          align: 'center',
          dataIndex: 'advanceLimitUsable',
          customRender: text => {
            const resultText = text!= null?text:'-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '占用状态',
          align: 'center',
          dataIndex: 'useStatus',
          scopedSlots: { customRender: 'useStatus' },
          // customRender: text => {
          //   const res = this.holdOption[text] || '-'
          //   return <a-tooltip title={res}>{res}</a-tooltip>
          // }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width:240,
          fixed:'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/hrApproval/tadvanceuseset/page?deleteFlag=0',
        delete:'/hrApproval/tadvanceuseset/removeByIds?deleteFlag=0',//删除（单个+批量）
        importExcelUrl:'/hrApproval/tadvanceuseset/batchImportByJsonString',//导入
        exportExcel:'/hrApproval/tadvanceuseset/searchForExport?deleteFlag=0',//导出
        getOrgForCus:'/admin/organizationinfo/getOrgForCus?type=0&useType=2',//二级归属部门
        getUseDetail:'/hrApproval/tadvanceuseset/getTAdvanceUseDetailUsed',//占用明细
      },
    }
  },
  filters:{
     getuseStatus(val){
       const  limitUsed = Number(val.advanceLimitUsed)+Number(val.advanceLimitUsedTemp)
       const advanceLimit = Number(val.advanceLimit)
      if(limitUsed==0){
        return '未占用'
      }else if(0<limitUsed && limitUsed<advanceLimit){
        return '部分占用'
      }else if(limitUsed>=advanceLimit){
        return '全部占用'
      }
    },
  },
  methods:{
    // 选择年份
    changYear(value){  
      this.queryParam.year = this.moment(value).format('YYYY')
      this.isOpen = false
    },
    // 年份控制面板
    changeOpen(status){
      this.isOpen = status?true:false
    },
    // 重置
    searchReset(){
      this.queryParam = {}
      this.queryParam.year = this.moment().format('YYYY')
      this.loadData();
    },
    // 新增
    handleAdd(){
      this.$refs.modalForm.title='垫付额度配置-新增'
      this.$refs.modalForm.incomeBelongSubOptions = this.incomeBelongSubOptions
      this.$refs.modalForm.show()
    },
    // 模板下载
    downTemplate(templateUrl){
      const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port+templateUrl}`
      window.location.href = url
    },
    //删除
    handleDelete(id){
      const url = this.url.delete+`&ids=${id}`
      httpAction(url,{},'DELETE').then(res=>{
        if (Number(res.code) === 200) {
          this.$refs.errorModal.title = '删除提示'
          res.errorMessageList.map(item=>{
            item.line = item.line-1
            return item
          })
          this.$refs.errorModal.showModal(res.errorMessageList)
          this.loadData()
        } else {
          //兼容
          this.$message.warning(res.msg)
          // this.$refs.errorModal.title = '删除提示'
          // this.$refs.errorModal.showModal(res.errorMessageList)
        }
      })
    },
    //批量删除
    handleDeletes(){
      const qs = require('qs')
      const params = qs.stringify(this.queryParam)
      const url = `${this.url.delete}&${params}`
      let that = this;
      this.$confirm({
        title: '确认删除？',
        content: `确认批量删除搜索条件下的数据？`,
        onOk: function () {
          httpAction(url,'','DELETE').then((res) => {
            if (Number(res.code) === 200) {
              res.errorMessageList.map(item=>{
                item.line = item.line-1
                return item
              })
              that.$refs.errorModal.title = '批量删除提示'
              that.$refs.errorModal.showModal(res.errorMessageList)
              that.loadData()
            } else {
              that.$message.warning(res.msg)
            }
          })
        }
      })
      
    },
    //占用明细
    handleDetail(record){
      const url = `${this.url.getUseDetail}?year=${record.year}&incomeBelongSub=${record.incomeBelongSub}`
      httpAction(url,{},'GET').then(res=>{
        if(res.code==200){
          this.$refs.detailmodelForm.title = `占用明细-${record.incomeBelongSubName}`
          this.$refs.detailmodelForm.show(res.data)
        }else{
          this.$message.warning(res.msg)
        }
      })
      
    },
    // 编辑
    handleEdit(record){
      this.$refs.modalForm.title='垫付额度配置-编辑'
      this.$refs.modalForm.incomeBelongSubOptions = this.incomeBelongSubOptions
      this.$refs.modalForm.edit(record)
    },


    // 导出
    exportExcel(){
      let url,method,data;
      const qs = require('qs')
      url =JSON.stringify(this.queryParam) != '{}'? this.url.exportExcel + '&' + qs.stringify(this.queryParam):this.url.exportExcel
      method = 'GET'
      data = null
      this.exportLoading = true
      httpAction(url,data,method).then(res=>{
        if(res.code == 200){
          let lists = res.data.map((item)=>{
            let useStatus;
            const  limitUsed = Number(item.advanceLimitUsed)+Number(item.advanceLimitUsedTemp)
            const advanceLimit = Number(item.advanceLimit)
            if(limitUsed==0){
              useStatus = '未占用'
            }else if(advanceLimit>limitUsed){
              useStatus ='部分占用'
            }else if(limitUsed>=advanceLimit){
              useStatus = '全部占用'
            }
            return {
              year:item.year||'-',
              incomeBelongSubName:item.incomeBelongSubName||'',
              advanceLimit:item.advanceLimit||0,
              advanceLimitUsed: Number(item.advanceLimitUsed) + Number(item.advanceLimitUsedTemp)  ||0,
              advanceLimitUsable:item.advanceLimitUsable||0,
              useStatus:useStatus
            }
          })
          let excelDatas = [{
            tHeader: ["年份", "二级归属部门","垫付额度","已占用额度","剩余可用额度","占用状态"],
            filterVal: ['year','incomeBelongSubName',"advanceLimit", "advanceLimitUsed","advanceLimitUsable","useStatus"],
            tableDatas: lists,
            sheetName: "垫付额度配置"
          }]
          this.json2excel(excelDatas, '垫付额度配置', true, "xlsx")
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
    
    handleCancel(){
      this.visible = false
    },
    
    // 初始
    initDictConfig(){
      httpAction(this.url.getOrgForCus,'','GET').then(res=>{
        if(res.code==200){
          this.incomeBelongSubOptions = res.data
        }else{
          this.$message.error(res.msg);
        }
      })
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


      