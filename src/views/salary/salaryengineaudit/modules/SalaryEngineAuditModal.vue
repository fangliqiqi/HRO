<template>
  <a-modal
    title="工资报表"
    :width="1200"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="取消"
    okText="审核"
    :visible="visible"
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >取消</a-button>
      <template v-if="footSide">
        <a-button
          type="primary"
          @click="handleBackOk"
        >撤回</a-button>
      </template>
      <template v-else>
        <a-button
          type="primary"
          @click="handleOk"
        >审核</a-button>
        <a-button
          type="primary"
          @click="handleDownload"
        >导出</a-button>
      </template>
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
          tab="工资明细"
          key="1"
        >
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :scroll="{ x: 1 }"
            :columns="columns"
            :dataSource="dataSourceList"
            :loading="loading"
          >
            <template
              slot="operation"
              slot-scope="text, record"
            >
              <a @click="detail(record.id)">详情</a>
            </template>
          </a-table>
          <div v-if="salaryStandardInfo.ownNums">
            <p><span style="color:red;fontSize:18px">*</span>自有员工发放说明(工资表中存在自有员工)：</p>
            <div class="reason">
              <p>自有员工数：{{ salaryStandardInfo.ownNums }}</p>
              <p>应发金额合计：{{ salaryStandardInfo.ownMoney }}</p>
              <p>发放原因：{{ salaryStandardInfo.ownRemark }}</p>
              <p>附件(可预览)：
                <a-upload
                  :defaultFileList="fileList"
                  :fileList="fileList"
                  :showUploadList="{showRemoveIcon:false}"
                ></a-upload>
              </p>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          tab="结算表"
          key="2"
          forceRender
        >
          <!-- <salary-settle-account-modal ref="settleAccountModal"></salary-settle-account-modal> -->
          <engine-audit-settle-account-modal
            ref="settleAccountModal"
            :salaryStandardInfo="salaryStandardInfo"
            :settlementhFormInfo="settlementhFormInfo"
            :pauseDiyInfoList="pauseDiyInfoList"
            :poorBalanceInfoList="poorBalanceInfoList"
            :salaryAccountOne="salaryAccountOne"
          ></engine-audit-settle-account-modal>
        </a-tab-pane>
        <a-tab-pane
          tab="封面"
          key="3"
          forceRender
        >
          <!-- <salary-page-modal ref="salaryPageModal"></salary-page-modal> -->
          <engine-audit-page-modal
            ref="auditPageModal"
            :salaryStandardInfo="salaryStandardInfo"
            :coverList="coverList"
            :employData="employData"
          ></engine-audit-page-modal>
        </a-tab-pane>
        <a-tab-pane
          tab="流程进展明细"
          key="4"
          forceRender
        >
          <engine-audit-progress-modal
            ref="auditProgressModal"
            :salaryStandardInfo="salaryStandardInfo"
            :subject="subject"
            :attaList="attaList"
            :auditLogList="auditLogList"
          ></engine-audit-progress-modal>
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
      <a-form :form="backform" style="margin-top:15px;" v-if="footSide">
        <a-form-item label="退回理由">
          <a-textarea rows="4" placeholder="请输入退回理由" v-decorator="['remark',{ rules: [{ required: true, message: '请输入退回理由!' },{max:500,message:'退回理由最多500个字符！'}] }]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-card>
    <a-modal
      title="客户审核"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleCheckCancel"
      @ok="handleCheckOk"
      cancelText="关闭"
      okText="确定"
      :visible="visibleCheck"
      :confirmLoading="confirmLoading"
      :maskClosable="false"
    >
      <a-form :form="form">
        <a-form-item label="是否通过">
          <a-radio-group
            v-decorator="['status', validatorRules.status ]"
            @change="handleChange"
          >
            <a-radio :value="3">通过</a-radio>
            <a-radio :value="5">不通过</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="审核意见">
          <a-textarea v-decorator="['remark', validatorRules.remark]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 工资明细详情 -->
    <statement-detail-modal ref="statementDetailModal"></statement-detail-modal>
  </a-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction } from '@/api/manage'
