<template>
  <a-modal
    :title="title"
    :width="800"
    placement="right"
    :closable="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="导出"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form margin-left-explain"
      >
        <!--
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
        -->
        
        <a-row>
          <a-alert
            message="拖拽可排序"
            type="info"
            show-icon
          />
          <a-col :span="24">
            <a-form-item>
              <a-checkbox
                style="margin-left: 20px;"
                :indeterminate="indeterminate"
                v-model="checkAll"
                @change="onCheckAllChange"
              >全选</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item>

              <a-checkbox-group
                v-model="checkedFields"
                @change="onChange"
              >
                <draggable
                  draggable=".item"
                  :list="exportFields"
                >
                  <a-checkbox
                    v-for="(value) in exportFields"
                    :class="{'stepFormText':true,'item':checkedFields.find(v=>v==value)}"
                    :key="value"
                    :value="value"
                    style="margin-left: 20px; line-height: 30px;"
                  >{{ value }}</a-checkbox>
                </draggable>
              </a-checkbox-group>
            </a-form-item>

          </a-col>
        </a-row>
        <!--
          <a-col :span="24">
            <a-form-item>
              <a-checkbox-group
                v-decorator="[ 'checked', { initialValue: this.checkState.checkedList, rules:[ { required: true, message: '请选择一项！' } ] } ]"
                @change="onChange"
              >
                <a-checkbox
                  class="stepFormText"
                  v-for="(value, key) in exportFields"
                  :key="key"
                  :value="value"
                  style="margin-left: 20px; line-height: 50px;"
                >{{ value }}</a-checkbox>
              </a-checkbox-group>
            </a-form-item>

          </a-col>
        -->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  // import pick from 'lodash.pick'
  import { downFile,httpAction } from '@/api/manage'
  import draggable from "vuedraggable"

  export default {
    name: 'DispatchApplyExportModal',
    components:{
      draggable
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        params:{}, //查询参数
        exportFields: [], // 表头数据
        idArr:[],
        type:0,
        checkedFields:[],
        indeterminate: false,
        checkAll: true,
        checkState: {
          checkedList: [],  // 选择的项
          indeterminate: false, // 部分选择
          checkAll: true, // 全选
        },
        url: {
          exportXlsUrl: '/busiInsurance/tbusinessinsurance/exportHandle', // 导出办理
          exportFields:'/busiInsurance/tbusinessinsurance/getExportFieldName',
        }
      }
    },
    computed:{
      computedCheckedFields(){
        return [].concat(this.checkedFields).sort((n,m)=>{
          return (this.exportFields).findIndex(v=>v==n) - (this.exportFields).findIndex(v=>v==m) 
        })
      }
    },
    watch:{
      checkedFields(){
        this.exportFields.sort((n,m)=>{
          return  !!this.checkedFields.find(v=>v==m)  - !!this.checkedFields.find(v=>v==n)
        })
      }
    },
    methods: {
      // 添加
      add(record) {
        this.idArr = record
        this.edit({})
      },
      // 编辑
      edit() {
        this.form.resetFields()
        httpAction(this.url.exportFields, '','GET').then((res) => {
          if(res.code !== 200){
            this.$message.error(res.msg)
          }
          this.exportFields=res.data
          this.checkedFields = this.exportFields ? ([].concat(this.exportFields)) : [];
          // this.model = Object.assign({}, record)
          this.visible = true
        })
      },
      // 保存按钮
      handleOk() {
        if(this.computedCheckedFields.length == 0){
          this.$message.warning('至少选择一项');
          return false
        }
        const that = this
        // 触发表单验证
        // this.form.validateFields((err, values) => {
        //   if (!err) {
            that.confirmLoading = true
            let httpurl = this.url.exportXlsUrl
            const formData = Object.assign(this.computedCheckedFields)
            console.log(formData);
            
            httpurl += `?exportFields=${formData}`
            if(this.idArr.length){
              httpurl += '&idStr='+this.idArr
            }
            if(this.type == 2){
              httpurl += '&status=1'
            }
            delete that.params.current
            delete that.params.size
            downFile(httpurl, that.params).then((res) => {
              if (res.size > 0) {
                var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
                var downloadElement = document.createElement('a')
                var href = window.URL.createObjectURL(blob) // 创建下载的链接
                downloadElement.href = href
                downloadElement.download = `${that.title}.xls` // 下载后文件名
                document.body.appendChild(downloadElement)
                downloadElement.click() // 点击下载
                document.body.removeChild(downloadElement) // 下载完成移除元素
                window.URL.revokeObjectURL(href) // 释放掉blob对象

                that.$message.success('导出成功！')
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(`没有可以导出的数据！`)
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          },
      //   })
      // },

      // 表单关闭
      handleCancel() {
        this.close()
      },
      // 数据重置
      close() {
        this.$emit('close')
        this.disableSubmit = false
        this.exportFields = []
        // this.checkState = {checkedList: [], indeterminate: false, checkAll: true}
        this.url.exportXlsUrl = ''
        this.type = 0
        this.visible = this.indeterminate = false
        this.checkAll = true
        this.checkedFields = []
        this.url.exportXlsUrl = ''
      },
      // 全部选择
      // onCheckAllChange(e) {
      //   this.checkState.checkedList = e.target.checked ? this.exportFields : []
      //   this.checkState.indeterminate = false
      //   this.checkState.checkAll = e.target.checked
      //   // 更新全选
      //   this.model.checked = this.checkState.checkedList
      //   this.form.setFieldsValue(pick(this.model, 'checked'))
      // },
      onCheckAllChange(val) {
        this.checkedFields = val.target.checked ? ([].concat(this.exportFields)) : []
        this.indeterminate = false
      },
      // 部分选择
      // onChange(checkedList) {
      //   this.checkState.checkedList = checkedList
      //   const nowCheckedList = this.checkState.checkedList
      //   this.checkState.indeterminate = !!nowCheckedList.length && nowCheckedList.length < this.exportFields.length
      //   this.checkState.checkAll = nowCheckedList.length === this.exportFields.length
      // },
      // 部分选择
      onChange(checkedList) {
        this.indeterminate = !!checkedList.length && checkedList.length < this.exportFields.length;
        this.checkAll = checkedList.length === this.exportFields.length;
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
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
</style>

<style lang="less">
.margin-left-explain .has-error .ant-form-explain {
  margin-left: 20px;
}
</style>
