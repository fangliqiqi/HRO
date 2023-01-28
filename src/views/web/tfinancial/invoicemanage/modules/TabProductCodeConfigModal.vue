<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
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
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-upload-dragger
              name="file"
              :fileList="fileList"
              :beforeUpload="beforeUpload"
              :remove="removeFile"
              @change="fileUploadChange"
              accept=".txt"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">点击或者拖拽上传</p>
            </a-upload-dragger>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <error-modal
      ref="errorModal"
      @ok="errorModalFormOk"
    ></error-modal>
  </a-modal>
</template>
<script>
import { httpAction,postActionHeader } from '@/api/manage'
import ErrorModal from '../../../global/modules/ErrorModal'
export default {
  components:{
    ErrorModal
  },
  data() {
    return {
      title: '操作',
      visible: false,
      isDisabled: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      isEdit: false, // 当前是编辑还是新增，默认新增
      companyList: [], // 公司列表
      fileList: [], // 文件上传列表
      url: {
        save: '/salary/tgoodstaxnoset/loadGoodsTaxNoSetFile', // 保存
        hrCompanyList: '/salary/tinvoicecompanyset/getInvoiceCommpanySetList' // 公司列表
      }
    }
  },
  methods: {
    show() {
      this.getHRCompanyList()
      this.visible = true
    },
    // 关闭
    handleCancel() {
      this.form.resetFields()
      this.confirmLoading = false
      this.isEdit = false
      this.companyList = []
      this.fileList = []
      this.visible = false
    },
    // 获取公司列表数据
    getHRCompanyList() {
      httpAction(this.url.hrCompanyList, null, 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.companyList = res.data
        } else {
          this.$message.error(res.msg || '公司列表数据获取失败')
        }
      })
    },
    // 上传附件前
    beforeUpload(file) {
      this.fileList = [file]
      return false
    },
    // 上传
    fileUploadChange() {
    },
    // 删除上传的附件
    removeFile() {
      const that = this
      this.$confirm({
        title: '删除',
        content: '确定删除该附件？',
        okText: '确认',
        cancelText: '取消',
        onOk: function() {
          //删除该附件
          that.fileList.splice(0, 1)
        }
      })
    },
    // 提交保存
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          // 处理公司数据
          values.companyName = values.companyId.label || ''
          values.companyId = values.companyId.key || ''
          // 校验文件
          const fileList = that.fileList
          if (!fileList.length) {
            that.$message.error('请选择上传商品编码附件!')
            return
          }
          const file = fileList[0]
          if (file.name.length > 50) {
            that.$message.warning(`${fileList[fileList.length - 1].name}文件名称长度超过50个字符`)
            return
          }
          if (file.size > 10 * 1024 * 1024) {
            that.$message.warning(`${fileList[fileList.length - 1].name}文件大小超过10M`)
            return
          }
          if (!/\.(txt)$/i.test(file.name)) {
            that.$message.warning(`${fileList[fileList.length - 1].name}文件格式不正确`)
            return
          }
          that.handleCommit(file,values)
        }
      })
    },
    // 提交保存接口
    handleCommit(file,values) {
      this.confirmLoading = true
      const formData = new FormData()
      formData.append('file', file)
      formData.append('companyId', values.companyId)
      formData.append('companyName', values.companyName)
      const contextType = {'Content-Type': 'multipart/form-data'};
      postActionHeader(this.url.save, formData,contextType,300000).then((res) => {
          if(Number(res.code) === 200){
            const msg = res.message || res.msg
            if (res.errorMessageList != null && res.errorMessageList.length > 0) {
              this.$refs.errorModal.title = `导入提示: ${msg}`
              this.$refs.errorModal.message = msg
              this.$refs.errorModal.showModal(res.errorMessageList)
            } else {
              this.$message.success("导入成功！")
              this.$emit('ok')
              this.handleCancel()
            }
          }else{
            this.$message.warning(res.msg)
          }
        }).finally(()=>{
          this.confirmLoading = false
        })
    },
    // 出错弹出窗回调
    errorModalFormOk(){
      this.$emit('ok')
      this.handleCancel()
    }
  }
}
</script>
