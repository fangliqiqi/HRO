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
            <a-form-item label="办理状态">
              <a-select
                v-model="queryParam.status"
                placeholder="请选择"
              >
                <a-select-option value="">全部</a-select-option>
                <template v-for="(item, index) in statusOptions">
                  <a-select-option
                    :key="index"
                    :value="item.value"
                    v-if="item.value>0"
                  >{{ item.label }}</a-select-option>
                </template>
              </a-select>

            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">

            <a-col
              :md="6"
              :sm="8"
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
              <a-form-item
                label="派单人"
                class="formLabel"
              >
                <a-input
                  placeholder="请输入派单人"
                  v-model="queryParam.createUser"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="保险公司名称"
                class="formLabel"
              >
                <a-input
                  placeholder="请输入保险公司名称"
                  v-model="queryParam.insuranceCompanyName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="11"
              :sm="13"
            >
              <a-form-item label="创建日期">
                <a-range-picker
                  v-model="rangeTime"
                  @change="changeRange"
                  :getCalendarContainer="getCalendarContainer"
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
        icon="download"
        @click="exportHandle"
        v-has="'wxhr:tbusinessinsurance_export_handle'"
      >导出办理</a-button>
      <a-button
        type="primary"
        icon="bank"
        @click="handleBatch"
        v-has="'wxhr:tbusinessinsurance_batchHandle'"
      >批量办理</a-button>

      <a-dropdown v-has="'wxhr:insurance_policynoandfee'">
        <a-menu slot="overlay">
          <a-menu-item
            v-has="'wxhr:insurance_policynoandfee'"
            @click="batchUplods"
          >
            <a-icon
              type="import"
              style="margin-right: 10px"
            />批量保单号保费
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/批量保单号保费模板.xls')">
            <a-icon type="download" />模板下载</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量保单号保费
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-dropdown v-has="'wxhr:tbusinessinsurance_batch_batchUpdate'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.importBatchUpdate)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />批量更新
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/商险批量更新模板.xls')">
            <a-icon type="download" />模板下载</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量更新
          <a-icon type="down" />
        </a-button>
      </a-dropdown>

      <a-dropdown v-has="'wxhr:insurance_policynoandfee'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.importBatchDomain)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />结算主体变更
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/批量结算主体模板.xls')">
            <a-icon type="download" />模板下载</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">结算主体变更
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
        :scroll="{x: 1}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span
          slot="status"
          slot-scope="text"
        >
          <a-tag :color="color[text]">{{ filterDictText(statusOptions, text) }}</a-tag>
        </span>
        <span
          slot="fromEmpName"
          slot-scope="text"
        >
          <template v-if="text">
            <a-tag color="purple">替换</a-tag>
          </template>
          <template v-else>
            <a-tag color="blue">新增</a-tag>
          </template>
        </span>
        <span
          slot="validFlag"
          slot-scope="text"
        >
          <template v-if="text == 0">
            <a-tag color="green">有效</a-tag>
          </template>
          <template v-else>
            <a-tag color="red">无效</a-tag>
          </template>
        </span>

        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleDetail(record)"
            v-has="'wxhr:tbusinessinsurance_detail'"
          >查看</a>

          <a-divider
            type="vertical"
            v-if="record.status == 2"
            v-has="'wxhr:tbusinessinsurance_handle'"
          />
          <a
            @click="handleInsurance(record)"
            v-if="record.status == 2"
            v-has="'wxhr:tbusinessinsurance_handle'"
          >办理</a>
          <a-divider
            type="vertical"
            v-if="record.status == 3"
            v-has="'wxhr:busiinsurance_settlemet'"
          />
          <a
            @click="handleSettlemet(record)"
            v-if="record.status == 3"
            v-has="'wxhr:busiinsurance_settlemet'"
          >结算</a>

          <a-divider
            type="vertical"
            v-if="record.status != 0 && record.status != 4"
          />
          <a-dropdown>
            <a class="ant-dropdown-link">更多
              <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item
                v-has="'wxhr:tbusinessinsurance_modify'"
                v-if="record.status == 1 || record.status == 2 || record.status == 3 || record.status == 5 || record.status == 6"
              >
                <a @click="handleEdit(record)">编辑</a>
              </a-menu-item>
              <a-menu-item
                v-has="'wxhr:tbusinessinsurance_handle'"
                v-if="record.status == 3"
              >
                <a @click="handleFaild(record)">办理失败</a>
              </a-menu-item>
              <a-menu-item v-has="'wxhr:insurance_attach_upload'">
                <a @click="attachUpload(record)">上传附件</a>
              </a-menu-item>
              <a-menu-item v-if="!Boolean(record.fromEmpName)">
                <a @click="handleAmend(record)">修改保单号</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>

        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <error-modal ref="errorModal"></error-modal>
    <dispatch-apply-detail-modal ref="DispatchApplyDetailForm"></dispatch-apply-detail-modal>
    <submit-apply-modal
      ref="SubmitApplyModalForm"
      @ok="modalFormOk"
    ></submit-apply-modal>
    <dispatch-apply-edit-modal
      ref="DispatchApplyEditModalForm"
      @ok="modalFormOk"
    ></dispatch-apply-edit-modal>
    <dispatch-apply-export-modal
      ref="DispatchApplyExportModal"
      @ok="modalFormOk"
    ></dispatch-apply-export-modal>
    <employee-list-modal
      ref="EmployeeListModalForm"
      @ok="modalFormOk"
    ></employee-list-modal>
    <assignment-modal
      ref="AssignmentModalForm"
      @ok="modalFormOk"
    ></assignment-modal>
    <insurance-settlemet-modal
      ref="InsuranceSettlemetModalForm"
      @ok="modalFormOk"
    ></insurance-settlemet-modal>
    <insurance-amendment-modal
      ref="InsuranceAmendmentModalForm"
      @ok="modalFormOk"
    ></insurance-amendment-modal>
    <dispatch-apply-upload-modal ref="DispatchApplyUploadModalForm"></dispatch-apply-upload-modal>
    <batch-uplods-modal ref="BatchUplodsModalForm" :type="1"></batch-uplods-modal>
    <a-modal
      title="办理失败"
      :visible="faildVisible"
      @ok="handleFaildOk"
      :confirmLoading="confirmLoading"
      @cancel="handleFaildCancel"
    >
      <a-form
        :form="faildForm"
        layout="inline"
      >
        <a-form-item label="失败原因">
          <a-textarea
            :rows="3"
            placeholder="请填写失败原因"
            v-decorator="['auditRemark',{ rules: [{max:50,message:'最多50个字符'},{ required: true, message: '请填写失败原因!' }] }]"
            style="width: 450px;resize:none;"
          />
        </a-form-item>
      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import ErrorModal from '../global/modules/ErrorModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import moment from 'moment'
