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
              label="结算主体"
              class="stepFormText"
            >
              <a-select
                showSearch
                v-decorator="['settleDomainId']"
                optionFilterProp="children"
                placeholder="请选择结算主体"
                :dropdownMatchSelectWidth="false"
                style="width: 200px"
                :disabled="true"
              >
                <a-select-option
                  :value="dataInfo.departId"
                >{{ dataInfo.departName }}</a-select-option>
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
                  :title="invoiceSetting.goodsTaxRate"
                >
                  {{ invoiceSetting.goodsTaxRate }}
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

    <open-invoice-list-modal
      ref="openInvoiceListModal"
      @ok="invoiceListFormOk"
    ></open-invoice-list-modal>
  </a-modal>
</template>

<script>
import OpenInvoiceListModal from '../../web/tfinancial/invoice/modules/OpenInvoiceListModal'
import { filterDictText,initDictOptions } from '@/components/dict/JDictSelectUtil'
import pick from 'lodash.pick'
import { httpAction } from '@/api/manage'

export default {
  name: 'SalaryInvoiceModal',

  components:{
    OpenInvoiceListModal, // 开票配置列表
  },

  data(){
    return {
      title: '操作',
      visible: false, // 控制弹窗的显示与隐藏
      dataInfo:{},
      confirmLoading: false, // 点击操作按钮后的按钮加载动画
      addConfirmButton: true, // 保存
      addReleaseButton: true, // 提交开票申请
      taxClassificationOptions: [], // 税收分类
      invKindOptions: {'0': '专用发票', '2': '普通发票', '51': '电子发票'}, // 发票类型
      form: this.$form.createForm(this),
      invoiceSetting: {}, // 开票配置
      areaTrees: [],  // 地区
      areaCitys: [],  // 城市
      areaTowns: [],  // 区县
      validatorRules: {
        invoiceMoney: {rules: [{ required: true, message: '请输入开票金额！' }, { validator: this.validatInvoiceMoney }]},
      },
      url: {
        getInvoice: 'hrBase/tticketconfig/page', // 获取开票配置
        add: 'salary/tinvoice/saveInvoice',  // 保存
      },
    }
  },

  methods:{
    // 弹窗显示
    show() {
      this.form.resetFields()
      this.visible = true
      // 默认安徽省
      this.areaCitys = []
      for (const c of this.areaTrees[12 - 1].children) {
        this.areaCitys.push(c)
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({province: 12,settleDomainId:this.dataInfo.departId}, 'province','settleDomainId'))
      })
      // 字典数据
      this.initDictConfig()
      // 获取开票配置信息
      this.loadTicketConfig()
    },

    // 点击关闭按钮
    handleCancel(){
      this.visible = false
    },

    // 获取开票配置
    loadTicketConfig(){
      const url = `${this.url.getInvoice}?settleId=${this.dataInfo.departId}&current=1&size=30`
      httpAction(url, {}, 'GET').then((res) => {
        this.invoiceSetting = {}
        this.invoiceSettingList = [] // 配置列表
        if (Number(res.code) === 200 && res.data.total) {
          this.invoiceSettingList = res.data.records // 配置列表
          this.invoiceSetting.total = res.data.total
          this.assignInvoiceSettingData(res.data.records[0] || {})
        } else {
          this.$message.error('请先完善开票信息配置！')
        }
      })
    },

    // 点击选择开票配置
    handleInvoiceSettingList(){
      this.$refs.openInvoiceListModal.title = '开票信息配置列表'
      this.$refs.openInvoiceListModal.dataSource = this.invoiceSettingList
      this.$refs.openInvoiceListModal.invKindOptions = this.invKindOptions
      this.$refs.openInvoiceListModal.taxClassificationOptions = this.taxClassificationOptions
      this.$refs.openInvoiceListModal.add()
    },

    // 选择开票配置回调
    invoiceListFormOk() {
      const selectionRow = this.$refs.openInvoiceListModal.selectionRows[0]
      this.invoiceSetting = {}
      this.invoiceSetting.total = 2  // 直接是2
      this.assignInvoiceSettingData(selectionRow || {})
    },

    // 赋值开票配置信息
    assignInvoiceSettingData(data){
      // 抬头名称
      this.invoiceSetting.headerName = data.ticketTableHead
      // 纳税人识别号
      this.invoiceSetting.taxIdentificationNum = data.taxpayerIdentificationNo
      // 商品名称
      this.invoiceSetting.goodsName = data.goodsName
      // 发票类型编号
      this.invoiceSetting.invKind = data.invKind
      // 发票类型
      this.invoiceSetting.invKindName = this.invKindOptions[data.invKind]
      // 税收分类编号
      this.invoiceSetting.classCode = data.classCode
      // 税收分类
      this.invoiceSetting.classCodeName = filterDictText(this.taxClassificationOptions, data.classCode)
      // 税率
      this.invoiceSetting.goodsTaxRate = data.goodsTaxRate
      // 开户行
      this.invoiceSetting.bankName = data.bankName
      // 银行卡号
      this.invoiceSetting.bankNo = data.bankNo
    },

    // 点击省份切换
    handleProvinceChange(value) {
      this.areaCitys = []
      this.areaTowns = []
      for (const c of this.areaTrees[value - 1].children) {
        this.areaCitys.push(c)
      }
      this.form.setFieldsValue(pick({city: [], town: []}, 'city', 'town'))
    },

    // 点击城市切换
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

    // 点击“保存”/提交开票
    handleOk(type){
      const that = this
      that.form.validateFields((error,values) =>{
        if(!error){
          that.confirmLoading = true
          const formData = Object.assign(this.invoiceSetting,values)
          formData.settleDomainNo = this.dataInfo.departNo
          formData.settleDomainName = this.dataInfo.departName
          // 调整省市区数据，如果为空的情况
          if (Array.isArray(formData.city)) {
            formData.city = null
          }
          if (Array.isArray(formData.town)) {
            formData.town = null
          }
          formData.province = formData.province ? formData.province : null
          formData.city = formData.city ? formData.city : null
          formData.town = formData.town ? formData.town : null
          // auditFlag ：0:保存 1:提交开票申请
          if(String(type) === 'addConfirm'){
            formData.auditFlag = 0
          }else if(String(type) === 'addRelease'){
            formData.auditFlag = 1
          }
          // 判断开票配置信息是否完善
          if (!formData.headerName || !formData.goodsName || !formData.invKind || !formData.classCode) {
            that.$message.error('请先完善开票信息配置！')
            that.confirmLoading = false
            return
          }
          // 数据整合
          const requestData = {
            isRes:this.dataInfo.isRes,
            tinvoice:formData
          }
          // 调用保存或提交开票接口
          httpAction(that.url.add, requestData, 'post').then((res) => {
            if (Number(res.code) === 200) {
              that.$message.success(`${that.title}成功！`)
              const returnData = {
                ticketMoney:formData.invoiceMoney,
              }
              that.$emit('ok',returnData)
              that.handleCancel()

              } else {
                that.$message.warning(res.msg || res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
          })
        }else {
          that.$message.error('请完善开票申请信息！')
        }
      })
    },

    // 数据字典
    initDictConfig() {
      // 税收分类
      initDictOptions('tax_classification').then((res) => {
        if (Number(res.code) === 200) {
          this.taxClassificationOptions = res.data
        }
      })
    },

  }
}
</script>

<style lang="less" scoped>
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

.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
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
