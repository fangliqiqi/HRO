<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="开票单位"
              class="stepFormText"
            >
              <a-select
                showSearch
                allowClear
                optionFilterProp="children"
                placeholder="请选择开票单位"
                v-model="queryParam.invoiceUnitId"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in companyList"
                  :key="index"
                  :value="String(item.companyId)"
                >{{ item.company }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="开票类型"
              class="stepFormText"
            >
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="请选择开票类型"
                v-model="queryParam.type"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(value, key) in invKindType"
                  :key="key"
                  :value="key"
                >{{ value }}</a-select-option>
              </a-select>
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
    <div class="table-operator" v-has="'wxhr:tinvoicelimitset_add'">
      <a-button
        type="primary"
        icon="plus"
        @click="handleCreateConfig"
      >创建开票限额配置</a-button>
    </div>
    <a-table
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template
        slot="operation"
        slot-scope="text, record"
      >
        <span>
          <a @click="handleDetailBtnClick(record)">详情</a>
          <a v-has="'wxhr:tinvoicelimitset_edit'" @click="handleEditBtnClick(record)">
            <a-divider type="vertical" />编辑</a>
        </span>
      </template>
      <!-- 是否已禁用 -->
      <span
        slot="inUse"
        slot-scope="text, record, rowIndex"
      >
        <a-popconfirm
          title="确定操作吗?"
          @confirm="() => handleBuyerInUseChange(record,rowIndex)"
        >
          <a-switch
            checked-children="是"
            un-checked-children="否"
            :checked="Number(text)===0 ? true : false"
          />
        </a-popconfirm>
      </span>
    </a-table>
    <tab-invoice-limit-config-modal
      ref="tabInvoiceLimitConfigModal"
      @ok="modalFormOk"
    ></tab-invoice-limit-config-modal>
    <invoice-config-detail-modal
      ref="invoiceConfigDetailModal"
      @ok="modalFormOk"
    ></invoice-config-detail-modal>
  </div>
</template>
<script>
import { filterObj } from '@/utils/util'
import { getAction, httpAction } from '@/api/manage'
import InvoiceConfigDetailModal from './InvoiceConfigDetailModal'
import TabInvoiceLimitConfigModal from './TabInvoiceLimitConfigModal'
export default {
  components: {
    InvoiceConfigDetailModal,
    TabInvoiceLimitConfigModal
  },
  data() {
    return {
      dataSource: [], // 数据源
      invKindType: { '0': '专用发票', '2': '普通发票', '51': '电子发票' }, // 发票类型
      loading: false,
      queryParam: {}, // 查询参数
      companyList: [], // 公司列表
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showSizeChanger: true,
        total: 0
      },
      // 销售方表头
      columns: [
        {
          ellipsis: true,
          title: '开票类型',
          align: 'center',
          dataIndex: 'type',
          customRender: text => {
            const tipTitle = this.invKindType[String(text)] || '-'
            return <a-tooltip title={tipTitle}>{tipTitle}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '开票单位',
          align: 'center',
          dataIndex: 'invoiceUnit',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '专票限额',
          align: 'center',
          dataIndex: 'specialTicketLimit',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '普票限额',
          align: 'center',
          dataIndex: 'generalTicketLimit',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 80,
          ellipsis: true,
          title: '是否在用',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'inUse' }
        },
        {
          width: 120,
          title: '操作',
          align: 'center',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
        }
      ],
      url: {
        list: '/salary/tinvoicelimitset/page',
        detail: '/salary/tinvoicelimitset/getById', // 详情
        statusChange: '/salary/tinvoicelimitset/updateStatusById', // 禁用/启用
        hrCompanyList: '/salary/tinvoicecompanyset/getInvoiceCommpanySetList' // 公司列表
      }
    }
  },
  methods: {
    show() {
      this.getHRCompanyList()
      this.loadlistData(1)
    },
    // 获取公司列表
    getHRCompanyList() {
      httpAction(this.url.hrCompanyList, null, 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.companyList = res.data
        } else {
          this.$message.error(res.msg || '公司列表数据获取失败')
        }
      })
    },
    // 点击查询按钮
    searchQuery() {
      this.loadlistData(1)
    },
    // 点击重置
    searchReset() {
      this.queryParam = {}
      this.loadlistData(1)
    },
    // 获取查询参数
    getQueryParams() {
      //获取查询条件
      const param = Object.assign({}, this.queryParam)
      param.current = this.ipagination.current
      param.size = this.ipagination.pageSize
      return filterObj(param)
    },
    // 加载列表数据
    loadlistData(currentPage) {
      if (currentPage === 1) {
        this.ipagination.current = 1
      }
      const param = this.getQueryParams()
      const that = this
      that.loading = true
      getAction(this.url.list, param).then(res => {
        if (Number(res.code) === 200) {
          that.dataSource = res.data.records
          that.ipagination.current = res.data.current
          that.ipagination.total = res.data.total
        } else {
          that.ipagination.total = 0
          that.$message.error('获取数据失败！')
        }
        that.loading = false
      })
    },
    // 新增/修改 成功时，重载列表
    modalFormOk() {
      this.loading = true
      this.loadlistData()
    },
    //分页、排序、筛选变化时触发
    handleTableChange(pagination) {
      this.ipagination = pagination
      this.loadlistData()
    },
    // 点击创建配置
    handleCreateConfig() {
      this.$refs.tabInvoiceLimitConfigModal.title = '新建开票限额配置'
      this.$refs.tabInvoiceLimitConfigModal.companyList = this.companyList
      this.$refs.tabInvoiceLimitConfigModal.show()
    },
    // 点击详情按钮
    handleDetailBtnClick(record) {
      // type:1:购买方 2：销售方 3：开票限额 4：公司开票打印地址 5：商品编码
      this.$refs.invoiceConfigDetailModal.title = '开票限额配置详情'
      this.$refs.invoiceConfigDetailModal.invKindType = this.invKindType
      httpAction(`${this.url.detail}?id=${record.id}`, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.invoiceConfigDetailModal.dataInfo = res.data
          this.$refs.invoiceConfigDetailModal.show(3)
        } else {
          this.$message.error('数据不完整！')
        }
      })
    },
    // 配置是否禁用
    handleBuyerInUseChange(record, rowIndex) {
      const openFlag = Number(record.status) === 0 ? 1 : 0 // 修改状态
      const url = `${this.url.statusChange}?id=${record.id}&&status=${openFlag}`
      httpAction(url, '', 'POST').then(res => {
        if (Number(res.code) === 200) {
          this.$set(this.dataSource[rowIndex], 'status', openFlag)
          this.$message.success('状态修改成功！')
        } else {
          this.$message.error(res.msg || '操作失败,请稍后重试！')
        }
      })
    },
    // 编辑按钮点击事件
    handleEditBtnClick(record) {
      this.$refs.tabInvoiceLimitConfigModal.title = '编辑开票限额配置'
      this.$refs.tabInvoiceLimitConfigModal.companyList = this.companyList
      this.$refs.tabInvoiceLimitConfigModal.edit(record)
    }
  }
}
</script>
<style lang="less" scoped>
.ant-btn {
  margin-left: 3px;
}
.ant-card-body .table-operator {
  margin-bottom: 18px;
}
.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
