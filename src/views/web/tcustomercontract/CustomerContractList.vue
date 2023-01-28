<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="客户名称">
              <a-input placeholder="客户名称" v-model="queryParam.customerName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="客户编码">
              <a-input placeholder="客户编码" v-model="queryParam.customerCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="合同名称">
              <a-input placeholder="合同名称" v-model="queryParam.contractName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="签订类型">
                <a-select
                  showSearch
                  placeholder="签订类型"
                  optionFilterProp="children"
                  :dropdownMatchSelectWidth="false"
                  :allowClear="true"
                  v-model="queryParam.signingStatus"
                >
                  <a-select-option v-for="(item, index) in typeTitle" :key="index" :value="index">
                    {{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="商务主体" class="stepFormText">
                <a-select
                  showSearch
                  placeholder="商务主体"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.businessSubject"
                >
                  <a-select-option v-for="(item, index) in organs" :key="index" :value="item.id">{{
                    item.organName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="业务类型" class="stepFormText">
                <a-select
                  showSearch
                  placeholder="业务类型"
                  :allowClear="true"
                  optionFilterProp="children"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.businessType"
                >
                  <a-select-option v-for="(item, index) in businessTypeDicts" :key="index" :value="item.id">{{
                    item.label
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="12"
              :sm="14"
            >
              <a-form-item label="合同开始时间">
                <a-date-picker
                  format="YYYY-MM-DD"
                  placeholder="开始时间"
                  style="width:46%"
                  v-model="queryParam.startTimeStart_extra"
                  @change="changeRange(arguments,'startTimeStart')"
                />
                ~
                <a-date-picker
                  format="YYYY-MM-DD"
                  placeholder="结束时间"
                  style="width:46%"
                  v-model="queryParam.startTimeEnd_extra"
                  @change="changeRange(arguments,'startTimeEnd')"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="12"
              :sm="14"
            >
              <a-form-item label="合同终止时间" class="stepFormText">
                <a-date-picker
                  format="YYYY-MM-DD"
                  placeholder="开始时间"
                  style="width:46%"
                  v-model="queryParam.endTimeStart_extra"
                  @change="changeRange(arguments,'endTimeStart')"
                />
                ~
                <a-date-picker
                  format="YYYY-MM-DD"
                  placeholder="结束时间"
                  style="width:46%"
                  v-model="queryParam.endTimeEnd_extra"
                  @change="changeRange(arguments,'endTimeEnd')"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="12"
              :sm="14"
            >
              <a-form-item label="合同创建时间" class="stepFormText">
                <a-date-picker
                  format="YYYY-MM-DD"
                  placeholder="开始时间"
                  style="width:46%"
                  v-model="queryParam.createTimeStart_extra"
                  @change="changeRange(arguments,'createTimeStart')"
                />
                ~
                <a-date-picker
                  format="YYYY-MM-DD"
                  placeholder="结束时间"
                  style="width:46%"
                  v-model="queryParam.createTimeEnd_extra"
                  @change="changeRange(arguments,'createTimeEnd')"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="客户类型" class="stepFormText">
                <a-select
                  showSearch
                  placeholder="请选择客户类型"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.customerType"
                >
                  <a-select-option v-for="(item, index) in GLOBAL_CONST['customerType']" :key="index" :value="index">
                    {{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="归属部门" class="stepFormText">
                <a-select
                  showSearch
                  placeholder="归属部门"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.businessDeveloperOrgan"
                >
                  <a-select-option v-for="(item, index) in organs" :key="index" :value="item.id">{{
                    item.organName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
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
        @click="addCustomerContract('新签合同申报',1)"
        type="primary"
        icon="plus"
        v-has="'wxhr:tcustomercontract_add'"
      >新增</a-button>
      <a-button
        @click="addCustomerContract('续签合同申报',0)"
        type="primary"
        icon="plus"
        v-has="'wxhr:tcustomercontract_add'"
      >续签</a-button>
      <a-button
        @click="addCustomerContract('重签合同申报',2)"
        type="primary"
        icon="plus"
        v-has="'wxhr:tcustomercontract_add'"
      >重签</a-button>
      <a-button
        @click="addCustomerContract('补充协议申报',3)"
        type="primary"
        icon="plus"
        v-has="'wxhr:tcustomercontract_add'"
      >补充协议</a-button>
      <!-- <a-button
        @click="addCustomerContract('先于合同执行申报',4)"
        type="primary"
        icon="plus"
        v-has="'wxhr:tcustomercontract_add'"
      >先于合同执行</a-button> -->
      <a-button
        @click="addCustomerContract('虚拟合同创建',5)"
        type="primary"
        icon="plus"
        v-has="'wxhr:tcustomercontract_addvirtual'"
      >虚拟合同</a-button>
      
      <!--<a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item
            key="1"
            @click="batchSubmit"
            v-has="'wxhr:tcustomerconstart_batch_commit'"
          >
            <a-icon type="check-circle" />
            批量提交审核
          </a-menu-item>
        </a-menu>
        <a-button> 批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>-->
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
        :scroll="{ x: 1 }"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleShow(record)">详情</a>
          <a-divider type="vertical" v-if="record.prAuditFlag == 3 || record.prAuditFlag == 1" v-has="'wxhr:tcustomercontract_edit'"/>
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:tcustomercontract_edit'"
            v-if="record.prAuditFlag == 3 || record.prAuditFlag == 1"
          >编辑</a>
          <a-divider type="vertical" v-if="record.prAuditFlag == 3" v-has="'wxhr:tcustomerconstart_batch_commit'"/>
          <a
            @click="toSubmit(record)"
            v-has="'wxhr:tcustomerconstart_batch_commit'"
            v-if="record.prAuditFlag == 3"
          >提交审核</a>
          <a-divider type="vertical" v-if="record.prAuditFlag == 3 || record.prAuditFlag == 1" v-has="'wxhr:tcustomercontract_del'"/>
          <!--<a @click="addCustomerContract(record)" v-has="'wxhr:tcustomerinfo_edit'">上传合同</a>
          <a-divider type="vertical"/>-->
          <a-dropdown v-if="record.prAuditFlag == 3 || record.prAuditFlag == 1" v-has="'wxhr:tcustomercontract_del'">
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

        <span slot="customerStatus" slot-scope="text, record">
          <a-tag v-if="record.customerStatus == 0" color="pink">合同未上传</a-tag>
          <a-tag v-if="record.customerStatus == 1" color="green">合同正常</a-tag>
          <a-tag v-if="record.customerStatus == 2" color="orange">合同即将到期</a-tag>
          <a-tag v-if="record.customerStatus == 3" color="red">合同到期</a-tag>
        </span>
        <span slot="labelScoped" slot-scope="text, record">
          <span v-if="record.label != null">
            <a-tag v-for="(tag, index) in record.label.split(',')" :key="index">{{ tag }}</a-tag>
          </span>
          <span v-else> - </span>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <customer-contract-modal ref="modalForm" @ok="modalFormOk"></customer-contract-modal>
    <customer-contract-detail-modal ref="detailModal"></customer-contract-detail-modal>
    <before-audit-modal ref="beforeAuditModal" @ok="beforeAuditModalOk"></before-audit-modal>
    <customer-contract-edit-modal ref="editModal" @ok="editModalOk"></customer-contract-edit-modal>
    <step-modal ref="stepModal"></step-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction } from '@/api/manage'
import { getAllTree } from '@/utils/common'
import { initDictOptions, filterDict } from '@/components/dict/JDictSelectUtil'
import CustomerContractModal from './modules/CustomerContractModal'
import { filterOrganDict1, filterSysUserDict } from '@/utils/customDict'
import CustomerContractDetailModal from './modules/CustomerContractDetailModal'
import BeforeAuditModal from './modules/BeforeAuditModal'
import CustomerContractEditModal from './modules/CustomerContractEditModal'
import StepModal from '../../common/StepModal'
import moment from 'moment'

export default {
  name: 'CustomerContractList',
  mixins: [JeecgListMixin],
  components: {
    StepModal,
    CustomerContractModal,
    CustomerContractDetailModal,
    BeforeAuditModal,
    CustomerContractEditModal,
  },
  data() {
    return {
      description: '客户信息管理界面',
      loadingFlag: false,
      fileList: [],
      areaTrees: [],
      //字典数组缓存
      contractTypeDicts: [],
      businessTypeDicts: [],
      chapterUnitDicts: [], // 用章单位
      // businessSubDicts: [],
      loading: false,
      organs: [],
      businessOrgans: [],
      customerTreeData: [],
      sysUsers: {},
      prAuditFlagStatus:[
        {color:'green',text:'审核通过'},
        {color:'red',text:'审核不通过'},
        {color:'cyan',text:'待审核'},
        {color:'orange',text:'待提交'},
        {color:'purple',text:'全国业务中心审核'},
        {color:'#87d068',text:'已办理'},
        {color:'blue',text:'已归档'},
      ],
      typeTitle:{'0':'续签','1':'新签','2':'重签','3':'补充协议','4':'先于合同执行','5':'虚拟合同'},
      // 表头
      columns: [
        {
          title: '合同状态',
          align: 'center',
          dataIndex: 'prAuditFlag',
          width: 120,
          customRender:(text)=>{
            return <a-tag color={this.prAuditFlagStatus[text].color}>{this.prAuditFlagStatus[text].text}</a-tag>
          }
        },
        {
          title: '签订类型',
          align: 'center',
          dataIndex: 'signingStatus',
          width: 100,
          customRender:(text)=>{
            const type = this.typeTitle[text]
            return (
              <a-tooltip placement="topLeft" title={type}>
                {type}
              </a-tooltip>
            )
          }
        },
        {
          title: '业务类型',
          align: 'center',
          dataIndex: 'businessType',
          width: 100,
          ellipsis: true,
          customRender: (text) => {
            let businessType = filterDict(this.businessTypeDicts, text)
            return (
              <a-tooltip placement="topLeft" title={businessType}>
                {businessType}
              </a-tooltip>
            )
          },
        },
        {
          title: '合同名称',
          align: 'center',
          dataIndex: 'contractName',
          width: 200,
          ellipsis: true,
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'customerName',
          width: 180,
          ellipsis: true,
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '业务开发人',
          align: 'center',
          dataIndex: 'businessDeveloperId',
          width: 180,
          ellipsis: true,
          customRender: (text) => {
            const result = this.sysUsers[text]
            return (
              <a-tooltip placement="topLeft"  title={result}>
                {result}
              </a-tooltip>
            )
          },
        },
        {
          title: '开发部门/分公司',
          align: 'center',
          dataIndex: 'businessDeveloperOrgan',
          width: 200,
          ellipsis: true,
          customRender: (text) => {
            const business = filterOrganDict1(this.organs, text)
            return (
              <a-tooltip placement="topLeft" title={business}>
                {business}
              </a-tooltip>
            )
          },
        },
        {
          title: '合同开始时间',
          align: 'center',
          dataIndex: 'startDate',
          width: 110,
          ellipsis: true,
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '合同终止时间',
          align: 'center',
          dataIndex: 'endDate',
          width: 110,
          ellipsis: true,
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createUser',
          width: 80,
          ellipsis: true,
          customRender: (text) => {
            const user = this.sysUsers[text]
            return (
              <a-tooltip placement="topLeft" title={user}>
                {user}
              </a-tooltip>
            )
          },
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          width: 170,
          ellipsis: true,
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 240,
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/hrBase/tcustomercontract/page?selectType=1',
        getOrgan: '/admin/organizationinfo/getOrgForCus?displayFlag=0&type=0',
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        getOne: '/hrBase/tcustomercontract/',
        getSysUsers: '/admin//user/userDic',
        getBusinessDeveloperArray:'/admin/user/getUserByRoleNameAndClient',// 获得业务开发人
      },
      BusinessDeveloperArray:'',
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  created() {
    this.loadOrgans()
    this.loadCustomerTreeData()
    this.getSysUsers()
    this.areaTrees = this.$ls.get('glob_area')
    this.getAllBusinessDeveloper()
  },
  methods: {
    changeRange(agrs,str){
      this.queryParam[str] = agrs[1]
    },
    moment,
    //获得业务开发人的接口
    getAllBusinessDeveloper(){
      httpAction(this.url.getBusinessDeveloperArray, '', 'GET').then((res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.BusinessDeveloperArray=res.data
          this.businessDeveloper = res.data
        }
      })
    },
    /**
     * 客户合同上传
     */
    addCustomerContract(title,type) {
      this.$refs.modalForm.title = title
      this.$refs.modalForm.treeData = this.customerTreeData
      this.$refs.modalForm.organs = this.organs
      this.$refs.modalForm.businessOrgans = this.businessOrgans
      this.$refs.modalForm.industryBelongs = this.industryBelongDictOptions
      this.$refs.modalForm.industrySub = this.industrySub
      this.$refs.modalForm.customerContractDict = this.contractTypeDicts
      this.$refs.modalForm.customerBusinessTypeDict = this.businessTypeDicts
      this.$refs.modalForm.businessDeveloper = this.businessDeveloper
      this.$refs.modalForm.areaTrees = this.areaTrees
      this.$refs.modalForm.chapterUnitDicts = this.chapterUnitDicts
      this.$refs.modalForm.sysUsers = this.sysUsers
      this.$refs.modalForm.add(type)
    },
    /**
     * 客户合同修改
     */
    handleEdit(record) {
      this.$refs.editModal.title = `${this.typeTitle[record.signingStatus]}编辑`
      this.$refs.editModal.treeData = this.customerTreeData
      this.$refs.editModal.organs = this.organs
      this.$refs.editModal.industryBelongs = this.industryBelongDictOptions
      this.$refs.editModal.industrySub = this.industrySub
      this.$refs.editModal.customerContractDict = this.contractTypeDicts
      this.$refs.editModal.customerBusinessTypeDict = this.businessTypeDicts
      // this.$refs.editModal.customerBusinessSubTypeDict = this.businessSubDicts
      this.$refs.editModal.chapterUnitDicts = this.chapterUnitDicts
      this.$refs.editModal.contractCustomerName = record.customerName
      this.$refs.editModal.businessDeveloper = this.businessDeveloper
      this.$refs.editModal.areaTrees = this.areaTrees
      this.$refs.editModal.type = record.signingStatus
      httpAction(this.url.getOne + record.id, null, 'GET').then((res) => {
        if(Number(res.code) === 200 && res.data){
          this.$refs.editModal.edit(res.data,this.businessOrgans)
        }else {
          this.$message.warn(res.msg || '详情数据获取失败!')
        }
      })
    },
    /**
     * 客户合同详情
     */
    handleShow(record) {
      this.$refs.detailModal.treeData = this.customerTreeData
      this.$refs.detailModal.organs = this.organs
      this.$refs.detailModal.industryBelongs = this.industryBelongDictOptions
      this.$refs.detailModal.industrySub = this.industrySub
      this.$refs.detailModal.customerContractDict = this.contractTypeDicts
      this.$refs.detailModal.customerBusinessTypeDict = this.businessTypeDicts
      // this.$refs.detailModal.customerBusinessSubTypeDict = this.businessSubDicts
      this.$refs.detailModal.chapterUnitDicts = this.chapterUnitDicts
      this.$refs.detailModal.businessDeveloper = this.businessDeveloper
      this.$refs.detailModal.areaTrees = this.areaTrees
      httpAction(this.url.getOne + record.id, null, 'GET').then((res) => {
        if(res.code === 200){
          res.data.businessDeveloperId = filterSysUserDict(this.sysUsers, res.data.businessDeveloperId)
          this.$refs.detailModal.show(res.data)
        }else{
          this.$message.error(res.msg)
        }
      })
      this.$refs.detailModal.title = '客户合同查看'
    },
    /**
     * 删除客户合同信息
     */
    handleDelete(id) {
      httpAction(this.url.getOne + id, null, 'delete').then((res) => {
        if (Number(res.code) === 200) {
          this.$message.success('删除成功！')
          this.loadData()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    stepShow(record) {
      let flows = []
      if (record.prAuditFlag == 1) {
        flows = [
          {
            title: '合同申请',
            status: 'finish',
            description: filterSysUserDict(this.sysUsers, record.createUser),
            icon: 'user',
          },
          {
            title: '合同审核',
            status: 'error',
            description: `${record.prAuditManName}:${record.prAuditOpinion}`,
            icon: 'close-circle',
          },
          { title: '合同完成', status: 'wait', icon: 'user' },
        ]
      }
      if (record.prAuditFlag == 2) {
        flows = [
          {
            title: '合同申请',
            status: 'finish',
            description: filterSysUserDict(this.sysUsers, record.createUser),
            icon: 'user',
          },
          { title: '合同审核', status: 'process', description: record.prAuditManName, icon: 'loading' },
          { title: '合同完成', status: 'wait', icon: 'user' },
        ]
      }
      this.$refs.stepModal.show(flows)
    },
    /**
     * 新的提交审核  之前的页面组件已经被删除
     */
    toSubmit(record) {
      const that = this
      const modal = this.$confirm({
        title: '确认提交审核？',
        okButtonProps: {
          props: { loading: that.loadingFlag }
        },
        async onOk() {
          that.loadingFlag = !that.loadingFlag
           modal.update({
              okButtonProps: {
                props: { loading: that.loadingFlag },
              },
            })
            const res = await httpAction(
              '/admin/user/findUserBypPrmission?permissionStr=' + 'wxhr:tcustomercontract_audit',
              'wxhr:tcustomercontract_audit',
              'GET'
            )
            if (res.code === 200) {
              const submitBatch = `/hrBase/tcustomercontract/batch/commit?id=${record.id}`
              httpAction(submitBatch, null, 'POST').then((res) => {
                if (res.code === 200) {
                  console.log(`haha`)
                  that.$message.success('提交审核成功')
                } else {
                  that.$message.warning(res.msg)
                }
                that.loadData()
              })
              .finally(() => {
                that.loadingFlag = false
              })
            }
        },
      })
    },
    beforeAuditModalOk() {
      this.loadData()
    },
    /**
     * 加载数据字典
     */
    initDictConfig() {
      initDictOptions('customer_contract_type').then((res) => {
        if (res.code === 200) {
          this.contractTypeDicts = res.data
        }
      })
      initDictOptions('chapter_unit').then((res) => {
        if (res.code === 200) {
          this.chapterUnitDicts = res.data
        }
      })
      httpAction(`/hrBase/sysdictbusinesstype/getSysDictBusinessTypeList`,null,'get').then(res=>{
        if(res.code === 200) {
          const tree = getAllTree(res.data)
          let result = []
          tree.map(item=>{
            result = result.concat(item.children)
          })
          this.businessTypeDicts = result
        }
      })
    },
    
    getRules(list,tree){
      let res = []
      tree.map(item=>{
        const temp = list.filter(items=>items.parentId == item.id)
        res = res.concat(temp)
      })
      return res
    },
    loadOrgans() {
      httpAction(this.url.getOrgan, '', 'GET').then((res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.organs = res.data
        }
      })
      httpAction(`/admin/organizationinfo/getOrgForCus?displayFlag=0&type=0&useType=3`, '', 'GET').then((res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.businessOrgans = res.data
        }
      })

    },
    /**
     * 加载客户单位树形结构
     */
    loadCustomerTreeData() {
      httpAction(this.url.getTreeData, null, 'get').then((res) => {
        this.customerTreeData = res.data
      })
    },
    /**
     * 获取系统用户数据
     */
    getSysUsers() {
      httpAction(this.url.getSysUsers, null, 'GET').then((res) => {
        this.sysUsers = res.data
      })
    },
    editModalOk() {
      this.loadData()
    },
    startDateChange(date) {
      // 时间格式化
      this.queryParam.startTimeFromHtml = date ? date.format('YYYY-MM-DD') : null
    },
    endDateChange(date) {
      // 时间格式化
      this.queryParam.endTimeFromHtml = date ? date.format('YYYY-MM-DD') : null
    },
  },
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
.overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  width: 120px;
}
.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
