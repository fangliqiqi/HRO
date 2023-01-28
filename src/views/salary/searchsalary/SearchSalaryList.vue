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
            <a-form-item label="上传人">
              <select-page
                :searchUrl="'admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                placeholder="请选择上传人"
                :id="'userId'"
                :resList="resList"
                v-model="queryParam.createUser"
                style="width:100%"
              ></select-page>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
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
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="开始时间">
                <a-date-picker
                  v-model="queryParam.dateTemp"
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
                  v-model="queryParam.dateTemp1"
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
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算金额">
                <a-input
                  placeholder="请输入结算金额"
                  @change="changeMoney"
                  v-model="queryParam.settlementAmount"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="开票金额">
                <a-input
                  placeholder="请输入开票金额"
                  @change="changeMoneyTicket"
                  v-model="queryParam.ticketAmount"
                />
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
              <a-button
                type="primary"
                @click="salaryQuery"
                style="margin-left: 8px"
              >工资条查询</a-button>
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

    <div
      class="table-operator"
      style="margin-bottom:18px"
    >
      <a-button
        type="primary"
        icon="download"
        :loading="downLoading"
        @click="exportHandle"
      >导出</a-button>
    </div>

    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        :scroll="{x: 1}"
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
            @click="handleDetail(record)"
            v-has="'wxhr:check_salary'"
          >查看工资</a>
          <a-divider
            type="vertical"
            v-if="Number(record.status) === 3"
            v-have="'wxhr:tsalarystandard_edit'"
          />
          <a
            v-if="Number(record.status) === 3"
            @click="handleEdit(record)"
            v-have="'wxhr:tsalarystandard_edit'"
          >款项来源</a>
          <a-divider
            type="vertical"
          />
          <a
            @click="salaryConfig(record)"
          >工资条配置</a>
        </span>
      </a-table>
    </div>

    <!-- 表单区域 -->
    <search-salary-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></search-salary-modal>
    <search-detail-modal
      ref="modalDetail"
      :formTypeOptions="formTypeOptions"
    ></search-detail-modal>
    <salary-search-modal ref="salarySearch"></salary-search-modal>
    <salary-config-modal ref="SalaryConfigForm"></salary-config-modal>

  </a-card>
</template>

