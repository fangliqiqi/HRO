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
            <a-form-item label="客户单位">
              <a-input
                placeholder="客户单位"
                v-model="queryParam.customerName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <a-input
                placeholder="结算主体"
                v-model="queryParam.departName"
              ></a-input>
            </a-form-item>
          </a-col>
          <template>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="业务名称">
                <a-input
                  placeholder="业务名称"
                  v-model="queryParam.businessName"
                ></a-input>
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="业务对接人">
                <a-input
                  placeholder="业务对接人"
                  v-model="queryParam.dockingPerson"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="服务客服">
                <a-select placeholder="服务客服" show-search option-filter-prop="children" v-model="queryParam.customerService">
                  <a-select-option
                    v-for="item in sysUsers"
                    :key="item.userId"
                    :value="item.userId"
                  >
                    {{ item.nickname }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算金额">
                <a-input-number
                  placeholder="结算金额"
                  :precision="2"
                  style="width:100%;"
                  :min="0"
                  v-model="queryParam.sumSettle"
                ></a-input-number>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算月份">
                <a-month-picker
                  v-model="queryParam.settleMonth_extra"
                  placeholder="结算月份"
                  @change="onChangeMonth"
                  style="width: 100%"/>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="服务项目">
                <a-select
                  v-model="queryParam.serviceItem"
                  mode="multiple"
                  placeholder="服务项目"
                  style="width: 100%"
                >
                  <a-select-option
                    v-for="item in serviceItems"
                    :key="item"
                  >
                    {{ item }}
                  </a-select-option>
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
          <a
            @click="handleAudit(record)"
            v-has="'wxhr:tbusinessoutsourcingmain_audit'"
          >审核</a>
        </span>
        <!-- 业务名称 -->
        <span
          slot="businessName"
          slot-scope="text"
        >
          <a-tooltip
            placement="topLeft"
            :title="text ? text : '-'"
          >
            {{ text ? text : '-' }}
          </a-tooltip>
        </span>
        <!-- 客户单位 -->
        <span
          slot="customerName"
          slot-scope="text"
        >
          <a-tooltip
            placement="topLeft"
            :title="text ? text : '-'"
          >
            {{ text ? text : '-' }}
          </a-tooltip>
        </span>
        <!-- 结算主体 -->
        <span
          slot="departName"
          slot-scope="text"
        >
          <a-tooltip
            placement="topLeft"
            :title="text ? text : '-'"
          >
            {{ text ? text : '-' }}
          </a-tooltip>
        </span>
        <!-- 业务对接人 -->
        <span
          slot="dockingPerson"
          slot-scope="text"
        >
          <a-tooltip
            placement="topLeft"
            :title="text ? text : '-'"
          >
            {{ text ? text : '-' }}
          </a-tooltip>
        </span>
        <!-- 服务项目 -->
        <span
          slot="moutsourcingItemVos"
          slot-scope="text, record"
        >
          <a-tag
            v-for="(item, index) in record.moutsourcingItemVos"
            :key="index"
            :color="color[index]"
          >{{ item.itemName }}</a-tag>
        </span>
        <!-- 结算日期 -->
        <span
          slot="settleDate"
          slot-scope="text,record"
        >
          <a-tag
            v-if="record.settleDate == null"
            color="red"
          >未结算</a-tag>
          <span v-if="record.settleDate != null">
            <a-tooltip
              placement="topLeft"
              :title="record.settleDate"
            >
              {{ record.settleDate }}
            </a-tooltip>
          </span>
        </span>
        <!-- 审核状态 -->
        <span
          slot="auditFlag"
          slot-scope="text, record"
        >
          <a-tag
            v-if="record.auditFlag == 0"
            color="cyan"
          >待提交</a-tag>
          <a-tag
            v-if="record.auditFlag == 1"
            color="orange"
          >待审核</a-tag>
          <a-tag
            v-if="record.auditFlag == 2"
            color="green"
          >审核通过</a-tag>
          <a-tag
            v-if="record.auditFlag == 3"
            color="red"
          >审核不通过</a-tag>
        </span>
        <!-- 业务开发人 -->
        <span
          slot="businessPersion"
          slot-scope="text"
        >
          <a-tooltip
            placement="topLeft"
            :title="filterWxSysUserDict(sysUsers, text)"
          >
            {{ filterWxSysUserDict(sysUsers, text) }}
          </a-tooltip>
        </span>
        <!-- 服务客服 -->
        <span
          slot="customerService"
          slot-scope="text"
        >
          <a-tooltip
            placement="topLeft"
            :title="filterWxSysUserDict(sysUsers, text)"
          >
            {{ filterWxSysUserDict(sysUsers, text) }}
          </a-tooltip>
        </span>
        <!-- 业务创建日期 -->
        <span
          slot="createTime"
          slot-scope="text"
        >
          <a-tooltip
            placement="topLeft"
            :title="text ? text : '-'"
          >
            {{ text ? text : '-' }}
          </a-tooltip>
        </span>
        <!-- 已匹配金额 -->
        <span
          slot="matchAmount"
          slot-scope="text, record"
        >
          <a-tooltip
            placement="topLeft"
            :title="record.settleBillVo && record.settleBillVo.matchAmount ? record.settleBillVo.matchAmount.toLocaleString() : '0'"
          >
            {{ record.settleBillVo && record.settleBillVo.matchAmount ? record.settleBillVo.matchAmount.toLocaleString() : '0' }}
          </a-tooltip>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <all-detail-module
      ref="allDetailModal"
      @ok="modalFormOk"
    ></all-detail-module>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction } from '@/api/manage'
