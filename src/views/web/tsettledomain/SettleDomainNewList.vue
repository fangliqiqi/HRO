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
                placeholder="请输入结算主体名称"
                v-model="queryParam.departName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="所属客户"
              class="formLabel"
            >
              <select-page
                placeholder="请选择客户单位"
                v-model="queryParam.customerId"
                :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                :title="'customerName'"
                :id="'id'"
              ></select-page>
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
        @click="handleAdd"
        type="primary"
        icon="plus"
        v-has="'wxhr:tsettledomain_add'"
      >新增</a-button>

      <a-dropdown v-has="'wxhr:tsettledomain_edit'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImportExcel(url.importExcelBatchAddUrl,'post',1)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />批量更新核准表开票信息
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/核准表开票信息批量添加和更新.xlsx')">
            <a-icon type="download" />模板下载
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量更新核准表开票信息
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-dropdown v-has="'wxhr:tsettledomain_edit'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImportExcel(url.returnVistUrl,'post',2)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />批量新增对接信息和客户约定
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/批量新增对接信息和客户约定.xlsx')">
            <a-icon type="download" />模板下载
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量新增对接信息和客户约定
          <a-icon type="down" />
        </a-button>
      </a-dropdown>

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
        <span
          slot="action"
          slot-scope="text, record"
        >
          <!-- <a @click="handleEdit(record)" v-if="record.dpAuditFlag != 2">编辑</a> -->
          <a
            @click="handleEdit2(record)"
            v-if="record.dpAuditFlag != 2"
          >编辑</a>
          <a-divider
            type="vertical"
            v-if="record.dpAuditFlag != 2"
          />
          <a
            v-if="record.dpAuditFlag == 3"
            v-has="'wxhr:tsettledomain_batch_commit'"
            @click="handleSubmit(record)"
          >提交</a>
          <!--<a v-if="record.dpAuditFlag == 1" v-has="'wxhr:tsettledomain_batch_commit'" @click="handleSubmit(record)">重新提交</a>-->
          <a-divider
            type="vertical"
            v-if="record.dpAuditFlag == 3"
            v-has="'wxhr:tsettledomain_batch_commit'"
          />
          <a
            v-has="'wxhr:tdepartdockingpeople_add'"
            @click="handleAddDockingPeople(record)"
          >对接信息</a>
          <a-divider
            type="vertical"
            v-if="record.dpAuditFlag == 3 || record.dpAuditFlag == 1"
          />
          <a-popconfirm
            v-has="'wxhr:tsettledomain_del'"
            v-if="record.dpAuditFlag == 3 || record.dpAuditFlag == 1"
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>

        <span
          slot="dpAuditFlag"
          slot-scope="text,record"
        >
          <a-tag
            v-if="record.dpAuditFlag == 0"
            color="green"
          >审核通过</a-tag>

          <a-tooltip v-if="record.dpAuditFlag == 1">
            <template slot="title">
              {{ record.dpAuditOpinion }}
            </template>
            <a-tag color="red">审核不通过</a-tag>
          </a-tooltip>
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
    <settleDomain-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></settleDomain-modal>
    <docking-people-modal
      ref="dockingPeopleModal"
      @ok="dockingPeopleModalOk"
    ></docking-people-modal>
    <assignation-customer-service-modal
      ref="serviceModal"
      @ok="serviceModalOk"
    ></assignation-customer-service-modal>
    <settle-domain-all-modal
      ref="domainAllModal"
      @ok="domainAllModalOk"
    ></settle-domain-all-modal>
    <settle-domain-all-edit-modal
      ref="domainAllEditModal"
      @ok="domainAllEditModalOk"
    ></settle-domain-all-edit-modal>
    <settle-domain-edit-modal
      ref="SettleEditModal"
      @ok="modalFormOk"
    ></settle-domain-edit-modal>
    <before-audit-modal
      ref="beforeAuditModal"
      @ok="beforeAuditModalOk"
    ></before-audit-modal>
    <error-modal ref="errorModal"></error-modal>
    <customer-contract-detail-modal ref="ContractDetailModal"></customer-contract-detail-modal>
    <customer-all-detail-modal ref="CustomerAllDetailModal"></customer-all-detail-modal>
  </a-card>
</template>

