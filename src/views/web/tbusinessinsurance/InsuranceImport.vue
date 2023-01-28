<template>
  <a-card :bordered="false">

    <!-- table区域-begin -->
    <div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="createTime"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <a-list
          slot="expandedRowRender"
          slot-scope="record"
          itemLayout="horizontal"
          :dataSource="strToObj(record.errorMessage)"
        >
          <a-list-item
            slot="renderItem"
            slot-scope="item"
            style="padding-left:15px;"
          >
            第{{ item.line }}行：{{ item.message }}
          </a-list-item>
        </a-list>
      </a-table>

    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  
  export default {
    name: 'InsuranceImport',
    mixins: [JeecgListMixin],
    components: {
      
    },
    data() {
      return {
        description: '商险导入明细查询',
        model:{},
        expandedRowKeys:[], //展开的行
        url: {
          list: '/hrGeneral/generalCache/page',
        },
        columns:[
          {
            title: '名称',
            align: 'center',
            dataIndex: 'operateName'
          },
          {
            title: '失败条数',
            align: 'center',
            dataIndex: 'failCount'
          },
          {
            title: '操作时间',
            align: 'center',
            dataIndex: 'createTime'
          },
        ],
      }
    },
    methods: {
      strToObj(str){
        return JSON.parse(str)
      },
      // 查看详情
      handleDetail: function(record) {
        this.expandedRowKeys = [record.createTime]
      },
    }
  }
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}
</style>
