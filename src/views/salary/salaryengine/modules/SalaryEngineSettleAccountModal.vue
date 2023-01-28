<template>
  <a-card title="结算表">
    <template slot="extra">
      <!-- <a-button
        type="primary"
        @click="addModal(1)"
      >开票明细导入</a-button> -->
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="1">
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImport('/salary/tengineeringformticket/uploadFormTicket','post')"
              accept=".xls,.xlsx"
            >
              <a-icon type="upload"/> 明细导入
            </a-upload>
          </a-menu-item>
          <a-menu-item key="2" @click="handleDownloadTemplate('/templates/工程开票详情导入模板.xlsx')"><a-icon type="download" />模板下载</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 开票明细导入 <a-icon type="down" /> </a-button>
      </a-dropdown>

      <a-button
        type="primary"
        @click="addModal(2)"
        style="margin-left:5px"
      >添加自定义项</a-button>
      <!-- <a-button
        type="primary"
        @click="addModal(3)"
        style="margin-left:5px"
      >添加开票明细</a-button> -->
    </template>
    <!-- <a-card
      title="基础信息"
      :bordered="false"
    >
      <a-table
        rowKey="id"
        :columns="headerColumns"
        :dataSource="salaryInfo"
        :pagination="false"
      >
      </a-table>
    </a-card> -->
    <a-card :bordered="false">
      <div class="tabDiv">
        <h2 id="tabledesc1">{{ salaryStandardInfo.departName }}{{ salaryStandardInfo.settlementMonth }} - 结算单</h2>
        <table class="table1" aria-describedby="tabledesc1">
          <tr class="tr1">
            <td class="tit td1">结算主体</td>
            <td class="td1">{{ salaryStandardInfo.departName }}</td>
            <td class="tit td1">皖信盖章</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算编码名称</td>
            <td
              class="td1"
            >{{ salaryStandardInfo.departNo }}</td>
            <td class="tit td1">结算时间</td>
            <td
              class="td1"
            >{{ salaryStandardInfo.settlementMonth }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">业务类型</td>
            <td
              class="td1"
              colspan="3"
            >{{ salaryStandardInfo.businessType }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >费用项目</td>
            <td class="tit td1">金额</td>
            <td class="tit td1">开票额小计</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              rowspan="4"
            >{{ salaryStandardInfo.salaryMonth }}</td>
            <td class="tit td1">应发工资</td>
            <td class="td1">{{ settleDeail.salarySum }}</td>
            <td class="td1">{{ settleDeail.salaryTicket }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">实发工资(银付)</td>
            <td class="td1">{{ settleDeail.cardPay }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">实发工资(现金)</td>
            <td class="td1">{{ settleDeail.moneyPay }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">暂停发金额</td>
            <td class="td1">{{ settleDeail.pausePay }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              rowspan="2"
            >{{ settleDeail.socialMonth }}</td>
            <td class="tit td1">应缴单位社保</td>
            <td class="td1">{{ settleDeail.usocialDeduction }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴个人社保</td>
            <td class="td1">{{ settleDeail.psocialDeduction }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              rowspan="2"
            >{{ settleDeail.fundMonth }}</td>
            <td class="tit td1">应缴单位公积金</td>
            <td class="td1">{{ settleDeail.ufundDeduction }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴个人公积金</td>
            <td class="td1">{{ settleDeail.pfundDeduction }}</td>
            <td class="td1"></td>
          </tr>

          <!-- <tr class="tr1">
            <td
              class="tit td1"
              rowspan="4"
            ></td>
            <td class="tit td1">预收单位社保</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">预收单位公积金</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">预收个人社保</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">预收工个人公积金</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
            <td class="td1">{{ settlementhFormInfo.cardPay }}</td>
          </tr> -->
          <tr
            v-for="(item,index) in withholdData"
            :key="index"
          >
            <td
              class="tit td1"
              colspan="2"
            >{{ getItemName(item.itemTypeName,item.subName) }}{{ pauseTxt[item.isPause] }}
              <a-popconfirm
                title="确定删除吗?"
                @confirm="() => deleteSub(index)"
              >
                <a-icon
                  type="delete"
                  style="color:red;cursor:pointer"
                />
              </a-popconfirm>
            </td>
            <td class="td1">{{ item.money }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >雇主责任险</td>
            <td class="td1">{{ settleDeail.employerLiabilityInsurance }}</td>
            <td class="td1"></td>
          </tr>
          <tr
            class="tr1"
            v-if="settleDeail.takingBalance != 0"
          >
            <td
              class="tit td1"
              colspan="2"
            >商险差余额</td>
            <td class="td1">{{ settleDeail.takingBalance }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >其它费用</td>
            <td class="td1">{{ settleDeail.other }}</td>
            <td class="td1"></td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >增值税金及附加</td>
            <td class="td1">{{ settleDeail.valueDaddedTax }}</td>
            <td class="td1">{{ settleDeail.valueDaddedTaxTicket }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >预缴企业所得税</td>
            <td class="td1">{{ settleDeail.unitIncomeTax }}</td>
            <td class="td1">{{ settleDeail.unitIncomeTaxTicket }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >预缴个人所得税</td>
            <td class="td1">{{ settleDeail.personIncomeTax }}</td>
            <td class="td1">{{ settleDeail.personIncomeTaxTicket }}</td>
          </tr>

          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >人数</td>
            <td class="td1">{{ settleDeail.personCount }}</td>
            <td class="td1"></td>
          </tr>

          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >管理费
              <a-icon
                type="edit"
                style="color:red;cursor:pointer;margin-left:30px;font-size:18px"
                @click="handleEditManage"
              />
            </td>
            <td class="td1">{{ settleDeail.managementCost }}</td>
            <td class="td1">{{ settleDeail.managementCostTicket }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >结算金额合计</td>
            <td class="td1"></td>
            <td class="td1">{{ settleDeail.accountMoneySum }}</td>
          </tr>

          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >开票金额合计
              <a-icon
                type="edit"
                style="color:red;cursor:pointer;font-size:18px"
                @click="handleInvoiceInfo"
              />
            </td>
            <td class="td1"></td>
            <td class="td1">{{ settleDeail.ticketMoneySum }}</td>
          </tr>

          <tr class="tr1">
            <td class="tit td1">备注</td>
            <td
              class="td1"
              colspan="3"
            >
              <input
                style="border-radius:5px;border:1px solid gray;width:100%"
                :value="settleDeail.remark"
                @blur="blurSettleRemark"
                v-has="'wxhr:tengineeringsettlementform_edit'"
              >
              <!-- <div
                v-if="!settleDeail.remark"
                style="color:red;font-size:10px"
                v-has="'wxhr:tengineeringsettlementform_edit'"
              >
                *完善备注信息
              </div> -->
            </td>
          </tr>
          <!-- <tr class="tr1">
            <td class="tit td1">发票类型</td>
            <td class="tit td1">扣除金额</td>
            <td class="tit td1">不含税金额</td>
            <td class="tit td1">税额</td>
            <td class="tit td1">发票合计金额</td>
          </tr>
          <tr class="tr1">
            <td class="td1">0.0</td>
            <td class="td1">0.0</td>
            <td class="td1">0.0</td>
            <td class="td1">0.0</td>
            <td class="td1">0.0</td>
          </tr> -->
        </table>

        <table class="table1" aria-describedby="tabledesc1">
          <tr class="tr1">
            <th
              class="tit td1"
              scope="col"
            >开票日期</th>
            <th
              class="tit td1"
              scope="col"
            >开票金额</th>
            <th
              class="tit td1"
              scope="col"
            >本次结算金额</th>
            <th
              class="tit td1"
              scope="col"
            >本次结算到账金额</th>
            <th
              scope="col"
              class="tit td1"
              style="text-align:center;color:green"
            >
              <a-icon
                type="plus-circle"
                @click="handleOpen"
                v-has="'wxhr:tengineeringformticket_add'"
              />
            </th>
          </tr>
          <tr
            class="tr1"
            v-for="(item,index) in openData"
            :key="index"
          >
            <td class="td1">{{ formateDate(item.ticketTime) }}</td>
            <td class="td1">{{ item.money }}</td>
            <td class="td1">{{ item.currentSettleMoney }}</td>
            <td class="td1">{{ item.currentSettleComeMoney }}</td>
            <td
              class="td1"
              style="text-align:center;"
            >
              <a-popconfirm
                title="确定删除吗?"
                @confirm="() => handleOpenDel(index)"
                v-has="'wxhr:tengineeringformticket_del'"
              >
                <a-icon
                  type="delete"
                  style="color:red;cursor:pointer"
                />
              </a-popconfirm>
            </td>
          </tr>
        </table>
      </div>

    </a-card>
    <a-modal
      title="添加自定义项"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleCancel(2)"
      @ok="handleDiyOk()"
      cancelText="取消"
      okText="保存"
      :visible="diyVisible"
      :confirmLoading="diyConLoading"
    >
      <a-spin :spinning="diyLoading">
        <a-form :form="diyForm">
          <a-form-item
            label="是否参与计算"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-radio-group v-decorator="['calculateFlag', validatorRules.calculateFlag]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="2">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="项目类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input :readOnly="true" @click="focusSelect" placeholder="请选择项目类别" v-decorator="['itemTypeName',validatorRules.itemTypeName]"/>
            <a-input type="hidden" v-decorator="['itemType']" />
          </a-form-item>
          <a-form-item
            label="项目说明"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="['subName',validatorRules.subName]" />
          </a-form-item>
          <a-form-item
            label="金额"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="['money', validatorRules.money]" />
          </a-form-item>
          <a-form-item
            label="暂停发"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select
              v-decorator="['isPause',validatorRules.isPause]"
              placeholder="请选择"
            >
              <a-select-option value="1">暂停发</a-select-option>
              <a-select-option value="2">不发放</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <!-- 添加开票信息 -->
    <a-modal
      title="添加差余额"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleCancelOpen()"
      @ok="handleOpenOk()"
      cancelText="取消"
      okText="保存"
      :visible="openVisible"
      :confirmLoading="openConLoading"
    >

      <a-form :form="openForm">
        <a-form-item
          label="开票日期"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-date-picker
            style="width: 100%"
            v-decorator="['ticketTime',{ rules: [{required: true, message: '请选择开票日期!' }] }]"
            placeholder="请选择开票日期"
          />
        </a-form-item>
        <a-form-item
          label="开票金额"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            placeholder="请填开票金额"
            v-decorator="['money', { rules: [{required: true, pattern:/^(-?)[0-9]+(.[0-9]{1,2})?$/,message: '请输入正确金额!' }] }]"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item
          label="本次结算金额"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            placeholder="请填本次结算金额"
            v-decorator="['currentSettleMoney', { rules: [{required: true, pattern:/^(-?)[0-9]+(.[0-9]{1,2})?$/,message: '请输入正确金额!' }] }]"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item
          label="本次结算到账金额"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            placeholder="请填写本次结算到账金额"
            v-decorator="['currentSettleComeMoney', { rules: [{required: true, pattern:/^(-?)[0-9]+(.[0-9]{1,2})?$/,message: '请输入正确金额!' }] }]"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      title="修改管理费"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleCancelManage"
      @ok="handleOkMange"
      cancelText="取消"
      okText="保存"
      :visible="manageVisible"
      :confirmLoading="manageLoading"
    >

      <a-form :form="manageForm">
        <a-form-item
          label="金额"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-input
            style="width: 191px"
            v-decorator="['money', { rules: [{required: true, pattern:/^(-?)[0-9]+(.[0-9]{1,2})?$/,message: '请输入正确金额!' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 修改开票合计金额 -->
    <other-invoice-apply-entrance-modal
      ref="otherInvoiceApplyEntranceModal"
      @ok="otherInvoiceApplyEntranceModalOk"
    ></other-invoice-apply-entrance-modal>
    <select-item-modal ref="SelectItemModalForm" @ok="selectCallback"></select-item-modal>
    <error-modal ref="errorModal"></error-modal>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import { httpAction, getAction,httpActionHeader } from '@/api/manage'
import OtherInvoiceApplyEntranceModal from '../../../web/tfinancial/invoicemanage/modules/OtherInvoiceApplyEntranceModal'
import SelectItemModal from '../../../salarystandard/modules/SelectItemModal'
import { getItemName,handleImportData,formatFloat } from '@/utils/common'
import XLSX from 'xlsx'
import ErrorModal from './ErrorModal'

export default {
  name: 'SalaryEngineSettleAccountModal',
  components: {
    OtherInvoiceApplyEntranceModal, // 新开票申请Model
    SelectItemModal,
    ErrorModal
  },
  data() {
    return {
      headerColumns: [
        {
          title: '结算主体',
          dataIndex: 'settleDepartName'
        },
        {
          title: '结算编码名称',
          dataIndex: 'settleDepartNo'
        },
        {
          title: '结算时间',
          dataIndex: 'settleMonth'
        },
        {
          title: '皖信盖章'
        }
      ],
      balanceColumns: [
        {
          title: '月份',
          dataIndex: 'month'
        },
        {
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '项目',
          dataIndex: 'project'
        },
        {
          title: '金额',
          dataIndex: 'money'
        },
        {
          title: '原因',
          dataIndex: 'cause'
        },
        {
          title: '操作',
          key: 'operation',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      balanceVisible: false,
      diyVisible: false,
      detailVisible: false,
      battleFormLoading: false,
      diyLoading: false,
      manageVisible: false,
      diyConLoading: false,
      openVisible: false, // 开票弹框
      openConLoading: false, // 开票加载
      diyForm: this.$form.createForm(this),
      battleForm: this.$form.createForm(this),
      detailForm: this.$form.createForm(this),
      manageForm: this.$form.createForm(this),
      openForm: this.$form.createForm(this),
      diyFormModel: {},
      battleFormModel: {},
      manageFormModel: {},
      deptTax: '',
      url: {
        settleUrl: '/hrBase/tdepartsettlementinfo/getBySettlementId',
        saveSettleUrl: '/salary/tengineeringsettlementsub/addSub',
        getSettleUrl: '/salary/tsettlementhform/',
        delSubUrl: '/salary/tengineeringsettlementsub/',
        addBalanceUrl: '/salary/tpoorbalanceinfo/savePoorBalance',
        editBalanceUrl: '/salary/tpoorbalanceinfo',
        delBalanceUrl: '/salary/tpoorbalanceinfo/',
        editManageUrl: '/salary/tengineeringsettlementform',
        addTicket: '/salary/tengineeringformticket',
        editSalaryUrl: '/salary/tsalaryengineering'
      },
      validatorRules: {
        itemTypeName: { rules: [{ required: true, message: '请选择子项目类别!' }] },
        isPause: { rules: [{ required: true, message: '请选择暂停发!' }] },
        money: { rules: [{ required: true, message: '请填写金额!' }, { validator: this.isNumber }] },
        calculateFlag: { rules: [{ required: true, message: '请选择是否参与计算!' }] },
        subName:{rules: [{ max: 200, message: '项目说明不能超过200个字符!' }]}
      },
      settlementId: '',
      settlementFormId: 1,
      tDepartSettlementInfo: {},
      managementInfo: {},
      managementMoneyTwo: '',
      managementMoneyTwoTax: '',
      managementMoneyTwoTicket: '',
      tax: '',
      withholdData: [],
      balanceData: [],
      settleDeail: {},
      oneBattleData: {},
      manageLoading: false,
      salaryInfo: [],
      orgList: [],
      coverData: [],
      openData: [],
      fileList: [],
      fieldsList: {
        '开票日期':'ticketTime',
        '开票金额':'money',
        '本次结算到账金额':'currentSettleComeMoney',
        '本次结算金额':'currentSettleMoney',
      },
      pauseTxt:{
        '1': '(暂停发)',
        '2': '(不发放)',
      },
    }
  },
  props: {
    salaryStandardInfo: {
      type: Object,
      required: true
    },
    settlementhFormInfo: {
      type: Object,
      required: true
    },
    pauseDiyInfoList: {
      type: Array,
      required: true
    },
    poorBalanceInfoList: {
      type: Array,
      required: true
    },
    salaryAccountOne: {
      type: Object,
      required: true
    },
    engineerAccountList: {
      type: Array,
      required: true
    },
    paushTypeObject: {
      type: Object,
      required: false,
      default: ()=>{},
    }
  },
  methods: {
    getItemName,
    formateDate(str){
      return str ? moment(str).format('YYYY-MM-DD') : ''
    },
    show() {
      this.salaryInfo = []
      if (!this.settleDeail.id) {
        this.settleDeail = this.settlementhFormInfo
      }
      this.settlementId = this.settlementhFormInfo.settleDepartId
      this.settlementFormId = this.settlementhFormInfo.id
      this.withholdData = this.pauseDiyInfoList
      this.balanceData = this.poorBalanceInfoList
      this.salaryInfo.push({
        id: 1,
        settleDepartName: this.salaryStandardInfo.departName,
        belongDeptId: this.salaryStandardInfo.belongDeptId,
        settleMonth: this.salaryStandardInfo.settlementMonth,
        settleDepartNo: this.salaryStandardInfo.departNo
      })
      //获取所有公司数据
      getAction('/admin/organizationinfo/getOrgForCus').then(res => {
        if (Number(res.code) === 200) {
          this.orgList = res.data
        }
      })
    },
    focusSelect(){
      this.$refs.SelectItemModalForm.show(this.paushTypeObject.paushTypeOption,this.paushTypeObject.paushTypeTwoOption)
    },
    selectCallback(value,label){
      this.$nextTick(()=>{
        this.diyForm.setFieldsValue(pick({itemTypeName:label,itemType:value}, 'itemTypeName','itemType'))
      })
    },
    handleDownloadTemplate(templateUrl) {
      const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
      window.location.href = url
    },
    beforeUpload(file) {
      this.fileList = [file]
      return false
    },
    handleImport(url,method){
      const { fileList } = this
      this.uploadFilesChange(fileList[0],url,method)
    },
    validateFields(list,id){
      const data = []
      const error = []
      const pattern = /((^[1-9]\d*)|^0)(\.\d{1,2})?$/
      list.forEach((item,index) => {
        const obj = {}
        for(const key in item){
          const keyTemp = key.replace(/(^\s*)|(\s*$)/g, "")
          switch(keyTemp){
            case '开票日期':
              if (!new RegExp(/^(\d{4})-(\d{2})-(\d{2})$/).test(item[key])) {
                error[index] = {message:`第${index+2}行开票日期格式不正确!`}
              }
              item[key] = moment(item[key]).format('YYYY-MM-DD HH:mm:ss')
              break
            case '开票金额':
              if (!new RegExp(pattern).test(item[key])) {
                error[index] = {message:`第${index+2}行开票金额格式不正确!`}
              }
              break
            case '本次结算到账金额':
              if (!new RegExp(pattern).test(item[key])) {
                error[index] = {message:`第${index+2}行本次结算到账金额格式不正确!`}
              }
              break
            case '本次结算金额':
              if (!new RegExp(pattern).test(item[key])) {
                error[index] = {message:`第${index+2}行本次结算金额格式不正确!`}
              }
              break
          }
          obj[this.fieldsList[keyTemp]] = item[key]
          obj['engineeringForm'] = id
        }
        data.push(obj)
      })
      return {data:data,error:error}
    },
    uploadFilesChange(file,url,method) {
      // 通过FileReader对象读取文件
      const fileReader = new FileReader()
      fileReader.onload = event => {
        try {
          const { result } = event.target
          // 以二进制流方式读取得到整份excel表格对象
          const workbook = XLSX.read(result, { type: 'binary' })
          // 存储获取到的数据
          const data = {}
          let sheetName = ''
          // 遍历获取每张工作表 除去隐藏表
          const allSheets = workbook.Workbook.Sheets
          for(const index in allSheets){
            const name = allSheets[index].name
            if(workbook.Sheets.hasOwnProperty(name) && allSheets[index].Hidden === 0){
              sheetName = name
              // 利用 sheet_to_json 方法将 excel 转成 json 数据
              data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name],{defval:'',blankrows:true}))
              break
            }
          }
          const ress = this.validateFields(data[sheetName],this.settlementhFormInfo.salaryEngineeringId)
          if(ress.error.length){
            this.$refs.errorModal.title = `导入提示`
            this.$refs.errorModal.showModal(ress.error)
            return false
          }

          // 去除空格
          const newData = handleImportData(ress['data'])
          const contextType = {'Content-Type': 'application/json;charset=UTF-8'}
          const requestTimeOut = 600000  // 请求过期时间
          httpActionHeader(url, JSON.stringify(newData),method,contextType,requestTimeOut).then((res) => {
            if (res.code === 200) {
              this.$message.success("上传成功！")
              this.openData = this.openData.concat(res.data)
            } else {
              this.$message.error(res.msg)
            }
          }).finally(()=>{
            this.fileList = []
            return true
          })
        } catch (e) {
          console.log(e)
          // 这里可以抛出文件类型错误不正确的相关提示
          this.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
    },

    addModal(num) {
      switch (num) {
        case 1:
          this.balanceVisible = true
          this.battleForm.resetFields()
          this.oneBattleData = {}
          break
        case 2:
          this.diyForm.resetFields()
          this.diyFormModel = {}
          // var url = this.url.settleUrl + '?settlementId=' + this.settlementId
          // httpAction(url,{},'POST').then((res) => {
          //   if(Number(res.code) === 200){
          //     this.tDepartSettlementInfo = res.data
          //     if(res.data.taxType > 1){
          //       this.deptTax = 0
          //     }else{
          //       this.deptTax = res.data.taxFee
          //     }
          //   }
          // })
          // httpAction(this.url.getSettleUrl + this.settlementFormId,{},'GET').then((res) => {
          //   this.managementInfo = res.data
          //   this.managementMoneyTwo = parseFloat(res.data.managementMoneyTwo)
          //   this.managementMoneyTwoTax = res.data.managementMoneyTwoTax
          //   this.managementMoneyTwoTicket = res.data.managementMoneyTwoTicket
          // })
          this.diyVisible = true
          break
        case 3:
          this.detailVisible = true
          break
      }
    },

    handleOkMange() {
      this.manageForm.validateFields(['money'], (err, values) => {
        if (!err) {
          const less = this.settleDeail.managementCost - values.money
          let formData = {}
          formData.id = this.settlementFormId
          formData.accountMoneySum = formatFloat(parseFloat(this.settleDeail.accountMoneySum) - parseFloat(less))
          formData.managementCost = values.money
          formData.managementCostTicket = values.money
          httpAction(this.url.editManageUrl, formData, 'PUT').then(res => {
            this.manageVisible = false
            if (Number(res.code) === 200) {
              httpAction(
                this.url.editSalaryUrl,
                { id: this.salaryStandardInfo.id, settlementAmount: formData.accountMoneySum },
                'PUT'
              ).then(result => {
                console.log(result)
              })
              this.$message.success('修改成功')
              this.settleDeail.accountMoneySum = formData.accountMoneySum
              this.settleDeail.managementCost = formData.managementCost
              this.settleDeail.managementCostTicket = formData.managementCostTicket
            }
          })
        }
      })
    },
    handleCancel(num) {
      switch (num) {
        case 1:
          this.balanceVisible = false
          break
        case 2:
          this.diyVisible = false
          break
        case 3:
          this.detailVisible = false
          break
      }
    },
    // 保存自定义项
    handleDiyOk() {
      this.diyForm.validateFields((err, values) => {
        if (!err) {
          this.diyConLoading = true
          let formData = Object.assign(this.diyFormModel, values)
          const url = `${this.url.saveSettleUrl}?engineeringSetId=${this.engineerAccountList[0].enginnerSetId}`
          formData.engineeringSettlementId = this.settlementFormId
          httpAction(url, formData, 'POST').then(res => {
            if (Number(res.code) === 200) {
              this.$message.success('保存成功')
              this.diyVisible = false
              this.withholdData.push(res.data.engineeringSettlementSub)
              if (formData.calculateFlag == 1) {
                this.settleDeail = res.data.engineeringSettlementForm
              }
            }
            this.diyConLoading = false
          })
        }
      })
    },

    handleEditBattle(record) {
      this.battleForm.resetFields()
      this.oneBattleData = record
      this.battleFormModel = Object.assign(this.battleFormModel, record)
      this.battleFormModel.month = moment(record.month, 'YYYY-MM')
      this.battleForm.setFieldsValue(pick(this.battleFormModel, 'name', 'money', 'project', 'cause', 'month'))
      this.balanceVisible = true
    },
    // 删除自定义项
    deleteSub(index) {
      const url = `${this.url.delSubUrl}${this.withholdData[index].id}?engineeringSetId=${this.engineerAccountList[0].enginnerSetId}`
      httpAction(url, {}, 'DELETE').then(res => {
        if (Number(res.code) === 200) {
          if (String(this.withholdData[index].calculateFlag) === '1') {
            this.settleDeail = res.data.engineeringSettlementForm
          }
          // this.coverData = res.data.salaryCover
          // this.$emit('update')
          this.withholdData.splice(index, 1)
          this.$message.success('删除成功')
        }
      })
    },
    handleDeleteBattle(id) {
      const url = this.url.delBalanceUrl + id
      httpAction(url, {}, 'DELETE').then(res => {
        if (Number(res.code) === 200) {
          for (var c in this.balanceData) {
            if (this.balanceData[c].id == id) {
              this.balanceData.splice(c, 1)
            }
          }
        }
      })
    },
    // 修改管理费2
    handleEditManage() {
      this.deptTax = 6.78
      this.manageForm.resetFields()
      this.manageFormModel = {}
      this.manageFormModel.tax = parseFloat(0)
      this.manageVisible = true
    },

    // 点击修改开票金额合计
    handleInvoiceInfo() {
      // 购买方信息
      const buyerSetting = {
        settleDomainId: this.salaryStandardInfo.departId,
        settleDomainName: this.salaryStandardInfo.departName,
        settleDomainNo: this.salaryStandardInfo.departNo
      }
      // 结算单
      const settleList = [
        {
          settleFormId: this.settlementhFormInfo.id,
          settleFormType: '1', // 0普通工资、0非扣税类、1工程工资
          settleMoney: this.settlementhFormInfo.accountMoneySum || 0,
          settleMonth: this.settlementhFormInfo.settleMonth
        }
      ]
      this.$refs.otherInvoiceApplyEntranceModal.title = '开票申请 - 新建'
      this.$refs.otherInvoiceApplyEntranceModal.pageType = 1
      this.$refs.otherInvoiceApplyEntranceModal.buyerSetting = buyerSetting
      this.$refs.otherInvoiceApplyEntranceModal.selectionRows = settleList
      this.$refs.otherInvoiceApplyEntranceModal.show()
    },

    // 开票入口点击保存后回调
    otherInvoiceApplyEntranceModalOk(data) {
      // 开票金额合计
      const total = parseFloat(this.settleDeail.ticketMoneySum) + parseFloat(data.ticketMoney)
      this.settleDeail.ticketMoneySum = total.toFixed(2)
    },

    handleCancelManage() {
      this.manageVisible = false
    },
    editBlurMoney(e) {
      let money = isNaN(e.target.value) ? 0 : e.target.value
      let ticket = ''
      if (this.manageFormModel.tax) {
        ticket = parseFloat(parseFloat(money) + parseFloat(money * (this.manageFormModel.tax / 100))).toFixed(2)
      } else {
        ticket = money
      }
      this.manageFormModel.money = money
      this.manageFormModel.ticket = ticket
      this.manageForm.setFieldsValue(pick(this.manageFormModel, 'ticket'))
    },
    editChangeTax(value) {
      let money = isNaN(this.manageFormModel.money) ? 0 : this.manageFormModel.money
      let ticket = ''
      if (String(value) === '0') {
        this.manageFormModel.tax = 0
        ticket = parseFloat(money).toFixed(2)
      } else {
        this.manageFormModel.tax = this.deptTax
        ticket = parseFloat(parseFloat(money) + parseFloat(money * (this.manageFormModel.tax / 100))).toFixed(2)
      }
      this.manageFormModel.ticket = ticket
      this.manageForm.setFieldsValue(pick(this.manageFormModel, 'ticket'))
    },

    //修改备注
    blurSettleRemark(e) {
      this.settleRemark = e.target.value
      if (e.target.value) {
        let formData = {}
        formData.remark = e.target.value
        formData.id = this.settlementFormId
        httpAction(this.url.editManageUrl, formData, 'PUT').then(res => {
          if (Number(res.code) === 200) {
            this.$message.success('修改成功')
            this.settleDeail.remark = e.target.value
          }
        })
      } else {
        this.settleDeail.remark = e.target.value
      }
    },

    //添加开票信息弹框
    handleOpen() {
      this.openForm.resetFields()
      this.openVisible = true
    },
    // 取消开票弹框
    handleCancelOpen() {
      this.openVisible = false
    },
    // 保存开票
    handleOpenOk() {
      this.openForm.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          this.openConLoading = true
          let formData = Object.assign({}, values)
          formData.ticketTime = formData.ticketTime.format('YYYY-MM-DD HH:mm:ss')
          formData.engineeringForm = this.salaryStandardInfo.id
          httpAction(this.url.addTicket, formData, 'POST').then(res => {
            if (Number(res.code) === 200) {
              this.openData.push(res.data)
              this.$message.success('保存成功')
              this.openVisible = false
            } else {
              this.$message.error(res.msg)
            }
            this.openConLoading = false
          })
        }
      })
    },
    //删除差余额
    handleOpenDel(index) {
      const id = this.openData[index].id
      httpAction(`${this.url.addTicket}/${id}`, {}, 'delete').then(res => {
        if (Number(res.code) === 200) {
          this.openData.splice(index, 1)
          this.$message.success('删除成功')
        }
      })
    },

    // 验证数字
    isNumber(rule, value, callback) {
      //const reg = /^[0-9]+(.[0-9]{1,2})?$/
      const reg = /^(-?)[0-9]+(.[0-9]{1,2})?$/
      if (!reg.test(value) && value != '') {
        callback(new Error('请输入正确的金额'))
      } else {
        callback()
      }
    }
  }
}
</script>
<style scoped>
.tablePage {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  width: 100%;
}
.table1 {
  border: 1px solid #ccc;
  width: 90%;
  border-collapse: collapse;
  border-spacing: 0;
  margin: 10px auto 30px;
}
.table1 .tr1 {
  margin: 0px;
  padding: 0;
  width: 100%;
}
.table1 .td1 {
  border: solid #999 1px;
  margin-left: 10px;
  height: 40px;
  padding: 10px;
  width: 20%;
  color: #000;
  max-width: 400px;
}
.table1 .td2 {
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 40px;
  padding: 10px;
  width: 17%;
  text-align: center;
}
.table1 .tit {
  font-weight: bolder;
  background-color: #ddd;
}
.table1 .input1 {
  height: 35px;
  width: 100%;
  padding: 0 5px;
}
.table1 .btn {
  width: 20%;
  font-size: 16px;
  border: none;
  background: red;
  color: #fff;
  float: right;
}
.table2 {
  text-align: center;
  display: block;
  width: 83%;
  margin: 20px auto 10px;
}
.num {
  margin-top: 20px;
}
.tabDiv {
  box-shadow: 0 0 1px 1px #aaa, 3px 0 5px 0 #aaa, 0 4px 7px 0 #aaa;
  border: 1px solid;
  width: 100%;
  margin: 44px auto;
}
.tabDiv h2 {
  text-align: center;
  margin-top: 10px;
}
</style>
