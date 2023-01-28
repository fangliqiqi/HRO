<template>
  <a-modal
    :title="title"
    :width="800"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
      <a-button
        v-if="addButton"
        key="handleOk"
        type="primary"
        :loading="confirmLoading"
        @click="handleOk('addConfirm')"
      >确定入账</a-button>
      <a-button
        v-if="addButton"
        key="handleRelease"
        type="primary"
        :loading="confirmLoading"
        style="background-color: blueviolet; border-color: blueviolet;"
        @click="handleOk('addRelease')"
      >入账并发布认领</a-button>
      <a-button
        v-if="editButton"
        key="handleOk"
        type="primary"
        :loading="confirmLoading"
        @click="handleOk('editConfirm')"
      >保存</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form ant-disabled-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="来款单位"
              class="stepFormText"
            >
              <a-input
                :disabled="disabledStyle"
                placeholder="请输入来款单位"
                v-decorator="['incomeUnit', validatorRules.incomeUnit]"
                style="width: 250px"
                @blur="incomUnitBlur"
              />
            </a-form-item>
            <a-form-item
              label="银行账号"
              class="stepFormText"
            >
              <a-input
                :disabled="disabledStyle"
                placeholder="请输入银行账号"
                v-decorator="['incomeBank', validatorRules.incomeBank]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="到款单位"
              class="stepFormText"
            >
              <a-select
                placeholder="请选择到款单位"
                style="width: 250px"
                :disabled="disabledStyle"
                showSearch
                optionFilterProp="children"
                :dropdownMatchSelectWidth="false"
                @change="changeUnit"
                v-decorator="['paymentUnit', validatorRules.paymentUnit]"
              >
                <a-select-option
                  v-for="(item,index) in paymentUnitOption"
                  :key="index"
                  :value="String(item.value)"
                >{{ item.label }}</a-select-option>
              </a-select>
              <a-input type="hidden" v-decorator="['paymentUnitName']"/>
            </a-form-item>
            <a-form-item
              label="入账金额"
              class="stepFormText"
            >
              <a-input
                :disabled="disabledStyle"
                @change="changeIncomFee"
                placeholder="请输入入账金额"
                v-decorator="['incomeFee', validatorRules.incomeFee]"
                style="width: 250px"
                @blur="incomFeeBlur"
              />
            </a-form-item>
            <a-form-item
              label="入账时间"
              class="stepFormText"
            >
              <a-date-picker
                :disabled="disabledStyle"
                :disabledDate="disabledIncomeDate"
                placeholder="请选择入账时间"
                v-decorator="['incomeDate', validatorRules.incomeDate]"
                style="width: 250px"
                @change="incomDateChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="财务备注"
              class="stepFormText"
            >
              <a-textarea
                :disabled="disabledStyle"
                :rows="2"
                placeholder="请输入财务备注"
                v-decorator="['remark', {rules:[{max:200,message:'最多不超过200个字符!'}]}]"
                style="width: 450px"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div v-if="repeatDataMsg" class="tipText"><span>！</span>{{ repeatDataMsg }}</div>
    </a-spin>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'AccountEntryAddModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        addButton: true, // 添加按钮
        editButton: false, // 编辑按钮
        disabledStyle: false, // 禁止
        confirmLoading: false,
        form: this.$form.createForm(this),
        dateFormat: "YYYY-MM-DD",
        incomUnit:'', // 来款单位
        incomMoney:'', // 入账金额
        repeatDataMsg:'', // 重复数据提示文字
        incomDate:moment(new Date(), this.dateFormat), // 入账时间
        validatorRules: {
          incomeUnit: {rules: [{ required: true, message: '请输入来款单位！' },{max:100,message:'最多不超过100个字符!'}]},
          paymentUnit: {rules: [{ required: true, message: '请选择到款单位！' }]},
          incomeBank: {rules: [{ validator: this.validatIncomeBank }]},
          incomeFee: {rules: [{ required: true, message: '请输入入账金额！' }, { pattern:/^((-?[1-9][0-9]{0,10})|((-?[0]\.\d{1,2}|-?[1-9][0-9]{0,8}\.\d{1,2}|-?[1-9][0-9]{0,9}\.\d)))$/,message: '请输入正确的入账金额!' }]},
          incomeDate: {initialValue: moment(new Date(), this.dateFormat), rules: [{ required: true, message: '请选择入账时间！' }]},
        },
        url: {
          addConfirm: 'salary/tincome/confirm',
          addRelease: 'salary/tincome/saveAndRelease',
          editConfirm: 'salary/tincome',
          validUrl:'salary/tincome/count', // 校验所填数据是否存在重复数据
        },
        paymentUnitOption:[]
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
        if (this.model.id) {  // 编辑
          this.model.incomeDate = !this.model.incomeDate ? null : moment(this.model.incomeDate, this.dateFormat)
          const paymentUnitName = this.paymentUnitOption.find(item=>item.value == this.model.paymentUnit)
          if(paymentUnitName){
            this.model.paymentUnitName = paymentUnitName['label']
          }
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'incomeUnit', 'incomeBank', 'incomeFee', 'incomeDate', 'remark','paymentUnit','paymentUnitName'))
          })
        }
      },
      changeUnit(val,option){
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({paymentUnitName:option.context.paymentUnitOption[option.key].label }, 'paymentUnitName'))
        })
      },
      // 保存按钮
      handleOk(type) {
        const that = this
        that.confirmLoading = true
        setTimeout(function () {  // 延迟执行，防止多次提交
          // 触发表单验证
          that.form.validateFields((err, values) => {
            if (!err) {
              let httpurl = ''
              let method = 'post'
              // 身份证有效期格式转换
              values.incomeDate = values.incomeDate ? `${values.incomeDate.format(that.dateFormat)} 00:00:00` : null
              const formData = Object.assign(that.model, values)
              if (String(type) === 'addConfirm') {  // 确定入账
                httpurl += that.url.addConfirm
              } else if (String(type) === 'addRelease') {  // 入账并发布认领
                httpurl += that.url.addRelease
              } else if (String(type) === 'editConfirm') {  // 编辑
                httpurl += that.url.editConfirm
                method = 'PUT'
              }
              httpAction(httpurl, formData, method).then((res) => {
                if (Number(res.code) === 200) {
                  that.$message.success(`${that.title}成功！`)
                  that.$emit('ok')
                  that.close()
                } else {
                  that.$message.warning(res.msg || res.message)
                }
              }).finally(() => {
                that.confirmLoading = false
              })
            } else {
              that.confirmLoading = false
            }
          })
        }, 500)
      },
      // 关闭功能
      handleCancel() {
        this.close()
      },
      // 表单关闭与数据重置
      close() {
        this.$emit('close')
        this.addButton = true // 添加按钮
        this.editButton = false // 编辑按钮
        this.confirmLoading = false
        this.disabledStyle = false // 禁止
        this.incomUnit = '' // 来款单位
        this.incomMoney = '' // 入账金额
        this.repeatDataMsg = '' // 重复数据提示文字
        this.incomDate = moment(new Date(), this.dateFormat) // 入账时间
        this.visible = false
      },
      /******************************************* 验证规则 *******************************************/
      // 银行账号验证
      validatIncomeBank(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/^([0-9]{1})(\d{9,24})$/).test(value)) {
          callback('银行账号必须为10到25位数字！')
          return false
        }
        callback()
      },
      // 入账金额验证
      validatIncomeFee(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          callback('输入两位小数！')
          return false
        }
        callback()
        return true
      },
      // 入账时间（当前及之前）
      disabledIncomeDate(current) {
        return current && current > moment().endOf('day')
      },
      //替换入账金额,
      changeIncomFee(e){
        /* eslint-disable */
        let incomeFee = e.target.value.replace(/\,/g,'')
        this.model.incomeFee = incomeFee
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'incomeFee'))
        })
      },
      // 来款单位失去焦点
      incomUnitBlur(e){
        if(this.editButton){
          return
        }
        const { value } = e.target
        // 判断是否改变
        if(value !== this.incomUnit){
          this.incomUnit = value
          this.getMatchData()
        }
      },
      // 入账金额失去焦点
      incomFeeBlur(e){
        if(this.editButton){
          return
        }
        const { value } = e.target
        // 判断是否改变
        if(value !== this.incomMoney){
          this.incomMoney = value
          this.getMatchData()
        }
      },
      // 入账时间改变
      incomDateChange(date){
        if(this.editButton){
          return
        }
        const before = `${this.incomDate.format(this.dateFormat)} 00:00:00`
        const current = `${date.format(this.dateFormat)} 00:00:00`
        // 判断是否改变
        if(current !== before){
          this.incomDate = date
          this.getMatchData()
        }
      },
      // 校验输入的数据是否存在重复数据
      getMatchData(){
        // 触发表单验证
        const formValue = this.form.getFieldsValue()
        formValue.incomeDate = `${this.incomDate.format(this.dateFormat)} 00:00:00`
        if(formValue.incomeUnit && formValue.incomeDate && formValue.incomeFee){
          const that = this
          httpAction(this.url.validUrl, formValue, 'post').then((res) => {
            if (Number(res.code) === 200) {
              that.repeatDataMsg = ''
            } else {
              that.repeatDataMsg = res.msg || ''
            }
          })
        }
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}
.ant-disabled-form {
  :global(.ant-input-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-select-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-checkbox-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-radio-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
}
.tipText {
    margin-left: 30px;
    color: #ff7757;
    font-weight: 500;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    span{
      font-size: 18px;
      font-weight: bold;
    }
}
</style>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
</style>
