<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
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
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="销售方名称"
            >
              <a-select
                showSearch
                allowClear
                label-in-value
                optionFilterProp="children"
                placeholder="请选择销售方名称"
                :disabled="isDisabled"
                v-decorator="['companyId', {rules: [{ required: true, message: '请选择销售方名称！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 250px"
              >
                <a-select-option
                  v-for="(item, index) in companyList"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.organName }}</a-select-option>
              </a-select>
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
                v-decorator="['taxNb',{rules: [{ required: true, message: '请填写纳税人识别号！'}]}]"
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
                v-decorator="['bank',{rules: [{ required: true, message: '请输入开户行！'}]}]"
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
                :maxLength="42"
                placeholder="请输入银行卡号"
                v-decorator="['bankNo',{rules: [{ required: true, message: '请输入银行卡号！'}]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="开票人"
              class="stepFormText"
            >
              <select-page
                :labelInValue="true"
                :searchUrl="'/admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                :placeholder="'请选择开票人'"
                :id="'userId'"
                :triggerChange="true"
                :modeType="'multiple'"
                v-decorator="['invoicePersonId', {rules: [{ required: true, message: '请选择开票人！'}]} ]"
                style="width:250px;"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="审核人"
              class="stepFormText"
            >
              <select-page
                :searchUrl="'admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                placeholder="请选择审核人"
                :triggerChange="true"
                :id="'userId'"
                :resList="checkerResList"
                v-decorator="['invoiceCheckerId', {rules: [{ required: true, message: '请选择审核人！' }]}]"
                @change="checkerSelectOption"
                style="width:250px;"
              ></select-page>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="收款人"
              class="stepFormText"
            >
              <select-page
                :searchUrl="'admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                placeholder="请选择收款人"
                :triggerChange="true"
                :id="'userId'"
                :resList="payeeResList"
                v-decorator="['invoicePayeeId']"
                @change="payeeSelectOption"
                style="width:250px;"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="复核人"
              class="stepFormText"
            >
              <select-page
                :searchUrl="'admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                placeholder="请选择复核人"
                :triggerChange="true"
                :id="'userId'"
                :resList="reviewerResList"
                v-decorator="['invoiceReviewerId']"
                @change="reviewerSelectOption"
                style="width:250px;"
              ></select-page>
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
                v-decorator="['address']"
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
                v-decorator="['tel']"
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
      title: '操作',
      visible: false,
      isDisabled: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      isEdit: false, // 当前是编辑还是新增，默认新增
      recordInfo: {}, // 当前是编辑页时传入的详细数据
      // invoicePersonList: [], // 开票人员列表数据
      invoiceCheckerData: { invoiceCheckerId: '', invoiceChecker: '' }, // 审核人
      invoicePayeeData: { invoicePayeeId: '', invoicePayee: '' }, // 收款人
      invoiceReviewerData: { invoiceReviewerId: '', invoiceReviewer: '' }, // 复核人
      checkerResList: [], // 审核人编辑时用
      payeeResList: [], // 收款人编辑时用
      reviewerResList: [], // 复核人编辑时用
      companyList: [], // 销售方公司列表
      url: {
        save: '/salary/tinvoicecompanyset', // 保存
        edit: '/salary/tinvoicecompanyset', // 编辑
        // hrUserList: '/admin/user/getHrSysUserList', // HR人员列表
        sellerCompanyList: '/admin/organizationinfo/getOrgForCus' // 销售方名称
      }
    }
  },
  methods: {
    // 审核人点击选择
    checkerSelectOption(value, option) {
      if (value) {
        const text = option.componentOptions.children[0].text
        const Id = value
        this.invoiceCheckerData = {
          invoiceCheckerId: Id,
          invoiceChecker: text
        }
      } else {
        this.invoiceCheckerData = {}
      }
    },
    // 收款人点击选择
    payeeSelectOption(value, option) {
      if (value) {
        const text = option.componentOptions.children[0].text
        const Id = value
        this.invoicePayeeData = {
          invoicePayeeId: Id,
          invoicePayee: text
        }
      } else {
        this.invoicePayeeData = {}
      }
    },
    // 复核人点击选择
    reviewerSelectOption(value, option) {
      if (value) {
        const text = option.componentOptions.children[0].text
        const Id = value
        this.invoiceReviewerData = {
          invoiceReviewerId: Id,
          invoiceReviewer: text
        }
      } else {
        this.invoiceReviewerData = {}
      }
    },
    show() {
      this.visible = true
    },
    // 关闭
    handleCancel() {
      this.form.resetFields()
      this.recordInfo = {}
      this.isEdit = false
      this.confirmLoading = false
      this.recordInfo = {}
      this.companyList = []
      this.checkerResList = []
      this.payeeResList = []
      this.reviewerResList = []
      this.invoiceCheckerData = {}
      this.invoicePayeeData = {}
      this.invoiceReviewerData = {}
      this.visible = false
    },
    // 编辑
    edit(record) {
      this.isEdit = true
      this.recordInfo = record
      // 组装销售方
      if (record.companyId) {
        this.recordInfo.companyId = { key: record.companyId, label: record.company }
      }
      // 审核人
      if (this.recordInfo.invoiceCheckerId) {
        this.checkerResList = [{ id: record.invoiceCheckerId, title: record.invoiceChecker }]
        this.invoiceCheckerData = { invoiceCheckerId: record.invoiceCheckerId, invoiceChecker: record.invoiceChecker }
      } else {
        this.checkerResList = []
        this.recordInfo.invoiceCheckerId = undefined
      }
      // 收款人
      if (this.recordInfo.invoicePayeeId) {
        this.payeeResList = [{ id: record.invoicePayeeId, title: record.invoicePayee }]
        this.invoicePayeeData = { invoicePayeeId: record.invoicePayeeId, invoicePayee: record.invoicePayee }
      } else {
        this.payeeResList = []
        this.recordInfo.invoicePayeeId = undefined
      }
      // 复核人
      if (this.recordInfo.invoiceReviewerId) {
        this.reviewerResList = [{ id: record.invoiceReviewerId, title: record.invoiceReviewer }]
        this.invoiceReviewerData = {
          invoiceReviewerId: record.invoiceReviewerId,
          invoiceReviewer: record.invoiceReviewer
        }
      } else {
        this.reviewerResList = []
        this.recordInfo.invoiceReviewerId = undefined
      }
      // 开票人
      if (this.recordInfo.invoicePersonId) {
        const idlist = this.recordInfo.invoicePersonId.split(',')
        const namelist = this.recordInfo.invoicePerson.split(',')
        const resultList = []
        idlist.forEach((element, index) => {
          const obj = {
            key: element,
            label: namelist[index]
          }
          resultList.push(obj)
        })
        this.recordInfo.invoicePersonId = resultList
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.recordInfo,
            'companyId',
            'taxNb',
            'bank',
            'bankNo',
            'invoicePersonId',
            'invoiceCheckerId',
            'invoicePayeeId',
            'invoiceReviewerId',
            'address',
            'tel'
          )
        )
      })
      this.show()
    },
    // 保存
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          const parameters = that.configData(values)
          that.confirmLoading = true
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
    },
    // 处理最后提交的数据
    configData(values) {
      // 处理开票人，审核人，收款人上传参数格式（id和名称都要传）
      const idArray = []
      const nameArray = []
      values.invoicePersonId.forEach(item => {
        idArray.push(item.key)
        nameArray.push(item.label)
      })
      values.invoicePersonId = idArray.join(',')
      values.invoicePerson = nameArray.join(',')
      // 审核人
      values.invoiceChecker = this.invoiceCheckerData.invoiceChecker
      // 收款人
      if (values.invoicePayeeId) {
        values.invoicePayee = this.invoicePayeeData.invoicePayee
      }
      // 复核人
      if (values.invoiceReviewerId) {
        values.invoiceReviewer = this.invoiceReviewerData.invoiceReviewer
      }
      // 公司名称
      values.company = values.companyId.label || ''
      values.companyId = values.companyId.key || ''
      if (this.isEdit) {
        values.id = this.recordInfo.id
      }
      return values
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
