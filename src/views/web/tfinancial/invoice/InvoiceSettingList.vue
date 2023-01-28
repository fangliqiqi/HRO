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
            <a-form-item label="抬头名称">
              <a-input
                placeholder="请输入抬头名称"
                v-model="queryParam.ticketTableHead"
              ></a-input>
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
                v-model="queryParam.settleId"
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="单位">
              <select-page
                :id="'id'"
                :title="'customerName'"
                placeholder="请选择单位查询"
                v-model="queryParam.customerId"
                :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
              ></select-page>
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
        icon="plus"
        @click="handleAdd"
        v-has="'wxhr:tticketconfig_add'"
      >创建开票配置</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
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
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">详情</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tticketconfig_edit'"
          />
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:tticketconfig_edit'"
          >编辑</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tticketconfig_del'"
          />
          <a-popconfirm
            title="确定删除吗?"
            v-has="'wxhr:tticketconfig_del'"
            @confirm="() => handleDelete(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>

        <!-- 列缩放隐藏模板 -->
        <template
          v-for="(defineColumn, key) in defineColumns"
          :slot="key"
          slot-scope="text, record"
        >
          <span :key="key">
            <!-- 结算主体或者单位 -->
            <a-tooltip
              v-if="defineColumn.type=='settle'"
              placement="topLeft"
              :title="((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[defineColumn.key])) ? (defineColumn.options)[record[defineColumn.key]][defineColumn.name] : '-'"
            >
              {{ ((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[defineColumn.key])) ? (defineColumn.options)[record[defineColumn.key]][defineColumn.name] : '-' }}
            </a-tooltip>
            <!-- 字典数据 -->
            <a-tooltip
              v-else-if="defineColumn.type=='dict'"
              placement="topLeft"
              :title="filterDictText(defineColumn.options, record[key])"
            >
              {{ filterDictText(defineColumn.options, record[key]) }}
            </a-tooltip>
            <!-- 标签数据 -->
            <template
              v-else-if="defineColumn.type=='tag'"
              v-for="(item, tagKey) in defineColumn.options"
            >
              <a-tag
                :key="tagKey"
                v-if="record[key] == tagKey"
                :color="item.color"
              >{{ item.option }}</a-tag>
            </template>
            <!-- 取出定义数据数据 -->
            <template
              v-else-if="defineColumn.type=='define'"
              v-for="(item, defineKey) in defineColumn.options"
            >
              <span
                :key="defineKey"
                v-if="record[key] == defineKey"
              >
                <a-tooltip :title="item">
                  {{ item }}
                </a-tooltip>
              </span>
            </template>
            <!-- 普通数据 -->
            <a-tooltip
              v-else
              placement="topLeft"
              :title="record[key] ? record[key] : '-'"
            >
              {{ record[key] ? record[key] : '-' }}
            </a-tooltip>
          </span>
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <invoice-setting-add-modal
      ref="invoiceSettingAddModal"
      @ok="modalFormOk"
    ></invoice-setting-add-modal>
  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { getUnitSelectVos } from '@/api/api'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import InvoiceSettingAddModal from './modules/InvoiceSettingAddModal'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'InvoiceSettingList',
    mixins: [JeecgListMixin],
    components: {
      SelectPage,
      InvoiceSettingAddModal,
    },
    data() {
      return {
        description: '开票信息配置',
        // 枚举字段
        unitOptions: [], // 单位和结算主体
        filterDictText,
        goodsNameOptions: [], // 商品名称
        allSettleDomainOptions: [], // 所有结算主体
        taxClassificationOptions: [], // 税收分类
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        invKindOptions: {'0': '专用发票', '2': '普通发票', '51': '电子发票'}, // 发票类型
        defineColumns: {
          // 隐藏列字段数组
          settleName: {width: 180}, ticketTableHead: {width: 180}, goodsName: {width: 150},
          invKind: {width: 150, type: 'define', options: []}, classCode: {width: 150, type: 'dict', options: []},
          goodsTaxRate: {width: 80}, taxpayerIdentificationNo: {width: 170}, bankName: {width: 180},
          bankNo: {width: 150}, createTime: {width: 150}
        },
        // excel表头数据
        exportFields: [],
        // 表头
        columns: [
          {
            width: 180,
            ellipsis: true,
            title: '单位',
            align: 'center',
            dataIndex: 'customerId',
            customRender:(text)=>{
              const name = this.getUnitById(text)
              return <a-tooltip
                placement="topLeft"
                title={name}
              >{name}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleName',
            scopedSlots: { customRender: 'settleName' },
          },
          {
            width: 180,
            ellipsis: true,
            title: '抬头名称',
            align: 'center',
            dataIndex: 'ticketTableHead',
            scopedSlots: { customRender: 'ticketTableHead' },
          },
          {
            width: 150,
            ellipsis: true,
            title: '商品名称',
            align: 'center',
            dataIndex: 'goodsName',
            scopedSlots: { customRender: 'goodsName' },
          },
          {
            width: 150,
            ellipsis: true,
            title: '发票类型',
            align: 'center',
            dataIndex: 'invKind',
            scopedSlots: { customRender: 'invKind' },
          },
          {
            width: 150,
            ellipsis: true,
            title: '税收分类',
            align: 'center',
            dataIndex: 'classCode',
            scopedSlots: { customRender: 'classCode' },
          },
          {
            width: 80,
            ellipsis: true,
            title: '税率',
            align: 'center',
            dataIndex: 'goodsTaxRate',
            scopedSlots: { customRender: 'goodsTaxRate' },
          },
          {
            width: 170,
            ellipsis: true,
            title: '纳税人识别号',
            align: 'center',
            dataIndex: 'taxpayerIdentificationNo',
            scopedSlots: { customRender: 'taxpayerIdentificationNo' },
          },
          {
            width: 180,
            ellipsis: true,
            title: '开户行',
            align: 'center',
            dataIndex: 'bankName',
            scopedSlots: { customRender: 'bankName' },
          },
          {
            width: 150,
            ellipsis: true,
            title: '银行卡号',
            align: 'center',
            dataIndex: 'bankNo',
            scopedSlots: { customRender: 'bankNo' },
          },
          {
            width: 150,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            scopedSlots: { customRender: 'createTime' },
          },
          {
            width: 140,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrBase/tticketconfig/page',
          delete: 'hrBase/tticketconfig/',
          queryAllInfoById: 'hrBase/tticketconfig/', // 详情
        },
      }
    },
    created() {
      // 获取登录用户拥有结算主体权限的单位信息（包含结算主体）
      getUnitSelectVos().then((res) => {
        if (Number(res.code) === 200) {
          this.unitOptions = res.data
        } else {
          this.$message.error('单位信息数据请求失败！')
        }
      })
      // 赋值标签数据
      this.defineColumns.invKind.options = this.invKindOptions
    },
    methods: {
      getUnitById(id){
        let name = '-'
        for(const item of this.unitOptions){
          if(String(item.id) === String(id)){
            name = item.customerName
            break
          }
        }
        return name
      },
      // 新建
      handleAdd: function() {
        this.$refs.invoiceSettingAddModal.title = '开票信息配置新增'
        this.$refs.invoiceSettingAddModal.unitBelongs = this.unitOptions
        this.$refs.invoiceSettingAddModal.invKindOptions = this.invKindOptions
        this.$refs.invoiceSettingAddModal.goodsNameOptions = this.goodsNameOptions
        this.$refs.invoiceSettingAddModal.taxClassificationOptions = this.taxClassificationOptions

        if (this.unitOptions.length > 0 && this.goodsNameOptions.length > 0 && this.taxClassificationOptions.length > 0) {
          this.$refs.invoiceSettingAddModal.add()
        } else {
          if (this.unitOptions.length === 0) {
            this.$message.error(`"单位"${this.loadMessage}`)
            return false
          }

          if (this.goodsNameOptions.length === 0) {
            this.$message.error(`"商品名称"${this.loadMessage}`)
            return false
          }

          if (this.taxClassificationOptions.length === 0) {
            this.$message.error(`"税收分类"${this.loadMessage}`)
            return false
          }
        }
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.invoiceSettingAddModal.title = '开票信息配置详情'
        this.$refs.invoiceSettingAddModal.isDisabled = true
        this.$refs.invoiceSettingAddModal.unitBelongs = this.unitOptions
        this.$refs.invoiceSettingAddModal.invKindOptions = this.invKindOptions
        this.$refs.invoiceSettingAddModal.goodsNameOptions = this.goodsNameOptions
        this.$refs.invoiceSettingAddModal.taxClassificationOptions = this.taxClassificationOptions

        if (this.unitOptions.length > 0 && this.goodsNameOptions.length > 0 && this.taxClassificationOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.invoiceSettingAddModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.unitOptions.length === 0) {
            this.$message.error(`"单位"${this.loadMessage}`)
            return false
          }

          if (this.goodsNameOptions.length === 0) {
            this.$message.error(`"商品名称"${this.loadMessage}`)
            return false
          }

          if (this.taxClassificationOptions.length === 0) {
            this.$message.error(`"税收分类"${this.loadMessage}`)
            return false
          }
        }
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.invoiceSettingAddModal.title = '开票信息配置编辑'
        this.$refs.invoiceSettingAddModal.unitBelongs = this.unitOptions
        this.$refs.invoiceSettingAddModal.invKindOptions = this.invKindOptions
        this.$refs.invoiceSettingAddModal.goodsNameOptions = this.goodsNameOptions
        this.$refs.invoiceSettingAddModal.taxClassificationOptions = this.taxClassificationOptions

        if (this.unitOptions.length > 0 && this.goodsNameOptions.length > 0 && this.taxClassificationOptions.length > 0) {
          httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.invoiceSettingAddModal.edit(res.data)
            } else {
              this.$message.error('数据不完整！')
            }
          })
        } else {
          if (this.unitOptions.length === 0) {
            this.$message.error(`"单位"${this.loadMessage}`)
            return false
          }

          if (this.goodsNameOptions.length === 0) {
            this.$message.error(`"商品名称"${this.loadMessage}`)
            return false
          }

          if (this.taxClassificationOptions.length === 0) {
            this.$message.error(`"税收分类"${this.loadMessage}`)
            return false
          }
        }
      },
      // 数据字典
      initDictConfig() {
        // 商品名称
        initDictOptions('goods_name').then((res) => {
          if (Number(res.code) === 200) {
            this.goodsNameOptions = res.data
          }
        })
        // 税收分类
        initDictOptions('tax_classification').then((res) => {
          if (Number(res.code) === 200) {
            this.defineColumns.classCode.options = this.taxClassificationOptions = res.data
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

.ant-btn-danger {
  background-color: #ffffff;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}

.range-picker-new-style {
  :global(.ant-calendar-range-picker-input) {
    font-size: 13px;
  }
}

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
