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
                v-model="queryParam.employeeName"
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
                v-model="queryParam.employeeIdCard"
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        type="primary"
        icon="download"
        v-has="'wxhr:tinsurancenonemessage_export'"
        @click="exportHandle"
      >导出</a-button>

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
          <a
            @click="handleDeal(record)"
            v-has="'wxhr:tinsurancenonemessage_handle'"
          >办理</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <dispatch-apply-export-modal
      ref="DispatchApplyExportModalForm"
      @ok="modalFormOk"
    ></dispatch-apply-export-modal>
    <insurance-handle-modal
      ref="InsuranceHandleForm"
      @ok="modalFormOk"
    ></insurance-handle-modal>

  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import DispatchApplyExportModal from './modules/DispatchApplyExportModal' //导出明细
  import InsuranceHandleModal from './modules/InsuranceHandleModal' //办理
  
  export default {
    name: 'NoticeNoInsurance',
    mixins: [JeecgListMixin],
    components: {
      DispatchApplyExportModal,
      InsuranceHandleModal,
    },
    data() {
      return {
        description: '无商险提醒',
        
        // 表头
        columns: [
          {
            title: '单位',
            align: 'center',
            dataIndex: 'customerName'
          },
          {
            title: '结算主体',
            align: 'center',
            dataIndex: 'settlementOrganName'
          },
          {
            title: '员工姓名',
            align: 'center',
            dataIndex: 'employeeName'
          },
          {
            title: '标题',
            align: 'center',
            dataIndex: 'title'
          },
          {
            title: '内容',
            align: 'center',
            dataIndex: 'content'
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            customRender: (text) => {
              return filterDictText(this.statusOptions, text)
            }
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/tinsurancenonemessage/page',
          exportXlsUrl:'/busiInsurance/tinsurancenonemessage/export', //导出
          
        }
      }
    },
    methods: {
      //导出办理
      exportHandle:function(){
        this.$refs.DispatchApplyExportModalForm.title = '导出明细'
        this.$refs.DispatchApplyExportModalForm.url.exportXlsUrl = this.url.exportXlsUrl
        this.$refs.DispatchApplyExportModalForm.url.exportFields = 'busiInsurance/tinsurancenonemessage/getExportFieldName'
        this.$refs.DispatchApplyExportModalForm.params = this.getQueryParams()//查询条件
        this.$refs.DispatchApplyExportModalForm.add(this.selectedRowKeys)
      },
      //办理
      handleDeal: function(record) {
        this.$refs.InsuranceHandleForm.title = '办理'
        this.$refs.InsuranceHandleForm.edit(record)
      },

      // 数据字典
      initDictConfig() {
        // 状态
        initDictOptions('Insurance_record_status').then((res) => {
          if (res.code === 200) {
            this.statusOptions = res.data
          }
        });
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
