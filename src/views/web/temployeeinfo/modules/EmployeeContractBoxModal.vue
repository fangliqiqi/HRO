<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        :loading="confirmLoading"
        type="primary"
        @click="handleOk"
      >保存</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="8">
            <a-form-item label="合同名称">
              <a-input
                placeholder="请填写合同名称"
                v-decorator="['contractName', validatorRules.contractName]"
                style="width: 154px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="合同编码"
              class="stepFormText"
            >
              <a-input
                placeholder="请填写合同编码"
                v-decorator="['contractNo', {}]"
                style="width: 154px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="合同类型"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择合同类型"
                v-decorator="['contractType', validatorRules.contractType]"
                :dropdownMatchSelectWidth="false"
                style="width: 154px"
              >
                <a-select-option
                  v-for="(item, index) in employeeContractTypeBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item
              label="起始日期"
              class="stepFormText"
            >
              <a-date-picker
                placeholder="请选择起始日期"
                @change="contractStartChange"
                v-decorator="['contractStart', {initialValue: !model.contractStart ? null :
                  moment(model.contractStart, dateFormat), rules:[{required: true, message: '请选择合同起始日期！'}]}]"
                style="width: 154px"
                format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="截止日期"
              class="stepFormText"
            >
              <a-date-picker
                :disabledDate="disabledContractEnd"
                placeholder="请选择截止日期"
                @change="endDatePick"
                v-decorator="['contractEnd', {initialValue: !model.contractEnd ? null : moment(model.contractEnd, dateFormat)}]"
                style="width: 154px"
                format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="合同年限"
              class="stepFormText"
            >
              <a-input
                placeholder="请填写合同年限"
                v-decorator="['contractTerm', validatorRules.contractTerm]"
                style="width: 154px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item
              label="主体部门"
              style="margin-left: 11px;"
            >
              <a-input
                placeholder="请填写主体部门"
                v-decorator="['subjectDepart']"
                style="width: 154px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="主体单位"
              style="margin-left: 11px;"
            >
              <a-input
                placeholder="请填写主体单位"
                v-decorator="['subjectUnit']"
                style="width: 154px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="合同岗位"
              style="margin-left: 11px;"
            >
              <a-input
                placeholder="请填写合同岗位"
                v-decorator="['post']"
                style="width: 154px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item
              label="工时制"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择工时制"
                v-decorator="['workingHours', {}]"
                :dropdownMatchSelectWidth="false"
                style="width: 154px"
              >
                <a-select-option
                  v-for="(item, index) in workingHoursBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="档案柜号"
              style="margin-left: 11px;"
            >
              <a-input
                placeholder="请填写档案柜号"
                v-decorator="['fileCabinetNo']"
                style="width: 154px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="签订情况"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择签订情况"
                v-decorator="['situation', validatorRules.situation]"
                :dropdownMatchSelectWidth="false"
                style="width: 154px"
              >
                <a-select-option
                  v-for="(item, index) in situationTypeBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="附件上传"
              style="margin-left: 11px;"
            >
              <div
                class="clearfix"
                style="width: 600px;"
              >
                <a-upload
                  listType="picture-card"
                  :fileList="fileList"
                  @change="handleImport"
                  @preview="handlePreview"
                  :multiple="true"
                  accept=".jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.gif,.pdf,.doc,.docx"
                  :remove="handleRemove"
                  :beforeUpload="beforeUpload"
                >
                  <div
                    v-if="fileList.length < 15"
                    style="display: inline-block;"
                  >
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传</div>
                  </div>
                </a-upload>
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
              </div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注"
              style="margin-left: 39px;"
            >
              <a-textarea
                :rows="3"
                placeholder="请填写备注"
                v-decorator="['remark']"
                style="width: 450px"
              />
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
  import { httpAction, postActionHeader } from '@/api/manage'

  export default {
    name: "EmployeeContractBoxModal",
    data() {
      return {
        id: 0,
        moment,
        empId: '',
        model: {},
        fileList: [],
        editFileList: [],
        title:"操作",
        visible: false,
        renewal: false, // 是否续签合同
        previewImage: '',
        previewVisible: false,
        confirmLoading: false,
        form:this.$form.createForm(this),
        workingHoursBelongs: [],  // 工时制
        situationTypeBelongs: [], // 签订情况
        employeeContractTypeBelongs: [],  // 员工合同类型
        modalWidth: 800,
        drawerWidth: 750,
        modaltoggleFlag: true,
        dateFormat: "YYYY-MM-DD", // 时间格式化类型
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        validatorRules: {
          contractName: { rules: [{ required: true, message: '请填写合同名称！' }] },
          contractNo: { rules: [{ required: true, message: '请填写合同编码！' }] },
          contractType: { rules: [{ required: true, message: '请选择合同类型！' }] },
          situation: { rules: [{ required: true, message: '请选择签订情况！' }] },
          contractTerm: { rules: [{ validator: this.validateContractTerm }] },
        },
        url: {
          add: 'hrBase/temployeecontractinfo/save',
          edit: 'hrBase/temployeecontractinfo',
          importUrl: 'hrBase/fileUpload/ossUploadFile?type=0',
          renewalUrl: 'hrBase//temployeecontractinfo/Renewal',
          deleteAtta: 'hrBase/fileUpload/ossFileDelete/',
          updateaDeleteAtta: 'hrBase/temployeecontractinfo/deleteContractFile',
        },
      }
    },
    computed:{
      importExcelUrl: function() {
        return this.url.importUrl
      }
    },
    methods: {
      // 添加
      add() {
        this.edit({})
      },
      // 编辑
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        if (this.renewal) { // 续签合同
          this.model.contractNo = null
          this.model.contractStart = null
          this.model.contractEnd = null
          this.model.contractTerm = null
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'contractName', 'contractNo', 'contractType',
            'contractTerm', 'subjectDepart', 'subjectUnit', 'post', 'workingHours', 'fileCabinetNo', 'situation', 'remark'))
        })
        // 编辑时候附件显示
        if (this.id && !this.renewal) {
          this.fileList = this.model.fileVos ? this.model.fileVos : []
        }
      },
      // 表单提交
      handleOk () {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            let uids = ''
            if (!this.model.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              if (this.renewal) { // 续签合同
                httpurl += this.url.renewalUrl
                method = 'post'
              } else {
                httpurl += this.url.edit
                method = 'put'
              }
            }
            // 日期格式转换
            values.contractStart = values.contractStart ? values.contractStart.format(this.dateFormat) : null
            values.contractEnd = values.contractEnd ? values.contractEnd.format(this.dateFormat) : null
            values.contractTerm = values.contractTerm ? values.contractTerm : 0
            const formData = Object.assign(this.model, values)
            // 删除结算主体字段
            delete formData.settleDomainName
            if (this.renewal) {
              // 续签合同
                delete formData.id
                delete formData.fileVos
                delete formData.empContractAttaList
            }
            if (!this.model.id) {
              //  添加的时候附件
              if (that.fileList.length > 0) {
                for (let i = 0; i < that.fileList.length; i++) {
                  if (i === that.fileList.length - 1) {
                    uids += that.fileList[i].uid
                  } else {
                    uids += `${that.fileList[i].uid},`
                  }
                }
              }
              formData.empId = this.empId
              formData.contractAttaIds = uids
            } else {  // 编辑的时候的时候
              // 附件
              if (that.editFileList.length > 0) {
                for (let i = 0; i < that.editFileList.length; i++) {
                  if (i === that.editFileList.length - 1) {
                    uids += that.editFileList[i].uid
                  } else {
                    uids += `${that.editFileList[i].uid},`
                  }
                }
              }
              formData.contractAttaIds = uids
              // 删除表单不需要的字段
              delete formData.empContractAttaList
              delete formData.fileVos
            }
            httpAction(httpurl, formData, method).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.message || res.msg)
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          }
        })
      },
      // 表单关闭
      handleCancel () {
        this.close()
      },
      // 关闭
      close () {
        this.id = 0
        this.empId = ''
        this.fileList = []
        this.editFileList = []
        this.$emit('close')
        this.visible = false
        this.renewal = false
        this.previewImage = ''
        this.previewVisible = false
        this.confirmLoading = false
        this.employeeBelongs = []
        this.educationBelongs = []
        this.educationTypeBelongs = []
        this.educationSystemBelongs = []
        this.hightIdentificationBelongs = []
      },
      // 计算合同时间
      endDatePick() {
        let contractStart = this.form.getFieldValue('contractStart')
        contractStart = contractStart ? contractStart.format(this.dateFormat) : null       
        if (!contractStart) {
          this.$message.warning('请先选择合同起始日期！')
          this.model.contractEnd = null
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'contractEnd'))
          })
          return false
        }
      },
      // 附件上传相关功能
      handlePreviwCancel () {
        this.previewVisible = false
      },
      handlePreview (file) {
        const fileName = file.name
        const surfixIndex = fileName.lastIndexOf('.')
        let surfix = ''
        if (surfixIndex !== -1) {
          surfix = fileName.substring(surfixIndex + 1, fileName.length).toLowerCase()
        }
        if (String(surfix) === 'docx' || String(surfix) === 'doc' || String(surfix) === 'pdf') {
          this.previewVisible = false
          window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url || file.thumbUrl)}`, '_blank')
        } else {
          this.previewImage = file.url || file.thumbUrl
          this.previewVisible = true
        }
      },
      handleRemove(file) {
        let reqUrl = ''
        let method = ''
        this.confirmLoading = true
        if (this.id) {  // 编辑的时候
          const editIndex = this.editFileList.indexOf(file)
          if (editIndex !== -1) {  // 找到了（说明是新增加的图片）
            const editNewFileList = this.editFileList.slice()
            editNewFileList.splice(editIndex, 1)
            this.editFileList = editNewFileList
            reqUrl = this.url.deleteAtta + file.uid
            method = 'get'
          } else {
            // 未找到（说明是新增时候添加的老图）
            reqUrl = `${this.url.updateaDeleteAtta}?contractId=${this.id}&id=${file.uid}`
            method = 'post'
          }
        } else {  //添加的时候
          reqUrl = this.url.deleteAtta + file.uid
          method = 'get'
        }
        // 不管是新增还是老图，只要删除，都会把fileList里的内容删除
        const index = this.fileList.indexOf(file)
        const newFileList = this.fileList.slice()
        newFileList.splice(index, 1)
        this.fileList = newFileList
        const that = this
        httpAction(reqUrl, null, method).then((res) => {
          if (Number(res.code) === 200) {
            that.$message.success('删除成功！')
          } else {
            that.$message.warning(res.message || res.msg)
          }
          this.confirmLoading = false
        })
      },
      beforeUpload(file) {
        this.fileList = [...this.fileList, file]
        return false
      },
      handleImport() {
        const { fileList } = this
        this.uploadFilesChange(fileList[fileList.length - 1])
      },
      uploadFilesChange(file) {
        this.confirmLoading = true
        const formData = new FormData()
        formData.append("file", file)
        formData.append("type", 1)
        const contextType = {'Content-Type': 'multipart/form-data'}
        postActionHeader(this.url.importUrl, formData, contextType).then((res) => {
          const index = this.fileList.indexOf(file)
          const newFileList = this.fileList.slice()
          newFileList.splice(index, 1)
          this.fileList = newFileList
          if (Number(res.code) === 200) {
            const fileImag = {
              uid:res.data.uid,
              name:res.data.name,
              status:res.data.status,
              url:res.data.url,
            }
            this.fileList.push(fileImag)
            // 编辑时候
            if (this.id) {
              this.editFileList.push(fileImag)
            }
          } else {
            this.$message.warning(res.message ||  res.msg)
          }
          this.confirmLoading = false
        })
      },
      // 合同开始时间修改
      contractStartChange() {
        this.model.contractEnd = null
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'contractEnd'))
        })
      },
      // 合同截止日期可选取
      disabledContractEnd(endValue) {
        const contractStart = this.form.getFieldValue('contractStart')
        if (!endValue || !contractStart) {
          return endValue
        } else {
          return contractStart.valueOf() > endValue.valueOf()
        }
      },
      /******************************************* 验证规则 *******************************************/
      // 合同年限验证
      validateContractTerm(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/((^[1-9]\d*)|^0)(\.[1-9])?$/).test(value)) { // 验证（最多一位小数）
          callback('最多一位小数！')
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
    width: 80px;
  }
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
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
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
.ant-upload-select-picture-card i {
  font-size: 49px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 10px;
  padding-bottom: 10px;
}

.drawer-bootom-button {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>
