<template>
  <div>
    <div id="content">
      <div v-if="detail.salaryDetailVo || detail.forecastVo || detail.engineerSettlementDetailVo">
        <a-row>
          <a-col :span="18" :offset="3">
            <a-card
              title="客户结算单"
              :bordered="false"
              :headStyle="{'text-align':'center','border':'none'}"
            >
              <!--普通工资发放结算单-->
              <a-row v-if="detail.salaryDetailVo && detail.salaryDetailVo.length">
                <div
                  class="tabDiv"
                  v-for="(item,index) in detail.salaryDetailVo"
                  :key="index"
                >
                  <a-card title="基本信息" :bordered="false">
                    <a-table
                      rowKey="id"
                      :columns="settemColumns"
                      :dataSource="[detail.salaryDetailVo[index]['settlementhForm']]"
                      :pagination="false"
                    >
                    </a-table>
                  </a-card>
                  <a-card title="费用信息" :bordered="false">
                    <h2 id="tabledesc1">{{ item.settlementhForm.settleDepartName }}{{ item.settlementhForm.settleMonth }} - 结算单</h2>
                    <table border="1" class="settlement" aria-describedby="tabledesc1">
                      <tr>
                        <th
                          colspan="2"
                          class="tdbg"
                          scope="col"
                        >费用项目</th>
                        <th class="tdbg" scope="col">金额</th>
                        <th class="tdbg" scope="col">增值税</th>
                        <th class="tdbg" scope="col">开票额小计</th>
                      </tr>
                      <tr>
                        <td rowspan="4">{{ item.settlementhForm.settleMonth }}</td>
                        <td class="tdbg">应发工资</td>
                        <td>{{ item.settlementhForm.salarySum }}</td>
                        <td>{{ item.settlementhForm.salaryTax }}</td>
                        <td>{{ item.settlementhForm.salaryTicket }}</td>
                      </tr>
                      <tr>
                        <td class="tdbg">实发工资(银付)</td>
                        <td>{{ item.settlementhForm.cardPay }}</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td class="tdbg">实发工资(现金)</td>
                        <td>{{ item.settlementhForm.moneyPay }}</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td class="tdbg">暂停发金额</td>
                        <td>{{ item.settlementhForm.pausePay }}</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td rowspan="4">{{ item.settlementhForm.settleMonth }}</td>
                        <td class="tdbg">应缴单位社保</td>
                        <td>{{ item.settlementhForm.unitSocial }}</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td class="tdbg">代扣个人社保</td>
                        <td>{{ item.settlementhForm.withholidingPersonSocial }}</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td class="tdbg">没工资员工单位社保</td>
                        <td>{{ item.settlementhForm.noSalaryUnitSocial }}</td>
                        <td>{{ item.settlementhForm.noSalaryUnitSocialTax }}</td>
                        <td>{{ item.settlementhForm.noSalaryUnitSocialTicket }}</td>
                      </tr>
                      <tr>
                        <td class="tdbg">没工资员工个人社保</td>
                        <td>{{ item.settlementhForm.noSalaryPersonSocial }}</td>
                        <td>{{ item.settlementhForm.noSalaryPersonSocialTax }}</td>
                        <td>{{ item.settlementhForm.noSalaryPersonSocialTicket }}</td>
                      </tr>
                      <tr>
                        <td rowspan="4">{{ item.settlementhForm.settleMonth }}</td>
                        <td class="tdbg">应缴单位公积金</td>
                        <td>{{ item.settlementhForm.unitFund }}</td>
                        <td>{{ item.settlementhForm.unitFundTax }}</td>
                        <td>{{ item.settlementhForm.unitFundTicket }}</td>
                      </tr>
                      <tr>
                        <td class="tdbg">代扣个人公积金</td>
                        <td>{{ item.settlementhForm.withholidingPersonFund }}</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td class="tdbg">没工资员工单位公积金</td>
                        <td>{{ item.settlementhForm.noSalaryUnitFund }}</td>
                        <td>{{ item.settlementhForm.noSalaryUnitFundTax }}</td>
                        <td>{{ item.settlementhForm.noSalaryUnitFundTicket }}</td>
                      </tr>
                      <tr>
                        <td class="tdbg">没工资员工个人公积金</td>
                        <td>{{ item.settlementhForm.noSalaryPersonalFund }}</td>
                        <td>{{ item.settlementhForm.noSalaryPersonalFundTax }}</td>
                        <td>{{ item.settlementhForm.noSalaryPersonalFundTicket }}</td>
                      </tr>
                      <tr>
                        <td
                          class="tdbg"
                          colspan="2"
                        >代扣当月个人税</td>
                        <td>{{ item.settlementhForm.personalCurmonthTax }}</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td
                          class="tdbg"
                          colspan="2"
                        >商险金额</td>
                        <td>{{ item.settlementhForm.takingRisks }}</td>
                        <td>{{ item.settlementhForm.takingRisksTax }}</td>
                        <td>{{ item.settlementhForm.takingRisksTicket }}</td>
                      </tr>
                      <tr>
                        <td
                          class="tdbg"
                          colspan="2"
                        >商险预估差额</td>
                        <td>{{ item.settlementhForm.takingBalance }}</td>
                        <td>{{ item.settlementhForm.takingBalanceTax }}</td>
                        <td>{{ item.settlementhForm.takingBalanceTicket }}</td>
                      </tr>
                      <tr
                        v-for="(items, indexs) in item.settlementhFormSubList"
                        :key="indexs"
                      >
                        <td
                          colspan="2"
                          class="tdbg"
                        >{{ getItemName(items.itemTypeName,items.subName) }}</td>
                        <td>{{ items.money }}</td>
                        <td>{{ items.tax }}</td>
                        <td>{{ items.ticket }}</td>
                      </tr>
                      <tr>
                        <td
                          colspan="2"
                          class="tdbg"
                        >风险金</td>
                        <td>{{ item.settlementhForm.riskFund }}</td>
                        <td>{{ item.settlementhForm.riskFundTax }}</td>
                        <td>{{ item.settlementhForm.riskFundTicket }}</td>
                      </tr>
                      <tr>
                        <td
                          colspan="2"
                          class="tdbg"
                        >人数</td>
                        <td>{{ item.settlementhForm.personNum }}</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colspan="2" class="tdbg">人次</td>
                        <td>{{ item.settlementhForm.personTime }}</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colspan="2" class="tdbg">管理费</td>
                        <td>{{ item.settlementhForm.managementMoney }}</td>
                        <td>{{ item.settlementhForm.managementMoneyTax }}</td>
                        <td>{{ item.settlementhForm.managementMoneyTicket }}</td>
                      </tr>
                      <tr>
                        <td colspan="2" class="tdbg">管理费2</td>
                        <td>{{ item.settlementhForm.managementMoneyTwo }}</td>
                        <td>{{ item.settlementhForm.managementMoneyTwoTax }}</td>
                        <td>{{ item.settlementhForm.managementMoneyTwoTicket }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="tdbg">结算金额合计</td>
                        <td>{{ item.settlementhForm.countTax }}</td>
                        <td>{{ item.settlementhForm.accountMoneySum }}</td>
                      </tr>
                      <tr>
                        <td class="tdbg">备注</td>
                        <td colspan="4">{{ item.settlementhForm.remark }}</td>
                      </tr>
                    </table>
                  </a-card>
                  <div v-if="index<detail.salaryDetailVo.length-1" style="page-break-before:always;" ><br /></div>
                </div>
              </a-row>
              <!--工程类工资结算单-->
              <a-row v-if="detail.engineerSettlementDetailVo && detail.engineerSettlementDetailVo.length">
                <div
                  class="tabDiv"
                  v-for="(item,index) in detail.engineerSettlementDetailVo"
                  :key="index"
                >
                  <a-card title="基本信息" :bordered="false">
                    <a-table
                      rowKey="id"
                      :columns="settemColumns"
                      :dataSource="[detail.engineerSettlementDetailVo[index]['engineerSettlementForm']]"
                      :pagination="false"
                    >
                    </a-table>
                  </a-card>
                  <a-card title="费用信息" :bordered="false">
                    <div class="tabDiv">
                      <h2>{{ item.engineerSettlementForm.settleDepartName }}{{ item.engineerSettlementForm.settleMonth }} - 结算单</h2>
                      <table
                        border="1"
                        class="settlement"
                      >
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >费用项目</td>
                          <td class="tdbg">金额</td>
                          <td class="tdbg">增值税</td>
                          <td class="tdbg">开票额小计</td>
                        </tr>
                        <tr>
                          <td rowspan="6">{{ item.engineerSettlementForm.settleMonth }}</td>
                          <td class="tdbg">应发工资</td>
                          <td>{{ item.engineerSettlementForm.salarySum }}</td>
                          <td></td>
                          <td>{{ item.engineerSettlementForm.salaryTicket }}</td>
                        </tr>
                        <tr>
                          <td class="tdbg">实发工资(银付)</td>
                          <td>{{ item.engineerSettlementForm.cardPay }}</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td class="tdbg">实发工资(现金)</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td class="tdbg">暂停发金额</td>
                          <td>{{ item.engineerSettlementForm.pausePay }}</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td class="tdbg">应缴单位社保</td>
                          <td>{{ item.engineerSettlementForm.usocialDeduction }}</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td class="tdbg">代扣个人社保</td>
                          <td>{{ item.engineerSettlementForm.psocialDeduction }}</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td
                            class="tdbg"
                            colspan="2"
                          >雇主责任险</td>
                          <td>{{ item.engineerSettlementForm.employerLiabilityInsurance }}</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td
                            class="tdbg"
                            colspan="2"
                          >商险预估差额</td>
                          <td>{{ item.engineerSettlementForm.takingBalance }}</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td
                            class="tdbg"
                            colspan="2"
                          >其它费用</td>
                          <td>{{ item.engineerSettlementForm.other }}</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >增值税金及附加</td>
                          <td>{{ item.engineerSettlementForm.valueDaddedTax }}</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >预缴企业所得税</td>
                          <td>{{ item.engineerSettlementForm.unitIncomeTax }}</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >预缴个人所得税</td>
                          <td>{{ item.engineerSettlementForm.personIncomeTax }}</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >人数</td>
                          <td>{{ item.engineerSettlementForm.personCount }}</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >管理费</td>
                          <td>{{ item.engineerSettlementForm.managementCost }}</td>
                          <td></td>
                          <td>{{ item.engineerSettlementForm.managementCostTicket }}</td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >结算金额合计</td>
                          <td></td>
                          <td></td>
                          <td>{{ item.engineerSettlementForm.accountMoneySum }}</td>
                        </tr>
                        <tr>
                          <td class="tdbg">备注</td>
                          <td colspan="4">{{ item.engineerSettlementForm.remark }}</td>
                        </tr>
                      </table>
                    </div>
                  </a-card>
                  <div v-if="index<detail.engineerSettlementDetailVo.length-1" style="page-break-before:always;" ><br /></div>
                </div>
              </a-row>
              <!--预估发放结算单-->
              <a-row v-if="detail.forecastVo && detail.forecastVo.length">
                <div
                  class="tabDiv"
                  v-for="(item,index) in detail.forecastVo"
                  :key="index"
                >
                  <h2 class="center">{{ item.forecastForm.unitName }} - {{ item.forecastBill.billDate }} 结算单</h2>
                  <table
                    border="1"
                    class="settlement"
                  >
                    <tr>
                      <td class="tdbg" width="100">单位名称</td>
                      <td colspan="3">{{ item.forecastForm.unitName }}</td>
                      <td class="tdbg" width="80">皖信盖章</td>
                      <td width="100"></td>
                    </tr>
                    <tr>
                      <td class="tdbg">结算主体</td>
                      <td colspan="5">{{ item.forecastForm.departName }}</td>
                    </tr>
                    <tr>
                      <td class="tdbg">结算时间</td>
                      <td colspan="5">{{ item.forecastBill.billDate }}</td>
                    </tr>
                    <tr>
                      <td class="tdbg">序号</td>
                      <td
                        class="tdbg"
                        colspan="2"
                      >费用项目</td>
                      <td class="tdbg">金 额</td>
                      <td class="tdbg">增值税金</td>
                      <td class="tdbg">开票金额</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td rowspan="4">
                        {{ item.forecastBill.payMonths }}
                      </td>
                      <td class="tdbg" width="130">应缴单位社保</td>
                      <td>{{ item.forecastBill.unitSocial * 1 }}</td>
                      <td>{{ item.forecastBill.unitSocialTax * 1 }}</td>
                      <td>{{ formatFloat(item.forecastBill.unitSocial * 1 + item.forecastBill.unitSocialTax * 1) }}</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td class="tdbg">代扣个人社保</td>
                      <td>{{ item.forecastBill.personalSocial * 1 }}</td>
                      <td>{{ item.forecastBill.personalSocialTax * 1 }}</td>
                      <td>{{ formatFloat(item.forecastBill.personalSocial * 1 + item.forecastBill.personalSocialTax * 1) }}</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td class="tdbg">应缴单位公积金</td>
                      <td>{{ item.forecastBill.unitProvident * 1 }}</td>
                      <td>{{ item.forecastBill.unitProvidentTax * 1 }}</td>
                      <td>{{ formatFloat(item.forecastBill.unitProvident * 1 + item.forecastBill.unitProvidentTax * 1) }}</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td class="tdbg">代扣个人公积金</td>
                      <td>{{ item.forecastBill.personalProvident * 1 }}</td>
                      <td>{{ item.forecastBill.personalProvidentTax * 1 }}</td>
                      <td>{{ formatFloat(item.forecastBill.personalProvident * 1 + item.forecastBill.personalProvidentTax * 1) }}</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td
                        colspan="2"
                        class="tdbg"
                      >单位社保差额</td>
                      <td>{{ item.forecastBill.unitSocialDiff * 1 }}</td>
                      <td>{{ item.forecastBill.unitSocialDiffTax * 1 }}</td>
                      <td>{{ formatFloat(item.forecastBill.unitSocialDiff * 1 + item.forecastBill.unitSocialDiffTax * 1) }}</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td
                        colspan="2"
                        class="tdbg"
                      >个人社保差额</td>
                      <td>{{ item.forecastBill.personalSocialDiff * 1 }}</td>
                      <td>{{ item.forecastBill.personalSocialDiffTax * 1 }}</td>
                      <td>{{ formatFloat(item.forecastBill.personalSocialDiff * 1 + item.forecastBill.personalSocialDiffTax * 1) }}</td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td
                        colspan="2"
                        class="tdbg"
                      >单位公积金差额</td>
                      <td>{{ item.forecastBill.unitPrividentDiff * 1 }}</td>
                      <td>{{ item.forecastBill.unitPrividentDiffTax * 1 }}</td>
                      <td>{{ formatFloat(item.forecastBill.unitPrividentDiff * 1 + item.forecastBill.unitPrividentDiffTax * 1) }}</td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td
                        colspan="2"
                        class="tdbg"
                      >个人公积金差额</td>
                      <td>{{ item.forecastBill.personalProvidentDiff * 1 }}</td>
                      <td>{{ item.forecastBill.personalProvidentDiffTax * 1 }}</td>
                      <td>{{ formatFloat(item.forecastBill.personalProvidentDiff * 1 + item.forecastBill.personalProvidentDiffTax * 1) }}</td>
                    </tr>
                    <tr>
                      <td>9</td>
                      <td
                        colspan="2"
                        class="tdbg"
                      >管理费差额</td>
                      <td>{{ item.forecastBill.managementFeeDiff * 1 }}</td>
                      <td>{{ item.forecastBill.managementFeeDiffTax * 1 }}</td>
                      <td>{{ formatFloat(item.forecastBill.managementFeeDiff * 1 + item.forecastBill.managementFeeDiffTax * 1) }}</td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td
                        colspan="2"
                        class="tdbg"
                      >服务人数</td>
                      <td>{{ item.forecastBill.serverPeopleNum * 1 }}</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>11</td>
                      <td
                        colspan="2"
                        class="tdbg"
                      >服务人次</td>
                      <td>{{ item.forecastBill.serverPeople * 1 }}</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>12</td>
                      <td
                        colspan="2"
                        class="tdbg"
                      >社保卡费</td>
                      <td>{{ item.forecastBill.socialCardFee * 1 }}</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>13</td>
                      <td
                        colspan="2"
                        class="tdbg"
                      >商险</td>
                      <td>{{ item.forecastBill.businessInsurance * 1 }}</td>
                      <td>{{ item.forecastBill.businessInsuranceTax * 1 }}</td>
                      <td>{{ formatFloat(item.forecastBill.businessInsurance * 1 + item.forecastBill.businessInsuranceTax * 1) }}</td>
                    </tr>
                    <tr>
                      <td>14</td>
                      <td
                        colspan="2"
                        class="tdbg"
                      >商险差额</td>
                      <td>{{ item.forecastBill.takingBalance * 1 }}</td>
                      <td>{{ item.forecastBill.takingBalanceTax * 1 }}</td>
                      <td>{{ formatFloat(item.forecastBill.takingBalance * 1 + item.forecastBill.takingBalanceTax * 1) }}</td>
                    </tr>
                    <tr>
                      <td>15</td>
                      <td
                        colspan="2"
                        class="tdbg"
                      >管理费</td>
                      <td>{{ item.forecastBill.managementFee * 1 }}</td>
                      <td>{{ item.forecastBill.managementFeeTax * 1 }}</td>
                      <td>{{ formatFloat(item.forecastBill.managementFee * 1 + item.forecastBill.managementFeeTax * 1) }}</td>
                    </tr>
                    <tr>
                      <td>16</td>
                      <td
                        colspan="2"
                        class="tdbg"
                      >管理费2</td>
                      <td>{{ item.forecastBill.managementFeeTwo * 1 }}</td>
                      <td>-</td>
                      <td>{{ item.forecastBill.managementFeeTwo * 1 }}</td>
                    </tr>
                    <template v-if="item.tforecastBillSubList && item.tforecastBillSubList.length">
                      <tr v-for="(element,key) in item.tforecastBillSubList" :key="key">
                        <td
                          colspan="3"
                          class="tdbg"
                        >{{ element.subName }}</td>
                        <td>{{ element.money }}</td>
                        <td>{{ element.tax }}</td>
                        <td>{{ element.ticket }}</td>
                      </tr>
                    </template>
                    <tr>
                      <td
                        colspan="3"
                        class="tdbg"
                      >结算金额合计</td>
                      <td>-</td>
                      <td>-</td>
                      <td>{{ item.forecastBill.billFeeSum * 1 }}</td>
                    </tr>
                    <tr>
                      <td
                        colspan="3"
                        class="tdbg"
                      >开票金额合计</td>
                      <td>-</td>
                      <td>-</td>
                      <td>{{ item.forecastBill.ticketFeeSum * 1 }}</td>
                    </tr>
                  </table>
                  <div v-if="index<detail.forecastVo.length-1" style="page-break-before:always;" ><br /></div>
                </div>
              </a-row>
              <!--预估发放结算单-->
            </a-card>
          </a-col>
        </a-row>
        <div style="page-break-after:always;" ><br /></div>
      </div>
      <div class="posite" v-if="detail.insuranceSettlementCover && detail.insuranceSettlementCover.length">
        <div
          class="rotate"
          v-for="(item,index) in detail.insuranceSettlementCover"
          :key="index"
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
              <td>
                <template v-if="item.type == 1">
                  {{ getDeparts(item.coverDetailList) }}
                </template>
                <template v-else>
                  {{ item.departNo }}
                </template>
              </td>
              <td
                :rowspan="getRow(item)"
                width="8"
                style="padding:0px 5px;border:none;"
              >附件 {{ detail.insuranceSettlementCover.length }} 张</td>
            </tr>
            <tr>
              <td colspan="2">单位</td>
              <td colspan="2">项目</td>
              <td>付款方式</td>
              <td>金额</td>
            </tr>
            <template v-if="item.type == 1">
              <tr v-for="(list,i) in item.coverDetailList" :key="list.id">
                <td colspan="2">{{ list.customerName }}-{{ list.departName }}</td>
                <template v-if="i == 0">
                  <td colspan="2" :rowspan="item.coverDetailList.length">{{ item.itemName }}</td>
                  <td :rowspan="item.coverDetailList.length">{{ filterDictText(payTypeOptions,item.payType) }}</td>
                </template>
                <td>{{ list.amount }}</td>
              </tr>
            </template>
            <template v-else-if="isCludeDh(item.departId)">
              <tr>
                <td colspan="2">
                  <span
                    v-for="(customer,i) in item.customerArr"
                    :key="i"
                    class="line"
                  >
                    {{ customer }}
                  </span>
                </td>
                <td colspan="2">{{ item.itemName }}</td>
                <td>{{ filterDictText(payTypeOptions,item.payType) }}</td>
                <td>{{ item.amount }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="2">{{ item.customerName }}-{{ item.departName }}</td>
                <td colspan="2">{{ item.itemName }}</td>
                <td>{{ filterDictText(payTypeOptions,item.payType) }}</td>
                <td>{{ item.amount }}</td>
              </tr>
            </template>
            <tr>
              <td colspan="2" class="bold">合计人民币：</td>
              <td colspan="3">{{ item.amountRmb }}</td>
              <td>{{ item.amount }}</td>
            </tr>
            <tr>
              <td class="bold">收款单位名称</td>
              <td>{{ item.receiptName }}</td>
              <td class="bold">账号</td>
              <td>{{ item.receiptBankNo }}</td>
              <td class="bold">开户行</td>
              <td>{{ item.receiptBankName }}</td>
            </tr>
            <tr>
              <td colspan="6"><span class="bold">备注</span>：{{ item.remark }}</td>
            </tr>
          </table>
          <div style="font-size:12px;">
            <a-col :span="3">公司领导：</a-col>
            <a-col :span="3">财务负责人：</a-col>
            <a-col :span="5">网银审核授权人：</a-col>
            <a-col :span="5">网银转账提交人：</a-col>
            <a-col :span="3">数据审核：</a-col>
            <a-col :span="4">制表人：{{ item.createUser }}</a-col>
          </div>
          <div style="page-break-after:always;clear:both;" ><br /></div>
        </div>
      </div>
      <a-col
        :span="24"
        style="padding-top:70px;"
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
            :dataSource="detail.businessInsuranceVos"
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
import { getItemName } from '@/utils/common'

export default {
  name:'InsuranceScanDetailPrint',
  data() {
    return {
      detail:{},
      settemColumns:[
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
          title:'原因',
          dataIndex:'cause',
        }
      ],
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
      salaryInfo:[],
      payTypeOptions:[], // 付款方式
      url:'/busiInsurance/tinsurancesettlementautoform/getVo/'
    }
  },
  created() {
    // 付款方式
    initDictOptions('insurance_payType').then((res) => {
      if (Number(res.code) === 200) {
        this.payTypeOptions = res.data
      }
    })
    if(this.$route.query.id){ //查询详情
      httpAction(this.url+this.$route.query.id,null,'get').then((res)=>{
        if(Number(res.code) === 200){
          // settleFormType 0普通工资发放 1工程类工资发放2预估发放
          res.data.insuranceSettlementCover.map(item=>{
            const arr = []
            if(/,/.test(item.customerName)){
              const customerNameArr = item.customerName.split(',')
              const departNameArr = item.departName.split(',')
              customerNameArr.forEach((items,index)=>{
                arr[index] = `${items}-${departNameArr[index]}`
              })
            }else{
              arr[0] = `${item.customerName}-${item.departName}`
            }
            item.customerArr = arr
            return item
          })
          this.detail = res.data
          switch(res.data.settleFormType){
            case "0":
              for (const item of res.data.salaryDetailVo) {
                this.salaryInfo.push([{
                  "id":item.settlementhForm.id,
                  "settleDepartName":item.settlementhForm.settleDepartName,
                  "belongDeptId":item.settlementhForm.settleDepartId,
                  "settleMonth":item.settlementhForm.settleMonth,
                  "settleDepartNo":item.settlementhForm.settleDepartNo,
                }])
              }
            break
            case "1":
              for (const item of res.data.engineerSettlementDetailVo) {
                this.salaryInfo.push([{
                  "id":item.engineerSettlementForm.id,
                  "settleDepartName":item.engineerSettlementForm.settleDepartName,
                  "belongDeptId":item.engineerSettlementForm.settleDepartId,
                  "settleMonth":item.engineerSettlementForm.settleMonth,
                  "settleDepartNo":item.engineerSettlementForm.settleDepartNo,
                }])
              }
              break
          }
          this.printer()
        }
      })
    }
  },
  methods: {
    moment,
    filterDictText,
    getItemName,
    // 精度处理
    formatFloat(f, digit = 2) {
      const m = Math.pow(10, digit)
      return Math.round(f * m) / m
    },
    isCludeDh(str){
      return (str.indexOf(",") > -1) ? true : false
    },
    getDeparts(arr){
      const departNo = arr.map(item=>{
        return item.departNo
      })
      return departNo.join(',')
    },
    getRow(item){
      return (String(item.type) === '1') ? (5+item.coverDetailList.length) : 6
    },
    printer(){
      setTimeout(function(){
        window.print()
      },1000)
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
.settlement tr{
  height:6px;
}
.cover tr {
  height: 36px;
  border: solid #999 1px;
}
.settlement tr td,.cover tr td {
  padding-left: 10px;
}
.settlement td.tdbg {
  background: #ddd;
  font-weight: bold;
  text-align: center;
}
.settlement td h6,.bold {
  font-weight: bold;
}
.center {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
h2{
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
.rotate{
  margin: 0 auto;
  width: 1000px;
  transform: rotate(-90deg);
  position: relative;
  top: 400px;
  right: 100px;
}
</style>
<style media="print">
@page {
  size:A4; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>