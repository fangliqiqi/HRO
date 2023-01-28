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
            <a-form-item label="生成月份">
              <a-month-picker
                allowClear
                v-model="queryParam.month_extra"
                placeholder="请选择生成月份"
                style="width: 100%"
                format="YYYYMM"
                @change="changeMonth"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算类型">
              <a-select
                v-model="queryParam.type"
                allowClear
                placeholder="请选择"
              >
                <a-select-option 
                  v-for="(item,index) in typeOptions"
                  :key="index" 
                  :value="index" >
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="创建人">
              <select-page
                :searchUrl="'admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                placeholder="请选择创建人查询"
                :id="'nickname'"
                v-model="queryParam.createrUser"
              ></select-page>
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        v-has="'wxhr:tbalanceforminfo_add'"
        @click="handleAdd"
      >生成差余额汇总</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <div
        class="ant-alert ant-alert-info"
        style="margin-bottom: 16px;"
      >
        已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> 项
        <a
          style="margin-left: 24px"
          @click="onClearSelected"
        >清空</a>
      </div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :scroll="{x: 1}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">
            <template v-if="record.status == 0">提交</template>
            <template v-if="record.status == 1">详情</template>
          </a>
          <a-divider type="vertical" v-has="'wxhr:tbalanceforminfo_export'"/>
          <a
            @click="handleExport(record)"
            v-has="'wxhr:tbalanceforminfo_export'"
          >导出</a>
          <a-divider type="vertical" v-has="'wxhr:tbalanceforminfo_del'"/>
          <a-popconfirm
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
            v-has="'wxhr:tbalanceforminfo_del'"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <generate-balance-modal @ok="modalFormOk" ref="GenerateBalanceForm" title="生成差余额汇总"></generate-balance-modal>
    <balance-detail-modal @ok="modalFormOk" ref="BalanceDetailForm" title="差余额汇总详情"></balance-detail-modal>
  </a-card>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import GenerateBalanceModal from './modules/GenerateBalanceModal'
  import BalanceDetailModal from './modules/BalanceDetailModal'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'DifferenceBalance',
    mixins: [JeecgListMixin],
    components: {
      GenerateBalanceModal,
      BalanceDetailModal,
      SelectPage
    },
    data() {
      return {
        description: '差余额汇总',
        reasonPrimaryTypeList:[],
        reasonTypeList:[],
        typeOptions:['预估','实缴'],//结算类型
        // 表头
        columns: [
          {
            width: 200,
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
            width: 200,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'departNames',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '结算类型',
            align: 'center',
            dataIndex: 'type',
            customRender:(text) => {
              const str = text>=0?this.typeOptions[text]:'-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '生成月份',
            align: 'center',
            dataIndex: 'month',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '单位社保',
            align: 'center',
            dataIndex: 'curCpUnitSocial',
            customRender:(text) => {
              const res = text || 0
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '个人社保',
            align: 'center',
            dataIndex: 'curCpPersSocial',
            customRender:(text) => {
              const res = text || 0
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '单位公积金',
            align: 'center',
            dataIndex: 'curCpUnitFund',
            customRender:(text) => {
              const res = text || 0
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '个人公积金',
            align: 'center',
            dataIndex: 'curCpPersFund',
            customRender:(text) => {
              const res = text || 0
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '本期差额',
            align: 'center',
            dataIndex: 'curCpSum',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '历史差额',
            align: 'center',
            dataIndex: 'lastCpSum',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '累计差额',
            align: 'center',
            dataIndex: 'finalCpSum',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '创建人',
            align: 'center',
            dataIndex: 'createrUser',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createrTime',
            customRender:(text) => {
              const str = text ? text.substring(0, 10) : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: '/hrSocial/tbalanceforminfo/page',
          delete: '/hrSocial/tbalanceforminfo/',
        },
      }
    },
    methods: {
      changeMonth(val){
        if(val){
          this.queryParam.month = val.format('YYYYMM')
        }else{
          this.queryParam.month = null
        }
      },
      // 生成核准表
      handleAdd() {
        this.$refs.GenerateBalanceForm.show()
      },
      // 详情
      handleDetail(record) {
        httpAction(`/hrSocial/tbalanceforminfo/getAllInfoById?id=${record.id}`,null,'get').then(res=>{
          if(res.code === 200){
            this.$refs.BalanceDetailForm.reasonPrimaryTypeList = this.reasonPrimaryTypeList
            this.$refs.BalanceDetailForm.reasonTypeList = this.reasonTypeList
            this.$refs.BalanceDetailForm.show(res.data,record.status)
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      getHistory(id){
        return new Promise((resolve, reject) => {
          httpAction(`/hrSocial/tbalancehistorydiff/getHisDiffByFormId?formId=${id}`,null,'get').then(res=>{
            if(res.code === 200){
              resolve(res.data)
            }else{
              reject(res.msg)
            }
          })
        })
      },
      getList(id){
        return new Promise((resolve, reject) => {
          httpAction(`/hrSocial/tbalanceforminfo/getAllInfoById?id=${id}`,null,'get').then(res=>{
            if(res.code === 200){
              resolve(res.data)
            }else{
              reject(res.msg)
            }
          })
        })
      },
      handleExport(record){
        const _this = this
        Promise.all([this.getList(record.id),this.getHistory(record.id)]).then((result) => {
          _this.$refs.BalanceDetailForm.reasonPrimaryTypeList = _this.reasonPrimaryTypeList
          _this.$refs.BalanceDetailForm.reasonTypeList = _this.reasonTypeList
          let list = []
          let detail = []
          let excelHead = []
          let excelName = '差余额整合表'
          if(result[0]){
            list = _this.$refs.BalanceDetailForm.handleBalanceList(result[0])
            if(result[0].balanceContrastDetailList){
              detail = _this.$refs.BalanceDetailForm.handleBalanceDetail(result[0].balanceContrastDetailList)
            }
            excelName += `-${result[0].balanceFormInfo.month}`
            excelHead = [
              {
                title:[`${result[0].balanceFormInfo.month}--差余额汇总`,'','','','','','','','','',''],
                unitName:[result[0].balanceFormInfo.unitName,'','','','','','','','','','']
              },
              {
                title:[`${result[0].balanceFormInfo.month}--差余额明细`,'','','','','','','','','','','',''],
                unitName:[result[0].balanceFormInfo.unitName,'','','','','','','','','','','','']
              },
              {
                title:[`历史遗留明细`,'',''],
                unitName:[result[0].balanceFormInfo.unitName,'','']
              },
            ]
          }
          
          let total = 0
          result[1].forEach(item=>{
            total += parseFloat(item.fee||0)
          })
          result[1].push({
            feeType: '差余额合计',
            settleMoth:'-',
            fee:Math.round(parseFloat(total*100))/100,
            unitFundFee:'',
            type:0
          })
          // 封面数据
          const excelDatas = [
            {
              tHeader: ["地市","单位社保","个人社保","单位公积金","个人公积金","人次","管理费","管理费2","其他","历史遗留差额","合计"],
              filterVal: ['address','unitSocialFee','personalSocialFee','unitFundFee',"personalFundFee","peopleCount","managerFee","managerFeeTwo","otherFee","historyDiffFee","sum"],
              tableDatas: list,
              sheetName: `差余额汇总`
            },
            {
              tHeader: ["地市","姓名","身份证号","缴纳月份","单位社保","个人社保","单位公积金","个人公积金","差余额合计","原因大类","原因小类"],
              filterVal: ['address',"empName","empIdcard","payMonth",'unitSocialCp','personalSocialCp','unitFundCp',"personalFundCp","sumCp","reasonType","reasonDetail"],
              tableDatas: detail,
              sheetName: `差余额明细`
            },
            {
              tHeader: ["费用类型","结算月份","差余额"],
              filterVal: ['feeType','settleMoth','fee'],
              tableDatas: result[1],
              sheetName: `历史遗留差额`
            },
          ]
          _this.json2excel(excelDatas, excelName, true, "xlsx",true,excelHead)
        }).catch((error) => {
          this.$message.warning(error)
        })
      
      },
      json2excel(tableJson, filenames, autowidth, bookTypes,typeLength,excelHead) {
        var that = this
        import('./modules/ExportBalance').then(excel => {
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
            bookType: bookTypes,
            autoLength: typeLength, // 所有类型长度
            excelHead:excelHead
          })
          
        }).finally(()=>{
          that.confirmLoading = false
          that.$message.success('导出成功')
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j] === null || v[j] === undefined ? '0' : v[j]
        }))
      },
      // 数据字典
      initDictConfig() {
        // 原因大类
        initDictOptions('REASON_PRIMARY_TYPE').then((res) => {
          if (Number(res.code) === 200) {
            this.reasonPrimaryTypeList = res.data
          }
        })
        // 原因小类
        initDictOptions('REASON_TYPE').then((res) => {
          if (Number(res.code) === 200) {
            this.reasonTypeList = res.data
          }
        })
      },
      
    }
  }
</script>
<style lang="less" scoped>
  .ant-btn{
    margin-bottom: 15px;
  }
</style>
