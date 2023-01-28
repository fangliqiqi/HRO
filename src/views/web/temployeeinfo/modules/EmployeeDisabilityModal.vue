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
        <a-row v-if="!id">
          <a-col :span="8">
            <a-form-item
              label="选择员工"
              style="margin-left: 14px;"
            >
              <select-page
                :id="'id'"
                @change="onChange"
                :allowClear="false"
                :title="'empName'"
                :triggerChange="true"
                :style="{width: '140px'}"
                placeholder="请选择员工姓名"
                v-decorator="['empId', validatorRules.empId]"
                :searchUrl="'/hrBase/temployeeinfo/page?deleteFlag=0&empName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :span="16">
            <a-form-item
              label="结算主体"
              style="margin-left: 14px;"
            >
              <a-input
                disabled
                placeholder="结算主体由选择员工姓名所带出"
                v-decorator="['settleDomainName']"
                style="width: 245px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item label="伤残病名称">
              <a-input
                placeholder="请填写伤残病名称"
                v-decorator="['disabilityName', validatorRules.disabilityName]"
                style="width: 140px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="职业病名称">
              <a-input
                placeholder="请填写职业病名称"
                v-decorator="['occupationalDisease']"
                style="width: 151px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="伤残等级"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择伤残等级"
                v-decorator="['disabilityLevel', validatorRules.disabilityLevel]"
                :dropdownMatchSelectWidth="false"
                style="width: 154px"
              >
                <a-select-option
                  v-for="(item, index) in disabilityLevelBelongs"
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
              label="伤残开始"
              style="margin-left: 14px;"
            >
              <a-date-picker
                :disabledDate="disabledStartTime"
                @change="startTimeChange"
                placeholder="请选择开始日期"
                v-decorator="['startTime', {initialValue: !model.startTime ? null : moment(model.startTime, dateFormat), rules:[{required: true, message: '请选择开始日期！'}]}]"
                style="width: 140px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="伤残结束"
              style="margin-left: 3px;"
            >
              <a-date-picker
                :disabledDate="disabledEndTime"
                placeholder="请选择结束日期"
                v-decorator="['endTime', {initialValue: !model.endTime ? null : moment(model.endTime, dateFormat), rules:[{required: true, message: '请选择结束日期！'}]}]"
                style="width: 151px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="是否工伤"
              style="margin-left: 11px;"
            >
              <a-radio-group
                class="fontiframe"
                name="radioGroup"
                v-decorator="['injuryIdentification', {initialValue: '0'}]"
              >
                <a-radio
                  class="radioGroup"
                  v-for="(value, key) in injuryIdentificationBelongs"
                  :key="key"
                  :value="key"
                >{{ value.option }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="附件上传"
              style="margin-left: 25px;"
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

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注"
              style="margin-left: 53px;"
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
  import SelectPage from '@/components/jeecg/SelectPage'
  import { httpAction, postActionHeader } from '@/api/manage'

  export default {
    name: 'EmployeeDisabilityModal',
    components: {
      SelectPage,
    },
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
        settleDomainBelongs: [], // 结算主体与所属单位
        disabilityLevelBelongs: [], // 伤残等级
        injuryIdentificationBelongs: {},  // 是否工伤
        dateFormat: "YYYY-MM-DD", // 时间格式化类型
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          empId: { rules: [{ required: true, message: '请选择员工！' }] },
          disabilityName: { rules: [{ required: true, message: '请填写伤残病名称！' }] },
          disabilityLevel: { rules: [{ required: true, message: '请选择伤残等级！' }] },
        },
        url: {
          add: 'hrBase/tempdisabilityinfo',
          edit: 'hrBase/tempdisabilityinfo',
          importUrl:'hrBase/fileUpload/ossUploadFile?type=0',
          deleteAtta: 'hrBase/fileUpload/ossFileDelete/',
          updateaDeleteAtta: 'hrBase/tempdisabilityinfo/deleteDisabiltiyFile',
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
          this.form.setFieldsValue(pick(this.model, 'disabilityName', 'occupationalDisease', 'disabilityLevel', 'injuryIdentification', 'remark'))
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
            // 伤残开始日期格式转换
            values.startTime = values.startTime ? values.startTime.format(this.dateFormat) : null
            // 伤残结束日期格式转换
            values.endTime = values.endTime ? values.endTime.format(this.dateFormat) : null
            let formData = Object.assign(this.model, values)
            // 删除结算主体字段
            delete formData.settleDomainName
            if (!this.model.id) {
              //  添加的时候// 附件
              if (that.fileList.length > 0) {
                for (let i = 0; i < that.fileList.length; i++) {
                  if (i === that.fileList.length - 1) {
                    uids += that.fileList[i].uid
                  } else {
                    uids += `${that.fileList[i].uid},`
                  }
                }
              }
              formData.disabilityAttaIds = uids
            } else {
              // 编辑的时候的时候// 附件
              if (that.editFileList.length > 0) {
                for (let i = 0; i < that.editFileList.length; i++) {
                  if (i === that.editFileList.length - 1) {
                    uids += that.editFileList[i].uid
                  } else {
                    uids += `${that.editFileList[i].uid},`
                  }
                }
              }
              formData.disabilityAttaIds = uids
              // 删除表单不需要的字段
              delete formData.disbilityAttaList
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
        this.settleDomainBelongs = []
        this.disabilityLevelBelongs = []
        this.injuryIdentificationBelongs = {}
      },

      // 员工选择改变
      handleIdEmployeeChange(value) {
        this.model.settleDomainName = '-'
        if (Object.keys(this.settleDomainBelongs).length) {
          this.model.settleDomainName = (this.settleDomainBelongs).hasOwnProperty(value.settleDomainId) ? this.settleDomainBelongs[value.settleDomainId]['departName'] : '-'
        }
        this.form.setFieldsValue(pick(this.model, 'settleDomainName'))
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

          } else {  // 未找到（说明是新增时候添加的老图）
            reqUrl = `${this.url.updateaDeleteAtta}?disabilityId=${this.id}&id=${file.uid}`
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
      // 伤残开始
      startTimeChange() {
        this.model.endTime = null
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'endTime'))
        })
      },

      // 伤残开始
      disabledStartTime(current) {
        return current && current > moment().endOf('day')
      },

      // 伤残结束
      disabledEndTime(current) {
        const startTime = this.form.getFieldValue('startTime')
        if (!current || !startTime) {
          return current
        } else {
          return startTime.valueOf() > current.valueOf()
        }
      },

      // 员工选择改变
      onChange(selectedValue, option) {
        if (option) { // 选择
          const lists = option.context.lists
          let settleDomainName = ''
          // 循环查找点击的list
          if (lists.length > 0) {
            for (const item of lists) {
              if (String(item.id) === String(selectedValue)) {
                settleDomainName += item.item.settleDomainName
                break
              }
            }
          }
          // 设置字段值
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({'settleDomainName': settleDomainName}, 'settleDomainName'))
          })
        }
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
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
