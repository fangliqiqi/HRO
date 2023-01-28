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
            :md="4"
            :sm="6"
          >
            <a-form-item label="状态">
              <a-select
                v-model="queryParam.status"
                placeholder="请选择"
              >
                <a-select-option value="">全部</a-select-option>
                <template v-for="(item, index) in statusOptions">
                  <a-select-option
                    v-if="item.value==1 || item.value==4"
                    :key="index"
                    :value="item.value"
                  >{{ item.label }}</a-select-option>
                </template>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">

            <a-col
              :md="8"
              :sm="10"
            >
              <a-form-item label="结算主体">
                <select-page
                  :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                  :title="'departName'"
                  :id="'id'"
                  :placeholder="'请输入结算主体'"
                  v-model="queryParam.settlementOrgan"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="创建人">
                <a-input
                  v-model="queryParam.createUser"
                  placeholder="请输入创建人"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="8"
              :sm="10"
            >
              <a-form-item label="创建日期">
                <a-range-picker
                  v-model="rangeTime"
                  @change="changeRange"
                  style="width:100%"
                  :showTime="{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                  }"
                  format="YYYY-MM-DD HH:mm:ss"
                />
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
        type="primary"
        icon="plus"
        @click="handleAdd"
      >新增</a-button>
      <!-- <a-button
        type="primary"
        @click="handleBatch"
        v-has="'wxhr:insurance_submitApply'"
      >批量提交办理</a-button> -->
      <a-dropdown v-has="'wxhr:tbusinessinsurance_batch_add'">
        <a-menu slot="overlay">
          <a-menu-item v-has="'wxhr:tbusinessinsurance_batch_add'">
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
              />批量新增
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/商险派单批量新增模板.xls')">
            <a-icon type="download" />模板下载</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量新增
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- <a-button
        type="primary"
        icon="swap"
        v-has="'wxhr:tbusinessinsurance_replace'"
        @click="handleReplace"
      >替换</a-button> -->

      <a-dropdown v-has="'wxhr:tbusinessinsurance_batch_replace'">
        <a-menu slot="overlay">
          <a-menu-item v-has="'wxhr:tbusinessinsurance_batch_replace'">
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.importExcelBatchReplaceUrl,'put')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />批量替换
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/商险派单批量替换模板.xls')">
            <a-icon type="download" />模板下载</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量替换
          <a-icon type="down" />
        </a-button>

      </a-dropdown>
      <a-dropdown v-has="'wxhr:tbusinessinsurance_batch_settlemonth'">
        <a-menu slot="overlay">
          <a-menu-item v-has="'wxhr:tbusinessinsurance_batch_settlemonth'">
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.importSettlemonthUrl,'put')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />结算月变更
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/商险派单批量结算月模板.xls')">
            <a-icon type="download" />模板下载</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量结算月变更
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-dropdown v-has="'wxhr:tbusinessinsurance_batch_settledepart'">
        <a-menu slot="overlay">
          <a-menu-item v-has="'wxhr:tbusinessinsurance_batch_settledepart'">
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.importSettledepartUrl,'put')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />结算主体变更
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/商险派单批量结算主体模板.xls')">
            <a-icon type="download" />模板下载</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量结算主体变更
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- 新增批量删除按钮
      从PaymentInfoList.vue文件中拷贝过来的
      删除了权限验证的选项
       -->
      <a-button
        type="primary"
        icon="delete"
        :disabled="selectedRowKeys.length === 0"
        @click="handleBatchDelete(selectedRowKeys)"
        v-has="'wxhr:inessinsurance_delete'"
      >批量删除</a-button>
      <a-button
        type="primary"
        icon="download"
        @click="handleExportXls"
        v-has="'wxhr:tbusinessinsurance_exportList'"
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, onSelect:tableUnitisSelected}"
        @change="handleTableChange"
        :scroll="{ x: 1500}"
      >
        <span
          slot="settleType"
          slot-scope="text"
        >
          <a-tag color="blue">{{ filterDictText(settleTypeOptions, text) }}</a-tag>
        </span>
        <span
          slot="insuranceTypeName"
          slot-scope="text"
        >
          <a-tag color="cyan">{{ text }}</a-tag>
        </span>
        <span
          slot="buyStandard"
          slot-scope="text"
        >
          <a-tag color="pink">{{ text }}</a-tag>
        </span>
        <span
          slot="status"
          slot-scope="text"
        >
          <a-tag :color="color[text]">{{ filterDictText(statusOptions, text) }}</a-tag>
        </span>

        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleDetail(record)"
            v-has="'wxhr:tbusinessinsurance_detail'"
          >详情</a>
          <!-- <a-divider
            type="vertical"
            v-if="record.status != 4"
            v-has="'wxhr:insurance_submitApply'"
          />
          <a
            @click="assignment(record)"
            v-if="record.status != 4"
            v-has="'wxhr:insurance_submitApply'"
          >提交办理</a> -->
          <a-divider
            type="vertical"
            v-if="(record.status == 4 || record.status == 1) && !record.fromEmpName"
            v-has="'wxhr:tbusinessinsurance_edit'"
          />
          <a
            @click="handleEdit(record)"
            v-if="(record.status == 4 || record.status == 1) && !record.fromEmpName"
            v-has="'wxhr:tbusinessinsurance_edit'"
          >编辑</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tbusinessinsurance_replace'"
          />
          <a-dropdown>
            <a class="ant-dropdown-link">更多
              <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item v-has="'wxhr:tinsuranceatta_upload'">
                <a @click="attachUpload(record)">上传附件</a>
              </a-menu-item>
              <a-menu-item
                v-has="'wxhr:inessinsurance_delete'"
                v-if=" record.status == 4"
              >
                <a-popconfirm
                  title="确定删除吗?"
                  @confirm="() => handleDelete(record.id)"
                >
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>

            </a-menu>
          </a-dropdown>

        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <dispatch-apply-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></dispatch-apply-modal>
    <error-modal
      ref="errorModal"
      @ok="modalFormOk"
    ></error-modal>
    <dispatch-apply-detail-modal ref="DispatchApplyDetailForm"></dispatch-apply-detail-modal>
    <!--详情-->
    <employee-list-modal
      ref="EmployeeListModalForm"
      @ok="modalFormOk"
    ></employee-list-modal>
    <!--员工列表-->
    <dispatch-apply-upload-modal ref="DispatchApplyUploadModalForm"></dispatch-apply-upload-modal>
    <!--上传附件-->
    <assignment-modal
      ref="AssignmentModalForm"
      @ok="modalFormOk"
    ></assignment-modal>
    <dispatch-edit-modal
      ref="DispatchEditModalForm"
      @ok="modalFormOk"
    ></dispatch-edit-modal>

  </a-card>
