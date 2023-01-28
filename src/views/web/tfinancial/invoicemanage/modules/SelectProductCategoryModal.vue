<template>
  <a-modal
    :title="title"
    :width="1000"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
    :destroyOnClose="true"
  >
    <div
      style="margin-bottom:20px;"
      v-if="Number(type) === 1"
    >
      <a-input-search
        allowClear
        placeholder="请输入名称检索"
        style="width: 260px"
        @search="onSearch"
        @change="inputChange"
      />
    </div>
    <div v-else-if="Number(type) === 2" class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="8"
            :sm="8"
          >
            <a-form-item
              label="客户名称"
              class="stepFormText"
            >
              <a-input
                allowClear
                placeholder="请输入客户名称"
                v-model="queryParam.unitName"
                style="width: 200px"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="8"
            :sm="8"
          >
            <a-form-item
              label="结算主体"
              class="stepFormText"
            >
              <a-input
                allowClear
                placeholder="请输入结算主体名称"
                v-model="queryParam.settleDomainName"
                style="width: 200px"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="8"
              :sm="8"
            >
              <a-form-item
                label="销售方名称"
                class="stepFormText"
              >
                <a-input
                  allowClear
                  placeholder="请输入销售方名称"
                  v-model="queryParam.companySeller"
                  style="width: 200px"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="8"
              :sm="8"
            >
              <a-form-item
                label="发票类型"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择发票类型"
                  v-model="queryParam.invKind"
                  :dropdownMatchSelectWidth="false"
                  style="width: 200px"
                >
                  <a-select-option
                    v-for="(value, key) in invKindOptions"
                    :key="key"
                    :value="key"
                  >{{ value }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col
            :md="8"
            :sm="8"
          >
            <span
              style="float: left;overflow: hidden;"
              class="table-page-search-submitButtons"
            >
              <a-button
                type="primary"
                @click="searchQuery"
                icon="search"
              >查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
              <a
                @click="handleToggleSearch"
                style="margin-left: 8px"
              >
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!--列表-->
    <a-table
      rowKey="id"
      size="middle"
      :scroll="{x: 1}"
      :loading="loading"
      :bordered="true"
      :columns="(Number(type) === 1)?columns:invoiceColumns"
      :customRow="rowSelect"
      :dataSource="dataSource"
      :pagination="ipagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio',fixed:true}"
      @change="handleTableChange"
    >
    </a-table>
  </a-modal>
</template>
<script>
import { getAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
export default {
  data() {
    return {
      title: '操作',
      visible: false,
      loading: false,
      type: 1, // 区分商品类目选择还是复制开票的选择，默认1:商品类目选择
      isEstimate:false, // 开票复制进来时，用于区分想要申请的开票类型，判断如果是普通开票申请，选中了预估的发票(没有结算主体)提示不可行
      companySeller: '', // 销售方公司,根据获取改公司下的商品配置列表
      settleDomainId:'', // 薪资等其他入口进入的发票复制，指定结算主体下的发票
      unitId:'', // 预估结算其他入口进入的发票复制，指定结算主体下的发票
      form: this.$form.createForm(this),
      selectedRowKeys: [],
      selectionRows: [],
      searchValue: '', // 搜索查询的条件
      canSelect: true, // 防止重复点击行选中
      queryParam: {}, // 查询参数
      toggleSearchStatus: false,
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showSizeChanger: true,
        total: 0
      },
      dataSource: [], // 列表数据源
      invoiceTypeOptions: { '0': '结算开票', '1': '预开票' }, // 开票类型
      invKindOptions: { '0': '专用发票', '2': '普通发票', '51': '电子发票' }, // 发票类型
      columns: [
        {
          width: 250,
          ellipsis: true,
          title: '商品和服务分类简称',
          align: 'center',
          dataIndex: 'goodsName',
          customRender: (text, record) => {
            const goodsName = record.goodsName ? `*${record.goodsName}` : ''
            const productName = record.productName ? `*${record.productName}` : ''
            const resultText = `${goodsName}${productName}` || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '名称',
          align: 'center',
          dataIndex: 'productName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          title: '规格型号',
          align: 'center',
          dataIndex: 'model',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 90,
          title: '单位',
          align: 'center',
          dataIndex: 'goodsUnit',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          title: '单价',
          align: 'center',
          dataIndex: 'price',
          customRender: text => {
            const resultText = text || '0'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 80,
          ellipsis: true,
          title: '税率',
          align: 'center',
          dataIndex: 'tax',
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
        },
        {
          width: 120,
          ellipsis: true,
          title: '税收分类编码',
          align: 'center',
          dataIndex: 'goodsTaxNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '税收分类名称',
          align: 'center',
          dataIndex: 'goodsTaxName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        }
      ],
      invoiceColumns: [
        {
          width: 90,
          ellipsis: true,
          title: '发票类型',
          align: 'center',
          dataIndex: 'invKind',
          customRender: text => {
            const resultText = this.invKindOptions[String(text)] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '客户名称',
          align: 'center',
          dataIndex: 'unitName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleDomainName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '销售方名称',
          align: 'center',
          dataIndex: 'companySeller',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 100,
          ellipsis: true,
          title: '开票金额',
          align: 'center',
          dataIndex: 'invoiceMoney',
          customRender: text => {
            const resultText = text === 0 ? text : text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '开票类型',
          align: 'center',
          dataIndex: 'invoiceType',
          customRender: text => {
            const tipTitle = this.invoiceTypeOptions[String(text)] || '-'
            return <a-tooltip title={tipTitle}>{tipTitle}</a-tooltip>
          }
        },
        {
          width: 170,
          ellipsis: true,
          title: '申请时间',
          align: 'center',
          dataIndex: 'applyDate',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        }
      ],
      url: {
        list: '/salary/tgoodstaxnoset/page', // 商品类目类表
        invoiceList: '/salary/tinvoice/getOneClickCopyPage' // 开票申请-一键复制列表接口
      }
    }
  },
  methods: {
    show(type) {
      this.type = type
      this.visible = true
      if (Number(this.type) === 1) {
        // 获取商品类目列表数据
        this.loadListData()
      } else if (Number(this.type) === 2) {
        // 获取复制发票选择列表
        this.loadInvoiceList(1)
      }
    },
    // 薪资等其他入口进入的发票复制，指定结算主体下的发票
    showWithSettleId(settleDomainId){
      this.type = 2
      this.settleDomainId = settleDomainId
      this.visible = true
      // 获取复制发票选择列表
      this.loadInvoiceList(1)
    },
    // 预估结算等其他入口进入的发票复制，指定结算主体下的发票
    showWithUnitId(unitId){
      this.type = 2
      this.unitId = unitId
      this.visible = true
      // 获取复制发票选择列表
      this.loadInvoiceList(1)
    },
    // 关闭
    handleCancel() {
      this.visible = false
      this.selectedRowKeys = []
      this.selectionRows = []
      this.ipagination.current = 1
      this.isEstimate = false
      this.queryParam = {}
      this.settleDomainId = ''
    },
    // 获取商品类目列表数据
    loadListData() {
      const param = {
        current: this.ipagination.current,
        size: this.ipagination.pageSize,
        companyName: this.companySeller
      }
      if (this.searchValue) {
        Object.assign(param, { productName: this.searchValue })
      }
      const that = this
      that.loading = true
      getAction(this.url.list, param).then(res => {
        if (Number(res.code) === 200) {
          that.dataSource = res.data.records
          that.ipagination.current = res.data.current
          that.ipagination.total = res.data.total
        } else {
          that.ipagination.total = 0
          that.$message.error('获取数据失败！')
        }
        that.loading = false
      })
    },
    // 获取复制发票选择列表
    loadInvoiceList(currentPage) {
      if (currentPage === 1) {
        this.ipagination.current = 1
      }
      const param = this.getQueryParams()
      // 薪资等其他入口进入的发票复制，指定结算主体、客户单位下的发票
      if(this.isEstimate){
        if(this.unitId){
          param.unitId = this.unitId || ''
        }
      }else{
        if(this.settleDomainId){
          param.settleDomainId = this.settleDomainId || ''
        }
      }
      const that = this
      that.loading = true
      getAction(this.url.invoiceList, param).then(res => {
        if (Number(res.code) === 200) {
          that.dataSource = res.data.records
          that.ipagination.current = res.data.current
          that.ipagination.total = res.data.total
        } else {
          that.ipagination.total = 0
          that.$message.error('获取数据失败！')
        }
        that.loading = false
      })
    },
    //分页、排序、筛选变化时触发
    handleTableChange(pagination) {
      this.ipagination = pagination
      if (Number(this.type) === 1) {
        // 获取商品类目列表数据
        this.loadListData()
      } else if (Number(this.type) === 2) {
        // 获取复制发票选择列表
        this.loadInvoiceList()
      }
    },
    // 搜索
    onSearch() {
      this.ipagination.current = 1
      this.loadListData()
    },
    inputChange(e) {
      const value = e.target.value
      this.searchValue = value
      if (!value) {
        // 点击叉号清空时
        this.ipagination.current = 1
        this.loadListData()
      }
    },
    // 点击按钮选中
    onSelectChange(selectedRowKeys, selectionRows) {
      if (this.canSelect) {
        this.canSelect = false
        const record = selectionRows[0]
        const pass = this.discriminateInvkind(record)
        if(pass){
          this.selectedRowKeys = selectedRowKeys
          this.selectionRows = selectionRows
          this.$emit('ok', record, this.type)
          this.handleCancel()
        }else {
          this.$message.warn('预估类型的发票无结算主体信息,请选择其他类型发票！')
        }
        setTimeout(() => {
          this.canSelect = true
        }, 2000)
      }
    },
    // 点击整行选中
    rowSelect(record) {
      return {
        on: {
          click: () => {
            if (this.canSelect) {
              this.canSelect = false
              const pass = this.discriminateInvkind(record)
              if(pass){
                this.selectionRows = [record]
                this.selectedRowKeys = [record.id] // 点击行选中
                this.$emit('ok', record, this.type)
                this.handleCancel()
              }else {
                this.$message.warn('预估类型的发票无结算主体信息,请选择其他类型发票！')
              }
              setTimeout(() => {
                this.canSelect = true
              }, 2000)
            }
          }
        }
      }
    },
    discriminateInvkind(record){
      if(Number(this.type) === 2 && !this.isEstimate){
        // 复制发票进来的，且是从 非预估开票进来的,判断控制不可选择预估的开票申请
        if(!record.settleDomainName){
          return false
        }
      }
      return true
    },
    // 查询条件区域的展开折叠
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus
    },
    // 点击查询按钮
    searchQuery() {
      this.loadInvoiceList(1)
    },
    // 点击重置
    searchReset() {
      this.queryParam = {}
      this.loadInvoiceList(1)
    },
    // 获取查询参数
    getQueryParams() {
      //获取查询条件
      const param = Object.assign({}, this.queryParam)
      param.current = this.ipagination.current
      param.size = this.ipagination.pageSize
      return filterObj(param)
    },
  }
}
</script>
<style scoped>
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px;
}
</style>
