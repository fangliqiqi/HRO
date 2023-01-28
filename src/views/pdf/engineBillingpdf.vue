<template>
  <div class="printCont">
    <div
      v-for="(pane,index) in coverList"
      :key="index"
    >
      <div :style="styleBox">
        <!-- 封面 -->
        <div
          class="cover"
          :style="styleCover"
        >
          <p style="text-align:center;font-size:18px;font-weight:bold">{{ pane.invoiceTitle }}</p>
          <p
            style="text-align:center;font-size:25px;font-weight:bold"
            v-if="pane.payType == 1"
          >银行转账审批单</p>
          <p
            style="text-align:center;font-size:25px;font-weight:bold"
            v-if="pane.payType == 0"
          >现金付款审批单</p>
          <p style="text-align:center;line-height:0"> <span style="margin-left: 306px;">{{ moment().format("YYYY-MM-DD HH:mm:ss") }}</span> <span style="margin-left: 20px;">结算主体编码 {{ pane.settleNo }}</span> </p>
          <table class="table1">
            <tr class="tr1">
              <td
                class="td1"
                colspan="2"
              >{{ sign }} 工程薪资 - {{ isBackedType[salaryStandardInfo.isBacked] }}</td>
              <td
                class="td1"
                colspan="2"
              >{{ moment().format("YYYY-MM-DD HH:mm:ss") }}</td>
              <td class="td1">结算主体编码</td>
              <td class="td1">{{ pane.settleNo }}</td>
              <td
                rowspan="5"
                style="border:0;width:5px"
              >附件 {{ coverList.length }} 张</td>
            </tr>
            <tr class="tr1">
              <td
                class="td1"
                colspan="2"
              >
                <p class="font18">单位</p>
                <p>{{ pane.unitName }}</p>
                <p>{{ pane.settleName }}</p>
              </td>
              <td
                class="td1"
                colspan="2"
              >
                <p class="font18">项目</p>
                <p>{{ pane.itemName }}</p>
              </td>
              <td class="td1">
                <p class="font18">付款方式</p>
                <p>{{ pane.payType == 1 ? '银行转账' : '现金转账' }}</p>
              </td>
              <td class="td1">
                <p class="font18">金额</p>
                <p>¥{{ pane.money }}</p>
              </td>
            </tr>
            <tr class="tr1">
              <td
                class="td1"
                colspan="2"
              >合计人民币:</td>
              <td
                style="font-weight:bolder;text-align:left"
                class="td1"
                colspan="3"
              >{{ pane.chmoney }}</td>
              <td class="td1">¥{{ pane.money }}</td>
            </tr>
            <tr v-if="pane.payType == 1">
              <td class="td1">收款单位名称:</td>
              <td class="td1">
                {{ pane.receiptUnitName }}
              </td>
              <td class="td1">账户:</td>
              <td class="td1">
                {{ pane.bankNo }}
              </td>
              <td class="td1">开户行:</td>
              <td class="td1">
                {{ pane.bankName }}
              </td>
            </tr>
            <tr>
              <td class="td1">备注:</td>
              <td
                class="td1"
                colspan="5"
              >
                {{ pane.remark }}
              </td>
            </tr>
          </table>
          <p v-if="pane.payType == 1">
            <span>公司领导:</span>
            <span style="margin-left:100px">财务负责人: </span>
            <span style="margin-left:100px">网银审核授权人:</span>
            <span style="margin-left:100px">网银转账提交人: {{ bankUpName }}</span>
            <span style="margin-left:50px">数据审核: {{ auditName }}</span>
            <span style="margin-left:50px">制表人: {{ createName }}</span>
          </p>
          <p v-if="pane.payType == 0">
            <span>公司领导:</span>
            <span style="margin-left:100px">财务负责人:</span>
            <span style="margin-left:100px">出纳会计:</span>
            <span style="margin-left:50px">数据审核: {{ auditName }}</span>
            <span style="margin-left:50px">制表人: {{ createName }}</span>
          </p>
          <p
            v-for="(receive,key) in receiveData"
            :key="key"
            v-if="key<10"
            style="text-align:center;margin-bottom: 0px;"
          >
            {{ receive.incomeBelong }}-{{ receive.departName }}&nbsp; 已到账, &nbsp;到账金额 : {{ receive.matchingAmount }}&nbsp;&nbsp; 到账时间: {{ receive.reciveDate }} &nbsp; 备注: {{ receive.serverRemark }}
          </p>
          <p style="text-align:center;padding-top:15px">本次打印为第&nbsp; {{ count }} &nbsp;次打印,请注意避免重复! &nbsp;打印时间: {{ printData.printDate }} &nbsp; 打印柜员: {{ printData.printUser }} &nbsp; 验证码: {{ printData.uniqueCode }}</p>

        </div>
      </div>
      <div style="page-break-after:always"></div>
      <div id="newNode"></div>

    </div>

    <a-row>
      <div class="main-article">
        <div class="node-article-content">
          <p style="text-align:center;color:red">{{ salaryStandardInfo.settlementMonth }}客户结算单</p>
          <table
            class="table1"
            style="background:yellow;border:0;"
          >
            <tr>
              <td
                class="font18"
                style="background:yellow;border:0"
              >结算主体:</td>
              <td colspan="2">{{ settlementhFormInfo.settleDepartName }}</td>
              <td class="font18">皖信盖章:</td>
              <td></td>
            </tr>
            <tr>
              <td class="font18">结算编码:</td>
              <td colspan="2">{{ settlementhFormInfo.settleDepartNo }}</td>
              <td></td>
              <td></td>
            </tr>
            <tr class="tr1">
              <td
                class="font18"
                style="width:20%"
              >结算时间:</td>
              <td style="width:20%">{{ salaryStandardInfo.settlementMonth }}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>
          <table
            class="table1"
          >
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >费用项目</td>
              <td class="tit td1">金额</td>
              <td class="tit td1">开票额小计</td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                rowspan="4"
              >{{ salaryStandardInfo.salaryMonth }}</td>
              <td class="tit td1">应发工资</td>
              <td class="td1">{{ settlementhFormInfo.salarySum }}</td>
              <td class="td1">{{ settlementhFormInfo.salaryTicket }}</td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">实发工资(银付)</td>
              <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">实发工资(现金)</td>
              <td class="td1">{{ settlementhFormInfo.moneyPay }}</td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">暂停发金额</td>
              <td class="td1">{{ settlementhFormInfo.pausePay }}</td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                rowspan="2"
              >{{ settleDeail.socialMonth }}</td>
              <td class="tit td1">应缴单位社保</td>
              <td class="td1">{{ settleDeail.usocialDeduction }}</td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">应缴个人社保</td>
              <td class="td1">{{ settleDeail.psocialDeduction }}</td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                rowspan="2"
              >{{ settleDeail.fundMonth }}</td>
              <td class="tit td1">应缴单位公积金</td>
              <td class="td1">{{ settleDeail.ufundDeduction }}</td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">应缴个人公积金</td>
              <td class="td1">{{ settleDeail.pfundDeduction }}</td>
              <td class="td1"></td>
            </tr>
            <tr
              v-for="(item,index) in pauseDiyInfoList"
              :key="index"
            >
              <td
                class="tit td1"
                colspan="2"
              >{{ getItemName(item.itemTypeName,item.subName) }}{{ pauseTxt[item.isPause]||'' }}
              </td>
              <td class="td1">{{ item.money }}</td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >雇主责任险</td>
              <td class="td1">{{ settlementhFormInfo.employerLiabilityInsurance }}</td>
              <td class="td1"></td>
            </tr>
            <tr
              class="tr1"
              v-if="settlementhFormInfo.takingBalance != 0"
            >
              <td
                class="tit td1"
                colspan="2"
              >商险差余额</td>
              <td class="td1">{{ settlementhFormInfo.takingBalance }}</td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >其它费用</td>
              <td class="td1">{{ settlementhFormInfo.other }}</td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >增值税金及附加</td>
              <td class="td1">{{ settlementhFormInfo.valueDaddedTax }}</td>
              <td class="td1">{{ settlementhFormInfo.valueDaddedTaxTicket }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >预缴企业所得税</td>
              <td class="td1">{{ settlementhFormInfo.unitIncomeTax }}</td>
              <td class="td1">{{ settlementhFormInfo.unitIncomeTaxTicket }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >预缴个人所得税</td>
              <td class="td1">{{ settlementhFormInfo.personIncomeTax }}</td>
              <td class="td1">{{ settlementhFormInfo.personIncomeTaxTicket }}</td>
            </tr>

            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >人数</td>
              <td class="td1">{{ settlementhFormInfo.personCount }}</td>
              <td class="td1"></td>
            </tr>

            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >管理费</td>
              <td class="td1">{{ settlementhFormInfo.managementCost }}</td>
              <td class="td1">{{ settlementhFormInfo.managementCostTicket }}</td>
            </tr>

            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >结算金额合计</td>
              <td class="td1"></td>
              <td class="td1">{{ settleDeail.accountMoneySum }}</td>
            </tr>

            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >开票金额合计</td>
              <td class="td1"></td>
              <td class="td1">{{ settleDeail.ticketMoneySum }}</td>
            </tr>

            <tr class="tr1">
              <td class="tit td1">备注</td>
              <td
                class="td1"
                colspan="3"
              >{{ settlementhFormInfo.remark }}</td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">备注2</td>
              <td
                class="td1"
                colspan="3"
                v-html="removeBlank(salaryStandardInfo.excelRemark)"
              ></td>
            </tr>
          </table>
          <table
            class="table1"
            style="margin-top:20px;"
          >
            <tr class="tr1">
              <td class="tit td1">开票日期</td>
              <td class="tit td1">开票金额</td>
              <td class="tit td1">本次结算金额</td>
              <td class="tit td1">本次结算到账金额</td>
            </tr>
            <tr
              class="tr1"
              v-for="(item,index) in openData"
              :key="index"
            >
              <td class="td1">{{ (item.ticketTime || '').substring(0,10) }}</td>
              <td class="td1">{{ item.money }}</td>
              <td class="td1">{{ item.currentSettleMoney }}</td>
              <td class="td1">{{ item.currentSettleComeMoney }}</td>
            </tr>
          </table>
          <div
            style="page-break-after:always"
            v-if="isBank == true"
          ></div>
          <!-- 银行数据列表 -->
          <div
            v-if="isBank == true"
            style="margin-top:30px;"
          >
            <p style="text-align:center;font-weight:bold">银行数据列表</p>
            <table class="table1">
              <tr class="tr1">
                <td class="tit td1">姓名</td>
                <td class="tit td1">身份证号</td>
                <td class="tit td1">银行账号</td>
                <td class="tit td1">实发工资合计</td>
                <td class="tit td1">银行</td>
                <td class="tit td1">支行</td>
              </tr>
              <tr
                class="tr1"
                v-for="(item,index) in salaryBankVoList"
                :key="index"
              >
                <td class="td1">{{ item.name }}</td>
                <td class="td1">{{ item.idNumber }}</td>
                <td class="td1">{{ item.bankNo }}</td>
                <td class="td1">{{ item.money }}</td>
                <td class="td1">{{ item.bankName }}</td>
                <td class="td1">{{ item.subBranch }}</td>
              </tr>
              <tr>
                <td class="td1">合计</td>
                <td
                  class="td1"
                  colspan="5"
                >{{ bankMoney.toFixed(2) }}</td>
              </tr>
            </table>
          </div>
          <div
            style="page-break-after:always"
            v-if="isCash == true"
          >
            <p style="text-align:center;font-weight:bold">现金数据列表</p>
          </div>

          <!-- 现金数据列表 -->
          <table
            class="table1"
            style="margin-top:30px;"
            v-if="isCash == true"
          >
            <tr class="tr1">
              <td class="tit td1">姓名</td>
              <td class="tit td1">身份证号</td>
              <td class="tit td1">实发工资合计</td>
              <td class="tit td1">用途</td>
            </tr>
            <tr
              class="tr1"
              v-for="(item,index) in salaryCashVoList"
              :key="index"
            >
              <td class="td1">{{ item.name }}</td>
              <td class="td1">{{ item.idNumber }}</td>
              <td class="td1">{{ item.money }}</td>
              <td class="td1">{{ item.useRemark }}</td>
            </tr>
            <tr>
              <td class="td1">合计</td>
              <td
                class="td1"
                colspan="3"
              >{{ cashMoney.toFixed(2) }}</td>
            </tr>
          </table>

          <div
            v-for="(model,index) in advanceData"
            :key="index"
            class="ant-card-body"
          >
            <div style="page-break-after:always"></div>
            <a-card
              :bordered="true"
              class="ant-card-wider-padding"
              id="staffCard"
            >
              <span id="staffEvectionTitle">垫付申请单</span>
              <table
                border="1px"
                id="taffEvectionTable"
              >
                <thead>
                  <tr>
                    <td class="theadTr">客户单位</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ model.advancePayment.customerName }}</td>
                    <td class="theadTr">客户合同</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ model.advancePayment.contractName }}</td>
                  </tr>
                  <tr>
                    <td class="theadTr">结算主体</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ model.advancePayment.departName }}</td>
                    <td class="theadTr">垫付客户类型</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ filterDictText(customerTypeDicts, model.advancePayment.customerType) }}</td>
                  </tr>
                  <tr>
                    <td class="theadTr">垫付类型</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ filterDictText(advanceTypeDicts, model.advancePayment.advanceType) }}</td>
                    <td class="theadTr">申请单位</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ filterOrgan(organs,model.advancePayment.applyUnit) }}</td>
                  </tr>
                  <tr>
                    <td class="theadTr">期望打款日期</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ model.advancePayment.applyAdvanceDate }}</td>
                    <td class="theadTr">本次已垫付未回款金额</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >
                      {{ model.advancePayment.advanceNotPayback }}
                    </td>
                  </tr>
                </thead>
                <tr>
                  <td class="theadTr">结算金额</td>
                  <td
                    class="theadTr"
                    colspan="2"
                    align="left"
                    style="padding-left: 10px;"
                  >
                    {{ model.advancePayment.settleMoney }}
                  </td>
                  <td class="theadTr">开票金额</td>
                  <td
                    class="theadTr"
                    colspan="2"
                    align="left"
                    style="padding-left: 10px;"
                  >
                    {{ model.advancePayment.ticketMoney }}
                  </td>
                </tr>
                <tr>
                  <td class="firstTr">垫付金额</td>
                  <td
                    colspan="2"
                    style="padding-left: 10px;"
                    align="left"
                  >{{ model.advancePayment.advanceMoney }}</td>
                  <td class="firstTr">承诺回款日期</td>
                  <td
                    colspan="2"
                    style="padding-left: 10px;"
                    align="left"
                  >{{ model.advancePayment.paybackDate }}</td>
                </tr>
                <tr>
                  <td class="costingCol">申请人</td>
                  <td
                    class="costingCol"
                    colspan="2"
                    align="left"
                    style="padding-left: 10px;"
                  >
                    {{ model.advancePayment.createUser }}
                  </td>
                  <td class="costingCol">垫付原因</td>
                  <td
                    colspan="2"
                    style="padding-left: 10px;"
                    align="left"
                  >{{ model.advancePayment.advanceReason }}</td>
                </tr>
                <tr
                  v-for="(chil,key) in model.approveAuditInfoList"
                  :key="key"
                >
                  <td>{{ chil.nodeName }}</td>
                  <td
                    style="padding-left: 10px;"
                    align="left"
                    colspan="5"
                  >{{ chil.auditUser }}->{{ status[chil.auditStatus] }} ( {{ chil.auditRemark }} )</td>
                </tr>
              </table>
            </a-card>
          </div>

          <!-- 商险结算单 -->
          <!-- <div
            v-for="(model,index) in insData"
            :key="index"
            class="ant-card-body"
            style="width:770px;"
          >
            <div style="page-break-after:always"></div>
            <span id="staffEvectionTitle">{{ model.settleDomainName }}{{ model.settlementMonth }} - 商险结算单</span>
            <a-card
              :bordered="true"
              class="ant-card-wider-padding"
              id="staffCard"
            >
              <table
                border="1"
                class="settlement"
              >
                <tr>
                  <td class="tdbg">结算主体</td>
                  <td>{{ model.settleDomainName }}</td>
                  <td class="tdbg">皖信盖章</td>
                  <td></td>
                </tr>
                <tr>
                  <td class="tdbg">客户单位</td>
                  <td colspan="3">{{ model.customerName }}</td>
                </tr>
                <tr>
                  <td class="tdbg">结算主体编码</td>
                  <td>{{ model.settleDomainNo }}</td>
                  <td class="tdbg">结算月份</td>
                  <td>{{ model.settlementMonth }}</td>
                </tr>
                <tr>
                  <td class="tdbg">回款金额</td>
                  <td>{{ model.payBackBalance }}</td>
                  <td class="tdbg">预估差额</td>
                  <td>{{ model.balance }}</td>
                </tr>
                <tr>
                  <td class="tdbg">发票号</td>
                  <td>{{ model.invoiceNo }}</td>
                  <td class="tdbg">创建人</td>
                  <td>{{ model.createUser }}</td>
                </tr>
              </table>
            </a-card>
          </div> -->

        </div>

      </div>
    </a-row>

  </div>
