<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    :closable="false"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  > 
    <template slot="footer">
      <a-button key="back" @click="handleCancel">关闭</a-button>
      <a-button key="save" type="primary" :loading="confirmLoading" @click="handleOk">保存</a-button>
      <a-button v-if="model.signingStatus != 5" key="submit" type="primary" :loading="confirmLoading" @click="saveSubmit">直接提交</a-button>
    </template>
    <div style="height:500px;">
      <happy-scroll
        color="rgba(23, 22, 22, 0.68)"
        size="5"
        resize
        hide-horizontal
      >
        <a-spin :spinning="confirmLoading" :tip="tipTxt">
          <a-form :form="form" layout="inline" class="ant-advanced-search-form">
            <div class="sectionTitle"><span style="font-weight: bold;margin-right:10px;">合同基本信息</span>
              <a-tag color="blue" class="tagDiv">{{ typeTitle[model.signingStatus] }}</a-tag>
            </div>
            <a-row>
              <a-col :span="24" v-if="model.signingStatus == 0 || model.signingStatus == 3 || model.signingStatus == 2">
                <a-form-item
                  class="stepFormText"
                  label="关联合同">
                  <a-input
                    style="width: 760px"
                    v-decorator="['parentContractName']"
                    :disabled="true"
                  />
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
              <a-col :span="12" v-if="type != 5">
                <a-form-item
                  class="stepFormText"
                  label="CRM合同编号">
                  <a-input placeholder="请输入CRM合同编号" style="width: 205px" v-decorator="['crmNo', validatorRules.crmNo]" />
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="type != 5">
                <a-form-item
                  class="stepFormText"
                  label="合同起止日期"
                  :validate-status="validateDateStatus"
                  :help="helpText">
                  <a-space :size="12">
                    <a-date-picker
                      :disabledDate="disabledStartDate"
                      :allowClear="false"
                      format="YYYY-MM-DD"
                      style="width: 140px"
                      placeholder="开始日期"
                      @openChange="handleStartOpenChange"
                      @change="startDatePick"
                      v-decorator="['startDate', validatorRules.startDate]"
                    />
                    <a-date-picker
                      :disabledDate="disabledEndDate"
                      :allowClear="false"
                      format="YYYY-MM-DD"
                      style="width: 140px"
                      placeholder="结束日期"
                      :open="endOpen"
                      @openChange="handleEndOpenChange"
                      @change="endDatePick"
                      v-decorator="['endDate', validatorRules.endDate]"
                    />
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="客户单位"
                  style="margin-bottom:0px;">
                  <a-select
                    style="width: 205px;margin-bottom:0px;"
                    :disabled="disabled"
                    v-decorator="['customerId', validatorRules.customerId]"
                  >
                    <a-select-option :value="model.customerId">{{ model.customerName }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  class="stepFormText"
                  style="margin-left:150px">
                  <a-radio-group v-decorator="['serviceSide', validatorRules.serviceSide]" >
                    <a-radio value="1">甲方</a-radio>
                    <a-radio value="2">乙方</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="商务主体">
                  <a-select
                    showSearch
                    placeholder="请选择商务主体"
                    optionFilterProp="children"
                    :dropdownMatchSelectWidth="false"
                    style="width: 205px"
                    v-decorator="['businessSubject', validatorRules.businessSubject]"
                    @change="selectBusinessSubject"
                  >
                    <a-select-option
                      v-for="(item, index) in businessOrgans"
                      :key="index"
                      :value="String(item.id)">{{
                        item.organName
                      }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
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
              <a-col :span="12" v-if="model.signingStatus==0 || model.signingStatus==2">
                <a-form-item
                  class="stepFormText"
                  label="是否续签">
                  <a-radio-group v-decorator="['signingStatus', validatorRules.signingStatus]" @change="changeSigningStatus" :disabled="true">
                    <a-radio value="0">续签</a-radio>
                    <a-radio value="2">重签</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
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
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="客户先行盖章">
                  <a-radio-group v-decorator="['chapterCustomerPre', validatorRules.chapterCustomerPre]">
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
                      :value="String(item.value)"
                    >{{ item.label }}</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <div class="sectionTitle" style="font-weight:bold;">业务信息</div>
            <a-row>
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
                    style="width: 205px"
                    @change="changeBusinessType"
                    v-decorator="['businessType', validatorRules.businessType]"
                  >
                    <a-select-option
                      v-for="(item, index) in customerBusinessTypeDict"
                      :key="index"
                      :value="String(item.id)">{{
                        item.description
                      }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  class="stepFormText"
                  label="">
                  <a-select
                    showSearch
                    placeholder="请选择业务细分"
                    optionFilterProp="children"
                    style="width: 205px"
                    v-decorator="['businessSub', validatorRules.businessSub]"
                  >
                    <a-select-option
                      v-for="(item, index) in customerBusinessSubTypeDict"
                      :key="index"
                      :value="String(item.id)">{{
                        item.label
                      }}</a-select-option>
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
                    style="width: 205px"
                  >
                    <a-select-option v-for="item in businessDeveloper" :key="item.userId" :value="String(item.user_id)">{{
                      item.nickname
                    }}</a-select-option>
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
                    style="width: 205px"
                    @change="businessSubjectChange"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['businessDeveloperOrgan', validatorRules.businessDeveloperOrgan]"
                  >
                    <a-select-option v-for="(item, index) in organs" :key="index" :value="String(item.id)">{{
                      item.organName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <!-- <a-row>
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
            <a-row>
              <a-col :span="24" >
                <a-form-item
                  class="stepFormText"
                  label="费用方式" >
                  <a-select
                    showSearch
                    placeholder="请选择费用方式"
                    optionFilterProp="children"
                    style="width: 205px"
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
                    style="width: 205px"
                    placeholder="请输入可计收入预估"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  class="stepFormText"
                  label="合同金额">
                  <a-input
                    v-decorator="['money',{rules: [{pattern:/^(([1-9][0-9]{0,10})|(([0]\.\d{1,2}|[1-9][0-9]{0,10}\.\d{1,2}))|0)$/, message: '可计收入预估格式不正确!' }]}]"
                    style="width: 205px"
                    placeholder="请输入合同金额" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" v-if="model.signingStatus == 4">
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
                    style="width: 205px"
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
                    :autoSize="{ minRows: 2, maxRows: 2 }"
                    style="width: 600px;min-height:120px"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item
                  class="stepFormText requireFile"
                  label="合同上传">
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
                      <div v-if="fileList.length < 15" style="display: inline-block">
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
        </a-spin>
      </happy-scroll>
    </div>
  </a-modal>
</template>

<script>
import { httpAction, postActionHeader } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import pinyin from 'pinyin'
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'

export default {
  name: 'CustomerContractEditModal',
  components: { HappyScroll },
  data() {
    return {
      strChildren: 'children',
      title: '操作',
      visible: false,
      treeData: [],
      areaCitys: [],
      areaTowns: [],
      areaTrees: [],
      industryBelongs: [],
      industrySub: [],
      organs: [],
      model: {},
      fileList: [],
      businessDeveloper: [],
      endOpen: false,
      validateDateStatus: '',
      contractCustomerName: '',
      helpText: '',
      tipTxt: '',
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
      dateFormat: 'YYYY-MM-DD',
      isUpload: true,
      typeTitle:{'0':'续签','1':'新签','2':'重签','3':'补充协议','4':'先于合同执行','5':'虚拟合同'},
      validatorRules: {
        customerId: { rules: [{ required: true, message: '请选择所属客户!' }] },
        customerCode: { rules: [{ required: true, message: '请选填写客户编码!' }] },
        contractName: { rules: [{ required: true, message: '请填写合同名称!' }] },
        contractCode: { rules: [{ required: true, message: '请填写合同编号!' }] },
        businessSubject: { rules: [{ required: true, message: '请选择商务主体!' }] },
        startDate: { rules: [{ required: true, message: '请选择合同时间!' }] },
        endDate: { rules: [{ required: true, message: '请选择合同失效时间!' }] },
        businessType: { rules: [{ required: true, message: '请选择业务类型!' }] },
        businessSub: { rules: [{ required: true, message: '请选择业务细分!' }] },
        signingStatus: { rules: [{ required: true, message: '请选择签订类型!' }] },
        chapterType: { rules: [{ required: true, message: '请选择用章类型' }] },
        chapterUnit: { rules: [{ required: true, message: '请选择用章单位' }] },
        outWithFlag: { rules: [{ required: true, message: '请选择是否外带' }] },
        chapterCustomerPre: { rules: [{ required: true, message: '请选择是否先行盖章' }] },
        oldCustomerFlag: { rules: [{ required: true, message: '请选择是否是老客户' }] },
        serviceSide: { rules: [{ required: true, message: '甲方还是乙方' }] },
        crmNo: { rules: [{ required: true, message: '请输入CRM合合同编号' }] },
        businessDeveloperId: { rules: [{ required: true, message: '请选择业务开发人!' }] },
        businessDeveloperOrgan: { rules: [{ required: true, message: '请选择业务部门id!' }] },
        province: { rules: [{ required: true, message: '省份不能为空!' }] },
        city: { rules: [{ required: true, message: '城市不能为空!' }] },
        contractTemplate: { rules: [{ required: true, message: '请选择合同模板' }] },
        settleCycle: { rules: [{ required: true, message: '请选择结算周期' }] },
      },
      url: {
        add: '/hrBase/tcustomercontract',
        edit: '/hrBase/tcustomerinfo',
        getCustomerInfo: '/hrBase/tcustomerinfo/',
        importUrl: '/hrBase/fileUpload/ossUploadFile',
        getOrgan: '/admin/organizationinfo/getOrgForCus',
        deleteAtta: '/hrBase/mcontractatta/',
        getBusinessSub: '/admin/dict/getByParentId',
        deleteFile: '/hrBase/fileUpload/ossFileDelete/',
      },
      businessSubjectName:'',
      type:'',
      remarkRequired:false, // 合同要点是否必填
      remarkPlaceholder:'请输入合同要点', // 合同要点占位文字
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
    add() {
      this.visible = true
      this.disabled = false
    },
    // eslint-disable-next-line
    selectBusinessSubject(val,option){
      this.businessSubjectName = option.componentOptions.children[0].text
    },
    disabledDate(current) {
      return current && current < moment().endOf('day')
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
    // eslint-disable-next-line
    changeBusinessType(value, option) {
      if(!option){
        const arr = this.customerBusinessTypeDict.filter(item=>String(item.id) === value)
        this.customerBusinessSubTypeDict = arr[0] ? arr[0]['children'] : []
      }else{
        this.customerBusinessSubTypeDict = this.customerBusinessTypeDict[option.key]['children']
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({businessSub:this.customerBusinessSubTypeDict[0]?String(this.customerBusinessSubTypeDict[0].id):undefined}, 'businessSub'))
        })
      }
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
    // eslint-disable-next-line no-unused-vars
    treeSelectChange(value, label, extra) {
      httpAction(this.url.getCustomerInfo + value, null, 'GET').then((res) => {
        if (Number(res.code) === 200) {
          this.model.customerCode = res.data.customerCode

          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'customerCode'))
          })
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
      this.contractCode =`${ename.toUpperCase()}-${this.contractCustomerName}-${new Date().valueOf()}`
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
        const end = _.cloneDeep(endDate)
        this.model.contractTerm = end.add(1, 'days').diff(d, 'months')
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'contractTerm'))
        })
      }
    },
    endDatePick(d) {
      const startDate = this.form.getFieldValue('startDate')
      if (startDate) {
        // eslint-disable-next-line
        const end = _.cloneDeep(d)
        this.model.contractTerm = end.add(1, 'days').diff(startDate, 'months')
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'contractTerm'))
        })
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
      // newFileList.splice(index, 1)
      const that = this
      httpAction(this.url.deleteAtta + file.uid, null, 'delete').then((res) => {
        if (res.code === 200) {
          if(res.data){
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
      formData.append('domain', this.model.id)
      const contextType = { 'Content-Type': 'multipart/form-data' }
      postActionHeader(this.url.importUrl, formData, contextType,60000).then((res) => {
        if (Number(res.code) === 200 && res.data) {
          _this.fileList = [..._this.fileList, res.data]
          _this.$message.success('上传附件成功')
        } else {
          _this.$message.warning(res.msg)
        }
      })
    },
    changeSigningStatus(e){
      this.model.signingStatus = e.target.value
    },
    async getContractName(record){
      const _this = this
      if(record.signingStatus === '0' || record.signingStatus === '3' || record.signingStatus === '2'){
        httpAction(`/hrBase/tcustomercontract/${record.parentContractId}`, null, 'get').then((res) => {
          if (res.code === 200 && res.data) {
            _this.model.parentContractName = res.data.contractName
            _this.$nextTick(() => {
              _this.form.setFieldsValue(pick({parentContractName:this.model.parentContractName},'parentContractName'))
            })
          }
        })
      }
    },
    async getCustomerName(id){
      httpAction(`/hrBase/tcustomerinfo/${id}`, null, 'get').then((res) => {
        if (res.code === 200 && res.data) {
          this.model.customerName = res.data.customerName
        }
      })
    },
    getAllBelongs(id){
      const res1 = this.businessOrgans.find(item=>String(item.id) === String(id))
      if(!res1){
        const res = this.organs.find(item=>String(item.id) === String(id))
        if(res){
          this.businessOrgans.push(res)
        }
      }
    },
    /*
     * 合同编辑
     */
    async edit(record,businessOrgans) {
      // eslint-disable-next-line
      this.businessOrgans = _.cloneDeep(businessOrgans)
      this.getAllBelongs(record.businessSubject)

      this.model = Object.assign({}, record)
      this.form.resetFields()
      this.visible = true
      this.disabled = true
      // 判断是否是续签OA老合同：0是 1不是
      if(String(record.goOnOaOldData) === '0'){
        this.model.parentContractName = record.parentContractId || ''
        this.remarkPlaceholder = '请填写原合同关键信息：客户名称、合同名称、合同起止日期'
        this.remarkRequired = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({parentContractName:this.model.parentContractName},'parentContractName'))
        })
      }else {
        this.remarkPlaceholder = '请输入合同要点'
        this.remarkRequired = false
        await this.getContractName(record)
      }
      this.changeBusinessType(this.model.businessType)
      await this.getCustomerName(this.model.customerId)
      
      // 地址相关
      if (this.model.province === null || this.model.city === null || this.model.town === null){
        console.log('normal');
      } else {
        this.model.province = Number(this.model.province)
        this.model.city = Number(this.model.city)
        this.model.town = Number(this.model.town)
        this.areaCitys = this.areaTrees[parseInt(this.model.province, 10) - 1].children
        for (let index = 0; index < this.areaCitys.length; index++) {
          if (this.areaCitys[index].id === this.model.city) {
            this.areaTowns = this.areaCitys[index].children
            break
          }
        }
      }
      // 业务开发人
      this.model.startDate = moment(this.model.startDate, this.dateFormat)
      this.model.endDate = moment(this.model.endDate, this.dateFormat)
      this.model.archiveDate = this.model.archiveDate ? moment(this.model.archiveDate, this.dateFormat) : null
      
      this.businessSubjectName = this.model.businessSubjectName
      this.fileList = this.model.fileList ? this.model.fileList : []
      
      //合同编码
      let sz = pinyin(this.contractCustomerName, {
        style: pinyin.STYLE_FIRST_LETTER,
      })
      let ename = ''
      if (sz.length > 0) {
        for (let i of sz) {
          ename += i[0]
        }
      }
      this.contractCustomerName = ename.toUpperCase()
      this.model.chapterType = this.model.chapterType ? this.model.chapterType.split(',') : []
      this.$nextTick(() => {
        if(String(this.model.signingStatus) === '4'){
          this.form.setFieldsValue(pick({archiveDate:this.model.archiveDate},'archiveDate'))
        }
        this.form.setFieldsValue(
          pick(this.model,
            'customerId',
            'contractName',
            'businessSubject',
            'remark',
            'businessType',
            'estimatedIncome',
            'businessSub',
            'signingStatus',
            // 新增字段的展示，与model进行了绑定
            // 'settleCycle',
            // 'settleType',
            'contractTemplate',
            'crmNo',
            'serviceSide',
            'oldCustomerFlag',
            'chapterType',
            'chapterUnit',
            'chapterCustomerPre',
            'outWithFlag',
            'businessDeveloperId',
            'businessDeveloperOrgan',
            'money',
            'servicePeopleNum',
            'startDate',
            'endDate',
          )
        )
      })
    },
    handleData(){
      const _this = this
      _this.confirmLoading = true
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            const formData = Object.assign(_this.model, values)
            _this.ids = ''
            formData.startDate = formData.startDate ? formData.startDate.format('YYYY-MM-DD') : null
            formData.endDate = formData.endDate ? formData.endDate.format('YYYY-MM-DD') : null
            formData.businessSubjectName = this.businessSubjectName
            formData.chapterType = formData.chapterType.join(',')
            if (_this.fileList.length > 0) {
              for (let i = 0; i < _this.fileList.length; i++) {
                if (i == _this.fileList.length - 1) {
                  _this.ids = `${_this.ids}${_this.fileList[i].uid}`
                } else {
                  _this.ids = `${_this.ids}${_this.fileList[i].uid},`
                }
              }
              formData.prAuditFlag = 3
              delete formData.fileList
              delete formData.settleDomain
              if(formData.archiveDate){
                formData.archiveDate = formData.archiveDate.format('YYYY-MM-DD')
              }
              let url = ''
              switch(String(_this.type)){
                case '5':
                  url = '/hrBase/tcustomercontract/saveVirtual'
                  break
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
          }
        })
      })
    },
    handleSave(url,params){
      this.tipTxt = `保存中...`
      return new Promise((resolve, reject) => {
        httpAction(url,params, 'PUT').then(res=>{
          if(res.code === 200){
            resolve()
            this.tipTxt = `提交审核中...`
          }else{
            this.$message.warning(res.msg)
            reject()
          }
        })
      })
    },
    saveSubmit(){
      this.handleData().then(data=>{
        this.handleSave(data.url,data.params).then(()=>{
          this.$message.success('保存成功!')
          this.tipTxt = `提交审核中...`
          const url = `/hrBase/tcustomercontract/batch/commit?id=${this.model.id}`
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
        })
      }).catch((error)=>{
        this.$message.warning(error)
      }).finally(()=>{
        this.confirmLoading = false
      })
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = Object.assign(that.model, values)
          that.ids = ''
          formData.startDate = formData.startDate ? formData.startDate.format('YYYY-MM-DD') : null
          formData.endDate = formData.endDate ? formData.endDate.format('YYYY-MM-DD') : null
          formData.businessSubjectName = this.businessSubjectName
          formData.chapterType = formData.chapterType.join(',')
          if (that.fileList.length > 0) {
            for (let i = 0; i < that.fileList.length; i++) {
              if (i == that.fileList.length - 1) {
                that.ids = `${that.ids}${that.fileList[i].uid}`
              } else {
                that.ids = `${that.ids}${that.fileList[i].uid},`
              }
            }
          }else{
            that.$message.warning('合同附件必须上传！')
            return false
          }

          let subType = ''
          let urlAdd = that.url.add
          if (this.model.id != null && this.model.id != undefined) {
            subType = 'PUT'
            formData.prAuditFlag = 3
            delete formData.fileList
            delete formData.settleDomain
          } else {
            subType = 'POST'
          }
          urlAdd = `${urlAdd}?attaIdArray=${that.ids}`
          // 判断数据类型
          Object.getOwnPropertyNames(formData).forEach((val) => {
            if (Object.prototype.toString.call(formData[val]) === '[object Number]') {
              if (val !== 'contractTerm' && val !== 'estimatedIncome' && val !== 'oldId') {
                formData[val] = formData[val].toString()
              }
            }
          })
          if(formData.archiveDate){
            formData.archiveDate = formData.archiveDate.format('YYYY-MM-DD')
          }
          that.confirmLoading = true
          httpAction(urlAdd, formData, subType)
            .then((res) => {
              if (res.code === 200) {
                that.$message.success(`${that.title}成功！`)
                that.close()
                that.$emit('ok')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
      this.treeData = []
      this.industryBelongs = []
      this.customerBusinessSubTypeDict = []
      this.businessSubjectName = ''
    },
    // 省市相关的函数
    handleProvinceChange(value) {
      this.areaCitys = []
      this.areaTowns = []
      for (var c of this.areaTrees[value - 1].children) {
        this.areaCitys.push(c)
      }
      this.model.city = this.areaCitys[0].id

      for (var t of this.areaCitys[0].children) {
        this.areaTowns.push(t)
      }
      this.model.town = this.areaTowns[0].id
      this.form.setFieldsValue(pick(this.model, 'province', 'city', 'town'))
    },
    handleCityChange(value) {
      this.areaTowns = []
      for (var c of this.areaCitys) {
        if (c.id === value) {
          if (c.children.length > 0) {
            for (var t of c.children) {
              this.areaTowns.push(t)
            }
          }
        }
      }
      if (this.areaTowns.length > 0) {
        this.model.town = this.areaTowns[0].id
        this.form.setFieldsValue(pick(this.model, 'city', 'town'))
      } else {
        this.model.town = -1
        this.form.setFieldsValue(pick(this.model, 'city', 'town'))
      }
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