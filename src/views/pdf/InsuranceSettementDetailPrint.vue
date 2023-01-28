<template>
  <div>

    <div id="content">
      <a-row>
        <a-col
          :span="18"
          :offset="3"
          style="padding-top:70px;"
        >
          <a-card
            title="客户结算单"
            :bordered="false"
            :headStyle="{'text-align':'center','border':'none','marginTop':'50px'}"
          >
            <a-row>
              <a-col :span="16">
                <p>部门编码：{{ info.insuranceBill.departNo }}</p>
                <p>结算主体：{{ info.insuranceBill.departName }}</p>
                <p>结算时间：{{ info.insuranceBill.settlementDate }}</p>
              </a-col>
              <a-col :span="8">
                <span>皖信盖章：</span>
              </a-col>
            </a-row>

            <div class="tabDiv">
              <h2 class="center">{{ info.insuranceBill.departName }}-{{ info.insuranceBill.settlementDate }} 结算单</h2>
              <table
                border="1"
                class="settlement"
              >
                <tr>
                  <td class="tdbg">结算主体</td>
                  <td>{{ info.insuranceBill.departName }}</td>
                  <td class="tdbg">皖信盖章</td>
                  <td colspan="2"> </td>
                </tr>
                <tr>
                  <td class="tdbg">客户单位</td>
                  <td colspan="4">{{ info.customerName }}</td>
                </tr>
                <tr>
                  <td class="tdbg">结算日期</td>
                  <td colspan="4">{{ info.insuranceBill.settlementDate }}</td>
                </tr>
                <tr>
                  <td class="tdbg">费用项目</td>
                  <td class="tdbg">金额</td>
                  <td class="tdbg">增值税</td>
                  <td class="tdbg" colspan="2">开票额小计</td>
                </tr>
                <tr>
                  <td class="tdbg">商险</td>
                  <td>{{ info.insuranceBill.insuranceAmount }}</td>
                  <td>{{ info.insuranceBill.incrementTaxFee }}</td>
                  <td colspan="2">{{ info.insuranceBill.takingRisksTicket }}</td>
                </tr>
                <tr>
                  <td class="tdbg">人数</td>
                  <td>{{ info.insuranceBill.peopleNum }}</td>
                  <td></td>
                  <td colspan="2"></td>
                </tr>
                <tr>
                  <td class="tdbg">人次</td>
                  <td>{{ info.insuranceBill.people }}</td>
                  <td></td>
                  <td colspan="2"></td>
                </tr>
                <tr>
                  <td class="tdbg">管理费</td>
                  <td>{{ info.insuranceBill.managementFee }}</td>
                  <td>{{ info.insuranceBill.managementTaxFee }}</td>
                  <td colspan="2">{{ info.insuranceBill.managementMoneyTicket }}</td>
                </tr>
                <tr>
                  <td class="tdbg">差余额</td>
                  <td>{{ info.insuranceBill.forecastBalance || 0 }}</td>
                  <td>{{ info.insuranceBill.forecastBalanceTax || 0 }}</td>
                  <td colspan="2">{{ info.insuranceBill.forecastBalanceTicket || 0 }}</td>
                </tr>
                <tr>
                  <td
                    colspan="2"
                    class="tdbg"
                  >结算金额合计</td>
                  <td>{{ info.insuranceBill.incrementTaxSum }}</td>
                  <td colspan="2">{{ info.insuranceBill.settlementAmountSum }}</td>
                </tr>
                <tr>
                  <td
                    colspan="3"
                    class="tdbg"
                  >开票金额合计</td>
                  <td colspan="2">{{ info.insuranceBill.ticketAmountSum }}</td>
                </tr>
                <tr>
                  <td class="tdbg">审核人</td>
                  <td></td>
                  <td class="tdbg">制表人</td>
                  <td colspan="2">{{ info.insuranceBill.createUser }}</td>
                </tr>
                <tr>
                  <td class="tdbg">备注</td>
                  <td colspan="4">{{ info.remark }}</td>
                </tr>
                <tr>
                  <td class="tdbg">到款单位</td>
                  <td class="tdbg">到款时间</td>
                  <td class="tdbg">到款金额</td>
                  <td class="tdbg">认领金额</td>
                  <td class="tdbg">匹配金额</td>
                </tr>
                <tr v-for="(item,index) in info.reciveList" :key="index">
                  <td class="tdbg2" >{{ item['incomeBelong'] }}</td>
                  <td class="tdbg2">{{ item['incomeDate'].slice(0,-9) }}</td>
                  <td class="tdbg2">{{ item['incomeFee'] }}</td>
                  <td class="tdbg2">{{ getReciveFee(item['reciveRecordList'],'reciveFee') }}</td>
                  <td class="tdbg2">{{ getReciveFee(item['reciveRecordList'],'matchingAmount') }}</td>
                </tr>
              </table>
            </div>

          </a-card>
        </a-col>
      </a-row>
      <div
        v-for="(item,index) in info.insuranceSettlementCover"
        :key="index">
        <div style="page-break-before:always"></div>
        <a-row
          style="padding-top:70px;"
        >
          <a-col
            :span="22"
            :offset="1"
          >
            <h3 class="center">{{ item.tableHead }}</h3>
            <h2 class="center">银行转账审批单</h2>
            <table
              class="cover"
              border="1"
            >
              <tr>
                <td colspan="2"></td>
                <td colspan="2">{{ moment(item.lssueTime).format('YYYY年MM月DD日') }}</td>
                <td class="bold">部门编码</td>
                <td>{{ item.departNo }}</td>
                <td
                  rowspan="5"
                  width="8"
                  style="padding:0px 5px;border:none;"
                >附件 {{ info.insuranceSettlementCover.length }} 张</td>
              </tr>
              <tr>
                <td colspan="2">
                  <p class="bold">客户单位</p>
                  <p>{{ item.customerName }}</p>
                </td>
                <td colspan="2">
                  <p class="bold">项目</p>
                  <p>{{ item.itemName }}</p>
                </td>
                <td width="100">
                  <p class="bold">付款方式</p>
                  <p>{{ filterDictText(payTypeOptions,item.payType) }}</p>
                </td>
                <td>
                  <p class="bold">金额</p>
                  <p>¥{{ item.amount }}</p>
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="bold"
                >合计人民币：</td>
                <td colspan="3">{{ item.amountRmb }}</td>
                <td>¥{{ item.amount }}</td>
              </tr>
              <tr>
                <td
                  width="120"
                  class="bold"
                >收款单位名称</td>
                <td>
                  {{ item.receiptName }}
                </td>
                <td
                  width="60"
                  class="bold"
                >账号</td>
                <td>
                  {{ item.receiptBankNo }}
                </td>
                <td class="bold">开户行</td>
                <td>
                  {{ item.receiptBankName }}
                </td>
              </tr>
              <tr>
                <td colspan="6">
                  <span class="bold">备注</span>：{{ item.remark }}
                </td>
              </tr>
            </table>
            <a-row style="font-size:12px;">
              <a-col :span="3">公司领导：</a-col>
              <a-col :span="3">财务负责人：</a-col>
              <a-col :span="5">网银审核授权人：</a-col>
              <a-col :span="5">网银转账提交人：</a-col>
              <a-col :span="4">数据审核：</a-col>
              <a-col :span="3">制表人：{{ item.createUser }}</a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <div style="page-break-before:always"></div>
      <a-col
        :span="24"
        style="padding-top:40px;"
      >
        <a-card
          title="商险详情"
          :bordered="false"
          :headStyle="{'text-align':'center','border':'none'}"
        >
          <a-table
            ref="table"
            size="small"
            bordered
            rowKey="id"
            :columns="columns"
            :pagination="false"
            :dataSource="info.businessInsuranceVos||[]"
            class="sxtable"
          >
          </a-table>
        </a-card>
        <a-card
          title="商险差额明细"
          :bordered="false"
          :headStyle="{'text-align':'center','border':'none'}"
        >
          <a-table
            ref="table"
            size="small"
            bordered
            rowKey="id"
            :columns="forcastColumns"
            :pagination="false"
            :dataSource="info.forcastBusinessInsuranceVos||[]"
            class="sxtable"
          >
          </a-table>
        </a-card>
      </a-col>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
