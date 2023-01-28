<template>
  <a-modal
    :title="title"
    :width="700"
    placement="right"
    :closable="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="确定审核"
    :visible="visible"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item label="审核" class="stepFormText">
              <a-radio-group
                @change="onChange"
                v-decorator="['auditStatus',{ rules: [{ required: true, message: '请选择审核状态!' }] }]"
              >
                <a-radio :value="1">通过</a-radio>
                <a-radio :value="2">未通过</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item label="备注原因" class="stepFormText">
              <a-textarea
                :rows="3"
                placeholder="请填写备注"
                v-decorator="['auditRemark',{ rules: [{ required: true, message: '请填写备注!' }] }]"
                style="width: 450px;resize:none;"
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
    name: 'SettlementAudit',
    data() {
      return {
        ids: '',
        model: {},
        title: '商险单独结算审核',
        visible: false,
        confirmLoading: false,
        auditStatus:'',
        type:'', //区分商险单独结算社和扫描审核

        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        url: {
          auditUrl: '/busiInsurance/tinsurancesettlementform/audit', //审核
        }
      }
    },
    methods: {
      edit(record) {
        this.model = Object.assign({}, record)
        this.visible = true
      },
      onChange(e){
        let msg = (e.target.value == 1) ? '审核通过' : '审核不通过'
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({auditRemark:msg}, 'auditRemark'))
        })
      },
      // 保存按钮
      handleOk() {
        const _this = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            _this.confirmLoading = true
            const httpurl = this.url.auditUrl
            const method = 'put'
            if(String(this.type) === 'settlement'){
              values.insuranceSettlementFormId = this.insuranceSettlementFormId
            }else{
              values.insuranceSettlementAutoFormId = this.insuranceSettlementAutoFormId
            }
            httpAction(httpurl, values, method).then((res) => {
              const msg = res.msg || res.message
              if (res.code === 200) {
                this.$message.success("审核成功！")
                _this.$emit('ok')
                _this.close()
              } else {
                _this.$message.warning(msg)
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
        this.form.resetFields()
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
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}
</style>
