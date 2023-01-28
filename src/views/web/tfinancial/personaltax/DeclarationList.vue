<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
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
              <!-- <a
                @click="handleToggleSearch"
                style="margin-left: 8px"
              >
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div
      class="table-operator"
      style="margin-bottom:10px"
    >

      <!-- <a-button
        type="primary"
        :loading="doLoading"
        @click="handleDo"
      >生成</a-button> -->
      <a-button
        type="primary"
        :loading="downLoading"
        @click="handleExport"
      >导出</a-button>
      <a-button
        type="primary"
        style="margin-left:10px"
        v-has="'wxhr:tstatisticstaxdeclarer_doDeleteByDeclareMonth'"
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
              v-have="'wxhr:tstatisticstaxdeclarer_del'"
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

  export default {
    name: "DeclarationList",
    mixins: [JeecgListMixin],
    
    data () {
      return {
        visible:false,
        confirmLoading:false,
        downLoading:false,
        deLoading:false,
        form:this.$form.createForm(this),
        yearMonth:'',
        queryParam: {},
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
            dataIndex: 'invoiceTitle',
          },
          {
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDepartName',
          },
          {
            title: '申报月份',
            align: 'center',
            dataIndex: 'declareMonth',
          },
          {
            title: '姓名',
            align: 'center',
            dataIndex: 'empName',
          },
          {
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcard'
          },
          {
            title: '手机号码',
            align: 'center',
            dataIndex: 'phone',
          },
          {
            title: '人员状态',
            align: 'center',
            dataIndex: 'userStatus',
          },
          {
            title: '任职受雇从业类型',
            align: 'center',
            dataIndex: 'userType',
          },
          {
            title: '任职受雇从业日期',
            align: 'center',
            dataIndex: 'taxMonth',
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' },
          }
          
        ],
        url: {
          list: '/salary/tstatisticstaxdeclarer/page',
          delete: '/salary//tstatisticstaxdeclarer/',
          exportUrl: '/salary/tstatisticstaxdeclarer/doExportStatisticsSalary',
          doSubmit:'/salary/tstatisticstaxdeclarer/doStatisticsTaxDeclarer',
          deleteBatch:'/salary/tstatisticstaxdeclarer/doDeleteByDeclareMonth'
        },
        doLoading:false
      }
      
    },
    methods:{
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
      handleOk(){
        if(!this.yearMonth){
          this.$message.error("请选择月份")
          return false
        }
        this.deLoading = true
        let yearMonth = this.yearMonth.format("YYYYMM")
        httpAction(this.url.deleteBatch + '?yearMonth=' + yearMonth,{},'POST').then((res) => {
          this.deLoading = false
          if(res.code == 200){
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
      //生成
      handleDo() {
        this.doLoading = true
        httpAction(this.url.doSubmit,{}, 'POST').then((res) => {
          this.doLoading = false
          if(res.code == 200){
            this.$message.success("提交成功")
            this.loadData()
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      
      handleExport() {
        this.downLoading = true
        var params = this.getQueryParams()//查询条件
        delete params.current
        delete params.size
        getAction(this.url.exportUrl,params).then((res) => {
          var excelDatas = [
            {
              tHeader: ["税务主体",'结算主体','申报月份','姓名','身份证号','手机号码','人员状态','任职受雇从业类型','任职受雇从业日期'], // 表一的数据字段
              filterVal: ['invoiceTitle','settleDepartName','declareMonth','empName','empIdcard','phone','userStatus',
              'userType','taxMonth'], // sheet表一头部
              tableDatas: res.data, // 表一的整体json数据
              sheetName: "申报人员"// 表一的sheet名字
            },
          ]
          this.json2excel(excelDatas, "申报人员列表", true, "xlsx")
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
      handleTimeBeginChange(date) {
        // 时间格式化
        this.queryParam.declareMonth = date ? (date.format("YYYYMM")) : null
      },
    }
  }
</script>