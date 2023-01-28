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
            <a-form-item
              label="所属机构"
              class="stepFormText"
            >
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="请选择所属机构查询"
                v-model="queryParam.organId"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(value, key) in organizationOptions"
                  :key="key"
                  :value="value.id"
                >{{ value.organName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="户名称">
              <a-input
                placeholder="请输入户名称查询"
                v-model="queryParam.name"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="状态"
              class="stepFormText"
            >
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="请选择状态查询"
                v-model="queryParam.delFlag"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(value, key) in statusOptions"
                  :key="key"
                  :value="key"
                >{{ value.option }}</a-select-option>
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        @click="handleAdd"
        v-has="'wxhr:syshouseholdinfo_add'"
      >新增</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
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
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">详情</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:syshouseholdinfo_edit'"
          />
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:syshouseholdinfo_edit'"
          >编辑</a>
          <a-divider
            v-if="record.delFlag == 0 || record.delFlag == 1"
            type="vertical"
            v-has="'wxhr:syshouseholdinfo_edit'"
          />
          <a-popconfirm
            v-if="record.delFlag == 0"
            title="确定禁用吗?"
            @confirm="() => handleEditStatus(record)"
            v-has="'wxhr:syshouseholdinfo_edit'"
          >
            <a>禁用</a>
          </a-popconfirm>
          <a-popconfirm
            v-else-if="record.delFlag == 1"
            title="确定启用吗?"
            @confirm="() => handleEditStatus(record)"
            v-has="'wxhr:syshouseholdinfo_edit'"
          >
            <a>启用</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <house-hold-modal
      ref="houseHoldModal"
      @ok="modalFormOk"
    ></house-hold-modal>
    <error-modal ref="errorModal"></error-modal>
  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { getOrganization } from '@/api/api'
  import HouseHoldModal from './modules/HouseHoldModal'
  import ErrorModal from '../../global/modules/ErrorModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: 'HouseHoldSetting',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      HouseHoldModal,
    },
    data() {
      return {
        description: '户配置',
        // 枚举字段
        organizationOptions: [],  // 组织架构
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        statusOptions: {'0': {'option': '启用', 'color': 'green'}, '1': {'option': '禁用', 'color': 'red'}},
        // excel表头数据
        exportFields: [],
        // 表头
        columns: [
          {
            width: 270,
            ellipsis: true,
            title: '所属机构',
            align: 'center',
            dataIndex: 'organId',
            customRender:(text) => {
              let str = '-'
              for (const item of this.organizationOptions) {
                if (String(text) === String(item.id)) {
                  str = item.organName
                  break
                }
              }
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 270,
            ellipsis: true,
            title: '户名称',
            align: 'center',
            dataIndex: 'name',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'delFlag',
            customRender:(text) => {
              const color = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].color : 'blue'
              const str = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 170,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrSocial/syshouseholdinfo/page',
          queryAllInfoById: 'hrSocial/syshouseholdinfo/',
          disableOrEnableUrl: 'hrSocial/syshouseholdinfo/updateDelFlag',
        },
      }
    },
    created() {
      // 获取组织架构
      getOrganization().then((res) => {
        if (res.code === 200) {
          this.organizationOptions = res.data
        } else {
          this.$message.error('组织架构请求失败！')
        }
      })
    },
    methods: {
      // 新建
      handleAdd: function() {
        this.$refs.houseHoldModal.title = '新增'
        this.$refs.houseHoldModal.organizationOptions = this.organizationOptions
        if (this.organizationOptions.length) {
          this.$refs.houseHoldModal.add()
        } else {
          if (this.organizationOptions.length === 0) {
            this.$message.error(`"机构"${this.loadMessage}`)
          }
        }
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.houseHoldModal.title = '详情'
        this.$refs.houseHoldModal.editButton = false
        this.$refs.houseHoldModal.organizationOptions = this.organizationOptions
        if (this.organizationOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.houseHoldModal.edit(res.data)
            } else {
              this.$message.error('数据请求失败！')
            }
          })
        } else {
          if (this.organizationOptions.length === 0) {
            this.$message.error(`"机构"${this.loadMessage}`)
          }
        }
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.houseHoldModal.title = '编辑'
        this.$refs.houseHoldModal.organizationOptions = this.organizationOptions
        if (this.organizationOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.houseHoldModal.edit(res.data)
            } else {
              this.$message.error('数据请求失败！')
            }
          })
        } else {
          if (this.organizationOptions.length === 0) {
            this.$message.error(`"机构"${this.loadMessage}`)
          }
        }
      },
      // 禁用和启用
      handleEditStatus: function(record) {
        const delFlag = Number(record.delFlag) === 1 ? 0 : 1
        const reqUrl = `${this.url.disableOrEnableUrl}?id=${record.id}&delFlag=${delFlag}`
        httpAction(reqUrl, '', 'POST').then((res) => {
          if (Number(res.code) === 200) {
            this.$message.success('操作成功！')
            this.loadData()
            this.onClearSelected()
          } else {
            this.$message.warning(res.message || res.msg)
          }
        })
      },
      // 数据字典
      initDictConfig() {
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

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
