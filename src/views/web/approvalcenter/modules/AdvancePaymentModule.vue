<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >

    <template slot="footer">
      <a-button key="previewBill" type="primary" @click="chooseSettleBill" v-if="btnShow">选择结算单</a-button>
      <a-button key="audit" type="primary" :loading="confirmLoading" @click="handleOk" v-if="btnShow">保存</a-button>
      <a-button key="back" @click="handleCancel">关闭</a-button>
    </template>

    <a-form :form="form" layout="inline" class="ant-advanced-search-form">
      <div class="ant-card-body">
        <a-spin :spinning="confirmLoading">
          <a-card :bordered="true" class="ant-card-wider-padding" id="staffCard" style="margin: 0px auto; width:900px;">
            <span id="staffEvectionTitle">垫付申请单</span>
            <table border="1px" id="taffEvectionTable">
              <thead>
                <tr v-if="advancePaymentNo">
                  <td class="theadTr">垫付编号</td>
                  <td
                    align="left"
                    colspan="4"
                    style="padding-left: 10px;"
                  >{{ advancePaymentNo }}</td>
                </tr>
                <tr>
                  <td class="theadTr">客户单位</td>
                  <td align="left" colspan="2" class="padLeft">{{ settleDomain.customerName }}</td>
                  <td class="theadTr">客户合同</td>
                  <td align="left" colspan="2" class="padLeft">{{ settleDomain.contractName }}</td>
                </tr>
                <tr>
                  <td class="theadTr">结算主体</td>
                  <td align="left" colspan="2" class="padLeft">
                    <a-form-item style="width: 100%;">
                      <!-- <a-select
                        showSearch
                        placeholder="请输入结算主体"
                        :notFoundContent="null"
                        :defaultActiveFirstOption="false"
                        :showArrow="false"
                        :filterOption="false"
                        style="width: 295px;"
                        @change="settleDomainChange"
                        @search="handleSearch"
                        v-decorator="['settleDomainId', validatorRules.settleDomainId ]"
                      >
                        <a-select-option v-for="d in settleDomains" :key="d.id">{{ d.departName }}</a-select-option>
                      </a-select> -->
                      <select-page
                        placeholder="请选择结算主体"
                        style="width: 295px"
                        v-decorator="['settleDomainId', {rules: [{ required: true, message: '请选择结算主体!' }]}]"
                        :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                        :id="'id'"
                        :title="'departName'"
                        :allowClear="false"
                        :triggerChange="true"
                        :resList="resList"
                        @change="settleChange"
                      ></select-page>
                    </a-form-item>
                  </td>
                  <td class="theadTr">商务主体</td>
                  <td align="left" colspan="2" class="padLeft">
                    <a-form-item style="width: 100%;">
                      <a-select
                        showSearch
                        placeholder="请选择商务主体"
                        optionFilterProp="children"
                        style="width: 295px;"
                        :disabled="true"
                        v-decorator="['applyUnit', validatorRules.applyUnit ]"
                      >
                        <a-select-option
                          v-for="(item, index) in organs"
                          :key="index"
                          :value="String(item.id)"
                        >{{ item.organName }}</a-select-option>
                      </a-select>
                      <a-input v-decorator="['applyUnitName']" type="hidden"/>
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td class="theadTr">垫付类型</td>
                  <td align="left" colspan="2" class="padLeft">
                    <a-form-item style="width: 100%;">
                      <a-select
                        placeholder="请选择垫付类型"
                        optionFilterProp="children"
                        style="width: 295px;"
                        :disabled="true"
                        v-decorator="['advanceType', validatorRules.advanceType ]"
                      >
                        <a-select-option value="1">业务约定垫付</a-select-option>
                        <a-select-option value="2">偶发性垫付</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                  <td class="theadTr">回款周期</td>
                  <td align="left" colspan="2" class="padLeft">
                    <a-form-item>
                      <a-input
                        placeholder="请填写回款周期"
                        style="width: 250px;"
                        :disabled="true"
                        v-decorator="['backPayCycle', validatorRules.backPayCycle ]"
                      /> 个月
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td class="theadTr">期望打款日期</td>
                  <td align="left" colspan="2" class="padLeft">
                    <a-form-item style="width: 100%;">
                      <a-date-picker
                        placeholder="请选择期望打款日期"
                        :disabledDate="disabledStartDate"
                        :allowClear="false"
                        v-decorator="['applyAdvanceDate', validatorRules.applyAdvanceDate ]"
                        style="width: 295px;"
                      />
                    </a-form-item>
                  </td>
                  <td class="theadTr">本次已垫付未回款金额</td>
                  <td align="left" colspan="2" class="padLeft">
                    {{ Number(advanceNotPayback)>0 ?(- advanceNotPayback): 0 }}
                  </td>
                </tr>
              </thead>
              <tr>
                <td class="theadTr">结算金额</td>
                <td class="theadTr padLeft" colspan="2" align="left">
                  {{ settleMoney }}
                  <!--<a-input placeholder="结算金额" :disabled="true" v-decorator="['settleMoney', validatorRules.settleMoney ]"/>-->
                </td>
                <td class="theadTr">开票金额</td>
                <td class="theadTr padLeft" colspan="2" align="left">
                  {{ ticketMoney }}
                  <!--<a-input placeholder="开票金额" :disabled="true" v-decorator="['ticketMoney', validatorRules.ticketMoney ]"/>-->
                </td>
              </tr>
              <tr>
                <td class="firstTr">垫付金额</td>
                <td class="firstTr padLeft" colspan="2" align="left">
                  <a-form-item style="width: 100%;">
                    <a-input
                      placeholder="请填写垫付金额"
                      @paste="listenPaste"
                      @change="advanceMoneyChange"
                      style="width: 295px;"
                      v-decorator="['advanceMoney', validatorRules.advanceMoney ]"/>
                  </a-form-item>
                </td>
                <td class="firstTr">承诺回款日期</td>
                <td class="firstTr padLeft" colspan="2" align="left">
                  <a-form-item style="width: 100%;">
                    <a-date-picker
                      placeholder="请选择承诺回款日期"
                      :disabledDate="disabledEndDate"
                      :allowClear="false"
                      v-decorator="['paybackDate', validatorRules.paybackDate ]"
                      @change="changePaybackDate"
                      style="width: 295px;"
                    />
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="costingCol">申请人</td>
                <td class="costingCol padLeft" colspan="2" align="left">
                  {{ applyUser }}
                </td>
                <td class="costingCol">垫付原因</td>
                <td class="costingCol padLeft" colspan="2">
                  <a-form-item style="width: 100%;text-align:left;" :required="true">
                    <a-input placeholder="垫付原因" style="width: 295px;" v-decorator="['advanceReason', validatorRules.advanceReason ]"/>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="costingCol">垫付函</td>
                <td class="costingCol padLeft" colspan="4" align="left">
                  <a-form-item>
                    <div
                      class="clearfix"
                      style="width: 600px;"
                    >
                      <a-upload
                        listType="picture"
                        class="upload-list-inline"
                        :fileList="fileList"
                        @change="handleImport"
                        @preview="handlePreview"
                        :multiple="true"
                        accept="image/*,.xls,.xlsx,.csv,.pdf"
                        :remove="handleRemove"
                        :beforeUpload="beforeUpload"
                      >
                        <div
                          v-if="fileList.length < 15"
                          style="display: inline-block;"
                        >
                          <a-icon type="plus" />
                          <div class="ant-upload-text">选择文件</div>
                        </div>
                      </a-upload>
                      <a-modal
                        :visible="previewVisible"
                        :footer="null"
                        @cancel="handlePreviwCancel"
                      >
                        <img
                          alt="example"
                          style="width: 100%"
                          :src="previewImage"
                        />
                      </a-modal>
                    </div>
                  </a-form-item>
                </td>
              </tr>
            </table>
          </a-card>
        </a-spin>
      </div>
    </a-form>

    <choose-settle-bill-before ref="chooseSettleBillBefore" @ok="chooseSettleBillBeforeOk"></choose-settle-bill-before>
  </a-modal>
