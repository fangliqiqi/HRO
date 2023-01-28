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
            style="width: 180px"
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
        <!--<a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="最迟审核时间"
        >
          <a-date-picker
            showTime
            format="YYYY-MM-DD"
            placeholder="请选择迟审核时间"
            v-decorator="[ 'lastAuditDate',{}]"
          />
        </a-form-item>-->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'BeforeAuditModal',
  data() {
    return {
      visible: false,
      title: '提交审核',
      id: "",
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
        submitBatch: '/hrBase/tsettledomain/batch/commit'
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
        values.prAuditMan = that.auditPojo.prAuditMan;
        values.prAuditManName = that.auditPojo.prAuditManName;

        values.id = that.id;
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign(this.model, values)
          // formData.lastAuditDate = formData.lastAuditDate ? formData.lastAuditDate.format('YYYY-MM-DD') : null

          let url = this.url.submitBatch + "?id=" + formData.id + "&prAuditMan=" + formData.prAuditMan + "&prAuditManName=" + formData.prAuditManName;
                    // + "&lastAuditDate=" + formData.lastAuditDate;

          httpAction(url , null, 'POST').then((res) => {
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
    }
  }
}
</script>

<style scoped>
</style>