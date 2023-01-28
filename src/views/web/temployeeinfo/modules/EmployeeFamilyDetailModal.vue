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
            <a-form-item
              label="员工编码"
              style="margin-left: 29px;"
            >
              <a-tooltip
                placement="topLeft"
                :title="model.empCode ? model.empCode : '-'"
              >
                {{ model.empCode ? model.empCode : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="员工姓名"
              style="margin-left: 14px;"
            >
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
            <a-form-item
              label="成员姓名"
              style="margin-left: 29px;"
            >
              <a-tooltip
                placement="topLeft"
                :title="model.familyName ? model.familyName : '-'"
              >
                {{ model.familyName ? model.familyName : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="与本人关系">
              <a-tooltip
                placement="topLeft"
                :title="relationshipSelf ? relationshipSelf : '-'"
              >
                {{ relationshipSelf ? relationshipSelf : '-' }}
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
              label="出生日期"
              style="margin-left: 28px;"
            >
              <a-tooltip
                placement="topLeft"
                :title="model.birthday ? model.birthday : '-'"
              >
                {{ model.birthday ? model.birthday : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="工作单位"
              style="margin-left: 14px;"
            >
              <a-tooltip
                placement="topLeft"
                :title="model.workUnit ? model.workUnit : '-'"
              >
                {{ model.workUnit ? model.workUnit : '-' }}
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
              label="联系电话"
              style="margin-left: 28px;"
            >
              <a-tooltip
                placement="topLeft"
                :title="model.contractTel ? model.contractTel : '-'"
              >
                {{ model.contractTel ? model.contractTel : '-' }}
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
    name: 'EmployeeFamilyDetailModal',
    data() {
      return {
        model: {},
        title: '详情',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        relationshipSelf: '', // 所属关系列表
        relationshipSelfBelongs: [],  // 所属关系列表
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
        // 与本人关系
        this.relationshipSelf = filterDictText(this.relationshipSelfBelongs, this.model.relationshipSelf)
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
        this.relationshipSelf = ''
        this.relationshipSelfBelongs = []
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
}
</style>
