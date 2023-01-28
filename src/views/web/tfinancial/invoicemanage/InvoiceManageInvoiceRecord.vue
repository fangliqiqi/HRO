<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="发票号">
              <a-input
                placeholder="请输入发票号"
                v-model="queryParam.fphm"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="购买方">
              <a-input
                placeholder="请输入购买方"
                v-model="queryParam.customerName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="销售方">
              <a-input
                placeholder="请输入销售方"
                v-model="queryParam.sellerName"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="开票金额">
                <a-input-number
                  placeholder="请输入开票金额"
                  v-model="queryParam.invoiceMoney"
                  :precision="2"
                  style="width:100%"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="发票状态">
                <a-select
                  v-model="queryParam.status"
                  placeholder="请选择发票状态"
                >
                  <a-select-option
                    v-for="(item,index) in statusOption"
                    :key="index"
                    :value="index"
                  >
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="开票人">
                <a-input
                  placeholder="请输入开票人"
                  v-model="queryParam.issuer"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="12"
              :sm="14"
            >
              <a-form-item label="开票日期">
                <a-date-picker
                  v-model="queryParam.createTimeStart"
                  :disabled-date="disabledStartDate"
                  format="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  placeholder="开始日期"
                  @openChange="handleStartOpenChange"
                />
                <a-date-picker
                  v-model="queryParam.createTimeEnd"
                  :disabled-date="disabledEndDate"
                  format="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  placeholder="结束日期"
                  :open="endOpen"
                  @openChange="handleEndOpenChange"
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
    <div class="table-operator">
      <a-button
        type="primary"
        icon="upload"
        @click="handleExport"
        :loading="confirmLoading"
      >导出</a-button>
    </div>
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
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">预览</a>
        </span>
      </a-table>
    </div>
    <invoice-record-detail-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></invoice-record-detail-modal>

  </a-card>
</template>

<script>
import { httpAction } from '@/api/manage'
import SelectPage from '@/components/jeecg/SelectPage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import InvoiceRecordDetailModal from './modules/InvoiceRecordDetailModal'

export default {
  name: 'InvoiceManageInvoiceRecord',
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
    InvoiceRecordDetailModal
  },
  data() {
    return {
      // statusOption:['正常','作废'],
      statusOption:{
        '0':{color:'green',text:'正常'},
        '1':{color:'red',text:'作废'},
      },
      invoiceTypeOption:{'0':'专票','2':'普票'},
      endOpen: false,
      confirmLoading: false,
      columns: [
        {
          ellipsis: true,
          width: 80,
          title: '发票状态',
          align: 'center',
          dataIndex: 'status',
          customRender: text => {
            const status = this.statusOption[text]
            return <a-tag color={status.color}>{status.text}</a-tag>
          }
        },
        {
          ellipsis: true,
          title: '发票号',
          width: 150,
          align: 'center',
          dataIndex: 'fphm',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          width: 150,
          title: '开票金额',
          align: 'center',
          dataIndex: 'invoiceMoney',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '发票类型',
          width: 100,
          align: 'center',
          dataIndex: 'invoiceType',
          customRender: text => {
            const type = this.invoiceTypeOption[text]
            return <a-tooltip title={type}>{type}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '购买方',
          width: 180,
          align: 'center',
          dataIndex: 'customerName',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '销售方',
          width: 200,
          align: 'center',
          dataIndex: 'sellerName',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '开票人',
          align: 'center',
          width: 120,
          dataIndex: 'issuer',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '开票日期',
          align: 'center',
          width: 170,
          dataIndex: 'createTime',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '操作',
          key: 'operations',
          align: 'center',
          fixed: 'right',
          width: 120,
          scopedSlots: { customRender: 'action' },
        }
      ],
      url: {
        list: 'salary/tinvoicerecord/page',
        getDetailById: 'salary/tinvoicerecord/', // 详情
        importUrl: 'salary//tinvoicerecord/doExport' // 导出
      }
    }
  },
  methods: {
    disabledStartDate(startValue) {
      const endValue = this.queryParam.createTimeEnd
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.queryParam.createTimeStart
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
    handleDetail(record) {
      this.$refs.modalForm.previewIsCanModify = false
      this.$refs.modalForm.showSingleInvoice(record)
    },
    // 导出
    handleExport() {
      let url = this.url.importUrl
      if(Object.keys(this.queryParam).length){
        const qs = require('qs')
        url += '?'+ qs.stringify(this.queryParam)
      }
      this.confirmLoading = true
      httpAction(url,null,'get').then(res=>{
        if(res.code === 200){
          const tableDatas = res.data.map(item=>{
            item.invoiceType = this.invoiceTypeOption[item.invoiceType]
            item.createTime = item.createTime.slice(0,-9)
            return item
          })
          let excelDatas = [
            {
              tHeader: ["发票类别", "发票代码","发票号码","销售方名称","购方企业名称","购方税号",
              "银行账号","地址电话","开票日期","商品编码版本号","单据号","金额","税额"],
              filterVal: ['invoiceType','fpdm',"fphm", "sellerName","customerName", "customerTaxNr","customerBankAccountNr","customerAddressTel",
              "createTime","codeVersion","documentNr","allValue","allTax"],
              tableDatas: tableDatas,
              sheetName: "发票记录"
            },
          ]
          this.json2excel(excelDatas, "发票记录", true, "xlsx",0)
        }
      })
    },
    json2excel(tableJson, filenames, autowidth, bookTypes,typeLength) {
      var that = this
      import('@/vendor/ExportInvoiceRecord').then(excel => {
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
          autoLength: typeLength // 所有类型长度
        })
        that.$message.success('导出成功')
        that.confirmLoading = false
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
  }
}
</script>

<style scoped>
.ant-card-body .table-operator {
  margin-bottom: 18px;
}
</style>
