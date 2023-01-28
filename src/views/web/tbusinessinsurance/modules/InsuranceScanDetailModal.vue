<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    cancelText="关闭"
    :visible="visible"
    :maskClosable="false"
    :footer="null"
  >

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
      >
        <a-row>
          <a-col :span="24">
            <a-tabs
              default-active-key="1"
              :activeKey="insuranceActiveKey"
              @change="key => onTabChange(key)"
            >
              <a-tab-pane
                tab="商险明细"
                key="1"
              >
                <a-table
                  ref="table"
                  size="middle"
                  bordered
                  rowKey="id"
                  :columns="columns"
                  :dataSource="businessInsuranceVos"
                  :scroll="{ x: 1500}"
                >
                </a-table>
              </a-tab-pane>
              <a-tab-pane
                tab="商险差额明细"
                key="2"
              >
                <a-table
                  ref="table"
                  size="middle"
                  bordered
                  rowKey="id"
                  :columns="differenceBalance"
                  :dataSource="forcastBusinessInsuranceVos"
                  :scroll="{ x: 1500}"
                >
                </a-table>
              </a-tab-pane>
              <a-tab-pane
                tab="结算单"
                key="3"
              >
                <!--普通工资发放结算单-->
                <a-tabs v-if="model.salaryDetailVo && model.salaryDetailVo.length">
                  <a-tab-pane
                    v-for="(item,index) in model.salaryDetailVo"
                    :key="index"
                    :tab="'结算单'+(index+1)"
                  >
                    <a-card
                      title="基本信息"
                      :bordered="false"
                    >
                      <a-table
                        rowKey="id"
                        :columns="settemColumns"
                        :dataSource="[model.salaryDetailVo[index]['settlementhForm']]"
                        :pagination="false"
                      >
                      </a-table>
                    </a-card>
                    <a-card
                      title="费用信息"
                      :bordered="false"
                    >
                      <div class="tabDiv">
                        <h2>{{ item.settlementhForm.settleDepartName }}{{ item.settlementhForm.settleMonth }} - 结算单</h2>
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
                            <td class="tdbg">暂停发</td>
                            <td>{{ item.settlementhForm.pausePay }}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td rowspan="4">{{ item.settlementhForm.settleMonth }}</td>
                            <td class="tdbg">代缴单位社保</td>
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
                            <td class="tdbg">代缴单位公积金</td>
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
                            <td rowspan="4">{{ item.settlementhForm.settleMonth }}</td>
                            <td class="tdbg">预收单位社保</td>
                            <td>{{ item.settlementhForm.unitFund }}</td>
                            <td>{{ item.settlementhForm.unitFundTax }}</td>
                            <td>{{ item.settlementhForm.unitFundTicket }}</td>
                          </tr>
                          <tr>
                            <td class="tdbg">预收单位公积金</td>
                            <td>{{ item.settlementhForm.withholidingPersonFund }}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td class="tdbg">预收个人社保</td>
                            <td>{{ item.settlementhForm.noSalaryUnitFund }}</td>
                            <td>{{ item.settlementhForm.noSalaryUnitFundTax }}</td>
                            <td>{{ item.settlementhForm.noSalaryUnitFundTicket }}</td>
                          </tr>
                          <tr>
                            <td class="tdbg">预收个人公积金</td>
                            <td>{{ item.settlementhForm.noSalaryPersonalFund }}</td>
                            <td>{{ item.settlementhForm.noSalaryPersonalFundTax }}</td>
                            <td>{{ item.settlementhForm.noSalaryPersonalFundTicket }}</td>
                          </tr>
                          <tr>
                            <td
                              class="tdbg"
                              colspan="2"
                            >代扣当月个税</td>
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
                            <td
                              colspan="2"
                              class="tdbg"
                            >人次</td>
                            <td>{{ item.settlementhForm.personTime }}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td
                              colspan="2"
                              class="tdbg"
                            >管理费</td>
                            <td>{{ item.settlementhForm.managementMoney }}</td>
                            <td>{{ item.settlementhForm.managementMoneyTax }}</td>
                            <td>{{ item.settlementhForm.managementMoneyTicket }}</td>
                          </tr>
                          <tr>
                            <td
                              colspan="2"
                              class="tdbg"
                            >管理费2</td>
                            <td>{{ item.settlementhForm.managementMoneyTwo }}</td>
                            <td>{{ item.settlementhForm.managementMoneyTwoTax }}</td>
                            <td>{{ item.settlementhForm.managementMoneyTwoTicket }}</td>
                          </tr>
                          <tr>
                            <td
                              colspan="2"
                              class="tdbg"
                            >结算金额合计</td>
                            <td>{{ item.settlementhForm.countTax }}</td>
                            <td>{{ item.settlementhForm.accountMoneySum }}</td>
                          </tr>
                          <tr>
                            <td
                              colspan="2"
                              class="tdbg"
                            >开票金额合计</td>
                            <td>{{ item.settlementhForm.managementMoneyTwo }}</td>
                            <td>{{ item.settlementhForm.managementMoneyTwoTax }}</td>
                            <td>{{ item.settlementhForm.managementMoneyTwoTicket }}</td>
                          </tr>
                          <tr>
                            <td
                              colspan="2"
                              class="tdbg"
                            >上月差余额</td>
                            <td>{{ item.settlementhForm.managementMoneyTwo }}</td>
                            <td>{{ item.settlementhForm.managementMoneyTwoTax }}</td>
                            <td>{{ item.settlementhForm.managementMoneyTwoTicket }}</td>
                          </tr>
                          <tr>
                            <td
                              colspan="2"
                              class="tdbg"
                            >本月差余额</td>
                            <td>{{ item.settlementhForm.managementMoneyTwo }}</td>
                            <td>{{ item.settlementhForm.managementMoneyTwoTax }}</td>
                            <td>{{ item.settlementhForm.managementMoneyTwoTicket }}</td>
                          </tr>

                          <tr>
                            <td
                              colspan="2"
                              class="tdbg"
                            >备注</td>
                            <td colspan="3">{{ item.settlementhForm.remark }}</td>
                          </tr>
                          <!-- <tr>
                            <td class="tdbg">发票类型</td>
                            <td class="tdbg">扣除金额</td>
                            <td class="tdbg">不含税金额</td>
                            <td class="tdbg">税额</td>
                            <td class="tdbg">发票合计金额</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
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
                        :dataSource="item.poorBalanceInfoList"
                        :pagination="false"
                      >
                      </a-table>
                    </a-card>
                  </a-tab-pane>
                </a-tabs>
                <!--普通工资发放结算单-->
                <!--工程类工资结算单-->
                <a-tabs v-if="model.engineerSettlementDetailVo && model.engineerSettlementDetailVo.length">
                  <a-tab-pane
                    v-for="(item,index) in model.engineerSettlementDetailVo"
                    :key="index"
                    :tab="'结算单'+(index+1)"
                  >
                    <a-card
                      title="基本信息"
                      :bordered="false"
                    >
                      <a-table
                        rowKey="id"
                        :columns="settemColumns"
                        :dataSource="[model.engineerSettlementDetailVo[index]['engineerSettlementForm']]"
                        :pagination="false"
                      >
                      </a-table>
                    </a-card>
                    <a-card
                      title="费用信息"
                      :bordered="false"
                    >
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
                            <td class="tdbg">代缴单位社保</td>
                            <td>{{ item.engineerSettlementForm.usocialDeduction }}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td class="tdbg">代缴个人社保</td>
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
                            >其他费用</td>
                            <td>{{ item.engineerSettlementForm.other }}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td
                              class="tdbg"
                              colspan="2"
                            >代扣个人社保{{ item.engineerSettlementForm.settleMonth }} </td>
                            <td>{{ item.engineerSettlementForm.other }}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td
                              class="tdbg"
                              colspan="2"
                            >代扣单位社保{{ item.engineerSettlementForm.settleMonth }}</td>
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
                    <a-card
                      title="差余额"
                      :bordered="false"
                    >
                      <a-table
                        rowKey="id"
                        :columns="balanceColumns"
                        :dataSource="item.poorBalanceInfoList"
                        :pagination="false"
                      >
                      </a-table>
                    </a-card>
                  </a-tab-pane>
                </a-tabs>
                <!--工程类工资结算单-->
                <!--预估发放结算单-->
                <a-tabs
                  v-if="model.forecastVo && model.forecastVo.length"
                >
                  <a-tab-pane
                    v-for="(item,index) in model.forecastVo"
                    :key="index"
                    :tab="'结算单'+(index+1)"
                  >
                    <div class="tabDiv">
                      <h2>{{ item.forecastForm.unitName }}{{ item.forecastBill.billDate }} - 结算单</h2>
                      <table
                        border="1"
                        class="settlement"
                      >
                        <tr>
                          <td class="tdbg">单位名称</td>
                          <td colspan="2">{{ item.forecastForm.unitName }}</td>
                          <td class="tdbg">皖信盖章</td>
                          <td width="120"></td>
                        </tr>
                        <tr>
                          <td class="tdbg">结算主体</td>
                          <td colspan="4">{{ item.forecastForm.departName }}</td>
                        </tr>
                        <tr>
                          <td class="tdbg">结算时间</td>
                          <td colspan="5">{{ item.forecastBill.billDate }}</td>
                        </tr>
                        <tr>
                          <td
                            class="tdbg"
                            colspan="2"
                          >费用项目</td>
                          <td class="tdbg">金额</td>
                          <td class="tdbg">增值税金</td>
                          <td class="tdbg">开票金额</td>
                        </tr>
                        <tr>
                          <td rowspan="4">
                            <div
                              style="width:150px;white-space: nowrap;text-overflow:ellipsis;overflow:hidden;text-align:center;"
                              :title="item.forecastBill.payMonths"
                            >{{ item.forecastBill.payMonths }}</div>
                          </td>
                          <td class="tdbg">应缴单位社保</td>
                          <td>{{ item.forecastBill.unitSocial * 1 }}</td>
                          <td>{{ item.forecastBill.unitSocialTax * 1 }}</td>
                          <td>{{ formatFloat(item.forecastBill.unitSocial * 1 + item.forecastBill.unitSocialTax * 1) }}</td>
                        </tr>
                        <tr>
                          <td class="tdbg">代扣个人社保</td>
                          <td>{{ item.forecastBill.personalSocial * 1 }}</td>
                          <td>{{ item.forecastBill.personalSocialTax * 1 }}</td>
                          <td>{{ formatFloat(item.forecastBill.personalSocial * 1 + item.forecastBill.personalSocialTax * 1) }}</td>
                        </tr>
                        <tr>
                          <td class="tdbg">应缴单位公积金</td>
                          <td>{{ item.forecastBill.unitProvident * 1 }}</td>
                          <td>{{ item.forecastBill.unitProvidentTax * 1 }}</td>
                          <td>{{ formatFloat(item.forecastBill.unitProvident * 1 + item.forecastBill.unitProvidentTax * 1) }}</td>
                        </tr>
                        <tr>
                          <td class="tdbg">代扣个人公积金</td>
                          <td>{{ item.forecastBill.personalProvident * 1 }}</td>
                          <td>{{ item.forecastBill.personalProvidentTax * 1 }}</td>
                          <td>{{ formatFloat(item.forecastBill.personalProvident * 1 + item.forecastBill.personalProvidentTax * 1) }}</td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >单位社保差余额</td>
                          <td>{{ item.forecastBill.unitSocialDiff * 1 }}</td>
                          <td>{{ item.forecastBill.unitSocialDiffTax * 1 }}</td>
                          <td>{{ formatFloat(item.forecastBill.unitSocialDiff * 1 + item.forecastBill.unitSocialDiffTax * 1) }}</td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >个人社保差余额</td>
                          <td>{{ item.forecastBill.personalSocialDiff * 1 }}</td>
                          <td>{{ item.forecastBill.personalSocialDiffTax * 1 }}</td>
                          <td>{{ formatFloat(item.forecastBill.personalSocialDiff * 1 + item.forecastBill.personalSocialDiffTax * 1) }}</td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >单位公积金差余额</td>
                          <td>{{ item.forecastBill.unitPrividentDiff * 1 }}</td>
                          <td>{{ item.forecastBill.unitPrividentDiffTax * 1 }}</td>
                          <td>{{ formatFloat(item.forecastBill.unitPrividentDiff * 1 + item.forecastBill.unitPrividentDiffTax * 1) }}</td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >个人公积金差余额</td>
                          <td>{{ item.forecastBill.personalProvidentDiff * 1 }}</td>
                          <td>{{ item.forecastBill.personalProvidentDiffTax * 1 }}</td>
                          <td>{{ formatFloat(item.forecastBill.personalProvidentDiff * 1 + item.forecastBill.personalProvidentDiffTax * 1) }}</td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >社保卡费</td>
                          <td>{{ item.forecastBill.socialCardFee * 1 }}</td>
                          <td>-</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >管理费差额</td>
                          <td>{{ item.forecastBill.managementFeeDiff * 1 }}</td>
                          <td>{{ item.forecastBill.managementFeeDiffTax * 1 }}</td>
                          <td>{{ formatFloat(item.forecastBill.managementFeeDiff * 1 + item.forecastBill.managementFeeDiffTax * 1) }}</td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >服务人数</td>
                          <td>{{ item.forecastBill.serverPeopleNum * 1 }}</td>
                          <td>-</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >服务人次</td>
                          <td>{{ item.forecastBill.serverPeople * 1 }}</td>
                          <td>-</td>
                          <td>-</td>
                        </tr>

                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >商险</td>
                          <td>{{ item.forecastBill.businessInsurance * 1 }}</td>
                          <td>{{ item.forecastBill.businessInsuranceTax * 1 }}</td>
                          <td>{{ formatFloat(item.forecastBill.businessInsurance * 1 + item.forecastBill.businessInsuranceTax * 1) }}</td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >商险差额</td>
                          <td>{{ item.forecastBill.takingBalance * 1 }}</td>
                          <td>{{ item.forecastBill.takingBalanceTax * 1 }}</td>
                          <td>{{ formatFloat(item.forecastBill.takingBalance * 1 + item.forecastBill.takingBalanceTax * 1) }}</td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >管理费</td>
                          <td>{{ item.forecastBill.managementFee * 1 }}</td>
                          <td>{{ item.forecastBill.managementFeeTax * 1 }}</td>
                          <td>{{ formatFloat(item.forecastBill.managementFee * 1 + item.forecastBill.managementFeeTax * 1) }}</td>
                        </tr>
                        <tr>
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
                              colspan="2"
                              class="tdbg"
                            >{{ element.subName }}</td>
                            <td>{{ element.money }}</td>
                            <td>{{ element.tax }}</td>
                            <td>{{ element.ticket }}</td>
                          </tr>
                        </template>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >结算金额合计</td>
                          <td>-</td>
                          <td>-</td>
                          <td>{{ item.forecastBill.billFeeSum * 1 }}</td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >开票金额合计</td>
                          <td>-</td>
                          <td>-</td>
                          <td>{{ item.forecastBill.ticketFeeSum * 1 }}</td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            class="tdbg"
                          >备注</td>
                          <td colspan="3">{{ item.forecastBill.remark }}</td>
                        </tr>
                      </table>
                    </div>
                  </a-tab-pane>
                </a-tabs>
                <!--预估发放结算单-->
              </a-tab-pane>

              <a-tab-pane
                tab="封面"
                key="4"
              >
                <a-card v-if="insuranceSettlementCover.length > 0">
                  <a-tabs type="card">
                    <a-tab-pane
                      v-for="(item,index) in insuranceSettlementCover"
                      :key="index"
                      tab="封面"
                    >
                      <div class="headerWrap">
                        <div>
                          <h3 class="center">{{ item.tableHead }}</h3>
                          <h2 class="center">银行转账审批单</h2>
                        </div>
                        <a-button
                          v-has="'wxhr:insurance_invoice|wxhr:insurance_invoice2'"
                          v-if="isCanModifyInvoiceNo"
                          type="primary"
                          @click="modifyNumber(item)"
                        >修改发票号</a-button>
                      </div>
                      <table
                        class="cover"
                        border="1"
                      >
                        <tr>
                          <td colspan="2"></td>
                          <td colspan="2">{{ item.lssueTime ? moment(item.lssueTime).format('YYYY年MM月DD日') : '' }}</td>
                          <td>部门编码</td>
                          <td>
                            <template v-if="item.type == 1">
                              {{ getDeparts(item.coverDetailList) }}
                            </template>
                            <template v-else>
                              {{ item.departNo }}
                            </template>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">单位</td>
                          <td colspan="2">项目</td>
                          <td>付款方式</td>
                          <td>金额</td>
                        </tr>
                        <template v-if="item.type == 1">
                          <tr
                            v-for="(list,i) in item.coverDetailList"
                            :key="list.id"
                          >
                            <td colspan="2">{{ list.customerName }}-{{ list.departName }}</td>
                            <template v-if="i == 0">
                              <td
                                colspan="2"
                                :rowspan="item.coverDetailList.length"
                              >{{ item.itemName }}</td>
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
                          <td colspan="2">合计人民币：</td>
                          <td colspan="3">{{ item.amountRmb }}</td>
                          <td>{{ item.amount }}</td>
                        </tr>
                        <tr>
                          <td>收款单位名称</td>
                          <td>{{ item.receiptName }}</td>
                          <td>账号</td>
                          <td>{{ item.receiptBankNo }}</td>
                          <td>开户行</td>
                          <td>{{ item.receiptBankName }}</td>
                        </tr>
                        <tr>
                          <td colspan="6">备注：{{ item.remark }}</td>
                        </tr>
                      </table>
                      <div class="attach center">
                        附件 &nbsp;&nbsp;张
                      </div>
                      <a-row style="width: 90%;padding:10px 0px 0px 3%;clear:both;color:#333">
                        <a-col :span="4">公司领导: </a-col>
                        <a-col :span="4">财务负责人: </a-col>
                        <a-col :span="4">网银审核授权人: </a-col>
                        <a-col :span="4">网银转账提交人: </a-col>
                        <a-col :span="4">数据审核: {{ auditName }}</a-col>
                        <a-col :span="4">制表人: {{ createName }}</a-col>
                      </a-row>
                    </a-tab-pane>
                  </a-tabs>
                </a-card>
                <span v-else>
                  <a-empty description="暂无封面" />
                </span>
              </a-tab-pane>
              <a-tab-pane
                tab="流程进展明细"
                key="5"
              >
                <a-card
                  title="| 流程记录"
                  :style="{marginBottom:'30px',color:'#1890ff'}"
                >
                  <a-empty
                    description="暂无流程记录"
                    v-if="processList.length == 0"
                  />
                  <a-timeline
                    v-if="processList.length"
                    class="pbottom"
                  >
                    <a-timeline-item
                      v-for="(item,index) in processList"
                      :key="index"
                      :color="colorArr[item.auditStatus]"
                    >
                      <p><span>流程状态：</span>{{ auditStatus[item.auditStatus] }}</p>
                      <p><span>备注：</span>{{ item.auditRemark }}</p>
                      <p><span>操作人及时间：</span>{{ item.auditUser }} {{ item.createTime }}</p>
                    </a-timeline-item>
                  </a-timeline>
                </a-card>
                <a-card
                  title="| 上传表单详情"
                  :style="{marginBottom:'30px'}"
                >
                  <a-row style="margin-bottom:15px;">
                    <a-col :span="12">商险月份：{{ detail.settlementMonth }}</a-col>
                    <a-col :span="12">结算月份： {{ detail.settlementMonth }}</a-col>
                  </a-row>
                  <a-row style="margin-bottom:15px;">
                    <a-col :span="12">上传人： {{ detail.createUser }}</a-col>
                    <a-col :span="12">上传时间： {{ detail.createTime }}</a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="24">特别说明：{{ detail.remark }}</a-col>
                  </a-row>
                </a-card>

                <!-- <a-card
                  title="提交表单"
                  :style="{marginBottom:'30px' }"
                >
                  <a-row style="margin-bottom:15px;">
                    <a-col :span="12">
                      <a-form-item
                        label="结算金额"
                        class="stepFormText"
                      >
                        <a-input
                          v-decorator="['settlementAmountSum',{initialValue:detail.settlementAmountSum}]"
                          :disabled="true"
                          style="width: 200px"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item
                        label="开票金额"
                        class="stepFormText"
                      >
                        <a-input
                          placeholder="请输入开票金额"
                          style="width: 200px"
                          v-decorator="['ticketAmountSum',{initialValue:detail.ticketAmountSum}]"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="24">
                      <a-form-item
                        label="备注"
                        class="stepFormText"
                      >
                        <a-textarea
                          placeholder="请输入备注"
                          style="width: 500px"
                          v-decorator="['remark',{initialValue:detail.remark}]"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-card> -->
                <a-row
                  type="flex"
                  justify="center"
                >
                  <a-col
                    :span="3"
                    :offset="1"
                  >
                    <a-button
                      type="primary"
                      @click="handlePrint"
                      block
                      :size="'large'"
                    >打印</a-button>
                  </a-col>
                  <a-col
                    :span="3"
                    :offset="1"
                  >
                    <a-button
                      type="primary"
                      @click="handleOutImport"
                      block
                      :size="'large'"
                    >导出</a-button>
                  </a-col>
                  <a-col
                    :span="3"
                    :offset="1"
                  >
                    <a-button
                      type="primary"
                      block
                      :size="'large'"
                      @click="handleCancel"
                    >取消</a-button>
                  </a-col>
                </a-row>

              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <cover-modify-number-modal ref="coverModifyNumberModal"></cover-modify-number-modal>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
