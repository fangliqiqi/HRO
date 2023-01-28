<template>
  <a-modal
    :title="title"
    :width="1300"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    :visible="visible"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="export" v-if="showExport" type="primary" @click="handleDownload">导出</a-button>
      <a-button key="recall" v-if="!showExport" type="primary" @click="handleBackOk">撤回</a-button>

    </template>
    <a-card
      :bordered="false"
      style="background:#f5f5f5"
    >
      <a-tabs
        :activeKey="activityKey"
        @change="changeTab"
      >
        <a-tab-pane
          :forceRender="true"
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
          key="2"
          :forceRender="true"
        >
          <span slot="tab">
            结算表
          </span>
          <salary-settle-account-modal
            ref="settleAccountModal"
            :salaryStandardInfo="salaryStandardInfo"
            :settlementhFormInfo="settlementhFormInfo"
            :pauseDiyInfoList="pauseDiyInfoList"
            :poorBalanceInfoList="poorBalanceInfoList"
            :salaryAccountOne="salaryAccountOne"
          ></salary-settle-account-modal>

        </a-tab-pane>
        <a-tab-pane
          key="3"
          :forceRender="true"
        >
          <span slot="tab">
            封面
          </span>
          <salary-page-modal
            ref="salaryPageModal"
            :salaryStandardInfo="salaryStandardInfo"
            :coverList="coverList"
            :employData="employData"
          ></salary-page-modal>
        </a-tab-pane>
        <a-tab-pane
          tab="流程进展明细"
          key="4"
          :forceRender="true"
        >
          <salary-progress-modal
            ref="ProgressModal"
            :salaryStandardInfo="salaryStandardInfo"
            :auditLogList="auditLogList"
            :attaList="attaList"
          ></salary-progress-modal>
        </a-tab-pane>
        <a-tab-pane
          key="5"
          tab="匹配明细"
          :forceRender="true"
        >
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="matchDetailColumns"
            :dataSource="matchDetailData"
            :loading="loading"
            :scroll="{ x: 1 }"
          >
          </a-table>
        </a-tab-pane>
      </a-tabs>
      <a-form :form="backform" style="margin-top:15px;" v-if="!showExport">
        <a-form-item label="退回理由">
          <a-textarea rows="4" placeholder="请输入退回理由" v-decorator="['remark',{ rules: [{ required: true, message: '请输入退回理由!' },{max:500,message:'退回理由最多500个字符！'}] }]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 审核 -->
    <a-modal
      title="客户审核"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleCheckCancel"
      @ok="handleCheckOk"
      cancelText="关闭"
      okText="确定"
      :visible="visibleCheck"
      :confirmLoading="confirmLoading"
      :maskClosable="false"
    >
      <a-form :form="form">
        <a-form-item label="是否通过">
          <a-radio-group
            v-decorator="['status', validatorRules.status ]"
            @change="handleChange"
          >
            <a-radio :value="3">通过</a-radio>
            <a-radio :value="5">不通过</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="审核意见">
          <a-textarea v-decorator="['remark', validatorRules.remark]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>

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
import { httpAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SalarySettleAccountModal from './SettleAccountMoule'
import SalaryPageModal from './PageModule'
import SalaryProgressModal from './ProgressModule'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import moment from 'moment'
import { getItemName } from '@/utils/common'
import { getBusinessType } from '@/utils/businessType'
const DetailListItem = DetailList.Item

export default {
  name: 'NoPersonTaxSearchDetail',
  components: {
      SalarySettleAccountModal,
      SalaryPageModal,
      SalaryProgressModal,
      DetailListItem,
      DetailList,
    },
  mixins: [JeecgListMixin],
  data() {
    return {
      title:'工资报表',
      visible:false,
      visibleCheck:false,
      detailVisible:false,
      form: this.$form.createForm(this),
      confirmLoading:false,
      employData:{},
      bankOptions:[],
      loading:false,
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      reciveTypeOptions: {'1': '薪资及其他', '2': '纯收入', '3': '事务性外包','4':'预估结算单'}, // 款项类型
      reciveUseOptions: {'0': '款项认领', '1': '垫付还款', '2': '商险预估还款'}, // 款项用途
      statusOutOptions: {
        '0': {'option': '未出账', 'color': 'blue'},
        '1': {'option': '部分出账', 'color': 'pink'},
        '2': {'option': '全部出账', 'color': 'green'}
      }, // 出账状态
      statusIncomeOptions: {
        '0': {'option': '未收入', 'color': 'blue'},
        '1': {'option': '部分收入', 'color': 'pink'},
        '2': {'option': '全部收入', 'color': 'green'}
      }, // 收入状态
      statusOptions: {
        '0': {'option': '正常', 'color': 'green'},
        '1': {'option': '撤销', 'color': 'red'}
      }, // 认领状态
      columns:[
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
          title: '结算月份',
          width: 120,
          dataIndex: 'settleMonth',
          key: 'settleMonth',
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
          customRender: (text,record) => {
            const result = getItemName(record.itemTypeName,text)
            return result
          }
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
        {
            title: '本月是否重复金额',
            width: 150,
            align: 'center',
            dataIndex: 'isRepeat',
            key: 'isRepeat',
            customRender: (text) => {
              if(!text){
                return '否'
              }else{
                return this.isFlag[text] || '-'
              }
            }
          },

      ],
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      salaryStandardInfo:'',
      settlementAmount:'', // 流程进展明细结算单金额
      settlementhFormInfo:{},
      pauseDiyInfoList:[],
      poorBalanceInfoList:[],
      coverList:[],
      salaryAccountOne:{},
      auditLogList:[],//流程进展明细
      validatorRules:{
        status: { rules: [{ required: true, message: '请审核!' }] },
        remark: { rules: [{ required: true, message: '请输入审核意见!' }] },
      },
      model:{},
      matchDetailData:[], // 匹配明细数据
      matchDetailColumns: [
          {
            width: 180,
            ellipsis: true,
            align: 'center',
            title: '认领时间',
            dataIndex: 'reciveDate',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            align: 'center',
            title: '认领金额',
            dataIndex: 'reciveFee',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '可匹配金额',
            align: 'center',
            dataIndex: 'reciveFeeBalance',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 130,
            ellipsis: true,
            align: 'center',
            title: '款项用途',
            dataIndex: 'reciveUse',
            customRender: text => {
              const resultText = this.reciveUseOptions[text] || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '款项类型',
            align: 'center',
            dataIndex: 'reciveType',
            customRender: (text,record) => {
              const resultText = String(record.reciveUse) === '0' ? this.reciveTypeOptions[text] : '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 220,
            ellipsis: true,
            align: 'center',
            title: '结算主体',
            dataIndex: 'departName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '认领人',
            align: 'center',
            dataIndex: 'reciveUser',
            customRender: text => {
              const resultText = this.employData.hasOwnProperty(text) ? this.employData[text] : '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            align: 'center',
            title: '认领状态',
            dataIndex: 'status',
            customRender: text => {
              const optionItem = this.statusOptions[String(text)] || '-'
              return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
            }
          },
          {
            width: 140,
            ellipsis: true,
            align: 'center',
            title: '出账状态',
            dataIndex: 'statusOut',
            customRender: text => {
              const optionItem = this.statusOutOptions[String(text)] || '-'
              return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
            }
          },
          {
            width: 150,
            ellipsis: true,
            align: 'center',
            title: '收入状态',
            dataIndex: 'statusIncome',
            customRender: text => {
              const optionItem = this.statusIncomeOptions[String(text)] || '-'
              return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
            }
          },
      ],
      url:{
        list:'/salary/tsalarystandard/applySalaryStandardPage',
        doSubmitUrl:'/salary/tsalarystandard/doSubmit',
        openBill:'/salary/salary/openBill',
        doExportUrl:'/salary/salary/doExportSalary',
        settelOne: '/salary//tsettlementhform/',
        mathDetailUrl:'/salary/treciverecord/getReciveRecordsByRecordId', // 匹配明细列表
        backUrl:'/salary/tsalarystandard/goBack',
      },
      activityKey:'1',
      dataSourceList:[],
      detailData:{},
      saiList:[],
      showExport: true,
      backform:this.$form.createForm(this),
      attaList:[]
    }
  },
  methods: {
    async show(record,detailInfo) {
      this.loadMatchDetailInfo(record.id)
      this.salaryStandardInfo = record
       // 业务类型
      this.salaryStandardInfo.businessType = await getBusinessType(record.departId)
      this.detailData = detailInfo
      this.coverList = detailInfo.coverList
      this.settlementhFormInfo = detailInfo.settlementhForm
      this.pauseDiyInfoList = detailInfo.settlementhFormSubList ? detailInfo.settlementhFormSubList : []
      this.poorBalanceInfoList = detailInfo.poorBalanceInfoList ? detailInfo.poorBalanceInfoList : []
      this.dataSourceList = detailInfo.nonTaxAccountList
      this.salaryAccountOne = detailInfo.nonTaxAccountList.length > 0 ? detailInfo.nonTaxAccountList[0] : {}
      this.auditLogList = detailInfo.auditLogList || []
      this.attaList = detailInfo.attaList.map(item=>{
        return {
          uid: item.id,
          name: item.attaName,
          status: 'done',
          url: item.attaUrl
        }
      })
      // this.activityKey = '1'
      this.visible = true
      this.changeTab(this.activityKey)
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.backform.resetFields()
      this.visible = false
      // this.activityKey = '1'
      this.showExport = true
    },
    // 获取匹配明细
    loadMatchDetailInfo(recordId){
      // 出账类型type：0普通工资1工程工资2商险3社保核准表4公积金核准表5纯收入6社保预估单
      const detailUrl = `${this.url.mathDetailUrl}?matchId=${recordId}&type=0`
      httpAction(detailUrl,{},'GET').then((res) => {
        if(Number(res.code) === 200){
          this.matchDetailData = res.data || []
        }else {
          this.$message.warn(res.msg || '匹配明细获取失败')
        }
      })
    },
    handleOk() {
      this.visibleCheck = true
    },
    handleCheckCancel() {
      this.visibleCheck = false
    },
    handleCheckOk() {
      this.confirmLoading = true
      this.form.validateFields((err,values) => {
        if(!err){
          let formData = Object.assign(this.model, values)
          formData.id = this.salaryStandardInfo.id
          // wxhr:tsalarystandard_doAudit
          httpAction(this.url.doAuditUrl,formData,'POST').then((res) => {
            this.confirmLoading = false
            if(Number(res.code) === 200){
              this.$message.success("审核成功")
              this.visibleCheck = false
              this.visible = false
              this.$emit('ok')
              this.form.resetFields()
            }else{
              this.$message.error(res.msg)
            }
          })
        }else{
          this.confirmLoading = false
        }
      })
    },
    handleChange(e) {
      this.checkValue = e.target.value
      if(e.target.value == 5){
        this.validatorRules.remark = { rules: [{ required: true, message: '请输入审核意见!' }] }
      }else{
        this.validatorRules.remark = {}
      }
    },
    handleBackOk(){
      this.backform.validateFields((err,values) => {
        if(!err){
          const url = `${this.url.backUrl}?tSettlementhFormId=${this.settlementhFormInfo.id}`
          httpAction(url,{'id':this.salaryStandardInfo.id,'status':7,'remark':values.remark},'POST').then((res) => {
            if(Number(res.code) === 200){
              this.$message.success("撤销成功!")
              this.handleCancel()
              this.$emit('ok')
            }else{
              this.$message.error(res.msg)
            }
          })
        }
      })
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
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then((res) => {
        if (Number(res.code) === 200) {
          this.bankOptions = res.data
        }
      })
    },
    // 切换tab
    changeTab(key){
      this.activityKey = key
      if(Number(key) === 2){
        this.$nextTick(()=>{
          this.$refs.settleAccountModal.show()
        })
        
      }
      if(Number(key) === 3){
        this.$nextTick(()=>{
          this.$refs.salaryPageModal.show()
        })
      }
      if(Number(key) === 4){
        this.$nextTick(()=>{
          this.$refs.ProgressModal.show()
        })
        
      }
    },
    getPayMainType(val){
      const emergencyType = [{value:'0',label:'工伤理赔'},{value:'1',label:'商险理赔'}]
      return emergencyType[val]['label']
    },
    //导出
    handleDownload() {
      let url = this.url.doExportUrl + '?salaryFormId=' + this.salaryStandardInfo.id
      httpAction(url,{},'POST').then((res) => {
        if(Number(res.code) === 200){
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
          let settleForm = res.data.settlementhForm
          // 结算单数据
          let settelData = [
            {'index':settleForm.settleMonth + '结算单','data':'','project':'','money':'','tax':'','account':''},
            {'index':'结算名称:','data':settleForm.settleDepartName,'project':'','money':'','tax':'皖信盖章:','account':''},
            {'index':'结算编码:','data':settleForm.settleDepartNo,'project':'','money':'','tax':'结算时间:','account':settleForm.settleMonth},
            {'index':'业务类型:','data':this.salaryStandardInfo.businessType,'project':'','money':'','tax':'','account':''},
            {'index':'序号','data':'费用项目','project':'','money':'金额','tax':'税费','account':'开票额小计'},
            // {'index':1,'data':res.data.salary.salaryMonth,'project':'应发工资','money':settleForm.salarySum,'tax':settleForm.salaryTax,'account':settleForm.salaryTicket},
            // {'index':'','data':'','project':'实发工资(银付)','money':settleForm.cardPay,'tax':'','account':''},
            // {'index':'','data':'','project':'实发工资(现金)','money':settleForm.moneyPay,'tax':'','account':''},
            // {'index':'','data':'','project':'暂停发金额','money':settleForm.pausePay,'tax':'','account':''},
            {'index':2,'data':'代扣当月个人税','project':'','money':settleForm.personalCurmonthTax,'tax':'','account':''},
          ];
          let num = 3
          let isPersonYear = 0
          let settlementhFormSubListLength = res.data.settlementhFormSubList.length
          if(settleForm.personalYearTax > 0){
            settelData.push({'index':num,'data':'代扣个人年终奖税','project':'','money':settleForm.personalYearTax,'tax':'','account':''})
            num++
            isPersonYear = 1
          }
          if(settleForm.withholidingPersonSocial){
            settelData.push({'index':num,'data':'代扣个人社保','project':'','money':settleForm.withholidingPersonSocial,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.withholidingPersonFund){
            settelData.push({'index':num,'data':'代扣个人公积金','project':'','money':settleForm.withholidingPersonFund,'tax':'','account':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.withholidingUnitSocial){
            settelData.push({'index':num,'data':'代扣单位社保','project':'','money':settleForm.withholidingUnitSocial,'tax':settleForm.withholidingUnitSocialTax,'account':settleForm.withholidingUnitSocialTicket})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.withholidingUnitFund){
            settelData.push({'index':num,'data':'代扣单位公积金','project':'','money':settleForm.withholidingUnitFund,'tax':settleForm.withholidingUnitFundTax,'account':settleForm.withholidingUnitFundTicket})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.takingRisks){
            settelData.push({'index':num,'data':'商险金额','project':'','money':settleForm.takingRisks,'tax':settleForm.takingRisksTax,'account':settleForm.takingRisksTicket})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.riskFundDy){
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
            settelData.push({'index':num,'data':getItemName(c.itemTypeName,c.subName,c.isPause),'project':'','money':c.money,'tax':c.tax,'account':c.ticket})
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
          settelData.push({'index':num++,'data':'累计差余额','project':'','money':'','tax':'','account':settleForm.curPoorBalance})
          settelData.push({'index':num++,'data':'备注:' + settleForm.remark,'project':'','money':'','tax':'','account':''})
          if(settleForm.eventCode){
            settelData.push({'index':num++,'data':'事件编码:  ' + settleForm.eventCode||'-','project':'','money':'','tax':'','account':''})
          }
          if(settleForm.payMainType){
            const payMainType = /GS/i.test(settleForm.eventCode) ? this.getPayMainType(settleForm.payMainType) : '-'
            settelData.push({'index':num++,'data':'赔付类型:  ' + payMainType,'project':'','money':'','tax':'','account':''})
          }
          
          // settelData.push({'index':num++,'data':'发票类型','project':'扣除金额','money':'不含税金额','tax':'税额','account':'发票合计金额'})
          // settelData.push({'index':num++,'data':settleForm.ticketType,'project':settleForm.deductionAmount,'money':settleForm.noTaxAmount,'tax':settleForm.taxAmount,'account':settleForm.ticketSumAmount})
          // settelData.push({'index':num++,'data':'','project':'','money':'1814','tax':'123.6','account':'1928.2'})
          settelData.push({'index':'审核人:','data':auditName,'project':'','money':'','tax':'制表人:','account':createName})
          settelData.push({'index':'','data':'','project':'','money':'','tax':'','account':''})
          settelData.push({'index':'','data':'','project':'','money':'','tax':'','account':''})

          settelData.push({'index':'月份','data':'姓名','project':'项目','money':'金额','tax':'原因','account':''})
          for(let c of res.data.poorBalanceInfoList){
            c.name = c.name ? c.name : ''
            c.project = c.project ? c.project : ''
            settelData.push({'index':c.month,'data':c.name,'project':c.project,'money':c.money,'tax':c.cause,'account':''})
          }
          settelData.push({'index':settlementhFormSubListLength,'data':res.data.poorBalanceInfoList.length,'project':isPersonYear,'money':'','tax':'','account':''})

          let salaryAccountList = res.data.nonTaxAccountList
          let accountTitle = res.data.accountTitle
          let salaryAccountListHeader = ["账户名","金额","结算月份","开户行","银行卡号","项目名称","发放方式","本月是否重复金额"]
          let salaryAccountListValue = ["name",'money','settleMonth','bankName','bankNo','itemName','salaryStyle',"isRepeat"]
          //工资明细详情字段组装
          if(accountTitle){
            for(let c in accountTitle){
              salaryAccountListHeader.push(c)
              salaryAccountListValue.push(accountTitle[c])
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
            salaryAccountList[d].isRepeat = this.isFlag[salaryAccountList[d].isRepeat]
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
          let salaryBankVoList = res.data.salaryBankVoList
          for(let m in salaryBankVoList){
            let bankName = filterDictText(this.bankOptions,salaryBankVoList[m].bankName)
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
              tHeader: ["姓名","身份证号", "银行账号","实发工资合计", "银行","支行","用途"],
              filterVal: ['name','idNumber',"bankNo", "money", "bankName","subBranch","useRemark"],
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
              ,"公积金生成月份","公积金缴纳月份","社保生成月份","社保缴纳月份","单位生育费用","单位大病救助","单位公积金合计",
              "单位医疗费用","单位养老费用","单位社保合计","单位失业费用","单位工伤费用"],
              filterVal: ["empName","empIdcard","personalBigmailmentMoney","personalProvidentSum","personalMedicalMoney","personalPensionMoney","socialSecurityPersonalSum"
              ,"providentCreateMonth","providentPayMonth","socialCreateMonth","socialPayMonth","unitBirthMoney","unitBigmailmentMoney","unitProvidentSum",
              "unitMedicalMoney","unitPensionMoney","unitSocialSum","unitUnemploymentMoney","unitInjuryMoney"],
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
          for(var d of res.data.coverList){
            let receiptUnitName = d.receiptUnitName ? d.receiptUnitName : ''
            let bankNo = d.bankNo ? d.bankNo : ''
            let bankName = d.bankName ? d.bankName : ''
            let remark = d.remark ? d.remark : " "
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
                {'company':"收款单位名称: " + receiptUnitName + "        账号:" + bankNo + "        开户行:" + bankName,'project':'','payType':'','money':'','no':''},
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
                {'company':"",'project':d.createDate,'payType':'部门编码','money':d.settleNo,'no':''},
                {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
                {'company':d.unitName,'project':d.itemName,'payType':'现金转账','money':'¥' + d.money,'no':''},
                {'company':d.settleName,'project':'','payType':'','money':'','no':''},
                {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
                {'company':"备注:" + remark,'project':'','payType':'','money':'','no':''},
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
          let excelName = settleForm.settleMonth + settleForm.settleDepartName + "(非扣税项)" + settleForm.settleDepartNo + '(' + settleForm.accountMoneySum + ')'
          this.json2excel(excelDatas, excelName, true, "xlsx")
        }
      })

    },
    json2excel(tableJson, filenames, autowidth, bookTypes){
      var that = this
      //这个是引用插件
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
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
