<template>
  <a-modal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        class="ant-advanced-search-form"
      >
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="审核人姓名"
        >
          <a-select
            showSearch
            placeholder="请选择审核人"
            optionFilterProp="children"
            style="width: 195px"
            @change="testChange"
            v-decorator="['prAuditMan', validatorRules.auditUserRequired ]"
          >
            <a-select-option
              v-for="(item, index) in auditUsers"
              :key="index"
              :value="item.userId"
            >{{ item.nickname }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="最迟审核时间"
        >
          <a-date-picker
            :format="dateFormat"
            style="width: 195px"
            :disabledDate="disabledDate"
            placeholder="请选择迟审核时间"
            v-decorator="['lastAuditDate', {}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { httpActionHeader } from '@/api/manage'

export default {
  name: 'BusinessOutSourcingAuditModule',
  data() {
    return {
      visible: false,
      title: '提交客户审核',
      id: "",
      dateFormat: 'YYYY-MM-DD',
      confirmLoading: false,
      form: this.$form.createForm(this),
      labelInValue: true,
      auditUsers: [],
      model: {},
      auditPojo: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      validatorRules: {
        auditUserRequired: { rules: [{ required: true, message: '审核人不能为空!' }] },
      },
      url: {
        submitBatch: '/hrOneTime/tbusinessoutsourcingmain/submit'
      }
    }
  },
  methods: {
    showModal(res) {
      this.id = res;
      this.visible = true
      this.form.resetFields()
    },
    testChange(t,v) {
      this.auditPojo.prAuditMan = t;
      this.auditPojo.prAuditManName = v.componentOptions.children[0].text;
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let object = Object.assign(this.model, values)
          let formData = new Object();
          formData.id = that.id;
          formData.userId = object.prAuditMan;
          formData.lastAuditDate = object.lastAuditDate ? object.lastAuditDate.format(this.dateFormat) : null

          let contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
          httpActionHeader(this.url.submitBatch , formData, 'POST', contextType).then((res) => {
            if (res.code === 200) {
              that.$message.success(`${that.title}成功！`)
              that.$emit('ok')
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
      this.confirmLoading = false
    },
    disabledDate(current) {
      return current < moment().startOf('day')
    },
  }
}
</script>

<style scoped>
</style>