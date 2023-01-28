<template>
  <a-card>
    <a-tabs v-model="activeKey">
      <a-tab-pane
        v-for="pane in panes"
        :tab="pane.payTypeText"
        :key="pane.id"
      >
        <a-row type="flex">
          <a-col
            style="text-align:center;font-size:15px;font-weight:bolder;color:#333"
            :span="12"
            :offset="6"
          >{{ pane.title }}</a-col>
          <a-col
            style="text-align:center;font-size:20px;font-weight:bolder;color:#333;margin-top:10px"
            :span="12"
            :offset="6"
          >{{ pane.payTypeText }}审批单</a-col>
        </a-row>
        <table class="table1">
          <tr class="tr1">
            <td
              class="td1"
              colspan="2"
            ></td>
            <td
              class="td1"
              colspan="2"
            >{{ pane.createDate }}</td>
            <td class="td1">结算主体编码</td>
            <td class="td1">{{ pane.settleDepartNo }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="td1"
              colspan="2"
            >
              <p class="font18">单位</p>
              <p>{{ pane.unitName }}</p>
              <p>{{ pane.settleDepartName }}</p>
            </td>
            <td
              class="td1"
              colspan="2"
            >
              <p class="font18">项目</p>
              <p>{{ pane.settlementMonth }}工资</p>
            </td>
            <td class="td1">
              <p class="font18">付款方式</p>
              <p>{{ pane.payTypeText }}</p>
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
          <tr v-if="pane.type == 1">
            <td class="td1">收款单位名称:</td>
            <td class="td1">
              {{ pane.organName }}
            </td>
            <td class="td1">账户:</td>
            <td class="td1">
              {{ pane.bankNo }}
            </td>
            <td class="td1">开户行:</td>
            <td class="td1">
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
        <a-row
          type="flex"
          v-if="pane.type == 1"
        >
          <a-col :span="4">公司领导:</a-col>
          <a-col :span="4">财务负责人:</a-col>
          <a-col :span="4">网银审核授权人:</a-col>
          <a-col :span="4">网银转账提交人: {{ bankUpName }}</a-col>
          <a-col :span="4">数据审核:{{ auditName }}</a-col>
          <a-col :span="4">制表人:{{ createName }}</a-col>
        </a-row>
        <a-row
          type="flex"
          v-if="pane.type == 0"
        >
          <a-col :span="4">公司领导:</a-col>
          <a-col :span="4">财务负责人:</a-col>
          <a-col :span="4">出纳会计:</a-col>
          <a-col :span="4">数据审核:{{ auditName }}</a-col>
          <a-col :span="4">制表人:{{ createName }}</a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>

import { httpAction } from '@/api/manage'
import { mapGetters } from 'vuex'
export default {
  name:'SalaryFailPageModal',
  data() {
    return {
      panes:[],
      activeKey:'1',
      payType:1,
      employData:[],
      createName:'',
      auditName:'',
      revenueName:'',
      bankUpName:''
    }
  },
  props: {
    coverList:{
      type:Array,
      required:true
    },
    lostInfo:{
      type:Object,
      required:true
    }
  },
  methods:{
    ...mapGetters(["nickname", "avatar","userInfo"]),
    show(){
      this.bankUpName = this.nickname()
      httpAction('/admin/user/userDic', '', 'GET').then((res) => {
        if (res.code === 200) {
          for(var d in res.data){
            // if(this.lostInfo.createUser == d.userId){
            //   this.createName = d.nickname
            // }
            // if(this.salaryStandardInfo.auditUser == d.userId){
            //   this.auditName = d.nickname
            // }
            // if(this.salaryStandardInfo.revenueUser == d.userId){
            //   this.revenueName = d.nickname
            // }
            if(this.coverList[0]&&this.coverList[0].createUser&&this.coverList[0].createUser == d){
              this.createName = res.data[d]
            }
          }
        } 
      })
      this.panes = this.coverList
      for(var c in this.panes){
        if(c == 0){
          this.activeKey = this.panes[0].id
        }
        this.panes[c].auditName = ''
        this.panes[c].createName = ''
        //this.panes[c].title = this.panes[c].type == 1 ? '银行转账' : '现金付款'
        this.panes[c].key = this.panes[c].id
        this.panes[c].payTypeText = this.panes[c].type == 1 ? '银行转账' : '现金付款'
      }
    },
    onChange(activeKey ){
      console.log(activeKey)
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
  border: 1px solid #333;
  text-align: center;
  height: 40px;
  padding: 10px;
  width: 17%;
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
  background: #e6f7ff;
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
.font18 {
  font-size: 18px;
  font-weight: bolder;
}
</style>