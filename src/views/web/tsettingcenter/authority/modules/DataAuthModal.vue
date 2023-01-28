<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    @ok="handleCancel"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="保存"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirm-loading="confirmLoading"
  >
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户名">
              <a-input
                placeholder="请输入员工姓名"
                v-model="queryParam.name"
              ></a-input>
            </a-form-item>
          </a-col>

          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户类型">
              <a-select
                style="width:100%"
                placeholder="请选择客户类型"
                v-model="queryParam.type"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option value="0">客户</a-select-option>
                <a-select-option value="1">合同</a-select-option>
                <a-select-option value="2">结算主体</a-select-option>
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
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      @change="tableChange"
      rowKey="id"
    >
      <span
        slot="action"
        slot-scope="text, record"
      >
        <a-popconfirm
          title="确定删除吗?"
          @confirm="() => handleDelete(record.id)"
        >
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>
  </a-modal>
</template>

<script>
import SelectPage from '@/components/jeecg/SelectPage'

import { httpAction } from '@/api/manage'

export default {
  name: 'DataAuthModal',
  components:{
    SelectPage
  },
  data() {
    return {
      title: '查看权限',
      visible: false,
      confirmLoading: false,
      queryParam: {},
      form: this.$form.createForm(this),
      model:{},
      validatorRules: {
        userId: { rules: [{ required: true, message: '请选择用户!' }] },
        province: { rules: [{ required: true, message: '请选择区域!' }]},
        socialFlag: { rules: [{ required: true, message: '请选择是否作用社保!' }],initialValue:'0'},
        fundFlag: { rules: [{ required: true, message: '请选择是否作用公积金!' }],initialValue:'0'},
        fileFlag: { rules: [{ required: true, message: '请选择是否作用档案!' }],initialValue:'0'},
      },
      url: {
        list: `/hrBase/tcutsomerdatapermisson/page?bePermissonUser=`,
        delOne:'/hrBase/tcutsomerdatapermisson/'
      },
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0
      },
      columns:[{
        title: "客户名",
        dataIndex: 'name',
        width:150,
        ellipsis: true,
        customRender:(text)=>{
          return <a-tooltip
            placement="topLeft"
            title={text}
          >{text}</a-tooltip>
        }
      },{
        title: "客户类型",
        dataIndex: 'type',
        width:80,
        ellipsis: true,
        customRender:(text)=>{
          let name = ''
          switch(text){
            case '0' :
              name='客户';
              break;
            case '1' :
              name='合同';
              break;
            case '2' :
              name='结算主体';
              break;
          }
          return <a-tooltip
            placement="topLeft"
            title={name}
          >{name}</a-tooltip>
        }
      },{
        title: "授权时间",
        dataIndex: 'bePermissionTime',
        width:120,
        ellipsis: true,
        customRender:(text)=>{
          return <a-tooltip
            placement="topLeft"
            title={text}
          >{text}</a-tooltip>
        }
      },{
        title: "授权来源",
        dataIndex: 'permissonSrc',
        width:150,
        ellipsis: true,
        customRender:(text)=>{
          return <a-tooltip
            placement="topLeft"
            title={text}
          >{text}</a-tooltip>
        }
      },{
        title: '操作',
        key: 'operation',
        align: 'center',
        width:180,
        fixed:'right',
        scopedSlots: { customRender: 'action' }
      }],
      dataSource:[]
    }
  },
  methods: {
    show(record) {
      this.model = record
      this.getPageDate(1,10)
      this.visible = true
    },
    getPageDate(current,size){
      let url = `${this.url.list}${this.model.userId}&current=${current}&size=${size}`
      if(JSON.stringify(this.queryParam) !== '{}'){
        const qs = require('qs')
        url += `&${qs.stringify(this.queryParam)}`
      }
      httpAction(url,null,'GET').then((res)=>{
        if(res.code === 200){
          this.dataSource = res.data.records
          this.ipagination.total = res.data.total
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    tableChange(pagination){
      //分页、排序、筛选变化时触发
      this.ipagination = pagination
      this.getPageDate(pagination.current,pagination.pageSize)
    },
    handleDelete(id){
      httpAction(this.url.delOne+id,null,'delete').then((res)=>{
        if(res.code === 200){
          this.$message.success("删除成功！")
          this.getPageDate(this.ipagination.current,this.ipagination.pageSize)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.visible = false
      this.model = {}
    },
    searchQuery() {
      this.getPageDate(1,10)
    },
    searchReset() {
      this.queryParam = {}
      this.$router.push({
        query: {}
      })
      this.getPageDate(1,10)
    },

  }
}
</script>

