<template>
  <a-modal
    :title="title"
    :width="1220"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        v-if="editButton"
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >保存</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="socialForm"
        layout="inline"
        class="ant-advanced-search-form ant-disabled-form"
      >
        <!-- 整个表单内容 -->
        <a-row :gutter="24">
          <!-- 左边内容 -->
          <a-col :span="12">
            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="选择社保户"
                  class="stepFormText"
                >
                  <a-select
                    showSearch
                    optionFilterProp="children"
                    placeholder="请选择社保户"
                    v-decorator="['departId', {rules: [{required: true, message: '请选择社保户！'}]}]"
                    :dropdownMatchSelectWidth="false"
                    style="width: 332px"
                    :disabled="socialIsDisabled || departDisabled"
                  >
                    <a-select-option
                      v-for="(value, key) in socialHouseholdOptions"
                      :key="key"
                      :value="value.id"
                      @click="handleDepartChange(value)"
                    >{{ value.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="社保缴纳地"
                  class="stepFormText"
                >
                  <a-select
                    showSearch
                    placeholder="选择省份"
                    optionFilterProp="children"
                    style="width: 100px"
                    v-decorator="['province', {rules: [{required: true, message: '请选择省份！'}]}]"
                    :dropdownMatchSelectWidth="false"
                    @change="handleSocialProvinceChange"
                    :disabled="socialIsDisabled || departDisabled"
                  >
                    <a-select-option
                      v-for="(item, index) in AreaTrees"
                      :key="index"
                      :value="item.id"
                    >{{ item.areaName }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-select
                    showSearch
                    placeholder="选择城市"
                    optionFilterProp="children"
                    style="width: 100px"
                    v-decorator="['city', {}]"
                    @change="handleSocialCityChange"
                    :dropdownMatchSelectWidth="false"
                    :disabled="socialIsDisabled || departDisabled"
                  >
                    <a-select-option
                      v-for="(item, index) in socialAreaCitys"
                      :key="index"
                      :value="item.id"
                    >{{ item.areaName }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-select
                    allowClear
                    showSearch
                    placeholder="选择区县"
                    optionFilterProp="children"
                    style="width: 100px"
                    v-decorator="['town', {}]"
                    :dropdownMatchSelectWidth="false"
                    :disabled="socialIsDisabled || departDisabled"
                  >
                    <a-select-option
                      v-for="(item, index) in socialAreaTowns"
                      :key="index"
                      :value="item.id"
                    >{{ item.areaName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="社保适用周期"
                  class="stepFormText"
                >
                  <a-range-picker
                    :placeholder="['起始月', '截止月']"
                    format="YYYY-MM"
                    v-decorator="['applyStartDate', {rules: [{required: true, message: '请选择社保适用周期！'}]}]"
                    :mode="['month', 'month']"
                    style="width: 332px"
                    @panelChange="handlePanelChange"
                    :disabled="socialIsDisabled"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="社保基数下限"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    title="输入“下限”后输入“上限”"
                  >
                    <a-input
                      :disabled="socialIsDisabled || inputLowerLimit"
                      placeholder="基数下限"
                      v-decorator="['lowerLimit', validatorSocialRules.lowerLimit]"
                      style="width: 104px"
                    />
                  </a-tooltip>
                </a-form-item>
                <a-form-item label="社保基数上限">
                  <a-tooltip
                    placement="topLeft"
                    title="清除“上限”后修改“下限”"
                  >
                    <a-input
                      :disabled="socialIsDisabled || inputUpperLimit"
                      placeholder="基数上限"
                      v-decorator="['upperLimit', validatorSocialRules.upperLimit]"
                      style="width: 104px"
                    />
                  </a-tooltip>
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="是否可以补缴"
                  class="stepFormText"
                >
                  <a-radio-group
                    :disabled="socialIsDisabled"
                    class="fontiframe"
                    name="radioGroup"
                    v-decorator="['canOverpay', {initialValue: '0', rules:[{required: true, message: '不能为空！'}]}]"
                    @change="handleCanOverpayChange"
                  >
                    <a-radio value="0">是</a-radio>
                    <a-radio value="1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>

              <a-col
                :span="24"
                v-if="socialCanOverpay"
              >
                <a-form-item
                  label="补缴期限"
                  class="stepFormText"
                >
                  <a-select
                    :disabled="socialIsDisabled"
                    placeholder="补缴期限"
                    v-decorator="['overpayNumber', {initialValue: '1', rules:[{required: true, message: '不能为空！'}]}]"
                    :dropdownMatchSelectWidth="false"
                    style="width: 104px"
                  >
                    <a-select-option
                      v-for="(value, key) in overpayNumberOptions"
                      :key="key"
                      :value="key"
                    >{{ value }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="是否含当月"
                  style="margin-left: 14px"
                >
                  <a-radio-group
                    :disabled="socialIsDisabled"
                    class="fontiframe"
                    name="radioGroup"
                    v-decorator="['haveThisMonth', {initialValue: '0', rules:[{required: true, message: '不能为空！'}]}]"
                  >
                    <a-radio value="0">是</a-radio>
                    <a-radio value="1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>

              <a-col
                :span="24"
                v-if="socialCanOverpay"
              >
                <a-form-item
                  label="补缴采用最新基数"
                  class="stepFormText"
                >
                  <a-radio-group
                    :disabled="socialIsDisabled"
                    class="fontiframe"
                    name="radioGroup"
                    v-decorator="['insuranceIsLatestCardinality', {initialValue: '0', rules:[{required: true, message: '不能为空！'}]}]"
                  >
                    <a-radio value="0">是</a-radio>
                    <a-radio value="1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>

              <a-col
                :span="24"
                v-if="socialCanOverpay"
              >
                <a-form-item
                  label="补缴险种"
                  class="stepFormText"
                >
                  <a-checkbox-group
                    :disabled="socialIsDisabled"
                    v-decorator="['typeOfInsurance', {initialValue: ['insurancePension', 'insuranceMedical', 'insuranceUnemployment', 'insuranceInjury', 'insuranceBirth', 'insuranceBigailment'], rules:[{required: true, message: '补缴险种不能为空！'}]}]"
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
                v-if="socialCanOverpay"
              >
                <a-form-item
                  label="社保补缴政策"
                  class="stepFormText"
                >
                  <a-textarea
                    :disabled="socialIsDisabled"
                    :rows="2"
                    placeholder="社保补缴政策"
                    v-decorator="['payPolicy', {rules:[{required: true, message: '补缴政策不能为空！'}]}]"
                    style="width: 332px"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <!-- 右边内容 -->
          <a-col :span="12">
            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="单位养老比例"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="socialIsDisabled"
                    placeholder="请填写比例"
                    v-decorator="['unitPersionPro', {initialValue: 0, rules: [{required: true, message: '请填写比例！'}, { validator: this.validateSocialUnitPensionPer }]}]"
                    style="width: 130px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item
                  label="单位医疗比例"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="socialIsDisabled"
                    placeholder="请填写比例"
                    v-decorator="['unitMedicalPro', {initialValue: 0, rules: [{required: true, message: '请填写比例！'}, { validator: this.validateSocialUnitMedicalPer }]}]"
                    style="width: 130px"
                    addonAfter="%"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="单位失业比例"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="socialIsDisabled"
                    placeholder="请填写比例"
                    v-decorator="['unitUnemploymentPro', {initialValue: 0, rules: [{required: true, message: '请填写比例！'}, { validator: this.validateSocialUnitUnemploymentPer }]}]"
                    style="width: 130px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item
                  label="单位工伤比例"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="socialIsDisabled"
                    placeholder="请填写比例"
                    v-decorator="['unitInjuryPro', {initialValue: 0, rules: [{required: true, message: '请填写比例！'}, { validator: this.validateSocialWorkUnjuryPer }]}]"
                    style="width: 130px"
                    addonAfter="%"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="单位生育比例"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="socialIsDisabled"
                    placeholder="请填写比例"
                    v-decorator="['unitBirthPro', {initialValue: 0, rules: [{required: true, message: '请填写比例！'}, { validator: this.validateSocialUnitBirthPer }]}]"
                    style="width: 130px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item
                  label="单位比例合计"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请填写比例"
                    v-decorator="['unitProSum', {}]"
                    style="width: 130px"
                    addonAfter="%"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="个人养老比例"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="socialIsDisabled"
                    placeholder="请填写比例"
                    v-decorator="['personalPersionPro', {initialValue: 0, rules: [{required: true, message: '请填写比例！'}, { validator: this.validateSocialPersonalPensionPer }]}]"
                    style="width: 130px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item
                  label="个人医疗比例"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="socialIsDisabled"
                    placeholder="请填写比例"
                    v-decorator="['personalMedicalPro', {initialValue: 0, rules: [{required: true, message: '请填写比例！'}, { validator: this.validateSocialPersonalMedicalPer }]}]"
                    style="width: 130px"
                    addonAfter="%"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="个人失业比例"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="socialIsDisabled"
                    placeholder="请填写比例"
                    v-decorator="['personalUnemploymentPro', {initialValue: 0, rules: [{required: true, message: '请填写比例！'}, { validator: this.validateSocialPersonalUnemploymentPer }]}]"
                    style="width: 130px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item
                  label="个人比例合计"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请填写比例"
                    v-decorator="['personalProSum', {}]"
                    style="width: 130px"
                    addonAfter="%"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="是否有大病"
                  class="stepFormText"
                >
                  <a-radio-group
                    :disabled="socialIsDisabled"
                    class="fontiframe"
                    name="radioGroup"
                    v-decorator="['isIllness', {initialValue: '0', rules:[{required: true, message: '不能为空！'}]}]"
                    @change="handleIsIllnessChange"
                  >
                    <a-radio value="0">是</a-radio>
                    <a-radio value="1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item
                  label="新员工入职收费"
                  style="margin-left: 36px"
                  v-if="socialIsIllness"
                >
                  <a-radio-group
                    :disabled="socialIsDisabled||selectedChargePersonal"
                    class="fontiframe"
                    name="radioGroup"
                    v-decorator="['isChargePersonal', {initialValue: '0', rules:[{required: true, message: '不能为空！'}]}]"
                    @change="handleIsChargePersonal"
                  >
                    <a-radio value="0">是</a-radio>
                    <a-radio value="1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>

              <a-col
                :span="24"
                v-if="socialIsIllness"
              >
                <a-form-item
                  label="大病缴纳周期"
                  class="stepFormText"
                >
                  <a-radio-group
                    :disabled="socialIsDisabled"
                    class="fontiframe"
                    name="radioGroup"
                    v-decorator="['collectType', {initialValue: '0', rules:[{required: true, message: '不能为空！'}]}]"
                    @change="handleCollectTypeChange"
                  >
                    <a-radio value="0">年</a-radio>
                    <a-radio value="1">月</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item
                  label="缴纳月份"
                  style="margin-left: 77px"
                  v-if="socialCollectType"
                >
                  <a-select
                    :disabled="socialIsDisabled"
                    placeholder="缴纳月份"
                    v-decorator="['collectMoth', {initialValue: '1', rules:[{required: true, message: '不能为空！'}]}]"
                    style="width: 130px"
                  >
                    <a-select-option
                      v-for="(value, key) in collectMothOptions"
                      :key="key"
                      :value="key"
                    >{{ value }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="缴纳方式"
                  style="margin-left: 77px"
                  v-show="!socialCollectType"
                >
                  <a-radio-group
                    :disabled="socialIsDisabled"
                    class="fontiframe"
                    name="radioGroup"
                    v-decorator="['valueType', {initialValue: '0', rules:[{required: true, message: '不能为空！'}]}]"
                    @change="handleValueTypeChange"
                  >
                    <a-radio value="0">定值</a-radio>
                    <a-radio value="1">比例</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>

              <a-col
                :span="24"
                v-if="socialIsIllness && socialValueType"
              >
                <a-form-item
                  label="单位大病金额"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="socialIsDisabled"
                    placeholder="填写金额"
                    v-decorator="['payCompany', {initialValue: '0', rules: [{required: true, message: '请填写金额！'}, { validator: this.validateSocialPayCompany }]}]"
                    style="width: 130px"
                    :addonAfter="addonAfterStr"
                  />
                </a-form-item>
                <a-form-item
                  label="个人大病金额"
                  class="stepFormText"
                  v-if="isChargePersonalStatus"
                >
                  <a-input
                    :disabled="socialIsDisabled"
                    placeholder="填写金额"
                    v-decorator="['payPersonal', {initialValue: '0', rules: [{required: true, message: '请填写金额！'}, { validator: this.validateSocialPayPersonal }]}]"
                    style="width: 130px"
                    :addonAfter="addonAfterStr"
                  />
                </a-form-item>
              </a-col>

              <a-col
                :span="24"
                v-if="socialIsIllness && !socialValueType"
              >
                <a-form-item
                  label="单位大病比例"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="socialIsDisabled"
                    placeholder="请填写比例"
                    v-decorator="['payCompanyPro', {initialValue: '0', rules: [{required: true, message: '请填写比例！'}, { validator: this.validateSocialPayCompanyPro }]}]"
                    style="width: 130px"
                    addonAfter="%"
                  />
                </a-form-item>
                <a-form-item
                  label="个人大病比例"
                  class="stepFormText"
                  v-if="isChargePersonalStatus"
                >
                  <a-input
                    :disabled="socialIsDisabled"
                    placeholder="请填写比例"
                    v-decorator="['payPersonalPro', {initialValue: '0', rules: [{required: true, message: '请填写比例！'}, { validator: this.validateSocialPayPersonalPro }]}]"
                    style="width: 130px"
                    addonAfter="%"
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
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'SocialSettingModal',
    data() {
      return {
        moment,
        model: {},
        title: '操作',
        visible: false,
        departName: '', // 户名称
        editButton: true, // 保存按钮
        confirmLoading: false,
        socialForm: this.$form.createForm(this),
        dateFormat: 'YYYY-MM',  // 时间格式化类型
        AreaTrees: [], // 所有地区
        addonAfterStr: '元/年', // 默认金额单位
        socialAreaCitys: [],  // 社保城市
        socialAreaTowns: [],  // 社保区县
        departDisabled: false,  // 编辑的时候户不能修改
        inputLowerLimit: false, // 下线可输入状态
        inputUpperLimit: true, // 上线可输入状态
        socialCanOverpay: true, // 社保是否可补缴
        socialIsIllness: true, // 是否可大病
        socialCollectType: true,  // 按年收取大病
        socialValueType: true,  // 大病按定值不显示
        socialHouseholdOptions: [], // 社保户
        socialIsDisabled: false, // 是否是修改
        isChargePersonalStatus: true, // 新员工是否缴费
        overpayNumberOptions: {'1': '一个月', '2': '两个月', '3': '三个月', '4': '四个月', '5': '五个月', '6': '六个月', '7': '七个月', '8': '八个月', '9': '九个月', '10': '十个月', '11': '十一个月', '12': '十二个月'}, // 补缴期限
        collectMothOptions: {'1': '一月', '2': '二月', '3': '三月', '4': '四月', '5': '五月', '6': '六月', '7': '七月', '8': '八月', '9': '九月', '10': '十月', '11': '十一月', '12': '十二月'}, // 缴纳月份
        typeOfInsuranceOptions: {'insurancePension': '养老', 'insuranceMedical': '医疗', 'insuranceUnemployment': '失业', 'insuranceInjury': '工伤', 'insuranceBirth': '生育', 'insuranceBigailment': '大病'},  // 险种
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        // 社保数据校验
        validatorSocialRules: {
          lowerLimit: { initialValue: 0, rules: [{required: true, message: '不能为空！'}, { validator: this.validateSocialLowerLimit }] },
          upperLimit: { initialValue: 0, rules: [{required: true, message: '不能为空！'}, { validator: this.validateSocialUpperLimit }] },
        },
        url: {
          add: 'hrSocial/sysbasesetinfo',
          edit: 'hrSocial/sysbasesetinfo',
        },
        // 新增字段
        selectedChargePersonal:false
      }
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record) {
        this.socialForm.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        /************************************************* 社保数据 *************************************************/
        console.log(record);
        console.log(this.model.id);
        
        if (this.model.id) {  // 编辑
          this.inputLowerLimit = true // 下线可输入状态
          this.inputUpperLimit = false // 上线可输入状态
          this.departDisabled = true  // 户不能修改
          let socialInfoData = this.model
          // 社保适用周期时间处理
          let applyStartDate = null
          applyStartDate = !this.model.applyStartDate ? null : moment(this.model.applyStartDate, this.dateFormat)
          this.model.applyStartDate = []
          this.model.applyStartDate[0] = applyStartDate
          this.model.applyStartDate[1] = !this.model.applyEndDate ? null : moment(this.model.applyEndDate, this.dateFormat)
          
          this.$nextTick(() => {
            this.socialForm.setFieldsValue(pick(this.model, 'departId', 'province', 'city', 'town', 'applyStartDate', 'lowerLimit', 'upperLimit', 'canOverpay', 'unitPersionPro', 'unitMedicalPro', 'unitUnemploymentPro', 'unitInjuryPro', 'unitBirthPro', 'unitProSum', 'personalPersionPro', 'personalMedicalPro',
              'personalUnemploymentPro', 'personalProSum', 'isIllness'))
          })

          if (socialInfoData.canOverpay != 0) { // 是否可补缴社保（不可补缴）
            this.socialCanOverpay = false
          } else {
            let typeOfInsuranceCheckedList = [] // 险种选取

            if (socialInfoData.insurancePension == 0) { // 是否能补缴养老0是1否
              typeOfInsuranceCheckedList.push('insurancePension')
            }

            if (socialInfoData.insuranceMedical == 0) { // 是否能补缴医疗0是1否
              typeOfInsuranceCheckedList.push('insuranceMedical')
            }

            if (socialInfoData.insuranceUnemployment == 0) { // 是否能补缴失业0是1否
              typeOfInsuranceCheckedList.push('insuranceUnemployment')
            }

            if (socialInfoData.insuranceInjury == 0) { // 是否能补缴工伤0是1否
              typeOfInsuranceCheckedList.push('insuranceInjury')
            }

            if (socialInfoData.insuranceBirth == 0) { // 是否能补缴生育0是1否
              typeOfInsuranceCheckedList.push('insuranceBirth')
            }

            if (socialInfoData.insuranceBigailment == 0) { // 是否能补缴大病0是1否
              typeOfInsuranceCheckedList.push('insuranceBigailment')
            }

            this.model.typeOfInsurance = typeOfInsuranceCheckedList
            this.model.typeOfInsurance = typeOfInsuranceCheckedList

            // 月份转字符串
            this.model.overpayNumber += ''
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'overpayNumber', 'haveThisMonth', 'insuranceIsLatestCardinality',
                'typeOfInsurance', 'payPolicy'))
            })
          }

          if (socialInfoData.isIllness != 0) { // 是否有大病（没有）
            this.socialIsIllness = false
          } else {  // 有大病
            if (socialInfoData.isChargePersonal != 0) { // 新员工入职收费（不收费）
              //this.isChargePersonalStatus = false
            }

            if (socialInfoData.collectType != 0) {  // 大病缴纳周期（月）
              this.socialCollectType = false
              this.selectedChargePersonal = true
              this.model.isChargePersonal='0'
              if (socialInfoData.valueType != 0) {  // 缴纳方式（比例）
                this.socialValueType = false

                if (this.isChargePersonalStatus) {  // 新员工入职收费（收费）
                  this.$nextTick(() => {
                    this.socialForm.setFieldsValue(pick(this.model, 'payPersonalPro'))
                  })
                }

                this.$nextTick(() => {
                  this.socialForm.setFieldsValue(pick(this.model, 'payCompanyPro'))
                })
              } else {  // 缴纳方式（定值）
                if (this.isChargePersonalStatus) {  // 新员工入职收费（收费）
                  this.$nextTick(() => {
                    this.socialForm.setFieldsValue(pick(this.model, 'payPersonal'))
                  })
                }

                this.$nextTick(() => {
                  this.socialForm.setFieldsValue(pick(this.model, 'payCompany'))
                })
              }

              this.$nextTick(() => {
                this.socialForm.setFieldsValue(pick(this.model, 'valueType'))
              })
            } else {  // 大病缴纳周期（年）
              this.model.collectMoth += ''
              this.selectedChargePersonal = false // 双重控制新员工是否收费进行展示
              if (this.isChargePersonalStatus) {  // 新员工入职收费（收费）
                this.$nextTick(() => {
                  this.socialForm.setFieldsValue(pick(this.model, 'payPersonal'))
                })
              }

              this.$nextTick(() => {
                this.socialForm.setFieldsValue(pick(this.model, 'collectMoth', 'payCompany'))
              })
            }

            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'isChargePersonal', 'collectType'))
            })
          }
              
          // 社保地址
          for (const p of this.AreaTrees) {
            if (String(p.id) === String(this.model.province)) {
              this.socialAreaCitys = p.children
              for (const c of this.socialAreaCitys) {
                if (String(c.id) === String(this.model.city)) {
                  this.socialAreaTowns = c.children
                  break
                }
              }
            break
            }
          }
        }
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证（社保表单）
        this.socialForm.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            let formData = Object.assign(this.model, values)
            if (this.socialCanOverpay) {  // 社保是否可补缴
              formData.insurancePension = formData.typeOfInsurance.indexOf("insurancePension") != -1 ? 0 : 1  // 补缴险种（养老）
              formData.insuranceMedical = formData.typeOfInsurance.indexOf("insuranceMedical") != -1 ? 0 : 1  // 补缴险种（医疗）
              formData.insuranceUnemployment = formData.typeOfInsurance.indexOf("insuranceUnemployment") != -1 ? 0 : 1  // 补缴险种（失业）
              formData.insuranceInjury = formData.typeOfInsurance.indexOf("insuranceInjury") != -1 ? 0 : 1  // 补缴险种（工伤）
              formData.insuranceBirth = formData.typeOfInsurance.indexOf("insuranceBirth") != -1 ? 0 : 1  // 补缴险种（生育）
              formData.insuranceBigailment = formData.typeOfInsurance.indexOf("insuranceBigailment") != -1 ? 0 : 1  // 补缴险种（大病）
            }

            let applyStartDate = formData.applyStartDate[0]
            let applyEndDate = formData.applyStartDate[1]

            // 适用周期开始时间
            formData.applyStartDate = applyStartDate ? (applyStartDate.format(this.dateFormat) + '-01 00:00:00') : null
            // 适用周期结束时间
            formData.applyEndDate = applyEndDate ? moment(applyEndDate).endOf('month').format('YYYY-MM-DD HH:mm:ss') : null

            if (this.model.id) { // 编辑
              httpurl += this.url.edit
              method += 'put'
            } else {  // 添加
              httpurl += this.url.add
              method += 'post'
            }
            // 去除显示中的补缴险种
            delete formData.typeOfInsurance
            formData.baseType = 0  // 社保
            formData.departName = this.departName ? this.departName : formData.departName // 社保户名称

            if (Array.isArray(formData.city)) {
              formData.city = null
            }
            
            if (Array.isArray(formData.town)) {
              formData.town = null
            }

            httpAction(httpurl, formData, method).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.message || res.msg)
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          }
        })
      },
      // 关闭按钮
      handleCancel() {
        this.close()
      },
      // 关闭功能数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.editButton = true // 保存按钮
        this.departName = '' // 户名称
        this.confirmLoading = false
        this.AreaTrees = [] // 所有地区
        this.addonAfterStr = '元/年' // 默认金额单位
        this.socialAreaCitys = []  // 社保城市
        this.socialAreaTowns = []  // 社保区县
        this.departDisabled = false  // 编辑的时候户不能修改
        this.socialCanOverpay = true // 社保是否可补缴
        this.socialIsIllness = true // 是否可大病
        this.socialCollectType = true  // 按年收取大病
        this.socialValueType = true  // 大病按定值不显示
        this.socialIsDisabled = false // 是否编辑
        this.socialHouseholdOptions = [] // 社保户
        this.isChargePersonalStatus = true // 新员工是否缴费
        this.inputLowerLimit = false // 下线可输入状态
        this.inputUpperLimit = true // 上线可输入状态
        this.selectedChargePersonal=false  //大病取默认值时，可选
      },
      // 社保金户
      handleDepartChange(value) {
        this.departName = value.name
      },
      // 社保缴纳地省份切换
      handleSocialProvinceChange(value) {
        this.socialAreaCitys = []
        this.socialAreaTowns = []

        for (var c of this.AreaTrees[value - 1].children) {
          this.socialAreaCitys.push(c)
        }

        this.model.city = this.socialAreaCitys[0].id

        for (var t of this.socialAreaCitys[0].children) {
          this.socialAreaTowns.push(t)
        }

        this.model.town = []
        this.socialForm.setFieldsValue(pick(this.model, 'city', 'town'))
      },
      // 社保缴纳地城市切换
      handleSocialCityChange(value) {
        this.socialAreaTowns = []

        for (var c of this.socialAreaCitys) {
          if (String(c.id) === String(value)) {
            if (c.children.length > 0) {
              for (var t of c.children) {
                this.socialAreaTowns.push(t)
              }
            }
          break
          }
        }

        if (this.socialAreaTowns.length > 0) {
          this.model.town = this.socialAreaTowns[0].id
          this.socialForm.setFieldsValue(pick(this.model, 'town'))
        } else {
          this.model.town = []
          this.socialForm.setFieldsValue(pick(this.model, 'town'))
        }
      },
      // 社保适用周期
      handlePanelChange(value) {
        this.model.applyStartDate = value
        this.socialForm.setFieldsValue(pick(this.model, 'applyStartDate'))
      },
      // 是否可以补缴
      handleCanOverpayChange(e) {
        if (e.target.value == 0) {
          this.socialCanOverpay = true
        } else if (e.target.value == 1) {
          this.socialCanOverpay = false
        }
      },
      // 是否有大病
      handleIsIllnessChange(e) {
        if (e.target.value == 0) {
          this.socialIsIllness = true
          this.socialCollectType = true
          this.addonAfterStr = '元/年'
          this.socialValueType = true
          this.isChargePersonalStatus = true
        } else if (e.target.value == 1) {
          this.socialIsIllness = false
        }
      },
      // 新员工入职收费
      handleIsChargePersonal(e) {
        console.log(e.target.value,999);
      },
      // 大病缴纳周期
      handleCollectTypeChange(e) {
        if (e.target.value == 0) {
          this.socialCollectType = true
          this.addonAfterStr = '元/年'
          this.socialValueType = true
          this.selectedChargePersonal=false
        } else if (e.target.value == 1) {
          this.socialCollectType = false
          this.addonAfterStr = '元/月'
          this.selectedChargePersonal=true
        }
         console.log(this.socialForm.getFieldValue('valueType'),888);
          this.socialForm.setFieldsValue({
            valueType:'0',
            isChargePersonal: '0'
          })
          console.log(this.socialForm.getFieldValue('valueType'),999);
      },
      // 缴纳方式
      handleValueTypeChange(e) {
        if (e.target.value == 0) {
          this.socialValueType = true
        } else if (e.target.value == 1) {
          this.socialValueType = false
        }
      },
      /******************************************* 验证规则 *******************************************/
      // 社保基数下限
      validateSocialLowerLimit(rule, value, callback) {
        if (!value) {
          this.inputUpperLimit = true // 上线可输入状态
          callback()
          return false
        }

        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          this.inputUpperLimit = true // 上线可输入状态
          callback('输入两位小数！')
          return false
        }

        // let upperLimit = this.socialForm.getFieldValue('upperLimit') * 1
        
        // if ((value * 1) > upperLimit && upperLimit >= 0) {
        //   this.inputUpperLimit = true // 上线可输入状态
        //   callback('小于等于上限！')
        //   return false
        // }

        this.inputUpperLimit = false // 上线可输入状态
        callback()
        return true
      },
      // 社保基数上限
      validateSocialUpperLimit(rule, value, callback) {
        if (!value) {
          this.inputLowerLimit = false // 下线可输入状态
          callback()
          return false
        }

        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          this.inputLowerLimit = true // 下线可输入状态
          callback('输入两位小数！')
          return false
        }

        let lowerLimit = this.socialForm.getFieldValue('lowerLimit') * 1
        
        if ((value * 1) < lowerLimit && lowerLimit >= 0) {
          this.inputLowerLimit = true // 下线可输入状态
          callback('大于等于下限！')
          return false
        }

        this.inputLowerLimit = true // 下线可输入状态
        callback()
        return true
      },
      // 验证社保'单位养老'比例
      validateSocialUnitPensionPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          this.model.unitProSum = this.formatFloat(value * 1 + this.socialForm.getFieldValue('unitMedicalPro') * 1 + this.socialForm.getFieldValue('unitUnemploymentPro') * 1 + this.socialForm.getFieldValue('unitInjuryPro') * 1 + this.socialForm.getFieldValue('unitBirthPro') * 1)
          this.socialForm.setFieldsValue(pick(this.model, 'unitProSum'))
        }
      },
      // 验证社保'单位医疗'比例
      validateSocialUnitMedicalPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          this.model.unitProSum = this.formatFloat(value * 1 + this.socialForm.getFieldValue('unitPersionPro') * 1 + this.socialForm.getFieldValue('unitUnemploymentPro') * 1 + this.socialForm.getFieldValue('unitInjuryPro') * 1 + this.socialForm.getFieldValue('unitBirthPro') * 1)
          this.socialForm.setFieldsValue(pick(this.model, 'unitProSum'))
        }
      },
      // 验证社保'单位失业'比例
      validateSocialUnitUnemploymentPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          this.model.unitProSum = this.formatFloat(value * 1 + this.socialForm.getFieldValue('unitPersionPro') * 1 + this.socialForm.getFieldValue('unitMedicalPro') * 1 + this.socialForm.getFieldValue('unitInjuryPro') * 1 + this.socialForm.getFieldValue('unitBirthPro') * 1)
          this.socialForm.setFieldsValue(pick(this.model, 'unitProSum'))
        }
      },
      // 验证社保'单位工伤'比例
      validateSocialWorkUnjuryPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          this.model.unitProSum = this.formatFloat(value * 1 + this.socialForm.getFieldValue('unitPersionPro') * 1 + this.socialForm.getFieldValue('unitMedicalPro') * 1 + this.socialForm.getFieldValue('unitUnemploymentPro') * 1 + this.socialForm.getFieldValue('unitBirthPro') * 1)
          this.socialForm.setFieldsValue(pick(this.model, 'unitProSum'))
        }
      },
      // 验证社保'单位生育'比例
      validateSocialUnitBirthPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          this.model.unitProSum = this.formatFloat(value * 1 + this.socialForm.getFieldValue('unitPersionPro') * 1 + this.socialForm.getFieldValue('unitMedicalPro') * 1 + this.socialForm.getFieldValue('unitUnemploymentPro') * 1 + this.socialForm.getFieldValue('unitInjuryPro') * 1)
          this.socialForm.setFieldsValue(pick(this.model, 'unitProSum'))
        }
      },
      // 验证社保'单位比例合计'
      validateSocialUnitProSum(rule, value, callback) {
        this.validateSocialPro(rule, value, callback)
      },
      // 验证社保'个人养老'比例
      validateSocialPersonalPensionPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          this.model.personalProSum = this.formatFloat(value * 1 + this.socialForm.getFieldValue('personalMedicalPro') * 1 + this.socialForm.getFieldValue('personalUnemploymentPro') * 1)
          this.socialForm.setFieldsValue(pick(this.model, 'personalProSum'))
        }
      },
      // 验证社保'个人医疗'比例
      validateSocialPersonalMedicalPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          this.model.personalProSum = this.formatFloat(value * 1 + this.socialForm.getFieldValue('personalPersionPro') * 1 + this.socialForm.getFieldValue('personalUnemploymentPro') * 1)
          this.socialForm.setFieldsValue(pick(this.model, 'personalProSum'))
        }
      },
      // 验证社保'个人失业'比例
      validateSocialPersonalUnemploymentPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          this.model.personalProSum = this.formatFloat(value * 1 + this.socialForm.getFieldValue('personalPersionPro') * 1 + this.socialForm.getFieldValue('personalMedicalPro') * 1)
          this.socialForm.setFieldsValue(pick(this.model, 'personalProSum'))
        }
      },
      // 验证社保'个人比例合计'
      validateSocialPersonalProSum(rule, value, callback) {
        this.validateSocialPro(rule, value, callback)
      },
      // 验证社保比例（统一验证）
      validateSocialPro(rule, value, callback) {
        if (!value) {
            callback()
            return false
        }

        if (!new RegExp(/^(\d|[1-9]\d|99)(\.\d{1,2})?$/).test(value)) { // (0-99)验证百分比
          callback('0~100内两位小数！')
          return false
        }
        
        callback()
        return true
      },
      // 验证社保'单位大病'比例
      validateSocialPayCompanyPro(rule, value, callback) {
        this.validateSocialPro(rule, value, callback)
      },
      // 验证社保'个人大病'比例
      validateSocialPayPersonalPro(rule, value, callback) {
        this.validateSocialPro(rule, value, callback)
      },
      // 验证社保'单位大病金额'
      validateSocialPayCompany(rule, value, callback) {
        this.validateSocialMoney(rule, value, callback)
      },
      // 验证社保'个人大病金额'
      validateSocialPayPersonal(rule, value, callback) {
        this.validateSocialMoney(rule, value, callback)
      },
      // 验证社保金额（统一验证）
      validateSocialMoney(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          callback('输入两位小数！')
          return false
        }
        callback()
        return true
      },
      // 精度处理
      formatFloat(f, digit = 2) {
        const m = Math.pow(10, digit)
        return Math.round(f * m) / m
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 136px;
  }
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
.ant-disabled-form {
  :global(.ant-input-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-select-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-checkbox-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-radio-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
</style>
