<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="商务主体">
              <a-input
                placeholder="请输入商务主体"
                v-model="queryParam.companyName"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="地市">
              <a-input
                placeholder="请输入地市"
                v-model="queryParam.citys"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="行业类型">
              <a-input
                placeholder="请输入行业类型"
                v-model="queryParam.hangyeType"
              />
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="业务类型">
                <a-input
                  placeholder="请输入业务类型"
                  v-model="queryParam.yewuType"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="业务细分">
                <a-input
                  placeholder="请输入业务细分"
                  v-model="queryParam.yewuDetail"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="单位名称">
                <a-input
                  placeholder="请输入单位名称"
                  v-model="queryParam.unit"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="部门名称">
                <a-input
                  placeholder="请输入部门名称"
                  v-model="queryParam.dept"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="部门编码">
                <a-input
                  placeholder="请输入部门编码"
                  v-model="queryParam.deptNo"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="收入归属">
                <a-input
                  placeholder="请输入收入归属"
                  v-model="queryParam.org"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算月份">
                <a-month-picker
                  v-model="queryParam.dateTemp1"
                  style="width: 100%"
                  placeholder="请选择结算月份"
                  :defaultValue="moment().month(moment().month() - 1)"
                  @change="handleTimeRevenEndChange"
                  format="YYYYMM"
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
      style="margin-bottom:10px"
    >
      <a-button
        type="primary"
        @click="handleDownload"
        :loading="downLoading"
      >导出</a-button>
      <a-button
        v-has="'wxhr:tstatisticssalary_adminSave'"
        type="primary"
        style="margin-left:10px"
        :loading="addLoading"
        @click="adminGenerate"
      >管理员生成</a-button>
      <a-button
        type="primary"
        style="margin-left:10px"
        v-has="'wxhr:tstatisticssalary_doDeleteByDeclareMonth'"
        :loading="addLoading"
        @click="delByMonth"
      >管理员删除</a-button>
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
        :scroll="{x: 1}"
      >
      </a-table>
    </div>
    <labor-generate-modal ref="LaborGenerateForm" @ok="modalFormOk" :title="modalTitle"></labor-generate-modal>
  </a-card>
