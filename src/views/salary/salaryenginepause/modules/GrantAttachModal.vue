<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="confirmVisible"
    @ok="handleConOk"
    @cancel="handleConCancel"
    cancelText="取消"
    okText="确定"
    :confirmLoading="conLoading"
  >
    <div v-if="title == '发放工资'">
      <p class="gtit">确定全额发放工资吗？</p>
    </div>
    <div v-else>
      <a-form :form="grantForm">
        <a-form-item
          label="余额"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <span>{{ grantOne.balance }}</span>
        </a-form-item>
        <a-form-item
          label="发放金额"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['balanceSpilit', { rules: [{ required: true, message: '请输入金额!' },{pattern:/^(([1-9][0-9]{0,10})|(([0]\.\d{1,2}|[1-9][0-9]{0,10}\.\d{1,2})))$/,message: '金额格式不正确!' }] } ]" />
        </a-form-item>
      </a-form>
    </div>
    

    <a-form :form="grantForm">
      <a-form-item
        label="三方协议"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-upload
          @change="(file)=>handleUploadChange(file,'0')"
          :beforeUpload="(file)=>beforeUpload(file,'0')"
          :fileList="fileList['0']"
          :remove="(file)=>removeFile(file,'0')"
        >
          <a-button> <a-icon type="upload" /> 上传 </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item
        label="委托付款函"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-upload
          @change="(file)=>handleUploadChange(file,'1')"
          :beforeUpload="(file)=>beforeUpload(file,'1')"
          :fileList="fileList['1']"
          :remove="(file)=>removeFile(file,'1')"
        >
          <a-button> <a-icon type="upload" /> 上传 </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item
        label="劳务费"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-upload
          @change="(file)=>handleUploadChange(file,'2')"
          :beforeUpload="(file)=>beforeUpload(file,'2')"
          :fileList="fileList['2']"
          :remove="(file)=>removeFile(file,'2')"
        >
          <a-button> <a-icon type="upload" /> 上传 </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item
        label="其他证明材料"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-upload
          @change="(file)=>handleUploadChange(file,'3')"
          :beforeUpload="(file)=>beforeUpload(file,'3')"
          :fileList="fileList['3']"
          :remove="(file)=>removeFile(file,'3')"
        >
          <a-button> <a-icon type="upload" /> 上传 </a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
export default {
  name:'GrantAttachModal',
  data() {
    return {
      conLoading: false,
      confirmVisible: false,
      grantForm:this.$form.createForm(this),
      grantOne:{},
      url:{
        allUrl: '/salary/tpausesalary/doIssueAll',
        doIssueSplit: '/salary/tpausesalary/doIssueSplit',
        doIssueAllByBatch:'/salary/tpausesalary/doIssueAllByBatch'
      },
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      uploadFiles: {
        "0":[],
        "1":[],
        "2":[],
        "3":[],
      },
      fileList:{
        "0":[],
        "1":[],
        "2":[],
        "3":[],
      },
      type: 0, // 0全部发放1拆分发放
      title: '',
      canUpload:true,
    }
  },
  methods:{
    show(record,type){
      this.type = type
      this.title = type ? '拆分发放' : '发放工资'
      this.confirmVisible = true
      this.grantOne = record
      if(type){
        this.grantForm.resetFields();
      }
    },
    handleSubmit(query,url){
      this.conLoading = true
      const params = {tpauseSalary:this.grantOne.id,engineerType:[],files:[]}
      const formData = new FormData();
      // 多文件上传
      for(const key in this.uploadFiles){
        if(this.uploadFiles[key].length){
          this.uploadFiles[key].forEach(file=>{
            formData.append(`files`,file);
          })
        }
        this.uploadFiles[key].forEach(()=>{
          params.engineerType.push(key);
        })
      }
      formData.append(`id`,this.grantOne.id);
      formData.append(`engineerType`,params.engineerType);
      if(query){
        formData.append(`type`,this.grantOne.type);
        formData.append(`issueMoney`,query.balanceSpilit);
      }

      httpAction(url,formData,'POST').then((res) => {
        if(Number(res.code) === 200){
          this.$message.success("成功");
          this.handleConCancel();
          this.$emit("ok");
        }else{
          this.$message.error(res.msg)
        }
      }).finally(()=>{
        setTimeout(() => {
          this.conLoading = false
        }, 2000);
      })
    },
    handleConOk(){
      // 拆分发放
      if(this.type){
        this.grantForm.validateFields((err,values) => {
          if(!err){
            this.handleSubmit(values,this.url.doIssueSplit)
          }
        })
        return false
      }

      let isSend = true
      if(this.grantOne.salaryStyle == 1){
        if(this.grantOne.bankName == '' || this.grantOne.bankNo == ''){
          isSend = false
          this.$message.error("没有开户行不能发放")
        }
      }
      if(isSend){
        this.handleSubmit(null,this.url.allUrl)
      }
    },
    beforeUpload(file,index){
      if(file.size / 1024 / 1024 > 5){
        this.$message.error('附件不能超过5MB!');
        this.canUpload = false
        return false
      }
      this.canUpload = true

      this.uploadFiles[index].push(file);
    },
    handleUploadChange(file,index){
      if(this.canUpload){
        this.fileList[index] = this.uploadFiles[index].map(item=>{
          return {
            uid: item.uid,
            name: item.name,
            status: 'done',
            // url: item.name,
            url:URL.createObjectURL(item)
          }
        })
      }
    },
    removeFile(file,index){
      this.canUpload = false
      const i = this.uploadFiles[index].findIndex(item=>item.uid === file.uid);
      this.uploadFiles[index].splice(i,1);
      this.fileList[index] = this.uploadFiles[index].map(item=>{
        return {
          uid: item.uid,
          name: item.name,
          status: 'done',
          // url: item.name,
          url:URL.createObjectURL(item)
        }
      })
    },
    handleConCancel(){
      this.confirmVisible = false
      this.uploadFiles = {
        "0":[],
        "1":[],
        "2":[],
        "3":[],
      }
      this.fileList = {
        "0":[],
        "1":[],
        "2":[],
        "3":[],
      }
    },
  }
}

</script>


<style scoped>
.gtit{
  font-size: 15px;
  padding-left: 50px;
  color: #333;
  font-weight: bold;
}
</style>