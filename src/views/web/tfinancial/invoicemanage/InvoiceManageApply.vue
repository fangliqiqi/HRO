<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户单位">
              <select-page
                :id="'id'"
                :title="'customerName'"
                placeholder="请选择客户单位"
                v-model="queryParam.unitId"
                :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <select-page
                :id="'id'"
                :title="'departName'"
                placeholder="请选择结算主体查询"
                v-model="queryParam.settleDomainId"
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="申请状态">
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="请选择申请状态查询"
                v-model="queryParam.auditFlag"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(value, key) in auditFlagOptions"
                  :key="key"
                  :value="key"
                >{{ value.option }}</a-select-option>
              </a-select>
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
        icon="plus"
        @click="handleApplyBtnClick(1)"
        v-has="'wxhr:tinvoice_saveInvoice'"
      >开票申请</a-button>
      <a-button
        type="primary"
        icon="plus"
        @click="handleApplyBtnClick(2)"
        v-has="'wxhr:tinvoice_savePreInvoicing'"
      >预开票申请</a-button>
      <a-button
        type="primary"
        icon="plus"
        @click="handleApplyBtnClick(3)"
      >预估开票</a-button>
    </div>
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span
        slot="operation"
        slot-scope="text, record"
      >
        <!--
          <span v-if="Number(record.auditFlag)===0 || Number(record.auditFlag)===3" v-has="'wxhr:tinvoice_editInvoice'">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
        </span>
        --->
      
        <a @click="handleDetail(record)">详情</a>
        <a-divider type="vertical" />
        <a @click="handlePreview(record)">预览</a>
        <span v-has="'wxhr:tinvoice_doSubmit'" v-if="Number(record.auditFlag)===0">
          <a-divider type="vertical" />
          <a @click="handleCommit(record)">提交</a>
        </span>
        <span v-has="'wxhr:tinvoice_del'" v-if="Number(record.auditFlag)===0">
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
        <span v-has="'wxhr:tinvoice_cancel'" v-if="Number(record.auditFlag)!==0 && Number(record.auditFlag) !==5">
          <a-divider type="vertical" />
          <a
            @click="handleNullify(record)"
          >作废</a>
        </span>
      </span>
    </a-table>
    <!-- 作废原因弹出框 -->
    <template>
      <a-modal
        title="作废开票原因"
        :width="600"
        :closable="true"
        :visible="nullifyVisible"
        @cancel="handlenullifyCancel"
        :maskClosable="false"
        :bodyStyle="{padding:'10px 24px 10px'}"
      >
        <template slot="footer">
          <a-button @click="handlenullifyCancel">取消</a-button>
          <a-button
            type="primary"
            @click="handleNullifyOk()"
            :loading="nullifyLoading"
            v-has="'wxhr:tinvoice_cancel'"
          >确定作废</a-button>
        </template>
        <a-form
          :form="nullifyForm"
          class="ant-nullifyForm"
        >
          <a-row style="margin-top:10px;">
            <a-col :span="24">
              <a-form-item
                label="如已出票的发票将被一并作废,请及时告知财务人员"
                class="stepFormText"
              >
                <a-textarea
                  :rows="2"
                  placeholder="请输入作废原因"
                  v-decorator="['reason', {rules: [{ required: true,max: 255, message: '请输入作废原因！'}]}]"
                  style="width: 450px"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    </template>
    <invoice-manage-apply-modal
      ref="invoiceManageApplyModal"
      @ok="modalFormOk"
    ></invoice-manage-apply-modal>
    <invoice-manage-apply-detail-modal
      ref="invoiceManageApplyDetailModal"
      @ok="modalFormOk"
    ></invoice-manage-apply-detail-modal>
    <invoice-manage-edit-modal
      ref="invoiceManageEditModal"
      @ok="modalFormOk"
    ></invoice-manage-edit-modal>
    <invoice-record-detail-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></invoice-record-detail-modal>
  </a-card>
</template>

