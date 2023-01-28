<template>
  <a-row class="main-article">
    <template v-if="printfDate.id">
      <div
        class="cover"
        style="margin-top: 10px;"
      >
        <div
          class="prindfContentBody"
        >
          <a-row type="flex">
            <a-col
              style="text-align:center;font-size:22px;font-weight:bolder;color:#333"
              :span="12"
              :offset="6"
            >{{ moment(printfDate.settleDate).format('YYYYMM') }}-结算单</a-col>
          </a-row>
          <table class="table1">
            <tr class="tr1">
              <td
                class="td1 td3"
                style="width: 20%;"
              >客户单位</td>
              <td
                class="td1"
                colspan="3"
                style="text-align: left;"
              >{{ printfDate.customerName }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">结算主体</td>
              <td
                class="td1"
                colspan="3"
                style="text-align: left;"
              >{{ printfDate.departName }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">结算主体编码</td>
              <td
                class="td1"
                colspan="3"
                style="text-align: left;"
              >{{ printfDate.departNo }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">服务项目</td>
              <td
                class="td1"
                colspan="3"
                style="text-align: left;"
              >{{ printfDate.serverItemsStr }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">结算日期</td>
              <td
                class="td1"
                colspan="3"
                style="text-align: left;"
              >{{ bill.settleDate }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">费用名目</td>
              <td
                class="td1 td3"
                style="width: 30%"
              >金额</td>
              <td
                class="td1 td3"
                style="width: 20%"
              >税金</td>
              <td
                class="td1 td3"
                style="width: 30%"
              >开票额小计</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">结算合计</td>
              <td class="td1">{{ formatFloat(bill.sumSettle-bill.sumTax) }}</td>
              <td class="td1">{{ bill.sumTax }}</td>
              <td class="td1">{{ bill.sumSettle }}</td>
            </tr>
            <tr
              v-for="item in bill.costingPayments"
              :key="item.id"
            >
              <td class="td1">{{ item.name }}</td>
              <td class="td1">{{ item.amount }}</td>
              <td class="td1">{{ item.taxAmount }}</td>
              <td class="td1">{{ formatFloat(item.amount + item.taxAmount) }}</td>
            </tr>
            <tr
              v-for="(item,index) in bill.settleIncomeOthers"
              :key="item.id"
              class="tr1"
            >
              <td class="td1">业务收入{{ index+1 }}</td>
              <td class="td1">{{ item.income }}</td>
              <td class="td1">{{ item.taxAmount }}</td>
              <td class="td1">{{ item.ticketAmount }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">开票金额合计</td>
              <td
                class="td1"
                colspan="2"
              ></td>
              <td class="td1">{{ bill.sumAmount }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">上期差余额</td>
              <td
                class="td1"
                colspan="2"
              ></td>
              <td class="td1">{{ bill.prePoorBalance }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">本期差余额</td>
              <td
                class="td1"
                colspan="2"
              ></td>
              <td class="td1">{{ bill.currPoorBalance }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">创建人</td>
              <td class="td1">{{ printfDate.createUser }}</td>
              <td class="td1 td3">审核人</td>
              <td class="td1">{{ printfDate.auditUser }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="td1 td3"
                colspan="2"
              >开票客户名称</td>
              <td class="td1 td3">开票金额</td>
              <td class="td1 td3">开票时间</td>
            </tr>
            <tr
              class="tr1"
              v-for="item in invoice"
              :key="item.id"
            >
              <td
                colspan="2"
                class="td1"
              >{{ item.unitName }}</td>
              <td class="td1">{{ item.invoiceMoney }}</td>
              <td class="td1">{{ item.applyDate }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">到款单位</td>
              <td class="td1 td3">到款时间</td>
              <td class="td1 td3">来款金额</td>
              <td class="td1 td3">认领金额</td>
            </tr>
            <template v-if="printfDate.reciveList">
              <tr
                class="tr1"
                v-for="item in printfDate.reciveList"
                :key="item.id"
              >
                <td class="td1">{{ item.reciveRecordList[0].incomeBelong }}</td>
                <td class="td1">{{ item.releaseDate }}</td>
                <td class="td1">{{ item.incomeFee }}</td>
                <td class="td1">{{ item.reciveRecordList[0].reciveFee }}</td>
              </tr>
            </template>
            <tr>
              <td class="td1 td3" colspan="2">收入归属</td>
              <td class="td1 td3" colspan="2">分成金额</td>
            </tr>
            <template v-if="incomeBelong.length">
              <tr
                v-for="item in incomeBelong"
                :key="item.id">
                <td class="td1" colspan="2">{{ item.incomeBelong }}</td>
                <td class="td1" colspan="2">{{ item.incomeAmount }}</td>
              </tr>
            </template>

          </table>
        </div>
      </div>
    </template>
  </a-row>
</template>

<script>
import { httpAction } from '@/api/manage'
import moment from 'moment'

export default {
  data() {
    return {
      id:'',
      bill: {},
      invoice: [],
      incomeBelong:[], // 收入归属
      printfDate: {},
      organs:[], // 组织机构数据
      url:{
        queryAllInfoById: 'hrOneTime/tbusinessoutsourcingmain/getDetail/',
        getOrgan: '/admin/organizationinfo/getOrgForCus?type=1', // 获取数组数据信息
      },
    }
  },
  created() {
    this.id = this.$route.query.id
    this.loadOrgans()
    this.fetchData()
  },
  methods: {
    moment,
    fetchData() {
      httpAction(this.url.queryAllInfoById + this.id, {}, 'GET', 1000 * 60 * 5).then((res) => {
        if (Number(res.code) === 200 && res.data) {
          let serverItems = "";
          this.bill = res.data.settleBillVo
          this.printfDate = res.data
          // 收入归属
          if(this.printfDate.settleBillInnerVo){
            const incomeList = this.printfDate.settleBillInnerVo.incomeBelongVos || []
            for (let i = 0; i < incomeList.length; i++) {
              incomeList[i].devidedProp += "%"
              for (const item of this.organs) {
                if (String(incomeList[i].incomeBelong) === String(item.id)) {
                  incomeList[i].incomeBelong = item.organName
                  break
                }
              }
            }
            this.incomeBelong = incomeList
          }
          this.printfDate.moutsourcingItemVos.forEach((v, i) => {
            if (i === this.printfDate.moutsourcingItemVos.length - 1) {
              serverItems += v.itemName;
            } else {
              serverItems += `${v.itemName}，`;
            }
          })
          this.printfDate.serverItemsStr = serverItems
          const url = `/salary/tinvoice/openOneTimeInvoiceBySettleBillId?settleBillId=${this.printfDate.settleBillVo.id}&settleFormType=4`
          httpAction(url,{},'GET').then((ress) => {
            if(Number(ress.code) === 200){
              this.invoice = ress.data || []
            }else{
              this.$message.warning(ress.msg)
            }
          })
          this.$nextTick(() => {
            window.print()
          })
        } else {
          this.printfDate = {}
          this.$message.error('数据请求失败！')
        }
      })
    },
    // 获取收入归属的名称数据
    loadOrgans() {
      httpAction(this.url.getOrgan,'','GET').then((res) => {
        if(res.code === 200 && res.data.length > 0) {
          this.organs = res.data;
        }
      });
    },
    // 精度处理
    formatFloat(f, digit = 2) {
      const m = Math.pow(10, digit)
      return Math.round(f * m) / m
    },
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
  width: 1000px;
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
  font-family: medium-content-serif-font, Georgia, Cambria, 'Times New Roman', Times, serif;
  & > :last-child {
    margin-bottom: 0;
  }
  b,
  strong {
    font-weight: inherit;
    font-weight: bolder;
  }
  img {
    max-width: 100%;
    display: block;
    margin: 0 auto;
    border: 0;
    /* 解决 IE6-7 图片缩放锯齿问题 */
    -ms-interpolation-mode: bicubic;
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
  width: 100%;
}
.table1 .td1 {
  font-size: 12px;
  border: 1px solid #333;
  text-align: center;
  height: 10px;
  //padding: 10px;
  // width: 17%;
}
.table1 .td2 {
  font-size: 16px;
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 10px;
  //padding: 10px;
  width: 18%;
  text-align: center;
}
.table1 .td3 {
  font-weight: bold;
  background: #ddd;
}
.table1 .tit {
  font-weight: bolder;
}
.table1 .input1 {
  height: 10px;
  width: 100%;
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
  //padding-left: 20px;
}
.cover {
  margin: 0 auto;
  width: 800px;
}
.cover .tr1 {
  height: 35px;
}
.cover .td1 {
  height: 35px;
}
.prindfContentBody {
  padding: 40px 20px 20px 20px;
  border: 1px solid;
  -webkit-box-shadow: 0 0 1px 1px #aaa, 3px 0 5px 0 #aaa, 0 4px 7px 0 #aaa;
  box-shadow: 0 0 1px 1px #aaa, 3px 0 5px 0 #aaa, 0 4px 7px 0 #aaa;
}
</style>

<style media="print">
@page {
  size: landscape; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>
