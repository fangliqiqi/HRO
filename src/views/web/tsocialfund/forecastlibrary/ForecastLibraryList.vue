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
                allowClear
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
                allowClear
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
                allowClear
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
              <a-form-item label="单位名称">
                <select-page
                  :id="'id'"
                  :title="'customerName'"
                  placeholder="请选择单位名称查询"
                  v-model="queryParam.unitId"
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
                  v-model="queryParam.settleDomainId"
                  :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="生成月份">
                <a-month-picker
                  v-model="queryParam.socialCreateMonth"
                  style="width: 100%"
                  placeholder="请选择生成月份查询"
                  format="YYYYMM"
                  valueFormat="YYYYMM"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="缴纳月份">
                <a-month-picker
                  v-model="queryParam.socialPayMonth"
                  style="width: 100%"
                  placeholder="请选择缴纳月份查询"
                  format="YYYYMM"
                  valueFormat="YYYYMM"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算状态">
                <a-select
                  placeholder="请选择结算状态查询"
                  style="width: 100%"
                  :allowClear="true"
                  v-model="queryParam.settleFlag"
                >
                  <a-select-option
                    v-for="(item,key) in settleFlagOption"
                    :key="key"
                    :value="key"
                  >{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算月份">
                <a-month-picker
                  v-model="queryParam.settleMonth"
                  style="width: 100%"
                  placeholder="请选择结算月份查询"
                  format="YYYYMM"
                  valueFormat="YYYYMM"
                 
                />
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
        @click="handleAdd(1)"
        v-has="'wxhr:tforecastlibrary_create'"
      >按缴纳月重新生成</a-button>
      <a-button
        type="primary"
        icon="plus"
        @click="handleAdd(2)"
        v-has="'wxhr:tforecastlibrary_create2'"
      >按截止月重新生成</a-button>
      <a-button
        type="primary"
        icon="download"
        @click="handleExport"
        v-has="'wxhr:tforecastlibrary_doexportForecastLibrary'"
      >导出</a-button>
      <a-button
        type="primary"
        icon="delete"
        @click="handleDeletes"
        :loading="deleteLoading"
      >批量删除</a-button>
      <!-- 批量导入 -->
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item @click="handleImportDetail">
            <a-icon
              type="import"
              style="margin-right: 6.5px"
            />批量导入
          </a-menu-item>
          <a-menu-item @click="downTemplate('/templates/导入预估明细.xls')">
            <a-icon type="download" />模板下载
          </a-menu-item>
        </a-menu>
        <a-button>批量导入
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">详情</a>
          <a v-if="record.diySocialUser" @click="handleDeleteEvent(record,0)">
            <a-divider type="vertical" />
            删除社保</a>
          <a v-if="record.diyFundUser" @click="handleDeleteEvent(record,1)">
            <a-divider type="vertical" />
            删除公积金</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <forecast-library-export-modal
      ref="forecastLibraryExportModal"
      @ok="modalFormOk"
    ></forecast-library-export-modal>
    <forecast-library-detail-modal
      ref="forecastLibraryDetailModal"
      @ok="modalFormOk"
    ></forecast-library-detail-modal>
    <forecast-library-afresh-modal
      ref="forecastLibraryAfreshModal"
      @ok="modalFormOk"
    ></forecast-library-afresh-modal>
    <error-modal ref="errorModal"></error-modal>
    <forecast-batch-import-modal
      ref="forecastBatchImportModal"
      @ok="modalFormOk">
    </forecast-batch-import-modal>
  </a-card>
</template>

<script>
  import Vue from 'vue'
  import moment from 'moment'
  import { httpAction,getAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import ErrorModal from '../../global/modules/ErrorModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ForecastLibraryAfreshModal from './modules/ForecastLibraryAfreshModal'
  import ForecastLibraryExportModal from './modules/ForecastLibraryExportModal'
  import ForecastLibraryDetailModal from './modules/ForecastLibraryDetailModal'
  import { getOrganization,areaMapTrees } from '@/api/api'
  import ForecastBatchImportModal from './modules/ForecastBatchImportModal'

  export default {
    name: 'ForecastLibraryList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      SelectPage,
      ForecastLibraryAfreshModal,
      ForecastLibraryExportModal,
      ForecastLibraryDetailModal,
      ForecastBatchImportModal
    },
    data() {
      return {
        description: '预估库',
        deleteLoading:false,//批量删除
        // 枚举字段
        settleDomainDisabled: true,  // 结算主体不可选择
        settleDomainItems: [],  // 结算主体数组
        settleDomainOptions: {},  // 结算主体和所属单位
        organizationOptions: [], // 社保户、公积金户
        areaMapTrees: [], // map地区
        dateFormat: 'YYYYMM', // 时间格式化
        yearMonthArrOptions: [],  // 年和月组成的字符串的数组
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        settleFlagOption:['未结算','待结算','已结算','已确认'],
        // excel表头数据
        exportFields: [
          '员工编码', '员工姓名', '员工身份证号', '所属单位', '所属部门', '单位养老费用', '单位医疗费用', '单位失业费用', '单位工伤费用', '单位生育费用', '单位大病救助', '个人养老费用', '个人医疗费用', '个人工伤费用', '个人大病费用', '社保缴纳月份', '社保生成月份', '公积金缴纳月份', '公积金生成月份', '单位社保合计', '单位公积金合计', '个人社保合计', '个人公积金合计',
          '公积金缴纳地-省', '公积金缴纳地-市', '公积金缴纳地-县', '社保缴纳地-省', '社保缴纳地-市', '社保缴纳地-县', '工资社保结算状态', '工资公积金结算状态', '创建时间',
          '单位养老基数','单位医疗基数','单位失业基数','单位工伤基数','单位生育基数','个人养老基数','个人医疗基数','个人失业基数','单位养老比例','单位医疗比例',
          '单位失业比例','单位工伤比例','单位生育比例','个人养老比例','个人医疗比例','个人失业比例','个人大病缴纳基数','单位大病缴纳基数','个人大病比例','单位大病缴纳比例',
          '单位公积金缴纳基数','个人公积金缴纳基数','单位公积金缴纳比例','个人公积金缴纳比例','结算状态','结算月份'
        ],
        // 表头
        columns: [
          {
            width: 140,
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
            width: 180,
            ellipsis: true,
            title: '单位名称',
            align: 'center',
            dataIndex: 'unitId',
            customRender:(text, record) => {
              const str = ((Object.keys(this.settleDomainOptions).length) && (this.settleDomainOptions).hasOwnProperty(record.settleDomainId)) ? (this.settleDomainOptions)[record.settleDomainId]['customerName'] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDomainId',
            customRender:(text) => {
              const str = ((Object.keys(this.settleDomainOptions).length) && (this.settleDomainOptions).hasOwnProperty(text)) ? (this.settleDomainOptions)[text]['departName'] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            }
          },
          {
            width: 165,
            ellipsis: true,
            title: '社保地市',
            align: 'center',
            dataIndex: 'socialProvince',
            customRender:(text, record) => {
              const fileName = this.getAreaMapName(record.socialProvince, record.socialCity, record.socialTown)
              const str = fileName ? fileName : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '社保缴纳月份',
            align: 'center',
            dataIndex: 'socialPayMonth',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '社保生成月份',
            align: 'center',
            dataIndex: 'socialCreateMonth',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            }
          },
          {
            width: 165,
            ellipsis: true,
            title: '公积金地市',
            align: 'center',
            dataIndex: 'fundProvince',
            customRender:(text, record) => {
              const fileName = this.getAreaMapName(record.fundProvince, record.fundCity, record.fundTown)
              const str = fileName ? fileName : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '公积金缴纳月份',
            align: 'center',
            dataIndex: 'providentPayMonth',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '公积金生成月份',
            align: 'center',
            dataIndex: 'providentCreateMonth',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 110,
            ellipsis: true,
            title: '结算状态',
            align: 'center',
            dataIndex: 'settleFlag',
            customRender:(text) => {
              const str = this.settleFlagOption[text]
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },

          },
          {
            width: 110,
            ellipsis: true,
            title: '结算月份',
            align: 'center',
            dataIndex: 'settleMonth',
          },
          {
            width: 215,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrSocial/tforecastlibrary/page', // 列表
          exportXlsUrl: 'hrSocial/tforecastlibrary/doexportForecastLibrary?',  // 批量导出
          createForecastlibaryByParam: 'hrSocial/tforecastlibrary/createForecastlibaryByParam', // 重新生成
          queryAllInfoById: 'hrSocial/tforecastlibrary/getAllInfo/', // 详情
          deleteUrl: '/hrSocial/tforecastlibrary/deleteForecastLibrary', // 删除
          deletesUrl: '/hrSocial/tforecastlibrary/deleteForecastLibraryBatch', // 批量删除
        },
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
      
      // 结算主体和所属单位
      // getAllSettleDomainSelectVos().then((res) => {
      //   if (Number(res.code) === 200) {
      //     this.settleDomainOptions = res.data
      //   } else {
      //     this.$message.error('结算主体和所属单位数据请求失败！')
      //   }
      // })
      // 获取社保户、公积金户
      getOrganization().then((res) => {
        if (Number(res.code) === 200) {
          this.organizationOptions = res.data
        } else {
          this.$message.error('社保户、公积金户数据请求失败！')
        }
      })
      // 获取前半年、后半年年和月组成的字符串的数组
      let yearMonthArr = []
      for (let i = 6; i >= -6; i--) {
        const monthsKey = moment().subtract(i, 'months').format(this.dateFormat)
        yearMonthArr.push(monthsKey)
      }
      this.yearMonthArrOptions = yearMonthArr
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
              settleDomainIds.push(cur.settleDomainId)
            },[])
            const ids = settleDomainIds.join(',')
            const resSet = await httpAction(`/hrBase/tsettledomain/selectSettleDomainAndCustomerMapByIds?ids=${ids}`,null,'get')
            if(Number(resSet.code) === 200) {
              this.settleDomainOptions = resSet.data.settleDomainMap
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
      // changeMonth(val){
      //   this.queryParam.settleMonth = val ? val.format('YYYYMM') : null
      // },
      // 重新生成
      handleAdd: function(type) {
        this.$refs.forecastLibraryAfreshModal.title = type==1 ? '按缴纳月重新生成预估' : '按截止月重新生成预估'
        this.$refs.forecastLibraryAfreshModal.createType = type
        this.$refs.forecastLibraryAfreshModal.yearMonthArrBelongs = this.yearMonthArrOptions
        if (this.yearMonthArrOptions.length > 0) {
          this.$refs.forecastLibraryAfreshModal.add()
        } else {
          this.$message.error(`"月份"${this.loadMessage}`)
        }
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.forecastLibraryDetailModal.editButton = false
        this.$refs.forecastLibraryDetailModal.title = '预估库详情'
        this.$refs.forecastLibraryDetailModal.settleDomainBelongs = this.settleDomainOptions
        this.$refs.forecastLibraryDetailModal.organizationBelongs = this.organizationOptions
        this.$refs.forecastLibraryDetailModal.settleFlagOption = this.settleFlagOption
        if (this.organizationOptions.length > 0 && Object.keys(this.settleDomainOptions).length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.forecastLibraryDetailModal.edit(res.data)
            } else {
              this.$message.error('数据请求失败！')
            }
          })
        } else {
          if (this.organizationOptions.length === 0) {
            this.$message.error(`"社保、公积金户"${this.loadMessage}`)
            return
          }
          if (Object.keys(this.settleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
          }
        }
      },
      // 批量导出
      handleExport: function() {
        const requestExportXlsUrl = this.url.exportXlsUrl
        const queryParams =  this.getQueryParams()
        // 处理查询条件
        let requestParams = {}
        for (const key in queryParams) {
          if (String(key) !== 'current' && String(key) !== 'size') {
            requestParams[key] = queryParams[key]
          }
        }
        // 处理选中的
        let idStr = ''
        if (this.selectedRowKeys.length > 0) {
          for (let a = 0; a < this.selectedRowKeys.length; a++) {
            if (a === this.selectedRowKeys.length - 1) {
              idStr += this.selectedRowKeys[a]
            } else {
              idStr += `${this.selectedRowKeys[a]},`
            }
          }
        }
        this.$refs.forecastLibraryExportModal.title = '预估库导出'
        this.$refs.forecastLibraryExportModal.idStr = idStr
        this.$refs.forecastLibraryExportModal.requestParams = requestParams
        this.$refs.forecastLibraryExportModal.exportFields = this.exportFields
        this.$refs.forecastLibraryExportModal.url.exportXlsUrl = requestExportXlsUrl
        // this.$refs.forecastLibraryExportModal.checkState.checkedList = this.exportFields
        this.$refs.forecastLibraryExportModal.add()
      },
      // 重置按钮
      searchReset() {
        this.queryParam = {}
        this.settleDomainDisabled = true
        this.settleDomainItems = []
        this.loadData(1)
      },
      // 数据字典
      initDictConfig() {
      },
      // 地区map渲染
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
      // 模板下载
      downTemplate(templateUrl) {
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port + templateUrl}`
        window.location.href = url
      },
      // 批量导入
      handleImportDetail(){
        this.$refs.forecastBatchImportModal.title = '导入预估明细'
        this.$refs.forecastBatchImportModal.show()
      },
      // 批量删除
      handleDeletes(){
        let that = this;
        if(this.selectedRowKeys.length>0){
          const ids = this.selectedRowKeys.join(',')
          const url = `${this.url.deletesUrl}?ids=${ids}`
          this.$confirm({
            title: '确认删除？',
            content: `仅可删除本人导入的且"未结算"的数据`,
            onOk: function () {
              that.deleteLoading = true
              httpAction(url,'','POST').then((res) => {
                if (Number(res.code) === 200) {
                  that.$message.success('已删除满足条件的数据')
                  that.loadData()
                  that.selectedRowKeys = []
                } else {
                  that.$message.warning(res.msg)
                  that.loadData()
                  that.selectedRowKeys = []
                }
              }).finally(()=>{
                that.deleteLoading = false
              })
            }
          })
        }else{
          const qs = require('qs')
          // 去除没有值得参数
          Object.keys(this.queryParam).map(item=>{
            if(!this.queryParam[item]){
              delete this.queryParam[item]
            }
          })
          const params = qs.stringify(this.queryParam)
          const url = `${this.url.deletesUrl}?${params}`
          this.$confirm({
            title: '确认删除？',
            content: `仅可删除本人导入的且"未结算"的数据`,
            onOk: function () {
              that.deleteLoading = true
              httpAction(url,'','POST').then((res) => {
                if (Number(res.code) === 200) {
                  that.$message.success('已删除满足条件的数据')
                  that.loadData()
                } else {
                  that.loadData()
                  that.$message.warning(res.msg)
                }
              }).finally(()=>{
                that.deleteLoading = false
              })
            }
          })
        }
      },
      // 删除社保/删除公积金
      handleDeleteEvent(record,type){
        // type：0社保；1公积金
        const url = `${this.url.deleteUrl}?id=${String(record.id)}&type=${type}`
        httpAction(url, '', 'POST').then((res) => {
          const tip = type?'公积金':'社保'
          if (Number(res.code) === 200) {
            this.$message.success(res.msg || `${tip}删除成功！`)
            this.loadData()
          } else {
            this.$message.error(res.msg || `${tip}删除失败！`)
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
