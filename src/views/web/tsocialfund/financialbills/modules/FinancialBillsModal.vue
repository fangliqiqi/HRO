<template>
  <a-modal
    :title="title"
    :width="1200"
    placement="right"
    @cancel="handleCancel"
    :closable="true"
    :visible="visible"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >取消</a-button>

      <a-button
        type="primary"
        @click="handlExport"
        :loading="downloading"
      >导出</a-button>
      <a-button
        type="primary"
        key="save"
        v-if="isSubmit"
        v-has="'wxhr:tfinancebill_doSubmit'"
        :loading="saveDownloading"
        @click="handleSubmit"
      >保存并提交</a-button>
    </template>
    <a-card
      :bordered="false"
      style="background:#f5f5f5"
    >
      <a-tabs
        :activeKey="activityKey"
        @change="changeTab"
      >
        <a-tab-pane
          tab="缴费明细"
          key="1"
          style="background:white;padding:20px;"
        >
          <a-table
            ref="table"
            size="middle"
            bordered
            :rowKey="generateUUID"
            :columns="columns"
            :dataSource="dataSourceList"
            :loading="loading"
            :scroll="{ x: 1 }"
          >
          </a-table>
        </a-tab-pane>
        <a-tab-pane
          tab="结算表"
          key="2"
          :forceRender="true"
        >
          <financial-bills-settle-modal
            ref="settleAccountModal"
            :settlementhFormInfo="settlementhFormInfo"
            :invoiceInfo="invoiceInfo"
            :isedit="isSubmit"
            @ok="updateInfo"
          ></financial-bills-settle-modal>
          
        </a-tab-pane>
        <a-tab-pane
          tab="流程进展明细"
          key="3"
          :forceRender="true"
          style="max-height:500px;overflow-y:auto;padding-top:5px"
        >
          <a-timeline class="statusStep" v-if="recordList.length>0">
            <a-timeline-item
              v-for="(item,index) in recordList"
              :key="index"
            >
              <p> <strong> 操作：{{ item.status }}</strong></p>
              <p>操作人：{{ employData[item.createUser] }}</p>
              <p>操作备注：{{ item.remark }}</p>
              <p>操作时间：{{ item.createTime }}</p>
            </a-timeline-item>
          </a-timeline>
          <template v-else>
            <section class="code-box-demo">
              <div class="ant-empty">
                <div class="ant-empty-image">
                  <img
                    alt="暂无数据"
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE1MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQgMzEuNjcpIj4KICAgICAgPGVsbGlwc2UgZmlsbC1vcGFjaXR5PSIuOCIgZmlsbD0iI0Y1RjVGNyIgY3g9IjY3Ljc5NyIgY3k9IjEwNi44OSIgcng9IjY3Ljc5NyIgcnk9IjEyLjY2OCIvPgogICAgICA8cGF0aCBkPSJNMTIyLjAzNCA2OS42NzRMOTguMTA5IDQwLjIyOWMtMS4xNDgtMS4zODYtMi44MjYtMi4yMjUtNC41OTMtMi4yMjVoLTUxLjQ0Yy0xLjc2NiAwLTMuNDQ0LjgzOS00LjU5MiAyLjIyNUwxMy41NiA2OS42NzR2MTUuMzgzaDEwOC40NzVWNjkuNjc0eiIgZmlsbD0iI0FFQjhDMiIvPgogICAgICA8cGF0aCBkPSJNMTAxLjUzNyA4Ni4yMTRMODAuNjMgNjEuMTAyYy0xLjAwMS0xLjIwNy0yLjUwNy0xLjg2Ny00LjA0OC0xLjg2N0gzMS43MjRjLTEuNTQgMC0zLjA0Ny42Ni00LjA0OCAxLjg2N0w2Ljc2OSA4Ni4yMTR2MTMuNzkyaDk0Ljc2OFY4Ni4yMTR6IiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMy41NikiLz4KICAgICAgPHBhdGggZD0iTTMzLjgzIDBoNjcuOTMzYTQgNCAwIDAgMSA0IDR2OTMuMzQ0YTQgNCAwIDAgMS00IDRIMzMuODNhNCA0IDAgMCAxLTQtNFY0YTQgNCAwIDAgMSA0LTR6IiBmaWxsPSIjRjVGNUY3Ii8+CiAgICAgIDxwYXRoIGQ9Ik00Mi42NzggOS45NTNoNTAuMjM3YTIgMiAwIDAgMSAyIDJWMzYuOTFhMiAyIDAgMCAxLTIgMkg0Mi42NzhhMiAyIDAgMCAxLTItMlYxMS45NTNhMiAyIDAgMCAxIDItMnpNNDIuOTQgNDkuNzY3aDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI0SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjR6TTQyLjk0IDYxLjUzaDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI1SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjV6TTEyMS44MTMgMTA1LjAzMmMtLjc3NSAzLjA3MS0zLjQ5NyA1LjM2LTYuNzM1IDUuMzZIMjAuNTE1Yy0zLjIzOCAwLTUuOTYtMi4yOS02LjczNC01LjM2YTcuMzA5IDcuMzA5IDAgMCAxLS4yMjItMS43OVY2OS42NzVoMjYuMzE4YzIuOTA3IDAgNS4yNSAyLjQ0OCA1LjI1IDUuNDJ2LjA0YzAgMi45NzEgMi4zNyA1LjM3IDUuMjc3IDUuMzdoMzQuNzg1YzIuOTA3IDAgNS4yNzctMi40MjEgNS4yNzctNS4zOTNWNzUuMWMwLTIuOTcyIDIuMzQzLTUuNDI2IDUuMjUtNS40MjZoMjYuMzE4djMzLjU2OWMwIC42MTctLjA3NyAxLjIxNi0uMjIxIDEuNzg5eiIgZmlsbD0iI0RDRTBFNiIvPgogICAgPC9nPgogICAgPHBhdGggZD0iTTE0OS4xMjEgMzMuMjkybC02LjgzIDIuNjVhMSAxIDAgMCAxLTEuMzE3LTEuMjNsMS45MzctNi4yMDdjLTIuNTg5LTIuOTQ0LTQuMTA5LTYuNTM0LTQuMTA5LTEwLjQwOEMxMzguODAyIDguMTAyIDE0OC45MiAwIDE2MS40MDIgMCAxNzMuODgxIDAgMTg0IDguMTAyIDE4NCAxOC4wOTdjMCA5Ljk5NS0xMC4xMTggMTguMDk3LTIyLjU5OSAxOC4wOTctNC41MjggMC04Ljc0NC0xLjA2Ni0xMi4yOC0yLjkwMnoiIGZpbGw9IiNEQ0UwRTYiLz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0OS42NSAxNS4zODMpIiBmaWxsPSIjRkZGIj4KICAgICAgPGVsbGlwc2UgY3g9IjIwLjY1NCIgY3k9IjMuMTY3IiByeD0iMi44NDkiIHJ5PSIyLjgxNSIvPgogICAgICA8cGF0aCBkPSJNNS42OTggNS42M0gwTDIuODk4LjcwNHpNOS4yNTkuNzA0aDQuOTg1VjUuNjNIOS4yNTl6Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                  >
                </div>
                <p class="ant-empty-description">暂无流程数据</p>
              </div>
            </section>
          </template>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    
  </a-modal>
