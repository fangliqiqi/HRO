<template>
  <a-modal
    title="工资报表"
    :width="1200"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="取消"
    okText="确定"
    :visible="visible"
    :maskClosable="false"
  >
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
            :columns="columns"
            :dataSource="dataSourceList"
            :loading="loading"
            :scroll="{ x: 2160 }"
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
          tab="结算表"
          key="2"
          :forceRender="true"
        >

          <!-- <salary-settle-account-modal ref="settleAccountModal"></salary-settle-account-modal> -->
          <pause-settle-account-modal
            ref="settleAccountModal"
            :salaryStandardInfo="salaryStandardInfo"
            :settlementhFormInfo="settlementhFormInfo"
            :pauseDiyInfoList="pauseDiyInfoList"
            :poorBalanceInfoList="poorBalanceInfoList"
            :salaryAccountOne="salaryAccountOne"
          ></pause-settle-account-modal>
        </a-tab-pane>
        <a-tab-pane
          tab="封面"
          key="3"
          forceRender
        >
          <pause-page-modal
            ref="pausePageModal"
            :salaryStandardInfo="salaryStandardInfo"
            :coverList="coverList"
          ></pause-page-modal>
        </a-tab-pane>

      </a-tabs>
    </a-card>
    <!-- 工资明细详情 -->
    <statement-detail-modal ref="statementDetailModal"></statement-detail-modal>
  </a-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction } from '@/api/manage'
import PauseSettleAccountModal from './PauseSettleAccountModal'
import PausePageModal from './PausePageModal'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import StatementDetailModal from '../../searchsalary/modules/StatementDetailModal'

