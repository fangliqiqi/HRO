<template>
  <div class="printCont">

    <div
      v-for="(pane,index) in coverList"
      :key="index"
    >
      <!-- 封面 -->
      <div :style="styleBox">
        <div
          class="cover"
          :style="styleCover"
        >
          <div id="coverCont">
            <p style="text-align:center;font-size:18px;font-weight:bold">{{ pane.invoiceTitle }}</p>
            <p
              style="text-align:center;font-size:25px;font-weight:bold"
              v-if="pane.payType == 1"
            >银行转账审批单</p>
            <p
              style="text-align:center;font-size:25px;font-weight:bold"
              v-if="pane.payType == 0"
            >现金付款审批单</p>
            <p style="text-align:center;line-height:0">
              <span style="margin-left: 306px;">{{ moment().format("YYYY-MM-DD HH:mm:ss") }}</span>
              <span style="margin-left: 20px;">结算主体编码 {{ pane.settleNo }}</span>
            </p>
            <table class="table1">
              <tr class="tr1">
                <td
                  class="td1"
                  colspan="2"
                >{{ sign }} 普通薪资 - {{ isBackedType[salaryStandardInfo.isBacked] }}</td>
                <td
                  class="td1"
                  colspan="2"
                >{{ moment().format("YYYY-MM-DD HH:mm:ss") }}</td>
                <td class="td1">结算主体编码</td>
                <td class="td1">{{ pane.settleNo }}</td>
                <td
                  rowspan="5"
                  style="border:0;width:1%"
                >附件 {{ coverList.length }} 张</td>
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
                  <p>{{ pane.payType == 1 ? '银行转账' : '现金转账' }}</p>
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
                  {{ pane.receiptUnitName }}
                </td>
                <td class="td1">账户:</td>
                <td class="td1">
                  {{ pane.bankNo }}
                </td>
                <td class="td1">开户行:</td>
                <td class="td1" style="width: 50%;">
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
              <span style="margin-left:100px">财务负责人: </span>
              <span style="margin-left:100px">网银审核授权人:</span>
              <span style="margin-left:100px">网银转账提交人: {{ bankUpName }}</span>
              <span style="margin-left:50px">数据审核: {{ auditName }}</span>
              <span style="margin-left:50px">制表人: {{ createName }}</span>
            </p>
            <p v-if="pane.payType == 0">
              <span>公司领导:</span>
              <span style="margin-left:100px">财务负责人: </span>
              <span style="margin-left:100px">出纳会计:</span>
              <span style="margin-left:50px">数据审核: {{ auditName }}</span>
              <span style="margin-left:50px">制表人: {{ createName }}</span>
            </p>
            <p
              v-for="(receive,key) in receiveData"
              :key="key"
              v-if="key<10"
              style="text-align:center;margin-bottom: 0px;"
            >
              {{ receive.incomeBelong }}-{{ receive.departName }}&nbsp; 已到账, &nbsp;到账金额 : {{ receive.matchingAmount }}&nbsp;&nbsp; 到账时间: {{ receive.reciveDate }} &nbsp; 备注: {{ receive.serverRemark }}
            </p>
            <p style="text-align:center;padding-top:0px">本次打印为第&nbsp; {{ count }} &nbsp;次打印,请注意避免重复! &nbsp;打印时间: {{ printData.printDate }} &nbsp; 打印柜员: {{ printData.printUser }} &nbsp; 验证码: {{ printData.uniqueCode }}</p>

          </div>
        </div>
      </div>
      <div style="page-break-after:always"></div>
      <div id="newNode"></div>
    </div>
    
    <!-- 结算单 银行明细 -->
    <a-row>
      <div class="main-article">
        <div class="node-article-content">
          <p style="text-align:center;color:red">{{ salaryStandardInfo.settlementMonth }}客户结算单</p>
          <table
            class="table1"
            style="background:yellow;border:0;margin-top:-10px"
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
              <td class="td1">{{ settlementhFormInfo.unitSocial ? settlementhFormInfo.unitSocial.toFixed(2) : settlementhFormInfo.unitSocial }}</td>
              <td class="td1">{{ settlementhFormInfo.unitSocialTax ? settlementhFormInfo.unitSocialTax.toFixed(2) : settlementhFormInfo.unitSocialTax }}</td>
              <td class="td1">{{ settlementhFormInfo.unitSocialTicket ? settlementhFormInfo.unitSocialTicket.toFixed(2) : settlementhFormInfo.unitSocialTicket }}</td>
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
              >{{ getItemName(item.itemTypeName,item.subName,item.isPause) }}
              </td>
              <td class="td1">{{ item.money }}</td>
              <td class="td1">{{ item.tax }}</td>
              <td class="td1">{{ item.ticket }}</td>
            </tr>
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
              <td class="td1 ">
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
              <td class="td1">{{ settlementhFormInfo.managementMoneyTwo }}</td>
              <td class="td1">{{ settlementhFormInfo.managementMoneyTwoTax }}</td>
              <td class="td1">{{ settlementhFormInfo.managementMoneyTwoTicket }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="3"
              >结算金额合计</td>
              <td class="td1">{{ settlementhFormInfo.countTax }}</td>
              <td class="td1">{{ settlementhFormInfo.accountMoneySum }}</td>
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
              >累计差余额</td>
              <td class="td1">{{ settlementhFormInfo.curPoorBalance }}</td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">备注</td>
              <td
                class="td1"
                colspan="4"
              >{{ settlementhFormInfo.remark }}</td>
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
          <div>
            <p style="text-align:center">备注2</p>
            <span v-html="salaryStandardInfo.excelRemark"></span>
          </div>

          <table
            class="table1"
            style="margin-top:30px;"
          >
            <tr class="tr1">
              <td class="tit td1">月份</td>
              <td class="tit td1">姓名</td>
              <td class="tit td1">项目</td>
              <td class="tit td1">金额</td>
              <td class="tit td1 ellipsis">原因</td>
            </tr>
            <tr
              class="tr1"
              v-for="(item,index) in poorBalanceInfoList"
              :key="index"
            >
              <td class="td1">{{ item.month }}</td>
              <td class="td1">{{ item.name }}</td>
              <td class="td1">{{ item.project }}</td>
              <td class="td1">{{ item.money }}</td>
              <td class="td1 ellipsis">{{ item.cause }}</td>
            </tr>
          </table>
          <div
            style="page-break-after:always;"
            v-if="isBank == true"
          ></div>
          <!-- 银行数据列表 -->
          <p
            v-if="isBank == true"
            style="text-align:center;font-weight:bold"
          >银行数据列表</p>
          <table
            class="table1"
            v-if="isBank == true"
          >
            <tr class="tr1">
              <td class="tit td1">姓名</td>
              <td class="tit td1">身份证号</td>
              <td class="tit td1">银行账号</td>
              <td class="tit td1">实发工资合计</td>
              <td class="tit td1">银行</td>
              <td class="tit td1">支行</td>
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
              <td class="td1">{{ item.subBranch }}</td>
            </tr>
            <tr>
              <td class="td1">合计</td>
              <td
                class="td1"
                colspan="5"
              >{{ bankMoney.toFixed(2) }}</td>
            </tr>
          </table>

          <div
            style="page-break-after:always"
            v-if="isCash == true"
          ></div>
          <!-- 现金数据列表 -->
          <table
            class="table1"
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
            <tr>
              <td class="td1">合计</td>
              <td
                class="td1"
                colspan="2"
              >{{ cashMoney.toFixed(2) }}</td>
            </tr>
          </table>

          <!-- 垫付单 -->

          <div
            v-for="(model,index) in advanceData"
            :key="index"
            class="ant-card-body"
            style="line-height: 28px;"
          >
            <div style="page-break-after:always"></div>
            <a-card
              :bordered="true"
              class="ant-card-wider-padding"
              id="staffCard"
            >
              <span id="staffEvectionTitle">垫付申请单</span>
              <table
                border="1px"
                id="taffEvectionTable"
              >
                <thead>
                  <tr>
                    <td class="theadTr">客户单位</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ model.advancePayment.customerName }}</td>
                    <td class="theadTr">客户合同</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ model.advancePayment.contractName }}</td>
                  </tr>
                  <tr>
                    <td class="theadTr">结算主体</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ model.advancePayment.departName }}</td>
                    <td class="theadTr">垫付客户类型</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ filterDictText(customerTypeDicts, model.advancePayment.customerType) }}</td>
                  </tr>
                  <tr>
                    <td class="theadTr">垫付类型</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ filterDictText(advanceTypeDicts, model.advancePayment.advanceType) }}</td>
                    <td class="theadTr">申请单位</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ filterOrgan(organs,model.advancePayment.applyUnit) }}</td>
                  </tr>
                  <tr>
                    <td class="theadTr">期望打款日期</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ model.advancePayment.applyAdvanceDate }}</td>
                    <td class="theadTr">本次已垫付未回款金额</td>
                    <td
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >
                      {{ model.advancePayment.advanceNotPayback }}
                    </td>
                  </tr>
                </thead>
                <tr>
                  <td class="theadTr">结算金额</td>
                  <td
                    class="theadTr"
                    colspan="2"
                    align="left"
                    style="padding-left: 10px;"
                  >
                    {{ model.advancePayment.settleMoney }}
                  </td>
                  <td class="theadTr">开票金额</td>
                  <td
                    class="theadTr"
                    colspan="2"
                    align="left"
                    style="padding-left: 10px;"
                  >
                    {{ model.advancePayment.ticketMoney }}
                  </td>
                </tr>
                <tr>
                  <td class="firstTr">垫付金额</td>
                  <td
                    colspan="2"
                    style="padding-left: 10px;"
                    align="left"
                  >{{ model.advancePayment.advanceMoney }}</td>
                  <td class="firstTr">承诺回款日期</td>
                  <td
                    colspan="2"
                    style="padding-left: 10px;"
                    align="left"
                  >{{ model.advancePayment.paybackDate }}</td>
                </tr>
                <tr>
                  <td class="costingCol">申请人</td>
                  <td
                    class="costingCol"
                    colspan="2"
                    align="left"
                    style="padding-left: 10px;"
                  >
                    {{ model.advancePayment.createUser }}
                  </td>
                  <td class="costingCol">垫付原因</td>
                  <td
                    colspan="2"
                    style="padding-left: 10px;"
                    align="left"
                  >{{ model.advancePayment.advanceReason }}</td>
                </tr>

                <tr
                  v-for="(chil,key) in model.approveAuditInfoList"
                  :key="key"
                >
                  <td>{{ chil.nodeName }}</td>
                  <td
                    style="padding-left: 10px;"
                    align="left"
                    colspan="5"
                  >{{ chil.auditUser }}->{{ status[chil.auditStatus] }} ( {{ chil.auditRemark }} )</td>
                </tr>
              </table>
            </a-card>
          </div>

          <!-- 商险结算单 -->
          <!-- <div
            v-for="(model,index) in insData"
            :key="index"
            class="ant-card-body"
            style="width:770px;"
          >
            <div style="page-break-after:always"></div>
            <span id="staffEvectionTitle">{{ model.settleDomainName }}{{ model.settlementMonth }} - 商险结算单</span>
            <a-card
              :bordered="true"
              class="ant-card-wider-padding"
              id="staffCard"
            >
              <table
                border="1"
                class="settlement"
              >
                <tr>
                  <td class="tdbg">结算主体</td>
                  <td>{{ model.settleDomainName }}</td>
                  <td class="tdbg">皖信盖章</td>
                  <td></td>
                </tr>
                <tr>
                  <td class="tdbg">客户单位</td>
                  <td colspan="3">{{ model.customerName }}</td>
                </tr>
                <tr>
                  <td class="tdbg">结算主体编码</td>
                  <td>{{ model.settleDomainNo }}</td>
                  <td class="tdbg">结算月份</td>
                  <td>{{ model.settlementMonth }}</td>
                </tr>
                <tr>
                  <td class="tdbg">回款金额</td>
                  <td>{{ model.payBackBalance }}</td>
                  <td class="tdbg">预估差额</td>
                  <td>{{ model.balance }}</td>
                </tr>
                <tr>
                  <td class="tdbg">发票号</td>
                  <td>{{ model.invoiceNo }}</td>
                  <td class="tdbg">创建人</td>
                  <td>{{ model.createUser }}</td>
                </tr>
              </table>
            </a-card>
          </div> -->

        </div>
      </div>

    </a-row>

  </div>
