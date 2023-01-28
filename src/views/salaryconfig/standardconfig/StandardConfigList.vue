<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="配置名称">
              <a-input
                v-model="queryParam.name"
                placeholder=""
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="选择结算主体"
              style="margin-left: 28px"
            >
              <!-- <a-select
                v-model="queryParam.departId"
                style="width: 191px"
                :allowClear="true"
                showSearch
                optionFilterProp="children"
              >
                <a-select-option
                  v-for="(item, index) in settlementList"
                  :key="index"
                  :value="item.id"
                >{{ item.departName }}</a-select-option>
              </a-select> -->
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :placeholder="'请输入结算主体'"
                v-model="queryParam.departId"
                :id="'id'"
              ></select-page>
            </a-form-item>
          </a-col>

          <a-col :span="8">
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

    <!-- 创建配置 -->
    <div
      class="table-operator"
      style="margin-bottom:10px"
    >
      <a-button
        type="primary"
        @click="handleAdd"
        icon="plus"
        v-has="'wxhr:tconfigsalary_add'"
      >创建新配置</a-button>
    </div>

    <!-- 列表 -->
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleView(record)">查看</a>
          <a-divider type="vertical" />
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:tconfigsalary_edit'"
          >编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除吗?"
            @confirm="handleDelete(record.id)"
            okText="确定"
            cancelText="取消"
          >
            <a
              href="#"
              v-has="'wxhr:tconfigsalary_del'"
            >删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>

    <!-- 表单 -->
    <standard-config-modal
      ref="modalForm"
      @ok="modalFormOk"
      :settlementList="settlementList"
    ></standard-config-modal>

    <!-- 详情 -->
    <standard-config-view-modal ref="modalDetail"></standard-config-view-modal>
  </a-card>
</template>
<script>
import {mapGetters} from 'vuex'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getSettleDomainSelectVos } from '@/api/api'
import StandardConfigModal from './modules/StandardConfigModal'
import StandardConfigViewModal from './modules/StandardConfigViewModal'
import SelectPage from '@/components/jeecg/SelectPage'
export default {
  name: "StandardConfigList",
  components: {
    StandardConfigModal,
    StandardConfigViewModal,
    SelectPage
  },
  mixins: [JeecgListMixin],
  data() {
    return{
      columns: [
        {
          title: '工资报表配置名称',
          dataIndex: 'name',
          align:'center',
        },
        {
          title: '结算主体',
          dataIndex: 'departName',
          align:'center',
        },
        {
          title: '结算主体编码',
          dataIndex: 'departNo',
          align:'center',
        },
        {
          title: '操作',
          align:'center',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
        }
      ],
      url: {
        list: '/salary/tconfigsalary/page',
        delete: '/salary/tconfigsalary/'
      },
      settlementList: {},
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.loadSettlementList()    
  },
  methods: {
    loadSettlementList() {
      getSettleDomainSelectVos({}).then((res) => {
        this.settlementList = res.data
      })
    },
    // 查看详情
    handleView(record) {
      this.$refs.modalDetail.show(record)
    }
  }
}
</script>
