<template>
  <a-modal
    :title="title"
    :width="750"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >确定</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="单位名称"
              class="stepFormText"
            >
              <select-page
                placeholder="请选择单位"
                style="width: 200px"
                v-decorator="['unitId']"
                :searchUrl="'/hrBase/customerBusiness/customerInfo/getCustomerOwnerPage?customerName='"
                :title="'customerName'"
                :allowClear="false"
                @select="handleUnitChange"
                :id="'customerId'"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="结算主体"
              class="stepFormText"
            >
              <a-select
                style="width: 200px"
                placeholder="请选择结算主体"
                :disabled="settleDomainDisabled"
                :dropdownMatchSelectWidth="false"
                v-decorator="['settleDomainId', {rules: [{ required: true, message: '请选择结算主体！' }]}]"
              >
                <a-select-option
                  v-for="(value, key) in settleDomainBelongs"
                  :key="key"
                  :value="value.id"
                >{{ value.departName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item
              label="结算月份"
              class="stepFormText"
            >
              <a-month-picker
                style="width: 200px"
                placeholder="请选择结算月份"
                v-decorator="['settleMonth', {rules: [{ required: true, message: '请选择结算月份！' }]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="管理费"
              class="stepFormText"
            >
              <a-input
                style="width: 200px"
                placeholder="请输入管理费"
                v-decorator="['manageFee', validatorRules.manageFee]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item
              label="服务人数"
              class="stepFormText"
            >
              <a-input
                style="width: 200px"
                placeholder="请输入服务人数"
                v-decorator="['peopleNum', validatorRules.peopleNum]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="服务人次"
              class="stepFormText"
            >
              <a-input
                style="width: 200px"
                placeholder="请输入服务人次"
                v-decorator="['servicePeople', validatorRules.servicePeople]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item
              label="发票类型"
              class="stepFormText"
            >
              <a-select
                style="width: 200px"
                placeholder="请选择发票类型"
                :dropdownMatchSelectWidth="false"
                v-decorator="['invoiceType', {}]"
              >
                <a-select-option
                  v-for="(value, key) in invoiceTypeOptions"
                  :key="key"
                  :value="key"
                >{{ value.option }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="扣除金额"
              class="stepFormText"
            >
              <a-input
                style="width: 200px"
                placeholder="请输入扣除金额"
                v-decorator="['reduceMoney', validatorRules.reduceMoney]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item
              label="不含税收入"
              class="stepFormText"
            >
              <a-input
                style="width: 200px"
                placeholder="请输入不含税收入"
                v-decorator="['incomeNoTax', validatorRules.incomeNoTax]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="税额"
              class="stepFormText"
            >
              <a-input
                style="width: 200px"
                placeholder="请输入税额"
                v-decorator="['invoiceTax', validatorRules.invoiceTax]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'BillApplyModal',
    components: {
      SelectPage
    },
    data() {
      return {
        model: {},
        title: '操作',
        loading:false,
        visible: false,
        dateFormat: 'YYYYMM', // 时间格式化
        confirmLoading: false,
        settleDomainDisabled: true,
        form: this.$form.createForm(this),
        invoiceTypeOptions: {}, // 发票类型
        settleDomainBelongs: [], // 结算主体
        validatorRules: {
          manageFee: { rules: [{ required: true, message: '请输入管理费！' }, { validator: this.validateManageFee }] },
          peopleNum: { rules: [{ required: true, message: '请输入服务人数！' }, { validator: this.validatePeopleNum }] },
          servicePeople: { rules: [{ required: true, message: '请输入服务人次！' }, { validator: this.validateServicePeople }] },
          reduceMoney: { rules: [{ validator: this.validateReduceMoney }] },
          incomeNoTax: { rules: [{ validator: this.validateIncomeNoTax }] },
          invoiceTax: { rules: [{ validator: this.validateInvoiceTax }] },
        },
        url: {
          add: 'hrSocial/tforecastoneselfform/addForecastOneselfSettle',
        },
      }
    },

    methods: {
      add() {
        this.edit({})
      },

      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
      },

      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.loading = true
            that.confirmLoading = true
            let httpurl = ''
            let method = 'post'
            let formData = Object.assign(this.model, values)
            httpurl += this.url.add
            formData.settleMonth = formData.settleMonth ? formData.settleMonth.format(this.dateFormat) : null
            if (formData.unitId) {
              httpurl += `?unitId=${formData.unitId}`
            }
            if (formData.settleDomainId) {
              httpurl += `&settleDomainId=${formData.settleDomainId}`
            }
            if (formData.settleMonth) {
              httpurl += `&settleMonth=${formData.settleMonth}`
            }
            if (formData.manageFee) {
              httpurl += `&manageFee=${formData.manageFee}`
            }
            if (formData.peopleNum) {
              httpurl += `&peopleNum=${formData.peopleNum}`
            }
            if (formData.servicePeople) {
              httpurl += `&servicePeople=${formData.servicePeople}`
            }
            if (formData.invoiceType) {
              httpurl += `&invoiceType=${formData.invoiceType}`
            }
            if (formData.reduceMoney) {
              httpurl += `&reduceMoney=${formData.reduceMoney}`
            }
            if (formData.incomeNoTax) {
              httpurl += `&incomeNoTax=${formData.incomeNoTax}`
            }
            if (formData.invoiceTax) {
              httpurl += `&invoiceTax=${formData.invoiceTax}`
            }
            httpAction(httpurl, {}, method).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.msg || res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.loading = false
            })
          }
        })
      },

      // 关闭功能
      handleCancel() {
        this.close()
      },

      // 表单关闭与数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.settleDomainDisabled = true
        this.settleDomainBelongs = [] // 结算主体
      },

      // 单位选择变化
      handleUnitChange(value) {
        this.$nextTick(() => {
          let unitId = undefined
          this.settleDomainBelongs = []
          if(value){
            unitId = value
            httpAction(`/hrBase/customerBusiness/customerInfo/getSettleDomain/${value}`, {}, 'get').then((res) => {
              if(res.code === 200){
                this.settleDomainDisabled = false
                this.settleDomainBelongs = res.data
              }
            })
          }
          this.form.setFieldsValue(pick({unitId: unitId,settleDomainId:undefined}, 'unitId','settleDomainId'))
        })
      },

      /******************************************* 验证规则 *******************************************/
      // 管理费验证
      validateManageFee(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) {
          callback('请输入最多两位有效数字！')
          return false
        }
        callback()
      },

      // 服务人数验证
      validatePeopleNum(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/((^[1-9]\d*)|^0)$/).test(value)) {
          callback('请输入整数！')
          return false
        }
        callback()
      },

      // 服务人次验证
      validateServicePeople(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/((^[1-9]\d*)|^0)$/).test(value)) {
          callback('请输入整数！')
          return false
        }
        callback()
      },

      // 扣除金额验证
      validateReduceMoney(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) {
          callback('请输入最多两位有效数字！')
          return false
        }
        callback()
      },

      // 不含税收入验证
      validateIncomeNoTax(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) {
          callback('请输入最多两位有效数字！')
          return false
        }
        callback()
      },

      // 税额验证
      validateInvoiceTax(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) {
          callback('请输入最多两位有效数字！')
          return false
        }
        callback()
      },
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 80px;
  }
}
</style>