import JDate from '@/components/jeecg/JDate'
import DispatchApplyDetailModal from './modules/DispatchApplyDetailModal' //派单申请详情
import SubmitApplyModal from './modules/SubmitApplyModal' //提交办理
import DispatchApplyEditModal from './modules/DispatchApplyEditModal' //修改
import EmployeeListModal from './modules/EmployeeListModal' //替换
import DispatchApplyExportModal from './modules/DispatchApplyExportModal' //导出办理
import AssignmentModal from './modules/AssignmentModal' //委托办理
import DispatchApplyUploadModal from './modules/DispatchApplyUploadModal' //上传附件
import InsuranceSettlemetModal from './modules/InsuranceSettlemetModal' //商险结算
import InsuranceAmendmentModal from './modules/InsuranceAmendmentModal' //商险结算
import BatchUplodsModal from '../global/modules/BatchUplodsModal' //批量上传
import { httpAction } from '@/api/manage'
import SelectPage from '@/components/jeecg/SelectPage'
import { mapGetters } from 'vuex'
// import { getAllSettleDomainSelectVos } from '@/api/api'
import { randomString } from '@/utils/common'

export default {
  name: 'InsuranceHandleList',
  mixins: [JeecgListMixin],
  components: {
    JDate,
    DispatchApplyDetailModal,
    DispatchApplyEditModal,
    SubmitApplyModal,
    EmployeeListModal,
    DispatchApplyUploadModal,
    DispatchApplyExportModal,
    AssignmentModal,
    InsuranceSettlemetModal,
    InsuranceAmendmentModal,
    SelectPage,
    ErrorModal,
    BatchUplodsModal
  },
  data() {
    return {
      description: '商险办理',
      title: '商险办理',
      startValue: null,
      endValue: null,
      endOpen: false,
      faildVisible: false,
      confirmLoading: false,
      businessInsuranceId: '',
      rangeTime: null,
      faildForm: this.$form.createForm(this),
      color: ['orange', '#e08d33', 'cyan', 'green', 'red', 'blue', '#72bd4d', '#f1a95c', '##ffc107', '##aeec94'],
      //枚举字段
      buyTypeOptions: [], //险种
      statusOptions: [], //状态
      replaceStatusOptions: [], //替换状态
      settleTypeOptions: [], //结算类型
      settleDomainOptions: [],
      importMethod: 'put',
      // 表头
      columns: [
        {
          width: 150,
          ellipsis: true,
          title: '员工姓名',
          align: 'center',
          dataIndex: 'empName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '身份证号',
          align: 'center',
          dataIndex: 'empIdcardNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'settlementOrganNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '结算主体名称',
          align: 'center',
          dataIndex: 'settlementOrganName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
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
          width: 220,
          ellipsis: true,
          title: '险种',
          align: 'center',
          dataIndex: 'insuranceTypeName',
          customRender: text => {
            return <a-tag color="cyan">{{ text }}</a-tag> || '-'
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '购买标准',
          align: 'center',
          dataIndex: 'buyStandard',
          customRender: text => {
            const resultText = <a-tag color="orange">{{ text }}</a-tag> || '-'
            return resultText
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '办理状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          width: 140,
          ellipsis: true,
          title: '派单人',
          align: 'center',
          dataIndex: 'createUser',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '派单类型',
          align: 'center',
          dataIndex: 'fromEmpName',
          scopedSlots: { customRender: 'fromEmpName' }
        },
        {
          width: 120,
          ellipsis: true,
          title: '是否有效',
          align: 'center',
          dataIndex: 'validFlag',
          scopedSlots: { customRender: 'validFlag' }
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
          width: 170,
          title: '操作',
          key: 'operation',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        add: '/busiInsurance/thandleinfo', //添加
        list: '/busiInsurance/tbusinessinsurance/handle/page', //列表请求地址
        delete: '/busiInsurance/thandleinfo/', //删除
        queryAllInfoById: '/busiInsurance/tbusinessinsurance/', //详情
        exportHandle: '/busiInsurance/tbusinessinsurance/exportHandle', //导出办理
        templateUrl: 'busiInsurance/', //下载模板路径
        importPolicynoFee: '/busiInsurance/tbusinessinsurance/batchPolicyNoAndFee', //批量保单号与保费
        importBatchUpdate: '/busiInsurance/tbusinessinsurance/batchUpdate', //批量更新
        importBatchDomain: '/busiInsurance/tbusinessinsurance/batchSettleDepartMent', //批量结算主体
        handleFaild: '/busiInsurance/tbusinessinsurance/handleSucessToFail'
      }
    }
  },
  watch: {
    $route: function(val) {
      console.log(val.query, 11)
    },
    queryParam: function(val) {
      if (!val.createTimeStart) {
        this.rangeTime = null
      }
    }
  },
  mounted() {
    if (this.$route.query && JSON.stringify(this.$route.query) != '{}') {
      this.queryParam = Object.assign(this.queryParam, this.$route.query)
      this.loadData()
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    // 模板
    handleDownloadTemplate(templateUrl) {
      const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
      window.location.href = url
    },
    filterDictText,
    // 修改保单号
    handleAmend: function(record) {
      this.$refs.InsuranceAmendmentModalForm.title = '修改保单号办理'
      this.$refs.InsuranceAmendmentModalForm.edit(record)
    },
    changeRange(value, dateString) {
      this.queryParam.createTimeStart = dateString[0]
      this.queryParam.createTimeEnd = dateString[1]
    },
    getCalendarContainer(triggerNode) {
      let wid = getComputedStyle(triggerNode).width
      triggerNode.setAttribute('style', 'width:' + wid)
      return triggerNode.parentNode
    },
    //批量上传 上传进度
    batchUplods() {
      const randomStr = this.$store.getters.userInfo.id + randomString()
      this.$refs.BatchUplodsModalForm.url.importUrl = `/busiInsurance/tbusinessinsurance/batchPolicyNoAndFee?random=${randomStr}`
      this.$refs.BatchUplodsModalForm.url.method = 'PUT'
      this.$refs.BatchUplodsModalForm.show(randomStr)
    },
    // 批量委托办理
    handleBatchDelegate: function() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请先选择要委托办理的员工')
        return false
      }
      this.$refs.AssignmentModalForm.title = '批量委托办理'
      this.$refs.AssignmentModalForm.formtext = '办理人'
      this.$refs.AssignmentModalForm.id = this.selectedRowKeys
      this.$refs.AssignmentModalForm.pession = 'wxhr:insurance_batch_delegate'
      this.$refs.AssignmentModalForm.url.submitApplyUrl = '/busiInsurance/tbusinessinsurance/batchDelegate'
      this.$refs.AssignmentModalForm.edit()
    },
    //委托办理
    handleDelegate: function(record) {
      this.$refs.AssignmentModalForm.title = '委托办理'
      this.$refs.AssignmentModalForm.formtext = '办理人'
      this.$refs.AssignmentModalForm.id = record.id
      this.$refs.AssignmentModalForm.pession = 'wxhr:tbusinessinsurance_delegate'
      this.$refs.AssignmentModalForm.url.submitApplyUrl = '/busiInsurance/tbusinessinsurance/delegate'
      this.$refs.AssignmentModalForm.edit()
    },
    // 编辑
    handleEdit: function(record) {
      this.$refs.DispatchApplyEditModalForm.title = '编辑'
      this.$refs.DispatchApplyEditModalForm.edit({
        policyNo: record.policyNo,
        buyPay: record.buyPay,
        invoiceNo: record.invoiceNo,
        empIdcardNo: record.empIdcardNo,
        buyStandard: record.buyStandard,
        id: record.id,
        status: record.status
      })
    },
    //办理失败弹窗
    handleFaild(record) {
      this.businessInsuranceId = record.id
      this.faildVisible = true
    },
    handleFaildOk() {
      const _this = this
      // 触发表单验证
      this.faildForm.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          values.auditStatus = 2
          values.businessInsuranceId = _this.businessInsuranceId
          httpAction(_this.url.handleFaild, values, 'put')
            .then(res => {
              if (Number(res.code) === 200) {
                _this.$message.success('操作成功！')
                _this.faildVisible = false
                _this.loadData()
              } else {
                _this.$message.warning(res.msg)
              }
            })
            .finally(() => {
              _this.confirmLoading = false
            })
        }
      })
    },
    handleFaildCancel() {
      this.confirmLoading = false
      this.faildForm.resetFields()
      this.businessInsuranceId = ''
      this.faildVisible = false
    },
    //商险办理
    handleInsurance: function(record) {
      this.$refs.SubmitApplyModalForm.id = record.id
      this.$refs.SubmitApplyModalForm.type = '0'
      this.$refs.SubmitApplyModalForm.edit()
    },
    handleSettlemet: function(record) {
      this.$refs.InsuranceSettlemetModalForm.title = '商险结算'
      this.$refs.InsuranceSettlemetModalForm.settleTypeOptions = this.settleTypeOptions
      this.$refs.InsuranceSettlemetModalForm.edit(record)
    },
    //替换
    handleReplace(record) {
      this.$refs.EmployeeListModalForm.id = record.id
      this.$refs.EmployeeListModalForm.empId = record.empId
      this.$refs.EmployeeListModalForm.add()
    },
    //上传附件
    attachUpload(record) {
      this.$refs.DispatchApplyUploadModalForm.insuranceId = record.id
      this.$refs.DispatchApplyUploadModalForm.add()
    },
    //批量办理
    handleBatch: function() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请先选择要批量办理的数据')
        return false
      }
      this.$refs.SubmitApplyModalForm.type = '1'
      this.$refs.SubmitApplyModalForm.id = this.selectedRowKeys
      this.$refs.SubmitApplyModalForm.edit()
    },
    //导出办理
    exportHandle: function() {
      this.$refs.DispatchApplyExportModal.title = '导出办理'
      this.$refs.DispatchApplyExportModal.url.exportXlsUrl = this.url.exportHandle
      this.$refs.DispatchApplyExportModal.url.exportFields =
        '/busiInsurance/tbusinessinsurance/getHandleExportFieldName'
      this.$refs.DispatchApplyExportModal.params = this.getQueryParams() //查询条件
      this.$refs.DispatchApplyExportModal.add(this.selectedRowKeys)
    },
    // 详情
    handleDetail: function(record) {
      this.$refs.DispatchApplyDetailForm.title = '详情'
      this.$refs.DispatchApplyDetailForm.statusName = filterDictText(this.statusOptions, record.status)
      this.$refs.DispatchApplyDetailForm.buyTypeName = filterDictText(this.buyTypeOptions, record.buyType)
      this.$refs.DispatchApplyDetailForm.settleType = filterDictText(this.settleTypeOptions, record.settleType)
      // this.$refs.DispatchApplyDetailForm.settleDomainBelongs = this.settleDomainOptions
      this.$refs.DispatchApplyDetailForm.isDelAttach = false
      this.$refs.DispatchApplyDetailForm.edit(record)
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
      // 结算主体和所属单位
      // getAllSettleDomainSelectVos().then(res => {
      //   if (res.code === 200) {
      //     this.settleDomainOptions = res.data
      //   } else {
      //     this.$message.error('结算主体和所属单位数据请求失败！')
      //   }
      // })
      //结算类型
      initDictOptions('settlementType').then(res => {
        if (res.code === 200) {
          this.settleTypeOptions = res.data
        }
      })
      initDictOptions('insurance_buyType').then(res => {
        if (res.code === 200) {
          this.buyTypeOptions = res.data
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
