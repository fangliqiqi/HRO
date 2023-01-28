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
                allowClear
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
                allowClear
                placeholder="请输入身份证号"
                v-model="queryParam.employeeIdnum"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算月份">
              <j-month
                :format="'YYYYMM'"
                style="width: 100%"
                v-model="queryParam.settleMonth"
                placeholder="请选择结算月份"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="工资月份">
                <j-month
                  :format="'YYYYMM'"
                  style="width: 100%"
                  v-model="queryParam.salaryMonth"
                  placeholder="请选择工资月份"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体">
                <select-page
                  :id="'id'"
                  :title="'departName'"
                  placeholder="请选择结算主体查询"
                  v-model="queryParam.departId"
                  :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="单位名称">
                <a-input
                  allowClear
                  placeholder="请输入单位名称"
                  v-model="queryParam.customerName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="部门编码">
                <a-input
                  allowClear
                  placeholder="请输入部门编码"
                  v-model="queryParam.departNo"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="上传人">
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="上传人"
                  v-model="queryParam.salaryMakeMan"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in businessDeveloper"
                    :key="key"
                    :value="value.user_id"
                  >{{ value.nickname }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="反馈原因">
                <a-select
                  allowClear
                  optionFilterProp="children"
                  placeholder="请选择反馈原因"
                  v-model="queryParam.reasonType"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item, index) in rebackReasonList"
                    :key="index"
                    :value="item.value"
                  >{{ item.label }}</a-select-option>
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
        icon="download"
        @click="exportHandle"
      >导出</a-button>
      <a-button
        type="primary"
        icon="download"
        :loading="confirmLoading"
        @click="tempPersonExport"
      >临时人员导出</a-button>
      <a-button
        type="primary"
        :disabled="!selectedRowKeys.length"
        @click="batchIgnoreClick"
      >批量忽略</a-button>
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
    <!-- 表单区域 -->
    <dispatch-apply-export-modal
      ref="dispatchApplyExportModalForm"
      @ok="modalFormOk"
    ></dispatch-apply-export-modal>
    <error-modal
      ref="errorModal"
      @ok="errorModalFormOk"></error-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import JMonth from '@/components/jeecg/JMonth'
import DispatchApplyExportModal from '../tbusinessinsurance/modules/DispatchApplyExportModal' //导出明细
// import { getAllSettleDomainSelectVos } from '@/api/api'
import { mapGetters } from 'vuex'
import { httpAction } from '@/api/manage'
import SelectPage from '@/components/jeecg/SelectPage'
import ErrorModal from '../global/modules/ErrorModal'

