<template>
  <a-modal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        class="ant-advanced-search-form"
      >
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否通过"
        >
          <a-select
            placeholder="请选择是否通过"
            style="width: 180px"
            @change="auditChange"
            v-decorator="['prAuditFlag', {'initialValue':'0',rules: [{ required: true, message: '请选择是否通过!' }]} ]"
          >
            <a-select-option value="0">通过</a-select-option>
            <a-select-option value="1">不通过</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="审核意见"
        >
          <a-textarea
            v-decorator="['prAuditOpinion', {'initialValue':auditRemarkText,rules: [{ required: true, message: '请输入审核意见!' }]} ]"
            placeholder="审核意见"
            :autosize="{ minRows: 2, maxRows: 2 }"
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
  name: 'AuditModule',
  data() {
    return {
      visible: false,
      title: '审核',
      id: "",
      confirmLoading: false,
      form: this.$form.createForm(this),
      model: {},
      auditRemarkText: "审核通过！",
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
        submitBatch: '/hrOneTime/tbusinessoutsourcingmain/audit'
      }
    }
  },
  methods: {
    showModal(res) {
      this.id = res;
      this.visible = true
    },
    auditChange(t) {
      if(t == 0) {
        this.auditRemarkText = "审核通过！";
      } else {
        this.auditRemarkText = "审核不通过！";
      }
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formObject = Object.assign(this.model, values)
          let formData = new Object();
          formData.id = this.id;
          formData.auditStatus = formObject.prAuditFlag;
          formData.prAuditOpinion = formObject.prAuditOpinion;

          httpAction(this.url.submitBatch , formData, 'POST').then((res) => {
            if (res.code === 200) {
              that.$message.success(`${that.title}成功！`)
              that.$emit('ok')
              that.close()
            } else {
              that.$message.warning(res.msg || res.message)
            }
          }).finally(() => {
            that.confirmLoading = false
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
      this.confirmLoading = false
    }
  }
}
</script>

<style scoped>
</style>