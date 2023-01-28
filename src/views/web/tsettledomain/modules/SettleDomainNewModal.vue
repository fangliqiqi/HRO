<template @touchmove.prevent>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    style="top: 20px;"
    class="ant-modal_detail"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关 闭</a-button>
      <a-button
        @click="handleOk"
        type="primary"
      >保存</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-card title="基本信息">
        <a-form
          :form="settleDomainForm"
          layout="inline"
          class="ant-advanced-search-form"
        >
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item
                class="stepFormText"
                label="合同主体"
              >
                <a-select
                  showSearch
                  placeholder="请选择合同主体"
                  optionFilterProp="children"
                  style="width: 179px"
                  v-decorator="['belongContract', validatorRules.belongContract ]"
                  @change="belongContractChange"
                >
                  <a-select-option
                    v-for="(item, index) in customerContracts"
                    :key="index"
                    :value="item.CONTRACT_ID"
                  >{{ item.CONTRACT_NAME }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                class="stepFormText"
                label="所属客户"
              >
                <a-select
                  showSearch
                  placeholder="请选择所属客户"
                  optionFilterProp="children"
                  style="width: 179px"
                  :disabled="true"
                  v-decorator="['customerId', validatorRules.customerId ]"
                >
                  <a-select-option
                    v-for="(item, index) in customers"
                    :key="index"
                    :value="item.customerId"
                  >{{ item.customerName }}</a-select-option>
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
                  style="width: 179px"
                  @change="getIncomeBelongSub"
                  v-decorator="['incomeBelong', validatorRules.incomeBelong ]"
                >
                  <a-select-option
                    v-for="(item, index) in organs"
                    :key="index"
                    :value="item.id"
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
                  style="width: 179px"
                  v-decorator="['incomeBelongSub', {} ]"
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
                  style="width: 739px"
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
      </a-card>

      <a-card title="结算信息">
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
                  placeholder="社保卡是否收取"
                  optionFilterProp="children"
                  style="width: 180px;"
                  v-decorator="['socialCardTaker', departSettlementInfoRules.socialCardTaker ]"
                >
                  <a-select-option value="0">是</a-select-option>
                  <a-select-option value="1">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
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
                label="管理费费率/金额"
              >
                <a-input
                  @blur="handleInput"
                  style="width: 180px;"
                  placeholder="管理费费率/金额"
                  :addonAfter="managementFeeAddon"
                  :disabled="managementFeeDisabled"
                  v-decorator="['managementFee', departSettlementInfoRules.managementFee ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
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
                label="风险金费率/金额"
              >
                <a-input
                  placeholder="风险金费用/税率"
                  style="width: 180px;"
                  @blur="handleInput"
                  :addonAfter="riskFundFeeAddon"
                  :disabled="riskFundFeeDisabled"
                  v-decorator="['riskFundFee', departSettlementInfoRules.riskFundFee ]"
                />
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
                  <a-select-option value="1">含税</a-select-option>
                  <a-select-option value="0">不含税</a-select-option>
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
                  <a-select-option value="0">含税</a-select-option>
                  <a-select-option value="1">不含税</a-select-option>
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
                  @blur="handleInput"
                  v-decorator="['unitSeriousIllnessProp', {} ]"
                />
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
                  v-decorator="['taxFee', departSettlementInfoRules.taxFee ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                class="stepFormText"
                label="交税类型"
              >
                <a-select
                  placeholder="交税类型"
                  optionFilterProp="children"
                  style="width: 180px;"
                  v-decorator="['taxType', {} ]"
                >
                  <a-select-option
                    v-for="(item,index) in taxTypeDicts"
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
        </a-form>
      </a-card>

      <!-- 操作 -->
      <a-card title="收入归属">
        <a-switch
          slot="extra"
          defaultChecked
          @change="incomeBelongSwitchChange"
        />

      </a-card>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import {initDictOptions} from '@/components/dict/JDictSelectUtil'
import Table from 'ant-design-vue/es/table/Table'
import ACol from 'ant-design-vue/es/grid/Col'
import { allPrpos } from '@/utils/beanUtils'

export default {
  name: "SettleDomainNewModal",
  components: { ACol, Table },
  data () {
    return {
      title: '结算主体新增',
      visible: false,
      model: {},
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
      riskFundTaxTagDisabled: true,


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
        departName:{rules: [{ required: true, message: '请输入结算主体名称!' }]},
        isNew:{rules: [{ required: true, message: '请输入是否是新业务!' }]},
        newRemark:{rules: [{ required: true, message: '请输入新业务备注!' }]},
        createUser:{rules: [{ required: true, message: '请输入创建人!' }]},
        deleteFlag:{rules: [{ required: true, message: '请输入是否删除!' }]},
        dpAuditFlag:{rules: [{ required: true, message: '请输入服务审核标识' }]},
        belongContract:{rules: [{ required: true, message: '请输入合同主体!' }]},
        serverItem:{rules: [{ required: true, message: '请输入服务项目!' }]},
        incomeBelong:{rules: [{ required: true, message: '请输入收入归属!' }]},
        customerId:{rules: [{ required: true, message: '请输入所属客户!' }]},
      },
      validatorDockingPeopleRules: {
        // 福利购买信息数据校验
        welfareAddr:{rules: [{ required: true, message: '请输入福利购买地!' }]},
        insuranceType:{rules: [{ required: true, message: '请选择保险类型!' }]},
      },
      validatorTableHeaderPeopleRules: {
        // 封面抬头校验
        coverName:{rules: [{ required: true, message: '请输入抬头名称!' }]},
        type:{rules: [{ required: true, message: '请选择抬头类型!' }]},
      },
      validatorTicketConfigRules: {
        // 发票抬头校验
        ticketTableHead:{rules: [{ required: true, message: '请输入抬头名称!' }]},
        taxpayerIdentificationNo:{rules: [{ required: true, message: '请输入纳税人识别号!' }]},
        bankName:{rules: [{ required: true, message: '请输入开户行!' }]},
        bankNo:{rules: [{ required: true, message: '请输入银行卡号!' }]},
      },
      approvalFormTickectRules: {
        // 核准表开票信息配置校验
        customerTicketName:{rules: [{ required: true, message: '请输入客户开票名称!' }]},
        selfTomoneyUnitName:{rules: [{ required: true, message: '请输入我司到款单位名称!' }]},
      },
      departSettlementInfoRules: {
        socialCardTaker:{rules: [{ required: true, message: '社保卡是否收取不能为空!' }]},
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
        taxFee: {rules: [{validator:this.validateTaxFee}]},
      },
      departEngineeringSettlementRules: {
        managementTax:{rules: [{ required: true, message: '请输入管理费率!' }]},
        personalTax:{rules: [{ required: true, message: '请输入个人所得税!' }]},
        businessTax:{rules: [{ required: true, message: '请输入企业所得税!' }]},
      },
      departBusinessRisksSettlementRules: {
        managementTag:{rules: [{ required: true, message: '管理费是否收费不能为空!' }]},
        riskManagementType:{rules:[]},
        riskManagementFee:{rules:[]},
        riskManagementTax:{rules:[]},
        riskManagementTaxTag:{rules:[]},
      },
      url: {
        add: "/hrBase/tsettledomain/vo",
        edit: "/hrBase/tsettledomain",
        getCustomerContract: "/hrBase/tcustomercontract/",
        getIncomeBelongSub: "/admin/organizationinfo/getDepartByUnitId",
      },
    }
  },
  created () {
    this.initDictConfig();
  },
  methods: {
    add() {
      this.departs = [];
      this.settleDomainForm.resetFields();
      this.dockingPeopleForm.resetFields();
      this.tableHeaderCoverForm.resetFields();
      this.ticketConfigForm.resetFields();
      this.approvalFormTickectForm.resetFields();
      this.departEngineeringSettlementForm.resetFields();
      this.departBusinessRisksSettlementForm.resetFields();
      this.departAppointInfoForm.resetFields();
      this.departSettlementInfoForm.resetFields();
      this.visible = true;
    },
    edit() {

    },
    close () {
      this.$emit('close');
      this.visible = false;
    },
    handleOk () {
      // eslint-disable-next-line no-unused-vars
      const that = this;
      const settleDomainForSaveVo = {};
      let isSubmit = false;
      this.settleDomainForm.validateFields((err, values) => {
        this.model = {};
        if (!err) {
          let formData = Object.assign(this.model, values);

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

          delete formData.customerName;
          delete formData.businessSubject;
          delete formData.businessSubjectName;

          settleDomainForSaveVo.settleDomain = formData;
          isSubmit = true;
        }
      });
      this.departSettlementInfoForm.validateFields((err, values) => {
        this.model = {};
        if(err) {
          isSubmit = false;
        }
        if (!err) {
          let formData = Object.assign(this.model, values);
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
            }

            settleDomainForSaveVo.departSettlementInfo = formData;
          }
        }
      });
      this.dockingPeopleForm.validateFields((err, values) => {
        this.model = {};
        if(err) {
          isSubmit = false;
        }
        if (!err) {
          let formData = Object.assign(this.model, values);
          let isNullObject = allPrpos(formData);
          if(isNullObject) {
            settleDomainForSaveVo.buyWelfare = formData;
          }
        }
      });
      this.tableHeaderCoverForm.validateFields((err, values) => {
        this.model = {};
        if(err) {
          isSubmit = false;
        }
        if (!err) {
          let formData = Object.assign(this.model, values);
          let isNullObject = allPrpos(formData);
          if(isNullObject) {
            let arrObjs = [];
            if(formData.coverName.length > 0 && formData.type != null && formData.coverName.length == formData.type.length) {
              for(let i = 0; i < formData.coverName.length; i++) {
                let obj = {};
                obj.coverName = formData.coverName[i];
                obj.type = formData.type[i];
                arrObjs.push(obj);
              }
            }
            settleDomainForSaveVo.tableHeadSalaryCover = arrObjs;
          }
        }
      });
      this.ticketConfigForm.validateFields((err, values) => {
        this.model = {};
        if(err) {
          isSubmit = false;
        }
        if (!err) {
          let formData = Object.assign(this.model, values);
          let isNullObject = allPrpos(formData);
          if(isNullObject) {
            settleDomainForSaveVo.ticketConfig = formData;
          }
        }
      });
      this.approvalFormTickectForm.validateFields((err, values) => {
        this.model = {};
        if(err) {
          isSubmit = false;
        }
        if (!err) {
          let formData = Object.assign(this.model, values);
          let isNullObject = allPrpos(formData);
          if(isNullObject) {
            settleDomainForSaveVo.approvalFormTickect = formData;
          }
        }
      });
      this.departEngineeringSettlementForm.validateFields((err, values) => {
        this.model = {};
        if(err) {
          isSubmit = false;
        }
        if (!err) {
          let formData = Object.assign(this.model, values);
          let isNullObject = allPrpos(formData);
          if(isNullObject) {
            settleDomainForSaveVo.engineeringSettlement = formData;
          }
        }
      });
      this.departBusinessRisksSettlementForm.validateFields((err, values) => {
        this.model = {};
        if(err) {
          isSubmit = false;
        }
        if (!err) {
          let formData = Object.assign(this.model, values);
          let isNullObject = allPrpos(formData);
          if(isNullObject) {
            settleDomainForSaveVo.businessRisksSettlement = formData;
          }
        }
      });
      this.departAppointInfoForm.validateFields((err, values) => {
        this.model = {};
        if(err) {
          isSubmit = false;
        }
        if (!err) {
          let formData = Object.assign(this.model, values);
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
        if(!this.model.id){
          httpurl += this.url.add;
          method = 'post';
          msg = '添加成功!';
        }else{
          httpurl += this.url.edit;
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
    getIncomeBelongSub(value) {
      this.departs = [];
      if(value === undefined) {
        let obj = {};
        obj.id = 0;
        obj.ORGAN_NAME = "请选择";

        this.departs.push(obj)
      } else {
        httpAction(this.url.getIncomeBelongSub + "?unitId=" + value, null, "GET").then((res) => {
          if(res.code == 200 && res.data.length > 0) {
            this.departs = res.data;
          }
        });
        let obj = {};
        obj.id = 0;
        obj.ORGAN_NAME = "请选择";

        this.departs.push(obj)
      }
    },
    // eslint-disable-next-line no-unused-vars
    callback(key) {

    },
    remove(k) {
      if(k < this.coverLength.length - 1) {
        this.$message.success('请从最后一个开始删除！');
        return;
      }
      if(this.coverLength.length == 1) {
        this.coverLength.push(String(new Date().getTime()));
      } else {
        this.coverLength.splice(k, 1);
      }
    },
    addItem() {
      this.coverLength.push(String(new Date().getTime()));
    },
    managementTagChange(t) {
      if(t == 0) {
        this.managementFeeDisabled = false;
        this.departSettlementInfoRules.managementType.rules = [];
        //{validator:this.validateTaxFee}
        this.departSettlementInfoRules.managementFee.rules = [];
        this.departSettlementInfoRules.managementTaxTag.rules = [];
        this.departSettlementInfoRules.manageServerItem.rules = [];
        this.departSettlementInfoRules.managementType.rules[0] = { required: true, message: '请选择！' }
        this.departSettlementInfoRules.managementFee.rules[0] = { required: true, message: '管理费费率/金额不能为空！' }
        this.departSettlementInfoRules.managementTaxTag.rules[0] = { required: true, message: '请选择管理费税收类型！' }
        this.departSettlementInfoRules.manageServerItem.rules[0] = { required: true, message: '请选择管理费收取项目！' }
      } else {
        this.managementFeeDisabled = true;
        this.departSettlementInfoRules.managementType.rules = [];
        this.departSettlementInfoRules.managementFee.rules = [];
        this.departSettlementInfoRules.managementTaxTag.rules = [];
        this.departSettlementInfoRules.manageServerItem.rules = [];

        this.model.managementType = null;
        this.model.managementFee = null;
        this.model.managementTaxTag = null;
        this.model.manageServerItem = [];
        this.departSettlementInfoForm.setFieldsValue(pick(this.model, 'managementType','managementFee','managementTaxTag','manageServerItem'))
      }
    },
    businessRisksManagementTagChange(t) {
      if(t == 0) {
        this.departBusinessRisksDisabled = false;
        this.riskManagementTaxTagDisabled = false;

        this.departBusinessRisksSettlementRules.riskManagementType.rules = [];
        this.departBusinessRisksSettlementRules.riskManagementFee.rules = [];
        this.departBusinessRisksSettlementRules.riskManagementTax.rules = [];
        this.departBusinessRisksSettlementRules.riskManagementTaxTag.rules = [];
        this.departBusinessRisksSettlementRules.riskManagementType.rules[0] = { required: true, message: '请选择管理费收取方式！' }
        this.departBusinessRisksSettlementRules.riskManagementTaxTag.rules[0] = { required: true, message: '请选择管理费税收是否含税！' }
      } else {
        this.departBusinessRisksDisabled = true;
        this.riskManagementFeeDisabled = true;
        this.riskManagementTaxDisabled = true;
        this.riskManagementTaxTagDisabled = true;

        this.departBusinessRisksSettlementRules.riskManagementType.rules = [];
        this.departBusinessRisksSettlementRules.riskManagementFee.rules = [];
        this.departBusinessRisksSettlementRules.riskManagementTax.rules = [];
        this.departBusinessRisksSettlementRules.riskManagementTaxTag.rules = [];

        this.model.riskManagementType = null;
        this.model.riskManagementFee = null;
        this.model.riskManagementTax = null;
        this.model.riskManagementTaxTag = null;
        this.departBusinessRisksSettlementForm.setFieldsValue(pick(this.model, 'riskManagementType','riskManagementFee','riskManagementTax','riskManagementTaxTag'))
        // riskFundTaxTagDisabled: true,
      }
    },
    managementTypeChange(t) {
      this.model.managementFee = null;
      this.departSettlementInfoForm.setFieldsValue(pick(this.model,'managementFee'));
      if(t == 1) {
        this.departSettlementInfoRules.managementFee.rules[1] = { validator: this.validateTax }
        this.managementFeeAddon = "%";
      } else {
        this.managementFeeAddon = "";
      }
    },
    riskManagementTypeChange(t) {
      if(t == 0) {
        this.departBusinessRisksSettlementRules.riskManagementFee.rules[0] = { required: true, message: '请填写商险管理费收取值！' }
        this.departBusinessRisksSettlementRules.riskManagementFee.rules[1] = { validator: this.validateFee }
        this.departBusinessRisksSettlementRules.riskManagementTax.rules = [];
        this.riskManagementFeeDisabled = false;
        this.riskManagementTaxDisabled = true;

        this.model.riskManagementTax = null;
        this.departBusinessRisksSettlementForm.setFieldsValue(pick(this.model, 'riskManagementTax'))
      } else {
        this.departBusinessRisksSettlementRules.riskManagementFee.rules = [];
        this.departBusinessRisksSettlementRules.riskManagementTax.rules[0] = { required: true, message: '请填写商险管理费收取比率！' }
        this.departBusinessRisksSettlementRules.riskManagementTax.rules[1] = { validator: this.validateTaxFee }
        this.riskManagementFeeDisabled = true;
        this.riskManagementTaxDisabled = false;

        this.model.riskManagementFee = null;
        this.departBusinessRisksSettlementForm.setFieldsValue(pick(this.model, 'riskManagementFee'))
      }
      this.riskFundTaxTagDisabled = false;
    },
    handleInput(e) {
      e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
    },
    riskFundTagChange(t) {
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

        this.model.riskFundType = null;
        this.model.riskFundFee = null;
        this.model.riskFundTaxTag = null;
        this.model.riskServerItem = [];
        this.departSettlementInfoForm.setFieldsValue(pick(this.model, 'riskFundType','riskFundFee','riskFundTaxTag','riskServerItem'))
      }
    },
    riskFundTypeChange(t) {
      this.model.riskFundFee = null;
      this.departSettlementInfoForm.setFieldsValue(pick(this.model, 'riskFundFee'))
      if(t == 1) {
        this.departSettlementInfoRules.riskFundFee.rules[1] = { validator: this.validateTax }
        this.riskFundFeeAddon = "%";
      } else {
        this.riskFundFeeAddon = "";
      }
    },
    numberOnly(e) {
      if(e.keyCode!=46 && e.keyCode!=45 && e.keyCode<48 || e.keyCode>57) e.returnValue = false;
    },
    validateTaxFee(rule,value,callback) {
      if (!value || new RegExp(/^100$|^(\d|[1-9]\d)(\.\d+)*$/).test(value)) {
        callback();
      } else {
        callback("数据不正确，请输入如: 6.87!");
      }
    },
    validateTax(rule,value,callback) {
      if(!value || new RegExp(/^100$|^(\d|[1-9]\d)(\.\d+)*$/).test(value)) {
        callback();
      } else {
        callback("数据不正确，请输入如: 100以内的小数或整数!");
      }
    },
    validateFee(rule,value,callback) {
      if (!value || new RegExp(/^\+?[1-9][0-9]*$/).test(value)){
        callback();
      }else{
        callback("只能输入数字!");
      }
    },
    incomeBelongSwitchChange(check) {
      console.log(check)
    }
  }
}
</script>

<style lang="scss" scoped>
/** 主表单行间距 */
.ant-form .ant-form-item {
  margin-bottom: 10px;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}

.stepFormText {
  :global(.ant-form-item-label) {
    width: 120px;
  }
}
</style>