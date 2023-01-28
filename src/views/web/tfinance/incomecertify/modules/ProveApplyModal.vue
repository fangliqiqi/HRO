<template>
  <a-modal
    :title="title"
    :width="600"
    placement="right"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="申请"
    :visible="visible"
    :maskClosable="false"
  >

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="开始月份"
              class="stepFormText"
            >
              <a-month-picker
                :disabledDate="disabledStartDate"
                style="width:250px"
                format="YYYYMM"
                v-decorator="['startMonth', validatorRules.startMonth]"
                placeholder="请选择开始月份"
                @change="changeStartDate"
                @openChange="handleStartOpenChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="结束月份"
              class="stepFormText"
            >
              <a-month-picker
                :disabledDate="disabledEndDate"
                format="YYYYMM"
                style="width:250px"
                placeholder="请选择结束月份"
                v-decorator="['endMonth', validatorRules.endMonth]"
                :open="endOpen"
                @change="changeEndDate"
                @openChange="handleEndOpenChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="计算类型"
              class="stepFormText"
            >
              <a-select
                style="width:250px"
                @select="changeSumType"
                v-decorator="['sumType',{initialValue:'0'}]"
              >
                <a-select-option value="0">实发平均</a-select-option>
                <a-select-option value="1">应发平均</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="实际金额"
              class="stepFormText"
            >
              <a-input
                style="width:250px"
                placeholder="请输入实际金额"
                v-decorator="['salary',validatorRules.salary]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="申请金额"
              class="stepFormText"
            >
              <a-input
                style="width:250px"
                placeholder="请输入申请金额"
                v-decorator="['proveSalary',validatorRules.proveSalary]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="申请理由"
              class="stepFormText"
            >
              <a-textarea
                rows="3"
                style="width:250px"
                placeholder="请输入申请理由"
                v-decorator="['applyReason',validatorRules.applyReason]"
              ></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="上传附件"
              class="stepFormText"
            >
              <a-upload-dragger
                name="file"
                :multiple="true"
                :fileList="fileList"
                :beforeUpload="beforeUpload"
                :remove="removeFile"
                @change="handleChange"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text"> 点击或拖拽上传 </p>
              </a-upload-dragger>
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction,postActionHeader,httpActionHeader } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  name: 'ProveApplyModal',
  data() {
    return {
      title: '操作',
      visible: false,
      endOpen: false,
      fileList: [],
      rangeDate:{startDate:'',endDate:''},
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      
      validatorRules: {
        startMonth: { rules: [{ required: true, message: '请选择开始月份!' }] },
        endMonth: { rules: [{ required: true, message: '请选择结束月份!' }] },
        salary: { rules: [{ required: true, pattern:/(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/,message: '实际金额格式不正确!' }] },
        proveSalary: { rules: [{ required: true,pattern:/(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/, message: '申请金额格式不正确!' }] },
        applyReason: { rules: [{ required: true, message: '请输入申请理由!' }] },
      },
      url: {
        add: '/hrBase/salaryProve/proveApply',
        importUrl:'/hrBase/fileUpload/ossUploadFile', //上传附件
        delAttachUrl:'/hrBase/fileUpload/ossFileDelete/', //附件删除
        edit: '/busiInsurance/tinsurancecompany',
        getSalary:'/salary/tsalaryaccount/getAverageSalaryForProve'
      }
    }
  },
  methods: {
    moment,
    show(record) {
      this.model = record
      this.form.resetFields()
      this.visible = true
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'companyAddr', 'companyDocking','companyName','createTime','createUser','id','lastUpdateTime','lastUpdateUser'))
      })
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    //上传
    handleChange() {
      const { fileList } = this
      this.uploadFilesChange(fileList[fileList.length - 1])
    },
    uploadFilesChange(file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 1)
      let contextType = { 'Content-Type': 'multipart/form-data' }
      postActionHeader(this.url.importUrl, formData, contextType).then((res) => {
        if(res.code == 200){
          const index = this.fileList.indexOf(file)
          const newFileList = this.fileList.slice()
          newFileList.splice(index, 1)
          this.fileList = newFileList
          let fileImag = {}
          fileImag.uid = res.data.uid
          fileImag.name = res.data.name
          fileImag.status = res.data.status
          fileImag.url = res.data.url
          this.fileList.push(fileImag)
        }else{
          this.$message.warning(res.msg)
        }
        
      })
    },
    removeFile(fileInfo) {
      const _this = this
      this.$confirm({
        title: '删除',
        content: '确定删除该附件？',
        okText: '确认',
        cancelText: '取消',
        onOk: function() {
          const formData = new FormData()
          formData.append('type', 1)
          httpActionHeader(_this.url.delAttachUrl + fileInfo.uid, formData, 'get',{ 'Content-Type': 'application/x-www-form-urlencoded' }).then(res => {
            if (res.code === 200) {
              _this.fileList.map((file, index) => {
                if (file.uid == fileInfo.uid) {
                  //删除该附件
                  _this.fileList.splice(index, 1)
                  return
                }
              })
              _this.$message.success('删除附件成功！')
            } else {
              _this.$message.warning(res.msg)
            }
          })
        }
      })
      return false
    },
    disabledStartDate (startMonth) {
      const endMonth = this.form.getFieldValue('endMonth');
      if (!endMonth || !startMonth) {
        return false;
      }
      return startMonth.valueOf() > endMonth.valueOf();
    },
    disabledEndDate (endMonth) {
      const startMonth =  this.form.getFieldValue('startMonth');
      if (!endMonth || !startMonth) {
        return false;
      }
      return startMonth.valueOf() >= endMonth.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    changeStartDate(date,dateString){
      this.rangeDate.startDate = dateString
      this.getSalary()
    },
    changeEndDate(date,dateString){
      this.rangeDate.endDate = dateString
      this.getSalary()
    },
    changeSumType(value){
      if(value != this.form.getFieldValue('sumType')){
        this.form.setFieldsValue(pick({sumType:value}, 'sumType'))
        this.getSalary()
      }
    },
    getSalary(){
      let param = '?emIdCard='+this.model.empIdcard+'&endMouth='+this.rangeDate.endDate+'&settleDepartId='+this.model.settleDomain+
      '&startMouth='+this.rangeDate.startDate+'&sumType='+this.form.getFieldValue('sumType')
      httpAction(this.url.getSalary+param,'','get').then((res)=>{
        if(res.code == 200){
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({salary:res.data.salary}, 'salary'))
          })
        }
      })
    },
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          let attaIdArray = []
          for (let item of this.fileList) {
            attaIdArray.push(item.uid)
          }
          values.employeeInfo = this.model.id
          values.employeeIdCard = this.model.empIdcard
          values.startMonth = moment(values.startMonth).format("YYYYMM")
          values.endMonth = moment(values.endMonth).format("YYYYMM")
          values.settleDomain = _this.model.settleDomain
          httpAction(_this.url.add+'?AttaIdArray='+attaIdArray, values, 'post').then((res) => {
            if (res.code === 200) {
              _this.$message.success(_this.title + '成功！')
              _this.close()
              _this.$emit('ok')
            } else {
              _this.$message.warning(res.msg)
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
      this.fileList = []
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}

.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}
.ant-upload-drag-icon {
  width: 250px;
  text-align: center;
}
</style>