import { filterWxSysUserDict } from '@/utils/customDict'
import AllDetailModule from './modules/AllDetailModule'

export default {
  name: 'BusinessOutSroucingAuditList',
  mixins: [JeecgListMixin],
  components: {
    AllDetailModule,
  },
  data() {
    return {
      description: '事务性外包业务列表页',
      loading: false,
      filterWxSysUserDict,
      color: ['pink','red','orange','green','cyan','blue','purple'],
      serviceItems: ['招聘','培训','咨询','招考','代账','公司变更/注册','补贴','其他'],
      matchStatusOptions: {'0': {'option': '未匹配', 'color': 'red'}, '1': {'option': '已匹配', 'color': 'green'}},
      sysUsers: [],
      organs: [],
      // 表头
      columns: [
        {
          width: 160,
          ellipsis: true,
          title: '业务名称',
          align: 'center',
          dataIndex: 'businessName',
          scopedSlots: { customRender: 'businessName' },
        },
        {
          width: 180,
          ellipsis: true,
          title: '客户单位',
          align: 'center',
          dataIndex: 'customerName',
          scopedSlots: { customRender: 'customerName' },
        },
        {
          width: 180,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'departName',
          scopedSlots: { customRender: 'departName' },
        },
        {
          width: 140,
          ellipsis: true,
          title: '业务对接人',
          align: 'center',
          dataIndex: 'dockingPerson',
          scopedSlots: { customRender: 'dockingPerson' },
        },
        {
          width: 220,
          ellipsis: true,
          title: '服务项目',
          align: 'center',
          dataIndex: 'moutsourcingItemVos',
          scopedSlots: { customRender: 'moutsourcingItemVos' },
        },
        {
          width: 140,
          ellipsis: true,
          title: '结算日期',
          align: 'center',
          dataIndex: 'settleDate',
          scopedSlots: { customRender: 'settleDate' },
        },
        {
          width: 140,
          ellipsis: true,
          title: '审核状态',
          align: 'center',
          dataIndex: 'auditFlag',
          scopedSlots: { customRender: 'auditFlag' },
        },
        {
          width: 140,
          ellipsis: true,
          title: '业务开发人',
          align: 'center',
          dataIndex: 'businessPersion',
          scopedSlots: { customRender: 'businessPersion' },
        },
        {
          width: 140,
          ellipsis: true,
          title: '服务客服',
          align: 'center',
          dataIndex: 'customerService',
          scopedSlots: { customRender: 'customerService' },
        },
        {
          width: 120,
          ellipsis: true,
          title: '匹配状态',
          align: 'center',
          dataIndex: 'matchStatus',
          customRender:(text, record) => {
            let color = 'red'
            let str = '未匹配'
            if (record.settleBillVo) {
              color = this.matchStatusOptions.hasOwnProperty(record.settleBillVo.matchStatus) ? this.matchStatusOptions[record.settleBillVo.matchStatus].color : 'blue'
              str = this.matchStatusOptions.hasOwnProperty(record.settleBillVo.matchStatus) ? this.matchStatusOptions[record.settleBillVo.matchStatus].option : '-'
            }
            return <a-tag color={color}>{str}</a-tag>
          },
        },
        {
          width: 130,
          ellipsis: true,
          title: '已匹配金额',
          align: 'center',
          dataIndex: 'matchAmount',
          scopedSlots: { customRender: 'matchAmount' },
        },
        {
          width: 150,
          ellipsis: true,
          title: '业务创建日期',
          align: 'center',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' },
        },
        {
          width: 90,
          ellipsis: true,
          title: '操作',
          key: 'operations',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/hrOneTime/tbusinessoutsourcingmain/audit/page',
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        getSysUsers: '/admin/user/findWxUsers',
        delete: '/hrOneTime/tbusinessoutsourcingmain/',
        getCustomerInfo: '/hrBase/tcustomerinfo/vo/',
        getOrgan: '/admin/organizationinfo/getOrgForCus?type=1',
        getSettleDomainInfo: '/hrBase/tsettledomain/vo/',
        findAllDetail: '/hrOneTime/tbusinessoutsourcingmain/getDetail/',
        auditProcessUrl: 'hrOneTime/tonetimeauditinfo/getAllAuditInfo/',
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {
    this.getSysUsers();
    this.loadOrgans();
  },
  methods: {
    onChangeMonth(date){
      this.queryParam.settleMonth = date ? date.format('YYYYMM') : null
    },
    handleAudit(record) {
      this.$refs.allDetailModal.title = '业务详情'
      this.$refs.allDetailModal.sysUsers = this.sysUsers
      this.$refs.allDetailModal.organs = this.organs
      this.$refs.allDetailModal.audit = true
      if (this.sysUsers.length > 0 && this.organs.length > 0) {
        httpAction(this.url.findAllDetail + record.id, null,'GET').then((res) => {
          httpAction(this.url.getCustomerInfo + record.customerId,null,'GET').then((re) => {
            if(Number(re.code) === 200) {
              const unitContracts = re.data.contractVoList || []
              for(let i = 0; i < unitContracts.length; i++) {
                if(String(res.data.unitContractId) === String(unitContracts[i].id)) {
                  res.data.unitContractId = unitContracts[i].contractName
                }
              }
              httpAction(this.url.getSettleDomainInfo + record.settleDomainId, null, 'GET').then((r) => {
                if (r.data.departSettlementInfo !== null && r.data.departSettlementInfo.taxFee !== null) {
                  this.$refs.allDetailModal.settleDomainInfo = r.data;
                  this.$refs.allDetailModal.show(res.data, this.url.auditProcessUrl);
                } else {
                  this.$message.error('税率不能为空！')
                }
              });
            }
          });
        });
      } else {
        this.$message.error('基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！')
      }
    },
    doSubmit(record) {
      httpAction('/admin/user/findUserBypPrmission?permissionStr=' + 'wxhr:tbusinessoutsourcingmain_submit','wxhr:tbusinessoutsourcingmain_submit','GET').then((res) => {
        if(Number(res.code) === 200) {
          this.$refs.auditModal.auditUsers = res.data;
          this.$refs.auditModal.showModal(record.id);
        }
      });
    },
    loadOrgans() {
      httpAction(this.url.getOrgan,'','GET').then((res) => {
        if(Number(res.code) === 200 && res.data.length > 0) {
          this.organs = res.data;
        }
      });
    },
    /**
     * 获取系统用户数据
     */
    getSysUsers() {
      httpAction(this.url.getSysUsers, null ,'GET').then((res) => {
        this.sysUsers = res.data;
      });
    },
    businessNewModalOk() {
      this.loadData();
    },
    auditModalOk() {
      this.loadData();
    },
    // 隐藏列样式
    handleColumnStyle(width) {
      if (width) {
        return `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: ${width}px;`
      }
      return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
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
