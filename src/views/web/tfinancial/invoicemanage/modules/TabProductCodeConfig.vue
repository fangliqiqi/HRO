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
              label="公司名称"
              class="stepFormText">
              <a-select
                showSearch
                allowClear
                optionFilterProp="children"
                placeholder="请选择公司名称"
                v-model="queryParam.companyId"
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
              label="商品名称"
              class="stepFormText">
              <a-input
                allowClear
                placeholder="请输入商品名称"
                v-model="queryParam.productName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="分类汇总名称"
              class="stepFormText">
              <a-input
                allowClear
                placeholder="请输入分类汇总名称"
                v-model="queryParam.goodsName"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="商品编码"
                class="stepFormText">
                <a-input
                  allowClear
                  placeholder="请输入商品编码"
                  v-model="queryParam.code"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="税收分类编码"
                class="stepFormText">
                <a-input
                  allowClear
                  placeholder="请输入税收分类编码"
                  v-model="queryParam.goodsTaxNo"
                ></a-input>
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
    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        @click="handleCreateConfig"
      >导入商品编码配置</a-button>
    </div>
    <a-table
      size="middle"
      bordered
      rowKey="id"
      :scroll="{x: 1}"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange"
    >
    </a-table>
    <tab-product-code-config-modal
      ref="tabProductCodeConfigModal"
      @ok="modalFormOk"
    ></tab-product-code-config-modal>
    <invoice-config-detail-modal
      ref="invoiceConfigDetailModal"
      @ok="modalFormOk"
    ></invoice-config-detail-modal>
  </div>
</template>
<script>
import { filterObj } from '@/utils/util'
import { getAction, httpAction } from '@/api/manage'
import TabProductCodeConfigModal from './TabProductCodeConfigModal'
import InvoiceConfigDetailModal from './InvoiceConfigDetailModal'
export default {
  components: {
    TabProductCodeConfigModal,
    InvoiceConfigDetailModal
  },
  data() {
    return {
      dataSource: [], // 数据源
      loading: false,
      queryParam: {}, // 查询参数
      toggleSearchStatus: false,
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
          width: 180,
          ellipsis: true,
          title: '销售方公司名称',
          align: 'center',
          dataIndex: 'companyName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '商品名称',
          align: 'center',
          dataIndex: 'productName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '商品编码',
          align: 'center',
          dataIndex: 'code',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '税收分类名称',
          align: 'center',
          dataIndex: 'goodsTaxName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '商品分类汇总名称',
          align: 'center',
          dataIndex: 'goodsName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '税收分类编码',
          align: 'center',
          dataIndex: 'goodsTaxNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '规格型号',
          align: 'center',
          dataIndex: 'model',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 80,
          ellipsis: true,
          title: '计量单位',
          align: 'center',
          dataIndex: 'goodsUnit',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 80,
          ellipsis: true,
          title: '单价',
          align: 'center',
          dataIndex: 'price',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 90,
          ellipsis: true,
          title: '税率',
          align: 'center',
          dataIndex: 'tax',
          customRender: text => {
            const resultText = text || '0'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '享受优惠政策',
          align: 'center',
          dataIndex: 'favouredPolicy',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        }
      ],
      url: {
        list: '/salary/tgoodstaxnoset/page',
        detail: '/salary/tinvoiceaddressset/getById', // 详情
        statusChange: '/salary/tinvoiceaddressset/updateStatusById', // 禁用/启用
        hrCompanyList: '/salary/tinvoicecompanyset/getInvoiceCommpanySetList' // 公司列表
      }
    }
  },
  methods: {
    show() {
      this.getHRCompanyList()
      this.loadlistData(1)
    },
    // 获取公司列表数据
    getHRCompanyList() {
      httpAction(this.url.hrCompanyList, null, 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.companyList = res.data
        } else {
          this.$message.error(res.msg || '公司列表数据获取失败')
        }
      })
    },
    // 查询条件区域的展开折叠
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus
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
      this.$refs.tabProductCodeConfigModal.title = '商品编码配置'
      this.$refs.tabProductCodeConfigModal.show()
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
