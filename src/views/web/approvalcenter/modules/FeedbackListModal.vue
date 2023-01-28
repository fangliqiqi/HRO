<template>
  <a-table
    ref="table"
    size="middle"
    bordered
    rowKey="id"
    :columns="columns"
    :dataSource="dataSource"
    :pagination="ipagination"
    :loading="loading"
    @change="handleTableChange"
  >
  </a-table>
</template>

<script>
import { httpAction } from '@/api/manage'
import { filterObj } from '@/utils/util'

export default {
  name: 'FeedbackListModal',
  props: {
    paymentId:{
      type: String,
      default: '',
      required: true
    },
  },
  data() {
    return {
      
      loading: false,
      dataSource:[],
      sysUsers:[],
      columns: [
        {
          title: '时间',
          align: 'center',
          dataIndex: 'createTime',
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '反馈人',
          align: 'center',
          dataIndex: 'createUser',
          ellipsis: true,
          customRender: text => {
            const resultText = this.sysUsers[text] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '原因',
          align: 'center',
          dataIndex: 'remark',
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
      ],
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
        total: 0
      },
      queryParam:{},
      url: {
        list: '/hrApproval/tadvancepaymentremark/page',
      },
    }
  },
  methods: {
    getSysUsers(){
      httpAction(`/admin/user/userDic`, null ,'GET').then((res) => {
        if(res.code === 200){
          this.sysUsers = res.data
        }else{
          this.$message.warn(res.msg)
        }
      })
    },
    handleTableChange(pagination){
      this.ipagination = pagination
      this.loadRemoteData(pagination.current)
    },
    handleParams(){
      this.queryParam.current = this.ipagination.current
      this.queryParam.size = this.ipagination.pageSize
      this.queryParam.paymentId = this.paymentId
      // eslint-disable-next-line
      return filterObj(_.cloneDeep(this.queryParam))
    },
    loadRemoteData(page){
      this.ipagination.current = page ? page : 1
      const param = this.handleParams()
      const qs = require('qs')
      const params = qs.stringify(param)
      this.loading = true
      httpAction(`${this.url.list}?orders%5B0%5D.asc=false&orders%5B0%5D.column=create_time&${params}`,null,'get').then((res) => {
        if(res.code === 200){
          this.dataSource = res.data.records
          this.ipagination.total = res.data.total
        }else{
          this.$message.warn(res.msg)
        }
      }).finally(()=>{
        this.loading = false
      })
    },
  },
}
</script>

<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 150px;
  }
}
</style>
