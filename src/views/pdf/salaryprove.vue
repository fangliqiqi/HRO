<template>
  <div>
    <div id="content" style="padding-top:30px;">
      <a-row>
        <a-col
          :span="3"
          :offset="1"
        ><img src="/proveSalaryLogo.jpg" alt="logo"></a-col>
        <a-col
          style="color:#000"
          v-if="isShowNo"
          :span="5"
          :offset="15"
        >编号：{{ no }}</a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <h2 class="center">工作收入证明</h2>
        </a-col>
        <a-col
          :span="22"
          :offset="1"
        >
          <div class="proveInfo">
            <div
              class="syContent"
              v-if="type == 1"
            >
              兹有<span>{{ obj.employeeName }}</span>，身份证号码<span>{{ obj.employeeIdCard }}</span>，入职时间为:<span>{{ obj.entryDate || '&nbsp;' }}</span>，试用期工资为¥<span>{{ obj.proveSalary }}</span>元，
              (大写)<span>{{ obj.capital }}</span>，特此证明。
            </div>
            <div
              class="zsContent"
              v-if="type == 0"
            >
              <form :form="form">
                兹有<span>{{ obj.employeeName }}</span>，身份证号码<span>{{ obj.employeeIdCard }}</span>，系我单位聘用员工，现任职部门及工作岗位：<span>{{ obj.employeeSettleDepartName }}</span>
                <span v-if="obj.post">{{ obj.post }}</span>
                <span v-else>
                  <a-input
                    class="inputStyle"
                    id="post"
                    type="text"
                    v-decorator="['post']"
                  /></span>
                ，劳动合同期至
                <span v-if="obj.contractEndDate">{{ moment(obj.contractEndDate).format("YYYY") }}</span>
                <span v-else>
                  <a-input
                    style="border:none;color: #000;position: relative;top:2px;height: 24px;width:80px;font-size:16px;"
                    id="year"
                  />
                </span>年
                <span v-if="obj.contractEndDate">{{ moment(obj.contractEndDate).format("MM") }}</span>
                <span v-else>
                  <a-input
                    style="border:none;color: #000;position: relative;top:2px;height: 24px;width:50px;font-size:16px;"
                    id="month"
                    v-decorator="['month']"
                  />
                </span>
                月，其近<span>{{ obj.mouthCount }}</span>个月月均¥<span>{{ obj.proveSalary }}</span>元，（大写）<span>{{ obj.capital }}</span>
                ，特此证明。
              </form>
            </div>
            <ul>
              <li>本单位申明</li>
              <li>1、本证明仅用于当事人的工作收入证明，不作为我单位对当事人任何形式的经济担保；</li>
              <li>2、本工作收入证明复印无效。</li>
            </ul>
          </div>
        </a-col>
        <a-col
          :span="9"
          :offset="15"
          class="chapter"
        >
          <p>{{ obj.unitName }}（章）：</p>
          <p><span>{{ moment(obj.creatDate).format("YYYY") }}</span>年<span>{{ moment(obj.creatDate).format("MM") }}</span>月<span>{{ moment(obj.creatDate).format("DD") }}</span>日&nbsp;&nbsp;&nbsp;&nbsp;</p>
        </a-col>
        <a-col
          :span="22"
          :offset="1"
        >
          <ul class="remark">
            <li>备注</li>
            <li>1、单位全称：<span>{{ obj.unitName }}</span></li>
            <li>2、地址：<span>{{ obj.unitAddr }}</span></li>
            <li>3、联系电话（固定电话）：<span>{{ obj.phone }}</span></li>
          </ul>
        </a-col>
      </a-row>
    </div>
    <a-row id="operate">
      <!-- <a-col
        :span="4"
        :offset="20"
        v-if="auditOperate"
      > 
        <a-button @click.stop="()=>{ecuvisible=false}">返回</a-button>
        <a-button type="primary" icon="download" @click="printer(1)">导出</a-button>&nbsp;&nbsp;
        <a-button type="primary" icon="printer" @click="printer(0)">打印</a-button>
      </a-col> -->
      <a-col
        :span="4"
        :offset="20"
        v-if="detailOperate"
      >
        <a-button
          type="primary"
          icon="printer"
          @click="detailPrinter"
        >打印</a-button>
      </a-col>

    </a-row>
  </div>
