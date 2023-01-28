<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="inline" class="ant-advanced-search-form">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="服务客服">
              <a-select
                placeholder="请选择服务客服"
                optionFilterProp="children"
                mode="multiple"
                :allowClear="true"
                style="width:300px"
                @change="customerServiceChange"
                :maxTagTextLength="50"
                v-decorator="['customerServiceIds', validatorRules.customerServiceIds ]"
              >
                <a-select-option
                  v-for="(item, index) in customerServiceUsers"
                  :key="index"
                  :value="item.user_id"
                >{{ item.nickname }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="责任部门">
              <a-select
                showSearch
                placeholder="请选择责任部门"
                optionFilterProp="children"
                style="width:300px"
                @change="customerDepartChange"
                :dropdownMatchSelectWidth="false"
                v-decorator="['customerDepartIds', validatorRules.customerDepartIds ]"
              >
                <a-select-option
                  v-for="(item, index) in newOrganAll"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.organName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider />
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="姓名">
              <a-input placeholder="请输入姓名" style="width:300px" v-decorator="['name', validatorRules.name ]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="岗位">
              <a-input placeholder="请输入岗位" style="width:300px" v-decorator="['stations', {}]" />
            </a-form-item>
          </a-col>
        </a-row>
        

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="手机">
              <a-input placeholder="请输入手机" style="width:300px" v-decorator="['phone', validatorRules.phone ]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="电话">
              <a-input placeholder="请输入电话" style="width:300px" v-decorator="['tel', {} ]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="邮寄地址">
              <a-input placeholder="请输入邮寄地址" style="width:300px" v-decorator="['address', {} ]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="邮箱">
              <a-input placeholder="请输入邮箱" style="width:300px" v-decorator="['email', validatorRules.email ]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="QQ">
              <a-input placeholder="请输入QQ" style="width:300px" v-decorator="['qq', validatorRules.qq]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="传真">
              <a-input placeholder="请输入传真" style="width:300px" v-decorator="['rax', validatorRules.rax ]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="备注">
              <a-input placeholder="请输入备注" style="width:300px" v-decorator="['remark', {}]" />
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
    name: "DockingPeopleModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        settleDomain: {},
        customerServiceUsers: [], // 服务客服
        confirmLoading: false,
        //Form表单项
        form: this.$form.createForm(this),
        customerServiceObj:{},
        customerDepartObj:{},
        organAll:[],
        newOrganAll:[],

        validatorRules:{
          name:{rules: [{ required: true, message: '请输入姓名!' }]},
          phone:{rules: [{ validator: this.validatePhone }]},
          tel:{rules: [{ validator: this.validateTel }]},
          email:{rules: [{ validator: this.validateEmail }]},
          qq:{rules: [{ validator: this.validateNum }]},
          rax:{rules: [{ validator: this.validateRax }]},
          customerServiceIds:{rules:[{required: true, message: '请选择服务客服!'}]},
          customerDepartIds:{rules:[{required: true, message: '请选择责任部门!'}]},
        },
        url: {
          add: '/hrBase/tdepartdockingpeople',
          edit: "/hrBase/tdepartdockingpeople",
          getDockingPeople: "/hrBase/tdepartdockingpeople/getList/",
          getCustomerServiceUsers: '/admin/user/getUserByRoleNameAndClient',
        },
      }
    },
    methods: {
      add (record) {
        if(record.id != null) {
          httpAction(this.url.getDockingPeople + record.id, null, "GET").then((res) => {
            if(res.code == 200 && res.data.length > 0) {
              this.edit(res.data[0],record)
            } else {
              this.edit({},record)
            }
          });
        }
      },
      edit (pojo,record) {
        this.loadCustomerServiceUsers();
        this.form.resetFields();
        this.settleDomain = Object.assign({}, record);
        this.model = Object.assign({}, pojo);
        this.model.customerServiceIds = (this.model.customerService) ? this.model.customerService.split(',') : []
        this.model.customerDepartIds = (this.model.customerDepart) ? this.model.customerDepart.split(',') : []
        this.handleOldData(this.model.customerDepartIds)
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'name','stations','phone','tel','email','qq','rax','remark','customerServiceIds','customerDepartIds', 'address'))
        });
      },
      handleOldData(arr){
        const _this = this
        arr.forEach(item=>{
          const res = _this.newOrganAll.find(items=>String(items.id) === String(item))
          if(!res){
            const element = _this.organAll.find(items=>String(items.id) === String(item))
            _this.newOrganAll.push(element)
          }
        })
      },
      customerServiceChange(value, option){
        this.customerServiceObj.customerService = value.join(',')
        const temp = []
        for(const item of option){
          temp.push(this.customerServiceUsers[item.data.key]['nickname'])
        }
        this.customerServiceObj.customerServerName = temp.join(',')
      },
      customerDepartChange(value, option){
        this.customerDepartObj.customerDepart = value
        this.customerDepartObj.customerDepartName = option.componentOptions.children[0].text
      },
      loadCustomerServiceUsers() {
        this.customerServiceUsers = [];
        httpAction(`${this.url.getCustomerServiceUsers}?clienId=wxhr`, null, 'GET').then((res) => {
          if(res.code === 200 && res.data.length > 0) {
            for(let i = 0; i < res.data.length; i++) {
              res.data[i].user_id = String(res.data[i].user_id);
              this.customerServiceUsers.push(res.data[i]);
            }
          }
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.newOrganAll = []
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            let msg = "";
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
              msg = "添加成功！";
            }else{
              httpurl+=this.url.edit;
              method = 'put';
              msg = "修改成功！";
            }
            // delete values.customerServiceIds
            // delete values.customerDepartIds
            values = Object.assign(values,this.customerDepartObj,this.customerServiceObj)
            let formData = Object.assign(this.model, values);
            if(formData.settleDomainId != null || (that.settleDomain != null && that.settleDomain.id != null)) {
              if(formData.settleDomainId == null) {
                formData.settleDomainId = that.settleDomain.id;
              }

              httpAction(httpurl,formData,method).then((res) => {
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
            } else {
              that.$message.warning('没有结算主体ID！');
            }
          }
        })
      },
      handleCancel () {
        this.close()
      },
      validatePhone(rule,value,callback) {
        if (!value || new RegExp(/^[1]([3-9])[0-9]{9}$/).test(value)) {
          callback();
        } else {
          callback("手机号码格式不正确!");
        }
      },
      validateTel(rule,value,callback) {
        if (!value || new RegExp(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/).test(value)) {
          callback();
        } else {
          callback("电话号码格式如：0551-63636363!");
        }
      },
      validateEmail(rule,value,callback) {
        // eslint-disable-next-line
        if (!value || new RegExp(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/).test(value)) {
          callback();
        } else {
          callback("邮箱格式不正确!");
        }
      },
      validateNum(rule,value,callback) {
        if (!value || new RegExp(/^\+?[1-9][0-9]*$/).test(value)){
          callback();
        }else{
          callback("只能输入数字!");
        }
      },
      validateRax(rule,value,callback) {
        if (!value || new RegExp( /^(\d{3,4}-)?\d{7,8}$/).test(value)){
          callback();
        }else{
          callback("传真格式不正确!");
        }
      },
    }
  }
</script>

<style lang="less" scoped>
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
.stepFormText {
  :global(.ant-form-item-label) {
    width: 80px;
  }
}
</style>