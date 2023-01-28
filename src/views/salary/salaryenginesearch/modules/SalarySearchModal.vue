<template>
  <a-modal
    title="工资条查询"
    :width="1200"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleDownload"
    cancelText="取消"
    okText="导出"
    :visible="visible"
    :maskClosable="false"
  >
    <a-card
      :bordered="false"
      style="background:#f5f5f5"
    >

      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="身份证">
                <a-input
                  placeholder="请输入身份证"
                  v-model="queryParam.empIdcard"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="姓名">
                <a-input
                  placeholder="请输入姓名"
                  v-model="queryParam.empName"
                />
              </a-form-item>
            </a-col>

            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算月份">
                <a-input
                  placeholder="请输入结算月份"
                  v-model="queryParam.settlementMonth"
                />
              </a-form-item>
            </a-col>

            <template v-if="toggleSearchStatus">
              <a-col
                :md="6"
                :sm="8"
              >
                <a-form-item label="结算主体">
                  <a-input
                    placeholder="请输入结算主体名称"
                    v-model="queryParam.settleDepartName"
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
                    v-model="queryParam.settleDepartNo"
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
                  :loading="searchLoading"
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

      <div v-if="isTable">
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :loading="loading"
          :scroll="{x: 1}"
        >
          <span
            slot="distributionFlag"
            slot-scope="text, record"
          >
            <template v-for="(distributionFlag, key) in distributionFlagOptions">
              <a-tag
                :key="key"
                v-if="record.distributionFlag == key"
                :color="distributionFlag.color"
              >{{ distributionFlag.option }}</a-tag>
            </template>
          </span>
          <template
            slot="operation"
            slot-scope="text, record"
          >
            <a @click="detail(record.id)">详情</a>
          </template>
        </a-table>
      </div>
    </a-card>

    <!-- 工资明细详情 -->
    <a-modal
      title="报表详情"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleDetailCancel"
      @ok="handleDetailOk"
      cancelText="关闭"
      :visible="detailVisible"
      :maskClosable="false"
    >

      <a-card :bordered="false">
        <detail-list title="">
          <detail-list-item
            v-for="(item, index) in saiList"
            :key="index"
            :term="item.cnName"
          >{{ item.salaryMoney }}</detail-list-item>
        </detail-list>
      </a-card>

    </a-modal>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tools/DetailList'
