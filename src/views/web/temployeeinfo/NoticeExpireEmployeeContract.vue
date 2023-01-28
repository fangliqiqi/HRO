<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" >
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="员工编码">
              <a-input
                placeholder="请输入员工编码查询"
                v-model="queryParam.empNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="员工姓名">
              <a-input
                placeholder="请输入员工姓名查询"
                v-model="queryParam.empName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="身份证号">
              <a-input
                placeholder="请输入身份证号查询"
                v-model="queryParam.empIdcard"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="客户" >
                <select-page
                  :id="'customerName'"
                  :title="'customerName'"
                  placeholder="请选择客户查询"
                  v-model="queryParam.customerName"
                  :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体">
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
                label="档案地市"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="选择省份"
                  v-model="queryParam.fileProvince"
                  style="width: 32%"
                  @change="handleProvinceChange"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item, index) in areaTrees"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="选择城市"
                  v-model="queryParam.fileCity"
                  style="margin-left: 2%; width: 32%"
                  @change="handleCityChange"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item, index) in areaCitys"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="选择区县"
                  v-model="queryParam.fileTown"
                  style="margin-left: 2%; width: 32%"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item, index) in areaTowns"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="协议类型"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.empType"
                  placeholder="请选择协议类型查询"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item, index) in empTypeOptions"
                    :key="index"
                    :value="item.value"
                  >{{ item.label }}</a-select-option>
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
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        @click="exportContract"
        type="primary"
        icon="download"
      >导出</a-button>
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.batchFeedbackUrl,'post')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />批量导入反馈
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/员工合同到期反馈模板.xls')">
            <a-icon type="download" />模板下载</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量导入反馈
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
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
          <a @click="handleShow(record)">详情</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <export-field-modal ref="exportFieldModal"></export-field-modal>
    <contract-detail-modal ref="ContractDetailModal"></contract-detail-modal>
    <error-modal
      ref="errorModal"
      @ok="modalFormOk"
    ></error-modal>
  </a-card>
</template>

