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
            <a-form-item label="客户编码">
              <a-input
                placeholder="请输入客户编码"
                v-model="queryParam.unitNo"
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
                label="开票端口"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="选择省份"
                  v-model="queryParam.province"
                  style="width: 32%"
                  @change="handleProvinceChange"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item, index) in areaTrees"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="选择城市"
                  v-model="queryParam.city"
                  style="margin-left: 2%; width: 32%"
                  @change="handleCityChange"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item, index) in areaCitys"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="选择区县"
                  v-model="queryParam.town"
                  style="margin-left: 2%; width: 32%"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item, index) in areaTowns"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
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
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择申请人员查询"
                  v-model="queryParam.createUser"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in employData"
                    :key="key"
                    :value="key"
                  >{{ value }}</a-select-option>
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
          <a
            v-if="record.auditFlag==1"
            @click="handleInvoice(record)"
            v-has="'wxhr:tinvoice_audit'"
          >审核</a>
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

        <!-- 申请开票金额 -->
        <span
          slot="invoiceMoney"
          slot-scope="text"
        >
          <a-tooltip
            placement="topLeft"
            :title="text ? text.toLocaleString() : '0'"
          >
            {{ text ? text.toLocaleString() : '0' }}
          </a-tooltip>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <invoice-apply-add-modal
      ref="invoiceApplyAddModal"
      @ok="modalFormOk"
    ></invoice-apply-add-modal>
    <invoice-apply-detail-modal
      ref="invoiceApplyDetailModal"
      @ok="modalFormOk"
    ></invoice-apply-detail-modal>
    <invoice-forward-apply-add-modal
      ref="invoiceForwardApplyAddModal"
      @ok="modalFormOk"
    ></invoice-forward-apply-add-modal>
    <invoice-forward-apply-detail-modal
      ref="invoiceForwardApplyDetailModal"
      @ok="modalFormOk"
    ></invoice-forward-apply-detail-modal>
  </a-card>
</template>

