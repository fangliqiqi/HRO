<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    cancelText="关闭"
    :footer="null"
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

        <a-tabs defaultActiveKey="0" @change="changeCallback">
          <a-tab-pane tab="普通附件" key="0">
            <a-row>
              <a-col :span="24">
                <a-upload-dragger
                  :multiple="true"
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
                  <p class="ant-upload-text">点击或者拖拽上传普通附件</p>
                </a-upload-dragger>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="电子保单" key="1">
            <a-row>
              <a-col :span="24">
                <a-upload-dragger
                  :multiple="true"
                  name="file"
                  :fileList="fileListBd"
                  @change="handleChangeBd"
                  :beforeUpload="beforeUploadBd"
                  :remove="removeFile"
                  accept="image/*,.xls,.xlsx,.csv,.pdf"
                >
                  <p class="ant-upload-drag-icon">
                    <a-icon type="inbox" />
                  </p>
                  <p class="ant-upload-text">点击或者拖拽上传电子保单</p>
                </a-upload-dragger>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
        
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,postActionHeader } from '@/api/manage'
  import { hasPermissionToPage } from '../../../../store/modules/permission'

  export default {
    name: 'DispatchApplyUploadModal',
    data() {
      return {
        ids: '',
        model: {},
        title: '上传附件',
        visible: false,
        confirmLoading: false,
        fileList: [], //普通附件
        fileListBd:[], //电子保单
        isUpload:true,
        activeKey:0,
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        url: {
          importUrl:'/busiInsurance/tinsuranceatta/upload', //上传文件
          attachUrl:'/busiInsurance/tinsuranceatta/geteAttaById/', //附件预览
          delAttachUrl:'/busiInsurance/tinsuranceatta/'
        }
      }
    },
    methods: {
      add() {
        const _this=this
        httpAction(this.url.attachUrl+this.insuranceId+'?policyType=0', '', 'GET').then((res) => {
          if (res.code === 200) {
           this.fileList=[]
            for(const obj of res.data){
              this.fileList.push({
                uid:obj.id,
                name:obj.attaName,
                url:obj.attaUrl,
              })
            }
          } else {
            _this.$message.warning(res.msg)
          }
        })
        httpAction(this.url.attachUrl+this.insuranceId+'?policyType=1', '', 'GET').then((res) => {
          if (res.code === 200) {
           this.fileListBd=[]
            for(let obj of res.data){
              this.fileListBd.push({
                uid:obj.id,
                name:obj.attaName,
                url:obj.attaUrl,
              })
            }
          } else {
            _this.$message.warning(res.msg)
          }
        })
        
        this.visible = true
      },
      removeFile(fileInfo){
        this.isUpload = false
        const _this = this
        this.$confirm({
          title: '删除',
          content: '确定删除该附件？',
          okText: '确认',
          cancelText: '取消',
          onOk:function(){
            if(hasPermissionToPage('wxhr:tinsuranceatta_del',_this.$route)) {
              httpAction(_this.url.delAttachUrl+fileInfo.uid, {id:fileInfo.uid}, 'DELETE').then((res) => {
                if (res.code === 200) {
                  if(_this.activeKey == 0){
                    _this.fileList.map((file,index)=>{
                      if(String(file.uid) === String(fileInfo.uid)){
                        //删除该附件
                        _this.fileList.splice(index,1)
                      }
                    })
                    _this.$message.success('删除普通附件成功！')
                  }else{
                    _this.fileListBd.map((file,index)=>{
                      if(file.uid == fileInfo.uid){
                        //删除该附件
                        _this.fileListBd.splice(index,1)
                        return
                      }
                    })
                    _this.$message.success('删除电子保单附件成功！')
                  }
                } else {
                  _this.$message.warning(res.msg)
                }
              }).finally(()=>{
                _this.isUpload = true
              })
            }else{
              _this.$message.warning('暂无删除附件权限')
              _this.isUpload = true
            }
          },
        });
        return false
      },
      changeCallback(key){
        this.activeKey = key
      },
      beforeUploadBd(){
        return false
      },
      handleChangeBd(file){
        if(!this.isUpload) return false

        const _this = this
        const formData = new FormData()
        formData.append('file', file.file)
        formData.append("insuranceId", this.insuranceId);
        let contextType = { 'Content-Type': 'multipart/form-data' }
        postActionHeader(this.url.importUrl+'?policyType=1', formData, contextType).then((res) => {
          if(res.code == 200){
            _this.fileListBd.push({
              uid:res.data.id,
              name:res.data.attaName,
              status:'done',
              url:res.data.attaUrl,
            })
            this.$message.success('上传电子保单附件成功')
          }else{
            this.$message.warning(res.msg)
          }
        })

      },
      handleChange() {
        const { fileList } = this
        this.uploadFilesChange(fileList[fileList.length - 1])
      },
      beforeUpload(file) {
        this.fileList = [...this.fileList, file]
        return false;
      },
      uploadFilesChange(file) { // 上传图片
        const _this = this
        const formData = new FormData()
        formData.append('file', file)
        formData.append("insuranceId", this.insuranceId);
        let contextType = { 'Content-Type': 'multipart/form-data' }
        postActionHeader(this.url.importUrl+'?policyType=0', formData, contextType).then((res) => {
          if(res.code == 200){
            this.$set(_this.fileList,_this.fileList.length - 1,{
              uid:res.data.id,
              name:res.data.attaName,
              status:'done',
              url:res.data.attaUrl,
            })
            this.$message.success('上传附件成功')
          }else{
            _this.fileList.splice(_this.fileList.length - 1,1)
            this.$message.warning(res.msg)
          }
        })

      },
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.activeKey = 0
        this.fileList = this.fileListBd = []
      }
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
</style>
