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
            <a-form-item label="结算主体编码">
              <a-input
                allowClear
                placeholder="请输入结算主体编码"
                v-model="queryParam.departNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体名称">
              <a-input
                allowClear
                placeholder="请输入结算主体名称"
                v-model="queryParam.departName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户名称">
              <a-input
                allowClear
                placeholder="请输入客户名称"
                v-model="queryParam.customerName"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="客户编码">
                <a-input
                  placeholder="请输入客户编码"
                  v-model="queryParam.customerCode"
                ></a-input>
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

    <div class="table-operator">
      <a-button
        @click="handleUpload"
        type="primary"
        icon="upload"
        v-has="'wxhr:tsettledomain_doexport'"
      >导出</a-button>
      <a-button
        @click="handleUploadBack"
        type="primary"
        icon="upload"
        v-has="'wxhr:tsettledomain_countExport'"
      >回访材料导出</a-button>

    </div>
    <!-- table区域-begin -->
    <div>
      <div
        class="ant-alert ant-alert-info"
        style="margin-bottom: 16px;"
      >
        已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length }}</a>项
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
        @change="handleTableChange"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :scroll="{ x: 1}"
        :customRow="customRow"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">查看</a>
          <a-divider type="vertical"/>
          <a @click="handleEdit2(record)">修改</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多<a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleCustomerService(record)">分配权限</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleAddDockingPeople(record)">对接信息</a>
              </a-menu-item>
              <a-menu-item v-have="'wxhr:tcustomerstop_add'">
                <a @click="handleStop(record)" >停止合作</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
        <span
          slot="dpAuditFlag"
          slot-scope="text,record"
        >
          <a-tag
            v-if="record.dpAuditFlag == 0"
            color="green"
          >审核通过</a-tag>
          <a-tag
            v-if="record.dpAuditFlag == 1"
            color="red"
          >审核不通过</a-tag>
          <a-tag
            v-if="record.dpAuditFlag == 2"
            color="cyan"
          >待审核</a-tag>
          <a-tag
            v-if="record.dpAuditFlag == 3"
            color="orange"
          >待提交</a-tag>
        </span>
        <span
          slot="labelScoped"
          slot-scope="text, record"
        >
          <span v-if="record.serverItem != null">
            <a-tag
              v-for="(tag, index) in record.serverItem.split(',')"
              :key="index"
            >{{ tag }}</a-tag>
          </span>
          <span v-else> - </span>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <settle-domain-all-edit-modal
      ref="domainAllEditModal"
      @ok="domainAllEditModalOk"
    ></settle-domain-all-edit-modal>
    <settle-domain-edit-modal
      ref="SettleEditModal"
      @ok="domainAllEditModalOk"
    ></settle-domain-edit-modal>

    <settle-domain-all-detail-modal ref="allDetailModal"></settle-domain-all-detail-modal>
    <assignation-customer-service-modal
      ref="serviceModal"
      @ok="serviceModalOk"
    ></assignation-customer-service-modal>
    <export-sort-field-modal ref="ExportSortFieldModalForm"></export-sort-field-modal>
    <customer-contract-detail-modal ref="ContractDetailModal"></customer-contract-detail-modal>
    <customer-all-detail-modal ref="CustomerAllDetailModal"></customer-all-detail-modal>
    <stop-coopera-modal ref="StopCooperaModal" @ok="domainAllEditModalOk"></stop-coopera-modal>
    <docking-people-modal
      ref="dockingPeopleModal"
      @ok="dockingPeopleModalOk"
    ></docking-people-modal>
    <a-modal
      title="选择月份"
      :visible="mounthVisible"
      :confirm-loading="confirmLoading"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
      :destroyOnClose="true"
    >
      <a-form
        :form="form"
        layout="inline"
      >
        <a-form-item label="月份">
          <a-month-picker
            placeholder="请选择月份"
            format="YYYYMM"
            v-decorator="['createMonth',{initialValue:moment(moment().subtract(1, 'months'),'YYYYMM')}]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import SettleDomainModal from './modules/SettleDomainModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterOrganDict1 } from '@/utils/customDict'
