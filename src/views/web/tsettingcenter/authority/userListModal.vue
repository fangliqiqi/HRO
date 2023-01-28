<template>
  <a-modal
    :title="title"
    :width="800"
    placement="right"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="复制"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
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
              <a-form-item label="用户名">
                <a-input
                  placeholder="输入用户名查找"
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
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="userId"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          @change="handleTableChange"
        >
          <span
            slot="role"
            slot-scope="text, record"
          >
            <template v-for="(item, key) in record.roleList">
              <a-tag
                :key="key"
                color="blue"
              >{{ item.roleName }}</a-tag>
            </template>
          </span>
          <span
            slot="lockFlag"
            slot-scope="text, record"
          >
            <a-tag
              color="cyan"
              v-if="!record.lockFlag"
            >正常</a-tag>
            <a-tag
              color="red"
              v-else
            >锁定</a-tag>
          </span>
        </a-table>
      </div>
      <!-- table区域-end -->

    </a-spin>
  </a-modal>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'UserListModal',
    mixins: [JeecgListMixin],
    components:{
    },
    data() {
      return {
        title: '员工列表',
        visible:false,
        confirmLoading:false,
        sourceUser:[],
        // 表头
        columns: [
          {
            title: '姓名',
            align: 'center',
            dataIndex: 'nickname',
            width:100
          },
          {
            title: '登录账户名',
            align: 'center',
            dataIndex: 'username',
            width:100
          },
          {
            title: '角色名称',
            align: 'center',
            dataIndex: 'roleList',
            width:200,
            scopedSlots: { customRender: 'role' },
          },
          {
            title: '所属机构',
            align: 'center',
            dataIndex: 'deptName',
            ellipsis: true,
          },
          {
            title: '用户状态',
            align: 'center',
            dataIndex: 'lockFlag',
            width:100,
            scopedSlots: { customRender: 'lockFlag' },
          },
        ],
        url: {
          list: 'admin/user/page/wxhr',
          copyAuth:'/hrBase/tcutsomerdatapermisson/copy',
        },
      }
    },
    methods: {
      showModal(arr){
        this.sourceUser = arr
        this.visible = true
      },
      // 
      handleCancel() {
        this.queryParam = {}
        this.sourceUser = []
        this.loadData()
        this.visible = false
      },
      // 复制权限
      handleOk(){
        if(this.selectedRowKeys.length == 0) {
          this.$message.warning('请先选择用户')
          return false
        }
        this.confirmLoading = true
        let url = this.url.copyAuth + '?srcUser=' + this.sourceUser + '&beUser=' + this.selectedRowKeys
        httpAction(url,null,'get').then((res)=>{
          if(res.code == 200){
            this.$message.success(res.msg)
            this.handleCancel()
            this.$emit('ok')
          }else{
            this.$message.warning(res.msg)
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },

    }
  }
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.ant-card-body .table-operator {
  margin-bottom: 18px;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}

.ant-btn-danger {
  background-color: #ffffff;
}

.ant-modal-cust-warp {
  height: 100%;
}
</style>
