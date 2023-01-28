<template>
  <div class="printCont">   
    <!-- 财务账单结算单 -->
    <a-row>
      <div 
        class="main-article" 
        v-for="(settlementhFormInfo,index) in financialSettleInfos"
        :key="index"
      >
        <div class="node-article-content">
          <p style="text-align:center;color:red">{{ settlementhFormInfo.unitName }}-{{ settlementhFormInfo.settleMonth }} - 结算单</p>
          <table
            class="table0"
            style="background:yellow;border:0;"
          >
            <tr class="tr1">
              <td
                class="font18"
                style="width:12%"
              >单位名称:</td>
              <td >{{ settlementhFormInfo.unitName }}</td>
              <td class="font18">皖信盖章:</td>
              <td colspan="2" style="min-width:200px"></td>
            </tr>
            <tr class="tr1">
              <td
                class="font18"
              >结算主体:</td>
              <td 
                colspan="5"
                style="padding:5px 10px 5px 0"
              >{{ settlementhFormInfo.deptName }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="font18"
              >结算编码:</td>
              <td 
                colspan="5"
                style="padding:5px 10px 5px 0"
              >{{ settlementhFormInfo.deptNo }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="font18"
              >结算时间:</td>
              <td>{{ settlementhFormInfo.settleMonth }}</td>
              <td
                class="font18"
              >业务类型:</td>
              <td colspan="2">{{ settlementhFormInfo.businessType }}</td>
            </tr>
          </table>
          
          <table
            class="table1"
          >
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
              >{{ settlementhFormInfo.createMonth }}</td>
              <td class="tit td1">应缴单位社保</td>
              <td class="td1">{{ settlementhFormInfo.unitSocial || 0 }}</td>
              <td class="td1">-</td>
              <td class="td1">{{ settlementhFormInfo.unitSocialTicket || 0 }}</td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">应缴个人社保</td>
              <td class="td1">{{ settlementhFormInfo.personalSocial || 0 }}</td>
              <td class="td1">-</td>
              <td class="td1">{{ settlementhFormInfo.personalSocialTicket || 0 }}</td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">应缴单位公积金</td>
              <td class="td1">{{ settlementhFormInfo.unitFund || 0 }}</td>
              <td class="td1">-</td>
              <td class="td1">{{ settlementhFormInfo.unitFundTicket || 0 }}</td>
            </tr>
            <tr class="tr1">
              <td class="tit td1">应缴个人公积金</td>
              <td class="td1">{{ settlementhFormInfo.personalFund }}</td>
              <td class="td1">-</td>
              <td class="td1">{{ settlementhFormInfo.personalFundTicket }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >服务人数</td>
              <td class="td1" colspan="3">{{ settlementhFormInfo.personNum || 0 }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >服务人次</td>
              <td class="td1" colspan="3">{{ settlementhFormInfo.personCount || 0 }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >管理费</td>
              <td class="td1">{{ settlementhFormInfo.managment || 0 }}</td>
              <td class="td1">{{ settlementhFormInfo.managmentTax || 0 }}</td>
              <td class="td1">{{ settlementhFormInfo.managmentTicket || 0 }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="2"
              >结算金额合计</td>
              <td class="td1">{{ settlementhFormInfo.settleMoney || 0 }}</td>
              <td class="td1">{{ settlementhFormInfo.managmentTax || 0 }}</td>
              <td class="td1">{{ settlementhFormInfo.billFeeSum || 0 }}</td>
            </tr>

            <tr class="tr1">
              <td
                class="tit td1"
                colspan="4"
              >开票金额合计</td>
              <td class="td1">{{ settlementhFormInfo.ticketMoneySum || 0 }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="4"
              >上次差余额</td>
              <td class="td1">{{ settlementhFormInfo.lastDifference || 0 }}</td>
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
                colspan="4"
              >{{ settlementhFormInfo.remark }}</td>
            </tr>
          </table>
          <!-- 发票明细列表 -->
          <div
            v-if="isBank"
            style="margin-top:30px;"
          >
            <p style="text-align:center;font-weight:bold">发票明细</p>
            <table class="table1">
              <tr class="tr1">
                <td class="tit td1">发票类型</td>
                <td class="tit td1">扣除金额</td>
                <td class="tit td1">不含税收入</td>
                <td class="tit td1">税额</td>
                <td class="tit td1">发票金额</td>
                <td class="tit td1">备注</td>
              </tr>
              <tr
                class="tr1"
                v-for="item in settlementhFormInfo.invoiceList"
                :key="item.id"
              >
                <td class="td1">{{ invKindType[item.invoiceType] }}</td>
                <td class="td1">{{ item.deductionAmount }}</td>
                <td class="td1">{{ item.incomeExcludingTax }}</td>
                <td class="td1">{{ item.taxFee }}</td>
                <td class="td1">{{ item.invoiceFee }}</td>
                <td class="td2">{{ item.remark }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div
          style="page-break-after:always"
        ></div>
      </div>
    </a-row>

  </div>
</template>

<script>
import { httpAction, } from '@/api/manage'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import { filterOrgan } from '@/utils/customDict'
import { mapGetters } from 'vuex'
import { getItemName,getDpi,disableRightClick,disablePrintShortcut } from '@/utils/common'
import moment from 'moment'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
import { getMultiName} from '@/utils/common'

export default {
  data() {
    return {
      article: '',
      fullscreenLoading: true,
      idStr:'',
      financialSettleInfos:[],//财务结算单信息
      invKindType: { '0': '专用发票', '2': '普通发票', '51': '电子发票' },
      isBank:true,
      style: {},
      allTypeList:[],
      url:{
        openBill:'/hrSocial/tfinancebill/printByIdStr', //批量打印
      },
    
    }
  },
  created() {
    this.setStyle()
    this.initDictConfig()
    this.idStr = this.$route.query.id
    this.fetchData()
    // 业务类型
    httpAction(`/hrBase/sysdictbusinesstypehr/getSysDictBusinessTypeList`,null,'get').then(res=>{
      if(res.code === 200) {
        this.allTypeList = res.data
      }
  })
  },
 
  mounted(){
    disableRightClick();
    document.addEventListener("keydown",disablePrintShortcut);
    this.printAction();
  },
  
  methods: {
    moment,
    getItemName,
    getMultiName,
    ...mapGetters(["nickname", "avatar","userInfo"]),
    filterDictText,
    filterOrgan,
    removeBlank(str){
      return str ? str.replace(/(↵)+|(\n)+|(\r\n)+/g,"") : str
    },
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
    printAction(){
      const _this = this
      const mediaQueryList = window.matchMedia('print');
      mediaQueryList.addListener(function(mql){
        if(mql.matches){
          // console.log(111,document.querySelector('.printCont').innerHTML)
        }else{
          // document.getElementsByClassName('printCont')[0].innerHTML.replace(/style="transform[^"]*?"/g,'')
          _this.getPdf(document.getElementsByClassName('printCont')[0])
        }
      });
    },
    getPdf(el){
      html2canvas(el,{scale: 2,}).then(canvas => {
        const pdf = new JsPDF('p', 'mm', 'a4') // A4纸，纵向
        pdf.setFont("SimSun");
        const ctx = canvas.getContext('2d')
        const a4w = 170; const a4h = 257 // A4大小，210mm x 297mm，四边各保留20mm的边距，显示区域170x257
        const imgHeight = Math.floor(a4h * canvas.width / a4w) // 按A4显示比例换算一页图像的像素高度
        let renderedHeight = 0
        while (renderedHeight < canvas.height) {
          var page = document.createElement('canvas')
          page.width = canvas.width
          page.height = Math.min(imgHeight, canvas.height - renderedHeight)// 可能内容不足一页
          // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
          page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0)
          pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4w, Math.min(a4h, a4w * page.height / page.width)) // 添加图像到页面，保留10mm边距
          renderedHeight += imgHeight
          if (renderedHeight < canvas.height) { pdf.addPage() }// 如果后面还有内容，添加一个空页
        }
        
      })
    },

    // 获取打印信息
    fetchData() {
      let url = this.url.openBill + '?idStr=' + this.idStr
      httpAction(url,{},'get').then((res) => {
        if(Number(res.code) === 200){
          this.financialSettleInfos = res.data //结算单数据 数组
          this.financialSettleInfos.map(item=>{
            item.billFeeSum = this.reduceFun([item.settleMoney,item.managmentTax]).toFixed(2)
            item.businessType = this.getMultiName(this.allTypeList,'/',item.businessSecondType,item.businessThirdType)
          })
          
          // 打印
          this.$nextTick(() => {
            window.print()
          })
        }
      })
    },
    // 数据相加
    reduceFun(arr){
      let sum;
      if(Object.prototype.toString.call(arr)=='[object Array]'){
        sum = arr.reduce((total,cur)=>{
          cur = cur?Number(cur):0
          return  total + cur
        },0)
      }
      return sum
    },
    // 数据字典
    initDictConfig() {
      
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
.main-article {
  padding: 20px;
  margin: 0 auto;
  display: block;
  width: 900px;
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
  line-height: 28px;
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
    font-weight: 400;
    font-style: normal;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: -0.003em;
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
    font-weight: 400;
    font-style: italic;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: -0.003em;
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
.table0{
  width:100%;
  border-collapse: collapse;
  border-spacing: 0;
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
  height: 10px;
  //padding: 10px;
  width: 12%;
  word-break: break-all;
}
.table1 .td2 {
  font-size: 16px;
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 10px;
  //padding: 10px;
  width: 40%;
  text-align: center;
}
.table1 .tit {
  font-weight: bolder;
}
.table1 .input1 {
  height: 10px;
  width: 110%;
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
  font-size: 16px;
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
.tabDiv {
  box-shadow: 0 0 1px 1px #aaa, 3px 0 5px 0 #aaa, 0 4px 7px 0 #aaa;
  border: 1px solid;
  margin: 44px auto;
}
.settlement {
  border-collapse: collapse;
  margin: 10px auto 30px;
  width: 100%;
  color: #000;
  font-size: 12px;
}
.settlement td {
  width: 20%;
  height: 40px;
  padding-left: 10px;
  border: solid #999 1px;
}
.settlement td.tdbg {
  font-weight: bold;
  text-align: center;
}
#staffEvectionTitle {
  margin-top: 1px;
  margin-bottom: 5px;
  font-weight: 700;
  text-align: center;
  display: block;
  color: #000;
  font-size: 24px;
}
#taffEvectionTable {
  width: 100%;
  font-size: 12px;
  text-align: center;
  background-color: #fff;
}
#staffCard {
  border: 1px solid;
  box-shadow: 0 0 1px 1px #ccc, 3px 0 5px 0 #ccc, 0 4px 7px 0 #ccc;
}

#taffEvectionTable .firstTr {
  width: 120px;
}
#taffEvectionTable .costingCol {
  width: 120px;
}
#taffEvectionTable .theadTr {
  width: 120px;
}
#taffEvectionTable td {
  color: #000;
  padding: 10px 0px 10px 0px;
}
</style>
<style media='print' >
@page {
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>