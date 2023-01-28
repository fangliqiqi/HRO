<template>
  <a-modal
    :title="title"
    :width="1000"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
      <a-button
        v-if="addButton"
        key="handleOk"
        type="primary"
        @click="handleOk"
      >保存</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form ant-disabled-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="自定义项名称"
              class="stepFormText"
            >
              <a-input
                :disabled="true"
                placeholder="自定义项名称"
                v-decorator="['empName', {}]"
                style="width: 200px"
              />
            </a-form-item>
            <a-form-item
              label="收款单位"
              class="stepFormText"
            >
              <a-input
                :disabled="true"
                placeholder="收款单位"
                v-decorator="['orgName', {}]"
                style="width: 200px"
              />
            </a-form-item>
            <a-form-item
              label="发放方式"
              class="stepFormText"
            >
              <a-select
                showSearch
                :disabled="true"
                style="width: 200px"
                optionFilterProp="children"
                placeholder="请选择发放方式"
                v-decorator="['type', {}]"
              >
                <a-select-option
                  v-for="(item, index) in salaryStyleOptions"
                  :key="index"
                  :value="index"
                >{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="开户行"
              class="stepFormText"
            >
              <a-input
                :disabled="true"
                placeholder="请选择开户行"
                v-decorator="['bankName', {}]"
                style="width: 200px"
              />
            </a-form-item>
            <a-form-item
              label="银行账号"
              class="stepFormText"
            >
              <a-input
                :disabled="true"
                placeholder="请输入银行账号"
                v-decorator="['bankNo', {}]"
                style="width: 200px"
              />
            </a-form-item>
            <a-form-item
              label="发放金额"
              class="stepFormText"
            >
              <a-input
                :disabled="true"
                placeholder="请输入发放金额"
                v-decorator="['money', {}]"
                style="width: 200px"
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
                v-decorator="['reason', {rules: [{ required: true, message: '请输入失败原因(200字以内)！',max:200 }]}]"
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
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'DiySalatyBillingFailModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        addButton: true, // 添加按钮
        confirmLoading: false,
        //bankOptions: [],  // 开户行
        salaryStyleOptions: {0: '现金', 1: '银付', 2: '线下'}, // 发放方式
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        fileList:[], 
        uploadFile:[],
        url: {
          saveUrl: 'salary/lostandfoundinfo/doIssueFail',
          getAccount:'salary/tsalaryaccountitem/getActualMoneyByAccountId',
        },
      }
    },
    methods: {
      async edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        if(this.model.type == 1){
          this.model.type = '银付'
        }
        if(this.model.type == 0){
          this.model.type = '现金'
        }
        if(this.model.type == 2){
          this.model.type = '线下'
        }
        
         this.fileList = []

        // 获取失败记录图
        const fileRes = await httpAction(`/salary/tsalaryatta/getTSalaryAttaListByIdType?linkId=${this.model.id}&linkType=7`,null,'get')
        if(fileRes.code==200){
          fileRes.data.map(item=>{
            this.fileList.push({
              uid: item.id,
              name: item.attaName,
              status: 'done',
              url: item.attaUrl,
              id:item.linkId
            })
          })
         } 
         this.visible = true
         this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'empName','type', 'orgName','bankName', 'bankNo', 'money', 'reason'))
        })
      },
      // 保存按钮
      handleOk() {
        // 触发表单验证
        this.form.validateFields((err,values) => {
          if(!err){
            const formData = new FormData();
            formData.append(`id`,this.model.id);
            formData.append(`reason`,values.reason);
            formData.append(`flag`,'1');
            this.uploadFile.forEach(item=>{
              formData.append(`files`,item);
            })
            httpAction(this.url.saveUrl,formData,'POST').then((res) => {
              if(Number(res.code) === 200){
                this.$message.success("操作成功!")
                this.handleCancel();
                this.$emit('ok')
              }else{
                this.$message.warning(res.msg);
              }
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
        console.log(file);
        if(file.id){
          httpAction(`/salary/tsalaryatta/ossFileDelete/${file.uid}`,{},'GET').then(res=>{
            if(res.code === 200){
              // this.$message.success('删除成功！');
              console.log(res.data);
            }else{
              this.$message.warning(res.msg);
            }
          })
        }
        this.fileList = this.fileList.filter(item=>item.uid !== file.uid);
        this.uploadFile = this.uploadFile.filter(item=>item.uid !== file.uid);
        console.log(this.uploadFile);
      },
      // 关闭功能
      handleCancel() {
        this.close()
      },
      // 表单关闭与数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.addButton = true // 添加按钮
        this.disableSubmit = false
        this.bankOptions = []  // 开户行
        this.uploadFile = [];
        this.fileList = [];
      },
      /******************************************* 验证规则 *******************************************/
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 95px;
  }
}
.uploadStyle{
  margin-top: 10px;
  :global(.ant-form-item-control-wrapper){
    width: 686px;
  }
  :global(.ant-upload-picture-card-wrapper){
    width: 686px;
    float: left;
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
