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
            <a-form-item label="姓名">
              <a-input
                allowClear
                placeholder="请输入姓名"
                v-model="queryParam.empName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="身份证号">
              <a-input
                allowClear
                placeholder="请输入身份证号"
                v-model="queryParam.empIdcard"
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- 批量导入 -->
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleCommit(url.importUrl,1)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量导入合同信息
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downTemplate('/templates/电子合同导入或更新模板.xls')">
            <a-icon type="download" />批量导入模板
          </a-menu-item>
        </a-menu>
        <a-button>批量导入合同信息
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- 批量更新 -->
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleCommit(url.updateUrl,2)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量更新合同信息
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downTemplate('/templates/电子合同导入或更新模板.xls')">
            <a-icon type="download" />批量更新模板
          </a-menu-item>
        </a-menu>
        <a-button>批量更新合同信息
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{x: 1}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template
          slot="operation"
          slot-scope="text, record, index"
        >
          <span>
            <a v-if="record.fddContractId ==null" @click="interfaceHandle(record,1)">发送合同<a-divider type="vertical"/></a>
            <a v-if="record.draftId !=null && record.signTaskId == null" @click="interfaceHandle(record,2)">发送签署<a-divider type="vertical"/></a>
            <a v-if="Number(record.receiveSignStatus) === 2 && Number(record.sendSignStatus) === 1" @click="handleSealEvent(record)">盖章<a-divider type="vertical"/></a>
            <a v-if="Number(record.sendSignStatus) !== 2 && record.taskId != null" @click="interfaceHandle(record,3)">作废重签<a-divider type="vertical"/></a>
            <a-dropdown v-if="record.signTaskId">
              <a class="ant-dropdown-link">更多<a-icon type="down"/></a>
              <a-menu slot="overlay">
                <a-menu-item v-if="record.signTaskId">
                  <a @click="interfaceHandle(record,4)">签署文件预览</a>
                </a-menu-item>
                <a-menu-item v-if="record.signTaskId">
                  <a @click="handleSignDownLoad(record)">签署文件下载</a>
                </a-menu-item>
                <a-menu-item v-if="record.isMove == 0 && record.signTaskId">
                  <a @click="handleTransfer(record,index)">转移附件到合同</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
        </template>
      </a-table>
    </div>
    <error-modal
      ref="errorModal"
      @ok="modalFormOk"
    ></error-modal>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction,httpActionHeader,downFilePost } from '@/api/manage'
import ErrorModal from '../global/modules/ErrorModal'
import XLSX from 'xlsx'

