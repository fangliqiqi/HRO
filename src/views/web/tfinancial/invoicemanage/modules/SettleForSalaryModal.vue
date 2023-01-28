<template>
  <a-spin :spinning="confirmLoading">
    <a-card
      :bordered="false"
      v-if="type == 0"
    >
      <div class="tabDiv">
        <h2 id="tabledesc4">{{ settlementhFormInfo.settleDepartName }}{{ settlementhFormInfo.settleMonth }} - 结算单</h2>
        <table
          class="table1"
          aria-describedby="tabledesc4"
        >
          <tr class="tr1">
            <th
              class="tit td1"
              scope="col"
            >结算主体</th>
            <td
              class="td1"
              colspan="2"
            >{{ settlementhFormInfo.settleDepartName }}</td>
            <th
              class="tit td1"
              scope="col"
            >皖信盖章</th>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算编码名称</td>
            <td
              class="td1"
              colspan="4"
            >{{ settlementhFormInfo.settleDepartNo }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算时间</td>
            <td
              class="td1"
              colspan="4"
            >{{ settlementhFormInfo.settleMonth }}</td>
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
            >{{ settlementhFormInfo.salaryMonth }}</td>
            <td class="tit td1">应发工资</td>
            <td class="td1">{{ settlementhFormInfo.salarySum ? settlementhFormInfo.salarySum.toFixed(2) : settlementhFormInfo.salarySum }}</td>
            <td class="td1">{{ settlementhFormInfo.salaryTax ? settlementhFormInfo.salaryTax.toFixed(2) : settlementhFormInfo.salaryTax }}</td>
            <td class="td1">{{ settlementhFormInfo.salaryTicket ? settlementhFormInfo.salaryTicket.toFixed(2) : settlementhFormInfo.salaryTicket }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">实发工资(银付)</td>
            <td class="td1">{{ settlementhFormInfo.cardPay ? settlementhFormInfo.cardPay.toFixed(2) : settlementhFormInfo.cardPay }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">实发工资(现金)</td>
            <td class="td1">{{ settlementhFormInfo.moneyPay ? settlementhFormInfo.moneyPay.toFixed(2) : settlementhFormInfo.moneyPay }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">暂停发金额</td>
            <td class="td1">{{ settlementhFormInfo.pausePay ? settlementhFormInfo.pausePay.toFixed(2) : settlementhFormInfo.pausePay }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              rowspan="4"
            >{{ settlementhFormInfo.socialMonth }}</td>
            <td class="tit td1">应缴单位社保</td>
            <td class="td1">{{ settlementhFormInfo.unitSocial ? settlementhFormInfo.unitSocial.toFixed(2) : settlementhFormInfo.unitSocial }}</td>
            <td class="td1">{{ settlementhFormInfo.unitSocialTax ? settlementhFormInfo.unitSocialTax.toFixed(2) : settlementhFormInfo.unitSocialTax }}</td>
            <td class="td1">{{ settlementhFormInfo.unitSocialTicket ? settlementhFormInfo.unitSocialTicket.toFixed(2) : settlementhFormInfo.unitSocialTicket }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴个人社保</td>
            <td class="td1">{{ settlementhFormInfo.personalSocial ? settlementhFormInfo.personalSocial.toFixed(2) : settlementhFormInfo.personalSocial }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">没工资员工单位社保</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryUnitSocial ? settlementhFormInfo.noSalaryUnitSocial.toFixed(2) : settlementhFormInfo.noSalaryUnitSocial }}</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryUnitSocialTax ? settlementhFormInfo.noSalaryUnitSocialTax.toFixed(2) : settlementhFormInfo.noSalaryUnitSocialTax }}</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryUnitSocialTicket ?
              settlementhFormInfo.noSalaryUnitSocialTicket.toFixed(2) : settlementhFormInfo.noSalaryUnitSocialTicket }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">没工资员工个人社保</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryPersonSocial ? settlementhFormInfo.noSalaryPersonSocial.toFixed(2) : settlementhFormInfo.noSalaryPersonSocial }}</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryPersonSocialTax ? settlementhFormInfo.noSalaryPersonSocialTax.toFixed(2) : settlementhFormInfo.noSalaryPersonSocialTax }}</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryPersonSocialTicket ? settlementhFormInfo.noSalaryPersonSocialTicket.toFixed(2) : settlementhFormInfo.noSalaryPersonSocialTicket }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              rowspan="4"
            >{{ settlementhFormInfo.fundMonth }}</td>
            <td class="tit td1">应缴单位公积金</td>
            <td class="td1">{{ settlementhFormInfo.unitFund ? settlementhFormInfo.unitFund.toFixed(2) : settlementhFormInfo.unitFund }}</td>
            <td class="td1">{{ settlementhFormInfo.unitFundTax ? settlementhFormInfo.unitFundTax.toFixed(2) : settlementhFormInfo.unitFundTax }}</td>
            <td class="td1">{{ settlementhFormInfo.unitFundTicket ? settlementhFormInfo.unitFundTicket.toFixed(2) : settlementhFormInfo.unitFundTicket }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴个人公积金</td>
            <td class="td1">{{ settlementhFormInfo.personalFund ? settlementhFormInfo.personalFund.toFixed(2) : settlementhFormInfo.personalFund }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">没工资员工单位公积金</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryUnitFund ? settlementhFormInfo.noSalaryUnitFund.toFixed(2) : settlementhFormInfo.noSalaryUnitFund }}</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryUnitFundTax ? settlementhFormInfo.noSalaryUnitFundTax.toFixed(2) : settlementhFormInfo.noSalaryUnitFundTax }}</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryUnitFundTicket ?
              settlementhFormInfo.noSalaryUnitFundTicket.toFixed(2) : settlementhFormInfo.noSalaryUnitFundTicket }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">没工资员工个人公积金</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryPersonalFund ? settlementhFormInfo.noSalaryPersonalFund.toFixed(2) : settlementhFormInfo.noSalaryPersonalFund }}</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryPersonalFundTax ? settlementhFormInfo.noSalaryPersonalFundTax.toFixed(2) : settlementhFormInfo.noSalaryPersonalFundTax }}</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryPersonalFundTicket ? settlementhFormInfo.noSalaryPersonalFundTicket.toFixed(2) : settlementhFormInfo.noSalaryPersonalFundTicket }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >代扣当月个人税</td>
            <td class="td1">{{ settlementhFormInfo.personalCurmonthTax ? settlementhFormInfo.personalCurmonthTax.toFixed(2) : settlementhFormInfo.personalCurmonthTax }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.personalYearTax > 0"
          >
            <td
              class="tit td1"
              colspan="2"
            >代扣个人年终奖税</td>
            <td class="td1">{{ settlementhFormInfo.personalYearTax ? settlementhFormInfo.personalYearTax.toFixed(2) : settlementhFormInfo.personalYearTax }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.withholidingPersonSocial != 0"
          >
            <td
              class="tit td1"
              colspan="2"
            >代扣个人社保</td>
            <td class="td1">{{ settlementhFormInfo.withholidingPersonSocial ?
              settlementhFormInfo.withholidingPersonSocial.toFixed(2) : settlementhFormInfo.withholidingPersonSocial }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.withholidingPersonFund != 0"
          >
            <td
              class="tit td1"
              colspan="2"
            >代扣个人公积金</td>
            <td class="td1">{{ settlementhFormInfo.withholidingPersonFund ?
              settlementhFormInfo.withholidingPersonFund.toFixed(2) : settlementhFormInfo.withholidingPersonFund }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.withholidingUnitSocial != 0"
          >
            <td
              class="tit td1"
              colspan="2"
            >代扣单位社保</td>
            <td class="td1">{{ settlementhFormInfo.withholidingUnitSocial ?
              settlementhFormInfo.withholidingUnitSocial.toFixed(2) : settlementhFormInfo.withholidingUnitSocial }}</td>
            <td class="td1">{{ settlementhFormInfo.withholidingUnitSocialTax ?
              settlementhFormInfo.withholidingUnitSocialTax.toFixed(2) : settlementhFormInfo.withholidingUnitSocialTax }}</td>
            <td class="td1">{{ settlementhFormInfo.withholidingUnitSocialTicket ?
              settlementhFormInfo.withholidingUnitSocialTicket.toFixed(2) : settlementhFormInfo.withholidingUnitSocialTicket }}</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.withholidingUnitFund != 0"
          >
            <td
              class="tit td1"
              colspan="2"
            >代扣单位公积金</td>
            <td class="td1">{{ settlementhFormInfo.withholidingUnitFund ? settlementhFormInfo.withholidingUnitFund.toFixed(2) : settlementhFormInfo.withholidingUnitFund }}</td>
            <td class="td1">{{ settlementhFormInfo.withholidingUnitFundTax ?
              settlementhFormInfo.withholidingUnitFundTax.toFixed(2) : settlementhFormInfo.withholidingUnitFundTax }}</td>
            <td class="td1">{{ settlementhFormInfo.withholidingUnitFundTicket ?
              settlementhFormInfo.withholidingUnitFundTicket.toFixed(2) : settlementhFormInfo.withholidingUnitFundTicket }}</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.takingRisks != 0"
          >
            <td
              class="tit td1"
              colspan="2"
            >商险金额</td>
            <td class="td1">{{ settlementhFormInfo.takingRisks ? settlementhFormInfo.takingRisks.toFixed(2) : settlementhFormInfo.takingRisks }}</td>
            <td class="td1">{{ settlementhFormInfo.takingRisksTax ? settlementhFormInfo.takingRisksTax.toFixed(2) : settlementhFormInfo.takingRisksTax }}</td>
            <td class="td1">{{ settlementhFormInfo.takingRisksTicket ? settlementhFormInfo.takingRisksTicket.toFixed(2) : settlementhFormInfo.takingRisksTicket }}</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.takingBalance != 0"
          >
            <td
              class="tit td1"
              colspan="2"
            >商险差额</td>
            <td class="td1">{{ settlementhFormInfo.takingBalance ? settlementhFormInfo.takingBalance.toFixed(2) : settlementhFormInfo.takingBalance }}</td>
            <td class="td1">{{ settlementhFormInfo.takingBalanceTax ? settlementhFormInfo.takingBalanceTax.toFixed(2) : settlementhFormInfo.takingBalanceTax }}</td>
            <td class="td1">{{ settlementhFormInfo.takingBalanceTicket ? settlementhFormInfo.takingBalanceTicket.toFixed(2) : settlementhFormInfo.takingBalanceTicket }}</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.riskFundDy != 0"
          >
            <td
              class="tit td1"
              colspan="2"
            >风险抵押金</td>
            <td class="td1">{{ settlementhFormInfo.riskFundDy ? settlementhFormInfo.riskFundDy.toFixed(2) : settlementhFormInfo.riskFundDy }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.deductPersonal"
          >
            <td
              class="tit td1"
              colspan="2"
            >代扣个人费用</td>
            <td class="td1">{{ settlementhFormInfo.deductPersonal ? settlementhFormInfo.deductPersonal.toFixed(2) : settlementhFormInfo.deductPersonal }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.deductUnit"
          >
            <td
              class="tit td1"
              colspan="2"
            >代扣单位费用</td>
            <td class="td1">{{ settlementhFormInfo.deductUnit ? settlementhFormInfo.deductUnit.toFixed(2) : settlementhFormInfo.deductUnit }}</td>
            <td class="td1">{{ settlementhFormInfo.deductUnitTax ? settlementhFormInfo.deductUnitTax.toFixed(2) : settlementhFormInfo.deductUnitTax }}</td>
            <td class="td1">{{ settlementhFormInfo.deductUnitTicket ? settlementhFormInfo.deductUnitTicket.toFixed(2) : settlementhFormInfo.deductUnitTicket }}</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.otherDbMoney"
          >
            <td
              class="tit td1"
              colspan="2"
            >其它代办费2</td>
            <td class="td1">{{ settlementhFormInfo.otherDbMoney ? settlementhFormInfo.otherDbMoney.toFixed(2) : settlementhFormInfo.otherDbMoney }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.unitSupplement"
          >
            <td
              class="tit td1"
              colspan="2"
            >单位待补足</td>
            <td class="td1">{{ settlementhFormInfo.unitSupplement ? settlementhFormInfo.unitSupplement.toFixed(2) : settlementhFormInfo.unitSupplement }}</td>
            <td class="td1">{{ settlementhFormInfo.unitSupplementTax ? settlementhFormInfo.unitSupplementTax.toFixed(2) : settlementhFormInfo.unitSupplementTax }}</td>
            <td class="td1">{{ settlementhFormInfo.unitSupplementTicket ? settlementhFormInfo.unitSupplementTicket.toFixed(2) : settlementhFormInfo.unitSupplementTicket }}</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.persoanSupplement"
          >
            <td
              class="tit td1"
              colspan="2"
            >个人待补足</td>
            <td class="td1">{{ settlementhFormInfo.persoanSupplement ? settlementhFormInfo.persoanSupplement.toFixed(2) : settlementhFormInfo.persoanSupplement }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.personalDebt"
          >
            <td
              class="tit td1"
              colspan="2"
            >个人社保、公积金欠款</td>
            <td class="td1">{{ settlementhFormInfo.personalDebt ? settlementhFormInfo.personalDebt.toFixed(2) : settlementhFormInfo.personalDebt }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.personalOtherMoney"
          >
            <td
              class="tit td1"
              colspan="2"
            >个人其他费用 </td>
            <td class="td1">{{ settlementhFormInfo.personalOtherMoney ? settlementhFormInfo.personalOtherMoney.toFixed(2) : settlementhFormInfo.personalOtherMoney }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.prevPersoanSupplement"
          >
            <td
              class="tit td1"
              colspan="2"
            >前次个人待补足 </td>
            <td class="td1">{{ settlementhFormInfo.prevPersoanSupplement ? settlementhFormInfo.prevPersoanSupplement.toFixed(2) : settlementhFormInfo.prevPersoanSupplement }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.unitBack"
          >
            <td
              class="tit td1"
              colspan="2"
            >单位返还</td>
            <td class="td1">{{ settlementhFormInfo.unitBack ? settlementhFormInfo.unitBack.toFixed(2) : settlementhFormInfo.unitBack }}</td>
            <td class="td1">{{ settlementhFormInfo.unitBackTax ? settlementhFormInfo.unitBackTax.toFixed(2) : settlementhFormInfo.unitBackTax }}</td>
            <td class="td1">{{ settlementhFormInfo.unitBackTicket ? settlementhFormInfo.unitBackTicket.toFixed(2) : settlementhFormInfo.unitBackTicket }}</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.unitSocialCard"
          >
            <td
              class="tit td1"
              colspan="2"
            >单位社保卡费 </td>
            <td class="td1">{{ settlementhFormInfo.unitSocialCard ? settlementhFormInfo.unitSocialCard.toFixed(2) : settlementhFormInfo.unitSocialCard }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.exemptionPersionTax"
          >
            <td
              class="tit td1"
              colspan="2"
            >免个税个人代扣 </td>
            <td class="td1">{{ settlementhFormInfo.exemptionPersionTax ? settlementhFormInfo.exemptionPersionTax.toFixed(2) : settlementhFormInfo.exemptionPersionTax }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.enterpriseAnnuity"
          >
            <td
              class="tit td1"
              colspan="2"
            >企业（职业）年金 </td>
            <td class="td1">{{ settlementhFormInfo.enterpriseAnnuity ? settlementhFormInfo.enterpriseAnnuity.toFixed(2) : settlementhFormInfo.enterpriseAnnuity }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            class="tr1"
            v-if="settlementhFormInfo.onlyChild"
          >
            <td
              class="tit td1"
              colspan="2"
            >独生子女费 </td>
            <td class="td1">{{ settlementhFormInfo.onlyChild ? settlementhFormInfo.onlyChild.toFixed(2) : settlementhFormInfo.onlyChild }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr
            v-for="(item, index) in settlementhFormSubList"
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
            <td class="td1">{{ settlementhFormInfo.riskFund ? settlementhFormInfo.riskFund.toFixed(2) : settlementhFormInfo.riskFund }}</td>
            <td class="td1">{{ settlementhFormInfo.riskFundTax ? settlementhFormInfo.riskFundTax.toFixed(2) : settlementhFormInfo.riskFundTax }}</td>
            <td class="td1">{{ settlementhFormInfo.riskFundTicket ? settlementhFormInfo.riskFundTicket.toFixed(2) : settlementhFormInfo.riskFundTicket }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >人数</td>
            <td class="td1">{{ settlementhFormInfo.personNum }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >人次</td>
            <td class="td1">{{ settlementhFormInfo.personTime }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >管理费</td>
            <td class="td1">{{ settlementhFormInfo.managementMoney ? settlementhFormInfo.managementMoney : settlementhFormInfo.managementMoney }}</td>
            <td class="td1">{{ settlementhFormInfo.managementMoneyTax ? settlementhFormInfo.managementMoneyTax : settlementhFormInfo.managementMoneyTax }}</td>
            <td class="td1">{{ settlementhFormInfo.managementMoneyTicket ? settlementhFormInfo.managementMoneyTicket : settlementhFormInfo.managementMoneyTicket }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >管理费2</td>
            <td class="td1">{{ settlementhFormInfo.managementMoneyTwo }}</td>
            <td class="td1">{{ settlementhFormInfo.managementMoneyTwoTax }}</td>
            <td class="td1">{{ settlementhFormInfo.managementMoneyTwoTicket }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="3"
            >结算金额合计</td>
            <td class="td1">{{ settlementhFormInfo.countTax ? settlementhFormInfo.countTax.toFixed(2) : settlementhFormInfo.countTax }}</td>
            <td class="td1">{{ settlementhFormInfo.accountMoneySum ? settlementhFormInfo.accountMoneySum.toFixed(2) : settlementhFormInfo.accountMoneySum }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >开票金额合计</td>
            <td class="td1">{{ settlementhFormInfo.ticketMoneySum }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >上次差余额</td>
            <td class="td1">{{ settlementhFormInfo.prevPoorBalance }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >本次差余额</td>
            <td class="td1">{{ settlementhFormInfo.curPoorBalance }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">备注</td>
            <td
              class="td1"
              colspan="4"
            >
              {{ settlementhFormInfo.remark }}
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
              {{ settlementhFormInfo.ticketType }}
            </td>
            <td class="td1">
              {{ settlementhFormInfo.deductionAmount }}
            </td>
            <td class="td1">
              {{ settlementhFormInfo.noTaxAmount }}
            </td>
            <td class="td1">
              <span>{{ settlementhFormInfo.taxAmount }}</span>
            </td>
            <td class="td1">
              <span>{{ settlementhFormInfo.ticketSumAmount }}</span>
            </td>
          </tr>
        </table>
      </div>
    </a-card>
    <a-card
      title="差余额"
      :bordered="false"
      v-if="type == 0"
    >
      <a-table
        rowKey="id"
        :columns="balanceColumns"
        :dataSource="balanceData"
        :pagination="false"
      >
      </a-table>
    </a-card>
    <a-card
      :bordered="false"
      v-if="type == 1"
    >
      <div class="tabDiv">
        <h2 id="tabledesc1">{{ engineerSettlementInfo.settleDepartName }}{{ engineerSettlementInfo.settleMonth }} - 结算单</h2>
        <table class="table1" aria-describedby="tabledesc1">
          <tr class="tr1">
            <th
              class="tit td1"
              scope="col"
            >结算主体</th>
            <td class="td1">{{ engineerSettlementInfo.settleDepartName }}</td>
            <th
              class="tit td1"
              scope="col"
            >皖信盖章</th>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算编码名称</td>
            <td
              class="td1"
              colspan="3"
            >{{ engineerSettlementInfo.settleDepartNo }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算时间</td>
            <td
              class="td1"
              colspan="3"
            >{{ engineerSettlementInfo.settleMonth }}</td>
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
            >{{ engineerSettlementInfo.salaryMonth }}</td>
            <td class="tit td1">应发工资</td>
            <td class="td1">{{ engineerSettlementInfo.salarySum }}</td>
            <td class="td1">{{ engineerSettlementInfo.salaryTicket }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">实发工资(银付)</td>
            <td class="td1">{{ engineerSettlementInfo.cardPay }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">实发工资(现金)</td>
            <td class="td1"></td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">暂停发金额</td>
            <td class="td1">{{ engineerSettlementInfo.pausePay }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              rowspan="2"
            >{{ engineerSettlementInfo.socialMonth }}</td>
            <td class="tit td1">应缴单位社保</td>
            <td class="td1">{{ engineerSettlementInfo.usocialDeduction }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴个人社保</td>
            <td class="td1">{{ engineerSettlementInfo.psocialDeduction }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              rowspan="2"
            >{{ engineerSettlementInfo.fundMonth }}</td>
            <td class="tit td1">应缴单位公积金</td>
            <td class="td1">{{ engineerSettlementInfo.ufundDeduction }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴个人公积金</td>
            <td class="td1">{{ engineerSettlementInfo.pfundDeduction }}</td>
            <td class="td1"></td>
          </tr>
          <tr
            v-for="(item,index) in engineerSettlementhFormSubList"
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
            <td class="td1">{{ engineerSettlementInfo.employerLiabilityInsurance }}</td>
            <td class="td1"></td>
          </tr>
          <tr
            class="tr1"
            v-if="engineerSettlementInfo.takingBalance != 0"
          >
            <td
              class="tit td1"
              colspan="2"
            >商险差余额</td>
            <td class="td1">{{ engineerSettlementInfo.takingBalance }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >其它费用</td>
            <td class="td1">{{ engineerSettlementInfo.other }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >增值税金及附加</td>
            <td class="td1">{{ engineerSettlementInfo.valueDaddedTax }}</td>
            <td class="td1">{{ engineerSettlementInfo.valueDaddedTaxTicket }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >预缴企业所得税</td>
            <td class="td1">{{ engineerSettlementInfo.unitIncomeTax }}</td>
            <td class="td1">{{ engineerSettlementInfo.unitIncomeTaxTicket }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >预缴个人所得税</td>
            <td class="td1">{{ engineerSettlementInfo.personIncomeTax }}</td>
            <td class="td1">{{ engineerSettlementInfo.personIncomeTaxTicket }}</td>
          </tr>

          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >人数</td>
            <td class="td1">{{ engineerSettlementInfo.personCount }}</td>
            <td class="td1"></td>
          </tr>

          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >管理费</td>
            <td class="td1">{{ engineerSettlementInfo.managementCost }}</td>
            <td class="td1">{{ engineerSettlementInfo.managementCostTicket }}</td>
          </tr>

          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >结算金额合计</td>
            <td class="td1"></td>
            <td class="td1">{{ engineerSettlementInfo.accountMoneySum }}</td>
          </tr>

          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >开票金额合计</td>
            <td class="td1"></td>
            <td class="td1">{{ engineerSettlementInfo.ticketMoneySum }}</td>
          </tr>

          <tr class="tr1">
            <td class="tit td1">备注</td>
            <td
              class="td1"
              colspan="3"
            >
              {{ engineerSettlementInfo.remark }}
            </td>
          </tr>

        </table>
      </div>
    </a-card>
    <a-card
      :bordered="false"
      v-if="type == 3 && Object.keys(forecastInfo).length"
    >
      <div class="tabDiv">
        <h2 id="tabledesc2">{{ forecastInfo.forecastForm.departName }}{{ forecastInfo.forecastBill.payMonths }} - 结算单</h2>
        <table class="table1" aria-describedby="tabledesc2">
          <tr class="tr1">
            <th
              class="tit td1"
              scope="col"
            >结算主体</th>
            <td
              class="td1"
              colspan="2"
            >{{ forecastInfo.forecastForm.departName }}</td>
            <th
              class="tit td1"
              scope="col"
            >皖信盖章</th>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算编码</td>
            <td
              class="td1"
              colspan="4"
            >{{ forecastInfo.forecastForm.departNo }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算时间</td>
            <td
              class="td1"
              colspan="4"
            >{{ forecastInfo.forecastBill.payMonths }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >费用项目</td>
            <td class="tit td1">金额</td>
            <td class="tit td1">增值税金</td>
            <td class="tit td1">开票金额</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              rowspan="7"
            >{{ forecastInfo.forecastBill.payMonths }}</td>
            <td class="tit td1">应缴单位社保</td>
            <td class="td1">{{ forecastInfo.forecastBill.unitSocial*1 }}</td>
            <td class="td1">{{ forecastInfo.forecastBill.unitSocialTax*1 }}</td>
            <td class="td1">{{ this.formatFloat(forecastInfo.forecastBill.unitSocial*1+forecastInfo.forecastBill.unitSocialTax*1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">代扣个人社保</td>
            <td class="td1">{{ forecastInfo.forecastBill.personalSocial*1 }}</td>
            <td class="td1">{{ forecastInfo.forecastBill.personalSocialTax*1 }}</td>
            <td class="td1">{{ this.formatFloat(forecastInfo.forecastBill.personalSocial*1 + forecastInfo.forecastBill.personalSocialTax*1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴单位公积金</td>
            <td class="td1">{{ forecastInfo.forecastBill.unitProvident*1 }}</td>
            <td class="td1">{{ forecastInfo.forecastBill.unitProvidentTax*1 }}</td>
            <td class="td1">{{ this.formatFloat(forecastInfo.forecastBill.unitProvident*1 + forecastInfo.forecastBill.unitProvidentTax*1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">代扣个人公积金</td>
            <td class="td1">{{ forecastInfo.forecastBill.personalProvident*1 }}</td>
            <td class="td1">{{ forecastInfo.forecastBill.personalProvidentTax*1 }}</td>
            <td class="td1">{{ this.formatFloat(forecastInfo.forecastBill.personalProvident*1 + forecastInfo.forecastBill.personalProvidentTax*1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">社保缴纳总合计</td>
            <td class="td1">{{ forecastInfo.forecastBill.socialSum*1 }}</td>
            <td class="td1"></td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">公积金缴纳总合计</td>
            <td class="td1">{{ forecastInfo.forecastBill.fundSum*1 }}</td>
            <td class="td1"></td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">总合计</td>
            <td class="td1">{{ forecastInfo.forecastBill.sum*1 }}</td>
            <td class="td1"></td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >单位社保差额</td>
            <td class="td1">{{ forecastInfo.forecastBill.unitSocialDiff*1 }}</td>
            <td class="td1">{{ forecastInfo.forecastBill.unitSocialDiffTax*1 }}</td>
            <td class="td1">{{ this.formatFloat(forecastInfo.forecastBill.unitSocialDiff * 1 + forecastInfo.forecastBill.unitSocialDiffTax * 1) }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >个人社保差额</td>
            <td class="td1">{{ forecastInfo.forecastBill.personalSocialDiff*1 }}</td>
            <td class="td1">{{ forecastInfo.forecastBill.personalSocialDiffTax*1 }}</td>
            <td class="td1">{{ this.formatFloat(forecastInfo.forecastBill.personalSocialDiff * 1 + forecastInfo.forecastBill.personalSocialDiffTax * 1) }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >单位公积金差额</td>
            <td class="td1">{{ forecastInfo.forecastBill.unitPrividentDiff*1 }}</td>
            <td class="td1">{{ forecastInfo.forecastBill.unitPrividentDiffTax*1 }}</td>
            <td class="td1">{{ this.formatFloat(forecastInfo.forecastBill.unitPrividentDiff*1 + forecastInfo.forecastBill.unitPrividentDiffTax*1) }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >个人公积金差额</td>
            <td class="td1">{{ forecastInfo.forecastBill.personalProvidentDiff*1 }}</td>
            <td class="td1">{{ forecastInfo.forecastBill.personalProvidentDiffTax*1 }}</td>
            <td class="td1">{{ this.formatFloat(forecastInfo.forecastBill.personalProvidentDiff*1 + forecastInfo.forecastBill.personalProvidentDiffTax*1) }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >管理费差额</td>
            <td class="td1">{{ forecastInfo.forecastBill.managementFeeDiff*1 }}</td>
            <td class="td1">{{ forecastInfo.forecastBill.managementFeeDiffTax*1 }}</td>
            <td class="td1">{{ this.formatFloat(forecastInfo.forecastBill.managementFeeDiff*1 + forecastInfo.forecastBill.managementFeeDiffTax*1) }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >服务人数</td>
            <td class="td1">{{ forecastInfo.forecastBill.serverPeopleNum*1 }}</td>
            <td class="td1"></td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >服务人次</td>
            <td class="td1">{{ forecastInfo.forecastBill.serverPeople }}</td>
            <td class="td1"></td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >社保卡费</td>
            <td class="td1">{{ forecastInfo.forecastBill.socialCardFee*1 }}</td>
            <td class="td1"></td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >商险</td>
            <td class="td1">{{ forecastInfo.forecastBill.businessInsurance*1 }}</td>
            <td class="td1">{{ forecastInfo.forecastBill.businessInsuranceTax*1 }}</td>
            <td class="td1">{{ this.formatFloat(forecastInfo.forecastBill.businessInsurance*1 + forecastInfo.forecastBill.businessInsuranceTax*1) }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >商险差额</td>
            <td class="td1">{{ forecastInfo.forecastBill.takingBalance*1 }}</td>
            <td class="td1">{{ forecastInfo.forecastBill.takingBalanceTax*1 }}</td>
            <td class="td1">{{ this.formatFloat(forecastInfo.forecastBill.takingBalance*1 + forecastInfo.forecastBill.takingBalanceTax*1) }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >管理费</td>
            <td class="td1">{{ forecastInfo.forecastBill.managementFee*1 }}</td>
            <td class="td1">{{ forecastInfo.forecastBill.managementFeeTax*1 }}</td>
            <td class="td1">{{ this.formatFloat(forecastInfo.forecastBill.managementFee*1 + forecastInfo.forecastBill.managementFeeTax*1) }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >管理费2</td>
            <td class="td1">{{ forecastInfo.forecastBill.managementFeeTwo*1 }}</td>
            <td class="td1"></td>
            <td class="td1">{{ forecastInfo.forecastBill.managementFeeTwo*1 }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >结算金额合计</td>
            <td class="td1"></td>
            <td class="td1"></td>
            <td class="td1">{{ forecastInfo.forecastBill.billFeeSum*1 }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >开票金额合计</td>
            <td class="td1"></td>
            <td class="td1"></td>
            <td class="td1">{{ forecastInfo.forecastForm.ticketFee*1 }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >上次差余额</td>
            <td
              class="td1"
              colspan="3"
            >{{ forecastInfo.forecastForm.prevPoorBalance*1 }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >本次差余额</td>
            <td
              class="td1"
              colspan="3"
            >{{ forecastInfo.forecastForm.curPoorBalance*1 }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >开票客户名称</td>
            <td class="tit td1">开票金额</td>
            <td
              class="tit td1"
              colspan="2"
            >开票时间</td>
          </tr>
          <tr
            class="tr1"
            v-for="item in invoiceInfo"
            :key="item.id"
          >
            <td
              class="td1"
              colspan="2"
            >{{ item.unitName }}</td>
            <td class="td1">{{ item.invoiceMoney }}</td>
            <td
              class="td1"
              colspan="2"
            >{{ item.applyDate }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >到款单位</td>
            <td class="tit td1">到款时间</td>
            <td class="tit td1">来款金额</td>
            <td class="tit td1">认领金额</td>
          </tr>
          <tr
            class="tr1"
            v-for="item in reciveList"
            :key="item.id"
          >
            <td
              class="td1"
              colspan="2"
            >{{ item.reciveRecordList[0].incomeBelong }}</td>
            <td class="td1">{{ item.releaseDate }}</td>
            <td class="td1">{{ item.incomeFee }}</td>
            <td class="td1">{{ item.reciveRecordList[0].reciveFee }}</td>
          </tr>

        </table>
      </div>
    </a-card>
    <a-card
      :bordered="false"
      v-if="type == 4 && Object.keys(settlebillForm).length"
    >
      <div class="tabDiv">
        <h2 id="tabledesc3">{{ settlebillForm.departName }}{{ settlebillForm.settleDate ? settlebillForm.settleDate.substring(0,10) : '' }} - 结算单</h2>
        <table
          class="table1"
          aria-describedby="tabledesc3"
        >
          <tr class="tr1">
            <th
              class="tit td1"
              scope="col"
            >客户单位</th>
            <td
              class="td1"
              colspan="3"
            >{{ settlebillForm.customerName }}</td>
          </tr>
          <tr class="tr1">
            <th
              class="tit td1"
              scope="col"
            >结算主体</th>
            <td
              class="td1"
              colspan="3"
            >{{ settlebillForm.departName }}</td>
          </tr>
          <tr class="tr1">
            <th
              class="tit td1"
              scope="col"
            >服务项目</th>
            <td
              class="td1"
              colspan="3"
            >
              <a-tag
                v-for="item in settlebillForm.serverItem"
                :key="item+Math.random()"
              >{{ item }}</a-tag>
            </td>
          </tr>
          <tr class="tr1">
            <th
              class="tit td1"
              scope="col"
            >结算日期</th>
            <td
              class="td1"
              colspan="3"
            >{{ settlebillForm.settleDate }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">费用名目</td>
            <td class="tit td1">金额(不含税)</td>
            <td class="tit td1">税金</td>
            <td class="tit td1">金额(含税)</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算合计</td>
            <td class="td1">{{ calculate.settleNotax }}</td>
            <td class="td1">{{ calculate.settleHastax }}</td>
            <td class="td1">{{ settlebillForm.settleBillVo.sumSettle }}</td>
          </tr>
          <tr
            class="tr1"
            v-for="(item) in settlebillForm.settleBillVo.costingPayments"
            :key="item.id+Math.random()"
          >
            <td class="td1">{{ item.name }}</td>
            <td class="td1">{{ item.amount }}</td>
            <td class="td1">{{ (Number(settleInfo.departSettlementInfo.taxType) > 116) ? 0 : formatFloat(item.amount*settleInfo.departSettlementInfo.taxFee/100) }}</td>
            <td class="td1">{{ (Number(settleInfo.departSettlementInfo.taxType) > 116) ? item.amount : formatFloat(item.amount+item.amount*settleInfo.departSettlementInfo.taxFee/100) }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">业务收入</td>
            <td class="td1">{{ calculate.incomeNotax }}</td>
            <td class="td1">{{ calculate.incomeTax }}</td>
            <td class="td1">{{ calculate.incomeHastax }}</td>
          </tr>
          <tr class="tr1">
            <th
              class="tit td1"
              scope="col"
            >开票金额合计</th>
            <td
              class="td1"
              colspan="2"
            ></td>
            <td class="td1">{{ settlebillForm.settleBillVo.ticketAmount }}</td>
          </tr>
          <tr class="tr1">
            <th
              class="tit td1"
              scope="col"
            >上期差余额</th>
            <td
              class="td1"
              colspan="2"
            ></td>
            <td class="td1">{{ settlebillForm.settleBillVo.prePoorBalance }}</td>
          </tr>
          <tr class="tr1">
            <th
              class="tit td1"
              scope="col"
            >本期差余额</th>
            <td
              class="td1"
              colspan="2"
            ></td>
            <td class="td1">{{ settlebillForm.settleBillVo.currPoorBalance }}</td>
          </tr>
          <tr>
            <th
              class="tit td1"
              scope="col"
              colspan="2"
            >开票客户名称</th>
            <td class="tit td1">开票金额</td>
            <td class="tit td1">开票时间</td>
          </tr>
          <tr
            v-for="item in invoice"
            :key="item.id+Math.random()"
          >
            <td
              class="td1"
              colspan="2"
            >{{ item.unitName }}</td>
            <td class="td1">{{ item.invoiceMoney }}</td>
            <td class="td1">{{ item.applyDate }}</td>
          </tr>

          <template v-if="settlebillForm.reciveList.length">
            <tr>
              <td class="td1 tit">到款单位</td>
              <td class="td1 tit">到款时间</td>
              <td class="td1 tit">来款金额</td>
              <td class="td1 tit">认领金额</td>
            </tr>
            <tr
              v-for="item in settlebillForm.reciveList"
              :key="item.id+Math.random()"
            >
              <td class="td1">{{ item.reciveRecordList[0].incomeBelong }}</td>
              <td class="td1">{{ item.releaseDate }}</td>
              <td class="td1">{{ item.incomeFee }}</td>
              <td class="td1">{{ item.reciveRecordList[0].reciveFee }}</td>
            </tr>
          </template>

        </table>
      </div>
    </a-card>
  </a-spin>
</template>

<script>
import { httpAction } from '@/api/manage'
import { getItemName } from '@/utils/common'

export default {
  name: 'SettleForSalaryModal',
  props: {
    settleFormId: {
      type: String,
      required: true
    },
    type: {
      // 结算单类型
      type: String,
      required: true
    }
  },
  data() {
    return {
      title: '普通薪资结算单',
      confirmLoading: false,
      columns: [
        {
          title: '结算主体',
          dataIndex: 'settleDepartName'
        },
        {
          title: '结算编码名称',
          dataIndex: 'settleDepartNo'
        },
        {
          title: '结算时间',
          dataIndex: 'settleMonth'
        },
        {
          title: '皖信盖章'
        }
      ],
      balanceColumns: [
        {
          title: '月份',
          dataIndex: 'month'
        },
        {
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '项目',
          dataIndex: 'project'
        },
        {
          title: '金额',
          dataIndex: 'money'
        },
        {
          title: '原因',
          dataIndex: 'cause'
        }
      ],
      balanceData: [],
      invoice: [], // 开票信息
      settlementhFormInfo: {}, // 普通薪资
      settlementhFormSubList: [],
      engineerSettlementInfo: {}, // 工程薪资
      engineerSettlementhFormSubList: [],
      forecastInfo: {},
      invoiceInfo: [], // 结算单底部开票客户名称那行信息
      reciveList: [], // 结算单底部到款单位那行信息
      settlebillForm: {}, // 一次性结算单
      url: {
        salary: 'salary/tsettlementhform/getBySettlementFormId?settlementFormId=',
        enginer: 'salary/tengineeringsettlementform/getBySettlementFormId?settlementFormId=',
        yugu: 'hrSocial/tforecastform/getSettlementFormById?id=',
        settlebill: 'hrOneTime/tbusinessoutsourcingmain/getDetailForInvoice/',
        // settlebill: '/hrOneTime/tnewsettle/getTNewSettleVo?businessMainId=',

      },
      calculate:{
        sumCost:0,  // 成本之和
        settleNotax:0, // 结算金额不含税
        settleHastax:0, // 结算金额税金
        incomeNotax:0, // 业务收入不含税
        incomeTax:0, // 业务收入税金
        incomeHastax:0, // 业务收入（含税）
      },
      settleInfo:{} //结算主体信息
    }
  },
  methods: {
    getItemName,
    show(settleInfo) {
      this.settleInfo = settleInfo
      switch (String(this.type)) {
        case '0':
          // 普通薪资结算单
          httpAction(this.url.salary + this.settleFormId, null, 'get').then(res => {
            if (res.code === 200) {
              this.settlementhFormInfo = res.data.settlementhForm
              this.balanceData = res.data.poorBalanceInfoList
              this.settlementhFormSubList = res.data.settlementhFormSubList
            } else {
              this.$message.warning(res.msg)
            }
          })
          break
        case '1':
          // 工程薪资结算单
          httpAction(this.url.enginer + this.settleFormId, null, 'get').then(res => {
            if (res.code === 200) {
              this.engineerSettlementInfo = res.data.engineerSettlementForm
              this.engineerSettlementhFormSubList = res.data.engineerSettlementhFormSubList
            } else {
              this.$message.warning(res.msg)
            }
          })
          break
        case '3':
          // 预估结算单
          httpAction(this.url.yugu + this.settleFormId, null, 'get').then(res => {
            if (res.code === 200) {
              this.forecastInfo = res.data
            } else {
              this.$message.warning(res.msg)
            }
          })
          // 开票明细（结算表底部开票客户名称那行）
          httpAction(
            `salary/tinvoice/openTInvoiceBySettleFormId?salaryId=${this.settleFormId}&settleFormType=3`,
            null,
            'get'
          ).then(res => {
            if (Number(res.code) === 200) {
              this.invoiceInfo = res.data
            } else {
              this.$message.warning(res.msg)
            }
          })
          // 匹配信息结算表底部到款单位那行）
          httpAction(
            `salary/treciverecord/getTReciveByBillId?matchId=${this.settleFormId}&type=6`,
            null,
            'get'
          ).then(res => {
            if (Number(res.code) === 200) {
              this.reciveList = res.data
            } else {
              this.$message.warning(res.msg)
            }
          })
          break
        case '4':
          {// 一次性结算单
            httpAction(this.url.settlebill + this.settleFormId, null, 'get').then(res => {
              if (res.code === 200) {
                this.settlebillForm = res.data
                this.settlebillForm.serverItem = res.data.serverItem ? res.data.serverItem.split(',') : []
                this.calculate.sumCost = 0
                res.data.settleBillVo.costingPayments.forEach(item=>{
                  this.calculate.sumCost += item.amount
                })
                // 计算金额税金
                if(Number(settleInfo.departSettlementInfo.taxType) > 116){
                  this.calculate.settleNotax = this.formatFloat((res.data.settleBillVo.sumSettle - this.calculate.sumCost)/(1+settleInfo.departSettlementInfo.taxFee/100) + this.calculate.sumCost)
                  this.calculate.settleHastax = this.formatFloat((res.data.settleBillVo.sumSettle-this.calculate.sumCost)/(1+settleInfo.departSettlementInfo.taxFee/100)*settleInfo.departSettlementInfo.taxFee/100)
                  this.calculate.incomeHastax = this.formatFloat(res.data.settleBillVo.sumSettle-this.calculate.sumCost)
                  this.calculate.incomeNotax = this.formatFloat(this.calculate.incomeHastax/(1+settleInfo.departSettlementInfo.taxFee/100))
                  this.calculate.incomeTax = this.formatFloat(this.calculate.incomeNotax*settleInfo.departSettlementInfo.taxFee/100)
                }else{
                  this.calculate.settleNotax = this.formatFloat(res.data.settleBillVo.sumSettle/(1+settleInfo.departSettlementInfo.taxFee/100))
                  this.calculate.settleHastax = this.formatFloat(this.calculate.settleNotax*settleInfo.departSettlementInfo.taxFee/100)
                  this.calculate.incomeNotax = this.formatFloat(this.calculate.settleNotax - this.calculate.sumCost)
                  this.calculate.incomeTax = this.formatFloat(this.calculate.incomeNotax*settleInfo.departSettlementInfo.taxFee/100)
                  this.calculate.incomeHastax = this.formatFloat(this.calculate.incomeNotax+this.calculate.incomeTax)
                }
              } else {
                this.$message.warning(res.msg)
              }
            })
            const requestUrl = `/salary/tinvoice/openOneTimeInvoiceBySettleBillId?settleBillId=${this.settleFormId}&settleFormType=4`
            httpAction(requestUrl,{},'GET').then(res => {
              if (Number(res.code) === 200) {
                this.invoice = res.data
              } else {
                this.$message.warning(res.msg)
              }
            })
          }
          break
      }
    },
    // 精度处理
    formatFloat(f, digit = 2) {
      const m = Math.pow(10, digit)
      return Math.round(f * m) / m
    }
  }
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
