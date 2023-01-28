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
                label="在职细分"
                class="stepFormText"
              >
                <a-select
                  placeholder="请选择在职细分"
                  v-model="queryParam.workingStatusSub"
                  :allowClear="true"
                >
                  <a-select-option value="0">在职</a-select-option>
                  <a-select-option value="3">临时</a-select-option>
                </a-select>
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
                label="合同附件是否上传"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.contractFileStatus"
                  placeholder="请选择合同附件是否上传查询"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in contractFileStatusOptions"
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
                  mode="multiple"
                  placeholder="请选择员工"
                  v-model="queryParam.empMore"
                  @change="handleChange"
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
        type="primary"
        icon="plus"
        @click="handleAdd"
        v-has="'wxhr:temployeeinfo_add'"
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
        @click="handleExportBase"
        v-has="'wxhr:temployeeinfo_exportList'"
      >导出基本信息</a-button>
      <!-- 批量新增 -->
      <a-dropdown v-has="'wxhr:temployeeinfo_importList'">
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
          <a-menu-item @click="downloadLocalTemplate('/templates/员工批量新增模板.xls')">
            <a-icon type="download" />新增模板
          </a-menu-item>
        </a-menu>
        <a-button>批量新增
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- 批量更新 -->
      <a-dropdown v-has="'wxhr:temployeeinfo_batchUpdateEmployeeByJsonString'">
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
              />批量更新
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downloadLocalTemplate('/templates/员工批量更新模板.xls')">
            <a-icon type="download" />更新模板
          </a-menu-item>
        </a-menu>
        <a-button>批量更新
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-dropdown v-has="'wxhr:temployeeinfo_batchUpdateEmployeeBankInfo'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.importExcelBatchBank,'post')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量更新开户行
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downloadLocalTemplate('/templates/员工银行信息批量更新模板.xls')">
            <a-icon type="download" />银行信息模板下载
          </a-menu-item>
        </a-menu>
        <a-button>批量更新开户行
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-dropdown v-has="'wxhr:temployeeinfo_batchUpdateEmployeeBankInfo_admin'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.importExcelBatchBankAdmin,'post')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量更新开户行(管理员)
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downloadLocalTemplate('/templates/员工银行信息批量更新模板.xls')">
            <a-icon type="download" />银行信息模板下载
          </a-menu-item>
        </a-menu>
        <a-button>批量更新开户行(管理员)
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- 批量锁定 -->
      <a-dropdown v-has="'wxhr:temployeeinfo_batchLocked'">
        <a-menu slot="overlay">
          <a-menu-item @click="employeeSettleDomainLocked">
            <a-icon type="lock" />主体锁定
          </a-menu-item>
          <a-menu-item
            v-if="selectedRowKeys.length > 0"
            @click="employeeBatchLocked"
          >
            <a-icon type="lock" />选中锁定
          </a-menu-item>
        </a-menu>
        <a-button>批量锁定
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- 批量失业登记表下载 -->
      <a-dropdown v-has="'wxhr:temployeeinfo_exportUnemploymentRegistrationForm'">
        <a-menu slot="overlay">
          <a-menu-item @click="exportSettleDomainUnemploymentRegistrationForm">
            <a-icon type="download" />以结算主体批量下载
          </a-menu-item>
          <a-menu-item
            v-if="selectedRowKeys.length > 0"
            @click="exportBatchUnemploymentRegistrationForm"
          >
            <a-icon type="download" />以选中项目批量下载
          </a-menu-item>
        </a-menu>
        <a-button>批量下载失业登记表
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!--<a-button
        type="primary"
        icon="swap"
        v-if="selectedRowKeys.length > 0"
        @click="handleSettleDomainChange('false')"
        v-has="'wxhr:temployeeinfo_settleDomainChange'"
      >批量划转</a-button>-->

      <a-dropdown v-has="'wxhr:temployeeinfo_settleDomainChange'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.batchUpdateSettdomain,'post')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量划转
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downloadLocalTemplate('/templates/员工批量划转模板.xls')">
            <a-icon type="download" />划转模板
          </a-menu-item>
        </a-menu>
        <a-button>批量划转
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- 批量调基 -->
      <a-dropdown>
        <a-menu
          slot="overlay"
          v-has="'wxhr:tdispatchinfo_baseSetChange'"
        >
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport(url.batchUpdateSocialAndFund,'post')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量调基
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downloadLocalTemplate('/templates/批量调基模板.xls')">
            <a-icon type="download" />调基模板
          </a-menu-item>
        </a-menu>
        <a-button>批量调基
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-dropdown>
        <a-menu
          slot="overlay"
          v-has="'wxhr:tdispatchinfo_baseSetChange'"
        >
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport('/hrSocial/tdispatchinfo/batchUpdateSocialAndFundByJsonStrTwo','post')"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量派减调基
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downloadLocalTemplate('/templates/批量调基模板.xls')">
            <a-icon type="download" />调基模板
          </a-menu-item>
        </a-menu>
        <a-button>批量派减调基
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
          <a-divider
            type="vertical"
            v-has="'wxhr:temployeeinfo_contractAdd'"
          />
          <a
            @click="handleEmployeeContractAdd(record)"
            v-has="'wxhr:temployeeinfo_contractAdd'"
          >上传合同</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:temployeeinfo_exportUnemploymentRegistrationForm'"
          />
          <a-popconfirm
            title="确定下载吗?"
            @confirm="() => exportUnemploymentRegistrationForm(record)"
            v-has="'wxhr:temployeeinfo_exportUnemploymentRegistrationForm'"
          >
            <a>失业登记表</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a-dropdown >
            <a class="ant-dropdown-link">更多<a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item
                v-has="'wxhr:temployeeinfo_edit'"
                v-if="record.lockFlag==1"
              >
                <a @click="handleEdit(record)">编辑</a>
              </a-menu-item>
              <a-menu-item
                v-has="'wxhr:temployeeinfo_locked'"
                v-if="record.lockFlag==1"
              >
                <a-popconfirm
                  title="确定锁定吗?"
                  @confirm="() => employeeLocked(record.id)"
                >
                  <a>锁定</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-has="'wxhr:temployeeinfo_settleDomainChange'">
                <a @click="handleSettleDomainChange(record)">划转</a>
              </a-menu-item>
              <a-menu-item
                v-has="'wxhr:temployeeinfo_delect'"
                v-if="record.lockFlag==1"
              >
                <a-popconfirm
                  title="确定删除吗?"
                  @confirm="() => handleDelete(record.id)"
                >
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <employee-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></employee-modal>
    <employee-export-modal
      ref="employeeExportModal"
      @ok="modalFormOk"
    ></employee-export-modal>
    <employee-contract-list-modal
      ref="employeeContractListModal"
      @ok="modalFormOk"
    ></employee-contract-list-modal>
    <employee-settle-domain-modal
      ref="employeeSettleDomainModal"
      @ok="modalFormOk"
    ></employee-settle-domain-modal>
    <employee-settle-domain-change-modal
      ref="employeeSettleDomainChangeModal"
      @ok="modalFormOk"
    ></employee-settle-domain-change-modal>
    <employee-settle-domain-unemployment-registration-modal
      ref="employeeSettleDomainUnemploymentRegistrationModal"
      @ok="modalFormOk"
    ></employee-settle-domain-unemployment-registration-modal>
    <error-modal ref="errorModal"></error-modal>
    <employee-all-detail-modal ref="employeeAllDetailModal"></employee-all-detail-modal>
    <export-field-modal ref="exportFieldModal"></export-field-modal>
  </a-card>