<script>
  import Vue from 'vue'
  import { areaMapTrees } from '@/api/api'
  import { httpAction,httpActionHeader } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ContractDetailModal from './modules/ContractDetailModal'
  import ExportFieldModal from '../global/modules/ExportFieldModal'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import XLSX from 'xlsx'
  import { handleImportData } from '@/utils/common'
  import ErrorModal from '../global/modules/ErrorModal'
  
  export default {
    name: 'NoticeExpireEmployeeContract',
    mixins: [JeecgListMixin],
    components: {
      SelectPage,
      ContractDetailModal,
      ExportFieldModal,
      ErrorModal
    },
    data() {
      return {
        description: '员工合同到期列表',
        importUrl: '', //导入地址
        importMethod: '', //导入方法
        fileList: [],
        //字典数组缓存
        areaTrees: [],  // 地区
        areaCitys: [],  // 档案城市
        areaTowns: [],  // 档案区县
        areaMapTrees:[],
        empTypeOptions: [], // 员工类型
        workingHoursOptions:[],
        situationTypeOptions:[],
        employeeContractTypeOptions: [],
        typeOptions: {
          '1': {'option': '30日内到期预警', 'color': 'green'},
          '2': {'option': '60日内过期提醒', 'color': 'red'},
          '3': {'option': '过期1一个月内', 'color': 'red'},
          '4': {'option': '过期4个月内', 'color': 'red'},
          '5': {'option': '过期4以外', 'color': 'red'},
          '6': {'option': '60外到期预警', 'color': 'red'},
          },
        // 表头
        columns: [
          {
            width: 165,
            ellipsis: true,
            title: '员工编码',
            align: 'center',
            dataIndex: 'empNo',
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
            width: 160,
            ellipsis: true,
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcard',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 200,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'departName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 200,
            ellipsis: true,
            title: '客户',
            align: 'center',
            dataIndex: 'customerName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '档案地市',
            align: 'center',
            dataIndex: 'fileProvince',
            customRender:(text, record) => {
              const name = this.getAreaMapName(record.fileProvince, record.fileCity, record.fileTown)
              const str = name ? name : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 200,
            ellipsis: true,
            title: '合同名称',
            align: 'center',
            dataIndex: 'contractName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 130,
            ellipsis: true,
            title: '合同编码',
            align: 'center',
            dataIndex: 'contractNo',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '合同类型',
            align: 'center',
            dataIndex: 'contractType',
            customRender:(text) => {
              const str = filterDictText(this.employeeContractTypeOptions,text)
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 200,
            ellipsis: true,
            title: '合同起止时间',
            align: 'center',
            dataIndex: 'contractStart',
            customRender:(text, record) => {
              const str = `${text}~${record.contractEnd}`
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '距离到期天数',
            align: 'center',
            dataIndex: 'diffDays',
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
            title: '操作',
            key: 'operations',
            align: 'center',
            width: 100,
            fixed:'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/hrBase/temployeecontractinfo/pageOverdue',
          getOne: '/hrBase/temployeecontractinfo/vo/',
          batchFeedbackUrl:'/hrBase/temployeecontractinfo/warnBatchFeedBack', // 员工合同到期提醒批量反馈
        }
      }
    },
    created() {
      // 地区
      this.areaTrees = Vue.ls.get('glob_area')
      areaMapTrees().then((res) => {
        if (res.code === 200) {
          this.areaMapTrees = res.data
        }
      })
    },
    methods: {
      // 导出
      exportContract() {
        this.$refs.exportFieldModal.method = 'GET'
        this.$refs.exportFieldModal.title = '合同到期列表'
        this.$refs.exportFieldModal.url.exportXlsUrl = '/hrBase/temployeecontractinfo/export'
        this.$refs.exportFieldModal.url.exportFields = '/hrBase/temployeecontractinfo/getExportFieldName'
        this.$refs.exportFieldModal.params = this.getQueryParams()//查询条件
        this.$refs.exportFieldModal.add(this.selectedRowKeys)
      },
      // 员工合同详情
      handleShow(record) {
        this.$refs.ContractDetailModal.title = '客户合同查看'
        this.$refs.ContractDetailModal.employeeContractTypeOptions = this.employeeContractTypeOptions
        this.$refs.ContractDetailModal.workingHoursOptions = this.workingHoursOptions
        this.$refs.ContractDetailModal.situationTypeOptions = this.situationTypeOptions
        httpAction(this.url.getOne + record.id, null, "GET").then((res) => {
          if (Number(res.code) === 200) {
            if (res.data) {
              res.data.customerName = record.customerName
              res.data.departName = record.departName
            }
            this.$refs.ContractDetailModal.edit(res.data)
          } else {
            this.$message.error(res.msg)
          }
        });
      },
      // 档案省份切换
      handleProvinceChange(value) {
        this.areaCitys = []
        this.areaTowns = []
        if (value) {
          for (var c of this.areaTrees[value - 1].children) {
            this.areaCitys.push(c)
          }
        }
        delete this.queryParam.fileCity
        delete this.queryParam.fileTown
      },
      // 档案城市切换
      handleCityChange(value) {
        this.areaTowns = []
        if (value) {
          for (var c of this.areaCitys) {
            if (String(c.id) === String(value)) {
              if (c.children.length > 0) {
                for (var t of c.children) {
                  this.areaTowns.push(t)
                }
              }
            break
            }
          }
        }
        delete this.queryParam.fileTown
      },
      // 地区显示转换
      getAreaMapName(pid, cid, aid) {
        let area = ''
        if(pid){
          area += this.areaMapTrees.hasOwnProperty(pid) ? this.areaMapTrees[pid].areaName : '-'
        }
        if(cid){
          area += `-${(this.areaMapTrees.hasOwnProperty(cid) ? this.areaMapTrees[cid].areaName : '-')}`
        }
        if(aid){
          area += `-${(this.areaMapTrees.hasOwnProperty(aid) ? this.areaMapTrees[aid].areaName : '-')}`
        }
        return area
      },
      // 重置按钮
      searchReset() {
        this.queryParam = {}
        this.areaCitys = []
        this.areaTowns = []
        this.loadData(1)
      },
      // 加载数据字典
      initDictConfig() {
        // 员工类型
        initDictOptions('personnel_type').then((res) => {
          if (res.code === 200) {
            this.empTypeOptions = res.data
          }
        })
        // 员工合同类型
        initDictOptions('employee_contract_type').then((res) => {
          if (res.code === 200) {
            this.employeeContractTypeOptions = res.data
          }
        })
        // 工时制
        initDictOptions('working_hours').then((res) => {
          if (res.code === 200) {
            this.workingHoursOptions = res.data
          }
        })
        // 签订情况
        initDictOptions('situation_type').then((res) => {
          if (res.code === 200) {
            this.situationTypeOptions = res.data
          }
        })
      },
      // 文件上传前
      beforeUpload(file) {
        this.fileList = [file]
        return false
      },
      //单个文件上传
      handleImport(url, method) {
        this.importUrl = url
        this.importMethod = method
        const { fileList } = this
        const formData = new FormData()
        fileList.forEach(file => {
          formData.append('files[]', file)
        })
        this.uploadFilesChange(fileList[0])
      },
      uploadFilesChange(file) {
        // 通过FileReader对象读取文件
        const fileReader = new FileReader()
        fileReader.onload = event => {
          try {
            const { result } = event.target
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary' })
            // 存储获取到的数据
            const data = {}
            let sheetName = ''
            // 遍历获取每张工作表 除去隐藏表
            const allSheets = workbook.Workbook.Sheets
            for (const index in allSheets) {
              const name = allSheets[index].name
              if (workbook.Sheets.hasOwnProperty(name) && allSheets[index].Hidden === 0) {
                sheetName = name
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name], { defval: '', blankrows: true }))
                break
              }
            }
            // 去除空格 最后的空格行
            const newData = handleImportData(data[sheetName])
            const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
            const requestTimeOut = 600000 // 请求过期时间
            httpActionHeader(
              this.importUrl,
              JSON.stringify(newData),
              this.importMethod,
              contextType,
              requestTimeOut
            ).then(res => {
              const msg = res.message || res.msg
              if (res.code === 200) {
                if (res.errorMessageList.length) {
                  this.$refs.errorModal.title = `导入提示: ${msg}`
                  this.$refs.errorModal.message = msg
                  this.$refs.errorModal.showModal(res.errorMessageList)
                  return false
                }
                this.$message.success('上传成功！')
                this.loadData()
              } else {
                if (res.data != null && res.data.length > 0) {
                  this.$refs.errorModal.title = `导入提示: ${msg}`
                  this.$refs.errorModal.message = msg
                  this.$refs.errorModal.showModal(res.data)
                } else {
                  this.$message.error(msg)
                }
              }
            })
          } catch (e) {
            // 这里可以抛出文件类型错误不正确的相关提示
            this.$message.error('文件上传错误！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file)
      },
      // 模板
      handleDownloadTemplate(templateUrl) {
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

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
