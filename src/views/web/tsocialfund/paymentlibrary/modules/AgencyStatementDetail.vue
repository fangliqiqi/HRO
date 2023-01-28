<template>
  <a-modal
    :title="title"
    :width="1200"
    placement="right"
    @cancel="handleCancel"
    :closable="true"
    :visible="visible"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >取消</a-button>

      <a-button
        type="primary"
        @click="handlExport"
        :loading="downloading"
      >导出</a-button>
      <a-button
        type="primary"
        key="save"
        :loading="saveDownloading"
        @click="handleSubmit"
        v-if="status == 0"
        v-has="'wxhr:tagent_doSubmit'"
      >保存并提交</a-button>
      <a-button
        type="primary"
        key="save"
        @click="handleCheck"
        v-if="status == 1"
      >审核</a-button>
    </template>
    <a-card
      :bordered="false"
      style="background:#f5f5f5"
    >
      <a-tabs
        :activeKey="activityKey"
        @change="changeTab"
      >
        <a-tab-pane
          tab="缴费明细"
          key="1"
          style="background:white;padding:20px;"
        >
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSourceList"
            :loading="loading"
            :scroll="{ x: 1 }"
          >
            <template
              slot="operation"
              slot-scope="text, record"
            >
              <a @click="detail(record.id)">详情</a>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane
          tab="缴费差额明细"
          key="2"
          :forceRender="true"
          class="balanceDetailTabPane"
        >
          <!-- 查询区域 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="24">
                <a-col
                  :md="6"
                  :sm="8"
                >
                  <a-form-item label="缴纳月份">
                    <j-month
                      :format="'YYYYMM'"
                      style="width: 100%"
                      v-model="balanceQueryParam.payMonth"
                      placeholder="请选择缴纳月份"
                    />
                  </a-form-item>
                </a-col>
                <a-col
                  :md="6"
                  :sm="8"
                >
                  <a-form-item label="姓名">
                    <a-input
                      allowClear
                      placeholder="请输入姓名"
                      v-model="balanceQueryParam.empName"
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
                      v-model="balanceQueryParam.empIdcard"
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
                      @click="balanceSearchQuery"
                      icon="search"
                    >查询</a-button>
                    <a-button
                      type="primary"
                      @click="balanceSearchReset"
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
              icon="minus"
              @click="batchRemove"
              :disabled="!selectedRowKeys.length"
            >批量移除</a-button>
          </div>
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
            :columns="balanceColumns"
            :dataSource="balanceDataSource"
            :pagination="balancePagination"
            :loading="balanceLoading"
            @change="handleBalanceTableChange"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          >
            <span
              slot="action"
              slot-scope="text, record"
            >
              <a-popconfirm
                title="确定移除吗?"
                @confirm="handleRemove(record)"
              >
                <a>移除</a>
              </a-popconfirm>
            </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane
          tab="结算表"
          key="3"
          :forceRender="true"
        >
          <agency-settle-account-modal
            ref="settleAccountModal"
            :settlementhFormInfo="settlementhFormInfo"
            :status="status"
          ></agency-settle-account-modal>
        </a-tab-pane>
        <a-tab-pane
          tab="流程进展明细"
          key="4"
          :forceRender="true"
        >
          <agency-statement-progress-modal
            ref="auditProgressModal"
            :agentInfo="agentInfo"
          ></agency-statement-progress-modal>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-modal
      title="客户审核"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleCheckCancel"
      @ok="handleCheckOk"
      cancelText="关闭"
      okText="确定"
      :visible="visibleCheck"
      :confirmLoading="confirmLoading"
      :maskClosable="false"
    >
      <a-form :form="form">
        <a-form-item label="是否通过">
          <a-radio-group
            v-decorator="['status', validatorRules.status ]"
            @change="handleChange"
          >
            <a-radio :value="2">通过</a-radio>
            <a-radio :value="3">不通过</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="审核意见">
          <a-textarea v-decorator="['auditRemark', validatorRules.auditRemark]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-modal>
</template>

<script>
import DetailList from '@/components/tools/DetailList'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction,getAction } from '@/api/manage'
import AgencySettleAccountModal from './AgencySettleAccountModal'
import AgencyStatementProgressModal from './AgencyStatementProgressModal'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import JMonth from '@/components/jeecg/JMonth'
import { filterObj } from '@/utils/util'

const DetailListItem = DetailList.Item

