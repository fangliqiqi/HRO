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
          <a-col :span="8">
            <h3>审核人</h3>
            <a-form-item label="">
              提交后默认督察办审核
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-row>
              <a-form-item label="请选择办理人">
                <a-select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择"
                  style="width: 200px"
                  v-decorator="['socialHandleMan',{ rules: [{ required: true, message: '请选择办理人' }] }]"
                  @change="getManName"
                  :filterOption="filterOption"
                >
                  <a-select-option
                    v-for="(item) in userList"
                    :key="item.nickname"
                    :value="item.userId"
                  >{{ item.nickname }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'

  export default {
    name: 'AbitrationSubmitModal',
    data() {
      return {
        model: {},
        title: '提交办理',
        visible: false,
        confirmLoading: false,
        userList:[],
        socialHandleManName:'', //社保理赔办理人姓名
        form: this.$form.createForm(this),
        method:'post',
        permissionStr:'wxhr:tAbitrationEvent_audit_pass',

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
          submitUrl:'/hrEmergency/tabitrationevent/batch/commit' //批量提交审核
        }
      }
    },
    methods: {
      edit(record) {
        this.model = Object.assign({}, record)
        httpAction(this.url.getUserListUrl+'?permissionStr='+this.permissionStr,'','GET').then((res) => {
          if(res.code != 200){
            this.$message.error(res.msg)
            return false
          }else{
            this.userList = res.data
            this.visible = true
          }
        })
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      getManName(value,option){
        this.socialHandleManName = option.key
      },
      // 保存按钮
      handleOk() {
        const _this = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            let params = {
              idArray:[this.model.id],
              socialHandleManName:this.socialHandleManName,
              socialHandleMan:values.socialHandleMan
            }
            _this.confirmLoading = true
            let httpurl = this.url.submitUrl
            httpAction(httpurl, params, this.method).then((res) => {
              let msg = res.msg || res.message
              if (res.code === 200) {
                _this.$message.success(_this.title + '成功！')
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
        this.manName=''
        this.visible = false
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