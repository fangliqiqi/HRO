<template>
  <a-modal
    :title="title"
    :width="800"
    :closable="true"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="false"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button
        :loading="confirmLoading"
        @click="handleCancel"
      >取消</a-button>
      <a-button
        v-if="showBtn"
        :loading="confirmLoading"
        type="primary"
        @click="handleOk"
      >保存</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
      >
        <a-row>
          <a-col :span="8">
            <a-form-item label="短信类型" class="stepFormText">{{ title.slice(0,-3) }}</a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="模板CODE">{{ model.modelCode }}</a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="发送日期">{{ model.sendDate }}</a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="发送对象" class="stepFormText">
              <a-radio-group v-decorator="['sendObject',{'initialValue':'0'}]" @change="changeRadios" :disabled="!showBtn">
                <a-radio value="0">绑定范围</a-radio> 
                <a-radio value="1">自行导入</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item>
              <a-input type="hidden" v-decorator="['id']" />
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showType">
            <a-form-item label="行业类型(可多选)" class="stepFormText">
              <a-select
                v-decorator="['industryBelong',{ rules: [{ required: true, message: '请选择行业类型!' }] }]"
                placeholder="请选择行业类型"
                mode="multiple"
                :disabled="!showBtn"
                style="width:300px"
                @change="changeSelect"
              >
                <a-select-option
                  v-for="(item, index) in industryBelongOptions"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
            <p style="font-size:12px;color:#999999;margin-left:140px">说明：发送对象为该“行业类型”的单位下，“在职”的员工。</p>
          </a-col>
          <template v-else>
            <a-col :span="24">
              <a-form-item label="发送范围" class="stepFormText">
                <a target="_blank" style="text-decoration: underline;" href="/templates/问候短信发送范围模板.xlsx">问候短信发送范围模板.xlsx</a>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item style="margin-left:140px" class="stepFormText">
                <a-upload
                  listType="picture-card"
                  :fileList="fileList"
                  @change="handleImport"
                  :showUploadList="{showPreviewIcon:false,showRemoveIcon:showRemove,showDownloadIcon:true}"
                  @download="handleDownload"
                  accept=".xls,.xlsx"
                  :remove="removeFile"
                  :beforeUpload="beforeUpload"
                  :disabled="!showBtn"
                >
                  <div v-if="fileList.length == 0" style="display: inline-block;">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
              </a-form-item>
              <a-form-item><a-input type="hidden" v-decorator="['fileName']" /></a-form-item>
            </a-col>
          </template>

        </a-row>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,httpActionHeader } from '@/api/manage'
  import { handleImportData } from '@/utils/common'
  import XLSX from 'xlsx'
  import pick from 'lodash.pick'
  import { hasPermissionToPage } from '@/store/modules/permission'

  export default {
    name: 'GreetingMessageModal',
    props: {
      title:{
        type: String,
        default: '操作',
        required: false
      },
      showBtn:{
        type: Boolean,
        default: true,
        required: false
      },
      industryBelongOptions:{
        type: Array,
        default: ()=>[],
        required: true
      },
    },
    data() {
      return {
        model: {},
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        fileList:[],
        fileData:[],
        isUpload: true,
        url: {
          modifyUrl:'/hrBase/tsmsinfo',
          exportXlsUrl: '', // 导出地址
        },
        showType:true,
        showRemove:true,
        isRemoveFile:false,
        operateFile:false,
      }
    },
    methods: {
      show(record){
        this.model = record
        this.visible = true
        this.showType = this.model.sendObject === '0' ? true : false
        this.showRemove = hasPermissionToPage('wxhr:tsmsfile_del',this.$route)
        this.$nextTick(() => {
          this.setDefaultValue(this.model.sendObject)
          this.form.setFieldsValue(pick({id:record.id,sendObject:record.sendObject}, 'id','sendObject'))
        })
      },
      setDefaultValue(type){
        if(type === '0'){
          const industryBelong = this.model.industryBelong ? this.model.industryBelong.split(',') : []
          this.form.setFieldsValue(pick({industryBelong:industryBelong},'industryBelong'))
        }else{
          if(this.model.fileName){
            this.fileList = [{uid:this.model.id,name:this.model.fileName,status:'done'}]
            this.form.setFieldsValue(pick({fileName:this.model.fileName},'fileName'))
          }
        }
      },
      changeSelect(val){
        this.model.industryBelong = val
      },
      changeRadios(e){
        this.showType = e.target.value === '0' ? true : false
        const arr = (this.model.industryBelong instanceof Array) ? this.model.industryBelong : (this.model.industryBelong ? this.model.industryBelong.split(',') : [])
        if(e.target.value === '0'){
          this.showType = true
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({industryBelong:arr},'industryBelong'))
          })
        }else{
          this.showType = false
        }
      },
      // 最终上传附件
      handleFile(){
        const _this = this
        return new Promise((resolve, reject) => {
          const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
          //开始异步提交
          httpActionHeader(`/hrBase/tsmsfile/uploadSmsFile?fileName=${_this.model.fileName}`, _this.fileData, 'post', contextType, 600000).then((res) => {
            if(res.code === 200){
              resolve('上传成功！')
            }else{
              reject(res.msg)
            }
          })
        })
      },
      handleSave(params){
        const _this = this
        return new Promise((resolve, reject) => {
          httpAction(_this.url.modifyUrl, params, 'put').then((res) => {
            if(res.code === 200){
              resolve('修改成功！')
            }else{
              reject(res.msg)
            }
          })
        })
      },
      handleOk(){
        const _this = this
        this.form.validateFields((err, values) => {
          if (!err) {
            _this.confirmLoading = true
            let fun;
            if(values.sendObject === '0'){ // 绑定范围
              values.industryBelong = values.industryBelong.join(',')
              fun = _this.handleSave(values)
            }else{
              values.industryBelong = ''
              if(_this.fileList.length === 0){
                _this.$message.warning('附件必须上传！')
                _this.confirmLoading = false
                return false
              }
              if(_this.operateFile){
                fun = _this.handleFile()
              }else{
                fun = new Promise((resolve, reject) => { resolve('保存成功') })
              }
            }
            fun.then(function(res){
              _this.$message.success(res)
              _this.handleCancel()
              _this.$emit('ok')
            }).catch(function(err){
              _this.$message.warning(err)
            }).finally(function(){
              _this.confirmLoading = false
            })

          }
        })
      },
      handleDownload(file) {
        this.confirmLoading = true
        httpAction(`/hrBase/tsmsfile/getTSmsFileList?smsInfoId=${file.uid}`, null, 'get').then((res) => {
          if(res.code === 200){
            const tableDatas = res.data.map(item=>{
              return {
                unitCode:item.unitCode,
                unitName:item.unitName,
              }
            })
            // 封面数据
            const excelDatas = [{
              tHeader: ['单位编码','单位名称'],
              filterVal: ['unitCode','unitName'],
              tableDatas: tableDatas,
              sheetName: '单位信息'
            }]
            this.json2excel(excelDatas, file.name.substring(0, file.name.lastIndexOf(".")), true, "xlsx",true)
          }else{
            this.$message.warning(res.msg)
          }
        }).finally(()=>{
          this.confirmLoading = false
        })
      },
      removeFile(file) {
        this.fileList = []
        this.fileData = []
        this.form.setFieldsValue(pick({fileName:''},'fileName'))
        if(!file.type){
          // 已经上传后删除
          this.isRemoveFile = true
        }
      },
      beforeUpload() {
        return false
      },
      handleImport(file) {
        this.operateFile = true
        if(file.fileList.length) {
          this.uploadFilesChange(file.file)
        }
      },
      uploadFilesChange(file) {
        const _this = this
        // 通过FileReader对象读取文件
        const fileReader = new FileReader()
        fileReader.onload = event => {
          try {
            const { result } = event.target
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary' })
            // 存储获取到的数据
            const data = {}
            let sheetName = ''
            // 遍历获取每张工作表 除去隐藏表
            const allSheets = workbook.Workbook.Sheets
            for (const index in allSheets) {
              const name = allSheets[index].name
              if (workbook.Sheets.hasOwnProperty(name) && allSheets[index].Hidden === 0) {
                sheetName = name
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name],{defval:'',blankrows:true}))
                break
              }
            }
            // 去除每个字段的前后空格以及最后的空格行
            const newData = handleImportData(data[sheetName])
            const params = newData.map(item=>{
              return {
                smsInfoId: _this.model.id,
                unitCode: item['单位编码'],
                unitName: item['单位名称']
              }
            })
            _this.model.fileName = file.name
            _this.fileData = params
            _this.fileList = [file]
            _this.form.setFieldsValue(pick({fileName:_this.model.fileName},'fileName'))
            _this.isRemoveFile = false
          } catch (e) {
            // 这里可以抛出文件类型错误不正确的相关提示
            this.$message.error('文件上传错误！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file)
      },
      // 表单关闭
      handleCancel() {
        this.visible = false
        this.close()
      },
      // 数据重置
      close() {
        this.confirmLoading = false
        this.isRemoveFile = false
        this.operateFile = false
        this.fileList = []
        this.fileData = []
      },
      json2excel(tableJson, filenames, autowidth, bookTypes,typeLength) {
        var that = this
        import('@/vendor/ExportCommonExcel').then(excel => {
          var tHeader = []
          var dataArr = []
          var sheetnames = []
          for (var i in tableJson) {
            tHeader.push(tableJson[i].tHeader)
            dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
            sheetnames.push(tableJson[i].sheetName)
          }
          excel.export_json_to_excel_more_sheet({
            header: tHeader,
            data: dataArr,
            sheetname: sheetnames,
            filename: filenames,
            bookType: bookTypes,
            autoLength: typeLength, // 所有类型长度
          })
          that.confirmLoading = false
        }).finally(()=>{
          this.$message.success('下载成功！')
        })
      },
      formatJson(filterVal, jsonData) {
        const res = jsonData.map(v => filterVal.map(j => {
          return v[j] || ''
        }))
        return res
      },
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 130px;
    margin-right: 10px;
  }
}
</style>
