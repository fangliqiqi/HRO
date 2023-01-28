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
            <a-form-item label="工作单位">
              <a-tooltip
                placement="topLeft"
                :title="model.workUnit ? model.workUnit : '-'"
              >
                {{ model.workUnit ? model.workUnit : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="工作部门">
              <a-tooltip
                placement="topLeft"
                :title="model.workDepart ? model.workDepart : '-'"
              >
                {{ model.workDepart ? model.workDepart : '-' }}
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
            <a-form-item label="工作岗位">
              <a-tooltip
                placement="topLeft"
                :title="model.workJob ? model.workJob : '-'"
              >
                {{ model.workJob ? model.workJob : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="工作类型">
              <a-tooltip
                placement="topLeft"
                :title="empTypStr ? empTypStr : '-'"
              >
                {{ empTypStr ? empTypStr : '-' }}
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
            <a-form-item label="是否在岗">
              <a-tooltip
                placement="topLeft"
                :title="workingStatusStr ? workingStatusStr : '-'"
              >
                {{ workingStatusStr ? workingStatusStr : '-' }}
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
            <a-form-item label="开始日期">
              <a-tooltip
                placement="topLeft"
                :title="model.startDate ? model.startDate : '-'"
              >
                {{ model.startDate ? model.startDate : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="结束日期">
              <a-tooltip
                placement="topLeft"
                :title="model.endDate ? model.endDate : '-'"
              >
                {{ model.endDate ? model.endDate : '-' }}
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
    name: 'EmployeeWorkDetailModal',
    data() {
      return {
        model: {},
        title: '详情',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        empTypStr: '',  // 员工类型字典
        workTypeBelongs: [], // 工作类型
        workingStatusStr: '', // 是否在岗字典
        workingStatusBelongs: {},  // 在职状态
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
        // 工作类型
        this.empTypStr = filterDictText(this.workTypeBelongs, this.model.workingType)
        // 是否在岗
        this.workingStatusStr = this.workingStatusBelongs[this.model.workingStatus]['option']
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
        this.empTypStr = ''
        this.workTypeBelongs = []
        this.workingStatusStr = ''
        this.workingStatusBelongs = {}
      }
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
}
</style>
