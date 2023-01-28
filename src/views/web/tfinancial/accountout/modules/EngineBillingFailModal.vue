<template>
  <a-modal
    title="发放失败标记"
    :width="1000"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭"
    okText="保存"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form ant-disabled-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="员工姓名"
              class="stepFormText"
            >
              <a-input
                disabled
                v-decorator="['empName', {}]"
                style="width: 190px"
              />
            </a-form-item>
            <a-form-item
              label="身份证号"
              class="stepFormText"
            >
              <a-input
                disabled
                v-decorator="['empIdcard', {}]"
                style="width: 190px"
              />
            </a-form-item>
            <a-form-item
              label="发放方式"
              class="stepFormText"
            >
              <a-select
                disabled
                v-decorator="['salaryStyle', {}]"
                style="width: 190px"
              >
                <a-select-option value="0">现金</a-select-option>
                <a-select-option value="1">银付</a-select-option>
                <a-select-option value="2">线下</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="银行名称"
              class="stepFormText"
            >
              <a-input
                disabled
                v-decorator="['bankName', {}]"
                style="width: 190px"
              />
            </a-form-item>
            <a-form-item
              label="银行账号"
              class="stepFormText"
            >
              <a-input
                disabled
                v-decorator="['bankNo', {}]"
                style="width: 190px"
              />
            </a-form-item>
            <a-form-item
              label="发放金额"
              class="stepFormText"
            >
              <a-input
                disabled
                v-decorator="['money', {}]"
                style="width: 190px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="失败原因"
              class="stepFormText"
            >
              <a-textarea
                :rows="3"
                :maxLength="200"
                placeholder="请输入失败原因(200字以内)"
                v-decorator="['reason', validatorRules.reason]"
                style="width: 510px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="失败截图" class="stepFormText uploadStyle">
              <a-upload
                :beforeUpload="beforeUpload"
                :remove="removeFile"
                :fileList="fileList"
                accept="image/*"
                listType="picture-card"
              >
                <div>
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
              <div style="float:left">支持jpg、png等格式的多图，单图大小50k以内</div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import { filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'EngineBillingFailModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,  //展示按钮
        addButton: true, // 添加按钮
        editButton: false, // 编辑按钮
        confirmLoading: false,
        form: this.$form.createForm(this),
        dateFormat: "YYYY-MM-DD",
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        uploadFile:[],
        fileList:[], 
        validatorRules: {
          reason: {rules: [{ required: true, message: '请输入失败原因(200字以内)！' ,max:200}]},
        },
        url: {
          sendFail: 'salary/lostandfoundinfo/saveLostandfoundinfo',
        },
      }
    },
    props: {
      bankOptions:{
        type:Array,
        required:true
      }
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true

        if (this.model.id) {  // 编辑
          let bankName = filterDictText(this.bankOptions, this.model.bankName)
          if(bankName == '-' && this.model.bankName){
            bankName = this.model.bankName
          }
          this.model.bankName = bankName
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'empName', 'empIdcard', 'bankNo', 'salaryStyle', 'bankName','money'))
          })
        }
      },
      // 保存按钮
      handleOk() {
        const _this = this;
        // 触发表单验证
         this.form.validateFields((err,values) => {
          if(!err){
            _this.confirmLoading = true;
            const formData = new FormData();
            formData.append(`accountType`,1);
            formData.append(`accountId`,_this.model.id);
            formData.append(`reason`,values.reason);
            _this.uploadFile.forEach(item=>{
              formData.append(`files`,item);
            })
            httpAction(_this.url.sendFail,formData,'POST').then((res) => {
              if(Number(res.code) === 200){
                _this.$message.success("操作成功!")
                _this.handleCancel();
                _this.$emit('ok')
              }else{
                _this.$message.warning(res.msg);
              }
            }).finally(()=>{
              setTimeout(()=>{
                _this.confirmLoading = false;
              },3000)
            })
          }
        })
      },
      //上传
      beforeUpload(file){
        if(file.size/1024 > 50){
          this.$message.warning('附件不能超过50kb');
          return false;
        }
        this.uploadFile = [...this.uploadFile, file];
        this.fileList = [...this.fileList, {uid:file.uid,status:'done',name:file.name,url:URL.createObjectURL(file)}];
        return false;
      },
      removeFile(file){
        this.fileList = this.fileList.filter(item=>item.uid !== file.uid);
        this.uploadFile = this.uploadFile.filter(item=>item.uid !== file.uid);
      },
      // 关闭功能
      handleCancel() {
        this.close()
      },
      // 表单关闭与数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.disableSubmit = false
        this.disabledStyle = false // 禁止
        this.fileList = []
        this.uploadFile = []
      },
      /******************************************* 验证规则 *******************************************/
      // 银行账号验证
      validatIncomeBank(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }

        if (!new RegExp(/^([0-9]{1})(\d{9,24})$/).test(value)) {
          callback('银行账号必须为10到25位数字！')
          return false
        }

        callback()
      },
      // 入账金额验证
      validatIncomeFee(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }

        if (!new RegExp(/^[0-9]+(.[0-9]{1,2})?$/).test(value)) { // 数字验证
          callback('输入两位小数！')
          return false
        }

        callback()
        return true
      },
      // 入账时间（当前及之前）
      disabledIncomeDate(current) {
        return current && current > moment().endOf('day')
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}
.ant-disabled-form {
  :global(.ant-input-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-select-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-checkbox-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-radio-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
</style>
