<template>
  <a-modal
    :title="title"
    :visible="visible"
    :centered="true"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
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
              :value="item.user_id||item.userId"
            >{{ item.nickname }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
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
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'SettlementSubmitModal',
  data() {
    return {
      visible: false,
      title: '提交审核',
      confirmLoading: false,
      form: this.$form.createForm(this),
      auditUsers: [],
      model: {},
      method: '',
      url: '',
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
    }
  },
  methods: {
    showModal(record,method,url,type) {
      this.model = record
      this.method = method
      this.url = url
      if(type==1){
        httpAction('/admin/user/getUserByRoleNameAndClient?clienId=wxhr&roleName=事务外包结算单审核', null, 'GET').then((res) => {
          if(res.code === 200) {
            this.auditUsers = res.data
            this.visible = true
          }
        })
      }else{
        httpAction('admin/user/findUserBypPrmission?permissionStr=wxhr:tsettledomain_audit', null, 'GET').then((res) => {
          if(res.code === 200) {
            this.auditUsers = res.data
            this.visible = true
          }
        })
      }
      
    },
    testChange(t,v) {
      this.auditPojo.prAuditMan = t
      this.auditPojo.prAuditManName = v.componentOptions.children[0].text
    },
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          values.prAuditMan = _this.auditPojo.prAuditMan
          values.prAuditManName = _this.auditPojo.prAuditManName
          const formData = Object.assign(_this.model, values)
          if(_this.method === 'put'){
            if(formData.settleDomain){
              formData.settleDomain.dpAuditMan = ""
              formData.settleDomain.dpAuditManName = ""
              formData.settleDomain.dpAuditOpinion = ""
              formData.settleDomain.auditTime = ""
              formData.settleDomain.managerAuditMan = values.prAuditMan
              formData.settleDomain.managerAuditManName = values.prAuditManName
              formData.settleDomain.managerAuditTime = ""
              formData.settleDomain.managerAuditOpinion = ""
              formData.settleDomain.belongContract = formData.settleDomain.belongContract || ""
            }
          }
          formData.lastAuditDate = formData.lastAuditDate ? formData.lastAuditDate.format('YYYY-MM-DD') : null
          if(formData.approvalFormTickect && Object.keys(formData.approvalFormTickect).length === 0){
            formData.approvalFormTickect = null
          }
          if(formData.businessRisksSettlement && Object.keys(formData.businessRisksSettlement).length === 0){
            formData.businessRisksSettlement = null
          }
          if(formData.departSettlementInfo && formData.departSettlementInfo.unitSeriousIllnessProp == ''){
            delete formData.departSettlementInfo.unitSeriousIllnessProp
          }

          httpAction(_this.url , formData, _this.method).then((res) => {
            if (res.code === 200) {
              _this.$message.success(`提交成功！`)
              _this.$emit('ok')
            } else {
              _this.$message.warning(res.msg)
            }
          }).finally(() => {
            _this.confirmLoading = false
            _this.close()
          })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.form.resetFields()
      this.visible = false
      this.auditPojo = {}
      this.model = {}
      this.confirmLoading = false
    }
  }
}
</script>

<style scoped>
</style>