</template>

<script>
import ErrorModal from '../global/modules/ErrorModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin' //列表使用
import XLSX from 'xlsx'
import { httpActionHeader, httpAction } from '@/api/manage'
import { handleImportData } from '@/utils/common'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import DispatchApplyModal from './modules/DispatchApplyModal' //派单申请
import DispatchApplyDetailModal from './modules/DispatchApplyDetailModal' //派单申请详情
import DispatchApplyUploadModal from './modules/DispatchApplyUploadModal' //上传附件
import { getSettleDomainSelectVos } from '@/api/api'
import EmployeeListModal from './modules/EmployeeListModal' //替换
import AssignmentModal from './modules/AssignmentModal' //提交办理
import DispatchEditModal from './modules/DispatchEditModal' //编辑
import moment from 'moment'
import SelectPage from '@/components/jeecg/SelectPage'

export default {
  name: 'DispatchApplyList',
  mixins: [JeecgListMixin],
  components: {
    DispatchApplyModal,
    DispatchApplyDetailModal,
    EmployeeListModal,
    AssignmentModal,
    DispatchApplyUploadModal,
    DispatchEditModal,
    SelectPage,
    ErrorModal
  },
  watch: {
    $route: function() {
      this.loadData()
    },
    queryParam: function(val) {
      if (!val.createTimeStart) {
        this.rangeTime = null
      }
    }
  },
  data() {
    return {
      description: '商险派单申请管理界面',
      createTimeStart: '',
      createTimeEnd: '',
      queryParam: {},
      startValue: null,
      endValue: null,
      endOpen: false,
      color: ['orange', '#e08d33', 'cyan', 'green', 'red', 'blue', '#72bd4d', '#f1a95c', '##ffc107', '##aeec94'],
      importUrl: '', //导入地址
      importMethod: '', //导入方法
      fileList: [],
      //枚举字段
      buyTypeOptions: [], //险种
      statusOptions: [], //状态
      replaceStatusOptions: [], //替换状态
      settleTypeOptions: [], //结算类型
      settleDomainOptions: [], //结算主体
      settleDomains: [],
      rangeTime: null,
      // 表头
      columns: [
        {
          title: '员工姓名',
          align: 'center',
          dataIndex: 'empName',
          width: 100,
          ellipsis: true
        },
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'settlementOrganNo',
          width: 120,
          ellipsis: true
        },
        {
          title: '结算主体名称',
          align: 'center',
          dataIndex: 'settlementOrganName',
          width: 150,
          ellipsis: true
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'empIdcardNo',
          width: 160,
          ellipsis: true
        },
        {
          title: '结算类型',
          align: 'center',
          dataIndex: 'settleType',
          // customRender: (text) => {
          //   return filterDictText(this.settleTypeOptions, text)
          // },
          scopedSlots: { customRender: 'settleType' },
          width: 100,
          ellipsis: true
        },
        {
          title: '保险公司',
          align: 'center',
          dataIndex: 'insuranceCompanyName',
          width: 120,
          ellipsis: true
        },
        {
          title: '险种',
          align: 'center',
          dataIndex: 'insuranceTypeName',
          scopedSlots: { customRender: 'insuranceTypeName' },
          width: 150,
          ellipsis: true
        },
        {
          title: '购买标准',
          align: 'center',
          dataIndex: 'buyStandard',
          scopedSlots: { customRender: 'buyStandard' },
          width: 100,
          ellipsis: true
        },
        {
          title: '派单类型',
          align: 'center',
          dataIndex: 'fromEmpName',
          customRender: text => {
            return text ? '替换' : '新增'
          },
          width: 100,
          ellipsis: true
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          // customRender: (text) => {
          //   return filterDictText(this.statusOptions, text)
          // },
          scopedSlots: { customRender: 'status' },
          width: 100,
          ellipsis: true
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          width: 160,
          ellipsis: true
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: 200,
          fixed: 'right'
        }
      ],
      url: {
        add: '/temployeeinfo',
        templateUrl: 'busiInsurance/', //下载模板路径
        list: '/busiInsurance/tbusinessinsurance/page', //列表请求地址
        submitUrl: '/busiInsurance/tbusinessinsurance/submitApply', //提交办理
        importExcelBatchAddUrl: 'busiInsurance/tbusinessinsurance/batchAdd', //批量增加
        importExcelBatchReplaceUrl: 'busiInsurance/tbusinessinsurance/batchReplace', //批量替换
        importSettlemonthUrl: 'busiInsurance/tbusinessinsurance/batchSettleMonth', //批量结算月变更
        importSettledepartUrl: 'busiInsurance/tbusinessinsurance/batchSettleDepartMent', //批量结算主体
        delete: '/busiInsurance/tbusinessinsurance/', //删除
        getSettleDomainList: '/hrBase/tsettledomain/getSettleDomainSelectVosDomainNameOrCode', //查询结算主体
        submitApply: '/busiInsurance/tbusinessinsurance/batchSubmitApply',
        batchDelete: '/busiInsurance/tbusinessinsurance/batchDelete'
      }
    }
  },
  computed: {
    importExcelBatchAddUrl: function() {
      return `${window._CONFIG['domianURL']}${this.url.importExcelBatchAddUrl}`
    },
    importExcelBatchReplaceUrl: function() {
      return `${window._CONFIG['domianURL']}${this.url.importExcelBatchReplaceUrl}`
    },
    importSettlemonthUrl: function() {
      return `${window._CONFIG['domianURL']}${this.url.importSettlemonthUrl}`
    },
    importSettledepartUrl: function() {
      return `${window._CONFIG['domianURL']}${this.url.importSettledepartUrl}`
    },
    isClick: function(id) {
      console.log(id)

      return id > 0
    }
  },
  created() {
    // 结算主体和所属单位
    getSettleDomainSelectVos().then(res => {
      if (res.code === 200) {
        this.settleDomainOptions = res.data
      } else {
        this.$message.error('结算主体和所属单位数据请求失败！')
      }
    })
  },
  methods: {
    filterDictText,
    handleDownloadTemplate(templateUrl) {
      const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
      window.location.href = url
    },
    tableUnitisSelected(record, selected, selecTedRows) {
      this.selectedRowNumbers += selected ? 1 : -1
      console.log(this.selectedRowNumbers)
      console.log(record, selected, selecTedRows)
    },
    handleBatchDelete: function(idArray) {
      const _this = this
      const suffix = idArray.map(val => `ids=${val}`).join('&')
      this.$confirm({
        content: '确认删除？',
        onOk() {
          httpAction(`${_this.url.batchDelete}?${suffix}`, null, 'post')
            .then(res => {
              if (res.code === 200) {
                const msg = res.msg || res.message
                if (res.errorMessageList && res.errorMessageList.length) {
                  _this.$refs.errorModal.title = `批量处理提示: ${msg}`
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.errorMessageList)
                  return
                } else {
                  _this.$message.success('批量删除成功！')
                }
                _this.loadData()
              } else {
                _this.$message.warning(res.msg)
              }
            })
            .finally(() => {
              _this.selectedRowKeys = []
            })
        }
      })
    },
    // 新建
    handleAdd: function() {
      this.$refs.modalForm.title = '新建商险派单'
      this.$refs.modalForm.settleDomainBelongs = this.settleDomainOptions
      this.$refs.modalForm.add()
      this.$refs.modalForm.loadData()
    },
    // 详情
    handleDetail: function(record) {
      this.$refs.DispatchApplyDetailForm.title = '详情'
      this.$refs.DispatchApplyDetailForm.statusName = filterDictText(this.statusOptions, record.status)
      this.$refs.DispatchApplyDetailForm.buyTypeName = filterDictText(this.buyTypeOptions, record.buyType)
      this.$refs.DispatchApplyDetailForm.settleType = filterDictText(this.settleTypeOptions, record.settleType)
      this.$refs.DispatchApplyDetailForm.settleDomainBelongs = this.settleDomainOptions
      this.$refs.DispatchApplyDetailForm.edit(record)
    },
    //批量提交办理
    handleBatch() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.error('请先批量提交办理的员工')
        return false
      }
      const param = this.selectedRowKeys.join(',')
      const _this = this
      this.$confirm({
        title: '确认批量提交么?',
        onOk() {
          httpAction(_this.url.submitApply, { ids: param }, 'post').then(res => {
            if (Number(res.code) === 200) {
              const msg = res.msg || res.message
              if (res.errorMessageList && res.errorMessageList.length) {
                _this.$refs.errorModal.title = '批量处理提示: ' + msg
                _this.$refs.errorModal.message = msg
                _this.$refs.errorModal.showModal(res.errorMessageList)
                return false
              }
              _this.$message.success('批量提交成功！')
              _this.loadData()
            } else {
              _this.$message.warning(res.msg)
            }
          })
        }
      })
    },
    //替换
    handleReplace() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请先选择替换的员工')
        return false
      }
      this.$refs.EmployeeListModalForm.id = this.selectedRowKeys[0]
      this.$refs.EmployeeListModalForm.empId = this.selectionRows[0].empId
      this.$refs.EmployeeListModalForm.add()
    },
    //编辑
    handleEdit(record) {
      this.$refs.DispatchEditModalForm.settleDomainBelongs = this.settleDomainOptions
      this.$refs.DispatchEditModalForm.edit(record)
    },
    //指派办理人
    assignment(record) {
      // this.$refs.AssignmentModalForm.id=record.id
      // this.$refs.AssignmentModalForm.pession='wxhr:insurance_submitApply'
      // this.$refs.AssignmentModalForm.edit()
      const _this = this
      this.$confirm({
        content: '确认提交办理？',
        onOk() {
          httpAction(_this.url.submitUrl, { id: record.id }, 'post').then(res => {
            if (Number(res.code) === 200) {
              _this.$message.success('提交成功！')
              _this.loadData()
            } else {
              _this.$message.warning(res.msg)
            }
          })
        }
      })
    },
    changeRange(value, dateString) {
      this.queryParam.createTimeStart = dateString[0]
      this.queryParam.createTimeEnd = dateString[1]
    },
    //上传附件
    attachUpload(record) {
      this.$refs.DispatchApplyUploadModalForm.insuranceId = record.id
      this.$refs.DispatchApplyUploadModalForm.add()
    },
    moment,
    disabledStartDate(startValue) {
      const endValue = this.queryParam.createTimeEnd
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.queryParam.createTimeStart
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
    // 数据字典
    initDictConfig() {
      initDictOptions('insurance_buyType').then(res => {
        if (res.code === 200) {
          this.buyTypeOptions = res.data
        }
      })
      //结算类型
      initDictOptions('settlementType').then(res => {
        if (res.code === 200) {
          this.settleTypeOptions = res.data
        }
      })
      // 状态
      initDictOptions('Insurance_record_status').then(res => {
        if (res.code === 200) {
          this.statusOptions = res.data
        }
      })
      //替换状态
      initDictOptions('insurance_replace_status').then(res => {
        if (res.code === 200) {
          this.replaceStatusOptions = res.data
        }
      })
    },
    employeeDetailFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData()
    },
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
    }
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
.formLabel {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
