<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-card
        :bordered="true"
        title="结算单信息"
      >
        <table class="table1" aria-describedby="结算单信息" v-if="model.forecastForm">
          <tr class="tr1">
            <th class="td1" scope="col">单位名称</th>
            <td
              class="td2"
              colspan="3"
              style="text-align: left;"
            >{{ model.forecastForm.unitName }}</td>
            <th class="td1" scope="col">皖信盖章</th>
            <td></td>
          </tr>
          <tr class="tr1">
            <td class="td1">结算主体</td>
            <td
              class="td2"
              colspan="5"
              style="text-align: left;"
            >{{ model.forecastForm.departName }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">结算时间</td>
            <td
              class="td2"
              colspan="5"
              style="text-align: left;"
            >{{ model.forecastBill.billDate }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">序号</td>
            <td
              class="td1"
              colspan="2"
            >费用项目</td>
            <td class="td1">金额</td>
            <td class="td1">增值税金</td>
            <td class="td1">开票金额</td>
          </tr>
          <tr class="tr1">
            <td class="td1">1</td>
            <td
              class="td2"
              rowspan="7"
            >
              <div
                style="width:150px;white-space: nowrap;text-overflow:ellipsis;overflow:hidden;"
                :title="model.forecastBill.payMonths"
              >{{ model.forecastBill.payMonths }}</div>
            </td>
            <td class="td1">应缴单位社保</td>
            <td class="td2">{{ model.forecastBill.unitSocial * 1 }}</td>
            <td class="td2">{{ model.forecastBill.unitSocialTax * 1 }}</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.unitSocial * 1 + model.forecastBill.unitSocialTax * 1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">2</td>
            <td class="td1">代扣个人社保</td>
            <td class="td2">{{ model.forecastBill.personalSocial * 1 }}</td>
            <td class="td2">{{ model.forecastBill.personalSocialTax * 1 }}</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.personalSocial * 1 + model.forecastBill.personalSocialTax * 1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">3</td>
            <td class="td1">应缴单位公积金</td>
            <td class="td2">{{ model.forecastBill.unitProvident * 1 }}</td>
            <td class="td2">{{ model.forecastBill.unitProvidentTax * 1 }}</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.unitProvident * 1 + model.forecastBill.unitProvidentTax * 1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">4</td>
            <td class="td1">代扣个人公积金</td>
            <td class="td2">{{ model.forecastBill.personalProvident * 1 }}</td>
            <td class="td2">{{ model.forecastBill.personalProvidentTax * 1 }}</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.personalProvident * 1 + model.forecastBill.personalProvidentTax * 1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">5</td>
            <td class="td1">社保缴纳总合计</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.socialSum * 1) }}</td>
            <td class="td2">-</td>
            <td class="td2">-</td>
          </tr>
          <tr class="tr1">
            <td class="td1">6</td>
            <td class="td1">公积金缴纳总合计</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.fundSum * 1) }}</td>
            <td class="td2">-</td>
            <td class="td2">-</td>
          </tr>
          <tr class="tr1">
            <td class="td1">7</td>
            <td class="td1">总合计</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.sum * 1) }}</td>
            <td class="td2">-</td>
            <td class="td2">-</td>
          </tr>
          <tr class="tr1">
            <td class="td1">8</td>
            <td
              class="td1"
              colspan="2"
            >单位社保差额</td>
            <td class="td2">{{ model.forecastBill.unitSocialDiff * 1 }}</td>
            <td class="td2">{{ model.forecastBill.unitSocialDiffTax * 1 }}</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.unitSocialDiff * 1 + model.forecastBill.unitSocialDiffTax * 1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">9</td>
            <td
              class="td1"
              colspan="2"
            >个人社保差额</td>
            <td class="td2">{{ model.forecastBill.personalSocialDiff * 1 }}</td>
            <td class="td2">{{ model.forecastBill.personalSocialDiffTax * 1 }}</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.personalSocialDiff * 1 + model.forecastBill.personalSocialDiffTax * 1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">10</td>
            <td
              class="td1"
              colspan="2"
            >单位公积金差额</td>
            <td class="td2">{{ model.forecastBill.unitPrividentDiff * 1 }}</td>
            <td class="td2">{{ model.forecastBill.unitPrividentDiffTax * 1 }}</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.unitPrividentDiff * 1 + model.forecastBill.unitPrividentDiffTax * 1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">11</td>
            <td
              class="td1"
              colspan="2"
            >个人公积金差额</td>
            <td class="td2">{{ model.forecastBill.personalProvidentDiff * 1 }}</td>
            <td class="td2">{{ model.forecastBill.personalProvidentDiffTax * 1 }}</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.personalProvidentDiff * 1 + model.forecastBill.personalProvidentDiffTax * 1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">12</td>
            <td
              class="td1"
              colspan="2"
            >管理费差额</td>
            <td class="td2">{{ model.forecastBill.managementFeeDiff * 1 }}</td>
            <td class="td2">{{ model.forecastBill.managementFeeDiffTax * 1 }}</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.managementFeeDiff * 1 + model.forecastBill.managementFeeDiffTax * 1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">13</td>
            <td
              class="td1"
              colspan="2"
            >服务人数</td>
            <td class="td2">{{ model.forecastBill.serverPeopleNum * 1 }}</td>
            <td class="td2">-</td>
            <td class="td2">-</td>
          </tr>
          <tr class="tr1">
            <td class="td1">14</td>
            <td
              class="td1"
              colspan="2"
            >服务人次</td>
            <td class="td2">{{ model.forecastBill.serverPeople * 1 }}</td>
            <td class="td2">-</td>
            <td class="td2">-</td>
          </tr>
          <tr class="tr1">
            <td class="td1">15</td>
            <td
              class="td1"
              colspan="2"
            >社保卡费</td>
            <td class="td2">{{ model.forecastBill.socialCardFee * 1 }}</td>
            <td class="td2">-</td>
            <td class="td2">-</td>
          </tr>
          <tr class="tr1">
            <td class="td1">16</td>
            <td
              class="td1"
              colspan="2"
            >商险</td>
            <td class="td2">{{ model.forecastBill.businessInsurance * 1 }}</td>
            <td class="td2">{{ model.forecastBill.businessInsuranceTax * 1 }}</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.businessInsurance * 1 + model.forecastBill.businessInsuranceTax * 1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">16</td>
            <td
              class="td1"
              colspan="2"
            >商险差额</td>
            <td class="td2">{{ model.forecastBill.takingBalance * 1 }}</td>
            <td class="td2">{{ model.forecastBill.takingBalanceTax * 1 }}</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.takingBalance * 1 + model.forecastBill.takingBalanceTax * 1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">17</td>
            <td
              class="td1"
              colspan="2"
            >管理费</td>
            <td class="td2">{{ model.forecastBill.managementFee * 1 }}</td>
            <td class="td2">{{ model.forecastBill.managementFeeTax * 1 }}</td>
            <td class="td2">{{ this.formatFloat(model.forecastBill.managementFee * 1 + model.forecastBill.managementFeeTax * 1) }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">18</td>
            <td
              class="td1"
              colspan="2"
            >管理费2</td>
            <td class="td2">
              {{ model.forecastBill.managementFeeTwo*1 }}
            </td>
            <td class="td2">-</td>
            <td class="td2">{{ model.forecastBill.managementFeeTwo * 1 }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="td1"
              colspan="3"
            >结算金额合计</td>
            <td class="td2">-</td>
            <td class="td2">-</td>
            <td class="td2">{{ model.forecastBill.billFeeSum * 1 }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="td1"
              colspan="3"
            >开票金额合计</td>
            <td class="td2">-</td>
            <td class="td2">-</td>
            <td class="td2">{{ model.forecastForm.ticketFee * 1 }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1" colspan="3">上次差余额</td>
            <td class="td2" colspan="3">
              {{ model.forecastForm.prevPoorBalance * 1 }}
            </td>
          </tr>
          <tr class="tr1">
            <td class="td1" colspan="3">本次差余额</td>
            <td class="td2" colspan="3">{{ model.forecastForm.curPoorBalance * 1 }}</td>
          </tr>
        </table>
      </a-card>
    </a-spin>

  </a-modal>
</template>

<script>

  export default {
    name: 'SettleBillModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        spinning: false,
        url: {
          add: 'salary/tmatchingclaime/saveSingle', // 纯收入
          billAdd: 'hrOneTime/tsettlebill/updateClaimIdById', // 事务性外包【removeFlag：移除标识(0:匹配 1:移除)】
        },
      }
    },
    methods: {
      show(record) {
        this.model = Object.assign({}, record)
        this.visible = true
      },
      // 精度处理
      formatFloat(f, digit = 2) {
        const m = Math.pow(10, digit)
        return Math.round(f * m) / m
      },
      // 关闭功能
      handleCancel() {
        this.close()
      },
      // 表单关闭与数据重置
      close() {
        this.$emit('close')
        this.visible = false
      },
    }
  }
</script>

<style lang="less" scoped>
.table1 {
  border: 1px solid #ccc;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin: 0 auto;
}
.table1 .tr1 {
  margin: 0px;
  padding: 0;
  width: 100%;
}
.table1 .td1 {
  border: 1px solid #ccc;
  margin-left: 10px;
  padding: 5px;
  text-align: center;
  background-color: #d5e7f2;
  font-weight: bolder;
  width: 150px;
}
.table1 .td2 {
  border: 1px solid #ccc;
  margin-left: 10px;
  padding: 5px;
  width: 150px;
  text-align: center;
}
.table1 .tit {
  font-weight: bolder;
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
</style>
