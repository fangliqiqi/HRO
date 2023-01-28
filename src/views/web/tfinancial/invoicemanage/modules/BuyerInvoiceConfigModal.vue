<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    wrapClassName="invoiceConfigModal"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        :loading="confirmLoading"
        @click="handleOk()"
      >保存</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              class="stepFormText"
              label="开票对象"
            >
              <a-radio-group
                v-decorator="['grade',{rules: [{ required: true, message: '请选择开票对象！' }]}]"
                :disabled="isDisabled"
                @change="onChangeOfGrade"
              >
                <a-radio value="1">客户单位</a-radio>
                <a-radio value="0">结算主体</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="发票类型"
              class="stepFormText"
            >
              <a-radio-group
                v-decorator="['invKind',{rules: [{ required: true, message: '请选择发票类型！' }]}]"
                :disabled="isDisabled"
              >
                <a-radio value="2">普通发票</a-radio>
                <a-radio value="0">专用发票</a-radio>
                <a-radio value="51">电子发票</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="客户单位"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择客户单位"
                v-decorator="['customerId', {rules: [{ required: true, message: '请选择客户单位！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 250px"
              >
                <a-select-option
                  v-for="(value, key) in unitBelongs"
                  :key="key"
                  :value="String(value.id)"
                  @click="handleUnitChange(value)"
                >{{ value.customerName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="结算主体"
              class="stepFormText"
              v-if="settleDomainIsShow"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择结算主体"
                :disabled="settleDomainDisabled"
                v-decorator="['settleId', {rules: [{ required: true, message: '请选择结算主体！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 250px"
              >
                <a-select-option
                  v-for="(value, key) in settleDomainBelongs"
                  :key="key"
                  :value="String(value.id)"
                >{{ value.departName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="购买方名称"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入购买方名称"
                v-decorator="['ticketTableHead', {rules: [{ required: true, message: '请输入购买方名称！' }]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="纳税人识别号"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入纳税人识别号"
                v-decorator="['taxpayerIdentificationNo',{rules: [{max:20,message: '最多输入20个字符！'}]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="开户行"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入开户行"
                v-decorator="['bankName',{rules: [{max:100,message: '最多输入100个字符！'}]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="银行卡号"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入银行卡号"
                v-decorator="['bankNo',{rules: [{max:50,message: '最多输入50个字符！'}]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="地址"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入地址"
                v-decorator="['addr',{rules: [{max:200,message: '最多输入200个字符！'}]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="电话"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入电话"
                v-decorator="['phone',{rules: [{max:20,message: '最多输入20个字符！'}]}]"
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
import SelectPage from '@/components/jeecg/SelectPage'
import { httpAction } from '@/api/manage'

export default {
  components: {
    SelectPage
  },
  data() {
    return {
      description: '开票配置-购买方配置',
      title: '操作',
      visible: false,
      isDisabled: false,
      confirmLoading: false,
      isEdit: false, // 当前是编辑还是新增，默认新增
      recordInfo: {}, // 当前是编辑页时传入的详细数据
      settleDomainIsShow: true, // 控制结算主体的显示
      settleDomainDisabled: true, // 控制结算主体是否可选择
      form: this.$form.createForm(this),
      unitBelongs: [], // 客户单位
      settleDomainBelongs: [], // 结算主体
      url: {
        save: 'hrBase/tticketconfig', // 保存
        edit: 'hrBase/tticketconfig' // 编辑
      }
    }
  },
  methods: {
    show() {
      // 结算主体数据
      for (const item of this.unitBelongs) {
        if (String(item.id) === String(this.recordInfo.customerId)) {
          this.settleDomainBelongs = item.settleDomainList
          break
        }
      }
      this.visible = true
    },
    // 关闭
    handleCancel() {
      this.form.resetFields()
      this.isDisabled = false
      this.confirmLoading = false
      this.isEdit = false
      this.recordInfo = {}
      this.unitBelongs = []
      this.settleDomainBelongs = []
      this.settleDomainIsShow = true
      this.visible = false
    },
    // 编辑
    edit(record) {
      this.isEdit = true
      this.recordInfo = Object.assign({}, record)
      this.show()
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.recordInfo,
            'grade',
            'invKind',
            'customerId',
            'settleId',
            'ticketTableHead',
            'taxpayerIdentificationNo',
            'bankName',
            'bankNo',
            'addr',
            'phone'
          )
        )
        // 处理结算主体配置项的显示与否 settleDomainIsShow  0:结算主体 1：客户单位
        if (String(this.recordInfo.grade) === '1') {
          this.settleDomainIsShow = false
        } else {
          this.settleDomainIsShow = true
          // 判断结算主体显示后的是否可编辑
          this.settleDomainDisabled = !this.recordInfo.customerId
        }
      })
    },
    // 保存
    handleOk() {
      const that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          const formData = values
          that.confirmLoading = true
          const httpUrl = this.isEdit ? this.url.edit : this.url.save
          const method = this.isEdit ? 'put' : 'post'
          if (this.isEdit) {
            formData.id = this.recordInfo.id || ''
          }
          httpAction(httpUrl, formData, method)
            .then(res => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.handleCancel()
              } else {
                that.$message.error(res.msg || `${that.title}失败！`)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    // 选择开票对象
    onChangeOfGrade(e) {
      this.settleDomainIsShow = Number(e.target.value) === 0
    },
    // 选择客户单位
    handleUnitChange(value) {
      console.log('------选择客户单位', value)
      // 赋值客户单位 清空选择的结算主体
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            { customerId: value.id, ticketTableHead: value.customerName, settleId: undefined },
            'customerId',
            'ticketTableHead',
            'settleId'
          )
        )
      })
      // 更换结算主体下拉选择项
      this.settleDomainDisabled = false
      this.settleDomainBelongs = value.settleDomainList
    }
  }
}
</script>

<style lang="less" scoped>
.invoiceConfigModal {
  .stepFormText {
    :global(.ant-form-item-label) {
      width: 110px;
      text-align: left;
    }
  }
}
</style>
