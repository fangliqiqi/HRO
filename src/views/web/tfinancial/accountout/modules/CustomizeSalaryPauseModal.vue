<template>
  <a-modal
    :title="title"
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
      <template v-if="isAudit">
        <a-button
          type="primary"
          @click="handleAudit"
          v-has="'wxhr:tchargerecord_doauditchargerecord'"
        >审核</a-button>
      </template>
      <template v-else>
        <a-button
          type="primary"
          @click="handleFail"
          style="background:red;border:red"
        >退回</a-button>
        <!-- <router-link
          target="_blank"
          :to="{path:'/pdf/diysalarypause',query:{id:model.id}}"
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
          @click="handleOutSubmit"
        >确定出账</a-button>
      </template>
      <a-button
        type="primary"
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
          tab="结算单"
          key="1"
          :forceRender="true"
        >
          <customize-salary-settle-modal
            v-if="settleType==0"
            ref="customizeSalarySettleModal"
            :settlementhFormInfo="settlementhFormInfo"
            :pauseDiyInfoList="pauseDiyInfoList" 
            :poorBalanceInfoList="poorBalanceInfoList"
            :salaryStandardInfo="salaryStandardInfo"
            :salaryInfo="salaryInfo"
          ></customize-salary-settle-modal>
          <salary-settle-account-modal
            v-else-if="settleType==1"
            ref="settleAccountModal"
            :salaryStandardInfo="salaryStandardInfo"
            :settlementhFormInfo="settlementhFormInfo"
            :pauseDiyInfoList="pauseDiyInfoList"
            :poorBalanceInfoList="poorBalanceInfoList"
            :salaryAccountOne="salaryAccountOne"
          ></salary-settle-account-modal>
          <engine-salary-settle-modal
            ref="engineSettleAccountModal"
            v-else-if="settleType==5"
            :salaryStandardInfo="salaryStandardInfo"
            :settlementhFormInfo="settlementhFormInfo"
            :pauseDiyInfoList="pauseDiyInfoList"
            :poorBalanceInfoList="poorBalanceInfoList"
            :salaryAccountOne="salaryAccountOne"
          >
          </engine-salary-settle-modal>
          
        </a-tab-pane>
        <a-tab-pane
          tab="封面"
          key="2"
          :forceRender="true"
        >
          <customize-billing-page-modal
            ref="customizeBillingPageModal"
            :coverList="coverList"
            :bankOptions="bankOptions"
            :employData="employData"
          ></customize-billing-page-modal>
        </a-tab-pane>
        <a-tab-pane tab="流程进展明细" key="3" forceRender>
          <process-modal
            ref="ProcessForm"
            :attaList="attaList"
            :salaryStandardInfo="model"
            :userList="employData"
          >
          </process-modal>
        </a-tab-pane>
      </a-tabs>

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

      <a-modal
        title="全国运营中心审核"
        :width="600"
        placement="right"
        :closable="true"
        @cancel="handleAuditCancel"
        @ok="handleAuditOk"
        cancelText="关闭"
        okText="确定"
        :visible="visibleAudit"
        :confirmLoading="confirmLoading"
        :maskClosable="false"
      >
        <a-form :form="auditForm">
          <a-form-item label="是否通过">
            <a-radio-group
              @change="changeAudit"
              v-decorator="['chargeStatus',{ rules: [{ required: true, message: '请选择是否通过!' }] }]"
            >
              <a-radio value="0">通过</a-radio>
              <a-radio value="4">不通过</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="审核意见">
            <a-textarea v-decorator="['auditRemark', { rules: [{ required: isRequire, message: '请输入审核意见!' },{max:250,message:'审核意见不超过250个字符!'}] }]"></a-textarea>
          </a-form-item>
        </a-form>
      </a-modal>

    </a-card>
  </a-modal>
</template>
<script>
import CustomizeSalarySettleModal from "./CustomizeSalarySettleModal"
import SalarySettleAccountModal from './SettleAccountMoule'
import CustomizeBillingPageModal from "./CustomizeBillingPageModal"
import EngineSalarySettleModal from './EngineSalarySettleModal'

