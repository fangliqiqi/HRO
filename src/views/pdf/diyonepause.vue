<template>
  <div>
    <a-row>

      <div
        v-for="(pane,index) in coverList"
        :key="index"
        class="cover"
        style="transform: rotate(-90deg);position: relative;top: 250px;right:100px;"
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
            <td
              class="td1"
              colspan="2"
            >Z</td>
            <td
              class="td1"
              colspan="2"
            >{{ pane.createDate }}</td>
            <td class="td1">结算主体编码</td>
            <td class="td1">{{ pane.settleNo }}</td>
            <td
              rowspan="5"
              style="border:0;width:5px"
            >附件&nbsp;&nbsp;&nbsp; 张</td>
          </tr>
          <tr class="tr1">
            <td
              class="td1"
              colspan="2"
            >
              <p class="font18">单位</p>
              <p>{{ pane.unitName }}</p>
              <p>{{ pane.settleName }}</p>
            </td>
            <td
              class="td1"
              colspan="2"
            >
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
          <tr v-if="pane.payType == 1">
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
        <p v-if="pane.payType == 1">
          <span>公司领导:</span>
          <span style="margin-left:100px">财务负责人: {{ revenueName }}</span>
          <span style="margin-left:100px">网银审核授权人:</span>
          <span style="margin-left:50px">网银转账提交人: {{ bankUpName }}</span>
          <span style="margin-left:50px">数据审核: {{ auditName }}</span>
          <span style="margin-left:50px">制表人: {{ createName }}</span>
        </p>
        <p v-if="pane.payType == 0">
          <span>公司领导:</span>
          <span style="margin-left:100px">财务负责人: {{ revenueName }}</span>
          <span style="margin-left:100px">出纳会计:</span>
          <span style="margin-left:50px">数据审核: {{ auditName }}</span>
          <span style="margin-left:50px">制表人: {{ createName }}</span>
        </p>
        <p style="text-align:center;padding-top:15px">本次打印为第&nbsp; {{ count }} &nbsp;次打印,请注意避免重复! &nbsp;打印时间: {{ printData.printDate }} &nbsp; 打印柜员: {{ printData.printUser }} &nbsp; 验证码: {{ printData.uniqueCode }}</p>
        <div style="page-break-after:always"></div>
      </div>

    </a-row>

  </div>
</template>
<script>
import { httpAction } from '@/api/manage'
import { mapGetters } from 'vuex'
import { detectZoom } from '@/utils/common'

export default {
  data() {
    return{
      createName:'',
      auditName:'',
      revenueName:'',
      bankUpName:'',
      pauseDiyInfoList:[],
      settlementhFormInfo:{},
      salaryStandardInfo:{},
      coverList:[],
      printData:{},
      count:0,
      url:{
        detailUrl:"salary/tchargerecord/openChargeRecordDetail",
        doPrint:"/salary/tprintrecord/doPrint"
      },
    }
  },
  created(){
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
        this.pauseDiyInfoList = res.data.settlementhFormSubList
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
              this.printData = res.data
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
    ...mapGetters(["nickname", "avatar","userInfo"]),
  }
}
</script>
<style lang="scss">
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
  word-break: break-all;
  //padding: 10px;
  width: 17%;
}
.table1 .td2 {
  font-size: 16px;
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 10px;
  //padding: 10px;
  width: 17%;
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
  padding-left: 20px;
}
.cover {
  margin: 0 auto;
  width: 900px;
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
  size: portrait; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>