import EngineAuditSettleAccountModal from './EngineAuditSettleAccountModal'
import EngineAuditPageModal from './EngineAuditPageModal'
import EngineAuditProgressModal from './EngineAuditProgressModal'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import moment from 'moment'
import { getItemName } from '@/utils/common'
import { getBusinessType } from '@/utils/businessType'
import StatementDetailModal from '../../searchsalary/modules/StatementDetailModal'

export default {
  name: 'SalaryEngineAuditModal',
  components: {
      EngineAuditSettleAccountModal,
      EngineAuditPageModal,
      EngineAuditProgressModal,
      StatementDetailModal
    },
  mixins: [JeecgListMixin],
  data() {
    return {
      visible:false,
      visibleCheck:false,
      downloading:false,
      form:this.$form.createForm(this),
      backform:this.$form.createForm(this),
      checkValue:'',
      loading:false,
      confirmLoading:false,
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      columns:[],
      salaryStandardInfo:'',
      validatorRules:{
        status: { rules: [{ required: true, message: '请审核!' }] },
        remark: { rules: [{ required: true, message: '请输入审核意见!' }] },
      },
      reciveTypeOptions: {'1': '薪资及其他', '2': '纯收入', '3': '事务性外包','4':'预估结算单'}, // 款项类型
      reciveUseOptions: {'0': '款项认领', '1': '垫付还款', '2': '商险预估还款'}, // 款项用途
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
      pauseTxt:{
        '1': '(暂停发)',
        '2': '(不发放)',
      },
      model:{},
      activityKey:'1',
      dataSourceList:[],
      detailData:{},
      coverList:[],
      settlementhFormInfo:{},
      pauseDiyInfoList:[],
      poorBalanceInfoList:[],
      salaryAccountOne:{},
      subject:null,
      attaList:null,
      scroll:{},
      employData:[],
      matchDetailData:[], // 匹配明细数据
      auditLogList:[],//流程进展明细
      fileList:[],
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
          dataIndex: 'departName',
          customRender: text => {
            const resultText = text || '-'
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
        list:'/salary/tsalarystandard/auditSalaryStandardPage',
        doAuditUrl:'/salary/tsalaryengineering/doAudit',
        openBill:'/salary/engineer/openBill',
        doExportUrl:'/salary/engineer/doExportSalary',
        getSalaryFrom:'busiInsurance/forecastbuypayform/salaryFrom/',
        mathDetailUrl:'/salary/treciverecord/getReciveRecordsByRecordId', // 匹配明细列表
        backUrl:'/salary/tsalaryengineering/goBack',
      },
      footSide: false,
    }
  },
  props:{
    formTypeOptions:{
      type:Array,
      required:true
    }
  },
  methods: {
    async show(record) {
      this.initDictConfig()
      this.defaultColumnDatas()
      this.salaryStandardInfo = record
      // 业务类型
      this.salaryStandardInfo.businessType = await getBusinessType(record.departId)

      const url = `${this.url.openBill}?salaryFormId=${record.id}`
      this.subject=null
      httpAction(url,{},'POST').then((res) => {
        if(Number(res.code) === 200){
          this.coverList = res.data.coverList
          this.subject = res.data.salary
          // 附件
          const fileList = {
            "0": res.data.atta0,
            "1": res.data.atta1,
            "2": res.data.atta2,
            "3": res.data.atta3,
          }
          const list = {"0":[],"1":[],"2":[],"3":[]}
          for(const key in fileList){
            fileList[key].forEach(item => {
              list[key].push({
                uid: item.id,
                name: item.attaName,
                status: 'done',
                url: item.attaUrl
              })
            });
          }
          this.attaList = list
          
          this.detailData = res.data
          this.settlementhFormInfo = res.data.engineerSettlementForm || {}
          this.pauseDiyInfoList = res.data.engineerSettlementhFormSubList||[]
          this.poorBalanceInfoList = res.data.poorBalanceInfoList||[]
          this.dataSourceList = this.detailData.engineerAccountList||[]
          this.handleColumnData()
          this.salaryAccountOne = res.data.engineerAccountList[0]||null
          this.auditLogList = res.data.auditLogList ||[]
          // this.activityKey = '1'
          this.visible = true
          this.changeTab(this.activityKey)
          this.fileList = []
          res.data.atta8.map(item => {
            this.fileList.push({
                uid: item.id,
                name: item.attaName,
                status: 'done',
                url: item.attaUrl
            })
          })
        }
      })
      this.loadMatchDetailInfo(record.id)
    },
    // 获取匹配明细
    loadMatchDetailInfo(recordId){
      const detailUrl = `${this.url.mathDetailUrl}?matchId=${recordId}&type=1`
      httpAction(detailUrl,{},'GET').then((res) => {
        if(Number(res.code) === 200){
          this.matchDetailData = res.data || []
        }else {
          this.$message.warn(res.msg || '匹配明细获取失败')
        }
      })
    },
    // 默认列数据
    defaultColumnDatas(){
      this.columns = [
        {
          width: 130,
          ellipsis: true,
          title: '姓名',
          dataIndex: 'empName',
          fixed: 'left',
          align: 'center',
          key: 'empName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 240,
          ellipsis: true,
          title: '身份证号',
          align: 'center',
          dataIndex: 'empIdcard',
          key: 'empIdcard',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '手机号码',
          dataIndex: 'empPhone',
          key: 'empPhone',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '银行卡号',
          align: 'center',
          dataIndex: 'bankNo',
          key: 'bankNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '开户行',
          align: 'center',
          dataIndex: 'bankName',
          key: 'bankName',
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
          title: '工资发放时间',
          align: 'center',
          dataIndex: 'salaryGiveTime',
          key: 'salaryGiveTime',
          customRender: (text) => {
            return this.salaryGiveTimeOption[text]
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '工资月份',
          align: 'center',
          dataIndex: 'salaryDate',
          key: 'salaryDate',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '结算月份',
          align: 'center',
          dataIndex: 'settlementMonth',
          key: 'settlementMonth',
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
          dataIndex: 'settleDepartName',
          key: 'settleDepartName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
            title: '本月是否重复金额',
            width: 150,
            align: 'center',
            dataIndex: 'isRepeat',
            key: 'isRepeat',
            customRender: (text) => {
              if(!text){
                return '否'
              }else{
                return this.isFlag[text] || '-'
              }
            }
          },
        {
          width: 120,
          ellipsis: true,
          title: '是否自有员工',
          dataIndex:'ownFlag',
          align: 'center',
          key:'ownFlag',
          customRender:(text) => {
            return this.isFlag[text] || '-'
          }
        },
      ]
    },
    // 处理列数据
    handleColumnData(){
      let isDeductSocial = this.dataSourceList.length > 0 ? this.dataSourceList[0]['isDeductSocial'] : ''
      if(this.dataSourceList && String(isDeductSocial) === '1'){
        this.columns.push(
          {
            width: 150,
            ellipsis: true,
            title: '社保扣缴月份',
            align: 'center',
            dataIndex: 'deduSocialMonth',
            key: 'deduSocialMonth',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
        )
        this.columns.push(
          {
            width: 120,
            ellipsis: true,
            title: '社保优先级',
            align: 'center',
            dataIndex: 'socialPriority',
            key: 'socialPriority',
            customRender: (text) => {
              return this.socialPriorityOption[text] || '-'
            }
          },
        )
        this.columns.push(
          {
            width: 120,
            ellipsis: true,
            title: '是否扣除社保',
            align: 'center',
            dataIndex: 'isDeductSocial',
            key: 'isDeductSocial',
            customRender: (text) => {
              if(!text){
                return '否'
              }else{
                return this.isFlag[text]
              }
            }
          },
        )
      }
      this.columns.push({
        width: 130,
        ellipsis: true,
        title: '操作',
        align: 'center',
        key: 'action',
        fixed: 'right',
        scopedSlots: { customRender: 'operation' }
      })
    },
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then((res) => {
        if (Number(res.code) === 200) {
          this.bankOptions = res.data
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.defaultColumnDatas()
      this.visible = false
      this.footSide = false
    },
    handleOk() {
      this.visibleCheck = true
    },
    handleCheckCancel() {
      this.visibleCheck = false
    },
    // 撤回
    handleBackOk(){
      this.backform.validateFields((err,values) => {
        if(!err){
          const url = `${this.url.backUrl}?tSettlementhFormId=${this.settlementhFormInfo.id}`
          httpAction(url,{'id':this.salaryStandardInfo.id,'status':7,'remark':values.remark},'POST').then((res) => {
            if(Number(res.code) === 200){
              this.$message.success("退回成功")
              this.handleCancel()
              this.$emit('ok')
            }else{
              this.$message.error(res.msg)
            }
          })
        }
      })

    },
    handleCheckOk() {
      this.confirmLoading = true
      this.form.validateFields((err,values) => {
        if(!err){
          let formData = Object.assign(this.model, values)
          formData.id = this.salaryStandardInfo.id
          // wxhr:tsalarystandard_doAudit
          httpAction(this.url.doAuditUrl,formData,'POST').then((res) => {
            this.confirmLoading = false
            if(Number(res.code) === 200){
              this.$message.success("审核成功")
              this.visibleCheck = false
              this.visible = false
              this.$emit('ok')
              this.form.resetFields()
            }else{
              this.$message.error(res.msg)
            }
          })
        }else{
          this.confirmLoading = false
        }
      })
    },
    handleChange(e) {
      this.checkValue = e.target.value
      if(String(e.target.value) === '5'){
        this.validatorRules.remark = { rules: [{ required: true, message: '请输入审核意见!' }] }
      }else{
        this.validatorRules.remark = {}
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
      this.$refs.statementDetailModal.salaryType = 1 // 0:普通薪资 1:工程工资 2:非扣税类，默认普通薪资
      this.$refs.statementDetailModal.saiList = salaryList
      this.$refs.statementDetailModal.show()
    },
    changeTab(key){
      this.activityKey = key
      if(Number(key) === 2){
        this.$nextTick(()=>{
          this.$refs.settleAccountModal.show()
          this.$refs.settleAccountModal.openData = this.detailData.engineeringFormTicketList
        })
        
      }
      if(Number(key) === 3){
        this.$nextTick(()=>{
          this.$refs.auditPageModal.show()
        })
      }
      if(Number(key) === 4){
        this.$nextTick(()=>{
           this.$refs.auditProgressModal.show()
        })
      }
    },
    //导出
    handleDownload() {
      const url = `${this.url.doExportUrl}?salaryFormId=${this.salaryStandardInfo.id}`
      this.downloading = true
      httpAction(url,{},'POST').then((res) => {
        if(Number(res.code) === 200){
          let auditName = ''
          let createName = ''
          let revenueName = ''
          if(res.data.salary.createUser){
            for(const text in this.employData){
              if(String(text) === String(res.data.salary.auditUser)){
                auditName = this.employData[text]
              }
              if(String(text) === String(res.data.salary.createUser)){
                createName = this.employData[text]
              }
              if(String(text) === String(res.data.salary.revenueUser)){
                revenueName = this.employData[text]
              }
            }
          }
          let settleForm = res.data.engineerSettlementForm
          let engineeringFormTicketList = res.data.engineeringFormTicketList
          settleForm.ufundDeduction = settleForm.ufundDeduction ? settleForm.ufundDeduction : ''
          settleForm.pfundDeduction = settleForm.pfundDeduction ? settleForm.pfundDeduction : ''
          settleForm.unitIncomeTax = settleForm.unitIncomeTax ? settleForm.unitIncomeTax : ''
          settleForm.personIncomeTax = settleForm.personIncomeTax ? settleForm.personIncomeTax : ''
          settleForm.unitIncomeTaxTicket = settleForm.unitIncomeTaxTicket ? settleForm.unitIncomeTaxTicket : ''
          settleForm.personIncomeTaxTicket = settleForm.personIncomeTaxTicket ? settleForm.personIncomeTaxTicket : ''
          // 结算单数据
          let settelData = [
            {'index':settleForm.settleMonth + '结算单','data':'','project':'','money':'','account':''},
            {'index':'结算名称:','data':settleForm.settleDepartName,'project':'','money':'皖信盖章','account':''},
            {'index':'结算编码:','data':settleForm.settleDepartNo,'project':'','money':'结算时间:','account':settleForm.settleMonth},
            {'index':'业务类型:','data': this.salaryStandardInfo.businessType,'project':'','money':'','account':''},
            {'index':'序号','data':'费用项目','project':'','money':'金额','account':'开票额小计'},
            {'index':1,'data':res.data.salary.salaryMonth,'project':'应发工资','money':settleForm.salarySum,'account':settleForm.salaryTicket}, 
            {'index':'','data':'','project':'实发工资(银付)','money':settleForm.cardPay,'account':' '},
            {'index':'','data':'','project':'实发工资(现金)','money':settleForm.moneyPay,'account':' '},
            {'index':'','data':'','project':'暂停发金额','money':settleForm.pausePay,'account':' '},
            {'index':2,'data':settleForm.socialMonth,'project':'应缴单位社保','money':settleForm.usocialDeduction,'account':''}, 
            {'index':'','data':'','project':'代扣个人社保','money':settleForm.psocialDeduction,'account':''},
            {'index':3,'data':settleForm.fundMonth,'project':'应缴单位公积金','money':settleForm.ufundDeduction,'account':''}, 
            {'index':'','data':'','project':'应缴个人公积金','money':settleForm.pfundDeduction,'account':''},
          ];
          let num = 4
          if(res.data.engineerSettlementhFormSubList){
            for(var c of res.data.engineerSettlementhFormSubList){
              settelData.push({'index':num,'data':getItemName(c.itemTypeName,c.subName)+(this.pauseTxt[c.isPause]||''),'project':'','money':c.money,'account':''})
              num++
            }
          }
          if(settleForm.takingBalance != 0){
            settelData.push({'index':num,'data':'商险差额','project':'','money':settleForm.takingBalance,'tax':'','account':''})
            num++
          }
          if(!settleForm.remark){
            settleForm.remark = ''
          }
          settelData.push({'index':num++,'data':'雇主责任险','project':'','money':settleForm.employerLiabilityInsurance,'account':''})
          settelData.push({'index':num++,'data':'其它费用','project':'','money':settleForm.other,'account':''})
          settelData.push({'index':num++,'data':'增值税金及附加','project':'','money':settleForm.valueDaddedTax,'account':settleForm.valueDaddedTaxTicket})
          settelData.push({'index':num++,'data':'预缴企业所得税','project':'','money':settleForm.unitIncomeTax,'account':settleForm.unitIncomeTaxTicket})
          settelData.push({'index':num++,'data':'预缴个人所得税	','project':'','money':settleForm.personIncomeTax,'account':settleForm.personIncomeTaxTicket})
          settelData.push({'index':num++,'data':'人数','project':'','money':settleForm.personCount,'account':''})
          settelData.push({'index':num++,'data':'管理费','project':'','money':settleForm.managementCost,'account':settleForm.managementCostTicket})
          settelData.push({'index':num++,'data':'结算金额合计','project':'','money':'','account':settleForm.accountMoneySum})
          settelData.push({'index':num++,'data':'开票金额合计','project':'','money':'','account':settleForm.ticketMoneySum})
          settelData.push({'index':num++,'data':'备注:','project':settleForm.remark,'money':'','account':''})
          
          settelData.push({'index':'','data':'','project':'','money':'','account':''})
          settelData.push({'index':'','data':'','project':'','money':'','account':''})
          settelData.push({'index':'开票日期','data':'开票金额','project':'本次结算金额','money':'本次结算到账金额','account':''})

          for(let a of engineeringFormTicketList){
            settelData.push({'index':(a.ticketTime || '').substring(0,10),'data':a.money,'project':a.currentSettleMoney,'money':a.currentSettleComeMoney,'account':''})
          }
          settelData.push({'index':engineeringFormTicketList.length + 4,'data':'','project':'','money':'','account':''})
          let engineerAccountList = res.data.engineerAccountList
          let accountTitle = res.data.accountTitle
          for(let d in engineerAccountList){
            engineerAccountList[d].salaryStyle = this.salaryStyleOption[engineerAccountList[d].salaryStyle]
            engineerAccountList[d].salaryGiveTime = this.salaryGiveTimeOption[engineerAccountList[d].salaryGiveTime]
            engineerAccountList[d].salaryTaxFlag = this.isFlag[engineerAccountList[d].salaryTaxFlag]
            engineerAccountList[d].socialPriority = this.socialPriorityOption[engineerAccountList[d].socialPriority]
            engineerAccountList[d].fundPriority = this.fundPriorityOption[engineerAccountList[d].fundPriority]
            engineerAccountList[d].annualBonusType = this.annualBonusTypeOption[engineerAccountList[d].annualBonusType]
            engineerAccountList[d].isDeductSocial = this.isFlag[engineerAccountList[d].isDeductSocial]
            engineerAccountList[d].isDeductFund = this.isFlag[engineerAccountList[d].isDeductFund]
            engineerAccountList[d].isRepeat = this.isFlag[engineerAccountList[d].isRepeat]
            engineerAccountList[d].ownFlag = this.isFlag[engineerAccountList[d].ownFlag]
            engineerAccountList[d].salaryCount = engineerAccountList[d].salaryCount ? engineerAccountList[d].salaryCount : ''
            let bankName = filterDictText(this.bankOptions,engineerAccountList[d].bankName)
            if(bankName == '-' && this.bankOptions,engineerAccountList[d].bankName){
              1 == 1
            }else{
              engineerAccountList[d].bankName = bankName
            }
            if(accountTitle){
              for(let c in accountTitle){
                engineerAccountList[d][accountTitle[c]] = ''
                let saiList = engineerAccountList[d].saiList
                let i = 0;
                for(let m in saiList){
                  if(saiList[m].javaFiedName == accountTitle[c]){
                    i = 1
                    engineerAccountList[d][accountTitle[c]] = saiList[m].salaryMoney
                  }
                }
                if(i == 0){
                  engineerAccountList[d][accountTitle[c]] = 0
                }
              }
            }
          }

          //转换银行数据
          let salaryBankVoList = res.data.salaryBankVoList
          for(var m in res.data.salaryBankVoList){
            let bankName = filterDictText(this.bankOptions,salaryBankVoList[m].bankName)
            if(bankName == '-' && this.bankOptions,salaryBankVoList[m].bankName){
              1 == 1
            }else{
              salaryBankVoList[m].bankName = bankName
            }
          }
          
          let isDeductSocial = engineerAccountList.length > 0 ? engineerAccountList[0]['isDeductSocial'] : ''
          let engineerAccountListHeader
          let engineerAccountListValue
          if(isDeductSocial == 1){
            engineerAccountListHeader  = ["工资月份","结算月份","结算主体","姓名","身份证号","手机号码","银行卡号","开户行","工资发放方式","工资发放次数","工资发放时间","社保扣缴月份",
              "社保优先级","是否扣除社保","本月是否重复金额","是否自有员工"]
            engineerAccountListValue =  ["salaryDate", "settlementMonth", "settleDepartName", "empName", "empIdcard", "empPhone","bankNo", "bankName", "salaryStyle","salaryCount","salaryGiveTime","deduSocialMonth",
              "socialPriority","isDeductSocial","isRepeat",'ownFlag'] 
          }else{
            engineerAccountListHeader  = ["工资月份","结算月份","结算主体","姓名","身份证号","手机号码","银行卡号","开户行","工资发放方式","工资发放次数","工资发放时间","本月是否重复金额","是否自有员工"]
            engineerAccountListValue =  ["salaryDate", "settlementMonth", "settleDepartName", "empName", "empIdcard", "empPhone","bankNo", "bankName", "salaryStyle","salaryCount","salaryGiveTime","isRepeat","ownFlag"] 
          }
          //工资明细详情字段组装     
          if(accountTitle){
            for(let c in accountTitle){
              engineerAccountListHeader.push(c)
              engineerAccountListValue.push(accountTitle[c])
            }
          }
          // 封面数据
          var excelDatas = [
            {
              tHeader: engineerAccountListHeader,
              filterVal: engineerAccountListValue,
              tableDatas: engineerAccountList, // 表一的整体json数据
              sheetName: "工资明细"// 表一的sheet名字
            },
            {
              tHeader: ["序号",null,"费用项目", "金额", "开票额小计"],
              filterVal: ['index','data',"project", "money", "account"],
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
            let remark = d.remark ? d.remark : ''
            d.createDate = d.createDate ?  moment(d.createDate).format("YYYY/MM/DD") : ""
            let lastTwo = d.itemName.substr(d.itemName.length - 2,2)
            if(lastTwo == "其他"){
              d.itemName = d.itemName.substr(0,d.itemName.length - 2) + "工资"
            }
            if(d.payType == 1){
              let coverData = [
                {'company':d.invoiceTitle,'project':'','payType':'','money':'','no':`附件${res.data.coverList.length}张`},
                {'company':"银行转账审批单",'project':'','payType':'','money':'','no':''},
                {'company':"",'project':d.createDate,'payType':'结算主体编码','money':d.settleNo,'no':''},
                {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
                {'company':d.unitName,'project':d.itemName,'payType':'银行转账','money':'¥' + d.money,'no':''},
                {'company':d.settleName,'project':'','payType':'','money':'','no':''},
                {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
                {'company':"备注:",'project':remark,'payType':'','money':'','no':''},
                {'company':"收款单位名称: " + receiptUnitName + "        账号: " + bankNo + "        开户行: " + bankName,'project':'','payType':'','money':'','no':''},
                {'company':"公司领导：         财务负责人:" + revenueName + '         网银审核授权人：         网银转账提交人：' + '         数据审核人：' + auditName + '         制表人:' + createName,'project':'' ,'payType': '','money':'','no':''},
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
                {'company':"",'project':d.createDate,'payType':'结算主体编码','money':d.settleNo,'no':''},
                {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
                {'company':d.unitName,'project':d.itemName,'payType':'现金转账','money':'¥' + d.money,'no':''},
                {'company':d.settleName,'project':'','payType':'','money':'','no':''},
                {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
                {'company':"备注:" + remark,'project':'','payType':'','money':'','no':''},
                {'company':"公司领导：         财务负责人：" + revenueName + '         出纳会计: ' + '         数据审核人：' + auditName + '         制表人: ' + createName,'project': '' ,'payType':'','money':'','no':''},
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
              let excelName = settleForm.settleMonth + settleForm.settleDepartName + "工程薪资" + '(' + filterDictText(this.formTypeOptions, res.data.salary.formType) + ')' + settleForm.settleDepartNo + '(' + settleForm.accountMoneySum + ')'
              this.json2excel(excelDatas, excelName, true, "xlsx",insLength)
              this.downloading = false
            })
          }else{
            let excelName = settleForm.settleMonth + settleForm.settleDepartName + "工程薪资" + '(' + filterDictText(this.formTypeOptions, res.data.salary.formType) + ')' + settleForm.settleDepartNo + '(' + settleForm.accountMoneySum + ')'
            this.json2excel(excelDatas, excelName, true, "xlsx",insLength)
            this.downloading = false
          }
          // let excelName = settleForm.settleMonth + settleForm.settleDepartName + "工程薪资" + '(' + filterDictText(this.formTypeOptions, res.data.salary.formType) + ')' + settleForm.settleDepartNo + '(' + settleForm.accountMoneySum + ')'
          // this.json2excel(excelDatas, excelName, true, "xlsx")
        }
      })
      
    },
    json2excel(tableJson, filenames, autowidth, bookTypes, insLength){
      var that = this
      //这个是引用插件
      import("@/vendor/ExportEngineExcel").then(excel => {
        var tHeader = []
        var dataArr = []
        var sheetnames = []
        for (var i in tableJson) {
          tHeader.push(tableJson[i].tHeader)
          dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
          sheetnames.push(tableJson[i].sheetName)
        }
        console.log(dataArr)
        excel.export_json_to_excel_more_sheet({
          header: tHeader,
          data: dataArr,
          sheetname: sheetnames,
          filename: filenames,
          autoWidth: autowidth,
          bookType: bookTypes,
          insLength: insLength
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
