<template>
  <a-modal
    :title="title"
    :width="800"
    placement="right"
    :closable="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="提交"
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
          <a-col :span="24" v-if="isShowGs">
            <a-form-item
              label="工伤理赔办理人"
              class="labelTxt"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择工伤理赔办理人"
                style="width: 200px"
                @select="selectGs"
                v-decorator="['socialHandleMan',{ rules: [{ required: true, message: '请选择工伤理赔办理人' }] }]"
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="(item) in dealUserList"
                  :key="item.userId"
                  :value="String(item.userId)"
                >{{ item.nickname }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="isShowSx">
            <a-form-item
              label="商险理赔办理人"
              class="labelTxt"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择商险理赔办理人"
                @select="selectSx"
                style="width: 200px"
                v-decorator="['insuranceHandleMan',{ rules: [{ required: true, message: '请选择商险理赔办理人' }] }]"
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="(item) in dealUserList"
                  :key="item.userId"
                  :value="String(item.userId)"
                >{{ item.nickname }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-row>
              <a-form-item
                label="移交原因"
                class="labelTxt"
              >
                <a-textarea
                  style="width: 400px;height:150px;resize:none;"
                  v-decorator="['remake',{ rules: [{ required: true, message: '请选输入移交原因' }] }]"
                >
                </a-textarea>
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
  import pick from 'lodash.pick'

  export default {
    name: 'HandleManModal',
    data() {
      return {
        model: {},
        title: '移交办理',
        visible: false,
        confirmLoading: false,
        dealUserList:[], // 工伤理赔办理人
        isShowGs:true,
        isShowSx:true,
        handelMan:{
          isSocial:0,
          socialHandleMan:'',
          socialHandleManName:'',
          isInsurance:0,
          insuranceHandleMan:'',
          insuranceHandleManName:'',
        },
        // socialHandleManName:'', //工伤理赔办理人姓名
        // insuranceHandleManName:'', //商险理赔办理人姓名
        form: this.$form.createForm(this),
        method:'post',
        permissionStr:{}, //权限
        validatorRules: {
          man: { rules: [{ required: true, message: '请选择指派人!' }] },
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
          submitUrl:'/hrEmergency/tworkinjuryevent/toOtherMan' //批量提交审核
        }
      }
    },
    methods: {
      edit(record) {
        this.model = Object.assign({}, record)
        httpAction(`${this.url.getUserListUrl}?permissionStr=${this.permissionStr.handle}`,null,'GET').then((res)=>{
          if(res.code === 200){
            this.dealUserList = res.data
            this.visible = true
            if(this.isShowGs){
              this.$nextTick(() => {
                this.form.setFieldsValue(pick({socialHandleMan:String(this.model.handleMan)},'socialHandleMan'))
              })
              this.handelMan.socialHandleManName = this.model.handleManName
            }
            if(this.isShowSx){
              this.$nextTick(() => {
                this.form.setFieldsValue(pick({insuranceHandleMan:String(this.model.insuranceHandleMan)},'insuranceHandleMan'))
              })
              this.handelMan.insuranceHandleManName = this.model.insuranceHandleManName
            }
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      selectGs(value,option){
        this.handelMan.socialHandleManName = option.componentOptions.children[0].text
      },
      selectSx(value,option){
        this.handelMan.insuranceHandleManName = option.componentOptions.children[0].text
      },
      // 保存按钮
      handleOk() {
        const _this = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            const params = {
              idArray:[this.model.id],
              remake:values.remake,
            }
            if(this.isShowGs){
              params.isSocial = 0
              params.socialHandleMan = values.socialHandleMan || ''
              params.socialHandleManName = this.handelMan.socialHandleManName
            }
            if(this.isShowSx){
              params.isInsurance = 0
              params.insuranceHandleMan = values.insuranceHandleMan || ''
              params.insuranceHandleManName = this.handelMan.insuranceHandleManName
            }
            _this.confirmLoading = true
            const httpurl = this.url.submitUrl
            httpAction(httpurl, params, this.method).then((res) => {
              const msg = res.msg || res.message
              if (res.code === 200) {
                _this.$message.success(`${_this.title}成功！`)
                _this.close()
                _this.$emit('ok')
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
        this.dealUserList = this.userList = []
        this.visible = false
        this.isShowGs = this.isShowSx = true
        this.handelMan.insuranceHandleManName = this.handelMan.socialHandleManName = ''
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

.labelTxt {
  :global(.ant-form-item-label) {
    width: 150px;
  }
}
</style>
