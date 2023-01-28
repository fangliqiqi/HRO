
<template>
  <a-modal
    :title="title"
    :width="1200"
    placement="right"
    :closable="true"
    :footer="null"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    wrapClassName="dialogBig"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <div class="dialogContent">
        <a-row>
          <a-col :span="14">
            <a-form
              :form="deadlineForm"
              layout="inline"
            >
              <a-form-item label="材料上交截止日期">
                <a-date-picker
                  placeholder="请选择材料上交截止日期"
                  :disabledDate="disabledDeadlineDate"
                  :disabled="disableSet"
                  v-decorator="['lastMaterialSubDate',validatorRules.lastMaterialSubDate]"
                />
                （注意，设置后不可再次修改）
              </a-form-item>
            </a-form>
          </a-col>
          <a-col
            :span="4"
            :offset="6"
          >
            <a-button type="primary" class="save" :disabled="disableSet" @click="submitDeadline">保存</a-button>
            <a-button type="primary" @click="handleStatus" :disabled="disableEnd">完成理赔</a-button>
          </a-col>
          <a-col :span="24" class="lineTitle">办理过程</a-col>
          <div class="border">
            <a-col :span="12">
              <a-col :span="24" class="handleEvent">事件办理</a-col>
              <a-form
                :form="handleRecordForm"
                layout="inline"
                class="ant-advanced-search-form"
              >
                <a-col :span="24">
                  <a-form-item label="记录日期">
                    <a-date-picker
                      placeholder="请选择记录日期"
                      style="width: 200px"
                      :disabledDate="disabledRecordDate"
                      v-decorator="['recordingDate',validatorRules.recordingDate]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="办理流程及结果">
                    <a-textarea
                      rows="5"
                      cols="66"
                      :placeholder="eventType==3?'例如：**公司张三于2022年3月9日因劳动争议提起仲裁,后于2022年4月3日开庭处理,双方调解意向未达成一致，经仲裁委裁决皖信公司应支付**元,我司不服上诉至人民法院,后于4月23日开庭处理,经判决皖信公司于2022年5月9日前支付**元，双方均未上诉，此案终结。（必填项）'
                        :eventType==4?'**公司张三于2022年3月9日因劳动争议诉讼至人民法院,后于2022年5月24开庭处理,双方调解意向未达成一致,经人民法院判决皖信公司于6月5日前支付**元，双方均未上诉，此案终结。（必填项）':'请填写办理流程及结果（必填项）'"
                      
                      v-decorator="['recordingContent',validatorRules.recordingContent]"
                    >
                    </a-textarea>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="服务方式">
                    <a-select placeholder="请选择服务方式" style="width: 200px" v-decorator="['serviceMode',validatorRules.serviceMode]">
                      <a-select-option
                        v-for="item in serviceModeOption"
                        :key="item.value"
                        :value="item.value">
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-form>
              <a-button type="primary" class="addRecord" @click="submitHandleRecord" :disabled="disableEnd">添加</a-button>
            </a-col>
            <a-col :span="12">
              <a-col :span="24" class="handleEvent">办理日志</a-col>
              <a-col :span="24" class="timeLine">
                <template v-if="dealInfo.length">
                  <a-timeline style="padding-top: 4px;">
                    <a-timeline-item
                      color="green"
                      v-for="item in dealInfo"
                      :key="item.id"
                    >
                      <p>{{ item.recordingUserName }}</p>
                      <p>{{ item.recordingDate.substring(0, 10) }}</p>
                      <p>{{ item.serviceMode ? `${getServiceMode(item.serviceMode)}：` : '' }}{{ item.recordingContent }}</p>
                    </a-timeline-item>
                  </a-timeline>
                </template>
                <template v-else>
                  <a-empty :image="false" description="暂无办理日志"/>
                </template>
              </a-col>
            </a-col>
          </div>
          <a-col :span="24" class="lineTitle">处理费用</a-col>
          <div class="border">
            <a-col :span="12">
              <a-col :span="24" class="handleEvent">费用添加</a-col>
              <a-form
                :form="costForm"
                layout="inline"
                class="ant-advanced-search-form"
              >
                <a-col :span="12">
                  <a-form-item
                    label="发生时间"
                    class="stepFormText"
                  >
                    <a-date-picker
                      placeholder="请选择发生时间"
                      style="width: 150px"
                      :disabledDate="disabledRecordDate"
                      v-decorator="['feeHappenTime',validatorRules.feeHappenTime]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="费用承担方"
                    class="stepFormText"
                  >
                    <a-select 
                      placeholder="请选择费用承担方" 
                      style="width: 150px" 
                      v-decorator="['sourceType',validatorRules.sourceType]" 
                      @change="changeSourceType"
                    >
                      <a-select-option
                        v-for="(item,index) in sourceTypeOption"
                        :key="index"
                        :value="String(item.value)">{{ item.label }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="费用类型"
                    class="stepFormText"
                  >
                    <a-select
                      placeholder="请选择费用类型"
                      style="width: 150px"
                      v-decorator="['feeType',validatorRules.feeType]"
                      showSearch
                      optionFilterProp="children"
                      :dropdownMatchSelectWidth="false">
                      <a-select-option
                        v-for="item in feeTypeOption"
                        :key="item.id"
                        :value="item.value">{{ item.label }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="金额"
                    class="stepFormText"
                  >
                    <a-input suffix="元" v-decorator="['fee',validatorRules.fee]" style="width: 150px" placeholder="请输入金额"/>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item
                    label="备注"
                    class="stepFormText"
                  >
                    <a-textarea
                      rows="3"
                      style="width:430px"
                      placeholder="请填写备注"
                      v-decorator="['remark', { rules:[{ required: remarkFlag, message: '请输入备注！' },{max: 50, message: '最多50个字符!'}]}]"
                    >
                    </a-textarea>
                  </a-form-item>
                </a-col>
              </a-form>

              <a-button type="primary" class="addRecord" @click="submitCostRecord" :disabled="disableEnd">添加</a-button>
            </a-col>
            <a-col :span="12">
              <a-col :span="24" class="handleEvent">费用明细</a-col>
              <a-col :span="24" style="font-size:12px;text-align:right;">
                合计：{{ eventFeeDetail.total || 0 }}元；我司：{{ eventFeeDetail.companyTotal || 0 }}元；客户：{{ eventFeeDetail.customerTotal || 0 }}元；社保局：{{ eventFeeDetail.socialTotal || 0 }}元；保险公司：{{ eventFeeDetail.insuranceTotal || 0 }}元
              </a-col>
              <a-col :span="24">
                <undertaker-modal
                  :eventFeeDetail="eventFeeDetail"
                  :feeTypeOption="feeTypeOption"
                  @cancel="handleCancel"
                  :disableEnd="disableEnd"
                  :dataCompany="dataCompany"
                  :dataCustomer="dataCustomer"
                  :dataSocial="dataSocial"
                  :dataInsurance="dataInsurance"
                ></undertaker-modal>
              </a-col>
            </a-col>
          </div>
        </a-row>
      </div>

      <a-modal
        title="伤残等级"
        :visible="handleVisible"
        :confirm-loading="handleConfirmLoading"
        @ok="handleSucess"
        @cancel="cancelEvent"
      >
        <a-form
          :form="handleForm"
          layout="inline"
        >
          <a-form-item label="请选择伤残等级">
            <a-select v-decorator="['disabilityLevel',{initialValue:''}]" style="width:100px">
              <a-select-option value="">无</a-select-option>
              <a-select-option value="1">1</a-select-option>
              <a-select-option value="2">2</a-select-option>
              <a-select-option value="3">3</a-select-option>
              <a-select-option value="4">4</a-select-option>
              <a-select-option value="5">5</a-select-option>
              <a-select-option value="6">6</a-select-option>
              <a-select-option value="7">7</a-select-option>
              <a-select-option value="8">8</a-select-option>
              <a-select-option value="9">9</a-select-option>
              <a-select-option value="10">10</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>

    </a-spin>
  </a-modal>
</template>
    
  
<script>

import moment from 'moment'
import { httpAction } from '@/api/manage'
import UndertakerModal from './UndertakerModal'
import pick from 'lodash.pick'
import { mapGetters } from 'vuex'

export default {
  name: 'InsuranceClaimModal',
  props: {
    title:{
      type: String,
      default: '商险理赔',
      required: false
    },
    feeTypeOption:{
      type: Array,
      default: ()=>[],
      required: false
    },
  },
  components: {
    UndertakerModal
  },
  data() {
    return {
      model: {},
      visible: false,
      confirmLoading: false,
      disableSet:false, //禁止设置材料截止日期
      dealInfo:[], // 办理记录
      eventFeeDetail: {}, // 费用明细
      remarkFlag:false,
      deadlineForm:this.$form.createForm(this),
      handleRecordForm:this.$form.createForm(this),
      costForm:this.$form.createForm(this),
      serviceModeOption:this.GLOBAL_CONST['emergeServiceModeOption'], // 服务方式
      payMainType:0, // 0 工伤理赔 1商险理赔
      eventType:0, // 0工伤,1非因工,2退工,3仲裁,4诉讼,5监察投诉
      handleVisible: false,
      handleConfirmLoading: false,
      handleForm:this.$form.createForm(this),
      
      validatorRules: {
        lastMaterialSubDate: { rules: [{ required: true, message: '请选择材料上交截止日期!' }] },
        recordingDate: { rules: [{ required: true, message: '请选择记录日期!' }] },
        recordingContent: { rules: [{ required: true, message: '请填写具体的办理流程及结果!' }] },
        serviceMode: { rules: [{ required: true, message: '请选择服务方式!' }] },
        feeHappenTime: { rules: [{ required: true, message: '请选择发生时间!' }] },
        sourceType: { rules: [{ required: true, message: '请选择费用承担方!' }] },
        feeType: { rules: [{ required: true, message: '请选择费用类型!' }] },
        fee: { rules: [{ required: true, message: '请输入金额!' },{pattern:/(^(-)?[1-9]([0-9]{1,9})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^(-)?[0-9]\.[0-9]([0-9])?$)/,message:'请输入正确的金额'}] },
        disabilityLevel:{rules: [{ required: true, message: '请选择伤残等级!' }]}
      },
      url: {
        deadlineUrl:'/hrEmergency/tworkinjuryevent/lastMaterialSubDate', //设置截止日期
        addRecordUrl:'/hrEmergency/tdealinfo', //添加记录
        endInjury:'/hrEmergency/tworkinjuryevent/end/', //办结
      },
      disableEnd:false, // 商险办理状态handleInsuranceStatus 0不办理1待办理2办理中3办结 工伤办理状态handleWorkInjuryStatus
      dataCompany:[],
      dataCustomer:[],
      dataSocial:[],
      dataInsurance:[],
    }
  },
  computed: {
    sourceTypeOption: function () { // 费用承担方
      return this.GLOBAL_CONST['emergeSourceTypeOption'].filter(item=>item.value != 1)
    }
  },
  methods: {
    ...mapGetters(["nickname"]),
    changeSourceType(e){
      this.remarkFlag = e==0?true:false
    },
    getServiceMode(val){
      const res = this.serviceModeOption.find(item=>String(item.value) === String(val))
      return res ? res.label : ''
    },
    getHandleStatus(type,record){
      if(type === 0){
        this.disableEnd = (record.handleWorkInjuryStatus == 0 || record.handleWorkInjuryStatus == 3) ? true : false
      }else{
        this.disableEnd = (record.handleInsuranceStatus == 0 || record.handleInsuranceStatus == 3) ? true : false
      }
    },
    getDefaultVal(val){
      return val || []
    },
    edit(record,list,type,eventType){
      this.getHandleStatus(type,record)
      this.payMainType = type
      this.eventType = eventType
      this.model = record
      this.dealInfo = this.getDefaultVal(list.dealInfo)
      if(list.eventFeeDetail){
        this.eventFeeDetail = list.eventFeeDetail
        this.dataCompany = this.getDefaultVal(this.eventFeeDetail.companyBearList)
        this.dataCustomer = this.getDefaultVal(this.eventFeeDetail.customerBearList)
        this.dataSocial = this.getDefaultVal(this.eventFeeDetail.socialBearList)
        this.dataInsurance = this.getDefaultVal(this.eventFeeDetail.insuranceBearList)
      }else{
        this.eventFeeDetail = {}
      }
      
      this.visible = true
     
      let flag = false
      let lastMaterialSubDate = ''
      switch(type){
        case 0:
          flag = record.lastMaterialSubDate
          lastMaterialSubDate = moment(record.lastMaterialSubDate)
          break
        case 1:
          flag = record.lastInsuranceMaterialSubDate
          lastMaterialSubDate = moment(record.lastInsuranceMaterialSubDate)
          break
        case 3:
          flag = record.lastMaterialSubDate
          lastMaterialSubDate = moment(record.lastMaterialSubDate)
          break
      }
      if(flag){
        this.disableSet = true
        this.$nextTick(() => {
          this.deadlineForm.setFieldsValue(pick({lastMaterialSubDate:lastMaterialSubDate}, 'lastMaterialSubDate'))
        })
      }else{
        this.disableSet = false
      }
    },
    //设置截止时间
    submitDeadline(){
      this.deadlineForm.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const lastMaterialSubDate = moment(values.lastMaterialSubDate).format("YYYY-MM-DD")
          let url = ''
          if(this.payMainType === 0){
            url += `${this.url.deadlineUrl}?id=${this.model.id}&lastMaterialSubDate=${lastMaterialSubDate}`
          }else{
            url += `${this.url.deadlineUrl}?id=${this.model.id}&lastInsuranceMaterialSubDate=${lastMaterialSubDate}`
          }
          httpAction(url,null,'post').then((res) => {
            if(res.code == 200 ){
              this.disableSet = true
              this.$message.success('设置成功！')
              this.$emit('ok')
            }else{
              this.$message.warning(res.msg)
            }
          }).finally(()=>{
            this.confirmLoading = false
          })
        }
      })
    },
    //添加办理记录
    submitHandleRecord(){
      this.handleRecordForm.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const params = {
            payMainType:this.payMainType, // 0工伤理赔 1商险理赔
            recordingDate:moment(values.recordingDate).format("YYYY-MM-DD HH:mm:ss"),
            recordingContent:values.recordingContent,
            serviceMode:values.serviceMode
          }
          switch(this.eventType){
            case 0:
              params.workInjuryId = this.model.id
              break
            case 1:
              params.nonWorkId = this.model.id
              break
            case 2:
              params.retiredWorkId = this.model.id
              break
            case 3:
              params.arbitrationId = this.model.id
              break
            case 4:
              params.litigationId = this.model.id
              break
            case 5:
              params.complaintId = this.model.id
              break
          }
          httpAction(this.url.addRecordUrl,params,'post').then((res)=>{
            if(res.code == 200 ){
              this.$message.success('保存成功')
              this.handleRecordForm.resetFields()
              console.log('object');
              this.dealInfo.unshift({
                recordingUserName:this.nickname(),
                recordingContent:values.recordingContent,
                serviceMode:values.serviceMode,
                recordingDate:moment(values.recordingDate).format("YYYY-MM-DD")
              })
            }else{
              this.$message.error(res.msg)
            }
          }).finally(()=>{
            this.confirmLoading = false
          })
        }
      })
    },
    //提交处理费用
    submitCostRecord(){
      const _this = this
      this.costForm.validateFields((err, values) => {
        if(!err){
          _this.confirmLoading = true
          const params = {
            eventType:_this.eventType,
            feeHappenTime:moment(values.feeHappenTime).format("YYYY-MM-DD HH:mm:ss"),
            eventTime: _this.model.eventOccurrenceTime,
            eventCode:_this.model.eventCode,
            payMainType:_this.payMainType,
            recordType:0,
            eventId:_this.model.id,
            fee:values.fee,
            feeType:values.feeType,
            sourceType:values.sourceType,
            remark:values.remark,
          }
          httpAction(`/hrEmergency/teventfeedetail/saveWithEvent`,params,'post').then((res)=>{
            if(res.code == 200){
              _this.$message.success('保存成功')
              _this.remarkFlag = false
              _this.eventFeeDetail.total = _this.caculate(_this.eventFeeDetail.total,values.fee)
              _this.costForm.resetFields()
              switch(values.sourceType){
                case '0':
                  _this.dataCompany = _this.handleArr('companyBearList',res.data)
                  _this.eventFeeDetail.companyTotal = _this.caculate(_this.eventFeeDetail.companyTotal,values.fee)
                  break
                case '2':
                  _this.dataSocial = _this.handleArr('socialBearList',res.data)
                  _this.eventFeeDetail.socialTotal = _this.caculate(_this.eventFeeDetail.socialTotal,values.fee)
                  break
                case '3':
                  _this.dataInsurance = _this.handleArr('insuranceBearList',res.data)
                  _this.eventFeeDetail.insuranceTotal = _this.caculate(_this.eventFeeDetail.insuranceTotal,values.fee)
                  break
              }
            }else{
              _this.$message.error(res.msg)
              
            }
          }).finally(()=>{
            _this.confirmLoading = false
          })
        }
      })
    },
    handleArr(field,obj){
      let arr = []
      if(this.eventFeeDetail[field]){
        arr = [obj,...this.eventFeeDetail[field]]
      }else{
        arr.push(obj)
      }
      this.eventFeeDetail[field] = arr
      return arr
    },
    caculate(a,b){
      return Math.round((parseFloat(a||0) + parseFloat(b)) * 100)/100
    },
    // 完成理赔
    handleStatus(){
      this.handleVisible = true
    },
    handleSucess(){
      this.handleForm.validateFields((err, values) => {
        if (!err) {
          this.handleConfirmLoading = true
          // 0工伤理赔1商险理赔
          httpAction(`${this.url.endInjury}${this.payMainType}/${this.model.id}?disabilityLevel=${values.disabilityLevel || ''}`,null,'post').then((res)=>{
            if(res.code == 200){
              this.$message.success('操作成功')
              this.cancelEvent()
              this.handleCancel()
            }else{
              this.$message.error(res.msg)
            }
          }).finally(()=>{
            this.handleConfirmLoading = false
          })
        }
      })
    },
    
    cancelEvent(){
      this.handleConfirmLoading = this.handleVisible = false
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('ok')
      this.visible = false
      this.disableSet=false
      this.disableEnd=false
      this.dealInfo = []
      this.eventFeeDetail = {}
      this.costForm.resetFields()
      this.deadlineForm.resetFields()
      this.handleRecordForm.resetFields()
      this.dataCompany = []
      this.dataCustomer = []
      this.dataSocial = []
      this.dataInsurance = []
      this.remarkFlag = false
    },
    disabledDeadlineDate(current){ //获取今天之前的时间
      return current < moment().startOf('day');
    },
    disabledRecordDate(current){
      return current > moment().endOf('day');
    },
  }
}
</script>
  
<style lang="less" scoped>
.save{
  margin-right: 10px;
  width: 88px;
}
.lineTitle{
  font-size: 15px;
  color: #000000d9;
  background-color: #f2f2f2;
  line-height: 41px;
  margin: 15px 0px 10px;
  padding-left: 10px;
}
.addRecord{
  float: right;
  margin-right: 35px;
}
.border{
  border: 1px solid #f2f2f2;
  overflow: hidden;
  padding:0px 20px 10px;
}
.handleEvent{
  color: #000000;
  border-bottom: 1px solid #f2f2f2;
  margin: 10px 0px 15px;
  padding-bottom: 7px;
  width: 95%;
}
.timeLine{
  height: 270px;
  overflow-y: scroll;
  p{
    margin: 0px;
  }
}
.stepFormText {
  :global(.ant-form-item-label) {
    width: 90px;
  }
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}

</style>

