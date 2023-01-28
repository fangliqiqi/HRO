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
            <a-form-item label="选择员工">
              <select-page
                :id="'id'"
                @change="onChange"
                :allowClear="false"
                :title="'empName'"
                :triggerChange="true"
                :style="{width: '154px'}"
                placeholder="请选择员工姓名"
                v-decorator="['empId', validatorRules.empId]"
                :searchUrl="'/hrBase/temployeeinfo/page?deleteFlag=0&empName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :span="16">
            <a-form-item
              label="结算主体"
              style="margin-left: 11px;"
            >
              <a-input
                disabled
                placeholder="结算主体由选择员工姓名所带出"
                v-decorator="['settleDomainName']"
                style="width: 251px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item
              label="证书编号"
              style="margin-left: 11px;"
            >
              <a-input
                placeholder="请填写证书编号"
                v-decorator="['certificationNo', {}]"
                style="width: 154px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="申报年度"
              style="margin-left: 11px;"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择申报年度"
                v-decorator="['declareYear', {}]"
                :dropdownMatchSelectWidth="false"
                style="width: 154px"
              >
                <a-select-option
                  v-for="(item, index) in year"
                  :key="index"
                  :value="item"
                >{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="评定机构"
              style="margin-left: 11px;"
            >
              <a-input
                placeholder="请填写评定机构"
                v-decorator="['assessmentUnit', {}]"
                style="width: 154px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item
              label="获取方式"
              style="margin-left: 11px;"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择获取方式"
                v-decorator="['obtainType', {}]"
                :dropdownMatchSelectWidth="false"
                style="width: 154px"
              >
                <a-select-option
                  v-for="(item, index) in obtainTypeBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="资格类型"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择资格类型"
                v-decorator="['qualificationType', {rules: [{ required: true, message: '请选择资格类型！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 154px"
              >
                <a-select-option
                  v-for="(item, index) in qualificationTypeBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="资格等级"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择资格等级"
                v-decorator="['qualificationLevel', {rules: [{ required: true, message: '请选择资格等级！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 154px"
              >
                <a-select-option
                  v-for="(item, index) in qualificationLevelBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item label="是否最高资格">
              <a-radio-group
                class="fontiframe"
                name="radioGroup"
                v-decorator="['heightIdentification', {initialValue: '0', rules: [{ required: true, message: '请选择！'}]}]"
              >
                <a-radio
                  class="radioGroup"
                  v-for="(value, key) in heightIdentificationBelongs"
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

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注"
              style="margin-left: 39px;"
            >
              <a-textarea
                :rows="3"
                placeholder="请填写备注"
                v-decorator="['remark', {}]"
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
  import pick from 'lodash.pick'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { httpAction, postActionHeader } from '@/api/manage'

  export default {
    name: 'EmployeeProfessionalQualificationModal',
    components: {
      SelectPage,
    },
    data() {
      return {
        year: ['2030', '2029', '2028', '2027', '2026', '2025', '2024', '2023', '2022', '2021',
               '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011',
               '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001',
               '2000', '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991',
               '1990', '1989', '1988', '1987', '1986', '1985', '1984', '1983', '1982', '1981',
               '1980', '1979', '1978', '1977', '1976', '1975', '1974', '1973', '1972', '1971',
               '1970', '1969', '1968', '1967', '1966', '1965', '1964', '1963', '1962', '1961',
               '1960', '1959', '1958', '1957', '1956', '1955', '1954', '1953', '1952', '1951',
               '1950'
        ],  // 年限数组
        id: 0,
        model: {},
        fileList: [],
        editFileList: [],
        title: '操作',
        visible: false,
        previewImage: '',
        previewVisible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        obtainTypeBelongs: [],  // 获取方式
        settleDomainBelongs: [],  // 所属关系列表
        qualificationTypeBelongs: [], // 资格类型
        qualificationLevelBelongs: [],  // 资格等级
        heightIdentificationBelongs: {},  // 是否最高资格
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
          certificationNo: { rules: [{ required: true, message: '请填写证书编号！' }] },
        },
        url: {
          add: 'hrBase/tempprofessionalqualification',
          edit: 'hrBase/tempprofessionalqualification',
          importUrl:'hrBase/fileUpload/ossUploadFile?type=0',
          deleteAtta: 'hrBase/fileUpload/ossFileDelete/',
          updateaDeleteAtta: 'hrBase/tempprofessionalqualification/deleteQualificationFile',
        },
      }
    },

    created() {
      const cYear = (new Date()).getFullYear() + '' // 获取当前年份
      const yearArray = this.year // 年限数组
      const cYearIndex = yearArray.indexOf(cYear) // 查找当前年份所在数组位置（默认当前年份值都会在数组中，不在数组中说明数据爆炸错误！！！）
      this.year = yearArray.splice(cYearIndex, yearArray.length - cYearIndex) // 获取删除掉的数组组成新的年限数组
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
          this.form.setFieldsValue(pick(this.model, 'certificationNo', 'declareYear', 'assessmentUnit',
            'obtainType', 'qualificationType', 'qualificationLevel', 'heightIdentification', 'remark'))
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
              formData.qualificationAttaIds = uids
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
              formData.qualificationAttaIds = uids
              // 删除表单不需要的字段
              delete formData.qualificationAttaList
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
        this.obtainTypeBelongs = []
        this.settleDomainBelongs = []
        this.qualificationTypeBelongs = []
        this.qualificationLevelBelongs = []
        this.heightIdentificationBelongs = {}
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
            reqUrl = `${this.url.updateaDeleteAtta}?qualificationId=${this.id}&id=${file.uid}`
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
