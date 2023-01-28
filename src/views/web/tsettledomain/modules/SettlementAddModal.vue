<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="1100"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <div v-show="current == 1">
        <a-card
          title="业务类型"
          :bordered="false"
        >
          <a-button
            slot="extra"
            :disabled="disNext"
            @click="nextStep"
          >下一步</a-button>
          <a-radio-group
            v-model="typeSelect.topType"
            class="firstType"
            @change="changeParent"
          >
            <a-radio-button
              v-for="item in treeList"
              :key="item.id"
              :value="String(item.id)"
            >{{ item.label }}</a-radio-button>
          </a-radio-group>
          <a-row
            class="rowLine"
            v-for="item in childList.children"
            :key="item.id"
          >
            <a-col :span="4">
              <span class="second">{{ item.label }}</span>
            </a-col>
            <a-col :span="20">

              <a-radio-group
                button-style="solid"
                v-model="typeSelect.sonType"
                @change="changeType($event,item.id)"
              >
                <a-radio-button
                  v-for="items in item.children"
                  :key="items.id"
                  :value="items"
                >{{ items.label }}</a-radio-button>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-card>
        <a-card
          title="服务项目"
          :bordered="false"
          class="service"
        >
          <a-checkable-tag
            v-for="(item,index) in serverItemDicts"
            :key="item.id"
            @change="changeType()"
            v-model="serverChecked[index]"
          >{{ item.label }}</a-checkable-tag>
        </a-card>
      </div>

      <div v-show="current == 2">
        <a-card
          title="业务信息"
          :bordered="false"
        >
          <template slot="extra">
            <a-button
              @click="preStep"
              style="margin-right:15px;"
            >上一步</a-button>
            <a-button
              key="next"
              :loading="confirmLoading"
              @click="nextRemind"
            >下一步</a-button>
            <!-- <a-button
              key="submit"
              type="primary"
              :loading="confirmLoading"
              @click="handleOk"
            >提交</a-button> -->
          </template>

          <a-form
            :form="settleDomainForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="结算主体名称"
                >
                  <a-input
                    placeholder="请输入结算主体名称"
                    style="width: 270px"
                    v-decorator="['departName', validatorRules.departName ]"
                  />
                </a-form-item>
              </a-col>
              <a-col
                :span="12"
                v-if="typeSelect.type == 0"
              >
                <a-form-item
                  class="stepFormText"
                  label="所属地区"
                >
                  <a-select
                    showSearch
                    placeholder="选择省份"
                    optionFilterProp="children"
                    style="width: 90px"
                    v-decorator="['province', validatorRules.province ]"
                    @change="handleProvinceChange"
                    :dropdownMatchSelectWidth="false"
                  >
                    <a-select-option
                      v-for="(item, index) in areaTrees"
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
                    style="width: 90px"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['city', validatorRules.city ]"
                    @change="handleCityChange"
                  >
                    <a-select-option
                      v-for="(item, index) in areaCitys"
                      :key="index"
                      :value="item.id"
                    >{{ item.areaName }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-select
                    showSearch
                    placeholder="选择区县"
                    optionFilterProp="children"
                    :dropdownMatchSelectWidth="false"
                    style="width: 90px"
                    v-decorator="['town', {}]"
                  >
                    <a-select-option
                      v-for="(item, index) in areaTowns"
                      :key="index"
                      :value="item.id"
                    >{{ item.areaName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="客户单位"
                >
                  <a-select
                    showSearch
                    placeholder="请选择所属客户"
                    optionFilterProp="children"
                    style="width: 270px"
                    @search="searchCustomer"
                    @change="selectCustomer"
                    :filter-option="filterOptionGs"
                    :dropdownMatchSelectWidth="false"
                    :disabled="disabledCustomer"
                    v-decorator="['customerId', validatorRules.customerId ]"
                    :notFoundContent="fetching ? undefined : null"
                  >
                    <a-spin slot="notFoundContent" v-if="fetching"/>
                    <div
                      slot="dropdownRender"
                      slot-scope="menu"
                    >
                      <v-nodes :vnodes="menu" />
                      <a-divider
                        style="margin: 4px 0;"
                        v-if="stotal > 10"
                      />
                      <div
                        @mousedown="e => e.preventDefault()"
                        style="margin-bottom:4px;text-align:center"
                      >
                        <a-pagination
                          size="small"
                          :total="stotal"
                          :defaultPageSize="10"
                          :hideOnSinglePage="true"
                          @change="changePage"
                        />
                      </div>
                    </div>
                    <a-select-option
                      v-for="(item, index) in customers"
                      :key="index"
                      :value="item.id"
                    >
                      <a-tooltip>
                        <template slot="title">
                          {{ item.customerName }}
                        </template>
                        {{ item.customerName }}
                      </a-tooltip>
                    </a-select-option>
                  </a-select>
                  <a-input
                    type="hidden"
                    v-decorator="['customerName']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="创建类型"
                >
                  <a-radio-group v-decorator="['createType', validatorRules.createType ]" @change="changeCreateType" :disabled="createTypeDisabled">
                    <a-radio value="0">合同之后</a-radio>
                    <a-radio value="1">合同之前</a-radio>
                  </a-radio-group>
                  <a-input
                    type="hidden"
                    v-decorator="['relateFlag',{ initialValue:'0' }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24" v-if="createTypeFlag">
                <a-form-item
                  class="stepFormText"
                  label="异常说明"
                >
                  <a-textarea placeholder="请输入异常说明" :row="4" v-decorator="['exceptionRemark', validatorRules.exceptionRemark ]"/>
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="showContract">
                <a-form-item
                  class="stepFormText"
                  label="业务合同"
                >
                  <a-select
                    showSearch
                    placeholder="请选择业务合同"
                    optionFilterProp="children"
                    :filter-option="filterOptionGs"
                    style="width: 270px"
                    :disabled="isContract"
                    @change="selectContract"
                    :dropdownMatchSelectWidth="false"
                    :allowClear="true"
                    v-decorator="['belongContract', validatorRules.belongContract ]"
                  >
                    <a-select-option
                      v-for="(item, index) in customerContracts"
                      :key="index"
                      :value="item.id"
                    >
                      <a-tooltip>
                        <template slot="title">
                          {{ item.contractName }}
                        </template>
                        {{ item.contractName }}
                      </a-tooltip>
                    </a-select-option>
                  </a-select>
                  <a-input
                    type="hidden"
                    v-decorator="['contractName']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="一级指标归属"
                >
                  <a-select
                    showSearch
                    placeholder="请选择一级指标归属"
                    optionFilterProp="children"
                    :filter-option="filterOptionGs"
                    style="width: 270px"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['incomeBelong', validatorRules.incomeBelong ]"
                  >
                    <a-select-option
                      v-for="(item, index) in belongOrgan.first"
                      :key="index"
                      :value="String(item.id)"
                    >
                      <a-tooltip>
                        <template slot="title">
                          {{ item.organName }}
                        </template>
                        {{ item.organName }}
                      </a-tooltip>
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="二级指标归属"
                >
                  <a-select
                    allowClear
                    showSearch
                    placeholder="请选择二级指标归属"
                    optionFilterProp="children"
                    :filter-option="filterOptionGs"
                    :dropdownMatchSelectWidth="false"
                    style="width: 270px"
                    v-decorator="['incomeBelongSub', validatorRules.incomeBelongSub ]"
                  >
                    <a-select-option
                      v-for="(item, index) in belongOrgan.second"
                      :key="index"
                      :value="String(item.id)"
                    >
                      <a-tooltip>
                        <template slot="title">
                          {{ item.organName }}
                        </template>
                        {{ item.organName }}
                      </a-tooltip>
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
        <a-card
          title="结算配置"
          :bordered="false"
        >
          <a-form
            :form="departSettlementInfoForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  layout="inline"
                  label="缴税类型"
                >
                  <a-select
                    placeholder="缴税类型"
                    optionFilterProp="children"
                    style="width: 180px;"
                    v-decorator="['taxType', validatorRules.taxType ]"
                    @change="changeTaxType($event,1)"
                  >
                    <a-select-option
                      v-for="(item,index) in taxTypeDicts"
                      :key="index"
                      :value="String(item.id)"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col
                :span="12"
                v-if="show.unitIllness"
              >
                <a-form-item
                  class="stepFormText"
                  label="单位大病比例"
                  extra="默认为100"
                >
                  <a-input
                    placeholder="单位大病比例"
                    style="width: 180px;"
                    addonAfter="%"
                    v-decorator="['unitSeriousIllnessProp', validatorRules.unitSeriousIllnessProp ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="缴税税率"
                >
                  <!-- <a-input
                    placeholder="缴税税率"
                    style="width: 180px;"
                    addonAfter="%"
                    v-decorator="['taxFee', validatorRules.taxFee ]"
                  /> -->
                  <a-select
                    placeholder="缴税税率"
                    optionFilterProp="children"
                    style="width: 180px;"
                    v-decorator="['taxFee',validatorRules.taxFee]"
                  >
                    <a-select-option
                      v-for="(item,index) in taxFeeSettleDicts"
                      :key="index"
                      :value="String(item.value)"
                    >{{ item.label }}%</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col
                :span="12"
                v-if="show.socialCard"
              >
                <a-form-item
                  class="stepFormText"
                  label="社保卡收取"
                >
                  <a-select
                    placeholder="社保卡收取"
                    optionFilterProp="children"
                    style="width: 180px;"
                    v-decorator="['socialCardTaker', validatorRules.socialCardTaker ]"
                  >
                    <a-select-option value="0">单位</a-select-option>
                    <a-select-option value="1">个人</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
        <a-card
          title="管理费"
          :bordered="false"
          v-if="show.management && typeSelect.type == 0"
        >
          <a-form
            :form="manageForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item
                  class="stepFormText"
                  label="是否收费"
                >
                  <a-select
                    placeholder="是否收费"
                    optionFilterProp="children"
                    style="width: 150px;"
                    @change="changeManage"
                    v-decorator="['managementTag', validatorRules.managementTag ]"
                  >
                    <a-select-option value="0">是</a-select-option>
                    <a-select-option value="1">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  class="stepFormText"
                  label="收费方式"
                >
                  <a-select
                    placeholder="收费方式"
                    optionFilterProp="children"
                    style="width: 150px;"
                    :disabled="manageDisable"
                    @change="changeManageType"
                    v-decorator="['managementType', manageFormValidatorRules.managementType ]"
                  >
                    <a-select-option value="0">按固定值收费</a-select-option>
                    <a-select-option value="1">按比例收费</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  class="stepFormText"
                  label="费率/金额"
                >
                  <a-input
                    :placeholder="manageAddon?'费率':(manageAddon=='' ? '金额' : '费率/金额')"
                    :disabled="manageDisable"
                    :addonAfter="manageAddon"
                    style="width: 150px;"
                    v-decorator="['managementFee', manageFormValidatorRules.managementFee ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8" v-if="manageAddon">
                <a-form-item
                  class="stepFormText"
                  label="收取项目"
                >
                  <a-select
                    showSearch
                    placeholder="收取项目"
                    optionFilterProp="children"
                    mode="multiple"
                    :disabled="manageDisable"
                    style="width: 150px;"
                    v-decorator="['manageServerItem', manageFormValidatorRules.manageServerItem ]"
                  >
                    <a-select-option
                      v-for="item in manageServerItemsDicts"
                      :key="item.label"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  class="stepFormText"
                  label="税收类型"
                >
                  <a-select
                    placeholder="税收类型"
                    optionFilterProp="children"
                    style="width: 150px;"
                    :disabled="manageDisable"
                    v-decorator="['managementTaxTag', manageFormValidatorRules.managementTaxTag ]"
                  >
                    <a-select-option value="0">税前</a-select-option>
                    <a-select-option value="1">税后</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  class="stepFormText"
                  label="是否扣税"
                >
                  <a-select
                    placeholder="是否扣税"
                    optionFilterProp="children"
                    style="width: 150px;"
                    :disabled="manageDisable"
                    v-decorator="['managementExpFlag', manageFormValidatorRules.managementExpFlag ]"
                  >
                    <a-select-option value="0">是</a-select-option>
                    <a-select-option value="1">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
        <a-card
          title="风险金"
          :bordered="false"
          v-if="show.risk && typeSelect.type == 0"
        >
          <a-form
            :form="riskForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item
                  class="stepFormText"
                  label="是否收费"
                >
                  <a-select
                    placeholder="是否收费"
                    optionFilterProp="children"
                    style="width: 150px;"
                    @change="changeRisk"
                    v-decorator="['riskFundTag', validatorRules.managementTag ]"
                  >
                    <a-select-option value="0">是</a-select-option>
                    <a-select-option value="1">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  class="stepFormText"
                  label="收费方式"
                >
                  <a-select
                    placeholder="收费方式"
                    optionFilterProp="children"
                    style="width: 150px;"
                    :disabled="riskDisable"
                    @change="changeRiskType"
                    v-decorator="['riskFundType', riskFormValidatorRules.riskFundType ]"
                  >
                    <a-select-option value="0">按固定值收费</a-select-option>
                    <a-select-option value="1">按比例收费</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  class="stepFormText"
                  label="费率/金额"
                >
                  <a-input
                    :placeholder="riskAddon?'费率':(riskAddon==''?'金额':'费率/金额')"
                    style="width: 150px;"
                    :disabled="riskDisable"
                    :addonAfter="riskAddon"
                    v-decorator="['riskFundFee', riskFormValidatorRules.riskFundFee ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8" v-if="riskAddon">
                <a-form-item
                  class="stepFormText"
                  label="收取项目"
                >
                  <a-select
                    showSearch
                    placeholder="收取项目"
                    optionFilterProp="children"
                    mode="multiple"
                    :disabled="riskDisable"
                    style="width: 150px;"
                    v-decorator="['riskServerItem', riskFormValidatorRules.riskServerItem ]"
                  >
                    <a-select-option
                      v-for="item in riskServerItemsDicts"
                      :key="item.label"
                      :value="item.label"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  class="stepFormText"
                  label="税收类型"
                >
                  <a-select
                    placeholder="税收类型"
                    optionFilterProp="children"
                    style="width: 150px;"
                    :disabled="riskDisable"
                    v-decorator="['riskFundTaxTag', riskFormValidatorRules.managementTaxTag ]"
                  >
                    <a-select-option value="0">税前</a-select-option>
                    <a-select-option value="1">税后</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
        <a-card
          title="商险（单独结算）配置"
          :bordered="false"
          v-if="show.insuranceManagement && typeSelect.type == 0"
        >
          <a-form
            :form="departBusinessRisksSettlementForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item
                  class="stepFormText"
                  label="是否收费"
                >
                  <a-select
                    placeholder="是否收费"
                    optionFilterProp="children"
                    style="width: 150px;"
                    @change="insuranceChange"
                    v-decorator="['managementTag',validatorRules.managementTag]"
                  >
                    <a-select-option value="0">收取</a-select-option>
                    <a-select-option value="1">不收取</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  class="stepFormText"
                  label="收费方式"
                >
                  <a-select
                    placeholder="收费方式"
                    optionFilterProp="children"
                    style="width: 150px;"
                    :disabled="insuranceDisable"
                    @change="insuranceChangeType"
                    v-decorator="['riskManagementType',insuranceValidatorRules.riskManagementType]"
                  >
                    <a-select-option value="0">按固定值收取</a-select-option>
                    <a-select-option value="1">按比例收取</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col
                :span="8"
                v-if="insuranceType"
              >
                <a-form-item
                  class="stepFormText"
                  label="费率/金额"
                >
                  <a-input
                    :placeholder="insuranceType == 1 ?'费率/金额':'金额'"
                    style="width: 150px;"
                    :disabled="insuranceDisable"
                    v-decorator="['riskManagementFee', insuranceValidatorRules.riskManagementFee ]"
                  />
                </a-form-item>
              </a-col>
              <a-col
                :span="8"
                v-if="!insuranceType"
              >
                <a-form-item
                  class="stepFormText"
                  label="费率/金额"
                >
                  <a-input
                    placeholder="费率"
                    addonAfter="%"
                    :disabled="insuranceDisable"
                    style="width:150px;"
                    v-decorator="['riskManagementTax', insuranceValidatorRules.riskManagementTax ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  class="stepFormText"
                  label="是否含税"
                >
                  <a-select
                    placeholder="是否含税"
                    optionFilterProp="children"
                    style="width: 150px;"
                    :disabled="insuranceDisable"
                    @change="riskManagementTaxTagChange"
                    v-decorator="['riskManagementTaxTag',insuranceValidatorRules.riskManagementTaxTag]"
                  >
                    <a-select-option value="1">含税</a-select-option>
                    <a-select-option value="0">不含税</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  class="stepFormText"
                  label="商险缴税类型"
                >
                  <a-select
                    placeholder="商险缴税类型"
                    optionFilterProp="children"
                    style="width: 150px;"
                    :disabled="insuranceDisable || insuranceTaxDisable"
                    v-decorator="['taxType',insuranceValidatorRules.taxType]"
                    @change="changeTaxType($event,2)"
                  >
                    <a-select-option
                      v-for="(item,index) in taxTypeDicts"
                      :key="index"
                      :value="String(item.id)"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  class="stepFormText"
                  label="商险缴税税率"
                >
                  <!-- <a-input
                    placeholder="缴税税率"
                    style="width: 150px;"
                    :disabled="insuranceDisable || insuranceTaxDisable"
                    addonAfter="%"
                    v-decorator="['taxValue', insuranceValidatorRules.taxValue ]"
                  /> -->
                  <a-select
                    placeholder="缴税税率"
                    optionFilterProp="children"
                    style="width: 150px;"
                    :disabled="insuranceDisable || insuranceTaxDisable"
                    v-decorator="['taxValue',insuranceValidatorRules.taxValue]"
                  >
                    <a-select-option
                      v-for="(item,index) in taxFeeDicts"
                      :key="index"
                      :value="String(item.value)"
                    >{{ item.label }}%</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

            </a-row>
          </a-form>
        </a-card>
        <a-card
          title="核准表开票信息"
          :bordered="false"
          v-if="show.approvalFormTickect && typeSelect.type == 0"
        >
          <a-form
            :form="approvalFormTickectForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  label="客户开票名称"
                  class="stepFormText"
                >
                  <a-input
                    placeholder="请输入客户开票名称"
                    style="width: 300px;"
                    v-decorator="['customerTicketName', approvalFormTickectRules.customerTicketName ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="我司到款单位名称"
                  class="stepFormText1"
                >
                  <!-- <a-input
                    placeholder="请输入我司到款单位名称"
                    v-decorator="['selfTomoneyUnitName', approvalFormTickectRules.selfTomoneyUnitName ]"
                  /> -->
                  <a-select
                    placeholder="请选择我司到款单位名称"
                    optionFilterProp="children"
                    style="width: 300px;"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['selfTomoneyUnitName',{rules: [{ required: true, message: '请选择我司到款单位名称!' }]}]"
                  >
                    <a-select-option
                      v-for="item in incomeCustomer"
                      :key="item.value"
                      :value="item.value">
                      <a-tooltip>
                        <template slot="title">
                          {{ item.value }}
                        </template>
                        {{ item.value }}
                      </a-tooltip>
                    </a-select-option>
                  </a-select>

                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
        <a-card
          title="垫付"
          :bordered="false"
          v-if="typeSelect.type == 0"
        >
          <a-form
            :form="paymentForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="垫付类型"
                  class="stepFormText"
                >
                  <a-select
                    placeholder="垫付类型"
                    optionFilterProp="children"
                    style="width: 150px;"
                    @change="changeAdvance"
                    v-decorator="['existAdvancePayment',{rules: [{ required: true, message: '请选择垫付类型!' }]}]"
                  >
                    <a-select-option value="1">业务约定性垫付</a-select-option>
                    <a-select-option value="0">偶发性垫付</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="预计回款周期"
                  class="stepFormText1"
                >
                  <a-select
                    placeholder="请选择预计回款周期"
                    style="width: 150px;"
                    :disabled="disabledBackPayCycle"
                    v-decorator="['backPayCycle',{rules: [{ required: true, message: '请选择预计回款周期!' }]}]"
                  >
                    <a-select-option
                      v-for="item in [1,2,3,4,5,6,7,8,9,10,11,12]"
                      :key="item"
                      :value="String(item)"
                    >{{ item }}</a-select-option>
                  </a-select>个月
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
        <a-card
          title="封面设置"
          :bordered="false"
          v-if="typeSelect.type == 0"
        >
          <a-form
            :form="tableHeaderCoverForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row
              :gutter="24"
              v-for="(k,index) in tableHeaderCoverForm.getFieldValue('keys')"
              :key="index"
            >
              <a-col :span="12">
                <a-form-item
                  label="封面类型"
                  class="stepFormText"
                >
                  <a-select
                    placeholder="请选择封面类型"
                    optionFilterProp="children"
                    style="width: 180px;"
                    v-decorator="[
                      `type[${index}]`,
                      {
                        validateTrigger: ['change'],
                        rules: [{
                          required: true,
                          message: '请选择封面类型！',
                        }],
                      }
                    ]"
                  >
                    <a-select-option value="0">薪资封面</a-select-option>
                    <a-select-option value="1">商险封面</a-select-option>
                    <!-- <a-select-option value="2">核准表封面</a-select-option> -->
                    <a-select-option value="3">代理预估封面</a-select-option>
                  </a-select>
                  <a-input type="hidden" v-decorator="[`id[${index}]`]"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="抬头名称"
                >
                  <a-select
                    showSearch
                    allowClear
                    placeholder="请选择抬头名称"
                    optionFilterProp="children"
                    :filterOption="filterOption"
                    :dropdownMatchSelectWidth="false"
                    style="width: 300px;"
                    v-decorator="[
                      `coverName[${index}]`,
                      {
                        validateTrigger: ['change'],
                        rules: [{
                          required: true,
                          message: '请选择抬头名称！',
                        }],
                      }
                    ]"
                  >
                    <a-select-option v-for="(item,i) in coverNameList[index]" :key="i" :value="item">
                      <a-tooltip>
                        <template slot="title">
                          {{ item }}
                        </template>
                        {{ item }}
                      </a-tooltip>
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <span style="vertical-align: -webkit-baseline-middle;">
                  <a-icon
                    class="dynamic-delete-button"
                    type="plus-circle"
                    v-if="index===0"
                    @click="addItem()"
                  />
                  <a-icon
                    v-if="index!==0"
                    class="dynamic-delete-button"
                    type="minus-circle-o"
                    :disabled="tableHeaderCoverForm.getFieldValue('keys').length === 1"
                    @click="remove(index)"
                  />
                </span>

              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </div>

      <div v-show="current == 3">
        <a-card title="结算提醒配置" :bordered="false">
          <span slot="extra">
            <a-button @click="goSecond">上一步</a-button>
            <a-button
              key="submit"
              type="primary"
              :loading="confirmLoading"
              style="margin-left:15px"
              @click="handleOk"
            >提交</a-button>

          </span>
          <a-form
            :form="remaindSetForm"
            class="remaind"
            layout="inline"
          >
            <a-row>
              <a-col :span="3" class="borderRight borderBottom">提醒项目</a-col>
              <a-col :span="3" class="borderRight borderBottom">结算周期</a-col>
              <a-col :span="4" class="borderRight borderBottom">提醒日期</a-col>
              <a-col :span="4" class="borderRight borderBottom">首次提醒日期</a-col>
              <a-col :span="4" class="borderRight borderBottom">提醒方式</a-col>
              <a-col :span="3" class="borderRight borderBottom">提醒对象</a-col>
              <a-col :span="3" class="borderBottom">是否开启提醒</a-col>
            </a-row>
            <a-row
              v-for="(item,key) in remaindSet"
              :key="key"
            >
              <a-col :span="3" class="borderRight borderBottom">{{ item.project }}</a-col>
              <a-col :span="3" class="borderRight borderBottom">
                <a-form-item style="margin-left:4px">
                  <a-select
                    showSearch
                    placeholder="请选择结算周期"
                    optionFilterProp="children"
                    :dropdownMatchSelectWidth="false"
                    style="width: 100px;"
                    v-decorator="[`cycle[${key}]`, { initialValue:1,rules: [{ required: true, message: '请选择结算周期!' }] } ]"
                  >
                    <a-select-option
                      v-for="(items, index) in [1,2,3,4,5,6,7,8,9,10,11,12]"
                      :key="index"
                      :value="items"
                    >{{ items }}个月</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4" class="borderRight borderBottom">
                <a-form-item class="stepFormText">
                  每月第
                  <a-select
                    showSearch
                    placeholder="请选择提醒日期"
                    optionFilterProp="children"
                    :dropdownMatchSelectWidth="false"
                    style="width: 60px"
                    v-decorator="[`alertDay[${key}]`, {initialValue:25, rules: [{ required: true, message: '请选择提醒日期!' }] } ]"
                  >
                    <a-select-option
                      v-for="(value, index) in Array.apply(null, Array(28)).map(function(item, i) {return i+1})"
                      :key="index"
                      :value="value"
                    >{{ value }}</a-select-option>
                  </a-select>
                  日
                </a-form-item>
              </a-col>
              <a-col :span="4" class="borderRight borderBottom">
                <a-form-item style="margin-left:8px">
                  <a-date-picker :allowClear="false" v-decorator="[`firstAlertDate[${key}]`, { initialValue:moment(moment().format('YYYY-MM-25')),rules: [{ required: true, message: '请选择首次提醒日期!' }] } ]"/>
                </a-form-item>
              </a-col>
              <a-col :span="4" class="borderRight borderBottom">
                <a-form-item class="stepFormText">
                  <a-checkbox-group
                    v-decorator="[`alertEmail[${key}]`, { initialValue:['0','1'] }]"
                    :disabled="true"
                  >
                    <a-checkbox value="0">邮件</a-checkbox>
                    <a-checkbox value="1">系统消息</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
              </a-col>
              <a-col :span="3" class="borderRight borderBottom">
                <a-form-item class="stepFormText" style="margin-left:5px">
                  <a-select
                    placeholder="请选择提醒对象"
                    optionFilterProp="children"
                    :dropdownMatchSelectWidth="false"
                    style="width: 100px"
                    v-decorator="[`alertTarget[${key}]`, {initialValue:'服务客服', rules: [{ required: true, message: '请选择提醒对象!' }] } ]"
                  >
                    <a-select-option value="服务客服">服务客服</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="3" class="borderBottom">
                <a-form-item class="stepFormText">
                  <a-switch v-decorator="[`status[${key}]`,{ initialValue:'checked',valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
            </a-row>

          </a-form>
        </a-card>
      </div>

      <settlement-submit-modal ref="SettlementSubmitForm" @ok="submitOk"></settlement-submit-modal>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import Vue from 'vue'
import pick from 'lodash.pick'
import SelectPage from '@/components/jeecg/SelectPage'
import { getAllTree } from '@/utils/common'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import SettlementSubmitModal from './SettlementSubmitModal'
import moment from 'moment'

let index = 0;
export default {
  name: 'SettlementAddModal',
  components: {
    SelectPage,
    SettlementSubmitModal,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    return {
      visible: false,
      title: '添加结算主体',
      confirmLoading: false,
      settleDomainForm: this.$form.createForm(this),
      remaindSetForm: this.$form.createForm(this),
      manageForm: this.$form.createForm(this),
      riskForm: this.$form.createForm(this),
      paymentForm: this.$form.createForm(this),
      dockingPeopleForm: this.$form.createForm(this),
      ticketConfigForm: this.$form.createForm(this),
      approvalFormTickectForm: this.$form.createForm(this),
      departEngineeringSettlementForm: this.$form.createForm(this),
      departBusinessRisksSettlementForm: this.$form.createForm(this),
      departAppointInfoForm: this.$form.createForm(this),
      departSettlementInfoForm: this.$form.createForm(this),
      settleCoverName:[],
      coverNameList:[],//抬头名称列表
      model: {
        settleDomain: {},
        departSettlementInfo: {},
        businessRisksSettlement: {},
        approvalFormTickect: {},
        tableHeadSalaryCover: [],
      },
      validatorRules: {
        //结算主体数据校验
        departNo: { rules: [{ required: true, message: '请输入结算主体编码!' }] },
        departName: {
          rules: [
            { required: true, message: '请输入结算主体名称!' },
            { max: 32, message: '结算主体名称最多32个字符!' }
          ]
        },
        createType: { rules: [{ required: true, message: '请选择创建类型!' }],initialValue:'0' },
        exceptionRemark: { rules: [{ required: true, message: '请输入异常说明!' },{max:500,message:'异常说明最多500个字符!'}] },
        belongContract: { rules: [{ required: true, message: '请输入合同主体!' }] },
        incomeBelong: { rules: [{ required: true, message: '请选择一级指标归属!' }] },
        incomeBelongSub: { rules: [{ required: true, message: '请选择二级指标归属!' }] },
        customerId: { rules: [{ required: true, message: '请输入所属客户!' }] },
        province: { rules: [{ required: true, message: '省份不能为空!' }] },
        city: { rules: [{ required: true, message: '城市不能为空!' }] },
        taxType: { rules: [{ required: true, message: '缴税类型不能为空!' }] },
        unitSeriousIllnessProp: {
          rules: [
            {
              pattern: /^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|100|0)$/,
              message: '单位大病比例格式不正确!'
            },
            { required: true, message: '单位大病比例不能为空!' }
          ],
          initialValue: 100
        },
        taxFee: {rules: [{ required: true, message: '缴税税率不能为空!' }]},
        managementTag: { rules: [{ required: true, message: '是否收费不能为空!' }] },
        managementType: { rules: [{ required: true, message: '收费方式不能为空!' }] },
        // riskManagementFee: { rules: [
        //   { required: true, message: '金额不能为空!' },
        //   { pattern: /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|0$/, message: '金额格式不正确!' },
        // ] },
        // riskManagementTax: {
        //   rules: [
        //     { required: true, message: '费率不能为空!' },
        //     {
        //       pattern: /^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|100|0)$/,
        //       message: '费率格式不正确!'
        //     }
        //   ]
        // },
        socialCardTaker: { rules: [{ required: true, message: '社保卡是否收取不能为空!' }] },
        
      },
      manageFormValidatorRules: {
        managementType: { rules: [{ required: true, message: '收费方式不能为空!' }] },
        riskManagementFee: { rules: [
          { required: true, message: '金额不能为空!' },
          { pattern: /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|0$/, message: '金额格式不正确!' },
        ] },
        managementFee: { rules: [
          { required: true, message: '金额不能为空!' },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '金额格式不正确!' },
        ]},
        riskManagementTax: {
          rules: [
            { required: true, message: '费率不能为空!' },
            {
              pattern: /^(\d\.([1-9]{1,3}|\d{1,3})$|^[1-9]\d{0,1}(\.\d{1,3}){0,1}|100|0)$/,
              message: '费率格式不正确!'
            }
          ]
        },
        manageServerItem: { rules: [{ required: true, message: '收取项目不能为空!' }] },
        managementTaxTag: { rules: [{ required: true, message: '税收类型不能为空!' }] },
        managementExpFlag: { rules: [{ required: true, message: '是否扣税!' }], initialValue: '0' },
      },
      riskFormValidatorRules: {
        managementType: { rules: [{ required: true, message: '收费方式不能为空!' }] },
        riskFundType: { rules: [{ required: true, message: '收费方式不能为空!' }] },
        riskFundFee: { rules: [
          { required: true, message: '费率/金额不能为空!' },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '金额格式不正确!' }
        ] },
        riskServerItem: { rules: [{ required: true, message: '收取项目不能为空!' }] },
        managementTaxTag: { rules: [{ required: true, message: '税收类型不能为空!' }] },
      },
      insuranceValidatorRules: {
        riskManagementType: { rules: [{ required: true, message: '收费方式不能为空!' }] },
        
        riskManagementFee: { rules: [
          { required: true, message: '金额不能为空!' },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '金额格式不正确!' }
        ] },
        riskManagementTax: { rules: [
          { required: true, message: '费率不能为空!' },
          {
            pattern: /^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|100|0)$/,
            message: '费率格式不正确!'
          }
        ] },
        riskManagementTaxTag: { rules: [{ required: true, message: '是否含税不能为空!' }] },
        taxType: { rules: [{ required: true, message: '商险缴税类型不能为空!' }] },
        taxValue: { rules: [{ required: true, message: '商险缴税税率不能为空!' }] },
      },
      approvalFormTickectRules: {
        customerTicketName: { rules: [{ required: true, message: '客户开票名称不能为空!' }] },
        selfTomoneyUnitName: { rules: [{ required: true, message: '我司到款单位名称不能为空!' }] },
      },
      departBusinessRisksSettlementRules: {
        managementTag: { rules: [{ required: true, message: '管理费是否收费不能为空!' }] },
        taxType: { rules: [{ required: true, message: '缴税类型不能为空!' }] },
        taxValue: {
          rules: [
            { required: true, message: '缴税税率不能为空!' },
            {
              pattern: /^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|100|0)$/,
              message: '缴税税率格式不正确!'
            }
          ]
        },
        riskManagementType: { rules: [] },
        riskManagementFee: { rules: [] },
        riskManagementTax: { rules: [] },
        riskManagementTaxTag: { rules: [] }
      },
      show:{
        unitIllness: true,
        socialCard: true,
        insuranceManagement: true,
        management: true,
        risk: true,
        approvalFormTickect:true,
      },
      url: {
        add: '/hrBase/tsettledomain/vo',
        edit: '/hrBase/tsettledomain',
        getCustomerContract: '/hrBase/tcustomercontract/',
        getIncomeBelongSub: '/admin/organizationinfo/getDepartByUnitId',
        getContract: '/hrBase/tcustomercontract/getOwnContract?type=0&name=',
        getCustomerList: '/hrBase/tcustomerinfo/page?selectType=0&customerName=',
        getCustomerContractList: '/hrBase/tcustomercontract/page?selectType=3&size=50&customerId='
      },
      current: 1,
      remaindSet:[],
      treeList:[],
      typeList:[], // 所有三级类型
      childList:[],
      serverItemDicts:[],
      serverChecked:[],
      typeSelect:{
        topType: '1',
        secondType:'',
        sonType:'',
        type:0 , // 0：人事；1：非人事
      },
      prAuditFlagOption:['通过','不通过','待审核','待提交','全国业务中心审核','已办理','已归档'],
      disNext:true,
      areaTrees:[],
      areaCitys:[],
      areaTowns:[],
      manageDisable: false,
      riskDisable: false,
      insuranceType: 1,
      insuranceDisable: false,
      insuranceTaxDisable: false,
      fetching:false,
      isContract: true,
      disabledCustomer: false,
      customerContracts: [],
      manageServerItemsDicts: [],
      riskServerItemsDicts: [],
      customers: [],
      organAll: [],
      taxTypeDicts: [],
      stotal: 10,
      searchCustomerKey: '',
      coverLength: [{id:'',type:'',coverName:''}],
      manageAddon: null,
      riskAddon: null,
      method:'add',
      belongOrgan:{
        first:[],
        second:[],
      },
      taxFeeSettleDicts:[],
      taxFeeDicts:[],
      createTypeFlag: false,
      showContract: true,
      createTypeDisabled: false,
      disabledBackPayCycle: false,
      incomeCustomer: [], // 到款单位

    }
  },
  created() {
    this.initDictConfig()
    this.areaTrees = Vue.ls.get('glob_area')
    httpAction(`/hrBase/sysdictbusinesstypehr/getSysDictBusinessTypeList`,null,'get').then(res=>{
      if(res.code === 200) {
        this.typeList = res.data
        this.treeList = getAllTree(res.data)
        this.changePage(1)
      }
    })
  },
  beforeCreate() {
    this.tableHeaderCoverForm = this.$form.createForm(this, { name: 'costExpenditureType' });
    this.tableHeaderCoverForm.getFieldDecorator('keys', { initialValue: [0], preserve: true });
  },
  methods: {
    moment,
    changeAdvance(val){
      if(val === '0'){
        this.disabledBackPayCycle = true
        this.$nextTick(() => {
          this.paymentForm.setFieldsValue(pick({backPayCycle:2},'backPayCycle'))
        })
      }else{
        this.disabledBackPayCycle = false
      }
    },
    filterOptionGs(input,option){
      const item = option.componentOptions.children[0].componentOptions.children[1].text.replace(/\\n/g,'').replace(/(^\s*)|(\s*$)/g,'');
      return item.indexOf(input) >= 0;
    },
    changeCreateType(e){
      if(e.target.value === '0'){
        this.settleDomainForm.setFieldsValue(pick({relateFlag:'0'},'relateFlag'))
        this.showContract = true
        if(this.method === 'edit'){
          this.createTypeFlag = true
        }else{
          this.createTypeFlag = false
          this.validatorRules.belongContract = { rules: [{ required: true, message: '请输入合同主体!' }] }
        }
      }else{
        this.createTypeFlag = true
        this.settleDomainForm.setFieldsValue(pick({relateFlag:'1'},'relateFlag'))
        if(this.method === 'edit'){
          this.showContract = true
        }else{
          this.showContract = false
          this.validatorRules.belongContract = { rules: [] }
        }
      }
    },
    changeTaxType(val,type){
      if(!val){
        return
      }
      httpAction(`/admin/dict/getByParentId?parentId=${val}`,null,'get').then(res=>{
        if(res.code === 200){
          this.$nextTick(() => {
            if(type === 1){
              this.departSettlementInfoForm.setFieldsValue(pick({taxFee:undefined},'taxFee'))
              this.taxFeeSettleDicts = res.data
            }else if(type === 2){
              this.departBusinessRisksSettlementForm.setFieldsValue(pick({taxValue:undefined},'taxValue'))
              this.taxFeeDicts = res.data
            }
          })
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    showModal() {
      this.method = 'add'
      this.childList = this.treeList[0]
      this.visible = true
      this.coverNameList = [this.settleCoverName]
    },
    getAllBelongs(id,field){
      const res1 = this.belongOrgan[field].find(item=>String(item.id) === String(id))
      if(!res1){
        const res = this.organAll.find(item=>String(item.id) === String(id))
        if(res){
          this.belongOrgan[field].push(res)
        }
      }
    },
    edit(record,belongOrgan){
      // eslint-disable-next-line
      this.belongOrgan = _.cloneDeep(belongOrgan)
      this.getAllBelongs(record.settleDomain.incomeBelong,'first')
      this.getAllBelongs(record.settleDomain.incomeBelongSub,'second')
      this.method = 'edit'
      this.visible = true
      this.current = 1
      this.model = record
      this.typeSelect = {
        topType: record.settleDomain.businessPrimaryType,
        secondType: record.settleDomain.businessSecondType,
        sonType: '',
        type: record.settleDomain.type,
      }
      this.childList = this.treeList.find(item=>String(item.id) == this.typeSelect.topType) || {children:[]}
      this.typeSelect.sonType = this.typeList.find(item=>String(item.id) == record.settleDomain.businessThirdType)
      // 处理服务
      const serverItem = record.settleDomain.serverItem.split(',')
      this.serverChecked = []
      this.serverItemDicts.forEach(item=>{
        if(serverItem.includes(item.label)){
          this.serverChecked.push(true)
        }else{
          this.serverChecked.push(false)
        }
      })
      if(this.serverChecked.length && this.typeSelect.topType && this.typeSelect.sonType){
        this.disNext = false
      }else{
        this.disNext = true
      }

      const keys = [0]
      if(record.tableHeadSalaryCover){
        record.tableHeadSalaryCover.map((item,index)=>{
          if(index>0){
            keys.push(index)
          }
        })
      }
      const _this = this
      // this.tableHeaderCoverForm.getFieldDecorator('keys',{initialValue: keys, preserve: true})
      
      this.$nextTick(() => {
        _this.tableHeaderCoverForm.setFieldsValue({keys:keys})  
      })
      
      let arr = []
      keys.map((k,i)=>{
        let res;
        if(_this.model.tableHeadSalaryCover[i]&&_this.model.tableHeadSalaryCover[i].coverName){
           res = _this.settleCoverName.find(item=>item==_this.model.tableHeadSalaryCover[i].coverName)
        }else{
          res = true
        }

        if(res){
          arr[i] = _this.settleCoverName
        }else{
          arr[i] = [_this.model.tableHeadSalaryCover[i].coverName,..._this.settleCoverName]
        }
      })
      this.coverNameList = arr
  
      this.changeTaxType(this.model.departSettlementInfo.taxType,1)
      if(this.show.insuranceManagement && this.typeSelect.type == 0 && this.model.businessRisksSettlement){
        this.changeTaxType(this.model.businessRisksSettlement.taxType,2)
      }
      // this.$nextTick(() => {
      //   this.settleDomainForm.setFieldsValue(pick({
      //     departName:record.settleDomain.departName,
      //     incomeBelong:record.settleDomain.incomeBelong,
      //     incomeBelongSub:record.settleDomain.incomeBelongSub
      //   },'departName','incomeBelong','incomeBelongSub'))
      //   if(this.typeSelect.type == 0){
      //     // 所属地区
      //     for(var item of this.areaTrees) {
      //       if(item.id == this.model.settleDomain.province) {
      //         this.areaCitys = item.children;
      //         for(var c of this.areaCitys) {
      //           if(c.id == this.model.settleDomain.city) {
      //             this.areaTowns = c.children;
      //           }
      //         }
      //       }
      //     }
      //     this.settleDomainForm.setFieldsValue(pick({province:record.settleDomain.province,city:record.settleDomain.city,town:record.settleDomain.town},'province','city','town'))
      //     // 核准表开票信息
      //     this.approvalFormTickectForm.setFieldsValue(pick({
      //       customerTicketName:record.approvalFormTickect.customerTicketName,
      //       selfTomoneyUnitName:record.approvalFormTickect.selfTomoneyUnitName
      //     },'customerTicketName','selfTomoneyUnitName'))
      //     // 封面设置
      //     let coverName = []
      //     let type = []
      //     let id = []
      //     record.tableHeadSalaryCover.map((item)=>{
      //       coverName.push(item.coverName)
      //       type.push(item.type)
      //       id.push(item.id)
      //       return item
      //     })
      //     this.tableHeaderCoverForm.setFieldsValue(pick({
      //       type:type,coverName:coverName,id:id
      //     },'type','coverName','id'))
      //   }
      //   // 结算配置
      //   this.departSettlementInfoForm.setFieldsValue(pick({
      //     taxType:String(record.departSettlementInfo.taxType),
      //     unitSeriousIllnessProp:record.departSettlementInfo.unitSeriousIllnessProp,
      //     taxFee:record.departSettlementInfo.taxFee,
      //     socialCardTaker:record.departSettlementInfo.socialCardTaker,
      //   },'taxType','unitSeriousIllnessProp','taxFee','socialCardTaker'))
      //   // 管理费
      //   if(this.show.management && this.typeSelect.type == 0){
      //     this.changeManage(record.departSettlementInfo.managementTag)
      //     this.manageForm.setFieldsValue(pick({
      //       managementTag:record.departSettlementInfo.managementTag
      //     },'managementTag'))
      //   }
      //   // 风险金
      //   if(this.show.risk && this.typeSelect.type == 0){
      //     this.changeRisk(record.departSettlementInfo.riskFundTag)
      //     this.riskForm.setFieldsValue(pick({
      //       riskFundTag:record.departSettlementInfo.riskFundTag
      //     },'riskFundTag'))
      //   }
      //   // 商险（单独结算）配置
      //   if(this.show.insuranceManagement && this.typeSelect.type == 0){
      //     this.insuranceChange(record.businessRisksSettlement.managementTag)
      //     this.departBusinessRisksSettlementForm.setFieldsValue(pick({
      //       managementTag:record.businessRisksSettlement.managementTag,
      //       taxType:record.businessRisksSettlement.taxType,
      //       taxValue:record.businessRisksSettlement.taxValue,
      //     },'managementTag','taxType','taxValue'))
      //   }
      // })

    },
    selectCustomerDefault(value,customerName,belongContract,contractName){
      this.getCustomerList(`hrBase/tcustomerinfo/page?id=${this.model.settleDomain.customerId}&selectType=0`,{id:value,customerName:customerName})
      if(!belongContract){ // 无合同
        // 选择合同之前
        if(this.model.settleDomain.createType === '0'){
          // 查找客户下的合同
          const url = `${this.url.getCustomerContractList+value}`
          httpAction(url,null,'get').then((res)=>{
            if(res.code == 200 && res.data.total){
              this.customerContracts = res.data.records
              this.isContract = false
            }else{
              this.isContract = true
              this.$message.warning('该客户暂无合同信息')
            }
          })
        }
        
        this.$nextTick(() => {
          this.settleDomainForm.setFieldsValue(pick({
            customerId:this.model.settleDomain.customerId,
            customerName:this.model.settleDomain.customerName,
            exceptionRemark:this.model.settleDomain.exceptionRemark,
          },'customerId','customerName','exceptionRemark'))
        })
        
      }else{
        const url = `${this.url.getCustomerContractList+value}`
        httpAction(url,null,'get').then((res)=>{
          if(res.code == 200 && res.data.total){
            this.customerContracts = res.data.records
            this.settleDomainForm.setFieldsValue(pick({
              belongContract:belongContract,
              customerId:this.model.settleDomain.customerId,
              customerName:this.model.settleDomain.customerName,
              contractName:this.model.settleDomain.contractName,
              exceptionRemark:this.model.settleDomain.exceptionRemark,
            },'belongContract','customerId','customerName','contractName','exceptionRemark'))
          }else{
            this.customerContracts = []
            // this.$message.warning('该客户暂无合同信息');
          }
        }).finally(()=>{
          this.isContract=false
          const res1 = this.customerContracts.find(item=>item.id == belongContract)
          if(!res1){
            // 未查到合同用详情里
            this.customerContracts.unshift({id:belongContract,contractName:contractName})
            this.settleDomainForm.setFieldsValue(pick({
              belongContract:belongContract,
              customerId:this.model.settleDomain.customerId,
              customerName:this.model.settleDomain.customerName,
              contractName:this.model.settleDomain.contractName,
              exceptionRemark:this.model.settleDomain.exceptionRemark,
            },'belongContract','customerId','customerName','contractName','exceptionRemark'))
          }
        })
      }
      
    },
    nextStep(){

      this.current = 2
      const serveItems = this.getServerItem('id')
      this.show.unitIllness = (/106(.*)109/.test(serveItems) && !this.typeSelect.type) ? true : false
      this.show.socialCard = (/106/.test(serveItems) && !this.typeSelect.type) ? true : false
      this.show.management = (serveItems == 108) ? false : true
      this.show.insuranceManagement = (/108/.test(serveItems)) ? true : false
      if((/108/.test(serveItems) && serveItems != 108)){
        this.show.management = true
        this.show.insuranceManagement = true
      }
      if(this.typeSelect.sonType){
        this.show.risk = /(1254|898|897)/.test(this.typeSelect.sonType.id) ? false : true
      }else{
        this.show.risk = true
      }
      
      this.show.approvalFormTickect = /(106|107)/.test(serveItems) ? true : false
      if(this.typeSelect.type === 0 && this.model.tableHeadSalaryCover.length===0){
        this.$nextTick(() => {
          this.tableHeaderCoverForm.setFieldsValue({keys:[0]})
        })
      }
      if(this.method === 'edit'){
        
        this.createTypeDisabled = true
        this.disabledCustomer = true
        if(this.model.settleDomain.createType === '1'){
          this.createTypeFlag = true
          this.validatorRules.belongContract = { rules: [] }
          
          if(this.model.settleDomain.belongContract){
            this.showContract = true
          }else{
            this.showContract = false
          }
        }else{
          this.createTypeFlag = false
          this.validatorRules.belongContract = { rules: [{ required: true, message: '请输入合同主体!' }] }
          this.showContract = true
        }
        // 客户 合同主体选中
        this.selectCustomerDefault(this.model.settleDomain.customerId,this.model.settleDomain.customerName,this.model.settleDomain.belongContract,this.model.settleDomain.contractName)

        this.$nextTick(() => {
          this.settleDomainForm.setFieldsValue(pick({
            departName:this.model.settleDomain.departName,
            customerName:this.model.settleDomain.customerName,
            incomeBelong:this.model.settleDomain.incomeBelong,
            incomeBelongSub:this.model.settleDomain.incomeBelongSub,
            createType:this.model.settleDomain.createType,
            relateFlag:this.model.settleDomain.relateFlag,
          },'departName','customerName','incomeBelong','incomeBelongSub','createType','relateFlag'))
          
          if(this.typeSelect.type == 0){
            if(this.model.settleDomain.existAdvancePayment === '0'){
              this.disabledBackPayCycle = true
            }
            // 垫付
            this.paymentForm.setFieldsValue(pick({
              existAdvancePayment:this.model.settleDomain.existAdvancePayment,
              backPayCycle:this.model.settleDomain.backPayCycle
            },'existAdvancePayment','backPayCycle'))
            // 所属地区
            for(var item of this.areaTrees) {
              if(item.id == this.model.settleDomain.province) {
                this.areaCitys = item.children;
                for(var c of this.areaCitys) {
                  if(c.id == this.model.settleDomain.city) {
                    this.areaTowns = c.children;
                  }
                }
              }
            }
            this.settleDomainForm.setFieldsValue(pick({province:this.model.settleDomain.province,city:this.model.settleDomain.city,town:this.model.settleDomain.town},'province','city','town'))
            // 核准表开票信息
            if(this.model.approvalFormTickect){
              this.approvalFormTickectForm.setFieldsValue(pick({
                customerTicketName:this.model.approvalFormTickect.customerTicketName,
                selfTomoneyUnitName:this.model.approvalFormTickect.selfTomoneyUnitName
              },'customerTicketName','selfTomoneyUnitName'))
            }
            // 封面设置
            const coverName = []
            const type = []
            const id = []
            this.model.tableHeadSalaryCover.map((item)=>{
              coverName.push(item.coverName)
              type.push(item.type)
              id.push(item.id)
              return item
            })
            this.tableHeaderCoverForm.setFieldsValue(pick({
              type:type,coverName:coverName,id:id
            },'type','coverName','id'))
          }
          // 结算配置
          if(this.model.departSettlementInfo){
            this.departSettlementInfoForm.setFieldsValue(pick({
              taxType:String(this.model.departSettlementInfo.taxType),
              unitSeriousIllnessProp:this.model.departSettlementInfo.unitSeriousIllnessProp||100,
              taxFee:String(this.model.departSettlementInfo.taxFee),
              socialCardTaker:this.model.departSettlementInfo.socialCardTaker,
            },'taxType','unitSeriousIllnessProp','taxFee','socialCardTaker'))
          }
          // 管理费
          if(this.show.management && this.typeSelect.type == 0 && this.model.departSettlementInfo){
            this.changeManage(this.model.departSettlementInfo.managementTag)
            this.manageForm.setFieldsValue(pick({
              managementTag:(this.model.departSettlementInfo.managementTag === null)?undefined:this.model.departSettlementInfo.managementTag
            },'managementTag'))
          }
          // 风险金
          if(this.show.risk && this.typeSelect.type == 0 && this.model.departSettlementInfo){
            this.changeRisk(this.model.departSettlementInfo.riskFundTag)
            // const riskFundTag = (this.model.departSettlementInfo.riskFundTag===null)?undefined:this.model.departSettlementInfo.riskFundTag
            // this.riskForm.setFieldsValue(pick({
            //   riskFundTag:riskFundTag
            // },'riskFundTag'))
          }
          // 商险（单独结算）配置
          if(this.show.insuranceManagement && this.typeSelect.type == 0 && this.model.businessRisksSettlement){
            this.insuranceChange(this.model.businessRisksSettlement.managementTag)
            
            this.departBusinessRisksSettlementForm.setFieldsValue(pick({
              managementTag:this.model.businessRisksSettlement.managementTag,
              taxType:this.model.businessRisksSettlement.taxType,
              taxValue:this.model.businessRisksSettlement.taxValue === null ? undefined : String(this.model.businessRisksSettlement.taxValue),
            },'managementTag','taxType','taxValue'))
          }
        })
      }
    },
    preStep(){
      this.current = 1
    },
    goSecond(){
      this.current = 2
    },
    // 预警设置
    nextRemind(){
      this.current = 3
      const res = []
      if(this.typeSelect.type === 0){
        const arr = []
        this.serverChecked.forEach((item,index)=>{
          if(item){
            arr.push(this.serverItemDicts[index].id);
          }
        })
        
        arr.forEach(item=>{
          if(item === 106 || item === 107){
            res.push('社保、公积金')
          }else if(item === 108){
            res.push('商险单独结算')
          }else if(item === 109){
            res.push('薪资')
          }else{
            res.push('非人事类')
          }
        })
      }else{
        res.push('非人事类')
      }
      const unikRes = Array.from(new Set(res));
      this.remaindSet = unikRes.map(item=>{
        const temp = this.model.settleAlertCfgList ? this.model.settleAlertCfgList.find(ele=>ele.project === item) : null;
        return temp ? temp : {project:item,projectType:this.getProjectType(item)}
      })

      if(this.method === 'edit'){
        const defaultVal = {cycle:[],alertDay:[],firstAlertDate:[],alertEmail:[],alertTarget:[],status:[]}
        this.remaindSet.forEach((item,index)=>{
          if(item.id){
            defaultVal.cycle[index] = item.cycle
            defaultVal.alertDay[index] = item.alertDay
            defaultVal.firstAlertDate[index] = moment(item.firstAlertDate)
            defaultVal.alertTarget[index] = item.alertTarget
            defaultVal.status[index] = String(item.status) === '0' ? 'checked' : null
          }else{
            defaultVal.cycle[index] = 1
            defaultVal.alertDay[index] = 25
            defaultVal.firstAlertDate[index] = moment(moment().format('YYYY-MM-25'))
            defaultVal.alertTarget[index] = '服务客服'
            defaultVal.status[index] = 'checked'
          }
        })

        this.$nextTick(() => {
          this.remaindSetForm.setFieldsValue(pick({cycle:defaultVal.cycle,
          alertDay:defaultVal.alertDay,firstAlertDate:defaultVal.firstAlertDate,
          alertTarget:defaultVal.alertTarget,status:defaultVal.status},'cycle','alertDay','firstAlertDate','alertTarget','status'))
        })
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.propsData.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    remove(k) {
      const { tableHeaderCoverForm } = this;
      const keys = tableHeaderCoverForm.getFieldValue('keys')
      const idArr = tableHeaderCoverForm.getFieldValue('id')
      const coverNameArr = tableHeaderCoverForm.getFieldValue('coverName')
      const typeArr = tableHeaderCoverForm.getFieldValue('type')
      if(idArr[k]){
        httpAction(`hrBase/ttableheadsalarycover/batch?ids=${idArr[k]}`,null,'delete').then(res=>{
          if(res.code === 200){
            this.$message.success('删除成功！')
            tableHeaderCoverForm.setFieldsValue({
              keys: keys.filter((key,index) => index !== k),
              id:idArr.filter((key,index) => index !== k),
              coverName:coverNameArr.filter((key,index) => index !== k),
              type:typeArr.filter((key,index) => index !== k)
            })
          }else{
            this.$message.warning(res.msg)
          }
        })
      }else{
        tableHeaderCoverForm.setFieldsValue({
          keys: keys.filter((key,index) => index !== k),
          id:idArr.filter((key,index) => index !== k),
          coverName:coverNameArr.filter((key,index) => index !== k),
          type:typeArr.filter((key,index) => index !== k)
        })

      }
    },
    addItem() {
      const { tableHeaderCoverForm } = this;
      const keys = tableHeaderCoverForm.getFieldValue('keys');
      const nextKeys = keys.concat(++index);
      tableHeaderCoverForm.setFieldsValue({
        keys: nextKeys,
      })
      this.coverNameList = [...this.coverNameList,this.settleCoverName]
    },

    getCustomerList(url,obj) {
      this.fetching = true
      httpAction(url, null, 'get').then(res => {
        if (Number(res.code) === 200) {
          // console.log('object');
          // console.log(customers);
          this.customers = res.data.records
          console.log(this.customers);
          this.stotal = res.data.total
        }
      }).finally(()=>{
        this.fetching = false
        if(obj){
          const res1 = this.customers.find(item=>item.id == obj.id)
          if(!res1){
            this.customers.unshift(obj)
            this.stotal++
          }
        }
      })
    },
    changePage(page) {
      this.getCustomerList(this.url.getCustomerList + this.searchCustomerKey + '&current=' + page)
    },
    searchCustomer(val) {
      this.searchCustomerKey = val
      this.getCustomerList(this.url.getCustomerList + this.searchCustomerKey)
    },
    selectCustomer(value,option) {
      this.settleDomainForm.setFieldsValue(pick({ belongContract: undefined,customerName:this.customers[option.key]['customerName'] }, 'belongContract','customerName'))
      httpAction(this.url.getCustomerContractList + value, null, 'get').then(res => {
        if (res.code == 200 && res.data.total) {
          this.customerContracts = res.data.records
          this.isContract = false
        } else {
          this.customerContracts = []
          this.isContract = true
          if(this.settleDomainForm.getFieldValue('createType') === '0'){
            this.$message.warning('该客户暂无合同信息')
          }
        }
      })
    },
    selectContract(value,option){
      const _this = this
      if(value){
        const contract = this.customerContracts[option.key]
        if(!['0','5','6'].includes(contract['prAuditFlag'])){
          const status = this.prAuditFlagOption[contract['prAuditFlag']] || '停止合作'
          this.$message.warning(`《${contract['contractName']}》处于“${status}”状态,只有审核通过、已办理、已归档才能选择`)
          this.$nextTick(() => {
            if(_this.model.settleDomain.relateFlag === '0'){
              if(value === _this.model.settleDomain.belongContract){ //恢复原来状态
                _this.settleDomainForm.setFieldsValue(pick({ belongContract:_this.model.settleDomain.belongContract,contractName:_this.model.settleDomain.contractName,
                relateFlag:_this.model.settleDomain.relateFlag}, 'belongContract','contractName','relateFlag'))
              }else{
                _this.settleDomainForm.setFieldsValue(pick({ belongContract:_this.model.settleDomain.belongContract}, 'belongContract'))
              }
            }else{
              _this.settleDomainForm.setFieldsValue(pick({ belongContract:undefined,contractName:'',relateFlag:'1' }, 'belongContract','contractName','relateFlag'))
            }
          })
          return
        }
        this.$nextTick(() => {
          this.settleDomainForm.setFieldsValue(pick({ contractName:contract['contractName'],relateFlag:'0' }, 'contractName','relateFlag'))
        })
      }else{
        this.$nextTick(() => {
          this.settleDomainForm.setFieldsValue(pick({relateFlag:'1'},'relateFlag'))
        })
      }
    },
    changeManage(val,option){
      if(val === '1'){
        this.manageDisable = true
        this.manageForm.setFieldsValue(pick({managementType:undefined,managementFee:'',manageServerItem:[],managementTaxTag:undefined,managementExpFlag:undefined},'managementType','managementFee','manageServerItem','managementTaxTag','managementExpFlag'))
        this.manageFormValidatorRules.managementType = { rules: [] }
        this.manageFormValidatorRules.managementFee = { rules: [] }
        this.manageFormValidatorRules.manageServerItem = { rules: [] }
        this.manageFormValidatorRules.managementTaxTag = { rules: [] }
        this.manageFormValidatorRules.managementExpFlag = { rules: [] }
      }else{
        this.manageDisable = false
        this.manageFormValidatorRules.managementType = { rules: [{ required: true, message: '收费方式不能为空!' }] }
        this.manageFormValidatorRules.managementFee = { rules: [{ required: true, message: '费率/金额不能为空!' }] }
        this.manageFormValidatorRules.manageServerItem = { rules: [{ required: true, message: '收取项目不能为空!' }] }
        this.manageFormValidatorRules.managementTaxTag = { rules: [{ required: true, message: '税收类型不能为空!' }] }
        this.manageFormValidatorRules.managementExpFlag = { rules: [{ required: true, message: '是否扣税不能为空!' }] }
      }
      if(!option && val === '0'){
        this.$nextTick(() => {
          this.manageForm.setFieldsValue(pick({
            managementType:this.model.departSettlementInfo.managementType,
            managementFee:this.model.departSettlementInfo.managementFee,
            manageServerItem:this.model.departSettlementInfo.manageServerItem?this.model.departSettlementInfo.manageServerItem.split(','):[],
            managementTaxTag:this.model.departSettlementInfo.managementTaxTag,
            managementExpFlag:this.model.departSettlementInfo.managementExpFlag,
          },'managementTag','managementType','managementFee','manageServerItem','managementTaxTag','managementExpFlag'))
        })
        this.changeManageType(this.model.departSettlementInfo.managementType)
      }
    },
    changeRisk(val,option){
      if(val === '1'){
        this.riskDisable = true
        this.riskFormValidatorRules.riskFundType = { rules: [] }
        this.riskFormValidatorRules.riskFundFee = { rules: [] }
        this.riskFormValidatorRules.riskServerItem = { rules: [] }
        this.riskFormValidatorRules.riskFundTaxTag = { rules: [] }
        this.riskFormValidatorRules.managementTaxTag = { rules: [] }
        this.$nextTick(() => {
          this.riskForm.setFieldsValue(pick({riskFundType:undefined,riskFundFee:'',riskServerItem:[],riskFundTag:val,riskFundTaxTag:undefined},'riskFundType','riskFundFee','riskServerItem','riskFundTag','riskFundTaxTag'))
        })
      }else{
        this.riskDisable = false
        this.riskFormValidatorRules.riskFundType = { rules: [{ required: true, message: '收费方式不能为空!' }] }
        this.riskFormValidatorRules.riskFundFee = { rules: [{ required: true, message: '费率/金额不能为空!' }] }
        this.riskFormValidatorRules.riskServerItem = { rules: [{ required: true, message: '收取项目不能为空!' }] }
        this.riskFormValidatorRules.managementTaxTag = { rules: [{ required: true, message: '税收类型不能为空!' }] }
      }
      if(!option && val === '0'){
        this.$nextTick(() => {
          this.riskForm.setFieldsValue(pick({
            riskFundTag:this.model.departSettlementInfo.riskFundTag,
            riskFundType:this.model.departSettlementInfo.riskFundType,
            riskFundFee:this.model.departSettlementInfo.riskFundFee,
            riskServerItem:this.model.departSettlementInfo.riskServerItem?this.model.departSettlementInfo.riskServerItem.split(','):[],
            riskFundTaxTag:this.model.departSettlementInfo.riskFundTaxTag,
          },'riskFundTag','riskFundType','riskFundFee','riskServerItem','riskFundTaxTag'))
          
        })
        this.changeRiskType(this.model.departSettlementInfo.riskFundType)
      }
    },
    insuranceChange(val,option){
      if(val === '1'){
        this.insuranceDisable = this.insuranceTaxDisable = true
        this.departBusinessRisksSettlementForm.setFieldsValue(pick({riskManagementType:undefined,riskManagementFee:'',riskManagementTax:'',riskManagementTaxTag:undefined,taxType:undefined,taxValue:''},'riskManagementType','riskManagementFee','riskManagementTax','riskManagementTaxTag','taxType','taxValue'))
        this.insuranceValidatorRules.riskManagementType = { rules: [] }
        this.insuranceValidatorRules.riskManagementFee = { rules: [] }
        this.insuranceValidatorRules.riskManagementTax = { rules: [] }
        this.insuranceValidatorRules.riskManagementTaxTag = { rules: [] }
        this.insuranceValidatorRules.taxType = { rules: [] }
        this.insuranceValidatorRules.taxValue = { rules: [] }
      }else{
        this.insuranceDisable = this.insuranceTaxDisable = false
        this.insuranceValidatorRules.riskManagementType = { rules: [{ required: true, message: '收费方式不能为空!' }] }
        this.insuranceValidatorRules.riskManagementFee = { rules: [
          { required: true, message: '金额不能为空!' },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '金额格式不正确!' },
        ] }
        this.insuranceValidatorRules.riskManagementTax = {
          rules: [
            {
              pattern: /^(\d\.([1-9]{1,3}|\d{1,3})$|^[1-9]\d{0,1}(\.\d{1,3}){0,1}|100|0)$/,
              message: '费率格式不正确!'
            },
            { required: true, message: '费率不能为空!' }
          ]
        }
        this.insuranceValidatorRules.riskManagementTaxTag = { rules: [{ required: true, message: '是否含税不能为空!' }] }
        this.insuranceValidatorRules.taxType = { rules: [{ required: true, message: '商险缴税类型不能为空!' }] }
        this.insuranceValidatorRules.taxValue = { rules: [{ required: true, message: '商险缴税税率不能为空!' }] }
        
      }
      if(!option && val === '0'){
        this.departBusinessRisksSettlementForm.setFieldsValue(pick({
          riskManagementType:this.model.businessRisksSettlement.riskManagementType,
          riskManagementFee:this.model.businessRisksSettlement.riskManagementFee,
          riskManagementTax:this.model.businessRisksSettlement.riskManagementTax,
          riskManagementTaxTag:this.model.businessRisksSettlement.riskManagementTaxTag,
        },'riskManagementType','riskManagementFee','riskManagementTax','riskManagementTaxTag'))
        this.insuranceChangeType(this.model.businessRisksSettlement.riskManagementType)
        this.riskManagementTaxTagChange(this.model.businessRisksSettlement.riskManagementTaxTag)
      }
    },
    insuranceChangeType(val,option){
      if(val === '1'){
        this.insuranceType = false
      }else{
        this.insuranceType = true
      }
      if(!option){
        this.$nextTick(() => {
          this.departBusinessRisksSettlementForm.setFieldsValue(pick({
            riskManagementFee:this.model.businessRisksSettlement.riskManagementFee,
            riskManagementTax:this.model.businessRisksSettlement.riskManagementTax
          },'riskManagementFee','riskManagementTax'))
        })
      }
    },
    riskManagementTaxTagChange(val,option){
      if(val === '1'){ // 含税
        this.insuranceTaxDisable = false
        this.insuranceValidatorRules.taxType = { rules: [{ required: true, message: '商险缴税类型不能为空!' }] }
        this.insuranceValidatorRules.taxValue = { rules: [{ required: true, message: '商险缴税税率不能为空!' }] }
      }else{
        this.insuranceTaxDisable = true
        this.insuranceValidatorRules.taxType = { rules: [] }
        this.insuranceValidatorRules.taxValue = { rules: [] }
        this.departBusinessRisksSettlementForm.setFieldsValue(pick({
          taxType:undefined,
          taxValue:undefined,
        },'taxType','taxValue'))
      }
      if(!option && val === '1'){
        this.departBusinessRisksSettlementForm.setFieldsValue(pick({
          taxType:this.model.businessRisksSettlement.taxType,
          taxValue:this.model.businessRisksSettlement.taxValue,
        },'taxType','taxValue'))
      }

    },
    changeRiskType(val,option){
      if(option){
        this.riskForm.setFieldsValue(pick({riskFundFee:''},'riskFundFee'))
      }
      if(val === '1'){
        this.riskAddon = '%'
        this.riskFormValidatorRules.riskFundFee = {
          rules: [
            {
              pattern: /^(\d\.([1-9]{1,3}|\d{1,3})$|^[1-9]\d{0,1}(\.\d{1,3}){0,1}|100|0)$/,
              message: '费率格式不正确!'
            },
            { required: true, message: '费率不能为空!' }
          ]
        }
      }else{
        this.riskAddon = ''
        this.riskFormValidatorRules.riskFundFee = { rules: [
          { required: true, message: '金额不能为空!' },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '金额格式不正确!' },
        ] }
      }
    },
    changeManageType(val,option){
      if(option){
        this.manageForm.setFieldsValue(pick({managementFee:''},'managementFee'))
      }
      if(val === '1'){
        this.manageAddon = '%'
        this.manageFormValidatorRules.managementFee = {
          rules: [
            {
              pattern: /^(\d\.([1-9]{1,3}|\d{1,3})$|^[1-9]\d{0,1}(\.\d{1,3}){0,1}|100|0)$/,
              message: '费率格式不正确!'
            },
            { required: true, message: '费率不能为空!' }
          ]
        }
      }else{
        this.manageAddon = ''
        this.manageFormValidatorRules.managementFee = { rules: [
          { required: true, message: '金额不能为空!' },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '金额格式不正确!' },
        ] }
      }
    },
    changeParent(e){
      this.childList = this.treeList.find(item=>item.id == e.target.value)
    },
    changeType(val,option){
      const res = this.serverChecked.some(item=>item)
      this.disNext = (this.typeSelect.sonType.id && res) ? false : true
      if(val){
        this.typeSelect.type = val.target.value.type
        this.typeSelect.secondType = String(option)
      }
    },
    getServerItem(field){
      const arr = []
      this.serverChecked.forEach((item,index)=>{
        if(item) { arr.push(index) }
      })
      const serverItem = []
      arr.forEach(item=>{
        serverItem.push(this.serverItemDicts[item][field])
      })
      return serverItem.join(',')
    },
    // 业务信息表单
    validateSettleDomainForm(){
      const _this = this
      return new Promise(function(resolve, reject){
        _this.settleDomainForm.validateFields((err, values) => {
          if (!err) {
            // if(values.createType === '0'){
            //   // 查询所属合同状态
            //   const prAuditFlag = getNameFromArr(_this.customerContracts,values.belongContract,'id','prAuditFlag')
            //   if(!['0','5','6'].includes(prAuditFlag)){
            //     reject(`该合同处于${_this.prAuditFlagOption[prAuditFlag]}状态,只有审核通过、已办理、已归档才能选择`)
            //   }
            // }
            values.serverItem = _this.getServerItem('label')
            values.businessPrimaryType = _this.typeSelect.topType
            values.businessSecondType = _this.typeSelect.secondType
            values.businessThirdType = String(_this.typeSelect.sonType.id)
            values.type = _this.typeSelect.type // 0：人事；1：非人事
            _this.model.settleDomain = Object.assign(_this.model.settleDomain,values)
            resolve()
          }else{
            reject('业务表单验证不通过！')
          }
        })
      });
    },
    // 结算配置
    validateDepartSettlementInfoForm(){
      const _this = this
      return new Promise(function(resolve, reject){
        _this.departSettlementInfoForm.validateFields((err, values) => {
          if (!err) {
            // if(values.unitSeriousIllnessProp === undefined){
            //   values.unitSeriousIllnessProp = ''
            // }
            // if(!values.socialCardTaker){
            //   values.socialCardTaker = ''
            // }
            _this.model.departSettlementInfo = _this.model.departSettlementInfo ? Object.assign(_this.model.departSettlementInfo,values) : values
            resolve()
          }else{
            reject('结算配置表单验证不通过！')
          }
        })
      })
    },
    // 管理费
    validateManageForm(){
      const _this = this
      return new Promise(function(resolve, reject){
        if(_this.show.management && _this.typeSelect.type == 0){
          _this.manageForm.validateFields((err, values) => {
            if (!err) {
              values.manageServerItem = values.manageServerItem ? values.manageServerItem.join(',') : ''
              _this.model.departSettlementInfo = _this.model.departSettlementInfo ? Object.assign(_this.model.departSettlementInfo,values) : values
              resolve()
            }else{
              reject('管理费表单验证不通过！')
            }
          })
        }else{
          resolve()
        }
      })
    },
    // 风险金
    validateRiskForm(){
      const _this = this
      return new Promise(function(resolve, reject){
        if(_this.show.risk && _this.typeSelect.type == 0){
          _this.riskForm.validateFields((err, values) => {
            if (!err) {
              values.riskServerItem = values.riskServerItem ? values.riskServerItem.join(',') : ''
              _this.model.departSettlementInfo = _this.model.departSettlementInfo ? Object.assign(_this.model.departSettlementInfo,values) : values
              resolve()
            }else{
              reject('风险金表单验证不通过！')
            }
          })
        }else{
          resolve()
        }
      })
    },
    // 商险管理费
    validateDepartBusinessRisksSettlementForm(){
      const _this = this
      return new Promise(function(resolve, reject){
        if(_this.show.insuranceManagement && _this.typeSelect.type == 0){
          _this.departBusinessRisksSettlementForm.validateFields((err, values) => {
            if (!err) {
              values.taxType = (values.taxType == undefined) ? '' : values.taxType
              values.taxValue = (values.taxValue == undefined) ? '' : values.taxValue
              _this.model.businessRisksSettlement = _this.model.businessRisksSettlement ? Object.assign(_this.model.businessRisksSettlement,values) : values
              resolve()
            }else{
              reject('商险管理费表单验证不通过！')
            }
          })
        }else{
          resolve()
        }
      })
    },
    // 核准表信息
    validateApprovalFormTickectForm(){
      const _this = this
      return new Promise(function(resolve, reject){
        if(_this.typeSelect.type == 0){
          _this.approvalFormTickectForm.validateFields((err, values) => {
            if (!err) {
              _this.model.approvalFormTickect = _this.model.approvalFormTickect ? Object.assign(_this.model.approvalFormTickect,values) : values
              resolve()
            }else{
              reject('核准表信息表单验证不通过！')
            }
          })
        }else{
          resolve()
        }
      })
    },
    validatePaymentForm(){
      const _this = this
      return new Promise(function(resolve, reject){
        if(_this.typeSelect.type == 0){
          _this.paymentForm.validateFields((err, values) => {
            if (!err) {
              _this.model.settleDomain = Object.assign(_this.model.settleDomain,values)
              resolve()
            }else{
              reject('垫付信息表单验证不通过！')
            }
          })
        }else{
          resolve()
        }
      })
    },
    // 封面设置
    validateTableHeaderCoverForm(){
      const _this = this
      return new Promise(function(resolve, reject){
        if(_this.typeSelect.type == 0){
          _this.tableHeaderCoverForm.validateFields((err, values) => {
            if (!err) {
              const param = []
              values.coverName.map((item,index)=>{
                param.push({
                  coverName: item,
                  type: values.type[index],
                  id:values.id[index]
                })
              })
              _this.model.tableHeadSalaryCover = param
              resolve()
            }else{
              reject('封面设置表单验证不通过！')
            }
          })
        }else{
          resolve()
        }
      })
    },
    getProjectType(project){
      switch (project) {
        case '社保、公积金':
          return 1;
        case '商险单独结算':
          return 2;
        case '薪资':
          return 3;
        case '非人事类':
          return 4;
      }
    },
    validateRemaindForm(){
      const _this = this
      return new Promise(function(resolve, reject){
        _this.remaindSetForm.validateFields((err, values) =>{
          if (!err) {
            const params = [];
            _this.remaindSet.forEach((item,index)=>{
              const res = _this.model.settleAlertCfgList ? _this.model.settleAlertCfgList.find(settle=>settle.project === item.project) : null;
              const obj = res ? {id: res.id,settleDomainId:res.settleDomainId} : {};
              const oldObj = {
                alertDay: values.alertDay[index],
                alertTarget: values.alertTarget[index],
                cycle: values.cycle[index],
                firstAlertDate: values.firstAlertDate[index].format('YYYY-MM-DD'),
                status: (values.status[index] === 'checked' || values.status[index]) ? 0 : 1,
                project:item.project,
                projectType:item.projectType,
                alertEmail:0,
                alertSys:0
              }
              params[index] = Object.assign(oldObj,obj);
            })
            _this.model.settleAlertCfgList = params
            resolve()
          }else{
            reject('结算预警表单验证不通过！')
          }
        })
      })
    },
    handleOk() {
      const res1 = this.validateSettleDomainForm()
      const res2 = this.validateDepartSettlementInfoForm()
      const res3 = this.validateManageForm()
      const res4 = this.validateRiskForm()
      const res5 = this.validateDepartBusinessRisksSettlementForm()
      const res6 = this.validateApprovalFormTickectForm()
      const res7 = this.validateTableHeaderCoverForm()
      const res8 = this.validatePaymentForm()
      const res9 = this.validateRemaindForm()

      const _this = this
      _this.confirmLoading = true
      Promise.all([res1, res2, res3, res4, res5, res6, res7,res8,res9]).then(function() {
        if(_this.typeSelect.type != 0){
          delete _this.model.businessRisksSettlement
          delete _this.model.approvalFormTickect
          delete _this.model.tableHeadSalaryCover
        }
        if(!_this.show.management && _this.model.departSettlementInfo){
          _this.model.departSettlementInfo.managementTag = ''
          _this.model.departSettlementInfo.managementType = ''
          _this.model.departSettlementInfo.managementFee = ''
          _this.model.departSettlementInfo.manageServerItem = ''
          _this.model.departSettlementInfo.managementTaxTag = ''
          _this.model.departSettlementInfo.managementExpFlag = ''
        }
        let method = 'post'
        if(_this.model.settleDomain.id){
          _this.model.settleDomain.dpAuditFlag = 2
          method = 'put'
        }
        console.log(_this.model)
        // 弹出审核人以及时间
        _this.$refs.SettlementSubmitForm.showModal(_this.model,method,'/hrBase/tsettledomain/vo')
        _this.confirmLoading = false
        // httpAction(_this.url.add,_this.model,method).then((res) => {
        //   if(res.code == 200){
        //     _this.$message.success(`${_this.title}成功!`)
        //     _this.$emit('ok')
        //   }else{
        //     _this.$message.warning(res.msg)
        //   }
        // }).finally(() => {
        //   _this.confirmLoading = false
        //   _this.handleCancel()
        // })
      }).catch(err=>{
        _this.$message.warning(err)
        setTimeout(()=>{
          _this.confirmLoading = false
        },3000)
      })
    },
    submitOk(){
      this.handleCancel()
      this.$emit('ok')
    },
    initDictConfig() {
      initDictOptions('Tax_Type').then(res => {
        if (res.code === 200) {
          this.taxTypeDicts = res.data
        }
      })
      initDictOptions('MANAGE_SERVER_ITEM').then(res => {
        if (res.code === 200) {
          this.manageServerItemsDicts = res.data
        }
      })
      initDictOptions('RISK_SERVER_ITEM').then(res => {
        if (res.code === 200) {
          this.riskServerItemsDicts = res.data
        }
      })
      initDictOptions('selfTomoneyUnitName').then(res => {
        if (res.code === 200) {
          this.incomeCustomer = res.data
        }
      })
      initDictOptions('settle_cover_name').then(res => {
        if (res.code === 200) {
          this.settleCoverName = res.data.map(item=>item.label)
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.visible = false
      this.isContract = true
      this.model.settleDomain = {}
      this.model.departSettlementInfo = {}
      this.model.businessRisksSettlement = {}
      this.model.approvalFormTickect = {}
      this.model.settleAlertCfgList = []
      this.model.tableHeadSalaryCover = []
      this.taxFeeDicts = []
      this.current = 1
      index = 0
      this.typeSelect = {
        topType: '1',
        secondType:'',
        sonType:'',
        type:0 , // 0：人事；1：非人事
      }
      this.serverChecked = []
      this.disNext = true
      this.insuranceType = 1
      this.manageAddon = this.riskAddon = null
      this.manageDisable = this.riskDisable = this.insuranceDisable = this.insuranceTaxDisable = false
      this.manageFormValidatorRules.managementType = { rules: [{ required: true, message: '收费方式不能为空!' }] }
      this.manageFormValidatorRules.managementFee = { rules: [
        { required: true, message: '费率/金额不能为空!' },
        { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '金额格式不正确!' }
      ] }
      this.manageFormValidatorRules.manageServerItem = { rules: [{ required: true, message: '收取项目不能为空!' }] }
      this.manageFormValidatorRules.managementTaxTag = { rules: [{ required: true, message: '税收类型不能为空!' }] }
      this.manageFormValidatorRules.managementExpFlag = { rules: [{ required: true, message: '是否扣税不能为空!' }] }
     
      this.riskFormValidatorRules = {
        managementType: { rules: [{ required: true, message: '收费方式不能为空!' }] },
        riskFundType: { rules: [{ required: true, message: '收费方式不能为空!' }] },
        riskFundFee: { rules: [
          { required: true, message: '费率/金额不能为空!' },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '金额格式不正确!' }
        ] },
        riskServerItem: { rules: [{ required: true, message: '收取项目不能为空!' }] },
        managementTaxTag: { rules: [{ required: true, message: '税收类型不能为空!' }] },
      }
      this.insuranceValidatorRules = {
        riskManagementType: { rules: [{ required: true, message: '收费方式不能为空!' }] },
        riskManagementFee: { rules: [
          { required: true, message: '金额不能为空!' },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '金额格式不正确!' }
        ] },
        riskManagementTax: { rules: [
          { required: true, message: '费率不能为空!' },
          {
            pattern: /^(\d\.([1-9]{1,3}|\d{1,3})$|^[1-9]\d{0,1}(\.\d{1,3}){0,1}|100|0)$/,
            message: '费率格式不正确!'
          }
        ] },
        riskManagementTaxTag: { rules: [{ required: true, message: '是否含税不能为空!' }] },
        taxType: { rules: [{ required: true, message: '商险缴税类型不能为空!' }] },
        taxValue: { rules: [{ required: true, message: '商险缴税税率不能为空!' },
        {
          pattern: /^(\d\.([1-9]{1,3}|\d{1,3})$|^[1-9]\d{0,1}(\.\d{1,3}){0,1}|100|0)$/,
          message: '缴税税率格式不正确!'
        }] },
      }
      this.belongOrgan = {
        first:[],
        second:[],
      }
      this.createTypeFlag = false
      this.showContract = true
      this.createTypeDisabled = false
      this.disabledCustomer = false
      this.disabledBackPayCycle = false
    },
    handleProvinceChange(value) {
      this.areaCitys = []
      this.areaTowns = []
      for (var c of this.areaTrees[value - 1].children) {
        this.areaCitys.push(c)
      }
      for (var t of this.areaCitys[0].children) {
        this.areaTowns.push(t)
      }
      this.settleDomainForm.setFieldsValue(
        pick({ city: this.areaCitys[0].id, town: this.areaTowns[0].id }, 'city', 'town')
      )
    },
    handleCityChange(value) {
      this.areaTowns = []
      for (var c of this.areaCitys) {
        if (c.id == value) {
          if (c.children.length > 0) {
            for (var t of c.children) {
              this.areaTowns.push(t)
            }
          }
        }
      }
      if (this.areaTowns.length > 0) {
        this.settleDomainForm.setFieldsValue(pick({ town: this.areaTowns[0].id }, 'town'))
      } else {
        this.settleDomainForm.setFieldsValue(pick({ town: undefined }, 'town'))
      }
    },
  }
}
</script>

<style lang="less" scoped>
.firstType {
  margin-bottom: 20px;
}
.ant-radio-button-wrapper{
  margin-bottom: 15px;
}
.rowLine {
  .second {
    color: #9b9b9b;
    line-height: 32px;
  }
  margin-bottom: 15px;
  .ant-radio-button-wrapper {
    margin-right: 10px;
    margin-bottom: 5px;
    border: none;
    border-radius: 4px;
  }
  .ant-radio-button-wrapper::before {
    display: none;
  }
}
.service {
  .ant-tag-checkable {
    font-size: 14px;
    border: 1px solid #ddd;
    padding: 3px 8px;
    cursor: pointer;
  }
}
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
  textarea{
    width: 730px;
  }
}
.stepFormTexts {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}
.stepFormText1 {
  :global(.ant-form-item-label) {
    width: 130px;
  }
}

.remaind{
  border-bottom: 1px solid #797979;
  .ant-col{
    border: 1px solid #797979;
    height: 45px;
    line-height: 45px;
    text-align: center;
  }
  .borderRight{
    border-right: none;
  }
  .borderBottom{
    border-bottom: none;
  }
}
</style>
