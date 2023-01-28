<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" class="searchForm">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="发起人" class="labelTxt">
              <a-input
                placeholder="请输入发起人"
                v-model="queryParam.reportUserName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="发起人部门" class="labelTxt">
              <a-tree-select
                showSearch
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="belongOrganization"
                :allowClear="true"
                placeholder="所在部门"
                v-model="queryParam.orgCode_extra"
                @change="handleChange"
                @select="changeDepart"
                treeDefaultExpandAll
                treeNodeFilterProp="title"
                :dropdownMatchSelectWidth="false"
                :getPopupContainer="getPopupContainerFun"
              ></a-tree-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="当事人" class="labelTxt">
              <a-input
                placeholder="请输入当事人"
                v-model="queryParam.emName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="当事人身份证" class="labelTxt">
              <a-input
                placeholder="请输入当事人身份证"
                v-model="queryParam.emIdCard"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体" class="labelTxt">
                <select-page
                  :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                  :title="'departName'"
                  :placeholder="'请输入结算主体'"
                  v-model="queryParam.emSettleId"
                  :id="'id'"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="客户单位" class="labelTxt">
                <select-page
                  placeholder="请选择客户单位"
                  v-model="queryParam.emCusId"
                  :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                  :title="'customerName'"
                  :id="'id'"
                ></select-page>
                <!-- <a-tree-select
                  showSearch
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="customerTreeData"
                  placeholder="客户单位"
                  treeNodeFilterProp="title"
                  v-model="queryParam.emCusId"
                  treeDefaultExpandAll
                  :dropdownMatchSelectWidth="false"
                  :allowClear="true"
                  :getPopupContainer="getPopupContainerFun"
                ></a-tree-select> -->
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="业务类型" class="labelTxt">
                <a-select
                  v-model="queryParam.businessType"
                  placeholder="请选择业务类型"
                >
                  <a-select-option
                    v-for="item in businessTypeDicts"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="流程状态" class="labelTxt">
                <a-select
                  v-model="queryParam.auditStatus"
                  placeholder="请选择流程状态"
                >
                  <a-select-option
                    v-for="item in auditStatusOption"
                    :key="item.id"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="事件发生时间" class="labelTxt">
                <a-range-picker
                  v-model="queryParam.rangeTime_extra"
                  @change="changeRange"
                  style="width:100%"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="事件编码" class="labelTxt">
                <a-input
                  placeholder="请输入事件编码"
                  v-model="queryParam.eventCode"
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
      >
        <span
          slot="provinceName"
          slot-scope="text,record"
        >
          <template v-if="record.provinceName">
            {{ record.provinceName }} {{ record.cityName }} {{ record.townName }}
          </template>
          <span v-else>--</span>
        </span>
        <!-- 流程状态 -->
        <span
          slot="auditStatus"
          slot-scope="text, record"
        >
          <template>
            <a-tag
              color="blue"
              @click="processRecord(record)"
            >
              {{ (text>=4 && text<=6) ? '办理中' : filterDictText(auditStatusOption, text) }}
            </a-tag>
          </template>
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleDetail(record)"
            v-has="'wxhr:tworkinjuryevent_detail'"
          >详情</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多
              <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item v-has="'wxhr:tworkinjuryevent_social_claims'">
                <a @click="socialClaims(record)">工伤理赔</a>
              </a-menu-item>
              <a-menu-item v-has="'wxhr:tworkinjuryevent_injury_claims'">
                <a @click="injuryClaims(record)">商险理赔</a>
              </a-menu-item>
              <a-menu-item
                v-has="'wxhr:tAbitrationEvent_add'"
                v-if="record.typeLabel == 0"
              >
                <a @click="turnArbitrate(record)">转为仲裁</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>

        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <injury-audit-modal
      ref="InjuryAuditModalForm"
      @ok="modalFormOk"
    ></injury-audit-modal>
    <turn-arbitrate-modal
      ref="TurnArbitrateModalForm"
      @ok="modalFormOk"
    ></turn-arbitrate-modal>
    <process-record-modal ref="ProcessRecordModalForm"></process-record-modal>
    <handle-record-modal ref="HandleRecordForm" :title="titleModal" :feeTypeOption="feeTypeOption"></handle-record-modal>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  // import { getAllSettleDomainSelectVos } from '@/api/api'
  import { httpAction } from '@/api/manage'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import InjuryAuditModal from './modules/InjuryAuditModal'
  import TurnArbitrateModal from './modules/TurnArbitrateModal'
  import ProcessRecordModal from './modules/ProcessRecordModal'
  import SelectPage from '@/components/jeecg/SelectPage'
  import HandleRecordModal from './modules/HandleRecordModal'

  export default {
    name: 'InjurySearch',
    mixins: [JeecgListMixin],
    components: {
      InjuryAuditModal,
      TurnArbitrateModal,
      ProcessRecordModal,
      SelectPage,
      HandleRecordModal
    },
    data() {
      return {
        description: '事件查询列表',
        auditStatusOption:[],
        typeOption:['普通事件','重大事件','仲裁事件'],
        
        customerTreeData:[], //客户单位
        organizationOption:[],
        businessTypeDicts:[], //业务类型
        treatmentTypeOption:[], //治疗类型
        settleDomainOptions:[],
        eventTypeOptions:[],
        belongOrganization:[],
        // 表头
        columns: [
          {
            title: '事件编码',
            align: 'center',
            dataIndex: 'eventCode'
          },
          {
            title: '当事人',
            align: 'center',
            dataIndex: 'emName'
          },
          {
            title: '身份证号码',
            align: 'center',
            dataIndex:'emIdCard'
          },
          {
            title: '事件发生时间',
            align: 'center',
            dataIndex: 'eventOccurrenceTime',
            customRender: (text) => {
              return moment(text).format('YYYY-MM-DD')
            }
          },
          {
            title: '参保所在地',
            align: 'center',
            dataIndex: 'provinceName',
            scopedSlots: { customRender: 'provinceName' }
          },
          {
            title: '流程发起人',
            align: 'center',
            dataIndex: 'reportUserName'
          },
          {
            title: '发起时间',
            align: 'center',
            dataIndex: 'reportDate',
            customRender: (text) => {
              return moment(text).format('YYYY-MM-DD')
            }
          },
          // {
          //   title: '流程状态',
          //   align: 'center',
          //   dataIndex: 'auditStatus',
          //   scopedSlots: { customRender: 'auditStatus' }
          // },
          // {
          //   title: '材料提交截止日期',
          //   align: 'center',
          //   dataIndex: 'lastInsuranceMaterialSubDate',
          //   customRender: (text) => {
          //     return (text) ? text : '--'
          //   }
          // },
          // {
          //   title: '事件标识',
          //   align: 'center',
          //   dataIndex: 'type',
          //   customRender: (text) => {
          //     return this.typeOption[text]
          //   }
          // },
          {
            title: '事件等级',
            align: 'center',
            dataIndex: 'typeLabel',
            customRender: (text) => {
              if(text == null){
                return '普通事件'
              }
              return this.getLabel(text)
            }
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/hrEmergency/tworkinjuryevent/page?selectType=0',
          socialClaims:'/hrEmergency/tdealinfo/record', //工伤理赔记录
          getDetail:'/hrEmergency/tworkinjuryevent/vo/',
          getTreeData: '/hrBase/tcustomerinfo/ValueTree',
          getBelongOrg:'/admin/organizationinfo/getOrgToTree',
          organization:'/admin/organizationinfo/getOrgForCus', //获取皖信组织架构
        },
        feeTypeOption:[],
        titleModal:''
      }
    },
    created() {
      this.loadCustomerTreeData()
      this.loadOrgination()
      this.getBelongOrganization()
      // 结算主体和所属单位
      httpAction('hrBase/tsettledomain/selectAllUnitDeptVo',null,'get').then((res) => {
        if (Number(res.code) === 200) {
          this.settleDomainOptions = res.data
        } else {
          this.$message.error('结算主体和所属单位数据请求失败！')
        }
      })
      // getAllSettleDomainSelectVos().then(res => {
      //   if (res.code === 200) {
      //     this.settleDomainOptions = res.data
      //   } else {
      //     this.$message.error('结算主体和所属单位数据请求失败！')
      //   }
      // })
      httpAction(`/admin/dict/getByParentId?parentId=1753`,null,'get').then(res=>{
        if(res.code === 200){
          this.feeTypeOption = res.data
        }
      })
    },
    methods: {
      filterDictText,
      handleChange(val){
        if(!val){
          delete this.queryParam.orgCode
        }
      },
      getLabel(type){
        let arr = type.replace(/^(\s|,)+|(\s|,)+$/g, '').split(',');
        let str = ''
        for(let item of arr){
          str += this.typeOption[item]+' '
        }
        return str
      },
      //查看详情
      handleDetail(record){
        this.$refs.InjuryAuditModalForm.title = '工伤事件_详情'
        this.$refs.InjuryAuditModalForm.auditStatus = '状态：'+filterDictText(this.auditStatusOption, record.auditStatus)
        this.$refs.InjuryAuditModalForm.isOperate = false
        this.$refs.InjuryAuditModalForm.businessTypeDicts = this.businessTypeDicts
        this.$refs.InjuryAuditModalForm.settleDomainOptions = this.settleDomainOptions
        this.$refs.InjuryAuditModalForm.treatmentTypeOption = this.treatmentTypeOption
        this.$refs.InjuryAuditModalForm.organizationOption = this.organizationOption
        this.$refs.InjuryAuditModalForm.customerTreeData = this.customerTreeData
        this.$refs.InjuryAuditModalForm.eventTypeOptions = this.eventTypeOptions
        httpAction(this.url.getDetail+record.id,null,'get').then((res) => {
          if(res.code == 200){
            this.$refs.InjuryAuditModalForm.edit(res.data)
          }
        })
      },
      //查看流程记录
      processRecord(record){
        this.$refs.ProcessRecordModalForm.edit(record,0)
      },
      //工伤理赔记录
      socialClaims(record){
        this.titleModal = '工伤事件_工伤理赔办理记录'
        //获取记录
        httpAction(this.url.socialClaims+'?id='+record.id+'&payMainType=0&type=0',null,'get').then((res)=>{
          if(res.code == 200){
            this.$refs.HandleRecordForm.status = filterDictText(this.auditStatusOption, record.auditStatus)
            this.$refs.HandleRecordForm.show(record,res.data,0)
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      //商险理赔记录
      injuryClaims(record){
        this.titleModal = '工伤事件_商险理赔办理记录'
        //获取记录
        httpAction(this.url.socialClaims+'?id='+record.id+'&payMainType=1&type=0',null,'get').then((res)=>{
          if(res.code == 200){
            this.$refs.HandleRecordForm.status = filterDictText(this.auditStatusOption, record.auditStatus)
            this.$refs.HandleRecordForm.show(record,res.data,1)
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      //转为仲裁
      turnArbitrate(record){
        this.$refs.TurnArbitrateModalForm.title = '转为仲裁'
        this.$refs.TurnArbitrateModalForm.businessTypeDicts = this.businessTypeDicts
        httpAction(this.url.getDetail+record.id,null,'get').then((res)=>{
          if(res.code == 200){
            this.$refs.TurnArbitrateModalForm.edit(res.data)
          }
        })
      },
      // 数据字典
      initDictConfig() {
        initDictOptions('injury_audit_status').then((res) => {
          if (res.code === 200) {
            this.auditStatusOption = res.data
          }
        })
        // 业务类型
        httpAction(`/hrBase/sysdictbusinesstype/getSysDictBusinessTypeList`,null,'get').then(res=>{
          if (res.code === 200) {
            this.businessTypeDicts = res.data;
          }
        })
        // 事件类别
        initDictOptions('emergency_event_type').then(res => {
          if (res.code === 200) {
            this.eventTypeOptions = res.data
          }
        })
        //治疗类型
        initDictOptions('treatment_type').then(res => {
          if (res.code === 200) {
            this.treatmentTypeOption = res.data
          }
        })
      },
      loadCustomerTreeData() {
        httpAction(this.url.getTreeData,null,'get').then((res) => {
          this.customerTreeData = res.data;
        });
      },
      loadOrgination(){
        //获取皖信组织构架
        httpAction(this.url.organization, {}, 'get').then((res) => {
          if(res.code == 200){
            this.organizationOption = res.data
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      
      // 获取所属结构组织架构
      getBelongOrganization(){
        httpAction(this.url.getBelongOrg, {}, 'get').then((res) => {
          if(res.code == 200){
            this.belongOrganization = res.data
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      changeDepart(value, node){
        this.queryParam.orgCode = node.dataRef.orgCode
      },
      changeRange(value, dateString){
        this.queryParam.startDate = dateString[0]
        this.queryParam.endDate = dateString[1]
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

.searchForm .labelTxt {
  :global(.ant-form-item-label) {
    width: 105px;
    text-align: right;
  }
}
</style>
