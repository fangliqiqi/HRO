<template>
  <a-modal
    title="报错信息"
    :width="700"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="取消"
    okText="确定"
    :visible="visible"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
      >
      </a-table>
    </a-spin>
  </a-modal>
</template>
<script>
export default {
  name: "SalaryCheckErrorModal",
  data(){
    return {
      confirmLoading: false,
      visible:false,
      dataSource:[],
      columns:[
        {
          title: '序号',
          align: 'center',
          dataIndex: 'number',
        },
        {
          title: '行号',
          align: 'center',
          dataIndex: 'row',
        },
        {
          title: '列数',
          align: 'center',
          dataIndex: 'column',
        },
        {
          title: '身份证',
          align: 'center',
          dataIndex: 'idNumber',
        },
        {
          title: '主表信息',
          align: 'center',
          dataIndex: 'mainSheet',
        },
        {
          title: '子表信息',
          align: 'center',
          dataIndex: 'subSheet',
        },
      ]
    }
  },
  methods: {
    show(data) {
      this.visible = true
      this.dataSource = data
    },
    handleCancel(){
      this.visible = false
    },
    handleOk(){
      this.visible = false
    }
  }
}
</script>
