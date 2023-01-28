<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="1100"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: 'radio'}"
      >
      </a-table>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'StandardSalartSettleBillList',
  data() {
    return {
      title: '',
      visible: false,
      selectedRowKeys: [],
      selectionRows: [],
      dataSource: [],
      columns: [
        {
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleDepartName'
        },
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'settleDepartNo'
        },
        {
          title: '结算金额合计',
          align: 'center',
          dataIndex: 'accountMoneySum'
        },
        {
          title: '开票金额合计',
          align: 'center',
          dataIndex: 'ticketMoneySum'
        },
        {
          title: '结算月份',
          align: 'center',
          dataIndex: 'settleMonth'
        },
      ],
    }
  },
  methods: {
    show(datas) {
      this.dataSource = [];
      if(datas != null && datas.length > 0) {
        this.dataSource = datas
        // for (let i of datas) {
        //   if(type == 0){
        //     this.dataSource.push(i.settlementhForm);
        //   }else if(type == 1){
        //     this.dataSource.push(i.engineerSettlementForm);
        //   }
        // }
      }
      this.visible = true;
    },
    handleOk() {
      if(this.selectedRowKeys.length == 0){
        this.$message.warning('请选择结算单')
        return false
      }
      this.$emit('ok')
      this.visible = false
    },
    handleCancel() {
      this.$emit('close')
      this.visible = false
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
  }
}
</script>

<style scoped>

</style>