<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    :closable="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="导出"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :maskClosable="false"
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
  // import pick from 'lodash.pick'
  import { downFilePost,httpAction,downFile } from '@/api/manage'
  import draggable from "vuedraggable"

  export default {
    name: 'ExportFieldModal',
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
        vtype:1,
        method:'POST',
        checkedFields:[],
        indeterminate: false,
        checkAll: true,
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

        httpAction(this.url.exportFields, '','GET').then((res) => {
          if(res.code != 200){
            this.$message.error(res.msg)
            return false
          }
          this.exportFields=res.data
          this.checkedFields = this.exportFields ? ([].concat(this.exportFields)) : [];
          this.visible = true
        })

      },
      // 保存按钮
      handleOk() {
        if(this.computedCheckedFields.length == 0){
          this.$message.warning('至少选择一项');
          return false
        }
        const qs = require('qs')
        const that = this
        
        delete that.params.current
        delete that.params.size
        that.confirmLoading = true
        let httpurl = this.url.exportXlsUrl
        const formData = Object.assign(this.computedCheckedFields)
        if(/GET/i.test(this.method)){
          httpurl += `?exportFields=${formData}`
        }
        if(that.idArr && that.idArr.length){
          httpurl += `&idstr=${that.idArr}`
        }else if(this.params.length){
          httpurl += qs.stringify(this.params)
        }else{
          httpurl += (this.params ? ('&'+qs.stringify(this.params)) : '')
        }
        
        if(/GET/i.test(this.method)){
          downFile(httpurl, null).then((res) => {
            if (res.size > 0) {
              var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
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
              that.$message.warning(`${res.msg} 导出失败!`)
            }
          }).finally(() => {
            that.confirmLoading = false
          })
        }else{
          httpurl = that.url.exportXlsUrl
          if(/\?/.test(httpurl)){
            if(qs.stringify(that.params).length){
              httpurl += `&${qs.stringify(that.params)}`
            }
            if(that.idArr && that.idArr.length){
              httpurl += `&idstr=${that.idArr}`
            }
          }else {
            let hasQu = false
            if(qs.stringify(that.params).length){
              httpurl += `?${qs.stringify(that.params)}`
              hasQu = true
            }
            if(that.idArr && that.idArr.length){
              httpurl += (hasQu?'&':'?') + `idstr=${that.idArr}`
            }
          }
          downFilePost(httpurl, formData).then((res) => {
            if (res.size > 0) {
              var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
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
              that.$message.warning(`${res.msg} 导出失败!`)
            }
          }).finally(() => {
            that.confirmLoading = false
          })
        }
            
       
      },
      handleParam(url,params){
        if(/\?/.test(url)){
          url += `&${params}`
        }else{
          url += `?${params}`
        }
        return url
      },
      // 表单关闭
      handleCancel() {
        this.close()
      },
      // 数据重置
      close() {
        this.$emit('close')
        this.visible = this.indeterminate = false
        this.disableSubmit = false
        this.exportFields = []
        this.checkAll = true
        this.checkedFields = []
        this.url.exportXlsUrl = ''
        this.type = 0
        this.vtype = 1
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
      onChangeType(e){
        this.vtype = e.target.value
      }
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */

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
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
.stepFormText {
  width: 20%;
  line-height: 30px !important;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
</style>

<style lang="less">
.margin-left-explain .has-error .ant-form-explain {
  margin-left: 20px;
}
</style>
