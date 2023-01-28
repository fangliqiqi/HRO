<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form 
        layout="inline"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-row 
          :gutter="24" 
        >
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="二级归属部门">
              <a-select 
                :allowClear="true"
                placeholder="请选择二级归属部门" 
                show-search
                optionFilterProp="children"
                :filterOption="filterOption"
                v-model="queryParam.incomeBelongSub"
              >
                <a-select-option
                  v-for="item in incomeBelongSubOptions"
                  :key="item.incomeBelongSub"
                  :value="item.incomeBelongSub"
                >
                  <a-tooltip>
                    <template slot="title">
                      {{ item.incomeBelongSubName }}
                    </template>
                    {{ item.incomeBelongSubName }}
                  </a-tooltip>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="查阅人">
              <a-input
                allowClear
                placeholder="查阅人"
                v-model="queryParam.userName"
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
              <!-- <a
                @click="handleToggleSearch"
                style="margin-left: 8px"
              >
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button
        type="primary"
        @click="handleAdd"
        v-has="'wxhr:tadvanceuseauth_edit'"
        style="margin-right:10px;"
      >添加</a-button>
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
        :scroll="{x: 1}"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a 
            @click="handleEdit(record)" 
            v-has="'wxhr:tadvanceuseauth_edit'"
          >编辑</a>
        </span>
      </a-table>
    </div>

    <advance-amount-permission-modal ref="modalForm" @ok="modalFormOk"></advance-amount-permission-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SelectPage from '@/components/jeecg/SelectPage'
import AdvanceAmountPermissionModal from './modules/AdvanceAmountPermissionModal'
import { httpAction} from '@/api/manage'


export default {
  name: 'AdvanceAmountPermission',//垫付额度权限
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
    AdvanceAmountPermissionModal
  },
  data(){
    return {
      loading: false,
      downLoading:false, //导出
      dataSource:[],//列表数据
      incomeBelongSubOptions:[],//二级归属部门
      labelCol: {
        xs: { span: 6 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span:14}
      },
      // 表头
      columns: [
        {
          width: 400,
          ellipsis: true,
          title: '二级归属部门',
          align: 'center',
          dataIndex: 'incomeBelongSubName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '查阅人',
          align: 'center',
          dataIndex: 'userName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 120,
          fixed:'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/hrApproval/tadvanceuseauth/page',
        getOrgForCus:'/hrApproval/tadvanceuseset/getIncomeBelongSubList',//二级归属部门
      },
    }
  },
  created(){
  
  },
  methods:{
    // 添加
    handleAdd(){
      this.$refs.modalForm.show()
      this.$refs.modalForm.incomeBelongSubOptions = this.incomeBelongSubOptions
    },
    // 下拉搜索
    filterOption(input, option) {
      const item = option.componentOptions.children[0].componentOptions.children[1].text.replace(/\\n/g,'').replace(/(^\s*)|(\s*$)/g,'');
      return item.indexOf(input) >= 0;
    },
    // 详情
    handleEdit(record) {
      // console.log(record);
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.incomeBelongSubOptions = this.incomeBelongSubOptions
      
    },
    // 初始
    initDictConfig(){
      // 获取二级部门
      httpAction(this.url.getOrgForCus,'','GET').then(res=>{
        if(res.code==200){
          this.incomeBelongSubOptions = res.data
        }else{
          this.$message.error(res.msg);
        }
      })
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
.labelTxt{
  :global(.ant-form-item-label) {
    width: 100px !important;
  }
}

</style>
