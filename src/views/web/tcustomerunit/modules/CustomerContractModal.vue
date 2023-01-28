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
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    wrapClassName="contractModal"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="inline" class="ant-advanced-search-form">
        <div class="sectionTitle">合同基本信息</div>
        <a-row>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="合同名称">
              <a-input
                placeholder="请输入合同名称"
                style="width: 205px"
                v-decorator="['contractName', validatorRules.contractName]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="CRM订单合同编号">
              <a-input
                placeholder="请选择CRM订单合同编号"
                style="width: 205px"
                v-decorator="['crmNo', validatorRules.crmNo]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="客户单位"
              style="margin-bottom:0px;">
              <select-page
                placeholder="请选择客户单位"
                :disabled="true"
                style="width: 205px;"
                v-decorator="['customerId', validatorRules.customerId]"
                :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                :title="'customerName'"
                @select="handleSelect"
                :id="'id'"
              ></select-page>
            </a-form-item>
            <a-form-item
              class="stepFormText"
              style="margin-left:150px">
              <a-radio-group v-decorator="['serviceSide', validatorRules.serviceSide]">
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
                style="width: 205px"
                @change="businessSubjectChange"
                :dropdownMatchSelectWidth="false"
                v-decorator="['businessSubject', validatorRules.businessSubject ]"
              >
                <a-select-option
                  v-for="(item, index) in organs"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.organName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
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
                  style="width: 140px;"
                  placeholder="开始日期"
                  @openChange="handleStartOpenChange"
                  @change="startDatePick"
                  v-decorator="[ 'startDate', validatorRules.startDate]"
                />
                <a-date-picker
                  :disabledDate="disabledEndDate"
                  :allowClear="false"
                  format="YYYY-MM-DD"
                  style="width: 140px;"
                  placeholder="结束日期"
                  :open="endOpen"
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
              label="是否续签">
              <a-radio-group v-decorator="['signingStatus', validatorRules.signingStatus]">
                <a-radio value="0">续签</a-radio>
                <a-radio value="1">新签</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
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
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="用章类型">
              <a-radio-group v-decorator="['chapterType', validatorRules.chapterType ]">
                <a-radio value="1">合同章</a-radio>
                <a-radio value="2">法人章</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="用章单位">
              <a-radio-group v-decorator="['chapterUnit', validatorRules.chapterUnit]">
                <a-radio value="1">皖信</a-radio>
                <a-radio value="2">柯恩</a-radio>
                <a-radio value="3">易服</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
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
        </a-row>
        <div class="sectionTitle">业务信息</div>
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
                @change="changeBusinessType"
                style="width: 205px"
                v-decorator="['businessType', validatorRules.businessType]"
              >
                <a-select-option
                  v-for="(item, index) in customerBusinessTypeDict"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.description }}</a-select-option>
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
                style="width: 205px"
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
                style="width: 205px"
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
        <a-row>
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
          <a-col :span="24">
            <a-form-item
              class="stepFormText"
              label="结算方式">
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
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="收入预估">
              <a-input
                v-decorator="['estimatedIncome',{rules: [{ pattern: /(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/, message: '可计收入预估格式不正确!' },{required:true,message: '请输入可计收入预估（合同期内）' }]}]"
                style="width: 205px"
                placeholder="请输入可计收入预估）"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合同金额">
              <a-input v-decorator="['money',{rules: [{pattern:/(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/, message: '合同金额格式不正确!' }]}]" style="width: 205px" placeholder="请输入合同金额" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
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
                v-decorator="['remark', {} ]"
                placeholder="请输入合同要点"
                style="width: 600px;min-height:120px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              class="stepFormText requireFile"
              label="合同附件">
              <div class="clearfix">
                <a-upload
                  listType="picture-card"
                  :fileList="fileList"
                  @change="handleImport"
                  @preview="handlePreview"
                  :multiple="true"
                  accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx"
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
import SelectPage from '@/components/jeecg/SelectPage'

