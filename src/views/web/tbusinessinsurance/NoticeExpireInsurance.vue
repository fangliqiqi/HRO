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
            <a-form-item label="员工姓名">
              <a-input
                placeholder="请输入员工姓名"
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
                placeholder="请输入身份证号"
                v-model="queryParam.empIdcardNo"
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
      <a-button
        type="primary"
        icon="download"
        v-has="'wxhr:insurance_expirewarnexport'"
        @click="exportHandle"
      >导出</a-button>
      <a-button
        type="primary"
        @click="expireIgnore"
        :disabled="selectedRowKeys.length==0"
        v-has="'wxhr:insurance_expireignore'"
      >批量忽略</a-button>
      <a-dropdown v-has="'wxhr:insurance_remark_add'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.importExcelBatchAddUrl,'post')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />备注批量导入
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downloadLocalTemplate('/templates/批量备注模板.xls')">
            <a-icon type="download" />备注批量模板下载</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">备注批量导入
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
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
        :scroll="{x: 1}"
      >
        <span
          slot="rangeTime"
          slot-scope="text, record"
        >
          {{ record.policyStart }} ~ {{ record.policyEnd }}
        </span>

        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="handleRemark(record)">备注</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:insurance_expireignore'"
          />
          <a-popconfirm
            v-has="'wxhr:insurance_expireignore'"
            title="是否确认忽略?"
            ok-text="是"
            cancel-text="否"
            @confirm="handleIgnorance(record)"
          >
            <a>忽略</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <dispatch-apply-detail-modal ref="DispatchApplyDetailForm"></dispatch-apply-detail-modal>
    <dispatch-apply-export-modal
      ref="DispatchApplyExportModalForm"
      @ok="modalFormOk"
    ></dispatch-apply-export-modal>
    <error-modal
      ref="errorModal"
      @ok="modalFormOk"
    ></error-modal>
    <a-modal
      title="添加备注"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form
          :form="form"
          class="remarkForm"
          layout="inline"
        >
          <a-form-item
            label=""
            class="remark"
          >
            <a-textarea
              placeholder="请输入备注"
              v-decorator="['expireRemark', {rules: [{ required: true,message: '请输入备注!' }]}]"
              :rows="4"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import DispatchApplyExportModal from './modules/DispatchApplyExportModal' //导出明细
  import DispatchApplyDetailModal from './modules/DispatchApplyDetailModal' //详情
  import { httpAction,httpActionHeader } from '@/api/manage'
  import { handleImportData } from '@/utils/common'
  import pick from 'lodash.pick'
  import ErrorModal from '../global/modules/ErrorModal'
  import XLSX from 'xlsx'

  export default {
    name: 'NoticeExpireInsurance',
    mixins: [JeecgListMixin],
    components: {
      DispatchApplyDetailModal,
      DispatchApplyExportModal,
      ErrorModal
    },
    data() {
      return {
        description: '商险到期提醒',
        settleTypeOptions:[], //结算类型
        statusOptions:[], //状态
        buyTypeOptions:[],
        visible:false,
        confirmLoading:false,
        form: this.$form.createForm(this),
        model:{},
        // 表头
        columns: [
          {
            title: '结算月份',
            align: 'center',
            dataIndex: 'settleMonth',
            ellipsis: true,
            width:80,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '结算部门',
            align: 'center',
            dataIndex: 'settlementOrganName',
            ellipsis: true,
            width:150,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '结算类型',
            align: 'center',
            dataIndex: 'settleType',
            ellipsis: true,
            width:100,
            customRender:(text)=>{
              let res = filterDictText(this.settleTypeOptions, text)
              return (
                 <a-tooltip
                  placement="topLeft"
                  title={ res }
                >{ res }
                </a-tooltip>
              )
            },
          },
          {
            title: '购买地',
            align: 'center',
            dataIndex: 'businessInsuranceAddr',
            ellipsis: true,
            width:100,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '单位',
            align: 'center',
            dataIndex: 'customerName',
            ellipsis: true,
            width:150,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '姓名',
            align: 'center',
            dataIndex: 'empName',
            ellipsis: true,
            width:80,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcardNo',
            ellipsis: true,
            width:150,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '险种',
            align: 'center',
            dataIndex: 'insuranceTypeName',
            ellipsis: true,
            width:120,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '保险公司',
            align: 'center',
            dataIndex: 'insuranceCompanyName',
            ellipsis: true,
            width:120,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '生效时间',
            align: 'center',
            dataIndex: 'policyEffect',
            ellipsis: true,
            width:100,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '保单起止时间',
            align: 'center',
            dataIndex:'policyStart',
            ellipsis: true,
            width:180,
            customRender:(text,record)=>{
              let rangeTime = text +' ~ '+ record.policyEnd
              return (
                <a-tooltip title={ rangeTime } placement="topLeft">
                  { rangeTime }
                </a-tooltip>
              )
            }
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            ellipsis: true,
            width:80,
            customRender: (text) => {
              let status = filterDictText(this.statusOptions, text)
              return (
                <a-tooltip title={ status } placement="topLeft">
                  { status }
                </a-tooltip>
              )
            }
          },
          {
            title: '备注',
            align: 'center',
            dataIndex: 'expireRemark',
            ellipsis: true,
            width:80,
            customRender: (text) => {
              return (
                <a-tooltip title={ text } placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed:'right',
            width:150,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/tbusinessinsurance/getExpireWarn/Vopage', //到期
          exportXlsUrl:'/busiInsurance/tbusinessinsurance/getExpireWarn/export',
          remark:'/busiInsurance/tbusinessinsurance/expireRemark',
          batchExpireIgnore:'/busiInsurance/tbusinessinsurance/batchExpireIgnore',
          expireIgnore:'/busiInsurance/tbusinessinsurance/expireIgnore',
          templateUrl:'busiInsurance/',
          importExcelBatchAddUrl:'busiInsurance/tbusinessinsurance/remark/batchAdd'
        }
      }
    },
    methods: {
      //导出办理
      exportHandle:function(){
        this.$refs.DispatchApplyExportModalForm.title = '导出明细'
        this.$refs.DispatchApplyExportModalForm.url.exportXlsUrl = this.url.exportXlsUrl
        this.$refs.DispatchApplyExportModalForm.url.exportFields = 'busiInsurance/tbusinessinsurance/getExportFieldName'
        this.$refs.DispatchApplyExportModalForm.params = this.getQueryParams()//查询条件
        this.$refs.DispatchApplyExportModalForm.add(this.selectedRowKeys)
      },
      //查看
      handleDetail: function(record) {
        this.$refs.DispatchApplyDetailForm.title = '详情'
        this.$refs.DispatchApplyDetailForm.statusName = filterDictText(this.statusOptions, record.status)
        this.$refs.DispatchApplyDetailForm.buyTypeName = filterDictText(this.buyTypeOptions, record.buyType)
        this.$refs.DispatchApplyDetailForm.settleType = filterDictText(this.settleTypeOptions, record.settleType)
        this.$refs.DispatchApplyDetailForm.edit(record)
      },
      // 添加备注
      handleRemark:function(record){
        this.visible = true
        this.model = record
        if(record.expireRemark){
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'expireRemark'))
          })
        }
      },
      // 批量忽略
      expireIgnore(){
        const _this = this
        let param = this.selectedRowKeys.map((item)=>{
          return {id:item}
        })
        this.$confirm({
          content: '确认批量忽略吗？',
          onOk() {
            httpAction(_this.url.batchExpireIgnore,param,'PUT').then((res)=>{
              if (res.code === 200) {
                let msg = res.message || res.msg
                if (res.errorMessageList.length) {
                  this.$refs.errorModal.title = '操作提示: ' + msg
                  this.$refs.errorModal.message = msg
                  this.$refs.errorModal.showModal(res.errorMessageList)
                  return false
                }
                _this.$message.success('操作成功！')
                _this.loadData()
                _this.handleCancel()
              }else{
                let msg = res.message || res.msg
                if(res.errorMessageList.length) {
                  _this.$refs.errorModal.title = '操作提示: ' + msg
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  _this.$message.error(msg)
                }
              }
            }).finally(()=>{
              _this.confirmLoading = false
            })
          },
          onCancel() {},
        });
      },
      handleIgnorance(record){

        this.confirmLoading = true
        httpAction(this.url.expireIgnore,{id:record.id},'PUT').then((res)=>{
          if (res.code === 200) {
            this.$message.success('操作成功！')
            this.loadData()
            this.handleCancel()
          }else{
            this.$message.warning(res.msg)
          }
        }).finally(()=>{
          this.confirmLoading = false
        })
      },
      handleOk(){
        const _this = this
        this.form.validateFields((err, values) => {
          if (!err) {
            _this.confirmLoading = true
            values.id = _this.model.id
            httpAction(_this.url.remark,values,'PUT').then((res)=>{
              if (res.code === 200) {
                _this.$message.success('操作成功！')
                _this.loadData()
                _this.handleCancel()
              }else{
                _this.$message.warning(res.msg)
              }
            }).finally(()=>{
              _this.confirmLoading = false
            })
          }
        })
      },
      handleCancel(){
        this.visible = false
        this.model = {}
        this.form.resetFields()
      },
      handleImport(url,method){
        const { fileList } = this
        this.uploadFilesChange(fileList[0],url,method)
      },
      uploadFilesChange(file,url,method) {
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
            for(const index in allSheets){
              const name = allSheets[index].name
              if(workbook.Sheets.hasOwnProperty(name) && allSheets[index].Hidden === 0){
                sheetName = name
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name],{defval:'',blankrows:true}))
                break
              }
            }
            // 去除空格
            const newData = handleImportData(data[sheetName])
            const contextType = {'Content-Type': 'application/json;charset=UTF-8'}
            const requestTimeOut = 600000  // 请求过期时间
            httpActionHeader(url, JSON.stringify(newData),method,contextType,requestTimeOut).then((res) => {
              const msg = res.message || res.msg
              if (res.code === 200) {
                if (res.errorMessageList.length) {
                  this.$refs.errorModal.title = `导入提示: ${msg}`
                  this.$refs.errorModal.message = msg
                  this.$refs.errorModal.showModal(res.errorMessageList)
                }else{
                  this.$message.success("上传成功！")
                  this.loadData()
                }
              } else {
                if(res.data != null && res.data.length > 0) {
                  this.$refs.errorModal.title = `导入提示: ${msg}`
                  this.$refs.errorModal.message = msg
                  this.$refs.errorModal.showModal(res.data)
                } else {
                  this.$message.error(msg)
                }
              }
            })
          } catch (e) {
            console.log(e)
            // 这里可以抛出文件类型错误不正确的相关提示
            this.$message.error('文件上传错误！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file)
      },
      // 数据字典
      initDictConfig() {
       //购买类型
        initDictOptions('insurance_buyType').then((res) => {
          if (res.code === 200) {
            this.buyTypeOptions = res.data
          }
        });
        // 状态
        initDictOptions('Insurance_record_status').then((res) => {
          if (res.code === 200) {
            this.statusOptions = res.data
          }
        })
        //结算类型 
        initDictOptions('settlementType').then((res) => {
          if (res.code === 200) {
            this.settleTypeOptions = res.data
          }
        })
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
.remarkForm {
  height: 117px;
}
.remark {
  width: 100%;
  :global(.ant-form-item-control-wrapper) {
    width: 100%;
  }
  textarea {
    resize: none;
  }
}
</style>
