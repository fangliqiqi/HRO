<template>
  <a-modal
    :title="title"
    :width="1200"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >保存</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="6">
            <a-form-item
              label="姓名"
              style="margin-left: 28px"
            >
              <a-input
                placeholder="请填写姓名"
                v-decorator="['empName', validatorRules.empName]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="身份证号"
              style="margin-left: 0px"
            >
              <a-input
                placeholder="请填写身份证号"
                v-decorator="['empIdcard', validatorRules.empIdcard]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="身份证有效期"
              style="margin-left: 0px"
            >
              <a-date-picker
                :disabledDate="disabledEmpIdcardValidity"
                placeholder="请选择身份证有效期"
                v-decorator="['empIdcardValidity', {initialValue: !model.empIdcardValidity ? null : moment(model.empIdcardValidity, dateFormat)}]"
                style="width: 174px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="性别"
              style="margin-left: 30px"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择性别"
                v-decorator="['empSex']"
                style="width: 191px"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in sexBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="6">
            <a-form-item
              label="年龄"
              style="margin-left: 28px"
            >
              <a-input
                placeholder="请填写年龄"
                v-decorator="['empAge', validatorRules.empAge]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="出生日期"
              style="margin-left: 11px"
            >
              <a-date-picker
                :disabledDate="disabledEmpBirthday"
                placeholder="请选择出生日期"
                v-decorator="['empBirthday', {initialValue: !model.empBirthday ? null : moment(model.empBirthday, dateFormat)}]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="婚姻状况"
              style="margin-left: 28px"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择婚姻状况"
                v-decorator="['empMarriStatu']"
                style="width: 174px"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in empMarriBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="民族"
              style="margin-left: 30px"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择民族"
                v-decorator="['empNational']"
                style="width: 191px"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in empNationalBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="6">
            <a-form-item
              label="政治面貌"
              style="margin-left: 11px"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择政治面貌"
                v-decorator="['politicalStatus']"
                style="width: 191px"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in politicalBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="E-Mail"
              style="margin-left: 28px"
            >
              <a-input
                placeholder="请填写E-Mail"
                v-decorator="['empEmail', validatorRules.empEmail]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="QQ"
              style="margin-left: 63px"
            >
              <a-input
                placeholder="请填写QQ"
                v-decorator="['empQq', validatorRules.empQq]"
                style="width: 174px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="联系方式"
              style="margin-left: 0px"
            >
              <a-input
                placeholder="请填写联系方式"
                v-decorator="['empPhone', validatorRules.empPhone]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="6">
            <a-form-item
              label="员工类型"
              style="margin-left: 0px"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择员工类型"
                v-decorator="['empType', validatorRules.empType]"
                style="width: 191px"
                :dropdownMatchSelectWidth="false"
              >
                <template v-for="(item, index) in empTypeBelongs">
                  <a-select-option
                    disabled
                    :key="index"
                    :value="item.value"
                    v-if="item.value != 2 && item.value != 10 && !model.id"
                  >{{ item.label }}</a-select-option>
                  <a-select-option
                    v-else
                    :key="index"
                    :value="item.value"
                  >{{ item.label }}</a-select-option>
                </template>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="结算主体"
              style="margin-left: 0px"
            >
              <a-select
                showSearch
                :disabled="(this.model.id ? true : false)"
                optionFilterProp="children"
                placeholder="请选择结算主体"
                v-decorator="['settleDomainName', validatorRules.settleDomain]"
                style="width: 191px"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(value, key) in settleDomainBelongs"
                  :key="key"
                  :value="value.id"
                  @click="settleDomainChange(value)"
                >{{ value.departName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="所属单位"
              style="margin-left: 28px"
            >
              <a-select
                :disabled="true"
                placeholder="所属单位"
                v-decorator="['belongUnitName']"
                style="width: 174px"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(value, key) in belongUnitBelongs"
                  :key="key"
                  :value="value.customerId"
                >{{ value.customerName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="就职班组"
              style="margin-left: 11px"
            >
              <a-input
                placeholder="请填写就职班组"
                v-decorator="['inauguralTeam']"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="6">
            <a-form-item label="工时制" style="margin-left: 22px">
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择工时制"
                v-decorator="['workingHours', {}]"
                :allowClear="true"
                :dropdownMatchSelectWidth="false"
                style="width: 191px"
              >
                <a-select-option
                  v-for="(item, index) in workingHoursBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="就职岗位">
              <a-input
                placeholder="请填写就职岗位"
                v-decorator="['post', {rules: [{ required: true, message: '请填写就职岗位！'}]}]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="电信编号"
              style="margin-left: 11px"
            >
              <a-input
                placeholder="请填写电信编号"
                v-decorator="['telecomNumber']"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="户口性质"
              style="margin-left: 28px"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择户口性质"
                v-decorator="['empRegisType']"
                style="width: 174px"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in empRegisTypeBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="开户行"
              style="margin-left: 25px"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择开户行"
                v-decorator="['empBankAllName']"
                @change="changeBank"
                style="width: 191px"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in bankBelongs"
                  :key="index"
                  :value="item"
                >{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="开户支行"
              style="margin-left: 11px"
            >
              <!-- <j-select-page></j-select-page> -->
              <a-select
                placeholder="请输入支行关键字查询"
                v-decorator="['empBankName']"
                style="width:191px;"
                showSearch
                :allowClear="true"
                optionFilterProp="children"
                :dropdownMatchSelectWidth="false"
                @search="handleSearch"
              >
                <a-select-option
                  v-for="(item, index) in bankName"
                  :key="index"
                  :value="item.branchName"
                >{{ item.branchName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <a-form-item
              label="银行卡号"
              style="margin-left: 28px"
            >
              <a-input
                placeholder="请填写银行卡号"
                v-decorator="['empBankNo', validatorRules.empBankNo]"
                style="width: 174px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-form-item
              label="员工标签"
              style="margin-left: 0px"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择员工标签"
                v-decorator="['empLabel', validatorRules.empLabel]"
                style="width: 191px"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in employeeLableBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="入职日期"
              style="margin-left: 11px"
            >
              <a-date-picker
                placeholder="请选择入职日期"
                v-decorator="['enjoinDate', {initialValue: !model.enjoinDate ? null : moment(model.enjoinDate, dateFormat)}]"
                style="width: 191px"
                format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="试用期"
              style="margin-left: 41px"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择试用期"
                v-decorator="['tryPeriod', {}]"
                style="width: 174px"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in tryPeriodBelongs"
                  :key="index"
                  :value="index"
                >{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="计税月份"
              style="margin-left: 11px"
            >
              <a-month-picker
                :disabled="(this.model.taxationMonth ? true : false)"
                :disabledDate="disabledTaxationMonth"
                placeholder="请选择计税月份"
                v-decorator="['taxationMonth', {initialValue: !model.taxationMonth ? null : moment(model.taxationMonth, 'YYYYMM')}]"
                style="width: 191px"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-item
              label="身份证地址"
              style="margin-left: 0px"
              class="stepFormText"
            >
              <a-select
                showSearch
                placeholder="选择省份"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['idProvince', validatorRules.idProvince]"
                @change="handleIdProvinceChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in idAreaTrees"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                showSearch
                placeholder="选择城市"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['idCity', {}]"
                @change="handleIdCityChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in idAreaCitys"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                showSearch
                placeholder="选择区县"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['idTown', {}]"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in idAreaTowns"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-input
                placeholder="身份证地址详细地址"
                v-decorator="['idcardAddr', validatorRules.idcardAddr]"
                style="width: 408px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col>
            <a-form-item
              label="档案所在地"
              style="margin-left: 0px"
              class="stepFormText"
            >
              <a-select
                showSearch
                placeholder="选择省份"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['fileProvince', { rules: [{ required: true, message: '请选择地址！' }] }]"
                @change="handleFileProvinceChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in fileAreaTrees"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                showSearch
                placeholder="选择城市"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['fileCity', {}]"
                @change="handleFileCityChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in fileAreaCitys"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                showSearch
                placeholder="选择区县"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['fileTown', {}]"
                :dropdownMatchSelectWidth="false"
                :allowClear="true"
              >
                <a-select-option
                  v-for="(item, index) in fileAreaTowns"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-input
                placeholder="档案所在地详细地址"
                v-decorator="['fileAddr', {}]"
                style="width: 408px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="7">
            <a-form-item
              label="承包商名称"
              style="margin-left: 28px"
            >
              <a-input
                placeholder="承包商名称"
                v-decorator="['contractorName', validatorRules.contractorName]"
                style="width: 174px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="16">
            <a-form-item
              label="备注"
              style="margin-left: 39px"
            >
              <a-textarea
                :rows="2"
                placeholder="请填写备注"
                v-decorator="['remark']"
                style="width: 577px"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import JSelectPage from '@/components/jeecg/JSelectPage'

  export default {
    name: 'EmployeeModal',
    components:{
      JSelectPage
    },
    data() {
      return {
        moment,
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        sexBelongs: [],
        bankBelongs: [],
        bankName:[], //支行名称
        empTypeBelongs: [],
        empMarriBelongs: [],
        politicalBelongs: [],
        belongUnitBelongs: [],
        empNationalBelongs: [],
        settleDomainBelongs: [],
        empRegisTypeBelongs: [],
        employeeLableBelongs: [],
        workingHoursBelongs: [],
        tryPeriodBelongs: {'1': '1个月', '2': '2个月', '3': '3个月', '4': '4个月', '5': '5个月', '6': '6个月', '7': '7个月', '8': '8个月', '9': '9个月', '10': '10个月', '11': '11个月', '12': '12个月'},
        idAreaTrees: [],
        idAreaCitys: [],
        idAreaTowns: [],
        fileAreaTrees: [],
        fileAreaCitys: [],
        fileAreaTowns: [],
        dateFormat: "YYYY-MM-DD",
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          empName: { rules: [{ required: true, message: '请填写姓名！' }, { validator: this.validateName }] },
          empIdcard: { rules: [{ required: true, message: '请填写身份证号！' }, { validator: this.validateIdCard }] },
          empAge: { rules: [{ required: true, message: '请填写年龄！' }, { validator: this.validateAge }] },
          empEmail: { rules: [{ pattern: /^([a-zA-Z]|[0-9])(\w|\\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,message:'E-Mail格式不正确！' }] },
          empQq: { rules: [{ validator: this.validateQq }] },
          empType: { rules: [{ required: true, message: '请选择员工类型！' }] },
          settleDomain: { rules: [{ required: true, message: '请选择结算主体！' }] },
          idProvince: { rules: [{ required: true, message: '请选择地址！' }] },
          empPhone: { rules: [{ required: true, message: '请填写联系方式！' }, { validator: this.validatePhone }] },
          empBankNo: { rules: [{ validator: this.validateBankNo }] },
          empLabel: { rules: [{ required: true, message: '请选择员工标签！' }] },
          idcardAddr: { rules: [{ required: true, message: '请填写身份证地址详细地址！' }] },
        },
        url: {
          add: 'hrBase/temployeeinfo',
          edit: 'hrBase/temployeeinfo',
          searchBank:'hrBase/tbankinfo/page'
        },
      }
    },
    methods: {
      // 添加
      add() {
        this.edit({})
      },
      searchBank(param){
        const parm = `?size=20&${param.replace(/\+/g, '%2B')}`
        this.bankName = []
        httpAction(this.url.searchBank + parm ,null,'GET').then((res) => {
          if(Number(res.code) === 200 ) {
            this.bankName = res.data.records
          }
        })
      },
      // 总行改变
      changeBank(value){
        this.searchBank(`bankName=${value}`)
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({empBankName:undefined}, 'empBankName'))
        })
      },
      //搜索支行
      handleSearch(val){
        let parm = `branchName=${val}`
        const empBankAllName = this.form.getFieldValue('empBankAllName')
        if(empBankAllName){
          parm += `&bankName=${empBankAllName}`
        }
        this.searchBank(parm)
      },
      // 身份证地址省份切换
      handleIdProvinceChange(value) {
        this.idAreaCitys = []
        this.idAreaTowns = []
        for (const c of this.idAreaTrees[value - 1].children) {
          this.idAreaCitys.push(c)
        }
        this.model.idCity = this.idAreaCitys[0].id
        for (const t of this.idAreaCitys[0].children) {
          this.idAreaTowns.push(t)
        }
        this.model.idTown = this.idAreaTowns[0].id
        this.form.setFieldsValue(pick(this.model, 'idProvince', 'idCity', 'idTown'))
      },
      // 身份证地址城市切换
      handleIdCityChange(value) {
        this.idAreaTowns = []
        for (const c of this.idAreaCitys) {
          if (String(c.id) === String(value)) {
            if (c.children.length > 0) {
              for (const t of c.children) {
                this.idAreaTowns.push(t)
              }
            }
          break
          }
        }
        if (this.idAreaTowns.length > 0) {
          this.model.idTown = this.idAreaTowns[0].id
          this.form.setFieldsValue(pick(this.model, 'idCity', 'idTown'))
        } else {
          this.model.idTown = -1
          this.form.setFieldsValue(pick(this.model, 'idCity', 'idTown'))
        }
      },
      // 户口所在地省份切换
      handleFileProvinceChange(value) {
        this.fileAreaCitys = []
        this.fileAreaTowns = []
        for (const c of this.fileAreaTrees[value - 1].children) {
          this.fileAreaCitys.push(c)
        }
        this.model.fileCity = this.fileAreaCitys[0].id
        for (const t of this.fileAreaCitys[0].children) {
          this.fileAreaTowns.push(t)
        }
        this.form.setFieldsValue(pick(this.model, 'fileProvince', 'fileCity', 'fileTown'))
      },
      // 户口所在地城市切换
      handleFileCityChange(value) {
        this.fileAreaTowns = []
        for (const c of this.fileAreaCitys) {
          if (String(c.id) === String(value)) {
            if (c.children.length > 0) {
              for (const t of c.children) {
                this.fileAreaTowns.push(t)
              }
            }
          break
          }
        }
        this.form.setFieldsValue(pick({fileTown:undefined}, 'fileTown'))
      },
      // 编辑
      edit(record) {
        this.idAreaCitys = []
        this.idAreaTowns = []
        this.fileAreaCitys = []
        this.fileAreaTowns = []
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'empName', 'empIdcard', 'empSex', 'empAge', 'empMarriStatu', 'empNational', 'politicalStatus','workingHours',
          'empType', 'settleDomainName','belongUnitName', 'inauguralTeam', 'post', 'telecomNumber', 'empEmail', 'empQq', 'empPhone', 'idProvince', 'idCity', 'idTown', 'idcardAddr','fileProvince', 'fileCity', 'fileTown', 'fileAddr',
          'empRegisType', 'empBankName', 'empBankNo', 'empLabel', 'tryPeriod', 'contractorName','remark'))
        })
        if(this.model.empBankName){
          httpAction(`${this.url.searchBank}?branchName=${this.model.empBankName}` ,null,'GET').then((res) => {
            if(Number(res.code) === 200 && res.data.records.length>0) {
              this.$nextTick(() => {
                this.form.setFieldsValue(pick({empBankAllName:res.data.records[0].bankName},'empBankAllName'))
              })
            }
          })
        }
        // 身份证地址
        for (const p of this.idAreaTrees) {
          if (String(p.id) === String(this.model.idProvince)) {
            this.idAreaCitys = p.children
            for (const c of this.idAreaCitys) {
              if (String(c.id) === String(this.model.idCity)) {
                this.idAreaTowns = c.children
                break
              }
            }
          break
          }
        }
        // 户口所在地
        for (const p of this.fileAreaTrees) {
          if (String(p.id) === String(this.model.fileProvince)) {
            this.fileAreaCitys = p.children
            for (const c of this.fileAreaCitys) {
              if (String(c.id) === String(this.model.fileCity)) {
                this.fileAreaTowns = c.children
                break
              }
            }
          break
          }
        }
        // 所属单位
        if (this.model.settleDomain) {
          if (Object.keys(this.settleDomainBelongs).length) {
            this.belongUnitBelongs = (this.settleDomainBelongs).hasOwnProperty(this.model.settleDomain) ? [this.settleDomainBelongs[this.model.settleDomain]] : []
          } else {
            this.belongUnitBelongs = []
          }
        }
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            if (!this.model.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }
            // 身份证有效期格式转换
            values.empIdcardValidity = values.empIdcardValidity ? values.empIdcardValidity.format(this.dateFormat) : null
            // 出生日期格式转换
            values.empBirthday = values.empBirthday ? `${values.empBirthday.format(this.dateFormat)} 00:00:00` : null
            // 入职日期格式转换
            values.enjoinDate = values.enjoinDate ? values.enjoinDate.format(this.dateFormat) : null
            // 计税月份转换
            values.taxationMonth = values.taxationMonth ? values.taxationMonth.format('YYYYMM') : null
            let formData = Object.assign(this.model, values)
            formData.fileTown = formData.fileTown ? formData.fileTown : null
            httpAction(httpurl, formData, method).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.message || res.msg)
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          }
        })
      },
      // 表单关闭
      handleCancel() {
        this.close()
      },
      // 关闭实现，数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.sexBelongs = []
        this.empMarriBelongs = []
        this.empNationalBelongs = []
        this.politicalBelongs = []
        this.empTypeBelongs = []
        this.settleDomainBelongs = []
        this.belongUnitBelongs = []
        this.empRegisTypeBelongs = []
        this.bankBelongs = []
        this.employeeLableBelongs = []
      },
      // 结算主体变化
      settleDomainChange: function(value) {
        this.belongUnitBelongs = [value]
        this.model.settleDomain = value.id
        this.model.belongUnit = value.customerId
        this.model.belongUnitName = value.customerName
        this.$nextTick(()=>{
          this.form.setFieldsValue(pick(this.model, 'belongUnitName','settleDomainName')) 
        })
        
      },
      /******************************************* 验证规则 *******************************************/
      // 姓名验证
      validateName(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        const strLenght = value.length
        if (strLenght < 2 || strLenght > 10) {  // 长度验证
          callback('姓名长度在2-10个字符之间！')
          return false
        }
        callback()
      },
      // 身份证号验证
      validateIdCard(rule, s, callback) {
        // 是否为空
        if (!s) {
          callback()
          return false
        }
        // 18位
        if (s.length !== 18) {
          callback('请填写18位身份证号！')
          return false
        }
        var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
        //号码规则校验
        if (!format.test(s)) {
          callback('身份证号有误！')
          return false
        }
        //区位码校验
        //出生年月日校验  前正则限制起始年份为1900;
        var year = s.substr(6, 4),//身份证年
          month = s.substr(10, 2),//身份证月
          date = s.substr(12, 2),//身份证日
          time = Date.parse(`${month}-${date}-${year}`),//身份证日期时间戳date
          now_time = Date.parse(new Date()),//当前时间戳
          dates = (new Date(year, month, 0)).getDate()//身份证当月天数
        if (time > now_time || date > dates) {
          callback('身份证号有误！')
          return false
        }
        //校验码判断
        const nowYear = Number((new Date()).getFullYear())  // 当前年
        const nowMonth = Number((new Date()).getMonth() + 1)  // 当前月
        const nowDate = Number((new Date()).getDate())  // 当前日
        this.model.empBirthday = moment(year + month + date)
        // 性别
        this.model.empSex = ((s.substr(16, 1)) % 2 == 0) ? '2' : '1'
        // 年龄
        this.model.empAge = (nowMonth - month >= 0 && nowDate - date >= 0) ? nowYear - year : nowYear - year - 1
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'empSex', 'empAge'))
        })
        callback()
      },
      // 年龄验证
      validateAge(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (new RegExp(/^[1-9]\d*$/).test(value)) { // 正整数验证
          if (value < 15 || value > 70) { // 范围验证
            callback('范围在15-70之间的整数！')
            return false
          }
        } else {
          callback('范围在15-70之间的整数！')
          return false
        }
        callback()
      },
      // 年龄时间选择区间
      disabledEmpBirthday(current) {
        return current > moment().add(-15 * 365, 'days')
      },
      // QQ验证
      validateQq(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        const strLenght = value.length
        if (new RegExp(/^[1-9]\d*$/).test(value)) { // 整数验证
          if (strLenght < 5 || strLenght > 15) { // 位数验证
            callback('QQ长度在5-15个字符！')
            return false
          }
        } else {
          callback('QQ格式不正确！')
          return false
        }
        callback()
      },
      // 手机号验证
      validatePhone(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        // if (!new RegExp(/^(1[3456789]\d{9})$/).test(value)) {
        //   callback('联系方式格式不正确！')
        //   return false
        // }
        callback()
      },
      // 银行卡号验证
      validateBankNo(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if(value.length>25){
          callback('银行卡号不能超过25位！')
          return false
        }
        callback()
      },
      // 身份证有效期（当前及之后）
      disabledEmpIdcardValidity(current) {
        return current < moment().add(-90, 'days')
      },
      // 计税月份（当前月之前）
      disabledTaxationMonth(current) {
        return current && current > moment().endOf('day')
      },
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>

<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
</style>
