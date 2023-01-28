<template>
  <a-modal
    :title="title"
    :width="650"
    :visible="visible"
    cancelText="放弃申请"
    okText="仍要发起"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div class="center">
      <div class="icon"><a-icon type="exclamation-circle" theme="filled" style="color:red;fontSize:26px"/></div>
      当前结算主体存在逾期未还款的数据，<span style="color:red">禁止发起新的垫付</span>!
      <p class="line">逾期明细</p>
    </div>
    <a-table
      ref="table"
      size="middle"
      :rowKey="(record,index)=>{return index}"
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
        <div class="right">
          <p>（逾期未回款合计：{{ total }}元）</p>
        </div>
      </template>
    </a-table>
    <overdue-number ref="overdueNumberModel" @ok="refresh"> </overdue-number> 
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import OverdueNumber from './OverdueNumber'

export default {
  name: 'AdvancePaymentOverout',
  components:{
    OverdueNumber
  },
  data() {
    return {
      title: '',
      visible: false,
      confirmLoading: false,
      dataSource:[],
      model:{},
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
    show(id,model) {
      this.model = model
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
    // 仍要发起
    handleOk() {
      this.visible = false
      this.$refs.overdueNumberModel.show(this.model)
    },
    handleCancel() {
      this.visible = false
    },
    refresh(){
      this.$emit('ok');
    }
  }
}
</script>

<style lang="less" scoped>
  .right{
    text-align: right;
    p{
      margin: 0px;
    }
  }
  .center{
    text-align: center;
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.85);
  }
  .icon{
    margin:8px 0;
  }
  .line{
    margin-top: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #e5e5e5;
    text-align: left;
  }
  .ant-table{
    margin-bottom: 12px;
  }
</style>
