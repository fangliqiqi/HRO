<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="保存"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirm-loading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <h4>全部数据</h4>
            <a-form-item>
              <a-checkbox v-decorator="['all']" @change="selectAll" :defaultChecked="disabledFlag">全部</a-checkbox>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <h4>客户类型</h4>
            <a-form-item>
              <a-checkbox-group v-decorator="['customerType']" :disabled="disabledFlag">
                <a-col :span="6" v-for="item in customerTypeOptions" :key="item.id">
                  <a-checkbox :value="String(item.value)">
                    {{ item.label }}
                  </a-checkbox>
                </a-col>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <h4>业务类型</h4>
            <a-form-item>
              <a-checkbox-group v-decorator="['businessType']" :disabled="disabledFlag">
                <a-col :span="8" v-for="item in businessTypeOptions" :key="item.id" style="margin-bottom:10px;">
                  <a-checkbox :value="String(item.id)">
                    {{ item.label }}
                  </a-checkbox>
                </a-col>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <h4>开发部门/分公司</h4>
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择开发部门/分公司"
                optionFilterProp="children"
                style="width: 810px"
                :disabled="disabledFlag"
                mode="multiple"
                :dropdownMatchSelectWidth="false"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                v-decorator="['businessDeveloperOrgan']"
              >
                <a-select-option
                  v-for="(item, index) in organs"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.organName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>

  </a-modal>
</template>

<script>
import SelectPage from '@/components/jeecg/SelectPage'
import pick from 'lodash.pick'
import { httpAction } from '@/api/manage'

export default {
  name: 'UserAuthorityRulesModal',
  components:{
    SelectPage
  },
  data() {
    return {
      title: '地区授权',
      visible: false,
      confirmLoading: false,
      model:{},
      form: this.$form.createForm(this),
      customerTypeOptions:[
        {
          label:'集团客户',
          value:0
        },
        {
          label:'重点客户',
          value:1
        },
        {
          label:'一般客户',
          value:2
        },
        {
          label:'电信客户',
          value:3
        }
      ],
      businessTypeOptions:[],
      organs:[],
      disabledFlag:false,
      uid:'',
      url: {
        submit:'/hrBase/muserauthres',
        getAuth:'/hrBase/muserauthres/getByUserId',
      }
    }
  },
  methods: {
    show(record,uid) {
      this.model = record
      this.uid = uid
      this.visible = true
      if(record){
        // 全部
        if(String(record.type) === '0'){
          this.disabledFlag = true
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({customerType:[],businessType:[],businessDeveloperOrgan:undefined}, 'customerType','businessType','businessDeveloperOrgan'))
          })
        }else{
          this.disabledFlag = false
          const arr = record.type.match(/\d/g)
           this.$nextTick(() => {
            if(arr.indexOf('1') > -1 && record.type >-1){
              this.form.setFieldsValue(pick({customerType:record.customerType.split(',')}, 'customerType'))  
            }
            if(arr.indexOf('2') > -1){
              this.form.setFieldsValue(pick({businessDeveloperOrgan:record.businessDeveloperOrgan.split(',')}, 'businessDeveloperOrgan'))  
            }
            if(arr.indexOf('3') > -1){
              this.form.setFieldsValue(pick({businessType:record.businessType.split(',')}, 'businessType'))  
            }

          })
          
        }
      }
    },
    selectAll(e){
      if(e.target.checked){
        this.disabledFlag = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({customerType:[],businessType:[],businessDeveloperOrgan:undefined}, 'customerType','businessType','businessDeveloperOrgan'))
        })
      }else{
        this.disabledFlag = false
      }
    },
    handleOk(){
      this.form.validateFields((err,values) => {
        if (!err) {
          let params = {type:'',userId:this.uid}
          if(this.model){
            params.id = this.model.id
          }
          if(values.all){
            params.type = 0
          }else{
            if(values.customerType && values.customerType.length){
              params.customerType = values.customerType.join(',')
              params.type = '1'
            }
            if(values.businessDeveloperOrgan && values.businessDeveloperOrgan.length){
              params.businessDeveloperOrgan = values.businessDeveloperOrgan.join(',')
              params.type = params.type + '2'
            }
            if(values.businessType && values.businessType.length){
              params.businessType = values.businessType.join(',')
              params.type = params.type + '3'
            }
            if(!params.type){
              params.type = -1
            }
            
          }
          this.confirmLoading = true
          httpAction(this.url.submit, params, 'post').then((res) => {
            if(res.code == 200){
              this.$message.success("保存成功！")
              this.handleCancel()
              this.$emit('ok')
            }else{
              this.$message.warning(res.msg)
            }
          }).finally(()=>{
            this.confirmLoading = false
          })
        }
      });
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.visible = false
      this.disabledFlag = false
      this.model = {}
      this.form.resetFields()
    },
  }
}
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
h4{
  font-weight: bold;
}
.stepFormLabel {
  :global(.ant-form-item-label) {
    width: 80px;
  }
}
</style>