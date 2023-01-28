<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="false"
      :destroyOnClose="false"
      :width="800"
    > 
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:'radio'}"
        @change="handleTableChange"
      >
      </a-table>
    </a-modal>
  </div>
</template>
<script>

  import { httpAction } from '@/api/manage'

  export default {
    name:'CompanyListModal',
    data() {
      return {
        title: '邀请成员加入',
        visible: false,
        confirmLoading: false,
        loading: false,
        
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
        dataSource:[],
        columns:[
          {
            title: '企业名称',
            align: 'center',
            dataIndex: 'companyName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            title: '管理员',
            align: 'center',
            dataIndex: 'managerName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },

        ],
        selectedRowKeys:[],
        selectionRows: [],
        id:'',

      }
    },
    methods: {
      show(id) {
        this.id = id
        this.visible = true
        this.loadData()
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectionRows = selectionRows
      },
      handleTableChange(pagination) {
        this.ipagination = pagination
        this.loadData()
      },
      loadData(){
        const qs = require('qs')
        const param = {
          current:this.ipagination.current,
          size:this.ipagination.pageSize
        }
        this.loading = true
        httpAction('/hrBase/fddcompanyinfo/page', qs.stringify(param),'get').then((res) => {
          if (Number(res.code) === 200) {
            if (res.data && res.data.records && res.data.records.length > 0) {     
              this.dataSource = res.data.records
              this.ipagination.total = res.data.total
            } else {
              this.dataSource = []
              this.ipagination.total = 0
            }
          } else {
            this.$message.error(res.msg)
          }
        }).finally(()=>{
          this.loading = false
        })
      },
      handleOk() {
        if(this.selectedRowKeys.length === 0){
          this.$message.warning('请选择企业！')
          return false
        }
        const parms = {
          id:this.id,
          companyInfoId:this.selectionRows[0]['id']
        }
        this.confirmLoading = true
        httpAction(`/hrBase/fddpersonaccount/getAddEmployeeUrl`, parms, 'POST').then((res) => {
          if(res.code == 200){
            this.$message.success('邀请成员加入企业成功!')
            this.close()
            this.$emit('ok')
            window.open(res.data)
          } else {
            this.$message.warning(res.msg)
          }
        }).finally(() => {
          this.confirmLoading = false
        })
        
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.visible = false
        this.id = ''
        this.selectedRowKeys = this.selectionRows = []
      }
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 150px;
  }
}
</style>
