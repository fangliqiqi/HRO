<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="退保编码">
              <a-input
                placeholder="请输入退保编码"
                v-model="queryParam.refundNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="保单号">
              <a-input
                placeholder="请输入保单号"
                v-model="queryParam.policyNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <span
              style="float: left;overflow: hidden;"
              class="table-page-search-submitButtons"
            >
              <a-button
                type="primary"
                @click="searchQuery"
                icon="search"
              >查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator" style="margin-bottom:15px;">
      <a-dropdown v-has="'wxhr:insurance_refund_update'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.importExcelBatchUrl,'put')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />批量更新退保保费
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/批量更新退保保费模板.xls')">
            <a-icon type="download" />模板下载</a-menu-item>
        </a-menu>
        <a-button style="margin-right: 8px">批量更新退保保费
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-button
        type="primary"
        icon="download"
        @click="exportBtnClick"
        :loading="exportLoading"
      >导出</a-button>
    </div>
    <!-- table区域-begin -->
    <div>
      <div
        class="ant-alert ant-alert-info"
        style="margin-bottom: 16px;"
      >
        已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> 项
        <a
          style="margin-left: 24px"
          @click="onClearSelected"
        >清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        :scroll="{ x: 1}"
      >
        <span
          slot="status"
          slot-scope="text"
        >
          <a-tag :color="color[text]">{{ statusOptions[text] }}</a-tag>
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical"/>
          <a @click="handleAttach(record)">查看附件</a>
        </span>
      </a-table>
      <a-modal :visible="visible" title="附件" @ok="handleOk" @cancel="handleCancel" :destroyOnClose="true">
        <a-upload
          :defaultFileList="fileAttach"
          listType="picture"
          :showUploadList="{showRemoveIcon:false}"
        >
        </a-upload>
      </a-modal>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <back-list-modal ref="BackListModalForm" @ok="modalFormOk"></back-list-modal>
    <error-modal ref="errorModal" @ok="modalFormOk"></error-modal>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ErrorModal from '../global/modules/ErrorModal'
  import BackListModal from './modules/BackListModal' //派单申请详情
  import { httpAction,httpActionHeader } from '@/api/manage'
  import XLSX from 'xlsx'
  import { handleImportData } from '@/utils/common'

  export default {
    name: 'InsuranceBackList',
    mixins: [JeecgListMixin],
    components: {
      BackListModal,
      ErrorModal
    },
    data() {
      return {
        description: '商险派单查询',
        statusOptions: ['待提交','待审核','审核通过','审核不通过'], //状态
        color:['orange','#e08d33','green','red'],
        importUrl: '', //导入地址
        importMethod: '', //导入方法
        fileList: [],
        exportLoading:false,//导出
        // 表头
        columns: [
          {
            width: 150,
            ellipsis: true,
            title: '退保编码',
            align: 'center',
            dataIndex: 'refundNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 200,
            ellipsis: true,
            title: '保单号',
            align: 'center',
            dataIndex: 'policyNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:160,
            ellipsis: true,
            title: '保险公司',
            align: 'center',
            dataIndex: 'insuranceCompanyName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:180,
            ellipsis: true,
            title: '险种',
            align: 'center',
            dataIndex: 'insuranceTypeName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:150,
            ellipsis: true,
            title: '保单生效时间',
            align: 'center',
            dataIndex: 'policyEffect',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:150,
            ellipsis: true,
            title: '退保保费',
            align: 'center',
            dataIndex: 'refundMoney',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:130,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            width:80,
            ellipsis: true,
            title: '创建人',
            align: 'center',
            dataIndex: 'createUser',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:170,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:80,
            ellipsis: true,
            title: '审核人',
            align: 'center',
            dataIndex: 'auditUser',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:150,
            ellipsis: true,
            title: '审核时间',
            align: 'center',
            dataIndex: 'auditTime',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:150,
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed:'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/tinsurancerefund/page', //列表请求地址
          queryAllInfoById: '/busiInsurance/tinsurancerefund/', //详情,
          importExcelBatchUrl:'busiInsurance/tinsurancerefund/batchRefundNo',//批量更新退保保费
        },
        fileAttach:[],
        visible:false
      }
    },
    methods: {
      // 详情
      handleDetail: function(record) {
        httpAction(this.url.queryAllInfoById+record.id,null,'get').then(res=>{
          if(res.code === 200){
            res.data.insuranceCompanyName = record.insuranceCompanyName
            res.data.insuranceTypeName = record.insuranceTypeName
            this.$refs.BackListModalForm.show(res.data)
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      // 下载
      handleDownloadTemplate(templateUrl) {
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
        window.location.href = url
      },
      // 导入
      beforeUpload(file) {
        this.fileList = [file]
        return false
      },
     //单个文件上传
      handleImport(url, method) {
        this.importUrl = url
        this.importMethod = method
        const { fileList } = this
        const formData = new FormData()
        fileList.forEach(file => {
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
          const data = {}
          let sheetName = ''
          // 遍历获取每张工作表 除去隐藏表
          const allSheets = workbook.Workbook.Sheets
          for (const index in allSheets) {
            const name = allSheets[index].name
            if (workbook.Sheets.hasOwnProperty(name) && allSheets[index].Hidden === 0) {
              sheetName = name
              // 利用 sheet_to_json 方法将 excel 转成 json 数据
              data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name], { defval: '', blankrows: true }))
              break
            }
          }
          // 去除空格 最后的空格行
          const newData = handleImportData(data[sheetName])
          const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
          const requestTimeOut = 600000 // 请求过期时间
          httpActionHeader(
            this.importUrl,
            JSON.stringify(newData),
            this.importMethod,
            contextType,
            requestTimeOut
          ).then(res => {
            const msg = res.message || res.msg
            if (res.code === 200) {
              if (res.errorMessageList&&res.errorMessageList.length) {
                this.$refs.errorModal.title = `导入提示: ${msg}`
                this.$refs.errorModal.message = msg
                this.$refs.errorModal.showModal(res.errorMessageList)
                return false
              }
              this.$message.success('上传成功！')
              this.loadData()
            } else {
              if (res.data != null && res.data.length > 0) {
                this.$refs.errorModal.title = `导入提示: ${msg}`
                this.$refs.errorModal.message = msg
                this.$refs.errorModal.showModal(res.data)
              } else {
                this.$message.error(msg)
              }
            }
          })
        } catch (e) {
          // console.log(e)
          // 这里可以抛出文件类型错误不正确的相关提示
          this.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
    },
      handleAttach(record){
        httpAction(this.url.queryAllInfoById+record.id,null,'get').then(res=>{
          if(res.code === 200 && res.data){
            this.fileAttach = res.data.atta.map(item=>{
              return {
                uid:item.id,
                name:item.attaName,
                url:item.attaUrl,
                status: 'done',
              }
            })
            this.visible = true
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      handleOk(){
        this.visible = false
      },
      handleCancel(){
        this.visible = false
        this.fileAttach = []
      },
      // 导出
      exportBtnClick(){
        this.exportLoading = true
        const param = Object.assign({idStr:this.selectedRowKeys.join(',')},this.queryParam)
        const qs = require('qs')
        const params = qs.stringify(param)
        console.log(params);
        httpAction(`/busiInsurance/tinsurancerefund/exportInsuranceRefund?${params}`,null,'get').then(res=>{
          if(res.code === 200){
            const datas = res.data.map((item,index)=>{
              item.index = index+1
              item.businessInsuranceArea = item.businessInsuranceProv + '-' + item.businessInsuranceAddr
              return item
            })
            let excelDatas = [
              { 
                tHeader: ["序号","退保编码","办理人员","地市","申请提交时间","办理时间","商险派单时间","结算主体","退保人数","险种","保险公司","保单开始时间","保单结束时间","保单号","购买标准","退保保费"],
                filterVal: ['index','refundNo','auditUser',"businessInsuranceArea", "createTime","auditTime", "insuranceCreateTime","settlementOrganName","nums","name","companyName","policyStart","policyEnd","policyNo","buyStandard","refundMoney"],
                tableDatas: datas,
                sheetName: "退保记录"
              }
            ] 
            this.$message.success('导出成功!')
            this.json2excel(excelDatas, "退保记录", true, "xlsx",1)
          }
        }).finally(()=>{
          this.exportLoading = false
        })

      },
      json2excel(tableJson, filenames, autowidth, bookTypes,length){
        var that = this
        //这个是引用插件
        import("@/vendor/ExportSalaryPauseExcel").then(excel => {
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
            autoWidth: autowidth,
            bookType: bookTypes,
            length:length,
          })
        }).finally(()=>{
          this.downLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j] || ''
        }))
      },
    }
  }
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.ant-card-body .table-operator {
  margin-bottom: 18px;
}

</style>
