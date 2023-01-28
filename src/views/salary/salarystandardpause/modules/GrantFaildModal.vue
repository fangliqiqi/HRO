<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
  >
    <a-form layout="inline" :form="form">
      <a-row>
        <a-col :span="8">
          <a-form-item label="员工姓名" class="labelTxt">{{ model.name || '-' }}</a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="身份证号" class="labelTxt">{{ model.idCard || '-' }}</a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="发放方式" class="labelTxt">{{ changeTypeOption[model.chargeType] || '-' }}</a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-item label="收款单位" class="labelTxt">{{ model.orgName || '-' }}</a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="开户行" class="labelTxt bankName">{{ model.bankName || '-' }}</a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="银行账号" class="labelTxt">{{ model.bankNo || '-' }}</a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-item label="发放金额" class="labelTxt">{{ model.chargeMoney || '-' }}</a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="失败原因" class="labelTxt">
            <a-textarea
              placeholder="失败原因"
              :rows="3"
              v-decorator="['reason',{ rules: [{ required: true, message: '请输入失败原因!' },{max:200,message:'失败原因最多200个字符！'}] }]"
              style="width:663px;resize:none;margin:10px 0px 0px;"/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="失败截图" class="uploadStyle labelTxt">
            <a-upload
              :beforeUpload="beforeUpload"
              :remove="removeFile"
              :fileList="fileList"
              list-type="picture-card"
              accept="image/*"
            >
              <div>
                <a-icon type="plus" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
            <div style="float:left;">支持jpg、png等格式的多图，单图大小50k以内</div>
          </a-form-item>
          
        </a-col>
      </a-row>

    </a-form>
  </a-modal>
</template>
<script>
import { httpAction } from '@/api/manage'

export default {
  name:'GrantFaildModal',
  props:{
    title:{
      type:String,
      required:true,
    }
  },
  data() {
    return{
      visible:false,
      confirmLoading:false,
      changeTypeOption:{'0':'现金','1':'银付','2':'线下'},
      form:this.$form.createForm(this),
      model:{},
      uploadFile:[],
      fileList:[],
      url:'/salary/lostandfoundinfo/saveLostandfoundinfoByPause'
    }
  },
  methods:{
    show(record){
      this.model = record;
      this.visible = true;
      this.form.resetFields();
    },
    beforeUpload(file){
      if(file.size/1024 > 50){
        this.$message.warning('附件不能超过50kb');
        return false;
      }
      this.uploadFile = [...this.uploadFile, file];
      this.fileList = [...this.fileList, {uid:file.uid,status:'done',name:file.name,url: URL.createObjectURL(file)}];
      return false;
    },
    removeFile(file){
      this.fileList = this.fileList.filter(item=>item.uid !== file.uid);
      this.uploadFile = this.uploadFile.filter(item=>item.uid !== file.uid);
    },
    handleCancel(){
      this.visible = false;
      this.model = {};
      this.uploadFile = [];
      this.fileList = [];
    },
    handleOk(){
      const _this = this;
      this.form.validateFields((err,values) => {
        if(!err){
          _this.confirmLoading = true;
          const formData = new FormData();
          formData.append(`accountType`,3);
          formData.append(`id`,this.model.id);
          formData.append(`reason`,values.reason);
          this.uploadFile.forEach(item=>{
            formData.append(`files`,item);
          })
          httpAction(this.url,formData,'POST').then((res) => {
            if(Number(res.code) === 200){
              this.$message.success("操作成功!")
              this.handleCancel();
              this.$emit('ok')
            }else{
              this.$message.warning(res.msg);
            }
          }).finally(()=>{
            setTimeout(()=>{
              _this.confirmLoading = false;
            },3000)
          })
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.uploadStyle{
  margin-top: 10px;
  :global(.ant-form-item-control-wrapper){
    width: 686px;
  }
  :global(.ant-upload-picture-card-wrapper){
    width: 686px;
    float: left;
  }
}
:global(.labelTxt){
  display: flex;
}
:global(.labelTxt .ant-form-item-label){
  width: 80px;
}
:global(.bankName .ant-form-item-control-wrapper){
  width: 150px;
}
:global(.labelTxt .ant-form-item-control){
  line-height: 26px;
  margin-top: 6px;
}


</style>
