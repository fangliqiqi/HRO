
<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="800"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="horizontal"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="未关联固资金额"
            >
              {{ sum }}
              <a-button type="primary" style="margin-left: 30px;" @click="showDetail">关联明细</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="划至结算主体名称"
            >
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :placeholder="'请输入结算主体'"
                v-decorator="['transferDepartName', {rules: [{ required: true, message: '请输入结算主体!' }]} ]"
                :id="'departName'"
                :allowClear="false"
                :triggerChange="true"
                @change="settleChange"
              ></select-page>
              <a-input type="hidden" v-decorator="['transferDepartCode']" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="划转后结算首月"
            >
              <a-month-picker
                format="YYYYMM"
                placeholder="请选择划转后结算首月"
                :disabled-date="disabledDate"
                v-decorator="['transferMonthStart',{rules: [{ required: true, message: '请选择划转后结算首月!' }]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="划转原因"
              class="labTxt"
            >
              <a-textarea
                rows="4"
                style="resize:none;width:560px;"
                placeholder="请输入划转原因"
                v-decorator="['transferReason',{rules: [{ required: true, message: '请输入划转原因!' },{max:500,message:'划转原因最多500个字符!'}] }]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <assets-detail-modal ref="AssetsDetailForm"></assets-detail-modal>
  </a-modal>
</template>


<script>
import SelectPage from '@/components/jeecg/SelectPage'
import pick from 'lodash.pick'
import AssetsDetailModal from './AssetsDetailModal'
import { httpAction } from '@/api/manage'
import moment from 'moment'


export default {
  name: 'TransferBatchModal',
  components: {
    SelectPage,
    AssetsDetailModal
  },
  data(){
    return {
      title: '批量划转',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      url:'/salary/tstatisticsprojectreimburse/batchTransferByIds',
      ids:[],
      sum: 0,

    }
  },
  methods:{
    show(id,total){
      this.visible = true;
      this.ids = id;
      this.sum = total;
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().startOf('month');
    },
    settleChange(val,option){
      const info = option.context.lists[option.key]['item']
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({transferDepartName:val,transferDepartCode:info.departNo}, 'transferDepartName','transferDepartCode'))
      })
    },
    async showDetail(){
      const res = await httpAction(`/salary/tprojectreimbursedetail/getDetailByParentIds?parentIds=${this.ids.join(',')}`,null,'get');
      if(res.code === 200){
        this.$refs.AssetsDetailForm.show(this.sum,res.data);
      }else{
        this.$message.warning(res.msg);
      }
    },
    handleOk(){
      const _this = this;
      if(Number(this.sum) === 0){
        this.$message.warning('未关联固资金额为零，禁止划转!');
        return false;
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true;
          const params = {
            transferMonthStart: values.transferMonthStart.format('YYYYMM'),
            ids: this.ids.join(','),
            fee: this.sum,
            transferReason: values.transferReason,
            transferDepartName: values.transferDepartName,
            transferDepartCode: values.transferDepartCode,
          }
          const qs = require('qs');
          const url = `${this.url}?${qs.stringify(params)}`;
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
            },2000);
          })
        }
      })
    },
    handleCancel(){
      this.visible = false;
      this.ids = [];
      this.sum = 0;
    },
  }

}
</script>
<style lang="less" scoped>
:global(.labTxt){
  display: flex;
}
:global(.labTxt .ant-form-item-label){
  width: 142px;
}
:global(.labTxt .ant-form-item-control-wrapper){
  width: 560px;
}
</style>
