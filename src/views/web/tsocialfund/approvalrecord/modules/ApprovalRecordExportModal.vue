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
      >导出</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="margin-left-explain"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item>
              <a-checkbox
                style="margin-left: 20px;"
                :indeterminate="checkState.indeterminate"
                @change="onCheckAllChange"
                :checked="checkState.checkAll"
              >全选</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item>
              <a-checkbox-group
                @change="onChange"
                class="checkbox-group-style"
                v-decorator="['checked', {initialValue: this.checkState.checkedList, rules: [{required: true, message: '请选择一项！'}]}]"
              >
                <a-checkbox
                  v-for="(value, key) in exportFields"
                  :key="key"
                  :value="value"
                ><span :title="value">{{ value }}</span></a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { downFile } from '@/api/manage'

  export default {
    name: 'ApprovalRecordExportModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        exportFields: [], // 表头数据
        checkState: {
          checkedList: [],  // 选择的项
          indeterminate: false, // 部分选择
          checkAll: true, // 全选
        },
        url: {
          exportXlsUrl: '', // 导出地址
        },
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
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = this.url.exportXlsUrl
            let formData = Object.assign(this.model, values)
            httpurl += `&exportFields=${formData.checked}`
            downFile(httpurl, '').then((res) => {
              if (res.size > 0) {
                var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'}); // application/vnd.ms-excel这里表示xls类型
                var downloadElement = document.createElement('a')
                var href = window.URL.createObjectURL(blob) // 创建下载的链接
                downloadElement.href = href
                downloadElement.download = `${that.title}.xls` // 下载后文件名
                document.body.appendChild(downloadElement)
                downloadElement.click() // 点击下载
                document.body.removeChild(downloadElement) // 下载完成移除元素
                window.URL.revokeObjectURL(href) // 释放掉blob对象
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(`${(res.msg || res.message)} 失败！`)
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
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.exportFields = []
        this.checkState = {checkedList: [], indeterminate: false, checkAll: true}
        this.url.exportXlsUrl = ''
      },
      // 全部选择
      onCheckAllChange(e) {
        this.checkState.checkedList = e.target.checked ? this.exportFields : []
        this.checkState.indeterminate = false
        this.checkState.checkAll = e.target.checked
        // 更新全选
        this.model.checked = this.checkState.checkedList
        this.form.setFieldsValue(pick(this.model, 'checked'))
      },
      // 部分选择
      onChange(checkedList) {
        this.checkState.checkedList = checkedList
        const nowCheckedList = this.checkState.checkedList
        this.checkState.indeterminate = !!nowCheckedList.length && nowCheckedList.length < this.exportFields.length
        this.checkState.checkAll = nowCheckedList.length === this.exportFields.length
      },
    }
  }
</script>

<style lang="less" scoped>
.checkbox-group-style {
  :global(.ant-checkbox-wrapper) {
    margin-left: 20px;
    line-height: 30px;
    width: 102px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
}
</style>

<style lang="less">
.margin-left-explain .has-error .ant-form-explain {
  margin-left: 20px;
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