<script>
 import { USER_INFO } from "@/store/mutation-types"
  import Vue from 'vue'
  import moment from "moment"
  import {  mapGetters } from 'vuex'
  import { getAreaName } from '@/utils/common'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SearchSalaryModal from './modules/SearchSalaryModal'
  import SearchDetailModal from './modules/SearchDetailModal'
  import SalarySearchModal from './modules/SalarySearchModal'
  import SalaryConfigModal from './modules/SalaryConfigModal'
  import { getAction,httpAction } from '@/api/manage'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import { getSettlementAuthorityByUser } from '@/api/api'
  import SelectPage from '@/components/jeecg/SelectPage'
 

  export default {
    name: "SearchSalaryList",
    components: {
      SearchSalaryModal,
      SearchDetailModal,
      SalarySearchModal,
      SalaryConfigModal,
      SelectPage
    },
    mixins: [JeecgListMixin],
    data () {
      return {
        visibleCreateModal:false,
        formTypeOptions:[],
        salaryStatusOptions:{
          '0':{'option': '待提交', 'color': 'green'},
          '1':{'option': '待审核', 'color': 'red'},
          '3':{'option': '待发放', 'color': 'blue'},
          '4':{'option': '已发放', 'color': 'orange'},
          '5':{'option':'审核不通过', 'color': 'yellow'},
          '7':{'option':'财务退回', 'color': 'black'},
        }, // 发放状态
        salaryStatusalist:["待提交","待审核","审核中","待发放","已发放","审核不通过","确认不通过","财务退回","结算单调整待审核","结算单调整待打印"],
        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        form: null,
        mdl: {},
        // 高级搜索 展开/关闭
        advanced: true,
        // 查询参数
        queryParam: {
          createUser:Vue.ls.get(USER_INFO).id+''
        },
        resList:[],
        //公司所有数据
        orgList:[],
        selectedRowKeys: [],
        selectedRows: [],
        idAreaTrees: [],
        idAreaCitys: [],
        idAreaTowns:[],
        employData:{},
        settlementList:[],
        downLoading:false, // 导出加载动画
        // 表头
        columns: [
          {
            width: 120,
            ellipsis: true,
            title: '发放状态',
            align: 'center',
            dataIndex: 'status',
            customRender: text => {
              const optionItem = this.salaryStatusOptions[String(text)] || '-'
              return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
            }
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
            width: 180,
            ellipsis: true,
            title: '省市区',
            align:'center',
            dataIndex: 'province',
            customRender:(text,record) => {
              return getAreaName(record.province,record.city,record.town) || '-'
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '上传人',
            align:'center',
            dataIndex: 'createUser',
            customRender:(text) => {
              for(const str in this.employData){
                if(String(str) === String(text)){
                  return this.employData[str]
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
              for(const str in this.employData){
                if(String(str) === String(text)){
                  return this.employData[str]
                }
              }
              return '-'
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '结算金额',
            align: 'center',
            dataIndex: 'settlementAmount',
            customRender: (text) => {
              const resultText = text || (parseFloat(text) === 0?'0':'-')
              return resultText || '-'
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '开票金额',
            align: 'center',
            dataIndex: 'ticketAmount',
            customRender: (text) => {
              const resultText = text || (parseFloat(text) === 0?'0':'-')
              return resultText || '-'
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '结算月份',
            align: 'center',
            dataIndex: 'settlementMonth',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '工资日期',
            align: 'center',
            dataIndex: 'salaryMonth',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '报表类型',
            align: 'center',
            dataIndex: 'formType',
            customRender:(text) => {
              return filterDictText(this.formTypeOptions, text) || '-'
            }
          },
          {
            width: 130,
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
            width: 240,
            ellipsis: true,
            title: '操作',
            align: 'center',
            fixed: 'right',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: '/salary/tsalarystandard/searchSalaryStandardPage?type=0',
          getOrgForCus:'/admin/organizationinfo/getOrgForCus',
          exportUrl:'/salary/tsalarystandard/exportSettleForm', // 导出
          getConfig: '/salary/tsalaryaccountitem/getSalarySet',
        },
        idCity:'',
      }
    },
    created () {
      this.loadSettlementList()
      this.getOrgForCusAll()
      this.idAreaTrees = Vue.ls.get('glob_area')
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if(Number(res.code) === 200){
          this.employData = res.data
        }
      })
      let user = this.userInfo
      // 上传人
      this.resList = [...[{id:user.id,title:user.nickName}]]
    },
    computed: {
    ...mapGetters(['userInfo'])
  },
    methods: {
      // 重置
      searchReset(){
        this.queryParam.createUser = Vue.ls.get(USER_INFO).id + ''
        let user = this.userInfo
        // 上传人
        this.resList = [...[{id:user.id,title:user.nickName}]]
        this.loadData()
      },
       //获取所有公司数据
      getOrgForCusAll(){
        getAction(this.url.getOrgForCus).then((res) => {
          if(Number(res.code) === 200){
            this.orgList = res.data
          }
        })
      },
      // 获取结算主体列表
      loadSettlementList() {
        getSettlementAuthorityByUser({}).then((res) => {
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
      //添加逻辑
      handleModalVisible(isVisible) {
        this.visibleCreateModal = isVisible;
      },
      handleCreateModalOk() {

      },
      handleCreateModalCancel() {
        this.visibleCreateModal = false;
      },
      onChange (row) {
        this.selectedRowKeys = row.selectedRowKeys
        this.selectedRows = row.selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      salaryConfig(record){
        httpAction(`${this.url.getConfig}?salaryId=${record.id}`,null,'get').then(res=>{
          if(res.code === 200){
            this.$refs.SalaryConfigForm.show(res.data,record)
          }else{
            this.$message.warn(res.msg)
          }
        })
      },

      resetSearchForm () {
        this.queryParam = {
          date: moment(new Date())
        }
      },
      initDictConfig () {
        //报表类型
        initDictOptions('form_type').then((res) => {
          if (res.code === 200) {
            this.formTypeOptions = res.data
          }
        })
      },
      // 点击查看工资
      handleDetail(record) {
        this.$refs.modalDetail.show(record)
        this.$refs.modalDetail.title = '详情'
      },
      changeMoney(e){
        // eslint-disable-next-line
        let settlementAmount = e.target.value.replace(/\,/g,'')
        const reg = /\./g
        let matchArr = settlementAmount.match(reg)
        if(matchArr){
          if(matchArr.length > 1){
            this.queryParam.settlementAmount = ''
          }
          if(matchArr.length == 1){
            let str = settlementAmount.split(".")[1]
            const reg2 = /^[0-9]*$/
            if(!reg2.test(str)){
              this.queryParam.settlementAmount = ''
            }else{
              this.queryParam.settlementAmount = settlementAmount
            }
          }
        }else{
          const reg1 = /^(-?)[0-9]*(.[0-9]{1,2})?$/
          if(!reg1.test(settlementAmount)){
            this.queryParam.settlementAmount = ''
          }else{
            this.queryParam.settlementAmount = settlementAmount
          }
        }
      },
      changeMoneyTicket(e){
        // eslint-disable-next-line
        let ticketAmount = e.target.value.replace(/\,/g,'')
        const reg = /\./g
        let matchArr = ticketAmount.match(reg)
        if(matchArr){
          if(matchArr.length > 1){
            this.queryParam.ticketAmount = ''
          }
          if(matchArr.length == 1){
            let str = ticketAmount.split(".")[1]
            const reg2 = /^[0-9]*$/
            if(!reg2.test(str)){
              this.queryParam.ticketAmount = ''
            }else{
              this.queryParam.ticketAmount = ticketAmount
            }
          }
        }else{
          const reg1 = /^(-?)[0-9]*(.[0-9]{1,2})?$/
          if(!reg1.test(ticketAmount)){
            this.queryParam.ticketAmount = ''
          }else{
            this.queryParam.ticketAmount = ticketAmount
          }
        }
      },
      //工资条查询
      salaryQuery(){
        this.$refs.salarySearch.show()
      },
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
      handleTimeRevenBeginChange(date){
        // 时间格式化
        this.queryParam.revenueTimeStart = date ? (date.format("YYYY-MM-DD")) : null
      },
      handleTimeRevenEndChange(date){
        // 时间格式化
        this.queryParam.revenueTimeEnd = date ? (date.format("YYYY-MM-DD")) : null
      },
      // 点击导出按钮
      exportHandle(){
        this.downLoading = true
        const parameters = this.getQueryParams()
        getAction(this.url.exportUrl,parameters,'GET').then((res) => {
          if(Number(res.code) === 200){
            if(!res.data || !res.data.length){
              this.$message.warn('暂无可导出数据!')
              return
            }
            let data = res.data.map(item=>{
              item.status = this.salaryStatusalist[item.status]
              return item
            })
            const header = ['结算主体','结算月份','开票金额合计','结算金额合计','应发工资','实发工资(银付)','暂停发金额',
            '应缴单位社保','应缴个人社保','应缴单位公积金','应缴个人公积金','代扣当月个人税',
            '人数','管理费','管理费2','风险金','商险','上次差余额','累计差余额','税费','自定义项',"发放状态","发放时间"]
            const haderKey = ['settleDepartName','settleMonth','ticketMoneySum','accountMoneySum','salarySum','cardPay','pausePay',
            'unitSocial','personalSocial','unitFund','personalFund','personalCurmonthTax',
            'personNum','managementMoney','managementMoneyTwo','riskFund','takingRisks','prevPoorBalance','curPoorBalance','countTax','takingBalanceIds',
            'status','revenueTime'
            ]
            const excelDatas = [{
              tHeader: header, // 表一的数据字段
              filterVal: haderKey, // sheet表一头部
              tableDatas: data, // 表一的整体json数据
              sheetName: "普通工资导出"// 表一的sheet名字
            }]
            this.json2excel(excelDatas, "普通工资导出", true, "xlsx")
            this.downLoading = false
          }else {
            this.downLoading = false
            this.$message.warn(res.msg || '导出数据获取失败!')
          }
        })
      },
      json2excel(tableJson, filenames, autowidth, bookTypes){
        const that = this
        //这个是引用插件
        import("@/vendor/Export2Excel").then(excel => {
          var tHeader = []
          var dataArr = []
          var sheetnames = []
          for (const i in tableJson) {
            tHeader.push(tableJson[i].tHeader)
            dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
            sheetnames.push(tableJson[i].sheetName)
          }
          excel.export_json_to_excel_more_sheet({
            header: tHeader,
            data: dataArr,
            sheetname: sheetnames,
            filename: filenames,
            autoWidth: autowidth,
            bookType: bookTypes
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      }
    }
  }
</script>
