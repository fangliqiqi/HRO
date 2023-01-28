<template>
  <a-modal
    title="关联开票"
    :width="900"
    placement="right"
    :closable="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="确定关联"
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
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
    ></a-table>

    <a-modal
      title="清空记录"
      :visible="allVisible"
      @ok="handleAllOk"
      @cancel="handleAllCancel"
    >
      <p style="color:red">当前没有选择,是否清空所有记录!</p>
    </a-modal>

  </a-modal>
</template>
<script>
import { httpAction } from '@/api/manage'
export default {
  name: 'OpenTicketChangeMoal',
  data() {
    return{
      visible: false,
      confirmLoading: false,
      allVisible: false,
      loading: false,
      salaryData:{},
      dataSource:[],
      selectedRowKeys:[],
      selectionRows: [],
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
        saveMInvoice:'/salary/tinvoice/saveMInvoice',
        openBalance:'/salary/tinvoice/openBalanceInvoiceByUnitIdForTForecast'
      }
    }
  },
  methods:{
    show(record) {
      console.log(record,12)
      this.selectedRowKeys = []
      this.selectionRows = []
      this.salaryData = record
      httpAction(`${this.url.openBalance}?unitId=${this.salaryData.unitId}`,{},'GET').then((res) => {
        if(res.code === 200){
          this.dataSource = res.data
        }
      })
      this.visible = true;
    },
    handleCancel(){
      this.visible = false
    },
    handleOk(){
      if(this.selectedRowKeys.length === 0){
         this.allVisible = true
      }else{
        const ids = this.selectedRowKeys.join(',')
        const httpurl = `${this.url.saveMInvoice}?salaryId=${this.salaryData.id}&settleFormType=3&idStr=${ids}`
        httpAction(httpurl,{},'POST').then((res) => {
          if(res.code === 200){
            this.$message.success("关联成功")
            this.$emit("ok")
            this.visible = false
          }
        })
      }
    },
    handleAllOk(){
      const httpurl = `${this.url.saveMInvoice}?salaryId=${this.salaryData.id}&settleFormType=3&idStr=` + ''
      httpAction(httpurl, {}, 'POST').then((res) => {
        if(res.code === 200){
          this.$message.success("关联成功")
          this.$emit("ok")
          this.visible = false
          this.allVisible = false
        }
      })
    },
    handleAllCancel(){
      this.allVisible = false
    },
    // 点击按钮选中
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
  }
}
</script>
