<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="身份证">
              <a-input
                placeholder="请输入身份证"
                v-model="queryParam.empIdcard"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="姓名">
              <a-input
                placeholder="请输入姓名"
                v-model="queryParam.empName"
              />
            </a-form-item>
          </a-col>

          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算月份">
              <a-input
                placeholder="请输入结算月份"
                :defaultValue="nowMonth"
                v-model="queryParam.settlementMonth"
              />
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算月开始">
                <a-month-picker
                  v-model="queryParam.dateTemp"
                  style="width: 100%"
                  placeholder="请选择开始时间"
                  @change="handleTimeBeginChange"
                  format="YYYYMM"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算月截止">
                <a-month-picker
                  v-model="queryParam.dateTemp1"
                  style="width: 100%"
                  placeholder="请选择结束时间"
                  @change="handleTimeEndChange"
                  format="YYYYMM"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体">
                <a-input
                  placeholder="请输入结算主体名称"
                  v-model="queryParam.settleDepartName"
                >
                </a-input>
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
              <a-form-item label="单位名称">
                <a-input
                  placeholder="请输入单位名称"
                  v-model="queryParam.unitName"
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

    <div
      class="table-operator"
      style="margin-bottom:10px"
    >
      <a-button
        type="primary"
        @click="handleDownload"
      >导出</a-button>
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
        :scroll="{x: 1}"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <template
          slot="operation"
          slot-scope="text, record"
        >
          <a @click="detail(record.id)">详情</a>
        </template>
      </a-table>
    </div>
    <!-- 工资明细详情 -->
    <statement-detail-modal ref="statementDetailModal"></statement-detail-modal>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction,httpAction } from '@/api/manage'
import DetailList from '@/components/tools/DetailList'
import moment from "moment"
import StatementDetailModal from '../searchsalary/modules/StatementDetailModal'

