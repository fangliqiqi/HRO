<template>
  <a-card :title="salaryStandardInfo.departNo">
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
              colspan="4"
            >{{ salaryStandardInfo.departNo }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算时间</td>
            <td
              class="td1"
              colspan="4"
            >{{ salaryStandardInfo.settlementMonth }}</td>
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
            >{{ salaryStandardInfo.salaryMonth }}</td>
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
            >{{ salaryAccountOne.deduProvidentMonth }}</td>
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
            <td class="td1">{{ settlementhFormInfo.personalCurmonthTax }}</td>
            <td class="td1"></td>
            <td class="td1"></td>
          </tr>
          <!-- <tr class="tr1" v-if="settlementhFormInfo.deductPersonal">
            <td
              class="tit td1"
              colspan="2"
            >代扣个人费用</td>
            <td class="td1">{{ settlementhFormInfo.deductPersonal.toFixed(2) }}</td>
            <td class="td1"></td>
            <td class="td1"></td>
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
          <!-- <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >开票金额合计</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >上次差余额</td>
            <td class="td1">0.0</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >本次差余额</td>
            <td class="td1">{{ settleDeail.curPoorBalance }}</td>
          </tr> -->
          <tr class="tr1">
            <td class="tit td1">备注</td>
            <td
              class="td1"
              colspan="4"
            >{{ salaryStandardInfo.remark }}</td>
          </tr>
          <!-- <tr class="tr1">
            <td class="tit td1">发票类型</td>
            <td class="tit td1">扣除金额</td>
            <td class="tit td1">不含税金额</td>
            <td class="tit td1">税额</td>
            <td class="tit td1">发票合计金额</td>
          </tr>
          <tr class="tr1">
            <td class="td1">0.0</td>
            <td class="td1">0.0</td>
            <td class="td1">0.0</td>
            <td class="td1">0.0</td>
            <td class="td1">0.0</td>
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
      </a-table>
    </a-card>
  </a-card>
</template>
<script>
import { getAction } from '@/api/manage'
import { getItemName } from '@/utils/common'

export default {
  name: 'PauseSettleAccountModal',
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
      this.salaryInfo = []
      this.settleDeail = this.settlementhFormInfo
      //this.settlementId = this.settlementhFormInfo.settleDepartId
      //this.settlementFormId = this.settlementhFormInfo.id
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
      this.salaryInfo.push({'id':1,'settleDepartName':this.salaryStandardInfo.departName,'belongDeptId':this.salaryStandardInfo.belongDeptId
      ,'settleMonth':this.salaryStandardInfo.settlementMonth,'settleDepartNo':this.salaryStandardInfo.departNo
      })
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