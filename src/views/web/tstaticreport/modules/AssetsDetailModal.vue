
<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="800"
    @ok="handleCancel"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <div class="oprate">
      <span>未关联固资</span>{{ totalMoney }}元
    </div>
    <a-table :columns="columns" :data-source="dataSource" :pagination="false"></a-table>
  </a-modal>
</template>


<script>

export default {
  name: 'TransferBatchModal',
  components: {
    
  },
  data(){
    return {
      title: '固资明细-批量',
      visible: false,
      confirmLoading: false,
      statusOptions:['未关联','结算中','已结算','划转完结'],
      columns:[
        {
          title: '报销单编号',
          dataIndex: 'reimburseFormCode',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '固资类型',
          dataIndex: 'feeDesc',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '结算月份',
          dataIndex: 'installmentMonth',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '结算金额',
          dataIndex: 'settleFee',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: text => {
            const res =this.statusOptions[text]
            return <a-tooltip title={res}>{res}</a-tooltip>
          }
        },
      ],
      dataSource: [],
      totalMoney: 0,
    }
  },
  methods:{
    show(money,list){
      this.totalMoney = money
      console.log(list);
      const data = []
      list.map(item=>{
        if(/固资/.test(item.feeDesc)){
          data.push(item) 
        }
      })
      this.dataSource = data
      this.visible = true;
    },
    handleCancel(){
      this.visible = false;
      this.totalMoney = 0;
      this.dataSource = [];
    },
  }

}
</script>
<style lang="less" scoped>
.oprate{
  margin-bottom: 15px;
  color: #333;
  span{
    margin-right: 100px;
  }
}
</style>
