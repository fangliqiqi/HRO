<template>
  <a-modal
    title="工程薪资暂停发放批量出账"
    :width="1200"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    :visible="visible"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
      <a-button
        type="primary"
        @click="handleFail"
        style="background:red;border:red"
      >退回</a-button>
      <a-button
        type="primary"
        @click="handlePrint"
      >表单打印</a-button>
      <a-button
        type="primary"
        @click="handleDownload"
      >导出</a-button>
      <a-button
        type="primary"
        @click="handleOutSubmit"
        :loading="submitLoading"
      >确定出账</a-button>
    </template>
    <a-spin
      :spinning="spinning"
      tip="Loading..."
    >
      <a-card
        :bordered="false"
        style="background:#f5f5f5"
      >
        <a-tabs
          :activeKey="activeKey"
          @change="changeTab"
        >
          <a-tab-pane
            tab="报账表"
            key="1"
          >
            <a-table
              ref="table"
              size="middle"
              bordered
              rowKey="id"
              :columns="columns"
              :dataSource="dataSourceList"
              :loading="loading"
              :scroll="scroll"
            >
              <template
                slot="operation"
                slot-scope="text, record"
              >
                <a @click="detail(record.id)">详情</a>
              </template>
            </a-table>
          </a-tab-pane>

          <a-tab-pane
            tab="结算单"
            key="2"
            :forceRender="true"
          >
            <engine-billing-settle-batch
              ref="engingbillingsettlebatch"
              :settlementhFormList="settlementhFormList"
            >
            </engine-billing-settle-batch>
          </a-tab-pane>

          <a-tab-pane
            tab="封面"
            key="3"
            :forceRender="true"
          >
            <engine-billing-page-batch ref="enginebillingpagebatch"></engine-billing-page-batch>
            <!-- <audit-page-modal ref="auditPageModal"></audit-page-modal> -->
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-spin>

    <!--- 发放出账详情 -->
    <a-modal
      title="发放出账详情"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleDetailCancel"
      cancelText="关闭"
      :visible="detailVisible"
      :maskClosable="false"
    >

      <a-card :bordered="false">
        <detail-list title="">
          <detail-list-item
            v-for="(item, index) in saiList"
            :key="index"
            :term="item.cnName"
          >{{ item.salaryMoney }}</detail-list-item>
        </detail-list>
      </a-card>

    </a-modal>

    <a-modal
      title="退回理由"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleBackCancel"
      @ok="handleBackOk"
      cancelText="关闭"
      okText="确定"
      :visible="visibleBack"
      :confirmLoading="confirmLoading"
      :maskClosable="false"
    >
      <a-form :form="form">
        <a-form-item label="理由">
          <a-textarea 
            :rows="3"
            :maxLength="200"
            placeholder="请输入退回理由(最多200字)"
            v-decorator="['remark', validatorRules.remark]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tools/DetailList'
