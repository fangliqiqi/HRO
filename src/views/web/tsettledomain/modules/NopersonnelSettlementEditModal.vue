<template>
  <a-modal
    :visible="visible"
    :width="1000"
    @cancel="handleCancel"
    @ok="handleCancel"
    :maskClosable="false"
    :closable="false"
    :destroyOnClose="true"
  > 
    <div slot="title">
      <span style="margin-right:10px">{{ model.settleDomain.departName }}</span>
      <a-tag
        v-for="(item,index) in serverItem"
        :key="index"
        color="blue"
      >
        {{ item }}
      </a-tag>
      <a-button type="primary" class="btnRight" @click="handleSettle" v-if="model.settleDomain.stopFlag == '0'">结算</a-button>
      <a-button type="primary" class="btnRight" @click="handleInnerSettle" v-if="model.settleDomain.stopFlag == '0'">内部计收</a-button>
    </div>
    <a-spin :spinning="confirmLoading">
      <a-descriptions :column="2" bordered class="mbot">
        <a-descriptions-item label="客户单位">{{ model.settleDomain.customerName || '-' }}</a-descriptions-item>
        <a-descriptions-item label="业务合同">{{ model.settleDomain.contractName || '-' }}</a-descriptions-item>
        <a-descriptions-item label="业务类型">{{ getMultiName(allTypeList,'/',model.settleDomain.businessPrimaryType,model.settleDomain.businessSecondType,model.settleDomain.businessThirdType) }}</a-descriptions-item>
        <a-descriptions-item label="收入归属">
          {{ getNameFromArr(organAll,model.settleDomain.incomeBelong,'id','organName') }} / {{ getNameFromArr(organAll,model.settleDomain.incomeBelongSub,'id','organName') }}
        </a-descriptions-item>
        <a-descriptions-item label="缴税类型">
          {{ model.departSettlementInfo ? getNameFromArr(taxTypeDicts,model.departSettlementInfo.taxType,'id','label') : '' }}
        </a-descriptions-item>
        <a-descriptions-item label="缴税税率">
          {{ model.departSettlementInfo ? model.departSettlementInfo.taxFee : '' }}%
        </a-descriptions-item>
        <a-descriptions-item label="创建人">{{ model.settleDomain.createUserName }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ model.settleDomain.createTime ? model.settleDomain.createTime.substring(0, 10) : '' }}</a-descriptions-item>
      </a-descriptions>
      
      <a-table :columns="columns" :data-source="dataSource" :pagination="ipagination" @change="handleTableChange" rowKey="id">
        <template slot="title"><span class="tableTit">结算信息</span></template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">查看</a>
          <a-divider type="vertical" v-if="record.auditFlag == 3 || record.auditFlag == 0"/>
          <a @click="handleEdit(record)" v-if="record.auditFlag == 3 || record.auditFlag == 0">编辑</a>
          <template v-if="record.auditFlag == 0">
            <a-divider type="vertical" />
            <a @click="relateInvoice(record)">关联开票</a>
            <a-divider type="vertical"/>
            <a @click="matchingIncome(record)">匹配收入</a>
            <a-divider type="vertical" />
            <a @click="handleSubmit(record)">提交</a>
          </template>
          <a-divider type="vertical" v-if="record.auditFlag == 3 || record.auditFlag == 0"/>
          <a-popconfirm
            v-if="record.auditFlag == 3 || record.auditFlag == 0"
            title="确定删除吗?"
            @confirm="() => handleDelete(record)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-spin>
    
    <settlement-document-modal ref="SettlementDocumentForm" :organAll="organAll" :settleInfo="model" @ok="submitOk"></settlement-document-modal>
    <settlement-document-detail-modal ref="SettlementDocumentDetailForm" :organAll="organAll"></settlement-document-detail-modal>
    <internal-counter-modal ref="InternalCounterForm" @ok="submitOk"></internal-counter-modal>
    <settlement-submit-modal ref="SettlementSubmitForm" @ok="submitOk"></settlement-submit-modal>
    <invoice-info-module ref="InvoiceInfoFrom" @close="handleCancel"></invoice-info-module>
    <match-in-account-of-statement-two-modal ref="MatchInAccountOfStatementForm" @ok="submitOk"></match-in-account-of-statement-two-modal>
    
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
// import { getAllSettleDomainSelectVos } from '@/api/api'
import { getMultiName, getNameFromArr } from '@/utils/common'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import SettlementDocumentModal from './SettlementDocumentModal'
import SettlementDocumentDetailModal from './SettlementDocumentDetailModal'
import InternalCounterModal from './InternalCounterModal'
import SettlementSubmitModal from './SettlementSubmitModal'
import InvoiceInfoModule from '../../businessoutsourcing/modules/InvoiceInfoModule'
import MatchInAccountOfStatementTwoModal from '../../tfinancial/receive/modules/MatchInAccountOfStatementTwoModal'

