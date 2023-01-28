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
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.signingStatus"
                >
                  <a-select-option v-for="(item, index) in typeTitle" :key="index" :value="index">
                    {{ item }}</a-select-option>
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
                  optionFilterProp="children"
                  :allowClear="true"
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
          <a-divider type="vertical" v-has="'wxhr:tcustomercontract_goon'"/>
          <a @click="addCustomerContract(record)" v-has="'wxhr:tcustomercontract_goon'">续签</a>
        </span>

        <span slot="customerStatus" slot-scope="text, record">
          <a-tag v-if="record.customerStatus == 0" color="pink">合同未上传</a-tag>
          <a-tag v-if="record.customerStatus == 1" color="green">合同正常</a-tag>
          <a-tag v-if="record.customerStatus == 2" color="orange">合同即将到期</a-tag>
          <a-tag v-if="record.customerStatus == 3" color="red">合同到期</a-tag>
        </span>

        <span slot="prAuditFlag" slot-scope="text, record">
          <a-tag v-if="record.prAuditFlag == 0" color="green">审核通过</a-tag>
          <a-tag v-if="record.prAuditFlag == 1" color="red">审核不通过</a-tag>
          <a-tag v-if="record.prAuditFlag == 2" color="cyan">待审核</a-tag>
          <a-tag v-if="record.prAuditFlag == 3" color="orange">待提交</a-tag>
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
    <customer-contract-continuous-modal ref="continuousModal"></customer-contract-continuous-modal>
    <contract-continuous-modal ref="customerContinuousModal" @ok="continuousModalOk"></contract-continuous-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction } from '@/api/manage'
import { initDictOptions, filterDict } from '@/components/dict/JDictSelectUtil'
import CustomerContractModal from './modules/CustomerContractModal'
import { filterOrganDict1, filterSysUserDict } from '@/utils/customDict'
import CustomerContractDetailModal from './modules/CustomerContractDetailModal'
import CustomerContractContinuousModal from './modules/CustomerContractContinuousModal'
import ContractContinuousModal from './modules/ContractContinuousModal'
import { getAllTree } from '@/utils/common'

