<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算周期">
              <a-range-picker
                :placeholder="['开始日期', '结束日期']"
                format="YYYYMM"
                :mode="datemode"
                @panelChange="handlePanelChange"
                @change="handleChange"
                v-model="queryParam.settleMonth_extra"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="服务对象"
              class="stepFormText"
            >
              <a-input
                placeholder="请输入服务对象"
                v-model="queryParam.unitName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户编码">
              <a-input
                placeholder="请输入客户编码"
                v-model="queryParam.unitNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="薪资类型">
                <a-select
                  placeholder="请选择薪资类型"
                  v-model="queryParam.salaryType"
                  :allowClear="true"
                >
                  <a-select-option value="0">普通薪资</a-select-option>
                  <a-select-option value="1">劳务费</a-select-option>
                  <a-select-option value="2">工程薪资</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="是否扣税">
                <a-select
                  placeholder="请选择是否扣税"
                  v-model="queryParam.salaryTaxFlag"
                  :allowClear="true"
                >
                  <a-select-option value="1">是</a-select-option>
                  <a-select-option value="0">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="身份证号">
                <a-input
                  placeholder="请输入身份证号"
                  v-model="queryParam.empIdcard"
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        type="primary"
        icon="export"
        style="margin:0px 10px"
        :loading="btnLoading"
        @click="handleExport"
      >导出</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{x: 1}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAreaName } from '@/utils/common'

  const salaryTypeOption = {'0':'普通薪资','1':'劳务费','2':'工程薪资'}

  export default {
    name: 'IncomeDetailList',
    mixins: [JeecgListMixin],
    data() {
      return {
        // 表头
        columns: [
          {
            width: 100,
            ellipsis: true,
            title: '结算周期',
            align: 'center',
            dataIndex: 'settleMonth',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 200,
            ellipsis: true,
            title: '服务对象',
            align: 'center',
            dataIndex: 'unitName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '客户编码',
            align: 'center',
            dataIndex: 'unitNo',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '薪资类型',
            align: 'center',
            dataIndex: 'salaryType',
            customRender:(text) => {
              const str = salaryTypeOption[text];
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '人员姓名',
            align: 'center',
            dataIndex: 'empName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcard',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '联系方式',
            align: 'center',
            dataIndex: 'empPhone',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '户籍所在地',
            align: 'center',
            dataIndex: 'fileProvince',
            customRender:(text,record) => {
              const str = getAreaName(text,record.fileCity,record.fileTown);
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '用工工资',
            align: 'center',
            dataIndex: 'realaryMoney',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '扣税申报(个人负担)',
            align: 'center',
            dataIndex: 'salaryTax',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '是否扣税',
            align: 'center',
            dataIndex: 'salaryTaxFlag',
            customRender:(text) => {
              const str = text == 1 ? '是' : '否'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          }
        ],
        btnLoading:false,
        url: {
          list: 'salary/tstatisticsemployeedetail/page?orders%5B0%5D.asc=false&orders%5B0%5D.column=settle_month&orders%5B1%5D.asc=false&orders%5B1%5D.column=id',
          exportUrl:'salary/tstatisticsemployeedetail/getTStatisticsEmployeeDetailList',
        },
        datemode: ['month', 'month'],
      }
    },
    methods: {
      handlePanelChange(value, mode){
        this.queryParam.settleMonth_extra = value
        this.datemode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]];
        this.queryParam.settleMonthStart = value[0].format('YYYYMM')
        this.queryParam.settleMonthEnd = value[1].format('YYYYMM')
      },
      handleChange(value){
        if(value.length == 0){
          delete this.queryParam.settleMonthStart;
          delete this.queryParam.settleMonthEnd;
        }
      },
      handleExport(){
        // eslint-disable-next-line
        const param = _.cloneDeep(this.queryParam)
        delete param.settleMonth_extra
        const _this = this
        let httpurl = `${_this.url.exportUrl}?1=1`
        if(_this.selectedRowKeys.length){
          httpurl += `&idList=${_this.selectedRowKeys.join(',')}`
        }
        if(Object.keys(param).length){
          const qs = require('qs')
          httpurl += '&'+qs.stringify(param)
        }

        _this.btnLoading = true;
        httpAction(httpurl,{},'get',60000).then(res=>{
          if(res.code === 200){
            const arr = res.data.map(item=>{
              item.salaryTypeName = salaryTypeOption[item.salaryType];
              item.settleMoney = item.settleMoney || 0;
              item.salaryTaxFlag = item.salaryTaxFlag == 1 ? '是' : '否';
              item.area = getAreaName(item.fileProvince,item.fileCity,item.fileTown);
              return item;
            })
            const excelDatas = [{
              tHeader: ['结算周期', '服务对象','客户编码','薪资类型','人员姓名','身份证号','联系方式',
              '户籍所在地','用工工资','扣税申报(个人负担)','是否扣税'],
              filterVal: ['settleMonth','unitName','unitNo','salaryTypeName','empName','empIdcard','empPhone',
              'area','realaryMoney','salaryTax','salaryTaxFlag'],
              tableDatas: arr,
              sheetName: '员工收入明细'
            }]
            _this.json2excel(excelDatas, `员工收入明细`, true, "xlsx");
          }else{
            _this.$message.warning(res.msg);
          }
        }).finally(()=>{
          setTimeout(()=>{
            _this.btnLoading = false;
          },2000)
        })
      },
      json2excel(tableJson, filenames, autowidth, bookTypes){
        var that = this
        //这个是引用插件
        import("@/vendor/ExportCommonExcel").then(excel => {
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
          })
        }).finally(()=>{
          that.$message.success('导出成功！');
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j] || ''
        }))
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

</style>
