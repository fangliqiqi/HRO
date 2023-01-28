<template>
  <a-modal
    :title="title"
    :width="600"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >保存</a-button>
    </template>
    <a-form
      :form="form"
      class="ant-disabled-form"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-item
        label="发票号"
        class="stepFormText"
        style="margin-bottom:0;"
      >
        <a-input
          placeholder="请输入发票号"
          v-decorator="['invoiceNo', {rules: [{required: true, message: '请输入发票号！'}]}]"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { httpAction } from '@/api/manage'

export default {
  data() {
    return {
      description: '扫描结算查看和单独结算单查看页面封面修改发票号',
      title: '修改发票号',
      form: this.$form.createForm(this),
      confirmLoading: false, // 点击保存或编辑按钮加载动画
      visible: false,
      coverData:{}, // 传入的封面数据
      url:{
        modifyUrl:'/busiInsurance/tinsurancesettlementcover/modifyInvoiceNo', // 修改发票号
      }
    }
  },
  methods:{
    // 显示
    show(coverData){
      this.coverData = coverData
      console.log('-----封面数据',coverData)
      this.visible = true
    },
    // 取消
    handleCancel(){
      this.form.resetFields()
      this.confirmLoading = false
      this.visible = false
    },
    // 修改保单号
    handleOk(){
      const that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          const parameters = {
            id:that.coverData.id || '',
            oldInvoiceNo:that.coverData.invoiceNo || '',
            invoiceNo:values.invoiceNo
          }
          that.confirmLoading = true
          httpAction(that.url.modifyUrl, parameters, 'PUT')
            .then(res => {
              if (Number(res.code) === 200) {
                that.$message.success('发票号修改成功！')
                that.handleCancel()
              } else {
                that.$message.warning(res.msg || '发票号修改失败！')
              }
            })
            .finally(() => {
              that.confirmLoading = false
          })
        }
      })
    }
  }
}
</script>
