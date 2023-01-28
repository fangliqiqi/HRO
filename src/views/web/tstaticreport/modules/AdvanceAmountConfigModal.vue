<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="600"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item label="年份">
              <a-date-picker
                placeholder="年份选择"
                format="YYYY"
                valueFormat="YYYY"
                mode="year"
                :open="isOpen"
                style="width:100%"
                v-decorator="['year',{initialValue:moment()},{rules: [{ required: true, message: '请选择年份!' }]}]"
                @panelChange="changMonth"
                @openChange="changeOpen"
                :allowClear="false"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="二级归属部门">
              <a-select 
                :allowClear="true"
                placeholder="请选择二级归属部门" 
                show-search 
                option-filter-prop="children" 
                @change="settleChange"
                v-decorator="['incomeBelongSubName', {rules: [{ required: true, message: '请选择二级归属部门!' }]} ]"
              >
                <a-select-option
                  v-for="item in incomeBelongSubOptions"
                  :key="item.id"
                  :value="item.organName"
                >
                  {{ item.organName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="垫付额度"
            >
              <a-input
                v-decorator="['advanceLimit', validatorRules.advanceLimit ]"
                placeholder="请输入垫付额度"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import SelectPage from '@/components/jeecg/SelectPage'
import pick from 'lodash.pick'
import { httpAction } from '@/api/manage'

export default {
  name: 'AdvanceAmountConfigModal',
  components: {
    SelectPage,
  },
  data(){
    return {
      title:'',
      visible: false,
      confirmLoading: false,
      isOpen:false,
      form: this.$form.createForm(this),
      incomeBelongSubOptions:[],
      incomeBelongSub:'',
      model:{},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      },
      validatorRules:{
        advanceLimit:{
          rules: [
              { required: true, message: ' ' },
              // { pattern: /((^[1-9]\d*)|^0)(\.\d{1,2})?$/, message: '请输入两位小数的有效数字' },
              {validator:this.advanceLimitRules}
            ]
        }
      },
      addUrl:'/hrApproval/tadvanceuseset',
      editUrl:'/hrApproval/tadvanceuseset',
    }
  },
  methods:{
    moment,
    show(){
      this.visible = true;
    },
    advanceLimitRules(rule, value, callback){
      const reg = /^(-?)[0-9]+(.[0-9]{1,2})?$/
      // /((^[1-9]\d*)|^0)(\.\d{1,2})?$/
      if (!reg.test(value) || !value) {
        callback(new Error('请输入垫付额度,两位小数的有效数字！'))
      } else if(value > 9999999999999.99){
        callback(new Error('输入的数字超过最大限制'))
      }else{
        callback()
      }
    },
    // 编辑
    edit(data){
      this.show()
      this.model = Object.assign({},data)
      this.$nextTick(()=>{
        this.form.setFieldsValue(pick({
          year:data.year,
          incomeBelongSubName:data.incomeBelongSubName,
          advanceLimit:data.advanceLimit},
           'year','incomeBelongSubName','advanceLimit'))
      })
      
    },
    // 选择年份
    changMonth(value){
      this.form.setFieldsValue(pick({year:value}, 'year'))
      this.isOpen = false
    },
    // 年份控制面板
    changeOpen(status){
      this.isOpen = status?true:false
    },
    // 选择二级归属部门
    settleChange(val){
      if(val){
        //二级归属部门的名称没有重复，所以可以使用名称
        this.model.incomeBelongSub = this.incomeBelongSubOptions.find(item=>item.organName==val)['id']
      }
    },
    
    handleOk(){
      const _this = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = {
            year:moment(values.year).format('YYYY'),
            advanceLimit:values.advanceLimit,
            incomeBelongSubName:values.incomeBelongSubName,
            incomeBelongSub:this.model.incomeBelongSub
          }
          this.confirmLoading = true;
          if(this.model.id){
            params.id = this.model.id
            console.log(params.advanceLimit);
            console.log(this.model.advanceLimitUsed);
            let allAdvanceLimitUsed = Number(this.model.advanceLimitUsed) + Number(this.model.advanceLimitUsedTemp)
            let resR = Number(params.advanceLimit) - allAdvanceLimitUsed
            if(resR>=0){
              httpAction(this.editUrl,params,'put').then(res=>{
                if(res.code === 200){
                  this.$message.success('修改成功');
                  this.handleCancel();
                  this.$emit('ok');
                  this.confirmLoading = false;
                }else{
                  this.$message.warning(res.msg);
                }
              }).finally(()=>{
                setTimeout(()=>{
                  _this.confirmLoading = false;
                },2000)
              })
            }else{
              this.$message.warning(`垫付额度必须大于已占用额度！已占用额度：${allAdvanceLimitUsed}`);
              setTimeout(()=>{
                _this.confirmLoading = false;
              },2000)
            }
              
          }else{
            httpAction(this.addUrl,params,'post').then(res=>{
              if(res.code === 200){
                this.$message.success('新增成功');
                this.handleCancel();
                this.$emit('ok');
                this.confirmLoading = false;
              }else{
                this.$message.warning(res.msg);
              }
            }).finally(()=>{
              setTimeout(()=>{
                _this.confirmLoading = false;
              },2000)
            })
          }  
        }
      })
    },
    handleCancel(){
      this.visible = false;
      this.confirmLoading = false
      this.model = {}
      this.form.resetFields()
    },
  }

}
</script>