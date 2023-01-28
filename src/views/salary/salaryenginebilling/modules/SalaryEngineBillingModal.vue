<template>
  <a-modal
    title="发放出账"
    :width="1200"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    cancelText="取消"
    okText="审核"
    :visible="visible"
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >取消</a-button>
      <a-button
        type="primary"
        @click="handleOutSubmit"
      >确定出账</a-button>
      <a-button
        type="primary"
        @click="handlePrint"
      >表单打印</a-button>
      <a-button
        type="primary"
        style="background-color: rgba(255, 51, 51, 1); border-color: rgba(255, 51, 51, 1);"
        @click="handleBackSubmit"
      >退回</a-button>
      <a-button
        type="primary"
        :loading="downloadLoading"
        @click="handleDownload"
      >导出</a-button>
    </template>
    <a-card
      :bordered="false"
      style="background:#f5f5f5"
    >
      <a-tabs
        :activeKey="activeKey"
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
            :scroll="{ x: 1 }"
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
          tab="结算表"
          key="2"
          forceRender
        >
          <engine-billing-settle-account-modal
            ref="settleAccountModal"
            :salaryStandardInfo="salaryStandardInfo"
            :settlementhFormInfo="settlementhFormInfo"
            :pauseDiyInfoList="pauseDiyInfoList"
            :poorBalanceInfoList="poorBalanceInfoList"
            :salaryAccountOne="salaryAccountOne"
          ></engine-billing-settle-account-modal>
        </a-tab-pane>
        <a-tab-pane
          tab="封面"
          key="3"
          forceRender
        >
          <engine-billing-page-modal
            ref="billingPageModal"
            :salaryStandardInfo="salaryStandardInfo"
            :coverList="coverList"
            :employData="employData"
          >
          </engine-billing-page-modal>
        </a-tab-pane>
        <a-tab-pane
          key="4"
          tab="匹配明细"
          :forceRender="true"
        >
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :scroll="{ x: 1 }"
            :columns="matchDetailColumns"
            :dataSource="matchDetailData"
            :loading="loading"
          >
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <!-- 查看认领 -->
    <finish-receive-detail-modal ref="finishReceiveDetailModal"></finish-receive-detail-modal>
    <!-- 工资明细详情 -->
    <statement-detail-modal ref="statementDetailModal"></statement-detail-modal>
    <!-- 确认出账 -->
    <a-modal
      title="出账"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleOutCancel"
      @ok="handleOutOk"
      cancelText="关闭"
      :visible="outVisible"
      :confirmLoading="outLoading"
      :maskClosable="false"
    >
      <form>
        <a-form-item
          label="理由"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea v-model="remark"></a-textarea>
        </a-form-item>
      </form>
    </a-modal>
    <a-modal
      title="导出"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleDownloadCancel"
      @ok="handleDownload"
      cancelText="关闭"
      :visible="downVisible"
      :confirmLoading="downloadLoading"
      :maskClosable="false"
    >
      <span>确认导出吗?</span>
    </a-modal>

    <!-- 退回 -->
    <billing-salary-back-modal ref="backModal" @ok="handleBack" :url="url.doBillingUrl"></billing-salary-back-modal>
  </a-modal>
</template>
<script>
import EngineBillingSettleAccountModal from './EngineBillingSettleAccountModal'
import EngineBillingPageModal from './EngineBillingPageModal'
import { httpAction } from '@/api/manage'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import FinishReceiveDetailModal from './FinishReceiveDetailModal'
import BillingSalaryBackModal from './../../billingsalary/modules/BillingSalaryBackModal'
import { filterOrgan } from '@/utils/customDict'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { getItemName } from '@/utils/common'
import StatementDetailModal from '../../searchsalary/modules/StatementDetailModal'

