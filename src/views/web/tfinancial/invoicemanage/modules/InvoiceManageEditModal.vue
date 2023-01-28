<template>
  <a-modal
    :title="title"
    :width="950"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    wrapClassName="invoiceApplyWrapModal"
    :bodyStyle="{height:'500px',overflowY: 'scroll'}"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        :loading="confirmLoading"
        @click="handleOk(0)"
        v-has="'wxhr:tinvoice_editInvoice'"
      >确认编辑</a-button>
    </template>
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
            :disabled="(buyerSetting.total && buyerSetting.total > 1)?false:true"
            @click="handleBuyerOrSellerSelect(1)"
          >选择</a-button>
        </div>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="客户名称"
              class="stepFormText"
            >
              <select-page
                placeholder="请选择单位"
                style="width: 180px"
                v-decorator="['unitId',{rules: [{ required: true, message: '请选择客户名称！' }]}]"
                :searchUrl="'/hrBase/customerBusiness/customerInfo/getCustomerOwnerPage?customerName='"
                :title="'customerName'"
                :allowClear="true"
                :triggerChange="true"
                @select="handleUnitChange"
                :id="'customerId'"
                :resList="resList"
              ></select-page>
              <!-- <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择客户名称"
                v-decorator="['unitId', {rules: [{ required: true, message: '请选择客户名称！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 200px"
              >
                <a-select-option
                  v-for="(value, key) in unitBelongs"
                  :key="key"
                  :value="value.id"
                  @click="handleUnitChange(value)"
                >{{ value.customerName }}</a-select-option>
              </a-select> -->
            </a-form-item>
            <a-form-item
              v-if="Number(pageType) !== 3"
              label="结算主体"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择结算主体"
                v-decorator="['settleDomainId',{rules: [{ required: true, message: '请选择结算主体！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 200px"
              >
                <a-select-option
                  v-for="(value, key) in settleDomainBelongs"
                  :key="key"
                  :value="value.id"
                  @click="handleGetList(value)"
                >{{ value.departName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="configInfoWrap">
          <detail-list :col="2">
            <detail-list-item term="抬头名称">
              <a-input
                placeholder="修改抬头名称"
                :value="buyerSetting.headerName?buyerSetting.headerName:'-'"
                @change="ticktHeaderOnChange"
                @blur="ticktHeaderOnBlur"
                class="headerNameInput"
              ></a-input>
            </detail-list-item>
            <detail-list-item term="纳税人识别号">{{ buyerSetting.taxIdentificationNum ? buyerSetting.taxIdentificationNum : '-' }}</detail-list-item>
          </detail-list>
          <detail-list :col="2">
            <detail-list-item term="发票类型">{{ invKindOptions[String(buyerSetting.invKind)] || '-' }}</detail-list-item>
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
            type="primary"
            @click="handleBuyerOrSellerSelect(2)"
          >选择</a-button>
        </div>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="开票人"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择开票人"
                v-decorator="['invoiceUser', {rules: [{ required: true, message: '请选择开票人！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 200px"
              >
                <a-select-option
                  v-for="(value, key) in invoicePersonList"
                  :key="key"
                  :value="String(value.id)"
                  @click="handleInvoicePersonChange(value)"
                >{{ value.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="审核人"
              class="stepFormText"
            >
              <select-page
                :allowClear="false"
                :searchUrl="'admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                placeholder="请选择审核人"
                :triggerChange="true"
                :id="'userId'"
                :resList="checkerResList"
                v-decorator="['auditUserId', {rules: [{ required: true, message: '请选择审核人！' }]}]"
                @change="checkerSelectOption"
                style="width:200px;"
              ></select-page>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="configInfoWrap">
          <detail-list :col="2">
            <detail-list-item term="销售方名称">{{ sellerSetting.companySeller ? sellerSetting.companySeller : '-' }}</detail-list-item>
            <detail-list-item term="纳税人识别号">{{ sellerSetting.taxNbSeller ? sellerSetting.taxNbSeller : '-' }}</detail-list-item>
          </detail-list>
          <detail-list :col="2">
            <detail-list-item term="开户行">{{ sellerSetting.bankSeller ? sellerSetting.bankSeller : '-' }}</detail-list-item>
            <detail-list-item term="银行卡号">{{ sellerSetting.bankNoSeller ? sellerSetting.bankNoSeller : '-' }}</detail-list-item>
          </detail-list>
          <detail-list :col="2">
            <detail-list-item term="审核人">{{ sellerSetting.auditUser ? sellerSetting.auditUser : '-' }}</detail-list-item>
            <detail-list-item term="收款人">{{ sellerSetting.cashier ? sellerSetting.cashier : '-' }}</detail-list-item>
          </detail-list>
          <detail-list :col="2">
            <detail-list-item term="复核人">{{ sellerSetting.checker ? sellerSetting.checker : '-' }}</detail-list-item>
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
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
        >
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
            <a-button
              type="primary"
              shape="circle"
              icon="plus"
              size="small"
              @click="addDetailTab()"
            >
            </a-button>
          </span>
        </div>
        <a-tabs
          v-model="activeKey"
          hide-add
          type="editable-card"
          @edit="onEdit"
          @change="tabChangeCallback"
        >
          <a-tab-pane
            v-for="(pane,index) in panes"
            :key="String(index+1)"
            :tab="`发票${index+1}`"
            :closable="pane.closable"
          >
            <invoice-detail-table-modal
              ref="proDetailTableModal"
              :invoiceDataSource="invoiceDetailDataSource[index]"
              :companySeller="sellerSetting.companySeller"
              @change="productListChanged"
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
              {{ totalInvoiceMoney ? totalInvoiceMoney : '0' }}
            </a-form-item>
          </a-col>
          <a-col
            :span="16"
            style="text-align:right;"
          >
            <a-form-item
              label="申请备注"
              class="stepFormTextDisabled"
              style="margin-right:0;"
            >
              <a-textarea
                auto-size
                placeholder="请输入备注"
                v-decorator="['remark', {rules: [{ max: 255, message: '255'}]}]"
                style="width: 350px;"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <select-buyer-or-seller-modal
      ref="selectBuyerOrSellerModal"
      @ok="buyerOrSellerSelectedModalOk"
    ></select-buyer-or-seller-modal>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'
import SelectPage from '@/components/jeecg/SelectPage'
import SelectProductCategoryModal from './SelectProductCategoryModal'
import SelectBuyerOrSellerModal from './SelectBuyerOrSellerModal'
import { getAction, httpAction } from '@/api/manage'
import InvoiceDetailTableModal from './invoiceDetailTableModal'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item

export default {
  components: {
    SelectPage,
    SelectProductCategoryModal,
    SelectBuyerOrSellerModal,
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
      pageType: 1, // 当前页面是 1申请开票/2申请预开票/3申请预估开票
      form: this.$form.createForm(this),
      unitBelongs: [], // 存储客户名称
      settleDomainBelongs: [], // 客户单位对应的存储结算主体
      buyerSetting: {}, // 购买方信息
      sellerSetting: {}, // 销售方信息
      totalInvoiceMoney: '', // 金额合计
      totalTaxMoney: '', // 税额合计
      invoicePersonList: [], // 开票人数据源
      checkerResList: [], // 审核人回显数据
      selectedRowKeys: [],
      resList:[],
      selectionRows: [], // 关联的结算单信息
      loading: false, // 结算单表格加载动画
      invKindOptions: { '0': '专用发票', '2': '普通发票', '51': '电子发票' }, // 发票类型
      formTypeOptions: { '0': '普通工资', '1': '工程工资', '2': '商险', '3': '预估结算单', '4': '一次性业务结算单' }, // 结算单类型
      dataSource: [], // 结算单列表数据源
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
      panes, // 商品明细的Tab
      activeKey: '1',
      columns: [
        {
          title: '结算金额',
          align: 'center',
          dataIndex: 'settleMoney',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
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
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        }
      ], // 结算单列数据
      url: {
        list: 'salary/tinvoice/getTInvoiceList', // 结算单列表
        edit: '/salary/tinvoice/editInvoice', // 编辑 开票申请
        getInvoice: 'hrBase/tticketconfig/page', // 根据结算主体获取购买方配置
        getInvoiceByUnit: 'hrBase/tticketconfig/getByUnitId', // 根据客户单位获取购买方配置
        limitInfo: '/salary/tinvoicelimitset/selectInvoiceLimitSet' // 按公司名称 和 发票类型查询开票限额
      }
    }
  },
  methods: {
    show() {
      this.visible = true
      this.handleDetailData()
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
      this.resList = []
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
      this.totalInvoiceMoney = '' // 金额合计
      this.totalTaxMoney = '' // 税额合计
      this.visible = false
    },
    // 处理详情传入的数据
    handleDetailData() {
      const configData = this.detailDataInfo.tinvoice
      this.resList = [{
        id:String(configData.unitId),
        title:configData.unitName
      }]
      this.invoicePersonList = [{ id: configData.invoiceUser, name: configData.invoiceUserName }]
      this.checkerResList = [{ id: String(configData.auditUserId), title: configData.auditUser }]
      //pageType: 1, // 当前页面是 1申请开票/2申请预开票(没有结算单)/3申请预估开票(没有结算主体)
      if (Number(this.pageType) === 3) {
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(configData, 'unitId', 'invoiceUser', 'auditUserId', 'remark'))
        })
        // 结算单列表会跟随客户单位变化
        this.url.list = `${this.url.list.split('?')[0]}?type=1&unitId=${configData.unitId}`
        this.loadStatementListData(true)
        // 根据客户单位获取购买方配置数量
        httpAction(`${this.url.getInvoiceByUnit}?unitId=${configData.unitId}`, null, 'GET').then(res => {
          if (Number(res.code) === 200 && res.data) {
            this.buyerSetting = { total: res.data.length }
            this.invoiceCallbackAssignData(configData)
          } else {
            this.buyerSetting = {}
            this.$message.error('请先完善开票信息配置！')
          }
        })
      } else {
        // 更新结算主体下拉列表
        const resultList = this.unitBelongs.filter(item => {
          return String(item.id) === String(configData.unitId)
        })
        if (resultList && resultList.length) {
          this.settleDomainBelongs =  resultList[0].settleDomainList
        } else {
          this.$message.warn('无单位或结算主体权限，请授权后处理！')
          this.settleDomainBelongs = []
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(configData, 'unitId', 'settleDomainId', 'invoiceUser', 'auditUserId', 'remark'))
        })
        // 根据结算主体获取购买方配置数量
        httpAction(`${this.url.getInvoice}?settleId=${configData.settleDomainId}&current=1&size=30`, {}, 'GET').then(
          res => {
            if (Number(res.code) === 200 && res.data.total) {
              this.buyerSetting = { total: res.data.total }
              this.invoiceCallbackAssignData(configData)
            } else {
              this.buyerSetting = {}
              this.$message.error('请先完善开票信息配置！')
            }
          }
        )
        if (Number(this.pageType) !== 2) {
          // 结算单列表会跟随结算主体变化
          this.url.list = `${this.url.list.split('?')[0]}?type=0&deptId=${configData.settleDomainId}&unitId=${
            configData.unitId
          }`
          this.loadStatementListData(true)
        }
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
          memo: configData.memo
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
            memo: item.memo || ''
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
            memo: ''
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
    // 下拉选择开票人
    handleInvoicePersonChange(value) {
      this.sellerSetting.invoiceUser = value.id
      this.sellerSetting.invoiceUserName = value.name
    },
    // 选择更改审核人信息
    checkerSelectOption(value, option) {
      if (value) {
        const text = option.componentOptions.children[0].text
        const Id = value
        this.sellerSetting.auditUserId = Id // 审核人ID
        this.sellerSetting.auditUser = text //  审核人
      }
    },
    // 点击选择客户名称
    handleUnitChange(value) {
      const data = this.unitBelongs.find(item=>item.id==value)
      this.buyerSetting = {
        unitNo: data.customerCode,
        unitId: data.id,
        unitName: data.customerName
      }
      if (Number(this.pageType) === 3) {
        // 预估开票没有结算主体 根据客户单位获取购买方配置信息
        httpAction(`${this.url.getInvoiceByUnit}?unitId=${value}`, null, 'GET').then(res => {
          if (Number(res.code) === 200 && res.data.length) {
            const configData = res.data[0]
            this.buyerSettingDataAssign(res.data.length, configData)
          } else {
            this.$message.error('请先完善开票信息配置！')
          }
        })
        // 结算单列表会跟随结算主体变化
        this.url.list = `${this.url.list.split('?')[0]}?type=1&unitId=${value.id}`
        this.loadStatementListData()
      } else {
        // 清空已选择的结算主体
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({'unitId': value,settleDomainId: undefined}, 'unitId','settleDomainId'))
        })
        // 更新结算主体下拉列表
        this.settleDomainBelongs = data.settleDomainList
      }
    },
    // 点击选择结算主体
    handleGetList(value) {
      const temp = this.buyerSetting
      this.buyerSetting = {
        unitNo: temp.unitNo,
        unitId: temp.unitId,
        unitName: temp.unitName,
        settleDomainId: value.id,
        settleDomainName: value.departName,
        settleDomainNo: value.departNo
      }
      // 获取购买方配置信息
      httpAction(`${this.url.getInvoice}?settleId=${value.id}&current=1&size=30`, {}, 'GET').then(res => {
        if (Number(res.code) === 200 && res.data.total) {
          const configData = res.data.records[0]
          this.buyerSettingDataAssign(res.data.total, configData)
        } else {
          this.$message.error('请先完善开票信息配置！')
        }
      })
      if (Number(this.pageType) !== 2) {
        // 结算单列表会跟随结算主体变化
        this.url.list = `${this.url.list.split('?')[0]}?type=0&deptId=${value.id}&unitId=${value.customerId}`
        this.loadStatementListData()
      }
    },
    // 发票抬头输入框失去焦点
    ticktHeaderOnBlur(e) {
      const { value } = e.target
      if (value.replace(/\s+/g, '').length === 0) {
        this.buyerSetting.headerName = null
      }
    },
    // 修改抬头名称
    ticktHeaderOnChange(e) {
      const { value } = e.target
      this.buyerSetting.headerName = value.trim()
    },
    // 购买方和销售方选择
    handleBuyerOrSellerSelect(type) {
      if (type === 1) {
        if (Number(this.pageType) === 3) {
          const unitId = this.form.getFieldValue('unitId')
          this.$refs.selectBuyerOrSellerModal.unitId = unitId
        } else {
          const settleDomainId = this.form.getFieldValue('settleDomainId')
          this.$refs.selectBuyerOrSellerModal.settleDomainId = settleDomainId
        }
        this.$refs.selectBuyerOrSellerModal.title = '选择购买方'
        this.$refs.selectBuyerOrSellerModal.pageType = type
        this.$refs.selectBuyerOrSellerModal.isEstimate = Number(this.pageType) === 3 // 是否是预估
        this.$refs.selectBuyerOrSellerModal.show()
      } else if (type === 2) {
        this.$refs.selectBuyerOrSellerModal.title = '选择销售方'
        this.$refs.selectBuyerOrSellerModal.pageType = type
        this.$refs.selectBuyerOrSellerModal.show()
      }
    },
    // 购买方和销售方选择--回调
    buyerOrSellerSelectedModalOk(data) {
      if (Number(data.pageType) === 1) {
        this.buyerSettingDataAssign(2, data)
      } else if (Number(data.pageType) === 2) {
        // 处理审核人数据
        if (data.invoiceCheckerId && data.invoiceChecker) {
          this.checkerResList = [{ id: String(data.invoiceCheckerId), title: data.invoiceChecker }]
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({ auditUserId: String(data.invoiceCheckerId) }, 'auditUserId'))
          })
        } else {
          this.checkerResList = []
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({ auditUserId: undefined }, 'auditUserId'))
          })
        }
        // 组合开票人数据
        if (data.invoicePersonId && data.invoicePerson) {
          const idArr = data.invoicePersonId.split(',')
          const nameArr = data.invoicePerson.split(',')
          const resultData = []
          idArr.forEach((element, index) => {
            const item = {
              id: element,
              name: nameArr[index]
            }
            resultData.push(item)
          })
          this.invoicePersonList = resultData
          // 默认选择第一个开票人
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({ invoiceUser: idArr[0] || undefined }, 'invoiceUser'))
          })
          data.invoiceUser = resultData[0].id || ''
          data.invoiceUserName = resultData[0].name || ''
        } else {
          this.invoicePersonList = []
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({ invoiceUser: undefined }, 'invoiceUser'))
          })
          data.invoiceUser = ''
          data.invoiceUserName = ''
        }
        // 判断是否更改了销售方，如果已更改，删除底部商品明细
        this.checkSellerCompanyChanged(data.company)
        this.sellerSettingDataAssign(data)
      }
    },
    // 购买方配置数据整合
    buyerSettingDataAssign(total, configData) {
      const temp = this.buyerSetting
      this.buyerSetting = {
        total: total, // 购买方配置项
        unitId: temp.unitId,
        unitName: temp.unitName,
        unitNo: temp.unitNo,
        settleDomainId: temp.settleDomainId,
        settleDomainName: temp.settleDomainName,
        settleDomainNo: temp.settleDomainNo,
        headerName: configData.ticketTableHead,
        goodsName: configData.goodsName,
        bankName: configData.bankName,
        bankNo: configData.bankNo,
        taxIdentificationNum: configData.taxpayerIdentificationNo, // 纳税人识别号
        tel: configData.phone, // 电话
        address: configData.addr, // 开票地址
        invKind: configData.invKind // 发票类型
      }
    },
    // 销售方配置数据整合
    sellerSettingDataAssign(configData) {
      this.sellerSetting = {
        companySeller: configData.company, // 公司名称-发票销售方（列表的销售方）
        bankSeller: configData.bank, // 开户行-销售方
        bankNoSeller: configData.bankNo, // 卡号-销售方
        taxNbSeller: configData.taxNb, // 纳税人识别号（同一个纳税人识别号对应一个公司名称）-发票销售方
        telSeller: configData.tel, // 电话-销售方
        addressSeller: configData.address, // 开票地址
        cashier: configData.invoicePayee, // 收款人
        checker: configData.invoiceReviewer, // 复核人
        auditUserId: configData.invoiceCheckerId, // 审核人ID
        auditUser: configData.invoiceChecker, //  审核人
        invoiceUser: configData.invoiceUser || '', // 开票人
        invoiceUserName: configData.invoiceUserName || '' // 开票人姓名
      }
    },
    // 获取结算单列表数据
    loadStatementListData(shouldSelect) {
      this.selectionRows = []
      this.selectedRowKeys = []
      this.loading = true // 加载图标
      getAction(this.url.list, '').then(res => {
        if (Number(res.code) === 200) {
          this.dataSource = res.data || []
          if (shouldSelect) {
            // 是编辑进来的，要将原先的数据选中
            this.filterSettleToSelected()
          }
        } else {
          this.$message.error('获取数据失败！')
        }
        this.loading = false
      })
    },
    // 查找到当前数组中是否有所选结算单，有则选中
    filterSettleToSelected() {
      // 查找到当前数组中是否有所选结算单，有则选中
      const originList = this.detailDataInfo.mlist || []
      const originSettleFormId = originList[0] && originList[0].settleFormId
      const currentList = this.dataSource
      const resultList = currentList.filter(item => {
        return String(item.settleFormId) === String(originSettleFormId || '')
      })
      if (resultList && resultList.length) {
        const record = resultList[0]
        this.selectionRows = [record]
        this.selectedRowKeys = [record.settleFormId] // 点击行选中
      }
    },
    // 结算单表格的选择
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    // 结算单表格点击整行选中
    rowSelect(record) {
      return {
        on: {
          click: () => {
            this.selectionRows = [record]
            this.selectedRowKeys = [record.settleFormId] // 点击行选中
          }
        }
      }
    },
    // 判断是否更改了销售方，如果已更改，删除底部商品明细
    checkSellerCompanyChanged(newCompanyName) {
      // 判断是否更改了销售方，如果已更改，删除底部商品明细
      if (this.sellerSetting.companySeller !== newCompanyName) {
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
        this.totalInvoiceMoney = '' // 金额合计
        this.totalTaxMoney = '' // 税额合计
        // tab 只保留一个，数据源也清空
        this.panes = [{ title: '发票1', closable: false }]
        this.activeKey = '1'
      }
    },
    // 发票明细 Tab切换
    tabChangeCallback(key) {
      this.activeKey = String(key)
    },
    // 点击添加明细Tab
    addDetailTab() {
      // 点击新增明细时，判断购买方时候有发票类型，有的话，新增的明细tab,默认发票类型为购买方配置的发票类型
      let invoiceKind = this.buyerSetting.invKind || '2'
      if (Number(invoiceKind) === 51) {
        // 电子发票不做开票申请（默认普票）
        invoiceKind = '2'
      }
      this.invoiceDetailDataSource.push({
        allTax: '',
        allValue: '',
        invoiceMoney: '',
        taxDeduction: '',
        invoiceType: invoiceKind,
        listed: '1',
        invoiceItemsList: []
      })
      const panes = this.panes
      panes.push({ title: `发票` })
      this.panes = panes
      this.activeKey = String(panes.length)
    },
    onEdit(targetKey, action) {
      this[action](targetKey)
    },
    // 点击删除明细Tab
    remove(targetKey) {
      const activeKey = Number(this.activeKey) === 1 ? 1 : Number(this.activeKey) - 1
      const removeIndex = Number(targetKey) - 1
      this.invoiceDetailDataSource.splice(removeIndex, 1)
      this.panes.splice(removeIndex, 1)
      this.activeKey = String(activeKey)
    },
    // 商品明细列表有更改
    productListChanged(data) {
      this.$set(this.invoiceDetailDataSource, Number(this.activeKey) - 1, data)
      // 结算总合计金额
      let totalInvoiceMoney = 0
      let totalTaxMoney = 0
      this.invoiceDetailDataSource.map(item => {
        totalInvoiceMoney += parseFloat(item.invoiceMoney || '0')
        totalTaxMoney += parseFloat(item.allTax || '0')
      })
      this.totalInvoiceMoney = parseFloat(totalInvoiceMoney).toFixed(2)
      this.totalTaxMoney = parseFloat(totalTaxMoney).toFixed(2)
    },
    // 保存
    handleOk(auditFlag) {
      const that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          // 购买方
          const buyerSetting = that.buyerSetting
          if (!buyerSetting.headerName) {
            that.$message.error('请先完善购买方开票信息配置！')
            return
          }
          // 销售方
          const sellerSetting = that.sellerSetting
          if (
            !sellerSetting.companySeller ||
            !sellerSetting.taxNbSeller ||
            !sellerSetting.bankSeller ||
            !sellerSetting.bankNoSeller ||
            !sellerSetting.auditUser ||
            !sellerSetting.invoiceUser
          ) {
            that.$message.error('请先完善销售方开票信息配置！')
            return
          }
          // 关联结算单(预开票没有结算单)
          if (Number(that.pageType) !== 2 && that.selectionRows.length <= 0) {
            that.$message.error('请关联结算单信息！')
            return
          }
          // 发票明细
          const detailList = that.invoiceDetailDataSource
          for (let i = 0; i < detailList.length; i++) {
            const item = detailList[i]
            if (Array.isArray(item.invoiceItemsList) && item.invoiceItemsList.length <= 0) {
              that.$message.warn(`发票${i + 1}：请添加发票明细！`)
              that.activeKey = String(i + 1)
              return
            }
          }
          // 添加开票备注等信息
          const tinvoiceData = Object.assign(that.buyerSetting, that.sellerSetting)
          tinvoiceData.id = this.detailDataInfo.tinvoice.id || ''
          tinvoiceData.remark = values.remark || ''
          tinvoiceData.auditFlag = auditFlag // 0保存 1提交
          tinvoiceData.allTax = that.totalTaxMoney // 税额
          tinvoiceData.invoiceMoney = that.totalInvoiceMoney // 金额合计（不含税）
          tinvoiceData.invoiceType = Number(that.pageType === 2) ? 1 : 0 // 开票类型(0结算开票/1预开票)
          // 查询开票限额
          that.judgeLimit(tinvoiceData, detailList)
        }
      })
    },
    // 判断是否超出了限额
    judgeLimit(tinvoiceData, detailList) {
      const that = this
      that.confirmLoading = true
      getAction(that.url.limitInfo, { companyName: that.sellerSetting.companySeller }).then(res => {
        if (Number(res.code) === 200) {
          if (res.data) {
            const generalTicketLimit = res.data.generalTicketLimit // 普票限额
            const specialTicketLimit = res.data.specialTicketLimit // 专票限额
            for (let i = 0; i < detailList.length; i++) {
              const item = detailList[i]
              const invoictType = item.invoiceType
              const limit = Number(invoictType) === 2 ? generalTicketLimit : specialTicketLimit
              if (!limit) {
                const tip = Number(invoictType) === 2 ? '普通发票' : '专用发票'
                this.$message.warn(`请先完善 ${tip} 开票限额配置！`)
                this.confirmLoading = false
                return
              }
              // 判断开票金额是否超出限额
              if (parseFloat(item.invoiceMoney) - parseFloat(item.allTax) > parseFloat(limit)) {
                this.$message.error(`发票${i + 1}:开票不含税金额超出了开票限额!(限额:${parseFloat(limit)})`)
                this.confirmLoading = false
                return
              }
            }
            // 调用接口
            that.applyInterfaceCall(tinvoiceData, detailList, that.selectionRows)
          } else {
            this.confirmLoading = false
            this.$message.error('请先完善限额配置！')
          }
        } else {
          this.confirmLoading = false
          this.$message.error('开票限额信息查询失败！')
        }
      })
    },
    // 接口调用 保存/提交/编辑
    applyInterfaceCall(tinvoiceData, detailList, isRes) {
      // 清空每张发票商品id
      for (let i = 0; i < detailList.length; i++) {
        const item = detailList[i]
        item.invoiceItemsList.forEach(item => {
          return delete item.id
        })
      }
      // 处理每张发票备注
      this.$refs.proDetailTableModal.forEach((item, index) => {
        this.$set(detailList[index], `memo`, item.memo || '')
      })
      const requestData = {
        invoiceRecordVos: detailList,
        tinvoice: tinvoiceData
      }
      if (Number(this.pageType) !== 2) {
        // 预开票没有结算单
        requestData.isRes = isRes
      }
      httpAction(this.url.edit, requestData, 'post')
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
.headerNameInput {
  width: 220px;
  border: none;
  cursor: pointer;
}
.headerNameInput:hover {
  border: 1px solid #d9d9d9;
}
</style>