export default {
  name: 'NopersonnelSettlementEditModal',
  components: {
    SettlementDocumentModal,
    SettlementDocumentDetailModal,
    InternalCounterModal,
    SettlementSubmitModal,
    InvoiceInfoModule,
    MatchInAccountOfStatementTwoModal
  },
  data() {
    return {
      visible: false,
      title: '添加结算主体',
      confirmLoading: false,
      matchingLimit: 0, // 出账限额
      model: {
        settleDomain: {},
        departSettlementInfo: {},
      },
      serverItem: [],
      allTypeList:[],
      organAll: [],
      taxTypeDicts:[],
      settleDomainOptions:[],
      auditFlagOption: ['待提交','待审核','通过','退回'],
      url: {
        add: '/hrBase/tsettledomain/vo',
        edit: '/hrBase/tsettledomain',
        list: '/hrOneTime/tnewsettle/getTMainAndBillVoPage'
      },
      columns: [
        {
          width:90,
          ellipsis: true,
          title: '结算状态',
          align: 'center',
          dataIndex: 'auditFlag',
          customRender: text => {
            const resultText = text ? this.auditFlagOption[text] : '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          width:90,
          ellipsis: true,
          title: '业务收入',
          align: 'center',
          dataIndex: 'income',
          customRender: text => {
            const resultText = text || 0
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          width:90,
          ellipsis: true,
          title: '内部计收',
          align: 'center',
          dataIndex: 'innerMoney',
          customRender: text => {
            const resultText = text || 0
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          width:90,
          ellipsis: true,
          title: '成本支出',
          align: 'center',
          dataIndex: 'costSum',
          customRender: text => {
            const resultText = text || 0
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          width:90,
          ellipsis: true,
          title: '结算金额',
          align: 'center',
          dataIndex: 'sumSettle',
          customRender: text => {
            const resultText = text || 0
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          ellipsis: true,
          title: '结算日期',
          align: 'center',
          dataIndex: 'createTime',
          customRender: text => {
            const resultText = text ? text.substring(0, 10) : '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width:350,
          align: 'center',
          scopedSlots: { customRender: 'action' },
        }
      ],
      dataSource: [],
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
        total: 0,
        size:'small'
      },

    }
  },
  created() {
    httpAction(`/hrBase/sysdictbusinesstypehr/getSysDictBusinessTypeList`,null,'get').then(res=>{
      if(res.code === 200) {
        this.allTypeList = res.data
      }
    })
    initDictOptions('Tax_Type').then(res => {
      if (res.code === 200) {
        this.taxTypeDicts = res.data
      }
    })
    initDictOptions('MATCHING_LIMIT').then((res) => {
      if (Number(res.code) === 200) {
        if (res.data.length > 0) {
          this.matchingLimit = res.data[0].label  // 默认取第一个
        }
      }
    })
    // 结算主体和所属单位
    httpAction('hrBase/tsettledomain/selectAllUnitDeptVo',null,'get').then((res) => {
        if (Number(res.code) === 200) {
          this.settleDomainOptions = res.data
        } else {
          this.$message.error('结算主体和所属单位数据请求失败！')
        }
      })
    // getAllSettleDomainSelectVos().then((res) => {
    //   if (Number(res.code) === 200) {
    //     this.settleDomainOptions = res.data
    //   } else {
    //     this.$message.error('结算主体和所属单位数据请求失败！')
    //   }
    // })
  },
  
  methods: {
    getMultiName,
    getNameFromArr,
    edit(record){
      this.model = record;
      this.serverItem = record.settleDomain.serverItem.split(',');
      this.visible = true;
      this.ipagination.current = 1;
      this.getList();
    },
    getList(){
      httpAction(`/hrOneTime/tnewsettle/getTMainAndBillVoPage?settleDomainId=${this.model.settleDomain.id}&current=${this.ipagination.current}&size=${this.ipagination.pageSize}`,null,'get').then(res=>{
        if(res.code === 200){
          if (res.data && res.data.records && res.data.records.length > 0){
            this.dataSource = res.data.records
            this.ipagination.total = res.data.total
          }else{
            this.dataSource = []
            this.ipagination.total = 0
          }
        }
      })
    },
    handleTableChange(pagination) {
      //分页触发
      this.ipagination = pagination
      this.getList()
    },
    relateInvoice(record){
      this.$refs.InvoiceInfoFrom.show(record,1)
    },
    matchingIncome(record){
      this.$refs.MatchInAccountOfStatementForm.title = '认领记录匹配'
      this.$refs.MatchInAccountOfStatementForm.settleDomainSelected = {
        customerName:record.customerName,
        departName:record.departName,
        sumSettle:record.sumSettle,
        income:record.income,
        costSum:record.costSum,
        taxAmount:record.taxAmount,
        settleDate:record.settleDate,
        formType:3,
        settleDomainId:record.settleDomainId,
        id:record.billId,
        matchStatus:record.matchStatus
      }
      this.$refs.MatchInAccountOfStatementForm.formTypeOptions = {'2': '纯收入', '3': '事务性外包'}
      this.$refs.MatchInAccountOfStatementForm.statusOptions = {'0': {'option': '正常', 'color': 'green'}, '1': {'option': '撤销', 'color': 'red'}}
      this.$refs.MatchInAccountOfStatementForm.statusOutOptions = {'0': {'option': '未出账', 'color': 'blue'}, '1': {'option': '部分出账', 'color': 'pink'}, '2': {'option': '全部出账', 'color': 'green'}}
      this.$refs.MatchInAccountOfStatementForm.statusIncomeOptions = {'0': {'option': '未收入', 'color': 'blue'}, '1': {'option': '部分收入', 'color': 'pink'}, '2': {'option': '全部收入', 'color': 'green'}}
      this.$refs.MatchInAccountOfStatementForm.settleDomainOptions = this.settleDomainOptions // 结算主体
      this.$refs.MatchInAccountOfStatementForm.matchingLimit = this.matchingLimit // 出账限额
      this.$refs.MatchInAccountOfStatementForm.formTypeStatus = 3 // 结算类型是否已经选择【2为纯收入，3为事务性外包】
      httpAction(`/hrOneTime/tsettlebill/getMatchingClaimIdByBill?id=${record.billId}`, null, 'GET').then((res) => {
        if(res.code === 200){
          let handleData = null
          if (res.data && res.data.length > 0) { // 事务性外包单独处理数据类型
            handleData = []
            for (const item of res.data) {
              handleData.push({matchId: record.id, matchingAmount: item.ontTimeMatchAmount, recordId: item.id})
            }
          }
          this.$refs.MatchInAccountOfStatementForm.alreadyMatched = (handleData ? handleData : res.data)  // 已经匹配的认领记录列表
          this.$refs.MatchInAccountOfStatementForm.add()
          this.$refs.MatchInAccountOfStatementForm.loadData(1)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleSubmit(record){
      this.$refs.SettlementSubmitForm.showModal({id:record.id},'post','/hrOneTime/tnewsettle/submitTNewSettleVo','1')
    },
    handleEdit(record){
      httpAction(`/hrOneTime/tnewsettle/getTNewSettleVo?businessMainId=${record.id}`,null,'post').then(res=>{
        if(res.code === 200){
          if(record.innerMoney){
            this.$refs.InternalCounterForm.edit(res.data,this.model)
          }else{
            this.$refs.SettlementDocumentForm.edit(res.data,record.id)
          }
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleDelete(record){
      httpAction(`/hrOneTime/tnewsettle/deleteTNewSettleVo?businessMainId=${record.id}`,null,'post').then(res=>{
        if(res.code === 200){
          this.$message.success('删除成功！')
          this.getList()
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleDetail(record){
      console.log(record);
      httpAction(`/hrOneTime/tnewsettle/getTNewSettleVo?businessMainId=${record.id}`,null,'post').then(res=>{
        if(res.code === 200){
          const type = res.data.bill.wxNo ? 1 : 0
          this.$refs.SettlementDocumentDetailForm.show(type,res.data)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    async handleSettle(){
      this.$refs.SettlementDocumentForm.bill.tax = this.model.departSettlementInfo.taxFee;
      this.$refs.SettlementDocumentForm.bill.taxType = this.model.departSettlementInfo.taxType;
      const res = await httpAction(`/salary/tprojectreimbursedetail/getCostAndProjectVo?deptNo=${this.model.settleDomain.departNo}`,null,'get');
      if(res.code === 200){
        this.$refs.SettlementDocumentForm.add(res.data);
      }else{
        this.$message.warning(res.msg);
      }
    },
    handleInnerSettle(){
      this.$refs.InternalCounterForm.show(this.model)
    },
    submitOk(){
      this.handleCancel()
      this.$emit('ok')
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.visible = false
      this.dataSource = []
      this.model = {
        settleDomain: {},
        departSettlementInfo: {}
      }
    },
  }
}


</script>

<style lang="less" scoped>
  .btnRight{
    float: right;
    margin-right: 10px;
  }
  .tableTit{
    font-size: 17px;
    color: #000000d9;
  }
  
  /deep/ .ant-descriptions-item-label{
    width:100px !important;
  }
  /deep/ .ant-descriptions-item-content{
    width:340px !important;
  }
</style>




