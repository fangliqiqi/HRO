<template>
  <a-modal
    :title="title"
    :width="1000"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="danger"
        @click="handleBack"
        v-if="isAudit"
      >退回</a-button>
      <a-button
        type="primary"
        :loading="confirmLoading"
        @click="handleOk"
        v-if="isAudit"
      >审核通过</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-tabs
        default-active-key="1"
        @change="changeTab"
      >
        <!-- <a-button
          slot="tabBarExtraContent"
          v-if="isAudit && invoiceInfo.tinvoice.invoiceUser == $store.getters.userInfo.id"
          @click="makeInvoice"
          v-has="'wxhr:tinvoice_doAgainPrint'"
        >直接开票</a-button> -->
        <a-tab-pane
          key="1"
          tab="发票预览"
        >
          <div v-if="isOld">
            <invoice-preview-modal :invoiceInfo="invoiceInfo" :isCanModify="previewIsCanModify"></invoice-preview-modal>
          </div>
          <div v-else>
            <a-tabs default-active-key="0">
              <a-tab-pane
                v-for="(item,index) in invoiceInfo.invoiceRecordVoList"
                :key="String(index)"
                :tab="'发票'+(index+1)"
              >
                <div style="text-align:right;" v-if="isAudit && invoiceInfo.tinvoice.invoiceUser == $store.getters.userInfo.id" v-has="'wxhr:tinvoice_doAgainPrint'">
                  <a-button key="submit" type="primary" @click="makeInvoice(item.invoiceApplyId,item.id)">
                    直接开票
                  </a-button>
                </div>
                <invoice-new-preview-modal :invoiceInfo="item" :tinvoice="invoiceInfo.tinvoice" :abolish="!!item.status" :isCanModify="previewIsCanModify"></invoice-new-preview-modal>
              </a-tab-pane>
            </a-tabs>
          </div>

        </a-tab-pane>
        <a-tab-pane
          key="2"
          tab="结算单"
          v-if="settleList.length && isShowSettle"
        >
          <a-tabs>
            <a-tab-pane
              v-for="(item,index) in settleList"
              :key="index"
              :tab="`结算单`+(index+1)"
            >
              <a-empty
                v-if="item.settleFormType == 2"
                description="暂无结算单"
              />
              <template v-else>
                <settle-for-salary-modal
                  :type="item.settleFormType"
                  ref="SettleForSalaryModalForm"
                  :settleFormId="item.settleFormId"
                ></settle-for-salary-modal>
              </template>
            </a-tab-pane>
          </a-tabs>
        </a-tab-pane>
        <a-tab-pane
          key="4"
          tab="流程进展明细"
        >
          <a-empty
            description="暂无流程"
            v-if="processList.length == 0"
          />
          <a-timeline
            style="margin-top: 10px;margin-left:15px;"
            v-else
          >
            <template v-for="(list, key) in processList">
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
        </a-tab-pane>
        <a-tab-pane
          key="5"
          tab="发票记录"
        >
          <a-table
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
        </a-tab-pane>
      </a-tabs>

      <invoice-audit-form-modal
        ref="InvoiceAuditFormModal"
        @cancel="handleAuditOk"
      ></invoice-audit-form-modal>
      <invoice-record-detail-modal ref="DetailModalForm"></invoice-record-detail-modal>
      <list-view-list-modal ref="listViewListModal"></list-view-list-modal>
    </a-spin>
  </a-modal>
</template>
<script>
import ListViewListModal from './ListViewListModal'
import { httpAction } from '@/api/manage'
import InvoicePreviewModal from './InvoicePreviewModal'
import InvoiceNewPreviewModal from './InvoiceNewPreviewModal'
import InvoiceAuditFormModal from './InvoiceAuditFormModal'
import SettleForSalaryModal from './SettleForSalaryModal'
import InvoiceRecordDetailModal from './InvoiceRecordDetailModal'
import { hasPermissionToPage } from '@/store/modules/permission'

