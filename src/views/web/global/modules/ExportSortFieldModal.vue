<template>
  <a-modal
    :title="title"
    :width="900"
    placement="right"
    :closable="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="导出"
    :visible="visible"
    :maskClosable="false"
    :confirm-loading="confirmLoading"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form margin-left-explain"
      >
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
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  // npm install vuedraggable  
  // import pick from 'lodash.pick'
  import { downFilePost } from '@/api/manage'
  import draggable from "vuedraggable"

  export default {
    name: 'ExportSortFieldModal',
    components: {
      draggable
    },
    data() {
      return {
        model: {},
        title: '结算主体',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        params:{}, //查询参数
        exportFields: [], // 表头数据
        checkedFields:[],
        indeterminate: false,
        checkAll: true,
        idArr:[],
        url: {
          exportXlsUrl: 'hrBase/tsettledomain/doexport', // 导出
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

      show(arr){
        this.visible = true
        this.exportFields=arr
        this.checkedFields = this.exportFields ? ([].concat(this.exportFields)) : [];
      },
      // 保存按钮
      handleOk() {
        if(this.computedCheckedFields.length == 0){
          this.$message.warning('至少选择一项');
          return false
        }
        
        const qs = require('qs')
        let httpurl = this.url.exportXlsUrl + '?' + qs.stringify(this.params)
        if(this.idArr && this.idArr.length){
          httpurl += '&idStr='+this.idArr
        }
        delete this.params.current
        delete this.params.size
        this.confirmLoading = true
        downFilePost(httpurl, this.computedCheckedFields).then((res) => {
          if (res.size > 0) {
            var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
            var downloadElement = document.createElement('a')
            var href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.href = href
            downloadElement.download = `${this.title}.xls` // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象

            this.$message.success('导出成功！')
            this.$emit('ok')
            this.close()
          } else {
            this.$message.warning(`${res.msg} 导出失败!`)
          }
        }).finally(() => {
          this.confirmLoading = false
        })
        
      },
      // 表单关闭
      handleCancel() {
        this.close()
      },
      // 数据重置
      close() {
        this.$emit('close')
        this.visible = this.indeterminate = false
        this.checkAll = true
        this.exportFields = []
        this.checkedFields = []
        this.url.exportXlsUrl = ''
      },
      // 全部选择
      onCheckAllChange(val) {
        this.checkedFields = val.target.checked ? ([].concat(this.exportFields)) : []
        this.indeterminate = false
      },
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
.ant-col-4 {
  overflow: hidden;
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