</template>

<script>
import moment from 'moment'
import { httpAction } from '@/api/manage'

export default {
  data() {
    return {
      type:0, //0正式员工1试用期员工
      form: this.$form.createForm(this),
      obj:{},
      id:'',
      title:'',
      auditOperate:true,
      isShowNo:false,
      detailOperate:false,
      no:''
    }
  },
  created() {
    this.type = this.$route.query.type
    
    if(this.$route.query.obj){ //开具证明
      this.obj = JSON.parse(this.$route.query.obj)
    }
    if(this.$route.query.no){ //打印导出时显示
      this.no = this.$route.query.no
    }
    if(this.$route.query.isShowNo){//打印导出时显示
      this.isShowNo = (this.$route.query.isShowNo) ? true : false
    }
    if(this.$route.query.id){ //查询详情
      this.id = this.$route.query.id
      httpAction('hrBase/salaryProve/printing/'+this.$route.query.id,null,'get').then((res)=>{
        if(Number(res.code) === 200){
          this.auditOperate = false
          this.isShowNo = true
          this.detailOperate = (this.$route.query.isCanPrint == "1") ? true : false
          this.no = res.data.no
          this.obj = res.data
        }
      })
    }

  },
  mounted(){
    if(this.$route.query.no && this.$route.query.otype == 1){
      document.getElementById("operate").style.display="none"
      window.print()
      document.getElementById("operate").style.display="block"
      window.parent.closeIframe()
    }
  },
  methods: {
    moment,
    // 打印
    printer(type){
      const url = 'hrBase/salaryProve/proveRecord'
      httpAction(url,this.obj,'post').then((res)=>{
        if(Number(res.code) === 200){
          this.number = res.data
          this.isShowNo = true
          if(type == 0){
            //打印
            setTimeout(function(){
              document.getElementById("operate").style.display="none";
              window.print()
              document.getElementById("operate").style.display="block";
            },1000)
          }else{
            //导出
          }
          
        }else{
          this.$message.warning(res.msg)
        }
      })
      
    },
    detailPrinter(){
      const url = 'hrBase/salaryProve/addone/'
      const _this = this
      httpAction(url+this.id,null,'get').then((res)=>{
        if(Number(res.code) === 200){
          setTimeout(function(){
            document.getElementById("operate").style.display="none";
            window.print()
            document.getElementById("operate").style.display="block";
            // window.parent.closeIframe()
            _this.$emit('ok')
            // _this.closePreview()
          },1000)
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.center {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.proveInfo {
  font-size: 16px;
  padding: 20px 0px;
  color: #000;
}
.proveInfo span {
  display: inline-block;
  padding: 0px 15px;
  border-bottom: 1px solid;
  height: 30px;
}
.proveInfo ul {
  font-size: 14px;
  list-style: none;
  font-weight: bold;
  margin-top: 40px;
  padding: 0px;
  line-height: 26px;
}
.zsContent {
  line-height: 30px;
}
.remark {
  color: #000;
  list-style: none;
  font-size: 14px;
  padding: 0px;
  line-height: 26px;
}
.chapter {
  color: #000;
  text-align: right;
}
.remark span,
.chapter span {
  display: inline-block;
  padding: 0px 10px;
  border-bottom: 1px solid;
}
.inputStyle {
  border: none;
  position: relative;
  top: 0px;
  height: 24px;
  color: #000;
}
.chapter {
  :global(.ant-input-number) {
    text-align: center;
    border: none;
    color: #000;
    position: relative;
    top: 0px;
    height: 20px;
  }
}
</style>
<style media="print">
@page {
  size: auto; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>