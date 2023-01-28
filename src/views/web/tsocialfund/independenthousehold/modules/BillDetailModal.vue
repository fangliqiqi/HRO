<template>
  <a-modal
    :title="title"
    :width="1000"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
      <!-- <a-button
        type="primary"
        :loading="downLoading"
        @click="handleDownload"
      >导出</a-button> -->
      <a-button
        v-if="isVerify"
        key="handleOk"
        type="primary"
        @click="handleOk"
      >提交</a-button>
      <a-button
        v-if="auditStatus"
        key="handleAudit"
        type="primary"
        @click="handleOk"
      >审核</a-button>
    </template>

    <a-tabs
      :activeKey="activeKey"
      @change="tabsChange"
    >
      <a-tab-pane
        :forceRender="true"
        tab="结算单明细表"
        key="1"
      >
        <div
          v-if="isVerify"
          style="margin-bottom: 8px;"
          v-has="'wxhr:tforecastoneselfform_import'"
        >
          <a-upload
            name="file"
            :showUploadList="false"
            :multiple="false"
            :beforeUpload="beforeUpload"
            @change="handleImport(url.importExcelUrl, 1000 * 60 * 5)"
            accept=".xls,.xlsx"
          >
            <a-button type="primary">
              <a-icon type="upload" /> 上传结算单明细 </a-button>
          </a-upload>
        </div>
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
                  :columns="tabPaneOneColumns"
                  :dataSource="tabPaneOneDataSource"
                  :scroll="{ x: 900, y: 400 }"
                >
                  <span
                    slot="action"
                    slot-scope="text, record"
                  >
                    <a-popconfirm
                      v-if="isVerify"
                      title="确定删除吗?"
                      @confirm="() => handleDelete(record.id)"
                    >
                      <a>删除</a>
                    </a-popconfirm>
                    <span v-else>-</span>
                  </span>
                </a-table>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        :forceRender="true"
        tab="结算单"
        key="4"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="tabPaneFour"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-card class="staffCard">
                <table class="table1">
                  <tr class="tr1">
                    <td
                      class="td1 tit"
                      colspan="5"
                      style="font-size: 18px;"
                    >{{ billData.billDate }}费用结算单</td>
                  </tr>
                  <tr class="tr1">
                    <td class="td1">单位名称</td>
                    <td
                      class="td1"
                      colspan="4"
                      style="text-align: left;"
                    >{{ masterData.unitName }}/ {{ masterData.departName }}</td>
                  </tr>
                  <tr class="tr1">
                    <td class="td1">结算时间</td>
                    <td
                      class="td1"
                      colspan="4"
                      style="text-align: left;"
                    >{{ billData.billDate ? billData.billDate.substring(0, 4) : '' }}年{{ billData.billDate ? billData.billDate.substring(4, 6) : '' }}月</td>
                  </tr>
                  <tr class="tr1">
                    <td class="td1">序号</td>
                    <td
                      class="td1"
                      colspan="2"
                    >费用项目</td>
                    <td class="td1">金额</td>
                    <td class="td1">小计</td>
                  </tr>
                  <tr class="tr1">
                    <td class="td1">1</td>
                    <td
                      class="td1"
                      rowspan="2"
                    >
                      {{ billData.billDate ? billData.billDate.substring(0, 4) : '' }}年{{ billData.billDate ? billData.billDate.substring(4, 6) : '' }}月
                    </td>
                    <td class="td1">应缴单位社保</td>
                    <td class="td1"></td>
                    <td class="td1"></td>
                  </tr>
                  <tr class="tr1">
                    <td class="td1">2</td>
                    <td class="td1">代扣个人社保</td>
                    <td class="td1"></td>
                    <td class="td1"></td>
                  </tr>
                  <tr class="tr1">
                    <td class="td1">3</td>
                    <td
                      class="td1"
                      rowspan="2"
                    >
                      {{ billData.billDate ? billData.billDate.substring(0, 4) : '' }}年{{ billData.billDate ? billData.billDate.substring(4, 6) : '' }}月
                    </td>
                    <td class="td1">应缴单位公积金</td>
                    <td class="td1"></td>
                    <td class="td1"></td>
                  </tr>
                  <tr class="tr1">
                    <td class="td1">4</td>
                    <td class="td1">代扣个人公积金</td>
                    <td class="td1"></td>
                    <td class="td1"></td>
                  </tr>
                  <tr class="tr1">
                    <td class="td1">5</td>
                    <td
                      class="td1"
                      colspan="2"
                    >服务人次</td>
                    <td
                      v-if="isVerify"
                      class="td1"
                    >
                      <a-form-item class="tableFormItem">
                        <a-tooltip
                          placement="top"
                          title="请输入整数！"
                        >
                          <a-input
                            placeholder="服务人次"
                            v-decorator="['serverPeople', { rules: [{ validator: this.validateServicePeople }] }]"
                            :style="inputStyle"
                          />
                        </a-tooltip>
                      </a-form-item>
                    </td>
                    <td
                      v-else
                      class="td1"
                    >{{ billData.serverPeople }}</td>
                    <td class="td1"></td>
                  </tr>
                  <tr class="tr1">
                    <td class="td1">6</td>
                    <td
                      class="td1"
                      colspan="2"
                    >服务人数</td>
                    <td
                      v-if="isVerify"
                      class="td1"
                    >
                      <a-form-item class="tableFormItem">
                        <a-tooltip
                          placement="top"
                          title="请输入整数！"
                        >
                          <a-input
                            placeholder="服务人数"
                            v-decorator="['serverPeopleNum', { rules: [{ validator: this.validatePeopleNum }] }]"
                            :style="inputStyle"
                          />
                        </a-tooltip>
                      </a-form-item>
                    </td>
                    <td
                      v-else
                      class="td1"
                    >{{ billData.serverPeopleNum }}</td>
                    <td class="td1"></td>
                  </tr>
                  <tr class="tr1">
                    <td class="td1">7</td>
                    <td
                      class="td1"
                      colspan="2"
                    >管理费（{{ billData.managementFee }}元/人/月）</td>
                    <td
                      v-if="isVerify"
                      class="td1"
                    >
                      <a-form-item class="tableFormItem">
                        <a-tooltip
                          placement="top"
                          title="请输入最多两位有效数字！"
                        >
                          <a-input
                            placeholder="金额"
                            v-decorator="['managementFee', { rules: [{ validator: this.validateManageFee }] }]"
                            :style="inputStyle"
                          />
                        </a-tooltip>
                      </a-form-item>
                    </td>
                    <td
                      v-else
                      class="td1"
                    >{{ billData.managementFee }}</td>
                    <td class="td1">{{ billData.billFeeSum }}</td>
                  </tr>
                  <tr class="tr1">
                    <td
                      class="td1 tit"
                      colspan="3"
                    >本月度结算</td>
                    <td class="td1"></td>
                    <td class="td1">{{ billData.billFeeSum }}</td>
                  </tr>
                  <tr class="tr1 tit">
                    <td class="td1">发票类型</td>
                    <td class="td1">扣除金额</td>
                    <td class="td1">不含税收入</td>
                    <td class="td1">税额</td>
                    <td class="td1">发票合计金额</td>
                  </tr>
                  <tr class="tr1 tit">
                    <td
                      v-if="isVerify"
                      class="td1"
                      style="height:45px;"
                    >
                      <a-form-item class="tableFormItem">
                        <a-select
                          :style="inputStyle"
                          placeholder="请选择"
                          v-decorator="['invoiceType', { rules: [{ validator: this.validateInvoiceType }] }]"
                        >
                          <a-select-option
                            v-for="(value, key) in invoiceTypeOptions"
                            :key="key"
                            :value="key"
                          >{{ value.option }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </td>
                    <td
                      v-else
                      class="td1"
                    >{{ billData.invoiceType ? invoiceTypeOptions[billData.invoiceType].option : '' }}</td>
                    <td
                      v-if="isVerify"
                      class="td1"
                    >
                      <a-form-item class="tableFormItem">
                        <a-tooltip
                          placement="top"
                          title="请输入最多两位有效数字！"
                        >
                          <a-input
                            placeholder="金额"
                            v-decorator="['reduceMoney', { rules: [{ validator: this.validateReduceMoney }] }]"
                            :style="inputStyle"
                          />
                        </a-tooltip>
                      </a-form-item>
                    </td>
                    <td
                      v-else
                      class="td1"
                    >{{ billData.reduceMoney }}</td>
                    <td
                      v-if="isVerify"
                      class="td1"
                    >
                      <a-form-item class="tableFormItem">
                        <a-tooltip
                          placement="top"
                          title="请输入最多两位有效数字！"
                        >
                          <a-input
                            placeholder="金额"
                            v-decorator="['incomeNoTax', { rules: [{ validator: this.validateIncomeNoTax }] }]"
                            :style="inputStyle"
                          />
                        </a-tooltip>
                      </a-form-item>
                    </td>
                    <td
                      v-else
                      class="td1"
                    >{{ billData.incomeNoTax }}</td>
                    <td
                      v-if="isVerify"
                      class="td1"
                    >
                      <a-form-item class="tableFormItem">
                        <a-tooltip
                          placement="top"
                          title="请输入最多两位有效数字！"
                        >
                          <a-input
                            placeholder="金额"
                            v-decorator="['invoiceTax', { rules: [{ validator: this.validateInvoiceTax }] }]"
                            :style="inputStyle"
                          />
                        </a-tooltip>
                      </a-form-item>
                    </td>
                    <td
                      v-else
                      class="td1"
                    >{{ billData.invoiceTax }}</td>
                    <td class="td1">{{ billData.ticketFeeSum }}</td>
                  </tr>
                </table>
              </a-card>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        :forceRender="true"
        tab="流程进展明细"
        key="6"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="auditForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col :span="24">
                <template v-if="auditList.length > 0">
                  <a-timeline style="margin-left: 50px">
                    <template v-for="(list, key) in auditList">
                      <a-timeline-item
                        :key="key"
                        :color="auditStatusOptions[list.auditStatus].color"
                      >
                        <p>{{ list.auditRemark ? list.auditRemark : '' }}</p>
                        <p>{{ list.auditUser ? list.auditUser : '' }}</p>
                        <p>{{ list.auditTime ? list.auditTime : '' }}</p>
                      </a-timeline-item>
                    </template>
                  </a-timeline>
                </template>
                <template v-else>
                  <section class="code-box-demo">
                    <div class="ant-empty">
                      <div class="ant-empty-image">
                        <img
                          alt="暂无数据"
                          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE1MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQgMzEuNjcpIj4KICAgICAgPGVsbGlwc2UgZmlsbC1vcGFjaXR5PSIuOCIgZmlsbD0iI0Y1RjVGNyIgY3g9IjY3Ljc5NyIgY3k9IjEwNi44OSIgcng9IjY3Ljc5NyIgcnk9IjEyLjY2OCIvPgogICAgICA8cGF0aCBkPSJNMTIyLjAzNCA2OS42NzRMOTguMTA5IDQwLjIyOWMtMS4xNDgtMS4zODYtMi44MjYtMi4yMjUtNC41OTMtMi4yMjVoLTUxLjQ0Yy0xLjc2NiAwLTMuNDQ0LjgzOS00LjU5MiAyLjIyNUwxMy41NiA2OS42NzR2MTUuMzgzaDEwOC40NzVWNjkuNjc0eiIgZmlsbD0iI0FFQjhDMiIvPgogICAgICA8cGF0aCBkPSJNMTAxLjUzNyA4Ni4yMTRMODAuNjMgNjEuMTAyYy0xLjAwMS0xLjIwNy0yLjUwNy0xLjg2Ny00LjA0OC0xLjg2N0gzMS43MjRjLTEuNTQgMC0zLjA0Ny42Ni00LjA0OCAxLjg2N0w2Ljc2OSA4Ni4yMTR2MTMuNzkyaDk0Ljc2OFY4Ni4yMTR6IiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMy41NikiLz4KICAgICAgPHBhdGggZD0iTTMzLjgzIDBoNjcuOTMzYTQgNCAwIDAgMSA0IDR2OTMuMzQ0YTQgNCAwIDAgMS00IDRIMzMuODNhNCA0IDAgMCAxLTQtNFY0YTQgNCAwIDAgMSA0LTR6IiBmaWxsPSIjRjVGNUY3Ii8+CiAgICAgIDxwYXRoIGQ9Ik00Mi42NzggOS45NTNoNTAuMjM3YTIgMiAwIDAgMSAyIDJWMzYuOTFhMiAyIDAgMCAxLTIgMkg0Mi42NzhhMiAyIDAgMCAxLTItMlYxMS45NTNhMiAyIDAgMCAxIDItMnpNNDIuOTQgNDkuNzY3aDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI0SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjR6TTQyLjk0IDYxLjUzaDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI1SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjV6TTEyMS44MTMgMTA1LjAzMmMtLjc3NSAzLjA3MS0zLjQ5NyA1LjM2LTYuNzM1IDUuMzZIMjAuNTE1Yy0zLjIzOCAwLTUuOTYtMi4yOS02LjczNC01LjM2YTcuMzA5IDcuMzA5IDAgMCAxLS4yMjItMS43OVY2OS42NzVoMjYuMzE4YzIuOTA3IDAgNS4yNSAyLjQ0OCA1LjI1IDUuNDJ2LjA0YzAgMi45NzEgMi4zNyA1LjM3IDUuMjc3IDUuMzdoMzQuNzg1YzIuOTA3IDAgNS4yNzctMi40MjEgNS4yNzctNS4zOTNWNzUuMWMwLTIuOTcyIDIuMzQzLTUuNDI2IDUuMjUtNS40MjZoMjYuMzE4djMzLjU2OWMwIC42MTctLjA3NyAxLjIxNi0uMjIxIDEuNzg5eiIgZmlsbD0iI0RDRTBFNiIvPgogICAgPC9nPgogICAgPHBhdGggZD0iTTE0OS4xMjEgMzMuMjkybC02LjgzIDIuNjVhMSAxIDAgMCAxLTEuMzE3LTEuMjNsMS45MzctNi4yMDdjLTIuNTg5LTIuOTQ0LTQuMTA5LTYuNTM0LTQuMTA5LTEwLjQwOEMxMzguODAyIDguMTAyIDE0OC45MiAwIDE2MS40MDIgMCAxNzMuODgxIDAgMTg0IDguMTAyIDE4NCAxOC4wOTdjMCA5Ljk5NS0xMC4xMTggMTguMDk3LTIyLjU5OSAxOC4wOTctNC41MjggMC04Ljc0NC0xLjA2Ni0xMi4yOC0yLjkwMnoiIGZpbGw9IiNEQ0UwRTYiLz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0OS42NSAxNS4zODMpIiBmaWxsPSIjRkZGIj4KICAgICAgPGVsbGlwc2UgY3g9IjIwLjY1NCIgY3k9IjMuMTY3IiByeD0iMi44NDkiIHJ5PSIyLjgxNSIvPgogICAgICA8cGF0aCBkPSJNNS42OTggNS42M0gwTDIuODk4LjcwNHpNOS4yNTkuNzA0aDQuOTg1VjUuNjNIOS4yNTl6Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                        >
                      </div>
                      <p class="ant-empty-description">暂无流程数据</p>
                    </div>
                  </section>
                </template>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>
    </a-tabs>
    <bill-verification-modal
      ref="billVerificationModal"
      @ok="billVerificationModalFormOk"
    ></bill-verification-modal>
    <error-modal ref="errorModal"></error-modal>
  </a-modal>
</template>

<script>
  import XLSX from 'xlsx'
  import pick from 'lodash.pick'
  import BillVerificationModal from './BillVerificationModal'
  import ErrorModal from '../../../global/modules/ErrorModal'
  import { httpActionHeader, httpAction, deleteAction } from '@/api/manage'
  import { handleImportData } from '@/utils/common'

  export default {
    name: 'BillDetailModal',
    components: {
      ErrorModal,
      BillVerificationModal,
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        isVerify: false, // 是否显示确定按钮
        activeKey: '1', // 默认第一个tab
        auditStatus: false, // 是否是审核
        downLoading: false,
        importMethod: 'post',
        confirmLoading: false,
        okStatusOfSubmit: 0, // 记录第几次点击提交按钮
        tabPaneOne: this.$form.createForm(this),
        tabPaneFour: this.$form.createForm(this),
        auditForm: this.$form.createForm(this),
        inputStyle: 'width:90px;height:23px;', // 表单样式（查看的时候输入框隐藏）
        inputDisabledStyle: 'border:0;width:80px;height:23px;', // 表单样式（查看的时候输入框隐藏）
        fileList: [], // 上传文件
        auditList: [],  // 审核流程数据
        invoiceTypeOptions: {}, // 发票类型
        tabPaneOneColumns: [
          {
            width: 100,
            ellipsis: true,
            title: '姓名',
            fixed: 'left',
            align: 'center',
            dataIndex: 'empName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '单位名称',
            align: 'center',
            dataIndex: 'unitName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '部门',
            align: 'center',
            dataIndex: 'departName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcard',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 140,
            ellipsis: true,
            title: '缴费月份',
            align: 'center',
            dataIndex: 'paymentMonth',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '服务费',
            align: 'center',
            dataIndex: 'manageFee',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],  // 第一个tab行
        tabPaneOneDataSource: [], // 第一个tab数据
        billData: {}, // 结算单数据
        masterData: {}, // 主表数据
        auditStatusOptions: {
          '0': {'option': '待提交', 'color': 'blue'},
          '1': {'option': '待审核', 'color': 'orange'},
          '2': {'option': '审核未通过', 'color': 'red'},
          '3': {'option': '已结算', 'color': 'green'},
        },
        url: {
          edit: 'hrSocial/tforecastoneselfbill/updateById',  //  修改
          delete: 'hrSocial/tforecastoneselfdetail/removeByIds',  // 删除
          importExcelUrl: 'hrSocial/tforecastoneselfform/analysisJsonStringImportForecastOneselfDetailForm',  // 导入
          queryAllInfoById: 'hrSocial/tforecastoneselfform/selectForecastOneselfFormAllInfoById', // 详情
        },
      }
    },
    methods: {
      edit(record, auditProcessUrl = '') {
        this.tabPaneOne.resetFields()
        this.tabPaneFour.resetFields()
        this.auditForm.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        // 流程进展明细
        if (auditProcessUrl) {
          const requestUrl = `${auditProcessUrl}?id=${this.model.forecastOneselfForm.id}&type=7`
          httpAction(requestUrl, {}, 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.auditList = res.data
            } else {
              this.$message.error('流程进展数据不完整！')
            }
          })
        }
        /**************************************************** 明细表数据 ****************************************************/
        if (this.model.forecastOneselfDetailList && this.model.forecastOneselfDetailList.length > 0) {
          this.tabPaneOneDataSource = this.model.forecastOneselfDetailList
        } else {
          this.tabPaneOneDataSource = []
        }
        /**************************************************** 结算表数据 ****************************************************/
        this.masterData = (this.model.forecastOneselfForm && this.model.forecastOneselfForm.id) ? this.model.forecastOneselfForm : {} // 主表数据
        this.billData = (this.model.forecastOneselfBill && this.model.forecastOneselfBill.id) ? this.model.forecastOneselfBill : {} // 结算单数据
        if (this.isVerify) {  // 提交的时候
          this.$nextTick(() => {
            this.tabPaneFour.setFieldsValue(pick(this.billData, 'serverPeople', 'serverPeopleNum', 'managementFee', 'invoiceType', 'reduceMoney', 'incomeNoTax', 'invoiceTax'))
          })
        }
      },
      // 确定按钮
      handleOk() {
        // 编辑状态1
        this.okStatusOfSubmit = 1
        // 触发表单验证（tabPaneFour）
        this.tabPaneFour.validateFields((err) => {
          if (!err) {
            if (this.auditStatus) { // 审核
              this.$refs.billVerificationModal.title = '确认审核'
              this.$refs.billVerificationModal.id = this.masterData.id
              this.$refs.billVerificationModal.type = 1
              this.$refs.billVerificationModal.add()
            } else {
              this.$refs.billVerificationModal.title = '确认提交'
              this.$refs.billVerificationModal.id = this.masterData.id
              this.$refs.billVerificationModal.type = 0
              this.$refs.billVerificationModal.add()
            }
          }
        })
        // 编辑状态0
        this.okStatusOfSubmit = 0
      },
      // tab切换
      tabsChange(e) {
        this.activeKey = e
      },
      // 关闭按钮
      handleCancel() {
        this.close()
      },
      // 关闭功能数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.isVerify = false, // 是否显示确定按钮
        this.activeKey = '1'  //默认第一个tab
        this.auditList = []  // 审核流程数据
        this.auditStatus = false // 是否是审核
        this.tabPaneOneDataSource = [] // 第一个tab数据
        this.fileList = [] // 上传文件
        this.billData = {} // 结算单数据
        this.masterData = {} // 主表数据
        this.downLoading = false
        this.okStatusOfSubmit = 0
        this.confirmLoading = false
        this.invoiceTypeOptions = {} // 发票类型
      },
      // 表单回调
      billVerificationModalFormOk() {
        this.close()
        this.$emit('ok')
      },
      // 删除明细
      handleDelete(ids) {
        var that = this
        deleteAction(`${that.url.delete}?ids=${ids}`).then((res) => {
          if (res.code === 200) {
            that.$message.success('删除成功!')
            httpAction(`${that.url.queryAllInfoById}?id=${that.masterData.id}`, {}, 'GET').then((res) => {
              if (Number(res.code) === 200 && res.data) {
                if (res.data.forecastOneselfDetailList && res.data.forecastOneselfDetailList.length > 0) {
                  that.tabPaneOneDataSource = res.data.forecastOneselfDetailList
                } else {
                  that.tabPaneOneDataSource = []
                }
              } else {
                that.$message.error('明细列表数据请求失败！') 
              }
            })
          } else {
            //兼容
            that.$message.warning(res.message || res.msg)
          }
        })
      },
      /******************************************* 验证规则 *******************************************/
      // 管理费验证
      validateManageFee(rule, value, callback) {
        if (this.okStatusOfSubmit == 0) {
          /**** 数据验证 ****/
          if (!value) {
            this.billData.managementFee = value = 0
          }
          if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) {
            callback('')
            return false
          }
          const serverPeopleNum = isNaN(parseInt(this.tabPaneFour.getFieldValue('serverPeopleNum'))) ? 0 : parseInt(this.tabPaneFour.getFieldValue('serverPeopleNum'))
          this.billData.managementFee = value
          this.billData.billFeeSum = this.formatFloat(value * serverPeopleNum)
          this.billData.ticketFeeSum = this.billData.billFeeSum
          this.$nextTick(() => {
            this.tabPaneFour.setFieldsValue(pick(this.billData, 'managementFee'))
          })
          const httpurl = this.url.edit
          const method = 'PUT'
          const req = {id: this.billData.id, managementFee: value, serverPeopleNum: serverPeopleNum}
          // 请求
          httpAction(httpurl, req, method).then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }
        callback()
      },
      // 服务人数验证
      validatePeopleNum(rule, value, callback) {
        if (Number(this.okStatusOfSubmit) === 0) {
          /**** 数据验证 ****/
          if (!value) {
            this.billData.serverPeopleNum = value = 0
          }
          if (!new RegExp(/((^[1-9]\d*)|^0)$/).test(value)) {
            callback('')
            return false
          }
          let managementFee = isNaN(this.formatFloat(this.tabPaneFour.getFieldValue('managementFee'))) ? 0 : this.formatFloat(this.tabPaneFour.getFieldValue('managementFee'))
          this.billData.serverPeopleNum = value
          this.billData.billFeeSum = this.formatFloat(value * managementFee)
          this.billData.ticketFeeSum = this.billData.billFeeSum
          this.$nextTick(() => {
            this.tabPaneFour.setFieldsValue(pick(this.billData, 'serverPeopleNum'))
          })
          const httpurl = this.url.edit
          const method = 'PUT'
          const req = {id: this.billData.id, managementFee: managementFee, serverPeopleNum: value}
          // 请求
          httpAction(httpurl, req, method).then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }
        callback()
      },
      // 服务人次验证
      validateServicePeople(rule, value, callback) {
        if (Number(this.okStatusOfSubmit) === 0) {
          /**** 数据验证 ****/
          if (!value) {
            this.billData.serverPeople = value = 0
          }
          if (!new RegExp(/((^[1-9]\d*)|^0)$/).test(value)) {
            callback('')
            return false
          }
          this.billData.serverPeople = value
          this.$nextTick(() => {
            this.tabPaneFour.setFieldsValue(pick(this.billData, 'serverPeople'))
          })
          const httpurl = this.url.edit
          const method = 'PUT'
          const req = {id: this.billData.id, serverPeople: value}
          // 请求
          httpAction(httpurl, req, method).then((res) => {
            if (Number(res.code )!== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }
        callback()
      },
      // 扣除金额验证
      validateReduceMoney(rule, value, callback) {
        if (Number(this.okStatusOfSubmit) === 0) {
          /**** 数据验证 ****/
          if (!value) {
            this.billData.reduceMoney = value = 0
          }
          if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) {
            callback('')
            return false
          }
          this.billData.reduceMoney = value
          this.$nextTick(() => {
            this.tabPaneFour.setFieldsValue(pick(this.billData, 'reduceMoney'))
          })
          const httpurl = this.url.edit
          const method = 'PUT'
          const req = {id: this.billData.id, reduceMoney: value}
          // 请求
          httpAction(httpurl, req, method).then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }
        callback()
      },
      // 不含税收入验证
      validateIncomeNoTax(rule, value, callback) {
        if (Number(this.okStatusOfSubmit) === 0) {
          /**** 数据验证 ****/
          if (!value) {
            this.billData.incomeNoTax = value = 0
          }
          if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) {
            callback('')
            return false
          }
          this.billData.incomeNoTax = value
          this.$nextTick(() => {
            this.tabPaneFour.setFieldsValue(pick(this.billData, 'incomeNoTax'))
          })
          const httpurl = this.url.edit
          const method = 'PUT'
          const req = {id: this.billData.id, incomeNoTax: value}
          // 请求
          httpAction(httpurl, req, method).then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }
        callback()
      },
      // 税额验证
      validateInvoiceTax(rule, value, callback) {
        if (Number(this.okStatusOfSubmit) == 0) {
          /**** 数据验证 ****/
          if (!value) {
            this.billData.invoiceTax = value = 0
          }
          if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) {
            callback('')
            return false
          }
          this.billData.invoiceTax = value
          this.$nextTick(() => {
            this.tabPaneFour.setFieldsValue(pick(this.billData, 'invoiceTax'))
          })
          const httpurl = this.url.edit
          const method = 'PUT'
          const req = {id: this.billData.id, invoiceTax: value}
          // 请求
          httpAction(httpurl, req, method).then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }
        callback()
      },
      // 开票类型验证
      validateInvoiceType(rule, value, callback) {
        if (Number(this.okStatusOfSubmit) == 0) {
          /**** 数据验证 ****/
          if (!value) {
            this.billData.invoiceType = value = 0
          }
          if (!new RegExp(/((^[1-9]\d*)|^0)$/).test(value)) {
            callback('')
            return false
          }
          this.billData.invoiceType = value
          this.$nextTick(() => {
            this.tabPaneFour.setFieldsValue(pick(this.billData, 'invoiceType'))
          })
          const httpurl = this.url.edit
          const method = 'PUT'
          const req = {id: this.billData.id, invoiceType: value}
          // 请求
          httpAction(httpurl, req, method).then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }
        callback()
      },
      // 精度处理
      formatFloat(f, digit = 2) {
        const m = Math.pow(10, digit)
        return Math.round(f * m) / m
      },
      handleDownload() {
        this.downLoading = true
        // 结算单数据
        const forecastBillData = this.forecastBillData
        let settelData = [
          {'index':this.forecastFormData.unitName + '结算单','data':'','project':'','money':'','tax':'','account':''},
          {'index':'单位名称:','data':this.forecastFormData.unitName,'project':'','money':'','tax':'皖信盖章','account':''},
          {'index':'结算主体:','data':this.forecastFormData.departName,'project':'','money':'','tax':':','account':''},
          {'index':'结算时间:','data':forecastBillData.billDate,'project':'','money':'','tax':'','account':''},
          {'index':'序号','data':'费用项目','project':'','money':'金额','tax':'税费','account':'开票额小计'},
          {'index':1,'data':forecastBillData.payMonths,'project':'应缴单位社保','money':forecastBillData.unitSocial * 1,'tax':forecastBillData.unitSocialTax * 1,'account':forecastBillData.unitSocial * 1 + forecastBillData.unitSocialTax * 1},
          {'index':2,'data':'','project':'代扣个人社保','money':forecastBillData.personalSocial * 1,'tax':forecastBillData.personalSocialTax * 1,'account':this.formatFloat(forecastBillData.personalSocial * 1 + forecastBillData.personalSocialTax * 1)},
          {'index':3,'data':'','project':'应缴单位公积金','money':forecastBillData.unitProvident * 1,'tax':forecastBillData.unitProvidentTax * 1,'account':this.formatFloat(forecastBillData.unitProvident * 1 + forecastBillData.unitProvidentTax * 1)},
          {'index':4,'data':'','project':'代扣个人公积金','money':forecastBillData.personalProvident * 1 ,'tax':forecastBillData.personalProvidentTax * 1,'account':this.formatFloat(forecastBillData.personalProvident * 1 + forecastBillData.personalProvidentTax * 1)},
          {'index':5,'data':'','project':'社保缴纳总合计','money':'-' ,'tax':'-','account':this.formatFloat(forecastBillData.socialSum * 1)},
          {'index':6,'data':'','project':'公积金缴纳总合计','money':'-' ,'tax':'-','account':this.formatFloat(forecastBillData.fundSum * 1)},
          {'index':7,'data':'','project':'总合计','money':'-' ,'tax':'-','account':this.formatFloat(forecastBillData.sum * 1)},
          {'index':8,'data':'单位社保差额','project':'','money':forecastBillData.unitSocialDiff * 1,'tax':forecastBillData.unitSocialDiffTax * 1,'account':this.formatFloat(forecastBillData.unitSocialDiff * 1 + forecastBillData.unitSocialDiffTax * 1)},
          {'index':9,'data':'个人社保差额','project':'','money':forecastBillData.personalSocialDiff * 1,'tax':forecastBillData.personalSocialDiffTax * 1,'account':this.formatFloat(forecastBillData.personalSocialDiff * 1 + forecastBillData.personalSocialDiffTax * 1)},
          {'index':10,'data':'单位公积金差额','project':'','money':forecastBillData.unitPrividentDiff * 1,'tax':forecastBillData.unitPrividentDiffTax * 1,'account':this.formatFloat(forecastBillData.unitPrividentDiff * 1 + forecastBillData.unitPrividentDiffTax * 1)},
          {'index':11,'data':'个人公积金差额','project':'','money':forecastBillData.personalProvidentDiff * 1,'tax':forecastBillData.personalProvidentDiffTax * 1,'account':this.formatFloat(forecastBillData.personalProvidentDiff * 1 + forecastBillData.personalProvidentDiffTax * 1)},
          {'index':12,'data':'管理费差额','project':'','money':forecastBillData.managementFeeDiff * 1,'tax':forecastBillData.managementFeeDiffTax * 1,'account':this.formatFloat(forecastBillData.managementFeeDiff * 1 + forecastBillData.managementFeeDiffTax * 1)},
          {'index':13,'data':'服务人数','project':'','money':forecastBillData.serverPeopleNum * 1,'tax':'','account':''},
          {'index':14,'data':'服务人次','project':'','money':forecastBillData.serverPeople * 1,'tax':'','account':''},
          {'index':15,'data':'社保卡费','project':'','money':forecastBillData.socialCardFee * 1,'tax':'','account':''},
          {'index':16,'data':'商险','project':'','money':forecastBillData.businessInsurance * 1,'tax':forecastBillData.businessInsuranceTax * 1,'account':this.formatFloat(forecastBillData.businessInsurance * 1 + forecastBillData.businessInsuranceTax * 1)},
          {'index':17,'data':'管理费','project':'','money':forecastBillData.managementFee * 1,'tax':forecastBillData.managementFeeTax * 1,'account':this.formatFloat(forecastBillData.managementFee * 1 + forecastBillData.managementFeeTax * 1)},
          {'index':18,'data':'管理费2','project':'','money':forecastBillData.managementFeeTwo * 1,'tax':'-','account':forecastBillData.managementFeeTwo * 1},
          {'index':'结算金额合计','data':'','project':'','money':'-','tax':'-','account':forecastBillData.billFeeSum * 1},
          {'index':'开票金额合计','data':'','project':'','money':'-','tax':'-','account':forecastBillData.ticketFeeSum * 1},
        ]
        var excelDatas = [
          {
            tHeader: ["员工编码","员工姓名","身份证号","单位名称","结算主体","社保缴纳月份","社保生成月份","公积金缴纳月份","公积金生成月份",
            "单位养老保险","单位医疗保险","单位失业保险","单位工伤保险","单位生育保险","单位大病救助","单位社保总计","单位住房公积金",
            "个人养老保险","个人医疗保险","个人失业保险","个人大病救助","个人社保总计","个人住房公积金"], // 表一的数据字段
            filterVal: ["empNo", "empName", "empIdcard", "unitId", "settleDomainId", "socialPayMonth", "socialCreateMonth","providentPayMonth","providentCreateMonth",
            "unitPensionFee","unitMedicalFee","unitUnemploymentFee","unitWorkInjuryFee","unitBirthFee","unitBitmailmentFee","unitSocialSum","unitFundSum",
            "personalPensionFee","personalMedicalFee","personalUnemploymentFee","personalBigmailmentFee","personalSocialSum","personalFundSum"], // sheet表一头部
            tableDatas: this.model.forecastLibraryList, // 表一的整体json数据
            sheetName: "预估明细表"// 表一的sheet名字
          },
          {
            tHeader: ["序号",null,"费用项目", "金额", "增值税", "开票额小计"],
            filterVal: ['index','data',"project", "money", "tax", "account"],
            tableDatas: settelData,
            sheetName: "结算单"
          },
        ]
        this.json2excel(excelDatas, "预估账单", true, "xlsx")
        this.downLoading = false
      },
      json2excel(tableJson, filenames, autowidth, bookTypes){
        var that = this
        //这个是引用插件
        import("@/vendor/ExportForecastExcel").then(excel => {
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
            bookType: bookTypes
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j == "unitId") {
            return this.settleDomainBelongs[v['settleDomainId']]['customerName']
          } else if (j == "settleDomainId") {
            return this.settleDomainBelongs[v[j]]['departName']
          } else {
            return v[j]
          }
        }))
      },
      // 批量导入
      beforeUpload(file) {
        this.fileList = [file]
        return false
      },
      // 导入功能
      handleImport(importUrl, timeOut) {
        const { fileList } = this
        const formData = new FormData()
        fileList.forEach((file) => {
          formData.append('files[]', file)
        })
        this.uploadFilesChange(fileList[0], importUrl, timeOut)
      },
      // 实现导入
      uploadFilesChange(file, importUrl, timeOut) {
        var that = this
        // 通过FileReader对象读取文件
        const fileReader = new FileReader()
        fileReader.onload = event => {
          try {
            that.loading = true
            const { result } = event.target
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary' })
            // 存储获取到的数据
            const data = {}
            let sheetName = ''

            // 遍历获取每张工作表 除去隐藏表
            const allSheets = workbook.Workbook.Sheets
            for (const index in allSheets) {
              const name = allSheets[index].name
              if (workbook.Sheets.hasOwnProperty(name) && allSheets[index].Hidden === 0) {
                sheetName = name
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name],{defval:'',blankrows:true}))
                break
              }
            }
            // 去除每个字段的前后空格
            const newData = handleImportData(data[sheetName])
            const req = newData.map(item=>{
              item['独立户结算单信息ID'] = that.masterData.id
              return item
            })
            const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
            const requestTimeOut = timeOut ? timeOut : 600000  // 请求过期时间
            //开始异步提交
            httpActionHeader(importUrl, JSON.stringify(req), that.importMethod, contextType, requestTimeOut).then((res) => {
              that.loading = false
              const msg = res.message || res.msg
              if (Number(res.code) === 200) {
                if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  that.$refs.errorModal.title = `导入提示: ${msg}`
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  that.$message.success("导入成功！")
                }
              } else {
                if (res.data != null && res.data.length > 0) {
                  that.$refs.errorModal.title = `导入提示: ${msg}`
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.data)
                } else if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  that.$refs.errorModal.title = `导入提示: ${msg}`
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  that.$message.error(msg)
                }
              }
              httpAction(`${that.url.queryAllInfoById}?id=${that.masterData.id}`, {}, 'GET').then((res) => {
                if (Number(res.code) === 200 && res.data) {
                  if (res.data.forecastOneselfDetailList && res.data.forecastOneselfDetailList.length > 0) {
                    that.tabPaneOneDataSource = res.data.forecastOneselfDetailList
                  } else {
                    that.tabPaneOneDataSource = []
                  }
                } else {
                  that.$message.error('明细列表数据请求失败！') 
                }
              })
            })
          } catch (e) {
            // 这里可以抛出文件类型错误不正确的相关提示
            this.$message.error('文件上传错误！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file)
      },
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
.ant-advanced-search-form .code-box-demo {
  padding: 42px 24px 50px;
  color: rgba(0, 0, 0, 0.65);
}
.ant-advanced-search-form .ant-empty {
  margin: 0 8px;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
}
.ant-advanced-search-form .ant-empty-description {
  margin: 0;
}
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}
.table1 {
  border: 1px solid #ccc;
  width: 70%;
  border-collapse: collapse;
  border-spacing: 0;
  margin: 0 auto;
}
input {
  text-align: center;
}
.table1 .tr1 {
  margin: 0px;
  padding: 0;
  width: 100%;
}
.table1 .td1 {
  border: 1px solid rgb(14, 12, 12);
  margin-left: 10px;
  padding: 5px;
  text-align: center;
  width: 150px;
}
.table1 .td2 {
  border: 1px solid #ccc;
  margin-left: 10px;
  padding: 5px;
  width: 150px;
  text-align: center;
}
.table1 .tit {
  font-weight: bolder;
  font-size: 15px;
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
  :global(.ant-form-explain) {
    min-height: 0px;
  }
}
.tableFormItem {
  :global(.ant-input-disabled) {
    color: rgba(0, 0, 0, 0.65);
    background-color: #ffffff;
  }
}
</style>
