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
              label="公司名称"
              class="stepFormText"
            >
              <a-select
                showSearch
                label-in-value
                optionFilterProp="children"
                placeholder="请选择公司名称"
                :disabled="isDisabled"
                v-decorator="['companyId', {rules: [{ required: true, message: '请选择公司名称！' }]}]"
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
          <a-col :span="12">
            <a-form-item
              label="打印人"
              class="stepFormText"
            >
              <select-page
                :labelInValue="true"
                :searchUrl="'/admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                :placeholder="'请选择打印人'"
                :id="'userId'"
                :triggerChange="true"
                :modeType="'multiple'"
                v-decorator="['printUser', {rules: [{ required: true, message: '请选择打印人！'}]} ]"
                style="width:250px;"
              ></select-page>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="证书密码"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入证书密码"
                v-decorator="['certPassword',{rules: [{ required: true, message: '请输入证书密码！'}]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="分机号"
              class="stepFormText"
            >
              <a-input-number
                :disabled="isDisabled"
                placeholder="请输入分机号"
                :formatter="value =>`${value}`.substring(0,6)"
                v-decorator="['fjh',{rules: [{ required: true, message: '请输入分机号！'}]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="访问地址"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入访问地址"
                v-decorator="['url',{rules: [{ required: true, message: '请输入访问地址！'}]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="打印机位置信息"
              class="stepFormText"
            >
              <a-input
                :disabled="isDisabled"
                placeholder="请输入打印机位置信息"
                v-decorator="['printMachineAddr',{rules: [{ required: true, message: '请输入打印机位置信息！'}]}]"
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
      recordInfo: {},
      recordId: '', // 当前是编辑页时传入的记录Id
      companyList: [], // 公司列表
      // printerPersonList: [], // 打印人列表
      url: {
        save: '/salary/tinvoiceaddressset', // 保存
        edit: '/salary/tinvoiceaddressset', // 编辑
        // hrUserList: '/admin/user/getHrSysUserList', // 打印人员列表
        hrCompanyList: '/salary/tinvoicecompanyset/getInvoiceCommpanySetList' // 公司列表
      }
    }
  },
  methods: {
    show() {
      this.visible = true
      // 获取打印人员列表
      // this.loadHRUser()
    },
    // 编辑
    edit(recordId, record) {
      this.recordId = recordId
      this.isEdit = true
      this.show()
      this.recordInfo = Object.assign({}, record)
      const companyAddObject = this.recordInfo.invoiceAddressSet
      const formData = {
        url: companyAddObject.url,
        printMachineAddr: companyAddObject.printMachineAddr,
        certPassword:companyAddObject.certPassword,
        fjh:companyAddObject.fjh
      }
      // 组装公司名称数据
      if (companyAddObject) {
        formData.companyId = { key: companyAddObject.companyId, label: companyAddObject.company }
      }
      // 组装打印人数据
      const addrPerRelList = this.recordInfo.addrPerRelList || []
      if (Array.isArray(addrPerRelList) && addrPerRelList.length) {
        const printerList = []
        this.recordInfo.addrPerRelList.forEach(item => {
          printerList.push({ key: item.printUser, label: item.printUserName })
        })
        formData.printUser = printerList
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(formData, 'companyId', 'printUser', 'url', 'printMachineAddr','certPassword','fjh'))
      })
      
    },
    // 关闭
    handleCancel() {
      this.form.resetFields()
      this.isEdit = false
      this.confirmLoading = false
      this.recordInfo = {}
      this.recordId = ''
      this.companyList = []
      // this.printerPersonList = []
      this.visible = false
    },
    // 获取打印人员列表
    // loadHRUser() {
    //   httpAction(this.url.hrUserList, null, 'GET').then(res => {
    //     if (Number(res.code) === 200) {
    //       this.printerPersonList = res.data
    //     } else {
    //       this.$message.warning(res.msg)
    //     }
    //   })
    // },
    // 选择客户单位
    handleUnitSelect(val, option) {
      const text = option.componentOptions.children[0] && option.componentOptions.children[0].text
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({ company: text }, 'company'))
      })
    },
    // 保存
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          const parameters = that.formDataPackage(values)
          if (that.isEdit) {
            parameters.invoiceAddressSet.id = that.recordInfo.invoiceAddressSet.id
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
    },
    // 数据组装
    formDataPackage(data) {
      // 打印人
      const addrPerRelList = []
      data.printUser.forEach(item => {
        const user = {
          printUser: item.key,
          printUserName: item.label
        }
        addrPerRelList.push(user)
      })
      // 各个分公司开票分机地址配置
      const invoiceAddressSet = {
        company: data.companyId.label || '',
        companyId: data.companyId.key || '',
        printMachineAddr: data.printMachineAddr,
        url: data.url,
        fjh:data.fjh,
        certPassword:data.certPassword
      }
      // 最终向后台传的参数
      return {addrPerRelList: addrPerRelList,invoiceAddressSet: invoiceAddressSet}
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
