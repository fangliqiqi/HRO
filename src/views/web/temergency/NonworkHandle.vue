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
            <a-form-item label="发起人">
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
            <a-form-item label="当事人">
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
            <a-form-item label="当事人身份证">
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
              <a-form-item label="事件编码">
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
          slot="posite"
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
          <a @click="handleDetail(record)">详情</a>
          <a-divider
            type="vertical"
            v-if="userInfo.id == record.insuranceHandleMan"
          />
          <a
            @click="handleInsuranceClaims(record)"
            v-if="userInfo.id == record.insuranceHandleMan"
          >商险理赔</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <nonwork-audit-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></nonwork-audit-modal>
    <nonwork-claims-modal
      ref="NonworkClaimsModalForm"
      @ok="modalFormOk"
    >
    </nonwork-claims-modal>
    <process-record-modal ref="ProcessRecordModalForm"></process-record-modal>
    <insurance-claim-modal ref="InsuranceClaimForm" :title="modalTitle" :feeTypeOption="feeTypeOption" @ok="modalFormOk"></insurance-claim-modal>
  </a-card>
</template>

<script>
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  // import { getAllSettleDomainSelectVos } from '@/api/api'
  import { httpAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import NonworkAuditModal from './modules/NonworkAuditModal'
  import NonworkClaimsModal from './modules/NonworkClaimsModal'
  import ProcessRecordModal from './modules/ProcessRecordModal'
  import moment from 'moment'
  import InsuranceClaimModal from './modules/InsuranceClaimModal'

  export default {
    name: 'NonworkHandle',
    mixins: [JeecgListMixin],
    components: {
      NonworkAuditModal,
      NonworkClaimsModal,
      ProcessRecordModal,
      InsuranceClaimModal
    },
    data() {
      return {
        description: '事件办理',
        typeOption:['普通事件','重大事件','仲裁事件'],
        injuryStatusOption:['不办理','待办理','办理中','办结'],
        auditStatusOption:[],
        businessTypeDicts:[],
        eventTypeOptions:[],
        treatmentTypeOption:[],
        userInfo:{},
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
            scopedSlots: { customRender: 'posite' }
          },
          {
            title: '流程发起人',
            align: 'center',
            dataIndex: 'reportUserName'
          },
          {
            title: '事件标签',
            align: 'center',
            dataIndex: 'type',
            customRender: (text) => {
              return this.typeOption[text]
            }
          },
          {
            title: '流程状态',
            align: 'center',
            dataIndex: 'auditStatus',
            scopedSlots: { customRender: 'auditStatus' }
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/hrEmergency/tnonworkevent/auditOrHandle/page?selectType=1',
          getRecordUrl:'/hrEmergency/tdealinfo/record',
          getTreeData: '/hrBase/tcustomerinfo/ValueTree',
          getDetailById: '/hrEmergency/tnonworkevent/vo/', //获取当条记录详情
          organization:'/admin/organizationinfo/getOrgForCus', //获取皖信组织架构
        },
        modalTitle:'',
        feeTypeOption:[],
      }
    },
    created() {
      this.userInfo = this.$store.getters.userInfo
      this.loadCustomerTreeData()
      this.loadOrgination()
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
      // 详情
      handleDetail(record){
        this.$refs.modalForm.title = '非因工事件_详情'
        this.$refs.modalForm.auditStatus = '状态：'+filterDictText(this.auditStatusOption, record.auditStatus)
        this.$refs.modalForm.isOperate = false
        this.$refs.modalForm.businessTypeDicts = this.businessTypeDicts
        this.$refs.modalForm.settleDomainOptions = this.settleDomainOptions
        this.$refs.modalForm.treatmentTypeOption = this.treatmentTypeOption
        this.$refs.modalForm.organizationOption = this.organizationOption
        this.$refs.modalForm.customerTreeData = this.customerTreeData
        this.$refs.modalForm.eventTypeOptions = this.eventTypeOptions
        //获取详情
        httpAction(this.url.getDetailById + record.id, null, 'get').then(result => {
          if (result.code == 200) {
            this.$refs.modalForm.edit(result.data)
          }else{
            this.$message.error(result.msg)
          }
        })
        
      },
      //查看流程记录
      processRecord(record){
        this.$refs.ProcessRecordModalForm.edit(record,1)
      },
      //商险理赔
      handleInsuranceClaims(record){
        this.modalTitle = '非因工事件_商险理赔'
        //获取记录
        httpAction(this.url.getRecordUrl+'?id='+record.id+'&payMainType=1&type=1',null,'get').then((res)=>{
          if(res.code == 200){
            this.$refs.InsuranceClaimForm.url.endInjury = '/hrEmergency/tnonworkevent/end/'
            this.$refs.InsuranceClaimForm.url.deadlineUrl = '/hrEmergency/tnonworkevent/lastInsuranceMaterialSubDate'
            this.$refs.InsuranceClaimForm.edit(record,res.data,1,1)
          }else{
            this.$message.warning(res.msg)
          }
        })
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
        //治疗类型
        initDictOptions('treatment_type').then(res => {
          if (res.code === 200) {
            this.treatmentTypeOption = res.data
          }
        })
        // 事件类别
        initDictOptions('emergency_event_type').then(res => {
          if (res.code === 200) {
            this.eventTypeOptions = res.data
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
</style>
