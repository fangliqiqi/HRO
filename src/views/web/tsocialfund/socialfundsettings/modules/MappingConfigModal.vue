<template>
  <a-modal
    :title="title"
    :width="600"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >保存</a-button>
    </template>
    <a-form
      :form="form"
      class="ant-disabled-form"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-item
        label="增减状态"
        class="stepFormText">
        <a-select
          placeholder="请选择增减状态"
          optionFilterProp="children"
          v-decorator="['type',{rules: [{ required: true, message: '请选择增减状态!' }]}]"
          :dropdownMatchSelectWidth="false"
        >
          <a-select-option value="0">派增</a-select-option>
          <a-select-option value="1">派减</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="模板字段"
        class="stepFormText">
        <a-input
          placeholder="请输入模板字段"
          v-decorator="['sysField',{rules: [{ required: true, message: '请输入模板字段!' }]}]"
        />
      </a-form-item>
      <a-form-item
        label="客户原表信息"
        class="stepFormText">
        <a-input
          placeholder="请输入客户原表信息"
          v-decorator="['customerField',{rules: [{ required: true, message: '请输入客户原表信息!' }]}]"
        />
      </a-form-item>
      <a-form-item v-if="isEdit" :wrapper-col="{ span: 17, offset: 3 }">
        <div>
          <a-icon type="exclamation-circle" style="color:#E60808;margin-right:5px;" />
          <span>注：修改前的逻辑不变，仅适用于修改后的派单数据</span>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'

export default {
  data(){
    return{
      description: '预派映射添加或编辑',
      title: '添加映射关系',
      form: this.$form.createForm(this),
      confirmLoading:false, // 点击保存或编辑按钮加载动画
      visible: false,
      isEdit:false, // 是否是编辑状态，默认是添加
      eidtRecord:{}, // 编辑的数据
      url:{
        addOrEdit:'/hrSocial/tdispatchfieldconf', // 新增、修改
      }
    }
  },
  methods:{
    // 显示
    show(){
      this.visible = true
    },
    // 编辑修改
    eidt(record){
      this.isEdit = true
      this.eidtRecord = record
      this.show()
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(record, 'type', 'sysField', 'customerField'))
      })
    },
    // 关闭。取消
    handleCancel(){
      this.form.resetFields()
      this.confirmLoading = false
      this.isEdit = false
      this.visible = false
    },
    // 点击编辑、添加
    handleOk(){
      const that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          const httpurl = that.url.addOrEdit
          const method = that.isEdit?'PUT':'POST'
          const formData = {
            sysField:values.sysField,
            customerField:values.customerField
          }
          if(that.isEdit){
            formData.id = that.eidtRecord.id || ''
          }
          that.confirmLoading = true
          httpAction(httpurl, formData, method).then((res) => {
            if (Number(res.code) === 200) {
              that.$message.success(`${that.title}成功！`)
              that.$emit('ok')
              that.handleCancel()
            } else {
              that.$message.warning(res.msg || '操作失败！')
            }
          }).finally(() => {
            that.confirmLoading = false
          })
        }
      })
    }
  }
}
</script>