import { httpAction } from '@/api/manage'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import { mapGetters } from 'vuex'
import { getItemName } from '@/utils/common'
import ProcessModal from './ProcessModal'
import moment from 'moment'
export default {
  name: 'CustomizeSalaryPauseModal',
  components: {
    CustomizeSalarySettleModal,
    CustomizeBillingPageModal,
    SalarySettleAccountModal,
    EngineSalarySettleModal,
    ProcessModal
  },
  data(){
    return{
      visible:false,
      loading:false,
      confirmLoading:false,
      visibleBack:false,
      isAudit:false,
      visibleAudit:false,
      isRequire: true,
      activeKey:'1',
      title:'',
      form:this.$form.createForm(this),
      auditForm:this.$form.createForm(this),
      coverList:[],
      settlementhFormInfo:{},
      pauseDiyInfoList:[],
      salaryStandardInfo:{},
      salaryInfo:[],
      employData:{},
      poorBalanceInfoList:[],
      attaList: [],//流程进展明细
      settleType:0,
      salaryAccountOne:{},
      validatorRules:{
        remark: { rules: [{ required: true, message: '请输入退回理由(最多200字)!',max:200 }] },
      },
      url:{
        detailUrl:"salary/tchargerecord/openChargeRecordDetail",
        doIssuePause:"salary/tchargerecord/doIssuePause",
        getPrintCount:"/salary/tprintrecord/getPrintCount",
      },
      model:{}
    }
  },
  props: {
    bankOptions:{
      type:Array,
      required:true
    }
  },
  methods:{
    ...mapGetters(["nickname", "avatar","userInfo"]),
    async show(record){
      this.settlementhFormInfo = {}
      this.model = Object.assign({}, record)
      this.coverList = []
      const result = await httpAction('/admin/user/userDic','','GET');
      if(result.code == 200){
        this.employData = result.data
      }
      const res = await httpAction(this.url.detailUrl + "?chargeRecordId=" + record.id, {}, "POST");
      if(res.code == 200){
        this.settleType = this.model.type==5 ? 5 : (res.data.tsalaryStandard == null ? null : res.data.tsalaryStandard.type);
        // this.activeKey = '1'
        if(res.data.pauseDiyBankCover){
          res.data.pauseDiyBankCover.payType = 1
          this.coverList.push(res.data.pauseDiyBankCover)
        }
        if(res.data.pauseDiyCashCover){
          res.data.pauseDiyCashCover.payType = 0
          this.coverList.push(res.data.pauseDiyCashCover)
        }
        this.attaList = res.data.attaList.map(item=>{   //流程进展明细
          return {
            uid: item.id,
            name: item.attaName,
            status: 'done',
            url: item.attaUrl
          }
        })
        this.settlementhFormInfo = record.type == 5 ? res.data.engineerSettlementForm : res.data.settlementhForm;
        this.pauseDiyInfoList = record.type == 5 ? res.data.engineerSettlementhFormSubList : res.data.settlementhFormSubList
        this.poorBalanceInfoList = res.data.poorBalanceInfoList
        this.salaryInfo = []
        this.salaryInfo.push({'id':1,'settleDepartName':this.settlementhFormInfo.settleDepartName,'belongDeptId':this.settlementhFormInfo.settleDepartId
        ,'settleMonth':this.settlementhFormInfo.settleMonth,'settleDepartNo':this.settlementhFormInfo.settleDepartNo
        })
        this.salaryStandardInfo = this.model.type == 5 ? res.data.engineerSettlementForm : res.data.settlementhForm
        this.salaryStandardInfo.noBusinessType = 1 //有个结算表不需要业务类型显示
        this.visible = true
        this.changeTab(this.activeKey)
      }
      
    },
    close(){
      this.visible = false;
      this.isAudit = false;
    },
    handleCancel(){
      this.close()
    },
    changeAudit(e){
      this.isRequire = e.target.value === '0' ? false : true;
    },
    handleAudit(){
      this.visibleAudit = true;
      this.auditForm.resetFields();
    },
    handleAuditOk(){
      this.auditForm.validateFields((err,values) => {
        if(!err){
          const qs = require('qs');
          values.id = this.model.id;
          this.confirmLoading = true;
          httpAction(`/salary/tchargerecord/doAuditChargeRecord?${qs.stringify(values)}`,{},'POST').then((res) => {
            if(res.code === 200){
              this.$message.success(`操作成功!`);
              this.visibleAudit = false;
              this.handleCancel();
              this.$emit('ok');
            }else{
              this.$message.warning(res.msg);
            }
          }).finally(()=>{
            this.confirmLoading = false;
          })
        }
      })

    },
    handleAuditCancel(){
      this.visibleAudit = false;
      this.confirmLoading = false;
      this.isRequire = true;
    },
    // 发放失败
    handleFail(){
      this.form.resetFields()
      this.visibleBack = true
    },
    // 发放失败理由提交
    handleBackOk(){
      let that = this
      this.form.validateFields((err,values) => {
        if(!err){
          this.confirmLoading = true
          let url = this.url.doIssuePause + "?chargeRecordId=" + this.model.id + "&chargeStatus=" + 2 + "&remark=" + values.remark
          httpAction(url,{},'POST').then((res) => {
            this.confirmLoading = false
            if(res.code == 200){
              that.$message.success("退回成功")
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
      let that = this
      let url = this.url.doIssuePause + "?chargeRecordId=" + this.model.id + "&chargeStatus=" + 1 + "&remark=" + ""
      this.$confirm({
        title: '确认出账成功',
        content: '确认出账成功?',
        onOk() {
          httpAction(url,{},'POST').then((res) => {
            if(res.code == 200){
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
    handlePrint(){
      let that = this
      httpAction(this.url.getPrintCount,{'fromId':this.model.id,'fromType':3},"POST").then((res) => {
        if(res.code == 200){
          if(res.data >= 1){
            this.$confirm({
              title: '是否再次打印',
              content: '该表单已打印,需要继续吗',
              onOk() {
                let routeData = that.$router.resolve({
                  path: "/pdf/diysalarypause",
                  query: {id:that.model.id,count:res.data},
                });
                window.open(routeData.href, '_blank')
              },
              onCancel() {},
            });
          }else{
            let routeData = that.$router.resolve({
              path: "/pdf/diysalarypause",
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
      if(key == 2){
        this.$nextTick(()=>{
          this.$refs.customizeBillingPageModal.employData = this.employData
          this.$refs.customizeBillingPageModal.show()
        })
      }else if(key == 3){
        this.$nextTick(()=>{
          this.$refs.ProcessForm.show();
        })
      }else if(key == 1){
        const _this = this
        // console.log(this.settleType);
        if(this.model.type == 5){
          this.$nextTick(()=>{
            _this.$refs.engineSettleAccountModal.show();
          })
        }else if(this.settleType==0){
          this.$nextTick(()=>{
            _this.$refs.customizeSalarySettleModal.show();
          })
        }
      }
    },
    // 导出
    handleDownload(){
      let auditName = ''
      let createName = ''
      let revenueName = ''
      if(this.model.chargeUser){
        for(let c in this.employData){
          if(c == this.model.chargeUser){
            createName = this.employData[c]
          }
        }
      }
      let settleForm = this.settlementhFormInfo
      let remark1 = settleForm.remark ? settleForm.remark : '';
      
      // 结算单数据
      let settelData = [
        {'index':settleForm.settleMonth + '结算单','data':'','project':'','money':'','tax':'','account':''},
        {'index':'结算名称:','data':settleForm.settleDepartName,'project':'','money':'皖信盖章','tax':'皖信盖章:','account':''},
        {'index':'结算编码:','data':settleForm.settleDepartNo,'project':'','money':'','tax':'','account':''},
        {'index':'结算时间:','data':settleForm.settleMonth,'project':'','money':'','tax':'','account':''},
        {'index':'序号','data':'费用项目','project':'','money':'金额','tax':'税费','account':'开票额小计'},
      ];
      let num = 1;
      let rowNum = 0;
      if(this.settleType === 0){
        const concatArr = [
          {'index':1,'data':this.salaryStandardInfo.salaryMonth,'project':'应发工资','money':settleForm.salarySum,'tax':settleForm.salaryTax,'account':settleForm.salaryTicket}, 
          {'index':'','data':'','project':'实发工资(银付)','money':settleForm.cardPay,'tax':'','account':''},
          {'index':'','data':'','project':'实发工资(现金)','money':settleForm.moneyPay,'tax':'','account':''},
          {'index':'','data':'','project':'暂停发金额','money':settleForm.pausePay,'tax':'','account':''},
          {'index':2,'data':settleForm.socialMonth,'project':'应缴单位社保','money':settleForm.unitSocial,'tax':'','account':''}, 
          {'index':'','data':'','project':'代扣个人社保','money':settleForm.withholidingPersonSocial,'tax':'','account':''},
          {'index':'','data':'','project':'没工资员工单位社保','money':settleForm.noSalaryUnitSocial,'tax':settleForm.noSalaryUnitSocialTax,'account':settleForm.noSalaryUnitSocialTicket},
          {'index':'','data':'','project':'没工资员工个人社保','money':settleForm.noSalaryPersonSocial,'tax':settleForm.noSalaryPersonSocialTax,'account':settleForm.noSalaryPersonSocialTicket},
          {'index':3,'data':settleForm.fundMonth,'project':'应缴单位公积金','money':settleForm.unitFund,'tax':settleForm.unitFundTax,'account':settleForm.unitFundTicket}, 
          {'index':'','data':'','project':'代扣个人公积金','money':settleForm.withholidingPersonFund,'tax':'','account':''},
          {'index':'','data':'','project':'没工资员工单位公积金','money':settleForm.noSalaryUnitFund,'tax':settleForm.noSalaryUnitFundTax,'account':settleForm.noSalaryUnitFundTicket},
          {'index':'','data':'','project':'没工资员工个人公积金','money':settleForm.noSalaryPersonalFund,'tax':settleForm.noSalaryPersonalFundTax,'account':settleForm.noSalaryPersonalFundTicket},
          {'index':4,'data':'代扣当月个人税','project':'','money':settleForm.personalCurmonthTax,'tax':'','account':''},
        ];
        num = 5;
        if(settleForm.personalYearTax > 0){
          concatArr.push({'index':num,'data':'代扣个人年终奖税','project':'','money':settleForm.personalYearTax,'tax':'','account':''})
          num++
        }
        
        if(settleForm.withholidingUnitSocial != 0){
          concatArr.push({'index':num,'data':'代扣单位社保','project':'','money':settleForm.withholidingUnitSocial,'tax':settleForm.withholidingUnitSocialTax,'account':settleForm.withholidingUnitSocialTicket})
          num++
        }
        if(settleForm.withholidingUnitFund != 0){
          concatArr.push({'index':num,'data':'代扣单位公积金','project':'','money':settleForm.withholidingUnitFund,'tax':settleForm.withholidingUnitFundTax,'account':settleForm.withholidingUnitFundTicket})
          num++
        }
        if(settleForm.takingRisks != 0){
          concatArr.push({'index':num,'data':'商险金额','project':'','money':settleForm.takingRisks,'tax':settleForm.takingRisksTax,'account':settleForm.takingRisksTicket})
          num++
        }
        if(settleForm.riskFundDy != 0){
          concatArr.push({'index':num,'data':'风险抵押金','project':'','money':settleForm.riskFundDy,'tax':'','account':''})
          num++
        }

        if(settleForm.deductPersonal){
          concatArr.push({'index':num,'data':'代扣个人费用','project':'','money':settleForm.deductPersonal,'tax':'','account':''})
          num++
        }
        
        if(settleForm.deductUnit){
          concatArr.push({'index':num,'data':'代扣单位费用','project':'','money':settleForm.deductUnit,'tax':'','account':''})
          num++
        }

        if(settleForm.otherDbMoney){
          concatArr.push({'index':num,'data':'其他代办费2','project':'','money':settleForm.otherDbMoney,'tax':'','account':''})
          num++
        }
        if(settleForm.unitSupplement){
          concatArr.push({'index':num,'data':'单位待补足','project':'','money':settleForm.unitSupplement,'tax':settleForm.unitSupplementTax,'account':settleForm.unitSupplementTicket})
          num++
        }
        if(settleForm.persoanSupplement){
          concatArr.push({'index':num,'data':'个人待补足','project':'','money':settleForm.persoanSupplement,'tax':'','account':''})
          num++
        }
        if(settleForm.personalDebt){
          concatArr.push({'index':num,'data':'个人社保、公积金欠款','project':'','money':settleForm.personalDebt,'tax':'','account':''})
          num++
        }
        if(settleForm.personalOtherMoney){
          concatArr.push({'index':num,'data':'个人其他费用','project':'','money':settleForm.personalOtherMoney,'tax':'','account':''})
          num++
        }
        if(settleForm.prevPersoanSupplement){
          concatArr.push({'index':num,'data':'前次个人待补足','project':'','money':settleForm.prevPersoanSupplement,'tax':'','account':''})
          num++
        }
        if(settleForm.unitBack){
          concatArr.push({'index':num,'data':'单位返还','project':'','money':settleForm.unitBack,'tax':settleForm.unitBackTax,'account':settleForm.unitBackTicket})
          num++
        }
        if(settleForm.unitSocialCard){
          concatArr.push({'index':num,'data':'单位社保卡费','project':'','money':settleForm.unitSocialCard,'tax':'','account':''})
          num++
        }
        if(settleForm.exemptionPersionTax){
          concatArr.push({'index':num,'data':'免个税个人代扣','project':'','money':settleForm.exemptionPersionTax,'tax':'','account':''})
          num++
        }
        if(settleForm.enterpriseAnnuity){
          concatArr.push({'index':num,'data':'企业（职业）年金','project':'','money':settleForm.enterpriseAnnuity,'tax':'','account':''})
          num++
        }
        if(settleForm.onlyChild){
          concatArr.push({'index':num,'data':'独生子女费','project':'','money':settleForm.onlyChild,'tax':'','account':''})
          num++
        }
        settelData = settelData.concat(concatArr);
        rowNum = num-5;

      }else if(this.settleType === 5){
        const concatArr = [
          {'index':1,'data':this.salaryStandardInfo.salaryMonth,'project':'应发工资','money':settleForm.salarySum,'account':settleForm.salaryTicket}, 
          {'index':'','data':'','project':'实发工资(银付)','money':settleForm.cardPay,'account':''},
          {'index':'','data':'','project':'实发工资(现金)','money':settleForm.moneyPay,'account':''},
          {'index':'','data':'','project':'暂停发金额','money':settleForm.pausePay,'account':''},
          {'index':2,'data':settleForm.socialMonth,'project':'应缴单位社保','money':settleForm.unitSocial||'','account':''}, 
          {'index':'','data':'','project':'代扣个人社保','money':settleForm.withholidingPersonSocial||'','account':''},
          {'index':3,'data':settleForm.fundMonth,'project':'应缴单位公积金','money':settleForm.unitFund||'','account':settleForm.unitFundTicket},
          {'index':'','data':'','project':'应缴个人公积金','money':settleForm.pfundDeduction,'account':''}
        ];
        num = 4;
        this.pauseDiyInfoList.forEach(item=>{
          concatArr.push({'index':num,'data':getItemName(item.itemTypeName,item.subName),'project':'','money':item.money,'account':''})
          num++
        })
        if(settleForm.takingBalance != 0){
          concatArr.push({'index':num,'data':'商险差额','project':'','money':settleForm.takingBalance,'account':''})
          num++
        }
        concatArr.push({'index':num++,'data':'雇主责任险','project':'','money':settleForm.employerLiabilityInsurance,'account':''})
        concatArr.push({'index':num++,'data':'其它费用','project':'','money':settleForm.other,'account':''})
        concatArr.push({'index':num++,'data':'增值税金及附加','project':'','money':settleForm.valueDaddedTax,'account':settleForm.valueDaddedTaxTicket})
        concatArr.push({'index':num++,'data':'预缴企业所得税','project':'','money':settleForm.unitIncomeTax,'account':settleForm.unitIncomeTaxTicket})
        concatArr.push({'index':num++,'data':'预缴个人所得税	','project':'','money':settleForm.personIncomeTax,'account':settleForm.personIncomeTaxTicket})
        concatArr.push({'index':num++,'data':'人数','project':'','money':settleForm.personCount,'account':''})
        concatArr.push({'index':num++,'data':'管理费','project':'','money':settleForm.managementCost,'account':settleForm.managementCostTicket})
        concatArr.push({'index':num++,'data':'结算金额合计','project':'','money':'','account':settleForm.accountMoneySum})
        concatArr.push({'index':num++,'data':'开票金额合计','project':'','money':'','account':settleForm.ticketMoneySum})
        concatArr.push({'index':num++,'data':'备注','project':settleForm.remark,'money':'','account':''})
        settelData = settelData.concat(concatArr);
        rowNum = num-4;

      }else{
        settelData = settelData.concat([{'index':1,'data':'代扣当月个人税','project':'','money':settleForm.personalCurmonthTax,'tax':'','account':''}])
        num = 2;
      }
      if(this.settleType !== 5){  
        let projectData =[] //项目报销成本
        let withholdData = [] //自定义
        let peoWithholddata = [] //个人代扣
        let unitWithholddata = []  //单位代扣
        this.pauseDiyInfoList.reduce((acc,cur)=>{
            if(cur.itemTypeName=="项目报销"){
              projectData.push(cur)
            }else if(cur.itemType==5100){
              // 个人代扣
              peoWithholddata.push(cur)
            }else if(cur.itemType==5101){
              // 单位代扣
              unitWithholddata.push(cur)
            }else{
              withholdData.push(cur)
            }
          },[])

          for(let c of withholdData){
            settelData.push({'index':num,'data':getItemName(c.itemTypeName,c.subName,c.isPause),'project':'','project1':'','money':c.money,'money1':'','tax':c.tax,'account':c.ticket,'account1':''})
            num++
          }
          // 项目报销
          for( let c of projectData){
            settelData.push({'index':num,'data':c.subName,'project':'项目报销','project1':'','money':c.money,'money1':'','tax':c.tax,'account':c.ticket,'account1':''})
            num++
          }
          // 个人代扣
          for(let p of peoWithholddata){
            settelData.push({'index':num,'data':getItemName(null,p.subName,p.isPause),'project':'','project1':'','money':p.money,'money1':'','tax':'','account':'','account1':''})
            num++
          }
          // 单位代扣
          for(let p of unitWithholddata){
            settelData.push({'index':num,'data':getItemName(null,p.subName,p.isPause),'project':'','project1':'','money':p.money,'money1':'','tax':p.tax,'account':p.ticket,'account1':''})
            num++
          }
        // for(var c of this.pauseDiyInfoList){
        //   settelData.push({'index':num,'data':getItemName(c.itemTypeName,c.subName,c.isPause),'project':'','money':c.money,'tax':c.tax,'account':c.ticket})
        //   num++
        // }

        settleForm.ticketType = settleForm.ticketType ? settleForm.ticketType :''
        settleForm.deductionAmount = settleForm.deductionAmount ? settleForm.deductionAmount : ''
        settleForm.noTaxAmount = settleForm.noTaxAmount ? settleForm.noTaxAmount : ''
        settleForm.taxAmount = settleForm.taxAmount ? settleForm.taxAmount : ''
        settleForm.ticketSumAmount = settleForm.ticketSumAmount ? settleForm.ticketSumAmount : ''
        settelData.push({'index':num++,'data':'风险金','project':'','money':settleForm.riskFund,'tax':settleForm.riskFundTax,'account':settleForm.riskFundTicket})
        settelData.push({'index':num++,'data':'人数','project':'','money':settleForm.personNum,'tax':'','account':''})
        settelData.push({'index':num++,'data':'人次','project':'','money':settleForm.personTime,'tax':'','account':''})
        settelData.push({'index':num++,'data':'管理费','project':'','money':settleForm.managementMoney,'tax':settleForm.managementMoneyTax,'account':settleForm.managementMoneyTicket})
        settelData.push({'index':num++,'data':'管理费2','project':'','money':settleForm.managementMoneyTwo,'tax':settleForm.managementMoneyTwoTax,'account':settleForm.managementMoneyTwoTicket})
        settelData.push({'index':num++,'data':'结算金额合计','project':'','money':'','tax':settleForm.countTax,'account':settleForm.accountMoneySum})
        
        settelData.push({'index':num++,'data':'开票金额合计','project':'','money':'','tax':'','account':settleForm.ticketMoneySum})
        settelData.push({'index':num++,'data':'上次差余额','project':'','money':'','tax':'','account':settleForm.prevPoorBalance})
        settelData.push({'index':num++,'data':'本次差余额','project':'','money':'','tax':'','account':settleForm.curPoorBalance})

        settelData.push({'index':num++,'data':'备注:' + remark1,'project':'','money':'','tax':'','account':''})
        settelData.push({'index':num++,'data':'发票类型','project':'扣除金额','money':'不含税金额','tax':'税额','account':'发票合计金额'})
        settelData.push({'index':num++,'data':settleForm.ticketType,'project':settleForm.deductionAmount,'money':settleForm.noTaxAmount,'tax':settleForm.taxAmount,'account':settleForm.ticketSumAmount})
      }
      
      var excelDatas = [
        {
          tHeader: this.settleType !== 5 ? ["序号",null,"费用项目", "金额", "增值税", "开票额小计"] : ["序号",null,"费用项目", "金额", "开票额小计"],
          filterVal: this.settleType !== 5 ? ['index','data',"project", "money", "tax", "account"] : ['index','data',"project", "money", "account"],
          tableDatas: settelData,
          sheetName: "结算单"
        },
      ]
      for(let c in this.coverList){
        this.coverList[c] = this.coverList[c] ? this.coverList[c] : ' '
      }
      for(var d of this.coverList){
        let organName = d.organName ? d.organName : ''
        let bankNo = d.bankNo ? d.bankNo : ''
        //let bankName = d.bankName ? d.bankName : ''
        let bankName = filterDictText(this.bankOptions, d.bankName)
        if(bankName == '-' && d.bankName){
          bankName = d.bankName
        }
        d.createDate = d.createDate ?  moment(d.createDate).format("YYYY/MM/DD") : ""
        let lastTwo = d.itemName.substr(d.itemName.length - 2,2)
        if(lastTwo == "其他"){
          d.itemName = d.itemName.substr(0,d.itemName.length - 2) + "工资"
        }
        let coverData = []
        let remark = d.remark ? d.remark : ''
        if(d.payType == 1){
          coverData = [
              {'company':d.title + '','project':'','payType':'','money':'','no':`附件${this.coverList.length}张`},
              {'company':"银行转账审批单",'project':'','payType':'','money':'','no':''},
              {'company':"Z",'project':d.createDate,'payType':'部门编码','money':d.settleNo,'no':''},
              {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
              {'company':d.unitName,'project':d.itemName,'payType':'银行转账','money':'¥' + d.money,'no':''},
              {'company':d.settleName,'project':'','payType':'','money':'','no':''},
              {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
              {'company':"备注:" ,'project':remark,'payType':'','money':'','no':''},
              {'company':"收款单位名称:" + organName + "        账号:" + bankNo + "        开户行:" + bankName,'project':'','payType':'','money':'','no':''},
              {'company':"公司领导：          财务负责人:" + revenueName + '            网银审核授权人：          网银转账提交人：' + this.nickname() + '          数据审核人：' + auditName + '       制表人:' + createName,'project':'' ,'payType': '','money':'','no':''},
            ]
          }else{
            coverData = [
              {'company':d.title,'project':'','payType':'','money':'','no':`附件${this.coverList.length}张`},
              {'company':"现金付款审批单",'project':'','payType':'','money':'','no':''},
              {'company':"Z",'project':d.createDate,'payType':'部门编码','money':d.settleNo,'no':''},
              {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':''},
              {'company':d.unitName ,'project':d.itemName,'payType':'现金转账','money':'¥' + d.money,'no':''},
              {'company':d.settleName,'project':'','payType':'','money':'','no':''},
              {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
              {'company':"备注: ",'project':remark,'payType':'','money':'','no':''},
              {'company':"",'project':'','payType':'','money':'','no':''},
              {'company':"公司领导：          财务负责人：" + revenueName + '          出纳会计: ' + '          数据审核人：' + auditName + '          制表人: ' + createName,'project':'','payType':'','money':'','no':''},
            ]
          }
        
          excelDatas.push({
            tHeader: ["序号", "名字", "描述", "金钱", "地位"],
            filterVal: ["company", "project", "payType", "money",'no'],
            tableDatas:coverData,
            sheetName:'转账封面'
          })
      }
      let excelName = settleForm.settleMonth + settleForm.settleDepartName + "自定义暂停发" + settleForm.settleDepartNo + '(' + settleForm.accountMoneySum + ')'
      this.json2excel(excelDatas, excelName, true, "xlsx",this.settleType,this.pauseDiyInfoList.length,rowNum,settleForm.takingBalance)
    },
    json2excel(tableJson, filenames, autowidth, bookTypes,settleType,listLength,rowNum,takingBalance){
      var that = this
      //这个是引用插件
      import("@/vendor/ExportDiyPause").then(excel => {
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
          settleType: settleType,
          listLength: listLength,
          rowNum: rowNum,
          takingBalance: takingBalance,
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j] || ''
      }))
    }
  }
}
</script>