export default {
  name: 'PauseSalaryDetailModal',
  components: {
      PauseSettleAccountModal,
      PausePageModal,
      StatementDetailModal
    },
  mixins: [JeecgListMixin],
  data() {
    return {
      visible:false,
      visibleCheck:false,
      form:this.$form.createForm(this),
      checkValue:'',
      loading:false,
      confirmLoading:false,
      bankOptions:[],
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      columns:[
        {
          title: '姓名',
          dataIndex: 'empName',
          width: 120,
          fixed: 'left',
          key: 'empName',
          align: 'center',
        },
        {
          title: '工资发放方式',
          width: 120,
          fixed: 'left',
          dataIndex: 'salaryStyle',
          key: 'salaryStyle',
          align: 'center',
          customRender:(text) => {
            return this.salaryStyleOption[text]
          }
        },
        {
          title: '身份证号',
          dataIndex: 'empIdcard',
          width: 120,
          key: 'empIdcard',
          align: 'center',
        },
        {
          title: '手机号码',
          dataIndex: 'empPhone',
          width: 120,
          key: 'empPhone',
          align: 'center',
          customRender: text => {
            return text || '-'
          }
        },
        {
          title: '银行卡号',
          dataIndex: 'bankNo',
          width: 120,
          key: 'bankNo',
          align: 'center',
        },
        {
          title: '开户行',
          dataIndex: 'bankName',
          width: 120,
          key: 'bankName',
          align: 'center',
          customRender: (text) => {
            const bankName = filterDictText(this.bankOptions, text)
            if(bankName == '-' && text){
              return text;
            }
            return bankName
          },
        },
        {
          title: '工资发放时间',
          dataIndex: 'salaryGiveTime',
          width: 120,
          key: 'salaryGiveTime',
          align: 'center',
          customRender:(text) => {
            return this.salaryGiveTimeOption[text]
          }
        },
        {
          title: '社保扣缴月份',
          dataIndex:'deduSocialMonth',
          width: 120,
          key:'deduSocialMonth',
          align: 'center',
        },
        {
          title: '公积金扣缴月份',
          dataIndex:'deduProvidentMonth',
          width: 120,
          align: 'center',
          key:'deduProvidentMonth'
        },
        {
          title: '是否薪资扣税',
          dataIndex:'salaryTaxFlag',
          width: 120,
          align: 'center',
          key:'salaryTaxFlag',
          customRender:(text) => {
            return this.isFlag[text]
          }
        },
        {
          title: '社保优先级',
          dataIndex:'socialPriority',
          width: 120,
          align: 'center',
          key:'socialPriority',
          customRender:(text) => {
            return this.socialPriorityOption[text]
          }
        },
        {
          title: '公积金优先级',
          dataIndex:'fundPriority',
          width: 120,
          align: 'center',
          key:'fundPriority',
          customRender:(text) => {
            return this.fundPriorityOption[text]
          }
        },
        {
          title: '年终奖扣税方案',
          dataIndex:'annualBonusType',
          width: 120,
          align: 'center',
          key:'annualBonusType',
          customRender:(text) => {
            return this.annualBonusTypeOption[text]
          }
        },
        {
          title: '是否扣除社保',
          dataIndex:'isDeductSocial',
          width: 120,
          align: 'center',
          key:'isDeductSocial',
          customRender:(text) => {
            return this.isFlag[text]
          }
        },
        {
          title: '是否扣除公积金',
          dataIndex:'isDeductFund',
          width: 120,
          align: 'center',
          key:'isDeductFund',
          customRender:(text) => {
            return this.isFlag[text]
          }
        },
        {
          title: '工资月份',
          dataIndex: 'salaryDate',
          width: 120,
          align: 'center',
          key: 'salaryDate',
        },
        {
          title: '结算月份',
          dataIndex: 'settlementMonth',
          width: 120,
          align: 'center',
          key: 'settlementMonth',
        },
        {
          title: '结算主体',
          dataIndex: 'settleDepartName',
          width: 120,
          align: 'center',
          key: 'settleDepartName',
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 120,
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      salaryStandardInfo:'',
      validatorRules:{
        status: { rules: [{ required: true, message: '请审核!' }] },
        remark: { rules: [{ required: true, message: '请输入审核意见!' }] },
      },
      model:{},
      url:{
        list:'/salary/tsalarystandard/auditSalaryStandardPage',
        doAuditUrl:'/salary/tsalarystandard/doAudit',
        openBill:'/salary/salary/openBill',
      },
      activityKey:'1',
      dataSourceList:[],
      detailData:{},
      coverList:[],
      settlementhFormInfo:{},
      pauseDiyInfoList:[],
      poorBalanceInfoList:[],
      salaryAccountOne:{},
    }
  },
  methods: {
    show(record) {
      this.initDictConfig()
      const url = `${this.url.openBill}?salaryFormId=${record.salaryFormId}`
      httpAction(url,{},'POST').then((res) => {
        if(Number(res.code) === 200){
          this.coverList = res.data.coverList
          this.settlementhFormInfo = res.data.settlementhForm
          this.pauseDiyInfoList = res.data.settlementhFormSubList
          this.poorBalanceInfoList = res.data.poorBalanceInfoList
          this.detailData = res.data
          this.dataSourceList = this.detailData.salaryAccountList
          this.salaryAccountOne = res.data.salaryAccountList[0]
          this.salaryStandardInfo = res.data.salary
          this.detailData = res.data
          this.dataSourceList = this.detailData.salaryAccountList
          this.visible = true
          this.changeTab(this.activityKey)
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      // this.activityKey = '1'
    },
    handleOk() {
      this.close()
    },
    handleCheckCancel() {
      this.visibleCheck = false
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
      this.$refs.statementDetailModal.salaryType = 0 // 0:普通薪资 1:工程工资 2:非扣税类，默认普通薪资
      this.$refs.statementDetailModal.saiList = salaryList
      this.$refs.statementDetailModal.show()
    },
    changeTab(key){
      this.activityKey = key
      if(Number(key) === 2){
        this.$nextTick(()=>{
          this.$refs.settleAccountModal.show()
        })
      }
      if(Number(key) === 3){
        this.$nextTick(()=>{
          this.$refs.pausePageModal.show()
        })
      }
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
  }
}
</script>
<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 110px;
  }
}
</style>