export default {
  name: 'CustomerContractModal',
  components: {
    SelectPage,
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
      isUpload:true,
      confirmLoading: false,
      form: this.$form.createForm(this),
      //数据字典
      customerContractDict: [],
      customerBusinessTypeDict: [],
      customerBusinessSubTypeDict: [],
      startDateRage: '',
      endDateRage: '',
      businessDeveloperId:'',
      businessDeveloperOrgan:'',
      validatorRules: {
        customerId: { rules: [{ required: true, message: '请选择客户单位!' }] },
        customerCode: { rules: [{ required: true, message: '请选填写客户编码!' }] },
        contractName: { rules: [{ required: true, message: '请填写合同名称!' }] },
        contractCode: { rules: [{ required: true, message: '请填写合同编号!' }] },
        businessSubject: { rules: [{ required: true, message: '请选择商务主体!' }] },
        //去除这个选择
        //contractType: { rules: [{ required: true, message: '请选择合同类型!' }] },
        startDate: { rules: [{ required: true, message: '请选择合同日期!' }, { validator: this.startDateValidator }] },
        endDate: { rules: [{ required: true, message: '请选择合同失效时间!' }, { validator: this.endDateValidator }] },
        businessType: { rules: [{ required: true, message: '请选择业务类型!' }] },
        businessSub: { rules: [{ required: true, message: '请选择业务细分!' }] },
        // 签订状态删除校验删除
        contractTemplate: { rules: [{ required: true, message: '请选择合同模板' }] },
        settleCycle: { rules: [{ required: true, message: '请选择合结算周期' }] },
        chapterType: { rules: [{ required: true, message: '请选择用章类型' }] },
        chapterUnit: { rules: [{ required: true, message: '请选择用章单位' }] },
        outWithFlag: { rules: [{ required: true, message: '请选择是否外带' }] },
        chapterCustomerPre: { rules: [{ required: true, message: '请选择是否先行盖章' }] },
        signingStatus: { rules: [{ required: true, message: '请选择是否续签' }] },
        oldCustomerFlag: { rules: [{ required: true, message: '请选择是否是老客户' }] },
        serviceSide: { rules: [{ required: true, message: '甲方还是乙方' }] },
        crmNo: { rules: [{ required: true, message: '请输入CRM合同编号' }] },
        businessDeveloperId: { rules: [{ required: true, message: '请选择业务开发人!' }] },
        businessDeveloperOrgan: { rules: [{ required: true, message: '请选择开发部门/分公司!' }] },
        province: { rules: [{ required: true, message: '省份不能为空!' }] },
        city: { rules: [{ required: true, message: '城市不能为空!' }] },
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
    }
  },
  methods: {
    moment,
    add(record) {
      this.model = Object.assign({}, record)
      this.visible = true
      this.form.resetFields()
      this.disabled = false
      this.fileList = []
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({customerId:String(this.model.id)}, 'customerId'))
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
    changeBusinessType(value) {
      // 业务类型改变
      httpAction(`${this.url.getBusinessSub}?parentId=${value}`,null,'get').then((res)=>{
        if(Number(res.code) === 200){
          this.customerBusinessSubTypeDict = res.data
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({businessSub:String(this.customerBusinessSubTypeDict[0].id)}, 'businessSub'))
          })
        }
      })
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
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'customerCode', 'customerType'))
          })
          const sz = pinyin(res.data.customerName, {
            style: pinyin.STYLE_FIRST_LETTER,
          })
          let ename = ''
          if (sz.length > 0) {
            for (const i of sz) {
              ename += i[0]
            }
          }
          this.contractCustomerName = ename.toUpperCase()
          const businessSubject = this.form.getFieldValue('businessSubject')

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
      const sz = pinyin(this.businessSubjectName, {
        style: pinyin.STYLE_FIRST_LETTER,
      })
      let ename = ''
      if (sz.length > 0) {
        for (const i of sz) {
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
        const end = _.cloneDeep(endDate)
        this.model.contractTerm = end.add(1, 'day').diff(d, 'months')
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
        this.model.contractTerm = end.add(1, 'day').diff(startDate, 'months')
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
      } else if (/pdf/gi.test(fileExt)) {
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
      // 暂时不用设置 dodmain,formData.append('domain', this.model.id)
      const contextType = { 'Content-Type': 'multipart/form-data' }
      postActionHeader(this.url.importUrl, formData, contextType).then((res) => {
        if (Number(res.code) === 200 && res.data) {
          _this.fileList = [..._this.fileList, res.data]
          _this.$message.success('上传附件成功')
        } else {
          _this.$message.warning(res.msg)
        }
      })
    },
    /* 以上是文件上传相关 */
    /**
     * 获取系统单位组织架构信息，
     * 仔细思考 为什么打印不出来loadOrgans
     */
    loadOrgans() {
      httpAction(this.url.getOrgan, '', 'GET').then((res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.organs = res.data
        }
      })
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          const formData = Object.assign(that.model, values)
          that.ids = ''
          formData.startDate = formData.startDate ? formData.startDate.format('YYYY-MM-DD') : null
          formData.endDate = formData.endDate ? formData.endDate.format('YYYY-MM-DD') : null
          if (that.fileList && that.fileList.length > 0) {
            for (let i = 0; i < that.fileList.length; i++) {
              if (i === that.fileList.length - 1) {
                that.ids = `${that.ids}${that.fileList[i].uid}`
              } else {
                that.ids += `${that.ids}${that.fileList[i].uid},`
              }
            }
          }else{
            that.$message.warning('合同附件必须上传！')
            return false
          }
          const urlAdd = `${that.url.add}?attaIdArray=${that.ids}`
          that.confirmLoading = true
          httpAction(urlAdd, formData, 'POST')
            .then((res) => {
              if (Number(res.code) === 200) {
                that.confirmLoading = false
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.confirmLoading = false
                that.$message.warning(res.msg)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }else {
          that.confirmLoading = false
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
      this.validateDateStatus = this.helpText = ''
      this.model = {}
    },
  },
  created() {

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
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 20px 0px;
  .ant-form-item {
    margin-bottom: 20px;
  }
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
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
</style>
