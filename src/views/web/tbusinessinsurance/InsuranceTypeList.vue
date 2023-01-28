<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col
            :md="8"
            :sm="10"
          >
            <a-form-item label="保险公司">
              <a-input
                placeholder="请输入保险公司"
                v-model="queryParam.companyName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="8"
            :sm="10"
          >
            <a-form-item label="险种">
              <a-input
                placeholder="请输入险种"
                v-model="queryParam.name"
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        @click="handleAdd"
        v-has="'wxhr:tinsurancetype_add'"
      >新增</a-button>
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
      >

        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleDetail(record)"
            v-has="'wxhr:tinsurancetype_detail'"
          >查看</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tinsurancetype_detail'"
          />
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:tinsurancetype_edit'"
          >编辑</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tinsurancetype_edit'"
          />
          <a
            @click="handleStand(record)"
            v-if="record.buyStandardFlag==0"
          >购买标准</a>
          <a-divider
            type="vertical"
            v-if="record.buyStandardFlag==0"
          />
          <a
            @click="handleFee(record)"
            v-if="record.rateFlag==0"
          >险种费率</a>
          <a-divider
            type="vertical"
            v-if="record.rateFlag==0"
          />
          <a-popconfirm
            v-has="'wxhr:tinsurancetype_del'"
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <insurance-type-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></insurance-type-modal>
    <insurance-type-detail-modal ref="InsuranceTypeDetailModalForm"></insurance-type-detail-modal>
    <insurance-type-list-modal ref="InsuranceTypeListModalForm"></insurance-type-list-modal>
    <insurance-type-fee-list ref="InsuranceTypeFeeList"></insurance-type-fee-list>
  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction } from '@/api/manage'
  import InsuranceTypeModal from './modules/InsuranceTypeModal'
  import InsuranceTypeDetailModal from './modules/InsuranceTypeDetailModal'
  import InsuranceTypeListModal from './modules/InsuranceTypeListModal'
  import InsuranceTypeFeeList from './modules/InsuranceTypeFeeList'

  export default {
    name: 'InsuranceTypeList',
    mixins: [JeecgListMixin],
    components: {
      InsuranceTypeModal,
      InsuranceTypeDetailModal,
      InsuranceTypeListModal,
      InsuranceTypeFeeList
    },
    data() {
      return {
        description: '保险公司管理界面',
        // 表头
        columns: [
          {
            title: '险种',
            align: 'center',
            dataIndex: 'name'
          },
          {
            title: '保险公司',
            align: 'center',
            dataIndex: 'companyName',
          },
          {
            title: '收款银行',
            align: 'center',
            dataIndex: 'bankName',
          },
          {
            title: '收款银行账号',
            align: 'center',
            dataIndex: 'bankNo',
          },
          {
            title: '收款单位名称',
            align: 'center',
            dataIndex: 'receiptUnitName',
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/tinsurancetype/page',
          delete: '/busiInsurance/tinsurancetype/',
          queryAllInfoById: '/busiInsurance/tinsurancetype/'
        }
      }
    },
    methods: {
      // 新建
      handleAdd: function() {
        this.$refs.modalForm.title = '新建险种'
        this.$refs.modalForm.add()
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.modalForm.title = '编辑险种'
        httpAction(this.url.queryAllInfoById + record.id, '','GET').then((res) => {
          this.$refs.modalForm.edit(res.data)
        })
      },
      handleDetail(record){
        this.$refs.InsuranceTypeDetailModalForm.title = '查看险种'
        this.$refs.InsuranceTypeDetailModalForm.show(record)
      },
      handleStand(record){
        this.$refs.InsuranceTypeListModalForm.url.default = '/busiInsurance/tinsurancetypestandard/page?typeId='
        this.$refs.InsuranceTypeListModalForm.title = '购买标准列表'
        this.$refs.InsuranceTypeListModalForm.columns = [
          {
            title: "购买标准",
            dataIndex: 'buyStandard',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          }
        ]
        this.$refs.InsuranceTypeListModalForm.show(record)
      },
      handleFee(record){
        this.$refs.InsuranceTypeFeeList.url.default = '/busiInsurance/tinsurancetyperate/page?typeId='
        this.$refs.InsuranceTypeFeeList.title = '险种费率列表'
        this.$refs.InsuranceTypeFeeList.columns = [
          {
            title: "月份",
            dataIndex: 'month',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: "费率",
            dataIndex: 'rate',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          }
        ]
        this.$refs.InsuranceTypeFeeList.show(record)
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
