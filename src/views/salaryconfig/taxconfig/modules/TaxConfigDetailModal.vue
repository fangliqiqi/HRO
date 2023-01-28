<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="取消"
    :visible="visible"
    :maskClosable="false"
  >
    <a-card :bordered="false">
      <a-form>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="全月应纳税所得额下限"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ record.minIncome }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="全月应纳税所得额上限"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ record.maxIncome }}</span>
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
              <span>{{ record.withholdingRate }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="个税起征点"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ record.startPoint }}</span>
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
              <span>{{ record.quickDeducation }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="级数"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ record.level }}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </a-modal>
</template>
<script>
export default {
  name: 'TaxConfigDetailModal',
  data() {
    return{
      visible:false,
      title:'详情',
      record:{},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
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
