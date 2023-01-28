<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button
        type="primary"
        @click="downTemplate('/templates/开票申请商品类目清单模板.xlsx')"
      >模板下载</a-button>
      <a-button
        type="primary"
        @click="handleOk()"
      >开始导入</a-button>
    </template>
    <a-spin
      :spinning="confirmLoading"
      tip="数据加载中..."
    >
      <a-upload-dragger
        name="file"
        :fileList="fileList"
        :beforeUpload="beforeUploadExcel"
        :remove="handleRemove"
        @change="handleChange"
        accept=".xls,.xlsx"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">点击或者拖拽上传</p>
      </a-upload-dragger>
    </a-spin>
  </a-modal>
</template>
<script>
import XLSX from 'xlsx'
import { handleImportData } from '@/utils/common'
export default {
  data() {
    return {
      title: '操作',
      visible: false,
      confirmLoading: false,
      isUpload: false,
      fileList: [], // 文件上传列表
      dataSourceList: [] // 导入的清单数据组装
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    // 关闭
    handleCancel() {
      this.visible = false
      this.isUpload = false
      this.fileList = [] // 文件上传列表
      this.dataSourceList = [] // 导入的清单数据组装
    },
    // 下载本地模板
    downTemplate(templateUrl) {
      const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
      window.location.href = url
    },
    // 上传附件前
    beforeUploadExcel(file) {
      if (this.fileList.length > 0) {
        this.fileList.splice(0, 1)
        this.fileList = [...this.fileList, file]
      } else {
        this.fileList = [...this.fileList, file]
      }
      return false
    },
    // 上传
    handleChange() {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('files[]', file)
      })
      this.uploadFilesChange(fileList[0])
    },
    // 获取导入数据
    uploadFilesChange(file) {
      this.confirmLoading = true
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
          // 只取第一个清单list
          const listSheet = allSheets && allSheets[0]
          const name = listSheet.name
          if (workbook.Sheets.hasOwnProperty(name) && listSheet.Hidden === 0) {
            sheetName = name
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name], { defval: '', blankrows: false }))
          }
          // 去除空格 去除最后的空格行
          const newData = handleImportData(data[sheetName])
          // 判断是否存在数据
          if (newData.length <= 0) {
            this.confirmLoading = false
            this.fileList = []
            this.isUpload = false
            this.$message.error('请勿导入没有数据的excel！')
            return
          }
          // 判断选取的文件是否符合模板
          const project = newData && newData[0]
          const excelFields = ['商品大类', '货物或应税劳务、服务名称', '金额', '税率']
          let pass = true
          excelFields.some(function(key) {
            if (!project.hasOwnProperty(key)) {
              pass = false
              return true
            }
          })
          if (pass) {
            this.dataPackage(newData)
          } else {
            this.confirmLoading = false
            this.fileList = []
            this.isUpload = false
            this.$message.error('所导入的excel不属于该模板，请重新导入！')
          }
        } catch (e) {
          this.confirmLoading = false
          this.fileList = []
          this.isUpload = false
          // 这里可以抛出文件类型错误不正确的相关提示
          this.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
    },

    dataPackage(dataList) {
      const dataSourceList = []
      // 数据组装
      dataList.map((data, index) => {
        // 计算税额 = （金额（含税）- 扣除额） / (1+税率）* 税率
        const money = parseFloat(data['金额']) || 0
        const taxRate = parseFloat(data['税率']) || 0
        const resultText = money * taxRate
        const productData = {
          id: index,
          goodsName: data['商品大类'], // 商品分类汇总名称
          cropGoodsNo: data['税收分类编码'], // 企业自编码，可传人税收分类编码
          discountAmountItems: '0', // 折扣金额
          discountVatItems: '0', // 折扣税额
          goodsNoVer: data['税收分类编码版本号'], // 编码表版本号
          goodsTaxNo: data['税收分类编码'], //商品明细(invoiceItems)：企业自编码，可传人税收分类编码
          includeTax: String(data.taxMark) === 'False' ? 0 : 1, // 1含税金额和单价；0不含税金额和单价(默认)
          money: '0', // 含税金额（选择data.money 导入0）
          price: data['单价'] || 0, // 单价
          prodectNum: data['数量'], // 商品数量，如果有商品数量、单价和计量单位不能为空
          productName: data['货物或应税劳务、服务名称'], // 商品名称
          productSpec: data['规格型号'], // 商品规格
          productUnit: data['计量单位'], // 商品单位
          taxMoney: resultText, // 税额
          taxDeduction: '0', // 扣除额(单条有)
          taxPre: data['使用优惠政策标识'], // 是否享受税收优惠政策0：不享受，1：享受
          taxPreCon: data['优惠政策说明'], // 享受税收优惠政策内容，如果享受优惠政策必填
          taxRate: data['税率'], // 税率
          value: data['金额'], // 金额(不含税)选择0 导入清单的金额）
          zeroTax: data['零税率标识'] // 零税率标识空：非零税率，0：出口退税，1：免税，2：不征收，3 普通零税率
        }
        dataSourceList.push(productData)
        this.dataSourceList = dataSourceList
        this.isUpload = true
      })
      this.confirmLoading = false
    },

    // 删除上传的附件
    handleRemove() {
      const that = this
      this.$confirm({
        title: '删除',
        content: '确定删除该附件？',
        okText: '确认',
        cancelText: '取消',
        onOk: function() {
          //删除该附件
          that.fileList.splice(0, 1)
        }
      })
    },
    // 提交保存
    handleOk() {
      if (this.isUpload) {
        this.$emit('ok', this.dataSourceList)
        this.handleCancel()
      } else {
        this.$message.error('请先选择导入清单！')
      }
    }
  }
}
</script>
