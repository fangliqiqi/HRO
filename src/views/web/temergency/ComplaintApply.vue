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
                treeNodeFilterProp="title"
                v-model="queryParam.orgCode_extra"
                @change="handleChange"
                @select="changeDepart"
                treeDefaultExpandAll
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        v-has="'wxhr:tComplaintEvent_add'"
        @click="handleAdd"
      >监察诉讼申报</a-button>
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
            v-has="'wxhr:tComplaintEvent_detail'"
          >详情</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tComplaintEvent_edit'"
            v-if="record.auditStatus == 0 || record.auditStatus == 3"
          />
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:tComplaintEvent_edit'"
            v-if="record.auditStatus == 0 || record.auditStatus == 3"
          >编辑</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tComplaintEvent_batch_commit'"
            v-if="record.auditStatus == 0 || record.auditStatus == 2 || record.auditStatus == 3"
          />
          <a
            @click="handleSubmit(record)"
            v-has="'wxhr:tComplaintEvent_batch_commit'"
            v-if="record.auditStatus == 0 || record.auditStatus == 2 || record.auditStatus == 3"
          >提交</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tComplaintEvent_del'"
            v-if="record.auditStatus == 0 || record.auditStatus == 3"
          />
          <a-popconfirm
            title="确定删除吗?"
            v-has="'wxhr:tComplaintEvent_del'"
            v-if="record.auditStatus == 0 || record.auditStatus == 3"
            @confirm="() => handleDelete(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>

        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <abitration-apply-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></abitration-apply-modal>
    <abitration-audit-modal
      ref="AbitrationAuditModalForm"
      @ok="modalFormOk"
    ></abitration-audit-modal>
    <abitration-submit-modal
      ref="AbitrationSubmitModalForm"
      @ok="modalFormOk"
    ></abitration-submit-modal>
    <abitration-apply-edit-modal
      ref="AbitrationApplyEditModalForm"
      @ok="modalFormOk"
    ></abitration-apply-edit-modal>
    <process-record-modal ref="ProcessRecordModalForm"></process-record-modal>

    <injury-attach-modal ref="InjuryAttachModalForm"></injury-attach-modal>

  </a-card>
</template>

