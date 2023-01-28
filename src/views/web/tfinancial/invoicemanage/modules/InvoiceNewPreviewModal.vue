<template>
  <div style="overflow: hidden;position: relative;">
    <div
      class="chapter"
      v-if="abolish"
    >作废</div>
    <div class="invoicePreview">
      <div class="thead"><span id="tabledesc1">安徽增值税{{ String(invoiceInfo.invoiceType) === '0'?'专用':'普通' }}发票</span></div>
      <div class="ttop">
        <div class="ttopBuy">购买方</div>
        <div class="ttopInfo">
          <p>
            <label for="name">名称</label>：<input
              :disabled="true"
              type="text"
              id="name"
              autocomplete="off"
              :value="invoiceInfo.customerName"
            />
          </p>
          <p>
            <label for="nsr">纳税人识别号</label>：<input
              :disabled="true"
              type="text"
              id="nsr"
              autocomplete="off"
              :value="invoiceInfo.customerTaxNr"
            />
          </p>
          <p>
            <label for="addr">地址、电话</label>：<input
              :disabled="true"
              type="text"
              id="addr"
              autocomplete="off"
              :value="invoiceInfo.customerAddressTel"
            />
          </p>
          <p>
            <label for="bank">开户行及账号</label>：<input
              :disabled="true"
              type="text"
              id="bank"
              autocomplete="off"
              :value="invoiceInfo.customerBankAccountNr"
            />
          </p>
        </div>
        <div class="ttopPass">密码区</div>
        <div class="ttopBlank"></div>
      </div>
      <div class="table">
        <table class="goodList" aria-describedby="tabledesc1">
          <tr>
            <th
              style="width:20px;"
              scope="col"
            >&nbsp;</th>
            <th
              style="width:200px;"
              scope="col"
            >货物或应税劳务、服务名称</th>
            <th scope="col">规格型号</th>
            <th scope="col">单位</th>
            <th scope="col">数量</th>
            <th scope="col">单价</th>
            <th scope="col">金额(含税)</th>
            <th scope="col">税率</th>
            <th scope="col">税额</th>
          </tr>
          <template v-if="invoiceInfo.listed == 1">
            <tr
              v-for="item in invoiceInfo.invoiceItemsList"
              :key="item.id"
            >
              <td></td>
              <td>{{ item.goodsName ? (`*`+item.goodsName) : '' }}{{ item.productName ? (`*`+item.productName) : '' }}</td>
              <td>{{ item.productSpec }}</td>
              <td>{{ item.productUnit }}</td>
              <td>{{ item.prodectNum || '' }}</td>
              <td>{{ item.price || '' }}</td>
              <td>{{ item.money }}</td>
              <td>{{ item.taxRate }}</td>
              <td>{{ item.taxMoney }}</td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td></td>
              <td><a class="listTitle" @click="listViewClick()">详见销货清单</a></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>{{ Number(invoiceInfo.invoiceMoney).toFixed(2) }}</td>
              <td></td>
              <td>{{ Number(invoiceInfo.allTax).toFixed(2) }}</td>
            </tr>
          </template>
        </table>
      </div>
      <div class="count">
        <div
          class="label"
          style="border-bottom:1px solid #6e9ddc;border-right:none;"
        >合&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计</div>
        <div
          class="shu"
          style="border-bottom:1px solid #6e9ddc;"
        >
          <span>¥ {{ Number(invoiceInfo.invoiceMoney).toFixed(2) }}</span>
          <span>&nbsp;</span>
          <span>¥ {{ Number(invoiceInfo.allTax).toFixed(2) }}</span>
        </div>
        <div class="label">价税合计（大写）</div>
        <div class="font">
          <span>&nbsp;&nbsp;{{ invoiceInfo.chmoney }}</span>
          <span class="right">(小写) <span>¥ {{ invoiceInfo.invoiceMoney }}</span></span>
        </div>
      </div>
      <div class="ttop">
        <div class="ttopBuy">销售方</div>
        <div class="ttopInfo customer">
          <p>
            <label>名称</label>：<span>{{ invoiceInfo.sellerName }}</span>
          </p>
          <p>
            <label for="nsr1">纳税人识别号</label>：<span>{{ invoiceInfo.sellerTaxNr }}</span>
          </p>
          <p>
            <label for="addr1">地址、电话</label>：<input
              :disabled="true"
              type="text"
              id="addr1"
              autocomplete="off"
              :value="invoiceInfo.sellerAddressTel"
            />
          </p>
          <p>
            <label for="bank1">开户行及账号</label>：<input
              :disabled="true"
              type="text"
              id="bank1"
              autocomplete="off"
              :value="invoiceInfo.sellerBankAccountNr"
            />
          </p>
        </div>
        <div class="ttopPass">&nbsp;备注</div>
        <div class="ttopBlank">{{ parseFloat(invoiceInfo.taxDeduction)>0?`差额征税：${invoiceInfo.taxDeduction}`:'' }}{{ invoiceInfo.memo }}</div>
      </div>
      <div class="tfoot">
        <span class="blue">收款人：</span>
        <input
          :disabled="!isCanModify"
          type="text"
          class="text"
          :value="invoiceInfo.payee"
          @blur.prevent="cashierOnblur($event)"
        />
        <span class="blue">复核：</span>
        <input
          :disabled="!isCanModify"
          type="text"
          :value="invoiceInfo.checker"
          class="text"
          @blur.prevent="checkerOnblur($event)"
        />
        <span class="blue">开票人：</span><span class="text">{{ invoiceInfo.issuer }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span class="blue">销售方：(章)</span>
      </div>
      <div class="footext">税收分类编码版本号：{{ invoiceInfo.codeVersion }}</div>
    </div>
    <div class="rtxt">
      第一联：记账联 销货方记账凭证
    </div>
    <list-view-list-modal ref="listViewListModal"></list-view-list-modal>
  </div>
</template>
<script>
import { httpAction } from '@/api/manage'
import ListViewListModal from './ListViewListModal'
export default {
  name: 'InvoiceNewPreviewModal',
  components:{
    ListViewListModal
  },
  props: {
    invoiceInfo: {
      type: Object,
      default: undefined,
      required: false
    },
    // 发票信息主表信息
    tinvoice:{
      type: Object,
      default: ()=>{},
      required: false
    },
    abolish: {
      //作废状态
      type: Boolean,
      default: false,
      required: false
    },
    // 复核人和收款人是否和修改
    isCanModify:{
      type:Boolean,
      default:false,
      required:false
    }
  },
  data() {
    return {
      title: '发票预览',
      url: {
        update: '/salary/tinvoice/updateCashierAndChecker'
      }
    }
  },
  methods: {
    // 收款人输入框失去焦点
    cashierOnblur(e) {
      // 判断是否发生更改
      const value = e.target.value || ''
      const cashier = this.invoiceInfo.payee || ''
      if (String(cashier) !== String(value)) {
        const idString = this.tinvoice.id || ''
        const url = `${this.url.update}?id=${idString}&cashier=${value}`
        this.changeSomeField(url, 1,value)
      }
    },
    // 复核人输入框失去焦点
    checkerOnblur(e) {
      const value = e.target.value || ''
      const checker = this.invoiceInfo.checker || ''
      if (String(checker) !== String(value)) {
        const idString = this.tinvoice.id || ''
        const url = `${this.url.update}?id=${idString}&checker=${value}`
        this.changeSomeField(url, 2,value)
      }
    },
    // 调接口修改收款人或审核人字段
    changeSomeField(url, type,newValue) {
      httpAction(url, null, 'post').then(res => {
        if (Number(res.code) === 200) {
          const typeStr = (type === 1)?'收款人':'复核人'
          this.$message.success(`${typeStr}更新成功！`)
          this.$emit('infoChanged',type,newValue)
        } else {
          this.$message.warn(res.msg || `${type}更新失败！`)
        }
      })
    },
    // 点击查看清单列表
    listViewClick() {
      this.$refs.listViewListModal.title = '清单列表预览'
      this.$refs.listViewListModal.dataSource = this.invoiceInfo.invoiceItemsList || []
      this.$refs.listViewListModal.show()
    },
  }
}
</script>

<style lang="less" scoped>
// 禁用状态下的数入框背景色
.invoicePreview input:disabled {
  background-color: white;
}
.chapter {
  color: #ec1206;
  letter-spacing: 8px;
  border: 2px solid #ec1206;
  width: 100px;
  text-align: center;
  position: absolute;
  right: 14px;
  top: 12px;
  font-size: 25px;
  font-family: fangsong Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-weight: bold;
  transform: rotate(-12deg);
}
.invoicePreview {
  overflow: hidden;
  float: left;
  width: 930px;
  .thead {
    color: #1f6cd4;
    text-align: center;
    font-family: cursive;
    font-size: 24px;
    padding-bottom: 40px;
    span {
      padding-bottom: 10px;
      border-bottom: 3px double #1f6cd4;
    }
  }
  .ttop {
    border: 1px solid #6e9ddc;
    display: flex;
    overflow: hidden;
    font-size: 14px;
    font-family: cursive;
    color: #096dd9;
    clear: both;
    .ttopBuy,
    .ttopPass {
      border-right: 1px solid #6e9ddc;
      writing-mode: vertical-lr;
      letter-spacing: 13px;
    }
    .ttopInfo {
      width: 430px;
      border-right: 1px solid #6e9ddc;
      p {
        margin: 0px;
        padding: 0px;
        line-height: 25px;
        display: flex;
        label {
          width: 105px;
          display: inline-block;
          text-align: justify;
          text-align-last: justify;
        }
        input {
          display: inline-block;
          border: 1px solid #b5c7d7;
          width: 300px;
          height: 22px;
          color: #000;
          font-size: 12px;
          font-family: monospace;
        }
        input:focus {
          outline: none;
          box-shadow: inset 0 0 0 1000px #ffffff !important;
        }
      }
    }
    .ttopBlank {
      width: 440px;
      color: #000;
      font-size: 12px;
      font-family: monospace;
      padding: 10px;
    }
  }
  .customer {
    span,
    input {
      color: #000;
      font-family: monospace;
      font-size: 12px;
    }
  }
  .table {
    min-height: 200px;
    border: 1px solid;
    border-bottom: none;
  }
  .goodList {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    table-layout: fixed;
    tr {
      height: 25px;
    }
    th,
    td {
      border: 1px solid #399ffc;
      font-family: monospace;
      font-size: 12px;
      font-weight: normal;
      color: #000;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    td {
      border: none;
    }
  }
  .count {
    border: 1px solid #399ffc;
    border-bottom: none;
    border-top: none;
    overflow: hidden;
    .label {
      width: 220px;
      float: left;
      border-right: 1px solid #399ffc;
      font-size: 14px;
      font-family: cursive;
      color: #096dd9;
      text-align: center;
    }
    .shu {
      font-family: monospace;
      font-size: 12px;
      color: #000;
      text-align: right;
      overflow: hidden;
      span {
        display: inline-block;
        width: 100px;
        height: 21px;
        text-align: center;
      }
    }
    .font {
      font-family: monospace;
      font-size: 12px;
      color: #000;
      .right {
        float: right;
        margin-right: 180px;
        color: #096dd9;
        span {
          color: #000;
        }
      }
    }
  }
  .tfoot {
    margin-top: 15px;
    .blue {
      font-size: 14px;
      font-family: cursive;
      color: #096dd9;
    }
    .text {
      font-family: monospace;
      font-size: 12px;
      color: #000;
      margin-right: 20px;
    }

    input {
      display: inline-block;
      border: 1px solid #b5c7d7;
      width: 150px;
      height: 22px;
      margin-right: 15px;
    }
    input:focus {
      outline: none;
      box-shadow: inset 0 0 0 1000px #ffffff !important;
    }
  }
  .footext {
    font-family: monospace;
    font-size: 12px;
    color: #b2b2b2;
    padding: 10px 5px;
  }
}
.rtxt {
  float: right;
  writing-mode: vertical-lr;
  letter-spacing: 5px;
  font-size: 14px;
  font-family: cursive;
  color: #096dd9;
  width: 20px;
  margin-top: 165px;
}
.listTitle {
  text-decoration: underline;
}
</style>
