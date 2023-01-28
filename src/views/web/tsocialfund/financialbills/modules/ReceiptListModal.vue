<template>
  <a-modal
    title="发票信息"
    :width="1200"
    placement="right"
    @cancel="handleCancel"
    @ok="handleOk"
    :closable="true"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="loading"
  >
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户单位">
              <select-page
                :id="'id'"
                :title="'customerName'"
                placeholder="请选择客户单位"
                v-model="queryParam.customerId"
                :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <select-page
                :id="'departName'"
                :title="'departName'"
                placeholder="请选择结算主体查询"
                v-model="queryParam.settleName"
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="购买方名称">
              <a-input
                placeholder="请输入购买方名称"
                v-model="queryParam.ticketTableHead"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <span
              style="float: left;overflow: hidden;"
              class="table-page-search-submitButtons"
            >
              <a-button
                type="primary"
                @click="searchQuery"
                icon="search"
              >查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :scroll="{x: 1}"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{type:'radio',fixed:true,onChange:selectRow}"
      @change="handleTableChange"
    >
    </a-table>
  </a-modal>
</template>

<script>
import SelectPage from '@/components/jeecg/SelectPage'
import { getAction,httpAction } from '@/api/manage'

export default {
  name: 'ReceiptListModal',
  components: {
    SelectPage
  },
  data() {
    return {
      visible: false,
      loading: false,
      queryParam: {},
      id:null,
      selectedRowKeys: [],
      invKindType: { '0': '专用发票', '2': '普通发票', '51': '电子发票' },
      selectInvoice:{},
      columns: [
        {
          width: 180,
          ellipsis: true,
          title: '客户单位',
          align: 'center',
          dataIndex: 'customerName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '名称',
          align: 'center',
          dataIndex: 'ticketTableHead',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '发票类型',
          align: 'center',
          dataIndex: 'invKind',
          customRender: text => {
            const tipTitle = this.invKindType[String(text)] || '-'
            return <a-tooltip title={tipTitle}>{tipTitle}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '纳税人识别号',
          align: 'center',
          dataIndex: 'taxpayerIdentificationNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '开户行',
          align: 'center',
          dataIndex: 'bankName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '银行卡号',
          align: 'center',
          dataIndex: 'bankNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
      ],
      dataSource: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },

    }
  },
  methods: {
    show(id){
      this.visible = true;
      this.id = id;
      this.loadData();
    },
    searchQuery() {
      this.selectedRowKeys = []
      this.loadData(1)
    },
    searchReset() {
      this.queryParam = {}
      this.selectedRowKeys = []
      this.loadData(1)
    },
    selectRow(selectedRowKeys, selectedRows){
      this.selectInvoice = selectedRows[0];
    },
    handleTableChange(pagination) {
      //分页、排序、筛选变化时触发
      this.ipagination = pagination
      this.loadData(pagination.current)
    },
    loadData(page=1){
      const params = {...this.queryParam,...{current:page,size:this.ipagination.pageSize}};
      this.loading = true;
      getAction(`hrBase/tticketconfig/page`, params).then((res) => {
        if(res.code === 200){
          const data = res.data;
          this.dataSource = data.records;
          this.ipagination = {...this.ipagination,...{current:data.current,pageSize:data.size,total:data.total}};
        }else{
          this.dataSource = [];
          this.$message.warning(res.msg);
        }
      }).finally(()=>{
        this.loading = false;
      })
    },
    handleOk(){
      if(Object.keys(this.selectInvoice).length === 0){
        this.$message.warning('请先选择一条记录!');
        return false;
      }
      const params = {
        taxpayerIdentificationNo:this.selectInvoice.taxpayerIdentificationNo,
        taxUnit: this.selectInvoice.customerName,
        addr: this.selectInvoice.addr||'',
        phone: this.selectInvoice.phone||'',
        bankName: this.selectInvoice.bankName,
        bankNo: this.selectInvoice.bankNo,
        id: this.id
      }
      this.loading = true;
      httpAction(`hrSocial/tfinancebill/updateInvoiceInfoById`,params,'PUT').then(res=>{
        if(res.code === 200){
          this.$emit('ok',params);
          this.handleCancel();
        }else{
          this.$message.warning(res.msg);
        }
      }).finally(()=>{
        this.loading = false;
      })

    },
    handleCancel(){
      this.visible = false;
      this.selectInvoice = {};
    }
  }
}


</script>

<style lang="less" scoped>


</style>

