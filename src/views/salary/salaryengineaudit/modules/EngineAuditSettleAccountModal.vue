<template>
  <a-card :title="settlementhFormInfo.settleDepartNo">
    <!-- <a-card
      title="基本信息"
      :bordered="false"
    >
      <a-table
        rowKey="id"
        :columns="columns"
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
            <td class="td1">{{ salaryStandardInfo.departName }}</td>
            <td class="tit td1">皖信盖章</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算编码名称</td>
            <td
              class="td1"
            >{{ salaryStandardInfo.departNo }}</td>
            <td class="tit td1">结算时间</td>
            <td
              class="td1"
            >{{ salaryStandardInfo.settlementMonth }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">业务类型</td>
            <td
              class="td1"
              colspan="3"
            >{{ salaryStandardInfo.businessType }}</td>
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
            >{{ salaryStandardInfo.salaryMonth }}</td>
            <td class="tit td1">应发工资</td>
            <td class="td1">{{ settleDeail.salarySum }}</td>
            <td class="td1">{{ settleDeail.salaryTicket }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">实发工资(银付)</td>
            <td class="td1">{{ settleDeail.cardPay }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">实发工资(现金)</td>
            <td class="td1">{{ settleDeail.moneyPay }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">暂停发金额</td>
            <td class="td1">{{ settleDeail.pausePay }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              rowspan="2"
            >{{ settleDeail.socialMonth }}</td>
            <td class="tit td1">应缴单位社保</td>
            <td class="td1">{{ settleDeail.usocialDeduction }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴个人社保</td>
            <td class="td1">{{ settleDeail.psocialDeduction }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              rowspan="2"
            >{{ settleDeail.fundMonth }}</td>
            <td class="tit td1">应缴单位公积金</td>
            <td class="td1">{{ settleDeail.ufundDeduction }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴个人公积金</td>
            <td class="td1">{{ settleDeail.pfundDeduction }}</td>
            <td class="td1"></td>
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
          <tr
            v-for="(item,index) in withholdData"
            :key="index"
          >
            <td
              class="tit td1"
              colspan="2"
            >{{ getItemName(item.itemTypeName,item.subName) }}{{ pauseTxt[item.isPause]||'' }}
            </td>
            <td class="td1">{{ item.money }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >雇主责任险</td>
            <td class="td1">{{ settleDeail.employerLiabilityInsurance }}</td>
            <td class="td1"></td>
          </tr>
          <tr
            class="tr1"
            v-if="settleDeail.takingBalance != 0"
          >
            <td
              class="tit td1"
              colspan="2"
            >商险差余额</td>
            <td class="td1">{{ settleDeail.takingBalance }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >其它费用</td>
            <td class="td1">{{ settleDeail.other }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >增值税金及附加</td>
            <td class="td1">{{ settleDeail.valueDaddedTax }}</td>
            <td class="td1">{{ settleDeail.valueDaddedTaxTicket }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >预缴企业所得税</td>
            <td class="td1">{{ settleDeail.unitIncomeTax }}</td>
            <td class="td1">{{ settleDeail.unitIncomeTaxTicket }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >预缴个人所得税</td>
            <td class="td1">{{ settleDeail.personIncomeTax }}</td>
            <td class="td1">{{ settleDeail.personIncomeTaxTicket }}</td>
          </tr>

          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >人数</td>
            <td class="td1">{{ settleDeail.personCount }}</td>
            <td class="td1"></td>
          </tr>

          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >管理费</td>
            <td class="td1">{{ settleDeail.managementCost }}</td>
            <td class="td1">{{ settleDeail.managementCostTicket }}</td>
          </tr>

          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >结算金额合计</td>
            <td class="td1"></td>
            <td class="td1">{{ settleDeail.accountMoneySum }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >开票金额合计</td>
            <td class="td1"></td>
            <td class="td1">{{ settleDeail.ticketMoneySum }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">备注</td>
            <td
              class="td1"
              colspan="3"
            >
              {{ settleDeail.remark }}
            </td>
          </tr>

        </table>

        <table class="table1" aria-describedby="tabledesc1">
          <tr class="tr1">
            <td class="tit td1">开票日期</td>
            <td class="tit td1">开票金额</td>
            <td class="tit td1">本次结算金额</td>
            <td class="tit td1">本次结算到账金额</td>
          </tr>
          <tr
            class="tr1"
            v-for="(item,index) in openData"
            :key="index"
          >
            <td class="td1">{{ (item.ticketTime || '').substring(0,10) }}</td>
            <td class="td1">{{ item.money }}</td>
            <td class="td1">{{ item.currentSettleMoney }}</td>
            <td class="td1">{{ item.currentSettleComeMoney }}</td>
          </tr>
        </table>
      </div>

    </a-card>
    <!-- <a-card
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
    </a-card> -->
  </a-card>
</template>
<script>
import { getAction } from '@/api/manage'
import { getItemName } from '@/utils/common'

export default {
  name: 'EngineAuditSettleAccountModal',
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
      salaryInfo:[],
      withholdData:[],
      balanceData:[],
      settleDeail:{},
      openData:[],
      pauseTxt:{
        '1': '(暂停发)',
        '2': '(不发放)',
      },
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
    show() {
      this.salaryInfo = []
      this.settleDeail = this.settlementhFormInfo
      //this.settlementId = this.settlementhFormInfo.settleDepartId
      //this.settlementFormId = this.settlementhFormInfo.id
      this.withholdData = this.pauseDiyInfoList
      this.balanceData = this.poorBalanceInfoList
      this.salaryInfo.push({'id':1,'settleDepartName':this.salaryStandardInfo.departName,'belongDeptId':this.salaryStandardInfo.belongDeptId
      ,'settleMonth':this.salaryStandardInfo.settlementMonth,'settleDepartNo':this.salaryStandardInfo.departNo
      })
      //获取所有公司数据
      getAction('/admin/organizationinfo/getOrgForCus').then((res) => {
        if(Number(res.code) === 200){
          this.orgList = res.data
        }
      })
    }
  },
  
}
</script>
<style scoped>
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