<template>
  <a-modal
    title="工资条查询"
    :width="1200"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleDownload"
    cancelText="取消"
    okText="导出"
    :visible="visible"
    :maskClosable="false"
  >
    <a-card
      :bordered="false"
      style="background:#f5f5f5"
    >

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
                  :loading="searchLoading"
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

      <div v-if="isTable">
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :loading="loading"
          :scroll="{x: 1}"
        >
          <span
            slot="distributionFlag"
            slot-scope="text, record"
          >
            <template v-for="(distributionFlag, key) in distributionFlagOptions">
              <a-tag
                :key="key"
                v-if="record.distributionFlag == key"
                :color="distributionFlag.color"
              >{{ distributionFlag.option }}</a-tag>
            </template>
          </span>
          <template
            slot="operation"
            slot-scope="text, record"
          >
            <a @click="detail(record.id)">详情</a>
          </template>
        </a-table>
      </div>
    </a-card>

    <!-- 工资明细详情 -->
    <statement-detail-modal ref="statementDetailModal"></statement-detail-modal>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tools/DetailList'
import { httpAction } from '@/api/manage'
const DetailListItem = DetailList.Item
import StatementDetailModal from './StatementDetailModal'

export default {
  name: 'SalarySearchModal',
  components: {
    DetailListItem,
    DetailList,
    StatementDetailModal
  },
  data(){
    return{
      visible:false,
      toggleSearchStatus: false,
      loading: false,
      searchLoading:false,
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      distributionFlagOption:{'0':'未发放','1':'发放成功','2':'发放失败'},
      distributionFlagOptions:{
        '0':{'option': '未发放', 'color': 'green'},
        '1':{'option': '发放成功', 'color': 'red'},
        '2':{'option': '发放失败', 'color': 'blue'},
      },
      columns:[
        {
          title: '姓名',
          dataIndex: 'empName',
          width: 120,
          key: 'empName',
          align: 'center',
          scopedSlots: { customRender: 'empName' }
        },
        {
          title: '发放状态',
          dataIndex: 'distributionFlag',
          width: 120,
          key: 'distributionFlag',
          align: 'center',
          scopedSlots: { customRender: 'distributionFlag' }
        },
        {
          title: '工资发放方式',
          width: 120,
          dataIndex: 'salaryStyle',
          key: 'salaryStyle',
          align: 'center',
          customRender:(text) => {
            return this.salaryStyleOption[text]
          }
        },
        {
          title: '身份证号',
          dataIndex: 'empIdcard',
          width: 120,
          key: 'empIdcard',
          align: 'center',
        },
        {
          title: '银行卡号',
          dataIndex: 'bankNo',
          width: 120,
          key: 'bankNo',
          align: 'center',
        },
        {
          title: '开户行',
          dataIndex: 'bankName',
          width: 120,
          key: 'bankName',
          align: 'center',
          customRender: (text) => {
            return text
          },
        },
        {
          title: '工资发放时间',
          dataIndex: 'salaryGiveTime',
          width: 120,
          key: 'salaryGiveTime',
          align: 'center',
          customRender:(text) => {
            return this.salaryGiveTimeOption[text]
          }
        },
        {
          title: '社保扣缴月份',
          dataIndex:'deduSocialMonth',
          width: 120,
          key:'deduSocialMonth',
          align: 'center',
        },
        {
          title: '公积金扣缴月份',
          dataIndex:'deduProvidentMonth',
          width: 120,
          align: 'center',
          key:'deduProvidentMonth'
        },
        {
          title: '是否薪资扣税',
          dataIndex:'salaryTaxFlag',
          width: 120,
          align: 'center',
          key:'salaryTaxFlag',
          customRender:(text) => {
            return this.isFlag[text]
          }
        },
        {
          title: '社保优先级',
          dataIndex:'socialPriority',
          width: 120,
          align: 'center',
          key:'socialPriority',
          customRender:(text) => {
            return this.socialPriorityOption[text]
          }
        },
        {
          title: '公积金优先级',
          dataIndex:'fundPriority',
          width: 120,
          align: 'center',
          key:'fundPriority',
          customRender:(text) => {
            return this.fundPriorityOption[text]
          }
        },
        {
          title: '年终奖扣税方案',
          dataIndex:'annualBonusType',
          width: 120,
          align: 'center',
          key:'annualBonusType',
          customRender:(text) => {
            return this.annualBonusTypeOption[text]
          }
        },
        {
          title: '是否扣除社保',
          dataIndex:'isDeductSocial',
          width: 120,
          align: 'center',
          key:'isDeductSocial',
          customRender:(text) => {
            return this.isFlag[text]
          }
        },
        {
          title: '是否扣除公积金',
          dataIndex:'isDeductFund',
          width: 120,
          align: 'center',
          key:'isDeductFund',
          customRender:(text) => {
            return this.isFlag[text]
          }
        },
        {
          title: '工资月份',
          dataIndex: 'salaryDate',
          width: 120,
          align: 'center',
          key: 'salaryDate',
        },
        {
          title: '结算月份',
          dataIndex: 'settlementMonth',
          width: 120,
          align: 'center',
          key: 'settlementMonth',
        },
        {
          title: '结算主体',
          dataIndex: 'settleDepartName',
          width: 120,
          align: 'center',
          key: 'settleDepartName',
          scopedSlots: { customRender: 'departName' }
        },
        {
          title: '操作',
          key: 'action',
          width: 120,
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      dataSource:[],
      queryParam:{},
      accountTitle:{},
      url:{
        list: 'salary/tsalaryaccount/getEmpAccount'
      },
      isTable:false
    }
  },
  methods: {
    show(){
      this.visible = true
      this.searchReset()
    },
    searchQuery(){
      this.loadData()
    },
    searchReset(){
      this.queryParam = {}
      this.accountTitle = {}
      this.dataSource = []
      this.isTable = false
    },
    loadData(){
      let httpUrl = this.url.list
      if(this.queryParam){
        if(this.queryParam.settleDepartName && !this.queryParam.settlementMonth){
          this.$message.error("请输入结算月份")
          return;
        }
        let i = 1
        for(let c in this.queryParam){
          if(i == 1){
            httpUrl = httpUrl + '?' + c + '=' + this.queryParam[c]
            i++
          }else{
            httpUrl = httpUrl + '&' + c + '=' + this.queryParam[c]
          }
        }
      }else{
        this.$message.errro("请输入查询条件")
        return
      }
      this.loading = true
      this.searchLoading = true
      httpAction(httpUrl, {}, 'GET').then((res) => {
        this.loading = false
        this.searchLoading = false
        if(res.code == 200){
          this.isTable = true
          this.dataSource = res.data.salaryAccountList
          this.accountTitle = res.data.accountTitle
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    // 展示单个工资明细详情明细
    detail(id){
      let salaryList = []
      for(const item of this.dataSource){
        if(String(item.id) === String(id)){
          salaryList = item.saiList
          break
        }
      }
      this.$refs.statementDetailModal.title = '报表详情'
      this.$refs.statementDetailModal.saiList = salaryList
      this.$refs.statementDetailModal.show()
    },
    handleCancel(){
      this.visible = false
    },
    handleDownload(){
      if(this.dataSource.length > 0){
        let salaryAccountList = JSON.parse(JSON.stringify(this.dataSource))
        let accountTitle = JSON.parse(JSON.stringify(this.accountTitle))
        let salaryAccountListHeader = ["工资月份","发放状态","结算月份","结算主体","姓名","银行卡号","开户行","身份证号","工资发放方式","社保扣缴月份",
            "公积金扣缴月份","是否薪资扣税","社保优先级","公积金优先级","年终奖扣税方案","是否扣除社保","是否扣除公积金"]
        let salaryAccountListValue =  ["salaryDate","distributionFlag", "settlementMonth", "settleDepartName", "empName", "bankNo", "bankName", "empIdcard", "salaryStyle",
            "deduSocialMonth","deduProvidentMonth","salaryTaxFlag","socialPriority","fundPriority","annualBonusType",
            "isDeductSocial","isDeductFund"]
        //工资明细详情字段组装
        if(accountTitle){
          for(let c in accountTitle){
            salaryAccountListHeader.push(c)
            salaryAccountListValue.push(c)
          }
        }
        // 组装工资明细数据
          for(let d in salaryAccountList){
            salaryAccountList[d].salaryStyle = this.salaryStyleOption[salaryAccountList[d].salaryStyle]
            salaryAccountList[d].salaryGiveTime = this.salaryGiveTimeOption[salaryAccountList[d].salaryGiveTime]
            salaryAccountList[d].salaryTaxFlag = this.isFlag[salaryAccountList[d].salaryTaxFlag]
            salaryAccountList[d].socialPriority = this.socialPriorityOption[salaryAccountList[d].socialPriority]
            salaryAccountList[d].fundPriority = this.fundPriorityOption[salaryAccountList[d].fundPriority]
            salaryAccountList[d].annualBonusType = this.annualBonusTypeOption[salaryAccountList[d].annualBonusType]
            salaryAccountList[d].isDeductSocial = this.isFlag[salaryAccountList[d].isDeductSocial]
            salaryAccountList[d].isDeductFund = this.isFlag[salaryAccountList[d].isDeductFund]
            salaryAccountList[d].distributionFlag = this.distributionFlagOption[salaryAccountList[d].distributionFlag]
            if(accountTitle){
              for(let c in accountTitle){
                salaryAccountList[d][c] = ''
                let saiList = salaryAccountList[d].saiList
                for(let m in saiList){
                  if(saiList[m].cnName == c){
                    const item = saiList[m]
                    const name = (item.salaryMoney === '' || item.salaryMoney === null)?item.textValue:item.salaryMoney
                    salaryAccountList[d][c] = name
                  }
                }
              }
            }
          }
          var excelDatas = [
            {
              tHeader: salaryAccountListHeader, // 表一的数据字段
              filterVal: salaryAccountListValue, // sheet表一头部
              tableDatas: salaryAccountList, // 表一的整体json数据
              sheetName: "工资条"// 表一的sheet名字
            },
          ]
          let excelName = "普通薪资工资条"
          this.json2excel(excelDatas, excelName, true, "xlsx")
      }else{
        this.$message.error("当前无数据可导出")
      }
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
    },
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus
    },
  }
}
</script>

