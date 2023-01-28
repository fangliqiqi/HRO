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
                placeholder="请选择客户名称"
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
                allowClear
                v-model="queryParam.unitNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <a-input
                placeholder="请输入结算主体名称"
                v-model="queryParam.deptName"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体编码">
                <a-input
                  allowClear
                  placeholder="请输入结算主体编码"
                  v-model="queryParam.deptNo"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算月份">
                <a-month-picker
                  allowClear
                  placeholder="请选择结算月份"
                  v-model="queryParam.settleMonth"
                  style="width: 100%"
                  format="YYYYMM"
                  valueFormat="YYYYMM"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="审核状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.status"
                  placeholder="请选择审核状态"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, index) in statusOptions"
                    :key="index"
                    :value="index"
                  >{{ value.option }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="回款状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.matchStatus"
                  placeholder="请选择回款状态"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, index) in returnOptions"
                    :key="index"
                    :value="index"
                  >{{ value.option }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="创建人"
              >
                <select-page
                  :searchUrl="'admin/user/page/wxhr?nickname='"
                  :title="'nickname'"
                  placeholder="请选择创建人"
                  :id="'userId'"
                  v-model="queryParam.createUser"
                  style="width:100%"
                ></select-page>
                
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="账单编码"
              >
                <a-input
                  allowClear
                  placeholder="请输入账单编码"
                  v-model="queryParam.billCode"
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
        @click="handleExport"
        :loading="downLoading"
      >导出</a-button>
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
          <a @click="handleSettle(record)">关联结算单</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <financial-bills-modal
      ref="financialBillsModal"
      @ok="modalFormOk"
    ></financial-bills-modal>
  </a-card>
</template>

<script>
  import { getAction,httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import FinancialBillsModal from './modules/FinancialBillsModal'   // 详情编辑弹窗

  export default {
    name: 'FinancialBillsReturnMonitorList',//财务账单回款监控
    mixins: [JeecgListMixin],
    components: {
      SelectPage,
      FinancialBillsModal
    },
    data() {
      return {
        form: this.$form.createForm(this),
        visible:false,
        confirmLoading:false,
        downLoading:false,//导出
        description: '财务账单回款监控',
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        selectedRowKeys:[],
        statusOptions: {
          '0': {'option': '未提交', 'color': 'blue'},
          '1': {'option': '待审核', 'color': 'yellow'},
          '2': {'option': '审核中', 'color': 'cyan'},
          '3': {'option': '审核通过', 'color': 'green'},
          '4': {'option': '审核不通过', 'color': 'red'}
        },
        returnOptions:{
          '0': {'option': '未回款'},
          '1': {'option': '部分回款' },
          '2': {'option': '已回款'},
        },
        employData:{},
        // 表头
        columns: [
          {
            width: 200,
            ellipsis: true,
            title: '账单编码',
            align: 'center',
            dataIndex: 'billCode',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '结算月份',
            align: 'center',
            dataIndex: 'settleMonth',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
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
            title: '结算主体名称',
            align: 'center',
            dataIndex: 'deptName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width:200,
            ellipsis: true,
            title: '结算主体编码',
            align: 'center',
            dataIndex: 'deptNo',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '创建人',
            align: 'center',
            dataIndex: 'createUser',
            customRender:(text) => {
              const str = this.employData.hasOwnProperty(text) ? this.employData[text] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '审核状态',
            align: 'center',
            dataIndex: 'status',
            customRender:(text) => {
              const color = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].color : 'blue'
              const str = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 140,
            ellipsis: true,
            title: '实缴金额',
            align: 'center',
            dataIndex: 'paidinMoney',
            customRender:(text) => {
              const str = text!=null ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 140,
            ellipsis: true,
            title: '结算金额',
            align: 'center',
            dataIndex: 'billFeeSum',
            customRender:(text) => {
              const str = text!=null ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 140,
            ellipsis: true,
            title: '历史差余额',
            align: 'center',
            dataIndex: 'lastDifference',
            customRender:(text) => {
              const str = text!=null ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 140,
            ellipsis: true,
            title: '本期差余额',
            align: 'center',
            dataIndex: 'currentMoney',
            customRender:(text) => {
              const str = text!=null ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 140,
            ellipsis: true,
            title: '累计差余额',
            align: 'center',
            dataIndex: 'sumDifference',
            customRender:(text) => {
              const str = text!=null ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 140,
            ellipsis: true,
            title: '回款金额',
            align: 'center',
            dataIndex: 'matchMoney',
            customRender:(text) => {
              const str = text!=null ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 140,
            ellipsis: true,
            title: '未回款金额',
            align: 'center',
            dataIndex: 'nomatchMoney',
            customRender:(text) => {
              const str = text!=null ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '回款状态',
            align: 'center',
            dataIndex: 'matchStatus',
            customRender:(text) => {
               const str = this.returnOptions.hasOwnProperty(text) ? this.returnOptions[text].option : '-'
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
          list: '/hrSocial/tfinancebill/getTFinanceBillByMoneyBack', // 列表
          exportUrl:'/hrSocial/tfinancebill/getTFinanceBillByMoneyBackList' ,//导出
         
        },
      }
    },
    created() {
      // 人员数据
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if (Number(res.code) === 200) {
          this.employData = res.data
        } else {
          this.$message.error('发布人数据请求失败！')
        }
      })
    },
    methods: {
      // 关联结算单
      handleSettle(record){
       console.log(record);
        this.$refs.financialBillsModal.show(record)
        this.$refs.financialBillsModal.title = '财务账单详情'
        this.$refs.financialBillsModal.employData = this.employData
      },
      // 页面数据请求
      loadData(arg,delId=0) {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性!')
          return false
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1
        }
        var params = this.getQueryParams(delId)//查询条件  
        
        this.loading = true;
        getAction(this.url.list, params).then((res) => {
          if (Number(res.code) === 200) {
            if (res.data && res.data.records && res.data.records.length > 0) {
              res.data.records.map(item=>{
                // 实缴金额= 个人公积金+个人社保+单位公积金+单位社保
                item.paidinMoney = (Number(item.personalFund)+Number(item.personalSocial)+Number(item.unitFund)+Number(item.unitSocial)).toFixed(2)
                // 本期差余额 = 开票金额-结算
                item.currentMoney =(Number(item.ticketMoneySum) - Number(item.billFeeSum)).toFixed(2)
                // 未回款金额
                item.nomatchMoney =(Number(item.billFeeSum) - Number(item.matchMoney)).toFixed(2) 

                return item
              })
              this.dataSource = res.data.records
              this.ipagination.total = res.data.total
              this.loading = false
            } else {
              this.dataSource = []
              this.ipagination.total = 0
              this.loading = false
              if (String(res.msg) !== 'success') {
                this.$message.warn(res.msg)
              }
            }
          } else {
            this.loading = false;
            this.$message.error(res.msg);
          }
        })
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
        // console.log(params);
        this.downLoading = true

         httpAction(`${this.url.exportUrl}?${qs.stringify(params)}`,null,'get').then(res=>{
           if(res.code==200){
             const lists = res.data.map(item=>{
              return {
                billCode:item.billCode||'-',
                settleMonth:item.settleMonth || '-',
                unitName:item.unitName || '-',
                deptName:item.deptName || '-',
                deptNo:item.deptNo || '-',
                createUser:this.employData.hasOwnProperty(item.createUser) ? this.employData[item.createUser] : '-',
                status:this.statusOptions.hasOwnProperty(item.status) ? this.statusOptions[item.status].option : '-',
                paidinMoney:(Number(item.personalFund)+Number(item.personalSocial)+Number(item.unitFund)+Number(item.unitSocial)).toFixed(2),
                billFeeSum:item.billFeeSum!=null?item.billFeeSum:'-',
                lastDifference:item.lastDifference!=null?item.lastDifference:'-',
                currentMoney:(Number(item.ticketMoneySum) - Number(item.billFeeSum)).toFixed(2),
                sumDifference:item.sumDifference!=null?item.sumDifference:'-',
                matchMoney:item.matchMoney!=null?item.matchMoney:'-',
                nomatchMoney:(Number(item.billFeeSum) - Number(item.matchMoney)).toFixed(2),
                matchStatus:this.returnOptions.hasOwnProperty(item.matchStatus) ? this.returnOptions[item.matchStatus].option : '-',
              }
            })
            let excelDatas = [{
              tHeader: ["账单编码","结算月份","客户名称","结算主体名称","结算主体编码","创建人","审核状态","实缴金额","结算金额",
                        "历史差余额","本期差余额","累计差余额","回款金额","未回款金额","回款状态"],
              filterVal: ["billCode","settleMonth","unitName","deptName","deptNo","createUser","status","paidinMoney","billFeeSum",
                          "lastDifference","currentMoney","sumDifference","matchMoney","nomatchMoney","matchStatus"],
              tableDatas: lists,
              sheetName: "财务账单回款监控"
            }]
            this.json2excel(excelDatas, '财务账单回款监控', true, "xlsx")
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
      import("@/vendor/EmployeeContractListExportExcel").then(excel => {
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
      
      
      // 数据字典
      initDictConfig() {

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

.ant-btn-danger {
  background-color: #ffffff;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
