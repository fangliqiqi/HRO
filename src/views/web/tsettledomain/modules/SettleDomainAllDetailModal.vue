<template>
  <a-modal
    :title="title"
    :width="'90%'"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    style="top: 20px;"
    class="ant-modal_detail"
    :maskClosable="false"
    wrapClassName="outDialog"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关 闭</a-button>
      <a-button @click="handleDoAudit" type="primary" v-if="isAuditPage == 1">审核</a-button>
    </template>

    <page-layout :title="settleDomain.departName" logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" >
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="结算信息">
          <detail-list>
            <detail-list-item term="结算名称">{{ settleDomain.departName }}</detail-list-item>
            <detail-list-item term="合同主体">{{ settleDomain.contractName }}</detail-list-item>
            <detail-list-item term="所属客户">{{ settleDomain.customerName }}</detail-list-item>
            <detail-list-item term="收入归属">{{ settleDomain.incomeBelong }}</detail-list-item>
            <detail-list-item term="收入归属细分">{{ settleDomain.incomeBelongSub || '--' }}</detail-list-item>
            <detail-list-item term="服务项目">
              <a-tag v-for="(item,index) in serverItems" :key="index">{{ item }}</a-tag>
            </detail-list-item>
            <detail-list-item term="所属地区">
              {{ settleDomain.areaName }}
            </detail-list-item>
            <!-- <detail-list-item term="余额">
              ¥ {{ settleDomain.balance }}
            </detail-list-item> -->
          </detail-list>
          <detail-list>
            <detail-list-item term="社保卡是否收取">{{ departSettlementInfo.socialCardTaker | socialCardTakerFilter }}</detail-list-item>
            <detail-list-item term="管理费是否收费">{{ departSettlementInfo.managementTag | managementTagFilter }}</detail-list-item>
            <detail-list-item term="风险金是否收取">{{ departSettlementInfo.riskFundTag | riskFundTagFilter }}</detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="管理费收费类型" v-if="departSettlementInfo.managementType != null && departSettlementInfo.managementType != ''">{{ departSettlementInfo.managementType | managementTypeFilter }}</detail-list-item>
            <detail-list-item term="管理费费率/金额" v-if="departSettlementInfo.managementFee != null && departSettlementInfo.managementFee != ''">{{ departSettlementInfo.managementFee }} <span v-if="departSettlementInfo.managementType == 1">%</span></detail-list-item>
            <detail-list-item term="风险金收费类型" v-if="departSettlementInfo.riskFundType != null && departSettlementInfo.riskFundType != ''">{{ departSettlementInfo.riskFundType | riskFundTypeFilter }}</detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="风险金费用/费率" v-if="departSettlementInfo.riskFundFee != null && departSettlementInfo.riskFundFee != ''">{{ departSettlementInfo.riskFundFee }}<span v-if="departSettlementInfo.riskFundType == 1">%</span>
            </detail-list-item>
            <detail-list-item term="风险金税收类型" v-if="departSettlementInfo.riskFundTaxTag != null && departSettlementInfo.riskFundTaxTag != ''">
              {{ departSettlementInfo.riskFundTaxTag | managementTaxTagFilter }}
            </detail-list-item>
            <detail-list-item term="管理费税收类型" v-if="departSettlementInfo.managementTaxTag != null && departSettlementInfo.managementTaxTag != ''">
              {{ departSettlementInfo.managementTaxTag | managementTaxTagFilter }}
            </detail-list-item>
            <detail-list-item term="单位大病比例">{{ departSettlementInfo.unitSeriousIllnessProp }}<span>%</span></detail-list-item>
            <detail-list-item term="缴税税率">{{ departSettlementInfo.taxFee }}<span v-if="departSettlementInfo.taxFee">%</span></detail-list-item>
            <detail-list-item term="交税类型">{{ departSettlementInfo.taxType }}</detail-list-item>
          </detail-list>
          <detail-list :col="2">
            <detail-list-item term="管理费收取项目" v-if="departSettlementInfo.managementTag==0">
              <span v-if="departSettlementInfo.manageServerItem">
                <a-tag v-for="(item,index) in departSettlementInfo.manageServerItem.split(',')" :key="index">{{ item }}</a-tag>
              </span>
            </detail-list-item>
            <detail-list-item term="风险金收取项目" v-if="departSettlementInfo.riskFundTag==0">
              <span v-if="departSettlementInfo.riskServerItem">
                <a-tag v-for="(item,index) in departSettlementInfo.riskServerItem.split(',')" :key="index">{{ item }}</a-tag>
              </span>
            </detail-list-item>
          </detail-list>

          <!--<template slot="action">
            <a-button-group style="margin-right: 4px;">
              <a-button>操作</a-button>
              <a-button>操作</a-button>
              <a-button>
                <a-icon type="ellipsis" />
              </a-button>
            </a-button-group>
            <a-button type="primary">主操作</a-button>
          </template>-->

          <a-card
            :bordered="false"
            title="流程进度"
          >
            <template>
              <a-steps :current="currentStep">
                <a-step>
                  <template slot="title">
                    提交完成
                  </template>
                  <span slot="description">提交人：{{ settleDomain.commitUserName }}</span>
                </a-step>
                <a-step title="服务审核">
                  <span slot="description">审核人：{{ settleDomain.dpAuditManName }}</span>
                </a-step>
                <a-step title="流程结束" :status="currentStatus"/>
              </a-steps>
            </template>
          </a-card>

          <!-- 操作 -->
          <a-card
            style="margin-top: 24px"
            :bordered="false"
            :tabList="tabList"
            :activeTabKey="activeTabKey"
            @tabChange="(key) => {this.activeTabKey = key}"
          >
            <a-table
              v-if="activeTabKey === '1'"
              :columns="welfareColumns"
              :dataSource="welfareColumnsList"
              rowKey="id"
              :pagination="false"
            ></a-table>
            <a-table
              v-if="activeTabKey === '2'"
              :columns="tableHeaderCoverColumns"
              :dataSource="tableHeadSalaryCover"
              rowKey="id"
              :pagination="false"
            >
              <span slot="tableHeaderTypeScoped" slot-scope="text,record">
                <span v-if="record.type == 0">薪资封面</span>
                <span v-if="record.type == 1">商险封面</span>
                <span v-if="record.type == 2">核准表封面</span>
                <span v-if="record.type == 3">代理预估封面</span>
              </span>
            </a-table>
            <a-table
              v-if="activeTabKey === '3'"
              :columns="ticketConfigColumns"
              :dataSource="ticketConfigList"
              rowKey="id"
              :pagination="false"
            ></a-table>
            <a-table
              v-if="activeTabKey === '4'"
              :columns="approvalFormTickectColumns"
              :dataSource="approvalFormTickectList"
              rowKey="id"
              :pagination="false"
            ></a-table>
            <a-table
              v-if="activeTabKey === '5'"
              :columns="departEngineeringSettlementColumns"
              :dataSource="departEngineeringSettlementList"
              rowKey="id"
              :pagination="false"
            ></a-table>
            <a-table
              v-if="activeTabKey === '6'"
              :columns="businessRisksSettlementColumns"
              :dataSource="businessRisksSettlementList"
              rowKey="id"
              :pagination="false"
            >
              <span slot="managementTagScoped" slot-scope="text,record">
                <span v-if="record.managementTag == 0">收取</span>
                <span v-if="record.managementTag == 1">不收取</span>
              </span>
              <span slot="riskManagementType" slot-scope="text,record">
                <span v-if="record.riskManagementType == 0">按固定值收取</span>
                <span v-if="record.riskManagementType == 1">按比例收取</span>
              </span>
              <span slot="riskFundType" slot-scope="text,record">
                <span v-if="record.riskFundType == 0">按固定值收取</span>
                <span v-if="record.riskFundType == 1">按比例收取</span>
              </span>
              <span slot="riskFundTaxTag" slot-scope="text,record">
                <span v-if="record.riskFundTaxTag == 1">税后</span>
                <span v-if="record.riskFundTaxTag == 0">税前</span>
              </span>
              <span slot="riskManagementTaxTag" slot-scope="text,record">
                <span v-if="record.riskManagementTaxTag == 0">含税</span>
                <span v-if="record.riskManagementTaxTag == 1">不含税</span>
              </span>
            </a-table>
            <a-table
              v-if="activeTabKey === '7'"
              :columns="departAppointInfoColumns"
              :dataSource="departAppointInfoList"
              rowKey="id"
              :pagination="false"
            ></a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="3" tab="客户信息">
          <a-card
            :bordered="false"
            title="基本信息"
          >
            <detail-list>
              <detail-list-item term="客户名称">{{ customer.customerName }}</detail-list-item>
              <detail-list-item term="行业类型">{{ customer.industryBelong }}</detail-list-item>
              <detail-list-item term="行业细分">{{ customer.industrySub }}</detail-list-item>
              <detail-list-item term="客户地址">{{ customer.address }}</detail-list-item>
              <detail-list-item term="区域归属">{{ customer.belongArea }}</detail-list-item>
              <detail-list-item term="客户性质">{{ customer.nature }}</detail-list-item>
              <detail-list-item term="客户类型">{{ customerTypeOption[customer.customerType] }}</detail-list-item>
            </detail-list>
          </a-card>
          <a-card
            :bordered="false"
            title="流程进度"
          >
            <a-steps
              :direction="isMobile() && 'vertical' || 'horizontal'"
              :current="2"
              progressDot
            >
              <a-step>
                <template slot="title">
                  客户创建
                </template>
                <span slot="description">({{ customer.createUserName }})</span>
              </a-step>
              <a-step>
                <template slot="title">
                  客户审核
                </template>
                <span slot="description">({{ customer.prAuditManName == null ? '无' : customer.prAuditManName }})</span>
              </a-step>
              <a-step title="完成">
              </a-step>
            </a-steps>
          </a-card>
          <a-card
            :bordered="false"
            title="合同信息"
          >
            <a-table
              :columns="employeeContractColumns"
              :dataSource="customerContractList"
              :pagination="false"
              :scroll="{ x: 1}"
              rowKey="id"
            >
              <template
                slot="status"
                slot-scope="status"
              >
                <a-badge
                  :status="status | statusTypeFilter"
                  :text="status | statusFilter"
                />
              </template>

              <span
                slot="action"
                slot-scope="text, record"
              >
                <a @click="imagesPreviewShow(record)" v-if="record.fileList && record.fileList.length > 0">
                  <a-tag color="green" style="cursor: pointer">附件预览</a-tag>
                </a>
              </span>
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="4" tab="合同信息">
          <detail-list>
            <detail-list-item term="合同名称">{{ contract.contractName }}</detail-list-item>
            <detail-list-item term="所属客户">{{ contract.customerName }}</detail-list-item>
            <detail-list-item term="客户编码">{{ contract.customerCode }}</detail-list-item>
            <detail-list-item term="商务主体">{{ contract.businessSubjectName }}</detail-list-item>
            <detail-list-item term="合同类型">{{ contract.contractType }}</detail-list-item>
            <detail-list-item term="合同起止时间">{{ contract.startDate }} ~ {{ contract.endDate }}</detail-list-item>
            <detail-list-item term="合同有效期">{{ contract.contractTerm }}个月</detail-list-item>
            <detail-list-item term="业务类型">{{ contract.businessType }}</detail-list-item>
            <detail-list-item term="业务细分">{{ contract.businessSub }}</detail-list-item>
          </detail-list>
          <detail-list :col="2">
            <detail-list-item term="合同编号">{{ contract.contractCode }}</detail-list-item>
            <detail-list-item term="备注">{{ contract.remark }}</detail-list-item>
          </detail-list>
        </a-tab-pane>

        <a-tab-pane key="2" tab="操作记录" :forceRender="true">
          <a-table
            :columns="recordList"
            :dataSource="recordSource"
            :pagination="ipagination"
            @change="tableChange"
            :defaultExpandAllRows="true"
            rowKey="id"
          >
            <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
              {{ record.createTime }} 由  <a-tag color="blue">{{ record.createUserName }}</a-tag>编辑<br/>
              <span v-for="(item,index) in changeLog(record)" :key="index">
                修改了<strong>{{ item.name }}</strong>：旧值为:{{ item.oldField }}，新值为：{{ item.newField }}<br/>
              </span>
            </p>
          </a-table>
        </a-tab-pane>
      </a-tabs>

    </page-layout>
    <images-view-modal ref="imagesViewModal"></images-view-modal>
    <audit-modal ref="auditModal" @ok="auditModalOk"></audit-modal>
  </a-modal>
