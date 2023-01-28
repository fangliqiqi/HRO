<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="系统标准数据项">
              <a-input
                v-model="queryParam.dbFiedName"
                placeholder=""
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="原表对应数据项">
              <a-input
                v-model="queryParam.cnName"
                placeholder=""
              />
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
    <div
      class="table-operator"
      style="margin-bottom:10px"
    >
      <a-button
        type="primary"
        @click="handleAdd"
        v-has="'wxhr:tsalaryconfigstandard_add'"
      >新增数据项</a-button>
    </div>

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
            @click="handleEdit(record)"
            v-has="'wxhr:tsalaryconfigstandard_edit'"
          >编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确认删除吗?"
            @confirm="handleDelete(record.id)"
            okText="确定"
            cancelText="取消"
          >
            <a
              href="#"
              v-has="'wxhr:tsalaryconfigstandard_del'"
            >删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>

    <config-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></config-modal>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ConfigModal from './modules/ConfigModal'
export default {
  name: "SalaryStandardConfigList",
  mixins: [JeecgListMixin],
  components: {
    ConfigModal
  },
  data(){
    return{
      columns: [
        {
          title: '系统标准数据项',
          align: 'center',
          dataIndex: 'dbFiedName',
        },
        {
          title: '原表对应数据项',
          align: 'center',
          dataIndex: 'cnName',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
        }
      ],
      url:{
        list: "/salary/tsalaryconfigstandard/page",
        delete:"/salary/tsalaryconfigstandard/"
      }
    }
  }
}
</script>
