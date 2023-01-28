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
              <a-input
                placeholder="请输入用户名"
                v-model="queryParam.nickname"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="4"
            :sm="6"
          >
            <a-form-item label="账号">
              <a-input
                placeholder="输入账号"
                v-model="queryParam.username"
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
              :md="8"
              :sm="10"
            >
              <a-form-item
                label="适用范围"
                placeholder="适用范围"
              >
                <a-select
                  mode="multiple"
                  :value="mvalue"
                  @change="changeScope"
                >
                  <a-select-option value="1">社保</a-select-option>
                  <a-select-option value="2">公积金</a-select-option>
                  <a-select-option value="3">档案</a-select-option>
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
          slot="status"
          slot-scope="text, record"
        >
          <a-tag
            color="green"
            v-if="record.status == 0"
          >正常</a-tag>
          <a-tag
            color="red"
            v-else
          >禁用</a-tag>
        </span>
        <span
          slot="adaptScope"
          slot-scope="text, record"
        >
          <a-tag
            color="cyan"
            v-if="record.socialFlag == 0"
          >社保</a-tag>
          <a-tag
            color="blue"
            v-if="record.fundFlag == 0"
          >公积金</a-tag>
          <a-tag
            color="pink"
            v-if="record.fileFlag == 0"
          >档案</a-tag>
        </span>
        <span
          slot="area"
          slot-scope="text, record"
        >
          {{ getAreaName(record.province,record.city,record.town) }}
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleEdit(record)">编辑</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:muserarea_status_update'"
          />
          <a-popconfirm
            title="确定操作吗?"
            ok-text="是"
            cancel-text="否"
            @confirm="handleStatus(record)"
            v-has="'wxhr:muserarea_status_update'"
          >
            <a v-if="record.status==0">禁用</a>
            <a v-else>启用</a>
          </a-popconfirm>

        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <region-authority-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></region-authority-modal>

  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAreaName } from '@/utils/common'
  import RegionAuthorityModal from './modules/RegionAuthorityModal'
  import { httpAction } from '@/api/manage'
  import SelectArea from '@/components/jeecg/SelectArea'

  export default {
    name: 'RegionAuthority',
    mixins: [JeecgListMixin],
    components: {
      SelectArea,
      RegionAuthorityModal
    },
    data() {
      return {
        description: '地区授权',
        mvalue:[],
        // 表头
        columns: [
          {
            title: '用户名',
            align: 'center',
            dataIndex: 'nickname',
            ellipsis: true,
          },
          {
            title: '账号',
            align: 'center',
            dataIndex: 'username',
            ellipsis: true,
          },
          {
            title: '使用状态',
            align: 'center',
            dataIndex: 'status',
            width:100,
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '适用范围',
            align: 'center',
            dataIndex: 'socialFlag',
            width:200,
            scopedSlots: { customRender: 'adaptScope' },
          },
          {
            title: '区域',
            align: 'center',
            dataIndex: 'province',
            scopedSlots: { customRender: 'area' },
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/hrBase/muserarea/page',
          changeStatus:'/hrBase/muserarea/status'
        }
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
        delete this.queryParam.socialFlag
        delete this.queryParam.fundFlag
        delete this.queryParam.fileFlag
        value.forEach((item)=>{
          if(item == 1){
            this.queryParam.socialFlag = 0
          }else if(item == 2){
            this.queryParam.fundFlag = 0
          }else{
            this.queryParam.fileFlag = 0
          }
        })
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
        this.$refs.modalForm.edit()
      },
      handleEdit(record){
        this.$refs.modalForm.method = 'PUT'
        this.$refs.modalForm.edit(record)
      },
      handleStatus(record){
        let url = this.url.changeStatus + '?id=' + record.id + '&status=' + ((record.status == 0) ? 1 : 0)
        httpAction(url,null,'POST').then((res)=>{
          if(res.code == 200){
            this.$message.success("操作成功！")
            this.loadData()
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