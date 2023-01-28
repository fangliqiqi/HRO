<template>
  <a-row class="main-article printCont">
    <!-- 封面start -->
    <template v-if="aprovalCoverList.length > 0">
      <template v-for="(value, key) in aprovalCoverList">
        <div
          :key="key"
          class="cover"
          style="margin-top: 130px;"
        >
          <a-row type="flex">
            <a-col
              style="text-align:center;font-size:15px;font-weight:bolder;color:#333"
              :span="12"
              :offset="6"
            >{{ value.tableHead }}</a-col>
            <a-col
              style="text-align:center;font-size:20px;font-weight:bolder;color:#333;margin-top:10px"
              :span="12"
              :offset="6"
            >银行转账审批单</a-col>
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
              >{{ moment(value.createTime).format(dateFormat) }}</td>
              <td class="td1">部门编码</td>
              <td class="td1">{{ value.departNo }}</td>
            </tr>
            <tr class="tr1">
              <td
                class="td1"
                colspan="2"
                style="width: 330px;"
              >
                <p class="font18">单位</p>
                <p>{{ value.unitName }}</p>
              </td>
              <td
                class="td1"
                colspan="2"
                style="width: 290px;"
              >
                <p class="font18">项目</p>
                <p>{{ value.itemName }}</p>
              </td>
              <td
                class="td1"
                style="width: 115px;"
              >
                <p class="font18">付款方式</p>
                <p
                  v-for="(item, index) in payTypeBelongs"
                  :key="index"
                ><span v-if="value.payType==item.value">{{ item.label }}</span></p>
              </td>
              <td
                class="td1"
                style="width: 250px;"
              >
                <p class="font18">金额</p>
                <p>¥{{ value.amount }}</p>
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
              >{{ value.amountRmb }}</td>
              <td class="td1">¥{{ value.amount }}</td>
            </tr>
            <tr>
              <td class="td1">收款单位名称:</td>
              <td
                class="td1"
                style="width:200px"
              >{{ value.receiptName }}</td>
              <td class="td1">账户:</td>
              <td
                class="td1"
                style="width:250px"
              >{{ value.receiptBankNo }}</td>
              <td class="td1">开户行:</td>
              <td
                class="td1"
                style="width:250px"
              >{{ value.receiptBankName }}</td>
            </tr>
            <tr>
              <td class="td1">备注:</td>
              <td
                class="td1"
                colspan="5"
                style="text-align: left;"
              >{{ value.remark }}</td>
            </tr>
          </table>
          <a-row type="flex">
            <a-col :span="4">公司领导：</a-col>
            <a-col :span="4">财务负责人：</a-col>
            <a-col :span="4">网银审核授权人：</a-col>
            <a-col :span="5">网银转账提交人：{{ nickname() }}</a-col>
            <a-col :span="4">数据审核：{{ providentAprovalForm.auditUserName }}</a-col>
            <a-col :span="3">制表人：{{ providentAprovalForm.createUserName }}</a-col>
          </a-row>
        </div>
        <div
          :key="value.id"
          style="page-break-after:always"
        ></div>
      </template>
    </template>
    <!-- 封面end -->

    <!-- 申请表start -->
    <template v-if="providentAprovalFormReportList.length > 0">
      <div style="margin-top: 20px;">
        <table class="table1">
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="8"
            >{{ providentAprovalForm.householName }}{{ providentAprovalForm.providentCreateMonth }}月份应交公积金金额预核准申请表</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              style="width: 250px;"
            >单位名称</td>
            <td
              class="tit td1"
              style="width: 250px;"
            >结算主体</td>
            <td
              class="tit td1"
              style="width: 60px;"
            >应交人数</td>
            <td
              class="tit td1"
              style="width: 60px;"
            >单位部分</td>
            <td
              class="tit td1"
              style="width: 60px;"
            >个人部分</td>
            <td
              class="tit td1"
              style="width: 80px;"
            >合计应交金额</td>
            <td
              class="tit td1"
              style="width: 100px;"
            >备注</td>
            <td
              class="tit td1"
              style="width: 250px;"
            >我司到款单位</td>
          </tr>
          <tr
            class="tr1"
            v-for="(value, key) in providentAprovalFormReportList"
            :key="key"
            :personCount="providentSum.personCount = (providentSum.personCount ? providentSum.personCount * 1 : 0) + value.personCount * 1"
            :unitAmount="providentSum.unitAmount = (providentSum.unitAmount ? providentSum.unitAmount * 1 : 0) + value.unitAmount * 1"
            :personalAmount="providentSum.personalAmount = (providentSum.personalAmount ? providentSum.personalAmount * 1 : 0) + value.personalAmount * 1"
            :sumAmount="providentSum.sumAmount = (providentSum.sumAmount ? providentSum.sumAmount * 1 : 0) + value.sumAmount * 1"
          >
            <td class="td1">{{ value.unitName }}</td>
            <td class="td1">{{ value.departName }}</td>
            <td class="td1">{{ value.personCount }}</td>
            <td class="td1">{{ value.unitAmount }}</td>
            <td class="td1">{{ value.personalAmount }}</td>
            <td class="td1">{{ value.sumAmount }}</td>
            <td class="td1"></td>
            <td class="td1">{{ value.paymentUnitOfOurCompany }}</td>
          </tr>
          <tr class="tr1">
            <td class="td1">合计</td>
            <td class="td1"></td>
            <td class="td1">{{ formatFloat(providentSum.personCount) }}</td>
            <td class="td1">{{ formatFloat(providentSum.unitAmount) }}</td>
            <td class="td1">{{ formatFloat(providentSum.personalAmount) }}</td>
            <td class="td1">{{ formatFloat(providentSum.sumAmount) }}</td>
            <td class="td1"></td>
            <td
              class="td1"
              :providentSum="providentSum.personCount=providentSum.unitAmount=providentSum.personalAmount=providentSum.sumAmount=0"
            ></td>
          </tr>
        </table>
      </div>
      <div style="page-break-after:always"></div>
    </template>
    <!-- 申请表end -->

    <!-- 申请表（分项）start -->
    <template v-if="itemList.length > 0">
      <template v-for="(item, k) in itemList">
        <div
          :key="k + 9999"
          style="margin-top: 20px;"
        >
          <table class="table1">
            <tr class="tr1">
              <td
                class="tit td1"
                colspan="8"
              >{{ providentAprovalForm.householName }}{{ providentAprovalForm.providentCreateMonth }}月份应交公积金金额预核准申请表</td>
            </tr>
            <tr class="tr1">
              <td
                class="tit td1"
                style="width: 250px;"
              >单位名称</td>
              <td
                class="tit td1"
                style="width: 250px;"
              >结算主体</td>
              <td
                class="tit td1"
                style="width: 60px;"
              >应交人数</td>
              <td
                class="tit td1"
                style="width: 60px;"
              >单位部分</td>
              <td
                class="tit td1"
                style="width: 60px;"
              >个人部分</td>
              <td
                class="tit td1"
                style="width: 80px;"
              >合计应交金额</td>
              <td
                class="tit td1"
                style="width: 100px;"
              >备注</td>
              <td
                class="tit td1"
                style="width: 250px;"
              >我司到款单位</td>
            </tr>
            <tr
              class="tr1"
              v-for="(value, key) in item"
              :key="key"
              :personCount="itemProvidentSum.personCount = (itemProvidentSum.personCount ? itemProvidentSum.personCount * 1 : 0) + value.personCount * 1"
              :unitAmount="itemProvidentSum.unitAmount = (itemProvidentSum.unitAmount ? itemProvidentSum.unitAmount * 1 : 0) + value.unitAmount * 1"
              :personalAmount="itemProvidentSum.personalAmount = (itemProvidentSum.personalAmount ? itemProvidentSum.personalAmount * 1 : 0) + value.personalAmount * 1"
              :sumAmount="itemProvidentSum.sumAmount = (itemProvidentSum.sumAmount ? itemProvidentSum.sumAmount * 1 : 0) + value.sumAmount * 1"
            >
              <td class="td1">{{ value.unitName }}</td>
              <td class="td1">{{ value.departName }}</td>
              <td class="td1">{{ value.personCount }}</td>
              <td class="td1">{{ value.unitAmount }}</td>
              <td class="td1">{{ value.personalAmount }}</td>
              <td class="td1">{{ value.sumAmount }}</td>
              <td class="td1"></td>
              <td class="td1">{{ value.paymentUnitOfOurCompany }}</td>
            </tr>
            <tr class="tr1">
              <td class="td1">合计</td>
              <td class="td1"></td>
              <td class="td1">{{ formatFloat(itemProvidentSum.personCount) }}</td>
              <td class="td1">{{ formatFloat(itemProvidentSum.unitAmount) }}</td>
              <td class="td1">{{ formatFloat(itemProvidentSum.personalAmount) }}</td>
              <td class="td1">{{ formatFloat(itemProvidentSum.sumAmount) }}</td>
              <td class="td1"></td>
              <td
                class="td1"
                :itemProvidentSum="itemProvidentSum.personCount=itemProvidentSum.unitAmount=itemProvidentSum.personalAmount=itemProvidentSum.sumAmount=0"
              ></td>
            </tr>
          </table>
        </div>
        <div
          :key="(k + 99999)"
          v-if="itemList.length > k + 1"
          style="page-break-after:always"
        ></div>
      </template>
    </template>
    <!-- 申请表（分项）end -->
  </a-row>
