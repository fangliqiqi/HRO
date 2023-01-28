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
              label="销售方名称"
              class="stepFormText"
            >
              <a-select
                showSearch
                allowClear
                optionFilterProp="children"
                placeholder="请选择销售方名称"
                v-model="queryParam.companyId"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in companyList"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.organName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="审核人"
              class="stepFormTexts"
            >
              <select-page
                :searchUrl="'admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                placeholder="请选择审核人"
                :id="'userId'"
                v-model="queryParam.invoiceCheckerId"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="复核人"
              class="stepFormText"
            >
              <a-input
                allowClear
                placeholder="请输入复核人"
                v-model="queryParam.invoiceReviewer"
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
    <div class="table-operator" v-has="'wxhr:tinvoicecompanyset_add'">
      <a-button
        type="primary"
        icon="plus"
        @click="handleCreateConfig"
      >创建销售方配置</a-button>
    </div>
    <a-table
      size="middle"
      bordered
      :scroll="{x: 1}"
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
          <a
            v-has="'wxhr:tinvoicecompanyset_edit'"
            @click="handleEditBtnClick(record)"
          >
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
          v-has="'wxhr:tinvoicecompanyset_edit'"
        >
          <a-switch
            checked-children="是"
            un-checked-children="否"
            :checked="Number(text)===0 ? true : false"
          />
        </a-popconfirm>
      </span>
    </a-table>
    <seller-invoice-config-modal
      ref="sellerInvoiceConfigModal"
      @ok="modalFormOk"
    ></seller-invoice-config-modal>
    <invoice-config-detail-modal
      ref="invoiceConfigDetailModal"
      @ok="modalFormOk"
    ></invoice-config-detail-modal>
  </div>
</template>
<script>
import { filterObj } from '@/utils/util'
import SellerInvoiceConfigModal from './SellerInvoiceConfigModal'
import { getAction, httpAction } from '@/api/manage'
import InvoiceConfigDetailModal from './InvoiceConfigDetailModal'
import SelectPage from '@/components/jeecg/SelectPage'

export default {
  components: {
    SellerInvoiceConfigModal,
    InvoiceConfigDetailModal,
    SelectPage
  },
  data() {
    return {
      dataSource: [], // 数据源
      loading: false,
      companyList: [], // 销售方名称列表
      // invoicePersonList: [], // 开票人员等列表数据
      queryParam: {}, // 查询参数
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
          width: 200,
          ellipsis: true,
          title: '销售方名称',
          align: 'center',
          dataIndex: 'company',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '纳税人识别号',
          align: 'center',
          dataIndex: 'taxNb',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '开户行',
          align: 'center',
          dataIndex: 'bank',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '银行卡号',
          align: 'center',
          dataIndex: 'bankNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '开票人',
          align: 'center',
          dataIndex: 'invoicePerson',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '审核人',
          align: 'center',
          dataIndex: 'invoiceChecker',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 130,
          ellipsis: true,
          title: '复核人',
          align: 'center',
          dataIndex: 'invoiceReviewer',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 100,
          ellipsis: true,
          title: '是否在用',
          align: 'center',
          fixed: 'right',
          dataIndex: 'status',
          scopedSlots: { customRender: 'inUse' }
        },
        {
          width: 120,
          title: '操作',
          align: 'center',
          fixed: 'right',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      url: {
        list: '/salary/tinvoicecompanyset/page',
        detail: '/salary/tinvoicecompanyset/getById', // 详情
        statusChange: '/salary/tinvoicecompanyset/updateStatusById', // 禁用/启用
        sellerCompanyList: '/admin/organizationinfo/getOrgForCus', // 销售方名称
        hrUserList: '/admin/user/getHrSysUserList' // HR人员列表
      }
    }
  },
  methods: {
    show() {
      this.getSellerCompanyList()
      // this.getHRUrserList()
      this.loadlistData(1)
    },
    // 销售方公司列表
    getSellerCompanyList() {
      httpAction(this.url.sellerCompanyList, null, 'GET').then(res => {
        if (Number(res.code) === 200) {
          this.companyList = res.data
        } else {
          this.$message.error(res.msg || '销售方公司列获取失败')
        }
      })
    },
    // 获取HR人员列表
    // getHRUrserList() {
    //   httpAction(this.url.hrUserList, null, 'GET').then(res => {
    //     if (Number(res.code) === 200) {
    //       this.invoicePersonList = res.data
    //     } else {
    //       this.$message.error(res.msg || '人员列表获取失败')
    //     }
    //   })
    // },
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
      this.$refs.sellerInvoiceConfigModal.title = '销售方开票信息配置'
      this.$refs.sellerInvoiceConfigModal.companyList = this.companyList
      // this.$refs.sellerInvoiceConfigModal.invoicePersonList = this.invoicePersonList
      this.$refs.sellerInvoiceConfigModal.show()
    },
    // 点击详情按钮
    handleDetailBtnClick(record) {
      // type:1:购买方 2：销售方 3：开票限额 4：公司开票打印地址 5：商品编码
      this.$refs.invoiceConfigDetailModal.title = '销售方开票信息详情'
      httpAction(`${this.url.detail}?id=${record.id}`, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.invoiceConfigDetailModal.dataInfo = res.data
          this.$refs.invoiceConfigDetailModal.show(2)
        } else {
          this.$message.error(res.msg || '数据不完整！')
        }
      })
    },
    // 购买方列表是否禁用
    handleBuyerInUseChange(record, rowIndex) {
      const openFlag = Number(record.status) === 0 ? 1 : 0 // 修改状态
      const url = `${this.url.statusChange}?id=${record.id}&status=${openFlag}`
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
      httpAction(`${this.url.detail}?id=${record.id}`, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.sellerInvoiceConfigModal.title = '编辑销售方开票信息配置'
          this.$refs.sellerInvoiceConfigModal.companyList = this.companyList
          // this.$refs.sellerInvoiceConfigModal.invoicePersonList = this.invoicePersonList
          this.$refs.sellerInvoiceConfigModal.edit(res.data)
        } else {
          this.$message.error(res.msg || '数据不完整！')
        }
      })
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

