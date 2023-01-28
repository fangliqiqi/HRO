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
              label="工资月份:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ monthOptions[record.salaryMonth] }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="结算月份:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ monthOptions[record.settleMonth] }}</span>
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
              <span>{{ monthOptions[record.socialMonth] }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="公积金月份:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ monthOptions[record.fundMonth] }}</span>
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
              <span>{{ priorityOption[record.socialPriority] }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="公积金优先级:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ priorityOption[record.fundPriority] }}</span>
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
              <span>{{ grantTypeOption[record.grantType] }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="年终奖扣税:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ annualBonusTypeOption[record.annualBonusType] }}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </a-modal>
</template>
<script>
export default {
  name: 'StandardConfigViewModal',
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
      monthOptions:{'-6':'前6月','-5':'前5月','-4':'前4月','-3':'前3月','-2':'上上月','-1':'上月','0':'本月','1':'下月'},
      priorityOption:{'0':'生成','1':'缴纳'},
      grantTypeOption:{'0':'现金','1':'转账'},
      annualBonusTypeOption:{'0':'合并','1':'单独','2':'自动计算'}
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
