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
      <a-button
        type="primary"
        v-if="addLexcelHead"
        :loading="confirmLoading"
        @click="handleAddLexcelHead"
        style="float: left; margin-left: 27px;"
      >保存导出筛选</a-button>
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
            <template v-if="addLexcelHead">
              <a-form-item>
                <a-radio-group
                  class="radio-group-style"
                  v-decorator="['lexcelHead', {initialValue: 0}]"
                  @change="handleRadioChange"
                >
                  <template v-for="(item, key) in lexcelHeadList">
                    <a-radio
                      :key="key"
                      :value="key"
                    >{{ item.name }}</a-radio>
                    <a-popconfirm
                      :key="item.id"
                      title="确定删除吗?"
                      @confirm="() => handleRemove(item.id)"
                    >
                      <a-icon type="close" />
                    </a-popconfirm>
                  </template>
                </a-radio-group>
              </a-form-item>
            </template>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item>
              <a-checkbox-group
                @change="onChange"
                
                v-decorator="['checked', {initialValue: this.checkState.checkedList, rules: [{required: true, message: '请选择一项！'}]}]"
              >
                <a-checkbox
                  v-for="(value, key) in exportFields"
                  :key="key"
                  :value="value"
                  :class="{'stepFormText':true,'item':checkState.checkedList.find(v=>v==value)}"
                  style="margin-left: 20px; line-height: 30px;"
                ><span :title="value">{{ value }}</span></a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <lexcel-head-modal
      ref="lexcelHeadModal"
      @ok="formBackOk"
    ></lexcel-head-modal>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import lexcelHeadModal from './LexcelHeadModal'
  import { downFilePost, httpAction } from '@/api/manage'
  import draggable from "vuedraggable"

  export default {
    name: 'PaymentExportModal',
    components: {
      lexcelHeadModal,
      draggable
    },
    data() {
      return {
        model: {},
        title: '操作',
        maxMun: 3,  // 最大自定义项
        visible: false,
        permission: '', // 权限字符串
        addLexcelHead: false,
        confirmLoading: false,
        lexcelHeadList: [], // 已添加自定义项列表
        form: this.$form.createForm(this),
        exportFields: [], // 表头数据
        checkState: {
          checkedList: [],  // 选择的项
          indeterminate: false, // 部分选择
          checkAll: true, // 全选
        },
        url: {
          delete: 'hrBase/lexcelheadforio/',
          exportXlsUrl: '', // 导出地址
          getLexcelHead: 'hrBase/lexcelheadforio/getOwnList/',
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

        if (this.lexcelHeadList.length > 0) { // 有自定义项
          const firstLexcelHead = JSON.parse(this.lexcelHeadList[0].excelHeadText)
          // 选中
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({checked: firstLexcelHead}, 'checked'))
          })

          if (firstLexcelHead.length != this.exportFields.length) { // 部分选择状态
            this.checkState.indeterminate = true
            this.checkState.checkAll = false
          }
        }
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
            downFilePost(httpurl, formData.checked).then((res) => {
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
      // 添加自定义导出项
      handleAddLexcelHead() {
        const that = this
        if (that.lexcelHeadList.length >= that.maxMun) {
          that.$message.warning(`最多只允许添加${that.maxMun}个筛选配置！`)
        } else {
          // 触发表单验证
          that.form.validateFields((err, values) => {
            if (!err) {
              const formData = Object.assign(that.model, values)
              const reqDatas = {}
              reqDatas.remark = that.title
              reqDatas.useCode = that.permission
              reqDatas.excelHeadText = JSON.stringify(formData.checked)
              that.$refs.lexcelHeadModal.title = '保存导出筛选'
              that.$refs.lexcelHeadModal.maxMun = that.maxMun
              that.$refs.lexcelHeadModal.reqDatas = reqDatas
              that.$refs.lexcelHeadModal.add()
            }
          })
        }
      },
      // 删除
      handleRemove(id) {
        httpAction(this.url.delete + id, {}, 'DELETE').then((res) => {
          if (Number(res.code) === 200) {
            this.$message.success("删除成功")
            this.loadLexcelHead('remove')
          } else {
            this.$message.warning(res.message || res.msg)
          }
        })
      },
      // 回调
      formBackOk() {
        this.loadLexcelHead('back')
      },
      // 加载自定义列表
      loadLexcelHead(type) {
        httpAction(this.url.getLexcelHead + this.permission, {}, 'GET').then((res) => {
          if (Number(res.code) === 200) {
            this.lexcelHeadList = res.data
            if (this.lexcelHeadList.length > 0) { // 有自定义项
              let lexcelHead = ''
              if (String(type) === 'remove') {  // 删除
                lexcelHead = JSON.parse(this.lexcelHeadList[0].excelHeadText)
                this.$nextTick(() => {
                  this.form.setFieldsValue(pick({'lexcelHead': 0}, 'lexcelHead'))
                })
              } else {  // 新增
                lexcelHead = JSON.parse(this.lexcelHeadList[this.lexcelHeadList.length - 1].excelHeadText)
                this.$nextTick(() => {
                  this.form.setFieldsValue(pick({'lexcelHead': this.lexcelHeadList.length - 1}, 'lexcelHead'))
                })
              }
              
              // 选中
              this.$nextTick(() => {
                this.form.setFieldsValue(pick({checked: lexcelHead}, 'checked'))
              })

              if (lexcelHead.length !== this.exportFields.length) { // 部分选择状态
                this.checkState.indeterminate = true
                this.checkState.checkAll = false
              } else {  // 全部选择状态
                this.checkState.indeterminate = false
                this.checkState.checkAll = true
              }
            }
          } else {
            this.$message.warning(res.message || res.msg)
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
        this.maxMun = 3  // 最大自定义项
        this.visible = false
        this.permission = '' // 权限字符串
        this.addLexcelHead = false
        this.confirmLoading = false
        this.exportFields = []
        this.lexcelHeadList = [] // 已添加自定义项列表
        this.checkState = {checkedList: [], indeterminate: false, checkAll: true}
        this.url.exportXlsUrl = ''
      },
      // 自定义项选择
      handleRadioChange(value) {
        const checked = value.target.value
        const lexcelHead = JSON.parse(this.lexcelHeadList[checked].excelHeadText)
        // 选中
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({checked: lexcelHead}, 'checked'))
        })

        if (lexcelHead.length !== this.exportFields.length) { // 部分选择状态
          this.checkState.indeterminate = true
          this.checkState.checkAll = false
        } else {  // 全部选择状态
          this.checkState.indeterminate = false
          this.checkState.checkAll = true
        }
      },
      // 全部选择
      onCheckAllChange(e) {
        this.checkState.checkedList = e.target.checked ? this.exportFields : []
        this.checkState.indeterminate = false
        this.checkState.checkAll = e.target.checked
        // 更新全选
        this.model.checked = this.checkState.checkedList
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'checked'))
        })
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
.stepFormText {
  border: 1px dashed #eee;
  padding: 0px 0px 5px 5px;
  margin-bottom: 8px;
  white-space: nowrap;
  z-index: 10;
}
.item:hover {
  border: 1px dashed #333;
  cursor: move;
}
.radio-group-style {
  :global(.ant-radio-wrapper) {
    margin-left: 8px;
    margin-right: 0px;
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
