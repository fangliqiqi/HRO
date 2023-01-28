<template>
  <a-modal
    :title="title"
    :width="820"
    placement="right"
    :closable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="保存"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item label="保险公司名称" class="formLabel">
              <a-input
                style="width:240px"
                placeholder="保险公司名称"
                v-decorator="['companyName', validatorRules.companyName ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="保险公司地址" class="formLabel">
              <a-input
                style="width:240px"
                placeholder="保险公司地址"
                v-decorator="['companyAddr',validatorRules.companyAddr]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="保险公司对接人" class="formLabel">
              <a-input
                style="width:240px"
                placeholder="保险公司对接人"
                v-decorator="['companyDocking',validatorRules.companyDocking]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- <a-row>
          <a-col :span="12">
            <a-form-item label="创建人" style="margin-left:55px;">
              <a-input
                :disabled="true"
                style="width:240px"
                v-decorator="['createUser']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="创建时间" style="margin-left:55px;">
              <a-input
                :disabled="true"
                style="width:240px"
                v-decorator="['createTime']"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="最近一次修改人">
              <a-input
                :disabled="true"
                style="width:240px"
                v-decorator="['lastUpdateUser']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最近一次修改时间">
              <a-input
                :disabled="true"
                style="width:240px"
                v-decorator="['lastUpdateTime']"
              />
            </a-form-item>
          </a-col>
        </a-row>
         -->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'

export default {
  name: 'InsuranceCompanyModal',
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        companyName: { rules: [{ required: true, message: '请填写保险公司名称!' }] },
        companyAddr: { rules: [{ required: true, max:50,message: '请填写正确的保险公司地址!' }] },
        companyDocking: { rules: [{ required: true,max:10, message: '请填写正确的保险公司对接人!' }] },
      },
      url: {
        add: '/busiInsurance/tinsurancecompany',
        edit: '/busiInsurance/tinsurancecompany',
      }
    }
  },
  methods: {
    add() {
      this.form.resetFields()
      this.visible = true
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'companyAddr', 'companyDocking','companyName'))
      })
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          const formData = Object.assign(that.model, values)
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
            delete formData.lastUpdateTime
            delete formData.lastUpdateUser
            delete formData.createUser
            delete formData.createTime
          }
          httpAction(httpurl, formData, method).then((res) => {
            if (res.code === 200) {
              that.$message.success(`${that.title}成功！`)
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
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
      this.model = {}
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
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
.formLabel {
  :global(.ant-form-item-label) {
    width: 120px;
  }
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
