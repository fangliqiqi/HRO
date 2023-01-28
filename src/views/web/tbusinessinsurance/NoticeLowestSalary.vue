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
                v-model="queryParam.employeeIdnum"
              ></a-input>
            </a-form-item>
          </a-col>
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
          <template v-if="toggleSearchStatus">
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
              <a-form-item label="结算月份">
                <j-month
                  :format="'YYYYMM'"
                  style="width: 100%"
                  v-model="queryParam.settleMonth"
                  placeholder="请选择结算月份"
                />
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
            @click="handleFeedback(records)"
            v-if="String(records.salaryMakeMan) === String(logedUserId)"
          >反馈</a>
          <span v-else>{{ '-' }}</span>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <dispatch-apply-export-modal
      ref="DispatchApplyExportModalForm"
      @ok="modalFormOk"
    ></dispatch-apply-export-modal>

    <a-modal
      title="反馈"
      :visible="feedbackVisible"
      :confirm-loading="confirmLoading"
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
import JMonth from '@/components/jeecg/JMonth'
import DispatchApplyExportModal from './modules/DispatchApplyExportModal' //导出明细
// import { getAllSettleDomainSelectVos } from '@/api/api'
import { mapGetters } from 'vuex'
import { httpAction } from '@/api/manage'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import SelectPage from '@/components/jeecg/SelectPage'

export default {
  name: 'NoticeLowestSalary',
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
    DispatchApplyExportModal,
    JMonth
  },
  data() {
    return {
      description: '最低工资列表',
      settleDomainOptions: [],
      rebackReasonList: [], // 反馈原因字典
      feedbackText: undefined, // 反馈原因
      feedbackVisible: false,
      confirmLoading: false,
      record: '', // 操作的记录
      businessDeveloper: '',
      // 表头
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
            return this.createdUser(text) || '-'
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
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 90,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/salary/sysmessagesalary/page', // 分页列表数据
        exportXlsUrl: '/salary/sysmessagesalary/export', // 导出
        exportFields: '/salary/sysmessagesalary/getExportFieldName', // 获取导出的中文字段
        feedback: '/salary/tfeedback/feedback', // 反馈
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
        if (element === Number(point)) {
          return this.businessDeveloper[index].nickname
        }
      }
      return ''
    },
    getAllBusinessDeveloper() {
      httpAction('/admin/user/getUserByRoleNameAndClient', '', 'GET').then(res => {
        if (Number(res.code) === 200) {
          this.businessDeveloper = res.data
        }
      })
    },
    // 数据字典
    initDictConfig() {
      initDictOptions('SYS_MESSAGE_SALARY_TYPE').then(res => {
        if (Number(res.code) === 200) {
          this.rebackReasonList = res.data
        }
      })
    },
    // 提交反馈
    handleOk() {
      this.confirmLoading = true
      if (!(this.feedbackText !== undefined && this.feedbackText.trim() !== '')) {
        this.$message.warning(`反馈不能为空`)
        this.confirmLoading = false
        return
      }
      const params = {
        reasonType:this.feedbackText ,
        relateId:this.record.id,
        type:'2', // 反馈数据类型，2最低工资类型
      }
      httpAction(this.url.feedback, params, 'POST').then(res => {
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
      this.confirmLoading = false
      this.feedbackVisible = false
      this.feedbackText = undefined
    },
    // 点击列表中反馈按钮
    handleFeedback(record) {
      this.record = record
      this.feedbackVisible = true
    },
    //导出
    exportHandle: function() {
      this.$refs.DispatchApplyExportModalForm.title = '最低工资提醒导出'
      this.$refs.DispatchApplyExportModalForm.url.exportXlsUrl = this.url.exportXlsUrl
      this.$refs.DispatchApplyExportModalForm.url.exportFields = this.url.exportFields
      this.$refs.DispatchApplyExportModalForm.params = this.getQueryParams() //查询条件
      this.$refs.DispatchApplyExportModalForm.add(this.selectedRowKeys)
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}
</style>
