<template>
  <a-modal
    :title="title"
    :width="500"
    placement="right"
    :closable="true"
    @ok="handleCancel"
    @cancel="handleCancel"
    cancelText="关闭"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      @change="tableChange"
      rowKey="id"
    >
    </a-table>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'InsuranceTypeListModal',
  data() {
    return {
      title: '操作',
      id: '',
      addBenchmark: '',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      columns: [],
      dataSource: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0,
      },
      url: {
        default: '',
        deleteRecord: '/busiInsurance/tinsurancetypestandard/',
        addRecord: '/busiInsurance/tinsurancetypestandard',
      },
    }
  },
  methods: {
    submitBenchmark() {
      this.addBenchmark = Number(this.addBenchmark.toString())
      const obj = {
        buyStandard: this.addBenchmark,
        typeId: this.typeId,
        type: '0',
      }
      httpAction(this.url.addRecord, obj, 'POST')
        .then((res) => {
          if (Number(res.code) === 200) {
            this.$message.success('新增成功')
          } else {
            this.$message.warning(res.msg)
          }
        })
        .finally(() => {
          this.getPageDate(this.ipagination.current, this.ipagination.pageSize)
          this.addBenchmark = ''
        })
    },
    getPageDate(current=1, size=10) {
      const requesturl = `${this.url.default}${this.id}&current=${current}&size=${size}`
      httpAction(requesturl, null, 'get').then((res) => {
        if (Number(res.code) === 200 && res.data) {
          this.dataSource = res.data.records
          this.ipagination.total = res.data.total
          if(res.data.pages<res.data.current){
              res.data.current-=1
          }
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    show(record) {
      this.visible = true
      this.id = record.id
      this.typeId = record.id
      this.getPageDate(this.ipagination.current, this.ipagination.pageSize)
    },
    tableChange(pagination) {
      //分页、排序、筛选变化时触发
      this.ipagination = pagination
      this.getPageDate(pagination.current, pagination.pageSize)
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.visible = false
      this.$emit('close')
      this.id = ''
      this.ipagination.current=1
      this.ipagination.pageSize=10
    },
  },
}
</script>