export default {
  name: 'AgencyStatementDetail',
  components: {
      AgencySettleAccountModal,
      AgencyStatementProgressModal,
      DetailListItem,
      DetailList,
      JMonth,
    },
  mixins: [JeecgListMixin],
  data() {
    return {
      title: '',
      visible:false,
      visibleCheck:false,
      detailVisible:false,
      downloading: false,
      saveDownloading:false,
      form:this.$form.createForm(this),
      checkValue:'',
      loading:false,
      confirmLoading:false,
      exportLoading:false,
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      distributionFlagOption:{'0':'未发放','1':'发放成功','2':'发放失败'},
      agentInfo:'', // 传入的列表数据record
      validatorRules:{
        status: { rules: [{ required: true, message: '请审核!' }] },
        auditRemark: { rules: [{ required: true, message: '请输入审核意见!' }] },
      },
      model:{},
      activityKey:'1',
      dataSourceList:[],
      detailData:{},
      coverList:[],
      settlementhFormInfo:{},
      employData:[],
      agentData: [],
      status: '', // 0:代理结算单提交 1:代理结算单审核 2:代理结算单详情
      balanceDataSource:[], // 缴费差额明细
      balanceLoading:false, // 缴费差额加载动画
      balanceQueryParam: {}, // 缴费差额查询参数
      /* 缴费差额分页参数 */
      balancePagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showSizeChanger: true,
        total: 0
      },
      columns:[
        {
          width: 180,
          ellipsis: true,
          title: '部门',
          dataIndex: 'deptName',
          key: 'deptName',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '姓名',
          dataIndex: 'empName',
          key: 'empName',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '单位',
          dataIndex: 'unitName',
          key: 'unitName',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '服务类别',
          dataIndex: 'serviceType',
          key: 'serviceType',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '社保缴纳地',
          dataIndex: 'socialPayAddr',
          key: 'socialPayAddr',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '公积金缴纳地',
          dataIndex: 'providentPayAddr',
          key: 'providentPayAddr',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '身份证号码',
          dataIndex: 'empIdcard',
          key: 'empIdcard',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '缴费月份',
          dataIndex:'socialPayMonth',
          align: 'center',
          key:'socialPayMonth'
        },
        {
          width: 120,
          ellipsis: true,
          title: '缴费基数',
          dataIndex:'unitPensionSet',
          align: 'center',
          key:'unitPensionSet',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '养老单位',
          dataIndex:'unitPensionMoney',
          align: 'center',
          key:'unitPensionMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '养老个人',
          dataIndex:'personalPensionMoney',
          align: 'center',
          key:'personalPensionMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '失业单位',
          dataIndex:'unitUnemploymentMoney',
          align: 'center',
          key:'unitUnemploymentMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '失业个人',
          dataIndex:'personalUnemploymentMoney',
          align: 'center',
          key:'personalUnemploymentMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '医疗单位',
          dataIndex:'unitMedicalMoney',
          align: 'center',
          key:'unitMedicalMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '医疗个人',
          dataIndex: 'personalMedicalMoney',
          align: 'center',
          key: 'personalMedicalMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '大病医疗单位',
          dataIndex: 'unitBigmailmentMoney',
          align: 'center',
          key: 'unitBigmailmentMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '大病医疗个人',
          dataIndex: 'personalBigmailmentMoney',
          align: 'center',
          key: 'personalBigmailmentMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '工伤',
          dataIndex: 'unitInjuryMoney',
          align: 'center',
          key: 'unitInjuryMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '生育',
          dataIndex: 'unitBirthMoney',
          align: 'center',
          key: 'unitBirthMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '单位社保小计',
          dataIndex: 'unitSocialSum',
          align: 'center',
          key: 'unitSocialSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '个人社保小计',
          dataIndex: 'socialSecurityPersonalSum',
          align: 'center',
          key: 'socialSecurityPersonalSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '公积金基数',
          dataIndex: 'unitProvidentSet',
          align: 'center',
          key: 'unitProvidentSet',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '单位缴存额',
          dataIndex: 'unitProvidentSum',
          align: 'center',
          key: 'unitProvidentSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '个人缴存额',
          dataIndex: 'personalProvidentSum',
          align: 'center',
          key: 'personalProvidentSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '单位合计',
          dataIndex: 'unitSum',
          align: 'center',
          key: 'unitSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '个人合计',
          dataIndex: 'personalSum',
          align: 'center',
          key: 'personalSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '服务费',
          dataIndex: 'managementFee',
          align: 'center',
          key: 'managementFee',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '社保号码',
          dataIndex: 'socialSecurityNo',
          align: 'center',
          key: 'socialSecurityNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '合计',
          dataIndex: 'allSum',
          align: 'center',
          key: 'allSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
      ],
      balanceColumns: [
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
          width: 150,
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
      ], // 差额明细列
      url:{
        list:'/salary/tsalarystandard/auditSalaryStandardPage',
        doAuditUrl:'/hrSocial/tagent/doAudit',
        openBill:'/hrSocial/tagent/',
        doExportUrl:'/salary/salary/doExportSalary',
        doSubmit: '/hrSocial/tagent/doSubmit',
        getSalaryFrom:'busiInsurance/forecastbuypayform/salaryFrom/',
        balanceListUrl: '/hrSocial/tpaymentdiff/page', // 缴费差额明细列表数据
        batchRemoveUrl:'/hrSocial/tagent/removePaymentDiffByIds', // 缴费差额明细 移除，批量移除
      }
    }
  },

  methods: {
    // 展示当前模块显示
    show(record) {
      // 组装url地址
      this.agentInfo = record
      const url = this.url.openBill + record.id
      httpAction(url,{},'GET').then((res) => {
        if(Number(res.code) === 200){
          this.agentData = res.data
          this.settlementhFormInfo = res.data.agent
          this.dataSourceList = res.data.paymentList
          this.visible = true
        }
      })
      this.loadBalanceDataList(1)
    },
    // 取消弹框
    handleCancel() {
      if(String(this.status) === '0'){
        this.$emit('ok')
      }
      this.close()
    },
    // 封装关闭方法
    close() {
      this.$emit('close')
      this.activityKey = '1'
      this.balancePagination.current = 1
      this.balancePagination.pageSize = 10
      this.balancePagination.total = 0
      this.balanceQueryParam = {}
      this.balanceLoading = false
      this.loading = false
      this.visible = false
    },
    // 点击查询按钮
    balanceSearchQuery() {
      this.loadBalanceDataList(1)
    },
    // 点击重置
    balanceSearchReset() {
      this.balanceQueryParam = {}
      this.loadBalanceDataList(1)
    },
    // 获取查询参数
    balanceGetQueryParams() {
      //获取查询条件
      const param = Object.assign({}, this.balanceQueryParam)
      param.current = this.balancePagination.current
      param.size = this.balancePagination.pageSize
      param.formId = this.agentInfo.id
      return filterObj(param)
    },
    //分页、排序、筛选变化时触发
    handleBalanceTableChange(pagination) {
      this.balancePagination = pagination
      this.loadBalanceDataList()
    },
    // 获取缴费差额明细列表数据
    loadBalanceDataList(currentPage){
      if (currentPage === 1) {
        this.balancePagination.current = 1
      }
      const param = this.balanceGetQueryParams()
      const that = this
      that.balanceLoading = true
      getAction(this.url.balanceListUrl, param).then(res => {
        if (Number(res.code) === 200) {
          that.balanceDataSource = res.data.records
          that.balancePagination.current = res.data.current
          that.balancePagination.total = res.data.total
        } else {
          that.balancePagination.total = 0
          that.$message.error('获取数据失败！')
        }
        that.balanceLoading = false
      })
    },
    // 缴费差额明细列表移除按钮点击事件
    handleRemove(record){
      this.transferRemoveInterface(record.id)
    },
    // 批量移除
    batchRemove(){
      const resultStr = this.selectedRowKeys.join(',')
      this.transferRemoveInterface(resultStr)
    },
    // 调取移除、批量移除接口
    transferRemoveInterface(idStr){
      const that = this
      that.balanceLoading = true
      const url = `${this.url.batchRemoveUrl}?formId=${that.agentInfo.id}&ids=${idStr}`
      httpAction(url,{},'GET').then((res) => {
        if(Number(res.code) === 200){
          that.balanceLoading = false
          that.selectedRowKeys = []
          that.loadBalanceDataList()
          // 更新结算单
          that.settlementhFormInfo = res.data
        }else {
          that.balanceLoading = false
          that.$message.error(res.msg || '移除失败！')
        }
      })
    },
    handleCheck(){
      this.visibleCheck = true
    },
    // 取消弹框显示
    handleCheckCancel() {
      this.visibleCheck = false
    },
    // 提交审核
    handleCheckOk() {
      // 开始加载框
      this.confirmLoading = true
      // 先进行表单验证
      this.form.validateFields((err,values) => {
        if(!err){
          // 获取表单数据
          const formData = Object.assign(this.model, values)
          // 赋值主表id
          formData.id = this.agentInfo.id
          httpAction(this.url.doAuditUrl,formData,'POST').then((res) => {
            this.confirmLoading = false
            if(Number(res.code) === 200){
              this.$message.success("审核成功")
              this.visibleCheck = false
              this.visible = false
              this.$emit('ok')
              this.form.resetFields()
            }else{
              this.$message.error(res.msg)
            }
          })
        }else{
          this.confirmLoading = false
        }
      })
    },
    // 提交
    handleSubmit(){
      this.saveDownloading = true
      httpAction(this.url.doSubmit,{'id': this.agentInfo.id},'POST').then((res) => {
        this.saveDownloading = false
        if(Number(res.code) === 200){
          this.close()
          this.$emit('ok')
          this.$message.success("保存成功")
        }
      })
    },
    // 处理表格中显示的数字
    handleTextShow(text){
      let result = text
      if(text){
        result = parseFloat(text*-1).toFixed(2)
      }else if(text === null || text === undefined) {
        result = '-'
      }
      return result
    },
    // 导出
    handlExport(){
      this.downloading = true
      let settleForm = this.settlementhFormInfo
      // 结算单数据 和缴费差额数据
      
      let settelData = [
        {'index':settleForm.settleMonth + '结算单','data':'','project':'','money':'','account':' '},
        {'index':'结算名称:','data':settleForm.deptName,'project':'','money':'','account':' '},
        {'index':'结算编码:','data':settleForm.deptNo,'project':'','money':'','account':' '},
        {'index':'结算时间:','data':settleForm.settleMonth,'project':'','money':'','account':' '},
        {'index':'序号','data':'费用项目','project':'','money':'金额','account':'开票额小计'},
        {'index':1,'data':settleForm.settleMonth,'project':'应缴单位社保','money':settleForm.unitSocial,'account':settleForm.unitSocialTicket},
        {'index':2,'data':'','project':'应缴个人社保','money':settleForm.personSocial,'account':settleForm.personSocialTicket},
        {'index':3,'data':settleForm.settleMonth,'project':'应缴单位公积金','money':settleForm.unitFund,'account':settleForm.unitFundTicket},
        {'index':4,'data':'','project':'应缴个人公积金','money':settleForm.personFund,'account':settleForm.personFundTicket},

        {'index':5,'data':'缴费差额','project':'单位社保','money':this.handleTextShow(settleForm.socialSecurityCompanySum),'account':this.handleTextShow(settleForm.socialSecurityCompanySum)},
        {'index':6,'data':'','project':'个人社保','money':this.handleTextShow(settleForm.socialSecurityPersonalSum),'account':this.handleTextShow(settleForm.socialSecurityPersonalSum)},
        {'index':7,'data':'','project':'单位公积金','money':this.handleTextShow(settleForm.providentCompanyDiff),'account':this.handleTextShow(settleForm.providentCompanyDiff)},
        {'index':8,'data':'','project':'个人公积金','money':this.handleTextShow(settleForm.providentPersonalDiff),'account':this.handleTextShow(settleForm.providentPersonalDiff)},
        {'index':9,'data':'','project':'管理费','money':this.handleTextShow(settleForm.manageDiff),'account':this.handleTextShow(settleForm.manageDiff)},
        {'index':10,'data':'','project':'其他费用','money':this.handleTextShow(settleForm.otherDiff),'account':this.handleTextShow(settleForm.otherDiff)},
      ]
      let num = 11
      settelData.push({'index':num++,'data':'服务人数','project':'','money':settleForm.personNum,'account':''})
      settelData.push({'index':num++,'data':'服务人次','project':'','money':settleForm.personCount,'account':''})
      settelData.push({'index':num++,'data':'管理费','project':'','money':settleForm.management,'account':settleForm.managementTicket})
      settelData.push({'index':num++,'data':'开票金额合计','project':'','money':'','account': settleForm.settleMoney})

      settelData.push({'index':"",'data':'','project':'','money':"",'account':''})
      settelData.push({'index':"",'data':'','project':'','money':"",'account':''})

      settelData.push({'index':"发票类型",'data':'扣除金额','project':'不含税收入','money':"税额",'account':'发票合计金额'})
      settelData.push({'index':"普通发票",'data':settleForm.oneMoney,'project':settleForm.oneIncome,'money':settleForm.oneTax,'account':settleForm.oneTicket})
      settelData.push({'index':"专用发票",'data':settleForm.twoMoney,'project':settleForm.twoIncome,'money':settleForm.twoTax,'account':settleForm.twoTicket})

      settelData.push({'index':"",'data':'','project':'','money':"",'account':''})
      settelData.push({'index':"",'data':'','project':'','money':"",'account':''})

      settelData.push({'index':"公司地址",'data':'纳税识别号','project':'公司开户行','money':"账号",'account':'联系电话'})
      settelData.push({'index':settleForm.addr,'data':settleForm.taxpayerIdentificationNo,'project':settleForm.bankName,'money':settleForm.bankNo,'account':settleForm.phone})

      settelData.push({'index':"",'data':'','project':'','money':"",'account':''})
      settelData.push({'index':"",'data':settleForm.remark,'project':'','money':"",'account':''})
      let i = 1
      for(let d in this.dataSourceList){
        this.dataSourceList[d]['num'] = i
        i++
      }
      var excelDatas = [
        {
          tHeader: ["序号",null,"费用项目", "金额", "开票额小计"],
          filterVal: ['index','data',"project", "money", "account"],
          tableDatas: settelData,
          sheetName: "结算单"
        },
        {
          tHeader: ['序号', '部门', '姓名', '单位','服务类别','社保缴纳地','公积金缴纳地','身份证号码','缴费月份','缴费基数',"养老单位(16％)",
          "养老个人(8％)",	"失业单位(0.05％)",	"失业个人(0.5％)",	'医疗单位(6.9%)',	'医疗个人(2%)',	'大病医疗单位',	'大病医疗个人',	"工伤(0.2%)",	"生育(0%)",
          '单位社保小计',	'个人社保小计',	'公积金基数',	'单位缴存额',	'个人缴存额',	'单位合计',	'个人合计',	'服务费',	'社保号码',	'补退历史差额',	'合计',																																																																																																																																																																																																					
        ],
          filterVal: ['num','deptName','empName', 'unitName','serviceType','socialPayAddr','providentPayAddr','empIdcard','socialPayMonth','unitPensionSet','unitPensionMoney',
          'personalPensionMoney','unitUnemploymentMoney','personalUnemploymentMoney','unitMedicalMoney','personalMedicalMoney','unitBigmailmentMoney','personalBigmailmentMoney','unitInjuryMoney','unitBirthMoney',
          'unitSocialSum','socialSecurityPersonalSum','unitProvidentSet','unitProvidentSum','personalProvidentSum','unitSum','personalSum','managementFee','socialSecurityNo','','allSum'
          ],
          tableDatas: this.dataSourceList,
          sheetName: "结算主体明细"
        },
      ];

      let excelName = settleForm.settleMonth + settleForm.deptName + "代理结算单" + settleForm.deptNo + '(' + settleForm.settleMoney + ')'
      this.json2excel(excelDatas, excelName, true, "xlsx")
      this.downloading = false
    },
    json2excel(tableJson, filenames, autowidth, bookTypes){
      var that = this
      //这个是引用插件
      import("@/vendor/AgentExcel").then(excel => {
        var tHeader = []
        var dataArr = []
        var sheetnames = []
        for (var i in tableJson) {
          tHeader.push(tableJson[i].tHeader)
          dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
          sheetnames.push(tableJson[i].sheetName)
        }
        console.log(dataArr)
        excel.export_json_to_excel_more_sheet({
          header: tHeader,
          data: dataArr,
          sheetname: sheetnames,
          filename: filenames,
          autoWidth: autowidth,
          bookType: bookTypes,
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    // 客户审核点击通过或不通过
    handleChange(e) {
      this.checkValue = e.target.value
      if(String(e.target.value) === '3'){
        this.validatorRules.remark = { rules: [{ required: true, message: '请输入审核意见!' }] }
      }else{
        this.validatorRules.remark = {}
      }
    },
    // 关闭工资明细详情
    handleDetailOk(){
      this.detailVisible = false
    },
    // 关闭工资明细详情
    handleDetailCancel(){
      this.detailVisible = false
    },
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then((res) => {
        if (Number(res.code) === 200) {
          this.bankOptions = res.data
        }
      })
    },
    // 切换tab
    changeTab(key){
      this.activityKey = key
      // 切换到结算单tab
      if(Number(key) === 3){
        this.$refs.settleAccountModal.show(this.status)
      }
      // 切换到结算流程tab
      if(Number(key) === 4){
        this.$refs.auditProgressModal.show()
      }
    },
  }
}
</script>
<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 110px;
  }
}
.balanceDetailTabPane {
  background: white;
  padding: 20px;
  .table-operator {
    margin-bottom: 18px;
  }
}
</style>
