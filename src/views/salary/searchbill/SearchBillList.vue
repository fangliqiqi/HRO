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
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="报账类型">
                <a-select
                  v-model="queryParam.salaryType"
                  placeholder="请选择报账类型"
                  default-value="0"
                  :allowClear="true"
                >
                  <a-select-option
                    v-for="(item,index) in salaryType"
                    :key="index"
                    :value="index"
                  >
                    {{ item }}
                  </a-select-option>
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
    <div
      class="table-operator"
      style="margin-bottom:10px"
    >
      <a-button
        type="primary"
        :loading="downLoading"
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
    <!-- <a-modal
      title="报表详情"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleDetailCancel"
      @ok="handleDetailOk"
      cancelText="关闭"
      :visible="detailVisible"
      :maskClosable="false"
    >
      <a-card :bordered="false">
        <detail-list title="">
          <detail-list-item
            v-for="(item, index) in saiList"
            :key="index"
            :term="item.cnName"
          >{{ item.salaryMoney }}</detail-list-item>
        </detail-list>
      </a-card>
    </a-modal> -->
    <statement-detail-modal ref="statementDetailModal"></statement-detail-modal>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import DetailList from '@/components/tools/DetailList'
import { httpAction,getAction } from '@/api/manage'
import moment from "moment"
const DetailListItem = DetailList.Item
import StatementDetailModal from '../../salary/searchsalary/modules/StatementDetailModal'

