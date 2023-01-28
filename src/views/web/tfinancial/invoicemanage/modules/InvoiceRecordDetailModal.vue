<template>
  <a-modal
    :title="title"
    :width="1000"
    :closable="false"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    :bodyStyle="{padding: '0 24px 24px'}"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
        :disabled="btnLoading"
      >取消</a-button>
      <template v-if="isOld">
        <a-button
          key="submit"
          type="primary"
          :loading="btnLoading"
          @click="handleOk('/salary/tinvoice/doIssue?tInvoiceId='+invoiceInfo.tinvoice.id,true)"
          v-if="outBtn"
        >出票</a-button>
      </template>
    </template>
    <a-spin
      :spinning="btnLoading"
      tip="出票中"
    >
      <div v-if="isOld">
        <invoice-preview-modal
          :invoiceInfo="invoiceInfo"
          :abolish="invoiceStatus"
          :isCanModify="previewIsCanModify"
        ></invoice-preview-modal>
      </div>
      <div v-else>
        <a-tabs
          default-active-key="0"
          @change="previewTabChanged"
        >
          <a-tab-pane
            v-for="(item,index) in invoiceInfo.invoiceRecordVoList"
            :key="String(index)"
            :tab="'发票'+(index+1)"
          >
            <div style="text-align:right;">
              <a-button
                :disabled="true"
                key="submit"
                type="primary"
                v-if="outBtn && Number(item.printStatus) === 0"
              >
                已出票
              </a-button>
              <a-button
                key="submit"
                type="primary"
                :loading="btnLoading"
                @click="handleOk('/salary/tinvoice/doIssue?tInvoiceId='+item.invoiceApplyId+'&tInvoiceRecordId='+item.id)"
                v-else-if="outBtn && item.printStatus == 3"
              >
                出票
              </a-button>
              <a-button
                v-has="'wxhr:tinvoice_doPrint'"
                key="print"
                type="primary"
                :loading="btnLoading"
                @click="handleOk('/salary/tinvoice/doPrint?tInvoiceId='+item.invoiceApplyId+'&tInvoiceRecordId='+item.id)"
                v-if="printBtn"
              >
                打印
              </a-button>
            </div>
            <invoice-new-preview-modal
              :invoiceInfo="item"
              :tinvoice="invoiceInfo.tinvoice"
              :abolish="!!item.status"
              :isCanModify="previewIsCanModify"
              @infoChanged="previewModalCallBack"
            ></invoice-new-preview-modal>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import { httpAction } from '@/api/manage'
import InvoicePreviewModal from './InvoicePreviewModal'
import InvoiceNewPreviewModal from './InvoiceNewPreviewModal'

export default {
  name: 'InvoiceRecordDetailModal',
  components: {
    InvoicePreviewModal,
    InvoiceNewPreviewModal
  },
  data() {
    return {
      title: '发票详情',
      previewTabActiveKey: '0', // 默认显示第一个tab
      visible: false,
      btnLoading: false,
      outBtn: false,
      printBtn: false,
      invoiceInfo: {},
      invoiceStatus: '', // 记录作废状态
      previewIsCanModify: false, // 发票预览页面上的收款人和复核人是否可编辑
      isOld: true // 老数据
    }
  },
  methods: {
    show(record) {
      this.invoiceStatus = String(record.printStatus) === '2' ? true : false
      httpAction(`/salary/tinvoice/openTInvoiceAssoById?id=${record.id}`, null, 'get').then(res => {
        if (res.code === 200) {
          this.invoiceInfo = res.data
          this.isOld = res.data.invoiceRecordVoList.length ? false : true
          this.visible = true
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // Tab切换
    previewTabChanged(key) {
      this.previewTabActiveKey = String(key)
    },
    // 专用财务出票已出票的打印发票按钮点击显示(发票记录)(只显示一张发票)
    showSingleInvoice(record) {
      this.invoiceStatus = String(record.printStatus) === '2' ? true : false
      const url = `/salary/tinvoice/openTInvoiceAssoById?id=${record.invoiceApplyId}&tInvoiceRecordId=${record.id}`
      httpAction(url, null, 'get').then(res => {
        if (res.code === 200) {
          this.invoiceInfo = res.data
          this.isOld = res.data.invoiceRecordVoList.length ? false : true
          this.visible = true
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 发票预览新页面中的收款人和复核人信息更改回调
    previewModalCallBack(type, newValue) {
      this.invoiceInfo.invoiceRecordVoList.map(item => {
        if (type === 1) {
          item.payee = newValue
        } else {
          item.checker = newValue
        }
      })
    },
    handleOk(url, isOld) {
      this.btnLoading = true
      httpAction(url, null, 'post')
        .then(res => {
          if (res.code === 200) {
            if (isOld) {
              this.handleCancel()
              this.$emit('ok')
              this.$message.success(res.msg)
            } else {
              this.$emit('ok')
              this.$message.success(res.msg)
              // 手动将当前发票设置为已出票状态
              const index = this.previewTabActiveKey
              this.$set(this.invoiceInfo.invoiceRecordVoList[Number(index)], `printStatus`, '0')
            }
          } else {
            this.$message.warning(res.msg)
          }
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    // 关闭
    handleCancel() {
      this.visible = this.printBtn = this.outBtn = false
      this.isOld = true
      this.previewTabActiveKey = '0'
    }
  }
}
</script>
