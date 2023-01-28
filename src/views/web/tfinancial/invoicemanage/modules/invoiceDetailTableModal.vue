<template>
  <div>
    <div class="btnOperateWrap">
      <a-form
        :form="form"
        layout="inline"
        class="ant-disabled-form"
      >
        <a-form-item
          label="发票类型"
          class="stepFormText"
        >
          <a-select
            :disabled="showOnly"
            optionFilterProp="children"
            placeholder="请选择发票类型"
            v-decorator="['invoiceType', {rules: [{ required: true, message: '请选择发票类型！' }],initialValue : invoiceKind}]"
            :dropdownMatchSelectWidth="false"
            style="width: 200px"
            @change="handleChange"
          >
            <a-select-option value="0">专票</a-select-option>
            <a-select-option value="2">普票</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <span>
        <a-button
          type="primary"
          :disabled="listImportBtnDisabled"
          @click="handleOpenList()"
        >清单</a-button>
        <a-button
          type="primary"
          :disabled="deductionBtnDisabled"
          @click="handleOpenDeduction()"
        >差额</a-button>
      </span>
    </div>
    <a-table
      rowKey="id"
      size="middle"
      :bordered="true"
      :pagination="false"
      :columns="invoiceDetailColumns"
      :dataSource="dataList"
      class="invoiceDetailTable"
      :footer="handleFooterShow"
    >
      <span slot="customTitle">
        <a-button
          :disabled="productAddBtnDisabled"
          type="primary"
          shape="circle"
          icon="plus"
          @click="detailTableRowAdd()"
        >
        </a-button>
      </span>
      <template
        slot="money"
        slot-scope="text, record"
      >
        <span v-if="isListImport || showOnly">
          <a-tooltip :title="record.money || '0'">{{ record.money || '0' }}</a-tooltip>
        </span>
        <editable-cell
          v-else
          :key="record.money"
          :text="String(record.money || '0')"
          @change="onCellChange(record.id, 'money', $event)"
        />
      </template>
    </a-table>
    <div class="bottomArea">
      <div class="invoiceNoteContainer">
        <span>发票备注:</span>
        <a-textarea
          :disabled="showOnly"
          auto-size
          :default-value="memo"
          placeholder="请输入备注"
          v-decorator="['memo', {rules: [{ max: 255, message: '255'}]}]"
          style="width: 300px;"
          @input="noteAreaChange"
        />
      </div>
      <div
        v-if="parseFloat(deductionMoney) > 0"
        class="deductionMoneyBox"
      >差额征税：{{ deductionMoney }}</div>
    </div>
    <template>
      <a-modal
        title="输入扣除额"
        :width="600"
        :closable="true"
        :visible="deductionVisible"
        @cancel="handleDeductionCancel"
        :maskClosable="false"
      >
        <template slot="footer">
          <a-button @click="handleDeductionCancel">关闭</a-button>
          <a-button
            type="primary"
            @click="handleDeductionOk()"
          >确定</a-button>
        </template>
        <a-form
          :form="deductionForm"
          layout="inline"
          class="ant-advanced-search-form"
        >
          <a-row>
            <a-col :span="24">
              <a-form-item
                label="扣除额"
                class="stepFormText"
              >
                <a-input-number
                  placeholder="请输入扣除额"
                  :precision="2"
                  v-decorator="['deductionMoney',{rules: [{ required: true, message: '请填写扣除额！'}]}]"
                  style="width: 200px"
                />
                <div style="color:#666">扣除额输入后无法修改</div>
              </a-form-item>

            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    </template>
    <select-product-category-modal
      ref="selectProductCategoryModal"
      @ok="productSelectedModalOk"
    ></select-product-category-modal>
    <invoice-list-import-modal
      ref="invoiceListImportModal"
      @ok="invoiceListImportModalOk"
    ></invoice-list-import-modal>
    <list-view-list-modal ref="listViewListModal"></list-view-list-modal>
  </div>
</template>
<script>
import EditableCell from './EditableCell'
import { RMBChanageChinese } from '@/utils/util'
import SelectProductCategoryModal from './SelectProductCategoryModal'
import InvoiceListImportModal from './InvoiceListImportModal'
import ListViewListModal from './ListViewListModal'

