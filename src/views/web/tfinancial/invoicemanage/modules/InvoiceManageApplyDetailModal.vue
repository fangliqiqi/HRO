<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    wrapClassName="invoiceApplyWrapModal"
    :destroyOnClose="true"
    :bodyStyle="{height:'500px',overflowY: 'scroll',padding: '0 24px 24px'}"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        v-has="'wxhr:tinvoice_doSubmit'"
        v-if="isCommitType"
        type="primary"
        :loading="confirmLoading"
        @click="handleCommit()"
      >提交开票申请</a-button>
    </template>

    <a-tabs
      :activeKey="pageActiveKey"
      @change="tabsChange"
    >
      <a-tab-pane
        :forceRender="true"
        tab="开票详情"
        key="1"
      >
        <a-form
          :form="form"
          layout="inline"
          class="ant-disabled-form"
        >
          <div>
            <div class="sectionHeader">
              <div class="sectionTitle">购买方</div>
              <a-button
                type="primary"
                :disabled="true"
              >选择</a-button>
            </div>
            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="客户名称"
                  class="stepFormText"
                >
                  <a-select
                    :disabled="true"
                    showSearch
                    optionFilterProp="children"
                    placeholder="请选择客户名称"
                    v-decorator="['unitId']"
                    :dropdownMatchSelectWidth="false"
                    style="width: 200px"
                  >
                    <a-select-option
                      v-for="(value, key) in unitBelongs"
                      :key="key"
                      :value="value.id"
                    >{{ value.customerName }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  v-if="Number(pageType) !== 3"
                  label="结算主体"
                  class="stepFormText"
                >
                  <a-select
                    :disabled="true"
                    showSearch
                    optionFilterProp="children"
                    placeholder="请选择结算主体"
                    v-decorator="['settleDomainId']"
                    :dropdownMatchSelectWidth="false"
                    style="width: 200px"
                  >
                    <a-select-option
                      v-for="(value, key) in settleDomainBelongs"
                      :key="key"
                      :value="value.id"
                    >{{ value.departName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <div class="configInfoWrap">
              <detail-list :col="2">
                <detail-list-item term="抬头名称">
                  {{ buyerSetting.headerName?buyerSetting.headerName:'-' }}
                </detail-list-item>
                <detail-list-item term="纳税人识别号">{{ buyerSetting.taxIdentificationNum ? buyerSetting.taxIdentificationNum : '-' }}</detail-list-item>
              </detail-list>
              <detail-list :col="2">
                <detail-list-item term="发票类型">{{ invKindType[String(buyerSetting.invKind)] || '-' }}</detail-list-item>
                <detail-list-item term="开户行">{{ buyerSetting.bankName ? buyerSetting.bankName : '-' }}</detail-list-item>
              </detail-list>
              <detail-list :col="2">
                <detail-list-item term="银行卡号">{{ buyerSetting.bankNo ? buyerSetting.bankNo : '-' }}</detail-list-item>
                <detail-list-item term="电话">{{ buyerSetting.tel ? buyerSetting.tel : '-' }}</detail-list-item>
              </detail-list>
              <detail-list :col="2">
                <detail-list-item term="地址">{{ buyerSetting.address ? buyerSetting.address : '-' }}</detail-list-item>
              </detail-list>
            </div>
          </div>
          <a-divider></a-divider>
          <div>
            <div class="sectionHeader">
              <div class="sectionTitle">销售方</div>
              <a-button
                :disabled="true"
                type="primary"
              >选择</a-button>
            </div>
            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="开票人"
                  class="stepFormText"
                >
                  <a-select
                    :disabled="true"
                    showSearch
                    optionFilterProp="children"
                    placeholder="请选择开票人"
                    v-decorator="['invoiceUser']"
                    :dropdownMatchSelectWidth="false"
                    style="width: 200px"
                  >
                    <a-select-option
                      v-for="(value, key) in invoicePersonList"
                      :key="key"
                      :value="String(value.id)"
                    >{{ value.name }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="审核人"
                  class="stepFormText"
                >
                  <select-page
                    :disabled="true"
                    :allowClear="false"
                    :searchUrl="'admin/user/page/wxhr?nickname='"
                    :title="'nickname'"
                    placeholder="请选择审核人"
                    :triggerChange="true"
                    :id="'userId'"
                    :resList="checkerResList"
                    v-decorator="['auditUserId']"
                    style="width:200px;"
                  ></select-page>
                </a-form-item>
              </a-col>
            </a-row>
            <div class="configInfoWrap">
              <detail-list :col="2">
                <detail-list-item term="销售方名称">
                  {{ sellerSetting.companySeller ? sellerSetting.companySeller : '-' }}
                </detail-list-item>
                <detail-list-item term="纳税人识别号">
                  {{ sellerSetting.taxNbSeller ? sellerSetting.taxNbSeller : '-' }}
                </detail-list-item>
              </detail-list>
              <detail-list :col="2">
                <detail-list-item term="开户行">
                  {{ sellerSetting.bankSeller ? sellerSetting.bankSeller : '-' }}
                </detail-list-item>
                <detail-list-item term="银行卡号">
                  {{ sellerSetting.bankNoSeller ? sellerSetting.bankNoSeller : '-' }}
                </detail-list-item>
              </detail-list>
              <detail-list :col="2">
                <detail-list-item term="审核人">
                  {{ sellerSetting.auditUser ? sellerSetting.auditUser : '-' }}
                </detail-list-item>
                <detail-list-item term="收款人">
                  {{ sellerSetting.cashier ? sellerSetting.cashier : '-' }}
                </detail-list-item>
              </detail-list>
              <detail-list :col="2">
                <detail-list-item term="复核人">
                  {{ sellerSetting.checker ? sellerSetting.checker : '-' }}
                </detail-list-item>
              </detail-list>
            </div>
          </div>
          <a-divider></a-divider>
          <div v-if="Number(pageType) !== 2">
            <div>
              <div class="sectionHeader">
                <div class="sectionTitle">关联结算单</div>
              </div>
            </div>
            <a-table
              rowKey="settleFormId"
              size="middle"
              :bordered="true"
              :columns="columns"
              :loading="loading"
              :dataSource="dataSource"
              :pagination="false"
            >
              <span
                slot="action"
                slot-scope="text, record"
              >
                <span v-if="String(record.settleFormType) === '2'">{{ '-' }}</span>
                <a
                  v-else
                  @click="handleBillDetailBtnClick(record)"
                >详情</a>
              </span>
            </a-table>
            <a-divider></a-divider>
          </div>
          <div class="proDetailBox">
            <div
              class="sectionHeader"
              style="margin-bottom:0;"
            >
              <span style="display:flex;">
                <div class="sectionTitle">发票明细</div>
              </span>
            </div>
            <a-tabs v-model="activeKey">
              <a-tab-pane
                v-for="(pane,index) in panes"
                :key="String(index+1)"
                :tab="`发票${index+1}`"
                :closable="pane.closable"
              >
                <invoice-detail-table-modal
                  ref="detailTableModal"
                  :showOnly="true"
                  :invoiceDataSource="invoiceDetailDataSource[index]"
                  :companySeller="sellerSetting.companySeller"
                >
                </invoice-detail-table-modal>
              </a-tab-pane>
            </a-tabs>
            <a-row style="margin-top:24px;">
              <a-col :span="8">
                <a-form-item
                  label="开票金额"
                  class="stepFormTextDisabled"
                >
                  {{ buyerSetting.invoiceMoney ? buyerSetting.invoiceMoney : '0' }}
                </a-form-item>
              </a-col>
              <a-col :span="16" style="text-align:right;">
                <a-form-item
                  label="申请备注"
                  class="stepFormTextDisabled"
                  style="margin-right:0;"
                >
                  <a-textarea
                    :disabled="true"
                    auto-size
                    placeholder="请输入备注"
                    v-decorator="['remark']"
                    style="width: 350px"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </a-form>
      </a-tab-pane>
      <a-tab-pane
        :forceRender="true"
        tab="流程进展明细"
        key="2"
      >
        <a-spin :spinning="confirmLoading">
          <template v-if="auditList.length > 0">
            <a-timeline style="margin-top: 10px;margin-left:15px;">
              <template v-for="(list, key) in auditList">
                <a-timeline-item
                  :key="key"
                  :color="auditStatusOptions[list.processStatus].color"
                >
                  <p>{{ list.processContent ? list.processContent : '' }}</p>
                  <p>{{ list.processOperator ? list.processOperator : '' }}</p>
                  <p>{{ list.processTime ? list.processTime : '' }}</p>
                </a-timeline-item>
              </template>
            </a-timeline>
          </template>
          <template v-else>
            <a-empty style="margin-top:15%" />
          </template>
        </a-spin>
      </a-tab-pane>
      <a-tab-pane
        key="3"
        tab="发票记录"
      >
        <a-table
          v-if="recordDataSource.length > 0"
          size="middle"
          bordered
          rowKey="id"
          :scroll="{x: 1}"
          :columns="recordColumns"
          :dataSource="recordDataSource"
        >
          <span
            slot="action"
            slot-scope="text, record"
          >
            <a @click="handleRecordDetail(record)">详情</a>
          </span>
        </a-table>
        <template v-else>
          <a-empty style="margin-top:15%" />
        </template>
      </a-tab-pane>
    </a-tabs>
    <invoice-record-detail-modal ref="modalForm"></invoice-record-detail-modal>
    <salary-engine-search-detail-modal ref="modalDetail"></salary-engine-search-detail-modal>
    <search-detail-modal ref="modalSalaryDetail"></search-detail-modal>
    <statement-detail-except-salary-modal ref="statementDetailExceptSalaryModal"></statement-detail-except-salary-modal>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'
import { httpAction } from '@/api/manage'
import SelectPage from '@/components/jeecg/SelectPage'
import SalaryEngineSearchDetailModal from '../../invoice/modules/SalaryEngineSearchDetailModal'
import SearchDetailModal from '../../invoice/modules/SearchDetailModal'
import InvoiceRecordDetailModal from './InvoiceRecordDetailModal'
import StatementDetailExceptSalaryModal from './StatementDetailExceptSalaryModal'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
import InvoiceDetailTableModal from './invoiceDetailTableModal'

export default {
  components: {
    SelectPage,
    SalaryEngineSearchDetailModal,
    InvoiceRecordDetailModal,
    StatementDetailExceptSalaryModal,
    SearchDetailModal,
    InvoiceDetailTableModal,
    DetailList,
    DetailListItem
  },
  data() {
    const panes = [{ title: '发票1', closable: false }]
    return {
      title: '操作',
      visible: false,
      confirmLoading: false,
      pageActiveKey: '1', // 分类项默认第一个tab
      pageType: 1, // 当前页面是 1申请开票/2申请预开票/3申请预估开票
      isCommitType: false, // 是否是提交页面，默认是展示详情
      form: this.$form.createForm(this),
      loading: false, // 结算单表格加载动画
      detailDataInfo: {}, // 编辑进入的详情数据
      unitBelongs: [], // 存储客户名称
      settleDomainBelongs: [], // 客户单位对应的存储结算主体
      buyerSetting: {}, // 购买方信息
      sellerSetting: {}, // 销售方信息
      totalInvoiceMoney: '', // 金额合计
      totalTaxMoney: '', // 税额合计
      invoicePersonList: [], // 开票人数据源
      checkerResList: [], // 审核人回显数据
      dataSource: [], // 结算单列表数据源
      auditList: [], // 审核流程数据
      panes, // 商品明细的Tab
      activeKey: '1', // 发票明细默认第一个tab
      invoiceDetailDataSource: [
        {
          allTax: '',
          allValue: '',
          invoiceMoney: '',
          taxDeduction: '',
          invoiceType: '2',
          listed: '1',
          invoiceItemsList: []
        }
      ], // 商品类目数据源
      recordDataSource: [], // 发票记录数据源
      auditStatusOptions: {
        '0': { option: '待提交', color: 'blue' },
        '1': { option: '待审核', color: 'cyan' },
        '2': { option: '审核通过', color: 'purple' },
        '3': { option: '审核未通过', color: 'red' },
        '4': { option: '已开票', color: 'green' }
      }, // 审核状态
      invKindType: { '0': '专用发票', '2': '普通发票', '51': '电子发票' }, // 发票类型
      formTypeOptions: { '0': '普通工资', '1': '工程工资', '2': '商险', '3': '预估结算单', '4': '一次性业务结算单' }, // 结算单类型
      columns: [
        {
          title: '结算金额',
          align: 'center',
          dataIndex: 'settleMoney',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '结算单类型',
          align: 'center',
          dataIndex: 'settleFormType',
          customRender: text => {
            const tipTitle = this.formTypeOptions[String(text)] || '-'
            return <a-tooltip title={tipTitle}>{tipTitle}</a-tooltip>
          }
        },
        {
          title: '结算日期',
          align: 'center',
          dataIndex: 'settleMonth',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'action' }
        }
      ],
      recordColumns: [
        {
          ellipsis: true,
          width: 80,
          title: '发票状态',
          align: 'center',
          dataIndex: 'status',
          customRender: text => {
            const status = ['正常', '作废']
            return status[text] || '-'
          }
        },
        {
          ellipsis: true,
          title: '发票号',
          width: 150,
          align: 'center',
          dataIndex: 'fphm',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width: 150,
          title: '开票金额',
          align: 'center',
          dataIndex: 'invoiceMoney',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '发票类型',
          width: 100,
          align: 'center',
          dataIndex: 'invoiceType',
          customRender: text => {
            const type = this.invKindType[text]
            return <a-tooltip title={type}>{type}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '购买方',
          width: 180,
          align: 'center',
          dataIndex: 'customerName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '销售方',
          width: 180,
          align: 'center',
          dataIndex: 'sellerName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '开票人',
          align: 'center',
          width: 120,
          dataIndex: 'issuer',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '开票日期',
          align: 'center',
          width: 170,
          dataIndex: 'createTime',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '操作',
          key: 'operations',
          align: 'center',
          fixed: 'right',
          width: 120,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: 'salary/tinvoice/getTInvoiceList', // 结算单列表
        getInvoice: 'hrBase/tticketconfig/page', // 获取配置
        commit: '/salary/tinvoice/doSubmit', // 提交开票申请
        getSalarySelttleForm: 'salary/tsettlementhform/', // 普通薪资结算单
        getEnginnerSelttleForm: 'salary/tengineeringsettlementform/', // 工程类薪资结算单
        auditProcessUrl: 'salary/tinvoiceprocessinfo/getInfoById/' // 流程进展明细
      }
    }
  },
  methods: {
    show() {
      this.visible = true
      this.handleDetailData()
      // 获取流程进展明细
      this.getAuditProcess()
    },

    // 关闭
    handleCancel() {
      this.form.resetFields()
      this.buyerSetting = {}
      this.confirmLoading = false
      this.loading = false
      this.deductionVisible = false
      this.pageType = 1
      this.sellerSetting = {}
      this.selectedRowKeys = []
      this.selectionRows = []
      this.invoicePersonList = []
      this.checkerResList = []
      this.dataSource = []
      this.settleDomainBelongs = []
      this.invoiceDetailDataSource = [
        {
          allTax: '',
          allValue: '',
          invoiceMoney: '',
          taxDeduction: '',
          invoiceType: '2',
          listed: '1',
          invoiceItemsList: []
        }
      ]
      this.panes = [{ title: '发票1', closable: false }]
      this.activeKey = '1'
      this.pageActiveKey = '1'
      this.totalInvoiceMoney = '' // 金额合计
      this.totalTaxMoney = '' // 税额合计
      this.isCommitType = false
      this.visible = false
    },

    // 处理详情传入的数据
    handleDetailData() {
      const configData = this.detailDataInfo.tinvoice
      // 备注中显示文字拼接差额征税
      const note =
        parseFloat(configData.taxDeduction) > 0
          ? `差额征税：${configData.taxDeduction} ${configData.remark || ''}`
          : configData.remark
      configData.remark = note
      this.invoicePersonList = [{ id: configData.invoiceUser, name: configData.invoiceUserName }]
      this.checkerResList = [{ id: String(configData.auditUserId), title: configData.auditUser }]
      // 发票记录
      this.recordDataSource = this.detailDataInfo.invoiceRecordList || []
      //pageType: 1, // 当前页面是 1申请开票/2申请预开票(没有结算单)/3申请预估开票(没有结算主体)
      if (Number(this.pageType) === 3) {
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(configData, 'unitId', 'invoiceUser', 'auditUserId', 'remark'))
        })
        // 结算单
        this.dataSource = this.detailDataInfo.mlist || []
        this.invoiceCallbackAssignData(configData)
      } else {
        // 更新结算主体下拉列表
        const resultList = this.unitBelongs.filter(item => {
          return String(item.id) === String(configData.unitId)
        })
        if (resultList && resultList.length) {
          this.settleDomainBelongs = resultList[0].settleDomainList
        } else {
          this.$message.warn('无单位或结算主体权限，请授权后处理！')
          this.settleDomainBelongs = []
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(configData, 'unitId', 'settleDomainId', 'invoiceUser', 'auditUserId', 'remark'))
        })
        if (Number(this.pageType) !== 2) {
          // 结算单列表会跟随结算主体变化
          this.dataSource = this.detailDataInfo.mlist || []
        }
        this.invoiceCallbackAssignData(configData)
      }
      // 兼容老数据
      const newInvoiceList = this.detailDataInfo.invoiceRecordVoList || []
      const oldInvoiceList = this.detailDataInfo.invoiceItemsList || []
      let productList = []
      if (newInvoiceList.length) {
        productList = this.detailDataInfo.invoiceRecordVoList || []
      } else if (oldInvoiceList.length) {
        const obj = {
          allTax: configData.allTax,
          allValue: configData.allValue,
          invoiceMoney: configData.invoiceMoney,
          taxDeduction: configData.taxDeduction,
          invoiceType: configData.invoiceType && String(configData.invoiceType),
          listed: configData.listed,
          invoiceItemsList: oldInvoiceList || [],
          memo:configData.memo
        }
        productList.push(obj)
      }
      this.invoiceDetailWithList(productList)
      this.activeKey = '1'
      this.totalInvoiceMoney = configData.invoiceMoney // 金额合计
      this.totalTaxMoney = configData.allTax // 税额合计
    },
    // 处理发票明细表数据
    invoiceDetailWithList(productList) {
      if (productList.length) {
        const tempList = []
        const tempPane = []
        productList.map((item, index) => {
          const obj = {
            allTax: item.allTax || '0',
            allValue: item.allValue || '0',
            invoiceMoney: item.invoiceMoney || '0',
            taxDeduction: item.taxDeduction || '0',
            invoiceType: item.invoiceType && String(item.invoiceType),
            listed: item.listed,
            invoiceItemsList: item.invoiceItemsList || [],
            memo:item.memo || ''
          }
          tempList.push(obj)
          // Tab 标签页
          if (index === 0) {
            const paneObj = { title: '发票1', key: '1', closable: false }
            tempPane.push(paneObj)
          } else {
            const paneObj = { title: `发票${index + 1}`, key: String(index + 1) }
            tempPane.push(paneObj)
          }
        })
        this.invoiceDetailDataSource = tempList
        this.panes = tempPane
      } else {
        this.invoiceDetailDataSource = [
          {
            allTax: '',
            allValue: '',
            invoiceMoney: '',
            taxDeduction: '',
            invoiceType: '2',
            listed: '1',
            invoiceItemsList: [],
            memo:''
          }
        ]
        this.panes = [{ title: '发票1', closable: false }]
      }
    },
    // 编辑--购买方和销售方数据赋值
    invoiceCallbackAssignData(data) {
      const temp = this.buyerSetting
      this.buyerSetting = {
        total: temp.total,
        invoiceMoney: data.invoiceMoney,
        allTax: data.allTax,
        unitNo: data.unitNo,
        unitId: data.unitId,
        unitName: data.unitName,
        settleDomainId: data.settleDomainId,
        settleDomainName: data.settleDomainName,
        settleDomainNo: data.settleDomainNo,
        headerName: data.headerName,
        goodsName: data.goodsName,
        bankName: data.bankName,
        bankNo: data.bankNo,
        taxIdentificationNum: data.taxIdentificationNum, // 纳税人识别号
        tel: data.tel, // 电话
        address: data.address, // 开票地址
        invKind: data.invKind // 发票类型
      }
      // 销售方信息
      this.sellerSetting = {
        companySeller: data.companySeller, // 公司名称-发票销售方（列表的销售方）
        bankSeller: data.bankSeller, // 开户行-销售方
        bankNoSeller: data.bankNoSeller, // 卡号-销售方
        taxNbSeller: data.taxNbSeller, // 纳税人识别号（同一个纳税人识别号对应一个公司名称）-发票销售方
        telSeller: data.telSeller, // 电话-销售方
        addressSeller: data.addressSeller, // 开票地址
        cashier: data.cashier, // 收款人
        checker: data.checker, // 复核人
        auditUserId: data.auditUserId, // 审核人ID
        auditUser: data.auditUser, //  审核人
        invoiceUser: data.invoiceUser || '', // 开票人
        invoiceUserName: data.invoiceUserName || '' // 开票人姓名
      }
    },
    // 获取流程进展明细接口
    getAuditProcess() {
      const configData = this.detailDataInfo.tinvoice
      const httpUrl = this.url.auditProcessUrl + configData.id
      httpAction(httpUrl, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.auditList = res.data
        } else {
          this.$message.error('流程进展数据不完整！')
        }
      })
    },
    // 点击发票记录详情
    handleRecordDetail(record) {
      this.$refs.modalForm.showSingleInvoice(record)
    },
    // 分类项tab切换
    tabsChange(e) {
      this.pageActiveKey = e
    },
    // 点击查看结算单详情
    handleBillDetailBtnClick(record) {
      // 获取结算单详情
      //  formTypeOptions: { '0': '普通工资', '1': '工程工资', '2': '商险', '3': '预估结算单', '4': '一次性业务结算单' }, // 结算单类型
      const settleType = String(record.settleFormType)
      if (settleType === '0') {
        httpAction(this.url.getSalarySelttleForm + record.settleFormId, {}, 'GET').then(res => {
          if (Number(res.code) === 200) {
            this.$refs.modalSalaryDetail.show(res.data)
            this.$refs.modalSalaryDetail.title = '详情'
          }
        })
      } else if (settleType === '1') {
        httpAction(this.url.getEnginnerSelttleForm + record.settleFormId, {}, 'GET').then(res => {
          if (Number(res.code) === 200) {
            this.$refs.modalDetail.show(res.data)
            this.$refs.modalDetail.title = '详情'
          }
        })
      } else {
        const item = {
          settleFormType: record.settleFormType,
          settleFormId: record.settleFormId
        }
        this.$refs.statementDetailExceptSalaryModal.title = '结算单详情'
        this.$refs.statementDetailExceptSalaryModal.item = item
        this.$refs.statementDetailExceptSalaryModal.show(item,this.detailDataInfo.tinvoice.settleDomainId)
      }
    },
    // 点击提交开票申请
    handleCommit() {
      const configData = this.detailDataInfo.tinvoice
      const httpurl = `${this.url.commit}?tInvoiceId=${configData.id}&invoiceMoney=${configData.invoiceMoney}`
      httpAction(httpurl, '', 'post')
        .then(res => {
          if (Number(res.code) === 200) {
            this.$message.success(`${this.title}成功！`)
            this.$emit('ok')
            this.handleCancel()
          } else {
            this.$message.warning(res.msg || res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-footer {
  padding: 0px !important;
  border: none !important;
}
// 发票明细下的tab标题底部距离
.proDetailBox {
  :global(.ant-tabs-bar) {
    margin-bottom: 10px;
  }
  :global(.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab) {
    height: auto;
  }
}
.sectionHeader {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-bottom: 10px;
  .sectionTitle {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
  }
  .ant-btn {
    margin-left: 10px;
  }
}
.configInfoWrap {
  margin-top: 15px;
  border: 1px dashed #e9e9e9;
  padding: 10px 15px;
}
</style>
