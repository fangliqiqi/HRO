<template>
  <a-modal
    :visible="visible"
    :width="1000"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <div slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" v-if="auditFlag" v-has="'wxhr:tsettledomain_audit'" @click="handleAudit">审核</a-button>
    </div>
    <div slot="title">
      <span style="margin-right:10px">{{ model.settleDomain.departName }}</span>
      <a-tag
        v-for="(item,index) in serverItem"
        :key="index"
        color="blue"
      >
        {{ item }}
      </a-tag>
      <a-tag>{{ statusOption[model.settleDomain.dpAuditFlag] ? statusOption[model.settleDomain.dpAuditFlag]['text'] : '' }}</a-tag>
      
      <a-tooltip placement="bottom" v-has="'wxhr:tsettledomain_edit'">
        <template slot="title">
          <span>{{ model.settleDomain.newRemark }}</span>
        </template>
        <a-button class="remark" @click="handleRemark">备注</a-button>
      </a-tooltip>
    </div>
    <a-spin :spinning="confirmLoading">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="基本信息">
          <a-descriptions :column="2" bordered class="mbot" size="small">
            <a-descriptions-item label="客户单位">{{ model.settleDomain.customerName || '-' }}</a-descriptions-item>
            <a-descriptions-item label="创建类型">{{ model.settleDomain.createType == 1 ? '先于合同' : '合同之后' }}</a-descriptions-item>
            <a-descriptions-item label="关联合同">{{ model.settleDomain.relateFlag == 1 ? '否' : '是' }}</a-descriptions-item>
            <a-descriptions-item label="异常说明" v-if="model.settleDomain.createType == 1">{{ model.settleDomain.exceptionRemark || '-' }}</a-descriptions-item>
            <a-descriptions-item label="业务合同">{{ model.settleDomain.contractName || '-' }}</a-descriptions-item>
            <a-descriptions-item label="业务类型">{{ getMultiName(typeList,'/',model.settleDomain.businessPrimaryType,model.settleDomain.businessSecondType,model.settleDomain.businessThirdType) }}</a-descriptions-item>
            <a-descriptions-item label="收入归属">
              {{ getNameFromArr(organAll,model.settleDomain.incomeBelong,'id','organName') }} / {{ getNameFromArr(organAll,model.settleDomain.incomeBelongSub,'id','organName') }}
            </a-descriptions-item>
            <a-descriptions-item label="所属地区" v-if="model.settleDomain.type == 0">{{ getAreaName(model.settleDomain.province,model.settleDomain.city,model.settleDomain.town,'/') }}</a-descriptions-item>
            <a-descriptions-item label="创建人">{{ model.settleDomain.createUserName }}</a-descriptions-item>
            <a-descriptions-item label="创建时间">{{ model.settleDomain.createTime ? model.settleDomain.createTime.substring(0, 10) : '' }}</a-descriptions-item>
          </a-descriptions>
          <a-descriptions title="结算配置" :column="2" bordered class="mbot" size="small">
            <a-descriptions-item label="缴税类型">
              {{ model.departSettlementInfo ? getNameFromArr(taxTypeDicts,model.departSettlementInfo.taxType,'id','label') : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="缴税税率">
              {{ model.departSettlementInfo ? model.departSettlementInfo.taxFee : '' }}%
            </a-descriptions-item>
            <a-descriptions-item label="单位大病比例" v-if="showFlag.unitIllness && !model.settleDomain.type">
              {{ model.departSettlementInfo ? model.departSettlementInfo.unitSeriousIllnessProp : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="社保卡收取" v-if="showFlag.socialCard && !model.settleDomain.type">
              {{ model.departSettlementInfo ? (model.departSettlementInfo.socialCardTaker == 1 ? '个人' : '单位') : '' }}
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions 
            title="管理费"
            :column="2"
            size="small"
            bordered
            class="mbot"
            v-if="showFlag.management && model.settleDomain.type == 0"
          >
            <a-descriptions-item label="是否收费">
              {{ model.departSettlementInfo ? (model.departSettlementInfo.managementTag == 1 ? '否' : '是') : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="收费方式">
              {{ model.departSettlementInfo ? (model.departSettlementInfo.managementTag == 1 ? '-' : (model.departSettlementInfo.managementType == 1 ? '按比例收费' : '按固定值收费')) : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="费率/金额">
              {{ model.departSettlementInfo ? (model.departSettlementInfo.managementTag == 1 ? '-' : ((model.departSettlementInfo.managementFee||'')+(model.departSettlementInfo.managementType == 1?'%':''))) : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="收取项目" v-if="model.departSettlementInfo && model.departSettlementInfo.managementType == 1">
              {{ model.departSettlementInfo ? (model.departSettlementInfo.managementTag == 1 ? '-' : model.departSettlementInfo.manageServerItem) : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="税收类型">
              {{ model.departSettlementInfo ? (model.departSettlementInfo.managementTag == 1 ? '-' : (model.departSettlementInfo.managementTaxTag==1 ? '税后' : '税前')) : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="是否扣税">
              {{ model.departSettlementInfo ? (model.departSettlementInfo.managementTag == 1 ? '-' : (model.departSettlementInfo.managementExpFlag==1 ? '否' : '是')) : '' }}
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions
            title="风险金"
            :column="2"
            size="small"
            bordered
            class="mbot"
            v-if="showFlag.risk && model.settleDomain.type == 0"
          >
            <a-descriptions-item label="是否收费">
              {{ model.departSettlementInfo ? (model.departSettlementInfo.riskFundTag == 1 ? '否' : '是') : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="收费方式">
              {{ model.departSettlementInfo ? (model.departSettlementInfo.riskFundTag == 1 ? '-' : (model.departSettlementInfo.riskFundType == 1 ? '按比例收费' : '按固定值收费')) : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="费率/金额">
              {{ model.departSettlementInfo ? (model.departSettlementInfo.riskFundTag == 1 ? '-' : (model.departSettlementInfo.riskFundFee+(model.departSettlementInfo.riskFundType == 1?'%':''))) : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="收取项目" v-if="model.departSettlementInfo && model.departSettlementInfo.riskFundType == 1">
              {{ model.departSettlementInfo ? (model.departSettlementInfo.riskFundTag == 1 ? '-' : model.departSettlementInfo.riskServerItem) : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="税收类型">
              {{ model.departSettlementInfo ? (model.departSettlementInfo.riskFundTag == 1 ? '-' : (model.departSettlementInfo.riskFundTaxTag==1 ? '税后' : '税前')) : '' }}
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions
            title="商险（单独结算）配置"
            size="small"
            :column="2"
            bordered
            class="mbot"
            v-if="showFlag.insuranceManagement && model.settleDomain.type == 0"
          >
            <a-descriptions-item label="是否收费">
              {{ model.businessRisksSettlement ? (model.businessRisksSettlement.managementTag == 1 ? '不收取' : '收取') : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="收费方式">
              {{ model.businessRisksSettlement ? (model.businessRisksSettlement.managementTag == 1 ? '-' : (model.businessRisksSettlement.riskManagementType == 1 ? '按比例收费' : '按固定值收费')) : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="费率/金额">
              {{ model.businessRisksSettlement ? (model.businessRisksSettlement.managementTag == 1 ? '-' : (model.businessRisksSettlement.riskManagementType == 1 ? (model.businessRisksSettlement.riskManagementTax+'%') : model.businessRisksSettlement.riskManagementFee)) : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="是否含税">
              {{ model.businessRisksSettlement ? (model.businessRisksSettlement.managementTag == 1 ? '-' : (model.businessRisksSettlement.riskManagementTaxTag==1 ? '含税' : '不含税')) : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="商险缴税类型">
              {{ model.businessRisksSettlement ? (model.businessRisksSettlement.managementTag == 1 ? '-' : (getNameFromArr(taxTypeDicts,model.businessRisksSettlement.taxType,'id','label'))||'-') : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="商险缴税税率">
              {{ model.businessRisksSettlement ? (model.businessRisksSettlement.managementTag == 1 ? '-' : (model.businessRisksSettlement.taxValue != null ? (model.businessRisksSettlement.taxValue+'%') : '-')) : '' }}
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions
            title="核准表开票信息"
            :column="2"
            size="small"
            bordered
            class="mbot"
            v-if="model.settleDomain.type == 0 && showFlag.approvalFormTickect"
          >
            <a-descriptions-item label="客户开票名称">
              {{ model.approvalFormTickect ? model.approvalFormTickect.customerTicketName : '' }}
            </a-descriptions-item>
            <a-descriptions-item label="我司到款单位名称">
              {{ model.approvalFormTickect ? (model.approvalFormTickect.selfTomoneyUnitName) : '' }}
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions
            title="垫付信息"
            :column="2"
            size="small"
            bordered
            class="mbot"
            v-if="model.settleDomain.type == 0"
          >
            <a-descriptions-item label="是否存在垫付">
              <span v-if="model.settleDomain.existAdvancePayment == 1">业务约定性垫付</span>
              <span v-else-if="model.settleDomain.existAdvancePayment == 0">偶发性垫付</span>
              <span v-else>-</span>
            </a-descriptions-item>
            <a-descriptions-item label="回款周期">
              {{ model.settleDomain.backPayCycle ? (model.settleDomain.backPayCycle+'个月') : '-' }}
            </a-descriptions-item>
          </a-descriptions>

          <p class="coverTit" v-if="model.settleDomain.type == 0">封面设置</p>
          <a-table
            class="tableCover"
            :columns="columns"
            bordered
            :pagination="false"
            :data-source="model.tableHeadSalaryCover||[]"
            v-if="model.settleDomain.type == 0"
          >
          </a-table>

        </a-tab-pane>
        <a-tab-pane key="2" tab="合同" v-if="model.settleDomain.relateFlag === '0'">
          <a-descriptions bordered :column="2" size="small">
            <div slot="title">
              合同基本信息
              <a-tag color="blue">{{ constractType[contractInfo.signingStatus] }}</a-tag>
              <a-tag color="orange">{{ (contractInfo.oldCustomerFlag == 0) ? '新客户' : '老客户' }}</a-tag>
            </div>
            <a-descriptions-item label="合同名称">{{ contractInfo.contractName }}</a-descriptions-item>
            <a-descriptions-item label="客户单位">{{ contractInfo.customerName }}
              <span v-if="contractInfo.signingStatus != 5">({{ serviceSideString[Number(contractInfo.serviceSide)] }})</span>
            </a-descriptions-item>
            <template v-if="contractInfo.signingStatus != 5">
              <a-descriptions-item label="客户类型">{{ GLOBAL_CONST['customerType'][contractInfo.customerType] }}</a-descriptions-item>
              <a-descriptions-item label="商务主体">{{ contractInfo.businessSubjectName }}</a-descriptions-item>
              <a-descriptions-item label="CRM合同编号">{{ contractInfo.contractCode }}</a-descriptions-item>
              <a-descriptions-item label="合同提报人">{{ nameFun(contractInfo.createUser) }}</a-descriptions-item>
              <a-descriptions-item label="起止日期">{{ contractInfo.startDate }}~{{ contractInfo.endDate }}</a-descriptions-item>
              <template v-if="contractInfo.signingStatus == 0||contractInfo.signingStatus == 2">
                <a-descriptions-item label="是否续签">{{ signingStatusString[Number(contractInfo.signingStatus)] }}</a-descriptions-item>
              </template>
              <a-descriptions-item label="用章类型">{{ getChapterType(contractInfo.chapterType) }}</a-descriptions-item>
              <a-descriptions-item label="用章单位">{{ GLOBAL_CONST['companyChapterType'][contractInfo.chapterUnit] }}</a-descriptions-item>
              <a-descriptions-item label="客户先行盖章">{{ contractInfo.chapterCustomerPre == 1 ? '是' : '否' }}</a-descriptions-item>
              <a-descriptions-item label="是否外带">{{ contractInfo.outWithFlag == 1 ? '是' : '否' }}</a-descriptions-item>
            </template>
          </a-descriptions>
          <a-descriptions bordered :column="2" size="small" title="业务信息" style="margin-top: 20px;">
            <a-descriptions-item label="合同模板" v-if="contractInfo.signingStatus != 5">{{ GLOBAL_CONST['contractTemplate'][contractInfo.contractTemplate] }}</a-descriptions-item>
            <a-descriptions-item label="业务类别">{{ contractInfo.businessType }} / {{ contractInfo.businessSub }}</a-descriptions-item>
            <a-descriptions-item label="业务开发人">{{ contractInfo.businessDeveloperName }}</a-descriptions-item>
            <a-descriptions-item label="开发部门/分公司">{{ contractInfo.businessDeveloperOrganName }}</a-descriptions-item>

            <!-- <a-descriptions-item label="结算周期" v-if="contractInfo.signingStatus != 5">{{ GLOBAL_CONST['settleCycle'][contractInfo.settleCycle] }}</a-descriptions-item>
            <a-descriptions-item label="费用方式" v-if="contractInfo.signingStatus != 5">{{ GLOBAL_CONST['settleType'][contractInfo.settleType] }}</a-descriptions-item> -->
            <a-descriptions-item label="收入预估">{{ contractInfo.estimatedIncome || 0 }}</a-descriptions-item>
            <a-descriptions-item label="合同金额">{{ contractInfo.money || '-' }}</a-descriptions-item>
            <a-descriptions-item label="服务人数">{{ contractInfo.servicePeopleNum || '-' }}</a-descriptions-item>
            <a-descriptions-item label="合同要点">{{ contractInfo.remark || '-' }}</a-descriptions-item>
            <a-descriptions-item label="合同附件" v-if="contractInfo.signingStatus != 5">
              <a-upload
                listType="picture-card"
                :fileList="contractInfo.fileList"
                @preview="handlePreview"
                :showUploadList="{ showRemoveIcon: false }"
                accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx,.rar,.zip"
              ></a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviwCancel">
                <img alt="example" style="max-width: 100%" :src="previewImage" />
              </a-modal>
            </a-descriptions-item>
            <a-descriptions-item label="归档附件" v-if="contractInfo.signingStatus != 5">
              <a-upload
                listType="picture-card"
                :fileList="contractInfo.fileArchiveList"
                @preview="handlePreview"
                :showUploadList="{ showRemoveIcon: false }"
                accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx,.rar,.zip"
              ></a-upload>
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
        <a-tab-pane key="3" tab="客户">
          <a-descriptions bordered :column="2" size="small">
            <a-descriptions-item label="上级机构">{{ customerInfo.parentId }}</a-descriptions-item>
            <a-descriptions-item label="行业类型">{{ customerInfo.industryBelong }}</a-descriptions-item>
            <a-descriptions-item label="行业细分">{{ customerInfo.industrySub }}</a-descriptions-item>
            <a-descriptions-item label="客户地址">{{ customerInfo.customerAddress }} {{ customerInfo.address }}</a-descriptions-item>
            <a-descriptions-item label="区域归属">{{ customerInfo.belongArea }}</a-descriptions-item>
            <a-descriptions-item label="客户性质">{{ customerInfo.nature }}</a-descriptions-item>
            <a-descriptions-item label="客户类型">{{ GLOBAL_CONST['customerType'][customerInfo.customerType] }}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
        <a-tab-pane key="6" tab="结算提醒设置">
          <div class="remaind">
            <a-row>
              <a-col :span="3" class="borderRight borderBottom">提醒项目</a-col>
              <a-col :span="3" class="borderRight borderBottom">结算周期</a-col>
              <a-col :span="4" class="borderRight borderBottom">提醒日期</a-col>
              <a-col :span="4" class="borderRight borderBottom">首次提醒日期</a-col>
              <a-col :span="4" class="borderRight borderBottom">提醒方式</a-col>
              <a-col :span="3" class="borderRight borderBottom">提醒对象</a-col>
              <a-col :span="3" class="borderBottom">是否开启提醒</a-col>
            </a-row>
            <a-row
              v-for="(item,key) in model.settleAlertCfgList"
              :key="key"
            >
              <a-col :span="3" class="borderRight borderBottom">{{ item.project }}</a-col>
              <a-col :span="3" class="borderRight borderBottom">{{ item.cycle }}个月</a-col>
              <a-col :span="4" class="borderRight borderBottom">每月第{{ item.alertDay }}日</a-col>
              <a-col :span="4" class="borderRight borderBottom">{{ item.firstAlertDate }}</a-col>
              <a-col :span="4" class="borderRight borderBottom">邮件 系统消息</a-col>
              <a-col :span="3" class="borderRight borderBottom">{{ item.alertTarget }}</a-col>
              <a-col :span="3" class="borderBottom">{{ item.status == 0 ? '是' : '否' }}</a-col>
            </a-row>
          </div>
          
        </a-tab-pane>
        <a-tab-pane key="4" tab="流程进度">
          <a-steps :current="currentStatus" direction="vertical">
            <a-step title="提交完成" :status="showHistoryProcess[0].status">
              <div slot="description">
                <template v-if="showHistoryProcess[0].flag">
                  提交人：{{ model.settleDomain.createUserName }}<br/>
                  <!-- 提交时间：{{ model.settleDomain.createTime }} -->
                </template>
              </div>
            </a-step>
            <a-step title="服务审核" :status="showHistoryProcess[1].status">
              <div slot="description">
                <span v-if="model.settleDomain.dpAuditFlag == 2 || model.settleDomain.dpAuditFlag == 4 || model.settleDomain.dpAuditFlag == 5 ">状态：{{ dpAuditFlagOption[model.settleDomain.dpAuditFlag] }}<br/></span>
                审核人：<span v-if="showHistoryProcess[1].flag || showHistoryProcess[0].flag">{{ model.settleDomain.managerAuditManName }}</span><br/>
                审核时间：<span v-if="showHistoryProcess[1].flag">{{ model.settleDomain.managerAuditTime }}</span><br/>
                审核意见：<span v-if="showHistoryProcess[1].flag">{{ model.settleDomain.managerAuditOpinion }}</span>
              </div>
            </a-step>
            <a-step title="全国运营中心审核" v-if="showNation" :status="showHistoryProcess[2].status">
              <div slot="description">
                <span v-if="model.settleDomain.dpAuditFlag == 1">状态：{{ dpAuditFlagOption[model.settleDomain.dpAuditFlag] }}<br/></span>
                审核人：<span v-if="showHistoryProcess[2].flag || model.settleDomain.dpAuditFlag == 4">{{ model.settleDomain.dpAuditManName }}</span><br/>
                审核时间：<span v-if="showHistoryProcess[2].flag">{{ model.settleDomain.auditTime }}</span><br/>
                审核意见：<span v-if="showHistoryProcess[2].flag">{{ model.settleDomain.dpAuditOpinion }}</span>
              </div>
            </a-step>
            <a-step title="流程结束"/>
          </a-steps>
          
        </a-tab-pane>
        <a-tab-pane key="5" tab="操作记录">
          <a-table
            :columns="recordList"
            :dataSource="recordSource"
            :pagination="ipagination"
            @change="tableChange"
            :defaultExpandAllRows="true"
            rowKey="id"
            @expand="changeLog"
          >
            <p slot="expandedRowRender" slot-scope="record,index" style="margin: 0">
              {{ record.createTime }} 由  <a-tag color="blue">{{ record.createUserName }}</a-tag><br/>
              <span v-for="(item,key) in recordDetailList[index]" :key="key">
                修改了<strong>{{ item.name }}</strong>：旧值为:{{ item.oldField }}，新值为：{{ item.newField }}<br/>
              </span>
            </p>
          </a-table>
        </a-tab-pane>
      </a-tabs>
      
      <modify-remark-modal ref="ModifyRemarkFrom" @ok="modalFormOk"></modify-remark-modal>
      <audit-modal ref="AuditForm" @ok="auditModalOk"></audit-modal>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import { getAreaName, getMultiName, getNameFromArr,getNameFromTree,getAreaFieldName } from '@/utils/common'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import ModifyRemarkModal from './ModifyRemarkModal'
import AuditModal from './AuditModal'


export default {
  name: 'SettlementDetail',
  components: {
    ModifyRemarkModal,
    AuditModal,
  },
  data() {
    return {
      visible: false,
      title: '结算主体详情',
      confirmLoading: false,
      model: {
        settleDomain:{},
        departSettlementInfo:{},
        businessRisksSettlement:{},
        tableHeadSalaryCover:[],
      },
      serverItem:[],
      statusOption:[], // 状态
      allTypeList:[],
      typeList:[],
      taxTypeDicts:[],
      manageServerItemsDicts:[],
      riskServerItemsDicts:[],
      dataSource:[],
      columns:[
        {
          title: '抬头类型',
          dataIndex: 'type',
          key: 'type',
          customRender: val => {
            const arr = ['薪资','商险','核准表','预估结算单']
            return arr[val]
          }
        },
        {
          title: '抬头名称',
          dataIndex: 'coverName',
          key: 'coverName',
        },
      ],
      showFlag:{
        unitIllness: true,
        socialCard: true,
        insuranceManagement: true,
        management: true,
        risk: true,
        approvalFormTickect:true,
      },
      contractInfo: {}, // 合同信息
      constractType:{'0':'续签','1':'新签','2':'重签','3':'补充协议','4':'先于合同执行','5':'虚拟合同'},
      serviceSideString: ['', '甲方', '乙方'],
      signingStatusString: ['续签','新签', '重签'],
      businessTypeDicts: [],
      businessSubDicts: [],
      businessDeveloper: [],
      organs: [],
      previewVisible: false,
      previewImage: '',
      fileTypeOfOffice: 'xls,xlsx,doc,docx,ppt,pptx',
      customerInfo: {}, // 客户信息
      customerTreeData: [],
      industryBelongDictOptions: [],
      industrySubOption: [],
      natureDictOptions: [],
      organAll: [],
      employData:[],
      url: {
        submitBatch: '/hrBase/tsettledomain/batch/commit',
        contract: '/hrBase/tcustomercontract/',
        getBusinessSub: '/admin/dict/getByParentId',
        getBusinessDeveloperArray:'/admin/user/getUserByRoleNameAndClient',// 获得业务开发人
        getOrgan: '/admin/organizationinfo/getOrgForCus?type=0',
        customer: '/hrBase/tcustomerinfo/vo/',
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
      },
      auditFlag: false,
      currentStatus:1,
      recordList:
      [{
        title: "操作人",
        dataIndex: 'createUserName',
        width:60,
        ellipsis: true,
        customRender:(text)=>{
          return <a-tooltip
            placement="topLeft"
            title={text}
          >{text}</a-tooltip>
        }
      },
      {
        title: "操作时间",
        dataIndex: 'createTime',
        width:100,
        ellipsis: true,
        customRender:(text)=>{
          return <a-tooltip
            placement="topLeft"
            title={text}
          >{text}</a-tooltip>
        }
      },
      {
        title: "操作内容",
        dataIndex: 'differenceInfo',
        width:250,
        ellipsis: true,
        customRender:(text,record)=>{
          console.log(record,111)
          const field = []
          text.split(',').map((item)=>{
            field.push(this.fields[item])
          })
          const res = field.join(',')
          return <a-tooltip
            placement="topLeft"
            title={res}
          >{res}</a-tooltip>
        }
      }],
      recordSource:[],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0
      },
      fields:{
        customerId:'所属客户',
        belongContract:'合同主体',
        departName:'结算名称',
        incomeBelong:'收入归属',
        incomeBelongSub:'收入归属细分',
        province:'所属地区所在省',
        city:'所属地区所在市',
        town:'所属地区所在区',
        serverItem:'服务项目',
        socialCardTaker:'社保卡收取',
        unitSeriousIllnessProp:'单位大病比例',
        createType:'创建类型',
        exceptionRemark:'异常说明',
        relateFlag:'是否关联合同',
        managementTag:'管理费是否收费',
        riskFundTag:'风险金是否收取',
        managementType:'管理费收费类型',
        riskFundType:'风险金收取方式',
        managementFee:'管理费费率/金额',
        riskFundFee:'风险金费率/金额',
        manageServerItem:'管理费收取项目',
        riskServerItem:'风险金收取项目',
        managementTaxTag:'管理费税收类型',
        riskFundTaxTag:'风险金税收类型',
        taxType:'缴税类型',
        taxFee:'结算配置缴税税率',
        managementExpFlag:'管理费扣税',
        welfareAddr:'福利购买地',
        insuranceType:'保险类型',
        otherWelfare:'其他福利',
        customerTicketName:'客户开票名称',
        selfTomoneyUnitName:'我司到款单位名称',
        // managementTag:'是否收取管理费',
        riskManagementType:'管理费收取方式',
        riskManagementFee:'商险管理费收取值',
        riskManagementTax:'商险管理费收取比率',
        riskManagementTaxTag:'管理费税收是否含税',
        // taxType:'缴税类型',
        taxValue:'缴税税率',
        socialSettlementType:'社保结算时间',
        fundSettlementType:'公积金结算时间',
        salaryType:'工资发放时间',
        customerGetformTime:'客户到表时间',
        wxOutAccountsTime:'皖信出账时间',
        customerSuerTime:'客户确认时间',
        wxTicketTime:'皖信出票时间',
        customerGetfeeTime:'客户到账时间',
        salaryGrantTime:'工资发放时间',
        firstSettlementTime:'首次结算时间',
        contractAppointGetfeeTime:'合同约定到款时间',
        dpAuditFlag:'状态',
        lastUpdateTime:'最后更新时间',
        commitUserName:'审核人',
        lastAuditDate:'最迟审核时间',
        businessPrimaryType:'业务类型分类',
        businessSecondType:'业务类型二级分类',
        businessThirdType:'业务类型三级分类',
        existAdvancePayment:'是否存在垫付',
        backPayCycle:'回款周期',
        alertDay:'提醒日期',
        firstAlertDate:'首次提醒日期',
        cycle:'结算周期',
        project:'提醒项目',
        projectType:'提醒项目ID',
        status:'提醒状态',

      },
      dpAuditFlagOption:['审核通过','审核不通过','待审核','待提交','经理通过','经理不通过'],
      recordDetailList:[],
      showHistoryProcess:{
        "0":{
          flag: true,
          status:'finish'
        },
        "1":{
          flag: true,
          status:'finish'
        },
        "2":{
          flag: true,
          status:'finish'
        },
      },
      showNation:true,
      serverItemDicts:[]
    }
  },
  created(){
    // 业务类型
    httpAction(`/hrBase/sysdictbusinesstypehr/getAllSysDictBusinessTypeList`,null,'get').then(res=>{
      if(res.code === 200) {
        this.typeList = res.data
      }
    })
    // 合同的业务类别
    httpAction(`/hrBase/sysdictbusinesstype/getSysDictBusinessTypeList`,null,'get').then(res=>{
      if(res.code === 200) {
        this.allTypeList = res.data
      }
    })

    httpAction('/admin/user/userDic','','GET').then((res) => {
        if(Number(res.code) === 200){
          this.employData = res.data
        }
    })

    this.initDictConfig()
    //获得业务开发人的接口
    httpAction(this.url.getBusinessDeveloperArray, '', 'GET').then((res) => {
      if (res.code === 200 && res.data.length > 0) {
        this.businessDeveloper = res.data
      }
    })
    httpAction(this.url.getOrgan, '', 'GET').then((res) => {
      if (res.code === 200 && res.data.length > 0) {
        this.organs = res.data
      }
    })
    httpAction(this.url.getTreeData, null, 'get').then(res => {
      this.customerTreeData = res.data
    })
  },
  methods: {
    getAreaName,
    getMultiName,
    getNameFromArr,
    getChapterType(str){
      const chapterTypeString = ['', '合同章', '法人章']
      const arr = str ? str.split(',') : []
      const res = arr.map(item=>{
        return chapterTypeString[item]
      })
      return res.join(',')
    },
    // 合同提报人
    nameFun(name){
      for(const c in this.employData){
        if(String(c) === String(name)){
          return this.employData[c]
        }
      }
    },
    show(record) {
      this.model = record
      this.serverItem = record.settleDomain.serverItem.split(',')
      this.showFlag.unitIllness = (/社保(.*)薪资/.test(record.settleDomain.serverItem) && String(record.settleDomain.type) === '0') ? true : false
      this.showFlag.socialCard = (/社保/.test(record.settleDomain.serverItem)) ? true : false
      this.showFlag.approvalFormTickect = (/(社保|公积金)/.test(record.settleDomain.serverItem)) ? true : false
      this.showFlag.management = (record.settleDomain.serverItem == '商业保险') ? false : true
      this.showFlag.risk = (/(1254|898|897)/.test(record.settleDomain.businessThirdType)) ? false : true
      this.showFlag.insuranceManagement = (/商(.*)?险/.test(record.settleDomain.serverItem)) ? true : false
      if((/商(.*)?险/.test(record.settleDomain.serverItem) && record.settleDomain.serverItem !== '商业保险')){
        this.showFlag.management = true
        this.showFlag.insuranceManagement = true
      }

      switch (record.settleDomain.dpAuditFlag) {
        case '0':
          this.currentStatus = 3
          this.showHistoryProcess = {"0":{flag:true,status:'finish'},"1":{flag:true,status:'finish'},"2":{flag:true,status:'finish'}}
          break
        case '1':
          this.currentStatus = 2
          this.showHistoryProcess = {"0":{flag:true,status:'finish'},"1":{flag:true,status:'finish'},"2":{flag:true,status:'error'}}
          break
        case '2':
          this.currentStatus = 0
          this.showHistoryProcess = {"0":{flag:true,status:'finish'},"1":{flag:false,status:'wait'},"2":{flag:false,status:'wait'}}
          break
        case '3':
          this.currentStatus = -1
          this.showHistoryProcess = {"0":{flag:false,status:'wait'},"1":{flag:false,status:'wait'},"2":{flag:false,status:'wait'}}
          break
        case '4':
          this.currentStatus = 1
          this.showHistoryProcess = {"0":{flag:true,status:'finish'},"1":{flag:true,status:'finish'},"2":{flag:false,status:'wait'}}
          break
        case '5':
          this.currentStatus = 1
          this.showHistoryProcess = {"0":{flag:true,status:'finish'},"1":{flag:true,status:'error'},"2":{flag:false,status:'wait'}}
          break
      }
      // 历史审核记录兼容
      if(!record.settleDomain.managerAuditManName && record.settleDomain.dpAuditManName){
        this.model.settleDomain.managerAuditManName = record.settleDomain.dpAuditManName
        this.model.settleDomain.managerAuditOpinion = record.settleDomain.dpAuditOpinion
        this.model.settleDomain.managerAuditTime = record.settleDomain.auditTime
        this.model.settleDomain.dpAuditManName = ''
        this.model.settleDomain.dpAuditOpinion = ''
        this.model.settleDomain.auditTime = ''
        this.showNation = false
        switch (record.settleDomain.dpAuditFlag){
          case '1':
            this.currentStatus = 1
            this.showHistoryProcess = {"0":{flag:true,status:'finish'},"1":{flag:true,status:'error'},"2":{flag:true,status:'wait'}}
          break
          case '2':
            this.currentStatus = 0
            this.showNation = true
            this.showHistoryProcess = {"0":{flag:true,status:'finish'},"1":{flag:false,status:'wait'},"2":{flag:false,status:'wait'}}
          break
        }
      }else{
        this.showNation = true
      }
        

      this.visible = true
    },
    handleAudit(){
      this.$refs.AuditForm.showModal(this.model.settleDomain.id,this.model.settleDomain.dpAuditFlag)
    },
    auditModalOk() {
      this.$emit('ok')
      this.visible = false
      this.handleCancel()
    },
    handleRemark(){
      this.$refs.ModifyRemarkFrom.showModal(this.model.settleDomain)
    },
    callback(key){
      if(key === '2' && Object.keys(this.contractInfo).length === 0){
        httpAction(`${this.url.contract}${this.model.settleDomain.belongContract}`,null,'get').then(res=>{
          if(res.code === 200){
            this.contractInfo = res.data
            this.contractInfo.businessType = getNameFromArr(this.allTypeList,res.data.businessType,'id','label')
            this.contractInfo.businessSub = getNameFromArr(this.allTypeList,res.data.businessSub,'id','label')
            this.contractInfo.businessDeveloperName = getNameFromArr(this.businessDeveloper,res.data.businessDeveloperId,'user_id','nickname')
            this.contractInfo.businessDeveloperOrganName = getNameFromArr(this.organs,res.data.businessDeveloperOrgan,'id','organName')
          }else{
            this.$message.warning(res.msg)
          }
        })
      }else if(key === '3' && Object.keys(this.customerInfo).length === 0){
        httpAction(`${this.url.customer}${this.model.settleDomain.customerId}`,null,'get').then(res=>{
          if(res.code === 200){
            this.customerInfo = res.data
            this.customerInfo.parentId = res.data.parentId > 0 ? getNameFromTree(this.customerTreeData,res.data.parentId,'value','title') : '-'
            this.customerInfo.industryBelong = getNameFromArr(this.industryBelongDictOptions,res.data.industryBelong,'id','label')
            this.customerInfo.industrySub = getNameFromArr(this.industrySubOption,res.data.industrySub,'id','label')
            this.customerInfo.customerAddress = getAreaName(res.data.province,res.data.city,res.data.town,'')
            this.customerInfo.belongArea = getAreaName(res.data.belongProvince,res.data.belongCity,res.data.belongTown,' ')
            this.customerInfo.nature = getNameFromArr(this.natureDictOptions,res.data.nature,'value','label')
          }else{
            this.$message.warning(res.msg)
          }
        })
      }else if(key === '5' && this.recordSource.length === 0){
        // 查询操作记录
        httpAction(`/hrBase/lupdaterecord/page?modul=2&domainId=${this.model.settleDomain.id}`,null,'get').then((res)=>{
          if(res.code === 200){
            this.recordSource = res.data.records
            this.ipagination.total = res.data.total
          }
        })
      }
    },
    getPageDate(current,size){
      httpAction(`/hrBase/lupdaterecord/page?modul=2&domainId=${this.model.settleDomain.id}&current=${current}&size=${size}`,null,'get').then((res) => {
        if(res.code === 200 && res.data){
          this.recordSource = res.data.records
          this.ipagination.total = res.data.total
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    getDefaultVal(val){
      return val || '空'
    },
    ternaryCondition(condit,val1,val2,val3){
      if(String(condit) === '0'){
        return val1
      }else if(String(condit) === '1'){
        return val2
      }else{
        return val3
      }
    },
    async changeLog(expand,record){
      let key = 0
      this.recordSource.forEach((element,index) => {
        if(element.id == record.id){
          key = index
          return
        }
      })
      const arr = []
      if(record.differenceInfo){
        const oldInfo = JSON.parse(record.oldInfo)
        const newInfo = JSON.parse(record.newInfo)
        const contractObj = {old:'',new:''}
        if(/belongContract/.test(record.differenceInfo)){
          // 判断是否存在belongContract
          if(oldInfo.hasOwnProperty('belongContract') && oldInfo.belongContract){
            const res = await httpAction(`/hrBase/tcustomercontract/${oldInfo.belongContract}`, null, 'get')
            if (res.code === 200) {
              contractObj.old = res.data.contractName
            }
          }
          if(newInfo.hasOwnProperty('belongContract') && newInfo.belongContract){
            const res = await httpAction(`/hrBase/tcustomercontract/${newInfo.belongContract}`, null, 'get')
            if (res.code === 200) {
              contractObj.new = res.data.contractName
            }
          }
        }
        record.differenceInfo.split(',').map((item)=>{
          let index = 0
          console.log(item);
          switch (true){
            case (/dpAuditFlag/.test(item)):
              arr.push({
                name:this.fields[item],
                oldField:this.dpAuditFlagOption[oldInfo[item]],
                newField:this.dpAuditFlagOption[newInfo[item]]
              })
            break
            case (/(incomeBelong$)/.test(item)):
              arr.push({
                name:this.fields[item],
                oldField:getNameFromArr(this.organs,oldInfo.incomeBelong,'id','organName'),
                newField:getNameFromArr(this.organs,newInfo.incomeBelong,'id','organName'),
              })
            break
            case (/incomeBelongSub/.test(item)):
              arr.push({
                name:this.fields[item],
                oldField:getNameFromArr(this.organs,oldInfo.incomeBelongSub,'id','organName'),
                newField:getNameFromArr(this.organs,newInfo.incomeBelongSub,'id','organName'),
              })
            break
            case (/(province|city|town)/.test(item)):
              switch (item){
                case 'province' :
                  index = 0;
                  break;
                case 'city' :
                  index = 1;
                  break;
                case 'town' :
                  index = 2;
                  break;
              }
              arr.push({
                name:this.fields[item],
                oldField:getAreaFieldName(oldInfo.province,oldInfo.city,oldInfo.town,index),
                newField:getAreaFieldName(newInfo.province,newInfo.city,newInfo.town,index),
              })
            break
            case (/belongContract/.test(item)):
              arr.push({
                name:this.fields[item],
                oldField:this.getDefaultVal(contractObj.old),
                newField:this.getDefaultVal(contractObj.new)
              })
            break
            case (/(managementType|riskFundType|riskManagementType)/.test(item)):
              arr.push({
                name:this.fields[item],
                oldField:this.ternaryCondition(oldInfo[item],'按固定值收费','按比例收费','空'),
                newField:this.ternaryCondition(newInfo[item],'按固定值收费','按比例收费','空')
              })
            break
            case (/createType/.test(item)):
              arr.push({
                name:this.fields[item],
                oldField:this.ternaryCondition(oldInfo[item],'合同之后','先于合同','空'),
                newField:this.ternaryCondition(newInfo[item],'合同之后','先于合同','空')
              })
            break
            case (/relateFlag/.test(item)):
              arr.push({
                name:this.fields[item],
                oldField:this.ternaryCondition(oldInfo[item],'是','否','空'),
                newField:this.ternaryCondition(newInfo[item],'是','否','空')
              })
            break
            case (/existAdvancePayment/.test(item)):
              arr.push({
                name:this.fields[item],
                oldField:this.ternaryCondition(oldInfo[item],'偶发性垫付','业务约定性垫付','空'),
                newField:this.ternaryCondition(newInfo[item],'偶发性垫付','业务约定性垫付','空')
              })
            break
            case (/(managementTaxTag|riskFundTaxTag)/.test(item)):
              arr.push({
                name:this.fields[item],
                oldField:this.ternaryCondition(oldInfo[item],'税前','税后','空'),
                newField:this.ternaryCondition(newInfo[item],'税前','税后','空'),
              })
            break
            case (/socialCardTaker/.test(item)):
              arr.push({
                name:this.fields[item],
                oldField:this.ternaryCondition(oldInfo[item],'单位','个人','空'),
                newField:this.ternaryCondition(newInfo[item],'单位','个人','空'),
              })
            break
            case (/(managementTag|riskFundTag|managementExpFlag|riskManagementTaxTag)/.test(item)):
              arr.push({
                name:this.fields[item],
                oldField:this.ternaryCondition(oldInfo[item],'是','否','否'),
                newField:this.ternaryCondition(newInfo[item],'是','否','否'),
              })
            break
            case (/taxType/.test(item)):
              arr.push({
                name:this.fields[item],
                oldField:getNameFromArr(this.taxTypeDicts,oldInfo[item],'id','label'),
                newField:getNameFromArr(this.taxTypeDicts,newInfo[item],'id','label'),
              })
            break
            case (/insuranceType/.test(item)):
              arr.push({
                name:this.fields[item],
                oldField:getNameFromArr(this.insuranceTypeDicts,oldInfo[item],'id','label'),
                newField:getNameFromArr(this.insuranceTypeDicts,newInfo[item],'id','label'),
              })
            break
            case (/(businessThirdType|businessSecondType|businessPrimaryType)/.test(item)):
              arr.push({
                name:this.fields[item],
                oldField:getNameFromArr(this.allTypeList,oldInfo[item],'id','label'),
                newField:getNameFromArr(this.allTypeList,newInfo[item],'id','label'),
              })
            break
            case (/alertDay/.test(item)):
              arr.push({
                name:`${oldInfo.project}-${this.fields[item]}`,
                oldField:`每月${oldInfo[item]}日`,
                newField:`每月${newInfo[item]}日`,
              })
              break
            case (/cycle/.test(item)):
              arr.push({
                name:`${oldInfo.project}-${this.fields[item]}`,
                oldField:`${oldInfo[item]}个月`,
                newField:`${newInfo[item]}个月`,
              })
              break
            case (/status/.test(item)):
              arr.push({
                name:`${oldInfo.project}-${this.fields[item]}`,
                oldField:this.ternaryCondition(oldInfo[item],'正常','关闭',''),
                newField:this.ternaryCondition(newInfo[item],'正常','关闭',''),
              })
              break
            case (/firstAlertDate/.test(item)):
              arr.push({
                name:`${oldInfo.project}-${this.fields[item]}`,
                oldField:oldInfo[item],
                newField:newInfo[item],
              })
              break
            default:
              arr.push({
                name:this.fields[item],
                oldField:this.getDefaultVal(oldInfo[item]),
                newField:this.getDefaultVal(newInfo[item])
              })
            break
          }
        })
      }
      
      this.$set(this.recordDetailList,key,arr)
      console.log(this.recordDetailList);
    },
    tableChange(pagination){
      //分页、排序、筛选变化时触发
      this.ipagination = pagination
      this.getPageDate(pagination.current,pagination.pageSize)
    },
    handlePreview(file) {
      const fileExt = file.name.replace(/.+\./, '')
      const reg = new RegExp(fileExt, 'gi')
      if (reg.test(this.fileTypeOfOffice)) {
        this.previewVisible = false
        window.open(
          `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url || file.thumbUrl)}`,
          '_blank'
        )
      } else if (/(pdf|zip|rar)/gi.test(fileExt)) {
        window.open(file.url || file.thumbUrl, '_blank')
      } else {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      }
    },
    handlePreviwCancel() {
      this.previewVisible = false
    },
    handleOk() {
      this.handleCancel()
    },
    modalFormOk(remark){
      this.model.settleDomain.newRemark = remark
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.contractInfo = this.customerInfo = {}
      this.auditFlag = false
      this.currentStatus = 1
      this.recordSource = []
      this.recordDetailList = []
    },
    
    initDictConfig() {
      initDictOptions('Tax_Type').then(res => {
        if (res.code === 200) {
          this.taxTypeDicts = res.data
        }
      })
      initDictOptions('MANAGE_SERVER_ITEM').then(res => {
        if (res.code === 200) {
          this.manageServerItemsDicts = res.data
        }
      })
      initDictOptions('RISK_SERVER_ITEM').then(res => {
        if (res.code === 200) {
          this.riskServerItemsDicts = res.data
        }
      })
      initDictOptions('customer_business_type').then((res) => {
        if (res.code === 200) {
          this.businessTypeDicts = res.data
        }
      })

      initDictOptions('customer_business_sub_type').then((res) => {
        if (res.code === 200) {
          this.businessSubDicts = res.data
        }
      })
      // 客户行业类型
      initDictOptions('industryBelong').then(res => {
        if (res.code === 200) {
          this.industryBelongDictOptions = res.data
        }
      })
      // 客户行业类型细分
      initDictOptions('industrySub').then(res => {
        if (res.code === 200) {
          this.industrySubOption = res.data
        }
      })
      // 客户性质
      initDictOptions('nature').then(res => {
        if (res.code === 200) {
          this.natureDictOptions = res.data
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.mbot{
  margin-bottom: 20px;
}
.coverTit{
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  font-size: 16px;
  line-height: 1.5;
}
.remark{
  float: right;
  margin-right: 30px;
}
.tableCover{
  :global(th) {
    padding: 8px !important;
  }
  :global(td) {
    padding: 8px !important;
  }
}
/deep/ .ant-descriptions-item-label{
  width:150px !important;
}
/deep/ .ant-descriptions-item-content{
  width:275px !important;
}
.remaind{
  border-bottom: 1px solid #797979;
  .ant-col{
    border: 1px solid #797979;
    height: 45px;
    line-height: 45px;
    text-align: center;
  }
  .borderRight{
    border-right: none;
  }
  .borderBottom{
    border-bottom: none;
  }
}
</style>