<template>
  <a-card :title="settlementhFormInfo.settleDepartNo">

    <a-card :bordered="false">
      <div class="tabDiv">
        <h2>{{ settlementhFormInfo.settleDepartName }}{{ settlementhFormInfo.settleMonth }} - 结算单</h2>
        <table class="table1">
          <tr class="tr1">
            <td class="tit td1">结算主体</td>
            <td
              class="td1"
              colspan="2"
            >{{ settlementhFormInfo.settleDepartName }}</td>
            <td class="tit td1">皖信盖章</td>
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
            >{{ salaryAccountOne.deduSocialMonth }}</td>
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
            <td class="td1">{{ settlementhFormInfo.noSalaryUnitSocialTicket ? settlementhFormInfo.noSalaryUnitSocialTicket.toFixed(2) : settlementhFormInfo.noSalaryUnitSocialTicket }}</td>
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
            >{{ salaryAccountOne.deduProvidentMonth }}</td>
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
            <td class="td1">{{ settlementhFormInfo.noSalaryUnitFundTicket ? settlementhFormInfo.noSalaryUnitFundTicket.toFixed(2) : settlementhFormInfo.noSalaryUnitFundTicket }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">没工资员工个人公积金</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryPersonalFund ? settlementhFormInfo.noSalaryPersonalFund.toFixed(2) : settlementhFormInfo.noSalaryPersonalFund }}</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryPersonalFundTax ? settlementhFormInfo.noSalaryPersonalFundTax.toFixed(2) : settlementhFormInfo.noSalaryPersonalFundTax }}</td>
            <td class="td1">{{ settlementhFormInfo.noSalaryPersonalFundTicket ? settlementhFormInfo.noSalaryPersonalFundTicket.toFixed(2) : settlementhFormInfo.noSalaryPersonalFundTicket }}</td>
          </tr>
          <!-- <tr class="tr1">
            <td
              class="tit td1"
              rowspan="4"
            ></td>
            <td class="tit td1">预收单位社保</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">预收单位公积金</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">预收个人社保</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">预收工个人公积金</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
          </tr> -->
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
            <td class="td1">{{ settlementhFormInfo.withholidingPersonSocial ? settlementhFormInfo.withholidingPersonSocial.toFixed(2) : settlementhFormInfo.withholidingPersonSocial }}</td>
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
            <td class="td1">{{ settlementhFormInfo.withholidingPersonFund ? settlementhFormInfo.withholidingPersonFund.toFixed(2) : settlementhFormInfo.withholidingPersonFund }}</td>
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
            <td class="td1">{{ settlementhFormInfo.withholidingUnitSocial ? settlementhFormInfo.withholidingUnitSocial.toFixed(2) : settlementhFormInfo.withholidingUnitSocial }}</td>
            <td class="td1">{{ settlementhFormInfo.withholidingUnitSocialTax ? settlementhFormInfo.withholidingUnitSocialTax.toFixed(2) : settlementhFormInfo.withholidingUnitSocialTax }}</td>
            <td class="td1">{{ settlementhFormInfo.withholidingUnitSocialTicket ? settlementhFormInfo.withholidingUnitSocialTicket.toFixed(2) : settlementhFormInfo.withholidingUnitSocialTicket }}</td>
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
            <td class="td1">{{ settlementhFormInfo.withholidingUnitFundTax ? settlementhFormInfo.withholidingUnitFundTax.toFixed(2) : settlementhFormInfo.withholidingUnitFundTax }}</td>
            <td class="td1">{{ settlementhFormInfo.withholidingUnitFundTicket ? settlementhFormInfo.withholidingUnitFundTicket.toFixed(2) : settlementhFormInfo.withholidingUnitFundTicket }}</td>
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

          <!-- <tr
            v-for="(item, index) in withholdData"
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
          </tr> -->
          <!-- 自定义 -->
          <tr
            v-for="(item, index) in withholdData"
            :key="index"
            class="tr1"
          >
            <td
              class="tit td1"
              colspan="2"
            >{{ getItemName(item.itemTypeName,item.subName,item.isPause) }}
            </td>
            <td class="td1">{{ item.money ? item.money : item.money }}</td>
            <td class="td1">{{ item.tax ? item.tax : item.tax }}</td>
            <td class="td1">{{ item.ticket ? item.ticket : item.ticket }}</td>
          </tr>
          <!-- 项目报销 -->
          <tr
            v-for="(item) in projectData"
            :key="item.id"
            class="tr1"
          >
            <td
              class="tit td1"
            >{{ item.subName }}
            </td>
            <td class="td1 tit">项目报销</td>
            <td class="td1">{{ item.money }}</td>
            <td class="td1">{{ item.tax }}</td>
            <td class="td1">{{ item.ticket }}</td>
          </tr>
          <!-- 个人代扣-->
          <tr
            v-for="(item) in peoWithholddata"
            :key="item.id"
            class="tr1"
          >
            <td
              class="tit td1"
            >{{ item.subName }}
            </td>
            <td class="td1">
              {{ item.isPause==0?'': item.isPause==1?'暂停发':'不发放' }}
            </td>
            <td class="td1">{{ item.money }}</td>
            <td class="td1">-</td>
            <td class="td1">-</td>
          </tr>
          <!-- 单位代扣-->
          <tr
            v-for="(item) in unitWithholddata"
            :key="item.id"
            class="tr1"
          >
            <td
              class="tit td1"
            >{{ item.subName }}
            </td>
            <td class="td1 ">
              {{ item.isPause==0?'': item.isPause==1?'暂停发':'不发放' }}
            </td>
            <td class="td1">{{ item.money }}</td>
            <td class="td1">{{ item.tax }}</td>
            <td class="td1">{{ item.ticket }}</td>
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
            <td class="td1">{{ settleDeail.managementMoneyTwo }}</td>
            <td class="td1">{{ settleDeail.managementMoneyTwoTax }}</td>
            <td class="td1">{{ settleDeail.managementMoneyTwoTicket }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="3"
            >结算金额合计</td>
            <td class="td1">{{ settleDeail.countTax ? settleDeail.countTax.toFixed(2) : settleDeail.countTax }}</td>
            <td class="td1">{{ settleDeail.accountMoneySum ? settleDeail.accountMoneySum.toFixed(2) : settleDeail.accountMoneySum }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >开票金额合计</td>
            <td class="td1">{{ settleDeail.ticketMoneySum }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >上次差余额</td>
            <td class="td1">{{ settleDeail.prevPoorBalance }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >累计差余额</td>
            <td class="td1">{{ settleDeail.curPoorBalance }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">备注</td>
            <td
              class="td1"
              colspan="4"
            >
              {{ settleDeail.remark }}
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
import { getItemName } from '@/utils/common'
export default {
  name: 'BillingSalaryPauseSettleModal',
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
      withholdData:[],//自定义项
      projectData:[],//项目报销
      peoWithholddata:[],//个人代扣
      unitWithholddata:[],// 单位代扣
      balanceData:[],
      settleDeail:{},
    }
  },
  props: {
    salaryStandardInfo:{
      type:Object,
      required:true
    },
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
    getItemName,
    show(){
      this.settleDeail = this.settlementhFormInfo
      this.withholdData = []
      this.projectData = []
      this.peoWithholddata = []
      this.unitWithholddata = []
       // 项目报销
      this.pauseDiyInfoList.reduce((acc,cur)=>{
        if(cur.itemTypeName=="项目报销"){
          this.projectData.push(cur)
        }else if(cur.itemType==5100){
          // 个人代扣
          this.peoWithholddata.push(cur)
        }else if(cur.itemType==5101){
          // 单位代扣
          this.unitWithholddata.push(cur)
        }else{
          this.withholdData.push(cur)
        }
      },[])
      this.balanceData = this.poorBalanceInfoList
      //获取所有公司数据
      getAction('/admin/organizationinfo/getOrgForCus').then((res) => {
        if(res.code == 200){
          this.orgList = res.data
        }
      })
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