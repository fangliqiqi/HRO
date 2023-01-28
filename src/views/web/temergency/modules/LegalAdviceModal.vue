<template>
  <a-modal
    :title="title"
    :width="800"
    @ok="handleOk"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
    okText="提交"
    cancelText="关闭"
    :maskClosable="false"
  >
    <a-form
      layout="vertical"
      :form="accessForm"
    >
      <a-form-item label="法务意见">
        <a-textarea
          placeholder="请填写法务意见"
          v-decorator="['legalAdvice',validatorRules.legalAdvice ]"
          rows="5"
        ></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>

import { httpActionHeader } from '@/api/manage'
import pick from 'lodash.pick'

export default {
  name: 'LegalAdviceModal',
  components: {
  },
  data() {
    return {
      title:'法务意见',
      visible:false,
      confirmLoading:false,
      validatorRules:{
        legalAdvice: { rules: [{ required: true,message: '请输入法务意见!' },{max:500,message:'最多500个字符!'}] },
      },
      accessForm: this.$form.createForm(this),
      url:{
        accessUrl:'/hrEmergency/tabitrationevent/legalAdvice'
      },
      model:{},
    }
  },
  methods: {
    show(record){
      this.model = record
      this.visible = true
      this.$nextTick(() => {
        this.accessForm.setFieldsValue(pick({legalAdvice:this.model.customerOpinion}, 'legalAdvice'))
      })
    },
    handleOk(){
      this.accessForm.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          let contextType = {'Content-Type': 'application/json'}
          httpActionHeader(this.url.accessUrl+'?id='+this.model.id,values.legalAdvice,'post',contextType).then(res => {
            if (res.code === 200) {
              this.$message.success('操作成功！')
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
    handleCancel(){
      this.visible = false
      this.model = {}
    }

  }
}
</script>