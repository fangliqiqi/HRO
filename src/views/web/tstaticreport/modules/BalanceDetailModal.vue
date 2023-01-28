<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="1200"
    @ok="handleCancel"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="column"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      :scroll="{x: 1}"
    >
    </a-table>
  </a-modal>
</template>

<script>

import { httpAction } from '@/api/manage'
import { groupByField } from '@/utils/common'

export default {
  name: 'BalanceDetailModal',
  data() {
    return {
      loading:false,
      confirmLoading:false,
      title: '详情',
      visible: false,

      dataSource:[
        {
          id: 1,
          address1:1,
          month:1,
        },
        {
          id: 2,
          address1:1,
          month:1,
        },
        {
          id: 3,
          address1:2,
          month:2,
        },
      ],
      queryParam:{
      },
      ipagination:{
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0
      },
      column:[
        {
          title: '上传人',
          align: 'center',
          dataIndex: 'createUser',
          width: 80,
          ellipsis: true,
          customRender: (text, row) => {
            return {
              children: <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>,
              attrs: {
                rowSpan: row.rowSpan
              }
            }
          }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          width: 150,
          ellipsis: true,
          customRender: (text, row) => {
            return {
              children: <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>,
              attrs: {
                rowSpan: row.rowSpan
              }
            }
          }
        },
        {
          title: '结算金额',
          align: 'center',
          width: 100,
          ellipsis: true,
          dataIndex: 'accountMoneySum',
          customRender: (text, row) => {
            return {
              children: <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>,
              attrs: {
                rowSpan: row.rowSpan
              }
            }
          }
        },
        {
          title: '开票金额',
          align: 'center',
          width: 100,
          ellipsis: true,
          dataIndex: 'ticketMoneySum',
          customRender: (text, row) => {
            return {
              children: <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>,
              attrs: {
                rowSpan: row.rowSpan
              }
            }
          }
        },
        {
          title: '上次差余额',
          align: 'center',
          width: 100,
          ellipsis: true,
          dataIndex: 'prevPoorBalance',
          customRender: (text, row) => {
            return {
              children: <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>,
              attrs: {
                rowSpan: row.rowSpan
              }
            }
          }
        },
        {
          title: '本期差余额',
          align: 'center',
          width: 100,
          ellipsis: true,
          dataIndex: 'nowPoorBalance',
          customRender: (text, row) => {
            return {
              children: <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>,
              attrs: {
                rowSpan: row.rowSpan
              }
            }
          }
        },
        {
          title: '累计差余额',
          align: 'center',
          width: 100,
          ellipsis: true,
          dataIndex: 'curPoorBalance',
          customRender: (text, row) => {
            return {
              children: <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>,
              attrs: {
                rowSpan: row.rowSpan
              }
            }
          }
        },
        {
          title: '月份',
          align: 'center',
          dataIndex: 'month',
          width: 100,
          ellipsis: true,
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '姓名',
          align: 'center',
          width: 100,
          ellipsis: true,
          dataIndex: 'name',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '项目',
          align: 'center',
          width: 150,
          ellipsis: true,
          dataIndex: 'project',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '金额',
          align: 'center',
          width: 100,
          ellipsis: true,
          dataIndex: 'money',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '原因',
          width: 150,
          ellipsis: true,
          align: 'center',
          dataIndex: 'cause',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },

      ],
      url: {
        list: '/hrBase/tempreducereport/page',
      },
    }
  },
  methods:{
    async show(record){
      const res1 = await httpAction(`/admin/user/userDic`, null ,'GET');
      if(res1.code === 200){
        const res2 = await httpAction(`/salary/tstatisticsbalance/getBalanceDetailList?deptId=${record.departId}&settleMonth=${record.settlementMonth}`,null,'get');
        if(res2.code === 200){
          this.dataSource = this.handleData(res2.data,res1.data);
        }else{
          this.$message.warn(res2.msg);
        }
      }else{
        this.$message.warn(res1.msg);
      }
      this.visible = true;

    },
    handleData(arr,user){
      const res = [];
      let i = 0;
      const obj = groupByField(arr,'salaryId');
      for(const key in obj){
        obj[key].forEach((item,index)=>{
          res[i] = index ? {...item,...{rowSpan:0,createUser:user[item.createUser]}} : {...item,...{rowSpan:obj[key].length,createUser:user[item.createUser]}};
          i++;
        })
      }
      return res;
    },
    handleCancel(){
      this.visible = false;
      this.dataSource = [];
    }

  }

}
</script>