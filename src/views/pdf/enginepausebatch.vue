<template>
  <div>
    <a-row>

      <div
        v-for="(pane,index) in coverList"
        :key="index"
        style="transform:rotate(-90deg);position:relative;top:310px;right:100px"
        class="cover"
      >
        <p style="text-align:center;font-size:18px;font-weight:bold">{{ pane.title }}</p>
        <p
          style="text-align:center;font-size:25px;font-weight:bold"
          v-if="pane.payType == 1"
        >银行转账审批单</p>
        <p
          style="text-align:center;font-size:25px;font-weight:bold"
          v-if="pane.payType == 0"
        >现金付款审批单</p>
        <p style="text-align:center;line-height:0"> <span style="margin-left: 306px;">{{ moment().format("YYYY-MM-DD HH:mm:ss") }} </span> <span style="margin-left: 20px;"> 结算主体编码</span> <span>{{ pane.settleNo }}</span> </p>
        <table class="table1">
          <tr class="tr1">
            <td
              class="td1"
              colspan="2"
            >Z</td>
            <td
              class="td1"
              colspan="2"
            >{{ moment().format("YYYY-MM-DD HH:mm:ss") }}</td>
            <td class="td1">结算主体编码</td>
            <td class="td1">{{ pane.settleNo }}</td>
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
              <p v-if="pane.payType == 1">银行转账</p>
              <p v-if="pane.payType == 0">现金转账</p>
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
              {{ pane.organName }}
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
          <span style="margin-left:100px">财务负责人: {{ revenueName }}</span>
          <span style="margin-left:100px">网银审核授权人:</span>
          <span style="margin-left:100px">网银转账提交人:{{ bankUpName }}</span>
          <span style="margin-left:50px">数据审核: {{ auditName }}</span>
          <span style="margin-left:50px">制表人1: {{ createName }}</span>
        </p>
        <p v-if="pane.payType == 0">
          <span>公司领导:</span>
          <span style="margin-left:100px">财务负责人: {{ revenueName }}</span>
          <span style="margin-left:100px">出纳会计:</span>
          <span style="margin-left:50px">数据审核: {{ auditName }}</span>
          <span style="margin-left:50px">制表人: {{ createName }}</span>
        </p>
        <p style="text-align:center;padding-top:15px">本次打印为第&nbsp; {{ count }} &nbsp;次打印,请注意避免重复! &nbsp;打印时间: {{ printData.printDate }} &nbsp; 打印柜员: {{ printData.printUser }} &nbsp; 验证码: {{ printData.uniqueCode }}</p>
        <div style="page-break-after:always"></div>
      </div>

    </a-row>

    <a-row>
      <div
        v-for="settle in settlementhFormList"
        :key="settle.engineeringSettlementForme.id"
      >
        <div class="main-article">
          <div class="node-article-content">
            <p style="text-align:center;color:red">{{ settle.engineeringSettlementForme.settleMonth }}客户结算单</p>
            <table
              class="table1"
              style="background:yellow;border:0;width:770px;"
            >
              <tr>
                <td
                  class="font18"
                  style="background:yellow;border:0"
                >结算主体:</td>
                <td colspan="2">{{ settle.engineeringSettlementForme.settleDepartName }}</td>
                <td class="font18">皖信盖章:</td>
                <td></td>
              </tr>
              <tr>
                <td class="font18">结算编码:</td>
                <td colspan="2">{{ settle.engineeringSettlementForme.settleDepartNo }}</td>
                <td></td>
                <td></td>
              </tr>
              <tr class="tr1">
                <td
                  class="font18"
                  style="width:20%"
                >结算时间:</td>
                <td style="width:20%">{{ settle.engineeringSettlementForme.settleMonth }}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </table>
            <table
              class="table1"
              style="width:770px;"
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
                >{{ settle.engineeringSettlementForme.salaryMonth }}</td>
                <td class="tit td1">应发工资</td>
                <td class="td1">{{ settle.engineeringSettlementForme.salarySum }}</td>
                <td class="td1">{{ settle.engineeringSettlementForme.salaryTicket }}</td>
              </tr>
              <tr class="tr1">
                <td class="tit td1">实发工资(银付)</td>
                <td class="td1">{{ settle.engineeringSettlementForme.cardPay }}</td>
                <td class="td1"></td>
              </tr>
              <tr class="tr1">
                <td class="tit td1">实发工资(现金)</td>
                <td class="td1">{{ settle.engineeringSettlementForme.moneyPay }}</td>
                <td class="td1"></td>
              </tr>
              <tr class="tr1">
                <td class="tit td1">暂停发金额</td>
                <td class="td1">{{ settle.engineeringSettlementForme.pausePay }}</td>
                <td class="td1"></td>
              </tr>
              <tr class="tr1">
                <td
                  class="tit td1"
                  rowspan="2"
                >{{ settle.engineeringSettlementForme.socialMonth }}</td>

                <td class="tit td1">应缴单位社保</td>
                <td class="td1">{{ settle.engineeringSettlementForme.usocialDeduction }}</td>
                <td class="td1"></td>
              </tr>
              <tr class="tr1">
                <td class="tit td1">应缴个人社保</td>
                <td class="td1">{{ settle.engineeringSettlementForme.psocialDeduction }}</td>
                <td class="td1"></td>
              </tr>
              <tr class="tr1">
                <td
                  class="tit td1"
                  rowspan="2"
                >{{ settle.engineeringSettlementForme.fundMonth }}</td>
                <td class="tit td1">应缴单位公积金</td>
                <td class="td1">{{ settle.engineeringSettlementForme.ufundDeduction }}</td>
                <td class="td1"></td>
              </tr>
              <tr class="tr1">
                <td class="tit td1">应缴个人公积金</td>
                <td class="td1">{{ settle.engineeringSettlementForme.pfundDeduction }}</td>
                <td class="td1"></td>
              </tr>
              <tr
                v-for="(item,index) in pauseDiyInfoList"
                :key="index"
              >
                <td
                  class="tit td1"
                  colspan="2"
                >{{ getItemName(item.itemTypeName,item.subName) }}
                </td>
                <td class="td1">{{ item.money }}</td>
                <td class="td1"></td>
              </tr>
              <tr class="tr1">
                <td
                  class="tit td1"
                  colspan="2"
                >雇主责任险</td>
                <td class="td1">{{ settle.engineeringSettlementForme.employerLiabilityInsurance }}</td>
                <td class="td1"></td>
              </tr>

              <tr class="tr1">
                <td
                  class="tit td1"
                  colspan="2"
                >其它费用</td>
                <td class="td1">{{ settle.engineeringSettlementForme.other }}</td>
                <td class="td1"></td>
              </tr>
              <tr class="tr1">
                <td
                  class="tit td1"
                  colspan="2"
                >增值税金及附加</td>
                <td class="td1">{{ settle.engineeringSettlementForme.valueDaddedTax }}</td>
                <td class="td1">{{ settle.engineeringSettlementForme.valueDaddedTaxTicket }}</td>
              </tr>
              <tr class="tr1">
                <td
                  class="tit td1"
                  colspan="2"
                >预缴企业所得税</td>
                <td class="td1">{{ settle.engineeringSettlementForme.unitIncomeTax }}</td>
                <td class="td1">{{ settle.engineeringSettlementForme.unitIncomeTaxTicket }}</td>
              </tr>
              <tr class="tr1">
                <td
                  class="tit td1"
                  colspan="2"
                >预缴个人所得税</td>
                <td class="td1">{{ settle.engineeringSettlementForme.personIncomeTax }}</td>
                <td class="td1">{{ settle.engineeringSettlementForme.personIncomeTaxTicket }}</td>
              </tr>

              <tr class="tr1">
                <td
                  class="tit td1"
                  colspan="2"
                >人数</td>
                <td class="td1">{{ settle.engineeringSettlementForme.personCount }}</td>
                <td class="td1"></td>
              </tr>

              <tr class="tr1">
                <td
                  class="tit td1"
                  colspan="2"
                >管理费</td>
                <td class="td1">{{ settle.engineeringSettlementForme.managementCost }}</td>
                <td class="td1">{{ settle.engineeringSettlementForme.managementCostTicket }}</td>
              </tr>

              <tr class="tr1">
                <td
                  class="tit td1"
                  colspan="2"
                >结算金额合计</td>
                <td class="td1"></td>
                <td class="td1">{{ settle.engineeringSettlementForme.accountMoneySum }}</td>
              </tr>

              <tr class="tr1">
                <td class="tit td1">备注</td>
                <td
                  class="td1"
                  colspan="3"
                >{{ settle.engineeringSettlementForme.remark }}</td>
              </tr>
            </table>
          </div>

        </div>
      </div>

    </a-row>
    <a-row class="middle">
      <!-- 银行数据列表 -->
      <div v-if="salaryBankVoList.length">
        <p
          id="tabledesc1"
          style="text-align:center;font-weight:bold;margin-bottom:0px;"
        >银行数据列表</p>
        <table
          class="table1"
          style="width:770px"
          aria-describedby="tabledesc1"
        >
          <tr class="tr1">
            <th class="tit td1" id="bname">姓名</th>
            <th class="tit td1" id="bidcard">身份证号</th>
            <th class="tit td1" id="baccount">银行账号</th>
            <th class="tit td1" id="btotal">实发工资合计</th>
            <th class="tit td1" id="bbank">银行</th>
            <th class="tit td1" id="bbranch">支行</th>
          </tr>
          <tr
            class="tr1"
            v-for="(item,index) in salaryBankVoList"
            :key="index"
          >
            <td class="td1" headers="bname">{{ item.name }}</td>
            <td class="td1" headers="bidcard">{{ item.idNumber }}</td>
            <td class="td1" headers="baccount">{{ item.bankNo }}</td>
            <td class="td1" headers="btotal">{{ item.money }}</td>
            <td class="td1" headers="bbank">{{ item.bankName }}</td>
            <td class="td1" headers="bbranch">{{ item.subBranch }}</td>
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
      <div v-if="salaryCashVoList.length">
        <!-- 现金数据列表 -->
        <p
          style="text-align:center;font-weight:bold;margin-bottom:0px;"
          id="tabledesc2"
        >现金数据列表</p>
        <table
          class="table1"
          style="width:770px"
          aria-describedby="tabledesc2"
        >
          <tr class="tr1">
            <th class="tit td1" id="cname">姓名</th>
            <th class="tit td1" id="cidcard">身份证号</th>
            <th class="tit td1" id="ctotal">实发工资合计</th>
          </tr>
          <tr
            class="tr1"
            v-for="(item,index) in salaryCashVoList"
            :key="index"
          >
            <td class="td1" headers="cname">{{ item.name }}</td>
            <td class="td1" headers="cidcard">{{ item.idNumber }}</td>
            <td class="td1" headers="ctotal">{{ item.money }}</td>
          </tr>
          <tr>
            <td class="td1">合计</td>
            <td
              class="td1"
              colspan="2"
            >{{ cashMoney.toFixed(2) }}</td>
          </tr>
        </table>
      </div>
    </a-row>
  </div>
