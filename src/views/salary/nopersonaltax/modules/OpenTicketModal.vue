<template>
  <a-modal
    title="开票信息"
    :width="900"
    placement="right"
    :closable="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="关联开票"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
  >

    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
    ></a-table>
    <open-ticket-change-moal
      ref="modalOpenChange"
      @ok="modalFormOk"
    ></open-ticket-change-moal>
  </a-modal>
</template>
<script>
import { httpAction } from '@/api/manage'
import OpenTicketChangeMoal from './OpenTicketChangeMoal'
export default {
  name: 'OpenTicketModal',
  components: {
    OpenTicketChangeMoal
  },
  data() {
    return{
      visible: false,
      confirmLoading: false,
      loading: false,
      dataSource:[],
      model: {},
      columns: [
        {
          title: '票据可用余额',
          align: 'center',
          dataIndex: 'balance',
        },
        {
          title: '开票金额',
          align: 'center',
          dataIndex: 'invoiceMoney',
        },
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'unitName',
        },
        {
          title: '开票申请时间',
          align: 'center',
          dataIndex: 'applyDate',
        },
      ],
      url:{
        openTInvoice: '/salary/tinvoice/openTInvoiceBySettleFormId'
      }
    }
  },
  methods: {
    loadData(){
      this.loading = true
      httpAction(this.url.openTInvoice + '?salaryId=' + this.model.id + '&settleFormType=' + '0',{},'GET').then((res) => {
        if(Number(res.code) === 200){
          this.dataSource = res.data
        }
        this.loading = false
      })
    },
    show(record) {
      this.model = Object.assign({},record)
      this.loadData()
      this.visible = true;
    },
    handleCancel(){
      this.close()
    },
    close(){
      this.visible = false
      this.$emit("ok")
    },
    handleOk(){
      this.$refs.modalOpenChange.show(this.model)
    },
    modalFormOk(){
      this.loadData()
    }
  }
}
</script>


