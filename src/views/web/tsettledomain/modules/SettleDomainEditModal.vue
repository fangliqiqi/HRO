<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    cancelText="关闭"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-tabs
        @change="callback"
        v-model="activeKey"
        defaultActiveKey="1"
      >
        <a-tab-pane
          key="1"
          tab="结算信息"
        >
          <a-form
            :form="settleDomainForm"
            style="min-height: 350px;"
            layout="inline"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="所属客户"
                >
                  <select-page
                    :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
                    :title="'customerName'"
                    v-decorator="['customerId', validatorRules.customerId ]"
                    placeholder="请选择客户"
                    style="width: 270px"
                    :resList="resList"
                    :allowClear="false"
                    @select="handleSelectPage"
                    :id="'id'"
                  ></select-page>
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
                    style="width: 270px"
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
                    showSearch
                    placeholder="请选择收入归属细分"
                    optionFilterProp="children"
                    style="width: 179px"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['incomeBelongSub',validatorRules.incomeBelongSub]"
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
                    style="width: 120px"
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
                    :dropdownMatchSelectWidth="false"
                    style="width: 120px"
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
                    style="width: 120px"
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
        </a-tab-pane>
        <a-tab-pane
          key="2"
          tab="结算配置"
          :forceRender="true"
        >
          <a-form
            :form="departSettlementInfoForm"
            layout="inline"
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
                    addonAfter="%"
                    style="width: 180px;"
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
                    :disabled="managementTypeDisabled"
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
                    placeholder="管理费费率/金额"
                    style="width: 180px;"
                    :addonAfter="managementFeeAddon"
                    :disabled="managementTypeDisabled"
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
                    :addonAfter="riskFundFeeAddon"
                    style="width: 180px;"
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
                    :allowClear="true"
                    style="width: 180px;"
                    :disabled="managementTypeDisabled"
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
                    :disabled="riskFundFeeDisabled"
                    @change="riskServerItemChange"
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
                    :disabled="managementTypeDisabled"
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
                      :value="String(item.id)"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="缴税税率"
                >
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

        </a-tab-pane>
        <a-tab-pane
          key="3"
          tab="福利购买信息"
        >
          <a-form
            :form="dockingPeopleForm"
            layout="inline"
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
                  label="其他福利"
                >
                  <a-input
                    placeholder="其他福利"
                    v-decorator="['otherWelfare']"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane
          key="4"
          tab="封面抬头"
          :forceRender="true"
        >
          <a-form
            :form="tableHeaderCoverForm"
            layout="inline"
          >
            <j-editable-table
              ref="editableTable1"
              :loading="table1.loading"
              :columns="table1.columns"
              :dataSource="table1.dataSource"
              :maxHeight="300"
              :rowNumber="true"
              :rowSelection="true"
              :actionButton="true"
            >
            </j-editable-table>
          </a-form>
        </a-tab-pane>
        <a-tab-pane
          key="5"
          tab="核准表开票"
          :forceRender="isApproval"
        >
          <a-form
            :form="approvalFormTickectForm"
            layout="inline"
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
                    style="width:250px"
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
                    style="width:250px"
                    v-decorator="['selfTomoneyUnitName', approvalFormTickectRules.selfTomoneyUnitName ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane
          key="6"
          tab="商险结算配置"
        >
          <a-form
            :form="departBusinessRisksSettlementForm"
            layout="inline"
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
                    style="width: 180px;"
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
                    style="width: 180px;"
                    addonAfter="%"
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
                    :disabled="departBusinessRisksDisabled"
                    style="width: 180px;"
                    v-decorator="['riskManagementTaxTag',departBusinessRisksSettlementRules.riskManagementTaxTag]"
                  >
                    <a-select-option value="0">含税</a-select-option>
                    <a-select-option value="1">不含税</a-select-option>
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
                    v-decorator="['taxType',departBusinessRisksSettlementRules.taxType ]"
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
                  <a-input
                    placeholder="缴税税率"
                    style="width: 180px;"
                    addonAfter="%"
                    v-decorator="['taxValue']"
                  />
                </a-form-item>
              </a-col>
            </a-row>

          </a-form>
        </a-tab-pane>
        <a-tab-pane
          key="7"
          tab="客户约定配置"
        >
          <a-form
            :form="departAppointInfoForm"
            layout="inline"
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
                    :format="format"
                    placeholder="首次结算时间"
                    style="width: 180px; text-align: center"
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
                    :format="format"
                    placeholder="合同约定到款时间"
                    style="width: 180px; text-align: center"
                    v-decorator="[ 'contractAppointGetfeeTime', {}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>

      </a-tabs>
    </a-spin>
  </a-modal>
