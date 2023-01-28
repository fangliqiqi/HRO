<template>
  <a-modal
    :width="1000"
    :visible="visible"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="取消"
    :maskClosable="false"
  >
    <a-card :title="specialConfigInfo.name">
      <a-form>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="费用月份:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.moneyMonth }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="结算月份:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.settleMonth }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="人次:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.personTime }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="客户联系人:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.contactMan }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="客户联系方式:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.contactPhone }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="客服:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.customerService }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="客户开发人:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.developer }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="结算主体:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.settleDepartName }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="结算主体编码:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.settleDepartNo }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="停止结算年月:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.stopMonth }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="结算金额:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.settleMoney }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="银付:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.cardPay }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="现付:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.moneyPay }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="管理费:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.managementMoney }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="5%税金:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.countTax5 }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="6%税金:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.countTax6 }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="开票金额:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.ticketMoneySum }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="到款日期:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.getMoneyDate }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="到款金额:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.getMoneyValue }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="到款方式:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.getMoneyWay }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="到款单位:"
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
            >
              <span>{{ specialConfigInfo.getMoneyUnit }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注:"
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
            >
              <span>{{ specialConfigInfo.remark }}</span>
            </a-form-item>
          </a-col>

        </a-row>
        <a-row v-if="specialConfigInfo.status == 3">
          <a-col :span="24">
            <a-form-item
              label="拒绝原因:"
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
            >
              <span>{{ specialConfigInfo.auditContent }}</span>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>
    </a-card>
  </a-modal>
</template>
<script>
export default {
  name: 'NetIncomeDetail',
  data(){
    return{
      visible: false,
      title:'',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      labelCol1: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol1: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      specialConfigInfo: {}
    }
  },
  methods:{
    edit(record){
      this.visible = true
      this.specialConfigInfo = record
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
