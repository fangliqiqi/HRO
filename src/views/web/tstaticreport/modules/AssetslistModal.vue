
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
      <span>{{ feeDesc }}</span>{{ totalMoney.toFixed(2) }}元
    </div>
    <a-table :columns="columns" :data-source="dataSource" :pagination="false" :scroll="{ y: 580}"></a-table>
  </a-modal>
</template>


<script>

// import { httpAction } from '@/api/manage'

export default {
  name: 'AssetslistModal',
  components: {
    
  },
  data(){
    return {
      title: '固资明细',
      visible: false,
      confirmLoading: false,
      statusOptions:['未关联','结算中','已结算','划转完结'],
      feeDesc:'',
      columns:[
        {
          ellipsis: true,
          title: '结算月份',
          align: 'center',
          dataIndex: 'installmentMonth',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '结算金额',
          align: 'center',
          dataIndex: 'settleFee',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '结算状态',
          align: 'center',
          dataIndex: 'status',
          customRender: text => {
            const res =this.statusOptions[text]
            return <a-tooltip title={res}>{res}</a-tooltip>
          }
        },
      ],
      dataSource: [],
      totalMoney:0,
    }
  },
  methods:{
    show(money,list,boo){
      this.totalMoney = money
      this.dataSource = list
      if(list.length>0){
        this.feeDesc = boo?'划转-'+this.dataSource[0].feeDesc:'未关联-'+this.dataSource[0].feeDesc
      }
      this.visible = true;
    },
    handleCancel(){
      this.visible = false;
    },
  }

}
</script>
<style lang="less" scoped>
.oprate{
  margin-bottom: 15px;
  color: #333;
  span{
    margin-right: 50px;
  }
}
</style>