<script>
import { httpAction } from '@/api/manage'
import { getUnitSelectVos } from '@/api/api'
import SelectPage from '@/components/jeecg/SelectPage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import InvoiceRecordDetailModal from './modules/InvoiceRecordDetailModal'
import InvoiceManageApplyModal from './modules/InvoiceManageApplyModal'
import InvoiceManageApplyDetailModal from './modules/InvoiceManageApplyDetailModal'
import InvoiceManageEditModal from './modules/InvoiceManageEditModal'

export default {
  name: 'InvoiceManageApply',
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
    InvoiceManageApplyModal,
    InvoiceManageApplyDetailModal,
    InvoiceRecordDetailModal,
    InvoiceManageEditModal
  },
  data() {
    return {
      unitOptions: [], // 单位和结算主体
      nullifyForm: this.$form.createForm(this),
      nullifyLoading: false, // 作废按钮加载动画
      nullifyVisible: false, // 作废原因弹窗是否显示
      nullifyRecord: {}, // 点击要作废的记录
      nullifyReason: '', // 开票申请作废原因
      invoiceTypeOptions: { '0': '结算开票', '1': '预开票' }, // 开票类型
      auditFlagOptions: {
        // 开票状态
        '0': { option: '待提交', color: 'blue' },
        '1': { option: '待审核', color: 'cyan' },
        '2': { option: '待开票', color: 'purple' },
        '3': { option: '财务退回', color: 'red' },
        '4': { option: '已开票', color: 'green' },
        '5': { option: '已作废', color: 'pink' },
        '6': { option: '部分开票', color: 'orange' }
      },
      columns: [
        {
          width: 90,
          ellipsis: true,
          title: '开票状态',
          align: 'center',
          dataIndex: 'auditFlag',
          customRender: text => {
            const optionItem = this.auditFlagOptions[String(text)] || '-'
            return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
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
          width: 100,
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
        },
        {
          width: 250,
          ellipsis: true,
          title: '操作',
          key: 'operation',
          align: 'center',
          fixed:'right',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      url: {
        list: 'salary/tinvoice/getApplicationPage',
        delete: 'salary/tinvoice/', // 删除
        detail: '/salary/tinvoice/openTInvoiceAssoById', // 详情
        auditProcessUrl: 'salary/tinvoiceprocessinfo/getInfoById/', // 流程进展明细
        nullify: '/salary/tinvoice/cancelById', // 作废
        selectPrintAddress: '/salary/tinvoiceaddressset/selectByCompanyAndUserId' // 通过公司名称和开票人ID查询打印地址
      }
    }
  },

  created() {
    // 获取登录用户拥有结算主体权限的单位信息（包含结算主体）
    const that = this
    getUnitSelectVos().then(res => {
      if (Number(res.code) === 200) {
        that.unitOptions = res.data
      } else {
        that.$message.error('单位信息数据请求失败！')
      }
    })
  },
  methods: {
    // 点击申请开票/申请预开票/申请预估开票
    handleApplyBtnClick(type) {
      switch (type) {
        case 1:
          {
            this.$refs.invoiceManageApplyModal.title = '开票申请 - 新建'
            this.$refs.invoiceManageApplyModal.unitBelongs = this.unitOptions
            this.$refs.invoiceManageApplyModal.pageType = type
            this.$refs.invoiceManageApplyModal.show()
          }
          break
        case 2:
          {
            this.$refs.invoiceManageApplyModal.title = '申请预开票 - 新建'
            this.$refs.invoiceManageApplyModal.unitBelongs = this.unitOptions
            this.$refs.invoiceManageApplyModal.pageType = type
            this.$refs.invoiceManageApplyModal.show()
          }
          break
        case 3:
          {
            this.$refs.invoiceManageApplyModal.title = '申请预估开票 - 新建'
            this.$refs.invoiceManageApplyModal.unitBelongs = this.unitOptions
            this.$refs.invoiceManageApplyModal.pageType = type
            this.$refs.invoiceManageApplyModal.show()
          }
          break
      }
    },
    // 编辑
    handleEdit(record){
      httpAction(`${this.url.detail}?id=${record.id}`, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          const invoiceType = this.judgeInvoiceType(res.data)
          this.$refs.invoiceManageEditModal.title = `编辑开票申请-${this.auditFlagOptions[record.auditFlag]['option']}`
          this.$refs.invoiceManageEditModal.pageType = invoiceType
          this.$refs.invoiceManageEditModal.unitBelongs = this.unitOptions
          this.$refs.invoiceManageEditModal.detailDataInfo = res.data
          this.$refs.invoiceManageEditModal.show()
        } else {
          this.$message.error('详情获取失败！')
        }
      })
    },
    // 点击查看详情
    handleDetail(record) {
      httpAction(`${this.url.detail}?id=${record.id}`, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          const invoiceType = this.judgeInvoiceType(res.data)
          this.$refs.invoiceManageApplyDetailModal.title = `开票申请详情-${this.auditFlagOptions[record.auditFlag]['option']}`
          this.$refs.invoiceManageApplyDetailModal.pageType = invoiceType
          this.$refs.invoiceManageApplyDetailModal.unitBelongs = this.unitOptions
          this.$refs.invoiceManageApplyDetailModal.detailDataInfo = res.data
          this.$refs.invoiceManageApplyDetailModal.show()
        } else {
          this.$message.error('详情获取失败！')
        }
      })
    },
    // 根据详情数据判断发票类型
    judgeInvoiceType(resData) {
      let invoictType = 1
      if (String(resData.tinvoice.invoiceType) === '1') {
        invoictType = 2
      } else if (String(resData.tinvoice.invoiceType) === '0') {
        // 结算开票类型时，根据结算单类型判断是否是预估开票
        const settleBillItem = resData.mlist && resData.mlist[0]
        if (settleBillItem && String(settleBillItem.settleFormType) === '3') {
          // 预估结算单
          invoictType = 3
        }
      }
      return invoictType
    },
    getVal(val) {
      return val ? val : ''
    },
    // 点击预览
    handlePreview(record) {
      this.$refs.modalForm.title = `发票预览-${this.auditFlagOptions[record.auditFlag]['option']}`
      this.$refs.modalForm.show(record)
    },
    // 点击提交
    handleCommit(record) {
      httpAction(`${this.url.detail}?id=${record.id}`, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          const invoiceType = this.judgeInvoiceType(res.data)
          this.$refs.invoiceManageApplyDetailModal.title = `开票申请详情提交-${this.auditFlagOptions[record.auditFlag]['option']}`
          this.$refs.invoiceManageApplyDetailModal.pageType = invoiceType
          this.$refs.invoiceManageApplyDetailModal.unitBelongs = this.unitOptions
          this.$refs.invoiceManageApplyDetailModal.detailDataInfo = res.data
          this.$refs.invoiceManageApplyDetailModal.isCommitType = true
          this.$refs.invoiceManageApplyDetailModal.show()
        } else {
          this.$message.error('详情获取失败！')
        }
      })
    },
    // 点击作废
    handleNullify(record) {
      this.nullifyVisible = true
      this.nullifyRecord = record
    },
    // 作废原因弹出框关闭
    handlenullifyCancel() {
      this.nullifyVisible = false
      this.nullifyRecord = {}
      this.nullifyReason = ''
      this.nullifyLoading = false
      this.nullifyForm.resetFields()
    },
    // 点击确认作废
    handleNullifyOk() {
      const that = this
      this.nullifyForm.validateFields((err, values) => {
        if (!err) {
          this.nullifyReason = values.reason
          that.nullifyLoading = true
          that.hrInterfaceOfNullify()
        }
      })
    },
    // HR 自己后端的作废接口
    hrInterfaceOfNullify() {
      const record = this.nullifyRecord
      const reason = this.nullifyReason
      httpAction(`${this.url.nullify}?id=${record.id}&reason=${reason}`, null, 'POST').then(res => {
        if (Number(res.code) === 200) {
          this.nullifyLoading = false
          this.$message.success('作废成功')
          this.handlenullifyCancel()
          this.loadData()
        } else {
          this.nullifyLoading = false
          this.$message.error(res.msg || '作废失败！')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-nullifyForm {
  :global(.ant-form-item-label > label::after) {
    display: none;
  }
}
.ant-btn {
  margin-left: 8px;
}
.ant-card-body .table-operator {
  margin-bottom: 18px;
}
</style>
