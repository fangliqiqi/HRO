<template>
  <a-modal
    :title="title"
    :width="800"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    cancelText="关闭"
    :visible="visible"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form ant-form-detail"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item label="员工编码">
              <a-tooltip
                placement="topLeft"
                :title="model.empCode ? model.empCode : '-'"
              >
                {{ model.empCode ? model.empCode : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="员工姓名">
              <a-tooltip
                placement="topLeft"
                :title="model.empName ? model.empName : '-'"
              >
                {{ model.empName ? model.empName : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider
          dashed
          style="margin: 0px;"
        />

        <a-row>
          <a-col :span="12">
            <a-form-item label="证书编号">
              <a-tooltip
                placement="topLeft"
                :title="model.certificationNo ? model.certificationNo : '-'"
              >
                {{ model.certificationNo ? model.certificationNo : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="申报年度">
              <a-tooltip
                placement="topLeft"
                :title="model.declareYear ? model.declareYear : '-'"
              >
                {{ model.declareYear ? model.declareYear : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider
          dashed
          style="margin: 0px;"
        />

        <a-row>
          <a-col :span="12">
            <a-form-item label="评定机构">
              <a-tooltip
                placement="topLeft"
                :title="model.assessmentUnit ? model.assessmentUnit : '-'"
              >
                {{ model.assessmentUnit ? model.assessmentUnit : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="获取方式">
              <a-tooltip
                placement="topLeft"
                :title="obtainTypeStr ? obtainTypeStr : '-'"
              >
                {{ obtainTypeStr ? obtainTypeStr : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider
          dashed
          style="margin: 0px;"
        />

        <a-row>
          <a-col :span="12">
            <a-form-item label="资格类型">
              <a-tooltip
                placement="topLeft"
                :title="qualificationTypeStr ? qualificationTypeStr : '-'"
              >
                {{ qualificationTypeStr ? qualificationTypeStr : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="资格等级">
              <a-tooltip
                placement="topLeft"
                :title="qualificationLevelStr ? qualificationLevelStr : '-'"
              >
                {{ qualificationLevelStr ? qualificationLevelStr : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider
          dashed
          style="margin: 0px;"
        />

        <a-row>
          <a-col :span="12">
            <a-form-item label="是否最高资格">
              <a-tooltip
                placement="topLeft"
                :title="heightIdentificationStr ? heightIdentificationStr : '-'"
              >
                {{ heightIdentificationStr ? heightIdentificationStr : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider
          dashed
          style="margin: 0px;"
        />

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="附件内容"
              class="img-area"
            >
              <div
                class="clearfix"
                style="width: 600px;"
              >
                <a-upload
                  listType="picture-card"
                  :fileList="fileList"
                  @preview="handlePreview"
                  :multiple="true"
                  :disabled="true"
                  accept=".jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.gif,.pdf,.doc,.docx"
                >
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

        <a-divider
          dashed
          style="margin: 0px;"
        />

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注"
              class="form-item-remark"
            >
              <a-tooltip
                placement="topLeft"
                :title="model.remark"
              >
                {{ model.remark }}
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'EmployeeProfessionalQualificationDetailModal',
    data() {
      return {
        model: {},
        fileList: [],
        title: '详情',
        visible: false,
        previewImage: '',
        previewVisible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        obtainTypeStr: '',
        obtainTypeBelongs: [], // 获取方式
        qualificationTypeStr: '',
        qualificationTypeBelongs: [], // 资格类型
        qualificationLevelStr: '',
        qualificationLevelBelongs: [],  // 资格等级
        heightIdentificationStr: '',
        heightIdentificationBelongs: {},  // 是否最高资格
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      }
    },
    methods: {
      // 详情
      edit(record) {
        this.model = Object.assign({}, record)
        this.visible = true
        this.fileList = this.model.fileVos ? this.model.fileVos : []
        // 获取方式
        this.obtainTypeStr = filterDictText(this.obtainTypeBelongs, this.model.obtainType)
        // 资格类型
        this.qualificationTypeStr = filterDictText(this.qualificationTypeBelongs, this.model.qualificationType)
        // 资格等级
        this.qualificationLevelStr = filterDictText(this.qualificationLevelBelongs, this.model.qualificationLevel)
        // 是否最高资格
        this.heightIdentificationStr = this.heightIdentificationBelongs[this.model.heightIdentification]['option']
      },
      // 表单关闭
      handleCancel() {
        this.close()
      },
      // 数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.obtainTypeStr = ''
        this.obtainTypeBelongs = [] // 获取方式
        this.qualificationTypeStr = ''
        this.qualificationTypeBelongs = [] // 资格类型
        this.qualificationLevelStr = ''
        this.qualificationLevelBelongs = []  // 资格等级
        this.heightIdentificationStr = ''
        this.heightIdentificationBelongs = {}  // 是否最高资格
      },
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

<style lang="less" scoped>
.ant-form-detail {
  :global(.ant-form-item-control .ant-form-item-children) {
    width: 250px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  :global(.form-item-remark .ant-form-item-control .ant-form-item-children) {
    width: 694px;
  }
  :global(.img-area .ant-form-item-control .ant-form-item-children) {
    width: 100%;
  }
}
</style>
