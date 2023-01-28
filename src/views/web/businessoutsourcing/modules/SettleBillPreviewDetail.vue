<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    style="top: 20px;"
    class="ant-modal_detail"
  >

    <template slot="footer">
      <router-link
        target="_blank"
        style="margin-left:8px; margin-right:8px"
        :to="{path: '/pdf/BusinessOutSroucingSettleBillPrintf', query: {id: model.id}}"
      >
        <a-button type="primary">打印</a-button>
      </router-link>
      <a-button
        key="previewBill"
        type="primary"
        :loading="exportPdfLoading"
        @click="exportPdf"
      >导出PDF</a-button>
      <a-button
        key="audit"
        type="primary"
        :loading="confirmLoading"
        @click="exportExcel"
      >导出EXCEL</a-button>
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
    </template>

    <!-- Table Begin -->
    <div class="ant-card-body">
      <a-spin :spinning="confirmLoading">
        <a-card
          :bordered="true"
          class="ant-card-wider-padding"
          id="staffCard"
          style="margin: 0px auto; width:800px;"
        >
          <span id="staffEvectionTitle">{{ moment(model.settleDate).format('YYYYMM') }}-结算单</span>
          <table
            border="1px"
            id="taffEvectionTable"
          >
            <thead>
              <tr>
                <td class="theadTr">客户单位</td>
                <td
                  colspan="3"
                  style="padding-left:5px; text-align:left;"
                >{{ pmodel.customerName }}</td>
              </tr>
              <tr>
                <td class="theadTr">结算主体</td>
                <td
                  colspan="3"
                  style="padding-left:5px; text-align:left;"
                >{{ pmodel.departName }}</td>
              </tr>
              <tr>
                <td class="theadTr">结算主体编码</td>
                <td
                  colspan="3"
                  style="padding-left:5px; text-align:left;"
                >{{ pmodel.departNo }}</td>
              </tr>
              <tr>
                <td class="theadTr">服务项目</td>
                <td
                  colspan="3"
                  style="padding-left:5px; text-align:left;"
                >
                  <a-tag
                    v-for="item in pmodel.moutsourcingItemVos"
                    :key="item.id"
                  >{{ item.itemName }}</a-tag>
                </td>
              </tr>
              <tr>
                <td class="theadTr">结算日期</td>
                <td
                  colspan="3"
                  style="padding-left:5px; text-align:left;"
                >{{ bill.settleDate }}</td>
              </tr>
            </thead>
            <tr>
              <td class="theadTr">费用名目</td>
              <td class="theadTr">金额</td>
              <td class="theadTr">税金</td>
              <td class="theadTr">开票额小计</td>
            </tr>
            <tr>
              <td class="theadTr">结算合计</td>
              <td>{{ formatFloat(bill.sumSettle-bill.sumTax) }}</td>
              <td>{{ bill.sumTax }}</td>
              <td>{{ bill.sumSettle }}</td>
            </tr>
            <tr
              v-for="item in costing"
              :key="item.id"
            >
              <td class="costingCol">{{ item.name }}</td>
              <td class="costingCol">{{ item.amount }}</td>
              <td class="costingCol">{{ item.taxAmount }}</td>
              <td class="costingCol">{{ formatFloat(item.amount + item.taxAmount) }}</td>
            </tr>
            <tr
              v-for="(item,index) in bill.settleIncomeOthers"
              :key="item.id"
            >
              <td class="costingCol">业务收入{{ index+1 }}</td>
              <td class="costingCol">{{ item.income }}</td>
              <td class="costingCol">{{ item.taxAmount }}</td>
              <td class="costingCol">{{ item.ticketAmount }}</td>
            </tr>
            <tr>
              <td class="theadTr">开票金额合计</td>
              <td colspan="2"></td>
              <td>
                <span v-if="!editable">{{ bill.sumAmount }}</span>
              </td>
            </tr>
            <tr>
              <td class="theadTr">上期差余额</td>
              <td colspan="2"></td>
              <td>{{ bill.prePoorBalance }}</td>
            </tr>
            <tr>
              <td class="theadTr">本期差余额</td>
              <td colspan="2"></td>
              <td>{{ bill.currPoorBalance }}</td>
            </tr>
            <tr>
              <td class="theadTr">创建人</td>
              <td>{{ model.createUser }}</td>
              <td class="theadTr">审核人</td>
              <td>{{ model.auditUser }}</td>
            </tr>
            <tr>
              <td
                class="theadTr"
                colspan="2"
              >开票客户名称</td>
              <td class="theadTr">开票金额</td>
              <td class="theadTr">开票时间</td>
            </tr>
            <tr
              v-for="item in invoice"
              :key="item.id"
            >
              <td colspan="2">{{ item.unitName }}</td>
              <td>{{ item.invoiceMoney }}</td>
              <td>{{ item.applyDate }}</td>
            </tr>
            <tr>
              <td class="theadTr">到款单位</td>
              <td class="theadTr">到款时间</td>
              <td class="theadTr">来款金额</td>
              <td class="theadTr">认领金额</td>
            </tr>
            <template v-if="model.reciveList">
              <tr
                v-for="item in model.reciveList"
                :key="item.id"
              >
                <td>{{ item.reciveRecordList[0].incomeBelong }}</td>
                <td>{{ item.releaseDate }}</td>
                <td>{{ item.incomeFee }}</td>
                <td>{{ item.reciveRecordList[0].reciveFee }}</td>
              </tr>
            </template>
            <tr>
              <td
                class="theadTr"
                colspan="2"
              >收入归属</td>
              <td
                class="theadTr"
                colspan="2"
              >分成金额</td>
            </tr>
            <template v-if="incomeBelong.length">
              <tr
                v-for="item in incomeBelong"
                :key="item.id"
              >
                <td colspan="2">{{ item.incomeBelong }}</td>
                <td colspan="2">{{ item.incomeAmount }}</td>
              </tr>
            </template>

          </table>
        </a-card>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>
