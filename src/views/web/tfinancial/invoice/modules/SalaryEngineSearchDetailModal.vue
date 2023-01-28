<template>
  <a-modal
    :title="title"
    :width="1200"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="取消"
    :visible="visible"
    :maskClosable="false"
  >
    <a-card
      :bordered="false"
      style="background:#f5f5f5"
    >
      <a-tabs
        :activeKey="activityKey"
        @change="changeTab"
      >
        <a-tab-pane
          tab="工资明细"
          key="1"
        >
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSourceList"
            :loading="loading"
            :scroll="scroll"
          >
            <template
              slot="operation"
              slot-scope="text, record"
            >
              <a @click="detail(record.id)">详情</a>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane
          tab="结算表"
          key="2"
          forceRender
        >

          <!-- <salary-settle-account-modal ref="settleAccountModal"></salary-settle-account-modal> -->
          <engine-search-settle-account-modal
            ref="settleAccountModal"
            v-if="salaryStandardInfo && Object.keys(salaryStandardInfo).length"
            :salaryStandardInfo="salaryStandardInfo"
            :settlementhFormInfo="settlementhFormInfo"
            :pauseDiyInfoList="pauseDiyInfoList"
            :poorBalanceInfoList="poorBalanceInfoList"
            :salaryAccountOne="salaryAccountOne"
          ></engine-search-settle-account-modal>
        </a-tab-pane>
        <a-tab-pane
          tab="封面"
          key="3"
          :forceRender="true"
        >
          <!-- <salary-page-modal ref="salaryPageModal"></salary-page-modal> -->
          <engine-search-page-modal
            v-if="salaryStandardInfo && Object.keys(salaryStandardInfo).length"
            ref="auditPageModal"
            :salaryStandardInfo="salaryStandardInfo"
            :coverList="coverList"
            :employData="employData"
          ></engine-search-page-modal>
        </a-tab-pane>
        <a-tab-pane
          tab="流程进展明细"
          key="4"
          forceRender
        >
          <engine-search-progress-modal
            ref="auditProgressModal"
            v-if="salaryStandardInfo && Object.keys(salaryStandardInfo).length"
            :salaryStandardInfo="salaryStandardInfo"
            :subject="subject"
            :attaList="attaList"
          ></engine-search-progress-modal>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 工资明细详情 -->
    <a-modal
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

    </a-modal>

  </a-modal>
</template>

<script>
import DetailList from '@/components/tools/DetailList'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction } from '@/api/manage'
import EngineSearchSettleAccountModal from './EngineSearchSettleAccountModal'
import EngineSearchPageModal from './EngineSearchPageModal'
import EngineSearchProgressModal from './EngineSearchProgressModal'
import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
import { getItemName } from '@/utils/common'
import moment from 'moment'
const DetailListItem = DetailList.Item

