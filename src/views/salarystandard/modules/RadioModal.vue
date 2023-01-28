<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :destroyOnClose="true"
      :width="700"
    >
      <a-form :form="form">
        <a-form-item
          label="是否为新表"
        >
          <a-radio-group v-decorator="['isBacked', {rules: [{ required: true, message: '请选择否为新表！' }]}]">
            <a-radio :value="0">新表</a-radio>
            <a-radio :value="1" :disabled="disabledRadio">已发放表单退回重传</a-radio>
          </a-radio-group>
        </a-form-item>
        <div v-if="salaryInfo.ownNums>0">
          <p style="color: rgba(0, 0, 0, 0.85)">自有员工发放说明(工资表中存在自有员工):</p>
          <a-form-item
            label="自有员工数"
            :label-col="{ span: 5}"
            :wrapper-col="{ span: 18}"
          >
            <a-input disabled v-decorator="['ownNums', {}]"></a-input>
          </a-form-item>
          <a-form-item
            label="应发金额合计"
            :label-col="{ span: 5}"
            :wrapper-col="{ span: 18}"
          >
            <a-input disabled v-decorator="['ownMoney', {}]"></a-input>
          </a-form-item>
          <a-form-item
            label="发放原因"
            :label-col="{ span: 5}"
            :wrapper-col="{ span: 18}"
          >
            <a-textarea 
              v-decorator="['ownRemark', {rules: [{ required: true, message: '请输入发放原因!' }]}]"
              placeholder="请输入发放原因，字数200以内！"
              :rows="4"
              :autosize="{minRows: 2, maxRows: 6}"
              :maxLength="200"
            ></a-textarea>
          </a-form-item>
          <a-form-item
            label="附件上传"
            
            :label-col="{ span: 5}"
            :wrapper-col="{ span: 18}"
          >
            <a-upload
              :fileList="fileList"
              @change="handleImport"
              @preview="handlePreview"
              :remove="handleRemove"
              :beforeUpload="beforeUpload"
            >
              <a-button> <a-icon type="upload" /> 上传</a-button>
            </a-upload>           
          </a-form-item>  
        </div>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import pick from 'lodash.pick'
  import { httpAction,postActionHeader } from '@/api/manage'
  import { hasOperatePermission } from '@/utils/common'

  export default {
    name:'RadioModal',
    props:{
      slaryFlag:{
        type:Boolean,
        required:false,
        default:false
      }
    },
    data() {
      return {
        id:'',
        visible: false,
        disabledRadio: false,
        title: '提示',
        form: this.$form.createForm(this),
        salaryInfo:{},//自有员工信息,
        fileList: [],
        isUpload: false, // 判断附件是否上传成功
        url:{
          ossUploadFile: '/salary/tsalaryatta/ossUploadFile', //上传接口
          ossFileUrl: '/salary/tsalaryatta/ossFileUrl/', //预览文件列表
          ossFileDelete: '/salary/tsalaryatta/ossFileDelete/' //删除文件
        }
      }
    },
    methods: {
      showModal(data,list) {
        this.disabledRadio = hasOperatePermission('wxhr:back_retransmit') ? false : true;
        this.form.resetFields();
        this.visible = true;
        this.$nextTick(() => {
          const isBacked = (data.isBacked == 0 || data.isBacked == null) ? 0 : 1;
          this.form.setFieldsValue(pick({isBacked:isBacked},'isBacked'));
        });
        
        if(data&&data.ownNums>0){
          this.salaryInfo = data
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({ownNums:data.ownNums,ownMoney:data.ownMoney,ownRemark:data.ownRemark},'ownNums','ownMoney','ownRemark'))
          });
        }else{
           this.salaryInfo = {}
        }
        if(this.slaryFlag){
          this.fileList = []
          list.map(item=>{
            this.fileList.push({
                uid: item.id,
                name: item.attaName,
                status: 'done',
                url: item.attaUrl,
                id:item.linkId
            })
          })
        }else{
          console.log(this.fileList)
        }
        this.id = data.id;
      },
      beforeUpload(file) {
        if(file.size / 1024 / 1024 > 5){
          this.$message.error('附件不能超过5MB!');
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
          formData.append('linkId', this.id)
          formData.append('linkType', 8) //类型：8 自有员工
          formData.append('engineerType', 3)//工程文件类型 3:其他
          formData.append('file', file.file)
          const contextType = { 'Content-Type': 'multipart/form-data' }
          this.spinning = true
          this.confirmLoading = true
          const _this = this
          postActionHeader(_this.url.ossUploadFile, formData, contextType,10000)
            .then(res => {
              if (Number(res.code) === 200) {
                console.log(res.data);
                _this.fileList = [..._this.fileList, res.data]
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
                  const index = _this.fileList.indexOf(file)
                  const newFileList = _this.fileList.slice()
                  newFileList.splice(index, 1)
                  _this.fileList = newFileList
                } else {
                  _this.$message.error(result.msg || '附件删除失败！')
                }
              })
              .finally(() => {
                _this.isUpload = false
                _this.spinning = false
                _this.confirmLoading = false
              })
          }
        })
      },
      // 提交
      handleOk() {
        this.form.validateFields((err,values)=>{
          if(!err){
            const data = values;
            const salaryAttaIds = []
            this.fileList.map(item=>{
              salaryAttaIds.push(item.uid)
            })
            data.salaryAttaIds = salaryAttaIds
            this.visible = false
            this.$emit('ok',data)
          }                                 
        })
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.visible = false
        this.$emit('close', false);
        this.visible = false;
        this.disabledRadio = false;
        
      }
    }
  }
</script>
<style lang="less" scoped>
/deep/ .ant-upload-list{
  max-height: 200px !important;
  overflow: auto !important;
}
</style>
