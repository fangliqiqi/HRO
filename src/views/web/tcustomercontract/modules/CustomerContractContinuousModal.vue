<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    :closable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="保存"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    wrapClassName="contractModal"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="inline" class="ant-advanced-search-form">
        <div class="sectionTitle">合同基本信息</div>
        <a-row>
          <a-col :span="12">
            <a-form-item class="stepFormText" label="合同名称">
              <a-input
                placeholder="请输入合同名称"
                style="width: 205px"
                v-decorator="['contractName', validatorRules.contractName]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item class="stepFormText" label="CRM合同编号">
              <a-input
                placeholder="请选择CRM合同编号"
                style="width: 205px"
                v-decorator="['crmNo', validatorRules.crmNo]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item class="stepFormText" label="客户单位" style="margin-bottom: 0px">
              <a-select
                style="width: 205px;margin-bottom:0px;"
                :disabled="true"
                v-decorator="['customerId', validatorRules.customerId]"
              >
                <a-select-option :value="model.customerId">{{ model.customerName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item class="stepFormText" style="margin-left: 150px">
              <a-radio-group v-decorator="['serviceSide', validatorRules.serviceSide]">
                <a-radio value="1">甲方</a-radio>
                <a-radio value="2">乙方</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item class="stepFormText" label="商务主体">
              <a-select
                showSearch
                placeholder="请选择商务主体"
                optionFilterProp="children"
                :dropdownMatchSelectWidth="false"
                style="width: 205px"
                v-decorator="['businessSubject', validatorRules.businessSubject ]"
              >
                <a-select-option v-for="(item, index) in businessOrgans" :key="index" :value="(item.id)">{{
                  item.organName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item class="stepFormText" label="合同起止日期">
              <a-space :size="12">
                <a-date-picker
                  :allowClear="false"
                  format="YYYY-MM-DD"
                  style="width: 140px"
                  placeholder="开始日期"
                  v-decorator="[ 'startDate', validatorRules.startDate]"
                />
                <a-date-picker
                  :allowClear="false"
                  format="YYYY-MM-DD"
                  style="width: 140px"
                  placeholder="结束日期"
                  v-decorator="[ 'endDate', validatorRules.endDate]"
                />
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item class="stepFormText" label="是否续签">
              <a-radio-group v-decorator="['signingStatus', validatorRules.signingStatus]" :disabled="true">
                <a-radio value="0">续签</a-radio>
                <a-radio value="1">新签</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item class="stepFormText" label="是否老客户">
              <a-radio-group v-decorator="['oldCustomerFlag', validatorRules.oldCustomerFlag]">
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item class="stepFormText" label="用章类型">
              <!-- <a-radio-group v-decorator="['chapterType', validatorRules.chapterType ]">
                <a-radio value="1">合同章</a-radio>
                <a-radio value="2">法人章</a-radio>
              </a-radio-group> -->
              <a-checkbox-group v-decorator="['chapterType', validatorRules.chapterType ]">
                <a-checkbox value="1">合同章</a-checkbox>
                <a-checkbox value="2">法人章</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item class="stepFormText" label="客户先行盖章">
              <a-radio-group v-decorator="['chapterCustomerPre', validatorRules.chapterCustomerPre]">
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item class="stepFormText" label="是否外带">
              <a-radio-group v-decorator="['outWithFlag', validatorRules.outWithFlag]">
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item class="stepFormText" label="用章单位">
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
        <div class="sectionTitle">业务信息</div>
        <a-row>
          <a-col :span="24">
            <a-form-item class="stepFormText" label="合同模板">
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
            <a-form-item class="stepFormText" label="业务类别">
              <a-select
                showSearch
                placeholder="请选择业务类别"
                optionFilterProp="children"
                @change="changeBusinessType"
                style="width: 205px"
                v-decorator="['businessType', validatorRules.businessType]"
              >
                <a-select-option
                  v-for="(item, index) in customerBusinessTypeDict"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.label }}</a-select-option
                >
              </a-select>
            </a-form-item>
            <a-form-item class="stepFormText" label="">
              <a-select
                showSearch
                placeholder="请选择业务细分"
                optionFilterProp="children"
                style="width: 205px"
                v-decorator="['businessSub', validatorRules.businessSub ]"
              >
                <a-select-option
                  v-for="(item, index) in customerBusinessSubTypeDict"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.label }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item class="stepFormText" label="业务开发人">
              <a-select
                showSearch
                optionFilterProp="children"
                :dropdownMatchSelectWidth="false"
                v-decorator="['businessDeveloperId', validatorRules.businessDeveloperId]"
                placeholder="请选择业务开发人"
                style="width: 205px"
              >
                <a-select-option v-for="item in businessDeveloper" :key="item.user_id" :value="String(item.user_id)">{{
                  item.nickname
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item class="stepFormText" label="开发部门/分公司">
              <a-select
                showSearch
                placeholder="请选择开发部门/分公司"
                optionFilterProp="children"
                style="width: 205px"
                :dropdownMatchSelectWidth="false"
                v-decorator="['businessDeveloperOrgan', validatorRules.businessDeveloperOrgan ]"
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
            <a-form-item class="stepFormText" label="结算周期">
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
          <a-col :span="24">
            <a-form-item class="stepFormText" label="费用方式">
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
            <a-form-item class="stepFormText" label="收入预估">
              <a-input
                v-decorator="['estimatedIncome',{rules: [{ pattern: /^(([1-9][0-9]{0,10})|(([0]\.\d{1,2}|[1-9][0-9]{0,10}\.\d{1,2}))|0)$/, message: '可计收入预估格式不正确!' },{required:true,message: '请输入可计收入预估（合同期内）' }]}]"
                style="width: 205px"
                placeholder="请输入可计收入预估"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item class="stepFormText" label="合同金额">
              <a-input v-decorator="['money',{rules: [{ pattern: /^(([1-9][0-9]{0,10})|(([0]\.\d{1,2}|[1-9][0-9]{0,10}\.\d{1,2}))|0)$/, message: '合同金额格式不正确!' },{required:true,message: '请输入合同金额' }]}]" placeholder="请输入合同金额" style="width: 205px" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item class="stepFormText" label="服务人数">
              <a-input v-decorator="['servicePeopleNum']" style="width: 205px" placeholder="请输入服务人数" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item class="stepFormText" label="合同要点">
              <a-textarea
                v-decorator="['remark']"
                :autoSize="{ minRows: 2, maxRows: 2 }"
                style="width: 600px; min-height: 120px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item class="stepFormText requireFile" label="合同附件">
              <div class="clearfix">
                <a-upload
                  class="pictureCard"
                  listType="picture-card"
                  :fileList="fileList"
                  @change="handleImport"
                  @preview="handlePreview"
                  :multiple="true"
                  accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx,.rar,.zip"
                  :remove="handleRemove"
                  :beforeUpload="beforeUpload"
                >
                  <div v-if="fileList.length < 15" style="display: inline-block;">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviwCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
                <div style="font-size:12px;color: #f44336;line-height: 20px;">系统无法自动关联原合同的，请同时上传原关联合同双方盖章确认版扫描件</div>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item class="stepFormText" label="归档附件" v-if="false">
              <div class="clearfix">
                <a-upload
                  class="pictureCard"
                  listType="picture-card"
                  :fileList="fileArchiveList"
                  @preview="handlePreview"
                  :showUploadList="{ showRemoveIcon: false }"
                  accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx,.rar,.zip"
                ></a-upload>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, postActionHeader } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import pinyin from 'pinyin'

export default {
  name: 'CustomerContractContinuousModal',
  data() {
    return {
      title: '操作',
      visible: false,
      contractNo: '',
      treeData: [],
      industryBelongs: [],
      industrySub: [],
      organs: [],
      businessOrgans: [],
      endOpen: false,
      model: {},
      fileList: [],
      fileArchiveList: [],
      businessDeveloper: [],
      contractCustomerName: '',
      businessSubjectName: '',
      areaTrees: [],
      areaCitys: [],
      areaTowns: [],
      ids: '',
      disabled: true,
      previewVisible: false,
      previewImage: '',
      fileTypeOfOffice: 'xls,xlsx,doc,docx,ppt,pptx',
      validateDateStatus: '',
      helpText: '',
      confirmLoading: false,
      form: this.$form.createForm(this),
      //数据字典
      customerContractDict: [],
      customerBusinessTypeDict: [],
      customerBusinessSubTypeDict: [],
      chapterUnitDicts: [],
      formate: 'YYYY-MM-DD',
      validatorRules: {
        // 新增字段 合同模板 结算周期
        contractTemplate: { rules: [{ required: true, message: '请选择合同模板' }] },
        settleCycle: { rules: [{ required: true, message: '请选择结算周期' }] },
        customerId: { rules: [{ required: true, message: '请选择所属客户!' }] },
        customerCode: { rules: [{ required: true, message: '请选填写客户编码!' }] },
        contractName: { rules: [{ required: true, message: '请填写合同名称!' }] },
        contractCode: { rules: [{ required: true, message: '请填写合同编号!' }] },
        crmNo: { rules: [{ required: true, message: '请填写CRM合同编号!' }] },
        serviceSide: { rules: [{ required: true, message: '请选择服务方!' }] },
        businessDeveloperId: { rules: [{ required: true, message: '请选择业务开发人!' }] },
        businessDeveloperOrgan: { rules: [{ required: true, message: '请选择业务部门!' }] },
        province: { rules: [{ required: true, message: '省份不能为空!' }] },
        city: { rules: [{ required: true, message: '城市不能为空!' }] },
        signingStatus: { rules: [{ required: true, message: '请选择是否续签!' }] },
        oldCustomerFlag: { rules: [{ required: true, message: '请选择是否是老客户' }] },
        chapterType: { rules: [{ required: true, message: '请选择用章类型' }] },
        chapterUnit: { rules: [{ required: true, message: '请选择用章单位' }] },
        outWithFlag: { rules: [{ required: true, message: '请选择是否外带' }] },
        chapterCustomerPre: { rules: [{ required: true, message: '请选择是否先行盖章' }] },
        customerType: { rules: [{ required: true, message: '请选择客户类型' }] },
        businessSubject: { rules: [{ required: true, message: '请选择商务主体!' }] },
        contractType: { rules: [{ required: true, message: '请选择合同类型!' }] },
        startDate: {
          rules: [{ required: true, message: '请选择合同生效时间!' }, { validator: this.startDateValidator }],
        },
        endDate: { rules: [{ required: true, message: '请选择合同失效时间!' }, { validator: this.endDateValidator }] },
        businessType: { rules: [{ required: true, message: '请选择业务类型!' }] },
        businessSub: { rules: [{ required: true, message: '请选择业务细分!' }] },
      },
      url: {
        add: '/hrBase/tcustomercontract/goon',
        edit: '/hrBase/tcustomerinfo',
        getCustomerInfo: '/hrBase/tcustomerinfo/',
        importUrl: '/hrBase/fileUpload/ossUploadFile',
        getOrgan: '/admin/organizationinfo/getOrgForCus',
        deleteAtta: '/hrBase/mcontractatta/',
        contractGoon: '/hrBase/tcustomercontract/goon',
        getBusinessSub: '/admin/dict/getByParentId',
        deleteFile: '/hrBase/fileUpload/ossFileDelete/',
      },
      isUpload: true,
    }
  },
  computed: {
    importExcelUrl: function () {
      return this.url.importUrl
    },
  },

  methods: {
    handleCityChange(value) {
      this.areaTowns = []
      for (const c of this.areaCitys) {
        if (String(c.id) === String(value)) {
          if (c.children.length > 0) {
            for (const t of c.children) {
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

    handleProvinceChange(value) {
      this.areaCitys = []
      this.areaTowns = []
      for (const c of this.areaTrees[value - 1].children) {
        this.areaCitys.push(c)
      }
      this.model.city = this.areaCitys[0].id
      for (var t of this.areaCitys[0].children) {
        this.areaTowns.push(t)
      }
      this.model.town = this.areaTowns[0].id
      this.form.setFieldsValue(pick(this.model, 'province', 'city', 'town'))
    },

    moment,
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

    getPinyin(name) {
      const sz = pinyin(name, {
        style: pinyin.STYLE_FIRST_LETTER,
      })
      let ename = ''
      if (sz.length > 0) {
        for (const i of sz) {
          ename += i[0]
        }
      }
      return ename.toUpperCase()
    },

    // eslint-disable-next-line no-unused-vars
    businessSubjectChange(t, v) {
      this.businessSubjectName = this.getPinyin(v.componentOptions.children[0].text)
      this.contractCustomerName = this.getPinyin(this.contractCustomerName)
      this.contractCode = `${this.businessSubjectName}-${this.contractCustomerName}-${new Date().valueOf()}`
      this.model.contractCode = this.contractCode
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'contractCode'))
      })
    },

    disabledStartDate(startDate) {
      let endDate = this.form.getFieldValue('endDate')
      if (!startDate) {
        return false
      }
      if (endDate) {
        if (moment(this.model.endDate).valueOf() < endDate.valueOf()) {
          if (startDate.valueOf() <= endDate.valueOf() && startDate.valueOf() > moment(this.model.endDate).valueOf()) {
            return false
          } else {
            return true
          }
        }
      } else {
        endDate = moment(this.model.endDate)
      }
      return startDate.valueOf() < endDate.valueOf()
    },

    disabledEndDate(endDate) {
      let startDate = this.form.getFieldValue('startDate')
      if (!endDate) {
        return false
      }
      if (startDate) {
        if (moment(this.model.endDate).valueOf() > startDate.valueOf()) {
          startDate = moment(this.model.endDate)
        }
      } else {
        startDate = moment(this.model.endDate)
      }
      return startDate.valueOf() >= endDate.valueOf()
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
    async add(record,businessOrgans) {
      // eslint-disable-next-line
      this.businessOrgans = _.cloneDeep(businessOrgans)
      this.getAllBelongs(record.businessSubject)

      await this.getCustomerName(record.customerId)
      this.visible = true
      this.disabled = true
      this.model = Object.assign({}, record)
      this.form.resetFields()
      this.model.signingStatus = '0'
      this.contractCustomerName = this.model.customerName
      
      if (record.province) {
        this.areaCitys = this.areaTrees[record.province - 1]['children']
        for (const item of this.areaCitys) {
          if (String(item.id) === String(record.city)) {
            this.areaTowns = item.children
            break
          }
        }
      }
      
      this.changeBusinessType(this.model.businessType)
      this.model.businessSub = this.model.businessSub.split(',')
      this.model.contractType = Number(this.model.contractType)
      this.model.businessSubject = Number(this.model.businessSubject)
      
      this.model.startDate = moment(this.model.startDate, this.formate)
      this.model.endDate = moment(this.model.endDate, this.formate)
      this.model.province = this.model.province === null ? null : Number(this.model.province)
      this.model.city = this.model.city === null ? null : Number(this.model.city)
      this.model.town = this.model.town === null ? null : Number(this.model.town)
      this.model.chapterType = this.model.chapterType ? this.model.chapterType.split(',') : []
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'customerId',
            'customerCode',
            'contractName',
            'contractCode',
            'money',
            'servicePeopleNum',
            'startDate',
            'businessSubject',
            'contractTerm',
            'remark',
            'customerType',
            'businessType',
            'businessSub',
            'estimatedIncome',
            'endDate',
            'signingStatus',
            'businessDeveloperId',
            'businessDeveloperOrgan',
            'crmNo',
            'serviceSide',
            'oldCustomerFlag',
            'chapterType',
            'chapterUnit',
            'chapterCustomerPre',
            'outWithFlag',
            'province',
            'city',
            'town',
            'settleCycle',
            'settleType',
            'contractTemplate',
          )
        )
      })
    },

    // eslint-disable-next-line no-unused-vars
    treeSelectChange(value, label, extra) {
      httpAction(this.url.getCustomerInfo + value, null, 'GET').then((res) => {
        if (Number(res.code) === 200) {
          this.model.customerCode = res.data.customerCode
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'customerCode'))
          })
        }
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
      // 暂时不用设置 domain
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
    
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          const formData = Object.assign({contractCode:that.model.contractCode}, values)  //contractcode 不能少
          that.ids = ''
          formData.startDate = formData.startDate ? formData.startDate.format(this.formate) : null
          formData.endDate = formData.endDate ? formData.endDate.format(this.formate) : null
          formData.businessSub = formData.businessSub[0] //数组转化为字符串
          formData.chapterType = formData.chapterType.join(',')
          formData.goOnOaOldData = "1"
          formData.id = this.model.id
          if (that.fileList.length > 0) {
            let i = 0;
            for (; i < that.fileList.length-1; i++) {
              that.ids += `${that.fileList[i].uid},`
            }
            that.ids += that.fileList[i].uid
          }else{
            that.$message.warning('合同附件必须上传！')
            return false
          }
          const urlAdd = `${that.url.add}?attaIdArray=${that.ids}`
          const endDate = this.form.getFieldValue('endDate')
          const startDate = this.form.getFieldValue('startDate')
          // eslint-disable-next-line
          formData.contractTerm = _.cloneDeep(endDate).add(1, 'day').diff(startDate, 'months')
          that.confirmLoading = true
          // 续签保存时的提交url和数据
          httpAction(urlAdd, formData, 'POST')
            .then((res) => {
              if (Number(res.code) === 200) {
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
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
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
      this.fileList=[]
    },
  },
}
</script>

<style lang="less" scoped>
.contractModal {
  .ant-modal-body .ant-spin-nested-loading {
    :global {
      height: 500px;
      overflow-y: scroll;
    }
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
  font-weight: bold;
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
h2 {
  font-weight: 700;
  font-size: 18px;
  height: 50px;
}
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
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

.pictureCard{
  :global(.ant-upload-list){
    float: left;  
  }
}
</style>
