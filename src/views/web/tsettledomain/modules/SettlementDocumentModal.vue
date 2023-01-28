<template>
  <a-modal
    :visible="visible"
    :width="1000"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
    okText="保存"
    :maskClosable="false"
    :closable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="vertical" class="settleForm">
        <a-row :span="24">
          <a-col :span="4" :offset="2">
            <a-form-item class="formLabel" label="业务收入(不含税)">
              {{ bill.income || 0 }}
            </a-form-item>
          </a-col>
          <a-col :span="3">
            <a-form-item class="formLabel" label="金额(不含税)">
              {{ bill.settleNoTax || 0 }}
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item class="formLabel">
              <a-input
                v-decorator="['ticketAmount',devidedValidate.ticketAmount]"
                placeholder="开票金额"
                style="width:100px"
              />
              <span slot="label">
                开票金额
                <a-tooltip title="指与客户约定的开票金额，如不开票则填写0" placement="bottom">
                  <a-icon type="info-circle-o" />
                </a-tooltip>
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item class="formLabel">
              <a-input
                v-decorator="['sumSettle',devidedValidate.sumSettle]"
                placeholder="结算金额"
                style="width:100px"
                @change="changeSumSettle"
              />
              <span slot="label">
                结算金额
                <a-tooltip title="指本次与客户结算的金额(含税)" placement="bottom">
                  <a-icon type="info-circle-o" />
                </a-tooltip>
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="3">
            <a-form-item label="税金" class="formLabel">{{ bill.taxAmount || 0 }}</a-form-item>
          </a-col>
          <a-col :span="3">
            <a-form-item label="税率" class="formLabel">{{ bill.tax }}%</a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="list">
        <!-- <a-row :span="24" class="search" v-if="methods == 'add'">
          <a-col :span="14" :offset="2">
            <a-button type="primary" @click="searchCost" :loading="loadingBtn">查询成本</a-button>
          </a-col>
        </a-row> -->
        <!-- <a-row :span="24" class="row">
          <a-col :span="8" :offset="2">费用明目</a-col>
          <a-col :span="4">金额(不含税)</a-col>
          <a-col :span="4">税金</a-col>
          <a-col :span="4">金额(含税)</a-col>
        </a-row>
        <a-row
          :span="24"
          class="row"
          v-for="(item,index) in costList"
          :key="index"
          :class="item.flag ? 'row costDisabled' : 'row'"
        >
          <a-col :span="8" :offset="2">{{ item.name }}</a-col>
          <a-col :span="4">{{ item.amount }}</a-col>
          <a-col :span="4">{{ item.taxAmount }}</a-col>
          <a-col :span="4">{{ item.ticketAmount }}</a-col>
        </a-row> -->
        <table class="costTable">
          <tr>
            <th style="width: 250px;">费用明目</th>
            <th style="width: 200px;">金额(不含税)</th>
            <th style="width: 200px;">税金</th>
            <th style="width: 200px;">金额(含税)</th>
          </tr>
          <tr
            v-for="(item,index) in costList"
            :key="index"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.taxAmount }}</td>
            <td>{{ item.ticketAmount }}</td>
          </tr>
        </table>
        <a-row :span="24" class="bottom">
          <a-col :span="7" :offset="2">成本合计(不含税)</a-col>
          <a-col :span="6">{{ bill.costSum.toFixed(2) }}</a-col>
          <a-col :span="3" :offset="6">
            <a-button type="primary" @click="checkDetail">报销明细</a-button>
          </a-col>
        </a-row>
      </div>
      <a-form
        :form="devidedForm"
        layout="inline"
        class="devidedFormClass"
      >
        <a-row :gutter="24">
          <a-col :span="22" :offset="2" style="margin-bottom: 14px;">
            <a-radio-group @change="changeDevided" v-model="devidedType">
              <a-radio :value="1">不分成</a-radio>
              <a-radio :value="2">按比例</a-radio>
              <a-radio :value="3">按金额</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22" :offset="2">
            <a-form-item label="分成数据">
              <a-radio-group v-decorator="['incomeType']" :disabled="typeDisabled" @change="changeMoney">
                <a-radio :value="0">业务收入(不含税)</a-radio>
                <a-radio :value="1">金额(不含税)</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <template v-if="devidedType>1">
          <a-row
            :gutter="24"
            v-for="(k) in devidedForm.getFieldValue('keys')"
            :key="k"
          >
            <a-col :span="22" :offset="2">
              <a-form-item class="stepFormText">
                <a-select
                  placeholder="请选择收入归属"
                  optionFilterProp="children"
                  style="width: 180px;"
                  :dropdownMatchSelectWidth="false"
                  showSearch
                  v-decorator="[
                    `incomeBelong[${k}]`,
                    {
                      validateTrigger: ['change','blur'],
                      rules: [{
                        required: true,
                        message: '请选择收入归属！',
                      }],
                    }
                  ]"
                >
                  <a-select-option
                    v-for="(item) in organAll"
                    :key="item.id"
                    :value="String(item.id)"
                  >
                    {{ item.organName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item class="stepFormText">
                <a-select
                  placeholder="请选择收入归属细分"
                  optionFilterProp="children"
                  :dropdownMatchSelectWidth="false"
                  showSearch
                  style="width: 180px;"
                  v-decorator="[
                    `incomeBelongSub[${k}]`,
                    {
                      validateTrigger: ['change','blur'],
                      rules: [{
                        required: true,
                        message: '请选择收入归属细分！',
                      }],
                    }
                  ]"
                >
                  <a-select-option
                    v-for="(item) in organAll"
                    :key="item.id"
                    :value="String(item.id)"
                  >
                    {{ item.organName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item class="stepFormText">
                <a-input
                  :placeholder="devidedType==2?'请输入比例':'请输入金额'"
                  :suffix="devidedType==2?'%':''"
                  @change="changeVal"
                  v-decorator="[
                    `incomeAmount[${k}]`,
                    devidedValidate.incomeAmount
                  ]"
                />
                <a-input type="hidden" v-decorator="[`id[${k}]`]"/>
              </a-form-item>
              <a-form-item class="stepFormText" v-if="devidedType==2">
                <a-input placeholder="金额" disabled v-decorator="[`money[${k}]`]"/>
              </a-form-item>
              <span style="vertical-align: -webkit-baseline-middle;">
                <a-icon
                  style="font-size: 20px;vertical-align: -webkit-baseline-middle;"
                  type="plus-square"
                  v-if="k===0"
                  @click="addItem()"
                />
                <a-icon
                  v-if="k!==0"
                  style="font-size: 20px;vertical-align: -webkit-baseline-middle;"
                  type="minus-square"
                  :disabled="devidedForm.getFieldValue('keys').length === 1"
                  @click="()=>remove(k)"
                />
              </span>
            </a-col>
          </a-row>
        </template>
        
      </a-form>
    </a-spin>
    <settlement-submit-modal ref="SettlementSubmitForm" @ok="submitOk"></settlement-submit-modal>
    <reimbursement-modal ref="ReimbursementForm"></reimbursement-modal>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import moment from 'moment'
import pick from 'lodash.pick'
import SettlementSubmitModal from './SettlementSubmitModal'
import ReimbursementModal from './ReimbursementModal'

let index = 0
export default {
  name: 'SettlementDocumentModal',
  components: {
    SettlementSubmitModal,
    ReimbursementModal
  },
  props:{
    organAll:{
      type: Array,
      default: ()=>[],
      required: true
    },
    settleInfo:{
      type: Object,
      default: ()=>{},
      required: true
    },
  },
  data() {
    return {
      visible: false,
      title: '结算',
      confirmLoading: false,
      typeDisabled: false,
      form: this.$form.createForm(this),
      devidedType:1,
      url: {
        add: '/hrBase/tsettledomain/vo',
        edit: '/hrBase/tsettledomain',
        list: '/hrOneTime/tnewsettle/getTMainAndBillVoPage'
      },
      devidedValidate:{
        incomeAmount:{
          validateTrigger: ['change', 'blur'],
          rules: [{
            required: true,
            message: '请输入金额！',
          }],
        },
        ticketAmount:{
          rules:[
            {
              required: true,
              message: '请输入金额！',
            },{
            pattern: /^(0|([1-9][0-9]{0,8})|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: '开票金额格式不正确!'
          }]
        },
        sumSettle:{
          rules:[
            {
              required: true,
              message: '请输入金额！',
            },{
              pattern: /^(0|([1-9][0-9]{0,8})|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
              message: '结算金额格式不正确!'
          }]
        },
      },
      bill:{
        income: 0,
        costSum: 0,
        ticketAmount:0,
        sumSettle:0,
        taxAmount:0,
        tax:0,
        taxType:'',
        settleNotax:0,
      },
      searchParam:[],
      costList: [],
      projectList: [],
      incomeList: [],
      incomeListDelete: [],
      loadingBtn: false,
      methods: 'add',
      id:'',
      rangeDate:['','']
    }
  },
  beforeCreate() {
    this.devidedForm = this.$form.createForm(this, { name: 'devided' })
    this.devidedForm.getFieldDecorator('keys', { initialValue: [0], preserve: true })
  },
  methods: {
    // 添加
    add(record){
      this.costList = record.costList || [];
      let total = 0;
      
      this.costList.sort(function(a,b){
        let aNum = a.name.substr(0,6)
        let bNum = b.name.substr(0,6)
        if(!isNaN(aNum)&&!isNaN(bNum)){
          return Number(aNum) - Number(bNum)
        }
        // return Number(a.name.match(/\d+/)[0]) - Number(b.name.match(/\d+/)[0])
      })
      this.costList.forEach(item=>{
        total += item.amount
      })
      this.bill.costSum = this.formatFloat(total);
      this.projectList = record.projectListMerge || [];
      this.projectListMerge = record.projectList || [];
      this.methods = 'add'
      this.visible = true
      this.typeDisabled = true
      this.$nextTick(() => {
        this.devidedForm.setFieldsValue(pick({incomeType:0},'incomeType'))
      })
    },
    checkDetail(){
      // console.log(this.projectList);
      this.projectList.map(item=>{
         item.installmentMonth = item.feeDesc=='项目成本'?item.settleMonth:item.installmentMonth
      })
      this.projectList.sort((a,b)=>{return Number(a.installmentMonth) - Number(b.installmentMonth)})
      this.$refs.ReimbursementForm.show(this.projectList);
    },
    // 编辑
    edit(record,id){
      this.id = id
      this.bill = record.bill
      this.incomeList = record.incomeList
      record.costList.sort(function(a,b){
        let aNum = a.name.substr(0,6)
        let bNum = b.name.substr(0,6)
        if(!isNaN(aNum)&&!isNaN(bNum)){
          return Number(aNum) - Number(bNum)
        }
        // return Number(a.name.match(/\d+/)[0]) - Number(b.name.match(/\d+/)[0])
      })
      this.costList = record.costList
      
      this.projectList = record.detailList || [];

      this.methods = 'edit'
      this.visible = true

      if(this.incomeList.length){
        if(this.incomeList[0]['devidedProp'] > 0){
          this.devidedType = 2
        }else if(this.incomeList[0]['incomeAmount'] > 0){
          this.devidedType = 3
        }
        index = this.incomeList.length-1
        this.devidedForm.setFieldsValue({
          keys: this.incomeList.map((item,index)=>index),
        })
      }else{
        this.devidedType = 1
        this.typeDisabled = true
      }

      let sumCost = 0
      this.costList.forEach(item=>{
        sumCost += item.amount
      })
      // 计算金额税金
      if(Number(this.bill.taxType) > 116){
        this.bill.settleNoTax = this.formatFloat((this.bill.sumSettle - sumCost)/(1+this.bill.tax/100) + sumCost)
      }else{
        this.bill.settleNoTax = this.formatFloat(this.bill.sumSettle/(1+this.bill.tax/100))
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({
          sumSettle:this.bill.sumSettle,
          ticketAmount:this.bill.ticketAmount,
        },'sumSettle','ticketAmount'))
        if(this.devidedType > 1){
          const incomeBelong = []
          const incomeBelongSub = []
          const id = []
          const incomeAmount = []
          const money = []
          this.incomeList.forEach(item=>{
            incomeBelong.push(item.incomeBelong)
            incomeBelongSub.push(item.incomeBelongSub)
            id.push(item.id)
            const temp = this.devidedType === 2 ? item.devidedProp : item.incomeAmount
            incomeAmount.push(temp)
            const temp2 = this.devidedType === 2 ? item.incomeAmount : 0
            money.push(temp2)
          })
          this.devidedForm.setFieldsValue(pick({
            incomeType:this.bill.incomeType,
            incomeBelong:incomeBelong,
            incomeBelongSub:incomeBelongSub,
            incomeAmount:incomeAmount,
            money:money,
            id:id
          },'incomeBelong','incomeBelongSub','incomeAmount','id','incomeType','money'))
        }else{
          this.devidedForm.setFieldsValue(pick({incomeType:this.bill.incomeType},'incomeType'))
        }
      })
    },
    changeDevided(e){
      this.devidedType = e.target.value
      this.devidedForm.resetFields()
      switch(this.devidedType){
        case 1:
          this.typeDisabled = true
          this.incomeListDelete = this.incomeListDelete.concat(this.incomeList)
          this.incomeList = []
          break
        case 2:
          this.typeDisabled = false
          this.devidedValidate.incomeAmount = {
            validateTrigger: ['change', 'blur'],
            rules: [{
              required: true,
              message: '请输入比例！',
            },{
              pattern: /^(\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}|100|0)$/,
              message: '比例格式不正确!'
            }],
          }
          break
        case 3:
          this.typeDisabled = false
          this.devidedValidate.incomeAmount = {
            validateTrigger: ['change', 'blur'],
            rules: [{
              required: true,
              message: '请输入金额！',
            },{
              pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
              message: '金额格式不正确!'
            }],
          }
          break
      }
      this.$nextTick(() => {
        this.devidedForm.setFieldsValue(pick({incomeType:0},'incomeType'))
      })
    },
    changeMoney(){
      this.$nextTick(() => {
        const type = this.devidedForm.getFieldValue('incomeType')
        const arr = this.devidedForm.getFieldValue('incomeAmount') || []
        const moneyArr = arr.map(item=>{
          let money = 0
          if(item){
            money = (type === 0) ? this.formatFloat(this.bill.income * item / 100) : this.formatFloat(this.bill.settleNoTax * item / 100)
          }
          return money
        })
        this.devidedForm.setFieldsValue(pick({money:moneyArr},`money`))
      })
    },
    changeVal(){
      if(this.devidedType !== 2){
        return
      }
      this.changeMoney()
      // const val = e.target.value
      // const type = this.devidedForm.getFieldValue('incomeType')
      // let money = 0
      // if(type === 0){
      //   money = this.formatFloat(this.bill.income * val / 100)
      // }else{
      //   money = this.formatFloat(this.bill.settleNoTax * val / 100)
      // }
      // let obj = {}
      // obj[`money[${k}]`] = money
      // this.$nextTick(() => {
      //   this.devidedForm.setFieldsValue(pick(obj,`money[${k}]`))
      // })
    },
    changeSwitch(e,index){
      this.$set(this.costList[index],`flag`,e)
      const sumSettle = this.form.getFieldValue('sumSettle') || 0
      this.bill.costSum = 0
      const costList = this.costList.filter(item=>(!item.hasOwnProperty('flag') || (item.hasOwnProperty('flag') && !item.flag)))
      costList.forEach(item=>{
        this.bill.costSum += item.amount
      })
      this.calculateMoney(sumSettle)
      // this.bill.settleNoTax = Math.round(parseFloat(sumSettle)*100 / (1+this.settleInfo.departSettlementInfo.taxFee/100))/100
      // this.bill.taxAmount = Math.round(this.bill.settleNoTax*100*this.settleInfo.departSettlementInfo.taxFee/100)/100
      // this.bill.income = Math.round(parseFloat((this.bill.settleNoTax - this.bill.costSum)*100))/100
    },
    // 精度处理
    formatFloat(f, digit = 2) {
      const m = Math.pow(10, digit)
      return Math.round(f * m) / m
    },
    calculateMoney(val){
      if(Number(this.bill.taxType) > 116){ // 差额税
        this.bill.settleNoTax = this.formatFloat((parseFloat(val) - this.bill.costSum) / (1+this.bill.tax/100) + this.bill.costSum)
        this.bill.taxAmount = this.formatFloat((parseFloat(val) - this.bill.costSum) / (1+this.bill.tax/100) * (this.bill.tax/100))
        const temp = this.formatFloat(parseFloat(val) - this.bill.costSum)
        this.bill.income = this.formatFloat(temp / (1+this.bill.tax/100))
      }else{ // 增值税
        this.bill.settleNoTax = this.formatFloat(parseFloat(val) / (1+this.bill.tax/100))
        this.bill.taxAmount = this.formatFloat(this.bill.settleNoTax*this.bill.tax/100)
        this.bill.income = this.formatFloat(parseFloat((this.bill.settleNoTax - this.bill.costSum)))
      }
      
      this.changeMoney()
    },
    changeSumSettle(e){
      this.calculateMoney(e.target.value)
      // this.bill.settleNoTax = Math.round(parseFloat(e.target.value)*100 / (1+this.settleInfo.departSettlementInfo.taxFee/100))/100
      // this.bill.taxAmount = Math.round(this.bill.settleNoTax*100*this.settleInfo.departSettlementInfo.taxFee/100)/100
      // this.bill.taxAmount = Math.floor(parseFloat(e.target.value*100 * this.settleInfo.departSettlementInfo.taxFee/100))/100
      // this.bill.income = Math.floor(parseFloat(this.bill.taxAmount * (1-this.settleInfo.departSettlementInfo.taxFee/100) * 100 - this.bill.costSum * 100))/100
      // this.bill.income = Math.round(parseFloat((this.bill.settleNoTax - this.bill.costSum)*100))/100
    },
    searchCost(){
      // if(this.searchParam.length === 0){
      //   this.$message.warning('请先输入搜索时间')
      //   return false
      // }
      this.loadingBtn = true
      this.confirmLoading = true
      // httpAction(`/hrOneTime/tcostingpayment/getTCostingPaymentList?departNo=${this.settleInfo.settleDomain.departNo}&startTime=${this.searchParam[0]}&endTime=${this.searchParam[1]}`,null,'post',60000).then(res=>{
      httpAction(`/hrOneTime/tcostingpayment/getNewTCostingPaymentList?departNo=${this.settleInfo.settleDomain.departNo}`,null,'post',60000).then(res=>{
        if(res.code === 200){
          this.bill.costSum = 0
          this.bill.income = 0
          this.costList = res.data ? res.data.map(item=>{
            this.bill.costSum += item.amount
            item.flag = false
            return item
          }) : []
          const sumSettle = this.form.getFieldValue('sumSettle') || 0
          this.calculateMoney(sumSettle)
        }else{
          this.$message.warning(res.msg)
        }
      }).finally(()=>{
        this.loadingBtn = false
        this.confirmLoading = false
      })
    },
    validateForm(){
      const _this = this
      return new Promise(function(resolve, reject){
        _this.form.validateFields((err, values) => {
          if (!err) {
            const type = _this.devidedForm.getFieldValue('incomeType')
            _this.bill = Object.assign(_this.bill,values,{taxAmount:_this.bill.taxAmount,tax:_this.bill.tax,income:_this.bill.income,incomeType:type})
            resolve()
          }else{
            reject('开票金额或结算金额验证不通过！')
          }
        })
      })
    },
    validateDevidedForm(){
      const _this = this
      return new Promise(function(resolve, reject){
        if(_this.devidedType>1){
          _this.devidedForm.validateFields((err, values) => {
            if (!err) {
              let sum = 0
              values.keys.forEach((item,j)=>{
                let temp = {
                  incomeBelong:values.incomeBelong[item],
                  incomeBelongSub:values.incomeBelongSub[item],
                  devidedProp:(_this.devidedType === 2) ? values.incomeAmount[item] : 0,
                  incomeAmount:(_this.devidedType === 3) ? values.incomeAmount[item] : (_this.devidedType === 2 ? values.money[item] : 0),
                }
                if(values.id[item]){
                  temp = Object.assign(_this.incomeList[j],temp)
                }
                sum += parseFloat(values.incomeAmount[item])
                _this.$set(_this.incomeList,j,temp)
              })
              if(_this.devidedType === 2 && sum.toFixed(2) != 100.00){
                reject('分成比例总和必须为100%!')
              }
              const incomeType = _this.devidedForm.getFieldValue('incomeType')
              if(incomeType === 0 && _this.devidedType === 3){
                if(_this.bill.income.toFixed(2) != sum.toFixed(2)){
                  reject('分成总金额不等于业务收入(不含税)')
                }
              }
              if(incomeType === 1 && _this.devidedType === 3){
                if(_this.bill.settleNoTax.toFixed(2) != sum.toFixed(2)){
                  reject('分成总金额不等于金额(不含税)')
                }
              }
              
              resolve()
            }else{
              reject('收入分成验证不通过！')
            }
          })
        }else{
          resolve()
        }
      })
    },
    handleOk(){
      const res1 = this.validateForm()
      const res2 = this.validateDevidedForm()
      const _this = this
      Promise.all([res1, res2]).then(function() {
        // const costList = _this.costList.filter(item=>(!item.hasOwnProperty('flag') || (item.hasOwnProperty('flag') && !item.flag)))
        _this.confirmLoading = false
        let params = {
          bill:_this.bill,
          costList:_this.costList,
          incomeList:_this.incomeList,
          businessMain:{settleDomainId:_this.settleInfo.settleDomain.id,serverItem:_this.settleInfo.settleDomain.serverItem}
        }
        let url = ''
        if(_this.methods === 'add'){
          params = {...params,...{detailList:_this.projectListMerge}}
          url = `/hrOneTime/tnewsettle/saveTNewSettleVo`
        }else{
          url = `/hrOneTime/tnewsettle/updateTNewSettleVo`
          params = Object.assign(params,{incomeListDelete:_this.incomeListDelete})
          params.businessMain.id = _this.id
        }
        if(_this.costList.length === 0){
          _this.$confirm({
            centered: true,
            title: '确认生成结算单',
            content: '未检索到任何成本数据，确定结算？',
            onOk() {
              _this.handleSave(url,params)
              // _this.$refs.SettlementSubmitForm.showModal(params,'post',url)
            },
          })
        }else{
          _this.handleSave(url,params)
          // _this.$refs.SettlementSubmitForm.showModal(params,'post',url)
        }
      }).catch(err=>{
        _this.$message.warning(err)
      })
    },
    handleSave(url,params){
      httpAction(url,params,'post').then((res) => {
        if(res.code == 200){
          this.$message.success(`保存成功!`)
          this.$emit('ok')
        }else{
          this.$message.warning(res.msg)
        }
      }).finally(() => {
        this.confirmLoading = false
        this.handleCancel()
      })
    },
    rangeChange(range,str){
      const time = range[1].diff(range[0], 'years')
      if(time){
        this.$message.warning('日期范围不能超过一年!')
        this.rangeDate = ['','']
        return
      }
      this.searchParam = str
    },
    addItem() {
      const { devidedForm } = this
      const keys = devidedForm.getFieldValue('keys')
      const nextKeys = keys.concat(++index)
      devidedForm.setFieldsValue({
        keys: nextKeys,
      })
    },
    remove(k) {
      this.incomeListDelete.push(this.incomeList[k])
      this.$delete(this.incomeList,k)
      const { devidedForm } = this
      const keys = devidedForm.getFieldValue('keys')
      devidedForm.setFieldsValue({
        keys: keys.filter(key => key !== k),
      })
    },
    submitOk(){
      this.handleCancel()
      this.$emit('ok')
    },
    disabledDate(current) {
      const val = moment.max(moment('2021-01-01'),moment().subtract(1,'y').startOf('day'))
      return current < val || current > moment().endOf('day')
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.visible = false
      this.costList = this.incomeList = this.incomeListDelete = []
      this.projectList = []
      this.bill = {
        income: 0,
        costSum: 0,
        ticketAmount:0,
        sumSettle:0,
        taxAmount:0,
        tax:0
      }
      this.devidedType = 1
      this.id = ''
      this.typeDisabled = false
    },
  }
}


</script>

<style lang="less" scoped>
  .costTable{
    width: 96%;
    margin: 0 auto;
    border-collapse:collapse;
    td{
      font-size: 13px;
    }
    td,th{
      text-align: center;
      line-height: 32px;
      border:1px solid #e5e5e5;
    }
  }
  .btnRight{
    float: right;
  }
  .tableTit{
    font-size: 17px;
    color: #000000d9;
  }
  .settleForm{
    background: #fafafa;
    padding:15px 0px 10px;
  }
  .formLabel {
    margin-bottom:0px;
  }
  .list{
    margin: 20px 0px;
    background: #fafafa;
    padding: 30px 10px 20px;
    .search{
      margin-bottom: 20px;
    }
    .row{
      line-height: 36px;
    }
    .costDisabled{
      color: #CCCCCC;
    }
    .bottom{
      margin:20px 20px;
      border-top: 1px solid #e5e5e5;
      font-size: 16px;
      padding:20px 0px 0px;
    }
  }
  .devidedFormClass{
    margin: 20px 0px;
    background: #fafafa;
    padding: 30px 10px 20px;
    .stepFormText{
      height:60px;
    }
  }
</style>
