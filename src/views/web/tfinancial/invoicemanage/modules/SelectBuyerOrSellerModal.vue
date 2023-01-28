<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
    :destroyOnClose="true"
  >
    <div
      v-if="pageType === 2"
      style="margin-bottom:20px;"
    >
      <a-input-search
        allowClear
        placeholder="请输入名称检索"
        style="width: 260px"
        @search="onSearch"
        @change="inputChange"
      />
    </div>
    <!--列表-->
    <a-table
      rowKey="id"
      size="middle"
      :loading="loading"
      :bordered="true"
      :columns="pageType === 1?buyerColumns:sellerColums"
      :customRow="rowSelect"
      :dataSource="dataSource"
      :pagination="ipagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio',hideDefaultSelections:true}"
      @change="handleTableChange"
    >
    </a-table>
  </a-modal>
</template>
<script>
import { getAction } from '@/api/manage'
export default {
  data() {
    return {
      title: '操作',
      visible: false,
      loading: false,
      pageType: 1, // 页面类型1购买方或2销售方，默认购买方
      isEstimate: false, // 是否是预估开票（预估开票没有结算主体）
      form: this.$form.createForm(this),
      selectedRowKeys: [],
      selectionRows: [],
      canSelect: true, // 防止重复点击行选中
      settleDomainId: '', //  结算主体ID
      unitId: '', // 客户单位ID
      searchValue: '', // 搜索查询的条件
      invKindType: { '0': '专用发票', '2': '普通发票', '51': '电子发票' }, // 发票类型
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showSizeChanger: true,
        total: 0
      },
      dataSource: [],
      buyerColumns: [
        {
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
          ellipsis: true,
          title: '银行卡号',
          align: 'center',
          dataIndex: 'bankNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        }
      ],
      sellerColums: [
        {
          width:220,
          ellipsis: true,
          title: '销售方名称',
          align: 'center',
          dataIndex: 'company',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '纳税人识别号',
          align: 'center',
          dataIndex: 'taxNb',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '开户行',
          align: 'center',
          dataIndex: 'bank',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
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
          ellipsis: true,
          title: '开票人',
          align: 'center',
          dataIndex: 'invoicePerson',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '审核人',
          align: 'center',
          dataIndex: 'invoiceChecker',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        }
      ],
      url: {
        buyerList: 'hrBase/tticketconfig/page', // 购买方列表数据接口
        sellerList: '/salary/tinvoicecompanyset/page' // 销售方列表数据接口
      }
    }
  },
  methods: {
    show() {
      this.visible = true
      // 获取列表数据
      this.loadListData()
    },
    // 关闭
    handleCancel() {
      this.isEstimate = false
      this.visible = false
      this.selectedRowKeys = []
      this.selectionRows = []
      this.pageType = 1
      this.ipagination.current = 1
    },
    // 获取列表数据
    loadListData() {
      const param = {
        current: this.ipagination.current,
        size: this.ipagination.pageSize
      }
      if (this.isEstimate) {
        param.customerId = this.unitId
      } else {
        param.settleId = this.settleDomainId
      }
      if (this.searchValue) {
        Object.assign(param, { company: this.searchValue })
      }
      const that = this
      that.loading = true
      const url = this.pageType === 1 ? this.url.buyerList : this.url.sellerList
      if (this.pageType === 2) {
        param.status = 0 // 销售方列表，传入status 0查询启用的销售方
      }
      getAction(url, param).then(res => {
        if (Number(res.code) === 200) {
          that.dataSource = res.data.records
          that.ipagination.current = res.data.current
          that.ipagination.total = res.data.total
        } else {
          that.$message.error('获取数据失败！')
        }
        that.loading = false
      })
    },
    // 搜索
    onSearch() {
      this.ipagination.current = 1
      this.loadListData()
    },
    inputChange(e){
      const value = e.target.value
      this.searchValue = value
      if(!value){ // 点击叉号清空时
        this.ipagination.current = 1
        this.loadListData()
      }
    },
    // 点击按钮选中
    onSelectChange(selectedRowKeys, selectionRows) {
      if (this.canSelect) {
        this.canSelect = false
        const record = selectionRows[0]
        record.pageType = this.pageType
        this.selectedRowKeys = selectedRowKeys
        this.selectionRows = selectionRows
        this.$emit('ok', record)
        this.handleCancel()
        setTimeout(() => {
          this.canSelect = true
        }, 3000)
      }
    },
    // 点击整行选中
    rowSelect(record) {
      return {
        on: {
          click: () => {
            if (this.canSelect) {
              this.canSelect = false
              this.selectionRows = [record]
              this.selectedRowKeys = [record.id] // 点击行选中
              record.pageType = this.pageType
              this.$emit('ok', record)
              this.handleCancel()
              setTimeout(() => {
                this.canSelect = true
              }, 2000)
            }
          }
        }
      }
    },
    //分页、排序、筛选变化时触发
    handleTableChange(pagination) {
      this.ipagination = pagination
      this.loadListData()
    }
  }
}
</script>
<style scoped>
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px;
}
</style>
