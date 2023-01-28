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
            <a-form-item label="客户名称">
              <select-page
                :id="'id'"
                :title="'customerName'"
                placeholder="请选择客户名称查询"
                v-model="queryParam.unitId"
                :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
              ></select-page>
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
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="余额是否支撑">
              <a-select
                allowClear
                v-model="queryParam.isEnough"
                placeholder="请选择"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option value="0">否</a-select-option>
                <a-select-option value="1">是</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="是否限制派增"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.isDispatch"
                  placeholder="请选择是否限制派增"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option value="0">否</a-select-option>
                  <a-select-option value="1">是</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.deleteFlag"
                  placeholder="请选择状态查询"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option value="0">启用</a-select-option>
                  <a-select-option value="1">禁用</a-select-option>
                </a-select>
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
        @click="handleExport"
        :loading="downLoading"
      >导出</a-button>
      <a-button @click="refresh" :loading="downLoading">刷新</a-button>
      <a-button @click="changeStatus(1)" :loading="downLoading">启用</a-button>
      <a-button @click="changeStatus(0)" :loading="downLoading">禁用</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
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
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="changeStatus(2,record)">{{ record.deleteFlag == 0 ? '禁用' : '启用' }}</a>
          <a-divider type="vertical"/>
          <a @click="handleDetail(record)">操作日志</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <operate-log-modal ref="OperateLogForm"></operate-log-modal>
    <change-status-modal ref="ChangeStatusForm" @ok="modalFormOk"></change-status-modal>
  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  import OperateLogModal from './modules/OperateLogModal'
  import ChangeStatusModal from './modules/ChangeStatusModal'

  export default {
    name: 'FinancialBillsLimitDispatch',
    mixins: [JeecgListMixin],
    components: {
      SelectPage,
      OperateLogModal,
      ChangeStatusModal
    },
    data() {
      return {
        form: this.$form.createForm(this),
        visible:false,
        confirmLoading:false,
        downLoading:false,//导出
        statusOptions: {
          '0': {'option': '未提交', 'color': 'blue'},
          '1': {'option': '待审核', 'color': 'yellow'},
          '2': {'option': '审核中', 'color': 'cyan'},
          '3': {'option': '审核通过', 'color': 'green'},
          '4': {'option': '审核不通过', 'color': 'red'}
        },
        // 表头
        columns: [
          {
            width: 200,
            ellipsis: true,
            title: '客户名称',
            align: 'center',
            dataIndex: 'unitName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 200,
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
            width: 150,
            ellipsis: true,
            title: '累计未回款金额',
            align: 'center',
            dataIndex: 'notRefunded',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '次月预计支出',
            align: 'center',
            dataIndex: 'estimatedSpending',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '客户余额',
            align: 'center',
            dataIndex: 'unitBalance',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '余额是否支撑',
            align: 'center',
            dataIndex: 'isEnough',
            customRender:(text) => {
              const str = text ? '是' : '否'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '提醒状态',
            align: 'center',
            dataIndex: 'isAlert',
            customRender:(text) => {
              const str = text ? '已提醒' : '未提醒'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '是否限制派增',
            align: 'center',
            dataIndex: 'isDispatch',
            customRender:(text) => {
              const str = text ? '是' : '否'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'deleteFlag',
            customRender:(text) => {
              const str = text == 0 ? '启用' : '禁用'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: '/hrSocial/tfinancedispatch/page', // 列表
          exportUrl:'/hrSocial/tfinancedispatch/getTFinanceDispatchList' //导出
        },
      }
    },
    methods: {
      changeStatus(flag,record){
        if(flag > 1){
          this.$refs.ChangeStatusForm.show(record,false);
        }else{
          if(this.selectedRowKeys.length === 0){
            this.$message.warning('至少选择一项进行操作!');
            return false;
          }
          const res = this.selectionRows.filter(item=>item.deleteFlag == flag);
          if(!res.length){
            this.$message.warning(`至少选择一项状态为${flag?'“禁用”':'“启用”'}进行操作!`);
            return false;
          }
          // flag 0启用1禁止
          this.$refs.ChangeStatusForm.show(this.selectedRowKeys,flag);
        }
      },
      refresh(){
        const _this = this;
        this.$confirm({
          title: '确认刷新么?',
          onOk() {
            _this.loading = true;
            _this.downLoading = true;
            httpAction(`/hrSocial/tfinancedispatch/updateFinanceDispatch?type=0`,null,'post').then((res) => {
              if(res.code == 200){
                _this.$message.success('刷新成功!');
                _this.loadData();
              }else{
                _this.$message.error(res.msg);
              }
            }).finally(()=>{
              _this.loading = false;
              _this.downLoading = false;
            })
          }
        });
      },
      // 导出
      handleExport(){
        const qs = require('qs')
        let params = {}
        if(Object.keys(this.queryParam).length){
          params = Object.assign({},this.queryParam)
        }
       
        if(this.selectedRowKeys.length>0){
           params = Object.assign(params,{idStr:this.selectedRowKeys.join(',')})
        }

         httpAction(`${this.url.exportUrl}?${qs.stringify(params)}`,null,'get').then(res=>{
           if(res.code==200){
             const lists = res.data.map(item=>{
              item.isEnough = item.isEnough == 1 ? '是' : '否';
              item.isDispatch = item.isDispatch == 1 ? '是' : '否';
              item.isAlert = item.isAlert == 1 ? '已提醒' : '未提醒';
              item.deleteFlag = item.deleteFlag == 1 ? '禁用' : '启用';
              return item;
            })
            const excelDatas = [{
              tHeader: ['客户名称', '客户编码','累计未回款金额','次月预计支出','客户余额','余额是否支撑','提醒状态','是否限制派增','状态'],
              filterVal: ['unitName','unitNo','notRefunded', 'estimatedSpending','unitBalance','isEnough','isAlert','isDispatch','deleteFlag'],
              tableDatas: lists,
              sheetName: "财务账单申请"
            }]
            this.json2excel(excelDatas, '派增限制监控', true, "xlsx")
            this.downLoading = false
            this.selectedRowKeys = []
           }else{
             this.$message.error(res.msg)
           }
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
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
      // 操作日志
      handleDetail(record){
        this.$refs.OperateLogForm.show(record);
      },
      
    }
  }
</script>
<style lang="less" scoped>
/** Button按钮间距 */

.ant-card-body .table-operator {
  margin-bottom: 18px;
}
.table-operator .ant-btn{
  margin-right: 10px;
}
</style>