</template>
<script>
import { httpAction } from '@/api/manage'
import { mapGetters } from 'vuex'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { getItemName } from '@/utils/common'
import moment from 'moment'
export default {
  data() {
    return{
      createName:'',
      auditName:'',
      revenueName:'',
      bankUpName:'',
      count:0,
      coverList:[],
      printData:{},
      settlementhFormList:[],
      pauseDiyInfoList:[],
      poorBalanceInfoList:[],
      salaryBankVoList:[],
      salaryCashVoList:[],
      salaryStandardInfo:{},
      salaryAccountOne:{},
      // isBank:false,
      // isCash:false,
      bankMoney:0,
      cashMoney:0,
      url:{
        detailUrl:"salary/tchargerecord/openBatchChargeRecordDetail",
        doPrint:"/salary/tprintrecord/doPrint"
      },
    }
  },
  
  created() {
      this.bankUpName = this.nickname()
      this.count = parseInt(this.$route.query.count)  + 1
      this.initDictConfig()
      const url = this.url.detailUrl + '?settleDepartNo=' + this.$route.query.settleDepartNo + '&settleDate=' + this.$route.query.settelDate + "&type=" + 1
      httpAction(url, {}, "POST").then((res) => {
        if(Number(res.code) === 200){
          httpAction('/admin/user/userDic', '', 'GET').then((result) => {
            if(result.code == 200){
              this.settlementhFormList = res.data.engineerSettlementFormList
              this.handleData(res.data,'allBankCover',this.coverList,1,false)
              this.handleData(res.data,'allCashCover',this.coverList,0,false)
              this.handleData(res.data,'pauseBankCoverList',this.coverList,1,true)
              this.handleData(res.data,'pauseBankCoverTwoList',this.coverList,1,true)
              this.handleData(res.data,'pauseCashCoverList',this.coverList,0,true)
              this.handleData(res.data,'pauseCashCoverTwoList',this.coverList,0,true)
              // 银行数据列表
              this.salaryBankVoList = res.data.salaryBankVoList
              for(const d of this.salaryBankVoList){
                this.bankMoney += d.money * 1
              }
              // 现金数据列表
              this.salaryCashVoList = res.data.salaryCashVoList
              for(const d of this.salaryCashVoList){
                this.cashMoney += d.money * 1
              }
              httpAction(this.url.doPrint,{'fromId':this.$route.query.id,'fromType':2},'POST').then((res) => {
                this.printData = res.data
                this.$nextTick(() => {
                  window.print()
                })
              })
            }
          })
        }
      })
    },
  methods: {
    moment,
    getItemName,
    ...mapGetters(["nickname", "avatar","userInfo"]),
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then((res) => {
        if (Number(res.code) === 200) {
          this.bankOptions = res.data
        }
      })
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
<style lang="scss">
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

.node-article-content {
  margin: 20px 0 0;
  @include clearfix;
  font-size: 16px;
  color: #333;
  letter-spacing: 0.5px;
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
    letter-spacing: 0.01rem;
    font-weight: 400;
    font-style: italic;
    font-size: 21px;
    line-height: 1.58;
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
  margin-top: 20px;
}
.table1 .tr1 {
  margin: 0px;
  padding: 0;
  height: 6px;
  width: 100%;
}
.table1 .td1 {
  font-size: 12px;
  border: 1px solid #333;
  text-align: center;
  word-break: break-all;
  //padding: 10px;
  width: 17%;
}
.table1 .td2 {
  font-size: 16px;
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 6px;
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
  margin: 0 auto;
  width: 1000px;
}
.cover .tr1 {
  height: 60px;
}
.cover .td1 {
  height: 60px;
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
<style media="print">
@page:first {
  size: portrait; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>