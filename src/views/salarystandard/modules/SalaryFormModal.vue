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
          <a-select v-decorator="['setMoneyFrom ', {initialValue:salaryStandardInfo.moneyFrom,rules: [{ required: true, message: '请选择客户到款！' }]} ]">
            <a-select-option :value="0">客户到款</a-select-option>
            <a-select-option :value="1">垫付</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="薪资原表"
        >
          <a-upload
            v-decorator="['upload',{rules: [{ required: true, message: '请上传薪资原表！' }]}]"
            @change="handleImport"
            :beforeUpload="beforeUpload"
            :fileList="fileList"
            :remove="handleRemove"
            @preview="handlePreview"
          >
            <a-button>
              <a-icon type="upload" />点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注"
        >
          <a-textarea v-decorator="['submitRemark']">

          </a-textarea>
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
import {httpAction, postActionHeader } from '@/api/manage'

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
      fileList: {
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
        // fileList: [],
        isUpload: false, // 判断附件是否上传成功
        url:{
          ossUploadFile: '/salary/tsalaryatta/ossUploadFile', //上传接口
          ossFileUrl: '/salary/tsalaryatta/ossFileUrl/', //预览文件列表
          ossFileDelete: '/salary/tsalaryatta/ossFileDelete/' //删除文件
        },
    }
  },
  // mounted() {
  //   tinymce.init({})
  // },
  // 上传附件的计算属性
  computed:{
    uploadlist(){
      const arr =[]
      return this.fileList.map(item=>{
        arr.push(item.url)
      })
    }
  },
  methods:{
    async show(){
      // if(this.salaryStandardInfo.status > 1){
      //   this.current = this.salaryStandardInfo.status - 1
      // }else{
      //   this.current = this.salaryStandardInfo.status
      // }
      this.current = this.salaryStandardInfo.status
      tinymce.init({})
    },

    beforeUpload(file) {
      if(file.size / 1024 / 1024 > 50){
        this.$message.error('附件不能超过50MB!');
        this.isUpload = true
        return false;
      }else{
        this.isUpload = false
        return false;
      }
    }, 
    //上传
    handleImport(file) {
      if (!this.isUpload) {
        const formData = new FormData()
        formData.append('linkId', this.salaryStandardInfo.id)
        formData.append('linkType', 11) 
        formData.append('file', file.file)
        const contextType = { 'Content-Type': 'multipart/form-data' }
        this.spinning = true
        this.confirmLoading = true
        const _this = this
        postActionHeader(_this.url.ossUploadFile, formData, contextType,600000)
          .then(res => {
            if (Number(res.code) === 200) {
              _this.$emit('import', res.data)
              // _this.fileList = [..._this.fileList, res.data]
              _this.$message.success('上传附件成功')
            } else {
              _this.$message.error(res.msg || '附件上传失败！')
            }
          })
          .finally(() => {
            _this.spinning = false
            _this.confirmLoading = false
          })
      }
    },
    // 预览
    handlePreview (file) {
      window.open(file.url)
    },
    // 删除
    handleRemove(file) {
      console.log(file);
      this.isUpload = true
      const _this = this
      this.$confirm({
        title: '删除',
        content: '确定删除该附件？',
        okText: '确认',
        cancelText: '取消',
        onOk: function() {
          _this.spinning = true
          _this.confirmLoading = true
          httpAction(_this.url.ossFileDelete + file.uid, {}, 'GET')
            .then(result => {
              if (Number(result.code) === 200) {
                // 清除filelist中的文件
                // const index = _this.fileList.indexOf(file)
                // const newFileList = _this.fileList.slice()
                // newFileList.splice(index, 1)
                // _this.fileList = newFileList
                _this.$emit('remove', file)
                _this.$message.success(result.msg || '附件删除成功！')
              } else {
                _this.$message.error(result.msg || '附件删除失败！')
              }
            })
            .finally(() => {
              _this.isUpload = false
            })
        }
      })
    },
    onClick(){
      console.log(11111)
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
