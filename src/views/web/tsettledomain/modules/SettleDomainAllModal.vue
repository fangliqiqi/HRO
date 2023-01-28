/* eslint-disable no-irregular-whitespace */
<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    cancelText="关闭"
  >

    <a-tabs
      :activeKey="activeKey"
      @change="callback"
    >
      <a-tab-pane
        tab="结算信息"
        key="1"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="settleDomainForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="所属客户"
                >
                  <a-select
                    showSearch
                    placeholder="请选择所属客户"
                    optionFilterProp="children"
                    style="width: 270px"
                    @search="searchCustomer"
                    @change="selectCustomer"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['customerId', validatorRules.customerId ]"
                  >
                    <a-spin slot="notFoundContent" />
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
                    >{{ item.customerName }}</a-select-option>
                  </a-select>
                  <!-- <select-page
                    style="width: 270px"
                    placeholder="请选择所属客户"
                    v-decorator="['customerId', validatorRules.customerId ]"
                    :searchUrl="'/hrBase/tcustomerinfo/page?selectType=1&customerName='"
                    :title="'customerName'"
                    :id="'id'"
                    :size="2"
                  ></select-page> -->

                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="合同主体"
                >
                  <a-select
                    showSearch
                    placeholder="请选择合同主体"
                    optionFilterProp="children"
                    style="width: 270px"
                    :disabled="isContract"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['belongContract', validatorRules.belongContract ]"
                  >
                    <a-select-option
                      v-for="(item, index) in customerContracts"
                      :key="index"
                      :value="item.id"
                    >{{ item.contractName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="结算名称"
                >
                  <a-input
                    placeholder="请输入结算主体名称"
                    v-decorator="['departName', validatorRules.departName ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="收入归属"
                >
                  <a-select
                    showSearch
                    placeholder="请选择收入归属"
                    optionFilterProp="children"
                    style="width: 270px"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['incomeBelong', validatorRules.incomeBelong ]"
                  >
                    <a-select-option
                      v-for="(item, index) in organAll"
                      :key="index"
                      :value="String(item.id)"
                    >{{ item.organName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="收入归属细分"
                >
                  <a-select
                    allowClear
                    showSearch
                    placeholder="请选择收入归属细分"
                    optionFilterProp="children"
                    :dropdownMatchSelectWidth="false"
                    style="width: 179px"
                    v-decorator="['incomeBelongSub', validatorRules.incomeBelongSub ]"
                  >
                    <a-select-option
                      v-for="(item, index) in organAll"
                      :key="index"
                      :value="String(item.id)"
                    >{{ item.organName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="所属地区"
                  class="stepFormText"
                >
                  <a-select
                    showSearch
                    placeholder="选择省份"
                    optionFilterProp="children"
                    style="width: 100px"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['province', validatorRules.province ]"
                    @change="handleProvinceChange"
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
                    style="width: 100px"
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
                    style="width: 100px"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['town']"
                    :allowClear="true"
                  >
                    <a-select-option
                      v-for="(item, index) in areaTowns"
                      :key="index"
                      :value="item.id"
                    >{{ item.areaName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item
                  class="stepFormText"
                  label="服务项目"
                >
                  <a-select
                    showSearch
                    placeholder="请选择服务项目"
                    optionFilterProp="children"
                    mode="multiple"
                    style="width: 509px"
                    @change="serverItemChange"
                    v-decorator="['serverItem', validatorRules.serverItem ]"
                  >
                    <a-select-option
                      v-for="(item, index) in serverItemDicts"
                      :key="index"
                      :value="item.label"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        tab="结算配置"
        key="2"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="departSettlementInfoForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="社保卡收取"
                >
                  <a-select
                    placeholder="社保卡收取"
                    optionFilterProp="children"
                    style="width: 180px;"
                    v-decorator="['socialCardTaker', departSettlementInfoRules.socialCardTaker ]"
                  >
                    <a-select-option value="0">单位</a-select-option>
                    <a-select-option value="1">个人</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="单位大病比例"
                >
                  <a-input
                    placeholder="单位大病比例"
                    style="width: 180px;"
                    addonAfter="%"
                    v-decorator="['unitSeriousIllnessProp', departSettlementInfoRules.unitSeriousIllnessProp ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="管理费是否收费"
                >
                  <span
                    slot="label"
                    class="slotLabel"
                  >管理费是否收费</span>
                  <a-select
                    placeholder="管理费是否收费"
                    optionFilterProp="children"
                    style="width: 180px;"
                    @change="managementTagChange"
                    v-decorator="['managementTag', departSettlementInfoRules.managementTag ]"
                  >
                    <a-select-option value="0">是</a-select-option>
                    <a-select-option value="1">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="风险金是否收取"
                >
                  <a-select
                    placeholder="风险金是否收取"
                    optionFilterProp="children"
                    style="width: 180px;"
                    @change="riskFundTagChange"
                    v-decorator="['riskFundTag', departSettlementInfoRules.riskFundTag ]"
                  >
                    <a-select-option value="0">是</a-select-option>
                    <a-select-option value="1">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="管理费收费类型"
                >
                  <a-select
                    placeholder="管理费收费类型"
                    optionFilterProp="children"
                    style="width: 180px;"
                    :disabled="managementFeeDisabled"
                    @change="managementTypeChange"
                    v-decorator="['managementType', departSettlementInfoRules.managementType ]"
                  >
                    <a-select-option value="0">按固定值收费</a-select-option>
                    <a-select-option value="1">按比例收费</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="风险金收取方式"
                >
                  <a-select
                    placeholder="风险金收取方式"
                    optionFilterProp="children"
                    style="width: 180px;"
                    :disabled="riskFundFeeDisabled"
                    @change="riskFundTypeChange"
                    v-decorator="['riskFundType', departSettlementInfoRules.riskFundType ]"
                  >
                    <a-select-option value="0">按固定值收费</a-select-option>
                    <a-select-option value="1">按比例收费</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="管理费费率/金额"
                >
                  <a-input
                    style="width: 180px;"
                    placeholder="管理费费率/金额"
                    :addonAfter="managementFeeAddon"
                    :disabled="managementFeeDisabled"
                    v-decorator="['managementFee', departSettlementInfoRules.managementFee ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="风险金费率/金额"
                >
                  <a-input
                    placeholder="风险金费率/金额"
                    style="width: 180px;"
                    :addonAfter="riskFundFeeAddon"
                    :disabled="riskFundFeeDisabled"
                    v-decorator="['riskFundFee', departSettlementInfoRules.riskFundFee ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="管理费收取项目"
                >
                  <a-select
                    showSearch
                    placeholder="管理费收取项目"
                    optionFilterProp="children"
                    mode="multiple"
                    style="width: 180px;"
                    :disabled="managementFeeDisabled"
                    @change="manageServerItemChange"
                    v-decorator="['manageServerItem', departSettlementInfoRules.manageServerItem ]"
                  >
                    <a-select-option
                      v-for="item in manageServerItemsDicts"
                      :key="item.label"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="风险金收取项目"
                >
                  <a-select
                    showSearch
                    placeholder="风险金收取项目"
                    optionFilterProp="children"
                    mode="multiple"
                    style="width: 180px;"
                    @change="riskServerItemChange"
                    :disabled="riskFundFeeDisabled"
                    v-decorator="['riskServerItem', departSettlementInfoRules.riskServerItem ]"
                  >
                    <a-select-option
                      v-for="item in riskServerItemsDicts"
                      :key="item.label"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="管理费税收类型"
                >
                  <a-select
                    placeholder="管理费税收类型"
                    optionFilterProp="children"
                    style="width: 180px;"
                    :disabled="managementFeeDisabled"
                    v-decorator="['managementTaxTag', departSettlementInfoRules.managementTaxTag ]"
                  >
                    <a-select-option value="0">税前</a-select-option>
                    <a-select-option value="1">税后</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="风险金税收类型"
                >
                  <a-select
                    placeholder="风险金税收类型"
                    optionFilterProp="children"
                    style="width: 180px;"
                    :disabled="riskFundFeeDisabled"
                    v-decorator="['riskFundTaxTag', departSettlementInfoRules.riskFundTaxTag ]"
                  >
                    <a-select-option value="0">税前</a-select-option>
                    <a-select-option value="1">税后</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="缴税类型"
                >
                  <a-select
                    placeholder="缴税类型"
                    optionFilterProp="children"
                    style="width: 180px;"
                    v-decorator="['taxType', departSettlementInfoRules.taxType ]"
                  >
                    <a-select-option
                      v-for="(item,index) in taxTypeDicts"
                      :key="index"
                      :value="item.id"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="缴税税率"
                >
                  <!--<a-select
                    placeholder="缴税税率"
                    optionFilterProp="children"
                    style="width: 180px;"
                    v-decorator="['taxFee', {} ]"
                  >
                    <a-select-option v-for="(item,index) in taxFeeDicts" :key="index" :value="item.value">{{ item.label }}</a-select-option>
                  </a-select>-->
                  <a-input
                    placeholder="缴税税率"
                    style="width: 180px;"
                    addonAfter="%"
                    v-decorator="['taxFee', departSettlementInfoRules.taxFee ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="管理费扣税"
                >
                  <a-select
                    placeholder="管理费扣税"
                    optionFilterProp="children"
                    style="width: 180px;"
                    v-decorator="['managementExpFlag', departSettlementInfoRules.managementExpFlag ]"
                  >
                    <a-select-option value="0">是</a-select-option>
                    <a-select-option value="1">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        tab="福利购买信息"
        key="3"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="dockingPeopleForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="福利购买地"
                >
                  <a-input
                    placeholder="福利购买地"
                    v-decorator="['welfareAddr', validatorDockingPeopleRules.welfareAddr ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="保险类型"
                >
                  <a-select
                    placeholder="保险类型"
                    optionFilterProp="children"
                    style="width: 180px;"
                    v-decorator="['insuranceType', validatorDockingPeopleRules.insuranceType ]"
                  >
                    <a-select-option
                      v-for="(item,index) in insuranceTypeDicts"
                      :key="index"
                      :value="item.id"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="其他福利"
                >
                  <a-input
                    placeholder="其他福利"
                    v-decorator="['otherWelfare', validatorDockingPeopleRules.otherWelfare ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        tab="封面抬头"
        key="4"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="tableHeaderCoverForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row
              :gutter="24"
              v-for="(i,k) in coverLength"
              :key="i"
            >
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="抬头名称"
                >
                  <a-input
                    placeholder="请输入抬头名称"
                    v-decorator="[
                      `coverName[${k}]`,
                      {
                        validateTrigger: ['change', 'blur'],
                        rules: [{
                          required: true,
                          message: '请输入抬头名称！',
                        }],
                      }
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="抬头类型"
                  class="stepFormText"
                >
                  <a-select
                    placeholder="请选择抬头类型"
                    optionFilterProp="children"
                    style="width: 180px;"
                    v-decorator="[
                      `type[${k}]`,
                      {
                        validateTrigger: ['change'],
                        rules: [{
                          required: true,
                          message: '请选择抬头类型！',
                        }],
                      }
                    ]"
                  >
                    <a-select-option value="0">薪资封面</a-select-option>
                    <a-select-option value="1">商险封面</a-select-option>
                    <a-select-option value="2">核准表封面</a-select-option>
                    <a-select-option value="3">代理预估封面</a-select-option>
                  </a-select>
                </a-form-item>
                <a-icon
                  class="dynamic-delete-button"
                  type="plus-circle"
                  @click="addItem()"
                />
                <a-icon
                  v-if="coverLength.length > 1"
                  class="dynamic-delete-button"
                  type="minus-circle-o"
                  :disabled="coverLength.length === 1"
                  @click="remove(k)"
                />
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        tab="核准表开票"
        key="5"
      >
        <a-spin :spinning="confirmLoading">
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
                    v-decorator="['customerTicketName', approvalFormTickectRules.customerTicketName ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="我司到款单位名称"
                  class="stepFormText"
                >
                  <a-input
                    placeholder="请输入我司到款单位名称"
                    v-decorator="['selfTomoneyUnitName', approvalFormTickectRules.selfTomoneyUnitName ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        tab="商险结算配置"
        key="6"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="departBusinessRisksSettlementForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="是否收取管理费"
                >
                  <a-select
                    placeholder="是否收取管理费"
                    optionFilterProp="children"
                    style="width: 180px;"
                    @change="businessRisksManagementTagChange"
                    v-decorator="['managementTag',departBusinessRisksSettlementRules.managementTag]"
                  >
                    <a-select-option value="0">收取</a-select-option>
                    <a-select-option value="1">不收取</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="管理费收取方式"
                >
                  <a-select
                    placeholder="管理费收取方式"
                    optionFilterProp="children"
                    style="width: 180px;"
                    :disabled="departBusinessRisksDisabled"
                    @change="riskManagementTypeChange"
                    v-decorator="['riskManagementType',departBusinessRisksSettlementRules.riskManagementType]"
                  >
                    <a-select-option value="0">按固定值收取</a-select-option>
                    <a-select-option value="1">按比例收取</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="商险管理费收取值"
                >
                  <a-input
                    placeholder="商险管理费收取值"
                    :disabled="riskManagementFeeDisabled"
                    v-decorator="['riskManagementFee', departBusinessRisksSettlementRules.riskManagementFee ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="商险管理费收取比率"
                >
                  <a-input
                    placeholder="商险管理费收取比率"
                    :disabled="riskManagementTaxDisabled"
                    addonAfter="%"
                    style="width:180px;"
                    v-decorator="['riskManagementTax', departBusinessRisksSettlementRules.riskManagementTax ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="管理费税收是否含税"
                >
                  <a-select
                    placeholder="管理费税收是否含税"
                    optionFilterProp="children"
                    style="width: 180px;"
                    :disabled="riskManagementTaxTagDisabled"
                    v-decorator="['riskManagementTaxTag',departBusinessRisksSettlementRules.riskManagementTaxTag]"
                  >
                    <a-select-option value="1">含税</a-select-option>
                    <a-select-option value="0">不含税</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="缴税类型"
                >
                  <a-select
                    placeholder="缴税类型"
                    optionFilterProp="children"
                    style="width: 180px;"
                    v-decorator="['taxType', departBusinessRisksSettlementRules.taxType ]"
                  >
                    <a-select-option
                      v-for="(item,index) in taxTypeDicts"
                      :key="index"
                      :value="String(item.id)"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="缴税税率"
                >
                  <!-- <span
                    slot="label"
                    class="slotLabel"
                  >缴税税率</span>
                  <a-select
                    placeholder="缴税税率"
                    optionFilterProp="children"
                    style="width: 180px;"
                    v-decorator="['taxValue', departBusinessRisksSettlementRules.taxValue ]"
                  >
                    <a-select-option
                      v-for="(item,index) in taxFeeDicts"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</a-select-option>
                  </a-select> -->
                  <!--<a-input
                    placeholder="缴税税率"
                    style="width: 180px;"
                    addonAfter="%"
                    v-decorator="['taxValue', departBusinessRisksSettlementRules.taxValue ]"
                  />-->
                  <a-input
                    placeholder="缴税税率"
                    style="width: 180px;"
                    addonAfter="%"
                    v-decorator="['taxValue', {} ]"
                  />
                </a-form-item>
              </a-col>

            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        tab="客户约定配置"
        key="7"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="departAppointInfoForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="社保结算时间"
                >
                  <a-input
                    placeholder="社保结算时间"
                    style="width:213px"
                    v-decorator="['socialSettlementType', departAppointInfoSettlementRules.socialSettlementType ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="公积金结算时间"
                >
                  <a-input
                    placeholder="公积金结算时间"
                    style="width:213px"
                    v-decorator="['fundSettlementType', departAppointInfoSettlementRules.fundSettlementType ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="工资发放方式"
                >
                  <a-auto-complete
                    placeholder="工资发放方式"
                    style="width: 213px;"
                    :data-source="salaryTypeOption"
                    v-decorator="['salaryType', departBusinessRisksSettlementRules.salaryType ]"
                  >
                  </a-auto-complete>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="客户到表时间"
                >
                  <a-input
                    placeholder="客户到表时间"
                    addonBefore="每月"
                    style="width:213px"
                    addonAfter="号"
                    v-decorator="['customerGetformTime', departAppointInfoSettlementRules.customerGetformTime ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="工资发放时间"
                >
                  <a-input
                    placeholder="工资发放时间"
                    addonBefore="每月"
                    style="width:213px"
                    addonAfter="号"
                    v-decorator="['salaryGrantTime', departAppointInfoSettlementRules.salaryGrantTime ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="首次结算时间"
                >
                  <a-date-picker
                    format="YYYY-MM-DD"
                    placeholder="首次结算时间"
                    style="width: 213px; text-align: center"
                    v-decorator="[ 'firstSettlementTime', {}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="合同约定到款时间"
                >
                  <a-date-picker
                    format="YYYY-MM-DD"
                    placeholder="合同约定到款时间"
                    style="width: 213px; text-align: center"
                    v-decorator="[ 'contractAppointGetfeeTime', {}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
/* eslint-disable no-irregular-whitespace */
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import Table from 'ant-design-vue/es/table/Table'
import ACol from 'ant-design-vue/es/grid/Col'
import { allPrpos } from '@/utils/beanUtils'

export default {
  name: 'SettleDomainAllModal',
  components: {
    ACol,
    Table,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      organAll: [],
      customerContracts: [],
      customers: [],
      serverItemDicts: [],
      manageServerItemsDicts: [],
      riskServerItemsDicts: [],
      serverItems: '',
      manageServerItems: '',
      riskServerItems: '',
      departs: [],
      coverLength: [0],
      iconTypeJian: 'minus-circle-o',
      iconTypeJia: 'plus-circle',
      areaTrees: [], //省市区
      areaCitys: [],
      areaTowns: [],
      //字典公共变量
      taxTypeDicts: [],
      taxFeeDicts: [],
      insuranceTypeDicts: [],
      headCoverTypeDicts: [],
      // 结算配置页面交互变量
      managementFeeDisabled: true,
      riskFundFeeDisabled: true,
      managementFeeAddon: '',
      riskFundFeeAddon: '',
      departBusinessRisksDisabled: true,
      riskManagementFeeDisabled: true,
      riskManagementTaxDisabled: true,
      departBusinessRisksFundFeeDisabled: true,
      riskFundTaxDisabled: true,
      riskManagementTaxTagDisabled: true,
      riskFundTaxTagDisabled: true,
      stotal: 10,
      searchCustomerKey: '',
      isContract: true,
      activeKey: '1',
      confirmLoading: false,
      //Form表单项
      settleDomainForm: this.$form.createForm(this),
      dockingPeopleForm: this.$form.createForm(this),
      tableHeaderCoverForm: this.$form.createForm(this),
      ticketConfigForm: this.$form.createForm(this),
      approvalFormTickectForm: this.$form.createForm(this),
      departEngineeringSettlementForm: this.$form.createForm(this),
      departBusinessRisksSettlementForm: this.$form.createForm(this),
      departAppointInfoForm: this.$form.createForm(this),
      departSettlementInfoForm: this.$form.createForm(this),

      validatorRules: {
        //结算主体数据校验
        departNo: { rules: [{ required: true, message: '请输入结算主体编码!' }] },
        departName: {
          rules: [
            { required: true, message: '请输入结算主体名称!' },
            { max: 32, message: '结算主体名称最多32个字符!' }
          ]
        },
        isNew: { rules: [{ required: true, message: '请输入是否是新业务!' }] },
        newRemark: { rules: [{ required: true, message: '请输入新业务备注!' }] },
        createUser: { rules: [{ required: true, message: '请输入创建人!' }] },
        deleteFlag: { rules: [{ required: true, message: '请输入是否删除!' }] },
        dpAuditFlag: { rules: [{ required: true, message: '请输入服务审核标识' }] },
        belongContract: { rules: [{ required: true, message: '请输入合同主体!' }] },
        serverItem: { rules: [{ required: true, message: '请输入服务项目!' }] },
        incomeBelong: { rules: [{ required: true, message: '请选择收入归属!' }] },
        incomeBelongSub: { rules: [{ required: true, message: '请选择收入归属细分!' }] },
        customerId: { rules: [{ required: true, message: '请输入所属客户!' }] },
        province: { rules: [{ required: true, message: '省份不能为空!' }] },
        city: { rules: [{ required: true, message: '城市不能为空!' }] }
      },
      validatorDockingPeopleRules: {
        // 福利购买信息数据校验
        welfareAddr: { rules: [{ required: true, message: '请输入福利购买地!' }] },
        insuranceType: { rules: [{ required: true, message: '请选择保险类型!' }] },
        otherWelfare: { rules: [{ max: 12, message: '其他福利最多32个字符!' }] }
      },
      validatorTableHeaderPeopleRules: {
        // 封面抬头校验
        coverName: {
          rules: [
            { required: true, message: '请输入抬头名称!' },
            { max: 32, message: '抬头名称最多32个字符!' }
          ]
        },
        type: { rules: [{ required: true, message: '请选择抬头类型!' }] }
      },
      validatorTicketConfigRules: {
        // 发票抬头校验
        ticketTableHead: {
          rules: [
            { required: true, message: '请输入抬头名称!' },
            { max: 32, message: '抬头名称最多32个字符!' }
          ]
        },
        taxpayerIdentificationNo: { rules: [{ required: true, message: '请输入纳税人识别号!' }] },
        bankName: { rules: [{ max: 32, message: '开户行最多32个字符!' }] },
        bankNo: { rules: [{ max: 25, message: '银行卡号不能超过25位！' }] },
        phone: { rules: [{ pattern: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/, message: '电话格式不正确!' }] }
      },
      approvalFormTickectRules: {
        // 核准表开票信息配置校验
        customerTicketName: {
          rules: [
            { required: true, message: '请输入客户开票名称!' },
            { max: 32, message: '客户开票名称最多32个字符!' }
          ]
        },
        selfTomoneyUnitName: {
          rules: [
            { required: true, message: '请输入我司到款单位名称!' },
            { max: 32, message: '我司到款单位名称最多32个字符!' }
          ]
        }
      },
      departSettlementInfoRules: {
        socialCardTaker: { rules: [{ required: true, message: '社保卡是否收取不能为空!' }] },
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
        managementTag: { rules: [{ required: true, message: '管理费是否收费不能为空!' }] },
        riskFundTag: { rules: [{ required: true, message: '风险金是否收费不能为空!' }] },
        managementType: { rules: [] },
        managementFee: { rules: [] },
        riskFundType: { rules: [] },
        riskFundFee: { rules: [] },
        riskFundTaxTag: { rules: [] },
        managementTaxTag: { rules: [] },
        manageServerItem: { rules: [] },
        riskServerItem: { rules: [] },
        taxFee: { rules: [{ required: true, message: '缴税税率不能为空!' }, { validator: this.validateTaxFee }] },
        taxType: { rules: [{ required: true, message: '缴税类型不能为空!' }] },
        managementExpFlag: { rules: [{ required: true, message: '管理费扣税不能为空!' }], initialValue: '0' }
      },
      departEngineeringSettlementRules: {
        managementTax: { rules: [{ required: true, message: '请输入管理费率!' }] },
        personalTax: { rules: [{ required: true, message: '请输入个人所得税!' }] },
        businessTax: { rules: [{ required: true, message: '请输入企业所得税!' }] }
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
      departAppointInfoSettlementRules: {
        socialSettlementType: { rules: [{ max: 32, message: '社保结算时间最多32个字符!' }] },
        fundSettlementType: { rules: [{ max: 32, message: '公积金结算时间最多32个字符!' }] },
        salaryType: { rules: [{ max: 32, message: '工资发放方式最多32个字符!' }] },
        customerGetformTime: {
          rules: [{ pattern: /^((0?[1-9])|((1|2)[0-9])|30|31)$/, message: '客户到表时间只能为0~31之间的数字!' }]
        },
        wxOutAccountsTime: {
          rules: [{ pattern: /^((0?[1-9])|((1|2)[0-9])|30|31)$/, message: '皖信出账时间只能为0~31之间的数字!' }]
        },
        customerSuerTime: {
          rules: [{ pattern: /^((0?[1-9])|((1|2)[0-9])|30|31)$/, message: '客户确认时间只能为0~31之间的数字!' }]
        },
        wxTicketTime: {
          rules: [{ pattern: /^((0?[1-9])|((1|2)[0-9])|30|31)$/, message: '皖信出票时间只能为0~31之间的数字!' }]
        },
        customerGetfeeTime: {
          rules: [{ pattern: /^((0?[1-9])|((1|2)[0-9])|30|31)$/, message: '客户到账时间只能为0~31之间的数字!' }]
        },
        salaryGrantTime: {
          rules: [{ pattern: /^((0?[1-9])|((1|2)[0-9])|30|31)$/, message: '工资发放时间只能为0~31之间的数字!' }]
        }
      },
      salaryTypeOption: ['当月结算当月费用', '当月结算次月费用', '当月结算上月费用', '其他'],
      url: {
        add: '/hrBase/tsettledomain/vo',
        edit: '/hrBase/tsettledomain',
        getCustomerContract: '/hrBase/tcustomercontract/',
        getIncomeBelongSub: '/admin/organizationinfo/getDepartByUnitId',
        getContract: '/hrBase/tcustomercontract/getOwnContract?type=0&name=',
        getCustomerList: '/hrBase/tcustomerinfo/page?selectType=0&customerName=',
        getCustomerContractList: '/hrBase/tcustomercontract/page?selectType=3&customerId='
      }
    }
  },
  created() {
    this.initDictConfig(this.url.getCustomerList)
  },
  methods: {
    add() {
      this.edit({})
      this.getCustomerList(this.url.getCustomerList)
    },
    // eslint-disable-next-line no-unused-vars
    edit(record) {
      this.departs = []
      this.visible = true
      this.settleDomainForm.resetFields()
      this.dockingPeopleForm.resetFields()
      this.tableHeaderCoverForm.resetFields()
      this.ticketConfigForm.resetFields()
      this.approvalFormTickectForm.resetFields()
      // this.departEngineeringSettlementForm.resetFields();
      this.departBusinessRisksSettlementForm.resetFields()
      this.departAppointInfoForm.resetFields()
      this.departSettlementInfoForm.resetFields()
    },
    getCustomerList(url) {
      httpAction(url, null, 'get').then(res => {
        if (Number(res.code) === 200) {
          this.customers = res.data.records
          this.stotal = res.data.total
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
    selectCustomer(value) {
      this.settleDomainForm.setFieldsValue(pick({ belongContract: undefined }, 'belongContract'))
      httpAction(this.url.getCustomerContractList + value, null, 'get').then(res => {
        if (res.code == 200 && res.data.total) {
          this.customerContracts = res.data.records
          this.isContract = false
        } else {
          this.customerContracts = []
          this.isContract = true
          this.$message.warning('该客户暂无合同信息')
        }
      })
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
        // this.model.town = this.areaTowns[0].id;
        this.settleDomainForm.setFieldsValue(pick({ town: this.areaTowns[0].id }, 'town'))
      } else {
        // this.model.town = -1;
        this.settleDomainForm.setFieldsValue(pick({ town: undefined }, 'town'))
      }
    },
    close() {
      this.$emit('close')
      this.managementFeeDisabled = this.riskFundFeeDisabled = true
      this.departSettlementInfoRules.managementType.rules = []
      this.departSettlementInfoRules.managementFee.rules = []
      this.departSettlementInfoRules.managementTaxTag.rules = []
      this.departSettlementInfoRules.manageServerItem.rules = []
      this.departSettlementInfoRules.riskFundType.rules = []
      this.departSettlementInfoRules.riskFundFee.rules = []
      this.departSettlementInfoRules.riskFundTaxTag.rules = []
      this.departSettlementInfoRules.riskServerItem.rules = []
      this.departBusinessRisksDisabled = this.riskManagementFeeDisabled = true
      this.riskManagementTaxDisabled = this.riskManagementTaxTagDisabled = true
      this.isContract = true
      this.searchCustomerKey = ''
      this.visible = false
      this.activeKey = '1'
    },

    handleOk() {
      const that = this
      const settleDomainForSaveVo = {}
      let isSubmit = false
      this.settleDomainForm.validateFields((err, values) => {
        this.model = {}
        if (!err) {
          let formData = Object.assign(this.model, values)
          formData.serverItem = values.serverItem.join(',')
          delete formData.customerName
          delete formData.businessSubject
          delete formData.businessSubjectName

          settleDomainForSaveVo.settleDomain = formData
          isSubmit = true
        }
      })
      if (/(社保|公积金)/.test(that.serverItems) && isSubmit) {
        this.activeKey = '5'
        isSubmit = false
        this.$nextTick(() => {
          this.approvalFormTickectForm.validateFields((err,values) => {
            if (!err) {
              isSubmit = true
              let formData = Object.assign(this.model, values)
              let isNullObject = allPrpos(formData)
              if (isNullObject) {
                settleDomainForSaveVo.approvalFormTickect = formData
              }
            }
          })
        })
      } else {
        this.approvalFormTickectForm.validateFields((err, values) => {
          this.model = {}
          if (err && /(社保|公积金)/.test(that.serverItems)) {
            isSubmit = false
          }
          if (!err) {
            let formData = Object.assign(this.model, values)
            let isNullObject = allPrpos(formData)
            if (isNullObject) {
              settleDomainForSaveVo.approvalFormTickect = formData
            }
          }
        })
      }

      this.departSettlementInfoForm.validateFields((err, values) => {
        this.model = {}
        if (err) {
          isSubmit = false
        }
        if (!err) {
          let formData = Object.assign(this.model, values)
          let isNullObject = allPrpos(formData)

          if (isNullObject) {
            if (that.manageServerItems != null && that.manageServerItems != '') {
              formData.manageServerItem = that.manageServerItems
            } else {
              formData.manageServerItem = ''
            }
            if (that.riskServerItems != null && that.riskServerItems != '') {
              formData.riskServerItem = that.riskServerItems
            } else {
              formData.riskServerItem = ''
            }
            if (formData.manageServerItem instanceof Array && formData.manageServerItem.length > 0) {
              let str = ''
              for (let i = 0; i < formData.manageServerItem.length; i++) {
                if (i == formData.manageServerItem.length - 1) {
                  str += formData.manageServerItem[i]
                } else {
                  str += formData.manageServerItem[i] + ','
                }
              }
              formData.manageServerItem = str
            }
            if (formData.riskServerItem instanceof Array && formData.riskServerItem.length > 0) {
              let str = ''
              for (let i = 0; i < formData.riskServerItem.length; i++) {
                if (i == formData.riskServerItem.length - 1) {
                  str += formData.riskServerItem[i]
                } else {
                  str += formData.riskServerItem[i] + ','
                }
              }
              formData.riskServerItem = str
            }

            settleDomainForSaveVo.departSettlementInfo = formData
          }
        }
      })
      this.dockingPeopleForm.validateFields((err, values) => {
        this.model = {}
        if (err) {
          isSubmit = false
        }
        if (!err) {
          let formData = Object.assign(this.model, values)
          let isNullObject = allPrpos(formData)
          if (isNullObject) {
            settleDomainForSaveVo.buyWelfare = formData
          }
        }
      })
      this.tableHeaderCoverForm.validateFields((err, values) => {
        this.model = {}
        if (err) {
          isSubmit = false
        }
        if (!err) {
          let formData = Object.assign(this.model, values)
          let isNullObject = allPrpos(formData)
          if (isNullObject) {
            let arrObjs = []
            if (
              formData.coverName.length > 0 &&
              formData.type != null &&
              formData.coverName.length == formData.type.length
            ) {
              for (let i = 0; i < formData.coverName.length; i++) {
                let obj = {}
                obj.coverName = formData.coverName[i]
                obj.type = formData.type[i]
                arrObjs.push(obj)
              }
            }
            settleDomainForSaveVo.tableHeadSalaryCover = arrObjs
          }
        }
      })
      this.ticketConfigForm.validateFields((err, values) => {
        this.model = {}
        if (err) {
          isSubmit = false
        }
        if (!err) {
          let formData = Object.assign(this.model, values)
          let isNullObject = allPrpos(formData)
          if (isNullObject) {
            settleDomainForSaveVo.ticketConfig = formData
          }
        }
      })

      // this.departEngineeringSettlementForm.validateFields((err, values) => {
      //   this.model = {};
      //   if(err) {
      //     isSubmit = false;
      //   }
      //   if (!err) {
      //     let formData = Object.assign(this.model, values);
      //     let isNullObject = allPrpos(formData);
      //     if(isNullObject) {
      //       settleDomainForSaveVo.engineeringSettlement = formData;
      //     }
      //   }
      // });
      this.departBusinessRisksSettlementForm.validateFields((err, values) => {
        this.model = {}
        if (err) {
          isSubmit = false
        }
        if (!err) {
          let formData = Object.assign(this.model, values)
          let isNullObject = allPrpos(formData)
          if (isNullObject) {
            settleDomainForSaveVo.businessRisksSettlement = formData
          }
        }
      })
      this.departAppointInfoForm.validateFields((err, values) => {
        this.model = {}
        if (err) {
          isSubmit = false
        }
        if (!err) {
          let formData = Object.assign(this.model, values)
          formData.firstSettlementTime = formData.firstSettlementTime
            ? formData.firstSettlementTime.format('YYYY-MM-DD')
            : null
          formData.contractAppointGetfeeTime = formData.contractAppointGetfeeTime
            ? formData.contractAppointGetfeeTime.format('YYYY-MM-DD')
            : null
          let isNullObject = allPrpos(formData)
          if (isNullObject) {
            settleDomainForSaveVo.appointInfo = formData
          }
          if (isNullObject && settleDomainForSaveVo.settleDomain) {
            isSubmit = true
          }
        }
      })

      this.$nextTick(() => {
        if (isSubmit) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          let msg = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
            msg = '添加成功!'
          } else {
            httpurl += this.url.edit
            method = 'put'
            msg = '修改成功!'
          }

          httpAction(httpurl, settleDomainForSaveVo, method)
            .then(res => {
              if (Number(res.code) === 200) {
                that.$message.success(msg)
                that.close()
                that.$emit('ok')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    belongContractChange(t) {
      this.customers = []
      httpAction(this.url.getCustomerContract + t, null, 'GET').then(res => {
        if (res.code == 200 && res.data != null) {
          this.customers.push(res.data)
          this.model.customerId = res.data.customerId

          this.$nextTick(() => {
            this.settleDomainForm.setFieldsValue(pick(this.model, 'customerId'))
          })
        }
      })
    },
    handleSearch(value) {
      httpAction(this.url.getContract + value, null, 'get').then(res => {
        if (Number(res.code) === 200) {
          this.customerContracts = res.data
        }
      })
    },
    /**
     * 加载数据字典
     */
    initDictConfig() {
      initDictOptions('server_items').then(res => {
        if (res.code === 200) {
          this.serverItemDicts = res.data
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
      initDictOptions('Tax_Type').then(res => {
        if (res.code === 200) {
          this.taxTypeDicts = res.data
        }
      })
      initDictOptions('Tax_FEE').then(res => {
        if (res.code === 200) {
          this.taxFeeDicts = res.data
        }
      })
      initDictOptions('insuranceType').then(res => {
        if (res.code === 200) {
          this.insuranceTypeDicts = res.data
        }
      })
      initDictOptions('headCoverType').then(res => {
        if (res.code === 200) {
          this.headCoverTypeDicts = res.data
        }
      })
    },
    serverItemChange(value) {
      this.serverItems = ''
      if (value != null && value.length > 0) {
        for (let i = 0; i < value.length; i++) {
          if (i == value.length - 1) {
            this.serverItems += value[i]
          } else {
            this.serverItems += value[i] + ','
          }
        }
      }
    },
    manageServerItemChange(value) {
      this.manageServerItems = ''
      if (value != null && value.length > 0) {
        for (let i = 0; i < value.length; i++) {
          if (i == value.length - 1) {
            this.manageServerItems += value[i]
          } else {
            this.manageServerItems += value[i] + ','
          }
        }
      }
    },
    riskServerItemChange(value) {
      this.riskServerItems = ''
      if (value != null && value.length > 0) {
        for (let i = 0; i < value.length; i++) {
          if (i == value.length - 1) {
            this.riskServerItems += value[i]
          } else {
            this.riskServerItems += value[i] + ','
          }
        }
      }
    },
    getIncomeBelongSub(value, option) {
      this.departs = []
      if (value) {
        httpAction(this.url.getIncomeBelongSub + '?unitId=' + value, null, 'GET').then(res => {
          if (res.code == 200 && res.data.length > 0) {
            this.departs = res.data
          }
        })
      }
      if (option) {
        this.$nextTick(() => {
          this.settleDomainForm.setFieldsValue(pick({ incomeBelongSub: undefined }, 'incomeBelongSub'))
        })
      }
    },
    // Tab标签页点击切换Tab
    callback(key) {
      console.log('---点击切换tab', key)
      this.activeKey = key
    },
    remove(k) {
      if (k < this.coverLength.length - 1) {
        this.$message.success('请从最后一个开始删除！')
        return
      }
      if (this.coverLength.length == 1) {
        this.coverLength.push(String(new Date().getTime()))
      } else {
        this.coverLength.splice(k, 1)
      }
    },
    addItem() {
      this.coverLength.push(String(new Date().getTime()))
    },
    managementTagChange(t) {
      if (t == 0) {
        this.managementFeeDisabled = false
        this.departSettlementInfoRules.managementType.rules = []
        this.departSettlementInfoRules.managementFee.rules = []
        this.departSettlementInfoRules.managementTaxTag.rules = []
        this.departSettlementInfoRules.manageServerItem.rules = []
        this.departSettlementInfoRules.managementType.rules[0] = { required: true, message: '请选择！' }
        this.departSettlementInfoRules.managementFee.rules[0] = { required: true, message: '管理费费率/金额不能为空！' }
        this.departSettlementInfoRules.managementTaxTag.rules[0] = { required: true, message: '请选择管理费税收类型！' }
        this.departSettlementInfoRules.manageServerItem.rules[0] = { required: true, message: '请选择管理费收取项目！' }
        this.departSettlementInfoRules.taxFee.rules = [
          { required: true, message: '请输入缴税税率！' },
          { validator: this.validateTaxFee }
        ]
      } else {
        this.managementFeeDisabled = true
        this.departSettlementInfoRules.managementType.rules = []
        this.departSettlementInfoRules.managementFee.rules = []
        this.departSettlementInfoRules.managementTaxTag.rules = []
        this.departSettlementInfoRules.manageServerItem.rules = []

        this.model.managementType = undefined
        this.model.managementFee = null
        this.model.managementTaxTag = undefined
        this.model.manageServerItem = []
        this.$nextTick(() => {
          this.departSettlementInfoForm.setFieldsValue(
            pick(this.model, 'managementType', 'managementFee', 'managementTaxTag', 'manageServerItem')
          )
        })
      }
    },
    businessRisksManagementTagChange(t) {
      if (t == 0) {
        this.departBusinessRisksDisabled = false
        this.riskManagementTaxTagDisabled = false

        this.departBusinessRisksSettlementRules.riskManagementType.rules = []
        this.departBusinessRisksSettlementRules.riskManagementFee.rules = []
        this.departBusinessRisksSettlementRules.riskManagementTax.rules = []
        this.departBusinessRisksSettlementRules.riskManagementTaxTag.rules = []
        this.departBusinessRisksSettlementRules.riskManagementType.rules[0] = {
          required: true,
          message: '请选择管理费收取方式！'
        }
        this.departBusinessRisksSettlementRules.riskManagementTaxTag.rules[0] = {
          required: true,
          message: '请选择管理费税收是否含税！'
        }
      } else {
        this.departBusinessRisksDisabled = true
        this.riskManagementFeeDisabled = true
        this.riskManagementTaxDisabled = true
        this.riskManagementTaxTagDisabled = true

        this.departBusinessRisksSettlementRules.riskManagementType.rules = []
        this.departBusinessRisksSettlementRules.riskManagementFee.rules = []
        this.departBusinessRisksSettlementRules.riskManagementTax.rules = []
        this.departBusinessRisksSettlementRules.riskManagementTaxTag.rules = []

        this.model.riskManagementType = undefined
        this.model.riskManagementFee = null
        this.model.riskManagementTax = null
        this.model.riskManagementTaxTag = undefined
        this.departBusinessRisksSettlementForm.setFieldsValue(
          pick(this.model, 'riskManagementType', 'riskManagementFee', 'riskManagementTax', 'riskManagementTaxTag')
        )
        // riskFundTaxTagDisabled: true,
      }
    },
    managementTypeChange(t) {
      this.model.managementFee = null
      this.departSettlementInfoForm.setFieldsValue(pick(this.model, 'managementFee'))
      if (t == 1) {
        // this.departSettlementInfoRules.managementFee.rules[1] = { validator: this.validateTax }
        this.departSettlementInfoRules.managementFee.rules[1] = {
          validator: (rule, value, callback) => {
            if (value) {
              if (!/^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,3}){0,1}$/.test(value)) {
                callback('管理费比例格式不正确!')
              }
            }
            callback()
          }
        }
        this.managementFeeAddon = '%'
      } else {
        this.departSettlementInfoRules.managementFee.rules[1] = {
          validator: (rule, value, callback) => {
            if (value) {
              if (
                !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) ||
                value < 0.01 ||
                value > 9999999.99
              ) {
                callback('管理费金额格式不正确!')
              }
            }
            callback()
          }
        }
        this.managementFeeAddon = ''
      }
    },
    riskManagementTypeChange(t) {
      if (t == 0) {
        this.departBusinessRisksSettlementRules.riskManagementFee.rules[0] = {
          required: true,
          message: '请填写商险管理费收取值！'
        }
        this.departBusinessRisksSettlementRules.riskManagementFee.rules[1] = { validator: this.validateFee }
        this.departBusinessRisksSettlementRules.riskManagementTax.rules = []
        this.riskManagementFeeDisabled = false
        this.riskManagementTaxDisabled = true

        this.model.riskManagementTax = null
        this.departBusinessRisksSettlementForm.setFieldsValue(pick(this.model, 'riskManagementTax'))
      } else {
        this.departBusinessRisksSettlementRules.riskManagementFee.rules = []
        this.departBusinessRisksSettlementRules.riskManagementTax.rules[0] = {
          required: true,
          message: '请填写商险管理费收取比率！'
        }
        this.departBusinessRisksSettlementRules.riskManagementTax.rules[1] = { validator: this.validateTaxFee }
        this.riskManagementFeeDisabled = true
        this.riskManagementTaxDisabled = false

        this.model.riskManagementFee = null
        this.departBusinessRisksSettlementForm.setFieldsValue(pick(this.model, 'riskManagementFee'))
      }
      this.riskFundTaxTagDisabled = false
    },
    handleInput(e) {
      e.target.value = e.target.value.match(/^\d*(\.?\d{0,2})/g)[0] || null
    },
    riskFundTagChange(t) {
      if (t == 0) {
        this.riskFundFeeDisabled = false
        this.departSettlementInfoRules.riskFundType.rules = []
        this.departSettlementInfoRules.riskFundFee.rules = []
        this.departSettlementInfoRules.riskFundTaxTag.rules = []
        this.departSettlementInfoRules.riskServerItem.rules = []
        this.departSettlementInfoRules.riskFundType.rules[0] = { required: true, message: '请选择风险金收费类型！' }
        this.departSettlementInfoRules.riskFundFee.rules[0] = { required: true, message: '风险金费率/金额不能为空！' }
        this.departSettlementInfoRules.riskFundTaxTag.rules[0] = { required: true, message: '请选择风险金税收类型！' }
        this.departSettlementInfoRules.riskServerItem.rules[0] = { required: true, message: '请选择风险金收取项目！' }
      } else {
        this.riskFundFeeDisabled = true
        this.departSettlementInfoRules.riskFundType.rules = []
        this.departSettlementInfoRules.riskFundFee.rules = []
        this.departSettlementInfoRules.riskFundTaxTag.rules = []
        this.departSettlementInfoRules.riskServerItem.rules = []

        this.model.riskFundType = undefined
        this.model.riskFundFee = null
        this.model.riskFundTaxTag = undefined
        this.model.riskServerItem = []
        this.$nextTick(() => {
          this.departSettlementInfoForm.setFieldsValue(
            pick(this.model, 'riskFundType', 'riskFundFee', 'riskFundTaxTag', 'riskServerItem')
          )
        })
      }
    },
    riskFundTypeChange(t) {
      this.model.riskFundFee = null
      this.departSettlementInfoForm.setFieldsValue(pick(this.model, 'riskFundFee'))
      if (t == 1) {
        this.departSettlementInfoRules.riskFundFee.rules[1] = { validator: this.validateTax }
        this.riskFundFeeAddon = '%'
      } else {
        this.departSettlementInfoRules.riskFundFee.rules[1] = {
          validator: (rule, value, callback) => {
            if (value) {
              if (
                !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) ||
                value < 0.01 ||
                value > 9999999.99
              ) {
                callback('风险金金额格式不正确!')
              }
            }
            callback()
          }
        }
        this.riskFundFeeAddon = ''
      }
    },
    numberOnly(e) {
      if ((e.keyCode != 46 && e.keyCode != 45 && e.keyCode < 48) || e.keyCode > 57) e.returnValue = false
    },
    validateTaxFee(rule, value, callback) {
      if (!value || new RegExp(/^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|0$/).test(value)) {
        callback()
      } else {
        callback('数据不正确，请输入如: 6.87!')
      }
    },
    validateTax(rule, value, callback) {
      if (!value || new RegExp(/^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$/).test(value)) {
        callback()
      } else {
        callback('数据不正确，请输入如: 100以内的小数或整数!')
      }
    },
    validateFee(rule, value, callback) {
      if (!value || new RegExp(/^\+?[1-9][0-9]{0,10}$/).test(value)) {
        callback()
      } else {
        callback('只能输入数字!')
      }
    }
  }
}
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 150px;
  }
}
</style>