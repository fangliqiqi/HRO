<template>
  <a-modal
    :title="title"
    :width="800"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleCancel"
    cancelText="关闭"
    :visible="visible"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-form-detail"
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
        <a-row>
          <a-col :span="12">
            <a-form-item label="合同类型">
              <a-tooltip
                placement="topLeft"
                :title="model.contractTypeOption || '-'"
              >
                {{ model.contractTypeOption || '-' }}
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
            <a-form-item label="合同主体部门">
              <a-tooltip
                placement="topLeft"
                :title="model.subjectDepart ? model.subjectDepart : '-'"
              >
                {{ model.subjectDepart ? model.subjectDepart : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="合同主体单位">
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
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="工时制"
              style="margin-left: 13px"
            >
              <a-tooltip
                placement="topLeft"
                :title="model.workingHoursOption || '-'"
              >
                {{ model.workingHoursOption || '-' }}
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
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="签订情况"
            >
              <a-tooltip
                placement="topLeft"
                :title="model.situationOption"
              >
                {{ model.situationOption }}
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>
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
    name: 'ContractDetailModal',
    data() {
      return {
        model: {},
        fileList: [],
        title: '详情',
        visible: false,
        form: this.$form.createForm(this),
        employeeContractTypeOptions:[], //合同类型
        workingHoursOptions:[], //工时
        situationTypeOptions:[], //签订情况

        previewImage: '',
        previewVisible: false,
        confirmLoading: false,
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
        this.visible = true
        this.model = Object.assign({}, record)
        this.model.contractTypeOption = filterDictText(this.employeeContractTypeOptions,this.model.contractType)
        this.model.workingHoursOption = filterDictText(this.workingHoursOptions,this.model.workingHours)
        let situation = filterDictText(this.situationTypeOptions,this.model.situation)
        this.model.situationOption = (situation == '-') ? this.model.situation : situation
        this.fileList = this.model.fileVos
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
      },
      handlePreviwCancel () {
        this.previewVisible = false
      },
      handlePreview (file) {
        const fileName = file.name
        const surfixIndex = fileName.lastIndexOf('.')
        let surfix = ''
        if (surfixIndex != -1) {
          surfix = fileName.substring(surfixIndex + 1, fileName.length).toLowerCase()
        }
        if (surfix == 'docx' || surfix == 'doc' || surfix == 'pdf') {
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

<style lang="less" scoped>
.ant-form-detail {
  :global(.img-area .ant-form-item-control .ant-form-item-children) {
    width: 100%;
  }
}
</style>
