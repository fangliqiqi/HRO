<template>
  <div>
    <a-tabs
      :bordered="false"
      style="background:#fff;padding:15px;"
      @change="callback"
    >
      <a-tab-pane
        key="1"
        tab="待开票"
      >
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col
                :md="6"
                :sm="8"
              >
                <a-form-item label="销售方">
                  <a-input
                    allowClear
                    placeholder="请输入销售方"
                    v-model="queryParam.companySeller"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col
                :md="6"
                :sm="8"
              >
                <a-form-item label="购买方">
                  <a-input
                    allowClear
                    placeholder="请输入购买方"
                    v-model="queryParam.headerName"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col
                :md="6"
                :sm="8"
              >
                <a-form-item label="开票金额">
                  <a-input-number
                    placeholder="请输入开票金额"
                    v-model="queryParam.invoiceMoney"
                    :precision="2"
                    style="width:100%"
                  />
                </a-form-item>
              </a-col>
              <a-col
                :md="6"
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
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div>
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :scroll="{x: 1}"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <span
              slot="action"
              slot-scope="text, record"
            >
              <a @click="handleOutInvoice(record)">出票</a>
            </span>
          </a-table>
        </div>
      </a-tab-pane>
      <a-tab-pane
        key="2"
        tab="已开票"
      >
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col
                :md="6"
                :sm="8"
              >
                <a-form-item label="发票号">
                  <a-input
                    allowClear
                    placeholder="请输入发票号"
                    v-model="queryParamVoice.fphm"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col
                :md="6"
                :sm="8"
              >
                <a-form-item label="开票人">
                  <a-input
                    allowClear
                    placeholder="请输入开票人"
                    v-model="queryParamVoice.issuer"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col
                :md="6"
                :sm="8"
              >
                <a-form-item label="销售方">
                  <a-input
                    allowClear
                    placeholder="请输入销售方"
                    v-model="queryParamVoice.sellerName"
                  ></a-input>
                </a-form-item>
              </a-col>
              <template v-if="toggleSearchStatus">
                <a-col
                  :md="6"
                  :sm="8"
                >
                  <a-form-item label="购买方">
                    <a-input
                      allowClear
                      placeholder="请输入购买方"
                      v-model="queryParamVoice.customerName"
                    ></a-input>
                  </a-form-item>
                </a-col>
                <a-col
                  :md="6"
                  :sm="8"
                >
                  <a-form-item label="开票金额">
                    <a-input-number
                      placeholder="请输入开票金额"
                      v-model="queryParamVoice.invoiceMoney"
                      :precision="2"
                      style="width:100%"
                    />
                  </a-form-item>
                </a-col>
              </template>
              <a-col
                :md="6"
                :sm="8"
              >
                <span
                  style="float: left;overflow: hidden;"
                  class="table-page-search-submitButtons"
                >
                  <a-button
                    type="primary"
                    @click="searchQueryVoice"
                    icon="search"
                  >查询</a-button>
                  <a-button
                    type="primary"
                    @click="searchResetVoice"
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
        <div>
          <a-table
            ref="table"
            size="middle"
            :scroll="{x: 1}"
            bordered
            rowKey="id"
            :columns="columnsVoice"
            :dataSource="dataSourceVoice"
            :pagination="ipaginationVoice"
            :loading="loadingVoice"
            @change="handleTableChangeVoice"
          >
            <span
              slot="actionInvoice"
              slot-scope="text, record"
            >
              <a @click="handleDetail(record)">详情</a>
              <template v-if="Number(record.status) !== 1">
                <a-divider
                  type="vertical"
                  v-has="'wxhr:tinvoice_doRepeatPrint'"
                />
                <a
                  @click="handleOpen(record)"
                  v-has="'wxhr:tinvoice_doRepeatPrint'"
                >重新开票</a>
                <a-divider
                  type="vertical"
                  v-has="'wxhr:tinvoice_doPrint'"
                />
                <a
                  v-has="'wxhr:tinvoice_doPrint'"
                  @click="handlePrint(record)"
                >打印发票</a>
              </template>
            </span>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
    <invoice-record-detail-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></invoice-record-detail-modal>
    <invoice-audit-modal
      ref="detailModalForm"
      @ok="modalFormOk"
    ></invoice-audit-modal>
    <re-open-invoice-modal
      ref="ReOpenInvoiceModalForm"
      @ok="modalFormOk"
    ></re-open-invoice-modal>
  </div>

</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, httpAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
import InvoiceRecordDetailModal from './modules/InvoiceRecordDetailModal'
import InvoiceAuditModal from './modules/InvoiceAuditModal'
import ReOpenInvoiceModal from './modules/ReOpenInvoiceModal'

