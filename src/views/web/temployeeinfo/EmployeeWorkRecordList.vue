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
            <a-form-item label="员工编码">
              <a-input
                placeholder="请输入员工编码"
                v-model="queryParam.empCode"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="员工姓名">
              <a-input
                placeholder="请输入员工姓名"
                v-model="queryParam.empName"
              ></a-input>
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
        v-has="'wxhr:tempworkrecording_add'"
      >新增</a-button>
      <!-- <a-button
        type="primary"
        icon="download"
        @click="handleExportXls"
        v-has="'wxhr:tempworkrecording_exportList'"
      >导出</a-button> -->
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item v-has="'wxhr:tempworkrecording_importListAdd'">
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.importExcelUrl)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量导入
            </a-upload>
          </a-menu-item>
          <a-menu-item
            @click="downloadLocalTemplate('/templates/员工工作记录模板.xls')"
            v-has="'wxhr:tempworkrecording_importListAdd'"
          >
            <a-icon type="download" />导入模板
          </a-menu-item>
        </a-menu>
        <a-button>批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
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
            v-has="'wxhr:tempworkrecording_edit'"
          />
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:tempworkrecording_edit'"
          >编辑</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tempworkrecording_del'"
          />
          <a-popconfirm
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
            v-has="'wxhr:tempworkrecording_del'"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <employee-work-modal
      ref="employeeWorkModal"
      @ok="modalFormOk"
    ></employee-work-modal>
    <employee-work-detail-modal ref="employeeWorkDetailModal"></employee-work-detail-modal>
    <error-modal ref="errorModal"></error-modal>

  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import ErrorModal from '../global/modules/ErrorModal'
  import { getAllSettleDomainSelectVos } from '@/api/api'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import EmployeeWorkModal from './modules/EmployeeWorkModal'
  import EmployeeWorkDetailModal from './modules/EmployeeWorkDetailModal'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'EmployeeWorkRecordList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      EmployeeWorkModal,
      EmployeeWorkDetailModal,
    },
    data() {
      return {
        description: '工作记录信息',
        filterDictText,
        //枚举字段
        workTypeOptions: [], // 工作类型
        allSettleDomainOptions: {},  // 结算主体和所属单位
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        workingStatusOptions: {'0': {'option': '在职', 'color': 'green'}, '1': {'option': '离职', 'color': 'red'}}, // 在职状态
        columns: [
          {
            width: 165,
            ellipsis: true,
            title: '员工编码',
            align: 'center',
            dataIndex: 'empCode',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '员工姓名',
            align: 'center',
            dataIndex: 'empName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
            ellipsis: true,
            title: '工作单位',
            align: 'center',
            dataIndex: 'workUnit',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
            ellipsis: true,
            title: '工作部门',
            align: 'center',
            dataIndex: 'workDepart',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
            ellipsis: true,
            title: '工作岗位',
            align: 'center',
            dataIndex: 'workJob',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '工作类型',
            align: 'center',
            dataIndex: 'workingType',
            customRender:(text) => {
              const str = filterDictText(this.workTypeOptions, text)
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '在职状态',
            align: 'center',
            dataIndex: 'workingStatus',
            customRender:(text) => {
              const color = this.workingStatusOptions.hasOwnProperty(text) ? this.workingStatusOptions[text].color : 'blue'
              const str = this.workingStatusOptions.hasOwnProperty(text) ? this.workingStatusOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '开始工作日期',
            align: 'center',
            dataIndex: 'startDate',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
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
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrBase/tempworkrecording/page?deleteFlag=0',
          delete: 'hrBase/tempworkrecording/',
          deleteBatch: 'hrBase/tempworkrecording/deleteBatch',
          templateUrl: 'hrBase/templateInfo/template?fileName=',
          exportXlsUrl: 'hrBase/tempworkrecording/exportXls',
          importExcelUrl: 'hrBase/tempworkrecording/importListAdd',
          queryAllInfoById: 'hrBase/tempworkrecording/',
        },
      }
    },
    created() {
      // 结算主体和所属单位（所有）
      getAllSettleDomainSelectVos().then((res) => {
        if (Number(res.code) === 200) {
          this.allSettleDomainOptions = res.data
        } else {
          this.$message.error('结算主体和所属单位数据请求失败！')
        }
      })
    },
    methods: {
      // 新建
      handleAdd: function() {
        this.$refs.employeeWorkModal.id = 0
        this.$refs.employeeWorkModal.title = '工作记录新增'
        this.$refs.employeeWorkModal.workTypeBelongs = this.workTypeOptions
        this.$refs.employeeWorkModal.settleDomainBelongs = this.allSettleDomainOptions
        this.$refs.employeeWorkModal.workingStatusBelongs = this.workingStatusOptions
        if (Object.keys(this.allSettleDomainOptions).length > 0 && this.workTypeOptions.length > 0) {
          this.$refs.employeeWorkModal.add()
        } else {
          if (Object.keys(this.allSettleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return
          }
          if (this.workTypeOptions.length === 0) {
            this.$message.error(`"工作类型"${this.loadMessage}`)
            return
          }
        }
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.employeeWorkModal.id = record.id
        this.$refs.employeeWorkModal.title = '工作记录编辑'
        this.$refs.employeeWorkModal.workTypeBelongs = this.workTypeOptions
        this.$refs.employeeWorkModal.workingStatusBelongs = this.workingStatusOptions
        if (this.workTypeOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, {}, 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.employeeWorkModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.workTypeOptions.length === 0) {
            this.$message.error(`"工作类型"${this.loadMessage}`)
          }
        }
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.employeeWorkDetailModal.title = '工作记录详情'
        this.$refs.employeeWorkDetailModal.workTypeBelongs = this.workTypeOptions
        this.$refs.employeeWorkDetailModal.workingStatusBelongs = this.workingStatusOptions
        if (this.workTypeOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, {}, 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.employeeWorkDetailModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.workTypeOptions.length === 0) {
            this.$message.error(`"工作类型"${this.loadMessage}`)
          }
        }
      },
      // 数据字典
      initDictConfig() {
        // 工作类型
        initDictOptions('work_type').then((res) => {
          if (Number(res.code) === 200) {
            this.workTypeOptions = res.data
          }
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

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}
</style>
