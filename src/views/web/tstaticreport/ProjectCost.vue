<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="数据来源" class="labelTxt">
              <a-select
                showSearch
                placeholder="数据来源"
                optionFilterProp="children"
                :allowClear="true"
                :dropdownMatchSelectWidth="false"
                v-model="queryParam.dataSource"
              >
                <a-select-option value="1">固资划转</a-select-option>
                <a-select-option value="0">企业微信</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="报销单编号" class="labelTxt">
              <a-input
                placeholder="报销单编号"
                v-model="queryParam.reimburseFormCode"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="申请人" class="labelTxt">
              <a-input
                placeholder="申请人"
                v-model="queryParam.applyUserName"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="申请时间" class="labelTxt">
                <a-range-picker v-model="queryParam.applyDate_extra" @change="changeDate"></a-range-picker>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体" class="labelTxt">
                <select-page
                  :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                  :title="'departName'"
                  :placeholder="'请输入结算主体'"
                  v-model="queryParam.settleDomainName"
                  :id="'departName'"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体编码" class="labelTxt">
                <a-input
                  placeholder="结算主体编码"
                  v-model="queryParam.settleDomainCode"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="费用类型" class="labelTxt">
                <a-input
                  placeholder="费用类型"
                  v-model="queryParam.feeTypeName"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算状态" class="labelTxt">
                <a-select
                  showSearch
                  placeholder="结算状态"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.reimburseFormStatus"
                >
                  <a-select-option v-for="(item, index) in statusOption" :key="index" :value="index">
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
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item @click="exportExcel(0)">导出列表</a-menu-item>
          <a-menu-item @click="exportExcel(1)">导出明细</a-menu-item>
        </a-menu>
        <a-button style="margin-right:5px">导出列表
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-button
        type="primary"
        icon="sync"
        :loading="loading"
        style="margin-right:5px;"
        v-has="'wxhr:wxsalaryauth'"
        @click="synchronism"
      >手动同步</a-button>
      <a-button
        type="primary"
        :loading="loading"
        style="margin-right:5px;"
        @click="adjustSettle"
      >结算主体调整</a-button>
      <a-button
        type="primary"
        :loading="loading"
        @click="batchTransfer"
        :disabled="!selectedRowKeys.length"
      >批量划转</a-button>

    </div>
    <div style="text-align:right;margin-bottom: 10px;">
      合计：总金额:{{ total.allMoney||0 }}; 项目成本:{{ total.projectMoney||0 }}&nbsp;&nbsp;&nbsp;增值服务费:{{ total.serviceMoney||0 }}&nbsp;&nbsp;&nbsp;招投标金额:{{ total.biddingMoney||0 }}&nbsp;&nbsp;&nbsp;固资:{{ total.fixedAssets||0 }}&nbsp;&nbsp;&nbsp;未结算:{{ total.reimburseTotalMoney||0 }}&nbsp;&nbsp;&nbsp;结算率:{{ translateRate(total.settlePercent) }}
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
      @change="handleTableChange"
      :scroll="{x: 1}"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
    >
      <span
        slot="action"
        slot-scope="text, record"
      >
        <a @click="handleInfo(record)">详情</a>
        <a-divider type="vertical" v-if="record.feeType==2&&record.unsettledMoney!=0"/>
        <a @click="handleTransfer(record)" v-if="record.feeType==2&&record.unsettledMoney!=0">固资划转</a>
        <a-divider type="vertical" v-if="record.feeType==2&&record.transferMoney>0"/>
        <a @click="handleDiary(record)" v-if="record.feeType==2&&record.transferMoney>0">划转日志</a>
      </span>
    </a-table>
    <adjust-depart-modal ref="AdjustDepartForm" @ok="modalFormOk"></adjust-depart-modal>
    <transfer-batch-modal ref="TransferBatchForm" @ok="modalFormOk"></transfer-batch-modal>
    <project-cost-detail-modal ref="ProjectCostDetailForm" ></project-cost-detail-modal>
    <project-costransfer-modal ref="ProjectCostransferFrom" @ok="modalFormOk"></project-costransfer-modal>
    <!--手动同步-->
    <a-modal
      title="手动同步"
      :visible="visible"
      :destroyOnClose="true"
      okText="更新"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form" :label-col="{ span: 7}" :wrapper-col="{ span: 15 }">
        <a-form-item label="流程申请周期" required>
          <a-range-picker
            @change="changeFormdata"
            @openChange="openChange"
            @calendarChange="calendarChange"
            :disabled-date="disabledDate" 
            format="YYYY-MM-DD"
            v-decorator="['rangeTime', { rules: [{ required: true, message: '请选择流程申请周期！' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SelectPage from '@/components/jeecg/SelectPage'
