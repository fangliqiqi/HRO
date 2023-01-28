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
            <a-form-item label="客户名称">
              <select-page
                :id="'customerName'"
                :title="'customerName'"
                placeholder="请选择客户单位"
                v-model="queryParam.unitName"
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
                :id="'id'"
                :title="'departName'"
                placeholder="请选择结算主体查询"
                v-model="queryParam.settleDomainId"
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体编码">
              <a-input
                placeholder="请输入结算主体编码"
                v-model="queryParam.settleDomainNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
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
                  placeholder="请选择开票类型查询"
                  v-model="queryParam.invoiceType"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in invoiceTypeOptions"
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
              <a-form-item
                label="申请状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择申请状态查询"
                  v-model="queryParam.auditFlag"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in auditFlagOptions"
                    :key="key"
                    :value="key"
                  >{{ value.option }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="申请人员"
                class="stepFormText"
              >
                <select-page
                  :searchUrl="'admin/user/page/wxhr?nickname='"
                  :title="'nickname'"
                  placeholder="请选择申请人员查询"
                  :id="'userId'"
                  v-model="queryParam.createUser"
                ></select-page>
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
    </a-table>
    <invoice-audit-modal
      ref="detailModalForm"
      @ok="modalFormOk"
    ></invoice-audit-modal>
  </a-card>
</template>
<script>
import { httpAction } from '@/api/manage'
import { getUnitSelectVos } from '@/api/api'
import SelectPage from '@/components/jeecg/SelectPage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import InvoiceAuditModal from './modules/InvoiceAuditModal'

export default {
  name: 'InvoiceManageQuery',
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
    InvoiceAuditModal
  },
  created() {
    // 获取登录用户拥有结算主体权限的单位信息（包含结算主体）
    getUnitSelectVos().then(res => {
      if (Number(res.code) === 200) {
        this.unitOptions = res.data
      } else {
        this.$message.error('单位信息数据请求失败！')
      }
    })
    // 申请人员数据
    // httpAction('/admin/user/userDic', '', 'GET').then(res => {
    //   if (Number(res.code) === 200) {
    //     this.employData = res.data
    //   } else {
    //     this.$message.error('申请人员数据请求失败！')
    //   }
    // })
  },
  data() {
    return {
      description: '开票查询',
      employData: [], // 申请人员
      unitOptions: [], // 单位和结算主体
      invoiceTypeOptions: { '0': '结算开票', '1': '预开票' }, // 开票类型
      auditFlagOptions: {
        '0': { option: '待提交', color: 'blue' },
        '1': { option: '待审核', color: 'orange' },
        '2': { option: '待开票', color: 'purple' },
        '3': { option: '财务退回', color: 'red' },
        '4': { option: '已开票', color: 'green' },
        '5': { option: '已作废', color: 'pink' },
        '6': { option: '部分开票', color: 'orange' }
      }, // 审核状态
      columns: [
        {
          width: 120,
          ellipsis: true,
          title: '申请开票金额',
          align: 'center',
          dataIndex: 'invoiceMoney',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 170,
          ellipsis: true,
          title: '客户名称',
          align: 'center',
          dataIndex: 'unitName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '客户编码',
          align: 'center',
          dataIndex: 'unitNo',
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
          dataIndex: 'settleDomainName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'settleDomainNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 100,
          ellipsis: true,
          title: '申请人员',
          align: 'center',
          dataIndex: 'createUserName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 100,
          ellipsis: true,
          title: '开票类型',
          align: 'center',
          dataIndex: 'invoiceType',
          customRender: text => {
            const resultText = this.invoiceTypeOptions[String(text)] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 110,
          ellipsis: true,
          title: '申请状态',
          align: 'center',
          dataIndex: 'auditFlag',
          customRender: text => {
            const optionItem = this.auditFlagOptions[String(text)] || '-'
            return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
          }
        },
        {
          width: 170,
          ellipsis: true,
          title: '申请时间',
          align: 'center',
          dataIndex: 'applyDate',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 80,
          ellipsis: true,
          title: '操作',
          key: 'operations',
          align: 'center',
          fixed: 'right',
          customRender: (_, record) => {
            return <a onClick={() => this.handleDetailBtnClick(record)}>详情</a>
          }
        }
      ],
      url: {
        list: 'salary/tinvoice/getAllPage',
        queryAllInfoById: 'salary/tinvoice/openTInvoiceAssoById?id=', // 详情
        auditProcessUrl: 'salary/tinvoiceprocessinfo/getInfoById/' // 流程进展明细
      }
    }
  },
  methods: {
    // 点击查看详情
    handleDetailBtnClick(record) {
      httpAction(this.url.queryAllInfoById + record.id, null, 'get').then(res => {
        if (res.code === 200) {
          this.$refs.detailModalForm.isAudit = false
          this.$refs.detailModalForm.title = `开票详情-${this.auditFlagOptions[record.auditFlag]['option']}`
          this.$refs.detailModalForm.show(res.data)
        }else{
          this.$message.error(res.msg || '详情获取失败！')
        }
      })
    }
  }
}
</script>
