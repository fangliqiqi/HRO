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
            <a-form-item label="结算月份">
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
          <a
            @click="handleSumbit(record)"
            v-have="'wxhr:tsalarystandard_doAudit'"
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

    <no-person-audit-detail
      ref="modalCheck"
      @ok="modalFormOk"
    ></no-person-audit-detail>
  </a-card>
</template>
<script>
import Vue from 'vue'
import { httpAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getSettlementAuthorityByUser } from '@/api/api'
import NoPersonAuditDetail from './modules/NoPersonAuditDetail'
import SelectPage from '@/components/jeecg/SelectPage'

export default {
  name: "NoPersonAudit",
  mixins: [JeecgListMixin],
  components: {
    NoPersonAuditDetail,
    SelectPage
  },
  data() {
    return{
      salaryStatusOptions:{
        '0':{'option': '待提交', 'color': 'green'},
        '1':{'option': '待审核', 'color': 'red'},
        '3':{'option': '待发放', 'color': 'blue'},
        '4':{'option': '已发放', 'color': 'orange'},
        '5':{'option':'审核不通过', 'color': 'yellow'},
        '6':{'option':'确认不通过', 'color': 'purple'},
        '7':{'option':'财务退回', 'color': 'black'},
        '8':{'option':'结算单调整待审核', 'color': 'pink'}, 
        '9':{'option':'结算单调整待打印', 'color': 'deepskyblue'}
      },
      idAreaTrees:[],
      idAreaCitys:[],
      idAreaTowns: [],
      employData:{},
      queryParam: {},
      url: {
        list: '/salary/tsalarystandard/auditSalaryStandardPage?type=1&status=1',
        delegateUrl:'/salary/tsalarystandard/doDelegationAudit',
        getOrgForCus:'/admin/organizationinfo/getOrgForCus',
        openBill:'/salary/salary/openBill', // 详情
      },
      columns: [
          {
            title: '发放状态',
            dataIndex: 'status',
            align:'center',
            scopedSlots: { customRender: 'salaryStatus' },
          },
          {
            title: '结算主体',
            align:'center',
            dataIndex: 'departName'
          },
          {
            title: '结算月份',
            width: 120,
            dataIndex: 'settlementMonth',
            align: 'center',
          },
          {
            title: '省市区',
            align:'center',
            dataIndex: 'province',
            customRender:(text,record) => {
              let area = '-'
              if(text){
                for(const c of this.idAreaTrees) {
                  if(String(c.id) === String(text)){
                    area = c.areaName
                    for(const m of c.children){
                      if(String(m.id) === String(record.city)){
                        area = `${area}-${m.areaName}`
                        for(const n of m.children){
                          if(n.id == record.town){
                            area = `${area}-${n.areaName}`
                            break
                          }
                        }
                        break
                      }
                    }
                    break
                  }
                }
              }
              return area
            }
          },
          {
            title: '上传人',
            align:'center',
            dataIndex: 'createUser',
            customRender:(text) => {
              for(const c in this.employData){
                if(String(c) === String(text)){
                  return this.employData[c]
                }
              }
              return '-'
            }
          },
          {
            title: '结算金额',
            align:'center',
            dataIndex: 'settlementAmount',
            customRender: (text) => {
              return text ? text.toLocaleString() : '-'
            }
          },
          
          {
            title: '操作',
            align:'center',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' },
          }
        ],
    }
  },
  created () {
    this.idAreaTrees = Vue.ls.get('glob_area')
    this.loadSettlementList()
    httpAction('/admin/user/userDic','','GET').then((res) => {
      if(Number(res.code) === 200){
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
      this.idAreaCitys = []
      for(const c of this.idAreaTrees[value - 1].children) {
        this.idAreaCitys.push(c)
      }
      delete this.queryParam.city
      delete this.queryParam.town
    },
    handleIdCityChange(value) {
      this.idAreaTowns = []
      for(const c of this.idAreaCitys) {
        if(String(c.id) === String(value)){
          for(const d of c.children){
            this.idAreaTowns.push(d)
          }
        }
      }
    },
    handleSumbit(record) {
      const url = `${this.url.openBill}?salaryFormId=${record.id}`
      httpAction(url,{},'POST').then((res) => {
        if(Number(res.code) === 200){
          this.$refs.modalCheck.show(record,res.data || {})
          this.$refs.modalCheck.title = '审核'
          this.$refs.modalCheck.employData = this.employData
        }else {
          this.$message.warn(res.msg || '详情获取失败！')
        }
      })
    },
  }
}
</script>
