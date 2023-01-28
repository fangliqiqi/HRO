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
            <a-form-item label="客户名称">
              <a-input
                placeholder="客户名称"
                v-model="queryParam.customerName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户编码">
              <a-input
                placeholder="客户编码"
                v-model="queryParam.customerCode"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="合同名称">
              <a-input
                placeholder="合同名称"
                v-model="queryParam.contractName"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            > 
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
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="业务类型"
                class="stepFormText"
              >
                <a-select
                  showSearch
                  placeholder="业务类型"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.businessType"
                >
                  <a-select-option
                    v-for="(item, index) in businessTypeDicts"
                    :key="index"
                    :value="item.id"
                  >{{ item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="商务主体"
                class="stepFormText"
              >
                <a-select
                  showSearch
                  placeholder="商务主体"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.businessSubject"
                >
                  <a-select-option
                    v-for="(item, index) in organs"
                    :key="index"
                    :value="item.id"
                  >{{ item.organName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="合同状态" class="stepFormText">
                <a-select
                  showSearch
                  placeholder="请选择合同状态"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.prAuditFlag"
                >
                  <a-select-option v-for="(item, index) in prAuditFlagStatus" :key="index" :value="item.value" v-if="item.value != 4">
                    {{ item.text }}</a-select-option>
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
        @click="exportCustomerContract"
        type="primary"
        :loading="loadingDown"
        icon="download"
      >导出</a-button>
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
        :scroll="{x: 1}"
      >

        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleShow(record)">详情</a>
          <a
            @click="addCustomerContract(record)"
            v-has="'wxhr:tcustomercontract_goon'"
            v-if="record.signingStatus!=3 && record.signingStatus!=5 && record.prAuditFlag!=1 && record.prAuditFlag!=2 && record.prAuditFlag!=3 && record.prAuditFlag!=4"
          ><a-divider type="vertical" />续签</a>
          <a
            v-if="Number(record.prAuditFlag) === 6"
            v-has="'wxhr:modify_arc_atta'"
            @click="handleArchiveFile(record)"
          >
            <a-divider type="vertical" />
            归档附件</a>
          <a @click="handleStop(record)" v-has="'wxhr:tcustomerstop_add1'" v-if="record.prAuditFlag!=1 && record.prAuditFlag!=2 && record.prAuditFlag!=3 && record.prAuditFlag!=4">
            <a-divider type="vertical"/>停止合作</a>
        </span>

        <span
          slot="customerStatus"
          slot-scope="text, record"
        >
          <a-tag
            v-if="record.customerStatus == 0"
            color="pink"
          >合同未上传</a-tag>
          <a-tag
            v-if="record.customerStatus == 1"
            color="green"
          >合同正常</a-tag>
          <a-tag
            v-if="record.customerStatus == 2"
            color="orange"
          >合同即将到期</a-tag>
          <a-tag
            v-if="record.customerStatus == 3"
            color="red"
          >合同到期</a-tag>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <customer-contract-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></customer-contract-modal>
    <customer-contract-detail-modal ref="detailModal"></customer-contract-detail-modal>
    <customer-contract-continuous-modal ref="continuousModal" @ok="modalFormOk"></customer-contract-continuous-modal>
    <contract-continuous-modal
      ref="customerContinuousModal"
      @ok="continuousModalOk"
    ></contract-continuous-modal>
    <customer-contract-edit-modal
      ref="editModal"
      @ok="modalFormOk"
    ></customer-contract-edit-modal>
    <stop-coopera-modal ref="StopCooperaModal" @ok="modalFormOk"></stop-coopera-modal>
    <customer-contract-handle ref="customerContractHandle" @ok="modalFormOk"></customer-contract-handle>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction } from '@/api/manage'
  import {initDictOptions, filterDict} from '@/components/dict/JDictSelectUtil'
  import CustomerContractModal from './modules/CustomerContractModal'
  import { filterOrganDict1,filterSysUserDict } from '@/utils/customDict'
  import { getNameFromArr,getAllTree } from '@/utils/common'
  import CustomerContractDetailModal from './modules/CustomerContractDetailModal'
  import CustomerContractContinuousModal from './modules/CustomerContractContinuousModal'
  import ContractContinuousModal from './modules/ContractContinuousModal'
  import CustomerContractEditModal from './modules/CustomerContractEditModal'
  import StopCooperaModal from '../global/modules/StopCooperaModal'
  import CustomerContractHandle from './modules/CustomerContractHandle'

  export default {
    name: 'CustomerContractSearchList',
    mixins: [JeecgListMixin],
    components: {
      ContractContinuousModal,
      CustomerContractModal,
      CustomerContractDetailModal,
      CustomerContractContinuousModal,
      CustomerContractEditModal,
      StopCooperaModal,
      CustomerContractHandle
    },
    data() {
      return {
        description: '客户信息管理界面',
        fileList: [],
        loadingDown:false,
        //字典数组缓存
        contractTypeDicts: [], // 客户合同类型
        businessTypeDicts: [], // 业务类型
        chapterUnitDicts: [],
        // businessSubDicts: [],
        loading: false,
        organs:[], // 商务主体数据
        businessOrgans:[], 
        customerTreeData: [],
        businessDeveloper: [],
        BusinessDeveloperArray:'', // 业务开发人
        sysUsers: {},
        prAuditFlagStatus:[
          {color:'orange',text:'待提交',value:3},
          {color:'cyan',text:'待审核',value:2},
          {color:'purple',text:'全国业务中心审核',value:4},
          {color:'green',text:'审核通过',value:0},
          {color:'red',text:'审核不通过',value:1},
          {color:'#87d068',text:'已办理',value:5},
          {color:'blue',text:'已归档',value:6},
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
              let res = this.prAuditFlagStatus.find(item=>String(item.value)===String(text))
              return <a-tag color={res.color}>{res.text}</a-tag>
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
              // const result = getNameFromArr(this.BusinessDeveloperArray,text,'user_id','nickname')
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
              let business = filterOrganDict1(this.organs, text)
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
              let user = filterSysUserDict(this.sysUsers, text)
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
            width: 250,
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
            list: '/hrBase/tcustomercontract/page?selectType=0',
            getOrgan: '/admin/organizationinfo/getOrgForCus?displayFlag=0&type=0',
            getTreeData: '/hrBase/tcustomerinfo/ValueTree',
            getOne: '/hrBase/tcustomercontract/',
            getSysUsers: '/admin/user/userDic',
            getBusinessDeveloperId: 'admin/user/findWxUsers',
            getBusinessDeveloperArray:'/admin/user/getUserByRoleNameAndClient',// 获得业务开发人
            downList:'/hrBase/tcustomercontract/list?selectType=0',
          }
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      }
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
      handleStop(record){
        this.$refs.StopCooperaModal.showModal(record,1)
      },
      getChapterType(str){
        const chapterTypeString = ['', '合同章', '法人章']
        const arr = str ? str.split(',') : []
        const res = arr.map(item=>{
          return chapterTypeString[item]
        })
        return res.join(',')
      },
      //获得业务开发人的接口
      getAllBusinessDeveloper(){
        httpAction(this.url.getBusinessDeveloperArray, '', 'GET').then((res) => {
          if (res.code === 200 && res.data.length > 0) {
            this.BusinessDeveloperArray=res.data
            this.businessDeveloper = res.data
          }
        })
      },
      // 续签合同
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
        this.$refs.continuousModal.businessDeveloper = this.BusinessDeveloperArray
        this.$refs.continuousModal.areaTrees = this.$ls.get('glob_area')
        this.$refs.continuousModal.add(record,this.businessOrgans)
      },
      continuousModalOk() {
        this.loadData();
      },
      getCondition(condition,val,val1,val2){
        return (String(condition) === val) ? val1 : val2
      },
      getNull(val){
        return val || '-'
      },
      getSwitch(type,val0,val1,val2,val3){
        let val = ''
        switch (String(type)){
          case '0':
            val = val0
          break
          case '1':
            val = val1
          break
          case '2':
            val = val2
          break
          case '3':
            val = val3
          break
        }
        return val
      },
      getParams(val,str){
        if(val){
          const param = str.replace(/__extra/,'')
          this.queryParam[param] = val
        }
      },
      exportCustomerContract(){
        this.loadingDown = true
        let url = this.url.downList
        
        this.getParams(this.queryParam.startTimeStart_extra,'startTimeStart_extra')
        this.getParams(this.queryParam.startTimeEnd_extra,'startTimeStart_extra')
        this.getParams(this.queryParam.endTimeStart_extra,'endTimeStart_extra')
        this.getParams(this.queryParam.endTimeEnd_extra,'endTimeEnd_extra')
        // eslint-disable-next-line
        const query = _.cloneDeep(this.queryParam)

        delete query.startTimeStart_extra
        delete query.startTimeEnd_extra
        delete query.endTimeStart_extra
        delete query.endTimeEnd_extra
        delete query.createTimeStart_extra
        delete query.createTimeEnd_extra

        if(Object.keys(query).length){
          const qs = require('qs')
          url += '&'+qs.stringify(query)
        }
        const _this = this
        httpAction(url,null,'get',60000).then(res=>{
          if(res.code === 200){
            const tableDatas = res.data.map(item=>{
              const status = _this.prAuditFlagStatus.find(items=>String(items.value)===String(item.prAuditFlag))
              item.prAuditFlag = status['text'] //修改代码时，注意查看前后联系（注意331行）
              item.signingStatus = _this.typeTitle[item.signingStatus]
              const arr = _this.businessTypeDicts.filter(items=>String(items.id) === item.businessType)
              const businessSubDicts = arr[0] ? arr[0]['children'] : []
              item.businessSub = filterDict(businessSubDicts, item.businessSub)
              item.businessTypes = filterDict(_this.businessTypeDicts, item.businessType)
              
              item.businessDeveloperId = getNameFromArr(_this.BusinessDeveloperArray,item.businessDeveloperId,'user_id','nickname') || '-'
              item.businessDeveloperOrganName = getNameFromArr(_this.organs,item.businessDeveloperOrgan,'id','organName') || '-'
              item.createUserName = _this.sysUsers[item.createUser]
              item.serviceSide = _this.getCondition(item.serviceSide,'1','甲方','乙方')
              item.oldCustomerFlag = _this.getCondition(item.oldCustomerFlag,'1','是','否')
              item.chapterType = _this.getChapterType(item.chapterType)
              item.chapterUnit = this.GLOBAL_CONST['companyChapterType'][item.chapterUnit]
              item.chapterCustomerPre = _this.getCondition(item.chapterCustomerPre,'1','是','否')
              item.outWithFlag = _this.getCondition(item.outWithFlag,'1','是','否')
              item.customerType = _this.getSwitch(item.customerType,'集团客户','重点客户','一般客户','电信客户')
              item.crmNo = _this.getNull(item.crmNo)
              item.estimatedIncome = _this.getNull(item.estimatedIncome)
              item.servicePeopleNum = _this.getNull(item.servicePeopleNum)
              item.money = _this.getNull(item.money)
              item.remark = _this.getNull(item.remark)
              item.expressNo=_this.getNull(item.expressNo)
              item.achiveNo=_this.getNull(item.achiveNo)
              return item
            })
            // 封面数据
            const excelDatas = [{
              tHeader: ["归档编号","合同状态","签订类型","合同名称","客户名称","业务类型","业务细分","业务开发人","业务部门","合同开始时间","合同终止时间",
              "创建人","创建时间","客户编码","合同编号","CRM合同编号","商务主体","服务方","是否续签","是否老客户","用章类型",
              "用章单位","客户先行盖章","是否外带","客户类型","收入预估","服务人数","合同金额","合同要点","快递编号"],
              filterVal: ['achiveNo','prAuditFlag','signingStatus','contractName',"customerName", "businessTypes","businessSub", "businessDeveloperId","businessDeveloperOrganName","startDate","endDate",
              "createUserName","createTime","customerCode","contractCode","crmNo","businessSubjectName","serviceSide","signingStatus","oldCustomerFlag","chapterType",
              "chapterUnit","chapterCustomerPre","outWithFlag","customerType","estimatedIncome","servicePeopleNum","money","remark","expressNo"],
              tableDatas: tableDatas,
              sheetName: "合同"
            }]
            this.json2excel(excelDatas, "客户合同", true, "xlsx",true)
            this.$message.success('导出成功')
          }
        }).finally(()=>{
          this.loadingDown = false
        })
      },
      json2excel(tableJson, filenames, autowidth, bookTypes,typeLength) {
        var that = this
        import('./modules/ExportContract').then(excel => {
          var tHeader = []
          var dataArr = []
          var sheetnames = []
          for (var i in tableJson) {
            tHeader.push(tableJson[i].tHeader)
            dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
            sheetnames.push(tableJson[i].sheetName)
          }
          excel.export_json_to_excel_more_sheet({
            header: tHeader,
            data: dataArr,
            sheetname: sheetnames,
            filename: filenames,
            bookType: bookTypes,
            autoLength: typeLength // 所有类型长度
          })
          that.confirmLoading = false;
        });
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      },

      handleEdit(record) {
        this.$refs.editModal.treeData = this.customerTreeData
        this.$refs.editModal.organs = this.organs
        this.$refs.editModal.industryBelongs = this.industryBelongDictOptions
        this.$refs.editModal.industrySub = this.industrySub
        this.$refs.editModal.customerContractDict = this.contractTypeDicts
        this.$refs.editModal.customerBusinessTypeDict = this.businessTypeDicts
        this.$refs.editModal.chapterUnitDicts = this.chapterUnitDicts
        // this.$refs.editModal.customerBusinessSubTypeDict = this.businessSubDicts
        this.$refs.editModal.contractCustomerName = record.customerName
        httpAction(this.url.getOne + record.id, null, "GET").then((res) => {
          this.$refs.editModal.edit(res.data)
        })
        this.$refs.editModal.title = '客户合同编辑'
      },
      /**
       * 客户合同详情
       */
      handleShow(record) {
        this.$refs.detailModal.treeData = this.customerTreeData;
        this.$refs.detailModal.organs = this.organs;
        this.$refs.detailModal.industryBelongs = this.industryBelongDictOptions;
        this.$refs.detailModal.industrySub = this.industrySub;
        this.$refs.detailModal.customerContractDict = this.contractTypeDicts;
        this.$refs.detailModal.customerBusinessTypeDict = this.businessTypeDicts;
        this.$refs.detailModal.chapterUnitDicts = this.chapterUnitDicts
        // this.$refs.detailModal.customerBusinessSubTypeDict = this.businessSubDicts;
        this.$refs.detailModal.areaTrees = this.$ls.get('glob_area')
        this.$refs.detailModal.title = '客户合同查看'
        httpAction(this.url.getOne + record.id, null, "GET").then((res) => {
          if(res.code == 200){
            res.data.businessDeveloperId = filterSysUserDict(this.sysUsers, res.data.businessDeveloperId)
            this.$refs.detailModal.show(res.data)
          }else{
            this.$message.error(res.msg)
          }
        });
        
      },
      doStop(record) {
        this.$refs.customerContinuousModal.showModal(record);
      },
      /**
       * 加载数据字典
       */
      initDictConfig() {
        initDictOptions('customer_contract_type').then((res) => {
          if (res.code === 200) {
            this.contractTypeDicts = res.data;
          }
        });
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
      loadOrgans() {
        httpAction(this.url.getOrgan,'','GET').then((res) => {
          if(res.code === 200 && res.data.length > 0) {
            this.organs = res.data;
          }
        });
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
        httpAction(this.url.getTreeData,null,'get').then((res) => {
          this.customerTreeData = res.data;
        });
      },
      /**
       * 获取系统用户数据
       */
      getSysUsers() {
        httpAction(this.url.getSysUsers, null ,'GET').then((res) => {
          this.sysUsers = res.data;
        });
      },
      startDateChange(date) {
        // 时间格式化
        this.queryParam.startTimeFromHtml = date ? (date.format('YYYY-MM-DD')) : null
      },
      endDateChange(date) {
        // 时间格式化
        this.queryParam.endTimeFromHtml  = date ? (date.format('YYYY-MM-DD')) : null
      },
      // 归档附件
      handleArchiveFile(record){
        httpAction(this.url.getOne + record.id, null, 'GET').then((res) => {
          if(Number(res.code) === 200){
            this.$refs.customerContractHandle.record = record
            this.$refs.customerContractHandle.treeData = this.customerTreeData
            this.$refs.customerContractHandle.organs = this.organs
            this.$refs.customerContractHandle.industryBelongs = this.industryBelongDictOptions
            this.$refs.customerContractHandle.industrySub = this.industrySub
            this.$refs.customerContractHandle.customerContractDict = this.contractTypeDicts
            this.$refs.customerContractHandle.customerBusinessTypeDict = this.businessTypeDicts
            this.$refs.customerContractHandle.businessDeveloper = this.businessDeveloper
            // // 1:归档 0:办理 2:修改(合同查询操作列->归档附件)
            this.$refs.customerContractHandle.isUploaded = 2
            this.$refs.customerContractHandle.title = '合同归档'
            this.$refs.customerContractHandle.fileList = res.data.fileArchiveList||[]
            this.$refs.customerContractHandle.add()
          }else{
            this.$message.error(res.msg || '详情获取失败！')
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

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