<script>
  import moment from 'moment'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import AbitrationApplyModal from './modules/AbitrationApplyModal'
  import AbitrationAuditModal from './modules/AbitrationAuditModal'
  import AbitrationSubmitModal from './modules/AbitrationSubmitModal'
  import AbitrationApplyEditModal from './modules/AbitrationApplyEditModal'
  import ProcessRecordModal from './modules/ProcessRecordModal'
  import InjuryAttachModal from './modules/InjuryAttachModal'
  // import { getAllSettleDomainSelectVos } from '@/api/api'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'ComplaintApply',
    mixins: [JeecgListMixin],
    components: {
      AbitrationApplyModal,
      AbitrationAuditModal,
      AbitrationSubmitModal,
      AbitrationApplyEditModal,
      ProcessRecordModal,
      SelectPage,
      InjuryAttachModal
    },
    data() {
      return {
        description: '诉讼申请列表',
        fileList: [],
        auditStatusOption:[],
        typeOption:['普通事件','重大事件','仲裁事件','诉讼事件','监察诉讼'],
        businessTypeDicts:[], //业务类型
        settleDomainOptions:[],
        customerTreeData:[],
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
          {
            title: '材料提交截止日期',
            align: 'center',
            dataIndex: 'lastMaterialSubDate',
            customRender: (text) => {
              return (text) ? text : '--'
            }
          },
          // {
          //   title: '事件标识',
          //   align: 'center',
          //   dataIndex: 'type',
          //   customRender: (text) => {
          //     return this.typeOption[text]
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
          list: '/hrEmergency/tcomplaintevent/page',
          delete:'/hrEmergency/tcomplaintevent/',
          queryAllInfoById: '/hrEmergency/tcomplaintevent/vo/',
          getinfo: '/hrBase/temployeeinfo/', //根据员工ID查询员工信息
          getCustomerById: '/hrBase/tcustomerinfo/getCusNameAndBusinessType', //查询客户单位
          againCommit:'/hrEmergency/tcomplaintevent/commitAgain/', //再次提交
          getBelongOrg:'/admin/organizationinfo/getOrgToTree',
          getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        }
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
    },
    methods: {
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
      // 新建
      handleAdd: function() {
        this.$refs.modalForm.title = '监察诉讼申报'
        this.$refs.modalForm.url.getEmpInsurance = '/hrEmergency/tcomplaintevent/insertInfo/'
        this.$refs.modalForm.url.submitApplyUrl = '/hrEmergency/tcomplaintevent'
        this.$refs.modalForm.url.empValidator = '/hrEmergency/tcomplaintevent/event/'
        this.$refs.modalForm.settleDomainOptions = this.settleDomainOptions
        this.$refs.modalForm.flag = 5
        this.$refs.modalForm.edit()
      },
      handleDetail(record){
        this.$refs.AbitrationAuditModalForm.title = '监察投诉事件_详情'
        this.$refs.AbitrationAuditModalForm.url.getDetailById = '/hrEmergency/tcomplaintevent/'
        this.$refs.AbitrationAuditModalForm.url.getEmpInsurance = '/hrEmergency/tcomplaintevent/insertInfo/'
        this.$refs.AbitrationAuditModalForm.flag = 5
        this.$refs.AbitrationAuditModalForm.auditStatus = '状态：'+filterDictText(this.auditStatusOption, record.auditStatus)
        this.$refs.AbitrationAuditModalForm.isOperate = false
        this.$refs.AbitrationAuditModalForm.businessTypeDicts = this.businessTypeDicts
        this.$refs.AbitrationAuditModalForm.settleDomainOptions = this.settleDomainOptions
        this.$refs.AbitrationAuditModalForm.auditStatusOption = this.auditStatusOption
        this.$refs.AbitrationAuditModalForm.tabTitle = '监察投诉事件'
        this.$refs.AbitrationAuditModalForm.url.getHistory = '/hrEmergency/tcomplaintevent/old/'
        this.$refs.AbitrationAuditModalForm.type = null //0工伤事件转1非因工事件转

        httpAction(this.url.queryAllInfoById+record.id,null,'get').then((result) => {
          if(result.code == 200){
            if(record.workInjuryId){ //工伤事件
              this.$refs.AbitrationAuditModalForm.type = 0
            }else if(record.nonWorkId){
              this.$refs.AbitrationAuditModalForm.type = 1
            }else if(record.retiredId){
              this.$refs.AbitrationAuditModalForm.type = 2
            }
            result.data.abitrationEvent = result.data.complaintEvent
            //结算主体名称
            result.data.abitrationEvent.departName = (this.settleDomainOptions[result.data.complaintEvent.emSettleId]) ? this.settleDomainOptions[result.data.complaintEvent.emSettleId].departName : ''
            this.$refs.AbitrationAuditModalForm.edit(result.data,record.id)
          }else{
            this.$message.error(result.msg)
          }
        })
        
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.modalForm.title = '监察投诉事件_编辑'
        if(record.auditStatus == 2){
          this.$refs.InjuryAttachModalForm.flag = 5
          this.$refs.InjuryAttachModalForm.edit(record)
        }else{
          const _this = this
          httpAction(this.url.queryAllInfoById+record.id,null,'get').then((res) => {
            if(res.code == 200){
              httpAction(_this.url.getinfo+record.empId,null,'get').then((result) => {
                if(result.code == 200){
                  //查询客户单位
                  httpAction(this.url.getCustomerById+'?cusId='+result.data.belongUnit+'&settleDomainId='+result.data.settleDomain,null,'get').then((results) => {
                    result.data.customerName = results.data.cusName //客户单位 this.businessTypeDicts
                    result.data.businessType = results.data.businessType
                    this.$refs.AbitrationApplyEditModalForm.method = 'put'
                    this.$refs.AbitrationApplyEditModalForm.flag = 5
                     this.$refs.AbitrationApplyEditModalForm.settleDomainOptions = this.settleDomainOptions
                    this.$refs.AbitrationApplyEditModalForm.url.submitApplyUrl = '/hrEmergency/tcomplaintevent'
                    res.data.abitrationEvent = res.data.complaintEvent
                    delete res.data.complaintEvent
                    this.$refs.AbitrationApplyEditModalForm.edit(res.data,result.data)
                  });
                }
              })
              
            }
          })
        }
      },
      // 提交
      handleSubmit: function(record) {
        let _this = this
        //状态为材料待补充时直接提交
        if(record.auditStatus == 2){
          this.$confirm({
            title: '确认再次提交么?',
            onOk() {
              httpAction(_this.url.againCommit+record.id,null,'post').then((res) => {
                if(res.code == 200){
                  _this.$message.success('提交成功')
                  _this.loadData()
                }else{
                  _this.$message.error(res.msg)
                }
              })
            }
          });
        }else{
          this.$refs.AbitrationSubmitModalForm.permissionStr = 'wxhr:tComplaintEvent_end'
          this.$refs.AbitrationSubmitModalForm.url.submitUrl = '/hrEmergency/tcomplaintevent/batch/commit'
          this.$refs.AbitrationSubmitModalForm.edit(record)
        }
      },
      //查看流程记录
      processRecord(record){
        this.$refs.ProcessRecordModalForm.edit(record,5)
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
