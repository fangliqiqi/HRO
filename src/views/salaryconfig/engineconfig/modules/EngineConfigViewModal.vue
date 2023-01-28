<template>
  <a-modal
    :width="1000"
    :visible="visible"
    title="详情"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="取消"
  >
    <a-card title="基础信息">
      <a-form>
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
              <span>{{ record.departName }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item
              label="配置名称:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ record.name }}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-card
      title="计薪配置"
      style="margin-top:20px"
    >
      <a-form>
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
              <span>{{ record.limitMoney }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="增值税金及附加税点:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ record.valueDaddedTax }}</span>
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
              <span>{{ record.managementTax }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="应发工资税点:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ record.salarySumTax }}</span>
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
              <span>{{ record.unitIncomeTax }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="预缴个人所得税税点:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ record.personIncomeTax }}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </a-modal>
</template>
<script>
export default {
  name: 'EngineConfigViewModal',
  data() {
    return{
      visible:false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      record:{},
    }
  },
  methods:{
    show(record){
      this.visible = true
      this.record = record
    },
    handleCancel(){
      this.visible = false
    },
    handleOk(){
      this.visible = false
    }
  }
}
</script>
