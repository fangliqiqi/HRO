
<template>
  <a-modal
    :visible="visible"
    :width="1000"
    title="项目报销明细"
    @cancel="handleCancel"
    @ok="handleCancel"
    :maskClosable="false"
    :closable="false"
    :destroyOnClose="true"
  >
    <a-table :scroll="{x: 1}" :columns="columns" :data-source="dataSource" :pagination="false"></a-table>
  </a-modal>
</template>

<script>
// import { httpAction } from '@/api/manage'

export default {
  name: 'ReimbursementModal',
  data() {
    return {
      visible: false,
      dataSource: [],
      columns: [
        {
          title: '预计结算月份',
          dataIndex :'installmentMonth',
          ellipsis: true,
          width:150,
          customRender:(text) => {
            const str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          }
        },
        {
          title: '结算月份',
          dataIndex: 'settleMonth',
          ellipsis: true,
          width:100,
          customRender:(text) => {
            const str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          }
        },
        {
          title: '报销单编号',
          dataIndex: 'reimburseFormCode',
          ellipsis: true,
          width:150,
          customRender:(text) => {
            const str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          }
        },
        {
          title: '报销时间',
          dataIndex: 'applyDate',
          ellipsis: true,
          width:150,
          customRender:(text) => {
            let str = '-'
            if(text){
              str = text.substring(0,10);
            }
            return <a-tooltip placement="topLeft" title={text||'-'}>{str}</a-tooltip>
          }
        },
        {
          title: '报销人',
          dataIndex: 'applyUserName',
          ellipsis: true,
          width:150,
          customRender:(text) => {
            const str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          }
        },
        {
          title: '费用类型',
          dataIndex: 'feeDesc',
          ellipsis: true,
          width:150,
          customRender:(text) => {
            const str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          }
        },
        {
          title: '金额',
          dataIndex: 'settleFee',
          ellipsis: true,
          width:120,
          customRender:(text) => {
            const str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          }
        },
        {
          title: '税额',
          dataIndex: 'tax',
          ellipsis: true,
          width:120,
          customRender:(text) => {
            const str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          }
        },
        {
          title: '结算额',
          dataIndex: 'ticket',
          ellipsis: true,
          width:120,
          customRender:(text) => {
            const str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          }
        }
      ],

    }
  },
  methods: {
    show(list){
      this.dataSource = list;
      this.visible = true;
    },
    handleCancel(){
      this.visible = false;
      this.dataSource = [];
    }
  }
  
}
</script>

