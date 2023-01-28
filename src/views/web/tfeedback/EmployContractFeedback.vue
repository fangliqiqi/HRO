<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        type="primary"
        icon="download"
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
      </a-table>
    </div>
    <dispatch-apply-export-modal
      ref="dispatchApplyExportModalForm"
      @ok="modalFormOk"
    ></dispatch-apply-export-modal>
  </a-card>
</template>
<script>
import Vue from 'vue'
import { areaMapTrees } from '@/api/api'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import DispatchApplyExportModal from '../tbusinessinsurance/modules/DispatchApplyExportModal' //导出明细
import ErrorModal from '../global/modules/ErrorModal'

export default {
  name: 'EmployContractFeedback',
  mixins: [JeecgListMixin],
  components:{
    ErrorModal,
    DispatchApplyExportModal
  },
  data() {
    return {
      description: '员工合同到期反馈',
      rebackReasonList: [], // 反馈原因字典
      employeeContractTypeOptions: [], // 合同类型
      areaMapTrees:[], // 省市区数据
      areaTrees: [],  // 地区
      columns: [
        {
          width: 165,
          ellipsis: true,
          title: '员工编码',
          align: 'center',
          dataIndex: 'empNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '员工姓名',
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
          dataIndex: 'empIdcard',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'departName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
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
          width: 200,
          ellipsis: true,
          title: '合同名称',
          align: 'center',
          dataIndex: 'contractName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 130,
          ellipsis: true,
          title: '合同编码',
          align: 'center',
          dataIndex: 'contractNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '合同类型',
          align: 'center',
          dataIndex: 'contractType',
          customRender:(text) => {
            const str = filterDictText(this.employeeContractTypeOptions,text) || '-'
            return <a-tooltip title={str}>{str}</a-tooltip>
          },
        },
        {
          width: 200,
          ellipsis: true,
          title: '合同起止时间',
          align: 'center',
          dataIndex: 'contractStart',
          customRender:(text, record) => {
            const str = `${text}~${record.contractEnd}`
            return <a-tooltip title={str}>{str}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '距离到期天数',
          align: 'center',
          dataIndex: 'diffDays',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 170,
          ellipsis: true,
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
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
        }
      ],
      url:{
        list:'/hrBase/temployeecontractinfo/handle/pageOverdue', // 列表数据
        exportField: '/hrBase/temployeecontractinfo/getExportFieldName', // 获取导出的中文字段
        exportUrl: '/hrBase/temployeecontractinfo/handle/warn/export', // 反馈导出
      }
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
  },
  methods:{
    initDictConfig() {
      initDictOptions('EMPLOYEE_CONTRACT_WARN_TYPE').then(res => {
        if (Number(res.code) === 200) {
          this.rebackReasonList = res.data
        }
      })
      // 员工合同类型
      initDictOptions('employee_contract_type').then((res) => {
        if (Number(res.code) === 200) {
          this.employeeContractTypeOptions = res.data
        }
      })
    },
    // 地区显示转换
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
    // 导出
    exportHandle(){
      this.$refs.dispatchApplyExportModalForm.title = '员工合同到期反馈导出'
      this.$refs.dispatchApplyExportModalForm.url.exportXlsUrl = this.url.exportUrl
      this.$refs.dispatchApplyExportModalForm.url.exportFields = this.url.exportField
      this.$refs.dispatchApplyExportModalForm.add(this.selectedRowKeys)
    }
  }
}
</script>
<style lang="less" scoped>
.ant-card-body .table-operator {
  margin-bottom: 18px;
  button {
    margin-right: 10px;
  }
}
</style>
