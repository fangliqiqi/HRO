<template>
  <a-modal
    :title="title"
    :width="650"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    cancelText="关闭"
  >

    <a-form :form="form">
      <a-form-item
        v-if="model.insuranceHandleManName"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :label="model.intypeName"
      >
        {{ model.insuranceHandleManName }}
      </a-form-item>
      <a-form-item
        v-if="model.handleManName"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :label="model.typeName"
      >
        {{ model.handleManName }}
      </a-form-item>
      <a-divider></a-divider>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="转办节点"
      >
        <a-select
          placeholder="请选择转办节点"
          optionFilterProp="children"
          :allowClear="true"
          :dropdownMatchSelectWidth="false"
          v-decorator="['type', validatorRules.typeResult ]"
        >
          <a-select-option 
            v-for="(item,key) in typeOptions"
            :key="key"
          >
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="转办至"
      >
        <select-page
          :searchUrl="'admin/user/page/wxhr?nickname='"
          :title="'nickname'"
          placeholder="请选择转办人员"
          :id="'userId'"
          v-decorator="['newUserId', validatorRules.newUserIdResult ]"
          style="width:100%"
          :triggerChange="true"
          @select="handleSelect"
        ></select-page>
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="原因说明"
      >
        <a-textarea
          placeholder="请输入转办意见！"
          v-decorator="['remark', validatorRules.remarkResult ]"
          style="width:100%"

          :autoSize="{ minRows: 3}"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import SelectPage from '@/components/jeecg/SelectPage'

export default {
  name: 'TransferModal',
  components:{
    SelectPage
  },
  data() {
    return {
      title: '',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      model: {},
      typeOptions:{},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4},
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      validatorRules: {
        typeResult:{rules: [{ required: true, message: '请选择转办节点' }]},
        newUserIdResult: {rules: [{ required: true, message: '请选择转办人员!' }]},
        remarkResult: {rules: [{ required: true, message: '请输入转办意见！!' },{max:200,message:'转办意见最多200个字符!'}]},
      },
      url: {
        doAudit: '/hrEmergency/emergencyview/doTransferred',
      }
    }
  },
  methods: {
    show(record) {
      this.model = record
      let emergencyType = this.model.emergencyType
      switch(emergencyType){
        case "0":
          httpAction('/hrEmergency/tworkinjuryevent/'+record.id,null,'get').then((res) => {
              if(res.code == 200){
                this.model.handleManName= res.data.handleManName
                this.model.typeName='工伤办理人'
                this.model.insuranceHandleManName = res.data.insuranceHandleManName
                this.model.intypeName='商险办理人'
                if(res.data.handleManName&&!res.data.insuranceHandleManName){
                  this.typeOptions = {'0':'工伤办理人'}
                }else if(!res.data.handleManName&&res.data.insuranceHandleManName){
                  this.typeOptions = {'1':'商险办理人'}
                }else if(res.data.handleManName&&res.data.insuranceHandleManName){
                  this.typeOptions = {'0':'工伤办理人','1':'商险办理人'}
                }
                this.visible = true

              }else{
                this.$message.error(res.msg)
              }
            })
          break;
        case "1":
          httpAction('/hrEmergency/tnonworkevent/'+record.id,null,'get').then((res) => {
              if(res.code == 200){
                // console.log('非工伤',res.data);
                this.model.insuranceHandleManName = res.data.insuranceHandleManName
                this.model.intypeName='商险办理人'
                this.typeOptions = {'1':'商险办理人'}
                this.visible = true
              }else{
                this.$message.error(res.msg)
              }
            })
          break;
        case "2":
          httpAction('/hrEmergency/tretiredworkevent/'+record.id,null,'get').then((res) => {
              if(res.code == 200){
                // console.log('退工',res.data);
                this.model.handleManName=res.data.handleManName
                this.model.typeName='退工办理人'
                this.typeOptions = {'0':'退工办理人'}
                this.visible = true
              }else{
                this.$message.error(res.msg)
              }
            })
          break;
        case "3":
          httpAction('/hrEmergency/tabitrationevent/'+record.id,null,'get').then((res) => {
              if(res.code == 200){
                // console.log('仲裁',res.data);
                this.model.handleManName=res.data.handleManName
                this.model.typeName='仲裁办理人'
                this.typeOptions = {'0':'仲裁办理人'}
                this.visible = true
              }else{
                this.$message.error(res.msg)
              }
            })
          break;
        case "4":
          httpAction('/hrEmergency/tlitigationevent/'+record.id,null,'get').then((res) => {
              if(res.code == 200){
                // console.log('诉讼',res.data);
                this.model.handleManName=res.data.handleManName
                this.model.typeName='诉讼办理人'
                this.typeOptions = {'0':'诉讼办理人'}
                this.visible = true
              }else{
                this.$message.error(res.msg)
              }
            })
          break;
        case "5":
          httpAction('/hrEmergency/tcomplaintevent/'+record.id,null,'get').then((res) => {
              if(res.code == 200){
                // console.log('监察投诉',res.data);
                this.model.handleManName=res.data.handleManName
                this.model.typeName='监察投诉办理人'
                this.typeOptions = {'0':'监察投诉办理人'}
                this.visible = true
              }else{
                this.$message.error(res.msg)
              }
            })
          break;
      } 
    },
    handleSelect(val,option,lists){
      // console.log(val,option,lists);
      const newUserName = lists.find(item=>val==item.id).title
      this.model.newUserName = newUserName
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const temp = {
            emergencyType:this.model.emergencyType,
            emergencyId:this.model.id,
            newUserId:values.newUserId,
            newUserName:this.model.newUserName,
            remark:values.remark,
            type:Number(values.type) 
          }
          this.confirmLoading = true
          const qs = require('qs')
         const params = qs.stringify(temp)
          httpAction(`${this.url.doAudit}?${params}`, null, 'POST').then((res) => {
            if(res.code === 200){
              this.$message.success(res.msg)
              this.$emit('ok')
            } else {
              this.$message.warning(res.msg)
            }
          }).finally(() => {
            this.confirmLoading = false
            this.close()
          })
        }
      })
    },
    
    handleCancel() {
      this.close()
    },
    close() {
      this.form.resetFields()
      this.$emit('close')
      this.visible = false
      this.model= {}
      this.typeOptions = {}
    }
  }
}
</script>

<style lang="less" scoped>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
.stepFormText {
  :global(.ant-form-item-label) {
    width: 150px;
  }
}
</style>
