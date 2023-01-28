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
    </template>

    <div>
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
              <!-- <a-popconfirm
                title="确定取消修改?"
                @confirm="() => cancelCostingTable(record.key,index)"
              >
                <a>取消</a>
              </a-popconfirm> -->
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
  </a-modal>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'

const costingData = [];
const costingColumns = [
  {
    title: '支出名目',
    dataIndex: 'name',
    width: '30%',
    align: 'center',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '支出金额（不含税）',
    dataIndex: 'amount',
    width: '30%',
    align: 'center',
    scopedSlots: { customRender: 'amount' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '20%',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
  },
]

export default {
  name: 'CostingPaymentModule',
  props: {
    rowKeyTwo: {
      type: String,
      default: ''
    },
  },
  mixins: [mixinDevice],
  data() {
    return {
      title: '详细',
      visible: false,
      costingData,
      costingColumns,
      rowIndex: -1,
    }
  },
  methods: {
    show(rowIndex,costingPaymentIncomes) {
      this.rowIndex = rowIndex;
      this.costingData = costingPaymentIncomes;
      this.visible = true;
    },
    handleCancel() {
      this.close();
    },
    handleCostingAdd() {
      let billId = null;
      if(this.costingData.length > 0 && this.costingData[0].id) {
        billId = this.costingData[0].id;
      }
      const newData = {
        id: (new Date().getTime() + Math.floor(Math.random() * (10000 - 1))),
        amount: 0,
        name: `-`,
        incomeBelongId: billId,
        taxAmount: 0,
      };
      this.costingData.push(newData);
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
        target[column] = value;
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
    cancelCostingTable(key,index) {
      const newData = [...this.costingData];
      const target = newData.filter(item => key === item.key)[index];
      if (target) {
        Object.assign(target, this.cacheConstingData.filter(item => key === item.key)[0]);
        delete target.editable;
        this.costingData = newData;
      }
    },
    handleCostingDelete(key,index) {
      this.costingData.splice(index,1)
    },
    editCostingTable(key,index) {
      const newData = [...this.costingData];
      const target = newData.filter(item => key === item.key)[index];
      if (target) {
        target.editable = true;
        this.costingData = newData;
      }
    },
    close() {
      this.$emit('ok')
      this.visible = false
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

// .mobile {
//   .detail-layout {
//     margin-left: unset;
//   }
//   .text {
//   }
//   .status-list {
//     text-align: left;
//   }
// }
.ant-modal_detail {
  margin-top: 65px;
}
</style>