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
      >保存</a-button>
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
      <a-card
        style="margin-top: 24px"
        :bordered="true"
        title="业务收入"
      >
        <detail-list>
          <detail-list-item term="业务收入">{{ settleBillVo.income }}</detail-list-item>
          <!--<detail-list-item term="关联合同">{{ data[0].tax }}</detail-list-item>-->
          <detail-list-item term="税金">{{ settleBillVo.taxAmount }}</detail-list-item>
          <detail-list-item term="开票金额">{{ settleBillVo.ticketAmount }}</detail-list-item>
        </detail-list>
      </a-card>

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
          >添加</a-button>
          <a-table
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="data"
            :pagination="false"
          >
            <template
              v-for="col in ['incomeBelong', 'devidedProp', 'incomeAmount']"
              :slot="col"
              slot-scope="text, record, index"
            >
              <div
                :key="col"
                v-if="col != 'incomeBelong'"
              >
                <a-input
                  v-if="record.editable"
                  style="margin: -5px 0"
                  :value="text"
                  :disabled="(col=='devidedProp') ? true : false"
                  @change="e => handleChange(e.target.value, record.key, col,index)"
                />
                <template v-else>{{ text }}</template>
              </div>

              <div
                :key="col"
                v-if="col == 'incomeBelong'"
              >
                <a-select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择收入归属"
                  v-if="record.editable"
                  style="margin: -5px 0;width: 360px;"
                  :value="filterOrganDict1(organs, text)"
                  @select="incomeBelongSelect(col,index)"
                  @change="incomeBelongChange"
                >
                  <a-select-option
                    v-for="item in organs"
                    :key="item.id"
                  >{{ item.organName }}</a-select-option>
                </a-select>
                <template v-else>{{ filterOrganDict1(organs, text) }}</template>
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
                <span v-else>
                  <a @click="() => editTable(record.key,index)">修改</a>
                  <a-divider type="vertical" />
                  <a @click="() => addConstingPayment(index)">成本支出</a>
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

    <costing-payment-module
      ref="costingPaymentModal"
      @ok="costingPaymentModalOk"
    ></costing-payment-module>
  </a-modal>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import PageLayout from '@/components/page/PageLayout'
import DetailList from '@/components/tools/DetailList'
import { httpAction } from '../../../../api/manage'
import { filterOrganDict1 } from '@/utils/customDict'
import CostingPaymentModule from './CostingPaymentModule'

const DetailListItem = DetailList.Item

const columns = [
    {
      title: '收入归属',
      width: '49%',
      align: 'center',
      dataIndex: 'incomeBelong',
      scopedSlots: { customRender: 'incomeBelong' },
    },
    {
      title: '分成比例[%]',
      width: '14%',
      align: 'center',
      dataIndex: 'devidedProp',
      scopedSlots: { customRender: 'devidedProp' },
    },
    {
      title: '分成金额',
      width: '12%',
      align: 'center',
      dataIndex: 'incomeAmount',
      scopedSlots: { customRender: 'incomeAmount' },
    },
    {
      title: '操作',
      width: '25%',
      align: 'center',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    },
  ];

const data = [{}];

