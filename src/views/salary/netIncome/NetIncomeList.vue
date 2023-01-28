<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <a-input
                v-model="queryParam.departName"
                placeholder=""
              />
            </a-form-item>
          </a-col>

          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="发放状态">
              <a-select
                v-model="queryParam.status"
                placeholder="请选择"
                default-value="0"
              >
                <a-select-option
                  v-for="(item,index) in querySalaryStatusOptions"
                  :key="index"
                  :value="index"
                >{{ item.option }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">

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

    <div
      class="table-operator"
      style="margin-bottom:10px"
    >
      <a-button
        type="primary"
        @click="handleAdd"
      >报表导入</a-button>
      <a-button
        style="margin-left:20px"
        type="primary"
        @click="handleSumbitAll"
      >全部提交</a-button>
      <a-button
        style="margin-left:20px"
        type="primary"
        @click="handleDown"
      >下载模板</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1">
            <a-icon type="delete" />删除</a-menu-item>
          <!-- lock | unlock -->
          <a-menu-item key="2">
            <a-icon type="lock" />锁定</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
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
          <a-popconfirm
            title="确认提交吗?"
            @confirm="handleSumbit(record)"
            okText="确定"
            cancelText="取消"
          >
            <a href="#">提交</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="handleView(record)">查看</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确认删除吗?"
            @confirm="handleDelete(record.id)"
            okText="确定"
            cancelText="取消"
          >
            <a
              href="#"
              v-have="'wxhr:tnetincome_del'"
            >删除</a>
          </a-popconfirm>
        </span>

        <!-- 发放状态 -->
        <span
          slot="salaryStatus"
          slot-scope="text, record"
        >
          <template v-for="(salaryStatus, key) in salaryStatusOptions">
            <a-tag
              :key="key"
              v-if="record.status == key"
              :color="salaryStatus.color"
            >{{ salaryStatus.option }}</a-tag>
          </template>
        </span>

      </a-table>
    </div>

    <!-- 全部提交 -->
    <a-modal
      title="是否全部提交"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <p>是否全部提交?</p>
    </a-modal>
    <!-- 表单区域 -->
    <net-income-export
      ref="modalForm"
      @ok="modalFormOk"
    ></net-income-export>
    <net-income-detail ref="incomeDetail"></net-income-detail>
  </a-card>
</template>
<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import NetIncomeExport from './modules/NetIncomeExport'
  import NetIncomeDetail from './modules/NetIncomeDetail'
  import { httpAction } from '@/api/manage'

  export default {
    name: "NetIncomeList",
    mixins: [JeecgListMixin],
    components: {
      NetIncomeExport,
      NetIncomeDetail
    },
    data () {
      return {
        visible:false,
        confirmLoading:false,
        queryParam: {},
        querySalaryStatusOptions: {
          '0':{'option': '待提交', 'color': 'green'},
          '1':{'option':'待审核', 'color': 'yellow'},
          '2':{'option':'已审核', 'color': 'black'},
          '3':{'option':'审核不通过', 'color': 'black'},
        },
        salaryStatusOptions:{
          '0':{'option': '待提交', 'color': 'green'},
          '1':{'option':'待审核', 'color': 'yellow'},
          '2':{'option':'已审核', 'color': 'black'},
          '3':{'option':'审核不通过', 'color': 'black'},
        },
        employData:[],
        columns: [
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'salaryStatus' },
          },
          {
            title: '费用月份',
            align: 'center',
            dataIndex: 'moneyMonth',
          },
          {
            title: '结算月份',
            align: 'center',
            dataIndex: 'settleMonth',
          },
          {
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDepartName'
          },
          {
            title: '人次',
            align: 'center',
            dataIndex: 'personTime',
          },
          {
            title: '结算金额',
            align: 'center',
            dataIndex: 'settleMoney',
          },
          {
            title: '银付',
            align: 'center',
            dataIndex: 'cardPay',
          },
          {
            title: '现付',
            align: 'center',
            dataIndex: 'moneyPay',
          },
          {
            title: '5%税',
            align: 'center',
            dataIndex: 'countTax5',
          },
          {
            title: '6%税',
            align: 'center',
            dataIndex: 'countTax6',
          },
          {
            title: '管理费',
            align: 'center',
            dataIndex: 'managementMoney',
          },
          
          {
            title: '到款金额',
            align: 'center',
            dataIndex: 'getMoneyValue',
            customRender: (text) => {
              return text ? text.toLocaleString() : '-'
            }
          },
          {
            title: '客服',
            align: 'center',
            dataIndex: 'customerService',
          },
          {
            title: '上传人',
            align: 'center',
            dataIndex: 'createUser',
            customRender:(text) => {
              for(let c in this.employData){
                if(c == text){
                  return this.employData[c]
                }
              }
              return '-'
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: '/salary/tnetincome/applyTNetIncomePage',
          delete: '/salary/tnetincome/',
          deleteBatch: '/hrBase/temployeeinfo/deleteBatch',
          doSumbitAll:'/salary/tnetincome/doSubmitAll',
          doSubmit:'/salary/tnetincome/doSubmit'
        },
      }
      
    },
    created(){
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if(res.code == 200){
          this.employData = res.data
        }
      })
    },
    methods:{
      //下载模板
      handleDown(){
        let templateUrl = '/templates/纯收入导入模板.xls'
        let url = window.location.protocol+'//'+window.location.hostname+':'+window.location.port+templateUrl
        window.location.href = url
      },
      //提交
      handleSumbit(record) {
        httpAction(this.url.doSubmit + '?id=' + record.id,{}, 'POST').then((res) => {
          if(res.code == 200){
            this.$message.success("提交成功")
            this.loadData()
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      //全部提交确认
      handleSumbitAll(){
        this.visible = true
      },
      //全部提交
      handleOk(){
        httpAction(this.url.doSumbitAll, {},'POST').then((res) => {
          if(res.code == 200){
            this.$message.success("提交成功")
            this.loadData()
            this.visible = false
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      handleCancel(){
        this.visible = false
      },
      handleView(record){
        this.$refs.incomeDetail.edit(record)
      },
      
    }
  }
</script>