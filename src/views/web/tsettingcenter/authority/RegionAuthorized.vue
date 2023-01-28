<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="4"
            :sm="6"
          >
            <a-form-item label="用户名">
              <select-page
                :searchUrl="'admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                placeholder="请选择用户名查询"
                :id="'userId'"
                v-model="queryParam.userId"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="4"
            :sm="6"
          >
            <a-form-item label="账号">
              <a-input
                allowClear
                placeholder="输入账号"
                v-model="queryParam.userName"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="8"
            :sm="10"
          >
            <a-form-item label="区域">
              <select-area
                :triggerChange="true"
                @change="changeArea"
                ref="selectArea"
              ></select-area>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="适用范围"
              >
                <a-select
                  mode="multiple"
                  placeholder="请选择适用范围"
                  :value="mvalue"
                  @change="changeScope"
                >
                  <a-select-option value="1">社保</a-select-option>
                  <a-select-option value="2">公积金</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>

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
              <a
                @click="handleToggleSearch"
                style="margin-left: 8px"
              >
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        v-has="'wxhr:tareapermissionconf_add'"
        @click="handleAdd"
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
          slot="accountStatus"
          slot-scope="text, record"
        >
          <a-tag
            color="green"
            v-if="record.accountStatus == 0"
          >正常</a-tag>
          <a-tag
            color="red"
            v-else
          >禁用</a-tag>
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a 
            v-has="'wxhr:tareapermissionconf_add'"
            @click="handleEdit(record)"
          >编辑</a>
          <a-divider
            type="vertical"
          />
          <a-popconfirm
            title="确定删除吗?"
            ok-text="是"
            cancel-text="否"
            @confirm="handleStatus(record)"
          >
            <a v-has="'wxhr:tareapermissionconf_del'">删除</a>
          </a-popconfirm>

        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <region-authorized-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></region-authorized-modal>

  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAreaName } from '@/utils/common'
  import RegionAuthorizedModal from './modules/RegionAuthorizedModal'
  import { httpAction } from '@/api/manage'
  import SelectArea from '@/components/jeecg/SelectArea'
  import SelectPage from '@/components/jeecg/SelectPage'
  export default {
    name: 'RegionAuthorized',
    mixins: [JeecgListMixin],
    components: {
      SelectArea,
      SelectPage,
      RegionAuthorizedModal
    },
    data() {
      return {
        description: '地区授权(新)',
        mvalue:[],
        // 表头
        columns: [
          {
            title: '用户名',
            align: 'center',
            dataIndex: 'nickName',
            ellipsis: true,
          },
          {
            title: '账号',
            align: 'center',
            dataIndex: 'userName',
            ellipsis: true,
          },
          {
            title: '账号状态',
            align: 'center',
            dataIndex: 'accountStatus',
            scopedSlots: { customRender: 'accountStatus' },
          },
          {
            title: '适用范围及区域',
            align: 'center',
            dataIndex: 'areaContent',
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                   { text }
                </a-tooltip>
              )
            },
            width:500,
            ellipsis: true,
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/hrSocial/tareapermissionconf/page',
        },
      }
    },
    created(){
      // this.queryParam.scope_extra = []
    },
    methods: {
      getAreaName,
      changeArea(val,type){
        if(type == 1){
          this.queryParam.province = val
          delete this.queryParam.city
          delete this.queryParam.town
        }else if(type == 2){
          this.queryParam.city = val
          delete this.queryParam.town
        }else{
          this.queryParam.town = val
        }
      },
      changeScope(value){
        this.mvalue = value
        this.queryParam.rangeList = value.toString()
      },
      searchReset(){
        this.queryParam = {}
        this.selectedRowKeys = []
        this.mvalue = []
        this.$refs.selectArea.clearSelect()
        this.$router.push({
          query: {}
        })
        this.loadData(1)
      },
      handleAdd(){
        this.$refs.modalForm.show()
      },
      handleEdit(record){
        const id = record.id;
        httpAction(`/hrSocial/tareapermissionconf/${id}`,null,'GET').then(res=>{
          if(res.code==200){
            this.$refs.modalForm.edit(res.data)
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      // 删除
      handleStatus(record){
        const that = this;
        const num = that.dataSource&&that.dataSource.length==1?1:null
        let url = `/hrSocial/tareapermissionconf/${record.id}`
        httpAction(url,null,'DELETE').then((res)=>{
          if(res.code == 200){
            this.$message.success("操作成功！")
            that.loadData(num)
          }else{
            this.$message.warning(res.msg)
          }
        })
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
<style>
  .ant-tooltip{
    max-width: 400px !important;
  }
</style>
