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
                :title="model.empNo ? model.empNo: '-'"
              >
                {{ model.empNo ? model.empNo: '-' }}
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
            <a-form-item label="合同名称">
              <a-tooltip
                placement="topLeft"
                :title="model.contractName ? model.contractName : '-'"
              >
                {{ model.contractName ? model.contractName : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合同编码">
              <a-tooltip
                placement="topLeft"
                :title="model.contractNo ? model.contractNo : '-'"
              >
                {{ model.contractNo ? model.contractNo : '-' }}
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
            <a-form-item label="合同类型">
              <a-tooltip
                placement="topLeft"
                :title="employeeContractTypeStr ? employeeContractTypeStr : '-'"
              >
                {{ employeeContractTypeStr ? employeeContractTypeStr : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合同时间">
              <a-tooltip
                placement="topLeft"
                :title="((model.contractStart ? model.contractStart : '-') + '~' + (model.contractEnd ? model.contractEnd : '-'))"
              >
                {{ model.contractStart ? model.contractStart : '-' }} ~ {{ model.contractEnd ? model.contractEnd : '-' }}
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
            <a-form-item label="合同年限">
              <a-tooltip
                placement="topLeft"
                :title="model.contractTerm ? model.contractTerm : '-'"
              >
                {{ model.contractTerm ? model.contractTerm : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="结算主体">
              <a-tooltip
                placement="topLeft"
                :title="model.departName ? model.departName : '-'"
              >
                {{ model.departName ? model.departName : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="签订部门">
              <a-tooltip
                placement="topLeft"
                :title="model.subjectDepart ? model.subjectDepart : '-'"
              >
                {{ model.subjectDepart ? model.subjectDepart : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="签订单位">
              <a-tooltip
                placement="topLeft"
                :title="model.subjectUnit ? model.subjectUnit : '-'"
              >
                {{ model.subjectUnit ? model.subjectUnit : '-' }}
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
            <a-form-item label="主体单位">
              <a-tooltip
                placement="topLeft"
                :title="model.subjectUnit ? model.subjectUnit : '-'"
              >
                {{ model.subjectUnit ? model.subjectUnit : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合同岗位">
              <a-tooltip
                placement="topLeft"
                :title="model.post ? model.post : '-'"
              >
                {{ model.post ? model.post : '-' }}
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
            <a-form-item
              label="工时制"
              style="margin-left: 13px"
            >
              <a-tooltip
                placement="topLeft"
                :title="workingHoursStr ? workingHoursStr : '-'"
              >
                {{ workingHoursStr ? workingHoursStr : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="档案柜号">
              <a-tooltip
                placement="topLeft"
                :title="model.fileCabinetNo ? model.fileCabinetNo : '-'"
              >
                {{ model.fileCabinetNo ? model.fileCabinetNo : '-' }}
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
              label="签订情况"
            >
              <a-tooltip
                placement="topLeft"
                :title="model.situation ? model.situation : '-'"
              >
                {{ model.situation ? model.situation : '-' }}
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
                  :showUploadList="{showRemoveIcon:false}"
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
    name: 'EmployeeContractDetailModal',
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
        workingHoursStr: '',
        workingHoursBelongs: [],
        situationTypeStr: '',
        situationTypeBelongs:[],
        employeeContractTypeStr: '',
        employeeContractTypeBelongs: [],
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
        // 工时制
        this.workingHoursStr = filterDictText(this.workingHoursBelongs, this.model.workingHours)
        // 合同类型
        this.employeeContractTypeStr = filterDictText(this.employeeContractTypeBelongs, this.model.contractType)
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
        this.fileList = []
        this.workingHoursStr = ''
        this.workingHoursBelongs = []
        this.employeeContractTypeStr = ''
        this.employeeContractTypeBelongs = []
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
        }else{
          // eslint-disable-next-line no-useless-escape
          const tem = file.url.match(/\.[^\.]+\?/i)
          if(tem && /(zip|rar)/.test(tem[0])) {
            surfix = 'zip'
          }
        }
        if (String(surfix) === 'docx' || String(surfix) === 'doc' || String(surfix) === 'pdf') {
          this.previewVisible = false
          window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url || file.thumbUrl)}`, '_blank')
        } else if(surfix === 'zip'){
          window.open(file.url,'_blank')
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
    width: 290px;
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
