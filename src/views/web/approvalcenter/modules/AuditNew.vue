<template>
  <a-modal
    :title="title"
    :width="650"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    cancelText="关闭"
  >

    <a-form :form="form">
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="是否通过"
      >
        <a-select
          placeholder="是否通过"
          optionFilterProp="children"
          style="width: 300px;"
          @change="approvalResultChange"
          v-decorator="['approvalResult', validatorRules.approvalResult ]"
        >
          <a-select-option value="0">是</a-select-option>
          <a-select-option value="1">否</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="审核意见"
      >
        <a-textarea
          placeholder="审核意见"
          v-decorator="['approvalOpinion', validatorRules.approvalOpinion ]"
          :autoSize="{ minRows: 2, maxRows: 2 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'AuditNew',
  data() {
    return {
      title: '审核',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      validatorRules: {
        approvalResult: {rules: [{ required: true, message: '请选择是否通过!' }]},
        approvalOpinion: {rules: [{ required: true, message: '请填写审核意见!' },{max:500,message:'审核意见最多500个字符!'}]},
      },
      url: {
        doAudit: '/hrApproval/tpaymentapprovalrecord/submitAndaudit',
      }
    }
  },
  methods: {
    show(record) {
      this.model = record
      this.visible = true
      console.log(record)
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.advancePaymentId = this.model.id
          this.confirmLoading = true
          httpAction(this.url.doAudit, values, 'POST').then((res) => {
            if(res.code === 200){
              this.$message.success(res.msg)
              this.$emit('ok')
            } else {
              this.$message.warning(res.msg)
            }
          }).finally(() => {
            this.confirmLoading = false
            this.close()
          })
        }
      })
    },
    approvalResultChange(v) {
      if(String(v) === '1'){
        this.validatorRules.approvalOpinion = {rules: [{ required: true, message: '请填写审核意见!' },{max:500,message:'审核意见最多500个字符!'}]}
      }else{
        this.validatorRules.approvalOpinion = {rules: [{ required: false, message: '请填写审核意见!' },{max:500,message:'审核意见最多500个字符!'}]}
      }
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

<style lang="less" scoped>
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
.stepFormText {
  :global(.ant-form-item-label) {
    width: 150px;
  }
}
</style>
