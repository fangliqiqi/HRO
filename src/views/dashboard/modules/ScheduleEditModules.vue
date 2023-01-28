<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    okText="保存"
    @cancel="handleCancel"
    :maskClosable="false"
    cancelText="关闭"
    :destroyOnClose="true"
  >

    <a-form
      :form="form"
      layout="inline"
      class="ant-advanced-search-form"
    >
      <a-row :gutter="24">
        <a-form-item
          label="日期"
          class="stepFormText"
        >
          <a-date-picker
            v-decorator="['doDate',{initialValue:moment()}]"
            format="YYYY-MM-DD"
          />
        </a-form-item>
      </a-row>
      
      <a-row :gutter="24">
        <a-form-item
          label="类型"
          class="stepFormText"
        >
          <a-select
            style="width:325px"
            v-decorator="['type']"
            :disabled="true"
          >
            <a-select-option
              v-for="(item,index) in typeOption"
              :key="index"
              :value="index"
            >{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-row>
      <a-row :gutter="24">
        <a-form-item
          label="优先级"
          class="stepFormText"
        >
          <a-select
            style="width:325px"
            v-decorator="['priority']"
          >
            <a-select-option
              v-for="(item,index) in priorityOption"
              :key="index"
              :value="index"
            >{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-row>
      <a-row :gutter="24">
        <a-form-item
          label="待办名称"
          class="stepFormText"
        >
          <a-input
            v-decorator="['todoName',validatorRules.todoName]"
            style="width:325px"
          />
        </a-form-item>
      </a-row>
      <a-row :gutter="24">
        <a-form-item
          label="描述"
          class="stepFormText"
        >
          <a-textarea
            v-decorator="['description']"
            cols="100"
            rows="5"
            :style="{resize:'none'}"
          >
          </a-textarea>
        </a-form-item>
      </a-row>
      <a-row :gutter="24">
        <a-form-item
          label="状态"
          class="stepFormText"
        >
          <a-select
            showSearch
            optionFilterProp="children"
            :filterOption="filterOption"
            :style="{width:'325px'}"
            v-decorator="['status']"
          >
            <a-select-option
              v-for="(item,index) in statusOption"
              :key="index"
              :value="index"
            >{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-row>
      <a-row :gutter="24">
        <a-form-item
          label="起止时间"
          class="stepFormText"
        >
          <a-time-picker
            :minuteStep="10"
            :style="{width:'163px'}"
            format="HH:mm:ss"
            :disabled="isOperate"
            v-decorator="['startTime']"
          />
          <a-time-picker
            :minuteStep="10"
            :style="{width:'163px',marginRight:'12px'}"
            :disabled="isOperate"
            format="HH:mm:ss"
            v-decorator="['endTime']"
          />
          <a-checkbox @change="disableTime">暂时不设定时间</a-checkbox>
        </a-form-item>
      </a-row>
      <a-row :gutter="24">
        <a-form-item
          label="私人事务"
          class="stepFormText"
        >
          <a-checkbox-group v-decorator="['privateFlag']">
            <a-checkbox value="0" />
          </a-checkbox-group>
        </a-form-item>
      </a-row>

    </a-form>
  </a-modal>
</template>

<script>

import moment from 'moment'
import pick from 'lodash.pick'

import { httpAction } from '@/api/manage'
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'

export default {
  name: 'ScheduleEditModules',
  components: {HappyScroll}, //在组件内注册
  data() {
    return {
      title: '编辑待办事项',
      visible: false,
      confirmLoading: false,
      isOperate:false,
      typeOption:['自定义','日常任务'],
      priorityOption:['一般','最高','较高','最低'],
      statusOption:['未开始','进行中','已完成','已关闭'],
      model:{},
      form: this.$form.createForm(this),
      validatorRules:{
        todoName: { rules: [{ required: true, message: '请输入待办名称!' }] },
      },
      url:{
        edit:'hrGeneral/ttodolistdiy'
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
    }
  },
  methods: {
    moment,
    edit(record) {
      
      this.model = Object.assign(record)
      this.model.type = this.model.type * 1
      this.model.status = this.model.status * 1
      this.model.priority = this.model.priority * 1
      this.model.doDate = moment(this.model.doDate,'YYYY-MM-DD')
      this.model.startTime = (this.model.startTime) ? moment(this.model.startTime,'HH:mm:ss') : ''
      this.model.endTime = (this.model.endTime) ? moment(this.model.endTime,'HH:mm:ss') : ''
      this.model.privateFlag = [this.model.privateFlag]
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'todoName','type','status','privateFlag','priority','doDate','description'))
        if(this.model.endTime && this.model.startTime){
          this.form.setFieldsValue(pick({startTime:this.model.startTime,endTime:this.model.endTime},'startTime','endTime'))
        }
      });
    },
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          values.doDate = (values.doDate) ? moment(values.doDate).format("YYYY-MM-DD") : ''
          values.startTime = (values.startTime) ? moment(values.startTime).format("HH:mm:ss") : ''
          values.endTime = (values.endTime) ? moment(values.endTime).format("HH:mm:ss") : ''
          values.privateFlag = (values.privateFlag) ? 0 : 1
          values.id = this.model.id
          values.priority = values.priority*1
          
          if(this.isOperate){
            values.startTime = values.endTime = ''
          }
          httpAction(this.url.edit,values,'put').then((res)=>{
            if(res.code == 200){
              _this.$message.success('修改成功！')
              _this.model = Object.assign(_this.model,values)
              _this.visible = false
              _this.$emit('ok')
            }else{
              _this.$message.warning(res.msg)
            }
          })
        }
      })
    },
    disableTime(e){
      if(e.target.checked){
        this.isOperate = true
      }else{
        this.isOperate = false
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.model = {}
      this.$emit('close')
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}
.ant-advanced-search-form .ant-form-item {
  margin-bottom: 15px;
}
.datetype {
  padding: 0px 8px 0px 14px;
  line-height: 30px;
  background: '#eee';
  border: '1px solid #dcdcdc';
}
</style>