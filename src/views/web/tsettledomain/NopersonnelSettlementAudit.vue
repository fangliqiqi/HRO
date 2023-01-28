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
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <div
        class="ant-alert ant-alert-info"
        style="margin-bottom: 16px;"
      >
        已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length }}</a>项
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
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleAudit(record)">审核</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <settlement-document-detail-modal ref="SettlementDocumentDetailForm" :organAll="organAll" @ok="modalFormOk"></settlement-document-detail-modal>

  </a-card>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SettlementDocumentDetailModal from './modules/SettlementDocumentDetailModal'

import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { httpAction } from '@/api/manage'


export default {
  name: 'NopersonnelSettlementAudit',
  mixins: [JeecgListMixin],
  components: {
    SettlementDocumentDetailModal,
  },
  data() {
    return {
      description: '结算审核列表',
      serverItemDicts: [],
      organAll: [],
      statusOption:[
        {
          color:'green',
          text:'审核通过'
        },
        {
          color:'red',
          text:'审核不通过'
        },
        {
          color:'cyan',
          text:'待审核'
        },
        {
          color:'orange',
          text:'待提交'
        },
      ],
      // 表头
      columns: [
        {
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
          title: '客户',
          align: 'center',
          dataIndex: 'customerName',
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
          title: '业务收入',
          align: 'center',
          dataIndex: 'income',
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          ellipsis: true,
          title: '内部计收',
          align: 'center',
          dataIndex: 'innerMoney',
          customRender: text => {
            const resultText = text || 0
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '成本支出',
          align: 'center',
          dataIndex: 'costSum',
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '结算金额',
          align: 'center',
          dataIndex: 'sumSettle',
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '结算日期',
          align: 'center',
          dataIndex: 'createTime',
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createUser',
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        }
      ],
      url: {
        list: '/hrOneTime/tnewsettle/getTMainAndBillVoPage?auditFlag=1',

        getdetail: 'hrBase/tsettledomain/vo/',
        getOrganAll: '/admin/organizationinfo/getOrgForCus?type=0',
        getContract: '/hrBase/tcustomercontract/getOwnContract',
        getOne: '/hrBase/tsettledomain/',
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        selectOneVo: '/hrBase/tsettledomain/vo/',
        getContractById: '/hrBase/tcustomercontract/',
        getCustomerById: '/hrBase/tcustomerinfo/vo/'
      },
    }
  },
  created() {
    this.loadOrganAll()
  },
  methods: {
    handleAudit(record){
      const _this = this
      httpAction(`/hrBase/tsettledomain/vo/${record.settleDomainId}`,null,'get').then(result=>{
        if(result.code === 200){
          httpAction(`/hrOneTime/tnewsettle/getTNewSettleVo?businessMainId=${record.id}`,null,'post').then(res=>{
            if(res.code === 200){
              _this.$refs.SettlementDocumentDetailForm.auditBtn = true
              const type = res.data.bill.wxNo ? 1 : 0
              _this.$refs.SettlementDocumentDetailForm.show(type,res.data)
            }else{
              _this.$message.warning(res.msg)
            }
          })
        }else{
          _this.$message.warning(result.msg)
        }
      })
    },
    handleDetail(record){
      this.$refs.SettlementDetailForm.title = '详情'
      this.$refs.SettlementDetailForm.statusOption = this.statusOption
      this.$refs.SettlementDetailForm.serverItemDicts = this.serverItemDicts
      this.$refs.SettlementDetailForm.organAll = this.organAll
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
          this.organAll = res.data
        }
      });
    },
    initDictConfig() {
      initDictOptions('server_items').then((res) => {
        if (res.code === 200) {
          this.serverItemDicts = res.data
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
