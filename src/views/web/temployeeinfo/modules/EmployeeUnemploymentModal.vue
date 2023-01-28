<template>
  <a-modal
    :title="title"
    :width="800"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >保存</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item label="就失业证号">
              <a-input
                placeholder="请填写就失业证号"
                v-decorator="['unemployementNo']"
                style="width: 276px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="优惠证号">
              <a-input
                placeholder="请填写优惠证号"
                v-decorator="['favorableNo']"
                style="width: 290px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item
              label="失业金"
              style="margin-left: 28px;"
            >
              <a-input
                placeholder="请填写失业金"
                v-decorator="['unemploymentMoney', validatorRules.unemploymentMoney]"
                style="width: 276px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="办理时间">
              <a-date-picker
                placeholder="请选择办理时间"
                v-decorator="['processingTime', {initialValue: !model.processingTime ? null : moment(model.processingTime, dateFormat)}]"
                style="width: 290px"
              />
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
                    <div class="ant-upload-text">Upload</div>
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
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction, postActionHeader } from '@/api/manage'

  export default {
    name: 'EmployeeUnemploymentModal',
    data() {
      return {
        id: 0,
        moment,
        model: {},
        fileList: [],
        editFileList: [],
        title: '操作',
        visible: false,
        previewImage: '',
        previewVisible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        dateFormat: "YYYY-MM-DD HH:mm:ss",
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          unemploymentMoney: { rules: [{ validator: this.validateUnemploymentMoney }] },
        },
        url: {
          add: 'hrBase/tempunemployementregistration',
          edit: 'hrBase/tempunemployementregistration',
          importUrl:'hrBase/fileUpload/ossUploadFile?type=0',
          deleteAtta: 'hrBase/fileUpload/ossFileDelete/',
          updateaDeleteAtta: 'hrBase/tempunemployementregistration/deleteUnemploymentFile',
        },
      }
    },

    computed: {
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
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'unemployementNo', 'favorableNo', 'unemploymentMoney'))
        })
        // 编辑时候附件显示
        if (this.id) {
          this.fileList = this.model.fileVos ? this.model.fileVos : []
        }
      },
      // 保存按钮
      handleOk() {
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
              httpurl += this.url.edit
              method = 'put'
            }
            // 办理时间格式转换
            values.processingTime = values.processingTime ? values.processingTime.format(this.dateFormat) : null
            let formData = Object.assign(this.model, values)
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
              formData.unemployementRegAttaIds = uids

            } else {  // 编辑的时候的时候
              if (that.editFileList.length > 0) {
                for (let i = 0; i < that.editFileList.length; i++) {
                  if (i === that.editFileList.length - 1) {
                    uids += that.editFileList[i].uid
                  } else {
                    uids += `${that.editFileList[i].uid},`
                  }
                }
              }
              formData.unemployementRegAttaIds = uids
              // 删除表单不需要的字段
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
      handleCancel() {
        this.close()
      },

      // 数据重置
      close() {
        this.id = 0
        this.fileList = []
        this.editFileList = []
        this.$emit('close')
        this.visible = false
        this.previewImage = ''
        this.previewVisible = false
        this.confirmLoading = false
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
            reqUrl = `${this.url.updateaDeleteAtta}?unemploymentRegId=${this.id}&id=${file.uid}`
            method = 'post'
          }
        } else {
          //添加的时候
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
        const contextType = {'Content-Type': 'multipart/form-data'};
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
              url:res.data.url
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
      /******************************************* 验证规则 *******************************************/
      // 失业金验证
      validateUnemploymentMoney(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*)|0)$/).test(value)) { // 验证规则
          callback('失业金格式不正确！')
          return false
        }
        callback()
      },
    }
  }
</script>

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