</template>

<script>
import { httpAction,postActionHeader } from '@/api/manage'
import { getNameFromArr } from '@/utils/common'
// import { debounce } from '@/utils/util'
import { mapGetters } from 'vuex'
import ChooseSettleBillBefore from './ChooseSettleBillBefore'
import pick from 'lodash.pick'
import moment from "moment"
import SelectPage from '@/components/jeecg/SelectPage'

export default {
  name: 'AdvancePaymentModule',
  components: { ChooseSettleBillBefore,SelectPage },
  data() {
    return {
      title: '操作',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      model: {},
      btnShow:true,
      isUpload:true,
      settleDomains: [],
      customerTypeDicts: [],
      advanceTypeDicts: [],
      fileTypeOfOffice:'xls,xlsx,doc,docx,ppt,pptx',
      organs: [],
      fileList: [],
      resList: [],
      advanceNotPayback: 0,
      settleDomain: {customerName: "",contractName: ""},
      settleMoney: 0,
      ticketMoney: 0,
      previewVisible: false,
      previewImage: '',
      selectId: '',
      disabledPaybackDate:2,
      advancePaymentNo:'',//垫付编号
      advanceMoneyOld:0,
      validatorRules: {
        // settleDomainId: {rules: [{validator: this.validateMobile}]},
        settleDomainId: {rules: [{required: true, message: '请选择结算主体!'}]},
        advanceReason:{rules: [{required: true, message: '请输入垫付原因!'}]},
        backPayCycle:{rules: [{required: true, message: '请填写回款周期!'}]},
        paybackDate:{rules: [{required: true, message: '请选择回款日期!'}]},
        applyAdvanceDate:{rules: [{required: true, message: '请选择申请垫付时间!'}]},
        advanceMoney: { rules: [{required: true, message: '请输入垫付金额!'},{pattern:/^(([1-9][0-9]{0,10})|(([0]\.\d{1,2}|[1-9][0-9]{0,10}\.\d{1,2})))$/,message: '垫付金额格式不正确!' }]},
      },
      url: {
        getSettleDomainList: '/hrBase/tsettledomain/getSettleDomainSelectVosDomainNameOrCode',
        getOrgan: '/admin/organizationinfo/getOrgForCus?type=0',
        getNoBackMoneySum: '/hrApproval/tadvancepayment/getNoBackMoneySum',
        saveOrUpdate: '/hrApproval/tadvancepayment',
        importUrl: '/hrApproval/tpaymentattainfo/upload',
        deleteAtta: '/hrApproval/tpaymentattainfo/',
        checkAdvanceUseable:'/hrApproval/tadvanceuseset/checkAdvanceUseable'//查询垫付金额是否可垫付
      },
      applyUser:'',
    }
  },

  created() {
    this.getOrgans();
  },

  methods: {
    ...mapGetters(["nickname"]),
    moment,
    listenPaste(e){
      const data = e.clipboardData.getData('text');
      let res=this.form.getFieldValue('advanceMoney')
      res=(res===undefined?'':res)+data;
      this.advanceNotPayback = res
    },

    add() {
      this.visible = true;
      this.advancePaymentNo = ''
      this.applyUser = this.nickname();
      this.form.resetFields()
    },

    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.advanceMoneyOld = this.model.advanceMoney
      this.resList = [{id:record.settleDomainId,title:record.departName}]
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'settleDomainId','advanceType','applyUnit',
          'advanceMoney','advanceReason','applyUnitName','backPayCycle'))
        if(this.model.auditStatus === '3'){
          this.settleMoney = 0;
          this.ticketMoney = 0;
          this.selectId = '';
          this.applyUser = this.nickname();
        }else{
          switch (this.model.billType) {
            case '0':
              this.selectId = this.model.salarySettleBillId;
              break;
            case '1':
              this.selectId = this.model.engineeringBillId;
              break;
            case '2':
              this.selectId = this.model.salarySettleBillId;
              break;
            case '3':
              this.selectId = this.model.insuranceBillId;
              break;
            case '4':
              this.selectId = this.model.oneTimeSettleBillId;
              break;
            default:
              break;
          }
          this.applyUser = record.createUser;
          this.form.setFieldsValue({applyAdvanceDate:this.model.applyAdvanceDate?moment(this.model.applyAdvanceDate,'YYYY-MM-DD'):null})
          this.form.setFieldsValue({paybackDate:this.model.paybackDate?moment(this.model.paybackDate,'YYYY-MM-DD'):null})
        }
        
      })
      this.disabledPaybackDate = Number(record.backPayCycle);
      this.settleDomain.customerName = record.customerName;
      this.settleDomain.customerId = record.customerId;
      this.settleDomain.belongContract = record.contractId;
      this.settleDomain.id = record.settleDomainId
      this.advanceNotPayback = this.model.advanceMoney
      this.settleMoney = this.model.settleMoney
      this.ticketMoney = this.model.ticketMoney
      let settleObj = {};
      settleObj.departName = record.departName;
      settleObj.id = record.settleDomainId;
      this.settleDomains.push(settleObj);
      this.visible = true
    },

    chooseSettleBill() {
      if(this.settleDomain.id) {
        this.$refs.chooseSettleBillBefore.showModal(this.settleDomain.id,this.model.billType);
      } else {
        this.$message.error('请选择结算主体!');
      }
    },

    chooseSettleBillBeforeOk() {
      this.model.settleMoney = this.$refs.chooseSettleBillBefore.settleMoney;
      this.settleMoney = this.$refs.chooseSettleBillBefore.settleMoney;
      this.ticketMoney = this.$refs.chooseSettleBillBefore.ticketMoney;
      this.model.ticketMoney = this.$refs.chooseSettleBillBefore.ticketMoney;
      let selectType = this.$refs.chooseSettleBillBefore.selectValue;
      this.model.billType = selectType
      this.selectId = this.$refs.chooseSettleBillBefore.selectId;
      switch (selectType) {
        case '0':
          this.model.salarySettleBillId = this.selectId;
          this.model.billType = 0
          break;
        case '1':
          this.model.engineeringBillId = this.selectId;
          break;
        case '2':
          this.model.salarySettleBillId = this.selectId;
          this.model.billType = 2
          // this.model.proxySettleBillId = this.selectId;
          break;
        case '3':
          this.model.insuranceBillId = this.selectId;
          break;
        case '4':
          this.model.oneTimeSettleBillId = this.selectId;
          break;
        default:
          break;
      }
    },

    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const settleDomainId = values.settleDomainId
          
          const advanceMoneyNew = Number(values.advanceMoney)
          const advanceMoney = advanceMoneyNew -Number(this.advanceMoneyOld)
          
          if(Number(this.advanceMoneyOld)<=10){
            httpAction(`${this.url.checkAdvanceUseable}?settleDomainId=${settleDomainId}&advanceMoney=${advanceMoneyNew}`,{},'post').then(res=>{
                if(res.code ==200&&res.data){
                  this.saveOk(values)
                }else{
                  this.$message.warning(res.msg)
                }
            })
          }else if(advanceMoney>0){
              httpAction(`${this.url.checkAdvanceUseable}?settleDomainId=${settleDomainId}&advanceMoney=${advanceMoney}`,{},'post').then(res=>{
                if(res.code ==200&&res.data){
                  this.saveOk(values)
                }else{
                  this.$message.warning(res.msg)
                }
            })
          }else{
            this.saveOk(values)
          }
        }
      })
    },
    // 保存流程
    saveOk(values){
      const that = this
      let method = '';
      let msg = '';
      let formData = Object.assign(this.model, values)
      if(this.model.auditStatus === '3'){
        delete formData.spNo;
      }
      formData.customerName = this.settleDomain.customerName;
      formData.departName = this.settleDomain.departName;
      formData.customerId = this.settleDomain.customerId;
      formData.contractId = this.settleDomain.belongContract;
      formData.applyAdvanceDate = formData.applyAdvanceDate ? formData.applyAdvanceDate.format('YYYY-MM-DD') : null
      formData.paybackDate = formData.paybackDate ? formData.paybackDate.format('YYYY-MM-DD') : null
      formData.advanceNotPayback = -(this.advanceNotPayback)
      formData.attaInfoIds = ""
      if(this.fileList != null && this.fileList.length > 0) {
        for (let i = 0; i < this.fileList.length; i++) {
          if(i == this.fileList.length - 1) {
            formData.attaInfoIds = formData.attaInfoIds + this.fileList[i].uid
          } else {
            formData.attaInfoIds = formData.attaInfoIds + this.fileList[i].uid + ","
          }
        }
      }
      
      if(!this.selectId){
        this.$message.error('请选择需要垫付的结算单');
        return;
      }

      // if (!this.selectId && !this.model.id) {
      //   this.$message.error('请选择需要垫付的结算单');
      //   return;
      // }

      if (!formData.ticketMoney) {
        formData.ticketMoney = 0.0;
      }
  
      if(!this.model.id || this.model.auditStatus === '3'){
        formData.id = null;
        delete formData.auditStatus;
        delete formData.createUser;
        delete formData.createUserId;
        delete formData.createTime;
        method = 'post';
        msg = '添加成功!';
      } else {
        formData.auditStatus = 0;
        method = 'put';
        msg = '修改成功!';
      }
      that.confirmLoading = true
      httpAction(this.url.saveOrUpdate, formData, method).then((res) => {
        if(Number(res.code) === 200){
          this.$message.success(msg);
          this.$emit('ok');
          this.close();
        } else {
          this.$message.warning(res.msg);
        }
      }).finally(() => {
        this.confirmLoading = false;
      })
    },

    // 选择结算主体
    settleChange(val,option){
      const settleInfo = option.context.lists[option.key]['item']
      this.settleMoney = 0
      this.ticketMoney = 0
      if(settleInfo.backPayCycle == null){
        this.$message.warning(`请先完善结算主体《${settleInfo.departName}》中的垫付信息！`)
        this.$nextTick(() => {
          this.settleDomain.customerName = ''
          this.settleDomain.contractName = ''
          this.form.setFieldsValue(pick({settleDomainId:undefined,advanceType:undefined,backPayCycle:'',applyUnit:undefined,paybackDate:null}, 'settleDomainId','advanceType','backPayCycle','applyUnit','paybackDate'))
        })
        return
      }
      const defaultVal = {backPayCycle:'',advanceType:''}
      if(settleInfo.existAdvancePayment === '1'){
        defaultVal.backPayCycle = settleInfo.backPayCycle
        defaultVal.advanceType = '1'
      }else{
        defaultVal.backPayCycle = '2'
        defaultVal.advanceType = '2'
      }
      this.disabledPaybackDate = Number(defaultVal.backPayCycle)
      this.selectId = ''
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({settleDomainId:val,backPayCycle:defaultVal.backPayCycle,advanceType:defaultVal.advanceType}, 'settleDomainId','backPayCycle','advanceType'))
      })
      this.settleDomain = settleInfo
      if(!settleInfo.belongContract){
        this.$message.warning('该结算主体下无合同!');
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({applyUnit:undefined,applyUnitName:null}, 'applyUnit','applyUnitName'));
        })
        return
      }
      // 自动匹配商务主体
      httpAction(`/hrBase/tcustomercontract/${this.settleDomain['belongContract']}`, null, 'get').then((res) => {
        if(Number(res.code) === 200){
          if(!res.data){
            this.$message.warning('未查询到该结算主体下的商务主体!');
            this.$nextTick(() => {
              this.form.setFieldsValue(pick({applyUnit:undefined,applyUnitName:null}, 'applyUnit','applyUnitName'));
            })
            return
          }
          const organName = getNameFromArr(this.organs,res.data.businessSubject,'id','organName')
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({applyUnit:res.data.businessSubject,applyUnitName:organName}, 'applyUnit','applyUnitName'))
          })
        }else{
          this.$message.warning(res.msg)
        }
      })
      
    },
    settleDomainChange(v) {
      for (const item of this.settleDomains) {
        if(String(item.id) === String(v)) {
          this.settleDomain = item
        }
      }
      // 自动匹配商务主体
      httpAction(`/hrBase/tcustomercontract/${this.settleDomain.belongContract}`, null, 'get').then((res) => {
        if(Number(res.code) === 200){
          const organName = getNameFromArr(this.organs,res.data.businessSubject,'id','organName')
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({applyUnit:res.data.businessSubject,applyUnitName:organName}, 'applyUnit','applyUnitName'))
          })
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    // 垫付金额
    advanceMoneyChange(e) { 
      this.advanceNotPayback = e.target.value;
    },
    changePaybackDate(val){
      // 申请垫付时间
      const endValue = this.form.getFieldValue('applyAdvanceDate')
      if(endValue && endValue.valueOf() > val.valueOf()){
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({applyAdvanceDate:null}, 'applyAdvanceDate'))
        })
      }
    },
    disabledEndDate(endValue) {
      const startValue = moment().add(1, 'month').startOf('month').add(this.disabledPaybackDate, 'months');
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() <= endValue.valueOf();
    },

    disabledStartDate(startValue) {
      const endValue = this.form.getFieldValue('paybackDate');
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf()-86400000 > endValue.valueOf();
    },

    handleSearch(value) {
      this.settleDomains = [];
      const parm = value.replace(/\+/g, '%2B')
      httpAction(`${this.url.getSettleDomainList}?departName=${parm}&departNo=${parm}`,null,'GET').then((res) => {
        if(res.data != null && res.data.length > 0) {
          this.settleDomains = res.data;
        }
      });
    },

    getOrgans() {
      httpAction(this.url.getOrgan,'','GET').then((res) => {
        if(Number(res.code) === 200 && res.data.length > 0) {
          this.organs = res.data;
        }
      });
    },

    handleCancel() {
      this.close();
    },

    close() {
      this.$emit('close')
      this.settleDomains = []
      this.settleDomain = this.model = {}
      this.settleMoney = this.ticketMoney = this.advanceNotPayback = 0
      this.btnShow = true
      this.visible = false
      this.fileList = []
      this.resList = []
      this.selectId = this.model.id = ''
      this.disabledPaybackDate = 2
      this.applyUser = ''
      this.advanceMoneyOld = 0
    },

    handlePreviwCancel () {
      this.previewVisible = false
    },

    handlePreview (file) {
      const fileExt = file.name.replace(/.+\./,"")
      const reg = new RegExp(fileExt,"gi")
      if(reg.test(this.fileTypeOfOffice)) {
        window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url || file.thumbUrl)}`, '_blank')
      }else if(/pdf/gi.test(fileExt)){
        window.open(file.url || file.thumbUrl,'_blank')
      }else{
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      }
    },

    beforeUpload() {
      // this.fileList = [...this.fileList, file]
      return false;
    },

    handleImport(file) {
      // const { fileList } = this;
      // this.uploadFilesChange(fileList[fileList.length - 1])
      if(this.isUpload){
        this.uploadFilesChange(file.file)
      }
    },

    uploadFilesChange(file) {
      const _this = this
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", 1);
      const contextType = {'Content-Type': 'multipart/form-data'};
      postActionHeader(this.url.importUrl, formData,contextType).then((res) => {
        if(Number(res.code) === 200 && res.data){
          if(_this.model.auditStatus === '3'){
            const list = Object.assign(res.data,{isPrev:true});
            _this.fileList = [..._this.fileList, list];
          }else{
            _this.fileList = [..._this.fileList, res.data];
          }
          _this.$message.success('上传附件成功');
        }else{
          _this.$message.warning(res.msg)
        }
      });
    },

    handleRemove(file) {
      this.isUpload = false
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      const that = this;
      if(this.model.auditStatus === '3' && !file.isPrev){
        that.fileList = newFileList;
        that.$message.success('删除成功！');
      }else{
        httpAction(this.url.deleteAtta + file.uid,null,'delete').then((res) => {
          if(Number(res.code) === 200) {
            that.fileList = newFileList;
            that.$message.success('删除成功！');
          } else {
            that.$message.warning(res.msg);
          }
        });
      }
      setTimeout(()=>{
        that.isUpload = true;
      },2000)
    },
  }
}
</script>

<style scoped>
.padLeft{
  padding-left: 10px !important;
}
#staffEvectionTitle {
  margin-top: 1px;
  margin-bottom: 5px;
  font-weight: 700;
  text-align: center;
  display: block;
  color: #000;
  font-size: 24px;
}
#taffEvectionTable {
  width: 100%;
  font-size: 12px;
  text-align: center;
  background-color: #fff;
}
#staffCard {
  border: 1px solid;
  box-shadow: 0 0 1px 1px #CCC, 3px 0 5px 0 #CCC, 0 4px 7px 0 #CCC;
}
.ant-form-item-control{
  line-height: normal;
}
.ant-advanced-search-form .ant-form-item{
  margin-bottom: 0px;
}
.upload-list-inline >>> .ant-upload-list-item {
  float: left;
  width: 190px;
  margin-right: 8px;
}
#taffEvectionTable .firstTr {width: 120px;}
#taffEvectionTable .costingCol {width: 120px;}
#taffEvectionTable .theadTr {width: 120px;}
#taffEvectionTable td {color: #000;padding: 10px 0px 10px 0px;}
</style>
