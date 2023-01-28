/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import XLSX from 'xlsx'
import { filterObj } from '@/utils/util'
import { httpActionHeader, deleteAction, getAction } from '@/api/manage'
import { handleImportData } from '@/utils/common'
// import merge from 'webpack-merge'
import moment from 'moment'

export const JeecgListMixin = {
  data() {
    return {
      /* 查询条件 */
      queryParam: {},
      /* 数据源 */
      dataSource: [],
      importUrl: '',
      importMethod: 'post',
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* 排序参数 */
      isorter: {
        // column: 'createTime',
        // order: 'desc'
      },
      /* 筛选参数 */
      filters: {},
      /* table加载状态 */
      loading: false,
      /* 宽度 */
      scrollWidth: {},
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus: false,
      /* 高级查询条件生效状态 */
      superQueryFlag: false,
      /* 高级查询条件 */
      superQueryParams: '',
      /* 输入框自定义宽度 */
      searchStyleWidth: 'width: 200px',
      /* 上传文件 */
      fileList: [],
      /* 中间过度的字段 */
      tempQueryParams: ['dateTemp', 'dateTemp1', 'dateTemp2', 'dateTemp3'],
      /* 允许原样通过的字段 */
      allowQueryParams: ['socialCreateMonth', 'providentCreateMonth', 'settlementMonth', 'orderDate', 'settleDate', 'socialPayMonth',
        'providentPayMonth'
      ],
      isLoad:true
    }
  },
  created() {
    //初始化字典配置 在自己页面定义
    this.initDictConfig()
    if(/AdvancePaymentSearchList/i.test(this.$route.path)){
      this.queryParam = Object.assign(this.queryParam,this.$route.query)
    }
    if(/PaymentSearchList/i.test(this.$route.path)){
      this.queryParam.socialCreateMonth = moment().format("YYYYMM");
    }
    if(this.isLoad){     // 这里检验是因为财务账单结算监控跳转到查询页面的问题
      this.loadData()
    }
    // this.loadData()
    // 监听屏幕分辨率
    window.addEventListener('resize', this.getStyleWidth)
  },
  mounted() {
    this.getStyleWidth()
  },
  methods: {
    moment,
    getPopupContainerFun(triggerNode){
      let wid = getComputedStyle(triggerNode).width
      triggerNode.setAttribute('style','width:'+wid)
      return triggerNode.parentNode
    },
    loadData(arg,delId=0) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return false
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams(delId)//查询条件
      // 针对报账查询-yhy
      if (this.url.list.indexOf("searchBill") != '-1') {
        if (Object.keys(params).length <= 2) {
          this.$message.error("请输入查询信息")
          return false;
        }
      }
      this.loading = true;
      getAction(this.url.list, params).then((res) => {
        if (Number(res.code) === 200) {
          if (res.data && res.data.records && res.data.records.length > 0) {
            var listPath = this.$route.path
            var pathArr = listPath.split('/')
            this.dataSource = res.data.records
            if (String(pathArr[1]) === 'dispose') {
              for (let item in this.dataSource) {
                if (String(this.dataSource[item].effectiveFlag) === '1') {
                  this.dataSource[item].effectiveFlagText = '有效'
                } else {
                  this.dataSource[item].effectiveFlagText = '无效'
                }
              }
            }
            this.ipagination.total = res.data.total
            
            this.loading = false
          } else {
            this.dataSource = []
            this.ipagination.total = 0
            this.loading = false
          }
        } else {
          this.loading = false;
          this.$message.error(res.msg);
        }
      })
    },
    // eslint-disable-next-line no-unused-vars
    pageChange(v) {

    },
    initDictConfig() {

    },
    handleSuperQuery(arg) {
      //高级查询方法
      if (!arg) {
        this.superQueryParams = ''
        this.superQueryFlag = false
      } else {
        this.superQueryFlag = true
        this.superQueryParams = JSON.stringify(arg)
      }
      this.loadData()
    },
    getQueryParams(total) {
      //获取查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
      }
      // 只针对报账查询的默认月份-yhy
      if (this.url.list.indexOf("searchBill=1") != '-1') {
        this.queryParam.settlementMonth = moment().format("YYYYMM")
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
      // url带参数
      let query = {} // url query
      // 兼容moment时间
      for (let key in param) {
        if (this.tempQueryParams.toString().indexOf(key) > -1) { // 删除过度（中间）字段
          delete param[key]
        }
        //通用过渡字段 _extra undefined
        if (/_extra$/gi.test(key) || param[key] == 'undefined') {
          delete param[key]
        }
        
        // 处理moment时间问题
        if (moment.isMoment(param[key])) {
          
          if (this.allowQueryParams.toString().indexOf(key) == -1) {
            param[key] = moment(param[key]).format("YYYY-MM-DD HH:mm:ss")
          } else { // 处理月份字符串
            param[key] = moment(param[key]).format("YYYYMM")
          }
        }
        query[key] = param[key]
      }
      //param.field = this.getQueryField()
      const tpage = Math.ceil((this.ipagination.total-total) / this.ipagination.pageSize);
      if(this.ipagination.current > tpage){
        this.ipagination.current = tpage||1;
      }

      param.current = this.ipagination.current
      param.size = this.ipagination.pageSize
      return filterObj(param)
    },
    getQueryField() {
      //TODO 字段权限控制
      var str = 'id,'
      this.columns.forEach(function (value) {
        str += ',' + value.dataIndex
      })
      return str
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    onClearSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    searchQuery() {
      this.selectedRowKeys = []
      this.loadData(1)
    },
    superQuery() {
      this.$refs.superQueryModal.show()
    },
    searchReset() {
      this.queryParam = {}
      this.selectedRowKeys = []
      if (this.idAreaCitys) {
        this.idAreaCitys = []
      }
      if (this.idAreaTowns) {
        this.idAreaTowns = []
      }
      this.$router.push({
        query: {}
      })
      this.loadData(1)
    },
    batchSubmit: function () {
      if (!this.url.submitBatch) {
        this.$message.error('请设置url.submitBatch属性!')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认提交？',
          content: '是否提交选中数据?',
          onOk: function () {
            deleteAction(that.url.submitBatch, { ids: ids }).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success('提交成功！')
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      }
    },
    batchDel: function () {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function () {
            deleteAction(that.url.deleteBatch, { ids: ids }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData(null,this.selectedRowKeys.length)
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      }
    },
    handleBlur: function () {

    },
    handleFocus: function () {

    },
    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      that.loading = true
      deleteAction(that.url.delete + id).then((res) => {
        if (Number(res.code) === 200) {
          that.$message.success('删除成功!')
          that.modalFormOk()
          that.loading = false
        } else {
          //兼容
          that.loading = false
          that.$message.warning(res.message || res.msg)
        }
      }).finally(()=>{
        setTimeout(()=>{
          that.loading = false
        },3000)
        
      })
    },
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '编辑'
    },
    handleAdd: function () {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = ('ascend' === String(sorter.order)) ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus
    },
    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loading = true;
      this.loadData(null,1)
      this.onClearSelected()
    },
    handleDetail: function (record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.disableSubmit = true
    },
    downloadLocalTemplate(templateUrl) {
      const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
      window.location.href = url
    },
    /* 导出 */
    handleExportXls() {
      let paramsStr = encodeURI(JSON.stringify(this.getQueryParams()))
      let url = `${window._CONFIG['domianURL'] + this.url.exportXlsUrl}?paramsStr=${paramsStr}`
      window.location.href = url
    },
    /* 导入 */
    handleImportExcel(info) {
      // if (info.file.status !== 'uploading') {}
      if (info.file.status === 'done') {
        if (!info.file.response.success) {
          if (info.file.response.errorInfo) {
            var errorInfo = info.file.response.errorInfo
            var errmsg = ''
            for (let item in errorInfo) {
              errmsg = errmsg + errorInfo[item]['message'] + "  "
            }
            this.$message.error(errmsg)
          } else {
            this.$message.error(info.file.response.message)
          }
        } else {
          this.$message.success(`${info.file.name} 文件上传成功.`)
          this.loadData()
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    // 批量导入
    beforeUpload(file) {
      // this.fileList = [...this.fileList, file]
      this.fileList = [file]
      return false
    },
    // 导入功能
    handleImport(importUrl, timeOut,message) {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('files[]', file)
      })
      this.uploadFilesChange(fileList[0], importUrl, timeOut,message)
    },
    // 实现导入
    uploadFilesChange(file, importUrl, timeOut,message) {
      var that = this
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
              data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name],{defval:'',blankrows:true}))
              break
            }
          }
          // 去除每个字段的前后空格以及最后的空格行
          const newData = handleImportData(data[sheetName])
          const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
          const requestTimeOut = timeOut ? timeOut : 600000  // 请求过期时间
          //开始异步提交
          httpActionHeader(importUrl, JSON.stringify(newData), this.importMethod, contextType, requestTimeOut).then((res) => {
            that.loading = false
            const msg = res.message || res.msg

            if (Number(res.code) === 200) {
                console.log(res.errorMessageList);
              if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                that.$refs.errorModal.title = '导入提示: ' + msg
                that.$refs.errorModal.message = msg
                that.$refs.errorModal.showModal(res.errorMessageList)
                that.loadData()
              } else {
                that.$message.success(message || `导入成功！`)
                that.loadData()
              }
            } else {
              if (res.data != null && res.data.length > 0) {
                that.$refs.errorModal.title = '导入提示: ' + msg
                that.$refs.errorModal.message = msg
                that.$refs.errorModal.showModal(res.data)
              } else if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                that.$refs.errorModal.title = '导入提示: ' + msg
                that.$refs.errorModal.message = msg
                that.$refs.errorModal.showModal(res.errorMessageList)
              } else {
                that.$message.error(msg)
              }
            }
          })
        } catch (e) {
          console.log(e);
          // 这里可以抛出文件类型错误不正确的相关提示
          this.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
    },
    // 导入相关模板下载
    handleDownloadTemplate(downloadUrl) {
      let url = `${window._CONFIG['domianURL'] + downloadUrl}`
      window.location.href = url
    },
    // 流程进展明细
    handleAuditProcess(id, type = 'isNuLL') {
      if (!this.url.auditProcessUrl) {
        this.$message.error('请设置url.auditProcessUrl属性!')
        return
      }

      let requestUrl = ''

      if (type === 'isNuLL') {
        requestUrl += this.url.auditProcessUrl + '?id=' + id
      } else {
        requestUrl += this.url.auditProcessUrl + '?id=' + id + '&type=' + type
      }

      getAction(requestUrl, '').then((res) => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.auditProcessModal.title = '流程进展明细'
          this.$refs.auditProcessModal.edit(res.data)
        } else {
          this.$message.error('数据不完整！')
        }
      })
    },
    // 获取相关宽度
    getStyleWidth() {
      // 表单宽度
      let tableWidth = 0
      let columnsWidth = 0

      if (this.$refs.table) {
        if ((document.body.clientWidth - this.$refs.table.$el.clientWidth) > 200) { // 由于左边菜单栏加载的时候没有宽度
          tableWidth = this.$refs.table.$el.clientWidth
        } else {
          tableWidth = this.$refs.table.$el.clientWidth - 200
        }
      }

      for (let i = 0; i < (this.columns).length; i++) {
        if ((this.columns)[i].width) {
          columnsWidth += (this.columns)[i].width
        }

        if ((this.columns)[i].key === 'operations') {  // 默认已经结束了
          if (columnsWidth > tableWidth) {
            (this.columns)[i].fixed = 'right' // 增加浮动
            //this.loadData() // 重新加载【不然浮动效果上不去】
          } else {
            delete (this.columns)[i].fixed  // 删除浮动【不管有没有浮动】
            //this.loadData() // 重新加载【不然浮动效果上不去】
          }
        }
      }
    },
  }
}