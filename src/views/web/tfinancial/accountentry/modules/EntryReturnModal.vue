<template>
  <a-modal
    title="入账退回"
    :width="600"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        :loading="returnloading"
      >确定</a-button>
    </template>
    <a-form
      :form="form"
      class="ant-advanced-search-form"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item
        label="原因"
        class="stepFormText"
      >
        <a-textarea
          v-decorator="['reason', {rules: [{required: true, message: '请输入退回原因！'},{max:100,message:'最多100个字符！'}]}]"
          placeholder="请输入退回原因！"
          :auto-size="{ minRows: 3 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { httpAction } from '@/api/manage'

export default {
  data() {
    return {
      description: '入账列表操作列点击入账退回弹出视图',
      visible: false, // 入账退回
      returnloading: false, // 入账退回加载动画
      form: this.$form.createForm(this),
      record:{}, // 需要入账退回数据
      url:{
        entryReturn:'/salary/tincome/returnMoneyById', // 入账退回
      }
    }
  },
  methods: {
    show(){
      this.visible = true
    },
    // 点击关闭入账退回弹窗
    handleCancel() {
      this.form.resetFields()
      this.returnloading = false
      this.visible = false
    },
    // 点击入账退回弹窗的确定按钮
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.returnloading = true
          const url = `${that.url.entryReturn}?id=${that.record.id}&returnReason=${values.reason}`
          httpAction(encodeURI(url), '', 'POST').then((res) => {
            if (Number(res.code) === 200) {
              that.$message.success('入账退回成功！')
              that.$emit('ok')
              that.handleCancel()
            } else {
              that.$message.warning(res.msg || '操作失败！')
            }
          }).finally(() => {
            that.returnloading = false
          })
        }
      })
    }
  }
}
</script>
