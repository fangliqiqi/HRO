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
            <a-form-item label="社保编号">
              <a-input
                placeholder="请输入社保编号"
                :maxLength="20"
                v-model="queryParam.socialSecurityNo"
              ></a-input>
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
                v-model="queryParam.unitId"
                :searchUrl="'/hrBase/tcustomerinfo/page?selectType=4&customerName='"
              ></select-page>
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
                  v-model="queryParam.settleDomainId"
                  :searchUrl="'/hrBase/tsettledomain/page?selectType=4&departName='"
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
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="社保户"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择社保户查询"
                  v-model="queryParam.socialHousehold"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in householdOptions"
                    :key="key"
                    :value="value.id"
                  >{{ value.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="公积金户"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择公积金户查询"
                  v-model="queryParam.providentHousehold"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in householdOptions"
                    :key="key"
                    :value="value.id"
                  >{{ value.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="缴纳地市"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="选择省份"
                  v-model="queryParam.socialProvince"
                  style="width: 32%"
                  @change="handleProvinceChange"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item, index) in socialAreaTrees"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="选择城市"
                  v-model="queryParam.socialCity"
                  style="margin-left: 2%; width: 32%"
                  @change="handleCityChange"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item, index) in socialAreaCitys"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="选择区县"
                  v-model="queryParam.socialTown"
                  style="margin-left: 2%; width: 32%"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item, index) in socialAreaTowns"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
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
      <!-- <a-button
        @click="batchUplods"
        v-has="'wxhr:tpaymentinfo_importSocial'"
      >
        社保导入
      </a-button> -->

      <!-- 社保导入 -->
      <a-dropdown v-has="'wxhr:tpaymentinfo_importSocial'">
        <a-menu slot="overlay">
          <a-menu-item @click="batchUplods('2')">
            <a-icon type="import" />社保导入-合并版
          </a-menu-item>
          <a-menu-item @click="batchUplods('0')">
            <a-icon type="import" />养老三险导入
          </a-menu-item>
          <a-menu-item @click="batchUplods('1')">
            <a-icon type="import" />医保导入
          </a-menu-item>
        </a-menu>
        <a-button>社保导入
          <a-icon type="down" />
        </a-button>
      </a-dropdown>

      <!-- 社保模板 -->
      <a-dropdown v-has="'wxhr:tpaymentinfo_importSocial'">
        <a-menu slot="overlay">
          <a-menu-item @click="downloadLocalTemplate('/templates/社保模板-合并版.xls')">
            <a-icon type="download" />社保模板-合并版
          </a-menu-item>
          <a-menu-item @click="downloadLocalTemplate('/templates/养老三险模板.xls')">
            <a-icon type="download" />养老三险模板
          </a-menu-item>
          <a-menu-item @click="downloadLocalTemplate('/templates/医保模板.xls')">
            <a-icon type="download" />医保模板
          </a-menu-item>
        </a-menu>
        <a-button>社保模板
          <a-icon type="down" />
        </a-button>
      </a-dropdown>


      <!-- 公积金导入 -->
      <a-dropdown v-has="'wxhr:tpaymentinfo_importFund'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.importFundUrl, 600000)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />公积金导入
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downloadLocalTemplate('/templates/公积金模板.xls')">
            <a-icon type="download" />公积金模板
          </a-menu-item>
        </a-menu>
        <a-button>公积金导入
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-button
        type="primary"
        icon="download"
        @click="handleExport"
        v-has="'wxhr:tpaymentinfo_doexport'"
      >导出</a-button>
      <a-button
        type="primary"
        icon="lock"
        @click="handleBatchLock('batchLock')"
        v-has="'wxhr:tpaymentinfo_batchLock'"
      >批量锁定</a-button>
      <a-button
        type="primary"
        icon="delete"
        @click="handleBatchDelete"
        v-has="'wxhr:tpaymentinfo_del'"
      >删除当月</a-button>
      <a-button
        type="primary"
        icon="plus"
        @click="handleAdd"
        v-has="'wxhr:tpaymentinfo_del11'"
      >生成代理预估账单</a-button>
      <a-button
        type="primary"
        icon="delete"
        :disabled="selectedRowKeys.length > 0?false:true"
        @click="handleDelete('false')"
        v-has="'wxhr:tpaymentinfo_del'"
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
            v-has="'wxhr:tpaymentinfo_batchLock'"
            v-if="record.lockStatus==0"
          />
          <a-popconfirm
            title="确定锁定吗?"
            @confirm="() => handleBatchLock(record.id)"
            v-has="'wxhr:tpaymentinfo_batchLock'"
            v-if="record.lockStatus==0"
          >
            <a>锁定</a>
          </a-popconfirm>
          <a-divider
            type="vertical"
            v-if="record.lockStatus==0"
          />
          <a-dropdown v-if="record.lockStatus==0">
            <a class="ant-dropdown-link">更多
              <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item v-has="'wxhr:tpaymentinfo_edit'">
                <a @click="handleEdit(record)">编辑</a>
              </a-menu-item>
              <a-menu-item v-has="'wxhr:tpaymentinfo_del'" v-if="record.socialId">
                <a-popconfirm
                  title="确定删除社保吗?"
                  @confirm="() => deleteRow(record.id,0)"
                >
                  <a>删除社保</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-has="'wxhr:tpaymentinfo_del'" v-if="record.fundId">
                <a-popconfirm
                  title="确定删除公积金吗?"
                  @confirm="() => deleteRow(record.id,1)"
                >
                  <a>删除公积金</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-has="'wxhr:tpaymentinfo_del'">
                <a-popconfirm
                  title="确定删除全部吗?"
                  @confirm="() => handleDelete(record.id)"
                >
                  <a>删除全部</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <payment-lock-modal
      ref="paymentLockModal"
      @ok="modalFormOk"
    ></payment-lock-modal>
    <payment-export-modal
      ref="paymentExportModal"
      @ok="modalFormOk"
    ></payment-export-modal>
    <payment-detail-modal
      ref="paymentDetailModal"
      @ok="modalFormOk"
    ></payment-detail-modal>
    <forecast-bill-apply-modal
      ref="forecastBillApplyModal"
      @ok="modalFormOk"
    ></forecast-bill-apply-modal>
    <delete-payment-info-list-modal
      ref="deletePaymentInfoListModal"
      @ok="modalFormOk"
    ></delete-payment-info-list-modal>
    <error-modal ref="errorModal"></error-modal>
    <batch-uplods-modal ref="BatchUplodsModalForm" :type="0"></batch-uplods-modal>
    <error-modal ref="ErrorProcessModal"></error-modal>

  </a-card>
</template>

<script>
  import Vue from 'vue'
  import XLSX from 'xlsx'
  import moment from 'moment'
  import ErrorModal from './modules/ErrorModal'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import PaymentLockModal from './modules/PaymentLockModal'
  import PaymentDetailModal from './modules/PaymentDetailModal'
  import PaymentExportModal from './modules/PaymentExportModal'
  import ForecastBillApplyModal from './modules/ForecastBillApplyModal'
  import DeletePaymentInfoListModal from './modules/DeletePaymentInfoListModal'
  import { httpAction, deleteAction, httpActionHeader ,getAction} from '@/api/manage'
  import { getHouseHold } from '@/api/api'
  import { handleImportData,randomString } from '@/utils/common'
  import ErrorProcessModal from '../../../global/modules/ErrorProcessModal'
  import BatchUplodsModal from '../../global/modules/BatchUplodsModal' //批量上传

  export default {
    name: 'PaymentInfoList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      SelectPage,
      PaymentLockModal,
      PaymentDetailModal,
      PaymentExportModal,
      ErrorProcessModal,
      BatchUplodsModal,
      ForecastBillApplyModal,
      DeletePaymentInfoListModal,
    },
    data() {
      return {
        description: '缴费明细',
        // 枚举字段
        fileList: [], // 上传文件
        employData: {}, // 系统人员
        importMethod: 'post',
        householdOptions: [],  // 户
        settleDomainItems: [],  // 结算主体数组
        settleDomainOptions: {},  // 结算主体和所属单位
        yearMonthArrOptions: [],  // 年和月组成的字符串的数组
        settleDomainDisabled: true,  // 结算主体不可选择
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        flagOptions: {'0': {'option': '未结算', 'color': 'blue'}, '1': {'option': '待结算', 'color': 'pink'}, '2': {'option': '已结算', 'color': 'green'}},
        // excel表头数据
        exportFields: [],
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
            width: 125,
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
            width: 160,
            ellipsis: true,
            title: '社保编号',
            align: 'center',
            dataIndex: 'socialSecurityNo',
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
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '社保户',
            align: 'center',
            dataIndex: 'socialHousehold',
            customRender:(text) => {
              let str = '-'
              for (const item of this.householdOptions) {
                if (String(text) === String(item.id)) {
                  str = item.name
                  break
                }
              }
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '社保缴纳地',
            align: 'center',
            dataIndex: 'socialPayAddr',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 115,
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
            width: 115,
            ellipsis: true,
            title: '社保生成月份',
            align: 'center',
            dataIndex: 'socialCreateMonth',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '社保合计',
            align: 'center',
            dataIndex: 'socialSum',
            customRender:(text) => {
              let color = 'orange'
              let str = '0'
              if (text != null && text > 0) {
                color = 'green'
                str = text
              } else if (text != null && text < 0) {
                color = 'red'
                str = text
              }             
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '公积金合计',
            align: 'center',
            dataIndex: 'providentSum',
            customRender:(text) => {
              let color = 'orange'
              let str = '0'
              if (text != null && text > 0) {
                color = 'green'
                str = text
              } else if (text != null && text < 0) {
                color = 'red'
                str = text
              }
              
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '总合计',
            align: 'center',
            dataIndex: 'sumAll',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 110,
            ellipsis: true,
            title: '社保核准结算',
            align: 'center',
            dataIndex: 'socialSettlementFlag',
            customRender:(text) => {
              const color = this.flagOptions.hasOwnProperty(text) ? this.flagOptions[text].color : 'blue'
              const str = this.flagOptions.hasOwnProperty(text) ? this.flagOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '公积金户',
            align: 'center',
            dataIndex: 'providentHousehold',
            customRender:(text) => {
              let str = '-'
              for (const item of this.householdOptions) {
                if (String(text) === String(item.id)) {
                  str = item.name
                  break
                }
              }
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 160,
            ellipsis: true,
            title: '公积金缴纳地',
            align: 'center',
            dataIndex: 'providentPayAddr',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 115,
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
            width: 115,
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
            width: 120,
            ellipsis: true,
            title: '公积金核准结算',
            align: 'center',
            dataIndex: 'fundSettlementFlag',
            customRender:(text) => {
              const color = this.flagOptions.hasOwnProperty(text) ? this.flagOptions[text].color : 'blue'
              const str = this.flagOptions.hasOwnProperty(text) ? this.flagOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '创建人',
            align: 'center',
            dataIndex: 'createUser',
            customRender:(text) => {
              const str = ((Object.keys(this.employData).length) && (this.employData).hasOwnProperty(text)) ? (this.employData)[text] : '-'
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
        fundAreaTrees: [],
        fundAreaCitys: [],
        fundAreaTowns: [],
        socialAreaTrees: [],
        socialAreaCitys: [],
        socialAreaTowns: [],
        url: {
          list: 'hrSocial/tpaymentinfo/pageByUser',
          delete: 'hrSocial/tpaymentinfo/',
          batchLock: 'hrSocial/tpaymentinfo/batchLockByIds',
          templateUrl: 'hrSocial/templateInfo/template?fileName=',
          exportXlsUrl: 'hrSocial/tpaymentinfo/doexportPaymentInfo?',
          getExportField: 'hrSocial/tpaymentinfo/getTPaymentAllInfoExportVoFieldName',
          importFundUrl: 'hrSocial/tpaymentinfo/analysisJsonStringImportFund',
          importSocialUrl: 'hrSocial/tpaymentinfo/analysisJsonStringImportSocial',
          queryAllInfoById: 'hrSocial/tpaymentinfo/allInfo/',
          deleteRow:'/hrSocial/tpaymentinfo/removeByIdAndType'
        },
      }
    },
    created() {
      // 地区
      this.socialAreaTrees = this.fundAreaTrees = Vue.ls.get('glob_area')
      
      // 结算主体和所属单位
      // httpAction('hrBase/tsettledomain/selectAllUnitDeptVo',null,'get').then((res) => {
      //   if (Number(res.code) === 200) {
      //     this.settleDomainOptions = res.data
      //   } else {
      //     this.$message.error('结算主体和所属单位数据请求失败！')
      //   }
      // })
      // 获取社保户、公积金户
      getHouseHold().then((res) => {
        if (Number(res.code) === 200) {
          this.householdOptions = res.data
        } else {
          this.$message.error('社保户数据请求失败！')
        }
      })
      // 系统人员
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if (Number(res.code) === 200) {
          this.employData = res.data
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
      deleteRow(id,type){
        httpAction(`${this.url.deleteRow}?id=${id}&type=${type}`,null,'get').then(res=>{
          if(res.code === 200){
            const msg = (type === 1) ? '删除公积金成功' : '删除社保成功'
            this.$message.success(msg)
            this.loadData()
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      // 生成代理预估账单
      handleAdd: function() {
        this.$refs.forecastBillApplyModal.title = '生成代理预估账单'
        this.$refs.forecastBillApplyModal.yearMonthArrBelongs = this.yearMonthArrOptions
        if (this.yearMonthArrOptions.length > 0) {
          this.$refs.forecastBillApplyModal.add()
        } else {
          this.$message.error(`"缴纳月份"${this.loadMessage}`)
          return false
        }
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.paymentDetailModal.editButton = true
        this.$refs.paymentDetailModal.title = '缴费明细详情修改'
        this.$refs.paymentDetailModal.settleDomainBelongs = this.settleDomainOptions

        if (Object.keys(this.settleDomainOptions).length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              let houseHoldsSelect = []
              // 有社保有公积金
              if (res.data.socialHousehold && res.data.providentHousehold) {
                // 获取社保户
                getHouseHold({id: res.data.socialHousehold}).then((socialHousehold) => {
                  if (Number(socialHousehold.code) === 200 && socialHousehold.data.length > 0) {
                    houseHoldsSelect.push(socialHousehold.data[0])
                    // 获取公积金户
                    getHouseHold({id: res.data.providentHousehold}).then((providentHousehold) => {
                      if (Number(providentHousehold.code) === 200 && providentHousehold.data.length > 0) {
                        houseHoldsSelect.push(providentHousehold.data[0])
                        this.$refs.paymentDetailModal.organizationBelongs = houseHoldsSelect
                        this.$refs.paymentDetailModal.edit(res.data)
                      } else {
                        this.$message.error('公积金户数据请求失败！')
                      }
                    })
                  } else {
                    this.$message.error('社保户数据请求失败！')
                  }
                })
              } else if (res.data.socialHousehold && !res.data.providentHousehold) {  // 只有社保
                // 获取社保户
                getHouseHold({id: res.data.socialHousehold}).then((socialHousehold) => {
                  if (Number(socialHousehold.code) === 200 && socialHousehold.data.length > 0) {
                    houseHoldsSelect.push(socialHousehold.data[0])
                    this.$refs.paymentDetailModal.organizationBelongs = houseHoldsSelect
                    this.$refs.paymentDetailModal.edit(res.data)
                  } else {
                    this.$message.error('社保户数据请求失败！')
                  }
                })
              } else if (!res.data.socialHousehold && res.data.providentHousehold) {  // 只有公积金
                // 获取公积金户
                getHouseHold({id: res.data.providentHousehold}).then((providentHousehold) => {
                  if (Number(providentHousehold.code) === 200 && providentHousehold.data.length > 0) {
                    houseHoldsSelect.push(providentHousehold.data[0])
                    this.$refs.paymentDetailModal.organizationBelongs = houseHoldsSelect
                    this.$refs.paymentDetailModal.edit(res.data)
                  } else {
                    this.$message.error('公积金户数据请求失败！')
                  }
                })
              } else {  // 社保户、公积金户都没有
                this.$refs.paymentDetailModal.organizationBelongs = houseHoldsSelect
                this.$refs.paymentDetailModal.edit(res.data)
              }
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
        this.$refs.paymentDetailModal.editButton = false
        this.$refs.paymentDetailModal.title = '缴费明细详情'
        this.$refs.paymentDetailModal.settleDomainBelongs = this.settleDomainOptions

        if (Object.keys(this.settleDomainOptions).length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              let houseHoldsSelect = []
              // 有社保有公积金
              if (res.data.socialHousehold && res.data.providentHousehold) {
                // 获取社保户
                getHouseHold({id: res.data.socialHousehold}).then((socialHousehold) => {
                  if (Number(socialHousehold.code) === 200 && socialHousehold.data.length > 0) {
                    houseHoldsSelect.push(socialHousehold.data[0])
                    // 获取公积金户
                    getHouseHold({id: res.data.providentHousehold}).then((providentHousehold) => {
                      if (Number(providentHousehold.code) === 200 && providentHousehold.data.length > 0) {
                        houseHoldsSelect.push(providentHousehold.data[0])
                        this.$refs.paymentDetailModal.organizationBelongs = houseHoldsSelect
                        this.$refs.paymentDetailModal.edit(res.data)
                      } else {
                        this.$message.error('公积金户数据请求失败！')
                      }
                    })
                  } else {
                    this.$message.error('社保户数据请求失败！')
                  }
                })
              } else if (res.data.socialHousehold && !res.data.providentHousehold) {  // 只有社保
                // 获取社保户
                getHouseHold({id: res.data.socialHousehold}).then((socialHousehold) => {
                  if (socialHousehold.code === 200 && socialHousehold.data.length > 0) {
                    houseHoldsSelect.push(socialHousehold.data[0])
                    this.$refs.paymentDetailModal.organizationBelongs = houseHoldsSelect
                    this.$refs.paymentDetailModal.edit(res.data)
                  } else {
                    this.$message.error('社保户数据请求失败！')
                  }
                })
              } else if (!res.data.socialHousehold && res.data.providentHousehold) {  // 只有公积金
                // 获取公积金户
                getHouseHold({id: res.data.providentHousehold}).then((providentHousehold) => {
                  if (providentHousehold.code === 200 && providentHousehold.data.length > 0) {
                    houseHoldsSelect.push(providentHousehold.data[0])
                    this.$refs.paymentDetailModal.organizationBelongs = houseHoldsSelect
                    this.$refs.paymentDetailModal.edit(res.data)
                  } else {
                    this.$message.error('公积金户数据请求失败！')
                  }
                })
              } else {  // 社保户、公积金户都没有
                this.$refs.paymentDetailModal.organizationBelongs = houseHoldsSelect
                this.$refs.paymentDetailModal.edit(res.data)
              }
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
      // 锁定(批量)
      handleBatchLock: function(id) {
        if (String(id) === 'batchLock') {
          this.$refs.paymentLockModal.title = '批量锁定'
          this.$refs.paymentLockModal.type = 'batchLock'
          this.$refs.paymentLockModal.AreaTrees = this.socialAreaTrees
          this.$refs.paymentLockModal.add()
        } else {
          httpAction(`${this.url.batchLock}?ids=${id}`, '', 'POST').then((res) => {
            if (Number(res.code) === 200) {
              this.$message.success('锁定成功！')
            } else {
              this.$message.warning(res.msg || res.message)
            }
          }).finally(() => {
            this.loadData()
          })
        }
      },
      // 导出
      handleExport: function() {
        httpAction(this.url.getExportField,{},'GET').then((res) => {
          if (Number(res.code) === 200) {
            this.exportFields = res.data
            let requestExportXlsUrl = this.url.exportXlsUrl
            let queryParams =  this.getQueryParams()
            if (Object.keys(queryParams).length <= 2 && this.selectedRowKeys.length === 0) { // 没查询条件拒绝请求
              this.$message.warning('请根据筛选条件进行导出！')
              return false
            }
            
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

            this.$refs.paymentExportModal.title = '缴费明细导出'
            this.$refs.paymentExportModal.exportFields = this.exportFields
            this.$refs.paymentExportModal.url.exportXlsUrl = requestExportXlsUrl
            this.$refs.paymentExportModal.checkState.checkedList = this.exportFields
            this.$refs.paymentExportModal.add()
          }
        })
      },
      // 删除
      handleDelete: function (id) {
        if (!this.url.delete) {
          this.$message.error('请设置url.delete属性!')
          return
        }

        var that = this
        // 批量删除
        if (String(id) === 'false') {
          if (this.selectedRowKeys.length <= 0) {
            this.$message.warning('请选择一条记录！')
            return false
          } else {
            var ids = ''

            for (let a = 0; a < this.selectedRowKeys.length; a++) {
              if (a == this.selectedRowKeys.length - 1) {
                ids += this.selectedRowKeys[a]
              } else {
                ids += `${this.selectedRowKeys[a]},`
              }
            }

            this.$confirm({
              title: '确认删除',
              content: '是否删除选中的数据?',
              onOk: function() {
                deleteAction(`hrSocial/tpaymentinfo/removeBatchByIds?ids=${ids}`).then((res) => {
                  if (Number(res.code) === 200) {
                    that.$message.success('删除成功!')
                    that.loadData()
                  } else {
                    //兼容
                    that.$message.warning(res.message || res.msg)
                  }
                }).finally(() => {
                  that.onClearSelected()
                  that.loadData()
                })
              }
            })
          }
        } else {  // 单条删除
          deleteAction(that.url.delete + id).then((res) => {
            if (Number(res.code) === 200) {
              that.$message.success('删除成功!')
              that.loadData()
            } else {
              //兼容
              that.$message.warning(res.message || res.msg)
            }
          })
        }
      },
      // 类型删除
      handleBatchDelete: function() {
        this.$refs.deletePaymentInfoListModal.title = '删除当月'
        this.$refs.deletePaymentInfoListModal.add()
      },
      // 批量导入
      beforeUpload(file) {
        // this.fileList = [...this.fileList, file]
        this.fileList = [file]
        return false
      },
      // 导入功能
      handleImport(importUrl, timeOut) {
        const { fileList } = this
        const formData = new FormData()
        fileList.forEach((file) => {
          formData.append('files[]', file)
        })
        this.uploadFilesChange(fileList[0], importUrl, timeOut)
      },
      // 实现导入
      uploadFilesChange(file, importUrl, timeOut) {
        var that = this
        // 通过FileReader对象读取文件
        const fileReader = new FileReader()
        fileReader.onload = event => {
          try {
            that.loading = true
            const { result } = event.target
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary' })
            // 存储获取到的数据
            const data = {}
            let sheetName = ''

            // 遍历获取每张工作表 除去隐藏表
            const allSheets = workbook.Workbook.Sheets
            for(const index in allSheets){
              const name = allSheets[index].name
              if(workbook.Sheets.hasOwnProperty(name) && allSheets[index].Hidden == 0){
                sheetName = name
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name],{defval:'',blankrows:true}))
                break
              }
            }
            // 去除空格 去除最后的空格行
            const newData = handleImportData(data[sheetName])
            const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
            const requestTimeOut = timeOut ? timeOut : 600000  // 请求过期时间
            httpActionHeader(importUrl, JSON.stringify(newData), this.importMethod, contextType, requestTimeOut).then((res) => {
              that.loading = false
              const msg = res.message || res.msg

              if (Number(res.code) === 200) {
                if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  that.$refs.errorModal.title = `导入提示: ${msg}`
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.errorMessageList)
                  that.loadData()
                } else {
                  that.$message.success("导入成功！")
                  that.loadData()
                }
              } else {
                if (res.data != null && res.data.length > 0) {
                  that.$refs.errorModal.title = `导入提示: ${msg}`
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.data)
                } else if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  that.$refs.errorModal.title = `导入提示: ${msg}`
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  that.$message.error(msg)
                }
              }
            })
          } catch (e) {
            this.$message.error('文件上传错误！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file)
      },
      // 社保缴纳地省份切换
      handleProvinceChange(value) {
        this.socialAreaCitys = []
        this.socialAreaTowns = []

        if (value) {
          for (var c of this.socialAreaTrees[value - 1].children) {
            this.socialAreaCitys.push(c)
          }
        }

        delete this.queryParam.socialCity
        delete this.queryParam.socialTown
      },
      // 社保缴纳地城市切换
      handleCityChange(value) {
        this.socialAreaTowns = []

        if (value) {
          for (const c of this.socialAreaCitys) {
            if (String(c.id) === String(value)) {
              if (c.children.length > 0) {
                for (const t of c.children) {
                  this.socialAreaTowns.push(t)
                }
              }
            break
            }
          }
        }
        delete this.queryParam.socialTown
      },
      // 公积金缴纳地省份切换
      handleFundProvinceChange(value) {
        this.fundAreaCitys = []
        this.fundAreaTowns = []

        if (value) {
          for (const c of this.fundAreaTrees[value - 1].children) {
            this.fundAreaCitys.push(c)
          }
        }
        delete this.queryParam.fundCity
        delete this.queryParam.fundTown
      },
      // 公积金缴纳地城市切换
      handleFundCityChange(value) {
        this.fundAreaTowns = []
        if (value) {
          for (const c of this.fundAreaCitys) {
            if (String(c.id) === String(value)) {
              if (c.children.length > 0) {
                for (const t of c.children) {
                  this.fundAreaTowns.push(t)
                }
              }
            break
            }
          }
        }
        delete this.queryParam.fundTown
      },
      // 重置按钮
      searchReset() {
        this.queryParam = {}
        this.settleDomainDisabled = true
        this.settleDomainItems = []
        this.socialAreaCitys = []
        this.socialAreaTowns = []
        this.fundAreaCitys = []
        this.fundAreaTowns = []
        this.loadData(1)
      },
      // 数据字典
      initDictConfig() {
      },
      //批量上传 上传进度
      batchUplods(num){
        const randomStr = this.$store.getters.userInfo.id + randomString()
        this.$refs.BatchUplodsModalForm.url.method = 'POST'
        this.$refs.BatchUplodsModalForm.show(randomStr,num)
         if(num=='0'){
          this.$refs.BatchUplodsModalForm.url.importUrl = `/hrSocial/tpaymentinfo/analysisJsonImportSocialHeFei?random=${randomStr}&type=0` 
        }else if(num=='1'){
          this.$refs.BatchUplodsModalForm.url.importUrl = `/hrSocial/tpaymentinfo/analysisJsonImportSocialHeFei?random=${randomStr}&type=1`
        }else if(num == '2'){
          this.$refs.BatchUplodsModalForm.url.importUrl = `/hrSocial/tpaymentinfo/analysisJsonStringImportSocial?random=${randomStr}`
        }
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
