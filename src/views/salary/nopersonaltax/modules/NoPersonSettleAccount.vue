<template>
  <a-card title="结算表">
    <template slot="extra">
      <a-button
        type="primary"
        @click="addModal(1)"
      >添加差余额</a-button>
      <a-button
        type="primary"
        @click="addModal(2)"
        style="margin-left:5px"
      >添加自定义项</a-button>
      <!-- <a-button
        type="primary"
        @click="addModal(3)"
        style="margin-left:5px"
      >添加开票明细</a-button> -->
    </template>
    <!-- <a-card
      title="基础信息"
      :bordered="false"
    >
      <a-table
        rowKey="id"
        :columns="headerColumns"
        :dataSource="salaryInfo"
        :pagination="false"
      >
      </a-table>
    </a-card> -->
    <a-card :bordered="false">
      <div class="tabDiv">
        <h2 id="tabledesc1">{{ salaryStandardInfo.departName }}{{ salaryStandardInfo.settlementMonth }} - 结算单</h2>
        <table class="table1" aria-describedby="tabledesc1">
          <tr class="tr1">
            <td class="tit td1">结算主体</td>
            <td
              class="td1"
              colspan="2"
            >{{ salaryStandardInfo.departName }}</td>
            <td class="tit td1">皖信盖章</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算编码名称</td>
            <td
              class="td1"
              colspan="2"
            >{{ salaryStandardInfo.departNo }}</td>
            <td class="tit td1">结算时间</td>
            <td
              class="td1"
              colspan="2"
            >{{ salaryStandardInfo.settlementMonth }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">业务类型</td>
            <td
              class="td1"
              colspan="4"
            >{{ salaryStandardInfo.businessType }}</td>
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
          <!-- <tr class="tr1">
            <td
              class="tit td1"
              rowspan="4"
            >{{ salaryStandardInfo.salaryMonth }}</td>
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
            v-if="settlementhFormInfo.personalYearTax"
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
            v-if="settlementhFormInfo.withholidingPersonSocial"
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
            v-if="settlementhFormInfo.withholidingPersonFund"
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
            v-if="settlementhFormInfo.withholidingUnitSocial"
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
            v-if="settlementhFormInfo.withholidingUnitFund"
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
            v-if="settlementhFormInfo.takingRisks"
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
            v-if="settlementhFormInfo.riskFundDy"
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
            v-for="(item, index) in withholdData"
            :key="index"
            class="tr1"
          >
            <td
              class="tit td1"
              colspan="2"
            >{{ getItemName(item.itemTypeName,item.subName,item.isPause) }}
              <a-popconfirm
                title="确定删除吗?"
                @confirm="() => deleteSub(index)"
              >
                <a-icon
                  type="delete"
                  style="color:red;cursor:pointer"
                />
              </a-popconfirm>
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
            >管理费2
              <a-icon
                type="edit"
                style="color:red;cursor:pointer;margin-left:30px;font-size:18px"
                @click="handleEditManage"
              />
            </td>
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
            >开票金额合计
              <a-icon
                type="edit"
                style="color:red;cursor:pointer;font-size:18px"
                @click="handleInvoiceInfo"
              />
            </td>
            <td class="td1">{{ settleDeail.ticketMoneySum }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >上次差余额
              <a-icon
                type="edit"
                style="color:red;cursor:pointer;font-size:18px"
                @click="handleLastBalance"
              />
            </td>
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
              <a-input
                :value="settleDeail.remark"
                @blur="blurSettleRemark"
              />
              <!-- <div
                v-if="!settleDeail.remark"
                style="color:red;font-size:10px"
              >*完善备注信息</div> -->
            </td>
          </tr>
          <template v-if="settleDeail.eventFlag == 0">
            <tr class="tr1">
              <td class="tit td1">关联事件编码</td>
              <td
                class="td1"
                colspan="4"
              >
                <select-page
                  class="selfSelect"
                  :allowClear="false"
                  :searchUrl="`/hrEmergency/emergencyview/pageByParam?emSettleId=${salaryStandardInfo.departId}&param=`"
                  :title="'eventCode,emName,emIdCard'"
                  :placeholder="'请输入事件编码或者姓名搜索'"
                  @select="selectEventCode"
                  v-model="eventCode"
                  :id="'eventCode'"
                ></select-page>
              </td>
            </tr>
            <tr class="tr1" v-if="showPay">
              <td class="tit td1">赔付类型</td>
              <td
                class="td1"
                colspan="4"
              >
                <a-select
                  v-model="payMainType"
                  optionFilterProp="children"
                  @change="handleChange"
                  showSearch
                  style="width: 100%"
                  placeholder="请选择赔付类型"
                >
                  <a-select-option
                    v-for="item in emergencyType"
                    :key="item.value"
                    :values="item.value"
                  >{{ item.label }}</a-select-option>
                </a-select>
              </td>
            </tr>
          </template>
          
          <!-- <tr class="tr1">
            <td class="tit td1">发票类型</td>
            <td class="tit td1">扣除金额</td>
            <td class="tit td1">不含税金额</td>
            <td class="tit td1">税额</td>
            <td class="tit td1">发票合计金额</td>
          </tr>
          <tr class="tr1">
            <td class="td1">
              <input
                v-model="settlementhFormInfo.ticketType"
                style="border-radius:5px;border:1px solid #ccc"
                @blur="blurChangeTicketType"
              />
            </td>
            <td class="td1">
              <a-tooltip placement="topLeft">
                <input
                  v-model="settlementhFormInfo.deductionAmount"
                  style="border-radius:5px;border:1px solid #ccc"
                  @blur="blurChangeDeductionAmount"
                />
              </a-tooltip>
            </td>
            <td class="td1">
              <input
                v-model="settlementhFormInfo.noTaxAmount"
                style="border-radius:5px;border:1px solid #ccc"
                @blur="blurChangeNoTaxAmount"
              />
            </td>
            <td class="td1">
              <input
                v-model="settlementhFormInfo.taxAmount"
                style="border-radius:5px;border:1px solid #ccc"
                @blur="blurChangeTaxAmount"
              />
            </td>
            <td class="td1">
              <input
                v-model="settlementhFormInfo.ticketSumAmount"
                style="border-radius:5px;border:1px solid #ccc"
                @blur="blurChangeTicketSumAmount"
              />
            </td>
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
        <span
          slot="operation"
          slot-scope="text, record"
        >
          <a @click="handleEditBattle(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除吗?"
            @confirm="() => handleDeleteBattle(record.id)"
          >
            <a href="#">删除</a>
          </a-popconfirm>

        </span>
      </a-table>
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        type="dashed"
        icon="plus"
        @click="addModal(1)"
      >新增差余额</a-button>
    </a-card>
    <a-modal
      title="添加差余额"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleCancel(1)"
      @ok="handleBattleOk"
      cancelText="取消"
      okText="保存"
      :confirmLoading="battleFormLoading"
      :visible="balanceVisible"
    >
      <a-spin :spinning="battleFormLoading">
        <a-form
          :form="battleForm"
          layout="inline"
          class="ant-advanced-search-form"
        >
          <a-row>
            <a-col :span="12">
              <a-form-item label="月份" class="labTxt">
                <a-month-picker
                  placeholder="差额月份"
                  v-decorator="['month', validatorRules.month]"
                  style="width: 191px"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="金额" class="labTxt">
                <a-input
                  placeholder="请填写金额"
                  v-decorator="['money', { rules: [{required: true, pattern:/^(-?)[0-9]+(.[0-9]{1,2})?$/,message: '请输入正确金额!' }] }]"
                  style="width: 191px"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="项目" class="labTxt">
                <a-input
                  placeholder="请填写项目"
                  v-decorator="['project']"
                  style="width: 191px"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="姓名" class="labTxt">
                <a-input
                  placeholder="请填写姓名"
                  v-decorator="['name']"
                  style="width: 191px"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-item label="原因" class="labTxt">
                <a-textarea
                  v-decorator="['cause',{rules:[{required: true,message:'原因不能为空！'},{max:200,message:'原因最多200个字符！'}]}]"
                  rows="3"
                  style="width:468px"
                  placeholder=""
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </a-modal>
    <a-modal
      title="添加自定义项"
      :width="800"
      placement="right"
      :closable="true"
      @cancel="handleCancel(2)"
      @ok="handleDiyOk()"
      cancelText="取消"
      okText="保存"
      :visible="diyVisible"
      :maskClosable="false"
    >
      <a-spin :spinning="diyLoading">
        <a-form
          :form="diyForm"
          layout="inline"
          class="ant-advanced-search-form"
        >
          <a-row>
            <a-col :span="12">
              <a-form-item label="项目类别" class="labelTxt">
                <a-input :readOnly="true" style="width: 191px" @click="focusSelect" placeholder="请选择项目类别" v-decorator="['itemTypeName',validatorRules.itemTypeName]" />
                <a-input type="hidden" v-decorator="['itemType']" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="项目说明" class="labelTxt">
                <a-input
                  placeholder="请填写项目说明"
                  v-decorator="['subName',validatorRules.subName]"
                  style="width: 191px"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="金额" class="labelTxt">
                <a-input
                  placeholder="请填写金额"
                  @change="changeMoney"
                  v-decorator="['money',validatorRules.money]"
                  style="width: 191px"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="增值税" class="labelTxt">
                <a-input
                  placeholder="请填写增值税"
                  @change="changeTax"
                  addonAfter="%"
                  v-decorator="['tax',validatorRules.tax]"
                  style="width: 160px;margin-right:5px;"
                />
                <span>部门税率:{{ deptTax }}</span>
              </a-form-item>

            </a-col>
            <a-col :span="12">
              <a-form-item label="开票金额小计" class="labelTxt">
                <a-input
                  disabled
                  placeholder=""
                  v-decorator="['ticket',{}]"
                  style="width: 191px"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="暂停发" class="labelTxt">
                <a-select
                  style="width: 178px"
                  v-decorator="['isPause',validatorRules.isPause]"
                >
                  <a-select-option value="2">不发放</a-select-option>
                  <a-select-option value="1">暂停发</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </a-modal>
    <a-modal
      title="添加开票明细"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleCancel(3)"
      cancelText="取消"
      okText="保存"
      :visible="detailVisible"
    >
      <a-form
        :form="detailForm"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col
            :lg="12"
            :md="16"
            :sm="24"
          >
            <a-form-item label="开票日期">
              <a-month-picker
                placeholder="差额月份"
                v-decorator="['empBirthday', {}]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
          <a-col
            :lg="9"
            :md="16"
            :sm="24"
          >
            <a-form-item label="开票金额">
              <a-input
                placeholder="请填写姓名"
                v-decorator="['name']"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col
            :lg="9"
            :md="16"
            :sm="24"
          >
            <a-form-item label="本次结算金额">
              <a-input
                placeholder="请填写姓名"
                v-decorator="['name']"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
          <a-col
            :lg="12"
            :md="16"
            :sm="24"
            :offset="3"
          >
            <a-form-item label="本次结算到账金额">
              <a-input
                placeholder="请填写姓名"
                v-decorator="['name']"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      title="修改管理费2"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleCancelManage"
      @ok="handleOkMange"
      cancelText="取消"
      okText="保存"
      :visible="manageVisible"
      :confirmLoading="manageLoading"
    >

      <a-form :form="manageForm">
        <a-form-item
          label="金额"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-input
            style="width: 191px"
            @blur="editBlurMoney"
            v-decorator="['money', { rules: [{required: true, pattern:/^(-?)[0-9]+(.[0-9]{1,2})?$/,message: '请输入正确金额!' }] }]"
          />
        </a-form-item>
        <a-form-item
          label="增值税"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-select
            style="width:191px"
            @change="editChangeTax"
            v-decorator="['tax',{'initialValue':'0'}]"
          >
            <a-select-option value="0">无增值税</a-select-option>
            <a-select-option value="1">{{ deptTax }}%</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="开票金额小计"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-input
            style="width: 191px"
            disabled
            v-decorator="['ticket']"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 修改上次差余额 -->
    <a-modal
      title="上次差余额"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleCancelLastBalance"
      @ok="handleOkLastBalance"
      cancelText="取消"
      okText="保存"
      :visible="lastBalanceVisible"
      :confirmLoading="lastBalanceLoading"
    >

      <a-form :form="lastBalanceForm">
        <a-form-item
          label="上次差余额"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-input
            style="width: 191px"
            v-decorator="['prevPoorBalance', { rules: [{required: true, pattern:/^(-?)[0-9]+(.[0-9]{1,2})?$/,message: '请输入正确金额!' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 修改开票合计金额 -->
    <other-invoice-apply-entrance-modal
      ref="otherInvoiceApplyEntranceModal"
      @ok="otherInvoiceApplyEntranceModalOk"
    ></other-invoice-apply-entrance-modal>
    <select-item-modal ref="SelectItemModalForm" @ok="selectCallback"></select-item-modal>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import { httpAction, getAction } from '@/api/manage'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import OtherInvoiceApplyEntranceModal from '../../../web/tfinancial/invoicemanage/modules/OtherInvoiceApplyEntranceModal'
import { getItemName } from '@/utils/common'
import SelectItemModal from '../../../salarystandard/modules/SelectItemModal'
import SelectPage from '@/components/jeecg/SelectPage'

export default {
  name: 'NoPersonSettleAccount',
  components: {
    OtherInvoiceApplyEntranceModal, // 新开票申请Model
    SelectItemModal,
    SelectPage
  },
  data() {
    return {
      headerColumns: [
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
          dataIndex: 'cause',
          ellipsis: true,
          width:300,
          customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          title: '操作',
          key: 'operation',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      balanceVisible: false,
      diyVisible: false,
      detailVisible: false,
      battleFormLoading: false,
      diyLoading: false,
      manageVisible: false,
      lastBalanceVisible: false,
      lastBalanceLoading: false,
      diyForm: this.$form.createForm(this),
      battleForm: this.$form.createForm(this),
      detailForm: this.$form.createForm(this),
      manageForm: this.$form.createForm(this),
      lastBalanceForm: this.$form.createForm(this),
      diyFormModel: {},
      battleFormModel: {},
      manageFormModel: {},
      deptTax: '',
      url: {
        settleUrl: '/hrBase/tdepartsettlementinfo/getBySettlementId',
        saveSettleUrl: '/salary/tsettlementhformsub/saveTSettlementhFormSub',
        getSettleUrl: '/salary/tsettlementhform/',
        delSubUrl: '/salary/tsettlementhformsub/deleteById',
        addBalanceUrl: '/salary/tpoorbalanceinfo/savePoorBalance',
        editBalanceUrl: '/salary/tpoorbalanceinfo',
        delBalanceUrl: '/salary/tpoorbalanceinfo/',
        editManageUrl: '/salary/tsettlementhform',
        editSalaryUrl: '/salary/tsalarystandard',
        updatePrevPoorBalance: '/salary/tsettlementhform/updatePrevPoorBalance'
      },
      validatorRules: {
        itemTypeName: { rules: [{ required: true, message: '请选择项目类别!' }] },
        money: { rules: [{ required: true, message: '请填写金额!' }, { validator: this.isNumber }] },
        isPause: { rules: [{ required: true, message: '请选择暂停发!' }] },
        tax: { rules: [{ required: true, message: '请填写增值税!' }, { validator: this.isTax }] },
        month: { rules: [{ required: true, message: '请选择月份!' }] },
        name: { rules: [{ required: true, message: '请填写姓名!' }] },
        project: { rules: [{ required: true, message: '请填写项目!' }] }
      },
      settlementId: '',
      settlementFormId: 1,
      tDepartSettlementInfo: {},
      managementInfo: {},
      managementMoneyTwo: '',
      managementMoneyTwoTax: '',
      managementMoneyTwoTicket: '',
      tax: null,
      diyTax: '', // 自定义税率值
      withholdData: [],
      balanceData: [],
      settleDeail: {},
      oneBattleData: {},
      manageLoading: false,
      salaryInfo: [],
      orgList: [],
      taxFeeDicts: [],
      taxOptions: [], // 缴税类型字典,
      ticketType: '', //发票类型
      deductionAmount: '', //扣除金额
      noTaxAmount: '', //不含税金额
      taxAmount: '', // 税额
      ticketSumAmount: '', //发票合计金额
      settleRemark: '', // 结算单备注
      eventCode:undefined, // 
      payMainType:undefined, // 0工伤理赔1商险理赔
      emergencyType:[{value:'0',label:'工伤理赔'},{value:'1',label:'商险理赔'}],
      showPay: false
    }
  },
  props: {
    salaryStandardInfo: {
      type: Object,
      required: true
    },
    settlementhFormInfo: {
      type: Object,
      required: true
    },
    pauseDiyInfoList: {
      type: Array,
      required: true
    },
    poorBalanceInfoList: {
      type: Array,
      required: true
    },
    salaryAccountOne: {
      type: Object,
      required: true
    },
    paushTypeObject: {
      type: Object,
      required: false,
      default: ()=>{},
    }
  },
  methods: {
    getItemName,
    // 选择赔付类型
    handleChange(val){
      if(!this.eventCode){
        this.$message.warning('请先选择关联事件编码！')
        this.payMainType = undefined
        return false
      }
      httpAction(`/salary/salary/saveEventCodeByFormId?eventCode=${this.eventCode}&settleFormId=${this.settlementFormId}&payMainType=${val}`,null,'post').then(res=>{
        if(res.code === 200){
          this.$message.success('保存成功！')
          this.$emit('ok','payMainType',val)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    // 保存事件编码
    selectEventCode(val,option,list){
      this.showPay = list[option.key]['item']['emergencyType'] === '0' ? true : false
      httpAction(`/salary/salary/saveEventCodeByFormId?settleFormId=${this.settlementFormId}&eventCode=${val}&payMainType=`,null,'post').then(res=>{
        if(res.code === 200){
          this.settleDeail.eventCode = val
          this.settleDeail.eventFlag = "0"
          this.eventCode = val
          this.payMainType = undefined
          this.$message.success('事件编码保存成功！')
          this.$emit('ok','eventCode',val)
        }else{
          this.$message.warning(res.msg)
          this.eventCode = this.settleDeail.eventCode || undefined
        }
      })
    },
    show() {
      this.initDictConfig()
      this.salaryInfo = []
      if (!this.settleDeail.id) {
        this.settleDeail = this.settlementhFormInfo
      }
      //this.settleDeail = this.settlementhFormInfo
      this.settlementId = this.settlementhFormInfo.settleDepartId
      this.settlementFormId = this.settlementhFormInfo.id
      if(this.settleDeail.eventFlag != null){
        this.eventCode = this.settleDeail.eventCode || undefined
        this.payMainType = this.settleDeail.payMainType || undefined
        this.showPay = /GS/i.test(this.eventCode) ? true : false
      }else{
        this.eventCode = undefined
        this.payMainType = undefined
      }

      this.withholdData = this.pauseDiyInfoList
      this.balanceData = this.poorBalanceInfoList
      this.salaryInfo.push({
        id: 1,
        settleDepartName: this.salaryStandardInfo.departName,
        belongDeptId: this.salaryStandardInfo.belongDeptId,
        settleMonth: this.salaryStandardInfo.settlementMonth,
        settleDepartNo: this.salaryStandardInfo.departNo
      })
      //获取所有公司数据
      getAction('/admin/organizationinfo/getOrgForCus').then(res => {
        if (Number(res.code) === 200) {
          this.orgList = res.data
        }
      })
    },
    focusSelect(){
      this.$refs.SelectItemModalForm.show(this.paushTypeObject.paushTypeOption,this.paushTypeObject.paushTypeTwoOption)
    },
    selectCallback(value,label){
      this.$nextTick(()=>{
        this.diyForm.setFieldsValue(pick({itemTypeName:label,itemType:value}, 'itemTypeName','itemType'))
      })
    },
    addModal(num) {
      switch (num) {
        case 1:
          this.balanceVisible = true
          this.battleForm.resetFields()
          this.oneBattleData = {}
          break
        case 2:
          this.diyForm.resetFields()
          this.diyFormModel = {}
          var url = this.url.settleUrl + '?settlementId=' + this.settlementId
          httpAction(url, {}, 'POST').then(res => {
            if (Number(res.code) === 200) {
              this.tDepartSettlementInfo = res.data
              let taxType
              for (let c of this.taxOptions) {
                if (c.id == res.data.taxType) {
                  taxType = c.value
                }
              }
              // 判断缴税类型
              if (taxType > 1) {
                this.deptTax = 0
              } else {
                this.deptTax = res.data.taxFee
              }
              //this.deptTax = res.data.taxFee
              this.diyFormModel.tax = this.deptTax
              this.diyForm.setFieldsValue(pick(this.diyFormModel, 'tax'))
            }
          })
          httpAction(this.url.getSettleUrl + this.settlementFormId, {}, 'GET').then(res => {
            this.managementInfo = res.data
            this.managementMoneyTwo = parseFloat(res.data.managementMoneyTwo)
            this.managementMoneyTwoTax = res.data.managementMoneyTwoTax
            this.managementMoneyTwoTicket = res.data.managementMoneyTwoTicket
          })
          this.diyVisible = true
          break
        case 3:
          this.detailVisible = true
          break
      }
    },
    handleCancel(num) {
      switch (num) {
        case 1:
          this.balanceVisible = false
          break
        case 2:
          this.diyVisible = false
          break
        case 3:
          this.detailVisible = false
          break
      }
    },
    changeMoney(e) {
      this.diyFormModel.money = e.target.value !== '' ? e.target.value : 0
      var money = e.target.value !== '' ? e.target.value : 0
      var tax = this.tax ? this.tax : 0
      if (this.tax != this.deptTax && this.tax != 0) {
        // var mmTwoTicket = parseFloat(money * (tax / 100)) - parseFloat(money * (this.deptTax / 100));   //管理费2 +税 的总金额
        // var mmTwo = mmTwoTicket / (1+this.deptTax/100);  //管理费2 金额
        // var mmTwoTax = mmTwoTicket - mmTwo;  //管理费2 税
        // this.managementMoneyTwo = parseFloat(this.managementInfo.managementMoneyTwo - (-mmTwo)).toFixed(2)
        // this.managementMoneyTwoTax = parseFloat(this.managementInfo.managementMoneyTwoTax - (-mmTwoTax)).toFixed(2)
        // this.managementMoneyTwoTicket = parseFloat(this.managementInfo.managementMoneyTwoTicket - (-mmTwoTicket)).toFixed(2)
        tax = this.deptTax
      }
      this.diyTax = parseFloat(money * (tax / 100)).toFixed(2)
      this.diyFormModel.ticket = parseFloat(money * (parseFloat(tax) / 100) + parseFloat(money)).toFixed(2)
      this.diyForm.setFieldsValue(pick(this.diyFormModel, 'ticket'))
    },
    changeTax(e) {
      var money = this.diyFormModel.money ? this.diyFormModel.money : 0
      this.tax = e.target.value
      var tax = parseFloat(e.target.value)
      if (this.tax != this.deptTax && this.tax != 0) {
        // var mmTwoTicket = parseFloat(money * (tax / 100)) - parseFloat(money * (this.deptTax / 100));   //管理费2 +税 的总金额
        // var mmTwo = mmTwoTicket / (1+this.deptTax/100);  //管理费2 金额
        // var mmTwoTax = mmTwoTicket - mmTwo;  //管理费2 税
        // this.managementMoneyTwo =  parseFloat(this.managementInfo.managementMoneyTwo - (-mmTwo)).toFixed(2)
        // this.managementMoneyTwoTax = parseFloat(this.managementInfo.managementMoneyTwoTax - (-mmTwoTax)).toFixed(2)
        // this.managementMoneyTwoTicket = parseFloat(this.managementInfo.managementMoneyTwoTicket - (-mmTwoTicket)).toFixed(2)
        tax = this.deptTax
      }
      this.diyTax = parseFloat(money * (tax / 100)).toFixed(2)
      this.diyFormModel.ticket = parseFloat(money * (parseFloat(tax) / 100) + parseFloat(money)).toFixed(2)
      this.diyForm.setFieldsValue(pick(this.diyFormModel, 'ticket'))
    },
    // 保存自定义项
    handleDiyOk() {
      this.diyForm.validateFields(['subName', 'money', 'tax', 'isPause','itemTypeName','itemType'], (err, values) => {
        if (!err) {
          let formData = Object.assign(this.diyFormModel, values)
          var mmTwoTicket =
            parseFloat(formData.money * (formData.tax / 100)) - parseFloat(formData.money * (this.deptTax / 100)) //管理费2 +税 的总金额
          var mmTwo = mmTwoTicket / (1 + this.deptTax / 100) //管理费2 金额
          var mmTwoTax = mmTwoTicket - mmTwo //管理费2 税
          this.managementMoneyTwo = parseFloat(this.managementInfo.managementMoneyTwo - -mmTwo).toFixed(2)
          this.managementMoneyTwoTax = parseFloat(this.managementInfo.managementMoneyTwoTax - -mmTwoTax).toFixed(2)
          this.managementMoneyTwoTicket = parseFloat(
            this.managementInfo.managementMoneyTwoTicket - -mmTwoTicket
          ).toFixed(2)

          formData.tax = this.diyTax
          formData.ticket = this.diyFormModel.ticket
          if (this.managementMoneyTwo == this.managementInfo.managementMoneyTwo) {
            this.deptTax = ''
          }
          const partbefore = `${this.url.saveSettleUrl}?managementMoneyTwo=${this.managementMoneyTwo}&managementMoneyTwoTax=${this.managementMoneyTwoTax}`
          const partafter = `&managementMoneyTwoTicket=${this.managementMoneyTwoTicket}&settleDomainTax=${this.deptTax}`
          const url = partbefore + partafter
          formData.settlementFormId = this.settlementFormId
          formData.managementMoneyTwo = mmTwo.toFixed(2)
          formData.managementMoneyTwoTax = mmTwoTax.toFixed(2)
          formData.managementMoneyTwoTicket = mmTwoTicket.toFixed(2)
          httpAction(url, formData, 'POST').then(res => {
            if (Number(res.code) === 200) {
              this.$message.success('保存成功')
              this.diyVisible = false
              this.withholdData.push(res.data.formSub)
              this.handleCommonLastBalance(this.settleDeail.prevPoorBalance)
              this.$emit('ok','eventFlag', res.data.sf.eventFlag)
            }
          })
        }
      })
    },
    //添加差余额
    handleBattleOk() {
      const _this = this;
      this.battleForm.validateFields(['money', 'month', 'cause', 'name', 'project'], (err, values) => {
        if (!err) {
          this.battleFormLoading = true
          let formData = Object.assign(this.battleFormModel, values)
          formData.tsettlementhFormId = this.settlementFormId
          formData.month = formData.month.format('YYYY-MM')
          let httpurl = ''
          let method = ''
          if (this.oneBattleData.id) {
            httpurl = this.url.editBalanceUrl
            formData.id = this.oneBattleData.id
            method = 'PUT'
          } else {
            httpurl = this.url.addBalanceUrl
            delete formData.id
            method = 'POST'
          }
          httpAction(httpurl, formData, method).then(res => {
            if (Number(res.code) === 200) {
              this.$message.success('保存成功')
              if (this.oneBattleData.id) {
                for (var c in this.balanceData) {
                  if (this.balanceData[c].id == this.oneBattleData.id) {
                    this.balanceData[c] = Object.assign(this.balanceData[c], values)
                    this.balanceData[c].month = values.month.format('YYYY-MM')
                  }
                }
              } else {
                this.balanceData.push(res.data)
              }
              this.balanceVisible = false
            } else {
              this.$message.error(res.msg)
            }
          }).finally(()=>{
            setTimeout(()=>{
              _this.battleFormLoading = false;
            },2000)
          })
        }
      })
    },
    handleEditBattle(record) {
      this.balanceVisible = true
      this.battleForm.resetFields()
      this.oneBattleData = record
      this.battleFormModel = Object.assign(this.battleFormModel, record)
      this.battleFormModel.month = moment(record.month, 'YYYY-MM')
      this.$nextTick(() => {
        this.battleForm.setFieldsValue(pick(this.battleFormModel, 'name', 'money', 'project', 'cause', 'month'))
      })
    },
    // 删除自定义项
    deleteSub(index) {
      var url = this.url.delSubUrl + '?subId=' + this.withholdData[index].id
      httpAction(url, {}, 'POST').then(res => {
        if (Number(res.code) === 200) {
          this.withholdData.splice(index, 1)
          this.settleDeail = res.data
          this.$emit('curOk', res.data.curPoorBalance);
          if(this.settleDeail.eventFlag!=0){
            this.$emit('ok','eventFlag', null)
          }
          
        }
      })
    },
    handleDeleteBattle(id) {
      var url = this.url.delBalanceUrl + id
      httpAction(url, {}, 'DELETE').then(res => {
        if (Number(res.code) === 200) {
          for (var c in this.balanceData) {
            if (this.balanceData[c].id == id) {
              this.balanceData.splice(c,1)
            }
          }
        }
      })
    },
    // 修改管理费2
    handleEditManage() {
      var url = this.url.settleUrl + '?settlementId=' + this.settlementId
      httpAction(url, {}, 'POST').then(res => {
        if (Number(res.code) === 200) {
          this.tDepartSettlementInfo = res.data
          // let taxType;
          // for(let c of this.taxOptions){
          //   if(c.id == res.data.taxType){
          //     taxType = c.value
          //   }
          // }
          // 判断缴税类型
          // if(taxType > 1){
          //   this.deptTax = 0
          // }else{
          //   this.deptTax = res.data.taxFee
          // }
          this.deptTax = res.data.taxFee
        }
      })
      this.manageVisible = true
      this.manageForm.resetFields()
      this.manageFormModel.money = this.settleDeail.managementMoneyTwo
      this.$nextTick(() => {
        this.manageForm.setFieldsValue(pick(this.manageFormModel, 'money'))
      })
      this.manageFormModel.tax = parseFloat(0)
    },

    // 点击修改开票金额合计
    handleInvoiceInfo() {
      // 购买方信息
      const buyerSetting = {
        settleDomainId: this.salaryStandardInfo.departId,
        settleDomainName: this.salaryStandardInfo.departName,
        settleDomainNo: this.salaryStandardInfo.departNo
      }
      // 结算单
      const settleList = [
        {
          settleFormId: this.settlementhFormInfo.id,
          settleFormType: '0', // 0普通工资、0非扣税类、1工程工资
          settleMoney: this.settlementhFormInfo.accountMoneySum || 0,
          settleMonth: this.settlementhFormInfo.settleMonth
        }
      ]
      this.$refs.otherInvoiceApplyEntranceModal.title = '开票申请 - 新建'
      this.$refs.otherInvoiceApplyEntranceModal.pageType = 1
      this.$refs.otherInvoiceApplyEntranceModal.buyerSetting = buyerSetting
      this.$refs.otherInvoiceApplyEntranceModal.selectionRows = settleList
      this.$refs.otherInvoiceApplyEntranceModal.show()
    },

    // 开票入口点击保存后回调
    otherInvoiceApplyEntranceModalOk(data) {
      // 开票金额合计
      const total = parseFloat(this.settleDeail.ticketMoneySum) + parseFloat(data.ticketMoney)
      this.settleDeail.ticketMoneySum = total.toFixed(2)
      // 本次差余额 本次差余额= 新开票金额 - 结算金额 + 上次差余额
      const restTotal =
        parseFloat(data.ticketMoney) -
        parseFloat(this.settleDeail.accountMoneySum) +
        parseFloat(this.settleDeail.prevPoorBalance)
        this.settleDeail.curPoorBalance = restTotal.toFixed(2)
        this.$emit('curOk',this.settleDeail.curPoorBalance)
    },

    handleCancelManage() {
      this.manageVisible = false
    },
    editBlurMoney(e) {
      let money = isNaN(e.target.value) ? 0 : e.target.value
      let ticket = ''
      if (this.manageFormModel.tax) {
        ticket = (money == "") ? "" : parseFloat(Number(money) + parseFloat(Number(money) * (this.manageFormModel.tax / 100))).toFixed(2)
      } else {
        ticket = money
      }
      this.manageFormModel.money = money
      this.manageFormModel.ticket = ticket
      this.manageForm.setFieldsValue(pick(this.manageFormModel, 'ticket'))
    },
    editChangeTax(value) {
      let money = isNaN(this.manageFormModel.money) ? 0 : this.manageFormModel.money
      let ticket = ''
      if (String(value) === '0') {
        this.manageFormModel.tax = 0
        ticket = parseFloat(Number(money)).toFixed(2)
      } else {
        this.manageFormModel.tax = this.deptTax
        ticket = (money == "") ? "" : parseFloat(Number(money) + parseFloat(Number(money) * (this.manageFormModel.tax / 100))).toFixed(2)
      }
      this.manageFormModel.ticket = ticket
      this.manageForm.setFieldsValue(pick(this.manageFormModel, 'ticket'))
    },
    //修改上次差余额弹框
    handleLastBalance() {
      this.lastBalanceVisible = true
      const lastBalanceModel = { prevPoorBalance: this.settleDeail.prevPoorBalance }
      this.$nextTick(() => {
        this.lastBalanceForm.setFieldsValue(pick(lastBalanceModel, 'prevPoorBalance'))
      })
    },
    //取消上次差余额弹框
    handleCancelLastBalance() {
      this.lastBalanceVisible = false
    },
    //修改上次差余额
    handleOkLastBalance() {
      this.lastBalanceForm.validateFields(['prevPoorBalance'], (err, values) => {
        if (!err) {
          // let updatePrevPoorBalanceUrl = this.url.updatePrevPoorBalance + '?id=' + this.settlementhFormInfo.id + '&prevPoorBalance=' + values.prevPoorBalance
          // httpAction(updatePrevPoorBalanceUrl,{},'POST').then((res) => {
          //   if(Number(res.code) === 200){
          //     this.settleDeail = res.data
          //     this.lastBalanceVisible = false
          //   }
          // })
          this.handleCommonLastBalance(values.prevPoorBalance)
        }
      })
    },
    handleCommonLastBalance(prevPoorBalance) {
      const updatePrevPoorBalanceUrl = `${this.url.updatePrevPoorBalance}?id=${this.settlementhFormInfo.id}&prevPoorBalance=${prevPoorBalance}`
      httpAction(updatePrevPoorBalanceUrl, {}, 'POST').then(res => {
        if (Number(res.code) === 200) {
          this.settleDeail = res.data
          this.$emit('curOk', res.data.curPoorBalance);
          this.lastBalanceVisible = false
        }
      })
    },
    handleOkMange() {
      this.manageForm.validateFields(['money', 'tax'], (err, values) => {
        if (!err) {
          this.manageLoading = true
          let formData = {}
          this.manageFormModel.money = values.money
          if (values.tax == 0) {
            this.manageFormModel.tax = 0
            this.manageFormModel.ticket = parseFloat(values.money).toFixed(2)
          } else {
            this.manageFormModel.tax = this.deptTax
            this.manageFormModel.ticket = parseFloat(
              parseFloat(values.money) + parseFloat(values.money * (this.manageFormModel.tax / 100))
            ).toFixed(2)
          }
          formData.id = this.settlementFormId
          formData.managementMoneyTwo = this.manageFormModel.money
          formData.managementMoneyTwoTax = parseFloat(
            this.manageFormModel.money * (this.manageFormModel.tax / 100)
          ).toFixed(2)
          formData.managementMoneyTwoTicket = this.manageFormModel.ticket
          let countTax
          if (this.manageFormModel.tax || this.manageFormModel.tax == 0) {
            const twoTax = parseFloat(this.manageFormModel.money * (this.manageFormModel.tax / 100)).toFixed(2)
            const managementMoneyTwoTax = this.settleDeail.managementMoneyTwoTax
              ? this.settleDeail.managementMoneyTwoTax
              : 0
            countTax = this.settleDeail.countTax ? this.settleDeail.countTax : 0
            if (twoTax > managementMoneyTwoTax) {
              let lessTax = twoTax - managementMoneyTwoTax
              countTax = parseFloat(parseFloat(countTax) + parseFloat(lessTax)).toFixed(2)
            } else {
              let lessTax = managementMoneyTwoTax - twoTax
              countTax = parseFloat(parseFloat(countTax) - parseFloat(lessTax)).toFixed(2)
            }
            formData.countTax = countTax
            //this.settleDeail.managementMoneyTwoTax = parseFloat(this.manageFormModel.money * (this.manageFormModel.tax / 100)).toFixed(2)
          }
          let accountMoneySum
          if (this.manageFormModel.ticket) {
            const managementMoneyTwoTicket = this.settleDeail.managementMoneyTwoTicket
              ? this.settleDeail.managementMoneyTwoTicket
              : 0
            accountMoneySum = this.settleDeail.accountMoneySum ? this.settleDeail.accountMoneySum : 0
            if (this.manageFormModel.ticket > managementMoneyTwoTicket) {
              let less = this.manageFormModel.ticket - managementMoneyTwoTicket
              accountMoneySum = parseFloat(parseFloat(accountMoneySum) + parseFloat(less)).toFixed(2)
            } else {
              let less = managementMoneyTwoTicket - this.manageFormModel.ticket
              accountMoneySum = parseFloat(parseFloat(accountMoneySum) - parseFloat(less)).toFixed(2)
            }
            formData.accountMoneySum = accountMoneySum
            //this.settleDeail.managementMoneyTwoTicket = this.manageFormModel.ticket
          }
          httpAction(this.url.editManageUrl, formData, 'PUT').then(res => {
            this.manageVisible = false
            this.manageLoading = false
            if (Number(res.code) === 200) {
              //从新计算结算金额开票增值税
              // if(countTax){
              //   this.settleDeail.countTax = countTax
              //   this.settleDeail.managementMoneyTwoTax = parseFloat(this.manageFormModel.money * (this.manageFormModel.tax / 100)).toFixed(2)
              // }
              if (accountMoneySum) {
                // this.settleDeail.accountMoneySum = accountMoneySum
                // this.settleDeail.managementMoneyTwoTicket = this.manageFormModel.ticket
                httpAction(
                  this.url.editSalaryUrl,
                  { id: this.salaryStandardInfo.id, settlementAmount: accountMoneySum },
                  'PUT'
                ).then(result => {
                  console.log(result)
                })
              }
              //this.settleDeail.managementMoneyTwo = this.manageFormModel.money
              this.handleCommonLastBalance(this.settleDeail.prevPoorBalance)
              this.$message.success('修改成功')
            }
          })
        }
      })
    },
    // 修改
    blurChangeTicketType(e) {
      if (e.target.value) {
        const formData = { ticketType: e.target.value, id: this.settlementFormId }
        this.callEditManageInterface(formData)
      }
    },
    // 修改扣除金额
    blurChangeDeductionAmount(e) {
      if (e.target.value) {
        const reg = /^[0-9]+(.[0-9]{1,2})?$/
        if (!reg.test(e.target.value)) {
          this.$message.error('扣除金额格式错误')
          this.settlementhFormInfo.deductionAmount = ''
        } else {
          const parameter = {deductionAmount: e.target.value, id: this.settlementFormId}
          this.callEditManageInterface(parameter)
        }
      }
    },
    // 调用修改接口
    callEditManageInterface(parameter){
      httpAction(this.url.editManageUrl,parameter,'PUT').then(res => {
        if (Number(res.code) === 200) {
          this.$message.success('修改成功')
        }
      })
    },
    // 不含税金额
    blurChangeNoTaxAmount(e) {
      if (e.target.value) {
        const reg = /^[0-9]+(.[0-9]{1,2})?$/
        if (!reg.test(e.target.value)) {
          this.$message.error('不含税金额格式错误')
          this.noTaxAmount = ''
          return
        } else {
          const parameters = { noTaxAmount: e.target.value, id: this.settlementFormId }
          httpAction(this.url.editManageUrl, parameters , 'PUT').then(res => {
              if (Number(res.code) === 200) {
                this.$message.success('修改成功')
              }
            }
          )
        }
      }
    },
    // 税额
    blurChangeTaxAmount(e) {
      if (e.target.value) {
        const reg = /^[0-9]+(.[0-9]{1,2})?$/
        if (!reg.test(e.target.value)) {
          this.$message.error('税额格式错误')
          this.taxAmount = ''
          return
        } else {
          const para = { taxAmount: e.target.value, id: this.settlementFormId }
          httpAction(this.url.editManageUrl, para , 'PUT').then(res => {
              if (Number(res.code) === 200) {
                this.$message.success('修改成功')
              }
            }
          )
        }
      }
    },
    // 发票合计金额
    blurChangeTicketSumAmount(e) {
      if (e.target.value) {
        const reg = /^[0-9]+(.[0-9]{1,2})?$/
        if (!reg.test(e.target.value)) {
          this.$message.error('发票合计金额格式错误')
          this.ticketSumAmount = ''
          return
        } else {
          httpAction(this.url.editManageUrl,{ ticketSumAmount: e.target.value, id: this.settlementFormId },'PUT').then(res => {
            if (Number(res.code) === 200) {
              this.$message.success('修改成功')
            }
          })
        }
      }
    },

    //修改备注
    blurSettleRemark(e) {
      this.settleRemark = e.target.value
      if (e.target.value) {
        let formData = {}
        formData.remark = e.target.value
        formData.id = this.settlementFormId
        httpAction(this.url.editManageUrl, formData, 'PUT').then(res => {
          if (Number(res.code) === 200) {
            this.$message.success('修改成功')
            this.settleDeail.remark = e.target.value
          }
        })
      } else {
        this.settleDeail.remark = e.target.value
      }
    },

    // 验证数字
    isNumber(rule, value, callback) {
      //const reg = /^[0-9]+(.[0-9]{1,2})?$/
      const reg = /^(-?)[0-9]+(.[0-9]{1,2})?$/
      if (!reg.test(value) && value != '') {
        callback(new Error('请输入正确的金额'))
      } else {
        callback()
      }
    },
    // 验证税率
    isTax(rule, value, callback) {
      const reg = /^[0-9]+(.[0-9]{1,2})?$/
      if (!reg.test(value) && value != '') {
        callback(new Error('请输入正确的金额'))
      } else {
        if (value < 0 || value > 100) {
          callback(new Error('税率要在0-100'))
        } else {
          callback()
        }
      }
    },
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('tax_type').then(res => {
        if (Number(res.code) === 200) {
          this.taxOptions = res.data
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
:global(.labTxt .ant-form-item-label) {
  width: 60px;
}
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
  color: #000;
  max-width: 400px;
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
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
.selfSelect {
  :global(.ant-select){
    width: 100% !important;
  }
}
.labelTxt {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}
</style>
