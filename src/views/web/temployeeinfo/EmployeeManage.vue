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
                label="单位名称"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择单位名称查询"
                  v-model="queryParam.belongUnit"
                  @change="handleUnitChange"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in unitOptions"
                    :key="key"
                    :value="value.id"
                  >{{ value.customerName }}</a-select-option>
                </a-select>
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
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择结算主体查询"
                  :disabled="settleDomainDisabled"
                  v-model="queryParam.settleDomain"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in settleDomainItems"
                    :key="key"
                    :value="value.id"
                  >{{ value.departName }}</a-select-option>
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
                    v-for="(item, index) in empTypeOptions"
                    :key="index"
                    :value="item.value"
                  >{{ item.label }}</a-select-option>
                </a-select>
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
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item
            @click="employeeBatchLocked"
            v-have="'wxhr:temployeeinfo_batchLocked'"
          >
            <a-icon type="lock" />选中锁定</a-menu-item>
          <a-menu-item
            @click="handleEmployeeBatchUnlockApply"
            v-have="'wxhr:temployeeinfo_unLockApply'"
          >
            <a-icon type="unlock" />批量解锁</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量操作
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
            v-if="record.workFlag==0"
            type="vertical"
            v-has="'wxhr:temployeeinfo_reduce'"
          />
          <a
            v-if="record.workFlag==0"
            @click="handleDepletion(record)"
            v-has="'wxhr:temployeeinfo_reduce'"
          >减员</a>
          <a-divider
            v-if="record.lockFlag==0"
            type="vertical"
            v-have="'wxhr:temployeeinfo_unLockApply'"
          />
          <a
            v-if="record.lockFlag==0"
            @click="handleOneUnlockApply(record.id)"
            v-have="'wxhr:temployeeinfo_unLockApply'"
          >申请解锁</a>
          <a-divider
            v-if="record.lockFlag==1"
            type="vertical"
            v-have="'wxhr:temployeeinfo_locked'"
          />
          <a-popconfirm
            v-if="record.lockFlag==1"
            title="确定锁定吗?"
            @confirm="() => employeeLocked(record.id)"
            v-have="'wxhr:temployeeinfo_locked'"
          >
            <a>锁定</a>
          </a-popconfirm>
        </span>

        <!-- 列缩放隐藏模板 -->
        <template
          v-for="(defineColumn, key) in defineColumns"
          :slot="key"
          slot-scope="text, record"
        >
          <span :key="key">
            <!-- 结算主体或者单位 -->
            <a-tooltip
              v-if="defineColumn.type=='settle'"
              placement="topLeft"
              :title="tipTitle = ((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[defineColumn.key]))?
                (defineColumn.options)[record[defineColumn.key]][defineColumn.name] : '-'"
            >
              {{ tipTitle }}
            </a-tooltip>
            <!-- 字典数据 -->
            <a-tooltip
              v-else-if="defineColumn.type=='dict'"
              placement="topLeft"
              :title="filterDictText(defineColumn.options, record[key])"
            >
              {{ filterDictText(defineColumn.options, record[key]) }}
            </a-tooltip>
            <!-- 标签数据 -->
            <template
              v-else-if="defineColumn.type=='tag'"
              v-for="(item, tagKey) in defineColumn.options"
            >
              <a-tag
                :key="tagKey"
                v-if="record[key] == tagKey"
                :color="item.color"
              >{{ item.option }}</a-tag>
            </template>
            <!-- 普通数据 -->
            <a-tooltip
              v-else
              placement="topLeft"
              :title="record[key] ? record[key] : '-'"
            >
              {{ record[key] ? record[key] : '-' }}
            </a-tooltip>
          </span>
        </template>

        <!-- 档案地市 -->
        <span
          slot="fileProvince"
          slot-scope="text, record"
        >
          <a-tooltip
            placement="topLeft"
            :title="(fileName = getAreaName(record.fileProvince, record.fileCity, record.fileTown)) ? fileName : '-'"
          >
            {{ fileName ? fileName : '-' }}
          </a-tooltip>
        </span>

        <!-- 社保地市 -->
        <span
          slot="socialProvince"
          slot-scope="text, record"
        >
          <a-tooltip
            placement="topLeft"
            :title="(socialName = getAreaName(record.socialProvince, record.socialCity, record.socialTown)) ? socialName : '-'"
          >
            {{ socialName ? socialName : '-' }}
          </a-tooltip>
        </span>

        <!-- 公积金地市 -->
        <span
          slot="fundProvince"
          slot-scope="text, record"
        >
          <a-tooltip
            placement="topLeft"
            :title="(fundName = getAreaName(record.fundProvince, record.fundCity, record.fundTown)) ? fundName : '-'"
          >
            {{ fundName ? fundName : '-' }}
          </a-tooltip>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <employee-export-modal
      ref="employeeExportModal"
      @ok="modalFormOk"
    ></employee-export-modal>
    <employee-depletion-modal
      ref="employeeDepletionModal"
      @ok="modalFormOk"
    ></employee-depletion-modal>
    <employee-one-unlock-apply-modal
      ref="employeeOneUnlockApplyModal"
      @ok="modalFormOk"
    ></employee-one-unlock-apply-modal>
    <employee-settle-domain-unlock-apply-modal
      ref="employeeSettleDomainUnlockApplyModal"
      @ok="modalFormOk"
    ></employee-settle-domain-unlock-apply-modal>
    <error-modal ref="errorModal"></error-modal>
    <employee-all-detail-modal ref="employeeAllDetailModal"></employee-all-detail-modal>

  </a-card>
