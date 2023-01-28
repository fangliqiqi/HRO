<template>
  <a-modal
    :title="title"
    :width="600"
    placement="right"
    @ok="handleOk"
    @cancel="handleCancel"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="false"
    :confirmLoading="confirmLoading"
  >
    <a-form
      :form="form"
      layout="inline"
    >
      <a-form-item label="结算月份">
        <a-month-picker
          format="YYYYMM"
          placeholder="请选择需要生成数据的结算月份"
          style="width:250px"
          :disabledDate="disabledDate"
          v-decorator="['month',{initialValue: defaultDate}]"
        />
      </a-form-item>
    </a-form>

  </a-modal>
</template>
<script>

import moment from 'moment'
import { httpAction } from '@/api/manage'

export default {
  name: 'LaborGenerateModal',
  components: {
    
  },
  props:{
    title: {
      type:String,
      required:true
    }
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      defaultDate:'',
      url:'',
    }
  },
  methods:{
    show() {
      this.defaultDate = moment().month(moment().month() - 1).startOf('month');
      this.visible = true;
    },
    disabledDate(current) {
      return current && current > moment().month(moment().month()).endOf('day');
    },

    handleOk(){
      this.form.validateFields((err,values) => {
        if(!err){
          const url = `${this.url}${values.month.format('YYYYMM')}`;
          this.confirmLoading = true;
          httpAction(url,{},'post',10000 * 20).then((res) => {
            if(Number(res.code) === 200){
              this.$message.success(res.msg);
              this.$emit('ok');
              this.handleCancel();
            }else{
              this.$message.error(res.msg);
            }
          }).finally(()=>{
            const _this = this;
            setTimeout(()=>{
              _this.confirmLoading = false;
            },2000)
            
          })
        }
      })
    },
    handleCancel() {
      this.close();
    },
    close() {
      this.visible = false;
      this.defaultDate = '';
      this.form.resetFields();
    },
  }
}
</script>
