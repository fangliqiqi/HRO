<template>
  <a-modal
    :title="title"
    :width="1200"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        v-if="isEdit"
        type="primary"
        @click="handleEdit"
        :loading="confirmLoading"
      >保存</a-button>
      <a-button
        v-if="isVerify"
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >审核</a-button>
    </template>

    <a-tabs
      :activeKey="activeKey"
      @change="tabsChange"
    >
      <a-tab-pane
        :forceRender="true"
        tab="员工资料"
        key="1"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="employeeForm"
            layout="inline"
            class="ant-advanced-search-form ant-form-detail"
          >
            <a-divider orientation="left" >基础信息</a-divider>
            <a-row>
              <a-col :span="24">
                <a-form-item style="font-size: 16px; font-weight:bold; margin-left: 30px; margin-bottom: 0px;">
                  {{ model.empName }}
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="员工编码"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.empNo ? model.empNo : '-'"
                  >
                    {{ model.empNo ? model.empNo : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="身份证号"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.empIdcard ? model.empIdcard : '-'"
                  >
                    {{ model.empIdcard ? model.empIdcard : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="身份证有效期"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.empIdcardValidity ? model.empIdcardValidity : '-'"
                  >
                    {{ model.empIdcardValidity ? model.empIdcardValidity : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="性别"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="(empSex = filterDictText(sexOptions, model.empSex)) ? empSex : '-'"
                  >
                    {{ (empSex = filterDictText(sexOptions, model.empSex)) ? empSex : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="年龄"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.empAge ? model.empAge : '-'"
                  >
                    {{ model.empAge ? model.empAge : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="出生日期"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.empBirthday ? (model.empBirthday).substring(0, 10) : '-'"
                  >
                    {{ model.empBirthday ? (model.empBirthday).substring(0, 10) : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="婚姻状况"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="(empMarriStatu = filterDictText(empMarriOptions, model.empMarriStatu)) ? empMarriStatu : '-'"
                  >
                    {{ empMarriStatu ? empMarriStatu : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="民族"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="(empNational = filterDictText(empNationalOptions, model.empNational)) ? empNational : '-'"
                  >
                    {{ empNational ? empNational : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="政治面貌"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="(politicalStatus = filterDictText(politicalOptions, model.politicalStatus)) ? politicalStatus : '-'"
                  >
                    {{ politicalStatus ? politicalStatus : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="E-Mail"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.empEmail ? model.empEmail : '-'"
                  >
                    {{ model.empEmail ? model.empEmail : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="QQ"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.empQq ? model.empQq : '-'"
                  >
                    {{ model.empQq ? model.empQq : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="联系方式"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.empPhone ? model.empPhone : '-'"
                  >
                    {{ model.empPhone ? model.empPhone : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="员工类型"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.empType ? model.empType : '-'"
                  >
                    {{ model.empType ? model.empType : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="所属单位"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.belongUnit ? model.belongUnit : '-'"
                  >
                    {{ model.belongUnit ? model.belongUnit : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="结算主体"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.settleDomain ? model.settleDomain : '-'"
                  >
                    {{ model.settleDomain ? model.settleDomain : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="就职班组"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.inauguralTeam ? model.inauguralTeam : '-'"
                  >
                    {{ model.inauguralTeam ? model.inauguralTeam : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="就职岗位"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.post ? model.post : '-'"
                  >
                    {{ model.post ? model.post : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="电信编号"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.telecomNumber ? model.telecomNumber : '-'"
                  >
                    {{ model.telecomNumber ? model.telecomNumber : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="户口性质"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="(empRegisType = filterDictText(empRegisTypeOptions, model.empRegisType)) ? empRegisType : '-'"
                  >
                    {{ empRegisType ? empRegisType : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="开户行"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.empBankName ? model.empBankName : '-'"
                  >
                    {{ model.empBankName ? model.empBankName : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="银行卡号"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.empBankNo ? model.empBankNo : '-'"
                  >
                    {{ model.empBankNo ? model.empBankNo : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="员工标签"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="(empLabel = filterDictText(employeeLableOptions, model.empLabel)) ? empLabel : '-'"
                  >
                    {{ empLabel ? empLabel : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="入职日期"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.enjoinDate ? model.enjoinDate : '-'"
                  >
                    {{ model.enjoinDate ? model.enjoinDate : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="试用期"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.tryPeriod ? model.tryPeriod + '个月' : '-'"
                  >
                    {{ model.tryPeriod ? model.tryPeriod + '个月' : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="计税月份"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.taxationMonth ? model.taxationMonth : '-'"
                  >
                    {{ model.taxationMonth ? model.taxationMonth : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="档案地市"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="(fileName = (getAreaName(model.fileProvince, model.fileCity, model.fileTown)) + (model.fileAddr ? model.fileAddr : '')) ? fileName : '-'"
                  >
                    {{ fileName ? fileName : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="身份证地市"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="(idName = (getAreaName(model.idProvince, model.idCity, model.idTown)) + (model.idcardAddr ? model.idcardAddr : '')) ? idName : '-'"
                  >
                    {{ idName ? idName : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="社保地市"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="(socialName = getAreaName(model.socialProvince, model.socialCity, model.socialTown)) ? socialName : '-'"
                  >
                    {{ socialName ? socialName : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="公积金地市"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="(fundName = getAreaName(model.fundProvince, model.fundCity, model.fundTown)) ? fundName : '-'"
                  >
                    {{ fundName ? fundName : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="备注"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.remark ? model.remark : '-'"
                  >
                    {{ model.remark ? model.remark : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="学历"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="education"
                  >
                    {{ education }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="委托备注"
                  class="employeeStepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="recordInfo.trustRemark ? recordInfo.trustRemark : '-'"
                  >
                    {{ recordInfo.trustRemark ? recordInfo.trustRemark : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-divider orientation="left">最新合同信息1</a-divider>
            <a-row>
              <a-descriptions bordered>
                <a-descriptions-item label="工时制">
                  {{ (employeeContractInfo && employeeContractInfo.workingHours != null) ? filterDictText(workingHoursOptions,employeeContractInfo.workingHours) : '-' }}
                </a-descriptions-item>
                <a-descriptions-item label="合同起止时间">
                  {{ recordInfo.contractStart }} ~ {{ recordInfo.contractEnd }}
                </a-descriptions-item>
                <a-descriptions-item label="合同期限">
                  {{ recordInfo.contractTerm || '-' }}
                </a-descriptions-item>
                <a-descriptions-item label="合同类型">
                  {{ filterDictText(employeeContractTypeOptions, recordInfo.contractType) }}
                </a-descriptions-item>
              </a-descriptions>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        :forceRender="true"
        v-if="socialInfoShow"
        tab="社保"
        key="2"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="socialForm"
            layout="inline"
            class="ant-advanced-search-form ant-disabled-form"
          >
            <!-- 整个表单内容 -->
            <a-row :gutter="24">
              <!-- 左边内容 -->
              <a-col :span="11">
                <a-row>
                  <a-col :span="24">
                    <a-form-item
                      label="选择社保户"
                      class="stepFormText"
                    >
                      <a-select
                        :disabled="true"
                        placeholder="请选择社保户"
                        v-decorator="['socialHousehold', {}]"
                        style="width: 332px"
                      >
                        <a-select-option
                          v-for="(value, key) in socialHouseholdOptions"
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
                      <a-select
                        :disabled="!isEdit"
                        placeholder="选择省份"
                        style="width: 100px"
                        @change="handleSocialProvinceChange"
                        v-decorator="['socialProvince', {rules: [{ required: true, message: '选择省份！' }]}]"
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
                        :disabled="!isEdit"
                        placeholder="选择城市"
                        style="width: 100px"
                        @change="handleSocialCityChange"
                        v-decorator="['socialCity', {rules: [{ required: true, message: '选择城市！' }]}]"
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
                        :allowClear="true"
                        :disabled="!isEdit"
                        placeholder="选择区县"
                        style="width: 100px"
                        v-decorator="['socialTown', {}]"
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
                      label="社保起缴日期"
                      class="stepFormText"
                    >
                      <a-month-picker
                        :disabled="!isEdit"
                        :format="dateFormat"
                        :allowClear="false"
                        placeholder="请选择社保起缴日期"
                        v-decorator="['socialStartDate', {rules: [{ required: true, message: '请选择社保起缴日期！' }]}]"
                        style="width: 332px"
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
                        v-decorator="['lowerLimit', {}]"
                        style="width: 110px"
                      />
                    </a-form-item>
                    <a-form-item label="社保基数上限">
                      <a-input
                        :disabled="true"
                        placeholder="基数上限"
                        v-decorator="['upperLimit', {}]"
                        style="width: 109px"
                      />
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
                        :disabled="true"
                        placeholder="补缴期限"
                        v-decorator="['socialOverpayNumber', {}]"
                        style="width: 110px"
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
                      style="margin-left: 13px"
                    >
                      <a-select
                        :disabled="true"
                        placeholder="是否含当月"
                        v-decorator="['socialHaveThisMonth', {}]"
                        style="width: 109px"
                      >
                        <a-select-option value="0">是</a-select-option>
                        <a-select-option value="1">否</a-select-option>
                      </a-select>
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
                      <a-select
                        :disabled="true"
                        placeholder="最新基数"
                        v-decorator="['insuranceIsLatestCardinalityOfSocial', {}]"
                        style="width: 110px"
                      >
                        <a-select-option value="0">是</a-select-option>
                        <a-select-option value="1">否</a-select-option>
                      </a-select>
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
                        :disabled="true"
                        v-decorator="['typeOfInsurance', {initialValue: []}]"
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
                        :disabled="true"
                        :rows="1"
                        placeholder="社保补缴政策"
                        v-decorator="['socialPayPolicy', {}]"
                        style="width: 332px"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col
                    :span="24"
                    v-if="socialIsIllness"
                  >
                    <a-form-item
                      label="新员工入职收费"
                      class="stepFormText"
                    >
                      <a-radio-group
                        :disabled="true"
                        class="fontiframe"
                        name="radioGroup"
                        v-decorator="['isChargePersonal', {}]"
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
                        v-decorator="['collectType', {}]"
                      >
                        <a-radio value="0">年</a-radio>
                        <a-radio value="1">月</a-radio>
                      </a-radio-group>
                    </a-form-item>
                  </a-col>

                  <a-col
                    :span="24"
                    v-if="socialIsIllness"
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
                    <a-form-item
                      v-if="collectMothShow"
                      label="缴纳月份"
                      style="margin-left: 27px"
                    >
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
                  <!-- 新增缴纳类型和备案基数 -->
                  <a-col :span="24">
                    <a-form-item
                      label="缴纳类型"
                      class="stepFormText"
                    >
                      <a-select
                        :disabled="true"

                        placeholder="请选择缴纳类型"
                        v-decorator="['paymentType', {rules:[{required:true,message:'请选择'}]}]"
                        style="width: 110px"
                      >
                        <a-select-option value="0">最低缴纳</a-select-option>
                        <a-select-option value="1">自定义缴纳</a-select-option>
                        <a-select-option value="2">最高缴纳</a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item
                      label="备案基数"
                    >
                      <a-input
                        :disabled="true"
                        v-decorator="['recordBase', {rules:[{required:true,message:'请输入缴纳基数'}]}]"
                        style="width: 137px"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item
                      label="委托备注"
                      class="stepFormText"
                    >
                      <a-input
                        :disabled="true"
                        v-decorator="['trustRemark', {}]"
                        style="width: 332px"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-col>
              <!-- 右边内容 -->
              <a-col :span="13">
                <a-row>
                  <a-col :span="24">
                    <a-form-item label="单位养老">
                      <a-input
                        :disabled="true"
                        placeholder="请填写基数"
                        v-decorator="['unitPensionCardinal', {}]"
                        style="width: 90px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写比例"
                        v-decorator="['unitPensionPer', {}]"
                        style="width: 90px"
                        addonAfter="%"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写金额"
                        v-decorator="['unitPersionMoney', {}]"
                        style="width: 90px"
                      />
                    </a-form-item>
                    <a-form-item v-if="showStartdate">
                      <a-month-picker :disabled="true" placeholder="请选择起缴日期" style="width: 140px" v-decorator="['pensionStart']"/>
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="单位医疗">
                      <a-input
                        :disabled="true"
                        placeholder="请填写基数"
                        v-decorator="['unitMedicalCardinal', {}]"
                        style="width: 90px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写比例"
                        v-decorator="['unitMedicalPer', {}]"
                        style="width: 90px"
                        addonAfter="%"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写金额"
                        v-decorator="['unitMedicalMoney', {}]"
                        style="width: 90px"
                      />
                    </a-form-item>
                    <a-form-item v-if="showStartdate">
                      <a-month-picker :disabled="true" placeholder="请选择起缴日期" style="width: 140px" v-decorator="['medicalStart']"/>
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="单位失业">
                      <a-input
                        :disabled="true"
                        placeholder="请填写基数"
                        v-decorator="['unitUnemploymentCardinal', {}]"
                        style="width: 90px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写比例"
                        v-decorator="['unitUnemploymentPer', {}]"
                        style="width: 90px"
                        addonAfter="%"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写金额"
                        v-decorator="['unitUnemploymentMoney', {}]"
                        style="width: 90px"
                      />
                    </a-form-item>
                    <a-form-item v-if="showStartdate">
                      <a-month-picker :disabled="true" placeholder="请选择起缴日期" style="width: 140px" v-decorator="['unemployStart']"/>
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="单位工伤">
                      <a-input
                        :disabled="true"
                        placeholder="请填写基数"
                        v-decorator="['unitWorkInjuryCardinal', {}]"
                        style="width: 90px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写比例"
                        v-decorator="['unitWorkUnjuryPer', {}]"
                        style="width: 90px"
                        addonAfter="%"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写金额"
                        v-decorator="['unitInjuryMoney', {}]"
                        style="width: 90px"
                      />
                    </a-form-item>
                    <a-form-item v-if="showStartdate">
                      <a-month-picker :disabled="true" placeholder="请选择起缴日期" style="width: 140px" v-decorator="['workInjuryStart']"/>
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="单位生育">
                      <a-input
                        :disabled="true"
                        placeholder="请填写基数"
                        v-decorator="['unitBirthCardinal', {}]"
                        style="width: 90px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写比例"
                        v-decorator="['unitBirthPer', {}]"
                        style="width: 90px"
                        addonAfter="%"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写金额"
                        v-decorator="['unitBirthMoney', {}]"
                        style="width: 90px"
                      />
                    </a-form-item>
                    <a-form-item v-if="showStartdate">
                      <a-month-picker :disabled="true" placeholder="请选择起缴日期" style="width: 140px" v-decorator="['birthStart']"/>
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <div v-if="socialIsIllness">
                      <a-form-item
                        label="单位大病"
                        style="margin-right: 0px"
                      ></a-form-item>
                      <a-form-item v-if="socialValueType">
                        <a-input
                          :disabled="true"
                          placeholder="请填写基数"
                          v-decorator="['unitBigailmentCardinal', {}]"
                          style="width: 90px"
                        />
                      </a-form-item>
                      <a-form-item v-if="socialValueType">
                        <a-input
                          :disabled="true"
                          placeholder="请填写比例"
                          v-decorator="['unitBigailmentPer', {}]"
                          style="width: 90px"
                          addonAfter="%"
                        />
                      </a-form-item>
                      <a-form-item>
                        <a-input
                          :disabled="true"
                          placeholder="请填写金额"
                          v-decorator="['unitBigailmentMoney', {}]"
                          style="width: 90px"
                        />
                      </a-form-item>
                      <a-form-item v-if="showStartdate">
                        <a-month-picker :disabled="true" placeholder="请选择起缴日期" style="width: 140px" v-decorator="['bigailmentStart']"/>
                      </a-form-item>
                    </div>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="个人养老">
                      <a-input
                        :disabled="true"
                        placeholder="请填写基数"
                        v-decorator="['personalPensionCardinal', {}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写比例"
                        v-decorator="['personalPensionPer', {}]"
                        style="width: 136px"
                        addonAfter="%"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写金额"
                        v-decorator="['personalPersionMoney', {}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="个人医疗">
                      <a-input
                        :disabled="true"
                        placeholder="请填写基数"
                        v-decorator="['personalMedicalCardinal', {}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写比例"
                        v-decorator="['personalMedicalPer', {}]"
                        style="width: 136px"
                        addonAfter="%"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写金额"
                        v-decorator="['personalMedicalMoney', {}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="个人失业">
                      <a-input
                        :disabled="true"
                        placeholder="请填写基数"
                        v-decorator="['personalUnemploymentCardinal', {}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写比例"
                        v-decorator="['personalUnemploymentPer', {}]"
                        style="width: 136px"
                        addonAfter="%"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写金额"
                        v-decorator="['personalUnemploymentMoney', {}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <div v-if="socialIsIllness && isChargePersonalStatus">
                      <a-form-item
                        label="个人大病"
                        style="margin-right: 0px"
                      ></a-form-item>
                      <a-form-item v-if="socialValueType">
                        <a-input
                          :disabled="true"
                          placeholder="请填写基数"
                          v-decorator="['personalBigailmentCardinal', {}]"
                          style="width: 136px"
                        />
                      </a-form-item>
                      <a-form-item v-if="socialValueType">
                        <a-input
                          :disabled="true"
                          placeholder="请填写比例"
                          v-decorator="['personalBigailmentPer', {}]"
                          style="width: 136px"
                          addonAfter="%"
                        />
                      </a-form-item>
                      <a-form-item>
                        <a-input
                          :disabled="true"
                          placeholder="请填写金额"
                          v-decorator="['personalBigailmentMoney', {}]"
                          style="width: 136px"
                        />
                      </a-form-item>
                    </div>
                    <a-form-item label="重新发起说明" v-if="showStartdate">
                      <a-textarea
                        placeholder="重新发起说明"
                        :disabled="true"
                        v-decorator="['repeatReason']"
                        style="width: 415px;resize:none;"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        :forceRender="true"
        v-if="fundInfoShow"
        tab="公积金"
        key="3"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="fundForm"
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
                      label="选择公积金户"
                      class="stepFormText"
                    >
                      <a-select
                        :disabled="true"
                        placeholder="请选择公积金户"
                        v-decorator="['fundHousehold', {}]"
                        style="width: 332px"
                      >
                        <a-select-option
                          v-for="(value, key) in fundHouseholdOptions"
                          :key="key"
                          :value="value.id"
                        >{{ value.name }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item
                      label="公积金缴纳地"
                      class="stepFormText"
                    >
                      <a-select
                        :disabled="!isEdit"
                        placeholder="选择省份"
                        style="width: 100px"
                        @change="handleFundProvinceChange"
                        v-decorator="['fundProvince', {rules: [{ required: true, message: '选择省份！' }]}]"
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
                        :disabled="!isEdit"
                        placeholder="选择城市"
                        style="width: 100px"
                        @change="handleFundCityChange"
                        v-decorator="['fundCity', {rules: [{ required: true, message: '选择城市！' }]}]"
                      >
                        <a-select-option
                          v-for="(item, index) in fundAreaCitys"
                          :key="index"
                          :value="item.id"
                        >{{ item.areaName }}</a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item>
                      <a-select
                        :allowClear="true"
                        :disabled="!isEdit"
                        placeholder="选择区县"
                        style="width: 100px"
                        v-decorator="['fundTown', {}]"
                      >
                        <a-select-option
                          v-for="(item, index) in fundAreaTowns"
                          :key="index"
                          :value="item.id"
                        >{{ item.areaName }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item
                      label="公积金起缴日期"
                      class="stepFormText"
                    >
                      <a-month-picker
                        :disabled="!isEdit"
                        :format="dateFormat"
                        :allowClear="false"
                        placeholder="请选择公积金起缴日期"
                        v-decorator="['fundStartDate', {rules: [{ required: true, message: '请选择公积金起缴日期！' }]}]"
                        style="width: 332px"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item
                      label="公积金基数下限"
                      class="stepFormText"
                    >
                      <a-input
                        :disabled="true"
                        placeholder="基数下限"
                        v-decorator="['fundPayLowerLimit', {}]"
                        style="width: 110px"
                      />
                    </a-form-item>
                    <a-form-item label="公积金基数上限">
                      <a-input
                        :disabled="true"
                        placeholder="基数上限"
                        v-decorator="['fundPayUpperLimit', {}]"
                        style="width: 95px"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item
                      label="公积金单边小数点"
                      class="stepFormText"
                    >
                      <a-select
                        :disabled="true"
                        placeholder="公积金单边小数点"
                        v-decorator="['fundPayPoint', {}]"
                        style="width: 332px"
                      >
                        <a-select-option
                          v-for="(item, index) in fundPayPointBelongs"
                          :key="index"
                          :value="item.value"
                        >{{ item.label }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item
                      label="委托备注"
                      class="stepFormText"
                    >
                      <a-input
                        :disabled="true"
                        v-decorator="['trustRemark', {}]"
                        style="width: 332px"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-col>
              <!-- 右边内容 -->
              <a-col :span="12">
                <a-row>
                  <a-col
                    :span="24"
                    v-if="fundCanOverpay"
                  >
                    <a-form-item
                      label="补缴采用最新基数"
                      class="stepFormText"
                    >
                      <a-select
                        :disabled="true"
                        placeholder="最新基数"
                        v-decorator="['insuranceIsLatestCardinalityOfFund', {}]"
                        style="width: 110px"
                      >
                        <a-select-option value="0">是</a-select-option>
                        <a-select-option value="1">否</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>

                  <a-col
                    :span="24"
                    v-if="fundCanOverpay"
                  >
                    <a-form-item
                      label="补缴期限"
                      class="stepFormText"
                    >
                      <a-select
                        :disabled="true"
                        placeholder="补缴期限"
                        v-decorator="['fundOverpayNumber', {}]"
                        style="width: 110px"
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
                      style="margin-left: 27px"
                    >
                      <a-select
                        :disabled="true"
                        placeholder="是或否"
                        v-decorator="['fundHaveThisMonth', {}]"
                        style="width: 95px"
                      >
                        <a-select-option value="0">是</a-select-option>
                        <a-select-option value="1">否</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>

                  <a-col
                    :span="24"
                    v-if="fundCanOverpay"
                  >
                    <a-form-item
                      label="公积金补缴政策"
                      style="margin-left: 14px"
                    >
                      <a-textarea
                        :disabled="true"
                        :rows="1"
                        placeholder="公积金补缴政策"
                        v-decorator="['fundPayPolicy', {}]"
                        style="width: 332px"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item
                      label="单位公积金"
                      style="margin-left: 41px"
                    >
                      <a-input
                        :disabled="true"
                        placeholder="请填写基数"
                        v-decorator="['unitProvidengCardinal', {}]"
                        style="width: 100px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-select
                        :disabled="true"
                        placeholder="选择比例"
                        v-decorator="['unitProvidentPer', {}]"
                        style="width: 100px"
                      >
                        <a-select-option
                          v-for="(value, key) in fundProvidentPer"
                          :key="key"
                          :value="value.companyPro"
                        >{{ value.companyPro }}%</a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写金额"
                        v-decorator="['unitProvidentFee', {}]"
                        style="width: 100px"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item
                      label="个人公积金"
                      style="margin-left: 41px"
                    >
                      <a-input
                        :disabled="true"
                        placeholder="请填写基数"
                        v-decorator="['personalProvidentCardinal', {}]"
                        style="width: 100px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-select
                        :disabled="true"
                        placeholder="选择比例"
                        v-decorator="['personalProvidentPer', {}]"
                        style="width: 100px"
                      >
                        <a-select-option
                          v-for="(value, key) in fundProvidentPer"
                          :key="key"
                          :value="value.personalPro"
                        >{{ value.personalPro }}%</a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="请填写金额"
                        v-decorator="['personalProvidentFee', {}]"
                        style="width: 100px"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        :forceRender="true"
        tab="流程进展明细"
        key="4"
      >
        <a-spin :spinning="confirmLoading">
          <div class="process">
            <a-row type="flex" class="marginBot">
              <a-col flex="120px" class="th">派单状态：</a-col>
              <a-col flex="auto">
                <template v-if="model.status != undefined">
                  {{ model.status.option }}
                </template>
              </a-col>
            </a-row>
            <template v-if="socialInfoShow">
              <a-row type="flex" class="marginBot">
                <a-col flex="120px" class="th">社保办理状态：</a-col>
                <a-col flex="auto">
                  <template v-if="model.socialHandleStatus != undefined">
                    {{ socialHandleStatusOption[model.socialHandleStatus] }}
                  </template>
                  <template v-if="showReDispatch">
                    <a-button type="primary" size="small" @click="handleFaild(model)" :disabled="disabledReDispatch">失败项重新派单</a-button>
                  </template>
                </a-col>
              </a-row>
              <div class="tags">
                <!-- <span v-for="(item,index) in insuranceType" :key="index">
                  {{ item.name }}
                  <template v-if="item.val == 1">
                    <a-icon type="check" class="check" />
                  </template>
                  <template v-if="item.val == 2">
                    <a-icon type="close" class="close"/>
                  </template>
                </span> -->
                <span v-for="(item,index) in insuranceType" :key="index">
                  <span
                    v-if="item.val == 1"
                    class="successTag"
                  >{{ item.name }}</span>
                  <span
                    v-else-if="item.val == 2"
                    class="errorTag"
                  >{{ item.name }}</span>
                  <span
                    v-else
                    class="disTag"
                  >{{ item.name }}</span>
                </span>
                  

              </div>
            </template>
            <a-row type="flex" class="marginBot" v-if="fundInfoShow">
              <a-col flex="120px" class="th">公积金办理状态：</a-col>
              <a-col flex="auto">{{ fundStatus[model.fundStatus] }}</a-col>
            </a-row>
            <a-divider style="margin: 10px 0px;"/>
            <a-row type="flex">
              <a-col flex="80px" class="th">进展明细</a-col>
              <a-col flex="auto">
                <span class="toggle" @click="toggleHistory" v-if="historyList.length>2">
                  {{ textBtn }}<a-icon type="caret-down" v-if="textBtn == '展开'"/><a-icon type="caret-up" v-if="textBtn == '收起'"/>
                </span>
              </a-col>
            </a-row>
            <a-timeline class="timeline" v-if="auditList.length > 0">
              <template v-for="(list, key) in auditList">
                <a-timeline-item
                  :key="key"
                  :color="auditStatusOptions[list.auditStatus].color"
                >
                  <p>{{ list.auditRemark ? list.auditRemark : '' }}</p>
                  <p>{{ list.auditUser ? list.auditUser : '' }}</p>
                  <p>{{ list.auditTime ? list.auditTime : '' }}</p>
                </a-timeline-item>
              </template>
            </a-timeline>
            <a-empty v-else description="暂无进展明细"/>
          </div>
          <!-- <a-form
            :form="auditForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col :span="24">
                <template v-if="auditList.length > 0">
                  <a-timeline style="margin-left: 50px">
                    <template v-for="(list, key) in auditList">
                      <a-timeline-item
                        :key="key"
                        :color="auditStatusOptions[list.auditStatus].color"
                      >
                        <p>{{ list.auditRemark ? list.auditRemark : '' }}</p>
                        <p>{{ list.auditUser ? list.auditUser : '' }}</p>
                        <p>{{ list.auditTime ? list.auditTime : '' }}</p>
                      </a-timeline-item>
                    </template>
                  </a-timeline>
                </template>
                <template v-else>
                  <section class="code-box-demo">
                    <div class="ant-empty">
                      <div class="ant-empty-image">
                        <img
                          alt="暂无数据"
                          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE1MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQgMzEuNjcpIj4KICAgICAgPGVsbGlwc2UgZmlsbC1vcGFjaXR5PSIuOCIgZmlsbD0iI0Y1RjVGNyIgY3g9IjY3Ljc5NyIgY3k9IjEwNi44OSIgcng9IjY3Ljc5NyIgcnk9IjEyLjY2OCIvPgogICAgICA8cGF0aCBkPSJNMTIyLjAzNCA2OS42NzRMOTguMTA5IDQwLjIyOWMtMS4xNDgtMS4zODYtMi44MjYtMi4yMjUtNC41OTMtMi4yMjVoLTUxLjQ0Yy0xLjc2NiAwLTMuNDQ0LjgzOS00LjU5MiAyLjIyNUwxMy41NiA2OS42NzR2MTUuMzgzaDEwOC40NzVWNjkuNjc0eiIgZmlsbD0iI0FFQjhDMiIvPgogICAgICA8cGF0aCBkPSJNMTAxLjUzNyA4Ni4yMTRMODAuNjMgNjEuMTAyYy0xLjAwMS0xLjIwNy0yLjUwNy0xLjg2Ny00LjA0OC0xLjg2N0gzMS43MjRjLTEuNTQgMC0zLjA0Ny42Ni00LjA0OCAxLjg2N0w2Ljc2OSA4Ni4yMTR2MTMuNzkyaDk0Ljc2OFY4Ni4yMTR6IiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMy41NikiLz4KICAgICAgPHBhdGggZD0iTTMzLjgzIDBoNjcuOTMzYTQgNCAwIDAgMSA0IDR2OTMuMzQ0YTQgNCAwIDAgMS00IDRIMzMuODNhNCA0IDAgMCAxLTQtNFY0YTQgNCAwIDAgMSA0LTR6IiBmaWxsPSIjRjVGNUY3Ii8+CiAgICAgIDxwYXRoIGQ9Ik00Mi42NzggOS45NTNoNTAuMjM3YTIgMiAwIDAgMSAyIDJWMzYuOTFhMiAyIDAgMCAxLTIgMkg0Mi42NzhhMiAyIDAgMCAxLTItMlYxMS45NTNhMiAyIDAgMCAxIDItMnpNNDIuOTQgNDkuNzY3aDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI0SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjR6TTQyLjk0IDYxLjUzaDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI1SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjV6TTEyMS44MTMgMTA1LjAzMmMtLjc3NSAzLjA3MS0zLjQ5NyA1LjM2LTYuNzM1IDUuMzZIMjAuNTE1Yy0zLjIzOCAwLTUuOTYtMi4yOS02LjczNC01LjM2YTcuMzA5IDcuMzA5IDAgMCAxLS4yMjItMS43OVY2OS42NzVoMjYuMzE4YzIuOTA3IDAgNS4yNSAyLjQ0OCA1LjI1IDUuNDJ2LjA0YzAgMi45NzEgMi4zNyA1LjM3IDUuMjc3IDUuMzdoMzQuNzg1YzIuOTA3IDAgNS4yNzctMi40MjEgNS4yNzctNS4zOTNWNzUuMWMwLTIuOTcyIDIuMzQzLTUuNDI2IDUuMjUtNS40MjZoMjYuMzE4djMzLjU2OWMwIC42MTctLjA3NyAxLjIxNi0uMjIxIDEuNzg5eiIgZmlsbD0iI0RDRTBFNiIvPgogICAgPC9nPgogICAgPHBhdGggZD0iTTE0OS4xMjEgMzMuMjkybC02LjgzIDIuNjVhMSAxIDAgMCAxLTEuMzE3LTEuMjNsMS45MzctNi4yMDdjLTIuNTg5LTIuOTQ0LTQuMTA5LTYuNTM0LTQuMTA5LTEwLjQwOEMxMzguODAyIDguMTAyIDE0OC45MiAwIDE2MS40MDIgMCAxNzMuODgxIDAgMTg0IDguMTAyIDE4NCAxOC4wOTdjMCA5Ljk5NS0xMC4xMTggMTguMDk3LTIyLjU5OSAxOC4wOTctNC41MjggMC04Ljc0NC0xLjA2Ni0xMi4yOC0yLjkwMnoiIGZpbGw9IiNEQ0UwRTYiLz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0OS42NSAxNS4zODMpIiBmaWxsPSIjRkZGIj4KICAgICAgPGVsbGlwc2UgY3g9IjIwLjY1NCIgY3k9IjMuMTY3IiByeD0iMi44NDkiIHJ5PSIyLjgxNSIvPgogICAgICA8cGF0aCBkPSJNNS42OTggNS42M0gwTDIuODk4LjcwNHpNOS4yNTkuNzA0aDQuOTg1VjUuNjNIOS4yNTl6Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                        >
                      </div>
                      <p class="ant-empty-description">暂无流程数据</p>
                    </div>
                  </section>
                </template>
              </a-col>
            </a-row>
          </a-form> -->

        </a-spin>
      </a-tab-pane>
    </a-tabs>
    <dispatch-verification-modal
      ref="dispatchVerificationModal"
      @ok="dispatchVerificationModalFormOk"
    ></dispatch-verification-modal>
    <re-dispatch-apply-modal
      ref="ReDispatchApplyForm"
      :houseHolds="houseHolds"
      @ok="reflash"
      :flag="{socialCanOverpay:socialCanOverpay,socialIsIllness:socialIsIllness,socialValueType:socialValueType,isChargePersonalStatus:isChargePersonalStatus}"
    >
    </re-dispatch-apply-modal>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import { getAreaName } from '@/utils/common'
  import DispatchVerificationModal from './DispatchVerificationModal'
  import ReDispatchApplyModal from './ReDispatchApplyModal'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'DispatchAddApplicationDetailModal',
    components: {
      DispatchVerificationModal,
      ReDispatchApplyModal
    },
    props:{
      socialHandleStatusOption:{
        type: Object,
        default: ()=>{},
        required: false
      },
    },
    data() {
      return {
        moment,
        model: {},
        title: '操作',
        isEdit: false,  // 修改
        visible: false,
        isVerify: false, // 是否显示审核按钮
        activeKey: '1', // 默认第一个tab
        confirmLoading: false,
        fundForm: this.$form.createForm(this),
        auditForm: this.$form.createForm(this),
        socialForm: this.$form.createForm(this),
        employeeForm: this.$form.createForm(this),
        socialInfoShow: true, // 社保数据是否显示
        fundInfoShow: true, // 公积金数据是否显示
        dateFormat: 'YYYY-MM',  // 时间格式化类型
        getAreaName,
        filterDictText,
        houseHolds: [], // 社保户、公积金户
        AreaTrees: [], // 所有地区
        recordInfo: {}, // 派单信息
        auditList: [],  // 审核流程数据
        fundAreaCitys: [],  // 公积金城市
        fundAreaTowns: [],  // 公积金区县
        socialAreaCitys: [],  // 社保城市
        socialAreaTowns: [],  // 社保区县
        empTypeBelongs: [], // 员工类型
        fundCanOverpay: true, // 公积金是否可补缴
        socialCanOverpay: true, // 社保是否可补缴
        socialIsIllness: true, // 是否可大病
        collectMothShow: true,  // 缴纳月份是否显示
        socialValueType: true,  // 大病按定值不显示
        nextUserIdBelongs: [], // 下一步操作人
        settleDomainBelongs: [],  // 结算主体和部门
        isChargePersonalStatus: true, // 新员工是否缴费
        fundHouseholdOptions: [], //公积金户
        socialHouseholdOptions: [], // 社保户
        sysBaseSetByEntityOfFund: [], // 公积金户选择数据
        sysBaseSetByEntityOfSocial: [], // 社保户选择数据
        fundProvidentPer: [], // 公积金比例
        fundPayPointBelongs: [], // 公积金单边小数点
        sexOptions: [],	// 性别
        empMarriOptions: [], // 婚姻状况
        empNationalOptions: [], // 民族
        politicalOptions: [], // 政治面貌
        empTypeOptions: [], // 员工类型
        empRegisTypeOptions: [], // 户口性质
        employeeLableOptions: [], // 员工标签
        employeeContractTypeOptions: [], // 员工合同类型
        situationTypeOptions: [], // 签订情况
        workingHoursOptions: [], // 工时制
        educationOptions: [], // 学历
        education:'',
        overpayNumberOptions: {'1': '一个月', '2': '两个月', '3': '三个月', '4': '四个月', '5': '五个月', '6': '六个月', '7': '七个月', '8': '八个月', '9': '九个月', '10': '十个月', '11': '十一个月', '12': '十二个月'}, // 补缴期限
        collectMothOptions: {'1': '一月', '2': '二月', '3': '三月', '4': '四月', '5': '五月', '6': '六月', '7': '七月', '8': '八月', '9': '九月', '10': '十月', '11': '十一月', '12': '十二月'}, // 缴纳月份
        typeOfInsuranceOptions: {'insurancePension': '养老', 'insuranceMedical': '医疗', 'insuranceUnemployment': '失业', 'insuranceInjury': '工伤', 'insuranceBirth': '生育', 'insuranceBigailment': '大病'},  // 险种
        auditStatusOptions: {
          '0': {'option': '提交/申请', 'color': 'blue'},
          '1': {'option': '重新申请', 'color': 'pink'},
          '2': {'option': '审核成功', 'color': 'green'},
          '3': {'option': '审核失败', 'color': 'red'},
          '4': {'option': '委派', 'color': 'cyan'},
          '5': {'option': '办理失败', 'color': 'red'},
          '6': {'option': '办理成功', 'color': 'green'},
        },
        fundStatus:{'0':'待办理','1':'已办理','2':'办理失败'},
        url: {
          edit: 'hrSocial/tdispatchinfo/editForAdmin',
          sysBaseSetByEntityUrl: 'hrSocial/sysbasesetinfo/getSysBaseSetByEntity',
          process:''
        },
        employeeContractInfo:{},
        insuranceType:{ // 各险种状态
          pensionHandle:{name:'养老',val:null},
          medicalHandle:{name:'医疗',val:null},
          unemployHandle:{name:'失业',val:null},
          workInjuryHandle:{name:'工伤',val:null},
          birthHandle:{name:'生育',val:null},
          bigailmentHandle:{name:'大病',val:null},
        },
        showReDispatch:false,
        showStartdate: true,
        disabledReDispatch: true,
        textBtn:'展开',
        historyList:[],
      }
    },
    created() {
      this.initDictConfig() // 字典数据
    },
    methods: {
      toggleHistory(){
        if(this.textBtn == '展开'){
          this.auditList = this.historyList
          this.textBtn = '收起'
        }else{
          this.auditList = this.historyList.slice(0,2)
          this.textBtn = '展开'
        }
      },
      handleFaild(record){
        this.$refs.ReDispatchApplyForm.show(record,this.sysBaseSetByEntityOfSocial)
      },
      reflash(data,status){
        delete data.id
        const time = ['bigailmentStart','birthStart','workInjuryStart','unemployStart','pensionStart','medicalStart']
        let obj = {}
        for(let key in data){
          obj[key] = (time.indexOf(key)>-1) ? moment(data[key]) : data[key]
        }
        this.showStartdate = true
        this.disabledReDispatch = true
        this.model.socialHandleStatus = status.socialHandleStatus
        this.model.status = {val:status.status,option:'待审核'}
        this.getProcess()
        this.$nextTick(() => {
          this.socialForm.setFieldsValue(obj)
          this.$emit('ok')
        })
      },
      getProcess(){
        let type = (this.recordInfo.typeSub != 2) ? (this.recordInfo.typeSub*1 + 1) : (this.recordInfo.typeSub*1 + 3)
        httpAction(this.url.process + '?id=' + this.recordInfo.id + '&type=' + type, '', 'GET').then((res) => {
          if (Number(res.code) === 200 && res.data) {
            this.historyList = res.data
            this.auditList = (res.data.length > 2) ? res.data.slice(0,2) : res.data
          } else {
            this.$message.error('流程进展数据不完整！')
          }
        })
      },
      edit(record, auditProcessUrl = '',status,show) {
        this.url.process = auditProcessUrl
        this.fundForm.resetFields()
        this.auditForm.resetFields()
        this.socialForm.resetFields()
        this.employeeForm.resetFields()
        this.model = Object.assign({status:status,repeatReason:record.dispatchInfo.repeatReason}, record.employeeInfo)
        this.showStartdate = record.dispatchInfo.repeatReason ? true : false
        this.disabledReDispatch = this.model.status.val === '1' && record.dispatchInfo.socialHandleStatus == 5
        this.showReDispatch = show && record.dispatchInfo.socialHandleStatus == 5

        this.socialHouseholdOptions = this.fundHouseholdOptions = this.houseHolds
        this.visible = true
        // 流程进展明细
        if (auditProcessUrl) {
          this.getProcess()
        }
        /************************************************* 员工数据 *************************************************/
        // 员工类型
        this.model.empType = filterDictText(this.empTypeBelongs, this.model.empType)
        // 结算主体
        let settleDomainTemp = this.model.settleDomain // 用于取所属单位
        this.model.settleDomain = this.model.belongUnit = '-'

        if (Object.keys(this.settleDomainBelongs).length) {
          this.model.settleDomain = (this.settleDomainBelongs).hasOwnProperty(settleDomainTemp) ? this.settleDomainBelongs[settleDomainTemp]['departName'] : '-'
          this.model.belongUnit = (this.settleDomainBelongs).hasOwnProperty(settleDomainTemp) ? this.settleDomainBelongs[settleDomainTemp]['customerName'] : '-'
        }
        /************************************************* 社保数据 *************************************************/
        let socialInfoData = record.socialInfo

        if (!socialInfoData) {  // 无社保
          this.socialInfoShow = false
        } else {
          this.model.socialHousehold = socialInfoData.socialHousehold // 社保户
          this.model.socialProvince = socialInfoData.socialProvince  // 社保地-省
          this.model.socialCity = socialInfoData.socialCity  // 社保地-市
          this.model.socialTown = socialInfoData.socialTown    // 社保地-区
          this.model.socialStartDate = moment(socialInfoData.socialStartDate, this.dateFormat) // 社保起缴日期
          this.model.socialType = socialInfoData.socialType // 0正常派单 1兼职工伤，工伤的基数
          // 各种险种期交日期
          this.model.pensionStart = socialInfoData.pensionStart ? moment(socialInfoData.pensionStart, this.dateFormat) : null
          this.model.medicalStart = socialInfoData.medicalStart ? moment(socialInfoData.medicalStart, this.dateFormat) : null
          this.model.unemployStart = socialInfoData.unemployStart ? moment(socialInfoData.unemployStart, this.dateFormat) : null
          this.model.workInjuryStart = socialInfoData.workInjuryStart ? moment(socialInfoData.workInjuryStart, this.dateFormat) : null
          this.model.birthStart = socialInfoData.birthStart ? moment(socialInfoData.birthStart, this.dateFormat) : null
          this.model.bigailmentStart = socialInfoData.bigailmentStart ? moment(socialInfoData.bigailmentStart, this.dateFormat) : null
          // 各种险种状态
          this.model.socialHandleStatus = record.dispatchInfo.socialHandleStatus
          this.model.pensionHandle = socialInfoData.pensionHandle
          this.model.medicalHandle = socialInfoData.medicalHandle
          this.model.unemployHandle = socialInfoData.unemployHandle
          this.model.workInjuryHandle = socialInfoData.workInjuryHandle
          this.model.birthHandle = socialInfoData.birthHandle
          this.model.bigailmentHandle = socialInfoData.bigailmentHandle

          // 基数配置查询
          httpAction(this.url.sysBaseSetByEntityUrl + '?id=' + socialInfoData.cardinalIid, '', 'GET').then((res) => {
            if (res.code === 200) {
              if (res.data.length > 0) {
                let typeOfInsuranceCheckedList = [] // 险种选取
                let socialSysBaseSetByEntityData = this.sysBaseSetByEntityOfSocial = res.data[0] // 默认取第一条数据
                this.model.lowerLimit = socialSysBaseSetByEntityData.lowerLimit    // 社保基数下限
                this.model.upperLimit = socialSysBaseSetByEntityData.upperLimit    // 社保基数上限
                
                if (socialSysBaseSetByEntityData.canOverpay == 0) {  // 是否可补缴社保
                  this.model.socialOverpayNumber = socialInfoData.overpayNumber + ''    // 补缴期限
                  this.model.socialHaveThisMonth = socialInfoData.haveThisMonth    // 是否含当月
                  this.model.insuranceIsLatestCardinalityOfSocial = socialInfoData.insuranceIsLatestCardinality    // 补缴采用最新基数
                  
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
                  this.model.socialPayPolicy = socialSysBaseSetByEntityData.payPolicy // 社保补缴政策
                } else {
                  this.socialCanOverpay = false
                }

                if (socialSysBaseSetByEntityData.isIllness == 0) { // 大病
                  this.model.isChargePersonal = socialSysBaseSetByEntityData.isChargePersonal // 新员工入职收费
                  this.model.collectType = socialSysBaseSetByEntityData.collectType // 大病救助缴纳周期
                  this.model.valueType = socialSysBaseSetByEntityData.valueType // 大病缴纳方式
                
                  if (socialSysBaseSetByEntityData.collectType == 1) {  // 月份不显示
                    this.collectMothShow = false
                  } else {
                    this.model.collectMoth = socialSysBaseSetByEntityData.collectMoth + ''// 大病缴纳月份
                  }

                  if (socialSysBaseSetByEntityData.valueType == 0) {  // 大病定值的时候
                    this.socialValueType = false
                  }

                  if (socialSysBaseSetByEntityData.isChargePersonal != 0) { // 新员工入职缴费
                    this.isChargePersonalStatus = false
                  }
                } else {
                  this.socialIsIllness = false
                }
                if(record.socialInfo){
                  this.model = Object.assign(this.model,{socialId:record.socialInfo.id})
                  this.insuranceType.pensionHandle.val = record.socialInfo.pensionHandle
                  this.insuranceType.medicalHandle.val = record.socialInfo.medicalHandle
                  this.insuranceType.unemployHandle.val = record.socialInfo.unemployHandle
                  this.insuranceType.workInjuryHandle.val = record.socialInfo.workInjuryHandle
                  this.insuranceType.birthHandle.val = record.socialInfo.birthHandle
                  if(!this.socialIsIllness){
                    delete this.insuranceType.bigailmentHandle
                  }else{
                    this.insuranceType.bigailmentHandle.val = record.socialInfo.bigailmentHandle
                  }
                }
                // 单位
                this.model.unitPensionCardinal = socialInfoData.unitPensionCardinal    // 单位养老
                this.model.unitPensionPer = socialInfoData.unitPensionPer
                this.model.unitPersionMoney = socialInfoData.unitPersionMoney
                this.model.unitMedicalCardinal = socialInfoData.unitMedicalCardinal    // 单位医疗
                this.model.unitMedicalPer = socialInfoData.unitMedicalPer
                this.model.unitMedicalMoney = socialInfoData.unitMedicalMoney
                this.model.unitUnemploymentCardinal = socialInfoData.unitUnemploymentCardinal    // 单位失业
                this.model.unitUnemploymentPer = socialInfoData.unitUnemploymentPer
                this.model.unitUnemploymentMoney = socialInfoData.unitUnemploymentMoney
                this.model.unitWorkInjuryCardinal = socialInfoData.unitWorkInjuryCardinal    // 单位工伤
                this.model.unitWorkUnjuryPer = socialInfoData.unitWorkUnjuryPer
                this.model.unitInjuryMoney = socialInfoData.unitInjuryMoney
                this.model.unitBirthCardinal = socialInfoData.unitBirthCardinal    // 单位生育
                this.model.unitBirthPer = socialInfoData.unitBirthPer
                this.model.unitBirthMoney = socialInfoData.unitBirthMoney
                // 新增缴纳类型和备案基数
                this.model.paymentType = socialInfoData.paymentType.toString()
                this.model.recordBase = socialInfoData.recordBase
                if (socialSysBaseSetByEntityData.isIllness == 0) { // 大病
                  if (Number(socialSysBaseSetByEntityData.valueType) !== 0) {  // 大病定值的时候  改变了数据逻辑
                    this.model.unitBigailmentCardinal = socialInfoData.unitBigailmentCardinal   // 单位大病
                    this.model.unitBigailmentPer = socialInfoData.unitBigailmentPer
                  }
                  this.model.unitBigailmentMoney = socialInfoData.unitBigailmentMoney
                }
                // 个人
                this.model.personalPensionCardinal = socialInfoData.personalPensionCardinal    // 个人养老
                this.model.personalPensionPer = socialInfoData.personalPensionPer
                this.model.personalPersionMoney = socialInfoData.personalPersionMoney
                this.model.personalMedicalCardinal = socialInfoData.personalMedicalCardinal    // 个人医疗
                this.model.personalMedicalPer = socialInfoData.personalMedicalPer
                this.model.personalMedicalMoney = socialInfoData.personalMedicalMoney
                this.model.personalUnemploymentCardinal = socialInfoData.personalUnemploymentCardinal    // 个人失业
                this.model.personalUnemploymentPer = socialInfoData.personalUnemploymentPer
                this.model.personalUnemploymentMoney = socialInfoData.personalUnemploymentMoney
                this.model.socialTrustRemark = socialInfoData.trustRemark

                if (socialSysBaseSetByEntityData.isIllness == 0 && this.isChargePersonalStatus) { // 大病
                  if (socialSysBaseSetByEntityData.valueType != 0) {  // 大病定值的时候
                    this.model.personalBigailmentCardinal = socialInfoData.personalBigailmentCardinal // 个人大病
                    this.model.personalBigailmentPer = socialInfoData.personalBigailmentPer
                    this.$nextTick(() => {
                      this.socialForm.setFieldsValue(pick(this.model, 'personalBigailmentCardinal', 'personalBigailmentPer'))
                    })
                  }

                  this.model.personalBigailmentMoney = socialInfoData.personalBigailmentMoney
                  this.$nextTick(() => {
                    this.socialForm.setFieldsValue(pick(this.model, 'personalBigailmentMoney'))
                  })
                }
                this.$nextTick(() => {
                  this.socialForm.setFieldsValue(pick(this.model, 'socialHousehold', 'socialProvince', 'socialCity', 'socialTown',
                  'socialStartDate', 'lowerLimit', 'upperLimit', 'socialOverpayNumber', 'socialHaveThisMonth', 'collectMoth',
                  'insuranceIsLatestCardinalityOfSocial', 'typeOfInsurance', 'socialPayPolicy', 'isChargePersonal', 'collectType', 
                  'unitPensionCardinal', 'unitMedicalCardinal', 'unitUnemploymentCardinal', 'unitWorkInjuryCardinal','valueType', 
                  'unitBirthCardinal', 'unitBigailmentCardinal', 'personalPensionCardinal', 'personalMedicalCardinal',
                  'personalUnemploymentCardinal', 'unitPensionPer', 'unitMedicalPer', 'unitUnemploymentPer', 'unitWorkUnjuryPer',
                  'unitBirthPer', 'unitBigailmentPer', 'personalPensionPer', 'personalMedicalPer', 'personalUnemploymentPer',
                  'unitPersionMoney', 'unitMedicalMoney', 'unitUnemploymentMoney', 'unitInjuryMoney', 'unitBirthMoney','paymentType',
                  'unitBigailmentMoney', 'personalPersionMoney', 'personalMedicalMoney', 'personalUnemploymentMoney','recordBase',
                  'bigailmentStart','birthStart','workInjuryStart','unemployStart','medicalStart','pensionStart','repeatReason'))
                  this.socialForm.setFieldsValue(pick({trustRemark:this.model.socialTrustRemark},'trustRemark'))
                })
              } else {
                this.$message.error('基数配置数据请求失败！')
              }
            } else {
              this.$message.error('基数配置数据请求失败！')
            }
          })
          
          // 社保地址
          for (const p of this.AreaTrees) {
            if (String(p.id) === String(this.model.socialProvince)) {
              this.socialAreaCitys = p.children
              for (const c of this.socialAreaCitys) {
                if (String(c.id) === String(this.model.socialCity)) {
                  this.socialAreaTowns = c.children
                  break
                }
              }
            break
            }
          }
        }

        /************************************************* 公积金数据 *************************************************/
        let fundInfoData = record.fund

        if (!fundInfoData) {  // 无公积金
          this.fundInfoShow = false
        } else {
          this.model.fundHousehold = fundInfoData.providentHousehold // 公积金户
          this.model.fundProvince = fundInfoData.fundProvince  // 公积金地-省
          this.model.fundCity = fundInfoData.fundCity  // 公积金地-市
          this.model.fundTown = fundInfoData.fundTown    // 公积金地-区
          this.model.fundStatus = fundInfoData.handleStatus
          this.model.fundStartDate = moment(fundInfoData.providentStart, this.dateFormat) // 公积金起缴日期
          // 基数配置查询
          httpAction(this.url.sysBaseSetByEntityUrl + '?id=' + fundInfoData.fundBaseSetId, '', 'GET').then((res) => {
            if (res.code === 200) {
              if (res.data.length > 0) {
                let fundSysBaseSetByEntityData = this.sysBaseSetByEntityOfFund = res.data[0] // 默认取第一条数据
                this.model.fundPayLowerLimit = fundSysBaseSetByEntityData.lowerLimit    // 公积金基数下限
                this.model.fundPayUpperLimit = fundSysBaseSetByEntityData.upperLimit    // 公积金基数上限
                this.model.fundPayPoint = fundSysBaseSetByEntityData.fundPayPoint + ''    // 公积金单边小数点
                this.fundProvidentPer = fundSysBaseSetByEntityData.fundProList // 公积金比例

                if (fundSysBaseSetByEntityData.canOverpay == 0) {  // 是否可补缴公积金
                  this.model.insuranceIsLatestCardinalityOfFund = fundSysBaseSetByEntityData.insuranceIsLatestCardinality    // 补缴采用最新基数
                  this.model.fundOverpayNumber = fundSysBaseSetByEntityData.overpayNumber + ''   // 补缴期限
                  this.model.fundHaveThisMonth = fundSysBaseSetByEntityData.haveThisMonth    // 是否含当月
                  this.model.fundPayPolicy = fundSysBaseSetByEntityData.payPolicy    // 公积金补缴政策
                } else {
                  this.fundCanOverpay = false
                }

                this.model.unitProvidengCardinal = fundInfoData.unitProvidengCardinal    // 单位公积金
                this.model.unitProvidentPer = fundInfoData.unitProvidentPer
                this.model.unitProvidentFee = fundInfoData.unitProvidentFee
                this.model.personalProvidentCardinal = fundInfoData.personalProvidentCardinal    // 个人公积金
                this.model.personalProvidentPer = fundInfoData.personalProvidentPer
                this.model.personalProvidentFee = fundInfoData.personalProvidentFee
                this.model.trustRemark = fundInfoData.trustRemark
                this.$nextTick(() => {
                  this.fundForm.setFieldsValue(pick(this.model, 'fundHousehold', 'fundProvince', 'fundCity', 'fundTown', 'fundStartDate', 'fundPayLowerLimit', 'fundPayUpperLimit', 'fundPayPoint', 'insuranceIsLatestCardinalityOfFund', 'fundOverpayNumber', 'fundHaveThisMonth', 'fundPayPolicy',
                  'unitProvidengCardinal', 'unitProvidentPer', 'unitProvidentFee', 'personalProvidentCardinal', 'personalProvidentPer', 'personalProvidentFee','trustRemark'))
                })
              } else {
                this.$message.error('基数配置数据请求失败！')
              }
            } else {
              this.$message.error('基数配置数据请求失败！')
            }
          })
          
          // 公积金地址
          for (const p of this.AreaTrees) {
            if (String(p.id) === String(this.model.fundProvince)) {
              this.fundAreaCitys = p.children
              for (const c of this.fundAreaCitys) {
                if (String(c.id) === String(this.model.fundCity)) {
                  this.fundAreaTowns = c.children
                  break
                }
              }
            break
            }
          }
        }

        // 学历信息
        httpAction(`hrBase/temployeeinfo/getTEmployeeInfoVo/ByEmpIds?empIds=${this.model.id}`,null,'get').then(ress=>{
          if(ress.code === 200){
            if(ress.data.length && ress.data[0].educationName){
              this.$nextTick(() => {
                this.education = filterDictText(this.educationOptions,ress.data[0].educationName)
              })
            }
          }else{
            this.$message.warning(ress.msg)
          }
        })
      },
      // 审核按钮
      handleOk() {
        this.$refs.dispatchVerificationModal.Type = '0' // 派增
        this.$refs.dispatchVerificationModal.title = '审核确认'
        this.$refs.dispatchVerificationModal.ids = this.recordInfo.id
        this.$refs.dispatchVerificationModal.nextUserIdBelongs = this.nextUserIdBelongs
        this.$refs.dispatchVerificationModal.edit()
      },
      // 编辑
      handleEdit() {
        let requestData = {}  // 请求数据
        let fundFormStatus = true
        let socialFormStatus = true
        requestData.id = this.recordInfo.id

        if (this.socialInfoShow) {  // 社保
          // 触发表单验证（社保表单）
          this.socialForm.validateFields((err, values) => {
            if (!err) {
              let formData = Object.assign(this.model, values)

              if (Array.isArray(formData.socialCity)) {
                formData.socialCity = null
              }
              
              if (Array.isArray(formData.socialTown)) {
                formData.socialTown = null
              }

              requestData.socialProvince = formData.socialProvince  // 社保地-省
              requestData.socialCity = formData.socialCity  // 社保地-市
              requestData.socialTown = formData.socialTown    // 社保地-区
              requestData.socialStartDate = formData.socialStartDate.format(this.dateFormat) + '-01 00:00:00' // 社保起缴日期
            } else {
              socialFormStatus = false
            }
          })
        }

        if (this.fundInfoShow) {  // 公积金
          // 触发表单验证（公积金表单）
          this.fundForm.validateFields((err, values) => {
            if (!err) {
              let formData = Object.assign(this.model, values)

              if (Array.isArray(formData.fundCity)) {
                formData.fundCity = null
              }
              
              if (Array.isArray(formData.fundTown)) {
                formData.fundTown = null
              }

              requestData.fundProvince = formData.fundProvince  // 公积金地-省
              requestData.fundCity = formData.fundCity  // 公积金地-市
              requestData.fundTown = formData.fundTown    // 公积金地-区
              requestData.providentStart = formData.fundStartDate.format(this.dateFormat) + '-01 00:00:00'  // 公积金起缴日期
            } else {
              fundFormStatus = false
            }
          })
        }

        if (socialFormStatus && fundFormStatus) {
          const that = this
          that.confirmLoading = true
          let httpurl = ''
          httpurl += that.url.edit
          let method = 'POST'

          httpAction(httpurl, requestData, method).then((res) => {
            if (res.code === 200) {
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
      },
      // tab切换
      tabsChange(e) {
        this.activeKey = e
      },
      // 关闭按钮
      handleCancel() {
        this.close()
      },
      // 关闭功能数据重置
      close() {
        this.$emit('close')
        this.isEdit = false  // 修改
        this.visible = false
        this.isVerify = false // 是否显示审核按钮
        this.activeKey = '1'  //默认第一个tab
        this.disableSubmit = false
        this.confirmLoading = false
        this.socialInfoShow = true // 社保数据是否显示
        this.fundInfoShow = true // 公积金数据是否显示
        this.houseHolds = [] // 社保户、公积金户
        this.AreaTrees = [] // 所有地区
        this.recordInfo = {} // 派单信息
        this.auditList = []  // 审核流程数据
        this.fundAreaCitys = []  // 公积金城市
        this.fundAreaTowns = []  // 公积金区县
        this.socialAreaCitys = []  // 社保城市
        this.socialAreaTowns = []  // 社保区县
        this.fundCanOverpay = true // 公积金是否可补缴
        this.socialCanOverpay = true // 社保是否可补缴
        this.socialIsIllness = true // 是否可大病
        this.collectMothShow = true  // 缴纳月份是否显示
        this.socialValueType = true  // 大病按定值不显示
        this.sysBaseSetByEntityOfFund = [] // 公积金户选择数据
        this.sysBaseSetByEntityOfSocial = [] // 社保户选择数据
        this.fundProvidentPer = [] // 公积金比例
        this.nextUserIdBelongs = [] // 下一步操作人
        this.isChargePersonalStatus = true // 新员工是否缴费
        this.education = ''
        this.employeeContractInfo = {}
        this.insuranceType = {
          pensionHandle:{name:'养老',val:null},
          medicalHandle:{name:'医疗',val:null},
          unemployHandle:{name:'失业',val:null},
          workInjuryHandle:{name:'工伤',val:null},
          birthHandle:{name:'生育',val:null},
          bigailmentHandle:{name:'大病',val:null},
        }
        this.textBtn = '展开'
        this.historyList = []
      },
      // ok数据回调
      dispatchVerificationModalFormOk() {
        this.close()
        this.$emit('ok')
      },
      // 社保缴纳地省份切换
      handleSocialProvinceChange(value) {
        this.socialAreaCitys = []
        this.socialAreaTowns = []

        for (var c of this.AreaTrees[value - 1].children) {
          this.socialAreaCitys.push(c)
        }

        this.model.socialCity = []
        this.model.socialTown = []
        this.$nextTick(() => {
          this.socialForm.setFieldsValue(pick(this.model, 'socialCity', 'socialTown'))
        })
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
        
        this.model.socialTown = []
        this.$nextTick(() => {
          this.socialForm.setFieldsValue(pick(this.model, 'socialTown'))
        })
      },
      // 公积金缴纳地省份切换
      handleFundProvinceChange(value) {
        this.fundAreaCitys = []
        this.fundAreaTowns = []

        for (var c of this.AreaTrees[value - 1].children) {
          this.fundAreaCitys.push(c)
        }

        this.model.fundCity = []
        this.model.fundTown = []
        this.$nextTick(() => {
          this.fundForm.setFieldsValue(pick(this.model, 'fundCity', 'fundTown'))
        })
      },
      // 公积金缴纳地城市切换
      handleFundCityChange(value) {
        this.fundAreaTowns = []

        for (var c of this.fundAreaCitys) {
          if (String(c.id) === String(value)) {
            if (c.children.length > 0) {
              for (var t of c.children) {
                this.fundAreaTowns.push(t)
              }
            }
          break
          }
        }

        this.model.fundTown = []
        this.$nextTick(() => {
          this.fundForm.setFieldsValue(pick(this.model, 'fundTown'))
        })
      },
      // 数据字典
      initDictConfig() {
        // 性别
        initDictOptions('sex').then((res) => {
          if (res.code === 200) {
            this.sexOptions = res.data
          }
        })
        // 婚姻状况
        initDictOptions('marital_status').then((res) => {
          if (res.code === 200) {
            this.empMarriOptions = res.data
          }
        })
        // 民族
        initDictOptions('nation').then((res) => {
          if (res.code === 200) {
            this.empNationalOptions = res.data
          }
        })
        // 政治面貌
        initDictOptions('political_status').then((res) => {
          if (res.code === 200) {
            this.politicalOptions = res.data
          }
        })
        // 员工类型
        initDictOptions('personnel_type').then((res) => {
          if (res.code === 200) {
            this.empTypeOptions = res.data
          }
        })
        // 户口性质
        initDictOptions('household_nature').then((res) => {
          if (res.code === 200) {
            this.empRegisTypeOptions = res.data
          }
        })
        // 员工标签
        initDictOptions('employee_lable').then((res) => {
          if (res.code === 200) {
            this.employeeLableOptions = res.data
          }
        })
        // 员工合同类型
        initDictOptions('employee_contract_type').then((res) => {
          if (res.code === 200) {
            this.employeeContractTypeOptions = res.data
          }
        })
        // 签订情况
        initDictOptions('situation_type').then((res) => {
          if (res.code === 200) {
            this.situationTypeOptions = res.data
          }
        })
        // 工时制
        initDictOptions('working_hours').then((res) => {
          if (res.code === 200) {
            this.workingHoursOptions = res.data
          }
        })
        // 学历
        initDictOptions('education').then((res) => {
          if (res.code === 200) {
            this.educationOptions = res.data
          }
        })
      },
    }
  }
</script>

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
.ant-advanced-search-form .code-box-demo {
  padding: 42px 24px 50px;
  color: rgba(0, 0, 0, 0.65);
}
.ant-advanced-search-form .ant-empty {
  margin: 0 8px;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
}
.ant-advanced-search-form .ant-empty-description {
  margin: 0;
}
</style>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 125px;
  }
}
.successTag{
  display: inline-block;
  width: 70px;
  height: 30px;
  line-height: 30px;
  color: #37B655;
  text-align: center;
  background: url('/images/check_icon.png');
  background-size: 100% 100%;
  margin-right: 8px;
}
.errorTag{
  display: inline-block;
  width: 70px;
  height: 30px;
  line-height: 30px;
  color: #E84E4E;
  text-align: center;
  background: url('/images/error_icon.png');
  background-size: 100% 100%;
  margin-right: 8px;
}
.disTag{
  display: inline-block;
  width: 70px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin-right: 8px;
  background: #f9f3f3;
  color: #999;
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

.employeeStepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
  margin-bottom: 0px;
}

.ant-form-detail {
  :global(.ant-form-item-control .ant-form-item-children) {
    width: 265px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
}

.process{
  padding: 0px 16px;
  line-height: 26px;
  .th{
    color: #000000d9;
  }
  .ant-btn{
    margin-left: 10px;
  }
  .tags{
    font-size: 12px;
    color:#000000a6;
    padding: 10px 15px;
    display: inline-block;
    margin: 0px 0px 10px 104px;
  }
  .timeline{
    margin-top: 10px;
    p{
      margin-bottom: 8px;
    }
  }
}
.marginBot{
  margin-bottom: 5px;
}

/deep/ .ant-timeline-item-head-red{
  background: url(/images/time_error_icon.png) center center;
  width: 14px;
  height: 14px;
  border: none;
}
/deep/ .ant-timeline-item-head-green{
  background: url(/images/time_check_icon.png) center center;
  width: 14px;
  height: 14px;
  border: none;
}
/deep/ .ant-timeline-item-head-blue{
  background: url(/images/time_rehandle_icon.png) center center;
  width: 14px;
  height: 14px;
  border: none;
}
/deep/ .ant-timeline-item-tail{
  left: 6px;
}
.toggle{
  float: right;
  color: #1890FF;
  cursor: pointer;
  font-size: 14px;
}

</style>