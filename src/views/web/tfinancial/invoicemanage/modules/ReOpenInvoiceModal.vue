<template>
  <a-modal
    :title="title"
    :visible="visibleBack"
    :confirm-loading="confirmLoading"
    @ok="handleBackOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-form
      :form="form"
      layout="horizontal"
    >
      <a-row>
        <a-col :span="24">
          <a-form-item
            class="stepFormText"
            label="重新开票原因"
          >
            <a-textarea
              placeholder="请填写重新开票原因"
              :autoSize="{minRows:6,maxRows:10}"
              v-decorator="['reason', validatorRules.reason ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'

  export default {
    name:'ReOpenInvoiceModal',

    data() {
      return {
        title:'重新开票',
        labelText:'',
        confirmLoading: false,
        visibleBack: false,
        model:{},
        form: this.$form.createForm(this),
        validatorRules:{
          reason:{rules: [{ required: true, message: `请填写重新开票原因` }]},
        }
      }
    },
    methods:{
      show(record){
        this.model = Object.assign({},record)
        this.visibleBack = true
      },
      handleBackOk(){
        this.form.validateFields((err, values) => {
          if (!err) {
            const url = `/salary/tinvoice/reInvoice?tInvoiceId=${this.model.invoiceApplyId}&tInvoiceRecordId=${this.model.id}&reason=${values.reason}`
            httpAction(url,{},'post').then(res=>{
              if(res.code === 200){
                this.$message.success('操作成功！')
                this.handleCancel()
                this.$emit('ok')
              }else{
                this.$message.warning(res.msg)
              }
            })
          }
        })
      },
      handleCancel(){
        this.visibleBack = false
        this.form.resetFields()
      }
    }
  }
</script>
