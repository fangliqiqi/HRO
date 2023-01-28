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
            <a-form-item label="结算主体编码">
              <a-input
                allowClear
                placeholder="请输入结算主体编码"
                v-model="queryParam.departNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体名称">
              <a-input
                allowClear
                placeholder="请输入结算主体名称"
                v-model="queryParam.departName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户名称">
              <a-input
                allowClear
                placeholder="请输入客户名称"
                v-model="queryParam.customerName"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="创建类型">
                <a-select
                  placeholder="请选择创建类型"
                  optionFilterProp="children"
                  v-model="queryParam.createType"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option value="0">合同之后</a-select-option>
                  <a-select-option value="1">合同之前</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="合同关联">
                <a-select
                  placeholder="请选择合同关联"
                  v-model="queryParam.relateFlag"
                >
                  <a-select-option value="0">是</a-select-option>
                  <a-select-option value="1">否</a-select-option>
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
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a v-has="'wxhr:tsettledomain_audit'" v-if="record.dpAuditFlag == 2 || record.dpAuditFlag == 4" @click="handleAudit(record)">审核</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <settlement-detail-modal ref="SettlementDetailForm" @ok="modalFormOk"></settlement-detail-modal>
  </a-card>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SettlementDetailModal from './modules/SettlementDetailModal'

import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { httpAction } from '@/api/manage'
export default {
  name: 'SettlementAudit',
  mixins: [JeecgListMixin],
  components: {
    SettlementDetailModal,
  },
  data() {
    return {
      description: '结算主体列表',
      serverItemDicts: [],
      organAll: [],
      statusOption:[
        {
          color:'green',
          text:'通过'
        },
        {
          color:'red',
          text:'不通过'
        },
        {
          color:'cyan',
          text:'待审核'
        },
        {
          color:'orange',
          text:'待提交'
        },
        {
          color:'blue',
          text:'经理通过'
        },
        {
          color:'red',
          text:'经理不通过'
        },
      ],
      // 表头
      columns: [
        {
          title: '审核状态',
          align: 'center',
          width: 100,
          dataIndex: 'dpAuditFlag',
          customRender: val => {
            const res = this.statusOption[val]
            return (
              <a-tag color={res.color}>{res.text}</a-tag>
            )
          }
        },
        {
          ellipsis: true,
          title: '结算主体名称',
          align: 'center',
          dataIndex: 'departName',
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'departNo',
          width: 120,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '服务项目',
          align: 'center',
          dataIndex: 'serverItem',
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '客户',
          align: 'center',
          dataIndex: 'customerName',
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>
                {resultText}
              </a-tooltip>
            )
          }
        },
        {
          title: '创建类型',
          align: 'center',
          dataIndex: 'createType',
          ellipsis: true,
          customRender: text => {
            const resultText = (text == '1') ? '合同之前' : '合同之后'
            return (
              <a-tooltip placement="topLeft" title={resultText}>
                {resultText}
              </a-tooltip>
            )
          }
        },
        {
          title: '合同关联',
          align: 'center',
          dataIndex: 'relateFlag',
          ellipsis: true,
          customRender: text => {
            const resultText = (text == '1') ? '否' : '是'
            return (
              <a-tooltip placement="topLeft" title={resultText}>
                {resultText}
              </a-tooltip>
            )
          }
        },
        {
          title: '合同名称',
          align: 'center',
          dataIndex: 'contractName',
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>
                {resultText}
              </a-tooltip>
            )
          }
        },
        {
          width: 90,
          ellipsis: true,
          title: '创建人',
          align: 'center',
          dataIndex: 'createUserName',
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          width: 150,
          ellipsis: true,
          customRender: text => {
            const resultText = text ? text.substring(0, 10) : '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
          width:100,
        }
      ],
      url: {
        list: "/hrBase/tsettledomain/audit/page?type=0",
        getdetail: 'hrBase/tsettledomain/vo/',
        getOrganAll: '/admin/organizationinfo/getOrgForCus?type=0',
      },
    }
  },
  created() {
    this.loadOrganAll()
  },
  methods: {
    handleAudit(record){
      this.$refs.SettlementDetailForm.title = '审核'
      this.$refs.SettlementDetailForm.statusOption = this.statusOption
      this.$refs.SettlementDetailForm.serverItemDicts = this.serverItemDicts
      this.$refs.SettlementDetailForm.organAll = this.organAll
      this.$refs.SettlementDetailForm.auditFlag = true
      httpAction(this.url.getdetail + record.id, null, 'GET').then(res => {
        if(res.code === 200){
          this.$refs.SettlementDetailForm.show(res.data)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },

    loadOrganAll() {
      httpAction(this.url.getOrganAll,'','GET').then((res) => {
        if(res.code === 200 && res.data.length > 0) {
          this.organAll = res.data;
        }
      });
    },
    initDictConfig() {
      initDictOptions('server_items').then((res) => {
        if (res.code === 200) {
          this.serverItemDicts = res.data;
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
.formLabel {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