</template>

<script>
import { httpAction,postActionHeader } from '@/api/manage'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { filterOrgan } from '@/utils/customDict'
import { mapGetters } from 'vuex'
import { getItemName,getDpi,disableRightClick,disablePrintShortcut,insertAfter } from '@/utils/common'
import moment from 'moment'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

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
        doPrint:"/salary/tprintrecord/doPrint",
        getOrgan: '/admin/organizationinfo/getUserAllOrgan',
        getAdvance: "/hrApproval/tadvancepayment/getByFormId",
        getContract:'/hrBase/tcustomercontract/',
        getReceive:'/salary/treciverecord/getReciveRecordsByRecordId',
        getSalaryFrom:'busiInsurance/forecastbuypayform/salaryFrom/'
      },
      employData:[],
      salaryStandardInfo:{},
      coverList:[],
      settlementhFormInfo:{},
      pauseDiyInfoList:[],//自定义项
      projectData:[],//项目报销
      peoWithholddata:[],//个人代扣
      unitWithholddata:[],// 单位代扣
      poorBalanceInfoList:{},
      dataSourceList:{},
      salaryAccountOne:{},
      settleDeail:{},
      salaryBankVoList:[],
      salaryCashVoList:[],
      customerTypeDicts:[],
      advanceTypeDicts:[],
      status:['提交审核','审核通过','审核不通过','待审核'],
      organs:[],
      advanceData:[],
      insData: [],
      printData:{},
      receiveData:{},
      receiveDataLength:0,
      isBank:false,
      isCash:false,
      createName:'',
      auditName:'',
      revenueName:'',
      sign:'',
      bankUpName:'',
      style:{},
      bankMoney:0,
      cashMoney:0,
      isBackedType:['新表','退表重传'],
      styleBox:{},
      styleCover:{},
    }
  },
  created() {
    this.setStyle();
    this.initDictConfig()
    this.getOrgans();
    this.id = this.$route.query.id
    this.count = parseInt(this.$route.query.count)  + 1
    this.fetchData()
  },
  mounted(){
    disableRightClick();
    document.addEventListener("keydown",disablePrintShortcut);
    this.printAction();
  },
  
  methods: {
    moment,
    filterDictText,
    filterOrgan,
    getItemName,
    ...mapGetters(["nickname", "avatar","userInfo"]),
    async exportUrl(url,method){
      return httpAction(url,{},method)
    },
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
    printAction(){
      const _this = this
      const mediaQueryList = window.matchMedia('print');
      mediaQueryList.addListener(function(mql){
        if(mql.matches){
          console.log('before')
          // console.log(111,document.querySelector('.printCont').innerHTML)
        }else{
          // document.getElementsByClassName('printCont')[0].innerHTML.replace(/style="transform[^"]*?"/g,'')
          _this.getPdf(document.getElementsByClassName('printCont')[0])
        }
      });
    },
    getPdf(el){
      html2canvas(el,{scale: 2,}).then(canvas => {
        const pdf = new JsPDF('p', 'mm', 'a4') // A4纸，纵向
        pdf.setFont("SimSun");
        const ctx = canvas.getContext('2d')
        const a4w = 170; const a4h = 257 // A4大小，210mm x 297mm，四边各保留20mm的边距，显示区域170x257
        const imgHeight = Math.floor(a4h * canvas.width / a4w) // 按A4显示比例换算一页图像的像素高度
        let renderedHeight = 0
        while (renderedHeight < canvas.height) {
          var page = document.createElement('canvas')
          page.width = canvas.width
          page.height = Math.min(imgHeight, canvas.height - renderedHeight)// 可能内容不足一页
          // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
          page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0)
          pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4w, Math.min(a4h, a4w * page.height / page.width)) // 添加图像到页面，保留10mm边距
          renderedHeight += imgHeight
          if (renderedHeight < canvas.height) { pdf.addPage() }// 如果后面还有内容，添加一个空页
        }
        const blob = pdf.output('blob');
        let files = new window.File([blob], `${moment().format('YYYY-MM-DD HH:mm:ss')}.pdf`, {type: 'application/pdf'})
        const remark = `${this.nickname()}在${moment().format('YYYY-MM-DD HH:mm:ss')}打印了一次`
        this.uploadFile(files,remark)
        // pdf.save(`${moment().format('YYYY-MM-DD HH:mm:ss')}.pdf`)
        
      })
    },
    uploadFile(file,remark){
      const formData = new FormData()
      formData.append('file', file)
      formData.append('linkType', 4)
      formData.append('linkId', this.id)
      let contextType = { 'Content-Type': 'multipart/form-data' }
      postActionHeader(`/salary/tsalaryatta/ossUploadFile?printRemark=${remark}`, formData, contextType).then((res) => {
        if(res.code == 200){
          window.close()
        }else{
          this.$message.warning(res.msg)
        }
      })
    },

    async fetchData() {
      this.bankUpName = this.nickname()
      this.bankMoney = 0
      const url = `${this.url.doExportUrl}?salaryFormId=${this.id}`
      const res = await this.exportUrl(url,'post')
      if(res && Number(res.code) === 200){
        this.salaryStandardInfo = res.data.salary
        this.coverList = res.data.coverList
        // 结算单数据
        this.settlementhFormInfo = res.data.settlementhForm
        // 自定义数据列表
        this.projectData =[]
        this.pauseDiyInfoList =[]
        this.peoWithholddata = []
        this.unitWithholddata = []
        res.data.settlementhFormSubList.reduce((acc,cur)=>{
          if(cur.itemTypeName=="项目报销"){
            this.projectData.push(cur)
          }else if(cur.itemType==5100){
            // 个人代扣
            this.peoWithholddata.push(cur)
          }else if(cur.itemType==5101){
            // 单位代扣
            this.unitWithholddata.push(cur)
          }else{
            this.pauseDiyInfoList.push(cur)
          }
        },[])

        // 差额数据列表
        this.poorBalanceInfoList = res.data.poorBalanceInfoList != null ? res.data.poorBalanceInfoList : []
        this.detailData = res.data
        // 银行数据列表
        this.salaryBankVoList = res.data.salaryBankVoList
        for(const item of this.salaryBankVoList){
          this.bankMoney += item.money * 1
        }
        // 现金数据列表
        this.salaryCashVoList = res.data.salaryCashVoList
        for(const item of this.salaryCashVoList){
          this.cashMoney += item.money * 1
        }
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
        if(res.data.salary.advanceMoney > 0){
          const advanceUrl = `${this.url.getAdvance}?formId=${this.settlementhFormInfo.id}&type=0`
          const advanceRes = await this.exportUrl(advanceUrl,'post')
          if(Number(advanceRes.code) === 200){
            this.advanceData = advanceRes.data
            for(let y in this.advanceData){
              const contractId = this.advanceData[y].advancePayment.contractId
              let contractName = ''
              if(contractId){
                const contractRes = await this.exportUrl(this.url.getContract + contractId,'GET')
                if(contractRes && contractRes.code === 200){
                  contractName = contractRes.data.contractName
                }
              }
              this.advanceData[y].advancePayment.contractName = contractName
            }
          }

        }
        const userRes = await this.exportUrl('/admin/user/userDic','GET')
        if(userRes && Number(userRes.code) === 200){
          this.employData = userRes.data
          for(var d in userRes.data){
            if(this.salaryStandardInfo.createUser == d){
              this.createName = userRes.data[d]
            }
            if(this.salaryStandardInfo.auditUser == d){
              this.auditName = userRes.data[d]
            }
            if(this.salaryStandardInfo.revenueUser == d){
              this.revenueName = userRes.data[d]
            }
          }
          const receiveUrl = `${this.url.getReceive}?matchId=${this.salaryStandardInfo.id}&type=0`
          const receiveRes = await this.exportUrl(receiveUrl,'GET')
          if(receiveRes && Number(receiveRes.code) === 200){
            this.receiveData = receiveRes.data;
            const length = receiveRes.data.length;
            // 动态生成
            if(length>10){
              //创建一个div
              const div = document.createElement("div");
              
              // 确定分页总数
              const page = Math.ceil((length-10) / 36);
              for(let i=0; i<page; i++){
                const div1 = document.createElement("div");
                div1.style.border = this.styleBox.border;
                div1.style.height = this.styleBox.height;
                div1.style.margin = this.styleBox.margin;
                div1.style.width = this.styleBox.width;
                
                const div2 = document.createElement("div");
                div2.style.border = this.styleCover.border;
                div2.style.height = this.styleCover.height;
                div2.style.marginTop = this.styleCover.marginTop;
                div2.style.marginLeft = this.styleCover.marginLeft;
                div2.style.width = this.styleCover.width;
                div2.style.transform = 'rotate(-90deg)';
                div2.style.border = '1px solide #fff';

                for(let j=0; j<36; j++){
                  const index = 10 + i*36+ j;
                  if(index < length){
                    const temp = `${this.receiveData[index].incomeBelong}-${this.receiveData[index].departName}  已到账, 到账金额:${this.receiveData[index].matchingAmount}  到账时间: ${this.receiveData[index].reciveDate}  备注: ${this.receiveData[index].serverRemark}`;
                    div2.innerHTML += '<p style="text-align:center;margin-bottom: 0px;">'+temp+'</p>';
                  }
                }
                div1.appendChild(div2);
                div.appendChild(div1);
                insertAfter(div1,'<div style="page-break-after:always"></div>');
              }
              var newNode = document.getElementById('newNode');
              if(newNode){
                newNode.appendChild(div);
              }
            }
            
            // 商险结算单
            httpAction(this.url.doPrint,{'fromId':this.settlementhFormInfo.id,'fromType':0},'POST').then((res) => {
              this.printData = res.data
              this.$nextTick(() => {
                const dom = document.getElementById('coverCont');
                const bwid = 210 * getDpi()/25.4;
                // 超出部分缩放
                if(dom && dom.offsetHeight > bwid){
                  dom.style.transformOrigin = '0 0';
                  dom.style.transform = `scaleY(${bwid/dom.offsetHeight})`;
                }
                window.print()
              })
            })
          }
        }

      }else{
        this.message.warning('请求出错！')
      }

    },
    getOrgans() {
      httpAction(this.url.getOrgan,'','GET').then((res) => {
        if(Number(res.code) === 200 && res.data.length > 0) {
          this.organs = res.data;
        }
      });
    },
    // 数据字典
    initDictConfig() {
      initDictOptions('ADVANCE_CUSTOMER_TYPE').then((res) => {
        if (Number(res.code) === 200) {
          this.customerTypeDicts = res.data;
        }
      });
      initDictOptions('ADVANCE_ADVANCE_TYPE').then((res) => {
        if (Number(res.code) === 200) {
          this.advanceTypeDicts = res.data;
        }
      });
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
  height: 6px;
  width: 100%;
}
.table1 .td1 {
  font-size: 12px;
  border: 1px solid #333;
  text-align: center;
  word-break: break-all;
  //padding: 10px;
  width: 12%;
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
.tabDiv {
  box-shadow: 0 0 1px 1px #aaa, 3px 0 5px 0 #aaa, 0 4px 7px 0 #aaa;
  border: 1px solid;
  margin: 44px auto;
}
.settlement {
  border-collapse: collapse;
  margin: 10px auto 30px;
  width: 100%;
  color: #000;
  font-size: 12px;
}
.settlement td {
  width: 20%;
  height: 40px;
  padding-left: 10px;
  border: solid #999 1px;
}
.settlement td.tdbg {
  font-weight: bold;
  text-align: center;
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
.ellipsis{
  max-width: 350px !important;
  height: auto;
  word-wrap: break-word;
}
</style>
<style media="print">
@page {
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>