</template>

<script>
import moment from 'moment'
import { httpAction,postActionHeader } from '@/api/manage'
import { disableRightClick,disablePrintShortcut } from '@/utils/common'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import {mapGetters} from "vuex"
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  data() {
    return {
      id:'',
      moment,
      dateFormat: "YYYY年MM月DD日",
      itemList: [], // 分项
      providentSum: {}, // 申请表累计
      itemProvidentSum: {}, // 申请表【分项】累计
      aprovalRecord: {},  // 封面
      payTypeBelongs: [], // 付款方式
      paymentInfoList: [],  // 支付信息列表数据
      aprovalCoverList: [], // 批准封面列表
      providentAprovalForm: {},  // 批准表单信息
      providentAprovalFormReportList: [],  // 公积金申请表
      url:{
        queryAllInfoById: 'hrSocial/tprovidentaprovalform/getProvidentAprovalAllInfoForExport',
      },
    }
  },
  created() {
    this.id = this.$route.query.id
    this.initDictConfig()
    this.fetchData()
  },
  mounted(){
    disableRightClick();
    document.addEventListener("keydown",disablePrintShortcut);
    this.printAction()
  },
  methods: {
    ...mapGetters(["nickname"]),
    
    fetchData() {
      const queryAllInfoUrl = `${this.url.queryAllInfoById}?id=${this.id}`
      httpAction(queryAllInfoUrl, {}, 'GET', 1000 * 60 * 5).then((res) => {
        if (Number(res.code) === 200 && res.data) {
          this.itemList = res.data.itemList ? res.data.itemList : []
          this.aprovalRecord = res.data.aprovalRecord
          this.paymentInfoList = res.data.paymentInfoList ? res.data.paymentInfoList : []
          this.aprovalCoverList = res.data.aprovalCoverList ? res.data.aprovalCoverList : []
          this.providentAprovalForm = res.data.providentAprovalForm
          this.providentAprovalFormReportList = res.data.providentAprovalFormReportList ? res.data.providentAprovalFormReportList : []
          this.$nextTick(() => {
            window.print()
          })
        } else {
          this.$message.error('数据请求失败！')
        }
      })
    },
    // 精度处理
    formatFloat(f, digit = 2) {
      const m = Math.pow(10, digit)
      return Math.round(f * m) / m
    },
    printAction(){
      const _this = this
      const mediaQueryList = window.matchMedia('print');
      mediaQueryList.addListener(function(mql){
        if(mql.matches){
          console.log('before')
        }else{
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
        const blob = pdf.output('blob');
        let files = new window.File([blob], `${moment().format('YYYY-MM-DD HH:mm:ss')}.pdf`, {type: 'application/pdf'})
        const remark = `${this.nickname()}在${moment().format('YYYY-MM-DD HH:mm:ss')}打印了一次`
        this.uploadFile(files,remark)
        // pdf.save(`${moment().format('YYYY-MM-DD HH:mm:ss')}.pdf`)
        
      })
    },
    uploadFile(file,remark){
      const formData = new FormData()
      formData.append('file', file)
      formData.append('linkType', 5)
      formData.append('linkId', this.id)
      let contextType = { 'Content-Type': 'multipart/form-data' }
      postActionHeader(`/salary/tsalaryatta/ossUploadFile?printRemark=${remark}`, formData, contextType).then((res) => {
        if(res.code == 200){
          console.log(res.data)
          window.close();
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    // 数据字典
    initDictConfig() {
      // 付款方式
      initDictOptions('approval_payType').then((res) => {
        if (Number(res.code) === 200) {
          this.payTypeBelongs = res.data
        }
      })
    },
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
  width: 1240px;
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
  font-family: medium-content-serif-font, Georgia, Cambria, 'Times New Roman', Times, serif;
  & > :last-child {
    margin-bottom: 0;
  }
  b,
  strong {
    font-weight: inherit;
    font-weight: bolder;
  }
  img {
    max-width: 100%;
    display: block;
    margin: 0 auto;
    border: 0;
    /* 解决 IE6-7 图片缩放锯齿问题 */
    -ms-interpolation-mode: bicubic;
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
  //padding: 10px;
  // width: 17%;
}
.table1 .td2 {
  font-size: 16px;
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 10px;
  //padding: 10px;
  width: 18%;
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
  //padding-left: 20px;
}
.cover {
  margin: 0 auto;
  width: 1000px;
}
.cover .tr1 {
  height: 40px;
}
.cover .td1 {
  height: 40px;
}
</style>

<style media="print">
@page {
  size: landscape; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>
