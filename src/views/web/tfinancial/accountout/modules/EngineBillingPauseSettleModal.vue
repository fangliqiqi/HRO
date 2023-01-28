<template>
  <a-card :title="settlementhFormInfo.settleDepartNo">

    <a-card :bordered="false">
      <div class="tabDiv">
        <h2>{{ settlementhFormInfo.settleDepartName }}{{ settlementhFormInfo.settleMonth }} - 结算单</h2>
        <table class="table1">
          <tr class="tr1">
            <td class="tit td1">结算主体</td>
            <td class="td1">{{ settlementhFormInfo.settleDepartName }}</td>
            <td class="tit td1">皖信盖章</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算编码名称</td>
            <td
              class="td1"
              colspan="3"
            >{{ settlementhFormInfo.settleDepartNo }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算时间</td>
            <td
              class="td1"
              colspan="3"
            >{{ settlementhFormInfo.settleMonth }}</td>
          </tr>
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
            >{{ settlementhFormInfo.salaryMonth }}</td>
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
            >{{ salaryAccountOne.deduSocialMonth }}</td>
            <td class="tit td1">应缴单位社保</td>
            <td class="td1">{{ settlementhFormInfo.psocialDeduction }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">代扣个人社保</td>
            <td class="td1">{{ settlementhFormInfo.usocialDeduction }}</td>
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
            <td class="td1">{{ settlementhFormInfo.accountMoneySum }}</td>
          </tr>
          <!-- <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >开票金额合计</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >上次差余额</td>
            <td class="td1">0.0</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >本次差余额</td>
            <td class="td1">{{ settleDeail.curPoorBalance }}</td>
          </tr> -->
          <tr class="tr1">
            <td class="tit td1">备注</td>
            <td
              class="td1"
              colspan="3"
            ></td>
          </tr>
          <!-- <tr class="tr1">
            <td class="tit td1">发票类型</td>
            <td class="tit td1">扣除金额</td>
            <td class="tit td1">不含税金额</td>
            <td class="tit td1">税额</td>
            <td class="tit td1">发票合计金额</td>
          </tr>
          <tr class="tr1">
            <td class="td1">0.0</td>
            <td class="td1">0.0</td>
            <td class="td1">0.0</td>
            <td class="td1">0.0</td>
            <td class="td1">0.0</td>
          </tr> -->
        </table>
      </div>

    </a-card>
    <a-card
      title="差余额"
      :bordered="false"
    >
      <a-table
        rowKey="id"
        :columns="balanceColumns"
        :dataSource="balanceData"
        :pagination="false"
      >
      </a-table>
    </a-card>
  </a-card>
</template>
<script>
import { getAction } from '@/api/manage'
export default {
  name: 'EngineBillingPauseSettleModal',
  data() {
    return {
      columns:[
        {
          title:'结算主体',
          dataIndex:'settleDepartName'
        },
        {
          title:'结算编码名称',
          dataIndex:'settleDepartNo',
        },
        {
          title:'结算时间',
          dataIndex:'settleMonth'
        },
        {
          title:'皖信盖章',
        }
      ],
      balanceColumns:[
        {
          title:'月份',
          dataIndex:'month'
        },
        {
          title:'姓名',
          dataIndex:'name'
        },
        {
          title:'项目',
          dataIndex:'project'
        },
        {
          title:'金额',
          dataIndex:'money'
        },
        {
          title: '原因',
          dataIndex: 'cause',
          ellipsis: true,
          width:300,
          customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        }
      ],
      withholdData:[],
      balanceData:[],
      settleDeail:{},
    }
  },
  props: {
    settlementhFormInfo:{
      type:Object,
      required:true
    },
    pauseDiyInfoList:{
      type:Array,
      required:true
    },
    poorBalanceInfoList:{
      type:Array,
      required:true
    },
    salaryAccountOne:{
      type:Object,
      required:true
    }
  },
  methods:{
    show() {
      this.settleDeail = this.settlementhFormInfo
      this.withholdData = this.pauseDiyInfoList
      this.balanceData = this.poorBalanceInfoList
      //获取所有公司数据
      getAction('/admin/organizationinfo/getOrgForCus').then((res) => {
        if(res.code == 200){
          this.orgList = res.data
        }
      })
    }
  },
  
}
</script>
<style scoped>
.table1 {
  border: 1px solid #ccc;
  width: 90%;
  border-collapse: collapse;
  border-spacing: 0;
  margin: 10px auto 30px;
}
.table1 .tr1 {
  margin: 0px;
  padding: 0;
  width: 100%;
}
.table1 .td1 {
  border: solid #999 1px;
  margin-left: 10px;
  height: 40px;
  padding: 10px;
  width: 20%;
  color: #000;
}

.table1 .tit {
  font-weight: bolder;
  background-color: #ddd;
}
.table1 .input1 {
  height: 35px;
  width: 100%;
  padding: 0 5px;
}
.table1 .btn {
  width: 20%;
  font-size: 16px;
  border: none;
  background: red;
  color: #fff;
  float: right;
}

.num {
  margin-top: 20px;
}
.tabDiv {
  box-shadow: 0 0 1px 1px #aaa, 3px 0 5px 0 #aaa, 0 4px 7px 0 #aaa;
  border: 1px solid;
  width: 100%;
  margin: 44px auto;
}
.tabDiv h2 {
  text-align: center;
  margin-top: 10px;
}
</style>