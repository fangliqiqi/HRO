<template>
  <a-card>
    <a-tabs>
      <a-tab-pane
        v-for="settle in settlementhFormList"
        :tab="settle.engineeringSettlementForme.settleDepartNo"
        :key="settle.engineeringSettlementForme.id"
      >
        <a-card :title="settle.engineeringSettlementForme.settleDepartNo">
          <a-card :bordered="false">
            <div class="tabDiv">
              <h2>{{ settle.engineeringSettlementForme.settleDepartName }}{{ settle.engineeringSettlementForme.settleMonth }} - 结算单</h2>
              <table class="table1">
                <tr class="tr1">
                  <td class="tit td1">结算主体</td>
                  <td class="td1">{{ settle.engineeringSettlementForme.settleDepartName }}</td>
                  <td class="tit td1">皖信盖章</td>
                  <td class="td1"></td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">结算编码名称</td>
                  <td
                    class="td1"
                    colspan="3"
                  >{{ settle.engineeringSettlementForme.settleDepartNo }}</td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">结算时间</td>
                  <td
                    class="td1"
                    colspan="3"
                  >{{ settle.engineeringSettlementForme.settleMonth }}</td>
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
                  ></td>
                  <td class="tit td1">应缴单位社保</td>
                  <td class="td1">{{ settle.engineeringSettlementForme.psocialDeduction }}</td>
                  <td class="td1"></td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">代扣个人社保</td>
                  <td class="td1">{{ settle.engineeringSettlementForme.usocialDeduction }}</td>
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
                  ></td>
                </tr>

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
              :dataSource="settle.poorBalanceInfoList"
              :pagination="false"
            >
            </a-table>
          </a-card>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
export default {
  name: 'EngineBillingSettleBatch',
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
    settlementhFormList:{
      type:Array,
      required:true
    },
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