<template>
  <a-modal
    title="普通薪资暂停发放批量出账"
    :width="1200"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    :visible="visible"
    :maskClosable="false"
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
      <a-button
        type="primary"
        @click="handlePrint"
      >表单打印</a-button>
      <a-button
        type="primary"
        :loading="downLoading"
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
              :scroll="{ x: 2160 }"
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
            tab="结算单"
            key="2"
            :forceRender="true"
          >
            <billing-salary-settle-batch
              ref="billingsalarysettlebatch"
              :settlementhFormList="settlementhFormList"
            >
            </billing-salary-settle-batch>
          </a-tab-pane>
          <a-tab-pane
            tab="封面"
            key="3"
            :forceRender="true"
          >
            <billing-salary-page-batch ref="billingsalarypagebatch"></billing-salary-page-batch>
            <!-- <audit-page-modal ref="auditPageModal"></audit-page-modal> -->
          </a-tab-pane>
        </a-tabs>

        <!--- 发放出账详情 -->
        <a-modal
          title="发放出账详情"
          :width="600"
          placement="right"
          :closable="true"
          @cancel="handleDetailCancel"
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
import BillingSalarySettleBatch from "./BillingSalarySettleBatch"
import BillingSalaryPageBatch from "./BillingSalaryPageBatch"
import { httpAction } from '@/api/manage'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { getItemName } from '@/utils/common'
const DetailListItem = DetailList.Item
export default {
  name: 'BillingSalaryBatchModal',
  components: {
    DetailListItem,
    DetailList,
    BillingSalarySettleBatch,
    BillingSalaryPageBatch
  },
  data(){
    return{
      visible:false,
      spinning:false,
      loading:false,
      detailVisible:false,
      submitLoading:false,
      downLoading:false,
      visibleBack:false,
      confirmLoading:false,
      activeKey:'1',
      dataSourceList:[],
      settlementhFormList:[],
      saiList:[],
      validatorRules:{
        remark: { rules: [{  required: true, message: '请输入退回理由(最多200字)!',max:200 }] },
      },
      coverList:[],
      employData:{},
      form:this.$form.createForm(this),
      chargeRecordIds:'',
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      settleDepartNo:'',
      settleDate:'',
      columns:[
        {
          title: '姓名',
          dataIndex: 'empName',
          width: 120,
          fixed: 'left',
          key: 'empName',
          align: 'center',
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
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 120,
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      url:{
        detailUrl:"salary/tchargerecord/openBatchChargeRecordDetail",
        doIssuePause:"salary/tchargerecord/doIssuePause",
        getPrintCount:"/salary/tprintrecord/getPrintCount",
        doBatchIssuePause:"/salary/tchargerecord/doBatchIssuePause"
      },
    }
  },
  methods:{
    ...mapGetters(["nickname", "avatar","userInfo"]),
    show(settleDepartNo,settleDate){
      this.loading = true
      this.settleDepartNo = settleDepartNo
      this.settelDate = settleDate.format("YYYYMM")
      this.activeKey = '1'
      this.visible = true
      let url = this.url.detailUrl + '?settleDepartNo=' + settleDepartNo + '&settleDate=' + this.settelDate + "&type=" + 0
      httpAction(url,{},'POST').then((res) => {
        this.loading = false
        if(res.code == 200){
          this.chargeRecordIds = res.data.chargeRecordIds
          this.dataSourceList = res.data.salaryAccountList
          //结算单
          this.settlementhFormList = res.data.settlementhFormList
          //封面数据组装
          this.handleData(res.data,'allBankCover',this.coverList,1,false)
          // if(res.data.allBankCover){
          //   res.data.allBankCover.payType = 1
          //   this.coverList.push(res.data.allBankCover)
          // }
          this.handleData(res.data,'allCashCover',this.coverList,0,false)
          // if(res.data.allCashCover){
          //   res.data.allCashCover.payType = 0
          //   this.coverList.push(res.data.allCashCover)
          // }
          this.handleData(res.data,'pauseBankCoverList',this.coverList,1,true)
          // if(res.data.pauseBankCoverList.length){
          //   for(let c in res.data.pauseBankCoverList){
          //     res.data.pauseBankCoverList[c].payType = 1
          //     this.coverList.push(res.data.pauseBankCoverList[c])
          //   }
          // }
          this.handleData(res.data,'pauseBankCoverTwoList',this.coverList,1,true)
          // if(res.data.pauseBankCoverTwoList.length){
          //   for(let c in res.data.pauseBankCoverTwoList){
          //     res.data.pauseBankCoverTwoList[c].payType = 1
          //     this.coverList.push(res.data.pauseBankCoverTwoList[c])
          //   }
          // }
          this.handleData(res.data,'pauseCashCoverList',this.coverList,0,true)
          // if(res.data.pauseCashCoverList.length){
          //   for(let c in res.data.pauseCashCoverList){
          //     res.data.pauseCashCoverList[c].payType = 0
          //     this.coverList.push(res.data.pauseCashCoverList[c])
          //   }
          // }
          this.handleData(res.data,'pauseCashCoverTwoList',this.coverList,0,true)
          // if(res.data.pauseCashCoverTwoList.length){
          //   for(let c of res.data.pauseCashCoverTwoList){
          //     res.data.pauseCashCoverTwoList[c].payType = 0
          //     this.coverList.push(res.data.pauseCashCoverTwoList[c])
          //   }
          // }
        }
      })
    },
    handleCancel(){
      this.close()
    },
    handleBackCancel(){
      this.visibleBack = false
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
    handleDetailCancel(){
      this.detailVisible = false
    },
    close(){
      this.detailVisible = false
      this.saiList = []
      this.dataSourceList = []
      this.settlementhFormList = []
      this.coverList = []
      this.visible = false
    },
    changeTab(key){
      this.activeKey = key
      // console.log(key)
      // if(key == 2){
      //   this.$refs.billingsalarysettlebatch.show()
      // }
      if(key == 3){
        this.$refs.billingsalarypagebatch.employData = this.employData
        this.$refs.billingsalarypagebatch.show(this.coverList)
      }
    },
    // 打印        
    handlePrint(){
      let that = this
      let idArr = this.chargeRecordIds.split(',')
      httpAction(this.url.getPrintCount,{'fromId':idArr[0],'fromType':2},"POST").then((res) => {
        if(res.code == 200){
          if(res.data >= 1){
            this.$confirm({
              title: '是否再次打印',
              content: '该表单已打印,需要继续吗',
              onOk() {
                let routeData = that.$router.resolve({
                  path: "/pdf/billingpausebatch",
                  query: {id:idArr[0],count:res.data,settleDepartNo:that.settleDepartNo,settelDate:that.settelDate},
                });
                window.open(routeData.href, '_blank')
              },
              onCancel() {},
            });
          }else{
            let routeData = that.$router.resolve({
              path: "/pdf/billingpausebatch",
              query: {id:idArr[0],count:res.data,settleDepartNo:that.settleDepartNo,settelDate:that.settelDate},
            });
            window.open(routeData.href, '_blank')
          }
        }
      })
      
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
          let url = this.url.doBatchIssuePause + "?chargeRecordIds=" + this.chargeRecordIds + "&chargeStatus=" + 2 + "&remark=" + values.remark
          httpAction(url,{},'POST').then((res) => {
            this.confirmLoading = false
            if(res.code == 200){
              that.$message.success('退回成功')
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
    // 出账
    handleOutSubmit(){
      let that = this
      let url = this.url.doBatchIssuePause + "?chargeRecordIds=" + this.chargeRecordIds + "&chargeStatus=" + 1 + "&remark=" + ""
      this.$confirm({
        title: '确认出账成功',
        content: '确认出账成功?',
        onOk() {
          httpAction(url,{},'POST').then((res) => {
            if(res.code == 200){
              that.$message.success(res.msg)
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
    // 导出
    handleDownload(){
      this.downLoading = true
      var excelDatas = [
        {
          tHeader: ["工资月份","结算月份","结算主体","姓名","银行卡号","开户行","工资发放方式","身份证号","社保扣缴月份",
          "公积金扣缴月份","是否薪资扣税","社保优先级","公积金优先级","年终奖扣税方案","是否扣除社保","是否扣除公积金"], // 表一的数据字段
          filterVal: ["salaryDate", "settlementMonth", "settleDepartName", "empName", "bankNo", "bankName", "salaryStyle",
          "empIdcard","deduSocialMonth","deduProvidentMonth","salaryTaxFlag","socialPriority","fundPriority","annualBonusType",
          "isDeductSocial","isDeductFund"], // sheet表一头部
          tableDatas: this.dataSourceList, // 表一的整体json数据
          sheetName: "报账表"// 表一的sheet名字
        },
      ]
      let j = 1
      for(let c of this.settlementhFormList){
        let settleForm = c.settlementhForm
        let settelData = [
          {'index':settleForm.settleMonth + '结算单','data':'','project':'','money':'','tax':'','account':''},
          {'index':'结算名称:','data':settleForm.settleDepartName,'project':'','money':'','tax':'皖信盖章:','account':''},
          {'index':'结算编码:','data':settleForm.settleDepartNo,'project':'','money':'','tax':'','account':''},
          {'index':'结算时间:','data':settleForm.settleMonth,'project':'','money':'','tax':'','account':''},
          {'index':'序号','data':'费用项目','project':'','money':'金额','tax':'税费','account':'开票额小计'},
          {'index':1,'data':settleForm.salaryMonth,'project':'应发工资','money':settleForm.salarySum,'tax':settleForm.salaryTax,'account':settleForm.salaryTicket},
          {'index':'','data':'','project':'实发工资(银付)','money':settleForm.cardPay,'tax':'','account':''},
          {'index':'','data':'','project':'实发工资(现金)','money':settleForm.moneyPay,'tax':'','account':''},
          {'index':'','data':'','project':'暂停发金额','money':settleForm.pausePay,'tax':'','account':''},
          {'index':2,'data':'','project':'应缴单位社保','money':settleForm.unitSocial,'tax':settleForm.unitSocialTax,'account':settleForm.unitSocialTicket},
          {'index':'','data':'','project':'应缴个人社保','money':settleForm.personalSocial,'tax':'','account':''},
          {'index':'','data':'','project':'没工资员工单位社保','money':settleForm.noSalaryUnitSocial,'tax':settleForm.noSalaryUnitSocialTax,'account':settleForm.noSalaryUnitSocialTicket},
          {'index':'','data':'','project':'没工资员工个人社保','money':settleForm.noSalaryPersonSocial,'tax':settleForm.noSalaryPersonSocialTax,'account':settleForm.noSalaryPersonSocialTicket},
          {'index':3,'data':'','project':'应缴单位公积金','money':settleForm.unitFund,'tax':settleForm.unitFundTax,'account':settleForm.unitFundTicket},
          {'index':'','data':'','project':'应缴个人公积金','money':settleForm.personalFund,'tax':'','account':''},
          {'index':'','data':'','project':'没工资员工单位公积金','money':settleForm.noSalaryUnitFund,'tax':settleForm.noSalaryUnitFundTax,'account':settleForm.noSalaryUnitFundTicket},
          {'index':'','data':'','project':'没工资员工个人公积金','money':settleForm.noSalaryPersonalFund,'tax':settleForm.noSalaryPersonalFundTax,'account':settleForm.noSalaryPersonalFundTicket},
          {'index':4,'data':'代扣当月个人税','project':'','money':settleForm.personalCurmonthTax,'tax':'','account':''},
        ];
        let num = 5
        let isPersonYear = 0
        let settlementhFormSubListLength = c.settlementhFormSubList.length
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
          settelData.push({'index':num,'data':'代扣单位费用','project':'','money':settleForm.deductUnit,'tax':settleForm.deductUnitTax,'account':settleForm.deductUnitTicket})
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

        for(let d of c.settlementhFormSubList){
          settelData.push({'index':num,'data':getItemName(d.itemTypeName,d.subName),'project':'','money':d.money,'tax':d.tax,'account':d.ticket})
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
        settelData.push({'index':num++,'data':'发票类型','project':'扣除金额','money':'不含税金额','tax':'税额','account':'发票合计金额'})
        settelData.push({'index':num++,'data':settleForm.ticketType,'project':settleForm.deductionAmount,'money':settleForm.noTaxAmount,'tax':settleForm.taxAmount,'account':settleForm.ticketSumAmount})
        // settelData.push({'index':num++,'data':'','project':'','money':'1814','tax':'123.6','account':'1928.2'})
        settelData.push({'index':'审核人:','data':'','project':'','money':'','tax':'制表人:','account':''})
        settelData.push({'index':'','data':'','project':'','money':'','tax':'','account':''})
        settelData.push({'index':'','data':'','project':'','money':'','tax':'','account':''})

        settelData.push({'index':'月份','data':'姓名','project':'项目','money':'金额','tax':'原因','account':''})
        for(let d of c.poorBalanceInfoList){
          settelData.push({'index':d.month,'data':d.name,'project':d.project,'money':d.money,'tax':d.cause,'account':''})
        }
        settelData.push({'index':settlementhFormSubListLength,'data':c.poorBalanceInfoList.length,'project':isPersonYear,'money':'','tax':'','account':''})
        excelDatas.push({
          tHeader: ["序号",null,"费用项目", "金额", "增值税", "开票额小计"],
          filterVal: ['index','data',"project", "money", "tax", "account"],
          tableDatas: settelData,
          sheetName: "结算单" + j
        })
        j++
      }
      let i = 1;
      for(var d of this.coverList){
        let createName = ''
        for(let c in this.employData){
          if(c == d.createUser){
            createName = this.employData[c]
          }
        }
        let reportDate = d.createDate = moment().format("YYYY/MM/DD")
        if(d.payType == 1){
          d.unitName = d.unitName ? d.unitName : ''
          d.settleName = d.settleName ? d.settleName : ''
          d.itemName = d.itemName ? d.itemName : ''
          d.settleNo = d.settleNo ? d.settleNo : ''
          d.title = d.title ? d.title : ''
          d.remark = d.remark ? d.remark : ''
          
          let lastTwo = d.itemName.substr(d.itemName.length - 2,2)
          if(lastTwo == "其他"){
            d.itemName = d.itemName.substr(0,d.itemName.length - 2) + "工资"
          }
          let coverData = [
            {'company':d.title,'project':'','payType':'','money':'','no':`附件${this.coverList.length}张`},
            {'company':"银行转账审批单",'project':'','payType':'','money':'','no':''},
            {'company':"Z",'project':reportDate,'payType':'部门编码','money':d.settleNo,'no':''},
            {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
            {'company':d.unitName,'project':d.itemName,'payType':'银行转账','money':'¥' + d.money,'no':''},
            {'company':d.settleName,'project':'','payType':'','money':'','no':''},
            {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
             {'company':"备注:",'project':'','payType':'','money':'','no':''},
            {'company':"收款单位名称: " + d.organName + "        账号: " + d.bankNo + "        开户行: " + d.bankName,'project':'','payType':'','money':'','no':''},
            {'company':"公司领导：         财务负责人:" + this.nickname() + '         网银审核授权人：         网银转账提交人：' + this.nickname() + '         数据审核人：' + '-' + '         制表人:' + createName,'project':'' ,'payType': '','money':'','no':''},
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
            {'company':"Z",'project':reportDate,'payType':'部门编码','money':d.settleNo,'no':''},
            {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
            {'company':d.unitName,'project':d.itemName,'payType':'现金转账','money':'¥' + d.money,'no':''},
            {'company':d.settleName,'project':'','payType':'','money':'','no':''},
            {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
            {'company':"备注:",'project':'','payType':'','money':'','no':''},
            {'company':"公司领导：         财务负责人：" + this.nickname() + '         出纳会计: ' + '         数据审核人：-          制表人: ' + createName,'project':'','payType':'','money':'','no':''},
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
      let settleLength = this.settlementhFormList.length
      let coverLength = this.coverList.length
      let excelName = this.dataSourceList[0].settlementMonth + this.dataSourceList[0].settleDepartName + "普通薪资批量暂停发" + this.dataSourceList[0].settleDepartNo 
      this.json2excel(excelDatas, excelName, true, "xlsx",settleLength,coverLength)
      this.downLoading = false
    },
    json2excel(tableJson, filenames, autowidth, bookTypes,settleLength,coverLength){
      var that = this
      //这个是引用插件
      import("@/vendor/ExportBillingBatchPause").then(excel => {
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
          settleLength:settleLength,
          coverLength:coverLength
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
    },
    handleData(data,attr,arr,type,flag){
      if(flag){
        if(data[attr].length){
          for(const c in data[attr]){
            data[attr][c].payType = type
            arr.push(data[attr][c])
          }
        }
      }else{
        if(data[attr]){
          data[attr].payType = type
          arr.push(data[attr])
        }
      }
    }
  }
}
</script>
