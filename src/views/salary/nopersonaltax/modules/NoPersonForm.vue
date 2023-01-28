<template>
  <div>
    <a-card
      title="| 提交表单"
      :headStyle="{color:'#1890ff'}"
      style="margin-top:20px"
    >
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="结算金额"
        >
          <span> {{ settlementAmount }} </span>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="款项来源"
        >
          <a-select v-decorator="['setMoneyFrom', {initialValue:salaryStandardInfo.moneyFrom,rules: [{ required: true, message: '请选择客户到款！' }]} ]">
            <a-select-option :value="0">客户到款</a-select-option>
            <a-select-option :value="1">垫付</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注"
        >
          <a-textarea v-decorator="['submitRemark',{rules: [{ max: 250, message: '最多250个字符！' }]}]"></a-textarea>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注2"
        >
          <editor
            v-model="setExcelRemark"
            :init="init"
            :disabled="disabled"
            @onClick="onClick"
          >
          </editor>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="证明材料"
        >
          <a-upload
            v-decorator="['upload']"
            @change="handleUploadChange"
            :beforeUpload="beforeUpload"
            :fileList="attaList"
            :remove="(file)=>remove(file)"
          >
            <a-button>
              <a-icon type="upload" />点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="无发票说明"
        >
          <a-textarea v-decorator="['noAttaRemark',{rules: [{ max: 250, message: '最多250个字符！' }]}]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default/icons.min.js'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import { postActionHeader,httpAction } from '@/api/manage'

export default {
  name:'SalaryFormModal',
  components: {
    Editor
  },
  props: {
    // eslint-disable-next-line
    value: {
      type: String,
      required:false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'lists table textcolor wordcount contextmenu'
    },
    toolbar: {
      type: [String, Array],
      default: 'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
    },
    salaryStandardInfo: {
      type:Object,
      required:true
    },
    settlementAmount: {
      type:String,
      default:null
    },
    attaList: {
      type:Array,
      default:()=>[]
    },

  },
  data() {
    return {
      form: this.$form.createForm(this),
      init: {
          language_url: '/tinymce/langs/zh_CN.js',
          language: 'zh_CN',
          skin_url: '/tinymce/skins/lightgray',
          height: 300,
          plugins: this.plugins,
          toolbar: this.toolbar,
          branding: false,
          menubar: false,
          images_upload_handler: (blobInfo, success) => {
            const img = 'data:image/jpeg;base64,' + blobInfo.base64()
            success(img)
          }
      },
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      validatorRules:{
        setMoneyFrom: { rules: [{ required: true, message: '请选择款项来源!' }] },
      },
      setExcelRemark:this.value,
      current:0,
      canUpload: true, // 是否可以上传
      uploadFiles: []

    }
  },
  // mounted() {
  //   tinymce.init({})
  // },
  methods:{
    show(){
      // if(this.salaryStandardInfo.status > 1){
      //   this.current = this.salaryStandardInfo.status - 1
      // }else{
      //   this.current = this.salaryStandardInfo.status
      // }
      this.current = this.salaryStandardInfo.status
      tinymce.init({})
    },
    onClick(){
      console.log(11111)
    },
    //上传前
    beforeUpload(file) {
      if(file.size / 1024 / 1024 > 5){
        this.$message.error('附件不能超过5MB!');
        this.canUpload = false;
        return false;
      }
      this.canUpload = true;
      this.uploadFiles = [...this.uploadFiles, file];
    },
    handleUploadChange(){
      const { uploadFiles } = this
      if(this.canUpload){
        this.uploadFile(uploadFiles[uploadFiles.length - 1]);
      }
    },
    //请求上传接口
    uploadFile(obj) {
      if(obj.size / 1024 / 1024 > 5){
        this.$message.warning(`文件${obj.name}大于5M!`);
        return false;
      }
      const formData = new FormData();
      formData.append('file', obj);
      formData.append('linkId', this.salaryStandardInfo.id);
      formData.append('linkType', 6);
      formData.append('engineerType', 3);
      const contextType = { 'Content-Type': 'multipart/form-data' };
      postActionHeader(`/salary/tsalaryatta/ossUploadFile`, formData, contextType, 60000)
        .then(res => {
          if (200 === res.code) {
            this.$message.success('上传成功！');
            const url = {
              uid: res.data.uid,
              name: res.data.name,
              status: 'done',
              url: res.data.url
            }
            this.$emit('ok',url,'add');
          }else{
            this.$message.warning(res.msg);
          }
        })
    },
    remove(file){
      this.canUpload = false;
      httpAction(`/salary/tsalaryatta/ossFileDelete/${file.uid}`,{},'GET').then(res=>{
        if(res.code === 200){
          this.$message.success('删除成功！');
          this.$emit('ok',file,'del');

        }else{
          this.$message.warning(res.msg);
        }
      }).finally(()=>{
        this.canUpload = true;
      })
    }
  },
  watch: {
    value(newValue) {
      this.setExcelRemark = newValue
    },
    myValue(newValue) {
      console.log(newValue)
      this.$emit('input', newValue)
    }
  }
}
</script>
