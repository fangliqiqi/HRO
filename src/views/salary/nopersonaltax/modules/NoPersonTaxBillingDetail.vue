<template>
  <a-modal
    title="工资报表"
    :width="1300"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    cancelText="取消"
    okText="保存并提交"
    :visible="visible"
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
        @click="handleDownload"
        :loading="downloadLoading"
      >导出</a-button>
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
            :scroll="{ x: 1 }"
            :columns="columns"
            :dataSource="dataSourceList"
            :loading="loading"
          >
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
          key="5"
          tab="流程进展明细"
          :forceRender="true"
        >
          <salary-progress-modal
            ref="salaryProgressModal"
            :salaryStandardInfo="salaryStandardInfo"
            :auditLogList="auditLogList"
            :attaList="attaList"
          ></salary-progress-modal>
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
      <a-form :form="outForm">
        <a-form-item
          label="理由"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <!-- <a-textarea v-model="remark"></a-textarea> -->
          <a-textarea v-decorator="['remark',validatorRules.remark]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 退回 -->
    <billing-salary-back-modal ref="backModal" @ok="handleBack" :url="url.doBillingUrl"></billing-salary-back-modal>
    <!-- <a-modal
      title="退回理由"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleBackCancel"
      @ok="handleBackOk"
      cancelText="关闭"
      :visible="backVisible"
      :confirmLoading="backLoading"
      :maskClosable="false"
    >
      <a-form :form="form">
        <a-form-item
          label="理由"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea v-decorator="['remark',validatorRules.remark]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal> -->

  </a-modal>
</template>

<script>
// import { getSelectEmployeesByUser } from '@/api/api'
import { filterOrgan } from '@/utils/customDict'
import DetailList from '@/components/tools/DetailList'
import { httpAction } from '@/api/manage'
import SalarySettleAccountModal from './SettleAccountMoule'
import SalaryProgressModal from './ProgressModule'
import BillingSalaryBackModal from './../../billingsalary/modules/BillingSalaryBackModal'
import SalaryPageModal from './PageModule'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { getItemName } from '@/utils/common'

const DetailListItem = DetailList.Item

