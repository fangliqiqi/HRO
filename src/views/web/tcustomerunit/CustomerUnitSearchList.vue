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
              <a-input
                placeholder="客户名称"
                v-model="queryParam.customerName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户编码">
              <a-input
                placeholder="客户编码"
                v-model="queryParam.customerCode"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户性质">
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="客户性质"
                v-model="queryParam.nature"
              >
                <a-select-option
                  v-for="(value, key) in natureDictOptions"
                  :key="key"
                  :value="value.value"
                >{{ value.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="销售代表">
                <a-input
                  placeholder="销售代表"
                  v-model="queryParam.salesmanName"
                ></a-input>
                <!--<a-select showSearch optionFilterProp="children" placeholder="销售代表" v-model="queryParam.salesmanName">
                  <a-select-option
                    v-for="u in sysUsers"
                    :key="u.id">{{ u.nickname }}</a-select-option>
                </a-select>-->
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="行业类型">
                <a-select
                  showSearch
                  optionFilterProp="children"
                  placeholder="行业类型"
                  v-model="queryParam.industryBelong"
                >
                  <a-select-option
                    v-for="(value, key) in industryBelongDictOptions"
                    :key="key"
                    :value="value.id"
                  >{{ value.label }}</a-select-option>
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
    <div class="table-operator">
      <a-button
        @click="exportCustomerContract"
        type="primary"
        :loading="loadingDown"
        icon="download"
        v-has="'wxhr:tcustomerinfo_doexportallcustomer'"
      >管理员导出</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <div
        class="ant-alert ant-alert-info"
        style="margin-bottom: 16px;"
      >
        已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length }}</a>项
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
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{x:1}"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >

        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical" v-has="'wxhr:tcustomerinfo_edit'"/>
          <a
            @click="handleAudit(record)"
            v-has="'wxhr:tcustomerinfo_edit'"
          >修改</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tcustomercontract_add'"
          />
          <a
            @click="handleStop(record)"
            v-has="'wxhr:tcustomerstop_add'"
          >停止合作</a>
        </span>

        <span
          slot="customerStatus"
          slot-scope="text, record"
        >
          <a-tag
            v-if="record.customerStatus == 0"
            color="pink"
          >合同未上传</a-tag>
          <a-tag
            v-if="record.customerStatus == 1"
            color="green"
          >合同正常</a-tag>
          <a-tag
            v-if="record.customerStatus == 2"
            color="orange"
          >合同即将到期</a-tag>
          <a-tag
            v-if="record.customerStatus == 3"
            color="red"
          >合同到期</a-tag>
        </span>

        <span
          slot="prAuditFlag"
          slot-scope="text, record"
        >
          <a-tag
            v-if="record.prAuditFlag == 0"
            color="green"
          >审核通过</a-tag>
          <a-tag
            v-if="record.prAuditFlag == 1"
            color="red"
          >审核不通过</a-tag>
          <a-tag
            v-if="record.prAuditFlag == 2"
            color="cyan"
          >待审核</a-tag>
          <a-tag
            v-if="record.prAuditFlag == 3"
            color="orange"
          >待提交</a-tag>
        </span>

        <span
          slot="label"
          slot-scope="text, record"
        >
          <span v-if="record.label != null">
            <a-tag
              v-for="(tag, index) in record.label.split(',')"
              :key="index"
            >{{ tag }}</a-tag>
          </span>
          <span v-else> - </span>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <customer-unit-modal
      ref="customerUnitModal"
      @ok="customerUnitModalOk"
    ></customer-unit-modal>
    <customer-contract-modal
      ref="customerContractModal"
      @ok="customerContractModalOk"
    ></customer-contract-modal>
    <customer-all-detail-modal ref="customerAllDetailModal"></customer-all-detail-modal>
    <images-view-modal ref="imagesViewModal"></images-view-modal>
    <stop-coopera-modal
      ref="StopCooperaModal"
      @ok="customerUnitModalOk"
    ></stop-coopera-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction } from '@/api/manage'
import { initDictOptions, filterDictText, filterDict } from '@/components/dict/JDictSelectUtil'
import Vue from 'vue'
import customerUnitModal from './modules/CustomerUnitModal'
import customerContractModal from './modules/CustomerContractModal'
import customerAllDetailModal from './modules/CustomerAllDetailModal'
import ImagesViewModal from './modules/ImagesViewModal'
import StopCooperaModal from '../global/modules/StopCooperaModal'

