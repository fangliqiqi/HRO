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
              <a-form-item label="结算主体">
                <select-page
                  :id="'id'"
                  :title="'departName'"
                  placeholder="请选择结算主体查询"
                  v-model="queryParam.departId"
                  :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="客户单位">
                <select-page
                  :id="'id'"
                  :title="'customerName'"
                  placeholder="请选择客户单位查询"
                  v-model="queryParam.unitId"
                  :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="缴纳月">
                <a-month-picker
                  allowClear
                  v-model="queryParam.socialSecurityMonth_extra"
                  placeholder="请选择缴纳月"
                  style="width: 100%"
                  format="YYYYMM"
                  @change="changeMonth"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="社保缴纳地">
                <a-input
                  placeholder="请输入社保缴纳地"
                  v-model="queryParam.socialSecurityAddr"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="公积金缴纳地">
                <a-input
                  placeholder="请输入公积金缴纳地"
                  v-model="queryParam.providentAddr"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="导入开始日期">
                <a-date-picker
                  format="YYYY-MM-DD HH:mm:ss"
                  style="width:100%;"
                  :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                  :disabled-date="disabledStartDate"
                  @openChange="handleStartOpenChange"
                  v-model="queryParam.createTimeStart"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="导入结束日期">
                <a-date-picker
                  format="YYYY-MM-DD HH:mm:ss"
                  :showTime="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }"
                  :disabled-date="disabledEndDate"
                  style="width:100%;"
                  v-model="queryParam.createTimeEnd"
                  :open="endOpen"
                  @openChange="handleEndOpenChange"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="是否结算"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.settlementFlag"
                  placeholder="请选择是否结算"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option value="0">是</a-select-option>
                  <a-select-option value="1">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="原因小类"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.reasonType"
                  placeholder="请选择原因小类"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item,index) in reasonTypeList"
                    :key="index"
                    :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="结算状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.clearingStatus"
                  placeholder="请选择结算状态"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option value="0">未结算</a-select-option>
                  <a-select-option value="1">已结算</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="生成月份"
                class="stepFormText"
              >
                <a-month-picker
                  placeholder="请选择生成月份"
                  style="width:100%"
                  v-model="queryParam.createMonth_extra"
                  format="YYYYMM"
                  @change="onChangeMonth"
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
        @click="handleAdd"
        v-has="'wxhr:tcomparisonlibrary_create'"
      >生成差余额</a-button>
      <a-button
        type="primary"
        icon="download"
        @click="handleExport"
        v-has="'wxhr:tcomparisonlibrary_doexport'"
      >导出</a-button>
      <!-- 批量导入 -->
      <a-dropdown v-has="'wxhr:tcomparisonlibrary_import'">
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
              />批量导入
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downloadLocalTemplate('/templates/对比库导入模板.xls')">
            <a-icon type="download" />导入模板
          </a-menu-item>
        </a-menu>
        <a-button>批量导入
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-dropdown v-has="'wxhr:tcomparisonlibrary_update'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.updateUrl)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量更新
            </a-upload>
          </a-menu-item>
          <!-- <a-menu-item @click="downloadLocalTemplate('/templates/差余额更新模板.xls')">
            <a-icon type="download" />批量更新模板
          </a-menu-item> -->
        </a-menu>
        <a-button>批量更新
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-button
        type="primary"
        icon="delete"
        @click="batchDelete"
        :disabled="selectedRowKeys.length?false:true"
        v-has="'wxhr:tcomparisonlibrary_del'"
      >批量删除</a-button>
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
          <a-divider
            type="vertical"
            v-if="record.clearingStatus == 0"
            v-has="'wxhr:tcomparisonlibrary_edit'"
          />
          <a
            @click="handleEdit(record)"
            v-if="record.clearingStatus == 0"
            v-has="'wxhr:tcomparisonlibrary_edit'"
          >编辑</a>
          <a-divider
            v-if="record.clearingStatus==0 && record.salaryFundFlag==0 && record.salarySocialFlag==0"
            type="vertical"
            v-has="'wxhr:tcomparisonlibrary_del'"
          />
          <a-popconfirm
            v-if="record.clearingStatus==0 && record.salaryFundFlag==0 && record.salarySocialFlag==0"
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
            v-has="'wxhr:tcomparisonlibrary_del'"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <comparison-export-modal
      ref="comparisonExportModal"
      @ok="modalFormOk"
    ></comparison-export-modal>
    <comparison-library-add-modal
      ref="comparisonLibraryAddModal"
      @ok="modalFormOk"
    ></comparison-library-add-modal>
    <comparison-library-detail-modal
      ref="comparisonLibraryDetailModal"
      @ok="modalFormOk"
    ></comparison-library-detail-modal>
    <error-modal ref="errorModal"></error-modal>

  </a-card>
