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
        v-has="'wxhr:thavesalarynoinsurance_export'"
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
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <dispatch-apply-export-modal
      ref="DispatchApplyExportModalForm"
      @ok="modalFormOk"
    ></dispatch-apply-export-modal>
    
  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  
  import DispatchApplyExportModal from './modules/DispatchApplyExportModal' //导出明细
  
  
  export default {
    name: 'NoticeNosalaryInsurance',
    mixins: [JeecgListMixin],
    components: {
      DispatchApplyExportModal,
    },
    data() {
      return {
        description: '商险未购买工资提醒',
        settleTypeOptions:[], //结算类型
        statusOptions:[], //状态
        buyTypeOptions:[],
        // 表头
        columns: [
          {
            title: '月份',
            align: 'center',
            dataIndex: 'settleMonth'
          },
          {
            title: '姓名',
            align: 'center',
            dataIndex: 'employeeName'
          },
          {
            title: '身份证号',
            align: 'center',
            dataIndex: 'employeeIdCard'
          },
          {
            title: '单位',
            align: 'center',
            dataIndex: 'customerName'
          },
          {
            title: '结算部门',
            align: 'center',
            dataIndex: 'settleDomainName'
          },
          {
            title: '有无工资',
            align: 'center',
            dataIndex: 'hasSalaryFlag',
            customRender: (text) => {
              return (text == 0) ? '有' : '无'
            }
          },
        ],
        url: {
          list: '/hrBase/thavesalarynoinsurance/page',
          exportXlsUrl:'/hrBase/thavesalarynoinsurance/export',
          exportFields:'/hrBase/thavesalarynoinsurance/getExportFieldName'
        }
      }
    },
    methods: {
      //导出
      exportHandle:function(){
        this.$refs.DispatchApplyExportModalForm.title = '商险未购买工资提醒导出'
        this.$refs.DispatchApplyExportModalForm.url.exportXlsUrl = this.url.exportXlsUrl
        this.$refs.DispatchApplyExportModalForm.url.exportFields = this.url.exportFields
        this.$refs.DispatchApplyExportModalForm.params = this.getQueryParams()//查询条件
        this.$refs.DispatchApplyExportModalForm.add(this.selectedRowKeys)
      },
      //查看
      handleDetail: function(record) {
        this.$refs.DispatchApplyDetailForm.title = '详情'
        this.$refs.DispatchApplyDetailForm.statusName = filterDictText(this.statusOptions, record.status)
        this.$refs.DispatchApplyDetailForm.buyTypeName = filterDictText(this.buyTypeOptions, record.buyType)
        this.$refs.DispatchApplyDetailForm.settleType = filterDictText(this.settleTypeOptions, record.settleType)
        this.$refs.DispatchApplyDetailForm.edit(record)
      },

      // 数据字典
      initDictConfig() {
       //购买类型
        initDictOptions('insurance_buyType').then((res) => {
          if (res.code === 200) {
            this.buyTypeOptions = res.data
          }
        });
        // 状态
        initDictOptions('Insurance_record_status').then((res) => {
          if (res.code === 200) {
            this.statusOptions = res.data
          }
        })
        //结算类型 
        initDictOptions('settlementType').then((res) => {
          if (res.code === 200) {
            this.settleTypeOptions = res.data
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

</style>
