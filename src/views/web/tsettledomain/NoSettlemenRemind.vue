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
            <a-form-item label="提醒日期">
              <a-range-picker
                v-model="queryParam.remindDate_extra"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="changeRange"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户名称">
              <a-input
                allowClear
                placeholder="客户名称"
                v-model="queryParam.customerName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :placeholder="'请输入结算主体'"
                v-model="queryParam.settleDomainName"
                :id="'departName'"
              ></select-page>
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
                  placeholder="结算主体编码"
                  v-model="queryParam.settleDomainCode"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="服务客服">
                <a-input
                  allowClear
                  placeholder="服务客服"
                  v-model="queryParam.customerServerName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="服务项目">
                <a-input
                  allowClear
                  placeholder="服务项目"
                  v-model="queryParam.project"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算状态">
                <a-select
                  showSearch
                  placeholder="结算状态"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.settleStatus"
                >
                  <a-select-option v-for="(item, index) in settleOption" :key="index" :value="index">
                    {{ item }}</a-select-option>
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
        @click="exportContract"
        type="primary"
        icon="download"
      >导出</a-button>
    </div>
    <!-- table区域-begin -->
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
        :scroll="{ x: 1}"
      > 
      </a-table>
    </div>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'NoSettlemenRemind',
    mixins: [JeecgListMixin],
    components: {
      SelectPage
    },
    data() {
      return {
        description: '未结算提醒',
        dataSource:[],
        settleOption:['未结算','已结算',],
        loading: false,
        columns: [
          {
          width: 120,
          ellipsis: true,
          title: '提醒日期',
          align: 'center',
          dataIndex: 'remindDate',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
          {
            width: 180,
            ellipsis: true,
            title: '客户名称',
            align: 'center',
            dataIndex: 'customerName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
          width: 200,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleDomainName',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
            }
          },
          {
          width: 120,
          ellipsis: true,
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'settleDomainCode',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '服务客服',
            align: 'center',
            dataIndex: 'customerServerName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '服务项目',
            align: 'center',
            dataIndex: 'project',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '结算周期',
            align: 'center',
            dataIndex: 'settleCycle',
            customRender: text => {
              const resultText = text>=0?`${text}个月`:'-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '结算状态',
            align: 'center',
            dataIndex: 'settleStatus',
            customRender: text => {
              const res = this.settleOption[text]
              return <a-tooltip title={res}>{res}</a-tooltip>
            }
          },
        ],
        url: {
          list: '/hrBase/TSettleAlertSysMsg/getListByPage',
          exportExcel:'/hrBase/TSettleAlertSysMsg/getList'
        },
      }
    },
    created() {
      
    },
    methods: {
      changeRange(date, dateString){
        if(Object.keys(date).length){
          this.queryParam.startRemindDate = dateString[0]
          this.queryParam.endRemindDate = dateString[1]
        }else{
          delete this.queryParam.startRemindDate
          delete this.queryParam.endRemindDate
        }
      },
      // 导出
      exportContract(){
        if(JSON.stringify(this.queryParam) != '{}'){
          const qs = require('qs')
          this.url.exportExcel = this.url.exportExcel + '?' + qs.stringify(this.queryParam)
        }
        httpAction(this.url.exportExcel,null,'get').then(res=>{
          if(res.code == 200){
            let lists = res.data.map((item)=>{
              return {
                remindDate:item.remindDate||'-',
                customerName:item.customerName||'-',
                settleDomainName:item.settleDomainName||'-',
                settleDomainCode:item.settleDomainCode||'-',
                customerServerName:item.customerServerName||'-',
                project:item.project||'-',
                settleCycle:item.settleCycle?`${item.settleCycle}个月`:'-',
                settleStatus:this.settleOption[item.settleStatus]
              }
            })
            let excelDatas = [{
              tHeader: ["提醒日期", "客户名称","结算主体","结算主体编码","服务客服","服务项目","结算周期","结算状态"],
              filterVal: ['remindDate','customerName',"settleDomainName", "settleDomainCode","customerServerName","project",
              "settleCycle","settleStatus"],
              tableDatas: lists,
              sheetName: "未结算提醒"
            }]
            this.json2excel(excelDatas, '未结算提醒', true, "xlsx")
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
    }
  }
</script>
<style lang="less" scoped>
.ant-cancelTipForm {
  :global(.ant-form-item-label > label::after) {
    display: none;
  }
}
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
