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
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="loading"
  >
    <div>

      <a-tabs
        type="card"
        :activeKey="activeKey"
        @change="changeTab"
      >

        <a-tab-pane
          key="1"
          :forceRender="true"
        >
          <span slot="tab">
            <a-icon
              v-if="basicExclamation == true"
              type="exclamation"
              style="color:red"
            />
            基本信息
          </span>
          <a-form
            :form="basicForm"
            style="height:350px"
          >
            <a-row>
              <a-col
                :span="13"
                :offset="1"
              >
                <a-form-item
                  label="选择结算主体:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <!-- <a-select
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    v-decorator="['departId', validatorBasicRules.departId ]"
                  >
                    <a-select-option
                      v-for="(item, index) in settlementList"
                      :key="index"
                      :value="item.id"
                    >{{ item.departName }}</a-select-option>
                  </a-select> -->
                  <select-page
                    :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                    :title="'departName'"
                    :placeholder="'请输入结算主体'"
                    :triggerChange="true"
                    :resList="resList"
                    v-decorator="['departId', validatorBasicRules.departId ]"
                    :id="'id'"
                    @select="selectOption"
                    style="width:200px;"
                  ></select-page>
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item
                  label="配置名称:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-input v-decorator="['name', validatorBasicRules.name ]" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>

        <a-tab-pane
          key="2"
          :forceRender="true"
        >
          <span slot="tab">
            <a-icon
              v-if="configExclamation == true"
              type="exclamation"
              style="color:red"
            />
            计薪设置
          </span>
          <a-form :form="configForm">
            <a-row>
              <a-col
                :span="11"
                :offset="1"
              >
                <a-form-item
                  label="工资月份:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-select v-decorator="['salaryMonth',{'initialValue':-1} ]">
                    <a-select-option :value="-6">前6月</a-select-option>
                    <a-select-option :value="-5">前5月</a-select-option>
                    <a-select-option :value="-4">前4月</a-select-option>
                    <a-select-option :value="-3">前3月</a-select-option>
                    <a-select-option :value="-2">前2月</a-select-option>
                    <a-select-option :value="-1">上月</a-select-option>
                    <a-select-option :value="0">本月</a-select-option>
                    <a-select-option :value="1">下月</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="结算月份:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-select v-decorator="['settleMonth',{'initialValue':0} ]">
                    <a-select-option :value="-1">上月</a-select-option>
                    <a-select-option :value="0">本月</a-select-option>
                    <a-select-option :value="1">下月</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col
                :span="11"
                :offset="1"
              >
                <a-form-item
                  label="社保月份:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-select v-decorator="['socialMonth',{'initialValue':0} ]">
                    <a-select-option :value="-6">前6月</a-select-option>
                    <a-select-option :value="-5">前5月</a-select-option>
                    <a-select-option :value="-4">前4月</a-select-option>
                    <a-select-option :value="-3">前3月</a-select-option>
                    <a-select-option :value="-2">前2月</a-select-option>
                    <a-select-option :value="-1">上月</a-select-option>
                    <a-select-option :value="0">本月</a-select-option>
                    <a-select-option :value="1">下月</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="公积金月份:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-select v-decorator="['fundMonth',{'initialValue':0} ]">
                    <a-select-option :value="-6">前6月</a-select-option>
                    <a-select-option :value="-5">前5月</a-select-option>
                    <a-select-option :value="-4">前4月</a-select-option>
                    <a-select-option :value="-3">前3月</a-select-option>
                    <a-select-option :value="-2">前2月</a-select-option>
                    <a-select-option :value="-1">上月</a-select-option>
                    <a-select-option :value="0">本月</a-select-option>
                    <a-select-option :value="1">下月</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col
                :span="11"
                :offset="1"
              >
                <a-form-item
                  label="社保优先级:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-select v-decorator="['socialPriority', {'initialValue':0} ]">
                    <a-select-option :value="0">生成</a-select-option>
                    <a-select-option :value="1">缴纳</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="公积金优先级:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-select v-decorator="['fundPriority',{'initialValue':0} ]">
                    <a-select-option :value="0">生成</a-select-option>
                    <a-select-option :value="1">缴纳</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col
                :span="11"
                :offset="1"
              >
                <a-form-item
                  label="发放方式:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-select v-decorator="['grantType',{'initialValue':1} ]">
                    <a-select-option :value="1">转账</a-select-option>
                    <a-select-option :value="0">现金</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="年终奖扣税:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-select v-decorator="['annualBonusType',{'initialValue':0} ]">
                    <a-select-option :value="0">合并</a-select-option>
                    <a-select-option :value="1">单独</a-select-option>
                    <!-- <a-select-option :value="2">自动计算</a-select-option> -->
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
      </a-tabs>

    </div>
  </a-modal>