import { httpAction,downFilePost } from '@/api/manage'
import moment from 'moment'

export default {
  name: 'SettleBillPreviewDetail',
  components: { },
  data () {
    return {
      title: "结算单预览",
      visible: false,
      confirmLoading: false,
      exportPdfLoading: false,
      bill: {},
      costing: [],
      invoice:[], // 开票信息
      model: {},
      pmodel: {},
      editable: false,
      cacheSumAmount: 0,
      incomeBelong:[], // 收入归属
      url: {
        exportPdf: '/hrOneTime/tsettlebill/downdloadPdf',
        edit: '/hrOneTime/tsettlebill/save',
        findOne: '/hrOneTime/tsettlebill/',
      }
    }
  },
  methods: {
    moment,
    show(outSourcing,m,invoice) {
      this.model = outSourcing;
      this.pmodel = m
      this.bill = this.model.settleBillVo
      if(this.pmodel.settleBillInnerVo){
        this.incomeBelong = this.pmodel.settleBillInnerVo.incomeBelongVos || []
      }
      if(this.model.settleBillVo.costingPayments) {
        this.costing = this.model.settleBillVo.costingPayments;
      }
      this.cacheSumAmount = this.bill.sumAmount
      this.invoice = invoice || []
      this.visible = true;
    },
    exportPdf() {
      const that = this
      let formData = new Object();
      formData.id = this.bill.id;
      this.exportPdfLoading = true;
      downFilePost(this.url.exportPdf,formData).then((res) => {
        if (res.size > 0) {
          var blob = new Blob([res], {type: 'application/pdf;charset=utf-8'}); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = that.model.settleDate +' '+ that.model.departName +' ' + that.model.businessName + "-结算单" + '.pdf' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象

          that.exportPdfLoading = false;
          that.$message.success('导出成功！')
        } else {
          that.exportPdfLoading = false;
          that.$message.warning(res.msg + ' 导出失败！')
        }
      });
    },
    exportExcel() {
      const that = this
      let formData = new Object();
      formData.id = this.bill.id;
      this.confirmLoading = true;
      httpAction(this.url.findOne + this.bill.id,null,'GET').then((res) => {
        if(res.data != null) {
          let serverItems = "";
          this.pmodel.moutsourcingItemVos.forEach((v,i) => {
            if(i == this.pmodel.moutsourcingItemVos.length - 1) {
              serverItems += v.itemName;
            } else {
              serverItems += v.itemName + ",";
            }
          })
          let data = [
            {'name':"客户单位",'amount':this.pmodel.customerName,'tax':'','taxAmount':''},
            {'name':"结算主体",'amount':this.pmodel.departName,'tax':'','taxAmount':''},
            {'name':"结算主体编码",'amount':this.pmodel.departNo,'tax':'','taxAmount':''},
            {'name':"服务项目",'amount':serverItems,'tax':'','taxAmount':''},
            {'name':"结算日期",'amount':this.bill.settleDate,'tax':'','taxAmount':''},
            {'name':"费用名目",'amount':'金额','tax':'税金','taxAmount':'开票额小计'},
            {'name':'结算合计','amount':this.formatFloat(res.data.sumSettle-res.data.sumTax),'tax':res.data.sumTax,'taxAmount':res.data.sumSettle}
          ];
          let typeLength = {
            settleIncomeOthers:0,
            costingPayments:0,
            invoice:this.invoice.length,
            reciveList:0,
            incomeList:0, // 收入归属
          }
          if(res.data.costingPayments != null && res.data.costingPayments.length > 0) {
            res.data.costingPayments.forEach(v => {
              data.push({'name':v.name,'amount':v.amount,'tax':v.taxAmount,'taxAmount':this.formatFloat(v.taxAmount+v.amount)},)
            })
            typeLength.costingPayments = res.data.costingPayments.length
          }
          if(res.data.settleIncomeOthers != null && res.data.settleIncomeOthers.length > 0) {
            res.data.settleIncomeOthers.forEach((v,index) => {
              data.push({'name':'业务收入'+(index+1),'amount':v.income,'tax':v.taxAmount,'taxAmount':v.ticketAmount},)
            })
            typeLength.settleIncomeOthers = res.data.settleIncomeOthers.length
          }
          data.push({'name':'开票金额合计','amount':'','tax':'','taxAmount':res.data.sumAmount});
          data.push({'name':'上期差余额','amount':'','tax':'','taxAmount':res.data.prePoorBalance});
          data.push({'name':'本期差余额','amount':'','tax':'','taxAmount':res.data.currPoorBalance});
          data.push({'name':'创建人','amount':this.model.createUser || '','tax':'审核人','taxAmount':this.model.auditUser || ''});
          data.push({'name':'开票客户名称','amount':'开票金额 ','tax':'开票时间','taxAmount':''});
          this.invoice.forEach(v => {
            data.push({'name':v.unitName,'amount':v.invoiceMoney,'tax':v.applyDate,'taxAmount':''},)
          })
          data.push({'name':'到款单位','amount':'到款时间 ','tax':'来款金额','taxAmount':'认领金额'});
          if(this.model.reciveList && this.model.reciveList.length){
            this.model.reciveList.forEach(v => {
              data.push({'name':v.reciveRecordList[0].incomeBelong,'amount':v.releaseDate,'tax':v.incomeFee,'taxAmount':v.reciveRecordList[0].reciveFee},)
            })
            typeLength.reciveList = this.model.reciveList.length
          }
          // 收入归属
          data.push({'name':'收入归属','amount':'','tax':'分成金额','taxAmount':''})
          if(this.incomeBelong.length){
            this.incomeBelong.forEach(item =>{
              data.push({'name':item.incomeBelong,'amount':'','tax':item.incomeAmount,'taxAmount':''},)
            })
            typeLength.incomeList = this.incomeBelong.length
          }
          const excelDatas = [
            {
              tHeader: [moment(that.model.settleDate).format('YYYYMM') + "-结算单","", "", ""],
              filterVal: ['name','amount',"tax", "taxAmount"],
              tableDatas: data,
              sheetName: "结算单"
            }
          ]
          this.json2excel(excelDatas, that.model.settleDate +' '+ that.model.departName +' ' + that.model.businessName + "-结算单", true, "xlsx",typeLength)
        }
      })
    },
    json2excel(tableJson, filenames, autowidth, bookTypes,typeLength) {
      var that = this
      import('../xlsx/Export2Excel').then(excel => {
        var tHeader = []
        var dataArr = []
        var sheetnames = []
        for (var i in tableJson) {
          tHeader.push(tableJson[i].tHeader)
          dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
          sheetnames.push(tableJson[i].sheetName)
        }
        excel.export_json_to_excel_more_sheet({
          header: tHeader,
          data: dataArr,
          sheetname: sheetnames,
          filename: filenames,
          autoWidth: autowidth,
          bookType: bookTypes,
          autoLength: typeLength // 所有类型长度
        })
        that.confirmLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    editSumAmount() {
      this.editable = true;
    },
    cancelTable() {
      this.bill.sumAmount = this.cacheSumAmount;
      this.bill.currPoorBalance = (this.bill.sumAmount - this.bill.sumSettle) + this.bill.prePoorBalance
      this.editable = false;
    },
    handleChange(v) {
      this.bill.sumAmount = v;
    },
    saveTable() {
      this.cacheSumAmount = this.bill.sumAmount
      this.bill.currPoorBalance = (this.bill.sumAmount - this.bill.sumSettle) + this.bill.prePoorBalance

      let formData = new Object();
      formData.id = this.bill.id;
      formData.sumAmount = this.bill.sumAmount;
      httpAction(this.url.edit,formData,'PUT').then((res) => {
        if(res.code == 200){
          console.log(res)
        }
      });
      this.editable = false;
    },
    handleOk() {
      this.close()
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.invoice = []
      this.visible = false
    },
    // 精度处理
    formatFloat(f, digit = 2) {
      const m = Math.pow(10, digit)
      return Math.round(f * m) / m
    },
  }
}
</script>

<style scoped>
#staffEvectionTitle {
  margin-top: 1px;
  margin-bottom: 1px;
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
  box-shadow: 0 0 1px 1px #aaa, 3px 0 5px 0 #aaa, 0 4px 7px 0 #aaa;
}

#taffEvectionTable .firstTr {
  width: 100px;
}
#taffEvectionTable .costingCol {
  width: 100px;
  background-color: #fcffe6;
}
#taffEvectionTable .theadTr {
  width: 100px;
  font-weight: bold;
  background: #ddd;
  color: #000;
}
#taffEvectionTable td {
  color: #000;
  padding: 10px 0px 10px 0px;
}
</style>
