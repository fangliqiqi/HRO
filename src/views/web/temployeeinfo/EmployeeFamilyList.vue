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
        v-has="'wxhr:tempfamily_add'"
      >新增</a-button>
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item v-has="'wxhr:tempfamily_importListAdd'">
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
            @click="downloadLocalTemplate('/templates/员工家庭模板.xls')"
            v-has="'wxhr:tempfamily_importListAdd'"
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
            v-has="'wxhr:tempfamily_edit'"
          />
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:tempfamily_edit'"
          >编辑</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tempfamily_del'"
          />
          <a-popconfirm
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
            v-has="'wxhr:tempfamily_del'"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <employee-family-modal
      ref="employeeFamilyModal"
      @ok="modalFormOk"
    ></employee-family-modal>
    <employee-family-edit-modal
      ref="employeeFamilyEditModal"
      @ok="modalFormOk"
    ></employee-family-edit-modal>
    <employee-family-detail-modal ref="employeeFamilyDetailModal"></employee-family-detail-modal>
    <error-modal ref="errorModal"></error-modal>

  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import ErrorModal from '../global/modules/ErrorModal'
  import { getAllSettleDomainSelectVos } from '@/api/api'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import EmployeeFamilyModal from './modules/EmployeeFamilyModal'
  import EmployeeFamilyEditModal from './modules/EmployeeFamilyEditModal'
  import EmployeeFamilyDetailModal from './modules/EmployeeFamilyDetailModal'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'EmployeeFamilyList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      EmployeeFamilyModal,
      EmployeeFamilyEditModal,
      EmployeeFamilyDetailModal,
    },
    data() {
      return {
        description: '员工家庭信息',
        filterDictText,
        //枚举字段
        allSettleDomainOptions: {},  // 结算主体和所属单位
        relationshipSelfOptions: [],  // 与本人关系
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        // 表头
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
            width: 120,
            ellipsis: true,
            title: '成员姓名',
            align: 'center',
            dataIndex: 'familyName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '与本人关系',
            align: 'center',
            dataIndex: 'relationshipSelf',
            customRender:(text) => {
              const str = filterDictText(this.relationshipSelfOptions, text)
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '出生日期',
            align: 'center',
            dataIndex: 'birthday',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 270,
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
            width: 160,
            ellipsis: true,
            title: '联系电话',
            align: 'center',
            dataIndex: 'contractTel',
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
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrBase/tempfamily/page?deleteFlag=0',
          delete: 'hrBase/tempfamily/',
          deleteBatch: 'hrBase/tempfamily/deleteBatch/',
          templateUrl: 'hrBase/templateInfo/template?fileName=',
          exportXlsUrl: 'hrBase/tempfamily/doexport?deleteFlag=0',
          importExcelUrl: 'hrBase/tempfamily/importListAdd',
          queryAllInfoById: 'hrBase/tempfamily/',
        },
      }
    },
    created() {
      // 结算主体和所属单位
      getAllSettleDomainSelectVos().then((res) => {
        if (res.code === 200) {
          this.allSettleDomainOptions = res.data
        } else {
          this.$message.error('结算主体和所属单位数据请求失败！')
        }
      })
    },
    methods: {
      // 新建
      handleAdd: function() {
        this.$refs.employeeFamilyModal.title = '家庭信息新增'
        this.$refs.employeeFamilyModal.settleDomainBelongs = this.allSettleDomainOptions
        this.$refs.employeeFamilyModal.relationshipSelfBelongs = this.relationshipSelfOptions
        if (Object.keys(this.allSettleDomainOptions).length > 0 && this.relationshipSelfOptions.length > 0) {
          this.$refs.employeeFamilyModal.add()
        } else {
          if (Object.keys(this.allSettleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return
          }
          if (this.relationshipSelfOptions.length === 0) {
            this.$message.error(`"与本人关系"${this.loadMessage}`)
          }
        }
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.employeeFamilyEditModal.title = '家庭信息编辑'
        this.$refs.employeeFamilyEditModal.relationshipSelfBelongs = this.relationshipSelfOptions
        if (this.relationshipSelfOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, {}, 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.employeeFamilyEditModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.relationshipSelfOptions.length === 0) {
            this.$message.error(`"与本人关系"${this.loadMessage}`)
          }
        }
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.employeeFamilyDetailModal.title = '家庭信息详情'
        this.$refs.employeeFamilyDetailModal.relationshipSelfBelongs = this.relationshipSelfOptions
        if (this.relationshipSelfOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, {}, 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.employeeFamilyDetailModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.relationshipSelfOptions.length === 0) {
            this.$message.error(`"与本人关系"${this.loadMessage}`)
          }
        }
      },
      // 数据字典
      initDictConfig() {
        // 与本人关系
        initDictOptions('relationship_self').then((res) => {
          if (Number(res.code) === 200) {
            this.relationshipSelfOptions = res.data
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
