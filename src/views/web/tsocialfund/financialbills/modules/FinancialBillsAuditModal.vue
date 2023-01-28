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
      <a-form-item label="是否通过">
        <a-radio-group
          v-decorator="['status', validatorRules.status ]"
          @change="handleRadio"
        >
          <a-radio :value="2" v-if="model.status==1">通过</a-radio>
          <a-radio :value="3" v-if="model.status==2">通过</a-radio>
          <a-radio :value="4">不通过</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="审核意见">
        <a-textarea placeholder="请输入审核意见(最多200字)" v-decorator="['remark', validatorRules.remark]"></a-textarea>
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
        status: {rules: [{ required: true, message: '请选择是否通过!' }]},
        remark: {rules: [{ required: true, message: '请填写审核意见!' },{max:200,message:'审核意见最多200个字符!'}]},
      },
      url: {
        doSettleAudit: '/hrSocial/tfinancebill/doFirstAudit', //运营审核
        doAudit:'/hrSocial/tfinancebill/doSecondAudit' //财务审核
      }
    }
  },
  methods: {
    show(record) {
      this.form.resetFields()
      this.model = record
      this.visible = true
    },
    handleRadio(e){
      let val = e.target.value
      if(val== 4){
        this.validatorRules.remark = { rules: [{ required: true, message: '请填写审核意见!' },{max:200,message:'审核意见最多200个字符!'}]}
      }else{
        this.validatorRules.remark = {}
      }
      
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const qs = require('qs')
          values.id = this.model.id
          let url;
          if(this.model.status=='1'){
            url = `${this.url.doSettleAudit}?${qs.stringify(values)}`
          }else if(this.model.status=='2'){
            url = `${this.url.doAudit}?${qs.stringify(values)}`
          }
          // console.log(values);
          this.confirmLoading = true
          httpAction(url, {}, 'POST').then((res) => {
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
  
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.confirmLoading = false
      this.form.resetFields()
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
