<template>
  <div>
    <a-row>
      <div class="main-article">
        <div class="node-article-content">
          <p style="text-align:center;color:red">{{ salaryStandardInfo.settlementMonth }}客户结算单</p>
          <table
            class="table1"
            style="background:yellow;border:0;width:770px;margin:0 auto"
          >
            <tr>
              <td
                class="font18"
                style="background:yellow;border:0"
              >部门名称:</td>
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
            style="width:770px;margin:0 auto"
          >
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
              <td class="td1">{{ settlementhFormInfo.salarySum }}</td>
              <td class="td1">{{ settlementhFormInfo.salaryTax }}</td>
              <td class="td1">{{ settlementhFormInfo.salaryTicket }}</td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">实发工资(银付)</td>
              <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
              <td class="td1"></td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">实发工资(现金)</td>
              <td class="td1">{{ settlementhFormInfo.moneyPay }}</td>
              <td class="td1"></td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">暂停发金额</td>
              <td class="td1">{{ settlementhFormInfo.pausePay }}</td>
              <td class="td1"></td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                rowspan="4"
              >{{ salaryAccountOne.deduSocialMonth }}</td>
              <td class="tit td1">应缴单位社保</td>
              <td class="td1">{{ settlementhFormInfo.unitSocial }}</td>
              <td class="td1"></td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">应缴个人社保</td>
              <td class="td1">{{ settlementhFormInfo.personalSocial }}</td>
              <td class="td1"></td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">没工资员工单位社保</td>
              <td class="td1">{{ settlementhFormInfo.noSalaryUnitSocial }}</td>
              <td class="td1">{{ settlementhFormInfo.noSalaryUnitSocialTax }}</td>
              <td class="td1">{{ settlementhFormInfo.noSalaryUnitSocialTicket }}</td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">没工资员工个人社保</td>
              <td class="td1">{{ settlementhFormInfo.noSalaryPersonSocial }}</td>
              <td class="td1">{{ settlementhFormInfo.noSalaryPersonSocialTax }}</td>
              <td class="td1">{{ settlementhFormInfo.noSalaryPersonSocialTicket }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                rowspan="4"
              >{{ salaryAccountOne.deduProvidentMonth }}</td>
              <td class="tit td1">应缴单位公积金</td>
              <td class="td1">{{ settlementhFormInfo.unitFund }}</td>
              <td class="td1">{{ settlementhFormInfo.unitFundTax }}</td>
              <td class="td1">{{ settlementhFormInfo.unitFundTicket }}</td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">应缴个人公积金</td>
              <td class="td1">{{ settlementhFormInfo.personalFund }}</td>
              <td class="td1"></td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">没工资员工单位公积金</td>
              <td class="td1">{{ settlementhFormInfo.noSalaryUnitFund }}</td>
              <td class="td1">{{ settlementhFormInfo.noSalaryUnitFundTax }}</td>
              <td class="td1">{{ settlementhFormInfo.noSalaryUnitFundTicket }}</td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">没工资员工个人公积金</td>
              <td class="td1">{{ settlementhFormInfo.noSalaryPersonalFund }}</td>
              <td class="td1">{{ settlementhFormInfo.noSalaryPersonalFundTax }}</td>
              <td class="td1">{{ settlementhFormInfo.noSalaryPersonalFundTicket }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >代扣当月个人税</td>
              <td class="td1">{{ settlementhFormInfo.personalCurmonthTax }}</td>
              <td class="td1"></td>
              <td class="td1"></td>
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
              <td class="td1">{{ settlementhFormInfo.takingRisks.toFixed(2) }}</td>
              <td class="td1">{{ settlementhFormInfo.takingRisksTax.toFixed(2) }}</td>
              <td class="td1">{{ settlementhFormInfo.takingRisksTicket.toFixed(2) }}</td>
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
              <td class="td1">-</td>
              <td class="td1">-</td>
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
              v-for="(item, index) in pauseDiyInfoList"
              :key="index"
              class="tr1"
            >
              <td
                class="tit td1"
                colspan="2"
              >{{ getItemName(item.itemTypeName,item.subName) }}
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
              <td class="td1">{{ settlementhFormInfo.riskFund }}</td>
              <td class="td1">{{ settlementhFormInfo.riskFundTax }}</td>
              <td class="td1">{{ settlementhFormInfo.riskFundTicket }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >人数</td>
              <td class="td1">{{ settlementhFormInfo.personNum }}</td>
              <td class="td1"></td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >人次</td>
              <td class="td1">{{ settlementhFormInfo.personTime }}</td>
              <td class="td1"></td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >管理费</td>
              <td class="td1">{{ settlementhFormInfo.managementMoney }}</td>
              <td class="td1">{{ settlementhFormInfo.managementMoneyTax }}</td>
              <td class="td1">{{ settlementhFormInfo.managementMoneyTicket }}</td>
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
              <td class="td1">{{ settleDeail.countTax }}</td>
              <td class="td1">{{ settleDeail.accountMoneySum }}</td>
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
              >上次差金额</td>
              <td class="td1">{{ settleDeail.prevPoorBalance }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="4"
              >本次差余额</td>
              <td class="td1">{{ settleDeail.curPoorBalance }}</td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">备注</td>
              <td
                class="td1"
                colspan="4"
              >{{ salaryStandardInfo.remark }}</td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">审核人</td>
              <td
                class="td1"
                colspan="2"
              >{{ auditName }}</td>
              <td class="tit td1">制表人</td>
              <td class="tit td1">{{ createName }}</td>
            </tr>
          </table>
          <div
            style="page-break-after:always;"
            v-if="isBank == true"
          ></div>
          <!-- 银行数据列表 -->
          <p style="text-align:center;font-weight:bold">银行数据列表</p>
          <table
            class="table1"
            style="width:770px"
            v-if="isBank == true"
          >
            <tr class="tr1">
              <td class="tit td1">姓名</td>
              <td class="tit td1">身份证号</td>
              <td class="tit td1">银行账号</td>
              <td class="tit td1">实发工资合计</td>
              <td class="tit td1">开户行</td>
            </tr>
            <tr
              class="tr1"
              v-for="(item,index) in salaryBankVoList"
              :key="index"
            >
              <td class="td1">{{ item.name }}</td>
              <td class="td1">{{ item.idNumber }}</td>
              <td class="td1">{{ item.bankNo }}</td>
              <td class="td1">{{ item.money }}</td>
              <td class="td1">{{ item.bankName }}</td>
            </tr>
          </table>

          <div
            style="page-break-after:always"
            v-if="isCash == true"
          ></div>
          <!-- 现金数据列表 -->
          <table
            class="table1"
            style="width:770px"
            v-if="isCash == true"
          >
            <tr class="tr1">
              <td class="tit td1">姓名</td>
              <td class="tit td1">身份证号</td>
              <td class="tit td1">实发工资合计</td>
            </tr>
            <tr
              class="tr1"
              v-for="(item,index) in salaryCashVoList"
              :key="index"
            >
              <td class="td1">{{ item.name }}</td>
              <td class="td1">{{ item.idNumber }}</td>
              <td class="td1">{{ item.money }}</td>
            </tr>
          </table>
        </div>
      </div>
    </a-row>
    <div style="page-break-after:always"></div>
    <a-row>

      <!-- 封面 -->
      <div
        v-for="(pane,index) in coverList"
        :key="index"
        class="cover"
        style="transform: rotate(-90deg);position: relative;top: 310px;right:100px;"
      >
        <p style="text-align:center;font-size:18px;font-weight:bold">{{ pane.invoiceTitle }}</p>
        <p
          style="text-align:center;font-size:25px;font-weight:bold"
          v-if="pane.payType == 1"
        >银行转账审批单</p>
        <p
          style="text-align:center;font-size:25px;font-weight:bold"
          v-if="pane.payType == 0"
        >现金付款审批单</p>
        <p style="text-align:center;line-height:0"> <span style="margin-left: 306px;">{{ pane.createDate }}</span> <span style="margin-left: 20px;">结算主体编码 {{ pane.settleNo }}</span> </p>
        <table class="table1">
          <tr class="tr1">
            <td
              class="td1"
              colspan="2"
            >{{ sign }}</td>
            <td
              class="td1"
              colspan="2"
            >{{ pane.createDate }}</td>
            <td class="td1">结算主体编码</td>
            <td class="td1">{{ pane.settleNo }}</td>
            <td
              rowspan="5"
              style="border:0;width:5px"
            >附件&nbsp;&nbsp;&nbsp; 张</td>
          </tr>
          <tr class="tr1">
            <td
              class="td1"
              colspan="2"
            >
              <p class="font18">单位</p>
              <p>{{ pane.unitName }}</p>
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
              <p>{{ pane.payTypeText }}</p>
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
              <input
                style="border:0"
                :value="pane.receiptUnitName"
              />
            </td>
            <td class="td1">账户:</td>
            <td class="td1">
              <input
                style="border:0"
                :value="pane.bankNo"
              />
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
          <span style="margin-left:50px">财务负责人: {{ revenueName }}</span>
          <span style="margin-left:50px">网银审核授权人:</span>
          <span style="margin-left:50px">网银转账提交人:</span>
          <span style="margin-left:50px">数据审核: {{ auditName }}</span>
          <span style="margin-left:50px">制表人: {{ createName }}</span>
        </p>
        <p v-if="pane.payType == 0">
          <span>公司领导:</span>
          <span style="margin-left:50px">财务负责人: {{ revenueName }}</span>
          <span style="margin-left:50px">出纳会计:</span>
          <span style="margin-left:50px">数据审核: {{ auditName }}</span>
          <span style="margin-left:50px">制表人: {{ createName }}</span>
        </p>
        <p style="text-align:center">本次打印为第&nbsp; {{ count }} &nbsp;次打印,请注意避免重复! &nbsp;打印时间: {{ printData.printDate }} &nbsp; 打印柜员: {{ printData.printUser }} &nbsp; 验证码: {{ printData.uniqueCode }}</p>
        <div style="page-break-after:always"></div>
      </div>

    </a-row>

  </div>
</template>

<script>
import { httpAction } from '@/api/manage'
import { getItemName } from '@/utils/common'
export default {
  data() {
    return {
      article: '',
      fullscreenLoading: true,
      id:'',
      count:0,
      url:{
        list:'/salary/tsalarystandard/applySalaryStandardPage',
        doSubmitUrl:'/salary/tsalarystandard/doSubmit',
        openBill:'/salary/salary/openBill',
        doExportUrl:'/salary/salary/doExportSalary',
        doPrint:"/salary/tprintrecord/doPrint"
      },
      employData:[],
      salaryStandardInfo:{},
      coverList:{},
      settlementhFormInfo:{},
      pauseDiyInfoList:{},
      poorBalanceInfoList:{},
      dataSourceList:{},
      salaryAccountOne:{},
      settleDeail:{},
      salaryBankVoList:[],
      salaryCashVoList:[],
      printData:{},
      isBank:false,
      isCash:false,
      createName:'',
      auditName:'',
      revenueName:'',
      sign:'',
    }
  },
  created() {
    this.id = this.$route.query.id
    this.count = parseInt(this.$route.query.count)  + 1
    this.fetchData()
  },
  methods: {
    getItemName,
    fetchData() {
      let url = this.url.doExportUrl + '?salaryFormId=' + this.id
      httpAction(url,{},'POST').then((res) => {
        if(Number(res.code) === 200){
          this.salaryStandardInfo = res.data.salary
          this.coverList = res.data.coverList
          // 结算单数据
          this.settlementhFormInfo = res.data.settlementhForm
          // 自定义数据列表
          this.pauseDiyInfoList = res.data.settlementhFormSubList != null ? res.data.settlementhFormSubList : []
          // 差额数据列表
          this.poorBalanceInfoList = res.data.poorBalanceInfoList != null ? res.data.poorBalanceInfoList : []
          this.detailData = res.data
          // 银行数据列表
          this.salaryBankVoList = res.data.salaryBankVoList
          // 现金数据列表
          this.salaryCashVoList = res.data.salaryCashVoList
          // 判断银行数据是否为空
          this.salaryBankVoList.length > 0 ? this.isBank = true : this.isBank = false
          // 判断现金数据是否为空
          this.salaryCashVoList.length > 0 ? this.isCash = true : this.isCash = false
          this.salaryAccountOne = res.data.salaryAccountList.length > 0 ? res.data.salaryAccountList[0] : {}
          // 结算单数据
          this.settleDeail = this.settlementhFormInfo

          if(res.data.salary.moneyFrom == 1){
            this.sign = "DF"
          }else{
            this.sign = "Y"
          }
          
          
          httpAction('/admin/user/userDic','','GET').then((res) => {
            if(Number(res.code) === 200){
              this.employData = res.data
              for(var d in res.data){
                if(this.salaryStandardInfo.createUser == d){
                  this.createName = res.data[d]
                }
                if(this.salaryStandardInfo.auditUser == d){
                  this.auditName = res.data[d]
                }
                if(this.salaryStandardInfo.revenueUser == d){
                  this.revenueName = res.data[d]
                }
              }
              httpAction(this.url.doPrint,{'fromId':this.settlementhFormInfo.id,'fromType':0},'POST').then((res) => {
                this.printData = res.data
                this.$nextTick(() => {
                  window.print()
                })
              })
              
            }
          })
        }
      })
      
      
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
    letter-spacing: 0.01rem;
    font-weight: 400;
    font-style: normal;
    font-size: 21px;
    line-height: 1.58;
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
  width: 100%;
}
.table1 .td1 {
  font-size: 12px;
  border: 1px solid #333;
  text-align: center;
  height: 10px;
  //padding: 10px;
  width: 17%;
  word-break: break-all;
}
.table1 .td2 {
  font-size: 16px;
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 10px;
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
</style>
<style media="print">
@page:first {
  size: portrait; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>