<template>
  <a-modal
    title="商险退费"
    :width="600"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleOk"
    okText="保存"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
  >
    <a-form
      :form="form"
      layout="inline"
    >
      <a-form-item label="金额">
        <a-input-number
          :min="0"
          :precision="2"
          style="width:250px;"
          v-decorator="['refundMoney',{ rules: [{ required: true, message: '请输入退费金额!' }] }]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>

import { httpAction } from '@/api/manage'

export default {
  name:'RefundModal',
  data(){
    return {
      visible:false,
      confirmLoading:false,
      form: this.$form.createForm(this),
      model:{},
      url:'/busiInsurance/tbusinessinsurance/refund/fee'
      
    }
  },
  methods: {
    show(record){
      this.model = record
      this.visible = true
    },
    handleOk(){
      const that = this
      this.form.validateFields((err, values) => {
        if(!err){
          const url = `${that.url}?id=${that.model.id}&refundMoney=${values.refundMoney}`
          httpAction(url,{},'put').then(res=>{
            if(res.code === 200){
              that.$message.success("保存成功！")
              that.handleCancel()
              that.$emit('ok')
            }else{
              that.$message.warning(res.msg)
            }
          })
        }
      })
    },
    handleCancel(){
      this.visible = false
      this.model = {}
    }
  },
}
</script>