export default {
  name: 'InvoiceManageFinancialIssues',
  components: {
    InvoiceRecordDetailModal,
    InvoiceAuditModal,
    ReOpenInvoiceModal
  },
  mixins: [JeecgListMixin],
  data() {
    return {
      loadingVoice: false,
      queryParamVoice: {},
      toggleSearchStatus: false, // 已开票查询区域的折叠展开控制
      ipaginationVoice: {
        current: 1,
        pageSize: 10,
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        }
      },
      invoiceTypeOption: { '0': '结算开票', '1': '预开票' },
      invoiceKindOption: { '0': '专票', '2': '普票' },
      auditFlagOptions: {
        '0': { option: '待提交', color: 'blue' },
        '1': { option: '待审核', color: 'orange' },
        '2': { option: '待开票', color: 'purple' },
        '3': { option: '财务退回', color: 'red' },
        '4': { option: '已开票', color: 'green' },
        '5': { option: '已作废', color: 'pink' },
        '6': { option: '部分开票', color: 'orange' }
      }, // 审核状态
      columns: [
        {
          width: 110,
          ellipsis: true,
          title: '申请状态',
          align: 'center',
          dataIndex: 'auditFlag',
          customRender: text => {
            const optionItem = this.auditFlagOptions[String(text)] || '-'
            return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
          }
        },
        {
          ellipsis: true,
          width: 120,
          title: '开票金额',
          align: 'center',
          dataIndex: 'invoiceMoney',
          scopedSlots: { customRender: 'invoiceMoney' },
          customRender: text => {
            const resultText = text || '0'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width: 120,
          title: '开票类型',
          align: 'center',
          dataIndex: 'invoiceType',
          customRender: text => {
            const type = this.invoiceTypeOption[text] || '-'
            return <a-tooltip title={type}>{type}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width: 150,
          title: '购买方',
          align: 'center',
          dataIndex: 'headerName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width: 150,
          title: '销售方',
          align: 'center',
          dataIndex: 'companySeller',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width: 150,
          title: '商品名称',
          align: 'center',
          dataIndex: 'goodsName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width: 150,
          title: '税收分类编码',
          align: 'center',
          dataIndex: 'classCode',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width: 150,
          title: '税率',
          align: 'center',
          dataIndex: 'goodsTaxRate',
          customRender: text => {
            const resultText = text || (String(text) === '0' ? '0' : '-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width: 150,
          title: '扣除额',
          align: 'center',
          dataIndex: 'taxDeduction',
          customRender: text => {
            const resultText = text || (String(text) === '0' ? '0' : '-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width: 150,
          title: '申请人员',
          align: 'center',
          dataIndex: 'createUserName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width: 170,
          title: '申请时间',
          align: 'center',
          dataIndex: 'applyDate',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width: 120,
          title: '操作',
          key: 'operations',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columnsVoice: [
        {
          width: 140,
          ellipsis: true,
          title: '发票号',
          align: 'center',
          dataIndex: 'fphm',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '开票金额',
          align: 'center',
          dataIndex: 'invoiceMoney',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '发票类型',
          align: 'center',
          dataIndex: 'invoiceType',
          customRender: text => {
            const type = this.invoiceKindOption[text] || '-'
            return <a-tooltip title={type}>{type}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '购买方',
          align: 'center',
          dataIndex: 'customerName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '销售方',
          align: 'center',
          dataIndex: 'sellerName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '申请人',
          align: 'center',
          dataIndex: 'createUserName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 170,
          ellipsis: true,
          title: '开票日期',
          align: 'center',
          dataIndex: 'invoiceDate',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width: 195,
          title: '操作',
          key: 'operations',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'actionInvoice' }
        }
      ],
      dataSourceVoice: [],
      url: {
        list: 'salary/tinvoice/getWillInvoicedPage', // 代开票
        getList: 'salary/tinvoicerecord/pageOfIssued', // 已开票
        queryAllInfoById: 'salary/tinvoice/openTInvoiceAssoById?id=' // 详情
      }
    }
  },
  methods: {
    callback(key) {
      if (key === '2') {
        this.loadDataVoice(this.ipaginationVoice.current)
      }
    },
    getValue(val) {
      return val || ''
    },
    handleOutInvoice(record) {
      this.$refs.modalForm.outBtn = true
      this.$refs.modalForm.title = '出票'
      this.$refs.modalForm.previewIsCanModify = true
      this.$refs.modalForm.show(record)
    },
    handlePrint(record) {
      this.$refs.modalForm.printBtn = true
      this.$refs.modalForm.title = '发票打印'
      this.$refs.modalForm.previewIsCanModify = false
      this.$refs.modalForm.showSingleInvoice(record)
    },
    handleOpen(record) {
      this.$refs.ReOpenInvoiceModalForm.show(record)
    },
    handleDetail(record) {
      httpAction(this.url.queryAllInfoById + record.invoiceApplyId, null, 'get').then(res => {
        if (res.code === 200) {
          this.$refs.detailModalForm.isAudit = false
          this.$refs.detailModalForm.title = '开票详情'
          this.$refs.detailModalForm.show(res.data)
        } else {
          this.$message.warn(res.msg || '详情获取失败！')
        }
      })
    },

    searchQueryVoice() {
      this.loadDataVoice(1)
    },
    searchResetVoice() {
      this.queryParamVoice = {}
      this.$router.push({
        query: {}
      })
      this.loadDataVoice(1)
    },
    handleTableChangeVoice(pagination) {
      this.ipaginationVoice = pagination
      this.loadDataVoice()
    },
    getParams() {
      //获取查询条件
      const param = Object.assign({}, this.queryParamVoice)
      param.current = this.ipaginationVoice.current
      param.size = this.ipaginationVoice.pageSize
      return filterObj(param)
    },
    loadDataVoice(arg) {
      if (!this.url.getList) {
        this.$message.error('请设置url.getList属性!')
        return false
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipaginationVoice.current = 1
      }
      var params = this.getParams() //查询条件
      this.loadingVoice = true
      getAction(this.url.getList, params).then(res => {
        if (Number(res.code) === 200) {
          if (res.data && res.data.records && res.data.records.length > 0) {
            this.dataSourceVoice = res.data.records
            this.ipaginationVoice.total = res.data.total
            this.loadingVoice = false
          } else {
            this.dataSourceVoice = []
            this.ipaginationVoice.total = 0
            this.loadingVoice = false
            if (String(res.msg) !== 'success') {
              this.$message.warning(res.msg)
            }
          }
        } else {
          this.loadingVoice = false
          this.$message.error(res.msg)
        }
      })
    },
    // 已开票查询条件区域的展开折叠
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus
    }
  }
}
</script>
