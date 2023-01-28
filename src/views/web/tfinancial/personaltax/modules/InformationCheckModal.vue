<template>
  <a-modal
    title="身份证实名验证"
    :width="600"
    placement="right"
    :footer="null"
    cancelText="关闭"
    okText="开始导入"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :closable="active!=2?true:false"
  >
    <a-card
      :bordered="false"
      style="height:360px"
    >
      <a-row v-if="active==1">
        <a-col :span="6">表单上传：</a-col>
        <a-col :span="18">
          <a-upload
            name="file"
            :beforeUpload="beforeUploadExcel"
            :multiple="false"
            :fileList="fileList"
            @change="handleChange"
            :remove="handleRemove"
            :preview="handleDown"
            accept=".xls,.xlsx"
          >
            <div class="upload_btn upload_btn1" v-if="excelLoading" v-cloak>
              <a-icon type="loading" style="fontSize:28px;color:#1890ff"/>
              <div class="ant-upload-text">上传中...</div>
            </div>
            <div class="upload_btn" v-else v-cloak>
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-col>
        <a-col :span="24">
          <p style="color:#999999;margin-top:20px">说明：导入表头中必须包含"姓名"、"证件号码"两列</p>
        </a-col>
        <a-col :span="24">
          <div class="check_btns">
            <a-button type="primary" @click="handleCheck" :disabled="fileList.length==0">开始核验</a-button>
            <a-button style="margin-left:20px" @click="handleCancel">取消</a-button>
          </div>
        </a-col>
      </a-row>
      <a-row v-else-if="active==2" class="check_spin">
        <P>检验中，请耐心等待！</P>
        <a-spin>
          <a-icon slot="indicator" type="loading" style="font-size: 60px;color:#1890ff" spin />
        </a-spin>
      </a-row>
      <a-row v-else-if="active==3" >
        <div v-if="downLoading" class="check_spin">
          <p>检验完成，反馈结果下载中...</p>
          <a-icon type="loading" style="fontSize:60px;color:#1890ff"/>
        </div>
        <div v-else class="check_spin">
          <P>检验完成，已为您下载反馈结果！</P>
          <a href="#" style="text-decoration:underline" @click="handleCheckRes"> {{ checkResname }}.xlsx </a>
        </div>
      </a-row>
    </a-card>
      
    
  </a-modal>
</template>
<script>

import XLSX from 'xlsx'

import { httpActionHeader } from '@/api/manage'
import { handleImportData,handleImportFail} from '@/utils/common'


