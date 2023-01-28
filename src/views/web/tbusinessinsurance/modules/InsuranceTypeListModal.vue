<template>
  <a-modal
    :title="title"
    :width="600"
    placement="right"
    :closable="true"
    @ok="handleCancel"
    @cancel="handleCancel"
    cancelText="关闭"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <div class="addButton">
      <a-input placeholder="请输入新增购买标准" style="width: 200px" v-model="addBenchmark"></a-input>
      <a-button type="primary" style="display: inline" @click="submitBenchmark">新增</a-button>
    </div>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      @change="tableChange"
      rowKey="id"
      :customRow="getRowData"
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
      const rule = new RegExp('^[0-9]{1,10}$')
      if (!rule.test(this.addBenchmark)) {
        this.$message.warning('请输入整数')
        return
      }
      if (!rule.test(Number(this.addBenchmark))) {
        this.$message.warning('请输入整数')
        return
      }
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
    getRowData(record) {
      const that = this
      return {
        on: {
          click: () => {
            that.loading = false
            const modal = that.$confirm({
              title: '确认删除当前选项吗？',
              okButtonProps: {
                props: { loading: that.loading },
              },
              async onOk() {
                that.loading = !that.loading
                modal.update({
                  okButtonProps: {
                    props: { loading: that.loading },
                  },
                })
                const res = await httpAction(`${that.url.deleteRecord}${record.id}`, null, 'DELETE')
                if (res.code === 200) {
                  that.$message.success('删除成功')
                  if (that.dataSource.length === 1) {
                    that.ipagination.current -= 1
                  }
                  await that.getPageDate(that.ipagination.current, that.ipagination.pageSize)
                } else {
                  that.$message.warning(res.msg)
                }
                that.loading = false
              },
            })
          },
        },
      }
    },
    getPageDate(current = 1, size = 10) {
      httpAction(`${this.url.default}${this.id}&current=${current}&size=${size}`, null, 'get').then((res) => {
        if (res.code === 200 && res.data) {
          this.dataSource = res.data.records
          this.ipagination.total = res.data.total
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    show(record) {
      this.id = record.id
      this.typeId = record.id
      this.getPageDate(this.ipagination.current, this.ipagination.pageSize)
      this.visible = true
    },
    tableChange(pagination) {
      //分页、排序、筛选变化时触发
      this.ipagination = pagination
      console.log(this.ipagination)
      this.getPageDate(pagination.current, pagination.pageSize)
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.id = ''
      this.visible = false
      this.ipagination.current = 1
      this.ipagination.pageSize = 10
    },
  },
}
</script>

<style lang="css" scoped>
.addButton {
  margin-bottom: 10px;
}
</style>
