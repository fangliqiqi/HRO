<template>
  <a-modal
    :title="title"
    :width="1000"
    :closable="true"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel"
  >

    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
      <a-button
        key="audit"
        type="primary"
        @click="handleOk"
      >审核</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="客户单位"
            >
              <a-tree-select
                showSearch
                style="width: 265px"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto',width: '179px' }"
                :treeData="treeData"
                placeholder="请选择客户单位"
                treeNodeFilterProp="title"
                treeDefaultExpandAll
                :disabled="true"
                @change="treeSelectChange"
                v-decorator="['customerId', validatorRules.customerId]"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="关联合同"
            >
              <a-select
                showSearch
                placeholder="请选择关联合同"
                optionFilterProp="children"
                style="width: 265px"
                :disabled="true"
                @change="unitContractsChange"
                :dropdownMatchSelectWidth="false"
                v-decorator="['unitContractId', validatorRules.unitContractId ]"
              >
                <a-select-option
                  v-for="(item, index) in unitContracts"
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
              label="结算主体"
            >
              <a-select
                showSearch
                placeholder="请选择结算主体"
                optionFilterProp="children"
                style="width: 265px"
                :disabled="true"
                @change="settleDomainChange"
                :dropdownMatchSelectWidth="false"
                v-decorator="['settleDomainId', validatorRules.settleDomains ]"
              >
                <a-select-option
                  v-for="(item, index) in settleDomains"
                  :key="index"
                  :value="item.id"
                >{{ item.departName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="服务项目"
            >
              <a-select
                v-decorator="['moutsourcingItemVos', validatorRules.serviceItem ]"
                mode="multiple"
                placeholder="服务项目"
                :disabled="true"
                style="width: 265px"
                :dropdownMatchSelectWidth="false"
                @change="serviceItemsChange"
              >
                <a-select-option
                  v-for="item in serviceItems"
                  :key="item.id"
                >
                  {{ item.itemName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="业务名称"
            >
              <a-input
                placeholder="请输入业务名称"
                :disabled="true"
                style="width: 265px"
                v-decorator="['businessName', validatorRules.businessName ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="业务创建日期"
            >
              <a-date-picker
                format="YYYY-MM-DD"
                style="width: 265px"
                :disabled="true"
                @change="createTimeChange"
                v-decorator="[ 'createTime', validatorRules.createTime]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="业务对接人"
            >
              <a-input
                placeholder="请输入业务对接人"
                :disabled="true"
                style="width: 265px"
                v-decorator="['dockingPerson', {} ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="对接人联系方式"
            >
              <a-input
                placeholder="请输入对接人联系方式"
                :disabled="true"
                style="width: 265px"
                v-decorator="['dockingPhone', {} ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="业务开发人"
            >
              <a-select
                v-decorator="['businessPersion', {} ]"
                placeholder="请选择业务开发人"
                :disabled="true"
                :dropdownMatchSelectWidth="false"
                style="width: 265px"
              >
                <a-select-option
                  v-for="item in sysUsers"
                  :key="item.userId"
                >
                  {{ item.nickname }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="服务客服"
            >
              <a-select
                v-decorator="['customerService', {} ]"
                placeholder="请选择服务客服"
                :disabled="true"
                :dropdownMatchSelectWidth="false"
                style="width: 265px"
              >
                <a-select-option
                  v-for="item in sysUsers"
                  :key="item.userId"
                >
                  {{ item.nickname }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              class="stepFormText"
              label="备注"
            >
              <a-textarea
                style="width: 750px"
                :disabled="true"
                :autosize="{ minRows: 2, maxRows: 2 }"
                placeholder="备注"
                v-decorator="['remark', {} ]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>

    <audit-module
      ref="auditModal"
      @ok="auditModalOk"
    ></audit-module>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import {initDictOptions} from '@/components/dict/JDictSelectUtil'
import Table from 'ant-design-vue/es/table/Table'
import ACol from 'ant-design-vue/es/grid/Col'
import pick from 'lodash.pick'
import moment from 'moment';
import AuditModule from './AuditModule'

export default {
  name: "BusinessOutSourcingDetailModule",
  components: { AuditModule, ACol, Table },
  data () {
    return {
      title:"操作",
      visible: false,
      model: {},
      organs: [],
      customers: [],
      serviceItems: [],
      departs: [],
      treeData: [],
      unitContracts: [],
      settleDomains: [],
      businessName: {customerId: "",serverItem: "",createTime: ""},
      sysUsers: [],
      //字典公共变量

      confirmLoading: false,
      //Form表单项
      form: this.$form.createForm(this),

      validatorRules:{
        customerId:{rules: [{ required: true, message: '请选择客户单位!' }]},
        unitContractId:{rules: [{ required: true, message: '请选择关联合同!' }]},
        settleDomains:{rules: [{ required: true, message: '请选择结算主体!' }]},
        serviceItem:{rules: [{ required: true, message: '请选择服务项目!' }]},
        businessName:{rules: [{ required: true, message: '请输入业务名称!' }]},
        createTime:{rules: [{ required: true, message: '请选择业务创建日期!' }]},
      },
      url: {
        saveOrUpdate: "/hrOneTime/tbusinessoutsourcingmain",
        getCustomerInfo: '/hrBase/tcustomerinfo/vo/',
        getCustomerContract: "/hrBase/tcustomercontract/",
        getIncomeBelongSub: "/admin/organizationinfo/getDepartByUnitId",
        getServerItems: '/hrOneTime/tserveritem/all',
      },
    }
  },
  created () {
    this.initDictConfig();
    this.getAllServerItems();
  },
  methods: {
    moment,
    add () {
      this.form.resetFields()
      this.visible = true;
    },
    // eslint-disable-next-line no-unused-vars
    edit (record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.treeSelectForEdit(this.model.customerId,this.model.unitContractId);
      this.model.createTime = moment(this.model.createTime, 'YYYY-MM-DD')
      this.model.businessPersion = Number(this.model.businessPersion);
      this.model.customerService = Number(this.model.customerService);

      this.$nextTick(() => {
        if(this.model.moutsourcingItemVos != null && this.model.moutsourcingItemVos.length > 0) {
          let serverItemIds = [];
          for (let i = 0; i < this.model.moutsourcingItemVos.length; i++) {
            serverItemIds.push(this.model.moutsourcingItemVos[i].serverItemId);
          }
          this.model.moutsourcingItemVos = serverItemIds;
        }
        this.form.setFieldsValue(pick(this.model, 'customerId', 'unitContractId','settleDomainId','moutsourcingItemVos','businessName',
          'createTime','dockingPerson','dockingPhone','businessPersion','customerService','remark'))
      })

      this.visible = true;
    },
    // eslint-disable-next-line no-unused-vars
    treeSelectChange(value, label, extra) {
      this.businessName.customerId = label[0];
      this.model.customerName = label[0];
      httpAction(this.url.getCustomerInfo + value,null,'GET').then((res) => {
        if(res.code == 200) {
          this.unitContracts = res.data.contractVoList;
        }
      });

      this.autoBusinessName(this.businessName);
    },
    async treeSelectForEdit(value,unitContractId) {
      await httpAction(this.url.getCustomerInfo + value,null,'GET').then((res) => {
        if(res.code == 200) {
          this.unitContracts = res.data.contractVoList;
          this.unitContractsChange(unitContractId);
        }
      });
    },
    settleDomainChange(t,v) {
      this.model.departName = v.componentOptions.children[0].text;
    },
    unitContractsChange(value) {
      for(let i = 0; i < this.unitContracts.length; i++) {
        if(value == this.unitContracts[i].id) {
          this.settleDomains = this.unitContracts[i].settleDomain
        }
      }
    },
    serviceItemsChange(t,v) {
      let items = "";
      for(let i = 0; i < v.length; i++) {
        items += v[i].componentOptions.children[0].text.trim();
      }
      this.businessName.serverItem = items;
      this.autoBusinessName(this.businessName);
    },
    createTimeChange(d) {
      this.businessName.createTime = d.format('YYYYMMDD');
      this.autoBusinessName(this.businessName);
    },
    autoBusinessName(_t) {
      this.model.businessName = _t.customerId + _t.serverItem + "业务" + _t.createTime
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'businessName'))
      })
    },
    close () {
      this.$emit('close');
      this.visible = false;
    },
    handleOk () {
      this.$refs.auditModal.showModal(this.model.id);
    },
    handleCancel () {
      this.close()
    },
    auditModalOk() {
      this.$emit('ok')
      this.close()
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
    },
    getAllServerItems() {
      httpAction(this.url.getServerItems, null, 'GET').then((res) => {
        if(res.data != null && res.data.length > 0) {
          this.serviceItems = res.data;
        }
      });
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
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>