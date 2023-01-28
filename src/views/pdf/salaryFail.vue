<template>
  <div>

    <div
      v-for="(pane,index) in panes"
      :key="index"
    >
      <div :style="styleBox">
        <!-- 封面 -->
        <div
          class="cover"
          :style="styleCover"
        >
          <p style="text-align:center;font-size:18px;font-weight:bold">{{ pane.title }}</p>
          <p
            style="text-align:center;font-size:25px;font-weight:bold"
            v-if="pane.type == 1"
          >银行转账审批单</p>
          <p
            style="text-align:center;font-size:25px;font-weight:bold"
            v-if="pane.type == 0"
          >现金付款审批单</p>
          <p style="text-align:center;line-height:0"> <span style="margin-left: 306px;">{{ pane.createDate }}</span> <span style="margin-left: 20px;" id="tabledesc1">结算主体编码：</span> <span>{{ pane.settleDepartNo }}</span> </p>
          <table class="table1" aria-describedby="tabledesc1">
            <tr class="tr1">
              <td
                class="td1"
                colspan="2"
              >S</td>
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
              <td 
                class="td1" 
              >
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
                style="font-weight:bolder;text-align:left;padding-left:5px"
                class="td1"
                colspan="3"
              >{{ pane.chmoney }}</td>
              <td class="td1">¥{{ pane.money }}</td>
            </tr>
            <tr v-if="pane.type == 1">
              <td class="td1" >收款单位名称:</td>
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
              <td class="td1" colspan="2">备注:</td>
              <td
                class="td1"
                colspan="4"
              >
                {{ pane.remark }}
              </td>
            </tr>
          </table>
          <p v-if="pane.type == 1" style="display:flex;justify-content:space-around">
            <span>公司领导:</span>
            <span style="margin-left:100px">财务负责人: </span>
            <span style="margin-left:100px">网银审核授权人:</span>
            <span style="margin-left:100px">网银转账提交人:{{ bankUpName }}</span>
            <span style="margin-left:50px">数据审核: {{ auditName }}</span>
            <span style="margin-left:50px">制表人: {{ createName }}</span>
          </p>
          <p v-if="pane.type == 0" style="display:flex;justify-content:space-around">
            <span>公司领导:</span>
            <span style="margin-left:100px">财务负责人:</span>
            <span style="margin-left:100px">出纳会计:</span>
            <span style="margin-left:50px">数据审核: {{ auditName }}</span>
            <span style="margin-left:50px">制表人: {{ createName }}</span>
          </p>
          <p 
            style="text-align:center;margin-bottom: 0px;" 
            v-for="(item,inx) in printData" 
            :key="item.id" 
            v-if="inx<13"
          >
            打印人: {{ item.printUserName }} &nbsp;打印时间: {{ item.printDate }} &nbsp;本次打印为第{{ item.no }} &nbsp;次打印;</p>
        </div>
      </div>
      <div style="page-break-after:always"></div>
      <div id="newNode"></div>
    </div>

    <a-row>
      <div class="main-article">
        <div class="node-article-content">
          <p style="text-align:center;font-size:25px;font-weight:bold">发放失败记录</p>
          <P>发放金额：{{ failModel.money }}</P>
          <p>失败原因：{{ failModel.reason }}</p>
          <div>
            <p>失败截图：</p>
            <img
              v-for="item in failFilelist"
              :key="item.id"
              :src="item.attaUrl"
            >
          </div>
        </div>
      </div>
    </a-row>
  </div>
</template>
<script>
import { httpAction } from '@/api/manage'
import { mapGetters } from 'vuex'
import { getDpi,insertAfter } from '@/utils/common'