import AdjustDepartModal from './modules/AdjustDepartModal'
import TransferBatchModal from './modules/TransferBatchModal'
import ProjectCostDetailModal from './modules/ProjectCostDetailModal' //详情
import ProjectCostransferModal from './modules/ProjectCostransferModal' //固资划转和划转日志
import { httpAction } from '@/api/manage'
import { formatFloat } from '@/utils/common'
import moment from 'moment'

export default {
  name: 'ProjectCost',
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
    AdjustDepartModal,
    TransferBatchModal,
    ProjectCostDetailModal,
    ProjectCostransferModal
  },
  data(){
    return {
      loading: false,
      confirmLoading: false,
      dataSource:[],
      visible:false,
      form:this.$form.createForm(this),//手动更新
      selectCurrentDate:null,
      statusOption:['未关联','结算中','已结算','划转完结'],
      // 表头
      columns: [
        {
          width: 100,
          ellipsis: true,
          title: '数据来源',
          align: 'center',
          dataIndex: 'dataSource',
          customRender: text => {
            const res = text == 1 ? '固资划转' : '企业微信';
            return <a-tooltip title={res}>{res}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '报销单编号',
          align: 'center',
          dataIndex: 'reimburseFormCode',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '申请人',
          align: 'center',
          dataIndex: 'applyUserName',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '申请时间',
          align: 'center',
          dataIndex: 'applyDate',
          customRender: text => {
            const res = text ? text.substring(0,10) : ''
            return <a-tooltip title={res}>{res}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleDomainName',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'settleDomainCode',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '费用类型',
          align: 'center',
          dataIndex: 'feeTypeName',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '结算状态',
          align: 'center',
          dataIndex: 'reimburseFormStatus',
          customRender: text => {
            const res = this.statusOption[text];
            return <a-tooltip title={res}>{res}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '报销金额',
          align: 'center',
          dataIndex: 'projectMoney',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '应结金额',
          align: 'center',
          dataIndex: 'shouldMoney',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '未结算',
          align: 'center',
          dataIndex: 'unsettledMoney',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '到期未结算',
          align: 'center',
          dataIndex: 'unsettledDueMoney',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '已结算',
          align: 'center',
          dataIndex: 'settledMoney',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '划出金额',
          align: 'center',
          dataIndex: 'transferMoney',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '招投标费用-历史',
          align: 'center',
          dataIndex: 'biddingMoney',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 200,
          fixed:'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/salary/tstatisticsprojectreimburse/page',
        total:'/salary/tstatisticsprojectreimburse/summationByParams'
      },
      total:{
        allMoney: 0,
        projectMoney:0,
        biddingMoney:0,
        fixedAssets: 0,
        settlePercent:0,
        reimburseTotalMoney:0,
      },
      batchId: [],
      sum:0
    }
  },
  
  created(){
    this.getStatic()
  },
  methods:{
    changeDate(value, dateString){
      if(Object.keys(value).length){
        this.queryParam.applyStartDate = dateString[0] + ' 00:00:00'
        this.queryParam.applyEndDate = dateString[1] + ' 23:59:59'
      }else{
        delete this.queryParam.applyStartDate
        delete this.queryParam.applyEndDate
      }
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      const _this = this;
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
      this.sum = 0;
      this.batchId = selectionRows.map(item=>{
        if(item.feeType == 2){
          _this.sum += Number(item.unsettledMoney)
        }
        return item.id;
      })
      _this.sum = formatFloat(_this.sum);
    },
    exportExcel(type){
      // eslint-disable-next-line
      const queryParam = _.cloneDeep(this.queryParam);
      delete queryParam.applyDate_extra;
      let params = {type:type};
      if(Object.keys(queryParam).length){
        params = {...params,...queryParam};
      }
      if(this.selectedRowKeys.length){
        params = {...params,...{ids:this.selectedRowKeys.join(',')}};
      }
      const qs = require('qs');
      params = qs.stringify(params);
      this.loading = true;
      httpAction(`/salary/tstatisticsprojectreimburse/selectProjectReimburse?${params}`,null,'get').then(res=>{
        if(res.code === 200){
          const lists = res.data.map(item=>{
            item.reimburseFormStatus = this.statusOption[item.reimburseFormStatus];
            item.dataSource = item.dataSource == 1 ? '固资划转' : '企业微信';
            item.applyDate = item.applyDate ? item.applyDate.substring(0,10) : '';
            item.settleMonth = item.settleMonth || '-';
            item.status = item.status != null ? this.statusOption[item.status] : '-';
            return item;
          });
          let head = [];
          let fields = [];
          if(type==1){
            head = ["数据来源", "报销单编号","申请人","申请时间","结算主体","结算主体编码","费用类型",'结算月份','结算状态','结算金额'];
            fields = ['dataSource','reimburseFormCode',"applyUserName", "applyDate","settleDomainName","settleDomainCode","feeTypeName",
            'settleMonth','status','settleFee'];
          }else{
            head = ["数据来源", "报销单编号","申请人","申请时间","结算主体","结算主体编码","费用类型","结算状态","报销金额","应结金额","未结算","到期未结算","已结算","划出金额"];
            fields = ['dataSource','reimburseFormCode',"applyUserName", "applyDate","settleDomainName","settleDomainCode","feeTypeName","reimburseFormStatus",
            "projectMoney","shouldMoney","unsettledMoney","unsettledDueMoney","settledMoney","transferMoney"];
          }
          
          const excelDatas = [{
            tHeader: head,
            filterVal: fields,
            tableDatas: lists,
            sheetName: `报销单${type==1?'明细':'列表'}`
          }]
          this.json2excel(excelDatas, `报销单${type==1?'明细':'列表'}${moment().format('YYYYMMDD')}`, true, "xlsx");
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    json2excel(tableJson, filenames, autowidth, bookTypes){
      var that = this
      //这个是引用插件
      import("@/vendor/ExportCommonExcel").then(excel => {
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
        return v[j] || 0;
      }))
    },
    searchQuery(){
      this.getStatic()
      this.loadData(1)
    },
    searchReset() {
      this.queryParam = {}
      this.selectedRowKeys = []
      this.getStatic()
      this.loadData(1)
    },
    // 详情
    handleInfo(record){
      this.$refs.ProjectCostDetailForm.title = record.feeTypeName + '-详情'
      this.$refs.ProjectCostDetailForm.show(record)
    },
    // 固资划转
    handleTransfer(record){
      this.$refs.ProjectCostransferFrom.show(record)
    },
    // 规划日志
    handleDiary(record){
      this.$refs.ProjectCostransferFrom.title = '划转日志'
      this.$refs.ProjectCostransferFrom.show(record,true)
    },
    // 转换利率
    translateRate(percent){
      return Math.round(parseFloat(percent||0)*1000)/10 + '%'
    },
    // 处理打开日期面板事件
    openChange (val) {
      if (val) {
        this.selectCurrentDate = this.form.rangeTime? this.form.rangeTime[0] : null
      }
    },
     // 点击面板时间事件  获取手动选择的时间段起始值
    calendarChange (date) {
      if (date.length <= 1) {
        this.selectCurrentDate = date[0]
      } else {
        this.selectCurrentDate = null
      }
    },

      // 设置禁用时间段
    disabledDate (current) {
      if (this.selectCurrentDate != null) {
        // 在开始时间的前后范围30天
        return current < moment(this.selectCurrentDate).add(-30, 'days') || current > moment(this.selectCurrentDate).add(30, 'days')
      }
      return false
    },

    changeFormdata(value,dateString){
      if(Object.keys(value).length){
        this.form.startTime = dateString[0]
        this.form.endTime = dateString[1]
      }else{
        delete this.form.startTime
        delete this.form.endTime
      }
    },
    handleOk(){
      this.form.validateFields((err) => {
        if (!err) {
          const url = `/salary/wxSalary/getWxInfoAndSave?startTime=${this.form.startTime}&endTime=${this.form.endTime}`
          this.loading = true
          this.confirmLoading = true
          httpAction(url,null,'post',80000).then(res=>{
            if(res.code === 200){
              this.$message.success('更新成功！');
              this.loadData(1);
              this.getStatic();
               this.visible =false;
            }else{
              this.$message.warning(res.msg)
            }
          }).finally(() => {
              this.loading = false
              this.confirmLoading = false
          })
        }
      })
      
    },
    handleCancel(){
      this.visible = false
    },
    // 手动同步
    synchronism(){
      this.visible = true
    },
    getStatic(){
      // eslint-disable-next-line
      const queryParam = _.cloneDeep(this.queryParam)
      delete queryParam.applyDate_extra
      let params = ''
      if(Object.keys(queryParam).length){
        const qs = require('qs')
        params = qs.stringify(queryParam)
      }
      const url = `${this.url.total}?${params}`
      httpAction(url,null,'get').then(res=>{
        if(res.code === 200){
          this.total = res.data
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    adjustSettle(){
      this.$refs.AdjustDepartForm.show();
    },
    batchTransfer(){
      this.$refs.TransferBatchForm.title = '固资划转-批量';
      this.$refs.TransferBatchForm.show(this.batchId,this.sum);
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
  margin-bottom: 10px;
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


      