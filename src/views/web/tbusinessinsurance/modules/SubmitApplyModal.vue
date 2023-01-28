<template>
  <a-modal
    :title="title"
    :width="700"
    placement="right"
    :closable="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="提交"
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
            <a-form-item label="办理状态">
              <a-radio-group
                @change="onChange"
                v-decorator="['auditStatus',{ rules: [{ required: true, message: '请选择状态!' }] }]"
              >
                <a-radio :value="1">通过</a-radio>
                <a-radio :value="2">未通过</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item label="办理备注">
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
      <error-modal ref="errorModal" @ok="errorOk"></error-modal>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import ErrorModal from '../../global/modules/ErrorModal'
  import pick from 'lodash.pick'

  export default {
    name: 'SubmitApplyModal',
    components: {
      ErrorModal
    },
    data() {
      return {
        ids: '',
        model: {},
        title: '办理',
        visible: false,
        confirmLoading: false,
        auditStatus:'',
        type:'0',
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
          handleUrl: '/busiInsurance/tbusinessinsurance/handle', //办理
          handleBatch:'/busiInsurance/tbusinessinsurance/batchHandle', //批量办理
        }
      }
    },
    methods: {
      edit(record) {
        this.model = Object.assign({}, record)
        this.visible = true
      },
      onChange(e){
        let msg = (e.target.value == 1) ? '通过' : '不通过'
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
            const httpurl = (_this.type === '0') ? this.url.handleUrl : this.url.handleBatch
            const method = 'put'
            let params
            if(_this.type === '0'){
              values.businessInsuranceId=_this.id
              params = values
            }else{
              params = []
              for(const item of _this.id){
                params.push({
                  auditStatus:values.auditStatus,
                  auditRemark:values.auditRemark,
                  businessInsuranceId:item
                })
              }
            }
            httpAction(httpurl, params, method).then((res) => {
              const msg = res.msg || res.message
              if (res.code === 200) {
                _this.$message.success("办理成功！")
                _this.$emit('ok')
                _this.close()
              } else {
                if(res.errorMessageList && res.errorMessageList.length){
                  _this.$refs.errorModal.title = '办理提示: ' + msg
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.errorMessageList)
                }else{
                  _this.$message.warning(msg)
                }
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
      errorOk(){
        this.$emit('ok')
        this.close()
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
</style>
