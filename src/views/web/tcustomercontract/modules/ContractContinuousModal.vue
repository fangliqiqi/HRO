<template>
  <a-modal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        class="ant-advanced-search-form"
      >
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="停止理由"
        >
          <a-textarea
            v-decorator="['stopReason', {'initialValue':stopReasonText,rules: [{ required: true, message: '请填写停止理由!' }]} ]"
            placeholder="停止理由"
            :autoSize="{ minRows: 2, maxRows: 2 }"
            style="width: 600px;"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注"
        >
          <a-textarea
            v-decorator="['remark', {} ]"
            placeholder="备注"
            :autoSize="{ minRows: 2, maxRows: 2 }"
            style="width: 600px;"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'ContractContinuousModal',
  data() {
    return {
      visible: false,
      title: '停止合同',
      id: "",
      confirmLoading: false,
      form: this.$form.createForm(this),
      model: {},
      stopReasonText: "",
      auditPojo: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      url: {
        submitBatch: '/hrBase/tcustomercontract/stop'
      }
    }
  },
  methods: {
    showModal(res) {
      this.id = res.id;
      this.visible = true
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign(this.model, values)
          formData.id = this.id;

          httpAction(this.url.submitBatch , formData, 'POST').then((res) => {
            if (res.code === 200) {
              that.$message.success(`${that.title}成功！`)
              that.$emit('ok')
            } else {
              that.$message.warning(res.msg)
            }
          }).finally(() => {
            that.confirmLoading = false
            that.close()
          })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    }
  }
}
</script>

<style scoped>
</style>