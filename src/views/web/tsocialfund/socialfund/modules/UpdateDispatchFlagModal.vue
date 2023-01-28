<template>
  <a-modal
    :title="title"
    :width="600"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    okText="保存"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="margin-left-explain"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item>
              <a-textarea
                placeholder="请填写取消原因"
                :autoSize="false"
                :cols="100"
                :rows="4"
                v-decorator="['cancelRemark',{rules: [{ required: true, message: '请填写取消原因' },{max:100,message:'取消原因最多100个字符!'}]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'

  export default {
    name: 'UpdateDispatchFlagModal',
    data() {
      return {
        model: {},
        title: '取消派单',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        
        url: {
          exportXlsUrl: '', // 导出地址
        },
      }
    },
    methods: {
      show(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
      },
      // 保存按钮
      handleOk() {
        const qs = require('qs')
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            const params = qs.stringify({
              id:this.model.id,
              dispatchFlag:1,
              cancelRemark:values.cancelRemark
            })
            httpAction(`/hrSocial/tpredispatchinfo/updateDispatchFlag?${params}`, null,'post').then((res) => {
              if (res.code === 200) {
                that.$message.success(`保存成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.msg)
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          }
        })
      },
      // 表单关闭
      handleCancel() {
        this.close()
      },
      // 数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
      },
    }
  }
</script>

<style lang="less" scoped>

</style>
