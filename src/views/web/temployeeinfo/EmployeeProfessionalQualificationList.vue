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
        v-has="'wxhr:tempprofessionalqualification_add'"
      >新增</a-button>
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item v-has="'wxhr:tempprofessionalqualification_importListAdd'">
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
            @click="downloadLocalTemplate('/templates/员工职业资格模板.xls')"
            v-has="'wxhr:tempprofessionalqualification_importListAdd'"
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
            v-has="'wxhr:tempprofessionalqualification_edit'"
          />
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:tempprofessionalqualification_edit'"
          >编辑</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tempprofessionalqualification_del'"
          />
          <a-popconfirm
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
            v-has="'wxhr:tempprofessionalqualification_del'"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <employee-professional-qualification-modal
      ref="employeeProfessionalQualificationModal"
      @ok="modalFormOk"
    ></employee-professional-qualification-modal>
    <employee-professional-qualification-detail-modal ref="employeeProfessionalQualificationDetailModal"></employee-professional-qualification-detail-modal>
    <error-modal ref="errorModal"></error-modal>

  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import ErrorModal from '../global/modules/ErrorModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAllSettleDomainSelectVos } from '@/api/api'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import EmployeeProfessionalQualificationModal from './modules/EmployeeProfessionalQualificationModal'
  import EmployeeProfessionalQualificationDetailModal from './modules/EmployeeProfessionalQualificationDetailModal'

  export default {
    name: 'EmployeeProfessionalQualificationList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      EmployeeProfessionalQualificationModal,
      EmployeeProfessionalQualificationDetailModal,
    },
    data() {
      return {
        description: '职业资格信息',
        filterDictText,
        //枚举字段
        obtainTypeOptions: [], // 获取方式
        allSettleDomainOptions: {},  // 结算主体和所属单位
        qualificationTypeOptions: [], // 资格类型
        qualificationLevelOptions: [],  // 资格等级
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        heightIdentificationOptions: {'0': {'option': '是', 'color': 'green'}, '1': {'option': '否', 'color': 'red'}},  // 最高资格
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
            title: '证书编号',
            align: 'center',
            dataIndex: 'certificationNo',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '申报年度',
            align: 'center',
            dataIndex: 'declareYear',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
            ellipsis: true,
            title: '评定机构',
            align: 'center',
            dataIndex: 'assessmentUnit',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '获取方式',
            align: 'center',
            dataIndex: 'obtainType',
            customRender:(text) => {
              const str = filterDictText(this.obtainTypeOptions, text)
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '资格类型',
            align: 'center',
            dataIndex: 'qualificationType',
            customRender:(text) => {
              const str = filterDictText(this.qualificationTypeOptions, text)
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '资格等级',
            align: 'center',
            dataIndex: 'qualificationLevel',
            customRender:(text) => {
              const str = filterDictText(this.qualificationLevelOptions, text)
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '是否最高资格',
            align: 'center',
            dataIndex: 'heightIdentification',
            customRender:(text) => {
              const color = this.heightIdentificationOptions.hasOwnProperty(text) ? this.heightIdentificationOptions[text].color : 'blue'
              const str = this.heightIdentificationOptions.hasOwnProperty(text) ? this.heightIdentificationOptions[text].option : '-'
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
          list: 'hrBase/tempprofessionalqualification/page?deleteFlag=0',
          delete: 'hrBase/tempprofessionalqualification/',
          deleteBatch: 'hrBase/tempprofessionalqualification/deleteBatch',
          templateUrl: 'hrBase/templateInfo/template?fileName=',
          exportXlsUrl: 'hrBase/tempprofessionalqualification/exportXls',
          importExcelUrl: 'hrBase/tempprofessionalqualification/importListAdd',
          queryAllInfoById: 'hrBase/tempprofessionalqualification/vo/',
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
        this.$refs.employeeProfessionalQualificationModal.id = 0
        this.$refs.employeeProfessionalQualificationModal.title = '职业资格新增'
        this.$refs.employeeProfessionalQualificationModal.obtainTypeBelongs = this.obtainTypeOptions
        this.$refs.employeeProfessionalQualificationModal.settleDomainBelongs = this.allSettleDomainOptions
        this.$refs.employeeProfessionalQualificationModal.qualificationTypeBelongs = this.qualificationTypeOptions
        this.$refs.employeeProfessionalQualificationModal.qualificationLevelBelongs = this.qualificationLevelOptions
        this.$refs.employeeProfessionalQualificationModal.heightIdentificationBelongs = this.heightIdentificationOptions
        if (Object.keys(this.allSettleDomainOptions).length > 0 && this.qualificationLevelOptions.length > 0) {
          this.$refs.employeeProfessionalQualificationModal.add()
        } else {
          if (Object.keys(this.allSettleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return
          }
          if (this.qualificationLevelOptions.length === 0) {
            this.$message.error(`"资格等级"${this.loadMessage}`)
            return
          }
        }
      },

      // 编辑
      handleEdit: function(record) {
        this.$refs.employeeProfessionalQualificationModal.id = record.id
        this.$refs.employeeProfessionalQualificationModal.title = '职业资格编辑'
        this.$refs.employeeProfessionalQualificationModal.obtainTypeBelongs = this.obtainTypeOptions
        this.$refs.employeeProfessionalQualificationModal.qualificationTypeBelongs = this.qualificationTypeOptions
        this.$refs.employeeProfessionalQualificationModal.qualificationLevelBelongs = this.qualificationLevelOptions
        this.$refs.employeeProfessionalQualificationModal.heightIdentificationBelongs = this.heightIdentificationOptions
        if (this.qualificationLevelOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, {}, 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.employeeProfessionalQualificationModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.qualificationLevelOptions.length === 0) {
            this.$message.error(`"资格等级"${this.loadMessage}`)
          }
        }
      },

      // 详情
      handleDetail: function(record) {
        this.$refs.employeeProfessionalQualificationDetailModal.title = '职业资格详情'
        this.$refs.employeeProfessionalQualificationDetailModal.obtainTypeBelongs = this.obtainTypeOptions
        this.$refs.employeeProfessionalQualificationDetailModal.qualificationTypeBelongs = this.qualificationTypeOptions
        this.$refs.employeeProfessionalQualificationDetailModal.qualificationLevelBelongs = this.qualificationLevelOptions
        this.$refs.employeeProfessionalQualificationDetailModal.heightIdentificationBelongs = this.heightIdentificationOptions
        if (this.qualificationLevelOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, {}, 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.employeeProfessionalQualificationDetailModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.qualificationLevelOptions.length === 0) {
            this.$message.error(`"资格等级"${this.loadMessage}`)
          }
        }
      },

      // 数据字典
      initDictConfig() {
        // 获取方式
        initDictOptions('obtain_type').then((res) => {
          if (Number(res.code) === 200) {
            this.obtainTypeOptions = res.data
          }
        })
        // 资格类型
        initDictOptions('qualification_type').then((res) => {
          if (Number(res.code) === 200) {
            this.qualificationTypeOptions = res.data
          }
        })
        // 资格等级
        initDictOptions('qualification_level').then((res) => {
          if (Number(res.code) === 200) {
            this.qualificationLevelOptions = res.data
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