</template>
<script>
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import pick from 'lodash.pick'
import { setTimeout } from 'timers';
  export default {
    name:'StandardConfigModal',
    components: {
      SelectPage
    },
    data() {
      return {
        visible:false,
        loading:false,
        title:'',
        basicForm: this.$form.createForm(this),
        configForm: this.$form.createForm(this),
        resList:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorBasicRules:{
          departId:{ rules: [{ required: true, message: '请选择结算主体!' }] },
          name:{ rules: [{ required: true, message: '请输入配置名称!' }] },
        },
        validatorConfigRules:{
          socialPriority: { rules: [{ required: true, message: '请输入配置名称!' }] },
          fundPriority: { rules: [{ required: true, message: '请输入配置名称!' }] },
          grantType: { rules: [{ required: true, message: '请输入配置名称!' }] },
          annualBonusType: { rules: [{ required: true, message: '请输入配置名称!' }] },
        },
        url:{
          addUrl:'/salary/tconfigsalary',
          editUrl:'/salary/tconfigsalary',
        },
        basicExclamation:false,
        configExclamation:false,
        basicModel:{},
        configModel:{},
        model:{},
        activeKey:'1'
      };
    },
    props:{
      settlementList: {
        type:Object,
        required:true
      }
    },
    methods: {
      add(){
        this.edit({})
      },
      edit(record){
        this.visible = true
        this.basicExclamation = false
        this.configExclamation = false
        this.basicForm.resetFields()
        this.configForm.resetFields()
        this.activeKey = '1'
        this.model = Object.assign({}, record)
        if(record.id){
          this.resList.push({
            id: record.departId,
            title: record.departName
          })
        }
        setTimeout(() => {
          this.$nextTick(() => {
            this.basicForm.setFieldsValue(pick(this.model,'departId','name'))
            this.configForm.setFieldsValue(pick(this.model,'salaryMonth','settleMonth','socialMonth','fundMonth','socialPriority','fundPriority',
            'grantType','annualBonusType'))
          })
        },500)
        
      },
      handleCancel(){
        this.close()
      },
      handleOk() {
        var that = this
        let basicFlag = false
        let configFlag = false
        let basicValue
        let configValue
        this.basicForm.validateFields((err, values) => {
          if(!err){
            console.log(values)
            basicValue = values
            basicFlag = true
          }
        })
        this.configForm.validateFields((err, values) => {
          if(!err){
            configValue = values
            configFlag = true
          }
        })
        if(configFlag){
          this.configExclamation = false
        }
        if(basicFlag){
          this.basicExclamation = false
        }
        if(this.activeKey == 1 && !configFlag){
          this.configExclamation = true
        }
        if(this.activeKey == 2 && !basicFlag){
          this.basicExclamation = true
        }
        if(basicFlag && configFlag){
          this.loading = true
          let httpurl = ''
          let method = ''
          if(!this.model.id){
            httpurl = this.url.addUrl
            method = 'POST'
          }else{
            httpurl = this.url.editUrl
            method = 'PUT'
          }
          let formData = Object.assign(this.model, basicValue)
          formData = Object.assign(this.model, configValue)
          console.log(this.settlementList)
          for(const c in this.settlementList){
            if(this.settlementList[c].id == formData.departId){
              formData.departName = this.settlementList[c].departName
              formData.departNo = this.settlementList[c].departNo
            }
          }
          if(!formData.departNo){
            this.$message.error("您没有该结算主体权限")
            this.loading = false
            return
          }
          httpAction(httpurl,formData,method).then((res) => {
            this.loading = false
            if(res.code == 200){
              this.$message.success("保存成功")
              that.$emit('ok')
              that.close()
            }
          })
        }
      },
      close() {
        this.$emit('close')
        this.resList = []
        this.visible = false
      },
      changeTab(key) {
        this.activeKey = key
      },
      callback(key) {
        console.log(key);
      },
      selectOption(val){
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({departId:val}, 'departId'))
        })
      },
    },
  };
</script>
<style>
.card-container {
  background: #f5f5f5;
  overflow: hidden;
  padding: 24px;
}
.card-container > .ant-tabs-card > .ant-tabs-content {
  height: 120px;
  margin-top: -16px;
}

.card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 16px;
}

.card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent;
  background: transparent;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
}
</style>