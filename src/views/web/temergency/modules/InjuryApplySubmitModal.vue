<template>
  <a-modal
    :title="title"
    :width="'90%'"
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
      <a-form :form="form" layout="inline" class="ant-advanced-search-form">
        <a-row>
          <a-col :span="8">
            <a-row>
              <a-col :span="24">
                <a-form-item label="审核人类型" :label-col="{ span: 24 }">
                  <a-radio-group @change="auditChange" v-decorator="['auditType', validatorRules.auditType]">
                    <a-radio value="depart"> 部门/子公司 </a-radio>
                    <a-radio value="subsidiary"> 分公司 </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="24">
                <a-form-item
                  :label="auditType !== 'subsidiary' ? '部门负责人' : '分公司负责人'"
                  :wrapper-col="{ span: 24 }"
                >
                  <a-select
                    showSearch
                    placeholder="请选择"
                    style="width: 200px"
                    optionFilterProp="children"
                    v-decorator="['man', validatorRules.man]"
                    @change="selectSp"
                    :filterOption="filterOption"
                  >
                    <a-select-option v-for="item in userList" :key="item.userId" :value="item.userId">{{
                      item.nickname
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-if="auditType === 'subsidiary'">
              <a-col :span="24">
                <a-form-item label="大区总" :wrapper-col="{ span: 24 }">
                  <a-select
                    showSearch
                    placeholder="请选择"
                    style="width: 200px"
                    optionFilterProp="children"
                    v-decorator="['auditTwoMan', validatorRules.man]"
                    @change="selectTwoSp"
                    :filterOption="filterOption"
                  >
                    <a-select-option v-for="item in userList" :key="item.userId" :value="item.userId">{{
                      item.nickname
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8" v-if="idRetired">
            <a-row>
              <h3>办理人</h3>
              <a-form-item label="请选择办理人">
                <a-select
                  showSearch
                  placeholder="请选择"
                  style="width: 200px"
                  optionFilterProp="children"
                  v-decorator="['socialHandleMan', { rules: [{ required: true, message: '请选择办理人' }] }]"
                  @change="selectGs"
                  :filterOption="filterOption"
                >
                  <a-select-option v-for="item in dealUserList" :key="item.userId" :value="item.userId">{{
                    item.nickname
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-row>
          </a-col>
          <a-col :span="16" v-if="isHandle">
            <a-row>
              <a-col :span="24">
                <h3 style="margin-bottom: 17px">办理人</h3>
              </a-col>
              <a-col :span="10" v-if="isSocial">
                <a-form-item label="">
                  <a-checkbox @change="onGsChange" :checked="isShowGs" v-decorator="['isSocial', { initialValue: 0 }]">工伤理赔</a-checkbox>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="">
                  <a-checkbox
                    @change="onSxChange"
                    :checked="isShowSx"
                    :disabled="!isSocial"
                    v-decorator="['isInsurance', { initialValue: 1 }]"
                  >商险理赔</a-checkbox>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="10" v-if="isSocial">
                <a-form-item label="请选择工伤理赔办理人" v-if="isShowGs">
                  <a-select
                    showSearch
                    placeholder="请选择"
                    style="width: 200px"
                    @change="selectGs"
                    optionFilterProp="children"
                    v-decorator="[
                      'socialHandleMan',
                      { rules: [{ required: isShowGs, message: '请选择工伤理赔办理人' }] },
                    ]"
                    :filterOption="filterOption"
                  >
                    <a-select-option v-for="item in dealUserList" :key="item.userId" :value="item.userId">{{
                      item.nickname
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item label="请选择商险理赔办理人" v-if="isShowSx">
                  <a-select
                    showSearch
                    placeholder="请选择商险理赔办理人"
                    @change="selectSx"
                    style="width: 200px"
                    optionFilterProp="children"
                    v-decorator="[
                      'insuranceHandleMan',
                      { rules: [{ required: isShowSx, message: '请选择商险理赔办理人' }] },
                    ]"
                    :filterOption="filterOption"
                  >
                    <a-select-option v-for="item in dealUserList" :key="item.userId" :value="item.userId">{{
                      item.nickname
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
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
  name: 'InjuryApplySubmitModal',
  data() {
    return {
      model: {},
      title: '提交审核与办理',
      visible: false,
      confirmLoading: false,
      userList: [], // 审批人
      dealUserList: [], // 工伤理赔办理人
      manName: '', //审核人姓名
      auditTwomManName: '', // 大区总审核姓名
      socialHandleManName: '', //社保理赔办理人姓名
      insuranceHandleManName: '', //商险理赔办理人姓名
      form: this.$form.createForm(this),
      method: 'post',
      isShowGs: true,
      isShowSx: true,
      isHandle: true, //退工审核使用
      idRetired: false, //退工审核使用
      isSocial: true, //显示工伤审核
      isJury: true, //显示商险审核
      permissionStr: {}, //权限
      auditType: "depart", // 审核类型
      validatorRules: {
        man: { rules: [{ required: true, message: '请选择指派人!' }] },
        auditType: { rules: [{ required: true, message: '请选择审核人类型!' }],initialValue:'depart' },
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
        getUserListUrl: '/admin/user/findUserBypPrmission',
        submitUrl: '/hrEmergency/tworkinjuryevent/batch/commit', //批量提交审核
      },
    }
  },
  methods: {
    auditChange(event) {
      console.log('审核人类型改变：', event)
      this.auditType = event.target.value
    },
    edit(record) {
      this.model = Object.assign({}, record)
      httpAction(this.url.getUserListUrl + '?permissionStr=' + this.permissionStr.audit, '', 'GET')
        .then((res) => {
          if (res.code !== 200) {
            this.$message.error(res.msg)
            return false
          } else {
            this.userList = res.data
          }
        })
        .finally(() => {
          httpAction(this.url.getUserListUrl + '?permissionStr=' + this.permissionStr.handle, null, 'GET').then(
            (res) => {
              if (res.code == 200) {
                this.dealUserList = res.data
                this.visible = true
                // 默认选中史伟鹏 148
                if (this.isShowSx) {
                  this.$nextTick(() => {
                    this.form.setFieldsValue(pick({ insuranceHandleMan: 148 }, 'insuranceHandleMan'))
                  })
                  this.insuranceHandleManName = '史伟鹏'
                }
              } else {
                this.$message.error(res.msg)
              }
            }
          )
        })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    selectSp(value, option) {
      this.manName = option.componentOptions.children[0].text
    },
    selectTwoSp(value, option) {
      this.auditTwomManName = option.componentOptions.children[0].text
    },
    selectGs(value, option) {
      this.socialHandleManName = option.componentOptions.children[0].text
    },
    selectSx(value, option) {
      this.insuranceHandleManName = option.componentOptions.children[0].text
    },
    onGsChange(e) {
      this.isShowGs = e.target.checked
      if (!e.target.checked) {
        this.socialHandleMan = ''
        this.socialHandleManName = ''
      }
    },
    onSxChange(e) {
      this.isShowSx = e.target.checked
      if (!e.target.checked) {
        this.insuranceHandleMan = ''
        this.insuranceHandleManName = ''
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({ insuranceHandleMan: 148 }, 'insuranceHandleMan'))
        })
        this.insuranceHandleManName = '史伟鹏'
      }
    },
    // 保存按钮
    handleOk() {
      const _this = this

      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          let isSocial = this.form.getFieldValue('isSocial')
          let isInsurance = this.form.getFieldValue('isInsurance')

          if (isSocial === false && isInsurance === false) {
            this.$message.warning('工伤理赔和商险理赔必须选一个')
            return false
          }

          let params = {
            isSocial: isSocial === true || isSocial === 0 ? 0 : 1,
            isInsurance: isInsurance === true || isInsurance === 0 ? 0 : 1,
            idArray: [this.model.id],
            man: values.man,
            manName: this.manName,
            socialHandleManName: this.socialHandleManName||' ',
            insuranceHandleManName: this.insuranceHandleManName,
            socialHandleMan: values.socialHandleMan ||' ',
            insuranceHandleMan: values.insuranceHandleMan || '',
          }
          
          if (_this.auditType === 'subsidiary') {
            // 分公司审核需要提交 大区总信息
            params.auditTwoMan = values.auditTwoMan
            params.auditTwoManName = this.auditTwomManName
          }else{
            params.auditTwoMan = ''
            params.auditTwoManName = ''
          }

          _this.confirmLoading = true
          const httpurl = this.url.submitUrl
          httpAction(httpurl, params, this.method)
            .then((res) => {
              const msg = res.msg || res.message
              if (res.code === 200) {
                _this.$message.success(`${_this.title}成功！`)
                _this.close()
                _this.$emit('ok')
              } else {
                _this.$message.warning(msg)
              }
            })
            .finally(() => {
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
      this.manName = ''
      this.auditType = 'depart'
      this.auditTwomManName = ''
      this.dealUserList = this.userList = []
      this.visible = this.idRetired = false
      this.isShowGs = this.isShowSx = this.isHandle = this.isSocial = this.isJury = true
    },
  },
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
