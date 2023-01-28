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
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
      <a-button
        v-if="submit"
        key="handleOk"
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >保存</a-button>
    </template>

    <!-- 警示提示圆点 -->
    <div style="float: left; height: 0;">
      <a-badge
        dot
        :offset="offset.offsetOne"
        v-if="offsetStatus.offsetOne"
        style="height: 0px; width: 0px"
      ></a-badge>
      <a-badge
        dot
        :offset="offset.offsetTwo"
        v-if="offsetStatus.offsetTwo"
        style="height: 0px; width: 0px"
      ></a-badge>
      <a-badge
        dot
        :offset="offset.offsetThree"
        v-if="offsetStatus.offsetThree"
        style="height: 0px; width: 0px"
      ></a-badge>
    </div>

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
            <a-card
              :bordered="false"
              title="基础信息"
            >
            </a-card>

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
                    :title="model.empType ? model.empType: '-'"
                  >
                    {{ model.empType ? model.empType: '-' }}
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
                    :title="model.remark ? model.remark: '-'"
                  >
                    {{ model.remark ? model.remark: '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-card
              v-if="records.id"
              :bordered="false"
              title="合同信息"
            >
            </a-card>

            <a-row v-if="records.id">
              <a-descriptions bordered>
                <a-descriptions-item label="合同起止时间">
                  {{ records.id ? (records.contractStart+' ~ '+records.contractEnd) : '-' }}
                </a-descriptions-item>
                <a-descriptions-item label="合同期限">
                  {{ records.id ? (records.contractTerm ? records.contractTerm : '-') : '' }}
                </a-descriptions-item>
                <a-descriptions-item label="合同类型">
                  {{ records.id ? ((contractType = filterDictText(employeeContractTypeOptions, records.contractType)) ? contractType : '-') : '' }}
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
            class="ant-advanced-search-form"
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
                        :allowClear="allowClear"
                        showSearch
                        :disabled="socialExist"
                        optionFilterProp="children"
                        placeholder="请选择社保户"
                        v-decorator="['socialHousehold', validatorSocialRules.socialHousehold]"
                        :dropdownMatchSelectWidth="false"
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
                        showSearch
                        placeholder="选择省份"
                        optionFilterProp="children"
                        style="width: 100px"
                        v-decorator="['socialProvince', validatorSocialRules.socialProvince]"
                        :dropdownMatchSelectWidth="false"
                        @change="handleSocialProvinceChange"
                        :disabled="socialIsDisabled"
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
                        allowClear
                        showSearch
                        placeholder="选择城市"
                        optionFilterProp="children"
                        style="width: 100px"
                        v-decorator="['socialCity', validatorSocialRules.socialCity]"
                        :dropdownMatchSelectWidth="false"
                        @change="handleSocialCityChange"
                        :disabled="socialIsDisabled"
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
                        v-decorator="['socialTown', {}]"
                        @change="handleSocialTownChange"
                        :dropdownMatchSelectWidth="false"
                        :disabled="socialIsDisabled"
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
                        :format="dateFormat"
                        :disabledDate="disabledSocialStartDate"
                        placeholder="请选择社保起缴日期"
                        v-decorator="['socialStartDate', validatorSocialRules.socialStartDate]"
                        style="width: 332px"
                        :disabled="dateCanBeSelected"
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
                  ><a-form-item
                    label="是否收取大病"
                    class="stepFormText"
                  >
                    <a-radio-group
                      :disabled="true"
                      class="fontiframe"
                      name="radioGroup"
                      v-decorator="['isIllness', {}]"
                    >
                      <a-radio value="0">是</a-radio>
                      <a-radio value="1">否</a-radio>
                    </a-radio-group>
                  </a-form-item></a-col>
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
                        @change="handleSelectPayTypeChange"
                        placeholder="请选择缴纳类型"
                        v-decorator="['paymentType', {rules:[{required:true,message:'请选择缴纳类型'}]}]"
                        style="width: 110px"
                        :disabled="isPaymentType"
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
                        v-decorator="['recordBase', recordBaseRule]"
                        placeholder="请填写备案基数"
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
                        :disabled="socialDataIsDisabled"
                        placeholder="基数"
                        v-decorator="['unitPensionCardinal', {rules: [{ validator: this.validateSocialUnitPensionCardinal }]}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="socialDataIsDisabled"
                        placeholder="比例"
                        v-decorator="['unitPensionPer', {rules: [{required:true, validator: this.validateSocialUnitPensionPer }]}]"
                        style="width: 136px"
                        addonAfter="%"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="金额"
                        v-decorator="['unitPersionMoney', {}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="单位医疗">
                      <a-input
                        :disabled="socialDataIsDisabled"
                        placeholder="基数"
                        v-decorator="['unitMedicalCardinal', {rules: [{ validator: this.validateSocialUnitMedicalCardinal }]}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="socialDataIsDisabled"
                        placeholder="比例"
                        v-decorator="['unitMedicalPer', {rules: [{ validator: this.validateSocialUnitMedicalPer }]}]"
                        style="width: 136px"
                        addonAfter="%"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="金额"
                        v-decorator="['unitMedicalMoney', {}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="单位失业">
                      <a-input
                        :disabled="socialDataIsDisabled"
                        placeholder="基数"
                        v-decorator="['unitUnemploymentCardinal', {rules: [{ validator: this.validateSocialUnitUnemploymentCardinal }]}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="socialDataIsDisabled"
                        placeholder="比例"
                        v-decorator="['unitUnemploymentPer', {rules: [{ validator: this.validateSocialUnitUnemploymentPer }]}]"
                        style="width: 136px"
                        addonAfter="%"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="金额"
                        v-decorator="['unitUnemploymentMoney', {}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="单位工伤">
                      <a-input
                        :disabled="socialDataIsDisabled"
                        placeholder="基数"
                        v-decorator="['unitWorkInjuryCardinal', {rules: [{ validator: this.validateSocialUnitWorkInjuryCardinal }]}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="socialDataIsDisabled"
                        placeholder="比例"
                        v-decorator="['unitWorkUnjuryPer', {rules: [{ validator: this.validateSocialWorkUnjuryPer }]}]"
                        style="width: 136px"
                        addonAfter="%"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="金额"
                        v-decorator="['unitInjuryMoney', {}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="单位生育">
                      <a-input
                        :disabled="socialDataIsDisabled"
                        placeholder="基数"
                        v-decorator="['unitBirthCardinal', {rules: [{ validator: this.validateSocialUnitBirthCardinal }]}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="socialDataIsDisabled"
                        placeholder="比例"
                        v-decorator="['unitBirthPer', {rules: [{ validator: this.validateSocialUnitBirthPer }]}]"
                        style="width: 136px"
                        addonAfter="%"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="true"
                        placeholder="金额"
                        v-decorator="['unitBirthMoney', {}]"
                        style="width: 136px"
                      />
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
                          :disabled="socialDataIsDisabled || illness"
                          placeholder="基数"
                          v-decorator="['unitBigailmentCardinal', {rules: [{ validator: this.validateSocialUnitBigailmentCardinal }]}]"
                          style="width: 136px"
                        />
                      </a-form-item>
                      <a-form-item v-if="socialValueType">
                        <a-input
                          :disabled="socialDataIsDisabled || illness"
                          placeholder="比例"
                          v-decorator="['unitBigailmentPer', {rules: [{ validator: this.validateSocialUnitBigailmentPer }]}]"
                          style="width: 136px"
                          addonAfter="%"
                        />
                      </a-form-item>
                      <a-form-item>
                        <a-input
                          :disabled="socialDataIsDisabled || socialValueType || illness"
                          placeholder="金额"
                          v-decorator="['unitBigailmentMoney', {rules: [{ validator: this.validateSocialunitBigailmentMoney }]}]"
                          style="width: 136px"
                        />
                      </a-form-item>
                    </div>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="个人养老">
                      <a-input
                        :disabled="socialDataIsDisabled"
                        placeholder="请填写基数"
                        v-decorator="['personalPensionCardinal', {rules: [{ validator: this.validateSocialPersonalPensionCardinal }]}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="socialDataIsDisabled"
                        placeholder="请填写比例"
                        v-decorator="['personalPensionPer', {rules: [{ validator: this.validateSocialPersonalPensionPer }]}]"
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
                        :disabled="socialDataIsDisabled"
                        placeholder="请填写基数"
                        v-decorator="['personalMedicalCardinal', {rules: [{ validator: this.validateSocialPersonalMedicalCardinal }]}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="socialDataIsDisabled"
                        placeholder="请填写比例"
                        v-decorator="['personalMedicalPer', {rules: [{ validator: this.validateSocialPersonalMedicalPer }]}]"
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
                        :disabled="socialDataIsDisabled"
                        placeholder="请填写基数"
                        v-decorator="['personalUnemploymentCardinal', {rules: [{ validator: this.validateSocialPersonalUnemploymentCardinal }]}]"
                        style="width: 136px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        :disabled="socialDataIsDisabled"
                        placeholder="请填写比例"
                        v-decorator="['personalUnemploymentPer', {rules: [{ validator: this.validateSocialPersonalUnemploymentPer }]}]"
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
                          :disabled="socialDataIsDisabled || illness"
                          placeholder="请填写基数"
                          v-decorator="['personalBigailmentCardinal', {rules: [{ validator: this.validateSocialPersonalBigailmentCardinal }]}]"
                          style="width: 136px"
                        />
                      </a-form-item>
                      <a-form-item v-if="socialValueType">
                        <a-input
                          :disabled="socialDataIsDisabled || illness"
                          placeholder="请填写比例"
                          v-decorator="['personalBigailmentPer', {rules: [{ validator: this.validateSocialPersonalBigailmentPer }]}]"
                          style="width: 136px"
                          addonAfter="%"
                        />
                      </a-form-item>
                      <a-form-item>
                        <a-input
                          :disabled="socialDataIsDisabled || socialValueType || illness"
                          placeholder="请填写金额"
                          v-decorator="['personalBigailmentMoney', {rules: [{ validator: this.validateSocialunitBigailmentMoney }]}]"
                          style="width: 136px"
                        />
                      </a-form-item>
                    </div>
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
            class="ant-advanced-search-form"
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
                        :allowClear="allowClear"
                        showSearch
                        :disabled="fundExist"
                        optionFilterProp="children"
                        placeholder="请选择公积金户"
                        v-decorator="['fundHousehold', validatorFundRules.fundHousehold]"
                        :dropdownMatchSelectWidth="false"
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
                        showSearch
                        placeholder="选择省份"
                        optionFilterProp="children"
                        style="width: 100px"
                        v-decorator="['fundProvince', validatorFundRules.fundProvince]"
                        :dropdownMatchSelectWidth="false"
                        @change="handleFundProvinceChange"
                        :disabled="fundIsDisabled"
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
                        allowClear
                        showSearch
                        placeholder="选择城市"
                        optionFilterProp="children"
                        style="width: 100px"
                        v-decorator="['fundCity', {}]"
                        :dropdownMatchSelectWidth="false"
                        @change="handleFundCityChange"
                        :disabled="fundIsDisabled"
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
                        allowClear
                        showSearch
                        placeholder="选择区县"
                        optionFilterProp="children"
                        style="width: 100px"
                        v-decorator="['fundTown', {}]"
                        :dropdownMatchSelectWidth="false"
                        @change="handleFundTownChange"
                        :disabled="fundIsDisabled"
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
                        :format="dateFormat"
                        :disabledDate="disabledFundStartDate"
                        placeholder="请选择公积金起缴日期"
                        v-decorator="['fundStartDate', validatorFundRules.fundStartDate]"
                        style="width: 332px"
                        :disabled="fundIsDisabled"
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
                        :disabled="fundDataIsDisabled"
                        placeholder="请填写基数"
                        v-decorator="['unitProvidengCardinal', {rules: [{ validator: this.validateFundUnitProvidengCardinal }]}]"
                        style="width: 100px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-select
                        :disabled="fundDataIsDisabled"
                        placeholder="选择比例"
                        v-decorator="['unitProvidentPer', {rules: [{ validator: this.validateFundUnitProvidentPer }]}]"
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
                        :disabled="fundDataIsDisabled"
                        placeholder="请填写基数"
                        v-decorator="['personalProvidentCardinal', {rules: [{ validator: this.validateFundPersonalProvidentCardinal }]}]"
                        style="width: 100px"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-select
                        :disabled="fundDataIsDisabled"
                        placeholder="选择比例"
                        v-decorator="['personalProvidentPer', {rules: [{ validator: this.validateFundPersonalProvidentPer }]}]"
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
    </a-tabs>
    <error-modal ref="errorModal"></error-modal>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import { getAreaName } from '@/utils/common'
  import ErrorModal from '../../../global/modules/ErrorModal'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'DispatchAddApplicationModal',
    components: {
      ErrorModal,
    },
    data() {
      return {
        moment,
        model: {},
        title: '操作',
        visible: false,
        houseHolds: [], // 社保户、公积金户
        allowClear: true, // 是否支持清除功能
        okStatusOfFund: 0,  // 记录第几次点击提交按钮（0为初始，1为提交按钮点击【变化条件是0->1】，2为选择选择社保户或者公积金户【变化条件无】）
        okStatusOfSubmit: 0,  // 记录第几次点击提交按钮（0为初始，1为提交按钮点击【变化条件是0->1】，2为选择选择社保户或者公积金户【变化条件无】）
        okStatusOfSocial: 0,  // 记录第几次点击提交按钮（0为初始，1为提交按钮点击【变化条件是0->1】，2为选择选择社保户或者公积金户【变化条件无】）
        activeKey: '1', // 默认第一个tab
        records: {}, // 派单数据
        recordInfo: {}, // 编辑数据
        socialMoneyType: 4, // 社保金额数据类型
        getAreaName,
        filterDictText,
        confirmLoading: false,
        fundForm: this.$form.createForm(this),
        socialForm: this.$form.createForm(this),
        employeeForm: this.$form.createForm(this),
        offset: {'offsetOne': [66, 0], 'offsetTwo': [158, 0], 'offsetThree': [264, 0]},
        offsetStatus: {'offsetOne': false, 'offsetTwo': false, 'offsetThree': false},
        socialInfoShow: true, // 社保数据是否显示
        fundInfoShow: true, // 公积金数据是否显示
        dateFormat: 'YYYY-MM',  // 时间格式化类型
        submit:true,  // 是否提交
        AreaTrees: [], // 所有地区
        fundExist: false, // 公积金数据是否已经存在
        socialExist: false, // 社保数据是否已经存在
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
        settleDomainBelongs: [],  // 结算主体和部门
        isChargePersonalStatus: true, // 新员工是否缴费
        fundHouseholdOptions: [], //公积金户
        socialHouseholdOptions: [], // 社保户
        selectHouseholdOptions: [], // 社保户、公积金户（已选择的）
        sysBaseSetByEntityOfFund: [], // 公积金户选择数据
        sysBaseSetByEntityOfSocial: [], // 社保户选择数据
        fundProvidentPer: [], // 公积金比例
        fundPayPointBelongs: [], // 公积金单边小数点
        fundIsDisabled: true, // 公积金户未选择地址与日期不可选
        socialIsDisabled: true, // 社保户未选择地址与日期不可选
        fundDataIsDisabled: true, // 公积金起缴日期未选择表单数据不可选
        socialDataIsDisabled: true, // 社保起缴日期未选择表单数据不可选
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
          socialHousehold: { rules: [{ validator: this.validateSocialHousehold }] },
          socialProvince: { rules: [] },
          socialCity: { rules: [] },
          socialStartDate: { rules: [] },
        },
        // 公积金数据校验
        validatorFundRules: {
          fundHousehold: { rules: [{ validator: this.validateFundHousehold }] },
          fundProvince: { rules: [] },
          fundStartDate: { rules: [] },
        },
        url: {
          add: 'hrSocial/tdispatchinfo/saveSocialAndFund',
          edit: 'hrSocial/tdispatchinfo/updateSocialAndFund',
          sysBaseSetByEntityUrl: 'hrSocial/sysbasesetinfo/getSysBaseSetByEntity'
        },

        //新增字段
        isPaymentType:true,     // 缴纳类型能否被选中
        dateCanBeSelected:true,   //日期能否被选中
        recordBaseRule:{rules:[
          {required:true,message:'请输入缴纳基数'},
          {min:1, max:255,message:'备案基数应该在255个字符内'},
          {pattern: /((^[1-9]\d*)|^0)(\.\d{1,2})?$/,message: '格式不正确!'}
        ]},
        illness:false // 大病是否可编辑
      }
    },
    methods: {
      // recordBaseRuleValidator(rule, value,callback){
      //   if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
      //     callback('输入合法值！')
      //     return false
      //   }
      //   return true
      // },
      getTotal(value,percentNumber){
        return this.formatMoneyData(this.socialForm.getFieldValue(value)*this.socialForm.getFieldValue(percentNumber)/100,this.socialMoneyType)
      },
      handleSelectPayTypeChange(value){
        // 最低基数和最高基数
        const lowestValue=this.socialForm.getFieldValue('lowerLimit')
        const highestValue=this.socialForm.getFieldValue('upperLimit')
        if(value === '1'){
          this.socialDataIsDisabled=false
          this.illness = true
        }else if(value === '2'){
          this.socialDataIsDisabled=true
          this.illness = false
          this.socialForm.setFieldsValue({
            unitPensionCardinal:highestValue,
            unitMedicalCardinal:highestValue,
            unitUnemploymentCardinal:highestValue,
            unitWorkInjuryCardinal:highestValue,
            unitBirthCardinal:highestValue,
            personalPensionCardinal:highestValue,
            personalMedicalCardinal:highestValue,
            personalUnemploymentCardinal:highestValue,
          })
          // 单位大病  个人大病
          if(this.socialValueType){
            this.socialForm.setFieldsValue({
              personalBigailmentCardinal:highestValue,
              unitBigailmentCardinal:highestValue,
            })
          }
        }else {
          this.illness = false
          this.socialDataIsDisabled=true
          this.socialForm.setFieldsValue({
            unitPensionCardinal:lowestValue,
            unitMedicalCardinal:lowestValue,
            unitUnemploymentCardinal:lowestValue,
            unitWorkInjuryCardinal:lowestValue,
            unitBirthCardinal:lowestValue,
            personalPensionCardinal:lowestValue,
            personalMedicalCardinal:lowestValue,
            personalUnemploymentCardinal:lowestValue,
          })
          if(this.socialValueType){
            this.socialForm.setFieldsValue({
              personalBigailmentCardinal:lowestValue,
              unitBigailmentCardinal:lowestValue,
            })
          }
        }
        if(value !== '1'){
          this.socialForm.setFieldsValue({
              unitPensionPer:this.model.unitPensionPer,
              unitMedicalPer:this.model.unitMedicalPer,
              unitUnemploymentPer:this.model.unitUnemploymentPer,
              unitWorkUnjuryPer:this.model.unitWorkUnjuryPer,
              unitBirthPer:this.model.unitBirthPer,
              personalPensionPer:this.model.personalPensionPer,
              personalMedicalPer:this.model.personalMedicalPer,
              personalUnemploymentPer:this.model.personalUnemploymentPer,
            })
        }
        // 计算相应的金额
        this.socialForm.setFieldsValue({
            unitPersionMoney:this.getTotal('unitPensionCardinal','unitPensionPer'),
            unitMedicalMoney:this.getTotal('unitMedicalCardinal','unitMedicalPer'),
            unitUnemploymentMoney:this.getTotal('unitUnemploymentCardinal','unitUnemploymentPer'),
            unitInjuryMoney:this.getTotal('unitWorkInjuryCardinal','unitWorkUnjuryPer'),
            unitBirthMoney:this.getTotal('unitBirthCardinal','unitBirthPer'),
            personalPersionMoney:this.getTotal('personalPensionCardinal','personalPensionPer'),
            personalMedicalMoney:this.getTotal('personalMedicalCardinal','personalMedicalPer'),
            personalUnemploymentMoney:this.getTotal('personalUnemploymentCardinal','personalUnemploymentPer'),
        })
        if(this.socialValueType){
           this.socialForm.setFieldsValue({
              personalBigailmentPer:this.model.personalBigailmentPer,
              unitBigailmentPer:this.model.unitBigailmentPer,

            })
          this.socialForm.setFieldsValue({
            personalBigailmentMoney:this.getTotal('personalBigailmentCardinal','personalBigailmentPer'),
            unitBigailmentMoney:this.getTotal('unitBigailmentCardinal','unitBigailmentPer'),
          })
        }
      },
      edit(record) {
        this.initDictConfig() // 字典数据
        this.fundForm.resetFields()
        this.socialForm.resetFields()
        this.employeeForm.resetFields()
        this.socialHouseholdOptions = this.fundHouseholdOptions = this.houseHolds
        if (record.employeeInfo) {  // 编辑的时候
          this.allowClear = false // 编辑的时候不支持清除功能
          this.model = Object.assign({}, record.employeeInfo)
        } else {  // 新增的时候
          this.model = Object.assign({}, record)
        }
        this.visible = true
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
        if (record.employeeInfo) {  // 编辑的时候
          let socialInfoData = record.socialInfo
          if (!socialInfoData) {  // 无社保
            if (!this.fundExist) {
              this.socialInfoShow = false
            }
          } else {
            if (!this.socialExist) {  // 编辑的时候
              this.socialIsDisabled = false // 社保户未选择地址与日期可选
              this.socialDataIsDisabled = false // 社保起缴日期未选择表单数据可选
            } else {
              this.socialHouseholdOptions = this.selectHouseholdOptions
            }
            this.validatorSocialRules.socialHousehold = { rules: [{ required: true, message: '请选择社保户！' }, { validator: this.validateSocialHousehold }] }
            this.validatorSocialRules.socialProvince.rules[0] = { required: true, message: '选择省份！' }
            this.validatorSocialRules.socialCity.rules[0] = { required: true, message: '选择城市！' }
            this.validatorSocialRules.socialStartDate.rules[0] = { required: true, message: '请选择社保起缴日期！' }
            this.model.socialHousehold = (JSON.stringify(this.socialHouseholdOptions).indexOf(JSON.stringify(socialInfoData.socialHousehold)) != -1) ? socialInfoData.socialHousehold : [] // 社保户
            this.model.socialProvince = socialInfoData.socialProvince  // 社保地-省
            this.model.socialCity = socialInfoData.socialCity  // 社保地-市
            this.model.socialTown = socialInfoData.socialTown    // 社保地-区
            this.model.socialStartDate = moment(socialInfoData.socialStartDate, this.dateFormat) // 社保起缴日期
            // 基数配置查询
            httpAction(`${this.url.sysBaseSetByEntityUrl}?id=${socialInfoData.cardinalIid}`, '', 'GET').then((res) => {
              if (Number(res.code) === 200) {
                if (res.data.length > 0) {
                  let typeOfInsuranceCheckedList = [] // 险种选取
                  let socialSysBaseSetByEntityData = this.sysBaseSetByEntityOfSocial = res.data[0] // 默认取第一条数据
                  this.model.lowerLimit = socialSysBaseSetByEntityData.lowerLimit    // 社保基数下限
                  this.model.upperLimit = socialSysBaseSetByEntityData.upperLimit    // 社保基数上限
                  if (socialSysBaseSetByEntityData.canOverpay == 0) {  // 是否可补缴社保
                    this.model.socialOverpayNumber = socialInfoData.overpayNumber + ''   // 补缴期限
                    this.model.socialHaveThisMonth = socialInfoData.haveThisMonth    // 是否含当月
                    this.model.insuranceIsLatestCardinalityOfSocial = socialInfoData.insuranceIsLatestCardinality    // 补缴采用最新基数
                    if (String(socialInfoData.insurancePension) === '0') { // 是否能补缴养老0是1否
                      typeOfInsuranceCheckedList.push('insurancePension')
                    }
                    if (String(socialInfoData.insuranceMedical) === '0') { // 是否能补缴医疗0是1否
                      typeOfInsuranceCheckedList.push('insuranceMedical')
                    }
                    if (String(socialInfoData.insuranceUnemployment) === '0') { // 是否能补缴失业0是1否
                      typeOfInsuranceCheckedList.push('insuranceUnemployment')
                    }
                    if (String(socialInfoData.insuranceInjury) === '0') { // 是否能补缴工伤0是1否
                      typeOfInsuranceCheckedList.push('insuranceInjury')
                    }
                    if (String(socialInfoData.insuranceBirth) === '0') { // 是否能补缴生育0是1否
                      typeOfInsuranceCheckedList.push('insuranceBirth')
                    }
                    if (String(socialInfoData.insuranceBigailment) === '0') { // 是否能补缴大病0是1否
                      typeOfInsuranceCheckedList.push('insuranceBigailment')
                    }
                    this.model.typeOfInsurance = typeOfInsuranceCheckedList
                    this.model.socialPayPolicy = socialSysBaseSetByEntityData.payPolicy // 社保补缴政策
                  } else {
                    this.socialCanOverpay = false
                  }
                  if (String(socialSysBaseSetByEntityData.isIllness) === '0') { // 大病
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
                  
                  if (socialSysBaseSetByEntityData.isIllness == 0) { // 大病
                    if (socialSysBaseSetByEntityData.valueType != 0) {  // 大病定值的时候
                      this.model.unitBigailmentCardinal = socialInfoData.unitBigailmentCardinal ? socialInfoData.unitBigailmentCardinal : ''  // 单位大病
                      this.model.unitBigailmentPer = socialInfoData.unitBigailmentPer ? socialInfoData.unitBigailmentPer : ''
                    }

                    this.model.unitBigailmentMoney = socialInfoData.unitBigailmentMoney ? socialInfoData.unitBigailmentMoney : ''
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

                  if (socialSysBaseSetByEntityData.isIllness == 0 && this.isChargePersonalStatus) { // 大病&&入职缴费
                    if (socialSysBaseSetByEntityData.valueType != 0) {  // 大病定值的时候
                      this.model.personalBigailmentCardinal = socialInfoData.personalBigailmentCardinal // 个人大病（基数）
                      this.model.personalBigailmentPer = socialInfoData.personalBigailmentPer // 个人大病（比例）
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
                    this.socialForm.setFieldsValue(pick(this.model, 'socialHousehold', 'socialProvince', 'socialCity', 'socialTown', 'socialStartDate', 'lowerLimit', 'upperLimit', 'socialOverpayNumber', 'socialHaveThisMonth',
                    'insuranceIsLatestCardinalityOfSocial', 'typeOfInsurance', 'socialPayPolicy', 'isChargePersonal','collectType', 'valueType', 'collectMoth',
                    'unitPensionCardinal', 'unitMedicalCardinal', 'unitUnemploymentCardinal', 'unitWorkInjuryCardinal', 'unitBirthCardinal', 'unitBigailmentCardinal', 'personalPensionCardinal', 'personalMedicalCardinal', 'personalUnemploymentCardinal', 
                    'unitPensionPer', 'unitMedicalPer', 'unitUnemploymentPer', 'unitWorkUnjuryPer', 'unitBirthPer', 'unitBigailmentPer', 'personalPensionPer', 'personalMedicalPer', 'personalUnemploymentPer', 
                    'unitPersionMoney', 'unitMedicalMoney', 'unitUnemploymentMoney', 'unitInjuryMoney', 'unitBirthMoney', 'unitBigailmentMoney', 'personalPersionMoney', 'personalMedicalMoney', 'personalUnemploymentMoney'))
                    
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
            if (!this.socialExist) {
              this.fundInfoShow = false
            }
          } else {
            if ((!socialInfoData) && (!this.fundExist)) { // 无社保
              this.offset.offsetThree = [174, 0]
            }

            if (!this.fundExist) {  // 编辑的时候
              this.fundIsDisabled = false // 公积金户未选择地址与日期可选
              this.fundDataIsDisabled = false // 公积金起缴日期未选择表单数据可选
            } else {
              this.fundHouseholdOptions = this.selectHouseholdOptions
            }
            
            this.validatorFundRules.fundHousehold = { rules: [{ required: true, message: '请选择公积金户！' }, { validator: this.validateFundHousehold }] }
            this.validatorFundRules.fundProvince.rules[0] = { required: true, message: '选择省份！' }
            this.validatorFundRules.fundStartDate.rules[0] = { required: true, message: '请选择公积金起缴日期！' }
            this.model.fundHousehold = (JSON.stringify(this.fundHouseholdOptions).indexOf(JSON.stringify(fundInfoData.providentHousehold)) != -1) ? fundInfoData.providentHousehold : [] // 公积金户
            this.model.fundProvince = fundInfoData.fundProvince  // 公积金地-省
            this.model.fundCity = fundInfoData.fundCity  // 公积金地-市
            this.model.fundTown = fundInfoData.fundTown    // 公积金地-区
            this.model.fundStartDate = moment(fundInfoData.providentStart, this.dateFormat) // 公积金起缴日期
            // 基数配置查询
            httpAction(`${this.url.sysBaseSetByEntityUrl}?id=${fundInfoData.fundBaseSetId}`, '', 'GET').then((res) => {
              if (res.code === 200) {
                if (res.data.length > 0) {
                  let fundSysBaseSetByEntityData = this.sysBaseSetByEntityOfFund = res.data[0] // 默认取第一条数据
                  this.model.fundPayLowerLimit = fundSysBaseSetByEntityData.lowerLimit    // 公积金基数下限
                  this.model.fundPayUpperLimit = fundSysBaseSetByEntityData.upperLimit    // 公积金基数上限
                  this.model.fundPayPoint = fundSysBaseSetByEntityData.fundPayPoint + ''    // 公积金单边小数点
                  this.fundProvidentPer = fundSysBaseSetByEntityData.fundProList // 公积金比例
                  if (fundSysBaseSetByEntityData.canOverpay == 0) {  // 是否可补缴公积金
                    this.model.insuranceIsLatestCardinalityOfFund = fundSysBaseSetByEntityData.insuranceIsLatestCardinality    // 补缴采用最新基数
                    this.model.fundOverpayNumber = fundSysBaseSetByEntityData.overpayNumber + ''    // 补缴期限
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
        }
      },
      // 验证社保表单
      validateSocialForm(socialHouseholdId){
        const _this = this
        return new Promise((resolve,reject)=>{
          if(socialHouseholdId){
            _this.socialForm.validateFields((err, values) => {
              if(err){
                _this.offsetStatus.offsetTwo = true
                if(values.paymentType==='1') {
                  _this.socialDataIsDisabled=false // 自定义缴纳类型的时候，让社保部分可以编辑
                }
                reject(err)
              }else{
                _this.offsetStatus.offsetTwo == false
                resolve(values)
              }
            })
          }else{
            _this.offsetStatus.offsetTwo == false
            resolve()
          }
        })
      },
      // 验证公积金表单
      validateFundForm(fundHousehold){
        const _this = this
        return new Promise((resolve,reject)=>{
          if(fundHousehold){
            _this.fundForm.validateFields((err, values) => {
              if(err){
                _this.offsetStatus.offsetThree = true
                reject(err)
              }else{
                _this.offsetStatus.offsetThree = false
                resolve(values)
              }
            })
          }else{
            _this.offsetStatus.offsetThree = false
            resolve()
          }
        })
      },

      // 保存按钮
      handleOk() {
        const that = this
        let socialHouseholdId = this.socialForm.getFieldValue('socialHousehold')
        let fundHousehold = this.fundForm.getFieldValue('fundHousehold')

        if (socialHouseholdId == undefined && fundHousehold == undefined) {
          that.$message.error('社保、公积金表单数据不能全为空！')
          this.activeKey = '2'
          return
        }
        if (this.socialExist) {
          socialHouseholdId = undefined
          if (fundHousehold == undefined) {
            that.$message.error('公积金表单数据不能为空！')
            return
          }
        }
        if (this.fundExist) {
          fundHousehold = undefined
          if (socialHouseholdId == undefined) {
            that.$message.error('社保表单数据不能为空！')
            return
          }
        }
        // 编辑状态
        if (this.recordInfo.employeeInfo && this.okStatusOfSubmit == 0) {
          this.okStatusOfSubmit = this.okStatusOfFund = this.okStatusOfSocial = 1
        }
        let tSocialInfo = {}  // 派单新增社保数据
        let tProvidentFund = {}  // 派单新增公积金数据
        
        Promise.all([this.validateSocialForm(socialHouseholdId),this.validateFundForm(fundHousehold)]).then(arr=>{
          // 社保表单
          if(arr[0]){
            const formData = Object.assign(that.model, arr[0])
            tSocialInfo.empId = formData.id // 员工ID
            tSocialInfo.socialHousehold = formData.socialHousehold // 社保户ID
            tSocialInfo.cardinalIid = that.sysBaseSetByEntityOfSocial.id  // 社保基数配置ID
            if (Array.isArray(formData.socialCity)) {
              formData.socialCity = null
            }
            if (Array.isArray(formData.socialTown)) {
              formData.socialTown = null
            }
            tSocialInfo.socialProvince = formData.socialProvince  // 社保地-省
            tSocialInfo.socialCity = formData.socialCity  // 社保地-市
            tSocialInfo.socialTown = formData.socialTown    // 社保地-区
            if(Array.isArray(formData.socialProvince)){
              that.offsetStatus.offsetTwo = true
              that.$message.error('请选择省份')
              return ;
            }
            if(Array.isArray(arr[0].socialCity)){
              that.offsetStatus.offsetTwo = true
              that.$message.error('请选择城市')
              return ;
            }
            if(!arr[0].socialStartDate) {
              that.offsetStatus.offsetTwo = true
              that.$message.error('请输入合法日期')
              return ;
            }
            tSocialInfo.socialStartDate = `${formData.socialStartDate.format(that.dateFormat)}-01 00:00:00` // 社保起缴日期

            //tSocialInfo.lowerLimit = formData.lowerLimit    // 社保基数下限
            //tSocialInfo.upperLimit = formData.upperLimit    // 社保基数上限
            tSocialInfo.canOverpay = that.sysBaseSetByEntityOfSocial.canOverpay    // 社保是否可补缴
            
            if (that.socialCanOverpay) {  // 社保是否可补缴
              tSocialInfo.overpayNumber = formData.socialOverpayNumber    // 补缴期限
              tSocialInfo.haveThisMonth = formData.socialHaveThisMonth    // 是否含当月
              tSocialInfo.insuranceIsLatestCardinality = formData.insuranceIsLatestCardinalityOfSocial    // 补缴采用最新基数
              tSocialInfo.insurancePension = formData.typeOfInsurance.indexOf("insurancePension") != -1 ? 0 : 1  // 补缴险种（养老）
              tSocialInfo.insuranceMedical = formData.typeOfInsurance.indexOf("insuranceMedical") != -1 ? 0 : 1  // 补缴险种（医疗）
              tSocialInfo.insuranceUnemployment = formData.typeOfInsurance.indexOf("insuranceUnemployment") != -1 ? 0 : 1  // 补缴险种（失业）
              tSocialInfo.insuranceInjury = formData.typeOfInsurance.indexOf("insuranceInjury") != -1 ? 0 : 1  // 补缴险种（工伤）
              tSocialInfo.insuranceBirth = formData.typeOfInsurance.indexOf("insuranceBirth") != -1 ? 0 : 1  // 补缴险种（生育）
              tSocialInfo.insuranceBigailment = formData.typeOfInsurance.indexOf("insuranceBigailment") != -1 ? 0 : 1  // 补缴险种（大病）
              //tSocialInfo.socialPayPolicy = formData.socialPayPolicy    // 社保补缴政策
            }

            if (that.socialIsIllness) { // 大病
              tSocialInfo.isChargePersonal = formData.isChargePersonal    // 新员工入职收费
              tSocialInfo.collectType = formData.collectType    // 大病救助缴纳周期
              tSocialInfo.valueType = formData.valueType    // 缴纳方式
              
              if (that.collectMothShow) {
                tSocialInfo.collectMoth = formData.collectMoth    // 缴纳月份
              }
            }
            
            tSocialInfo.unitPensionCardinal = formData.unitPensionCardinal    // 单位养老
            tSocialInfo.unitPensionPer = formData.unitPensionPer
            tSocialInfo.unitPersionMoney = formData.unitPersionMoney
            tSocialInfo.unitMedicalCardinal = formData.unitMedicalCardinal    // 单位医疗
            tSocialInfo.unitMedicalPer = formData.unitMedicalPer
            tSocialInfo.unitMedicalMoney = formData.unitMedicalMoney
            tSocialInfo.unitUnemploymentCardinal = formData.unitUnemploymentCardinal    // 单位失业
            tSocialInfo.unitUnemploymentPer = formData.unitUnemploymentPer
            tSocialInfo.unitUnemploymentMoney = formData.unitUnemploymentMoney
            tSocialInfo.unitWorkInjuryCardinal = formData.unitWorkInjuryCardinal    // 单位工伤
            tSocialInfo.unitWorkUnjuryPer = formData.unitWorkUnjuryPer
            tSocialInfo.unitInjuryMoney = formData.unitInjuryMoney
            tSocialInfo.unitBirthCardinal = formData.unitBirthCardinal    // 单位生育
            tSocialInfo.unitBirthPer = formData.unitBirthPer
            tSocialInfo.unitBirthMoney = formData.unitBirthMoney

            tSocialInfo.isIllness = formData.isIllness
            if (that.socialIsIllness) { // 单位大病
              if (that.socialValueType) {
                tSocialInfo.unitBigailmentCardinal = formData.unitBigailmentCardinal
                tSocialInfo.unitBigailmentPer = formData.unitBigailmentPer
              }
              tSocialInfo.unitBigailmentMoney = formData.unitBigailmentMoney
            }
            if(this.illness){
              tSocialInfo.bigailmentVaryFlag = 1
            }
            tSocialInfo.personalPensionCardinal = formData.personalPensionCardinal    // 个人养老
            tSocialInfo.personalPensionPer = formData.personalPensionPer
            tSocialInfo.personalPersionMoney = formData.personalPersionMoney
            tSocialInfo.personalMedicalCardinal = formData.personalMedicalCardinal    // 个人医疗
            tSocialInfo.personalMedicalPer = formData.personalMedicalPer
            tSocialInfo.personalMedicalMoney = formData.personalMedicalMoney
            tSocialInfo.personalUnemploymentCardinal = formData.personalUnemploymentCardinal    // 个人失业
            tSocialInfo.personalUnemploymentPer = formData.personalUnemploymentPer
            tSocialInfo.personalUnemploymentMoney = formData.personalUnemploymentMoney
            tSocialInfo.trustRemark = formData.trustRemark
            // 新增缴纳类型，备案基数
            tSocialInfo.paymentType = formData.paymentType
            tSocialInfo.recordBase = formData.recordBase
            if (that.socialIsIllness) { // 个人大病
              if (that.socialValueType) {
                tSocialInfo.personalBigailmentCardinal = formData.personalBigailmentCardinal
                tSocialInfo.personalBigailmentPer = formData.personalBigailmentPer
              }
              tSocialInfo.personalBigailmentMoney = formData.personalBigailmentMoney
            }
            // 编辑状态（赋值上ID）
            if (that.recordInfo.employeeInfo && !that.fundExist) {
              tSocialInfo.id = that.recordInfo.socialInfo.id
            }
          }
          if(arr[1]){
            let formData = Object.assign(this.model, arr[1])
            tProvidentFund.empId = formData.id // 员工ID
            tProvidentFund.providentHousehold = formData.fundHousehold // 公积金户ID
            tProvidentFund.fundBaseSetId = this.sysBaseSetByEntityOfFund.id  // 公积金基数配置ID
            if (Array.isArray(formData.fundCity)) {
              formData.fundCity = null
            }
            if (Array.isArray(formData.fundTown)) {
              formData.fundTown = null
            }
            tProvidentFund.fundProvince = formData.fundProvince  // 公积金地-省
            tProvidentFund.fundCity = formData.fundCity  // 公积金地-市
            tProvidentFund.fundTown = formData.fundTown    // 公积金地-区
            tProvidentFund.providentStart = formData.fundStartDate.format(this.dateFormat) + '-01 00:00:00'  // 公积金起缴日期
            //tProvidentFund.fundPayLowerLimit = formData.fundPayLowerLimit    // 公积金基数下限
            //tProvidentFund.fundPayUpperLimit = formData.fundPayUpperLimit    // 公积金基数上限
            tProvidentFund.fundPayPoint = formData.fundPayPoint    // 公积金单边小数点
            tProvidentFund.canOverpay = this.sysBaseSetByEntityOfFund.canOverpay    // 公积金是否可补缴

            if (this.fundCanOverpay) {
              tProvidentFund.insuranceIsLatestCardinality = formData.insuranceIsLatestCardinalityOfFund    // 补缴采用最新基数
              tProvidentFund.overpayNumber = formData.fundOverpayNumber    // 补缴期限
              tProvidentFund.haveThisMonth = formData.fundHaveThisMonth    // 是否含当月
              //tProvidentFund.fundPayPolicy = formData.fundPayPolicy    // 公积金补缴政策
            }
            tProvidentFund.unitProvidengCardinal = formData.unitProvidengCardinal    // 单位公积金
            tProvidentFund.unitProvidentPer = formData.unitProvidentPer
            tProvidentFund.unitProvidentFee = formData.unitProvidentFee
            tProvidentFund.personalProvidentCardinal = formData.personalProvidentCardinal    // 个人公积金
            tProvidentFund.personalProvidentPer = formData.personalProvidentPer
            tProvidentFund.personalProvidentFee = formData.personalProvidentFee
            tProvidentFund.trustRemark = formData.trustRemark
            // 编辑状态（赋值上ID）
            if (this.recordInfo.employeeInfo && !this.socialExist) {
              tProvidentFund.id = this.recordInfo.fund.id
            }
          }
          that.confirmLoading = true
          let httpurl = ''
          if (that.recordInfo.employeeInfo && !that.socialExist && !that.fundExist) { // 编辑
            httpurl += that.url.edit
          } else {  // 添加
            httpurl += that.url.add
          }
          let method = 'post'
          let requestData = {'tSocialInfo': JSON.stringify(tSocialInfo), 'tProvidentFund': JSON.stringify(tProvidentFund)}
          httpAction(httpurl, requestData, method).then((res) => {
            let msg = res.message || res.msg
            if (res.code === 200) {
              if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                that.$refs.errorModal.title = `增加派单提示: ${msg}`
                that.$refs.errorModal.message = msg
                that.$refs.errorModal.showModal(res.errorMessageList)
              } else {
                that.$emit('ok')
                that.close()
                that.$message.success(`${that.title}成功！`)
              }
            } else {
              if (res.data != null && res.data.length > 0) {
                that.$refs.errorModal.title = `增加派单提示: ${msg}`
                that.$refs.errorModal.message = msg
                that.$refs.errorModal.showModal(res.data)
              } else if(res.errorMessageList != null && res.errorMessageList.length > 0) {
                that.$refs.errorModal.title = `增加派单提示: ${msg}`
                that.$refs.errorModal.message = msg
                that.$refs.errorModal.showModal(res.errorMessageList)
              } else {
                that.$message.error(msg)
              }
            }
          }).finally(() => {
            that.confirmLoading = false
          })

        }).catch((err)=>{
          console.log(err)
        })

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
        this.submit = true  // 是否提交
        this.visible = false
        this.allowClear = true // 是否支持清除功能
        this.activeKey = '1'  //默认第一个tab
        this.okStatusOfFund = 0  // 记录第几次点击提交按钮（0为初始，1为提交按钮点击【变化条件是0->1】，2为选择选择社保户或者公积金户【变化条件无】）
        this.okStatusOfSubmit = 0  // 记录第几次点击提交按钮（0为初始，1为提交按钮点击【变化条件是0->1】，2为选择选择社保户或者公积金户【变化条件无】）
        this.okStatusOfSocial = 0  // 记录第几次点击提交按钮（0为初始，1为提交按钮点击【变化条件是0->1】，2为选择选择社保户或者公积金户【变化条件无】）
        this.records = {} // 派单数据
        this.recordInfo = {}  // 编辑数据
        this.confirmLoading = false
        this.offsetStatus = {'offsetOne': false, 'offsetTwo': false, 'offsetThree': false}
        this.offset = {'offsetOne': [66, 0], 'offsetTwo': [158, 0], 'offsetThree': [264, 0]}
        this.houseHolds = [] // 社保户、公积金户
        this.AreaTrees = [] // 所有地区
        this.fundExist = false // 公积金数据是否已经存在
        this.socialExist = false // 社保数据是否已经存在
        this.socialInfoShow = true // 社保数据是否显示
        this.fundInfoShow = true // 公积金数据是否显示
        this.fundAreaCitys = []  // 公积金城市
        this.fundAreaTowns = []  // 公积金区县
        this.socialAreaCitys = []  // 社保城市
        this.socialAreaTowns = []  // 社保区县
        this.fundCanOverpay = true // 公积金是否可补缴
        this.socialCanOverpay = true // 社保是否可补缴
        this.socialIsIllness = true // 是否可大病
        this.collectMothShow = true  // 缴纳月份是否显示
        this.socialValueType = true  // 大病按定值不显示
        this.isChargePersonalStatus = true // 新员工是否缴费
        this.sysBaseSetByEntityOfFund = [] // 公积金户选择数据
        this.sysBaseSetByEntityOfSocial = [] // 社保户选择数据
        this.fundProvidentPer = [] // 公积金比例
        this.fundIsDisabled = true // 公积金户未选择地址与日期不可选
        this.socialIsDisabled = true // 社保户未选择地址与日期不可选
        this.fundDataIsDisabled = true // 公积金起缴日期未选择表单数据不可选
        this.socialDataIsDisabled = true // 社保起缴日期未选择表单数据不可选
        this.selectHouseholdOptions = [] // 社保户、公积金户（已选择的）
        // 社保数据校验
        this.validatorSocialRules = {
          socialHousehold: { rules: [{ validator: this.validateSocialHousehold }] },
          socialProvince: { rules: [] },
          socialCity: { rules: [] },
          socialStartDate: { rules: [] },
        }
        // 公积金数据校验
        this.validatorFundRules = {
          fundHousehold: { rules: [{ validator: this.validateFundHousehold }] },
          fundProvince: { rules: [] },
          fundStartDate: { rules: [] },
        }
        this.isPaymentType=true     // 缴纳类型能否被选中
        this.dateCanBeSelected=true   //日期能否被选中
      },
      // 社保缴纳地省份切换
      handleSocialProvinceChange(value) {
        let socialHousehold = this.socialForm.getFieldValue('socialHousehold')
        this.socialAreaCitys = []
        this.socialAreaTowns = []
        for (const c of this.AreaTrees[value - 1].children) {
          this.socialAreaCitys.push(c)
        }
        this.model.socialCity = []
        this.model.socialTown = []
        this.model.socialStartDate = null
        this.$nextTick(() => {
          this.socialForm.setFieldsValue(pick(this.model, 'socialCity', 'socialTown', 'socialStartDate'))
        })

        // 执行请求拉取配置数据
        this.handleGetSysBaseSetByEntityOfSocial(socialHousehold, value, null, null, moment().format('YYYY-MM-DD HH:mm:ss'))
      },
      // 社保缴纳地城市切换
      handleSocialCityChange(value) {
        let socialHousehold = this.socialForm.getFieldValue('socialHousehold')
        this.socialAreaTowns = []
        for (const c of this.socialAreaCitys) {
          if (String(c.id) === String(value)) {
            if (c.children.length > 0) {
              for (const t of c.children) {
                this.socialAreaTowns.push(t)
              }
            }
          break
          }
        }
        this.model.socialTown = []
        this.model.socialStartDate = null
        this.$nextTick(() => {
          this.socialForm.setFieldsValue(pick(this.model, 'socialTown', 'socialStartDate'))
        })
        this.socialForm.setFieldsValue({
            paymentType:'0'
          })
        // 执行请求拉取配置数据
        this.handleGetSysBaseSetByEntityOfSocial(socialHousehold, this.socialForm.getFieldValue('socialProvince'), value, null, moment().format('YYYY-MM-DD HH:mm:ss'))
      },
      // 社保缴纳地区县切换
      handleSocialTownChange(value) {
        let socialHousehold = this.socialForm.getFieldValue('socialHousehold')

        // 执行请求拉取配置数据
        this.handleGetSysBaseSetByEntityOfSocial(socialHousehold, this.socialForm.getFieldValue('socialProvince'), this.socialForm.getFieldValue('socialCity'), value, moment().format('YYYY-MM-DD HH:mm:ss'))
      },
      // 社保查询基数配置 
      handleGetSysBaseSetByEntityOfSocial(socialHousehold, socialProvince, socialCity, socialTown, nowTime) {
        this.model.socialStartDate = null
        console.log('change the city');
        this.$nextTick(() => {
          this.socialForm.setFieldsValue(pick(this.model, 'socialStartDate'))
        })
        if (socialHousehold && socialProvince && nowTime) {
          let httpurl = 'hrSocial/sysbasesetinfo/getSysBaseSetByEntity'
          httpurl += `?deleteFlag=0&baseType=0&status=0&departId=${socialHousehold}&province=${socialProvince}&applyStartDate=${nowTime}`
          if (socialCity) { // 有城市
            httpurl += `&city=${socialCity}`
            if (socialTown) {  // 有县区
              httpurl += `&town=${socialTown}`
            }
          }
          // 基数配置查询
          httpAction(httpurl, '', 'GET').then((res) => {
            if (res.code === 200) {
              if (res.data.length > 0) {
                this.socialDataIsDisabled = true // 表单数据改为不可修改 2020.10.13
                let typeOfInsuranceCheckedList = [] // 险种选取
                let socialSysBaseSetByEntityData = this.sysBaseSetByEntityOfSocial = res.data[0] // 默认取第一条数据
                this.socialCanOverpay = (socialSysBaseSetByEntityData.canOverpay == 0) ? true : false // 社保是否可补缴
                this.socialIsIllness = (socialSysBaseSetByEntityData.isIllness == 0) ? true : false // 是否可大病
                this.isChargePersonalStatus = (socialSysBaseSetByEntityData.isChargePersonal == 0) ? true : false // 是否新员工入职缴费
                this.model.lowerLimit = socialSysBaseSetByEntityData.lowerLimit // 社保基数下限
                this.model.upperLimit = socialSysBaseSetByEntityData.upperLimit // 社保基数上限
                this.model.isIllness = socialSysBaseSetByEntityData.isIllness // 是否收取大病
                this.dateCanBeSelected = false
                if (this.socialCanOverpay) { // 社保是否可补缴
                  this.model.socialOverpayNumber = socialSysBaseSetByEntityData.overpayNumber + '' // 补缴期限
                  this.model.socialHaveThisMonth = socialSysBaseSetByEntityData.haveThisMonth // 是否含当月
                  this.model.insuranceIsLatestCardinalityOfSocial = socialSysBaseSetByEntityData.insuranceIsLatestCardinality // 补缴最新基数
                  if (socialSysBaseSetByEntityData.insurancePension == 0) { // 是否能补缴养老0是1否
                    typeOfInsuranceCheckedList.push('insurancePension')
                  }
                  if (socialSysBaseSetByEntityData.insuranceMedical == 0) { // 是否能补缴医疗0是1否
                    typeOfInsuranceCheckedList.push('insuranceMedical')
                  }

                  if (socialSysBaseSetByEntityData.insuranceUnemployment == 0) { // 是否能补缴失业0是1否
                    typeOfInsuranceCheckedList.push('insuranceUnemployment')
                  }

                  if (socialSysBaseSetByEntityData.insuranceInjury == 0) { // 是否能补缴工伤0是1否
                    typeOfInsuranceCheckedList.push('insuranceInjury')
                  }

                  if (socialSysBaseSetByEntityData.insuranceBirth == 0) { // 是否能补缴生育0是1否
                    typeOfInsuranceCheckedList.push('insuranceBirth')
                  }

                  if (socialSysBaseSetByEntityData.insuranceBigailment == 0) { // 是否能补缴大病0是1否
                    typeOfInsuranceCheckedList.push('insuranceBigailment')
                  }

                  this.model.typeOfInsurance = typeOfInsuranceCheckedList
                  this.model.socialPayPolicy = socialSysBaseSetByEntityData.payPolicy // 社保补缴政策
                }

                if (this.socialIsIllness) { // 是否可大病
                  this.model.isChargePersonal = socialSysBaseSetByEntityData.isChargePersonal // 大病救助缴纳周期
                  this.model.collectType = socialSysBaseSetByEntityData.collectType // 大病救助缴纳周期
                  this.model.valueType = socialSysBaseSetByEntityData.valueType // 大病缴纳方式
                  
                  if (socialSysBaseSetByEntityData.collectType == 1) {  // 月份时候缴纳月份不显示
                    this.collectMothShow = false
                  } else {
                    this.collectMothShow = true
                    this.model.collectMoth = socialSysBaseSetByEntityData.collectMoth + ''// 大病缴纳月份
                  }

                  if (socialSysBaseSetByEntityData.valueType == 0) {  // 大病定值的时候
                    this.socialValueType = false
                  } else {
                    this.socialValueType = true
                  }
                }
                
                // 取基数下限
                this.model.unitPensionCardinal = this.model.unitMedicalCardinal = this.model.unitUnemploymentCardinal = this.model.unitWorkInjuryCardinal = this.model.unitBirthCardinal = this.model.lowerLimit
                this.model.personalPensionCardinal = this.model.personalMedicalCardinal = this.model.personalUnemploymentCardinal = this.model.lowerLimit
                
                if (this.socialIsIllness) {
                  if (socialSysBaseSetByEntityData.valueType != 0) {  // 大病定值的时候
                    this.model.unitBigailmentCardinal = this.model.personalBigailmentCardinal = this.model.lowerLimit
                    
                    if (this.isChargePersonalStatus) {  // 新员工缴费
                      this.$nextTick(() => {
                        this.socialForm.setFieldsValue(pick(this.model, 'personalBigailmentCardinal'))
                      })
                    }
                    
                    this.$nextTick(() => {
                      this.socialForm.setFieldsValue(pick(this.model, 'unitBigailmentCardinal'))
                    })
                  }
                }

                // 取比例
                this.model.unitPensionPer = socialSysBaseSetByEntityData.unitPersionPro // 单位养老比例
                this.model.unitMedicalPer = socialSysBaseSetByEntityData.unitMedicalPro // 单位医疗比例
                this.model.unitUnemploymentPer = socialSysBaseSetByEntityData.unitUnemploymentPro // 单位失业比例
                this.model.unitWorkUnjuryPer = socialSysBaseSetByEntityData.unitInjuryPro // 单位工伤比例
                this.model.unitBirthPer = socialSysBaseSetByEntityData.unitBirthPro // 单位生育比例
                this.model.personalPensionPer = socialSysBaseSetByEntityData.personalPersionPro // 个人养老比例
                this.model.personalMedicalPer = socialSysBaseSetByEntityData.personalMedicalPro // 个人医疗比例
                this.model.personalUnemploymentPer = socialSysBaseSetByEntityData.personalUnemploymentPro // 个人失业比例                  

                if (this.socialIsIllness) {
                  if (socialSysBaseSetByEntityData.valueType != 0) {  // 大病定值的时候
                    this.model.unitBigailmentPer = socialSysBaseSetByEntityData.payCompanyPro // 单位大病比例
                    this.model.personalBigailmentPer = socialSysBaseSetByEntityData.payPersonalPro // 个人大病比例
                    
                    if (this.isChargePersonalStatus) {  // 新员工缴费
                      this.$nextTick(() => {
                        this.socialForm.setFieldsValue(pick(this.model, 'personalBigailmentPer'))
                      })
                    }
                    
                    this.$nextTick(() => {
                      this.socialForm.setFieldsValue(pick(this.model, 'unitBigailmentPer'))
                    })
                  }
                }

                // 计算金额
                this.model.unitPersionMoney = this.formatMoneyData(this.model.lowerLimit * this.model.unitPensionPer / 100, 4)
                this.model.unitMedicalMoney = this.formatMoneyData(this.model.lowerLimit * this.model.unitMedicalPer / 100, 4)
                this.model.unitUnemploymentMoney = this.formatMoneyData(this.model.lowerLimit * this.model.unitUnemploymentPer / 100, 4)
                this.model.unitInjuryMoney = this.formatMoneyData(this.model.lowerLimit * this.model.unitWorkUnjuryPer / 100, 4)
                this.model.unitBirthMoney = this.formatMoneyData(this.model.lowerLimit * this.model.unitBirthPer / 100, 4)
                

                this.model.personalPersionMoney = this.formatMoneyData(this.model.lowerLimit * this.model.personalPensionPer / 100, 4)
                this.model.personalMedicalMoney = this.formatMoneyData(this.model.lowerLimit * this.model.personalMedicalPer / 100, 4)
                this.model.personalUnemploymentMoney = this.formatMoneyData(this.model.lowerLimit * this.model.personalUnemploymentPer / 100, 4)
                
                this.isPaymentType = false
                if (this.socialIsIllness) {
                  let tmp=this.formatMoneyData(this.model.lowerLimit * this.model.unitBigailmentPer / 100, 4)
                  this.model.unitBigailmentMoney = socialSysBaseSetByEntityData.valueType === '0' ? socialSysBaseSetByEntityData.payCompany : tmp
                  tmp=this.formatMoneyData(this.model.lowerLimit * this.model.personalBigailmentPer / 100, 4)
                  this.model.personalBigailmentMoney = socialSysBaseSetByEntityData.valueType === '0' ? socialSysBaseSetByEntityData.payPersonal : tmp
                  
                  if (this.isChargePersonalStatus) {  // 新员工缴费
                    this.$nextTick(() => {
                      this.socialForm.setFieldsValue(pick(this.model, 'personalBigailmentMoney'))
                    })
                  }
                }
                this.$nextTick(() => {
                  this.socialForm.setFieldsValue(pick(this.model, 'lowerLimit', 'upperLimit', 'socialOverpayNumber', 'socialHaveThisMonth', 'typeOfInsurance', 'insuranceIsLatestCardinalityOfSocial', 'socialPayPolicy', 'isChargePersonal', 'collectType', 'valueType', 'collectMoth',
                  'unitPensionCardinal', 'unitMedicalCardinal', 'unitUnemploymentCardinal', 'unitWorkInjuryCardinal', 'unitBirthCardinal', 'personalPensionCardinal', 'personalMedicalCardinal', 'personalUnemploymentCardinal',
                  'unitPensionPer', 'unitMedicalPer', 'unitUnemploymentPer', 'unitWorkUnjuryPer', 'unitBirthPer',
                  'personalPensionPer', 'personalMedicalPer', 'personalUnemploymentPer',
                  'unitPersionMoney', 'unitMedicalMoney', 'unitUnemploymentMoney', 'unitInjuryMoney', 'unitBirthMoney',
                  'unitBigailmentMoney', 'personalPersionMoney', 'personalMedicalMoney', 'personalUnemploymentMoney','isIllness'))
                })
              } else {
                this.isPaymentType = true
                this.socialForm.setFieldsValue({
                  paymentType: undefined,
                  socialStartDate: undefined,
                })
                this.dateCanBeSelected=true
                this.socialDataIsDisabled = true // 表单数据改为不可修改
                this.$message.error('无对应缴纳地市或县的社保基数配置，请确认缴纳地选择是否正确或存在社保基数配置！')

                this.model.socialStartDate = null
                this.$nextTick(() => {
                  this.socialForm.setFieldsValue(pick(this.model, 'socialStartDate'))
                })
              }
            } else {
              this.socialDataIsDisabled = true // 表单数据改为不可修改

              this.model.socialStartDate = null
              this.$nextTick(() => {
                this.socialForm.setFieldsValue(pick(this.model, 'socialStartDate'))
              })
            }
          })
        }
      },
      // 公积金缴纳地省份切换
      handleFundProvinceChange(value) {
        let fundHousehold = this.fundForm.getFieldValue('fundHousehold')
        this.fundAreaCitys = []
        this.fundAreaTowns = []

        for (var c of this.AreaTrees[value - 1].children) {
          this.fundAreaCitys.push(c)
        }

        this.model.fundCity = []
        this.model.fundTown = []
        this.model.fundStartDate = null
        this.$nextTick(() => {
          this.fundForm.setFieldsValue(pick(this.model, 'fundCity', 'fundTown', 'fundStartDate'))
        })

        // 执行请求拉取配置数据
        this.handleGetSysBaseSetByEntityOfFund(fundHousehold, value, null, null, moment().format('YYYY-MM-DD HH:mm:ss'))
      },
      // 公积金缴纳地城市切换
      handleFundCityChange(value) {
        let fundHousehold = this.fundForm.getFieldValue('fundHousehold')
        this.fundAreaTowns = []
        for (const c of this.fundAreaCitys) {
          if (String(c.id) === String(value)) {
            if (c.children.length > 0) {
              for (const t of c.children) {
                this.fundAreaTowns.push(t)
              }
            }
          break
          }
        }
        this.model.fundTown = []
        this.model.fundStartDate = null
        this.$nextTick(() => {
          this.fundForm.setFieldsValue(pick(this.model, 'fundTown', 'fundStartDate'))
        })
        // 执行请求拉取配置数据
        this.handleGetSysBaseSetByEntityOfFund(fundHousehold, this.fundForm.getFieldValue('fundProvince'), value, null, moment().format('YYYY-MM-DD HH:mm:ss'))
      },
      // 公积金缴纳地区县切换
      handleFundTownChange(value) {
        let fundHousehold = this.fundForm.getFieldValue('fundHousehold')

        // 执行请求拉取配置数据
        this.handleGetSysBaseSetByEntityOfFund(fundHousehold, this.fundForm.getFieldValue('fundProvince'), this.fundForm.getFieldValue('fundCity'), value, moment().format('YYYY-MM-DD HH:mm:ss'))
      },
      // 公积金查询基数配置 
      handleGetSysBaseSetByEntityOfFund(fundHousehold, fundProvince, fundCity, fundTown, nowTime) {
        this.model.fundStartDate = null
        this.$nextTick(() => {
          this.fundForm.setFieldsValue(pick(this.model, 'fundStartDate'))
        })

        if (fundHousehold && fundProvince && nowTime) {
          let httpurl = 'hrSocial/sysbasesetinfo/getSysBaseSetByEntity'
          httpurl += `?deleteFlag=0&baseType=1&status=0&departId=${fundHousehold}&province=${fundProvince}&applyStartDate=${nowTime}`
          if (fundCity) { // 有城市
            httpurl += `&city=${fundCity}`
            if (fundTown) {  // 有县区
              httpurl += `&town=${fundTown}`
            }
          }
          // 基数配置查询
          httpAction(httpurl, '', 'GET').then((res) => {
            if (res.code === 200) {
              if (res.data.length > 0) {
                this.fundDataIsDisabled = false // 表单数据改为可修改
                let fundSysBaseSetByEntityData = this.sysBaseSetByEntityOfFund = res.data[0] // 默认取第一条数据
                this.fundCanOverpay = (fundSysBaseSetByEntityData.canOverpay == 0) ? true : false // 公积金是否可补缴
                this.fundProvidentPer = fundSysBaseSetByEntityData.fundProList // 公积金比例
                this.model.fundPayLowerLimit = fundSysBaseSetByEntityData.lowerLimit // 公积金基数下限
                this.model.fundPayUpperLimit = fundSysBaseSetByEntityData.upperLimit // 公积金基数上限
                this.model.fundPayPoint = fundSysBaseSetByEntityData.fundPayPoint + '' // 公积金单边小数点(转字符串)
                if(fundSysBaseSetByEntityData.fundPayPoint<1||fundSysBaseSetByEntityData.fundPayPoint>5){
                  this.$message.warn('公积金单边小数点的值不合法，请联系管理员')
                }
                if (this.fundCanOverpay) {  // 是否可补缴公积金
                  this.model.fundOverpayNumber = fundSysBaseSetByEntityData.overpayNumber + ''// 补缴期限
                  this.model.fundHaveThisMonth = fundSysBaseSetByEntityData.haveThisMonth // 是否含当月
                  this.model.insuranceIsLatestCardinalityOfFund = fundSysBaseSetByEntityData.insuranceIsLatestCardinality // 补缴最新基数
                  this.model.fundPayPolicy = fundSysBaseSetByEntityData.payPolicy // 公积金补缴政策
                }

                this.model.unitProvidengCardinal = this.model.personalProvidentCardinal = fundSysBaseSetByEntityData.lowerLimit // 公积金基数

                if (this.fundProvidentPer.length > 0) {
                  this.model.unitProvidentPer = this.fundProvidentPer[0].companyPro // 取第一个（单位）
                  this.model.personalProvidentPer = this.fundProvidentPer[0].personalPro // 取第一个（个人）
                  this.model.unitProvidentFee = this.formatMoneyData(fundSysBaseSetByEntityData.lowerLimit * this.model.unitProvidentPer / 100, this.model.fundPayPoint)  // 单位公积金金额
                  this.model.personalProvidentFee = this.formatMoneyData(fundSysBaseSetByEntityData.lowerLimit * this.model.personalProvidentPer / 100, this.model.fundPayPoint)  // 个人公积金金额
                } else {
                  this.model.unitProvidentPer = this.model.personalProvidentPer = []
                  this.model.unitProvidentFee = this.model.personalProvidentFee = '0.00'
                }
                this.$nextTick(() => {
                  // 赋值
                  this.fundForm.setFieldsValue(pick(this.model, 'fundPayLowerLimit', 'fundPayUpperLimit', 'fundPayPoint', 'fundOverpayNumber', 'fundHaveThisMonth', 'insuranceIsLatestCardinalityOfFund', 'fundPayPolicy', 'unitProvidengCardinal', 'personalProvidentCardinal', 'unitProvidentPer', 'personalProvidentPer', 'unitProvidentFee', 'personalProvidentFee'))
                })
              } else {
                this.fundDataIsDisabled = true // 表单数据改为不可修改
                this.model.fundStartDate = null
                this.$nextTick(() => {
                  this.fundForm.setFieldsValue(pick(this.model, 'fundStartDate'))
                })
              }
            } else {
              this.fundDataIsDisabled = true // 表单数据改为不可修改
              this.model.fundStartDate = null
              this.$nextTick(() => {
                this.fundForm.setFieldsValue(pick(this.model, 'fundStartDate'))
              })
            }
          })
        }
      },
      /******************************************* 验证规则 *******************************************/
      // 社保选择单位验证
      validateSocialHousehold(rule, value, callback) {
        this.model.socialProvince = []
        this.model.socialCity = []
        this.model.socialTown = []
        this.model.socialStartDate = null
        this.socialDataIsDisabled = true

        if (this.recordInfo.employeeInfo) { // 编辑的时候
          if (this.okStatusOfSocial == 1) { // 第一次提交过来的
            this.okStatusOfSocial = 2
          } else {
            this.socialAreaCitys = []  // 社保城市
            this.socialAreaTowns = []  // 社保区县
            this.okStatusOfSocial = 2
            this.socialIsDisabled = false
            this.validatorSocialRules.socialProvince.rules[0] = { required: true, message: '选择省份！' }
            this.validatorSocialRules.socialCity.rules[0] = { required: true, message: '选择城市！' }
            this.validatorSocialRules.socialStartDate.rules[0] = { required: true, message: '请选择社保起缴日期！' }
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'socialProvince', 'socialCity', 'socialTown', 'socialStartDate'))
            })
          }
        } else {
          this.socialAreaCitys = []  // 社保城市
          this.socialAreaTowns = []  // 社保区县

          if (!value) { // 未选选择
            this.socialIsDisabled = true
            this.socialDataIsDisabled = true // 表单数据改为不可修改
            this.offsetStatus.offsetTwo = false // 红点提示去除
            this.validatorSocialRules.socialProvince.rules = []
            this.validatorSocialRules.socialCity.rules = []
            this.validatorSocialRules.socialStartDate.rules = []
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'socialProvince', 'socialCity', 'socialTown', 'socialStartDate'))
            })
          } else {
            this.socialIsDisabled = false
            this.validatorSocialRules.socialProvince.rules[0] = { required: true, message: '选择省份！' }
            this.validatorSocialRules.socialCity.rules[0] = { required: true, message: '选择城市！' }
            this.validatorSocialRules.socialStartDate.rules[0] = { required: true, message: '请选择社保起缴日期！' }
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'socialProvince', 'socialCity', 'socialTown', 'socialStartDate'))
            })
          }
        }

        callback()
      },
      // 社保禁止选择的时间范围
      disabledSocialStartDate(current) {
          let endYear = (this.sysBaseSetByEntityOfSocial.applyEndDate).substring(0, 4)  // 截止年
          let endMonth = (this.sysBaseSetByEntityOfSocial.applyEndDate).substring(5, 7) // 截止月
          let currentYear = (moment().startOf('month')).format('YYYY-MM').substring(0, 4) // 当前年
          let currentMonth = (moment().startOf('month')).format('YYYY-MM').substring(5, 7)  // 当前月
          let afterSumMonth = ((endYear - currentYear) * 12) + (endMonth - currentMonth)  // 相差月
          console.log(endYear,endMonth,currentYear,currentMonth,afterSumMonth,999);
          if (afterSumMonth < 0 ) {
            this.$message.error('户数据适用周期错误！')
            return false
          }
          
          let afterDate = (moment(moment().endOf('month')).subtract(-afterSumMonth, 'months'))  // 往后推afterSumMonth月
          
          if (this.sysBaseSetByEntityOfSocial.canOverpay == 0) { // 可补缴
            let overpayNumber = this.sysBaseSetByEntityOfSocial.overpayNumber // 可补缴月份

            if (this.sysBaseSetByEntityOfSocial.haveThisMonth == 0) { // 含当月
              let beforeDate = (moment(moment().endOf('month')).subtract(overpayNumber, 'months'))  // 往前推(overpayNumber)个月
              return current > afterDate || current <= beforeDate // 获取当前月最后一天23时59分59秒
            } else {  // 不含当月
              let beforeDate = (moment(moment().endOf('month')).subtract(overpayNumber + 1, 'months'))  // 往前推(overpayNumber+1)个月
              return current > afterDate || current <= beforeDate // 获取当前月最后一天23时59分59秒
            }
          } else {  // 不能补缴[当前月之后]
            return current > afterDate || current < moment().startOf('month')  // 获取当前月第一天0时0分0秒
          }
      },
      // 验证社保'单位养老'基数
      validateSocialUnitPensionCardinal(rule, value, callback) {
        if (this.validateSocialCardinal(rule, value, callback)) {
          if(value !== undefined){
            this.model.unitPersionMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('unitPensionPer') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'unitPersionMoney'))
            })
          }
        }
      },
      // 验证社保'单位养老'比例
      validateSocialUnitPensionPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          if(value !== undefined){
            this.model.unitPersionMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('unitPensionCardinal') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'unitPersionMoney'))
            })
          }
        }
      },
      // 验证社保'单位医疗'基数
      validateSocialUnitMedicalCardinal(rule, value, callback) {
        if (this.validateSocialCardinal(rule, value, callback)) {
          if(value !== undefined){
            this.model.unitMedicalMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('unitMedicalPer') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'unitMedicalMoney'))
            })
          }
        }
      },
      // 验证社保'单位医疗'比例
      validateSocialUnitMedicalPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          if(value !== undefined){
            this.model.unitMedicalMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('unitMedicalCardinal') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'unitMedicalMoney'))
            })
          }
        }
      },
      // 验证社保'单位失业'基数
      validateSocialUnitUnemploymentCardinal(rule, value, callback) {
        if (this.validateSocialCardinal(rule, value, callback)) {
          if(value !== undefined){
            this.model.unitUnemploymentMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('unitUnemploymentPer') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'unitUnemploymentMoney'))
            })
          }
        }
      },
      // 验证社保'单位失业'比例
      validateSocialUnitUnemploymentPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          if(value !== undefined){
            this.model.unitUnemploymentMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('unitUnemploymentCardinal') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'unitUnemploymentMoney'))
            })
          }
        }
      },
      // 验证社保'单位工伤'基数
      validateSocialUnitWorkInjuryCardinal(rule, value, callback) {
        if (this.validateSocialCardinal(rule, value, callback)) {
          if(value !== undefined){
            this.model.unitInjuryMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('unitWorkUnjuryPer') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'unitInjuryMoney'))
            })
          }
        }
      },
      // 验证社保'单位工伤'比例
      validateSocialWorkUnjuryPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          if(value !== undefined){
            this.model.unitInjuryMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('unitWorkInjuryCardinal') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'unitInjuryMoney'))
            })
          }
        }
      },
      // 验证社保'单位生育'基数
      validateSocialUnitBirthCardinal(rule, value, callback) {
        if (this.validateSocialCardinal(rule, value, callback)) {
          if(value !== undefined){
            this.model.unitBirthMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('unitBirthPer') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'unitBirthMoney'))
            })
          }
        }
      },
      // 验证社保'单位生育'比例
      validateSocialUnitBirthPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          if(value !== undefined){
            this.model.unitBirthMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('unitBirthCardinal') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'unitBirthMoney'))
            })
          }
        }
      },
      // 验证社保'单位大病'基数
      validateSocialUnitBigailmentCardinal(rule, value, callback) {
        if (this.validateSocialCardinal(rule, value, callback)) {
          if(value !== undefined){
            this.model.unitBigailmentMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('unitBigailmentPer') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'unitBigailmentMoney'))
            })
          }
        }
      },
      // 验证社保'单位大病'比例
      validateSocialUnitBigailmentPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          if(value !== undefined){
            this.model.unitBigailmentMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('unitBigailmentCardinal') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'unitBigailmentMoney'))
            })
          }
        }
      },
      // 验证社保'单位大病'金额
      validateSocialunitBigailmentMoney(rule, value, callback) {
        if (!this.socialDataIsDisabled) { // 是否选择社保户
          if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 正整数验证
            callback('输入两位小数！')
            return false
          }
        }
        callback()
        return true
      },
      // 验证社保'个人养老'基数
      validateSocialPersonalPensionCardinal(rule, value, callback) {
        if (this.validateSocialCardinal(rule, value, callback)) {
          if(value !== undefined){
            this.model.personalPersionMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('personalPensionPer') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'personalPersionMoney'))
            })
          }
        }
      },
      // 验证社保'个人养老'比例
      validateSocialPersonalPensionPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          if(value !== undefined){
            this.model.personalPersionMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('personalPensionCardinal') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'personalPersionMoney'))
            })
          }
        }
      },
      // 验证社保'个人医疗'基数
      validateSocialPersonalMedicalCardinal(rule, value, callback) {
        if (this.validateSocialCardinal(rule, value, callback)) {
          if(value !== undefined){
            this.model.personalMedicalMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('personalMedicalPer') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'personalMedicalMoney'))
            })
          }
        }
      },
      // 验证社保'个人医疗'比例
      validateSocialPersonalMedicalPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          if(value !== undefined){
            this.model.personalMedicalMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('personalMedicalCardinal') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'personalMedicalMoney'))
            })
          }
        }
      },
      // 验证社保'个人失业'基数
      validateSocialPersonalUnemploymentCardinal(rule, value, callback) {
        if (this.validateSocialCardinal(rule, value, callback)) {
          if(value !== undefined){
            this.model.personalUnemploymentMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('personalUnemploymentPer') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'personalUnemploymentMoney'))
            })
          }
        }
      },
      // 验证社保'个人失业'比例
      validateSocialPersonalUnemploymentPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          if(value !== undefined){
            this.model.personalUnemploymentMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('personalUnemploymentCardinal') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'personalUnemploymentMoney'))
            })
          }
        }
      },
      // 验证社保'个人大病'基数
      validateSocialPersonalBigailmentCardinal(rule, value, callback) {
        if (this.validateSocialCardinal(rule, value, callback)) {
          if(value !== undefined){
            this.model.personalBigailmentMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('personalBigailmentPer') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'personalBigailmentMoney'))
            })
          }
        }
      },
      // 验证社保'个人大病'比例
      validateSocialPersonalBigailmentPer(rule, value, callback) {
        if (this.validateSocialPro(rule, value, callback)) {
          if(value !== undefined){
            this.model.personalBigailmentMoney = this.formatMoneyData(value * this.socialForm.getFieldValue('personalBigailmentCardinal') / 100, this.socialMoneyType)
            this.$nextTick(() => {
              this.socialForm.setFieldsValue(pick(this.model, 'personalBigailmentMoney'))
            })
          }
        }
      },
      // 验证社保基数（统一验证）
      validateSocialCardinal(rule, value, callback) {
        if (!this.socialDataIsDisabled) { // 是否选择社保户
          if (!value) {
            callback('请填写基数')
            return false
          }

          if (this.model.lowerLimit) {  // 是否请求到社保基础配置数据
            if (new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 正整数验证
              // 不再进行范围验证
              if (value < this.model.lowerLimit || value > this.model.upperLimit) { // 范围验证
                 callback('范围不合法！')
                 return false
              }
            } else {
              callback('输入两位小数！')
              return false
            }
          }
          callback()
          return true
        }
        
        callback()
      },
      // 验证社保比例（统一验证）
      validateSocialPro(rule, value, callback) {
        console.log(this.socialDataIsDisabled);
        if (!this.socialDataIsDisabled) { // 是否选择社保户
          // if (!value) {
          //   callback('请填写比例')
          //   return false
          // }

          if (this.model.lowerLimit) {  // 是否请求到社保基础配置数据
            if (!new RegExp(/^(\d|[1-9]\d|99)(\.\d{1,2})?$/).test(value)) { // (0-99)验证百分比
              //this.isSelected = true
              callback('0~100范围两位小数！')
              return false
            }
          }

          callback()
          return true
        }
        
        callback()
        return true
      },
      // 公积金选择单位验证
      validateFundHousehold(rule, value, callback) {
        this.model.fundProvince = []
        this.model.fundCity = []
        this.model.fundTown = []
        this.model.fundStartDate = null
        this.fundDataIsDisabled = true
        
        if (this.recordInfo.employeeInfo) { // 编辑的时候
          if (this.okStatusOfFund == 1) { // 第一次提交过来的
            this.okStatusOfFund = 2
          } else {
            this.fundAreaCitys = []  // 公积金城市
            this.fundAreaTowns = []  // 公积金区县
            this.okStatusOfFund = 2
            this.fundIsDisabled = false
            this.validatorFundRules.fundProvince.rules[0] = { required: true, message: '选择省份！' }
            this.validatorFundRules.fundStartDate.rules[0] = { required: true, message: '请选择公积金起缴日期！' }
            this.$nextTick(() => {
              this.fundForm.setFieldsValue(pick(this.model, 'fundProvince', 'fundCity', 'fundTown', 'fundStartDate'))
            })
          }
        } else {
          this.fundAreaCitys = []  // 公积金城市
          this.fundAreaTowns = []  // 公积金区县

          if (!value) { // 未选选择
            this.fundIsDisabled = true
            this.fundDataIsDisabled = true // 表单数据改为不可修改
            this.offsetStatus.offsetThree = false // 红点不显示
            this.validatorFundRules.fundProvince.rules = []
            this.validatorFundRules.fundStartDate.rules = []
            this.$nextTick(() => {
              this.fundForm.setFieldsValue(pick(this.model, 'fundProvince', 'fundCity', 'fundTown', 'fundStartDate'))
            })
          } else {
            this.fundIsDisabled = false
            this.validatorFundRules.fundProvince.rules[0] = { required: true, message: '选择省份！' }
            this.validatorFundRules.fundStartDate.rules[0] = { required: true, message: '请选择公积金起缴日期！' }
            this.$nextTick(() => {
              this.fundForm.setFieldsValue(pick(this.model, 'fundProvince', 'fundCity', 'fundTown', 'fundStartDate'))
            })
          }
        }
        
        callback()
      },
      // 公积金禁止选择的时间范围
      disabledFundStartDate(current) {
        if (!this.fundDataIsDisabled) {
          const endYear = (this.sysBaseSetByEntityOfFund.applyEndDate).substring(0, 4)  // 截止年
          const endMonth = (this.sysBaseSetByEntityOfFund.applyEndDate).substring(5, 7) // 截止月
          const currentYear = (moment().startOf('month')).format('YYYY-MM').substring(0, 4) // 当前年
          const currentMonth = (moment().startOf('month')).format('YYYY-MM').substring(5, 7)  // 当前月
          const afterSumMonth = ((endYear - currentYear) * 12) + (endMonth - currentMonth)  // 相差月
          if (afterSumMonth < 0 ) {
            this.$message.error('户数据适用周期错误！')
            return false
          }
          const afterDate = (moment(moment().endOf('month')).subtract(-afterSumMonth, 'months'))  // 往后推afterSumMonth月
          if (this.sysBaseSetByEntityOfFund.canOverpay == 0) { // 可补缴
            const overpayNumber = this.sysBaseSetByEntityOfFund.overpayNumber // 可补缴月份
            if (this.sysBaseSetByEntityOfFund.haveThisMonth == 0) { // 含当月
              const beforeDate = (moment(moment().endOf('month')).subtract(overpayNumber, 'months'))  // 往前推(overpayNumber)个月
              return current > afterDate || current <= beforeDate // 获取当前月最后一天23时59分59秒
            } else {  // 不含当月
              const beforeDate = (moment(moment().endOf('month')).subtract(overpayNumber + 1, 'months'))  // 往前推(overpayNumber+1)个月
              return current > afterDate || current <= beforeDate // 获取当前月最后一天23时59分59秒
            }
          } else {  // 不能补缴[当前月之后]
            return current > afterDate || current < moment().startOf('month')  // 获取当前月第一天0时0分0秒
          }
        } else {
          return current
        }
      },
      // 验证公积金'单位公积金'基数
      validateFundUnitProvidengCardinal(rule, value, callback) {
        if (this.validateFundCardinal(rule, value, callback)) {
          this.model.unitProvidentFee = this.formatMoneyData(value * this.fundForm.getFieldValue('unitProvidentPer') / 100, this.model.fundPayPoint)
          this.$nextTick(() => {
            this.fundForm.setFieldsValue(pick(this.model, 'unitProvidentFee'))
          })
        }
      },
      // 验证公积金'单位公积金'比例
      validateFundUnitProvidentPer(rule, value, callback) {
        this.model.unitProvidentFee = this.formatMoneyData(value * this.fundForm.getFieldValue('unitProvidengCardinal') / 100, this.model.fundPayPoint)
        this.$nextTick(() => {
          this.fundForm.setFieldsValue(pick(this.model, 'unitProvidentFee'))
        })
        callback()
      },
      // 验证公积金'个人公积金'基数
      validateFundPersonalProvidentCardinal(rule, value, callback) {
        if (this.validateFundCardinal(rule, value, callback)) {
          this.model.personalProvidentFee = this.formatMoneyData(value * this.fundForm.getFieldValue('personalProvidentPer') / 100, this.model.fundPayPoint)
          this.$nextTick(() => {
            this.fundForm.setFieldsValue(pick(this.model, 'personalProvidentFee'))
          })
        }
      },
      // 验证公积金'个人公积金'比例
      validateFundPersonalProvidentPer(rule, value, callback) {
        this.model.personalProvidentFee = this.formatMoneyData(value * this.fundForm.getFieldValue('personalProvidentCardinal') / 100, this.model.fundPayPoint)
        this.$nextTick(() => {
          this.fundForm.setFieldsValue(pick(this.model, 'personalProvidentFee'))
        })
        callback()
      },
      // 验证公积金基数（统一验证）
      validateFundCardinal(rule, value, callback) {
        if (!this.fundDataIsDisabled) { // 是否选择公积金户
          if (!value) {
            callback('请填写基数')
            return false
          }

          if (this.model.fundPayLowerLimit) {  // 是否请求到公积金基础配置数据
            if (new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 正整数验证
              if (value < this.model.fundPayLowerLimit || value > this.model.fundPayUpperLimit) { // 范围验证
                callback('范围不合法！')
                return false
              }
            } else {
              callback('输入两位小数！')
              return false
            }
          }
        
        callback()
        return true
        }

        callback()
      },
      /**
       * 金额格式化
       * 
       * @param number：数字类型
       * @param type:1.四舍五入，取整，2.元一下的全部舍去，取整 3，见角进元 4.四舍五入保留2位小数 5.四舍五入保留一位小数
       */
      formatMoneyData(number, type) {
        number = number * 1 //js弱类型转换

        if (type == 1) { return number.toFixed(0) }

        if (type == 2) { return number.toString().split(".")[0] }

        if (type == 3) {
          var splitValue = number.toString().split(".")
          var temp =''

          if (splitValue.length == 1) { return splitValue[0] }

          if (splitValue.length > 1) {
            temp = splitValue[1]

            if (temp.length >= 1) {
              temp = temp.substr(0, [1])

              if (Number(temp) > 0) {
                return splitValue[0] * 1 + 1
              } else {
                return splitValue[0]
              }
            }
          }
        }

        if(type == 4) { return  number.toFixed(2) }
        if(type == 5) { return  number.toFixed(1) }
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
      },
    }
  }
</script>

<style scoped>

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
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
.ant-checkbox-wrapper + .ant-checkbox-wrapper{
  margin-left:0px;
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
</style>
