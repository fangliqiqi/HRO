<template>
  <a-modal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        class="ant-advanced-search-form"
        layout="vertical"
      >
        <a-form-item
          label="合同原件"
        >
          <a-upload-dragger
            name="file"
            :fileList="fileList"
            @change="handleChange"
            :beforeUpload="beforeUpload"
            :remove="removeFile"
            accept="image/*,.xls,.xlsx,.csv,.pdf"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">点击或者拖拽上传合同原件</p>
          </a-upload-dragger>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { postActionHeader,httpAction } from '@/api/manage'

export default {
  name: 'ContractFileModal',
  data() {
    return {
      visible: false,
      title: '上传归档文件',
      confirmLoading: false,
      form: this.$form.createForm(this),
      fileList:[],
      isUpload:true,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      validatorRules: {
        auditUserRequired: { rules: [{ required: true, message: '审核人不能为空!' }] },
      },
      url: {
        submitBatch: '/hrBase/tcustomercontract/handleAndArchive/',
        importUrl:'/hrBase/fileUpload/ossUploadFile',
        delAttachUrl:'/hrBase/fileUpload/ossFileDelete/'
      }
    }
  },
  methods: {
    showModal(record) {
      this.model = Object.assign({},record)
      this.visible = true
      this.form.resetFields()
    },
    handleChange() {
      if(this.isUpload) {
        const { fileList } = this
        this.uploadFilesChange(fileList[fileList.length - 1])
      }
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    uploadFilesChange(file) { // 上传图片
      const _this = this
      const formData = new FormData()
      formData.append('file', file)
      formData.append("type", 3)
      formData.append("domain", this.model.id)
      const contextType = { 'Content-Type': 'multipart/form-data' }
      postActionHeader(this.url.importUrl, formData, contextType,60000).then((res) => {
        if(res.code === 200){
          _this.$set(_this.fileList,_this.fileList.length - 1,res.data)
          _this.$message.success('上传合同原件成功')
        }else{
          _this.fileList.splice(_this.fileList.length - 1,1)
          _this.$message.warning(res.msg)
        }
      })
    },
    removeFile(fileInfo){
      this.isUpload = false
      const _this = this
      this.$confirm({
        title: '删除',
        content: '确定删除该合同原件？',
        okText: '确认',
        cancelText: '取消',
        onOk:function(){

          httpAction(`${_this.url.delAttachUrl+fileInfo.uid}?type=3` ,null , 'GET').then((res) => {
            console.log(res);
            if (res.code === 200) {
              _this.fileList.map((file,index)=>{
                if(String(file.uid) === String(fileInfo.uid)){
                  //删除该附件
                  _this.fileList.splice(index,1);
                }
              })
              _this.$message.success('删除合同原件成功！')
            } else {
              _this.$message.warning(res.msg)
            }
          }).finally(()=>{
            _this.isUpload = true
          })
        },
      });
      return false
    },

    handleOk() {
      if(this.fileList.length === 0){
        this.$message.warning('请先上传归档文件')
      }else{
        this.close()
      }
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    }
  }
}
</script>
