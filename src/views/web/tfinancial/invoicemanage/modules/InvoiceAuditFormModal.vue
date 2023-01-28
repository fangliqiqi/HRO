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
            :label="labelText"
          >
            <a-textarea
              :placeholder="`请填写${labelText}`"
              :autoSize="{minRows:5,maxRows:8}"
              v-decorator="['auditRemark', validatorRules.auditRemark ]"
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
    name:'InvoiceAuditFormModal',
    data() {
      return {
        title:'开票退回',
        labelText:'退回原因',
        confirmLoading: false,
        visibleBack: false,
        auditFlag:2, // 2审核通过3不通过
        id:'',
        form: this.$form.createForm(this),
        validatorRules:{
          auditRemark:{rules: [{ required: true, message: `请填写${this.labelText}!` }]},
        }
      }
    },
    methods:{
      show(id){
        this.id = id
        this.visibleBack = true
      },
      handleBackOk(){
        this.form.validateFields((err, values) => {
          if (!err) {
            values.auditFlag = this.auditFlag
            values.id = this.id
            httpAction('salary/tinvoice/audit',values,'post').then(res=>{
              if(res.code === 200){
                this.$message.success(res.msg)
                this.handleCancel()
                this.$emit('cancel')
              }else{
                this.$message.warning(res.msg)
              }
            })
            console.log(values,222)
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
