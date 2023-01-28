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
            <a-form-item
              label="结算主体"
              class="stepFormText"
            >
              <select-page
                :id="'id'"
                :title="'departName'"
                placeholder="请选择结算主体查询"
                v-model="queryParam.settleDomain"
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="单位"
              class="stepFormText"
            >
              <select-page
                :id="'id'"
                :title="'customerName'"
                placeholder="请选择单位查询"
                v-model="queryParam.belongUnit"
                :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
              ></select-page>
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
        v-has="'wxhr:tempeducation_add'"
      >新增</a-button>
      <a-button
        type="primary"
        icon="download"
        @click="handleDown"
        :loading="confirmLoading"
        v-has="'wxhr:tempeducation_export'"
      >导出</a-button>
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item v-has="'wxhr:tempeducation_importListAdd'">
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
            @click="downloadLocalTemplate('/templates/员工学历模板.xls')"
            v-has="'wxhr:tempeducation_importListAdd'"
          >
            <a-icon type="download" />导入模板
          </a-menu-item>
        </a-menu>
        <a-button>批量导入
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item v-has="'wxhr:tempeducation_importListAdd'">
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.modifyUrl,600000,'更新成功！')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量更新
            </a-upload>
          </a-menu-item>
          <a-menu-item
            @click="downloadLocalTemplate('/templates/批量更新员工学历模板.xls')"
            v-has="'wxhr:tempeducation_edit'"
          >
            <a-icon type="download" />下载模板
          </a-menu-item>
        </a-menu>
        <a-button>批量更新
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <!-- table区域-begin -->
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">详情</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tempeducation_edit'"
          />
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:tempeducation_edit'"
          >编辑</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tempeducation_del'"
          />
          <a-popconfirm
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
            v-has="'wxhr:tempeducation_del'"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <employee-education-modal
      ref="employeeEducationModal"
      @ok="modalFormOk"
    ></employee-education-modal>
    <employee-education-detail-modal ref="employeeEducationDetailModal"></employee-education-detail-modal>
    <error-modal ref="errorModal"></error-modal>

  </a-card>
</template>

