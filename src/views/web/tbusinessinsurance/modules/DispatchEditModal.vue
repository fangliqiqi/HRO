<template>
  <a-modal
    :title="title"
    :width="1200"
    placement="right"
    :closable="true"
    :footer="null"
    @cancel="handleCancel"
    cancelText="关闭"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-tabs
        :defaultActiveKey="defaultActiveKey"
        @change="tabChange"
      >
        <a-tab-pane
          tab="基本信息"
          key="0"
        >
          <a-form
            :form="empForm"
            layout="inline"
          >
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item label="姓名">{{ employeeInfo.empName }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="性别">{{ employeeInfo.empSex || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="身份证号">{{ employeeInfo.empIdcard }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="身份证有效期">{{ employeeInfo.empIdcardValidity || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="联系方式">{{ employeeInfo.empPhone }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="年龄">{{ employeeInfo.empAge || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="出生日期">{{ employeeInfo.empBirthday || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="婚姻状况">{{ employeeInfo.empMarriStatu || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="民族">{{ employeeInfo.empNational || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="政治面貌">{{ employeeInfo.politicalStatus || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="E-Mail">{{ employeeInfo.empEmail || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="QQ">{{ employeeInfo.empQq || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="员工类型">{{ employeeInfo.empType }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="结算主体">{{ employeeInfo.settleDomainName || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="所属单位">{{ employeeInfo.belongUnitName || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="就职班组">{{ employeeInfo.inauguralTeam || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="就职岗位">{{ employeeInfo.post || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="电信编号">{{ employeeInfo.telecomNumber || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="户口性质">{{ employeeInfo.empRegisType || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="员工标签">{{ employeeInfo.empLabel || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="开户行">{{ employeeInfo.empBankName || '--' }}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="银行卡号">{{ employeeInfo.empBankNo || '--' }}</a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="备注">{{ employeeInfo.remark || '--' }}</a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="身份证地址">{{ employeeInfo.idcardAddr }}</a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="档案所在地">{{ employeeInfo.fileAddr }}</a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane
          tab="商险信息"
          key="1"
        >
          <a-form
            :form="form"
            layout="inline"
            class="ant-advanced-search-form"
            style="text-align: left;margin-bottom:0px;"
          >
            <a-row :gutter="24">
              <a-col :span="5">
                <a-form-item label="保险公司">
                  <a-select
                    showSearch
                    optionFilterProp="children"
                    placeholder="请选择保险公司"
                    v-decorator="['insuranceCompany', validatorRules.insuranceCompany]"
                    @search="handleSearchInsuranceCompany"
                    @change="handleIdInsuranceCompanyChange"
                    style="width: 200px"
                  >
                    <a-select-option
                      v-for="(item, index) in insuranceCompanyBelongs"
                      :key="index"
                      :value="item.id"
                    >{{ item.companyName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="险 种">
                  <a-select
                    showSearch
                    optionFilterProp="children"
                    placeholder="请选择险种"
                    v-decorator="['insuranceType', validatorRules.insuranceType]"
                    style="width: 200px"
                  >
                    <a-select-option
                      v-for="(item, index) in insuranceTypeNames"
                      :key="index"
                      :value="item.id"
                    >{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="购买金额">
                  <a-input
                    placeholder="请选择购买金额"
                    v-decorator="['buyStandard', validatorRules.buyStandard]"
                    style="width: 200px"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="5">
                <a-form-item label="保单开始日期">
                  <a-date-picker
                    :disabledDate="disabledStartDate"
                    format="YYYY-MM-DD"
                    v-decorator="['policyStart', validatorRules.policyStart]"
                    placeholder="选择日期"
                    @openChange="handleStartOpenChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="保单结束日期">
                  <a-date-picker
                    :disabledDate="disabledEndDate"
                    format="YYYY-MM-DD"
                    placeholder="选择日期"
                    v-decorator="['policyEnd', validatorRules.policyEnd]"
                    :open="endOpen"
                    @openChange="handleEndOpenChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="保单生效时间">
                  <a-date-picker
                    format="YYYY-MM-DD"
                    :disabled="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="替换日期">
                  <a-date-picker
                    format="YYYY-MM-DD"
                    placeholder="选择日期"
                    :disabled="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label="替换状态">
                  <a-select
                    style="width: 180px"
                    placeholder="请选择替换状态"
                    :disabled="true"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="5">
                <a-form-item label="实际保费">
                  <a-input
                    placeholder="请输入实际保费"
                    v-decorator="['buyPay', validatorRules.buyPay]"
                    style="width: 200px"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="身故或残疾金额">
                  <a-input
                    placeholder="请输入身故或残疾金额"
                    v-decorator="['deathDisabilityMoney', validatorRules.deathDisabilityMoney]"
                    style="width: 200px"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="医疗额度">
                  <a-input
                    placeholder="请输入医疗额度"
                    v-decorator="['medicalMoney', validatorRules.medicalMoney]"
                    style="width: 200px"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="保单号">
                  <a-input
                    placeholder="请输入保单号"
                    style="width: 200px"
                    v-decorator="['policyNo']"
                    :disabled="true"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="5">
                <a-form-item label="结算类型">
                  <a-select
                    showSearch
                    optionFilterProp="children"
                    placeholder="请选择结算类型"
                    v-decorator="['settleType', validatorRules.settleType]"
                    style="width: 200px"
                  >
                    <a-select-option
                      v-for="(item, index) in settleTypeOptions"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="结算主体">
                  <a-select
                    showSearch
                    optionFilterProp="children"
                    placeholder="请选择结算主体查询"
                    v-decorator="['settlementOrgan',{rules: [{ required: true, message: '请选择结算主体!' }]}]"
                    :disabled="true"
                    style="width: 200px"
                  >
                    <a-select-option
                      v-for="(value, key) in settleDomainBelongs"
                      :key="key"
                      :value="value.id"
                    >{{ value.departName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="结算月份">
                  <a-month-picker
                    format="YYYYMM"
                    placeholder="选择日期"
                    v-decorator="['settleMonth', validatorRules.settleMonth]"
                    style="width: 200px"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="发票号">
                  <a-input
                    placeholder="请输入发票号"
                    style="width: 200px"
                    v-decorator="['invoiceNo']"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="5">
                <a-form-item label="购买月数">
                  <a-input-number
                    :min="1"
                    :max="12"
                    placeholder="请输入购买月数"
                    style="width: 200px"
                    v-decorator="['buyMonth',validatorRules.buyMonth]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="商险购买地">
                  <a-select
                    showSearch
                    placeholder="选择省份"
                    optionFilterProp="children"
                    style="width: 200px"
                    v-decorator="['businessInsuranceProvId', validatorRules.businessInsuranceProvId]"
                    @change="handleIdProvinceChange"
                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                  >
                    <a-select-option
                      v-for="(item, index) in idAreaTrees"
                      :key="index"
                      :value="String(item.id)"
                    >{{ item.areaName }}</a-select-option>
                  </a-select>
                </a-form-item>

              </a-col>
              <a-col :span="5">
                <a-form-item label=" " class="city">
                  <a-select
                    showSearch
                    placeholder="选择城市"
                    optionFilterProp="children"
                    style="width: 200px"
                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                    v-decorator="['businessInsuranceAddrId',validatorRules.businessInsuranceAddrId]"
                  >
                    <a-select-option
                      v-for="(item, index) in idAreaCitys"
                      :key="index"
                      :value="String(item.id)"
                    >{{ item.areaName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="10">
                <a-form-item label="备注">
                  <a-textarea
                    cols="120"
                    rows="3"
                    style="resize:none"
                    placeholder="请输入备注"
                    v-decorator="['remark']"
                  ></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item style="float:right;margin:0px;">
                  <a-button
                    type="primary"
                    html-type="submit"
                    style="margin:0px;"
                    @click="submitDispatchApply"
                  >
                    保存
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane
          tab="附件信息"
          key="2"
        >
          <a-row style="text-align:left;">
            <a-col :span="24">
              <a-upload-dragger
                name="file"
                :multiple="true"
                :fileList="fileList"
                :beforeUpload="beforeUpload"
                :remove="removeFile"
                @change="handleChange"
                accept="image/*,.xls,.xlsx,.csv,.pdf"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">点击或者拖拽上传</p>
              </a-upload-dragger>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>

    </a-spin>
  </a-modal>
</template>

<script>
import Vue from 'vue'
import { httpAction,postActionHeader } from '@/api/manage'
import { getAreaName } from '@/utils/common'
import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  name: 'DispatchEditModal',
  components: {
    
  },
  data() {
    return {
      title: '编辑',
      model: {},
      form: this.$form.createForm(this),
      empForm: this.$form.createForm(this),
      confirmLoading: false,
      dateFormat: 'YYYY-MM-DD',
      visible: false,
      baseInfo: true,
      attachInfo: true,
      isUpload:true,
      defaultActiveKey:'1',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      settleDomainBelongs:[],//结算主体
      employeeInfo:{}, //员工信息
      sexOptions:[], //性别
      empMarriOptions:[],
      empNationalOptions:[],
      politicalOptions:[],
      empTypeOptions:[],
      empRegisTypeOptions:[],
      employeeLableOptions:[],
      fileList:[],
      insuranceCompanyBelongs:[],//保险公司列表
      insuranceTypeNames:[],//险种
      settleTypeOptions:[],//结算类型
      idAreaTrees: [],
      idAreaCitys: [], 
      endOpen: false,
      validatorRules: {
        insuranceCompany: { rules: [{ required: true, message: '请选择保险公司!' }] },
        insuranceType: { rules: [{ required: true, message: '请选择险种!' }] },
        buyStandard: { rules: [{ required: true,message:'请输入购买标准' },{validator: (rule,value, callback)=>{
          if(value){
            if( ! /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(value) || value < 0.01 ){
              callback('购买标准格式不正确!')
            }
          }
          callback()
        }}] },
        policyStart: { rules: [{ required: true, message: '请选择保单开始时间!' }] },
        policyEnd: { rules: [{ required: true, message: '请选择保单结束时间!' }] },
        buyMonth: { rules: [{ required: true, message: '请输入购买月数!' },{ pattern: /^([1-9]|11|12|10)$/, message: '请输入正确的购买月数!' }] },
        buyPay: { rules: [{validator: (rule,value, callback)=>{
          if(value){
            if( ! /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(value) || value < 0.01){
              callback('实际保费格式不正确')
            }
          }
          callback()
        }}] },
        deathDisabilityMoney: { rules: [{ required: true, message: '请输入身故或残疾金额' },{validator: (rule,value, callback)=>{
          if(value){
            if( ! /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(value) || value < 0.01 ){
              callback('身故或残疾金额格式不正确!')
            }
          }
          callback()
        }}] },
        medicalMoney: { rules: [{ required: true, message: '请输入医疗额度' },{validator: (rule,value, callback)=>{
          if(value){
            if( ! /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(value) || value < 0.01 ){
              callback('医疗额度格式不正确!')
            }
          }
          callback()
        }}]},
        settleMonth: { rules: [{ required: true, message: '请选择结算月份!' }] },
        settleType: { rules: [{ required: true, message: '请选择结算类型!' }] },
        businessInsuranceProvId: { rules: [{ required: true, message: '请选择省份!' }] },
        businessInsuranceAddrId: { rules: [{ required: true, message: '请选择市!' }] },
      },
      url: {
        getinfo: '/hrBase/temployeeinfo/', //根据员工ID查询员工信息
        insuranceCompanyInfo:'/busiInsurance/tinsurancecompany/page', //获取保险公司列表
        insuranceType:'/busiInsurance/tinsurancetype/page/', //根据保险公司选择险种
        importUrl:'/busiInsurance/tinsuranceatta/upload', //上传文件
        getAttach:'/busiInsurance/tinsuranceatta/geteAttaById/',
        delAttachUrl:'/busiInsurance/tinsuranceatta/',
        editUrl:'/busiInsurance/tbusinessinsurance'
      }
    }
  },
  created(){
    this.idAreaTrees = Vue.ls.get('glob_area')
  },
  methods: {
    moment,
    edit(record){
      this.initDictConfig()
      this.visible = true
      this.model = Object.assign({}, record)
      this.insuranceCompanyBelongs.push({
        id:record.insuranceCompany,
        companyName:record.insuranceCompanyName
      })
      this.insuranceTypeNames.push({
        id:record.insuranceType,
        name:record.insuranceTypeName,
      })
      this.model.policyStart = moment(this.model.policyStart)
      this.model.policyEnd = moment(this.model.policyEnd)
      this.model.settleMonth = moment(this.model.settleMonth, ["YYYYMM"])
      if(this.model.businessInsuranceProvId){
        // this.model.businessInsuranceProvId *= 1
        this.idAreaCitys = this.idAreaTrees[this.model.businessInsuranceProvId - 1].children
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'buyStandard','buyPay','insuranceCompany','settleType',
        'deathDisabilityMoney','insuranceCompany','medicalMoney','policyEnd','policyStart','settleMonth','policyNo',
        'settlementOrgan','insuranceType','invoiceNo','remark','businessInsuranceProvId','businessInsuranceAddrId','buyMonth'))
      })
    },
    handleIdProvinceChange(value) {
      this.idAreaCitys = []
      for (var c of this.idAreaTrees[value - 1].children) {
        this.idAreaCitys.push(c)
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({businessInsuranceAddrId:String(this.idAreaCitys[0].id)}, 'businessInsuranceAddrId'))
      })
    },
    tabChange(key){
      if(key == 0 && this.baseInfo){
        httpAction(this.url.getinfo+this.model.empId,null,'get').then((res)=>{
          if(res.code == 200){
            this.employeeInfo = res.data
            this.employeeInfo.empSex = filterDictText(this.sexOptions, this.employeeInfo.empSex)
            this.employeeInfo.empMarriStatu = filterDictText(this.empMarriOptions, this.employeeInfo.empMarriStatu)
            this.employeeInfo.empNational = filterDictText(this.empNationalOptions, this.employeeInfo.empNational)
            this.employeeInfo.politicalStatus = filterDictText(this.politicalOptions, this.employeeInfo.politicalStatus)
            this.employeeInfo.empType = filterDictText(this.empTypeOptions, this.employeeInfo.empType)
            this.employeeInfo.empRegisType = filterDictText(this.empRegisTypeOptions, this.employeeInfo.empRegisType)
            this.employeeInfo.empLabel = filterDictText(this.employeeLableOptions, this.employeeInfo.empLabel)
            this.employeeInfo.idcardAddr = getAreaName(this.employeeInfo.idProvince,this.employeeInfo.idCity,this.employeeInfo.idTown,'-') +' '+ (this.employeeInfo.idcardAddr || '--')
            this.employeeInfo.fileAddr = getAreaName(this.employeeInfo.fileProvince,this.employeeInfo.fileCity,this.employeeInfo.fileTown,'-') +' '+ (this.employeeInfo.fileAddr || '--')
            if(this.settleDomainBelongs[this.employeeInfo.settleDomain]){
              this.employeeInfo.settleDomainName = this.settleDomainBelongs[this.employeeInfo.settleDomain].departName
              this.employeeInfo.belongUnitName = this.settleDomainBelongs[this.employeeInfo.settleDomain].customerName
            }
          }
          this.baseInfo = false
        })
      }
      if(key == 2 && this.attachInfo){
        this.fileList = []
        httpAction(this.url.getAttach+this.model.id+'?policyType=0',null,'get').then((res)=>{
          if(res.code == 200 && res.data.length){
            for(let item of res.data){
              this.fileList.push({
                uid:item.id,
                name:item.attaName,
                status:'done',
                url:item.attaUrl,
              })  
            }
          }
          this.attachInfo = false
        })
      }
    },
    submitDispatchApply(){ //提交表单
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          values.policyStart = values.policyStart.format(_this.dateFormat)
          values.policyEnd = values.policyEnd.format(_this.dateFormat)
          values.settleMonth = values.settleMonth.format('YYYYMM')
          let addr = getAreaName(values.businessInsuranceProvId,values.businessInsuranceAddrId).split('-')
          values.businessInsuranceProv = addr[0]
          values.businessInsuranceAddr = addr[1]
          values.id = _this.model.id
          httpAction(_this.url.editUrl, values, 'put').then((res) => {
            if (res.code === 200) {
              _this.$message.success(_this.title + '成功！')
              _this.close()
            } else {
              _this.$message.warning(res.msg)
            }
          }).finally(() => {
            _this.confirmLoading = false
          })
        }
      })
    },

    handleIdInsuranceCompanyChange(value){ //根据保险公司选择险种
      httpAction(this.url.insuranceType+'?companyId='+value, '','GET').then((res) => {
        if(res.code === 200) {
          this.insuranceTypeNames=res.data.records
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({insuranceType:''},'insuranceType'))
          })
        }
      })
    },
    // 搜索保险公司请求
    handleSearchInsuranceCompany(value) {
      if (value) {
        const that = this
        let httpurl = this.url.insuranceCompanyInfo
        let method = 'get'
        httpurl += '?companyName=' + value
        httpAction(httpurl, '', method).then((res) => {
            if (res.code === 200) {
              if  (res.data.records.length > 0) {
                this.insuranceCompanyBelongs = res.data.records
              }
            } else {
              that.$message.warning('接口异常！')
            }
        })
      }
    },
    // 数据字典
    initDictConfig() {
      //结算类型 
      initDictOptions('settlementType').then((res) => {
        if (res.code === 200) {
          this.settleTypeOptions = res.data
        }
      })
      // 员工类型
      initDictOptions('personnel_type').then((res) => {
        if (res.code === 200) {
          this.empTypeOptions = res.data
        }
      })
      // 性别
      initDictOptions('sex').then((res) => {
        if (res.code === 200) {
          this.sexOptions = res.data
        }
      })
      // 婚姻状况
      initDictOptions('marital_status').then((res) => {
        if (res.code === 200) {
          this.empMarriOptions = res.data
        }
      })
      // 民族
      initDictOptions('nation').then((res) => {
        if (res.code === 200) {
          this.empNationalOptions = res.data
        }
      })
      // 政治面貌
      initDictOptions('political_status').then((res) => {
        if (res.code === 200) {
          this.politicalOptions = res.data
        }
      })
      // 户口性质
      initDictOptions('household_nature').then((res) => {
        if (res.code === 200) {
          this.empRegisTypeOptions = res.data
        }
      })
      // 员工标签
      initDictOptions('employee_lable').then((res) => {
        if (res.code === 200) {
          this.employeeLableOptions = res.data
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.baseInfo = true
      this.attachInfo = true
      this.visible = false
      this.fileList = []
      this.insuranceCompanyBelongs = []
      this.defaultActiveKey = '1'
      this.model = {}
      this.$emit('ok')
    },
    
    disabledStartDate (policyStart) {
      const policyEnd = this.form.getFieldValue('policyEnd');
      if (!policyStart || !policyEnd) {
        return policyStart && policyStart < moment().endOf('day')
      }
      return policyStart < moment().endOf('day') || policyStart.valueOf() > policyEnd.valueOf();
    },
    disabledEndDate (policyEnd) {
      const policyStart =  this.form.getFieldValue('policyStart');
      if (!policyEnd || !policyStart) {
        return policyEnd && policyEnd < moment().add(1,'days').valueOf()
      }
      return policyStart.valueOf() > policyEnd.valueOf();
    },
    handleStartOpenChange (open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange (open) {
      this.endOpen = open;
    },
    //上传
    handleChange(file) {
      // const { fileList } = this
      // this.uploadFilesChange(fileList[fileList.length - 1])
      if(this.isUpload) this.uploadFilesChange(file.file)
    },
    beforeUpload() {
      // this.fileList = [...this.fileList, file]
      return false
    },
    uploadFilesChange(file) {
      const _this = this
      const formData = new FormData()
      formData.append('file', file)
      let contextType = { 'Content-Type': 'multipart/form-data' }
      postActionHeader(this.url.importUrl+'?policyType=0&insuranceId='+this.model.id, formData, contextType).then((res) => {
        if(res.code == 200 && res.data){
          let obj = {
            uid:res.data.id,
            name:res.data.attaName,
            url:res.data.attaUrl,
            status: 'done',
          }
          _this.fileList = [..._this.fileList, obj]
          this.$message.success('上传附件成功')
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    removeFile(fileInfo) {
      this.isUpload = false
      const _this = this
      this.$confirm({
        title: '删除',
        content: '确定删除该附件？',
        okText: '确认',
        cancelText: '取消',
        onOk: function() {
          const formData = new FormData()
          httpAction(_this.url.delAttachUrl + fileInfo.uid, formData, 'DELETE').then(res => {
            if (res.code === 200) {
              _this.fileList.map((file, index) => {
                if (file.uid == fileInfo.uid) {
                  //删除该附件
                  _this.fileList.splice(index, 1)
                  return
                }
              })
              _this.$message.success('删除附件成功！')
            } else {
              _this.$message.warning(res.msg)
            }
          }).finally(()=>{
            _this.isUpload = true
          })
        }
      })
      return false
    },
  }
}

</script>

<style lang="less" scoped>
.ant-advanced-search-form {
  padding: 0px 0px 20px 0px;
}
.ant-advanced-search-form .ant-form-item {
  margin-bottom: 15px;
}
.city {
  :global(.ant-form-item-required) {
    width: 30px;
    color: #fff;
  }
}
</style>