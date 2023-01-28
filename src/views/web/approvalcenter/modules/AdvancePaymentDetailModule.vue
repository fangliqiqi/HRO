<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
    </template>

    <a-tabs
      default-active-key="1"
      @change="callback"
    >
      <a-tab-pane
        key="1"
        tab="垫付单详情"
      >
        <a-form
          :form="form"
          layout="inline"
          class="ant-advanced-search-form"
        >
          <div class="ant-card-body">
            <a-spin :spinning="confirmLoading">
              <a-card
                :bordered="true"
                class="ant-card-wider-padding"
                id="staffCard"
                style="margin: 0px auto; width:900px;"
              >
                <span id="staffEvectionTitle">垫付申请单</span>
                <table
                  border="1px"
                  id="taffEvectionTable"
                >
                  <thead>
                    <tr>
                      <td class="theadTr">垫付编号</td>
                      <td
                        align="left"
                        colspan="4"
                        style="padding-left: 10px;"
                      >{{ model.advancePaymentNo }}</td>
                    </tr>
                    <tr>
                      <td class="theadTr">客户单位</td>
                      <td
                        align="left"
                        colspan="2"
                        style="padding-left: 10px;"
                      >{{ settleDomain.customerName }}</td>
                      <td class="theadTr">客户合同</td>
                      <td
                        align="left"
                        colspan="2"
                        style="padding-left: 10px;"
                      >{{ settleDomain.contractName }}</td>
                    </tr>
                    <tr>
                      <td class="theadTr">结算主体</td>
                      <td
                        align="left"
                        colspan="2"
                        style="padding-left: 10px;"
                      >{{ model.departName }}</td>
                      <td class="theadTr">商务主体</td>
                      <td
                        align="left"
                        colspan="2"
                        style="padding-left: 10px;"
                      >{{ model.applyUnitName }}</td>
                    </tr> 
                    <tr>
                      <td class="theadTr">垫付类型</td>
                      <td
                        align="left"
                        colspan="2"
                        style="padding-left: 10px;"
                      >{{ filterDictText(advanceTypeDicts, model.advanceType) }}</td>
                      <td class="theadTr">回款周期</td>
                      <td
                        align="left"
                        colspan="2"
                        style="padding-left: 10px;"
                      >{{ model.backPayCycle }}个月</td>
                    </tr>
                    <tr>
                      <td class="theadTr">期望打款日期</td>
                      <td
                        align="left"
                        colspan="2"
                        style="padding-left: 10px;"
                      >{{ model.applyAdvanceDate }}</td>
                      <td class="theadTr">本次已垫付未回款金额</td>
                      <td
                        align="left"
                        colspan="2"
                        style="padding-left: 10px;"
                      >
                        {{ model.advanceNotPayback }}
                      </td>
                    </tr>
                  </thead>
                  <tr>
                    <td class="theadTr">结算金额</td>
                    <td
                      class="theadTr"
                      colspan="2"
                      align="left"
                      style="padding-left: 10px;"
                    >
                      {{ model.settleMoney }}
                    </td>
                    <td class="theadTr">开票金额</td>
                    <td
                      class="theadTr"
                      colspan="2"
                      align="left"
                      style="padding-left: 10px;"
                    >
                      {{ model.ticketMoney }}
                    </td>
                  </tr>
                  <tr>
                    <td class="firstTr">垫付金额</td>
                    <td
                      colspan="2"
                      style="padding-left: 10px;"
                      align="left"
                    >{{ model.advanceMoney }}</td>
                    <td class="firstTr">承诺回款日期</td>
                    <td
                      colspan="2"
                      style="padding-left: 10px;"
                      align="left"
                    >{{ model.paybackDate }}</td>
                  </tr>
                  <tr>
                    <td class="costingCol">申请人</td>
                    <td
                      class="costingCol"
                      colspan="2"
                      align="left"
                      style="padding-left: 10px;"
                    >
                      {{ model.createUser }}
                    </td>
                    <td class="costingCol">垫付原因</td>
                    <td
                      colspan="2"
                      style="padding-left: 10px;"
                      align="left"
                    >{{ model.advanceReason }}</td>
                  </tr>
                  <tr v-if="model.auditStatus!=0">
                    <td class="theadTr">是否逾期垫付</td>
                    <td
                      align="left" 
                      :colspan="model.spNo ? 2:4"
                      style="padding-left: 10px;"
                    >{{ model.spNo?'是':'否' }}</td>
                    <td class="theadTr" v-if="model.spNo">逾期垫付编号</td>
                    <td 
                      v-if="model.spNo"
                      align="left" 
                      colspan="2"
                      style="padding-left: 10px;"
                    >{{ model.spNo }}</td>
                  </tr>
                  <tr>
                    <td class="costingCol">已回款本金</td>
                    <td
                      class="costingCol"
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >
                      {{ model.paymentReceivedCapital == 0 ? ((model.auditStatus != 2 && model.auditStatus != 4) ? '-' : '0') : model.paymentReceivedCapital }}
                    </td>
                    <td class="costingCol">已回款收益</td>
                    <td
                      class="costingCol"
                      align="left"
                      colspan="2"
                      style="padding-left: 10px;"
                    >
                      {{ model.paymentReceivedIncome == 0 ? ((model.auditStatus != 2 && model.auditStatus != 4) ? '-' : '0') : model.paymentReceivedIncome }}
                    </td>
                  </tr>
                  <tr v-if="model.backPayStatusName">
                    <td class="costingCol">回款状态</td>
                    <td
                      class="costingCol"
                      colspan="2"
                      align="left"
                      style="padding-left: 10px;"
                    >
                      {{ model.backPayStatusName }}
                    </td>
                    <td class="costingCol">是否逾期</td>
                    <td
                      class="costingCol"
                      colspan="2"
                      align="left"
                      style="padding-left: 10px;"
                    >
                      {{ settleDomain.isOverdue==1?'是':'否' }}
                    </td>
                  </tr>
                  <tr>
                    <td class="costingCol">垫付函</td>
                    <td
                      class="costingCol"
                      colspan="4"
                      align="left"
                      style="padding-left: 10px;"
                    >
                      <a-form-item>
                        <div
                          class="clearfix"
                          style="width: 600px;"
                        >
                          <a-upload
                            listType="picture"
                            class="upload-list-inline"
                            :fileList="fileList"
                            @change="handleImport"
                            @preview="handlePreview"
                            :multiple="true"
                            accept="image/*,.xls,.xlsx,.csv,.pdf"
                            :remove="handleRemove"
                            :beforeUpload="beforeUpload"
                            :showUploadList="{showRemoveIcon:false}"
                          >
                          </a-upload>
                          <a-modal
                            :visible="previewVisible"
                            :footer="null"
                            @cancel="handlePreviwCancel"
                          >
                            <img
                              alt="example"
                              style="width: 100%"
                              :src="previewImage"
                            />
                          </a-modal>
                        </div>
                      </a-form-item>
                    </td>
                  </tr>
                </table>
              </a-card>
            </a-spin>
            <div class="setDisplay" v-if="showwedTerminationTime" >
              <p class="myStyle" >终止时间：</p><p class="myStyle2">{{ terminationTime }}</p>
            </div>
            <div
              class="setDisplay"
              v-if="isShowed"
            >
              <p class="myStyle">终止原因：</p>
              <p class="myStyle2">{{ reason }}</p>
            </div>

          </div>
        </a-form>
      </a-tab-pane>
      <a-tab-pane
        key="5"
        tab="明细"
      >
        <template v-if="model.billType == 2">
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="noTaxColumns"
            :dataSource="salaryDataSource"
            :pagination="salaryIpagination"
            :loading="salaryLoading"
            :scroll="{ x: 1500 }"
            @change="handleTableChange"
          >
          </a-table>
        </template>
        <template v-else>
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="typeColumns"
            :dataSource="salaryDataSource"
            :pagination="salaryIpagination"
            :loading="salaryLoading"
            :scroll="{ x: 1500 }"
            @change="handleTableChange"
          >
            <template
              slot="operation"
              slot-scope="text, record"
            >
              <a @click="handleDetail(record.id)">详情</a>
            </template>
          </a-table>
        </template>
      </a-tab-pane>
      <a-tab-pane
        key="3"
        tab="垫付统计"
      >
        <div style="background: #fafafa; padding: 30px;text-align:center;">
          <a-row :gutter="16">
            <a-col :span="6">
              <a-statistic
                value="当月已垫付"
                class="borderRright"
                :value-style="{ fontSize: '12px',color: '#9B9B9B'}"
                style="margin-right: 50px"
              >
                <template #title>
                  <span class="staticTitle">{{ numFormat(staticObj.advanceMoneyAllByMonth) }}</span>
                </template>
              </a-statistic>
            </a-col>
            <a-col :span="6">
              <a-statistic
                value="未回款金额"
                class="borderRright"
                :value-style="{ fontSize: '12px',color: '#9B9B9B'}"
                style="margin-right: 50px"
              >
                <template #title>
                  <span class="staticTitle">{{ numFormat(staticObj.advanceNotPayBackByYear) }}</span>
                </template>
                <template #suffix>
                  <a-tooltip placement="bottom">
                    <template slot="title">
                      过去12个月的未回款总金额
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </template>
              </a-statistic>
            </a-col>
            <a-col :span="6">
              <a-statistic
                value="已垫付金额"
                class="borderRright"
                :value-style="{ fontSize: '12px',color: '#9B9B9B'}"
              >
                <template #title>
                  <span class="staticTitle">{{ numFormat(staticObj.advanceMoneyAllByYear) }}</span>
                </template>
                <template #suffix>
                  <a-tooltip placement="bottom">
                    <template slot="title">
                      过去12个月的垫付出去的总金额
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </template>
              </a-statistic>
            </a-col>
            <a-col :span="6">
              <a-statistic
                class="borderRright"
                value="平均回款周期"
                :value-style="{ fontSize: '12px',color: '#9B9B9B'}"
                style="border-right:none"
              >
                <template #title>
                  <span class="staticTitle">{{ staticObj.avgDayByYear == '-' ? '-' : (numFormat(staticObj.avgDayByYear)+'天') }}</span>
                </template>
                <template #suffix>
                  <a-tooltip placement="bottom">
                    <template slot="title">
                      过去12个月的平均回款周期
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </template>
              </a-statistic>
            </a-col>
          </a-row>
        </div>
        <a-divider>垫付统计</a-divider>
        <PayBarChart
          :dataSource="staticList"
          :fieldList="fieldList"
        />
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          @change="tableChange"
          :footer="handleFooterShow"
        >
        </a-table>
      </a-tab-pane>
      <a-tab-pane
        key="2"
        tab="审批流程抄送记录"
      >
        <a-tabs default-active-key="1">
          <a-tab-pane
            key="1"
            tab="流程记录"
          >
            <a-timeline class="statusStep">
              <a-timeline-item
                v-for="(item,index) in recordList"
                :key="index"
                :color="color[item.auditStatus]"
              >
                <p><strong>{{ item.nodeName }}</strong></p>
                <p>状态：{{ status[item.auditStatus] }}</p>
                <p>操作人：{{ item.auditUser }}&nbsp;&nbsp;&nbsp;审核意见：{{ item.auditRemark }}</p>
                <p>操作时间：{{ item.auditTime }}</p>
              </a-timeline-item>
            </a-timeline>
          </a-tab-pane>
          <a-tab-pane
            key="2"
            tab="抄送记录"
            v-if="model.oldProcesFlag == 2 || model.oldProcesFlag == 3"
          >
            <a-timeline class="statusStep">
              <a-timeline-item
                v-for="(item,index) in copyInfo"
                :key="index"
              >
                <p>抄送人：{{ item.auditUser }}</p>
                <p>抄送时间：{{ item.createTime }}</p>
              </a-timeline-item>
            </a-timeline>
          </a-tab-pane>
        </a-tabs>

      </a-tab-pane>
      <a-tab-pane
        key="4"
        tab="流程进展明细"
        v-if="model.oldProcesFlag==2"
      >
        <div v-if="JSON.stringify(nodeDataSource) != {}">
          <VueG6Editor
            :id="processId"
            :dataSource="nodeDataSource"
            :oprator="oprator"
            ref="G6EditorForm"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane
        key="4"
        tab="流程进展明细"
        v-if="model.oldProcesFlag==3"
      >
        <div>
          <VueG6Editor
            :id="processId"
            :dataSource="nodeDataSource"
            :oprator="oprator"
            ref="G6EditorForm"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane
        key="6"
        tab="垫付未回款原因"
        force-render
      >
        <feedback-list-modal ref="FeedbackListModal" :paymentId="model.id"></feedback-list-modal>
      </a-tab-pane>
    </a-tabs>
    <statement-detail-modal ref="statementDetailModal"></statement-detail-modal>
  </a-modal>
