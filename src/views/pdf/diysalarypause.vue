<template>
  <div>

    <div
      v-for="(pane,index) in coverList"
      :key="index"
    >
      <div :style="styleBox">
        <!-- 封面 -->
        <div
          class="cover"
          :style="styleCover"
        >
          <p style="text-align:center;font-size:18px;font-weight:bold">{{ pane.title }}</p>
          <p
            style="text-align:center;font-size:25px;font-weight:bold"
            v-if="pane.payType == 1"
          >银行转账审批单</p>
          <p
            style="text-align:center;font-size:25px;font-weight:bold"
            v-if="pane.payType == 0"
          >现金转账审批单</p>
          <p style="text-align:center;line-height:0"> <span style="margin-left: 306px;">{{ pane.reportDate }}&nbsp;</span> <span style="margin-left: 20px;">结算主体编码&nbsp; {{ pane.settleNo }}</span> </p>
          <table class="table1">
            <tr class="tr1">
              <td class="td1">Z</td>
              <td class="td1">{{ pane.createDate }}</td>
              <td class="td1">结算主体编码</td>
              <td class="td1">{{ pane.settleNo }}</td>
              <td
                rowspan="5"
                style="border:0;width:5px"
              >附件 {{ coverList.length }} 张</td>
            </tr>
            <tr class="tr1">
              <td class="td1">
                <p class="font18">单位</p>
                <p>{{ pane.unitName }}</p>
                <p>{{ pane.settleName }}</p>
              </td>
              <td class="td1">
                <p class="font18">项目</p>
                <p>{{ pane.itemName }}</p>
              </td>
              <td class="td1">
                <p class="font18">付款方式</p>
                <p v-if="pane.payType == 1">银行转账</p>
                <p v-if="pane.payType == 0">现金转账</p>
              </td>
              <td class="td1">
                <p class="font18">金额</p>
                <p>¥{{ pane.money }}</p>
              </td>
            </tr>
            <tr class="tr1">
              <td class="td1">合计人民币:</td>
              <td
                style="font-weight:bolder;text-align:left"
                class="td1"
                colspan="2"
              >{{ pane.chmoney }}</td>
              <td class="td1">¥{{ pane.money }}</td>
            </tr>
            <tr v-if="pane.payType == 1">
              <td class="td1">收款单位名称:</td>
              <td class="td1">
                {{ pane.organName }}
              </td>
              <td class="td1">账户: {{ pane.bankNo }}</td>
              <td class="td1">开户行: {{ pane.bankName }}</td>
            </tr>
            <tr style="border-bottom: 2px solid #333;">
              <td class="td1">备注:</td>
              <td
                class="td1"
                colspan="3"
              >
                {{ pane.remark }}
              </td>
            </tr>
          </table>
          <p v-if="pane.payType == 1">
            <span>公司领导:</span>
            <span style="margin-left:100px">财务负责人: </span>
            <span style="margin-left:100px">网银审核授权人:</span>
            <span style="margin-left:50px">网银转账提交人: {{ bankUpName }}</span>
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
          <p style="text-align:center;padding-top:15px">本次打印为第&nbsp; {{ count }} &nbsp;次打印,请注意避免重复! &nbsp;打印时间: {{ printData.printDate }} &nbsp; 打印柜员: {{ printData.printUser }} &nbsp; 验证码: {{ printData.uniqueCode }}</p>
          <!-- <div style="page-break-after:always"></div> -->
        </div>
      </div>
      
    </div>

    <a-row>
      <div class="main-article">
        <div class="node-article-content">
          <p style="text-align:center;color:red">{{ settlementhFormInfo.settleDepartName }}客户结算单</p>
          <table
            class="table1"
            style="background:yellow;border:0"
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
              <td colspan="2">{{ salaryStandardInfo.settleDepartNo }}</td>
              <td></td>
              <td></td>
            </tr>
            <tr class="tr1">
              <td
                class="font18"
                style="width:20%"
              >结算时间:</td>
              <td style="width:20%">{{ salaryStandardInfo.settleMonth }}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>
          <table class="table1">
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
              >{{ settlementhFormInfo.socialMonth }}</td>
              <td class="tit td1">应缴单位社保</td>
              <td class="td1">{{ settlementhFormInfo.unitSocial }}</td>
              <td class="td1"></td>
              <td class="td1"></td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">代扣个人社保</td>
              <td class="td1">{{ settlementhFormInfo.withholidingPersonSocial }}</td>
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
              >{{ settlementhFormInfo.fundMonth }}</td>
              <td class="tit td1">应缴单位公积金</td>
              <td class="td1">{{ settlementhFormInfo.unitFund }}</td>
              <td class="td1">{{ settlementhFormInfo.unitFundTax }}</td>
              <td class="td1">{{ settlementhFormInfo.unitFundTicket }}</td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">代扣个人公积金</td>
              <td class="td1">{{ settlementhFormInfo.withholidingPersonFund }}</td>
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

            <!-- <tr
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
            <!-- 项目成本报销 -->
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
              >本次差余额</td>
              <td class="td1">{{ settlementhFormInfo.curPoorBalance }}</td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">备注</td>
              <td
                class="td1"
                colspan="4"
              >{{ settlementhFormInfo.remark }}</td>
            </tr>
          </table>
        </div>
      </div>
    </a-row>

  </div>
