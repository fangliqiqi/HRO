<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    wrapClassName="printAddressConfigModal"
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
          <a-col :span="12">
            <a-form-item
              label="开票类型"
              class="stepFormText"
            >
              <a-radio-group
                v-decorator="['type',{rules: [{ required: true, message: '请选择发票类型！' }]}]"
                :disabled="isDisabled"
                @change="invKindOnChange"
              >
                <a-radio value="2">普通发票</a-radio>
                <a-radio value="0">专用发票</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col
            v-if="invKindLimitType === 0"
            :span="12"
          >
            <a-form-item
              label="单张专票限额"
              class="stepFormText"
            >
              <a-input-number
                :disabled="isDisabled"
                :precision="2"
                placeholder="请输入单张专票限额"
                v-decorator="['specialTicketLimit',{rules: [{ required: true, message: '请输入单张专票限额！'}]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
          <a-col
            v-else-if="invKindLimitType === 2"
            :span="12"
          >
            <a-form-item
              label="单张普票限额"
              class="stepFormText"
            >
              <a-input-number
                :disabled="isDisabled"
                :precision="2"
                placeholder="请输入单张普票限额"
                v-decorator="['generalTicketLimit',{rules: [{ required: true, message: '请输入单张普票限额！'}]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="开票单位"
              class="stepFormText"
            >
              <a-select
                showSearch
                label-in-value
                optionFilterProp="children"
                placeholder="请选择开票单位"
                :disabled="isDisabled"
                v-decorator="['invoiceUnitId', {rules: [{ required: true, message: '请选择开票单位！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 250px"
              >
                <a-select-option
                  v-for="(item, index) in companyList"
                  :key="index"
                  :value="String(item.companyId)"
                >{{ item.company }}</a-select-option>
              </a-select>
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
      title: '操作',
      visible: false,
      isDisabled: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      isEdit: false, // 当前是编辑还是新增，默认新增
      recordInfo: {}, // 当前是编辑页时传入的详细数据
      companyList: [], // 公司列表
      invKindLimitType: 1, // 发票限额类型 0:专用 2:普票
      url: {
        save: '/salary/tinvoicelimitset', // 保存
        edit: '/salary/tinvoicelimitset', // 编辑
        hrCompanyList: '/salary/tinvoicecompanyset/getInvoiceCommpanySetList' // 公司列表
      }
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    // 编辑
    edit(record) {
      this.isEdit = true
      this.show()
      this.recordInfo = Object.assign({}, record)
      // 处理显示专票限额还是普票限额 0:专用 2:普票
      if (String(this.recordInfo.type) === '0') {
        this.invKindLimitType = 0
      } else if (String(this.recordInfo.type) === '2') {
        this.invKindLimitType = 2
      }
      // 组装开票单位数据
      if (this.recordInfo.invoiceUnitId) {
        this.recordInfo.invoiceUnitId = { key: this.recordInfo.invoiceUnitId, label: this.recordInfo.invoiceUnit }
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.recordInfo, 'type', 'generalTicketLimit', 'specialTicketLimit', 'invoiceUnitId')
        )
      })
    },
    // 关闭
    handleCancel() {
      this.form.resetFields()
      this.confirmLoading = false
      this.isEdit = false
      this.recordInfo = {}
      this.companyList = []
      this.visible = false
    },
    // 选择发票类型
    invKindOnChange(e) {
      // 0:专用 2:普票
      this.invKindLimitType = Number(e.target.value)
    },
    // 保存
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          // 处理开票单位
          const parameters = Object.assign({}, values)
          parameters.invoiceUnit = values.invoiceUnitId.label || ''
          parameters.invoiceUnitId = values.invoiceUnitId.key || ''
          if (!that.isEdit) {
            // 此处，新增不传status,后台接口报错（后期应该会修改）
            parameters.status = 0
          } else {
            parameters.id = that.recordInfo.id
          }
          const httpUrl = that.isEdit ? that.url.edit : that.url.save
          const method = that.isEdit ? 'put' : 'post'
          httpAction(httpUrl, parameters, method)
            .then(res => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.handleCancel()
              } else {
                that.$message.warning(res.msg || res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.printAddressConfigModal {
  .stepFormText {
    :global(.ant-form-item-label) {
      width: 120px;
      text-align: left;
    }
  }
}
</style>
