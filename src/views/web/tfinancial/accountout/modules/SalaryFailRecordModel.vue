<template>
  <a-card >
    <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
      <a-form-item
        label="发放金额"
      >
        <span>{{ modelInfo.money }}</span>
      </a-form-item>
      <a-form-item
        label="失败原因"
        class="labelcla"
      >
        <span>{{ modelInfo.reason }}</span>
      </a-form-item>
      <a-form-item
        label="失败截图"
      >
        <div style="maxHeight:360px;overflow:auto">
          <a-upload
            :fileList="fileList"
            listType="picture-card"
            :showUploadList="{showRemoveIcon:false}"
          >
          </a-upload>
        </div>
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script>

export default {
  name:'SalaryFailRecordModel',
  props:{
    modelInfo:{
      type:Object,
      required:true
    },
    fileList:{
      type:Array,
      required:true
    }
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    }
  },
  methods:{
     show(){
    },
    
  }
}
</script>
<style lang="less" scoped>
  /deep/ .labelcla .ant-form-item-label>label{
    color: red !important;
  }

</style>