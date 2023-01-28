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
                placeholder="请输入员工姓名"
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
                placeholder="请输入身份证号"
                v-model="queryParam.empIdcard"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
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
                label="在职状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.workFlag"
                  placeholder="请选择在职状态查询"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in workFlagOptions"
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
              <a-form-item
                label="是否在用"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.inUse"
                  placeholder="请选择是否在用查询"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in inUseOptions"
                    :key="key"
                    :value="key"
                  >{{ value.option }}</a-select-option>
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
        type="primary"
        icon="plus"
        @click="handleAdd"
        v-has="'wxhr:temployeecontractinfo_add'"
      >新增</a-button>
      <a-button
        type="primary"
        icon="download"
        @click="handleExport"
        v-has="'wxhr:temployeeinfo_exportList'"
      >导出</a-button>
      <a-button
        type="primary"
        icon="download"
        @click="handleExportExcel"
        v-has="'wxhr:temployeeinfo_exportHistoryList'"
      >导出[合并历史]</a-button>
      <!-- 批量新增 -->
      <a-dropdown v-has="'wxhr:temployeecontractinfo_importListAdd'">
        <a-menu slot="overlay">
          <a-menu-item>
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
              />批量新增
            </a-upload>
          </a-menu-item>
          <a-menu-item
            @click="downloadLocalTemplate('/templates/员工合同模板.xls')"
          >
            <a-icon type="download" />新增模板
          </a-menu-item>
        </a-menu>
        <a-button>批量新增
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- 批量续签 -->
      <a-dropdown v-has="'wxhr:temployeecontractinfo_importListRenewal'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.updateExcelUrl)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量续签
            </a-upload>
          </a-menu-item>
          <a-menu-item
            @click="downloadLocalTemplate('/templates/员工续签合同模板.xls')"
          >
            <a-icon type="download" />续签模板
          </a-menu-item>
        </a-menu>
        <a-button>批量续签
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- 批量更新档案柜号 -->
      <a-dropdown v-has="'wxhr:temployeecontractinfo_updateDocNumber'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.updateDocNumber)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量更新档案柜号
            </a-upload>
          </a-menu-item>
          <a-menu-item
            @click="downloadLocalTemplate('/templates/员工合同档案号更新模板.xls')"
          >
            <a-icon type="download" />更新档案柜号模板
          </a-menu-item>
        </a-menu>
        <a-button>批量更新档案柜号
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- 批量更新合同编号 -->
      <a-dropdown v-has="'wxhr:temployeecontractinfo_updateContractNo'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.updateContractNo)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量更新合同编号
            </a-upload>
          </a-menu-item>
          <a-menu-item
            @click="downTemplate('/templates/员工合同编号更新模板.xlsx')"
          >
            <a-icon type="download" />更新合同编号模板
          </a-menu-item>
        </a-menu>
        <a-button>批量更新合同编号
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
        :loading="loading || exportLoading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">详情</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:temployeecontractinfo_Renewal'"
          />
          <a
            @click="handleContractinfoRenewal(record)"
            v-has="'wxhr:temployeecontractinfo_Renewal'"
          >续签合同</a>
          <a-divider type="vertical" v-has="'wxhr:temployeecontractinfo_edit|wxhr:temployeecontractinfo_file|wxhr:temployeecontractinfo_del'"/>
          <a-dropdown v-has="'wxhr:temployeecontractinfo_edit|wxhr:temployeecontractinfo_file|wxhr:temployeecontractinfo_del'">
            <a class="ant-dropdown-link">更多
              <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item v-has="'wxhr:temployeecontractinfo_edit'">
                <a @click="handleEdit(record)">编辑</a>
              </a-menu-item>
              <a-menu-item v-has="'wxhr:temployeecontractinfo_file'">
                <a @click="handlePlace(record)">归档</a>
              </a-menu-item>
              <a-menu-item v-has="'wxhr:temployeecontractinfo_del'">
                <a @click="handleDelete(record)">作废</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

        <!-- 是否在用 -->
        <span
          slot="inUse"
          slot-scope="text, record, rowIndex"
        >
          <a-popconfirm
            title="确定操作吗?"
            @confirm="() => handleInUseChange(record, rowIndex)"
          >
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :checked="text==0 ? true : false"
            />
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <employee-common-export-modal
      ref="employeeCommonExportModal"
      @ok="modalFormOk"
    ></employee-common-export-modal>
    <employee-contract-modal
      ref="employeeContractModal"
      @ok="modalFormOk"
    ></employee-contract-modal>
    <employee-contract-place-modal
      ref="employeeContractPlaceModal"
      @ok="modalFormOk"
    ></employee-contract-place-modal>
    <employee-contract-delete-modal
      ref="employeeContractDeleteModal"
      @ok="modalFormOk"
    ></employee-contract-delete-modal>
    <employee-contract-detail-modal ref="employeeContractDetailModal"></employee-contract-detail-modal>
    <error-modal ref="errorModal"></error-modal>

  </a-card>