import { httpAction } from '@/api/manage'
const DetailListItem = DetailList.Item
export default {
  name: 'SalarySearchModal',
  components: {
    DetailListItem,
    DetailList
  },
  data(){
    return{
      visible:false,
      toggleSearchStatus: false,
      searchLoading:false,
      loading: false,
      detailVisible: false,
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      distributionFlagOption:{'0':'未发放','1':'发放成功','2':'发放失败'},
      distributionFlagOptions:{
        '0':{'option': '未发放', 'color': 'green'},
        '1':{'option': '发放成功', 'color': 'red'},
        '2':{'option': '发放失败', 'color': 'blue'},
      },
      columns:[],
      accountTitle:{},
      dataSource:[],
      saiList:[],
      queryParam:{},
      url:{
        list: 'salary/tengineeraccount/getEmpAccount'
      },
      isTable:false
    }
  },
  methods: {
    show(){
      this.visible = true
      this.searchReset()
    },
    searchQuery(){
      this.loadData()
    },
    searchReset(){
      this.accountTitle = {}
      this.queryParam = {}
      this.dataSource = []
      this.isTable = false
    },
    loadData(){
      let httpUrl = this.url.list
      if(this.queryParam){
        if(this.queryParam.settleDepartName && !this.queryParam.settlementMonth){
          this.$message.error("请输入结算月份")
          return;
        }
        let i = 1
        for(let c in this.queryParam){
          if(i == 1){
            httpUrl = httpUrl + '?' + c + '=' + this.queryParam[c]
            i++
          }else{
            httpUrl = httpUrl + '&' + c + '=' + this.queryParam[c]
          }
        }
      }else{
        this.$message.error("请输入查询条件")
        return;
      }
      this.loading = true
      this.searchLoading = true
      httpAction(httpUrl, {}, 'GET').then((res) => {
        this.loading = false
        this.searchLoading = false
        if(res.code == 200){
          this.isTable = true
          this.columns = [
            {
              title: '姓名',
              dataIndex: 'empName',
              width: 130,
              fixed: 'left',
              align: 'center',
              key: 'empName'
            },
            {
              title: '发放状态',
              dataIndex: 'distributionFlag',
              width: 120,
              key: 'distributionFlag',
              align: 'center',
              scopedSlots: { customRender: 'distributionFlag' }
            },
            {
              title: '身份证号',
              width: 130,
              align: 'center',
              dataIndex: 'empIdcard',
              key: 'empIdcard',
            },
            {
              title: '银行卡号',
              width: 130,
              align: 'center',
              dataIndex: 'bankNo',
              key: 'bankNo'
            },
            {
              title: '开户行',
              width: 130,
              align: 'center',
              dataIndex: 'bankName',
              key: 'bankName',
              customRender: (text) => {
                return text
              },
            },
            {
              title: '工资发放时间',
              width: 130,
              align: 'center',
              dataIndex: 'salaryGiveTime',
              key: 'salaryGiveTime',
              customRender: (text) => {
                return this.salaryGiveTimeOption[text]
              }
            },
            {
              title: '工资月份',
              width: 130,
              align: 'center',
              dataIndex: 'salaryDate',
              key: 'salaryDate'
            },
            {
              title: '结算月份',
              width: 130,
              align: 'center',
              dataIndex: 'settlementMonth',
              key: 'settlementMonth'
            },
            {
              title: '结算主体',
              width: 130,
              align: 'center',
              dataIndex: 'settleDepartName',
              key: 'settleDepartName'
            }
          ]
          this.dataSource = res.data.engineerAccountList
          this.accountTitle = res.data.accountTitle
          let isDeductSocial = this.dataSource.length > 0 ? this.dataSource[0]['isDeductSocial'] : ''
          if(this.dataSourceList && isDeductSocial == 1){
            this.columns.push(
              {
                title: '社保扣缴月份',
                width: 130,
                align: 'center',
                dataIndex: 'deduSocialMonth',
                key: 'deduSocialMonth'
              },
            )
            this.columns.push(
              {
                title: '社保优先级',
                width: 130,
                align: 'center',
                dataIndex: 'socialPriority',
                key: 'socialPriority',
                customRender: (text) => {
                  return this.socialPriorityOption[text]
                }
              },
            )
            this.columns.push(
              {
                title: '是否扣除社保',
                width: 130,
                align: 'center',
                dataIndex: 'isDeductSocial',
                key: 'isDeductSocial',
                customRender: (text) => {
                  if(!text){
                    return '否'
                  }else{
                    return this.isFlag[text]
                  }
                }
              },
            )
          }
          this.columns.push({
            title: '操作',
            width: 130,
            align: 'center',
            key: 'action',
            fixed: 'right',
            scopedSlots: { customRender: 'operation' }
          })
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    // 展示单个工资明细详情明细
    detail(id){
      // this.saiList =  this.dataSource[key]['saiList']
      // this.detailVisible = true
      for(var c of this.dataSource){
        if(c.id == id){
          this.saiList = c.saiList
          break;
        }
      }
      this.detailVisible = true
    },
    // 关闭工资明细详情
    handleDetailOk(){
      this.detailVisible = false
    },
    // 关闭工资明细详情
    handleDetailCancel(){
      this.detailVisible = false
    },
    handleCancel(){
      this.visible = false
    },
    //导出
    handleDownload(){
      if(this.dataSource.length > 0){
        let engineerAccountList = JSON.parse(JSON.stringify(this.dataSource))  
        console.log(engineerAccountList);
        let accountTitle = this.accountTitle
        for(let d in engineerAccountList){
          engineerAccountList[d].salaryStyle      = this.salaryStyleOption[engineerAccountList[d].salaryStyle]
          engineerAccountList[d].salaryGiveTime   = this.salaryGiveTimeOption[engineerAccountList[d].salaryGiveTime]
          engineerAccountList[d].salaryTaxFlag    = this.isFlag[engineerAccountList[d].salaryTaxFlag]
          engineerAccountList[d].socialPriority   = this.socialPriorityOption[engineerAccountList[d].socialPriority]
          engineerAccountList[d].fundPriority     = this.fundPriorityOption[engineerAccountList[d].fundPriority]
          engineerAccountList[d].annualBonusType  = this.annualBonusTypeOption[engineerAccountList[d].annualBonusType]
          engineerAccountList[d].isDeductSocial   = this.isFlag[engineerAccountList[d].isDeductSocial]
          engineerAccountList[d].isDeductFund     = this.isFlag[engineerAccountList[d].isDeductFund]
          engineerAccountList[d].distributionFlag = this.distributionFlagOption[engineerAccountList[d].distributionFlag]
          if(accountTitle){
            for(let c in accountTitle){
              engineerAccountList[d][accountTitle[c]] = ''
              let saiList = engineerAccountList[d].saiList
              for(let m in saiList){
                if(saiList[m].javaFiedName == accountTitle[c]){
                  engineerAccountList[d][accountTitle[c]] = saiList[m].salaryMoney
                }
              }
            }
          }
        }

        let isDeductSocial = engineerAccountList.length > 0 ? engineerAccountList[0]['isDeductSocial'] : ''
        let engineerAccountListHeader
        let engineerAccountListValue
        if(isDeductSocial == 1){
          engineerAccountListHeader  = ["工资月份","发放状态","结算月份","结算主体","姓名","身份证号","银行卡号","开户行","工资发放方式","工资发放次数","工资发放时间","社保扣缴月份",
            "社保优先级","是否扣除社保"]
          engineerAccountListValue =  ["salaryDate","distributionFlag","settlementMonth", "settleDepartName", "empName", "empIdcard", "bankNo", "bankName", "salaryStyle","salaryCount","salaryGiveTime","deduSocialMonth",
            "socialPriority","isDeductSocial"] 
        }else{
          engineerAccountListHeader  = ["工资月份","发放状态","结算月份","结算主体","姓名","身份证号","银行卡号","开户行","工资发放方式","工资发放次数","工资发放时间"]
          engineerAccountListValue =  ["salaryDate", "distributionFlag","settlementMonth", "settleDepartName", "empName", "empIdcard", "bankNo", "bankName", "salaryStyle","salaryCount","salaryGiveTime"] 
        }

        //工资明细详情字段组装     
        if(accountTitle){
          for(let c in accountTitle){
            engineerAccountListHeader.push(c)
            engineerAccountListValue.push(accountTitle[c])
          }
        }
        var excelDatas = [
          {
            tHeader: engineerAccountListHeader,
            filterVal: engineerAccountListValue,
            tableDatas: engineerAccountList, // 表一的整体json数据
            sheetName: "工资条"// 表一的sheet名字
          },
        ]
        let excelName = "工程薪资工资条"
        this.json2excel(excelDatas, excelName, true, "xlsx")
        
      }else{
        this.$message.error("当前无数据可导出")
      }
    },
    json2excel(tableJson, filenames, autowidth, bookTypes){
      var that = this
      //这个是引用插件
      import("@/vendor/ExportEngineExcel").then(excel => {
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
          bookType: bookTypes
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus
    },
  }
}
</script>

