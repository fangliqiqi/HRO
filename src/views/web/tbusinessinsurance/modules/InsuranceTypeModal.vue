<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    :closable="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="保存"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="10">
            <a-form-item
              label="险种"
              class="formLabel"
            >
              <a-input
                placeholder="请填写险种"
                v-decorator="['name', validatorRules.name]"
                style="width: 180px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item
              label="保险公司"
              class="formLabel"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                @search="handleSearch"
                placeholder="请输入保险公司"
                v-decorator="['companyId', validatorRules.companyId]"
                style="width: 180px"
              >
                <a-select-option
                  v-for="(value, key) in insuranceCompanyBelongs"
                  :key="key"
                  :value="value.id"
                >{{ value.companyName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-item
              label="收款银行"
              class="formLabel"
            >
              <a-input
                placeholder="请填写收款银行"
                v-decorator="['bankName', validatorRules.bankName]"
                style="width: 180px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item
              label="收款银行账号"
              class="formLabel"
            >
              <a-input
                placeholder="请填写收款银行账号"
                v-decorator="['bankNo', validatorRules.bankNo]"
                style="width: 180px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-item
              label="收款单位名称"
              class="formLabel"
            >
              <a-input
                placeholder="请填写收款单位名称"
                v-decorator="['receiptUnitName', validatorRules.receiptUnitName]"
                style="width: 180px"
              />
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'InsuranceTypeModal',
    data() {
      return {
        id: 0,
        moment,
        title: '操作',
        visible: false,
        model: {},
        confirmLoading: false,
        form: this.$form.createForm(this),
        insuranceCompanyBelongs:[],

        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          name: { rules: [{ required: true,max:50, message: '请输入正确的险种!' }] },
          companyId: { rules: [{ required: true, message: '请选择保险公司!' }] },
          bankName: { rules: [{ required: true, message: '请填写收款银行!' }] },
          bankNo: { rules: [{ required: true,message:'请输入收款银行账号'},{pattern:/^([0-9]{1})(\d{9,24})$/,message: '收款银行账号必须是10到25位数字!' }] },
          receiptUnitName: { rules: [{ required: true, max:50,message: '请填写正确的收款单位!' }] },
        },
        url: {
          add: '/busiInsurance/tinsurancetype',
          edit: '/busiInsurance/tinsurancetype',
          search: '/busiInsurance/tinsurancecompany/page',
        }
      }
    },

    methods: {
      add() {
        this.edit({})
      },

      edit(record) {
        httpAction(this.url.search,'', 'get').then((res) => {
          if (Number(res.code) === 200 && res.data.records) {
            this.insuranceCompanyBelongs = res.data.records
          }
        })
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'name', 'companyId','bankName','bankNo','receiptUnitName'))
        })
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
            if (!this.model.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }
            const formData = Object.assign(this.model, values)
            httpAction(httpurl, formData, method).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.msg)
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          }
        })
      },

      handleCancel() {
        this.close()
      },

      close() {
        this.$emit('close')
        this.visible = false
        this.disableSubmit = false
        this.employeeBelongs = []
        this.model = {}
      },

      // 搜索
      handleSearch(value) {
        if (value) {
          const that = this
          const method = 'get'
          const httpurl = `${this.url.search}?companyName=${value}`
          httpAction(httpurl, '', method).then((res) => {
              if (Number(res.code) === 200) {
                if  (res.data.records.length > 0) {
                  this.insuranceCompanyBelongs = res.data.records
                }
              } else {
                that.$message.warning('接口异常！')
              }
          })
        }
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}

.formLabel {
  :global(.ant-form-item-label) {
    width: 120px;
  }
}
</style>
