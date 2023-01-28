<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    style="top: 20px;"
    class="ant-modal_detail"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
      <a-button
        key="audit"
        type="primary"
        :loading="confirmLoading"
        @click="handleOk"
      >保存并生成结算单</a-button>
    </template>

    <page-layout
      :title="model.businessName"
      logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png"
    >

      <a-card
        style="margin-top: 24px"
        :bordered="false"
        title="基本信息"
      >
        <detail-list :col="2">
          <detail-list-item term="客户单位">{{ model.customerName ? model.customerName : '-' }}</detail-list-item>
          <detail-list-item term="关联合同">{{ model.unitContractId ? model.unitContractId : '-' }}</detail-list-item>
          <detail-list-item term="结算主体">{{ model.departName ? model.departName : '-' }}</detail-list-item>
          <detail-list-item term="服务项目">
            <a-tag
              v-for="item in model.moutsourcingItemVos"
              :key="item.id"
            >{{ item.itemName }}</a-tag>
          </detail-list-item>
          <detail-list-item term="业务对接人">{{ model.dockingPerson ? model.dockingPerson : '-' }}</detail-list-item>
          <detail-list-item term="业务创建日期">{{ model.createTime ? model.createTime : '-' }}</detail-list-item>
        </detail-list>
        <detail-list :col="2">
          <detail-list-item term="对接人联系方式">{{ model.dockingPhone ? model.dockingPhone : '-' }}</detail-list-item>
          <detail-list-item term="业务开发人">{{ model.businessPersion ? model.businessPersion : '-' }}</detail-list-item>
          <detail-list-item term="服务客服">{{ model.customerService ? model.customerService : '-' }}</detail-list-item>
          <detail-list-item term="备注">{{ model.remark ? model.remark : '-' }}</detail-list-item>
        </detail-list>
      </a-card>
      <!-- actions -->
      <!-- <template slot="action">
        <a-button-group style="margin-right: 4px;">
          <a-button>操作</a-button>
          <a-button>操作</a-button>
          <a-button>
            <a-icon type="ellipsis" />
          </a-button>
        </a-button-group>
        <a-button type="primary">主操作</a-button>
      </template> -->

      <!-- 操作 -->
      <a-card
        :loading="confirmLoading"
        style="margin-top: 24px"
        :bordered="false"
        :tabList="tabList"
        :activeTabKey="activeTabKey"
        @tabChange="(key) => {this.activeTabKey = key}"
      >
        <div v-if="activeTabKey === '1'">
          <a-button
            type="primary"
            class="editable-add-btn"
            style="margin-bottom: 5px;"
            @click="handleAdd"
            v-if="this.data.length<1"
          >添加</a-button>
          <a-table
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="data"
            :pagination="false"
          >
            <template
              v-for="col in ['income','tax', 'taxAmount','ticketAmount']"
              :slot="col"
              slot-scope="text, record, index"
            >
              <div :key="col">
                <a-tooltip
                  placement="top"
                  v-if="col != 'includeTaxFlag'"
                  title="请输入两位有效数字！"
                >
                  <a-input
                    style="margin: -5px 0"
                    :value="text"
                    :disabled="!record.editable || col=='tax' || (col=='taxAmount' && (settleDomainInfo.departSettlementInfo.taxType != '117' && settleDomainInfo.departSettlementInfo.taxType != '118')) || col=='income'"
                    @change="e => handleChange(e.target.value, record.key, col,index)"
                  />
                </a-tooltip>
              </div>
            </template>
            <template
              slot="operation"
              slot-scope="text, record, index"
            >
              <div class="editable-row-operations">
                <span v-if="record.editable">
                  <a @click="() => saveTable(record.key,index)">确定</a>
                </span>
                <span v-else><a @click="() => editTable(record.key,index)">修改</a></span>
              </div>
            </template>
          </a-table>
        </div>

        <div v-if="activeTabKey === '2'">
          <a-button
            type="primary"
            class="editable-add-btn"
            style="margin-bottom: 5px;"
            @click="handleCostingAdd"
          >添加</a-button>
          <a-table
            bordered
            rowKey="id"
            :columns="costingColumns"
            :dataSource="costingData"
            :pagination="false"
          >
            <template
              v-for="col in ['name', 'amount']"
              :slot="col"
              slot-scope="text, record, index"
            >
              <div :key="col">
                <a-tooltip
                  placement="top"
                  v-if="record.editable && col=='amount'"
                  title="请输入两位有效数字！"
                >
                  <a-input
                    style="margin: -5px 0"
                    :value="text"
                    @change="e => handleCostingChange(e.target.value, record.key, col,index)"
                  />
                </a-tooltip>
                <a-input
                  style="margin: -5px 0"
                  v-else-if="record.editable && col!='amount'"
                  :value="text"
                  @change="e => handleCostingChange(e.target.value, record.key, col,index)"
                />
                <template v-else>{{ text }}</template>
              </div>
            </template>
            <template
              slot="operation"
              slot-scope="text, record, index"
            >
              <div class="editable-row-operations">
                <span v-if="record.editable">
                  <a @click="() => saveCostingTable(record.key,index)">确定</a>
                </span>
                <span v-else>
                  <a @click="() => editCostingTable(record.key,index)">修改</a>
                  <a-divider type="vertical" />
                  <a-popconfirm
                    title="确定删除吗?"
                    @confirm="() => handleCostingDelete(record.key,index)"
                  >
                    <a>删除</a>
                  </a-popconfirm>
                </span>
              </div>
            </template>
          </a-table>
        </div>
      </a-card>
    </page-layout>
    <settle-bill-preview ref="settleBillPreview" @ok="handleCancel"></settle-bill-preview>
  </a-modal>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import PageLayout from '@/components/page/PageLayout'
