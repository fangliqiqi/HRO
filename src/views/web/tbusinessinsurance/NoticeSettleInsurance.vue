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
                v-model="queryParam.empIdcardNo"
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
        v-has="'wxhr:insurance_nosettleexport'"
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
          slot-scope="text, records"
        >
          <a
            @click="handleDetail(records)"
          >查看</a>
          <a-divider type="vertical" />
          <a
            @click="handleFeedback(records)"
          >反馈</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <dispatch-apply-detail-modal ref="DispatchApplyDetailForm"></dispatch-apply-detail-modal>
    <dispatch-apply-export-modal
      ref="DispatchApplyExportModalForm"
      @ok="modalFormOk"
    ></dispatch-apply-export-modal>

    <a-modal
      title="反馈"
      :visible="feedbackVisible"
      :confirm-loading="feedbackLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      style="width: 680px;"
    >
      <span style="margin-right:10px;">反馈原因:</span>
      <a-select
        optionFilterProp="children"
        placeholder="请选择反馈原因"
        v-model="feedbackText"
        :dropdownMatchSelectWidth="false"
        style="width:250px;"
      >
        <a-select-option
          v-for="(item, index) in rebackReasonList"
          :key="index"
          :value="item.value"
        >{{ item.label }}</a-select-option>
      </a-select>
    </a-modal>
    
  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import DispatchApplyDetailModal from './modules/DispatchApplyDetailModal' //详情
  import DispatchApplyExportModal from './modules/DispatchApplyExportModal' //导出明细
  import { httpAction } from '@/api/manage'
  
  export default {
    name: 'NoticeSettleInsurance',
    mixins: [JeecgListMixin],
    components: {
      DispatchApplyDetailModal,
      DispatchApplyExportModal,
    },
    data() {
      return {
        description: '商险未结算提醒',
        settleTypeOptions:[], //结算类型
        statusOptions:[], //状态
        buyTypeOptions:[],
        feedbackVisible:false, // 控制反馈原因选择弹窗显示
        feedbackLoading:false, // 反馈原因加载动画
        feedbackText: undefined, // 反馈原因
        record: '', // 操作的记录
        rebackReasonList: [], // 反馈原因字典
        // 表头
        columns: [
          {
            width: 140,
            ellipsis: true,
            title: '结算月份',
            align: 'center',
            dataIndex: 'settleMonth',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'settlementOrganName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '结算类型',
            align: 'center',
            dataIndex: 'settleType',
            customRender: (text) => {
              return filterDictText(this.settleTypeOptions, text) || '-'
            }
          },
          {
            width: 160,
            ellipsis: true,
            title: '购买地',
            align: 'center',
            dataIndex: 'businessInsuranceAddr',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '单位',
            align: 'center',
            dataIndex: 'customerName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '姓名',
            align: 'center',
            dataIndex: 'empName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 200,
            ellipsis: true,
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcardNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 220,
            ellipsis: true,
            title: '险种',
            align: 'center',
            dataIndex: 'insuranceTypeName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '保险公司',
            align: 'center',
            dataIndex: 'insuranceCompanyName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '生效时间',
            align: 'center',
            dataIndex: 'policyEffect',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 220,
            ellipsis: true,
            title: '保单起止时间',
            align: 'center',
            dataIndex: 'rangeTime',
            customRender: (text,record) => {
              return `${record.policyStart} ~ ${record.policyEnd}`
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            customRender: (text) => {
              return filterDictText(this.statusOptions, text)
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '反馈原因',
            align: 'center',
            dataIndex: 'reasonType',
            customRender: text => {
              const resultText = filterDictText(this.rebackReasonList, text) || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/tbusinessinsurance/getNoSettleWarn/Vopage', //未结算
          exportXlsUrl:'/busiInsurance/tbusinessinsurance/getNoSettleWarn/export', // 导出
          exportFieldNameUrl:'/busiInsurance/tbusinessinsurance/getNeedSettleExportFieldName', // 导出中文字段
          feedbackUrl:'/busiInsurance/tfeedback/feedback', // 反馈
        }
      }
    },
    methods: {
      //导出办理
      exportHandle:function(){
        this.$refs.DispatchApplyExportModalForm.title = '导出明细'
        this.$refs.DispatchApplyExportModalForm.url.exportXlsUrl = this.url.exportXlsUrl
        this.$refs.DispatchApplyExportModalForm.url.exportFields = this.url.exportFieldNameUrl
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
        // 反馈原因
        initDictOptions('INSURANCE_NEED_SETTLE_TYPE').then(res => {
          if (Number(res.code) === 200) {
            this.rebackReasonList = res.data
          }
        })
      },
      // 反馈
      handleFeedback(record){
        this.record = record
        this.feedbackVisible = true
      },
      // 确定反馈
      handleOk() {
        this.feedbackLoading = true
        if (!(this.feedbackText !== undefined && this.feedbackText.trim() !== '')) {
          this.$message.warning(`反馈不能为空`)
          this.feedbackLoading = false
          return
        }
        const params = {
          reasonType:this.feedbackText ,
          relateId:this.record.id,
          type:'4', // 反馈数据类型，4商险待结算
        }
        httpAction(this.url.feedbackUrl, params, 'POST').then(res => {
          if (Number(res.code) === 200) {
            this.$message.success('已提交反馈')
            this.handleCancel()
            this.loadData()
          } else {
            this.handleCancel()
            this.$message.warning(res.msg)
          }
        })
      },
       // 反馈弹窗取消事件
      handleCancel() {
        this.record = {}
        this.confirmLoading = false
        this.feedbackLoading = false
        this.feedbackText = undefined
        this.feedbackVisible = false
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
