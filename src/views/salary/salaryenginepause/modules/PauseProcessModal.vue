
<template>
  <div>
    <a-card
      v-if="current < 4"
      title="| 上传表单详情"
      :headStyle="{color:'#1890ff'}"
    >
      <a-steps :current="current">
        <a-step title="待提交">
        </a-step>
        <a-step title="待审核">
        </a-step>
        <a-step title="待发放"></a-step>
        <a-step title="已发放"></a-step>
      </a-steps>
    </a-card>
    <a-card
      v-if="current == 5"
      title="| 上传表单详情"
      :headStyle="{color:'#1890ff'}"
    >
      <a-steps :current="2">
        <a-step title="待提交">

        </a-step>
        <a-step title="待审核">
        </a-step>
        <a-step
          title="审核不通过"
          status="error"
          :description="salaryStandardInfo.remark"
        ></a-step>
        <a-step title="财务退回"></a-step>
      </a-steps>
    </a-card>
    <a-card
      :title="tabTitle"
      :headStyle="{color:'#1890ff'}"
    >
      <a-form :form="grantForm">
        <a-form-item
          label="三方协议"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-upload
            :defaultFileList="fileList['0']"
            :showUploadList="{showRemoveIcon:false}"
          ></a-upload>
        </a-form-item>
        <a-form-item
          label="委托付款函"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-upload
            :defaultFileList="fileList['1']"
            :showUploadList="{showRemoveIcon:false}"
          ></a-upload>
        </a-form-item>
        <a-form-item
          label="劳务费"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-upload
            :defaultFileList="fileList['2']"
            :showUploadList="{showRemoveIcon:false}"
          ></a-upload>
        </a-form-item>
        <a-form-item
          label="其他证明材料"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-upload
            :defaultFileList="fileList['3']"
            :showUploadList="{showRemoveIcon:false}"
          ></a-upload>
        </a-form-item>
      </a-form>
    </a-card>
    
  </div>
</template>
<script>
// import tinymce from 'tinymce/tinymce'
export default {
  name:'PauseProcessModal',
  components: {
    //Editor
  },
  props: {
      salaryStandardInfo: {
        type:Object,
        required:true
      },
      fileList: {
        type:Object,
        required:true
      },
    },
  data() {
    return {
      form: this.$form.createForm(this),
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
      grantForm:this.$form.createForm(this),
      // fileList:{
      //   "0":[],
      //   "1":[],
      //   "2":[],
      //   "3":[],
      // },
      tabTitle:''
    }
  },
  methods:{
    show(flag){
      this.tabTitle = flag ? '附件' : '| 表单详情'
      // this.fileList = list
      this.current = (this.salaryStandardInfo.status > 1) ? (this.salaryStandardInfo.status-1) : this.salaryStandardInfo.status
      
    },
  },
}
</script>
