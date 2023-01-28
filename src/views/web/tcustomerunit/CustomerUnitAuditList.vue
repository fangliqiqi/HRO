<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="客户名称">
              <a-input placeholder="客户名称" v-model="queryParam.customerName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="客户编码">
              <a-input placeholder="客户编码" v-model="queryParam.customerCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="客户性质">
              <a-select showSearch optionFilterProp="children" placeholder="客户性质" v-model="queryParam.nature">
                <a-select-option
                  v-for="(value, key) in natureDictOptions"
                  :key="key"
                  :value="value.value">{{ value.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="销售代表">
                <a-input placeholder="销售代表" v-model="queryParam.salesmanName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="行业类型">
                <a-select showSearch optionFilterProp="children" placeholder="行业类型" v-model="queryParam.industryBelong">
                  <a-select-option
                    v-for="(value, key) in industryBelongDictOptions"
                    :key="key"
                    :value="value.id">{{ value.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleAudit(record)"
            v-has="'wxhr:tcustomerinfo_audit'"
          >审核</a>
          <!--<a-divider type="vertical"/>-->
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
    <customer-unit-doaudit-modal
      ref="customerUnitDoauditModal"
      @ok="customerUnitDoauditModalOk"
    ></customer-unit-doaudit-modal>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction } from '@/api/manage'
  import {initDictOptions, filterDictText,filterDict} from '@/components/dict/JDictSelectUtil'
  import Vue from 'vue'
  import CustomerUnitDoauditModal from './modules/CustomerUnitDoauditModal'

  export default {
    name: 'CustomerUnitAuditList',
    mixins: [JeecgListMixin],
    components: {
      CustomerUnitDoauditModal,
    },
    data() {
      return {
        description: '客户信息审核界面',
        fileList: [],
        //字典数组缓存
        natureDictOptions: [],
        industryBelongDictOptions: [],
        industrySub: [],
        areaTrees: [],
        loading: false,
        customerTreeData:[],
        // 表头
        columns: [
          {
            title: '客户名称',
            align: 'center',
            dataIndex: 'customerName'
          },
          {
            title: '客户编码',
            align: 'center',
            dataIndex: 'customerCode'
          },
          {
            title: '客户合同情况',
            align: 'center',
            dataIndex: 'customerStatus',
            scopedSlots: { customRender: 'customerStatus' }
          },
          {
            title: '审核状态',
            align: 'center',
            dataIndex: 'prAuditFlag',
            scopedSlots: { customRender: 'prAuditFlag' }
          },
          {
            title: '销售代表',
            align: 'center',
            dataIndex: 'salesmanName'
          },
          {
            title: '客户性质',
            align: 'center',
            dataIndex: 'nature',
            customRender: (text) => {
              return filterDictText(this.natureDictOptions, text);
            }
          },
          /*{
            title: '客户标识',
            align: 'center',
            dataIndex: 'label',
            scopedSlots: { customRender: 'label' }
          },*/
          {
            title: '行业类型',
            align: 'center',
            dataIndex: 'industryBelong',
            customRender: (text) => {
              return filterDict(this.industryBelongDictOptions, text);
            }
          },
          /*{
            title: '创建人',
            align: 'center',
            dataIndex: 'createUserName'
          },*/
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/hrBase/tcustomerinfo/audit/page',
          queryAllInfoById: '/hrBase/tcustomerinfo/',
          getTreeData: '/hrBase/tcustomerinfo/ValueTree',
          submitBatch: '/hrBase/tcustomerinfo/batch/commit'
        }
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      }
    },
    created() {
      this.loadCustomerTreeData();
    },
    methods: {
      handleAudit(record) {
        // 查找上级客户
        record.parentCustomerName = ''
        const promise = new Promise((resolve)=>{
          if(Number(record.parentId)){
            httpAction(`hrBase/tcustomerinfo/${record.parentId}`,null,'get').then(res=>{
              if(res.code === 200 && res.data){
                record.parentCustomerName = res.data.customerName
                resolve(1)
              }else{
                resolve(0)
              }
            })
          }else{
            resolve(0)
          }
        })
        promise.then(() => {
          this.$refs.customerUnitDoauditModal.industryBelongs = this.industryBelongDictOptions;
          this.$refs.customerUnitDoauditModal.natureBelongs = this.natureDictOptions;
          this.$refs.customerUnitDoauditModal.industrySub = this.industrySub;
          this.$refs.customerUnitDoauditModal.areaTrees = Vue.ls.get('glob_area');
          this.$refs.customerUnitDoauditModal.edit(record)
        })
        
      },
      initDictConfig() {
        initDictOptions('nature').then((res) => {
          if (res.code === 200) {
            this.natureDictOptions = res.data;
          }
        });

        initDictOptions('industryBelong').then((res) => {
          if (res.code === 200) {
            this.industryBelongDictOptions = res.data;
          }
        });

        initDictOptions('industrySub').then((res) => {
          if (res.code === 200) {
            this.industrySub = res.data;
          }
        });
      },
      customerUnitDoauditModalOk() {
        this.loadData()
      },
      loadCustomerTreeData() {
        httpAction(this.url.getTreeData,null,'get').then((res) => {
          this.customerTreeData = res.data;
        });
      },
      customerAuditModalOk() {
        this.loadData()
      },
      customerContractModalOk() {
        this.loadData()
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
