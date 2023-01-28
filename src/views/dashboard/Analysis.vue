<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col
        :sm="24"
        :md="12"
        :xl="6"
        :style="{ marginBottom: '24px' }"
      >
        <chart-card
          :loading="loading"
          title="今日财务出账总额"
          :total="accountAll"
        >
          <a-tooltip
            title="今日财务出账总额"
            slot="action"
          >
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <span
              slot="term"
              style="margin-right:16px"
            >工资出账 {{ accountData.salaryAccount ? accountData.salaryAccount.toFixed(2) : 0 }}</span>

            <span
              slot="term"
              style="margin-right:16px"
            >商险出账 {{ accountData.insuranceAccount ? accountData.insuranceAccount.toFixed(2) : 0 }}</span>
          </div>
          <template slot="footer">社保公积金出账<span> {{ accountData.socialAccount ? accountData.socialAccount.toFixed(2) : 0 }}</span></template>
        </chart-card>
      </a-col>
      <a-col
        :sm="24"
        :md="12"
        :xl="6"
        :style="{ marginBottom: '24px' }"
      >
        <chart-card
          :loading="loading"
          title="年度派增量"
          :total="yearAdd"
        >
          <a-tooltip
            title="社保公积金派增量"
            slot="action"
          >
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area :dataSource="yearAddData" />
          </div>
          <template slot="footer">本月派增量<span> {{ monthAdd }}</span></template>
        </chart-card>
      </a-col>
      <a-col
        :sm="24"
        :md="12"
        :xl="6"
        :style="{ marginBottom: '24px' }"
      >
        <chart-card
          :loading="loading"
          title="年度派减量"
          :total="yearReduce"
        >
          <a-tooltip
            title="社保公积金派减量"
            slot="action"
          >
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar
              :height="40"
              :dataSource="yearReduceData"
            />
          </div>
          <template slot="footer">本月派减量 <span>{{ monthReduce }}</span></template>
        </chart-card>
      </a-col>
      <!--<a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="运营活动效果" total="78%">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" :height="8" />
          </div>
          <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">同周比</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">日环比</span>
              80%
            </trend>
          </template>
        </chart-card>
      </a-col>-->
      <a-col
        :sm="24"
        :md="12"
        :xl="6"
        :style="{ marginBottom: '24px' }"
      >
        <chart-card
          :loading="loading"
          title="月度收入"
          :total="monthIncomeAll"
        >
          <a-tooltip
            title="指标说明"
            slot="action"
          >
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <!--<div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">周同比</span>
              12%
            </trend>
            <trend flag="down">
              <span slot="term">日同比</span>
              11%
            </trend>
          </div>-->
          <div>
            <mini-bar
              :height="40"
              :dataSource="monthIncomeData"
            />
          </div>
          <template slot="footer">月度收入 <span style="color: lawngreen; font-weight: bold">{{ monthIncomeAll }}</span></template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card
      :loading="loading"
      :bordered="false"
      :body-style="{padding: '0'}"
    >
      <div class="salesCard">
        <a-tabs
          default-active-key="1"
          size="large"
          :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}"
        >
          <div
            class="extra-wrapper"
            slot="tabBarExtraContent"
          >
            <div class="extra-item">
              <a @click="yearChange">本年</a>
              <a @click="monthChange">本月</a>
            </div>
          </div>
          <a-tab-pane
            loading="true"
            tab="总收入"
            key="1"
          >
            <a-row>
              <a-col
                :xl="16"
                :lg="12"
                :md="12"
                :sm="24"
                :xs="24"
              >
                <bar
                  :title="incomeTitle"
                  :dataSource="barData"
                />
              </a-col>
              <a-col
                :xl="8"
                :lg="12"
                :md="12"
                :sm="24"
                :xs="24"
              >
                <rank-list
                  :height="250"
                  title="分子公司收入排行榜"
                  :list="rankList"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane
            tab="成本支出"
            key="2"
          >
            <a-row>
              <a-col
                :xl="16"
                :lg="12"
                :md="12"
                :sm="24"
                :xs="24"
              >
                <bar
                  :title="costTitle"
                  :dataSource="barCostData"
                />
              </a-col>
              <a-col
                :xl="8"
                :lg="12"
                :md="12"
                :sm="24"
                :xs="24"
              >
                <rank-list
                  title="分子公司成本支出排行榜"
                  :list="rankCostList"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <a-row :gutter="12">
      <a-col
        :xl="12"
        :lg="24"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <a-card
          :loading="loading"
          :bordered="false"
          title="成本类别占比"
          :style="{ marginTop: '24px' }"
        >
          <a-dropdown
            :trigger="['click']"
            placement="bottomLeft"
            slot="extra"
          >
            <a
              class="ant-dropdown-link"
              href="#"
            >
              <a-icon type="ellipsis" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a
                  href="javascript:;"
                  @click="yearCostChange"
                >本年度</a>
              </a-menu-item>
              <a-menu-item>
                <a
                  href="javascript:;"
                  @click="monthCostChange"
                >本月度</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <div>
            <a-row>
              <a-col>
                <a-tag color="pink">{{ rateCostTitle }}</a-tag>
              </a-col>
            </a-row>
            <v-chart
              :forceFit="true"
              :height="height"
              :data="rateCostData"
              :scale="scale"
            >
              <v-tooltip
                :showTitle="false"
                dataKey="item*percent"
              />
              <v-axis />
              <v-legend dataKey="item" />
              <v-pie
                position="percent"
                color="item"
                :v-style="pieStyle"
                :label="labelConfig"
              />
              <v-coord type="theta" />
            </v-chart>
          </div>
        </a-card>
      </a-col>
      <a-col
        :xl="12"
        :lg="24"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <a-card
          :loading="loading"
          :bordered="false"
          title="收入类别占比"
          :style="{ marginTop: '24px' }"
        >
          <a-dropdown
            :trigger="['click']"
            placement="bottomLeft"
            slot="extra"
          >
            <a
              class="ant-dropdown-link"
              href="#"
            >
              <a-icon type="ellipsis" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a
                  href="javascript:;"
                  @click="yearRateChange"
                >本年度</a>
              </a-menu-item>
              <a-menu-item>
                <a
                  href="javascript:;"
                  @click="monthRateChange"
                >本月度</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <div>
            <a-row>
              <a-col>
                <a-tag color="pink">{{ rateTitle }}</a-tag>
              </a-col>
            </a-row>
            <v-chart
              :forceFit="true"
              :height="height"
              :data="rateData"
              :scale="scale"
            >
              <v-tooltip
                :showTitle="false"
                dataKey="item*percent"
              />
              <v-axis />
              <v-legend dataKey="item" />
              <v-pie
                position="percent"
                color="item"
                :v-style="pieStyle"
                :label="labelConfig"
              />
              <v-coord type="theta" />
            </v-chart>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import ChartCard from '@/components/ChartCard'
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import MiniArea from '@/components/chart/MiniArea'
  import MiniBar from '@/components/chart/MiniBar'
  import MiniProgress from '@/components/chart/MiniProgress'
  import RankList from '@/components/chart/RankList'
  import Bar from '@/components/chart/Bar'
  import Trend from '@/components/Trend'
  import {getLoginfo} from '@/api/api'
  import {httpAction} from '@/api/manage'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'

  const DataSet = require('@antv/data-set');
  const scale = [{
    dataKey: 'percent',
    min: 0,
    formatter: '.0%',
  }];
  export default {
    name: "Analysis",
    components: {
      ATooltip,
      ACol,
      ChartCard,
      MiniArea,
      MiniBar,
      MiniProgress,
      RankList,
      Bar,
      Trend
    },
    data() {
      return {
        loading: true,
        center: null,
        rankList: [],
        rankCostList: [], // 成本支出排行榜
        barData:[],
        barCostData:[], // 成本支出树状图
        loginfo:{},
        yearRateData:[],//年收入比
        monthRateData:[], //月收入比
        yearRateCostData:[],//年成本比
        monthRateCostData:[],//月成本比
        rateCostData:[],// 成本比展示数据
        rateData:[],
        scale,
        height: 400,
        accountData:{},
        yearAddData: [],
        yearReduceData: [],
        monthIncomeData: [], // 月度收入树状图
        yearIncomeData: [], // 月度收入树状图
        monthCostData: [], //月度支出树状图
        yearCostData: [], // 年度支出树状图
        yearRankList: [],
        monthRankList:[],
        yearRankCostList:[], // 年度成本占比排行
        monthRankCostList:[], // 月度收入占比排行
        pieStyle: {
          stroke: "#fff",
          lineWidth: 1
        },
        monthAdd:0, //本月派增量
        monthReduce:0, //本月派减量
        accountAll:'',
        yearAdd: '',
        yearReduce: '', // 年度派减量
        monthIncomeAll: '', //月度收入和
        formTypeList: [],
        approvalTypeList:[],
        incomeTitle:"年度收入总趋势",
        rateTitle:"年度收入占比",
        rateCostTitle:"年度成本占比",
        costTitle:"年度成本支出趋势",
        labelConfig: ['percent', {
          formatter: (val, item) => {
            return item.point.item + ': ' + val;
          }
        }],
        url: {
          accountUrl: "/salary/salaryStatistics/account",
          socialAccount: "/hrSocial/dispatchStatistics/getAccount",
          yearAdd:"/hrSocial/dispatchStatistics/count/",
          income:"/salary/salaryStatistics/income/",
          rank:"/salary/salaryStatistics/companyRanking/",
          rateUrl:"/salary/salaryStatistics/incomeComponent/",
          rateCost: "/hrApproval/tcostinfo/hompage/getHomePagePercent",
          rankCost:"/hrApproval/tcostinfo/hompage/getHomePageRank",
          cost: "/hrApproval/tcostinfo/hompage/getCount"
        }
      }
    },
    created() {
      this.show()
    },
    methods: {
      show() {
        httpAction(`/hrBase/sysdictbusinesstype/getSysDictBusinessTypeList?itemType=customer_business_type`,null,'get').then((res) => {
          if (res.code === 200) {
            this.formTypeList = res.data
          }
        })
        initDictOptions('cost_approval_from_type').then((res) => {
          if (res.code === 200) {
            this.approvalTypeList = res.data
          }
        })
        setTimeout(() => {
          this.loading = !this.loading
        }, 1000)
        this.initLogInfo();
        this.account()
        this.getYearAdd()
        this.getYearReduce()
        this.getMonthIncome()
        this.getYearIncome()
        this.getRank(1)
        this.getRank(0)
        this.getRate(1)
        this.getRate(0)
        this.getRateCost(2) // 年度占比
        this.getRateCost(1) // 月度占比
        this.getRankCost(2) // 年度占比排行
        this.getRankCost(1) // 月度占比排行
        this.getCost(2) // 年度支出树状图
        this.getCost(1) // 月度支出树状图
      },
      initLogInfo () {
        getLoginfo(null).then((res)=>{
          if(res.code === 200){
            this.loginfo.todayVisitCount = res.data;
          }
        })
      },
      // 今日出账总额
      account() {
        httpAction(this.url.accountUrl, {}, 'GET').then((res) => {
          if(Number(res.code) === 200){
            this.accountData = res.data
            const salaryAccount = res.data.engineeringAccount + res.data.standAccount
            this.accountData.salaryAccount = salaryAccount
            httpAction(this.url.socialAccount, {}, 'GET').then((res) => {
              if(Number(res.code) === 200){
                this.accountData.socialAccount = res.data
                const accountAll = this.accountData.salaryAccount + this.accountData.socialAccount + this.accountData.insuranceAccount
                this.accountAll = "￥" + accountAll.toFixed(2)
              }
            })
          }
        })
      },
      // 年度派增量
      getYearAdd() {
        httpAction(this.url.yearAdd + 0, {}, "GET").then((res) => {
          if(Number(res.code) === 200){
            let nowMonth = new Date().getMonth() + 1
            if(nowMonth < 10){
              nowMonth = `0${nowMonth}`
            }
            const addData = res.data[0]
            const sourceData = []
            let yearAdd = 0
            for(const c in addData){
              if(String(addData[c].month) === String(nowMonth)){
                this.monthAdd = addData[c].number
              }
              sourceData.push({
                x: `${addData[c].month}月`,
                y: addData[c].number
              })
              yearAdd = yearAdd + addData[c].number
            }
            this.yearAdd = yearAdd + ''
            this.yearAddData = sourceData
          }
        })
      },
      // 年度派减量
      getYearReduce() {
        httpAction(this.url.yearAdd + 1, {}, "GET").then((res) => {
          if(Number(res.code) === 200){
            let nowMonth = new Date().getMonth() + 1
            if(nowMonth < 10){
              nowMonth = `0${nowMonth}`
            }
            const reduceData = res.data[1]
            const sourceData = []
            let yearReduce = 0
            if(reduceData.length > 0){
              for(const c in reduceData){
                if(reduceData[c].month === nowMonth){
                  this.monthReduce = reduceData[c].number
                }
                sourceData.push({
                  x: `${reduceData[c].month}月`,
                  y: reduceData[c].number
                })
                yearReduce = yearReduce + reduceData[c].number
              }
            }
            this.yearReduce = yearReduce + ''
            this.yearReduceData = sourceData
          }
        })
      },
      // 获取月度收入统计
      getMonthIncome(){
        httpAction(this.url.income + 0, {}, "GET").then((res) => {
          if(res.code === 200){
            const incomeData = res.data
            const sourceData = []
            let monthIncomeAll = 0
            for(const c in incomeData){
              monthIncomeAll = monthIncomeAll + incomeData[c].value
              sourceData.push({
                x: incomeData[c].key,
                y: incomeData[c].value
              })
            }
            this.monthIncomeAll = "￥" + monthIncomeAll.toFixed(2)
            this.monthIncomeData = sourceData
          }
        })
      },
      // 获取年度收入统计
      getYearIncome(){
        httpAction(this.url.income + 1, {}, "GET").then((res) => {
          if(res.code === 200){
            const incomeData = res.data
            const sourceData = []
            for(const c in incomeData){
              sourceData.push({
                x: incomeData[c].key + "月",
                y: incomeData[c].value
              })
            }
            this.barData = sourceData
            this.yearIncomeData = sourceData
          }
        })
      },
      // 获取成本支出树状图数据
      getCost(index) {
        httpAction(`${this.url.cost}?type=${index}`, {}, "GET").then((res) => {
          if(res.code === 200){
            const costData = res.data
            const sourceData = []
            for(const c in costData){
              sourceData.push({
                x: costData[c].key + "月",
                y: costData[c].value
              })
            }
            if(Number(index) === 2){
              this.barCostData = sourceData
              this.yearCostData = sourceData
            }
            if(Number(index) === 1){
              this.monthCostData = sourceData
            }
          }
        })
      },
      // 获取收入排行
      getRank(index) {
        httpAction(this.url.rank + index, {}, "GET").then((res) => {
          if(Number(res.code) === 200){
            const rankData = res.data
            const sourceData = []
            for(const c in rankData){
              sourceData.push({
                name: rankData[c].key,
                total: rankData[c].value
              })
            }
            if(Number(index) === 1){
              this.rankList = sourceData
              this.yearRankList = sourceData
            }
            if(Number(index) === 0){
              this.monthRankList = sourceData
            }
          }
        })
      },
      // 比例收入百分比
      getRate(index) {
        httpAction(this.url.rateUrl + index, {}, "GET").then((res) => {
          if(Number(res.code) === 200){
            const sourceData = []
            const rateData = res.data
            for(const c in rateData){
              let item
              for(const d of this.formTypeList){
                if(String(d.id) === String(rateData[c].key)){
                  item = d.label
                }
              }
              sourceData.push({
                item: item?item:'其他',
                count: rateData[c].value
              })
            }
            const dv = new DataSet.View().source(sourceData);
            dv.transform({
              type: 'percent',
              field: 'count',
              dimension: 'item',
              as: 'percent'
            });
            if(Number(index) === 1){
              this.yearRateData = dv.rows
              this.rateData = dv.rows
            }
            if(Number(index) === 0){
              this.monthRateData = dv.rows
            }
          }
        })
      },
      // 成本比例
      getRateCost(index) {
        httpAction(`${this.url.rateCost}?type=${index}`, {}, "GET").then((res) => {
          if(Number(res.code) === 200){
            const sourceData = []
            const rateCostData = res.data
            for(const c in rateCostData){
              let item
              for(const d of this.approvalTypeList){
                if(String(d.value) === String(rateCostData[c].key)){
                  item = d.label
                }
              }
              sourceData.push({
                item: item,
                count: rateCostData[c].value
              })
            }
            const dv = new DataSet.View().source(sourceData);
            dv.transform({
              type: 'percent',
              field: 'count',
              dimension: 'item',
              as: 'percent'
            });
            console.log(dv.rows)
            if(Number(index) === 2){
              this.yearRateCostData = dv.rows
              this.rateCostData = dv.rows
            }
            if(Number(index) === 1){
              this.monthRateCostData = dv.rows
            }
          }
        })
      },
      // 获取成本排行榜
      getRankCost(index) {
        httpAction(`${this.url.rankCost}?type=${index}`, {}, "GET").then((res) => {
          if(Number(res.code) === 200){
            const rankCostData = res.data
            const sourceData = []
            for(const c in rankCostData){
              sourceData.push({
                name: rankCostData[c].key,
                total: rankCostData[c].value
              })
            }
            if(Number(index) === 2){
              this.rankCostList = sourceData
              this.yearRankCostList = sourceData
            }
            if(Number(index) === 1){
              this.monthRankCostList = sourceData
            }
          }
        })
      },
      monthChange(){
        this.incomeTitle = "月度收入趋势"
        this.costTitle = "月度成本支出趋势"
        this.barData = this.monthIncomeData
        this.barCostData = this.monthCostData
        this.rankList = this.monthRankList
        this.rankCostList = this.monthRankCostList
      },
      yearChange(){
        this.incomeTitle = "年度收入趋势"
        this.costTitle = "年度成本支出趋势"
        this.barCostData = this.yearCostData
        this.barData = this.yearIncomeData
        this.rankList = this.yearRankList
        this.rankCostList = this.yearRankCostList
      },
      yearRateChange(){
        this.rateData = this.yearRateData
        this.rateTitle = "年度收入占比"
      },
      monthRateChange(){
        this.rateData = this.monthRateData
        this.rateTitle = "月度收入占比"
      },
      yearCostChange(){
        this.rateCostData = this.yearRateCostData
        this.rateCostTitle = "年度成本占比"
      },
      monthCostChange(){
        this.rateCostData = this.monthRateCostData
        this.rateCostTitle = "月度成本占比"
      }
    }
  }
</script>

<style lang="scss" scoped>
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

/* 首页访问量统计 */
.head-info {
  position: relative;
  text-align: left;
  padding: 0 32px 0 0;
  min-width: 125px;

  &.center {
    text-align: center;
    padding: 0 32px;
  }

  span {
    color: rgba(0, 0, 0, 0.45);
    display: inline-block;
    font-size: 0.95rem;
    line-height: 42px;
    margin-bottom: 4px;
  }
  p {
    line-height: 42px;
    margin: 0;
    a {
      font-weight: 600;
      font-size: 1rem;
    }
  }
}
</style>