export default {
  name: 'SalaryEngineBillingModal',
  components: {
    EngineBillingSettleAccountModal,
    EngineBillingPageModal,
    FinishReceiveDetailModal,
    StatementDetailModal,
    BillingSalaryBackModal
  },
  data() {
    return {
      visible:false,
      loading:false,
      outVisible:false,
      backVisible:false,
      backLoading:false,
      downVisible:false,
      outLoading:false,
      downloadLoading:false,
      form:this.$form.createForm(this),
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      reciveUseOptions: {'0': '款项认领', '1': '垫付还款', '2': '商险预估还款'}, // 款项用途
      reciveTypeOptions: {'1': '薪资及其他', '2': '纯收入', '3': '事务性外包','4':'预估结算单'}, // 款项类型
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
      matchDetailData:[], // 匹配明细数据
      remark:'',
      bankOptions:[],
      columns:[],
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      validatorRules: {
        remark: { rules: [{ required: true, message: '请填写理由!' }] },
      },
      activeKey:'1',
      salaryStandardInfo:'',
      activityKey:'1',
      dataSourceList:[],
      detailData:{},
      coverList:[],
      employData:[],
      customerTypeDicts:[],
      advanceTypeDicts:[],
      organs: [],
      settlementhFormInfo:{},
      pauseDiyInfoList:[],
      poorBalanceInfoList:[],
      salaryAccountOne:{},
      settlementList:[],
      scroll:{},
      isCloseDown:0,
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
          {
            width: 150,
            ellipsis: true,
            align: 'center',
            title: '匹配时间',
            dataIndex: 'createDate',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            align: 'center',
            title: '匹配金额',
            dataIndex: 'matchingAmount',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            align: 'center',
            title: '操作人',
            dataIndex: 'createUser',
            customRender: text => {
              const resultText = this.employData.hasOwnProperty(text) ? this.employData[text] : '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
      ],
      url:{
        doExportUrl:'/salary/engineer/doExportSalary',
        doBillingUrl:'/salary/tsalaryengineering/doBilling',
        getPrintCount:"/salary/tprintrecord/getPrintCount",
        queryAllInfoById: '/salary/trecive/', // 详情
        getAdvance: "/hrApproval/tadvancepayment/getByFormId",
        getOrgan: '/admin/organizationinfo/getUserAllOrgan',
        getContract:'/hrBase/tcustomercontract/',
        getSalaryFrom:'busiInsurance/forecastbuypayform/salaryFrom/',
        mathDetailUrl:'/salary/treciverecord/getMatchingByMatchId', // 匹配明细列表
      },
      isBackedType:['新表','退表重传'],
      pauseTxt:{
        '1': '(暂停发)',
        '2': '(不发放)',
      }
    }
  },
  props:{
    formTypeOptions:{
      type:Array,
      required:true
    }
  },
  methods: {
    ...mapGetters(["nickname", "avatar","userInfo"]),
    filterOrgan,
    show(record,detailInfo) {
      this.defaultColumn()
      this.initDictConfig()
      this.getOrgans()
      this.loadMatchDetailInfo(record.id)
      this.salaryStandardInfo = record
      this.detailData = detailInfo
      this.coverList = detailInfo.coverList
      this.settlementhFormInfo = detailInfo.engineerSettlementForm
      this.pauseDiyInfoList = detailInfo.engineerSettlementhFormSubList != null ? detailInfo.engineerSettlementhFormSubList : []
      this.poorBalanceInfoList = detailInfo.poorBalanceInfoList != null ? detailInfo.poorBalanceInfoList : []
      this.dataSourceList = this.detailData.engineerAccountList
      this.salaryAccountOne = detailInfo.engineerAccountList.length > 0 ? detailInfo.engineerAccountList[0] : {}
      this.addColumnAccountData()
      this.visible = true
      this.changeTab(this.activeKey)
      // if(Number(this.activeKey) !== 1){
      //   const _this = this
      //   setTimeout(function(){
      //     _this.changeTab(_this.activeKey)
      //   },500)
      // }
    },
    // 工资明细，默认展示的列
    defaultColumn(){
      this.columns = [
        {
          width: 120,
          ellipsis: true,
          title: '姓名',
          dataIndex: 'empName',
          fixed: 'left',
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
          width: 160,
          ellipsis: true,
          align: 'center',
          title: '手机号码',
          key: 'empPhone',
          dataIndex: 'empPhone',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
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
          customRender: (text) => {
            const bankName = filterDictText(this.bankOptions, text)
            if(String(bankName) === '-' && text){
              return text;
            }
            return bankName
          },
        },
        {
          width: 150,
          ellipsis: true,
          title: '工资发放时间',
          align: 'center',
          dataIndex: 'salaryGiveTime',
          key: 'salaryGiveTime',
          customRender: (text) => {
            return this.salaryGiveTimeOption[text] || '-'
          }
        },
        {
          width: 150,
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
          width: 150,
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
          width: 160,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleDepartName',
          key: 'settleDepartName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        }
      ]
    },
    // 根据条件新增列数据
    addColumnAccountData(){
      const isDeductSocial = this.dataSourceList.length > 0 ? this.dataSourceList[0]['isDeductSocial'] : ''
      if(this.dataSourceList && isDeductSocial == 1){
        this.columns.push(
          {
            title: '社保扣缴月份',
            width: 130,
            align: 'center',
            dataIndex: 'deduSocialMonth',
            key: 'deduSocialMonth',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
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
              return this.socialPriorityOption[text] || '-'
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
      }
      this.columns.push({
        title: '操作',
        width: 130,
        align: 'center',
        key: 'action',
        fixed: 'right',
        scopedSlots: { customRender: 'operation' }
      })
    },
    // 获取匹配明细
    loadMatchDetailInfo(recordId){
      // 出账类型type：0普通工资1工程工资2商险3社保核准表4公积金核准表5纯收入6社保预估单
      const detailUrl = `${this.url.mathDetailUrl}?matchId=${recordId}&type=1`
      httpAction(detailUrl,{},'GET').then((res) => {
        if(Number(res.code) === 200){
          let data =  res.data.map(item =>{
            return item = {...item,...item.record}
          })
          this.matchDetailData = data || []
        }else {
          this.$message.warn(res.msg || '匹配明细获取失败')
        }
      })
    },
    getOrgans() {
      httpAction(this.url.getOrgan,'','GET').then((res) => {
        if(Number(res.code) === 200 && res.data.length > 0) {
          this.organs = res.data
        }
      });
    },
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then((res) => {
        if (Number(res.code) === 200) {
          this.bankOptions = res.data
        }
      }),
      initDictOptions('ADVANCE_CUSTOMER_TYPE').then((res) => {
        if (Number(res.code) === 200) {
          this.customerTypeDicts = res.data
        }
      });
      initDictOptions('ADVANCE_ADVANCE_TYPE').then((res) => {
        if (Number(res.code) === 200) {
          this.advanceTypeDicts = res.data
        }
      });
    },
    changeTab(key){
      this.activeKey = key
      if(Number(key) === 2){
        this.$nextTick(()=>{
           this.$refs.settleAccountModal.show()
          this.$refs.settleAccountModal.openData = this.detailData.engineeringFormTicketList
        })
      }
      if(Number(key) === 3){
        this.$nextTick(()=>{
          this.$refs.billingPageModal.show()
        })
        
      }
    },
    handleCancel() {
      this.close()
      // this.activeKey = '1'
    },
    close() {
      this.$emit('close')
      this.remark = ''
      this.defaultColumn()
      this.form.resetFields()
      this.outVisible = false
      this.downVisible = false
      this.visible = false
      this.coverList = []
    },
    handleOk() {
      
    },
    //导出弹框取消
    handleDownloadCancel(){
      if(this.isCloseDown == 1){
        this.close()
      }else{
        this.downVisible = false
      }
    },
    // 展示单个工资明细详情明细
    detail(id){
      let salaryList = []
      for(const item of this.dataSourceList){
        if(String(item.id) === String(id)){
          salaryList = item.saiList
          break
        }
      }
      this.$refs.statementDetailModal.title = '报表详情'
      this.$refs.statementDetailModal.salaryType = 1 // 0:普通薪资 1:工程工资 2:非扣税类，默认普通薪资
      this.$refs.statementDetailModal.saiList = salaryList
      this.$refs.statementDetailModal.show()
    },
    // 确认出账弹框
    handleOutSubmit() {
      this.outVisible = true
      this.remark = ''
    },
    // 提交出账理由
    handleOutOk() {
      const that = this
      this.outLoading = true
      const url = `${this.url.doBillingUrl}?tSettlementhFormId=${this.settlementhFormInfo.id}`
      httpAction(url,{'id':this.salaryStandardInfo.id,'status':4,'remark':this.remark},'POST').then((res) => {
        that.outLoading = false
        if(Number(res.code) === 200){
          that.$emit('ok')
          this.outVisible = false
          this.$message.success("出账成功")
          this.close()
          this.isCloseDown = 1
        }else{
          this.$message.error(res.msg)
          this.isCloseDown = 0
        }
      })
    },
    handleOutCancel(){
      this.outVisible = false
    },
    // 退回弹框
    handleBackSubmit(){
      this.$refs.backModal.show(this.salaryStandardInfo,this.settlementhFormInfo.id)
    },
    handleBack(){
      this.$emit('ok')
      this.close()
    },
  
    handlePrint(){
      const that = this
      httpAction(this.url.getPrintCount,{'fromId':this.settlementhFormInfo.id,'fromType':1},"POST").then((res) => {
        if(Number(res.code) === 200){
          if(res.data >= 1){
            this.$confirm({
              title: '是否再次打印',
              content: '该表单已打印,需要继续吗',
              onOk() {
                let routeData = that.$router.resolve({
                  path: "/pdf/engineBillingpdf",
                  query: {id:that.salaryStandardInfo.id,count:res.data},
                });
                window.open(routeData.href, '_blank')
              },
              onCancel() {},
            });
          }else{
            let routeData = that.$router.resolve({
              path: "/pdf/engineBillingpdf",
              query: {id:that.salaryStandardInfo.id,count:res.data},
            });
            window.open(routeData.href, '_blank')
          }
        }
      })
    },
    //查看认领
    handleDetail: function() {
      this.$refs.finishReceiveDetailModal.title = '认领详情'
      this.$refs.finishReceiveDetailModal.settleDomainBelongs = this.settlementList
      this.$refs.finishReceiveDetailModal.edit(this.salaryStandardInfo.id)
      this.$refs.finishReceiveDetailModal.loadData()
    },
    // 导出
    async handleDownload() {
      let that = this;
      this.$confirm({
        content:<div>是否同步<span style="color:red">“出账”</span></div>,
        onOk() {
          that.visible = false
          const urls = `${that.url.doBillingUrl}?tSettlementhFormId=${that.settlementhFormInfo.id}`
          httpAction(urls,{'id':that.salaryStandardInfo.id,'status':4,'remark':that.remark},'POST').then((re) => {
            if(Number(re.code) === 200){
              that.$emit('ok')
              that.close()
              that.$message.success("出账成功")
            } else {
              that.$message.error(re.msg)
            }
          })
        },
        onCancel() {
          
        },
      });

      this.downloadLoading = true
      const url = `${this.url.doExportUrl}?salaryFormId=${this.salaryStandardInfo.id}`
      const res = await this.exportUrl(url)
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
        let settleForm = res.data.engineerSettlementForm
        let engineeringFormTicketList = res.data.engineeringFormTicketList
        settleForm.ufundDeduction = settleForm.ufundDeduction ? settleForm.ufundDeduction : ''
        settleForm.pfundDeduction = settleForm.pfundDeduction ? settleForm.pfundDeduction : ''
        settleForm.unitIncomeTax = settleForm.unitIncomeTax ? settleForm.unitIncomeTax : ''
        settleForm.personIncomeTax = settleForm.personIncomeTax ? settleForm.personIncomeTax : ''
        settleForm.unitIncomeTaxTicket = settleForm.unitIncomeTaxTicket ? settleForm.unitIncomeTaxTicket : ''
        settleForm.personIncomeTaxTicket = settleForm.personIncomeTaxTicket ? settleForm.personIncomeTaxTicket : ''
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
          {'index':2,'data':settleForm.socialMonth,'project':'应缴单位社保','money':settleForm.usocialDeduction,'account':''}, 
          {'index':'','data':'','project':'代扣个人社保','money':settleForm.psocialDeduction,'account':''},
          {'index':3,'data':settleForm.fundMonth,'project':'应缴单位公积金','money':settleForm.ufundDeduction,'account':''}, 
          {'index':'','data':'','project':'应缴个人公积金','money':settleForm.pfundDeduction,'account':''},
        ];
        let num = 4
        for(var c of res.data.engineerSettlementhFormSubList){
          settelData.push({'index':num,'data':getItemName(c.itemTypeName,c.subName)+(this.pauseTxt[c.isPause] || ''),'project':'','money':c.money,'account':''})
          num++
        }
        if(settleForm.takingBalance != 0){
          settelData.push({'index':num,'data':'商险差额','project':'','money':settleForm.takingBalance,'tax':'','account':''})
          num++
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
        settelData.push({'index':num++,'data':'结算金额合计','project':'','money':'','account':settleForm.accountMoneySum})
        settelData.push({'index':num++,'data':'开票金额合计','project':'','money':'','account':settleForm.ticketMoneySum})
        settelData.push({'index':num++,'data':'备注:','project':settleForm.remark,'money':'','account':''})
        settelData.push({'index':'','data':'','project':'','money':'','account':''})
        settelData.push({'index':'','data':'','project':'','money':'','account':''})
        settelData.push({'index':'开票日期','data':'开票金额','project':'本次结算金额','money':'本次结算到账金额','account':''})

        for(let a of engineeringFormTicketList){
          settelData.push({'index':(a.ticketTime || '').substring(0,10),'data':a.money,'project':a.currentSettleMoney,'money':a.currentSettleComeMoney,'account':''})
        }
        settelData.push({'index':engineeringFormTicketList.length + 4,'data':'','project':'','money':'','account':''})

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
          engineerAccountList[d].salaryCount = engineerAccountList[d].salaryCount ? engineerAccountList[d].salaryCount : ''
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
              let i = 0;
              for(let m in saiList){
                if(saiList[m].javaFiedName == accountTitle[c]){
                  i = 1
                  engineerAccountList[d][accountTitle[c]] = saiList[m].salaryMoney
                }
              }
              if(i == 0){
                engineerAccountList[d][accountTitle[c]] = 0
              }
            }
          }
        }
        //转换银行数据
        let salaryBankVoList = res.data.salaryBankVoList
        let bankMoney = 0
        for(var m in res.data.salaryBankVoList){
          //salaryBankVoList[m].bankName = filterDictText(this.bankOptions,salaryBankVoList[m].bankName)
          let bankName = filterDictText(this.bankOptions,salaryBankVoList[m].bankName)
          bankMoney += salaryBankVoList[m].money * 1
          if(bankName == '-' && this.bankOptions,salaryBankVoList[m].bankName){
            1 == 1
          }else{
            salaryBankVoList[m].bankName = bankName
          }
        }
        salaryBankVoList.push({
          'name':'',
          'idNumber':'',
          'bankNo':'',
          'money':bankMoney,
          'bankName':'',
          'subBranch':''
        })
        //现金
        let salaryCashVoList = res.data.salaryCashVoList
        let cashMoney = 0
        for(let m in salaryCashVoList){
          cashMoney += salaryCashVoList[m].money * 1
        }
        salaryCashVoList.push({
          'name':'',
          'idNumber':'',
          'money': cashMoney,
          'useRemark':''
        })
        let isDeductSocial = engineerAccountList.length > 0 ? engineerAccountList[0]['isDeductSocial'] : ''
        let engineerAccountListHeader
        let engineerAccountListValue
        if(isDeductSocial == 1){
          engineerAccountListHeader  = ["工资月份","结算月份","结算主体","姓名","身份证号","手机号码","银行卡号","开户行","工资发放方式","工资发放次数","工资发放时间","社保扣缴月份",
            "社保优先级","是否扣除社保"]
          engineerAccountListValue =  ["salaryDate", "settlementMonth", "settleDepartName", "empName", "empIdcard", "empPhone","bankNo", "bankName", "salaryStyle","salaryCount","salaryGiveTime","deduSocialMonth",
            "socialPriority","isDeductSocial"] 
        }else{
          engineerAccountListHeader  = ["工资月份","结算月份","结算主体","姓名","身份证号","手机号码","银行卡号","开户行","工资发放方式","工资发放次数","工资发放时间"]
          engineerAccountListValue =  ["salaryDate", "settlementMonth", "settleDepartName", "empName", "empIdcard","empPhone", "bankNo", "bankName", "salaryStyle","salaryCount","salaryGiveTime"] 
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
            tHeader: ["姓名","身份证号", "银行账号", "实发工资合计", "银行","支行"],
            filterVal: ['name','idNumber',"bankNo", "money", "bankName","subBranch"],
            tableDatas: salaryBankVoList,
            sheetName: "银行"
          },
          {
            tHeader: ["姓名","身份证号", "实发工资合计","用途"],
            filterVal: ['name','idNumber', "money", "useRemark"],
            tableDatas: salaryCashVoList,
            sheetName: "现金"
          },
          {
            tHeader: ["员工姓名", "身份证号","个人大病费用","个人失业","个人公积金合计","个人医疗费用","个人养老费用","个人社保合计"
            ,"公积金生成月份","公积金缴纳月份","社保生成月份","社保缴纳月份","单位生育费用","单位大病救助","单位公积金合计",
            "单位医疗费用","单位养老费用","单位社保合计","单位失业费用","单位工伤费用"],
            filterVal: ["empName","empIdcard","personalBigmailmentMoney","personalUnemploymentMoney","personalProvidentSum","personalMedicalMoney","personalPensionMoney","socialSecurityPersonalSum"
            ,"providentCreateMonth","providentPayMonth","socialCreateMonth","socialPayMonth","unitBirthMoney","unitBigmailmentMoney","unitProvidentSum",
            "unitMedicalMoney","unitPensionMoney","unitSocialSum","unitUnemploymentMoney","unitInjuryMoney"],
            tableDatas: res.data.forecastList,
            sheetName: "社保明细"
          },
          {
            tHeader: ["员工姓名", "员工身份证号","结算部门","保险公司","险种","保单开始时间","保单结束时间","实际保费","预估金额",
            "保单号","医保","身故或残疾","商险购买地","购买标准","结算月份","备注"],
            filterVal: ['empName','empIdcardNo', "settlementDepart", "insuranceCompanyName","insuranceTypeName","policyStart","policyEnd","buyPay","forecastBuyPay",
            "policyNo","medicalMoney","deathDisabilityMoney","businessInsuranceAddr","buyStandard","settleMonth","remark"],
            tableDatas: res.data.businessInsuranceList ? res.data.businessInsuranceList : [],
            sheetName: "商险明细"
          },
        ]
        let i = 1
        let sign = 'Y'
        if(res.data.salary.moneyFrom == 1){
          sign = "DF"
        }
        for(var d of res.data.coverList){
          let receiptUnitName = d.receiptUnitName ? d.receiptUnitName : ''
          let bankNo = d.bankNo ? d.bankNo : ''
          let bankName = d.bankName ? d.bankName : ''
          let remark = d.remark ? d.remark : ''
          d.createDate = moment().format("YYYY/MM/DD")
          let lastTwo = d.itemName.substr(d.itemName.length - 2,2)
          if(lastTwo == "其他"){
            d.itemName = d.itemName.substr(0,d.itemName.length - 2) + "工资"
          }
          if(d.payType == 1){
            let coverData = [
              {'company':d.invoiceTitle,'project':'','payType':'','money':'','no':`附件${res.data.coverList.length}张`},
              {'company':"银行转账审批单",'project':'','payType':'','money':'','no':''},
              {'company':sign+'-'+this.isBackedType[this.salaryStandardInfo.isBacked],'project':d.createDate,'payType':'结算主体编码','money':d.settleNo,'no':''},
              {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
              {'company':d.unitName,'project':d.itemName,'payType':'银行转账','money':'¥' + d.money,'no':''},
              {'company':d.settleName,'project':'','payType':'','money':'','no':''},
              {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
              {'company':"备注:",'project':remark,'payType':'','money':'','no':''},
              {'company':"收款单位名称: " + receiptUnitName + "        账号: " + bankNo + "        开户行: " + bankName,'project':'','payType':'','money':'','no':''}, 
              {'company':"公司领导：         财务负责人:" + revenueName + '         网银审核授权人：         网银转账提交人：' + this.nickname() + '         数据审核人：' + auditName + '         制表人:' + createName,'project':'' ,'payType': '','money':'','no':''},
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
              {'company':sign,'project':d.createDate,'payType':'结算主体编码','money':d.settleNo,'no':''},
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
        // 获取垫付单数据
        if(res.data.salary.advanceMoney > 0){
          let j = 1
          let advanceUrl = this.url.getAdvance + '?formId=' + settleForm.id +'&type=1'
          let status = ['提交审核','审核通过','审核不通过','待审核']
          const advanceRes = await this.exportAdvanceUrl(advanceUrl)
          if(Number(advanceRes.code) === 200){
            let advanceData = advanceRes.data
            for(let y of advanceData){
              let contractName = ''
              if(y.advancePayment.contractId){
                const contractRes =  await this.getContractName(y.advancePayment.contractId)
                if(contractRes && contractRes.code === 200){
                  contractName = contractRes.data.contractName
                }
              }
              let advanceDataOne = [
                {'company':'客户单位','project':y.advancePayment.customerName,'payType':'客户合同','money':contractName},
                {'company':'结算主体','project':y.advancePayment.departName,'payType':'垫付客户类型','money':filterDictText(this.customerTypeDicts, y.advancePayment.customerType)},
                {'company':'垫付类型	','project':filterDictText(this.advanceTypeDicts, y.advancePayment.advanceType),'payType':'申请单位','money':filterOrgan(this.organs,y.advancePayment.applyUnit)},
                {'company':'期望打款日期','project':y.advancePayment.applyAdvanceDate,'payType':'本次已垫付未回款金额','money':y.advancePayment.advanceNotPayback},
                {'company':'结算金额','project':y.advancePayment.settleMoney,'payType':'开票金额','money':y.advancePayment.ticketMoney},
                {'company':'垫付金额','project':y.advancePayment.advanceMoney,'payType':'承诺回款日期','money':y.advancePayment.paybackDate},
                {'company':'申请人	','project':y.advancePayment.createUser,'payType':'垫付原因','money':y.advancePayment.advanceReason},
              ]
              for(let w of y.approveAuditInfoList){
                let auditRemark = w.auditRemark ? w.auditRemark : ''
                advanceDataOne.push({
                  'company':w.nodeName,'project':w.auditUser + '->' + status[w.auditStatus] + '(' + auditRemark + ')','payType':'','money':''
                })
              }
              excelDatas.push({
                  tHeader: ["序号", "名字", "描述", "金钱"],
                  filterVal: ["company", "project", "payType", "money"],
                  tableDatas:advanceDataOne,
                  sheetName:'垫付申请单' + j
              })
              if(j == advanceData.length){
                let coverLength = res.data.coverList.length
                let insLength = 0
                if(settleForm.takingBalanceIds){
                  httpAction(this.url.getSalaryFrom + settleForm.id,{},'get').then((result) => {
                    if(Number(res.code) === 200){
                      let insData = []
                      insLength = 1
                      for(let y of result.data){
                        for(let w of y.businessInsuranceList){
                          insData.push(w)
                        }
                      }
                      excelDatas.push({
                        tHeader: ["员工姓名", "员工身份证号","结算主体编码","结算主体","客户单位","保险公司","险种","保单开始时间","保单结束时间","实际保费","预估金额","差额",
                        "保单号","医保","身故或残疾","商险购买地","购买标准","结算月份","备注"],
                        filterVal: ['empName','empIdcardNo',"settlementOrganNo", "settlementOrganName","customerName", "insuranceCompanyName","insuranceTypeName","policyStart","policyEnd",
                        "buyPay","forecastBuyPay","balance","policyNo","medicalMoney","deathDisabilityMoney","area","buyStandard","settleMonth","remark"],
                        tableDatas: insData,
                        sheetName: "商险差额明细"
                      })
                    }
                    let excelName = settleForm.settleMonth + settleForm.settleDepartName + "工程薪资" + '(' + filterDictText(this.formTypeOptions, res.data.salary.formType) + ')' + settleForm.settleDepartNo + '(' + settleForm.accountMoneySum + ')'
                    this.json2excel(excelDatas, excelName, true, "xlsx",coverLength,insLength)
                    this.downloadLoading = false
                  })
                }else{
                  let excelName = settleForm.settleMonth + settleForm.settleDepartName + "工程薪资" + '(' + filterDictText(this.formTypeOptions, res.data.salary.formType) + ')' + settleForm.settleDepartNo + '(' + settleForm.accountMoneySum + ')'
                  this.json2excel(excelDatas, excelName, true, "xlsx",coverLength,insLength)
                  this.downloadLoading = false
                }
              }
              j++    
            }
          }else{
            this.$message.warning(advanceRes.msg)
          }
        }else{
          let coverLength = res.data.coverList.length
          let insLength = 0
          if(settleForm.takingBalanceIds){
            const result = await this.exportSalaryFrom(this.url.getSalaryFrom + settleForm.id)
            if(Number(result.code) === 200){
              let insData = []
              insLength = 1
              for(let y of result.data){
                for(let w of y.businessInsuranceList){
                  insData.push(w)
                }
              }
              excelDatas.push({
                tHeader: ["员工姓名", "员工身份证号","结算主体编码","结算主体","客户单位","保险公司","险种","保单开始时间","保单结束时间","实际保费","预估金额","差额",
                "保单号","医保","身故或残疾","商险购买地","购买标准","结算月份","备注"],
                filterVal: ['empName','empIdcardNo',"settlementOrganNo", "settlementOrganName","customerName", "insuranceCompanyName","insuranceTypeName","policyStart","policyEnd",
                "buyPay","forecastBuyPay","balance","policyNo","medicalMoney","deathDisabilityMoney","area","buyStandard","settleMonth","remark"],
                tableDatas: insData,
                sheetName: "商险差额明细"
              })
                let excelName = settleForm.settleMonth + settleForm.settleDepartName + "工程薪资" + '(' + filterDictText(this.formTypeOptions, res.data.salary.formType) + ')' + settleForm.settleDepartNo + '(' + settleForm.accountMoneySum + ')'
                this.json2excel(excelDatas, excelName, true, "xlsx",coverLength,insLength)
                this.downloadLoading = false
            }else{
              this.$message.warning(result.msg||'')
            }
              
          }else{
            let excelName = settleForm.settleMonth + settleForm.settleDepartName + "工程薪资" + '(' + filterDictText(this.formTypeOptions, res.data.salary.formType) + ')' + settleForm.settleDepartNo + '(' + settleForm.accountMoneySum + ')'
            this.json2excel(excelDatas, excelName, true, "xlsx",coverLength,insLength)
            this.downloadLoading = false
          }
        }
        this.downVisible = false
      }
    
    },
    async exportUrl(url){
      return httpAction(url,{},'POST',120000)
    },
    async exportAdvanceUrl(url){
      return httpAction(url,{},'POST')
    },
    async getContractName(contractId){
      return httpAction(this.url.getContract + contractId,{},'GET')
    },
    async exportSalaryFrom(url){
      return httpAction(url,{},'get')
    },
    json2excel(tableJson, filenames, autowidth, bookTypes,coverLength,insLength){
      var that = this
      //这个是引用插件
      import("@/vendor/EngineBillingExcel").then(excel => {
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
          coverLength:coverLength,
          insLength: insLength
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
