<template>
  <a-modal
    title="工资报表"
    :width="1300"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    cancelText="取消"
    okText="保存并提交"
    :visible="visible"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >取消</a-button>
      <a-button
        type="primary"
        @click="handleDownload"
        :loading="downloading"
      >导出</a-button>
      <a-button
        type="primary"
        @click="handleSave"
        :loading="loading"
      >保存并提交</a-button>
    </template>
    <a-card
      :bordered="false"
      style="background:#f5f5f5"
    >
      <a-tabs
        :activeKey="activityKey"
        @change="changeTab"
      >
        <a-tab-pane
          :forceRender="true"
          tab="工资明细"
          key="1"
        >
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSourceList"
            :loading="loading"
            :scroll="{ x: 1 }"
          >
            <template
              slot="operation"
              slot-scope="text, record"
            >
              <a @click="detail(record.id)">详情</a>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane
          key="2"
          :forceRender="true"
        >
          <span slot="tab">
            <a-icon
              v-if="settleExclamation == true"
              type="exclamation"
              style="color:red"
            />
            结算表
          </span>
          <salary-settle-account-modal
            ref="settleAccountModal"
            :salaryStandardInfo="salaryStandardInfo"
            :settlementhFormInfo="settlementhFormInfo"
            :pauseDiyInfoList="pauseDiyInfoList"
            :poorBalanceInfoList="poorBalanceInfoList"
            :salaryAccountOne="salaryAccountOne"
            :incomeBelongList="incomeBelongList"
            :projectList="projectList"
            @curOk="handlecurOk"
            @ok="splitIncome"
          ></salary-settle-account-modal>

        </a-tab-pane>
        <a-tab-pane
          key="3"
          :forceRender="true"
        >
          <span slot="tab">
            <a-icon
              v-if="coverExclamation == true"
              type="exclamation"
              style="color:red"
            />
            封面
          </span>
          <salary-page-modal
            ref="salaryPageModal"
            :salaryStandardInfo="salaryStandardInfo"
            :coverList="coverList"
            :bankOptions="bankOptions"
          ></salary-page-modal>
        </a-tab-pane>
        <a-tab-pane
          key="4"
          :forceRender="true"
        >
          <span slot="tab">
            <a-badge dot status="warning">
              流程进展明细
            </a-badge>
          </span>
          <salary-progress-modal
            ref="salaryProgressModal"
            :salaryStandardInfo="salaryStandardInfo"
            :auditLogList="auditLogList"
          ></salary-progress-modal>
        </a-tab-pane>
        <a-tab-pane
          key="5"
          tab="匹配明细"
          :forceRender="true"
        >
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="matchDetailColumns"
            :dataSource="matchDetailData"
            :loading="loading"
            :scroll="{ x: 1 }"
          >
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-card v-if="activityKey == 4">
      <salary-form-modal
        ref="salaryFormModal"
        :salaryStandardInfo="salaryStandardInfo"
        :settlementAmount="settlementAmount"
        :fileList="fileList"
        @import="handleImport"
        @remove="handleRemove"
      ></salary-form-modal>
    </a-card>
    <a-modal
      title="提交审核"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleCancelCheck"
      @ok="handleCheckOk"
      cancelText="取消"
      okText="提交"
      :visible="visibleCheck"
    >
      <a-form :form="form">
        <a-form-item
          label="请选择审批人"
          style="margin-left: 28px"
        >
          <a-select
            showSearch
            placeholder="请选择审批人"
            optionFilterProp="children"
            v-decorator="['AuditUser', {rules: [{ required: true, message: '请选择审核人！' }]}]"
            style="width: 200px"
            @change="handleChange"
          >
            <a-select-option
              v-for="(item, index) in employData"
              :key="index"
              :value="item.userId"
            >{{ item.nickname }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 工资明细详情 -->
    <statement-detail-modal ref="statementDetailModal"></statement-detail-modal>
    <radio-modal ref="RadioModalForm" :slaryFlag="slaryFlag" @close="handleClose" @ok="handleOk"></radio-modal>
  </a-modal> 
</template>

<script>
import { httpAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SalarySettleAccountModal from './SalarySettleAccountModal'
import SalaryPageModal from './SalaryPageModal'
import SalaryProgressModal from './SalaryProgressModal'
import SalaryFormModal from './SalaryFormModal'
import RadioModal from './RadioModal'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import {  mapGetters } from 'vuex'
import moment from 'moment'
import { getSettleDomainSelectVos } from '@/api/api'
import { getItemName,formatFloat } from '@/utils/common'
import { getBusinessType } from '@/utils/businessType'
import StatementDetailModal from '../../salary/searchsalary/modules/StatementDetailModal'
import pick from 'lodash.pick'

export default {
  name: 'SalaryStandardDetailModal',
  components: {
      SalarySettleAccountModal,
      SalaryPageModal,
      SalaryProgressModal,
      SalaryFormModal,
      StatementDetailModal,
      RadioModal
    },
  mixins: [JeecgListMixin],
  data() {
    return {
      visible:false,
      visibleCheck:false,
      downloading:false,
      form: this.$form.createForm(this),
      employData:[], // 人员数据
      bankOptions:[],
      loading:false,
      isFlag:{'0':'否','1':'是'}, // 是否薪资扣税  //本月是否重复金额
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'}, // 社保优先级
      fundPriorityOption:{'0':'生成','1':'缴纳'}, // 公积金优先级
      annualBonusTypeOption:{'0':'合并','1':'单独'}, // 年终奖扣税方案
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'}, // 工资发放时间
      distributionFlagOption:{'0':'未发放','1':'发放成功','2':'发放失败'},
      reciveUseOptions: {'0': '款项认领', '1': '垫付还款', '2': '商险预估还款'}, // 款项用途
      reciveTypeOptions: {'1': '薪资及其他', '2': '纯收入', '3': '事务性外包','4':'预估结算单'}, // 款项类型
      statusOutOptions: {
        '0': {'option': '未出账', 'color': 'blue'},
        '1': {'option': '部分出账', 'color': 'pink'},
        '2': {'option': '全部出账', 'color': 'green'}
      }, // 出账状态
      statusIncomeOptions: {
        '0': {'option': '未收入', 'color': 'blue'},
        '1': {'option': '部分收入', 'color': 'pink'},
        '2': {'option': '全部收入', 'color': 'green'}
      }, // 收入状态
      statusOptions: {
        '0': {'option': '正常', 'color': 'green'},
        '1': {'option': '撤销', 'color': 'red'}
      }, // 认领状态
      matchDetailData:[], // 匹配明细数据
      settleDomainBelongs: [],  // 结算主体
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      salaryStandardInfo:'', // 传入的列表record数据
      settlementAmount:'', // 流程进展明细结算单金额
      settlementhFormInfo:{}, // 结算单
      pauseDiyInfoList:[],
      poorBalanceInfoList:[],
      incomeBelongList:[],
      coverList:[], // 封面Tab 数据
      salaryAccountOne:{},
      model:{},
      activityKey:'1',
      dataSourceList:[], // 工作明细数据源
      detailData:{}, // 网络获取的详情数据
      auditLogList:[],//流程进展明细
      exclamation:false,
      settleExclamation:false,
      coverExclamation:false,
      slaryFlag:false,
      projectList:[],// 项目成本报销明细
      fileList:[],// 文件列表
      columns:[
        {
          width: 120,
          ellipsis: true,
          title: '姓名',
          dataIndex: 'empName',
          fixed: 'left',
          key: 'empName',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '工资发放方式',
          fixed: 'left',
          dataIndex: 'salaryStyle',
          key: 'salaryStyle',
          align: 'center',
          customRender:(text) => {
            return this.salaryStyleOption[text] || '-'
          }
        },
        {
          width: 240,
          ellipsis: true,
          align: 'center',
          title: '身份证号',
          key: 'empIdcard',
          dataIndex: 'empIdcard',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          align: 'center',
          title: '手机号码',
          key: 'empPhone',
          dataIndex: 'empPhone',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          align: 'center',
          title: '银行卡号',
          key: 'bankNo',
          dataIndex: 'bankNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          align: 'center',
          title: '开户行',
          key: 'bankName',
          dataIndex: 'bankName',
          customRender: (text) => {
            const bankName = filterDictText(this.bankOptions, text)
            if(String(bankName) === '-' && text){
              return text
            }
            return bankName
          }
        },
        {
          width: 150,
          ellipsis: true,
          align: 'center',
          title: '工资发放时间',
          key: 'salaryGiveTime',
          dataIndex: 'salaryGiveTime',
          customRender:(text) => {
            return this.salaryGiveTimeOption[text] || '-'
          }
        },
        {
          width: 150,
          ellipsis: true,
          align: 'center',
          title: '社保扣缴月份',
          key:'deduSocialMonth',
          dataIndex:'deduSocialMonth',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          align: 'center',
          title: '公积金扣缴月份',
          key:'deduProvidentMonth',
          dataIndex:'deduProvidentMonth',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          align: 'center',
          title: '是否薪资扣税',
          key:'salaryTaxFlag',
          dataIndex:'salaryTaxFlag',
          customRender:(text) => {
            return this.isFlag[text] || '-'
          }
        },
        {
          width: 120,
          ellipsis: true,
          align: 'center',
          title: '社保优先级',
          key:'socialPriority',
          dataIndex:'socialPriority',
          customRender:(text) => {
            return this.socialPriorityOption[text] || '-'
          }
        },
        {
          width: 120,
          ellipsis: true,
          align: 'center',
          title: '公积金优先级',
          key:'fundPriority',
          dataIndex:'fundPriority',
          customRender:(text) => {
            return this.fundPriorityOption[text] || '-'
          }
        },
        {
          width: 120,
          ellipsis: true,
          align: 'center',
          title: '年终奖扣税方案',
          key:'annualBonusType',
          dataIndex:'annualBonusType',
          customRender:(text) => {
            return this.annualBonusTypeOption[text] || '-'
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '是否扣除社保',
          align: 'center',
          key:'isDeductSocial',
          dataIndex:'isDeductSocial',
          customRender:(text) => {
            return this.isFlag[text] || '-'
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '是否扣除公积金',
          align: 'center',
          key:'isDeductFund',
          dataIndex:'isDeductFund',
          customRender:(text) => {
            return this.isFlag[text] ||'-'
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '工资月份',
          align: 'center',
          key: 'salaryDate',
          dataIndex: 'salaryDate',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          title: '结算月份',
          align: 'center',
          key: 'settlementMonth',
          dataIndex: 'settlementMonth',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          key: 'settleDepartName',
          dataIndex: 'settleDepartName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '本月是否重复金额',
          align: 'center',
          key:'isRepeat',
          dataIndex:'isRepeat',
          customRender:(text) => {
            return this.isFlag[text] ||'-'
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '是否自有员工',
          align: 'center',
          key:'ownFlag',
          dataIndex:'ownFlag',
          customRender:(text) => {
            return this.isFlag[text] ||'-'
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '操作',
          align: 'center',
          key: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      matchDetailColumns: [
          {
            width: 180,
            ellipsis: true,
            align: 'center',
            title: '认领时间',
            dataIndex: 'reciveDate',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            align: 'center',
            title: '认领金额',
            dataIndex: 'reciveFee',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '可匹配金额',
            align: 'center',
            dataIndex: 'reciveFeeBalance',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 130,
            ellipsis: true,
            align: 'center',
            title: '款项用途',
            dataIndex: 'reciveUse',
            customRender: text => {
              const resultText = this.reciveUseOptions[text] || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '款项类型',
            align: 'center',
            dataIndex: 'reciveType',
            customRender: (text,record) => {
              const resultText = String(record.reciveUse) === '0' ? this.reciveTypeOptions[text] : '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 220,
            ellipsis: true,
            align: 'center',
            title: '结算主体',
            dataIndex: 'settleDomainId',
            customRender: text => {
              const options = this.settleDomainBelongs || []
              const resultText = options.hasOwnProperty(text)?options[text]['departName']:'-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '认领人',
            align: 'center',
            dataIndex: 'reciveUser',
            customRender: text => {
              const resultText = this.employData.hasOwnProperty(text) ? this.employData[text] : '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            align: 'center',
            title: '认领状态',
            dataIndex: 'status',
            customRender: text => {
              const optionItem = this.statusOptions[String(text)] || '-'
              return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
            }
          },
          {
            width: 140,
            ellipsis: true,
            align: 'center',
            title: '出账状态',
            dataIndex: 'statusOut',
            customRender: text => {
              const optionItem = this.statusOutOptions[String(text)] || '-'
              return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
            }
          },
          {
            width: 150,
            ellipsis: true,
            align: 'center',
            title: '收入状态',
            dataIndex: 'statusIncome',
            customRender: text => {
              const optionItem = this.statusIncomeOptions[String(text)] || '-'
              return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
            }
          },
      ],
      url:{
        list:'/salary/tsalarystandard/applySalaryStandardPage',
        doSubmitUrl:'/salary/tsalarystandard/doSubmit',
        openBill:'/salary/salary/openBill',
        doExportUrl:'/salary/salary/doExportSalary',
        settelOne: '/salary//tsettlementhform/',
        getSalaryFrom:'busiInsurance/forecastbuypayform/salaryFrom/',
        mathDetailUrl:'/salary/treciverecord/getReciveRecordsByRecordId', // 匹配明细列表
        projectUrl:'/salary/tprojectreimbursedetail/getBySettleId',//项目成本表明细
      },
    }
  },
  props:{
    formTypeOptions:{
      type:Array,
      required:true
    }
  },
  // computed:{
  //   hang(){
  //     const closable = this.columns
  //     if(this.moneyType){
  //       closable.splice(0,1)
  //     }
  //     return closable
  //   }
  // },
  methods: {
    ...mapGetters(["nickname", "avatar","userInfo"]),
    async show(record,detailInfo){
      // this.initDictConfig()
      this.loadSettleInfo()
      this.loadMatchDetailInfo(record.id)
      this.salaryStandardInfo = record
      
      // 业务类型
      this.salaryStandardInfo.businessType =await getBusinessType(record.departId)
      this.detailData = detailInfo
      this.coverList = detailInfo.coverList || [] // 封面数据
      this.settlementhFormInfo = detailInfo.settlementhForm || {} // 结算单
      this.pauseDiyInfoList = detailInfo.settlementhFormSubList || []
      this.poorBalanceInfoList = detailInfo.poorBalanceInfoList || []
      this.dataSourceList = detailInfo.salaryAccountList
      this.incomeBelongList = detailInfo.salaryIncomeBelongList || []
      this.salaryAccountOne = detailInfo.salaryAccountList.length > 0 ? detailInfo.salaryAccountList[0] : {}
      this.auditLogList = detailInfo.auditLogList || []
      this.slaryFlag = true
      
      // 获取成本报销明细
      let prores  = await httpAction(`${this.url.projectUrl}?settleId=${detailInfo.settlementhForm.id}`,{},'GET')
      if(prores.code==200){
        prores.data.map(item=>{
          item.installmentMonth = item.feeDesc=='项目成本'?item.settleMonth:item.installmentMonth
        })
        prores.data.sort((a,b)=>{return Number(a.installmentMonth) - Number(b.installmentMonth)})
        this.projectList = prores.data
        
      }else{
        this.$message.warn(prores.msg)
      }
      this.fileList = []
      // 获取薪资原表附件
      const fileRes = await httpAction(`/salary/tsalaryatta/getTSalaryAttaListByIdType?linkId=${this.salaryStandardInfo.id}&linkType=11`,null,'get')
      if(fileRes.code==200){
        fileRes.data.map(item=>{
          this.fileList.push({
              uid: item.id,
              name: item.attaName,
              status: 'done',
              url: item.attaUrl,
              id:item.linkId
          })
        })
        // this.basicForm.setFieldsValue(pick(this.model,'departId','name'))
      }else{
        this.fileList = []
        this.$message.warn(fileRes.msg||'获取薪资原表附件失败')
      }
      this.visible = true
      this.changeTab(this.activityKey)
    },
    splitIncome(list){
      this.incomeBelongList = list;
    },
    // 附件操作
    handleImport(file){
      this.fileList = [...this.fileList, file]
    },
    handleRemove(file){
      // 清除filelist中的文件
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    // 取消
    handleCancel() {
      this.$emit('close')
      this.$refs.settleAccountModal.settleDeail = {}
      this.$refs.salaryPageModal.panes = []
      this.settleExclamation = false
      this.coverExclamation = false
      this.exclamation = false
      this.loading = false
      this.visible = false
    },
    
    // 结算主体和所属单位
    loadSettleInfo(){
      getSettleDomainSelectVos().then((res) => {
        if (Number(res.code) === 200) {
          this.settleDomainBelongs = res.data || []
        } else {
          this.$message.error('结算主体和所属单位数据请求失败！')
        }
      })
    },
    // 获取匹配明细
    loadMatchDetailInfo(recordId){
      const detailUrl = `${this.url.mathDetailUrl}?matchId=${recordId}&type=0`
      httpAction(detailUrl,{},'GET').then((res) => {
        if(Number(res.code) === 200){
          this.matchDetailData = res.data || []
        }else {
          this.$message.warn(res.msg || '匹配明细获取失败')
        }
      })
    },
    //累计差余额 
    handlecurOk(data){
      this.settlementhFormInfo.curPoorBalance = data
    },
    handleSave(){
      
      if(this.activityKey !== '4'){
        this.$message.warn('请在流程进展明细中提交')
      }else{
        // 结算表的累计差余额判断
        if(this.settlementhFormInfo.curPoorBalance!=0 && this.poorBalanceInfoList.length==0){
          this.$message.warn('您本期账单有差余额，请填写结算单中的差余额明细后再提交！')
          return 
        }
        let allNum = 0;
        this.poorBalanceInfoList.map(item=>{
          allNum = formatFloat(parseFloat(allNum) + parseFloat(item.money))
        })
        if(allNum != formatFloat(this.settlementhFormInfo.curPoorBalance)){
          this.$message.warn('差余额明细总额与“累计差余额”金额不一致，请在“结算表”中核实后再提交！')
          return
        }
        
        let itemArr = []
        this.pauseDiyInfoList.map(item=>{
          if((item.itemType == '5101'||item.itemType == '5100')&&(isNaN(item.isPause)||item.isPause==0)){
            itemArr.push(item.subName)
          }
        })
        if(itemArr.length>0){
          const msg = itemArr.join(',')
          this.$message.warn(`结算单:${msg}还未选择发放方式，请进行选择！`)
          return false
        }
        this.$refs.RadioModalForm.showModal(this.salaryStandardInfo,this.detailData.attaList)
      }
    },
    handleClose(param){
      this.slaryFlag = param
    },
    // 保存并退出
    handleOk(param) {
      this.settleExclamation = false
      this.coverExclamation = false
      this.exclamation = false
      var that = this
      this.model.isBacked = param.isBacked
      this.model.ownRemark = param.ownRemark
      this.model.ownNums = param.ownNums
      this.model.ownMoney = param.ownMoney
      this.model.salaryAttaIds = param.salaryAttaIds
      console.log(this.model);
      // return false
      if(Number(this.activityKey) === 4){
        // 流程进展明细
        this.exclamation = false
        console.log(this.fileList);
        console.log(this.$refs.salaryFormModal.form);
        this.$refs.salaryFormModal.form.setFieldsValue(pick({upload: this.fileList},'upload'))
        this.$refs.salaryFormModal.form.validateFields((err,values) => {
          if(!err){
            this.loading = true
            this.model.moneyFrom  = values['setMoneyFrom ']
            this.model.submitRemark = values['submitRemark']
            this.model.excelRemark = this.$refs.salaryFormModal.setExcelRemark
            this.model.id = this.salaryStandardInfo.id
            httpAction(this.url.doSubmitUrl,this.model,'POST').then((res) => {
              this.loading = false
              if(Number(res.code) === 200){
                this.$message.success("提交成功")
                this.visible = false
                this.visibleCheck = false
                that.$refs.salaryFormModal.form.resetFields()
                this.$refs.settleAccountModal.settleDeail = {}
                that.$emit('ok')
              }else{
                this.$message.error(res.msg)
              }
            })
          }else{
            this.loading = false
          }
        })
      }else{
        this.model.moneyFrom  = 0
        this.model.id = this.salaryStandardInfo.id
        httpAction(this.url.doSubmitUrl,this.model,'POST').then((res) => {
          this.loading = false
          if(Number(res.code) === 200){
            this.$message.success("提交成功")
            this.visible = false
            this.visibleCheck = false
            this.$refs.settleAccountModal.settleDeail = {}
            that.$emit('ok')
          }else{
            this.$message.error(res.msg)
          }
        })
      }
    },
    handleCancelCheck(){
      this.form.resetFields()
      this.visibleCheck = false
    },
    handleChange (value) {
      console.log(`selected ${value}`);
    },
    handleCheckOk() {
      var that = this
      this.loading = true
      this.form.validateFields((err, values) => {
        if(!err) {
          this.model.auditUser = values['AuditUser']
          this.model.id = this.salaryStandardInfo.id
          httpAction(this.url.doSubmitUrl,this.model,'POST').then((res) => {
            this.loading = false
            if(Number(res.code) === 200){
              this.$message.success("提交成功")
              this.visible = false
              this.visibleCheck = false
              this.$refs.salaryProgressModal.form.resetFields()
              that.$emit('ok')
            }else{
              this.$message.error(res.msg)
            }
          })
        }else{
          this.loading = false
        }
      })
    },
  
    // 切换Tab
    changeTab(key){
      this.activityKey = key
      if(Number(key) === 2){
        // 结算表
        this.$nextTick(() => {
          this.$refs.settleAccountModal.show()
        })
      }
      if(Number(key) === 3){
        // 封面
        this.$nextTick(() => {
          this.$refs.salaryPageModal.employData = this.employData
          this.$refs.salaryPageModal.show()
        })
        
      }
      if(Number(key) === 4){
        // 流程进展明细
        httpAction(this.url.settelOne + this.settlementhFormInfo.id, {}, "GET").then((res) => {
          this.settlementAmount = res.data.accountMoneySum + ''
        })
        this.$nextTick(() => {
          this.$refs.salaryProgressModal.show()
        })
        
      }
    },
    // 展示单个工资明细详情明细
    detail(id){
      let salaryList = []
      for(const item of this.dataSourceList){
        if(String(item.id) === String(id)){
          salaryList = item.saiList
          break
        }
      }
      this.$refs.statementDetailModal.title = '报表详情'
      this.$refs.statementDetailModal.saiList = salaryList
      this.$refs.statementDetailModal.show()
    },
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then((res) => {
        if (Number(res.code) === 200) {
          this.bankOptions = res.data
        }
      })
      // 获取人员数据
      httpAction('/admin/user/userDic','','GET').then((res) => {
          if(Number(res.code) === 200){
            this.employData = res.data
          }
        })
    },
    // 导出
    handleDownload() {
      const url = `${this.url.doExportUrl}?salaryFormId=${this.salaryStandardInfo.id}`
      this.downloading = true
      httpAction(url,{},'POST',120000).then((res) => {
        if(Number(res.code) === 200){
          var auditName = ''
          var createName = ""
          var revenueName = ''
          if(res.data.salary.createUser){
            for(const c in this.employData){
              if(String(c) === String(res.data.salary.auditUser)){
                auditName = this.employData[c]
              }
              if(String(c) === String(res.data.salary.createUser)){
                createName = this.employData[c]
              }
              if(String(c) === String(res.data.salary.revenueUser)){
                revenueName = this.employData[c]
              }
            }
          }
          let settleForm = res.data.settlementhForm
          // 结算单数据
          let settelData = [
            {'index':settleForm.settleMonth + '结算单','data':'','project':'','project1':'','money':'','money1':'','tax':'','account':'','account1':''},
            {'index':'结算名称:','data':settleForm.settleDepartName,'project':'','project1':'','money':'','money1':'','tax':'皖信盖章:','account':'','account1':''},
            {'index':'结算编码:','data':settleForm.settleDepartNo,'project':'','project1':'','money':'','money1':'','tax':'结算时间:','account':settleForm.settleMonth,'account1':''},
            {'index':'业务类型:','data':this.salaryStandardInfo.businessType,'project':'','project1':'','money':'','money1':'','tax':'','account':'','account1':''},
            {'index':'序号','data':'费用项目','project':'','project1':'','money':'金额','money1':'','tax':'税费','account':'开票额小计','account1':''},
            {'index':1,'data':res.data.salary.salaryMonth,'project':'应发工资','project1':'','money':settleForm.salarySum,'money1':'','tax':settleForm.salaryTax,'account':settleForm.salaryTicket,'account1':''},
            {'index':'','data':'','project':'实发工资(银付)','project1':'','money':settleForm.cardPay,'money1':'','tax':'','account':'','account1':''},
            {'index':'','data':'','project':'实发工资(现金)','project1':'','money':settleForm.moneyPay,'money1':'','tax':'','account':'','account1':''},
            {'index':'','data':'','project':'暂停发金额','project1':'','money':settleForm.pausePay,'money1':'','tax':'','account':'','account1':''},
            {'index':2,'data':res.data.salaryAccountList[0].deduSocialMonth,'project':'应缴单位社保','project1':'','money':settleForm.unitSocial,'money1':'','tax':settleForm.unitSocialTax,'account':settleForm.unitSocialTicket,'account1':''},
            {'index':'','data':'','project':'应缴个人社保','project1':'','money':settleForm.personalSocial,'money1':'','tax':'','account':'','account1':''},
            {'index':'','data':'','project':'没工资员工单位社保','project1':'','money':settleForm.noSalaryUnitSocial,'money1':'','tax':settleForm.noSalaryUnitSocialTax,'account':settleForm.noSalaryUnitSocialTicket,'account1':''},
            {'index':'','data':'','project':'没工资员工个人社保','project1':'','money':settleForm.noSalaryPersonSocial,'money1':'','tax':settleForm.noSalaryPersonSocialTax,'account':settleForm.noSalaryPersonSocialTicket,'account1':''},
            {'index':3,'data':res.data.salaryAccountList[0].deduProvidentMonth,'project':'应缴单位公积金','project1':'','money':settleForm.unitFund,'money1':'','tax':settleForm.unitFundTax,'account':settleForm.unitFundTicket,'account1':''},
            {'index':'','data':'','project':'应缴个人公积金','project1':'','money':settleForm.personalFund,'money1':'','tax':'','account':'','account1':''},
            {'index':'','data':'','project':'没工资员工单位公积金','project1':'','money':settleForm.noSalaryUnitFund,'money1':'','tax':settleForm.noSalaryUnitFundTax,'account':settleForm.noSalaryUnitFundTicket,'account1':''},
            {'index':'','data':'','project':'没工资员工个人公积金','project1':'','money':settleForm.noSalaryPersonalFund,'money1':'','tax':settleForm.noSalaryPersonalFundTax,'account':settleForm.noSalaryPersonalFundTicket,'account1':''},
            {'index':4,'data':'代扣当月个人税','project':'','project1':'','money':settleForm.personalCurmonthTax,'money1':'','tax':'','account':'','account1':''},
          ];
          let num = 5
          let isPersonYear = 0
          let projectData =[] //项目报销成本
          let withholdData = [] //自定义
          let peoWithholddata = [] //个人代扣
          let unitWithholddata = []  //单位代扣
          res.data.settlementhFormSubList.reduce((acc,cur)=>{
            if(cur.itemTypeName=="项目报销"){
              projectData.push(cur)
            }else if(cur.itemType==5100){
              // 个人代扣
              peoWithholddata.push(cur)
            }else if(cur.itemType==5101){
              // 单位代扣
              unitWithholddata.push(cur)
            }else{
              withholdData.push(cur)
            }
          },[])
          let settlementhFormSubListLength = withholdData.length  // 自定义长度
          
          if(settleForm.personalYearTax > 0){
            settelData.push({'index':num,'data':'代扣个人年终奖税','project':'','project1':'','money':settleForm.personalYearTax,'money1':'','tax':'','account':'','account1':''})
            num++
            isPersonYear = 1
          }
          if(settleForm.withholidingPersonSocial != 0){
            settelData.push({'index':num,'data':'代扣个人社保','project':'','project1':'','money':settleForm.withholidingPersonSocial,'money1':'','tax':'','account':'','account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.withholidingPersonFund != 0){
            settelData.push({'index':num,'data':'代扣个人公积金','project':'','project1':'','money':settleForm.withholidingPersonFund,'money1':'','tax':'','account':'','account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.withholidingUnitSocial != 0){
            settelData.push({'index':num,'data':'代扣单位社保','project':'','project1':'','money':settleForm.withholidingUnitSocial,'money1':'','tax':settleForm.withholidingUnitSocialTax,'account':settleForm.withholidingUnitSocialTicket,'account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.withholidingUnitFund != 0){
            settelData.push({'index':num,'data':'代扣单位公积金','project':'','project1':'','money':settleForm.withholidingUnitFund,'money1':'','tax':settleForm.withholidingUnitFundTax,'account':settleForm.withholidingUnitFundTicket,'account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.takingRisks != 0){
            settelData.push({'index':num,'data':'商险金额','project':'','project1':'','money':settleForm.takingRisks,'money1':'','tax':settleForm.takingRisksTax,'account':settleForm.takingRisksTicket,'account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.takingBalance != 0){
            settelData.push({'index':num,'data':'商险差额','project':'','project1':'','money':settleForm.takingBalance,'money1':'','tax':settleForm.takingBalanceTax,'account':settleForm.takingBalanceTicket,'account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.riskFundDy != 0){
            settelData.push({'index':num,'data':'风险抵押金','project':'','project1':'','money':settleForm.riskFundDy,'money1':'','tax':'','account':'','account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          // 代扣个人费用
          if(settleForm.deductPersonal){
            settelData.push({'index':num,'data':'代扣个人费用','project':'','project1':'','money':settleForm.deductPersonal,'money1':'','tax':'','account':'','account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          // 代扣单位费用
          if(settleForm.deductUnit){
            settelData.push({'index':num,'data':'代扣单位费用','project':'','project1':'','money':settleForm.deductUnit,'money1':'','tax':settleForm.deductUnitTax,'account':settleForm.deductUnitTicket,'account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }

          if(settleForm.otherDbMoney){
            settelData.push({'index':num,'data':'其他代办费2','project':'','project1':'','money':settleForm.otherDbMoney,'money1':'','tax':'','account':'','account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.unitSupplement){
            settelData.push({'index':num,'data':'单位待补足','project':'','project1':'','money':settleForm.unitSupplement,'money1':'','tax':settleForm.unitSupplementTax,'account':settleForm.unitSupplementTicket,'account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.persoanSupplement){
            settelData.push({'index':num,'data':'个人待补足','project':'','project1':'','money':settleForm.persoanSupplement,'money1':'','tax':'','account':'','account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.personalDebt){
            settelData.push({'index':num,'data':'个人社保、公积金欠款','project':'','project1':'','money':settleForm.personalDebt,'money1':'','tax':'','account':'','account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.personalOtherMoney){
            settelData.push({'index':num,'data':'个人其他费用','project':'','project1':'','money':settleForm.personalOtherMoney,'money1':'','tax':'','account':'','account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.prevPersoanSupplement){
            settelData.push({'index':num,'data':'前次个人待补足','project':'','project1':'','money':settleForm.prevPersoanSupplement,'money1':'','tax':'','account':'','account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.unitBack){
            settelData.push({'index':num,'data':'单位返还','project':'','project1':'','money':settleForm.unitBack,'money1':'','tax':settleForm.unitBackTax,'account':settleForm.unitBackTicket,'account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.unitSocialCard){
            settelData.push({'index':num,'data':'单位社保卡费','project':'','project1':'','money':settleForm.unitSocialCard,'money1':'','tax':'','account':'','account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.exemptionPersionTax){
            settelData.push({'index':num,'data':'免个税个人代扣','project':'','project1':'','money':settleForm.exemptionPersionTax,'money1':'','tax':'','account':'','account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.enterpriseAnnuity){
            settelData.push({'index':num,'data':'企业（职业）年金','project':'','project1':'','money':settleForm.enterpriseAnnuity,'money1':'','tax':'','account':'','account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          if(settleForm.onlyChild){
            settelData.push({'index':num,'data':'独生子女费','project':'','project1':'','money':settleForm.onlyChild,'money1':'','tax':'','account':'','account1':''})
            num++
            settlementhFormSubListLength = settlementhFormSubListLength + 1
          }
          // 自定义项
          for(let c of withholdData){
            settelData.push({'index':num,'data':getItemName(c.itemTypeName,c.subName,c.isPause),'project':'','project1':'','money':c.money,'money1':'','tax':c.tax,'account':c.ticket,'account1':''})
            num++
          }
          // 项目成本报销
          for( let c of projectData){
            settelData.push({'index':num,'data':c.subName,'project':'项目报销','project1':'','money':c.money,'money1':'','tax':c.tax,'account':c.ticket,'account1':''})
            num++
          }
          // 个人代扣
          for(let p of peoWithholddata){
            settelData.push({'index':num,'data':getItemName(null,p.subName,p.isPause),'project':'','project1':'','money':p.money,'money1':'','tax':'','account':'','account1':''})
            num++
          }
          // 单位代扣
          for(let p of unitWithholddata){
            settelData.push({'index':num,'data':getItemName(null,p.subName,p.isPause),'project':'','project1':'','money':p.money,'money1':'','tax':p.tax,'account':p.ticket,'account1':''})
            num++
          }
          

          settleForm.remark = settleForm.remark ? settleForm.remark : ''
          settelData.push({'index':num++,'data':'风险金','project':'','project1':'','money':settleForm.riskFund,'money1':'','tax':settleForm.riskFundTax,'account':settleForm.riskFundTicket,'account1':''})
          settelData.push({'index':num++,'data':'人数','project':'','project1':'','money':settleForm.personNum,'money1':'','tax':'','account':'','account1':''})
          settelData.push({'index':num++,'data':'人次','project':'','project1':'','money':settleForm.personTime,'money1':'','tax':'','account':'','account1':''})
          settelData.push({'index':num++,'data':'管理费','project':'','project1':'','money':settleForm.managementMoney,'money1':'','tax':settleForm.managementMoneyTax,'account':settleForm.managementMoneyTicket,'account1':''})
          settelData.push({'index':num++,'data':'管理费2','project':'','project1':'','money':settleForm.managementMoneyTwo,'money1':'','tax':settleForm.managementMoneyTwoTax,'account':settleForm.managementMoneyTwoTicket,'account1':''})
          settelData.push({'index':num++,'data':'收入合计','project':'','project1':'','money':settleForm.incomeSum,'money1':'','tax':settleForm.incomeSumTax,'account':settleForm.incomeSumTicket,'account1':''})
          settelData.push({'index':num++,'data':'结算金额合计','project':'','project1':'','money':'','money1':'','tax':settleForm.countTax,'account':settleForm.accountMoneySum,'account1':''})
          settelData.push({'index':num++,'data':'开票金额合计','project':'','project1':'','money':'','money1':'','tax':'','account':settleForm.ticketMoneySum,'account1':''})
          settelData.push({'index':num++,'data':'上次差余额','project':'','project1':'','money':'','money1':'','tax':'','account':settleForm.prevPoorBalance,'account1':''})
          settelData.push({'index':num++,'data':'累计差余额','project':'','project1':'','money':'','money1':'','tax':'','account':settleForm.curPoorBalance,'account1':''})
          settelData.push({'index':num++,'data':'备注:' + settleForm.remark,'project':'','project1':'','money':'','money1':'','tax':'','account':'','account1':''})
          settelData.push({'index':num++,'data':'发票类型','project':'扣除金额','project1':'','money':'不含税金额','money1':'','tax':'税额','account':'发票合计金额','account1':''})
          settelData.push({'index':num++,'data':settleForm.ticketType,'project':settleForm.deductionAmount,'project1':'','money':settleForm.noTaxAmount,'money1':'','tax':settleForm.taxAmount,'account':settleForm.ticketSumAmount,'account1':''})
          // settelData.push({'index':num++,'data':'','project':'','money':'1814','tax':'123.6','account':'1928.2'})
          settelData.push({'index':'审核人:','data':auditName,'project':'','project1':'','money':'','money1':'','tax':'制表人:','account':createName,'account1':''})
          settelData.push({'index':'','data':'','project':'','project1':'','money':'','money1':'','tax':'','account':'','account1':''})

          settelData.push({'index':'差余额','data':'','project':'','project1':'','money':'','money1':'','tax':'','account':'','account1':''})
          settelData.push({'index':'月份','data':'姓名','project':'','project1':'项目','money':'','money1':'金额','tax':'','account':'原因','account1':''})
          
          // 差余额明细
          for(let c of res.data.poorBalanceInfoList){
            settelData.push({'index':c.month,'data':c.name,'project':'','project1':c.project,'money':'','money1':c.money,'tax':'','account':c.cause,'account1':''})
          }
          settelData.push({'index':'','data':'','project':'','project1':'','money':'','money1':'','tax':'','account':'','account1':''})
          settelData.push({'index':'成本报销明细','data':'','project':'','project1':'','money':'','money1':'','tax':'','account':'','account1':''})
          settelData.push({'index':'预计结算月份','data':'结算月份','project':'报销单编号','project1':'报销时间','money':'报销人','money1':'费用类型','tax':'金额','account':'税额','account1':'结算额'})
          
           // 项目成本报销明细
          for( let c of this.projectList){
            settelData.push({'index':c.installmentMonth,'data':c.settleMonth,'project':c.reimburseFormCode,'project1':c.applyDate,'money':c.applyUserName,'money1':c.feeDesc,'tax':c.settleFee,'account':c.tax,'account1':c.ticket})
            num++
          }
          // 自定义数据的长度、 差余额的长度、代扣个税的长度、项目报销的长度、项目成本明细的长度、个人代扣、单位代扣
          settelData.push({'index':settlementhFormSubListLength,'data':res.data.poorBalanceInfoList.length,'project':isPersonYear,'project1':projectData.length,'money':this.projectList.length,'money1':peoWithholddata.length,'tax':unitWithholddata.length,'account':'','account1':''});

          let salaryAccountList = res.data.salaryAccountList
          let accountTitle = res.data.accountTitle
          let salaryAccountListHeader = ["发放状态","结算主体","结算月份","工资月份","姓名","银行卡号","身份证号","手机号码","开户行","工资发放方式","社保扣缴月份",
              "公积金扣缴月份","是否薪资扣税","社保优先级","公积金优先级","年终奖扣税方案","是否扣除社保","是否扣除公积金","本月是否重复金额","是否自有员工"]
          let salaryAccountListValue = ["distributionFlag","settleDepartName","settlementMonth","salaryDate","empName","bankNo","empIdcard","empPhone","bankName","salaryStyle",
          "deduSocialMonth","deduProvidentMonth","salaryTaxFlag","socialPriority","fundPriority","annualBonusType",
              "isDeductSocial","isDeductFund","isRepeat","ownFlag"]
          // 工资明细详情字段组装
          if(accountTitle){
            for(const c in accountTitle){
              salaryAccountListHeader.push(c)
              salaryAccountListValue.push(c)
            }
          }
          // 工资条的数据转换
          for(let d in salaryAccountList){
            // 发放状态
            salaryAccountList[d].distributionFlag = this.distributionFlagOption[salaryAccountList[d].distributionFlag]
            // 发放方式
            salaryAccountList[d].salaryStyle = this.salaryStyleOption[salaryAccountList[d].salaryStyle]
            salaryAccountList[d].salaryGiveTime = this.salaryGiveTimeOption[salaryAccountList[d].salaryGiveTime]
            salaryAccountList[d].salaryTaxFlag = this.isFlag[salaryAccountList[d].salaryTaxFlag]
            // 社保优先级
            salaryAccountList[d].socialPriority = this.socialPriorityOption[salaryAccountList[d].socialPriority]
            // 公积金优先级
            salaryAccountList[d].fundPriority = this.fundPriorityOption[salaryAccountList[d].fundPriority]
            // 年终奖扣税方案
            salaryAccountList[d].annualBonusType = this.annualBonusTypeOption[salaryAccountList[d].annualBonusType]
            // 是否社保扣除
            salaryAccountList[d].isDeductSocial = this.isFlag[salaryAccountList[d].isDeductSocial]
            // 是否公积金扣除
            salaryAccountList[d].isDeductFund = this.isFlag[salaryAccountList[d].isDeductFund]
            // 本月是否重复金额
            salaryAccountList[d].isRepeat = this.isFlag[salaryAccountList[d].isRepeat]
            // 是否自有员工
            salaryAccountList[d].ownFlag = this.isFlag[salaryAccountList[d].ownFlag]
            // 银行名称转换
            let bankName = filterDictText(this.bankOptions,salaryAccountList[d].bankName)
            if(bankName == '-' && this.bankOptions,salaryAccountList[d].bankName){
              1 == 1
            }else{
              salaryAccountList[d].bankName = bankName
            }
            // 判断否有动态数据
            if(accountTitle){
              for(let c in accountTitle){
                salaryAccountList[d][c] = ''
                let saiList = salaryAccountList[d].saiList
                // 组装动态数据
                for(let m in saiList){
                  if(saiList[m].cnName == c){
                    i = 1
                    const item = saiList[m]
                    const name = (item.salaryMoney === '' || item.salaryMoney === null)?item.textValue:item.salaryMoney
                    salaryAccountList[d][c] = name
                  }
                }
                // 为空的给置为0
                if(i == 0){
                  salaryAccountList[d][c] = 0
                }
              }
            }
          }

          let salaryBankVoList = res.data.salaryBankVoList
          for(let m in salaryBankVoList){
            let bankName = filterDictText(this.bankOptions,salaryBankVoList[m].bankName)
            if(bankName == '-' && this.bankOptions,salaryBankVoList[m].bankName){
              1 == 1
            }else{
              salaryBankVoList[m].bankName = bankName
            }
          }
          //社保明细
          for(let y in res.data.forecastList){
            res.data.forecastList[y].personalProvidentSum = res.data.forecastList[y].personalProvidentSum ? res.data.forecastList[y].personalProvidentSum : ''
            res.data.forecastList[y].providentCreateMonth = res.data.forecastList[y].providentCreateMonth ? res.data.forecastList[y].providentCreateMonth : ''
            res.data.forecastList[y].unitProvidentSum = res.data.forecastList[y].unitProvidentSum ? res.data.forecastList[y].unitProvidentSum : ''
            res.data.forecastList[y].providentPayMonth = res.data.forecastList[y].providentPayMonth ? res.data.forecastList[y].providentPayMonth : ''
          }
          // 封面数据
          var excelDatas = [
            {
              tHeader: salaryAccountListHeader, // 表一的数据字段
              filterVal: salaryAccountListValue, // sheet表一头部
              tableDatas: salaryAccountList, // 表一的整体json数据
              sheetName: "工资明细"// 表一的sheet名字
            },
            {
              tHeader: ["序号",null,"费用项目",null, "金额",null, "增值税", "开票额小计",null],
              filterVal: ['index','data','project','project1', 'money','money1', 'tax', 'account','account1'],
              tableDatas: settelData,
              sheetName: "结算单"
            },
            {
              tHeader: ["姓名","身份证号", "银行账号", "实发工资合计", "银行","支行"],
              filterVal: ['name','idNumber',"bankNo", "money", "bankName","subBranch"],
              tableDatas: salaryBankVoList,
              sheetName: "银行"
            },
            {
              tHeader: ["姓名","身份证号", "实发工资合计","用途"],
              filterVal: ['name','idNumber', "money", "useRemark"],
              tableDatas: res.data.salaryCashVoList,
              sheetName: "现金"
            },
            {
              tHeader: ["员工姓名", "身份证号","个人大病费用","个人失业","个人公积金合计","个人医疗费用","个人养老费用","个人社保合计"
              ,"公积金生成月份","公积金缴纳月份","社保生成月份","社保缴纳月份","单位生育费用","单位大病救助","单位公积金合计",
              "单位医疗费用","单位养老费用","单位社保合计","单位失业费用","单位工伤费用"],
              filterVal: ["empName","empIdcard","personalBigmailmentMoney","personalUnemploymentMoney","personalProvidentSum","personalMedicalMoney","personalPensionMoney","socialSecurityPersonalSum"
              ,"providentCreateMonth","providentPayMonth","socialCreateMonth","socialPayMonth","unitBirthMoney","unitBigmailmentMoney","unitProvidentSum",
              "unitMedicalMoney","unitPensionMoney","unitSocialSum","unitUnemploymentMoney","unitInjuryMoney"],
              tableDatas: res.data.forecastList,
              sheetName: "社保明细"
            },
            {
              tHeader: ["员工姓名", "员工身份证号","结算部门","保险公司","险种","保单开始时间","保单结束时间","实际保费","预估金额",
              "保单号","医保","身故或残疾","商险购买地","购买标准","结算月份","备注"],
              filterVal: ['empName','empIdcardNo', "settlementDepart", "insuranceCompanyName","insuranceTypeName","policyStart","policyEnd","buyPay","forecastBuyPay",
              "policyNo","medicalMoney","deathDisabilityMoney","businessInsuranceAddr","buyStandard","settleMonth","remark"],
              tableDatas: res.data.businessInsuranceList ? res.data.businessInsuranceList : [],
              sheetName: "商险明细"
            },
          ]
          let i = 1
          for(var d of res.data.coverList){
            let receiptUnitName = d.receiptUnitName ? d.receiptUnitName : ''
            let bankNo = d.bankNo ? d.bankNo : ''
            let bankName = d.bankName ? d.bankName : ''
            let remark = d.remark ? d.remark : " "
            d.createDate = d.createDate ?  moment(d.createDate).format("YYYY/MM/DD") : ""
            let lastTwo = d.itemName.substr(d.itemName.length - 2,2)
            if(lastTwo == "其他"){
              d.itemName = d.itemName.substr(0,d.itemName.length - 2) + "工资"
            }
            if(d.payType == 1){
              let coverData = [
                {'company':d.invoiceTitle,'project':'','payType':'','money':'','no':`附件${res.data.coverList.length}张`},
                {'company':"银行转账审批单",'project':'','payType':'','money':'','no':''},
                {'company':"",'project':d.createDate,'payType':'部门编码','money':d.settleNo,'no':''},
                {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
                {'company':d.unitName,'project':d.itemName,'payType':'银行转账','money':'¥' + d.money,'no':''},
                {'company':d.settleName,'project':'','payType':'','money':'','no':''},
                {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
                {'company':"备注:",'project':remark,'payType':'','money':'','no':''},
                {'company':"收款单位名称:" + receiptUnitName + "          账号:" + bankNo + "          开户行:" + bankName,'project':'','payType':'','money':'','no':''},
                {'company':"公司领导:         财务负责人:" + revenueName + '        网银审核授权人:         网银转账提交人：' + this.nickname() + '        数据审核人：' + auditName + '        制表人:' + createName,'project':'' ,'payType': '','money':'','no':''},
              ]
              excelDatas.push({
                tHeader: ["序号", "名字", "描述", "金钱", "地位"],
                filterVal: ["company", "project", "payType", "money",'no'],
                tableDatas:coverData,
                sheetName:'转账封面' + i
              })
            }else{
              let coverData = [
                {'company':d.invoiceTitle,'project':'','payType':'','money':'','no':`附件${res.data.coverList.length}张`},
                {'company':"现金付款审批单",'project':'','payType':'','money':'','no':''},
                {'company':"",'project':d.createDate,'payType':'部门编码','money':d.settleNo,'no':''},
                {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
                {'company':d.unitName,'project':d.itemName,'payType':'现金转账','money':'¥' + d.money,'no':''},
                {'company':d.settleName,'project':'','payType':'','money':'','no':''},
                {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
                {'company':"备注:" + remark,'project':'','payType':'','money':'','no':''},
                {'company':"公司领导:          财务负责人：" + revenueName + '         出纳会计: ' + '          数据审核人：' + auditName + '         制表人: ' + createName,'project': '' ,'payType':'','money':'','no':''},
              ]
              excelDatas.push({
                tHeader: ["序号", "名字", "描述", "金钱", "地位"],
                filterVal: ["company", "project", "payType", "money",'no'],
                tableDatas:coverData,
                sheetName:'转账封面' + i
              })
            }
            i++
          }
          let insLength = 0
          if(settleForm.takingBalanceIds){
            httpAction(this.url.getSalaryFrom + settleForm.id,{},'get').then((result) => {
              if(Number(res.code) === 200){
                let insData = []
                insLength = 1
                for(let y of result.data){
                  for(let w of y.businessInsuranceList){
                    insData.push(w)
                  }
                }
                excelDatas.push({
                  tHeader: ["员工姓名", "员工身份证号","结算主体编码","结算主体","客户单位","保险公司","险种","保单开始时间","保单结束时间","实际保费","预估金额","差额",
                  "保单号","医保","身故或残疾","商险购买地","购买标准","结算月份","备注"],
                  filterVal: ['empName','empIdcardNo',"settlementOrganNo", "settlementOrganName","customerName", "insuranceCompanyName","insuranceTypeName","policyStart","policyEnd",
                  "buyPay","forecastBuyPay","balance","policyNo","medicalMoney","deathDisabilityMoney","area","buyStandard","settleMonth","remark"],
                  tableDatas: insData,
                  sheetName: "商险差额明细"
                })
              }
              let excelName = settleForm.settleMonth + settleForm.settleDepartName + "普通薪资" + '(' + filterDictText(this.formTypeOptions, res.data.salary.formType) + ')' + settleForm.settleDepartNo + '(' + settleForm.accountMoneySum + ')'
              this.json2excel(excelDatas, excelName, true, "xlsx",insLength)
            })
          }else{
            let excelName = settleForm.settleMonth + settleForm.settleDepartName + "普通薪资" + '(' + filterDictText(this.formTypeOptions, res.data.salary.formType) + ')' + settleForm.settleDepartNo + '(' + settleForm.accountMoneySum + ')'
            this.json2excel(excelDatas, excelName, true, "xlsx",insLength)
          }
          this.downloading = false
        }
      })

    },
    json2excel(tableJson, filenames, autowidth, bookTypes, insLength){
      // console.log(tableJson);
      var that = this
      //这个是引用插件
      import("@/vendor/Export2Excel").then(excel => {
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
          insLength:insLength
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
