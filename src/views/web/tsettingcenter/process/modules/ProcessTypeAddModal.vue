<template>
  <a-modal
    :title="title"
    :width="800"
    placement="right"
    :closable="true"
    @ok="handleOk"
    @cancel="close"
    cancelText="关闭"
    okText="保存"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <a-form
      :form="form"
      layout="inline"
      class="ant-advanced-search-form margin-left-explain"
    >
      <a-row>
        <a-col :span="24">
          <a-form-item
            class="stepFormText"
            label="流程名称"
          >
            <a-input
              placeholder="请输入流程名称"
              style="width:400px"
              v-decorator="['name', validatorRules.name ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            class="stepFormText"
            label="流程描述"
          >
            <a-textarea
              :rows="4"
              style="width:400px;resize:none;"
              placeholder="请输入流程描述"
              v-decorator="['description', validatorRules.description ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

    </a-form>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'ProcessTypeAddModal',
    data() {
      return {
        model: {},
        title: '流程',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        method:'POST',
        validatorRules:{
          name:{rules: [{ required: true, message: '请输入流程名称!' }]},
          description:{rules: [{ required: true, message: '请输入流程描述!' }]},
        },
        url: {
          saveUrl: '/process/tprocess', // 保存
        }
      }
    },
    methods: {
      // 添加
      add() {
        this.visible = true
      },
      // 编辑
      edit(record) {
        this.visible = true
        this.model = record
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(record,'name','description'))
        })
      },
      // 保存按钮
      handleOk() {
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            values.id = this.model.id
            httpAction(this.url.saveUrl, values,this.method).then((res) => {
              if (Number(res.code) === 200) {
                this.$message.success('保存成功！')
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
      close() {
        this.visible = false
        this.method = 'POST'
        this.model = {}
        this.$emit('close')
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
</style>