</template>

<script>
  import { mixinDevice } from '@/utils/mixin.js'
  import PageLayout from '@/components/page/PageLayout'
  import DetailList from '@/components/tools/DetailList'
  import { filterDict,initDictOptions,filterDictText,organDict } from '@/components/dict/JDictSelectUtil'
  import { httpAction } from '@/api/manage'
  import AuditModal from '../modules/AuditModal'
  import ImagesViewModal from '../../tcustomerunit/modules/ImagesViewModal'
  import { getAreaName,getAreaFieldName,getNameFromArr } from '@/utils/common'
  import { getAllTree } from '@/utils/common'
  const DetailListItem = DetailList.Item

  export default {
    name: "SettleDomainAllDetailModal",
    components: {
      AuditModal,
      PageLayout,
      DetailList,
      DetailListItem,
      ImagesViewModal
    },
    mixins: [mixinDevice],
    data () {
      return {
        title: '详细',
        visible: false,
        isAuditPage: 0,
        confirmLoading: false,
        treeData:[],
        industryBelongs:[],
        industrySub:[],
        model: {},
        settleDomain: {},
        appointInfo: {},
        departSettlementInfo: {},
        businessRisksSettlement: {},
        engineeringSettlement: {},
        buyWelfare: {},
        ticketConfig: {},
        approvalFormTickect: {},
        tableHeadSalaryCover: [],
        currentStep: 1,
        currentStatus: "wait",
        id:'',
        customerContracts: [],
        contractName:'', //合同主体名称
        taxTypeDicts: [],
        taxFeeDicts: [],
        insuranceTypeDicts: [],
        headCoverTypeDicts: [],
        serverItems: [],

        welfareColumnsList: [],
        ticketConfigList: [],
        approvalFormTickectList: [],
        departEngineeringSettlementList: [],
        businessRisksSettlementList: [],
        departAppointInfoList: [],
        businessSubDicts:[],
        businessTypeDicts: [],
        organs: [],
        tabList: [
          {
            key: '1',
            tab: '福利购买信息'
          },
          {
            key: '2',
            tab: '封面抬头'
          },
          // {
          //   key: '3',
          //   tab: '开票信息'
          // },
          {
            key: '4',
            tab: '核准表开票'
          },
          // {
          //   key: '5',
          //   tab: '工程结算配置'
          // },
          {
            key: '6',
            tab: '商险配置'
          },
          {
            key: '7',
            tab: '客户约定配置'
          },
        ],
        activeTabKey: '1',

        departAppointInfoColumns: [
          {
            title: "社保结算时间",
            dataIndex: "socialSettlementType"
          },
          {
            title: "公积金结算时间",
            dataIndex: "fundSettlementType"
          },
          {
            title: "工资发放时间",
            dataIndex: "salaryType"
          },
          {
            title: "客户到表时间",
            dataIndex: "customerGetformTime"
          },
          {
            title: "工资发放时间",
            dataIndex: "salaryGrantTime"
          },
          {
            title: "首次结算时间",
            dataIndex: "firstSettlementTime"
          },
          {
            title: "合同约定到款时间",
            dataIndex: "contractAppointGetfeeTime"
          },
        ],
        businessRisksSettlementColumns: [
          {
            title: "是否收取管理费",
            dataIndex: "managementTag",
            scopedSlots: { customRender: 'managementTagScoped' }
          },
          {
            title: "管理费收取方式",
            dataIndex: "riskManagementType",
            scopedSlots: { customRender: 'riskManagementType' }
          },
          {
            title: "商险管理费收取值",
            dataIndex: "riskManagementFee"
          },
          {
            title: "商险管理费收取比率",
            dataIndex: "riskManagementTax"
          },
          {
            title: "缴税类型",
            dataIndex: "taxType",
            customRender: (text) => {
              return filterDict(this.taxTypeDicts, text);
            }
          },
          {
            title: "缴税税率",
            dataIndex: "taxValue",
            customRender: (text) => {
              // return filterDictText(this.taxFeeDicts, text);
              return (text) ? (text + '%') : ''
            }
          },
          {
            title: "管理费税收是否含税",
            dataIndex: "riskManagementTaxTag",
            scopedSlots: { customRender: 'riskManagementTaxTag' }
          },
        ],
        departEngineeringSettlementColumns: [
          {
            title: "企业所得税",
            dataIndex: "businessTax"
          },
          {
            title: "个人所得税",
            dataIndex: "personalTax"
          },
          {
            title: "统谈比率",
            dataIndex: "nagotiationsTax"
          },
          {
            title: "增值税金及附加",
            dataIndex: "addedValueTaxAddition"
          },
          {
            title: "管理费率",
            dataIndex: "managementTax"
          },
          {
            title: "合计比例",
            dataIndex: "sumTax"
          },
        ],
        approvalFormTickectColumns: [
          {
            title: "客户开票名称",
            dataIndex: "customerTicketName"
          },
          {
            title: "我司到款单位名称",
            dataIndex: "selfTomoneyUnitName"
          },
        ],
        ticketConfigColumns: [
          {
            title: "抬头名称",
            dataIndex: "ticketTableHead"
          },
          {
            title: "纳税人识别号",
            dataIndex: "taxpayerIdentificationNo"
          },
          {
            title: "地址",
            dataIndex: "addr"
          },
          {
            title: "电话",
            dataIndex: "phone"
          },
          {
            title: "开户行",
            dataIndex: "bankName"
          },
          {
            title: "银行卡号",
            dataIndex: "bankNo"
          },
        ],
        tableHeaderCoverColumns: [
          {
            title: "抬头名称",
            dataIndex: "coverName"
          },
          {
            title: "抬头类型",
            dataIndex: "type",
            scopedSlots: { customRender: 'tableHeaderTypeScoped' }
          },
        ],
        welfareColumns: [
          {
            title: "福利购买地",
            dataIndex: 'welfareAddr',
          },
          {
            title: "保险类型",
            dataIndex: 'insuranceType',
            customRender: (text) => {
              return filterDict(this.insuranceTypeDicts, text);
            }
          },
          {
            title: "其他福利",
            dataIndex: 'otherWelfare',
          }
        ],
        url: {
          doAudit: "/hrBase/tsettledomain/audit/",
          getCustomerContract: "/hrBase/tcustomercontract/",
          getIncomeBelongSub: "/admin/organizationinfo/getDepartByUnitId",
          getCustomer:'/hrBase/tcustomerinfo/vo/',
          getContract:'/hrBase/tcustomercontract/'
        },
        recordList:
        [
          {
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
            customRender:(text)=>{
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
          },
        ],
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
          lastUpdateTime:'最后更新时间'
        },
        dpAuditFlagOption:['审核通过','审核不通过','待审核','待提交','经理通过','经理不通过'],
        customerTypeOption:{'0':'集团客户','1':'集团客户','2':'一般客户','3':'电信客户'},
        tabpane:{
          customer:true,
          contract:true
        },
        customer:{}, // 客户信息
        natureDictOptions: [],
        industryBelongDictOptions: [],
        industrySubDict: [],
        contractTypeDicts: [],
        customerContractList: [],
        //员工合同列表标题
        employeeContractColumns: [
          {
            title: "合同名称",
            dataIndex: 'contractName',
            key: 'contractName',
            width:150,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: "合同编号",
            dataIndex: 'contractCode',
            key: 'contractCode',
            width:150,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: "商务主体",
            dataIndex: 'businessSubject',
            key: 'businessSubject',
            width:150,
            ellipsis: true,
            customRender:(text)=>{
              const organs = organDict(this.organs, text)
              return <a-tooltip
                placement="topLeft"
                title={organs}
              >{organs}</a-tooltip>
            }
          },
          {
            title: "合同类型",
            dataIndex: 'contractType',
            key: 'contractType',
            width:120,
            ellipsis: true,
            customRender:(text)=>{
              const type = filterDict(this.contractTypeDicts, text)
              return <a-tooltip
                placement="topLeft"
                title={type}
              >{type}</a-tooltip>
            }
          },
          {
            title: "合同起止日期",
            dataIndex: 'startDate',
            key: 'startDate',
            width:200,
            ellipsis: true,
            customRender:(text,record)=>{
              const range = `${text}~${record.endDate}`
              return <a-tooltip
                placement="topLeft"
                title={range}
              >{range}</a-tooltip>
            }
          },
          {
            title: "业务类型",
            dataIndex: 'businessType',
            key: 'businessType',
            width:120,
            ellipsis: true,
            customRender:(text)=>{
              const business = filterDict(this.businessTypeDicts, text)
              return <a-tooltip
                placement="topLeft"
                title={business}
              >{business}</a-tooltip>
            }
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed:'right',
            width:100,
            scopedSlots: { customRender: 'action' }
          }
        ],
        contract:{},
        fileTypeOfOffice: ['xls','xlsx','doc','docx','ppt','pptx','pdf'],
        fileTypeOfImage: ['jpg','jpeg','png','bmp','JPG','JPEG','gif'],

      }
    },
    filters: {
      statusTypeFilter(type) {
        const statusTypeMap = {
          'agree': 'success',
          'reject': 'error'
        }
        return statusTypeMap[type]
      },
      statusFilter(status) {
        const statusMap = {
          'agree': '成功',
          'reject': '驳回'
        }
        return statusMap[status]
      },
      socialCardTakerFilter(type) {
        const socialCardTakerMap = {
          '0': '是',
          '1': '否'
        }
        return socialCardTakerMap[type]
      },
      managementTagFilter(type) {
        const managementTagMap = {
          '0': '是',
          '1': '否'
        }
        return managementTagMap[type]
      },
      managementTypeFilter(type) {
        const managementTypeMap = {
          '0': '按固定值收费',
          '1': '按比例收费'
        }
        return managementTypeMap[type]
      },
      riskFundTagFilter(type) {
        const riskFundTagMap = {
          '0': '是',
          '1': '否'
        }
        return riskFundTagMap[type]
      },
      riskFundTypeFilter(type) {
        const riskFundTypeMap = {
          '0': '按固定值收费',
          '1': '按比例收费'
        }
        return riskFundTypeMap[type]
      },
      managementTaxTagFilter(type) {
        const managementTaxTagMap = {
          '0': '税前',
          '1': '税后'
        }
        return managementTaxTagMap[type]
      }
    },
    created () {
      this.initDictConfig();
    },
    methods: {
      edit(record,id) {
        this.id = id
        this.welfareColumnsList = [];
        this.ticketConfigList = [];
        this.departEngineeringSettlementList = [];
        this.approvalFormTickectList = [];
        this.businessRisksSettlementList = [];
        this.departAppointInfoList = [];

        this.settleDomain = Object.assign({}, record.settleDomain)
        this.appointInfo = Object.assign({}, record.appointInfo)
        this.departSettlementInfo = Object.assign({}, record.departSettlementInfo)
        this.businessRisksSettlement = Object.assign({}, record.businessRisksSettlement)
        this.engineeringSettlement = Object.assign({}, record.engineeringSettlement)
        this.buyWelfare = Object.assign({}, record.buyWelfare)
        this.ticketConfig = Object.assign({}, record.ticketConfig)
        this.approvalFormTickect = Object.assign({}, record.approvalFormTickect)
        this.tableHeadSalaryCover = record.tableHeadSalaryCover;
        this.getIncomeBelongSub(this.settleDomain.incomeBelong);
        this.serverItems = (this.settleDomain.serverItem) ? this.settleDomain.serverItem.split(",") : [];
        this.settleDomain.contractName = this.contractName
        this.settleDomain.areaName = getAreaName(this.settleDomain.province,this.settleDomain.city,this.settleDomain.town)
        this.settleDomain.incomeBelong = getNameFromArr(this.organs,this.settleDomain.incomeBelong,'id','organName')
        this.settleDomain.incomeBelongSub = getNameFromArr(this.organs,this.settleDomain.incomeBelongSub,'id','organName')
        for (let i = 0; i < this.taxTypeDicts.length; i++) {
          if (this.departSettlementInfo.taxType == this.taxTypeDicts[i].id) {
            this.departSettlementInfo.taxType = this.taxTypeDicts[i].label
          }
        }
        this.welfareColumnsList.push(this.buyWelfare)
        this.ticketConfigList.push(this.ticketConfig)
        this.departEngineeringSettlementList.push(this.engineeringSettlement)
        this.approvalFormTickectList.push(this.approvalFormTickect)
        this.businessRisksSettlementList.push(this.businessRisksSettlement)
        this.departAppointInfoList.push(this.appointInfo)
        // 查询操作记录
        httpAction(`/hrBase/lupdaterecord/page?modul=2&domainId=${id}`,null,'get').then((res)=>{
          if(res.code === 200){
            this.recordSource = res.data.records
            this.ipagination.total = res.data.total
          }
        })
        this.visible = true
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
      changeLog(record){
        const arr = []
        if(record.differenceInfo){
          const oldInfo = JSON.parse(record.oldInfo)
          const newInfo = JSON.parse(record.newInfo)
          record.differenceInfo.split(',').map((item)=>{
            let index = 0
            switch (true){
              case (/dpAuditFlag/.test(item)):
                arr.push({
                  name:this.fields[item],
                  oldField:this.getDefaultVal(this.dpAuditFlagOption[oldInfo[item]]),
                  newField:this.getDefaultVal(this.dpAuditFlagOption[newInfo[item]])
                })
              break
              case (/(incomeBelong$|incomeBelongSub)/.test(item)):
                arr.push({
                  name:this.fields[item],
                  oldField:getNameFromArr(this.organs,oldInfo.incomeBelong,'id','organName'),
                  newField:getNameFromArr(this.organs,newInfo.incomeBelong,'id','organName'),
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
                  oldField:oldInfo[item],
                  newField:this.settleDomain.belongContract
                })
              break
              case (/(managementType|riskFundType|riskManagementType)/.test(item)):
                arr.push({
                  name:this.fields[item],
                  oldField:this.ternaryCondition(oldInfo[item],'按固定值收费','按比例收费','空'),
                  newField:this.ternaryCondition(newInfo[item],'按固定值收费','按比例收费','空')
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
        return arr
      },
      getPageDate(current,size){
        httpAction(`/hrBase/lupdaterecord/page?modul=2&domainId=${this.id}&current=${current}&size=${size}`,null,'get').then((res) => {
          if(res.code === 200 && res.data){
            this.recordSource = res.data.records
            this.ipagination.total = res.data.total
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      tableChange(pagination){
        //分页、排序、筛选变化时触发
        this.ipagination = pagination
        this.getPageDate(pagination.current,pagination.pageSize)
      },
      handleDoAudit() {
        this.$refs.auditModal.showModal(this.settleDomain.id);
      },
      belongContractChange(t) {
        httpAction(this.url.getCustomerContract + t, null, 'GET').then((res) => {
          if(res.code == 200 && res.data != null) {
            this.settleDomain.customerId = res.data.customerName
          }
        });
      },
      getIncomeBelongSub(value) {
        httpAction(this.url.getIncomeBelongSub + "?unitId=" + value, null, "GET").then((res) => {
          if(res.code == 200 && res.data.length > 0) {
            for (let i = 0; i < res.data.length; i++) {
              if(this.settleDomain.incomeBelongSub == res.data[i].id) {
                this.settleDomain.incomeBelongSub = res.data[i].ORGAN_NAME
              }
            }
          }
        });
      },
      callback(key){
        // 客户信息
        if(String(key) === '3' && this.tabpane.customer){
          httpAction(this.url.getCustomer + this.settleDomain.customerId, null, 'GET').then((res) => {
            if(res.code === 200 && res.data != null) {
              this.customer = res.data
              this.customer.industryBelong = filterDict(this.industryBelongDictOptions,res.data.industryBelong)
              this.customer.industrySub = filterDict(this.industrySubDict,res.data.industrySub)
              this.customer.address = `${getAreaName(res.data.province,res.data.city,res.data.town)} ${res.data.address}`
              this.customer.belongArea = getAreaName(res.data.belongProvince,res.data.belongCity,res.data.belongTown)
              this.customer.nature = filterDictText(this.natureDictOptions,res.data.nature)
              this.customerContractList = res.data.contractVoList
            }else{
              this.$message.warning(res.msg)
            }
          }).finally(()=>{
            this.tabpane.customer = false
          })
        }
        this.handleTabpane(key)
      },
      // 合同信息详情
      handleTabpane(key){
        if(String(key) === '4' && this.tabpane.contract){
          httpAction(this.url.getContract + this.settleDomain.belongContract, null, 'GET').then((res) => {
            if(res.code === 200){
              this.contract = res.data
              this.contract.contractType = filterDict(this.contractTypeDicts,res.data.contractType)
              this.contract.businessType = filterDict(this.businessTypeDicts,res.data.businessType)
              this.contract.businessSub = filterDict(this.businessSubDicts,res.data.businessSub)
            }else{
              this.$message.warning(res.msg)
            }
          }).finally(()=>{
            this.tabpane.contract = false
          })
        }
      },
      imagesPreviewShow(record) {
        console.log(record,5555)
        this.$refs.imagesViewModal.showModal(record)
      },
      /**
       * 加载数据字典
       */
      initDictConfig() {
        initDictOptions('Tax_Type').then((res) => {
          if (res.code === 200) {
            this.taxTypeDicts = res.data;
          }
        });
        initDictOptions('Tax_FEE').then((res) => {
          if (res.code === 200) {
            this.taxFeeDicts = res.data;
          }
        });
        initDictOptions('insuranceType').then((res) => {
          if (res.code === 200) {
            this.insuranceTypeDicts = res.data;
          }
        });
        initDictOptions('headCoverType').then((res) => {
          if (res.code === 200) {
            this.headCoverTypeDicts = res.data;
          }
        });
        initDictOptions('nature').then((res) => {
          if (res.code === 200) {
            this.natureDictOptions = res.data;
          }
        });
        // 行业类型

        initDictOptions('industryBelong').then((res) => {
          if (res.code === 200) {
            this.industryBelongDictOptions = res.data;
          }
        });

        initDictOptions('industrySub').then((res) => {
          if (res.code === 200) {
            this.industrySubDict = res.data;
          }
        });
        initDictOptions('customer_contract_type').then((res) => {
          if (res.code === 200) {
            this.contractTypeDicts = res.data;
          }
        });
        // 业务类型
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
        // initDictOptions('customer_business_type').then((res) => {
        //   if (res.code === 200) {
        //     this.businessTypeDicts = res.data;
        //   }
        // });
        initDictOptions('customer_business_sub_type').then((res) => {
          if (res.code === 200) {
            this.businessSubDicts = res.data;
          }
        });
      },
      handleOk() {
        this.close()
      },
      auditModalOk() {
        this.$emit('ok')
        this.visible = false
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.tabpane.customer = true
        this.tabpane.contract = true
      }
    }
  }
</script>

<style lang="scss" scoped>
.detail-layout {
  margin-left: 44px;
}
.text {
  color: rgba(0, 0, 0, 0.45);
}

.heading {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
}

.no-data {
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  line-height: 64px;
  font-size: 16px;

  i {
    font-size: 24px;
    margin-right: 16px;
    position: relative;
    top: 3px;
  }
}

.mobile {
  .detail-layout {
    margin-left: unset;
  }
  .text {
  }
  .status-list {
    text-align: left;
  }
}
.ant-modal_detail {
  margin-top: 65px;
}
</style>