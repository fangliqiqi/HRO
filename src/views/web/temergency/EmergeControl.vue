<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" class="searchForm">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户单位" class="labelTxt">
              <select-page
                placeholder="请选择客户单位"
                v-model="queryParam.unitId"
                :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                :title="'customerName'"
                :id="'id'"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户编码" class="labelTxt">
              <a-input
                placeholder="请输入客户编码"
                v-model="queryParam.unitCode"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="行业类型" class="labelTxt">
              <a-select v-model="queryParam.industryBelong" placeholder="请选择行业类型" showSearch optionFilterProp="children" :allowClear="true">
                <a-select-option v-for="item in industryBelongDictOptions" :key="item.id" :value="item.id">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体" class="labelTxt">
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :placeholder="'请输入结算主体'"
                v-model="queryParam.departId"
                :id="'id'"
              ></select-page>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体编码" class="labelTxt">
                <a-input
                  placeholder="请输入结算主体编码"
                  v-model="queryParam.departCode"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="业务类型" class="labelTxt">
                <a-select
                  showSearch
                  placeholder="业务类型"
                  :allowClear="true"
                  optionFilterProp="children"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.businessType"
                >
                  <a-select-option
                    v-for="(item, index) in businessTypeDicts"
                    :key="index"
                    :value="item.id"
                    v-if="item.delFlag == 0"
                  >{{ item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="开发部门" class="labelTxt">
                <a-select
                  showSearch
                  placeholder="请选择开发部门"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.businessDeveloperOrgan"
                  :getPopupContainer="getPopupContainerFun"
                >
                  <a-select-option v-for="(item, index) in organizationOption" :key="index" :value="item.id">{{
                    item.organName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="一级指标归属" class="labelTxt">
                <a-select
                  showSearch
                  placeholder="请选择一级指标归属"
                  optionFilterProp="children"
                  :dropdownMatchSelectWidth="false"
                  :allowClear="true"
                  v-model="queryParam.incomeBelong"
                  :getPopupContainer="getPopupContainerFun"
                >
                  <a-select-option
                    v-for="(item, index) in belongOrgan.first"
                    :key="index"
                    :value="String(item.id)"
                  >{{ item.organName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="二级指标归属" class="labelTxt">
                <a-select
                  allowClear
                  showSearch
                  placeholder="请选择二级指标归属"
                  optionFilterProp="children"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.incomeBelongSub"
                  :getPopupContainer="getPopupContainerFun"
                >
                  <a-select-option
                    v-for="(item, index) in belongOrgan.second"
                    :key="index"
                    :value="String(item.id)"
                  >{{ item.organName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="事件编码" class="labelTxt">
                <a-input
                  placeholder="请输入事件编码"
                  v-model="queryParam.eventCode"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="事件类型" class="labelTxt">
                <a-select
                  v-model="queryParam.eventType"
                  placeholder="请选择事件类型"
                  :allowClear="true"
                >
                  <a-select-option
                    v-for="(item,index) in emergencyType"
                    :key="index"
                    :value="index">{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="费用类型" class="labelTxt">
                <a-select
                  v-model="queryParam.feeType"
                  placeholder="请选择费用类型"
                  :allowClear="true"
                >
                  <a-select-option
                    v-for="item in feeTypeOption"
                    :key="item.id"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="事件发生时间" class="labelTxt">
                <a-range-picker
                  v-model="queryParam.rangeTime_extra"
                  @change="changeRange"
                  style="width:100%"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="费用添加时间" class="labelTxt">
                <a-range-picker
                  v-model="queryParam.applyTime_extra"
                  @change="changeApply"
                  style="width:100%"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="当事人" class="labelTxt">
                <a-input
                  placeholder="请输入当事人"
                  v-model="queryParam.empName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="当事人身份证" class="labelTxt">
                <a-input
                  placeholder="请输入当事人身份证"
                  v-model="queryParam.empIdcard"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="承担方" class="labelTxt">
                <a-select
                  v-model="queryParam.sourceType"
                  placeholder="请选择承担方"
                  :allowClear="true"
                >
                  <a-select-option
                    v-for="(item,index) in sourceTypeOption"
                    :key="index"
                    :value="index"
                  >
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="备注" class="labelTxt">
                <a-input
                  placeholder="请输入备注"
                  v-model="queryParam.remark"
                ></a-input>
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

    <!-- table区域-begin -->
    <div>
      <a-row style="margin:0px 0px 10px;">
        <a-col :span="3">
          <a-button
            type="primary"
            icon="download"
            :loading="confirmLoading"
            @click="exportExcel"
            size="small"
          >导出</a-button>
        </a-col>
        <a-col :span="21" style="text-align:right;">
          合计：{{ totalAll.sum }}元；
          <template v-if="totalAll.company">承担明细—我司：{{ totalAll.company }}元；</template>
          <template v-if="totalAll.customer">客户：{{ totalAll.customer }}元；</template>
          <template v-if="totalAll.social">社保局：{{ totalAll.social }}元；</template>
          <template v-if="totalAll.insurance">保险公司：{{ totalAll.insurance }}元</template>
        </a-col>
      </a-row>
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
        :scroll="{ x: 1}"
      >
      </a-table>
    </div>
    <!-- table区域-end -->
    
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction } from '@/api/manage'
  import { getNameFromArr } from '@/utils/common'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import SelectPage from '@/components/jeecg/SelectPage'
  // import { getAllTree } from '@/utils/common'

  export default {
    name: 'EmergeControl',
    mixins: [JeecgListMixin],
    components: {
      SelectPage,
    },
    data() {
      return {
        description: '事件查询列表',
        industryBelongDictOptions:[],
        businessTypeDicts:[], //业务类型
        organizationOption:[],
        feeTypeOption:[],
        sourceTypeOption:['我司','客户','社保局','保险公司'],
        recordTypeOption:['自行添加','企业微信','结算单-非扣税项'],
        emergencyType:['工伤','非因工','退工','仲裁','诉讼','监察投诉'], //事件类型
        totalAll:{
          sum:0,
          company:0,
          customer:0,
          social:0,
          insurance:0
        },
        belongOrgan:{ // 指标归属
          first:[],
          second:[]
        },
        confirmLoading:false,
        // 表头
        columns: [
          {
            title: '数据来源',
            align: 'center',
            width:140,
            ellipsis: true,
            dataIndex: 'recordType',
            customRender:(text)=>{
              const res = this.recordTypeOption[text];
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
          {
            title: '事件编码',
            align: 'center',
            width:120,
            ellipsis: true,
            dataIndex: 'eventCode',
            customRender:(text)=>{
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            }
          },
          {
            title: '事件类型',
            align: 'center',
            width:100,
            ellipsis: true,
            dataIndex:'eventType',
            customRender:(text)=>{
              let type = this.emergencyType[text]
              return <a-tooltip placement="topLeft" title={type}>{type}</a-tooltip>
            }
          },
          {
            title: '发生时间',
            align: 'center',
            width:120,
            ellipsis: true,
            dataIndex: 'eventTime',
            customRender:(text)=>{
              const res = text ? text.substring(0,10) : '-'
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
          {
            title: '客户名称',
            align: 'center',
            width:200,
            ellipsis: true,
            dataIndex:'unitName',
            customRender:(text)=>{
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            }
          },
          {
            title: '客户编码',
            align: 'center',
            width:90,
            ellipsis: true,
            dataIndex: 'unitCode',
            customRender:(text)=>{
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            }
          },
          {
            title: '行业类型',
            align: 'center',
            width:120,
            ellipsis: true,
            dataIndex: 'industryBelong',
            customRender:(text)=>{
              const res = getNameFromArr(this.industryBelongDictOptions,text,'id','label')
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
          {
            title: '结算主体名称',
            align: 'center',
            width:200,
            ellipsis: true,
            dataIndex: 'departName',
            customRender:(text)=>{
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            }
          },
          {
            title: '结算主体编码',
            align: 'center',
            dataIndex: 'departCode',
            width:110,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            }
          },
          {
            title: '业务类型',
            align: 'center',
            dataIndex: 'businessType',
            width:120,
            ellipsis: true,
            customRender:(text)=>{
              const res = getNameFromArr(this.businessTypeDicts,text,'id','label')
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
          {
            title: '开发部门',
            align: 'center',
            dataIndex: 'businessDeveloperOrgan',
            width:150,
            ellipsis: true,
            customRender:(text)=>{
              const res = text ? getNameFromArr(this.organizationOption,text,'id','organName') : '-'
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
          {
            title: '一级指标归属',
            align: 'center',
            dataIndex: 'incomeBelong',
            width:150,
            ellipsis: true,
            customRender:(text)=>{
              const res = getNameFromArr(this.organizationOption,text,'id','organName')
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
          {
            title: '二级指标归属',
            align: 'center',
            dataIndex: 'incomeBelongSub',
            width:150,
            ellipsis: true,
            customRender:(text)=>{
              const res = getNameFromArr(this.organizationOption,text,'id','organName')
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
          {
            title: '当事人',
            align: 'center',
            dataIndex: 'empName',
            width:100,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            }
          },
          {
            title: '当事人身份证号',
            align: 'center',
            dataIndex: 'empIdcard',
            width:160,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            }
          },
          {
            title: '费用类型',
            align: 'center',
            dataIndex: 'feeType',
            width:120,
            ellipsis: true,
            customRender:(text)=>{
              const res = filterDictText(this.feeTypeOption,text)
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
          {
            title: '金额(元)',
            align: 'center',
            dataIndex: 'fee',
            width:120,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            }
          },
          {
            title: '我司垫付金额',
            align: 'center',
            dataIndex: 'fee1',
            width:120,
            ellipsis: true,
            customRender:(text,record)=>{
              const res = (record.sourceType != 0 && record.recordType == 1) ? record.fee : '-';
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
          {
            title: '承担方',
            align: 'center',
            dataIndex: 'sourceType',
            width:120,
            ellipsis: true,
            customRender:(text)=>{
              const res = this.sourceTypeOption[text]
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
          {
            title: '费用添加时间',
            align: 'center',
            dataIndex: 'addTime',
            width:120,
            ellipsis: true,
            customRender:(text)=>{
              const res = text ? text.substring(0,10) : '-'
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
          {
            title: '备注',
            align: 'center',
            dataIndex: 'remark',
            width:120,
            ellipsis: true,
            customRender:(text)=>{
              const res = text || '-'
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
        ],
        url: {
          list: '/hrEmergency/teventfeedetail/page?orders%5B0%5D.asc=false&orders%5B0%5D.column=add_time',
          organization:'/admin/organizationinfo/getOrgForCus?type=0', //获取皖信组织架构
          exportUrl:'/hrEmergency/teventfeedetail/getTEventFeeDetailList?orders%5B0%5D.asc=false&orders%5B0%5D.column=add_time'
        },
      }
    },
    created() {
      this.loadOrgination()
      this.getTotal({})
      httpAction(`/admin/organizationinfo/getOrgForCus?type=0&useType=1`,'','GET').then((res) => {
        if(res.code === 200 && res.data.length > 0) {
          this.belongOrgan.first = res.data
        }
      })
      httpAction(`/admin/organizationinfo/getOrgForCus?type=0&useType=2`,'','GET').then((res) => {
        if(res.code === 200 && res.data.length > 0) {
          this.belongOrgan.second = res.data
        }
      })
    },
    methods: {
      searchQuery() {
        this.selectedRowKeys = []
        this.loadData(1)
        // eslint-disable-next-line
        this.getTotal(_.cloneDeep(this.queryParam))
      },
      searchReset() {
        this.queryParam = {}
        this.selectedRowKeys = []
        this.loadData(1)
        this.getTotal({})
      },
      getTypeTotal(type,arr){
        const res = arr.find(item=>String(item.id) === type)
        return res ? (res.name||0) : 0
      },
      getTotal(params){
        let str = ''
        if(Object.keys(params).length){
          delete params.rangeTime_extra
          delete params.applyTime_extra
          const qs = require('qs')
          str = qs.stringify(params)
        }
        httpAction(`/hrEmergency/teventfeedetail/getSourceTypeFee?${str}`,null,'get').then(res=>{
          if(res.code === 200){
            this.totalAll = {
              sum:this.getTypeTotal('9',res.data),
              company:this.getTypeTotal('0',res.data),
              customer:this.getTypeTotal('1',res.data),
              social:this.getTypeTotal('2',res.data),
              insurance:this.getTypeTotal('3',res.data)
            }
          }else{
            this.totalAll = {
              sum:0,
              company:0,
              customer:0,
              social:0,
              insurance:0
            }
          }
        })
      },
      exportExcel(){
        delete this.queryParam.rangeTime_extra
        delete this.queryParam.applyTime_extra
        const qs = require('qs')
        let params = {}
        if(Object.keys(this.queryParam).length){
          params = Object.assign({},this.queryParam)
        }
        if(this.selectedRowKeys.length){
          params = Object.assign(params,{idStr:this.selectedRowKeys.join(',')})
        }
        this.confirmLoading = true
        const _this = this
        httpAction(`${this.url.exportUrl}&${qs.stringify(params)}`,null,'get').then(res=>{
          if(res.code === 200){
            const result = res.data.map(item=>{
              return {
                eventCode: item.eventCode,
                eventType: _this.emergencyType[item.eventType],
                unitName: item.unitName,
                unitCode: item.unitCode,
                recordType: _this.recordTypeOption[item.recordType],
                eventTime: item.eventTime ? item.eventTime.substring(0,10) : '',
                industryBelong: getNameFromArr(_this.industryBelongDictOptions,item.industryBelong,'id','label'),
                departName: item.departName,
                departCode: item.departCode,
                businessType: getNameFromArr(_this.businessTypeDicts,item.businessType,'id','label'),
                businessDeveloperOrgan: getNameFromArr(_this.organizationOption,item.businessDeveloperOrgan,'id','organName'),
                incomeBelong: getNameFromArr(_this.organizationOption,item.incomeBelong,'id','organName'),
                incomeBelongSub: getNameFromArr(_this.organizationOption,item.incomeBelongSub,'id','organName'),
                empName: item.empName,
                empIdcard: item.empIdcard,
                feeType: filterDictText(_this.feeTypeOption,item.feeType),
                fee: item.fee,
                fee1: (item.sourceType != 0 && item.recordType == 1) ? item.fee : '-',
                sourceType: _this.sourceTypeOption[item.sourceType],
                addTime: item.addTime ? item.addTime.substring(0,10) : '',
                remark: item.remark,
                recyleDate: '-'
              }
            })
            // 封面数据
            let excelDatas = [
              {
                tHeader: ["数据来源","事件编码","事件类型","发生时间", "客户名称","客户编码","行业类型","结算主体名称","结算主体编码","业务类型","开发部门",
                "一级指标归属","二级指标归属","当事人","当事人身份证号","费用类型","金额(元)","我司垫付金额","承担方","费用添加时间","回款日期","备注"],
                filterVal: ['recordType','eventCode','eventType','eventTime','unitName',"unitCode", "industryBelong","departName", "departCode","businessType","businessDeveloperOrgan",
                "incomeBelong","incomeBelongSub","empName","empIdcard","feeType","fee","fee1","sourceType","addTime","recyleDate","remark"],
                tableDatas: result,
                sheetName: "突发事件费用管控"
              }
            ]
            this.json2excel(excelDatas, "突发事件费用统计表", true, "xlsx",0)
            this.$message.success('导出成功')
          }else{
            this.$message.error(res.msg)
          }
        }).finally(()=>{
          this.confirmLoading = false
        })
      },
      json2excel(tableJson, filenames, autowidth, bookTypes,typeLength) {
        var that = this
        import('./xlsx/ExportToExcel').then(excel => {
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
            autoWidth: autowidth,
            bookType: bookTypes,
            autoLength: typeLength // 所有类型长度
          })
          that.confirmLoading = false;
        });
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j] || ''
        }))
      },
      // 数据字典
      initDictConfig() {
        // 行业类型
        initDictOptions('industryBelong').then((res) => {
          if (res.code === 200) {
            this.industryBelongDictOptions = res.data
          }
        })
        httpAction(`/hrBase/sysdictbusinesstypehr/getAllSysDictBusinessTypeList`,null,'get').then(res=>{
          if(res.code === 200) {
            // const tree = getAllTree(res.data)
            // let result = []
            // tree.map(item=>{
            //   result = result.concat(item.children)
            // })
            this.businessTypeDicts = res.data
          }
        })
        httpAction(`/admin/dict/getByParentId?parentId=1753`,null,'get').then(res=>{
          if(res.code === 200){
            this.feeTypeOption = res.data
          }
        })
      },
      loadOrgination(){
        //获取皖信组织构架
        httpAction(this.url.organization, {}, 'get').then((res) => {
          if(res.code == 200){
            this.organizationOption = res.data
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      changeRange(value, dateString){
        this.queryParam.eventTimeStart = dateString[0]
        this.queryParam.eventTimeEnd = dateString[1]
      },
      changeApply(value, dateString){
        this.queryParam.addTimeStart = dateString[0]
        this.queryParam.addTimeEnd = dateString[1]
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

.searchForm .labelTxt {
  :global(.ant-form-item-label) {
    width: 105px;
    text-align: right;
  }
}

</style>