</template>

<script>
  import Vue from 'vue'
  import XLSX from 'xlsx'
  import EmployeeModal from './modules/EmployeeModal'
  import ErrorModal from '../global/modules/ErrorModal'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction,postAction, getAction, downFile,httpActionHeader } from '@/api/manage'
  import EmployeeExportModal from './modules/EmployeeExportModal'
  import EmployeeAllDetailModal from './modules/EmployeeAllDetailModal'
  import EmployeeContractListModal from './modules/EmployeeContractListModal'
  import EmployeeSettleDomainModal from './modules/EmployeeSettleDomainModal'
  import EmployeeSettleDomainChangeModal from './modules/EmployeeSettleDomainChangeModal'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import { getSettleDomainSelectVos, getUnitSelectVos, areaMapTrees } from '@/api/api'
  import EmployeeSettleDomainUnemploymentRegistrationModal from './modules/EmployeeSettleDomainUnemploymentRegistrationModal'
  import ExportFieldModal from '../global/modules/ExportFieldModal'
  import { handleImportData } from '@/utils/common'
  import { mapGetters } from 'vuex'

  export default {
    name: 'EmployeeList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      SelectPage,
      EmployeeModal,
      EmployeeExportModal,
      EmployeeAllDetailModal,
      EmployeeContractListModal,
      EmployeeSettleDomainModal,
      EmployeeSettleDomainChangeModal,
      EmployeeSettleDomainUnemploymentRegistrationModal,
      ExportFieldModal
    },
    data() {
      return {
        description: '员工档案建立',
        filterDictText,
        areaTrees: [],  // 地区
        areaMapTrees:[],
        areaCitys: [],  // 档案城市
        areaTowns: [],  // 档案区县
        socialCitys: [], // 社保城市
        socialTowns: [], // 社保区县
        fundCitys: [], // 公积金城市
        fundTowns: [], // 公积金区县
        sexOptions: [], // 性别
        unitOptions: [], // 单位和结算主体
        bankOptions: [],  // 开户行
        unitSearchOptions: [], // 单位和结算主体
        empTypeOptions: [], // 员工类型
        workTypeOptions: [],  // 工作类型
        empMarriOptions: [],  // 婚姻状况
        educationOptions: [], // 学历级别
        politicalOptions: [], // 政治面貌
        obtainTypeOptions: [],  // 获取方式
        settleDomainItems: [],  // 结算主体数组
        empNationalOptions: [], // 民族
        settleDomainOptions: {},  // 结算主体
        workingHoursOptions: [], // 工时制
        empRegisTypeOptions: [],  // 户口性质
        situationTypeOptions: [], // 签订情况
        educationTypeOptions: [], // 学历类型
        employeeLableOptions: [],  // 员工标签
        settleDomainDisabled: true,  // 结算主体不可选择
        allSettleDomainOptions: {}, // 所有结算主体与单位
        educationSystemOptions: [], // 学制类型
        disabilityLevelOptions: [], // 伤残等级
        relationshipSelfOptions: [],  // 与本人关系
        qualificationTypeOptions: [], // 资格类型
        qualificationLevelOptions: [],  // 资格等级
        employeeContractTypeOptions: [], // 员工合同类型
        reduceReasonOptions: [], // 离职原因
        workFlagSubOptions: [], // 在职细分
        employData:[],
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        workFlagOptions: {'0': {'option': '在职', 'color': 'green'}, '1': {'option': '离职', 'color': 'red'}},
        contractFileStatusOptions: {'0': {'option': '未上传', 'color': 'red'}, '1': {'option': '全部上传', 'color': 'green'}, '2': {'option': '部分上传', 'color': 'cyan'}},
        // excel表头数据
        exportFields: [],
        size: 'default',
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
            width: 180,
            ellipsis: true,
            title: '单位名称',
            align: 'center',
            dataIndex: 'belongUnitName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDomainName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 140,
            ellipsis: true,
            title: '结算主体编码',
            align: 'center',
            dataIndex: 'settleDomainCode',
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
            width: 110,
            ellipsis: true,
            title: '联系方式',
            align: 'center',
            dataIndex: 'empPhone',
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
            width: 160,
            ellipsis: true,
            title: '社保地市',
            align: 'center',
            dataIndex: 'socialProvince',
            customRender:(text, record) => {
              const name = this.getAreaMapName(record.socialProvince, record.socialCity, record.socialTown)
              const str = name ? name : '-'
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
              const name = this.getAreaMapName(record.fundProvince, record.fundCity, record.fundTown)
              const str = name ? name : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '在职细分',
            align: 'center',
            dataIndex: 'workingStatusSub',
            customRender:(text) => {
              const str = (Number(text) === 0) ? '在职' : (Number(text) === 3 ? '临时' : '-')
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 90,
            ellipsis: true,
            title: '合同状态',
            align: 'center',
            dataIndex: 'contractFileStatus',
            customRender:(text) => {
              const color = this.contractFileStatusOptions.hasOwnProperty(text) ? this.contractFileStatusOptions[text].color : 'blue'
              const str = this.contractFileStatusOptions.hasOwnProperty(text) ? this.contractFileStatusOptions[text].option : '-'
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
            width: 270,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrBase/temployeeinfo/pageByCreaterUser?deleteFlag=0',
          delete: 'hrBase/temployeeinfo/delect/',
          deleteBatch: 'hrBase/temployeeinfo/deleteBatch',
          templateUrl: 'hrBase/templateInfo/template?fileName=',
          exportXlsUrl: 'hrBase/temployeeinfo/doexportAllInfo?1=1',
          contractList: 'hrBase/temployeecontractinfo/page?isObsolete=0&empNo=', // 员工合同列表
          importExcelUrl: 'hrBase/temployeeinfo/importListByJsonString', //批量新增
          updateExcelUrl: 'hrBase/temployeeinfo/batchUpdateEmployeeByJsonString',  // 批量修改
          queryAllInfoById: 'hrBase/temployeeinfo/allInfo/',
          templateBankUrl:'/templates/', //批量更新员工银行信息模板
          importExcelBatchBank:'/hrBase/temployeeinfo/batchUpdateEmployeeBankInfoByJsonString',
          importExcelBatchBankAdmin:'/hrBase/temployeeinfo/batchUpdateEmployeeBankInfoByJsonStringAdmin', //管理员专用
          getBankName:'/hrBase/tbankinfo/allBackName',
          getExportField: '/hrBase/temployeeinfo/getTEmployeeInfoFieldExportVoFieldName',
          batchUpdateSettdomain: '/hrBase/temployeeinfo/batchUpdateEmployeeDepartByJsonString',
          batchUpdateSocialAndFund: '/hrSocial/tdispatchinfo/batchUpdateSocialAndFundByJsonString',
          changeTemplateUrl: 'hrSocial/templateInfo/template?fileName=',
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
      // 结算主体和所属单位
      getSettleDomainSelectVos().then((res) => {
        if (Number(res.code) === 200) {
          this.settleDomainOptions = res.data
        } else {
          this.$message.error('结算主体和所属单位数据请求失败！')
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
      //获取银行总行
      httpAction('/hrBase/tbankinfo/allBackName',null,'get').then((res)=>{
        if(Number(res.code) === 200){
          this.bankOptions = res.data
        }
      })
      // 所用用户
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if(Number(res.code) === 200){
          this.employData = res.data
        }
      })
      // 获取登录用户拥有结算主体权限的单位信息（包含结算主体）
      getUnitSelectVos().then((res) => {
        if (Number(res.code) === 200) {
          this.unitSearchOptions = res.data
        } else {
          this.$message.error('单位信息数据请求失败！')
        }
      })
    },
    computed:{
      currentUserId: function(){
        return this.userInfo().id
      }
    },
    methods: {
      ...mapGetters(["userInfo"]),
      downloadLocalTemplate(templateUrl) {
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
        window.location.href = url
      },
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
      // 新建
      handleAdd: function() {
        this.$refs.modalForm.title = '员工档案新增'
        this.$refs.modalForm.sexBelongs = this.sexOptions
        this.$refs.modalForm.bankBelongs = this.bankOptions
        this.$refs.modalForm.empTypeBelongs = this.empTypeOptions
        this.$refs.modalForm.empMarriBelongs = this.empMarriOptions
        this.$refs.modalForm.politicalBelongs = this.politicalOptions
        this.$refs.modalForm.empNationalBelongs = this.empNationalOptions
        this.$refs.modalForm.settleDomainBelongs = this.settleDomainOptions
        this.$refs.modalForm.empRegisTypeBelongs = this.empRegisTypeOptions
        this.$refs.modalForm.employeeLableBelongs = this.employeeLableOptions
        this.$refs.modalForm.workingHoursBelongs = this.workingHoursOptions
        this.$refs.modalForm.idAreaTrees = this.$refs.modalForm.fileAreaTrees = Vue.ls.get('glob_area')

        if (this.bankOptions.length > 0 && Object.keys(this.settleDomainOptions).length > 0
        && this.employeeLableOptions.length > 0 && (Array.isArray(Vue.ls.get('glob_area'))
        && Vue.ls.get('glob_area').length > 0)) {
          this.$refs.modalForm.add()
        } else {
          if (this.bankOptions.length === 0) {
            this.$message.error(`"开户行"${this.loadMessage}`)
            return
          }
          if (Object.keys(this.settleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return
          }
          if (this.employeeLableOptions.length === 0) {
            this.$message.error(`"员工标签"${this.loadMessage}`)
            return
          }
          if (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length === 0) {
            this.$message.error(`"地区"${this.loadMessage}`)
          }
        }
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.modalForm.title = '员工档案编辑'
        this.$refs.modalForm.sexBelongs = this.sexOptions
        this.$refs.modalForm.bankBelongs = this.bankOptions
        this.$refs.modalForm.empTypeBelongs = this.empTypeOptions
        this.$refs.modalForm.empMarriBelongs = this.empMarriOptions
        this.$refs.modalForm.politicalBelongs = this.politicalOptions
        this.$refs.modalForm.empNationalBelongs = this.empNationalOptions
        // this.$refs.modalForm.settleDomainBelongs = this.allSettleDomainOptions
        this.$refs.modalForm.empRegisTypeBelongs = this.empRegisTypeOptions
        this.$refs.modalForm.employeeLableBelongs = this.employeeLableOptions
        this.$refs.modalForm.workingHoursBelongs = this.workingHoursOptions
        this.$refs.modalForm.idAreaTrees = this.$refs.modalForm.fileAreaTrees = Vue.ls.get('glob_area')
        if (this.bankOptions.length > 0 
        && this.employeeLableOptions.length > 0 && (Array.isArray(Vue.ls.get('glob_area'))
        && Vue.ls.get('glob_area').length > 0)) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              res.data.employeeInfo.settleDomainName= record.settleDomainName
              res.data.employeeInfo.belongUnitName= record.belongUnitName
              this.$refs.modalForm.edit(res.data.employeeInfo)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.bankOptions.length === 0) {
            this.$message.error(`"开户行"${this.loadMessage}`)
            return
          }
          if (this.employeeLableOptions.length === 0) {
            this.$message.error(`"员工标签"${this.loadMessage}`)
            return
          }
          if (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length === 0) {
            this.$message.error(`"地区"${this.loadMessage}`)
          }
        }
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.employeeAllDetailModal.title = '员工档案详情'
        this.$refs.employeeAllDetailModal.sexBelongs = this.sexOptions
        this.$refs.employeeAllDetailModal.bankBelongs = this.bankOptions
        this.$refs.employeeAllDetailModal.empTypeBelongs = this.empTypeOptions
        this.$refs.employeeAllDetailModal.workTypeBelongs = this.workTypeOptions
        this.$refs.employeeAllDetailModal.empMarriBelongs = this.empMarriOptions
        this.$refs.employeeAllDetailModal.politicalBelongs = this.politicalOptions
        this.$refs.employeeAllDetailModal.educationBelongs = this.educationOptions
        this.$refs.employeeAllDetailModal.obtainTypeBelongs = this.obtainTypeOptions
        this.$refs.employeeAllDetailModal.empNationalBelongs = this.empNationalOptions
        // this.$refs.employeeAllDetailModal.settleDomainBelongs = this.settleDomainOptions
        this.$refs.employeeAllDetailModal.situationTypeBelongs = this.situationTypeOptions
        this.$refs.employeeAllDetailModal.empRegisTypeBelongs = this.empRegisTypeOptions
        this.$refs.employeeAllDetailModal.workingHoursBelongs = this.workingHoursOptions
        this.$refs.employeeAllDetailModal.employeeLableBelongs = this.employeeLableOptions
        this.$refs.employeeAllDetailModal.educationTypeBelongs = this.educationTypeOptions
        this.$refs.employeeAllDetailModal.disabilityLevelBelongs = this.disabilityLevelOptions
        this.$refs.employeeAllDetailModal.educationSystemBelongs = this.educationSystemOptions
        this.$refs.employeeAllDetailModal.relationshipSelfBelongs = this.relationshipSelfOptions
        this.$refs.employeeAllDetailModal.qualificationTypeBelongs = this.qualificationTypeOptions
        this.$refs.employeeAllDetailModal.qualificationLevelBelongs = this.qualificationLevelOptions
        this.$refs.employeeAllDetailModal.employeeContractTypeBelongs = this.employeeContractTypeOptions
        this.$refs.employeeAllDetailModal.reduceReasonBelongs = this.reduceReasonOptions
        this.$refs.employeeAllDetailModal.areaTrees = Vue.ls.get('glob_area')
        if (this.bankOptions.length > 0
        && this.workTypeOptions.length > 0 && (Array.isArray(Vue.ls.get('glob_area'))
        && Vue.ls.get('glob_area').length > 0)) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              const datas = res.data
              datas.employeeInfo.settleDomain= record.settleDomainName
              datas.employeeInfo.belongUnit = record.belongUnitName
              this.$refs.employeeAllDetailModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.bankOptions.length === 0) {
            this.$message.error(`"开户行"${this.loadMessage}`)
            return
          }
          if (this.workTypeOptions.length === 0) {
            this.$message.error(`"工作类型"${this.loadMessage}`)
            return
          }
          if (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length === 0) {
            this.$message.error(`"地区"${this.loadMessage}`)
          }
        }
      },
      // 锁定
      employeeLocked: function(id) {
        postAction(`/hrBase/temployeeinfo/locked/${id}`, '').then((res) => {
          if (Number(res.code) === 200) {
            this.$message.success('锁定成功！')
          } else {
            this.$message.warning(res.msg)
          }
        }).finally(() => {
          this.loadData()
        })
      },
      // 批量锁定
      employeeBatchLocked: function() {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        }
        var ids = ''
        for (let a = 0; a < this.selectedRowKeys.length; a++) {
          if (a === this.selectedRowKeys.length - 1) {
            ids += this.selectedRowKeys[a]
          } else {
            ids += `${this.selectedRowKeys[a]},`
          }
        }
        const that = this
        this.$confirm({
          title: '确认锁定',
          content: '是否锁定选中的数据?',
          onOk: function() {
            getAction(`/hrBase/temployeeinfo/batchLocked?ids=${ids}`, '').then((res) => {
              const msg = res.message || res.msg
              if (Number(res.code) === 200) {
                if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  that.$refs.errorModal.title = `批量锁定错误: ${msg}`
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  that.$message.success('批量锁定成功！')
                }
              } else {
                if (res.data != null && res.data.length > 0) {
                  that.$refs.errorModal.title = `批量锁定错误: ${msg}`
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.data)
                } else if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  that.$refs.errorModal.title = `批量锁定错误: ${msg}`
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  that.$message.error(msg)
                }
              }
              that.loadData()
            }).finally(() => {
              that.onClearSelected()
              that.loadData()
            })
          }
        })
      },
      // 主体锁定
      employeeSettleDomainLocked: function() {
        this.$refs.employeeSettleDomainModal.title = '以主体锁定员工'
        this.$refs.employeeSettleDomainModal.settleDomainBelongs = this.settleDomainOptions
        if (Object.keys(this.settleDomainOptions).length > 0) {
          this.$refs.employeeSettleDomainModal.add()
        } else {
          if (Object.keys(this.settleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return false
          }
        }
      },
      // 失业登记表下载
      exportUnemploymentRegistrationForm: function(record) {
        const httpurl = `hrBase/temployeeinfo/exportUnemploymentRegistrationForm?id=${record.id}`
        downFile(httpurl, '').then((res) => {
          if (res.size > 0) {
            var blob = new Blob([res], {type: 'application/msword;charset=utf-8'}); // application/msword这里表示doc类型
            var downloadElement = document.createElement('a')
            var href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.href = href
            downloadElement.download = `${record.empName}失业登记表.doc` // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
            this.$message.success(`${record.empName}失业登记表下载成功！`)
          } else {
            this.$message.warning(`${(res.msg || res.message)}-失业登记表下载失败！`)
          }
        })
      },
      // 批量失业登记表下载
      exportBatchUnemploymentRegistrationForm: function() {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
        } else {
          var ids = ''
          for (let a = 0; a < this.selectedRowKeys.length; a++) {
            if (a === this.selectedRowKeys.length - 1) {
              ids += this.selectedRowKeys[a]
            } else {
              ids += `${this.selectedRowKeys[a]},`
            }
          }
          const that = this
          this.$confirm({
            title: '确认下载',
            content: '是否下载选中的失业登记表数据?',
            onOk: function() {
              downFile(`/hrBase/temployeeinfo/exportUnemploymentRegistrationForms?ids=${ids}`, '').then((res) => {
                if (res.size > 0) {
                  var blob = new Blob([res], {type: 'application/zip;charset=utf-8'}); // application/zip这里表示zip类型
                  var downloadElement = document.createElement('a')
                  var href = window.URL.createObjectURL(blob) // 创建下载的链接
                  downloadElement.href = href
                  downloadElement.download = '失业登记表.zip' // 下载后文件名
                  document.body.appendChild(downloadElement)
                  downloadElement.click() // 点击下载
                  document.body.removeChild(downloadElement) // 下载完成移除元素
                  window.URL.revokeObjectURL(href) // 释放掉blob对象
                  this.$message.success('失业登记表下载成功！')
                } else {
                  this.$message.warning(`${(res.msg || res.message)}-失业登记表下载失败！`)
                }
              }).finally(() => {
                that.onClearSelected()
                that.loadData()
              })
            }
          })
        }
      },
      // 结算主体批量下载失业登记表
      exportSettleDomainUnemploymentRegistrationForm: function() {
        this.$refs.employeeSettleDomainUnemploymentRegistrationModal.title = '以结算主体批量下载失业登记表'
        this.$refs.employeeSettleDomainUnemploymentRegistrationModal.settleDomainBelongs = this.settleDomainOptions
        if (Object.keys(this.settleDomainOptions).length > 0) {
          this.$refs.employeeSettleDomainUnemploymentRegistrationModal.add()
        } else {
          if (Object.keys(this.settleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
          }
        }
      },
      // 上传合同
      handleEmployeeContractAdd: function(record) {
        this.$refs.employeeContractListModal.empId = record.id
        this.$refs.employeeContractListModal.title = '员工合同列表'
        this.$refs.employeeContractListModal.workingHoursBelongs = this.workingHoursOptions
        this.$refs.employeeContractListModal.situationTypeBelongs = this.situationTypeOptions
        // this.$refs.employeeContractListModal.settleDomainBelongs = this.allSettleDomainOptions
        this.$refs.employeeContractListModal.url.list = this.url.contractList + record.empNo
        this.$refs.employeeContractListModal.employeeContractTypeBelongs = this.employeeContractTypeOptions
        if ( this.workingHoursOptions.length > 0) {
          this.$refs.employeeContractListModal.add()
          this.$refs.employeeContractListModal.loadData(1)
        } else {
          this.$message.error(`"工作制"${this.loadMessage}`)
        }
      },
      // 导出
      handleExport: function() {
        httpAction(this.url.getExportField, {}, 'GET').then((res) => {
          if(Number(res.code) === 200){
            this.exportFields = res.data
            let requestExportXlsUrl = this.url.exportXlsUrl  + '&createUser=' + this.currentUserId
            const queryParams =  this.getQueryParams()
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
              requestExportXlsUrl += '&idstr=' + idStr
            }
            this.$refs.employeeExportModal.title = '员工档案导出'
            this.$refs.employeeExportModal.exportFields = this.exportFields
            this.$refs.employeeExportModal.url.exportXlsUrl = requestExportXlsUrl
            // this.$refs.employeeExportModal.checkState.checkedList = this.exportFields
            this.$refs.employeeExportModal.add()
          }
        })
      },
      handleExportBase(){
        this.$refs.exportFieldModal.title = '员工基本信息'
        this.$refs.exportFieldModal.url.exportXlsUrl = '/hrBase/temployeeinfo/doexportBaseInfo?deleteFlag=0&createUser=' + this.currentUserId
        this.$refs.exportFieldModal.url.exportFields = '/hrBase/temployeeinfo/getTEmployeeInfoBaseFieldExportVoFieldName'
        this.$refs.exportFieldModal.params = this.getQueryParams()//查询条件
        this.$refs.exportFieldModal.add(this.selectedRowKeys)
      },
      // 划转
      handleSettleDomainChange(record) {
        if (this.unitSearchOptions.length > 0 ) {
          if (String(record) === 'false') {
            if (this.selectedRowKeys.length <= 0) {
              this.$message.warning('请选择一条记录！')
              return false
            } else {
              var ids = ''
              for (let a = 0; a < this.selectedRowKeys.length; a++) {
                if (a === this.selectedRowKeys.length - 1) {
                  ids += this.selectedRowKeys[a]
                } else {
                  ids += `${this.selectedRowKeys[a]},`
                }
              }
              this.$refs.employeeSettleDomainChangeModal.title = '批量员工划转'
              this.$refs.employeeSettleDomainChangeModal.empId = ids
              this.$refs.employeeSettleDomainChangeModal.isBatch = false
              this.$refs.employeeSettleDomainChangeModal.unitBelongs = this.unitSearchOptions
              this.$refs.employeeSettleDomainChangeModal.edit(record)
            }
          } else {
            this.$refs.employeeSettleDomainChangeModal.title = '员工划转'
            this.$refs.employeeSettleDomainChangeModal.empId = record.id
            this.$refs.employeeSettleDomainChangeModal.unitBelongs = this.unitSearchOptions
            this.$refs.employeeSettleDomainChangeModal.unitAndSettleDomain = {customerName:record.belongUnitName,departName:record.settleDomainName}
            this.$refs.employeeSettleDomainChangeModal.edit(record)
          }
        } else {
          this.$message.error(`"单位数据"${this.loadMessage}`)
          return
        }
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
      // 社保省份切换
      handleSocialProvinceChange(value) {
        this.socialCitys = []
        this.socialTowns = []
        if (value) {
          for (var c of this.areaTrees[value - 1].children) {
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
          for (var c of this.areaTrees[value - 1].children) {
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
      handleChange(value) {
        this.queryParam.empType = value.join(',')
      },
      // 数据字典
      initDictConfig() {
        // 性别
        initDictOptions('sex').then((res) => {
          if (Number(res.code) === 200) {
            this.sexOptions = res.data
          }
        })
        // 婚姻状况
        initDictOptions('marital_status').then((res) => {
          if (Number(res.code) === 200) {
            this.empMarriOptions = res.data
          }
        })
        // 民族
        initDictOptions('nation').then((res) => {
          if (Number(res.code) === 200) {
            this.empNationalOptions = res.data
          }
        })
        // 政治面貌
        initDictOptions('political_status').then((res) => {
          if (Number(res.code) === 200) {
            this.politicalOptions = res.data
          }
        })
        // 员工类型
        initDictOptions('personnel_type').then((res) => {
          if (Number(res.code) === 200) {
            this.empTypeOptions = res.data
          }
        })
        // 户口性质
        initDictOptions('household_nature').then((res) => {
          if (Number(res.code) === 200) {
            this.empRegisTypeOptions = res.data
          }
        })
        // 员工标签
        initDictOptions('employee_lable').then((res) => {
          if (Number(res.code) === 200) {
            this.employeeLableOptions = res.data
          }
        })
        // 在职细分
        initDictOptions('work_falg_sub').then((res) => {
          if (Number(res.code) === 200) {
            this.workFlagSubOptions = res.data
          }
        })
        // 员工合同类型
        initDictOptions('employee_contract_type').then((res) => {
          if (Number(res.code) === 200) {
            this.employeeContractTypeOptions = res.data
          }
        })
        // 签订情况
        initDictOptions('situation_type').then((res) => {
          if (Number(res.code) === 200) {
            this.situationTypeOptions = res.data
          }
        })
        // 工时制
        initDictOptions('working_hours').then((res) => {
          if (Number(res.code) === 200) {
            this.workingHoursOptions = res.data
          }
        })
        // 与本人关系
        initDictOptions('relationship_self').then((res) => {
          if (Number(res.code) === 200) {
            this.relationshipSelfOptions = res.data
          }
        })
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
        // 伤残等级
        initDictOptions('disability_grade').then((res) => {
          if (Number(res.code) === 200) {
            this.disabilityLevelOptions = res.data
          }
        })
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
        // 减员减少原因
        initDictOptions('reduce_reason').then((res) => {
          if (Number(res.code) === 200) {
            this.reduceReasonOptions = res.data
          }
        })
        // 工作类型
        initDictOptions('work_type').then((res) => {
          if (Number(res.code) === 200) {
            this.workTypeOptions = res.data
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
            const newData = handleImportData(data[sheetName])
            const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
            const requestTimeOut = timeOut ? timeOut : 600000  // 请求过期时间
            //开始异步提交
            httpActionHeader(importUrl, encodeURI(JSON.stringify(newData)), this.importMethod, contextType, requestTimeOut).then((res) => {
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
  margin-left: 5px;
  margin-bottom: 10px;
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