const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    attrs: {}
  }
  if (index === 0 || index === 1) {
    obj.attrs.colSpan = 0
  }
  return obj
}
export default {
  components: {
    EditableCell,
    SelectProductCategoryModal,
    InvoiceListImportModal,
    ListViewListModal
  },
  props: {
    // 销售方名称，用于根据销售方获取商品分类列表
    companySeller: {
      type: String,
      default: '',
      required: false
    },
    // 商品类目表数据源
    invoiceDataSource: {
      type: Object,
      default: () => {},
      required: false
    },
    // 是否仅做展示
    showOnly: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  mounted() {
    const configData = this.invoiceDataSource
    this.handleDataFormatter(configData)
    if (this.showOnly) {
      this.invoiceDetailColumns.splice(0, 1)
      this.deductionBtnDisabled = true // 不可添加差额
      this.listImportBtnDisabled = true // 差额按钮不可点击
    }
  },
  watch: {
    invoiceDataSource(val) {
      this.dataList = val.invoiceItemsList
      this.allTax = val.allTax
      this.invoiceMoney = val.invoiceMoney
      this.handleDataFormatter(val)
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      deductionForm: this.$form.createForm(this),
      dataList: this.invoiceDataSource.invoiceItemsList, // 商品类目数据源
      isListImport: String(this.invoiceDataSource.listed) === '0', // 区分是清单导入的数据还是手动选择添加的数据，默认是手动添加
      deductionMoney: '', // 扣除额
      invoiceKind: this.invoiceDataSource.invoiceType || '2', // 选择的发票类型
      deductionVisible: false, // 控制扣除额显示
      deductionBtnDisabled: true, // 差额按钮是否可操作
      productAddBtnDisabled: false, // 是否可添加商品
      listImportBtnDisabled: false, // 清单导入按钮是否可以操作
      listImportDataSource: [], // 清单导入的数据源
      invoiceMoney: this.invoiceDataSource.invoiceMoney, // 金额合计
      allTax: this.invoiceDataSource.allTax, // 税额合计
      memo:this.invoiceDataSource.memo || '', // 发票备注
      sumColumns: [
        {
          width: 60,
          ellipsis: true,
          dataIndex: 'operation',
          customRender: value => {
            return {children: value,attrs: { colSpan: 2 }}
          }
        },
        {
          width: 180,
          ellipsis: true,
          align: 'center',
          dataIndex: 'goodsName',
          customRender: value => {
            return {children: value,attrs: { colSpan: 4 }}
          }
        },
        {
          width: 80,
          ellipsis: true,
          align: 'center',
          dataIndex: 'model',
          customRender: renderContent
        },
        {
          width: 50,
          ellipsis: true,
          align: 'center',
          dataIndex: 'goodsUnit',
          customRender: renderContent
        },
        {
          width: 50,
          ellipsis: true,
          align: 'center',
          dataIndex: 'prodectNum',
          customRender: renderContent
        },
        {
          width: 80,
          ellipsis: true,
          align: 'center',
          dataIndex: 'price',
          customRender: renderContent
        },
        {
          width: 110,
          ellipsis: true,
          align: 'center',
          dataIndex: 'money'
        },
        {
          width: 50,
          ellipsis: true,
          align: 'center',
          dataIndex: 'taxRate',
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            if (index === 1) {
              obj.attrs.colSpan = 2
            }
            return obj
          }
        },
        {
          width: 100,
          ellipsis: true,
          align: 'center',
          dataIndex: 'taxMoney',
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            if (index === 1) {
              obj.attrs.colSpan = 0
            }
            return obj
          }
        }
      ], // 合计表格列数据
      sumColumnsShow: [
        {
          width: 180,
          ellipsis: true,
          align: 'center',
          dataIndex: 'goodsName'
        },
        {
          width: 80,
          ellipsis: true,
          align: 'center',
          dataIndex: 'model',
          customRender: value => {
            return {children: value,attrs: { colSpan: 4 }}
          }
        },
        {
          width: 50,
          ellipsis: true,
          align: 'center',
          dataIndex: 'goodsUnit',
          customRender: renderContent
        },
        {
          width: 50,
          ellipsis: true,
          align: 'center',
          dataIndex: 'prodectNum',
          customRender: renderContent
        },
        {
          width: 80,
          ellipsis: true,
          align: 'center',
          dataIndex: 'price',
          customRender: renderContent
        },
        {
          width: 110,
          ellipsis: true,
          align: 'center',
          dataIndex: 'money'
        },
        {
          width: 50,
          ellipsis: true,
          align: 'center',
          dataIndex: 'taxRate',
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            if (index === 1) {
              obj.attrs.colSpan = 2
            }
            return obj
          }
        },
        {
          width: 100,
          ellipsis: true,
          align: 'center',
          dataIndex: 'taxMoney',
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            if (index === 1) {
              obj.attrs.colSpan = 0
            }
            return obj
          }
        }
      ], // 详情合计表格列数据
      invoiceDetailColumns: [
        {
          width: 60,
          ellipsis: true,
          dataIndex: 'operation',
          slots: { title: 'customTitle' },
          customRender: (text, record) => {
            const isSumList = text ? true : false
            return isSumList ? text : <a-icon type="minus-circle" onClick={() => this.productRowDelete(record)} />
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '货物或应税劳务、服务名称',
          align: 'center',
          dataIndex: 'goodsName',
          customRender: (text, record) => {
            if (Number(record.isListImport) === 1) {
              return <a onClick={() => this.listViewClick()}>{record.goodsName}</a>
            } else {
              const goodsName = record.goodsName ? `*${record.goodsName}` : ''
              const productName = record.productName ? `*${record.productName}` : ''
              const resultText = `${goodsName}${productName}` || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          }
        },
        {
          width: 80,
          ellipsis: true,
          title: '规格型号',
          align: 'center',
          dataIndex: 'model',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 50,
          ellipsis: true,
          title: '单位',
          align: 'center',
          dataIndex: 'goodsUnit',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 50,
          ellipsis: true,
          title: '数量',
          align: 'center',
          dataIndex: 'prodectNum',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 80,
          ellipsis: true,
          title: '单价',
          align: 'center',
          dataIndex: 'price',
          customRender: text => {
            const resultText = text || '0'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 110,
          ellipsis: true,
          title: '金额（含税）',
          align: 'center',
          dataIndex: 'money',
          scopedSlots: { customRender: 'money' }
        },
        {
          width: 50,
          ellipsis: true,
          title: '税率',
          align: 'center',
          dataIndex: 'taxRate',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 100,
          ellipsis: true,
          title: '税额',
          align: 'center',
          dataIndex: 'taxMoney',
          customRender: text => {
            const resultText = text || '0'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        }
      ] // 商品类目详情列数据
    }
  },
  methods: {
    // 判断数据整理显示数据格式
    handleDataFormatter(configData) {
      if (String(configData.listed) === '0') {
        this.isListImport = true
        // 清单导入,差额修改按钮不可点击
        this.deductionMoney = 0
        this.deductionBtnDisabled = true // 不可添加差额
        this.productAddBtnDisabled = true // 不可添加商品
        const tempList = [
          {
            id: 100,
            isListImport: 1,
            operation: '',
            goodsName: '查看=>清单列表',
            model: ' ',
            goodsUnit: ' ',
            prodectNum: ' ',
            price: ' ',
            money: configData.invoiceMoney,
            taxRate: ' ',
            taxMoney: configData.allTax
          }
        ]
        this.dataList = tempList
        this.listImportDataSource = configData.invoiceItemsList
      } else {
        this.isListImport = false
        this.dataList = configData.invoiceItemsList || []
        // 当商品列表中选择了数据后，清单导入按钮不可点击
        if (this.dataList.length) {
          this.listImportBtnDisabled = true
        }

        if (this.dataList.length >= 8) {
          this.productAddBtnDisabled = true // 不可添加商品
        }

        // 如果已经添加了差额征税，差额按钮不可点击,不可在添加商品
        this.deductionMoney = configData.taxDeduction
        if (parseFloat(this.deductionMoney) > 0) {
          // this.deductionBtnDisabled = true
          this.productAddBtnDisabled = true
        } else {
          // 没添加过差额，判断列表数据数量
          this.deductionBtnDisabled = this.dataList.length !== 1
          this.productAddBtnDisabled = this.dataList.length >= 8
        }
      }
    },
    // 商品类目合计footer视图
    handleFooterShow() {
      return (
        <a-table
          rowKey={Math.random}
          bordered={false}
          pagination={false}
          columns={this.showOnly ? this.sumColumnsShow : this.sumColumns}
          dataSource={
            this.showOnly
              ? [
                  {
                    goodsName: '合计',
                    model: '',
                    money: this.invoiceMoney,
                    taxRate: '',
                    taxMoney: this.allTax
                  },
                  {
                    goodsName: '价税合计（大写）',
                    model: RMBChanageChinese(parseFloat(this.invoiceMoney)),
                    money: '(小写)',
                    taxRate: this.invoiceMoney,
                    taxMoney: ''
                  }
                ]
              : [
                  {
                    operation: '合计',
                    goodsName: '',
                    taxRate: '',
                    money: this.invoiceMoney,
                    taxMoney: this.allTax
                  },
                  {
                    operation: '价税合计（大写）',
                    goodsName: RMBChanageChinese(parseFloat(this.invoiceMoney)),
                    money: '(小写)',
                    taxRate: this.invoiceMoney,
                    taxMoney: ''
                  }
                ]
          }
          showHeader={false}
        ></a-table>
      )
    },
    // 选择发票类型
    handleChange(value) {
      this.invoiceKind = String(value || '')
      // 通知父视图商品有更改
      this.handleResultData()
    },
    // 点击明细列表的添加商品类目
    detailTableRowAdd() {
      // 判断是否选择了销售方且销售方id存在
      if (!this.companySeller) {
        this.$message.warning('请先选择销售方配置！')
        return
      }
      if (this.dataList.length < 8) {
        this.$refs.selectProductCategoryModal.title = '选择商品类目'
        this.$refs.selectProductCategoryModal.companySeller = this.companySeller
        this.$refs.selectProductCategoryModal.show(1)
      } else {
        this.$message.warning('发票明细最多允许添加8条！')
      }
    },
    // 商品类目选择回调
    productSelectedModalOk(data, type) {
      if (Number(type) === 1) {
        this.handleProductCallback(data)
      }
    },
    // 处理商品类目选择回调
    handleProductCallback(data) {
      const productData = {
        id: data.id, // id -self
        goodsName: data.goodsName || '', // 商品分类汇总名称
        cropGoodsNo: data.goodsTaxNo, // 企业自编码，可传人税收分类编码
        discountAmountItems: '0', // 折扣金额
        discountVatItems: '0', // 折扣税额
        goodsNoVer: data.version, // 编码表版本号
        goodsTaxNo: data.goodsTaxNo, //商品明细(invoiceItems)：企业自编码，可传人税收分类编码
        includeTax: String(data.taxMark) === 'False' ? 0 : 1, // 1含税金额和单价；0不含税金额和单价(默认)
        money: data.money, // 含税金额（选择data.money 导入0）
        price: data.price, // 单价
        prodectNum: data.prodectNum || '0', // 商品数量，如果有商品数量、单价和计量单位不能为空
        productName: data.productName, // 商品名称
        productSpec: data.model || '', // 商品规格
        productUnit: data.goodsUnit, // 商品单位
        taxMoney: '0', // 税额
        taxDeduction: '0', // 扣除额(单条有)
        taxPre: String(data.favouredPolicy) === '是' ? 1 : 0, // 是否享受税收优惠政策0：不享受，1：享受
        taxPreCon: ' ', // 享受税收优惠政策内容，如果享受优惠政策必填
        taxRate: data.tax, // 税率
        value: '0', // 金额(不含税)选择0 导入清单的金额）
        zeroTax: '' // 零税率标识空：非零税率，0：出口退税，1：免税，2：不征收，3 普通零税率
      }
      const index = this.dataList.findIndex(item => String(item.id) === String(productData.id))
      if (index > -1) {
        this.$set(this.dataList, index, productData)
      } else {
        this.dataList.push(productData)
      }
      // 当商品列表中选择了数据后，清单导入按钮不可点击
      if (this.dataList.length) {
        this.listImportBtnDisabled = true
      }
      // 当商品列表中只有一件商品时，可添加差额
      if (this.dataList.length === 1) {
        this.deductionBtnDisabled = false
      } else {
        this.deductionMoney = 0
        this.deductionBtnDisabled = true
      }
      // 计算开票合计
      this.invoiceMoney = this.calulateSumMoney('money')
      this.allTax = this.calulateSumMoney('taxMoney')
      // 通知父视图商品有更改
      this.handleResultData()
    },
    // 点击删除一行商品类目
    productRowDelete(record) {
      const dataSource = [...this.dataList]
      this.dataList = dataSource.filter(item => item.id !== record.id)
      // 如果删除了有差额的那条商品数据，则可以继续添加商品/当商品列表清空后，清单导入按钮点亮
      if (this.dataList.length <= 0) {
        this.productAddBtnDisabled = false
        this.listImportBtnDisabled = false
        this.deductionMoney = 0
        this.isListImport = false
        this.listImportDataSource = []
        this.invoiceMoney = ''
        this.allTax = ''
      } else {
        // 计算合计金额
        this.invoiceMoney = (parseFloat(this.invoiceMoney) - parseFloat(record.money || 0)).toFixed(2)
        this.allTax = (parseFloat(this.allTax) - parseFloat(record.taxMoney || 0)).toFixed(2)
      }
      // 当商品列表中只有一件商品时，可添加差额
      if (this.dataList.length === 1) {
        this.deductionBtnDisabled = false
      } else {
        this.deductionBtnDisabled = true
      }
      // 通知父视图商品有更改
      this.handleResultData()
    },
    // 编辑单元格
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataList]
      const index = dataSource.findIndex(item => item.id === key)
      // 改变数据源指定位置的金额
      this.$set(this.dataList[index], `money`, value)
      //修改税额  税额 = （金额（含税）- 扣除额） / (1+税率）* 税率
      const money = parseFloat(value) || 0
      const taxRate = parseFloat(this.dataList[index].taxRate) || 0
      const deductionMoney = parseFloat(this.deductionMoney) || 0
      let resultText = ((money - deductionMoney) / (1 + taxRate)) * taxRate
      resultText = resultText.toFixed(2) || '0'
      this.$set(this.dataList[index], `taxMoney`, resultText)
      // 计算开票合计
      this.invoiceMoney = this.calulateSumMoney('money')
      this.allTax = this.calulateSumMoney('taxMoney')
      // 通知父视图商品有更改
      this.handleResultData()
    },
    // 计算合计开票金额
    calulateSumMoney(sumKey) {
      const dataList = this.isListImport ? this.listImportDataSource : this.dataList
      let sum = 0
      dataList.map(item => {
        sum += parseFloat(item[sumKey] || '0')
      })
      return sum.toFixed(2)
    },
    // 点击弹出清单导入页面
    handleOpenList() {
      this.$refs.invoiceListImportModal.title = '发票清单导入'
      this.$refs.invoiceListImportModal.show()
    },
    // 弹出清单导入页面确认调入回调
    invoiceListImportModalOk(dataList) {
      // 清单导入后,不可以再添加商品,不可以添加差额
      this.deductionMoney = 0
      this.productAddBtnDisabled = true
      this.deductionBtnDisabled = true
      this.isListImport = true
      this.listImportDataSource = dataList
      // 计算开票合计
      // 总计不含税金额 + 总计不含税 税额 = 总计含税金额
      const sumMoney = this.calulateSumMoney('value')
      const sumTaxMoney = this.calulateSumMoney('taxMoney')
      const SUM = parseFloat(sumMoney) + parseFloat(sumTaxMoney)
      this.invoiceMoney = SUM.toFixed(2)
      this.allTax = parseFloat(sumTaxMoney).toFixed(2)
      // 导入后，组装一条显示数据
      const tempList = [
        {
          id: 100,
          isListImport: 1,
          operation: '',
          goodsName: '查看=>清单列表',
          model: ' ',
          goodsUnit: ' ',
          prodectNum: ' ',
          price: ' ',
          money: SUM.toFixed(2),
          taxRate: ' ',
          taxMoney: sumTaxMoney
        }
      ]
      this.dataList = tempList
      // 通知父视图商品有更改
      this.handleResultData()
    },
    // 点击查看清单列表
    listViewClick() {
      this.$refs.listViewListModal.title = '清单列表预览'
      this.$refs.listViewListModal.dataSource = this.listImportDataSource
      this.$refs.listViewListModal.show()
    },
    // 点击弹出差额
    handleOpenDeduction() {
      // 先判断明细里的数据金额是否为0，如果为0，提示-不允许添加差额
      const productData = this.dataList[0]
      if (parseFloat(productData.money || 0) <= 0) {
        this.$message.warn('请先添加商品含税金额！')
        return
      }
      this.deductionVisible = true
    },
    // 扣除额弹出层
    handleDeductionCancel() {
      this.deductionForm.resetFields()
      this.deductionVisible = false
    },
    // 扣除额输入回调
    handleDeductionOk() {
      // 触发表单验证
      const that = this
      this.deductionForm.validateFields((err, values) => {
        if (!err) {
          if (parseFloat(values.deductionMoney || 0) <= 0) {
            that.$message.error('添加的差额应大于0！')
            return
          }
          // 先判断输入的金额是否超出了商品金额（差额不能大于商品含税金额）
          const productData = this.dataList[0]
          if (parseFloat(values.deductionMoney || 0) > parseFloat(productData.money || 0)) {
            that.$message.error('添加的差额不能大于商品含税金额！')
            return
          }
          that.deductionMoney = values.deductionMoney
          // 添加差额后，不可在添加商品
          that.productAddBtnDisabled = true
          // 添加差额后，重新计算商品税额
          const dataList = that.isListImport ? that.listImportDataSource : that.dataList
          const item = dataList[0]
          //修改税额  税额 = （金额（含税）- 扣除额） / (1+税率）* 税率
          const money = parseFloat(item.money) || 0
          const taxRate = parseFloat(item.taxRate) || 0
          const deductionMoney = parseFloat(that.deductionMoney) || 0
          let resultText = ((money - deductionMoney) / (1 + taxRate)) * taxRate
          resultText = resultText.toFixed(2) || '0'
          this.$set(this.dataList[0], `taxMoney`, resultText)
          // 计算开票税额合计
          that.allTax = this.calulateSumMoney('taxMoney')
          that.handleDeductionCancel()
          // 通知父视图商品有更改
          that.handleResultData()
        }
      })
    },
    // 发票备注改变
    noteAreaChange(e){
      const value = e.target.value || ''
      this.memo = value
    },
    // 通知父视图商品有更改
    handleResultData() {
      const detailList = this.isListImport ? this.listImportDataSource : this.dataList
      const totalTax = this.allTax || '0'
      const totalInvoiceMoney = this.invoiceMoney || '0'
      const totalNoTax = String(parseFloat(totalInvoiceMoney) - parseFloat(totalTax).toFixed(2))
      const object = {
        allTax: totalTax,
        allValue: totalNoTax,
        invoiceMoney: totalInvoiceMoney,
        invoiceType: String(this.invoiceKind) || '2',
        listed: this.isListImport ? '0' : '1',
        taxDeduction: this.deductionMoney,
        invoiceItemsList: detailList
      }
      // 通知父视图商品有更改
      this.$emit('change', object)
    }
  }
}
</script>
<style lang="less" scoped>
.btnOperateWrap {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-bottom: 10px;
  .ant-btn {
    margin-left: 8px;
  }
}
.bottomArea {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  .invoiceNoteContainer {
    display: flex;
    align-items: baseline;
    margin-top: 10px;
    span{
      color: #666;
      margin-right: 10px;
    }
  }
}
.invoiceDetailTable {
  :global(.ant-table-tbody tr td:first-child) {
    text-align: center;
  }
  :global(.ant-table-thead tr th:first-child) {
    text-align: center;
  }
}
.deductionMoneyBox {
  text-align: right;
  margin-top: 10px;
  color: #666;
}
</style>
