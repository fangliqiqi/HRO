<template>
  <a-card>
    <a-tabs>
      <a-tab-pane
        v-for="settle in settlementhFormList"
        :tab="settle.settlementhForm.settleDepartNo"
        :key="settle.settlementhForm.id"
      >
        <a-card :title="settle.settlementhForm.settleDepartNo">

          <a-card :bordered="false">
            <div class="tabDiv">
              <h2>{{ settle.settlementhForm.settleDepartName }}{{ settle.settlementhForm.settleMonth }} - 结算单</h2>
              <table class="table1">
                <tr class="tr1">
                  <td class="tit td1">结算主体</td>
                  <td
                    class="td1"
                    colspan="2"
                  >{{ settle.settlementhForm.settleDepartName }}</td>
                  <td class="tit td1">皖信盖章</td>
                  <td class="td1"></td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">结算编码名称</td>
                  <td
                    class="td1"
                    colspan="4"
                  >{{ settle.settlementhForm.settleDepartNo }}</td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">结算时间</td>
                  <td
                    class="td1"
                    colspan="4"
                  >{{ settle.settlementhForm.settleMonth }}</td>
                </tr>
                <tr class="tr1">
                  <td
                    class="tit td1"
                    colspan="2"
                  >费用项目</td>
                  <td class="tit td1">金额</td>
                  <td class="tit td1">增值税</td>
                  <td class="tit td1">开票额小计</td>
                </tr>
                <tr class="tr1">
                  <td
                    class="tit td1"
                    rowspan="4"
                  >{{ settle.settlementhForm.salaryMonth }}</td>
                  <td class="tit td1">应发工资</td>
                  <td class="td1">{{ settle.settlementhForm.salarySum ? settle.settlementhForm.salarySum.toFixed(2) : settle.settlementhForm.salarySum }}</td>
                  <td class="td1">{{ settle.settlementhForm.salaryTax ? settle.settlementhForm.salaryTax.toFixed(2) : settle.settlementhForm.salaryTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.salaryTicket ? settle.settlementhForm.salaryTicket.toFixed(2) : settle.settlementhForm.salaryTicket }}</td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">实发工资(银付)</td>
                  <td class="td1">{{ settle.settlementhForm.cardPay ? settle.settlementhForm.cardPay.toFixed(2) : settle.settlementhForm.cardPay }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">实发工资(现金)</td>
                  <td class="td1">{{ settle.settlementhForm.moneyPay ? settle.settlementhForm.moneyPay.toFixed(2) : settle.settlementhForm.moneyPay }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">暂停发金额</td>
                  <td class="td1">{{ settle.settlementhForm.pausePay ? settle.settlementhForm.pausePay.toFixed(2) : settle.settlementhForm.pausePay }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr class="tr1">
                  <td
                    class="tit td1"
                    rowspan="4"
                  ></td>
                  <td class="tit td1">应缴单位社保</td>
                  <td class="td1">{{ settle.settlementhForm.unitSocial ? settle.settlementhForm.unitSocial.toFixed(2) : settle.settlementhForm.unitSocial }}</td>
                  <td class="td1">{{ settle.settlementhForm.unitSocialTax ? settle.settlementhForm.unitSocialTax.toFixed(2) : settle.settlementhForm.unitSocialTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.unitSocialTicket ? settle.settlementhForm.unitSocialTicket.toFixed(2) : settle.settlementhForm.unitSocialTicket }}</td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">应缴个人社保</td>
                  <td class="td1">{{ settle.settlementhForm.personalSocial ? settle.settlementhForm.personalSocial.toFixed(2) : settle.settlementhForm.personalSocial }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">没工资员工单位社保</td>
                  <td class="td1">{{ settle.settlementhForm.noSalaryUnitSocial ? settle.settlementhForm.noSalaryUnitSocial.toFixed(2) : settle.settlementhForm.noSalaryUnitSocial }}</td>
                  <td class="td1">{{ settle.settlementhForm.noSalaryUnitSocialTax ? settle.settlementhForm.noSalaryUnitSocialTax.toFixed(2) : settle.settlementhForm.noSalaryUnitSocialTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.noSalaryUnitSocialTicket ? settle.settlementhForm.noSalaryUnitSocialTicket.toFixed(2) : settle.settlementhForm.noSalaryUnitSocialTicket }}</td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">没工资员工个人社保</td>
                  <td class="td1">{{ settle.settlementhForm.noSalaryPersonSocial ? settle.settlementhForm.noSalaryPersonSocial.toFixed(2) : settle.settlementhForm.noSalaryPersonSocial }}</td>
                  <td class="td1">{{ settle.settlementhForm.noSalaryPersonSocialTax ? settle.settlementhForm.noSalaryPersonSocialTax.toFixed(2) : settle.settlementhForm.noSalaryPersonSocialTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.noSalaryPersonSocialTicket ? settle.settlementhForm.noSalaryPersonSocialTicket.toFixed(2) : settle.settlementhForm.noSalaryPersonSocialTicket }}</td>
                </tr>
                <tr class="tr1">
                  <td
                    class="tit td1"
                    rowspan="4"
                  ></td>
                  <td class="tit td1">应缴单位公积金</td>
                  <td class="td1">{{ settle.settlementhForm.unitFund ? settle.settlementhForm.unitFund.toFixed(2) : settle.settlementhForm.unitFund }}</td>
                  <td class="td1">{{ settle.settlementhForm.unitFundTax ? settle.settlementhForm.unitFundTax.toFixed(2) : settle.settlementhForm.unitFundTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.unitFundTicket ? settle.settlementhForm.unitFundTicket.toFixed(2) : settle.settlementhForm.unitFundTicket }}</td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">应缴个人公积金</td>
                  <td class="td1">{{ settle.settlementhForm.personalFund ? settle.settlementhForm.personalFund.toFixed(2) : settle.settlementhForm.personalFund }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">没工资员工单位公积金</td>
                  <td class="td1">{{ settle.settlementhForm.noSalaryUnitFund ? settle.settlementhForm.noSalaryUnitFund.toFixed(2) : settle.settlementhForm.noSalaryUnitFund }}</td>
                  <td class="td1">{{ settle.settlementhForm.noSalaryUnitFundTax ? settle.settlementhForm.noSalaryUnitFundTax.toFixed(2) : settle.settlementhForm.noSalaryUnitFundTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.noSalaryUnitFundTicket ? settle.settlementhForm.noSalaryUnitFundTicket.toFixed(2) : settle.settlementhForm.noSalaryUnitFundTicket }}</td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">没工资员工个人公积金</td>
                  <td class="td1">{{ settle.settlementhForm.noSalaryPersonalFund ? settle.settlementhForm.noSalaryPersonalFund.toFixed(2) : settle.settlementhForm.noSalaryPersonalFund }}</td>
                  <td class="td1">{{ settle.settlementhForm.noSalaryPersonalFundTax ? settle.settlementhForm.noSalaryPersonalFundTax.toFixed(2) : settle.settlementhForm.noSalaryPersonalFundTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.noSalaryPersonalFundTicket ? settle.settlementhForm.noSalaryPersonalFundTicket.toFixed(2) : settle.settlementhForm.noSalaryPersonalFundTicket }}</td>
                </tr>
                <tr class="tr1">
                  <td
                    class="tit td1"
                    colspan="2"
                  >代扣当月个人税</td>
                  <td class="td1">{{ settle.settlementhForm.personalCurmonthTax ? settle.settlementhForm.personalCurmonthTax.toFixed(2) : settle.settlementhForm.personalCurmonthTax }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.personalYearTax > 0"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >代扣个人年终奖税</td>
                  <td class="td1">{{ settle.settlementhForm.personalYearTax ? settle.settlementhForm.personalYearTax.toFixed(2) : settle.settlementhForm.personalYearTax }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.withholidingPersonSocial != 0"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >代扣个人社保</td>
                  <td class="td1">{{ settle.settlementhForm.withholidingPersonSocial ? settle.settlementhForm.withholidingPersonSocial.toFixed(2) : settle.settlementhForm.withholidingPersonSocial }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.withholidingPersonFund != 0"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >代扣个人公积金</td>
                  <td class="td1">{{ settle.settlementhForm.withholidingPersonFund ? settle.settlementhForm.withholidingPersonFund.toFixed(2) : settle.settlementhForm.withholidingPersonFund }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.withholidingUnitSocial != 0"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >代扣单位社保</td>
                  <td class="td1">{{ settle.settlementhForm.withholidingUnitSocial ? settle.settlementhForm.withholidingUnitSocial.toFixed(2) : settle.settlementhForm.withholidingUnitSocial }}</td>
                  <td class="td1">{{ settle.settlementhForm.withholidingUnitSocialTax ? settle.settlementhForm.withholidingUnitSocialTax.toFixed(2) : settle.settlementhForm.withholidingUnitSocialTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.withholidingUnitSocialTicket ? settle.settlementhForm.withholidingUnitSocialTicket.toFixed(2) : settle.settlementhForm.withholidingUnitSocialTicket }}</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.withholidingUnitFund != 0"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >代扣单位公积金</td>
                  <td class="td1">{{ settle.settlementhForm.withholidingUnitFund ? settle.settlementhForm.withholidingUnitFund.toFixed(2) : settle.settlementhForm.withholidingUnitFund }}</td>
                  <td class="td1">{{ settle.settlementhForm.withholidingUnitFundTax ? settle.settlementhForm.withholidingUnitFundTax.toFixed(2) : settle.settlementhForm.withholidingUnitFundTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.withholidingUnitFundTicket ? settle.settlementhForm.withholidingUnitFundTicket.toFixed(2) : settle.settlementhForm.withholidingUnitFundTicket }}</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.takingRisks != 0"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >商险金额</td>
                  <td class="td1">{{ settle.settlementhForm.takingRisks ? settle.settlementhForm.takingRisks.toFixed(2) : settle.settlementhForm.takingRisks }}</td>
                  <td class="td1">{{ settle.settlementhForm.takingRisksTax ? settle.settlementhForm.takingRisksTax.toFixed(2) : settle.settlementhForm.takingRisksTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.takingRisksTicket ? settle.settlementhForm.takingRisksTicket.toFixed(2) : settle.settlementhForm.takingRisksTicket }}</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.riskFundDy != 0"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >风险抵押金</td>
                  <td class="td1">{{ settle.settlementhForm.riskFundDy ? settle.settlementhForm.riskFundDy.toFixed(2) : settle.settlementhForm.riskFundDy }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.deductPersonal"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >代扣个人费用</td>
                  <td class="td1">{{ settle.settlementhForm.deductPersonal ? settle.settlementhForm.deductPersonal.toFixed(2) : settle.settlementhForm.deductPersonal }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.deductUnit"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >代扣单位费用</td>
                  <td class="td1">{{ settle.settlementhForm.deductUnit ? settle.settlementhForm.deductUnit.toFixed(2) : settle.settlementhForm.deductUnit }}</td>
                  <td class="td1">{{ settle.settlementhForm.deductUnitTax ? settle.settlementhForm.deductUnitTax.toFixed(2) : settle.settlementhForm.deductUnitTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.deductUnitTicket ? settle.settlementhForm.deductUnitTicket.toFixed(2) : settle.settlementhForm.deductUnitTicket }}</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.otherDbMoney"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >其它代办费2</td>
                  <td class="td1">{{ settle.settlementhForm.otherDbMoney ? settle.settlementhForm.otherDbMoney.toFixed(2) : settle.settlementhForm.otherDbMoney }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.unitSupplement"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >单位待补足</td>
                  <td class="td1">{{ settle.settlementhForm.unitSupplement ? settle.settlementhForm.unitSupplement.toFixed(2) : settle.settlementhForm.unitSupplement }}</td>
                  <td class="td1">{{ settle.settlementhForm.unitSupplementTax ? settle.settlementhForm.unitSupplementTax.toFixed(2) : settle.settlementhForm.unitSupplementTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.unitSupplementTicket ? settle.settlementhForm.unitSupplementTicket.toFixed(2) : settle.settlementhForm.unitSupplementTicket }}</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.persoanSupplement"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >个人待补足</td>
                  <td class="td1">{{ settle.settlementhForm.persoanSupplement ? settle.settlementhForm.persoanSupplement.toFixed(2) : settle.settlementhForm.persoanSupplement }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.personalDebt"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >个人社保、公积金欠款</td>
                  <td class="td1">{{ settle.settlementhForm.personalDebt ? settle.settlementhForm.personalDebt.toFixed(2) : settle.settlementhForm.personalDebt }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.personalOtherMoney"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >个人其他费用 </td>
                  <td class="td1">{{ settle.settlementhForm.personalOtherMoney ? settle.settlementhForm.personalOtherMoney.toFixed(2) : settle.settlementhForm.personalOtherMoney }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.prevPersoanSupplement"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >前次个人待补足 </td>
                  <td class="td1">{{ settle.settlementhForm.prevPersoanSupplement ? settle.settlementhForm.prevPersoanSupplement.toFixed(2) : settle.settlementhForm.prevPersoanSupplement }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.unitBack"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >单位返还</td>
                  <td class="td1">{{ settle.settlementhForm.unitBack ? settle.settlementhForm.unitBack.toFixed(2) : settle.settlementhForm.unitBack }}</td>
                  <td class="td1">{{ settle.settlementhForm.unitBackTax ? settle.settlementhForm.unitBackTax.toFixed(2) : settle.settlementhForm.unitBackTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.unitBackTicket ? settle.settlementhForm.unitBackTicket.toFixed(2) : settle.settlementhForm.unitBackTicket }}</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.unitSocialCard"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >单位社保卡费 </td>
                  <td class="td1">{{ settle.settlementhForm.unitSocialCard ? settle.settlementhForm.unitSocialCard.toFixed(2) : settle.settlementhForm.unitSocialCard }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.exemptionPersionTax"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >免个税个人代扣 </td>
                  <td class="td1">{{ settle.settlementhForm.exemptionPersionTax ? settle.settlementhForm.exemptionPersionTax.toFixed(2) : settle.settlementhForm.exemptionPersionTax }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.enterpriseAnnuity"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >企业（职业）年金 </td>
                  <td class="td1">{{ settle.settlementhForm.enterpriseAnnuity ? settle.settlementhForm.enterpriseAnnuity.toFixed(2) : settle.settlementhForm.enterpriseAnnuity }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  class="tr1"
                  v-if="settle.settlementhForm.onlyChild"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >独生子女费 </td>
                  <td class="td1">{{ settle.settlementhForm.onlyChild ? settle.settlementhForm.onlyChild.toFixed(2) : settle.settlementhForm.onlyChild }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr
                  v-for="(item, index) in settle.settlementhFormSubList"
                  :key="index"
                  class="tr1"
                >
                  <td
                    class="tit td1"
                    colspan="2"
                  >{{ getItemName(item.itemTypeName,item.subName) }}
                  </td>
                  <td class="td1">{{ item.money ? item.money : item.money }}</td>
                  <td class="td1">{{ item.tax ? item.tax : item.tax }}</td>
                  <td class="td1">{{ item.ticket ? item.ticket : item.ticket }}</td>
                </tr>
                <tr class="tr1">
                  <td
                    class="tit td1"
                    colspan="2"
                  >风险金</td>
                  <td class="td1">{{ settle.settlementhForm.riskFund ? settle.settlementhForm.riskFund.toFixed(2) : settle.settlementhForm.riskFund }}</td>
                  <td class="td1">{{ settle.settlementhForm.riskFundTax ? settle.settlementhForm.riskFundTax.toFixed(2) : settle.settlementhForm.riskFundTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.riskFundTicket ? settle.settlementhForm.riskFundTicket.toFixed(2) : settle.settlementhForm.riskFundTicket }}</td>
                </tr>
                <tr class="tr1">
                  <td
                    class="tit td1"
                    colspan="2"
                  >人数</td>
                  <td class="td1">{{ settle.settlementhForm.personNum }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr class="tr1">
                  <td
                    class="tit td1"
                    colspan="2"
                  >人次</td>
                  <td class="td1">{{ settle.settlementhForm.personTime }}</td>
                  <td class="td1">-</td>
                  <td class="td1">-</td>
                </tr>
                <tr class="tr1">
                  <td
                    class="tit td1"
                    colspan="2"
                  >管理费</td>
                  <td class="td1">{{ settle.settlementhForm.managementMoney ? settle.settlementhForm.managementMoney : settle.settlementhForm.managementMoney }}</td>
                  <td class="td1">{{ settle.settlementhForm.managementMoneyTax ? settle.settlementhForm.managementMoneyTax : settle.settlementhForm.managementMoneyTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.managementMoneyTicket ? settle.settlementhForm.managementMoneyTicket : settle.settlementhForm.managementMoneyTicket }}</td>
                </tr>
                <tr class="tr1">
                  <td
                    class="tit td1"
                    colspan="2"
                  >管理费2</td>
                  <td class="td1">{{ settle.settlementhForm.managementMoneyTwo }}</td>
                  <td class="td1">{{ settle.settlementhForm.managementMoneyTwoTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.managementMoneyTwoTicket }}</td>
                </tr>
                <tr class="tr1">
                  <td
                    class="tit td1"
                    colspan="3"
                  >结算金额合计</td>
                  <td class="td1">{{ settle.settlementhForm.countTax ? settle.settlementhForm.countTax.toFixed(2) : settle.settlementhForm.countTax }}</td>
                  <td class="td1">{{ settle.settlementhForm.accountMoneySum ? settle.settlementhForm.accountMoneySum.toFixed(2) : settle.settlementhForm.accountMoneySum }}</td>
                </tr>
                <tr class="tr1">
                  <td
                    class="tit td1"
                    colspan="4"
                  >开票金额合计</td>
                  <td class="td1">{{ settle.settlementhForm.ticketMoneySum }}</td>
                </tr>
                <tr class="tr1">
                  <td
                    class="tit td1"
                    colspan="4"
                  >上次差余额</td>
                  <td class="td1">{{ settle.settlementhForm.prevPoorBalance }}</td>
                </tr>
                <tr class="tr1">
                  <td
                    class="tit td1"
                    colspan="4"
                  >本次差余额</td>
                  <td class="td1">{{ settle.settlementhForm.curPoorBalance }}</td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">备注</td>
                  <td
                    class="td1"
                    colspan="4"
                  >
                    {{ settle.settlementhForm.remark }}
                  </td>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">发票类型</td>
                  <td class="tit td1">扣除金额</td>
                  <td class="tit td1">不含税金额</td>
                  <td class="tit td1">税额</td>
                  <td class="tit td1">发票合计金额</td>
                </tr>
                <tr class="tr1">
                  <td class="td1">
                    {{ settle.settlementhForm.ticketType }}
                  </td>
                  <td class="td1">
                    {{ settle.settlementhForm.deductionAmount }}
                  </td>
                  <td class="td1">
                    {{ settle.settlementhForm.noTaxAmount }}
                  </td>
                  <td class="td1">
                    <span>{{ settle.settlementhForm.taxAmount }}</span>
                  </td>
                  <td class="td1">
                    <span>{{ settle.settlementhForm.ticketSumAmount }}</span>
                  </td>
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
//import { getAction } from '@/api/manage'
import { getItemName } from '@/utils/common'
export default {
  name: 'BillingSalarySettleBatch',
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
    }
  },
  props: {
    settlementhFormList:{
      type:Array,
      required:true
    },
  },
  methods: {
    getItemName
  },
}
</script>
<style scoped>
.tablePage {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  width: 100%;
}
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
}
.table1 .td2 {
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 40px;
  padding: 10px;
  width: 17%;
  text-align: center;
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
.table2 {
  text-align: center;
  display: block;
  width: 83%;
  margin: 20px auto 10px;
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