</template>
  
  <script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import {initDictOptions} from '@/components/dict/JDictSelectUtil'
  import JEditableTable from '@/components/jeecg/JEditableTable'
  import { FormTypes,getRefPromise } from '@/utils/JEditableTableUtil'
  import { allPrpos,clearUnde } from '@/utils/beanUtils'
  import moment from 'moment';

  export default {
    name: "SettleDomainEditModal",
    components: {
      SelectPage,
      JEditableTable,
    },
    data () {
      return {
        title:"操作",
        visible: false,
        confirmLoading: false,
        isContract:false,
        areaTrees:[],
        areaCitys:[],
        areaTowns:[],
        settleDomainForm: this.$form.createForm(this),
        departSettlementInfoForm: this.$form.createForm(this),
        dockingPeopleForm: this.$form.createForm(this),
        tableHeaderCoverForm: this.$form.createForm(this),
        approvalFormTickectForm: this.$form.createForm(this),
        departBusinessRisksSettlementForm: this.$form.createForm(this),
        departAppointInfoForm: this.$form.createForm(this),
        model:{},
        activeKey:"1",
        serverItemList:[],
        isApproval:false,
        resList:[], //默认选中客户
        customerContracts:[], //客户合同
        organAll:[], //收入归属
        departs:[], //收入归属细分
        serverItemDicts:[], //服务项目
        managementTypeDisabled:false, // 管理费收费类型
        riskFundTypeDisabled:false, // 风险金收取方式
        managementFeeAddon: "",
        riskFundFeeAddon: "",
        managementFeeDisabled: true,
        riskFundFeeDisabled: true,
        manageServerItemsDicts: [], //管理费收取项目
        riskServerItemsDicts: [], // 风险金收取项目
        taxTypeDicts: [],  // 缴税类型
        insuranceTypeDicts:[], // 保险类型
        departBusinessRisksDisabled:true, // 管理费收取方式
        riskManagementFeeDisabled: true, // 商险管理费收取值
        riskManagementTaxDisabled: true, // 商险管理费收取比率

        validatorRules:{
          customerId:{rules: [{ required: true, message: '请选择客户!' }]},
          belongContract:{rules: [{ required: true, message: '请输入合同主体!' }]},
          departName:{rules: [{ required: true, message: '请输入结算主体名称!' }]},
          incomeBelong:{rules: [{ required: true, message: '请选择收入归属!' }]},
          incomeBelongSub:{rules: [{ required: true, message: '请选择收入归属细分!' }]},
          serverItem:{rules: [{ required: true, message: '请选择服务项目!' }]},
          province: { rules: [{ required: true, message: '省份不能为空!' }] },
          city: { rules: [{ required: true, message: '城市不能为空!' }] },
        },
        departSettlementInfoRules:{
          socialCardTaker: { rules: [{ required: true, message: '请选择社保卡收取!' }] },
          unitSeriousIllnessProp:{rules:[
            {pattern:/^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|100|0)$/,message:'单位大病比例格式不正确!'},
            { required: true, message: '单位大病比例不能为空!' }
          ]},
          managementTag: { rules: [{ required: true, message: '请选择管理费是否收费!' }] },
          riskFundTag: { rules: [{ required: true, message: '请选择风险金是否收取!' }] },
          managementType: { rules: [] },
          managementFee: { rules: [] },
          managementTaxTag: { rules: [] },
          manageServerItem: { rules: [] },
          taxType: { rules: [{ required: true, message: '缴税类型!' }] },
          taxFee: { rules: [
            {pattern:/^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|100|0)$/,message:'缴税税率格式不正确!'},
            { required: true, message: '缴税税率不能为空!' }
          ] },
          managementExpFlag: { rules: [{ required: true, message: '管理费扣税!' }] },
          riskFundType: { rules: [] },
          riskFundFee: { rules: [] },
          riskServerItem: { rules: [] },
          riskFundTaxTag: { rules: [] },

        },
        validatorDockingPeopleRules:{
          welfareAddr:{rules: [{ required: true, message: '请输入福利购买地!' }]},
          insuranceType:{rules: [{ required: true, message: '请选择保险类型!' }]},
        },
        table1: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '抬头名称',
              key: 'coverName',
              width: '50%',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: `请输入抬头名称`,
              validateRules: [{ required: true, message: `抬头名称不能为空` }]
            },
            {
              title: '抬头类型',
              key: 'type',
              width: '50%',
              type: FormTypes.select,
              options: [ // 下拉选项
                { title: '薪资封面', value: '0' },
                { title: '商险封面', value: '1' },
                { title: '核准表封面', value: '2' },
                { title: '代理预估封面', value: '3' }
              ],
              defaultValue: '',
              placeholder: `请选择抬头类型`,
              validateRules: [{ required: true, message: `抬头类型不能为空` },{unique:true,message:`抬头类型不能重复`}]
            }
          ]
        },
        approvalFormTickectRules:{
          customerTicketName:{rules: [{ required: true, message: '请输入客户开票名称!' }]},
          selfTomoneyUnitName:{rules: [{ required: true, message: '请输入我司到款单位名称!' }]}
        },
        departBusinessRisksSettlementRules:{
          managementTag:{rules: [{ required: true, message: '请选择是否收取管理费!' }]},
          riskManagementType:{rules: []},
          riskManagementTax:{rules: []},
          riskManagementFee:{rules:[]},
          riskManagementTaxTag:{ rules:[] },
          taxType:{rules: [{ required: true, message: '缴税类型不能为空!' }]},
          taxValue:{rules: [
            { required: true, message: '缴税税率不能为空!' },
            {pattern:/^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|100|0)$/,message:'缴税税率格式不正确!'},
          ]},
        },
        departAppointInfoSettlementRules:{
          socialSettlementType:{rules:[{max:32,message:'社保结算时间最多32个字符!'}]},
          fundSettlementType:{rules:[{max:32,message:'公积金结算时间最多32个字符!'}]},
          salaryType:{rules:[{max:32,message:'工资发放时间最多32个字符!'}]},
          customerGetformTime:{rules:[{pattern:/^((0?[1-9])|((1|2)[0-9])|30|31)$/,message:'客户到表时间只能为0~31之间的数字!'}]},
          wxOutAccountsTime:{rules:[{pattern:/^((0?[1-9])|((1|2)[0-9])|30|31)$/,message:'皖信出账时间只能为0~31之间的数字!'}]},
          customerSuerTime:{rules:[{pattern:/^((0?[1-9])|((1|2)[0-9])|30|31)$/,message:'客户确认时间只能为0~31之间的数字!'}]},
          wxTicketTime:{rules:[{pattern:/^((0?[1-9])|((1|2)[0-9])|30|31)$/,message:'皖信出票时间只能为0~31之间的数字!'}]},
          customerGetfeeTime:{rules:[{pattern:/^((0?[1-9])|((1|2)[0-9])|30|31)$/,message:'客户到账时间只能为0~31之间的数字!'}]},
          salaryGrantTime:{rules:[{pattern:/^((0?[1-9])|((1|2)[0-9])|30|31)$/,message:'工资发放时间只能为0~31之间的数字!'}]},
        },
        salaryTypeOption:['当月结算当月费用','当月结算次月费用','当月结算上月费用','其他'],
        url:{
          getIncomeBelongSub: "/admin/organizationinfo/getDepartByUnitId",
          getCustomerContractList:'/hrBase/tcustomercontract/page?selectType=3&size=50&customerId=',
          batchDeleteCover: '/hrBase/ttableheadsalarycover/batch',
          edit: "/hrBase/tsettledomain/vo",
        },
        format:'YYYY-MM-DD'

      }
    },
    methods: {
      edit(record){
        this.initDictConfig()
        this.model = record
        this.visible = true
        /*******************结算信息********************/
        // 合同主体选中
        this.selectCustomerDefault(this.model.settleDomain.customerId,this.model.settleDomain.belongContract)
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
        /*******************结算配置********************/
        if(this.model.departSettlementInfo){
          if(this.model.departSettlementInfo.managementTag == 0) {
            this.managementFeeAddon = (String(this.model.departSettlementInfo.managementType) === '0') ? '' : '%'
          }
          // 管理费是否收取
          this.managementTagChange(this.model.departSettlementInfo.managementTag)
          // 风险金是否收取
          this.riskFundTagChange(this.model.departSettlementInfo.riskFundTag)
        }
        this.serverItemChange(this.model.settleDomain.serverItem.split(','))
        this.$nextTick(() => {
          // 服务项目
          if(this.model.settleDomain.serverItem){
            const serverItem = this.model.settleDomain.serverItem.split(',')
            this.serverItemList = serverItem
            // this.serverItemChange(this.serverItemList)
            this.settleDomainForm.setFieldsValue(pick({serverItem:serverItem},'serverItem'))
          }
          // customerId
          this.model.settleDomain.customerId = String(this.model.settleDomain.customerId)
          this.settleDomainForm.setFieldsValue(pick(this.model.settleDomain,'departName','belongContract','incomeBelong','incomeBelongSub','customerId','province','city','town'))
          // 结算配置
          this.departSettlementInfoForm.setFieldsValue(pick(this.model.departSettlementInfo,'socialCardTaker','unitSeriousIllnessProp',
          'managementTag','riskFundTag','taxType','managementExpFlag','taxFee'))
          /*****************福利购买信息********************************/
          // this.dockingPeopleForm.setFieldsValue(pick(this.model.buyWelfare,'welfareAddr','insuranceType','otherWelfare'))
          /*****************核准表开票********************************/
          // this.approvalFormTickectForm.setFieldsValue(pick(this.model.approvalFormTickect,'customerTicketName','selfTomoneyUnitName'))

        })
      },
      callback(key){
        switch (key) {
          case '3':
            this.$nextTick(() => {
              this.dockingPeopleForm.setFieldsValue(pick(this.model.buyWelfare,'welfareAddr','insuranceType','otherWelfare'))
            })
            break
          case '4':
            /*************************封面抬头*************************************/
            this.$refs.editableTable1.url.batchDelete = this.url.batchDeleteCover
            getRefPromise(this, 'editableTable').then(editableTable => {
              editableTable.resetScrollTop()
            })
            this.table1.dataSource = this.model.tableHeadSalaryCover
            break
          case '5':
            /*****************核准表开票********************************/
            this.$nextTick(() => {
              this.approvalFormTickectForm.setFieldsValue(pick(this.model.approvalFormTickect,'customerTicketName','selfTomoneyUnitName'))
            })
            break
          case '6':
            if(this.model.businessRisksSettlement){
              this.businessRisksManagementTagChange(this.model.businessRisksSettlement.managementTag)
              if(String(this.model.businessRisksSettlement.managementTag) === '0'){
                this.riskManagementTypeChange(this.model.businessRisksSettlement.riskManagementType)
              }
            }
            this.$nextTick(() => {
              if(this.model.businessRisksSettlement){
                this.departBusinessRisksSettlementForm.setFieldsValue(pick(this.model.businessRisksSettlement,'managementTag','taxType','taxValue'));
                if(String(this.model.businessRisksSettlement.managementTag) === '0'){
                  this.departBusinessRisksDisabled = false
                  this.departBusinessRisksSettlementForm.setFieldsValue(pick(this.model.businessRisksSettlement,'riskManagementType','riskManagementTaxTag'));
                }
              }
            })
            break
          case '7':
            /*****************客户约定配置****************************/
            this.apointConfig()
            break
        }
      },
      apointConfig(){
        if(this.model.appointInfo){
          this.model.appointInfo.firstSettlementTime = this.model.appointInfo.firstSettlementTime ? moment(this.model.appointInfo.firstSettlementTime, this.format) : null
          this.model.appointInfo.contractAppointGetfeeTime = (this.model.appointInfo.contractAppointGetfeeTime) ? moment(this.model.appointInfo.contractAppointGetfeeTime, this.format) : null
          this.$nextTick(() => {
            this.departAppointInfoForm.setFieldsValue(pick(this.model.appointInfo,'socialSettlementType','fundSettlementType',
            'salaryType','customerGetformTime','wxOutAccountsTime','customerSuerTime',
            'wxTicketTime','customerGetfeeTime','salaryGrantTime','firstSettlementTime',
            'contractAppointGetfeeTime'))
          })
        }
      },
      // 选择客户改变
      handleSelectPage(val){
        this.$nextTick(() => {
          this.settleDomainForm.setFieldsValue(pick({customerId:val,belongContract:undefined},'customerId','belongContract'))
        })
        httpAction(this.url.getCustomerContractList+val,null,'get').then((res)=>{
          if(res.code === 200 && res.data.total){
            this.customerContracts = res.data.records
          }else{
            this.customerContracts = []
            this.$message.warning('该客户暂无合同信息');
          }
        })
      },
      selectCustomerDefault(value,belongContract){
        let url = this.url.getCustomerContractList+value
        this.settleDomainForm.setFieldsValue(pick({belongContract:undefined},'belongContract'))
        if(belongContract){
          url = this.url.getCustomerContractList+value + '&id='+belongContract
        }
        httpAction(url,null,'get').then((res)=>{
          if(res.code == 200 && res.data.total){
            this.customerContracts = res.data.records
          }else{
            this.customerContracts = []
            this.$message.warning('该客户暂无合同信息');
          }
        }).finally(()=>{
          this.isContract=false
        })
      },
      // 收入归属改变
      getIncomeBelongSub(value,option) {
        this.departs = [];
        if(value === undefined) {
          this.settleDomainForm.setFieldsValue(pick({incomeBelongSub:undefined},'incomeBelongSub'))
        }else{
          httpAction(`${this.url.getIncomeBelongSub}?unitId=${value}`, null, "GET").then((res) => {
            if(res.code == 200 && res.data) {
              this.departs = res.data;
              if(option){
                this.settleDomainForm.setFieldsValue(pick({incomeBelongSub:undefined},'incomeBelongSub'))
              }else{
                const incomeBelongSub = (this.model.settleDomain.incomeBelongSub) ? String(this.model.settleDomain.incomeBelongSub) : undefined
                this.settleDomainForm.setFieldsValue(pick({incomeBelongSub:incomeBelongSub},'incomeBelongSub'))
              }
            }
          })
        }
      },
      // 服务项目改变
      serverItemChange(val){
        this.serverItemList = val
        if (/(社保|公积金)/.test(this.serverItemList.join(','))) {
          this.isApproval = true
        }else{
          this.isApproval = false
        }
      },
      // 省份改变
      handleProvinceChange(value) {
        this.areaCitys= [];
        this.areaTowns = [];
        for(var c of this.areaTrees[value - 1].children) {
          this.areaCitys.push(c);
        }
        for(var t of this.areaCitys[0].children) {
          this.areaTowns.push(t);
        }
        this.settleDomainForm.setFieldsValue(pick({city:this.areaCitys[0].id,town:this.areaTowns[0].id},'city','town'))
      },
      // 城市改变
      handleCityChange(value) {
        this.areaTowns = [];
        for(var c of this.areaCitys) {
          if(c.id == value) {
            if(c.children.length > 0) {
              for(var t of c.children) {
                this.areaTowns.push(t);
              }
            }
          }
        }
        if(this.areaTowns.length > 0) {
          this.settleDomainForm.setFieldsValue(pick({town:this.areaTowns[0].id},'town'))
        } else {
          this.settleDomainForm.setFieldsValue(pick({town:null},'town'))
        }
      },
      // 管理费是否收费
      managementTagChange(val){
        this.managementFeeAddon = ( this.model.departSettlementInfo && String(this.model.departSettlementInfo.managementType) === '1') ? '%' : ''
        if(String(val) === '0'){ // 是
          this.managementTypeDisabled = false
          this.departSettlementInfoRules.managementType.rules = []
          this.departSettlementInfoRules.managementFee.rules = []
          this.departSettlementInfoRules.managementTaxTag.rules = []
          this.departSettlementInfoRules.manageServerItem.rules = []
          this.departSettlementInfoRules.managementType.rules[0] = { required: true, message: '请选择管理费收费类型！' }
          this.departSettlementInfoRules.managementFee.rules[0] = { required: true, message: '管理费费率/金额不能为空！' }
          this.departSettlementInfoRules.managementTaxTag.rules[0] = { required: true, message: '请选择管理费税收类型！' }
          this.departSettlementInfoRules.manageServerItem.rules[0] = { required: true, message: '请选择管理费收取项目！' }
          let defaultVal = {managementType:'',managementFee:'',managementTaxTag:'',manageServerItem:[]}
          if(this.model.departSettlementInfo){
            defaultVal = {
              managementType : this.model.departSettlementInfo.managementType ? this.model.departSettlementInfo.managementType : '',
              managementFee : this.model.departSettlementInfo.managementFee ? this.model.departSettlementInfo.managementFee : '',
              managementTaxTag : this.model.departSettlementInfo.managementTaxTag ? this.model.departSettlementInfo.managementTaxTag : '',
              manageServerItem : (this.model.departSettlementInfo.manageServerItem) ? this.model.departSettlementInfo.manageServerItem.split(',') : []
            }
          }
          this.$nextTick(() => {
            this.departSettlementInfoForm.setFieldsValue(pick(defaultVal,
            'managementType','managementFee','manageServerItem','managementTaxTag'))
          })
        }else{ //否 清空
          this.managementTypeDisabled = true
          this.departSettlementInfoRules.managementType.rules = []
          this.departSettlementInfoRules.managementFee.rules = []
          this.departSettlementInfoRules.managementTaxTag.rules = []
          this.departSettlementInfoRules.manageServerItem.rules = []
          this.$nextTick(() => {
            this.departSettlementInfoForm.setFieldsValue(pick({managementType:undefined,managementFee:'',manageServerItem:[],managementTaxTag:undefined},
            'managementType','managementFee','manageServerItem','managementTaxTag'))
          })
        }
      },
      // 风险金是否收取
      riskFundTagChange(val){
        this.riskFundFeeAddon = (this.model.departSettlementInfo && String(this.model.departSettlementInfo.riskFundType) === '1') ? '%' : ''
        if(String(val) === '0'){
          this.riskFundFeeDisabled = false
          this.departSettlementInfoRules.riskFundType.rules = [];
          this.departSettlementInfoRules.riskFundFee.rules = [];
          this.departSettlementInfoRules.riskFundTaxTag.rules = [];
          this.departSettlementInfoRules.riskServerItem.rules = [];
          this.departSettlementInfoRules.riskFundType.rules[0] = { required: true, message: '请选择风险金收费类型！' }
          if(this.model.departSettlementInfo != null && this.model.departSettlementInfo.riskFundType == 0){
            this.departSettlementInfoRules.riskFundFee.rules = [
              {required: true, message: '风险金金额不能为空!' },
              {validator:(rule,value, callback)=>{
              if(value){
                if( ! /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) || value < 0.01 || value > 9999999.99){
                  callback('风险金金额不正确!')
                }
              }
              callback()
              }}
            ]
          }else{
            this.departSettlementInfoRules.riskFundFee.rules = [
              {pattern:/^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|100|0)$/,message:'风险金费率格式不正确!'},
              {required: true, message: '风险金费率不能为空!' }
            ]
          }

          this.departSettlementInfoRules.riskFundTaxTag.rules[0] = { required: true, message: '请选择风险金税收类型！' }
          this.departSettlementInfoRules.riskServerItem.rules[0] = { required: true, message: '请选择风险金收取项目！' }
          let defaultVal = {riskFundType:'',riskFundFee:'',riskFundTaxTag:'',riskServerItem:[]}
          if(this.model.departSettlementInfo){
            defaultVal = {
              riskFundType : this.model.departSettlementInfo.riskFundType ? this.model.departSettlementInfo.riskFundType : '',
              riskFundFee : this.model.departSettlementInfo.riskFundFee ? this.model.departSettlementInfo.riskFundFee : '',
              riskFundTaxTag : this.model.departSettlementInfo.riskFundTaxTag ? this.model.departSettlementInfo.riskFundTaxTag : '',
              riskServerItem : (this.model.departSettlementInfo.riskServerItem) ? this.model.departSettlementInfo.riskServerItem.split(',') : []
            }
          }

          this.$nextTick(() => {
            this.departSettlementInfoForm.setFieldsValue(pick(defaultVal,
            'riskFundType','riskFundFee','riskServerItem','riskFundTaxTag'))
          })
        }else{
          this.riskFundFeeDisabled = true
          this.departSettlementInfoRules.riskFundType.rules = []
          this.departSettlementInfoRules.riskFundFee.rules = []
          this.departSettlementInfoRules.riskServerItem.rules = []
          this.departSettlementInfoRules.riskFundTaxTag.rules = []
          this.$nextTick(() => {
            this.departSettlementInfoForm.setFieldsValue(pick({riskFundType:undefined,riskFundFee:'',riskServerItem:[],riskFundTaxTag:undefined},
            'riskFundType','riskFundFee','riskServerItem','riskFundTaxTag'))
          })
        }
      },
      // 管理费收费类型改变
      managementTypeChange(val){
        if(String(val) === '0'){ // 按固定值收费
          this.managementFeeAddon = ''
          this.departSettlementInfoRules.managementFee.rules[1] = {
            validator:(rule,value, callback)=>{
              if(value){
                if( ! /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) || value < 0.01 || value > 9999999.99){
                  callback('管理费金额格式不正确!')
                }
              }
              callback()
            }
          }
        }else{ //按比例收费
          this.managementFeeAddon = '%'
          this.departSettlementInfoRules.managementFee.rules[1] = { validator: (rule,value, callback)=>{
            if(value){
              if( ! /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,3}){0,1}$/.test(value)){
                callback('管理费比例格式不正确!')
              }
            }
            callback()
          } }
        }
        this.$nextTick(() => {
          this.departSettlementInfoForm.setFieldsValue(pick({managementFee:''},'managementFee'))
        })
      },
      // 风险金收取方式
      riskFundTypeChange(val){
        this.riskFundFeeAddon = (String(val) === '1') ? '%' : ''
        if(String(val) === '0'){ // 固定值
          this.departSettlementInfoRules.riskFundFee.rules = [{
            validator:(rule,value, callback)=>{
              if(value){
                if( ! /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) || value < 0.01 || value > 9999999.99){
                  callback('风险金金额不正确!')
                }
              }
              callback()
            }
          },{
            required: true, message: '风险金金额不能为空!'
          }]
        }else{ //比例
          this.departSettlementInfoRules.riskFundFee.rules= [
            { validator: (rule,value, callback)=>{
              if(value){
                if( ! /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,3}){0,1}$/.test(value)){
                  callback('风险金费率不正确!')
                }
              }
              callback()
            }},{
              required: true, message: '风险金费率不能为空!'
            }
          ]
        }
        this.$nextTick(() => {
          this.departSettlementInfoForm.setFieldsValue(pick({riskFundFee:''},'riskFundFee'))
        })
      },
      // 管理费收取项目
      manageServerItemChange(){

      },
      // 风险金收取项目
      riskServerItemChange(){

      },
      // 是否收取管理费
      businessRisksManagementTagChange(val){
        if(val == 1){
          this.departBusinessRisksDisabled = this.riskManagementFeeDisabled = this.riskManagementTaxDisabled = true
          this.departBusinessRisksSettlementRules.riskManagementType.rules = []
          this.departBusinessRisksSettlementRules.riskManagementTax.rules = []
          this.departBusinessRisksSettlementRules.riskManagementTaxTag.rules = []
          this.departBusinessRisksSettlementRules.riskManagementFee = []
          // departBusinessRisksSettlementForm
          this.$nextTick(() => {
            this.departBusinessRisksSettlementForm.setFieldsValue(pick({riskManagementType:undefined,
            riskManagementFee:'',riskManagementTax:'',riskManagementTaxTag:undefined},'riskManagementType','riskManagementFee','riskManagementTax','riskManagementTaxTag'))
          })
        }else{ //是
          this.departBusinessRisksDisabled = this.riskManagementFeeDisabled = this.riskManagementTaxDisabled = false
          this.departBusinessRisksSettlementRules.riskManagementType.rules = [{ required: true, message: '请选择管理费收取方式！' }]
          this.departBusinessRisksSettlementRules.riskManagementFee.rules = [{ required: true, message: '请输入商险管理费收取值！' },{validator:(rule,value,callback)=>{
            if(value){
              if( ! /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) || value < 0.01 || value > 9999999.99){
                callback('商险管理费金额格式不正确!')
              }
            }
            callback()
          }}]
          this.departBusinessRisksSettlementRules.riskManagementTax.rules = [{ required: true, message: '请填写商险管理费收取比率！' },{validator:(rule,value,callback)=>{
            if (!value || new RegExp(/^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|0)$/).test(value)){
              callback();
            }else{
              callback("商险管理费收取比率不正确!");
            }
          }}]
          this.departBusinessRisksSettlementRules.riskManagementTaxTag.rules = [{ required: true, message: '请选择管理费税收是否含税！' }]
        }
      },
      // 管理费收取方式
      riskManagementTypeChange(val,option){
        if(String(val) === '1'){ //比例收取
          this.riskManagementTaxDisabled = false
          this.riskManagementFeeDisabled = true
          this.departBusinessRisksSettlementRules.riskManagementFee.rules = []
          this.departBusinessRisksSettlementRules.riskManagementTax.rules = [{ required: true, message: '请填写商险管理费收取比率！' },{validator:(rule,value,callback)=>{
            if (!value || new RegExp(/^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|0)$/).test(value)){
              callback();
            }else{
              callback("商险管理费收取比率不正确!");
            }
          }}]
          this.$nextTick(() => {
            this.departBusinessRisksSettlementForm.setFieldsValue(pick({riskManagementFee:''},'riskManagementFee'))
          })
        }else{ //固定值
          this.riskManagementTaxDisabled = true
          this.riskManagementFeeDisabled = false
          this.departBusinessRisksSettlementRules.riskManagementTax.rules = []
          this.departBusinessRisksSettlementRules.riskManagementFee.rules = [{ required: true, message: '请输入商险管理费收取值！' },{validator:(rule,value,callback)=>{
            if(value){
              if( ! /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) || value < 0.01 || value > 9999999.99){
                callback('商险管理费金额格式不正确!')
              }
            }
            callback()
          }}]
          this.$nextTick(() => {
            this.departBusinessRisksSettlementForm.setFieldsValue(pick({riskManagementTax:''},'riskManagementTax'))
          })
        }
        if(!option){
          if(this.model.businessRisksSettlement){
            let defaultVal = {
              riskManagementTax:(this.model.businessRisksSettlement.riskManagementTax) ? this.model.businessRisksSettlement.riskManagementTax : '',
              riskManagementFee:(this.model.businessRisksSettlement.riskManagementFee) ? this.model.businessRisksSettlement.riskManagementFee : '',
            }
            this.$nextTick(() => {
              this.departBusinessRisksSettlementForm.setFieldsValue(pick(defaultVal,
              'riskManagementTax','riskManagementFee'))
            })
          }
        }
      },
      validateSettleDomainForm(isSubmit){
        const data = {settleDomain:{},isSubmit:isSubmit}
        this.settleDomainForm.validateFields((err, values) => {
          if (!err) {
            const formData = Object.assign(this.model.settleDomain, values)
            formData.serverItem = formData.serverItem.join(',')
            formData.town = (values.town) ? values.town : null
            delete formData.customerName
            delete formData.businessSubject
            delete formData.businessSubjectName
            data.settleDomain = formData
          }else{
            data.isSubmit.flag = false
            data.isSubmit.index[0] = 1
          }
        })
        return data
      },
      validateApprovalFormTickectForm(isSubmit,approvalFormTickect){
        const data = {approvalFormTickect:approvalFormTickect,isSubmit:isSubmit}
        this.approvalFormTickectForm.validateFields((err, values) => {
          if(err) {
            data.isSubmit.flag = false
            data.isSubmit.index[1] = 5
          }
          if (!err && Object.keys(values).length > 0) {
            const formData = (this.model.approvalFormTickect) ? Object.assign(this.model.approvalFormTickect, values) : values
            let isNullObject = allPrpos(formData)
            if(isNullObject) {
              data.approvalFormTickect = formData
            }
          }
        })
        return data
      },
      validateDepartSettlementInfoForm(isSubmit,departSettlementInfo){
        const data = {departSettlementInfo:departSettlementInfo,isSubmit:isSubmit}
        this.departSettlementInfoForm.validateFields((err, values) => {
          if(err) {
            data.isSubmit.flag = false
            data.isSubmit.index[1] = 2
          }
          if (!err && Object.keys(values).length > 0) {
            const formData = this.model.departSettlementInfo ? Object.assign(this.model.departSettlementInfo, values) : values
            let isNullObject = allPrpos(formData)
            if(isNullObject){
              formData.manageServerItem = formData.manageServerItem.join(',')
              formData.riskServerItem = formData.riskServerItem.join(',')
              data.departSettlementInfo = clearUnde(formData)
            }
          }
        })
        return data
      },
      validateDockingPeopleForm(isSubmit,buyWelfare){
        const data = {buyWelfare:buyWelfare,isSubmit:isSubmit}
        this.dockingPeopleForm.validateFields((err, values) => {
          if(err) {
            data.isSubmit.flag = false
            data.isSubmit.index[1] = 3
          }
          if (!err && Object.keys(values).length > 0) {
            const formData = (this.model.buyWelfare) ? Object.assign(this.model.buyWelfare, values) : values
            const isNullObject = allPrpos(formData)
            if(isNullObject) {
              data.buyWelfare = formData
            }
          }
        })
        return data
      },
      validateTableHeaderCoverForm(isSubmit,tableHeadSalaryCover){
        const data = {tableHeadSalaryCover:tableHeadSalaryCover,isSubmit:isSubmit}
        this.tableHeaderCoverForm.validateFields((err, vs) => {
          if(this.$refs.editableTable1){
            this.$refs.editableTable1.getValues((error,values)=>{
              console.log(err, vs)
              if(error == 0){
                const arr = values.map(item=>{
                  const items = {type:'',coverName:''}
                  items.type = item.type
                  items.coverName = item.coverName
                  if(!/_add/gi.test(item.id)){
                    items.id = item.id
                  }
                  return items
                })
                data.tableHeadSalaryCover = arr
              }else{
                data.isSubmit.flag = false
                data.isSubmit.index[1] = 4
              }
            },true)
          }
        })
        return data
      },
      validateDepartBusinessRisksSettlementForm(isSubmit,businessRisksSettlement){
        const data = {businessRisksSettlement:businessRisksSettlement,isSubmit:isSubmit}
        this.departBusinessRisksSettlementForm.validateFields((err, values) => {
          if(err) {
            data.isSubmit.flag = false
            data.isSubmit.index[1] = 6
          }
          if (!err && Object.keys(values).length > 0) {
            const formData = (this.model.businessRisksSettlement) ? Object.assign(this.model.businessRisksSettlement, values) : values
            let isNullObject = allPrpos(formData)
            if(isNullObject) {
              data.businessRisksSettlement = clearUnde(formData)
            }
          }
        })
        return data
      },
      validateDepartAppointInfoForm(isSubmit,appointInfo){
        const data = {appointInfo:appointInfo,isSubmit:isSubmit}
        this.departAppointInfoForm.validateFields((err, values) => {
          if(err) {
            data.isSubmit.flag = false
            data.isSubmit.index[1] = 7
          }
          if (!err && Object.keys(values).length > 0) {
            let formData
            if(this.model.appointInfo){
              formData = Object.assign(this.model.appointInfo, values)
            }else{
              formData = values
            }
            formData.firstSettlementTime = formData.firstSettlementTime ? formData.firstSettlementTime.format(this.format) : null
            formData.contractAppointGetfeeTime = formData.contractAppointGetfeeTime ? formData.contractAppointGetfeeTime.format(this.format) : null
            const isNullObject = allPrpos(formData)
            if(isNullObject) {
              data.appointInfo = formData
            }
          }
        })
        return data
      },

      handleOk(){
        const settleDomainForSaveVo = {}

        let isSubmit = {
          flag:true,
          index:[]
        }
        const res1 = this.validateSettleDomainForm(isSubmit)
        isSubmit = res1.isSubmit
        settleDomainForSaveVo.settleDomain = res1.settleDomain

        const res2 = this.validateApprovalFormTickectForm(isSubmit,this.model.approvalFormTickect)
        isSubmit = res2.isSubmit
        settleDomainForSaveVo.approvalFormTickect = res2.approvalFormTickect

        const res3 = this.validateDepartSettlementInfoForm(isSubmit,this.model.departSettlementInfo)
        isSubmit = res3.isSubmit
        settleDomainForSaveVo.departSettlementInfo = res3.departSettlementInfo

        const res4 = this.validateDockingPeopleForm(isSubmit,this.model.buyWelfare)
        isSubmit = res4.isSubmit
        settleDomainForSaveVo.buyWelfare = res4.buyWelfare

        const res5 = this.validateTableHeaderCoverForm(isSubmit,this.model.tableHeadSalaryCover)
        isSubmit = res5.isSubmit
        settleDomainForSaveVo.tableHeadSalaryCover = res5.tableHeadSalaryCover

        const res6 = this.validateDepartBusinessRisksSettlementForm(isSubmit,this.model.businessRisksSettlement)
        isSubmit = res6.isSubmit
        settleDomainForSaveVo.businessRisksSettlement = res6.businessRisksSettlement

        const res7 = this.validateDepartAppointInfoForm(isSubmit,this.model.appointInfo)
        isSubmit = res7.isSubmit
        settleDomainForSaveVo.appointInfo = res7.appointInfo

        if(isSubmit.flag) {
          this.confirmLoading = true
          let httpurl = ''
          httpurl += this.url.edit
          //修改后重置为待提交
          settleDomainForSaveVo.settleDomain.dpAuditFlag = 3
          httpAction(httpurl,settleDomainForSaveVo,'put').then((res) => {
            if(res.code == 200){
              this.$message.success('修改成功!')
              this.$emit('ok')
            }else{
              this.$message.warning(res.msg)
            }
          }).finally(() => {
            this.confirmLoading = false
            this.handleCancel()
          })

        }else{
          this.activeKey = String(this.getNotEmpty(isSubmit.index))
          this.callback(this.activeKey)
          return false
        }

      },
      getNotEmpty(arr){
        return arr.find( function( val ){
          if(val && val > 0){
            return val
          }
          }
        )
      },
      close () {
        this.$emit('close')
        this.departBusinessRisksDisabled = this.riskManagementFeeDisabled = this.riskManagementTaxDisabled = true
        this.managementFeeDisabled = this.riskFundFeeDisabled = true

        this.departBusinessRisksSettlementRules.riskManagementFee.rules = this.departBusinessRisksSettlementRules.riskManagementTax.rules = []
        this.departBusinessRisksSettlementRules.riskManagementTaxTag.rules = this.departSettlementInfoRules.riskFundTaxTag.rules = []
        this.departSettlementInfoRules.riskFundType.rules = this.departSettlementInfoRules.riskFundFee.rules = this.departSettlementInfoRules.riskServerItem.rules = []
      },

      handleCancel(){
        this.visible = false
        this.activeKey = "1"
        this.model = {}
        this.resList = []
        this.close()
      },
      initDictConfig() {
        initDictOptions('server_items').then((res) => {
          if (res.code === 200) {
            this.serverItemDicts = res.data;
          }
        });
        initDictOptions('MANAGE_SERVER_ITEM').then((res) => {
          if (res.code === 200) {
            this.manageServerItemsDicts = res.data;
          }
        });
        initDictOptions('RISK_SERVER_ITEM').then((res) => {
          if (res.code === 200) {
            this.riskServerItemsDicts = res.data;
          }
        });
        initDictOptions('Tax_Type').then((res) => {
          if (res.code === 200) {
            this.taxTypeDicts = res.data;
          }
        });
        initDictOptions('insuranceType').then((res) => {
          if (res.code === 200) {
            this.insuranceTypeDicts = res.data;
          }
        });
      }

    }

  }
  </script>
  
<style lang="less" scoped>
.stepFormText {
  margin-bottom: 20px;
  :global(.ant-form-item-label) {
    width: 150px;
  }
}
</style>