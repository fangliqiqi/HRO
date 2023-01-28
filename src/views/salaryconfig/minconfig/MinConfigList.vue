<template>
  <a-card :bordered="false">
    <!-- 创建配置 -->
    <div
      class="table-operator"
      style="margin-bottom:10px"
    >
      <a-button
        type="primary"
        @click="handleAdd"
        icon="plus"
        v-has="'wxhr:tminsalary_add'"
      >添加最低工资配置</a-button>
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
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:tminsalary_edit'"
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
              v-has="'wxhr:tminsalary_del'"
            >删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>

    <!-- 表单 -->
    <min-config-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></min-config-modal>

  </a-card>
</template>
<script>
import Vue from 'vue'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import MinConfigModal from './modules/MinConfigModal'
export default {
  name: "MinConfigList",
  components: {
    MinConfigModal
  },
  mixins: [JeecgListMixin],
  data() {
    return{
      columns: [
        {
          title: '所在地',
          dataIndex: 'province',
          align:'center',
          customRender:(text,record) => {
            let areaName = ''
            for(var c of this.idAreaTrees){
              if(c.id == text){
                areaName = c.areaName
                for(let d of c.children){
                  if(record.city == d.id){
                    areaName = areaName + '-' + d.areaName
                  }
                }
              }
            }
            return areaName
          }
        },
        {
          title: '最低工资',
          dataIndex: 'salaryBase',
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
        list: '/salary/tminsalary/page',
        delete: '/salary/tminsalary/'
      },
      settlementList: [],
      idAreaTrees:[]
    }
  },
  created () {
    this.idAreaTrees = Vue.ls.get('glob_area')
  },
  methods: {
    
  }
}
</script>
