<template>
  <a-modal
    :title="title"
    :width="650"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-table
      ref="table"
      size="middle"
      :rowKey="Math.random().toString(36).substr(3,10)"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="confirmLoading"
      :scroll="{ y: 400 }"
    >
      <template slot="notPayback">
        <span style="color:#FF0000">尚未回款</span>
      </template>
      <template slot="title">
        <div class="center">
          <h6>逾期未回款情况</h6>
          <p>（逾期未回款合计：{{ total }}元）</p>
        </div>
      </template>
    </a-table>    
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'OverdueListModal',
  data() {
    return {
      title: '逾期未回款',
      visible: false,
      confirmLoading: false,
      dataSource:[],
      columns:[
        {
          ellipsis: true,
          title: '垫付申请日期',
          align: 'center',
          width:100,
          dataIndex: 'createTime',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          ellipsis: true,
          title: '最迟回款日期',
          width:100,
          align: 'center',
          dataIndex: 'paybackDateFinal',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          ellipsis: true,
          title: '垫付金额(元)',
          align: 'center',
          width:100,
          dataIndex: 'advanceMoney',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          ellipsis: true,
          align: 'center',
          slots: { title: 'notPayback' },
          dataIndex: 'advanceNotPayback',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          ellipsis: true,
          title: '承诺回款日期',
          width:100,
          align: 'center',
          dataIndex: 'paybackDate',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          ellipsis: true,
          title: '逾期天数',
          align: 'center',
          dataIndex: 'overdueDay',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        }
      ],
      total:0
    }
  },
  methods: {
    show(id) {
      httpAction(`hrApproval/tadvancepayment/getExistOverduePayment/${id}`,null,'get').then(res=>{
        if(res.code === 200){
          this.dataSource = res.data.overDuePaymentList
          this.total = res.data.advanceNotPaybackTotal
          this.visible = true
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleOk() {
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.visible = false
      this.total = 0
      this.dataSource = []
    }
  }
}
</script>

<style lang="less" scoped>
  .center{
    text-align: center;
    h6{
      font-size: 16px;
      margin: 0px;
    }
    p{
      margin: 0px;
    }
  }
  .ant-table{
    margin-bottom: 12px;
  }
</style>
