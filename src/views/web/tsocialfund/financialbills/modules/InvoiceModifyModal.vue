<template>
  <a-modal
    title="发票信息"
    :width="800"
    placement="right"
    @cancel="handleCancel"
    @ok="handleOk"
    :closable="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="发票类型"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择发票类型"
                v-decorator="['invoiceType',{rules: [{ required: true, message: '请选择发票类型！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 183px"
              >
                <a-select-option value="2">普票</a-select-option>
                <a-select-option value="0">专票</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="扣除金额"
              class="stepFormText"
            >
              <a-input
                v-decorator="['deductionAmount',validatorRules.deductionAmount]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="不含税收入"
              class="stepFormText"
            >
              <a-input v-decorator="['incomeExcludingTax',validatorRules.incomeExcludingTax]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="税额"
              class="stepFormText"
            >
              <a-input v-decorator="['taxFee',validatorRules.taxFee]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="发票金额"
              class="stepFormText"
            >
              <a-input v-decorator="['invoiceFee',validatorRules.invoiceFee]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="备注"
              class="stepFormText"
            >
              <a-textarea v-decorator="['remark',{rules:[{ max: 200, message: '备注最多200个字符!' }]}]" style="width:560px;height:60px;resize:none;"/>
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

const moneyPattern = /^((-?[0-9][0-9]{0,10})|((-?[0]\.\d{1,2}|-?[1-9][0-9]{0,9}\.\d{1,2}|-?[1-9][0-9]{0,10}\.\d)))$/;

export default {
  name: 'InvoiceModifyModal',
  components: {
    
  },
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this),
      validatorRules: {
        deductionAmount: {rules: [
          { required: true, message: '请输入扣除金额!' },
          { pattern: moneyPattern, message: '请输入正确的扣除金额!' }
        ]},
        incomeExcludingTax: {rules: [
          { required: true, message: '请输入不含税收入!' },
          { pattern: moneyPattern, message: '请输入正确的不含税收入!' }
        ]},
        taxFee: {rules: [
          { required: true, message: '请输入税额!' },
          { pattern: moneyPattern, message: '请输入正确的税额!' }
        ]},
        invoiceFee: {rules: [
          { required: true, message: '请输入发票金额!' },
          { pattern: moneyPattern, message: '请输入正确的发票金额!' }
        ]}
      },
      confirmLoading: false,
      method: 'POST',
      id: null,
      model: {},

    }
  },
  methods: {
    show(id,record){
      this.visible = true;
      this.id = id;
      this.model = record;
      this.method = Object.keys(record).length ? 'PUT' : 'POST';
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'invoiceType','deductionAmount','incomeExcludingTax',
          'taxFee','invoiceFee','remark'))
      })
    },
    handleOk(){
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true;
          let params = {};
          if(this.method === 'POST'){
            params = {...values,...{billId:this.id}};
          }else{
            params = {...{id:this.model.id,billId:this.id},...values};
          }
          httpAction(`/hrSocial/tfinanceInvoice`,params,this.method).then(res=>{
            if(res.code === 200){
              this.handleCancel();
              this.$emit('ok');
            }else{
              this.$message.warning(res.msg);
            }
          }).finally(()=>{
            this.confirmLoading = false;
          })
        }
      })
    },
    handleCancel(){
      this.visible = false;
      this.model = {};
      this.confirmLoading = false;
    }
  }
}


</script>

<style lang="less" scoped>
.stepFormText {
  margin-bottom: 10px;
  height: 50px;
  :global(.ant-form-item-label) {
    width: 120px;
  }
}

</style>
