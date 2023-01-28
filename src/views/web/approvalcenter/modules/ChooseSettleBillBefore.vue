<template>
  <a-modal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        class="ant-advanced-search-form"
      >
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="结算单类型"
        >
          <a-select
            showSearch
            placeholder="请选择结算单类型"
            optionFilterProp="children"
            style="width: 180px"
            v-decorator="['settleType', validatorRules.settleType ]"
          >
            <a-select-option value="0">普通薪资结算单</a-select-option>
            <a-select-option value="1">工程薪资结算单</a-select-option>
            <a-select-option value="2">非扣税类结算单</a-select-option>
            <!-- <a-select-option value="2">社保核准表</a-select-option>
            <a-select-option value="3">商险结算单</a-select-option>
            <a-select-option value="4">一次性业务结算单</a-select-option> -->
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>

    <standard-salart-settle-bill-list ref="standardSalarySettleBillModal" @ok="standardSalarySettleBillModalOk"></standard-salart-settle-bill-list>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import StandardSalartSettleBillList from '../billforms/StandardSalartSettleBillList'

export default {
  name: 'ChooseSettleBillBefore',
  components: { StandardSalartSettleBillList },
  data() {
    return {
      visible: false,
      title: '选择结算单类型',
      form: this.$form.createForm(this),
      confirmLoading: false,
      departId: '',
      model: {},
      settleMoney: 0,
      ticketMoney: 0,
      selectValue: -1,
      selectId: null,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      validatorRules: {
        settleType: { rules: [{ required: true, message: '请选择结算单类型!' }] },
      },
      url: {
        getStandardSalartSettleBill: '/salary/tsettlementhform/getBillBySettleDepartId',
        getEngineerSalartSettleBill: '/salary/tengineeringsettlementform/getBillBySettleDepartId',
      }
    }
  },
  methods: {
    showModal(departId,type) {
      this.departId = departId
      this.visible = true
      this.form.resetFields()
      if(type !== undefined){
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({settleType:String(type)}, 'settleType'))
        })
      }
    },
    handleOk() {
      const that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let object = Object.assign(this.model, values)
          this.selectValue = object.settleType;
          let url = '';
          let formName = '';
          switch (object.settleType) {
            case '0':
              formName = '普通工资结算单列表'
              url = this.url.getStandardSalartSettleBill + "?billType=0&settleDepartId=" + this.departId;
              break;
            case '1':
              formName = '工程薪资结算单列表'
              url = this.url.getEngineerSalartSettleBill + "?billType=1&settleDepartId=" + this.departId;
              break;
            case '2':
              formName = '非扣税项结算单列表'
              url = this.url.getStandardSalartSettleBill + "?billType=2&settleDepartId=" + this.departId;
              break;
            default:
              break;
          }

          httpAction(url, null, 'GET').then((res) => {
            if(res.code === 200){
              this.$refs.standardSalarySettleBillModal.title = formName
              this.$refs.standardSalarySettleBillModal.show(res.data,object.settleType)
            }else{
              this.$message.warning(res.msg)
            }
          }).finally(()=>{
            that.confirmLoading = false
          })
        }
      })
    },
    standardSalarySettleBillModalOk(settleType) {
      let selectObj = this.$refs.standardSalarySettleBillModal.selectionRows;
      if (selectObj != null && selectObj.length > 0) {
        this.selectId = selectObj[0].id
        this.settleMoney = selectObj[0].accountMoneySum
        this.ticketMoney = selectObj[0].ticketMoneySum
      }
      this.$emit('ok',settleType)
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.selectId = null
      this.settleMoney = this.ticketMoney = 0
      this.confirmLoading = false
    }
  }
}
</script>

<style scoped>

</style>