<template>
  <a-modal
    :title="title"
    :width="650"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
  >
    <a-textarea
      v-model="uploadReason"
      placeholder="请输入终止原因"
      :autoSize="{ minRows: 5 }"
      style="width: 100%"
      :allowClear="true"
    />
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'AdvancePaymentTermination',
  data() {
    return {
      title: '垫付回款记录',
      visible: false,
      confirmLoading: false,
      uploadReason: '',
      nodes: [],
      roleUser: [],
      nodeObject: {},
      advancePaymentId: '',
      approvalManName: '',
      model: {},
      isActive: true,
      dataSource: [],
      url: {
        deleteRecord: '/hrApproval/tadvancepayment/termination',
      },
      recordId: '',
    }
  },
  methods: {
    show(record) {
      // this.dataSource = record
      console.log(record)
      this.visible = true
      this.recordId = record.id
    },
    handleOk() {
      if (this.uploadReason.trim() === '') {
        this.$message.warning('请输入终止原因')
      } else {
        this.confirmLoading = true
        httpAction(`${this.url.deleteRecord}?id=${this.recordId}&terminationResion=${this.uploadReason}`, {}, 'PUT')
          .then((res) => {
            if (res.code === 200) {
              this.$message.success('上传成功!')
              this.$emit('ok')
            } else {
              this.$emit('error')
              this.$message.warning(res.msg)
            }
          })
          .finally(() => {
            this.confirmLoading = false
            this.$emit('ok')
            this.close()
          })
      }
    },
    chooseIncome() {
      // 回款
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.uploadReason = ''
    },
  },
}
</script>

<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 150px;
  }
}
</style>
