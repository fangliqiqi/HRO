<template>
  <a-modal
    title="发放记录-附件"
    :width="600"
    :visible="confirmVisible"
    @ok="handleConCancel"
    @cancel="handleConCancel"
    cancelText="取消"
    okText="确定"
    :confirmLoading="conLoading"
    :destroyOnClose="true"
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
  </a-modal>
</template>

<script>
export default {
  name:'ShowAttachModal',
  data() {
    return {
      conLoading: false,
      confirmVisible: false,
      grantForm:this.$form.createForm(this),
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      fileList:{
        "0":[],
        "1":[],
        "2":[],
        "3":[],
      },
    }
  },
  methods:{
    show(list){
      this.fileList = list;
      this.confirmVisible = true
    },
    handleConCancel(){
      this.confirmVisible = false
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
