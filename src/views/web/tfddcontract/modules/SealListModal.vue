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
        :pagination="false"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:'checkbox'}"
        @change="handleTableChange"
      >
      </a-table>
    </a-modal>
  </div>
</template>
<script>

  import { httpAction } from '@/api/manage'

  export default {
    name:'SealListModal',
    data() {
      return {
        title: '印章列表',
        visible: false,
        confirmLoading: false,
        loading: false,
        
        ipagination: {
          current: 1,
          pageSize: 20,
          pageSizeOptions: ['10', '20', '30', '50', '100'],
          showTotal: (total, range) => {
            return `${range[0]}-${range[1]} 共${total}条`
          },
          showQuickJumper: false,
          showSizeChanger: true,
          total: 0
        },
        dataSource:[],
        statusOption:{
          "-1":"审核不通过",
          "1":"待审核",
          "2":"审核通过"
        },
        columns:[
          {
            title: '印章名称',
            align: 'center',
            dataIndex: 'sealName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            title: '印章状态',
            align: 'center',
            dataIndex: 'status',
            customRender: text => {
              const resultText = this.statusOption[text]
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          // {
          //   title: '系统章状态',
          //   align: 'center',
          //   dataIndex: 'sysFlag',
          //   customRender: text => {
          //     const resultText = text || '-'
          //     return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          //   }
          // },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },

        ],
        selectedRowKeys:[],
        selectionRows: [],
        id:'',
        selectIds: []
      }
    },
    methods: {
      show(id,selectIds) {
        this.id = id;
        this.selectIds = selectIds;
        this.selectedRowKeys = ['1']
        this.visible = true;
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
        const _this = this
        const qs = require('qs')
        const param = {
          current:this.ipagination.current,
          size:this.ipagination.pageSize,
          status:2
        }
        _this.loading = true
        httpAction(`/hrBase/fddsealinfo/page?${qs.stringify(param)}`, null,'get').then((res) => {
          if (Number(res.code) === 200) {
            if (res.data && res.data.records && res.data.records.length > 0) {     
              _this.dataSource = res.data.records
              const selectedArr = res.data.records.filter(item=>_this.selectIds.indexOf(item.sealId) > -1);
              _this.selectedRowKeys = selectedArr.map(item=>{return item.sealId});
              _this.ipagination.total = res.data.total
            } else {
              _this.dataSource = []
              _this.ipagination.total = 0
            }
          } else {
            _this.$message.error(res.msg)
          }
        }).finally(()=>{
          _this.loading = false
        })
      },
      handleOk() {
        if(this.selectedRowKeys.length === 0){
          this.$message.warning('请选择印章！')
          return false
        }
        const qs = require('qs')
        const parms = {
          id:this.selectedRowKeys.join(','),
          fddPersonAccountId:this.id
        }
        this.confirmLoading = true
        httpAction(`/hrBase/fddsealinfo/sealAuth?${qs.stringify(parms)}`, null, 'POST').then((res) => {
          if(res.code == 200){
            this.$message.success(res.msg)
            this.close()
            this.$emit('ok')
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
        this.selectIds = []
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
