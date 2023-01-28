<template>
  <a-card :bordered="false">

    <!-- table区域-begin -->
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="按客户">
        <a-card :bordered="false">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="24">
                <a-col
                  :md="5"
                  :sm="7"
                >
                  <a-form-item label="客户单位">
                    <select-page
                      :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                      :title="'customerName'"
                      :placeholder="'请输入客户单位'"
                      v-model="queryParam.unitId"
                      :id="'id'"
                    ></select-page>
                  </a-form-item>
                </a-col>
                <a-col
                  :md="5"
                  :sm="7"
                >
                  <a-form-item label="结算主体">
                    <select-page
                      :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                      :title="'departName'"
                      :placeholder="'请输入结算主体'"
                      v-model="queryParam.deptId"
                      :id="'id'"
                    ></select-page>
                  </a-form-item>
                </a-col>
                <a-col
                  :md="4"
                  :sm="6"
                >
                  <a-form-item label="月份">
                    <a-month-picker
                      placeholder="月份"
                      @change="changeMonth"
                      format="YYYYMM"
                      :disabled-date="disabledDate"
                      v-model="staticMonth.customerMonth"
                      :allowClear="false"
                      :disabledDate="disabledDate"
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
                      icon="download"
                      style="margin-left: 8px"
                      :loading="confirmLoading"
                      @click="exportByCustome"
                    >导出报表</a-button>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>
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
        </a-card>
      </a-tab-pane>
      <a-tab-pane key="2" tab="按档案地">
        <a-card :bordered="false">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="24">
                <a-col
                  :md="8"
                  :sm="10"
                >
                  <a-form-item label="档案地">
                    <a-select
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      placeholder="选择省份"
                      v-model="params.fileProvince"
                      style="width: 32%"
                      @change="handleProvinceChange"
                      :dropdownMatchSelectWidth="false"
                    >
                      <a-select-option
                        v-for="(item, index) in areaTrees"
                        :key="index"
                        :value="item.id"
                      >{{ item.areaName }}</a-select-option>
                    </a-select>
                    <a-select
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      placeholder="选择城市"
                      v-model="params.fileCity"
                      style="margin-left: 2%; width: 32%"
                      @change="handleCityChange"
                      :dropdownMatchSelectWidth="false"
                    >
                      <a-select-option
                        v-for="(item, index) in areaCitys"
                        :key="index"
                        :value="item.id"
                      >{{ item.areaName }}</a-select-option>
                    </a-select>
                    <a-select
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      placeholder="选择区县"
                      v-model="params.fileTown"
                      style="margin-left: 2%; width: 32%"
                      :dropdownMatchSelectWidth="false"
                    >
                      <a-select-option
                        v-for="(item, index) in areaTowns"
                        :key="index"
                        :value="item.id"
                      >{{ item.areaName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col
                  :md="4"
                  :sm="6"
                >
                  <a-form-item label="月份">
                    <a-month-picker
                      placeholder="月份"
                      format="YYYYMM"
                      @change="changeDeptMonth"
                      v-model="staticMonth.deptMonth"
                      :allowClear="false"
                      :disabledDate="disabledDate"
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
                      @click="searchList"
                      icon="search"
                    >查询</a-button>
                    <a-button
                      type="primary"
                      icon="download"
                      style="margin-left: 8px"
                      @click="exportFile"
                      :loading="confirmLoading"
                      v-has="'wxhr:tempareareport_export'"
                    >导出报表</a-button>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="fileColumn"
            :dataSource="fileDataSource"
            :pagination="fileIpagination"
            :loading="loading"
            @change="handleFileTableChange"
          >
          </a-table>
        </a-card>
      </a-tab-pane>
      <a-tab-pane key="3" tab="增员">
        <increase-employees-modal ref="IncreaseForm"></increase-employees-modal>
      </a-tab-pane>
      <a-tab-pane key="4" tab="减员">
        <decrease-employees-modal ref="DecreaseForm"></decrease-employees-modal>
      </a-tab-pane>

    </a-tabs>
    <!-- table区域-end -->
    
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction,getAction } from '@/api/manage'
import Vue from 'vue'
import moment from 'moment'
import {initDictOptions } from '@/components/dict/JDictSelectUtil'
import SelectPage from '@/components/jeecg/SelectPage'
import { filterObj } from '@/utils/util'
import { getAreaName,getAreaFieldName } from '@/utils/common'
import IncreaseEmployeesModal from './modules/IncreaseEmployeesModal'
import DecreaseEmployeesModal from './modules/DecreaseEmployeesModal'

export default {
  name: 'PersonalMonthReport',
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
    IncreaseEmployeesModal,
    DecreaseEmployeesModal
  },
  data() {
    return {
      loading: false,
      confirmLoading: false,
      areaTrees: [],
      areaCitys: [],
      areaTowns: [],
      // 表头
      columns: [
        {
          title: '客户单位',
          align: 'center',
          dataIndex: 'unitName',
        },
        {
          title: '结算主体',
          align: 'center',
          dataIndex: 'deptName'
        },
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'deptNo'
        },
        {
          title: '月份',
          align: 'center',
          dataIndex: 'settleMonth'
        },
        {
          title: '在册人数',
          align: 'center',
          dataIndex: 'personNumAll'
        },
        {
          title: '增员',
          align: 'center',
          dataIndex: 'personNumAdd',
        },
        {
          title: '减员',
          align: 'center',
          dataIndex: 'personNumReduce',
        },
      ],
      url: {
        list: '/hrBase/tstatisticsarchivemonthlydept/page',
        list2: '/hrBase/tempareareport/page'
      },
      queryParam:{
        settleMonth: moment(new Date()).subtract(1,'months').format('YYYYMM')
      },
      params:{
        month: moment(new Date()).subtract(1,'months').format('YYYYMM')
      },
      fileDataSource:[],
      fileColumn:[
        {
          title: '档案地',
          align: 'center',
          dataIndex: 'fileProvince',
          customRender: (text,record) => {
            const resultText = getAreaName(record.fileProvince,record.fileCity,record.fileTown)
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '月份',
          align: 'center',
          dataIndex: 'month',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '在册人数',
          align: 'center',
          dataIndex: 'totalPeople',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '标准合同-五级划小',
          align: 'center',
          dataIndex: 'typeFourteen',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '标准合同',
          align: 'center',
          dataIndex: 'typeOne',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '劳务协议',
          align: 'center',
          dataIndex: 'typeThree',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '代理社保',
          align: 'center',
          dataIndex: 'typeFour',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '实习协议',
          align: 'center',
          dataIndex: 'typeFive',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '独立户',
          align: 'center',
          dataIndex: 'typeSix',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '个体代办',
          align: 'center',
          dataIndex: 'typeSeven',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '非全日制',
          align: 'center',
          dataIndex: 'typeEight',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '代发工资',
          align: 'center',
          dataIndex: 'typeTwo',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '补贴合同',
          align: 'center',
          dataIndex: 'typeNine',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '五级划小',
          align: 'center',
          dataIndex: 'typeTwelve',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '见习协议',
          align: 'center',
          dataIndex: 'typeThirteen',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '兼职协议',
          align: 'center',
          dataIndex: 'typeSeventeen',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '增加人数',
          align: 'center',
          dataIndex: 'onlineCount',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '减少人数',
          align: 'center',
          dataIndex: 'outlineCount',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },

      ],
      fileIpagination:{
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
      staticMonth:{
        customerMonth:'',
        deptMonth:''
      }


    }
  },
  created() {
    this.areaTrees = Vue.ls.get('glob_area')
    const lastMonth = moment(new Date()).subtract(1,'months')
    this.staticMonth.customerMonth = lastMonth
    this.staticMonth.deptMonth = lastMonth
  },
  methods: {
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },
    callback(key){
      if(key === '2' && this.fileDataSource.length === 0){
        this.loadRemoteData()
      }
      if(key === '3'){
        this.$nextTick(() => {
          if(this.$refs.IncreaseForm.dataSource.length === 0){
            this.$refs.IncreaseForm.loadRemoteData()
          }
        })
      }
      if(key === '4'){
        this.$nextTick(() => {
          if(this.$refs.DecreaseForm.dataSource.length === 0){
            this.$refs.DecreaseForm.loadRemoteData()
          }
        })
      }
    },
    changeMonth(val,option){
      this.queryParam.settleMonth = option
    },
    changeDeptMonth(val,option){
      this.params.month = option
    },
    // 档案省份切换
    handleProvinceChange(value) {
      this.areaCitys = []
      this.areaTowns = []
      if (value) {
        for (var c of this.areaTrees[value - 1].children) {
          this.areaCitys.push(c)
        }
      }
      delete this.params.fileCity
      delete this.params.fileTown
    },
    // 档案城市切换
    handleCityChange(value) {
      this.areaTowns = []
      if (value) {
        for (const c of this.areaCitys) {
          if (String(c.id) === String(value)) {
            if (c.children.length > 0) {
              for (const t of c.children) {
                this.areaTowns.push(t)
              }
            }
          break
          }
        }
      }
      delete this.params.fileTown
    },
    handleFileTableChange(pagination){
      this.fileIpagination = pagination
      this.loadRemoteData(pagination.current)
    },
    handleParams(){
      this.params.current = this.fileIpagination.current
      this.params.size = this.fileIpagination.pageSize
      // eslint-disable-next-line
      return filterObj(_.cloneDeep(this.params))
    },
    loadRemoteData(page){
      this.fileIpagination.current = page ? page : 1
      const param = this.handleParams()
      this.loading = true
      getAction(this.url.list2, param).then((res) => {
        if(res.code === 200){
          this.fileDataSource = res.data.records
          this.fileIpagination.total = res.data.total
        }else{
          this.$message.warn(res.msg)
        }
      }).finally(()=>{
        this.loading = false
      })
    },
    searchList(){
      this.loadRemoteData()
    },
    resetList(){
      this.params = {}
      this.selectedRowKeys = []
      this.loadRemoteData()
    },
    exportFile(){
      const param = this.handleParams()
      delete param.current
      delete param.size
      const qs = require('qs')
      const params = qs.stringify(param)
      this.confirmLoading = true
      httpAction(`/hrBase/tempareareport/getExportList?${params}`,null,'get').then(res=>{
        if(res.code === 200){
          if(res.data.length === 0){
            this.$message.warn('暂无数据!')
            this.confirmLoading = false
            return
          }
          const tableDatas = res.data.map(item=>{
            let temp = {fileProvince:'',fileCity:'',fileTown:''}
            temp.fileProvince = getAreaFieldName(item.fileProvince,item.fileCity,item.fileTown,0) || '-'
            temp.fileCity = getAreaFieldName(item.fileProvince,item.fileCity,item.fileTown,1) || '-'
            temp.fileTown = getAreaFieldName(item.fileProvince,item.fileCity,item.fileTown,2) || '-'
            return Object.assign(item,temp)
          })
          // 封面数据
          const excelDatas = [{
            tHeader: ['档案地-省','档案地-市','档案地-县','系统在册总人数','标准合同-五级划小','标准合同','劳务协议',"代理社保",'实习协议','独立户','个体代办',
            '非全日制','代发工资','补贴合同','五级划小','见习协议','兼职协议','增加人数','减少人数',
            '系统在册总人数','标准合同-五级划小','标准合同','劳务协议','代理社保','实习协议','独立户','个体代办','非全日制','代发工资',
            '补贴合同','五级划小','见习协议','兼职协议','增加人数','减少人数'
            ],
            filterVal: ['fileProvince','fileCity','fileTown','totalPeople','typeFourteen','typeOne','typeThree','typeFour','typeFive','typeSix','typeSeven',
            'typeEight','typeTwo','typeNine','typeTwelve','typeThirteen','typeSeventeen','onlineCount','outlineCount',
            'lastTotalPeople','lastTypeFourteen','lastTypeOne','lastTypeThree','lastTypeFour','lastTypeThirteen','lastTypeSix','lastTypeSeven','lastTypeEight','lastTypeTwo',
            'lastTypeNine','lastTypeTwelve','lastTypeThirteen','lastTypeSeventeen','lastOnlineCount','lastOutlineCount'],

            tableDatas: tableDatas,
            sheetName: "按档案地统计"
          }]
          let htype = []
          if(res.data && res.data.length){
            htype = excelDatas[0]['filterVal'].map((item)=>{
              let row = ''
              switch (item){
                case 'totalPeople':
                  row = moment(res.data[0]['month'],'YYYYMM').format('YYYY年MM月')
                break
                case 'lastTotalPeople':
                  row = moment(res.data[0]['month'],'YYYYMM').subtract(1, 'months').format('YYYY年MM月')
                break
              }
              return row
            })
          }
          this.json2excel(excelDatas, "按档案地统计", true, "xlsx",true,htype)
        }else{
          this.$message.warn(res.msg)
        }
      })
    },
    exportByCustome(){
      // eslint-disable-next-line
      const param = filterObj(_.cloneDeep(this.queryParam))
      delete param.settleMonth_extra
      const qs = require('qs')
      const params = qs.stringify(param)
      this.confirmLoading = true
      httpAction(`/hrBase/tstatisticsarchivemonthlydept/exportList?${params}`,null,'get').then(res=>{
        if(res.code === 200){
          const list = res.data.map(item=>{
            let row = {}
            row.unitName = item.unitName
            row.deptName = item.deptName
            row.deptNo = item.deptNo
            row[item.settleMonth+'personNumAll'] = item.personNumAll
            row[item.settleMonth+'personNumReduce'] = item.personNumReduce
            row[item.settleMonth+'personNumAdd'] = item.personNumAdd
            if(item.detailList.length){
              const sortList = item.detailList.sort(this.sortBy("settleMonth"))
              sortList.forEach(element => {
                row[element.settleMonth+'personNumAll'] = element.personNumAll
                row[element.settleMonth+'personNumReduce'] = element.personNumReduce
                row[element.settleMonth+'personNumAdd'] = element.personNumAdd
              })
            }
            return row
          })
          if(list.length === 0){
            this.$message.warning('暂无数据！')
            this.confirmLoading = false
            return
          }
          const total = Math.max.apply(Math,list.map(items => { return Object.keys(items).length })) // 字段个数6
          const maxRow = list.find(items=>(Object.keys(items).length===total)) // 最长的一项
          const numKeys = Object.keys(maxRow).filter(items=>/\d+\w+$/.test(items))
          let tHeader = ["单位名称","结算主体名称","结算主体编码"]
          let filterVal = ['unitName','deptName','deptNo']
          let htype = ['','','']
          for(const key in maxRow){
            if(/\d+personNumAll/.test(key)){
              let temp = key.replace(/[^\d]/g,'')
              tHeader.push(`在册`)
              tHeader.push(`减少`)
              tHeader.push(`增加`)
              htype.push(moment(temp,'YYYYMM').format('YYYY年MM月'))
              htype.push('')
              htype.push('')
            }
          }
          numKeys.forEach(items=>{
            filterVal.push(`${items}`)
          })
          // 封面数据
          const excelDatas = [{
            tHeader: tHeader,
            filterVal: filterVal,
            tableDatas: list,
            sheetName: "按结算主体统计"
          }]
          this.json2excel(excelDatas, "按结算主体统计", true, "xlsx",true,htype)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    sortBy(field) {
      return function(a,b) {
        return -(a[field] - b[field])
      }
    },
    
    json2excel(tableJson, filenames, autowidth, bookTypes,typeLength,htype) {
      var that = this
      import('./modules/ExportBySettle').then(excel => {
        var tHeader = []
        var dataArr = []
        var sheetnames = []
        for (var i in tableJson) {
          tHeader.push(tableJson[i].tHeader)
          dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
          sheetnames.push(tableJson[i].sheetName)
        }
        excel.export_json_to_excel_more_sheet({
          header: tHeader,
          data: dataArr,
          sheetname: sheetnames,
          filename: filenames,
          bookType: bookTypes,
          autoLength: typeLength, // 所有类型长度
          headerType:htype
        })
        that.confirmLoading = false
      });
    },
    formatJson(filterVal, jsonData) {
      const res = jsonData.map(v => filterVal.map(j => {
        return v[j] || 0
      }))
      return res
    },

    handleDetail(record) {
      this.$refs.detailModal.title = '详情'
      this.$refs.detailModal.customerTypeDicts = this.customerTypeDicts
      this.$refs.detailModal.advanceTypeDicts = this.advanceTypeDicts
      httpAction(this.url.getContractInfo + record.contractId, null, 'GET').then((res) => {
        if(res.data) {
          this.$refs.detailModal.settleDomain.contractName = res.data.contractName;
          httpAction(this.url.getAttaInfos + record.id, null, 'GET').then((re) => {
            this.$refs.detailModal.fileList = re.data;
            this.$refs.detailModal.show(record);
          })
        }
      })
    },
    initDictConfig() {
      initDictOptions('ADVANCE_CUSTOMER_TYPE').then((res) => {
        if (res.code === 200) {
          this.customerTypeDicts = res.data;
        }
      });
    },
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

</style>
