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
            <a-form-item label="申报人" class="labelTxt">
              <a-input
                placeholder="请输入申报人"
                v-model="queryParam.reportUserName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="申报人部门" class="labelTxt">
              <a-tree-select
                showSearch
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="belongOrganization"
                :allowClear="true"
                placeholder="请选择申报人部门"
                v-model="queryParam.orgCode_extra"
                @select="changeDepart"
                treeDefaultExpandAll
                :dropdownMatchSelectWidth="false"
                treeNodeFilterProp="title"
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
          <template v-if="toggleSearchStatus">
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
              <a-form-item label="事件类型" class="labelTxt">
                <a-select
                  v-model="queryParam.emergencyType"
                  placeholder="请选择事件类型"
                >
                  <a-select-option
                    v-for="(item,index) in emergencyType"
                    :key="index"
                    :value="index">{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="事件状态" class="labelTxt">
                <a-select
                  v-model="queryParam.auditStatus"
                  placeholder="请选择事件状态"
                >
                  <a-select-option
                    v-for="item in auditStatusOption"
                    v-if="item.value != 6"
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
              <a-form-item label="发起时间" class="labelTxt">
                <a-range-picker
                  v-model="queryParam.applyTime_extra"
                  @change="changeApply"
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

    <div class="table-operator">
      <a-button
        type="primary"
        icon="download"
        :loading="confirmLoading"
        @click="exportExcel"
        v-has="'wxhr:emergencyview_doexport'"
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :scroll="{ x: 1}"
      >
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
            v-if="record.auditStatus=='4'||record.auditStatus=='5'"
            v-has="'wxhr:emergencyview_transferred'"
            @click="handleTransfer(record)"
          >转办</a>
          <a-divider
            v-if="record.auditStatus=='4'||record.auditStatus=='5'"
            v-has="'wxhr:emergencyview_transferred'"
            type="vertical"
          />
          <a
            @click="handleDetail(record)"
          >详情</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <injury-audit-modal
      ref="InjuryAuditModalForm"
      @ok="modalFormOk"
    ></injury-audit-modal>
    <social-claims-record-modal ref="SocialClaimsRecordModalForm"></social-claims-record-modal>
    <nonwork-audit-modal ref="NonworkAuditModalForm"></nonwork-audit-modal>
    <retired-audit-modal ref="RetiredAuditmodalForm"></retired-audit-modal>
    <abitration-audit-modal ref="AbitrationModalForm"></abitration-audit-modal>
    <process-record-modal ref="ProcessRecordModalForm"></process-record-modal>
    <transfer-modal ref="TransferModal" @ok="modalFormOk"></transfer-modal>     
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  // import { getAllSettleDomainSelectVos } from '@/api/api'
  import { httpAction } from '@/api/manage'
  import { getNameFromTree,getNameFromArr } from '@/utils/common'
  import { initDictOptions,filterDictText,filterDict } from '@/components/dict/JDictSelectUtil'
  import InjuryAuditModal from './modules/InjuryAuditModal'
  import NonworkAuditModal from './modules/NonworkAuditModal' //详情
  import RetiredAuditModal from './modules/RetiredAuditModal'
  import AbitrationAuditModal from './modules/AbitrationAuditModal'
  import SocialClaimsRecordModal from './modules/SocialClaimsRecordModal'
  import TurnArbitrateModal from './modules/TurnArbitrateModal'
  import ProcessRecordModal from './modules/ProcessRecordModal'
  import SelectPage from '@/components/jeecg/SelectPage'
  import TransferModal from './modules/TransferModal'

  export default {
    name: 'EmergeSearch',
    mixins: [JeecgListMixin],
    components: {
      InjuryAuditModal,
      SocialClaimsRecordModal,
      TurnArbitrateModal,
      ProcessRecordModal,
      SelectPage,
      NonworkAuditModal,
      RetiredAuditModal,
      AbitrationAuditModal,
      TransferModal
    },
    data() {
      return {
        description: '事件查询列表',
        auditStatusOption:[],
        typeOption:['普通事件','重大事件','仲裁事件','诉讼事件','监察投诉'],
        socialStatus:['已购买，与劳动合同起始时间一致','已购买，与劳动合同起始时间不一致','未购买'],
        socialClaimsFeeTypeDicts:[],
        injuryCostTypeDicts:[],
        customerTreeData:[], //客户单位
        organizationOption:[],
        businessTypeDicts:[], //业务类型
        treatmentTypeOption:[], //治疗类型
        settleDomainOptions:[],
        eventTypeOptions:[],
        belongOrganization:[],
        nonworkTypeOptions:[],
        retiredTypeOption:[],
        emergencyType:['工伤','非因工','退工','仲裁','诉讼','监察投诉'], //事件类型
        // 表头
        columns: [
          {
            title: '事件编码',
            align: 'center',
            width:140,
            ellipsis: true,
            dataIndex: 'eventCode',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: '当事人',
            align: 'center',
            width:140,
            ellipsis: true,
            dataIndex: 'emName',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: '身份证号码',
            align: 'center',
            width:180,
            ellipsis: true,
            dataIndex:'emIdCard',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: '事件类型',
            align: 'center',
            width:120,
            ellipsis: true,
            dataIndex:'emergencyType',
            customRender:(text)=>{
              let type = this.emergencyType[text]
              return <a-tooltip
                placement="topLeft"
                title={type}
              >{type}</a-tooltip>
            }
          },
          {
            title: '事件发生时间',
            align: 'center',
            width:120,
            ellipsis: true,
            dataIndex: 'eventOccurrenceTime',
            customRender:(text)=>{
              let time = moment(text).format('YYYY-MM-DD')
              return <a-tooltip
                placement="topLeft"
                title={time}
              >{time}</a-tooltip>
            }
          },
          {
            title: '参保所在地',
            align: 'center',
            width:120,
            ellipsis: true,
            dataIndex: 'provinceName',
            customRender:(text,record)=>{
              let name = (text || '') + (record.cityName || '') + (record.townName || '')
              return <a-tooltip
                placement="topLeft"
                title={name}
              >{name}</a-tooltip>
            }
          },
          {
            title: '流程发起人',
            align: 'center',
            ellipsis: true,
            width:260,
            dataIndex: 'reportUserName',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: '发起时间',
            align: 'center',
            dataIndex: 'reportDate',
            width:120,
            ellipsis: true,
            customRender:(text)=>{
              let time = moment(text).format('YYYY-MM-DD')
              return <a-tooltip
                placement="topLeft"
                title={time}
              >{time}</a-tooltip>
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
            width:120,
            ellipsis: true,
            customRender:(text)=>{
              let name = (text == null) ? '普通事件' : this.getLabel(text)
              return <a-tooltip
                placement="topLeft"
                title={name}
              >{name}</a-tooltip>
            }
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'auditStatus',
            width:120,
            ellipsis: true,
            customRender:(text)=>{
              let status = filterDictText(this.auditStatusOption,text)
              return <a-tooltip
                placement="topLeft"
                title={status}
              >{status}</a-tooltip>
            }
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width:120,
            fixed:'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/hrEmergency/emergencyview/page',
          socialClaims:'/hrEmergency/tdealinfo/record', //工伤理赔记录
          getDetail:'/hrEmergency/tworkinjuryevent/vo/',
          getTreeData: '/hrBase/tcustomerinfo/ValueTree',
          getBelongOrg:'/admin/organizationinfo/getOrgToTree',
          organization:'/admin/organizationinfo/getOrgForCus', //获取皖信组织架构
          exportUrl:'/hrEmergency/emergencyview/doexport/emergencyVo'
        },
        exportField:[
          '突发事件类型','当事人','身份证号','事件发生时间','发起时间','流程状态','事件等级','流程发起人','社保缴纳地-省',
          '社保缴纳地-市','社保缴纳地-县','事件经过'
        ],
        form: this.$form.createForm(this),
        visible:false,
        confirmLoading:false,

      }
    },
    created() {
      this.loadCustomerTreeData()
      this.loadOrgination()
      this.getBelongOrganization()
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
      getPopupContainerFun(triggerNode){
        let wid = getComputedStyle(triggerNode).width
        triggerNode.setAttribute('style','width:'+wid)
        return triggerNode.parentNode
      },
      getLabel(type){
        let arr = type.replace(/^(\s|,)+|(\s|,)+$/g, '').split(',');
        let res = []
        for(let i=0;i<arr.length;i++){
          res[i] = this.typeOption[arr[i]]
        }
        return res.join(',')
      },
      // 转办
      handleTransfer(record){
        this.$refs.TransferModal.title="转办"
        this.$refs.TransferModal.show(record)

      },
      //查看详情
      handleDetail(record){
        let statusTxt = '';
        switch (record.emergencyType){
          case "0":
            this.$refs.InjuryAuditModalForm.title = '工伤事件_详情'
            statusTxt = filterDictText(this.auditStatusOption, record.auditStatus);
            this.$refs.InjuryAuditModalForm.auditStatus = '状态：'+ statusTxt;
            this.$refs.InjuryAuditModalForm.isOperate = false
            this.$refs.InjuryAuditModalForm.businessTypeDicts = this.businessTypeDicts
            this.$refs.InjuryAuditModalForm.settleDomainOptions = this.settleDomainOptions
            this.$refs.InjuryAuditModalForm.treatmentTypeOption = this.treatmentTypeOption
            this.$refs.InjuryAuditModalForm.organizationOption = this.organizationOption
            this.$refs.InjuryAuditModalForm.customerTreeData = this.customerTreeData
            this.$refs.InjuryAuditModalForm.eventTypeOptions = this.eventTypeOptions
            httpAction(this.url.getDetail+record.id,null,'get').then((res) => {
              if(res.code == 200){
                this.$refs.InjuryAuditModalForm.edit(res.data,true,statusTxt)
              }
            })
            break;
          case "1":
            this.$refs.NonworkAuditModalForm.title = '非因工事件_详情'
            statusTxt = filterDictText(this.auditStatusOption, record.auditStatus);
            this.$refs.NonworkAuditModalForm.auditStatus = '状态：'+statusTxt;
            this.$refs.NonworkAuditModalForm.isOperate = false
            this.$refs.NonworkAuditModalForm.businessTypeDicts = this.businessTypeDicts
            this.$refs.NonworkAuditModalForm.settleDomainOptions = this.settleDomainOptions
            this.$refs.NonworkAuditModalForm.treatmentTypeOption = this.treatmentTypeOption
            this.$refs.NonworkAuditModalForm.organizationOption = this.organizationOption
            this.$refs.NonworkAuditModalForm.customerTreeData = this.customerTreeData
            this.$refs.NonworkAuditModalForm.eventTypeOptions = this.nonworkTypeOptions
            //获取详情
            httpAction('/hrEmergency/tnonworkevent/vo/' + record.id, null, 'get').then(result => {
              if (result.code == 200) {
                this.$refs.NonworkAuditModalForm.edit(result.data,true,statusTxt)
              }else{
                this.$message.error(result.msg)
              }
            })
            break;
          case "2":
            this.$refs.RetiredAuditmodalForm.title = '退工事件_详情'
            statusTxt = filterDictText(this.auditStatusOption, record.auditStatus);
            this.$refs.RetiredAuditmodalForm.auditStatus = '状态：'+statusTxt;
            this.$refs.RetiredAuditmodalForm.isOperate = false
            this.$refs.RetiredAuditmodalForm.businessTypeDicts = this.businessTypeDicts
            this.$refs.RetiredAuditmodalForm.flag = 2
            this.$refs.RetiredAuditmodalForm.settleDomainOptions = this.settleDomainOptions
            this.$refs.RetiredAuditmodalForm.eventTypeOptions = this.retiredTypeOption
            //获取详情
            httpAction('/hrEmergency/tretiredworkevent/vo/' + record.id, null, 'get').then(result => {
              if (result.code == 200) {
                this.$refs.RetiredAuditmodalForm.edit(result.data,true,statusTxt)
              }else{
                this.$message.error(result.msg)
              }
            })
            break;
          case "3":
            this.$refs.AbitrationModalForm.title = '仲裁事件_详情'
            statusTxt = filterDictText(this.auditStatusOption, record.auditStatus);
            this.$refs.AbitrationModalForm.auditStatus = '状态：'+statusTxt
            this.$refs.AbitrationModalForm.isOperate = false
            this.$refs.AbitrationModalForm.businessTypeDicts = this.businessTypeDicts
            this.$refs.AbitrationModalForm.settleDomainOptions = this.settleDomainOptions
            this.$refs.AbitrationModalForm.auditStatusOption = this.auditStatusOption
            this.$refs.AbitrationModalForm.type = null
            httpAction('/hrEmergency/tabitrationevent/vo/'+record.id,null,'get').then((result) => {
              if(result.code == 200){
                if(record.workInjuryId){ //工伤事件
                  this.$refs.AbitrationModalForm.type = 0
                }else if(record.nonWorkId){
                  this.$refs.AbitrationModalForm.type = 1
                }else if(record.retiredId){
                  this.$refs.AbitrationModalForm.type = 2
                }
                //结算主体名称
                result.data.abitrationEvent.departName = (this.settleDomainOptions[result.data.abitrationEvent.emSettleId]) ? this.settleDomainOptions[result.data.abitrationEvent.emSettleId].departName : '';

                this.$refs.AbitrationModalForm.edit(result.data,record.id,true,3)
              }else{
                this.$message.error(result.msg)
              }
            })
            break;
          case "4":
            this.$refs.AbitrationModalForm.title = '诉讼事件_详情'
            this.$refs.AbitrationModalForm.flag = 4
            this.$refs.AbitrationModalForm.url.getDetailById = '/hrEmergency/tlitigationevent/'
            this.$refs.AbitrationModalForm.url.getEmpInsurance = '/hrEmergency/tlitigationevent/insertInfo/'
            this.$refs.AbitrationModalForm.auditStatus = '状态：'+filterDictText(this.auditStatusOption, record.auditStatus)
            this.$refs.AbitrationModalForm.isOperate = false
            this.$refs.AbitrationModalForm.businessTypeDicts = this.businessTypeDicts
            this.$refs.AbitrationModalForm.settleDomainOptions = this.settleDomainOptions
            this.$refs.AbitrationModalForm.auditStatusOption = this.auditStatusOption
            this.$refs.AbitrationModalForm.tabTitle = '诉讼事件'
            this.$refs.AbitrationModalForm.url.getHistory = '/hrEmergency/tlitigationevent/old/'
            this.$refs.AbitrationModalForm.type = null
            //获取详情
            httpAction('/hrEmergency/tlitigationevent/vo/' + record.id, null, 'get').then(result => {
              if (result.code == 200) {
                this.$refs.AbitrationModalForm.eventTypeName = filterDictText(this.retiredTypeOption, result.data.eventType)
                if(record.workInjuryId){ //工伤事件
                  this.$refs.AbitrationModalForm.type = 0
                }else if(record.nonWorkId){
                  this.$refs.AbitrationModalForm.type = 1
                }else if(record.retiredId){
                  this.$refs.AbitrationModalForm.type = 2
                }else if(record.complaintId){
                  this.$refs.AbitrationModalForm.type = 5
                }
                //结算主体名称
                result.data.abitrationEvent = result.data.litigationEvent
                result.data.abitrationEvent.departName = (this.settleDomainOptions[result.data.litigationEvent.emSettleId]) ? this.settleDomainOptions[result.data.litigationEvent.emSettleId].departName : ''
                this.$refs.AbitrationModalForm.edit(result.data,record.id,true,4)
              }else{
                this.$message.error(result.msg)
              }
            })
            break;
          case "5":
            this.$refs.AbitrationModalForm.title = '监察投诉事件_详情'
            this.$refs.AbitrationModalForm.flag = 5
            this.$refs.AbitrationModalForm.url.getDetailById = '/hrEmergency/tcomplaintevent/'
            this.$refs.AbitrationModalForm.url.getEmpInsurance = '/hrEmergency/tcomplaintevent/insertInfo/'
            this.$refs.AbitrationModalForm.auditStatus = '状态：'+filterDictText(this.auditStatusOption, record.auditStatus)
            this.$refs.AbitrationModalForm.isOperate = false
            this.$refs.AbitrationModalForm.businessTypeDicts = this.businessTypeDicts
            this.$refs.AbitrationModalForm.settleDomainOptions = this.settleDomainOptions
            this.$refs.AbitrationModalForm.auditStatusOption = this.auditStatusOption
            this.$refs.AbitrationModalForm.tabTitle = '监察投诉事件'
            this.$refs.AbitrationModalForm.url.getHistory = '/hrEmergency/tcomplaintevent/old/'

            this.$refs.AbitrationModalForm.type = null //0工伤事件转1非因工事件转
            //获取详情
            httpAction('/hrEmergency/tcomplaintevent/vo/' + record.id, null, 'get').then(result => {
              if (result.code == 200) {
                if(record.workInjuryId){ //工伤事件
                  this.$refs.AbitrationModalForm.type = 0
                }else if(record.nonWorkId){
                  this.$refs.AbitrationModalForm.type = 1
                }else if(record.retiredId){
                  this.$refs.AbitrationModalForm.type = 2
                }
                result.data.abitrationEvent = result.data.complaintEvent
                //结算主体名称
                result.data.abitrationEvent.departName = (this.settleDomainOptions[result.data.complaintEvent.emSettleId]) ? this.settleDomainOptions[result.data.complaintEvent.emSettleId].departName : ''
                this.$refs.AbitrationModalForm.edit(result.data,record.id,true,5)
              }else{
                this.$message.error(result.msg)
              }
            })
            break;


        }
      },
      exportExcel(){
        delete this.queryParam.rangeTime_extra
        delete this.queryParam.applyTime_extra
        const qs = require('qs')
        let params = {}
        if(Object.keys(this.queryParam).length){
          params = Object.assign({},this.queryParam)
        }
        if(this.selectedRowKeys.length){
          params = Object.assign(params,{idStr:this.selectedRowKeys.join(',')})
        }
        this.confirmLoading = true
        httpAction(`${this.url.exportUrl}?${qs.stringify(params)}`,null,'post').then(res=>{
          if(res.code === 200){
            res.data.workInjuryEventList.forEach((item,index)=>{
              res.data.workInjuryEventList[index]['departName'] = this.settleDomainOptions[item.emSettleId] ? this.settleDomainOptions[item.emSettleId]['departName'] : ''
              res.data.workInjuryEventList[index]['customerName'] = getNameFromTree(this.customerTreeData,item.emCusId,'value','title')
              res.data.workInjuryEventList[index]['businessTypeName'] = filterDict(this.businessTypeDicts, item.businessType)
              res.data.workInjuryEventList[index]['eventTypeName'] = filterDictText(this.eventTypeOptions,item.eventType)
              res.data.workInjuryEventList[index]['riskBearName'] = (item.riskBear == 1) ? getNameFromTree(this.customerTreeData,item.riskBearUnit,'value','title') : getNameFromArr(this.organizationOption,item.riskBearOrgan,'id','organName')
              res.data.workInjuryEventList[index]['socialStatusName'] = this.socialStatus[item.socialStatus]
              res.data.workInjuryEventList[index]['socialArea'] = item.provinceName+item.cityName
              res.data.workInjuryEventList[index]['isCuringName'] = (item.isCuring == 0) ? '是' : '否'
              res.data.workInjuryEventList[index]['curingTypeName'] = filterDictText(this.treatmentTypeOption, item.curingType)
              res.data.workInjuryEventList[index]['auditStatusName'] = filterDictText(this.auditStatusOption, item.auditStatus)
              res.data.workInjuryEventList[index]['eventOccurrenceTime'] = moment(item.eventOccurrenceTime).format('YYYY-MM-DD')
            })
            res.data.nonWorkEventList.forEach((item,index)=>{
              res.data.nonWorkEventList[index]['departName'] = this.settleDomainOptions[item.emSettleId] ? this.settleDomainOptions[item.emSettleId]['departName'] : ''
              res.data.nonWorkEventList[index]['customerName'] = getNameFromTree(this.customerTreeData,item.emCusId,'value','title')
              res.data.nonWorkEventList[index]['businessTypeName'] = filterDict(this.businessTypeDicts, item.businessType)
              res.data.nonWorkEventList[index]['eventTypeName'] = filterDictText(this.nonworkTypeOptions,item.eventType)
              res.data.nonWorkEventList[index]['riskBearName'] = (item.riskBear == 1) ? getNameFromTree(this.customerTreeData,item.riskBearUnit,'value','title') : getNameFromArr(this.organizationOption,item.riskBearOrgan,'id','organName')
              res.data.nonWorkEventList[index]['socialStatusName'] = this.socialStatus[item.socialStatus]
              res.data.nonWorkEventList[index]['socialArea'] = item.provinceName+item.cityName
              res.data.nonWorkEventList[index]['isCuringName'] = (item.isCuring == 0) ? '是' : '否'
              res.data.nonWorkEventList[index]['curingTypeName'] = filterDictText(this.treatmentTypeOption, item.curingType)
              res.data.nonWorkEventList[index]['auditStatusName'] = filterDictText(this.auditStatusOption, item.auditStatus)
              res.data.nonWorkEventList[index]['eventOccurrenceTime'] = moment(item.eventOccurrenceTime).format('YYYY-MM-DD')
            })
            res.data.retiredWorkEventList.forEach((item,index)=>{
              res.data.retiredWorkEventList[index]['departName'] = this.settleDomainOptions[item.emSettleId] ? this.settleDomainOptions[item.emSettleId]['departName'] : ''
              res.data.retiredWorkEventList[index]['customerName'] = getNameFromTree(this.customerTreeData,item.emCusId,'value','title')
              res.data.retiredWorkEventList[index]['businessTypeName'] = filterDict(this.businessTypeDicts, item.businessType)
              res.data.retiredWorkEventList[index]['socialStatusName'] = this.socialStatus[item.socialStatus]
              res.data.retiredWorkEventList[index]['eventTypeName'] = filterDictText(this.retiredTypeOption,item.eventType)
              res.data.retiredWorkEventList[index]['workLengthWxs'] = item.workLengthWxYear ? (item.workLengthWxYear+'年'+item.workLengthWxMonth+'月') : ''
              res.data.retiredWorkEventList[index]['socialArea'] = item.provinceName+item.cityName
              res.data.retiredWorkEventList[index]['workLengthCustomers'] = item.workLengthCustomerYear ? (item.workLengthCustomerYear+'年'+item.workLengthCustomerMonth+'月') : ''
              res.data.retiredWorkEventList[index]['auditStatusName'] = filterDictText(this.auditStatusOption, item.auditStatus)
              res.data.retiredWorkEventList[index]['eventOccurrenceTime'] = moment(item.eventOccurrenceTime).format('YYYY-MM-DD')
            })
            res.data.abitrationEventList.forEach((item,index)=>{
              res.data.abitrationEventList[index]['departName'] = this.settleDomainOptions[item.emSettleId] ? this.settleDomainOptions[item.emSettleId]['departName'] : ''
              res.data.abitrationEventList[index]['customerName'] = getNameFromTree(this.customerTreeData,item.emCusId,'value','title')
              res.data.abitrationEventList[index]['businessTypeName'] = filterDict(this.businessTypeDicts, item.businessType)
              res.data.abitrationEventList[index]['socialStatusName'] = this.socialStatus[item.socialStatus]
              res.data.abitrationEventList[index]['socialArea'] = item.provinceName+item.cityName
              res.data.abitrationEventList[index]['workLengthWxs'] = item.workLengthWxYear ? (item.workLengthWxYear+'年'+item.workLengthWxMonth+'月') : ''
              res.data.abitrationEventList[index]['workLengthCustomers'] = item.workLengthCustomerYear ? (item.workLengthCustomerYear+'年'+item.workLengthCustomerMonth+'月') : ''
              res.data.abitrationEventList[index]['auditStatusName'] = filterDictText(this.auditStatusOption, item.auditStatus)
              res.data.abitrationEventList[index]['eventOccurrenceTime'] = moment(item.eventOccurrenceTime).format('YYYY-MM-DD')
            })
            res.data.litigationEventList.forEach((item,index)=>{
              res.data.litigationEventList[index]['departName'] = this.settleDomainOptions[item.emSettleId] ? this.settleDomainOptions[item.emSettleId]['departName'] : ''
              res.data.litigationEventList[index]['customerName'] = getNameFromTree(this.customerTreeData,item.emCusId,'value','title')
              res.data.litigationEventList[index]['businessTypeName'] = filterDict(this.businessTypeDicts, item.businessType)
              res.data.litigationEventList[index]['socialStatusName'] = this.socialStatus[item.socialStatus]
              res.data.litigationEventList[index]['socialArea'] = item.provinceName+item.cityName
              res.data.litigationEventList[index]['workLengthWxs'] = item.workLengthWxYear ? (item.workLengthWxYear+'年'+item.workLengthWxMonth+'月') : ''
              res.data.litigationEventList[index]['workLengthCustomers'] = item.workLengthCustomerYear ? (item.workLengthCustomerYear+'年'+item.workLengthCustomerMonth+'月') : ''
              res.data.litigationEventList[index]['auditStatusName'] = filterDictText(this.auditStatusOption, item.auditStatus)
              res.data.litigationEventList[index]['eventOccurrenceTime'] = moment(item.eventOccurrenceTime).format('YYYY-MM-DD')
              res.data.litigationEventList[index]['unitIdName'] = getNameFromTree(this.customerTreeData,item.unitIdName,'value','title')
              res.data.litigationEventList[index]['plaintiffOrDefendantName'] = (item.plaintiffOrDefendant==1)?'被告':'原告'
            })
            res.data.complaintEventList.forEach((item,index)=>{
              res.data.complaintEventList[index]['departName'] = this.settleDomainOptions[item.emSettleId] ? this.settleDomainOptions[item.emSettleId]['departName'] : ''
              res.data.complaintEventList[index]['customerName'] = getNameFromTree(this.customerTreeData,item.emCusId,'value','title')
              res.data.complaintEventList[index]['businessTypeName'] = filterDict(this.businessTypeDicts, item.businessType)
              res.data.complaintEventList[index]['socialStatusName'] = this.socialStatus[item.socialStatus]
              res.data.complaintEventList[index]['socialArea'] = item.provinceName+item.cityName
              res.data.complaintEventList[index]['workLengthWxs'] = item.workLengthWxYear ? (item.workLengthWxYear+'年'+item.workLengthWxMonth+'月') : ''
              res.data.complaintEventList[index]['workLengthCustomers'] = item.workLengthCustomerYear ? (item.workLengthCustomerYear+'年'+item.workLengthCustomerMonth+'月') : ''
              res.data.complaintEventList[index]['auditStatusName'] = filterDictText(this.auditStatusOption, item.auditStatus)
              res.data.complaintEventList[index]['eventOccurrenceTime'] = moment(item.eventOccurrenceTime).format('YYYY-MM-DD')
              res.data.complaintEventList[index]['eventResourceName'] = (item.eventResource==1)?'纸质':'电话'
            })
            // 封面数据
            let excelDatas = [
              {
                tHeader: ["事件编码","当事人", "身份证号","年龄","联系方式","岗位","客户单位","结算主体","业务类型","事件类型","风险承担","社会保险",
                "社保参保地","伤残等级","劳动合同开始时间","劳动合同结束时间","事件发生时间","事件发生地点","伤害部位","是否治疗","治疗类型",
                "就诊医院","事件发生经过","赔付方案","客户意见","部门/子分公司处理方案、意见","状态","申报人","申报时间","费用合计","我司承担","客户承担","保险公司承担","社保局承担"],
                filterVal: ['eventCode','emName','emIdCard',"empAge", "empPhone","post", "customerName","departName","businessTypeName","eventTypeName","riskBearName","socialStatusName",
                "socialArea","disabilityLevel","contractStart","contractEnd","eventOccurrenceTime","eventOccurrenceAddr","injuryPosition","isCuringName","curingTypeName",
                "curingHospital","eventThrough","payPlan","customerOpinion","organOpinion","auditStatusName","reportUserName","reportDate","feeSum","feeCompany","feeCustomer","feeSocial","feeInsure"],
                tableDatas: res.data.workInjuryEventList,
                sheetName: "工伤事件"
              },
              {
                tHeader: ["事件编码","当事人", "身份证号","年龄","联系方式","岗位","客户单位","结算主体","业务类型","事件类型","风险承担","社会保险",
                "社保参保地","伤残等级","劳动合同开始时间","劳动合同结束时间","事件发生时间","事件发生地点","伤害部位","是否治疗","治疗类型",
                "就诊医院","事件发生经过","赔付方案","客户意见","部门/子分公司处理方案、意见","状态","申报人","申报时间","费用合计","我司承担","客户承担","保险公司承担","社保局承担"],
                filterVal: ['eventCode','emName','emIdCard',"empAge", "empPhone","post", "customerName","departName","businessTypeName","eventTypeName","riskBearName","socialStatusName",
                "socialArea","disabilityLevel","contractStart","contractEnd","eventOccurrenceTime","eventOccurrenceAddr","injuryPosition","isCuringName","curingTypeName",
                "curingHospital","eventThrough","payPlan","customerOpinion","organOpinion","auditStatusName","reportUserName","reportDate","feeSum","feeCompany","feeCustomer","feeSocial","feeInsure"],
                tableDatas: res.data.nonWorkEventList,
                sheetName: "非因工事件"
              },
              {
                tHeader: ["事件编码","当事人", "身份证号","年龄","联系方式","岗位","客户单位","结算主体","业务类型","皖信工龄","客户单位工龄","社会保险",
                "社保参保地","前12个月平均工资","劳动合同开始时间","劳动合同结束时间","事件发生时间","事件类别","事件说明",
                "赔付方案","客户意见","部门/子分公司处理方案、意见","状态","申报人","申报时间","费用合计","我司承担","客户承担","保险公司承担","社保局承担"],
                filterVal: ['eventCode','emName','emIdCard',"empAge", "empPhone","post", "customerName","departName","businessTypeName","workLengthWxs","workLengthCustomers","socialStatusName",
                "socialArea","averageSalary","contractStart","contractEnd","eventOccurrenceTime","eventTypeName","eventThrough",
                "payPlan","customerOpinion","organOpinion","auditStatusName","reportUserName","reportDate","feeSum","feeCompany","feeCustomer","feeSocial","feeInsure"],
                tableDatas: res.data.retiredWorkEventList,
                sheetName: "退工事件"
              },
              {
                tHeader: ["事件编码","当事人", "身份证号","年龄","联系方式","岗位","客户单位","结算主体","业务类型","皖信工龄","客户单位工龄","社会保险",
                "社保参保地","前12个月平均工资","劳动合同开始时间","劳动合同结束时间","仲裁时间","仲裁委员会","仲裁个人诉求",
                "部门/子分公司处理方案、意见","状态","申报人","申报时间","费用合计","我司承担","客户承担","保险公司承担","社保局承担"],
                filterVal: ['eventCode','emName','emIdCard',"empAge", "empPhone","post", "customerName","departName","businessTypeName","workLengthWxs","workLengthCustomers","socialStatusName",
                "socialArea","averageSalary","contractStart","contractEnd","eventOccurrenceTime","eventOccurrenceAddr","eventThrough",
                "organOpinion","auditStatusName","reportUserName","reportDate","feeSum","feeCompany","feeCustomer","feeSocial","feeInsure"],
                tableDatas: res.data.abitrationEventList,
                sheetName: "仲裁事件"
              },
              {
                tHeader: ["事件编码","当事人", "身份证号","年龄","联系方式","岗位","客户单位","结算主体","业务类型","皖信工龄","客户单位工龄","社会保险",
                "社保参保地","前12个月平均工资","劳动合同开始时间","劳动合同结束时间","原告/被告","诉讼时间","客户单位","法院","原告诉求","法务意见",
                "部门/子分公司处理方案、意见","状态","申报人","申报时间","费用合计","我司承担","客户承担","保险公司承担","社保局承担"],
                filterVal: ['eventCode','emName','emIdCard',"empAge", "empPhone","post", "customerName","departName","businessTypeName","workLengthWxs","workLengthCustomers","socialStatusName",
                "socialArea","averageSalary","contractStart","contractEnd","plaintiffOrDefendantName","eventOccurrenceTime","unitIdName","eventOccurrenceAddr","eventThrough","customerOpinion",
                "organOpinion","auditStatusName","reportUserName","reportDate","feeSum","feeCompany","feeCustomer","feeSocial","feeInsure"],
                tableDatas: res.data.litigationEventList,
                sheetName: "诉讼事件"
              },
              {
                tHeader: ["事件编码","当事人", "身份证号","年龄","联系方式","岗位","客户单位","结算主体","业务类型","皖信工龄","客户单位工龄","社会保险",
                "社保参保地","前12个月平均工资","劳动合同开始时间","劳动合同结束时间","发生时间","劳动保障部门","投诉渠道","投诉内容","赔付方案",
                "部门/子分公司处理方案、意见","状态","申报人","申报时间","费用合计","我司承担","客户承担","保险公司承担","社保局承担"],
                filterVal: ['eventCode','emName','emIdCard',"empAge", "empPhone","post", "customerName","departName","businessTypeName","workLengthWxs","workLengthCustomers","socialStatusName",
                "socialArea","averageSalary","contractStart","contractEnd","eventOccurrenceTime","eventOccurrenceAddr","eventResourceName","eventThrough","payPlan",
                "organOpinion","auditStatusName","reportUserName","reportDate","feeSum","feeCompany","feeCustomer","feeSocial","feeInsure"],
                tableDatas: res.data.complaintEventList,
                sheetName: "监察投诉事件"
              }
            ]
            this.json2excel(excelDatas, "突发事件", true, "xlsx",0)
            this.$message.success('导出成功')
          }else{
            this.$message.error(res.msg)
          }
        }).finally(()=>{
          this.confirmLoading = false
        })
      },
      json2excel(tableJson, filenames, autowidth, bookTypes,typeLength) {
        var that = this
        import('./xlsx/ExportToExcel').then(excel => {
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
            autoWidth: autowidth,
            bookType: bookTypes,
            autoLength: typeLength // 所有类型长度
          })
          that.confirmLoading = false;
        });
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j] || ''
        }))
      },
      disabledDate(current) {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
      },
      //查看流程记录
      processRecord(record){
        this.$refs.ProcessRecordModalForm.edit(record,0)
      },
      // 数据字典
      initDictConfig() {
        // 所有事件通用状态
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
        //工伤理赔费用类型
        initDictOptions('social_claims_fee_type').then((res) => {
          if (res.code === 200) {
            this.socialClaimsFeeTypeDicts = res.data;
          }
        })
        // 工伤成本类型
        initDictOptions('injury_cost_type').then((res) => {
          if (res.code === 200) {
            this.injuryCostTypeDicts = res.data;
          }
        })
        //治疗类型
        initDictOptions('treatment_type').then(res => {
          if (res.code === 200) {
            this.treatmentTypeOption = res.data
          }
        })
        // 非因工事件类别
        initDictOptions('nonwork_event_type').then(res => {
          if (res.code === 200) {
            this.nonworkTypeOptions = res.data
          }
        })
        //退工事件类型
        initDictOptions('retired_type').then(res => {
          if (res.code === 200) {
            this.retiredTypeOption = res.data
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
      changeApply(value, dateString){
        this.queryParam.reportDateStart = dateString[0]
        this.queryParam.reportDateEnd = dateString[1]
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

.searchForm .labelTxt {
  :global(.ant-form-item-label) {
    width: 105px;
    text-align: right;
  }
}
</style>
