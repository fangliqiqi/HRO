<template>
  <a-modal
    title="本期申报数据刷新"
    placement="right"
    :closable="true"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel(false)"
    :footer="null"
  >
    <a-spin
      :spinning="confirmLoading"
      tip="加载中..."
    >
      <a-form
        :form="form"
        layout="inline"
        class="formStyle"
      >
        <a-form-item label="申报月份">
          <a-month-picker
            placeholder="请选择月份"
            v-decorator="['settleMonth', {rules: [{ required: true, message: `请选择月份` }]} ]"
            valueFormat="YYYYMM"
            format="YYYYMM"
            style="width:300px"
            :disabledDate="disabledDate"
          />
        </a-form-item>
        <div class="info">由于数据量庞大,请避开正常作业时间,同时在点击“确认刷新”按钮后系统会自动在后台运行刷新动作</div>
      </a-form>
      <div class="btn">
        <a-button type="primary" @click="handleOk">确定刷新</a-button>
        <a-button @click="handleCancel(false)">取消</a-button>
      </div>
    </a-spin>

  </a-modal>
</template>
<script>
import moment from 'moment'
import { httpAction } from '@/api/manage'
export default {
  name: 'FreshModal',
  components: {
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
    }
  },
  methods:{
    disabledDate(current) {
      return current && current > moment().endOf('day') || current && current < moment('2020-01-01').startOf('day');
    },
    show() {
      this.visible = true;
      this.form.resetFields();
    },
    handleOk(){
      this.form.validateFields((err, values) => {
        if(!err){
          this.confirmLoading = true;
          httpAction(`/salary/tstatisticstaxsalary/doRefreshStatisticsTaxAll?settleMonth=${values.settleMonth}`,null,'POST').then(res=>{
            if(res.code === 200){
              this.handleCancel(true);
              this.$message.success(res.msg);
            }else{
              this.$message.warning(res.msg);
            }
          }).finally(()=>{
            this.confirmLoading = false;
          })
        }
      })
    },
    handleCancel(e) {
      this.visible = false;
      if(e){
        this.$emit('ok');
      }
    },
  }
}
</script>

<style lang="less">
  .btn{
    width: 200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
  }
  .formStyle{
    margin: 0px 30px 20px 42px;
  }
  .info{
    font-size: 12px;
    color: #f5222d;
    margin-top: 10px;
    margin-right: 13px;
  }
</style>
