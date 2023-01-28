<template>
  <div>
    <!--
      <a-card v-if="current < 4" title="| 上传表单详情" :headStyle="{color:'#1890ff'}">
      <a-steps :current="0">
        <a-step title="待提交"></a-step>
        <a-step title="待审核"></a-step>
        <a-step title="待发放"></a-step>
        <a-step title="已发放"></a-step>
      </a-steps>
    </a-card>
    <a-card v-if="current == 5" title="| 上传表单详情" :headStyle="{color:'#1890ff'}">
      <a-steps :current="2">
        <a-step title="待提交"></a-step>
        <a-step title="待审核"></a-step>
        <a-step title="审核不通过" status="error" :description="salaryStandardInfo.remark"></a-step>
        <a-step title="财务退回"></a-step>
      </a-steps>
    </a-card>
    <a-card v-if="current == 7" title="| 上传表单详情" :headStyle="{color:'#1890ff'}">
      <a-steps :current="3">
        <a-step title="待提交"></a-step>
        <a-step title="待审核"></a-step>
        <a-step title="审核通过"></a-step>
        <a-step title="财务退回" status="error" :description="salaryStandardInfo.remark"></a-step>
      </a-steps>
    </a-card>
    -->
    <a-card
      title="| 上传表单详情"
      :headStyle="{color:'#1890ff'}"
    >
      <a-steps :current="current">
        <a-step v-for="(item,index) in auditLogArr" :key="index" :status="item.auditStatus">
          <template slot="title">
            {{ item.title }}
          </template>
          <div slot="description" v-if="auditLogList.length>0&&item.auditUser">
            <p>操作人：{{ item.auditUser }}</p>
            <p>操作时间：{{ item.auditTime }}</p>
            <p>审批说明：{{ item.remark }}</p>
          </div>
        </a-step>
      </a-steps>
    </a-card>
 
  </div>
</template>
<script>

