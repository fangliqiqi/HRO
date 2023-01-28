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
              <a-form-item label="合同名称">
                <a-input
                  allowClear
                  placeholder="请输入合同名称"
                  v-model="queryParam.contractName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="创建类型">
                <a-select
                  placeholder="请选择创建类型"
                  optionFilterProp="children"
                  v-model="queryParam.createType"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option value="0">合同之后</a-select-option>
                  <a-select-option value="1">合同之前</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="合同关联">
                <a-select
                  placeholder="请选择合同关联"
                  v-model="queryParam.relateFlag"
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
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">查看</a>
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

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <settlement-detail-modal ref="SettlementDetailForm"></settlement-detail-modal>
    <export-sort-field-modal ref="ExportSortFieldModalForm"></export-sort-field-modal>
    <assignation-customer-service-modal
      ref="serviceModal"
      @ok="modalFormOk"
    ></assignation-customer-service-modal>
    <docking-people-modal
      ref="dockingPeopleModal"
      @ok="modalFormOk"
    ></docking-people-modal>
    <stop-coopera-modal ref="StopCooperaModal" @ok="modalFormOk"></stop-coopera-modal>

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

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SettlementDetailModal from './modules/SettlementDetailModal'
import ExportSortFieldModal from '../global/modules/ExportSortFieldModal'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { httpAction } from '@/api/manage'
import AssignationCustomerServiceModal from './modules/AssignationCustomerServiceModal'
import DockingPeopleModal from  './modules/DockingPeopleModal'
import StopCooperaModal from '../global/modules/StopCooperaModal'

