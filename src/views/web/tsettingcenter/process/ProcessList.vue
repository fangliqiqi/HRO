<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="名称">
              <a-input
                placeholder="请输入流程名称"
                v-model="queryParam.name"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="创建人">
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择创建人"
                v-model="queryParam.createUser"
              >
                <a-select-option
                  v-for="item in userList"
                  :key="item.userId"
                  :value="item.userId"
                >{{ item.nickname }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="流程状态">
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择流程状态"
                v-model="queryParam.type"
              >
                <a-select-option value="0">当前在用</a-select-option>
                <a-select-option value="1">历史</a-select-option>
              </a-select>
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
    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        @click="handleAdd"
        v-has="'yifu-module:tprocess_add'"
      >添加</a-button>
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
          <a
            @click="handleEdit(record)"
            v-has="'yifu-module:tprocess_edit'"
          >编辑</a>
          <a-divider
            type="vertical"
            v-has="'yifu-module:tprocess_edit'"
          />
          <a
            @click="handleEditProcess(record)"
            v-has="'yifu-module:tprocess_edit'"
          >编辑流程</a>
          <a-divider
            type="vertical"
            v-has="'yifu-module:tprocess_del'"
          />
          <a-popconfirm
            title="确定删除吗?"
            ok-text="是"
            cancel-text="否"
            @confirm="() => handleDelete(record.id)"
            v-has="'yifu-module:tprocess_del'"
          >
            <a>删除</a>
          </a-popconfirm>

        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <process-type-add-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></process-type-add-modal>
    <process-detail-modal ref="ProcessDetailModalForm"> </process-detail-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ProcessTypeAddModal from './modules/ProcessTypeAddModal'
  import ProcessDetailModal from './modules/ProcessDetailModal'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'ProcessList',
    mixins: [JeecgListMixin],
    components: {
      ProcessTypeAddModal,
      ProcessDetailModal
    },
    data() {
      return {
        description: '流程管理',
        userList:[],
        // 表头
        columns: [
          // {
          //   title: 'id',
          //   align: 'center',
          //   dataIndex: 'id',
          //   customRender:(text)=>{
          //     return <a-tooltip
          //       placement="topLeft"
          //       title={text}
          //     >{text}</a-tooltip>
          //   }
          // },
          {
            title: '流程名称',
            align: 'center',
            dataIndex: 'name',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          // {
          //   title: '流程标识',
          //   align: 'center',
          //   dataIndex: 'logoTitle',
          //   customRender:(text)=>{
          //     return <a-tooltip
          //       placement="topLeft"
          //       title={text}
          //     >{text}</a-tooltip>
          //   }
          // },
          {
            title: '流程描述',
            align: 'center',
            dataIndex: 'description',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: '流程创建人',
            align: 'center',
            dataIndex: 'createUser',
            customRender:(text)=>{
              const name = this.getUser(text)
              return <a-tooltip
                placement="topLeft"
                title={name}
              >{name}</a-tooltip>
            }
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createDate',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 180,
            ellipsis: true,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/process/tprocess/page',
          delete:'/process/tprocess/'
        }
      }
    },
    mounted() {
      httpAction('/admin/user/findWxOrganUsers',null,'GET').then((res)=>{
        if(res.code === 200){
          this.userList = res.data
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    methods: {

      handleAdd(){
        this.$refs.modalForm.title = '添加流程'
        this.$refs.modalForm.add()
      },
      getUser(id){
        for(const item of this.userList){
          if(item.userId == id){
            return item.nickname
          }
        }
        return '-'
      },
      handleEditProcess(record){
        this.$refs.ProcessDetailModalForm.show(record.id)
      },
      handleEdit(record){
        this.$refs.modalForm.title = '编辑流程'
        this.$refs.modalForm.method = 'put'
        this.$refs.modalForm.edit(record)
      }

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
</style>
