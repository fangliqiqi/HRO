<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        v-if="!isDisabled"
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
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
              label="配置级别"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择配置级别"
                :disabled="isDisabled"
                v-decorator="['grade', {rules: [{ required: true, message: '请选择配置级别!' }]}]"
                :dropdownMatchSelectWidth="false"
                @change="changeGrade"
                style="width: 250px"
              >
                <a-select-option value="1">单位级别</a-select-option>
                <a-select-option value="0">结算主体</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="客户名称"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择客户名称"
                :disabled="isDisabled"
                v-decorator="['customerId', {rules: [{ required: true, message: '请选择客户名称！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 250px"
              >
                <a-select-option
                  v-for="(value, key) in unitBelongs"
                  :key="key"
                  :value="value.id"
                  @click="handleUnitChange(value)"
                >{{ value.customerName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="结算主体"
              class="stepFormText"
              v-if="isShow"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择结算主体"
                :disabled="settleDomainDisabled || isDisabled"
                v-decorator="['settleId', validatorRules.settleDomainId]"
                :dropdownMatchSelectWidth="false"
                style="width: 250px"
              >
                <a-select-option
                  v-for="(value, key) in settleDomainBelongs"
                  :key="key"
                  :value="value.id"
                  @click="handleSettleChange(value)"
                >{{ value.departName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="抬头名称"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入抬头名称"
                v-decorator="['ticketTableHead', validatorRules.ticketTableHead]"
                style="width: 250px"
                :title="model.ticketTableHead ? model.ticketTableHead : ''"
              />
            </a-form-item>
            <a-form-item
              label="纳税人识别号"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入纳税人识别号"
                v-decorator="['taxpayerIdentificationNo', {}]"
                style="width: 250px"
                :title="model.taxpayerIdentificationNo ? model.taxpayerIdentificationNo : ''"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="商品名称"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择商品名称"
                :disabled="isDisabled"
                v-decorator="['goodsName', {rules: [{ required: true, message: '请选择商品名称！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 250px"
              >
                <a-select-option
                  v-for="(item, index) in goodsNameOptions"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="发票类型"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择发票类型"
                :disabled="isDisabled"
                v-decorator="['invKind', {rules: [{ required: true, message: '请选择发票类型！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 250px"
              >
                <a-select-option
                  v-for="(value, key) in invKindOptions"
                  :key="key"
                  :value="key"
                >{{ value }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="税收分类"
              class="stepFormText"
            >
              <a-select
                showSearch
                placeholder="请选择税收分类"
                optionFilterProp="children"
                :disabled="isDisabled"
                v-decorator="['classCode', {rules: [{ required: true, message: '请选择税收分类！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 250px"
              >
                <a-select-option
                  v-for="(item, index) in taxClassificationOptions"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="税率"
              class="stepFormText"
            >
              <a-input
                placeholder="请输入税率"
                :disabled="isDisabled"
                v-decorator="['goodsTaxRate', {rules: [{ required: true, message: '请输入税率！' }, { validator: this.validateGoodsTaxRate }]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="开户行"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入开户行"
                v-decorator="['bankName', {}]"
                style="width: 250px"
                :title="model.bankName ? model.bankName : ''"
              />
            </a-form-item>
            <a-form-item
              label="银行卡号"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入银行卡号"
                v-decorator="['bankNo', {rules: [{ validator: this.validateBankNo }]}]"
                style="width: 250px"
                :title="model.bankNo ? model.bankNo : ''"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="电话"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入电话"
                v-decorator="['phone', {}]"
                style="width: 250px"
                :title="model.phone ? model.phone : ''"
              />
            </a-form-item>
            <a-form-item
              label="地址"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入地址"
                v-decorator="['addr', {}]"
                style="width: 250px"
                :title="model.addr ? model.addr : ''"
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

  export default {
    name: 'InvoiceSettingAddModal',
    components: {
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        isDisabled: false,
        confirmLoading: false,
        settleDomainDisabled: true, // 结算主体禁止选择
        form: this.$form.createForm(this),
        settleName: '', // 结算主体名称
        unitBelongs: [],  // 客户单位
        invKindOptions: {}, // 发票类型
        goodsNameOptions: [], // 商品名称
        invoiceTypeOptions: {}, // 开票类型
        settleDomainBelongs: [],  // 结算主体
        taxClassificationOptions: [], // 税收分类
        validatorRules: {
          settleDomainId: {rules: [{ required: true, message: '请选择结算主体！' }]},
          ticketTableHead: {rules: [{ required: true, message: '请选抬头名！' }]},
          taxIdentificationNum: {rules: [{ required: true, message: '请输入纳税人识别号' }]},
        },
        url: {
          add: 'hrBase/tticketconfig',  // 保存
          edit: 'hrBase/tticketconfig', // 编辑
        },
        isShow:true,
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
          for (const item of this.unitBelongs) {  // 处理结算主体数据
            if (String(item.id) === String(this.model.customerId)) {
              this.settleDomainBelongs = item.settleDomainList
              break
            }
          }
          this.settleName = this.model.settleName // 结算主体名称
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'grade','customerId', 'settleId', 'ticketTableHead', 'taxpayerIdentificationNo',
            'goodsName', 'invKind', 'classCode', 'goodsTaxRate', 'bankName', 'bankNo','addr', 'phone'))
             this.isShow = (record.grade==='1') ? false : true
          })
        }
      },
      changeGrade(val){
        this.isShow = (val==='1') ? false : true
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            let formData = Object.assign(this.model, values)
            
            if (formData.id) {  // 编辑
              httpurl += this.url.edit
              if(this.model.grade==='1'){
                formData.settleId = ''
              }
              method += 'put'
            } else {
              httpurl += this.url.add
              method += 'post'
              if(formData.grade==='1'){
                formData.settleId = ''
              }
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
        this.isDisabled = false
        this.settleName = '' // 结算主体名称
        this.unitBelongs = []  // 客户单位
        this.invKindOptions = {} // 发票类型
        this.goodsNameOptions = [] // 商品名称
        this.invoiceTypeOptions = {} // 开票类型
        this.settleDomainBelongs = []  // 结算主体
        this.settleDomainDisabled = this.isShow = true // 结算主体禁止选择
        this.taxClassificationOptions = [] // 税收分类
      },
      // 单位选择变化
      handleUnitChange(value) {
        this.model.settleId = []
        this.settleName = ''
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'settleId'))
        })
        this.settleDomainDisabled = false
        this.settleDomainBelongs = value.settleDomainList
      },
      // 选择结算主体
      handleSettleChange(value) {
        this.settleName = value.departName
      },
      /******************************************* 验证规则 *******************************************/
      // 银行卡号验证
      validateBankNo(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if(value.length>25){
          callback('银行卡号不能超过25位！')
          return false
        }
        callback()
      },
      // 税率
      validateGoodsTaxRate(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/^(\d|[1-9]\d|99)(\.\d{1,2})?$/).test(value)) { // 数验证
          callback('请输入100内最多两位有效数字！')
          return false
        }
        callback()
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 120px;
  }
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
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
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}
</style>
