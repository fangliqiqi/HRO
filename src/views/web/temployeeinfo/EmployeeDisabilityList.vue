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
        v-has="'wxhr:tempdisabilityinfo_add'"
      >新增</a-button>
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item v-has="'wxhr:tempdisabilityinfo_importListAdd'">
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
            @click="downloadLocalTemplate('/templates/员工伤残模板.xls')"
            v-has="'wxhr:tempdisabilityinfo_importListAdd'"
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
            v-has="'wxhr:tempdisabilityinfo_edit'"
          />
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:tempdisabilityinfo_edit'"
          >编辑</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tempdisabilityinfo_del'"
          />
          <a-popconfirm
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
            v-has="'wxhr:tempdisabilityinfo_del'"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <employee-disability-modal
      ref="employeeDisabilityModal"
      @ok="modalFormOk"
    ></employee-disability-modal>
    <employee-disability-detail-modal ref="employeeDisabilityDetailModal"></employee-disability-detail-modal>
    <error-modal ref="errorModal"></error-modal>

  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import ErrorModal from '../global/modules/ErrorModal'
  import { getAllSettleDomainSelectVos } from '@/api/api'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import EmployeeDisabilityModal from './modules/EmployeeDisabilityModal'
  import EmployeeDisabilityDetailModal from './modules/EmployeeDisabilityDetailModal'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'EmployeeDisabilityList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      EmployeeDisabilityModal,
      EmployeeDisabilityDetailModal,
    },
    data() {
      return {
        description: '员工伤残信息',
        filterDictText,
        //枚举字段
        allSettleDomainOptions: {},  // 结算主体和所属单位
        disabilityLevelOptions: [], // 伤残等级
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        injuryIdentificationOptions: {'0': {'option': '是', 'color': 'green'}, '1': {'option': '否', 'color': 'red'}},  // 是否工伤
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
            title: '伤残病名称',
            align: 'center',
            dataIndex: 'disabilityName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
            ellipsis: true,
            title: '职业病名称',
            align: 'center',
            dataIndex: 'occupationalDisease',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '伤残等级',
            align: 'center',
            dataIndex: 'disabilityLevel',
            customRender:(text) => {
              const str = filterDictText(this.disabilityLevelOptions, text)
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 130,
            ellipsis: true,
            title: '伤残开始日期',
            align: 'center',
            dataIndex: 'startTime',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 130,
            ellipsis: true,
            title: '伤残结束日期',
            align: 'center',
            dataIndex: 'endTime',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '是否工伤',
            align: 'center',
            dataIndex: 'injuryIdentification',
            customRender:(text) => {
              const color = this.injuryIdentificationOptions.hasOwnProperty(text) ? this.injuryIdentificationOptions[text].color : 'blue'
              const str = this.injuryIdentificationOptions.hasOwnProperty(text) ? this.injuryIdentificationOptions[text].option : '-'
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
          list: 'hrBase/tempdisabilityinfo/page?deleteFlag=0',
          delete: 'hrBase/tempdisabilityinfo/',
          deleteBatch: 'hrBase/tempdisabilityinfo/deleteBatch',
          templateUrl: 'hrBase/templateInfo/template?fileName=',
          exportXlsUrl: 'hrBase/tempdisabilityinfo/exportXls',
          importExcelUrl: 'hrBase/tempdisabilityinfo/importListAdd',
          queryAllInfoById: 'hrBase/tempdisabilityinfo/vo/',
        },
      }
    },
    created() {
      // 结算主体和所属单位（所有）
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
        this.$refs.employeeDisabilityModal.id = 0
        this.$refs.employeeDisabilityModal.title = '伤残信息新增'
        this.$refs.employeeDisabilityModal.settleDomainBelongs = this.allSettleDomainOptions
        this.$refs.employeeDisabilityModal.disabilityLevelBelongs = this.disabilityLevelOptions
        this.$refs.employeeDisabilityModal.injuryIdentificationBelongs = this.injuryIdentificationOptions
        if (Object.keys(this.allSettleDomainOptions).length > 0 && this.disabilityLevelOptions.length > 0) {
          this.$refs.employeeDisabilityModal.add()
        } else {
          if (Object.keys(this.allSettleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return
          }
          if (this.disabilityLevelOptions.length === 0) {
            this.$message.error(`"伤残等级"${this.loadMessage}`)
          }
        }
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.employeeDisabilityModal.id = record.id
        this.$refs.employeeDisabilityModal.title = '伤残信息编辑'
        this.$refs.employeeDisabilityModal.disabilityLevelBelongs = this.disabilityLevelOptions
        this.$refs.employeeDisabilityModal.injuryIdentificationBelongs = this.injuryIdentificationOptions
        if (this.disabilityLevelOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, {}, 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.employeeDisabilityModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.disabilityLevelOptions.length === 0) {
            this.$message.error(`"伤残等级"${this.loadMessage}`)
          }
        }
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.employeeDisabilityDetailModal.title = '伤残信息详情'
        this.$refs.employeeDisabilityDetailModal.disabilityLevelBelongs = this.disabilityLevelOptions
        this.$refs.employeeDisabilityDetailModal.injuryIdentificationBelongs = this.injuryIdentificationOptions
        if (this.disabilityLevelOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, {}, 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.employeeDisabilityDetailModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.disabilityLevelOptions.length === 0) {
            this.$message.error(`"伤残等级"${this.loadMessage}`)
          }
        }
      },
      // 数据字典
      initDictConfig() {
        // 伤残等级
        initDictOptions('disability_grade').then((res) => {
          if (Number(res.code) === 200) {
            this.disabilityLevelOptions = res.data
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