export default {
  name: 'LowestSalaryFeedback',
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
    JMonth,
    ErrorModal,
    DispatchApplyExportModal
  },
  data() {
    return {
      description: '最低工资提醒反馈',
      settleDomainOptions: [], // 结算主体列表
      rebackReasonList: [], // 反馈原因字典
      confirmLoading: false, // 按钮加载动画
      businessDeveloper: [],
      columns: [
        {
          width: 150,
          ellipsis: true,
          title: '姓名',
          align: 'center',
          dataIndex: 'employeeName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 220,
          ellipsis: true,
          title: '身份证号',
          align: 'center',
          dataIndex: 'employeeIdnum',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 250,
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
          title: '部门编码',
          align: 'center',
          dataIndex: 'departNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '单位名称',
          align: 'center',
          dataIndex: 'customerName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '实发工资',
          align: 'center',
          dataIndex: 'actualSalary',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '最低工资标准',
          align: 'center',
          dataIndex: 'salaryBase',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '工资月份',
          align: 'center',
          dataIndex: 'salaryMonth',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
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
          width: 150,
          ellipsis: true,
          title: '上传人',
          align: 'center',
          dataIndex: 'salaryMakeMan',
          customRender: text => {
            return this.createdUser(text)
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
      url: {
        list: '/salary/sysmessagesalary/handle/page', // 列表数据
        exportField: '/salary/sysmessagesalary/getHandleExportFieldName', // 获取反馈审核导出的中文字段
        exportUrl: '/salary/sysmessagesalary/handle/export', // 反馈审核人员导出
        tempExportUrl: '/salary/sysmessagesalary/temp/export', // 临时人员导出
        tempExportField: '/salary/sysmessagesalary/getTempExportFieldName', // 获取临时人员导出的中文字段
        batchIgnorUrl: '/salary/tfeedback/ignore' // 批量忽略
      }
    }
  },
  created() {
    // 结算主体和所属单位
    // getAllSettleDomainSelectVos().then(res => {
    //   if (res.code === 200) {
    //     this.settleDomainOptions = res.data
    //   } else {
    //     this.$message.error('结算主体和所属单位数据请求失败！')
    //   }
    // })
    this.getAllBusinessDeveloper()
  },
  computed: {
    logedUserId: function() {
      return this.userInfo().id
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    createdUser: function(point) {
      for (let index = 0; index < this.businessDeveloper.length; index++) {
        const element = this.businessDeveloper[index]['user_id']
        if (Number(element) === Number(point)) {
          return this.businessDeveloper[index].nickname
        }
      }
      return ''
    },
    initDictConfig() {
      initDictOptions('SYS_MESSAGE_SALARY_TYPE').then(res => {
        if (Number(res.code) === 200) {
          this.rebackReasonList = res.data
        }
      })
    },
    getAllBusinessDeveloper() {
      httpAction('/admin/user/getUserByRoleNameAndClient', '', 'GET').then(res => {
        if (res.code === 200) {
          this.businessDeveloper = res.data
        }
      })
    },
    //导出
    exportHandle: function() {
      const parameters = this.getQueryParams()
      if (!parameters.settleMonth) {
        this.$message.warn('请先选择结算月份！')
        return
      }
      this.$refs.dispatchApplyExportModalForm.title = '最低工资提醒反馈审核导出'
      this.$refs.dispatchApplyExportModalForm.url.exportXlsUrl = this.url.exportUrl
      this.$refs.dispatchApplyExportModalForm.url.exportFields = this.url.exportField
      this.$refs.dispatchApplyExportModalForm.params = this.getQueryParams() //查询条件
      this.$refs.dispatchApplyExportModalForm.add(this.selectedRowKeys)
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 临时人员导出
    tempPersonExport() {
      const parameters = this.getQueryParams()
      if (!parameters.settleMonth) {
        this.$message.warn('请先选择结算月份！')
        return
      }
      this.$refs.dispatchApplyExportModalForm.title = '临时人员导出'
      this.$refs.dispatchApplyExportModalForm.url.exportXlsUrl = this.url.tempExportUrl
      this.$refs.dispatchApplyExportModalForm.url.exportFields = this.url.tempExportField
      this.$refs.dispatchApplyExportModalForm.params = this.getQueryParams() //查询条件
      this.$refs.dispatchApplyExportModalForm.add(this.selectedRowKeys)
    },
    // 批量忽略
    batchIgnoreClick() {
      const feedBackList = []
      this.selectedRowKeys.map(recordId => {
        feedBackList.push({ relateId: recordId, type: '2' })
      })
      const that = this
      const modal = that.$confirm({
        title: '确认忽略选中项吗？',
        okButtonProps: {
          props: { loading: that.loading }
        },
        async onOk() {
          that.loading = !that.loading
          modal.update({
            okButtonProps: {
              props: { loading: that.loading }
            }
          })
          const res = await httpAction(that.url.batchIgnorUrl, feedBackList, 'POST')
          if (Number(res.code) === 200) {
            const msg = res.message || res.msg
            if (res.errorMessageList != null && res.errorMessageList.length > 0) {
              that.$refs.errorModal.title = `忽略提示: ${msg}`
              that.$refs.errorModal.message = msg
              that.$refs.errorModal.showModal(res.errorMessageList)
            } else {
              that.$message.success('已忽略')
              that.loadData()
            }
          } else {
            that.$message.warning(res.msg)
          }
          that.loading = false
        }
      })
    },
    // 出错弹出窗回调
    errorModalFormOk(){
      this.selectedRowKeys = []
      this.loadData()
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
