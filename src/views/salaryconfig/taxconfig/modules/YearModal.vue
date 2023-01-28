<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="取消"
    okText="保存"
    :visible="visible"
    :confirmLoading="loading"
    :maskClosable="false"
  >
    <a-card :bordered="false">
      <a-spin
        tip="Loading..."
        :spinning="spinning"
      >
        <a-form :form="form">
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="年终奖应纳税所得额下限"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input v-decorator="['minIncome', validatorRules.minIncome ]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="年终奖应纳税所得额上限"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input v-decorator="['maxIncome', validatorRules.maxIncome ]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="税率（%）"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input v-decorator="['withholdingRate', validatorRules.withholdingRate ]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="个税起征点"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input v-decorator="['startPoint', validatorRules.startPoint ]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="速算扣除数（元）"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input v-decorator="['quickDeducation', validatorRules.quickDeducation ]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="级数"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input-number
                  :min="1"
                  v-decorator="['level', validatorRules.level ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </a-card>
  </a-modal>
</template>
<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
export default {
  name: 'SalaryModal',
  data() {
    return{
      visible:false,
      title:'',
      loading:false,
      spinning:false,
      form:this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      validatorRules: {
        minIncome: { rules: [{ required: true, message: '请输入全月应纳税所得额下限!' },{validator:this.isNumber}] },
        maxIncome: { rules: [{ required: true, message: '请输入全月应纳税所得额上限!' },{validator:this.isNumber}] },
        withholdingRate: { rules: [{ required: true, message: '请输入税率!' },{validator:this.isTax}] },
        startPoint: { rules: [{ required: true, message: '请输入个税起征点!' },{validator:this.isNumber}] },
        quickDeducation: { rules: [{ required: true, message: '请输入速算扣除数!' },{validator:this.isNumber}] },
        level: { rules: [{ required: true, message: '请输入级数!' },{validator:this.isNumber}] },
      },
      model:{},
      url:{
        addUrl: '/salary/tsalarytaxconfig',
        editUrl: '/salary/tsalarytaxconfig'
      }
    }
  },
  methods:{
    add(){
      this.edit({})
    },
    edit(record){
      this.visible = true
      this.form.resetFields()
      this.model = Object.assign({},record)
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'minIncome','maxIncome','withholdingRate','startPoint','quickDeducation','level'))
      })
    },
    handleCancel() {
      this.close()
    },
    close(){
      this.visible = false
    },
    handleOk() {
      this.form.validateFields((err,values) => {
        if(!err){
          this.loading = true
          this.spinning = true
          let method = ''
          if(!this.model.id){
            method = 'POST'
          }else{
            method = 'PUT'
          }
          let formData = Object.assign(this.model, values)
          formData.type = 1
          httpAction(this.url.addUrl,formData,method).then((res) => {
            if(res.code == 200){
              this.loading = false
              this.spinning = false
              this.$message.success("保存成功")
              this.$emit('ok')
              this.close()
            }else{
              this.$message.err(res.msg)
              this.loading = false
              this.spinning = false
            }
          })
        }
      })
    },
    // 验证数字
    isNumber(rule,value,callback){
      const reg = /^[1-9]{1}[0-9]*$/
      if(!reg.test(value) && value != ''){
        callback(new Error('请输入整数'))
      }else{
        callback()
      }
    },
    // 验证税率
    isTax(rule,value,callback){
      const reg = /^[1-9]{1}[0-9]*$/
      if(!reg.test(value) && value != ''){
        callback(new Error('请输入小于100整数'))
      }else{
        if(value < 0 || value > 100){
          callback(new Error('税率要在0-100'))
        }else{
          callback()
        }
      }
    }
  }
}
</script>
