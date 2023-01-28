<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="发送邀请"
      :maskClosable="false"
      :destroyOnClose="true"
    > 
      <a-spin :spinning="confirmLoading">
        <a-form
          :form="form"
          layout="inline"
          class="ant-advanced-search-form"
        >
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="姓名" class="stepFormText">
                <a-input v-decorator="['name', validatorRules.name]"/>
              </a-form-item>
            </a-col>
            <a-col :span="24" class="stepFormText">
              <a-form-item label="身份证号">
                <a-input v-decorator="['idCard', validatorRules.idCard]"/>
              </a-form-item>
            </a-col>
            <a-col :span="24" class="stepFormText">
              <a-form-item label="手机号">
                <a-input v-decorator="['moblie', validatorRules.moblie]"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>

  import { httpAction } from '@/api/manage'

  export default {
    data() {
      return {
        title: '账号实名认证',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          name: { rules: [{ required: true, message: '请输入姓名!' },{pattern:/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,5}$/,message:'姓名必须为2~5位汉字！'}] },
          idCard: { rules: [{ required: true, message: '请输入身份证号!' },{pattern:/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,message:'身份证号码格式不正确！'}] },
          moblie: { rules: [{ required: true, message: '请输入手机号!' },{pattern:/^1[3456789]\d{9}$/,message:'手机号格式不正确！'}] },
        }
      }
    },
    methods: {
      show() {
        this.visible = true
        this.form.resetFields()
      },
      handleOk() {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            httpAction('/hrBase/fddpersonaccount', values, 'POST').then((res) => {
              if(res.code == 200){
                this.$message.success('邀请成功!')
                this.close()
                this.$emit('ok')
              } else {
                this.$message.warning(res.msg)
              }
            }).finally(() => {
              this.confirmLoading = false
            })
          }
        })
        
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.visible = false
      }
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 150px;
  }
}
</style>

