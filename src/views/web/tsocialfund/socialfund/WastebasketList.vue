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
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="派单人员">
              <a-input
                placeholder="请输入派单人姓名"
                v-model="queryParam.creasteUserName"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="派单类型"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.type"
                  placeholder="请选择派单类型查询"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in typeOptions"
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
                label="员工类型"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.empType"
                  placeholder="请选择员工类型查询"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in empTypeOptions"
                    :key="key"
                    :value="value.value"
                  >{{ value.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="审核人员">
                <select-page
                  :searchUrl="'admin/user/page/wxhr?nickname='"
                  :title="'nickname'"
                  placeholder="请选择审核人"
                  :id="'userId'"
                  v-model="queryParam.auditUser"
                ></select-page>
                <!-- <a-select
                  v-model="queryParam.auditUser"
                  optionFilterProp="children"
                  allowClear
                  showSearch
                  placeholder="请选择审核人"
                >
                  <a-select-option
                    v-for="(item, index) in employData"
                    :key="index"
                    :value="index"
                  >{{ item }}</a-select-option>
                </a-select> -->
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="起始时间">
                <a-date-picker
                  style="width: 100%"
                  placeholder="请选择起始时间查询"
                  format="YYYY-MM-DD HH:mm:ss"
                  v-model="queryParam.dateTemp"
                  @change="handleTimeBeginChange"
                  :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="截止时间">
                <a-date-picker
                  style="width: 100%"
                  placeholder="请选择截止时间查询"
                  format="YYYY-MM-DD HH:mm:ss"
                  v-model="queryParam.dateTemp1"
                  @change="handleTimeEndChange"
                  :showTime="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="单位名称">
                <select-page
                  :id="'id'"
                  :title="'customerName'"
                  placeholder="请选择单位名称查询"
                  v-model="queryParam.belongUnit"
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
                label="社保地市"
                class="stepFormText"
              >
                <a-select
                  placeholder="选择省份"
                  @change="handleIdProvinceChange"
                  allowClear
                  showSearch
                  style="width: 32%"
                  optionFilterProp="children"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.socialProvince"
                >
                  <a-select-option
                    v-for="(item, index) in idAreaTrees"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
                <a-select
                  placeholder="选择城市"
                  style="margin-left: 2%; width: 32%"
                  @change="handleIdCityChange"
                  :dropdownMatchSelectWidth="false"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.socialCity"
                >
                  <a-select-option
                    v-for="(item, index) in idAreaCitys"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
                <a-select
                  placeholder="选择区县"
                  style="margin-left: 2%; width: 32%"
                  v-model="queryParam.socialTown"
                  :dropdownMatchSelectWidth="false"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  @change="handleIdTownChange"
                >
                  <a-select-option
                    v-for="(item, index) in idAreaTowns"
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
                label="公积金地市"
                class="stepFormText"
              >
                <a-select
                  placeholder="选择省份"
                  allowClear
                  showSearch
                  style="width: 32%"
                  optionFilterProp="children"
                  @change="changeFundProvice"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.fundProvince"
                >
                  <a-select-option
                    v-for="(item, index) in idAreaTrees"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
                <a-select
                  placeholder="选择城市"
                  style="margin-left: 2%; width: 32%"
                  :dropdownMatchSelectWidth="false"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  @change="changeFundCity"
                  v-model="queryParam.fundCity"
                >
                  <a-select-option
                    v-for="(item, index) in socialAdr.fundCity"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
                <a-select
                  placeholder="选择区县"
                  style="margin-left: 2%; width: 32%"
                  v-model="queryParam.fundTown"
                  :dropdownMatchSelectWidth="false"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  @change="changeFundTown"
                >
                  <a-select-option
                    v-for="(item, index) in socialAdr.fundTown"
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
                label="社保状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.socialHandleStatus"
                  placeholder="请选择社保状态查询"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in handleStatusOptions"
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
                label="公积金状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.fundHandleStatus"
                  placeholder="请选择公积金状态查询"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in handleStatusOptions"
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
        icon="download"
        @click="handleExport"
      >导出</a-button>
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record, 'detail')">详情</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <social-fund-export-modal
      ref="socialFundExportModal"
      @ok="modalFormOk"
    ></social-fund-export-modal>
    <dispatch-add-application-detail-modal
      ref="dispatchAddApplicationDetailModal"
      :socialHandleStatusOption="socialHandleStatusOption"
      @ok="modalFormOk"
    ></dispatch-add-application-detail-modal>
    <dispatch-reduce-application-detail-modal
      ref="dispatchReduceApplicationDetailModal"
      :socialHandleStatusOption="socialHandleStatusOption"
      @ok="modalFormOk"
    ></dispatch-reduce-application-detail-modal>
    <error-modal ref="errorModal"></error-modal>
    <audit-process-modal ref="auditProcessModal"></audit-process-modal>

  </a-card>
</template>

<script>
  import Vue from 'vue'
  import { httpAction,getAction } from '@/api/manage'
  import { getAreaName } from '@/utils/common'
  import SelectPage from '@/components/jeecg/SelectPage'
  import ErrorModal from '../../global/modules/ErrorModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import AuditProcessModal from './modules/AuditProcessModal'
  import SocialFundExportModal from './modules/SocialFundExportModal'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import DispatchAddApplicationDetailModal from './modules/DispatchAddApplicationDetailModal'
  import DispatchReduceApplicationDetailModal from './modules/DispatchReduceApplicationDetailModal'
  import { getHouseHold, areaMapTrees } from '@/api/api'

  export default {
    name: 'WastebasketList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      SelectPage,
      AuditProcessModal,
      SocialFundExportModal,
      DispatchAddApplicationDetailModal,
      DispatchReduceApplicationDetailModal,
    },
    data() {
      return {
        description: '派单查询',
        filterDictText,
        // 枚举字段
        houseHolds: [], // 社保、公积金户
        empTypeOptions: [], // 员工类型
        settleDomainItems: [],  // 结算主体数组
        reduceReasonOptions: [],  // 减少原因
        settleDomainOptions: {},  // 结算主体
        fundPayPointOptions: [],  // 公积金单边小数点
        settleDomainDisabled: true,  // 结算主体不可选择
        idAreaTrees:[],
        idAreaCitys:[],
        idAreaTowns:[],
        areaTrees: [],  // 地区
        areaCitys: [],  // 档案城市
        areaTowns: [],  // 档案区县
        areaMapTrees: [], // map地区
        socialAdr:{
          fundCity:[],
          fundTown:[]
        },
        queryParam:{
          socialTown:undefined,
          fundTown:undefined
        },
        dateFormat: "YYYY-MM-DD HH:mm:ss",  // 时间格式化
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        typeSubOptions: {'0': '社保', '1': '公积金', '2': '员工离职'},
        typeOptions: {'0': {'option': '增加派单', 'color': 'green'}, '1': {'option': '减少派单', 'color': 'red'}},
        statusOptions: {
          '0': {'option': '未提交', 'color': 'blue', val: '0'},
          '1': {'option': '待审核', 'color': 'orange', val: '1'},
          '2': {'option': '审核通过', 'color': 'green', val: '2'},
          '3': {'option': '审核未通过', 'color': 'red', val: '3'},
          '4': {'option': '已办结', 'color': 'pink', val: '4'}
        },
        handleStatusOptions: {
          '0': {'option': '待办理', 'color': 'blue'},
          '1': {'option': '办理成功', 'color': 'green'},
          '2': {'option': '办理失败', 'color': 'red'}},
        // excel表头数据
        exportFields: [],
        employData: {},
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
            width: 100,
            ellipsis: true,
            title: '员工类型',
            align: 'center',
            dataIndex: 'empType',
            customRender:(text) => {
              const str = filterDictText(this.empTypeOptions, text)
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '单位名称',
            align: 'center',
            dataIndex: 'belongUnit',
            customRender:(text, record) => {
              const str = ((Object.keys(this.settleDomainOptions).length) && (this.settleDomainOptions).hasOwnProperty(record.settleDomain))
              ? (this.settleDomainOptions)[record.settleDomain]['customerName'] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDomain',
            customRender:(text) => {
              const str = ((Object.keys(this.settleDomainOptions).length) && (this.settleDomainOptions).hasOwnProperty(text)) ? (this.settleDomainOptions)[text]['departName'] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '社保地市',
            align: 'center',
            dataIndex: 'socialProvince',
            customRender:(text, record) => {
              const socialName = getAreaName(record.socialProvince, record.socialCity, record.socialTown)
              const str = socialName ? socialName : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '公积金地市',
            align: 'center',
            dataIndex: 'fundProvince',
            customRender:(text, record) => {
              const fundName = getAreaName(record.fundProvince, record.fundCity, record.fundTown)
              const str = fundName ? fundName : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '离职日期',
            align: 'center',
            dataIndex: 'leaveDate',
            customRender:(text) => {
              const str = text ? text.substring(0, 10) : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 90,
            ellipsis: true,
            title: '派单类型',
            align: 'center',
            dataIndex: 'type',
            customRender:(text) => {
              const color = this.typeOptions.hasOwnProperty(text) ? this.typeOptions[text].color : 'blue'
              const str = this.typeOptions.hasOwnProperty(text) ? this.typeOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 110,
            ellipsis: true,
            title: '派单状态',
            align: 'center',
            dataIndex: 'status',
            customRender:(text) => {
              const color = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].color : 'blue'
              const str = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '社保状态',
            align: 'center',
            dataIndex: 'socialHandleStatus',
            customRender:(text, record) => {
              for (const key in this.handleStatusOptions) {
                if (record.socialHandleStatus === null && String(key) === '0') {
                  const str = '-'
                  return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
                } else if (record.socialHandleStatus === key) {
                  const color = this.handleStatusOptions[key].color
                  const str = (String(record.type) === '1' ? '派减' : '派增') + this.handleStatusOptions[key].option
                  return <a-tag color={color}>{str}</a-tag>
                }
              }
              return '-'
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '公积金状态',
            align: 'center',
            dataIndex: 'fundHandleStatus',
            customRender:(text, record) => {
              for (const key in this.handleStatusOptions) {
                if (record.fundHandleStatus === null && String(key) === '0') {
                  const str = '-'
                  return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
                } else if (record.fundHandleStatus === key) {
                  const color = this.handleStatusOptions[key].color
                  const str = (String(record.type) === '1' ? '派减' : '派增') + this.handleStatusOptions[key].option
                  return <a-tag color={color}>{str}</a-tag>
                }
              }
              return ''
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '办理备注',
            align: 'center',
            dataIndex: 'handleRemark',
            customRender: (text) => {
              const textStr = text ? text : '-'
              return <a-tooltip placement="topLeft" title={textStr}>{textStr}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '派单人员',
            align: 'center',
            dataIndex: 'creasteUserName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '派单日期',
            align: 'center',
            dataIndex: 'createTime',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            isfixed: 'true',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrSocial/tdispatchinfo/page?deleteFlag=1&status=3',
          exportXlsUrl: 'hrSocial/tdispatchinfo/doexport?deleteFlag=1&status=3',  // 导出
          queryAllInfoById: 'hrSocial/tdispatchinfo/getSocialAndFundByDispatchId',  // 派增详情（派单信息、员工信息）
          queryAllInfoReduce: 'hrSocial/tdispatchinfo/getDispatchALLInfo',  // 派减详情（派单信息、员工信息）
          auditProcessUrl: 'hrSocial/tauditinfo/getAuditInfoByIdAndType',  // 流程进展明细
          getExportField: 'hrSocial/tdispatchinfo/getDisPatchInfoExportVoFieldName',
        },
        socialHandleStatusOption:{'0':'待办理','1':'全部办理成功','2':'全部办理失败','3':'已派减','4':'办理中','5':'部分办理失败'},
      }
    },
    created() {
      // 地区
      this.idAreaTrees = this.areaTrees = Vue.ls.get('glob_area')
      areaMapTrees().then((res) => {
        if (res.code === 200) {
          this.areaMapTrees = res.data
        }
      })
      // 结算主体和所属单位
      // getAllSettleDomainSelectVos().then((res) => {
      //   if (res.code === 200) {
      //     this.settleDomainOptions = res.data
      //   } else {
      //     this.$message.error('结算主体和所属单位数据请求失败！')
      //   }
      // })
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if(res.code === 200){
          this.employData = res.data
        }
      })
    },
    methods: {
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
              this.settleDomainOptions = resSet.data.settleDomainMap;
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
      // 详情
      handleDetail: function(record, type) {
        // 派单状态
        const status = this.statusOptions.hasOwnProperty(record.status) ? this.statusOptions[record.status] : '-'
        if (String(record.type) === '0') { // 派增
          this.$refs.dispatchAddApplicationDetailModal.title = '派单详情'
          this.$refs.dispatchAddApplicationDetailModal.recordInfo = record
          this.$refs.dispatchAddApplicationDetailModal.AreaTrees = Vue.ls.get('glob_area')
          this.$refs.dispatchAddApplicationDetailModal.empTypeBelongs = this.empTypeOptions
          this.$refs.dispatchAddApplicationDetailModal.fundPayPointBelongs = this.fundPayPointOptions
          this.$refs.dispatchAddApplicationDetailModal.settleDomainBelongs = this.settleDomainOptions
          if (this.fundPayPointOptions.length > 0 && this.empTypeOptions.length > 0 && Object.keys(this.settleDomainOptions).length > 0 && (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length > 0)) {
            httpAction(`${this.url.queryAllInfoById}?id=${record.id}`, '', 'GET').then((res) => {
              if (Number(res.code) === 200 && res.data) {
                const houseHoldsSelect = []
                // 有社保有公积金
                if (res.data.socialInfo && res.data.fund) {
                  // 获取社保户
                  getHouseHold({id: res.data.socialInfo.socialHousehold}).then((socialHousehold) => {
                    if (Number(socialHousehold.code) === 200 && socialHousehold.data.length > 0) {
                      houseHoldsSelect.push(socialHousehold.data[0])
                      // 获取公积金户
                      getHouseHold({id: res.data.fund.providentHousehold}).then((providentHousehold) => {
                        if (Number(providentHousehold.code) === 200 && providentHousehold.data.length > 0) {
                          houseHoldsSelect.push(providentHousehold.data[0])
                          // 编辑
                          if (String(type) === 'edit') {
                            this.$refs.dispatchAddApplicationDetailModal.isEdit = true
                          }
                          this.$refs.dispatchAddApplicationDetailModal.houseHolds = houseHoldsSelect
                          this.$refs.dispatchAddApplicationDetailModal.edit(res.data, this.url.auditProcessUrl,status)
                        } else {
                          this.$message.error('公积金户数据请求失败！')
                        }
                      })
                    } else {
                      this.$message.error('社保户数据请求失败！')
                    }
                  })
                } else if (res.data.socialInfo && !res.data.fund) {  // 只有社保
                  getHouseHold({id: res.data.socialInfo.socialHousehold}).then((socialHousehold) => {
                    if (Number(socialHousehold.code) === 200 && socialHousehold.data.length > 0) {
                      houseHoldsSelect.push(socialHousehold.data[0])
                      // 编辑
                      if (String(type) === 'edit') {
                        this.$refs.dispatchAddApplicationDetailModal.isEdit = true
                      }
                      this.$refs.dispatchAddApplicationDetailModal.houseHolds = houseHoldsSelect
                      this.$refs.dispatchAddApplicationDetailModal.edit(res.data, this.url.auditProcessUrl,status)
                    } else {
                      this.$message.error('社保户数据请求失败！')
                    }
                  })
                } else if (!res.data.socialInfo && res.data.fund) {  // 只有公积金
                  getHouseHold({id: res.data.fund.providentHousehold}).then((providentHousehold) => {
                    if (Number(providentHousehold.code) === 200 && providentHousehold.data.length > 0) {
                      houseHoldsSelect.push(providentHousehold.data[0])
                      // 编辑
                      if (String(type) === 'edit') {
                        this.$refs.dispatchAddApplicationDetailModal.isEdit = true
                      }
                      this.$refs.dispatchAddApplicationDetailModal.houseHolds = houseHoldsSelect
                      this.$refs.dispatchAddApplicationDetailModal.edit(res.data, this.url.auditProcessUrl,status)
                    } else {
                      this.$message.error('公积金户数据请求失败！')
                    }
                  })
                } else {
                  this.$refs.dispatchAddApplicationDetailModal.houseHolds = houseHoldsSelect
                  this.$refs.dispatchAddApplicationDetailModal.edit(res.data, this.url.auditProcessUrl,status)
                }
              } else {
                this.$message.error('数据请求失败！')
              }
            })
          } else {
            this.getPzError()
          }
        } else {  // 派减
          this.$refs.dispatchReduceApplicationDetailModal.title = '派单详情'
          this.$refs.dispatchReduceApplicationDetailModal.empTypeBelongs = this.empTypeOptions
          this.$refs.dispatchReduceApplicationDetailModal.reduceReasonBelongs = this.reduceReasonOptions
          this.$refs.dispatchReduceApplicationDetailModal.settleDomainBelongs = this.settleDomainOptions
          // 编辑
          if (String(type) === 'edit') {
            this.$refs.dispatchReduceApplicationDetailModal.isEdit = true
          }
          if (this.empTypeOptions.length > 0 && Object.keys(this.settleDomainOptions).length > 0 && this.reduceReasonOptions.length > 0) {
            httpAction(`${this.url.queryAllInfoReduce}?deleteFlag=1&id=${record.id}`, '', 'GET').then((res) => {
              if (Number(res.code) === 200 && res.data.tdispatchInfo) {
                res.data.tdispatchInfo.empPhone = res.data.employeeInfo.empPhone
                this.$refs.dispatchReduceApplicationDetailModal.edit(res.data, this.url.auditProcessUrl)
              } else {
                this.$message.error('数据请求失败！')
              }
            })
          } else {
            this.getPjError()
          }
        }
      },
      getPzError(){
        if (this.fundPayPointOptions.length === 0) {
          this.$message.error(`"公积金单边小数点"${this.loadMessage}`)
          return false
        }
        if (this.empTypeOptions.length === 0) {
          this.$message.error(`"员工类型"${this.loadMessage}`)
          return false
        }
        if (Object.keys(this.settleDomainOptions).length === 0) {
          this.$message.error(`"结算主体"${this.loadMessage}`)
          return false
        }

        if (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length === 0) {
          this.$message.error(`"地区"${this.loadMessage}`)
          return false
        }
        return true
      },
      getPjError(){
        if (this.empTypeOptions.length === 0) {
          this.$message.error(`"员工类型"${this.loadMessage}`)
          return false
        }
        if (this.reduceReasonOptions.length === 0) {
          this.$message.error(`"减少原因"${this.loadMessage}`)
          return false
        }
        if (Object.keys(this.settleDomainOptions).length === 0) {
          this.$message.error(`"结算主体"${this.loadMessage}`)
          return false
        }
        return true
      },
      // 社保缴纳地
      handleIdProvinceChange(value){
        this.idAreaCitys = []
        this.idAreaTowns = []
        if (value) {
          for(const c of this.idAreaTrees[value - 1].children) {
            this.idAreaCitys.push(c)
          }
        }
        delete this.queryParam.socialCity
        delete this.queryParam.socialTown
      },

      handleIdCityChange(value) {
        this.idAreaTowns = []
        if (value) {
          for(const c of this.idAreaCitys) {
            if(String(c.id) === String(value)){
              for(const d of c.children){
                this.idAreaTowns.push(d)
              }
            }
          }
        }
        delete this.queryParam.socialTown
      },

      handleIdTownChange(value){
        this.queryParam.socialTown = value
      },

      // 公积金
      changeFundProvice(val){
        this.socialAdr.fundCity = []
        this.socialAdr.fundTown = []
        if (val) {
          for(const c of this.idAreaTrees[val - 1].children) {
            this.socialAdr.fundCity.push(c)
          }
        }
        delete this.queryParam.fundCity
        delete this.queryParam.fundTown
      },

      changeFundCity(val) {
        this.socialAdr.fundTown = []
        if (val) {
          for(const c of this.socialAdr.fundCity) {
            if(String(c.id) === String(val)){
              for(const d of c.children){
                this.socialAdr.fundTown.push(d)
              }
            }
          }
        }
        delete this.queryParam.fundTown
      },
      changeFundTown(val){
        this.queryParam.fundTown = val
      },

      // 导出
      handleExport: function() {
        httpAction(this.url.getExportField,{},'GET').then((res) => {
          if(Number(res.code) === 200){
            this.exportFields = res.data
            let requestExportXlsUrl = this.url.exportXlsUrl
            const queryParams =  this.getQueryParams()
            // 处理查询条件
            for (const key in queryParams) {
              if (String(key) !== 'current' && String(key) !== 'size') {
                requestExportXlsUrl += `&${key}=${queryParams[key]}`
              }
            }
            // 处理选中的
            if (this.selectedRowKeys.length > 0) {
              requestExportXlsUrl += `&idStr=${this.selectedRowKeys.join(',')}`
            }

            this.$refs.socialFundExportModal.title = '派单废纸篓导出'
            this.$refs.socialFundExportModal.exportFields = this.exportFields
            this.$refs.socialFundExportModal.url.exportXlsUrl = requestExportXlsUrl
            // this.$refs.socialFundExportModal.checkState.checkedList = this.exportF ields
            this.$refs.socialFundExportModal.add()
          }
        })

      },
      // 起始时间选择
      handleTimeBeginChange(date) {
        // 时间格式化
        this.queryParam.createTimeStart = date ? (date.format(this.dateFormat)) : null
      },
      // 截止时间选择
      handleTimeEndChange(date) {
        // 时间格式化
        this.queryParam.createTimeEnd = date ? (date.format(this.dateFormat)) : null
      },
      // 重置按钮
      searchReset() {
        this.queryParam = {}
        this.settleDomainDisabled = true
        this.settleDomainItems = []
        this.idAreaCitys = []
        this.idAreaTowns = []
        this.socialAdr.fundCity = []
        this.socialAdr.fundTown = []
        this.areaCitys = []
        this.areaTowns = []
        this.loadData(1)
      },
      // 数据字典
      initDictConfig() {
        // 员工类型
        initDictOptions('personnel_type').then((res) => {
          if (res.code === 200) {
            this.empTypeOptions = res.data
          }
        })
        // 公积金单边小数点
        initDictOptions('fund_pay_point').then((res) => {
          if (res.code === 200) {
            this.fundPayPointOptions = res.data
          }
        })
        // 减少原因
        initDictOptions('reduce_reason').then((res) => {
          if (res.code === 200) {
            this.reduceReasonOptions = res.data
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

.range-picker-new-style {
  :global(.ant-calendar-range-picker-input) {
    font-size: 13px;
  }
}

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
