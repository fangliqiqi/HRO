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
          <span :style="{padding:'5px 8px 6px 14px',background:'#eee',border:'1px solid #dcdcdc'}">
            <a-checkbox-group v-decorator="['determinedFlag']">
              <a-checkbox value="0">待定</a-checkbox>
            </a-checkbox-group>
            <a-checkbox-group
              v-decorator="['cycleStatus']"
              @change="changeDateType"
            >
              <a-checkbox value="0">周期</a-checkbox>
            </a-checkbox-group>
          </span>
        </a-form-item>
      </a-row>
      <a-row
        :gutter="24"
        v-if="cycle"
      >
        <a-form-item
          label="周期设置"
          class="stepFormText"
        >
          <a-tabs
            type="card"
            @change="tabChange"
          >
            <a-tab-pane
              tab="天"
              key="0"
            >
              <a-input
                v-decorator="['intervalValueDay']"
                addonBefore="间隔"
                addonAfter="天"
              />
            </a-tab-pane>
            <a-tab-pane
              tab="周"
              key="1"
            >
              <a-checkbox-group v-decorator="['intervalValueWeek']">
                <a-checkbox value="1">星期一</a-checkbox>
                <a-checkbox value="2">星期二</a-checkbox>
                <a-checkbox value="3">星期三</a-checkbox>
                <a-checkbox value="4">星期四</a-checkbox>
                <a-checkbox value="5">星期五</a-checkbox>
                <a-checkbox value="6">星期六</a-checkbox>
                <a-checkbox value="7">星期日</a-checkbox>
              </a-checkbox-group>
            </a-tab-pane>
            <a-tab-pane
              tab="月"
              key="2"
            >
              <a-checkbox-group v-decorator="['intervalValueMonth']">
                <a-row :style="{width:'800px'}">
                  <a-col
                    :span="3"
                    v-for="(item,index) in monthDay"
                    :key="index"
                  >
                    <a-checkbox :value="item">
                      {{ item }}
                    </a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-tab-pane>
          </a-tabs>
          <a-input
            addonBefore="提前"
            addonAfter="天生成待办"
            v-decorator="['inAdvanceVal']"
            :style="{width:'250px',marginTop:'20px'}"
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
            v-decorator="['type',validatorRules.type]"
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
            v-decorator="['priority',validatorRules.priority]"
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
            v-decorator="['status',validatorRules.status]"
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
import { httpAction } from '@/api/manage'
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'

export default {
  name: 'AddLinkModules',
  components: {HappyScroll}, //在组件内注册
  data() {
    return {
      title: '添加待办',
      visible: false,
      confirmLoading: false,
      cycle: false, //周期
      isOperate:false,
      monthDay:[],
      intervalType:'', //周期类型（0天/1周/2月）,
      typeOption:['自定义','日常任务'],
      priorityOption:['一般','最高','较高','最低'],
      statusOption:['未开始','进行中','已完成','已关闭'],
      form: this.$form.createForm(this),
      validatorRules:{
        type: { rules: [{ required: true, message: '请选择类型!' }] },
        priority: { rules: [{ required: true, message: '请选择优先级!' }] },
        status: { rules: [{ required: true, message: '请选择状态!' }] },
        todoName: { rules: [{ required: true, message: '请输入待办名称!' }] },
      },
      url:{
        add:'hrGeneral/ttodolistdiy'
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
  mounted(){
    //生成当月天数
    for(let index = 1; index <= moment().daysInMonth(); index++){
      this.monthDay.push(index)
    }
  },
  methods: {
    moment,
    show() {
      this.visible = true
    },
    getValue(condition,val,defVal){
      return condition ? val : defVal
    },
    getTime(condition,val,defVal,format){
      return condition ? moment(val).format(format) : defVal
    },
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          // values.doDate = (values.doDate) ? moment(values.doDate).format("YYYY-MM-DD") : ''
          values.doDate = this.getTime(values.doDate,values.doDate,'','YYYY-MM-DD')
          // values.startTime = (values.startTime) ? moment(values.startTime).format("HH:mm:ss") : ''
          values.startTime = this.getTime(values.startTime,values.startTime,'','HH:mm:ss')
          // values.endTime = (values.endTime) ? moment(values.endTime).format("HH:mm:ss") : ''
          values.endTime = this.getTime(values.endTime,values.endTime,'','HH:mm:ss')
          // values.privateFlag = (values.privateFlag) ? 0 : 1
          values.privateFlag = this.getValue(values.privateFlag,0,1)
          // values.determinedFlag = (values.determinedFlag) ? 0 : 1
          values.determinedFlag = this.getValue(values.determinedFlag,0,1)
          // values.cycleStatus = (values.cycleStatus) ? 0 : 1
          values.cycleStatus = this.getValue(values.cycleStatus,0,1)
          // values.priority = (values.priority) ? values.priority*1 : 0
          values.priority = this.getValue(values.priority,values.priority*1,0)

          values.intervalType = this.intervalType
          switch(this.intervalType){
            case 0 :
              values.intervalValue = values.intervalValueDay
              break
            case "1" :
              values.intervalValue = (values.intervalValueWeek) ? values.intervalValueWeek.join(',') : ''
              break
            case "2" :
              values.intervalValue = (values.intervalValueMonth) ? values.intervalValueMonth.join(',') : ''
              break
            default :
              values.intervalValue = ''
              break
          }
          
          if(this.isOperate){
            values.startTime = values.endTime = ''
          }
          httpAction(this.url.add,values,'post').then((res)=>{
            if(res.code == 200){
              _this.$message.success('提交成功！')
              _this.visible = false
              _this.$emit('ok')
            }else{
              _this.$message.warning(res.msg)
            }
          })
        }
      })
    },
    tabChange(key){
      this.intervalType = key
    },
    changeDateType(arr){
      if(arr.indexOf('0') > -1){
        if(!this.intervalType){
          this.intervalType = 0
        }
        this.cycle = true
      }else{
        this.cycle = false
      }
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
      this.close();
    },
    close() {
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