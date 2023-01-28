<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="开票人">
              <a-input
                placeholder="请输入开票人"
                v-model="queryParam.invoiceUserName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="销售方">
              <a-input
                placeholder="请输入销售方名称"
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
                placeholder="请输入购买方名称"
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
    <div class="table-operator">
      <a-button
        type="primary"
        :disabled="!selectedRowKeys.length"
        @click="batchAuditClick"
      >
        批量审核
      </a-button>
    </div>
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps:getCheckboxProps}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleAuditBtnClick(record)"
            v-if="Number(record.auditFlag) === 1"
          >审核</a>
        </span>
      </a-table>
    </div>
    <invoice-audit-modal ref="modalForm" @ok="modalFormOk"></invoice-audit-modal>
    <invoice-batch-audit-modal ref="InvoiceBatchAuditModal" @ok="modalFormOk"></invoice-batch-audit-modal>

  </a-card>
</template>

<script>
import { httpAction } from '@/api/manage'
import SelectPage from '@/components/jeecg/SelectPage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import InvoiceAuditModal from './modules/InvoiceAuditModal'
import InvoiceBatchAuditModal from './modules/InvoiceBatchAuditModal'

export default {
  name: 'InvoiceFinancialAudit',
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
    InvoiceAuditModal,
    InvoiceBatchAuditModal
  },
  data() {
    return {
      invoiceTypeOption:{
        '0':'结算开票',
        '1':'预开票',
      },
      columns: [
        {
          ellipsis: true,
          width:120,
          title: '开票金额',
          align: 'center',
          dataIndex: 'invoiceMoney',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width:120,
          title: '开票类型',
          align: 'center',
          dataIndex: 'invoiceType',
          customRender: text => {
            const type = this.invoiceTypeOption[text]
            return <a-tooltip title={type}>{type}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width:150,
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
          width:150,
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
          width:150,
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
          width:150,
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
          width:150,
          title: '税率',
          align: 'center',
          dataIndex: 'goodsTaxRate',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width:150,
          title: '扣除额',
          align: 'center',
          dataIndex: 'taxDeduction',
          customRender: text => {
            const resultText = text || '0'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width:150,
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
          width:150,
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
          width:120,
          title: '操作',
          key: 'operations',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        }
      ],
      url: {
        list: 'salary/tinvoice/getAuditPage?auditFlag=1',
        queryAllInfoById: 'salary/tinvoice/openTInvoiceAssoById', // 详情
        auditProcessUrl: 'salary/tinvoiceprocessinfo/getInfoById/', // 流程进展明细
      }
    }
  },
  methods: {
    getCheckboxProps(record){
      return {
        props: {
          disabled: String(record.auditFlag) !== '1' || !record.goodsName,
        }
      }
    },
    // 点击审核按钮
    handleAuditBtnClick(record) {
      httpAction(`${this.url.queryAllInfoById}?id=${record.id}`,null,'get').then(res=>{
        if(res.code === 200){
          this.$refs.modalForm.title = '开票审核'
          this.$refs.modalForm.isAudit = true
          this.$refs.modalForm.show(res.data)
        }else{
          this.$message.error(res.msg || '详情获取失败！')
        }
      })
    },
    // 点击了批量审核
    batchAuditClick() {
      this.$refs.InvoiceBatchAuditModal.show(this.selectedRowKeys)
    },
  }
}
</script>

<style scoped>

.ant-card-body .table-operator{
  margin-bottom: 18px;
}
</style>
