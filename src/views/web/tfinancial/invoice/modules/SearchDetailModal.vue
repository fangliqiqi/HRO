<template>
  <a-modal
    :title="title"
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
      <a-tabs
        :activeKey="activityKey"
        @change="changeTab"
      >
        <a-tab-pane
          tab="工资明细"
          key="1"
        >
          <a-table
            v-if="isNoTax == 1"
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSourceList"
            :loading="loading"
            :scroll="{ x: 2280 }"
          >
            <template
              slot="operation"
              slot-scope="text, record"
            >
              <a @click="detail(record.id)">详情</a>
            </template>
            <!-- 结算主体 -->
            <span
              slot="departName"
              slot-scope="text"
              :style="handleColumnStyle(120)"
            >
              <a-tooltip
                placement="topLeft"
                :title="text"
              >
                {{ text }}
              </a-tooltip>
            </span>
            <!-- 员工姓名 -->
            <span
              slot="empName"
              slot-scope="text"
              :style="handleColumnStyle(120)"
            >
              <a-tooltip
                placement="topLeft"
                :title="text"
              >
                {{ text }}
              </a-tooltip>
            </span>
          </a-table>
          <a-table
            v-if="isNoTax == 2"
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSourceList"
            :loading="loading"
          >
          </a-table>
        </a-tab-pane>
        <a-tab-pane
          tab="结算表"
          key="2"
          :forceRender="true"
        >

          <!-- <salary-settle-account-modal ref="settleAccountModal"></salary-settle-account-modal> -->
          <search-settle-account-modal
            ref="settleAccountModal"
            :salaryStandardInfo="salaryStandardInfo"
            :settlementhFormInfo="settlementhFormInfo"
            :pauseDiyInfoList="pauseDiyInfoList"
            :poorBalanceInfoList="poorBalanceInfoList"
            :salaryAccountOne="salaryAccountOne"
          ></search-settle-account-modal>
        </a-tab-pane>
        <a-tab-pane
          tab="封面"
          key="3"
          :forceRender="true"
        >
          <!-- <salary-page-modal ref="salaryPageModal"></salary-page-modal> -->
          <search-page-modal
            ref="auditPageModal"
            :salaryStandardInfo="salaryStandardInfo"
            :coverList="coverList"
          ></search-page-modal>
        </a-tab-pane>
        <a-tab-pane
          tab="流程进展明细"
          key="4"
          :forceRender="true"
        >
          <search-progress-modal
            ref="auditProgressModal"
            :salaryStandardInfo="salaryStandardInfo"
          ></search-progress-modal>
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
import SearchSettleAccountModal from './SearchSettleAccountModal'
import SearchPageModal from './SearchPageModal'
import SearchProgressModal from './SearchProgressModal'
import { getItemName } from '@/utils/common'
import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
import moment from 'moment'
const DetailListItem = DetailList.Item

