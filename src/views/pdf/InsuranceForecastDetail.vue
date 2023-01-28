<template>
  <div>
    <div id="content">
      <a-row>
        <a-col
          :span="18"
          :offset="3"
          style="padding-top:70px;"
        >
          <a-card
            title="客户结算单"
            :bordered="false"
            :headStyle="{'text-align':'center','border':'none','marginTop':'50px'}"
          >
            <a-row>
              <a-col :span="16">
                <p>部门编码：{{ info.settleDomainNo }}</p>
                <p>结算主体：{{ info.settleDomainName }}</p>
                <p>结算时间：{{ info.settlementMonth }}</p>
              </a-col>
              <a-col :span="8">
                <span>皖信盖章：</span>
              </a-col>
            </a-row>

            <div class="tabDiv">
              <h2 class="center">{{ info.settleDomainName }}-{{ info.settlementMonth }} 结算单</h2>
              <table
                border="1"
                class="settlement"
              >
                <tr>
                  <td class="tdbg">结算主体</td>
                  <td>{{ info.settleDomainName }}</td>
                  <td class="tdbg">皖信盖章</td>
                  <td> </td>
                </tr>
                <tr>
                  <td class="tdbg">客户单位</td>
                  <td colspan="3">{{ info.customerName }}</td>
                </tr>
                <tr>
                  <td class="tdbg">结算主体编码</td>
                  <td>{{ info.settleDomainNo }}</td>
                  <td class="tdbg">结算月份</td>
                  <td>{{ info.settlementMonth }}</td>
                </tr>
                <tr>
                  <td class="tdbg">回款金额</td>
                  <td>{{ info.payBackBalance }}</td>
                  <td class="tdbg">预估差额</td>
                  <td>{{ info.balance }}</td>
                </tr>
                <tr>
                  <td class="tdbg">发票号</td>
                  <td>{{ info.invoiceNo }}</td>
                  <td class="tdbg">创建人</td>
                  <td>{{ info.createUser }}</td>
                </tr>
              </table>
            </div>

          </a-card>
        </a-col>
      </a-row>
      <div v-if="Array.isArray(info.insuranceSettlementCoverList) && info.insuranceSettlementCoverList.length">
        <div style="page-break-before:always"></div>
        <a-row
          style="padding-top:70px;"
          v-for="(item,index) in info.insuranceSettlementCoverList"
          :key="index"
        >
          <a-col
            :span="22"
            :offset="1"
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
                <td>{{ item.departNo }}</td>
                <td
                  rowspan="5"
                  style="padding:0px 5px;border:none;width:8px;"
                >附件 {{ info.insuranceSettlementCoverList.length }} 张</td>
              </tr>
              <tr>
                <td colspan="2">
                  <p class="bold">客户单位</p>
                  <p>{{ item.customerName }}</p>
                </td>
                <td colspan="2">
                  <p class="bold">项目</p>
                  <p>{{ item.itemName }}</p>
                </td>
                <td style="width:100px">
                  <p class="bold">付款方式</p>
                  <p>{{ filterDictText(payTypeOptions,item.payType) }}</p>
                </td>
                <td>
                  <p class="bold">金额</p>
                  <p>¥{{ item.amount }}</p>
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="bold"
                >合计人民币：</td>
                <td colspan="3">{{ item.amountRmb }}</td>
                <td>¥{{ item.amount }}</td>
              </tr>
              <tr>
                <td
                  style="width:120px"
                  class="bold"
                >收款单位名称</td>
                <td>
                  {{ item.receiptName }}
                </td>
                <td
                  style="width:60px"
                  class="bold"
                >账号</td>
                <td>
                  {{ item.receiptBankNo }}
                </td>
                <td class="bold">开户行</td>
                <td>
                  {{ item.receiptBankName }}
                </td>
              </tr>
              <tr>
                <td colspan="6">
                  <span class="bold">备注</span>：{{ item.remark }}
                </td>
              </tr>
            </table>
            <a-row style="font-size:12px;">
              <a-col :span="3">公司领导：</a-col>
              <a-col :span="3">财务负责人：</a-col>
              <a-col :span="5">网银审核授权人：</a-col>
              <a-col :span="5">网银转账提交人：</a-col>
              <a-col :span="4">数据审核：</a-col>
              <a-col :span="3">制表人：{{ item.createUser }}</a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>

      <div v-if="Array.isArray(info.businessInsuranceList) && info.businessInsuranceList.length">
        <div style="page-break-before:always"></div>
        <a-col
          :span="24"
          style="padding-top:70px;"
        >
          <a-card
            title="商险详情"
            :bordered="false"
            :headStyle="{'text-align':'center','border':'none'}"
          >
            <table class="dtable">
              <tr>
                <th>结算主体编码</th>
                <th>结算主体名称</th>
                <th>姓名</th>
                <th>身份证号</th>
                <th>客户单位</th>
                <th>险种</th>
                <th>保险公司</th>
                <th>商险购买地</th>
                <th>保单号</th>
                <th>保单起止时间</th>
                <th>购买标准</th>
                <th>预估金额</th>
                <th>实际保费</th>
                <th>医保</th>
                <th>身故或残疾</th>
                <th>状态</th>
              </tr>
              <tr v-for="(item) in info.businessInsuranceList" :key="item.id">
                <td>{{ item.settlementOrganNo }}</td>
                <td>{{ item.settlementOrganName }}</td>
                <td>{{ item.empName }}</td>
                <td>{{ item.empIdcardNo }}</td>
                <td>{{ item.customerName }}</td>
                <td>{{ item.insuranceTypeName }}</td>
                <td>{{ item.insuranceCompanyName }}</td>
                <td>{{ item.businessInsuranceProv }}{{ item.businessInsuranceAddr }}</td>
                <td>{{ item.policyNo }}</td>
                <td>{{ item.policyStart }}~{{ item.policyEnd }}</td>
                <td>{{ item.buyStandard }}</td>
                <td>{{ item.forecastBuyPay }}</td>
                <td>{{ item.buyPay }}</td>
                <td>{{ item.medicalMoney }}</td>
                <td>{{ item.deathDisabilityMoney }}</td>
                <td>{{ filterDictText(statusOptions,item.status) }}</td>
              </tr>
            </table>
          </a-card>
        </a-col>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
