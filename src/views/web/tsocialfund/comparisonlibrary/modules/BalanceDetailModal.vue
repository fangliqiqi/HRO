<template>
  <a-modal
    :title="title"
    :width="1000"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
    :maskClosable="false"
    :destroyOnClose="false"
    :bodyStyle="{maxHeight:'650px',overflowY:'scroll'}"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel" :loading="confirmLoading">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk" v-if="model.status == 0">提交</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-tabs v-model="activeKey" @change="changeTag">
        <a-tab-pane key="1" tab="差余额汇总">
          <a-row>
            <a-col :span="24" class="export" v-has="'wxhr:tbalanceforminfo_export'">
              <a-button @click="exportExcel(0)" :loading="confirmLoading">导出</a-button>
            </a-col>
            <a-col class="titleCenter" :span="24">{{ model.balanceFormInfo ? model.balanceFormInfo.month : '' }}--差余额汇总</a-col>
            <a-col class="subTitleCenter" :span="24">单位名称：{{ model.balanceFormInfo ? model.balanceFormInfo.unitName : '' }}</a-col>
          </a-row>
          <a-table
            :columns="columns"
            size="middle"
            rowKey="id"
            :pagination="false"
            :data-source="dataSource"
            bordered></a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="差余额明细">
          <a-row>
            <a-col :span="24" class="export" v-has="'wxhr:tbalanceforminfo_export'">
              <a-button @click="exportExcel(1)" :loading="confirmLoading">导出</a-button>
            </a-col>
            <a-col class="titleCenter" :span="24">{{ model.balanceFormInfo ? model.balanceFormInfo.month : '' }}--差余额明细</a-col>
            <a-col class="subTitleCenter" :span="24">单位名称：{{ model.balanceFormInfo ? model.balanceFormInfo.unitName : '' }}</a-col>
          </a-row>
          <a-table
            :columns="columnsBalance"
            size="middle"
            rowKey="id"
            :pagination="false"
            :data-source="dataSourceBlance"
            bordered></a-table>
        </a-tab-pane>
        <a-tab-pane key="3" tab="历史遗留差额" :forceRender="true">
          <history-balance-modal
            ref="HistoryBalanceForm"
            :status="model.status"
            :balanceInfo="model.balanceFormInfo"
            @export="exportHistory"
            @ok="handleFlash"></history-balance-modal>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
  import { formatFloat } from '@/utils/common'
  import HistoryBalanceModal from './HistoryBalanceModal'
  import { httpAction } from '../../../../../api/manage'

  export default {
    name: 'GenerateBalanceModal',
    props: {
      title:{
        type: String,
        default: '操作',
        required: false
      },
    },
    components: {
      HistoryBalanceModal
    },
    data() {
      return {
        model: {},
        visible: false,
        confirmLoading: false,
        activeKey: '1',
        columns:[
          {
            title: '地市',
            align: 'center',
            dataIndex: 'address',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            title: '单位社保',
            align: 'center',
            dataIndex: 'unitSocialFee',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            title: '个人社保',
            align: 'center',
            dataIndex: 'personalSocialFee',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            title: '单位公积金',
            align: 'center',
            dataIndex: 'unitFundFee',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            title: '个人公积金',
            align: 'center',
            dataIndex: 'personalFundFee',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            title: '人次',
            align: 'center',
            dataIndex: 'peopleCount',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            title: '管理费',
            align: 'center',
            dataIndex: 'managerFee',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            title: '管理费2',
            align: 'center',
            dataIndex: 'managerFeeTwo',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            title: '其他',
            align: 'center',
            dataIndex: 'otherFee',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            title: '历史遗留差额',
            align: 'center',
            dataIndex: 'historyDiffFee',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            title: '合计',
            align: 'center',
            dataIndex: 'sum',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
        ],
        reasonTypeList:[],
        reasonPrimaryTypeList:[],

        columnsBalance:[
          {
            title: '地市',
            align: 'center',
            dataIndex: 'address',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            title: '姓名',
            align: 'center',
            dataIndex: 'empName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcard',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            title: '缴纳月份',
            align: 'center',
            dataIndex: 'payMonth',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            title: '单位社保',
            align: 'center',
            dataIndex: 'unitSocialCp',
            customRender:(text) => {
              const str = text ? text : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            title: '个人社保',
            align: 'center',
            dataIndex: 'personalSocialCp',
            customRender:(text) => {
              const str = text ? text : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            title: '单位公积金',
            align: 'center',
            dataIndex: 'unitFundCp',
            customRender:(text) => {
              const str = text ? text : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            title: '个人公积金',
            align: 'center',
            dataIndex: 'personalFundCp',
            customRender:(text) => {
              const str = text ? text : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          // {
          //   title: '管理费',
          //   align: 'center',
          //   dataIndex: 'managerCp',
          //   customRender:(text) => {
          //     const str = text ? text : '0'
          //     return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          //   },
          // },
          // {
          //   title: '其他',
          //   align: 'center',
          //   dataIndex: 'otherCp',
          //   customRender:(text) => {
          //     const str = text ? text : '0'
          //     return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          //   },
          // },
          {
            title: '差余额合计',
            align: 'center',
            dataIndex: 'sumCp',
            customRender:(text) => {
              const str = text ? text : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            title: '原因大类',
            align: 'center',
            dataIndex: 'reasonType',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            title: '原因小类',
            align: 'center',
            dataIndex: 'reasonDetail',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
        ],
        dataSource:[],
        dataSourceBlance:[],

        url: {
          exportXlsUrl: '', // 导出地址
        },
      }
    },
    methods: {
      getDefaultVal(val,defaultVal){
        return val ? val : defaultVal
      },
      getSum(obj){
        let total = 0
        for(const key in obj){
          if(obj[key] != '-'){
            total += parseFloat(obj[key] || 0)
          }
        }
        return Math.round(parseFloat(total*100))/100
      },
      handleBalanceList(record){
        
        const arr = record.balanceAreaInfoList.map(item=>{
          const obj = {
            unitSocialFee:item.unitSocialFee,
            personalSocialFee:item.personalSocialFee,
            unitFundFee:item.unitFundFee,
            personalFundFee:item.personalFundFee,
            managerFee:item.managerFee,
            managerFeeTwo:item.managerFeeTwo,
            otherFee:item.otherFee,
            historyDiffFee:item.historyDiffFee,
          }
          return {
            id:item.id,
            address:this.getDefaultVal(item.address,'-'),
            unitSocialFee:this.getDefaultVal(item.unitSocialFee,'0'),
            personalSocialFee:this.getDefaultVal(item.personalSocialFee,'0'),
            unitFundFee:this.getDefaultVal(item.unitFundFee,'0'),
            personalFundFee:this.getDefaultVal(item.personalFundFee,'0'),
            sum:this.getSum(obj),
            peopleCount:record.balanceFormInfo.type == 1 ? '-' : item.peopleCount,
            managerFee:record.balanceFormInfo.type == 1 ? '-' :item.managerFee,
            managerFeeTwo:'-',
            otherFee:'-',
            historyDiffFee:'-'
          }
        })
        if(record.balanceFormInfo){
          const obj1 = {
            unitSocialFee:record.balanceFormInfo.curUnitSocialSum,
            personalSocialFee:record.balanceFormInfo.curPersonalSocialSum,
            unitFundFee:record.balanceFormInfo.curUnitFundSum,
            personalFundFee:record.balanceFormInfo.curPersonalFundSum,
            managerFee:record.balanceFormInfo.curManagerFee,
            managerFeeTwo:record.balanceFormInfo.type == 1 ? 0 : record.balanceFormInfo.curManagerFeeTwo,
            otherFee:record.balanceFormInfo.type == 0 ? record.balanceFormInfo.curOtherFee : 0,
          }
          arr.push({
            id:-1,
            address:'本期实缴合计',
            unitSocialFee:this.getDefaultVal(record.balanceFormInfo.curUnitSocialSum,'0'),
            personalSocialFee:this.getDefaultVal(record.balanceFormInfo.curPersonalSocialSum,'0'),
            unitFundFee:this.getDefaultVal(record.balanceFormInfo.curUnitFundSum,'0'),
            personalFundFee:this.getDefaultVal(record.balanceFormInfo.curPersonalFundSum,'0'),
            sum:this.getSum(obj1),
            peopleCount:record.balanceFormInfo.curPeopleCount,
            managerFee:record.balanceFormInfo.curManagerFee,
            managerFeeTwo:record.balanceFormInfo.type == 1 ? '-' : (record.balanceFormInfo.curManagerFeeTwo||'-'),
            otherFee:record.balanceFormInfo.type == 0 ? (record.balanceFormInfo.curOtherFee||'0') : '-',
            historyDiffFee:'-'
          })
          const obj2 = {
            unitSocialFee:record.balanceFormInfo.settleUnitSocialSum,
            personalSocialFee:record.balanceFormInfo.settlePersSocialSum,
            unitFundFee:record.balanceFormInfo.settleUnitFundSum,
            personalFundFee:record.balanceFormInfo.settlePersFundSum,
            managerFee:record.balanceFormInfo.settleManagerFee,
            managerFeeTwo:record.balanceFormInfo.type == 1 ? record.balanceFormInfo.curManagerFeeTwo : record.balanceFormInfo.settleManagerFeeTwo,
            otherFee:record.balanceFormInfo.settleOtherFee,
          }
          arr.push({
            id:-2,
            address:'本期结算合计',
            unitSocialFee:this.getDefaultVal(record.balanceFormInfo.settleUnitSocialSum,'0'),
            personalSocialFee:this.getDefaultVal(record.balanceFormInfo.settlePersSocialSum,'0'),
            unitFundFee:this.getDefaultVal(record.balanceFormInfo.settleUnitFundSum,'0'),
            personalFundFee:this.getDefaultVal(record.balanceFormInfo.settlePersFundSum,'0'),
            sum:this.getSum(obj2),
            peopleCount:this.getDefaultVal(record.balanceFormInfo.settlePeopleCount,'0'),
            managerFee:this.getDefaultVal(record.balanceFormInfo.settleManagerFee,'0'),
            managerFeeTwo: record.balanceFormInfo.type == 1 ? (record.balanceFormInfo.curManagerFeeTwo || '-') : (record.balanceFormInfo.settleManagerFeeTwo||'0'),
            otherFee:record.balanceFormInfo.type == 1 ? this.getDefaultVal(record.balanceFormInfo.settleOtherFee,'-') : this.getDefaultVal(record.balanceFormInfo.settleOtherFee,'0'),
            historyDiffFee:'-'
          })
          const obj3 = {
            unitSocialFee:record.balanceFormInfo.curCpUnitSocial,
            personalSocialFee:record.balanceFormInfo.curCpPersSocial,
            unitFundFee:record.balanceFormInfo.curCpUnitFund,
            personalFundFee:record.balanceFormInfo.curCpPersFund,
            managerFee:record.balanceFormInfo.curCpManager,
            managerFeeTwo:0,
            otherFee:record.balanceFormInfo.curCpOther,
          }
          arr.push({
            id:-3,
            address:'本期差余额',
            unitSocialFee:this.getDefaultVal(record.balanceFormInfo.curCpUnitSocial,'0'),
            personalSocialFee:this.getDefaultVal(record.balanceFormInfo.curCpPersSocial,'0'),
            unitFundFee:this.getDefaultVal(record.balanceFormInfo.curCpUnitFund,'0'),
            personalFundFee:this.getDefaultVal(record.balanceFormInfo.curCpPersFund,'0'),
            sum:this.getSum(obj3),
            managerFee:record.balanceFormInfo.type == 1 ? '0' : this.getDefaultVal(record.balanceFormInfo.curCpManager,'0'),
            managerFeeTwo:record.balanceFormInfo.type == 1 ? '-' : '0',
            peopleCount:'0',
            otherFee:record.balanceFormInfo.curCpOther||0,
            historyDiffFee:'-'
          })
          const obj4 = {
            unitSocialFee:record.balanceFormInfo.hisUnitSocialSum,
            personalSocialFee:record.balanceFormInfo.hisPersonalSocialSum,
            unitFundFee:record.balanceFormInfo.hisUnitFundSum,
            personalFundFee:record.balanceFormInfo.hisPersonalFundSum,
            managerFee:record.balanceFormInfo.sumManagerFee,
            managerFeeTwo:0,
            otherFee:record.balanceFormInfo.hisOtherFeeSum,
            historyDiffFee:record.balanceFormInfo.historyDiffFee
          }
          arr.push({
            id:-4,
            address:'历史差余额',
            unitSocialFee:this.getDefaultVal(record.balanceFormInfo.hisUnitSocialSum,'0'),
            personalSocialFee:this.getDefaultVal(record.balanceFormInfo.hisPersonalSocialSum,'0'),
            unitFundFee:this.getDefaultVal(record.balanceFormInfo.hisUnitFundSum,'0'),
            personalFundFee:this.getDefaultVal(record.balanceFormInfo.hisPersonalFundSum,'0'),
            peopleCount:'0',
            managerFee:this.getDefaultVal(record.balanceFormInfo.sumManagerFee,'0'),
            managerFeeTwo:record.balanceFormInfo.type == 1 ? '-' : '0',
            otherFee:record.balanceFormInfo.hisOtherFeeSum||'0',
            sum:this.getSum(obj4),
            historyDiffFee:record.balanceFormInfo.historyDiffFee||'0',
          })
          const obj5 = {
            unitSocialFee:record.balanceFormInfo.sumUnitSocialSum,
            personalSocialFee:record.balanceFormInfo.sumPersonalSocialSum,
            unitFundFee:record.balanceFormInfo.sumUnitFundSum,
            personalFundFee:record.balanceFormInfo.sumPersonalFundSum,
            managerFee:record.balanceFormInfo.hisManagerFee,
            managerFeeTwo:0,
            otherFee:record.balanceFormInfo.sumOtherFeeSum,
            historyDiffFee:record.balanceFormInfo.sumHisDiffFeeSum
          }
          arr.push({
            id:-5,
            address:'累计差余额',
            unitSocialFee:this.getDefaultVal(record.balanceFormInfo.sumUnitSocialSum,'0'),
            personalSocialFee:this.getDefaultVal(record.balanceFormInfo.sumPersonalSocialSum,'0'),
            unitFundFee:this.getDefaultVal(record.balanceFormInfo.sumUnitFundSum,'0'),
            personalFundFee:this.getDefaultVal(record.balanceFormInfo.sumPersonalFundSum,'0'),
            peopleCount:'0',
            managerFee:this.getDefaultVal(record.balanceFormInfo.hisManagerFee,'0'),
            managerFeeTwo:record.balanceFormInfo.type == 1 ? '-' : '0',
            otherFee:record.balanceFormInfo.sumOtherFeeSum||'0',
            sum:this.getSum(obj5),
            historyDiffFee:record.balanceFormInfo.sumHisDiffFeeSum||'0',
          })
        }
        return arr
      },
      getName(ids,list){
        const arr = ids ? ids.split(',') : []
        let result = []
        arr.forEach(id=>{
          const res = list.find(item=>item.value == id)
          if(res){
            result.push(res.label)
          }
        })
        return result.join('||')
      },
      handleBalanceDetail(arr){
        const _this = this
        let sum = {unitSocialCp:0,personalSocialCp:0,unitFundCp:0,personalFundCp:0,sumCp:0,managerCp:0,otherCp:0}
        let list = arr.map(item=>{
          item.managerCp = item.managerCp || 0
          item.otherCp = item.otherCp || 0
          sum.unitSocialCp += parseFloat(item.unitSocialCp)
          sum.personalSocialCp += parseFloat(item.personalSocialCp)
          sum.unitFundCp += parseFloat(item.unitFundCp)
          sum.personalFundCp += parseFloat(item.personalFundCp)
          sum.sumCp += parseFloat(item.sumCp)
          sum.managerCp += parseFloat(item.managerCp)
          sum.otherCp += parseFloat(item.otherCp)
          item.reasonType = _this.getName(item.reasonType,_this.reasonPrimaryTypeList) || '-'
          item.reasonDetail = _this.getName(item.reasonDetail,_this.reasonTypeList) || '-'
          return item
        })
        list.push({
          address:'差余额合计',
          unitSocialCp: formatFloat(sum.unitSocialCp),
          personalSocialCp: formatFloat(sum.personalSocialCp),
          unitFundCp: formatFloat(sum.unitFundCp),
          personalFundCp: formatFloat(sum.personalFundCp),
          sumCp: formatFloat(sum.sumCp),
          managerCp: formatFloat(sum.managerCp),
          otherCp: formatFloat(sum.otherCp),
          reasonType:'',
          reasonDetail:'',
          empName:'',
          empIdcard:'',
          payMonth:'',
        })
        return list
      },
      handleOk(){
        this.confirmLoading = true
        httpAction(`/hrSocial/tbalanceforminfo/submitById?id=${this.model.balanceFormInfo.id}`,null,'post').then(res=>{
          if(res.code === 200){
            this.$message.success('提交成功!')
            this.handleCancel()
          }else{
            this.$message.warning(res.msg)
          }
        }).finally(()=>{
          this.confirmLoading = false
        })
      },
      handleFlash(){
        httpAction(`/hrSocial/tbalanceforminfo/getAllInfoById?id=${this.model.balanceFormInfo.id}`,null,'get').then(res=>{
          if(res.code === 200){
            this.model = Object.assign({status:this.model.status},res.data)
            this.dataSource = this.handleBalanceList(this.model)
            const list = this.model.balanceContrastDetailList || []
            this.dataSourceBlance = this.handleBalanceDetail(list)
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      exportHistory(params){
        this.json2excel(params.excelDatas, params.excelName, true, "xlsx",true,params.excelHead)
      },
      changeTag(key){
        this.activeKey = key
        if(this.activeKey === '3'){
          this.$refs.HistoryBalanceForm.show()
        }
      },
      show(record,status){
        // this.model.balanceFormInfo.type 0预估单1代理类结算单
        this.model = Object.assign({status:status},record)
        if(record){
          this.dataSource = this.handleBalanceList(record)
          const list = record.balanceContrastDetailList || []
          this.dataSourceBlance = this.handleBalanceDetail(list)
        }
        this.visible = true
      },
      exportExcel(type){
        // 封面数据
        let excelDatas = []
        let excelName = ''
        const excelHead = [{title:[],unitName:[]}]
        if(type === 0){
          excelDatas = [{
            tHeader: ["地市","单位社保","个人社保","单位公积金","个人公积金","人次","管理费","管理费2","其他","历史差余额","合计"],
            filterVal: ['address','unitSocialFee','personalSocialFee','unitFundFee',"personalFundFee","peopleCount","managerFee","managerFeeTwo","otherFee","historyDiffFee","sum"],
            tableDatas: this.dataSource,
            sheetName: `差余额汇总`
          }]
          excelName = `差余额汇总表-${this.model.balanceFormInfo.month}`
          excelHead[0].title = [`${this.model.balanceFormInfo.month}--差余额汇总`,'','','','','','','','','','']
          excelHead[0].unitName = [this.model.balanceFormInfo.unitName,'','','','','','','','','','']
        }else{
          let tableDatas = []
          if(this.model.balanceContrastDetailList){
            // eslint-disable-next-line
            tableDatas = _.cloneDeep(this.model.balanceContrastDetailList)
          }
          excelDatas = [{
            tHeader: ["地市","姓名","身份证号","缴纳月份","单位社保","个人社保","单位公积金","个人公积金","差余额合计","原因大类","原因小类"],
            filterVal: ['address',"empName","empIdcard","payMonth",'unitSocialCp','personalSocialCp','unitFundCp',"personalFundCp","sumCp","reasonType","reasonDetail"],
            tableDatas: tableDatas,
            sheetName: `差余额明细`
          }]
          excelName = `差余额明细表-${this.model.balanceFormInfo.month}`
          excelHead[0].title = [`${this.model.balanceFormInfo.month}--差余额明细`,'','','','','','','','','','','','']
          excelHead[0].unitName = [this.model.balanceFormInfo.unitName,'','','','','','','','','','','','']
        }
        this.json2excel(excelDatas, excelName, true, "xlsx",true,excelHead)
      },
      json2excel(tableJson, filenames, autowidth, bookTypes,typeLength,excelHead) {
        var that = this
        import('./ExportBalance').then(excel => {
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
      // 表单关闭
      handleCancel() {
        this.close()
        if(this.$refs.HistoryBalanceForm){
          this.$refs.HistoryBalanceForm.dataSource = []
        }
      },
      // 数据重置
      close() {
        this.$emit('ok')
        this.visible = false
        this.confirmLoading = false
        this.dataSource = []
        this.activeKey = '1'
      },
    }
  }
</script>

<style lang="less" scoped>
  .export{
    text-align: right;
  }
  .titleCenter{
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .subTitleCenter{
    text-align: center;
    margin: 8px 0px 10px;
  }
</style>
