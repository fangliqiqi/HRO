<template>
  <a-card :bordered="false">
    <!-- 查询 -->
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
            <a-form-item label="发放状态">
              <a-select
                v-model="queryParam.status"
                placeholder="请选择"
                default-value="0"
                :allowClear="true"
              >
                <a-select-option
                  v-for="(item,index) in salaryStatusOptions"
                  :key="index"
                  :value="index"
                >{{ item.option }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">

            <!-- <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算月份">
                <a-month-picker
                  v-model="queryParam.settlementMonth"
                  style="width: 100%"
                  placeholder="请选择结算月份"
                  format="YYYYMM"
                />
              </a-form-item>
            </a-col> -->

            <!-- <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="表单类型">
                <a-select
                  v-model="queryParam.formType"
                  placeholder="请选择"
                  default-value="0"
                  :allowClear="true"
                >
                  <a-select-option
                    v-for="(item,index) in formTypeOptions"
                    :key="index"
                    :value="item.value"
                  >{{ item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
            <!-- <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="款项来源">
                <a-select
                  v-model="queryParam.moneyFrom"
                  placeholder="请选择"
                  default-value="0"
                  :allowClear="true"
                >
                  <a-select-option value="0">客户到款</a-select-option>
                  <a-select-option value="1">垫付</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
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
        <span
          slot="departName"
          slot-scope="text"
          :style="handleColumnStyle(80)"
        >
          <a-tooltip
            placement="topLeft"
            :title="text"
          >
            {{ text }}
          </a-tooltip>
        </span>
      </a-table>
    </div>
    <net-income-detail ref="incomeDetail"></net-income-detail>
  </a-card>
</template>
<script>
import Vue from 'vue'
import { httpAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import NetIncomeDetail from './modules/NetIncomeDetail'
export default {
  name: "NetIncomeSearchList",
  components: {
    NetIncomeDetail
  },
  mixins: [JeecgListMixin],
  data() {
    return{
      querySalaryStatusOptions: {
        '0':{'option': '待提交', 'color': 'green'},
        '1':{'option':'待审核', 'color': 'yellow'},
        '2':{'option':'已审核', 'color': 'pink'},
        '3':{'option':'审核不通过', 'color': 'black'},
      },
      salaryStatusOptions:{
        '0':{'option': '待提交', 'color': 'green'},
        '1':{'option':'待审核', 'color': 'yellow'},
        '2':{'option':'已审核', 'color': 'pink'},
        '3':{'option':'审核不通过', 'color': 'black'},
      },
      idAreaTrees: [],
      idAreaCitys: [],
      idAreaTowns:[],
      employData:{},
      url: {
        list: '/salary/tnetincome/page',
        getOrgForCus:'/admin/organizationinfo/getOrgForCus'
      },
      // 查询参数
      queryParam: {},
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
    this.idAreaTrees = Vue.ls.get('glob_area')
    httpAction('/admin/user/userDic','','GET').then((res) => {
      if(res.code == 200){
        this.employData = res.data
      }
    })
  },
  methods:{
    // 身份证地址省份切换
    handleIdProvinceChange(value) {
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
    handleDetail(record) {
      this.$refs.modalDetail.show(record)
      this.$refs.modalDetail.title = '详情'
      this.$refs.modalDetail.employData = this.employData
    },
    // 隐藏列样式
    handleColumnStyle(width) {
      if (width) {
        return `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: ${width}px;`
      }
      return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
    },
    handleView(record){
      this.$refs.incomeDetail.edit(record)
    }
  }
}
</script>
