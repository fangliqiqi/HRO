<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    :closable="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="结算"
    :visible="visible"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="保单号"
              class="stepFormText"
            >
              <a-input
                placeholder="请输入保单号"
                style="width: 200px"
                v-decorator="['policyNo',validatorRules.policyNo]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="保费"
              class="stepFormText"
            >
              <a-input
                placeholder="请输入实际保费"
                v-decorator="['buyPay',validatorRules.buyPay]"
                style="width: 200px;margin-right:15px;"
                autocomplete="off"
              />
              购买标准：{{ model.buyStandard }}元
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item
              label="结算类型"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择结算类型"
                @select="onSelect"
                v-decorator="['settleType',validatorRules.settleType]"
                style="width: 200px"
              >
                <a-select-option
                  v-for="(item, index) in settleTypeOptions"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="发票号"
              class="stepFormText"
            >
              <a-input
                placeholder="请输入发票号"
                style="width: 200px"
                v-decorator="['invoiceNo',{ rules: [{ required: isMust, message: '请输入发票号' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="备注"
              class="stepFormText"
            >
              <a-textarea
                :rows="2"
                placeholder="请填写备注"
                v-decorator="['remark']"
                style="width: 300px;resize:none;"
              />
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
    name: 'InsuranceSettlemetModal',
    components: {
    },
    data() {
      return {
        ids: '',
        model: {},
        title: '商险结算',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        settleTypeOptions:[], //结算类型
        isMust:false, //是否必须
        validatorRules: {
          buyPay: { rules: [{ required: true, message: '请输入保费保费' },{validator: (rule,value, callback)=>{
          if(value){
            if( ! /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(value) || value < 0.01){
              callback('保费格式不正确')
            }
          }
          callback()
        }}] },
          policyNo: { rules: [{ required: true, message: '请输入保单号!' }] },
          settleType:{ rules: [{ required: true, message: '请选择结算类型!' }] },
        },
        url: {
          settementUrl: '/busiInsurance/tbusinessinsurance/settlemet', //商险结算
        }
      }
    },
    methods: {
      edit(record) {
        this.model = Object.assign({}, record)
        this.visible = true
        this.isMust = (Number(this.model.settleType) === 1) ? true :false
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({buyPay:this.model.buyPay,policyNo:this.model.policyNo,remark:this.model.remark,invoiceNo:this.model.invoiceNo,settleType:this.model.settleType}, 'buyPay', 'policyNo','invoiceNo','settleType','remark'))
        })
      },
      onSelect(val){
        this.isMust = (String(val) === '1') ? true :false
      },
      // 保存按钮
      handleOk() {
        const _this = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            _this.confirmLoading = true
            const httpurl = _this.url.settementUrl
            const method = 'put'
            values.id = _this.model.id
            values.status = 5
            httpAction(httpurl, values, method).then((res) => {
              const msg = res.msg || res.message
              if (res.code === 200) {
                this.$message.success("结算成功！")
                _this.$emit('ok')
                _this.close()
              } else {
                _this.$message.warning(msg)
              }
            }).finally(() => {
              _this.confirmLoading = false
            })
          }
        })
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.form.resetFields()
        this.$emit('close')
        this.model = {}
        this.visible = false
      }
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
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}
</style>
