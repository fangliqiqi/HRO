<template>
  <a-modal
    :visible="visible"
    :width="500"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
    okText="提交"
    :maskClosable="false"
    :closable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="vertical" class="settleForm">
        <a-row :span="24">
          <a-col :span="12">
            <a-form-item class="formLabel" label="企业微信审批编号">
              <a-input
                v-decorator="['wxNo',validate.wxNo]"
                placeholder="企业微信审批编号"
                style="width:200px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item class="formLabel" label="内部计收金额">
              <a-input
                v-decorator="['innerMoney',validate.innerMoney]"
                placeholder="内部计收金额"
                style="width:150px"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <settlement-submit-modal ref="SettlementSubmitForm" @ok="submitOk"></settlement-submit-modal>
  </a-modal>
</template>

<script>
// import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import SettlementSubmitModal from './SettlementSubmitModal'

export default {
  name: 'InternalCounterModal',
  components: {
    SettlementSubmitModal
  },
  data() {
    return {
      visible: false,
      title:'内部计收',
      confirmLoading: false,
      form: this.$form.createForm(this),
      validate:{
        wxNo:{rules:[{required: true,message: '请输入企业微信审批编号！'}]},
        innerMoney:{
          rules:[
            {
              required: true,
              message: '请输入内部计收金额！',
            },{
            pattern: /^(0|([1-9][0-9]{0,8})|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: '内部计收金额格式不正确!'
          }]
        },
      },
      settleDomainInfo:{}, // 结算主体信息
      idObj:{
        mid:null,
        bid:null
      }
    }
  },
  methods: {
    show(settleDomain){
      this.settleDomainInfo = settleDomain
      this.visible = true
    },
    edit(record,settleDomain){
      this.settleDomainInfo = settleDomain
      this.visible = true
      this.idObj = {
        bill:record.bill.id,
        businessMain:record.businessMain.id,
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({wxNo:record.bill.wxNo,innerMoney:record.bill.innerMoney},'wxNo','innerMoney'))
      })
    },
    handleOk(){
      this.form.validateFields((err, values) => {
        if (!err) {
          values = Object.assign(values,{tax:this.settleDomainInfo.departSettlementInfo.taxFee})
          let params = {bill:values,businessMain:{settleDomainId:this.settleDomainInfo.settleDomain.id,serverItem:this.settleDomainInfo.settleDomain.serverItem}}
          let url = `/hrOneTime/tnewsettle/saveTNewSettleVo`
          if(this.idObj.bill){
            params.bill.id = this.idObj.bill
            params.businessMain.id = this.idObj.businessMain
            url = `/hrOneTime/tnewsettle/updateTNewSettleVo`
          }
          this.$refs.SettlementSubmitForm.showModal(params,'post',url)
        }
      })
    },
    handleCancel(){
      this.visible = false
      this.settleDomainInfo = {}
      this.idObj = {
        bill:null,
        businessMain:null,
      }
    },
    submitOk(){
      this.handleCancel()
      this.$emit('ok')
    },
  }
}
</script>

<style lang="less" scoped>

</style>