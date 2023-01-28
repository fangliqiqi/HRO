<template>
  <a-modal
    :title="title"
    :width="'90%'"
    placement="right"
    :closable="true"
    :footer="null"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirm-loading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form layout="inline" class="ant-advanced-search-form">
        <a-row>
          <a-col :span="24">
            <a-steps :current="current">
              <a-step title="基本信息" />
              <a-step title="事件信息" />
              <a-step title="方案意见" />
              <a-step title="材料附件" />
            </a-steps>
          </a-col>
        </a-row>

        <div class="content" v-show="current == 0">
          <a-row class="mbot">
            <a-col :span="12">
              <span class="name">{{ rowEmpoyee.empName }}</span> {{ insuranceInfo.empAge }}岁
            </a-col>
          </a-row>
          <detail-list>
            <detail-list-item term="性别">{{ rowEmpoyee.empSex }}</detail-list-item>
            <detail-list-item term="社会保险">{{ insuranceInfo.socialStatusStr || '未购买' }}</detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="身份证">{{ rowEmpoyee.empIdcard }}</detail-list-item>
            <detail-list-item term="商业保险">
              <a-tooltip placement="topLeft">
                <template slot="title">
                  {{ insuranceInfo.insuranceStr || '未购买' }}
                </template>
                <span class="overflow">
                  {{ insuranceInfo.insuranceStr || '未购买' }}
                </span>
              </a-tooltip>
            </detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="联系方式">{{ insuranceInfo.empPhone }}</detail-list-item>
          </detail-list>

          <detail-list>
            <detail-list-item term="客户单位">
              <a-tooltip placement="topLeft">
                <template slot="title">
                  {{ rowEmpoyee.customerName || '' }}
                </template>
                <span class="overflow">{{ rowEmpoyee.customerName || '' }}</span>
              </a-tooltip>
            </detail-list-item>
            <detail-list-item term="职位">{{ insuranceInfo.post }}</detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="结算主体">
              <a-tooltip placement="topLeft">
                <template slot="title">
                  {{
                    settleDomainOptions[rowEmpoyee.settleDomain]
                      ? settleDomainOptions[rowEmpoyee.settleDomain].departName
                      : ''
                  }}
                </template>
                <span class="overflow">
                  {{
                    settleDomainOptions[rowEmpoyee.settleDomain]
                      ? settleDomainOptions[rowEmpoyee.settleDomain].departName
                      : ''
                  }}
                </span>
              </a-tooltip>
            </detail-list-item>
            <detail-list-item term="业务类型">{{ rowEmpoyee.businessTypeName }}</detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="劳动合同期限">
              <template v-if="insuranceInfo.contractStart">
                {{ insuranceInfo.contractStart }} ~ {{ insuranceInfo.contractEnd }}
              </template>
              <template v-else> 暂无合同 </template>
            </detail-list-item>
            <detail-list-item term="社保参保地">{{ insuranceInfo.area || '暂无' }}</detail-list-item>
          </detail-list>
          <a-divider />
          <a-form :form="riskForm" layout="inline" class="ant-advanced-search-form">
            <a-row>
              <a-col :span="6">
                <a-form-item label="风险承担">
                  <a-select
                    placeholder="请选择"
                    @select="selectRow"
                    style="width: 130px"
                    v-decorator="['riskBear', validatorRules.riskBear]"
                  >
                    <a-select-option value="0">皖信</a-select-option>
                    <a-select-option value="1">客户单位</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="7" v-if="selectRowVal == 0">
                <a-form-item label="皖信">
                  <a-select
                    showSearch
                    optionFilterProp="children"
                    placeholder="请选择"
                    style="width: 200px"
                    v-decorator="['riskBearOrgan', validatorRules.riskBearOrgan]"
                    :dropdownMatchSelectWidth="false"
                  >
                    <a-select-option v-for="(item, index) in organizationOption" :key="index" :value="item.id">{{
                      item.organName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8" v-if="selectRowVal == 1">
                <a-form-item label="客户单位">
                  <!-- <a-tree-select
                    showSearch
                    style="width: 265px"
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="treeData"
                    placeholder="客户单位"
                    treeNodeFilterProp="title"
                    treeDefaultExpandAll
                    @change="treeSelectChange"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['riskBearUnit', validatorRules.riskBearUnit]"
                  >
                  </a-tree-select> -->
                  <select-page
                    placeholder="请选择客户单位"
                    style="width: 265px"
                    v-decorator="['riskBearUnit', validatorRules.riskBearUnit]"
                    :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                    :title="'customerName'"
                    :resList="resList"
                    :triggerChange="true"
                    @select="handleSelect"
                    :id="'id'"
                  ></select-page>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="事件类别">
                  <a-select
                    showSearch
                    optionFilterProp="children"
                    placeholder="请选择事件类别"
                    :filterOption="filterOption"
                    @select="selectType"
                    style="width: 200px"
                    v-decorator="['eventType', validatorRules.eventType]"
                  >
                    <a-select-option v-for="(item, index) in eventTypeOptions" :key="index" :value="item.value">{{
                      item.label
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="content" v-show="current == 1">
          <a-form :form="thingForm" layout="inline" class="ant-advanced-search-form">
            <!-- <a-row>
              <a-col :span="24">
                <a-form-item
                  label="事件发生时间"
                  class="stepFormText"
                >
                  <a-date-picker
                    placeholder="请输入事件发生时间"
                    :disabledDate="disabledDate"
                    style="width: 200px"
                    format="YYYY-MM-DD"
                    v-decorator="['eventOccurrenceTime',validatorRules.eventOccurrenceTime]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  label="事件发生地点"
                  class="stepFormText"
                >
                  <a-input
                    placeholder="请输入事件发生地点"
                    style="width: 200px"
                    v-decorator="['eventOccurrenceAddr',validatorRules.eventOccurrenceAddr]"
                  />
                </a-form-item>
              </a-col>
              <div v-if="traffic">
                <a-col :span="10">
                  <a-form-item
                    label="车辆归属单位"
                    class="stepFormText"
                  >
                    <a-input
                      placeholder="请输入车辆归属单位"
                      style="width: 200px"
                      v-decorator="['carOfUnit',validatorRules.carOfUnit]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="车险购买单位"
                    class="stepFormText"
                  >
                    <a-input
                      placeholder="请输入车辆保险购买单位"
                      style="width: 200px"
                      v-decorator="['carInsuranceUnit',validatorRules.carInsuranceUnit]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="10">
                  <a-form-item
                    label="交强险赔付额"
                    class="stepFormText"
                  >
                    <a-input
                      placeholder="请输入交强险赔付额"
                      style="width: 200px"
                      v-decorator="['payStrongInsurance',validatorRules.payStrongInsurance]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="第三责任险保额"
                    class="stepFormText"
                  >
                    <a-input
                      placeholder="请输入第三责任险保额"
                      style="width: 200px"
                      v-decorator="['thirdPartyLiabilityInsurance',validatorRules.thirdPartyLiabilityInsurance]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="7">
                  <a-form-item
                    label="伤者户口归属"
                    class="stepFormText"
                  >
                    <a-select
                      style="width: 180px"
                      v-decorator="['woundedHukouAttribution',validatorRules.woundedHukouAttribution]"
                      placeholder="请选择伤者户口归属"
                    >
                      <a-select-option value="0">城镇居民</a-select-option>
                      <a-select-option value="1">农村户口</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="7">
                  <a-form-item
                    label="受伤部位"
                    class="stepFormText"
                  >
                    <a-input
                      placeholder="请输入受伤部位"
                      style="width: 180px"
                      v-decorator="['injuredArea',validatorRules.injuredArea]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="7">
                  <a-form-item
                    label="受伤程度"
                    class="stepFormText"
                  >
                    <a-input
                      placeholder="请输入受伤程度"
                      style="width: 180px"
                      v-decorator="['injuredDegree',validatorRules.injuredDegree]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="10">
                  <a-form-item
                    label="第三人身份号"
                    class="stepFormText"
                  >
                    <a-input
                      placeholder="请输入第三人身份号"
                      style="width: 200px"
                      v-decorator="['thirdPersonIdCard',validatorRules.thirdPersonIdCard]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="年龄"
                    class="stepFormText"
                  >
                    <a-input
                      placeholder="请输入年龄"
                      style="width: 200px"
                      v-decorator="['age',validatorRules.age]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="10">
                  <a-form-item
                    label="伤者家庭情况"
                    class="stepFormText"
                  >
                    <a-input
                      placeholder="请输入伤者家庭情况"
                      style="width: 200px"
                      v-decorator="['injuredFamilyStatus',validatorRules.injuredFamilyStatus]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="治疗费（预判）"
                    class="stepFormText"
                  >
                    <a-input
                      placeholder="请输入治疗费（预判）"
                      style="width: 200px"
                      v-decorator="['treatmentCosts',validatorRules.treatmentCosts]"
                    />
                  </a-form-item>
                </a-col>
              </div>
              <div v-else>
                <a-col :span="8">
                  <a-form-item
                    label="伤害部位"
                    class="stepFormText"
                  >
                    <a-input
                      placeholder="请输入伤害部位"
                      style="width: 200px"
                      v-decorator="['injuryPosition',validatorRules.injuryPosition]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="是否治疗"
                    class="stepFormText"
                  >
                    <a-select
                      placeholder="请选择是否治疗"
                      @select="onSelect"
                      style="width: 150px"
                      v-decorator="['isCuring',validatorRules.isCuring]"
                    >
                      <a-select-option value="0">是</a-select-option>
                      <a-select-option value="1">否</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col
                  :span="8"
                  v-if="isCuringType"
                >
                  <a-form-item
                    label="治疗类型"
                    class="stepFormText"
                  >
                    <a-select
                      showSearch
                      placeholder="请选择治疗类型"
                      :filterOption="filterOption"
                      style="width: 200px"
                      v-decorator="['curingType',validatorRules.curingType]"
                    >
                      <a-select-option
                        v-for="(item, index) in treatmentTypeOption"
                        :key="index"
                        :value="item.value"
                      >{{ item.label }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col
                  :span="24"
                  v-if="isCuringType"
                >
                  <a-form-item
                    label="就诊医院"
                    class="stepFormText"
                  >
                    <a-input
                      placeholder="请输入就诊医院"
                      style="width: 200px"
                      v-decorator="['curingHospital',validatorRules.curingHospital]"
                    />
                  </a-form-item>
                </a-col>
              </div>

              <a-col :span="24">
                <a-form-item
                  label="事件发生经过"
                  class="stepFormText"
                >
                  <a-textarea
                    rows="4"
                    cols="150"
                    placeholder="请输入事件发生经过"
                    v-decorator="['eventThrough',validatorRules.eventThrough]"
                  ></a-textarea>
                </a-form-item>
              </a-col>
            </a-row> -->
            <a-row v-if="traffic">
              <a-col :span="10" :offset="1">
                <a-form-item label="车辆归属单位" class="stepFormText">
                  <a-input
                    placeholder="请输入车辆归属单位"
                    style="width: 200px"
                    v-decorator="['carOfUnit', validatorRules.carOfUnit]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="车险购买单位" class="stepFormText">
                  <a-input
                    placeholder="请输入车辆保险购买单位"
                    style="width: 200px"
                    v-decorator="['carInsuranceUnit', validatorRules.carInsuranceUnit]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="10" :offset="1">
                <a-form-item label="交强险赔付额" class="stepFormText">
                  <a-input
                    placeholder="请输入交强险赔付额"
                    style="width: 200px"
                    v-decorator="['payStrongInsurance', validatorRules.payStrongInsurance]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="第三责任险保额" class="stepFormText">
                  <a-input
                    placeholder="请输入第三责任险保额"
                    style="width: 200px"
                    v-decorator="['thirdPartyLiabilityInsurance', validatorRules.thirdPartyLiabilityInsurance]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="10" :offset="1">
                <a-form-item label="事件发生时间" class="stepFormText">
                  <a-date-picker
                    placeholder="请输入事件发生时间"
                    style="width: 200px"
                    :disabledDate="disabledDate"
                    v-decorator="['eventOccurrenceTime', validatorRules.eventOccurrenceTime]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="事件发生地点" class="stepFormText">
                  <a-input
                    placeholder="请输入事件发生地点"
                    style="width: 200px"
                    v-decorator="['eventOccurrenceAddr', validatorRules.eventOccurrenceAddr]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="23" :offset="1">
                <a-form-item label="事件发生经过" class="stepFormText">
                  <a-textarea
                    style="resize: none"
                    rows="4"
                    cols="110"
                    placeholder="请输入事件发生经过"
                    v-decorator="['eventThrough', validatorRules.eventThrough]"
                  ></a-textarea>
                </a-form-item>
              </a-col>
              <a-col :span="7" :offset="1">
                <a-form-item label="伤者户口归属" class="stepFormText">
                  <a-select
                    style="width: 180px"
                    v-decorator="['woundedHukouAttribution', validatorRules.woundedHukouAttribution]"
                    placeholder="请选择伤者户口归属"
                  >
                    <a-select-option value="0">城镇居民</a-select-option>
                    <a-select-option value="1">农村户口</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item label="受伤部位" class="stepFormText">
                  <a-input
                    placeholder="请输入受伤部位"
                    style="width: 180px"
                    v-decorator="['injuredArea', validatorRules.injuredArea]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item label="受伤程度" class="stepFormText">
                  <a-input
                    placeholder="请输入受伤程度"
                    style="width: 180px"
                    v-decorator="['injuredDegree', validatorRules.injuredDegree]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="10" :offset="1">
                <a-form-item label="第三人身份号" class="stepFormText">
                  <a-input
                    placeholder="请输入第三人身份号"
                    style="width: 200px"
                    v-decorator="['thirdPersonIdCard', validatorRules.thirdPersonIdCard]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="年龄" class="stepFormText">
                  <a-input placeholder="请输入年龄" style="width: 200px" v-decorator="['age', validatorRules.age]" />
                </a-form-item>
              </a-col>
              <a-col :span="10" :offset="1">
                <a-form-item label="伤者家庭情况" class="stepFormText">
                  <a-input
                    placeholder="请输入伤者家庭情况"
                    style="width: 200px"
                    v-decorator="['injuredFamilyStatus', validatorRules.injuredFamilyStatus]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="治疗费（预判）" class="stepFormText">
                  <a-input
                    placeholder="请输入治疗费（预判）"
                    style="width: 200px"
                    v-decorator="['treatmentCosts', validatorRules.treatmentCosts]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-else>
              <a-col :span="24">
                <a-form-item label="事件发生时间" class="stepFormText">
                  <a-date-picker
                    placeholder="请输入事件发生时间"
                    :disabledDate="disabledDate"
                    style="width: 200px"
                    v-decorator="['eventOccurrenceTime', validatorRules.eventOccurrenceTime]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="事件发生地点" class="stepFormText">
                  <a-input
                    placeholder="请输入事件发生地点"
                    style="width: 200px"
                    v-decorator="['eventOccurrenceAddr', validatorRules.eventOccurrenceAddr]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="伤害部位" class="stepFormText">
                  <a-input
                    placeholder="请输入伤害部位"
                    style="width: 200px"
                    v-decorator="['injuryPosition', validatorRules.injuryPosition]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="是否治疗" class="stepFormText">
                  <a-select
                    placeholder="请选择是否治疗"
                    @select="onSelect"
                    style="width: 150px"
                    v-decorator="['isCuring', validatorRules.isCuring]"
                  >
                    <a-select-option value="0">是</a-select-option>
                    <a-select-option value="1">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8" v-if="isCuringType">
                <a-form-item label="治疗类型" class="stepFormText">
                  <a-select
                    showSearch
                    placeholder="请选择治疗类型"
                    optionFilterProp="children"
                    :filterOption="filterOption"
                    style="width: 200px"
                    v-decorator="['curingType', validatorRules.curingType]"
                  >
                    <a-select-option v-for="(item, index) in treatmentTypeOption" :key="index" :value="item.value">{{
                      item.label
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24" v-if="isCuringType">
                <a-form-item label="就诊医院" class="stepFormText">
                  <a-input
                    placeholder="请输入就诊医院"
                    style="width: 200px"
                    v-decorator="['curingHospital', validatorRules.curingHospital]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="事件发生经过" class="stepFormText">
                  <a-textarea
                    rows="4"
                    style="width: 1000px; resize: none"
                    placeholder="请输入事件发生经过"
                    v-decorator="['eventThrough', validatorRules.eventThrough]"
                  ></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="content" v-show="current == 2">
          <a-form :form="planForm" layout="vertical">
            <a-row>
              <a-col :span="24">
                <a-form-item label="赔付方案（需要写明算法）" :labelCol="labelCol">
                  <a-textarea
                    rows="4"
                    cols="150"
                    style="resize: none"
                    placeholder="请输入赔付方案（需要写明算法）"
                    v-decorator="['payPlan', validatorRules.payPlan]"
                  ></a-textarea>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="客户意见" :labelCol="labelCol">
                  <a-textarea
                    rows="4"
                    cols="150"
                    style="resize: none"
                    placeholder="请输入客户意见"
                    v-decorator="['customerOpinion', validatorRules.customerOpinion]"
                  ></a-textarea>
                </a-form-item>
              </a-col>
              <!-- <a-col :span="24">
                <a-form-item
                  label="部门/子分公司处理方案、意见"
                  :labelCol="labelCol"
                >
                  <a-textarea
                    rows="4"
                    cols="150"
                    style="resize:none"
                    placeholder="请输入部门/子分公司处理方案、意见"
                    v-decorator="['organOpinion',validatorRules.organOpinion]"
                  ></a-textarea>
                </a-form-item>
              </a-col> -->
            </a-row>
          </a-form>
        </div>
        <div class="content" v-show="current == 3">
          <a-row>
            <a-col :span="24">
              <a-upload-dragger
                :multiple="true"
                name="file"
                :fileList="fileList"
                :beforeUpload="beforeUpload"
                :remove="removeFile"
                @change="handleChange"
                accept="image/*,.xls,.xlsx,.csv,.pdf,.doc,.docx,.m4a,.mp3,.zip,.rar"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">点击或者拖拽上传</p>
              </a-upload-dragger>
            </a-col>
          </a-row>
        </div>

        <div class="steps-action">
          <a-button type="primary" style="margin-bottom: 0px" @click="next" v-if="current < 3" :disabled="disabledBtn">下一步</a-button>
          <a-button type="primary" v-if="current == 3" style="margin-bottom: 0px" @click="handleOk">保存</a-button>
          <a-button style="margin-left: 8px; margin-bottom: 0px" v-if="current != 0" @click="prev">返回上一步</a-button>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, postActionHeader } from '@/api/manage'
import { initDictOptions, filterDictText, filterDict } from '@/components/dict/JDictSelectUtil'
import { getNameFromTree, getNameFromArr } from '@/utils/common'
import { getAllSettleDomainSelectVos } from '@/api/api'
import SelectPage from '@/components/jeecg/SelectPage'
import pick from 'lodash.pick'
import moment from 'moment'
import pinyin from 'pinyin'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item

export default {
  name: 'InjuryApplyEditModal',
  components: {
    DetailList,
    DetailListItem,
    SelectPage,
  },
  data() {
    return {
      ids: '',
      model: {},
      allModel: {}, //所有表单的属性
      title: '工伤申报',
      visible: false,
      confirmLoading: false,
      isCuringType: true,
      moment,
      flag: 0, // 0工伤事件1非因工
      current: 0, //当前步骤
      rowEmpoyee: {}, //选中的员工信息
      settleDomainOptions: [], //结算主体
      eventTypeOptions: [], //事件类型
      businessTypeDicts: [], //业务类型
      disabledBtn: false, //是否可以进入下一步
      selectRowVal: -1, //0皖信1客户单位
      organizationOption: [], //皖信组织架构
      customerTreeData: [], //客户单位
      treatmentTypeOption: [], //治疗类型
      insuranceInfo: {
        insuranceStr: '',
      }, //社保商险信息
      remainParams: {}, //剩余字段
      method: 'PUT',
      traffic: false,
      contractCustomerName: '',
      resList: [], //选中的客户单位

      riskForm: this.$form.createForm(this),
      thingForm: this.$form.createForm(this),
      planForm: this.$form.createForm(this),
      fileList: [],

      validatorRules: {
        eventType: { rules: [{ required: true, message: '请选择事件类别!' }] },
        riskBear: { rules: [{ required: true, message: '请选择风险承担!' }] },
        riskBearOrgan: { rules: [{ required: true, message: '请选择皖信旗下公司!' }] },
        riskBearUnit: { rules: [{ required: true, message: '请选择客户单位!' }] },
        eventOccurrenceTime: { rules: [{ required: true, message: '请选择事件发生时间!' }] },
        eventOccurrenceAddr: {
          rules: [
            { required: true, message: '请输入事件发生地点!' },
            { max: 100, message: '最多100个字符!' },
          ],
        },
        injuryPosition: {
          rules: [
            { required: true, message: '请输入伤害部位!' },
            { max: 50, message: '伤害部位最多50个字符!' },
          ],
        },
        isCuring: { rules: [{ required: true, message: '请选择是否治疗!' }] },
        curingType: { rules: [{ required: true, message: '请选择治疗类型!' }] },
        curingHospital: {
          rules: [
            { required: true, message: '请输入就诊医院!' },
            { max: 100, message: '就诊医院最多100个字符!' },
          ],
        },
        eventThrough: {
          rules: [
            { required: true, message: '请输入事件发生经过!' },
            { max: 500, message: '事件经过最多500个字符!' },
          ],
        },
        payPlan: {
          rules: [
            { required: true, message: '请输入赔付方案!' },
            { max: 500, message: '赔付方案最多500个字符!' },
          ],
        },
        customerOpinion: {
          rules: [
            { required: true, message: '请输入客户意见!' },
            { max: 500, message: '客户意见最多500个字符!' },
          ],
        },
        organOpinion: {
          rules: [
            { required: true, message: '请输入部门/子分公司处理方案、意见!' },
            { max: 500, message: '方案意见最多500个字符!' },
          ],
        },
        carOfUnit: {
          rules: [
            { required: true, message: '请输入车辆归属单位!' },
            { max: 50, message: '车辆归属单位最多50个字符!' },
          ],
        },
        carInsuranceUnit: {
          rules: [
            { required: true, message: '请输入车辆保险购买单位!' },
            { max: 50, message: '车辆保险购买单位最多50个字符!' },
          ],
        },
        payStrongInsurance: {
          rules: [
            {
              required: true,
              pattern: /(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/,
              message: '交强险赔付额格式不正确!',
            },
          ],
        },
        thirdPartyLiabilityInsurance: {
          rules: [
            {
              required: true,
              pattern: /(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/,
              message: '第三责任险保额格式不正确!',
            },
          ],
        },
        woundedHukouAttribution: { rules: [{ required: true, message: '请选择伤者户口归属!' }] },
        injuredArea: {
          rules: [
            { required: true, message: '请输入受伤部位!' },
            { max: 50, message: '受伤部位最多50个字符!' },
          ],
        },
        injuredDegree: {
          rules: [
            { required: true, message: '请输入受伤程度!' },
            { max: 50, message: '受伤程度最多50个字符!' },
          ],
        },
        thirdPersonIdCard: {
          rules: [
            { required: true, message: '请输入第三人身份号!' },
            {
              validator: (rule, val, callback) => {
                if (val) {
                  let reg =
                    /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
                  if (!reg.test(val)) {
                    callback('身份证号格式不正确!')
                  }
                }
                callback()
              },
            },
          ],
        },
        age: { rules: [{ required: true, pattern: /^[1-9]\d?$/, message: '年龄只能为正整数！' }] },
        injuredFamilyStatus: {
          rules: [
            { required: true, message: '请输入伤者家庭情况!' },
            { max: 50, message: '家庭情况最多50个字符!' },
          ],
        },
        treatmentCosts: {
          rules: [
            { required: true, pattern: /(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/, message: '治疗费格式不正确!' },
          ],
        },
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      url: {
        getinfo: '/hrBase/temployeeinfo/', //根据员工ID查询员工信息
        list: '/hrBase/temployeeinfo/pageForEmergency?deleteFlag=0', //员工信息列表请求地址
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        getCustomerInfo: '/hrBase/tcustomerinfo/',
        getCustomerById: '/hrBase/tcustomerinfo/getCusNameAndBusinessType', //查询客户单位
        getEmpInsurance: '/hrEmergency/tworkinjuryevent/insertInfo/', //获取该员工社保商险信息
        importUrl: '/hrEmergency/fileUpload/ossUploadFile', //上传文件
        delAttachUrl: '/hrEmergency/fileUpload/ossFileDelete/', //附件删除
        getAttachUrl: '/hrEmergency/fileUpload/ossFileUrl/domain/', //获取附件
        submitUrl: '/hrEmergency/tworkinjuryevent', //修改提交
      },
    }
  },

  methods: {
    selectRow(val) {
      this.selectRowVal = val
      this.resList = []
    },

    selectType(value) {
      this.traffic = Number(value) === 5 ? true : false
    },

    onSelect(value) {
      this.isCuringType = Number(value) === 1 ? false : true
    },

    handleSelect(val, option) {
      // setFieldsValue riskForm
      this.riskForm.setFieldsValue(pick({ riskBearUnit: val }, 'riskBearUnit'))
      console.log(val, option.componentOptions.children[0].elm.data)
    },

    async edit(record) {
      this.traffic = String(record.workInjuryEvent.eventType) === '5' && String(this.flag) === '0' ? true : false
      await this.initDictConfig(); // 異步處理，确保获取字典值时，值集已拿到
      this.riskForm.resetFields()
      this.thingForm.resetFields()
      this.model = record
      this.insuranceInfo.empPhone = record.workInjuryEvent.empPhone
      this.insuranceInfo.post = record.workInjuryEvent.post
      this.insuranceInfo.empAge = record.workInjuryEvent.empAge
      this.insuranceInfo.contractStart = record.workInjuryEvent.contractStart
      this.insuranceInfo.contractEnd = record.workInjuryEvent.contractEnd

      const workInjuryEvent = record.workInjuryEvent
      const workTitle = 
        workInjuryEvent.riskBear == 1
          ? getNameFromTree(this.treeData, workInjuryEvent.riskBearUnit, 'value', 'title')
          : getNameFromArr(this.organizationOption, workInjuryEvent.riskBearOrgan, 'id', 'organName')
      this.resList.push({ id: workInjuryEvent.riskBearUnit, title: workTitle})

      if (record.workInjuryEvent.isCuring) {
        this.isCuringType = false
      }
      this.remainParams = {
        empPhone: record.workInjuryEvent.empPhone,
        post: record.workInjuryEvent.post,
        empAge: record.workInjuryEvent.empAge,
        province: record.workInjuryEvent.province,
        provinceName: record.workInjuryEvent.provinceName,
        town: record.workInjuryEvent.town,
        townName: record.workInjuryEvent.townName,
        city: record.workInjuryEvent.city,
        cityName: record.workInjuryEvent.cityName,
        contractId: record.workInjuryEvent.contractId,
        contractEnd: record.workInjuryEvent.contractEnd,
        contractStart: record.workInjuryEvent.contractStart,
        emCusId: record.workInjuryEvent.emCusId,
        emIdCard: record.workInjuryEvent.emIdCard,
        emName: record.workInjuryEvent.emName,
        emSettleId: record.workInjuryEvent.emSettleId,
        empId: record.workInjuryEvent.empId,
        id: record.workInjuryEvent.id,
        socialId: record.workInjuryEvent.socialId,
        socialStatus: record.workInjuryEvent.socialStatus,
        insuranceStatus: record.workInjuryEvent.insuranceStatus,
      }
      // 结算主体和所属单位
      getAllSettleDomainSelectVos().then((res) => {
        if (Number(res.code) === 200) {
          this.settleDomainOptions = res.data
        } else {
          this.$message.error('结算主体和所属单位数据请求失败！')
        }
      })
      //商险
      if (record.insurance) {
        for (const item of record.insurance) {
          this.insuranceInfo.insuranceStr += ` ${item.insuranceTypeName}`
        }
      }
      this.selectRowVal = record.workInjuryEvent.riskBear
      //社保购买地
      this.insuranceInfo.area = record.workInjuryEvent.provinceName
        ? record.workInjuryEvent.provinceName + record.workInjuryEvent.cityName + record.workInjuryEvent.townName
        : ''
      //社保状态
      switch (record.workInjuryEvent.socialStatus) {
        case '0':
          this.insuranceInfo.socialStatusStr = '已购买，与劳动合同起始时间一致'
          break
        case '1':
          this.insuranceInfo.socialStatusStr = '已购买，与劳动合同起始时间不一致'
          break
        case '2':
          this.insuranceInfo.socialStatusStr = '未购买'
          break
      }
      //合同期限 历史时间次数
      httpAction(`${this.url.getEmpInsurance}${record.workInjuryEvent.empId}?type=0`, null, 'get').then((res) => {
        if (Number(res.code) === 200 && res.data) {
          // this.insuranceInfo.contractStart = res.data.contractStart
          // this.insuranceInfo.contractEnd = res.data.contractEnd
          this.insuranceInfo.record = res.data.record
        }
      })
      this.model = Object.assign({}, record.workInjuryEvent)
      const _this = this
      httpAction(this.url.getinfo + record.workInjuryEvent.empId, null, 'get').then((res) => {
        if (Number(res.code) === 200) {
          _this.rowEmpoyee = res.data
          _this.rowEmpoyee.empSex = filterDictText(_this.sexOptions, _this.rowEmpoyee.empSex)
          _this.rowEmpoyee.settleDomainName = _this.settleDomainOptions[_this.rowEmpoyee.settleDomain]
            ? _this.settleDomainOptions[_this.rowEmpoyee.settleDomain].departName
            : ''
          //查询客户单位
          const settleDomainId = _this.rowEmpoyee.settleDomain

          httpAction(
            `${_this.url.getCustomerById}?cusId=${_this.model.emCusId}&settleDomainId=${settleDomainId}`,
            null,
            'get'
          ).then((result) => {
            if (Number(result.code) === 200) {
              _this.rowEmpoyee.customerName = result.data.cusName //客户单位 this.businessTypeDicts
              _this.rowEmpoyee.businessTypeName = filterDict(_this.businessTypeDicts, result.data.businessType)
              _this.visible = true
              if (_this.model.riskBearOrgan) {
                _this.model.riskBearOrgan = parseInt(_this.model.riskBearOrgan)
                _this.$nextTick(() => {
                  _this.riskForm.setFieldsValue(
                    pick(_this.model, 'riskBear', 'riskBearOrgan', 'riskBearUnit', 'eventType')
                  )
                })
              } else {
                _this.$nextTick(() => {
                  _this.riskForm.setFieldsValue(pick(_this.model, 'riskBear', 'riskBearUnit', 'eventType'))
                })
              }
            } else {
              _this.$message.warning(result.msg)
            }
          })
        }
      })
    },

    next() {
      if (Number(this.current) === 0) {
        this.isCuringType = this.model.isCuring == 0 ? true : false
        this.model.eventOccurrenceTime = moment(this.model.eventOccurrenceTime)
        this.$nextTick(() => {
          if (this.traffic) {
            this.thingForm.setFieldsValue(
              pick(
                this.model,
                'carOfUnit',
                'carInsuranceUnit',
                'payStrongInsurance',
                'thirdPartyLiabilityInsurance',
                'eventOccurrenceTime',
                'eventOccurrenceAddr',
                'eventThrough',
                'woundedHukouAttribution',
                'injuredArea',
                'injuredDegree',
                'thirdPersonIdCard',
                'age',
                'injuredFamilyStatus',
                'treatmentCosts'
              )
            )
          } else {
            this.thingForm.setFieldsValue(
              pick(
                this.model,
                'eventOccurrenceTime',
                'eventOccurrenceAddr',
                'injuryPosition',
                'isCuring',
                'curingType',
                'curingHospital',
                'eventThrough'
              )
            )
          }
        })
        //验证
        this.allModel = {}
        this.riskForm.validateFields((err, values) => {
          if (!err) {
            this.allModel = Object.assign(this.allModel, values)
            this.current++
          }
        })
        return false
      }
      if (Number(this.current) === 1) {
        this.$nextTick(() => {
          this.planForm.setFieldsValue(pick(this.model, 'payPlan', 'customerOpinion', 'organOpinion'))
        })
        this.thingForm.validateFields((err, values) => {
          if (!err) {
            this.getDiffrenceSetData(this.allModel, values)
            //处理时间格式 values.eventOccurrenceTime
            values.eventOccurrenceTime = moment(values.eventOccurrenceTime).format('YYYY-MM-DD HH:mm:ss')
            this.allModel = Object.assign(this.allModel, values)
            this.current++
          }
        })
        return false
      }
      if (Number(this.current) === 2) {
        //获取附件信息
        httpAction(`${this.url.getAttachUrl}${this.model.id}?type=${this.flag}`, null, 'get').then((res) => {
          if (Number(res.code) === 200 && res.data) {
            this.fileList = []
            for (const item of res.data) {
              this.fileList.push({
                uid: item.id,
                name: item.attaName,
                status: 'done',
                url: item.attaSrc,
              })
            }
          } else {
            this.fileList = []
          }
        })
        this.planForm.validateFields((err, values) => {
          if (!err) {
            this.getDiffrenceSetData(this.allModel, values)
            this.allModel = Object.assign(this.allModel, values)
            this.current++
          }
        })
        return false
      }
      this.current++
    },

    prev() {
      //上一步
      if (Number(this.current) === 1) {
        this.thingForm.resetFields()
      }
      this.current--
    },

    // 保存按钮
    handleOk() {
      const _this = this
      _this.confirmLoading = true
      const formData = Object.assign(this.allModel, this.remainParams)
      httpAction(this.url.submitUrl, formData, this.method)
        .then((res) => {
          const msg = res.msg || res.message
          if (Number(res.code) === 200) {
            _this.$message.success(`${_this.title}成功！`)
            _this.$emit('ok')
            _this.close()
          } else {
            _this.$message.warning(msg)
          }
        })
        .finally(() => {
          _this.confirmLoading = false
        })
    },

    handleCancel() {
      this.close()
    },

    close() {
      this.riskForm.resetFields()
      this.$emit('close')
      this.visible = false
      this.current = 0
      this.resList = []
    },

    //取两个对象的差集
    getDiffrenceSetData(obj1, obj2) {
      for (const item in obj2) {
        if (item in obj1) {
          delete obj1[item]
        }
      }
    },

    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },

    //上传
    handleChange() {
      const { fileList } = this
      if (fileList[fileList.length - 1].name.length > 50) {
        this.$message.warning(fileList[fileList.length - 1].name + `文件名称长度超过50个字符`)
        this.fileList.splice(this.fileList.length - 1, 1)
        return false
      }
      if (fileList[fileList.length - 1].size > 10 * 1024 * 1024) {
        this.$message.warning(fileList[fileList.length - 1].name + `文件大小超过10M`)
        this.fileList.splice(this.fileList.length - 1, 1)
        return false
      }
      if (!/\.(gif|jpg|jpeg|png|xls|xlsx|csv|pdf|docx|doc|m4a|zip|rar)$/i.test(fileList[fileList.length - 1].name)) {
        this.$message.warning(fileList[fileList.length - 1].name + `文件格式不正确`)
        this.fileList.splice(this.fileList.length - 1, 1)
        return false
      }
      this.confirmLoading = true
      this.uploadFilesChange(fileList[fileList.length - 1])
    },

    uploadFilesChange(file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', this.flag)
      formData.append('domainId', this.remainParams.id)
      const contextType = { 'Content-Type': 'multipart/form-data' }
      this.fileList.splice(this.fileList.length - 1, 1)
      postActionHeader(this.url.importUrl, formData, contextType, 300000)
        .then((res) => {
          if (Number(res.code) === 200) {
            this.fileList.push(res.data)
            this.$message.success('上传成功！')
          } else {
            this.$message.warning(res.msg)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    removeFile(fileInfo) {
      const _this = this
      this.$confirm({
        title: '删除',
        content: '确定删除该附件？',
        okText: '确认',
        cancelText: '取消',
        onOk: function () {
          httpAction(_this.url.delAttachUrl + fileInfo.uid, null, 'get').then((res) => {
            if (Number(res.code) === 200) {
              _this.fileList.map((file, index) => {
                if (String(file.uid) === String(fileInfo.uid)) {
                  //删除该附件
                  _this.fileList.splice(index, 1)
                }
              })
              _this.$message.success('删除附件成功！')
            } else {
              _this.$message.warning(res.msg)
            }
          })
        },
      })
      return false
    },

    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    disabledDate(current) {
      return current > moment().endOf('day')
    },

    // 数据字典
    async initDictConfig() {
      // 性别

      const sexRes = await initDictOptions('sex')
      if (Number(sexRes.code) === 200) {
        this.sexOptions = sexRes.data
      }
      // initDictOptions('sex').then((res) => {
      //   if (Number(res.code) === 200) {
      //     this.sexOptions = res.data
      //   }
      // })
      // 业务类型
      // const customerRes = await initDictOptions('customer_business_type')
      // if (Number(customerRes.code) === 200) {
      //   this.businessTypeDicts = customerRes.data
      // }

      // 业务类型
      // initDictOptions('customer_business_type').then((res) => {
      //   if (Number(res.code) === 200) {
      //     this.businessTypeDicts = res.data
      //   }
      // })
      //治疗类型
      const treatmentRes = await initDictOptions('treatment_type');
      if(Number(treatmentRes.code) === 200){
        this.treatmentTypeOption = treatmentRes.data;
      }

      // initDictOptions('treatment_type').then((res) => {
      //   if (Number(res.code) === 200) {
      //     this.treatmentTypeOption = res.data
      //   }
      // })
    },

    // eslint-disable-next-line no-unused-vars
    treeSelectChange(value, label, extra) {
      httpAction(this.url.getCustomerInfo + value, null, 'GET').then((res) => {
        if (Number(res.code) === 200) {
          this.model.customerCode = res.data.customerCode
          this.$nextTick(() => {
            this.riskForm.setFieldsValue(pick(this.model, 'customerCode'))
          })
          const sz = pinyin(res.data.customerName, {
            style: pinyin.STYLE_FIRST_LETTER,
          })
          let ename = ''
          if (sz.length > 0) {
            for (const i of sz) {
              ename += i[0]
            }
          }
          this.contractCustomerName = ename.toUpperCase()
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
.stepFormText {
  :global(.ant-form-item-label) {
    width: 120px;
  }
}
.no-bottom {
  margin-bottom: 0px !important;
}
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}
.name {
  margin: 0px 10px 0px 0px;
  font-weight: bold;
  font-size: 18px;
}
.content {
  margin-top: 16px;
  padding: 20px;
}
.num {
  color: #f30505;
  text-decoration: underline;
}
.mbot {
  margin-bottom: 20px;
}
.overflow {
  display: inline-block;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>
