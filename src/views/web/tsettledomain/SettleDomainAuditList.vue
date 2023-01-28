<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="结算主体编码">
              <a-input placeholder="请输入结算主体编码" v-model="queryParam.departNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="结算主体名称">
              <a-input placeholder="请输入结算主体名称" v-model="queryParam.departName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="所属客户">
              <select-page
                placeholder="请选择客户单位"
                v-model="queryParam.customerId"
                :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                :title="'customerName'"
                :id="'id'"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus" v-has="'wxhr:tsettledomain_add'">新增</a-button>
    </div>
    <!-- table区域-begin -->
    <div>
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
        :scroll="{ x: 1}"
        :customRow="customRow"
      >
        <span slot="action" slot-scope="text, record">
          <a v-has="'wxhr:tsettledomain_audit'" @click="handleAudit(record)">审核</a>
        </span>

        <span slot="dpAuditFlag" slot-scope="text,record">
          <a-tag :color="dpAuditFlagOption[record.dpAuditFlag].color">{{ dpAuditFlagOption[record.dpAuditFlag].text }}</a-tag>
        </span>

        <span slot="labelScoped" slot-scope="text, record">
          <span v-if="record.serverItem != null">
            <a-tag v-for="(tag, index) in record.serverItem.split(',')" :key="index">{{ tag }}</a-tag>
          </span>
          <span v-else> - </span>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <settle-domain-all-detail-modal ref="allDetailModal" @ok="allDetailModalOk"></settle-domain-all-detail-modal>
    <assignation-customer-service-modal ref="serviceModal" @ok="serviceModalOk"></assignation-customer-service-modal>
    <customer-contract-detail-modal ref="ContractDetailModal"></customer-contract-detail-modal>
    <customer-all-detail-modal ref="CustomerAllDetailModal"></customer-all-detail-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterOrganDict1 } from '@/utils/customDict'
import { httpAction } from '@/api/manage'
import SettleDomainAllDetailModal from './modules/SettleDomainAllDetailModal'
import AssignationCustomerServiceModal from './modules/AssignationCustomerServiceModal'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import CustomerContractDetailModal from '../tcustomercontract/modules/CustomerContractDetailModal'
import CustomerAllDetailModal from '../tcustomerunit/modules/CustomerAllDetailModal'
import Vue from 'vue'
import SelectPage from '@/components/jeecg/SelectPage'

