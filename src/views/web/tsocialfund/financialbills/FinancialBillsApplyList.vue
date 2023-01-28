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
            <a-form-item label="账单编号">
              <a-input
                placeholder="请输入账单编号"
                v-model="queryParam.billCode"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="单位名称">
              <select-page
                :id="'id'"
                :title="'customerName'"
                placeholder="请选择单位名称查询"
                v-model="queryParam.unitId"
                :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
              ></select-page>
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
                  @change="handleMonth"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="流程状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.status"
                  placeholder="请选择状态查询"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in statusOptions"
                    :key="key"
                    :value="key"
                  >{{ value.option }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="创建时间" >
                <a-range-picker
                  style="width:100%"
                  v-model="queryParam.createTimeRange_extra"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        type="primary"
        @click="handleAdd"
      >生成账单</a-button>
      <a-button
        type="primary"
        @click="handleExport"
        :loading="downLoading"
      >导出</a-button>
      <a-button
        :disabled="selectedRowKeys.length==0"
        type="primary"
        @click="handlePrints"
      >批量打印</a-button>
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
          <a
            v-if="record.status==0||record.status==4"
            @click="handleEdit(record)"
          >编辑</a>
          <a-divider type="vertical" v-if="record.status==0||record.status==4"/>
          <a @click="handleBack(record)" v-if="record.status==1">撤回</a>
          <a-divider type="vertical" v-if="record.status==1"/>
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical" v-if="record.status==0||record.status==4"/>
          <a-popconfirm
            v-if="record.status==0||record.status==4"
            title="确定删除吗?"
            v-has="'wxhr:tfinancebill_del'"
            @confirm="() => handleDelete(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>  
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <!-- 生成账单 -->
    <financial-bills-add-modal 
      ref="financialBillsAddModal"
      @ok="modalFormOk"
    ></financial-bills-add-modal>

    <!-- 编辑、详情等-->
    <financial-bills-modal
      ref="financialBillsModal"
      @ok="modalFormOk"
    ></financial-bills-modal>

    <!-- 撤回弹窗 -->
    <a-modal 
      title="撤回" 
      :visible="visible"
      :width="600"
      :maskClosable="false"
      :destroyOnClose="false"
      @ok="handleBackOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="form">
        <a-form-item 
          label="撤回理由"
        >
          <a-textarea 
            v-decorator="['remark',{rules: [{ required: true, message: '请输入撤回理由！' }]}]"
            placeholder="请输入撤回理由,字数200以内！"
            :rows="2"
            :maxLength="200"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import FinancialBillsAddModal from './modules/FinancialBillsAddModal' //生成弹窗
  import FinancialBillsModal from './modules/FinancialBillsModal'   // 详情编辑弹窗
  // import { getUnitSelectVos } from '@/api/api'

  export default {
    name: 'FinancialBillsApplyList',//财务账单申请
    mixins: [JeecgListMixin],
    components: {
      SelectPage,
      FinancialBillsAddModal,
      FinancialBillsModal
    },
    data() {
      return {
        form: this.$form.createForm(this),
        visible:false,
        confirmLoading:false,
        unitOptions: [], // 单位和结算主体
        backData:{},//撤回数据
        downLoading:false,//导出
        description: '财务账单申请',
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        selectedRowKeys:[],
        statusOptions: {
          '0': {'option': '未提交', 'color': 'blue'},
          '1': {'option': '待审核', 'color': 'yellow'},
          '2': {'option': '审核中', 'color': 'cyan'},
          '3': {'option': '审核通过', 'color': 'green'},
          '4': {'option': '审核不通过', 'color': 'red'}
        },
        employData:{},
        yearMonthArrOptions:[],
        // 表头
        columns: [
          {
            width: 180,
            ellipsis: true,
            title: '账单编号',
            align: 'center',
            dataIndex: 'billCode',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
            ellipsis: true,
            title: '单位名称',
            align: 'center',
            dataIndex: 'unitName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'deptName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
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
            title: '结算月份',
            align: 'center',
            dataIndex: 'settleMonth',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            customRender:(text) => {
              const color = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].color : 'blue'
              const str = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
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
            width: 180,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createDate',
            customRender:(text) => {
              const str = text ? text : '-'
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
          list: 'hrSocial/tfinancebill/getTFinanceBillApply?orders%5B0%5D.asc=false&orders%5B0%5D.column=create_date', // 列表
          // orders%5B0%5D.asc=false&orders%5B0%5D.column=create_date  根据创建日期进行倒叙
          delete: 'hrSocial/tfinancebill/',  // 删除
          doBack:'hrSocial/tfinancebill/doBack',//客服撤回
          exportUrl:'hrSocial/tfinancebill/getTFinanceBillApplyList' //导出
         
        },
      }
    },
    created() {
      // 当前时间的半年间隔时间
      let yearMonthArr = []
      for (let i = 6; i >= -6; i--) {
        const monthsKey = moment().subtract(i, 'months').format('YYYYMM')
        yearMonthArr.push(monthsKey)
      }
      this.yearMonthArrOptions = yearMonthArr

      // 人员数据
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if (Number(res.code) === 200) {
          this.employData = res.data
        } else {
          this.$message.error('发布人数据请求失败！')
        }
      })

      // 获取登录用户拥有结算主体权限的单位信息（包含结算主体）
      // getUnitSelectVos().then((res) => {
      //   if (Number(res.code) === 200) {
      //     this.unitOptions = res.data
      //   } else {
      //     this.$message.error('单位信息数据请求失败！')
      //   }
      // })
    },
    methods: {
      moment,
      // 结算月份
      handleMonth(value){
        if(value){
          this.queryParam.settleMonth= moment(value).format('YYYYMM')
        }
      },
      // 选择时间
      onDateChange: function (value, dateString) {
        if(Object.keys(value).length){
          this.queryParam.createDateStart =  dateString[0]
          this.queryParam.createDateEnd = dateString[1]
        }else{
          delete this.queryParam.createDateStart
          delete this.queryParam.createDateEnd
        }
      },

      // 生成账单
      handleAdd: function() {
        this.$refs.financialBillsAddModal.yearMonthArrBelongs = this.yearMonthArrOptions
        // this.$refs.financialBillsAddModal.unitBelongs = this.unitOptions
        this.$refs.financialBillsAddModal.show()
      },
      // 导出
      handleExport(){
        delete this.queryParam.createTimeRange_extra
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
              return {
                billCode:item.billCode||'-',
                unitName:item.unitName||'-',
                deptName:item.deptName||'-',
                deptNo:item.deptNo||'-',
                settleMonth:item.settleMonth||'-',
                status:this.statusOptions.hasOwnProperty(item.status) ? this.statusOptions[item.status].option : '-',
                createUser:this.employData.hasOwnProperty(item.createUser) ? this.employData[item.createUser] : '-',
                createDate:item.createDate||'-'
              }
            })
            let excelDatas = [{
              tHeader: ["账单编号", "单位名称","结算主体","结算主体编码","结算月份","状态","创建人","创建时间"],
              filterVal: ['billCode','unitName',"deptName", "deptNo","settleMonth","status","createUser","createDate"],
              tableDatas: lists,
              sheetName: "财务账单申请"
            }]
            this.json2excel(excelDatas, '财务账单申请', true, "xlsx")
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
      // 批量打印
      handlePrints(){
        let idStr = this.selectedRowKeys.join(',')
        let routeData = this.$router.resolve({
                  path:"/pdf/financialbillspdf",
                  query: {id:idStr},
        });
        window.open(routeData.href, '_blank')
      },
      // 详情
      handleDetail(record){
        this.$refs.financialBillsModal.show(record)
        this.$refs.financialBillsModal.title = '财务账单详情'
        this.$refs.financialBillsModal.employData = this.employData
      },
      
      // 编辑
      handleEdit(record){
        this.$refs.financialBillsModal.show(record,true)  // true 代表编辑
        this.$refs.financialBillsModal.title = '财务账单提交'
        this.$refs.financialBillsModal.employData = this.employData
      },
      // 撤回
      handleBack(record){
        this.visible = true
        this.backData = record
      },
      // 撤回确认
      handleBackOk(){
        this.form.validateFields((err,values) => {
          if(!err){
            this.confirmLoading = true;
            const url = `${this.url.doBack}?id=${this.backData.id}&remark=${values.remark}&status=0`

            httpAction(url,{},'POST').then((res) => {
              if(Number(res.code) === 200){
                this.$message.success(res.msg);
                this.handleCancel();
                this.loadData(1)
              }else{
                this.$message.error(res.msg);
              }
            }).finally(()=>{
              const _this = this;
              setTimeout(()=>{
                _this.confirmLoading = false;
              },2000)
              
            })
          }
        })
      },
      handleCancel(){
        this.visible = false;
        this.form.resetFields();
        this.confirmLoading =false;
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