export default {
  data() {
    return{
      createName:'',
      auditName:'',
      revenueName:'',
      bankUpName:'',
      panes:[],
      printData:[],
      count:0,
      url:{
        openBilling: "salary/lostandfoundinfo/openBilling",
        // doPrint:"/salary/tprintrecord/doPrint",
        doPrintLostAndFound:"/salary/tprintrecord/doPrintLostAndFound",
      },
      styleBox:{},
      styleCover:{},
      failModel:{},
      failFilelist:[]
    }
  },
  async created(){
    this.setStyle();
    this.count = parseInt(this.$route.query.count)  + 1
    
    this.bankUpName = this.nickname()
    if(this.$route.query.id){
      //失败截图
      const fileRes = await httpAction(`/salary/tsalaryatta/getTSalaryAttaListByIdType?linkId=${this.$route.query.id}&linkType=7`,null,'get')
      this.failFilelist = fileRes.code == 200?fileRes.data:[]
      // 数据
      const res = await httpAction(this.url.openBilling + '?lostAndFoundInfoId=' + this.$route.query.id, {}, 'POST')
      let creatDiv = null;
      if(Number(res.code) === 200 && res.data.cover){
        this.failModel = res.data.lost
        //封面数据翻译
        const userDic = await httpAction('/admin/user/userDic', '', 'GET');
        // 获取打印
        const doPrint = await httpAction(this.url.doPrintLostAndFound,{'fromId':this.$route.query.id,'fromType':4},'POST');
        if (userDic.code === 200){
            // 翻译封面
            for(var d in userDic.data){
              if(res.data.cover.createUser == d){
                this.createName = userDic.data[d]
              }
            }
            this.panes.push(res.data.cover)
            for(var c in this.panes){
              if(c == 0){
                this.activeKey = this.panes[0].id
              }
              this.panes[c].auditName = ''
              this.panes[c].createName = ''
              this.panes[c].key = this.panes[c].id
              this.panes[c].payTypeText = this.panes[c].type == 1 ? '银行转账' : '现金付款'
            }

          //打印记录
          if(doPrint.code==200){
            this.printData = []
            doPrint.data.reduce((acc,cur,index)=>{
              for(let d in userDic.data){
                if(cur.printUser == d){
                  this.printData.push({
                    printUserName:userDic.data[d],
                    printDate:cur.printDate,
                    no:index+1,
                    id:cur.id
                  })
                }
              }
            },[])

            const length = this.printData.length;
           
            // 动态生成
            if(length>13){
              //创建一个div
              creatDiv = document.createElement("div");
              // 确定分页总数
              const page = Math.ceil((length-13) / 36);
              for(let i=0; i<page; i++){
                const div1 = document.createElement("div");
                div1.style.border = this.styleBox.border;
                div1.style.height = this.styleBox.height;
                div1.style.margin = this.styleBox.margin;
                div1.style.width = this.styleBox.width;
                
                const div2 = document.createElement("div");
                div2.style.border = this.styleCover.border;
                div2.style.height = this.styleCover.height;
                div2.style.marginTop = this.styleCover.marginTop;
                div2.style.marginLeft = this.styleCover.marginLeft;
                div2.style.width = this.styleCover.width;
                div2.style.transform = 'rotate(-90deg)';
                div2.style.border = '1px solide #fff';

                for(let j=0; j<36; j++){
                  const index = 13 + i*36+ j;
                  if(index < length){
                    const temp =  `打印人: ${this.printData[index].printUserName} &nbsp;打印时间: ${this.printData[index].printDate} &nbsp;本次打印为第${this.printData[index].no} &nbsp;次打印;`
                    // const temp = `${this.receiveData[index].incomeBelong}-${this.receiveData[index].departName}  已到账, 到账金额:${this.receiveData[index].matchingAmount}  到账时间: ${this.receiveData[index].reciveDate}  备注: ${this.receiveData[index].serverRemark}`;
                    div2.innerHTML += '<p style="text-align:center;margin-bottom: 0px;">'+temp+'</p>';
                  }
                }
                div1.appendChild(div2);
                creatDiv.appendChild(div1);
                insertAfter(div1,'<div style="page-break-after:always"></div>');
              }  
            }
          }
        } 
         this.$nextTick(() => {
            var newNode = document.getElementById('newNode');
            if(newNode&&creatDiv){
              newNode.appendChild(creatDiv);
            }
            window.print();
          })
        }else{
          const msg = res.msg == 'success'?'暂无数据打印':res.msg
          this.$message.error(msg)
        }
    }
  },
  methods:{
    ...mapGetters(["nickname", "avatar","userInfo"]),
    setStyle(){
      const wid = 210 * getDpi()/25.4;
      const height = 297 * getDpi()/25.4;
      this.styleBox = {
        width:`${wid}px`,
        height:`${height}px`,
        border:'1px solid #fff',
        margin: '75px auto 0px'
      }
      this.styleCover={
        width:`${height}px`,
        height:`${wid}px`,
        marginTop:`${(height-wid)/2}px`,
        marginLeft: `${(wid-height)/2}px`
      }
    },

  }
}
</script>
<style lang="scss" scoped>
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
.table1 {
  border: 2px solid #333;
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
  font-size: 12px;
  border: 1px solid #333;
  text-align: center;
  height: 10px;
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
  transform: rotate(-90deg);
  border: 1px solide #fff;
}
.cover .tr1 {
  height: 60px;
}
.cover .td1 {
  height: 60px;
}
.main-article {
  padding: 20px 60px;
  margin: 0px auto;
  display: block;
  width: 900px;
  background: #fff;
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
    font-size: 14px;
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
    font-family: medium-content-serif-font, Georgia, Cambria, 'Times New Roman', Times, serif;
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
</style>
<style media="print">
@page {
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>