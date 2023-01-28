<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    cancelText="关闭"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >取消</a-button>
      <a-button
        type="primary"
        @click="handlePrint"
      >打印</a-button>
      <a-button
        type="primary"
        @click="handleImportExcel"
        :loading="downloadLoading"
      >导出</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
      >
        <a-row>
          <a-col :span="24">
            <a-tabs defaultActiveKey="1">
              <a-tab-pane
                tab="商险明细"
                key="1"
              >
                <a-table
                  ref="table"
                  size="middle"
                  bordered
                  rowKey="id"
                  :columns="columns"
                  :dataSource="model.businessInsuranceList"
                  :scroll="{ x: 1}"
                  :pagination="false"
                >
                </a-table>
              </a-tab-pane>

              <a-tab-pane
                tab="结算单"
                key="2"
              >
                <div class="tabDiv">
                  <h2>{{ model.settleDomainName }}{{ model.settlementMonth }} - 结算单</h2>
                  <table
                    border="1"
                    class="settlement"
                  >
                    <tr>
                      <td class="tdbg">结算主体</td>
                      <td>{{ model.settleDomainName }}</td>
                      <td class="tdbg">皖信盖章</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td class="tdbg">客户单位</td>
                      <td colspan="3">{{ model.customerName }}</td>
                    </tr>
                    <tr>
                      <td class="tdbg">结算主体编码</td>
                      <td>{{ model.settleDomainNo }}</td>
                      <td class="tdbg">结算月份</td>
                      <td>{{ model.settlementMonth }}</td>
                    </tr>
                    <tr>
                      <td class="tdbg">回款金额</td>
                      <td>{{ model.payBackBalance }}</td>
                      <td class="tdbg">预估差额</td>
                      <td>{{ model.balance }}</td>
                    </tr>
                    <tr>
                      <td class="tdbg">发票号</td>
                      <td>{{ model.invoiceNo }}</td>
                      <td class="tdbg">创建人</td>
                      <td>{{ model.createUser }}</td>
                    </tr>
                  </table>
                </div>
              </a-tab-pane>

              <a-tab-pane
                tab="封面"
                key="3"
              >
                <a-empty
                  v-if="Array.isArray(model.businessInsuranceList) && model.businessInsuranceList.length === 0"
                  description="暂无封面"
                />
                <a-card v-else>
                  <a-tabs type="card">
                    <a-tab-pane
                      v-for="(item,index) in model.insuranceSettlementCoverList"
                      :key="index"
                      tab="封面"
                    >
                      <h3 class="center">{{ item.tableHead }}</h3>
                      <h2 class="center">银行转账审批单</h2>
                      <table
                        class="cover"
                        border="1"
                      >
                        <tr>
                          <td colspan="2"></td>
                          <td colspan="2">{{ item.lssueTime ? moment(item.lssueTime).format('YYYY年MM月DD日') : '' }}</td>
                          <td>部门编码</td>
                          <td>{{ item.departNo }}</td>
                        </tr>
                        <tr>
                          <td colspan="2">
                            <h6>结算主体</h6>
                            <p>{{ item.departName }}</p>
                          </td>
                          <td colspan="2">
                            <h6>项目</h6>
                            <p>{{ item.itemName }}</p>
                          </td>
                          <td>
                            <h6>付款方式</h6>
                            <p>{{ filterDictText(payTypeOptions,item.payType) }}</p>
                          </td>
                          <td>
                            <h6>金额</h6>
                            <p>{{ item.amount }}</p>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">合计人民币：</td>
                          <td colspan="3">{{ item.amountRmb }}</td>
                          <td>{{ item.amount }}</td>
                        </tr>
                        <tr>
                          <td>收款单位名称</td>
                          <td>{{ item.receiptName }}</td>
                          <td>账号</td>
                          <td>{{ item.receiptBankNo }}</td>
                          <td>开户行</td>
                          <td>{{ item.receiptBankName }}</td>
                        </tr>
                        <tr>
                          <td colspan="6">备注：{{ item.remark }}</td>
                        </tr>
                      </table>
                      <div class="attach center">
                        附件 &nbsp;&nbsp;张
                      </div>
                      <a-row style="width: 90%;padding:10px 0px 0px 3%;clear:both;color:#333">
                        <a-col :span="4">公司领导: </a-col>
                        <a-col :span="4">财务负责人: </a-col>
                        <a-col :span="4">网银审核授权人: </a-col>
                        <a-col :span="4">网银转账提交人: </a-col>
                        <a-col :span="4">数据审核: </a-col>
                        <a-col :span="4">制表人: {{ item.createUser }}</a-col>
                      </a-row>
                    </a-tab-pane>
                  </a-tabs>
                </a-card>

              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { filterDictText } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'InsuranceForecastDetail',
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      moment,
      confirmLoading: false,
      downloadLoading: false,
      form: this.$form.createForm(this),
      statusOptions:[], //状态
      payTypeOptions:[], //付款方式

      activeKey:0,
      columns:[
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'settlementOrganNo',
          width:100,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '结算主体名称',
          align: 'center',
          dataIndex: 'settlementOrganName',
          width:150,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'empName',
          width:100,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'empIdcardNo',
          width:160,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '客户单位',
          align: 'center',
          dataIndex: 'customerName',
          width:150,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '险种',
          align: 'center',
          dataIndex: 'insuranceTypeName',
          width:150,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '保险公司',
          align: 'center',
          dataIndex: 'insuranceCompanyName',
          width:100,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '商险购买地',
          align: 'center',
          dataIndex: 'businessInsuranceAddr',
          width:150,
          ellipsis: true,
          customRender:(text,record)=>{
            let area = record.businessInsuranceProv +' '+text
            return <a-tooltip
              placement="topLeft"
              title={area}
            >{area}</a-tooltip>
          }
        },
        {
          title: '保单号',
          align: 'center',
          dataIndex: 'policyNo',
          width:200,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '保单起止时间',
          align: 'center',
          dataIndex: 'policyStart',
          width:200,
          ellipsis: true,
          customRender:(text,record)=>{
            let range = text +'~'+record.policyEnd
            return <a-tooltip
              placement="topLeft"
              title={range}
            >{range}</a-tooltip>
          }
        },
        {
          title: '预估金额',
          align: 'center',
          dataIndex: 'forecastBuyPay',
          width:100,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '购买标准',
          align: 'center',
          dataIndex: 'buyStandard',
          width:100,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '实际保费',
          align: 'center',
          dataIndex: 'buyPay',
          width:100,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '医保',
          align: 'center',
          dataIndex: 'medicalMoney',
          width:100,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '身故或残疾',
          align: 'center',
          dataIndex: 'deathDisabilityMoney',
          width:100,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          width:100,
          ellipsis: true,
          customRender:(text)=>{
            let status = filterDictText(this.statusOptions,text)
            return <a-tooltip
              placement="topLeft"
              title={status}
            >{status}</a-tooltip>
          }
        },

      ],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      }
    }
  },
  methods: {
    filterDictText,
    show(record) {
      this.model = Object.assign({}, record)
      this.visible = true

    },
    handleImportExcel(){
      this.downloadLoading = true
      let businessInsuranceList = []
      this.model.businessInsuranceList.map((item,index)=>{
        businessInsuranceList[index] = {
          empName:item.empName,
          empIdcardNo:item.empIdcardNo,
          settlementOrganNo:item.settlementOrganNo,
          settlementOrganName:item.settlementOrganName,
          customerName:item.customerName,
          insuranceCompanyName:item.insuranceCompanyName,
          insuranceTypeName:item.insuranceTypeName,
          policyEnd:item.policyEnd,
          policyStart:item.policyStart,
          buyPay:item.buyPay,
          forecastBuyPay:item.forecastBuyPay || '',
          policyNo:item.policyNo,
          medicalMoney:item.medicalMoney,
          deathDisabilityMoney:item.deathDisabilityMoney,
          area:item.businessInsuranceProv+' '+item.businessInsuranceAddr,
          buyStandard:item.buyStandard,
          settleMonth:item.settleMonth,
          remark:item.remark || '',
        }
      })
      let settelData = [
        {'index':this.model.customerName+this.model.settlementMonth + '-结算单','data1':'','account':'','data2':''},
        {'index':'结算主体','data1':this.model.settleDomainName,'account':'皖信盖章:','data2':''},
        {'index':'客户单位','data1':this.model.customerName,'account':'','data2':''},
        {'index':'结算主体编码','data1':this.model.settleDomainNo,'account':'结算月份:','data2':this.model.settlementMonth},
        {'index':'回款金额','data1':this.model.payBackBalance,'account':'预估差额','data2':this.model.balance},
        {'index':'发票号','data1':this.model.invoiceNo,'account':'创建人','data2':this.model.createUser},
      ]
      // 封面数据
      let excelDatas = [
        {
          tHeader: ["员工姓名", "员工身份证号","结算主体编码","结算主体","客户单位","保险公司","险种","保单开始时间","保单结束时间","实际保费","预估金额",
          "保单号","医保","身故或残疾","商险购买地","购买标准","结算月份","备注"],
          filterVal: ['empName','empIdcardNo',"settlementOrganNo", "settlementOrganName","customerName", "insuranceCompanyName","insuranceTypeName","policyStart","policyEnd",
          "buyPay","forecastBuyPay","policyNo","medicalMoney","deathDisabilityMoney","area","buyStandard","settleMonth","remark"],
          tableDatas: businessInsuranceList,
          sheetName: "商险明细"
        },
        {
          tHeader: ['序号','数据1',null,'数据2'],
          filterVal: ['index','data1',"account", "data2"],
          tableDatas: settelData,
          sheetName: "结算单"
        },
      ]
      let ileng = this.model.insuranceSettlementCoverList.length
      if(ileng){
        this.model.insuranceSettlementCoverList.map((item,index)=>{
          let coverData = [
            {'company':item.tableHead,'project':'','payType':'','money':'','no':''},
            {'company':"银行转账审批单",'project':'','payType':'','money':'','no':''},
            {'company':"",'project': (item.lssueTime ? moment(item.lssueTime).format('YYYY年MM月DD日') : ''),'payType':'结算主体编码','money':item.departNo,'no':''},
            {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
            {'company':item.customerName,'project':item.itemName,'payType':'银行转账','money':'¥' + item.amount,'no':''},
            {'company':item.departName,'project':'','payType':'','money':'','no':''},
            {'company':"合计人民币:",'project':item.amountRmb,'payType':'','money':'¥' + item.amount,'no':''},
            {'company':"备注:" ,'project':item.remark,'payType':'','money':'','no':''},
            {'company':"收款单位名称:" + item.amountRmb + "          账号:" + item.receiptBankNo + "          开户行:" + item.receiptName,'project':'','payType':'','money':'','no':''},
            {'company':"公司领导：         财务负责人:"  + '         网银审核授权人：         网银转账提交人：'+ '         数据审核人：'  + '         制表人:' + item.createUser,'project':'' ,'payType': '','money':'','no':''},
          ]
          excelDatas.push({
            tHeader: ["序号", "名字", "描述", "金钱", "地位"],
            filterVal: ["company", "project", "payType", "money",'no'],
            tableDatas:coverData,
            sheetName:'转账封面' + (index+1)
          })
        })
      }
      let excelName = this.model.settleDomainName+this.model.settlementMonth
      this.json2excel(excelDatas, excelName, true, "xlsx",2)
      this.downloadLoading = false
    },

    json2excel(tableJson, filenames, autowidth, bookTypes,coverLength){
      var that = this
      //这个是引用插件
      import("@/vendor/InsuranceForecastExportExcel").then(excel => {
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
          coverLength:coverLength
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    //打印
    handlePrint(){
      let url = '/pdf/insuranceforecastdetail?id=' + this.model.id
      window.open(url)
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
    },

  }
}
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
.stepFormText {
  :global(.ant-form-item-label) {
    width: 80px;
  }
}
.settlement {
  border-collapse: collapse;
  margin: 10px auto 30px;
  width: 800px;
  color: #000;
  font-size: 12px;
}
.settlement td {
  width: 16%;
  height: 40px;
  padding-left: 10px;
  border: solid #999 1px;
}
.settlement td.tdbg {
  background: #ddd;
  font-weight: bold;
  text-align: center;
}
.cover {
  border-collapse: collapse;
  border: none;
  width: 90%;
  float: left;
  margin-left: 3%;
}
.cover td {
  width: 16%;
  height: 32px;
  padding: 10px 10px 10px 15px;
  border: solid #000 1px;
  vertical-align: top;
  color: #333;
}
.cover td h6 {
  font-size: 16px;
  font-weight: bold;
}
.cover td p {
  font-size: 12px;
}
.attach {
  width: 20px;
  float: right;
  margin-right: 3%;
  margin-top: 8%;
}
.center {
  text-align: center;
}
.tabDiv {
  box-shadow: 0 0 1px 1px #aaa, 3px 0 5px 0 #aaa, 0 4px 7px 0 #aaa;
  border: 1px solid;
  width: 850px;
  margin: 44px auto;
}
.tabDiv h2 {
  text-align: center;
  margin-top: 10px;
}
.pbottom p span {
  display: inline-block;
  text-align: right;
  font-weight: bold;
  margin: 0px;
}
</style>