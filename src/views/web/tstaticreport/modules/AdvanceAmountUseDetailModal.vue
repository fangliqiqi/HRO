<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="1200"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    :footer="null"
  >
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="index"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :pagination="false"
        :scroll="{ y: 600}"
      >
      </a-table>
    </div>
      
  </a-modal>
</template>

<script>
import moment from 'moment'

export default {
  name: 'AdvanceAmountUseDetailModal',
  data(){
    return {
      title:'',
      loading:false,
      visible: false,
      confirmLoading: false,
      isOpen:false,
      incomeBelongSubOptions:[],
      incomeBelongSub:'',
      dataSource:[],
      columns:[
        {
          width: 120,
          ellipsis: true,
          title: '垫付编号',
          align: 'center',
          dataIndex: 'advancePaymentNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '申请人',
          align: 'center',
          dataIndex: 'advanceCreateUserName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '申请日期',
          align: 'center',
          dataIndex: 'advanceCreateTime',
          sorter: (a, b) => moment(a.advanceCreateTime) - moment(b.advanceCreateTime),
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '垫付金额',
          align: 'center',
          dataIndex: 'advanceMoney',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '出账状态',
          align: 'center',
          dataIndex: 'salaryRevenueStatus',
          sorter: (a, b) => a.salaryRevenueStatus - b.salaryRevenueStatus,
          customRender: text => {
            const resultText = text==1?'已出账':'未出账'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '出账日期',
          align: 'center',
          dataIndex: 'salaryRevenueTime',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '占用额度',
          align: 'center',
          dataIndex: 'useMoney',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
      ]
    }
  },
  methods:{
    moment,
    show(data){
      this.visible = true;
      this.dataSource = data.map(item=>{
        item.salaryRevenueStatus = item.salaryRevenueTime?'1':'0'
        return item
      })
      
    },
    
    handleCancel(){
      this.visible = false;
    },
  }

}
</script>