export default {
  name: 'CustomerUnitSearchList',
  mixins: [JeecgListMixin],
  components: {
    customerUnitModal,
    customerContractModal,
    customerAllDetailModal,
    ImagesViewModal,
    StopCooperaModal
  },
  data() {
    return {
      description: '客户信息查询界面',
      fileList: [],
      //字典数组缓存
      natureDictOptions: [],
      industryBelongDictOptions: [],
      industrySub: [],
      areaTrees: [],
      sysUsers: [],
      loading: false,
      customerTreeData: [],
      contractTypeDicts: [],
      businessTypeDicts: [],
      businessSubDicts: [],
      allTypeList:[],
      organs: [],
      loadingDown: false, // 导入按钮点击加载动画
      // 表头
      columns: [
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'customerName',
          width: 200,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '客户编码',
          align: 'center',
          width: 140,
          ellipsis: true,
          dataIndex: 'customerCode',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '客户合同情况',
          align: 'center',
          width: 140,
          ellipsis: true,
          dataIndex: 'customerStatus',
          scopedSlots: { customRender: 'customerStatus' }
        },
        {
          title: '审核状态',
          align: 'center',
          width: 130,
          ellipsis: true,
          dataIndex: 'prAuditFlag',
          scopedSlots: { customRender: 'prAuditFlag' }
        },
        {
          title: '销售代表',
          align: 'center',
          width: 130,
          ellipsis: true,
          dataIndex: 'salesmanName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '客户性质',
          align: 'center',
          dataIndex: 'nature',
          width: 140,
          ellipsis: true,
          customRender: text => {
            const res = filterDictText(this.natureDictOptions, text)
            return (
              <a-tooltip placement="topLeft" title={res}>
                {res}
              </a-tooltip>
            )
          }
        },
        {
          title: '行业类型',
          align: 'center',
          dataIndex: 'industryBelong',
          width: 140,
          ellipsis: true,
          customRender: text => {
            const res = filterDict(this.industryBelongDictOptions, text)
            return (
              <a-tooltip placement="topLeft" title={res}>
                {res}
              </a-tooltip>
            )
          }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          width: 170,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 180,
          ellipsis: true,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/hrBase/tcustomerinfo/page?selectType=0',
        queryAllInfoById: '/hrBase/tcustomerinfo/vo/',
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        submitBatch: '/hrBase/tcustomerinfo/batch/commit',
        getOrgan: '/admin/organizationinfo/getOrgForCus',
        getSysUsers: '/admin/user/findWxUsers',
        getBusinessDeveloperId: 'admin/user/findWxUsers',
        getBusinessDeveloperArray: '/admin/user/getUserByRoleNameAndClient', // 获得业务开发人
        exportInfo: '/hrBase/tcustomerinfo/doExportAllCustomer' // 导出客户信息
      },
      businessDeveloper: ''
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {
    this.loadCustomerTreeData()
    this.getSysUsers()
    this.areaTrees = this.$ls.get('glob_area')
    this.getAllBusinessDeveloper()
    httpAction(`/hrBase/sysdictbusinesstype/getSysDictBusinessTypeList`,null,'get').then(res=>{
      if(res.code === 200) {
        this.allTypeList = res.data
      }
    })
  },
  methods: {
    handleStop(record) {
      this.$refs.StopCooperaModal.showModal(record, 0)
    },
    //获得业务开发人的接口
    getAllBusinessDeveloper() {
      httpAction(this.url.getBusinessDeveloperArray, '', 'GET').then(res => {
        if (res.code === 200 && res.data.length > 0) {
          this.businessDeveloper = res.data
        }
      })
    },
    handleAudit: function(record) {
      this.$refs.customerUnitModal.treeData = this.customerTreeData
      this.$refs.customerUnitModal.industryBelongs = this.industryBelongDictOptions
      this.$refs.customerUnitModal.industrySub = this.industrySub
      this.$refs.customerUnitModal.customerNatures = this.natureDictOptions
      this.$refs.customerUnitModal.title = '编辑'
      this.$refs.customerUnitModal.areaTrees = Vue.ls.get('glob_area')
      httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then(res => {
        this.$refs.customerUnitModal.edit(res.data)
      })
    },
    handleDetail(record) {
      this.$refs.customerAllDetailModal.treeData = this.customerTreeData
      this.$refs.customerAllDetailModal.industryBelongs = this.industryBelongDictOptions
      this.$refs.customerAllDetailModal.industrySub = this.industrySub
      this.$refs.customerAllDetailModal.customerNatures = this.natureDictOptions
      this.$refs.customerAllDetailModal.areaTrees = Vue.ls.get('glob_area')
      this.$refs.customerAllDetailModal.title = '客户详情'

      this.$refs.customerAllDetailModal.contractTypeDicts = this.contractTypeDicts
      this.$refs.customerAllDetailModal.businessTypeDicts = this.allTypeList
      this.$refs.customerAllDetailModal.businessSubDicts = this.businessSubDicts
      this.$refs.customerAllDetailModal.organs = this.organs
      //this.$refs.customerSimpleDetailModal.edit(record)
      httpAction(this.url.queryAllInfoById + record.id, null, 'GET').then(res => {
        this.$refs.customerAllDetailModal.edit(res.data)
      })
    },

    addCustomerContract(record) {
      this.$refs.customerContractModal.treeData = this.customerTreeData
      this.$refs.customerContractModal.organs = this.organs
      this.$refs.customerContractModal.industryBelongs = this.industryBelongDictOptions
      this.$refs.customerContractModal.industrySub = this.industrySub
      this.$refs.customerContractModal.customerContractDict = this.contractTypeDicts
      this.$refs.customerContractModal.customerBusinessTypeDict = this.businessTypeDicts
      this.$refs.customerContractModal.businessDeveloper = this.businessDeveloper

      this.$refs.customerContractModal.add(record)
      this.$refs.customerContractModal.title = '客户合同上传'
    },
    initDictConfig() {
      initDictOptions('nature').then(res => {
        if (res.code === 200) {
          this.natureDictOptions = res.data
        }
      })

      initDictOptions('industryBelong').then(res => {
        if (res.code === 200) {
          this.industryBelongDictOptions = res.data
        }
      })

      initDictOptions('industrySub').then(res => {
        if (res.code === 200) {
          this.industrySub = res.data
        }
      })

      initDictOptions('customer_contract_type').then(res => {
        if (res.code === 200) {
          this.contractTypeDicts = res.data
        }
      })

      initDictOptions('customer_business_type').then(res => {
        if (res.code === 200) {
          this.businessTypeDicts = res.data
        }
      })

      initDictOptions('customer_business_sub_type').then(res => {
        if (res.code === 200) {
          this.businessSubDicts = res.data
        }
      })

      httpAction(this.url.getOrgan, '', 'GET').then(res => {
        if (res.code === 200 && res.data.length > 0) {
          this.organs = res.data
        }
      })
    },
    customerUnitModalOk() {
      this.loadData()
    },
    loadCustomerTreeData() {
      httpAction(this.url.getTreeData, null, 'get').then(res => {
        this.customerTreeData = res.data
      })
    },
    customerAuditModalOk() {
      this.loadData()
    },
    customerContractModalOk() {
      this.loadData()
    },
    /**
     * 获取系统用户数据
     */
    getSysUsers() {
      httpAction(this.url.getSysUsers, null, 'GET').then(res => {
        this.sysUsers = res.data
      })
    },
    // 导出按钮点击事件
    exportCustomerContract() {
      this.loadingDown = true
      httpAction(this.url.exportInfo, {}, 'post')
        .then(res => {
          if (Number(res.code) === 200) {
            if(res.data){
              const datalist = res.data
              const tableDatas = datalist.map(item => {
              const project = {
                customerName: item.customerName || '',
                customerCode: item.customerCode || '',
                nature: item.nature || '',
                industryBelong: item.industryBelong || '',
                createUserName: item.createUserName || '',
                createTime: item.createTime || '',
                prAuditFlag: item.prAuditFlag || '',
                customerType: item.customerType || ''
              }
              return project
            })
            const excelDatas = [
              {
                tHeader: ['客户名称', '客户编号', '客户性质', '所属性质', '创建人', '创建时间', '审核状态', '客户类型'],
                filterVal: ['customerName','customerCode','nature','industryBelong','createUserName','createTime','prAuditFlag','customerType'],
                tableDatas: tableDatas,
                sheetName: '客户信息'
              }
            ]
            this.json2excel(excelDatas, '客户信息', true, 'xlsx', true)
            this.$message.success('导出成功')
            }else {
              this.$message.error('导出数据为空')
            }
          } else {
            this.$message.error(res.msg || '导出数据接获取失败！')
          }
        })
        .finally(() => {
          this.loadingDown = false
        })
    },
    json2excel(tableJson, filenames, autowidth, bookTypes, typeLength) {
      var that = this
      import('../tcustomercontract/modules/ExportContract').then(excel => {
        var tHeader = []
        var dataArr = []
        var sheetnames = []
        for (var i in tableJson) {
          tHeader.push(tableJson[i].tHeader)
          dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
          sheetnames.push(tableJson[i].sheetName)
        }
        excel.export_json_to_excel_more_sheet({
          header: tHeader,
          data: dataArr,
          sheetname: sheetnames,
          filename: filenames,
          bookType: bookTypes,
          autoLength: typeLength // 所有类型长度
        })
        that.confirmLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
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
</style>
