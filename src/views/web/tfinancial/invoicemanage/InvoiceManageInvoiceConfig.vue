<template>
  <a-card :bordered="false">
    <a-tabs
      default-active-key="1"
      @change="configTabChanged"
    >
      <a-tab-pane
        key="1"
        tab="购买方"
      >
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col
                :md="6"
                :sm="8"
              >
                <a-form-item label="客户单位">
                  <select-page
                    :id="'id'"
                    :title="'customerName'"
                    placeholder="请选择客户单位"
                    v-model="queryParam.customerId"
                    :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
                  ></select-page>
                </a-form-item>
              </a-col>
              <a-col
                :md="6"
                :sm="8"
              >
                <a-form-item label="结算主体">
                  <select-page
                    :id="'departName'"
                    :title="'departName'"
                    placeholder="请选择结算主体查询"
                    v-model="queryParam.settleName"
                    :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                  ></select-page>
                </a-form-item>
              </a-col>
              <a-col
                :md="6"
                :sm="8"
              >
                <a-form-item label="购买方名称">
                  <a-input
                    placeholder="请输入购买方名称"
                    v-model="queryParam.ticketTableHead"
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
        <div class="table-operator" v-has="'wxhr:tticketconfig_add'">
          <a-button
            type="primary"
            icon="plus"
            @click="handleCreateConfig()"
          >创建购买方配置</a-button>
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
          @change="handleTableChange"
        >
          <template
            slot="operation"
            slot-scope="text, record"
          >
            <span>
              <a @click="handleDetailBtnClick(record)">详情</a>
              <a
                v-has="'wxhr:tticketconfig_edit'"
                @click="handleEditBtnClick(record)"
              >
                <a-divider type="vertical" />
                编辑
              </a>
              <a-popconfirm
                v-has="'wxhr:tticketconfig_del'"
                title="确定删除吗?"
                @confirm="handleDelete(record.id)"
              >
                <a-divider type="vertical" />
                <a>删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane
        key="2"
        tab="销售方"
        force-render
      >
        <tab-seller-config ref="tabSellerConfig"></tab-seller-config>
      </a-tab-pane>
      <a-tab-pane
        key="3"
        tab="开票限额"
        forceRender
      >
        <tab-invoice-limit-config ref="tabInvoiceLimitConfig"></tab-invoice-limit-config>
      </a-tab-pane>
      <a-tab-pane
        key="4"
        tab="公司开票打印地址"
        forceRender
      >
        <tab-printing-address-config ref="tabPrintingAddressConfig"></tab-printing-address-config>
      </a-tab-pane>
      <a-tab-pane
        key="5"
        tab="商品编码"
        forceRender
      >
        <tab-product-code-config ref="tabProductCodeConfig"></tab-product-code-config>
      </a-tab-pane>

    </a-tabs>
    <buyer-invoice-config-modal
      ref="buyerInvoiceConfigModal"
      @ok="modalFormOk"
    ></buyer-invoice-config-modal>
    <invoice-config-detail-modal
      ref="invoiceConfigDetailModal"
      @ok="modalFormOk"
    ></invoice-config-detail-modal>
  </a-card>
</template>

<script>
import { httpAction } from '@/api/manage'
import SelectPage from '@/components/jeecg/SelectPage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BuyerInvoiceConfigModal from './modules/BuyerInvoiceConfigModal'
import InvoiceConfigDetailModal from './modules/InvoiceConfigDetailModal'
import TabSellerConfig from './modules/TabSellerConfig'
import TabInvoiceLimitConfig from './modules/TabInvoiceLimitConfig'
import TabPrintingAddressConfig from './modules/TabPrintingAddressConfig'
import TabProductCodeConfig from './modules/TabProductCodeConfig'
import { getUnitSelectVos } from '@/api/api'

