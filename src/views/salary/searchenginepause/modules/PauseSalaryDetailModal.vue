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
    :destroyOnClose="true"
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
            :scroll="scroll"
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
          forceRender
        >
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
        <a-tab-pane
          tab="流程进展明细"
          key="4"
          forceRender
        >
          <pause-process-modal
            ref="salaryProgressModal"
            :salaryStandardInfo="salaryStandardInfo"
            :fileList="fileListArr"
          ></pause-process-modal>
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
import PauseProcessModal from '../../salaryenginepause/modules/PauseProcessModal'

export default {
  name: 'PauseSalaryDetailModal',
  components: {
      PauseSettleAccountModal,
      PausePageModal,
      StatementDetailModal,
      PauseProcessModal
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
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      columns:[],
      salaryStandardInfo:{},
      validatorRules:{
        status: { rules: [{ required: true, message: '请审核!' }] },
        remark: { rules: [{ required: true, message: '请输入审核意见!' }] },
      },
      model:{},
      url:{
        list:'/salary/tsalarystandard/auditSalaryStandardPage',
        doAuditUrl:'/salary/tsalarystandard/doAudit',
        openBill:'/salary/engineer/openBill',
      },
      activityKey:'1',
      dataSourceList:[],
      detailData:{},
      coverList:[],
      settlementhFormInfo:{},
      pauseDiyInfoList:[],
      poorBalanceInfoList:[],
      salaryAccountOne:{},
      scroll:{},
      fileListArr:{}
    }
  },
  methods: {
    show(record) {
      const url = `${this.url.openBill}?salaryFormId=${record.salaryFormId}`
      httpAction(url,{},'POST').then((res) => {
        if(Number(res.code) === 200){
          this.coverList = res.data.coverList
          this.settlementhFormInfo = res.data.engineerSettlementForm
          this.pauseDiyInfoList = res.data.engineerSettlementhFormSubList ? res.data.engineerSettlementhFormSubList : []
          this.poorBalanceInfoList = res.data.poorBalanceInfoList ? res.data.poorBalanceInfoList : []
          this.detailData = res.data
          this.dataSourceList = this.detailData.engineerAccountList
          this.columns = [
            {
              title: '姓名',
              dataIndex: 'empName',
              width: 130,
              fixed: 'left',
              align: 'center',
              key: 'empName'
            },
            {
              title: '身份证号',
              width: 130,
              align: 'center',
              dataIndex: 'empIdcard',
              key: 'empIdcard',
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
              width: 130,
              align: 'center',
              dataIndex: 'bankNo',
              key: 'bankNo'
            },
            {
              title: '开户行',
              width: 130,
              align: 'center',
              dataIndex: 'bankName',
              key: 'bankName',
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
              width: 130,
              align: 'center',
              dataIndex: 'salaryGiveTime',
              key: 'salaryGiveTime',
              customRender: (text) => {
                return this.salaryGiveTimeOption[text]
              }
            },
            {
              title: '工资月份',
              width: 130,
              align: 'center',
              dataIndex: 'salaryDate',
              key: 'salaryDate'
            },
            {
              title: '结算月份',
              width: 130,
              align: 'center',
              dataIndex: 'settlementMonth',
              key: 'settlementMonth'
            },
            {
              title: '结算主体',
              width: 130,
              align: 'center',
              dataIndex: 'settleDepartName',
              key: 'settleDepartName'
            }
          ]
          let isDeductSocial = this.dataSourceList.length > 0 ? this.dataSourceList[0]['isDeductSocial'] : ''
          if(this.dataSourceList && isDeductSocial == 1){
            this.columns.push(
              {
                title: '社保扣缴月份',
                width: 130,
                align: 'center',
                dataIndex: 'deduSocialMonth',
                key: 'deduSocialMonth'
              },
            )
            this.columns.push(
              {
                title: '社保优先级',
                width: 130,
                align: 'center',
                dataIndex: 'socialPriority',
                key: 'socialPriority',
                customRender: (text) => {
                  return this.socialPriorityOption[text]
                }
              },
            )
            this.columns.push(
              {
                title: '是否扣除社保',
                width: 130,
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
            this.scroll = {x : 1560}
          }else{
            this.scroll = {x : 1170}
          }

          this.columns.push({
            title: '操作',
            width: 130,
            align: 'center',
            key: 'action',
            fixed: 'right',
            scopedSlots: { customRender: 'operation' }
          })

          this.salaryAccountOne = res.data.engineerAccountList.length > 0 ? res.data.engineerAccountList[0] : {}
          this.salaryStandardInfo = res.data.salary ? res.data.salary : {}
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
          this.fileListArr = list
          this.detailData = res.data
          this.dataSourceList = this.detailData.engineerAccountList
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
      this.fileListArr = {"0":[],"1":[],"2":[],"3":[]}
    },
    handleOk() {
      this.visibleCheck = true
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
      this.$refs.statementDetailModal.salaryType = 1 // 0:普通薪资 1:工程工资 2:非扣税类，默认普通薪资
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
      if(Number(key) === 4){
        this.$nextTick(()=>{
          this.$refs.salaryProgressModal.show()
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

