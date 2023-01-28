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
        @click="handleBack"
        style="background-color: rgba(255, 51, 51, 1); border-color: rgba(255, 51, 51, 1);"
      >退回</a-button>
      <router-link
        target="_blank"
        style="margin-left:8px; margin-right:8px"
        :to="{path: '/pdf/SocialApprovalSalaryDetailPrintf', query: {id: tabPaneFourData.id}}"
      >
        <a-button type="primary">打印封面</a-button>
      </router-link>
      <a-button
        type="primary"
        :loading="downLoading"
        @click="handleExport"
      >导出</a-button>
      <a-button
        type="primary"
        @click="handleOk"
      >确认出账</a-button>
    </template>

    <a-tabs
      :activeKey="activeKey"
      @change="tabsChange"
    >
      <a-tab-pane
        :forceRender="true"
        tab="申请表"
        key="1"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="tabPaneOne"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col :span="24">
                <a-table
                  rowKey="id"
                  :columns="columns"
                  :dataSource="dataSource"
                  :scroll="{ x: 2220, y: 400 }"
                >
                  <!-- 列缩放隐藏模板 -->
                  <template
                    v-for="(defineColumn, key) in tabPaneOneDefineColumns"
                    :slot="key"
                    slot-scope="text, record"
                  >
                    <span
                      :key="key"
                      :style="handleColumnStyle(defineColumn.width)"
                    >
                      <!-- 结算主体或者单位 -->
                      <a-tooltip
                        v-if="defineColumn.type=='settle'"
                        placement="topLeft"
                        :title="((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[defineColumn.key])) ? (defineColumn.options)[record[defineColumn.key]][defineColumn.name] : '-'"
                      >
                        {{ ((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[defineColumn.key])) ? (defineColumn.options)[record[defineColumn.key]][defineColumn.name] : '-' }}
                      </a-tooltip>
                      <!-- 普通数据 -->
                      <a-tooltip
                        v-else
                        placement="topLeft"
                        :title="record[key] ? record[key] : '-'"
                      >
                        {{ record[key] ? record[key] : '-' }}
                      </a-tooltip>
                    </span>
                  </template>
                </a-table>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        :forceRender="true"
        tab="增减记录"
        key="2"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="tabPaneTwo"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="上月汇缴人数"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="!isVerify"
                    placeholder="请填写上月缴纳人数"
                    v-decorator="['lastMonthNum', {}]"
                    style="width: 191px"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="本月汇缴人数"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="!isVerify"
                    placeholder="请填写本月汇缴人数"
                    v-decorator="['thisMonthNum', {}]"
                    style="width: 191px"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="本月减少人数"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="!isVerify"
                    placeholder="请填写本月减少人数"
                    v-decorator="['thisMonthReduce', {}]"
                    style="width: 191px"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="本月增加人数"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="!isVerify"
                    placeholder="请填写本月增加人数"
                    v-decorator="['thisMonthAdd', {}]"
                    style="width: 191px"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        :forceRender="true"
        tab="封面"
        key="3"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="tabPaneThree"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col :span="24">
                <a-tabs
                  :activeKey="tabsPaneThreeActiveKey"
                  @change="tabsPaneThreeChange"
                >
                  <a-tab-pane
                    :forceRender="true"
                    v-for="(value, key) in tabPaneThreeData"
                    :tab="tabName+(key+1)"
                    :key="key+1"
                  >
                    <a-card>
                      <a-row type="flex">
                        <a-col
                          style="text-align:center;font-size:15px;font-weight:bolder;color:#333"
                          :span="12"
                          :offset="6"
                        >{{ value.tableHead ? value.tableHead : '' }}</a-col>
                        <a-col
                          style="text-align:center;font-size:20px;font-weight:bolder;color:#333;margin-top:10px"
                          :span="12"
                          :offset="6"
                        >银行转账审批单</a-col>
                      </a-row>
                      <table class="table1">
                        <tr class="tr1">
                          <td
                            class="td1"
                            colspan="2"
                          ></td>
                          <td
                            class="td1"
                            colspan="2"
                          >{{ value.createTime ? moment(value.createTime).format(dateFormat) : '' }}</td>
                          <td class="td1">部门编码</td>
                          <td class="td1">{{ value.departNo ? value.departNo : '' }}</td>
                        </tr>
                        <tr class="tr1">
                          <td
                            class="td1"
                            colspan="2"
                          >
                            <p class="font18">单位</p>
                            <p>{{ value.unitName ? value.unitName : '' }}</p>
                          </td>
                          <td
                            class="td1"
                            colspan="2"
                          >
                            <p class="font18">项目</p>
                            <p>{{ value.itemName ? value.itemName : '' }}</p>
                          </td>
                          <td class="td1">
                            <p class="font18">付款方式</p>
                            <p
                              v-for="(item, index) in payTypeBelongs"
                              :key="index"
                            ><span v-if="value.payType==item.value">{{ item.label }}</span></p>
                          </td>
                          <td class="td1">
                            <p class="font18">金额</p>
                            <p>¥{{ value.amount }}</p>
                          </td>
                        </tr>
                        <tr class="tr1">
                          <td
                            class="td1"
                            colspan="2"
                          >合计人民币:</td>
                          <td
                            style="font-weight:bolder;text-align:left"
                            class="td1"
                            colspan="3"
                          >{{ value.amountRmb ? value.amountRmb : '' }}</td>
                          <td class="td1">¥{{ value.amount }}</td>
                        </tr>
                        <tr>
                          <td class="td1">收款单位名称:</td>
                          <td class="td1">
                            <a-form-item class="tableFormItem">
                              <a-input
                                v-if="isVerify"
                                :disabled="!isVerify"
                                :style="editTableStyle"
                                :name="'receiptName_'+key"
                                v-decorator="['receiptName_'+key, {}]"
                              />
                              <a-tooltip
                                v-else
                                placement="top"
                                :title="value.receiptName ? value.receiptName : '-'"
                              >
                                <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 170px;">{{ value.receiptName ? value.receiptName : '-' }}</span>
                              </a-tooltip>
                            </a-form-item>
                          </td>
                          <td class="td1">账户:</td>
                          <td class="td1">
                            <a-form-item class="tableFormItem">
                              <a-input
                                v-if="isVerify"
                                :disabled="!isVerify"
                                :style="editTableStyle"
                                :name="'receiptBankNo_'+key"
                                v-decorator="['receiptBankNo_'+key, {}]"
                              />
                              <a-tooltip
                                v-else
                                placement="top"
                                :title="value.receiptBankNo ? value.receiptBankNo : '-'"
                              >
                                <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 170px;">{{ value.receiptBankNo ? value.receiptBankNo : '-' }}</span>
                              </a-tooltip>
                            </a-form-item>
                          </td>
                          <td class="td1">开户行:</td>
                          <td class="td1">
                            <a-form-item class="tableFormItem">
                              <a-input
                                v-if="isVerify"
                                :disabled="!isVerify"
                                :style="editTableStyle"
                                :name="'receiptBankName_'+key"
                                v-decorator="['receiptBankName_'+key, {}]"
                              />
                              <a-tooltip
                                v-else
                                placement="top"
                                :title="value.receiptBankName ? value.receiptBankName : '-'"
                              >
                                <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 170px;">{{ value.receiptBankName ? value.receiptBankName : '-' }}</span>
                              </a-tooltip>
                            </a-form-item>
                          </td>
                        </tr>
                        <tr>
                          <td class="td1">备注:</td>
                          <td
                            class="td1"
                            colspan="5"
                          >
                            <a-form-item class="tableFormItem">
                              <input
                                :disabled="!isVerify"
                                style="border:0;width:870px;height:23px;background-color: #ffffff;"
                                :value="value.remark"
                                :name="'remark_'+key"
                              >
                            </a-form-item>
                          </td>
                        </tr>
                      </table>
                      <a-row type="flex">
                        <a-col :span="4">公司领导：</a-col>
                        <a-col :span="4">财务负责人：</a-col>
                        <a-col :span="4">网银审核授权人：</a-col>
                        <a-col :span="5">网银转账提交人：{{ tabPaneFourData.lssueUserName }}</a-col>
                        <a-col :span="4">数据审核：{{ tabPaneFourData.auditUserName }}</a-col>
                        <a-col :span="3">制表人：{{ tabPaneFourData.createUserName }}</a-col>
                      </a-row>
                    </a-card>
                  </a-tab-pane>
                </a-tabs>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        :forceRender="true"
        tab="核准"
        key="4"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="tabPaneFour"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="是否转账"
                  class="stepFormText"
                >
                  <a-radio-group
                    :disabled="!isVerify"
                    class="fontiframe"
                    name="radioGroup"
                    v-decorator="['tranferFlaf', {initialValue: '0'}]"
                  >
                    <a-radio
                      class="radioGroup"
                      v-for="(value, key) in statusOptions"
                      :key="key"
                      :value="key"
                    >{{ value.option }}</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="结算金额"
                  class="stepFormText"
                >
                  {{ tabPaneFourData.settlementAmount }}
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="开票金额"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="!isVerify"
                    placeholder="请填写开票金额"
                    v-decorator="['ticketAmount', {}]"
                    style="width: 191px"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="16">
                <a-form-item
                  label="备注"
                  class="stepFormText"
                >
                  <a-textarea
                    :disabled="!isVerify"
                    :rows="1"
                    placeholder="请填写备注"
                    v-decorator="['remark', {}]"
                    style="width: 400px"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>
    </a-tabs>
    <social-fund-back-modal
      ref="socialFundBackModal"
      @ok="socialFundBackModalFormOk"
    ></social-fund-back-modal>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import SocialFundBackModal from './SocialFundBackModal'
  import {mapGetters} from "vuex"

  export default {
    name: 'SocialApprovalSalaryDetailModal',
    components: {
      SocialFundBackModal,
    },
    data() {
      return {
        moment,
        model: {},
        title: '操作',
        tabName: '封面',  // 封面名称
        visible: false,
        isVerify: false, // 是否显示确定按钮
        activeKey: '1', // 默认第一个tab
        downLoading: false,
        tabsPaneThreeActiveKey: 1, // 默认第一个tab
        confirmLoading: false,
        tabPaneOne: this.$form.createForm(this),
        tabPaneTwo: this.$form.createForm(this),
        tabPaneThree: this.$form.createForm(this),
        tabPaneFour: this.$form.createForm(this),
        columns: [],  // 行
        dataSource: [], // 数据
        tabPaneTwoData: {}, // 增减记录数据
        itemListLenght: 0,  // 分项长度
        tabPaneThreeData: {}, // 封面数据
        editTableData: {}, // 表单可修改数据
        editTableStyle: 'border:0;height:23px;', // 表单样式（查看的时候输入框隐藏）
        tabPaneFourData: {}, // 核准数据
        dateFormat: "YYYY年MM月DD日",
        payTypeBelongs: [], // 付款方式
        statusOptions: {'0': {'option': '是', 'color': 'green'}, '1': {'option': '否', 'color': 'red'}}, // 状态
        tabPaneOneDefineColumns: {unitName: {width: 160}, departName: {width: 140}, paymentUnitOfOurCompany: {width: 160}},  // 隐藏列字段数组
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      }
    },
    methods: {
      ...mapGetters(["nickname"]),
      edit(record) {
        this.tabPaneOne.resetFields()
        this.tabPaneTwo.resetFields()
        this.tabPaneThree.resetFields()
        this.tabPaneFour.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true

        if (this.isVerify) {
          this.editTableStyle = 'height:23px;' // 表单样式（查看的时候输入框隐藏）
        }

        /**************************************************** 申请表数据 ****************************************************/
        this.dataSource = this.model.socialAprovalFormReportList
        this.columns = [
          { title: '单位名称', dataIndex: 'unitName', key: 'unitName', fixed: 'left', width: 200, align: 'center', scopedSlots: { customRender: 'unitName' } },
          { title: '结算主体', dataIndex: 'departName', key: 'departName', fixed: 'left', width: 180, align: 'center', scopedSlots: { customRender: 'departName' } },
          { title: '应交人数', dataIndex: 'personCount', key: 'personCount', width: 90, align: 'center' },
          { title: '单位养老', dataIndex: 'unitPension', key: 'unitPension', width: 90, align: 'center' },
          { title: '单位医疗', dataIndex: 'unitMedical', key: 'unitMedical', width: 90, align: 'center' },
          { title: '单位失业', dataIndex: 'unitUnemployment', key: 'unitUnemployment', width: 90, align: 'center' },
          { title: '单位工伤', dataIndex: 'unitWorkInjury', key: 'unitWorkInjury', width: 90, align: 'center' },
          { title: '单位生育', dataIndex: 'unitBirth', key: 'unitBirth', width: 90, align: 'center' },
          { title: '单位补缴利息', dataIndex: 'companyAccrual', key: 'companyAccrual', width: 120, align: 'center' },
          { title: '单位大病救助', dataIndex: 'unitBigmailment', key: 'unitBigmailment', width: 120, align: 'center' },
          { title: '单位合计', dataIndex: 'unitSum', key: 'unitSum', width: 90, align: 'center' },
          { title: '个人养老', dataIndex: 'personalPension', key: 'personalPension', width: 90, align: 'center' },
          { title: '个人医疗', dataIndex: 'personalMedical', key: 'personalMedical', width: 90, align: 'center' },
          { title: '个人失业', dataIndex: 'personalUnemployment', key: 'personalUnemployment', width: 90, align: 'center' },
          { title: '个人补缴利息', dataIndex: 'personalAccrual', key: 'personalAccrual', width: 120, align: 'center' },
          { title: '个人大病救助', dataIndex: 'personalBigmailment', key: 'personalBigmailment', width: 120, align: 'center' },
          { title: '个人合计', dataIndex: 'personalSum', key: 'personalSum', width: 90, align: 'center' },
          { title: '应缴总合计', dataIndex: 'socialSum', key: 'socialSum', width: 100, align: 'center' },
          { title: '我司到款单位', dataIndex: 'paymentUnitOfOurCompany', key: 'paymentUnitOfOurCompany', width: 200, align: 'center', scopedSlots: { customRender: 'paymentUnitOfOurCompany' } },
        ]
        /**************************************************** 增减记录数据 ****************************************************/
        this.tabPaneTwoData = this.model.aprovalRecord
        this.$nextTick(() => {
          this.tabPaneTwo.setFieldsValue(pick(this.tabPaneTwoData, 'lastMonthNum', 'thisMonthNum', 'thisMonthReduce', 'thisMonthAdd'))
        })
        /**************************************************** 封面数据 ****************************************************/
        let aprovalCoverList = this.model.aprovalCoverList
        this.tabPaneThreeData = aprovalCoverList
        if (this.isVerify && Object.keys(aprovalCoverList).length > 0) {
          for (let i=0; i<Object.keys(aprovalCoverList).length; i++) {
            let receiptName = 'receiptName_' + i
            this.editTableData[receiptName] = aprovalCoverList[i]['receiptName']
            let receiptBankNo = 'receiptBankNo_' + i
            this.editTableData[receiptBankNo] = aprovalCoverList[i]['receiptBankNo']
            let receiptBankName = 'receiptBankName_' + i
            this.editTableData[receiptBankName] = aprovalCoverList[i]['receiptBankName']
            this.$nextTick(() => {
              this.tabPaneThree.setFieldsValue(pick(this.editTableData, receiptName, receiptBankNo, receiptBankName))
            })
          }
        }

        /**************************************************** 核准数据 ****************************************************/
        this.tabPaneFourData = this.model.socialAprovalForm
        this.$nextTick(() => {
          this.tabPaneFour.setFieldsValue(pick(this.tabPaneFourData, 'tranferFlaf', 'ticketAmount', 'remark'))
        })
      },
      // 退回
      handleBack() {
        this.$refs.socialFundBackModal.Type = '0' // 0社保 1公积金
        this.$refs.socialFundBackModal.title = '确认退回'
        this.$refs.socialFundBackModal.ids = this.model.socialAprovalForm.id
        this.$refs.socialFundBackModal.edit()
      },
      // 导出
      handleExport() {
        let url = 'hrSocial/tsocialaprovalform/getSocialAprovalAllInfoForExport?id=' + this.tabPaneFourData.id
        this.downLoading = true
        httpAction(url, {}, 'POST', 1000 * 60 * 5).then((res) => {
          if (Number(res.code) === 200 && res.data) {
            // let lockStatusOption = ['未锁定', '锁定']
            // let socialSettlementFlagOption = ['未结算', '待结算', '已结算']
            // let fundSettlementFlagOption = ['未结算', '待结算', '已结算']
            this.itemListLenght = res.data.itemList ?  res.data.itemList.length : 0// 分项长度

            let auditName = res.data.socialAprovalForm.auditUserName ? res.data.socialAprovalForm.auditUserName : ''  // 数据审核人
            let createName = res.data.socialAprovalForm.createUserName ? res.data.socialAprovalForm.createUserName : '' // 制表人
            // let revenueName = res.data.socialAprovalForm.lssueUserName ? res.data.socialAprovalForm.lssueUserName : ''  // 财务负责人
            //let submitUserName = res.data.socialAprovalForm.submitUserName ? res.data.socialAprovalForm.submitUserName : ''  // 网银转账提交人
            var excelDatas = []
            // 核准表
            let socialAprovalFormReportList = [
              {'unitName': res.data.socialAprovalForm.householName + res.data.socialAprovalForm.socialCreateMonth + '月份应交社保金额预核准申请表', 'departName': '', 'personCount': '', 'unitPension': '', 'unitMedical': '', 'unitUnemployment': '', 'unitWorkInjury': '', 'unitBirth': '', 'unitBigmailment': '', 'unitSum': '', 'personalPension': '', 'personalMedical': '', 'personalUnemployment': '', 'personalBigmailment': '', 'personalSum': '', 'socialSum': '', 'remark': '', 'paymentUnitOfOurCompany': ''},
              {'unitName': '单位名称', 'departName': '结算主体', 'personCount': '交社保人', 'unitPension': '单位部分', 'unitMedical': '', 'unitUnemployment': '', 'unitWorkInjury': '', 'unitBirth': '', 'unitBigmailment': '', 'unitSum': '', 'personalPension': '个人部分', 'personalMedical': '', 'personalUnemployment': '', 'personalBigmailment': '', 'personalSum': '', 'socialSum': '合计应交金额', 'remark': '备注', 'paymentUnitOfOurCompany': '我司到款单位'},
              {'unitName': '', 'departName': '', 'personCount': '', 'unitPension': '养老保险', 'unitMedical': '医疗保险', 'unitUnemployment': '失业保险', 'unitWorkInjury': '工伤保险', 'unitBirth': '生育保险', 'unitBigmailment': '大病救助', 'unitSum': '小计', 'personalPension': '养老保险', 'personalMedical': '医疗保险', 'personalUnemployment': '失业保险', 'personalBigmailment': '大病救助', 'personalSum': '小计', 'socialSum': '', 'remark': '', 'paymentUnitOfOurCompany': ''}
            ]
            let socialSum = {unitName: '合计', departName: '', remark: '', paymentUnitOfOurCompany: ''} // 申请表累计

            for (let item of res.data.socialAprovalFormReportList) {  // 处理数据
              item.remark = (item.remark ? item.remark : '')

              if (!item.paymentUnitOfOurCompany) {
                item.paymentUnitOfOurCompany = ''
              }
              // 计算合计
              socialSum.personCount = this.formatFloat((socialSum.personCount ? socialSum.personCount * 1 : 0) + item.personCount * 1)
              socialSum.unitPension = this.formatFloat((socialSum.unitPension ? socialSum.unitPension * 1 : 0) + item.unitPension * 1)
              socialSum.unitMedical = this.formatFloat((socialSum.unitMedical ? socialSum.unitMedical * 1 : 0) + item.unitMedical * 1)
              socialSum.unitUnemployment = this.formatFloat((socialSum.unitUnemployment ? socialSum.unitUnemployment * 1 : 0) + item.unitUnemployment * 1)
              socialSum.unitWorkInjury = this.formatFloat((socialSum.unitWorkInjury ? socialSum.unitWorkInjury * 1 : 0) + item.unitWorkInjury * 1)
              socialSum.unitBirth = this.formatFloat((socialSum.unitBirth ? socialSum.unitBirth * 1 : 0) + item.unitBirth * 1)
              socialSum.unitBigmailment = this.formatFloat((socialSum.unitBigmailment ? socialSum.unitBigmailment * 1 : 0) + item.unitBigmailment * 1)
              socialSum.unitSum = this.formatFloat((socialSum.unitSum ? socialSum.unitSum * 1 : 0) + item.unitSum * 1)
              socialSum.personalPension = this.formatFloat((socialSum.personalPension ? socialSum.personalPension * 1 : 0) + item.personalPension * 1)
              socialSum.personalMedical = this.formatFloat((socialSum.personalMedical ? socialSum.personalMedical * 1 : 0) + item.personalMedical * 1)
              socialSum.personalUnemployment = this.formatFloat((socialSum.personalUnemployment ? socialSum.personalUnemployment * 1 : 0) + item.personalUnemployment * 1)
              socialSum.personalBigmailment = this.formatFloat((socialSum.personalBigmailment ? socialSum.personalBigmailment * 1 : 0) + item.personalBigmailment * 1)
              socialSum.personalSum = this.formatFloat((socialSum.personalSum ? socialSum.personalSum * 1 : 0) + item.personalSum * 1)
              socialSum.socialSum = this.formatFloat((socialSum.socialSum ? socialSum.socialSum * 1 : 0) + item.socialSum * 1)

              socialAprovalFormReportList.push(item)
            }

            socialAprovalFormReportList.push(socialSum)

            excelDatas.push({
              tHeader: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
              filterVal: ['unitName', 'departName', 'personCount', 'unitPension', 'unitMedical', 'unitUnemployment', 'unitWorkInjury', 'unitBirth', 'unitBigmailment', 'unitSum', 'personalPension', 'personalMedical', 'personalUnemployment', 'personalBigmailment', 'personalSum', 'socialSum', 'remark', 'paymentUnitOfOurCompany'],
              tableDatas: socialAprovalFormReportList,
              sheetName: '核准表'
            })
            // 核准表-分项
            if(this.itemListLenght > 0){
              for (let item of res.data.itemList) {  // 处理数据
                let itemList = [
                  {'unitName': res.data.socialAprovalForm.householName + res.data.socialAprovalForm.socialCreateMonth + '月份应交社保金额预核准申请表', 'departName': '', 'personCount': '', 'unitPension': '', 'unitMedical': '', 'unitUnemployment': '', 'unitWorkInjury': '', 'unitBirth': '', 'unitBigmailment': '', 'unitSum': '', 'personalPension': '', 'personalMedical': '', 'personalUnemployment': '', 'personalBigmailment': '', 'personalSum': '', 'socialSum': '', 'remark': '', 'paymentUnitOfOurCompany': ''},
                  {'unitName': '单位名称', 'departName': '结算主体', 'personCount': '交社保人', 'unitPension': '单位部分', 'unitMedical': '', 'unitUnemployment': '', 'unitWorkInjury': '', 'unitBirth': '', 'unitBigmailment': '', 'unitSum': '', 'personalPension': '个人部分', 'personalMedical': '', 'personalUnemployment': '', 'personalBigmailment': '', 'personalSum': '', 'socialSum': '合计应交金额', 'remark': '备注', 'paymentUnitOfOurCompany': '我司到款单位'},
                  {'unitName': '', 'departName': '', 'personCount': '', 'unitPension': '养老保险', 'unitMedical': '医疗保险', 'unitUnemployment': '失业保险', 'unitWorkInjury': '工伤保险', 'unitBirth': '生育保险', 'unitBigmailment': '大病救助', 'unitSum': '小计', 'personalPension': '养老保险', 'personalMedical': '医疗保险', 'personalUnemployment': '失业保险', 'personalBigmailment': '大病救助', 'personalSum': '小计', 'socialSum': '', 'remark': '', 'paymentUnitOfOurCompany': ''}
                ]
                let companyName = ''
                let socialSum = {unitName: '合计', departName: '', remark: '', paymentUnitOfOurCompany: ''} // 申请表累计
                for (const value of item) {
                  value.remark = (value.remark ? value.remark : '')
                  if (!value.paymentUnitOfOurCompany) {
                    value.paymentUnitOfOurCompany = ''
                  }
                  companyName = value.paymentUnitOfOurCompany
                  // 计算合计
                  socialSum.personCount = this.formatFloat((socialSum.personCount ? socialSum.personCount * 1 : 0) + value.personCount * 1)
                  socialSum.unitPension = this.formatFloat((socialSum.unitPension ? socialSum.unitPension * 1 : 0) + value.unitPension * 1)
                  socialSum.unitMedical = this.formatFloat((socialSum.unitMedical ? socialSum.unitMedical * 1 : 0) + value.unitMedical * 1)
                  socialSum.unitUnemployment = this.formatFloat((socialSum.unitUnemployment ? socialSum.unitUnemployment * 1 : 0) + value.unitUnemployment * 1)
                  socialSum.unitWorkInjury = this.formatFloat((socialSum.unitWorkInjury ? socialSum.unitWorkInjury * 1 : 0) + value.unitWorkInjury * 1)
                  socialSum.unitBirth = this.formatFloat((socialSum.unitBirth ? socialSum.unitBirth * 1 : 0) + value.unitBirth * 1)
                  socialSum.unitBigmailment = this.formatFloat((socialSum.unitBigmailment ? socialSum.unitBigmailment * 1 : 0) + value.unitBigmailment * 1)
                  socialSum.unitSum = this.formatFloat((socialSum.unitSum ? socialSum.unitSum * 1 : 0) + value.unitSum * 1)
                  socialSum.personalPension = this.formatFloat((socialSum.personalPension ? socialSum.personalPension * 1 : 0) + value.personalPension * 1)
                  socialSum.personalMedical = this.formatFloat((socialSum.personalMedical ? socialSum.personalMedical * 1 : 0) + value.personalMedical * 1)
                  socialSum.personalUnemployment = this.formatFloat((socialSum.personalUnemployment ? socialSum.personalUnemployment * 1 : 0) + value.personalUnemployment * 1)
                  socialSum.personalBigmailment = this.formatFloat((socialSum.personalBigmailment ? socialSum.personalBigmailment * 1 : 0) + value.personalBigmailment * 1)
                  socialSum.personalSum = this.formatFloat((socialSum.personalSum ? socialSum.personalSum * 1 : 0) + value.personalSum * 1)
                  socialSum.socialSum = this.formatFloat((socialSum.socialSum ? socialSum.socialSum * 1 : 0) + value.socialSum * 1)
                  itemList.push(value)
                }

                itemList.push(socialSum)

                excelDatas.push({
                  tHeader: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
                  filterVal: ['unitName', 'departName', 'personCount', 'unitPension', 'unitMedical', 'unitUnemployment', 'unitWorkInjury', 'unitBirth', 'unitBigmailment', 'unitSum', 'personalPension', 'personalMedical', 'personalUnemployment', 'personalBigmailment', 'personalSum', 'socialSum', 'remark', 'paymentUnitOfOurCompany'],
                  tableDatas: itemList,
                  sheetName: '核准表分项' + '-' + companyName
                })
              }
            }
            // 汇缴统计
            excelDatas.push({
              tHeader: ['上月汇缴人数', '本月增加汇缴人数', '本月减少汇缴人数', '本月汇缴人数'],
              filterVal: ['lastMonthNum', 'thisMonthAdd', 'thisMonthReduce', 'thisMonthNum'],
              tableDatas: [res.data.aprovalRecord],
              sheetName: '汇缴统计'
            })

            // 缴费库
            let paymentInfoList = res.data.paymentAllInfoExportVoList
            for (let index in paymentInfoList) {
              paymentInfoList[index]['no'] = ''
              let socialPayAddr = paymentInfoList[index]['socialPayAddr']
              let addr = socialPayAddr.split('-')
              paymentInfoList[index]['socialProvince'] = addr[0] ? addr[0] : ''
              paymentInfoList[index]['socialCity'] = addr[1] ? addr[1] : ''
              paymentInfoList[index]['socialTown'] = addr[2] ? addr[2] : ''
              paymentInfoList[index]['inauguralTeam'] = paymentInfoList[index]['inauguralTeam'] ? paymentInfoList[index]['inauguralTeam'] : ''
              paymentInfoList[index]['telecomNumber'] = paymentInfoList[index]['telecomNumber'] ? paymentInfoList[index]['telecomNumber'] : ''
              // paymentInfoList[index]['unitId'] = paymentInfoList[index]['settleDomainId'] ? this.settleDomainOptions[paymentInfoList[index]['settleDomainId']]['customerName'] : ''
              // paymentInfoList[index]['settleDomainId'] = paymentInfoList[index]['settleDomainId'] ? this.settleDomainOptions[paymentInfoList[index]['settleDomainId']]['departName'] : ''
            }
            excelDatas.push({
              tHeader: ['我司到款单位','员工姓名',	'身份证号',	'就值班组',	'电信编号',	'单位名称',	'部门名称',	'社保编号',	'社保缴纳所属省份',	'社保缴纳所属城市',	'社保缴纳所属区县',
                '社保缴纳月份',	'社保生成月份',	'单位社保合计',	'个人社保合计',	'单位社保补缴利息',	'个人社保补缴利息',	'单位养老基数',	'单位医疗基数',	'单位失业基数',
                '单位工伤基数',	'单位生育基数',	'个人养老基数',	'个人医疗基数',	'个人失业基数',	'单位养老比例',	'单位医疗比例',	'单位失业比例',
                '单位工伤比例',	'单位生育比例',	'个人养老比例',	'个人医疗比例',	'个人失业比例',	'单位大病比例',	'个人大病比例',	'单位养老金额',
                '单位失业金额',	'单位工伤金额',	'单位生育金额',	'单位医疗金额',	'单位大病金额',	'个人养老金额',	'个人医疗金额',	'个人失业金额',
                '个人大病金额',	'社保户',	'社保合计',	'公积金合计',	'总合计',
              ],
              filterVal: ['no','empName','empIdcard','inauguralTeam','telecomNumber','unitId','settleDomainId','socialSecurityNo','socialProvince','socialCity','socialTown',
              'socialPayMonth','socialCreateMonth','unitSocialSum','socialSecurityPersonalSum','companyAccrual','personalAccrual','unitPensionSet','unitMedicalSet','unitUnemploymentSet',
              'unitInjurySet','unitBirthSet','personalPensionSet','personalMedicalSet','personalUnemploymentSet','unitPensionPer','unitMedicalPer','unitUnemploymentPer',
              'unitInjuryPer','unitBirthPer','personalPensionPer','personalMedicalPer','personalUnemploymentPer','unitBigailmentPer','personalBigailmentPer','unitPensionMoney',
              'unitUnemploymentMoney','unitInjuryMoney','unitBirthMoney','unitMedicalMoney','unitBigmailmentMoney','personalPensionMoney','personalMedicalMoney','personalUnemploymentMoney',
              'personalBigmailmentMoney','socialHousehold','socialSum','providentSum','sumAll'],
              tableDatas: paymentInfoList,
              sheetName: '缴费库'
            })
            // 封面
            let i = 1
            for (let d of res.data.aprovalCoverList) {
              d.tableHead = d.tableHead ? d.tableHead : ''
              d.createTime = d.createTime ? moment(d.createTime).format(this.dateFormat) : ''
              d.departNo = d.departNo ? d.departNo : ''
              d.unitName = d.unitName ? d.unitName : ''
              d.itemName = d.itemName ? d.itemName : ''
              d.payType = d.payType ? d.payType : ''

              for (let type of this.payTypeBelongs) {
                if (d.payType == type.value) {
                  d.payType = type.label
                  break
                }
              }

              d.amount = d.amount ? d.amount : 0
              d.amountRmb = d.amountRmb ? d.amountRmb : 0
              d.receiptName = d.receiptName ? d.receiptName : ''
              d.receiptBankNo = d.receiptBankNo ? d.receiptBankNo : ''
              d.receiptBankName = d.receiptBankName ? d.receiptBankName : ''
              d.remark = d.remark ? d.remark : ''
              let coverData = [
                {'company': d.tableHead, 'project': '', 'payType': '', 'money': '', 'no': `附件${res.data.aprovalCoverList.length}张`},
                {'company': "银行转账审批单", 'project': '', 'payType': '', 'money': '', 'no': ''},
                {'company': "", 'project': d.createTime, 'payType': '部门编码', 'money': d.departNo, 'no': ''},
                {'company': "单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
                {'company': d.unitName,'project':d.itemName,'payType':d.payType,'money':'¥' + d.amount,'no':''},
                {'company': "合计人民币：",'project':d.amountRmb,'payType':'','money':'¥' + d.amount,'no':''},
                {'company': "收款单位名称：" + d.receiptName + "    账号：" + d.receiptBankNo + "    开户行：" + d.receiptBankName,'project':'','payType':'','money':'','no':''},
                {'company': "备注：",'project': d.remark,'payType':'','money':'','no':''},
                {'company': '公司领导：         财务负责人：         网银审核授权人：         网银转账提交人：' + this.nickname() + '         数据审核：' + auditName + '         制表人：' + createName,'project':'','payType':'','money':'','no':''},
              ]
              excelDatas.push({
                tHeader: ["序号", "名字", "描述", "金钱", "地位"],
                filterVal: ["company", "project", "payType", "money",'no'],
                tableDatas: coverData,
                sheetName: '封面' + i
              })
              i++
            }
            let householdName = res.data.socialAprovalForm.householdName ? res.data.socialAprovalForm.householdName  : ''
            this.json2excel(excelDatas, householdName + res.data.socialAprovalForm.socialCreateMonth + '月份社保核准表', true, "xlsx")
          } else {
            this.$message.error('数据请求失败！')
          }
          this.downLoading = false
        })
      },
      // 确认出账
      handleOk() {
        let that = this
        this.$confirm({
          title: '确认出账',
          content: '确认出账吗?',
          onOk: function() {
            that.confirmLoading = true
            let httpUrl = 'hrSocial/tsocialaprovalform/outAccountAproval?id=' + that.model.socialAprovalForm.id
            httpUrl += '&status=2'
            httpAction(httpUrl, '', 'post').then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success('确认出账成功！')
                that.$emit('ok')
                that.close()
              } else {
                that.$message.error(res.message || res.msg)
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          }
        })
      },
      // tab切换
      tabsChange(e) {
        this.activeKey = e
      },
      // tab切换
      tabsPaneThreeChange(e) {
        this.tabsPaneThreeActiveKey = e
      },
      // 关闭按钮
      handleCancel() {
        this.close()
      },
      // 关闭功能数据重置
      close() {
        this.$emit('close')
        this.tabName = '封面'  // 封面名称
        this.visible = false
        this.isVerify = false, // 是否显示确定按钮
        // this.activeKey = '1'  //默认第一个tab
        this.tabsPaneThreeActiveKey = 1 // 默认第一个tab
        this.confirmLoading = false
        this.columns = []  // 行
        this.dataSource = [] // 数据
        this.tabPaneTwoData = {} // 增减记录数据
        this.itemListLenght = 0  // 分项长度
        this.tabPaneThreeData = {} // 封面数据
        this.editTableData = {} // 表单可修改数据
        this.editTableStyle = 'border:0;height:23px;' // 表单样式（查看的时候输入框隐藏）
        this.tabPaneFourData = {} // 核准数据
      },
      // 表单回调
      socialFundBackModalFormOk() {
        this.close()
        this.$emit('ok')
      },
      // 导出
      json2excel (tableJson, filenames, autowidth, bookTypes) {
        var that = this
        //这个是引用插件
        import("@/vendor/SocialApprovalSalaryExport").then(excel => {
          var tHeader = []
          var dataArr = []
          var sheetnames = []
          for (var i in tableJson) {
            tHeader.push(tableJson[i].tHeader)
            dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
            sheetnames.push(tableJson[i].sheetName)
          }

          excel.export_json_to_excel_more_sheet({
            header: tHeader,
            data: dataArr,
            sheetname: sheetnames,
            filename: filenames,
            autoWidth: autowidth,
            bookType: bookTypes,
            itemListLenght: that.itemListLenght,
          })
        })
      },
      // 处理数据
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
      // 精度处理
      formatFloat(f, digit = 2) {
        const m = Math.pow(10, digit)
        return Math.round(f * m) / m
      },
      // 隐藏列样式
      handleColumnStyle(width) {
        if (width) {
          return `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: ${width}px;`
        }
        return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
      },
      /******************************************* 验证规则 *******************************************/
    }
  }
</script>

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
.table1 {
  border: 1px solid #ccc;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 20px;
}
.table1 .tr1 {
  margin: 0px;
  padding: 0;
  width: 100%;
}
.table1 .td1 {
  border: 1px solid #333;
  text-align: center;
  height: 40px;
  padding: 10px;
  width: 17%;
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
  background: #e6f7ff;
  font-weight: bolder;
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
.font18 {
  font-size: 18px;
  font-weight: bolder;
}
</style>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 125px;
  }
  :global(.ant-input-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-radio-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
}
.tableFormItem {
  margin-bottom: 0px;
  margin-right: 0px;
  :global(.ant-form-item-control) {
    line-height: 23px;
  }
  :global(.ant-input-disabled) {
    color: rgba(0, 0, 0, 0.65);
    background-color: #ffffff;
  }
}
</style>
