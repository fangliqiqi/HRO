<template>
  <div :style="style">
    <a-card title="| 提交表单" :headStyle="{color:'#1890ff'}" style="margin-top:20px">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="结算金额"
        >{{ settlementAmount }}</a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="款项来源">
          <a-select
            v-decorator="['setMoneyFrom ', {initialValue:salaryStandardInfo.moneyFrom,rules: [{ required: true, message: '请选择客户到款！' }]} ]"
          >
            <a-select-option :value="0" checked>客户到款</a-select-option>
            <a-select-option :value="1">垫付</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="isNeedUpload">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上传三方协议">
            <a-upload
              v-decorator="['uploadf1', { rules: [{ required: f1, message: '请上传三方协议' }] } ]"
              @change="handleUploadChange"
              :beforeUpload="beforeUpload"
              :fileList="uploadConfig.fileList.f1"
              :defaultFileList="uploadConfig.fileList.f1"
              :remove="(file)=>remove(file,'f1')"
              validate-status="success"
            >
              <a-button @click="setUploadName('f1')">
                <a-icon type="upload" />点击上传
              </a-button>
            </a-upload>
            <!-- <a-button type="primary" v-if="uploadConfig.fileList.f1&&uploadConfig.fileList.f1.length>0" @click="previewFile(1)">查看</a-button> -->
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上传委托付款函">
            <a-upload
              v-decorator="['uploadf2', { rules: [{ required: f2, message: '请上传委托付款函' }] } ]"
              @change="handleUploadChange"
              :beforeUpload="beforeUpload"
              :fileList="uploadConfig.fileList.f2"
              :defaultFileList="uploadConfig.fileList.f2"
              :remove="(file)=>remove(file,'f2')"
            >
              <a-button @click="setUploadName('f2')">
                <a-icon type="upload" />点击上传
              </a-button>
            </a-upload>

            <!-- <a-button type="primary" v-if="uploadConfig.fileList.f2&&uploadConfig.fileList.f2.length>0" @click="previewFile(2)">查看</a-button> -->
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上传劳务费明细">
            <a-upload
              v-decorator="['uploadf3', { rules: [{ required: f3, message: '请上传劳务费明细' }] } ]"
              @change="handleUploadChange"
              :beforeUpload="beforeUpload"
              :fileList="uploadConfig.fileList.f3"
              :defaultFileList="uploadConfig.fileList.f3"
              :remove="(file)=>remove(file,'f3')"
            >
              <a-button @click="setUploadName('f3')">
                <a-icon type="upload" />点击上传
              </a-button>
            </a-upload>
            <!-- <a-button type="primary" v-if="uploadConfig.fileList.f3&&uploadConfig.fileList.f3.length>0" @click="previewFile(3)">查看</a-button> -->
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上传其他证明材料">
            <a-upload
              v-decorator="['uploadf4']"
              @change="handleUploadChange"
              :beforeUpload="beforeUpload"
              :fileList="uploadConfig.fileList.f4"
              :defaultFileList="uploadConfig.fileList.f4"
              :remove="(file)=>remove(file,'f4')"
            >
              <a-button @click="setUploadName('f4')">
                <a-icon type="upload" />点击上传
              </a-button>
            </a-upload>
          </a-form-item>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
          <a-textarea v-decorator="['submitRemark']"></a-textarea>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注2">
          <editor v-model="setExcelRemark" :init="init" :disabled="disabled" @onClick="onClick"></editor>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script>