export default {
  name: 'InvoiceManageInvoiceConfig',
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
    TabSellerConfig,
    TabInvoiceLimitConfig,
    TabPrintingAddressConfig,
    TabProductCodeConfig,
    BuyerInvoiceConfigModal,
    InvoiceConfigDetailModal
  },
  data() {
    return {
      invKindType: { '0': '专用发票', '2': '普通发票', '51': '电子发票' }, // 发票类型
      unitBelongs: [], // 客户单位
      columns: [
        {
          width: 180,
          ellipsis: true,
          title: '客户单位',
          align: 'center',
          dataIndex: 'customerName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '名称',
          align: 'center',
          dataIndex: 'ticketTableHead',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '发票类型',
          align: 'center',
          dataIndex: 'invKind',
          customRender: text => {
            const tipTitle = this.invKindType[String(text)] || '-'
            return <a-tooltip title={tipTitle}>{tipTitle}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '纳税人识别号',
          align: 'center',
          dataIndex: 'taxpayerIdentificationNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '开户行',
          align: 'center',
          dataIndex: 'bankName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
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
          width: 150,
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
          title: '操作',
          align: 'center',
          fixed: 'right',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      clickedTabIndexList: [], // 存储所有点击过的tab Index，用于判断是否加载数据
      url: {
        list: 'hrBase/tticketconfig/page', // 购买方配置列表
        delete: 'hrBase/tticketconfig/', // 删除
        detail: 'hrBase/tticketconfig/' // 详情
      }
    }
  },
  created() {
    getUnitSelectVos().then(res => {
      if (Number(res.code) === 200) {
        this.unitBelongs = res.data
      } else {
        this.$message.error('单位信息数据请求失败！')
      }
    })
  },
  methods: {
    // 点击切换Tab
    configTabChanged(key) {
      switch (Number(key)) {
        case 1:
          break
        case 2:
          {
            // 销售方(第一次点击请求数据，再次点击不请求数据)
            if (this.clickedTabIndexList.indexOf(String(key)) === -1) {
              this.$refs.tabSellerConfig.show()
              this.clickedTabIndexList.push(String(key))
            }
          }
          break
        case 3:
          {
            // 开票限额(第一次点击请求数据，再次点击不请求数据)
            if (this.clickedTabIndexList.indexOf(String(key)) === -1) {
              this.$refs.tabInvoiceLimitConfig.show()
              this.clickedTabIndexList.push(String(key))
            }
          }
          break
        case 4:
          {
            // 打印地址(第一次点击请求数据，再次点击不请求数据)
            if (this.clickedTabIndexList.indexOf(String(key)) === -1) {
              this.$refs.tabPrintingAddressConfig.show()
              this.clickedTabIndexList.push(String(key))
            }
          }
          break
        case 5:
          {
            // 商品编码(第一次点击请求数据，再次点击不请求数据)
            if (this.clickedTabIndexList.indexOf(String(key)) === -1) {
              this.$refs.tabProductCodeConfig.show()
              this.clickedTabIndexList.push(String(key))
            }
          }
          break
      }
    },
    // 点击详情按钮
    handleDetailBtnClick(record) {
      // type:1:购买方 2：销售方 3：开票限额 4：公司开票打印地址 5：商品编码
      this.$refs.invoiceConfigDetailModal.title = '购买方开票信息详情'
      this.$refs.invoiceConfigDetailModal.invKindType = this.invKindType
      httpAction(this.url.detail + record.id, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          res.data.settleName = record.settleName
          this.$refs.invoiceConfigDetailModal.dataInfo = res.data
          this.$refs.invoiceConfigDetailModal.show(1)
        } else {
          this.$message.error('数据不完整！')
        }
      })
    },
    // 编辑按钮点击事件
    handleEditBtnClick(record) {
      httpAction(this.url.detail + record.id, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.buyerInvoiceConfigModal.title = '编辑购买方开票信息配置'
          this.$refs.buyerInvoiceConfigModal.unitBelongs = this.unitBelongs
          this.$refs.buyerInvoiceConfigModal.edit(record)
        } else {
          this.$message.error('数据不完整！')
        }
      })
    },
    // 点击创建购买方配置
    handleCreateConfig() {
      this.$refs.buyerInvoiceConfigModal.title = '购买方开票信息配置'
      this.$refs.buyerInvoiceConfigModal.unitBelongs = this.unitBelongs
      this.$refs.buyerInvoiceConfigModal.show()
    }
  }
}
</script>

<style lang="less" scoped>
.ant-btn {
  margin-left: 8px;
}

.ant-card-body .table-operator {
  margin-bottom: 18px;
}
</style>
