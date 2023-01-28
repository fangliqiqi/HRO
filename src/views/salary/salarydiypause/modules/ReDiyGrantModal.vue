<template>
  <a-modal
    :title="title"
    :width="810"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-form layout="inline" :form="form">
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item label="发放金额" class="labelTxt">{{ model.money }}</a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="失败原因" class="labelTxt reason">{{ model.reason }}</a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="失败截图" class="uploadStyle labelTxt">
            <a-upload
              :fileList="fileList"
              :showUploadList="{showRemoveIcon:false}"
              list-type="picture-card"
            >
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider />
      <a-row :gutter="24" class="bottom">
        <a-col :span="24" style="margin-bottom:15px;">请核对并修改错误信息后，点击保存！</a-col>
        <a-col :span="12">
          <a-form-item label="收款单位" class="labTxt">
            <a-input
              placeholder="收款单位"
              @change="changeName"
              v-decorator="['orgName',{ rules: [{max:50,message:'收款单位最多50个字符！'}] }]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24" class="bottom">
        <a-col :span="12">
          <a-form-item label="开户行" class="labTxt">
            <a-input
              placeholder="开户行"
              v-decorator="['bankName',{ rules: [{max:50,message:'开户行最多50个字符！'}] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="银行账号" class="labTxt">
            <a-input
              placeholder="银行账号"
              v-decorator="['bankNo',{ rules: [{max:50,message:'银行账号最多50个字符！'}] }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <template v-if="model.adjustmentType == 0 || (showFile || fileArr.length)">
        <a-divider />
        <a-row>
          <a-col :span="24">
            <a-form-item
              class="stepFormText"
              style="margin-left: 20px"
            >
              调整类型为“换人换卡”时，“换人换卡证明”材料为“必填”，请线下签字后，拍照上传，大小：5M；
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="换人换卡证明"
              class="stepFormText reason1"
            >
              <div>
                <a-button type="link" class="uploadBtn" @click="downTemplate('/templates/换人换卡模板.xlsx')">
                  换人换卡证明材料模板
                </a-button>
              </div>
              <a-upload
                :fileList="fileArr"
                list-type="picture-card"
                accept="image/*"
                v-decorator="['upload', { rules: [{ required: true, message: '请上传证明材料！' }] }]"
                :multiple="false"
                :beforeUpload="beforeUpload"
                :remove="removeFile"
              >
                <div>
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </template>
      
    </a-form>
  </a-modal>
</template>
<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'

export default {
  name:'ReDiyGrantModal',
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
      form:this.$form.createForm(this),
      model:{},
      fileList:[],
      fileArr:[],
      url:'/salary/lostandfoundinfo/doClaim',
      showFile: false,
      uploadFile:[],
    }
  },
  methods:{
    async show(record){
      const res = await httpAction(`/salary/tsalaryatta/getTSalaryAttaListByIdType?linkId=${record.id}&linkType=7`,null,'get');
      if(res.code === 200 && res.data.length){
        this.fileList = res.data.map(item=>{
          return {
            uid: item.id,
            name: item.attaName,
            status: 'done',
            url: item.attaUrl,
          }
        })
      }
      const result = await httpAction(`/salary/tsalaryatta/getTSalaryAttaListByIdType?linkId=${record.id}&linkType=10`,null,'get');
      if(result.code === 200 && result.data.length){
        this.fileArr = result.data.map(item=>{
          return {
            uid: item.id,
            name: item.attaName,
            status: 'done',
            url: item.attaUrl,
          }
        })
      }
      this.model = record;
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({...record,...{upload: this.fileArr}}, 'bankName','bankNo','orgName','upload'))
      })
    },
    downTemplate(templateUrl){
      const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`;
      window.location.href = url;
    },
    changeName(e){
      this.showFile = this.model.empName === e.target.value ? false : true;
    },
    removeFile(file){
      if(/^blob/.test(file.url)){
        this.fileArr = this.fileArr.filter(item=>item.uid !== file.uid);
        this.uploadFile = this.uploadFile.filter(item=>item.uid !== file.uid);
      }else{
        httpAction(`/salary/lostandfoundinfo/ossFileDelete/${file.uid}`, null, 'get').then((res) => {
          if(res.code === 200){
            this.$message.success('删除成功!');
            this.fileArr = this.fileArr.filter(item=>item.uid !== file.uid);
          }else{
            this.$message.warning(res.msg);
          }
        })
      }
    },
    beforeUpload(file) {
      if(file.size/1024/1024 > 5){
        this.$message.warning('附件不能超过5MB!');
        return false;
      }
      this.uploadFile = [...this.uploadFile, file];
      this.fileArr = [...this.fileArr, {uid:file.uid,status:'done',name:file.name,url:URL.createObjectURL(file)}];
      return false;
    },
    handleCancel(){
      this.visible = false;
      this.model = {};
      this.fileList = [];
      this.fileArr = [];
      this.uploadFile = [];
      this.showFile = false;
    },
    handleOk(){
      const _this = this
      this.form.validateFields((err,values) => {
        if(!err){
          // 判读是否上传文件
          if(values.upload && _this.fileArr.length === 0){
            _this.$message.warning(`请上传证明材料！`);
            return false;
          }
          this.confirmLoading = true;
          // const params = {...values,...{id:this.model.id,accountType:4,adjustmentType: (this.model.adjustmentType == 0 || this.showFile) ? 0 : 1}}
          const params = Object.assign(_this.model, values);
          const formData = new FormData();
          formData.append(`id`,params.id);
          formData.append(`accountType`,4);
          formData.append(`adjustmentType`,(_this.model.adjustmentType == 0 || _this.showFile) ? 0 : 1);
          formData.append(`bankName`,params.bankName);
          formData.append(`bankNo`,params.bankNo);
          formData.append(`orgName`,params.orgName);
          formData.append(`empName`,'');
          formData.append(`empIdcard`,params.empIdcard);

          _this.uploadFile.forEach(item=>{
            formData.append(`files`,item);
          })
          httpAction(this.url,formData,'POST').then((res) => {
            if(Number(res.code) === 200){
              _this.$message.success("操作成功!");
              _this.handleCancel();
              _this.$emit('ok')
            }else{
              _this.$message.warning(res.msg);
            }
          }).finally(()=>{
            setTimeout(()=>{
              _this.confirmLoading = false;
            },2000)
          })
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.uploadStyle{
  :global(.ant-upload-list){
    float: left;
  }
}
:global(.labelTxt .ant-form-item-label){
  width: 110px;
}
:global(.labTxt .ant-form-item-label){
  width: 110px;
}
:global(.uploadStyle .ant-form-item-control-wrapper){
  width: 610px;
}
:global(.reason .ant-form-item-control-wrapper){
  width: 610px;
}
:global(.reason .ant-form-item-control){
  line-height: 26px;
  margin: 8px 0px 15px;
}

.bottom .ant-form-item{
  height: 70px;
  margin-bottom: 0px;
  .ant-input{
    width: 230px;
  }
}
.reason1{
  display: flex;
  :global(.ant-form-item-control-wrapper){
    width: 610px;
  }
}
.uploadStyle{
  :global(.ant-upload-list){
    float: left;
  }
}
.uploadBtn{
  padding: 0px;
  :global(span){
    text-decoration: underline;
  }
}
</style>