</template>

<script>
  import Vue from 'vue'
  import ErrorModal from './modules/ErrorModal'
  import { getAreaName } from '@/utils/common'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import EmployeeExportModal from './modules/EmployeeExportModal'
  import { httpAction, postAction, getAction } from '@/api/manage'
  import EmployeeAllDetailModal from './modules/EmployeeAllDetailModal'
  import EmployeeDepletionModal from './modules/EmployeeDepletionModal'
  import EmployeeOneUnlockApplyModal from './modules/EmployeeOneUnlockApplyModal'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import EmployeeSettleDomainUnlockApplyModal from './modules/EmployeeSettleDomainUnlockApplyModal'
  import { getSettleDomainSelectVos, getAllSettleDomainSelectVos, getUnitSelectVos } from '@/api/api'

  export default {
    name: 'EmployeeManage',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      EmployeeExportModal,
      EmployeeAllDetailModal,
      EmployeeDepletionModal,
      EmployeeOneUnlockApplyModal,
      EmployeeSettleDomainUnlockApplyModal,
    },
    data() {
      return {
        description: '员工档案查询',
        //枚举字段
        filterDictText,
        getAreaName,
        areaCitys: [],  // 档案城市
        areaTowns: [],  // 档案区县
        socialCitys: [], // 社保城市
        socialTowns: [], // 社保区县
        fundCitys: [], // 公积金城市
        fundTowns: [], // 公积金区县
        sexOptions: [], // 性别
        unitOptions: [], // 单位和结算主体
        bankOptions: [],  // 开户行
        empTypeOptions: [], // 员工类型
        workTypeOptions: [],  // 工作类型
        empMarriOptions: [],  // 婚姻状况
        educationOptions: [], // 学历级别
        politicalOptions: [], // 政治面貌
        obtainTypeOptions: [],  // 获取方式
        nextUserIdOptions: [],  // 审核人
        settleDomainItems: [],  // 结算主体数组
        empNationalOptions: [], // 民族
        settleDomainOptions: {},  // 结算主体
        workingHoursOptions: [],  // 工时制
        empRegisTypeOptions: [],  // 户口性质
        unlockReasonOptions: [],  // 解锁原因
        reduceReasonOptions: [],  // 减员减少原因
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
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        // 隐藏列字段数组
        defineColumns: {
          empNo: {width: 140}, empName: {width: 60}, empIdcard: {width: 140},
          belongUnit: {key: 'settleDomain', width: 140, type: 'settle', options: [], name: 'customerName'},
          settleDomain: {key: 'settleDomain', width: 140, type: 'settle', options: [], name: 'departName'},
          workFlag: {width: 60, type: 'tag', options: []}, empType: {width: 80, type: 'dict', options: []},
          empPhone: {width: 90}, contractFileStatus: {width: 70, type: 'tag', options: []}, createTime: {width: 130}
        },
        workFlagOptions: {'0': {'option': '在职', 'color': 'green'}, '1': {'option': '离职', 'color': 'red'}},
        contractFileStatusOptions: {'0': {'option': '未上传', 'color': 'red'}, '1': {'option': '全部上传', 'color': 'green'}, '2': {'option': '部分上传', 'color': 'cyan'}},
        // excel表头数据
        exportFields: [
          '员工编码', '员工姓名', '身份证号码', '身份证有效期', '性别', '年龄', '出生日期', '婚姻状态', '民族', '政治面貌', '邮箱', 'QQ', '手机号',
          '员工类型', '结算主体', '所属单位', '就职班组', '就职岗位', '电信编号', '户口性质', '开户行', '银行卡号', '员工标签', '入职日期', '试用期',
          '计税月份', '身份证-省', '身份证-市', '身份证-县', '身份证所在地', '档案-省', '档案-市', '档案-县', '档案所在地', '在职状态', '锁定状态',
          '离职时间', '备注', '创建时间',
        ],
        // 表头
        columns: [
          {
            width: 165,
            ellipsis: true,
            title: '员工编码',
            align: 'center',
            dataIndex: 'empNo',
            scopedSlots: { customRender: 'empNo' },
          },
          {
            width: 80,
            ellipsis: true,
            title: '员工姓名',
            align: 'center',
            dataIndex: 'empName',
            scopedSlots: { customRender: 'empName' },
          },
          {
            width: 160,
            ellipsis: true,
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcard',
            scopedSlots: { customRender: 'empIdcard' },
          },
          {
            width: 180,
            ellipsis: true,
            title: '单位名称',
            align: 'center',
            dataIndex: 'belongUnit',
            scopedSlots: { customRender: 'belongUnit' },
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDomain',
            scopedSlots: { customRender: 'settleDomain' },
          },
          {
            width: 100,
            ellipsis: true,
            title: '员工类型',
            align: 'center',
            dataIndex: 'empType',
            scopedSlots: { customRender: 'empType' },
          },
          {
            width: 110,
            ellipsis: true,
            title: '联系方式',
            align: 'center',
            dataIndex: 'empPhone',
            scopedSlots: { customRender: 'empPhone' },
          },
          {
            width: 160,
            ellipsis: true,
            title: '档案地市',
            align: 'center',
            dataIndex: 'fileProvince',
            scopedSlots: { customRender: 'fileProvince' },
          },
          {
            width: 160,
            ellipsis: true,
            title: '社保地市',
            align: 'center',
            dataIndex: 'socialProvince',
            scopedSlots: { customRender: 'socialProvince' },
          },
          {
            width: 160,
            ellipsis: true,
            title: '公积金地市',
            align: 'center',
            dataIndex: 'fundProvince',
            scopedSlots: { customRender: 'fundProvince' },
          },
          {
            width: 80,
            ellipsis: true,
            title: '在职状态',
            align: 'center',
            dataIndex: 'workFlag',
            scopedSlots: { customRender: 'workFlag' },
          },
          {
            width: 90,
            ellipsis: true,
            title: '合同状态',
            align: 'center',
            dataIndex: 'contractFileStatus',
            scopedSlots: { customRender: 'contractFileStatus' },
          },
          {
            width: 150,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            scopedSlots: { customRender: 'createTime' },
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
          list: 'hrBase/temployeeinfo/page?deleteFlag=0',
          delete: 'hrBase/temployeeinfo/delect/',
          deleteBatch: 'hrBase/temployeeinfo/deleteBatch',
          exportXlsUrl: 'hrBase/temployeeinfo/doexport?deleteFlag=0',
          importExcelUrl: 'hrBase/temployeeinfo/importJsonString',
          queryAllInfoById: 'hrBase/temployeeinfo/allInfo/',
          getEmployeeStatusById: 'hrSocial/tdispatchinfo/getEmployeeStatusById',
        },
      }
    },
    created() {
      // 地区
      this.areaTrees = Vue.ls.get('glob_area')
      // 结算主体和所属单位
      getSettleDomainSelectVos().then((res) => {
        if (Number(res.code) === 200) {
          this.settleDomainOptions = res.data
        } else {
          this.$message.error('结算主体和所属单位数据请求失败！')
        }
      })

      // 所有结算主体和所属单位
      getAllSettleDomainSelectVos().then((res) => {
        if (Number(res.code) === 200) {
          this.defineColumns.belongUnit.options = this.defineColumns.settleDomain.options = this.allSettleDomainOptions = res.data
        } else {
          this.$message.error('结算主体和所属单位数据请求失败！')
        }
      })

      // 获取权限的用户
      httpAction('admin/user/findUserBypPrmission?permissionStr=wxhr:temployeeinfo_unLockAudit', '', 'GET').then((res) => {
        if (Number(res.code) === 200) {
          this.nextUserIdOptions = res.data
        } else {
          this.$message.error('审核人数据请求失败！')
        }
      })

      // 获取登录用户拥有结算主体权限的单位信息（包含结算主体）
      getUnitSelectVos().then((res) => {
        if (Number(res.code) === 200) {
          this.unitOptions = res.data
        } else {
          this.$message.error('单位信息数据请求失败！')
        }
      })
      // 赋值标签数据
      this.defineColumns.workFlag.options = this.workFlagOptions
      this.defineColumns.contractFileStatus.options = this.contractFileStatusOptions
    },

    methods: {
      // 结算主体解锁申请
      handleSettleDomainUnlockApply: function() {
        this.$refs.employeeSettleDomainUnlockApplyModal.title = '发起结算主体解锁申请'
        if (this.nextUserIdOptions.length > 0 && Object.keys(this.settleDomainOptions).length > 0 && this.unlockReasonOptions.length > 0) {
          this.$refs.employeeSettleDomainUnlockApplyModal.nextUserIdBelongs = this.nextUserIdOptions
          this.$refs.employeeSettleDomainUnlockApplyModal.settleDomainBelongs = this.settleDomainOptions
          this.$refs.employeeSettleDomainUnlockApplyModal.unlockReasonBelongs = this.unlockReasonOptions
          this.$refs.employeeSettleDomainUnlockApplyModal.add()
        } else {
          if (this.nextUserIdOptions.length === 0) {
            this.$message.error(`"审核人"${this.loadMessage}`)
            return
          }
          if (Object.keys(this.settleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return
          }
          if (this.unlockReasonOptions.length === 0) {
            this.$message.error(`"解锁原因"${this.loadMessage}`)
          }
        }
      },

      // 单个解锁申请
      handleOneUnlockApply: function(id) {
        this.$refs.employeeOneUnlockApplyModal.ids = id
        this.$refs.employeeOneUnlockApplyModal.title = '发起解锁申请'
        if (this.nextUserIdOptions.length > 0 && this.unlockReasonOptions.length > 0) {
          this.$refs.employeeOneUnlockApplyModal.nextUserIdBelongs = this.nextUserIdOptions
          this.$refs.employeeOneUnlockApplyModal.unlockReasonBelongs = this.unlockReasonOptions
          this.$refs.employeeOneUnlockApplyModal.add()
        } else {
          if (this.nextUserIdOptions.length === 0) {
            this.$message.error(`"审核人"${this.loadMessage}`)
            return
          }
          if (this.unlockReasonOptions.length === 0) {
            this.$message.error(`"解锁原因"${this.loadMessage}`)
          }
        }
      },

      // 批量解锁申请
      handleEmployeeBatchUnlockApply: function() {
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
          if (this.nextUserIdOptions.length > 0 && this.unlockReasonOptions.length > 0) {
            this.$refs.employeeOneUnlockApplyModal.title = '发起批量解锁申请'
            this.$refs.employeeOneUnlockApplyModal.nextUserIdBelongs = this.nextUserIdOptions
            this.$refs.employeeOneUnlockApplyModal.unlockReasonBelongs = this.unlockReasonOptions
            this.$refs.employeeOneUnlockApplyModal.ids = ids
            this.$refs.employeeOneUnlockApplyModal.add()
          } else {
            if (this.nextUserIdOptions.length === 0) {
              this.$message.error(`"审核人"${this.loadMessage}`)
              return
            }
            if (this.unlockReasonOptions.length === 0) {
              this.$message.error(`"解锁原因"${this.loadMessage}`)
            }
          }
        }
      },

      // 减员
      handleDepletion: function(record) {
        this.$refs.employeeDepletionModal.title = '减员操作'
        this.$refs.employeeDepletionModal.id = record.id
        this.$refs.employeeDepletionModal.reduceReasonBelongs = this.reduceReasonOptions
        if (this.reduceReasonOptions.length > 0) {
          httpAction(`${this.url.getEmployeeStatusById}?empId=${record.id}`, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.employeeDepletionModal.employeeStatus = res.data
              this.$refs.employeeDepletionModal.add()
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.reduceReasonOptions.length === 0) {
            this.$message.error(`"减少原因"${this.loadMessage}`)
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
        this.$refs.employeeAllDetailModal.situationTypeBelongs = this.situationTypeOptions
        this.$refs.employeeAllDetailModal.settleDomainBelongs = this.allSettleDomainOptions
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
        this.$refs.employeeAllDetailModal.areaTrees = Vue.ls.get('glob_area')
        if (this.workTypeOptions.length > 0 && Object.keys(this.allSettleDomainOptions).length > 0 && (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length > 0)) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.employeeAllDetailModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.workTypeOptions.length === 0) {
            this.$message.error(`"工作类型"${this.loadMessage}`)
            return
          }
          if (Object.keys(this.allSettleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            return
          }
          if (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length === 0) {
            this.$message.error(`"地区"${this.loadMessage}`)
          }
        }
      },

      // 导出
      handleExport: function() {
        let requestExportXlsUrl = this.url.exportXlsUrl
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
        this.$refs.employeeExportModal.title = '员工档案导出'
        this.$refs.employeeExportModal.exportFields = this.exportFields
        this.$refs.employeeExportModal.url.exportXlsUrl = requestExportXlsUrl
        this.$refs.employeeExportModal.checkState.checkedList = this.exportFields
        this.$refs.employeeExportModal.add()
      },

      // 隐藏列样式
      handleColumnStyle(width) {
        if (width) {
          return `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: ${width}px;`
        }
        return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
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

      // 单位选择变化
      handleUnitChange(value) {
        if (value) {
          for (const unit of this.unitOptions) {
            if (String(value) === String(unit.id)) {
              delete this.queryParam.settleDomain
              this.settleDomainDisabled = false
              this.settleDomainItems = unit.settleDomainList
              break
            }
          }
        } else {
          this.settleDomainDisabled = true
          delete this.queryParam.settleDomain
        }
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
            this.defineColumns.empType.options = this.empTypeOptions = res.data
          }
        })

        // 户口性质
        initDictOptions('household_nature').then((res) => {
          if (Number(res.code) === 200) {
            this.empRegisTypeOptions = res.data
          }
        })

        // 开户行
        initDictOptions('bank').then((res) => {
          if (Number(res.code) === 200) {
            this.bankOptions = res.data
          }
        })

        // 员工标签
        initDictOptions('employee_lable').then((res) => {
          if (Number(res.code) === 200) {
            this.employeeLableOptions = res.data
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

        // 解锁原因
        initDictOptions('unlock_reason').then((res) => {
          if (Number(res.code) === 200) {
            this.unlockReasonOptions = res.data
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