export default {
  name: "SettleDomainAuditList",
  mixins:[JeecgListMixin],
  components: {
    AssignationCustomerServiceModal,
    SettleDomainAllDetailModal,
    CustomerContractDetailModal,
    CustomerAllDetailModal,
    SelectPage
  },
  data () {
    return {
      description: '结算主体新建列表页面',
      sysUsers: [],
      organAll: [],
      treeData: [],
      customerContracts: [],
      customerDicts:[],
      contractDicts:{},
      // 表头
      columns: [
        {
          title: '结算主体名称',
          align:"center",
          dataIndex: 'departName',
          width:150,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '结算主体编码',
          align:"center",
          dataIndex: 'departNo',
          width:120,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '创建人',
          align:"center",
          dataIndex: 'createUserName',
          width:80,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '创建时间',
          align:"center",
          dataIndex: 'createTime',
          width:170,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip
              placement="topLeft"
              title={text}
            >{text}</a-tooltip>
          }
        },
        {
          title: '审核状态',
          align:"center",
          dataIndex: 'dpAuditFlag',
          scopedSlots: { customRender: 'dpAuditFlag' },
          width:120,
          ellipsis: true,
        },
        {
          title: '合同主体',
          align:"center",
          dataIndex: 'contractName',
          width:260,
          ellipsis: true,
          customRender:(text)=>{
            return (
              <a-tooltip>
                <template slot="title">
                  {text}
                </template>
                <a-tag color="cyan" class="contract">{text}</a-tag>
              </a-tooltip>
            )
          }
        },
        {
          title: '服务项目',
          align:"center",
          width:200,
          dataIndex: 'serverItem',
          scopedSlots: { customRender: 'labelScoped' },
        },
        {
          title: '收入归属',
          align:"center",
          dataIndex: 'incomeBelong',
          width:160,
          ellipsis: true,
          customRender:(text)=>{
            const income = filterOrganDict1(this.organAll, text)
            return <a-tooltip
              placement="topLeft"
              title={income}
            >{income}</a-tooltip>
          },
        },
        {
          title: '收入归属细分',
          align:"center",
          dataIndex: 'incomeBelongSub',
          width:120,
          ellipsis: true,
          customRender:(text)=>{
            const income = filterOrganDict1(this.organAll, text)
            return <a-tooltip
              placement="topLeft"
              title={income}
            >{income}</a-tooltip>
          },
        },
        {
          title: '所属客户',
          align:"center",
          dataIndex: 'customerName',
          width:250,
          ellipsis: true,
          customRender:(text)=>{
            return <a-tooltip>
                <template slot="title">
                  {text}
                </template>
                <a-tag color="cyan" class="customer">{text}</a-tag>
              </a-tooltip>
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align:"center",
          fixed:"right",
          width:90,
          scopedSlots: { customRender: 'action' },
        }
      ],
      url: {
        list: "/hrBase/tsettledomain/audit/page",
        getSysUsers: '/admin/user/userDic',
        getContract: '/hrBase/tcustomercontract/getOwnContract',
        getOne: '/hrBase/tsettledomain/',
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        getOrganAll: '/admin/organizationinfo/getOrgForCus?type=0',
        selectOneVo: '/hrBase/tsettledomain/vo/',
        getContractById:'/hrBase/tcustomercontract/',
        getCustomerById:'/hrBase/tcustomerinfo/vo/',
      },
      dpAuditFlagOption:{
        "0":{color:'green',text:'审核通过'},
        "1":{color:'red',text:'审核不通过'},
        "2":{color:'orange',text:'待审核'},
        "3":{color:'orange',text:'待提交'},
        "4":{color:'green',text:'经理通过'},
        "5":{color:'red',text:'经理不通过'}
      },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  created() {
    this.getSysUsers();
    this.loadOrganAll();
    this.loadCustomerTreeData();
    this.loadCustomerContract();
    this.getCustomerDicts()
    this.getDicts()
  },
  methods: {
    getDicts(){
      initDictOptions('customer_contract_type').then((res) => {
        if (res.code === 200) {
          this.contractDicts.contractTypeDicts = res.data;
        }
      });
      initDictOptions('customer_business_type').then((res) => {
        if (res.code === 200) {
          this.contractDicts.businessTypeDicts = res.data;
        }
      });
      initDictOptions('customer_business_sub_type').then((res) => {
        if (res.code === 200) {
          this.contractDicts.businessSubDicts = res.data;
        }
      });
    },
    getCustomerDicts(){
      initDictOptions('industryBelong').then((res) => {
        if (res.code === 200) {
          this.customerDicts.industryBelongDictOptions = res.data;
        }
      });
      initDictOptions('industrySub').then((res) => {
        if (res.code === 200) {
          this.customerDicts.industrySub = res.data;
        }
      });
      initDictOptions('nature').then((res) => {
        if (res.code === 200) {
          this.customerDicts.natureDictOptions = res.data;
        }
      });
    },
    customRow(record){
      return {
        on:{
          click:(event)=>{
            if(event.target.className && /contract/.test(event.target.className)){
              httpAction(this.url.getContractById+record.belongContract,null,'get').then((res)=>{
                if(res.code === 200){
                  this.$refs.ContractDetailModal.title = '客户合同查看'
                  this.$refs.ContractDetailModal.treeData = this.treeData;
                  this.$refs.ContractDetailModal.organs = this.organAll
                  this.$refs.ContractDetailModal.customerContractDict = this.contractDicts.contractTypeDicts;
                  this.$refs.ContractDetailModal.customerBusinessTypeDict = this.contractDicts.businessTypeDicts;
                  this.$refs.ContractDetailModal.customerBusinessSubTypeDict = this.contractDicts.businessSubDicts;
                  this.$refs.ContractDetailModal.show(res.data)
                }else{
                  this.$message.error(res.msg)
                }
              })
            }else if(event.target.className && /customer/.test(event.target.className)){
              this.$refs.CustomerAllDetailModal.treeData = this.treeData;
              this.$refs.CustomerAllDetailModal.industryBelongs = this.customerDicts.industryBelongDictOptions;
              this.$refs.CustomerAllDetailModal.industrySub = this.customerDicts.industrySub;
              this.$refs.CustomerAllDetailModal.customerNatures = this.customerDicts.natureDictOptions;
              this.$refs.CustomerAllDetailModal.areaTrees = Vue.ls.get('glob_area');
              this.$refs.CustomerAllDetailModal.title = '客户详情'
              this.$refs.CustomerAllDetailModal.contractTypeDicts = this.contractDicts.contractTypeDicts;
              this.$refs.CustomerAllDetailModal.businessTypeDicts = this.contractDicts.businessTypeDicts;
              this.$refs.CustomerAllDetailModal.businessSubDicts = this.contractDicts.businessSubDicts;
              this.$refs.CustomerAllDetailModal.organs = this.organAll;
              httpAction(this.url.getCustomerById + record.customerId, null,'GET').then((res) => {
                this.$refs.CustomerAllDetailModal.edit(res.data)
              })
            }
          }
        }
      }
    },
    handleAudit(record) {
      httpAction(this.url.selectOneVo + record.id, null, 'GET').then((res) => {
        this.$refs.allDetailModal.isAuditPage = 1
        this.$refs.allDetailModal.currentStep = 1
        this.$refs.allDetailModal.currentStatus = "wait"
        this.$refs.allDetailModal.contractName = record.contractName
        this.$refs.allDetailModal.organs = this.organAll
        this.$refs.allDetailModal.title = "审核"
        this.$refs.allDetailModal.edit(res.data,record.id)
      });
    },
    handleCustomerService(record) {
      httpAction(this.url.getOne + record.id, null, 'GET').then((res) => {
        if(Number(res.code) === 200) {
          this.$refs.serviceModal.title = '分配客服'
          this.$refs.serviceModal.add(res.data)
        }
      });
    },
    handleSearch(value){
      httpAction(`${this.url.getContract}?type=0&name=${value}`,null,'get').then((res)=>{
        if(Number(res.code) === 200){
          this.customerContracts = res.data
        }
      })
    },
    /**
     * 获取系统用户数据
     */
    getSysUsers() {
      httpAction(this.url.getSysUsers, null ,'GET').then((res) => {
        this.sysUsers = res.data
      });
    },
    loadOrganAll() {
      httpAction(this.url.getOrganAll,'','GET').then((res) => {
        if(res.code === 200 && res.data.length > 0) {
          this.organAll = res.data
        }
      });
    },
    loadCustomerContract() {
      httpAction(this.url.getContract,'','GET').then((res) => {
        if(res.code === 200 && res.data.length > 0) {
          this.customerContracts = res.data
        }
      });
    },
    /**
     * 加载客户单位树形结构
     */
    loadCustomerTreeData() {
      httpAction(this.url.getTreeData,null,'get').then((res) => {
        this.treeData = res.data
      });
    },
    allDetailModalOk() {
      this.loadData();
    },
    serviceModalOk() {
      this.loadData();
    },
  }
}
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px
}
.ant-card-body .table-operator{
  margin-bottom: 18px;
}
.ant-table-tbody .ant-table-row td{
  padding-top:15px;
  padding-bottom:15px;
}
.anty-row-operator button{margin: 0 5px}
.ant-btn-danger{background-color: #ffffff}

.ant-modal-cust-warp{height: 100%}
.ant-modal-cust-warp .ant-modal-body{height:calc(100% - 110px) !important;overflow-y: auto}
.ant-modal-cust-warp .ant-modal-content{height:90% !important;overflow-y: hidden}

.ant-table{
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
.formLabel{
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
.contract,.customer{
  cursor: pointer;
}
</style>
