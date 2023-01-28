<template>
  <a-modal
    :title="title"
    :width="810"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
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
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="发放金额"
              class="stepFormText"
            >
              {{ model.money ? model.money : '-' }}
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="失败原因"
              class="stepFormText reason"
            >
              {{ model.reason ? model.reason : '-' }}
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="失败截图" class="reason stepFormText">
              <a-upload
                :fileList="fileList"
                :showUploadList="{showRemoveIcon:false}"
                list-type="picture-card"
              >
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider />
        <a-row>
          <a-col :span="24">
            <a-form-item
              class="stepFormText"
              style="margin-left: 20px"
            >
              请核对并修改错误信息后，点击重新发放！
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item
              label="员工姓名"
              class="stepFormText"
            >
              <a-input
                placeholder="请输入员工姓名"
                v-decorator="['empName', {rules: [{ required: true, message: '请输入员工姓名！' }]}]"
                style="width: 220px"
                @change="changeName"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="身份证号"
              class="stepFormText"
            >
              <a-input
                placeholder="请输入身份证号"
                v-decorator="['empIdcard', validatorRules.empIdcard]"
                style="width: 220px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item
              label="开户行"
              class="stepFormText"
            >
              <a-input
                placeholder="请输入开户行"
                v-decorator="['bankName', {rules: [{ required: true, message: '请输入开户行！' }]}]"
                style="width: 220px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="银行账号"
              class="stepFormText"
            >
              <a-input
                placeholder="请输入银行账号"
                v-decorator="['bankNo', validatorRules.bankNo]"
                style="width: 220px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <template v-if="model.adjustmentType == 0 || (showFile || fileArr.length)">
          <a-divider />
          <a-row>
            <a-col :span="24">
              <a-form-item
                class="stepFormText"
                style="margin-left: 20px"
              >
                调整类型为“换人换卡”时，“换人换卡证明”材料为“必填”，请线下签字后，拍照上传，大小：5M；
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="换人换卡证明"
                class="stepFormText reason"
              >
                <div>
                  <a-button type="link" class="uploadBtn" @click="downTemplate('/templates/换人换卡模板.xlsx')">
                    换人换卡证明材料模板
                  </a-button>
                </div>
                <a-upload
                  :fileList="fileArr"
                  list-type="picture-card"
                  accept="image/*"
                  v-decorator="['upload', validatorRules.upload]"
                  :multiple="false"
                  :beforeUpload="beforeUpload"
                  :remove="removeFile"
                >
                  <div>
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传</div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'BillingSalaryFailAddModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        addButton: true, // 添加按钮
        confirmLoading: false,
        fileList:[],
        fileArr:[],
        form: this.$form.createForm(this),
        validatorRules: {
          empIdcard: { rules: [{ required: true, message: '请输入身份证号！' }, { validator: this.validateIdCard }] },
          bankNo: { rules: [{ required: true, message: '请输入银行账号！' }, { validator: this.validateBankNo }] },
          upload: { rules: [{ required: true, message: '请上传证明材料！' }] },
        },
        url: {
          add: 'salary/lostandfoundinfo/doClaim',
        },
        uploadFile:[],
        showFile: false
      }
    },
    methods: {
      add() {
        this.edit({})
      },
      async edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.fileList = []
        const res = await httpAction(`/salary/tsalaryatta/getTSalaryAttaListByIdType?linkId=${record.id}&linkType=7`,null,'get');
        if(res.code === 200 && res.data.length){
          this.fileList = res.data.map(item=>{
            return {
              uid: item.id,
              name: item.attaName,
              status: 'done',
              url: item.attaUrl,
            }
          })
        }
        const result = await httpAction(`/salary/tsalaryatta/getTSalaryAttaListByIdType?linkId=${record.id}&linkType=10`,null,'get');
        if(result.code === 200 && result.data.length){
          this.fileArr = result.data.map(item=>{
            return {
              uid: item.id,
              name: item.attaName,
              status: 'done',
              url: item.attaUrl,
            }
          })
        }

        this.$nextTick(() => {
          this.form.setFieldsValue(pick({...this.model,...{upload: this.fileArr}}, 'empName', 'empIdcard', 'bankName', 'bankNo','upload'))
        })
      },
      changeName(e){
        this.showFile = this.model.empName === e.target.value ? false : true;
      },
      downTemplate(templateUrl){
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`;
        window.location.href = url;
      },
      removeFile(file){
        if(/^blob/.test(file.url)){
          this.fileArr = this.fileArr.filter(item=>item.uid !== file.uid);
          this.uploadFile = this.uploadFile.filter(item=>item.uid !== file.uid);
        }else{
          httpAction(`/salary/lostandfoundinfo/ossFileDelete/${file.uid}`, null, 'get').then((res) => {
            if(res.code === 200){
              this.$message.success('删除成功!');
              this.fileArr = this.fileArr.filter(item=>item.uid !== file.uid);
            }else{
              this.$message.warning(res.msg);
            }
          })
        }
      },
      beforeUpload(file) {
        if(file.size/1024/1024 > 5){
          this.$message.warning('附件不能超过5MB!');
          return false;
        }
        this.uploadFile = [...this.uploadFile, file];
        this.fileArr = [...this.fileArr, {uid:file.uid,status:'done',name:file.name,url:URL.createObjectURL(file)}];
        return false;
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            // 判读是否上传文件
            if(values.upload && that.fileArr.length === 0){
              that.$message.warning(`请上传证明材料！`);
              return false;
            }
            that.confirmLoading = true
            let httpurl = ''
            const method = 'post'
            httpurl += this.url.add
            const params = Object.assign(this.model, values);
            const formData = new FormData();
            formData.append(`id`,params.id);
            formData.append(`empName`,params.empName);
            formData.append(`empIdcard`,params.empIdcard);
            formData.append(`bankName`,params.bankName);
            formData.append(`bankNo`,params.bankNo);
            formData.append(`accountType`,0);
            formData.append(`orgName`,'');
            formData.append(`adjustmentType`,(this.model.adjustmentType == 0 || this.showFile) ? 0 : 1);
            that.uploadFile.forEach(item=>{
              formData.append(`files`,item);
            })
            
            httpAction(httpurl, formData, method).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.msg || res.message)
              }
            }).finally(() => {
              setTimeout(()=>{
                that.confirmLoading = false
              },2000)
            })
          }
        })
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
        this.confirmLoading = false
        // this.canUpload = true
        this.fileList = [];
        this.fileArr = [];
        this.showFile = false;
        this.uploadFile = [];
      },
      /******************************************* 验证规则 *******************************************/
      // 身份证号验证
      validateIdCard(rule, s, callback) {
        // 是否为空
        if (!s) {
          callback()
          return false
        }
        // 18位
        if (s.length !== 18) {
          callback('请填写18位身份证号！')
          return false
        }
        callback();
        return true
      },
      // 银行卡号验证
      validateBankNo(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if(value.length>25){
          callback('银行卡号不能超过25位！')
          return false
        }
        callback()
        return true
      },
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 110px;
  }
}
.reason{
  display: flex;
  :global(.ant-form-item-control-wrapper){
    width: 610px;
  }
}
.uploadStyle{
  :global(.ant-upload-list){
    float: left;
  }
}
.uploadBtn{
  padding: 0px;
  :global(span){
    text-decoration: underline;
  }
}
</style>
