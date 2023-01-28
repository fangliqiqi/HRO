<template>
  <a-modal
    title="添加自定义项"
    :width="800"
    @cancel="handleCancel()"
    @ok="handleOk()"
    cancelText="取消"
    okText="保存"
    :visible="visible"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form
        :form="form"
        class="ant-disabled-form"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="项目说明"
              class="stepFormText"
            >
              <a-input
                maxLength="20"
                placeholder="请输入项目说明"
                v-decorator="['subName',{rules: [{ required: true, message: '请输入项目说明!' }]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="金额"
              class="stepFormText">
              <a-input
                placeholder="请填写金额"
                @change="changeMoney"
                v-decorator="['money',{rules: [{ required: true, message: '请填写金额!' },{ validator: this.isNumber }]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="增值税"
              class="stepFormText">
              <a-input
                placeholder="请填写增值税"
                @change="changeTax"
                addonAfter="%"
                v-decorator="['tax',{rules: [{ required: true, message: '请填写增值税!' },{ validator: this.isTax }]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="开票金额小计"
              class="stepFormText">
              <a-input
                disabled
                placeholder=""
                :value="invoiceMoneyTotal"
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
export default {
  data() {
    return {
      visible: false, // 是否可见
      spinning: false, // 加载状态
      form: this.$form.createForm(this), // 表单
      money: '', // 记录输入的金额
      taxRate: '', // 记录输入的税率
      invoiceMoneyTotal: '', // 开票金额合计
      forecastBillId: '', // 传入的预估结算单ID
      url: {
        addCustomItem: '/hrSocial/tforecastbillsub/addSub' // 新增自定义项
      }
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    // 关闭
    handleCancel() {
      this.form.resetFields()
      this.money = '' // 记录输入的金额
      this.taxRate = '' // 记录输入的税率
      this.invoiceMoneyTotal = '' // 开票金额合计
      this.forecastBillId = ''
      this.visible = false
    },
    // 金额输入Change
    changeMoney(e) {
      const value = e.target.value
      this.isNumber('', value, error => {
        if (!error) {
          this.money = value || ''
          this.caculateTotalMoney()
        }
      })
    },
    // 增值税填写
    changeTax(e) {
      const value = e.target.value
      this.isTax('', value, error => {
        if (!error) {
          this.taxRate = value || ''
          this.caculateTotalMoney()
        }
      })
    },
    // 计算开票金额合计
    caculateTotalMoney() {
      const money = parseFloat(this.money || '0')
      const tax = parseFloat(this.taxRate || '0')
      const taxMoney = parseFloat(money * (tax / 100)).toFixed(2)
      this.invoiceMoneyTotal = parseFloat(parseFloat(taxMoney) + parseFloat(money)).toFixed(2)
    },
    // 验证数字
    isNumber(rule, value, callback) {
      const reg = /^(-?)[0-9]+(.[0-9]{1,2})?$/
      if (!reg.test(value) && String(value) !== '') {
        callback(new Error('请输入正确的金额'))
      } else {
        callback()
      }
    },
    // 验证税率
    isTax(rule, value, callback) {
      const reg = /^[0-9]+(.[0-9]{1,2})?$/
      if (!reg.test(value) && String(value) !== '') {
        callback(new Error('请输入正确的税率'))
      } else {
        if (value < 0 || value > 100) {
          callback(new Error('税率要在0-100'))
        } else {
          callback()
        }
      }
    },
    // 保存
    handleOk() {
      const that = this
      this.form.validateFields((error, values) => {
        if (!error) {
          const money = values.money || '0'
          const tax = values.tax || '0'
          const taxMoney = parseFloat(parseFloat(money) * (parseFloat(tax) / 100)).toFixed(2)
          const formData = {
            forecastBillId: that.forecastBillId,
            subName: values.subName || '',
            money: money,
            tax: taxMoney,
            ticket: that.invoiceMoneyTotal
          }
          httpAction(that.url.addCustomItem, formData, 'POST').then(res => {
            if (Number(res.code) === 200) {
              that.$emit('ok', res.data)
              that.$message.success('保存成功')
              that.handleCancel()
            } else {
              that.$message.error(res.msg || '添加自定义项失败！')
            }
          })
        }
      })
    }
  }
}
</script>