export default {
  name: 'InvoiceAuditModal',
  components: {
    InvoicePreviewModal,
    InvoiceNewPreviewModal,
    InvoiceAuditFormModal,
    SettleForSalaryModal,
    InvoiceRecordDetailModal,
    ListViewListModal
  },
  data() {
    return {
      title: '开票审核',
      visible: false,
      isAudit: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      previewIsCanModify:false, // 发票预览页面上的收款人和复核人是否可编辑
      sumColumns: [
        {
          width: 200,
          title: '货物或应税劳务、服务名称',
          dataIndex: 'productName'
        },
        {
          title: '规格型号',
          dataIndex: 'productSpec',
          width: 120,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            if (index === 0 || index === 1) {
              obj.attrs.colSpan = 4
            }
            return obj
          }
        },
        {
          title: '单位',
          dataIndex: 'productUnit',
          ellipsis: true,
          width: 80,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            if (index === 0 || index === 1) {
              obj.attrs.colSpan = 0
            }
            return obj
          }
        },
        {
          title: '数量',
          dataIndex: 'prodectNum',
          ellipsis: true,
          width: 80,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            if (index === 0 || index === 1) {
              obj.attrs.colSpan = 0
            }
            return obj
          }
        },
        {
          title: '单价（含税）',
          dataIndex: 'price',
          ellipsis: true,
          width: 120,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            if (index === 0 || index === 1) {
              obj.attrs.colSpan = 0
            }
            return obj
          }
        },
        {
          title: '金额(不含税)',
          dataIndex: 'value',
          ellipsis: true,
          width: 120
        },
        {
          title: '税率',
          dataIndex: 'taxRate',
          ellipsis: true,
          width: 80,
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
          title: '税额',
          dataIndex: 'taxMoney',
          ellipsis: true,
          width: 80,
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
      ],
      columns: [
        {
          title: '货物或应税劳务、服务名称',
          dataIndex: 'productName',
          ellipsis: true,
          width: 200,
          customRender: (text, record) => {
            if (Number(record.isListImport) === 1) {
              return <a onClick={() => this.listViewClick()}>{record.productName}</a>
            }else {
              const goodsName = record.goodsName ? `*${record.goodsName}` : ''
              const productName = record.productName ? `*${record.productName}` : ''
              const resultText = `${goodsName}${productName}` || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          }
        },
        {
          title: '规格型号',
          dataIndex: 'productSpec',
          ellipsis: true,
          width: 120,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '单位',
          dataIndex: 'productUnit',
          ellipsis: true,
          width: 80,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '数量',
          dataIndex: 'prodectNum',
          ellipsis: true,
          width: 80,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '单价（含税）',
          dataIndex: 'price',
          ellipsis: true,
          width: 120,
          customRender: text => {
            const resultText = text || '0'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '金额(含税)',
          dataIndex: 'money',
          ellipsis: true,
          width: 120,
          customRender: text => {
            const resultText = text || '0'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '税率',
          dataIndex: 'taxRate',
          ellipsis: true,
          width: 80,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '税额',
          dataIndex: 'taxMoney',
          ellipsis: true,
          width: 80,
          customRender: text => {
            const resultText = text || '0'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        }
      ],
      invKindType: { '0': '专用发票', '2': '普通发票', '51': '电子发票' }, // 发票类型
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
          width: 150,
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
      recordDataSource: [],
      auditStatusOptions: {
        '0': { option: '待提交', color: 'blue' },
        '1': { option: '待审核', color: 'cyan' },
        '2': { option: '审核通过', color: 'purple' },
        '3': { option: '审核未通过', color: 'red' },
        '4': { option: '已开票', color: 'green' }
      }, // 审核状态
      invoiceInfo: {},
      settleList: [], // 结算单列表
      invoiceItemsList: [], // 商品明细
      invoiceType: '', // 发票类型 0：专用发票；2：普通发票；51：电子发票
      processList: [], //流程
      isShowSettle:true,
      isOld:true, // 老数据
    }
  },
  methods: {
    getValue(val) {
      return val || ''
    },
    getSettleType(arr){
      let status = false
      arr.forEach(item=>{
        if(item.settleFormType !== '2'){
          status = true
        }
      })
      return status
    },
    show(record) {
       this.invoiceInfo = record
       this.isOld = record.invoiceRecordVoList.length ? false : true
      // 判断发票预览页面是否可修改复核人和收款人
      const res = this.isAudit && String(this.invoiceInfo.tinvoice.invoiceUser) === String(this.$store.getters.userInfo.id)
      if(res && hasPermissionToPage('wxhr:tinvoice_doAgainPrint',this.$route)){
        this.previewIsCanModify = true
      }else {
        this.previewIsCanModify = false
      }
      // 判断清单列表是导入的数据还是手动添加的数据
      if (String(record.tinvoice.listed) === '0') {
        const tempList = [
          {
            id: 100,
            isListImport: 1,
            operation: '',
            productName: '查看=>清单列表',
            productSpec: ' ',
            productUnit: ' ',
            prodectNum: ' ',
            price: ' ',
            money: parseFloat(record.tinvoice.invoiceMoney || '0').toFixed(2),
            taxRate: ' ',
            taxMoney: parseFloat(record.tinvoice.allTax || '0').toFixed(2)
          }
        ]
        this.invoiceItemsList = tempList
      }else {
        this.invoiceItemsList = record.invoiceItemsList
      }
      this.recordDataSource = record.invoiceRecordList || []
      this.settleList = record.mlist
      this.isShowSettle = this.getSettleType(this.settleList)
      this.invoiceType = record.invoiceLimitSet ? record.invoiceLimitSet.type : ''
      this.visible = true
    },
    makeInvoice(invoiceApplyId,id) {
      let url = `salary/tinvoice/againInvoice?tInvoiceId=${this.invoiceInfo.tinvoice.id}`
      if(!this.isOld){
        url = `/salary/tinvoice/againInvoice?tInvoiceId=${invoiceApplyId}&tInvoiceRecordId=${id}`
      }
      httpAction(url, null, 'post').then(res => {
        if (res.code === 200) {
          this.$message.success('出票成功')
          this.handleCancel()
          this.$emit('ok')
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 打印出票
    handleOut(){

    },
    changeTab(key) {
      if (key === '2') {
        const _this = this
        httpAction(`hrBase/tsettledomain/vo/${this.invoiceInfo.tinvoice.settleDomainId}`,null,'get').then(res=>{
          if(res.code === 200){
            _this.$nextTick(() => {
              _this.$refs.SettleForSalaryModalForm[0].show(res.data)
            })
          }else{
            this.$message.warning(res.msg)
          }
        })

        // setTimeout(function() {
        //   _this.$refs.SettleForSalaryModalForm[0].show()
        // }, 500)
      } else if (key === '4' && !this.processList.length) {
        const httpUrl = `salary/tinvoiceprocessinfo/getInfoById/${this.invoiceInfo.tinvoice.id}`
        httpAction(httpUrl, '', 'GET').then(res => {
          if (Number(res.code) === 200 && res.data) {
            this.processList = res.data
          } else {
            this.$message.warning(res.msg)
          }
        })
      }
    },
    // 发票记录详情
    handleRecordDetail(record) {
      this.$refs.DetailModalForm.showSingleInvoice(record)
    },
    handleFooterShow() {
      return (
        <a-table
          rowKey={Math.random}
          bordered={false}
          pagination={false}
          columns={this.sumColumns}
          dataSource={[
            {
              productName: '合计',
              productSpec: '',
              value: this.invoiceInfo.tinvoice.invoiceMoney,
              taxRate: this.invoiceInfo.tinvoice.goodsTaxRate,
              taxMoney: this.invoiceInfo.tinvoice.allTax
            },
            {
              productName: '价税合计（大写）',
              productSpec: this.invoiceInfo.tinvoice.chmoney,
              value: '(小写)',
              taxRate: this.invoiceInfo.tinvoice.invoiceMoney,
              taxMoney: ''
            }
          ]}
          showHeader={false}
        ></a-table>
      )
    },
    // 点击查看清单列表
    listViewClick() {
      this.$refs.listViewListModal.title = '清单列表预览'
      this.$refs.listViewListModal.dataSource = this.invoiceInfo.invoiceItemsList || []
      this.$refs.listViewListModal.show()
    },
    // 关闭
    handleCancel() {
      this.visible = false
      this.settleList = this.processList = []
    },
    handleAuditOk() {
      // 通知列表刷新
      this.$emit('ok')
      this.visible = false
      // this.loadData()
    },
    // 通过
    handleOk() {
      this.$refs.InvoiceAuditFormModal.title = '审核通过'
      this.$refs.InvoiceAuditFormModal.labelText = '通过原因'
      this.$refs.InvoiceAuditFormModal.auditFlag = 2
      this.$refs.InvoiceAuditFormModal.validatorRules.auditRemark.rules = []
      this.$refs.InvoiceAuditFormModal.show(this.invoiceInfo.tinvoice.id)
    },
    // 退回
    handleBack() {
      this.$refs.InvoiceAuditFormModal.title = '开票退回'
      this.$refs.InvoiceAuditFormModal.labelText = '退回原因'
      this.$refs.InvoiceAuditFormModal.auditFlag = 3
      this.$refs.InvoiceAuditFormModal.validatorRules.auditRemark.rules = [
        { required: true, message: `请填写退回原因!` }
      ]
      this.$refs.InvoiceAuditFormModal.show(this.invoiceInfo.tinvoice.id)
    }
  }
}
</script>

<style scoped>
/deep/ .ant-table-footer {
  padding: 0px !important;
  border: none !important;
}
</style>
