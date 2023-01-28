<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="项目名称">
              <a-input
                v-model="queryParam.itemName"
                placeholder="请输入项目名称"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <a-input
                v-model="queryParam.settleName"
                placeholder="请输入结算主体"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体编码">
              <a-input
                placeholder="请输入结算主体编码"
                v-model="queryParam.settleNo"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算月份">
                <a-month-picker
                  v-model="queryParam.settleDate"
                  style="width: 100%"
                  placeholder="请输入更新日期"
                  format="YYYYMM"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算类型">
                <a-select
                  v-model="queryParam.formType"
                  placeholder="请选择"
                >
                  <a-select-option value="0">普通薪资</a-select-option>
                  <a-select-option value="1">工程薪资</a-select-option>
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
    <div class="table-operator" style="margin-bottom:15px;">
      <a-button
        type="primary"
        icon="download"
        :loading="exportLoading"
        @click="exportBtnClick"
      >导出已发放记录</a-button>
    </div>
    <!-- 列表 -->
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
          <a @click="handleRecord(record)">发放记录</a>
        </span>

      </a-table>
    </div>

    <!-- 发放记录 -->
    <pause-record-modal ref="pauseModal"></pause-record-modal>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import PauseRecordModal from './modules/PauseRecordModal'
import { getSettlementAuthorityByUser } from '@/api/api'
import {mapGetters} from 'vuex'
import { httpAction } from '@/api/manage'
import moment from 'moment'

export default {
  name:'SearchDiyPauseList',
  mixins: [JeecgListMixin],
  components:{
    PauseRecordModal,
  },
  data(){
    return{
      columns:[
        {
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleName',
          customRender:(text)=>{
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '自定义项目名称',
          align: 'center',
          dataIndex: 'itemName',
          customRender:(text)=>{
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '项目类别',
          align: 'center',
          dataIndex: 'itemTypeName',
          customRender:(text)=>{
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '项目金额',
          align: 'center',
          dataIndex: 'money',
          customRender: (text) => {
            return text ? text.toLocaleString() : '-'
          }
        },
        {
          title: '结算月份',
          align: 'center',
          dataIndex: 'settleDate',
          customRender:(text)=>{
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '创建日期',
          align: 'center',
          dataIndex: 'createDate',
          customRender:(text)=>{
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createUser',
          customRender: (text) => {
            for(const itemStr in this.userData){
              if(String(text) === String(itemStr)){
                return this.userData[itemStr]
              }
            }
            return '-'
          }
        },
        {
          title: '余额',
          align: 'center',
          dataIndex: 'balance',
          customRender: (text) => {
            return text ? text.toLocaleString() : 0
          }
        },
        {
          width:120,
          align:'center',
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        }
      ],
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      url:{
        list: '/salary/tpausediyinfo/page',
      },
      grantOne:{},
      settlementList: [],
      userData:[],
      exportLoading:false,
    }
  },
  created() {
    this.loadSettlementList()
    this.loadUserList()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
     // 获取结算列表
    loadSettlementList() {
      getSettlementAuthorityByUser({}).then((res) => {
        this.settlementList = res.data
      })
    },
    // 获取用户列表
    loadUserList() {
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if(Number(res.code) === 200){
          this.userData = res.data
        }
      })
    },
    // 发放记录
    handleRecord(record){
      this.$refs.pauseModal.show(record)
    },
    exportBtnClick(){
      this.exportLoading = true
      const chargeTypeOption = ['现金','银付','线下']
      const chargeStatusOption = ['待发放','已发放','发放失败']
      // eslint-disable-next-line
      let temp = _.cloneDeep(this.queryParam)
      temp.settleDate = moment.isMoment(temp.settleDate) ? temp.settleDate.format('YYYYMM') : ''
      const qs = require('qs')
      const params = qs.stringify(temp)
      httpAction(`/salary/tpausediyinfo/exportPauseDiyInfo?${params}`,null,'get').then(res=>{
        if(res.code === 200){
          const datas = res.data.map(item=>{
            item.chargeType = chargeTypeOption[item.chargeType]
            item.chargeStatus = chargeStatusOption[item.chargeStatus]
            item.createUser = this.userData[item.createUser]
            item.chargeUser = this.userData[item.chargeUser]
            return item
          })
          let excelDatas = [
            {
              tHeader: ["结算主体名称", "结算主体编码","自定义项目名称","项目类别","项目金额","结算月份","创建日期","创建人","余额","发放人","发放时间","发放金额","发放方式","发放状态","收款卡号","收款单位","收款银行","失败理由"],
              filterVal: ['settleDepartName','settleDepartNo',"itemName", "itemTypeName","money", "settleDate","createDate","createUser","balance","chargeUser","chargeDate","chargeMoney","chargeType","chargeStatus","bankNo","orgName","bankName","remark"],
              tableDatas: datas,
              sheetName: "已发放记录"
            }
          ]
          this.$message.success('导出成功!')
          this.json2excel(excelDatas, "自定义暂停发已发放记录", true, "xlsx",1)
        }
      }).finally(()=>{
        this.exportLoading = false
      })

    },
    json2excel(tableJson, filenames, autowidth, bookTypes,length){
      var that = this
      //这个是引用插件
      import("@/vendor/ExportSalaryPauseExcel").then(excel => {
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
          length:length,
        })
      }).finally(()=>{
        this.downLoading = false
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
