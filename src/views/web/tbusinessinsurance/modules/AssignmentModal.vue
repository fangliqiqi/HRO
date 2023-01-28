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
            <a-form-item :label="formtext">
              <a-select
                showSearch
                placeholder="请选择"
                optionFilterProp="children"
                style="width: 200px"
                v-decorator="['userId',validatorRules.userId]"
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in userList"
                  :key="index"
                  :value="item.userId"
                >{{ item.nickname }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <error-modal ref="errorModal" @ok="errorOk"></error-modal>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import ErrorModal from '../../global/modules/ErrorModal'

  export default {
    name: 'AssignmentModal',
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
        userList:[],
        formtext:'',
        form: this.$form.createForm(this),
        method:'post',

        validatorRules: {
          userId: { rules: [{ required: true, message: '请选择指派人!' }] },
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        url: {
          getUserListUrl:'/admin/user/findUserBypPrmission',
          submitApplyUrl:'/busiInsurance/tbusinessinsurance/submitApply' //指派办理人
        }
      }
    },
    methods: {
      edit(record) {
        this.model = Object.assign({}, record)
        const url = `${this.url.getUserListUrl}?permissionStr=${this.pession}`
        httpAction(url,'','GET').then((res) => {
          if(res.code !== 200){
            this.$message.error(res.msg)
          }else{
            this.userList = res.data
            this.visible = true
          }
        })
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      // 保存按钮
      handleOk() {
        const _this = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            _this.confirmLoading = true
            const httpurl = this.url.submitApplyUrl
            let formData
            if(typeof(this.id) == 'object'){
              formData=[]
              for(const item of this.id){
                formData.push({
                  delegationUserId:values.userId,
                  businessInsuranceId:item
                })
              }
            }else{
              values.id = this.id
              formData = Object.assign(this.model, values)
            }
            httpAction(httpurl, formData, this.method).then((res) => {
              const msg = res.msg || res.message
              if (Number(res.code) === 200) {
                _this.$message.success(`${_this.title}成功！`)
                _this.$emit('ok')
                _this.close()
              } else {
                if(typeof(_this.id) == 'object' && res.errorMessageList && res.errorMessageList.length){
                  _this.$refs.errorModal.title = '批量办理提示: ' + msg
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