</template>

<script>
import { httpAction,postActionHeader } from '@/api/manage'
import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
import { filterOrgan } from '@/utils/customDict'
import { mapGetters } from 'vuex'
import { getItemName,getDpi,disableRightClick,disablePrintShortcut,insertAfter } from '@/utils/common'
import moment from 'moment'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  data() {
    return {
      article: '',
      fullscreenLoading: true,
      id:'',
      url:{
        openBill:'/salary/engineer/doExportSalary',
        doPrint:"/salary/tprintrecord/doPrint",
        getOrgan: '/admin/organizationinfo/getUserAllOrgan',
        getAdvance: "/hrApproval/tadvancepayment/getByFormId",
        getContract:'/hrBase/tcustomercontract/',
        getReceive:'/salary/treciverecord/getReciveRecordsByRecordId',
        getSalaryFrom:'busiInsurance/forecastbuypayform/salaryFrom/'
      },
      employData:[],
      salaryStandardInfo:{},
      coverList:{},
      settlementhFormInfo:{},
      pauseDiyInfoList:[],
      poorBalanceInfoList:{},
      dataSourceList:{},
      salaryAccountOne:{},
      settleDeail:{},
      salaryBankVoList:[],
      salaryCashVoList:[],
      bankOptions:[],
      customerTypeDicts:[],
      advanceTypeDicts:[],
      status:['提交审核','审核通过','审核不通过','待审核'],
      organs:[],
      advanceData:[],
      insData: [],
      openData: [],
      printData:{},
      receiveData:{},
      isBank:false,
      isCash:false,
      createName:'',
      auditName:'',
      revenueName:'',
      bankUpName:'',
      sign: '',
      style: {},
      bankMoney:0,
      cashMoney:0,
      isBackedType:['新表','退表重传'],
      styleBox:{},
      styleCover:{},
      pauseTxt:{
        '1': '(暂停发)',
        '2': '(不发放)',
      },
    }
  },
  created() {
    this.setStyle()
    this.initDictConfig()
    this.getOrgans();
    this.id = this.$route.query.id
    this.count = parseInt(this.$route.query.count)  + 1
    this.fetchData()
  },
  mounted(){
    disableRightClick();
    document.addEventListener("keydown",disablePrintShortcut);
    this.printAction();
  },
  
  methods: {
    moment,
    getItemName,
    ...mapGetters(["nickname", "avatar","userInfo"]),
    filterDictText,
    filterOrgan,
    removeBlank(str){
      return str ? str.replace(/(↵)+|(\n)+|(\r\n)+/g,"") : str
    },
    setStyle(){
      const wid = 210 * getDpi()/25.4;
      const height = 297 * getDpi()/25.4;
      this.styleBox = {
        width:`${wid}px`,
        height:`${height}px`,
        border:'1px solid #fff',
        margin: '75px auto 0px'
      }
      this.styleCover={
        width:`${height}px`,
        height:`${wid}px`,
        marginTop:`${(height-wid)/2}px`,
        marginLeft: `${(wid-height)/2}px`
      }
    },
    printAction(){
      const _this = this
      const mediaQueryList = window.matchMedia('print');
      mediaQueryList.addListener(function(mql){
        if(mql.matches){
          // console.log(111,document.querySelector('.printCont').innerHTML)
        }else{
          // document.getElementsByClassName('printCont')[0].innerHTML.replace(/style="transform[^"]*?"/g,'')
          _this.getPdf(document.getElementsByClassName('printCont')[0])
        }
      });
    },
    getPdf(el){
      html2canvas(el,{scale: 2,}).then(canvas => {
        const pdf = new JsPDF('p', 'mm', 'a4') // A4纸，纵向
        pdf.setFont("SimSun");
        const ctx = canvas.getContext('2d')
        const a4w = 170; const a4h = 257 // A4大小，210mm x 297mm，四边各保留20mm的边距，显示区域170x257
        const imgHeight = Math.floor(a4h * canvas.width / a4w) // 按A4显示比例换算一页图像的像素高度
        let renderedHeight = 0
        while (renderedHeight < canvas.height) {
          var page = document.createElement('canvas')
          page.width = canvas.width
          page.height = Math.min(imgHeight, canvas.height - renderedHeight)// 可能内容不足一页
          // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
          page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0)
          pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4w, Math.min(a4h, a4w * page.height / page.width)) // 添加图像到页面，保留10mm边距
          renderedHeight += imgHeight
          if (renderedHeight < canvas.height) { pdf.addPage() }// 如果后面还有内容，添加一个空页
        }
        const blob = pdf.output('blob');
        let files = new window.File([blob], `${moment().format('YYYY-MM-DD HH:mm:ss')}.pdf`, {type: 'application/pdf'})
        const remark = `${this.nickname()}在${moment().format('YYYY-MM-DD HH:mm:ss')}打印了一次`
        this.uploadFile(files,remark)
        // pdf.save(`${moment().format('YYYY-MM-DD HH:mm:ss')}.pdf`)
        
      })
    },
    uploadFile(file,remark){
      const formData = new FormData()
      formData.append('file', file)
      formData.append('linkType', 4)
      formData.append('linkId', this.id)
      let contextType = { 'Content-Type': 'multipart/form-data' }
      postActionHeader(`/salary/tsalaryatta/ossUploadFile?printRemark=${remark}`, formData, contextType).then((res) => {
        if(res.code == 200){
          window.close()
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    fetchData() {
      this.bankUpName = this.nickname()
      let url = this.url.openBill + '?salaryFormId=' + this.id
      httpAction(url,{},'POST').then((res) => {
        if(Number(res.code) === 200){
          this.salaryStandardInfo = res.data.salary
          this.coverList = res.data.coverList
          // 结算单数据
          this.settlementhFormInfo = res.data.engineerSettlementForm
          // 自定义数据列表
          this.pauseDiyInfoList = res.data.engineerSettlementhFormSubList != null ? res.data.engineerSettlementhFormSubList : []
          // 差额数据列表
          //this.poorBalanceInfoList = res.data.poorBalanceInfoList != null ? res.data.poorBalanceInfoList : []
          //this.detailData = res.data
          // 银行数据列表
          this.salaryBankVoList = res.data.salaryBankVoList
          for(let d of this.salaryBankVoList){
            this.bankMoney += d.money * 1
          }
          // for( let c in this.salaryBankVoList){
          //   this.salaryBankVoList[c]['bankName'] = filterDictText(this.bankOptions,this.salaryBankVoList[c]['bankName'])
          // }
          // 现金数据列表
          this.salaryCashVoList = res.data.salaryCashVoList
          for(let d of this.salaryCashVoList){
            this.cashMoney += d.money * 1
          }
          // 判断银行数据是否为空
          this.salaryBankVoList.length > 0 ? this.isBank = true : this.isBank = false
          // 判断现金数据是否为空
          this.salaryCashVoList.length > 0 ? this.isCash = true : this.isCash = false
          this.salaryAccountOne = res.data.engineerAccountList.length > 0 ? res.data.engineerAccountList[0] : {}
          // 结算单数据
          this.settleDeail = this.settlementhFormInfo
          this.openData = res.data.engineeringFormTicketList

          if(res.data.salary.moneyFrom == 1){
            this.sign = "DF"
          }else{
            this.sign = "Y"
          }
          if(res.data.salary.advanceMoney > 0){
            let advanceUrl = this.url.getAdvance + '?formId=' + this.settlementhFormInfo.id +'&type=1'
            httpAction(advanceUrl,{},'POST').then((advanceRes) => {
              if(Number(advanceRes.code) === 200){
                this.advanceData = advanceRes.data
                for(let y in this.advanceData){
                  if(this.advanceData[y].advancePayment.contractId){
                    httpAction(this.url.getContract + this.advanceData[y].advancePayment.contractId,{},'GET').then((contractRes) => {
                      this.advanceData[y].advancePayment.contractName = contractRes.data.contractName
                    })
                  }
                }
              }
            })
          }

          let receiveUrl = this.url.getReceive + '?matchId=' + this.salaryStandardInfo.id + '&type=1'
          

          httpAction('/admin/user/userDic','','GET').then((res) => {
            if(Number(res.code) === 200){
              this.employData = res.data
              for(var d in res.data){
                if(this.salaryStandardInfo.createUser == d){
                  this.createName = res.data[d]
                }
                if(this.salaryStandardInfo.auditUser == d){
                  this.auditName = res.data[d]
                }
                if(this.salaryStandardInfo.revenueUser == d){
                  this.revenueName = res.data[d]
                }
              }
              httpAction(receiveUrl,{},'GET').then((receiveRes) => {
                if(Number(receiveRes.code) === 200){
                  this.receiveData = receiveRes.data;
                  const length = receiveRes.data.length;
                  // 动态生成
                  if(length>10){
                    //创建一个div
                    const div = document.createElement("div");
                    // 确定分页总数
                    const page = Math.ceil((length-10) / 36);
                    for(let i=0; i<page; i++){
                      const div1 = document.createElement("div");
                      div1.style.border = this.styleBox.border;
                      div1.style.height = this.styleBox.height;
                      div1.style.margin = this.styleBox.margin;
                      div1.style.width = this.styleBox.width;
                      
                      const div2 = document.createElement("div");
                      div2.style.border = this.styleCover.border;
                      div2.style.height = this.styleCover.height;
                      div2.style.marginTop = this.styleCover.marginTop;
                      div2.style.marginLeft = this.styleCover.marginLeft;
                      div2.style.width = this.styleCover.width;
                      div2.style.transform = 'rotate(-90deg)';
                      div2.style.border = '1px solide #fff';

                      for(let j=0; j<36; j++){
                        const index = 10 + i*36+ j;
                        if(index < length){
                          const temp = `${this.receiveData[index].incomeBelong}-${this.receiveData[index].departName}  已到账, 到账金额:${this.receiveData[index].matchingAmount}  到账时间: ${this.receiveData[index].reciveDate}  备注: ${this.receiveData[index].serverRemark}`;
                          div2.innerHTML += '<p style="text-align:center;margin-bottom: 0px;">'+temp+'</p>';
                        }
                      }
                      div1.appendChild(div2);
                      div.appendChild(div1);
                      insertAfter(div1,'<div style="page-break-after:always"></div>');
                    }
                    var newNode = document.getElementById('newNode');
                    newNode.appendChild(div);
                  }


                  // 商险结算单
                  // httpAction(this.url.getSalaryFrom + this.settlementhFormInfo.id,{},'get').then((res) => {
                  //   if(Number(res.code) === 200){
                  //     this.insData = res.data
                  //     httpAction(this.url.doPrint,{'fromId':this.settlementhFormInfo.id,'fromType':1},'POST').then((res) => {
                  //       this.printData = res.data
                  //       this.$nextTick(() => {
                  //         window.print()
                  //       })
                  //     })
                  //   }
                  // })
                  httpAction(this.url.doPrint,{'fromId':this.settlementhFormInfo.id,'fromType':1},'POST').then((res) => {
                    this.printData = res.data
                    this.$nextTick(() => {
                      window.print()
                    })
                  })
                  
                }
              })
              
            }
          })
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
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then((res) => {
        if (Number(res.code) === 200) {
          this.bankOptions = res.data
        }
      })
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
    
  }
}
</script>

<style lang="scss" scoped>
@mixin clearfix {
  &:before {
    display: table;
    content: '';
    clear: both;
  }
  &:after {
    display: table;
    content: '';
    clear: both;
  }
}
.main-article {
  padding: 20px;
  margin: 0 auto;
  display: block;
  width: 900px;
  background: #fff;
}
.article__heading {
  position: relative;
  padding: 0 0 20px;
  overflow: hidden;
}
.article__heading__title {
  display: block;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-size: 32px;
  line-height: 48px;
  font-weight: 600;
  color: #333;
  overflow: hidden;
}
.node-article-content {
  margin: 20px 0 0;
  @include clearfix;
  font-size: 16px;
  color: #333;
  letter-spacing: 0.5px;
  line-height: 28px;
  margin-bottom: 30px;
  b,
  strong {
    font-weight: inherit;
    font-weight: bolder;
  }
  img {
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }
  p {
    font-weight: 400;
    font-style: normal;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: -0.003em;
  }
  ul {
    margin-bottom: 30px;
  }
  li {
    --x-height-multiplier: 0.375;
    --baseline-multiplier: 0.17;
    font-weight: 400;
    font-style: normal;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: -0.003em;
    margin-left: 30px;
    margin-bottom: 14px;
  }
  a {
    text-decoration: none;
    background-repeat: repeat-x;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.84) 100%, rgba(0, 0, 0, 0) 0);
    background-size: 1px 1px;
    background-position: 0 calc(1em + 1px);
    padding: 0 6px;
  }
  code {
    background: rgba(0, 0, 0, 0.05);
    padding: 3px 4px;
    margin: 0 2px;
    font-size: 16px;
    display: inline-block;
  }
  img {
    border: 0;
  }
  /* 解决 IE6-7 图片缩放锯齿问题 */
  img {
    -ms-interpolation-mode: bicubic;
  }
  blockquote {
    --x-height-multiplier: 0.375;
    --baseline-multiplier: 0.17;
    font-family: medium-content-serif-font, Georgia, Cambria, 'Times New Roman', Times, serif;
    font-weight: 400;
    font-style: italic;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: -0.003em;
    border-left: 3px solid rgba(0, 0, 0, 0.84);
    padding-left: 20px;
    margin-left: -23px;
    padding-bottom: 2px;
  }
  a {
    text-decoration: none;
  }
  h2,
  h3,
  h4 {
    font-size: 34px;
    line-height: 1.15;
    letter-spacing: -0.015em;
    margin: 53px 0 0;
  }
  h4 {
    font-size: 26px;
  }
}
.table1 {
  border: 2px solid #333;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
.table1 .tr1 {
  margin: 0px;
  padding: 0;
  width: 100%;
}
.table1 .td1 {
  font-size: 12px;
  border: 1px solid #333;
  text-align: center;
  height: 10px;
  //padding: 10px;
  width: 17%;
  word-break: break-all;
}
.table1 .td2 {
  font-size: 16px;
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 10px;
  //padding: 10px;
  width: 17%;
  text-align: center;
}
.table1 .tit {
  font-weight: bolder;
}
.table1 .input1 {
  height: 10px;
  width: 110%;
  padding: 0 5px;
}
.table1 .btn {
  width: 20%;
  font-size: 11px;
  border: none;
  background: red;
  color: #fff;
  float: right;
}
.table2 {
  text-align: center;
  display: block;
  width: 83%;
  margin: 20px auto 10px;
}
.num {
  margin-top: 20px;
}
.font18 {
  font-size: 18px;
  font-weight: bolder;
  padding-left: 20px;
}
.cover {
  transform: rotate(-90deg);
  border: 1px solide #fff;
}
.cover .tr1 {
  height: 60px;
}
.cover .td1 {
  height: 60px;
}
.tabDiv {
  box-shadow: 0 0 1px 1px #aaa, 3px 0 5px 0 #aaa, 0 4px 7px 0 #aaa;
  border: 1px solid;
  margin: 44px auto;
}
.settlement {
  border-collapse: collapse;
  margin: 10px auto 30px;
  width: 100%;
  color: #000;
  font-size: 12px;
}
.settlement td {
  width: 20%;
  height: 40px;
  padding-left: 10px;
  border: solid #999 1px;
}
.settlement td.tdbg {
  font-weight: bold;
  text-align: center;
}
#staffEvectionTitle {
  margin-top: 1px;
  margin-bottom: 5px;
  font-weight: 700;
  text-align: center;
  display: block;
  color: #000;
  font-size: 24px;
}
#taffEvectionTable {
  width: 100%;
  font-size: 12px;
  text-align: center;
  background-color: #fff;
}
#staffCard {
  border: 1px solid;
  box-shadow: 0 0 1px 1px #ccc, 3px 0 5px 0 #ccc, 0 4px 7px 0 #ccc;
}

#taffEvectionTable .firstTr {
  width: 120px;
}
#taffEvectionTable .costingCol {
  width: 120px;
}
#taffEvectionTable .theadTr {
  width: 120px;
}
#taffEvectionTable td {
  color: #000;
  padding: 10px 0px 10px 0px;
}
</style>
<style media='print' >
@page {
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>