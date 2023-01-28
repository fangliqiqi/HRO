<template>
  <a-modal
    :title="title"
    :width="800"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        v-if="isUploaded !== 2"
        type="primary"
        :loading="confirmLoading"
        @click="handleOk"
      >提交归档</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="inline" class="ant-advanced-search-form">
        <a-row v-if="!isUploaded">
          <a-col :span="24">
            <a-form-item label="快递单号" class="stepFormText">
              <a-input v-decorator="['expressNo']" style="width: 265px" placeholder="请输入合法快递单号" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="isUploaded">
          <a-col :span="24">
            <a-form-item label="合同上传" class="stepFormText">
              <div class="clearfix" style="width: 600px">
                <a-upload
                  listType="picture-card"
                  :fileList="fileList"
                  @change="handleImport"
                  @preview="handlePreview"
                  :multiple="true"
                  accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx,.rar,.zip"
                  :remove="handleRemove"
                  :beforeUpload="beforeUpload"
                >
                  <div v-if="fileList.length < 15" style="display: inline-block">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviwCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="!isUploaded">
          <a-col :span="24">
            <a-form-item label="备注" class="stepFormText">
              <a-textarea
                v-decorator="['prAuditOpinion', {}]"
                placeholder="请输入备注"
                :autoSize="{ minRows: 2, maxRows: 5 }"
                style="width: 600px"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, postActionHeader } from '@/api/manage'

export default {
  name: 'CustomerContractHandle',
  data() {
    return {
      isUpload: true, 
      isUploaded: 1, // 1:归档 0:办理 2:修改(合同查询操作列->归档附件)
      title: '操作',
      visible: false,
      treeData: [],
      industryBelongs: [],
      industrySub: [],
      organs: [],
      model: {},
      fileList: [],
      endOpen: false,
      validateDateStatus: '',
      helpText: '',
      ids: '',
      previewVisible: false,
      previewImage: '',
      fileTypeOfOffice: 'xls,xlsx,doc,docx,ppt,pptx',
      confirmLoading: false,
      form: this.$form.createForm(this),
      //数据字典
      startDateRage: '',
      endDateRage: '',
      businessDeveloperId: '',
      businessDeveloperOrgan: '',
      url: {
        add: '/hrBase/tcustomercontract',
        getCustomerInfo: '/hrBase/tcustomerinfo/',
        importUrl: '/hrBase/fileUpload/ossUploadFile',
        getOrgan: '/admin/organizationinfo/getOrgForCus',
        deleteAtta: '/hrBase/mcontractatta/',
        handleAndArchive: '/hrBase/tcustomercontract/handleAndArchive/',
      },
      record: '',
      expressNo: '',
      prAuditOpinion: '',
      isRemoved: false,
      fileArchiveList: [],
    }
  },
  methods: {
    add() {
      this.visible = true
    },
    handleCancel() {
      this.form.resetFields()
      this.$emit('close')
      this.disableSubmit = false
      this.treeData = []
      this.industryBelongs = []
      this.customerBusinessSubTypeDict = []
      this.validateDateStatus = this.helpText = ''
      this.expressNo = ''
      this.prAuditOpinion = ''
      this.confirmLoading = false
      this.isUpload = true
      this.isUploaded = 1
      this.fileList = []
      this.visible = false
    },
    range(start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    // eslint-disable-next-line no-unused-vars
    /* 以下是文件上传相关 */
    handlePreviwCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      const fileExt = file.name.replace(/.+\./, '')
      const reg = new RegExp(fileExt, 'gi')
      if (reg.test(this.fileTypeOfOffice)) {
        this.previewVisible = false
        window.open(
          `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url || file.thumbUrl)}`,
          '_blank'
        )
      } else if (/(pdf|zip|rar)/gi.test(fileExt)) {
        window.open(file.url || file.thumbUrl, '_blank')
      } else {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      }
    },
    handleRemove(file) {
      this.isUpload = false
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      const that = this
      httpAction(this.url.deleteAtta + file.uid, null, 'delete').then((res) => {
        if (res.code === 200) {
          if (res.data) {
            newFileList.splice(index, 1)
            that.fileList = newFileList
            that.$message.success('删除成功！')
          } else {
            that.$message.warning('删除出错，请稍后再试！')
          }
        } else {
          that.$message.warning(res.msg)
        }
        that.isUpload = true
      })
    },
    beforeUpload() {
      return false
    },
    handleImport(file) {
      if (this.isUpload) {
        this.uploadFilesChange(file.file)
      }
    },
    uploadFilesChange(file) {
      const _this = this
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 3)
      formData.append('domain', this.record.id)
      const contextType = { 'Content-Type': 'multipart/form-data' }
      postActionHeader(this.url.importUrl, formData, contextType,60000).then((res) => {
        if (Number(res.code) === 200 && res.data) {
          _this.fileList = [..._this.fileList, res.data]
          console.log(res.data)
          _this.$message.success('上传附件成功')
        } else {
          _this.$message.warning(res.msg)
        }
      })
    },
    /* 以上是文件上传相关 */

    handleOk() {
      const that = this
      function transferData(str) {
        httpAction(str, {}, 'POST')
          .then((res) => {
            if (res.code === 200) {
              that.$message.success(`${that.title}成功！`)
              that.$emit('ok')
            } else {
              that.$message.warning(res.msg)
            }
          })
          .finally(() => {
            that.confirmLoading = false
            that.handleCancel()
          })
      }
      function handleExpress(str, values) {
        let flag = false
        for (const i in values) {
          if (values[i] !== undefined && values[i].trim() !== '') {
            str = `${str}${flag ? '&' : '?'}`
            str = `${str}${i.toString()}=${values[i]}`
            flag = true
          }
        }
        return str
      }

      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let str = `${that.url.handleAndArchive}${this.record.id}`
          if (!that.isUploaded) {
            str=handleExpress(str,values)
          } else {
            that.ids = ''
            if (that.fileList.length > 0) {
              let i = 0
              for (; i < that.fileList.length - 1; i++) {
                that.ids += `${that.ids}${that.fileList[i].uid},`
              }
              that.ids = `${that.ids}${that.fileList[i].uid}`
            } else {
              that.confirmLoading = false
              that.$message.warning('必须上传合同扫描件，否则不允许归档')
              return
            }
            str = `${str}?attaIdArray=${that.ids}`
          }
          transferData(str)
        }
      })
    },
  },
  created() {},
}
</script>

<style lang="less" scoped>
/** Button按钮间距 */
// .ant-btn {
//   margin-left: 30px;
//   margin-bottom: 30px;
//   float: right;
// }
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}

.stepFormText {
  :global(.ant-form-item-label) {
    width: 80px;
    text-align: left;
  }
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

h2 {
  font-weight: 700;
  font-size: 18px;
  height: 50px;
}
</style>