</template>

<script>
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction, } from '@/api/manage'
import FinancialBillsSettleModal from './FinancialBillsSettleModal' // 结算单

import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { getMultiName} from '@/utils/common'
// import { getUnitSelectVos } from '@/api/api'
import { formatFloat } from '@/utils/common'

export default {
  name: 'FinancialBillsModal',
  components: {
      FinancialBillsSettleModal,
    },
  data() {
    return {
      title: '',
      visible:false,
      visibleCheck:false,
      detailVisible:false,
      downloading: false,
      saveDownloading:false,
      form:this.$form.createForm(this),
      checkValue:'',
      loading:false,
      confirmLoading:false,
      exportLoading:false,
      financialInfo:'', // 传入的列表数据record
      model:{},
      activityKey:'1',
      dataSourceList:[],//缴费明细数据
      settlementhFormInfo:{}, // 结算单数据
      recordList:[],//流程进展明细
      employData:{},
      unitOptions:[],//结算主体信息
      invoiceInfo:{invoiceList:[],diffList:[],total:0},
      invKindType: { '0': '专用发票', '2': '普通发票', '51': '电子发票' },
      isSubmit:false,
      allTypeList:[],
      dataLen:[],//导出的发票等长度
      columns:[
        {
          width: 180,
          ellipsis: true,
          title: '部门',
          dataIndex: 'deptName', //settleDomainId
          key: 'deptName',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '姓名',
          dataIndex: 'empName',
          key: 'empName',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '单位',
          dataIndex: 'unitName',
          key: 'unitName',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '服务类别',
          dataIndex: 'serviceType',
          key: 'serviceType',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '社保缴纳地',
          dataIndex: 'socialPayAddr',
          key: 'socialPayAddr',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '公积金缴纳地',
          dataIndex: 'providentPayAddr',
          key: 'providentPayAddr',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '身份证号码',
          dataIndex: 'empIdcard',
          key: 'empIdcard',
          align: 'center',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '缴费月份',
          dataIndex:'socialPayMonth',
          align: 'center',
          key:'socialPayMonth'
        },
        {
          width: 120,
          ellipsis: true,
          title: '缴费基数',
          dataIndex:'unitPensionSet',
          align: 'center',
          key:'unitPensionSet',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '养老单位',
          dataIndex:'unitPensionMoney',
          align: 'center',
          key:'unitPensionMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '养老个人',
          dataIndex:'personalPensionMoney',
          align: 'center',
          key:'personalPensionMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '失业单位',
          dataIndex:'unitUnemploymentMoney',
          align: 'center',
          key:'unitUnemploymentMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '失业个人',
          dataIndex:'personalUnemploymentMoney',
          align: 'center',
          key:'personalUnemploymentMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '医疗单位',
          dataIndex:'unitMedicalMoney',
          align: 'center',
          key:'unitMedicalMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '医疗个人',
          dataIndex: 'personalMedicalMoney',
          align: 'center',
          key: 'personalMedicalMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '大病医疗单位',
          dataIndex: 'unitBigmailmentMoney',
          align: 'center',
          key: 'unitBigmailmentMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '大病医疗个人',
          dataIndex: 'personalBigmailmentMoney',
          align: 'center',
          key: 'personalBigmailmentMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '工伤',
          dataIndex: 'unitInjuryMoney',
          align: 'center',
          key: 'unitInjuryMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '生育',
          dataIndex: 'unitBirthMoney',
          align: 'center',
          key: 'unitBirthMoney',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '单位社保小计',
          dataIndex: 'unitSocialSum',
          align: 'center',
          key: 'unitSocialSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '个人社保小计',
          dataIndex: 'socialSecurityPersonalSum',
          align: 'center',
          key: 'socialSecurityPersonalSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '公积金基数',
          dataIndex: 'unitProvidentSet',
          align: 'center',
          key: 'unitProvidentSet',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '单位缴存额',
          dataIndex: 'unitProvidentSum',
          align: 'center',
          key: 'unitProvidentSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '个人缴存额',
          dataIndex: 'personalProvidentSum',
          align: 'center',
          key: 'personalProvidentSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '单位合计',
          dataIndex: 'unitSum',
          align: 'center',
          key: 'unitSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '个人合计',
          dataIndex: 'personalSum',
          align: 'center',
          key: 'personalSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '服务费',
          dataIndex: 'managementFee',
          align: 'center',
          key: 'managementFee',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '社保号码',
          dataIndex: 'socialSecurityNo',
          align: 'center',
          key: 'socialSecurityNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '合计',
          dataIndex: 'allSum',
          align: 'center',
          key: 'allSum',
          customRender: text => {
            const resultText = text || (parseFloat(text) === 0?'0':'-')
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
      ],
      url:{
        list:'/hrSocial/tfinancebill/openBillById',//详情
        doExportUrl:'/salary/salary/doExportSalary',
        doSubmit: '/hrSocial/tfinancebill/doSubmit',// 提交
       
      }
    }
  },
  created(){
      // 业务类型
      httpAction(`/hrBase/sysdictbusinesstypehr/getSysDictBusinessTypeList`,null,'get').then(res=>{
      if(res.code === 200) {
        this.allTypeList = res.data
      }
    })
  },
  methods: {
    generateUUID() {
      let d = new Date().getTime();
      if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
      }
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    },
    getTotal(arr){
      let total = 0;
      arr.forEach(item => {
        total += parseFloat(item.invoiceFee||0)
      });
      return formatFloat(total);
    },
    sumTotal(arr){
      let total = 0;
      arr.forEach(item => {
        total += parseFloat(item.money||0)
      });
      return formatFloat(total);
    },
    updateInfo(data,field){
      if(field==='invoiceList'){
        this.invoiceInfo.total = this.getTotal(data);
      }else if(field==='diffList'){
        this.invoiceInfo.sum = this.sumTotal(data);
      }
      this.invoiceInfo[field] = data;
    },
    getMultiName,
    // 展示当前模块显示
    async show(record,status) {
      this.isSubmit = status?true:false
      this.financialInfo = record
      this.visible = true
      this.loading = true
      this.downloading = true
      this.saveDownloading = true
      const url = `${this.url.list}?id=${record.id}`
      let res = await httpAction(url,{},'GET')
        if(Number(res.code) === 200){
          this.dataSourceList = res.data.paymentList  // 缴费明细
          this.settlementhFormInfo = res.data.main // 结算表
          this.invoiceInfo = {invoiceList:res.data.invoiceList,diffList:res.data.diffList,total:this.getTotal(res.data.invoiceList),sum:this.sumTotal(res.data.diffList)}

          let billFeeSum = this.reduceFun([this.settlementhFormInfo.settleMoney,this.settlementhFormInfo.managmentTax])
          this.settlementhFormInfo.billFeeSum = billFeeSum.toFixed(2)  //结算金额-结算小计
          // 业务类型
          this.settlementhFormInfo.businessType = this.getMultiName(this.allTypeList,'/',this.settlementhFormInfo.businessSecondType,this.settlementhFormInfo.businessThirdType)
          
          this.recordList = res.data.recordList   // 流程明细
          this.loading = false
          this.downloading = false
          this.saveDownloading = false
        }else{
          this.$message.error(res.msg)
          this.loading = false
        }
    },
    // 数据相加
    reduceFun(arr){
      let sum;
      if(Object.prototype.toString.call(arr)=='[object Array]'){
        sum = arr.reduce((total,cur)=>{
          cur = cur?Number(cur):0
          return  total + cur
        },0)
      }
      return sum
    },
    // 切换tab
    changeTab(key){
      if(this.loading){
        return false
      }
      this.activityKey = key
      if(key === '2'){
        const _this = this;
        setTimeout(function(){
          _this.$refs.settleAccountModal.changeColumn();
        },1000)
      }
      
    },
    // 取消弹框
    handleCancel() {
      this.close()
    },
    // 封装关闭方法
    close() {
      this.$emit('close')
      this.activityKey = '1'
      this.balanceLoading = false
      this.loading = false
      this.visible = false
      this.saveDownloading = false
    },

    // 提交
    handleSubmit(){
      if(this.settlementhFormInfo.sumDifference && this.invoiceInfo.diffList.length === 0){
        this.$message.warning('您本期账单有差余额，请填写结算单中的差余额明细后再提交!');
        return
      }
      if(this.settlementhFormInfo.sumDifference && (this.settlementhFormInfo.sumDifference != this.invoiceInfo.sum)){
        this.$message.warning('差余额明细总额与“累计差余额”金额不一致，请在结算表中核实再提交!');
        return
      }
      this.saveDownloading = true
      httpAction(this.url.doSubmit,{'id': this.financialInfo.id},'POST').then((res) => {
        if(Number(res.code) === 200){
          this.close()
          this.$emit('ok')
          this.$message.success(res.msg)
        }else{
          this.$message.error(res.msg)
          this.saveDownloading = false
        }
      })
    },
    // 导出
    handlExport(){
      this.downloading = true
      // 结算单
      let settleForm = this.settlementhFormInfo

      let settelData = [
        {'index':`${settleForm.unitName}-${settleForm.settleMonth}-结算单`,'data':'','project':'','money':'','account':' ','account1':' '},
        {'index':'单位名称:','data':settleForm.unitName,'project':'','money':'皖信盖章','account':' ','account1':' '},
        {'index':'结算主体:','data':settleForm.deptName,'project':'','money':'','account':' ','account1':' '},
        {'index':'结算主体编码:','data':settleForm.deptNo,'project':'','money':'','account':'','account1':' '},
        {'index':'结算时间:','data':settleForm.settleMonth,'project':'','money':'业务类型','account':settleForm.businessType,'account1':' '},
        {'index':'序号','data':'费用项目','project':'','money':'金额','account':'增值税','account1':'结算额小计'},
        {'index':1,'data':settleForm.createMonth,'project':'应缴单位社保','money':settleForm.unitSocial,'account':'-','account1':settleForm.unitSocialTicket},
        {'index':2,'data':'','project':'应缴个人社保','money':settleForm.personalSocial,'account':'-','account1':settleForm.personalSocialTicket},
        {'index':3,'data':'','project':'应缴单位公积金','money':settleForm.unitFund,'account':'-','account1':settleForm.unitFundTicket},
        {'index':4,'data':'','project':'应缴个人公积金','money':settleForm.personalFund,'account':'-','account1':settleForm.personalFundTicket},

        {'index':5,'data':'服务人数','project':'','money':settleForm.personNum,'account':'','account1':''},
        {'index':6,'data':'服务人次','project':'','money':settleForm.personCount,'account':'','account1':''},
        {'index':7,'data':'管理费','project':'','money':settleForm.managment,'account':settleForm.managmentTax,'account1':settleForm.managmentTicket},
        {'index':8,'data':'结算金额合计','project':'','money':settleForm.settleMoney,'account':settleForm.managmentTax,'account1':settleForm.billFeeSum},
        {'index':9,'data':'开票金额合计','project':'','money':'','account':'','account1':settleForm.ticketMoneySum},
        
        {'index':10,'data':'上次差余额','project':'','money':'','account':'','account1':settleForm.lastDifference||0},
        {'index':11,'data':'累计差余额','project':'','money':'','account':'','account1':settleForm.sumDifference||0},
        {'index':12,'data':'备注','project':settleForm.remark,'money':'','account':'','account1':''},
    
      ]
      // 结算单中接下来是开票 发票 差余额等
      settelData.push({'index':'','data':'','project':'','money':"",'account':'','account1':''})
      settelData.push({'index':'','data':'','project':'','money':"",'account':'','account1':''})
      // 开票信息
      settelData.push({'index':"开票信息",'data':'','project':'','money':"",'account':'','account1':''})
      settelData.push({'index':"单位名称",'data':settleForm.taxUnit,'project':'','money':"纳税人识别号",'account':settleForm.taxpayerIdentificationNo,'account1':''}) 
      settelData.push({'index':"开户行",'data':settleForm.bankName,'project':'','money':"银行卡号",'account':settleForm.bankNo,'account1':''})
      settelData.push({'index':"地址",'data':settleForm.addr,'project':'','money':"联系方式",'account':settleForm.phone,'account1':''})
      
      settelData.push({'index':'','data':'','project':'','money':"",'account':'','account1':''})
      settelData.push({'index':'','data':'','project':'','money':"",'account':'','account1':''})

      // 发票  invoiceList
      settelData.push({'index':"发票明细",'data':'','project':'','money':"",'account':'','account1':''})
      settelData.push({'index':'发票类型','data':'扣除金额','project':'不含税收入','money':'税额','account':'发票金额','account1':'备注'})
      let inLlen = this.invoiceInfo.invoiceList.length
      for(let i of this.invoiceInfo.invoiceList){
        settelData.push({'index':this.invKindType[i.invoiceType],'data':i.deductionAmount,'project':i.incomeExcludingTax,'money':i.taxFee,'account':i.invoiceFee,'account1':i.remark})
      }
      settelData.push({'index':'','data':'','project':'','money':"",'account':'','account1':''})
      settelData.push({'index':'','data':'','project':'','money':"",'account':'','account1':''})
      
      // 差余额 diffList
      settelData.push({'index':"差余额",'data':'','project':'','money':"",'account':'','account1':''})
      settelData.push({'index':'产生月份','data':'项目','project':'金额','money':'原因','account':'','account1':''})
      for(let d of this.invoiceInfo.diffList){
        settelData.push({'index':d.createMonth,'data':d.subject,'project':d.money,'money':d.reason,'account':'','account1':''})
      }
      let disLen = this.invoiceInfo.diffList.length
      // settelData.push({'index':inLlen,'data':disLen,'project':'','money':'','account':'','account1':''})
      this.dataLen = [inLlen,disLen]   //数据的长度

      let i = 1
      for(let d in this.dataSourceList){
        this.dataSourceList[d]['num'] = i
        i++
      }

      var excelDatas = [
        {
          tHeader: ["序号",null,"费用项目", "金额", "开票额小计",null],
          filterVal: ['index','data',"project", "money", "account","account1"],
          tableDatas: settelData,
          sheetName: "结算单"
        },
        {
          tHeader: ['序号', '部门', '姓名', '单位','服务类别','社保缴纳地','公积金缴纳地','身份证号码','缴费月份','缴费基数',"养老单位(16％)",
          "养老个人(8％)",	"失业单位(0.05％)",	"失业个人(0.5％)",	'医疗单位(6.9%)',	'医疗个人(2%)',	'大病医疗单位',	'大病医疗个人',	"工伤(0.2%)",	"生育(0%)",
          '单位社保小计',	'个人社保小计',	'公积金基数',	'单位缴存额',	'个人缴存额',	'单位合计',	'个人合计',	'服务费',	'社保号码',	'补退历史差额',	'合计',																																																																																																																																																																																																					
        ],
          filterVal: ['num','deptName','empName', 'unitName','serviceType','socialPayAddr','providentPayAddr','empIdcard','socialPayMonth','unitPensionSet','unitPensionMoney',
          'personalPensionMoney','unitUnemploymentMoney','personalUnemploymentMoney','unitMedicalMoney','personalMedicalMoney','unitBigmailmentMoney','personalBigmailmentMoney','unitInjuryMoney','unitBirthMoney',
          'unitSocialSum','socialSecurityPersonalSum','unitProvidentSet','unitProvidentSum','personalProvidentSum','unitSum','personalSum','managementFee','socialSecurityNo','','allSum'
          ],
          tableDatas: this.dataSourceList,
          sheetName: "缴费明细"
        },
      ];

      let excelName = settleForm.settleMonth + settleForm.unitName + "财务账单"
      this.json2excel(excelDatas, excelName, true, "xlsx")
      this.downloading = false
    },
    json2excel(tableJson, filenames, autowidth, bookTypes){
      var that = this
      //这个是引用插件
      import("@/vendor/FinancialBillsExcel").then(excel => {
        var tHeader = []
        var dataArr = []
        var sheetnames = []
        for (var i in tableJson) {
          tHeader.push(tableJson[i].tHeader)
          dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
          sheetnames.push(tableJson[i].sheetName)
        }
        console.log(dataArr)
        excel.export_json_to_excel_more_sheet({
          header: tHeader,
          data: dataArr,
          sheetname: sheetnames,
          filename: filenames,
          dataLen:this.dataLen,
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
      // 开户行
      initDictOptions('bank').then((res) => {
        if (Number(res.code) === 200) {
          this.bankOptions = res.data
        }
      })
    },
    
  }
}
</script>
<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 110px;
  }
}
.balanceDetailTabPane {
  background: white;
  padding: 20px;
  .table-operator {
    margin-bottom: 18px;
  }
}
</style>