import { httpAction, postActionHeader } from '../../../../api/manage'
export default {
  name: 'SalaryEngineProgressModal',
  components: {

  },
  props: {
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
    },
    auditLogList:{
      type:Array,
      required:true
    },

  },
  data() {
    return {
      form: this.$form.createForm(this),
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
      setExcelRemark: '111111111',
      uploadConfig: {
        attachmentUploadUrl: '/salary/tsalaryatta/ossUploadFile', //上传接口
        attachmentListUrl: '/salary/tsalaryatta/ossFileUrl/', //预览文件列表
        attachmentDelUrl: '/salary/tsalaryatta/ossFileDelete/', //预览文件列表
        fileList: {
          f1: null,
          f2: null,
          f3: null
        }
      },
      isNeedUpload: this.subject.isNeedUpload,
      f1: true,
      f2: true,
      f3: true,
      current:0,
      auditLogArr:[]
    }
  },

  methods: {
    show() {
      // this.current = this.salaryStandardInfo.status

      this.auditLogArr = [
            {title:'待提交'},
            {title:'待审核'},
            {title:'待发放'}
        ]
      if(this.auditLogList.length==0){
        this.current  = this.salaryStandardInfo.status
        switch(String(this.current)){
            case '0':
              this.auditLogArr[0].auditStatus = 'process'
              break;
            case '1':
              this.auditLogArr[1].auditStatus = 'process'
              break;
            case '3':
              this.auditLogArr[2].auditStatus = 'process'
              break;
            case '4':
              this.auditLogArr[2].auditStatus = 'finish'
              this.auditLogArr[2].title = '已发放'
              break;
            case '5':
              this.auditLogArr[1].auditStatus = 'error'
              this.auditLogArr[2].auditStatus = 'wait'
              this.auditLogArr[1].title = '审核未通过'
              break;
            case '7':
              this.auditLogArr[2].auditStatus = 'error'
              this.auditLogArr[2].title = '财务退回'
              break;
          }
      }else{
        this.auditLogList.map((item)=>{
          switch(item.step){
            case '0':
              this.auditLogArr[0].auditUser = item.auditUser
              this.auditLogArr[0].auditTime = item.auditTime
              this.auditLogArr[0].remark = item.remark || "无"
              this.auditLogArr[0].auditStatus = item.auditStatus=='1'?'error':'finish'
              this.auditLogArr[0].title = item.auditStatus=='1'?'待提交':'已提交'
              break;
            case '2':
              this.auditLogArr[1].auditUser = item.auditUser
              this.auditLogArr[1].auditTime = item.auditTime
              this.auditLogArr[1].remark = item.remark || "无"
              this.auditLogArr[1].auditStatus = item.auditStatus=='1'?'error':'finish'
              this.auditLogArr[1].title = item.auditStatus=='1'?'审核未通过':'审核通过'
              this.auditLogArr[2].auditStatus = 'wait'
              break;
            case '3':
              this.auditLogArr[2].auditUser = item.auditUser
              this.auditLogArr[2].auditTime = item.auditTime
              this.auditLogArr[2].remark = item.remark || "无"
              this.auditLogArr[2].auditStatus = item.auditStatus=='1'?'error':'finish'
              this.auditLogArr[2].title = item.auditStatus=='1'?'发放退回':'已发放'
              break;
          }
          return this.auditLogArr
        })
      }
      this.$forceUpdate()
    },

    //已上传文件列表
    getUploadedList() {
      for (var i in this.attaList) {
        var keyIndex = parseInt(i.substr(-1, 1)) + 1
        if (this.attaList[i]) {
          var fileds = new Object()
          var field = `f${keyIndex}`
          fileds[`upload${field}`] = false
          if (this.attaList[i].id) {
            console.log(fileds)
            this.form.setFieldsValue(fileds)
            this.uploadConfig.fileList[field] = []
            this.uploadConfig.fileList[field].push({
              uid: this.attaList[i].id,
              name: this.attaList[i].attaName,
              status: 'done',
              url: this.attaList[i].attaUrl
            })
          }
        }
      }

      //var
    },
    //上传前
    beforeUpload() {
      const fileKeyName = this.uploadConfig.fileKeyName
      this.uploadConfig.fileList[fileKeyName] = []
      return false
    },
    //监听上传变化
    handleUploadChange(obj) {
      if (obj.file.status && obj.file.status === 'removed') {
        return
      }
      this.uploadFile(obj)
    },
    //请求上传接口
    uploadFile(obj) {
      console.log(obj);
      const fileKeyName = this.uploadConfig.fileKeyName
      const formData = new FormData()
      formData.append('file', obj.file)
      formData.append('linkId', this.subject.id)
      formData.append('linkType', 1)
      formData.append('engineerType', parseInt(fileKeyName.substr(-1, 1)) - 1) //工程文件类型：0三方协议；1委托付款函；2劳务费
      const contextType = { 'Content-Type': 'multipart/form-data' }
      obj.file.status = 'error'
      postActionHeader(this.uploadConfig.attachmentUploadUrl, formData, contextType)
        .then(res => {
          if (200 === res.code) {
            obj.file.uid = res.data.uid
            obj.file.status = 'done'
            this.form.setFieldsValue({ upload1: 1 })
          }
        })
        .finally(() => {
          this.uploadConfig.fileList[fileKeyName].push(obj.file)
        })
    },
    removef1() {
      this.remove('f1')
    },
    removef2() {
      this.remove('f2')
    },
    removef3() {
      this.remove('f3')
    },
    remove(key) {
      if (this.uploadConfig.fileList[key]) {
        var file = this.uploadConfig.fileList[key][this.uploadConfig.fileList[key].length - 1]
        var _this = this
        console.log(file.status);
        if (file.status && file.status === 'removed') {
          this.$confirm({
            title: '删除',
            content: '确定删除该附件？',
            okText: '确认',
            cancelText: '取消',
            onOk: function() {
              _this.removeFile(file.uid, key)
            }
          })
        }
      }
    },
    //上传时设置file存储的键名
    setUploadName(param) {
      this.uploadConfig.fileKeyName = param
    },
    removeFile(id, key) {
      let success = false
      httpAction(this.uploadConfig.attachmentDelUrl + id, {}, 'GET')
        .then(res => {
          if (Number(res.code) === 200) {
            this.uploadConfig.fileList[key].pop()
            success = true
            var fileds = new Object()
            fileds[`upload${key}`] = null
            this.form.setFieldsValue(fileds)
          }
        })
        .finally(() => {
          if (success) {
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败,请重试')
          }
        })
    }
  }
  // watch: {
  //   value(newValue) {
  //     this.setExcelRemark = newValue
  //   },
  //   myValue(newValue) {
  //     this.$emit('input', newValue)
  //   }
  // }
}
</script>
<style lang="less" scoped>
   /deep/ .ant-steps-horizontal:not(.ant-steps-label-vertical) .ant-steps-item-description{
     max-width: 230px;
    }
  </style>
