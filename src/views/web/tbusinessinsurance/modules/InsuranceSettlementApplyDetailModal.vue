<template>
  <a-modal
    :title="title"
    :width="1100"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    cancelText="关闭"
    :visible="visible"
    :maskClosable="false"
    :footer="null"
    :destroyOnClose="true"
  >

    <a-spin :spinning="confirmLoading">
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
                :dataSource="businessInsuranceVos"
                :scroll="{ x: 1500}"
              >
              </a-table>
            </a-tab-pane>
            <a-tab-pane
              tab="商险差额明细"
              key="5"
            >
              <a-table
                ref="table"
                size="middle"
                bordered
                rowKey="id"
                :columns="forcastColumns"
                :dataSource="forcastBusinessInsuranceVos"
                :scroll="{ x: 1500}"
              >
              </a-table>
            </a-tab-pane>

            <a-tab-pane
              tab="结算单"
              key="2"
            >
              <div
                class="center"
                v-if="insuranceBill == null"
              >
                <a-icon type="frown-o" /> 暂无数据
              </div>
              <div
                class="tabDiv"
                v-if="insuranceBill != null"
              >
                <h2>{{ insuranceBill.departName }}{{ insuranceBill.settlementDate }} - 结算单</h2>
                <table
                  border="1"
                  class="settlement"
                >
                  <tr>
                    <td class="tdbg">结算主体</td>
                    <td>{{ insuranceBill.departName }}</td>
                    <td class="tdbg">皖信盖章</td>
                    <td colspan="2"> </td>
                  </tr>
                  <tr>
                    <td class="tdbg">客户单位</td>
                    <td colspan="4">{{ model.customerName }}</td>
                  </tr>
                  <tr>
                    <td class="tdbg">结算日期</td>
                    <td colspan="4">{{ insuranceBill.settlementDate }}</td>
                  </tr>
                  <tr>
                    <td class="tdbg">费用项目</td>
                    <td class="tdbg">金额</td>
                    <td class="tdbg">增值税</td>
                    <td class="tdbg" colspan="2">开票额小计</td>
                  </tr>
                  <tr>
                    <td class="tdbg">商险</td>
                    <td>{{ insuranceBill.insuranceAmount }}</td>
                    <td>{{ insuranceBill.incrementTaxFee }}</td>
                    <td colspan="2">{{ insuranceBill.takingRisksTicket }}</td>
                  </tr>
                  <tr>
                    <td class="tdbg">人数</td>
                    <td>{{ insuranceBill.peopleNum }}</td>
                    <td></td>
                    <td colspan="2"></td>
                  </tr>
                  <tr>
                    <td class="tdbg">人次</td>
                    <td>{{ insuranceBill.people }}</td>
                    <td></td>
                    <td colspan="2"></td>
                  </tr>
                  <tr>
                    <td class="tdbg">管理费</td>
                    <td>{{ insuranceBill.managementFee }}</td>
                    <td>{{ insuranceBill.managementTaxFee }}</td>
                    <td colspan="2">{{ insuranceBill.managementMoneyTicket }}</td>
                  </tr>
                  <tr>
                    <td class="tdbg">差余额</td>
                    <td>{{ insuranceBill.forecastBalance || 0 }}</td>
                    <td>{{ insuranceBill.forecastBalanceTax || 0 }}</td>
                    <td colspan="2">{{ insuranceBill.forecastBalanceTicket || 0 }}</td>
                  </tr>
                  <tr>
                    <td
                      colspan="2"
                      class="tdbg"
                    >结算金额合计</td>
                    <td>{{ insuranceBill.incrementTaxSum }}</td>
                    <td colspan="2">{{ insuranceBill.settlementAmountSum }}</td>
                  </tr>
                  <tr>
                    <td
                      colspan="3"
                      class="tdbg"
                    >开票金额合计</td>
                    <td colspan="2">{{ insuranceBill.ticketAmountSum }}</td>
                  </tr>
                  <tr>
                    <td class="tdbg">审核人</td>
                    <td>{{ model.auditUser }}</td>
                    <td class="tdbg">制表人</td>
                    <td colspan="2">{{ insuranceBill.createUser }}</td>
                  </tr>
                  <tr>
                    <td class="tdbg">备注</td>
                    <td colspan="4">{{ model.remark }}</td>
                  </tr>
                  <tr>
                    <td class="tdbg">到款单位</td>
                    <td class="tdbg">到款时间</td>
                    <td class="tdbg">到款金额</td>
                    <td class="tdbg">认领金额</td>
                    <td class="tdbg">匹配金额</td>
                  </tr>
                  <tr
                    v-for="(item,index) in model.reciveList"
                    :key="index"
                  >
                    <td class="tdbg2">{{ item['incomeBelong'] }}</td>
                    <td class="tdbg2">{{ item['incomeDate'].slice(0,-9) }}</td>
                    <td class="tdbg2">{{ item['incomeFee'] }}</td>
                    <td class="tdbg2">{{ getReciveFee(item['reciveRecordList'],'reciveFee') }}</td>
                    <td class="tdbg2">{{ getReciveFee(item['reciveRecordList'],'matchingAmount') }}</td>
                  </tr>
                </table>
              </div>
            </a-tab-pane>
            <a-tab-pane
              tab="封面"
              key="3"
            >
              <a-card
                title="暂无封面"
                v-if="insuranceSettlementCover.length == 0"
              >
              </a-card>
              <a-card v-if="insuranceSettlementCover.length">
                <a-tabs type="card">
                  <a-tab-pane
                    v-for="(item,index) in insuranceSettlementCover"
                    :key="index"
                    :tab="'银行转账'"
                  >
                    <div class="headerWrap">
                      <div>
                        <h3 class="center">{{ item.tableHead }}</h3>
                        <h2 class="center">银行转账审批单</h2>
                      </div>
                      <a-button
                        v-has="'wxhr:insurance_invoice1|wxhr:insurance_invoice3'"
                        v-if="isCanModifyInvoiceNo"
                        type="primary"
                        @click="modifyNumber(item)"
                      >修改发票号</a-button>
                    </div>
                    <a-form
                      :form="setteForm"
                      layout="inline"
                    >
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
                            <h6>客户单位</h6>
                            <p>
                              <span
                                v-for="(customer,i) in item.customerArr"
                                :key="i"
                                class="line"
                              >
                                {{ customer }}
                              </span>
                            </p>
                          </td>
                          <td colspan="2">
                            <h6>项目</h6>
                            <p>{{ item.itemName }}</p>
                          </td>
                          <td width="100">
                            <h6>付款方式</h6>
                            <p>{{ item.payType }}</p>
                          </td>
                          <td>
                            <h6>金额</h6>
                            <p>¥{{ item.amount }}</p>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">合计人民币：</td>
                          <td colspan="3">{{ item.amountRmb }}</td>
                          <td>¥{{ item.amount }}</td>
                        </tr>
                        <tr style="height:80px;">
                          <td width="120">收款单位名称</td>
                          <td align="left">
                            <a-form-item
                              label=""
                              class="tdleft"
                            >
                              <span v-if="model.status == 0">
                                <a-input
                                  :defaultValue="item.receiptName"
                                  v-decorator="['receiptName',{initialValue:item.receiptName,rules: [{ required: true, message: '请输入收款单位!' }] }]"
                                />
                              </span>
                              <span v-else>
                                {{ item.receiptName }}
                              </span>
                            </a-form-item>
                          </td>
                          <td width="60">账号</td>
                          <td>
                            <a-form-item
                              label=""
                              class="tdleft"
                            >
                              <span v-if="model.status == 0">
                                <a-input v-decorator="['receiptBankNo',{ initialValue:item.receiptBankNo,rules: [{ required: true, message: '请输入收款账号!' },{pattern:/^([0-9]{1})(\d{9,24})$/,message: '必须是10到25位数字!' }] }]" />
                              </span>
                              <span v-else>
                                {{ item.receiptBankNo }}
                              </span>
                            </a-form-item>
                          </td>
                          <td>开户行</td>
                          <td align="left">
                            <a-form-item
                              label=""
                              class="tdleft"
                            >
                              <span v-if="model.status == 0">
                                <a-input v-decorator="['receiptBankName',{ initialValue:item.receiptBankName,rules: [{ required: true, message: '请输入开户行!' },{max:20,message:'开户行最多20个字符!'}] }]" />
                              </span>
                              <span v-else>
                                {{ item.receiptBankName }}
                              </span>
                            </a-form-item>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="6">
                            <a-form-item label="备注">
                              <span v-if="model.status == 0">
                                <a-input
                                  style="width:800px"
                                  v-decorator="['remark',{ initialValue:item.remark }]"
                                />
                              </span>
                              <span v-else>
                                {{ item.remark }}
                              </span>
                              <input
                                type="hidden"
                                v-decorator="['id',{ initialValue:item.id }]"
                              >
                            </a-form-item>
                          </td>
                        </tr>
                      </table>

                      <div class="attach center">
                        附件&nbsp;&nbsp;&nbsp;张
                      </div>
                      <a-row style="width: 90%;padding:10px 0px 0px 3%;clear:both;color:#333">
                        <a-col :span="4">公司领导: </a-col>
                        <a-col :span="4">财务负责人: </a-col>
                        <a-col :span="4">网银审核授权人: </a-col>
                        <a-col :span="4">网银转账提交人: </a-col>
                        <a-col :span="4">数据审核: {{ model.auditUser }}</a-col>
                        <a-col :span="4">制表人: {{ item.createUser }}</a-col>
                      </a-row>
                    </a-form>
                  </a-tab-pane>
                </a-tabs>
              </a-card>
              <a-row v-if="model.status == 0">
                <a-col>
                  <a-button
                    type="primary"
                    style="margin:20px 10px 0px"
                    @click="modifySettem()"
                  >保存</a-button>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane
              tab="流程进展明细"
              key="4"
            >
              <a-card
                title="| 流程记录"
                :style="{marginBottom:'30px' }"
              >
                <a-empty
                  description="暂无流程详细"
                  v-if="processList.length == 0"
                />
                <a-timeline
                  v-if="processList.length"
                  class="pbottom"
                >
                  <a-timeline-item
                    v-for="(item,index) in processList"
                    :key="index"
                    :color="colorArr[item.auditStatus]"
                  >
                    <p><span>流程状态：</span>{{ statusTxt[item.auditStatus] }}</p>
                    <p><span>备注：</span>{{ item.auditRemark }}</p>
                    <p><span>操作人及时间：</span>{{ item.auditUser }} {{ item.createTime }}</p>
                  </a-timeline-item>
                </a-timeline>
              </a-card>

              <a-card
                title="上传表单详情"
                :style="{marginBottom:'30px' }"
              >
                <a-row style="margin-bottom:15px;">
                  <a-col :span="12">商险月份：{{ detail.settlementMonth }}</a-col>
                  <a-col :span="12">结算月份： {{ detail.settlementDate }}</a-col>
                </a-row>
                <a-row style="margin-bottom:15px;">
                  <a-col :span="12">部门编号：{{ detail.departNo }}</a-col>
                  <a-col :span="12">结算主体：{{ detail.departName || '' }}</a-col>
                </a-row>
                <a-row style="margin-bottom:15px;">
                  <a-col :span="12">结算金额：￥{{ detail.settlementAmountSum }}</a-col>
                  <a-col :span="12">开票金额：￥{{ detail.ticketAmountSum }}</a-col>
                </a-row>
                <a-row style="margin-bottom:15px;">
                  <a-col :span="12">上传人： {{ detail.createUser }}</a-col>
                  <a-col :span="12">上传时间： {{ detail.createTime }}</a-col>
                </a-row>
                <a-row>
                  <a-col :span="24">特别说明：{{ detail.remark }}</a-col>
                </a-row>
              </a-card>
              <a-row
                type="flex"
                justify="center"
              >
                <a-col
                  :span="2"
                  :offset="2"
                >
                  <a-button
                    type="primary"
                    @click="handlePrint"
                    block
                  >打印</a-button>
                </a-col>
                <a-col
                  :span="2"
                  :offset="1"
                >
                  <a-button
                    type="primary"
                    block
                    @click="handleOutImport"
                  >导出</a-button>
                </a-col>
                <a-col
                  :span="2"
                  :offset="1"
                >
                  <a-button
                    type="primary"
                    block
                    @click="handleCancel"
                  >取消</a-button>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </a-spin>
    <cover-modify-number-modal ref="coverModifyNumberModal"></cover-modify-number-modal>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
