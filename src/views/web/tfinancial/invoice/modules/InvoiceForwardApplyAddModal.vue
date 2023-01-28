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
      <!-- <a-button
        type="primary"
        @click="handleBack"
        v-if="backButton"
        style="background-color: rgba(255, 51, 51, 1); border-color: rgba(255, 51, 51, 1);"
      >退回</a-button>
      <a-button
        type="primary"
        v-if="invoiceButton"
        @click="handleInvoice"
      >开票</a-button> -->
      <a-button
        v-if="addConfirmButton"
        type="primary"
        :loading="confirmLoading"
        @click="handleOk('addConfirm')"
      >保存</a-button>
      <a-button
        v-if="addReleaseButton"
        type="primary"
        :loading="confirmLoading"
        @click="handleOk('addRelease')"
      >提交开票申请</a-button>
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
              label="客户名称"
              class="stepFormText"
            >
              <a-select
                showSearch
                :disabled="!addConfirmButton"
                optionFilterProp="children"
                placeholder="请选择客户名称"
                v-decorator="['unitId', {rules: [{ required: true, message: '请选择客户名称！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 200px"
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
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择结算主体"
                v-decorator="['settleDomainId', validatorRules.settleDomainId]"
                :dropdownMatchSelectWidth="false"
                style="width: 200px"
                :disabled="settleDomainDisabled || !addConfirmButton"
              >
                <a-select-option
                  v-for="(value, key) in settleDomainBelongs"
                  :key="key"
                  :value="value.id"
                  @click="handleGetList(value)"
                >{{ value.departName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                :disabled="(invoiceSetting.total && invoiceSetting.total > 1) ? false : true"
                @click="handleInvoiceSettingList()"
              >选择开票配置</a-button>
            </a-form-item>
          </a-col>
        </a-row>

        <div class="steps-content-setting">
          <a-row>
            <a-col :span="24">
              <a-form-item
                label="抬头名称"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.headerName ? invoiceSetting.headerName : '-'"
                >
                  {{ invoiceSetting.headerName ? invoiceSetting.headerName : '-' }}
                </a-tooltip>
              </a-form-item>
              <a-form-item
                label="纳税人识别号"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.taxIdentificationNum ? invoiceSetting.taxIdentificationNum : '-'"
                >
                  {{ invoiceSetting.taxIdentificationNum ? invoiceSetting.taxIdentificationNum : '-' }}
                </a-tooltip>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="24">
              <a-form-item
                label="商品名称"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.goodsName ? invoiceSetting.goodsName : '-'"
                >
                  {{ invoiceSetting.goodsName ? invoiceSetting.goodsName : '-' }}
                </a-tooltip>
              </a-form-item>
              <a-form-item
                label="发票类型"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.invKindName ? invoiceSetting.invKindName : '-'"
                >
                  {{ invoiceSetting.invKindName ? invoiceSetting.invKindName : '-' }}
                </a-tooltip>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="24">
              <a-form-item
                label="税收分类"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.classCodeName ? invoiceSetting.classCodeName : '-'"
                >
                  {{ invoiceSetting.classCodeName ? invoiceSetting.classCodeName : '-' }}
                </a-tooltip>
              </a-form-item>
              <a-form-item
                label="税率"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.goodsTaxRate ? invoiceSetting.goodsTaxRate : '-'"
                >
                  {{ invoiceSetting.goodsTaxRate ? invoiceSetting.goodsTaxRate : '-' }}
                </a-tooltip>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="24">
              <a-form-item
                label="开户行"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.bankName ? invoiceSetting.bankName : '-'"
                >
                  {{ invoiceSetting.bankName ? invoiceSetting.bankName : '-' }}
                </a-tooltip>
              </a-form-item>
              <a-form-item
                label="银行卡号"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.bankNo ? invoiceSetting.bankNo : '-'"
                >
                  {{ invoiceSetting.bankNo ? invoiceSetting.bankNo : '-' }}
                </a-tooltip>
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="申请开票金额"
              class="stepFormText"
            >
              <a-input
                :disabled="!addConfirmButton && !addReleaseButton"
                placeholder="请输入开票金额"
                v-decorator="['invoiceMoney', validatorRules.invoiceMoney]"
                style="width: 200px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col>
            <a-form-item
              label="开票端口"
              class="stepFormText"
            >
              <a-select
                showSearch
                placeholder="选择省份"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['province', {rules: [{ required: true, message: '请选择省份！' }]}]"
                @change="handleProvinceChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaTrees"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                showSearch
                placeholder="选择城市"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['city', {rules: [{ required: true, message: '请选择城市！' }]}]"
                @change="handleCityChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaCitys"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                allowClear
                showSearch
                placeholder="选择区县"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['town', {}]"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaTowns"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注"
              class="stepFormText"
            >
              <a-textarea
                :disabled="!addConfirmButton"
                :rows="2"
                placeholder="请输入备注"
                v-decorator="['remark', {rules: [{ max: 500, message: '最大长度500个字符！'}]}]"
                style="width: 450px"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <back-modal
      ref="backModal"
      @ok="formOk"
    ></back-modal>
    <open-invoice-modal
      ref="openInvoiceModal"
      @ok="formOk"
    ></open-invoice-modal>
    <open-invoice-list-modal
      ref="openInvoiceListModal"
      @ok="invoiceListFormOk"
    ></open-invoice-list-modal>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import BackModal from './BackModal'
  import { httpAction } from '@/api/manage'
  import OpenInvoiceModal from './OpenInvoiceModal'
  import OpenInvoiceListModal from './OpenInvoiceListModal'
  import { filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'InvoiceForwardApplyAddModal',
    components: {
      BackModal,
      OpenInvoiceModal,
      OpenInvoiceListModal,
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        backButton: false,  // 退回
        invoiceButton: false,  // 开票
        addConfirmButton: true, // 保存
        addReleaseButton: true, // 提交开票申请
        disabledStyle: false, // 禁止
        confirmLoading: false,
        settleDomainDisabled: true, // 结算主体禁止选择
        form: this.$form.createForm(this),
        unitNo: '', // 客户Code
        unitName: '', // 客户单位
        areaTrees: [],  // 地区
        areaCitys: [],  // 城市
        areaTowns: [],  // 区县
        unitBelongs: [],  // 客户单位
        invoiceSetting: {}, // 开票配置
        invoiceSettingList: [], // 配置列表
        settleDomainNo: '', // 结算主体Code
        settleDomainName: '', // 结算主体
        settleDomainBelongs: [],  // 结算主体
        invoiceTypeOptions: {}, // 开票类型
        goodsNameOptions: [], // 商品名称
        taxClassificationOptions: [], // 税收分类
        invKindOptions: {}, // 发票类型
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          invoiceMoney: {rules: [{ required: true, message: '请输入开票金额！' }, { validator: this.validatInvoiceMoney }]},
          settleDomainId: {rules: [{ required: true, message: '请选择结算主体！' }]},
          headerName: {rules: [{ required: true, message: '请选抬头名！' }]},
          taxIdentificationNum: {rules: [{ required: true, message: '请输入纳税人识别号！' }]},
        },
        url: {
          add: 'salary/tinvoice/savePreInvoicing',  // 保存
          ReleaseUrl: 'salary/tinvoice/doSubmit', // 发布
          getInvoice: 'hrBase/tticketconfig/page'
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
        // 默认安徽省
        this.areaCitys = []
        for (const c of this.areaTrees[12 - 1].children) {
          this.areaCitys.push(c)
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({province: 12}, 'province'))
        })
        if (this.model.tinvoice) {  // 编辑
          for (const item of this.unitBelongs) {  // 处理结算主体数据
            if (String(item.id) === String(this.model.tinvoice.unitId)) {
              this.settleDomainBelongs = item.settleDomainList
              break
            }
          }
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({'invoiceMoney': this.model.tinvoice.invoiceMoney, 'unitId': this.model.tinvoice.unitId, 'settleDomainId': this.model.tinvoice.settleDomainId, 'remark': this.model.tinvoice.remark}, 'invoiceMoney', 'unitId', 'settleDomainId', 'remark'))
          })
        }
      },

      // 保存按钮
      handleOk(type) {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            const method = 'post'
            let formData = Object.assign(this.model, values)
            if (this.model.tinvoice) {  // 编辑
              httpurl += this.url.ReleaseUrl
              httpurl += `?tInvoiceId=${this.model.tinvoice.id}&invoiceMoney=${formData.invoiceMoney}&headerName=${formData.headerName}&taxIdentificationNum=${formData.taxIdentificationNum}&goodsName=${formData.goodsName}&invKind=${formData.invKind}&classCode=${formData.classCode}&goodsTaxRate=${formData.goodsTaxRate}`
              if (formData.address) {
                httpurl += `&address=${formData.address}`
              }
              if (formData.tel) {
                httpurl += `&tel=${formData.tel}`
              }
              if (formData.bankName) {
                httpurl += `&bankName=${formData.bankName}`
              }
              if (formData.bankNo) {
                httpurl += `&bankNo=${formData.bankNo}`
              }
              if (formData.remark) {
                httpurl += `&remark=${formData.remark}`
              }
              httpAction(httpurl, '', method).then((res) => {
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
              if (Array.isArray(formData.city)) {
                formData.city = null
              }
              if (Array.isArray(formData.town)) {
                formData.town = null
              }
              httpurl += this.url.add
              formData.unitNo = this.unitNo
              formData.unitName = this.unitName
              formData.settleDomainNo = this.settleDomainNo
              formData.settleDomainName = this.settleDomainName
              formData.headerName     = this.invoiceSetting.headerName
              formData.taxIdentificationNum = this.invoiceSetting.taxIdentificationNum   
              formData.bankName       = this.invoiceSetting.bankName 
              formData.bankNo         = this.invoiceSetting.bankNo
              formData.goodsName      = this.invoiceSetting.goodsName
              formData.invKind        = this.invoiceSetting.invKind
              formData.classCode      = this.invoiceSetting.classCode
              formData.goodsTaxRate   = this.invoiceSetting.goodsTaxRate
              if (!formData.headerName || !formData.goodsName || !formData.invKind || !formData.classCode || !formData.goodsTaxRate) {
                that.$message.error('请先完善开票信息配置！')
                that.confirmLoading = false
                return false
              }
              if (String(type) === 'addConfirm') {  // 确定入账
                formData.auditFlag = 0
              } else if (String(type) === 'addRelease') {  // 入账并发布认领
                formData.auditFlag = 1
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
        this.backButton = false  // 退回
        this.invoiceButton = false  // 开票
        this.addConfirmButton = true // 保存
        this.addReleaseButton = true // 提交开票申请
        this.disabledStyle = false // 禁止
        this.confirmLoading = false
        this.settleDomainDisabled = true // 结算主体禁止选择
        this.unitNo = '' // 客户单位code
        this.unitName = '' // 客户单位
        this.areaTrees = []  // 地区
        this.areaCitys = []  // 城市
        this.areaTowns = []  // 区县
        this.unitBelongs = []  // 客户单位
        this.invoiceSetting = {} // 开票配置
        this.invoiceSettingList = [] // 配置列表
        this.settleDomainNo = '' // 结算主体code
        this.settleDomainName = '' // 结算主体
        this.settleDomainBelongs = []  // 结算主体
        this.invoiceTypeOptions = {} // 开票类型
        this.goodsNameOptions = [] // 商品名称
        this.taxClassificationOptions = [] // 税收分类
      },
      // 退回
      handleBack() {
        this.$refs.backModal.title = '确认退回'
        this.$refs.backModal.tinvoiceInfo = this.model.tinvoice
        this.$refs.backModal.add()
      },
      // 开票
      handleInvoice() {
        this.$refs.openInvoiceModal.title = '开票编辑'
        this.$refs.openInvoiceModal.unitBelongs = this.unitBelongs
        this.$refs.openInvoiceModal.invoiceTypeOptions = this.invoiceTypeOptions
        this.$refs.openInvoiceModal.goodsNameOptions = this.goodsNameOptions
        this.$refs.openInvoiceModal.taxClassificationOptions = this.taxClassificationOptions
        // 税点
        httpAction(`hrBase/tdepartsettlementinfo/getBySettlementId?settlementId=${this.model.tinvoice.settleDomainId}`, '', 'POST').then((res) => {
          if (Number(res.code) === 200 && res.data) {
            this.model.departSettlementInfo = res.data
            // 开户行
            httpAction(`hrBase/tticketconfig/getBySettleDomainId?settleDomainId=${this.model.tinvoice.settleDomainId}`, '', 'GET').then((res) => {
              if (Number(res.code) === 200 && res.data) {
              this.model.ticketConfig = res.data
              // 获取权限的用户
              httpAction('admin/user/findUserBypPrmission?permissionStr=wxhr:temployeeinfo_unLockAudit', '', 'GET').then((res) => {
                if (Number(res.code) === 200 && res.data) {
                  this.model.nextUserIdBelongs = res.data
                  this.$refs.openInvoiceModal.edit(this.model)
                } else {
                  this.$message.error('复核人数据为空！')
                  return false
                }
              })
              } else {
                this.$message.error('请在结算主体设置中完善“开票信息”！')
                return false
              }
            })
          } else {
            this.$message.error('请在结算主体设置中完善“结算配置”！')
            return false
          }
        })
      },
      // 单位选择变化
      handleUnitChange(value) {
        this.unitName = value.customerName
        this.model.settleDomainId = []
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'settleDomainId'))
        })
        this.settleDomainDisabled = false
        this.settleDomainBelongs = value.settleDomainList
      },
      // 选择结算主体后
      handleGetList(value) {
        this.unitNo = value.customerCode
        this.settleDomainNo = value.departNo
        this.settleDomainName = value.departName
        httpAction(`${this.url.getInvoice}?settleId=${value.id}&current=1&size=30`, {}, 'GET').then((res) => {
          this.invoiceSetting = {}
          this.invoiceSettingList = [] // 配置列表
          if (Number(res.code) === 200 && res.data.total) {
            this.invoiceSettingList = res.data.records // 配置列表
            this.invoiceSetting.total                = res.data.total
            this.invoiceSetting.headerName           = res.data.records[0].ticketTableHead
            this.invoiceSetting.taxIdentificationNum = res.data.records[0].taxpayerIdentificationNo
            this.invoiceSetting.goodsName            = res.data.records[0].goodsName
            this.invoiceSetting.invKind              = res.data.records[0].invKind
            this.invoiceSetting.invKindName          = this.invKindOptions[res.data.records[0].invKind]
            this.invoiceSetting.classCode            = res.data.records[0].classCode
            this.invoiceSetting.classCodeName        = filterDictText(this.taxClassificationOptions, res.data.records[0].classCode)
            this.invoiceSetting.goodsTaxRate         = res.data.records[0].goodsTaxRate
            this.invoiceSetting.bankName             = res.data.records[0].bankName
            this.invoiceSetting.bankNo               = res.data.records[0].bankNo
          } else {
            this.$message.error('请先完善开票信息配置！')
          }
        })
      },
      // 开票配置列表
      handleInvoiceSettingList() {
        this.$refs.openInvoiceListModal.title = '开票信息配置列表'
        this.$refs.openInvoiceListModal.dataSource = this.invoiceSettingList
        this.$refs.openInvoiceListModal.invKindOptions = this.invKindOptions
        this.$refs.openInvoiceListModal.taxClassificationOptions = this.taxClassificationOptions
        this.$refs.openInvoiceListModal.add()
      },
      // 表单回调
      formOk() {
        this.close()
        this.$emit('ok')
      },
      // 省份切换
      handleProvinceChange(value) {
        this.areaCitys = []
        this.areaTowns = []
        for (const c of this.areaTrees[value - 1].children) {
          this.areaCitys.push(c)
        }
        this.form.setFieldsValue(pick({city: [], town: []}, 'city', 'town'))
      },
      // 市切换
      handleCityChange(value) {
        this.areaTowns = []
        for (const c of this.areaCitys) {
          if (String(c.id) === String(value)) {
            if (c.children.length > 0) {
              for (const t of c.children) {
                this.areaTowns.push(t)
              }
            }
          break
          }
        }
        this.form.setFieldsValue(pick({town: []}, 'town'))
      },
      // 选中回调
      invoiceListFormOk() {
        const selectionRow = this.$refs.openInvoiceListModal.selectionRows[0]
        this.invoiceSetting = {}
        this.invoiceSetting.total                = 2  // 直接是2
        this.invoiceSetting.headerName           = selectionRow.ticketTableHead
        this.invoiceSetting.taxIdentificationNum = selectionRow.taxpayerIdentificationNo
        this.invoiceSetting.goodsName            = selectionRow.goodsName
        this.invoiceSetting.invKind              = selectionRow.invKind
        this.invoiceSetting.invKindName          = this.invKindOptions[selectionRow.invKind]
        this.invoiceSetting.classCode            = selectionRow.classCode
        this.invoiceSetting.classCodeName        = filterDictText(this.taxClassificationOptions, selectionRow.classCode)
        this.invoiceSetting.goodsTaxRate         = selectionRow.goodsTaxRate
        this.invoiceSetting.bankName             = selectionRow.bankName
        this.invoiceSetting.bankNo               = selectionRow.bankNo
      },
      /******************************************* 验证规则 *******************************************/
      // 金额验证
      validatInvoiceMoney(rule, value, callback) {
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
.stepFormTextDisabled {
  margin-bottom: 0px;
  :global(.ant-form-item-label) {
    width: 120px;
  }
  :global(.ant-form-item-control .ant-form-item-children) {
    text-align: left;
    width: 250px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
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
.steps-content-setting {
  margin-bottom: 20px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}
</style>
