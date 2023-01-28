<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="姓名">
              <a-input
                v-model="queryParam.name"
                placeholder="请输入姓名全称"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="证件号码">
              <a-input
                v-model="queryParam.idCard"
                placeholder="请输入证件号码"
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
      <a-row>
        <a-col :span="12">
          <a-button
            type="primary"
            @click="handleAdd"
          >身份证实名验证</a-button>
          <a-button
            type="primary"
            style="margin-left:20px"
            @click="handleExport"
            :loading="exportLoading"
          >导出</a-button>
        </a-col>
        
      </a-row>
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
      </a-table>
    </div>
    
    <information-check-modal 
      ref="modalForm"
      @ok="modalFormOk">
    </information-check-modal>

  </a-card>
</template>
<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import InformationCheckModal from './modules/InformationCheckModal'
  import { httpAction } from '@/api/manage'

  export default {
    name: "InformationCheckList",
    mixins: [JeecgListMixin],
    components: {
      InformationCheckModal,
    },
    data () {
      return {
        visible:false,
        confirmLoading:false,
        queryParam: {},
        deLoading:false,
        exportLoading:false,
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
            title: '姓名',
            align: 'center',
            dataIndex: 'name',
          },
          {
            title: '证件号码',
            align: 'center',
            dataIndex: 'idCard'
          },
        ],
        url: { 
          list: '/checks/tcheckidcard/page?isTrue=1&orders%5B0%5D.asc=false&orders%5B0%5D.column=create_time',//列表页面排序
          doExport:'/checks/tcheckidcard/getAllList?isTrue=1'//导出
        },
      }
      
    },
    methods:{
      handleExport(){
        this.exportLoading = true
        const params = this.getQueryParams()//查询条件
        const url = this.url.doExport
        httpAction(url,params,'get').then((res) => {
          
          if(Number(res.code) === 200){
            const salaryAccountListHeader = [
            '姓名','证件号码']
            const salaryAccountListValue =  [
            'name','idCard']
            const excelDatas = [
              {
                tHeader: salaryAccountListHeader, // 表一的数据字段
                filterVal: salaryAccountListValue, // sheet表一头部
                tableDatas: res.data, // 表一的整体json数据
                sheetName: "信息校验"// 表一的sheet名字
              },
            ]
            this.json2excel(excelDatas, "信息校验", true, "xlsx")
            this.exportLoading = false
          }else{
            this.$message.error(res.msg)
          }
        }).catch(()=>{
         this.$message.error('导出失败！请稍后再试')
         this.exportLoading = false
        })
      },

      json2excel(tableJson, filenames, autowidth, bookTypes){
        const that = this
        //这个是引用插件
        import("@/vendor/ExportCommonExcel").then(excel => {
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