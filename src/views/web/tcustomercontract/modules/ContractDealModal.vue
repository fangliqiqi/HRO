<template>
  <a-modal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :width="600"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        class="ant-advanced-search-form"
      >
        <a-form-item label="备注">
          <a-textarea
            placeholder="请输入备注"
            :autoSize="{ minRows: 4, maxRows: 8 }"
            style="resize:none;"
            v-decorator="['prAuditOpinion',validatorRules.prAuditOpinion]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'ContractFileModal',
  data() {
    return {
      visible: false,
      title: '办理',
      confirmLoading: false,
      form: this.$form.createForm(this),
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      validatorRules: {
        prAuditOpinion: { rules: [{ required: true, message: '请填写备注!' },{ max: 200, message: '备注最多200个字符!' }] },
      },
      url: {
        submitBatch: '/hrBase/tcustomercontract/handleAndArchive/',
      }
    }
  },
  methods: {
    showModal(record) {
      this.model = Object.assign({},record)
      this.visible = true
      this.form.resetFields()
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          httpAction(`${this.url.submitBatch}${this.model.id}?prAuditOpinion=${values.prAuditOpinion}`,null,'post').then(res=>{
            if(res.code === 200){
              this.$message.success(`${this.title}成功!`)
              this.handleCancel()
              this.$emit('ok')
            }else{
              this.$message.warning(res.msg)
            }
          }).finally(()=>{
            this.confirmLoading = false
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
      this.model = {}
    }
  }
}
</script>
