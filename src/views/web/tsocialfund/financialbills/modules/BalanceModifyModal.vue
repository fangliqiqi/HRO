<template>
  <a-modal
    title="添加差余额原因"
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
          <a-col :span="12">
            <a-form-item
              label="产生月份"
              class="stepFormText"
            >
              <a-month-picker
                v-decorator="['createMonth',validatorRules.createMonth]"
                valueFormat="YYYYMM"
                placeholder="产生月份"
                style="width: 187px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="项目"
              class="stepFormText"
            >
              <a-input v-decorator="['subject',validatorRules.subject]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="金额"
              class="stepFormText"
            >
              <a-input v-decorator="['money',validatorRules.money]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="原因"
              class="stepFormText"
            >
              <a-textarea v-decorator="['reason',validatorRules.reason]" style="width:560px;height:60px;resize:none;"/>
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
  name: 'BalanceModifyModal',
  components: {
    
  },
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this),
      validatorRules: {
        createMonth: {rules: [
          { required: true, message: '请选择产生月份!' }
        ]},
        subject: {rules: [
          { required: true, message: '请输入项目!' },
          { max: 200, message: '最多200个字符!' },
        ]},
        money: {rules: [
          { required: true, message: '请输入金额!' },
          { pattern: moneyPattern, message: '请输入正确的金额!' }
        ]},
        reason: {rules: [
          { required: true, message: '请输入原因!' },
          { max: 200, message: '备注最多200个字符!' }
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
        this.form.setFieldsValue(pick(this.model, 'createMonth','subject','money','reason'))
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
          httpAction(`/hrSocial/tfinancebilldiff`,params,this.method).then(res=>{
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