export default {
  name: 'NoPersonExport',
  components: {
    

  },
  data () {
    return {
      visible: false,
      downLoading: false,
      excelLoading:false,
      form: this.$form.createForm(this),
      fileList:[],
      sheetData:[],
      active:1,
      checkResname:'身份证实名验证结果反馈',//结果表单名称
      failData:[],
      oldData:[],
      url:{
        doImport: '/checks/tcheckidcard/checkIdCard' ,//校验
      },

      
    }
  },
  methods:{
    add() {
      this.visible = true
      this.fileList = []
    },
    handleDown(file){
      console.log(file);
      return false
    },
    // 文件前
    beforeUploadExcel(file){
      if(this.fileList.length > 0){
        this.fileList.splice(0, 1);
        this.fileList = [...this.fileList, file];
      }else{
        this.fileList = [...this.fileList,file];
      }
      this.excelLoading = true
      return false
    },
    // 选择文件
    handleChange() {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('files[]', file)
      })
      this.uploadFilesChange(fileList[0])
    },

    // 获取导入数据
    uploadFilesChange(file) {
      var that = this
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
          if(!Object.keys(data[sheetName][0]).includes('姓名')||!Object.keys(data[sheetName][0]).includes('证件号码')){
            this.$message.error('导入表头中必须包含姓名和证件号码两列！')
            this.fileList = []
            that.excelLoading = false
            return false
          }
          
          // 获取原表单数据
          this.oldData = handleImportFail(data[sheetName])
         
          // 去除每个字段的前后空格以及最后的空格行
          const newData = handleImportData(data[sheetName])
          this.sheetData = []
          for(const c of newData){
            this.sheetData.push({
            'name':c['姓名'],'idCard':c['证件号码']
            })
          }
          that.excelLoading = false  
        } catch (e) {
          console.log(e);
          that.excelLoading = false
          // 这里可以抛出文件类型错误不正确的相关提示
          this.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
      
    },
    // 删除文件
    handleRemove(){
      this.sheetData = []
      this.fileList.splice(0, 1);
    },
    
    // 数据导入,开始校验
    handleCheck(){
      if(this.fileList.length>0&&this.sheetData.length>0){
        this.active = 2
        let contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
        const url = this.url.doImport
        const timeout = 1000*60*10
        httpActionHeader(url, JSON.stringify(this.sheetData), 'post', contextType,timeout).then((res) => {
          if(Number(res.code) === 200){
            this.active = 3
            this.downLoading = true
            this.failData = res.data
            this.checkResult(res.data)
          }else{
            this.$message.error(res.msg)
          }
        })
      }else{
        this.$message.warning('请上传姓名身份证表格！')
      }
    },
    // 下载反馈结果
    handleCheckRes(){
      this.downLoading = true
      this.checkResult(this.failData)
    },

    // 反馈结果
    checkResult(data){
        //头部数据
        let hArr = []
        for(const fail in this.oldData[0]){
          hArr.push(fail)
        }
        // 内容数据
        let cArr = []
          this.oldData.map((item,i)=>{
          data[i].isTrue = data[i].isTrue?'一致':'不一致';
          data[i].reason = data[i].isTrue=='不一致'?data[i].reason:'';
          cArr.push({...this.oldData[i],...data[i]})
        })
        const header =   ['是否一致','原因',...hArr]
        const value = ['isTrue','reason',...hArr]
        const excelDatas = [{
          tHeader: header, // 表一的数据字段
          filterVal: value, // sheet表一头部
          tableDatas: cArr, // 表一的整体json数据
          sheetName: "导入反馈"// 表一的sheet名字
        }]
        this.json2excel(excelDatas, this.checkResname, true, "xlsx")
        
      },

      json2excel(tableJson, filenames, autowidth, bookTypes){
        const that = this
        //这个是引用插件
        import("@/vendor/ExportCommonExcel").then(excel => {
          var tHeader = []
          var dataArr = []
          var sheetnames = []
          for (const i in tableJson) {
            tHeader.push(tableJson[i].tHeader)
            dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
            sheetnames.push(tableJson[i].sheetName)
          }
          excel.export_json_to_excel_more_sheet({
            header: tHeader,
            data: dataArr,
            sheetname: sheetnames,
            filename: filenames,
            autoWidth: autowidth,
            bookType: bookTypes
          })
          // that.downLoading = false
        }).finally(()=>{
          that.downLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
    
    handleCancel() {
      this.close()
      this.$emit('ok')
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.excelLoading = false
      this.form.resetFields()
      this.active = 1
    },
    
    
  }
}
</script>
<style lang="less"  scoped>

.upload_btn{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 104px;
  height: 104px;
  margin-right: 8px;
  margin-bottom: 8px;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  -webkit-transition: border-color 0.3s ease;
  transition: border-color 0.3s ease;
}
.upload_btn:hover {
    border-color: #1890ff;
}
.upload_btn1{
  border: 1px dashed #1890ff;
  
}
.check_btns{
  display: flex;
  justify-content: center;
  margin-top: 60px;
}
.check_spin{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 60px;
}
.check_spin p{
  font-size: 16px;
  font-weight: 600;
  color:#333333;
  margin-bottom: 40px;
}

[v-cloak] {
  display: none;
}
</style>