</template>

<script>
  import moment from 'moment'
  import { httpAction ,getAction} from '@/api/manage'
  import { getNameFromArr } from '@/utils/common'
  import ErrorModal from '../../global/modules/ErrorModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ComparisonExportModal from './modules/ComparisonExportModal'
  import { getUnitSelectVos } from '@/api/api'
  import ComparisonLibraryAddModal from './modules/ComparisonLibraryAddModal'
  import ComparisonLibraryDetailModal from './modules/ComparisonLibraryDetailModal'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'ComparisonLibraryList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      ComparisonExportModal,
      ComparisonLibraryAddModal,
      ComparisonLibraryDetailModal,
      SelectPage
    },
    data() {
      return {
        description: '差余额',
        // 枚举字段
        unitOptions: [], // 单位和结算主体
        settleDomainOptions: {},  // 结算主体和所属单位
        dateFormat: 'YYYYMM', // 时间格式化
        yearMonthArrOptions: [],  // 年和月组成的字符串的数组
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        reasonPrimaryTypeList:[], // 原因大类
        reasonTypeList:[], // 原因小类
        // excel表头数据
        exportFields: [
          '主键','是否结算','员工编码', '员工姓名', '员工身份证','所属单位', '所属部门', '社保编号', '社保缴纳地', '社保缴纳月份', '社保生成月份', '单位社保差额合计', '个人社保差额合计',
          '公积金缴纳地', '公积金缴纳月份', '公积金生成月份', '单位公积金差额', '个人公积金差额', '单位合计差额', '个人合计差额', '合计差额', '结算状态', '单位养老差额', '单位医疗差额', '单位失业差额', '单位工伤差额', '单位社保补缴利息',
          '单位生育差额', '单位大病差额', '个人养老差额', '个人医疗差额', '个人失业差额', '个人大病差额', '个人社保补缴利息', '工资社保结算状态', '工资公积金结算状态','原因大类','原因小类', '原因备注'
        ],
        // 表头
        columns: [
          {
            width: 125,
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
            title: '员工身份证',
            align: 'center',
            dataIndex: 'empIdcard',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '缴纳月份',
            align: 'center',
            dataIndex: 'socialSecurityMonth',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'departId',
            customRender:(text) => {
              const str = this.settleDomainOptions[text] ? this.settleDomainOptions[text]['departName'] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '客户单位',
            align: 'center',
            dataIndex: 'unitId',
            customRender:(text) => {
              const str = getNameFromArr(this.unitOptions,text,'id','customerName')
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 170,
            ellipsis: true,
            title: '社保缴纳地',
            align: 'center',
            dataIndex: 'socialSecurityAddr',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 170,
            ellipsis: true,
            title: '单位社保合计差额',
            align: 'center',
            dataIndex: 'socialSecurityCompanySum',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 170,
            ellipsis: true,
            title: '个人社保合计差额',
            align: 'center',
            dataIndex: 'socialSecurityPersonalSum',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 170,
            ellipsis: true,
            title: '公积金缴纳地',
            align: 'center',
            dataIndex: 'providentAddr',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '单位公积金差额',
            align: 'center',
            dataIndex: 'providentCompanyDiff',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '个人公积金差额',
            align: 'center',
            dataIndex: 'providentPersonalDiff',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '是否结算',
            align: 'center',
            dataIndex: 'settlementFlag',
            customRender:(text) => {
              const str = text == 1 ? '否' : '是'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '结算状态',
            align: 'center',
            dataIndex: 'clearingStatus',
            customRender:(text) => {
              const str = text == '1' ? '已结算' : '未结算'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '生成月份',
            align: 'center',
            dataIndex: 'createMonth',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '原因小类',
            align: 'center',
            dataIndex: 'reasonType',
            customRender:(text) => {
              const resultText = filterDictText(this.reasonTypeList, text) || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '导入日期',
            align: 'center',
            dataIndex: 'createTime',
            customRender:(text) => {
              const ctime = text ? text : '-'
              return <a-tooltip title={ctime}>{ctime}</a-tooltip>
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
          list: 'hrSocial/tcomparisonlibrary/page',
          delete: 'hrSocial/tcomparisonlibrary/',
          templateUrl: 'hrSocial/templateInfo/template?fileName=',  // 模板下载
          exportXlsUrl: 'hrSocial/tcomparisonlibrary/doexportComparisonLibary?',  // 导出
          importExcelUrl: 'hrSocial/tcomparisonlibrary/analysisJsonStringImport', // 批量导入
          updateUrl:'hrSocial/tcomparisonlibrary/analysisJsonStringUpdate',
          queryAllInfoById: 'hrSocial/tcomparisonlibrary/getAllInfoById/', // 详情
          batchDel:'/hrSocial/tcomparisonlibrary/removeBatchById'
        },
        endOpen:false,
      }
    },
    created() {
      // 获取登录用户拥有结算主体权限的单位信息（包含结算主体）
      getUnitSelectVos().then((res) => {
        if (Number(res.code) === 200) {
          this.unitOptions = res.data
        } else {
          this.$message.error('单位信息数据请求失败！')
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
              settleDomainIds.push(cur.departId)
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
      onChangeMonth(date){
        this.queryParam.createMonth = date ? date.format('YYYYMM') : null
      },
      // 禁用行
      getCheckboxProps: record => ({
        props: {
          disabled: record.forecastFormId
        },
      }),
      disabledStartDate(startValue) {
        const endValue = this.queryParam.createTimeEnd
        if (!startValue || !endValue) {
          return false
        }
        return startValue.valueOf() > endValue.valueOf()
      },
      disabledEndDate(endValue) {
        const startValue = this.queryParam.createTimeStart
        if (!endValue || !startValue) {
          return false
        }
        return startValue.valueOf() >= endValue.valueOf()
      },
      handleStartOpenChange(open) {
        if (!open) {
          this.endOpen = true
        }
      },
      handleEndOpenChange(open) {
        this.endOpen = open
      },
      downloadLocalTemplate(templateUrl){
        window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
      },
      changeMonth(val){
        if(val){
          this.queryParam.socialSecurityMonth = val.format('YYYYMM')
        }else{
          this.queryParam.socialSecurityMonth = null
        }
      },
      batchDelete(){
        const _this = this
        this.$confirm({
          title: '确认批量删除?',
          onOk() {
            httpAction(`${_this.url.batchDel}?ids=${_this.selectedRowKeys.join(',')}`,null,'post').then(res=>{
              if(res.code === 200){
                const msg = res.msg || res.message
                if (res.errorMessageList && res.errorMessageList.length) {
                  _this.$refs.errorModal.title = `批量删除提示: ${msg}`
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  _this.$message.success('批量删除成功！')
                }
                _this.selectedRowKeys = []
                _this.loadData()
              }else{
                _this.$message.error(res.msg)
              }
            })
          },
        });
      },
      // 生成核准表
      handleAdd: function() {
        this.$refs.comparisonLibraryAddModal.title = '生成差余额'
        // this.$refs.comparisonLibraryAddModal.unitBelongs = this.unitOptions
        this.$refs.comparisonLibraryAddModal.yearMonthArrBelongs = this.yearMonthArrOptions
        if (this.yearMonthArrOptions.length > 0) {
          this.$refs.comparisonLibraryAddModal.add()
        } else {
          this.$message.error(`"缴纳月份"${this.loadMessage}`)
          return false
        }
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.comparisonLibraryDetailModal.editButton = true
        this.$refs.comparisonLibraryDetailModal.title = '差余额编辑'
        this.$refs.comparisonLibraryDetailModal.settleDomainBelongs = this.settleDomainOptions
        if (Object.keys(this.settleDomainOptions).length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.comparisonLibraryDetailModal.edit(res.data,this.reasonPrimaryTypeList,this.reasonTypeList)
            } else {
              this.$message.error('数据请求失败！')
            }
          })
        } else {
          if (Object.keys(this.settleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return false
          }
        }
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.comparisonLibraryDetailModal.editButton = false
        this.$refs.comparisonLibraryDetailModal.title = '差余额详情'
        this.$refs.comparisonLibraryDetailModal.settleDomainBelongs = this.settleDomainOptions
        if (Object.keys(this.settleDomainOptions).length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.comparisonLibraryDetailModal.edit(res.data,this.reasonPrimaryTypeList,this.reasonTypeList)
            } else {
              this.$message.error('数据请求失败！')
            }
          })
        } else {
          if (Object.keys(this.settleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return false
          }
        }
      },
      // 导出
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
        this.$refs.comparisonExportModal.title = '差余额导出'
        this.$refs.comparisonExportModal.idStr = idStr
        this.$refs.comparisonExportModal.requestParams = requestParams
        this.$refs.comparisonExportModal.exportFields = this.exportFields
        this.$refs.comparisonExportModal.url.exportXlsUrl = requestExportXlsUrl
        // this.$refs.comparisonExportModal.checkState.checkedList = this.exportFields
        this.$refs.comparisonExportModal.add()
      },
      // 数据字典
      initDictConfig() {
        // 原因大类
        initDictOptions('REASON_PRIMARY_TYPE').then((res) => {
          if (Number(res.code) === 200) {
            this.reasonPrimaryTypeList = res.data
          }
        })
        // 原因小类
        initDictOptions('REASON_TYPE').then((res) => {
          if (Number(res.code) === 200) {
            this.reasonTypeList = res.data
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
