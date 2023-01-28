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
    :confirm-loading="confirmLoading"
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
          <a-col :span="24" v-if="showType">
            <a-radio-group @change="onChangeType" v-model="vtype">
              <a-radio :value="1">30日内到期预警</a-radio>
              <a-radio :value="2">已过期提醒</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  // import pick from 'lodash.pick'
  import { downFile,httpAction } from '@/api/manage'
  import draggable from "vuedraggable"

  export default {
    name: 'ExportListModal',
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
        showType:false,
        checkedFields:[],
        indeterminate: false, // 部分选择
        checkAll: true, // 全选
        exportType: 0, // 0 后台导出 1 前端导出
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
          if(Number(res.code) !== 200){
            this.$message.error(res.msg)
            return false
          }
          this.exportFields=res.data
          this.checkedFields = this.exportFields ? ([].concat(this.exportFields)) : [];
          // this.model = Object.assign({}, record)
          this.visible = true
        })
      },
      handleParam(url,params){
        if(/\?/.test(url)){
          url += `&${params}`
        }else{
          url += `?${params}`
        }
        return url
      },
      // 保存按钮
      handleOk() {
        if(this.computedCheckedFields.length == 0){
          this.$message.warning('至少选择一项');
          return false
        }
        const that = this
        let httpurl = this.url.exportXlsUrl
        const formData = Object.assign(this.computedCheckedFields)
        if(this.exportType === 1){
          that.$emit('export',formData)
          that.close()
          return
        }
        httpurl = this.handleParam(httpurl,`exportFields=${formData}`)
        if(this.idArr && this.idArr.length){
          httpurl += `&idStr=${this.idArr}`
        }
        if(this.showType){
          httpurl += `&type=${this.vtype}`
        }
        delete that.params.current
        delete that.params.size
        that.confirmLoading = true
        downFile(httpurl, that.params).then((res) => {
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
        this.exportType = 0
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
.margin-left-explain .has-error .ant-form-explain {
  margin-left: 20px;
}
</style>