export default {
  name: "IncomeBelongModule",
  components: {
    CostingPaymentModule,
    PageLayout,
    DetailList,
    DetailListItem,
  },
  props: {
    rowKey: {
      type: String,
      default: ''
    },
  },
  mixins: [mixinDevice],
  data () {
    return {
      title: '详细',
      visible: false,
      model: {},
      settleBillVo: {},
      incomeBelongBill: {},
      sysUsers: [],
      organs: [],
      confirmLoading: false,
      currentKey: "",
      currentIndex: 0,
      tabList: [
        {
          key: '1',
          tab: '收入归属'
        },
      ],
      columns,
      data,
      cacheData: [],
      cellDisabled: false,
      activeTabKey: '1',
      url: {
        getCustomerInfo: '/hrBase/tcustomerinfo/vo/',
        batchDeleteBusinessIncomes: '/hrOneTime/tsettlebillinner/',
        getTSettleBill: '/hrOneTime/tbusinessoutsourcingmain/',
        saveSettleBill: '/hrOneTime/tsettlebillinner',
        // getIncomeBelongBill: '/hrOneTime/tsettlebillinner/getTSettleBillInnerVoByMainId/',//查询收入分成账单
        getIncomeBelongBill: '/hrOneTime/tsettlebillinner/getTSettleBillInnerVoByMainId/',//查询收入分成账单
      },
    }
  },
  methods: {
    filterOrganDict1,
    edit(record) {
      this.model = Object.assign({}, record)
      for(let i = 0; i < this.sysUsers.length; i++) {
        if(this.model.businessPersion == this.sysUsers[i].userId) {
          this.model.businessPersion = this.sysUsers[i].nickname;
        }
        if(this.model.customerService == this.sysUsers[i].userId) {
          this.model.customerService = this.sysUsers[i].nickname;
        }
      }
      this.getIncomeBelongBill();
      this.visible = true;
    },
    handleOk() {
      if (this.data.length <= 0) {
        this.$message.warning('“收入归属”表单数据不能为空！')
        return false
      }

      const pattern = /((^[1-9]\d*)|^0)(\.\d{1,2})?$/
      let incomeAmountSum = 0

      for (const item of this.data) {
        if (item.incomeBelong <= 0) {   // 数字验证
          this.$message.warning('请选择“收入归属”！')
          return false
        }
        if (item.devidedProp <= 0) {   // 数字验证
          this.$message.warning('“分成比例”验证未通过！')
          return false
        }
        if (item.incomeAmount <= 0 || !new RegExp(pattern).test(item.incomeAmount)) {   // 数字验证
          this.$message.warning('“分成金额”请输入两位有效数字！')
          return false
        }
        for (const it of item.costingPaymentIncomes) {
          if (it.name === '') {
            this.$message.warning('“成本支出-支出名目”不能为空！')
            return false
          }
          if (it.amount <= 0 || !new RegExp(pattern).test(it.amount)) {   // 数字验证
            this.$message.warning('“成本支出-支出金额（不含税）”请输入两位有效数字！')
            return false
          }
        }
        incomeAmountSum += item.incomeAmount * 1
      }
      if (parseFloat(this.settleBillVo.income) !== parseFloat(this.formatFloat(incomeAmountSum))) {
        this.$message.warning('“分成金额”总和不等于业务收入！')
        return false
      }
      this.confirmLoading = true;
      let method = '';
      let msg = '';
      let formData = new Object();
      if(!this.settleBillVo.id){
        formData.id = null;
        method = 'post';
        msg = '添加成功!';
      }else{
        formData.id = this.settleBillVo.id;
        method = 'put';
        msg = '修改成功!';
      }
      formData.businessOutSourcingId = this.model.id;
      formData.income = this.settleBillVo.income;
      formData.taxAmount = this.settleBillVo.taxAmount;
      formData.ticketAmount = this.settleBillVo.ticketAmount;
      formData.incomeBelongVos = this.data;
      httpAction(this.url.saveSettleBill,formData,method).then((res) => {
        if(Number(res.code) === 200){
          this.$message.success(msg);
          this.$emit('ok');
          this.close()
        }else{
          this.$message.warning(res.msg || res.message);
        }
      }).finally(() => {
        this.confirmLoading = false;
      })
    },
    handleCancel() {
      this.close()
    },
    editTable(key,index) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[index];
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    addConstingPayment(index) {
      let costingPaymentIncomes = this.data[index].costingPaymentIncomes;
      this.$refs.costingPaymentModal.title = '成本支出';
      if(!costingPaymentIncomes) {
        costingPaymentIncomes = [];
      }
      this.$refs.costingPaymentModal.show(index,costingPaymentIncomes);
    },
    costingPaymentModalOk() {
      this.data[this.$refs.costingPaymentModal.rowIndex].costingPaymentIncomes =  this.$refs.costingPaymentModal.costingData;
    },
    incomeBelongChange(v) {
      const that = this
      setTimeout(function () {  // 延迟执行
        const newData = [...that.data];
        newData[that.currentIndex].incomeBelong = v;
        that.data = newData;
      }, 500)
    },
    incomeBelongSelect(c,i) {
      this.currentKey = c;
      this.currentIndex = i;
    },
    handleChange(value, key, column,index) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[index];
      if (target) {
        if(column == 'devidedProp') {
          if (new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) {   // 数字验证(0,1]两位小数
            newData[index].incomeAmount = parseFloat(this.settleBillVo.income).toFixed(2) * (parseFloat(value)) / 100;
          } else {
            this.$message.warning('0-100内两位有效数字！')
          }
          target[column] = value;
        }
        if(String(column) === 'incomeAmount') {
          if (new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) {   // 数字验证
            newData[index].devidedProp = this.formatFloat(((value * 1) / (this.settleBillVo.income * 1)) * 100)
          } else {
            //this.$message.warning('请输入两位有效数字！')
          }
          target[column] = value;
        }
        this.data = newData;
      }
    },
    saveTable(key,index) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[index];
      if (target) {
        delete target.editable;
        this.data = newData;
        this.cacheData = newData.map(item => ({ ...item }));
      }
    },
    getIncomeBelongBill() {
      this.data = [];
      httpAction(this.url.getIncomeBelongBill + this.model.id,null,'GET').then((res) => {
        if(res.data != null) {
          this.settleBillVo = res.data;
          if(res.data.incomeBelongVos != null) {
            this.data = res.data.incomeBelongVos;
            this.cacheData = res.data.incomeBelongVos;
          }
        }
      });
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.confirmLoading = false
    },
    handleAdd() {
      const newData = {
        id: (new Date().getTime() + Math.floor(Math.random() * (10000 - 1))),
        devidedProp: 0,
        incomeAmount: 0,
        incomeBelong: 0,
        innerBillId: this.settleBillVo.id,
        costingPaymentIncomes: [],
      };
      this.data.push(newData);
    },
    handleCostingDelete (key,index) {
      this.data.splice(index, 1)
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
.ant-modal_detail {
  margin-top: 65px;
}
</style>
