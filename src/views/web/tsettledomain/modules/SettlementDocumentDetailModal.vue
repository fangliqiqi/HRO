<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    style="top: 20px;"
    class="ant-modal_detail"
  >
    <template slot="footer">
      <router-link
        target="_blank"
        style="margin-left:8px; margin-right:8px"
        :to="{path: '/pdf/nopersonnelsettlementprintf', query: {id: settleInfo.businessMain.id,settleId:settleInfo.businessMain.settleDomainId}}"
      >
        <a-button type="primary" :loading="confirmLoading">打印</a-button>
      </router-link>
      <a-button
        key="audit"
        type="primary"
        :loading="confirmLoading"
        @click="exportExcel"
      >导出EXCEL</a-button>
      <span>
        <a-button
          key="previewBill"
          type="primary"
          style="margin-left:8px"
          :loading="confirmLoading"
          @click="exportPdf"
        >导出PDF</a-button>
      </span>
      <span v-if="auditBtn">
        <a-button
          type="primary"
          style="margin-left:8px"
          @click="handleAudit"
          :loading="confirmLoading"
        >审核</a-button>
      </span>
      <a-button
        key="back"
        style="margin-left:8px"
        @click="handleCancel"
        :loading="confirmLoading"
      >关闭</a-button>
    </template>

    <!-- Table Begin -->
    <div class="ant-card-body">
      <a-spin :spinning="confirmLoading">
        <a-card
          :bordered="true"
          class="ant-card-wider-padding pdfCont"
          id="staffCard"
          style="width:100%;"
        >
          <span id="staffEvectionTitle">{{ settleInfo.bill.settleDate }}-结算单</span>
          <table
            border="1px"
            aria-describedby="staffEvectionTitle"
            id="taffEvectionTable"
          >
            <thead>
              <tr>
                <th class="theadTr" scope="col">客户单位</th>
                <td
                  colspan="3"
                  style="padding-left:5px; text-align:left;"
                >{{ settleInfo.businessMain.customerName }}</td>
              </tr>
              <tr>
                <td class="theadTr">结算主体</td>
                <td
                  colspan="3"
                  style="padding-left:5px; text-align:left;"
                >{{ settleInfo.businessMain.departName }}</td>
              </tr>
              <tr>
                <td class="theadTr">结算主体编码</td>
                <td
                  colspan="3"
                  style="padding-left:5px; text-align:left;"
                >{{ settleInfo.businessMain.departNo }}</td>
              </tr>
              <tr>
                <td class="theadTr">业务类型</td>
                <td
                  colspan="3"
                  style="padding-left:5px; text-align:left;"
                >{{ settleInfo.bill.businessType }}</td>
              </tr>
              <tr>
                <td class="theadTr">服务项目</td>
                <td
                  colspan="3"
                  style="padding-left:5px; text-align:left;"
                >
                  <template v-if="settleInfo.businessMain.serverItem">
                    <a-tag
                      v-for="item in settleInfo.businessMain.serverItem.split(',')"
                      :key="item"
                    >{{ item }}</a-tag>
                  </template>
                </td>
              </tr>
              <tr>
                <td class="theadTr">结算日期</td>
                <td
                  colspan="3"
                  style="padding-left:5px; text-align:left;"
                >{{ settleInfo.bill.settleDate }}</td>
              </tr>
              <template v-if="settleType">
                <tr>
                  <td class="theadTr">企业微信审批编号</td>
                  <td
                    colspan="3"
                    style="padding-left:5px; text-align:left;"
                  >{{ settleInfo.bill.wxNo }}</td>
                </tr>
              </template>
            </thead>
            <tr>
              <td class="theadTr">费用名目</td>
              <td class="theadTr">金额(不含税)</td>
              <td class="theadTr">税金</td>
              <td class="theadTr">金额(含税)</td>
            </tr>
            <template v-if="settleType">
              <tr>
                <td class="theadTr">内部计收</td>
                <td>{{ settleInfo.bill.innerMoney }}</td>
                <td>0</td>
                <td>{{ settleInfo.bill.innerMoney }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td class="theadTr">结算合计</td>
                <td>
                  {{ calculate.settleNotax }}
                </td>
                <td>{{ calculate.settleHastax }}</td>
                <td>{{ settleInfo.bill.sumSettle }}</td>
              </tr>
              <tr
                v-for="item in settleInfo.costList"
                :key="item.id"
              >
                <td class="costingCol">{{ item.name }}</td>
                <td class="costingCol">{{ item.amount }}</td>
                <td class="costingCol">{{ (Number(settleInfo.bill.taxType) > 116) ? 0 : formatFloat(item.amount*settleInfo.bill.tax/100) }}</td>
                <td class="costingCol">{{ (Number(settleInfo.bill.taxType) > 116) ? item.amount : formatFloat(item.amount+item.amount*settleInfo.bill.tax/100) }}</td>
              </tr>
              <tr>
                <td class="costingCol">业务收入</td>
                <td class="costingCol">{{ calculate.incomeNotax }}</td>
                <td class="costingCol">{{ calculate.incomeTax }}</td>
                <td class="costingCol">{{ calculate.incomeHastax }}</td>
              </tr>
              <tr>
                <td class="theadTr">开票金额合计</td>
                <td colspan="2"></td>
                <td>
                  <span v-if="!editable">{{ settleInfo.bill.ticketAmount }}</span>
                </td>
              </tr>
              <tr>
                <td class="theadTr">上期差余额</td>
                <td colspan="2"></td>
                <td>{{ settleInfo.bill.prePoorBalance }}</td>
              </tr>
              <tr>
                <td class="theadTr">本期差余额</td>
                <td colspan="2"></td>
                <td>{{ settleInfo.bill.currPoorBalance }}</td>
              </tr>
            </template>
            <tr>
              <td class="theadTr">创建人</td>
              <td>{{ settleInfo.businessMain.createUser }}</td>
              <td class="theadTr">审核人</td>
              <td>{{ settleInfo.businessMain.auditUser }}</td>
            </tr>
            <template v-if="!settleType">
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
              <template v-if="settleInfo.reciveList">
                <tr
                  v-for="item in settleInfo.reciveList"
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
                >分成金额/比例</td>
              </tr>
              <template v-if="settleInfo.incomeList.length">
                <tr
                  v-for="item in settleInfo.incomeList"
                  :key="item.id"
                >
                  <td colspan="2">
                    {{ getNameFromArr(organAll,item.incomeBelong,'id','organName') }} /
                    {{ getNameFromArr(organAll,item.incomeBelongSub,'id','organName') }}
                  </td>
                  <td colspan="2">{{ item.devidedProp ? (`${item.devidedProp}% / ${item.incomeAmount}元`) : item.incomeAmount }}</td>
                </tr>
              </template>
            </template>
          </table>
          <div style="font-weight: bold;color: #000;margin: 50px 0px 10px;" v-if="settleType!=1">项目报销明细</div>
          <table class="detail dtable" border="1px" width="100%" v-if="settleType!=1">
            <tr>
              <th>预计结算月份</th>
              <th>结算月份</th>
              <th>报销单编号</th>
              <th>报销时间</th>
              <th>报销人</th>
              <th>费用类型</th>
              <th>金额</th>
              <th>税金</th>
              <th>金额(含税)</th>
            </tr>
            <tr
              v-for="(item,index) in settleInfo.detailList"
              :key="index"
            >
              <td>
                <a-tooltip placement="topLeft" :title="item.installmentMonth">
                  {{ item.installmentMonth }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft" :title="item.settleMonth">
                  {{ item.settleMonth }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft" :title="item.reimburseFormCode">
                  {{ item.reimburseFormCode }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft" :title="item.applyDate">
                  {{ item.applyDate }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft" :title="item.applyUserName">
                  {{ item.applyUserName }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft" :title="item.feeDesc">
                  {{ item.feeDesc }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft" :title="item.settleFee">
                  {{ item.settleFee }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft" :title="item.tax">
                  {{ item.tax }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft" :title="item.ticket">
                  {{ item.ticket }}
                </a-tooltip>
              </td>
            </tr>
          </table>
        </a-card>

      </a-spin>
    </div>
    <audit-module
      ref="AuditModal"
      @ok="auditOk"
    ></audit-module>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import { getNameFromArr } from '@/utils/common'
import { getBusinessType } from '@/utils/businessType'
import AuditModule from '../../businessoutsourcing/modules/AuditModule'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  name: 'SettlementDocumentDetailModal',
  components: { 
    AuditModule
  },
  props:{
    organAll:{
      type: Array,
      default: ()=>[],
      required: true
    },
  },
  data () {
    return {
      title: "结算单预览",
      visible: false,
      confirmLoading: false,
      settleInfo:{
        bill:{},
        businessMain:{},
        costList:[],
        incomeList:[],
      },
      invoice:[], // 开票信息
      
      auditBtn:false,
      settleType:0, // 0结算单1内部计收
      calculate:{
        sumCost:0,  // 成本之和
        settleNotax:0, // 结算金额不含税
        settleHastax:0, // 结算金额税金
        incomeNotax:0, // 业务收入不含税
        incomeTax:0, // 业务收入税金
        incomeHastax:0, // 业务收入（含税）
      },

      bill: {},
      costing: [],
      model: {},
      pmodel: {},
      editable: false,
      cacheSumAmount: 0,
      incomeBelong:[], // 收入归属
      footer:undefined,//底部显隐
      url: {
        exportPdf: '/hrOneTime/tsettlebill/downdloadPdf',
        edit: '/hrOneTime/tsettlebill/save',
        findOne: '/hrOneTime/tsettlebill/',
      }
    }
  },
  methods: {
    getNameFromArr,
    async show(type,record,foot) {
      this.footer = foot?null:undefined
      this.settleType = type
      this.settleInfo = record
      // 业务类型
      this.settleInfo.bill.businessType = await getBusinessType(record.businessMain.settleDomainId)
      if(type){
        this.visible = true
        return
      }
      this.calculate.sumCost = 0
      // console.log(this.settleInfo.costList);
      this.settleInfo.costList.sort(function(a,b){
        let aNum = a.name.substr(0,6)
        let bNum = b.name.substr(0,6)
        if(!isNaN(aNum)&&!isNaN(bNum)){
          return Number(aNum) - Number(bNum)
        }
        // return Number(a.name.match(/\d+/)[0]) - Number(b.name.match(/\d+/)[0])
      })

      this.settleInfo.costList.forEach(item=>{
        this.calculate.sumCost += item.amount
      })
      this.settleInfo.detailList.map(item=>{
        item.installmentMonth = item.feeDesc=='项目成本'?item.settleMonth:item.installmentMonth
      })
      this.settleInfo.detailList.sort((a,b)=>{return Number(a.installmentMonth) - Number(b.installmentMonth)})
      // 计算金额税金
      if(Number(this.settleInfo.bill.taxType) > 116){
        this.calculate.settleNotax = this.formatFloat((this.settleInfo.bill.sumSettle - this.calculate.sumCost)/(1+this.settleInfo.bill.tax/100) + this.calculate.sumCost)
        this.calculate.settleHastax = this.formatFloat((this.settleInfo.bill.sumSettle-this.calculate.sumCost)/(1+this.settleInfo.bill.tax/100)*this.settleInfo.bill.tax/100)
        this.calculate.incomeHastax = this.formatFloat(this.settleInfo.bill.sumSettle-this.calculate.sumCost)
        this.calculate.incomeNotax = this.formatFloat(this.calculate.incomeHastax/(1+this.settleInfo.bill.tax/100))
        this.calculate.incomeTax = this.formatFloat(this.calculate.incomeNotax*this.settleInfo.bill.tax/100)
      }else{
        this.calculate.settleNotax = this.formatFloat(this.settleInfo.bill.sumSettle/(1+this.settleInfo.bill.tax/100))
        this.calculate.settleHastax = this.formatFloat(this.calculate.settleNotax*this.settleInfo.bill.tax/100)
        this.calculate.incomeNotax = this.formatFloat(this.calculate.settleNotax - this.calculate.sumCost)
        this.calculate.incomeTax = this.formatFloat(this.calculate.incomeNotax*this.settleInfo.bill.tax/100)
        this.calculate.incomeHastax = this.formatFloat(this.calculate.incomeNotax+this.calculate.incomeTax)
      }
      httpAction(`/salary/tinvoice/openOneTimeInvoiceBySettleBillId?settleBillId=${record.bill.id}&settleFormType=4`,null,'get').then(res=>{
        if(res.code === 200){
          this.invoice = res.data
        }
      }).finally(()=>{
        this.visible = true
      })
    },
    handleAudit(){
      this.$refs.AuditModal.showModal(this.settleInfo.businessMain.id)
    },
    exportPdf() {
      const cname = document.querySelector('.detail');
      if(cname){
        cname.classList.remove("dtable");
      }
      this.confirmLoading = true
      const _this = this
      document.body.scrollTop=document.documentElement.scrollTop=0
      html2canvas(document.getElementsByClassName('pdfCont')[0],{scale: 2}).then(canvas => {
        const pdf = new JsPDF('p', 'mm', 'a4'); // A4纸，纵向
        pdf.setFont("SimSun");
        const ctx = canvas.getContext('2d');
        const a4w = 200; const a4h = 287; // A4大小，210mm x 297mm，四边各保留20mm的边距，显示区域170x257
        const imgHeight = Math.floor(a4h * canvas.width / a4w); // 按A4显示比例换算一页图像的像素高度
        let renderedHeight = 0;
        while (renderedHeight < canvas.height) {
          var page = document.createElement('canvas')
          page.width = canvas.width
          page.height = Math.min(imgHeight, canvas.height - renderedHeight)// 可能内容不足一页
          // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
          page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0)

          pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 5, 5, a4w, Math.min(a4h, a4w * page.height / page.width)) // 添加图像到页面，保留10mm边距
          renderedHeight += imgHeight
          if (renderedHeight < canvas.height) { pdf.addPage() }// 如果后面还有内容，添加一个空页
        }
        pdf.save(`${(_this.settleInfo.businessMain.settleDate||'')+_this.settleInfo.businessMain.departName+(_this.settleInfo.businessMain.businessName||'')}-结算单.pdf`)
        
      }).finally(()=>{
        _this.confirmLoading = false
        if(cname){
          cname.classList.add("dtable");
        }
      })
    },
    exportExcel() {
      let data = [
        {'name':"客户单位",'month':'','reimburseFormCode':this.settleInfo.businessMain.customerName,'applyDate':'','applyUserName':'','amount':'','tax':'','taxAmount':'','money':''},
        {'name':"结算主体",'month':'','reimburseFormCode':this.settleInfo.businessMain.departName,'applyDate':'','applyUserName':'','amount':'','tax':'','taxAmount':'','money':''},
        {'name':"结算主体编码",'month':'','reimburseFormCode':this.settleInfo.businessMain.departNo,'applyDate':'','applyUserName':'','amount':'','tax':'','taxAmount':'','money':''},
        {'name':"业务类型",'month':'','reimburseFormCode':this.settleInfo.bill.businessType,'applyDate':'','applyUserName':'','amount':'','tax':'','taxAmount':'','money':''},
        {'name':"服务项目",'month':'','reimburseFormCode':this.settleInfo.businessMain.serverItem,'applyDate':'','applyUserName':'','amount':'','tax':'','taxAmount':'','money':''},
        {'name':"结算日期",'month':'','reimburseFormCode':this.settleInfo.bill.settleDate,'applyDate':'','applyUserName':'','amount':'','tax':'','taxAmount':'','money':''}
      ];
      let typeLength = {
        costList:0,
        invoice:this.invoice.length,
        reciveList:0,
        incomeList:0,
        settleType:this.settleType
      }
      if(this.settleType){
        data.push({'name':'企业微信审批编号','month':'','reimburseFormCode':this.settleInfo.bill.wxNo,'applyDate':'','applyUserName':'','amount':'','tax':'','taxAmount':'','money':''})
        data.push({'name':"费用名目",'month':'','reimburseFormCode':'金额(不含税)','applyDate':'','applyUserName':'税金','amount':'','tax':'金额(含税)','taxAmount':'','money':''})
        data.push({'name':'内部计收','month':'','reimburseFormCode':this.settleInfo.bill.innerMoney,'applyDate':'','applyUserName':0,'amount':'','tax':this.settleInfo.bill.innerMoney,'taxAmount':'','money':''})
        data.push({'name':'创建人','month':'','reimburseFormCode':this.settleInfo.businessMain.createUser || '','applyDate':'','applyUserName':'','amount':'审核人','tax':this.settleInfo.businessMain.auditUser || '','taxAmount':'','money':''})

      }else{
        data.push({'name':"费用名目",'month':'','reimburseFormCode':'金额(不含税)','applyDate':'','applyUserName':'税金','amount':'','tax':'金额(含税)','taxAmount':'','money':''})
        data.push({'name':'结算合计','month':'','reimburseFormCode':this.calculate.settleNotax,'applyDate':'','applyUserName':this.calculate.settleHastax,'amount':'','tax':this.settleInfo.bill.sumSettle,'taxAmount':'','money':''})
        if(this.settleInfo.costList != null && this.settleInfo.costList.length > 0) {
          this.settleInfo.costList.forEach(v => {
            data.push({'name':v.name,'month':'','reimburseFormCode':v.amount,'applyDate':'',
            'applyUserName':(Number(this.settleInfo.bill.taxType) > 116) ? 0 : this.formatFloat(v.amount*this.settleInfo.bill.tax/100),'amount':'',
            'tax':(Number(this.settleInfo.bill.taxType) > 116) ? v.amount : this.formatFloat(v.amount+v.amount*this.settleInfo.bill.tax/100),
            'taxAmount': '','money':''
            })
          })
          typeLength.costList = this.settleInfo.costList.length
        }
        data.push({'name':'业务收入','month':'','reimburseFormCode':this.calculate.incomeNotax,'applyDate':'','applyUserName':this.calculate.incomeTax,'amount':'','tax':this.calculate.incomeHastax,'taxAmount':'','money':''})
        data.push({'name':'开票金额合计','month':'','reimburseFormCode':'','applyDate':'','applyUserName':'','amount':'','tax':this.settleInfo.bill.ticketAmount||0,'taxAmount':'','money':''});
        data.push({'name':'上期差余额','month':'','reimburseFormCode':'','applyDate':'','applyUserName':'','amount':'','tax':this.settleInfo.bill.prePoorBalance,'taxAmount':'','money':''});
        data.push({'name':'本期差余额','month':'','reimburseFormCode':'','applyDate':'','applyUserName':'','amount':'','tax':this.settleInfo.bill.currPoorBalance,'taxAmount':'','money':''});
        data.push({'name':'创建人','month':'','reimburseFormCode':this.settleInfo.businessMain.createUser || '','applyDate':'','applyUserName':'','amount':'审核人','tax':this.settleInfo.businessMain.auditUser || '','taxAmount':'','money':''});
        data.push({'name':'开票客户名称','month':'','reimburseFormCode':'','applyDate':'开票金额','applyUserName':'','amount':' ','tax':'开票时间','taxAmount':'','money':''});
        this.invoice.forEach(v => {
          data.push({'name':v.unitName,'month':'','reimburseFormCode':'','applyDate':v.invoiceMoney,'applyUserName':'','amount':'','tax':v.applyDate,'taxAmount':'','money':''});
        })
        data.push({'name':'到款单位','month':'','reimburseFormCode':'','applyDate':'到款时间','applyUserName':'','amount':'来款金额','tax':'','taxAmount':'认领金额','money':''});
        if(this.settleInfo.reciveList && this.settleInfo.reciveList.length){
          this.settleInfo.reciveList.forEach(v => {
            data.push({'name':v.reciveRecordList[0].incomeBelong,'month':'','reimburseFormCode':'','applyDate':v.releaseDate,'applyUserName':'','amount':v.incomeFee,'tax':'','taxAmount':v.reciveRecordList[0].reciveFee,'money':''})
          })
          typeLength.reciveList = this.settleInfo.reciveList.length
        }
        data.push({'name':'收入归属','month':'','reimburseFormCode':'','applyDate':'','applyUserName':'','amount':'分成金额/比例','tax':'','taxAmount':'','money':''})
        if(this.settleInfo.incomeList.length){
          this.settleInfo.incomeList.forEach(item =>{
            data.push({'name':
              getNameFromArr(this.organAll,item.incomeBelong,'id','organName')+'\n'+ getNameFromArr(this.organAll,item.incomeBelongSub,'id','organName')
            ,'reimburseFormCode':'','applyDate':'','applyUserName':'','amount':item.devidedProp ? (`${item.devidedProp}% / ${item.incomeAmount}元`) : item.incomeAmount,'tax':'','taxAmount':'','money':''})
          })
          
          typeLength.incomeList = this.settleInfo.incomeList.length
        }
      }
      typeLength.detailList = this.settleInfo.detailList.length
      if(this.settleType!=1){
        data.push({'name':'项目报销明细','month':'','reimburseFormCode':'','applyDate':'','applyUserName':'','amount':'','tax':'','taxAmount':'','money':''});
        data.push({'name':'预计结算月份','month':'结算月份','reimburseFormCode':'报销单编码','applyDate':'报销时间','applyUserName':'报销人','amount':'费用类型','tax':'金额','taxAmount':'税金','money':'金额(含税)'});
        this.settleInfo.detailList.forEach(item=>{
          data.push({'name':item.installmentMonth,'month':item.settleMonth,'reimburseFormCode':item.reimburseFormCode,'applyDate':item.applyDate,'applyUserName':item.applyUserName,'amount':item.feeDesc,'tax':item.settleFee,'taxAmount':item.tax,'money':item.ticket});
        })
      }
      
      const excelDatas = [
        {
          tHeader: [this.settleInfo.bill.settleDate + '-结算单','', '', '','','',''],
          filterVal: ['name','month','reimburseFormCode','applyDate','applyUserName','amount','tax', 'taxAmount','money'],
          tableDatas: data,
          sheetName: "结算单"
        }
      ]
      this.json2excel(excelDatas, this.settleInfo.bill.settleDate +' '+ this.settleInfo.businessMain.departName + (this.settleInfo.businessMain.businessName||'') + "-结算单", true, "xlsx",typeLength)
    },
    json2excel(tableJson, filenames, autowidth, bookTypes,typeLength) {
      var that = this
      import('@/vendor/ExportNopersonalSettlement').then(excel => {
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
    handleOk() {
      this.close()
    },
    auditOk(){
      this.$emit('ok')
      this.close()
    },
    handleCancel() {
      this.$emit('close')
      this.close()
    },
    close() {
      this.invoice = []
      this.visible = false
      this.auditBtn = false
      this.settleType = 0
      this.settleInfo = {
        bill:{},
        businessMain:{},
        costList:[],
        incomeList:[],
      }
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
#taffEvectionTable,.detail{
  width: 100%;
  font-size: 12px;
  text-align: center;
  background-color: #fff;
}
.dtable{
  table-layout:fixed
}
.dtable td{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
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
  color: #000;
  background: #ddd;
}
.detail th{
  color: #000;
  padding: 10px 0px 10px 0px;
}
#taffEvectionTable td,.detail td{
  color: #000;
  padding: 10px 0px 10px 0px;
}
</style>
