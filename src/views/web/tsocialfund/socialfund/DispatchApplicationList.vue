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
                label="派单状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.status"
                  placeholder="请选择派单状态查询"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in statusOptions"
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
                label="社保地市"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="选择省份"
                  v-model="queryParam.socialProvince"
                  style="width: 32%"
                  @change="handleSocialProvinceChange"
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
                  v-model="queryParam.socialCity"
                  style="margin-left: 2%; width: 32%"
                  @change="handleSocialCityChange"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item, index) in socialCitys"
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
                    v-for="(item, index) in socialTowns"
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
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="选择省份"
                  v-model="queryParam.fundProvince"
                  style="width: 32%"
                  @change="handleFundProvinceChange"
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
                  v-model="queryParam.fundCity"
                  style="margin-left: 2%; width: 32%"
                  @change="handleFundCityChange"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item, index) in fundCitys"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="选择区县"
                  v-model="queryParam.fundTown"
                  style="margin-left: 2%; width: 32%"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item, index) in fundTowns"
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
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="退回时间">
                <a-range-picker v-model="queryParam.lastBackTime_extra" @change="changeRange" />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item>
                <span slot="label">
                  重新派单日期
                  <a-tooltip title="可与“起止时间”组合查询，查询结果为：符合任一条件的派单数据" placement="bottom">
                    <a-icon type="question-circle-o" />
                  </a-tooltip>
                </span>
                <a-range-picker v-model="queryParam.repeatDate_extra" @change="changeRange2" />
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
        v-has="'wxhr:tdispatchinfo_add'"
      >增加派单</a-button>
      <a-button
        type="primary"
        icon="close"
        @click="handleDispatchReduce"
        v-has="'wxhr:tdispatchinfo_reduce'"
      >减少派单</a-button>
      <!-- 批量增加派单 -->
      <a-dropdown v-has="'wxhr:tdispatchinfo_importList'">
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
              />批量增加派单
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downTemplate('/templates/派单申请批量派增模板.xls')">
            <a-icon type="download" />批量增加模板
          </a-menu-item>
        </a-menu>
        <a-button>批量增加派单
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- 批量减少派单 -->
      <a-dropdown v-has="'wxhr:tdispatchinfo_batchReduce'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.reduceExcelUrl)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量减少派单
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downTemplate('/templates/派单申请批量派减模板.xls')">
            <a-icon type="download" />批量减少模板
          </a-menu-item>
        </a-menu>
        <a-button>批量减少派单
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- 批量提交审核 老功能不要了-->
      <!-- <a-button
        :disabled="selectedRowKeys.length>0?false:true"
        type="primary"
        icon="plus"
        @click="handleAddBatchApply('false')"
        v-has="'wxhr:tdispatchinfo_addBatchapply'"
      >批量提交审核</a-button> -->
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
          <!-- <a-divider
            v-if="record.status==0 || record.status==3"
            type="vertical"
            v-has="'wxhr:tdispatchinfo_edit'"
          />
          <a
            v-if="record.status==0 || record.status==3"
            @click="handleEdit(record)"
            v-has="'wxhr:tdispatchinfo_edit'"
          >编辑</a>
          <a-divider
            v-if="record.status==0 || record.status==3"
            type="vertical"
            v-has="'wxhr:tdispatchinfo_addBatchapply'"
          />
          <a
            v-if="record.status==0 || record.status==3"
            @click="handleAddBatchApply(record.id)"
            v-has="'wxhr:tdispatchinfo_addBatchapply'"
          >提交</a>
          <a-divider
            v-if="record.status==0 || record.status==3"
            type="vertical"
            v-has="'wxhr:tdispatchinfo_del'"
          />
          <a-popconfirm
            v-if="record.status==0 || record.status==3"
            title="确定作废吗?"
            @confirm="() => handleDelete(record.id)"
            v-has="'wxhr:tdispatchinfo_del'"
          >
            <a>作废</a>
          </a-popconfirm> -->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <dispatch-add-application-modal
      ref="dispatchAddApplicationModal"
      @ok="modalFormOk"
    ></dispatch-add-application-modal>
    <dispatch-add-batch-apply-modal
      ref="dispatchAddBatchApplyModal"
      @ok="modalFormOk"
    ></dispatch-add-batch-apply-modal>
    <dispatch-reduce-application-modal
      ref="dispatchReduceApplicationModal"
      @ok="modalFormOk"
    ></dispatch-reduce-application-modal>
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
    <dispatch-add-application-employee-list-modal
      ref="dispatchAddApplicationEmployeeListModal"
      @ok="modalFormOk"
    ></dispatch-add-application-employee-list-modal>
    <dispatch-reduce-application-employee-list-modal
      ref="dispatchReduceApplicationEmployeeListModal"
      @ok="modalFormOk"
    ></dispatch-reduce-application-employee-list-modal>
    <error-modal ref="errorModal"></error-modal>
    <audit-process-modal ref="auditProcessModal"></audit-process-modal>

  </a-card>
