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
            <a-form-item label="发起人部门" class="labelTxt">
              <a-tree-select
                showSearch
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="belongOrganization"
                :allowClear="true"
                placeholder="所在部门"
                v-model="queryParam.orgCode_extra"
                @select="changeDepart"
                @change="handleChange"
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
              {{ filterDictText(auditStatusOption, text) }}
            </a-tag>
          </template>
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleDetail(record)"
            v-has="'wxhr:abitration_search_detail'"
          >详情</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tAbitrationEvent_legalAdvice'"
          />
          <a
            @click="handleAdvice(record)"
            v-has="'wxhr:tAbitrationEvent_legalAdvice'"
          >法务意见</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:abitration_record'"
          />
          <a
            @click="injuryClaims(record)"
            v-has="'wxhr:abitration_record'"
          >办结记录</a>
          <a-divider
            type="vertical"
            v-if="!record.typeLabel || record.typeLabel == 1"
            v-has="'wxhr:tLitigationEvent_add'"
          />
          <a
            @click="turnLitigation(record)"
            v-if="!record.typeLabel || record.typeLabel == 1"
            v-has="'wxhr:tLitigationEvent_add'"
          >转为诉讼</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <abitration-audit-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></abitration-audit-modal>
    <social-claims-record-modal ref="SocialClaimsRecordModalForm"></social-claims-record-modal>
    <turn-arbitrate-modal
      ref="TurnArbitrateModalForm"
      @ok="modalFormOk"
    ></turn-arbitrate-modal>
    <process-record-modal ref="ProcessRecordModalForm"></process-record-modal>
    <legal-advice-modal ref="LegalAdviceModalForm" @ok="modalFormOk"></legal-advice-modal>
    <handle-record-modal ref="HandleRecordForm" :title="titleModal" :feeTypeOption="feeTypeOption"></handle-record-modal>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  // import { getAllSettleDomainSelectVos } from '@/api/api'
  import { httpAction } from '@/api/manage'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import AbitrationAuditModal from './modules/AbitrationAuditModal' //详情
  import SocialClaimsRecordModal from './modules/SocialClaimsRecordModal' //办结记录
  import TurnArbitrateModal from './modules/TurnArbitrateModal' //
  import ProcessRecordModal from './modules/ProcessRecordModal'
  import LegalAdviceModal from './modules/LegalAdviceModal'
  import SelectPage from '@/components/jeecg/SelectPage'
  import HandleRecordModal from './modules/HandleRecordModal'

  export default {
    name: 'AbitrationSearch',
    mixins: [JeecgListMixin],
    components: {
      AbitrationAuditModal,
      SocialClaimsRecordModal,
      TurnArbitrateModal,
      ProcessRecordModal,
      SelectPage,
      LegalAdviceModal,
      HandleRecordModal
    },
    data() {
      return {
        description: '仲裁查询列表',
        auditStatusOption:[],
        typeOption:['普通事件','重大事件','仲裁事件','诉讼','监察诉讼'],
        retiredTypeOption:[],
        customerTreeData:[],
        belongOrganization:[],
        settleDomainOptions:[],
        businessTypeDicts:[], //业务类型
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
              return moment(text).format("YYYY-MM-DD")
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
            title: '流程状态',
            align: 'center',
            dataIndex: 'auditStatus',
            scopedSlots: { customRender: 'auditStatus' }
          },
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
          // {
          //   title: '标签',
          //   align: 'center',
          //   dataIndex: 'typeLabel',
          //   customRender: (text) => {
          //     if(text == null){
          //       return ''
          //     }
          //     return this.getLabel(text)
          //   }
          // },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/hrEmergency/tabitrationevent/page?selectType=0',
          getDetailById: '/hrEmergency/tabitrationevent/',
          injuryClaims:'/hrEmergency/tdealinfo/record', //办结记录
          getDetail:'/hrEmergency/tabitrationevent/vo/',
          getBelongOrg:'/admin/organizationinfo/getOrgToTree',
          getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        },
        feeTypeOption:[],
        titleModal:''
      }
    },
    created(){
      this.loadCustomerTreeData()
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
      moment,
      filterDictText,
      handleChange(val){
        if(!val){
          delete this.queryParam.orgCode
        }
      },
      getPopupContainerFun(triggerNode){
        let wid = getComputedStyle(triggerNode).width
        triggerNode.setAttribute('style','width:'+wid)
        return triggerNode.parentNode
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
        this.$refs.modalForm.title = '仲裁事件_详情'
        this.$refs.modalForm.auditStatus = '状态：'+filterDictText(this.auditStatusOption, record.auditStatus)
        this.$refs.modalForm.isOperate = false
        this.$refs.modalForm.businessTypeDicts = this.businessTypeDicts
        this.$refs.modalForm.settleDomainOptions = this.settleDomainOptions
        this.$refs.modalForm.auditStatusOption = this.auditStatusOption
        this.$refs.modalForm.type = null
        httpAction(this.url.getDetail+record.id,null,'get').then((result) => {
          if(result.code == 200){
            if(record.workInjuryId){ //工伤事件
              this.$refs.modalForm.type = 0
            }else if(record.nonWorkId){
              this.$refs.modalForm.type = 1
            }else if(record.retiredId){
              this.$refs.modalForm.type = 2
            }
            //结算主体名称
            result.data.abitrationEvent.departName = (this.settleDomainOptions[result.data.abitrationEvent.emSettleId]) ? this.settleDomainOptions[result.data.abitrationEvent.emSettleId].departName : ''
            this.$refs.modalForm.edit(result.data,record.id)
          }else{
            this.$message.error(result.msg)
          }
        })
      },
      // 法务意见
      handleAdvice(record){
        this.$refs.LegalAdviceModalForm.show(record)
      },
      //办结记录
      injuryClaims(record){
        this.titleModal = '仲裁事件_仲裁办理记录'
        //获取记录
        httpAction(this.url.injuryClaims+'?id='+record.id+'&payMainType=0&type=3',null,'get').then((res)=>{
          if(res.code == 200){
            this.$refs.HandleRecordForm.status = filterDictText(this.auditStatusOption, record.auditStatus)
            this.$refs.HandleRecordForm.show(record,res.data,0)
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      //转为诉讼
      turnLitigation(record){
        const _this = this
        //先判断是否有未办结的诉讼事件
        httpAction('/hrEmergency/tlitigationevent/event/'+record.empId,null,'get').then(result=>{
          if(result.code == 200){
            if(result.data){
              _this.$message.warning('该员工有未办结的事件')
              return false
            }else{
              _this.$refs.TurnArbitrateModalForm.title = '转为诉讼'
              _this.$refs.TurnArbitrateModalForm.tabTitle = '诉讼事件申报'
              _this.$refs.TurnArbitrateModalForm.url.submitUrl = '/hrEmergency/tlitigationevent'
              _this.$refs.TurnArbitrateModalForm.url.getEmpInsurance = '/hrEmergency/tabitrationevent/insertInfo/'
              _this.$refs.TurnArbitrateModalForm.businessTypeDicts = this.businessTypeDicts
              _this.$refs.TurnArbitrateModalForm.flag = 3
              httpAction(_this.url.getDetail+record.id,null,'get').then((res)=>{
                if(res.code == 200){
                  res.data.workInjuryEvent = res.data.abitrationEvent
                  _this.$refs.TurnArbitrateModalForm.edit(res.data)
                }
              })
            }
          }
        })
        
      },
      //查看流程记录
      processRecord(record){
        this.$refs.ProcessRecordModalForm.edit(record,3)
      },
      // 数据字典
      initDictConfig() {
        initDictOptions('nonwork_audit_status').then((res) => {
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
        //退工事件类型
        initDictOptions('retired_type').then(res => {
          if (res.code === 200) {
            this.retiredTypeOption = res.data
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
      loadCustomerTreeData() {
        httpAction(this.url.getTreeData,null,'get').then((res) => {
          this.customerTreeData = res.data;
        });
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

.searchForm .labelTxt {
  :global(.ant-form-item-label) {
    width: 105px;
    text-align: right;
  }
}
</style>
