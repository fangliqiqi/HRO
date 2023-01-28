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
      <a-table
        bordered
        rowKey="id"
        :columns="costingColumns"
        :dataSource="costingData"
        :pagination="false"
      ></a-table>
    </div>
  </a-modal>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'

const costingData = [];
const costingColumns = []

export default {
  name: 'CostingPaymentDetailModule',
  props: {
    rowKeyTwo: {
      type: String,
      default: ''
    },
  },
  mixins: [mixinDevice],
  data() {
    return {
      title: '成本明细',
      visible: false,
      costingData,
      costingColumns,
    }
  },
  methods: {
    show() {
      this.visible = true;
    },
    handleCancel() {
      this.close();
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