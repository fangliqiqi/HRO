<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="inline" class="ant-advanced-search-form">
        <a-row :gutter="24">
          <a-col :span="10">
            <a-form-item label="合同主体">
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
          <a-col :span="10">
            <a-form-item
              label="所属客户">
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
          <a-col :span="10">
            <a-form-item
              label="结算名称">
              <a-input placeholder="请输入结算主体名称" v-decorator="['departName', validatorRules.departName ]" />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item
              label="收入归属">
              <a-select
                showSearch
                placeholder="请选择收入归属"
                optionFilterProp="children"
                style="width: 179px"
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
          <a-col :span="10">
            <a-form-item
              label="收入归属细分">
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
              label="服务项目">
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
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import {initDictOptions} from '@/components/dict/JDictSelectUtil'

  export default {
    name: "SettleDomainModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        organs: [],
        customerContracts: [],
        customers: [],
        serverItemDicts: [],
        serverItems: "",
        departs: [],

        confirmLoading: false,
        //Form表单项
        form: this.$form.createForm(this),

        validatorRules:{
          departNo:{rules: [{ required: true, message: '请输入结算主体编码!' }]},
          departName:{rules: [{ required: true, message: '请输入结算主体名称!' }]},
          isNew:{rules: [{ required: true, message: '请输入是否是新业务（0是/1否）!' }]},
          newRemark:{rules: [{ required: true, message: '请输入新业务备注!' }]},
          createUser:{rules: [{ required: true, message: '请输入创建人!' }]},
          deleteFlag:{rules: [{ required: true, message: '请输入是否删除（0否/1是）!' }]},
          dpAuditFlag:{rules: [{ required: true, message: '请输入服务审核标识（0是通过，1是不通过，2待审核，3待提交）默认3!' }]},
          belongContract:{rules: [{ required: true, message: '请输入合同主体!' }]},
          serverItem:{rules: [{ required: true, message: '请输入服务项目!' }]},
          incomeBelong:{rules: [{ required: true, message: '请输入收入归属!' }]},
          customerId:{rules: [{ required: true, message: '请输入所属客户!' }]},
        },
        url: {
          add: "/hrBase/tsettledomain",
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
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.belongContractChange(this.model.belongContract);
        this.getIncomeBelongSub(this.model.incomeBelong);
        if(this.model.serverItem != null && this.model.serverItem.indexOf(",") >= 0) {
          this.model.serverItem = this.model.serverItem.split(",");
        }
        this.visible = true;
        this.model.incomeBelong = Number(this.model.incomeBelong)
        if(this.model.incomeBelongSub != null) {
          this.model.incomeBelongSub = Number(this.model.incomeBelongSub)
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'departName','belongContract','serverItem','incomeBelong','incomeBelongSub','customerId'))
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            let msg = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
              msg = '添加成功!';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
               msg = '修改成功!';
            }
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

            httpAction(httpurl,formData,method).then((res)=>{
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
        })
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
              this.form.setFieldsValue(pick(this.model,'customerId'))
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
      getIncomeBelongSub(value) {
        this.departs = [];
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
    }
  }
</script>

<style scoped>

</style>