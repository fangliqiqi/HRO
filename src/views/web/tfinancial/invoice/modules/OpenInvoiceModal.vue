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
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >确认开票</a-button>
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
              label="开票金额"
              class="stepFormTextDisabled"
            >
              <a-input
                :disabled="true"
                placeholder="请输入开票金额"
                v-decorator="['invoiceMoney', {}]"
                style="width: 250px"
              />
            </a-form-item>
            <a-form-item
              label="开票类型"
              class="stepFormTextDisabled"
            >
              <a-select
                :disabled="true"
                placeholder="请选择开票类型"
                v-decorator="['invoiceType', {}]"
                style="width: 250px"
              >
                <a-select-option
                  v-for="(value, key) in invoiceTypeOptions"
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
              label="客户名称"
              class="stepFormTextDisabled"
            >
              <a-select
                :disabled="true"
                placeholder="请选择客户名称"
                v-decorator="['unitId', {}]"
                style="width: 250px"
              >
                <a-select-option
                  v-for="(value, key) in unitBelongs"
                  :key="key"
                  :value="value.id"
                >{{ value.customerName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="结算主体"
              class="stepFormTextDisabled"
            >
              <a-select
                :disabled="true"
                placeholder="请选择结算主体"
                v-decorator="['settleDomainId', {}]"
                style="width: 250px"
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
          <a-col :span="24">
            <a-form-item
              label="抬头名称"
              class="stepFormTextDisabled"
            >
              <a-input
                :disabled="true"
                placeholder="请输入抬头名称"
                v-decorator="['ticketTableHead', {rules: [{ required: true, message: '抬头名称！' }]}]"
                style="width: 250px"
              />
            </a-form-item>
            <a-form-item
              label="纳税人识别号"
              class="stepFormTextDisabled"
            >
              <a-input
                :disabled="true"
                placeholder="请输入纳税人识别号"
                v-decorator="['taxpayerIdentificationNo', {rules: [{ required: true, message: '请输入纳税人识别号！' }]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="地址"
              class="stepFormTextDisabled"
            >
              <a-input
                :disabled="true"
                placeholder="请输入地址"
                v-decorator="['addr', {}]"
                style="width: 250px"
              />
            </a-form-item>
            <a-form-item
              label="开户行"
              class="stepFormTextDisabled"
            >
              <a-input
                :disabled="true"
                placeholder="请输入开户行"
                v-decorator="['bankName']"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="电话"
              class="stepFormTextDisabled"
            >
              <a-input
                :disabled="true"
                placeholder="请输入电话"
                v-decorator="['phone', {}]"
                style="width: 250px"
              />
            </a-form-item>
            <a-form-item
              label="银行卡号"
              class="stepFormTextDisabled"
            >
              <a-input
                :disabled="true"
                placeholder="请输入银行卡号"
                v-decorator="['bankNo', {rules: [{ validator: this.validateBankNo }]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider />

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="复核人"
              class="stepFormText"
            >
              <a-select
                showSearch
                placeholder="请选择复核人"
                optionFilterProp="children"
                v-decorator="['checker', {rules: [{ required: true, message: '请选择复核人！' }]}]"
                style="width: 250px"
              >
                <a-select-option
                  v-for="(item, index) in model.nextUserIdBelongs"
                  :key="index"
                  :value="item.userId"
                >{{ item.nickname }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="收款人"
              class="stepFormText"
            >
              <a-select
                showSearch
                placeholder="请选择收款人"
                optionFilterProp="children"
                v-decorator="['cashier', {rules: [{ required: true, message: '请选择收款人！' }]}]"
                style="width: 250px"
              >
                <a-select-option
                  v-for="(item, index) in model.nextUserIdBelongs"
                  :key="index"
                  :value="item.userId"
                >{{ item.nickname }}</a-select-option>
              </a-select>
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
                v-decorator="['goodsName', {rules: [{ required: true, message: '请选择商品名称！' }]}]"
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
                v-decorator="['invKind', {rules: [{ required: true, message: '请选择发票类型！' }]}]"
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
                v-decorator="['classCode', {rules: [{ required: true, message: '请选择税收分类！' }]}]"
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
                v-decorator="['goodsTaxRate', {rules: [{ required: true, message: '请输入税率！' }, { validator: this.validateGoodsTaxRate }]}]"
                style="width: 250px"
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
    name: 'OpenInvoiceModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        unitBelongs: [],  // 客户单位
        settleDomainBelongs: [],  // 结算主体
        invoiceTypeOptions: {}, // 开票类型
        goodsNameOptions: [], // 商品名称
        taxClassificationOptions: [], // 税收分类
        invKindOptions: {'0': '专用发票', '2': '普通发票', '51': '电子发票'}, // 发票类型
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        url: {
          add: 'salary/tinvoice/audit',  // 开票
        },
      }
    },

    methods: {
      add() {
        this.edit({})
      },

      edit(record) {
        this.form.resetFields()
        this.model = record
        this.visible = true
        if (this.model.tinvoice) {  // 编辑
          for (const item of this.unitBelongs) {  // 处理结算主体数据
            if (String(item.id) === String(this.model.tinvoice.unitId)) {
              this.settleDomainBelongs = item.settleDomainList
              break
            }
          }
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({'invoiceMoney': this.model.tinvoice.invoiceMoney, 'invoiceType': this.model.tinvoice.invoiceType, 'unitId': this.model.tinvoice.unitId, 'settleDomainId': this.model.tinvoice.settleDomainId}, 'invoiceMoney', 'invoiceType', 'unitId', 'settleDomainId'))
          })
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({'goodsTaxRate': this.model.departSettlementInfo.taxFee}, 'goodsTaxRate'))
          })
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model.ticketConfig, 'ticketTableHead', 'taxpayerIdentificationNo', 'addr', 'bankName', 'phone', 'bankNo'))
          })
        }
      },

      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            httpurl += this.url.add
            const method = 'post'
            const formData = Object.assign(this.model, values)
            const requestData = {
              id : this.model.tinvoice.id,
              settleDomainId : this.model.tinvoice.settleDomainId,
              auditFlag : 2,
              headerName : formData.ticketTableHead,
              taxIdentificationNum : formData.taxpayerIdentificationNo,
              address : formData.addr,
              bankName : formData.bankName,
              tel : formData.phone,
              bankNo : formData.bankNo,
              checker : formData.checker,
              cashier : formData.cashier,
              goodsName : formData.goodsName,
              invKind : formData.invKind,
              classCode : formData.classCode,
              goodsTaxRate : formData.goodsTaxRate
            }
            httpAction(httpurl, requestData, method).then((res) => {
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
        this.unitBelongs = []  // 客户单位
        this.settleDomainBelongs = []  // 结算主体
        this.invoiceTypeOptions = {} // 开票类型
        this.goodsNameOptions = [] // 商品名称
        this.taxClassificationOptions = [] // 税收分类
      },

      /******************************************* 验证规则 *******************************************/
      // 银行卡号验证
      validateBankNo(rule, value, callback) {
        if (!value) {
          callback()
          return
        }
        if (value.length>25) {
          callback('银行卡号不能超过25位！')
          return
        }
        callback()
      },

      // 税率
      validateGoodsTaxRate(rule, value, callback) {
        if (!value) {
          callback()
          return
        }
        if (!new RegExp(/^(\d|[1-9]\d|99)(\.\d{1,2})?$/).test(value)) { // 数验证
          callback('请输入100内最多两位有效数字！')
          return
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
    width: 110px;
  }
}
.stepFormTextDisabled {
  margin-bottom: 0px;
  :global(.ant-form-item-label) {
    width: 110px;
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
</style>