</template>

<script>
  import Vue from 'vue'
  import { httpAction, postAction ,getAction} from '@/api/manage'
  import ErrorModal from '../global/modules/ErrorModal'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import EmployeeContractModal from './modules/EmployeeContractModal'
  import { areaMapTrees } from '@/api/api'
  import EmployeeCommonExportModal from './modules/EmployeeCommonExportModal'
  import EmployeeContractPlaceModal from './modules/EmployeeContractPlaceModal'
  import EmployeeContractDeleteModal from './modules/EmployeeContractDeleteModal'
  import EmployeeContractDetailModal from './modules/EmployeeContractDetailModal'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import moment from 'moment'

  export default {
    name: 'EmployeeContractList',
    mixins: [JeecgListMixin],
    components: {
      SelectPage,
      ErrorModal,
      EmployeeCommonExportModal,
      EmployeeContractModal,
      EmployeeContractPlaceModal,
      EmployeeContractDeleteModal,
      EmployeeContractDetailModal,
    },
    data() {
      return {
        description: '员工合同列表',
        filterDictText,
        //枚举字段
        areaTrees: [],  // 地区
        areaCitys: [],  // 档案城市
        areaTowns: [],  // 档案区县
        areaMapTrees:[],
        exportLoading: false, // 导出状态加载
        workingHoursOptions: [],  // 工时制
        situationTypeOptions: [], // 签订情况
        settleDomainOptions: [],  // 结算主体和部门
        allSettleDomainOptions: {}, // 所有结算主体与单位
        employeeContractTypeOptions: [],  // 员工合同类型
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        inUseOptions: {'0': {'option': '是', 'color': 'green'}, '1': {'option': '否', 'color': 'red'}},
        workFlagOptions: {'0': {'option': '在职', 'color': 'green'}, '1': {'option': '离职', 'color': 'red'}},
        // excel表头数据
        exportFields: [
          '员工编码', '员工姓名', '员工身份证号', '所属单位', '结算主体', '合同名称', '合同编码', '合同类型', '合同起始时间', '合同到期时间', '合同年限', '合同主体部门', '合同主体单位', '合同岗位',
          '工时制', '档案柜号', '是否在用', '是否归档', '是否作废', '作废理由', '签订情况', '备注', '档案-省', '档案-市', '档案-县', '在职状态', '在职细分', '创建时间',
        ],
        // 表头
        columns: [
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
            width: 110,
            ellipsis: true,
            title: '合同起始日期',
            align: 'center',
            dataIndex: 'contractStart',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 110,
            ellipsis: true,
            title: '合同截止日期',
            align: 'center',
            dataIndex: 'contractEnd',
            customRender:(text) => {
              const Str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '档案地市',
            align: 'center',
            dataIndex: 'province',
            customRender:(text, record) => {
              const str = this.getAreaMapName(record.fileProvince, record.fileCity, record.fileTown)
              const strShow = str ? str : '-'
              return <a-tooltip placement="topLeft" title={strShow}>{strShow}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDomain',
            customRender:(text) => {
              const str = this.allSettleDomainOptions[text] ? this.allSettleDomainOptions[text]['departName'] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
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
            title: '在职状态',
            align: 'center',
            dataIndex: 'workFlag',
            customRender:(text) => {
              const color = this.workFlagOptions.hasOwnProperty(text) ? this.workFlagOptions[text].color : 'blue'
              const str = this.workFlagOptions.hasOwnProperty(text) ? this.workFlagOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '在职细分',
            align: 'center',
            dataIndex: 'workingStatusSub',
            customRender:(text, record) => {
              if (record.workFlag == 0) { // 在职
                let color = ''
                let str = ''
                if (record.workingStatusSub == 0) { // 在职
                  color = 'green'
                  str = '在职'
                } else if (record.workingStatusSub == 3) { // 临时
                  color = 'orange'
                  str = '临时'
                } else {
                  color = 'blue'
                  str = '-'
                }
                return <a-tag color={color}>{str}</a-tag>
              } else {
                let str = '-'
                return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
              }
            },
          },
          {
            width: 180,
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
            width: 120,
            ellipsis: true,
            title: '合同类型',
            align: 'center',
            dataIndex: 'contractType',
            customRender:(text) => {
              const str = filterDictText(this.employeeContractTypeOptions, text)
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '签订单位',
            align: 'center',
            dataIndex: 'subjectUnit',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 130,
            ellipsis: true,
            title: '签订部门',
            align: 'center',
            dataIndex: 'subjectDepart',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'isSign',
            customRender:(text) => {
              const str = String(text) === '1' ? '需要电子签' : '正常合同'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '是否在用',
            align: 'center',
            dataIndex: 'inUse',
            scopedSlots: { customRender: 'inUse' },
          },
          {
            width: 160,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            customRender:(text) => {
              const Str = text ? moment(text).format('YYYY-MM-DD') : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
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
          list: 'hrBase/temployeecontractinfo/page?isObsolete=0',
          delete: 'hrBase/temployeecontractinfo/',
          deleteBatch: 'hrBase/temployeecontractinfo/deleteBatch',
          templateUrl: 'hrBase/templateInfo/template?fileName=',
          exportXlsUrl: 'hrBase/temployeecontractinfo/doexport?deleteFlag=0',
          importExcelUrl: 'hrBase/temployeecontractinfo/importListAdd', //批量新增
          updateExcelUrl: 'hrBase/temployeecontractinfo/importListRenewal',  // 批量续签
          updateDocNumber: 'hrBase/temployeecontractinfo/updateDocNumber',  // 批量更新档案柜号
          updateContractNo:'hrBase/temployeecontractinfo/updateContractNo ', // 批量更新合同编码
          queryAllInfoById: 'hrBase/temployeecontractinfo/vo/',
          updateInUseById: 'hrBase/temployeecontractinfo/updateInUseById',
        },
      }
    },
    created() {
      // 地区
      this.areaTrees = Vue.ls.get('glob_area')
      areaMapTrees().then((res) => {
        if (Number(res.code) === 200) {
          this.areaMapTrees = res.data
        }
      })
      // 所有结算主体和所属单位
      // getAllSettleDomainSelectVos().then((res) => {
      //   if (Number(res.code) === 200) {
      //     this.allSettleDomainOptions = res.data
      //   } else {
      //     this.$message.error('结算主体和所属单位数据请求失败！')
      //   }
      // })
    },
    methods: {
      // 数据请求
      async loadData(arg) {
          if (!this.url.list) {
            this.$message.error('请设置url.list属性!')
            return false
          }
          //加载数据 若传入参数1则加载第一页的内容
          if (arg === 1) {
            this.ipagination.current = 1
          }
          var params = this.getQueryParams()//查询条件
          this.loading = true;
          let res = await getAction(this.url.list, params);
          if (Number(res.code) === 200) {
            if (res.data && res.data.records && res.data.records.length > 0) {             
              // 获取结算主体数据
              const settleDomainIds = []
              res.data.records.reduce((acc,cur)=>{
                settleDomainIds.push(cur.settleDomain)
              },[])
              const ids = settleDomainIds.join(',')
              const resSet = await httpAction(`/hrBase/tsettledomain/selectSettleDomainAndCustomerMapByIds?ids=${ids}`,null,'get')
              if(Number(resSet.code) === 200) {
                this.allSettleDomainOptions = resSet.data.settleDomainMap
                }else {
                  this.$message.error('结算主体和所属单位数据请求失败！')
                }
              this.dataSource = res.data.records
              this.ipagination.total = res.data.total
              this.loading = false
            } else {
              this.dataSource = []
              this.ipagination.total = 0
              this.loading = false
              if (String(res.msg) !== 'success') {
                this.$message.warn(res.msg)
              }
            }
          } else {
            this.loading = false;
            this.$message.error(res.msg);
          }
        },
      // 新建
      handleAdd: function() {
        this.$refs.employeeContractModal.title = '员工合同新增'
        this.$refs.employeeContractModal.workingHoursBelongs = this.workingHoursOptions
        this.$refs.employeeContractModal.situationTypeBelongs = this.situationTypeOptions
        this.$refs.employeeContractModal.settleDomainBelongs = this.allSettleDomainOptions
        this.$refs.employeeContractModal.employeeContractTypeBelongs = this.employeeContractTypeOptions
        if (this.workingHoursOptions.length > 0 && Object.keys(this.allSettleDomainOptions).length > 0 &&
          this.employeeContractTypeOptions.length > 0) {
          this.$refs.employeeContractModal.add()
        } else {
          if (this.workingHoursOptions.length === 0) {
            this.$message.error(`"工时制"${this.loadMessage}`)
            return false
          }

          if (Object.keys(this.allSettleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return false
          }

          if (this.employeeContractTypeOptions.length === 0) {
            this.$message.error(`"合同类型"${this.loadMessage}`)
            return false
          }
        }
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.employeeContractModal.id = record.id
        this.$refs.employeeContractModal.title = '员工合同编辑'
        this.$refs.employeeContractModal.workingHoursBelongs = this.workingHoursOptions
        this.$refs.employeeContractModal.situationTypeBelongs = this.situationTypeOptions
        this.$refs.employeeContractModal.settleDomainBelongs = this.allSettleDomainOptions
        this.$refs.employeeContractModal.employeeContractTypeBelongs = this.employeeContractTypeOptions
        if (this.workingHoursOptions.length > 0 && Object.keys(this.allSettleDomainOptions).length > 0 &&
          this.employeeContractTypeOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.employeeContractModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.workingHoursOptions.length === 0) {
            this.$message.error(`"工时制"${this.loadMessage}`)
            return false
          }

          if (Object.keys(this.allSettleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return false
          }

          if (this.employeeContractTypeOptions.length === 0) {
            this.$message.error(`"合同类型"${this.loadMessage}`)
            return false
          }
        }
      },
      // 归档
      handlePlace: function(record) {
        this.$refs.employeeContractPlaceModal.title = '员工合同归档'
        httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
          if (Number(res.code) === 200 && res.data) {
            this.$refs.employeeContractPlaceModal.edit(res.data)
          } else {
            this.$message.error('数据不完整！')
          }
        })
      },
      // 续签合同
      handleContractinfoRenewal: function(record) {
        this.$refs.employeeContractModal.id = record.id
        this.$refs.employeeContractModal.renewal = true
        this.$refs.employeeContractModal.title = '员工合同续签'
        this.$refs.employeeContractModal.workingHoursBelongs = this.workingHoursOptions
        this.$refs.employeeContractModal.situationTypeBelongs = this.situationTypeOptions
        this.$refs.employeeContractModal.employeeContractTypeBelongs = this.employeeContractTypeOptions
        if (this.workingHoursOptions.length > 0 && this.employeeContractTypeOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.employeeContractModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.workingHoursOptions.length === 0) {
            this.$message.error(`"工时制"${this.loadMessage}`)
            return false
          }
          if (this.employeeContractTypeOptions.length === 0) {
            this.$message.error(`"合同类型"${this.loadMessage}`)
            return false
          }
        }
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.employeeContractDetailModal.title = '员工合同详情'
        this.$refs.employeeContractDetailModal.workingHoursBelongs = this.workingHoursOptions
        this.$refs.employeeContractDetailModal.situationTypeBelongs = this.situationTypeOptions
        this.$refs.employeeContractDetailModal.employeeContractTypeBelongs = this.employeeContractTypeOptions
        if (this.workingHoursOptions.length > 0 && this.employeeContractTypeOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              res.data.settleDomain = this.allSettleDomainOptions[res.data.settleDomain] ? this.allSettleDomainOptions[res.data.settleDomain].departName : ''
              this.$refs.employeeContractDetailModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.workingHoursOptions.length === 0) {
            this.$message.error(`"工时制"${this.loadMessage}`)
            return false
          }
          if (this.employeeContractTypeOptions.length === 0) {
            this.$message.error(`"合同类型"${this.loadMessage}`)
            return false
          }
        }
      },
      // 作废
      handleDelete: function(record) {
        this.$refs.employeeContractDeleteModal.title = '员工合同作废'
        httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
          if (Number(res.code) === 200 && res.data) {
            this.$refs.employeeContractDeleteModal.edit(res.data)
          } else {
            this.$message.error('数据请求失败！')
          }
        })
      },
      // 是否在用
      handleInUseChange(record, index) {
        const url = `${this.url.updateInUseById}?id=${record.id}&inUse=${(record.inUse==0 ? 1 : 0)}`
        const inUse = record.inUse == 0 ? 1 : 0  // 修改状态
        postAction(url, {}).then((res) => {
          if (Number(res.code) === 200) {
            this.$set(this.dataSource[index], 'inUse', inUse)
            this.$message.success('状态修改成功！')
          } else {
            this.$message.warning(res.msg || res.message)
          }
        }).finally(() => {
          this.loadData()
        })
      },
      // 导出
      handleExport: function() {
        let requestExportXlsUrl = this.url.exportXlsUrl
        let queryParams =  this.getQueryParams()
        // 处理查询条件
        for (let key in queryParams) {
          if (String(key) !== 'current' && String(key) !== 'size') {
            requestExportXlsUrl += `&${key}=${queryParams[key]}`
          }
        }
        // 处理选中的
        if (this.selectedRowKeys.length > 0) {
          let idStr = ''
          for (let a = 0; a < this.selectedRowKeys.length; a++) {
            if (a === this.selectedRowKeys.length - 1) {
              idStr += this.selectedRowKeys[a]
            } else {
              idStr += `${this.selectedRowKeys[a]},`
            }
          }
          requestExportXlsUrl += `'&idStr=${idStr}`
        }
        this.$refs.employeeCommonExportModal.title = '员工合同导出'
        this.$refs.employeeCommonExportModal.exportFields = this.exportFields
        // this.$refs.employeeCommonExportModal.checkState.checkedList = this.exportFields
        this.$refs.employeeCommonExportModal.url.exportXlsUrl = requestExportXlsUrl
        this.$refs.employeeCommonExportModal.add()
      },
      // 导出[合并历史]
      handleExportExcel: function() {
        let requestExportXlsUrl = 'hrBase/temployeecontractinfo/doExportContractHistory?'
        let queryParams =  this.getQueryParams()
        // 处理查询条件
        for (const key in queryParams) {
          if (String(key) !== 'current' && String(key) !== 'size') {
            requestExportXlsUrl += `&${key}=${queryParams[key]}`
          }
        }
        // 处理选中的
        if (this.selectedRowKeys.length > 0) {
          let idStr = ''
          for (let a = 0; a < this.selectedRowKeys.length; a++) {
            if (a === this.selectedRowKeys.length - 1) {
              idStr += this.selectedRowKeys[a]
            } else {
              idStr += `${this.selectedRowKeys[a]},`
            }
          }
          requestExportXlsUrl += `&idStr=${idStr}`
        }
        this.exportLoading = true // 导出状态加载
        httpAction(requestExportXlsUrl, {}, 'GET', 60 * 1000 * 5).then((res) => {
          if (Number(res.code) === 200 && res.data) {
            let excelDatas = []
            let contractDatas = [] // 合同数据
            let maxHistory = res.data.maxCount ? res.data.maxCount : 0 // 记录最大长度
            let tHeader = ['所在单位', '所在部门', '当时签订部门', '班组', '在职状态', '姓名', '省', '市', '岗位', '身份证号', '合同编号','档案柜号', '人员类型', '合同类型', '累计签订次数', '首签日期', '最晚到期日期']  // 列数【最少16列】
            let filterVal = ['belongUnitName', 'settleDomainName', 'settleDomain2', 'inauguralTeam', 'workingStatusSub', 'empName', 'fileProvince', 'fileCity', 'post', 'empIdcard', 'contractNo','fileCabinetNo', 'empType', 'contractType', 'count', 'firstContractStart', 'lastContractEnd']
            if (maxHistory > 0) { // 组装列和对应字段
              for(let i = 1; i <= maxHistory; i++) {
                tHeader.push('第' + i +'次合同')
                filterVal.push('history_' + i)
              }
            }
            if (res.data.voList && res.data.voList.length > 0) {  // 组装数据
              for (let item of res.data.voList) {
                for(let i = 1; i <= maxHistory; i++) {
                  item['history_' + i] = item.history[i - 1] ? item.history[i - 1] : ''
                }
                item.belongUnitName = item.belongUnitName ? item.belongUnitName : ''
                item.settleDomainName = item.settleDomainName ? item.settleDomainName : ''
                item.settleDomain2 = item.settleDomain2 ? item.settleDomain2 : ''
                item.inauguralTeam = item.inauguralTeam ? item.inauguralTeam : ''
                item.workingStatusSub = item.workingStatusSub ? item.workingStatusSub : ''
                item.empName = item.empName ? item.empName : ''
                item.fileProvince = item.fileProvince ? item.fileProvince : ''
                item.fileCity = item.fileCity ? item.fileCity : ''
                item.post = item.post ? item.post : ''
                item.empIdcard = item.empIdcard ? item.empIdcard : ''
                item.contractNo = item.contractNo ? item.contractNo : ''
                item.empType = item.empType ? item.empType : ''
                item.contractType = item.contractType ? item.contractType : ''
                item.count = item.count ? item.count : ''
                item.firstContractStart = item.firstContractStart ? item.firstContractStart : ''
                item.lastContractEnd = item.lastContractEnd ? item.lastContractEnd : ''
                contractDatas.push(item)
              }
            }
            // 组装数据
            excelDatas.push({
              tHeader: tHeader,
              filterVal: filterVal,
              tableDatas: contractDatas,
              sheetName: '劳动合同'
            })
            this.json2excel(excelDatas, '劳动合同导出（合并历史数据）', true, "xlsx")
          } else {
            this.$message.error(res.message || res.msg)
          }
        }).finally(() => {
          this.exportLoading = false
        })
      },
      // 导出
      json2excel (tableJson, filenames, autowidth, bookTypes) {
        var that = this
        //这个是引用插件
        import("@/vendor/EmployeeContractListExportExcel").then(excel => {
          var tHeader = []
          var dataArr = []
          var sheetnames = []
          for (var i in tableJson) {
            tHeader.push(tableJson[i].tHeader)
            dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
            sheetnames.push(tableJson[i].sheetName)
          }
          excel.export_json_to_excel_more_sheet({
            header: tHeader,
            data: dataArr,
            sheetname: sheetnames,
            filename: filenames,
            autoWidth: autowidth,
            bookType: bookTypes,
          })
        })
      },
      // 处理数据
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
      // 档案省份切换
      handleProvinceChange(value) {
        this.areaCitys = []
        this.areaTowns = []
        if (value) {
          for (const c of this.areaTrees[value - 1].children) {
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
          for (const c of this.areaCitys) {
            if (String(c.id) === String(value)) {
              if (c.children.length > 0) {
                for (const t of c.children) {
                  this.areaTowns.push(t)
                }
              }
            break
            }
          }
        }
        delete this.queryParam.fileTown
      },
      // 地区渲染显示
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
      // 数据字典
      initDictConfig() {
        // 员工合同类型
        initDictOptions('employee_contract_type').then((res) => {
          if (Number(res.code) === 200) {
            this.employeeContractTypeOptions = res.data
          }
        })
        // 工时制
        initDictOptions('working_hours').then((res) => {
          if (Number(res.code) === 200) {
            this.workingHoursOptions = res.data
          }
        })
        // 签订情况
        initDictOptions('situation_type').then((res) => {
          if (Number(res.code) === 200) {
            this.situationTypeOptions = res.data
          }
        })
      },
      // 下载本地模板
      downTemplate(templateUrl){
        const url = window.location.protocol+'//'+window.location.hostname+':'+window.location.port+templateUrl
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
