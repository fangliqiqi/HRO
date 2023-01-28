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
                placeholder="请输入结算主体名称"
                v-model="queryParam.departName"
              >
              </a-input>
            </a-form-item>
          </a-col>

          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="上传人">
              <select-page
                :searchUrl="'admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                placeholder="请选择上传人"
                :id="'userId'"
                v-model="queryParam.createUser"
                style="width:100%"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="选省市区">
              <a-select
                placeholder="省"
                style="width: 32%"
                @change="handleIdProvinceChange"
                allowClear
                showSearch
                optionFilterProp="children"
                v-model="queryParam.province"
              >
                <a-select-option
                  v-for="(item, index) in idAreaTrees"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
              <a-select
                placeholder="市"
                style="margin-left: 2%; width: 32%"
                @change="handleIdCityChange"
                allowClear
                showSearch
                optionFilterProp="children"
                v-model="queryParam.city"
              >
                <a-select-option
                  v-for="(item, index) in idAreaCitys"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
              <a-select
                placeholder="区县"
                style="margin-left: 2%; width: 32%"
                v-model="queryParam.town"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                <a-select-option
                  v-for="(item, index) in idAreaTowns"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
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
          <a @click="handleView(record)">查看</a>
          <a-divider type="vertical" />
          <a
            @click="handleSumbit(record)"
            v-has="'wxhr:tnetincome_doAudit'"
          >审核</a>
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
    <a-modal
      title="审核"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleCheckCancel"
      @ok="handleCheckOk"
      cancelText="关闭"
      okText="确定"
      :visible="visibleCheck"
      :confirmLoading="confirmLoading"
      :maskClosable="false"
    >
      <a-form :form="form">
        <a-form-item label="是否通过">
          <a-radio-group v-decorator="['status', validatorRules.status ]">
            <a-radio :value="2">通过</a-radio>
            <a-radio :value="3">不通过</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="审核意见">
          <a-textarea v-decorator="['auditContent', validatorRules.auditContent]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>

    <net-income-detail ref="incomeDetail"></net-income-detail>
  </a-card>
</template>
<script>
import Vue from 'vue'
import { httpAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getSettlementAuthorityByUser } from '@/api/api'
import NetIncomeDetail from './modules/NetIncomeDetail'
import SelectPage from '@/components/jeecg/SelectPage'
//import NoPersonAuditDetail from './modules/NoPersonAuditDetail'

export default {
  name: "NetIncomeAudit",
  mixins: [JeecgListMixin],
  components: {
    NetIncomeDetail,
    SelectPage
  },
  data() {
    return{
      visibleCheck:false,
      confirmLoading:false,
      form:this.$form.createForm(this),
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
      idAreaTrees:[],
      idAreaCitys:[],
      idAreaTowns: [],
      model:{},
      queryParam: {},
      employData:{},
      url: {
        list: '/salary/tnetincome/auditTNetIncomePage',
        delegateUrl:'/salary/tsalarystandard/doDelegationAudit',
        getOrgForCus:'/admin/organizationinfo/getOrgForCus',
        doAuditUrl:'/salary/tnetincome/doAudit'
      },
      validatorRules:{
        status: { rules: [{ required: true, message: '请审核!' }] },
        auditContent: { rules: [{ required: true, message: '请输入审核意见!' }] },
      },
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
      }
  },
  created () {
    //getRoleList({ t: new Date()})
    this.idAreaTrees = Vue.ls.get('glob_area')
    this.loadSettlementList()
    httpAction('/admin/user/userDic','','GET').then((res) => {
      if(res.code == 200){
        this.employData = res.data
      }
    })
  },
  methods:{
    // 获取结算主体列表
    loadSettlementList() {
      getSettlementAuthorityByUser({}).then((res) => {
        console.log(res)
        this.settlementList = res.data
      })
    },
    // 身份证地址省份切换
    handleIdProvinceChange(value) {
      // this.queryParam.city = ''
      // this.queryParam.town = ''
      this.idAreaCitys = []

      for(var c of this.idAreaTrees[value - 1].children) {
        this.idAreaCitys.push(c)
      }
      delete this.queryParam.city
      delete this.queryParam.town
    },
    handleIdCityChange(value) {
      //this.queryParam.town = ''
      this.idAreaTowns = []
      for(var c of this.idAreaCitys) {
        if(c.id == value){
          for(let d of c.children){
            this.idAreaTowns.push(d)
          }
        }
      }
    },
    handleSumbit(record) {
      this.visibleCheck = true
      this.model = record
      this.form.resetFields()
    },
    handleCheckOk() {
      this.confirmLoading = true
      this.form.validateFields((err,values) => {
        if(!err){
          let formData = Object.assign({}, values)
          formData.id = this.model.id
          // wxhr:tsalarystandard_doAudit
          httpAction(this.url.doAuditUrl,formData,'POST').then((res) => {
            this.confirmLoading = false
            if(res.code == 200){
              this.$message.success("审核成功")
              this.visibleCheck = false
              this.loadData()
            }else{
              this.$message.error(res.msg)
            }
          })
        }else{
          this.confirmLoading = false
        }
      })
    },
    handleCheckCancel(){
      this.visibleCheck = false
    },
    handleView(record){
      this.$refs.incomeDetail.edit(record)
    }
  }
}
</script>