//import pick from 'lodash.pick'
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
import { httpAction, postActionHeader } from '../../../../api/manage'
export default {
  name: 'SalaryEngineFormModal',
  components: {
    Editor
  },
  props: {
    // eslint-disable-next-line
    value: {
      type: String,
      required: false
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
      default:
        'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
    },
    salaryStandardInfo: {
      type: Object,
      required: true
    },

    subject: {
      type: Object,
      default: null
    },
    attaList: {
      type: Object,
      default: null
    },
    destroyOnClose: {
      type: Boolean,
      default: true
    }
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
        menubar: false
        // images_upload_handler: (blobInfo, success) => {
        //   const img = 'data:image/jpeg;base64,' + blobInfo.base64()
        //   success(img)
        // }
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      validatorRules: {
        setMoneyFrom: { rules: [{ required: true, message: '请选择款项来源!' }] }
      },
      setExcelRemark: '',
      current: parseInt(this.salaryStandardInfo.status),
      uploadConfig: {
        attachmentUploadUrl: '/salary/tsalaryatta/ossUploadFile', //上传接口
        attachmentListUrl: '/salary/tsalaryatta/ossFileUrl/', //预览文件列表
        attachmentDelUrl: '/salary/tsalaryatta/ossFileDelete/', //预览文件列表
        fileList: {
          f1: [],
          f2: [],
          f3: [],
          f4: [],
        }
      },
      isNeedUpload: this.subject.isNeedUpload,
      f1: true,
      f2: true,
      f3: true,
      f4: true,
      firstFileUrl: false,
      secondFileUrl: false,
      thirdFileUrl: false,
      style: { display: 'none' },
      settlementAmount: '',
      isUpload: true,
      uploadFiles:[],
      canUpload: true, // 是否可以上传
    }
  },

  // mounted() {
  //   tinymce.init({})
  //   this.getUploadedList()
  // },

  methods: {
    show(settlementAmount) {
      this.settlementAmount = settlementAmount
      // this.firstFileUrl = false
      // this.secondFileUrl = false
      // this.thirdFileUrl = false
      // tinymce.init({})
      // this.setExcelRemark = ''
      this.isNeedUpload = this.subject.isNeedUpload
      this.getUploadedList()
      // this.current = this.salaryStandardInfo.status
      this.style = { display: 'block' }
    },
    close() {
      this.style = { display: 'none' }
    },
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    clear() {
      this.setExcelRemark = ''
    },
    //已上传文件列表
    getUploadedList() {
      for (var i in this.attaList) {
        var keyIndex = parseInt(i.substr(-1, 1)) + 1
        if (this.attaList[i].length) {
          var fileds = new Object()
          var field = `f${keyIndex}`
          fileds['upload' + field] = false;
          this.form.setFieldsValue(fileds);
          this.uploadConfig.fileList[field] = this.attaList[i].map(item=>{
            return {
              uid: item.id,
              name: item.attaName,
              status: 'done',
              url: item.attaUrl
            }
          })
        }
      }
    },
    //上传前
    beforeUpload(file) {
      if(file.size / 1024 / 1024 > 5){
        this.$message.error('附件不能超过5MB!');
        this.canUpload = false
        return false
      }
      this.canUpload = true
      this.uploadFiles = [...this.uploadFiles, file]
      // const fileKeyName = this.uploadConfig.fileKeyName
      // this.uploadConfig.fileList[fileKeyName] = []
      return true
    },
    //监听上传变化
    handleUploadChange() {
      const { uploadFiles } = this
      if(this.isUpload && this.canUpload){
        // this.uploadFile(obj.fileList[index-1]);
        this.uploadFile(uploadFiles[uploadFiles.length - 1]);
      }
    },
    //请求上传接口
    uploadFile(obj) {
      if(obj.size / 1024 / 1024 > 5){
        this.$message.warning(`文件${obj.name}大于5M!`)
        return false
      }
      let fileKeyName = this.uploadConfig.fileKeyName
      const formData = new FormData()
      formData.append('file', obj)
      formData.append('linkId', this.subject.id)
      formData.append('linkType', 1)
      let engineerType = parseInt(fileKeyName.substr(-1, 1)) - 1
      formData.append('engineerType', engineerType) //工程文件类型：0三方协议；1委托付款函；2劳务费3
      let contextType = { 'Content-Type': 'multipart/form-data' }
      // obj.file.status = 'error'
      postActionHeader(this.uploadConfig.attachmentUploadUrl, formData, contextType, 60000)
        .then(res => {
          if (200 == res.code) {
            if (engineerType == 0) {
              this.firstFileUrl = res.data.url
            }
            if (engineerType == 1) {
              this.secondFileUrl = res.data.url
            }
            if (engineerType == 2) {
              this.thirdFileUrl = res.data.url
            }
            this.uploadConfig.fileList[fileKeyName].push(res.data)
          }else{
            this.$message.warning(res.msg)
          }
        })
    },
    remove(file,key) {
      console.log(file);
      this.isUpload = false
      const index = this.uploadConfig.fileList[key].findIndex(item=>item.uid == file.uid);
      const _this = this
      this.$confirm({
        title: '删除',
        content: '确定删除该附件？',
        okText: '确认',
        cancelText: '取消',
        onOk: function() {
          _this.removeFile(file.uid, key,index)
        },
        onCancel() {
          _this.isUpload = true
        }
      })
    },
    //上传时设置file存储的键名
    setUploadName(param) {
      this.uploadConfig.fileKeyName = param
    },
    removeFile(id, key,index){
      let success = false
      httpAction(this.uploadConfig.attachmentDelUrl + id, {}, 'GET')
        .then(res => {
          if (200 == res.code){
            // this.uploadConfig.fileList[key].pop()
            this.uploadConfig.fileList[key].splice(index, 1)
            success = true
            var fileds = new Object()
            fileds['upload' + key] = this.uploadConfig.fileList[key]
            this.$nextTick(function () {this.form.setFieldsValue(fileds)});
          }

        })
        .finally(() => {
          this.isUpload = true
          if (success) {
            this.$message.success('删除成功')
            if (key == 'f1') {
              this.firstFileUrl = false
            }
            if (key == 'f2') {
              this.secondFileUrl = false
            }
            if (key == 'f3') {
              this.thirdFileUrl = false
            }
          } else {
            this.$message.error('删除失败,请重试')
          }
        })
    },
    // 查看文件
    previewFile(index) {
      if (index == 1) {
        if(this.firstFileUrl){
          window.open(this.firstFileUrl)
        }else{

          httpAction(this.uploadConfig.attachmentListUrl + this.attaList['atta0'].id, {}, 'GET').then(res=>{
          if(res.code==200){
            this.firstFileUrl = res.data.attaUrl
            window.open(res.data.attaUrl)
          }
         })
        }  
      }
      if (index == 2) {
        if(this.secondFileUrl){
          window.open(this.secondFileUrl)
        }else{
          httpAction(this.uploadConfig.attachmentListUrl + this.attaList['atta1'].id, {}, 'GET').then(res=>{
          if(res.code==200){
            this.secondFileUrl = res.data.attaUrl
            window.open(res.data.attaUrl)
          }
         })
        } 
      }
      if (index == 3) {
        if(this.thirdFileUrl){
          window.open(this.thirdFileUrl)
        }else{
          httpAction(this.uploadConfig.attachmentListUrl + this.attaList['atta2'].id, {}, 'GET').then(res=>{
          if(res.code==200){
            this.thirdFileUrl = res.data.attaUrl
            window.open(res.data.attaUrl)
          }
         })
        } 
      }
    }
  },
  watch: {
    value(newValue) {
      this.setExcelRemark = newValue
    },
    myValue(newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>
