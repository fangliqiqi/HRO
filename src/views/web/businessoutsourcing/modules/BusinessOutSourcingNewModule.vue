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
              label="结算主体"
            >
              <!-- <a-select
                showSearch
                :disabled="model.id ? true : false"
                placeholder="请选择结算主体"
                optionFilterProp="children"
                style="width: 265px"
                @change="settleDomainChange"
                :dropdownMatchSelectWidth="false"
                v-decorator="['settleDomainId', validatorRules.settleDomains]"
              >
                <a-select-option
                  v-for="(item, index) in settleDomainOptions"
                  :key="index"
                  :value="item.id"
                >{{ item.departName }}</a-select-option>
              </a-select> -->
              <select-page
                placeholder="请选择结算主体"
                style="width: 265px"
                v-decorator="['settleDomainId', validatorRules.settleDomains]"
                :searchUrl="'hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :allowClear="false"
                :resList="resList"
                @select="handleSelect"
                :id="'id'"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="客户单位"
            >
              <a-select
                showSearch
                :disabled="true"
                placeholder="请选择客户单位"
                optionFilterProp="children"
                style="width: 265px"
                :dropdownMatchSelectWidth="false"
                v-decorator="['customerId', validatorRules.customerId]"
              >
                <a-select-option
                  v-for="(item, index) in customerOptions"
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
              label="关联合同"
            >
              <a-select
                showSearch
                :disabled="true"
                placeholder="请选择关联合同"
                optionFilterProp="children"
                style="width: 265px"
                :dropdownMatchSelectWidth="false"
                v-decorator="['unitContractId', validatorRules.unitContractId]"
              >
                <a-select-option
                  v-for="(item, index) in unitContractsOptions"
                  :key="index"
                  :value="item.belongContract"
                >{{ item.contractName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="服务项目"
            >
              <a-select
                v-decorator="['moutsourcingItemVos', validatorRules.serviceItem]"
                mode="multiple"
                placeholder="服务项目"
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
                style="width: 265px"
                v-decorator="['businessName', validatorRules.businessName]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="业务创建日期"
            >
              <a-date-picker
                :allowClear="false"
                :format="formate"
                style="width: 265px"
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
                style="width: 265px"
                v-decorator="['dockingPerson', {}]"
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
                style="width: 265px"
                v-decorator="['dockingPhone']"
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
                showSearch
                optionFilterProp="children"
                :dropdownMatchSelectWidth="false"
                v-decorator="['businessPersion', validatorRules.businessPersion]"
                placeholder="请选择业务开发人"
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
                showSearch
                optionFilterProp="children"
                :dropdownMatchSelectWidth="false"
                v-decorator="['customerService', validatorRules.customerService ]"
                placeholder="请选择服务客服"
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
                :autoSize="{ minRows: 2, maxRows: 2 }"
                placeholder="备注"
                v-decorator="['remark', {}]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
/* eslint-disable no-irregular-whitespace */
import { httpAction } from '@/api/manage'
import {initDictOptions} from '@/components/dict/JDictSelectUtil'
import Table from 'ant-design-vue/es/table/Table'
import ACol from 'ant-design-vue/es/grid/Col'
import pick from 'lodash.pick'
import moment from 'moment';
import SelectPage from '@/components/jeecg/SelectPage'

export default {
  name: "BusinessOutSourcingNewModule",
  components: { ACol, Table, SelectPage },
  data () {
    return {
      title:"操作",
      visible: false,
      model: {},
      organs: [],
      customers: [],
      serviceItems: [],
      departs: [],
      unitContracts: [],
      settleDomains: [],
      settleDomainOptions: [],  // 结算主体、客户单位、关联合同
      customerOptions: [], // 客户单位
      unitContractsOptions: [], // 关联合同
      businessName: {customerId: "",serverItem: "",createTime: ""},
      sysUsers: [],
      formate:'YYYY-MM-DD',
      //字典公共变量
      resList:[], //选中的结算主体
      confirmLoading: false,
      //Form表单项
      form: this.$form.createForm(this),
      validatorRules:{
        customerId:{rules: [{ required: true, message: '请选择客户单位!' }]},
        unitContractId:{rules: [{ required: true, message: '请选择关联合同!' }]},
        settleDomains:{rules: [{ required: true, message: '请选择结算主体!' }]},
        serviceItem:{rules: [{ required: true, message: '请选择服务项目!' }]},
        businessName:{rules: [{ required: true, message: '请输入业务名称!' }]},
        businessPersion:{rules: [{ required: true, message: '请选择业务开发人!' }]},
        customerService:{rules: [{ required: true, message: '请选择服务客服!' }]},
        createTime:{
          rules: [{ required: false, message: '请选择业务创建日期!' }],
          initialValue:moment().format(this.formate)
        },
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
      this.edit({})
    },
    handleSelect(val){
      httpAction(`hrBase/tsettledomain/getSettleDomain/bySelectVoById?id=${val}`,null,'get').then(res=>{
        if(res.code === 200 && res.data){
          console.log(res.data)
          this.customerOptions = this.unitContractsOptions = [res.data]
          this.model.departName = res.data.departName
          this.model.customerId = res.data.customerId
          this.model.customerName = res.data.customerName
          this.model.unitContractId = res.data.belongContract
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({settleDomainId:val},'settleDomainId'))
            this.form.setFieldsValue(pick(this.model, 'customerId', 'unitContractId'))
          })
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    // eslint-disable-next-line no-unused-vars
    edit (record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      if (this.model.id) {
        this.model.createTime = moment(this.model.createTime, this.formate)
        this.model.businessPersion = this.model.businessPersion ? Number(this.model.businessPersion) : []
        this.model.customerService = this.model.customerService ? Number(this.model.customerService) : []
        this.customerOptions = [{customerId:this.model.customerId,customerName:this.model.customerName}]
        httpAction(`/hrBase/tcustomercontract/${this.model.unitContractId}`,null,'get').then(res=>{
          if(res.code === 200){
            this.unitContractsOptions = [{belongContract:res.data.id,contractName:res.data.contractName}]
          }
        })
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
      }
      this.visible = true
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
    settleDomainChange(value) {
      const selectInfo = this.settleDomainOptions[value]
      this.customerOptions = this.unitContractsOptions = [selectInfo]
      this.model.departName = selectInfo.departName
      this.model.customerId = selectInfo.customerId
      this.model.customerName = selectInfo.customerName
      this.model.unitContractId = selectInfo.belongContract
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'customerId', 'unitContractId'))
      })
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
      this.model.businessName = `${_t.customerId}${_t.serverItem}业务${_t.createTime}`
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'businessName'))
      })
    },
    close () {
      this.$emit('close');
      this.confirmLoading = false;
      this.visible = false;
      this.settleDomainOptions = []  // 结算主体、客户单位、关联合同
      this.customerOptions = [] // 客户单位
      this.unitContractsOptions = [] // 关联合同
      this.resList = []
    },
    handleOk () {
      // eslint-disable-next-line no-unused-vars
      const that = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let method = '';
          let msg = '';
          if(!this.model.id){
            method = 'post';
            msg = '添加成功!';
          }else{
            method = 'put';
            msg = '修改成功!';
          }
          const formData = Object.assign(this.model, values)
          let serverItemsArray = [];
          if(formData.moutsourcingItemVos != null && formData.moutsourcingItemVos.length > 0) {
            serverItemsArray = formData.moutsourcingItemVos.map(item=>{
              return {
                id:item
              }
            })
          }
          formData.createTime = formData.createTime ? moment(formData.createTime).format(this.formate) : null
          formData.moutsourcingItemVos = serverItemsArray
          if (Array.isArray(formData.businessPersion)) {
            formData.businessPersion = null
          }
          if (Array.isArray(formData.customerService)) {
            formData.customerService = null
          }
          httpAction(that.url.saveOrUpdate,formData,method).then((res) => {
            if(res.code == 200){
              that.$message.success(msg)
              that.$emit('ok')
            }else{
              that.$message.warning(res.msg || res.message);
            }
          }).finally(() => {
            that.confirmLoading = false
            that.close()
          })
        }
      })
    },
    handleCancel () {
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
    // 手机号验证
    validatePhone(rule, value, callback) {
      if (!value) {
        callback()
        return false
      }

      if (!new RegExp(/^1[3-9][0-9]\d{8}$/).test(value)) {
        callback('联系方式格式不正确！')
        return false
      }

      callback()
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
