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
          <a @click="handleAudit(record)">审核</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <abitration-audit-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></abitration-audit-modal>
    <process-record-modal ref="ProcessRecordModalForm"></process-record-modal>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction } from '@/api/manage'
  import AbitrationAuditModal from './modules/AbitrationAuditModal'
  import ProcessRecordModal from './modules/ProcessRecordModal'
  // import { getAllSettleDomainSelectVos } from '@/api/api'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'LitigationAudit',
    mixins: [JeecgListMixin],
    components: {
      AbitrationAuditModal,
      ProcessRecordModal
    },
    data() {
      return {
        description: '诉讼事件审核',
        auditStatusOption:[],
        businessTypeDicts:[], //业务类型
        settleDomainOptions:[], //结算主体
        retiredTypeOption:[], //退工事件类别
        typeOption:['普通事件','重大事件','仲裁事件','诉讼事件'],
        
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
            title: '发起人',
            align: 'center',
            dataIndex: 'reportUserName'
          },
          {
            title: '流程发起时间',
            align: 'center',
            dataIndex: 'reportDate',
          },
          {
            title: '流程状态',
            align: 'center',
            dataIndex: 'auditStatus',
            scopedSlots: { customRender: 'auditStatus' }
          },
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
          //     if(text == null || text == ''){
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
          list: '/hrEmergency/tlitigationevent/auditOrHandle/page',
          getDetailById: '/hrEmergency/tlitigationevent/',
          getDetail: '/hrEmergency/tlitigationevent/vo/',
        }
      }
    },
    created(){
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
    },
    methods: {
      filterDictText,
      moment,
      getLabel(type){
        let arr = type.replace(/^(\s|,)+|(\s|,)+$/g, '').split(',');
        let str = ''
        for(let item of arr){
          str += this.typeOption[item]+' '
        }
        return str
      },
      // 审核
      handleAudit: function(record) {
        this.$refs.modalForm.title = '诉讼事件_审核'
        this.$refs.modalForm.auditStatus = '状态：'+filterDictText(this.auditStatusOption, record.auditStatus)
        this.$refs.modalForm.businessTypeDicts = this.businessTypeDicts
        this.$refs.modalForm.flag = 4
        this.$refs.modalForm.auditPass = 'wxhr:tLitigationEvent_audit_pass'
        this.$refs.modalForm.auditExtra = 'wxhr:tLitigationEvent_to_supplemented'
        this.$refs.modalForm.auditBack = 'wxhr:tLitigationEvent_back'

        this.$refs.modalForm.url.getDetailById = '/hrEmergency/tlitigationevent/'
        this.$refs.modalForm.url.getEmpInsurance = '/hrEmergency/tlitigationevent/insertInfo/'
        this.$refs.modalForm.url.extraUrl = '/hrEmergency/tlitigationevent/toSupplemented'
        this.$refs.modalForm.url.backUrl = '/hrEmergency/tlitigationevent/back'
        this.$refs.modalForm.url.accessUrl = '/hrEmergency/tlitigationevent/auditPass'
        this.$refs.modalForm.settleDomainOptions = this.settleDomainOptions
        this.$refs.modalForm.auditStatusOption = this.auditStatusOption
        this.$refs.modalForm.tabTitle = '诉讼事件'
        this.$refs.modalForm.url.getHistory = '/hrEmergency/tlitigationevent/old/'
        this.$refs.modalForm.type = null

        //获取详情
        httpAction(this.url.getDetail + record.id, null, 'get').then(result => {
          if (result.code == 200) {
            this.$refs.modalForm.eventTypeName = filterDictText(this.retiredTypeOption, result.data.eventType)
            
            if(record.workInjuryId){ //工伤事件
              this.$refs.modalForm.type = 0
            }else if(record.nonWorkId){
              this.$refs.modalForm.type = 1
            }else if(record.retiredId){
              this.$refs.modalForm.type = 2
            }else if(record.complaintId){
              this.$refs.modalForm.type = 5
            }
            //结算主体名称
            result.data.abitrationEvent = result.data.litigationEvent
            result.data.abitrationEvent.departName = (this.settleDomainOptions[result.data.litigationEvent.emSettleId]) ? this.settleDomainOptions[result.data.litigationEvent.emSettleId].departName : ''
            this.$refs.modalForm.edit(result.data,record.id)
         
          }else{
            this.$message.error(result.msg)
          }
        })
      },
      //查看流程记录
      processRecord(record){
        this.$refs.ProcessRecordModalForm.edit(record,4)
      },
      // 数据字典
      initDictConfig() {
        initDictOptions('nonwork_audit_status').then((res) => {
          if (res.code === 200) {
            this.auditStatusOption = res.data
          }
        });
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
