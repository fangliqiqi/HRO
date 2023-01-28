<template>
  <a-modal
    :title="title"
    :width="700"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="取消"
    okText="确定"
    :visible="visible"
    :maskClosable="false"
  >
    <a-form :form="form">
      <a-form-item
        label="原表数据项"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-input
          placeholder=""
          v-decorator="['cnName', validatorRules.cnName]"
          @change="changeCn"
        />
      </a-form-item>
      <a-form-item
        label="系统数据项"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-input
          placeholder=""
          v-decorator="['dbFiedName', validatorRules.dbFiedName]"
          @change="changeDb"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import {httpAction} from "@/api/manage"
import pick from 'lodash.pick'
export default {
  name: "ConfigModal",
  data(){
    return{
      title:'',
      visible: false,
      form:this.$form.createForm(this),
      cnName:'',
      dbFiedName:'',
      validatorRules: {
        cnName: { rules: [{ required: true, message: '请输入原表数据项!' }] },
        dbFiedName: { rules: [{ required: true, message: '请输入系统数据项!' }] },
      },
      model:{},
      url:{
        findExistence: "/salary/tsalaryconfigstandard/findExistence",
        addUrl: "/salary/tsalaryconfigstandard"
      }
    }
  },
  methods: {
    add(){
      this.edit({})
    },
    edit(record){
      this.visible = true
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.cnName = this.model.cnName
      this.dbFiedName = this.model.dbFiedName
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,"cnName","dbFiedName"))
      })
    },
    handleCancel(){
      this.visible = false
    },
    handleOk(){
      this.form.validateFields((err,values) => {
        if(!err){
          httpAction(this.url.findExistence,{'cnName':this.cnName,'dbFiedName':this.dbFiedName},'POST').then((res) => {
          if(res.code == 1){
            this.$message.error(res.msg)
          }else{
            let method = ''
            let formData = Object.assign(this.model, values)
            if(!this.model.id){
              method = 'POST'
            }else{
              method = 'PUT'
              formData.id = this.model.id
            }
            if(this.model.javaFiedName){
              formData.javaFiedName = this.model.javaFiedName
            }else{
              formData.javaFiedName = this.model.cnName
            }
            httpAction(this.url.addUrl,formData,method).then((res) => {
              if(res.code == 200){
                this.$message.success("成功")
                this.visible = false
                this.$emit('ok')
              }else{
                 this.$message.err(res.msg)
                 this.visible = false
              }
            })
          }
        })
        }
      })
    },
    changeCn(e){
      this.cnName = e.target.value
    },
    changeDb(e){
      this.dbFiedName = e.target.value
    },
  }
}
</script>