import { httpAction } from '@/api/manage'

export default {
  name:'InsuranceSettementDetailPrint',
  data() {
    return {
      info:{
        insuranceBill:{}
      },
      payTypeOptions:[], // 付款方式
      settleTypeOptions:[],
      isRecived:false,
      url:'/busiInsurance/tinsurancesettlementform/getVo/',
      columns:[
        {
          title: '部门编码',
          align: 'center',
          width:'9%',
          dataIndex: 'settlementOrganNo',
        },
        {
          title: '结算主体',
          align: 'center',
          width:'9%',
          dataIndex: 'settlementOrganName',
        },
        {
          title: '姓名',
          align: 'center',
          width:'9%',
          dataIndex: 'empName'
        },
        {
          title: '身份证号',
          align: 'center',
          width:'9%',
          dataIndex: 'empIdcardNo'
        },
        {
          title: '发票号',
          align: 'center',
          width:'9%',
          dataIndex: 'invoiceNo'
        },
        {
          title: '险种',
          align: 'center',
          width:'9%',
          dataIndex: 'insuranceTypeName'
        },
        {
          title: '保险公司',
          align: 'center',
          width:'9%',
          dataIndex: 'insuranceCompanyName'
        },
        {
          title: '保单号',
          align: 'center',
          width:'9%',
          dataIndex: 'policyNo'
        },
        {
          title: '保单起止时间',
          width:'9%',
          align: 'center',
          dataIndex: 'policyStart',
          customRender:(text,record)=>{
            return text + '~' + record.policyEnd
          }
        },
        {
          title: '购买标准',
          align: 'center',
          dataIndex: 'buyStandard'
        },
        {
          title: '实际保费',
          align: 'center',
          dataIndex: 'buyPay'
        },
        {
          title: '医保',
          align: 'center',
          dataIndex: 'medicalMoney'
        },
        {
          title: '身故或残疾',
          align: 'center',
          dataIndex: 'deathDisabilityMoney'
        },
      ],
      forcastColumns:[
        {
          title: '结算主体编码',
          align: 'center',
          width:'6.6%',
          dataIndex: 'settlementOrganNo'
        },
        {
          title: '结算类型',
          align: 'center',
          width:'6.6%',
          dataIndex: 'settleType',
          customRender: (text) => {
            return filterDictText(this.settleTypeOptions,text)
          }
        },
        {
          title: '结算主体',
          align: 'center',
          width:'6.6%',
          dataIndex: 'settlementOrganName'
        },
        {
          title: '姓名',
          align: 'center',
          width:'6.6%',
          dataIndex: 'empName'
        },
        {
          title: '身份证号码',
          align: 'center',
          width:'6.6%',
          dataIndex: 'empIdcardNo'
        },
        {
          title: '险种',
          align: 'center',
          width:'6.6%',
          dataIndex: 'insuranceTypeName'
        },
        {
          title: '保单起止时间',
          align: 'center',
          width:'6.6%',
          dataIndex: 'policyStart',
          customRender:(text,record)=>{
            return `${text}~${record.policyEnd}`
          }
        },
        {
          title: '保单号',
          align: 'center',
          width:'6.6%',
          dataIndex: 'policyNo'
        },
        {
          title: '购买标准',
          align: 'center',
          width:'6.6%',
          dataIndex: 'buyStandard'
        },
        {
          title: '实际保费',
          align: 'center',
          width:'6.6%',
          dataIndex: 'buyPay'
        },
        {
          title: '预估保费',
          align: 'center',
          width:'6.6%',
          dataIndex: 'forecastBuyPay'
        },
        {
          title: '差额',
          align: 'center',
          width:'6.6%',
          dataIndex: 'balance'
        },
        {
          title: '医疗',
          align: 'center',
          width:'6.6%',
          dataIndex: 'medicalMoney'
        },
        {
          title: '身故或残疾',
          align: 'center',
          width:'6.6%',
          dataIndex: 'deathDisabilityMoney'
        },
        {
          title: '备注',
          width:'6.6%',
          align: 'center',
          dataIndex: 'remark'
        },

      ]
    }
  },
  created() {
    // 付款方式
    initDictOptions('insurance_payType').then((res) => {
      if (Number(res.code) === 200) {
        this.payTypeOptions = res.data
      }
    })
    //结算类型
    initDictOptions('settlementType').then((res) => {
      if (res.code === 200) {
        this.settleTypeOptions = res.data
      }
    })
    if(this.$route.query.id){ //查询详情
      httpAction(this.url+this.$route.query.id,null,'get').then((res)=>{
        if(Number(res.code) === 200){
          this.info = res.data
          if(!this.info.reciveList || !this.info.reciveList.length){
            this.info.reciveList = [{
            incomeBelong:' ',
            incomeDate:' ',
            incomeFee:' '
           }]
          }
          this.printer()
        }
      })
    }
  },
  methods: {
    moment,
    filterDictText,
    // 打印
    printer(){
      //打印
      setTimeout(function(){
        window.print()
      },1000)
    },
    getReciveFee(arr,field){
      if(!arr){
        return null;
      }
      const res = arr.map(item=>item[field]);
      return res.join(',');
    },
  }
}
</script>

<style lang="less" scoped>
#content {
  padding-bottom: 30px;
}
.settlement {
  width: 100%;
  border-collapse: collapse;
  margin: 10px auto 30px;
  font-size: 12px;
}
.cover {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.settlement tr,
.settlement .tdbg2 {
  text-align: center;
  height:21px;
  max-width: 300px;
}
.cover tr {
  height: 36px;
  border: solid #999 1px;
}
.settlement tr td,
.cover tr td {
  padding-left: 10px;
}
.settlement td.tdbg {
  background: #ddd;
  font-weight: bold;
  text-align: center;
}
.settlement td h6,
.bold {
  font-weight: bold;
}
.center {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.sxtable {
  :global(td) {
    font-size: 12px;
    padding: 0px !important;
  }
  :global(th) {
    font-size: 12px;
  }
}
</style>
<style media="print">
@page {
  size: auto; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
@media print {
  .rotate90 {
  }
}
</style>
