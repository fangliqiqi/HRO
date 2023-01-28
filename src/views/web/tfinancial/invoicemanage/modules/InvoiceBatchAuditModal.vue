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
            label="审核状态"
          >
            <a-select
              style="width: 100%"
              @change="changeSelect"
              placeholder="请选择审核状态"
              v-decorator="['auditFlag', validatorRules.auditFlag ]"
            >
              <a-select-option value="2">通过</a-select-option>
              <a-select-option value="3">退回</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
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
        title:'批量审核',
        labelText:'',
        confirmLoading: false,
        visibleBack: false,
        form: this.$form.createForm(this),
        ids:'',
        validatorRules:{
          auditRemark:{rules: [{ required: true, message: `请填写${this.labelText}!` }]},
          auditFlag:{rules: [{ required: true, message: `请填写审核状态!` }]},
        }
      }
    },
    methods:{
      show(arr){
        this.ids = arr
        this.visibleBack = true
      },
      changeSelect(val){
        this.form.resetFields()
        if(val === '2'){
          this.labelText = '通过原因'
          this.validatorRules.auditRemark.rules = []
        }else{
          this.labelText = '退回原因'
          this.validatorRules.auditRemark.rules = [{ required: true, message: `请填写${this.labelText}!` }]
        }
      },
      handleBackOk(){
        this.form.validateFields((err, values) => {
          if (!err) {
            values.invoiceList = this.ids
            httpAction('salary/tinvoice/batch/audit',values,'post').then(res=>{
              if(res.code === 200){
                this.$message.success('操作成功！')
                this.handleCancel()
                this.$emit('ok')
              }
            })
          }
        })
      },
      handleCancel(){
        this.visibleBack = false
        this.form.resetFields()
        this.ids = []
      }

    }
  }
</script>
