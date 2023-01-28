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
            <a-form-item label="单位">
              <select-page
                :id="'id'"
                :title="'customerName'"
                placeholder="请选择单位名称查询"
                v-model="queryParam.unitId"
                :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="部门">
              <select-page
                :id="'id'"
                :title="'departName'"
                placeholder="请选择部门查询"
                v-model="queryParam.departId"
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="缴纳月份">
              <j-month
                :format="'YYYYMM'"
                style="width: 100%"
                v-model="queryParam.payMonth"
                placeholder="请选择缴纳月份"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
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
              <a-form-item label="身份证">
                <a-input
                  allowClear
                  placeholder="请输入身份证"
                  v-model="queryParam.empIdcard"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="原因大类"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.reasonPrimaryType"
                  placeholder="请选择原因大类"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item,index) in reasonPrimaryTypeList"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="原因小类"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.reasonType"
                  placeholder="请选择原因小类"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item,index) in reasonTypeList"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="结算状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.clearingStatus"
                  placeholder="请选择结算状态"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option value="0">未结算</a-select-option>
                  <a-select-option value="1">已结算</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="生成月份"
                class="stepFormText"
              >
                <a-month-picker
                  placeholder="请选择生成月份"
                  style="width:100%"
                  v-model="queryParam.createMonth_extra"
                  format="YYYYMM"
                  @change="onChangeMonth"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="是否结算"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.settlementFlag"
                  placeholder="请选择是否结算"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option value="0">是</a-select-option>
                  <a-select-option value="1">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

          </template>
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
              <a
                @click="handleToggleSearch"
                style="margin-left: 8px"
              >
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        v-has="'wxhr:tpaymentDiff_doexport'"
        type="primary"
        icon="download"
        @click="batchExport"
      >批量导出</a-button>
      <a-dropdown v-has="'wxhr:tpaymentDiff_update'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.batchUpdateUrl,'post')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />批量更新
            </a-upload>
          </a-menu-item>
          <!-- <a-menu-item @click="handleDownloadTemplate('/templates/缴费差额更新模板.xls')">
            <a-icon type="download" />模板下载
          </a-menu-item> -->
        </a-menu>
        <a-button>批量更新
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-dropdown v-has="'wxhr:tpaymentDiff_import'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.batchImportUrl,'post')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />批量导入
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/缴费差额导入模板.xls')">
            <a-icon type="download" />模板下载
          </a-menu-item>
        </a-menu>
        <a-button>批量导入
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-button
        type="primary"
        icon="delete"
        @click="batchDelete"
        :disabled="selectedRowKeys.length>0?false:true"
      >批量删除</a-button>
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
        :scroll="{x: 1}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a-popconfirm
            v-has="'wxhr:tpaymentdiff_del'"
            title="确定删除吗?"
            @confirm="handledelete(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <error-modal
      ref="errorModal"
      @ok="errorModalFormOk"
    ></error-modal>
    <comparison-export-modal
      ref="comparisonExportModal"
      @ok="modalFormOk"
    ></comparison-export-modal>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JMonth from '@/components/jeecg/JMonth'