export default {
  name: 'SettlementSearch',
  mixins: [JeecgListMixin],
  components: {
    SettlementDetailModal,
    ExportSortFieldModal,
    AssignationCustomerServiceModal,
    DockingPeopleModal,
    StopCooperaModal
  },
  data() {
    return {
      description: '结算主体查询',
      serverItemDicts: [],
      organAll: [],

      exportFields: [
        '客户名称','合同名称','商务主体','业务类型','业务细分','社保卡收取',
        '管理费是否收费','管理费收取项目','风险金收取项目','管理费费率/管理费金额','管理费收费类型',
        '风险金是否收取','风险金收取费用/税率','风险金收取方式','缴税类型','风险金税收类型',
        '管理费税收类型','单位大病比例','缴税税率','管理费是否扣税','社保结算时间',
        '公积金结算时间','工资发放时间','客户每月到表时间','工资每月发放时间','首次结算时间',
        '合同约定到款时间','商险配置_是否收取管理费','商险管理费收取方式','商险管理费收取值','商险管理费收取比率',
        '商险交税类型','商险交税值','商险管理费税收是否含税','福利购买地','保险类型',
        '其他福利','客户开票名称','我司到款单位名称','结算主体名称','结算主体编码',
        '所在省','所在市','所在县','是否是新业务','新业务备注',
        '创建人','创建时间','服务审核转态','审核人姓名','服务项目',
        '收入归属','收入归属细分','业务开发人','业务开发部门','客户类型'
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
      
      statusOption:[
        {
          color:'green',
          text:'通过'
        },
        {
          color:'red',
          text:'不通过'
        },
        {
          color:'cyan',
          text:'待审核'
        },
        {
          color:'orange',
          text:'待提交'
        },
        {
          color:'blue',
          text:'经理通过'
        },
        {
          color:'red',
          text:'经理不通过'
        },
      ],
      // 表头
      columns: [
        {
          title: '审核状态',
          align: 'center',
          width: 100,
          dataIndex: 'dpAuditFlag',
          customRender: val => {
            const res = this.statusOption[val]
            return (
              <a-tag color={res.color}>{res.text}</a-tag>
            )
          }
        },
        {
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
          title: '服务项目',
          align: 'center',
          dataIndex: 'serverItem',
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '客户',
          align: 'center',
          dataIndex: 'customerName',
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
          title: '创建类型',
          align: 'center',
          dataIndex: 'createType',
          ellipsis: true,
          customRender: text => {
            const resultText = (text == '1') ? '合同之前' : '合同之后'
            return (
              <a-tooltip placement="topLeft" title={resultText}>
                {resultText}
              </a-tooltip>
            )
          }
        },
        {
          title: '合同关联',
          align: 'center',
          dataIndex: 'relateFlag',
          ellipsis: true,
          customRender: text => {
            const resultText = (text == '1') ? '否' : '是'
            return (
              <a-tooltip placement="topLeft" title={resultText}>
                {resultText}
              </a-tooltip>
            )
          }
        },
        {
          title: '合同名称',
          align: 'center',
          dataIndex: 'contractName',
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
          width: 120,
          ellipsis: true,
          customRender: text => {
            const resultText = text ? text.substring(0, 10) : '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
          width:120,
        }
      ],
      url: {
        list: '/hrBase/tsettledomain/page?selectType=0',
        getdetail: 'hrBase/tsettledomain/vo/',
        getOrganAll: '/admin/organizationinfo/getOrgForCus?type=0',
        getOne: '/hrBase/tsettledomain/',

        getContract: '/hrBase/tcustomercontract/getOwnContract',
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        selectOneVo: '/hrBase/tsettledomain/vo/',
        getContractById: '/hrBase/tcustomercontract/',
        getCustomerById: '/hrBase/tcustomerinfo/vo/'
      },
      form: this.$form.createForm(this),
      mounthVisible: false,
      confirmLoading: false
    }
  },
  created() {
    this.loadOrganAll()
  },
  methods: {
    handleStop(record){
      this.$refs.StopCooperaModal.showModal(record,2)
    },
    handleAddDockingPeople(record) {
      this.$refs.dockingPeopleModal.title = '对接信息'
      this.$refs.dockingPeopleModal.organAll = this.organAll
      httpAction(`/admin/organizationinfo/getOrgForCus?type=0&useType=4`,'','GET').then((res) => {
        if(res.code === 200 ) {
          this.$refs.dockingPeopleModal.newOrganAll = res.data
          this.$refs.dockingPeopleModal.add(record)    
        }else{
          this.$message.warning(res.msg)
        }
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
    handleAdd(){
      this.$refs.SettlementAddForm.title = '添加'
      this.$refs.SettlementAddForm.serverItemDicts = this.serverItemDicts
      this.$refs.SettlementAddForm.organAll = this.organAll
      this.$refs.SettlementAddForm.showModal()
    },
    handleEdit(record){
      this.$refs.SettlementAddForm.title = '编辑'
      this.$refs.SettlementAddForm.serverItemDicts = this.serverItemDicts
      this.$refs.SettlementAddForm.organAll = this.organAll
      httpAction(this.url.getdetail + record.id, null, 'GET').then(res => {
        if(res.code === 200){
          this.$refs.SettlementAddForm.edit(res.data)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleDetail(record){
      this.$refs.SettlementDetailForm.title = '详情'
      this.$refs.SettlementDetailForm.statusOption = this.statusOption
      this.$refs.SettlementDetailForm.serverItemDicts = this.serverItemDicts
      this.$refs.SettlementDetailForm.organAll = this.organAll
      httpAction(this.url.getdetail + record.id, null, 'GET').then(res => {
        if(res.code === 200){
          this.$refs.SettlementDetailForm.show(res.data)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleUploadBack() {
      this.mounthVisible = true
      // console.log(moment().subtract(2, 'months'))
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
    handleCancel() {
      this.mounthVisible = false
    },
    // 导出
    handleUpload() {
      this.$refs.ExportSortFieldModalForm.idArr = this.selectedRowKeys
      this.$refs.ExportSortFieldModalForm.params = this.queryParam
      this.$refs.ExportSortFieldModalForm.url.exportXlsUrl = 'hrBase/tsettledomain/doexport'
      this.$refs.ExportSortFieldModalForm.show(this.exportFields)
    },
    loadOrganAll() {
      httpAction(this.url.getOrganAll,'','GET').then((res) => {
        if(res.code === 200 && res.data.length > 0) {
          this.organAll = res.data;
        }
      });
    },
    initDictConfig() {
      initDictOptions('server_items').then((res) => {
        if (res.code === 200) {
          this.serverItemDicts = res.data;
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
.formLabel {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
