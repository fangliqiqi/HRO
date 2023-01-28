<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="false"
      :destroyOnClose="false"
    >
      <a-form
        :form="form"
        layout="inline"
      >
        <a-form-item
          label="是否电子签"
        >
          <a-radio-group v-decorator="['isSign',{initialValue:'0'}]">
            <a-radio value="0">正常合同</a-radio>
            <a-radio value="1">需要电子签</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  export default {
    name: 'ContractTypeModal',
    data() {
      return {
        visible: false,
        title: '是否需要电子签',
        confirmLoading: false,
        form: this.$form.createForm(this),
        model:{},
      }
    },
    methods: {
      showModal(record) {
        this.model = record
        this.visible = true
      },
      handleOk() {
        const value = this.form.getFieldValue('isSign')
        this.$emit('ok',Object.assign(this.model,{isSign:value}))
        this.handleCancel()
      },
      handleCancel() {
        this.form.resetFields()
        this.visible = false
        this.model = {}
      }
    }
  }
</script>
