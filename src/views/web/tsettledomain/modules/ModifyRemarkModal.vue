<template>
  <a-modal
    :visible="visible"
    centered
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :closable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="备注">
          <a-textarea
            v-decorator="['newRemark', {'initialValue':model.newRemark,rules: [{ required: true, message: '请输入备注!' },{max:50,message:'备注最多50个字符!'}]} ]"
            placeholder="备注"
            :autoSize="{ minRows: 6, maxRows: 6 }"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'ModifyRemarkModal',
  data() {
    return {
      visible: false,
      title: '备注',
      confirmLoading: false,
      form: this.$form.createForm(this),
      model: {},
      url: {
        submitBatch: '/hrBase/tsettledomain/updateRemarkById'
      }
    }
  },
  methods: {
    showModal(record) {
      this.model = record
      this.visible = true
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          const url = `${this.url.submitBatch}?id=${this.model.id}&newRemark=${values.newRemark}`
          httpAction(url ,null,'post').then((res) => {
            if (Number(res.code) === 200) {
              that.$message.success(`修改成功！`)
              that.$emit('ok',values.newRemark)
            } else {
              that.$message.warning(res.msg)
            }
          }).finally(() => {
            that.confirmLoading = false
            that.close()
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
      this.model = {}
    }
  }
}
</script>

<style scoped>
</style>