export default {
  name: 'CustomerContractStopList',
  mixins: [JeecgListMixin],
  components: {
    ContractContinuousModal,
    CustomerContractModal,
    CustomerContractDetailModal,
    CustomerContractContinuousModal,
  },
  data() {
    return {
      description: '客户信息管理界面',
      fileList: [],
      //字典数组缓存
      contractTypeDicts: [],
      businessTypeDicts: [],
      chapterUnitDicts: [],
      // businessSubDicts: [],
      loading: false,
      organs: [],
      customerTreeData: [],
      sysUsers: {},
      typeTitle:{'0':'续签','1':'新签','2':'重签','3':'补充协议','4':'先于合同执行','5':'虚拟合同'},
      // 表头
      prAuditFlagStatus: [
        { color: 'green', text: '审核通过' },
        { color: 'red', text: '审核不通过' },
        { color: 'cyan', text: '待审核' },
        { color: 'orange', text: '待提交' },
        { color: 'purple', text: '全国业务中心审核' },
        { color: '#87d068', text: '已办理' },
        { color: 'blue', text: '已归档' },
      ],
      // 表头
      columns: [
        {
          title: '合同状态',
          align: 'center',
          dataIndex: 'prAuditFlag',
          width: 120,
          customRender: (text) => {
            return <a-tag color={this.prAuditFlagStatus[text].color}>{this.prAuditFlagStatus[text].text}</a-tag>
          },
        },
        {
          title: '业务类型',
          align: 'center',
          dataIndex: 'businessType',
          width: 100,
          ellipsis: true,
          customRender: (text) => {
            const businessType = filterDict(this.businessTypeDicts, text)
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
          customRender: (text)=>this.renderTableHead(text),
        },
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'customerName',
          width: 180,
          ellipsis: true,
          customRender: (text)=>this.renderTableHead(text),
        },
        {
          title: '业务开发人',
          align: 'center',
          dataIndex: 'businessDeveloperId',
          width: 180,
          ellipsis: true,
          customRender: (text) => {
            let index = -1
            for (let i = 0; i < this.BusinessDeveloperArray.length; i++) {
              if (this.BusinessDeveloperArray[i].user_id === Number(text)) {
                index = i
                break
              }
            }
            const result = index === -1 ? '-' : this.BusinessDeveloperArray[index]['nickname']
            return this.renderTableHead(result)
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
            return this.renderTableHead(business)
          },
        },
        {
          title: '合同开始时间',
          align: 'center',
          dataIndex: 'startDate',
          width: 110,
          ellipsis: true,
          customRender: (text) => this.renderTableHead(text)
        },
        {
          title: '合同终止时间',
          align: 'center',
          dataIndex: 'endDate',
          width: 110,
          ellipsis: true,
          customRender: (text) => this.renderTableHead(text)
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createUser',
          width: 80,
          ellipsis: true,
          customRender: (text) => {
            const user = filterSysUserDict(this.sysUsers, text)
            return this.renderTableHead(user)
          },
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          width: 170,
          ellipsis: true,
          customRender: (text) => this.renderTableHead(text)
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 180,
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/hrBase/tcustomercontract/page?selectType=2',
        getOrgan: '/admin/organizationinfo/getOrgForCus?displayFlag=0&type=0',
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        getOne: '/hrBase/tcustomercontract/',
        getSysUsers: '/admin/user/userDic',
        getBusinessDeveloperArray: '/admin/user/getUserByRoleNameAndClient', // 获得业务开发人
      },
      BusinessDeveloperArray: '',
      businessOrgans:[],
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
    this.getAllBusinessDeveloper()
  },
  methods: {
    changeRange(agrs,str){
      this.queryParam[str] = agrs[1]
    },
    renderTableHead(text){
      return (
        <a-tooltip placement="topLeft" title={text}>
          {text}
        </a-tooltip>
      )
    },
    //获得业务开发人的接口
    getAllBusinessDeveloper() {
      httpAction(this.url.getBusinessDeveloperArray, '', 'GET').then((res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.BusinessDeveloperArray = res.data
          this.businessDeveloper = res.data
        }
      })
    },
    /**
     * 客户合同上传
     */
    addCustomerContract(record) {
      this.$refs.continuousModal.title = '客户合同续签'
      this.$refs.continuousModal.treeData = this.customerTreeData
      this.$refs.continuousModal.organs = this.organs
      this.$refs.continuousModal.industryBelongs = this.industryBelongDictOptions
      this.$refs.continuousModal.industrySub = this.industrySub
      this.$refs.continuousModal.customerContractDict = this.contractTypeDicts
      this.$refs.continuousModal.customerBusinessTypeDict = this.businessTypeDicts
      this.$refs.continuousModal.chapterUnitDicts = this.chapterUnitDicts
      // this.$refs.continuousModal.customerBusinessSubTypeDict = this.businessSubDicts
      this.$refs.continuousModal.businessDeveloper = this.businessDeveloper
      this.$refs.continuousModal.areaTrees = this.$ls.get('glob_area')
      this.$refs.continuousModal.add(record,this.businessOrgans)
      this.$refs.continuousModal.title = '客户合同续签'
    },
    continuousModalOk() {
      this.loadData()
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
      this.$refs.detailModal.chapterUnitDicts = this.chapterUnitDicts
      // 商业类型细分已经去除
      this.$refs.detailModal.areaTrees = this.$ls.get('glob_area')
      httpAction(this.url.getOne + record.id, null, 'GET').then((res) => {
        if (res.code === 200) {
          res.data.businessDeveloperId = filterSysUserDict(this.sysUsers, res.data.businessDeveloperId)
          this.$refs.detailModal.show(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
      this.$refs.detailModal.title = '客户合同查看'
    },
    doStop(record) {
      this.$refs.customerContinuousModal.showModal(record)
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
      
      httpAction(`/admin/organizationinfo/getOrgForCus?displayFlag=0&type=0&useType=3`, '', 'GET').then((res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.businessOrgans = res.data
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
    loadOrgans() {
      httpAction(this.url.getOrgan, '', 'GET').then((res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.organs = res.data
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
.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
