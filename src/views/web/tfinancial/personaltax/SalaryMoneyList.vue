<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="申报月份">
              <a-month-picker
                v-model="queryParam.dateTemp"
                @change="handleTimeBeginChange"
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
            <a-form-item label="税务主体">
              <a-input
                v-model="queryParam.invoiceTitle"
                placeholder=""
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <a-input
                v-model="queryParam.settleDepartName"
                placeholder=""
              />
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

    <div
      class="table-operator"
      style="margin-bottom:10px"
    >

      <a-button
        type="primary"
        @click="handleExport"
        :loading="downLoading"
      >导出</a-button>
      <!-- <a-button
        style="margin-left:10px"
        type="primary"
        :loading="doLoading"
        @click="handleDo"
      >生成</a-button> -->
      <a-button
        type="primary"
        style="margin-left:10px"
        v-has="'wxhr:tstatisticstaxsalary_doDeleteByDeclareMonth'"
        @click="handleDeleteBatch"
      >批量删除</a-button>
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
        :scroll="{x: 1}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a-popconfirm
            title="确认删除吗?"
            @confirm="handleDelete(record.id)"
            okText="确定"
            cancelText="取消"
          >
            <a
              href="#"
              v-have="'wxhr:tstatisticstaxsalary_del'"
            >删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>
    <a-modal
      title="批量删除"
      :width="600"
      placement="right"
      :closable="true"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭"
      okText="删除"
      :visible="visible"
      :maskClosable="false"
      :confirmLoading="deLoading"
    >

      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >

        <a-row>
          <a-col>
            <a-form-item
              label="月份"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-month-picker
                v-model="yearMonth"
                style="width: 191px"
                placeholder="请选择结算月份"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction,getAction } from '@/api/manage'
  import moment from "moment"
  export default {
    name: "SalaryMoneyList",
    mixins: [JeecgListMixin],
    data () {
      return {
        visible:false,
        confirmLoading:false,
        doLoading:false,
        downLoading:false,
        deLoading:false,
        queryParam: {},
        form:this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        columns: [
          {
            title: '税务主体',
            align: 'center',
            width: 200,
            dataIndex: 'invoiceTitle',
          },
          {
            title: '结算主体',
            align: 'center',
            width: 120,
            dataIndex: 'settleDepartName',
          },
          {
            title: '申报月份',
            align: 'center',
            width: 120,
            dataIndex: 'declareMonth',
          },
          {
            title: '姓名',
            align: 'center',
            width: 120,
            dataIndex: 'empName',
          },
          {
            title: '身份证号',
            align: 'center',
            width: 150,
            dataIndex: 'empIdcard'
          },
          {
            title: '累计减除费用',
            align: 'center',
            width: 120,
            dataIndex: 'costReduction',
            
          },
          {
            title: '累计子女教育',
            align: 'center',
            width: 120,
            dataIndex: 'childEduinfoMoney',
          },
          {
            title: '累计继续教育',
            align: 'center',
            width: 120,
            dataIndex: 'continuingEducationExpenseMoney',
          },
          {
            title: '累计住房贷款',
            align: 'center',
            width: 120,
            dataIndex: 'housingLoanInterestExpenseMoney',
          },
          {
            title: '累计住房租金',
            align: 'center',
            width: 120,
            dataIndex: 'housingRentalinfoMoney',
          },
          {
            title: '累计赡养老人',
            align: 'center',
            width: 120,
            dataIndex: 'supportElderlyExpenseMoney',
          },
          {
            title: '累计3岁以下婴幼儿照护',
            align: 'center',
            width: 120,
            dataIndex: 'sumBabyMoney',
          },
          {
            title: '累计个人养老金',
            align: 'center',
            width: 120,
            dataIndex: 'sumPrivatePension',
          },
          {
            title: '累计公积金',
            align: 'center',
            width: 120,
            dataIndex: 'personalFund',
          },
          {
            title: '累计基本养老',
            align: 'center',
            width: 120,
            dataIndex: 'personalPensionMoney',
          },
          {
            title: '累计基本医疗',
            align: 'center',
            width: 120,
            dataIndex: 'personalMedicalMoney',
          },
          {
            title: '累计失业',
            align: 'center',
            width: 120,
            dataIndex: 'personalUnemploymentMoney',
          },
          {
            title: '累计企业年金',
            align: 'center',
            width: 120,
            dataIndex: 'enterpriseAnnuity',
          },
          {
            title: '累计应纳税所得',
            align: 'center',
            width: 120,
            dataIndex: 'taxable',
          },
          {
            title: '税率',
            align: 'center',
            width: 120,
            dataIndex: 'taxFee',
          },
          {
            title: '速算扣除',
            align: 'center',
            width: 120,
            dataIndex: 'quickDeducation',
          },
          {
            title: '累计应纳税额',
            align: 'center',
            width: 120,
            dataIndex: 'salaryTax',
          },
          
          {
            title: '累计应发',
            align: 'center',
            width: 120,
            dataIndex: 'realSalary',
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            width: 120,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: '/salary/tstatisticstaxsalary/page',
          delete:'/salary/tstatisticstaxsalary/',
          doSubmit:'/salary/tstatisticstaxsalary/doStatisticsTaxSalary',
          exportUrl:'/salary/tstatisticstaxsalary/doExportStatisticsSalary',
          deleteBatch:'/salary//tstatisticstaxsalary/doDeleteByDeclareMonth'
        },
        nowMonth:'',
        nowYear: '',
        yearMonth:'',
      }
      
    },
    created(){
      this.nowMonth = moment().format("M")
      this.nowYear = moment().format("Y")
    },
    methods:{
      //下载模板
      handleDown(){
        const templateUrl = '/templates/非扣税项模板.xlsx'
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
        window.location.href = url
      },
      //生成
      handleDo() {
        this.doLoading = true
        httpAction(this.url.doSubmit,{}, 'POST',10000*6).then((res) => {
          this.doLoading = false
          if(Number(res.code) === 200){
            this.$message.success("成功")
            this.loadData()
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      handleDeleteBatch(){
        this.visible = true
        this.deLoading = false
      },
      handleOk(){
        if(!this.yearMonth){
          this.$message.error("请选择月份")
          return false
        }
        this.deLoading = true
        const yearMonth = this.yearMonth.format("YYYYMM")
        httpAction(`${this.url.deleteBatch}?yearMonth=${yearMonth}`,{},'POST').then((res) => {
          this.deLoading = false
          if(Number(res.code) === 200){
            this.$message.success("删除成功")
            this.loadData()
            this.close()
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      handleCancel(){
        this.close()
      },
      close(){
        this.visible = false
        this.yearMonth = ''
      },
      handleExport() {
        this.downLoading = true
        const params = this.getQueryParams()//查询条件
        delete params.current
        delete params.size
        getAction(this.url.exportUrl,params).then((res) => {
          const excelDatas = [
            {
              tHeader: ["税务主体",'结算主体','申报月份','姓名','身份证号','累计减除费用','累计子女教育','累计继续教育','累计住房贷款','累计住房租金','累计赡养老人',
              '累计3岁以下婴幼儿照护','累计个人养老金','累计基本养老','累计基本医疗','累计失业','累计公积金','累计企业年金','累计应纳税所得','税率','速算扣除','累计应纳税额','累计应发'], // 表一的数据字段
              filterVal: ['invoiceTitle','settleDepartName','declareMonth','empName','empIdcard','costReduction','childEduinfoMoney',
              'continuingEducationExpenseMoney','housingLoanInterestExpenseMoney','housingRentalinfoMoney','supportElderlyExpenseMoney',
              'sumBabyMoney','sumPrivatePension','personalPensionMoney','personalMedicalMoney','personalUnemploymentMoney','personalFund','enterpriseAnnuity','taxable','taxFee','quickDeducation',
              'salaryTax','realSalary'], // sheet表一头部
              tableDatas: res.data, // 表一的整体json数据
              sheetName: "工资薪金"// 表一的sheet名字
            },
          ]
          this.json2excel(excelDatas, "工资薪金", true, "xlsx")
          this.downLoading = false
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
      },
      handleTimeBeginChange(date) {
        // 时间格式化
        this.queryParam.declareMonth = date ? (date.format("YYYYMM")) : null
      },
    }
  }
</script>