const DetailListItem = DetailList.Item
export default {
  name: "SearchEngingBillList",
  mixins: [JeecgListMixin],
  components: {
    DetailListItem,
    DetailList,
    StatementDetailModal
  },
  data() {
    return{
      queryParam: {},
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      columns:[
        {
          width: 140,
          ellipsis: true,
          title: '姓名',
          dataIndex: 'empName',
          align: 'center',
          key: 'empName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '身份证号',
          align: 'center',
          dataIndex: 'empIdcard',
          key: 'empIdcard',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '手机号码',
          dataIndex: 'empPhone',
          key: 'empPhone',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '银行卡号',
          align: 'center',
          dataIndex: 'bankNo',
          key: 'bankNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '开户行',
          align: 'center',
          dataIndex: 'bankName',
          key: 'bankName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '工资发放时间',
          align: 'center',
          dataIndex: 'salaryGiveTime',
          key: 'salaryGiveTime',
          customRender: text => {
            const resultText = this.salaryGiveTimeOption[text] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '工资月份',
          align: 'center',
          dataIndex: 'salaryDate',
          key: 'salaryDate',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '结算月份',
          align: 'center',
          dataIndex: 'settlementMonth',
          key: 'settlementMonth',
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
          dataIndex: 'settleDepartName',
          key: 'settleDepartName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
        }
      ],
      url: {
        list: 'salary/tengineeraccount/getAccountPage?first=1',
        doExportUrl:'/salary/tengineeraccount/doExportAccount',
        detailUrl:'salary/tengineeraccountitem/getAccountItemByAccountId',
      },
      nowMonth:'',
    }
  },
  created(){
    this.url.list = 'salary/tengineeraccount/getAccountPage'
    this.nowMonth = moment().format("YYYYMM")
  },
  methods: {
    detail(id){
      httpAction(`${this.url.detailUrl}?accountId=${id}`,{},'POST').then((res) => {
        if(res && Array.isArray(res)){
          this.$refs.statementDetailModal.title = '报表详情'
          this.$refs.statementDetailModal.salaryType = 1 // 0:普通薪资 1:工程工资 2:非扣税类，默认普通薪资
          this.$refs.statementDetailModal.saiList = res
          this.$refs.statementDetailModal.show()
        }else {
          this.$message.warning("详情数据有误！")
        }
      })
    },
    // 起始时间选择
    handleTimeBeginChange(date) {
      // 时间格式化
      this.queryParam.settleMonthStart = date ? (date.format("YYYYMM")) : null
    },
    // 截止时间选择
    handleTimeEndChange(date) {
      // 时间格式化
      this.queryParam.settleMonthEnd = date ? (date.format("YYYYMM")) : null
    },
    //导出
    handleDownload(){
      var params = this.getQueryParams()//查询条件
      let ids = ''
      if(this.selectedRowKeys.length > 0){
        for (let a = 0; a < this.selectedRowKeys.length; a++) {
          if (a === this.selectedRowKeys.length - 1) {
            ids += `'${this.selectedRowKeys[a]}'`
          } else {
            ids += `'${this.selectedRowKeys[a]}',`
          }
        }
        params = {}
      }
      const url = `${this.url.doExportUrl}?idStr=${ids}`
      getAction(url,params,60000).then((res) => {
        if(Number(res.code) === 200){
          const engineerAccountList = res.data.engineerAccountList
          const accountTitle = res.data.accountTitle
          for(const d in engineerAccountList){
            engineerAccountList[d].salaryStyle = this.salaryStyleOption[engineerAccountList[d].salaryStyle]
            engineerAccountList[d].salaryGiveTime = this.salaryGiveTimeOption[engineerAccountList[d].salaryGiveTime]
            engineerAccountList[d].salaryTaxFlag = this.isFlag[engineerAccountList[d].salaryTaxFlag]
            engineerAccountList[d].socialPriority = this.socialPriorityOption[engineerAccountList[d].socialPriority]
            engineerAccountList[d].fundPriority = this.fundPriorityOption[engineerAccountList[d].fundPriority]
            engineerAccountList[d].annualBonusType = this.annualBonusTypeOption[engineerAccountList[d].annualBonusType]
            engineerAccountList[d].isDeductSocial = this.isFlag[engineerAccountList[d].isDeductSocial]
            engineerAccountList[d].isDeductFund = this.isFlag[engineerAccountList[d].isDeductFund]
            engineerAccountList[d].salaryCount = engineerAccountList[d].salaryCount ? engineerAccountList[d].salaryCount : ''
            if(accountTitle){
              for(const c in accountTitle){
                engineerAccountList[d][accountTitle[c]] = ''
                let saiList = engineerAccountList[d].saiList
                for(const m in saiList){
                  if(String(saiList[m].javaFiedName) === String(accountTitle[c])){
                    engineerAccountList[d][accountTitle[c]] = saiList[m].salaryMoney
                  }
                }
              }
            }
          }
          const isDeductSocial = engineerAccountList.length > 0 ? engineerAccountList[0]['isDeductSocial'] : ''
          let engineerAccountListHeader
          let engineerAccountListValue
          if(isDeductSocial == 1){
            engineerAccountListHeader  = ["工资月份","结算月份","结算主体","姓名","身份证号","手机号码","银行卡号","开户行","工资发放方式","工资发放次数","工资发放时间","社保扣缴月份",
              "社保优先级","是否扣除社保"]
            engineerAccountListValue =  ["salaryDate", "settlementMonth","settleDepartName", "empName", "empIdcard","empPhone", "bankNo", "bankName", "salaryStyle","salaryCount","salaryGiveTime","deduSocialMonth",
              "socialPriority","isDeductSocial"] 
          }else{
            engineerAccountListHeader  = ["工资月份","结算月份","结算主体","姓名","身份证号","手机号码","银行卡号","开户行","工资发放方式","工资发放次数","工资发放时间"]
            engineerAccountListValue =  ["salaryDate", "settlementMonth", "settleDepartName", "empName", "empIdcard","empPhone", "bankNo", "bankName", "salaryStyle","salaryCount","salaryGiveTime"] 
          }
          //工资明细详情字段组装     
          if(accountTitle){
            for(const c in accountTitle){
              engineerAccountListHeader.push(c)
              engineerAccountListValue.push(accountTitle[c])
            }
          }
          var excelDatas = [
            {
              tHeader: engineerAccountListHeader,
              filterVal: engineerAccountListValue,
              tableDatas: engineerAccountList, // 表一的整体json数据
              sheetName: "报账明细"// 表一的sheet名字
            },
          ]
          this.json2excel(excelDatas, "工程报账明细", true, "xlsx")
        }
      })
    },
    json2excel(tableJson, filenames, autowidth, bookTypes){
      var that = this
      //这个是引用插件
      import("@/vendor/ExportEngineExcel").then(excel => {
        var tHeader = []
        var dataArr = []
        var sheetnames = []
        for (var i in tableJson) {
          tHeader.push(tableJson[i].tHeader)
          dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
          sheetnames.push(tableJson[i].sheetName)
        }
        console.log(dataArr)
        excel.export_json_to_excel_more_sheet({
          header: tHeader,
          data: dataArr,
          sheetname: sheetnames,
          filename: filenames,
          autoWidth: autowidth,
          bookType: bookTypes
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