<script>
  import Vue from 'vue'
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getUnitSelectVos, areaMapTrees } from '@/api/api'
  import InvoiceApplyAddModal from './modules/InvoiceApplyAddModal'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import InvoiceApplyDetailModal from './modules/InvoiceApplyDetailModal'
  import InvoiceForwardApplyAddModal from './modules/InvoiceForwardApplyAddModal'
  import InvoiceForwardApplyDetailModal from './modules/InvoiceForwardApplyDetailModal'

  export default {
    name: 'InvoiceAuditList',
    mixins: [JeecgListMixin],
    components: {
      SelectPage,
      InvoiceApplyAddModal,
      InvoiceApplyDetailModal,
      InvoiceForwardApplyAddModal,
      InvoiceForwardApplyDetailModal,
    },
    data() {
      return {
        description: '开票审核',
        // 枚举字段
        employData: [], // 申请人员
        areaTrees: [],  // 地区
        areaMapTrees:[],
        areaCitys: [],  // 城市
        areaTowns: [],  // 区县
        unitOptions: [], // 单位和结算主体
        goodsNameOptions: [], // 商品名称
        taxClassificationOptions: [], // 税收分类
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        invKindOptions: {'0': '专用发票', '2': '普通发票', '51': '电子发票'}, // 发票类型
        auditFlagOptions: {
          '0': {'option': '待提交', 'color': 'blue'},
          '1': {'option': '待审核', 'color': 'cyan'},
          '2': {'option': '审核通过', 'color': 'purple'},
          '3': {'option': '审核未通过', 'color': 'red'},
          '4': {'option': '已开票', 'color': 'green'}
        },
        invoiceTypeOptions: {'0': '结算开票', '1': '预开票'}, // 开票类型
        defineColumns: {
          // 隐藏列字段数组
          unitName: {width: 150}, unitNo: {width: 100}, settleDomainName: {width: 150},
          settleDomainNo: {width: 120}, createUserName: {width: 80}, invoiceType: {width: 80, type: 'define', options: []},
          auditFlag: {width: 80, type: 'tag', options: []}, applyDate: {width: 140},headerName: {width: 120},
          taxIdentificationNum: {width: 120}, address: {width: 120}, tel: {width: 120},bankName: {width: 120}, bankNo: {width: 120},
        },
        // excel表头数据
        exportFields: [],
        // 表头
        columns: [
          {
            width: 120,
            ellipsis: true,
            title: '申请开票金额',
            align: 'center',
            dataIndex: 'invoiceMoney',
            scopedSlots: { customRender: 'invoiceMoney' },
          },
          {
            width: 170,
            ellipsis: true,
            title: '客户名称',
            align: 'center',
            dataIndex: 'unitName',
            scopedSlots: { customRender: 'unitName' },
          },
          {
            width: 120,
            ellipsis: true,
            title: '客户编码',
            align: 'center',
            dataIndex: 'unitNo',
            scopedSlots: { customRender: 'unitNo' },
          },
          {
            width: 120,
            ellipsis: true,
            title: '抬头名称',
            align: 'center',
            dataIndex: 'headerName',
            scopedSlots: { customRender: 'headerName' },
          },
          {
            width: 120,
            ellipsis: true,
            title: '纳税人识别号',
            align: 'center',
            dataIndex: 'taxIdentificationNum',
            scopedSlots: { customRender: 'taxIdentificationNum' },
          },
          // {
          //   width: 120,
          //   ellipsis: true,
          //   title: '地址',
          //   align: 'center',
          //   dataIndex: 'address',
          //   scopedSlots: { customRender: 'address' },
          // },
          // {
          //   width: 120,
          //   ellipsis: true,
          //   title: '电话',
          //   align: 'center',
          //   dataIndex: 'tel',
          //   scopedSlots: { customRender: 'tel' },
          // },
          {
            width: 120,
            ellipsis: true,
            title: '开户行',
            align: 'center',
            dataIndex: 'bankName',
            scopedSlots: { customRender: 'bankName' },
          },
          {
            width: 120,
            ellipsis: true,
            title: '银行卡号',
            align: 'center',
            dataIndex: 'bankNo',
            scopedSlots: { customRender: 'bankNo' },
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDomainName',
            scopedSlots: { customRender: 'settleDomainName' },
          },
          {
            width: 150,
            ellipsis: true,
            title: '结算主体编码',
            align: 'center',
            dataIndex: 'settleDomainNo',
            scopedSlots: { customRender: 'settleDomainNo' },
          },
          {
            width: 100,
            ellipsis: true,
            title: '申请人员',
            align: 'center',
            dataIndex: 'createUserName',
            scopedSlots: { customRender: 'createUserName' },
          },
          {
            width: 100,
            ellipsis: true,
            title: '开票类型',
            align: 'center',
            dataIndex: 'invoiceType',
            scopedSlots: { customRender: 'invoiceType' },
          },
          {
            width: 160,
            ellipsis: true,
            title: '开票端口',
            align: 'center',
            dataIndex: 'province',
            customRender:(text, record) => {
              const str = this.getAreaMapName(record.province, record.city, record.town)
              const strShow = str ? str : '-'
              return <a-tooltip placement="topLeft" title={strShow}>{strShow}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '申请状态',
            align: 'center',
            dataIndex: 'auditFlag',
            scopedSlots: { customRender: 'auditFlag' },
          },
          {
            width: 150,
            ellipsis: true,
            title: '申请时间',
            align: 'center',
            dataIndex: 'applyDate',
            scopedSlots: { customRender: 'applyDate' },
          },
          {
            width: 80,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'salary/tinvoice/getAuditPage?auditFlag=1',
          queryAllInfoById: 'salary/tinvoice/openTInvoiceById', // 详情
          auditProcessUrl: 'salary/tinvoiceprocessinfo/getInfoById/',  // 流程进展明细
        },
      }
    },
    created() {
      // 地区
      this.areaTrees = Vue.ls.get('glob_area')
      areaMapTrees().then((res)=>{
        if(Number(res.code) === 200) {
          this.areaMapTrees = res.data
        }
      })
      // 申请人员数据
      httpAction('/admin/user/userDic', '', 'GET').then((res) => {
        if (Number(res.code) === 200) {
          this.employData = res.data
        } else {
          this.$message.error('申请人员数据请求失败！')
        }
      })
      // 获取登录用户拥有结算主体权限的单位信息（包含结算主体）
      getUnitSelectVos().then((res) => {
        if (Number(res.code) === 200) {
          this.unitOptions = res.data
        } else {
          this.$message.error('单位信息数据请求失败！')
        }
      })
      // 赋值标签数据
      this.defineColumns.invoiceType.options = this.invoiceTypeOptions
      this.defineColumns.auditFlag.options = this.auditFlagOptions
    },
    methods: {
      // 审核
      handleInvoice: function(record) {
        if (String(record.invoiceType) === '0') {  // 结算开票
          httpAction(`${this.url.queryAllInfoById}?id=${record.id}`, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.invoiceApplyDetailModal.title = '开票申请详情'
              this.$refs.invoiceApplyDetailModal.addConfirmButton = false
              this.$refs.invoiceApplyDetailModal.addReleaseButton = false
              this.$refs.invoiceApplyDetailModal.backButton = true
              this.$refs.invoiceApplyDetailModal.invoiceButton = true
              this.$refs.invoiceApplyDetailModal.unitBelongs = this.unitOptions
              this.$refs.invoiceApplyDetailModal.invKindOptions = this.invKindOptions
              this.$refs.invoiceApplyDetailModal.invoiceTypeOptions = this.invoiceTypeOptions
              this.$refs.invoiceApplyDetailModal.goodsNameOptions = this.goodsNameOptions
              this.$refs.invoiceApplyDetailModal.taxClassificationOptions = this.taxClassificationOptions
              if (this.unitOptions.length > 0 && this.goodsNameOptions.length > 0 && this.taxClassificationOptions.length > 0) {
                this.$refs.invoiceApplyDetailModal.edit(res.data, this.url.auditProcessUrl)
              } else {
                if (this.unitOptions.length === 0) {
                  this.$message.error(`"单位"${this.loadMessage}`)
                  return
                }
                if (this.goodsNameOptions.length === 0) {
                  this.$message.error(`"商品名称"${this.loadMessage}`)
                  return
                }
                if (this.taxClassificationOptions.length === 0) {
                  this.$message.error(`"税收分类"${this.loadMessage}`)
                  return
                }
              }
            } else {
              this.$message.error('数据请求失败！')
            }
          })
        } else if (String(record.invoiceType) === '1') {  // 预开票
          httpAction(`${this.url.queryAllInfoById}?id=${record.id}`, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.$refs.invoiceForwardApplyDetailModal.title = '预开票申请详情'
              this.$refs.invoiceForwardApplyDetailModal.addConfirmButton = false
              this.$refs.invoiceForwardApplyDetailModal.addReleaseButton = false
              this.$refs.invoiceForwardApplyDetailModal.backButton = true
              this.$refs.invoiceForwardApplyDetailModal.invoiceButton = true
              this.$refs.invoiceForwardApplyDetailModal.unitBelongs = this.unitOptions
              this.$refs.invoiceForwardApplyDetailModal.invKindOptions = this.invKindOptions
              this.$refs.invoiceForwardApplyDetailModal.invoiceTypeOptions = this.invoiceTypeOptions
              this.$refs.invoiceForwardApplyDetailModal.goodsNameOptions = this.goodsNameOptions
              this.$refs.invoiceForwardApplyDetailModal.taxClassificationOptions = this.taxClassificationOptions
              if (this.unitOptions.length > 0 && this.goodsNameOptions.length > 0 && this.taxClassificationOptions.length > 0) {
                this.$refs.invoiceForwardApplyDetailModal.edit(res.data, this.url.auditProcessUrl)
              } else {
                if (this.unitOptions.length === 0) {
                  this.$message.error(`"单位"${this.loadMessage}`)
                  return
                }
                if (this.goodsNameOptions.length === 0) {
                  this.$message.error(`"商品名称"${this.loadMessage}`)
                  return
                }
                if (this.taxClassificationOptions.length === 0) {
                  this.$message.error(`"税收分类"${this.loadMessage}`)
                  return
                }
              }
            } else {
              this.$message.error('数据请求失败！')
            }
          })
        }
      },
      // 隐藏列样式
      handleColumnStyle(width) {
        if (width) {
          return `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: ${width}px;`
        }
        return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
      },
      // 省份切换
      handleProvinceChange(value) {
        this.areaCitys = []
        this.areaTowns = []
        if (value) {
          for (const c of this.areaTrees[value - 1].children) {
            this.areaCitys.push(c)
          }
        }
        delete this.queryParam.city
        delete this.queryParam.town
      },
      // 城市切换
      handleCityChange(value) {
        this.areaTowns = []
        if (value) {
          for (const c of this.areaCitys) {
            if (String(c.id) === String(value)) {
              if (c.children.length > 0) {
                for (const t of c.children) {
                  this.areaTowns.push(t)
                }
              }
            break
            }
          }
        }
        delete this.queryParam.town
      },
      // 地区渲染显示
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
      // 重置按钮
      searchReset() {
        this.queryParam = {}
        this.areaCitys = []
        this.areaTowns = []
        this.loadData(1)
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
            this.taxClassificationOptions = res.data
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
