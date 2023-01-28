<template>
  <a-modal
    :title="title"
    :width="1200"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
    :maskClosable="false"
    :destroyOnClose="true"
    okText="提交"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row :gutter="24">
          <a-col :span="11">
            <a-col :span="24">
              <a-form-item
                label="社保户"
                class="stepFormText"
              >
                <a-select
                  :disabled="true"
                  placeholder="请选择社保户"
                  v-decorator="['socialHousehold']"
                  style="width: 307px"
                >
                  <a-select-option
                    v-for="(value, key) in houseHolds"
                    :key="key"
                    :value="value.id"
                  >{{ value.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="社保缴纳地"
                class="stepFormText"
              >
                <a-input
                  style="width: 307px"
                  :disabled="true"
                  v-decorator="['socialArea']"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="社保起缴日期"
                class="stepFormText"
              >
                <a-input
                  style="width: 307px"
                  :disabled="true"
                  v-decorator="['socialStartDate']"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="社保基数下限"
                class="stepFormText"
              >
                <a-input
                  :disabled="true"
                  placeholder="基数下限"
                  v-decorator="['lowerLimit']"
                  style="width: 85px"
                />
              </a-form-item>
              <a-form-item
                label="社保基数上限"
                class="stepFormText"
              >
                <a-input
                  :disabled="true"
                  placeholder="基数上限"
                  v-decorator="['upperLimit']"
                  style="width: 85px"
                />
              </a-form-item>
            </a-col>
            <a-col
              :span="24"
              v-if="flag.socialCanOverpay"
            >
              <a-form-item
                label="补缴期限"
                class="stepFormText"
              >
                <a-input
                  style="width: 85px"
                  :disabled="true"
                  v-decorator="['socialOverpayNumber']"
                />
              </a-form-item>
              <a-form-item
                label="是否含当月"
                class="stepFormText"
              >
                <a-input
                  style="width: 85px"
                  :disabled="true"
                  v-decorator="['socialHaveThisMonth']"
                />
              </a-form-item>
            </a-col>
            <a-col
              :span="24"
              v-if="flag.socialCanOverpay"
            >
              <a-form-item
                label="补缴采用最新基数"
                class="stepFormText"
              >
                <a-input
                  style="width: 307px;"
                  :disabled="true"
                  v-decorator="['insuranceIsLatestCardinalityOfSocial']"
                />
              </a-form-item>
            </a-col>
            <a-col
              :span="24"
              v-if="flag.socialCanOverpay"
            >
              <a-form-item label="补缴险种">
                <a-checkbox-group
                  :disabled="true"
                  v-decorator="['typeOfInsurance']"
                >
                  <a-checkbox
                    v-for="(value, key) in typeOfInsuranceOptions"
                    :key="key"
                    :value="key"
                  >{{ value }}</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
            </a-col>
            <a-col
              :span="24"
              v-if="flag.socialCanOverpay"
            >
              <a-form-item
                label="社保补缴政策"
                class="stepFormText"
              >
                <a-textarea
                  style="width: 307px;"
                  :disabled="true"
                  v-decorator="['socialPayPolicy']"
                />
              </a-form-item>
            </a-col>
            <a-col
              :span="24"
              v-if="flag.socialIsIllness"
            >
              <a-form-item label="新员工入职收费">
                <a-radio-group
                  :disabled="true"
                  class="fontiframe"
                  name="radioGroup"
                  v-decorator="['isChargePersonal']"
                >
                  <a-radio value="0">是</a-radio>
                  <a-radio value="1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="大病救助缴纳周期">
                <a-radio-group
                  :disabled="true"
                  class="fontiframe"
                  name="radioGroup"
                  v-decorator="['collectType']"
                >
                  <a-radio value="0">年</a-radio>
                  <a-radio value="1">月</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col
              :span="24"
              v-if="flag.socialIsIllness"
            >
              <a-form-item
                label="缴纳方式"
                class="stepFormText"
              >
                <a-select
                  :disabled="true"
                  placeholder="请选择"
                  v-decorator="['valueType', {}]"
                  style="width: 110px"
                >
                  <a-select-option value="0">按定值</a-select-option>
                  <a-select-option value="1">按比例</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="缴纳月份">
                <a-select
                  :disabled="true"
                  placeholder="缴纳月份"
                  v-decorator="['collectMoth', {}]"
                  style="width: 110px"
                >
                  <a-select-option
                    v-for="(value, key) in collectMothOptions"
                    :key="key"
                    :value="key"
                  >{{ value }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="缴纳类型"
                class="stepFormText"
              >
                <a-select
                  :disabled="true"
                  placeholder="请选择缴纳类型"
                  v-decorator="['paymentType']"
                  style="width: 110px"
                >
                  <a-select-option value="0">最低缴纳</a-select-option>
                  <a-select-option value="1">自定义缴纳</a-select-option>
                  <a-select-option value="2">最高缴纳</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="备案基数">
                <a-input
                  :disabled="true"
                  v-decorator="['recordBase']"
                  style="width: 110px"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="委托备注"
                class="stepFormText"
              >
                <a-textarea
                  :disabled="true"
                  v-decorator="['trustRemark', {}]"
                  style="width: 307px"
                />
              </a-form-item>
            </a-col>

          </a-col>
          <a-col :span="13">
            <a-row>
              <a-col :span="24">
                <a-form-item label="单位养老">
                  <a-input
                    :disabled="endowmentDisabled"
                    placeholder="请填写基数"
                    v-decorator="['unitPensionCardinal',{rules: validateFields.base}]"
                    @change="changeBase($event,'unitPensionPer','unitPersionMoney')"
                    style="width: 90px"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="endowmentDisabled"
                    placeholder="请填写比例"
                    v-decorator="['unitPensionPer',{rules: validateFields.proportion}]"
                    @change="changeProporte($event,'unitPensionCardinal','unitPersionMoney')"
                    style="width: 90px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="true"
                    placeholder="请填写金额"
                    v-decorator="['unitPersionMoney']"
                    style="width: 90px"
                  />
                </a-form-item>
                <a-form-item>
                  <a-month-picker
                    :disabled="dateDisabled.endowmentDataDisabled"
                    :disabledDate="disabledDate"
                    placeholder="请选择起缴日期"
                    style="width: 140px"
                    v-decorator="['pensionStart']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="单位医疗">
                  <a-input
                    :disabled="medicalDisabled"
                    placeholder="请填写基数"
                    v-decorator="['unitMedicalCardinal',{rules: validateFields.base}]"
                    @change="changeBase($event,'unitMedicalPer','unitMedicalMoney')"
                    style="width: 90px"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="medicalDisabled"
                    placeholder="请填写比例"
                    v-decorator="['unitMedicalPer',{rules: validateFields.proportion}]"
                    @change="changeProporte($event,'unitMedicalCardinal','unitMedicalMoney')"
                    style="width: 90px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="true"
                    placeholder="请填写金额"
                    v-decorator="['unitMedicalMoney']"
                    style="width: 90px"
                  />
                </a-form-item>
                <a-form-item>
                  <a-month-picker
                    :disabled="dateDisabled.medicalDateDisabled"
                    :disabledDate="disabledDate"
                    placeholder="请选择起缴日期"
                    style="width: 140px"
                    v-decorator="['medicalStart']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="单位失业">
                  <a-input
                    :disabled="unemployeDisabled"
                    placeholder="请填写基数"
                    v-decorator="['unitUnemploymentCardinal',{rules: validateFields.base}]"
                    @change="changeBase($event,'unitUnemploymentPer','unitUnemploymentMoney')"
                    style="width: 90px"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="unemployeDisabled"
                    placeholder="请填写比例"
                    v-decorator="['unitUnemploymentPer',{rules: validateFields.proportion}]"
                    @change="changeProporte($event,'unitUnemploymentCardinal','unitUnemploymentMoney')"
                    style="width: 90px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="true"
                    placeholder="请填写金额"
                    v-decorator="['unitUnemploymentMoney']"
                    style="width: 90px"
                  />
                </a-form-item>
                <a-form-item>
                  <a-month-picker
                    :disabled="dateDisabled.unemployeDateDisabled"
                    :disabledDate="disabledDate"
                    placeholder="请选择起缴日期"
                    style="width: 140px"
                    v-decorator="['unemployStart']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="单位工伤">
                  <a-input
                    :disabled="injuryDisabled"
                    placeholder="请填写基数"
                    v-decorator="['unitWorkInjuryCardinal',{rules: validateFields.base}]"
                    @change="changeBase($event,'unitWorkUnjuryPer','unitInjuryMoney')"
                    style="width: 90px"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="injuryDisabled"
                    placeholder="请填写比例"
                    v-decorator="['unitWorkUnjuryPer',{rules: validateFields.proportion}]"
                    @change="changeProporte($event,'unitWorkInjuryCardinal','unitInjuryMoney')"
                    style="width: 90px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="true"
                    placeholder="请填写金额"
                    v-decorator="['unitInjuryMoney']"
                    style="width: 90px"
                  />
                </a-form-item>
                <a-form-item>
                  <a-month-picker
                    :disabled="dateDisabled.injuryDateDisabled"
                    :disabledDate="disabledDate"
                    placeholder="请选择起缴日期"
                    style="width: 140px"
                    v-decorator="['workInjuryStart']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="单位生育">
                  <a-input
                    :disabled="fertilityDisabled"
                    placeholder="请填写基数"
                    v-decorator="['unitBirthCardinal',{rules: validateFields.base}]"
                    @change="changeBase($event,'unitBirthPer','unitBirthMoney')"
                    style="width: 90px"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="fertilityDisabled"
                    placeholder="请填写比例"
                    v-decorator="['unitBirthPer',{rules: validateFields.proportion}]"
                    @change="changeProporte($event,'unitBirthCardinal','unitBirthMoney')"
                    style="width: 90px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="true"
                    placeholder="请填写金额"
                    v-decorator="['unitBirthMoney']"
                    style="width: 90px"
                  />
                </a-form-item>
                <a-form-item>
                  <a-month-picker
                    :disabled="dateDisabled.fertilityDateDisabled"
                    :disabledDate="disabledDate"
                    placeholder="请选择起缴日期"
                    style="width: 140px"
                    v-decorator="['birthStart']"
                  />
                </a-form-item>
              </a-col>
              <a-col
                :span="24"
                v-if="flag.socialIsIllness"
              >
                <a-form-item label="单位大病">
                  <a-input
                    :disabled="true"
                    placeholder="请填写基数"
                    v-decorator="['unitBigailmentCardinal',{rules: validateFields.baseno}]"
                    @change="changeBase($event,'unitBigailmentPer','unitBigailmentMoney')"
                    style="width: 90px"
                    v-if="flag.socialValueType"
                  />
                </a-form-item>
                <a-form-item v-if="flag.socialValueType">
                  <a-input
                    :disabled="true"
                    placeholder="请填写比例"
                    v-decorator="['unitBigailmentPer',{rules: validateFields.proportion}]"
                    @change="changeProporte($event,'unitBigailmentCardinal','unitBigailmentMoney')"
                    style="width: 90px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="true"
                    placeholder="请填写金额"
                    v-decorator="['unitBigailmentMoney',{rules: validateFields.base}]"
                    style="width: 90px"
                  />
                </a-form-item>
                <a-form-item>
                  <a-month-picker
                    :disabled="dateDisabled.diseaseDateDisabled"
                    :disabledDate="disabledDate"
                    placeholder="请选择起缴日期"
                    style="width: 140px"
                    v-decorator="['bigailmentStart']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="个人养老">
                  <a-input
                    :disabled="endowmentDisabled"
                    placeholder="请填写基数"
                    v-decorator="['personalPensionCardinal',{rules: validateFields.base}]"
                    @change="changeBase($event,'personalPensionPer','personalPersionMoney')"
                    style="width: 136px"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="endowmentDisabled"
                    placeholder="请填写比例"
                    v-decorator="['personalPensionPer',{rules: validateFields.proportion}]"
                    @change="changeProporte($event,'personalPensionCardinal','personalPersionMoney')"
                    style="width: 136px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="true"
                    placeholder="请填写金额"
                    v-decorator="['personalPersionMoney']"
                    style="width: 136px"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="个人医疗">
                  <a-input
                    :disabled="medicalDisabled"
                    placeholder="请填写基数"
                    v-decorator="['personalMedicalCardinal',{rules: validateFields.base}]"
                    @change="changeBase($event,'personalMedicalPer','personalMedicalMoney')"
                    style="width: 136px"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="medicalDisabled"
                    placeholder="请填写比例"
                    v-decorator="['personalMedicalPer',{rules: validateFields.proportion}]"
                    @change="changeProporte($event,'personalMedicalCardinal','personalMedicalMoney')"
                    style="width: 136px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="true"
                    placeholder="请填写金额"
                    v-decorator="['personalMedicalMoney']"
                    style="width: 136px"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="个人失业">
                  <a-input
                    :disabled="unemployeDisabled"
                    placeholder="请填写基数"
                    v-decorator="['personalUnemploymentCardinal',{rules: validateFields.base}]"
                    @change="changeBase($event,'personalUnemploymentPer','personalUnemploymentMoney')"
                    style="width: 136px"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="unemployeDisabled"
                    placeholder="请填写比例"
                    v-decorator="['personalUnemploymentPer',{rules: validateFields.proportion}]"
                    @change="changeProporte($event,'personalUnemploymentCardinal','personalUnemploymentMoney')"
                    style="width: 136px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="true"
                    placeholder="请填写金额"
                    v-decorator="['personalUnemploymentMoney']"
                    style="width: 136px"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <template v-if="flag.socialIsIllness && flag.isChargePersonalStatus">
                  <a-form-item label="个人大病">
                    <a-input
                      :disabled="true"
                      placeholder="请填写基数"
                      v-decorator="['personalBigailmentCardinal',{rules: validateFields.baseno}]"
                      @change="changeBase($event,'personalBigailmentPer','personalBigailmentMoney')"
                      style="width: 136px"
                      v-if="flag.socialValueType"
                    />
                  </a-form-item>
                  <a-form-item v-if="flag.socialValueType">
                    <a-input
                      :disabled="true"
                      placeholder="请填写比例"
                      v-decorator="['personalBigailmentPer',{rules: validateFields.proportion}]"
                      @change="changeProporte($event,'personalBigailmentCardinal','personalBigailmentMoney')"
                      style="width: 136px"
                      addonAfter="%"
                    />
                  </a-form-item>
                  <a-form-item>
                    <a-input
                      :disabled="true"
                      placeholder="请填写金额"
                      v-decorator="['personalBigailmentMoney',{rules: validateFields.base}]"
                      style="width: 136px"
                    />
                  </a-form-item>
                </template>
                <a-form-item label="重新发起说明">
                  <a-textarea
                    placeholder="请填写重新发起说明"
                    v-decorator="['repeatReason',{rules:validateFields.repeatReason}]"
                    style="width: 415px;resize:none;"
                  />
                </a-form-item>
              </a-col>

            </a-row>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { getAreaName,formatFloat } from '@/utils/common'
  import { httpAction } from '../../../../../api/manage'
  import moment from 'moment';

  export default {
    name: 'ReDispatchApplyModal',
    props:{
      houseHolds:{
        type: Array,
        default: ()=>[],
        required: true
      },
      flag:{
        type: Object,
        default: ()=>{},
        required: true
      }
    },
    data() {
      return {
        title: '派单',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        typeOfInsuranceOptions: {'insurancePension': '养老', 'insuranceMedical': '医疗', 'insuranceUnemployment': '失业', 'insuranceInjury': '工伤', 'insuranceBirth': '生育', 'insuranceBigailment': '大病'},  // 险种
        collectMothOptions: {'1': '一月', '2': '二月', '3': '三月', '4': '四月', '5': '五月', '6': '六月', '7': '七月', '8': '八月', '9': '九月', '10': '十月', '11': '十一月', '12': '十二月'}, // 缴纳月份
        overpayNumberOptions: {'1': '一个月', '2': '两个月', '3': '三个月', '4': '四个月', '5': '五个月', '6': '六个月', '7': '七个月', '8': '八个月', '9': '九个月', '10': '十个月', '11': '十一个月', '12': '十二个月'}, // 补缴期限
        model:{},
        endowmentDisabled:true,
        medicalDisabled:true,
        unemployeDisabled:true,
        injuryDisabled:true,
        fertilityDisabled:true,
        diseaseDisabled:true,
        validateFields:{
          base: [
            {required:true,message:'基数不能为空'},
            {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))|0)$/, message: '基数格式不正确!' },
            {validator: this.validateBase}
          ],
          baseno: [
            {required:true,message:'基数不能为空'},
            { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))|0)$/, message: '基数格式不正确!' }
          ],
          proportion: [{required:true,message:'比例不能为空'},{pattern: /^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|100|0)$/,message: '比例格式不正确!'}],
          repeatReason:[{required:true,message:'重新发起说明不能为空'},{max:100,message:'最多100个字符！'}]
        },
        editField:{},
        dateDisabled:{
          endowmentDataDisabled:true,
          medicalDateDisabled:true,
          unemployeDateDisabled:true,
          injuryDateDisabled:true,
          fertilityDateDisabled:true,
          diseaseDateDisabled:true,
        },
        sysBaseSetByEntityOfSocial:{},
        extraEditFilds: [],
      }
    },
    methods:{

      validateBase(rule, value, callback){
        if(this.model.socialType == 1 && rule.field !== 'unitWorkInjuryCardinal'){
          callback();
          return true;
        }
        if(rule.field === 'unitBigailmentMoney' || rule.field === 'personalBigailmentMoney'){
          callback();
          return true;
        }
        const condition = {
          'unitPensionCardinal': this.endowmentDisabled,
          'unitMedicalCardinal': this.medicalDisabled,
          'unitUnemploymentCardinal': this.unemployeDisabled,
          'unitWorkInjuryCardinal': this.injuryDisabled,
          'unitBirthCardinal': this.fertilityDisabled,
          'personalPensionCardinal': this.endowmentDisabled,
          'personalMedicalCardinal': this.medicalDisabled,
          'personalUnemploymentCardinal': this.unemployeDisabled
        }
        if(condition[rule.field]){
          callback();
          return true;
        }
        
        if(value < this.model.lowerLimit || value > this.model.upperLimit){
          callback('超出范围！');
          return false;
        }
        callback();
        return true;
      },
      handleData(field1,field2,field3,per1,field4,per2){
        if(this.model.paymentType === '0'){
          // 最低
          this.model[field1] = this.sysBaseSetByEntityOfSocial.lowerLimit;
          if(field2){
            this.model[field2] = this.sysBaseSetByEntityOfSocial.lowerLimit;
          }
          this.model[field3] = formatFloat(parseFloat(this.sysBaseSetByEntityOfSocial.lowerLimit) * parseFloat(this.model[per1]/100));
          if(field4){
            this.model[field4] = formatFloat(parseFloat(this.sysBaseSetByEntityOfSocial.lowerLimit) * parseFloat(this.model[per2]/100));
          }
        }else if(this.model.paymentType === '2'){
          // 最高
          this.model[field1] = this.sysBaseSetByEntityOfSocial.upperLimit;
          if(field2){
            this.model[field2] = this.sysBaseSetByEntityOfSocial.upperLimit;
          }
          this.model[field3] = formatFloat(parseFloat(this.sysBaseSetByEntityOfSocial.upperLimit) * parseFloat(this.model[per1]/100));
          if(field4){
            this.model[field4] = formatFloat(parseFloat(this.sysBaseSetByEntityOfSocial.upperLimit) * parseFloat(this.model[per2]/100));
          }
        }
        this.extraEditFilds = this.extraEditFilds.concat([field1,field2,field3,field4])
      },
      // valueType 0定值1比例
      editableRow(field,record){
        let flag=true,dateDisable
        // 0最低1自定义2最高缴纳
        if(this.model.paymentType === '1'){
          flag = record === '2' ? false : true
        }
        dateDisable = record === '2' ? false : true
        
        switch(field){
          case 'pensionHandle':
            this.endowmentDisabled = flag
            this.dateDisabled.endowmentDataDisabled = dateDisable
            if(!dateDisable){
              this.handleData('unitPensionCardinal','personalPensionCardinal','unitPersionMoney','unitPensionPer','personalPersionMoney','personalPensionPer');
            }
            break
          case 'medicalHandle':
            this.medicalDisabled = flag
            this.dateDisabled.medicalDateDisabled = dateDisable
            if(!dateDisable){
              this.handleData('unitMedicalCardinal','personalMedicalCardinal','unitMedicalMoney','unitMedicalPer','personalMedicalMoney','personalMedicalPer');
            }
            break
          case 'unemployHandle':
            this.unemployeDisabled = flag
            this.dateDisabled.unemployeDateDisabled = dateDisable
            if(!dateDisable){
              this.handleData('unitUnemploymentCardinal','personalUnemploymentCardinal','unitUnemploymentMoney','unitUnemploymentPer','personalUnemploymentMoney','personalUnemploymentPer');
            }
            break
          case 'workInjuryHandle':
            this.injuryDisabled = flag
            this.dateDisabled.injuryDateDisabled = dateDisable
            if(!dateDisable){
              this.handleData('unitWorkInjuryCardinal',null,'unitInjuryMoney','unitWorkUnjuryPer',null,null);
            }
            break
          case 'birthHandle':
            this.fertilityDisabled = flag
            this.dateDisabled.fertilityDateDisabled = dateDisable
            if(!dateDisable){
              this.handleData('unitBirthCardinal',null,'unitBirthMoney','unitBirthPer',null,null);
            }
            break
          case 'bigailmentHandle':
            this.diseaseDisabled = flag
            this.dateDisabled.diseaseDateDisabled = dateDisable
            // 单位大病
            if(!dateDisable && this.flag.socialIsIllness){
              this.illnessHandle('unitBigailmentCardinal','unitBigailmentMoney','unitBigailmentPer');
            }
            // 个人大病
            if(!dateDisable && this.flag.socialIsIllness && this.flag.isChargePersonalStatus){
              this.illnessHandle('personalBigailmentCardinal','personalBigailmentMoney','personalBigailmentPer');
            }
            break
        }
        this.editField[field] = flag
      },
      illnessHandle(field1,field2,per){
        if(this.model.paymentType === '0'){
          // this.model.valueType 0定值1比例  personalBigailmentMoney  unitBigailmentMoney
          if(this.flag.socialValueType){
            if(this.model.valueType === '1'){
              this.model[field1] = this.sysBaseSetByEntityOfSocial.lowerLimit;
              this.model[field2] = formatFloat(parseFloat(this.sysBaseSetByEntityOfSocial.lowerLimit) * parseFloat(this.model[per]/100));
              this.extraEditFilds = this.extraEditFilds.concat([field1,field2])
            }
          }
        }else if(this.model.paymentType === '2'){
          if(this.flag.socialValueType){
            if(this.model.valueType === '1'){
              this.model[field1] = this.sysBaseSetByEntityOfSocial.upperLimit;
              this.model[field2] = formatFloat(parseFloat(this.sysBaseSetByEntityOfSocial.upperLimit) * parseFloat(this.model[per]/100));
              this.extraEditFilds = this.extraEditFilds.concat([field1,field2])
            }
          }
        }
      },
      changeBase(e,field1,field2){
        const val = e.target.value
        const propte = this.form.getFieldValue(field1)
        if(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))|0)$/.test(val) && /^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|100|0)$/.test(propte)){
          const obj = {}
          obj[field2] = Math.round(parseFloat(val * propte))/100
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(obj,field2))
          })
        }
      },
      changeProporte(e,field1,field2){
        const val = e.target.value
        const base = this.form.getFieldValue(field1)
        if(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))|0)$/.test(base) && /^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|100|0)$/.test(val)){
          const obj = {}
          obj[field2] = Math.round(parseFloat(val * base))/100
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(obj,field2))
          })
        }
      },
      disabledDate(current) {
        return current < this.model.socialStartDate.startOf('day') || current > moment(this.sysBaseSetByEntityOfSocial.applyEndDate).endOf('day');
      },
      show(record,sysBaseSetByEntityOfSocial){
        this.model = record
        this.sysBaseSetByEntityOfSocial = sysBaseSetByEntityOfSocial
        const fieldArr = ['birthHandle','bigailmentHandle','medicalHandle','pensionHandle','unemployHandle','workInjuryHandle']
        const _this = this
        fieldArr.forEach(item=>{
          _this.editableRow(item,record[item])
        })
        // 兼职工伤，工伤的基数，需要在派单上下限范围内；其余险种的，基数为0，不可修改
        if(this.model.socialType == 1){
          this.endowmentDisabled = true;
          this.medicalDisabled = true;
          this.unemployeDisabled = true;
          this.fertilityDisabled = true;
        }
        this.visible = true
        const params = {
          socialHousehold: this.model.socialHousehold,
          socialStartDate: this.model.socialStartDate.format('YYYY-MM'),
          socialArea: getAreaName(this.model.socialProvince,this.model.socialCity,this.model.socialTown),
          lowerLimit: this.model.lowerLimit,
          upperLimit: this.model.upperLimit,
          socialOverpayNumber: this.overpayNumberOptions[this.model.socialOverpayNumber],
          socialHaveThisMonth: this.model.socialHaveThisMonth === '1' ? '否' : '是',
          insuranceIsLatestCardinalityOfSocial: this.model.insuranceIsLatestCardinalityOfSocial === '1' ? '否' : '是',
          typeOfInsurance: this.model.typeOfInsurance,
          socialPayPolicy: this.model.socialPayPolicy,
          isChargePersonal: this.model.isChargePersonal === '1' ? '否' : '是',
          collectType: this.model.collectType === '1' ? '月' : '年',
          valueType: this.model.valueType,
          collectMoth: this.model.collectMoth,
          paymentType: this.model.paymentType,
          recordBase: this.model.recordBase,
          trustRemark: this.model.trustRemark,
          unitPensionCardinal: this.model.unitPensionCardinal,
          unitPensionPer: this.model.unitPensionPer,
          unitPersionMoney: this.model.unitPersionMoney,
          pensionStart: this.model.pensionStart,
          unitMedicalCardinal: this.model.unitMedicalCardinal,
          unitMedicalPer: this.model.unitMedicalPer,
          unitMedicalMoney: this.model.unitMedicalMoney,
          medicalStart: this.model.medicalStart,
          unitUnemploymentCardinal: this.model.unitUnemploymentCardinal,
          unitUnemploymentPer: this.model.unitUnemploymentPer,
          unitUnemploymentMoney: this.model.unitUnemploymentMoney,
          unemployStart: this.model.unemployStart,
          unitWorkInjuryCardinal: this.model.unitWorkInjuryCardinal,
          unitWorkUnjuryPer: this.model.unitWorkUnjuryPer,
          unitInjuryMoney: this.model.unitInjuryMoney,
          workInjuryStart: this.model.workInjuryStart,
          unitBirthCardinal: this.model.unitBirthCardinal,
          unitBirthPer: this.model.unitBirthPer,
          unitBirthMoney: this.model.unitBirthMoney,
          birthStart: this.model.birthStart,
          unitBigailmentCardinal: this.model.unitBigailmentCardinal,
          unitBigailmentPer: this.model.unitBigailmentPer,
          unitBigailmentMoney: this.model.unitBigailmentMoney,
          bigailmentStart: this.model.bigailmentStart,
          personalPensionCardinal: this.model.personalPensionCardinal,
          personalPensionPer: this.model.personalPensionPer,
          personalPersionMoney: this.model.personalPersionMoney,
          personalMedicalCardinal: this.model.personalMedicalCardinal,
          personalMedicalPer: this.model.personalMedicalPer,
          personalMedicalMoney: this.model.personalMedicalMoney,
          personalUnemploymentCardinal: this.model.personalUnemploymentCardinal,
          personalUnemploymentPer: this.model.personalUnemploymentPer,
          personalUnemploymentMoney: this.model.personalUnemploymentMoney,
          personalBigailmentCardinal: this.model.personalBigailmentCardinal,
          personalBigailmentPer: this.model.personalBigailmentPer,
          personalBigailmentMoney: this.model.personalBigailmentMoney,
          repeatReason: this.model.repeatReason,
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(params, 'socialHousehold', 'socialArea','socialStartDate', 'lowerLimit', 'upperLimit',
          'socialOverpayNumber', 'socialHaveThisMonth','insuranceIsLatestCardinalityOfSocial','typeOfInsurance','socialPayPolicy',
          'isChargePersonal','collectType','valueType','collectMoth','paymentType','recordBase','trustRemark',
          'unitPensionCardinal','unitPensionPer','unitPersionMoney','pensionStart','unitMedicalCardinal','unitMedicalPer','unitMedicalMoney',
          'medicalStart','unitUnemploymentCardinal','unitUnemploymentPer','unitUnemploymentMoney','unemployStart','unitWorkInjuryCardinal',
          'unitWorkUnjuryPer','unitInjuryMoney','workInjuryStart','unitBirthCardinal','unitBirthPer','unitBirthMoney','birthStart',
          'unitBigailmentCardinal','unitBigailmentPer','unitBigailmentMoney','bigailmentStart','personalPensionCardinal','personalPensionPer',
          'personalPersionMoney','personalMedicalCardinal','personalMedicalPer','personalMedicalMoney','personalUnemploymentCardinal',
          'personalUnemploymentPer','personalUnemploymentMoney','personalBigailmentCardinal','personalBigailmentPer','personalBigailmentMoney',
          'repeatReason'))
        })
      },
      getParams(values){
        const fieldObj = {
          bigailmentHandle: ['unitBigailmentCardinal','unitBigailmentPer','unitBigailmentMoney','personalBigailmentCardinal','personalBigailmentPer','personalBigailmentMoney'],
          birthHandle:['unitBirthCardinal','unitBirthPer','unitBirthMoney'],
          workInjuryHandle:['unitWorkInjuryCardinal','unitWorkUnjuryPer','unitInjuryMoney'],
          unemployHandle: ['unitUnemploymentCardinal','unitUnemploymentPer','unitUnemploymentMoney','personalUnemploymentCardinal','personalUnemploymentPer','personalUnemploymentMoney'],
          medicalHandle: ['unitMedicalCardinal','unitMedicalPer','unitMedicalMoney','personalMedicalCardinal','personalMedicalPer','personalMedicalMoney'],
          pensionHandle: ['unitPensionCardinal','unitPensionPer','unitPersionMoney','personalPensionCardinal','personalPensionPer','personalPersionMoney']
        }
        let arr = []
        Object.keys(this.editField).forEach(item=>{
          if(!this.editField[item]){
            arr = arr.concat(fieldObj[item])
          }
        })
        const dateStart = {endowmentDataDisabled:'pensionStart',medicalDateDisabled:'medicalStart',unemployeDateDisabled:'unemployStart',injuryDateDisabled:'workInjuryStart',fertilityDateDisabled:'birthStart',diseaseDateDisabled:'bigailmentStart'}
        for(const key in this.dateDisabled){
          if(!this.dateDisabled[key]){
            arr = arr.concat(dateStart[key])
          }
        }
        let params = {}
        const time = ['bigailmentStart','birthStart','workInjuryStart','unemployStart','pensionStart','medicalStart']
        
        arr.concat(this.extraEditFilds).forEach(item=>{
          params[item] = (time.indexOf(item)>-1 && values[item]) ? values[item].format('YYYY-MM-DD 00:00:00') : values[item]
        })
        
        params['repeatReason'] = values.repeatReason
        params['id'] = this.model.socialId
        return params
      },
      handleOk(){
        this.form.validateFields((err, values) => {
          if (!err) {
            const params = this.getParams(values)
            httpAction(`/hrSocial/tdispatchinfo/repeatDispatch`,params,'post').then(res=>{
              if(res.code === 200){
                this.$message.success('提交成功')
                this.handleCancel()
                this.$emit('ok',params,res.data)
              }else{
                this.$message.warning(res.msg)
              }
            })
          }
        })
      },
      handleCancel(){
        this.visible = false
        this.model = {}
        this.editField = {}
        this.extraEditFilds = []
      },
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 120px;
  }
}
.ant-advanced-search-form .ant-form-item {
  margin-bottom: 18px;
}
</style>