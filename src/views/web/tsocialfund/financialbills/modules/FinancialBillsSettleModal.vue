<template>
  <a-card :title="settlementhFormInfo.settleDepartNo">

    <a-card :bordered="false">
      <div class="tabDiv">
        <h2>{{ settlementhFormInfo.unitName }}-{{ settlementhFormInfo.settleMonth }} - 结算单</h2>
        <table class="table1">

          <tr class="tr1">
            <td class="tit td1">单位名称</td>
            <td class="td1">{{ settlementhFormInfo.unitName }}</td>
            <td class="tit td1">皖信盖章</td>
            <td class="td1" colspan="2"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算主体</td>
            <td
              class="td1"
              colspan="4"
            >{{ settlementhFormInfo.deptName }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算主体编码</td>
            <td
              class="td1"
              colspan="4"
            >{{ settlementhFormInfo.deptNo }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算时间</td>
            <td class="td1" >{{ settlementhFormInfo.settleMonth }}</td>
            <td class="tit td1">业务类型</td>
            <td
              class="td1"
              colspan="2"
            >{{ settlementhFormInfo.businessType }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >费用项目</td>
            <td class="tit td1">金额</td>
            <td class="tit td1">增值税</td>
            <td class="tit td1">结算额小计</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              rowspan="4"
            >
              {{ settlementhFormInfo.createMonth }}
            </td>
            <td class="tit td1">应缴单位社保</td>
            <td class="td1">
              {{ settlementhFormInfo.unitSocial || 0 }}
            </td>
            <td class="td1">-</td>
            <td class="td1">{{ settlementhFormInfo.unitSocialTicket || 0 }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴个人社保</td>
            <td class="td1">
              {{ settlementhFormInfo.personalSocial || 0 }}
            </td>
            <td class="td1">-</td>
            <td class="td1">{{ settlementhFormInfo.personalSocialTicket || 0 }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴单位公积金</td>
            <td class="td1">
              {{ settlementhFormInfo.unitFund || 0 }}
            </td>
            <td class="td1">-</td>
            <td class="td1">{{ settlementhFormInfo.unitFundTicket || 0 }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴个人公积金</td>
            <td class="td1">
              {{ settlementhFormInfo.personalFund || 0 }}
            </td>
            <td class="td1">-</td>
            <td class="td1">{{ settlementhFormInfo.personalFundTicket || 0 }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >服务人数</td>
            <td class="td1" colspan="3">
              <input
                style="border-radius:5px;border:1px solid gray;width:80%;text-align:center;width:94%"
                v-if="isedit"
                :value="settlementhFormInfo.personNum"
                @blur="blurSettlepersonNum"
              >
              <span v-else>
                {{ settlementhFormInfo.personNum || 0 }}
              </span>
            </td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >服务人次</td>
            <td class="td1" colspan="3">
              <input
                style="border-radius:5px;border:1px solid gray;width:80%;text-align:center;width:94%"
                :value="settlementhFormInfo.personCount"
                @blur="blurSettlepersonCount"
                v-if="isedit"
              >
              <span v-else>
                {{ settlementhFormInfo.personCount || 0 }}
              </span>
            </td>
          </tr>
          <tr class="tr1">
            <td class="tit td1" colspan="2">管理费</td>
            <td class="td1">
              <input
                style="border-radius:5px;border:1px solid gray;width:80%;text-align:center"
                :value="settlementhFormInfo.managment"
                @blur="blurManagment"
                v-if="isedit"
              >
              <span v-else>
                {{ settlementhFormInfo.managment || 0 }}
              </span>
            </td>
            <td class="td1">
              <input
                style="border-radius:5px;border:1px solid gray;width:80%;text-align:center"
                :value="settlementhFormInfo.managmentTax"
                @blur="blurManagmentTax"
                v-if="isedit"
              >
              <span v-else>
                {{ settlementhFormInfo.managmentTax || 0 }}
              </span>
            </td>
            <td class="td1">{{ settlementhFormInfo.managmentTicket || 0 }}</td>
          </tr> 
          <tr class="tr1">
            <td class="tit td1" colspan="2">结算金额合计</td>
            <td class="td1">{{ settlementhFormInfo.settleMoney || 0 }}</td>
            <td class="td1">{{ settlementhFormInfo.managmentTax || 0 }}</td>
            <td class="td1">{{ settlementhFormInfo.billFeeSum || 0 }}</td>
          </tr> 
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >开票金额合计</td>
            <td class="td1" id="invoicePosite">
              <input
                style="border-radius:5px;border:1px solid gray;width:100%;text-align:center;width:85%"
                :value="settlementhFormInfo.ticketMoneySum"
                @blur="blurSettleticketMoneySum"
                v-if="isedit"
              >
              <span v-else>
                {{ settlementhFormInfo.ticketMoneySum || 0 }}
              </span>
            </td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >上次差余额</td>
            <td class="td1" >
              <input
                style="border-radius:5px;border:1px solid gray;width:100%;text-align:center;width:85%"
                :value="settlementhFormInfo.lastDifference"
                @blur="blurSettlelastDifference"
                v-if="isedit&&hasOperatePermission('wxhr:tfinancebill_edit')"
              >
              <span v-else>
                {{ settlementhFormInfo.lastDifference || 0 }}
              </span>
            </td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="4"
            >累计差余额</td>
            <td class="td1">{{ settlementhFormInfo.sumDifference || 0 }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">备注</td>
            <td 
              class="td1"
              colspan="4">
              <input
                style="border-radius:5px;border:1px solid gray;width:80%;text-align:center"
                :value="settlementhFormInfo.remark"
                maxlength="200"
                @blur="blurRemark"
                placeholder="请输入备注，最多200字！"
                v-if="isedit"
              >
              <span v-else style="word-break:break-all;word-wrap:break-word">
                {{ settlementhFormInfo.remark }}
              </span>
            </td>
          </tr>
        </table>
      </div>
      <template v-if="settlementhFormInfo.id">
        <invoice-info-modal
          ref="InvoiceInfoForm"
          :openInvoiceInfo="settlementhFormInfo"
          :isedit="isedit"
          :billId="settlementhFormInfo.id"
          :invoiceInfo="invoiceInfo"
          @ok="updateInvoice"
          @mok="updateOpenInvoice"
        ></invoice-info-modal>
      </template>
    </a-card>

  </a-card>
</template>
<script>
import { httpAction } from '@/api/manage'
import { hasOperatePermission } from '@/utils/common'
import InvoiceInfoModal from './InvoiceInfoModal'

export default {
  name: 'AgencySettleAccountModal',
  components: {
    InvoiceInfoModal
  },
  data() {
    return {
      url:{
        editUrl:'/hrSocial/tfinancebill/updateByIdAsso', //只修改 人次 人数开票金额
        diffUrl:'/hrSocial/tfinancebill/updateDiffByIdAsso', //只修改 上次差余额 
      },
      
      manageVisible:false,
      manageForm:this.$form.createForm(this),
      salaryInfo:[],
      withholdData:[],
      balanceData:[],
      settleDeail:{},
      manageLoading: false,
      isEdit:false,
    }
  },
  props: {
    settlementhFormInfo:{
      type:Object,
      required:true
    },
    invoiceInfo:{
      type:Object,
      required:true
    },
    isedit:{
      type:Boolean,
      require:true
    }
  },
  methods:{
    hasOperatePermission,
    updateInvoice(data,field){
      if(field){
        this.$emit('ok',data,field);
      }else{
        // 开票金额合计
        this.settlementhFormInfo.ticketMoneySum = data;
        // 滚动到指定位置
        document.getElementById('invoicePosite').scrollIntoView()
        const obj = {target:{value:String(data)}}
        this.editFun('ticketMoneySum',obj,2);
      }
    },
    updateOpenInvoice(data){
      delete data.id;
      this.settlementhFormInfo = Object.assign(this.settlementhFormInfo,data);
    },
    // 调用子组件方法
    changeColumn(){
      this.$refs.InvoiceInfoForm.setColumn();
    },
    /*
      后续本期差余额=开票金额-结算金额
      累计差余额=上次差余额+本次差余额 
      注意：点击结算单下面的开票金额合计按钮 会直接定位到开票金额 以及修改
    */   
    // 开票金额修改
    blurSettleticketMoneySum(e){
      this.editFun('ticketMoneySum',e,2)
    },
    // 上次差余额修改
    blurSettlelastDifference(e){
      this.editFun('lastDifference',e,2)
    },
    // 累计差余额计算
    sumDifference(name,e){
      let num;
      if(name == 'ticketMoneySum'){
        num = Number(e.target.value)  - Number(this.settlementhFormInfo.billFeeSum) + Number(this.settlementhFormInfo.lastDifference)
      }else if(name == 'lastDifference'){
        num = Number(this.settlementhFormInfo.ticketMoneySum)  - Number(this.settlementhFormInfo.billFeeSum) + Number(e.target.value)
      }else if(name == 'managment'){
        // 结算金额
        let settleMoney = this.reduceFun([e.target.value,this.settlementhFormInfo.unitSocial,this.settlementhFormInfo.unitFund,
                                                              this.settlementhFormInfo.personalFund,this.settlementhFormInfo.personalSocial])
        // 结算金额合计
        let billFeeSum = this.reduceFun([settleMoney,this.settlementhFormInfo.managmentTax])
        num  =  Number(this.settlementhFormInfo.ticketMoneySum)  - Number(billFeeSum) + Number(this.settlementhFormInfo.lastDifference)
      }else if(name == 'managmentTax'){
         // 结算金额合计 
        let billFeeSum = this.reduceFun([this.settlementhFormInfo.settleMoney,e.target.value])
        num  =  Number(this.settlementhFormInfo.ticketMoneySum)  - Number(billFeeSum) + Number(this.settlementhFormInfo.lastDifference)
      }
      return  num == '-0'?0:num.toFixed(2)
    },

    // 结算金额等计算
    settleFun(name,e,type,boo){
      if(name == 'managment'){
        e.target.value = boo?e.target.value:this.settlementhFormInfo.managment

        this.settlementhFormInfo.settleMoney =this.reduceFun([e.target.value,this.settlementhFormInfo.unitSocial,this.settlementhFormInfo.unitFund,
                                                              this.settlementhFormInfo.personalFund,this.settlementhFormInfo.personalSocial])
        this.settlementhFormInfo.billFeeSum = this.reduceFun([this.settlementhFormInfo.settleMoney,this.settlementhFormInfo.managmentTax])
       
        this.settlementhFormInfo.managmentTicket =this.reduceFun([e.target.value,this.settlementhFormInfo.managmentTax])
      
      }else if(name == 'managmentTax'){
        e.target.value = boo?e.target.value:this.settlementhFormInfo.managmentTax
        this.settlementhFormInfo.billFeeSum =this.reduceFun([this.settlementhFormInfo.settleMoney,e.target.value])
        this.settlementhFormInfo.managmentTicket = this.reduceFun([e.target.value,this.settlementhFormInfo.managment])
      }
    },
    // 服务人数
    blurSettlepersonNum(e){
      this.editFun('personNum',e,1)
    },
     // 服务人次
    blurSettlepersonCount(e){
      this.editFun('personCount',e,1)
    },
    // 管理费修改
    blurManagment(e){
      this.editFun('managment',e,2)
    },
    // 管理费税
    blurManagmentTax(e){
      this.editFun('managmentTax',e,2)
    
    },
    // 备注修改
    blurRemark(e){
      this.editFun('remark',e,3)
    },

    // 编辑修改的函数
    editFun(name,e,type){
      // 1 代表人数人次 只能输入正整数  2 代表上次差余额等就可以输入两位小数  3 备注
      let num = type==3?e.target.value:Number(e.target.value) 
      if(e.target.value){
         if(type==1&&!new RegExp(/((^[1-9]\d*)|^0)$/).test(e.target.value)){
          this.$message.warning('只能输入正整数')
          e.target.value = null
          this.settlementhFormInfo[name] = null
          return false
        }
        //     /((^[1-9]\d*)|^0)(\.\d{1,2})?$/
        // eslint-disable-next-line no-useless-escape
        if(type==2&&!new RegExp(/^(\-)?\d+(\.\d{1,2})?$/).test(e.target.value)){
          this.$message.warning('只能输入数字且只能带两位小数')
          e.target.value = null
          return false
        }

        if(type==3&&num.length>200){
          this.$message.warning('最多输入200字！')
          return false
        }

        let params = {}
        params[name] = num
        
        params.id =  this.settlementhFormInfo.id
        let url = this.url.editUrl
      
        if(type==2&&name=='lastDifference'){  
          url = this.url.diffUrl   
          params.ticketMoneySum = Number(this.settlementhFormInfo.ticketMoneySum) //开票金额
          params.settleMoney = Number(this.settlementhFormInfo.settleMoney)  //结算金额
          params.sumDifference = this.sumDifference(name,e)
        }else if(type==2&&name =='ticketMoneySum'){
          params.settleMoney = Number(this.settlementhFormInfo.settleMoney)  // 结算金额
          params.lastDifference = Number(this.settlementhFormInfo.lastDifference) //上次差
          params.sumDifference = this.sumDifference(name,e)
        }else if(type==2&&name=='managment'){
          params.managmentTax = Number(this.settlementhFormInfo.managmentTax)  // 管理费税
          params.managmentTicket = Number(this.settlementhFormInfo.managmentTax) + Number(num) //管理费结算小计
          params.sumDifference = this.sumDifference(name,e)
          // 结算金额
          params.settleMoney = this.reduceFun([e.target.value,this.settlementhFormInfo.unitSocial,this.settlementhFormInfo.unitFund,
                                                              this.settlementhFormInfo.personalFund,this.settlementhFormInfo.personalSocial])

          params.billFeeSum  = this.reduceFun([params.settleMoney,this.settlementhFormInfo.managmentTax]) //结算金额结算小计
        }else if(type==2&&name=='managmentTax'){
          params.managment = Number(this.settlementhFormInfo.managment)  // 管理费
          params.managmentTicket = Number(this.settlementhFormInfo.managment) + Number(num)  //管理费结算小计
          params.sumDifference = this.sumDifference(name,e)
          params.billFeeSum  = this.reduceFun([this.settlementhFormInfo.settleMoney,e.target.value]) //结算金额结算小计
        }
        httpAction(url, params, 'PUT').then((res) => {
          if(res.code == 200){
            this.$message.success("修改成功")
            this.$nextTick(()=>{
              this.settlementhFormInfo.sumDifference = type==2?this.sumDifference(name,e):this.settlementhFormInfo.sumDifference
              this.settleFun(name,e,type,true)
            })
            
            this.$set(this.settlementhFormInfo,name,num)
            this.$forceUpdate()

          }else{
            this.$message.warning(res.msg)
            this.$nextTick(()=>{
              this.settleFun(name,e,type,false)
            })
            
          }
        }).catch(()=>{
          this.$nextTick(()=>{
            this.settleFun(name,e,type,false)
          })
        })
      }else{
        this.settlementhFormInfo[name] = e.target.value
      }
    },
    // 数据相加
    reduceFun(arr){
      let sum = 0
      if(Object.prototype.toString.call(arr)=='[object Array]'){
        sum = arr.reduce((total,cur)=>{
          cur = cur?Number(cur):0
          return  total + cur
        },0)
      }
      return sum.toFixed(2)
    },
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
  text-align: center;
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
  white-space: normal;
  word-break: break-all;
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
