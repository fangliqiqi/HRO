<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="8"
            :sm="10"
          >
            <a-form-item label="姓名">
              <a-input
                placeholder="请输入姓名"
                v-model="queryParam.nickname"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="8"
            :sm="10"
          >
            <a-form-item label="账户名">
              <a-input
                placeholder="输入账户名查找"
                v-model="queryParam.username"
              />
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
    <!-- table区域-begin -->
    <div>
      <div
        class="ant-alert ant-alert-info"
        style="margin-bottom: 16px;"
      >
        已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> 项
        <a
          style="margin-left: 24px"
          @click="onClearSelected"
        >清空</a>
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">查看</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    
    <user-authority-rules-modal
      ref="UserAuthorityRulesModal"
      @ok="modalFormOk"
    ></user-authority-rules-modal>
  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction } from '@/api/manage'
  import { getAllTree } from '@/utils/common'
  import UserAuthorityRulesModal from './modules/UserAuthorityRulesModal'

  export default {
    name: 'UserAuthority',
    mixins: [JeecgListMixin],
    components: {
      UserAuthorityRulesModal
    },
    data() {
      return {
        description: '用户权限',
        organs:[],
        // 表头
        columns: [
          {
            title: '姓名',
            align: 'center',
            dataIndex: 'nickname',
            ellipsis: true,
            width:120,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '账户名',
            align: 'center',
            dataIndex: 'username',
            width:150,
            ellipsis: true,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '所属机构',
            align: 'center',
            dataIndex: 'deptName',
            ellipsis: true,
            // width:150,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed:'right',
            width:100,
            scopedSlots: { customRender: 'action' }
          },

        ],
        url: {
          list: 'admin/user/page/wxhr',
        },
        treeList:[],
        businessTypeOptions:[]
      }
    },
    methods: {
      // 查看权限
      handleDetail(record){
        this.$refs.UserAuthorityRulesModal.title = `访问规则 / ${record.nickname}`
        this.$refs.UserAuthorityRulesModal.businessTypeOptions = this.businessTypeOptions
        this.$refs.UserAuthorityRulesModal.organs = this.organs
        httpAction(`/hrBase/muserauthres/getByUserId?userId=${record.userId}`,null,'get').then((res)=>{
          if(res.code == 200){
            this.$refs.UserAuthorityRulesModal.show(res.data,record.userId)
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      handleAuthority(){
        if(this.isCanSub){
          this.params.users = this.selectedRowKeys
          httpAction(this.url.assignAuthority,this.params,'post').then((res)=>{
            if(res.code == 200){
              this.checkedKeys = []
              this.onClearSelected()
              this.$message.success('授权成功！')
            }else{
              this.$message.warning(res.msg)
            }
          })
        }else{
          this.$message.warning('请先选择左边的客户单位')
        }
      },
      initDictConfig() {
        httpAction('/admin/organizationinfo/getOrgForCus', '', 'GET').then((res) => {
          if (res.code === 200 && res.data.length > 0) {
            this.organs = res.data
          }
        })
        httpAction(`/hrBase/sysdictbusinesstype/getSysDictBusinessTypeList`,null,'get').then(res=>{
          if(res.code === 200) {
            this.treeList = getAllTree(res.data)
            this.businessTypeOptions = this.getRules(res.data,this.treeList)
          }
        })
      },
      getRules(list,tree){
        let res = []
        tree.map(item=>{
          const temp = list.filter(items=>items.parentId == item.id)
          res = res.concat(temp)
        })
        return res
      },

    }
  }
</script>
<style lang="less" scoped>
.ant-tree {
  border: 1px solid #91d5ff;
  overflow: scroll;
}
.tableCont {
  height: 450px;
}
</style>