export default {
  name: 'ElectronicContractList',
  mixins: [JeecgListMixin],
  components:{
    ErrorModal
  },
  data() {
    return {
      description: '法大大-电子合同',
      signStatusOptions: {
        '1': { option: '未签署', color: 'blue' },
        '2': { option: '已签署', color: 'green' },
        '4': { option: '已撤销', color: 'orange' },
        '5': { option: '已拒签', color: 'red' }
      }, // 签署状态
      sendReceOptions: {
        '1': { option: '未签署', color: 'blue' },
        '2': { option: '已签署', color: 'green' },
        '3': { option: '已拒签', color: 'red' },
        '4': { option: '已撤销', color: 'orange' }
      }, // 签署状态发送和接收
      columns: [
        {
          width: 160,
          ellipsis: true,
          title: '姓名',
          align: 'center',
          dataIndex: 'empName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '身份证号',
          align: 'center',
          dataIndex: 'empIdcard',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '合同起始日期',
          align: 'center',
          dataIndex: 'contractStart',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '合同截止日期',
          align: 'center',
          dataIndex: 'contractEnd',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '合同试用期开始时间',
          align: 'center',
          dataIndex: 'periodStart',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '合同试用期结束时间',
          align: 'center',
          dataIndex: 'periodEnd',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '试用期工资',
          align: 'center',
          dataIndex: 'periodSalaryPerMonth',
          customRender: text => {
            const resultText = text || (String(text) === '0'?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '工资形式',
          align: 'center',
          dataIndex: 'salaryType',
          customRender: text => {
            const options = {'1':'计时工资','2':'计件工资','3':'其他'}
            const resultText = options[String(text)] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '计时工资',
          align: 'center',
          dataIndex: 'salaryStandardPerHour',
          customRender: text => {
            const resultText = text || (String(text) === '0'?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '计件工资',
          align: 'center',
          dataIndex: 'salaryStandardPerPiece',
          customRender: text => {
            const resultText = text || (String(text) === '0'?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '工作地点',
          align: 'center',
          dataIndex: 'workSpace',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 130,
          ellipsis: true,
          title: '定稿任务发送状态',
          align: 'center',
          dataIndex: 'taskId',
          customRender: text => {
            return (text == null) ? '未发送' : '已发送'
          }
        },
        {
          width: 130,
          ellipsis: true,
          title: '签署任务发送状态',
          align: 'center',
          dataIndex: 'signTaskId',
          customRender: text => {
            return (text == null) ? '未发送' : '已发送'
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '签署状态',
          align: 'center',
          dataIndex: 'signStatus',
          customRender: text => {
            const optionItem = this.signStatusOptions[String(text)]
            if (optionItem) {
              return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
            }
            return '-'
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '签署发送方状态',
          align: 'center',
          dataIndex: 'sendSignStatus',
          customRender: text => {
            const optionItem = this.sendReceOptions[String(text)]
            if (optionItem) {
              return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
            }
            return '-'
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '签署接收方状态',
          align: 'center',
          dataIndex: 'receiveSignStatus',
          customRender: text => {
            const optionItem = this.sendReceOptions[String(text)]
            if (optionItem) {
              return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
            }
            return '-'
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '定稿状态',
          align: 'center',
          dataIndex: 'taskStatus',
          customRender: text => {
            const options = { '1': '未定稿', '2': '已定稿' }
            const resultText = options[String(text)] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '定稿备注',
          align: 'center',
          dataIndex: 'remark',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '签署备注',
          align: 'center',
          dataIndex: 'signRemark',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '创建用户',
          align: 'center',
          dataIndex: 'createUser',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 170,
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
          width: 250,
          title: '操作',
          align: 'center',
          fixed: 'right',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      url: {
        list: '/hrBase/fddcontractattachinfo/page', // 列表数据
        sendUrl:'/hrBase/fddcontractinfo/send', // 发送合同
        draftUrl:'/hrBase/fddcontractinfo/createTaskByDraftId', // 发送签署
        sealUrl:'/hrBase/fddcontractinfo/getSignUrl', // 盖章
        importUrl:'/hrBase/fddcontractattachinfo/batchAddFddEmpInfo', // 批量导入
        updateUrl:'/hrBase/fddcontractattachinfo/batchUpdateFddEmpInfo', // 批量更新
        resignUrl:'/hrBase/fddcontractinfo/invalidAndsend', // 作废重签
        signPreviewUrl:'/hrBase/fddcontractinfo/getSignPreviewUrl', // 签署预览
        signDownloadUrl:'/hrBase/fddcontractinfo/getBySignFileId', // 签署文件下载
      }
    }
  },
  methods: {
    handleTransfer(record,index){
      httpAction(`/hrBase/fddcontractinfo/moveFileToEmpConcat?id=${record.fddContractId}`,null,'post').then(res=>{
        if(res.code === 200){
          this.$message.success(res.msg)
          this.$set(this.dataSource[index],`isMove`,1)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    // 列表操作列按钮点击事件
    interfaceHandle(record,type){
      let requestUrl = ''
      let typeStr = ''
      switch (type){
        case 1:{ // 发送合同
          typeStr = '发送合同'
          requestUrl = `${this.url.sendUrl}?id=${record.id}`
        }break;
        case 2:{ //
          typeStr = '发送签署'
          requestUrl = `${this.url.draftUrl}?id=${record.fddContractId}`
        }break;
        case 3:{ // 作废重签
          typeStr = '作废重签'
          requestUrl = `${this.url.resignUrl}?id=${record.fddContractId}`
        }break;
        case 4:{ // 签署文件预览
          typeStr = '签署文件预览'
          requestUrl = `${this.url.signPreviewUrl}?id=${record.fddContractId}`
        }break;
      }
      httpAction(requestUrl, '', 'POST').then(res => {
        if (Number(res.code) === 200) {
          if(type === 4){ // 签署文件预览
            window.open(res.data)
          }else {
            this.$message.success(`${typeStr}操作成功！`)
            this.loadData()
          }
        } else {
          this.$message.error(res.msg || '接口请求出错！')
        }
      })
    },
    // 盖章
    handleSealEvent(record){
      const requestUrl = `${this.url.sealUrl}?id=${record.fddContractId}`
      httpAction(requestUrl, '', 'POST').then(res => {
        if (Number(res.code) === 200) {
          let signUrl = ''
          const companyList = res.data.company || []
          if(companyList && companyList.length){
            signUrl = companyList[0].signUrl
          }
          if(signUrl){
            window.open(signUrl)
          }else{
            this.$message.warning('文件地址有误！')
          }
        } else {
          this.$message.error(res.msg || '接口请求出错！')
        }
      })
    },
    // 签署文件下载
    handleSignDownLoad(record){
      const that = this
      const requestUrl = `${that.url.signDownloadUrl}?id=${record.fddContractId}`
      downFilePost(requestUrl, null).then((res) => {
        const data = res
        const fileReader = new FileReader()
        fileReader.onload = function() {
          try {
            const jsonData = JSON.parse(this.result)
            let msg = '下载失败'
            if (jsonData.msg) {
            // 说明是普通对象数据，后台转换失败
              msg += `,${jsonData.msg}`
            }
            that.$message.warning(msg)
            return
          } catch (err) {
            // 解析成对象失败，说明是正常的文件流
            const blob = new Blob([res], {type: 'application/zip'})
            const downloadElement = document.createElement('a')
            const href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.href = href
            downloadElement.download = '签署文件.zip' // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
          }
        }
        fileReader.readAsText(data)
      })
    },
    // 模板下载
    downTemplate(templateUrl) {
      const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port + templateUrl}`
      window.location.href = url
    },
    // 批量导入，更新
    handleCommit(requestUrl, type) {
      var that = this
      const { fileList } = this
      if (!fileList.length) {
        return
      }
      // 通过FileReader对象读取文件
      const fileReader = new FileReader()
      fileReader.onload = event => {
        try {
          that.loading = true
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
          // 去除每个字段的前后空格以及最后的空格行
          const newData = that.handleEmptyRow(data[sheetName])
          const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
          const title = type === 1?'批量导入':'批量更新'
          //开始异步提交
          httpActionHeader(requestUrl, encodeURI(JSON.stringify(newData)), 'POST', contextType, 600000).then(res => {
            const msg = res.message || res.msg
            if (res.errorMessageList !== null && res.errorMessageList.length) {
              that.loading = false
              that.$refs.errorModal.title = `${title}提示: ${msg}`
              that.$refs.errorModal.message = msg
              that.$refs.errorModal.showModal(res.errorMessageList)
              that.fileList = []
            } else {
              that.loading = false
              if (Number(res.code) === 200) {
                that.$message.success(`${title}成功！`)
              }else {
                that.$message.warn(res.msg || `${title}出错！`)
              }
              that.fileList = []
            }
          })
        } catch (e) {
          that.loading = false
          // 这里可以抛出文件类型错误不正确的相关提示
          that.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(fileList[0])
    },
    // 处理文件空行问题
    handleEmptyRow(newData) {
      // 去除最后的空格行
      for (let i = newData.length - 1; i >= 0; i--) {
        // 判断数组是否全为空
        const flag = Object.values(newData[i]).find(item => {
          return String(item).replace(/^\s*|\s*$/g,"").length
        })
        if (!flag) {
          newData.splice(i, 1)
        } else {
          break
        }
      }
      return newData
    },
  }
}
</script>
<style lang="less" scoped>
.ant-card-body .table-operator {
  margin-bottom: 18px;
  button {
    margin-right: 10px;
  }
}
</style>
