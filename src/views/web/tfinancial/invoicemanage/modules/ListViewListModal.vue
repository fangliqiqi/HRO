<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
    </template>
    <a-table
      rowKey="id"
      :scroll="{x: 1}"
      size="middle"
      :loading="loading"
      :bordered="true"
      :columns="columns"
      :dataSource="dataSource"
    >
    </a-table>
  </a-modal>
</template>
<script>
export default {
  data() {
    return {
      title: '操作',
      visible: false,
      loading: false,
      dataSource: [], // 数据源
      columns: [
        {
          width:250,
          ellipsis: true,
          title: '商品和服务分类简称',
          align: 'center',
          dataIndex: 'goodsName',
          customRender: (text,record) => {
            const goodsName = record.goodsName ? `*${record.goodsName}` : ''
            const productName = record.productName ? `*${record.productName}` : ''
            const resultText = `${goodsName}${productName}` || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width:180,
          ellipsis: true,
          title: '名称',
          align: 'center',
          dataIndex: 'productName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width:120,
          title: '规格型号',
          align: 'center',
          dataIndex: 'productSpec',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width:90,
          title: '单位',
          align: 'center',
          dataIndex: 'productUnit',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width:120,
          title: '单价',
          align: 'center',
          dataIndex: 'price',
          customRender: text => {
            const resultText = parseFloat(text).toFixed(2) || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width:80,
          title: '数量',
          align: 'center',
          dataIndex: 'prodectNum',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width:80,
          ellipsis: true,
          title: '税率',
          align: 'center',
          dataIndex: 'taxRate',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width:100,
          ellipsis: true,
          title: '税额',
          align: 'center',
          dataIndex: 'taxMoney',
          customRender: text => {
            const resultText = parseFloat(text).toFixed(2) || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width:120,
          ellipsis: true,
          title: '税收分类编码',
          align: 'center',
          dataIndex: 'goodsTaxNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width:120,
          ellipsis: true,
          title: '税收分类名称',
          align: 'center',
          dataIndex: 'goodsTaxName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        }
      ]
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    // 关闭
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

