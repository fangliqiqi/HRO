<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    @ok="handleOk"
    @cancel="handleCancel"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">关闭</a-button>
      <a-button key="save" type="primary" :loading="confirmLoading" @click="handleOk">保存</a-button>
      <a-button v-if="type != 5" key="submit" type="primary" :loading="confirmLoading" @click="saveSubmit">直接提交</a-button>
    </template>
    <a-spin :spinning="confirmLoading" :tip="tipTxt">
      <div style="height:560px;">
        <happy-scroll
          color="rgba(23, 22, 22, 0.68)"
          size="5"
          bigger-move-h="end"
          resize
          hide-horizontal
        >
          <a-form :form="form" layout="inline" class="ant-advanced-search-form">
            <a-alert message="适用于业务中无实质合同签订的情况" type="warning" show-icon v-if="type == 5" style="width:94%;margin-bottom:10px;"/>
            <div class="sectionTitle"><span style="font-weight: bold;margin-right:10px;">合同基本信息</span>
              <a-tag color="blue" class="tagDiv">{{ typeTitle[type] }}</a-tag>
            </div>
            <a-row>
              <a-col :span="24" v-if="type != 1 && type != 4 && type != 5">
                <a-form-item
                  class="stepFormText"
                  label="关联合同">
                  <a-input
                    placeholder="点击选择关联合同"
                    style="width: 760px;cursor: pointer;"
                    :readOnly="true"
                    @click="selectContract"
                    v-decorator="['parentContractName', validatorRules.parentContractId]"
                  />
                  <a-input type="hidden" v-decorator="['parentContractId']" />
                  <a-input type="hidden" v-decorator="['contractCode']" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  class="stepFormText"
                  label="合同名称">
                  <a-input
                    placeholder="请输入合同名称"
                    style="width: 760px"
                    v-decorator="['contractName', validatorRules.contractName]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="type != 5">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="CRM合同编号">
                  <a-input
                    placeholder="请输入CRM合同编号"
                    style="width: 270px"
                    v-decorator="['crmNo', validatorRules.crmNo]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="合同起止日期"
                  :validate-status="validateDateStatus"
                  :help="helpText">
                  <a-space :size="12">
                    <a-date-picker
                      :disabledDate="disabledStartDate"
                      :allowClear="false"
                      :format="format"
                      style="width: 130px;"
                      placeholder="开始日期"
                      @openChange="handleStartOpenChange"
                      @change="startDatePick"
                      :getCalendarContainer="triggerNode => triggerNode.parentNode"
                      v-decorator="[ 'startDate', validatorRules.startDate]"
                    />
                    <a-date-picker
                      :disabledDate="disabledEndDate"
                      :allowClear="false"
                      :format="format"
                      style="width: 130px;"
                      placeholder="结束日期"
                      :open="endOpen"
                      :getCalendarContainer="triggerNode => triggerNode.parentNode"
                      @openChange="handleEndOpenChange"
                      @change="endDatePick"
                      v-decorator="[ 'endDate', validatorRules.endDate]"
                    />
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="客户单位">
                  <select-page
                    placeholder="请选择客户单位"
                    style="width: 270px;position:relative;"
                    v-decorator="['customerId', validatorRules.customerId]"
                    :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                    :title="'customerName'"
                    @select="handleSelect"
                    :allowClear="false"
                    :resList="resList"
                    :disabled="disableSelect"
                    :id="'id'"
                  ></select-page>
                </a-form-item>
                <a-form-item
                  v-if="type != 5"
                  class="stepFormText"
                  style="margin-left:150px">
                  <a-radio-group v-decorator="['serviceSide', validatorRules.serviceSide]">
                    <a-radio value="1">甲方</a-radio>
                    <a-radio value="2">乙方</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="type != 5">
                <a-form-item
                  class="stepFormText"
                  label="商务主体">
                  <a-select
                    showSearch
                    placeholder="请选择商务主体"
                    optionFilterProp="children"
                    style="width: 270px"
                    @change="businessSubjectChange"
                    :dropdownMatchSelectWidth="false"
                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                    v-decorator="['businessSubject', validatorRules.businessSubject ]"
                  >
                    <a-select-option
                      v-for="(item, index) in businessOrgans"
                      :key="index"
                      :value="String(item.id)"
                    >{{ item.organName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-if="type != 5">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="是否老客户">
                  <a-radio-group v-decorator="['oldCustomerFlag', validatorRules.oldCustomerFlag]">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="0">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <!-- <a-col :span="12" v-if="type==0||type==2">
                <a-form-item
                  class="stepFormText"
                  label="是否续签">
                  <a-radio-group v-decorator="['signingStatus', validatorRules.signingStatus]" @change="changeSigningStatus">
                    <a-radio value="0">续签</a-radio>
                    <a-radio value="2">重签</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col> -->
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="用章类型">
                  <a-checkbox-group v-decorator="['chapterType', validatorRules.chapterType ]">
                    <a-checkbox value="1">合同章</a-checkbox>
                    <a-checkbox value="2">法人章</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="type != 5">
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="客户先行盖章">
                  <a-radio-group
                    v-decorator="['chapterCustomerPre', validatorRules.chapterCustomerPre]"
                  >
                    <a-radio value="1">是</a-radio>
                    <a-radio value="0">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="是否外带">
                  <a-radio-group v-decorator="['outWithFlag', validatorRules.outWithFlag]">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="0">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  class="stepFormText"
                  label="用章单位">
                  <a-radio-group v-decorator="['chapterUnit', validatorRules.chapterUnit]">
                    <a-radio
                      v-for="(item,index) in chapterUnitDicts"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <div class="sectionTitle" v-if="type != 5" style="font-weight: bold;">业务信息</div>
            <a-row v-if="type != 5">
              <a-col :span="24">
                <a-form-item
                  class="stepFormText"
                  label="合同模板">
                  <a-radio-group v-decorator="['contractTemplate', validatorRules.contractTemplate]">
                    <a-radio value="1">公司模板无修改</a-radio>
                    <a-radio value="2">公司模板有修改</a-radio>
                    <a-radio value="3">客户指定</a-radio>
                    <a-radio value="4">其他模板</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item
                  class="stepFormText"
                  label="业务类别">
                  <a-select
                    showSearch
                    placeholder="请选择业务类型"
                    optionFilterProp="children"
                    @change="changeBusinessType"
                    style="width: 270px"
                    v-decorator="['businessType', validatorRules.businessType]"
                  >
                    <a-select-option
                      v-for="(item, index) in customerBusinessTypeDict"
                      :key="index"
                      :value="String(item.id)"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  class="stepFormText"
                  label="">
                  <a-select
                    showSearch
                    placeholder="请选择业务细分"
                    optionFilterProp="children"
                    style="width: 270px"
                    v-decorator="['businessSub', validatorRules.businessSub ]"
                  >
                    <a-select-option
                      v-for="(item, index) in customerBusinessSubTypeDict"
                      :key="index"
                      :value="String(item.id)"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="业务开发人">
                  <a-select
                    showSearch
                    optionFilterProp="children"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['businessDeveloperId', validatorRules.businessDeveloperId]"
                    placeholder="请选择业务开发人"
                    style="width: 270px"
                  >
                    <a-select-option
                      v-for="item in businessDeveloper"
                      :key="item.user_id"
                    >{{ item.nickname }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="开发部门/分公司">
                  <a-select
                    showSearch
                    placeholder="请选择开发部门/分公司"
                    optionFilterProp="children"
                    style="width: 270px"
                    :dropdownMatchSelectWidth="false"
                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                    v-decorator="['businessDeveloperOrgan', validatorRules.businessDeveloperOrgan ]"
                  >
                    <a-select-option
                      v-for="(item, index) in organs"
                      :key="index"
                      :value="item.id"
                    >{{ item.organName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <!-- <a-row v-if="type != 5">
              <a-col :span="24">
                <a-form-item
                  class="stepFormText"
                  label="结算周期">
                  <a-radio-group v-decorator="['settleCycle', validatorRules.settleCycle]">
                    <a-radio value="1">月结</a-radio>
                    <a-radio value="2">季度结</a-radio>
                    <a-radio value="3">半年结</a-radio>
                    <a-radio value="4">年结</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="type != 5">
              <a-col :span="24">
                <a-form-item
                  class="stepFormText"
                  label="结算方式">
                  <a-select
                    showSearch
                    placeholder="请选择费用方式"
                    optionFilterProp="children"
                    style="width: 270px"
                    v-decorator="['settleType',{rules:[{required:true, message: '请选择费用方式' }]}]"
                  >
                    <a-select-option value="1">当月结当月费用</a-select-option>
                    <a-select-option value="2">当月结上月费用</a-select-option>
                    <a-select-option value="3">当月结下月费用</a-select-option>
                    <a-select-option value="4">其他</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row> -->
            <a-row>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="收入预估">
                  <a-input
                    v-decorator="['estimatedIncome',{rules: [{ pattern: /^(([1-9][0-9]{0,10})|(([0]\.\d{1,2}|[1-9][0-9]{0,10}\.\d{1,2}))|0)$/, message: '可计收入预估格式不正确!' },{required:true,message: '请输入可计收入预估（合同期内）' }]}]"
                    style="width: 270px"
                    placeholder="请输入可计收入预估）"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="合同金额">
                  <a-input v-decorator="['money',{rules: [{pattern:/^(([1-9][0-9]{0,10})|(([0]\.\d{1,2}|[1-9][0-9]{0,10}\.\d{1,2}))|0)$/, message: '合同金额格式不正确!' }]}]" style="width: 270px;margin-left: 93px;" placeholder="请输入合同金额" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" v-if="type == 4">
                <a-form-item
                  class="stepFormText"
                  label="预期归档时间">
                  <a-date-picker placeholder="请选择预期归档时间！" v-decorator="['archiveDate',{rules:[{required:true,message:'请选择预期归档时间！'}]}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="服务人数">
                  <a-input-number
                    v-decorator="['servicePeopleNum',{rules:[{pattern:/^[1-9]\d*$/,message:'服务人数必须为正整数！'}]}]"
                    style="width: 270px"
                    placeholder="请输入服务人数"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item
                  class="stepFormText"
                  label="合同要点">
                  <a-textarea
                    v-decorator="['remark', {rules: [{required:remarkRequired,max:500,message:'合同要点最多500个字符!'}]} ]"
                    :placeholder="remarkPlaceholder"
                    style="width: 760px;min-height:120px"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="type != 5">
              <a-col :span="24">
                <a-form-item
                  class="stepFormText requireFile"
                  label="合同附件">
                  <div class="clearfix">
                    <a-upload
                      class="pictureCard"
                      listType="picture-card"
                      :fileList="fileList"
                      @change="handleImport"
                      @preview="handlePreview"
                      :multiple="true"
                      accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx,.xls,.xlsx,.rar,.zip"
                      :remove="handleRemove"
                      :beforeUpload="beforeUpload"
                    >
                      <div v-if="fileList.length < 15" style="display: inline-block;">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">Upload</div>
                      </div>
                    </a-upload>
                    <div style="font-size:12px;color: #f44336;line-height: 20px;" v-if="type==0||type==3">系统无法自动关联原合同的，请同时上传原关联合同双方盖章确认版扫描件</div>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviwCancel">
                      <img alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </happy-scroll>
      </div>
      <select-contract-list-modal
        ref="SelectContractListModalForm"
        @ok="selectCallback"
        @oAOk="relativeOACallBack"></select-contract-list-modal>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, postActionHeader } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import pinyin from 'pinyin'
import SelectPage from '@/components/jeecg/SelectPage'
import SelectContractListModal from './SelectContractListModal'

import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'

export default {
  name: 'CustomerContractModal',
  components: {
    SelectPage,
    SelectContractListModal,
    HappyScroll
  },
  data() {
    return {
      title: '操作',
      visible: false,
      treeData: [],
      industryBelongs: [],
      industrySub: [],
      organs: [],
      // 业务开发人员
      businessDeveloper: [],
      // 城市树，也就是具体地址
      areaTrees: [],
      areaCitys: [],
      areaTowns: [],
      belongAreaCitys: [],
      belongAreaTowns: [],
      model: {},
      fileList: [],
      endOpen: false,
      contractCode: '',
      contractCustomerName: '',
      businessSubjectName: '',
      validateDateStatus: '',
      helpText: '',
      ids: '',
      disabled: true,
      previewVisible: false,
      previewImage: '',
      fileTypeOfOffice: 'xls,xlsx,doc,docx,ppt,pptx',
      confirmLoading: false,
      form: this.$form.createForm(this),
      //数据字典
      customerContractDict: [],
      customerBusinessTypeDict: [],
      customerBusinessSubTypeDict: [],
      chapterUnitDicts: [],
      startDateRage: '',
      endDateRage: '',
      businessDeveloperId:'',
      businessDeveloperOrgan:'',
      validatorRules: {
        parentContractId: { rules: [{ required: true, message: '请选择关联合同!' }] },
        customerId: { rules: [{ required: true, message: '请选择客户单位!' }] },
        customerCode: { rules: [{ required: true, message: '请选填写客户编码!' }] },
        contractName: { rules: [{ required: true, message: '请填写合同名称!' },{max:100,message:'合同名称最多100个字符!'}] },
        contractCode: { rules: [{ required: true, message: '请填写合同编号!' }] },
        businessSubject: { rules: [{ required: true, message: '请选择商务主体!' }] },
        //去除这个选择
        //contractType: { rules: [{ required: true, message: '请选择合同类型!' }] },
        startDate: { rules: [{ required: true, message: '请选择合同日期!' }, { validator: this.startDateValidator }] },
        endDate: { rules: [{ required: true, message: '请选择合同失效时间!' }, { validator: this.endDateValidator }] },
        businessType: { rules: [{ required: true, message: '请选择业务类型!' }] },
        businessSub: { rules: [{ required: true, message: '请选择业务细分!' }] },
        // 新增字段
        contractTemplate: { rules: [{ required: true, message: '请选择合同模板' }] },
        settleCycle: { rules: [{ required: true, message: '请选择结算周期' }] },
        chapterType: { rules: [{ required: true, message: '请选择用章类型' }] },
        chapterUnit: { rules: [{ required: true, message: '请选择用章单位' }] },
        outWithFlag: { rules: [{ required: true, message: '请选择是否外带' }] },
        chapterCustomerPre: { rules: [{ required: true, message: '请选择是否先行盖章' }] },
        signingStatus: { rules: [{ required: true, message: '请选择是否续签' }] },
        oldCustomerFlag: { rules: [{ required: true, message: '请选择是否是老客户' }] },
        serviceSide: { rules: [{ required: true, message: '甲方还是乙方' }] },
        crmNo: { rules: [{ required: true, message: '请输入CRM合同编号' }] },
        businessDeveloperId: { rules: [{ required: true, message: '请选择业务开发人!' }] },
        businessDeveloperOrgan: { rules: [{ required: true, message: '请选择业务部门id!' }] },
        province: { rules: [{ required: true, message: '省份不能为空!' }] },
        city: { rules: [{ required: true, message: '城市不能为空!' }] },
      },
      url: {
        add: '/hrBase/tcustomercontract',
        edit: '/hrBase/tcustomerinfo',
        getCustomerInfo: '/hrBase/tcustomerinfo/',
        importUrl: '/hrBase/fileUpload/ossUploadFile',
        deleteAtta: '/hrBase/mcontractatta/',
        getBusinessSub: '/admin/dict/getByParentId',
        deleteFile: '/hrBase/fileUpload/ossFileDelete/',
      },
      isRemoved:false,
      isUpload: true,
      typeTitle:{'0':'续签','1':'新签','2':'重签','3':'补充协议','4':'先于合同执行','5':'虚拟合同'},
      type:0,
      tipTxt:'',
      resList:[],
      disableSelect:false,
      format:'YYYY-MM-DD',
      contractNumber:'', // OA中的客户合同编码
      remarkRequired:false, // 合同要点是否必填
      remarkPlaceholder:'请输入合同要点', // 合同要点占位文字
      sysUsers:[],
      businessOrgans:[], // 商务主体
    }
  },
  computed: {
    importExcelUrl: function () {
      return this.url.importUrl
    },
  },
  methods: {
    moment,
    add(type) {
      this.type = type
      this.visible = true
      this.disabled = false
      this.model.signingStatus = type // 新签
      this.fileList = []
      this.form.resetFields()
    },
    selectContract(){
      this.$refs.SelectContractListModalForm.initDictConfig()
      this.$refs.SelectContractListModalForm.businessTypeDicts = this.customerBusinessTypeDict
      this.$refs.SelectContractListModalForm.chapterUnitDicts = this.chapterUnitDicts
      this.$refs.SelectContractListModalForm.sysUsers = this.sysUsers
      this.$refs.SelectContractListModalForm.organs = this.organs
      this.$refs.SelectContractListModalForm.show(this.type)
    },
    changeSigningStatus(e){
      this.type = e.target.value
    },
    async getCustomerName(id){
      httpAction(`/hrBase/tcustomerinfo/${id}`, null, 'get').then((res) => {
        if (res.code === 200 && res.data) {
          this.model.customerName = res.data.customerName
          this.resList = [{id:id,title:res.data.customerName}]
        }
      })
    },
    async selectCallback(record){
      this.validateDateStatus = ''
      this.helpText = ''
      // 点击选择了合同
      this.contractNumber = ''
      await this.getCustomerName(record.customerId)
      this.changeBusinessType(record.businessType,0,record.businessSub)
      const values = {
        parentContractName:record.contractName,
        parentContractId:record.id,
        crmNo:record.crmNo,
        customerId:record.customerId,
        businessSubject:record.businessSubject,
        serviceSide:record.serviceSide,
        signingStatus:record.signingStatus,
        oldCustomerFlag:record.oldCustomerFlag,
        chapterType:record.chapterType?record.chapterType.split(','):[],
        chapterUnit:record.chapterUnit,
        chapterCustomerPre:record.chapterCustomerPre,
        outWithFlag:record.outWithFlag,
        contractTemplate:record.contractTemplate,
        businessType:record.businessType,
        businessSub:record.businessSub,
        businessDeveloperId:Number(record.businessDeveloperId)||undefined,
        businessDeveloperOrgan:Number(record.businessDeveloperOrgan)||undefined,
        startDate:moment(record.startDate),
        endDate:moment(record.endDate),
        // settleCycle:record.settleCycle,
        // settleType:record.settleType,
        estimatedIncome:record.estimatedIncome,
        money:record.money,
        contractCode:record.contractCode,
        servicePeopleNum:record.servicePeopleNum,
        remark:record.remark,
      }
      this.$nextTick(() => {
        this.disableSelect = true
        this.remarkPlaceholder = '请输入合同要点'
        this.remarkRequired = false
        if(String(this.type) === '0' || String(this.type) === '3' || String(this.type) === '2'){
          // 选择合同后，判断是否有日期，有日期的时候情况日期提示
          if(values.startDate && values.endDate){
            this.validateDateStatus = ''
            this.helpText = ''
          }
          this.form.setFieldsValue(
            pick(values,'parentContractName','parentContractId','crmNo','businessSubject','startDate','endDate',
            'serviceSide','signingStatus','oldCustomerFlag','chapterType','chapterUnit','remark','contractCode',
            'chapterCustomerPre','outWithFlag','contractTemplate','businessDeveloperId','customerId',
            'businessDeveloperOrgan','estimatedIncome','money','servicePeopleNum'
            )
          )
        }else{
          this.form.setFieldsValue(pick({parentContractName:record.contractName,parentContractId:record.id}, 'parentContractName','parentContractId'))
        }
      })
    },
    // 关联合同，没找到合同，输入了OA合同编号回调
    relativeOACallBack(data){
      this.remarkPlaceholder = '请填写原合同关键信息：客户名称、合同名称、合同起止日期'
      this.remarkRequired = true
      this.form.resetFields()
      this.disableSelect = false
      this.contractNumber = data
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({parentContractName:data,parentContractId:data,crmNo:'续签'}, 'parentContractName','parentContractId','crmNo'))
      })
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
    disabledStartDate(startValue) {
      const endValue = this.form.getFieldValue('endDate')
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.form.getFieldValue('startDate')
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    disabledDate(current) {
      return current && current < moment().endOf('day')
    },
    range(start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    // eslint-disable-next-line no-unused-vars
    changeBusinessType(value,option,businessSub) {
      if(option){
        this.customerBusinessSubTypeDict = this.customerBusinessTypeDict[option.key]['children']
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({businessSub:this.customerBusinessSubTypeDict[0]?String(this.customerBusinessSubTypeDict[0].id):undefined}, 'businessSub'))
        })
      }else{
        const res = this.customerBusinessTypeDict.find(item=>item.id == value)
        if(res){
          this.customerBusinessSubTypeDict = res['children']
        }else{
          this.customerBusinessSubTypeDict = []
        }
        this.$nextTick(() => {
          const res1 = this.customerBusinessSubTypeDict.find(item=>item.id == businessSub)
          this.form.setFieldsValue(pick({businessType:res?value:undefined,businessSub:res1?businessSub:undefined}, 'businessType','businessSub'))
        })
      }
    },
    // eslint-disable-next-line no-unused-vars
    handleSelect(value) {
      this.$nextTick(()=>{
        this.form.setFieldsValue(pick({ customerId: value }, 'customerId'))
      })
      httpAction(this.url.getCustomerInfo + value, null, 'GET').then((res) => {
        if (Number(res.code) === 200) {
          this.model.customerCode = res.data.customerCode
          this.model.customerType = res.data.customerType // 渲染客户类型  必不可少
          let sz = pinyin(res.data.customerName, {
            style: pinyin.STYLE_FIRST_LETTER,
          })
          let ename = ''
          if (sz.length > 0) {
            for (let i of sz) {
              ename += i[0]
            }
          }
          this.contractCustomerName = ename.toUpperCase()
          let businessSubject = this.form.getFieldValue('businessSubject')
          if (businessSubject) {
            this.contractCode = `${this.businessSubjectName}-${this.contractCustomerName}-${new Date().valueOf()}`
            this.model.contractCode = this.contractCode
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'contractCode'))
            })
          }
        }
      })
    },
    // eslint-disable-next-line no-unused-vars
    businessSubjectChange(t, v) {
      this.businessSubjectName = v.componentOptions.children[0].text
      let sz = pinyin(this.businessSubjectName, {
        style: pinyin.STYLE_FIRST_LETTER,
      })
      let ename = ''
      if (sz.length > 0) {
        for (let i of sz) {
          ename += i[0]
        }
      }
      this.businessSubjectName = ename.toUpperCase()
      this.contractCode = `${this.businessSubjectName}-${this.contractCustomerName}-${new Date().valueOf()}`
      this.model.contractCode = this.contractCode
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'contractCode'))
      })
    },
    startDatePick(d) {
      const endDate = this.form.getFieldValue('endDate')
      if (endDate) {
        this.endOpen = false
        // eslint-disable-next-line
        let end = _.cloneDeep(endDate)
        this.model.contractTerm = end.add(1, 'day').diff(d, 'months')
      }
    },
    endDatePick(d) {
      let startDate = this.form.getFieldValue('startDate')
      if (startDate) {
        // eslint-disable-next-line
        let end = _.cloneDeep(d)
        this.model.contractTerm = end.add(1, 'day').diff(startDate, 'months')
      }
    },
    /* 以下是文件上传相关 */
    handlePreviwCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      const fileExt = file.name.replace(/.+\./, '')
      const reg = new RegExp(fileExt, 'gi')
      if (reg.test(this.fileTypeOfOffice)) {
        this.previewVisible = false
        window.open(
          `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url || file.thumbUrl)}`,
          '_blank'
        )
      } else if (/(pdf|zip|rar)/gi.test(fileExt)) {
        window.open(file.url || file.thumbUrl, '_blank')
      } else {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      }
    },
    handleRemove(file) {
      this.isUpload = false
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      const that = this
      httpAction(`${this.url.deleteFile}${file.uid}?type=1`, null, 'GET').then((res) => {
        if (res.code === 200) {
          if(res.data||res.data===null){
            newFileList.splice(index, 1)
            that.fileList = newFileList
            that.$message.success('删除成功！')
          }else{
            that.$message.warning('删除出错，请稍后再试！')
          }
        } else {
          that.$message.warning(res.msg)
        }
        that.isUpload = true
      })
    },
    beforeUpload() {
      return false
    },
    handleImport(file) {
      if(this.isUpload) {
        this.uploadFilesChange(file.file)
      }
    },
    uploadFilesChange(file) {
      const _this = this
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 1)
      _this.confirmLoading = true
      // 暂时不用设置 dodmain,formData.append('domain', this.model.id)
      const contextType = { 'Content-Type': 'multipart/form-data' }
      postActionHeader(this.url.importUrl, formData, contextType,60000).then((res) => {
        if (Number(res.code) === 200 && res.data) {
          _this.fileList = [..._this.fileList, res.data]
          _this.$message.success('上传附件成功')
        } else {
          _this.$message.warning(res.msg)
        }
      }).finally(()=>{
        _this.confirmLoading = false
      })
    },
    saveSubmit(){
      this.handleFields().then((data)=>{
        this.handleSave(data.url,data.params).then((id)=>{
          this.$message.success('保存成功!')
          this.tipTxt = `提交审核中...`
          const url = `/hrBase/tcustomercontract/batch/commit?id=${id}`
          this.confirmLoading = true
          httpAction(url, null, 'POST').then((res) => {
            if (res.code === 200) {
              this.$message.success('提交审核成功!')
            } else {
              this.$message.warning(res.msg)
            }
          }).finally(()=>{
            this.$emit('ok')
            this.close()
            this.confirmLoading = false
          })
        }).catch((error)=>{
          this.$message.warning(error)
        })
      }).catch((error)=>{
        this.$message.warning(error)
      }).finally(()=>{
        this.confirmLoading = false
      })
    },
    // 处理保存
    handleSave(url,params){
      this.tipTxt = `保存中...`
      return new Promise((resolve, reject) => {
        httpAction(url,params, 'POST').then(res=>{
          if(res.code === 200){
            resolve(res.data)
            this.tipTxt = `提交审核中...`
          }else{
            this.$message.warning(res.msg)
            reject()
          }
        })
      })
    },
    // 验证字段
    handleFields(){
      // 直接提交
      const _this = this
      _this.confirmLoading = true
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            _this.ids = ''
            const formData = Object.assign(_this.model, values)
            formData.startDate = formData.startDate ? formData.startDate.format(this.format) : null
            formData.endDate = formData.endDate ? formData.endDate.format(this.format) : null
            if(formData.chapterType){
              formData.chapterType = formData.chapterType.join(',')
            }
            if(String(_this.type) === '4'){
              formData.archiveDate = formData.archiveDate ? formData.archiveDate.format(this.format) : null
            }
            if (_this.fileList && _this.fileList.length > 0) {
              let i = 0
              for (; i < _this.fileList.length-1; i++) {
                _this.ids = `${_this.ids}${_this.fileList[i].uid},`
              }
              _this.ids = `${_this.ids}${_this.fileList[i].uid}`
              let url = ''
              // '0':'续签','1':'新签','2':'重签','3':'补充协议','4':'先于合同执行','5':'虚拟合同'
              switch(String(_this.type)){
                case '5': // 新增虚拟合同信息
                  url = '/hrBase/tcustomercontract/saveVirtual'
                break
                case '0':{
                  // 合同主体续签
                  url = `/hrBase/tcustomercontract/goon?attaIdArray=${_this.ids}`
                  formData.id = formData.parentContractId
                  // goOnOaOldData 是否是续签OA老合同：0是 1不是,默认为1，当填写了OA编码后，该值为0
                  formData.goOnOaOldData = this.contractNumber?'0':'1'
                }
                  break
                case '2':
                  url = `/hrBase/tcustomercontract/goon?attaIdArray=${_this.ids}`
                  formData.id = formData.parentContractId
                  // goOnOaOldData 是否是续签OA老合同：0是 1不是,默认为1，当填写了OA编码后，该值为0
                  formData.goOnOaOldData = this.contractNumber?'0':'1'
                  break
                case '3':{
                  // 补充协议
                  url = `/hrBase/tcustomercontract?attaIdArray=${_this.ids}`
                  // goOnOaOldData 是否是续签OA老合同：0是 1不是,默认为1，当填写了OA编码后，该值为0
                  formData.goOnOaOldData = this.contractNumber?'0':'1'
                }
                  break;
                default:
                  url = `/hrBase/tcustomercontract?attaIdArray=${_this.ids}`
                  break
              }
              resolve({params:formData,url:url})
            }else{
              if(String(_this.type) !== '5'){
                reject('合同附件必须上传！')
              }else{
                resolve({params:formData,url:`/hrBase/tcustomercontract/saveVirtual`})
              }
            }
          }else{
            reject('字段校验不正确!')
          }
        })
      })
    },
    handleOk() {
      const that = this
      this.handleFields().then((data)=>{
        this.handleSave(data.url,data.params).then(()=>{
          const msg = String(this.type) === '5' ? `虚拟合同创建成功！请去合同查询页面中查看` : `${that.title}成功！`
          that.$message.success(msg)
          that.$emit('ok')
          that.close()
        })
      }).catch((error)=>{
        this.$message.warning(error)
      }).finally(()=>{
        this.confirmLoading = false
      })
    },
    startDateValidator(rule, value, callback) {
      if (!value) {
        this.validateDateStatus = 'error'
        this.helpText = '请选择合同开始日期!'
        callback('')
        return false
      }
      this.validateDateStatus = ''
      this.helpText = ''
      callback()
    },
    endDateValidator(rule, value, callback) {
      if (!value) {
        this.validateDateStatus = 'error'
        this.helpText = '请选择合同截止日期!'
        callback('')
        return false
      }
      this.validateDateStatus = ''
      this.helpText = ''
      callback()
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = this.disableSelect = this.confirmLoading = false
      this.treeData = []
      this.industryBelongs = []
      this.customerBusinessSubTypeDict = this.resList = []
      this.validateDateStatus = this.helpText = this.tipTxt = ''
    },
  },
}
</script>

<style lang="less" scoped>

.tagDiv{
  vertical-align: text-bottom;
}
.requireFile{
  :global(.ant-form-item-label > label::before) {
    display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
}
.ant-advanced-search-form .ant-form-item{
  margin-bottom: 14px;
}
.stepFormText {
  :global(.ant-form-item-label) {
    width: 150px;
    text-align: left;
  }
}
.sectionTitle {
  font-size: 18px;
  margin: 0 0 30px;
}
/** Button按钮间距 */

.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

h2{
  font-weight: 700;
  font-size: 18px;
  height: 50px;
}
.pictureCard{
  :global(.ant-upload-list){
    float: left;  
  }
}

</style>
