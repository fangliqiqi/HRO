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
        <div
          style="text-align:right;margin-bottom:5px;"
          v-if="this.flag && bill.settleIncomeOthers.length<2"
        >
          <a-button
            type="primary"
            @click="splitIncome"
          >拆分业务收入</a-button>
        </div>
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
              <td class="theadTr">费用名称</td>
              <td class="theadTr">税前金额</td>
              <td class="theadTr">税金</td>
              <td class="theadTr">税后金额(开票额)</td>
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
              <td class="costingCol">
                业务收入{{ index+1 }}
                <span v-if="index==1 && deleteBtn">
                  <a-popconfirm
                    title="确定删除吗?"
                    @confirm="handleDelete"
                  >
                    <a-icon
                      type="delete"
                      style="margin-left: 5px;color: red;"
                    />
                  </a-popconfirm>
                </span>
              </td>
              <td class="costingCol">
                <span v-if="item.edit">
                  <a-input
                    style="width:80px;margin-right:10px;"
                    :value="item.income"
                    :originVal="item.income"
                    @change="changeVal"
                  />
                  <a-icon
                    type="check"
                    style="cursor: pointer;"
                    v-if="!item.status"
                    @click="saveEdit(index)"
                  />
                  <a-icon
                    type="close"
                    style="cursor: pointer;"
                    @click="handleEdit(index,false)"
                    v-if="!item.status"
                  />
                </span>
                <span v-else>
                  {{ item.income }}
                  <span
                    v-if="index>0"
                    style="margin-left:5px;cursor: pointer;"
                  >
                    <a-icon
                      type="edit"
                      @click="handleEdit(index,true)"
                    />
                  </span>
                </span>
              </td>
              <td class="costingCol">{{ item.taxAmount }}</td>
              <td class="costingCol">{{ item.ticketAmount }}</td>
            </tr>
            <tr>
              <td class="theadTr">开票金额合计</td>
              <td colspan="2"></td>
              <td>
                {{ bill.sumAmount }}
              </td>
            </tr>
            <tr>
              <td class="theadTr">上期差余额</td>
              <td colspan="2"></td>
              <td>
                <span v-if="!editable">{{ bill.prePoorBalance }}</span>
                <a-input
                  v-if="editable"
                  style="margin: -5px 0;width: 50%;"
                  :value="bill.prePoorBalance"
                  @change="e => handleChange(e.target.value)"
                />
                <span
                  style="margin-left: 5px;color: red;"
                  v-if="!editable"
                  @click="editSumAmount"
                >
                  <a-icon type="edit"></a-icon>
                </span>
                <span v-if="editable">
                  <a
                    @click="() => saveTable()"
                    style="padding-right: 10px;"
                  >保存</a>
                  <a-popconfirm
                    title="确定取消修改?"
                    @confirm="() => cancelTable()"
                  >
                    <a>取消</a>
                  </a-popconfirm>
                </span>
              </td>
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
  name: 'SettleBillPreview',
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
      prePoorBalance:0,
      inputVal:0,
      flag:false, // 是否可拆分
      deleteBtn:false,
      url: {
        exportPdf: '/hrOneTime/tsettlebill/downdloadPdf',
        edit: '/hrOneTime/tsettlebill/updatePreBanlace',
        findOne: '/hrOneTime/tsettlebill/',
      }
    }
  },
  methods: {
    moment,
    show(outSourcing,m,flag) {
      this.flag = flag
      this.model = outSourcing;
      this.pmodel = m;
      this.bill = this.model.settleBillVo;
      if(this.model.settleBillVo.costingPayments) {
        this.costing = this.model.settleBillVo.costingPayments;
      }
      this.cacheSumAmount = this.bill.sumAmount
      // eslint-disable-next-line
      this.prePoorBalance = _.cloneDeep(this.bill.prePoorBalance)

      httpAction('/salary/tinvoice/openOneTimeInvoiceBySettleBillId?settleBillId=' + this.model.settleBillVo.id + '&settleFormType=4',{},'GET').then((res) => {
        if(res.code == 200){
          this.invoice = res.data || []
          this.visible = true
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleDelete(){
      // eslint-disable-next-line
      const bill = _.cloneDeep(this.bill)
      bill.settleIncomeOthers = [{
        ticketAmount:this.bill.ticketAmount,
        taxAmount:this.bill.taxAmount,
        income:this.formatFloat(this.bill.ticketAmount-this.bill.taxAmount),
        includeTaxFlag:this.bill.settleIncomeOthers[0]['includeTaxFlag']
      }]
      httpAction(`hrOneTime/tsettlebill`,bill,'put').then(res=>{
        if(res.code === 200){
          this.$message.success('删除成功！')
          this.$set(this.bill,`settleIncomeOthers`,bill.settleIncomeOthers)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    splitIncome(){
      this.bill.settleIncomeOthers.push({income:0,taxAmount:0,ticketAmount:0,edit:true,status:0})
    },
    handleEdit(index,flag){
      if(this.bill.settleIncomeOthers[index]['income'] == 0){
        this.$set(this.bill,`settleIncomeOthers`,[this.bill.settleIncomeOthers[0]])
      }else{
        this.$set(this.bill.settleIncomeOthers[index],`edit`,flag)
      }
      this.deleteBtn = flag ? false : true
    },
    saveEdit(index){
      // eslint-disable-next-line
      const inputVal = _.cloneDeep(this.inputVal)
      if(!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(inputVal) || inputVal < 0.01 || inputVal > 9999999.99){
        this.$message.warning('输入的金额格式不正确！')
        return false
      }
      if(inputVal >= this.bill.income){
        this.$message.warning(`拆分的收入金额不能大于等于${this.bill.income}!`)
        return false
      }
      this.$set(this.bill.settleIncomeOthers,index,{income:inputVal,taxAmount:0,ticketAmount:inputVal,includeTaxFlag:1})
      this.$set(this.bill.settleIncomeOthers[0],`income`,this.formatFloat(this.bill.income-inputVal))
      this.$set(this.bill.settleIncomeOthers[0],`ticketAmount`,this.formatFloat(this.bill.ticketAmount-inputVal))
      httpAction(`hrOneTime/tsettlebill`,this.bill,'put').then(res=>{
        if(res.code === 200){
          this.$message.success('拆分成功！')
          this.deleteBtn = true
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    changeVal(e){
      this.inputVal = e.target.value
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

          this.exportPdfLoading = false;
          that.$message.success('导出成功！')
        } else {
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
            {'name':"服务项目",'amount':serverItems,'tax':'','taxAmount':''},
            {'name':"结算日期",'amount':this.bill.settleDate,'tax':'','taxAmount':''},
            {'name':"费用名目",'amount':'金额','tax':'税金','taxAmount':'开票额小计'},
            {'name':'结算合计','amount':this.formatFloat(res.data.sumSettle-res.data.sumTax),'tax':res.data.sumTax,'taxAmount':res.data.sumSettle}
          ];
          let typeLength = {
            settleIncomeOthers:0,
            costingPayments:0,
            invoice:this.invoice.length,
            reciveList:0
          }
          if(res.data.settleIncomeOthers != null && res.data.settleIncomeOthers.length > 0) {
            res.data.settleIncomeOthers.forEach((v,index) => {
              data.push({'name':'业务收入'+(index+1),'amount':v.income,'tax':v.taxAmount,'taxAmount':v.ticketAmount},)
            })
            typeLength.settleIncomeOthers = res.data.settleIncomeOthers.length
          }
          if(res.data.costingPayments != null && res.data.costingPayments.length > 0) {
            res.data.costingPayments.forEach(v => {
              data.push({'name':v.name,'amount':v.amount,'tax':v.taxAmount,'taxAmount':this.formatFloat(v.taxAmount)},)
            })
            typeLength.costingPayments = res.data.costingPayments.length
          }
          // if(res.data.costingPayments != null && res.data.costingPayments.length > 0) {
          //   res.data.costingPayments.forEach(v => {
          //     data.push({'name':v.name,'amount':v.amount,'tax':v.taxAmount,'taxAmount':this.formatFloat(v.amount+v.taxAmount)},)
          //   })
          // }
          data.push({'name':'开票金额合计','amount':'','tax':'','taxAmount':res.data.sumAmount});
          data.push({'name':'上期差余额','amount':'','tax':'','taxAmount':res.data.prePoorBalance});
          data.push({'name':'本期差余额','amount':'','tax':'','taxAmount':res.data.currPoorBalance});
          data.push({'name':'创建人','amount':this.model.createUser || '','tax':'审核人','taxAmount':this.model.auditUser || ''});
          data.push({'name':'开票客户名称','amount':'开票金额 ','tax':'开票时间','taxAmount':''});
          if(this.invoice.length){
            this.invoice.forEach(v => {
              data.push({'name':v.unitName,'amount':v.invoiceMoney,'tax':v.applyDate,'taxAmount':''},)
            })
          }
          data.push({'name':'到款单位','amount':'到款时间 ','tax':'来款金额','taxAmount':'认领金额'});
          if(this.model.reciveList && this.model.reciveList.length){
            this.model.reciveList.forEach(v => {
              data.push({'name':v.reciveRecordList[0].incomeBelong,'amount':v.releaseDate,'tax':v.incomeFee,'taxAmount':v.reciveRecordList[0].reciveFee},)
            })
            typeLength.reciveList = this.model.reciveList.length
          }
          let excelDatas = [
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
          autoLength: typeLength
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
      this.bill.prePoorBalance = this.prePoorBalance
      this.bill.sumAmount = this.cacheSumAmount;
      this.bill.currPoorBalance = this.formatFloat((this.bill.sumAmount - this.bill.sumSettle) + this.bill.prePoorBalance)
      this.editable = false;
    },
    handleChange(v) {
      this.bill.prePoorBalance = v;
    },
    saveTable() {
      // eslint-disable-next-line
      if (new RegExp(/^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/).test(this.bill.prePoorBalance)) {
        // this.cacheSumAmount = this.bill.sumAmount
        this.bill.currPoorBalance = this.formatFloat((parseFloat(this.bill.sumAmount) - parseFloat(this.bill.sumSettle)) + parseFloat(this.bill.prePoorBalance))
        
        let formData = new Object();
        formData.id = this.bill.id;
        formData.prePoorBalance = this.bill.prePoorBalance;
        httpAction(this.url.edit,formData,'PUT').then((res) => {
          if(res.code != 200){
            this.$message.warning(res.msg || res.message)
            return false
          }
        });
        this.editable = false;
      } else {
        this.$message.warning('请输入两位有效数字！')
      }
    },
    handleOk() {
      this.close()
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('ok')
      this.visible = this.deleteBtn = false
      this.inputVal = 0
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