import { httpAction } from '@/api/manage'

export default {
  name:'InsuranceForecastDetail',
  data() {
    return {
      info:{},
      payTypeOptions:[], // 付款方式
      url:'/busiInsurance/forecastbuypayform/',
      columns:[
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'settlementOrganNo',
        },
        {
          title: '结算主体名称',
          align: 'center',
          dataIndex: 'settlementOrganName',
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'empName',
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'empIdcardNo',
        },
        {
          title: '客户单位',
          align: 'center',
          dataIndex: 'customerName',
        },
        {
          title: '险种',
          align: 'center',
          dataIndex: 'insuranceTypeName',
        },
        {
          title: '保险公司',
          align: 'center',
          dataIndex: 'insuranceCompanyName',
        },
        {
          title: '商险购买地',
          align: 'center',
          dataIndex: 'businessInsuranceAddr',
          customRender:(text,record)=>{
            return `${record.businessInsuranceProv} ${text}`
          }
        },
        {
          title: '保单号',
          align: 'center',
          dataIndex: 'policyNo',
        },
        {
          title: '保单起止时间',
          align: 'center',
          dataIndex: 'policyStart',
          customRender:(text,record)=>{
            return `${text}~${record.policyEnd}`
          }
        },
        {
          title: '购买标准',
          align: 'center',
          dataIndex: 'buyStandard',
        },
        {
          title: '实际保费',
          align: 'center',
          dataIndex: 'buyPay',
        },
        {
          title: '医保',
          align: 'center',
          dataIndex: 'medicalMoney',
        },
        {
          title: '身故或残疾',
          align: 'center',
          dataIndex: 'deathDisabilityMoney',
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender:(text)=>{
            return filterDictText(this.statusOptions,text)
          }
        },
      ],
    }
  },
  created() {
    // 付款方式
    initDictOptions('insurance_payType').then((res) => {
      if (Number(res.code) === 200) {
        this.payTypeOptions = res.data
      }
    })
    // 状态
    initDictOptions('Insurance_record_status').then((res) => {
      if (Number(res.code) === 200) {
        this.statusOptions = res.data
      }
    });
    if(this.$route.query.id){ //查询详情
      httpAction(this.url+this.$route.query.id,null,'get').then((res)=>{
        if(Number(res.code) === 200){
          this.info = res.data
          this.printer()
        }
      })
    }
  },
  methods: {
    moment,
    filterDictText,
    // 打印
    printer(){
      //打印
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
.settlement tr,
.cover tr {
  height: 36px;
  border: solid #999 1px;
}
.settlement tr td,
.cover tr td {
  padding-left: 10px;
}
.settlement td.tdbg {
  background: #ddd;
  font-weight: bold;
  text-align: center;
}
.settlement td h6,
.bold {
  font-weight: bold;
}
.center {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.sxtable {
  :global(td) {
    font-size: 10px;
    padding: 0px !important;
  }
  :global(th) {
    font-size: 12px;
  }
}
.dtable td,.dtable th{
  border: 1px solid #999;
  font-size: 8px;
}
</style>
<style media="print">
@page {
  size: auto; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>
