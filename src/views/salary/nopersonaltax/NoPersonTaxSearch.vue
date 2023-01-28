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
          
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="发放人">
              <select-page
                :searchUrl="'admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                placeholder="请选择发放人"
                :id="'userId'"
                v-model="queryParam.revenueUser"
                style="width:100%"
              ></select-page>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
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
              <a-form-item label="结算金额">
                <a-input
                  placeholder="请输入结算金额"
                  v-model="queryParam.settlementAmount"
                  @change="changeMoney"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="开始时间">
                <a-date-picker
                  v-model="queryParam.createTimeStart_extra"
                  style="width: 100%"
                  placeholder="请选择开始时间"
                  @change="handleTimeBeginChange"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结束时间">
                <a-date-picker
                  v-model="queryParam.createTimeEnd_extra"
                  style="width: 100%"
                  placeholder="请选择结束时间"
                  @change="handleTimeEndChange"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="发放开始">
                <a-date-picker
                  v-model="queryParam.dateTemp2"
                  style="width: 100%"
                  placeholder="请选择开始时间"
                  @change="handleTimeRevenBeginChange"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="发放结束">
                <a-date-picker
                  v-model="queryParam.dateTemp3"
                  style="width: 100%"
                  placeholder="请选择结束时间"
                  @change="handleTimeRevenEndChange"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col
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
            </a-col>

            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体编码">
                <a-input
                  placeholder="请输入结算主体编码"
                  v-model="queryParam.departNo"
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
        :scroll="{x: 1}"
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
            @click="handleDetail(record)"
            v-have="'wxhr:check_salary'"
          >查看工资</a>
          <a-divider
            type="vertical"
            v-if="record.status == 3"
            v-have="'wxhr:tsalarystandard_edit'"
          />
          <a
            v-if="record.status == 3"
            @click="handleEdit(record)"
            v-have="'wxhr:tsalarystandard_edit'"
          >款项来源</a>
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
    <search-no-person-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></search-no-person-modal>
    <search-detail-modal ref="modalDetail"></search-detail-modal>
  </a-card>
</template>
<script>
import Vue from 'vue'
import { httpAction } from '@/api/manage'
import { getAreaName } from '@/utils/common'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SearchDetailModal from './modules/NoPersonTaxSearchDetail'
import SearchNoPersonModal from './modules/NoPersonTaxSearchModule'
import SelectPage from '@/components/jeecg/SelectPage'

export default {
  name: "NoPersonTaxSearch",
  components: {
    SearchDetailModal,
    SearchNoPersonModal,
    SelectPage
  },
  mixins: [JeecgListMixin],
  data() {
    return{
      salaryStatusOptions:{
        '0':{'option': '待提交', 'color': 'green'},
        '1':{'option': '待审核', 'color': 'red'},
        '3':{'option': '待发放', 'color': 'blue'},
        '4':{'option': '已发放', 'color': 'orange'},
        '5':{'option':'审核不通过', 'color': 'yellow'},
        '7':{'option':'财务退回', 'color': 'black'},
      },
      idAreaTrees: [],
      idAreaCitys: [],
      idAreaTowns:[],
      employData:{},
      url: {
        list: '/salary/tsalarystandard/searchSalaryStandardPage?type=1',
        getOrgForCus:'/admin/organizationinfo/getOrgForCus',
        openBill:'/salary/salary/openBill', // 详情
      },
      // 查询参数
      queryParam: {},
      columns: [
        {
          width: 140,
          ellipsis: true,
          title: '发放状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'salaryStatus' },
        },
        {
          width: 180,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'departName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 160,
          ellipsis: true,
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'departNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '结算月份',
          dataIndex: 'settlementMonth',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '省市区',
          align:'center',
          dataIndex: 'province',
          customRender:(text,record) => {
            const resultText = getAreaName(record.province,record.city,record.town) || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
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
          width: 140,
          ellipsis: true,
          title: '发放人',
          align:'center',
          dataIndex: 'revenueUser',
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
          width: 140,
          ellipsis: true,
          title: '结算金额',
          align: 'center',
          dataIndex: 'settlementAmount',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '开票金额',
          align: 'center',
          dataIndex: 'ticketAmount',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '款项来源',
          align: 'center',
          dataIndex: 'moneyFrom',
          customRender:(text) => {
            const options = {'0':'客户到款','1':'垫付'}
            const resultText = options[String(text)] || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 170,
          ellipsis: true,
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 170,
          ellipsis: true,
          title: '发放时间',
          align: 'center',
          dataIndex: 'revenueTime',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        }
      ],
    }
  },
  created () {
    this.idAreaTrees = Vue.ls.get('glob_area')
    httpAction('/admin/user/userDic','','GET').then((res) => {
      if(Number(res.code) === 200){
        this.employData = res.data
      }
    })
  },
  methods:{
    
    // 起始时间选择
    handleTimeBeginChange(date) {
      // 时间格式化
      this.queryParam.createTimeStart = date ? (date.format("YYYY-MM-DD")) : null
    },
    // 截止时间选择
    handleTimeEndChange(date) {
      // 时间格式化
      this.queryParam.createTimeEnd = date ? (date.format("YYYY-MM-DD")) : null
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
    handleDetail(record) {
      const url = `${this.url.openBill}?salaryFormId=${record.id}`
      httpAction(url,{},'POST').then((res) => {
        if(Number(res.code) === 200){
          this.$refs.modalDetail.title = '详情'
          this.$refs.modalDetail.employData = this.employData
          this.$refs.modalDetail.show(record,res.data || {})
        }else {
          this.$message.warn(res.msg || '详情获取失败！')
        }
      })
    },
    handleTimeRevenBeginChange(date){
      // 时间格式化
      this.queryParam.revenueTimeStart = date ? (date.format("YYYY-MM-DD")) : null
    },
    handleTimeRevenEndChange(date){
      // 时间格式化
      this.queryParam.revenueTimeEnd = date ? (date.format("YYYY-MM-DD")) : null
    },
    changeMoney(e){
      let val = e.target.value
      val = val.replace(/[^\d.]/g,"")
      val = val.replace(/^\./g,"")
      val = val.replace(/\.{2,}/g,".")
      val = val.replace(".","$#$").replace(/\./g,"").replace("$#$",".")
      // eslint-disable-next-line
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
      this.queryParam.settlementAmount = val
    }
  }
}
</script>
