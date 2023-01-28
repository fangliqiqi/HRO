<template>
  <div>
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
      </div>
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
              <td class="td1">{{ settlementhFormInfo.employerLiabilityInsurance }}</td>
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
              <td class="tit td1">备注</td>
              <td
                class="td1"
                colspan="3"
              >{{ settlementhFormInfo.remark }}</td>
            </tr>
          </table>

          <!-- <table
            class="table1"
            style="margin-top:20px;width:770px"
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
              <td class="td1">{{ item.ticketTime }}</td>
              <td class="td1">{{ item.money }}</td>
              <td class="td1">{{ item.currentSettleMoney }}</td>
              <td class="td1">{{ item.currentSettleComeMoney }}</td>
            </tr>
          </table> -->
          <div
            style="page-break-after:always"
            v-if="isBank == true"
          ></div>
          <!-- 银行数据列表 -->
          <div
            v-if="isBank == true"
            style="margin-top:30px;"
          >
            <p id="tabledesc1" style="text-align:center;font-weight:bold">银行数据列表</p>
            <table class="table1" aria-describedby="tabledesc1">
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
          <div
            style="page-break-after:always"
            v-if="isCash == true"
          >
            <p id="tabledesc2" style="text-align:center;font-weight:bold">现金数据列表</p>
          </div>

          <!-- 现金数据列表 -->
          <table
            class="table1"
            style="margin-top:30px;"
            aria-describedby="tabledesc2"
            v-if="isCash == true"
          >
            <tr class="tr1">
              <th class="tit td1" id="cname">姓名</th>
              <th class="tit td1" id="cidcard">身份证号</th>
              <th class="tit td1" id="ctotal">实发工资合计</th>
              <th class="tit td1" id="cuse">用途</th>
            </tr>
            <tr
              class="tr1"
              v-for="(item,index) in salaryCashVoList"
              :key="index"
            >
              <td class="td1" headers="cname">{{ item.name }}</td>
              <td class="td1" headers="cidcard">{{ item.idNumber }}</td>
              <td class="td1" headers="ctotal">{{ item.money }}</td>
              <td class="td1" headers="cuse">{{ item.useRemark }}</td>
            </tr>
            <tr>
              <td class="td1">合计</td>
              <td
                class="td1"
                colspan="3"
              >{{ cashMoney.toFixed(2) }}</td>
            </tr>
          </table>

        </div>

      </div>
    </a-row>
  </div>
</template>
<script>
import { httpAction } from '@/api/manage'
import { mapGetters } from 'vuex'
import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
import { getItemName,getDpi } from '@/utils/common'
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
      settlementhFormInfo:{},
      pauseDiyInfoList:[],
      poorBalanceInfoList:[],
      salaryBankVoList:[],
      salaryCashVoList:[],
      settleDeail:{},
      salaryStandardInfo:{},
      salaryAccountOne:{},
      isBank:false,
      isCash:false,
      bankMoney:0,
      cashMoney:0,
      url:{
        detailUrl:"salary/tchargerecord/openChargeRecordDetail",
        doPrint:"/salary/tprintrecord/doPrint"
      },
      styleBox:{},
      styleCover:{},
    }
  },
  
  created() {
    this.setStyle();
    this.bankUpName = this.nickname()
    this.count = parseInt(this.$route.query.count)  + 1
    this.initDictConfig()
    httpAction(this.url.detailUrl + "?chargeRecordId=" + this.$route.query.id, {}, "POST").then((res) => {
      if(Number(res.code) === 200){
        httpAction('/admin/user/userDic', '', 'GET').then((result) => {
          if(result.code == 200){
            this.salaryStandardInfo = res.data.engineerAccount.length > 0 ? res.data.engineerAccount[0] : {}
            // 获取主表结算单数据
            this.salaryAccountOne = res.data.engineerAccount.length > 0 ? res.data.engineerAccount[0] : {}
            // 结算单数据
            this.settlementhFormInfo = res.data.engineerSettlementForm
            // 自定义数据列表
            this.pauseDiyInfoList = res.data.engineerSettlementhFormSubList != null ? res.data.engineerSettlementhFormSubList : []
            // 差额数据列表
            this.poorBalanceInfoList = res.data.poorBalanceInfoList != null ? res.data.poorBalanceInfoList : []
            // 结算单数据
            this.settleDeail = this.settlementhFormInfo
            // 判断是否有银行转账封面数据
            if(res.data.pauseBankCover){
              // 转换创建名称
              for(let d in result.data){
                if(res.data.pauseBankCover.createUser == d){
                  this.createName = result.data[d]
                }
              }
              // 银行名称转换
              let bankName = filterDictText(this.bankOptions, res.data.pauseBankCover.bankName)
              if(bankName == '-' && res.data.pauseBankCover.bankName){
                // eslint-disable-next-line
              }else{
                res.data.pauseBankCover.bankName = bankName
              }
              // 给封面转账方式赋值
              res.data.pauseBankCover.payType = 1
              // 追加封面数组
              this.coverList.push(res.data.pauseBankCover)
            }
            // 判断是否有银行封面转账2数据
            if(res.data.pauseBankCoverTwo){
              // 转换创建人名称
              for(let d in result.data){
                if(res.data.pauseBankCoverTwo.createUser == d){
                  this.createName = result.data[d]
                }
              }
              let bankName = filterDictText(this.bankOptions, res.data.pauseBankCoverTwo.bankName)
              if(bankName == '-' && res.data.pauseBankCoverTwo.bankName){
                // eslint-disable-next-line
              }else{
                res.data.pauseBankCoverTwo.bankName = bankName
              }
              res.data.pauseBankCoverTwo.payType = 1
              this.coverList.push(res.data.pauseBankCoverTwo)
            }
            if(res.data.pauseCashCover){
              for(let d in result.data){
                if(res.data.pauseCashCover.createUser == d){
                  this.createName = result.data[d]
                }
              }
              res.data.pauseCashCover.payType = 0
              this.coverList.push(res.data.pauseCashCover)
            }
            if(res.data.pauseCashCoverTwo){
              for(let d in result.data){
                if(res.data.pauseCashCoverTwo.createUser == d){
                  this.createName = result.data[d]
                }
              }
              res.data.pauseCashCoverTwo.payType = 0
              this.coverList.push(res.data.pauseCashCoverTwo)
            }
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
            // 判断银行数据是否为空
            this.isBank = this.salaryBankVoList.length > 0 ? true : false
            // 判断现金数据是否为空
            this.isCash = this.salaryCashVoList.length > 0 ? true : false
            httpAction(this.url.doPrint,{'fromId':this.$route.query.id,'fromType':2},'POST').then((res) => {
              this.printData = res.data
              this.$nextTick(() => {
                window.print()
              })
            })
          }
        })
        
        // this.loading = false
        // this.dataSourceList.push(res.data.engineerAccount)
        // this.saiList = res.data.engineerAccount.saiList
        
      }
    })
  },
  methods: {
    moment,
    getItemName,
    ...mapGetters(["nickname", "avatar","userInfo"]),
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
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then((res) => {
        if (Number(res.code) === 200) {
          this.bankOptions = res.data
        }
      })
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
  transform: rotate(-90deg);
  border: 1px solide #fff;
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
@page {
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>