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
            <a-form-item
              label="户名称"
              class="stepFormText"
            >
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="请选择户名称查询"
                v-model="queryParam.departId"
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
            <a-form-item label="适用月">
              <a-month-picker
                v-model="queryParam.dateTemp"
                :showTime="{}"
                date-format="YYYY-MM"
                style="width: 100%"
                placeholder="请选择适用月查询"
                @change="handleMonthChange"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="类别"
              class="stepFormText"
            >
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                v-model="queryParam.baseType"
                placeholder="请选择类别查询"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(value, key) in baseTypeOptions"
                  :key="key"
                  :value="key"
                >{{ value }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择状态查询"
                  v-model="queryParam.status"
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
              <a-form-item
                label="缴纳地"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="选择省份"
                  v-model="queryParam.province"
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
                  v-model="queryParam.city"
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
                  v-model="queryParam.town"
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
        @click="handleAdd('social')"
        v-has="'wxhr:sysbasesetinfo_add'"
      >新建社保配置</a-button>
      <a-button
        type="primary"
        icon="plus"
        @click="handleAdd('fund')"
        v-has="'wxhr:sysbasesetinfo_add'"
      >新建公积金配置</a-button>
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
            type="vertical"
            v-has="'wxhr:sysbasesetinfo_edit'"
          />
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:sysbasesetinfo_edit'"
          >编辑</a>
          <a-divider
            v-if="record.status == 0 || record.status == 1"
            type="vertical"
            v-has="'wxhr:sysbasesetinfo_disableOrEnable'"
          />
          <a-popconfirm
            v-if="record.status == 0"
            title="确定禁用吗?"
            @confirm="() => handleEditStatus(record)"
            v-has="'wxhr:sysbasesetinfo_disableOrEnable'"
          >
            <a>禁用</a>
          </a-popconfirm>
          <a-popconfirm
            v-else-if="record.status == 1"
            title="确定启用吗?"
            @confirm="() => handleEditStatus(record)"
            v-has="'wxhr:sysbasesetinfo_disableOrEnable'"
          >
            <a>启用</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <fund-setting-modal
      ref="fundSettingModal"
      @ok="modalFormOk"
    ></fund-setting-modal>
    <social-setting-modal
      ref="socialSettingModal"
      @ok="modalFormOk"
    ></social-setting-modal>
    <social-fund-settings-export-modal
      ref="socialFundSettingsExportModal"
      @ok="modalFormOk"
    ></social-fund-settings-export-modal>
    <error-modal ref="errorModal"></error-modal>

  </a-card>
</template>

<script>
  import Vue from 'vue'
  import { getHouseHold } from '@/api/api'
  import { httpAction } from '@/api/manage'
  import ErrorModal from '../../global/modules/ErrorModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SocialSettingModal from './modules/SocialSettingModal'
  import FundSettingModal from './modules/FundSettingModal'
  import SocialFundSettingsExportModal from './modules/SocialFundSettingsExportModal'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'SocialFundSettingsList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      FundSettingModal,
      SocialSettingModal,
      SocialFundSettingsExportModal,
    },
    data() {
      return {
        description: '社保公积金配置',
        // 枚举字段
        areaTrees: [],  // 地区
        areaCitys: [],  // 社保城市
        areaTowns: [],  // 社保区县
        householdOptions: [],  // 户
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        baseTypeOptions: {'0': '社保', '1': '公积金'},
        statusOptions: {'0': {'option': '启用', 'color': 'green'}, '1': {'option': '禁用', 'color': 'red'}, '2': {'option': '过期', 'color': 'orange'}},
        fundPayTypeOptions: {'0': '市直', '1': '省直'},
        fundPayPointOptions: [],  // 公积金单边小数点
        // excel表头数据
        exportFields: [],
        // 表头
        columns: [
          {
            width: 220,
            ellipsis: true,
            title: '户名称',
            align: 'center',
            dataIndex: 'departName',
            customRender:(text) => {
              let str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 170,
            ellipsis: true,
            title: '缴纳地',
            align: 'center',
            dataIndex: 'areaName',
            customRender:(text) => {
              let str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
            ellipsis: true,
            title: '适用周期',
            align: 'center',
            dataIndex: 'applyStartDate',
            customRender:(text, record) => {
              let start = text ? text.substring(0, 10) : '-'
              let end = record.applyEndDate ? (record.applyEndDate).substring(0, 10) : '-'
              let str = start + '~' + end

              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '基数上限',
            align: 'center',
            dataIndex: 'upperLimit',
            customRender:(text, record) => {
              let str = (record.baseType == 0) ? text.toLocaleString() : record.fundPayUpperLimit.toLocaleString()
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '基数下限',
            align: 'center',
            dataIndex: 'lowerLimit',
            customRender:(text, record) => {
              let str = (record.baseType == 0) ? text.toLocaleString() : record.fundPayLowerLimit.toLocaleString()
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '类别',
            align: 'center',
            dataIndex: 'baseType',
            customRender:(text) => {
              let str = ((Object.keys(this.baseTypeOptions).length) && (this.baseTypeOptions).hasOwnProperty(text)) ? (this.baseTypeOptions)[text] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '是否省直',
            align: 'center',
            dataIndex: 'fundPayType',
            customRender:(text, record) => {
              let str = '-'

              if (record.baseType != 0) {
                str = ((Object.keys(this.fundPayTypeOptions).length) && (this.fundPayTypeOptions).hasOwnProperty(text)) ? (this.fundPayTypeOptions)[text] : '-'
              }

              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            customRender:(text) => {
              let color = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].color : 'blue'
              let str = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].option : '-'
              
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createDate',
            customRender:(text) => {
              let str = text ? text : '-'
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
        url: {
          list: 'hrSocial/sysbasesetinfo/page',
          queryAllInfoById: 'hrSocial/sysbasesetinfo/allInfo/',
          exportXlsUrl: 'hrSocial/sysbasesetinfo/doexportPaymentInfo?',
          disableOrEnableUrl: 'hrSocial/sysbasesetinfo/disableOrEnableById',
        },
      }
    },
    created() {
      // 地区
      this.areaTrees = Vue.ls.get('glob_area')
      // 获取社保户、公积金户
      getHouseHold().then((res) => {
        if (res.code === 200) {
          this.householdOptions = res.data
        } else {
          this.$message.error('社保户数据请求失败！')
        }
      })
    },
    methods: {
      // 新建
      handleAdd: function(type) {
        if (type === 'social') {  // 社保
          this.$refs.socialSettingModal.title = '社保配置新建'
          this.$refs.socialSettingModal.AreaTrees = Vue.ls.get('glob_area')
          this.$refs.socialSettingModal.socialHouseholdOptions = this.householdOptions
          if (this.householdOptions.length > 0 && (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length > 0)) {
            this.$refs.socialSettingModal.add()
          } else {
            if (this.householdOptions.length === 0) {
              this.$message.error(`"社保、公积金户"${this.loadMessage}`)
              return
            }
            if (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length === 0) {
              this.$message.error(`"地区"${this.loadMessage}`)
              return
            }
          }
        } else {  // 公积金
          this.$refs.fundSettingModal.title = '公积金配置新建'
          this.$refs.fundSettingModal.AreaTrees = Vue.ls.get('glob_area')
          this.$refs.fundSettingModal.fundPayPointBelongs = this.fundPayPointOptions
          this.$refs.fundSettingModal.fundHouseholdOptions = this.householdOptions
          if (this.householdOptions.length && this.fundPayPointOptions.length && (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length)) {
            this.$refs.fundSettingModal.add()
          } else {
            if (this.householdOptions.length === 0) {
              this.$message.error(`"社保、公积金户"${this.loadMessage}`)
              return
            }
            if (this.fundPayPointOptions.length === 0) {
              this.$message.error(`"公积金单边小数点"${this.loadMessage}`)
              return
            }
            if (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length === 0) {
              this.$message.error(`"地区"${this.loadMessage}`)
              return
            }
          }
        }
      },
      // 详情
      handleDetail: function(record) {
        if (Number(record.baseType) === 0) { // 社保
          this.$refs.socialSettingModal.title = '社保配置详情'
          this.$refs.socialSettingModal.editButton = false
          this.$refs.socialSettingModal.socialIsDisabled = true
          this.$refs.socialSettingModal.AreaTrees = Vue.ls.get('glob_area')
          if ((Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length > 0)) {
            httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
              if (Number(res.code) === 200 && res.data) {
                getHouseHold({id: res.data.departId}).then((socialHousehold) => {
                  if (socialHousehold.code === 200 && socialHousehold.data.length > 0) {
                    this.$refs.socialSettingModal.socialHouseholdOptions = socialHousehold.data
                    this.$refs.socialSettingModal.edit(res.data)
                  } else {
                    this.$message.error('社保户数据请求失败！')
                  }
                })
              } else {
                this.$message.error('数据请求失败！')
              }
            })
          } else {
            if (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length == 0) {
              this.$message.error(`"地区"${this.loadMessage}`)
            }
          }
        } else {  // 公积金
          this.$refs.fundSettingModal.title = '公积金配置详情'
          this.$refs.fundSettingModal.editButton = false
          this.$refs.fundSettingModal.fundIsDisabled = true
          this.$refs.fundSettingModal.AreaTrees = Vue.ls.get('glob_area')
          this.$refs.fundSettingModal.fundPayPointBelongs = this.fundPayPointOptions
          if (this.fundPayPointOptions.length && (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length)) {
            httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
              if (Number(res.code) === 200 && res.data) {
                getHouseHold({id: res.data.departId}).then((providentHousehold) => {
                  if (providentHousehold.code === 200 && providentHousehold.data.length > 0) {
                    this.$refs.fundSettingModal.fundHouseholdOptions = providentHousehold.data
                    this.$refs.fundSettingModal.edit(res.data)
                  } else {
                    this.$message.error('公积金户数据请求失败！')
                  }
                })
              } else {
                this.$message.error('数据请求失败！')
              }
            })
          } else {
            if (this.fundPayPointOptions.length === 0) {
              this.$message.error(`"公积金单边小数点"${this.loadMessage}`)
              return
            }
            if (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length === 0) {
              this.$message.error(`"地区"${this.loadMessage}`)
              return
            }
          }
        }
      },
      // 编辑
      handleEdit: function(record) {
        if (record.baseType == 0) { // 社保
          this.$refs.socialSettingModal.title = '社保配置编辑'
          this.$refs.socialSettingModal.AreaTrees = Vue.ls.get('glob_area')
          if ((Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length > 0)) {
            httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
              if (Number(res.code) === 200 && res.data) {
                getHouseHold({id: res.data.departId}).then((socialHousehold) => {
                  if (socialHousehold.code === 200 && socialHousehold.data.length > 0) {
                    this.$refs.socialSettingModal.socialHouseholdOptions = socialHousehold.data
                    this.$refs.socialSettingModal.edit(res.data)
                  } else {
                    this.$message.error('社保户数据请求失败！')
                  }
                })
              } else {
                this.$message.error('数据请求失败！')
              }
            })
          } else {
            if (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length === 0) {
              this.$message.error(`"地区"${this.loadMessage}`)
            }
          }
        } else {  // 公积金
          this.$refs.fundSettingModal.title = '公积金配置编辑'
          this.$refs.fundSettingModal.AreaTrees = Vue.ls.get('glob_area')
          this.$refs.fundSettingModal.fundPayPointBelongs = this.fundPayPointOptions
          if (this.fundPayPointOptions.length && (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length)) {
            httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
              if (Number(res.code) === 200 && res.data) {
                getHouseHold({id: res.data.departId}).then((providentHousehold) => {
                  if (providentHousehold.code === 200 && providentHousehold.data.length) {
                    this.$refs.fundSettingModal.fundHouseholdOptions = providentHousehold.data
                    this.$refs.fundSettingModal.edit(res.data)
                  } else {
                    this.$message.error('公积金户数据请求失败！')
                  }
                })
              } else {
                this.$message.error('数据请求失败！')
              }
            })
          } else {
            if (this.fundPayPointOptions.length === 0) {
              this.$message.error(`"公积金单边小数点"${this.loadMessage}`)
              return
            }
            if (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length === 0) {
              this.$message.error(`"地区"${this.loadMessage}`)
            }
          }
        }
      },
      // 禁用和启用
      handleEditStatus: function(record) {
        const status = Number(record.status) === 1 ? 0 : 1
        const reqUrl = `${this.url.disableOrEnableUrl}?id=${record.id}&status=${status}`
        httpAction(reqUrl, '', 'POST').then((res) => {
          if (Number(res.code) === 200) {
            this.$message.success('操作成功！')
            this.loadData()
            this.onClearSelected()
          } else {
            this.$message.warning(res.message || res.msg)
          }
        })
      },
      // 数据字典
      initDictConfig() {
        // 公积金单边小数点
        initDictOptions('fund_pay_point').then((res) => {
          if (res.code === 200) {
            this.fundPayPointOptions = res.data
          }
        })
      },
      // 社保缴纳地省份切换
      handleProvinceChange(value) {
        this.areaCitys = []
        this.areaTowns = []
        if (value) {
          for (const c of this.areaTrees[value - 1].children) {
            this.areaCitys.push(c)
          }
        }
        delete this.queryParam.city
        delete this.queryParam.town
      },
      // 社保缴纳地城市切换
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
        delete this.queryParam.town
      },
      // 重置按钮
      searchReset() {
        this.queryParam = {}
        this.areaCitys = []
        this.areaTowns = []
        this.loadData(1)
      },
      // 日期选择
      handleMonthChange(date) {
        // 时间格式化
        this.queryParam.applyStartDate = date ? (date.format('YYYY-MM') + '-01 00:00:00') : null
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
