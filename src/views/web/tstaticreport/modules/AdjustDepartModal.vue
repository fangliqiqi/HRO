<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="800"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="报销单编号"
            >
              <a-input
                v-decorator="['code', {rules: [{ required: true, message: '请输入报销单编号!' }]} ]"
                placeholder="报销单编号"
                @change="changeCode"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="结算状态"
            >
              &nbsp; {{ status }} &nbsp;
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="结算主体名称"
            >
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :placeholder="'请输入结算主体'"
                v-decorator="['departName', {rules: [{ required: true, message: '请输入结算主体!' }]} ]"
                :id="'departName'"
                :allowClear="false"
                :triggerChange="true"
                @change="settleChange"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="结算主体编码"
            >
              <a-input
                v-decorator="['departCode', {rules: [{ required: true, message: '请输入结算主体编码!' }]} ]"
                readOnly
                :disabled="true"
                placeholder="结算主体编码"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import SelectPage from '@/components/jeecg/SelectPage'
import pick from 'lodash.pick'
import { httpAction } from '@/api/manage'

export default {
  name: 'AdjustDepartModal',
  components: {
    SelectPage,
  },
  data(){
    return {
      title: '结算主体调整',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      url:'/salary/tstatisticsprojectreimburse/reimburseChangeDepart',
      status:'未关联',

    }
  },
  methods:{
    show(){
      this.visible = true;
    },
    settleChange(val,option){
      const info = option.context.lists[option.key]['item']
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({departName:val,departCode:info.departNo}, 'departName','departCode'))
      })
    },
    changeCode(e){
      httpAction(`/salary/tprojectreimbursedetail/checkChangeDataByParentId?code=${e.target.value}`,null,'get').then(res=>{
        if(res.code === 200){
          this.status = res.data ? '已关联' : '未关联';
        }else{
          this.$message.warning(res.msg);
        }
      })
    },
    handleOk(){
      const _this = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true;
          const qs = require('qs');
          const url = `${this.url}?${qs.stringify(values)}`;
          httpAction(url,{},'post').then(res=>{
            if(res.code === 200){
              this.$message.success(res.msg);
              this.handleCancel();
              this.$emit('ok');
            }else{
              this.$message.warning(res.msg);
            }
          }).finally(()=>{
            setTimeout(()=>{
              _this.confirmLoading = false;
            },2000)
          })
        }
      })
    },
    handleCancel(){
      this.visible = false;
      this.status = '未关联'
    },
  }

}
</script>