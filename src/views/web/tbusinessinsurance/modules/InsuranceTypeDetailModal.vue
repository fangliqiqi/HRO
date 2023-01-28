<template>
  <a-modal
    :title="title"
    :width="900"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    :footer="null"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
      >
        <a-row>
          <a-col :span="8">
            <a-form-item label="险种" class="formLabel">
              <a-tooltip class="overflow">
                <template slot="title">
                  {{ model.name }}
                </template>
                {{ model.name }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="保险公司" class="formLabel">
              <a-tooltip class="overflow">
                <template slot="title">
                  {{ model.companyName }}
                </template>
                {{ model.companyName }}
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item label="收款银行" class="formLabel">
              {{ model.bankName }}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="收款银行账号" class="formLabel">
              {{ model.bankNo }}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="收款单位名称" class="formLabel">
              <a-tooltip class="overflow">
                <template slot="title">
                  {{ model.receiptUnitName }}
                </template>
                {{ model.receiptUnitName }}
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  
  export default {
    name: 'InsuranceTypeDetailModal',
    data() {
      return {
        title: '操作',
        visible: false,
        model: {},
        confirmLoading: false,
        form: this.$form.createForm(this),
        
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      }
    },
    methods: {
      show(record) {
        this.visible = true
        this.model = record
      },
     
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
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

.formLabel {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}

.overflow {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  color: #000000a6 !important;
  max-width: 150px;
}
</style>