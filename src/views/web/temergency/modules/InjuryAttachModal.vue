<template>
  <a-modal
    :title="title"
    :width="700"
    placement="right"
    :closable="true"
    :visible="visible"
    :footer="null"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirm-loading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-row>
        <a-col :span="24">
          <a-upload-dragger
            :multiple="true"
            name="file"
            :fileList="fileList"
            :beforeUpload="beforeUpload"
            :remove="removeFile"
            @change="handleChange"
            accept="image/*,.xls,.xlsx,.csv,.pdf,.doc,.docx,.m4a,.mp3,.zip,.rar"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">点击或者拖拽上传</p>
          </a-upload-dragger>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, postActionHeader } from '@/api/manage'

export default {
  name: 'InjuryApplyModal',
  components: {
  },
  data() {
    return {
      id:'',
      model: {},
      title: '补充材料',
      visible: false,
      confirmLoading: false,
      method: 'post',
      flag:0,

      form: this.$form.createForm(this),
      fileList: [],

      validatorRules: {
        empPhone: { rules: [{ required: true, message: '请输入联系方式!' }] },
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      url: {
        getAttachUrl:'/hrEmergency/fileUpload/ossFileUrl/domain/',//获取附件
        importUrl: '/hrEmergency/fileUpload/ossUploadFile', //上传文件
        delAttachUrl: '/hrEmergency/fileUpload/ossFileDelete/', //附件删除
      }
    }
  },
  methods: {
    edit(record) {
      this.id = record.id 
      //获取附件信息
      httpAction(this.url.getAttachUrl+record.id+'?type='+this.flag,null,'get').then((res) => {
        if(res.code == 200 && res.data){
          this.fileList = []
          for(let item of res.data){
            this.fileList.push({
              uid:item.id,
              name:item.attaName,
              status:'done',
              url:item.attaSrc,
            })
          }
        }else{
          this.$message.warning(res.msg)
        }
        this.visible = true
      });
    },
    // 保存按钮
    handleOk() {
      console.log(111)
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    //上传
    handleChange() {
      const { fileList } = this
      if(fileList[fileList.length - 1].name.length > 50){
        this.$message.warning(fileList[fileList.length - 1].name+`文件名称长度超过50个字符`)
        this.fileList.splice(this.fileList.length - 1, 1)
        return false
      }
      if(fileList[fileList.length - 1].size > 50*1024*1024){
        this.$message.warning(fileList[fileList.length - 1].name+`文件大小超过50M`)
        this.fileList.splice(this.fileList.length - 1, 1)
        return false
      }
      if (!/\.(gif|jpg|jpeg|png|xls|xlsx|csv|pdf|docx|doc|m4a|zip|rar)$/i.test(fileList[fileList.length - 1].name)) {  
        this.$message.warning(fileList[fileList.length - 1].name+`文件格式不正确`)
        this.fileList.splice(this.fileList.length - 1, 1)
        return false
      }
      this.confirmLoading = true
      this.uploadFilesChange(fileList[fileList.length - 1])
    },
    uploadFilesChange(file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('domainId', this.id)
      formData.append('type', this.flag)
      let contextType = { 'Content-Type': 'multipart/form-data' }
      this.fileList.splice(this.fileList.length - 1, 1)
      postActionHeader(this.url.importUrl, formData, contextType,300000).then(res => {
        if(res.code == 200){
          this.fileList.push(res.data)
          this.$message.success('上传成功！')
        }else{
          this.$message.warning(res.msg)
        }
      }).finally(()=>{
        this.confirmLoading = false
      })
    },
    removeFile(fileInfo) {
      const _this = this
      this.$confirm({
        title: '删除',
        content: '确定删除该附件？',
        okText: '确认',
        cancelText: '取消',
        onOk: function() {
          httpAction(_this.url.delAttachUrl + fileInfo.uid, null, 'get').then(res => {
            if (res.code === 200) {
              _this.fileList.map((file, index) => {
                if (file.uid == fileInfo.uid) {
                  //删除该附件
                  _this.fileList.splice(index, 1)
                  return
                }
              })
              _this.$message.success('删除附件成功！')
            } else {
              _this.$message.warning(res.msg)
            }
          })
        }
      })
      return false
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
.stepFormText {
  :global(.ant-form-item-label) {
    width: 110px;
  }
}
.stepFormlabel {
  :global(.ant-form-item-label) {
    width: 100px;
  }
  margin-bottom: 0px;
}
</style>