export default {
  name: 'NoPersonAuditDetail',
  components: {
    SalarySettleAccountModal,
    SalaryPageModal,
    DetailListItem,
    DetailList,
    SalaryProgressModal,
    BillingSalaryBackModal
  },
  data() {
    return {
      visible:false,
      detailVisible:false,
      loading:false,
      outVisible:false,
      downVisible:false,
      backVisible:false,
      backLoading:false,
      outLoading:false,
      downloadLoading:false,
      form:this.$form.createForm(this),
      outForm:this.$form.createForm(this),
      bankOptions:[],
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
      columns:[
        {
          width: 150,
          ellipsis: true,
          title: '账户名',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '金额',
          dataIndex: 'money',
          key: 'money',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '结算月份',
          dataIndex: 'settleMonth',
          key: 'settleMonth',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
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
          width: 220,
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
          width: 220,
          ellipsis: true,
          title: '项目名称',
          dataIndex: 'itemName',
          key: 'itemName',
          align: 'center',
          customRender: (text,record) => {
            const result = getItemName(record.itemTypeName,text) || '-'
            return result
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '发放方式',
          dataIndex: 'salaryStyle',
          key: 'salaryStyle',
          align: 'center',
          customRender:(text) => {
            return this.salaryStyleOption[text] || '-'
          }
        },
      ],
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
        doExportUrl:'/salary/salary/doExportSalary',
        doBillingUrl:'/salary/tsalarystandard/doBilling',
        getPrintCount:"/salary/tprintrecord/getPrintCount",
        getAdvance: "/hrApproval/tadvancepayment/getByFormId",
        getOrgan: '/admin/organizationinfo/getUserAllOrgan',
        getContract:'/hrBase/tcustomercontract/',
        mathDetailUrl:'/salary/treciverecord/getMatchingByMatchId', // 匹配明细列表
      },
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      validatorRules: {
        remark: { rules: [{ required: true, message: '请填写理由!' },{max:500,message:'最多500个字符!'}] },
      },
      activeKey:'1',
      salaryStandardInfo:'',
      activityKey:'1',
      dataSourceList:[],
      detailData:{},
      saiList:[],
      coverList:[],
      employData:[],
      customerTypeDicts:[],
      advanceTypeDicts:[],
      organs: [],
      settlementhFormInfo:{},
      pauseDiyInfoList:[],
      poorBalanceInfoList:[],
      salaryAccountOne:{},
      article: '',
      fullscreenLoading: true,
      settlementList:[],
      isBackedType:['新表','退表重传'],
      auditLogList:[],//流程进展明细
      attaList: [],

    }
  },
  methods: {
    ...mapGetters(["nickname", "avatar","userInfo"]),
    filterOrgan,
    show(record,detailInfo) {
      this.initDictConfig()
      this.getOrgans()
      this.loadMatchDetailInfo(record.id)
      
      this.salaryStandardInfo = record
      this.salaryStandardInfo.noBusinessType = 1 //有个结算表不需要业务类型显示
      this.detailData = detailInfo
      this.coverList = detailInfo.coverList
      this.settlementhFormInfo = detailInfo.settlementhForm
      this.pauseDiyInfoList = detailInfo.settlementhFormSubList != null ? detailInfo.settlementhFormSubList : []
      this.poorBalanceInfoList = detailInfo.poorBalanceInfoList != null ? detailInfo.poorBalanceInfoList : []
      this.dataSourceList = this.detailData.nonTaxAccountList
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
      this.visible = true
      this.changeTab(this.activityKey)
      // if(Number(this.activityKey) !== 1){
      //   const _this = this
      //   setTimeout(function(){
      //     _this.changeTab(_this.activityKey)
      //   },500)
      // }
    },
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
      if(Number(key) === 5){
        this.$nextTick(()=>{
          this.$refs.salaryProgressModal.show()
        })
        
      }
      
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.remark = ''
      this.form.resetFields()
      this.coverList = []
      // this.activityKey = '1'
    },
    // 获取匹配明细
    loadMatchDetailInfo(recordId){
      // 出账类型type：0普通工资1工程工资2商险3社保核准表4公积金核准表5纯收入6社保预估单
      const detailUrl = `${this.url.mathDetailUrl}?matchId=${recordId}&type=0`
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
          this.organs = res.data;
        }
      });
    },
    handleOk() {

    },
    // 展示单个工资明细详情明细
    detail(id){
      for(const c of this.dataSourceList){
        if(String(c.id) === String(id)){
          this.saiList = c.saiList
          break
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
    //导出弹框取消
    handleDownloadCancel(){
      this.downVisible = false
    },
    // 确认出账弹框
    handleOutSubmit() {
      this.outVisible = true
      this.remark = ''
    },
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then((res) => {
        if (Number(res.code) === 200) {
          this.bankOptions = res.data
        }
      });
      initDictOptions('ADVANCE_CUSTOMER_TYPE').then((res) => {
        if (Number(res.code) === 200) {
          this.customerTypeDicts = res.data;
        }
      });
      initDictOptions('ADVANCE_ADVANCE_TYPE').then((res) => {
        if (Number(res.code) === 200) {
          this.advanceTypeDicts = res.data;
        }
      });
    },
    // 提交出账理由
    handleOutOk() {
      const that = this
      this.outForm.validateFields((err,values) => {
        if(!err){
          this.outLoading = true
          const url = `${that.url.doBillingUrl}?tSettlementhFormId=${that.settlementhFormInfo.id}`
          httpAction(url,{'id':that.salaryStandardInfo.id,'status':4,'remark':values.remark},'POST').then((res) => {
            if(Number(res.code) === 200){
              that.$emit('ok')
              that.outVisible = false
              that.$message.success("出账成功")
              that.close()
            } else {
              that.$message.error(res.msg)
            }
          }).finally(()=>{
            that.outLoading = false
          })
        }
      })
    },
    handleOutCancel(){
      this.outForm.resetFields()
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

    //查看认领
    handleDetail: function() {
      this.$refs.finishReceiveDetailModal.title = '认领详情'
      this.$refs.finishReceiveDetailModal.settleDomainBelongs = this.settlementList
      this.$refs.finishReceiveDetailModal.edit(this.settlementhFormInfo.id)
      this.$refs.finishReceiveDetailModal.loadData()
    },
    //打印
    handlePrint(){
      const that = this
      httpAction(this.url.getPrintCount,{'fromId':this.settlementhFormInfo.id,'fromType':0},"POST").then((res) => {
        if(Number(res.code) === 200){
          if(res.data >= 1){
            this.$confirm({
              title: '是否再次打印',
              content: '该表单已打印,需要继续吗',
              onOk() {
                let routeData = that.$router.resolve({
                  path: "/pdf/nopersonbillingpdf",
                  query: {id:that.salaryStandardInfo.id,count:res.data},
                });
                window.open(routeData.href, '_blank')
              },
              onCancel() {},
            });
          }else{
            let routeData = that.$router.resolve({
              path: "/pdf/nopersonbillingpdf",
              query: {id:that.salaryStandardInfo.id,count:res.data},
            });
            window.open(routeData.href, '_blank')
          }
        }
      })
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
        let settleForm = res.data.settlementhForm
        // 结算单数据
        let settelData = [
          {'index':settleForm.settleMonth + '结算单','data':'','project':'','money':'','tax':'','account':''},
          {'index':'结算名称:','data':settleForm.settleDepartName,'project':'','money':'','tax':'皖信盖章:','account':''},
          {'index':'结算编码:','data':settleForm.settleDepartNo,'project':'','money':'','tax':'','account':''},
          {'index':'结算时间:','data':settleForm.settleMonth,'project':'','money':'','tax':'','account':''},
          {'index':'序号','data':'费用项目','project':'','money':'金额','tax':'税费','account':'开票额小计'},
          {'index':1,'data':'代扣当月个人税','project':'','money':settleForm.personalCurmonthTax,'tax':'','account':''},
        ];
        let num = 2
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
        let salaryAccountListHeader = ["账户名","金额","结算月份","开户行","银行卡号","项目名称","发放方式"]
        let salaryAccountListValue = ["name",'money','settleMonth','bankName','bankNo','itemName','salaryStyle']
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
          salaryAccountList[d].settleMonth = salaryAccountList[d].settleMonth ? salaryAccountList[d].settleMonth : ''
          salaryAccountList[d].bankNo = salaryAccountList[d].bankNo ? salaryAccountList[d].bankNo : ''
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
        //银行
        let salaryBankVoList = res.data.salaryBankVoList
        let bankMoney = 0
        for(let m in salaryBankVoList){
          salaryBankVoList[m].idNumber = salaryBankVoList[m].idNumber ? salaryBankVoList[m].idNumber : ''
          salaryBankVoList[m].useRemark = salaryBankVoList[m].useRemark ? salaryBankVoList[m].useRemark : ''
          bankMoney += salaryBankVoList[m].money * 1
          let bankName = filterDictText(this.bankOptions,salaryBankVoList[m].bankName)
          //salaryBankVoList[m].bankName = filterDictText(this.bankOptions,salaryBankVoList[m].bankName)
          if(bankName == '-' && this.bankOptions,salaryBankVoList[m].bankName){
            1 == 1
          }else{
            salaryBankVoList[m].bankName = bankName
          }
        }

        //现金
        let salaryCashVoList = res.data.salaryCashVoList
        let cashMoney = 0
        for(let m in salaryCashVoList){
          cashMoney += salaryCashVoList[m].money * 1
        }
        salaryCashVoList.push({
          'name':'',
          'idNumber':'',
          'money': cashMoney
        })
        salaryBankVoList.push({
          'name':'',
          'idNumber':'',
          'bankNo':'',
          'money':bankMoney,
          'bankName':'',
          'subBranch':''
        })
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
            tHeader: ["员工姓名", "员工身份证号","结算部门","保险公司","险种","保单开始时间","保单结束时间","实际保费",
            "保单号","医保","身故或残疾","商险购买地","购买标准","结算月份","备注"],
            filterVal: ['empName','empIdcardNo', "settlementDepart", "insuranceCompanyName","insuranceTypeName","policyStart","policyEnd",
            "buyPay","policyNo","medicalMoney","deathDisabilityMoney","businessInsuranceAddr","buyStandard","settleMonth","remark"],
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
              {'company':sign+'-'+this.isBackedType[this.salaryStandardInfo.isBacked],'project':d.createDate,'payType':'结算主体编码','money':d.settleNo,'no':''},
              {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
              {'company':d.unitName,'project':d.itemName,'payType':'银行转账','money':'¥' + d.money,'no':''},
              {'company':d.settleName,'project':'','payType':'','money':'','no':''},
              {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
              {'company':"备注:" ,'project':remark,'payType':'','money':'','no':''},
              {'company':"收款单位名称: " + receiptUnitName + "        账号:" + bankNo + "        开户行:" + bankName,'project':'','payType':'','money':'','no':''},
              {'company':"公司领导：        财务负责人:" + revenueName + '        网银审核授权人：        网银转账提交人：' + this.nickname() + '        数据审核人：' + auditName + '        制表人:' + createName,'project':'' ,'payType': '','money':'','no':''},
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
              {'company':"公司领导：        财务负责人：" + revenueName + '        出纳会计: ' + '        数据审核人：' + auditName + '        制表人: ' + createName,'project': '' ,'payType':'','money':'','no':''},
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
          let advanceUrl = this.url.getAdvance + '?formId=' + settleForm.id +'&type=0'
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
                let excelName = settleForm.settleMonth + settleForm.settleDepartName + "(非扣税项)" + settleForm.settleDepartNo + '(' + settleForm.accountMoneySum + ')'
                this.json2excel(excelDatas, excelName, true, "xlsx",coverLength)
              }
              j++
            } 
          }else{
            this.$message.warning(advanceRes.msg)
          }
        }else{
          let coverLength = res.data.coverList.length
          let excelName = settleForm.settleMonth + settleForm.settleDepartName + "(非扣税项)" + settleForm.settleDepartNo + '(' + settleForm.accountMoneySum + ')'
          this.json2excel(excelDatas, excelName, true, "xlsx",coverLength)
        }

        this.downloadLoading = false
        this.downVisible = false
      }else{
        this.$message.warning(res.msg)
      }
    

    },
    async exportAdvanceUrl(url){
      return httpAction(url,{},'POST')
    },
    async exportUrl(url){
      return httpAction(url,{},'POST',120000)
    },
    async getContractName(contractId){
      return httpAction(this.url.getContract + contractId,{},'GET')
    },
    json2excel(tableJson, filenames, autowidth, bookTypes,coverLength){
      var that = this
      //这个是引用插件
      import("@/vendor/NoPersonBillingExport").then(excel => {
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
          coverLength:coverLength
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
