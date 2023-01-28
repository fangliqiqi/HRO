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
              label="创建时间:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.createTime }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="所得期间起:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.createStart }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="所得期间止:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.createEnd }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="减除费用:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.costReduction }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="导入月份:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.createMonth }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="本期收入:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.currentIncome }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="本期免税收入:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.currentIncomeTaxFree }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="其它金额:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.otherMoney }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="准予扣除的捐赠额:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.donationAmount }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="企业(职业)年金:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.enterpriseAnnuity }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="住房公积金:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.fund }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="证照号码:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.idNumber }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="基本医疗保险费:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.insuranceMedical }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="基本养老保险费:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.insurancePension }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="失业保险费:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.insuranceUnemployment }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="累计子女教育:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.sumChildEduMoney }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="累计继续教育:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.sumContinuingEducationMoney }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="累计住房贷款利息:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.sumHousingLoanMoney }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="累计住房租金:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.sumHousingRentMoney }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="累计赡养老人:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.sumSupportElderlyMoney }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="累计3岁以下婴幼儿照护:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.sumBabyMoney }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="累计个人养老金:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.sumPrivatePension }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="商业健康保险:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.takingRisks }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="税延养老保险:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.taxDeferredInsurance }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="减免税额:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.taxSavings }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="已扣缴税额:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.taxesWithheld }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="税前扣除项目合计:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.preTaxDeduction }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="申报单位:"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <span>{{ specialConfigInfo.declareTitle }}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </a-modal>
</template>
<script>
export default {
  name: 'SpecialConfigModal',
  data(){
    return{
      visible: false,
      title:'',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      specialConfigInfo: {}
    }
  },
  methods:{
    edit(record){
      this.visible = true
      this.specialConfigInfo = record
      console.log(record);
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