export default {
  name: 'AuditInfoModal',
  components: {
      EngineSearchSettleAccountModal,
      EngineSearchPageModal,
      EngineSearchProgressModal,
      DetailListItem,
      DetailList
    },
  mixins: [JeecgListMixin],
  data() {
    return {
      title:'工资报表',
      visible:false,
      visibleCheck:false,
      detailVisible:false,
      form:this.$form.createForm(this),
      checkValue:'',
      bankOptions:[],
      loading:false,
      confirmLoading:false,
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      columns:[],
      salaryStandardInfo:{},
      validatorRules:{
        status: { rules: [{ required: true, message: '请审核!' }] },
        remark: { rules: [{ required: true, message: '请输入审核意见!' }] },
      },
      model:{},
      url:{
        list:'/salary/tsalarystandard/auditSalaryStandardPage',
        doAuditUrl:'/salary/tsalarystandard/doAudit',
        openBill:'/salary/engineer/openBill',
        doExportUrl:'/salary/engineer/doExportSalary'
      },
      activityKey:'1',
      dataSourceList:[],
      detailData:{},
      saiList:[],
      employData:[],
      coverList:[],
      settlementhFormInfo:{},
      pauseDiyInfoList:[],
      poorBalanceInfoList:[],
      salaryAccountOne:{},
      attaList:null,
      subject:null,
      scroll:{},
    }
  },
  methods: {
    show(record) {
      this.initDictConfig()
      let url = this.url.openBill + '?salaryFormId=' + record.salaryEngineeringId
      this.subject=null
      httpAction(url,{},'POST').then((res) => {
        if(res.code == 200){
          this.coverList = res.data.coverList
          this.subject = res.data.salary
          this.attaList={
            atta0:res.data.atta0,
            atta1:res.data.atta1,
            atta2:res.data.atta2
          }
          this.settlementhFormInfo = res.data.engineerSettlementForm
          this.pauseDiyInfoList = res.data.engineerSettlementhFormSubList||[]
          this.poorBalanceInfoList = res.data.poorBalanceInfoList||[]
          this.detailData = res.data
          this.dataSourceList = this.detailData.engineerAccountList

          this.columns = [
            {
              title: '姓名',
              dataIndex: 'empName',
              width: 130,
              fixed: 'left',
              align: 'center',
              key: 'empName'
            },
            // {
            //   title: '工资发放方式',
            //   dataIndex: 'salaryStyle',
            //   fixed: 'left',
            //   width: 120,
            //   align: 'center',
            //   key: 'salaryStyle',
            //   customRender: (text) => {
            //     return this.salaryStyleOption[text]
            //   }
            // },
            {
              title: '身份证号',
              width: 130,
              align: 'center',
              dataIndex: 'empIdcard',
              key: 'empIdcard',
            },
            {
              title: '银行卡号',
              width: 130,
              align: 'center',
              dataIndex: 'bankNo',
              key: 'bankNo'
            },
            {
              title: '开户行',
              width: 130,
              align: 'center',
              dataIndex: 'bankName',
              key: 'bankName',
              customRender: (text) => {
                let bankName = filterDictText(this.bankOptions, text)
                if(bankName == '-' && text){
                  return text;
                }
                return bankName
              },
            },
            {
              title: '工资发放时间',
              width: 130,
              align: 'center',
              dataIndex: 'salaryGiveTime',
              key: 'salaryGiveTime',
              customRender: (text) => {
                return this.salaryGiveTimeOption[text]
              }
            },
            {
              title: '工资月份',
              width: 130,
              align: 'center',
              dataIndex: 'salaryDate',
              key: 'salaryDate'
            },
            {
              title: '结算月份',
              width: 130,
              align: 'center',
              dataIndex: 'settlementMonth',
              key: 'settlementMonth'
            },
            {
              title: '结算主体',
              width: 130,
              align: 'center',
              dataIndex: 'settleDepartName',
              key: 'settleDepartName'
            }
          ]
          let isDeductSocial = this.dataSourceList.length > 0 ? this.dataSourceList[0]['isDeductSocial'] : ''
          if(this.dataSourceList && isDeductSocial == 1){
            this.columns.push(
              {
                title: '社保扣缴月份',
                width: 130,
                align: 'center',
                dataIndex: 'deduSocialMonth',
                key: 'deduSocialMonth'
              },
            )
            this.columns.push(
              {
                title: '社保优先级',
                width: 130,
                align: 'center',
                dataIndex: 'socialPriority',
                key: 'socialPriority',
                customRender: (text) => {
                  return this.socialPriorityOption[text]
                }
              },
            )
            this.columns.push(
              {
                title: '是否扣除社保',
                width: 130,
                align: 'center',
                dataIndex: 'isDeductSocial',
                key: 'isDeductSocial',
                customRender: (text) => {
                  if(!text){
                    return '否'
                  }else{
                    return this.isFlag[text]
                  }
                }
              },
            )
            this.scroll = {x : 1560}
          }else{
            this.scroll = {x : 1170}
          }

          this.columns.push({
            title: '操作',
            width: 130,
            align: 'center',
            key: 'action',
            fixed: 'right',
            scopedSlots: { customRender: 'operation' }
          })

          this.visible = true
          this.salaryAccountOne = res.data.engineerAccountList[0] ||{}
          this.salaryStandardInfo = res.data.salary
          this.detailData = res.data
          this.dataSourceList = this.detailData.engineerAccountList
        }
      })
      // httpAction('admin/user/findUserBypPrmission?permissionStr=wxhr:view_salary', '', 'GET').then((res) => {
      //   if (res.code === 200) {
      //     this.employData = res.data
      //   }
      // })
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if(res.code == 200){
          this.employData = res.data
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.activityKey = '1'
    },
    handleOk() {
      // this.visibleCheck = true
      this.close()
    },
    handleCheckCancel() {
      this.visibleCheck = false
    },
    // 展示单个工资明细详情明细
    detail(id){
      // this.saiList =  this.dataSource[key]['saiList']
      // this.detailVisible = true
      for(var c of this.dataSourceList){
        if(c.id == id){
          this.saiList = c.saiList
          break;
        }
      }
      this.detailVisible = true
    },
    // 关闭工资明细详情
    handleDetailOk(){
      this.detailVisible = false
    },
    // 关闭工资明细详情
    handleDetailCancel(){
      this.detailVisible = false
    },
    changeTab(key){
      this.activityKey = key
      if(key == 2){
        this.$nextTick(() => {
          this.$refs.settleAccountModal.show()  
        })
      }
      if(key == 3){
        this.$refs.auditPageModal.show()
      }
      if(key == 4){
        this.$refs.auditProgressModal.show()
      }
    },
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then((res) => {
        if (res.code === 200) {
          this.bankOptions = res.data
        }
      })
    },
    // 导出
    handleDownload() {
      let url = this.url.doExportUrl + '?salaryFormId=' + this.salaryStandardInfo.id
      httpAction(url,{},'POST').then((res) => {
        if(res.code == 200){
          let auditName = ''
          let createName = ''
          let revenueName = ''
          if(res.data.salary.createUser){
            for(let c in this.employData){
              if(c == res.data.salary.auditUser){
                auditName = this.employData[c]
              }
              if(c == res.data.salary.createUser){
                createName = this.employData[c]
              }
              if(c == res.data.salary.revenueUser){
                revenueName = this.employData[c]
              }
            }
          }
          let settleForm = res.data.engineerSettlementForm
          // 结算单数据
          let settelData = [
            {'index':settleForm.settleMonth + '结算单','data':'','project':'','money':'','account':' '},
            {'index':'结算名称:','data':settleForm.settleDepartName,'project':'','money':'皖信盖章','account':' '},
            {'index':'结算编码:','data':settleForm.settleDepartNo,'project':'','money':'','account':' '},
            {'index':'结算时间:','data':settleForm.settleMonth,'project':'','money':'','account':' '},
            {'index':'序号','data':'费用项目','project':'','money':'金额','account':'开票额小计'},
            {'index':1,'data':res.data.salary.salaryMonth,'project':'应发工资','money':settleForm.salarySum,'account':settleForm.salaryTicket}, 
            {'index':'','data':'','project':'实发工资(银付)','money':settleForm.cardPay,'account':' '},
            {'index':'','data':'','project':'实发工资(现金)','money':settleForm.moneyPay,'account':' '},
            {'index':'','data':'','project':'暂停发金额','money':settleForm.pausePay,'account':' '},
            {'index':2,'data':res.data.engineerAccountList[0].deduProvidentMonth,'project':'应缴单位社保','money':settleForm.psocialDeduction,'account':''}, 
            {'index':'','data':'','project':'代扣个人社保','money':settleForm.usocialDeduction,'account':''},
          ];
          let num = 3
          if(res.data.engineerSettlementhFormSubList){
            for(var c of res.data.engineerSettlementhFormSubList){
              settelData.push({'index':num,'data':getItemName(c.itemTypeName,c.subName),'project':'','money':c.money,'account':''})
              num++
            }
          }
          if(!settleForm.remark){
            settleForm.remark = ''
          }
          settelData.push({'index':num++,'data':'雇主责任险','project':'','money':settleForm.employerLiabilityInsurance,'account':''})
          settelData.push({'index':num++,'data':'其它费用','project':'','money':settleForm.other,'account':''})
          settelData.push({'index':num++,'data':'增值税金及附加','project':'','money':settleForm.valueDaddedTax,'account':settleForm.valueDaddedTaxTicket})
          settelData.push({'index':num++,'data':'预缴企业所得税','project':'','money':settleForm.unitIncomeTax,'account':settleForm.unitIncomeTaxTicket})
          settelData.push({'index':num++,'data':'预缴个人所得税	','project':'','money':settleForm.personIncomeTax,'account':settleForm.personIncomeTaxTicket})
          settelData.push({'index':num++,'data':'人数','project':'','money':settleForm.personCount,'account':''})
          settelData.push({'index':num++,'data':'管理费','project':'','money':settleForm.managementCost,'account':settleForm.managementCostTicket})
          settelData.push({'index':num++,'data':'结算金额合计','project':'','money':settleForm.accountMoneySum,'account':''})
          settelData.push({'index':num++,'data':'备注:','project':settleForm.remark,'money':'','account':''})
         

          let engineerAccountList = res.data.engineerAccountList
          let accountTitle = res.data.accountTitle
          for(let d in engineerAccountList){
            engineerAccountList[d].salaryStyle = this.salaryStyleOption[engineerAccountList[d].salaryStyle]
            engineerAccountList[d].salaryGiveTime = this.salaryGiveTimeOption[engineerAccountList[d].salaryGiveTime]
            engineerAccountList[d].salaryTaxFlag = this.isFlag[engineerAccountList[d].salaryTaxFlag]
            engineerAccountList[d].socialPriority = this.socialPriorityOption[engineerAccountList[d].socialPriority]
            engineerAccountList[d].fundPriority = this.fundPriorityOption[engineerAccountList[d].fundPriority]
            engineerAccountList[d].annualBonusType = this.annualBonusTypeOption[engineerAccountList[d].annualBonusType]
            engineerAccountList[d].isDeductSocial = this.isFlag[engineerAccountList[d].isDeductSocial]
            engineerAccountList[d].isDeductFund = this.isFlag[engineerAccountList[d].isDeductFund]
            let bankName = filterDictText(this.bankOptions,engineerAccountList[d].bankName)
            if(bankName == '-' && this.bankOptions,engineerAccountList[d].bankName){
              1 == 1
            }else{
              engineerAccountList[d].bankName = bankName
            }
            if(accountTitle){
              for(let c in accountTitle){
                engineerAccountList[d][accountTitle[c]] = ''
                let saiList = engineerAccountList[d].saiList
                for(let m in saiList){
                  if(saiList[m].javaFiedName == accountTitle[c]){
                    engineerAccountList[d][accountTitle[c]] = saiList[m].salaryMoney
                  }
                }
              }
            }
          }

          let salaryBankVoList = res.data.salaryBankVoList
          for(var m in res.data.salaryBankVoList){
            let bankName = filterDictText(this.bankOptions,salaryBankVoList[m].bankName)
            if(bankName == '-' && this.bankOptions,salaryBankVoList[m].bankName){
              1 == 1
            }else{
              salaryBankVoList[m].bankName = bankName
            }
          }
          
          let isDeductSocial = engineerAccountList.length > 0 ? engineerAccountList[0]['isDeductSocial'] : ''
          let engineerAccountListHeader
          let engineerAccountListValue
          if(isDeductSocial == 1){
            engineerAccountListHeader  = ["工资月份","结算月份","结算主体","姓名","身份证号","银行卡号","开户行","工资发放方式","工资发放次数","工资发放时间","社保扣缴月份",
              "社保优先级","是否扣除社保"]
            engineerAccountListValue =  ["salaryDate", "settlementMonth", "settleDepartName", "empName", "empIdcard", "bankNo", "bankName", "salaryStyle","salaryCount","salaryGiveTime","deduSocialMonth",
              "socialPriority","isDeductSocial"] 
          }else{
            engineerAccountListHeader  = ["工资月份","结算月份","结算主体","姓名","身份证号","银行卡号","开户行","工资发放方式","工资发放次数","工资发放时间"]
            engineerAccountListValue =  ["salaryDate", "settlementMonth", "settleDepartName", "empName", "empIdcard", "bankNo", "bankName", "salaryStyle","salaryCount","salaryGiveTime"] 
          }
          //工资明细详情字段组装     
          if(accountTitle){
            for(let c in accountTitle){
              engineerAccountListHeader.push(c)
              engineerAccountListValue.push(accountTitle[c])
            }
          }
          // 封面数据
          var excelDatas = [
            {
              tHeader: engineerAccountListHeader,
              filterVal: engineerAccountListValue,
              tableDatas: engineerAccountList, // 表一的整体json数据
              sheetName: "工资明细"// 表一的sheet名字
            },
            {
              tHeader: ["序号",null,"费用项目", "金额", "开票额小计"],
              filterVal: ['index','data',"project", "money", "account"],
              tableDatas: settelData,
              sheetName: "结算单"
            },
            {
              tHeader: ["姓名","身份证号", "银行账号", "实发工资合计", "开户行","用途"],
              filterVal: ['name','idNumber',"bankNo", "money", "bankName", "useRemark"],
              tableDatas: salaryBankVoList,
              sheetName: "银行"
            },
            {
              tHeader: ["姓名","身份证号", "实发工资合计","用途"],
              filterVal: ['name','idNumber', "money", "useRemark"],
              tableDatas: res.data.salaryCashVoList,
              sheetName: "现金"
            },
            {
              tHeader: ["单位", "单位编码","部门","结算主体编码","所属地市","账单日期","结算金额","开票金额","状态","提交时间","表单类型",
              "审核状态","开票时间","创建人","创建时间","最后更新人","最后更新时间"],
              filterVal: ["unitName","unitNo","departNo","departName","belongAddr","orderDate","billFee","ticketFee","status",
              "submitTime","formType","auditId","ticketTime","createUser","createTime","lastUpdateUser","lastUpdateTime"],
              tableDatas: res.data.forecastList,
              sheetName: "社保明细"
            },
            {
              tHeader: ["员工姓名", "员工身份证号","结算主体","保险公司","险种","保单开始时间","保单结束时间","实际保费",
              "保单号","医保","身故或残疾","商险购买地","购买标准","结算月份","备注"],
              filterVal: ['empName','empIdcardNo', "settlementOrganName", "insuranceCompanyName","insuranceTypeName","policyStart","policyEnd",
              "buyPay","policyNo","medicalMoney","deathDisabilityMoney","businessInsuranceAddr","buyStandard","settleMonth","remark"],
              tableDatas: res.data.businessInsuranceList ? res.data.businessInsuranceList : [],
              sheetName: "商险明细"
            },
          ]
          let i = 1
          for(var d of res.data.coverList){
            let receiptUnitName = d.receiptUnitName ? d.receiptUnitName : ''
            let bankNo = d.bankNo ? d.bankNo : ''
            let bankName = d.bankName ? d.bankName : ''
            let remark = d.remark ? d.remark : ''
            d.createDate = d.createDate ?  moment(d.createDate).format("YYYY/MM/DD") : ""
            let lastTwo = d.itemName.substr(d.itemName.length - 2,2)
            if(lastTwo == "其他"){
              d.itemName = d.itemName.substr(0,d.itemName.length - 2) + "工资"
            }
            if(d.payType == 1){
              let coverData = [
                {'company':d.invoiceTitle,'project':'','payType':'','money':'','no':`附件${res.data.coverList.length}张`},
                {'company':"银行转账审批单",'project':'','payType':'','money':'','no':''},
                {'company':"",'project':d.createDate,'payType':'结算主体编码','money':d.settleNo,'no':''},
                {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
                {'company':d.unitName,'project':d.itemName,'payType':'银行转账','money':'¥' + d.money,'no':''},
                {'company':d.settleName,'project':'','payType':'','money':'','no':''},
                {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
                {'company':"备注:",'project':remark,'payType':'','money':'','no':''},
                {'company':"收款单位名称: " + receiptUnitName + "        账号: " + bankNo + "        开户行: " + bankName,'project':'','payType':'','money':'','no':''},
                {'company':"公司领导：         财务负责人:" + revenueName + '         网银审核授权人：         网银转账提交人：'  + '         数据审核人：' + auditName + '         制表人:' + createName,'project':'' ,'payType': '','money':'','no':''},
              ]
              excelDatas.push({
                tHeader: ["序号", "名字", "描述", "金钱", "地位"],
                filterVal: ["company", "project", "payType", "money",'no'],
                tableDatas:coverData,
                sheetName:'转账封面' + i
              })
            }else{
              let coverData = [
                {'company':d.invoiceTitle,'project':'','payType':'','money':'','no':`附件${res.data.coverList.length}张`},
                {'company':"现金付款审批单",'project':'','payType':'','money':'','no':''},
                {'company':"",'project':d.createDate,'payType':'结算主体编码','money':d.settleNo,'no':''},
                {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
                {'company':d.unitName,'project':d.itemName,'payType':'现金转账','money':'¥' + d.money,'no':''},
                {'company':d.settleName,'project':'','payType':'','money':'','no':''},
                {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
                {'company':"备注:",'project':remark,'payType':'','money':'','no':''},
                {'company':"公司领导：         财务负责人：" + revenueName + '         出纳会计: ' + '         数据审核人：' + auditName + '         制表人: ' + createName,'project': '' ,'payType':'','money':'','no':''},
              ]
              excelDatas.push({
                tHeader: ["序号", "名字", "描述", "金钱", "地位"],
                filterVal: ["company", "project", "payType", "money",'no'],
                tableDatas:coverData,
                sheetName:'转账封面' + i
              })
            }
            i++
          }
          let excelName = settleForm.settleMonth + settleForm.settleDepartName + "工程薪资" + settleForm.settleDepartNo + '(' + settleForm.accountMoneySum + ')'
          this.json2excel(excelDatas, excelName, true, "xlsx")
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
