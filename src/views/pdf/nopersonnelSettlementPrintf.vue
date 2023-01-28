<template>
  <a-row class="main-article">
    <template>
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
              id="tabledesc1"
              :span="12"
              :offset="6"
            >{{ settleInfo.bill.settleDate }}-结算单</a-col>
          </a-row>
          <table class="table1" aria-describedby="tabledesc1">
            <tr class="tr1">
              <th
                class="td1 td3"
                scope="col"
                style="width: 20%;"
              >客户单位</th>
              <td
                class="td1"
                colspan="3"
                style="text-align: left;"
              >&nbsp;&nbsp;{{ settleInfo.businessMain.customerName }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">结算主体</td>
              <td
                class="td1"
                colspan="3"
                style="text-align: left;"
              >&nbsp;&nbsp;{{ settleInfo.businessMain.departName }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">结算主体编码</td>
              <td
                class="td1"
                colspan="3"
                style="text-align: left;"
              >&nbsp;&nbsp;{{ settleInfo.businessMain.departNo }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">业务类型</td>
              <td
                class="td1"
                colspan="3"
                style="text-align: left;"
              >&nbsp;&nbsp;{{ businessType }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">服务项目</td>
              <td
                class="td1"
                colspan="3"
                style="text-align: left;"
              > &nbsp;&nbsp;
                <template v-if="settleInfo.businessMain.serverItem">
                  <a-tag
                    v-for="item in settleInfo.businessMain.serverItem.split(',')"
                    :key="item"
                  >{{ item }}</a-tag>
                </template>
              </td>
            </tr>
            <tr class="tr1">
              <td class="td1 td3">结算日期</td>
              <td
                class="td1"
                colspan="3"
                style="text-align: left;"
              >&nbsp;&nbsp;{{ settleInfo.bill.settleDate }}</td>
            </tr>
            <template v-if="settleType">
              <tr>
                <td class="td1 td3">企业微信审批编号</td>
                <td
                  class="td1"
                  colspan="3"
                  style="text-align: left;"
                >&nbsp;&nbsp;{{ settleInfo.bill.wxNo }}</td>
              </tr>
            </template>
            <tr class="tr1">
              <td class="td1 td3">费用名目</td>
              <td
                class="td1 td3"
                style="width: 30%"
              >金额(不含税)</td>
              <td
                class="td1 td3"
                style="width: 20%"
              >税金</td>
              <td
                class="td1 td3"
                style="width: 30%"
              >金额(含税)</td>
            </tr>
            <template v-if="settleType">
              <tr>
                <td class="td1 td3">内部计收</td>
                <td class="td1">{{ settleInfo.bill.innerMoney }}</td>
                <td class="td1">0</td>
                <td class="td1">{{ settleInfo.bill.innerMoney }}</td>
              </tr>
            </template>
            <template v-else>
              <tr class="tr1">
                <td class="td1 td3">结算合计</td>
                <td class="td1">{{ calculate.settleNotax }}</td>
                <td class="td1">{{ calculate.settleHastax }}</td>
                <td class="td1">{{ settleInfo.bill.sumSettle }}</td>
              </tr>
              <tr
                v-for="item in settleInfo.costList"
                :key="item.id"
              >
                <td class="td1">{{ item.name }}</td>
                <td class="td1">{{ item.amount }}</td>
                <td class="td1">{{ (Number(departSettlementInfo.taxType) > 116) ? 0 : formatFloat(item.amount*settleInfo.bill.tax/100) }}</td>
                <td class="td1">{{ (Number(departSettlementInfo.taxType) > 116) ? item.amount : formatFloat(item.amount+item.amount*settleInfo.bill.tax/100) }}</td>
              </tr>
              <tr class="tr1">
                <td class="td1 td3">业务收入</td>
                <td class="td1">{{ calculate.incomeNotax }}</td>
                <td class="td1">{{ calculate.incomeTax }}</td>
                <td class="td1">{{ calculate.incomeHastax }}</td>
              </tr>

              <tr class="tr1">
                <td class="td1 td3">开票金额合计</td>
                <td
                  class="td1"
                  colspan="2"
                ></td>
                <td class="td1">{{ settleInfo.bill.ticketAmount }}</td>
              </tr>
              <tr class="tr1">
                <td class="td1 td3">上期差余额</td>
                <td
                  class="td1"
                  colspan="2"
                ></td>
                <td class="td1">{{ settleInfo.bill.prePoorBalance }}</td>
              </tr>
              <tr class="tr1">
                <td class="td1 td3">本期差余额</td>
                <td
                  class="td1"
                  colspan="2"
                ></td>
                <td class="td1">{{ settleInfo.bill.currPoorBalance }}</td>
              </tr>
            </template>
            <tr class="tr1">
              <td class="td1 td3">创建人</td>
              <td class="td1">{{ settleInfo.businessMain.createUser }}</td>
              <td class="td1 td3">审核人</td>
              <td class="td1">{{ settleInfo.businessMain.auditUser }}</td>
            </tr>
            <template v-if="!settleType">
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
              <tr class="tr1" v-if="invoice.length==0">
                <td class="td1"></td><td class="td1"></td><td class="td1"></td><td class="td1"></td>
              </tr>
              <tr class="tr1">
                <td class="td1 td3">到款单位</td>
                <td class="td1 td3">到款时间</td>
                <td class="td1 td3">来款金额</td>
                <td class="td1 td3">认领金额</td>
              </tr>
              <template v-if="settleInfo.reciveList">
                <tr
                  class="tr1"
                  v-for="item in settleInfo.reciveList"
                  :key="item.id"
                >
                  <td class="td1">{{ item.reciveRecordList[0].incomeBelong }}</td>
                  <td class="td1">{{ item.releaseDate }}</td>
                  <td class="td1">{{ item.incomeFee }}</td>
                  <td class="td1">{{ item.reciveRecordList[0].reciveFee }}</td>
                </tr>
              </template>
              <tr class="tr1" v-if="settleInfo.reciveList && settleInfo.reciveList.length==0">
                <td class="td1"></td><td class="td1"></td><td class="td1"></td><td class="td1"></td>
              </tr>
              <tr>
                <td class="td1 td3" colspan="2">收入归属</td>
                <td class="td1 td3" colspan="2">分成金额/比例</td>
              </tr>
              <template v-if="settleInfo.incomeList && settleInfo.incomeList.length">
                <tr
                  v-for="item in settleInfo.incomeList"
                  :key="item.id">
                  <td class="td1" colspan="2">
                    {{ getNameFromArr(organAll,item.incomeBelong,'id','organName') }} <br/>
                    {{ getNameFromArr(organAll,item.incomeBelongSub,'id','organName') }}
                  </td>
                  <td class="td1" colspan="2">
                    {{ item.devidedProp ? (`${item.devidedProp}% / ${item.incomeAmount}元`) : item.incomeAmount }}
                  </td>
                </tr>
              </template>
            </template>
          </table>
          <!-- <div style="page-break-after:always"></div>
          <div style="font-weight: bold;color: #000;margin: 20px 0px 10px;">项目报销明细</div>
          <table class="detail" border="1px">
            <tr>
              <th style="width:100px">结算月份</th>
              <th style="width:300px">费用类型</th>
              <th style="width:100px">金额</th>
              <th style="width:100px">税金</th>
              <th style="width:100px">金额(含税)</th>
            </tr>
            <tr
              v-for="(item,index) in settleInfo.detailList"
              :key="index"
            >
              <td>{{ item.settleMonth }}</td>
              <td>{{ item.feeDesc }}</td>
              <td>{{ item.settleFee }}</td>
              <td>{{ item.tax }}</td>
              <td>{{ item.ticket }}</td>
            </tr>
          </table> -->
        </div>
      </div>
    </template>
  </a-row>
</template>

<script>
import { httpAction } from '@/api/manage'
import { getNameFromArr } from '@/utils/common'
import { getBusinessType } from '@/utils/businessType'

export default {
  data() {
    return {
      id:'',
      settleId:'',
      businessType:'',
      settleInfo:{
        bill:{},
        businessMain:{},
        costList:[],
        incomeList:[],
      },
      departSettlementInfo:{},
      organAll:[], // 组织机构数据
      invoice: [],
      url:{
        queryAllInfoById: '/hrOneTime/tnewsettle/getTNewSettleVo?businessMainId=',
        getOrgan: '/admin/organizationinfo/getOrgForCus?type=0', // 获取数组数据信息
      },
      calculate:{
        sumCost:0,  // 成本之和
        settleNotax:0, // 结算金额不含税
        settleHastax:0, // 结算金额税金
        incomeNotax:0, // 业务收入不含税
        incomeTax:0, // 业务收入税金
        incomeHastax:0, // 业务收入（含税）
      },
      settleType:0, // 0结算单1内部计收
    }
  },
  created() {
    this.id = this.$route.query.id
    this.settleId = this.$route.query.settleId
    this.loadOrgans()
    this.fetchData()
  },
  methods: {
    getNameFromArr,
    async fetchData() {
      const _this = this
      _this.businessType = await getBusinessType(_this.settleId)
      httpAction(_this.url.queryAllInfoById + _this.id, {}, 'post', 1000 * 60 * 5).then((res) => {
        if (Number(res.code) === 200 && res.data) {
          _this.settleInfo = res.data
          _this.settleType = res.data.bill.wxNo ? 1 : 0
          if(_this.settleType){
            _this.$nextTick(() => {
              window.print()
            })
            return
          }
          httpAction(`/hrBase/tsettledomain/vo/${res.data.businessMain.settleDomainId}`,null,'get').then(result=>{
            if(result.code === 200){
              _this.departSettlementInfo = result.data.departSettlementInfo

              this.calculate.sumCost = 0
              this.settleInfo.costList.forEach(item=>{
                this.calculate.sumCost += item.amount
              })
              // 计算金额税金
              if(Number(_this.departSettlementInfo.taxType) > 116){
                _this.calculate.settleNotax = _this.formatFloat((_this.settleInfo.bill.sumSettle - _this.calculate.sumCost)/(1+_this.settleInfo.bill.tax/100) + this.calculate.sumCost)
                _this.calculate.settleHastax = _this.formatFloat((_this.settleInfo.bill.sumSettle-_this.calculate.sumCost)/(1+_this.settleInfo.bill.tax/100)*_this.settleInfo.bill.tax/100)
                _this.calculate.incomeHastax = _this.formatFloat(_this.settleInfo.bill.sumSettle-_this.calculate.sumCost)
                _this.calculate.incomeNotax = _this.formatFloat(_this.calculate.incomeHastax/(1+_this.settleInfo.bill.tax/100))
                _this.calculate.incomeTax = _this.formatFloat(_this.calculate.incomeNotax*_this.settleInfo.bill.tax/100)
              }else{
                _this.calculate.settleNotax = _this.formatFloat(_this.settleInfo.bill.sumSettle/(1+_this.settleInfo.bill.tax/100))
                _this.calculate.settleHastax = _this.formatFloat(_this.calculate.settleNotax*_this.settleInfo.bill.tax/100)
                _this.calculate.incomeNotax = _this.formatFloat(_this.calculate.settleNotax - _this.calculate.sumCost)
                _this.calculate.incomeTax = _this.formatFloat(_this.calculate.incomeNotax*_this.settleInfo.bill.tax/100)
                _this.calculate.incomeHastax = _this.formatFloat(_this.calculate.incomeNotax+_this.calculate.incomeTax)
              }
              httpAction(`/salary/tinvoice/openOneTimeInvoiceBySettleBillId?settleBillId=${res.data.bill.id}&settleFormType=4`,null,'get').then(ress=>{
                if(ress.code === 200){
                  _this.invoice = ress.data
                }
              }).finally(()=>{
                _this.$nextTick(() => {
                  window.print()
                })
              })
            }
          })
        } else {
          _this.$message.error('数据请求失败！')
        }
      })
    },
    // 获取收入归属的名称数据
    loadOrgans() {
      httpAction(this.url.getOrgan,'','GET').then((res) => {
        if(res.code === 200 && res.data) {
          this.organAll = res.data
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
  width: 1000px;
  background: #fff;
}
.detail th,.detail td{
  text-align: center;
}
.table1,.detail{
  border: 2px solid #333;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 20px;
  line-height: 30px;
  font-size: 12px;
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
  height: 25px;
}
.cover .td1 {
  height: 25px;
}
.prindfContentBody {
  padding: 20px 20px 20px 20px;
  // border: 1px solid;
  // -webkit-box-shadow: 0 0 1px 1px #aaa, 3px 0 5px 0 #aaa, 0 4px 7px 0 #aaa;
  // box-shadow: 0 0 1px 1px #aaa, 3px 0 5px 0 #aaa, 0 4px 7px 0 #aaa;
}
</style>

<style media="print">
@page {
  size: landscape; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>
