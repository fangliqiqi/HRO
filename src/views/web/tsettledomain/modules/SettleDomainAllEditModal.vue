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
    cancelText="关闭"
  >
    <a-alert
      type="error"
      v-if="settleDomain.dpAuditFlag == 1"
      :message="'审核不通过：'+settleDomain.dpAuditOpinion"
      banner
    />

    <a-tabs
      defaultActiveKey="1"
      v-model="activeKey"
      @change="callback"
    >
      <a-tab-pane
        key="1"
      >
        <span slot="tab">
          结算信息
          <a-icon type="close" v-if="errorStatus.settleDomainForm" style="color:#f5222d"/>
        </span>
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
                  <!-- <a-select
                    showSearch
                    placeholder="请选择所属客户"
                    optionFilterProp="children"
                    style="width: 270px"
                    :disabled="true"
                    v-decorator="['customerId', validatorRules.customerId ]"
                  >
                    <a-select-option
                      v-for="(item, index) in customers"
                      :key="index"
                      :value="item.customerId"
                    >{{ item.customerName }}</a-select-option>
                  </a-select> -->
                  <a-select
                    showSearch
                    placeholder="请选择所属客户"
                    optionFilterProp="children"
                    style="width: 270px"
                    @search="searchCustomer"
                    @select="selectCustomer"
                    :dropdownMatchSelectWidth="false"
                    :notFoundContent="null"
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
                  <!-- <a-select
                    showSearch
                    placeholder="请选择合同主体"
                    optionFilterProp="children"
                    style="width: 270px"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['belongContract', validatorRules.belongContract ]"
                    @change="belongContractChange"
                    @search="handleSearch"
                  >
                    <a-select-option
                      v-for="(item, index) in customerContracts"
                      :key="index"
                      :value="item.CONTRACT_ID"
                    >{{ item.CONTRACT_NAME }}</a-select-option>
                  </a-select> -->
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
                    @change="getIncomeBelongSub"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['incomeBelong', validatorRules.incomeBelong ]"
                  >
                    <a-select-option
                      v-for="(item, index) in organs"
                      :key="index"
                      :value="item.id"
                    >{{ item.description }}</a-select-option>
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
                    v-decorator="['incomeBelongSub']"
                  >
                    <a-select-option
                      v-for="(item, index) in departs"
                      :key="index"
                      :value="item.id"
                    >{{ item.ORGAN_NAME }}</a-select-option>
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
                    :dropdownMatchSelectWidth="false"
                    style="width: 100px"
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
                    style="width: 100px"
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
        key="9"
        :forceRender="true"
      >
        <span slot="tab">
          结算配置
          <a-icon type="close" v-if="errorStatus.departSettlementInfoForm" style="color:#f5222d"/>
        </span>
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
                    placeholder="管理费费率/金额"
                    style="width: 180px;"
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
                    <a-select-option
                      v-for="(item,index) in taxFeeDicts"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</a-select-option>
                  </a-select>-->

                  <a-input
                    placeholder="缴税税率"
                    style="width: 180px;"
                    addonAfter="%"
                    v-decorator="['taxFee', departSettlementInfoRules.taxFee ]"
                  />
                  <!--<a-input placeholder="缴税税率" style="width: 180px;" addonAfter="%" v-decorator="['taxFee', {} ]"/>-->
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
        key="2"
      >
        <span slot="tab">
          福利购买信息
          <a-icon type="close" v-if="errorStatus.dockingPeopleForm" style="color:#f5222d"/>
        </span>
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
                    v-decorator="['otherWelfare', {} ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>
      <a-tab-pane
        key="3"
      >
        <span slot="tab">
          封面抬头
          <a-icon type="close" v-if="errorStatus.tableHeaderCoverForm" style="color:#f5222d"/>
        </span>
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="tableHeaderCoverForm"
            layout="inline"
            class="ant-advanced-search-form"
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
        </a-spin>
      </a-tab-pane>

      <!-- <a-tab-pane
        tab="开票信息"
        key="4"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="ticketConfigForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="抬头名称"
                >
                  <a-input
                    placeholder="请输入抬头名称"
                    v-decorator="['ticketTableHead', validatorTicketConfigRules.ticketTableHead ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="纳税人识别号"
                >
                  <a-input
                    placeholder="请输入纳税人识别号"
                    v-decorator="['taxpayerIdentificationNo', validatorTicketConfigRules.taxpayerIdentificationNo ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="地址"
                >
                  <a-input
                    placeholder="请输入地址"
                    v-decorator="['addr',validatorTicketConfigRules.addr]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="电话"
                >
                  <a-input
                    placeholder="请输入电话"
                    v-decorator="['phone', validatorTicketConfigRules.phone ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="开户行"
                >
                  <a-input
                    placeholder="请输入开户行"
                    v-decorator="['bankName', validatorTicketConfigRules.bankName]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="银行卡号"
                >
                  <a-input
                    placeholder="请输入银行卡号"
                    v-decorator="['bankNo', validatorTicketConfigRules.bankNo ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane> -->

      <a-tab-pane
        key="5"
      >
        <span slot="tab">
          核准表开票
          <a-icon type="close" v-if="errorStatus.approvalFormTickectForm" style="color:#f5222d"/>
        </span>
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

      <!-- <a-tab-pane
        tab="工程结算配置"
        key="6"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="departEngineeringSettlementForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  label="企业所得税"
                  class="stepFormText"
                >
                  <a-input
                    placeholder="请输入企业所得税"
                    @keypress="numberOnly"
                    v-decorator="['businessTax', departEngineeringSettlementRules.businessTax ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="个人所得税"
                  class="stepFormText"
                >
                  <a-input
                    placeholder="请输入个人所得税"
                    @keypress="numberOnly"
                    v-decorator="['personalTax', departEngineeringSettlementRules.personalTax ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  label="统谈比率"
                  class="stepFormText"
                >
                  <a-input
                    placeholder="请输入统谈比率"
                    @keypress="numberOnly"
                    v-decorator="['nagotiationsTax', {} ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="增值税金及附加"
                  class="stepFormText"
                >
                  <a-input
                    placeholder="增值税金及附加"
                    @keypress="numberOnly"
                    v-decorator="['addedValueTaxAddition', {} ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  label="管理费率"
                  class="stepFormText"
                >
                  <a-input
                    placeholder="请输入管理费率"
                    @keypress="numberOnly"
                    v-decorator="['managementTax', departEngineeringSettlementRules.managementTax ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="合计比例"
                  class="stepFormText"
                >
                  <a-input
                    placeholder="请输入合计比例"
                    @keypress="numberOnly"
                    v-decorator="['sumTax', {} ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane> -->

      <a-tab-pane
        key="7"
      >
        <span slot="tab">
          商险结算配置
          <a-icon type="close" v-if="errorStatus.departBusinessRisksSettlementForm" style="color:#f5222d"/>
        </span>
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
                  <!-- <span
                    slot="label"
                    class="slotLabel"
                  >缴税税率</span>
                  <a-select
                    placeholder="缴税税率"
                    optionFilterProp="children"
                    style="width: 180px;"
                    v-decorator="['taxValue',departBusinessRisksSettlementRules.taxValue ]"
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
                    v-decorator="['taxFee', {} ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        key="8"
      >
        <span slot="tab">
          客户约定配置
          <a-icon type="close" v-if="errorStatus.departAppointInfoForm" style="color:#f5222d"/>
        </span>
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
                  label="工资发放时间"
                >
                  <a-input
                    placeholder="工资发放时间"
                    style="width:213px"
                    v-decorator="['salaryType', departAppointInfoSettlementRules.salaryType ]"
                  />
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
                  label="皖信出账时间"
                >
                  <a-input
                    placeholder="皖信出账时间"
                    addonBefore="每月"
                    style="width:213px"
                    addonAfter="号"
                    v-decorator="['wxOutAccountsTime', departAppointInfoSettlementRules.wxOutAccountsTime ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="客户确认时间"
                >
                  <a-input
                    placeholder="客户确认时间"
                    addonBefore="每月"
                    style="width:213px"
                    addonAfter="号"
                    v-decorator="['customerSuerTime', departAppointInfoSettlementRules.customerSuerTime ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="皖信出票时间"
                >
                  <a-input
                    placeholder="皖信出票时间"
                    addonBefore="每月"
                    style="width:213px"
                    addonAfter="号"
                    v-decorator="['wxTicketTime', departAppointInfoSettlementRules.wxTicketTime ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="客户到账时间"
                >
                  <a-input
                    placeholder="客户到账时间"
                    addonBefore="每月"
                    style="width:213px"
                    addonAfter="号"
                    v-decorator="['customerGetfeeTime', departAppointInfoSettlementRules.customerGetfeeTime ]"
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
                    format="YYYY-MM-DD"
                    placeholder="合同约定到款时间"
                    style="width: 180px; text-align: center"
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
  import { httpAction,getAction } from '@/api/manage'
  import JEditableTable from '@/components/jeecg/JEditableTable'
  import pick from 'lodash.pick'
  import moment from 'moment';
  import {initDictOptions} from '@/components/dict/JDictSelectUtil'
  import Table from 'ant-design-vue/es/table/Table'
  import ACol from 'ant-design-vue/es/grid/Col'
  import { allPrpos,clearUnde } from '@/utils/beanUtils'
  import { FormTypes,getRefPromise } from '@/utils/JEditableTableUtil'

  export default {
    name: "SettleDomainAllEditModal",
    components: { 
      ACol, 
      Table,
      JEditableTable,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
    data () {
      return {
        title:"操作",
        visible: false,
        activeKey: '1',
        //实体
        model: {},
        settleDomain: {},
        appointInfo: {},
        departSettlementInfo: {},
        businessRisksSettlement: {},
        engineeringSettlement: {},
        buyWelfare: {},
        ticketConfig: {},
        approvalFormTickect: {},
        tableHeadSalaryCover: [],
        errorStatus:{
          settleDomainForm:false,
          departSettlementInfoForm:false,
          dockingPeopleForm:false,
          tableHeaderCoverForm:false,
          approvalFormTickectForm:false,
          departBusinessRisksSettlementForm:false,
          departAppointInfoForm:false,
        },
        organs: [],
        customerContracts: [],
        customers: [],
        serverItemDicts: [],
        manageServerItemsDicts: [],
        riskServerItemsDicts: [],
        serverItems: "",
        manageServerItems: "",
        riskServerItems: "",
        departs: [],
        coverLength: [0],
        iconTypeJian: 'minus-circle-o',
        iconTypeJia: 'plus-circle',
        areaTrees:[], //省市区
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
        managementFeeAddon: "",
        riskFundFeeAddon: "",
        departBusinessRisksDisabled: true,
        riskManagementFeeDisabled: true,
        riskManagementTaxDisabled: true,
        departBusinessRisksFundFeeDisabled: true,
        riskFundTaxDisabled: true,
        riskManagementTaxTagDisabled: true,
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
              placeholder: '请输入${title}',
              validateRules: [{ required: true, message: '${title}不能为空' }]
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
              placeholder: '请选择${title}',
              validateRules: [{ required: true, message: '${title}不能为空' }]
            }
          ]
        },

        stotal:10,
        searchCustomerKey:'',
        isContract:true,
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

        validatorRules:{
          //结算主体数据校验
          departNo:{rules: [{ required: true, message: '请输入结算主体编码!' }]},
          departName:{rules: [{ required: true, message: '请输入结算主体名称!' },{max:32,message:'结算主体名称最多32个字符!'}]},
          isNew:{rules: [{ required: true, message: '请输入是否是新业务!' }]},
          newRemark:{rules: [{ required: true, message: '请输入新业务备注!' }]},
          createUser:{rules: [{ required: true, message: '请输入创建人!' }]},
          deleteFlag:{rules: [{ required: true, message: '请输入是否删除!' }]},
          dpAuditFlag:{rules: [{ required: true, message: '请输入服务审核标识' }]},
          belongContract:{rules: [{ required: true, message: '请输入合同主体!' }]},
          serverItem:{rules: [{ required: true, message: '请输入服务项目!' }]},
          incomeBelong:{rules: [{ required: true, message: '请输入收入归属!' }]},
          customerId:{rules: [{ required: true, message: '请输入所属客户!' }]},
          province: { rules: [{ required: true, message: '省份不能为空!' }] },
          city: { rules: [{ required: true, message: '城市不能为空!' }] },
        },
        validatorDockingPeopleRules: {
          // 福利购买信息数据校验
          welfareAddr:{rules: [{ required: true, message: '请输入福利购买地!' }]},
          insuranceType:{rules: [{ required: true, message: '请选择保险类型!' }]},
          otherWelfare:{rules: [{ max: 12, message: '其他福利最多32个字符!' }]},
        },
        validatorTableHeaderPeopleRules: {
          // 封面抬头校验
          coverName:{rules: [{ required: true, message: '请输入抬头名称!' },{max:32,message:'抬头名称最多32个字符!'}]},
          type:{rules: [{ required: true, message: '请选择抬头类型!' }]},
        },
        validatorTicketConfigRules: {
          // 发票抬头校验
          ticketTableHead:{rules: [{ required: true, message: '请输入抬头名称!' },{max: 32,message:'抬头名称最多32个字符!'}]},
          taxpayerIdentificationNo:{rules: [{ required: true, message: '请输入纳税人识别号!' }]},
          bankName:{rules: [{max:32,message:'开户行最多32个字符!'}]},
          bankNo:{rules: [{max:25,message:'银行卡号不能超过25位！'}]},
          phone:{rules: [{ pattern:/^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/, message: '电话格式不正确!' }]},
        },
        approvalFormTickectRules: {
          // 核准表开票信息配置校验
          customerTicketName:{rules: [{ required: true, message: '请输入客户开票名称!' },{max:32,message:'客户开票名称最多32个字符!'}]},
          selfTomoneyUnitName:{rules: [{ required: true, message: '请输入我司到款单位名称!' },{max:32,message:'我司到款单位名称最多32个字符!'}]},
        },
        departSettlementInfoRules: {
          socialCardTaker:{rules: [{ required: true, message: '社保卡是否收取不能为空!' }]},
          unitSeriousIllnessProp:{rules:[
            {pattern:/^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|100|0)$/,message:'单位大病比例格式不正确!'},
            { required: true, message: '单位大病比例不能为空!' }
          ]},
          managementTag:{rules: [{ required: true, message: '管理费是否收费不能为空!' }]},
          riskFundTag:{rules: [{ required: true, message: '风险金是否收费不能为空!' }]},
          managementType: {rules: []},
          managementFee: {rules: []},
          riskFundType: {rules: []},
          riskFundFee: {rules: []},
          riskFundTaxTag: {rules: []},
          managementTaxTag: {rules: []},
          manageServerItem: {rules: []},
          riskServerItem: {rules: []},
          taxFee: {rules: [{ required: true, message: '缴税税率不能为空!' },{validator:this.validateTaxFee}]},
          taxType: {rules: [{ required: true, message: '缴税类型不能为空!' }]},
          managementExpFlag:{rules: [{ required: true, message: '管理费扣税不能为空!' }]}
        },
        departEngineeringSettlementRules: {
          managementTax:{rules: [{ required: true, message: '请输入管理费率!' }]},
          personalTax:{rules: [{ required: true, message: '请输入个人所得税!' }]},
          businessTax:{rules: [{ required: true, message: '请输入企业所得税!' }]},
        },
        departBusinessRisksSettlementRules: {
          managementTag:{rules: [{ required: true, message: '管理费是否收费不能为空!' }]},
          taxType:{rules: [{ required: true, message: '缴税类型不能为空!' }]},
          taxValue:{rules: [
            { required: true, message: '缴税税率不能为空!' },
            {pattern:/^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|100|0)$/,message:'缴税税率格式不正确!'},
          ]},
          riskManagementType:{rules:[]},
          riskManagementFee:{rules:[]},
          riskManagementTax:{rules:[]},
          riskManagementTaxTag:{ rules:[{required: true, message: '请选择管理费税收是否含税！'}] }
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
        url: {
          add: "/hrBase/tsettledomain/vo",
          edit: "/hrBase/tsettledomain/vo",
          getCustomerContract: "/hrBase/tcustomercontract/",
          getIncomeBelongSub: "/admin/organizationinfo/getDepartByUnitId",
          batchDeleteCover: '/hrBase/ttableheadsalarycover/batch',
          getContract:'/hrBase/tcustomercontract/getOwnContract?type=0&name=',
          getCustomerList:'/hrBase/tcustomerinfo/page?selectType=0&customerName=',
          getCustomerContractList:'/hrBase/tcustomercontract/page?selectType=0&customerId='
        },
      }
    },
    created () {
      this.initDictConfig();
    },
    methods: {
      moment,
      add () {
        this.edit({});
      },
      edit (record) {
        this.activeKey = "1";
        this.visible = true;
        this.settleDomain = Object.assign({}, record.settleDomain)
        this.appointInfo = Object.assign({}, record.appointInfo)
        this.departSettlementInfo = record.departSettlementInfo
        this.businessRisksSettlement = Object.assign({}, record.businessRisksSettlement)
        this.engineeringSettlement = Object.assign({}, record.engineeringSettlement)
        this.buyWelfare = Object.assign({}, record.buyWelfare)
        this.ticketConfig = Object.assign({}, record.ticketConfig)
        this.approvalFormTickect = Object.assign({}, record.approvalFormTickect)
        this.tableHeadSalaryCover = record.tableHeadSalaryCover || '';
        this.settleDomainForm.resetFields();
        this.dockingPeopleForm.resetFields();
        this.tableHeaderCoverForm.resetFields();
        this.ticketConfigForm.resetFields();
        this.approvalFormTickectForm.resetFields();
        // this.departEngineeringSettlementForm.resetFields();
        this.departBusinessRisksSettlementForm.resetFields();
        this.departAppointInfoForm.resetFields();
        this.departSettlementInfoForm.resetFields();
        for(var p of this.areaTrees) {
          if(p.id == this.settleDomain.province) {
            this.areaCitys = p.children;
            for(var c of this.areaCitys) {
              if(c.id == this.settleDomain.city) {
                this.areaTowns = c.children;
              }
            }
          }
        }
        // 所属客户选中
        this.getCustomerList('/hrBase/tcustomerinfo/page?selectType=0&id='+this.settleDomain.customerId)
        this.selectCustomerDefault(this.settleDomain.customerId,this.settleDomain.belongContract)
        this.$nextTick(() => {
          // this.belongContractChange(this.settleDomain.belongContract);
          this.getIncomeBelongSub(this.settleDomain.incomeBelong);
          this.settleDomain.incomeBelong = Number(this.settleDomain.incomeBelong)

          this.settleDomain.incomeBelongSub = Number(this.settleDomain.incomeBelongSub)
          if(this.settleDomain.serverItem != null && this.settleDomain.serverItem.indexOf(",") >= 0) {
            this.settleDomain.serverItem = this.settleDomain.serverItem.split(",");
          }
          this.settleDomainForm.setFieldsValue(pick(this.settleDomain,'departName','belongContract','serverItem','incomeBelong','incomeBelongSub','customerId','province','city','town'))
        });
        this.$nextTick(() => {
          if(this.departSettlementInfo) {
            this.departSettlementInfo.taxType = Number(this.departSettlementInfo.taxType) || '';

            if(this.departSettlementInfo.manageServerItem != null) {
              if(this.departSettlementInfo.manageServerItem.indexOf(",") >= 0) {
                this.departSettlementInfo.manageServerItem = this.departSettlementInfo.manageServerItem.split(",");
              } else {
                let arr = [];
                arr.push(this.departSettlementInfo.manageServerItem)
                this.departSettlementInfo.manageServerItem = arr;
              }
            } else {
              this.departSettlementInfo.manageServerItem = [];
            }

            if(this.departSettlementInfo.riskServerItem != null) {
              if(this.departSettlementInfo.riskServerItem.indexOf(",") >= 0) {
                this.departSettlementInfo.riskServerItem = this.departSettlementInfo.riskServerItem.split(",");
              } else {
                let arr = [];
                arr.push(this.departSettlementInfo.riskServerItem)
                this.departSettlementInfo.riskServerItem = arr;
              }
            } else {
              this.departSettlementInfo.riskServerItem = [];
            }
            this.$nextTick(() => {
              this.departSettlementInfoForm.setFieldsValue(pick(this.departSettlementInfo,'socialCardTaker','managementTag','managementType'
                ,'managementFee','riskFundTag','riskFundType','riskFundFee','unitSeriousIllnessProp'
                ,'taxFee','taxType','manageServerItem','riskServerItem','managementTaxTag','riskFundTaxTag','managementExpFlag'))
            })
            this.managementTagChange(this.departSettlementInfo.managementTag);
            this.riskFundTagChange(this.departSettlementInfo.riskFundTag);
          } else {
            this.departSettlementInfo = {}
          }
        });
      },
      getCustomerList(url){
        httpAction(url,null,'get').then((res)=>{
          if(res.code == 200 && res.data.total){
            this.customers = res.data.records
            this.stotal = res.data.total
          }
        })
      },
      changePage(page){
        this.getCustomerList(this.url.getCustomerList+this.searchCustomerKey+'&current='+page)
      },
      searchCustomer(val){
        this.searchCustomerKey = val
        this.getCustomerList(this.url.getCustomerList+this.searchCustomerKey)
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
            this.isContract=false
          }else{
            this.customerContracts = []
            this.isContract=true
            this.$message.warning('该客户暂无合同信息');
          }
        })
      },
      selectCustomer(value){
        this.settleDomainForm.setFieldsValue(pick({belongContract:undefined},'belongContract'))
        httpAction(this.url.getCustomerContractList+value,null,'get').then((res)=>{
          if(res.code == 200 && res.data.total){
            this.customerContracts = res.data.records
            this.isContract=false
          }else{
            this.customerContracts = []
            this.isContract=true
            this.$message.warning('该客户暂无合同信息');
          }
        })
      },
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
      close () {
        this.$emit('close')
        this.departBusinessRisksDisabled = this.riskManagementFeeDisabled = this.riskManagementTaxDisabled = true
        this.managementFeeDisabled = this.riskFundFeeDisabled = true

        this.departBusinessRisksSettlementRules.riskManagementFee.rules = this.departBusinessRisksSettlementRules.riskManagementTax.rules = []
        this.departBusinessRisksSettlementRules.riskManagementTaxTag.rules = this.departSettlementInfoRules.riskFundTaxTag.rules = []
        this.departSettlementInfoRules.riskFundType.rules = this.departSettlementInfoRules.riskFundFee.rules = this.departSettlementInfoRules.riskServerItem.rules = []
        this.visible = false;
      },
      handleOk () {
        // eslint-disable-next-line no-unused-vars
        const that = this;
        const settleDomainForSaveVo = {};
        let isSubmit = true;
        this.settleDomainForm.validateFields((err, values) => {
          if (!err) {
            let formData = Object.assign(this.settleDomain, values);

            if(that.serverItems != null && that.serverItems != "") {
              formData.serverItem = that.serverItems;
            }
            if(formData.serverItem instanceof Array && formData.serverItem.length > 0) {
              let str = "";
              for(let i = 0; i < formData.serverItem.length; i++) {
                if(i == formData.serverItem.length - 1) {
                  str += formData.serverItem[i];
                } else {
                  str += formData.serverItem[i] + ",";
                }
              }
              formData.serverItem = str;
            }
            formData.town = (values.town) ? values.town : null
            delete formData.customerName;
            delete formData.businessSubject;
            delete formData.businessSubjectName;

            settleDomainForSaveVo.settleDomain = formData;
          }
        });
        
        this.departSettlementInfoForm.validateFields((err, values) => {
          if(err) {
            isSubmit = false;
            this.activeKey = "9"
          }
          if (!err && Object.keys(values).length > 0) {
            let formData = Object.assign(this.departSettlementInfo, values);
            let isNullObject = allPrpos(formData);
            if(isNullObject) {
              if(that.manageServerItems != null && that.manageServerItems != "") {
                formData.manageServerItem = that.manageServerItems;
              }
              if(that.riskServerItems != null && that.riskServerItems != "") {
                formData.riskServerItem = that.riskServerItems;
              }
              if(formData.manageServerItem instanceof Array && formData.manageServerItem.length > 0) {
                let str = "";
                for(let i = 0; i < formData.manageServerItem.length; i++) {
                  if(i == formData.manageServerItem.length - 1) {
                    str += formData.manageServerItem[i];
                  } else {
                    str += formData.manageServerItem[i] + ",";
                  }
                }
                formData.manageServerItem = str;
              } else if(!formData.manageServerItem || formData.manageServerItem.length == 0) {
                formData.manageServerItem = null;
              }
              if(formData.riskServerItem instanceof Array && formData.riskServerItem.length > 0) {
                let str = "";
                for(let i = 0; i < formData.riskServerItem.length; i++) {
                  if(i == formData.riskServerItem.length - 1) {
                    str += formData.riskServerItem[i];
                  } else {
                    str += formData.riskServerItem[i] + ",";
                  }
                }
                formData.riskServerItem = str;
              } else if(!formData.riskServerItem || formData.riskServerItem.length == 0) {
                formData.riskServerItem = null;
              }
              settleDomainForSaveVo.departSettlementInfo = clearUnde(formData);
            }
          }
        });
        this.dockingPeopleForm.validateFields((err, values) => {
          if(err) {
            isSubmit = false;
            this.activeKey = "2"
          }
          if (!err && Object.keys(values).length > 0) {
            let formData = Object.assign(this.buyWelfare, values);
            let isNullObject = allPrpos(formData);
            if(isNullObject) {
              settleDomainForSaveVo.buyWelfare = formData;
            }
          }
        });
        // eslint-disable-next-line no-unused-vars
        this.tableHeaderCoverForm.validateFields((err, vs) => {
          if(that.$refs.editableTable1){
            that.$refs.editableTable1.getValues((error,values)=>{
              if(error == 0){
                let arr = values.map(item=>{
                  let items = {}
                  items.type = item.type
                  items.coverName = item.coverName
                  return items
                })
                settleDomainForSaveVo.tableHeadSalaryCover = arr
              }else{
                isSubmit = false
                this.activeKey = "3"
              }
            },true)
          }
        });
        this.ticketConfigForm.validateFields((err, values) => {
          if(err) {
            isSubmit = false;
            this.activeKey = "3"
          }
          if (!err && Object.keys(values).length > 0) {
            let formData = Object.assign(this.ticketConfig, values);
            let isNullObject = allPrpos(formData);
            if(isNullObject) {
              settleDomainForSaveVo.ticketConfig = formData;
            }
          }
        });
        this.approvalFormTickectForm.validateFields((err, values) => {
          if(err) {
            isSubmit = false;
            this.activeKey = "5"
          }
          if (!err && Object.keys(values).length > 0) {
            let formData = Object.assign(this.approvalFormTickect, values);
            let isNullObject = allPrpos(formData);
            if(isNullObject) {
              settleDomainForSaveVo.approvalFormTickect = formData;
            }
          }
        });
        // this.departEngineeringSettlementForm.validateFields((err, values) => {
        //   if(err) {
        //     isSubmit = false;
        //   }
        //   if (!err && Object.keys(values).length > 0) {
        //     let formData = Object.assign(this.engineeringSettlement, values);
        //     let isNullObject = allPrpos(formData);
        //     if(isNullObject) {
        //       settleDomainForSaveVo.engineeringSettlement = formData;
        //     }
        //   }
        // });
        this.departBusinessRisksSettlementForm.validateFields((err, values) => {
          if(err) {
            isSubmit = false;
            this.activeKey = "7"
          }
          if (!err && Object.keys(values).length > 0) {
            let formData = Object.assign(this.businessRisksSettlement, values);
            let isNullObject = allPrpos(formData);
            if(isNullObject) {
              settleDomainForSaveVo.businessRisksSettlement = clearUnde(formData);
            }
          }
        });

        this.departAppointInfoForm.validateFields((err, values) => {
          if(err) {
            isSubmit = false;
            this.activeKey = "8"
          }
          if (!err && Object.keys(values).length > 0) {
            let formData = Object.assign(this.appointInfo, values);
            formData.firstSettlementTime = formData.firstSettlementTime ? formData.firstSettlementTime.format('YYYY-MM-DD') : null
            formData.contractAppointGetfeeTime = formData.contractAppointGetfeeTime ? formData.contractAppointGetfeeTime.format('YYYY-MM-DD') : null
            let isNullObject = allPrpos(formData);
            if(isNullObject) {
              settleDomainForSaveVo.appointInfo = formData;
              isSubmit = true;
            }
          }
        });
        if(isSubmit) {
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          let msg = '';
          if(!this.settleDomain.id){
            httpurl += this.url.add;
            method = 'post';
            msg = '添加成功!';
          }else{
            httpurl += this.url.edit;
            //修改后重置为待提交
            settleDomainForSaveVo.settleDomain.dpAuditFlag = 3;
            method = 'put';
            msg = '修改成功!';
          }

          httpAction(httpurl,settleDomainForSaveVo,method).then((res) => {
            if(res.code == 200){
              that.$message.success(msg);
              that.$emit('ok');
            }else{
              that.$message.warning(res.msg);
            }
          }).finally(() => {
            that.confirmLoading = false;
            that.close();
          })
        }
      },
      classifyIntoFormData(allValues) {
        let orderMain = Object.assign(this.model, allValues.formValue)
        return {
          ...orderMain, // 展开
          tableHeaderCoverList: allValues.tablesValue[0].values,
        }
      },
      handleCancel () {
        this.close()
      },
      belongContractChange(t) {
        this.customers = [];
        httpAction(this.url.getCustomerContract + t, null, 'GET').then((res) => {
          if(res.code == 200 && res.data != null) {
            this.customers.push(res.data);
            this.model.customerId = res.data.customerId;

            this.$nextTick(() => {
              this.settleDomainForm.setFieldsValue(pick(this.model,'customerId'))
            });
          }
        });
      },
      handleSearch(value){
        httpAction(this.url.getContract+value,null,'get').then((res)=>{
          if(res.code == 200){
            this.customerContracts = res.data
          }
        })
      },
      /**
       * 加载数据字典
       */
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
        initDictOptions('Tax_FEE').then((res) => {
          if (res.code === 200) {
            this.taxFeeDicts = res.data;
          }
        });
        initDictOptions('insuranceType').then((res) => {
          if (res.code === 200) {
            this.insuranceTypeDicts = res.data;
          }
        });
        initDictOptions('headCoverType').then((res) => {
          if (res.code === 200) {
            this.headCoverTypeDicts = res.data;
          }
        });
      },
      serverItemChange(value) {
        this.serverItems = "";
        if(value != null && value.length > 0) {
          for(let i = 0; i < value.length; i++) {
            if(i == value.length - 1) {
              this.serverItems += value[i];
            } else {
              this.serverItems += value[i] + ",";
            }
          }
        }
      },
      manageServerItemChange(value) {
        this.manageServerItems = "";
        if(value != null && value.length > 0) {
          for(let i = 0; i < value.length; i++) {
            if(i == value.length - 1) {
              this.manageServerItems += value[i];
            } else {
              this.manageServerItems += value[i] + ",";
            }
          }
        }
      },
      riskServerItemChange(value) {
        this.riskServerItems = "";
        if(value != null && value.length > 0) {
          for(let i = 0; i < value.length; i++) {
            if(i == value.length - 1) {
              this.riskServerItems += value[i];
            } else {
              this.riskServerItems += value[i] + ",";
            }
          }
        }
      },
      getIncomeBelongSub(value,option) {
        this.departs = [];
        if(value === undefined) {
          this.settleDomainForm.setFieldsValue(pick({incomeBelongSub:undefined},'incomeBelongSub'))
        }else{
          httpAction(this.url.getIncomeBelongSub + "?unitId=" + value, null, "GET").then((res) => {
            if(res.code == 200 && res.data) {
              this.departs = res.data;
              if(option){
                this.settleDomainForm.setFieldsValue(pick({incomeBelongSub:undefined},'incomeBelongSub'))
              }else{
                let incomeBelongSub = (this.settleDomain.incomeBelongSub) ? this.settleDomain.incomeBelongSub * 1 : undefined
                this.settleDomainForm.setFieldsValue(pick({incomeBelongSub:incomeBelongSub},'incomeBelongSub'))
              }
            }
          })
        }

        // if(value === undefined) {
        //   let obj = {};
        //   obj.id = 0;
        //   obj.ORGAN_NAME = "请选择";

        //   this.departs.push(obj)
        // } else {
        //   httpAction(this.url.getIncomeBelongSub + "?unitId=" + value, null, "GET").then((res) => {
        //     if(res.code == 200 && res.data) {
        //       this.departs = res.data;
        //     }
        //   }).finally(()=>{
        //     let obj = {};
        //     obj.id = 0;
        //     obj.ORGAN_NAME = "请选择";
        //     this.departs.unshift(obj)
        //     if(option) this.settleDomainForm.setFieldsValue(pick({incomeBelongSub:this.departs[0].id},'incomeBelongSub'))
        //   })
        // }
      },
      // eslint-disable-next-line no-unused-vars
      callback(key) {
        if(key == 2) {
          this.$nextTick(() => {
            if(this.buyWelfare.insuranceType) {
              this.buyWelfare.insuranceType = Number(this.buyWelfare.insuranceType);
            }
            this.dockingPeopleForm.setFieldsValue(pick(this.buyWelfare,'welfareAddr','insuranceType','otherWelfare'))
          });
        } else if(key == 9) {
          if(this.departSettlementInfo){
            this.managementFeeAddon = (this.departSettlementInfo.managementType == 1) ? '%' : ''
            this.riskFundFeeAddon = (this.departSettlementInfo.riskFundType == 1 && this.departSettlementInfo.riskFundTag == 0) ? '%' : ''

            this.$nextTick(() => {
              this.departSettlementInfo.managementTaxTag = (this.departSettlementInfoForm.getFieldValue('managementTaxTag') != undefined) ? this.departSettlementInfoForm.getFieldValue('managementTaxTag') : this.departSettlementInfo.managementTaxTag
              this.departSettlementInfo.riskFundTaxTag = (this.departSettlementInfoForm.getFieldValue('riskFundTaxTag') != undefined) ? this.departSettlementInfoForm.getFieldValue('riskFundTaxTag') : this.departSettlementInfo.riskFundTaxTag
              this.departSettlementInfo.managementType = (this.departSettlementInfoForm.getFieldValue('managementType') != undefined) ? this.departSettlementInfoForm.getFieldValue('managementType') : this.departSettlementInfo.managementType

              this.managementTypeChange(this.departSettlementInfoForm.getFieldValue('managementType'))
              this.riskFundTypeChange(this.departSettlementInfoForm.getFieldValue('riskFundType'))
              if(this.departSettlementInfoForm.getFieldValue('managementTag') == 0){
                this.departSettlementInfoForm.setFieldsValue(pick(this.departSettlementInfo,'manageServerItem','managementTaxTag','riskFundTaxTag','managementType'))
              }
            });
          }
          /*this.$nextTick(() => {
            if(this.departSettlementInfo) {
              this.departSettlementInfo.taxType = Number(this.departSettlementInfo.taxType);

              if(this.departSettlementInfo.manageServerItem != null) {
                if(this.departSettlementInfo.manageServerItem.indexOf(",") >= 0) {
                  this.departSettlementInfo.manageServerItem = this.departSettlementInfo.manageServerItem.split(",");
                } else {
                  let arr = [];
                  arr.push(this.departSettlementInfo.manageServerItem)
                  this.departSettlementInfo.manageServerItem = arr;
                }
              } else {
                this.departSettlementInfo.manageServerItem = [];
              }

              if(this.departSettlementInfo.riskServerItem != null) {
                if(this.departSettlementInfo.riskServerItem.indexOf(",") >= 0) {
                  this.departSettlementInfo.riskServerItem = this.departSettlementInfo.riskServerItem.split(",");
                } else {
                  let arr = [];
                  arr.push(this.departSettlementInfo.riskServerItem)
                  this.departSettlementInfo.riskServerItem = arr;
                }
              } else {
                this.departSettlementInfo.riskServerItem = [];
              }
              this.departSettlementInfoForm.setFieldsValue(pick(this.departSettlementInfo,'socialCardTaker','managementTag','managementType'
                ,'managementFee','riskFundTag','riskFundType','riskFundFee','riskFundTaxTag','managementTaxTag','unitSeriousIllnessProp'
                ,'taxFee','taxType','manageServerItem','riskServerItem'))
              this.managementTagChange(this.departSettlementInfo.managementTag);
              this.riskFundTagChange(this.departSettlementInfo.riskFundTag);
              this.departBusinessRisksRiskFundTypeChange(this.departSettlementInfo.riskFundTag);
            } else {
              this.departSettlementInfo = {}
            }
          });*/
        } else if(key == 3) {
          this.$refs.editableTable1.url.batchDelete = this.url.batchDeleteCover;
          getRefPromise(this, 'editableTable').then(editableTable => {
            editableTable.resetScrollTop()
          })
          this.table1.dataSource = this.tableHeadSalaryCover;
        } else if(key == 4) {
          this.$nextTick(() => {
            this.ticketConfigForm.setFieldsValue(pick(this.ticketConfig,'ticketTableHead','taxpayerIdentificationNo','addr','phone','bankName','bankNo'));
          });
        } else if(key == 5) {
          this.$nextTick(() => {
            this.approvalFormTickectForm.setFieldsValue(pick(this.approvalFormTickect,'customerTicketName','selfTomoneyUnitName'));
          });
        } else if(key == 6) {
          // this.$nextTick(() => {
          //   this.departEngineeringSettlementForm.setFieldsValue(pick(this.engineeringSettlement,'businessTax','personalTax',
          //         'nagotiationsTax','addedValueTaxAddition','managementTax','sumTax'));
          // });
        } else if(key == 7) {

          if(this.businessRisksSettlement.managementTag != undefined) {
            this.businessRisksManagementTagChange(this.businessRisksSettlement.managementTag);
            this.riskManagementTypeChange(this.businessRisksSettlement.riskManagementType);
            this.$nextTick(() => {
              if(this.businessRisksSettlement.managementTag == 1){
                this.departBusinessRisksSettlementRules.riskManagementTax.rules = []
                this.riskManagementTaxDisabled = true
                this.departBusinessRisksSettlementForm.setFieldsValue(pick({riskManagementTaxTag:undefined},'riskManagementTaxTag'));
              }else{
                if(this.businessRisksSettlement.riskManagementType == 0){
                  this.departBusinessRisksSettlementForm.setFieldsValue(pick({riskManagementFee:this.businessRisksSettlement.riskManagementFee,riskManagementTax:''},'riskManagementFee','riskManagementTax'));
                }else{
                  this.departBusinessRisksSettlementForm.setFieldsValue(pick({riskManagementTax:this.businessRisksSettlement.riskManagementTax,riskManagementFee:''},'riskManagementTax','riskManagementFee'));
                }
                this.departBusinessRisksSettlementForm.setFieldsValue(pick({riskManagementType:this.businessRisksSettlement.riskManagementType,
                riskManagementTaxTag:this.businessRisksSettlement.riskManagementTaxTag},'riskManagementType','riskManagementTaxTag'));
              }
              this.departBusinessRisksSettlementForm.setFieldsValue(pick(this.businessRisksSettlement,'managementTag','taxType','taxValue'));
            })
          }else{
            this.departBusinessRisksSettlementRules.riskManagementTaxTag.rules = []
          }
        } else if(key == 8) {
          if(this.appointInfo){
            this.$nextTick(() => {
              this.appointInfo.firstSettlementTime = (this.appointInfo.firstSettlementTime) ? moment(this.appointInfo.firstSettlementTime, 'YYYY-MM-DD') : null
              this.appointInfo.contractAppointGetfeeTime = (this.appointInfo.contractAppointGetfeeTime) ? moment(this.appointInfo.contractAppointGetfeeTime, 'YYYY-MM-DD') : null
              this.departAppointInfoForm.setFieldsValue(pick(this.appointInfo,'socialSettlementType','fundSettlementType',
                'salaryType','customerGetformTime','wxOutAccountsTime','customerSuerTime','wxTicketTime','customerGetfeeTime','salaryGrantTime',
                'firstSettlementTime','contractAppointGetfeeTime'));
            });
          }
        }
      },
      addItem() {
        // 默认新增一条数据
        this.getAllTable().then(editableTables => {
          editableTables[0].add()
        })
      },
      managementTagChange(t) {
        if(t == 0) {
          this.managementFeeDisabled = false;
          this.departSettlementInfoRules.managementType.rules = [];
          this.departSettlementInfoRules.managementFee.rules = [];
          this.departSettlementInfoRules.managementTaxTag.rules = [];
          this.departSettlementInfoRules.manageServerItem.rules = [];
          this.departSettlementInfoRules.managementType.rules[0] = { required: true, message: '请选择管理费收费类型！' }
          this.departSettlementInfoRules.managementFee.rules[0] = { required: true, message: '管理费费率/金额不能为空！' }
          this.departSettlementInfoRules.managementTaxTag.rules[0] = { required: true, message: '请选择管理费税收类型！' }
          this.departSettlementInfoRules.manageServerItem.rules[0] = { required: true, message: '请选择管理费收取项目！' }
          this.departSettlementInfoRules.taxFee.rules = [{ required: true, message: '请输入缴税税率！' },{validator:this.validateTaxFee}]
        } else {
          this.managementFeeDisabled = true;
          this.departSettlementInfoRules.managementType.rules = [];
          this.departSettlementInfoRules.managementFee.rules = [];
          this.departSettlementInfoRules.managementTaxTag.rules = [];
          this.departSettlementInfoRules.manageServerItem.rules = [];
          this.managementFeeAddon = "";
          this.$nextTick(() => {
            this.departSettlementInfoForm.setFieldsValue(pick({managementType:undefined,managementFee:'',manageServerItem:[],managementTaxTag:undefined},
            'managementType','managementFee','manageServerItem','managementTaxTag'))
          })
        }
      },
      businessRisksManagementTagChange(t,option) { // 是否收取管理费
        if(t == 0) {
          this.departBusinessRisksDisabled = false;
          // this.riskManagementTaxTagDisabled = false;
          this.departBusinessRisksSettlementRules.riskManagementType.rules = [];
          this.departBusinessRisksSettlementRules.riskManagementFee.rules = [];
          this.departBusinessRisksSettlementRules.riskManagementTax.rules = [];
          this.departBusinessRisksSettlementRules.riskManagementType.rules[0] = { required: true, message: '请选择管理费收取方式！' }
          this.departBusinessRisksSettlementRules.riskManagementTaxTag.rules = [{required: true, message: '请选择管理费税收是否含税！'}]
        } else {
          this.departBusinessRisksDisabled = true;
          this.riskManagementFeeDisabled = true;
          this.riskManagementTaxDisabled = true;
          this.departBusinessRisksSettlementRules.riskManagementType.rules = [];
          this.departBusinessRisksSettlementRules.riskManagementFee.rules = [];
          this.departBusinessRisksSettlementRules.riskManagementTax.rules[0] = { required: true, message: '请填写商险管理费收取比率！' }
          this.departBusinessRisksSettlementRules.riskManagementTax.rules[1] = { validator: this.validateTaxFee }
          this.departBusinessRisksSettlementRules.riskManagementTaxTag.rules = []
          this.model.riskManagementType = undefined;
          this.model.riskManagementFee = null;
          this.model.riskManagementTax = null;
          this.model.riskManagementTaxTag = undefined;
        }
        if(option){
          this.departBusinessRisksSettlementRules.riskManagementTax.rules = []
          this.$nextTick(() => {
            this.departBusinessRisksSettlementForm.setFieldsValue(pick({riskManagementFee:'',riskManagementTaxTag:undefined,riskManagementTax:'',riskManagementType:undefined}, 'riskManagementFee','riskManagementTax','riskManagementType','riskManagementTaxTag'))
          });
        }
      },
      managementTypeChange(t,option) {
        if(t == 1) {
          // this.departSettlementInfoRules.managementFee.rules[1] = { validator: this.validateTaxFee }
          this.departSettlementInfoRules.managementFee.rules[1] = { validator: (rule,value, callback)=>{
            if(value){
              if( ! /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,3}){0,1}$/.test(value)){
                callback('管理费比例格式不正确!')
              }
            }
            callback()
          } }
          this.managementFeeAddon = "%";
        } else {
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
          this.managementFeeAddon = "";
        }
        if(option){
          this.$nextTick(() => {
            this.departSettlementInfoForm.setFieldsValue(pick({managementFee:''}, 'managementFee'))
          })
        }else{
          // this.$nextTick(() => {
          //   this.departSettlementInfoForm.setFieldsValue(pick({managementFee:this.departSettlementInfoForm.getFieldValue('managementFee')}, 'managementFee'))
          // });
        }
      },
      riskManagementTypeChange(t,option) { //管理费收取方式
        if(t == 0) {
          this.departBusinessRisksSettlementRules.riskManagementFee.rules[0] = { required: true, message: '请填写商险管理费收取值！' }
          this.departBusinessRisksSettlementRules.riskManagementFee.rules[1] = { validator: this.validateFee }
          this.departBusinessRisksSettlementRules.riskManagementTax.rules = [];
          this.riskManagementFeeDisabled = false;
          this.riskManagementTaxDisabled = true;
          this.model.riskManagementTax = null;
        } else {
          this.departBusinessRisksSettlementRules.riskManagementFee.rules = [];
          this.departBusinessRisksSettlementRules.riskManagementTax.rules[0] = { required: true, message: '请填写商险管理费收取比率！' }
          this.departBusinessRisksSettlementRules.riskManagementTax.rules[1] = { validator: this.validateTaxFee }
          this.riskManagementFeeDisabled = true;
          this.riskManagementTaxDisabled = (this.departBusinessRisksSettlementForm.getFieldValue('managementTag') == 1 || this.departBusinessRisksSettlementForm.getFieldValue('managementTag') == undefined ) ? true : false;
          this.model.riskManagementFee = null;
        }
        if(!option){
          this.riskManagementFeeDisabled = (this.businessRisksSettlement.managementTag == 1) ? true : false;
          if(t == 1){
            this.departBusinessRisksSettlementRules.riskManagementFee.rules = [];
            this.riskManagementFeeDisabled = true
            this.riskManagementTaxDisabled = false
          }
        }else{
          this.$nextTick(() => {
            this.departBusinessRisksSettlementForm.setFieldsValue(pick({riskManagementTax:'',riskManagementFee:''}, 'riskManagementTax','riskManagementFee'))
          })
        }

      },
      handleInput(e) {
        e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
      },
      riskFundTagChange(t,option) {
        if(t == 0) {
          this.riskFundFeeDisabled = false;
          this.departSettlementInfoRules.riskFundType.rules = [];
          this.departSettlementInfoRules.riskFundFee.rules = [];
          this.departSettlementInfoRules.riskFundTaxTag.rules = [];
          this.departSettlementInfoRules.riskServerItem.rules = [];
          this.departSettlementInfoRules.riskFundType.rules[0] = { required: true, message: '请选择风险金收费类型！' }
          this.departSettlementInfoRules.riskFundFee.rules[0] = { required: true, message: '风险金费率/金额不能为空！' }
          this.departSettlementInfoRules.riskFundTaxTag.rules[0] = { required: true, message: '请选择风险金税收类型！' }
          this.departSettlementInfoRules.riskServerItem.rules[0] = { required: true, message: '请选择风险金收取项目！' }
        } else {
          this.riskFundFeeDisabled = true;
          this.departSettlementInfoRules.riskFundType.rules = [];
          this.departSettlementInfoRules.riskFundFee.rules = [];
          this.departSettlementInfoRules.riskFundTaxTag.rules = [];
          this.departSettlementInfoRules.riskServerItem.rules = [];
          this.riskFundFeeAddon = "";
        }
        if(!option){
          let riskFundTag = this.departSettlementInfoForm.getFieldValue('riskFundTag')
          if(riskFundTag && riskFundTag == 0){
            this.$nextTick(() => {
              this.departSettlementInfoForm.setFieldsValue(pick(this.departSettlementInfo,
              'riskFundType','riskFundFee','riskServerItem','riskFundTaxTag'))
            })
          }else{
            // this.$nextTick(() => {
            //   this.departSettlementInfoForm.setFieldsValue(pick({riskFundType:undefined,riskFundFee:'',riskServerItem:[],riskFundTaxTag:undefined},
            //   'riskFundType','riskFundFee','riskServerItem','riskFundTaxTag'))
            // })
          }
        }else{
          this.$nextTick(() => {
            this.departSettlementInfoForm.setFieldsValue(pick({riskFundType:undefined,riskFundFee:'',riskServerItem:[],riskFundTaxTag:undefined},
            'riskFundType','riskFundFee','riskServerItem','riskFundTaxTag'))
          })
        }
      },
      riskFundTypeChange(t,option) {
        if(t == 1) {
          this.riskFundFeeAddon = "%";
          this.departSettlementInfoRules.riskFundFee.rules[1] = { validator: this.validateTaxFee }
        } else {
          this.departSettlementInfoRules.riskFundFee.rules[1] = {
            validator:(rule,value, callback)=>{
              if(value){
                if( ! /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) || value < 0.01 || value > 9999999.99){
                  callback('风险金金额格式不正确!')
                }
              }
              callback()
            }
          }
          this.riskFundFeeAddon = "";
        }
        if(option){
          this.$nextTick(() => {
            this.departSettlementInfoForm.setFieldsValue(pick({riskFundFee:undefined}, 'riskFundFee'))
          });
        }
      },
      numberOnly(e) {
        if(e.keyCode!=46 && e.keyCode!=45 && e.keyCode<48 || e.keyCode>57) e.returnValue = false;
      },
      getAllTable() {
        return Promise.all([
          getRefPromise(this, 'editableTable1'),
        ])
      },
      requestTableData(url, params, tab) {
        tab.loading = true
        getAction(url, params).then(res => {
          tab.dataSource = res.result || []
        }).finally(() => {
          tab.loading = false
        })
      },
      validateTaxFee(rule,value,callback) {
        // if (!value || new RegExp(/^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|0$/).test(value)){
        if (!value || new RegExp(/^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|0)$/).test(value)){
          callback();
        }else{
          callback("数据不正确，请输入如: 100以内的小数或整数!");
        }
      },
      validateFee(rule,value,callback) {
        if(value){
          if( ! /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) || value < 0.01 || value > 9999999.99){
            callback('商险管理费金额格式不正确!')
          }
        }
        callback()
        // if (!value || new RegExp(/^\+?[1-9][0-9]*$/).test(value)){
        //   callback();
        // }else{
        //   callback("只能输入数字!");
        // }
      },
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