<script>
  import { httpAction,downFile } from '@/api/manage'
  import ErrorModal from '../global/modules/ErrorModal'
  import { getAllSettleDomainSelectVos } from '@/api/api'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import EmployeeEducationModal from './modules/EmployeeEducationModal'
  import EmployeeEducationDetailModal from './modules/EmployeeEducationDetailModal'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'EmployeeEducationList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      EmployeeEducationModal,
      EmployeeEducationDetailModal,
      SelectPage
    },
    data() {
      return {
        description: '学历信息',
        filterDictText,
        //枚举字段
        educationOptions: [], // 学历级别
        educationTypeOptions: [], // 学历类型
        educationSystemOptions: [], // 学制类型
        allSettleDomainOptions: {},  // 结算主体和所属单位
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        hightIdentificationOptions: {'0': {'option': '是', 'color': 'green'}, '1': {'option': '否', 'color': 'red'}}, // 最高学历
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
            width: 150,
            ellipsis: true,
            title: '学校',
            align: 'center',
            dataIndex: 'school',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '院系名称',
            align: 'center',
            dataIndex: 'collageSystem',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '专业',
            align: 'center',
            dataIndex: 'bachelorScience',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '学历',
            align: 'center',
            dataIndex: 'educationName',
            customRender:(text) => {
              const str = filterDictText(this.educationOptions, text)
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '学历类型',
            align: 'center',
            dataIndex: 'type',
            customRender:(text) => {
              const str = filterDictText(this.educationTypeOptions, text)
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '最高学历',
            align: 'center',
            dataIndex: 'hightIdentification',
            customRender:(text) => {
              const color = this.hightIdentificationOptions.hasOwnProperty(text) ? this.hightIdentificationOptions[text].color : 'blue'
              const str = this.hightIdentificationOptions.hasOwnProperty(text) ? this.hightIdentificationOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '学制类型',
            align: 'center',
            dataIndex: 'educationSystem',
            customRender:(text) => {
              const str = filterDictText(this.educationSystemOptions, text)
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '入学时间',
            align: 'center',
            dataIndex: 'entryDate',
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
            width: 180,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrBase/tempeducation/page?deleteFlag=0',
          delete: 'hrBase/tempeducation/',
          deleteBatch: 'hrBase/tempeducation/deleteBatch',
          templateUrl: 'hrBase/templateInfo/template?fileName=',
          exportXlsUrl: 'hrBase/tempeducation/exportXls',
          importExcelUrl: 'hrBase/tempeducation/importListAdd',
          modifyUrl:'hrBase/tempeducation/importListUpdate',
          queryAllInfoById: 'hrBase/tempeducation/vo/',
          getOrganAll: '/admin/organizationinfo/getOrgForCus?type=0',
        },
        organAll:[],
        confirmLoading:false
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
      httpAction(this.url.getOrganAll,'','GET').then((res) => {
        if(res.code === 200 && res.data.length > 0) {
          this.organAll = res.data;
        }
      })
    },
    methods: {
      getPopupContainerFun(triggerNode){
        let wid = getComputedStyle(triggerNode).width
        triggerNode.setAttribute('style','width:'+wid)
        return triggerNode.parentNode
      },
      // 新建
      handleAdd: function() {
        this.$refs.employeeEducationModal.id = 0
        this.$refs.employeeEducationModal.title = '学历信息新增'
        this.$refs.employeeEducationModal.educationBelongs = this.educationOptions
        this.$refs.employeeEducationModal.educationTypeBelongs = this.educationTypeOptions
        this.$refs.employeeEducationModal.educationSystemBelongs = this.educationSystemOptions
        this.$refs.employeeEducationModal.settleDomainBelongs = this.allSettleDomainOptions
        this.$refs.employeeEducationModal.hightIdentificationBelongs = this.hightIdentificationOptions
        if (Object.keys(this.allSettleDomainOptions).length > 0 && this.educationSystemOptions.length > 0) {
          this.$refs.employeeEducationModal.add()
        } else {
          if (Object.keys(this.allSettleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return
          }
          if (this.educationSystemOptions.length === 0) {
            this.$message.error(`"学制类型"${this.loadMessage}`)
          }
        }
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.employeeEducationModal.id = record.id
        this.$refs.employeeEducationModal.title = '学历信息编辑'
        this.$refs.employeeEducationModal.educationBelongs = this.educationOptions
        this.$refs.employeeEducationModal.educationTypeBelongs = this.educationTypeOptions
        this.$refs.employeeEducationModal.educationSystemBelongs = this.educationSystemOptions
        this.$refs.employeeEducationModal.hightIdentificationBelongs = this.hightIdentificationOptions
        if (this.educationSystemOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, {}, 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.employeeEducationModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.educationSystemOptions.length === 0) {
            this.$message.error(`"学制类型"${this.loadMessage}`)
          }
        }
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.employeeEducationDetailModal.title = '学历信息详情'
        this.$refs.employeeEducationDetailModal.educationBelongs = this.educationOptions
        this.$refs.employeeEducationDetailModal.educationTypeBelongs = this.educationTypeOptions
        this.$refs.employeeEducationDetailModal.educationSystemBelongs = this.educationSystemOptions
        this.$refs.employeeEducationDetailModal.hightIdentificationBelongs = this.hightIdentificationOptions
        if (this.educationSystemOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, {}, 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.employeeEducationDetailModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.educationSystemOptions.length === 0) {
            this.$message.error(`"学制类型"${this.loadMessage}`)
          }
        }
      },
      handleDown(){
        
        let param = ''
        if(Object.keys(this.queryParam).length){
          const qs = require('qs')
          param += qs.stringify(this.queryParam)
        }
        if(this.selectedRowKeys.length){
          param += `&idStr=${this.selectedRowKeys.join(',')}`
        }else{
          if(!this.queryParam.belongUnit && !this.queryParam.settleDomain){
            this.$message.warning(`请先选择单位或者结算主体！`)
            return
          }
        }
        const url = `hrBase/tempeducation/doexport?${param}`
        this.confirmLoading = true
        downFile(url, null).then((res) => {
          if (res.size > 0) {
            var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
            var downloadElement = document.createElement('a')
            var href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.href = href
            downloadElement.download = `员工学历信息.xls` // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
            this.$message.success('导出成功！')
          } else {
            this.$message.warning(`导出失败!`)
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      // 数据字典
      initDictConfig() {
        // 学历级别
        initDictOptions('education').then((res) => {
          if (Number(res.code) === 200) {
            this.educationOptions = res.data
          }
        })
        // 学历类型
        initDictOptions('education_type').then((res) => {
          if (Number(res.code) === 200) {
            this.educationTypeOptions = res.data
          }
        })
        // 学制类型
        initDictOptions('education_system').then((res) => {
          if (Number(res.code) === 200) {
            this.educationSystemOptions = res.data
          }
        })
      },
      // 模板
      downloadLocalTemplate(templateUrl) {
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
        window.location.href = url
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
