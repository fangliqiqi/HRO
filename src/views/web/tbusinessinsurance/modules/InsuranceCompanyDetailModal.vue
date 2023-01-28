<template>
  <a-modal
    :title="title"
    :width="900"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    cancelText="关闭"
    :visible="visible"
    :footer="null"
  >

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
      >
        <a-row>
          <a-col :span="10">
            <a-form-item
              label="保险公司名称"
              class="formLabel"
            >
              <!-- <span
                :title="model.companyName"
                class="overflow"
              >{{ model.companyName }}</span> -->
              <a-tooltip>
                <template slot="title">
                  {{ model.companyName }}
                </template>
                {{ model.companyName }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="14">
            <a-form-item
              label="保险公司地址"
              class="formLabel"
            >
              <!-- <span
                :title="model.companyAddr"
                class="overflow"
              >{{ model.companyAddr }}</span> -->
              <a-tooltip>
                <template slot="title">
                  {{ model.companyAddr }}
                </template>
                {{ model.companyAddr }}
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-item
              label="保险公司对接人"
              class="formLabel"
            >
              {{ model.companyDocking }}
            </a-form-item>
          </a-col>
          <a-col :span="14">
            <a-form-item
              label="创建人"
              class="formLabel"
            >
              {{ model.createUser }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-item
              label="创建时间"
              class="formLabel"
            >
              {{ model.createTime }}
            </a-form-item>
          </a-col>
          <a-col :span="14">
            <a-form-item
              label="最后更新人"
              class="formLabel"
            >
              {{ model.lastUpdateUser }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-item
              label="最后更新时间"
              class="formLabel"
            >
              {{ model.lastUpdateTime }}
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

export default {
  name: 'InsuranceCompanyDetailModal',
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
      }
    }
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close');
      this.visible = false;
      this.disableSubmit = false;
      this.model= {}
    }
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
.overflow {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  color: #000000a6 !important;
}
</style>
