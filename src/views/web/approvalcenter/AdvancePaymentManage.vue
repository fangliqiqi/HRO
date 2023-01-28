<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" class="searchForm">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="客户名称" class="labelTxt">
              <a-input placeholder="客户名称" v-model="queryParam.customerName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="客户编码" class="labelTxt">
              <a-input placeholder="客户编码" v-model="queryParam.customerCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="客户性质" class="labelTxt">
              <a-select v-model="queryParam.nature" placeholder="请选择客户性质">
                <a-select-option v-for="item in customerNatures" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="行业类型" class="labelTxt">
                <a-select v-model="queryParam.industryBelong" placeholder="请选择行业类型" showSearch optionFilterProp="children">
                  <a-select-option v-for="item in industryBelongDictOptions" :key="item.id" :value="item.id">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="逾期未回款" class="labelTxt">
                <a-select v-model="queryParam.isOverdueNotBackPay" placeholder="是否逾期未回款">
                  <a-select-option value="1">是</a-select-option>
                  <a-select-option value="0">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="回款状态" class="labelTxt">
                <a-select
                  showSearch
                  mode="multiple"
                  placeholder="请选择回款状态"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  :getPopupContainer="getPopupContainerFun"
                  @change="changeBackPayStatus"
                  v-model="queryParam.backPayStatus_extra"
                >
                  <a-select-option
                    v-for="(item, index) in backPayStatusOption"
                    :key="index"
                    :value="item.value"
                  >{{ item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="垫付申请日期" class="labelTxt">
                <a-range-picker @change="changeRange2" v-model="queryParam.creat_extra"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="期望打款日期" class="labelTxt">
                <a-range-picker @change="changeRange" v-model="queryParam.range_extra"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-row type="flex">
        <a-col flex="1 1"><a-button type="primary" icon="download" @click="exportList">导出</a-button></a-col>
        <a-col flex="0 1 700px" style="text-align:right;line-height: 32px;color: #222;">
          合计：&nbsp;累计垫付：{{ totalData.advanceMoneyTotal }} &nbsp;&nbsp; 已回款金额：{{ totalData.paymentReceivedSumTotal }} &nbsp;&nbsp; 未回款金额：{{ totalData.advanceNotPaybackTotal }} &nbsp;&nbsp; 回款率：{{ Math.round(parseFloat(totalData.backRate||0)*10000)/100 }}%
        </a-col>
      </a-row>
    </div>
    <!-- table区域-begin -->
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
      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction,downFile } from '@/api/manage'
import { initDictOptions, filterDictText,filterDict } from '@/components/dict/JDictSelectUtil'
import moment from 'moment'

export default {
  name: 'AdvancePaymentManage',
  mixins: [JeecgListMixin],
  data() {
    return {
      loading: false,
      // 表头
      columns: [
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'customerName',
          width: 180,
          ellipsis: true,
          customRender:(text) => {
            return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '客户编码',
          align: 'center',
          dataIndex: 'customerCode',
          customRender:(text) => {
            return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '客户性质',
          align: 'center',
          dataIndex: 'nature',
          customRender:(text) => {
            const res = filterDictText(this.customerNatures, text)
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '行业类型',
          align: 'center',
          dataIndex: 'industryBelong',
          customRender:(text) => {
            const res = filterDict(this.industryBelongDictOptions, text)
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '累计垫付',
          align: 'center',
          dataIndex: 'advanceMoney',
          customRender:(text) => {
            return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '已回款金额',
          align: 'center',
          dataIndex: 'paymentReceivedSum',
          customRender:(text) => {
            return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '垫付未还款金额',
          align: 'center',
          dataIndex: 'advanceNotPayback',
          customRender:(text) => {
            return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '回款率',
          align: 'center',
          dataIndex: 'backRate',
          customRender:(text) => {
            const res = Math.round(parseFloat(text)*10000)/100 + "%"
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '回款状态',
          align: 'center',
          dataIndex: 'backPayStatus',
          customRender:(text) => {
            const res = this.backPayStatusOption.find(item=>item.value == text)
            const str = res ? res['label'] : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          title: '是否逾期未回款',
          align: 'center',
          dataIndex: 'isOverdueNotBackPay',
          customRender:(text) => {
            const res = text == 1 ? '是' : '否'
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          }
        },
      ],
      url: {
        list: '/hrApproval/tadvancepayment/monitor/listAdvancePayment',
        getTotal:'/hrApproval/tadvancepayment/monitor/sumAdvancePaymentMonitor',
        downUrl:'/hrApproval/tadvancepayment/monitor/exportAdvancePayment'
      },
      backPayStatusOption:[{value:'0',label:'未回款'},{value:'1',label:'部分回款'},{value:'2',label:'已回款'}],
      customerNatures:[],
      industryBelongDictOptions:[],
      totalData:{
        advanceMoneyTotal:'',
        paymentReceivedSumTotal:'',
        advanceNotPaybackTotal:'',
        backRate:'',
      }
    }
  },
  created(){
    this.getStatic({})
  },
  methods: {
    getStatic(params){
      const qs = require('qs')
      const httpurl = `${this.url.getTotal}?${qs.stringify(params)}`
      httpAction(httpurl,null,'get').then(res=>{
        console.log('haha');
        if(res.code === 200 && res.data){
          this.totalData = res.data
        }else{
          this.totalData = {}
        }
      })
    },
    changeBackPayStatus(val){
      if(val.length){
        this.queryParam.backPayStatus = val.join(',')
      }else{
        delete this.queryParam.backPayStatus
      }
    },
    searchQuery() {
      this.selectedRowKeys = []
      this.loadData(1)
      let params = this.getQueryParams()
      delete params.current
      delete params.size
      this.getStatic(params)
    },
    searchReset() {
      this.queryParam = {}
      this.selectedRowKeys = []
      this.loadData(1)
      this.getStatic({})
    },
    changeRange(value, dateString) {
      if(Object.keys(value).length){
          this.queryParam.startDate = dateString[0] 
          this.queryParam.endDate = dateString[1]
        }else{
          // 删除 
          delete this.queryParam.startDate
          delete this.queryParam.endDate
        }
    },
    changeRange2(value, dateString) {
      if(Object.keys(value).length){
          this.queryParam.createTimeStart = dateString[0] 
          this.queryParam.createTimeEnd = dateString[1]
        }else{
          // 删除 
          delete this.queryParam.createTimeStart
          delete this.queryParam.createTimeEnd
        }
    },
    exportList() {
      let httpurl = this.url.downUrl
      // eslint-disable-next-line
      const params = _.cloneDeep(this.queryParam)
      if(Object.keys(params).length){
        delete params.range_extra
        delete params.backPayStatus_extra
        delete params.creat_extra
        const qs = require('qs')
        httpurl += `?${qs.stringify(params)}`
      }
      const _this = this
      _this.loading = true
      downFile(httpurl, '').then((res) => {
        if (res.size > 0) {
          var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'}); // application/vnd.ms-excel这里表示xls类型
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = `垫付数据监控${moment().format('YYYY-MM-DD')}.xls` // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
          _this.$message.success(`下载成功！`)
        } else {
          _this.$message.warning(`${(res.msg || res.message)} 失败！`)
        }
      }).finally(() => {
        _this.loading = false
      })
    },
    initDictConfig() {
      // 客户性质
      initDictOptions('nature').then((res) => {
        if (res.code === 200) {
          this.customerNatures = res.data
        }
      })
      // 行业类型
      initDictOptions('industryBelong').then((res) => {
        if (res.code === 200) {
          this.industryBelongDictOptions = res.data
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.table-operator{
  margin: 0px 0px 12px;
}
.searchForm .labelTxt {
  :global(.ant-form-item-label) {
    width: 90px;
    text-align: right;
  }
}
</style>
