<template>
  <a-modal
    title="退回理由"
    :width="600"
    placement="right"
    :closable="true"
    @cancel="handleBackCancel"
    @ok="handleBackOk"
    cancelText="关闭"
    :visible="backVisible"
    :confirmLoading="backLoading"
    :maskClosable="false"
  >
    <a-form :form="form">
      <a-form-item
        label="理由"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-textarea v-decorator="['remark',validatorRules.remark]"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import moment from 'moment'

export default {
  name:'BillingSalaryBackModal',
  data(){
    return {
      form:this.$form.createForm(this),
      backLoading:false,
      backVisible:false,
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      validatorRules: {
        remark: { rules: [{ required: true, message: '请填写理由!' }] },
      },
      params:{},
    }
  },
  props:{
    // 退回地址
    url:{
      type:String,
      required:true
    },
    // 普通退回需要检查打印问题
    check:{
      type:Boolean,
      default:false
    }
  },
  methods:{
    
  async show(data,id){
    if(this.check){
      const status = await this.checkStatus(data.id);
      const date = await this.getPrintDate(id);
      if(status === 3){
        if(date){
          const time = moment().diff(moment(date),'minute');
          if(time < 10){
            const ptime = moment(date).add(10,'minutes');
            this.$message.warning(`最后打印时间为${date},10分钟后才可退回，请于${ptime.format('YYYY-MM-DD HH:mm:ss')}再次尝试!`);
            return false;
          }
        }
      }else{
        this.$message.warning('待发放状态下才能退回!');
        return false;
      }
      this.backVisible = true
      this.params.salaryId = data.id
      this.params.id = id
    }else{
      this.backVisible = true
      this.params.salaryId = data.id
      this.params.id = id
    }
      
    },
    async checkStatus(id){
      const res = await httpAction(`salary/tsalarystandard/${id}`,null,'get');
      let status = null;
      if(res.code === 200){
        status = res.data.status;
      }
      return status;
    },
    async getPrintDate(id){
      let date = null;
      const res = await httpAction(`/salary/tprintrecord/page?fromId=${id}&orders%5B0%5D.asc=false&orders%5B0%5D.column=print_date`,null,'get');
      if(res.code === 200){
        if(res.data.total > 0){
          date = res.data.records[0].printDate;
        }
      }
      return date;
    },
    handleBackCancel() {
      this.backVisible = false
      this.form.resetFields()
    },
    handleBackOk() {
      var that = this
      this.form.validateFields((err,values) => {
        if(!err){
          this.backLoading = true
          const url = `${this.url}?tSettlementhFormId=${this.params.id}`
          httpAction(url,{'id':this.params.salaryId,'status':7,'remark':values.remark},'POST').then((res) => {
            if(Number(res.code) === 200){
              that.$emit('ok')
              this.$message.success("退回成功")
              this.close()
            }else{
              that.backLoading = false
              that.$message.error(res.msg)
            }
          })
        }
      })
    },
    close(){
      this.backVisible = false
      this.backLoading = false
      this.params = {}
      this.form.resetFields()
    }
  }
}
</script>

<style>

</style>