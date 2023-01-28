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
                placeholder="请选择申报月份"
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
                v-model="queryParam.departName"
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
        :loading="downLoading"
        @click="handleExport"
      >导出</a-button>
      <a-button
        type="primary"
        style="margin-left:10px"
        v-has="'wxhr:tstatisticscurrentreport_doDeleteByDeclareMonth'"
        @click="handleDeleteBatch"
      >批量删除</a-button>
      <a-button
        type="primary"
        style="margin-left:10px"
        v-has="'wxhr:tstatisticstaxsalary_refresh'"
        @click="handleFresh"
      >手动刷新</a-button>
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
              v-have="'wxhr:tstatisticscurrentreport_del'"
            >删除</a>
          </a-popconfirm>
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
                placeholder="请选择申报月份"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    
    <fresh-modal ref="FreshForm" @ok="modalFormOk"></fresh-modal>
  </a-card>
</template>
<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction,getAction } from '@/api/manage'
  import moment from "moment"
  import FreshModal from './modules/FreshModal'

  export default {
    name: "CurrentList",
    mixins: [JeecgListMixin],
    components: {
      FreshModal
    },
    data () {
      return {
        visible:false, // 控制显示
        confirmLoading:false, // 控制弹框显示
        downLoading:false, // 控制下载按钮显示
        deLoading:false,
        queryParam: {},
        form:this.$form.createForm(this), // 创建表单
        yearMonth:'',
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
            title: '姓名',
            align: 'center',
            width: 120,
            dataIndex: 'empName',
            
          },
          {
            title: '身份证号',
            align: 'center',
            width: 120,
            dataIndex: 'empIdcard'
          },
          {
            title: '税务主体',
            align: 'center',
            width: 210,
            dataIndex: 'invoiceTitle'
          },
          {
            title: '结算主体',
            align: 'center',
            width: 120,
            dataIndex: 'settleDepartName',
          },
          {
            title: '结算编码',
            align: 'center',
            width: 120,
            dataIndex: 'settleDepartNo',
          },
          {
            title: '结算单位',
            align: 'center',
            width: 210,
            dataIndex: 'unitName',
          },
          {
            title: '本期收入',
            align: 'center',
            width: 120,
            dataIndex: 'realSalary',
            
          },
          {
            title: '本期应纳税',
            align: 'center',
            width: 120,
            dataIndex: 'salaryTax',
          },
          
          {
            title: '本期基本养老保险',
            align: 'center',
            width: 130,
            dataIndex: 'personalPensionMoney',
          },
          {
            title: '本期基本医疗保险',
            align: 'center',
            width: 130,
            dataIndex: 'personalMedicalMoney',
          },
          {
            title: '本期失业保险',
            align: 'center',
            width: 120,
            dataIndex: 'personalUnemploymentMoney',
          },
          {
            title: '本期住房公积金',
            align: 'center',
            width: 120,
            dataIndex: 'personalProvidentFee',
          },
          {
            title: '本期企业年金',
            align: 'center',
            width: 120,
            dataIndex: 'enterpriseAnnuity',
          },
          {
            title: '累计减除费用',
            dataIndex: 'costReduction',
            align: 'center',
            width: 130,
          },
          {
            title: '累计应纳税所得额',
            dataIndex: 'taxable',
            align: 'center',
            width: 130,
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
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            width: 120,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: '/salary/tstatisticscurrentreport/page',
          delete: '/salary/tstatisticscurrentreport/',
          doSubmit:'/salary/tstatisticscurrentreport/doStatisticsTaxSalary',
          exportUrl:'salary/tstatisticscurrentreport/doExportStatisticsSalary',
          deleteBatch:'/salary/tstatisticscurrentreport/doDeleteByDeclareMonth'
        },
        nowMonth:'',
        nowYear: ''
      }
      
    },
    created(){
      // 转换当前月份
      this.nowMonth = moment().format("M")
      // 转换当前年
      this.nowYear = moment().format("Y")
    },
    methods:{
      handleFresh(){
        this.$refs.FreshForm.show();
      },
      //下载模板
      handleDown(){
        let templateUrl = '/templates/非扣税项模板.xlsx'
        let url = window.location.protocol+'//'+window.location.hostname+':'+window.location.port+templateUrl
        window.location.href = url
      },
      //批量删除
      handleDeleteBatch(){
        this.visible = true
        this.deLoading = false
      },
      // 保存
      handleOk(){
        // 判断是否有月份
        if(!this.yearMonth){
          this.$message.error("请选择月份")
          return false
        }
        // 加载框显示
        this.deLoading = true
        // 转换月份
        let yearMonth = this.yearMonth.format("YYYYMM")
        // 表单提交
        httpAction(this.url.deleteBatch + '?yearMonth=' + yearMonth,{},'POST').then((res) => {
          this.deLoading = false
          if(res.code == 200){
            this.$message.success("删除成功")
            // 加载数据
            this.loadData()
            // 关闭摊款
            this.close()
          }else{
            // 错误提示
            this.$message.error(res.msg)
          }
        })
      },
      // 取消弹框
      handleCancel(){
        this.close()
      },
      close(){
        this.visible = false
        this.yearMonth = ''
      },
      // 导出
      handleExport() {
        this.downLoading = true
        var params = this.getQueryParams()//查询条件
        delete params.current
        delete params.size
        // 获取导出的数据
        getAction(this.url.exportUrl,params).then((res) => {
          // 组装导出的数据
          var excelDatas = [
            {
              tHeader: ["姓名",'身份证号','税务主体','结算主体','结算编码','结算单位','本期收入','本期应纳税','本期基本养老保险','本期基本医疗保险','本期失业保险','本期住房公积金','本期企业年金','累计减除费用','累计应纳税所得额',
              '累计子女教育','累计继续教育','累计住房贷款','累计住房租金','累计赡养老人','累计3岁以下婴幼儿照护','累计个人养老金'], // 表一的数据字段
              filterVal: ['empName','empIdcard','invoiceTitle','settleDepartName','settleDepartNo','unitName','realSalary','salaryTax','personalPensionMoney','personalMedicalMoney','personalUnemploymentMoney',
              'personalProvidentFee','enterpriseAnnuity','costReduction','taxable','childEduinfoMoney','continuingEducationExpenseMoney',
              'housingLoanInterestExpenseMoney','housingRentalinfoMoney','supportElderlyExpenseMoney','sumBabyMoney','sumPrivatePension'], // sheet表一头部
              tableDatas: res.data, // 表一的整体json数据
              sheetName: "申报人员"// 表一的sheet名字
            },
          ]
          // 调用导出接口
          this.json2excel(excelDatas, "本期申报", true, "xlsx")
          // 关闭加载框
          this.downLoading = false
        })
      },
      json2excel(tableJson, filenames, autowidth, bookTypes){
        var that = this
        //这个是引用插件
        import("@/vendor/Export2Excel").then(excel => {
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
      // 查询时间格式转换
      handleTimeBeginChange(date) {
        // 时间格式化
        this.queryParam.declareMonth = date ? (date.format("YYYYMM")) : null
      },
    }
  }
</script>