import { httpAction } from '@/api/manage'
import {mapGetters} from "vuex"
import CoverModifyNumberModal from './CoverModifyNumberModal'

export default {
  name: 'InsuranceSettlementApplyDetailModal',
  components:{
    CoverModifyNumberModal
  },
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      moment,
      confirmLoading: false,
      form: this.$form.createForm(this),
      setteForm: this.$form.createForm(this),
      insuranceBill:{}, //结算单
      businessInsuranceVos:[], //商险派单信息
      insuranceSettlementCover:[], //商险结算封面
      statusOptions:[], //状态
      settleTypeOptions:[], //结算类型
      detail:{},
      processList:[], //流程状态
      dataSource: [],
      forcastBusinessInsuranceVos: [], // 商险差额明细
      colorArr:['blue','green','red','green','blue'],
      statusTxt:['待审核','已通过','未通过','已委托','提交审核'],
      isCanModifyInvoiceNo:false, // 是否可以在封面上修改发票号
      columns:[
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'departNo',
          customRender: () => {
            return this.departNo
          }
        },
        {
          title: '结算主体',
          align: 'center',
          dataIndex: 'settlementOrgan',
          customRender: () => {
            return this.settleDomain
          }
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'empName'
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'empIdcardNo'
        },
        {
          title: '发票号',
          align: 'center',
          dataIndex: 'invoiceNo'
        },
        {
          title: '险种',
          align: 'center',
          dataIndex: 'insuranceTypeName'
        },
        {
          title: '保险公司',
          align: 'center',
          dataIndex: 'insuranceCompanyName'
        },
        {
          title: '保单号',
          align: 'center',
          dataIndex: 'policyNo'
        },
        {
          title: '保单开始时间',
          align: 'center',
          dataIndex: 'policyStart'
        },
        {
          title: '保单结束时间',
          align: 'center',
          dataIndex: 'policyEnd'
        },
        {
          title: '购买标准',
          align: 'center',
          dataIndex: 'buyStandard'
        },
        {
          title: '实际保费',
          align: 'center',
          dataIndex: 'buyPay'
        },
        {
          title: '医保',
          align: 'center',
          dataIndex: 'medicalMoney'
        },
        {
          title: '身故或残疾',
          align: 'center',
          dataIndex: 'deathDisabilityMoney'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender: (text) => {
            return filterDictText(this.statusOptions,text)
          }
        },
      ],
      forcastColumns:[
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'settlementOrganNo'
        },
        {
          title: '结算类型',
          align: 'center',
          dataIndex: 'settleType',
          customRender: (text) => {
            return filterDictText(this.settleTypeOptions,text)
          }
        },
        {
          title: '结算主体名称',
          align: 'center',
          dataIndex: 'settlementOrganName'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'empName'
        },
        {
          title: '身份证号码',
          align: 'center',
          dataIndex: 'empIdcardNo'
        },
        {
          title: '险种',
          align: 'center',
          dataIndex: 'insuranceTypeName'
        },
        {
          title: '起保时间',
          align: 'center',
          dataIndex: 'policyStart'
        },
        {
          title: '截止时间',
          align: 'center',
          dataIndex: 'policyEnd'
        },
        {
          title: '保单号',
          align: 'center',
          dataIndex: 'policyNo'
        },
        {
          title: '购买标准',
          align: 'center',
          dataIndex: 'buyStandard'
        },
        {
          title: '实际保费',
          align: 'center',
          dataIndex: 'buyPay'
        },
        {
          title: '预估保费',
          align: 'center',
          dataIndex: 'forecastBuyPay'
        },
        {
          title: '差额',
          align: 'center',
          dataIndex: 'balance',
          customRender: (text,record) => {
            return this.caculate(record.buyPay,record.forecastBuyPay)
          }
        },
        {
          title: '医疗',
          align: 'center',
          dataIndex: 'medicalMoney'
        },
        {
          title: '身故或残疾',
          align: 'center',
          dataIndex: 'deathDisabilityMoney'
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remark'
        },
      ],
      url:{
        editUrl:'/busiInsurance/tinsurancesettlementform/ensure',
        importUrl:'busiInsurance/tinsurancesettlementform/export',
        modifyCover:'/busiInsurance/tinsurancesettlementcover',
        process:'/busiInsurance/tinsurancesettlementform/queryFlowById/'
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      isRecived:false,
    }
  },
  methods: {
    ...mapGetters(["nickname"]),
    show(record) {
      this.model = Object.assign({}, record)
      this.model.reciveList = this.model.reciveList || []
      this.forcastBusinessInsuranceVos = this.model.forcastBusinessInsuranceVos || []
      this.initDictConfig()
      this.visible = true
      httpAction(this.url.process+this.model.id, null, 'get').then((res)=>{
        if(res.code == 200 && res.data){
          this.processList = res.data
        }
      })
    },
    getReciveFee(arr,field){
      const res = arr.map(item=>item[field])
      return res.join(',')
    },
    //打印
    handlePrint(){
      let url = '/pdf/insurancesettementdetail?id=' + this.model.id
      window.open(url)
    },
    caculate(a,b){
      const str1 = a || 0
      const str2 = b || 0
      return Math.floor((parseFloat(str1) - parseFloat(str2))*100)/100
    },
    handleOutImport(){
      // 商险明细
      const insuranceArr = this.model.businessInsuranceVos || []
      const forcasInsuranceArr = this.model.forcastBusinessInsuranceVos || []
      const insuranceData = insuranceArr.map(item=>{
        item.remark = item.remark || ''
        item.forecastBuyPay = item.forecastBuyPay || ''
        item.policyNo = item.policyNo || ''
        item.buyPay = item.buyPay || ''
        item.balance = this.caculate(item.buyPay,item.forecastBuyPay)
        item.settleType = filterDictText(this.settleTypeOptions,item.settleType)
        return item
      })
      const forcasInsuranceData = forcasInsuranceArr.map(item=>{
        item.remark = item.remark || ''
        item.forecastBuyPay = item.forecastBuyPay || ''
        item.balance = this.caculate(item.buyPay,item.forecastBuyPay)
        item.settleType = filterDictText(this.settleTypeOptions,item.settleType)
        return item
      })
      // 结算单数据
      const settelData = [
        {'index':this.insuranceBill.settlementDate+this.insuranceBill.departName + '结算单','data':'','project':'','money':'','account':'','matchMony':''},
        {'index':'结算主体','data':this.insuranceBill.departName,'project':'皖信盖章','money':'','account':'','matchMony':''},
        {'index':'客户单位','data':this.model.customerName,'project':'','money':'','account':'','matchMony':''},
        {'index':'结算日期','data':this.insuranceBill.settlementDate,'project':'','money':'','account':'','matchMony':''},
        {'index':'序号','data':'费用项目','project':'金额','money':'税费','account':'开票额小计','matchMony':''},
        {'index':1,'data':'商险','project':this.insuranceBill.insuranceAmount,'money':this.insuranceBill.incrementTaxFee,'account':this.insuranceBill.takingRisksTicket,'matchMony':''},
        {'index':2,'data':'人数','project':this.insuranceBill.peopleNum,'money':'','account':'','matchMony':''},
        {'index':3,'data':'人次','project':this.insuranceBill.people,'money':'','account':'','matchMony':''},
        {'index':4,'data':'管理费','project':this.insuranceBill.managementFee,'money':this.insuranceBill.managementTaxFee,'account':this.insuranceBill.managementMoneyTicket,'matchMony':''},
        {'index':5,'data':'差余额','project':this.insuranceBill.forecastBalance,'money':this.insuranceBill.forecastBalanceTax,'account':this.insuranceBill.forecastBalanceTicket,'matchMony':''},
        {'index':6,'data':'结算金额合计','project':'','money':this.insuranceBill.incrementTaxSum,'account':this.insuranceBill.settlementAmountSum,'matchMony':''},
        {'index':7,'data':'开票金额合计','project':'','money':'','account':this.insuranceBill.ticketAmountSum,'matchMony':''},
        {'index':8,'data':'审核人','project':this.model.auditUser||'','money':'制表人','account':this.insuranceBill.createUser,'matchMony':''},
        {'index':9,'data':'备注','project':this.model.remark||'','money':'','account':'','matchMony':''},
        {'index':'','data':'到款单位','project':'到款时间','money':'到款金额','account':'认领金额','matchMony':'匹配金额'},
      ]
      this.model.reciveList.forEach((item,index)=>{
        settelData.push({
          'index':(10+index),
          'data':item.incomeBelong,
          'project':item.incomeDate.slice(0,-9),
          'money':item.incomeFee,
          'account':this.getReciveFee(item['reciveRecordList'],'reciveFee'),
          'matchMony':this.getReciveFee(item['reciveRecordList'],'matchingAmount')
        })
      })
      const excelDatas = [
        {
          tHeader: ["结算主体编码", "结算类型","结算主体名称","姓名","身份证号码","发票号","险种","起保时间","截止时间","保单号","购买标准","实际保费","预估保费","差额","医疗","身故或残疾","备注"],
          filterVal: ['settlementOrganNo','settleType',"settlementOrganName", "empName","empIdcardNo","invoiceNo","insuranceTypeName","policyStart","policyEnd","policyNo","buyStandard","buyPay","forecastBuyPay","balance","medicalMoney","deathDisabilityMoney","remark"],
          tableDatas: insuranceData,
          sheetName: "商险明细"
        },
        {
          tHeader: ["结算主体编码", "结算类型","结算主体名称","姓名","身份证号码","险种","起保时间","截止时间","保单号","购买标准","实际保费","预估保费","差额","医疗","身故或残疾","备注"],
          filterVal: ['settlementOrganNo','settleType',"settlementOrganName", "empName","empIdcardNo", "insuranceTypeName","policyStart","policyEnd","policyNo","buyStandard","buyPay","forecastBuyPay","balance","medicalMoney","deathDisabilityMoney","remark"],
          tableDatas: forcasInsuranceData,
          sheetName: "商险差额明细"
        },
        {
          tHeader: ["序号","项目","费用项目", "金额", "开票额小计","匹配金额"],
          filterVal: ['index','data',"project", "money", "account","matchMony"],
          tableDatas: settelData,
          sheetName: "结算单"
        }
      ]
      // 封面
      this.model.insuranceSettlementCover.forEach((item,index) => {
        const customerNameStr = this.getCustomers(item.customerName,item.departName)
        const coverData = [
          {'company':item.coverName,'project':'','payType':'','money':'','no':'附件'+this.model.insuranceSettlementCover.length+'张'},
          {'company':"银行转账审批单",'project':'','payType':'','money':'','no':''},
          {'company':"",'project':item.createTime,'payType':'结算主体编码','money':item.departNo,'no':''},
          {'company':"客户单位",'project':'项目','payType':'付款方式','money':'金额','no':''},
          {'company':"",'project':'','payType':'','money':'','no':''},
          {'company':customerNameStr,'project':item.itemName,'payType':item.payType,'money':'¥' + item.amount,'no':''},
          {'company':"合计人民币:",'project':item.amountRmb,'payType':'','money':'¥' + item.amount,'no':''},
          {'company':"收款单位名称: " + item.receiptName + "        账号: " + item.receiptBankNo + "        开户行: " + item.receiptBankName,'project':'','payType':'','money':'','no':''},
          {'company':"备注: " + (item.remark||''),'project':'','payType':'','money':'','no':''},
          {'company':'公司领导：      财务负责人：      网银审核授权人：      网银转账提交人：      数据审核人：'+this.model.auditUser+'      制表人:'+this.model.createUser,'project':'' ,'payType': '','money':'','no':''},
        ]
        excelDatas.push({
          tHeader: ["序号", "名字", "描述", "金钱", "地位"],
          filterVal: ["company", "project", "payType", "money",'no'],
          tableDatas:coverData,
          sheetName:'封面' + (index+1)
        })
      })
      this.jsonToExcel(excelDatas, `${this.detail.departName}`, true, 'xlsx',this.model.reciveList.length)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    jsonToExcel(tableJson, filenames, autowidth, bookTypes,typeLength) {
      var that = this
      import('@/vendor/ExportSettlementCount').then(excel => {
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
          autoLength: typeLength // 长度
        })
        that.confirmLoading = false
      })
    },
    getCustomers(customerName,departName){
      let arr = []
      if(/,/.test(customerName)){
        const customerNameArr = customerName.split(',')
        const departNameArr = departName.split(',')
        customerNameArr.forEach((items,index)=>{
          arr[index] = items + '-' + departNameArr[index]
        })
      }else{
        arr[0] = customerName + '-' + departName
      }
      return arr.join('\n')
    },
    handleSubmit(){
      const _this = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            _this.confirmLoading = true
            const param = {
              id:this.detail.id,
              ticketAmountSum:values.ticketAmountSum,
              remark:values.remark
            }
            httpAction(this.url.editUrl, param, 'put').then((res) => {
              if (res.code === 200) {
                _this.$message.success('操作成功！')
                _this.close()
              } else {
                _this.$message.warning(res.msg)
              }
            }).finally(() => {
              _this.confirmLoading = false
            })
          }
        })
    },
    //修改银行账号信息
    modifySettem(){
      const _this = this
      this.setteForm.validateFields((err, values) => {
        if (!err) {
          httpAction(this.url.modifyCover, values, 'put').then((res) => {
            if (res.code === 200) {
              _this.$message.success('操作成功！')
              _this.close()
            } else {
              _this.$message.warning(res.msg)
            }
          }).finally(() => {
            _this.confirmLoading = false
          })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
      this.processList = []
    },
    // 数据字典
    initDictConfig() {
      // 状态
      initDictOptions('Insurance_record_status').then((res) => {
        if (res.code === 200) {
          this.statusOptions = res.data
        }
      });
    },
    // 点击修改发票号
    modifyNumber(item){
      this.$refs.coverModifyNumberModal.show(item)
    },
  }
}
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
.stepFormText {
  :global(.ant-form-item-label) {
    width: 80px;
  }
}
.settlement .tdbg2 {
  text-align: center;
}
.settlement {
  border-collapse: collapse;
  margin: 10px auto 30px;
  width: 800px;
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
  height: 32px;
  padding: 10px 10px 10px 15px;
  border: solid #000 1px;
  color: #333;
}
.cover .line {
  display: inline-block;
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
.tdleft {
  float: left;
  margin-bottom: 0px !important;
  height: 59px;
}
.pbottom p span {
  display: inline-block;
  text-align: right;
  font-weight: bold;
  margin: 0px;
}
.headerWrap {
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  justify-content: center;
  align-items: center;
  button {
    position: absolute;
    right: 7%;
    margin: 0;
  }
}
</style>
