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
    :destroyOnClose="true"
    :maskClosable="false"
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
            style="height:500px"
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
                    placeholder="请选择结算主体"
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
                  label="单卡限额:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-input v-decorator="['limitMoney', {'initialValue':60000,'rules':[{ required: true, message: '请输入单卡限额!' }]} ]" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="增值税金及附加税点:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-input v-decorator="['valueDaddedTax',validatorConfigRules.valueDaddedTax ]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col
                :span="11"
                :offset="1"
              >
                <a-form-item
                  label="管理费税点:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-input
                    v-decorator="['managementTax' ]"
                    @change="changeManage"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="应发工资税点:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-input
                    v-decorator="['salarySumTax', validatorConfigRules.salarySumTax ]"
                    @change="changeSalary"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col
                :span="11"
                :offset="1"
              >
                <a-form-item
                  label="预缴企业所得税税点:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-input v-decorator="['unitIncomeTax', validatorConfigRules.unitIncomeTax ]" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="预缴个人所得税税点:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-input v-decorator="['personIncomeTax', validatorConfigRules.personIncomeTax ]" />
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
  export default {
    name:'EngineConfigModal',
    components: {
      SelectPage
    },
    data() {
      return {
        visible:false,
        loading:false,
        basicForm: this.$form.createForm(this),
        configForm: this.$form.createForm(this),
        title:'',
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
          valueDaddedTax: { rules: [{ required: true, message: '请输入增值税金及附加税点!' },{validator:this.isMoreThanZero}] },
          unitIncomeTax: { rules: [{ required: true, message: '请输入预缴企业所得税税点!' },{validator:this.isMoreThanZero}] },
          personIncomeTax: { rules: [{ required: true, message: '请输入预缴个人所得税税点!' },{validator:this.isMoreThanZero}] },
          salarySumTax: { rules: [{ required: true, message: '请输入应发工资税点!' },{validator:this.isMoreThanZero}] },
        },
        url:{
          addUrl:'/salary/tengineeringset',
          editUrl:'/salary/tengineeringset',
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
        this.$nextTick(() => {
          this.configForm.setFieldsValue(pick(this.model,'valueDaddedTax','unitIncomeTax','personIncomeTax','salarySumTax','limitMoney','managementTax',
          ))
          this.basicForm.setFieldsValue(pick(this.model,'departId','name'))
        })
      },
      handleCancel(){
        this.close()
      },
      handleOk() {
        let basicFlag = false
        let configFlag = false
        let basicValue
        let configValue
        this.basicForm.validateFields((err, values) => {
          if(!err){
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
          for(let c in this.settlementList){
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
              this.close()
              this.$emit('ok')
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
      isMoreThanZero(rule,value,callback) {
        if(parseInt(value) < 0){
          callback(new Error('当前值必须大于0'))
        }else{
          callback()
        }
      },
      changeManage(e){
        if(e.target.value != 0){
          this.model.salarySumTax = 0
          this.configForm.setFieldsValue(pick(this.model,'salarySumTax'))
        }
      },
      changeSalary(e){
        if(e.target.value != 0){
          this.model.managementTax = 0
          this.configForm.setFieldsValue(pick(this.model,'managementTax'))
        }
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