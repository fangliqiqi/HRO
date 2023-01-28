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
          <a-col :span="24">
            <a-form-item
              label="结算主体"
              class="labelTxt"
            >
              <a-select
                showSearch
                placeholder="请选择结算主体"
                optionFilterProp="children"
                style="width: 650px"
                :disabled="true"
                v-decorator="['id', validatorRules.settleId ]"
              >
                <a-select-option
                  v-for="(item, index) in settleIds"
                  :key="index"
                  :value="item.id"
                >{{ item.departName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              label="服务客服"
              class="labelTxt"
            >
              <a-select
                showSearch
                placeholder=""
                optionFilterProp="children"
                style="width: 650px"
                mode="multiple"
                :disabled="true"
                v-decorator="['customerServiceIds']"
              >
                <a-select-option
                  v-for="(item, index) in customerServiceUsers"
                  :key="index"
                  :value="item.user_id"
                >{{ item.nickname }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              label="分配权限"
              class="labelTxt"
            >
              <a-select
                placeholder="请选择客服"
                optionFilterProp="children"
                mode="multiple"
                style="width: 650px"
                :allowClear="true"
                v-decorator="['idArray', validatorRules.idArray ]"
              >
                <a-select-option
                  v-for="(item, index) in noCustomerServiceIds"
                  :key="index"
                  :value="item.user_id"
                >{{ item.nickname }}</a-select-option>
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

  export default {
    name: "AssignationCustomerServiceModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        settleIds: [],
        customerServiceUsers: [],
        serviceUserIds: "",
        idArray: [],
        customerServiceIds:[], // 已授权客服
        noCustomerServiceIds:[], //未授权客服
        confirmLoading: false,
        //Form表单项
        form: this.$form.createForm(this),

        validatorRules:{
          settleId:{rules: [{ required: true, message: '请选择结算主体!' }]},
          idArray:{rules: [{ required: true, message: '请选择客服!' }]},
        },
        url: {
          assignationCustomerService: '/hrBase/tsettledomain/assign/customerservice',
          getCustomerServiceUsers: '/admin/user/getUserByRoleNameAndClient',
          getPermissonByTypeAndId:'/hrBase/tcutsomerdatapermisson/getPermissonByTypeAndId'
        },
      }
    },
    created () {
      this.loadCustomerServiceUsers();
    },
    methods: {
      add (record) {
        this.edit(record);
      },
      edit (record) {
        this.settleIds = [];
        this.idArray = [];
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.serviceUserIds = this.model.customerService;

        let obj = {};
        obj.id = this.model.id;
        obj.departName = this.model.departName;
        this.settleIds.push(obj);
        this.model.idArray = []
        httpAction(`${this.url.getPermissonByTypeAndId}?id=${this.model.id}`,null,'GET').then((res)=>{
          if(res.code === 200){
            this.customerServiceIds = []
            for(const item of res.data){
              if(String(item.isCustomerService) === '0'){
                this.customerServiceIds.push(item.bePermissonUser)
              }else{
                this.model.idArray.push(item.bePermissonUser)
              }
            }
            
            this.visible = true
            this.model.customerServiceIds = this.customerServiceIds
            this.noCustomerServiceIds = this.cutArr(this.customerServiceUsers,this.customerServiceIds)
            console.log(this.model.idArray)
          }else{
            this.$message.warning(res.msg)
          }
        }).finally(()=>{
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model,'id','idArray','customerServiceIds'))
          })
        })

      },
      // 删除数组中指定元素
      cutArr(arr,del){
        return arr.filter(item=>{
          return del.indexOf(item.user_id) === -1
        })
      },
      close () {
        this.$emit('close');
        this.noCustomerServiceIds = []
        this.model = {}
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            const url = `${this.url.assignationCustomerService}?idArray=${values.idArray.join(',')}&settleId=${values.id}`;
            httpAction(url,{},'POST').then((res)=>{
              if(res.code == 200){
                that.$message.success('分配成功!');
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
      loadCustomerServiceUsers() {
        this.customerServiceUsers = [];
        httpAction(this.url.getCustomerServiceUsers + "?clienId=wxhr", null, 'GET').then((res) => {
          if(res.code == 200 && res.data.length > 0) {
            for(let i = 0; i < res.data.length; i++) {
              res.data[i].user_id = String(res.data[i].user_id);
              this.customerServiceUsers.push(res.data[i]);
            }
          }
        })
      },
      customerServiceChange(value) {
        this.serviceUserIds = "";
        if(value != null && value.length > 0) {
          for(let i = 0; i < value.length; i++) {
            if(i == value.length - 1) {
              this.serviceUserIds += value[i];
            } else {
              this.serviceUserIds += value[i] + ",";
            }
          }
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .labelTxt {
    :global(.ant-form-item-label) {
      width: 80px;
      text-align: right;
    }
  }
</style>