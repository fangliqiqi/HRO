<template>
  <a-modal
    :title="title"
    :width="900"
    placement="right"
    :closable="true"
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
        <a-row :gutter="24">
          <a-col :span="9">
            <a-form-item label="保单号" class="stepFormText">
              <a-input
                placeholder="请输入保单号"
                style="width: 200px"
                v-decorator="['policyNo']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="15">
            <a-form-item label="实际保费" class="stepFormText">
              <a-input
                placeholder="请输入实际保费"
                v-decorator="['buyPay',validatorRules.buyPay]"
                style="width: 200px"
              />
              &nbsp;购买标准：{{ model.buyStandard }}元
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="9">
            <a-form-item label="身份证号" class="stepFormText">
              <a-input
                style="width: 200px"
                :disabled="true"
                v-decorator="['empIdcardNo']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="15">
            <a-form-item label="发票号" class="stepFormText">
              <a-input
                placeholder="请输入发票号"
                style="width: 200px"
                v-decorator="['invoiceNo']"
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
  import pick from 'lodash.pick'

  export default {
    name: 'DispatchApplyEditModal',
    data() {
      return {
        id: '',
        model: {},
        title: '办理',
        visible: false,
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
        validatorRules: {
          buyPay: { rules: [{validator: (rule,value, callback)=>{
          if(value){
            if( ! /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) || value < 0.01){
              callback('实际保费格式不正确!')
            }
          }
          callback()
        }}] },
        },
        url: {
          editUrl: '/busiInsurance/tbusinessinsurance/modify'
        }
      }
    },
    methods: {
      edit(record) {
        this.visible = true
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.id = record.id
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'buyPay', 'empIdcardNo','invoiceNo','policyNo'))
        })
      },
      // 保存按钮
      handleOk() {
        const _this = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            _this.confirmLoading = true
            const httpurl = this.url.editUrl
            const method = 'put'
            values.id=_this.id

            httpAction(httpurl, values, method).then((res) => {
              if (res.code === 200) {
                _this.$message.success(`${_this.title}成功！`)
                _this.$emit('ok')
                _this.close()
              } else {
                _this.$message.warning(res.msg)
              }
            }).finally(() => {
              _this.confirmLoading = false
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
        this.form.resetFields()
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
.stepFormText {
  :global(.ant-form-item-label) {
    width: 75px;
  }
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
</style>