export default {
  name: 'AuditInfoModal',
  components: {
      SearchSettleAccountModal,
      SearchPageModal,
      SearchProgressModal,
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
      loading:false,
      confirmLoading:false,
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      columns: [],
      salaryStandardInfo:'',
      validatorRules:{
        status: { rules: [{ required: true, message: '请审核!' }] },
        remark: { rules: [{ required: true, message: '请输入审核意见!' }] },
      },
      model:{},
      url:{
        list:'/salary/tsalarystandard/auditSalaryStandardPage',
        doAuditUrl:'/salary/tsalarystandard/doAudit',
        openBill:'/salary/salary/openBill',
        doExportUrl:'/salary/salary/doExportSalary'
      },
      activityKey:'1',
      dataSourceList:[],
      detailData:{},
      saiList:[],
      coverList:[],
      employData:[],
      settlementhFormInfo:{},
      pauseDiyInfoList:[],
      poorBalanceInfoList:[],
      salaryAccountOne:{},
      bankOptions:[],
      isNoTax: 1
    }
  },
  methods: {
    show(record) {
      this.activityKey = '1'
      const url = `${this.url.openBill}?salaryFormId=${record.salaryForm}`
      httpAction(url,{},'POST').then((res) => {
        if(Number(res.code) === 200){
          this.coverList = res.data.coverList
          this.settlementhFormInfo = res.data.settlementhForm
          this.pauseDiyInfoList = res.data.settlementhFormSubList
          this.poorBalanceInfoList = res.data.poorBalanceInfoList
          this.detailData = res.data
          this.salaryStandardInfo = res.data.salary
          if(res.data.salary.formType == '非扣税项'){
            this.isNoTax = 2
            this.dataSourceList = this.detailData.nonTaxAccountList
            this.salaryAccountOne = res.data.nonTaxAccountList[0] || {}
            this.columns = [
              {
                title: '账户名',
                dataIndex: 'name',
                width: 120,
                key: 'name',
                align: 'center',
              },
              {
                title: '金额',
                width: 120,
                dataIndex: 'money',
                key: 'money',
                align: 'center',
                
              },
              {
                title: '开户行',
                dataIndex: 'bankName',
                width: 120,
                key: 'bankName',
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
                title: '项目名称',
                dataIndex: 'itemName',
                width: 120,
                key: 'itemName',
                align: 'center',
              
              },
              {
                title: '发放方式',
                dataIndex: 'salaryStyle',
                width: 120,
                key: 'salaryStyle',
                align: 'center',
                customRender:(text) => {
                  return this.salaryStyleOption[text]
                }
              },
            ]
          }else{
            this.isNoTax = 1
            this.dataSourceList = this.detailData.salaryAccountList
            this.salaryAccountOne = res.data.salaryAccountList[0] || {}
            this.columns = [
              {
                title: '姓名',
                dataIndex: 'empName',
                width: 120,
                fixed: 'left',
                key: 'empName',
                align: 'center',
                scopedSlots: { customRender: 'empName' }
              },
              {
                title: '工资发放方式',
                width: 120,
                fixed: 'left',
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
                  let bankName = filterDictText(this.bankOptions, text)
                  if(bankName == '-' && text){
                    return text;
                  }
                  return bankName
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
                fixed: 'right',
                width: 120,
                align: 'center',
                scopedSlots: { customRender: 'operation' }
              }
            ]
          }
          this.visible = true
          this.detailData = res.data
        }
      })
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if(Number(res.code) === 200){
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
    },
    handleOk() {
      this.close()
    },
    handleCheckCancel() {
      this.visibleCheck = false
    },
    // 展示单个工资明细详情明细
    detail(id){
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
      if(Number(key) === 2){
        this.$refs.settleAccountModal.show()
      }
      if(Number(key) === 3){
        this.$refs.auditPageModal.employData = this.employData
        this.$refs.auditPageModal.show()
      }
      if(Number(key) === 4){
        this.$refs.auditProgressModal.show()
      }
    },
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then((res) => {
        if (Number(res.code) === 200) {
          this.bankOptions = res.data
        }
      })
    },
    // 隐藏列样式
    handleColumnStyle(width) {
      if (width) {
        return `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: ${width}px;`
      }
      return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
    },
    // 导出
    handleDownload() {
      const url = `${this.url.doExportUrl}?salaryFormId=${this.salaryStandardInfo.id}`
      httpAction(url,{},'POST').then((res) => {
        if(Number(res.code) === 200){
          let auditName = ''
          let createName = ''
          let revenueName = ''
          if(res.data.salary.createUser){
            for(const c in this.employData){
              if(String(c) === String(res.data.salary.auditUser)){
                auditName = this.employData[c]
              }
              if(String(c) === String(res.data.salary.createUser)){
                createName = this.employData[c]
              }
              if(String(c) === String(res.data.salary.revenueUser)){
                revenueName = this.employData[c]
              }
            }
          }
          const settleForm = res.data.settlementhForm
          let settelData = []
          let num 
          // 结算单数据
          if(this.isNoTax == 1){
            settelData = [
              {'index':settleForm.settleMonth + '结算单','data':'','project':'','money':'','tax':'','account':''},
              {'index':'结算名称:','data':settleForm.settleDepartName,'project':'','money':'','tax':'皖信盖章:','account':''},
              {'index':'结算编码:','data':settleForm.settleDepartNo,'project':'','money':'','tax':'','account':''},
              {'index':'结算时间:','data':settleForm.settleMonth,'project':'','money':'','tax':'','account':''},
              {'index':'序号','data':'费用项目','project':'','money':'金额','tax':'税费','account':'开票额小计'},
              {'index':1,'data':res.data.salary.salaryMonth,'project':'应发工资','money':settleForm.salarySum,'tax':settleForm.salaryTax,'account':settleForm.salaryTicket},
              {'index':'','data':'','project':'实发工资(银付)','money':settleForm.cardPay,'tax':'','account':''},
              {'index':'','data':'','project':'实发工资(现金)','money':settleForm.moneyPay,'tax':'','account':''},
              {'index':'','data':'','project':'暂停发金额','money':settleForm.pausePay,'tax':'','account':''},
              {'index':2,'data':res.data.salaryAccountList[0].deduSocialMonth,'project':'应缴单位社保','money':settleForm.unitSocial,'tax':settleForm.unitSocialTax,'account':settleForm.unitSocialTicket},
              {'index':'','data':'','project':'应缴个人社保','money':settleForm.personalSocial,'tax':'','account':''},
              {'index':'','data':'','project':'没工资员工单位社保','money':settleForm.noSalaryUnitSocial,'tax':settleForm.noSalaryUnitSocialTax,'account':settleForm.noSalaryUnitSocialTicket},
              {'index':'','data':'','project':'没工资员工个人社保','money':settleForm.noSalaryPersonSocial,'tax':settleForm.noSalaryPersonSocialTax,'account':settleForm.noSalaryPersonSocialTicket},
              {'index':3,'data':res.data.salaryAccountList[0].deduProvidentMonth,'project':'应缴单位公积金','money':settleForm.unitFund,'tax':settleForm.unitFundTax,'account':settleForm.unitFundTicket},
              {'index':'','data':'','project':'应缴个人公积金','money':settleForm.personalFund,'tax':'','account':''},
              {'index':'','data':'','project':'没工资员工单位公积金','money':settleForm.noSalaryUnitFund,'tax':settleForm.noSalaryUnitFundTax,'account':settleForm.noSalaryUnitFundTicket},
              {'index':'','data':'','project':'没工资员工个人公积金','money':settleForm.noSalaryPersonalFund,'tax':settleForm.noSalaryPersonalFundTax,'account':settleForm.noSalaryPersonalFundTicket},
              {'index':4,'data':'代扣当月个人税','project':'','money':settleForm.personalCurmonthTax,'tax':'','account':''},
            ];
            num = 5
          }
          if(this.isNoTax == 2){
            settelData = [
              {'index':settleForm.settleMonth + '结算单','data':'','project':'','money':'','tax':'','account':''},
              {'index':'结算名称:','data':settleForm.settleDepartName,'project':'','money':'','tax':'皖信盖章:','account':''},
              {'index':'结算编码:','data':settleForm.settleDepartNo,'project':'','money':'','tax':'','account':''},
              {'index':'结算时间:','data':settleForm.settleMonth,'project':'','money':'','tax':'','account':''},
              {'index':'序号','data':'费用项目','project':'','money':'金额','tax':'税费','account':'开票额小计'},
              {'index':1,'data':res.data.salary.salaryMonth,'project':'应发工资','money':settleForm.salarySum,'tax':settleForm.salaryTax,'account':settleForm.salaryTicket},
              {'index':'','data':'','project':'实发工资(银付)','money':settleForm.cardPay,'tax':'','account':''},
              {'index':'','data':'','project':'实发工资(现金)','money':settleForm.moneyPay,'tax':'','account':''},
              {'index':'','data':'','project':'暂停发金额','money':settleForm.pausePay,'tax':'','account':''},
              {'index':2,'data':'代扣当月个人税','project':'','money':settleForm.personalCurmonthTax,'tax':'','account':''},
            ]
            num = 3
          }
          let isPersonYear = 0
          let settlementhFormSubListLength = res.data.settlementhFormSubList.length
          if(settleForm.personalYearTax > 0){
            settelData.push({'index':num,'data':'代扣个人年终奖税','project':'','money':settleForm.personalYearTax,'tax':'','account':''})
            num++
            isPersonYear = 1
          }
          if(settleForm.withholidingPersonSocial != 0){
            settelData.push({'index':num,'data':'代扣个人社保','project':'','money':settleForm.withholidingPersonSocial,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.withholidingPersonFund != 0){
            settelData.push({'index':num,'data':'代扣个人公积金','project':'','money':settleForm.withholidingPersonFund,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.withholidingUnitSocial != 0){
            settelData.push({'index':num,'data':'代扣单位社保','project':'','money':settleForm.withholidingUnitSocial,'tax':settleForm.withholidingUnitSocialTax,'account':settleForm.withholidingUnitSocialTicket})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.withholidingUnitFund != 0){
            settelData.push({'index':num,'data':'代扣单位公积金','project':'','money':settleForm.withholidingUnitFund,'tax':settleForm.withholidingUnitFundTax,'account':settleForm.withholidingUnitFundTicket})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.takingRisks != 0){
            settelData.push({'index':num,'data':'商险金额','project':'','money':settleForm.takingRisks,'tax':settleForm.takingRisksTax,'account':settleForm.takingRisksTicket})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.riskFundDy != 0){
            settelData.push({'index':num,'data':'风险抵押金','project':'','money':settleForm.riskFundDy,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.deductPersonal){
            settelData.push({'index':num,'data':'代扣个人费用','project':'','money':settleForm.deductPersonal,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }

          if(settleForm.deductUnit){
            settelData.push({'index':num,'data':'代扣单位费用','project':'','money':settleForm.deductUnit,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.otherDbMoney){
            settelData.push({'index':num,'data':'其他代办费2','project':'','money':settleForm.otherDbMoney,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.unitSupplement){
            settelData.push({'index':num,'data':'单位待补足','project':'','money':settleForm.unitSupplement,'tax':settleForm.unitSupplementTax,'account':settleForm.unitSupplementTicket})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.persoanSupplement){
            settelData.push({'index':num,'data':'个人待补足','project':'','money':settleForm.persoanSupplement,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.personalDebt){
            settelData.push({'index':num,'data':'个人社保、公积金欠款','project':'','money':settleForm.personalDebt,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.personalOtherMoney){
            settelData.push({'index':num,'data':'个人其他费用','project':'','money':settleForm.personalOtherMoney,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.prevPersoanSupplement){
            settelData.push({'index':num,'data':'前次个人待补足','project':'','money':settleForm.prevPersoanSupplement,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.unitBack){
            settelData.push({'index':num,'data':'单位返还','project':'','money':settleForm.unitBack,'tax':settleForm.unitBackTax,'account':settleForm.unitBackTicket})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.unitSocialCard){
            settelData.push({'index':num,'data':'单位社保卡费','project':'','money':settleForm.unitSocialCard,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.exemptionPersionTax){
            settelData.push({'index':num,'data':'免个税个人代扣','project':'','money':settleForm.exemptionPersionTax,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.enterpriseAnnuity){
            settelData.push({'index':num,'data':'企业（职业）年金','project':'','money':settleForm.enterpriseAnnuity,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.onlyChild){
            settelData.push({'index':num,'data':'独生子女费','project':'','money':settleForm.onlyChild,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }

          for(var c of res.data.settlementhFormSubList){
            settelData.push({'index':num,'data':getItemName(c.itemTypeName,c.subName),'project':'','money':c.money,'tax':c.tax,'account':c.ticket})
            num++
          }
          settleForm.remark = settleForm.remark ? settleForm.remark : ''
          settelData.push({'index':num++,'data':'风险金','project':'','money':settleForm.riskFund,'tax':settleForm.riskFundTax,'account':settleForm.riskFundTicket})
          settelData.push({'index':num++,'data':'人数','project':'','money':settleForm.personNum,'tax':'','account':''})
          settelData.push({'index':num++,'data':'人次','project':'','money':settleForm.personTime,'tax':'','account':''})
          settelData.push({'index':num++,'data':'管理费','project':'','money':settleForm.managementMoney,'tax':settleForm.managementMoneyTax,'account':settleForm.managementMoneyTicket})
          settelData.push({'index':num++,'data':'管理费2','project':'','money':settleForm.managementMoneyTwo,'tax':settleForm.managementMoneyTwoTax,'account':settleForm.managementMoneyTwoTicket})
          settelData.push({'index':num++,'data':'结算金额合计','project':'','money':'','tax':settleForm.countTax,'account':settleForm.accountMoneySum})
          settelData.push({'index':num++,'data':'开票金额合计','project':'','money':'','tax':'','account':settleForm.ticketMoneySum})
          settelData.push({'index':num++,'data':'上次差余额','project':'','money':'','tax':'','account':settleForm.prevPoorBalance})
          settelData.push({'index':num++,'data':'本次差余额','project':'','money':'','tax':'','account':settleForm.curPoorBalance})
          
          settelData.push({'index':num++,'data':'备注:' + settleForm.remark,'project':'','money':'','tax':'','account':''})
          if(this.isNoTax == 1){
            settelData.push({'index':num++,'data':'发票类型','project':'扣除金额','money':'不含税金额','tax':'税额','account':'发票合计金额'})
            settelData.push({'index':num++,'data':settleForm.ticketType,'project':settleForm.deductionAmount,'money':settleForm.noTaxAmount,'tax':settleForm.taxAmount,'account':settleForm.ticketSumAmount})
          }
          // settelData.push({'index':num++,'data':'','project':'','money':'1814','tax':'123.6','account':'1928.2'})
          settelData.push({'index':'审核人:','data':auditName,'project':'','money':'','tax':'制表人:','account':createName})
          settelData.push({'index':'','data':'','project':'','money':'','tax':'','account':''})
          settelData.push({'index':'','data':'','project':'','money':'','tax':'','account':''})

          settelData.push({'index':'月份','data':'姓名','project':'项目','money':'金额','tax':'原因','account':''})
          for(let c of res.data.poorBalanceInfoList){
            settelData.push({'index':c.month,'data':c.name,'project':c.project,'money':c.money,'tax':c.cause,'account':''})
          }
          settelData.push({'index':settlementhFormSubListLength,'data':res.data.poorBalanceInfoList.length,'project':isPersonYear,'money':'','tax':'','account':''})
          let salaryAccountListHeader
          let salaryAccountListValue
          let salaryAccountList
          let accountTitle = res.data.accountTitle
          if(this.isNoTax == 1){
            salaryAccountList = res.data.salaryAccountList
            salaryAccountListHeader = ["工资月份","结算月份","结算主体","姓名","银行卡号","开户行","身份证号","工资发放方式","工资发放时间","社保扣缴月份",
                "公积金扣缴月份","是否薪资扣税","社保优先级","公积金优先级","年终奖扣税方案","是否扣除社保","是否扣除公积金"]
            salaryAccountListValue =  ["salaryDate", "settlementMonth", "settleDepartName", "empName", "bankNo", "bankName", "empIdcard", "salaryStyle","salaryGiveTime",
                "deduSocialMonth","deduProvidentMonth","salaryTaxFlag","socialPriority","fundPriority","annualBonusType",
                "isDeductSocial","isDeductFund"]
            //工资明细详情字段组装
            if(accountTitle){
              for(let c in accountTitle){
                salaryAccountListHeader.push(c)
                salaryAccountListValue.push(accountTitle[c])
              }
            }
            for(let d in salaryAccountList){
              salaryAccountList[d].salaryStyle = this.salaryStyleOption[salaryAccountList[d].salaryStyle]
              salaryAccountList[d].salaryGiveTime = this.salaryGiveTimeOption[salaryAccountList[d].salaryGiveTime]
              salaryAccountList[d].salaryTaxFlag = this.isFlag[salaryAccountList[d].salaryTaxFlag]
              salaryAccountList[d].socialPriority = this.socialPriorityOption[salaryAccountList[d].socialPriority]
              salaryAccountList[d].fundPriority = this.fundPriorityOption[salaryAccountList[d].fundPriority]
              salaryAccountList[d].annualBonusType = this.annualBonusTypeOption[salaryAccountList[d].annualBonusType]
              salaryAccountList[d].isDeductSocial = this.isFlag[salaryAccountList[d].isDeductSocial]
              salaryAccountList[d].isDeductFund = this.isFlag[salaryAccountList[d].isDeductFund]
              let bankName = filterDictText(this.bankOptions,salaryAccountList[d].bankName)
              if(bankName == '-' && this.bankOptions,salaryAccountList[d].bankName){
                1 == 1
              }else{
                salaryAccountList[d].bankName = bankName
              }
              if(accountTitle){
                for(let c in accountTitle){
                  salaryAccountList[d][accountTitle[c]] = ''
                  let saiList = salaryAccountList[d].saiList
                  for(let m in saiList){
                    if(saiList[m].javaFiedName == accountTitle[c]){
                      salaryAccountList[d][accountTitle[c]] = saiList[m].salaryMoney
                    }
                  }
                }
              }
            }
          }
          if(String(this.isNoTax) === '2'){
            salaryAccountList = res.data.nonTaxAccountList
            salaryAccountListHeader = ["账户名","金额","开户行","银行卡号","项目名称","发放方式"]
            salaryAccountListValue = ["name",'money','bankName','bankNo','itemName','salaryStyle']
            for(const d in salaryAccountList) {
              salaryAccountList[d].salaryStyle = this.salaryStyleOption[salaryAccountList[d].salaryStyle]
            }
          }
          // 组装工资明细数据
          let salaryBankVoList = res.data.salaryBankVoList
          for(const m in salaryBankVoList){
            const bankName = filterDictText(this.bankOptions,salaryBankVoList[m].bankName)
            if(bankName == '-' && this.bankOptions,salaryBankVoList[m].bankName){
              1 == 1
            }else{
              salaryBankVoList[m].bankName = bankName
            }
          }
          // 封面数据
          var excelDatas = [
            {
              tHeader: salaryAccountListHeader, // 表一的数据字段
              filterVal: salaryAccountListValue, // sheet表一头部
              tableDatas: salaryAccountList, // 表一的整体json数据
              sheetName: "工资明细"// 表一的sheet名字
            },
            {
              tHeader: ["序号",null,"费用项目", "金额", "增值税", "开票额小计"],
              filterVal: ['index','data',"project", "money", "tax", "account"],
              tableDatas: settelData,
              sheetName: "结算单"
            },
            {
              tHeader: ["姓名","身份证号", "银行账号", "实发工资合计", "开户行"],
              filterVal: ['name','idNumber',"bankNo", "money", "bankName"],
              tableDatas: salaryBankVoList,
              sheetName: "银行"
            },
            {
              tHeader: ["姓名","身份证号", "实发工资合计"],
              filterVal: ['name','idNumber', "money"],
              tableDatas: res.data.salaryCashVoList,
              sheetName: "现金"
            },
            {
              tHeader: ["员工姓名", "身份证号","个人大病费用","个人公积金合计","个人医疗费用","个人养老费用","个人社保合计"
              ,"个人工伤费用","公积金生成月份","公积金缴纳月份","社保生成月份","社保缴纳月份","单位生育费用","单位大病救助","单位公积金合计",
              "单位医疗费用","单位养老费用","单位社保合计","单位失业费用","单位工伤费用"],
              filterVal: ["empName","empIdcard","personalBigmailmentFee","personalFundSum","personalMedicalFee","personalPensionFee","personalSocialSum"
              ,"personalUnemploymentFee","providentCreateMonth","providentPayMonth","socialCreateMonth","socialPayMonth","unitBirthFee","unitBitmailmentFee","unitFundSum",
              "unitMedicalFee","unitPensionFee","unitSocialSum","unitUnemploymentFee","unitWorkInjuryFee"],
              tableDatas: res.data.forecastList,
              sheetName: "社保明细"
            },
            {
              tHeader: ["员工姓名", "员工身份证号","结算部门","保险公司","险种","保单开始时间","保单结束时间","实际保费",
              "保单号","医保","身故或残疾","商险购买地","购买标准","结算月份","备注"],
              filterVal: ['empName','empIdcardNo', "settlementDepart", "insuranceCompanyName","insuranceTypeName","policyStart","policyEnd",
              "buyPay","policyNo","medicalMoney","deathDisabilityMoney","businessInsuranceAddr","buyStandard","settleMonth","remark"],
              tableDatas: res.data.businessInsuranceList ? res.data.businessInsuranceList : [],
              sheetName: "商险明细"
            },
          ]
          let i = 1
          for(const d of res.data.coverList){
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
                {'company':"",'project':d.createDate,'payType':'部门编码','money':d.settleNo,'no':''},
                {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
                {'company':d.unitName,'project':d.itemName,'payType':'银行转账','money':'¥' + d.money,'no':''},
                {'company':d.settleName,'project':'','payType':'','money':'','no':''},
                {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
                {'company':"备注:",'project':remark,'payType':'','money':'','no':''},
                {'company':"收款单位名称: " + receiptUnitName + "        账号: " + bankNo + "        开户行: " + bankName,'project':'','payType':'','money':'','no':''},
                {'company':"公司领导：         财务负责人:" + revenueName + '         网银审核授权人：         网银转账提交人：'  + '         数据审核人：' + auditName + '        制表人:' + createName,'project':'' ,'payType': '','money':'','no':''},
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
                {'company':"",'project':d.createDate,'payType':'部门编码','money':d.settleNo,'no':''},
                {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
                {'company':d.unitName,'project':d.itemName,'payType':'现金转账','money':'¥' + d.money,'no':''},
                {'company':d.settleName,'project':'','payType':'','money':'','no':''},
                {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
                {'company':"备注:" ,'project':remark,'payType':'','money':'','no':''},
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
          const excelName = `${settleForm.settleMonth}${settleForm.settleDepartName}普通薪资${settleForm.settleDepartNo}(${settleForm.accountMoneySum})`
          this.json2excel(excelDatas, excelName, true, "xlsx")
        }
      })
    },
    json2excel(tableJson, filenames, autowidth, bookTypes){
      var that = this
      //这个是引用插件
      if(this.isNoTax == 1){
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
      }
      if(this.isNoTax == 2){
        import("@/vendor/NoPersonExportExcel").then(excel => {
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
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
