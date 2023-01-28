<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        v-if="addConfirmButton"
        type="primary"
        :loading="confirmLoading"
        @click="handleOk('addConfirm')"
      >保存</a-button>
      <a-button
        v-if="addReleaseButton"
        type="primary"
        :loading="confirmLoading"
        @click="handleOk('addRelease')"
      >提交开票申请</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form ant-disabled-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="客户名称"
              class="stepFormText"
            >
              <a-select
                showSearch
                :disabled="!addConfirmButton"
                optionFilterProp="children"
                placeholder="请选择客户名称"
                v-decorator="['unitId', {rules: [{ required: true, message: '请选择客户名称！' }]}]"
                :dropdownMatchSelectWidth="false"
                style="width: 200px"
              >
                <a-select-option
                  v-for="(value, key) in unitBelongs"
                  :key="key"
                  :value="value.id"
                  @click="handleUnitChange(value)"
                >{{ value.customerName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="结算主体"
              class="stepFormText"
              v-if="showSettle"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择结算主体"
                v-decorator="['settleDomainId', validatorRules.settleDomainId]"
                :dropdownMatchSelectWidth="false"
                style="width: 200px"
                :disabled="settleDomainDisabled || !addConfirmButton"
              >
                <a-select-option
                  v-for="(value, key) in settleDomainBelongs"
                  :key="key"
                  :value="value.id"
                  @click="handleGetList(value)"
                >{{ value.departName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                :disabled="(invoiceSetting.total && invoiceSetting.total > 1) ? false : true"
                @click="handleInvoiceSettingList()"
              >选择开票配置</a-button>
            </a-form-item>
          </a-col>
        </a-row>

        <div class="steps-content-setting">
          <a-row>
            <a-col :span="24">
              <a-form-item
                label="抬头名称"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.headerName ? invoiceSetting.headerName : '-'"
                >
                  {{ invoiceSetting.headerName ? invoiceSetting.headerName : '-' }}
                </a-tooltip>
              </a-form-item>
              <a-form-item
                label="纳税人识别号"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.taxIdentificationNum ? invoiceSetting.taxIdentificationNum : '-'"
                >
                  {{ invoiceSetting.taxIdentificationNum ? invoiceSetting.taxIdentificationNum : '-' }}
                </a-tooltip>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="24">
              <a-form-item
                label="商品名称"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.goodsName ? invoiceSetting.goodsName : '-'"
                >
                  {{ invoiceSetting.goodsName ? invoiceSetting.goodsName : '-' }}
                </a-tooltip>
              </a-form-item>
              <a-form-item
                label="发票类型"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.invKindName ? invoiceSetting.invKindName : '-'"
                >
                  {{ invoiceSetting.invKindName ? invoiceSetting.invKindName : '-' }}
                </a-tooltip>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="24">
              <a-form-item
                label="税收分类"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.classCodeName ? invoiceSetting.classCodeName : '-'"
                >
                  {{ invoiceSetting.classCodeName ? invoiceSetting.classCodeName : '-' }}
                </a-tooltip>
              </a-form-item>
              <a-form-item
                label="税率"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.goodsTaxRate"
                >
                  {{ invoiceSetting.goodsTaxRate }}
                </a-tooltip>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="24">
              <a-form-item
                label="开户行"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.bankName ? invoiceSetting.bankName : '-'"
                >
                  {{ invoiceSetting.bankName ? invoiceSetting.bankName : '-' }}
                </a-tooltip>
              </a-form-item>
              <a-form-item
                label="银行卡号"
                class="stepFormTextDisabled"
              >
                <a-tooltip
                  placement="topLeft"
                  :title="invoiceSetting.bankNo ? invoiceSetting.bankNo : '-'"
                >
                  {{ invoiceSetting.bankNo ? invoiceSetting.bankNo : '-' }}
                </a-tooltip>
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="申请开票金额"
              class="stepFormText"
            >
              <a-input
                :disabled="!addConfirmButton && !addReleaseButton"
                placeholder="请输入开票金额"
                v-decorator="['invoiceMoney', validatorRules.invoiceMoney]"
                style="width: 200px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col>
            <a-form-item
              label="开票端口"
              class="stepFormText"
            >
              <a-select
                showSearch
                placeholder="选择省份"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['province', {rules: [{ required: true, message: '请选择省份！' }]}]"
                @change="handleProvinceChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaTrees"
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
                v-decorator="['city', {rules: [{ required: true, message: '请选择城市！' }]}]"
                @change="handleCityChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaCitys"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                allowClear
                showSearch
                placeholder="选择区县"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['town', {}]"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaTowns"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注"
              class="stepFormText"
            >
              <a-textarea
                :disabled="!addConfirmButton"
                :rows="2"
                placeholder="请输入备注"
                v-decorator="['remark', {rules: [{ max: 500, message: '最大长度500个字符！'}]}]"
                style="width: 450px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <div class="steps-content">
              <!--列表-->
              <a-table
                v-if="addConfirmButton"
                rowKey="settleFormId"
                size="middle"
                :bordered="true"
                :columns="columns"
                :loading="loading"
                :customRow="rowSelect"
                :dataSource="dataSource"
                :pagination="ipagination"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
              >
                <!-- 结算金额 -->
                <span
                  slot="settleMoney"
                  :style="handleColumnStyle(100)"
                  slot-scope="text"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="text"
                  >
                    {{ text }}
                  </a-tooltip>
                </span>

                <!-- 结算单类型 -->
                <span
                  slot="settleFormType"
                  :style="handleColumnStyle(100)"
                  slot-scope="text"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="text ? formTypeOptions[text] : '-'"
                  >
                    {{ text ? formTypeOptions[text] : '-' }}
                  </a-tooltip>
                </span>

                <!-- 结算日期 -->
                <span
                  slot="settleMonth"
                  :style="handleColumnStyle(100)"
                  slot-scope="text"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="text ? text : '-'"
                  >
                    {{ text ? text : '-' }}
                  </a-tooltip>
                </span>
              </a-table>
              <!-- 编辑 -->
              <a-table
                v-if="!addConfirmButton"
                rowKey="id"
                :columns="columns"
                :dataSource="editDataSource"
              >
                <!-- 结算金额 -->
                <span
                  slot="settleMoney"
                  :style="handleColumnStyle(100)"
                  slot-scope="text"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="text"
                  >
                    {{ text }}
                  </a-tooltip>
                </span>

                <!-- 结算单类型 -->
                <span
                  slot="settleFormType"
                  :style="handleColumnStyle(100)"
                  slot-scope="text"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="text ? formTypeOptions[text] : '-'"
                  >
                    {{ text ? formTypeOptions[text] : '-' }}
                  </a-tooltip>
                </span>

                <!-- 结算日期 -->
                <span
                  slot="settleMonth"
                  :style="handleColumnStyle(100)"
                  slot-scope="text"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="text ? text : '-'"
                  >
                    {{ text ? text : '-' }}
                  </a-tooltip>
                </span>
              </a-table>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <back-modal
      ref="backModal"
      @ok="formOk"
    ></back-modal>
    <open-invoice-modal
      ref="openInvoiceModal"
      @ok="formOk"
    ></open-invoice-modal>
    <open-invoice-list-modal
      ref="openInvoiceListModal"
      @ok="invoiceListFormOk"
    ></open-invoice-list-modal>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import BackModal from './BackModal'
  import { filterObj } from '@/utils/util'
  import OpenInvoiceModal from './OpenInvoiceModal'
  import { getAction, httpAction } from '@/api/manage'
  import OpenInvoiceListModal from './OpenInvoiceListModal'
  import { filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'InvoiceApplyAddModal',
    components: {
      BackModal,
      OpenInvoiceModal,
      OpenInvoiceListModal,
    },
    data() {
      return {
        /* 查询条件 */
        queryParam: {},
        /* 数据源 */
        dataSource: [],
        /* 分页参数 */
        ipagination: {
          current: 1,
          pageSize: 10,
          onChange: (page, pageSize) => {
            this.ipagination.current = page
            this.ipagination.pageSize = pageSize
          },
        },
        loading: false,
        /* table选中keys*/
        selectedRowKeys: [],
        /* table选中records*/
        selectionRows: [],
        /* 高级查询条件生效状态 */
        superQueryFlag: false,
        /* 高级查询条件 */
        superQueryParams: '',
        getQueryParams() {
          //获取查询条件
          let sqp = {}
          if (this.superQueryParams) {
            sqp['superQueryParams'] = encodeURI(this.superQueryParams)
          }
          var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
          param.current = this.ipagination.current
          param.size = this.ipagination.pageSize
          return filterObj(param)
        },
        columns: [
          {
            title: '结算金额',
            align: 'center',
            dataIndex: 'settleMoney',
            scopedSlots: { customRender: 'settleMoney' },
          },
          {
            title: '结算单类型',
            align: 'center',
            dataIndex: 'settleFormType',
            scopedSlots: { customRender: 'settleFormType' },
          },
          {
            title: '结算日期',
            align: 'center',
            dataIndex: 'settleMonth',
            scopedSlots: { customRender: 'settleMonth' },
          },
        ],
        model: {},
        title: '操作',
        visible: false,
        backButton: false,  // 退回
        invoiceButton: false,  // 开票
        addConfirmButton: true, // 保存
        addReleaseButton: true, // 提交开票申请
        confirmLoading: false,
        settleDomainDisabled: true, // 结算主体禁止选择
        form: this.$form.createForm(this),
        unitNo: '', // 客户Code
        unitName: '', // 客户单位
        unitId:'',
        areaTrees: [],  // 地区
        areaCitys: [],  // 城市
        areaTowns: [],  // 区县
        unitBelongs: [],  // 客户单位
        invoiceSetting: {}, // 开票配置
        invoiceSettingList: [], // 配置列表
        editDataSource: [], // 编辑的时候列表数据
        settleDomainNo: '', // 结算主体Code
        settleDomainName: '', // 结算主体
        settleDomainBelongs: [],  // 结算主体
        invoiceTypeOptions: {}, // 开票类型
        goodsNameOptions: [], // 商品名称
        taxClassificationOptions: [], // 税收分类
        invKindOptions: {}, // 发票类型
        formTypeOptions: {'0': '普通工资', '1': '工程工资', '2': '商险', '3': '预估结算单', '4': '一次性业务结算单'},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          invoiceMoney: {rules: [{ required: true, message: '请输入开票金额！' }, { validator: this.validatInvoiceMoney }]},
          settleDomainId: {rules: [{ required: true, message: '请选择结算主体！' }]},
          headerName: {rules: [{ required: true, message: '请选抬头名！' }]},
          taxIdentificationNum: {rules: [{ required: true, message: '请输入纳税人识别号！' }]},
        },
        url: {
          list: 'salary/tinvoice/getTInvoiceList', // 列表
          add: 'salary/tinvoice/saveInvoice',  // 保存
          ReleaseUrl: 'salary/tinvoice/doSubmit', // 发布
          getInvoice: 'hrBase/tticketconfig/page'
        },
        showSettle:true, // 显示结算主体
      }
    },
    methods: {
      // 数据加载
      loadData() {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性！')
          return
        }
        this.selectionRows = []
        this.selectedRowKeys = []
        this.ipagination.current = 1  // 重置第一页
        var params = this.getQueryParams() //查询条件
        delete params.dateTemp
        delete params.current
        delete params.size
        this.loading = true // 加载图标
        getAction(this.url.list, params).then((res) => {
          if (Number(res.code) === 200) {
            this.dataSource = res.data
          } else {
            this.$message.error('获取数据失败！')
          }
          this.loading = false
        })
      },
      // 点击按钮选中
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectionRows = selectionRows
        if(!this.form.getFieldValue('invoiceMoney')){
          this.$nextTick(() => {
            this.model.invoiceMoney = this.selectionRows[0]['settleMoney']
            this.form.setFieldsValue(pick(this.model, 'invoiceMoney'))
          })
        }
      },
      // 点击整行选中
      rowSelect(record) {
        return {
          on: {
            click: () => {
              this.selectionRows = [record]
              this.selectedRowKeys = [record.settleFormId]  // 点击行选中
              if(!this.form.getFieldValue('invoiceMoney')){
                this.$nextTick(() => {
                  this.model.invoiceMoney = this.selectionRows[0]['settleMoney']
                  this.form.setFieldsValue(pick(this.model, 'invoiceMoney'))
                })
              }
            }
          }
        }
      },
      add() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        // 默认安徽省
        this.areaCitys = []
        for (const c of this.areaTrees[12 - 1].children) {
          this.areaCitys.push(c)
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({province: 12}, 'province'))
        })
        if (this.model.tinvoice) {  // 编辑
          for (const item of this.unitBelongs) {  // 处理结算主体数据
            if (String(item.id) === String(this.model.tinvoice.unitId)) {
              this.settleDomainBelongs = item.settleDomainList
              break
            }
          }
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({'invoiceMoney': this.model.tinvoice.invoiceMoney, 'unitId': this.model.tinvoice.unitId, 'settleDomainId': this.model.tinvoice.settleDomainId, 'remark': this.model.tinvoice.remark}, 'invoiceMoney', 'unitId', 'settleDomainId', 'remark'))
          })
          this.editDataSource = this.selectionRows = this.model.mlist
        }
      },
      // 预估开票
      predictAdd(record){
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.showSettle = false
        // 默认安徽省
        this.areaCitys = []
        for (const c of this.areaTrees[12 - 1].children) {
          this.areaCitys.push(c)
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({province: 12}, 'province'))
        })
      },
      // 保存按钮
      handleOk(type) {
        const that = this
        if (that.selectionRows.length > 0) {
          // 触发表单验证
          this.form.validateFields((err, values) => {
            if (!err) {
              that.confirmLoading = true
              let httpurl = ''
              const method = 'post'
              const formData = Object.assign(this.model, values)
              if (this.model.tinvoice) {  // 编辑
                httpurl += this.url.ReleaseUrl
                httpurl += `?tInvoiceId=${this.model.tinvoice.id}&invoiceMoney=${formData.invoiceMoney}&headerName=${formData.headerName}&taxIdentificationNum=${formData.taxIdentificationNum}&goodsName=${formData.goodsName}&invKind=${formData.invKind}&classCode=${formData.classCode}&goodsTaxRate=${formData.goodsTaxRate}`
                if (formData.address) {
                  httpurl += `&address=${formData.address}`
                }
                if (formData.tel) {
                  httpurl += `&tel=${formData.tel}`
                }
                if (formData.bankName) {
                  httpurl += `&bankName=${formData.bankName}`
                }
                if (formData.bankNo) {
                  httpurl += `&bankNo=${formData.bankNo}`
                }
                if (formData.remark) {
                  httpurl += `&remark=${formData.remark}`
                }
                httpAction(httpurl, '', method).then((res) => {
                  if (Number(res.code) === 200) {
                    that.$message.success(`${that.title}成功！`)
                    that.$emit('ok')
                    that.close()
                  } else {
                    that.$message.warning(res.msg || res.message)
                  }
                }).finally(() => {
                  that.confirmLoading = false
                })
              } else {
                if (Array.isArray(formData.city)) {
                  formData.city = null
                }
                if (Array.isArray(formData.town)) {
                  formData.town = null
                }
                httpurl += this.url.add
                const tinvoiceData = {}
                const requestData = {}
                tinvoiceData.unitNo         = this.unitNo
                tinvoiceData.unitId         = formData.unitId
                tinvoiceData.unitName       = this.unitName
                tinvoiceData.invoiceMoney   = formData.invoiceMoney
                tinvoiceData.headerName     = this.invoiceSetting.headerName
                tinvoiceData.taxIdentificationNum = this.invoiceSetting.taxIdentificationNum
                tinvoiceData.bankName       = this.invoiceSetting.bankName
                tinvoiceData.bankNo         = this.invoiceSetting.bankNo
                tinvoiceData.goodsName      = this.invoiceSetting.goodsName
                tinvoiceData.invKind        = this.invoiceSetting.invKind
                tinvoiceData.classCode      = this.invoiceSetting.classCode
                tinvoiceData.goodsTaxRate   = this.invoiceSetting.goodsTaxRate
                tinvoiceData.settleDomainNo = this.settleDomainNo
                tinvoiceData.settleDomainId = formData.settleDomainId
                tinvoiceData.settleDomainName = this.settleDomainName
                tinvoiceData.remark         = formData.remark
                tinvoiceData.province       = formData.province ? formData.province : null
                tinvoiceData.city           = formData.city ? formData.city : null
                tinvoiceData.town           = formData.town ? formData.town : null
                console.log(tinvoiceData,111)
                if (!tinvoiceData.headerName || !tinvoiceData.goodsName || !tinvoiceData.invKind || !tinvoiceData.classCode) {
                  that.$message.error('请先完善开票信息配置！')
                  that.confirmLoading = false
                  return false
                }
                if (String(type) === 'addConfirm') {  // 保存
                  tinvoiceData.auditFlag = 0
                } else if (String(type) === 'addRelease') {  // 提交开票申请
                  tinvoiceData.auditFlag = 1
                }
                requestData.isRes = this.selectionRows
                requestData.tinvoice = tinvoiceData
                httpAction(httpurl, requestData, method).then((res) => {
                  if (Number(res.code) === 200) {
                    that.$message.success(`${that.title}成功！`)
                    that.$emit('ok')
                    that.close()
                  } else {
                    that.$message.warning(res.msg || res.message)
                  }
                }).finally(() => {
                  that.confirmLoading = false
                })
              }
            }
          })
        } else {
          that.$message.error('请选择结算单！')
        }
      },
      // 关闭功能
      handleCancel() {
        this.close()
      },
      // 表单关闭与数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.backButton = false  // 退回
        this.invoiceButton = false  // 开票
        this.addConfirmButton = true // 保存
        this.addReleaseButton = true // 提交开票申请
        this.showSettle = true // 结算主体显示
        this.confirmLoading = false
        this.settleDomainDisabled = true // 结算主体禁止选择
        this.unitNo = '' // 客户单位code
        this.unitName = '' // 客户单位
        this.areaTrees = []  // 地区
        this.areaCitys = []  // 城市
        this.areaTowns = []  // 区县
        this.unitBelongs = []  // 客户单位
        this.invoiceSetting = {} // 开票配置
        this.invoiceSettingList = [] // 配置列表
        this.settleDomainNo = '' // 结算主体code
        this.settleDomainName = '' // 结算主体
        this.settleDomainBelongs = []  // 结算主体
        this.selectionRows = []
        this.selectedRowKeys = []
        this.ipagination.current = 1  // 重置第一页
        this.queryParam = {}
        this.dataSource = []
        this.editDataSource = [] // 编辑的时候列表数据
        this.invoiceTypeOptions = {} // 开票类型
        this.goodsNameOptions = [] // 商品名称
        this.taxClassificationOptions = [] // 税收分类
        this.unitId = ''
      },
      // 单位选择变化
      handleUnitChange(value) {
        if(this.showSettle){
          this.unitName = value.customerName
          this.model.settleDomainId = []
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'settleDomainId'))
          })
          this.settleDomainDisabled = false
          this.settleDomainBelongs = value.settleDomainList
        }else{
          this.url.list = `${(this.url.list).split("?")[0]}?type=1&unitId=${value.id}`
          this.unitName = value.customerName
          this.unitNo = value.customerCode
          // 预估开票无结算主体
          httpAction(`hrBase/tticketconfig/getByUnitId?unitId=${value.id}`,null,'get').then(res=>{
            this.invoiceSetting = {}
            this.invoiceSettingList = []
            if(Number(res.code) === 200 && res.data.length){
              this.invoiceSetting.total = res.data.length
              this.invoiceSettingList = res.data
              this.invoiceSetting.headerName           = res.data[0].ticketTableHead
              this.invoiceSetting.taxIdentificationNum = res.data[0].taxpayerIdentificationNo
              this.invoiceSetting.goodsName            = res.data[0].goodsName
              this.invoiceSetting.invKind              = res.data[0].invKind
              this.invoiceSetting.invKindName          = this.invKindOptions[res.data[0].invKind]
              this.invoiceSetting.classCode            = res.data[0].classCode
              this.invoiceSetting.classCodeName        = filterDictText(this.taxClassificationOptions, res.data[0].classCode)
              this.invoiceSetting.goodsTaxRate         = res.data[0].goodsTaxRate
              this.invoiceSetting.bankName             = res.data[0].bankName
              this.invoiceSetting.bankNo               = res.data[0].bankNo
            }else{
              this.$message.error('请先完善开票信息配置！')
              return false
            }
          }).finally(()=>{
            this.loadData()
          })
        }
      },
      // 选择结算主体后请求列表
      handleGetList(value) {
        this.unitNo = value.customerCode
        this.settleDomainNo = value.departNo
        this.settleDomainName = value.departName
        this.url.list = `${(this.url.list).split("?")[0]}?type=0&deptId=${value.id}&unitId=${value.customerId}`
        httpAction(`${this.url.getInvoice}?settleId=${value.id}&current=1&size=30`, {}, 'GET').then((res) => {
          this.invoiceSetting = {}
          this.invoiceSettingList = [] // 配置列表        
          if (Number(res.code) === 200 && res.data.total) {
            this.invoiceSettingList = res.data.records // 配置列表
            this.invoiceSetting.total                = res.data.total
            this.invoiceSetting.headerName           = res.data.records[0].ticketTableHead
            this.invoiceSetting.taxIdentificationNum = res.data.records[0].taxpayerIdentificationNo
            this.invoiceSetting.goodsName            = res.data.records[0].goodsName
            this.invoiceSetting.invKind              = res.data.records[0].invKind
            this.invoiceSetting.invKindName          = this.invKindOptions[res.data.records[0].invKind]
            this.invoiceSetting.classCode            = res.data.records[0].classCode
            this.invoiceSetting.classCodeName        = filterDictText(this.taxClassificationOptions, res.data.records[0].classCode)
            this.invoiceSetting.goodsTaxRate         = res.data.records[0].goodsTaxRate
            this.invoiceSetting.bankName             = res.data.records[0].bankName
            this.invoiceSetting.bankNo               = res.data.records[0].bankNo
          } else {
            this.$message.error('请先完善开票信息配置！')
            return false
          }
        })
        this.loadData()
      },
      // 开票配置列表
      handleInvoiceSettingList() {
        this.$refs.openInvoiceListModal.title = '开票信息配置列表'
        this.$refs.openInvoiceListModal.dataSource = this.invoiceSettingList
        this.$refs.openInvoiceListModal.invKindOptions = this.invKindOptions
        this.$refs.openInvoiceListModal.taxClassificationOptions = this.taxClassificationOptions
        this.$refs.openInvoiceListModal.add()
      },
      // 表单回调
      formOk() {
        this.close()
        this.$emit('ok')
      },
      // 选中回调
      invoiceListFormOk() {
        const selectionRow = this.$refs.openInvoiceListModal.selectionRows[0]
        this.invoiceSetting = {}
        this.invoiceSetting.total                = 2  // 直接是2
        this.invoiceSetting.headerName           = selectionRow.ticketTableHead
        this.invoiceSetting.taxIdentificationNum = selectionRow.taxpayerIdentificationNo
        this.invoiceSetting.goodsName            = selectionRow.goodsName
        this.invoiceSetting.invKind              = selectionRow.invKind
        this.invoiceSetting.invKindName          = this.invKindOptions[selectionRow.invKind]
        this.invoiceSetting.classCode            = selectionRow.classCode
        this.invoiceSetting.classCodeName        = filterDictText(this.taxClassificationOptions, selectionRow.classCode)
        this.invoiceSetting.goodsTaxRate         = selectionRow.goodsTaxRate
        this.invoiceSetting.bankName             = selectionRow.bankName
        this.invoiceSetting.bankNo               = selectionRow.bankNo
      },
      // 省份切换
      handleProvinceChange(value) {
        this.areaCitys = []
        this.areaTowns = []
        for (const c of this.areaTrees[value - 1].children) {
          this.areaCitys.push(c)
        }
        this.form.setFieldsValue(pick({city: [], town: []}, 'city', 'town'))
      },
      // 市切换
      handleCityChange(value) {
        this.areaTowns = []
        for (const c of this.areaCitys) {
          if (String(c.id) === String(value)) {
            if (c.children.length > 0) {
              for (const t of c.children) {
                this.areaTowns.push(t)
              }
            }
          break
          }
        }
        this.form.setFieldsValue(pick({town: []}, 'town'))
      },
      // 隐藏列样式
      handleColumnStyle(width) {
        if (width) {
          return `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: ${width}px;`
        }
        return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
      },

      /******************************************* 验证规则 *******************************************/
      // 金额验证
      validatInvoiceMoney(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          callback('输入两位小数！')
          return false
        }
        callback()
        return true
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 120px;
  }
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
.stepFormTextDisabled {
  margin-bottom: 0px;
  :global(.ant-form-item-label) {
    width: 120px;
  }
  :global(.ant-form-item-control .ant-form-item-children) {
    text-align: left;
    width: 250px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
}
.ant-disabled-form {
  :global(.ant-input-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-select-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-checkbox-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-radio-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
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
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}
.steps-content-setting {
  margin-bottom: 20px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}
</style>
