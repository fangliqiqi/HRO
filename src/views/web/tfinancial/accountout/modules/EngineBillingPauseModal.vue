<template>
  <a-modal
    title="工程薪资暂停发放出账"
    :width="1200"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
      <a-button
        type="primary"
        @click="handleFail"
        style="background:red;border:red"
      >退回</a-button>
      <!-- <router-link
        target="_blank"
        :to="{path:'/pdf/billingsalarypause',query:{id:model.id}}"
        style="margin-left:5px;margin-right:5px"
      >
        <a-button type="primary">打印封面</a-button>
      </router-link> -->
      <a-button
        type="primary"
        @click="handlePrint"
      >表单打印</a-button>
      <a-button
        type="primary"
        @click="handleDownload"
      >导出</a-button>
      <a-button
        type="primary"
        @click="handleOutSubmit"
        :loading="submitLoading"
      >确定出账</a-button>
    </template>
    <a-spin
      :spinning="spinning"
      tip="Loading..."
    >
      <a-card
        :bordered="false"
        style="background:#f5f5f5"
      >
        <a-tabs
          :activeKey="activeKey"
          @change="changeTab"
        >
          <a-tab-pane
            tab="报账表"
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
            <engine-billing-pause-settle-modal
              ref="settleAccountModal"
              :settlementhFormInfo="settlementhFormInfo"
              :pauseDiyInfoList="pauseDiyInfoList"
              :poorBalanceInfoList="poorBalanceInfoList"
              :salaryAccountOne="salaryAccountOne"
            ></engine-billing-pause-settle-modal>
          </a-tab-pane>
          <a-tab-pane
            tab="封面"
            key="3"
            :forceRender="true"
          >
            <engine-billing-page-modal ref="engineBillingPageModal"></engine-billing-page-modal>
            <!-- <audit-page-modal ref="auditPageModal"></audit-page-modal> -->
          </a-tab-pane>
          <a-tab-pane
            tab="流程进展明细"
            key="4"
          >
            <pause-process-modal
              ref="salaryProgressModal"
              :salaryStandardInfo="salaryStandardInfo"
              :fileList="fileListArr"
            ></pause-process-modal>
          </a-tab-pane>
        </a-tabs>

        <!--- 发放出账详情 -->
        <statement-detail-modal ref="statementDetailModal"></statement-detail-modal>

        <a-modal
          title="退回理由"
          :width="600"
          placement="right"
          :closable="true"
          @cancel="handleBackCancel"
          @ok="handleBackOk"
          cancelText="关闭"
          okText="确定"
          :visible="visibleBack"
          :confirmLoading="confirmLoading"
          :maskClosable="false"
        >
          <a-form :form="form">
            <a-form-item label="理由">
              <a-textarea
                :rows="3"
                :maxLength="200"
                placeholder="请输入退回理由(最多200字)"
                v-decorator="['remark', validatorRules.remark]"></a-textarea>
            </a-form-item>
          </a-form>
        </a-modal>
      </a-card>
    </a-spin>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tools/DetailList'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import { httpAction } from '@/api/manage'
import EngineBillingPageModal from "./EngineBillingPageModal"
import EngineBillingPauseSettleModal from "./EngineBillingPauseSettleModal"
import { getItemName } from '@/utils/common'
import { mapGetters } from 'vuex'
import moment from 'moment'
import StatementDetailModal from '../../../../salary/searchsalary/modules/StatementDetailModal'
import PauseProcessModal from '@/views/salary/salaryenginepause/modules/PauseProcessModal'
const DetailListItem = DetailList.Item

