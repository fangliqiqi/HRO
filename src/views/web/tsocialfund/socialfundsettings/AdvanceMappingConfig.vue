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
            <a-form-item label="客户原表信息">
              <a-input
                allowClear
                placeholder="请输入客户原表信息"
                v-model="queryParam.customerField"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="模板字段">
              <a-input
                allowClear
                placeholder="请输入模板字段"
                v-model="queryParam.sysField"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="增减状态">
              <a-select
                placeholder="请选择增减状态"
                optionFilterProp="children"
                v-model="queryParam.confType"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option value="0">派增</a-select-option>
                <a-select-option value="1">派减</a-select-option>
              </a-select>
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
        @click="addBtnClick"
      >添加</a-button>
      <a-button
        type="danger"
        icon="minus"
        :disabled="!selectedRowKeys.length"
        :loading="removeLoading"
        @click="handleRemove"
        v-has="'wxhr:tdispatchfieldconf_del'"
      >删除</a-button>
    </div>
    <!-- table区域-begin -->
    <div>
      <div
        class="ant-alert ant-alert-info"
        style="margin-bottom: 16px;"
      >
        已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> 项
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
        <template
          slot="operation"
          slot-scope="text, record"
        >
          <span>
            <a v-has="'wxhr:tdispatchfieldconf_edit'" @click="handleEditBtnClick(record)">修改</a>
            <a-popconfirm
              title="确定删除吗?"
              v-has="'wxhr:tdispatchfieldconf_del'"
              @confirm="handleDelete(record.id)"
            >
              <a-divider type="vertical" />
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
    </div>
    <mapping-config-modal ref="mappingConfigModal" @ok="modalFormOk"></mapping-config-modal>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import MappingConfigModal from './modules/MappingConfigModal'
import { httpAction } from '@/api/manage'

export default {
  name: 'AdvanceMappingConfig',
  mixins: [JeecgListMixin],
  components:{
    MappingConfigModal
  },
  data(){
    return{
      description: '预派映射',
      removeLoading:false, // 删除按钮加载动画
      columns: [
        {
          ellipsis: true,
          title: '客户原表信息',
          align: 'center',
          dataIndex: 'customerField',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '模板字段',
          align: 'center',
          dataIndex: 'sysField',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          title: '操作',
          align: 'center',
          fixed: 'right',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      url:{
        list: '/hrSocial/tdispatchfieldconf/page', // 列表数据
        batchRemoveUrl: '/hrSocial/tdispatchfieldconf/', // 删除
      }
    }
  },
  methods:{
    // 添加按钮事件
    addBtnClick(){
      this.$refs.mappingConfigModal.title = "添加映射关系"
      this.$refs.mappingConfigModal.show()
    },
    // 修改
    handleEditBtnClick(record){
      this.$refs.mappingConfigModal.title = "修改映射关系"
      this.$refs.mappingConfigModal.edit(record)
    },
    // 删除按钮点击事件
    handleRemove(record){
      this.transferRemoveInterface(record.id)
    },
    // 批量移除
    batchRemove(){
      const resultStr = this.selectedRowKeys.join(',')
      this.transferRemoveInterface(resultStr)
    },
    // 调取移除、批量移除接口
    transferRemoveInterface(idStr){
      const that = this
      that.loading = true
      const url = `${this.url.batchRemoveUrl}?ids=${idStr}`
      httpAction(url,{},'DELETE').then((res) => {
        if(Number(res.code) === 200){
          that.loading = false
          that.selectedRowKeys = []
          that.loadData()
        }else {
          that.loading = false
          that.$message.error(res.msg || '删除失败！')
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.ant-card-body .table-operator {
  margin-bottom: 18px;
  button {
    margin-right: 10px;
  }
}
</style>
