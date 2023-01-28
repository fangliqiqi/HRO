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
          <template>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="合同名称">
                <a-input
                  placeholder="合同名称"
                  v-model="queryParam.contractName"
                ></a-input>
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="商务主体"
                class="stepFormText"
              >
                <a-select
                  showSearch
                  placeholder="商务主体"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.businessSubject"
                >
                  <a-select-option
                    v-for="(item, index) in organs"
                    :key="index"
                    :value="item.id"
                  >{{ item.description }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="合同开始时间">
                <a-date-picker
                  format="YYYY-MM-DD"
                  @change="startDateChange"
                  v-model="queryParam.dateTemp"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="合同结束时间">
                <a-date-picker
                  format="YYYY-MM-DD"
                  @change="endDateChange"
                  v-model="queryParam.dateTemp1"
                />
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="合同类型"
                class="stepFormText"
              >
                <a-select
                  showSearch
                  placeholder="合同类型"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.contractType"
                >
                  <a-select-option
                    v-for="(item, index) in contractTypeDicts"
                    :key="index"
                    :value="item.id"
                  >{{ item.description }}</a-select-option>
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
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        :scroll="{ x: 1}"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleShow(record)">查看</a>
          <a-divider type="vertical"/>
          <a @click="uploadCustomerContract(record)">附件上传</a>
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
          slot="labelScoped"
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
    <customer-contract-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></customer-contract-modal>
    <customer-contract-detail-modal ref="detailModal"></customer-contract-detail-modal>
    <customer-contract-edit-modal
      ref="editModal"
      @ok="modalFormOk"
    ></customer-contract-edit-modal>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction } from '@/api/manage'
  import {initDictOptions, filterDict} from '@/components/dict/JDictSelectUtil'
  import CustomerContractModal from './modules/CustomerContractModal'
  import { filterOrganDict1,filterSysUserDict } from '@/utils/customDict'
  import CustomerContractEditModal from './modules/CustomerContractEditModal'
  import CustomerContractDetailModal from './modules/CustomerContractDetailModal'
  import { getNameFromArr,getAllTree } from '@/utils/common'

  export default {
    name: 'NoticeWithoutAttachContract',
    mixins: [JeecgListMixin],
    components: {
      CustomerContractModal,
      CustomerContractDetailModal,
      CustomerContractEditModal
    },
    data() {
      return {
        description: '无附件合同列表',
        fileList: [],
        //字典数组缓存
        contractTypeDicts: [],
        businessTypeDicts: [],
        businessSubDicts: [],
        chapterUnitDicts: [],
        loading: false,
        organs:[],
        customerTreeData: [],
        sysUsers: {},
        typeTitle:{'0':'续签','1':'新签','2':'重签','3':'补充协议','4':'先于合同执行','5':'虚拟合同'},
        // 表头
        columns: [
          {
            title: '合同名称',
            align: 'center',
            dataIndex: 'contractName',
            width:150,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: '签订类型',
            align: 'center',
            dataIndex: 'signingStatus',
            width: 100,
            customRender:(text)=>{
              const type = this.typeTitle[text]
              return (
                <a-tooltip placement="topLeft" title={type}>
                  {type}
                </a-tooltip>
              )
            }
          },
          {
            title: '合同编号',
            align: 'center',
            dataIndex: 'contractCode',
            width:150,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: '客户名称',
            align: 'center',
            dataIndex: 'customerName',
            width:200,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: '客户编码',
            align: 'center',
            dataIndex: 'customerCode',
            width:100,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: '商务主体',
            align: 'center',
            dataIndex: 'businessSubject',
            width:200,
            ellipsis: true,
            customRender:(text)=>{
              const name = filterOrganDict1(this.organs, text)
              return <a-tooltip
                placement="topLeft"
                title={name}
              >{name}</a-tooltip>
            }
          },
          {
            title: '合同起止时间',
            align: 'center',
            dataIndex: 'startDate',
            width:200,
            ellipsis: true,
            customRender:(text,record)=>{
              const range = `${text}~${record.endDate}`
              return <a-tooltip
                placement="topLeft"
                title={range}
              >{range}</a-tooltip>
            }
          },
          {
            title: '业务类型',
            align: 'center',
            width:120,
            ellipsis: true,
            dataIndex: 'businessType',
            customRender: (text) => {
              return filterDict(this.businessTypeDicts, text);
            }
          },
          {
            title: '创建人',
            align: 'center',
            width:100,
            ellipsis: true,
            dataIndex: 'createUser',
            customRender: (text) => {
              return filterSysUserDict(this.sysUsers, text);
            }
          },
          {
            title: '创建时间',
            align: 'center',
            width:170,
            ellipsis: true,
            dataIndex: 'createTime',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: '业务审核状态',
            align: 'center',
            dataIndex: 'prAuditFlag',
            width:120,
            ellipsis: true,
            scopedSlots: { customRender: 'prAuditFlag' }
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed: 'right',
            width: 120,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/hrBase/tcustomercontract/page?selectType=4',
          getOrgan: '/admin/organizationinfo/getOrgForCus?displayFlag=0&type=0',
          getTreeData: '/hrBase/tcustomerinfo/ValueTree',
          getOne: '/hrBase/tcustomercontract/',
          getSysUsers: '/admin/user/userDic',
        }
      }
    },
    created() {
      this.loadOrgans();
      this.loadCustomerTreeData();
      this.getSysUsers();
    },
    methods: {
      uploadCustomerContract(record) {
        this.$refs.editModal.treeData = this.customerTreeData;
        this.$refs.editModal.organs = this.organs;
        this.$refs.editModal.industryBelongs = this.industryBelongDictOptions;
        this.$refs.editModal.industrySub = this.industrySub;
        this.$refs.editModal.customerContractDict = this.contractTypeDicts;
        this.$refs.editModal.customerBusinessTypeDict = this.businessTypeDicts;
        // this.$refs.editModal.customerBusinessSubTypeDict = this.businessSubDicts;
        this.$refs.editModal.contractCustomerName = record.customerName
        this.$refs.editModal.chapterUnitDicts = this.chapterUnitDicts
        httpAction(this.url.getOne + record.id, null, "GET").then((res) => {
          this.$refs.editModal.edit(res.data)
        });
        this.$refs.editModal.title = '客户合同编辑'
      },
      /**
       * 客户合同详情
       */
      handleShow(record) {
        this.$refs.detailModal.treeData = this.customerTreeData;
        this.$refs.detailModal.organs = this.organs;
        this.$refs.detailModal.industryBelongs = this.industryBelongDictOptions;
        this.$refs.detailModal.industrySub = this.industrySub;
        this.$refs.detailModal.customerContractDict = this.contractTypeDicts;
        this.$refs.detailModal.customerBusinessTypeDict = this.businessTypeDicts;
        // this.$refs.detailModal.customerBusinessSubTypeDict = this.businessSubDicts;
        this.$refs.detailModal.chapterUnitDicts = this.chapterUnitDicts
        this.$refs.detailModal.title = '客户合同查看'
        httpAction(this.url.getOne + record.id, null, "GET").then((res) => {
          if(res.code === 200){
            this.$refs.detailModal.show(res.data)
          }else{
            this.$message.error(res.msg)
          }
        });
      },
      /**
       * 加载数据字典
       */
      initDictConfig() {
        initDictOptions('customer_contract_type').then((res) => {
          if (res.code === 200) {
            this.contractTypeDicts = res.data;
          }
        });
        
        initDictOptions('chapter_unit').then((res) => {
          if (res.code === 200) {
            this.chapterUnitDicts = res.data
          }
        })
        httpAction(`/hrBase/sysdictbusinesstype/getSysDictBusinessTypeList`,null,'get').then(res=>{
          if(res.code === 200) {
            const tree = getAllTree(res.data)
            let result = []
            tree.map(item=>{
              result = result.concat(item.children)
            })
            this.businessTypeDicts = result
          }
        })
      },
      loadOrgans() {
        httpAction(this.url.getOrgan,'','GET').then((res) => {
          if(res.code === 200 && res.data.length > 0) {
            this.organs = res.data;
          }
        });
      },
      /**
       * 加载客户单位树形结构
       */
      loadCustomerTreeData() {
        httpAction(this.url.getTreeData,null,'get').then((res) => {
          this.customerTreeData = res.data;
        });
      },
      /**
       * 获取系统用户数据
       */
      getSysUsers() {
        httpAction(this.url.getSysUsers, null ,'GET').then((res) => {
          this.sysUsers = res.data;
        });
      },
      startDateChange(date) {
        // 时间格式化
        this.queryParam.startTimeFromHtml = date ? (date.format('YYYY-MM-DD')) : null
      },
      endDateChange(date) {
        // 时间格式化
        this.queryParam.endTimeFromHtml  = date ? (date.format('YYYY-MM-DD')) : null
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

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
