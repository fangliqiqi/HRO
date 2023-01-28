<template>
  <a-modal
    :title="title"
    :width="800"
    placement="right"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="确定"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >

    <a-spin :spinning="confirmLoading">
      <a-card
        :bordered="false"
        :headStyle="{color:'#1890ff',minHeight:'30px'}"
        title=" | 详细信息"
      >
        <a-form
          :form="form"
          layout="inline"
          class="ant-advanced-search-form"
        >
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="姓名"
                class="stepFormText"
              >
                {{ model.employeeName }}
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="部门"
                class="stepFormText"
              >
                {{ model.settleDomainName }}
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="身份证"
                class="stepFormText"
              >
                {{ model.employeeIdCard }}
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="工资提取月份"
                class="stepFormText"
              >
                {{ model.startMonth }} ~ {{ model.endMonth }}
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="实际金额"
                class="stepFormText"
              >
                {{ model.salary }}元
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="计算类型"
                class="stepFormText"
              >
                {{ sumTypeOption[model.sumType] }}
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="证明工资"
                class="stepFormText"
              >
                {{ model.proveSalary }}元
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="申请日期"
                class="stepFormText"
              >
                {{ model.creatDate }}
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="申请人"
                class="stepFormText"
              >
                {{ model.creatUserName }}
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="申请理由"
                class="stepFormText"
              >
                {{ model.applyReason }}
              </a-form-item>
            </a-col>

          </a-row>
        </a-form>
      </a-card>
      <a-card
        :bordered="false"
        :headStyle="{color:'#1890ff',minHeight:'30px'}"
        title=" | 附件信息"
      >
        <a-upload
          :defaultFileList="fileList"
          listType="picture"
          :showUploadList="{showRemoveIcon:false}"
          @preview="preview"
        >
        </a-upload>
        <a-empty v-if="fileList.length == 0"/>
      </a-card>

    </a-spin>
    <template slot="footer">
      <span v-if="isShow">
        <a-button
          type="primary"
          icon="check"
          @click="handleAudit(1)"
        >通过</a-button>
        <a-button
          type="primary"
          icon="close"
          @click="handleAudit(2)"
        >不通过</a-button>
      </span>
      <a-button style="margin-left:10px;" @click.stop="()=>{visible=false}">取消</a-button>
    </template>
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handlePreviwCancel"
    >
      <img
        alt="example"
        style="width: 100%"
        :src="previewImage"
      />
    </a-modal>
  </a-modal>
</template>

<script>

import { httpAction } from '@/api/manage'

export default {
  name: 'ProveAuditModal',
  data() {
    return {
      title: '证明审核',
      visible: false,
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      type:0, //1试用期0正式员工
      sumTypeOption:['实发平均','应发平均'],
      fileTypeOfOffice: ['xls','xlsx','doc','docx','ppt','pptx','pdf'],
      isShow:true,
      previewVisible:false,
      previewImage:'',
      fileList:[],
      url: {
        detail:'hrBase/salaryProve/lookApply/',
        attach:'hrBase/salaryProve/atta/',
        audit:'hrBase/salaryProve/updateApplyStatus'
      }
    }
  },
  methods: {
    show(record,isShow) {
      this.fileList = []
      this.model = record
      this.visible = true
      this.isShow = (isShow == 1) ? true :false
      httpAction(this.url.detail+record.id,null,'get').then((res)=>{
        if(res.code == 200){
          this.model = res.data
        }
      })
      const _this = this
      httpAction(this.url.attach+record.id,null,'get').then((res)=>{
        if(res.code == 200 && res.data){
          for(let item of res.data){
            _this.fileList.push({uid:item.id,name:item.attaName,status:'done',url:item.attaUrl})
          }
        }
      })
    },
    preview(file){
      let fileExt = file.name.replace(/.+\./,"")
      if(this.fileTypeOfOffice.indexOf(fileExt) != -1) {
        window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url || file.thumbUrl)}`, '_blank')
      }else{
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      }
    },
    handlePreviwCancel(){
      this.previewVisible = false
    },

    handleAudit(type){
      httpAction(this.url.audit+'?auditStatus='+type+'&id='+this.model.id,null, 'get').then((res) => {
        if(res.code == 200){
          this.$message.success('审核成功！')
          this.close()
          this.$emit('ok')
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          values.employeeInfo = _this.model.id
          values.employeeIdCard = _this.model.empIdcard
          values.proveType = _this.type //0正式员工证明1试用期员工证明
          httpAction(_this.url.preview, values, 'post').then((res) => {
            if (res.code === 200) {
              _this.$message.success(_this.title + '成功！')
              _this.close()
              _this.$emit('ok')
            } else {
              _this.$message.warning(res.msg)
              _this.isOpen = true
            }
          }).finally(() => {
            _this.confirmLoading = false
          })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.isShow = true
      this.fileList = []
    }
  }
}
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}
.ant-advanced-search-form .ant-form-item {
  margin-bottom: 0px;
}

.ant-advanced-search-form .ant-card-head-title {
  padding: 0px !important;
}
</style>