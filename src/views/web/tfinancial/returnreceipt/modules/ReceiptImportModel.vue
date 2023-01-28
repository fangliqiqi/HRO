<template>
  <a-modal
    :title="title"
    :width="600"
    placement="right"
    @ok="handleOk"
    @cancel="handleCancel"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="false"
    :confirmLoading="confirmLoading"
  >
    <a-form
      :form="form"
      :label-col="{ span: 4 }" 
      :wrapper-col="{ span: 20 }"
    >
      <a-row>
        <a-col :span="24">
          <a-form-item 
            label="备注"
          >
            <a-textarea 
              v-decorator="['remark']"
              placeholder="请输入备注，字数200以内！"
              :rows="2"
              :maxLength="200"
            ></a-textarea>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="附件上传:"
          >
            <a-upload
              :fileList="fileList"
              :remove="handleRemove"
              :beforeUpload="beforeUpload"
              @change="handleUpload"
              accept=".jpg,.jpeg,.png,.JPG,.JPEG,.pdf,.doc,.docx,.docx,.xls,.xlsx,.rar,.zip"
              v-decorator="['fileId', {rules: [{ required: true, message: '请上传文件!' }]}]"
            >
              <a-button type="primary">添加文件</a-button>
            </a-upload>           
          </a-form-item>
        </a-col>
      </a-row>
      
      
    </a-form>

  </a-modal>
</template>
<script>

import { httpAction,postActionHeader } from '@/api/manage'

export default {
  name: 'ReceiptImportModel',
  data () {
    return {
      title:'回执及流水导入',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      isUpload:false,// 判断附件是否上传成功
      receiptName:'',
      fileList:[],
      url:{
        add:'/salary/treceiptinfo/saveReceipt',
        attachmentUploadUrl: '/salary/tsalaryatta/ossUploadFile', //上传接口
        attachmentDelUrl: '/salary/tsalaryatta/ossFileDelete/' //删除文件
      }
    }
  },
  methods:{
    show() {
      this.visible = true;
      this.form.resetFields();
    },

    // 上传附件前
    beforeUpload(file) {
      if(file.size / 1024 / 1024 > 50){
        this.$message.warning('附件不能超过50M!!');
        this.isUpload = true
        return false;
      }else{
        this.isUpload = false
        return false;
      }
    },
    // 上传
    handleUpload(file){
      
      if(!this.isUpload){
        const formData = new FormData()
        // formData.append('linkId', this.grantOne.id)
        formData.append('linkType', 9) //类型：
        formData.append('engineerType', 3)
        formData.append('file', file.file)
        const contextType = { 'Content-Type': 'multipart/form-data' }
        file.file.status = 'error'
        this.confirmLoading = true
        const _this = this
        postActionHeader(_this.url.attachmentUploadUrl, formData, contextType,60000)
          .then(res => {
            if (Number(res.code) === 200) {
              _this.receiptName = file.file.name
              file.file.uid = res.data.uid
              file.file.status = 'done'
              _this.fileList = [file.file]
              _this.form.setFieldsValue({ fileId: res.data.uid})
              _this.$message.success('上传附件成功')
            } else {
              _this.$message.error(res.msg || '附件上传失败！')
            }
          })
          .finally(() => {
            _this.confirmLoading = false
          })
      }
        
    },
    // 删除上传的附件
    handleRemove(file) {
      this.isUpload = true
      const _this = this
      this.$confirm({
        title: '删除',
        content: '确定删除该附件？',
        okText: '确认',
        cancelText: '取消',
        onOk: function() {
          httpAction(_this.url.attachmentDelUrl + file.uid, {}, 'GET').then(result => {
          if (Number(result.code) == 200) {
            // 清除filelist中的文件
            _this.fileList.splice(0, 1)
            _this.form.setFieldsValue({ fileId: '' })
            _this.$message.success(result.msg || '附件删除成功！')
          } else {
            _this.$message.error(result.msg || '附件删除失败！')
          }
        }).finally(() => {
            _this.isUpload = false
          })
        },
        onCancel() {
          let file = _this.form.getFieldValue('fileId')
          _this.form.setFieldsValue({fileId:file.file.uid})
          _this.isUpload = false
        },
      })
    },
    handleOk(){
      this.form.validateFields((err,values) => {
        if(!err){
          this.confirmLoading = true;
          let data = {
            receiptName:this.receiptName,
            fileId: values.fileId,
            remark: values.remark
          }
          httpAction(this.url.add,data,'post',10000 * 20).then((res) => {
            if(Number(res.code) === 200){
              this.$message.success('导入成功');
              this.$emit('ok');
              this.handleCancel();
            }else{
              this.$message.error(res.msg);
            }
          }).finally(()=>{
            const _this = this;
            setTimeout(()=>{
              _this.confirmLoading = false;
            },2000)
            
          })
        }
      })
    },
    handleCancel() {
      this.close();
    },
    close() {
      this.form.resetFields();
      this.visible = false;
      this.fileList = []
      this.confirmLoading = false
    },
  }
}
</script>