import { httpAction } from '@/api/manage'
import { getItemName } from '@/utils/common'
import CoverModifyNumberModal from './CoverModifyNumberModal'

export default {
  name: 'InsuranceScanDetailModal',
  components:{
    CoverModifyNumberModal
  },
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      moment,
      confirmLoading: false,
      form: this.$form.createForm(this),
      colorArr:['blue','green','red','green','blue'],
      auditStatus:['待审核','已通过','未通过','已委托','提交审核'],
      settleTypeOptions:[],
      businessInsuranceVos:[], //商险派单信息
      forcastBusinessInsuranceVos:[], // 商险差额明细
      insuranceSettlementCover:[], //商险结算封面
      statusOptions:[], //结算主体
      payTypeOptions:[], //付款方式
      detail:{},
      statementBill:[], //结算单
      processList:[],
      // dataSource: [],
      salaryInfo:[], //结算单基本信息
      settleDepartNo:[], //结算部门编号
      withholdData:[], //标准薪酬结算单子项
      balanceData:[], //差余额
      createName:'',
      auditName:'',
      type:0, //0普通工资发放 1工程类工资发放2预估发放
      activeKey:0,
      insuranceActiveKey:"1", // 详情tabindex
      isCanModifyInvoiceNo:false, // 是否可以在封面上修改发票号
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
      columns:[
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'settlementOrganNo'
        },
        {
          title: '结算主体名称',
          align: 'center',
          dataIndex: 'settlementOrganName'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'empName'
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'empIdcardNo'
        },
        {
          title: '险种',
          align: 'center',
          dataIndex: 'insuranceTypeName'
        },
        {
          title: '保险公司',
          align: 'center',
          dataIndex: 'insuranceCompanyName'
        },
        {
          title: '保单号',
          align: 'center',
          dataIndex: 'policyNo'
        },
        {
          title: '保单开始时间',
          align: 'center',
          dataIndex: 'policyStart'
        },
        {
          title: '保单结束时间',
          align: 'center',
          dataIndex: 'policyEnd'
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
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender: (text) => {
            return filterDictText(this.statusOptions,text)
          }
        },
      ],
      differenceBalance:[], // 商险差额明细列表
      differenceBalanceLoaded:false, // 商险差额明细列数据加载过
      url:{
        editUrl:'/busiInsurance/tinsurancesettlementform/ensure',
        importUrl:'busiInsurance/tinsurancesettlementautoform/export',
        process:'/busiInsurance/tinsurancesettlementautoform/queryFlowById/'
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      }
    }
  },
  methods: {
    filterDictText,
    getItemName,
    isCludeDh(str){
      return (str.indexOf(",") != -1) ? true : false
    },
    // 精度处理
    formatFloat(f, digit = 2) {
      const m = Math.pow(10, digit)
      return Math.round(f * m) / m
    },
    onTabChange(key){
      this.insuranceActiveKey = key;
      if(Number(key) === 2 && Boolean(this.differenceBalanceLoaded) === false){ // 商险差额数据
        // 组装商险差额列表的列数据
        // eslint-disable-next-line
        this.differenceBalance =  _.cloneDeep(this.columns)
        this.differenceBalance.splice(11,0,{
            title: '预估保费',
            align: 'center',
            dataIndex: 'forecastBuyPay'
          })
        this.differenceBalance.splice(12,0,{
          title: '差额',
          align: 'center',
          customRender: (text,record) => {
            return Math.round((Number(record.buyPay) - Number(record.forecastBuyPay))*100)/100
          }
        })
        this.differenceBalanceLoaded = true
      }
    },
    show(record) {
      this.model = Object.assign({}, record)
      this.forcastBusinessInsuranceVos = this.model.forcastBusinessInsuranceVos
      this.initDictConfig()
      this.visible = true

      //流程状态
      httpAction(this.url.process+record.id, null, 'GET').then((res) => {
        if (Number(res.code) === 200) {
          this.processList = res.data
        }
      })
    },
    getDeparts(arr){
      const departNo = arr.map(item=>{
        return item.departNo
      })
      return departNo.join(',')
    },
    getSalaryDetailVo(salaryDetailVo){
      const excelDatas = []
      if(salaryDetailVo && salaryDetailVo.length){
        const salarySubLength = []
        salaryDetailVo.forEach((item,index)=>{
          const settelData = [
            {'index':item.settlementhForm.settleDepartName+item.settlementhForm.settleMonth + '结算单','data':'','project':'','money':'','account':''},
            {'index':'结算主体','data':item.settlementhForm.settleDepartName,'project':'','money':'皖信盖章','account':''},
            {'index':'结算日期','data':item.settlementhForm.settleMonth,'project':'','money':'','account':''},
            {'index':'费用项目','data':'','project':'金额','money':'税费','account':'开票额小计'},
            {'index':item.settlementhForm.settleMonth,'data':'应发工资','project':item.settlementhForm.salarySum,'money':item.settlementhForm.salaryTax,'account':item.settlementhForm.salaryTicket},
            {'index':'','data':'实发工资（银付）','project':item.settlementhForm.cardPay,'money':'','account':''},
            {'index':'','data':'实发工资(现金)','project':item.settlementhForm.moneyPay,'money':'','account':''},
            {'index':'','data':'暂停发','project':item.settlementhForm.pausePay,'money':item.settlementhForm.managementMoneyTax,'account':item.settlementhForm.managementMoneyTicket},
            {'index':item.settlementhForm.settleMonth,'data':'代缴单位社保','project':item.settlementhForm.unitSocial,'money':'','account':''},
            {'index':'','data':'代扣个人社保','project':item.settlementhForm.withholidingPersonSocial,'money':'','account':''},
            {'index':'','data':'没工资员工单位保险','project':item.settlementhForm.noSalaryUnitSocial,'money':item.settlementhForm.noSalaryUnitSocialTax,'account':item.settlementhForm.noSalaryUnitSocialTicket},
            {'index':'','data':'没工资员工个人保险','project':item.settlementhForm.noSalaryPersonSocial,'money':item.settlementhForm.noSalaryPersonSocialTax,'account':item.settlementhForm.noSalaryPersonSocialTicket},
            {'index':item.settlementhForm.settleMonth,'data':'代缴单位公积金','project':item.settlementhForm.unitFund,'money':item.settlementhForm.unitFundTax,'account':item.settlementhForm.unitFundTicket},
            {'index':'','data':'代扣个人公积金','project':item.settlementhForm.withholidingPersonFund,'money':'','account':''},
            {'index':'','data':'没工资员工单位公积金','project':item.settlementhForm.noSalaryUnitFund,'money':item.settlementhForm.noSalaryUnitFundTax,'account':item.settlementhForm.noSalaryUnitFundTicket},
            {'index':'','data':'没工资员工个人公积金','project':item.settlementhForm.noSalaryPersonalFund,'money':item.settlementhForm.noSalaryPersonalFundTax,'account':item.settlementhForm.noSalaryPersonalFundTicket},
            {'index':item.settlementhForm.settleMonth,'data':'预收单位社保','project':item.settlementhForm.advanceUnitSocial,'money':item.settlementhForm.advanceUnitSocialTax,'account':item.settlementhForm.advanceUnitSocialTicket},
            {'index':'','data':'预收单位公积金','project':item.settlementhForm.advanceUnitFund,'money':item.settlementhForm.advanceUnitFundTax,'account':item.settlementhForm.advanceUnitFundTicket},
            {'index':'','data':'预收个人社保','project':item.settlementhForm.advancePersonalSocial,'money':item.settlementhForm.advancePersonalSocialTax,'account':item.settlementhForm.advancePersonalSocialTicket},
            {'index':'','data':'预收个人公积金','project':item.settlementhForm.advancePersonalFund,'money':item.settlementhForm.advancePersonalFundTax,'account':item.settlementhForm.advancePersonalFundTicket},
            {'index':'商险金额','data':'','project':item.settlementhForm.takingRisks,'money':item.settlementhForm.takingRisksTax,'account':item.settlementhForm.takingRisksTicket},
            {'index':'商险预估差额','data':'','project':item.settlementhForm.takingBalance||'0','money':item.settlementhForm.takingBalanceTax||'0','account':item.settlementhForm.takingBalanceTicket||'0'},
          ]
          item.settlementhFormSubList.forEach((items)=>{
            settelData.push({
              'index':getItemName(items.itemTypeName,items.subName),'data':'','project':items.money,'money':items.tax || ' ',account:items.ticket
            })
          })
          salarySubLength.push(item.settlementhFormSubList.length)
          const settelDatas = settelData.concat(
            [{'index':'风险金','data':'','project':item.settlementhForm.riskFund,'money':item.settlementhForm.riskFundTax,'account':item.settlementhForm.riskFundTicket},
            {'index':'人数','data':'','project':item.settlementhForm.personNum,'money':'','account':''},
            {'index':'人次','data':'','project':item.settlementhForm.personTime,'money':'','account':''},
            {'index':'管理费','data':'','project':item.settlementhForm.managementMoney,'money':item.settlementhForm.managementMoneyTax,'account':item.settlementhForm.managementMoneyTicket},
            {'index':'管理费2','data':'','project':item.settlementhForm.managementMoneyTwo||'','money':item.settlementhForm.managementMoneyTwoTax,'account':item.settlementhForm.managementMoneyTwoTicket},
            {'index':'结算金额合计','data':'','project':'','money':item.settlementhForm.countTax,'account':item.settlementhForm.accountMoneySum},
            {'index':'开票金额合计','data':'','project':'','money':'','account':item.settlementhForm.ticketMoneySum},
            {'index':'上月差余额','data':'','project':'','money':'','account':item.settlementhForm.prevPoorBalance},
            {'index':'本月差余额','data':'','project':'','money':'','account':item.settlementhForm.curPoorBalance},
            {'index':'备注','data':item.settlementhForm.remark,'project':'','money':'','account':''},
            {'index':'发票类型','data':'扣除金额','project':'不含税金额','money':'税额','account':'发票合计金额'},
            {'index':item.settlementhForm.ticketType||'','data':item.settlementhForm.deductionAmount||'','project':item.settlementhForm.noTaxAmount||'','money':item.settlementhForm.taxAmount||'','account':item.settlementhForm.ticketSumAmount||''},
          ])
          excelDatas.push({
            tHeader: ["序号","名称","费用项目", "金额", "开票额小计"],
            filterVal: ['index','data',"project", "money", "account"],
            tableDatas: settelDatas,
            sheetName: "普通薪资结算单"+(index+1)
          })
        })
        return {salaryLength:salaryDetailVo.length,salarySub:salarySubLength,excelDatas:excelDatas}
      }else{
        return {salaryLength:0,excelDatas:excelDatas,salarySub:[]}
      }
    },
    getEngineerSettlementDetailVo(engineerSettlementDetailVo){
      const excelDatas = []
      if(engineerSettlementDetailVo && engineerSettlementDetailVo.length){
        const engineerSalarySubLength = []
        engineerSettlementDetailVo.forEach((item,index)=>{
          const settelData = [
            {'index':item.engineerSettlementForm.settleDepartName+item.engineerSettlementForm.settleMonth + '结算单','data':'','project':'','money':''},
            {'index':'结算主体','data':item.engineerSettlementForm.settleDepartName,'project':'','money':''},
            {'index':'开票名称','data':item.engineerSettlementForm.settleDepartName,'project':'','money':''},
            {'index':'结算时间','data':item.engineerSettlementForm.settleMonth,'project':'','money':''},
            {'index':'日期','data':'费用项目','project':'金额','money':'开票额小计'},
            {'index':item.engineerSettlementForm.salaryMonth,'data':'应发工资','project':item.engineerSettlementForm.salarySum,'money':item.engineerSettlementForm.salaryTicket},
            {'index':item.engineerSettlementForm.salaryMonth,'data':'实发工资（银付）','project':item.engineerSettlementForm.cardPay,'money':''},
            {'index':item.engineerSettlementForm.salaryMonth,'data':'暂停发','project':item.engineerSettlementForm.pausePay,'money':''},
            {'index':item.engineerSettlementForm.socialMonth || '','data':'代缴单位社保','project':item.engineerSettlementForm.usocialDeduction,'money':''},
            {'index':item.engineerSettlementForm.socialMonth || '','data':'代缴个人社保','project':item.engineerSettlementForm.psocialDeduction,'money':''},
            {'index':'雇主责任险','data':'','project':item.engineerSettlementForm.employerLiabilityInsurance,'money':''},
            {'index':'商险预估差额','data':'','project':item.engineerSettlementForm.takingBalance||'','money':''},
            {'index':'其他费用','data':'','project':item.engineerSettlementForm.other||'','money':''},
          ]
          engineerSalarySubLength.push(item.engineerSettlementhFormSubList.length)
          item.engineerSettlementhFormSubList.forEach((items)=>{
            settelData.push({
              'index':getItemName(items.itemTypeName,items.subName),'data':'','project':items.money,'money':items.ticket||''
            })
          })
          const settelDatas = settelData.concat([
            {'index':'增值税金及附加','data':'','project':item.engineerSettlementForm.valueDaddedTax,'money':item.engineerSettlementForm.valueDaddedTaxTicket},
            {'index':'预缴企业所得税','data':'','project':item.engineerSettlementForm.unitIncomeTax||'','money':item.engineerSettlementForm.unitIncomeTaxTicket||''},
            {'index':'人数','data':'','project':item.engineerSettlementForm.personCount,'money':''},
            {'index':'管理费','data':'','project':item.engineerSettlementForm.managementCost,'money':item.engineerSettlementForm.managementCostTicket},
            {'index':'结算金额合计','data':'','project':'','money':item.engineerSettlementForm.accountMoneySum},
            {'index':'备注','data':item.engineerSettlementForm.remark,'project':'','money':''}
          ])
          excelDatas.push({
            tHeader: ["序号","名称","费用项目", "金额", "开票额小计"],
            filterVal: ['index','data',"project", "money", "account"],
            tableDatas: settelDatas,
            sheetName: "工程薪资结算单"+(index+1)
          })
        })
        return {engineerSalaryLength:engineerSettlementDetailVo.length,salaryEngineerSub:engineerSalarySubLength,excelDatas:excelDatas}
      }else{
        return {engineerSalaryLength:0,salaryEngineerSub:[],excelDatas:excelDatas}
      }
    },
    getForecastVo(forecastVo){
      const excelDatas = []
      let tforecastBillSubList = []
      forecastVo.forEach((item,index)=>{
        tforecastBillSubList[index] = 0
        const settelData = [
          {'index':item.forecastBill.billDate+item.forecastForm.departName + '结算单','data':'','project':'','money':'','account':''},
          {'index':'结算主体','data':item.forecastForm.departName+'('+item.forecastForm.departNo+')','project':'','money':'皖信盖章','account':''},
          {'index':'结算日期','data':item.forecastBill.billDate,'project':'','money':'','account':''},
          {'index':'费用项目','data':'','project':'金额','money':'税费','account':'开票额小计'},
          {'index':item.forecastBill.payMonths,'data':'代缴单位社保','project':item.forecastBill.unitSocial,'money':item.forecastBill.unitSocialTax||'0','account':(item.forecastBill.unitSocial+item.forecastBill.unitSocialTax)},
          {'index':'','data':'代扣个人社保','project':item.forecastBill.personalSocial,'money':item.forecastBill.personalSocialTax||'0','account':(item.forecastBill.personalSocial+item.forecastBill.personalSocialTax)},
          {'index':item.forecastBill.payMonths,'data':'代缴单位公积金','project':item.forecastBill.unitProvident,'money':item.forecastBill.unitProvidentTax||'0','account':(item.forecastBill.unitProvident+item.forecastBill.unitProvidentTax)},
          {'index':'','data':'代扣个人公积金','project':item.forecastBill.personalProvident,'money':item.forecastBill.personalProvidentTax||'0','account':(item.forecastBill.personalProvident+item.forecastBill.personalProvidentTax)},
          {'index':'单位社保差余额','data':'','project':item.forecastBill.unitSocialDiff||'','money':0,'account':item.forecastBill.unitSocialDiff||''},
          {'index':'个人社保差余额','data':'','project':item.forecastBill.personalSocialDiff||'','money':0,'account':item.forecastBill.personalSocialDiff||''},
          {'index':'单位公积金差余额','data':'','project':item.forecastBill.unitPrividentDiff||'','money':item.forecastBill.unitProvidentTax||'0','account':(item.forecastBill.unitPrividentDiff+item.forecastBill.unitProvidentTax)},
          {'index':'个人公积金差余额','data':'','project':item.forecastBill.personalProvidentDiff||'','money':0,'account':item.forecastBill.personalProvidentDiff||''},
          {'index':'社保卡费','data':'','project':item.forecastBill.socialCardFee,'money':'','account':item.forecastBill.socialCardFee},
          {'index':'服务人次','data':'','project':item.forecastBill.serverPeople,'money':'','account':''},
          {'index':'服务人数','data':'','project':item.forecastBill.serverPeopleNum,'money':'','account':''},
          {'index':'商险','data':'','project':item.forecastBill.businessInsurance,'money':item.forecastBill.businessInsuranceTax||'0','account':(item.forecastBill.businessInsurance+item.forecastBill.businessInsuranceTax)},
          {'index':'商险差额','data':'','project':item.forecastBill.takingBalance||'','money':item.forecastBill.takingBalanceTax||'0','account':(item.forecastBill.takingBalance+item.forecastBill.takingBalanceTax)},
          {'index':'管理费','data':'','project':item.forecastBill.managementFee,'money':item.forecastBill.managementFeeTax||'0','account':(item.forecastBill.managementFee+item.forecastBill.managementFeeTax)},
          {'index':'管理费2','data':'','project':item.forecastBill.managementFeeTwo||'','money':0,'account':item.forecastBill.managementFeeTwo||''},

          // {'index':'结算金额合计','data':'','project':'','money':'','account':item.forecastBill.billFeeSum},
          // {'index':'开票金额合计','data':'','project':'','money':'','account':item.forecastBill.ticketFeeSum},
          // {'index':'备注','data':item.forecastBill.remark||'','project':'','money':'','account':''},
        ]
        if(item.tforecastBillSubList && item.tforecastBillSubList.length){
          tforecastBillSubList[index] = item.tforecastBillSubList.length
          item.tforecastBillSubList.forEach(element=>{
            settelData.push({'index':element.subName,'data':'','project':element.money,'money':element.tax,'account':element.ticket})
          })
        }

        settelData.push({'index':'结算金额合计','data':'','project':'','money':'','account':item.forecastBill.billFeeSum})
        settelData.push({'index':'开票金额合计','data':'','project':'','money':'','account':item.forecastBill.ticketFeeSum})
        settelData.push({'index':'备注','data':item.forecastBill.remark||'','project':'','money':'','account':''})

        excelDatas.push({
          tHeader: ["序号","名称","费用项目", "金额", "开票额小计"],
          filterVal: ['index','data',"project", "money", "account"],
          tableDatas: settelData,
          sheetName: "预估库结算单"+(index+1)
        })
      })
      return {forecastVoLength:forecastVo.length,excelDatas:excelDatas,tforecastBillSubList:tforecastBillSubList}
    },
    handleOutImport(){
      // 商险明细
      const insuranceArr = this.model.businessInsuranceVos || []
      const insuranceData = insuranceArr.map(item=>{
        item.remark = item.remark || ''
        item.forecastBuyPay = item.forecastBuyPay || ''
        item.balance = Number(item.buyPay) - Number(item.forecastBuyPay)
        item.settleType = filterDictText(this.settleTypeOptions,item.settleType)
        return item
      })
      // 商险预估明细
      const forcasInsuranceArr = this.model.forcastBusinessInsuranceVos || []
      const forcasInsuranceData = forcasInsuranceArr.map(item=>{
        item.remark = item.remark || ''
        item.forecastBuyPay = item.forecastBuyPay || ''
        item.balance = Number(item.buyPay) - Number(item.forecastBuyPay)
        item.settleType = filterDictText(this.settleTypeOptions,item.settleType)
        return item
      })
      const excelDatas = [
        {
          tHeader: ["结算主体编码", "结算类型","结算主体名称","姓名","身份证号码","险种","起保时间","截止时间","保单号","购买标准","实际保费","预估保费","差额","医疗","身故或残疾","备注"],
          filterVal: ['settlementOrganNo','settleType',"settlementOrganName", "empName","empIdcardNo", "insuranceTypeName","policyStart","policyEnd","policyNo","buyStandard","buyPay","forecastBuyPay","balance","medicalMoney","deathDisabilityMoney","remark"],
          tableDatas: insuranceData,
          sheetName: "商险明细"
        },
        {
          tHeader: ["结算主体编码", "结算类型","结算主体名称","姓名","身份证号码","险种","起保时间","截止时间","保单号","购买标准","实际保费","预估保费","差额","医疗","身故或残疾","备注"],
          filterVal: ['settlementOrganNo','settleType',"settlementOrganName", "empName","empIdcardNo", "insuranceTypeName","policyStart","policyEnd","policyNo","buyStandard","buyPay","forecastBuyPay","balance","medicalMoney","deathDisabilityMoney","remark"],
          tableDatas: forcasInsuranceData,
          sheetName: "商险差额明细"
        }
      ]
      let excelDataArr = excelDatas
      const autoLength = {salaryLength:0,salarySub:[],engineerSalaryLength:0,salaryEngineerSub:[],forecastVoLength:0,coverItems:[]}
      const res1 = this.getSalaryDetailVo(this.model.salaryDetailVo)
      if(res1.salaryLength){
        excelDataArr = excelDataArr.concat(res1.excelDatas)
      }
      autoLength.salaryLength = res1.salaryLength
      autoLength.salarySub = res1.salarySub
      const res2 = this.getEngineerSettlementDetailVo(this.model.engineerSettlementDetailVo)
      if(res2.engineerSalaryLength){
        excelDataArr = excelDataArr.concat(res2.excelDatas)
      }
      autoLength.engineerSalaryLength = res2.engineerSalaryLength
      autoLength.salaryEngineerSub = res2.salaryEngineerSub
      const res3 = this.getForecastVo(this.model.forecastVo)
      if(res3.forecastVoLength){
        excelDataArr = excelDataArr.concat(res3.excelDatas)
      }
      autoLength.forecastVoLength = res3.forecastVoLength
      autoLength.tforecastBillSubList = res3.tforecastBillSubList
      
      // const autoLength = {settleFormType:this.model.settleFormType,coverItems:[],count:0}
      // // 结算单
      // switch (this.model.settleFormType){
      //   case '0' :
      //     // 普通薪资结算单 this.model.salaryDetailVo
      //     autoLength.count = autoLength.salaryDetailVo = this.model.salaryDetailVo.length
      //     this.model.salaryDetailVo.forEach((item,index)=>{
      //       const settelData = [
      //         {'index':item.settlementhForm.settleDepartName+item.settlementhForm.settleMonth + '结算单','data':'','project':'','money':'','account':''},
      //         {'index':'结算主体','data':item.settlementhForm.settleDepartName,'project':'','money':'皖信盖章','account':''},
      //         {'index':'结算日期','data':item.settlementhForm.settleMonth,'project':'','money':'','account':''},
      //         {'index':'费用项目','data':'','project':'金额','money':'税费','account':'开票额小计'},
      //         {'index':item.settlementhForm.settleMonth,'data':'应发工资','project':item.settlementhForm.salarySum,'money':item.settlementhForm.salaryTax,'account':item.settlementhForm.salaryTicket},
      //         {'index':'','data':'实发工资（银付）','project':item.settlementhForm.cardPay,'money':'','account':''},
      //         {'index':'','data':'实发工资(现金)','project':item.settlementhForm.moneyPay,'money':'','account':''},
      //         {'index':'','data':'暂停发','project':item.settlementhForm.pausePay,'money':item.settlementhForm.managementMoneyTax,'account':item.settlementhForm.managementMoneyTicket},
      //         {'index':item.settlementhForm.settleMonth,'data':'代缴单位社保','project':item.settlementhForm.unitSocial,'money':'','account':''},
      //         {'index':'','data':'代扣个人社保','project':item.settlementhForm.withholidingPersonSocial,'money':'','account':''},
      //         {'index':'','data':'没工资员工单位保险','project':item.settlementhForm.noSalaryUnitSocial,'money':item.settlementhForm.noSalaryUnitSocialTax,'account':item.settlementhForm.noSalaryUnitSocialTicket},
      //         {'index':'','data':'没工资员工个人保险','project':item.settlementhForm.noSalaryPersonSocial,'money':item.settlementhForm.noSalaryPersonSocialTax,'account':item.settlementhForm.noSalaryPersonSocialTicket},
      //         {'index':item.settlementhForm.settleMonth,'data':'代缴单位公积金','project':item.settlementhForm.unitFund,'money':item.settlementhForm.unitFundTax,'account':item.settlementhForm.unitFundTicket},
      //         {'index':'','data':'代扣个人公积金','project':item.settlementhForm.withholidingPersonFund,'money':'','account':''},
      //         {'index':'','data':'没工资员工单位公积金','project':item.settlementhForm.noSalaryUnitFund,'money':item.settlementhForm.noSalaryUnitFundTax,'account':item.settlementhForm.noSalaryUnitFundTicket},
      //         {'index':'','data':'没工资员工个人公积金','project':item.settlementhForm.noSalaryPersonalFund,'money':item.settlementhForm.noSalaryPersonalFundTax,'account':item.settlementhForm.noSalaryPersonalFundTicket},
      //         {'index':item.settlementhForm.settleMonth,'data':'预收单位社保','project':item.settlementhForm.advanceUnitSocial,'money':item.settlementhForm.advanceUnitSocialTax,'account':item.settlementhForm.advanceUnitSocialTicket},
      //         {'index':'','data':'预收单位公积金','project':item.settlementhForm.advanceUnitFund,'money':item.settlementhForm.advanceUnitFundTax,'account':item.settlementhForm.advanceUnitFundTicket},
      //         {'index':'','data':'预收个人社保','project':item.settlementhForm.advancePersonalSocial,'money':item.settlementhForm.advancePersonalSocialTax,'account':item.settlementhForm.advancePersonalSocialTicket},
      //         {'index':'','data':'预收个人公积金','project':item.settlementhForm.advancePersonalFund,'money':item.settlementhForm.advancePersonalFundTax,'account':item.settlementhForm.advancePersonalFundTicket},
      //         {'index':'商险金额','data':'','project':item.settlementhForm.takingRisks,'money':item.settlementhForm.takingRisksTax,'account':item.settlementhForm.takingRisksTicket},
      //         {'index':'商险预估差额','data':'','project':item.settlementhForm.takingBalance||'0','money':item.settlementhForm.takingBalanceTax||'0','account':item.settlementhForm.takingBalanceTicket||'0'},
      //         {'index':'风险金','data':'','project':item.settlementhForm.riskFund,'money':item.settlementhForm.riskFundTax,'account':item.settlementhForm.riskFundTicket},
      //         {'index':'人数','data':'','project':item.settlementhForm.personNum,'money':'','account':''},
      //         {'index':'人次','data':'','project':item.settlementhForm.personTime,'money':'','account':''},
      //         {'index':'管理费','data':'','project':item.settlementhForm.managementMoney,'money':item.settlementhForm.managementMoneyTax,'account':item.settlementhForm.managementMoneyTicket},
      //         {'index':'管理费2','data':'','project':item.settlementhForm.managementMoneyTwo||'','money':item.settlementhForm.managementMoneyTwoTax,'account':item.settlementhForm.managementMoneyTwoTicket},
      //         {'index':'结算金额合计','data':'','project':'','money':item.settlementhForm.countTax,'account':item.settlementhForm.accountMoneySum},
      //         {'index':'开票金额合计','data':'','project':'','money':'','account':item.settlementhForm.ticketMoneySum},
      //         {'index':'上月差余额','data':'','project':'','money':'','account':item.settlementhForm.prevPoorBalance},
      //         {'index':'本月差余额','data':'','project':'','money':'','account':item.settlementhForm.curPoorBalance},
      //         {'index':'备注','data':item.settlementhForm.remark,'project':'','money':'','account':''},
      //         {'index':'发票类型','data':'扣除金额','project':'不含税金额','money':'税额','account':'发票合计金额'},
      //         {'index':item.settlementhForm.ticketType||'','data':item.settlementhForm.deductionAmount||'','project':item.settlementhForm.noTaxAmount||'','money':item.settlementhForm.taxAmount||'','account':item.settlementhForm.ticketSumAmount||''},
      //       ]
      //       excelDatas.push({
      //         tHeader: ["序号","名称","费用项目", "金额", "开票额小计"],
      //         filterVal: ['index','data',"project", "money", "account"],
      //         tableDatas: settelData,
      //         sheetName: "普通薪资结算单"+(index+1)
      //       })
      //     })
      //   break
      //   case '1' :
      //     // 工程薪资结算单  engineerSettlementForm
      //     autoLength.count = autoLength.engineerSettlementDetailVo = this.model.engineerSettlementDetailVo.length
      //     autoLength.item = []
      //     this.model.engineerSettlementDetailVo.forEach((item,index)=>{
      //       const settelData = [
      //         {'index':item.engineerSettlementForm.settleDepartName+item.engineerSettlementForm.settleMonth + '结算单','data':'','project':'','money':''},
      //         {'index':'结算主体','data':item.engineerSettlementForm.settleDepartName,'project':'','money':''},
      //         {'index':'开票名称','data':item.engineerSettlementForm.settleDepartName,'project':'','money':''},
      //         {'index':'结算时间','data':item.engineerSettlementForm.settleMonth,'project':'','money':''},
      //         {'index':'日期','data':'费用项目','project':'金额','money':'开票额小计'},
      //         {'index':item.engineerSettlementForm.salaryMonth,'data':'应发工资','project':item.engineerSettlementForm.salarySum,'money':item.engineerSettlementForm.salaryTicket},
      //         {'index':item.engineerSettlementForm.salaryMonth,'data':'实发工资（银付）','project':item.engineerSettlementForm.cardPay,'money':''},
      //         {'index':item.engineerSettlementForm.salaryMonth,'data':'暂停发','project':item.engineerSettlementForm.pausePay,'money':''},
      //         {'index':item.engineerSettlementForm.socialMonth || '','data':'代缴单位社保','project':item.engineerSettlementForm.usocialDeduction,'money':''},
      //         {'index':item.engineerSettlementForm.socialMonth || '','data':'代缴个人社保','project':item.engineerSettlementForm.psocialDeduction,'money':''},
      //         {'index':'雇主责任险','data':'','project':item.engineerSettlementForm.employerLiabilityInsurance,'money':''},
      //         {'index':'商险预估差额','data':'','project':item.engineerSettlementForm.takingBalance,'money':''},
      //         {'index':'其他费用','data':'','project':item.engineerSettlementForm.other||'','money':''},
      //       ]
      //       autoLength.item.push(item.engineerSettlementhFormSubList.length)
      //       item.engineerSettlementhFormSubList.forEach((items)=>{
      //         settelData.push({
      //           'index':getItemName(items.itemTypeName,items.subName),'data':'','project':items.money,'money':items.ticket||''
      //         })
      //       })
      //       settelData.push({
      //         'index':'增值税金及附加','data':'','project':item.engineerSettlementForm.valueDaddedTax,'money':item.engineerSettlementForm.valueDaddedTaxTicket
      //       })
      //       settelData.push({
      //         'index':'预缴企业所得税','data':'','project':item.engineerSettlementForm.unitIncomeTax||'','money':item.engineerSettlementForm.unitIncomeTaxTicket||''
      //       })
      //       settelData.push({
      //         'index':'人数','data':'','project':item.engineerSettlementForm.personCount,'money':''
      //       })
      //       settelData.push({
      //         'index':'管理费','data':'','project':item.engineerSettlementForm.managementCost,'money':item.engineerSettlementForm.managementCostTicket
      //       })
      //       settelData.push({
      //         'index':'结算金额合计','data':'','project':'','money':item.engineerSettlementForm.accountMoneySum
      //       })
      //       settelData.push({
      //         'index':'备注','data':item.engineerSettlementForm.remark,'project':'','money':''
      //       })
      //       excelDatas.push({
      //         tHeader: ["序号","名称","费用项目", "金额", "开票额小计"],
      //         filterVal: ['index','data',"project", "money", "account"],
      //         tableDatas: settelData,
      //         sheetName: "工程薪资结算单"+(index+1)
      //       })
      //     })
      //   break
      //   case '2' :
      //     // 2预估发放
      //     autoLength.count = autoLength.forecastVo = this.model.forecastVo.length
      //     this.model.forecastVo.forEach((item,index)=>{
      //       const settelData = [
      //         {'index':item.forecastBill.billDate+item.forecastForm.departName + '结算单','data':'','project':'','money':'','account':''},
      //         {'index':'结算主体','data':item.forecastForm.departName+'('+item.forecastForm.departNo+')','project':'','money':'皖信盖章','account':''},
      //         {'index':'结算日期','data':item.forecastBill.billDate,'project':'','money':'','account':''},
      //         {'index':'费用项目','data':'','project':'金额','money':'税费','account':'开票额小计'},
      //         {'index':item.forecastBill.payMonths,'data':'代缴单位社保','project':item.forecastBill.unitSocial,'money':item.forecastBill.unitSocialTax,'account':(item.forecastBill.unitSocial+item.forecastBill.unitSocialTax)},
      //         {'index':'','data':'代扣个人社保','project':item.forecastBill.personalSocial,'money':item.forecastBill.personalSocialTax||'0','account':(item.forecastBill.personalSocial+item.forecastBill.personalSocialTax)},
      //         {'index':item.forecastBill.payMonths,'data':'代缴单位公积金','project':item.forecastBill.unitProvident,'money':item.forecastBill.unitProvidentTax,'account':(item.forecastBill.unitProvident+item.forecastBill.unitProvidentTax)},
      //         {'index':'','data':'代扣个人公积金','project':item.forecastBill.personalProvident,'money':item.forecastBill.personalProvidentTax||'0','account':(item.forecastBill.personalProvident+item.forecastBill.personalProvidentTax)},
      //         {'index':'单位社保差余额','data':'','project':item.forecastBill.unitSocialDiff||'','money':0,'account':item.forecastBill.unitSocialDiff||''},
      //         {'index':'个人社保差余额','data':'','project':item.forecastBill.personalSocialDiff||'','money':0,'account':item.forecastBill.personalSocialDiff||''},
      //         {'index':'单位公积金差余额','data':'','project':item.forecastBill.unitPrividentDiff||'','money':item.forecastBill.unitProvidentTax,'account':(item.forecastBill.unitPrividentDiff+item.forecastBill.unitProvidentTax)},
      //         {'index':'个人公积金差余额','data':'','project':item.forecastBill.personalProvidentDiff||'','money':0,'account':item.forecastBill.personalProvidentDiff||''},
      //         {'index':'社保卡费','data':'','project':item.forecastBill.socialCardFee,'money':'','account':item.forecastBill.socialCardFee},
      //         {'index':'服务人次','data':'','project':item.forecastBill.serverPeople,'money':'','account':''},
      //         {'index':'服务人数','data':'','project':item.forecastBill.serverPeopleNum,'money':'','account':''},
      //         {'index':'商险','data':'','project':item.forecastBill.businessInsurance,'money':item.forecastBill.businessInsuranceTax,'account':(item.forecastBill.businessInsurance+item.forecastBill.businessInsuranceTax)},
      //         {'index':'管理费','data':'','project':item.forecastBill.managementFee,'money':item.forecastBill.managementFeeTax,'account':(item.forecastBill.managementFee+item.forecastBill.managementFeeTax)},
      //         {'index':'管理费2','data':'','project':item.forecastBill.managementFeeTwo||'','money':0,'account':item.forecastBill.managementFeeTwo||''},
      //         {'index':'结算金额合计','data':'','project':'','money':'','account':item.forecastBill.billFeeSum},
      //         {'index':'开票金额合计','data':'','project':'','money':'','account':item.forecastBill.ticketFeeSum},
      //         {'index':'备注','data':item.forecastBill.remark,'project':'','money':'','account':''},
      //       ]
      //       excelDatas.push({
      //         tHeader: ["序号","名称","费用项目", "金额", "开票额小计"],
      //         filterVal: ['index','data',"project", "money", "account"],
      //         tableDatas: settelData,
      //         sheetName: "预估库结算单"+(index+1)
      //       })
      //     })
      //   break
      // }

      // 封面
      this.model.insuranceSettlementCover.forEach((item,index) => {
        const projectNameArr = this.getCustomers(item,item.type)
        let departNo = item.departNo
        if(String(item.type) === '1'){
          departNo = this.getDeparts(item.coverDetailList)
        }
        const coverData = [
          {'company':item.tableHead,'project':'','payType':'','money':'','no':'附件'+this.model.insuranceSettlementCover.length+'张'},
          {'company':"银行转账审批单",'project':'','payType':'','money':'','no':''},
          {'company':"",'project':moment(item.createTime).format('YYYY年MM月DD日'),'payType':'结算主体编码','money':departNo,'no':''},
          {'company':"客户单位",'project':'项目','payType':'付款方式','money':'金额','no':''},
          {'company':"",'project':'','payType':'','money':'','no':''},
        ]
        autoLength.coverItems[index] = projectNameArr.length
        projectNameArr.map(list=>{
          coverData.push(list)
        })
        coverData.push({'company':"合计人民币:",'project':item.amountRmb,'payType':'','money':'¥' + item.amount,'no':''})
        coverData.push({'company':"收款单位名称: " + item.receiptName + "        账号: " + item.receiptBankNo + "        开户行: " + item.receiptBankName,'project':'','payType':'','money':'','no':''})
        coverData.push({'company':"备注: " + (item.remark||''),'project':'','payType':'','money':'','no':''})
        coverData.push({'company':'公司领导：      财务负责人：      网银审核授权人：      网银转账提交人：      数据审核人：      制表人:'+this.model.createUser,'project':'' ,'payType': '','money':'','no':''})
        excelDataArr.push({
          tHeader: ["序号", "名字", "描述", "金钱", "地位"],
          filterVal: ["company", "project", "payType", "money",'no'],
          tableDatas:coverData,
          sheetName:'封面' + (index+1)
        })
      })
      this.jsonToExcel(excelDataArr, `${this.model.invoiceNo}`, true, 'xlsx',autoLength)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    jsonToExcel(tableJson, filenames, autowidth, bookTypes,typeLength) {
      var that = this
      import('@/vendor/ExportInsuranceScan').then(excel => {
        var tHeader = []
        var dataArr = []
        var sheetnames = []
        for (var i in tableJson) {
          tHeader.push(tableJson[i].tHeader)
          dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
          sheetnames.push(tableJson[i].sheetName)
        }
        excel.export_json_to_excel_more_sheet({
          header: tHeader,
          data: dataArr,
          sheetname: sheetnames,
          filename: filenames,
          autoWidth: autowidth,
          bookType: bookTypes,
          autoLength: typeLength // 长度
        })
        that.confirmLoading = false
      })

    },
    getCustomers(item,type){
      let arr = []
      if(type == 1){
        item.coverDetailList.forEach(list=>{
          arr.push({
            company:list.customerName +'-'+list.departName,
            project:item.itemName,
            payType:filterDictText(this.payTypeOptions,item.payType),
            money:'¥' + list.amount,
            no:''
          })
        })
      }else if(/,/.test(item.customerName)){
        const customerNameArr = item.customerName.split(',')
        const departNameArr = item.departName.split(',')
        const temp = []
        customerNameArr.forEach((items,index)=>{
          temp[index] = items + '-' + departNameArr[index]
        })
        arr.push({
          company:temp.join('\n'),
          project:item.itemName,
          payType:filterDictText(this.payTypeOptions,item.payType),
          money:'¥' + item.amount,
          no:''
        })
      }else{
        arr.push({
          company:item.customerName + '-' + item.departName,
          project:item.itemName,
          payType:filterDictText(this.payTypeOptions,item.payType),
          money:'¥' + item.amount,
          no:''
        })
      }
      return arr
    },
    handleSubmit(){
      const _this = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            _this.confirmLoading = true
            const param = {
              id:this.detail.id,
              ticketAmountSum:values.ticketAmountSum,
              remark:values.remark
            }
            httpAction(this.url.editUrl, param, 'put').then((res) => {
              if (Number(res.code) === 200) {
                _this.$message.success(`${_this.title}成功！`)
                _this.close()
              } else {
                _this.$message.warning(res.msg)
              }
            }).finally(() => {
              _this.confirmLoading = false
            })
          }
        })
    },
    //打印 
    handlePrint(){
      const url = `/pdf/insurancescandetail?id=${this.model.id}`
      window.open(url)
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.insuranceActiveKey = "1"
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
      this.detail={}
      this.salaryInfo = this.statementBill = []
    },
    // 数据字典
    initDictConfig() {
      // 状态
      initDictOptions('Insurance_record_status').then((res) => {
        if (Number(res.code) === 200) {
          this.statusOptions = res.data
        }
      })
    },
    // 点击修改发票号
    modifyNumber(item){
      this.$refs.coverModifyNumberModal.show(item)
    },
  }
}
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
.stepFormText {
  :global(.ant-form-item-label) {
    width: 80px;
  }
}
.settlement {
  border-collapse: collapse;
  margin: 10px auto 30px;
  width: 800px;
  color: #000;
  font-size: 12px;
}
.settlement td {
  width: 16%;
  height: 40px;
  padding-left: 10px;
  border: solid #999 1px;
}
.settlement td.tdbg {
  background: #ddd;
  font-weight: bold;
  text-align: center;
}
.cover {
  border-collapse: collapse;
  border: none;
  width: 90%;
  float: left;
  margin-left: 3%;
}
.cover .line {
  display: inline-block;
}
.cover td {
  width: 16%;
  height: 32px;
  padding: 10px 10px 10px 15px;
  border: solid #000 1px;
  vertical-align: top;
  color: #333;
}
.cover td h6 {
  font-size: 16px;
  font-weight: bold;
}
.cover td p {
  font-size: 12px;
}
.attach {
  width: 20px;
  float: right;
  margin-right: 3%;
  margin-top: 8%;
}
.center {
  text-align: center;
}
.tabDiv {
  box-shadow: 0 0 1px 1px #aaa, 3px 0 5px 0 #aaa, 0 4px 7px 0 #aaa;
  border: 1px solid;
  width: 850px;
  margin: 44px auto;
}
.tabDiv h2 {
  text-align: center;
  margin-top: 10px;
}
.pbottom p span {
  display: inline-block;
  text-align: right;
  font-weight: bold;
  margin: 0px;
}
.headerWrap {
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  justify-content: center;
  align-items: center;
  button{
    position: absolute;
    right: 7%;
    margin: 0;
  }
}
</style>