import { initDictOptions, filterDict } from '@/components/dict/JDictSelectUtil'
import { httpAction } from '@/api/manage'
import SettleDomainAllEditModal from './modules/SettleDomainAllEditModal'
import SettleDomainAllDetailModal from './modules/SettleDomainAllDetailModal'
import AssignationCustomerServiceModal from './modules/AssignationCustomerServiceModal'
import SettleDomainEditModal from './modules/SettleDomainEditModal'
import { getAreaData } from '@/utils/common'
import ExportSortFieldModal from '../global/modules/ExportSortFieldModal'
import Vue from 'vue'
import CustomerContractDetailModal from '../tcustomercontract/modules/CustomerContractDetailModal'
import CustomerAllDetailModal from '../tcustomerunit/modules/CustomerAllDetailModal'
import SelectPage from '@/components/jeecg/SelectPage'
import DockingPeopleModal from  './modules/DockingPeopleModal'
import StopCooperaModal from '../global/modules/StopCooperaModal'
import moment from "moment"

export default {
  name: 'SettleDomainSearchList',
  mixins: [JeecgListMixin],
  components: {
    AssignationCustomerServiceModal,
    SettleDomainAllDetailModal,
    SettleDomainAllEditModal,
    SettleDomainModal,
    ExportSortFieldModal,
    CustomerContractDetailModal,
    CustomerAllDetailModal,
    SettleDomainEditModal,
    SelectPage,
    DockingPeopleModal,
    StopCooperaModal
  },
  data() {
    return {
      description: '结算主体新建列表页面',
      sysUsers: [],
      organs: [],
      organAll: [],
      treeData: [],
      customerContracts: [],
      businessSubDicts: [],
      businessTypeDicts: [],
      customerDicts: [],
      contractDicts: {},
      exportFields: [
        '客户名称','商务主体','业务类型','业务细分','社保卡收取',
        '管理费是否收费','管理费收取项目','风险金收取项目','管理费费率/管理费金额','管理费收费类型',
        '风险金是否收取','风险金收取费用/税率','风险金收取方式','缴税类型','风险金税收类型',
        '管理费税收类型','单位大病比例','缴税税率','管理费是否扣税','社保结算时间',
        '公积金结算时间','工资发放时间','客户每月到表时间','工资每月发放时间','首次结算时间',
        '合同约定到款时间','商险配置_是否收取管理费','商险管理费收取方式','商险管理费收取值','商险管理费收取比率',
        '交税类型','交税值','管理费税收是否含税','福利购买地','保险类型',
        '其他福利','客户开票名称','我司到款单位名称','结算主体名称','结算主体编码',
        '所在省','所在市','所在县','是否是新业务','新业务备注',
        '创建人','创建时间','服务审核转态','审核人姓名','服务项目',
        '收入归属','收入归属细分'
      ],
      visitExportField: [
        '合同主体','责任部门','业务类型','服务客服','对接信息备注',
        '省','市','县','客户单位','结算主体',
        '对接人','职位','服务项目','办公电话','手机',
        '工资发放方式','工资发放时间（每月*号）','服务人数','客户所在省','客户所在市',
        '客户所在县','客户单位地址','结算主体审核状态','合作状态','客户创建时间',
        '停止时间','停止理由','首次结算时间','结算主体创建人','结算主体创建时间',
        '结算主体首次审核通过时间'
      ],
      // 表头
      columns: [
        {
          width: 150,
          ellipsis: true,
          title: '结算主体名称',
          align: 'center',
          dataIndex: 'departName',
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'departNo',
          width: 120,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'customerName',
          width: 160,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>
                {resultText}
              </a-tooltip>
            )
          }
        },
        {
          title: '客户编码',
          align: 'center',
          dataIndex: 'customerCode',
          width: 120,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>
                {resultText}
              </a-tooltip>
            )
          }
        },
        {
          width: 90,
          ellipsis: true,
          title: '创建人',
          align: 'center',
          dataIndex: 'createUserName',
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          width: 150,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '审核状态',
          align: 'center',
          dataIndex: 'dpAuditFlag',
          scopedSlots: { customRender: 'dpAuditFlag' },
          width: 100
        },
        {
          title: '合同主体',
          align: 'center',
          dataIndex: 'contractName',
          width: 250,
          ellipsis: true,
          customRender: text => {
            return (
              <a-tooltip>
                <template slot="title">{text}</template>
                <a-tag color="cyan" class="contract">
                  {text}
                </a-tag>
              </a-tooltip>
            )
          }
        },
        {
          title: '服务项目',
          align: 'center',
          dataIndex: 'serverItem',
          scopedSlots: { customRender: 'labelScoped' },
          width: 200
        },
        {
          width: 160,
          ellipsis: true,
          title: '收入归属',
          align: 'center',
          dataIndex: 'incomeBelong',
          customRender: text => {
            const income = filterOrganDict1(this.organAll, text)
            return (
              <a-tooltip placement="topLeft" title={income}>
                {income}
              </a-tooltip>
            )
          }
        },
        {
          title: '收入归属细分',
          align: 'center',
          dataIndex: 'incomeBelongSub',
          width: 160,
          ellipsis: true,
          customRender: text => {
            const income = filterOrganDict1(this.organAll, text)
            return (
              <a-tooltip placement="topLeft" title={income}>{income}</a-tooltip>
            )
          }
        },
        {
          title: '业务类型',
          align: 'center',
          dataIndex: 'businessType',
          width: 100,
          ellipsis: true,
          customRender: text => {
            const businessType = filterDict(this.businessTypeDicts, text)
            return (
              <a-tooltip placement="topLeft" title={businessType}>
                {businessType}
              </a-tooltip>
            )
          }
        },
        {
          title: '业务细分',
          align: 'center',
          width: 150,
          dataIndex: 'businessSub',
          customRender: text => {
            const businessSub = filterDict(this.businessSubDicts, text)
            return (
              <a-tooltip placement="topLeft" title={businessSub}>
                {businessSub}
              </a-tooltip>
            )
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
          width:200,
        }
      ],
      url: {
        list: '/hrBase/tsettledomain/page?selectType=0',
        getSysUsers: '/admin/user/userDic',
        getOrgan: '/admin/organizationinfo/getOrgForCus?type=1',
        getContract: '/hrBase/tcustomercontract/getOwnContract',
        getOne: '/hrBase/tsettledomain/',
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        getOrganAll: '/admin/organizationinfo/getOrgForCus?type=0',
        selectOneVo: '/hrBase/tsettledomain/vo/',
        getContractById: '/hrBase/tcustomercontract/',
        getCustomerById: '/hrBase/tcustomerinfo/vo/'
      },
      form: this.$form.createForm(this),
      mounthVisible: false,
      confirmLoading: false
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {
    this.getSysUsers()
    this.loadOrganAll()
    this.loadCustomerContract()
    this.loadCustomerTreeData()
    this.initDictOptions()
    this.getCustomerDicts()
    this.getDicts()
  },
  methods: {
    handleStop(record){
      this.$refs.StopCooperaModal.showModal(record,2)
    },
    moment,
    getDicts() {
      initDictOptions('customer_contract_type').then(res => {
        if (res.code === 200) {
          this.contractDicts.contractTypeDicts = res.data
        }
      })
      initDictOptions('customer_business_type').then(res => {
        if (res.code === 200) {
          this.contractDicts.businessTypeDicts = res.data
        }
      })
      initDictOptions('customer_business_sub_type').then(res => {
        if (res.code === 200) {
          this.contractDicts.businessSubDicts = res.data
        }
      })
    },
    getCustomerDicts() {
      initDictOptions('industryBelong').then(res => {
        if (res.code === 200) {
          this.customerDicts.industryBelongDictOptions = res.data
        }
      })
      initDictOptions('industrySub').then(res => {
        if (res.code === 200) {
          this.customerDicts.industrySub = res.data
        }
      })
      initDictOptions('nature').then(res => {
        if (res.code === 200) {
          this.customerDicts.natureDictOptions = res.data
        }
      })
    },
    customRow(record) {
      // console.log(record)
      return {
        on: {
          click: event => {
            if (event.target.className && /contract/.test(event.target.className)) {
              httpAction(this.url.getContractById + record.belongContract, null, 'get').then(res => {
                if (Number(res.code) === 200) {
                  this.$refs.ContractDetailModal.title = '客户合同查看'
                  this.$refs.ContractDetailModal.treeData = this.treeData
                  this.$refs.ContractDetailModal.organs = this.organAll
                  this.$refs.ContractDetailModal.customerContractDict = this.contractDicts.contractTypeDicts
                  this.$refs.ContractDetailModal.customerBusinessTypeDict = this.contractDicts.businessTypeDicts
                  this.$refs.ContractDetailModal.customerBusinessSubTypeDict = this.contractDicts.businessSubDicts
                  this.$refs.ContractDetailModal.show(res.data)
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else if (event.target.className && /customer/.test(event.target.className)) {
              this.$refs.CustomerAllDetailModal.treeData = this.treeData
              this.$refs.CustomerAllDetailModal.industryBelongs = this.customerDicts.industryBelongDictOptions
              this.$refs.CustomerAllDetailModal.industrySub = this.customerDicts.industrySub
              this.$refs.CustomerAllDetailModal.customerNatures = this.customerDicts.natureDictOptions
              this.$refs.CustomerAllDetailModal.areaTrees = Vue.ls.get('glob_area')
              this.$refs.CustomerAllDetailModal.title = '客户详情'
              this.$refs.CustomerAllDetailModal.contractTypeDicts = this.contractDicts.contractTypeDicts
              this.$refs.CustomerAllDetailModal.businessTypeDicts = this.contractDicts.businessTypeDicts
              this.$refs.CustomerAllDetailModal.businessSubDicts = this.contractDicts.businessSubDicts
              this.$refs.CustomerAllDetailModal.organs = this.organAll
              httpAction(this.url.getCustomerById + record.customerId, null, 'GET').then(res => {
                this.$refs.CustomerAllDetailModal.edit(res.data)
              })
            }
          }
        }
      }
    },
    handleAddDockingPeople(record) {
      this.$refs.dockingPeopleModal.title = '对接信息'
      this.$refs.dockingPeopleModal.organAll = this.organAll
      this.$refs.dockingPeopleModal.add(record)
    },
    dockingPeopleModalOk() {
      this.loadData()
    },
    handleEdit(record) {
      this.$refs.domainAllEditModal.organs = this.organAll
      this.$refs.domainAllEditModal.organAll = this.organAll
      this.$refs.domainAllEditModal.areaTrees = Vue.ls.get('glob_area')
      this.$refs.domainAllEditModal.customerContracts = [
        { CONTRACT_ID: record.belongContract, CONTRACT_NAME: record.contractName }
      ]
      httpAction(this.url.selectOneVo + record.id, null, 'GET').then(res => {
        this.$refs.domainAllEditModal.edit(res.data)
        this.$refs.domainAllEditModal.title = '编辑'
      })
    },
    handleEdit2(record) {
      this.$refs.SettleEditModal.title = '编辑'
      this.$refs.SettleEditModal.areaTrees = getAreaData()
      this.$refs.SettleEditModal.organAll = this.organAll
      httpAction(this.url.selectOneVo + record.id, null, 'GET').then(res => {
        if (res.code === 200 && res.data) {
          this.$refs.SettleEditModal.resList = [{ id: record.customerId, title: record.customerName }]
          this.$refs.SettleEditModal.edit(res.data)
        }
      })
    },
    handleDetail(record) {
      httpAction(this.url.selectOneVo + record.id, null, 'GET').then(res => {
        this.$refs.allDetailModal.isAuditPage = 0
        this.$refs.allDetailModal.currentStep = 2
        this.$refs.allDetailModal.currentStatus = 'finish'
        this.$refs.allDetailModal.contractName = record.contractName
        this.$refs.allDetailModal.organs = this.organAll
        this.$refs.allDetailModal.title = '详情'
        this.$refs.allDetailModal.areaTrees = Vue.ls.get('glob_area')
        this.$refs.allDetailModal.edit(res.data, record.id)
      })
    },
    handleCustomerService(record) {
      this.$refs.serviceModal.title = '分配权限'
      httpAction(this.url.getOne + record.id, null, 'GET').then(res => {
        if (Number(res.code) === 200) {
          this.$refs.serviceModal.add(res.data)
        }
      })
    },
    handleSearch(value) {
      httpAction(`${this.url.getContract}?name=${value}`, null, 'get').then(res => {
        if (Number(res.code) === 200) {
          this.customerContracts = res.data
        }
      })
    },
    // 导出
    handleUpload() {
      this.$refs.ExportSortFieldModalForm.idArr = this.selectedRowKeys
      this.$refs.ExportSortFieldModalForm.params = this.queryParam
      this.$refs.ExportSortFieldModalForm.url.exportXlsUrl = 'hrBase/tsettledomain/doexport'
      this.$refs.ExportSortFieldModalForm.show(this.exportFields)
    },
    handleUploadBack() {
      this.mounthVisible = true
      // console.log(moment().subtract(2, 'months'))
    },
    handleCancel() {
      this.mounthVisible = false
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$refs.ExportSortFieldModalForm.title = '结算主体回访材料'
          this.$refs.ExportSortFieldModalForm.idArr = this.selectedRowKeys
          console.log(values.createMonth)
          this.$refs.ExportSortFieldModalForm.params = values.createMonth
            ? { createMonth: values.createMonth.format('YYYYMM') }
            : {}
          this.$refs.ExportSortFieldModalForm.url.exportXlsUrl = 'hrBase/tsettledomain/countExport'
          this.$refs.ExportSortFieldModalForm.show(this.visitExportField)
          this.handleCancel()
        }
      })
    },
    /**
     * 获取系统用户数据
     */
    getSysUsers() {
      httpAction(this.url.getSysUsers, null, 'GET').then(res => {
        this.sysUsers = res.data
      })
    },
    loadOrgans() {
      httpAction(this.url.getOrgan, '', 'GET').then(res => {
        if (res.code === 200 && res.data.length > 0) {
          this.organs = res.data
        }
      })
    },
    loadOrganAll() {
      httpAction(this.url.getOrganAll, '', 'GET').then(res => {
        if (res.code === 200 && res.data.length > 0) {
          this.organAll = res.data
        }
      })
    },
    loadCustomerContract() {
      httpAction(this.url.getContract, '', 'GET').then(res => {
        if (res.code === 200 && res.data.length > 0) {
          this.customerContracts = res.data
        }
      })
    },
    /**
     * 加载客户单位树形结构
     */
    loadCustomerTreeData() {
      httpAction(this.url.getTreeData, null, 'get').then(res => {
        this.treeData = res.data
      })
    },
    domainAllEditModalOk() {
      this.loadData()
    },
    serviceModalOk() {
      this.loadData()
    },
    initDictOptions() {
      //业务类型
      initDictOptions('customer_business_type').then(res => {
        if (res.code === 200) {
          this.businessTypeDicts = res.data
        }
      })
      //业务细分
      initDictOptions('customer_business_sub_type').then(res => {
        if (res.code === 200) {
          this.businessSubDicts = res.data
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

.ant-table {
  table-layout: fixed;
}

.ant-table-tbody > tr > td {
  max-width: 110px;
  border-bottom: 0;
  text-align: center !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.formLabel {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
.contract,
.customer {
  cursor: pointer;
}
</style>
