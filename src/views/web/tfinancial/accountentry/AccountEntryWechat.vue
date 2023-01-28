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
            <a-form-item label="交易时间">
              <a-range-picker
                :placeholder="['开始时间','结束时间']"
                format="YYYY-MM-DD"
                v-model="queryParam.transactionTime_extra"
                @change="changeIncomeDate"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="应结订单金额"
              class="stepFormText"
            >
              <a-input-number
                placeholder="请输入应结订单金额查询"
                v-model="queryParam.settledAmount"
                :parser="limitAccount"
                style="width:100%"
              ></a-input-number>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="商品名称">
              <a-input
                placeholder="请输入商品名称查询"
                v-model="queryParam.orderName"
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
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item :disabled="btnLoading">
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleChange"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />批量导入
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/微信入账批量导入模板.xlsx')">
            <a-icon type="download" />模板下载</a-menu-item>
        </a-menu>
        <a-button v-has="'wxhr:twxaccountinfo_importListAdd'">批量导入
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-button
        type="primary"
        icon="export"
        style="margin:0px 10px"
        :loading="btnLoading"
        @click="handleExport"
        v-has="'wxhr:twxaccountinfo_export'"
      >批量导出</a-button>
      <a-button
        type="primary"
        icon="delete"
        v-has="'wxhr:twxaccountinfo_batch_del'"
        :loading="btnLoading"
        @click="batchDelete"
      >批量删除</a-button>

    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
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
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
            v-has="'wxhr:twxaccountinfo_del'"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <error-modal
      ref="errorModal"
      @ok="modalFormOk"
    ></error-modal>
  </a-card>
</template>

<script>
  import { httpAction,httpActionHeader,downFilePost } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  
  import XLSX from 'xlsx'
  import { handleImportData,limitAccount } from '@/utils/common'
  import ErrorModal from '../../global/modules/ErrorModal'

  export default {
    name: 'AccountEntryWechat',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
    },
    data() {
      return {
        description: '支付宝入账',
        // 表头
        columns: [
          {
            width: 100,
            ellipsis: true,
            title: '交易时间',
            align: 'center',
            dataIndex: 'transactionTime',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 130,
            ellipsis: true,
            title: '公众账号ID',
            align: 'center',
            dataIndex: 'publicNumber',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 130,
            ellipsis: true,
            title: '商户号',
            align: 'center',
            dataIndex: 'businessNumber',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '商户订单号',
            align: 'center',
            dataIndex: 'orderNumber',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '应结订单金额',
            align: 'center',
            dataIndex: 'settledAmount',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '商品名称',
            align: 'center',
            dataIndex: 'orderName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        isUpload:true,
        btnLoading:false,
        url: {
          list: 'salary/twxaccountinfo/page',
          delete: 'salary/twxaccountinfo/',
          deleteBatch: '/salary/twxaccountinfo/removeByIds',
          exportUrl:'salary/twxaccountinfo/exportWxInfoRecord',
        },
      }
    },
    methods: {
      limitAccount,
      changeIncomeDate(str,date){
        if(str.length){
          this.queryParam.transactionTimeStart = date[0] + ' 00:00:00';
          this.queryParam.transactionTimeEnd = date[1] + ' 23:59:59';
        }else{
          delete this.queryParam.transactionTimeStart;
          delete this.queryParam.transactionTimeEnd;
        }
      },
      handleDownloadTemplate(templateUrl){
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`;
        window.location.href = url;
      },
      beforeUpload() {
        return false
      },
      //上传
      handleChange(file) {
        if(this.isUpload) this.uploadFilesChange(file.file)
      },
      uploadFilesChange(file,timeOut){
        const _this = this
        // 通过FileReader对象读取文件
        const fileReader = new FileReader()
        fileReader.onload = event => {
          try {
            _this.btnLoading = true
            const { result } = event.target
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary',cellDates: true,dateNF: true })
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
            const newData = handleImportData(data[sheetName],'YYYY-MM-DD HH:mm:ss')
            const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
            const requestTimeOut = timeOut ? timeOut : 600000  // 请求过期时间
            //开始异步提交
            httpActionHeader('/salary/twxaccountinfo/importListAdd', JSON.stringify(newData), 'post', contextType, requestTimeOut).then((res) => {
              const msg = res.message || res.msg
              if (Number(res.code) === 200) {
                if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  _this.$refs.errorModal.title = `导入提示: ${msg}`
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.errorMessageList)
                  _this.loadData()
                } else {
                  _this.$message.success("导入成功！")
                  _this.loadData()
                }
              } else {
                if (res.data != null && res.data.length > 0) {
                  _this.$refs.errorModal.title = `导入提示: ${msg}`
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.data)
                } else if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  _this.$refs.errorModal.title = `导入提示: ${msg}`
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  _this.$message.error(msg)
                }
              }
            }).finally(()=>{
              _this.btnLoading = false
            })
          } catch (e) {
            _this.btnLoading = false
            // 这里可以抛出文件类型错误不正确的相关提示
            this.$message.error('文件上传错误！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file)
      },
      handleExport(){
        // eslint-disable-next-line
        let param = _.cloneDeep(this.queryParam)
        delete param.incomeDate_extra
        const _this = this
        let httpurl = `${this.url.exportUrl}`
        if(this.selectedRowKeys.length){
          httpurl += `?idArray=${this.selectedRowKeys.join(',')}`
        }
        this.btnLoading = true;
        downFilePost(httpurl, param).then((res) => {
          if (res.size > 0) {
            var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
            var downloadElement = document.createElement('a')
            var href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.href = href
            downloadElement.download = `微信入账账单.xls` // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
            _this.$message.success('导出成功！')
          } else {
            _this.$message.warning(`${res.msg} 导出失败!`)
          }
        }).finally(() => {
          _this.btnLoading = false;
        })
        
      },
      handleDelete(id){
        httpAction(this.url.delete + id, null, 'DELETE').then((res) => {
          if(res.code === 200){
            this.$message.success('删除成功!');
            this.loadData(null,1);
          }else{
            this.$message.warning(res.msg);
          }
        })
      },
      // 批量删除
      batchDelete(){
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录删除！')
          return
        }
        const _this = this
        _this.btnLoading = true;
        _this.$confirm({
          title: '确认批量删除?',
          onOk() {
            httpAction(`${_this.url.deleteBatch}?ids=${_this.selectedRowKeys.join(',')}`,null,'DELETE').then(res=>{
              if(res.code === 200){
                const msg = res.msg || res.message
                if (res.data && res.data.length) {
                  _this.$refs.errorModal.title = `批量删除提示: ${msg}`
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.data)
                } else {
                  _this.$message.success('批量删除成功！')
                  _this.loadData(null,_this.selectedRowKeys.length)
                  _this.selectedRowKeys = []
                }
              }else{
                _this.$message.error(res.msg)
              }
            }).finally(()=>{
              _this.btnLoading = false;
            })
          },
          onCancel(){
            _this.btnLoading = false;
          }
        });
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

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}

.ant-btn-danger {
  background-color: #ffffff;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}

.range-picker-new-style {
  :global(.ant-calendar-range-picker-input) {
    font-size: 13px;
  }
}

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
