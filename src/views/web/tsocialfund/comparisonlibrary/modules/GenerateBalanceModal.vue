<template>
  <a-modal
    :title="title"
    :width="500"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
    :maskClosable="false"
    :destroyOnClose="false"
    :confirmLoading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item label="单位名称">
              <select-page
                :id="'id'"
                :title="'customerName'"
                style="width:300px"
                :triggerChange="true"
                placeholder="请选择单位名称查询"
                v-decorator="['unitId', validate.unitId]"
                :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
                @select="handleSelect"
              ></select-page>
              <a-input type="hidden" v-decorator="['unitName']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="结算主体">
              <a-select
                allowClear
                showSearch
                mode="multiple"
                optionFilterProp="children"
                placeholder="请选择结算主体"
                v-decorator="['settleDomainIds', validate.settleDomainIds]"
                :dropdownMatchSelectWidth="false"
                :labelInValue="true"
                :maxTagCount="10"
                @change="changeSettle"
                style="width: 300px"
              >
                <a-select-option
                  v-for="(value,key) in departSettle"
                  :key="key"
                  :value="value.id"
                >{{ value.departName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-checkbox-group
                @change="onCheckBoxChange"
                :disabled="settleDomainDisabled"
                v-decorator="['checked', {}]"
              >
                <a-checkbox value="1" :indeterminate="indeterminate">全选</a-checkbox>
              </a-checkbox-group>      
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="生成月份">
              <a-month-picker
                placeholder="生成月份"
                format="YYYYMM"
                style="width:300px"
                v-decorator="['createMonth', validate.createMonth]"
              />
            </a-form-item>
          </a-col>
          <!-- :disabled-date="disabledDate" -->
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'GenerateBalanceModal',
    props: {
      title:{
        type: String,
        default: '操作',
        required: false
      },
    },
    components: {
      SelectPage
    },
    data() {
      return {
        model: {},
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        settleDomainDisabled:true,
        indeterminate:false,
        validate:{
          unitId: {rules: [{ required: true, message: '请选择客户单位！' }]},
          settleDomainIds: {rules: [{ required: true, message: '请选择结算主体！' }]},
          createMonth: {rules: [{ required: true, message: '请选择生成月份！' }]},
        },
        url: {
          exportXlsUrl: '', // 导出地址
        },
        departSettle: [],//结算主题

      }
    },
    methods: {
      show(){
        this.visible = true
      },
      disabledDate(current) {
        return current && current > moment().endOf('day')
      },
      handleSelect(val,option){
        const customerName = option['context']['lists'][option.key]['title']
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({unitId:val,settleDomainIds:undefined,unitName:customerName,checked:[]}, 'unitId','settleDomainIds','unitName','checked'))
        })
        httpAction(`hrBase/tsettledomain/page?size=100&customerId=${val}`,null,'get').then(res=>{
          if(res.code === 200){
            this.departSettle = res.data.records
            this.settleDomainDisabled = res.data.records.length>0?false:true
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      // 结算主体选择
      changeSettle(value){
        if(value.length==0){
          this.$nextTick(() => {
            this.indeterminate = false
            this.form.setFieldsValue(pick({checked:[]},'checked'))
          })
        }else if(value.length < this.departSettle.length){
          this.indeterminate = true
        }else{
          this.$nextTick(() => {
            this.indeterminate = false
            this.form.setFieldsValue(pick({checked:['1']},'checked'))
          })
        }
      },
      // 全选功能
      onCheckBoxChange(checked) {
        if (checked.length === 1) {  // 全选
          let settleDomainOptions = []
          for (const item of this.departSettle) {
            settleDomainOptions.push({key:item.id,label:item.departName})
          }
          this.$nextTick(() => {
            this.indeterminate = false
            this.form.setFieldsValue(pick({settleDomainIds: settleDomainOptions}, 'settleDomainIds'))
          })
        } else {
          this.$nextTick(() => {
            this.indeterminate = false
            this.form.setFieldsValue(pick({settleDomainIds: []}, 'settleDomainIds'))
          })
        }
      },

      // 保存按钮
      handleOk() {
        const qs = require('qs')
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            const settleDomainIds = []
            const departNames = []
            values.settleDomainIds.forEach(item=>{
              settleDomainIds.push(item.key)
              departNames.push(item.label)
            })
            const params = {
              settleDomainIds: settleDomainIds.join(','),
              departNames: departNames.join(','),
              unitId: values.unitId,
              unitName: values.unitName,
              createMonth:values.createMonth.format('YYYYMM')
            } 
            httpAction('/hrSocial/tbalanceforminfo/createAndSaveFormByVo',params,'post').then(res=>{
              if(res.code === 200){
                this.handleCancel()
                this.$message.success('生成成功！')
                this.$emit('ok')
              }else{
                this.$message.warning(res.msg)
              }
            }).finally(()=>{
              this.confirmLoading = false
            })
          }
        })
      },
      // 表单关闭
      handleCancel() {
        this.form.resetFields()
        this.close()
      },
      // 数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.settleDomainDisabled = true
        this.confirmLoading = false
      },
    }
  }
</script>

<style lang="less" scoped>
  .form{
    width: 500px;
    margin:0 auto;
    .ant-form-item {
      margin-bottom: 30px;
    }
  }
</style>
