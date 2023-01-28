<template>
  <a-modal
    :title="title"
    :width="810"
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
        </a-row>
        <a-row>
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
              请核对并修改错误信息后，点击保存！
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="账户名"
              class="stepFormText"
            >
              <a-input
                placeholder="请输入账户名"
                v-decorator="['empName', {rules: [{ required: true, message: '请输入员工姓名！' }]}]"
                style="width: 220px"
                @change="changeName"
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
                v-decorator="['bankName', validatorRules.bankName]"
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
                style="width:220px"
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
                class="stepFormText reason1"
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
                  v-decorator="['upload', { rules: [{ required: true, message: '请上传证明材料！' }] }]"
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
    name: 'NoPersonTaxFailModule',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        addButton: true, // 添加按钮
        confirmLoading: false,
        bankOptions: [],  // 开户行
        form: this.$form.createForm(this),
        fileList:[],
        fileArr:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          empIdcard: { rules: [{ required: true, message: '请输入身份证号！' }, { validator: this.validateIdCard }] },
          bankNo: { rules: [{ required: true, message: '请输入银行账号！' }, { validator: this.validateBankNo }] },
          bankName: { rules: [{ required: true, message: '请输入开户行！' }] },
        },
        url: {
          add: 'salary/lostandfoundinfo/doClaim',
        },
        showFile: false,
        uploadFile:[],
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
          this.form.setFieldsValue(pick({...this.model,...{upload: this.fileArr}}, 'empName', 'bankName', 'bankNo','upload'))
        })
      },
      downTemplate(templateUrl){
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`;
        window.location.href = url;
      },
      changeName(e){
        this.showFile = this.model.empName === e.target.value ? false : true;
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
            let method = 'post'
            httpurl += this.url.add
            const params = Object.assign(that.model, values);
            const formData = new FormData();
            formData.append(`id`,params.id);
            formData.append(`accountType`,that.model.accountType);
            formData.append(`adjustmentType`,(that.model.adjustmentType == 0 || that.showFile) ? 0 : 1);
            formData.append(`empName`,params.empName);
            formData.append(`bankName`,params.bankName);
            formData.append(`bankNo`,params.bankNo);
            formData.append(`orgName`,'');
            formData.append(`empIdcard`,params.empIdcard);
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
              that.confirmLoading = false
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
        this.bankOptions = []  // 开户行
        this.uploadFile = [];
        this.fileList = [];
        this.fileArr = [];
        this.showFile = false;
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
        if (s.length != 18) {
          callback('请填写18位身份证号！')
          return false
        }

        var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
        //号码规则校验

        if (!format.test(s)) {
          callback('身份证号有误！')
          return false
        }

        //区位码校验
        //出生年月日校验  前正则限制起始年份为1900;
        var year = s.substr(6, 4),//身份证年
          month = s.substr(10, 2),//身份证月
          date = s.substr(12, 2),//身份证日
          time = Date.parse(month + '-' + date + '-' + year),//身份证日期时间戳date
          now_time = Date.parse(new Date()),//当前时间戳
          dates = (new Date(year, month, 0)).getDate()//身份证当月天数
        if (time > now_time || date > dates) {
          callback('身份证号有误！')
          return false
        }
        //校验码判断
        var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2)  //系数
        var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2') //校验码对照表
        var id_array = s.split("")
        var sum = 0
        for (var k = 0; k < 17; k++) {
          sum += parseInt(id_array[k]) * parseInt(c[k]);
        }
        if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
          callback('身份证号有误！')
          return false
        }
        callback()
      },
      // 银行卡号验证
      validateBankNo(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (value.length>25) {
          callback('银行卡号不能超过25位！')
          return false
        }
        callback()
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 110px;
    height: 60px;
  }
}
.reason{
  display: flex;
  :global(.ant-form-item-control-wrapper){
    width: 610px;
  }
}
.reason1{
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