import DetailList from '@/components/tools/DetailList'
import { httpAction } from '../../../../api/manage'
import { getNowFormatDate } from '@/utils/dateutil'
import SettleBillPreview from './SettleBillPreview'

const DetailListItem = DetailList.Item

const columns = [
    {
      key: 'income',
      title: '结算金额',
      width: '20%',
      align: 'center',
      dataIndex: 'income',
      scopedSlots: { customRender: 'income' },
    },
    {
      key: 'tax',
      title: '税率[%]',
      width: '12%',
      align: 'center',
      dataIndex: 'tax',
      scopedSlots: { customRender: 'tax' },
    },
    {
      key: 'taxAmount',
      title: '税金',
      width: '15%',
      align: 'center',
      dataIndex: 'taxAmount',
      scopedSlots: { customRender: 'taxAmount' },
    },
    {
      key: 'ticketAmount',
      title: '开票金额',
      width: '15%',
      align: 'center',
      dataIndex: 'ticketAmount',
      scopedSlots: { customRender: 'ticketAmount' },
    },
    {
      key: 'operation',
      title: '操作',
      width: '20%',
      align: 'center',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    },
  ];

const data = [];
const costingData = [];
const sumData = [
  {
    index:'合计',
    sumIncome:'',
    sumIncludeTaxFlag:'',
    sumTax:'',
    sumTaxAmount:'',
    sumTicketAmount:'',
    sumOperation:'',
  }
];
const sumColumns = [
  {
    key: 'index',
    title: '合计',
    width: '8%',
    align: 'center',
    dataIndex: 'index',
  },
  {
    key: 'sumIncome',
    title: '结算金额',
    width: '20%',
    align: 'center',
    dataIndex: 'sumIncome',
  },
  {
    key: 'sumIncludeTaxFlag',
    title: '是否含税',
    width: '13%',
    align: 'center',
    dataIndex: 'sumIncludeTaxFlag',
  },
  {
    key: 'sumTax',
    title: '税率[%]',
    width: '12%',
    align: 'center',
    dataIndex: 'sumTax',
  },
  {
    key: 'sumTaxAmount',
    title: '税金',
    width: '15%',
    align: 'center',
    dataIndex: 'sumTaxAmount',
  },
  {
    key: 'sumTicketAmount',
    title: '开票金额',
    width: '15%',
    align: 'center',
    dataIndex: 'sumTicketAmount',
  },
  {
    key: 'sumOperation',
    title: '操作',
    width: '20%',
    align: 'center',
    dataIndex: 'sumOperation',
  }
]
const costingColumns = [
  {
    key: 'name',
    title: '支出名目',
    width: '30%',
    align: 'center',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  },
  {
    key: 'amount',
    title: '支出金额（不含税）',
    width: '30%',
    align: 'center',
    dataIndex: 'amount',
    scopedSlots: { customRender: 'amount' },
  },
  {
    key: 'operation',
    title: '操作',
    width: '20%',
    align: 'center',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
]

export default {
  name: "InnerSettleBillModule",
  components: {
    SettleBillPreview,
    PageLayout,
    DetailList,
    DetailListItem,
  },
  props: {
    rowKey: {
      type: String,
      default: ''
    },
    rowKeyTwo: {
      type: String,
      default: ''
    },
  },
  mixins: [mixinDevice],
  data () {
    this.cacheData = data.map(item => ({ ...item }));
    this.cacheConstingData = costingData.map(item => ({ ...item }));
    return {
      title: '详细',
      visible: false,
      treeData:[],
      industryBelongs:[],
      industrySub:[],
      model: {},
      settleDomainInfo: {},
      unitContracts: [],
      customerContractList: [],
      contractTypeDicts: [],
      businessTypeDicts: [],
      businessSubDicts: [],
      settleBillVo: {},
      organs: [],
      sysUsers: [],
      confirmLoading: false,
      tabList: [{key: '1', tab: '结算金额'},{key: '2', tab: '成本支出'}],
      columns,
      data,
      costingColumns,
      costingData,
      sumColumns,
      sumData,
      cellDisabled: false,
      activeTabKey: '1',
      url: {
        getCustomerInfo: '/hrBase/tcustomerinfo/vo/',
        batchDeleteBusinessIncomes: '/hrOneTime/tsettlebillinner/',
        getTSettleBill: '/hrOneTime/tbusinessoutsourcingmain/',
        saveSettleBill: '/hrOneTime/tsettlebill',
      },
    }
  },

  methods: {
    edit(record) {
      this.model = Object.assign({}, record)
      for(let i = 0; i < this.sysUsers.length; i++) {
        if(String(this.model.businessPersion) === String(this.sysUsers[i].userId)) {
          this.model.businessPersion = this.sysUsers[i].nickname;
        }
        if(String(this.model.customerService) === String(this.sysUsers[i].userId)) {
          this.model.customerService = this.sysUsers[i].nickname;
        }
      }
      this.getSettleBill();
      this.visible = true;
    },

    handleAdd() {      
      this.data.push({
        id : (new Date().getTime() + Math.floor(Math.random() * (10000 - 1))),
        income : 0,
        tax : (this.settleDomainInfo.departSettlementInfo.taxFee ? this.settleDomainInfo.departSettlementInfo.taxFee : 0),
        taxAmount : 0,
        ticketAmount : 0,
        includeTaxFlag:0
      })
    },

    handleOk() {
      const reqCostingData = []
      let submit = false
      const pattern = /((^[1-9]\d*)|^0)(\.\d{1,2})?$/
      if (this.data.length === 0) {
        this.$message.warning('请添加“结算金额”！')
        return
      }
      for(const item of this.data){
        if (item.income <= 0 || !new RegExp(pattern).test(item.income)) {   // 数字验证
          this.$message.warning('“结算金额”必须大于零！')
          return false
        }
        if (!new RegExp(pattern).test(item.taxAmount)) {   // 数字验证
          this.$message.warning('“税金”请输入两位有效数字！')
          return false
        }
        if (!new RegExp(pattern).test(item.ticketAmount)) {   // 数字验证
          this.$message.warning('“开票金额”请输入两位有效数字！')
          return false
        }
      }
      const costingSum = {amount:0,taxAmount:0}
      for (const item of this.costingData) {
        if (String(item.name) === '') {
          this.$message.warning('“支出名目”不能为空！')
          return false
        }
        if (item.amount <= 0 || !new RegExp(pattern).test(item.amount)) {   // 数字验证
          this.$message.warning('“支出金额（不含税）”请输入两位有效数字！')
          return false
        }
        const tempItem = {}
        tempItem.name = item.name
        tempItem.amount = item.amount
        tempItem.taxAmount = (String(this.settleDomainInfo.departSettlementInfo.taxType) === '117' || String(this.settleDomainInfo.departSettlementInfo.taxType) === '118') ?
        0 : this.formatFloat(item.amount*this.settleDomainInfo.departSettlementInfo.taxFee/100)
        costingSum.amount = this.formatFloat(item.amount*1+costingSum.amount*1)
        costingSum.taxAmount = this.formatFloat(tempItem.taxAmount*1+costingSum.taxAmount*1)
        if (item.billId && item.billId.length >= 19) {
          tempItem.billId = item.billId
        }
        if (item.id && item.id.length >= 19) {
          tempItem.id = item.id
        }
        reqCostingData.push(tempItem)
      }
      const reqData = this.data.map(item=>{
        return {
          income:item.income,
          taxAmount:item.taxAmount,
          ticketAmount:item.ticketAmount,
          includeTaxFlag:item.includeTaxFlag,
        }
      })
      submit = true
      if (submit) {
        this.confirmLoading = true;
        let method = '';
        let msg = '';
        if(!this.settleBillVo.id){
          method = 'post';
          msg = '添加成功!';
        }else{
          method = 'put';
          msg = '修改成功!';
        }
        let formData = new Object();
        formData.businessOutSourcingId = this.model.id
        formData.costingPayments = reqCostingData
        formData.sumTax = reqData[0].taxAmount
        formData.sumSettle = reqData[0].ticketAmount
        formData.income = this.formatFloat(formData.sumSettle*1-formData.sumTax*1-costingSum.amount*1)
        if(String(this.settleDomainInfo.departSettlementInfo.taxType) === '117' || String(this.settleDomainInfo.departSettlementInfo.taxType) === '118'){
          formData.taxAmount = this.formatFloat(formData.sumTax*1-costingSum.taxAmount*1)
        }else{
          formData.taxAmount = this.formatFloat(formData.income*this.settleDomainInfo.departSettlementInfo.taxFee/100)
        }

        formData.ticketAmount = this.formatFloat(formData.income*1+formData.taxAmount*1)
        reqData[0]['includeTaxFlag'] = (formData.taxAmount>0) ? 0 : 1
        formData.settleIncomeOthers = [{
          income:formData.income,taxAmount:formData.taxAmount,
          ticketAmount:formData.ticketAmount,includeTaxFlag:reqData[0]['includeTaxFlag']
        }]
        if((`${this.settleBillVo.id} `).length < 19) {  // 添加的时候
          formData.settleDate = getNowFormatDate();
        } else {
          formData.id = this.settleBillVo.id;
          formData.settleDate = this.settleBillVo.settleDate;
        }

        httpAction(this.url.saveSettleBill,formData,method).then((res) => {
          if(Number(res.code) === 200){
            this.$message.success(msg);
            // this.$emit('ok');
            httpAction(this.url.getTSettleBill + this.model.id,null,'GET').then((res) => {
              if(res.data.settleBillVo != null) {
                let flag = false
                if(String(this.settleDomainInfo.departSettlementInfo.taxType) === '117' || String(this.settleDomainInfo.departSettlementInfo.taxType) === '118'){
                  flag = true
                }
                this.$refs.settleBillPreview.show(res.data,this.model,flag);
              }
            });
          }else{
            this.$message.warning(res.msg || res.message);
          }
        }).finally(() => {
          this.confirmLoading = false;
        })
      }
    },

    settleBillPreview() {
      if(this.settleBillVo.id) {
        this.$refs.settleBillPreview.show();
      } else {
        this.$message.error('请先保存结算信息!');
      }
    },

    handleCancel() {
      this.$emit('ok')
      this.sumData = []
      this.close()
    },

    handleFooterShow(){
      return (
        <a-config-provider renderEmpty={()=>'无合计数据'}>
          <a-table
            rowKey={Math.random}
            bordered={false}
            pagination={false}
            columns={this.sumColumns}
            dataSource={this.sumData}
            showHeader={false}
            locale={{emptyText:null}}
          ></a-table>
        </a-config-provider>
      )
    },

    editTable(key,index) {
      const newData = [...this.data];
      const target = newData.filter(item => String(key) === String(item.key))[index];
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },

    deleteTable(key,i){
      this.data.splice(i,1)
      this.sumOprate()
    },

    taxChange(index,event){
      const includeTaxFlag = (event) ? 0 : 1
      if(includeTaxFlag === 1){
        // 不含税 taxAmount=0 ticketAmount = income
        this.$set(this.data[index],'taxAmount',0)
        this.$set(this.data[index],'ticketAmount',this.data[index]['income'])
      }else{
        // 含税 taxAmount=income*tax/100 ticketAmount=income+taxAmount
        const taxAmount = parseFloat(this.data[index]['income']).toFixed(2) * ((parseFloat(this.data[index]['tax']).toFixed(4)) / 100).toFixed(4)
        const ticketAmount = (parseFloat(taxAmount) + parseFloat(this.data[index]['income'])).toFixed(2)
        this.$set(this.data[index],'taxAmount',taxAmount.toFixed(2))
        this.$set(this.data[index],'ticketAmount',ticketAmount.toFixed(2))
      }
      this.$set(this.data[index],'includeTaxFlag',includeTaxFlag)
      this.sumOprate()
    },

    handleChange(value, key, column,index) {
      this.$set(this.data[index],column,value)
      // eslint-disable-next-line
      const target = _.cloneDeep(this.data[index])
      if (value !== '') {
        if (new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) {   // 数字验证
          if(column === 'ticketAmount') {
            if(String(this.data[index].includeTaxFlag) === '0'){ // 含税
              target.taxAmount = this.formatFloat(value * (target.tax/100) / (1+(target.tax/100)))
            }else{ // 不含税
              target.taxAmount = 0
              target.ticketAmount = this.formatFloat(value * 1)
            }
            target.income = this.formatFloat(value * 1 - target.taxAmount)
            this.$set(this.data[index],'taxAmount',target.taxAmount)
            this.$set(this.data[index],'ticketAmount',target.ticketAmount)
            this.$set(this.data[index],'income',target.income)
          }else if(column === 'taxAmount'){
            if(parseFloat(value) > parseFloat(target.ticketAmount)){
              this.$message.warning('税金不能大于开票金额！')
            }
            this.$set(this.data[index],'income',this.formatFloat(this.data[index]['ticketAmount']-this.data[index]['taxAmount']))
          }
        } else {
          this.$message.warning('请输入两位有效数字！')
        }
      }
      return false
    },

    sumOprate(){
      let [sumIncome,sumTaxAmount,sumTicketAmount] = [0,0,0]
      for(const item of this.costingData){
        sumIncome += parseFloat(item.amount)
        sumTaxAmount += parseFloat(item.taxAmount)
        sumTicketAmount += parseFloat(Number(item.amount)+Number(item.taxAmount))
      }
      this.sumData = [
        {
          index:'合计',
          sumIncome:this.formatFloat(sumIncome),
          sumIncludeTaxFlag:'',
          sumTax:'',
          sumTaxAmount:this.formatFloat(sumTaxAmount),
          sumTicketAmount:this.formatFloat(sumTicketAmount),
          sumOperation:'',
        }
      ]
    },
    saveTable(key,index) {
      const newData = [...this.data];
      const target = newData.filter(item => String(key) === String(item.key))[index];
      if (target) {
        delete target.editable;
        this.data = newData;
        this.cacheData = newData.map(item => ({ ...item }));
      }
    },
    getSettleBill() {
      this.data = [];
      this.costingData = [];
      this.settleBillVo = {};
      httpAction(this.url.getTSettleBill + this.model.id,null,'GET').then((res) => {
        if(res.data != null) {
          if (res.data.settleBillVo != null) {
            this.settleBillVo = res.data.settleBillVo;
            if (this.settleDomainInfo.departSettlementInfo) {
              this.settleBillVo.tax = this.settleDomainInfo.departSettlementInfo.taxFee
            }
            if(this.settleBillVo.settleIncomeOthers.length){
              this.data = [{
                income: this.formatFloat(this.settleBillVo.sumSettle-this.settleBillVo.sumTax),
                taxAmount: this.settleBillVo.sumTax,
                ticketAmount: this.settleBillVo.sumSettle,
                tax : (this.settleDomainInfo.departSettlementInfo.taxFee ? this.settleDomainInfo.departSettlementInfo.taxFee : 0),
                includeTaxFlag:(this.settleBillVo.taxAmount>0) ? 0 : 1
              }]
            }
            this.sumData = [{
              index:'合计',
              sumIncome:this.settleBillVo.income,
              sumIncludeTaxFlag:'',
              sumTax:'',
              sumTaxAmount:this.settleBillVo.taxAmount,
              sumTicketAmount:this.settleBillVo.ticketAmount,
              sumOperation:'',
            }]
            if (this.settleBillVo.costingPayments != null) {
              this.costingData = this.settleBillVo.costingPayments;
            }
          }
        }
      });
    },

    close() {
      this.visible = false
      this.activeTabKey = '1'
      this.confirmLoading = false
    },
    editCostingTable(key,index) {
      this.cellDisabled = true;
      const newData = [...this.costingData];
      const target = newData.filter(item => key === item.key)[index];
      if (target) {
        target.editable = true;
        this.costingData = newData;
      }
    },
    handleCostingChange(value, key, column,index) {
      const newData = [...this.costingData];
      const target = newData.filter(item => key === item.key)[index];
      if (target) {
        if (String(column) === 'amount') {
          if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) {
            // 数字验证
            //this.$message.warning('请输入两位有效数字！')
          }
        }
        target[column] = value
        this.costingData = newData;
      }
    },
    saveCostingTable(key,index) {
      const newData = [...this.costingData];
      const target = newData.filter(item => key === item.key)[index];
      if (target) {
        delete target.editable;
        this.costingData = newData;
        this.cacheConstingData = newData.map(item => ({ ...item }));
      }
    },
    handleCostingDelete(key,index) {
      this.costingData.splice(index,1)
    },
    handleCostingAdd() {
      if (this.data.length > 0) {
        let billId = null;
        if(this.data[0].id) {
          billId = this.data[0].id;
        }
        const newData = {
          id: (new Date().getTime() + Math.floor(Math.random() * (10000 - 1))),
          amount: 0,
          name: `-`,
          billId: billId,
          taxAmount: 0,
        };
        this.costingData.push(newData);
      } else {
        this.$message.error('请先添加结算金额!');
      }
    },
    // 精度处理
    formatFloat(f, digit = 2) {
      const m = Math.pow(10, digit)
      return Math.round(f * m) / m
    },
  }
}
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>

<style lang="less" scoped>
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

.ant-modal_detail {
  margin-top: 65px;
}
/deep/ .ant-table-footer {
  padding: 0px !important;
  border: none !important;
}
</style>
