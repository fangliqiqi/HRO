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
                  v-for="(value, key) in organizationOptions"
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
            <a-form-item label="生成月份">
              <a-month-picker
                allowClear
                placeholder="请选择生成月份查询"
                v-model="queryParam.providentCreateMonth"
                style="width: 100%"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>
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
                v-model="queryParam.status"
                placeholder="请选择状态查询"
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
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="所属地市"
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
        @click="handleAdd"
        v-has="'wxhr:tProvidentaprovalform_add'"
      >生成核准表</a-button>
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
            v-if="record.status==0 || record.status==3 || record.status==4"
            v-has="'wxhr:tProvidentaprovalform_submit'"
          />
          <a
            @click="handleEdit(record)"
            v-if="record.status==0 || record.status==3 || record.status==4"
            v-has="'wxhr:tProvidentaprovalform_submit'"
          >提交</a>
          <a-divider
            type="vertical"
            v-if="record.status==0 || record.status==3 || record.status==4"
            v-has="'wxhr:tprovidentaprovalform_del'"
          />
          <a-popconfirm
            title="确定删除吗?"
            v-if="record.status==0 || record.status==3 || record.status==4"
            @confirm="() => handleDelete(record.id)"
            v-has="'wxhr:tprovidentaprovalform_del'"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <fund-approval-apply-modal
      ref="fundApprovalApplyModal"
      @ok="modalFormOk"
    ></fund-approval-apply-modal>
    <fund-approval-apply-detail-modal
      ref="fundApprovalApplyDetailModal"
      @ok="modalFormOk"
    ></fund-approval-apply-detail-modal>
    <error-modal ref="errorModal"></error-modal>

  </a-card>
</template>

<script>
  import Vue from 'vue'
  import { httpAction } from '@/api/manage'
  import { getHouseHold } from '@/api/api'
  import ErrorModal from '../../global/modules/ErrorModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import FundApprovalApplyModal from './modules/FundApprovalApplyModal'
  import FundApprovalApplyDetailModal from './modules/FundApprovalApplyDetailModal'

  export default {
    name: 'FundApprovalApplyList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      FundApprovalApplyModal,
      FundApprovalApplyDetailModal,
    },
    data() {
      return {
        description: '公积金核准申请',
        // 枚举字段
        areaTrees: [],  // 地区
        areaCitys: [],  // 城市
        areaTowns: [],  // 区县
        payTypeOptions: [], // 付款方式
        nextUserIdOptions: [],  // 下一办理人
        organizationOptions: [], // 社保户、公积金户
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        statusOptions: {'0': {'option': '待提交', 'color': 'blue'}, '1': {'option': '待出账', 'color': 'cyan'}, '2': {'option': '已出账', 'color': 'green'}, '3': {'option': '出账失败', 'color': 'red'}, '4': {'option': '审核不通过', 'color': 'pink'}, '5': {'option': '待审核', 'color': 'orange'}, '6': {'option': '已出账不转账', 'color': 'purple'}},
        // excel表头数据
        exportFields: [],
        // 表头
        columns: [
          {
            width: 370,
            ellipsis: true,
            title: '公积金户',
            align: 'center',
            dataIndex: 'providentHousehold',
            customRender:(text) => {
              let str = '-'
              for (const item of this.organizationOptions) {
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
            title: '所属地市',
            align: 'center',
            dataIndex: 'payAddr',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '生成月份',
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
            title: '结算金额',
            align: 'center',
            dataIndex: 'settlementAmount',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '开票金额',
            align: 'center',
            dataIndex: 'ticketAmount',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 110,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            customRender:(text) => {
              const color = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].color : 'blue'
              const str = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 170,
            ellipsis: true,
            title: '备注',
            align: 'center',
            dataIndex: 'remark',
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
          list: 'hrSocial/tprovidentaprovalform/pageOfUser',
          delete: 'hrSocial/tprovidentaprovalform/',
          queryAllInfoById: 'hrSocial/tprovidentaprovalform/getProvidentAprovalAllInfo',
        },
      }
    },

    created() {
      // 地区
      this.areaTrees = Vue.ls.get('glob_area')
      // 获取社保户、公积金户
      getHouseHold().then((res) => {
        if (Number(res.code) === 200) {
          this.organizationOptions = res.data
        } else {
          this.$message.error('单位数据请求失败！')
        }
      })
      // 获取权限的用户
      httpAction('admin/user/findUserBypPrmission?permissionStr=wxhr:tProvidentaprovalform_outAccount', '', 'GET').then((res) => {
        if (Number(res.code) === 200) {
          this.nextUserIdOptions = res.data
        } else {
          this.$message.error('审核人数据请求失败！')
        }
      })
    },

    methods: {
      // 生成核准表
      handleAdd: function() {
        this.$refs.fundApprovalApplyModal.title = '生成公积金核准表'
        this.$refs.fundApprovalApplyModal.organizationBelongs = this.organizationOptions
        this.$refs.fundApprovalApplyModal.areaTrees =  Vue.ls.get('glob_area')
        if (this.organizationOptions.length > 0 && (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length > 0)) {
          this.$refs.fundApprovalApplyModal.add()
        } else {
          if (this.organizationOptions.length === 0) {
            this.$message.error(`"社保户、公积金户"${this.loadMessage}`)
            return false
          }
          if (Array.isArray(Vue.ls.get('glob_area')) && Vue.ls.get('glob_area').length === 0) {
            this.$message.error(`"地区"${this.loadMessage}`)
            return false
          }
        }
      },

      // 提交
      handleEdit: function(record) {
        this.$refs.fundApprovalApplyDetailModal.id = record.id
        this.$refs.fundApprovalApplyDetailModal.title = '公积金核准表提交'
        this.$refs.fundApprovalApplyDetailModal.isVerify = true
        this.$refs.fundApprovalApplyDetailModal.payTypeBelongs = this.payTypeOptions
        this.$refs.fundApprovalApplyDetailModal.nextUserIdBelongs = this.nextUserIdOptions
        if (this.payTypeOptions.length > 0) {
          httpAction(`${this.url.queryAllInfoById}?id=${record.id}`, '', 'GET',10000 * 20).then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.fundApprovalApplyDetailModal.edit(res.data)
            } else {
              this.$message.error('数据请求失败！')
            }
          })
        } else {
          if (this.payTypeOptions.length === 0) {
            this.$message.error(`"付款方式"${this.loadMessage}`)
            return false
          }
        }
      },

      // 详情
      handleDetail: function(record) {
        this.$refs.fundApprovalApplyDetailModal.title = '公积金核准表详情'
        this.$refs.fundApprovalApplyDetailModal.payTypeBelongs = this.payTypeOptions
        if (this.payTypeOptions.length > 0) {
          httpAction(`${this.url.queryAllInfoById}?id=${record.id}`, '', 'GET',10000 * 20).then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.fundApprovalApplyDetailModal.edit(res.data)
            } else {
              this.$message.error('数据请求失败！')
            }
          })
        } else {
          if (this.payTypeOptions.length === 0) {
            this.$message.error(`"付款方式"${this.loadMessage}`)
            return false
          }
        }
      },

      // 省份切换
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

      // 城市切换
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

      // 数据字典
      initDictConfig() {
        // 付款方式
        initDictOptions('approval_payType').then((res) => {
          if (Number(res.code) === 200) {
            this.payTypeOptions = res.data
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