</template>
<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction,getAction } from '@/api/manage'
  import LaborGenerateModal from './modules/LaborGenerateModal'

  export default {
    name: "LaborCostList",
    mixins: [JeecgListMixin],
    components: {
      LaborGenerateModal,
    },
    
    data () {
      return {
        visible:false,
        confirmLoading:false,
        queryParam: {},
        addLoading: false,
        downLoading: false,
        employData:[],
        columns: [
          {
            width: 120,
            ellipsis: true,
            title: '结算月份',
            align: 'center',
            dataIndex: 'settleMonth',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '数据来源',
            align: 'center',
            dataIndex: 'formType',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '开发部门',
            align: 'center',
            dataIndex: 'developerOrgan',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '业务开发人',
            align: 'center',
            dataIndex: 'developer',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '商务主体',
            align: 'center',
            dataIndex: 'companyName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '地市',
            align: 'center',
            dataIndex: 'citys',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '行业类型',
            align: 'center',
            dataIndex: 'hangyeType',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '行业细分',
            align: 'center',
            dataIndex: 'hangyeDetail',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '业务类型',
            align: 'center',
            dataIndex: 'yewuType',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '业务细分',
            align: 'center',
            dataIndex: 'yewuDetail',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '客户类型',
            align: 'center',
            dataIndex: 'customerType',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '客户',
            align: 'center',
            dataIndex: 'unit',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '合同名称',
            align: 'center',
            dataIndex: 'contractName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: 'CRM合同编号',
            align: 'center',
            dataIndex: 'crmNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '合同提报人',
            align: 'center',
            dataIndex: 'contractCreateUser',
            customRender:(text) => {
              for(const c in this.employData){
                if(String(c) === String(text)){
                  return  <a-tooltip title={this.employData[c]}>{this.employData[c]}</a-tooltip>
                }
              }
              return '-'
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'dept',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '结算主体编码',
            align: 'center',
            dataIndex: 'deptNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '收入归属',
            align: 'center',
            dataIndex: 'org',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '收入归属细分',
            align: 'center',
            dataIndex: 'orgDetail',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '客户新增月份',
            align: 'center',
            dataIndex: 'unitAdd',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '结算主体新增月份',
            align: 'center',
            dataIndex: 'deptAdd',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '表单客服',
            align: 'center',
            dataIndex: 'customerService',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '结算金额',
            align: 'center',
            dataIndex: 'accountMoneySum',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '银付',
            align: 'center',
            dataIndex: 'cardPay',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '现金支付',
            align: 'center',
            dataIndex: 'moneyPay',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '单位社保',
            align: 'center',
            dataIndex: 'unitSocial',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '个人社保',
            align: 'center',
            dataIndex: 'personalSocial',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '单位公积金',
            align: 'center',
            dataIndex: 'unitFund',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '个人公积金',
            align: 'center',
            dataIndex: 'personalFund',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '扣个税',
            align: 'center',
            dataIndex: 'personalCurmonthTax',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '商险',
            align: 'center',
            dataIndex: 'takingRisks',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '社保卡费',
            align: 'center',
            dataIndex: 'unitSocialCard',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '其他费用',
            align: 'center',
            dataIndex: 'personalOtherMoney',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '备注',
            align: 'center',
            dataIndex: 'remark',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '企业年金',
            align: 'center',
            dataIndex: 'enterpriseAnnuity',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '上次差余额',
            align: 'center',
            dataIndex: 'prevPoorBalance',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '本次差余额',
            align: 'center',
            dataIndex: 'curPoorBalance',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '档案人数',
            align: 'center',
            dataIndex: 'personNum',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '人次',
            align: 'center',
            dataIndex: 'personTime',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '管理费',
            align: 'center',
            dataIndex: 'managementMoney',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '增值税3%',
            align: 'center',
            dataIndex: 'countTax3',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '增值税5%',
            align: 'center',
            dataIndex: 'countTax5',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '增值税6%-9%',
            align: 'center',
            dataIndex: 'countTax6',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '增值税9%-11%',
            align: 'center',
            dataIndex: 'countTax10',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '风险金',
            align: 'center',
            dataIndex: 'riskFund',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '开票金额',
            align: 'center',
            dataIndex: 'ticketMoneySum',
            customRender: text => {
              const resultText = text || (String(text) === '0'?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '事务外包分成明细',
            align: 'center',
            dataIndex: 'oneTimeDetail',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
        ],
        url: {
          list: '/salary/tstatisticssalary/page',
          doExportUrl:'salary/tstatisticssalary/doExportStatisticsSalary'
        },
        modalTitle:''
      }
      
    },
    created () {
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if(Number(res.code) === 200){
          this.employData = res.data
        }
      })
    },
    
    methods:{
      adminGenerate(){
        this.modalTitle = '管理员生成';
        this.$refs.LaborGenerateForm.url = '/salary/tstatisticssalary/adminSaveStatisticsSalary?settleMonth=';
        this.$refs.LaborGenerateForm.show();

      },
      delByMonth(){
        this.modalTitle = '管理员删除';
        this.$refs.LaborGenerateForm.url = `/salary/tstatisticssalary/doDeleteByDeclareMonth?yearMonth=`;
        this.$refs.LaborGenerateForm.show();
      },
      handleCancel(){
        this.visible = false
      },
      handleTimeRevenEndChange(date) {
        // 时间格式化
        this.queryParam.settleMonth = date ? (date.format("YYYYMM")) : null
      },
      // 合同提报人
      nameFun(name){
        for(const c in this.employData){
          if(String(c) === String(name)){
            return this.employData[c]
          }
        }
      },
      //导出
      handleDownload(){
        this.downLoading = true
        const params = this.getQueryParams()//查询条件
        const url = this.url.doExportUrl
        getAction(url,params).then((res) => {
          if(Number(res.code) === 200){
            const salaryAccountListHeader = [
            '结算月份','数据来源','开发部门','业务开发人','商务主体','地市',
            '行业类型','行业细分','业务类型','业务细分','客户类型',
            '客户','合同名称','CRM合同编号','合同提报人','结算主体','结算主体编码','收入归属','收入归属细分',
            '客户新增月份','结算主体新增月份','表单客服','结算金额','银付',
            '现金支付','单位社保','个人社保','单位公积金','个人公积金',
            '扣个税','商险','社保卡费','其他费用','备注',
            '企业年金','上次差余额','本次差余额','档案人数','人次',
            '管理费','增值税3%','增值税5%','增值税6%-9%','增值税9%-11%','风险金',
            '开票金额','事务外包分成明细']
            const salaryAccountListValue =  [
            'settleMonth','formType','developerOrgan','developer','companyName','citys',
            'hangyeType','hangyeDetail','yewuType','yewuDetail','customerType',
            'unit','contractName','crmNo','contractCreateUser','dept','deptNo','org','orgDetail',
            'unitAdd','deptAdd','customerService','accountMoneySum','cardPay',
            'moneyPay','unitSocial','personalSocial','unitFund','personalFund',
            'personalCurmonthTax','takingRisks','unitSocialCard','personalOtherMoney','remark',
            'enterpriseAnnuity','prevPoorBalance','curPoorBalance','personNum','personTime',
            'managementMoney','countTax3','countTax5','countTax6','countTax10','riskFund',
            'ticketMoneySum','oneTimeDetail']
            for(const i in res.data){
              res.data[i].hangye = res.data[i].hangye ? res.data[i].hangye : ''
              res.data[i].deptReduce = res.data[i].deptReduce ? res.data[i].deptReduce : ''
              res.data[i].remark = res.data[i].remark ? res.data[i].remark : ''
              res.data[i].contractCreateUser = res.data[i].contractCreateUser ? this.nameFun(res.data[i].contractCreateUser):''
            }
            const excelDatas = [
              {
                tHeader: salaryAccountListHeader, // 表一的数据字段
                filterVal: salaryAccountListValue, // sheet表一头部
                tableDatas: res.data, // 表一的整体json数据
                sheetName: "人工成本统计"// 表一的sheet名字
              },
            ]
            this.json2excel(excelDatas, "人工成本统计", true, "xlsx")
            this.downLoading = false
          }
        })
      },
      json2excel(tableJson, filenames, autowidth, bookTypes){
        const that = this
        //这个是引用插件
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = []
          const dataArr = []
          const sheetnames = []
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