import EngineBillingSettleBatch from './EngineBillingSettleBatch'
import EngineBillingPageBatch from './EngineBillingPageBatch'
import { httpAction } from '@/api/manage'
import { getItemName } from '@/utils/common'
import moment from 'moment'
const DetailListItem = DetailList.Item
import { mapGetters } from 'vuex'
export default {
  name: 'EngineBillingBatchModal',
  components: {
    DetailListItem,
    DetailList,
    EngineBillingSettleBatch,
    EngineBillingPageBatch
  },
  data(){
    return{
      visible:false,
      spinning:false,
      loading:false,
      detailVisible:false,
      submitLoading:false,
      downLoading:false,
      visibleBack:false,
      confirmLoading:false,
      activeKey:'1',
      dataSourceList:[],
      settlementhFormList:[],
      form:this.$form.createForm(this),
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      columns:[],
      scroll:{},
      employData:{},
      saiList:[],
      validatorRules:{
        remark: { rules: [{ required: true, message: '请输入退回理由(最多200字)!',max:200 }] },
      },
      coverList:[],
      chargeRecordIds:'',
      settleDepartNo:'',
      settelDate:'',
      url:{
        detailUrl:"salary/tchargerecord/openBatchChargeRecordDetail",
        doIssuePause:"salary/tchargerecord/doIssuePause",
        getPrintCount:"/salary/tprintrecord/getPrintCount",
        doBatchIssuePause:"/salary/tchargerecord/doBatchIssuePause"
      },
    }
  },
  methods:{
    ...mapGetters(["nickname", "avatar","userInfo"]),
    show(settleDepartNo,settleDate){
      this.loading = true
      this.settleDepartNo = settleDepartNo
      this.settelDate = settleDate.format("YYYYMM")
      this.activeKey = '1'
      this.visible = true
      let url = this.url.detailUrl + '?settleDepartNo=' + settleDepartNo + '&settleDate=' + this.settelDate + "&type=" + 1
      httpAction(url,{},'POST').then((res) => {
        this.loading = false
        if(res.code == 200){
          this.chargeRecordIds = res.data.chargeRecordIds
          this.dataSourceList = res.data.engineerAccountList
          this.columns = [
            {
              title: '姓名',
              dataIndex: 'empName',
              width: 130,
              fixed: 'left',
              align: 'center',
              key: 'empName'
            },
            {
              title: '身份证号',
              width: 130,
              align: 'center',
              dataIndex: 'empIdcard',
              key: 'empIdcard',
            },
            {
              title: '银行卡号',
              width: 130,
              align: 'center',
              dataIndex: 'bankNo',
              key: 'bankNo'
            },
            {
              title: '开户行',
              width: 130,
              align: 'center',
              dataIndex: 'bankName',
              key: 'bankName',
            },
            {
              title: '工资发放时间',
              width: 130,
              align: 'center',
              dataIndex: 'salaryGiveTime',
              key: 'salaryGiveTime',
              customRender: (text) => {
                return this.salaryGiveTimeOption[text]
              }
            },
            {
              title: '工资月份',
              width: 130,
              align: 'center',
              dataIndex: 'salaryDate',
              key: 'salaryDate'
            },
            {
              title: '结算月份',
              width: 130,
              align: 'center',
              dataIndex: 'settlementMonth',
              key: 'settlementMonth'
            },
            {
              title: '结算主体',
              width: 130,
              align: 'center',
              dataIndex: 'settleDepartName',
              key: 'settleDepartName'
            }
          ]
          let isDeductSocial = this.dataSourceList.length > 0 ? this.dataSourceList[0]['isDeductSocial'] : ''
          if(this.dataSourceList && isDeductSocial == 1){
            this.columns.push(
              {
                title: '社保扣缴月份',
                width: 130,
                align: 'center',
                dataIndex: 'deduSocialMonth',
                key: 'deduSocialMonth'
              },
            )
            this.columns.push(
              {
                title: '社保优先级',
                width: 130,
                align: 'center',
                dataIndex: 'socialPriority',
                key: 'socialPriority',
                customRender: (text) => {
                  return this.socialPriorityOption[text]
                }
              },
            )
            this.columns.push(
              {
                title: '是否扣除社保',
                width: 130,
                align: 'center',
                dataIndex: 'isDeductSocial',
                key: 'isDeductSocial',
                customRender: (text) => {
                  if(!text){
                    return '否'
                  }else{
                    return this.isFlag[text]
                  }
                }
              },
            )
            this.scroll = {x : 1560}
          }else{
            this.scroll = {x : 1170}
          }

          this.columns.push({
            title: '操作',
            width: 130,
            align: 'center',
            key: 'action',
            fixed: 'right',
            scopedSlots: { customRender: 'operation' }
          })
          //结算单
          this.settlementhFormList = res.data.engineerSettlementFormList
          //封面数据组装
          res.data.allBankCover.payType = 1
          res.data.allCashCover.payType = 0
          this.coverList.push(res.data.allBankCover)
          this.coverList.push(res.data.allCashCover)
          if(res.data.pauseBankCoverList){
            for(let c in res.data.pauseBankCoverList){
              res.data.pauseBankCoverList[c].payType = 1
              this.coverList.push(res.data.pauseBankCoverList[c])
            }
          }
          if(res.data.pauseBankCoverTwoList){
            for(let c in res.data.pauseBankCoverTwoList){
              res.data.pauseBankCoverTwoList[c].payType = 1
              this.coverList.push(res.data.pauseBankCoverTwoList[c])
            }
          }
          if(res.data.pauseCashCoverList){
            for(let c in res.data.pauseCashCoverList){
              res.data.pauseCashCoverList[c].payType = 0
              this.coverList.push(res.data.pauseCashCoverList[c])
            }
          }
          if(res.data.pauseCashCoverTwoList){
            for(let c of res.data.pauseCashCoverTwoList){
              res.data.pauseCashCoverTwoList[c].payType = 0
              this.coverList.push(res.data.pauseCashCoverTwoList[c])
            }
          }
        }
      })
    },
    handleCancel(){
      this.close()
    },
    // 取消退回理由
    handleBackCancel(){
      this.visibleBack = false
    },
    // 展示单个工资明细详情明细
    detail(id){
      for(var c of this.dataSourceList){
        if(c.id == id){
          this.saiList = c.saiList
          break;
        }
      }
      this.detailVisible = true
    },
    handleDetailCancel(){
      this.detailVisible = false
    },
    close(){
      this.detailVisible = false
      this.saiList = []
      this.dataSourceList = []
      this.coverList = []
      this.settlementhFormList = []
      this.visible = false
    },
    changeTab(key){
      this.activeKey = key
      // console.log(key)
      // if(key == 2){
      //   this.$refs.billingsalarysettlebatch.show()
      // }
      if(key == 3){
        this.$refs.enginebillingpagebatch.employData = this.employData
        this.$refs.enginebillingpagebatch.show(this.coverList)
      }
    },
    handlePrint(){
      let that = this
      let idArr = this.chargeRecordIds.split(',')
      httpAction(this.url.getPrintCount,{'fromId':idArr[0],'fromType':2},"POST").then((res) => {
        if(res.code == 200){
          if(res.data >= 1){
            this.$confirm({
              title: '是否再次打印',
              content: '该表单已打印,需要继续吗',
              onOk() {
                let routeData = that.$router.resolve({
                  path: "/pdf/enginepausebatch",
                  query: {id:idArr[0],count:res.data,settleDepartNo:that.settleDepartNo,settelDate:that.settelDate},
                });
                window.open(routeData.href, '_blank')
              },
              onCancel() {},
            });
          }else{
            let routeData = that.$router.resolve({
              path: "/pdf/enginepausebatch",
              query: {id:idArr[0],count:res.data,settleDepartNo:that.settleDepartNo,settelDate:that.settelDate},
            });
            window.open(routeData.href, '_blank')
          }
        }
      })

    },
    // 发放失败
    handleFail(){
      this.form.resetFields()
      this.visibleBack = true
    },
    // 发放失败理由提交
    handleBackOk(){
      let that = this
      this.form.validateFields((err,values) => {
        if(!err){
          this.confirmLoading = true
          let url = this.url.doBatchIssuePause + "?chargeRecordIds=" + this.chargeRecordIds + "&chargeStatus=" + 2 + "&remark=" + values.remark
          httpAction(url,{},'POST').then((res) => {
            this.confirmLoading = false
            if(res.code == 200){
              that.$message.success("退回成功")
              that.$emit('ok')
              that.visibleBack = false
              that.visible = false
            }else{
              that.$message.error(res.msg)
            }
          })
        }
      })
    },
    // 出账
    handleOutSubmit(){
      let that = this
      let url = this.url.doBatchIssuePause + "?chargeRecordIds=" + this.chargeRecordIds + "&chargeStatus=" + 1 + "&remark=" + ""
      this.$confirm({
        title: '确认出账成功',
        content: '确认出账成功?',
        onOk() {
          httpAction(url,{},'POST').then((res) => {
            if(res.code == 200){
              that.$message.success("发放成功")
              that.$emit('ok')
              that.visible = false
            }else{
              that.$message.error(res.msg)
            }
          })
        },
        onCancel() {},
      })
    },
    handleDownload(){
      this.downLoading = true
      let isDeductSocial = this.dataSourceList[0].isDeductSocial
      let engineerAccountListHeader
      let engineerAccountListValue
      if(isDeductSocial == 1){
        engineerAccountListHeader  = ["工资月份","结算月份","结算主体","姓名","身份证号","银行卡号","开户行","工资发放方式","工资发放次数","工资发放时间","社保扣缴月份",
          "社保优先级","是否扣除社保"]
        engineerAccountListValue =  ["salaryDate", "settlementMonth", "settleDepartName", "empName", "empNo", "bankNo", "bankName", "salaryStyle","salaryCount","salaryGiveTime","deduSocialMonth",
          "socialPriority","isDeductSocial"]
      }else{
        engineerAccountListHeader  = ["工资月份","结算月份","结算主体","姓名","身份证号","银行卡号","开户行","工资发放方式","工资发放次数","工资发放时间"]
        engineerAccountListValue =  ["salaryDate", "settlementMonth", "settleDepartName", "empName", "empNo", "bankNo", "bankName", "salaryStyle","salaryCount","salaryGiveTime"]
      }
      var excelDatas = [
        {
          tHeader: engineerAccountListHeader, // 表一的数据字段
          filterVal: engineerAccountListValue, // sheet表一头部
          tableDatas: this.dataSourceList, // 表一的整体json数据
          sheetName: "报账表"// 表一的sheet名字
        },
      ]
      let j = 1
      for(let c of this.settlementhFormList){
        let settleForm = c.engineeringSettlementForme
        settleForm.ufundDeduction = settleForm.ufundDeduction ? settleForm.ufundDeduction : ''
        settleForm.pfundDeduction = settleForm.pfundDeduction ? settleForm.pfundDeduction : ''
        settleForm.unitIncomeTax = settleForm.unitIncomeTax ? settleForm.unitIncomeTax : ''
        settleForm.personIncomeTax = settleForm.personIncomeTax ? settleForm.personIncomeTax : ''
        settleForm.unitIncomeTaxTicket = settleForm.unitIncomeTaxTicket ? settleForm.unitIncomeTaxTicket : ''
        settleForm.personIncomeTaxTicket = settleForm.personIncomeTaxTicket ? settleForm.personIncomeTaxTicket : ''
        settleForm.socialMonth = settleForm.socialMonth ? settleForm.socialMonth : ''
        settleForm.fundMonth = settleForm.fundMonth ? settleForm.fundMonth : ''
        let settelData = [
          {'index':settleForm.settleMonth + '结算单','data':'','project':'','money':'','account':' '},
          {'index':'结算名称:','data':settleForm.settleDepartName,'project':'','money':'皖信盖章','account':' '},
          {'index':'结算编码:','data':settleForm.settleDepartNo,'project':'','money':'','account':' '},
          {'index':'结算时间:','data':settleForm.settleMonth,'project':'','money':'','account':' '},
          {'index':'序号','data':'费用项目','project':'','money':'金额','account':'开票额小计'},
          {'index':1,'data':settleForm.salaryMonth,'project':'应发工资','money':settleForm.salarySum,'account':settleForm.salaryTicket},
          {'index':'','data':'','project':'实发工资(银付)','money':settleForm.cardPay,'account':' '},
          {'index':'','data':'','project':'实发工资(现金)','money':settleForm.moneyPay,'account':' '},
          {'index':'','data':'','project':'暂停发金额','money':settleForm.pausePay,'account':' '},
          {'index':2,'data':settleForm.socialMonth,'project':'应缴单位社保','money':settleForm.usocialDeduction,'account':''},
          {'index':'','data':'','project':'代扣个人社保','money':settleForm.psocialDeduction,'account':''},
          {'index':3,'data':settleForm.fundMonth,'project':'应缴单位公积金','money':settleForm.ufundDeduction,'account':''},
          {'index':'','data':'','project':'应缴个人公积金','money':settleForm.pfundDeduction,'account':''},
        ];
        let num = 4
        if(c.engineerSettlementhFormSubList){
          for(let d of c.engineerSettlementhFormSubList){
            settelData.push({'index':num,'data':getItemName(d.itemTypeName,d.subName),'project':'','money':d.money,'account':''})
            num++
          }
        }
        if(!settleForm.remark){
          settleForm.remark = ''
        }
        settelData.push({'index':num++,'data':'雇主责任险','project':'','money':settleForm.employerLiabilityInsurance,'account':''})
        settelData.push({'index':num++,'data':'其它费用','project':'','money':settleForm.other,'account':''})
        settelData.push({'index':num++,'data':'增值税金及附加','project':'','money':settleForm.valueDaddedTax,'account':settleForm.valueDaddedTaxTicket})
        settelData.push({'index':num++,'data':'预缴企业所得税','project':'','money':settleForm.unitIncomeTax,'account':settleForm.unitIncomeTaxTicket})
        settelData.push({'index':num++,'data':'预缴个人所得税	','project':'','money':settleForm.personIncomeTax,'account':settleForm.personIncomeTaxTicket})
        settelData.push({'index':num++,'data':'人数','project':'','money':settleForm.personCount,'account':''})
        settelData.push({'index':num++,'data':'管理费','project':'','money':settleForm.managementCost,'account':settleForm.managementCostTicket})
        settelData.push({'index':num++,'data':'结算金额合计','project':'','money':settleForm.accountMoneySum,'account':''})
        settelData.push({'index':num++,'data':'备注:','project':settleForm.remark,'money':'','account':''})
        // settelData.push({'index':'','data':'','project':'','money':'','account':''})
        // settelData.push({'index':'','data':'','project':'','money':'','account':''})
        // settelData.push({'index':'开票日期','data':'开票金额','project':'本次结算金额','money':'本次结算到账金额','account':''})


        // for(let a of c.poorBalanceInfoList){
        //   settelData.push({'index':a.month,'data':a.name,'project':a.project,'money':a.money,'account':''})
        // }
        //settelData.push({'index':0,'data':'','project':'','money':'','account':''})
        excelDatas.push({
          tHeader: ["序号",null,"费用项目", "金额", "开票额小计"],
          filterVal: ['index','data',"project", "money", "account"],
          tableDatas: settelData,
          sheetName: "结算单" + j
        })
        j++
      }
      // 封面数据
      let i = 1;
      for(var d of this.coverList){
        let createName = ''
        for(let c in this.employData){
          if(c == d.createUser){
            createName = this.employData[c]
          }
        }
        let reportDate = d.createDate = moment().format("YYYY/MM/DD")
        if(d.payType == 1){
          d.unitName = d.unitName ? d.unitName : ''
          d.settleName = d.settleName ? d.settleName : ''
          d.itemName = d.itemName ? d.itemName : ''
          d.settleNo = d.settleNo ? d.settleNo : ''
          d.title = d.title ? d.title : ''
          d.remark = d.remark ? d.remark : ''

          let lastTwo = d.itemName.substr(d.itemName.length - 2,2)
          if(lastTwo == "其他"){
            d.itemName = d.itemName.substr(0,d.itemName.length - 2) + "工资"
          }
          let coverData = [
            {'company':d.title,'project':'','payType':'','money':'','no':`附件${this.coverList.length}张`},
            {'company':"银行转账审批单",'project':'','payType':'','money':'','no':''},
            {'company':"Z",'project':reportDate,'payType':'部门编码','money':d.settleNo,'no':''},
            {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
            {'company':d.unitName,'project':d.itemName,'payType':'银行转账','money':'¥' + d.money,'no':''},
            {'company':d.settleName,'project':'','payType':'','money':'','no':''},
            {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
            {'company':"备注:",'project':'','payType':'','money':'','no':''},
            {'company':"收款单位名称: " + d.organName + "        账号: " + d.bankNo + "        开户行: " + d.bankName,'project':'','payType':'','money':'','no':''},
            {'company':"公司领导：         财务负责人:" + this.nickname() + '         网银审核授权人：         网银转账提交人：' + this.nickname() + '         数据审核人：' + '-' + '         制表人:' + createName,'project':'' ,'payType': '','money':'','no':''},
          ]
          excelDatas.push({
            tHeader: ["序号", "名字", "描述", "金钱", "地位"],
            filterVal: ["company", "project", "payType", "money",'no'],
            tableDatas:coverData,
            sheetName:'转账封面' + i
          })
        }else{
          let coverData = [
            {'company':d.title,'project':'','payType':'','money':'','no':`附件${this.coverList.length}张`},
            {'company':"现金付款审批单",'project':'','payType':'','money':'','no':''},
            {'company':"Z",'project':reportDate,'payType':'部门编码','money':d.settleNo,'no':''},
            {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
            {'company':d.unitName,'project':d.itemName,'payType':'现金转账','money':'¥' + d.money,'no':''},
            {'company':d.settleName,'project':'','payType':'','money':'','no':''},
            {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
            {'company':"备注:",'project':'','payType':'','money':'','no':''},
            {'company':"公司领导：         财务负责人：" + this.nickname() + '         出纳会计: ' + '         数据审核人：-         制表人: ' + createName,'project':'','payType':'','money':'','no':''},
          ]
          excelDatas.push({
            tHeader: ["序号", "名字", "描述", "金钱", "地位"],
            filterVal: ["company", "project", "payType", "money",'no'],
            tableDatas:coverData,
            sheetName:'转账封面' + i
          })
        }
        i++;
      }
      let settleLength = this.settlementhFormList.length
      let coverLength = this.coverList.length
      let excelName = this.dataSourceList[0].settlementMonth + this.dataSourceList[0].settleDepartName + "普通薪资批量暂停发" + this.dataSourceList[0].settleDepartNo
      this.json2excel(excelDatas, excelName, true, "xlsx",settleLength,coverLength)
      this.downLoading = false
    },
    json2excel(tableJson, filenames, autowidth, bookTypes,settleLength,coverLength){
      var that = this
      //这个是引用插件
      import("@/vendor/ExportEngineBillingBatchPause").then(excel => {
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
          settleLength:settleLength,
          coverLength:coverLength
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if(j == "salaryStyle"){
          return this.salaryStyleOption[v[j]]
        }
        if(j == "salaryGiveTime"){
          return this.salaryGiveTimeOption[v[j]]
        }
        if(j == "salaryTaxFlag" || j == "isDeductSocial" || j == "isDeductFund"){
          return this.isFlag[v[j]]
        }
        if(j == "socialPriority"){
          return this.socialPriorityOption[v[j]]
        }
        if(j == "fundPriority"){
          return this.fundPriorityOption[v[j]]
        }
        if(j == "annualBonusType"){
          return this.annualBonusTypeOption[v[j]]
        }
        return v[j] || ''
      }))
    }

  }
}
</script>
