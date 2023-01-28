<template>
  <a-upload-dragger
    name="file"
    :multiple="true"
    :beforeUpload="beforeUploadExcel"
    accept=".xls,.xlsx"
    @change="handleImportSalaryExcel"
  >
    <p class="ant-upload-drag-icon">
      <a-icon type="inbox" />
    </p>
    <p class="ant-upload-text">Click or drag file to this area to upload</p>
    <p class="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibit from uploading company data or other
      band files
    </p>
  </a-upload-dragger>
</template>
<script>
import XLSX from 'xlsx'
import { parsingExcel2Json } from '@/utils/excel'

export default {
  name: 'TestImport',
  data() {
    return {
      fileList: [],
      excelOptionsData: [],
      sheetData:[], // sheet数据
      model: {},
      excelSheetName: '',
      data: {},
    };
  },
  methods: {
    handleChange(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUploadExcel(file) {
      this.fileList = []
      this.fileList = [...this.fileList, file]
      return false
    },
    handleImportSalaryExcel() {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('files[]', file)
      })
      this.uploadFilesChange(fileList[0])
    },
    uploadFilesChange(file) {
      // 通过FileReader对象读取文件
      const fileReader = new FileReader()
      fileReader.onload = event => {
        try {
          const { result } = event.target
          // 以二进制流方式读取得到整份excel表格对象
          const workbook = XLSX.read(result, { type: 'binary' })
          // 存储获取到的数据
          //let data = {}
          const arr = []
          // 遍历每张工作表进行读取（这里默认只读取第一张表）
          for (const sheet in workbook.Sheets) {
            arr.push(sheet)
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              // 利用 sheet_to_json 方法将 excel 转成 json 数据
              this.data = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
              break;
            }
          }
          parsingExcel2Json(this.data);
          /*if(this.data.length > 0) {
            for(let i = 0; i < this.data.length; i++) {
              console.log(this.data[i].length)
            }
          }*/
          this.excelOptionsData = workbook.Sheets
          this.sheetData = arr
          this.confirmLoading = false
          // let arr = []
          // for(const sheet in data){
          //   arr.push(sheet)
          // }
          this.model.excelSheetName = arr[0]
          this.excelSheetName = arr[0]
        } catch (e) {
          console.log(e);
          // 这里可以抛出文件类型错误不正确的相关提示
          this.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
    },
  },
};
</script>