import SelectPage from '@/components/jeecg/SelectPage'
import { handleImportData } from '@/utils/common'
import XLSX from 'xlsx'
import { httpActionHeader,httpAction } from '@/api/manage'
import ErrorModal from '../../global/modules/ErrorModal'
import ComparisonExportModal from '../comparisonlibrary/modules/ComparisonExportModal'
import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'PaymentBalance',
  mixins: [JeecgListMixin],
  components:{
    JMonth,
    SelectPage,
    ErrorModal,
    ComparisonExportModal
  },
  data() {
    return {
      description: '缴费差额',
      exportFields:[
        '主键','员工姓名','员工身份证','单位','部门',
        '是否结算','缴纳月份','社保缴纳地','生成月份','结算状态',
        '单位社保','个人社保','公积金缴纳地','单位公积金','个人公积金',
        '管理费','其他费用','原因大类','原因小类','备注',
      ], // 导出的中文字段
      columns: [
        {
          width: 140,
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
          title: '身份证',
          align: 'center',
          dataIndex: 'empIdcard',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 220,
          ellipsis: true,
          title: '单位',
          align: 'center',
          dataIndex: 'unitName',
          customRender: (text) => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 220,
          ellipsis: true,
          title: '部门',
          align: 'center',
          dataIndex: 'departName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '缴纳月份',
          align: 'center',
          dataIndex: 'payMonth',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '社保缴纳地',
          align: 'center',
          dataIndex: 'socialSecurityAddr',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '单位社保',
          align: 'center',
          dataIndex: 'socialSecurityCompanySum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '个人社保',
          align: 'center',
          dataIndex: 'socialSecurityPersonalSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '公积金缴纳地',
          align: 'center',
          dataIndex: 'providentAddr',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '单位公积金',
          align: 'center',
          dataIndex: 'providentCompanyDiff',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '个人公积金',
          align: 'center',
          dataIndex: 'providentPersonalDiff',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '管理费',
          align: 'center',
          dataIndex: 'manageDiff',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '其他费用',
          align: 'center',
          dataIndex: 'otherDiff',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '原因大类',
          align: 'center',
          dataIndex: 'reasonPrimaryType',
          customRender: text => {
            const resultText = filterDictText(this.reasonPrimaryTypeList, text)
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '原因小类',
          align: 'center',
          dataIndex: 'reasonType',
          customRender: text => {
            const resultText = filterDictText(this.reasonTypeList, text)
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '合计',
          align: 'center',
          dataIndex: 'sumDiff',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 100,
          ellipsis: true,
          title: '是否结算',
          align: 'center',
          dataIndex: 'settlementFlag',
          customRender: text => {
            const options = {'0':'是','1':'否'}
            const resultText = options[String(text)] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 100,
          ellipsis: true,
          title: '结算状态',
          align: 'center',
          dataIndex: 'clearingStatus',
          customRender: text => {
            const options = {'0':'未结算','1':'已结算'}
            const resultText = options[String(text)] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 100,
          ellipsis: true,
          title: '生成月份',
          align: 'center',
          dataIndex: 'createMonth',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '备注',
          align: 'center',
          dataIndex: 'reasonRemark',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      reasonPrimaryTypeList:[],
      reasonTypeList:[],
      url: {
        list: '/hrSocial/tpaymentdiff/page', // 列表数据
        batchImportUrl:'/hrSocial/tpaymentdiff/analysisJsonStringImport', // 批量导入
        batchExportUrl:'/hrSocial/tpaymentdiff/doexportPaymentDiff', // 批量导出
        batchUpdateUrl:'/hrSocial/tpaymentdiff/analysisJsonStringUpdate', // 批量更新
        delete:'/hrSocial/tpaymentdiff/', // 删除
        batchDel: '/hrSocial/tpaymentdiff'
      }
    }
  },
  methods: {
    onChangeMonth(date){
      this.queryParam.createMonth = date ? date.format('YYYYMM') : null
    },
    // 批量导出
    batchExport() {
      const requestExportXlsUrl = this.url.batchExportUrl
      const queryParams =  this.getQueryParams()
      // 处理查询条件
      const requestParams = {}
      for (const key in queryParams) {
        if (String(key) !== 'current' && String(key) !== 'size') {
          requestParams[key] = queryParams[key]
        }
      }
      // 处理选中的
      let idStr = ''
      if (this.selectedRowKeys.length > 0) {
        for (let a = 0; a < this.selectedRowKeys.length; a++) {
          if (a === this.selectedRowKeys.length - 1) {
            idStr += this.selectedRowKeys[a]
          } else {
            idStr += `${this.selectedRowKeys[a]},`
          }
        }
      }
      this.$refs.comparisonExportModal.title = '缴费差额导出'
      this.$refs.comparisonExportModal.idStr = idStr
      this.$refs.comparisonExportModal.requestParams = requestParams
      this.$refs.comparisonExportModal.exportFields = this.exportFields
      this.$refs.comparisonExportModal.url.exportXlsUrl = requestExportXlsUrl
      // this.$refs.comparisonExportModal.checkState.checkedList = this.exportFields
      this.$refs.comparisonExportModal.add()
    },
    // 模板下载
    handleDownloadTemplate(templateUrl) {
      const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
      window.location.href = url
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
              if (res.errorMessageList.length) {
                this.$refs.errorModal.title = `导入提示: ${msg}`
                this.$refs.errorModal.message = msg
                this.$refs.errorModal.showModal(res.errorMessageList)
                return
              }
              this.$message.success('操作成功！')
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
          // 这里可以抛出文件类型错误不正确的相关提示
          this.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
    },
    //单个删除
    handledelete(id){
      const _this = this
      httpAction(`${_this.url.batchDel}/${id}`,null,'DELETE').then(res=>{
        if(res.code === 200){
          const msg = res.msg || res.message
          if (res.data && res.data.length) {
            _this.$refs.errorModal.title = `删除提示: ${msg}`
            _this.$refs.errorModal.message = msg
            _this.$refs.errorModal.showModal(res.data)
          } else {
            _this.$message.success(msg)
          }
          _this.loadData()
        }else{
          _this.$message.error(res.msg)
        }
      })

    },
    // 批量删除
    batchDelete(){
      const _this = this
        this.$confirm({
          title: '确认批量删除?',
          onOk() {
            httpAction(`${_this.url.batchDel}/${_this.selectedRowKeys.join(',')}`,null,'DELETE').then(res=>{
              if(res.code === 200){
                const msg = res.msg || res.message
                if (res.data && res.data.length) {
                  _this.$refs.errorModal.title = `批量删除提示: ${msg}`
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.data)
                } else {
                  _this.$message.success('批量删除成功！')
                  _this.selectedRowKeys = []
                }
                _this.loadData()
              }else{
                _this.$message.error(res.msg)
              }
            })
          },
        });
    },
    // 出错弹出窗回调
    errorModalFormOk(){
      this.selectedRowKeys = []
      this.loadData()
    },
    // 数据字典
    initDictConfig() {
      // 原因大类
      initDictOptions('REASON_PRIMARY_TYPE').then((res) => {
        if (Number(res.code) === 200) {
          this.reasonPrimaryTypeList = res.data
        }
      })
      // 原因小类
      initDictOptions('REASON_TYPE').then((res) => {
        if (Number(res.code) === 200) {
          this.reasonTypeList = res.data
        }
      })
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