</template>

<script>
  import Vue from 'vue'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { httpAction, deleteAction,httpActionHeader,getAction } from '@/api/manage'
  import ErrorModal from '../../global/modules/ErrorModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import AuditProcessModal from './modules/AuditProcessModal'
  import DispatchAddBatchApplyModal from './modules/DispatchAddBatchApplyModal'
  import DispatchAddApplicationModal from './modules/DispatchAddApplicationModal'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import DispatchReduceApplicationModal from './modules/DispatchReduceApplicationModal'
  import DispatchAddApplicationDetailModal from './modules/DispatchAddApplicationDetailModal'
  import DispatchReduceApplicationDetailModal from './modules/DispatchReduceApplicationDetailModal'
  import { getHouseHold, areaMapTrees } from '@/api/api'
  import DispatchAddApplicationEmployeeListModal from './modules/DispatchAddApplicationEmployeeListModal'
  import DispatchReduceApplicationEmployeeListModal from './modules/DispatchReduceApplicationEmployeeListModal'
  import XLSX from 'xlsx'
  import { formatExcelDate,handleImportData } from '@/utils/common'

  export default {
    name: 'DispatchApplicationList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      SelectPage,
      AuditProcessModal,
      DispatchAddBatchApplyModal,
      DispatchAddApplicationModal,
      DispatchReduceApplicationModal,
      DispatchAddApplicationDetailModal,
      DispatchReduceApplicationDetailModal,
      DispatchAddApplicationEmployeeListModal,
      DispatchReduceApplicationEmployeeListModal,
    },
    data() {
      return {
        description: '派单申请',
        filterDictText,
        // 枚举字段
        areaTrees: [],  // 地区
        areaCitys: [],  // 档案城市
        areaTowns: [],  // 档案区县
        socialCitys: [], // 社保城市
        socialTowns: [], // 社保区县
        fundCitys: [], // 公积金城市
        fundTowns: [], // 公积金区县
        areaMapTrees: [], // map地区
        houseHolds: [], // 社保、公积金户
        
        empTypeOptions: [], // 员工类型
        contractTypeOptions: [], // 员工合同类型
        nextUserIdOptions: [],  // 下一步审核人
        settleDomainItems: [],  // 结算主体数组
        reduceReasonOptions: [],  // 减少原因
        settleDomainOptions: {},  // 结算主体
        fundPayPointOptions: [],  // 公积金单边小数点
        settleDomainDisabled: true,  // 结算主体不可选择
        employData:{}, //员工数据
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
          '0': {'option': '待办理', 'color': 'orange'},
          '1': {'option': '办理成功', 'color': 'green'},
          '2': {'option': '办理失败', 'color': 'red'},
          '3': {'option': '已派减', 'color': 'purple'},
          '4': {'option': '办理中', 'color': 'blue'},
          '5': {'option': '部分办理失败', 'color': 'pink'},
        },
        // excel表头数据
        exportFields: [],
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
            width: 150,
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
            width: 200,
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
            width: 140,
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
              const str = ((Object.keys(this.settleDomainOptions).length) && (this.settleDomainOptions).hasOwnProperty(record.settleDomain)) ? (this.settleDomainOptions)[record.settleDomain]['customerName'] : '-'
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
              let str = ((Object.keys(this.settleDomainOptions).length) && (this.settleDomainOptions).hasOwnProperty(text)) ? (this.settleDomainOptions)[text]['departName'] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
            ellipsis: true,
            title: '合同起止时间',
            align: 'center',
            dataIndex: 'contractStart',
            customRender:(text, record) => {
              const str = (record.contractStart ? record.contractStart : '-') + '~' + (record.contractEnd ? record.contractEnd : '-')
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 140,
            ellipsis: true,
            title: '合同期限',
            align: 'center',
            dataIndex: 'contractTerm',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 140,
            ellipsis: true,
            title: '合同类型',
            align: 'center',
            dataIndex: 'contractType',
            customRender:(text) => {
              const str = filterDictText(this.contractTypeOptions, text)
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '档案地市',
            align: 'center',
            dataIndex: 'fileProvince',
            customRender:(text, record) => {
              const fileName = this.getAreaMapName(record.fileProvince, record.fileCity, record.fileTown)
              const str = fileName ? fileName : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '社保地市',
            align: 'center',
            dataIndex: 'socialProvince',
            customRender:(text, record) => {
              const socialName = this.getAreaMapName(record.socialProvince, record.socialCity, record.socialTown)
              const str = socialName ? socialName : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '公积金地市',
            align: 'center',
            dataIndex: 'fundProvince',
            customRender:(text, record) => {
              const fundName = this.getAreaMapName(record.fundProvince, record.fundCity, record.fundTown)
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
            width: 120,
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
            width: 90,
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
            width: 130,
            ellipsis: true,
            title: '社保状态',
            align: 'center',
            dataIndex: 'socialHandleStatus',
            customRender:(text, record) => {
              for (const key in this.handleStatusOptions) {
                if (record.socialHandleStatus === null && key == 0) {
                  return '-'
                } else if (String(record.socialHandleStatus) === String(key)) {
                  const color = this.handleStatusOptions[key].color
                  const str = this.handleStatusOptions[key].option
                  return <a-tag color={color}>{str}</a-tag>
                }
              }
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
                if (record.fundHandleStatus === null && key == 0) {
                  return '-'
                } else if (String(record.fundHandleStatus) === String(key)) {
                  const color = this.handleStatusOptions[key].color
                  const str = (Number(record.type) === 1 ? '派减' : '派增') + this.handleStatusOptions[key].option
                  return <a-tag color={color}>{str}</a-tag>
                }
              }
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '退回时间',
            align: 'center',
            dataIndex: 'lastBackTime',
            customRender:(text) => {
              const textStr = text ? text : '-'
              return <a-tooltip placement="topLeft" title={textStr}>{textStr}</a-tooltip>
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
            width: 140,
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
            width: 170,
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
            width: 170,
            ellipsis: true,
            title: '重新派单日期',
            align: 'center',
            dataIndex: 'repeatDate',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 200,
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
          list: 'hrSocial/tdispatchinfo/pageOfUser?deleteFlag=0',
          delete: 'hrSocial/tdispatchinfo/',
          deleteBatch: 'hrSocial/tdispatchinfo/deleteBatch',
          templateUrl: 'hrSocial/templateInfo/template?fileName=',
          exportXlsUrl: 'hrSocial/tdispatchinfo/doexport?deleteFlag=0',
          importExcelUrl: 'hrSocial/tdispatchinfo/analysisJsonStringImportAll', //批量派增
          reduceExcelUrl: 'hrSocial/tdispatchinfo/analysisJsonStringForBatchReduce',  // 批量派减
          queryAllInfoById: 'hrSocial/tdispatchinfo/getSocialAndFundByDispatchId',  // 派增详情（派单信息、员工信息）
          queryAllInfoReduce: 'hrSocial/tdispatchinfo/getDispatchALLInfo',  // 派减详情（派单信息、员工信息）
          auditProcessUrl: 'hrSocial/tauditinfo/getAuditInfoByIdAndType',  // 流程进展明细
        },
        socialHandleStatusOption:{'0':'待办理','1':'全部办理成功','2':'全部办理失败','3':'已派减','4':'办理中','5':'部分办理失败'},
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

      // 结算主体和所属单位
      // getAllSettleDomainSelectVos().then((res) => {
      //   if (Number(res.code) === 200) {
      //     this.settleDomainOptions = res.data
      //   } else {
      //     this.$message.error('结算主体和所属单位数据请求失败！')
      //   }
      // })

      // 获取权限的用户（审核的权限）
      httpAction('admin/user/findUserBypPrmission?permissionStr=wxhr:tdispatchinfo_addApplyAudit', '', 'GET').then((res) => {
        if (Number(res.code) === 200) {
          this.nextUserIdOptions = res.data
        } else {
          this.$message.error('审核人数据请求失败！')
        }
      })

      httpAction('/admin/user/userDic','','GET').then((res) => {
        if (Number(res.code) === 200){
          this.employData = res.data
        }
      })

      // 获取社保户、公积金户
      getHouseHold().then((res) => {
        if (Number(res.code) === 200) {
          this.houseHolds = res.data
        } else {
          this.$message.error('社保户数据请求失败！')
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
      changeRange(date, dateString){
        this.queryParam.backTimeStart  = dateString[0]
        this.queryParam.backTimeEnd  = dateString[1]
      },
      changeRange2(date, dateString){
        this.queryParam.repeatDateStart  = dateString[0]
        this.queryParam.repeatDateEnd  = dateString[1]
      },
      downTemplate(templateUrl){
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port+templateUrl}`
        window.location.href = url
      },
      // 新建（增加派单）
      handleAdd: function() {
        this.$refs.dispatchAddApplicationEmployeeListModal.title = '增加派单员工选择'
        this.$refs.dispatchAddApplicationEmployeeListModal.houseHolds = this.houseHolds
        this.$refs.dispatchAddApplicationEmployeeListModal.AreaTrees = Vue.ls.get('glob_area')
        this.$refs.dispatchAddApplicationEmployeeListModal.empTypeBelongs = this.empTypeOptions
        this.$refs.dispatchAddApplicationEmployeeListModal.fundPayPointBelongs = this.fundPayPointOptions
        // this.$refs.dispatchAddApplicationEmployeeListModal.settleDomainBelongs = this.settleDomainOptions

        if (this.houseHolds.length > 0 && this.fundPayPointOptions.length > 0 && (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length > 0)) {
          this.$refs.dispatchAddApplicationEmployeeListModal.add()
          this.$refs.dispatchAddApplicationEmployeeListModal.loadData(1)
        } else {
          if (this.houseHolds.length === 0) {
            this.$message.error(`"社保、公积金户"${this.loadMessage}`)
            return false
          }
          if (this.fundPayPointOptions.length === 0) {
            this.$message.error(`"公积金单边小数点"${this.loadMessage}`)
            return false
          }
          if (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length === 0) {
            this.$message.error(`"地区"${this.loadMessage}`)
            return false
          }
        }
      },

      // 新建（减少派单）
      handleDispatchReduce: function() {
        this.$refs.dispatchReduceApplicationEmployeeListModal.title = '减少派单员工选择'
        this.$refs.dispatchReduceApplicationEmployeeListModal.empTypeBelongs = this.empTypeOptions
        this.$refs.dispatchReduceApplicationEmployeeListModal.reduceReasonBelongs = this.reduceReasonOptions
        // this.$refs.dispatchReduceApplicationEmployeeListModal.settleDomainBelongs = this.settleDomainOptions
        if (this.empTypeOptions.length > 0 && this.reduceReasonOptions.length > 0) {
          this.$refs.dispatchReduceApplicationEmployeeListModal.add()
          this.$refs.dispatchReduceApplicationEmployeeListModal.loadData(1)
        } else {
          if (this.empTypeOptions.length === 0) {
            this.$message.error(`"员工类型"${this.loadMessage}`)
            return false
          }
          if (this.reduceReasonOptions.length === 0) {
            this.$message.error(`"减少原因"${this.loadMessage}`)
            return false
          }
        }
      },

      // 编辑
      handleEdit: function(record) {
        if (record.type == 0) { // 派增
          this.$refs.dispatchAddApplicationModal.title = '派单申请编辑'
          this.$refs.dispatchAddApplicationModal.records = record
          this.$refs.dispatchAddApplicationModal.houseHolds = this.houseHolds
          this.$refs.dispatchAddApplicationModal.AreaTrees = Vue.ls.get('glob_area')
          this.$refs.dispatchAddApplicationModal.empTypeBelongs = this.empTypeOptions
          this.$refs.dispatchAddApplicationModal.fundPayPointBelongs = this.fundPayPointOptions
          this.$refs.dispatchAddApplicationModal.settleDomainBelongs = this.settleDomainOptions
          if (this.houseHolds.length > 0 && this.fundPayPointOptions.length > 0 && Object.keys(this.settleDomainOptions).length > 0 && (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length > 0)) {
            httpAction(`${this.url.queryAllInfoById}?id=${record.id}`, '', 'GET').then((res) => {
              if (Number(res.code) === 200 && res.data) {
                // if (record.typeSub == 0) { // 社保编辑
                //   res.data.fund = null
                // }

                // if (record.typeSub == 1) { // 公积金编辑
                //   res.data.socialInfo = null
                // }
                if (!res.data.fund && !res.data.socialInfo) { // 单纯员工
                  this.$refs.dispatchAddApplicationModal.submit = false
                }

                this.$refs.dispatchAddApplicationModal.recordInfo = res.data
                this.$refs.dispatchAddApplicationModal.edit(res.data)
              } else {
                this.$message.error('数据请求失败！')
              }
            })
          } else {
            if (this.houseHolds.length === 0) {
              this.$message.error(`"社保、公积金户"${this.loadMessage}`)
              return false
            }
            if (this.fundPayPointOptions.length === 0) {
              this.$message.error(`"公积金单边小数点"${this.loadMessage}`)
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
          }
        } else {  // 派减
          this.$refs.dispatchReduceApplicationModal.id = record.id
          this.$refs.dispatchReduceApplicationModal.title = '派单申请编辑'
          this.$refs.dispatchReduceApplicationModal.empTypeBelongs = this.empTypeOptions
          this.$refs.dispatchReduceApplicationModal.reduceReasonBelongs = this.reduceReasonOptions
          this.$refs.dispatchReduceApplicationModal.settleDomainBelongs = this.settleDomainOptions
          if (this.empTypeOptions.length > 0 && Object.keys(this.settleDomainOptions).length > 0 && this.reduceReasonOptions.length > 0) {
            httpAction(`${this.url.queryAllInfoReduce}?id=${record.id}`, '', 'GET').then((res) => {
              if (Number(res.code) === 200 && res.data.tdispatchInfo) {
                this.$refs.dispatchReduceApplicationModal.recordInfo = res.data.tdispatchInfo
                res.data.tdispatchInfo.empPhone = res.data.employeeInfo.empPhone
                this.$refs.dispatchReduceApplicationModal.edit(res.data.tdispatchInfo)
              } else {
                this.$message.error('数据请求失败！')
              }
            })
          } else {
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
          }
        }
      },

      // 详情
      handleDetail: function(record) {
        // 派单状态
        const status = this.statusOptions.hasOwnProperty(record.status) ? this.statusOptions[record.status] : '-'
        
        if (Number(record.type) === 0) { // 派增
          this.$refs.dispatchAddApplicationDetailModal.title = '派单申请详情'
          this.$refs.dispatchAddApplicationDetailModal.recordInfo = record
          this.$refs.dispatchAddApplicationDetailModal.AreaTrees = Vue.ls.get('glob_area')
          this.$refs.dispatchAddApplicationDetailModal.empTypeBelongs = this.empTypeOptions
          this.$refs.dispatchAddApplicationDetailModal.fundPayPointBelongs = this.fundPayPointOptions
          this.$refs.dispatchAddApplicationDetailModal.settleDomainBelongs = this.settleDomainOptions

          if (this.fundPayPointOptions.length > 0 && Object.keys(this.settleDomainOptions).length > 0 && (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length > 0)) {
              httpAction(`${this.url.queryAllInfoById}?id=${record.id}`, '', 'GET').then((res) => {
                if (Number(res.code) === 200 && res.data) {
                  let houseHoldsSelect = []
                  this.$refs.dispatchAddApplicationDetailModal.employeeContractInfo = res.data.dispatchInfo
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
                            this.$refs.dispatchAddApplicationDetailModal.houseHolds = houseHoldsSelect
                            this.$refs.dispatchAddApplicationDetailModal.edit(res.data, this.url.auditProcessUrl,status,true)
                          } else {
                            this.$message.error('公积金户数据请求失败！')
                          }
                        })
                      } else {
                        this.$message.error('社保户数据请求失败！')
                      }
                    })
                  } else if (res.data.socialInfo && !res.data.fund) {  // 只有社保
                    // 获取社保户
                    getHouseHold({id: res.data.socialInfo.socialHousehold}).then((socialHousehold) => {
                      if (Number(socialHousehold.code) === 200 && socialHousehold.data.length > 0) {
                        houseHoldsSelect.push(socialHousehold.data[0])
                        this.$refs.dispatchAddApplicationDetailModal.houseHolds = houseHoldsSelect
                        this.$refs.dispatchAddApplicationDetailModal.edit(res.data, this.url.auditProcessUrl,status,true)
                      } else {
                        this.$message.error('社保户数据请求失败！')
                      }
                    })
                  } else if (!res.data.socialInfo && res.data.fund) {  // 只有公积金
                    // 获取公积金户
                    getHouseHold({id: res.data.fund.providentHousehold}).then((providentHousehold) => {
                      if (Number(providentHousehold.code) === 200 && providentHousehold.data.length > 0) {
                        houseHoldsSelect.push(providentHousehold.data[0])
                        this.$refs.dispatchAddApplicationDetailModal.houseHolds = houseHoldsSelect
                        this.$refs.dispatchAddApplicationDetailModal.edit(res.data, this.url.auditProcessUrl,status,true)
                      } else {
                        this.$message.warning('公积金户数据请求失败！')
                      }
                    })
                  } else {
                    this.$refs.dispatchAddApplicationDetailModal.houseHolds = houseHoldsSelect
                    this.$refs.dispatchAddApplicationDetailModal.edit(res.data, this.url.auditProcessUrl,status,true)
                  }
                } else {
                  this.$message.error('数据请求失败！')
                }
              })
          } else {
            if (this.fundPayPointOptions.length === 0) {
              this.$message.error(`"公积金单边小数点"${this.loadMessage}`)
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
          }
        } else {  // 派减
          this.$refs.dispatchReduceApplicationDetailModal.title = '派单申请详情'
          this.$refs.dispatchReduceApplicationDetailModal.empTypeBelongs = this.empTypeOptions
          this.$refs.dispatchReduceApplicationDetailModal.reduceReasonBelongs = this.reduceReasonOptions
          this.$refs.dispatchReduceApplicationDetailModal.settleDomainBelongs = this.settleDomainOptions
          if (this.empTypeOptions.length > 0 && Object.keys(this.settleDomainOptions).length > 0 && this.reduceReasonOptions.length > 0) {
            httpAction(`${this.url.queryAllInfoReduce}?id=${record.id}`, '', 'GET').then((res) => {
              if (Number(res.code) === 200 && res.data.tdispatchInfo) {
                res.data.tdispatchInfo.empPhone = res.data.employeeInfo.empPhone
                this.$refs.dispatchReduceApplicationDetailModal.edit(res.data, this.url.auditProcessUrl,status)
              } else {
                this.$message.error('数据请求失败！')
              }
            })
          } else {
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
          }
        }
      },

      // 批量提交审核（含单个）
      handleAddBatchApply: function(id) {
        var ids = ''
        if (String(id) === 'false') {
          if (this.selectedRowKeys.length <= 0) {
            this.$message.warning('请选择一条记录！')
            return
          } else {
            for (let a = 0; a < this.selectedRowKeys.length; a++) {
              if (a === this.selectedRowKeys.length - 1) {
                ids += this.selectedRowKeys[a]
              } else {
                ids += `${this.selectedRowKeys[a]},`
              }
            }
          }
        } else {
          ids = id
        }
        this.$refs.dispatchAddBatchApplyModal.title = '提交审核'
        this.$refs.dispatchAddBatchApplyModal.ids = ids
        this.$refs.dispatchAddBatchApplyModal.nextUserIdBelongs = this.nextUserIdOptions
        if (this.nextUserIdOptions.length > 0) {
          this.$refs.dispatchAddBatchApplyModal.add()
        } else {
          if (this.nextUserIdOptions.length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return false
          }
        }
      },

      // 作废
      handleDelete: function (id) {
        if (!this.url.delete) {
          this.$message.error('请设置url.delete属性!')
          return
        }
        var that = this
        deleteAction(that.url.delete + id).then((res) => {
          if (Number(res.code) === 200) {
            that.$message.success('作废成功！')
            that.loadData()
          } else {
            //兼容
            that.$message.warning(res.message || res.msg)
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

      // 社保省份切换
      handleSocialProvinceChange(value) {
        this.socialCitys = []
        this.socialTowns = []
        if (value) {
          for (const c of this.areaTrees[value - 1].children) {
            this.socialCitys.push(c)
          }
        }
        delete this.queryParam.socialCity
        delete this.queryParam.socialTown
      },

      // 社保城市切换
      handleSocialCityChange(value) {
        this.socialTowns = []
        if (value) {
          for (const c of this.socialCitys) {
            if (String(c.id) === String(value)) {
              if (c.children.length > 0) {
                for (const t of c.children) {
                  this.socialTowns.push(t)
                }
              }
            break
            }
          }
        }
        delete this.queryParam.socialTown
      },

      // 公积金省份切换
      handleFundProvinceChange(value) {
        this.fundCitys = []
        this.fundTowns = []
        if (value) {
          for (const c of this.areaTrees[value - 1].children) {
            this.fundCitys.push(c)
          }
        }
        delete this.queryParam.fundCity
        delete this.queryParam.fundTown
      },

      // 公积金城市切换
      handleFundCityChange(value) {
        this.fundTowns = []
        if (value) {
          for (const c of this.fundCitys) {
            if (String(c.id) === String(value)) {
              if (c.children.length > 0) {
                for (const t of c.children) {
                  this.fundTowns.push(t)
                }
              }
            break
            }
          }
        }
        delete this.queryParam.fundTown
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

      // 重置按钮
      searchReset() {
        this.queryParam = {}
        this.settleDomainDisabled = true
        this.settleDomainItems = []
        this.areaCitys = []
        this.areaTowns = []
        this.socialCitys = []
        this.socialTowns = []
        this.fundCitys = []
        this.fundTowns = []
        this.loadData(1)
      },

      // 数据字典
      initDictConfig() {
        // 员工类型
        initDictOptions('personnel_type').then((res) => {
          if (Number(res.code) === 200) {
            this.empTypeOptions = res.data
          }
        })
        // 员工合同类型
        initDictOptions('employee_contract_type').then((res) => {
          if (Number(res.code) === 200) {
            this.contractTypeOptions = res.data
          }
        })

        // 公积金单边小数点
        initDictOptions('fund_pay_point').then((res) => {
          if (Number(res.code) === 200) {
            this.fundPayPointOptions = res.data
          }
        })
        
        // 减少原因
        initDictOptions('reduce_reason').then((res) => {
          if (Number(res.code) === 200) {
            this.reduceReasonOptions = res.data
          }
        })
      },
      
      // 实现导入
      uploadFilesChange(file, importUrl, timeOut,message) {
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
            for (const index in allSheets) {
              const name = allSheets[index].name
              if (workbook.Sheets.hasOwnProperty(name) && allSheets[index].Hidden === 0) {
                sheetName = name
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name],{defval:'',blankrows:true}))
                break
              }
            }
            // 去除每个字段的前后空格以及最后的空格行
            let newData = handleImportData(data[sheetName])
            newData = newData.map(item=>{
              for(const key in item){
                if(RegExp(/日期/).test(key) && typeof(item[key]) === "number"){
                  item[key] = formatExcelDate(item[key],'-')
                }
              }
              return item
            })
            const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
            const requestTimeOut = timeOut ? timeOut : 600000  // 请求过期时间
            //开始异步提交
            httpActionHeader(importUrl, JSON.stringify(newData), this.importMethod, contextType, requestTimeOut).then((res) => {
              that.loading = false
              const msg = res.message || res.msg

              if (Number(res.code) === 200) {
                if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  that.$refs.errorModal.title = '导入提示: ' + msg
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.errorMessageList)
                  that.loadData()
                } else {
                  that.$message.success(message || `导入成功！`)
                  that.loadData()
                }
              } else {
                if (res.data != null && res.data.length > 0) {
                  that.$refs.errorModal.title = '导入提示: ' + msg
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.data)
                } else if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  that.$refs.errorModal.title = '导入提示: ' + msg
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  that.$message.error(msg)
                }
              }
            })
          } catch (e) {
            console.log(e);
            // 这里可以抛出文件类型错误不正确的相关提示
            this.$message.error('文件上传错误！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file)
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
