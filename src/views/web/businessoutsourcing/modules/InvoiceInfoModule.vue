<template>
  <a-modal
    title="开票信息"
    :width="900"
    placement="right"
    :closable="true"
    @ok="getRemainInvoice"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="关联开票"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
  >
    <!-- 已关联开票信息 -->
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
    ></a-table>

    <a-modal
      title="关联开票"
      :width="900"
      placement="right"
      :closable="true"
      cancelText="关闭"
      okText="确定关联"
      :visible="glVisible"
      :maskClosable="false"
      :confirmLoading="glConfirmLoading"
      @ok="handleOk"
      @cancel="handleGlCancel"
      :destroyOnClose="true"
    >
      <div class="goInvoice" v-if="type == 1">
        <a-button type="primary" @click="openInvoice">去开票</a-button>
      </div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="glColumns"
        :dataSource="gLdataSource"
        :loading="glLoading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      ></a-table>
    </a-modal>

  </a-modal>
</template>
<script>
import { httpAction } from '@/api/manage'
import moment from "moment"

export default {
  name: 'InvoiceInfoModule',
  data() {
    return{
      visible: false,
      glVisible: false,
      confirmLoading: false,
      glConfirmLoading: false,
      loading: false,
      glLoading: false,
      isdisable: false,
      selectedRowKeys:[],
      selectionRows: [],
      type: 0,
      dataSource:[],
      gLdataSource:[],
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
      glColumns: [
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
        }
      ],
      url:{
        openTInvoice: '/salary/tinvoice/openOneTimeInvoiceBySettleBillId',
        getInvoice: '/salary/tinvoice/openOneTimeInvoiceByUnitId',
        save:'/salary/tinvoice/saveOneTimeMInvoice',
      }
    }
  },
  methods: {
    loadData(url){
      this.loading = true
      httpAction(url,{},'GET').then((res) => {
        if(res.code === 200){
          this.dataSource = res.data
        }else{
          this.$message.warning(res.msg)
        }
      }).finally(()=>{
        this.loading = false
      })
    },
    show(record,type) { // type 1非人事结算单
      this.model = Object.assign({},record)
      if(type === 1){
        this.type = type
        this.loadData(`/salary/tinvoice/openTInvoiceBySettleFormId?salaryId=${this.model.billId}&settleFormType=4`)
      }else{
        const url = `${this.url.openTInvoice}?settleBillId=${this.model.settleBillVo.id}&settleFormType=4`
        this.loadData(url)
      }
      this.visible = true
    },
    openInvoice(){
      this.visible = false
      this.$emit("close")
      this.type = 0
      this.$router.push({path:'/iweb/InvoiceManageApply'})
    },
    handleCancel(){
      this.close()
    },
    close(){
      this.visible = false
      this.$emit("ok")
      this.type = 0
    },
    handleOk(){
      const ids = (this.selectedRowKeys.length) ? this.selectedRowKeys.join(',') : ''
      if(ids){
        this.handleRelate(ids,'关联成功')
      }else{
        const _this = this
        this.$confirm({
          title: '清空记录',
          content: '当前没有选择,是否清空所有记录!',
          onOk() {
            _this.handleRelate(ids,'清空成功')
          },
        });
      }
    },
    handleRelate(ids,msg){
      let httpurl = ''
      let url = ''
      if(this.type === 1){
        httpurl = `/salary/tinvoice/saveMInvoice?idStr=${ids}&salaryId=${this.model.billId}&settleFormType=4`
        url = `/salary/tinvoice/openTInvoiceBySettleFormId?salaryId=${this.model.billId}&settleFormType=4`
      }else{
        const month = moment(this.model.settleBillVo.settleDate,'YYYY-MM-DD').format('YYYYMM')
        httpurl = `${this.url.save}?prevPoorBalance=${this.model.settleBillVo.prePoorBalance}&settleMonth=${month}&settleBillId=${this.model.settleBillVo.id}&settleFormType=4&idStr=${ids}&settleMoney=${this.model.settleBillVo.sumSettle}`
        url = `${this.url.openTInvoice}?settleBillId=${this.model.settleBillVo.id}&settleFormType=4`
      }
      
      httpAction(httpurl,{},'POST').then((res) => {
        if(res.code === 200){
          this.$message.success(msg)
          this.loadData(url)
        }
      }).finally(()=>{
        this.glVisible = false
        this.selectedRowKeys = []
      })
    },
    // 点击按钮选中
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
      console.log(this.selectedRowKeys,this.selectionRows,123)
    },
    // 获取剩余的开票
    getRemainInvoice(){
      let url = `${this.url.getInvoice}?unitId=${this.model.customerId}`
      if(this.type === 1){
        url = `/salary/tinvoice/openBalanceInvoiceByUnitId?salaryId=${this.model.id}&settleFormType=4`
      }
      httpAction(url,{},'GET').then((res) => {
        if(res.code === 200){
          this.gLdataSource = res.data
          this.isdisable = (res.data.length) ? false : true
        }else{
          this.$message.warning(res.msg)
        }
      }).finally(()=>{
        this.glVisible = true
      })
    },
    handleGlCancel(){
      this.glVisible = false
      this.selectedRowKeys = []
    },

  }
}
</script>

<style lang="less" scoped>
.goInvoice{
  text-align: right;
  margin-bottom: 15px;
}
</style>