</template>

<script>
import { httpAction,postActionHeader } from '@/api/manage'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import { filterOrgan } from '@/utils/customDict'
import PayBarChart from '@/components/chart/PayBarChart'
import moment from "moment"
import VueG6Editor from "@/components/g6edit/index"
import FeedbackListModal from "./FeedbackListModal"
import StatementDetailModal from '@/views/salary/searchsalary/modules/StatementDetailModal'
import { getItemName } from '@/utils/common'

export default {
  name: 'AdvancePaymentDetailModule',
  components: { PayBarChart,VueG6Editor,StatementDetailModal,FeedbackListModal },
  data() {
    return {
      reason: '',
      isShowed: false,
      terminationTime:'',
      showwedTerminationTime:false,
      // 上面的是新增的字段
      title: '操作',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      model: {},
      customerTypeDicts: [],
      advanceTypeDicts: [],
      fileTypeOfOffice:'xls,xlsx,doc,docx,ppt,pptx',
      fileList: [],
      flows: [],
      nodes: [],
      recordList: [],
      settleDomain: {customerName: "",contractName: ""},
      color:['blue','green','red','#fa8c16'],
      status:['提交审核','审核通过','审核不通过','待审核'],
      previewVisible: false,
      previewImage: '',
      selectId: '',
      process:{}, // 流程
      validatorRules: {
        settleDomainId: {rules: [{required: true, message: '请选择结算主体!'}]},
      },
      url: {
        getOrgan: '/admin/organizationinfo/getUserAllOrgan',
        getNoBackMoneySum: '/hrApproval/tadvancepayment/getNoBackMoneySum',
        saveOrUpdate: '/hrApproval/tadvancepayment',
        importUrl: '/hrApproval/tpaymentattainfo/upload',
        deleteAtta: '/hrApproval/tpaymentattainfo/',
        getDetail:'/hrApproval/tadvancepayment/',
        getFlowDetail:'/hrApproval/tapproveauditinfo/getNewAllAuditInfo/',
        getProcess:'/process/tprocess/getProcessVoById?id=',
        getNewFlowDetail:'/hrApproval/tpaymentnodeproocess/getNodeProocess/byadvancePaymentId?advancePaymentId=',
        getContractInfo: '/hrBase/tcustomercontract/',
      },
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0
      },
      dataSource:[],
      columns:[
        {
          title: '序号',
          align: 'center',
          dataIndex: 'id',
          width: 45,
          ellipsis: true,
          customRender:(text,record,index)=>{
            const page = (text === '') ? '' : (this.ipagination.current-1)*(this.ipagination.pageSize)+(index+1)
            return this.getSlot(page)
          }
        },
        {
          title: '期望打款日期',
          align: 'center',
          width: 90,
          ellipsis: true,
          dataIndex: 'applyAdvanceDate',
          customRender:(text)=>{
            return this.getSlot(text)
          }
        },
        {
          title: '结算主体编码',
          align: 'center',
          width: 110,
          ellipsis: true,
          dataIndex: 'departNo',
          customRender:(text)=>{
            return this.getSlot(text)
          }
        },
        {
          title: '结算主体',
          align: 'center',
          dataIndex: 'departName',
          customRender:(text)=>{
            return this.getSlot(text)
          }
        },
        {
          title: '垫付金额',
          align: 'center',
          width: 75,
          ellipsis: true,
          dataIndex: 'advanceMoney',
          customRender:(text)=>{
            return this.getSlot(text)
          }
        },
        {
          title: '申请人',
          align: 'center',
          width: 75,
          ellipsis: true,
          dataIndex: 'createUser',
          customRender:(text)=>{
            return this.getSlot(text)
          }
        },
        {
          title: '承诺回款日期',
          align: 'center',
          width: 90,
          ellipsis: true,
          dataIndex: 'paybackDate',
          customRender:(text)=>{
            return this.getSlot(text)
          }
        },
        {
          title: '回款金额',
          align: 'center',
          width: 75,
          ellipsis: true,
          dataIndex: 'advancePayback',
          customRender:(text)=>{
            return this.getSlot(text)
          }
        },
        {
          title: '当期结算收入',
          align: 'center',
          width: 110,
          ellipsis: true,
          dataIndex: 'incomeMoney',
          customRender:(text)=>{
            return this.getSlot(text)
          }
        },
        {
          title: '未回款金额',
          align: 'center',
          width: 90,
          ellipsis: true,
          dataIndex: 'advanceNotPayback',
          customRender:(text)=>{
            return this.getSlot(text)
          }
        },
        {
          title: '认领人',
          align: 'center',
          width: 75,
          ellipsis: true,
          dataIndex: 'reciveUser',
          customRender:(text)=>{
            return this.getSlot(text)
          }
        },

      ],
      typeColumns:[],
      staticList:[],
      fieldList:[],
      sumList:[],
      copyInfo:[], //抄送人
      nodeDataSource:{}, // 流程详情
      processId:'', // 流程id
      oprator:-1,
      nodePres:[], //指定节点上级
      staticObj:{advanceNotPayBackByYear:0,advanceMoneyAllByYear:0,avgDayByYear:'-',advanceMoneyAllByMonth:'-'},
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      distributionFlagOption:{'0':'未发放','1':'发放成功','2':'发放失败'},
      bankOptions:[],
      salaryColumns:[
        {
          width: 120,
          ellipsis: true,
          title: '姓名',
          fixed: 'left',
          align: 'center',
          dataIndex: 'empName',
          key: 'empName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '工资发放方式',
          fixed: 'left',
          align: 'center',
          dataIndex: 'salaryStyle',
          key: 'salaryStyle',
          customRender:(text) => {
            return this.salaryStyleOption[text] || '-'
          }
        },
        {
          width: 240,
          ellipsis: true,
          title: '身份证号',
          dataIndex: 'empIdcard',
          key: 'empIdcard',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '银行卡号',
          dataIndex: 'bankNo',
          key: 'bankNo',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '开户行',
          dataIndex: 'bankName',
          key: 'bankName',
          align: 'center',
          customRender: (text) => {
            const bankName = filterDictText(this.bankOptions, text)
            if(String(bankName) === '-' && text){
              return text;
            }
            return bankName
          },
        },
        {
          width: 150,
          ellipsis: true,
          title: '工资发放时间',
          dataIndex: 'salaryGiveTime',
          key: 'salaryGiveTime',
          align: 'center',
          customRender:(text) => {
            return this.salaryGiveTimeOption[text] || '-'
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '社保扣缴月份',
          dataIndex:'deduSocialMonth',
          key:'deduSocialMonth',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '公积金扣缴月份',
          dataIndex:'deduProvidentMonth',
          align: 'center',
          key:'deduProvidentMonth',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '是否薪资扣税',
          dataIndex:'salaryTaxFlag',
          align: 'center',
          key:'salaryTaxFlag',
          customRender:(text) => {
            return this.isFlag[text] || '-'
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '社保优先级',
          dataIndex:'socialPriority',
          align: 'center',
          key:'socialPriority',
          customRender:(text) => {
            return this.socialPriorityOption[text] || '-'
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '公积金优先级',
          dataIndex:'fundPriority',
          align: 'center',
          key:'fundPriority',
          customRender:(text) => {
            return this.fundPriorityOption[text] || '-'
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '年终奖扣税方案',
          dataIndex:'annualBonusType',
          align: 'center',
          key:'annualBonusType',
          customRender:(text) => {
            return this.annualBonusTypeOption[text] || '-'
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '是否扣除社保',
          dataIndex:'isDeductSocial',
          align: 'center',
          key:'isDeductSocial',
          customRender:(text) => {
            return this.isFlag[text] || '-'
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '是否扣除公积金',
          dataIndex:'isDeductFund',
          align: 'center',
          key:'isDeductFund',
          customRender:(text) => {
            return this.isFlag[text] || '-'
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '工资月份',
          dataIndex: 'salaryDate',
          align: 'center',
          key: 'salaryDate',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '结算月份',
          dataIndex: 'settlementMonth',
          align: 'center',
          key: 'settlementMonth',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '结算主体',
          dataIndex: 'settleDepartName',
          align: 'center',
          key: 'settleDepartName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      enginerSalaryColumns:[
        {
          width: 120,
          ellipsis: true,
          title: '姓名',
          align: 'center',
          dataIndex: 'empName',
          key: 'empName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 240,
          ellipsis: true,
          title: '身份证号',
          dataIndex: 'empIdcard',
          key: 'empIdcard',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '银行卡号',
          dataIndex: 'bankNo',
          key: 'bankNo',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '开户行',
          dataIndex: 'bankName',
          key: 'bankName',
          align: 'center',
          customRender: (text) => {
            const bankName = filterDictText(this.bankOptions, text)
            if(String(bankName) === '-' && text){
              return text;
            }
            return bankName
          },
        },
        {
          width: 150,
          ellipsis: true,
          title: '工资发放时间',
          dataIndex: 'salaryGiveTime',
          key: 'salaryGiveTime',
          align: 'center',
          customRender:(text) => {
            return this.salaryGiveTimeOption[text] || '-'
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '工资月份',
          dataIndex: 'salaryDate',
          align: 'center',
          key: 'salaryDate',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '结算月份',
          dataIndex: 'settlementMonth',
          align: 'center',
          key: 'settlementMonth',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '结算主体',
          dataIndex: 'settleDepartName',
          align: 'center',
          key: 'settleDepartName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      noTaxColumns:[
        {
          width: 150,
          ellipsis: true,
          title: '账户名',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '金额',
          dataIndex: 'money',
          key: 'money',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '结算月份',
          dataIndex: 'settleMonth',
          key: 'settleMonth',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '开户行',
          dataIndex: 'bankName',
          key: 'bankName',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 220,
          ellipsis: true,
          title: '银行卡号',
          dataIndex: 'bankNo',
          key: 'bankNo',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 220,
          ellipsis: true,
          title: '项目名称',
          dataIndex: 'itemName',
          key: 'itemName',
          align: 'center',
          customRender: (text,record) => {
            const result = getItemName(record.itemTypeName,text) || '-'
            return result
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '发放方式',
          dataIndex: 'salaryStyle',
          key: 'salaryStyle',
          align: 'center',
          customRender:(text) => {
            return this.salaryStyleOption[text] || '-'
          }
        }
      ],
      salaryDataSource:[],
      salaryLoading:false,
      salaryIpagination:{
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showQuickJumper: false,
        showSizeChanger: false,
        total: 0
      },
    }
  },
  methods: {
    moment,
    filterDictText,
    filterOrgan,
    numFormat(num) {
      // let res = '-'
      // if(num !== null){
      //   res = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      // }
      return (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    },
    getSlot(text){
      return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
    },
    handleTableChange(pagination){
      this.salaryIpagination = pagination
      if(this.model.billType === '2'){
        this.getNotaxList(this.model.salarySettleBillId,pagination.current)
      }else{
        if(this.model.salarySettleBillId){
          this.getSalaryList(this.model.salarySettleBillId,pagination.current)
        }else if(this.model.engineeringBillId){
          this.getEngineerSalaryList(this.model.engineeringBillId,pagination.current)
        }
      }
      
    },
    handleDetail(id){
      if(this.model.salarySettleBillId){
        httpAction(`/salary/tsalaryaccountitem/noPage?salaryAccountId=${id}`,null,'get').then(res=>{
          if(res.code === 200){
            this.$refs.statementDetailModal.title = '报表详情'
            this.$refs.statementDetailModal.saiList = res.data
            this.$refs.statementDetailModal.show()
          }else{
            this.$message.warning(res.msg)
          }
        })
      }else if(this.model.engineeringBillId){
        httpAction(`/salary/tengineeraccountitem/page?salaryAccountId=${id}`,null,'get').then(res=>{
          if(res.code === 200){
            this.$refs.statementDetailModal.title = '报表详情'
            this.$refs.statementDetailModal.saiList = res.data.records
            this.$refs.statementDetailModal.show()
          }else{
            this.$message.warning(res.msg)
          }
        })
      }
    },
    getSalaryList(id,current){
      this.salaryLoading = true
      httpAction(`/salary/tsalaryaccount/page?settleFormId=${id}&current=${current}`,null,'get').then(res=>{
        if(res.code === 200){
          this.salaryDataSource = res.data.records
          this.salaryIpagination.total = res.data.total
        }else{
          this.salaryDataSource = []
          this.salaryIpagination.total = 0
        }
      }).finally(()=>{
        this.salaryLoading = false
      })
    },
    getEngineerSalaryList(id,current){
      this.salaryLoading = true
      httpAction(`/salary/tengineeraccount/page?settleFormId=${id}&current=${current}`,null,'get').then(res=>{
        if(res.code === 200){
          this.salaryDataSource = res.data.records
          this.salaryIpagination.total = res.data.total
        }else{
          this.salaryDataSource = []
          this.salaryIpagination.total = 0
        }
      }).finally(()=>{
        this.salaryLoading = false
      })
    },
    callback(key){
      if(String(key) === '3' && this.sumList.length === 0){
        httpAction(`/hrApproval/tadvancepayment/query/pass/sum?settleDomainId=${this.model.settleDomainId}`,null,'get').then((res) => {
          if(Number(res.code) === 200){
            this.sumList = [{
              id:'',
              applyAdvanceDate:'合计',
              advanceMoney:res.data.advanceSum,
              advancePayback:res.data.advanceBackSum,
              advanceNotPayback:res.data.advanceNoBackSum,
              // incomeMoney:res.data.incomeSum,
            }]
            this.staticObj = {
              advanceNotPayBackByYear:res.data.advanceNotPayBackByYear || 0,
              advanceMoneyAllByYear:res.data.advanceMoneyAllByYear || 0,
              avgDayByYear:res.data.avgDayByYear || '-',
              advanceMoneyAllByMonth:res.data.advanceMoneyAllByMonth || '-',
            }
          }else{
            this.$message.warning(res.msg)
          }
        })
      }
      if(String(key) === '5' && this.salaryDataSource.length === 0){
        if(this.model.billType === '2'){
          this.getNotaxList(this.model.salarySettleBillId,1)
        }else{
          if(this.model.salarySettleBillId){
            this.getSalaryList(this.model.salarySettleBillId,1)
          }else if(this.model.engineeringBillId){
            this.getEngineerSalaryList(this.model.engineeringBillId,1)
          }
        }
      }
      if(String(key) === '6' && this.$refs.FeedbackListModal.dataSource.length === 0){
        this.$refs.FeedbackListModal.getSysUsers()
        this.$refs.FeedbackListModal.loadRemoteData()
      }
    },
    getNotaxList(id,current){
      this.salaryLoading = true
      httpAction(`/salary/tnontaxsalaryaccount/page?settleFormId=${id}&current=${current}`,null,'get').then(res=>{
        if(res.code === 200){
          this.salaryDataSource = res.data.records
          this.salaryIpagination.total = res.data.total
        }else{
          this.salaryDataSource = []
          this.salaryIpagination.total = 0
        }
      }).finally(()=>{
        this.salaryLoading = false
      })
    },

    handleFooterShow(){
      return (
        <a-table
          rowKey={Math.random}
          bordered={false}
          pagination={false}
          columns={this.columns}
          dataSource={this.sumList}
          showHeader={false}
        ></a-table>
      )
    },

    getPageDate(current,size){
      const url = `/hrApproval/tadvancepayment/query/pass/page?settleDomainId=${this.model.settleDomainId}&current=${current}&size=${size}`
      httpAction(url,null,'get').then((res) => {
        if(Number(res.code) === 200 && res.data){
          this.dataSource = res.data.records
          this.ipagination.total = res.data.total
        }else{
          this.$message.warning(res.msg)
        }
      })
    },

    tableChange(pagination){
      //分页、排序、筛选变化时触发
      this.ipagination = pagination
      this.getPageDate(pagination.current,pagination.pageSize)
    },

    getBarChart(){
      httpAction(`/hrApproval/tadvancepayment/query/pass/statis?settleDomainId=${this.model.settleDomainId}`,null,'get').then((res) => {
        if(Number(res.code) === 200){
          this.fieldList = []
          const advanceSumObj = {name: '垫付金额'}
          const advanceBackSumObj = {name: '回款金额'}
          for(const item in res.data){
            this.fieldList.push(item)
            advanceSumObj[item] = res.data[item].advanceSum
            advanceBackSumObj[item] = res.data[item].advanceBackSum
          }
          this.staticList = [advanceSumObj,advanceBackSumObj]
        }else{
          this.$message.warning(res.msg)
        }
      })
    },

    getProcessDetail(){
      const _this = this
      if(String(this.model.oldProcesFlag) === '2'){
        httpAction(this.url.getFlowDetail+this.model.id,null,'get').then(res=>{
          if(Number(res.code) === 200){
            const length = res.data.auditInfo.length
            if(length){ //流程图详情
              _this.process.auditInfo = res.data.auditInfo[length-1]
              _this.processId = this.process.auditInfo.flowId
              httpAction(_this.url.getProcess+_this.process.auditInfo.flowId,null,'get').then(result=>{
                if(Number(result.code) === 200){
                  _this.nodeDataSource = _this.formatData(result.data,_this.process.auditInfo.nodeId,_this.process.auditInfo.auditStatus)
                }else{
                  _this.$message.warning(result.msg)
                }
              })
            }

          }else{
            this.$message.warning(res.msg)
          }
        }).finally(()=>{
          this.visible = true
        })
      }else if(String(this.model.oldProcesFlag) === '3'){
        httpAction(this.url.getNewFlowDetail+this.model.id,null,'get').then(res=>{
          if(Number(res.code) === 200){
            // 处理主流程和子流程
            const length = res.data.length
            if(length){ //流程图详情
              httpAction(_this.url.getProcess+res.data[0].processId,null,'get').then(result=>{
                if(Number(result.code) === 200){
                  _this.nodeDataSource = result.data ? _this.formateSourceNode(result.data) : {}
                }else{
                  _this.$message.warning(result.msg)
                }
              })
            }
          }else{
            this.$message.warning(res.msg)
          }
        }).finally(()=>{
          this.visible = true
        })
      }else{
        this.visible = true
      }
    },

    show(record,backPayStatusOption) {
      function isNull(str){
        return Boolean(str)&&Boolean(str.trim());
      }
      httpAction(this.url.getDetail+record.id,null,'get').then((res)=>{
        if(Number(res.code) === 200){
          this.model = res.data
          if(this.model.contractId){ //如果有合同id
            httpAction(this.url.getContractInfo+this.model.contractId,null,'get').then(conres=>{
              if(conres.code==200){
                this.settleDomain.contractName = conres.data.contractName
              }
            })
          }else{
             this.settleDomain.contractName = '-'
          }
          if(backPayStatusOption){
            const result = backPayStatusOption.find(item=>item.value == res.data.backPayStatus)
            this.model.backPayStatusName = result['label'] || '-'
          }

          //获得终止原因的字符串
          this.reason = res.data.terminationResion
          this.isShowed=isNull(this.reason)
          this.terminationTime = res.data.terminationTime
          this.showwedTerminationTime=isNull(this.showwedTerminationTime)
          this.model.applyUnit = Number(res.data.applyUnit)
          this.settleDomain.customerName = res.data.customerName;
          this.settleDomain.customerId = res.data.customerId;
          this.settleDomain.belongContract = res.data.contractId;
          this.settleDomain.isOverdue = record.isOverdue; //是否逾期
          
          if(this.model.salarySettleBillId){
            // eslint-disable-next-line
            this.typeColumns = _.cloneDeep(this.salaryColumns)
          }else if(this.model.engineeringBillId){
            // eslint-disable-next-line
            this.typeColumns = _.cloneDeep(this.enginerSalaryColumns)
          }
          this.getAuitList(record.id)
          this.sumList = []
          
          // this.visible = true
          this.getPageDate(1,10)
          this.getBarChart()
          this.getProcessDetail()
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    //获取审核记录
    getAuitList(id){
      if(String(this.model.oldProcesFlag) === '2' || String(this.model.oldProcesFlag) === '3'){ //新流程
        httpAction(`/hrApproval/tapproveauditinfo/getNewAllAuditInfo/${id}`,null,'get').then((res)=>{
          if(Number(res.code) === 200){
            this.recordList = res.data.auditInfo
            //抄送人
            this.copyInfo = res.data.copyInfo
          }else{
            this.$message.warning(res.msg)
          }
        })
      }else if(String(this.model.oldProcesFlag) === '1'){
        httpAction(`/hrApproval/tapproveauditinfo/getAllAuditInfo/${id}`,null,'get').then((res)=>{
          if(Number(res.code) === 200){
            this.recordList = res.data
          }else{
            this.$message.warning(res.msg)
          }
        })
      }
    },

    handleCancel() {
      this.close()
    },

    close() {
      this.$emit('close')
      this.visible = false
      this.staticList = this.sumList = this.nodePres = this.recordList = this.copyInfo = []
      this.ipagination.current = 1
      this.ipagination.pageSize = 10
      this.processId = ''
      this.nodeDataSource = this.process = this.model = {}
      this.staticObj = {
        advanceNotPayBackByYear:0,
        advanceMoneyAllByYear:0,
        avgDayByYear:'-',
        advanceMoneyAllByMonth:'-',
      }
      this.salaryDataSource = []
    },

    handlePreviwCancel () {
      this.previewVisible = false
    },

    handlePreview (file) {
      const fileExt = file.name.replace(/.+\./,"")
      const reg = new RegExp(fileExt,"gi")
      if(reg.test(this.fileTypeOfOffice)) {
        window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url || file.thumbUrl)}`, '_blank')
      }else if(/pdf/gi.test(fileExt)){
        window.open(file.url || file.thumbUrl,'_blank')
      }else{
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      }
    },

    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false;
    },

    handleImport() {
      const { fileList } = this;
      this.uploadFilesChange(fileList[fileList.length - 1])
    },

    uploadFilesChange(file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", 1);
      const contextType = {'Content-Type': 'multipart/form-data'};
      postActionHeader(this.url.importUrl, formData,contextType).then((res) => {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList
        const fileImag = {
          uid:res.data.uid,
          name:res.data.name,
          status:res.data.status,
          url:res.data.url
        }
        this.fileList.push(fileImag);
      });
    },

    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList
      const that = this;
      httpAction(this.url.deleteAtta + file.uid,null,'delete').then((res) => {
        if(Number(res.code) === 200) {
          that.$message.success('删除成功！')
        } else {
          that.$message.warning(res.msg)
        }
      });
    },

    formatData(data,nowNodeId,auditStatus){
      let currentNodeId = '' // 当前id
      const dataSource = {
        edges:[],
        nodes:[],
      }
      dataSource.nodes = data.processNodeList.map((item)=>{
        // 获取指定节点的id =>ace13bc4 currentNodeId
        if(String(item.id) === String(nowNodeId)){
          currentNodeId = item.logoTitle
        }
        return {
          id:item.logoTitle,
          tid:item.id,
          label:item.name,
          x:parseFloat(item.coordinatex),
          y:parseFloat(item.coordinatey),
          nodetype:item.type,
          shape:item.shape,
          size:item.size,
          handleAllowNext:item.handleAllowNext,
          description:item.description,
          countersign:item.countersign,
          color:item.color,
          backType:item.backType,
          allowThis:item.allowThis,
          allowDispatch:item.allowDispatch,
          processId:this.id,
          nodePrimissionList:item.nodePrimissionList,
          nodeReaderPromissionList:item.nodeReaderPromissionList,
        }
      })
      dataSource.edges = data.nodeRouteList.map((item)=>{
        return {
          label:item.name,
          source:item.prewNode,
          sourceAnchor:Number(item.preNodeAnchor),
          target:item.nextNode,
          targetAnchor:Number(item.nextNodeAnchor),
          id:item.id,
          logoTitle:item.logoTitle,
          // tid:item.id,
          processId:this.id,
          description:item.description,
          opinion:item.opinion,
          opinionMustFlag:item.opinionMustFlag,
          priorityFlag:item.priorityFlag,
          routeType:item.routeType,
          sameForPrew:item.sameForPrew,
          sequenceNo:item.sequenceNo,
          shape:item.shape || 'flow-polyline',
          timeoutRoam:item.timeoutRoam,
        }
      })
      
      // 根据当前节点id currentNodeId获取所有上级
      this.getNodePrev(dataSource,currentNodeId)
      const specialNode = {
        nextNode:'',
        preNode:'',
      }
      // 设置节点颜色
      const nodeLng = dataSource.nodes.length
      for(let j=0; j<nodeLng; j++){
        if(String(dataSource.nodes[j].id) === String(currentNodeId) && String(auditStatus) === '3'){ //待审核
          dataSource.nodes[j].color = '#EE7600'
        }else if(String(dataSource.nodes[j].id) === String(currentNodeId) && String(auditStatus) === '2'){ //审核不通过
          dataSource.nodes[j].color = '#2ec770'
          // 直接到结束
          specialNode.preNode = currentNodeId
        }else if(String(dataSource.nodes[j].id) === String(currentNodeId) && String(auditStatus) === '1'){ // 审核通过
          dataSource.nodes[j].color = '#2ec770' // 当前的通过，下一个结束
          specialNode.nextNode = currentNodeId
        }else if(this.nodePres.indexOf(dataSource.nodes[j].id) > -1){
          dataSource.nodes[j].color = '#2ec770'
        }else{
          dataSource.nodes[j].color = '#adadad'
        }
      }
      if(specialNode.nextNode){
        // 获取指定节点的下一个节点
        const targetNode = this.getNextNode(dataSource.edges,specialNode.nextNode)
        for(let j=0; j<nodeLng; j++){
          if(String(dataSource.nodes[j].id) === String(targetNode)){
            dataSource.nodes[j].color = '#EE7600'
          }
        }
      }
      if(specialNode.preNode){
        // 获取指定id的上一个节点
        const preNode = this.getPreNode(dataSource.edges,specialNode.preNode)
        let flag = false
        // 判断是否是开始节点 是则转到结束节点
        for(let j=0; j<nodeLng; j++){
          if(String(dataSource.nodes[j].id) === String(preNode)){
              if(dataSource.nodes[j].nodetype === 'begin'){
                flag = true
              }else{
               dataSource.nodes[j].color = '#EE7600'
              }
          }
        }
        if(flag){
          for(let j=0; j<nodeLng; j++){
            if(dataSource.nodes[j].nodetype === 'end'){
              dataSource.nodes[j].color = '#EE7600'
            }
          }
        }
      }
      return dataSource
    },

    // 获取指定节点的id =>ace13bc4
    getNodePrev(list,id){
      for(const item of list.edges){
        if(String(item.target) === String(id)){
          if(Number(item.routeType) === 1){
            this.nodePres.push(item.source)
            this.getNodePrev(list,item.source)
          }else{
            break
          }
        }else{
          continue
        }
      }
    },

    // 根据指定节点获取下个节点
    getNextNode(list,id){
      for(const item of list){
        if(String(item.source) === String(id) && Number(item.routeType) === 1){
          return item.target
        }
      }
      return ''
    },

    getPreNode(list,id){
      for(const item of list){
        if(String(item.source) === String(id) && Number(item.routeType) === 2){
          return item.target
        }
      }
      return ''
    },
    formateSourceNode(data){
      const dataSource = {
        edges:[],
        nodes:[],
      }
      dataSource.nodes = data.processNodeList.map((item)=>{
        return {
          id:item.logoTitle,
          tid:item.id,
          label:item.name,
          x:parseFloat(item.coordinatex),
          y:parseFloat(item.coordinatey),
          nodetype:item.type,
          shape:item.shape,
          size:item.size,
          handleAllowNext:item.handleAllowNext,
          description:item.description,
          countersign:item.countersign,
          color:item.color,
          backType:item.backType,
          allowThis:item.allowThis,
          allowDispatch:item.allowDispatch,
          processId:this.id,
          nodePrimissionList:item.nodePrimissionList,
          nodeReaderPromissionList:item.nodeReaderPromissionList,
        }
      })
      dataSource.edges = data.nodeRouteList.map((item)=>{
        return {
          label:item.name,
          source:item.prewNode,
          sourceAnchor:Number(item.preNodeAnchor),
          target:item.nextNode,
          targetAnchor:Number(item.nextNodeAnchor),
          id:item.id,
          logoTitle:item.logoTitle,
          // tid:item.id,
          processId:this.id,
          description:item.description,
          opinion:item.opinion,
          opinionMustFlag:item.opinionMustFlag,
          priorityFlag:item.priorityFlag,
          routeType:item.routeType,
          sameForPrew:item.sameForPrew,
          sequenceNo:item.sequenceNo,
          shape:item.shape || 'flow-polyline',
          timeoutRoam:item.timeoutRoam,
        }
      })
      return dataSource
    }
  },
}
</script>

<style lang="less" scoped>
.borderRright{
  border-right: 1px solid #eaeaea;
  .staticTitle{
    color: #4A4A4A;
    font-size: 24px;
  }
}
</style>
<style scoped>

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
.ant-form-item-control {
  line-height: normal;
}
.ant-advanced-search-form .ant-form-item {
  margin-bottom: 0px;
}
.upload-list-inline >>> .ant-upload-list-item {
  float: left;
  width: 190px;
  margin-right: 8px;
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
/deep/ .ant-table-footer {
  padding: 0px !important;
  border: none !important;
}

.myStyle {
  display: block;
  font-weight: 600;
  white-space: nowrap;
}
.myStyle2 {
  font-weight: 400;
}
.setDisplay{
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 50px;
}
</style>