</template>
<script>
import { httpAction } from '@/api/manage'
import { mapGetters } from 'vuex'
import { getItemName,getDpi,detectZoom } from '@/utils/common'
export default {
  data() {
    return{
      createName:'',
      auditName:'',
      revenueName:'',
      bankUpName:'',
      pauseDiyInfoList:[],
      withholdData:[],//自定义项
      projectData:[],//项目成本报销
      peoWithholddata:[],//个人代扣
      unitWithholddata:[],// 单位代扣
      settlementhFormInfo:{},
      salaryStandardInfo:{},
      coverList:[],
      printData:{},
      count:0,
      url:{
        detailUrl:"salary/tchargerecord/openChargeRecordDetail",
        doPrint:"/salary/tprintrecord/doPrint"
      },
      styleBox:{},
      styleCover:{},
    }
  },
  created(){
    this.setStyle();
    this.bankUpName = this.nickname()
    this.count = parseInt(this.$route.query.count)  + 1
    httpAction(this.url.detailUrl + "?chargeRecordId=" + this.$route.query.id, {}, "POST").then((res) => {
      if(Number(res.code) === 200){
        if(res.data.pauseDiyBankCover){
          res.data.pauseDiyBankCover.payType = 1
          this.coverList.push(res.data.pauseDiyBankCover)
        }
        if(res.data.pauseDiyCashCover){
          res.data.pauseDiyCashCover.payType = 0
          this.coverList.push(res.data.pauseDiyCashCover)
        }
        this.settlementhFormInfo = res.data.settlementhForm
        // this.pauseDiyInfoList = res.data.settlementhFormSubList
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
            this.withholdData.push(cur)
          }
      },[])



        //this.salaryStandardInfo = res.data.tsalaryStandard
        this.salaryStandardInfo = res.data.settlementhForm
        
        httpAction('/admin/user/userDic', '', 'GET').then((result) => {
          if(result.code == 200){
            for(var d in result.data){
              if(this.salaryStandardInfo.createUser == d){
                this.createName = result.data[d]
              }
              if(this.salaryStandardInfo.auditUser == d){
                this.auditName = result.data[d]
              }
              if(this.salaryStandardInfo.revenueUser == d){
                this.revenueName = result.data[d]
              }
            }
            httpAction(this.url.doPrint,{'fromId':this.$route.query.id,'fromType':3},'POST').then((res) => {
              this.printData = res.data;
              const zoom = detectZoom();
              if(zoom !== 100){
                this.$confirm({
                  title: '是否确认打印？',
                  content: '你的浏览器目前处于缩放状态，页面可能会出现错位现象，建议100%大小显示。',
                  onOk() {
                    setTimeout(()=>{
                      window.print();
                    })
                  }
                });
              }else{
                this.$nextTick(() => {
                  window.print()
                })
              }
            })
            
          }
        })
      }
    })
  },
  methods:{
    getItemName,
    ...mapGetters(["nickname", "avatar","userInfo"]),
    setStyle(){
      const wid = 210 * getDpi()/25.4;
      const height = 297 * getDpi()/25.4;
      this.styleBox = {
        width:`${wid}px`,
        height:`${height}px`,
        border:'1px solid #fff',
        margin: '120px auto 0px'
      }
      this.styleCover={
        width:`${height-122}px`,
        height:`${wid}px`,
        marginTop:`${(height-wid)/2-100}px`,
        marginLeft: `${(wid-height)/2+100}px`
      }
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
  width: 740px;
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
  height: 7px;
}
.table1 .td2 {
  font-size: 16px;
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 10px;
  text-align: center;
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
</style>
<style media="print">
@page {
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>