export default {
  name: 'EngineBillingPauseModal',
  components: {
    EngineBillingPageModal,
    EngineBillingPauseSettleModal,
    DetailListItem,
    DetailList,
    StatementDetailModal,
    PauseProcessModal
  },
  data(){
    return{
      visible:false,
      loading:false,
      visibleBack:false,
      confirmLoading:false,
      spinning:false,
      submitLoading:false,
      activeKey:'1',
      coverList:[],
      dataSourceList:[],
      employData:[],
      form:this.$form.createForm(this),
      salaryAccount:{},
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      validatorRules:{
        remark: { rules: [{ required: true, message: '请输入退回理由(最多200字)!',max:200 }] },
      },
      columns:[],
      url:{
        detailUrl:"salary/tchargerecord/openChargeRecordDetail",
        doIssuePause:"salary/tchargerecord/doIssuePause",
        getPrintCount:"/salary/tprintrecord/getPrintCount",
      },
      model:{},
      scroll:{},
      settlementhFormInfo:{},
      salaryAccountOne:{},
      salaryStandardInfo:{},
      poorBalanceInfoList: [],
      pauseDiyInfoList:[],
      fileListArr:{}
    }
  },
  props: {
    bankOptions: {
      type:Array,
      required:true
    }
  },
  methods:{
    ...mapGetters(["nickname", "avatar","userInfo"]),
    async show(record){
      
      this.activeKey = '1'
      this.visible = true
      this.loading = true
      this.model = Object.assign({}, record)
      this.dataSourceList = []
      this.coverList = []
      const res = await httpAction(this.url.detailUrl + "?chargeRecordId=" + record.id, {}, "POST");
      if(res.code == 200){
        this.loading = false
        this.dataSourceList = res.data.engineerAccount
        this.columns = [
          {
            title: '姓名',
            dataIndex: 'empName',
            width: 130,
            fixed: 'left',
            align: 'center',
            key: 'empName',
            ellipsis: true,
            customRender: (text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            }
          },
          {
            title: '身份证号',
            width: 160,
            align: 'center',
            dataIndex: 'empIdcard',
            key: 'empIdcard',
            ellipsis: true,
            customRender: (text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            }
          },
          {
            width: 120,
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
            title: '银行卡号',
            width: 150,
            align: 'center',
            dataIndex: 'bankNo',
            key: 'bankNo',
            ellipsis: true,
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            title: '开户行',
            width: 150,
            align: 'center',
            dataIndex: 'bankName',
            key: 'bankName',
            ellipsis: true,
            customRender: (text) => {
              let bankName = filterDictText(this.bankOptions, text)
              if(bankName == '-' && text){
                return text;
              }
              return <a-tooltip title={bankName}>{bankName}</a-tooltip>
            },
          },
          {
            title: '工资发放时间',
            width: 130,
            align: 'center',
            dataIndex: 'salaryGiveTime',
            key: 'salaryGiveTime',
            ellipsis: true,
            customRender: (text) => {
              const res = this.salaryGiveTimeOption[text]
              return <a-tooltip title={res}>{res}</a-tooltip>
            }
          },
          {
            title: '工资月份',
            width: 130,
            align: 'center',
            dataIndex: 'salaryDate',
            key: 'salaryDate',
            ellipsis: true,
            customRender: (text) => {
              return <a-tooltip title={text}>{text}</a-tooltip>
            }
          },
          {
            title: '结算月份',
            width: 130,
            align: 'center',
            dataIndex: 'settlementMonth',
            key: 'settlementMonth',
            ellipsis: true,
            customRender: (text) => {
              return <a-tooltip title={text}>{text}</a-tooltip>
            }
          },
          {
            title: '结算主体',
            width: 130,
            align: 'center',
            dataIndex: 'settleDepartName',
            key: 'settleDepartName',
            ellipsis: true,
            customRender: (text) => {
              return <a-tooltip title={text}>{text}</a-tooltip>
            }
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
              key: 'deduSocialMonth',
              ellipsis: true,
              customRender: (text) => {
                return <a-tooltip title={text}>{text}</a-tooltip>
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
              ellipsis: true,
              customRender: (text) => {
                const res = this.socialPriorityOption[text]
                return <a-tooltip title={res}>{res}</a-tooltip>
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
              ellipsis: true,
              customRender: (text) => {
                const res = (!text) ? '否' : this.isFlag[text]
                return <a-tooltip title={res}>{res}</a-tooltip>
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
        this.settlementhFormInfo = res.data.engineerSettlementForm
        this.salaryStandardInfo = res.data.engineerSettlementForm
        this.salaryStandardInfo.status = 7
        
        const result = await httpAction(`/salary/tsalaryatta/getTSalaryAttaList?recordId=${record.id}`,null,'get');
        if(result.code === 200){
          const fileList = {"0":[],"1":[],"2":[],"3":[]}
          result.data.forEach(item => {
            fileList[item.engineerType].push({
              uid: item.id,
              name: item.attaName,
              status: 'done',
              url: item.attaUrl
            })
          });
          this.fileListArr = fileList
        }else{
          this.$message.warning(result.msg);
        }
        
        this.salaryAccountOne = res.data.engineerAccount.length > 0 ? res.data.engineerAccount[0] : []
        this.poorBalanceInfoList = res.data.poorBalanceInfoList
        this.pauseDiyInfoList = res.data.engineerSettlementhFormSubList
        if(res.data.pauseBankCover){
          res.data.pauseBankCover.payType = 1
          // res.data.pauseBankCover.bankName = filterDictText(this.bankOptions, res.data.pauseBankCover.bankName)
          this.coverList.push(res.data.pauseBankCover)
        }
        if(res.data.pauseBankCoverTwo){
          res.data.pauseBankCoverTwo.payType = 1
          // res.data.pauseBankCover.bankName = filterDictText(this.bankOptions, res.data.pauseBankCover.bankName)
          this.coverList.push(res.data.pauseBankCoverTwo)
        }
        if(res.data.pauseCashCover){
          res.data.pauseCashCover.payType = 0
          this.coverList.push(res.data.pauseCashCover)
        }
        if(res.data.pauseCashCoverTwo){
          res.data.pauseCashCoverTwo.payType = 0
          this.coverList.push(res.data.pauseCashCoverTwo)
        }
      }else{
        this.$message.warning(res.msg);
      }

      const res1 = await httpAction('/admin/user/userDic','','GET');
      if(Number(res1.code) === 200){
        this.employData = res1.data
      }

    },
    close(){
      this.visible = false
      this.coverList = []
      this.dataSourceList = []
    },
    handleCancel(){
      this.close()
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
      this.$refs.statementDetailModal.title = '发放出账详情'
      this.$refs.statementDetailModal.salaryType = 1 // 0:普通薪资 1:工程工资 2:非扣税类，默认普通薪资
      this.$refs.statementDetailModal.saiList = salaryList
      this.$refs.statementDetailModal.show()
    },
    // 退回
    handleBackSubmit(){

    },
    // 发放失败
    handleFail(){
      this.form.resetFields()
      this.visibleBack = true
    },
    // 发放失败理由提交
    handleBackOk(){
      const that = this
      this.form.validateFields((err,values) => {
        if(!err){
          this.confirmLoading = true
          const url = `${this.url.doIssuePause}?chargeRecordId=${this.model.id}&chargeStatus=2&remark=${values.remark}`
          httpAction(url,{},'POST').then((res) => {
            this.confirmLoading = false
            if(Number(res.code) === 200){
              that.$message.success("重新发放成功")
              that.$emit('ok')
              that.visibleBack = false
              that.visible = false
            }else{
              that.$message.error(res.msg)
            }
          })
        }
      })
    },
    handleBackCancel(){
      this.visibleBack = false
    },
    // 确定出账
    handleOutSubmit(){
      const that = this
      const url = `${this.url.doIssuePause}?chargeRecordId=${this.model.id}&chargeStatus=1&remark=`
      this.$confirm({
        title: '确认出账成功',
        content: '确认出账成功?',
        onOk() {
          httpAction(url,{},'POST').then((res) => {
            if(Number(res.code) === 200){
              that.$message.success("发放成功")
              that.$emit('ok')
              that.visible = false
            }else{
              that.$message.error(res.msg)
            }
          })
        },
        onCancel() {},
      })
    },
    //打印
    handlePrint(){
      let that = this
      httpAction(this.url.getPrintCount,{'fromId':this.model.id,'fromType':2},"POST").then((res) => {
        if(Number(res.code) === 200){
          if(res.data >= 1){
            this.$confirm({
              title: '是否再次打印',
              content: '该表单已打印,需要继续吗',
              onOk() {
                let routeData = that.$router.resolve({
                  path: "/pdf/enginebillingpause",
                  query: {id:that.model.id,count:res.data},
                });
                window.open(routeData.href, '_blank')
              },
              onCancel() {},
            });
          }else{
            let routeData = that.$router.resolve({
              path: "/pdf/enginebillingpause",
              query: {id:that.model.id,count:res.data},
            });
            window.open(routeData.href, '_blank')
          }
        }
      })
      
    },
    // 切换tab
    changeTab(key){
      this.activeKey = key
      if(Number(key) === 2){
        this.$refs.settleAccountModal.show()
      }
      if(Number(key) === 3){
        this.$refs.engineBillingPageModal.employData = this.employData
        this.$refs.engineBillingPageModal.show(this.coverList)
      }
      if(Number(key) === 4){
        const _this = this
        setTimeout(()=>{
          _this.$refs.salaryProgressModal.show(true);
        })
      }
    },
     // 导出
    handleDownload(){
      let auditName = ''
      let createName = ''
      let revenueName = ''
      if(this.model.chargeUser){
        for(const c in this.employData){
          if(c == this.model.chargeUser){
            createName = this.employData[c]
          }
        }
      }
      let settleForm = this.settlementhFormInfo
      let engineeringFormTicketList = []
      settleForm.ufundDeduction = settleForm.ufundDeduction ? settleForm.ufundDeduction : ''
      settleForm.pfundDeduction = settleForm.pfundDeduction ? settleForm.pfundDeduction : ''
      settleForm.unitIncomeTax = settleForm.unitIncomeTax ? settleForm.unitIncomeTax : ''
      settleForm.personIncomeTax = settleForm.personIncomeTax ? settleForm.personIncomeTax : ''
      settleForm.unitIncomeTaxTicket = settleForm.unitIncomeTaxTicket ? settleForm.unitIncomeTaxTicket : ''
      settleForm.personIncomeTaxTicket = settleForm.personIncomeTaxTicket ? settleForm.personIncomeTaxTicket : ''
      settleForm.socialMonth = settleForm.socialMonth ? settleForm.socialMonth : ''
      settleForm.fundMonth = settleForm.fundMonth ? settleForm.fundMonth : ''
      // 结算单数据
      let settelData = [
        {'index':settleForm.settleMonth + '结算单','data':'','project':'','money':'','account':' '},
        {'index':'结算名称:','data':settleForm.settleDepartName,'project':'','money':'皖信盖章','account':' '},
        {'index':'结算编码:','data':settleForm.settleDepartNo,'project':'','money':'','account':' '},
        {'index':'结算时间:','data':settleForm.settleMonth,'project':'','money':'','account':' '},
        {'index':'序号','data':'费用项目','project':'','money':'金额','account':'开票额小计'},
        {'index':1,'data':settleForm.salaryMonth,'project':'应发工资','money':settleForm.salarySum,'account':settleForm.salaryTicket}, 
        {'index':'','data':'','project':'实发工资(银付)','money':settleForm.cardPay,'account':' '},
        {'index':'','data':'','project':'实发工资(现金)','money':settleForm.moneyPay,'account':' '},
        {'index':'','data':'','project':'暂停发金额','money':settleForm.pausePay,'account':' '},
        {'index':2,'data':settleForm.socialMonth,'project':'应缴单位社保','money':settleForm.usocialDeduction,'account':''}, 
        {'index':'','data':'','project':'代扣个人社保','money':settleForm.psocialDeduction,'account':''},
        {'index':3,'data':settleForm.fundMonth,'project':'应缴单位公积金','money':settleForm.ufundDeduction,'account':''}, 
        {'index':'','data':'','project':'应缴个人公积金','money':settleForm.pfundDeduction,'account':''},
      ];
      let num = 4
      if(this.pauseDiyInfoList){
        for(var c of this.pauseDiyInfoList){
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
      settelData.push({'index':'','data':'','project':'','money':'','account':''})
      settelData.push({'index':'','data':'','project':'','money':'','account':''})
      settelData.push({'index':'开票日期','data':'开票金额','project':'本次结算金额','money':'本次结算到账金额','account':''})
      for(let a of engineeringFormTicketList){
        settelData.push({'index':(a.ticketTime || '').substring(0,10),'data':a.money,'project':a.currentSettleMoney,'money':a.currentSettleComeMoney,'account':''})
      }
      settelData.push({'index':engineeringFormTicketList.length + 4,'data':'','project':'','money':'','account':''})
      let isDeductSocial = this.dataSourceList[0].isDeductSocial 
      let engineerAccountListHeader
      let engineerAccountListValue
      if(isDeductSocial == 1){
        engineerAccountListHeader = ["工资月份","结算月份","结算主体","姓名","身份证号","手机号码","银行卡号","开户行","工资发放方式","工资发放次数","工资发放时间","社保扣缴月份",
          "社保优先级","是否扣除社保"]
        engineerAccountListValue = ["salaryDate", "settlementMonth", "settleDepartName", "empName", "empNo", "empPhone","bankNo", "bankName", "salaryStyle","salaryCount","salaryGiveTime","deduSocialMonth",
          "socialPriority","isDeductSocial"]
      }else{
        engineerAccountListHeader = ["工资月份","结算月份","结算主体","姓名","身份证号","手机号码","银行卡号","开户行","工资发放方式","工资发放次数","工资发放时间"]
        engineerAccountListValue = ["salaryDate", "settlementMonth", "settleDepartName", "empName", "empNo", "empPhone","bankNo", "bankName", "salaryStyle","salaryCount","salaryGiveTime"] 
      }
      var excelDatas = [
        {
          tHeader: engineerAccountListHeader, // 表一的数据字段
          filterVal: engineerAccountListValue, // sheet表一头部
          tableDatas: this.dataSourceList, // 表一的整体json数据
          sheetName: "报账表"// 表一的sheet名字
        },
        {
          tHeader: ["序号",null,"费用项目", "金额", "开票额小计"],
          filterVal: ['index','data',"project", "money", "account"],
          tableDatas: settelData,
          sheetName: "结算单"
        },
      ]
      let i =1
      for(var d of this.coverList){
        d.unitName = d.unitName ? d.unitName : ''
        d.settleName = d.settleName ? d.settleName : ''
        d.itemName = d.itemName ? d.itemName : ''
        d.settleNo = d.settleNo ? d.settleNo : ''
        d.title = d.title ? d.title : ''
        d.remark = d.remark ? d.remark : ''
        d.createDate = moment().format("YYYY/MM/DD")
        let lastTwo = d.itemName.substr(d.itemName.length - 2,2)
        if(lastTwo == "其他"){
          d.itemName = d.itemName.substr(0,d.itemName.length - 2) + "工资"
        }
        if(d.payType == 1){
          let coverData = [
            {'company':d.title,'project':'','payType':'','money':'','no':`附件${this.coverList.length}张`},
            {'company':"银行转账审批单",'project':'','payType':'','money':'','no':''},
            {'company':"Z",'project':d.createDate,'payType':'结算主体编码','money':d.settleNo,'no':''},
            {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
            {'company':d.unitName,'project':d.itemName,'payType':'银行转账','money':'¥' + d.money,'no':''},
            {'company':d.settleName,'project':'','payType':'','money':'','no':''},
            {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
            {'company':"备注: " ,'project':d.remark,'payType':'','money':'','no':''},
            {'company':"收款单位名称: " + d.organName + "        账号: " + d.bankNo + "        开户行: " + d.bankName,'project':'','payType':'','money':'','no':''},
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
            {'company':d.title,'project':'','payType':'','money':'','no':`附件${this.coverList.length}张`},
            {'company':"现金付款审批单",'project':'','payType':'','money':'','no':''},
            {'company':"Z",'project':d.createDate,'payType':'部门编码','money':d.settleNo,'no':''},
            {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
            {'company':d.unitName ,'project':d.itemName,'payType':'现金转账','money':'¥' + d.money,'no':''},
            {'company':d.settleName,'project':'','payType':'','money':'','no':''},
            {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
            {'company':"备注: " ,'project':d.remark,'payType':'','money':'','no':''},
            {'company':"公司领导：         财务负责人：" + revenueName + '         出纳会计: ' + '         数据审核人：' + auditName + '         制表人: ' + createName,'project':'','payType':'','money':'','no':''},
          ]
          excelDatas.push({
            tHeader: ["序号", "名字", "描述", "金钱", "地位"],
            filterVal: ["company", "project", "payType", "money",'no'],
            tableDatas:coverData,
            sheetName:'转账封面' + i
          })
        }
        i++;
      }
      let excelName = this.dataSourceList[0].settlementMonth + this.dataSourceList[0].settleDepartName + "工程薪资暂停发" + this.dataSourceList[0].settleDepartNo 
      this.json2excel(excelDatas, excelName, true, "xlsx")
    },
    json2excel(tableJson, filenames, autowidth, bookTypes){
      var that = this
      //这个是引用插件
      import("@/vendor/ExportEnginePause").then(excel => {
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
        if(j == "salaryStyle"){
          return this.salaryStyleOption[v[j]]
        }
        if(j == "salaryGiveTime"){
          return this.salaryGiveTimeOption[v[j]]
        }
        if(j == "salaryTaxFlag" || j == "isDeductSocial" || j == "isDeductFund"){
          return this.isFlag[v[j]]
        }
        if(j == "socialPriority"){
          return this.socialPriorityOption[v[j]]
        }
        if(j == "fundPriority"){
          return this.fundPriorityOption[v[j]]
        }
        if(j == "annualBonusType"){
          return this.annualBonusTypeOption[v[j]]
        }
        return v[j] || ''
      }))
    }
  }
}
</script>
