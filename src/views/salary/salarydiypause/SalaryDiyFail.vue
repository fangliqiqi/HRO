<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="自定义项名称" class="labTxt">
              <a-input
                allowClear
                v-model="queryParam.empName"
                placeholder="自定义项名称"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体" class="labTxt">
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :placeholder="'请输入结算主体'"
                v-model="queryParam.settleDepartId"
                :id="'id'"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体编码" class="labTxt">
              <a-input
                allowClear
                v-model="queryParam.settleDepartNo"
                placeholder="结算主体编码"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算月份" class="labTxt">
                <a-month-picker
                  v-model="queryParam.settlementMonth"
                  style="width: 100%"
                  placeholder="请选择结算月份"
                  format="YYYYMM"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="银行账号" class="labTxt">
                <a-input
                  allowClear
                  v-model="queryParam.bankNo"
                  placeholder="银行账号"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="收款单位" class="labTxt">
                <a-input
                  allowClear
                  v-model="queryParam.orgName"
                  placeholder="收款单位"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="发放金额" class="labTxt">
                <a-input-number
                  allowClear
                  v-model="queryParam.money"
                  placeholder="发放金额"
                  :parser="limitAccount"
                  style="width:100%"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="失败标记人" class="labTxt">
                <select-page
                  :searchUrl="'admin/user/page/wxhr?nickname='"
                  :title="'nickname'"
                  placeholder="请选择失败标记人查询"
                  :id="'userId'"
                  v-model="queryParam.createUser"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="失败标记时间" class="labTxt">
                <a-range-picker @change="changeDate" v-model="queryParam.chargeDate_extra"/>
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
        :scroll="{ x: 1400 }"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleRegrand(record)"
          >重新发放</a>
        </span>

      </a-table>
    </div>

    <re-diy-grant-modal :title="title" ref="ReGrantForm" @ok="modalFormOk"></re-diy-grant-modal>

  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SelectPage from '@/components/jeecg/SelectPage'
import ReDiyGrantModal from './modules/ReDiyGrantModal'
import { httpAction } from '@/api/manage'
import { limitAccount } from '@/utils/common'

export default {
  name: 'SalaryDiyFail',
  mixins: [JeecgListMixin],
  components:{
    ReDiyGrantModal,
    SelectPage
  },
  data(){
    return{
      visible:false,
      title: '',
      form:this.$form.createForm(this),
      typeOption:['普通薪资','','非扣税项'],
      chargeTypeOption:['现金','银付','线下'],
      userList:{},
      columns:[
        {
          title: '自定义项名称',
          align: 'center',
          dataIndex: 'empName',
          width: 150,
          ellipsis: true,
          customRender: text => {
            const res = text || '-'
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleDepartName',
          width: 180,
          ellipsis: true,
          customRender: text => {
            const res = text || '-'
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'settleDepartNo',
          width: 120,
          ellipsis: true,
          customRender: text => {
            const res = text || '-'
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '结算月份',
          align: 'center',
          dataIndex: 'settlementMonth',
          width: 100,
          ellipsis: true,
          customRender: text => {
            const res = text || '-'
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '发放金额',
          align: 'center',
          dataIndex: 'money',
          width: 100,
          ellipsis: true,
          customRender: text => {
            const res = text == null ? '-' : text
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '发放方式',
          align: 'center',
          dataIndex: 'type',
          width: 100,
          ellipsis: true,
          customRender: text => {
            const res = this.chargeTypeOption[text] || '-'
            return <a-tooltip title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '收款单位',
          align: 'center',
          dataIndex: 'orgName',
          width: 150,
          ellipsis: true,
          customRender: text => {
            const res = text || '-'
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '银行账号',
          align: 'center',
          dataIndex: 'bankNo',
          width: 170,
          ellipsis: true,
          customRender: text => {
            const res = text ? text.replace(/^'/, "") : (text||'-');
            return <a-tooltip title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '开户行',
          align: 'center',
          dataIndex: 'bankName',
          width: 180,
          ellipsis: true,
          customRender: text => {
            const res = text || '-'
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '失败标记人',
          align: 'center',
          dataIndex: 'grantUser',
          width: 100,
          ellipsis: true,
          customRender: (text,record) => {
            let res = '-';
            if(text){
              res = this.userList[text];
            }else{
              res = this.userList[record.createUser] || '-';
            }
            return <a-tooltip title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '失败标记时间',
          align: 'center',
          dataIndex: 'grantDate',
          width: 150,
          ellipsis: true,
          customRender: (text,record) => {
            let res = '-';
            if(text){
              res = text;
            }else{
              res = record.createDate;
            }
            return <a-tooltip title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 110,
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        }
      ],
      url:{
        list: '/salary/lostandfoundinfo/getClaimPage?accountType=4&orders%5B0%5D.asc=true&orders%5B0%5D.column=create_date',
        user: '/admin/user/userDic'
      },
    }
  },
  created() {
    httpAction(`/admin/user/userDic`,null,'get').then(res=>{
      if(res.code === 200){
        this.userList = res.data
      }
    })
  },
  methods: {
    limitAccount,
    changeDate(val,dateString){
      this.queryParam.createDateStart = dateString[0]
      this.queryParam.createDateEnd = dateString[1]
    },
    handleRegrand(record){
      this.title = '重新发放'
      if(record.bankNo){
        record.bankNo = record.bankNo.replace(/^'/, "");
      }
      this.$refs.ReGrantForm.show(record);
    },
  }
  
}
</script>
<style lang="less" scoped>
.labTxt{
  :global(.ant-form-item-label){
    width: 97px !important;
  }
}

</style>
