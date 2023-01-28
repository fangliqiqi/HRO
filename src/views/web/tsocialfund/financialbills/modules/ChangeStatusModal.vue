
<template>
  <a-modal
    :width="800"
    title="操作"
    placement="right"
    :closable="false"
    :visible="visible"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <p class="title" v-if="model.deleteFlag == 1">启用后，若该客户未足额回款，将会限制进行社保、公积金派增，确定要启用吗？</p>
            <p class="title" v-if="model.deleteFlag == 0">禁用后，若该客户未足额回款，仍可以进行社保、公积金派增，确定要禁用吗？</p>
          </a-col>
          <a-col :span="24">
            <a-form-item label="说明" class="labelTxt">
              <a-textarea
                v-decorator="['remark',{rules: [{ required: model.deleteFlag == 1 ? false : true, message: '请输入说明!' },{max:200,message:'最多200个字符!'}]}]"
                style="width: 600px;height:100px;resize:none;"
              ></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="附件" class="uploadStyle labelTxt">
              <a-upload
                :fileList="fileList"
                v-decorator="['upload']"
                :multiple="false"
                :beforeUpload="beforeUpload"
                :remove="removeFile"
              >
                <div>
                  <a-button><a-icon type="upload" />点击上传</a-button>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>
    </a-spin>
    
  </a-modal>
</template>

<script>
  import { httpActionHeader } from '@/api/manage'

  export default {
    name: "ChangeStatusModal",
    data(){
      return {
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        model: {},
        uploadFile: [],
        fileList: []
      }
    },
    methods:{
      show(record,flag){
        if(flag === false){
          this.model = record;
        }else{
          this.model = {deleteFlag: flag,id:record.join(',')}
        }
        this.visible = true;
      },
      removeFile(file){
        this.fileList = this.fileList.filter(item=>item.uid !== file.uid);
        this.uploadFile = this.uploadFile.filter(item=>item.uid !== file.uid);
      },
      beforeUpload(file) {
        if(file.size/1024/1024 > 5){
          this.$message.warning('附件不能超过5MB!');
          return false;
        }
        this.uploadFile = [...this.uploadFile, file];
        this.fileList = [...this.fileList, {uid:file.uid,status:'done',name:file.name,url:URL.createObjectURL(file)}];
        return false;
      },
      handleOk(){
        const _this = this;
        this.form.validateFields((err, values) => {
          if (!err) {
            // deleteFlag 0启用1禁用 type:0启用；1禁用
            let url = `/hrSocial/tfinancedispatch/batchUse?idStr=${_this.model.id}&type=${_this.model.deleteFlag == 1 ? 0 : 1}`;
            if(values.remark){
              url += `&remark=${values.remark}`;
            }
            let formData = null;
            if(_this.uploadFile.length){
              formData = new FormData();
              _this.uploadFile.forEach(item=>{
                formData.append(`files`,item);
              })
            }
            _this.confirmLoading = true;
            const contextType = { 'Content-Type': 'application/x-www-form-urlencoded' }
            httpActionHeader(url,formData,'POST',contextType,60000).then(res=>{
              if(res.code === 200){
                _this.$message.success(res.msg);
                _this.$emit('ok');
                _this.handleCancel();
              }else{
                _this.$message.warning(res.msg);
              }
            }).finally(()=>{
              setTimeout(()=>{
                _this.confirmLoading = false;
              },2000);
            })
          }
        })
      },
      handleCancel(){
        this.visible = false;
        this.confirmLoading = false;
        this.uploadFile = [];
        this.fileList = [];
        this.model = {};
      }
    }
  }
</script>

<style lang="less" scoped>
  .title{
    font-size: 15px;
    margin-bottom: 40px;
    text-align: center;
    font-weight: bold;
  }
  .uploadStyle{
    display: flex;
    :global(.ant-form-item-control-wrapper){
      width: 600px;
    }
  }
  .labelTxt{
    :global(.ant-form-item-label){
      width: 80px;
    }
  }
</style>