<script>
import SettleDomainModal from './modules/SettleDomainModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import DockingPeopleModal from  './modules/DockingPeopleModal'
import AssignationCustomerServiceModal from './modules/AssignationCustomerServiceModal'
import { filterOrganDict1 } from '@/utils/customDict'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { httpAction } from '@/api/manage'
import { getAreaData,handleImportData } from '@/utils/common'
import SettleDomainAllModal from './modules/SettleDomainAllModal'
import SettleDomainAllEditModal from './modules/SettleDomainAllEditModal'
import SettleDomainEditModal from './modules/SettleDomainEditModal'
import BeforeAuditModal from './modules/BeforeAuditModal'
import ErrorModal from '../global/modules/ErrorModal'
import CustomerContractDetailModal from '../tcustomercontract/modules/CustomerContractDetailModal'
import CustomerAllDetailModal from '../tcustomerunit/modules/CustomerAllDetailModal'
import Vue from 'vue'
import XLSX from 'xlsx'
import SelectPage from '@/components/jeecg/SelectPage'

export default {
  name: "SettleDomainNewList",
  mixins:[JeecgListMixin],
  components: {
    BeforeAuditModal,
    SettleDomainAllEditModal,
    SettleDomainAllModal,
    SettleDomainModal,
    DockingPeopleModal,
    AssignationCustomerServiceModal,
    SettleDomainEditModal,
    ErrorModal,
    CustomerContractDetailModal,
    CustomerAllDetailModal,
    SelectPage
  },
  data () {
    return {
      description: '结算主体新建列表页面',
      sysUsers: [],
      organs: [],
      organAll: [],
      treeData: [],
      customerContracts: [],
      customerDicts:[],
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
          title: '审核状态',
          align:"center",
          dataIndex: 'dpAuditFlag',
          scopedSlots: { customRender: 'dpAuditFlag' },
          width:100,
        },
        {
          title: '合同主体',
          align:"center",
          dataIndex: 'contractName',
          width:250,
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
          width:150,
          ellipsis: true,
          customRender:(text)=>{
            const income = filterOrganDict1(this.organAll, text)
            return <a-tooltip
              placement="topLeft"
              title={income}
            >{income}</a-tooltip>
          }
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
          }
        },
        {
          title: '所属客户',
          align:"center",
          dataIndex: 'customerName',
          width:200,
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
          width:230,
          scopedSlots: { customRender: 'action' },
        }
      ],
      url: {
        list: "/hrBase/tsettledomain/page",
        getSysUsers: '/admin/user/userDic',
        getOrgan: '/admin/organizationinfo/getOrgForCus?type=1',
        getContract: '/hrBase/tcustomercontract/getOwnContract?type=0',
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        getOne: '/hrBase/tsettledomain/',
        getOrganAll: '/admin/organizationinfo/getOrgForCus?type=0',
        selectOneVo: '/hrBase/tsettledomain/vo/',
        delete: '/hrBase/tsettledomain/',
        importExcelBatchAddUrl:'/hrBase/tsettledomain/bactchSaveByExcel',
        returnVistUrl:'/hrBase/tsettledomain/returnVisitImport',
        getContractById:'/hrBase/tcustomercontract/',
        getCustomerById:'/hrBase/tcustomerinfo/vo/',
      },
      contractDicts:{},
      importFieldsList:{
        '邮寄地址':'address',
        '结算主体':'departName',
        '结算主体编码':'departNo',
        '对接人姓名':'people',
        '职位':'stations',
        '办公电话':'tel',
        '手机':'phone',
        '工资发放方式':'salaryType',
        '工资发放日（每月×号）':'salaryGrantTime',
        '首次结算时间':'firstSettlementTime',
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
    this.loadOrgans();
    this.loadOrganAll();
    this.loadCustomerContract();
    this.loadCustomerTreeData();
    this.getCustomerDicts()
    this.getDicts()
  },
  methods: {
    // 导入
    handleImportExcel(importUrl,method,type){
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('files[]', file)
      })
      this.uploadFilesChange(fileList[0], importUrl,method,type)
    },
    // 实现导入
    uploadFilesChange(file, importUrl, method,type) {
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
          let params
          if(String(type) === '2'){
            params = this.handleParams(data[sheetName])
          }else{
            params = handleImportData(data[sheetName])
          }
          httpAction(importUrl,params,method,600000).then(res=>{
            if(res.code === 200){
              that.$message.success("导入成功！")
            }else if (res.data) {
              that.$refs.errorModal.title = `导入提示: ${res.msg}`
              that.$refs.errorModal.message = res.msg
              that.$refs.errorModal.showModal(res.data)
            }else if(res.errorMessageList){
              that.$refs.errorModal.title = `导入提示: ${res.msg}`
              that.$refs.errorModal.message = res.msg
              that.$refs.errorModal.showModal(res.errorMessageList)
            }else{
              that.$message.error(res.msg)
            }
          }).finally(()=>{
            that.loading = false
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
    handleParams(data){
      const params = data.map((item)=>{
        const obj = {}
        const keys = Object.keys(item)
        for(const key of keys){
          const tkey = (typeof(key)==='string') ? key.trim() : key
          obj[this.importFieldsList[tkey]] = (typeof(item[key])==='string') ? item[key].trim() : item[key]
          if(obj[this.importFieldsList[tkey]] === ''){
            delete obj[this.importFieldsList[tkey]]
          }
        }
        return obj
      })
      // 去除最后的空格行
      for (let i=(params.length-1); i>=0; i--) {
        // 判断数组是否全为空
        const flag = Object.values(params[i]).find(item=>{
          return String(item).replace(/^\s*|\s*$/g,"").length
        })
        if(!flag){
          params.splice(i, 1)
        }else{
          break
        }
      }
      return {list:params}
    },
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
    handleDownloadTemplate(templateUrl){
      const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
      window.location.href = url
    },
    handleAdd() {
      this.$refs.domainAllModal.organAll = this.organAll;
      this.$refs.domainAllModal.areaTrees = getAreaData();
      this.$refs.domainAllModal.customerContracts = this.customerContracts;
      this.$refs.domainAllModal.add();
      this.$refs.domainAllModal.title = '新增'
    },
    handleEdit(record) {
      this.$refs.domainAllEditModal.organs = this.organAll;
      this.$refs.domainAllEditModal.organAll = this.organAll;
      this.$refs.domainAllEditModal.areaTrees = getAreaData();
      this.$refs.domainAllEditModal.customerContracts = [{CONTRACT_ID:record.belongContract,CONTRACT_NAME:record.contractName}]

      httpAction(this.url.selectOneVo + record.id, null, 'GET').then((res) => {
        if(Number(res.code) === 200 && res.data){
          this.$refs.domainAllEditModal.edit(res.data);
          this.$refs.domainAllEditModal.title = '编辑'
        }
      });
    },
    handleEdit2(record){
      this.$refs.SettleEditModal.title = '编辑'
      this.$refs.SettleEditModal.areaTrees = getAreaData();
      this.$refs.SettleEditModal.organAll = this.organAll;
      httpAction(this.url.selectOneVo + record.id, null, 'GET').then((res) => {
        if(Number(res.code) === 200 && res.data){
          this.$refs.SettleEditModal.resList = [{id:record.customerId,title:record.customerName}]
          this.$refs.SettleEditModal.edit(res.data)
        }
      })
    },
    handleSubmit(record) {
      httpAction('/admin/user/findUserBypPrmission?permissionStr=' + 'wxhr:tsettledomain_audit','wxhr:tsettledomain_audit','GET').then((res) => {
        if(res.code === 200) {
          this.$refs.beforeAuditModal.auditUsers = res.data;
          this.$refs.beforeAuditModal.showModal(record.id);
        }
      });
    },
    beforeAuditModalOk() {
      this.loadData();
    },
    dockingPeopleModalOk() {
      this.loadData();
    },
    handleAddDockingPeople(record) {
      this.$refs.dockingPeopleModal.title = '对接信息'
      this.$refs.dockingPeopleModal.organAll = this.organAll
      this.$refs.dockingPeopleModal.add(record)
    },
    serviceModalOk() {
      this.loadData();
    },
    handleSearch(value){
      httpAction(this.url.getContract+'&name='+value,null,'get').then((res)=>{
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
        this.sysUsers = res.data;
      });
    },
    loadOrgans() {
      httpAction(this.url.getOrgan,'','GET').then((res) => {
        if(res.code === 200 && res.data.length > 0) {
          this.organs = res.data;
        }
      });
    },
    loadOrganAll() {
      httpAction(this.url.getOrganAll,'','GET').then((res) => {
        if(res.code === 200 && res.data.length > 0) {
          this.organAll = res.data;
        }
      });
    },
    loadCustomerContract() {
      httpAction(this.url.getContract,'','GET').then((res) => {
        if(res.code === 200 && res.data) {
          this.customerContracts = res.data;
        }
      });
    },
    /**
     * 加载客户单位树形结构
     */
    loadCustomerTreeData() {
      httpAction(this.url.getTreeData,null,'get').then((res) => {
        this.treeData = res.data;
      });
    },
    domainAllModalOk() {
      this.loadData();
    },
    domainAllEditModalOk() {
      this.loadData();
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
.contract,
.customer {
  cursor: pointer;
}
</style>
