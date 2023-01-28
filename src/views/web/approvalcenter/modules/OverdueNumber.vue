<template>
  <a-modal
    :title="title"
    :width="650"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :destroyOnClose="true"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form :form="spNoform" :label-col="{ span: 7}" :wrapper-col="{ span: 15 }">
      <a-form-item label="企业微信流程编号">
        <a-input
          placeholder="请填写逾期垫付申请“已同意”的流程编号"
          v-decorator="['spNo', { rules: [{required: true, message: '请输入流程编号!'},{pattern:/^([1-9])\d{11}$/,message: '请输入正确的流程编号!' }] }]"
        />
      </a-form-item>
    </a-form> 
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'OverdueListModal',
  data() {
    return {
      visible: false,
      confirmLoading:false,
      title:'',
      spNoform:this.$form.createForm(this),
      model:{}
    }
  },
  methods: {
    show(model) {
      this.model = model
      this.visible = true
    },
    handleOk() {
      this.spNoform.validateFields((err, values) => {
        if (!err) {
          const num = values.spNo
          // 校验逾期编号
          httpAction(`/hrApproval/tadvancepayment/checkQywxProcessNoIsExist?spNo=${num}`, null, 'get').then((res) => {
            if(res.code === 200){
              this.confirmLoading = true;
              let formData = Object.assign(this.model, values)
              // 提交
              httpAction('/hrApproval/tpaymentapprovalrecord/submit',{...formData,oldType:3},'post').then(res=>{
                if(res.code === 200){
                  this.confirmLoading = false;
                  this.$message.success('提交成功')
                  this.visible = false
                  this.$emit('ok');
                }else{
                  this.$message.warning(res.msg)
                  this.confirmLoading = false;
                } 
              })
            }else{
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
    },
  }
}
</script>

<style lang="less" scoped>
  .center{
    text-align: center;
    h6{
      font-size: 16px;
      margin: 0px;
    }
    p{
      margin: 0px;
    }
  }
  .ant-table{
    margin-bottom: 12px;
  }
</style>