export default {
  name: "SearchBillList",
  mixins: [JeecgListMixin],
  components: {
    DetailListItem,
    DetailList,
    StatementDetailModal
  },
  data() {
    return{
      detailVisible: false,
      downLoading: false,
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      salaryTypeOption:{'0':'工资','1':'绩效','2':'其他','3':'劳务费','7':'非扣税项'},
      salaryType:{'0':'工资','1':'绩效','2':'其他','3':'劳务费'},
      saiList:[],
      nowMonth:'',
      columns:[
        {
          width: 140,
          ellipsis: true,
          title: '姓名',
          dataIndex: 'empName',
          key: 'empName',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '工资发放方式',
          dataIndex: 'salaryStyle',
          key: 'salaryStyle',
          align: 'center',
          customRender: text => {
            const resultText = this.salaryStyleOption[text] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '身份证号',
          dataIndex: 'empIdcard',
          key: 'empIdcard',
          align: 'center',
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
          dataIndex: 'bankNo',
          key: 'bankNo',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '开户行',
          dataIndex: 'bankName',
          key: 'bankName',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '报账类型',
          dataIndex: 'salaryType',
          key: 'salaryType',
          align: 'center',
          customRender: text => {
            const resultText = this.salaryTypeOption[text] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
          // 
        },
        {
          width: 140,
          ellipsis: true,
          title: '工资发放时间',
          dataIndex: 'salaryGiveTime',
          key: 'salaryGiveTime',
          align: 'center',
          customRender: text => {
            const resultText = this.salaryGiveTimeOption[text] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '社保扣缴月份',
          dataIndex:'deduSocialMonth',
          key:'deduSocialMonth',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '公积金扣缴月份',
          dataIndex:'deduProvidentMonth',
          align: 'center',
          key:'deduProvidentMonth',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '是否薪资扣税',
          dataIndex:'salaryTaxFlag',
          align: 'center',
          key:'salaryTaxFlag',
          customRender: text => {
            const resultText = this.isFlag[text] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '社保优先级',
          dataIndex:'socialPriority',
          align: 'center',
          key:'socialPriority',
          customRender: text => {
            const resultText = this.socialPriorityOption[text] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '公积金优先级',
          dataIndex:'fundPriority',
          align: 'center',
          key:'fundPriority',
          customRender: text => {
            const resultText = this.fundPriorityOption[text] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '年终奖扣税方案',
          dataIndex:'annualBonusType',
          align: 'center',
          key:'annualBonusType',
          customRender: text => {
            const resultText = this.annualBonusTypeOption[text] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '是否扣除社保',
          dataIndex:'isDeductSocial',
          align: 'center',
          key:'isDeductSocial',
          customRender: text => {
            const resultText = this.isFlag[text] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '是否扣除公积金',
          dataIndex:'isDeductFund',
          align: 'center',
          key:'isDeductFund',
          customRender: text => {
            const resultText = this.isFlag[text] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '工资月份',
          dataIndex: 'salaryDate',
          align: 'center',
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
          dataIndex: 'settlementMonth',
          align: 'center',
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
          dataIndex: 'settleDepartName',
          align: 'center',
          key: 'settleDepartName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          title: '操作',
          fixed: 'right',
          key: 'action',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      url: {
        list: 'salary/tsalaryaccount/getAccountPage?searchBill=1',
        doExportUrl:'/salary/tsalaryaccount/doExportAccount',
        detailUrl:'salary/tsalaryaccountitem/getAccountItemByAccountId',
      },
    }
  },
  created(){
    this.url.list = 'salary/tsalaryaccount/getAccountPage?searchBill=0'
    this.queryParam.settlementMonth = moment().format("YYYYMM")
  },
  methods: {
    moment,
    // 重置
    searchReset() {
      this.queryParam = {}
       this.queryParam.settlementMonth = moment().format("YYYYMM")
      this.selectedRowKeys = []
      if (this.idAreaCitys) {
        this.idAreaCitys = []
      }
      if (this.idAreaTowns) {
        this.idAreaTowns = []
      }
      this.$router.push({
        query: {}
      })
      this.loadData(1)
    },
    // 详情细节
    detail(id){
      httpAction(`${this.url.detailUrl}?accountId=${id}`,{},'POST').then((res) => {
        // this.detailVisible = true
        // this.saiList = res
        if(res && Array.isArray(res)){
          this.$refs.statementDetailModal.title = '报表详情'
          this.$refs.statementDetailModal.saiList = res
          this.$refs.statementDetailModal.show()
        }else {
          this.$message.warning('报表详情数据有误！')
        }
      })
    },
    // 关闭工资明细详情
    handleDetailCancel(){
      this.detailVisible = false
    },
    // 关闭工资明细详情
    handleDetailOk(){
      this.detailVisible = false
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
      this.downLoading = true
      let params = this.getQueryParams()//查询条件
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
      getAction(url,params,300000).then((res) => {
        if(Number(res.code) === 200){
          let salaryAccountList = res.data.salaryAccountList
          let titleSortList = res.data.titleSortList
          let salaryAccountListHeader = ["工资月份","结算月份","结算主体","姓名","银行卡号","手机号码","开户行","报账类型","身份证号","工资发放方式","工资发放时间","社保扣缴月份",
              "公积金扣缴月份","是否薪资扣税","社保优先级","公积金优先级","年终奖扣税方案","是否扣除社保","是否扣除公积金"]
          let salaryAccountListValue =  ["salaryDate", "settlementMonth","settleDepartName", "empName", "bankNo", "empPhone","bankName", "salaryType","empIdcard", "salaryStyle","salaryGiveTime",
              "deduSocialMonth","deduProvidentMonth","salaryTaxFlag","socialPriority","fundPriority","annualBonusType",
              "isDeductSocial","isDeductFund"]
          //工资明细详情字段组装
          if(titleSortList){
            for(const c in titleSortList){
              salaryAccountListHeader.push(titleSortList[c])
              salaryAccountListValue.push(titleSortList[c])
            }
          }
          // 组装工资明细数据
          for(const d in salaryAccountList){
            salaryAccountList[d].salaryStyle = this.salaryStyleOption[salaryAccountList[d].salaryStyle]
            salaryAccountList[d].salaryGiveTime = this.salaryGiveTimeOption[salaryAccountList[d].salaryGiveTime]
            salaryAccountList[d].salaryTaxFlag = this.isFlag[salaryAccountList[d].salaryTaxFlag]
            salaryAccountList[d].socialPriority = this.socialPriorityOption[salaryAccountList[d].socialPriority]
            salaryAccountList[d].fundPriority = this.fundPriorityOption[salaryAccountList[d].fundPriority]
            salaryAccountList[d].annualBonusType = this.annualBonusTypeOption[salaryAccountList[d].annualBonusType]
            salaryAccountList[d].isDeductSocial = this.isFlag[salaryAccountList[d].isDeductSocial]
            salaryAccountList[d].isDeductFund = this.isFlag[salaryAccountList[d].isDeductFund]
            salaryAccountList[d].isDeductSocial = salaryAccountList[d].isDeductSocial ? salaryAccountList[d].isDeductSocial : ''
            salaryAccountList[d].isDeductFund = salaryAccountList[d].isDeductFund ? salaryAccountList[d].isDeductFund : ''
            salaryAccountList[d].deduSocialMonth = salaryAccountList[d].deduSocialMonth ? salaryAccountList[d].deduSocialMonth : ''
            salaryAccountList[d].deduProvidentMonth = salaryAccountList[d].deduProvidentMonth ? salaryAccountList[d].deduProvidentMonth : ''
            salaryAccountList[d].salaryType = this.salaryTypeOption[salaryAccountList[d].salaryType]
            if(titleSortList){
              for(const c in titleSortList){
                salaryAccountList[d][titleSortList[c]] = ''
                let saiList = salaryAccountList[d].saiList
                let i = 0
                for(const m in saiList){
                  if(String(saiList[m].cnName) === String(titleSortList[c])){
                    i = 1
                    salaryAccountList[d][titleSortList[c]] = saiList[m].salaryMoney?saiList[m].salaryMoney:saiList[m].textValue
                  }
                }
                if(i == 0){
                  salaryAccountList[d][titleSortList[c]] = 0
                }
              }
            }
          }

          var excelDatas = [
            {
              tHeader: salaryAccountListHeader, // 表一的数据字段
              filterVal: salaryAccountListValue, // sheet表一头部
              tableDatas: salaryAccountList, // 表一的整体json数据
              sheetName: "工资明细"// 表一的sheet名字
            },
          ]
          this.json2excel(excelDatas, "报账明细", true, "xlsx")
          this.downLoading = false
        }
      })
    },
    json2excel(tableJson, filenames, autowidth, bookTypes){
      var that = this
      //这个是引用插件
      import("@/vendor/Export2Excel").then(excel => {
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
