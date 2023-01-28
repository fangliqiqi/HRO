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
        v-if="editButton"
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >保存</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="fundForm"
        layout="inline"
        class="ant-advanced-search-form ant-disabled-form"
      >
        <!-- 整个表单内容 -->
        <a-row :gutter="24">
          <!-- 左边内容 -->
          <a-col :span="12">
            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="选择公积金户"
                  class="stepFormText"
                >
                  <a-select
                    showSearch
                    optionFilterProp="children"
                    placeholder="请选择公积金户"
                    v-decorator="['departId', {rules: [{required: true, message: '请选择公积金户！'}]}]"
                    :dropdownMatchSelectWidth="false"
                    style="width: 332px"
                    :disabled="fundIsDisabled || departDisabled"
                  >
                    <a-select-option
                      v-for="(value, key) in fundHouseholdOptions"
                      :key="key"
                      :value="value.id"
                      @click="handleDepartChange(value)"
                    >{{ value.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="公积金类型"
                  class="stepFormText"
                >
                  <a-select
                    :disabled="fundIsDisabled || departDisabled"
                    placeholder="请选择公积金类型"
                    v-decorator="['fundPayType', {initialValue: '0', rules: [{required: true, message: '请选择公积金类型！'}]}]"
                    :dropdownMatchSelectWidth="false"
                    style="width: 332px"
                    @change="handleFundPayTypeChange"
                  >
                    <a-select-option value="0">市直</a-select-option>
                    <a-select-option value="1">省直</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="公积金缴纳地"
                  class="stepFormText"
                >
                  <a-select
                    showSearch
                    placeholder="选择省份"
                    optionFilterProp="children"
                    style="width: 100px"
                    v-decorator="['province', {rules: [{required: true, message: '请选择省份！'}]}]"
                    :dropdownMatchSelectWidth="false"
                    @change="handleFundProvinceChange"
                    :disabled="fundIsDisabled || departDisabled"
                  >
                    <a-select-option
                      v-for="(item, index) in AreaTrees"
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
                    v-decorator="['city', validatorFundRules.city]"
                    :dropdownMatchSelectWidth="false"
                    @change="handleFundCityChange"
                    :disabled="fundIsDisabled || fundPayTypeBool || departDisabled"
                  >
                    <a-select-option
                      v-for="(item, index) in fundAreaCitys"
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
                    :disabled="fundIsDisabled || fundPayTypeBool || departDisabled"
                  >
                    <a-select-option
                      v-for="(item, index) in fundAreaTowns"
                      :key="index"
                      :value="item.id"
                    >{{ item.areaName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="公积金适用周期"
                  class="stepFormText"
                >
                  <a-range-picker
                    :placeholder="['起始月', '截止月']"
                    format="YYYY-MM"
                    v-decorator="['applyStartDate', {rules: [{required: true, message: '请选择公积金适用周期！'}]}]"
                    :mode="['month', 'month']"
                    style="width: 332px"
                    @panelChange="handlePanelChange"
                    :disabled="fundIsDisabled"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="公积金基数下限"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    title="输入“下限”后输入“上限”"
                  >
                    <a-input
                      :disabled="fundIsDisabled || inputLowerLimit"
                      placeholder="基数下限"
                      v-decorator="['lowerLimit', validatorFundRules.lowerLimit]"
                      style="width: 97px"
                    />
                  </a-tooltip>
                </a-form-item>
                <a-form-item label="公积金基数上限">
                  <a-tooltip
                    placement="topLeft"
                    title="清除“上限”后修改“下限”"
                  >
                    <a-input
                      :disabled="fundIsDisabled || inputUpperLimit"
                      placeholder="基数上限"
                      v-decorator="['upperLimit', validatorFundRules.upperLimit]"
                      style="width: 97px"
                    />
                  </a-tooltip>
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="单边缴费额下限"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    title="输入“下限”后输入“上限”"
                  >
                    <a-input
                      :disabled="fundIsDisabled || inputPayLowerLimit"
                      placeholder="缴费额下限"
                      v-decorator="['fundPayLowerLimit', validatorFundRules.fundPayLowerLimit]"
                      style="width: 97px"
                    />
                  </a-tooltip>
                </a-form-item>
                <a-form-item label="单边缴费额上限">
                  <a-tooltip
                    placement="topLeft"
                    title="清除“上限”后修改“下限”"
                  >
                    <a-input
                      :disabled="fundIsDisabled || inputPayUpperLimit"
                      placeholder="缴费额上限"
                      v-decorator="['fundPayUpperLimit', validatorFundRules.fundPayUpperLimit]"
                      style="width: 97px"
                    />
                  </a-tooltip>
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="是否可以补缴"
                  class="stepFormText"
                >
                  <a-radio-group
                    :disabled="fundIsDisabled"
                    class="fontiframe"
                    name="radioGroup"
                    v-decorator="['canOverpay', {initialValue: '0', rules:[{required: true, message: '不能为空！'}]}]"
                    @change="handleCanOverpayChange"
                  >
                    <a-radio value="0">是</a-radio>
                    <a-radio value="1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>

              <a-col
                :span="24"
                v-if="fundCanOverpay"
              >
                <a-form-item
                  label="补缴期限"
                  class="stepFormText"
                >
                  <a-select
                    :disabled="fundIsDisabled"
                    placeholder="补缴期限"
                    v-decorator="['overpayNumber', {initialValue: '1', rules:[{required: true, message: '不能为空！'}]}]"
                    :dropdownMatchSelectWidth="false"
                    style="width: 104px"
                  >
                    <a-select-option
                      v-for="(value, key) in overpayNumberOptions"
                      :key="key"
                      :value="key"
                    >{{ value }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="是否含当月"
                  style="margin-left: 14px"
                >
                  <a-radio-group
                    :disabled="fundIsDisabled"
                    class="fontiframe"
                    name="radioGroup"
                    v-decorator="['haveThisMonth', {initialValue: '0', rules:[{required: true, message: '不能为空！'}]}]"
                  >
                    <a-radio value="0">是</a-radio>
                    <a-radio value="1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>

              <a-col
                :span="24"
                v-if="fundCanOverpay"
              >
                <a-form-item
                  label="补缴采用最新基数"
                  class="stepFormText"
                >
                  <a-radio-group
                    :disabled="fundIsDisabled"
                    class="fontiframe"
                    name="radioGroup"
                    v-decorator="['insuranceIsLatestCardinality', {initialValue: '0', rules:[{required: true, message: '不能为空！'}]}]"
                  >
                    <a-radio value="0">是</a-radio>
                    <a-radio value="1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>

              <a-col
                :span="24"
                v-if="fundCanOverpay"
              >
                <a-form-item
                  label="公积金补缴政策"
                  class="stepFormText"
                >
                  <a-textarea
                    :disabled="fundIsDisabled"
                    :rows="2"
                    placeholder="公积金补缴政策"
                    v-decorator="['payPolicy', {rules:[{required: true, message: '补缴政策不能为空！'}]}]"
                    style="width: 332px"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <!-- 右边内容 -->
          <a-col :span="12">
            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="公积金单边小数点"
                  class="stepFormText"
                >
                  <a-select
                    :disabled="fundIsDisabled"
                    placeholder="请选择公积金单边小数点"
                    v-decorator="['fundPayPoint', {rules:[{required: true, message: '请选择公积金单边小数点！'}]}]"
                    :dropdownMatchSelectWidth="false"
                    style="width: 332px"
                  >
                    <a-select-option
                      v-for="(item, index) in fundPayPointBelongs"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <j-editable-table
                  v-if="!fundIsDisabled"
                  ref="fundProListTableModal"
                  :loading="fundProListTable.loading"
                  :columns="fundProListTable.columns"
                  :dataSource="fundProListTable.dataSource"
                  :maxHeight="300"
                  :rowNumber="true"
                  :rowSelection="true"
                  :actionButton="true"
                >
                </j-editable-table>
                <div
                  v-else
                  class="steps-content"
                >
                  <!--列表-->
                  <a-table
                    rowKey="id"
                    size="small"
                    :columns="fundProListTable.infoColumns"
                    :dataSource="fundProListTable.dataSource"
                  ></a-table>
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction, deleteAction } from '@/api/manage'
  import JEditableTable from '@/components/jeecg/JEditableTable'
  import { FormTypes, getRefPromise } from '@/utils/JEditableTableUtil'

  export default {
    name: 'FundSettingModal',
    components: {
      JEditableTable
    },
    data() {
      return {
        moment,
        model: {},
        title: '操作',
        visible: false,
        editButton: true, // 保存按钮
        departName: '', // 户名称
        confirmLoading: false,
        fundForm: this.$form.createForm(this),
        dateFormat: 'YYYY-MM',  // 时间格式化类型
        AreaTrees: [], // 所有地区
        fundAreaCitys: [],  // 公积金城市
        fundAreaTowns: [],  // 公积金区县
        departDisabled: false,  // 编辑的时候户不能修改
        fundPayTypeBool: false, // 公积金类型
        fundCanOverpay: true, // 公积金是否可补缴
        fundHouseholdOptions: [], //公积金户
        fundPayPointBelongs: [], // 公积金单边小数点
        fundIsDisabled: false, // 公积金户未选择地址与日期不可选
        inputLowerLimit: false, // 下线可输入状态
        inputUpperLimit: true, // 上线可输入状态
        inputPayLowerLimit: false, // 下线可输入状态
        inputPayUpperLimit: true, // 上线可输入状态
        overpayNumberOptions: {'1': '一个月', '2': '两个月', '3': '三个月', '4': '四个月', '5': '五个月', '6': '六个月', '7': '七个月', '8': '八个月', '9': '九个月', '10': '十个月', '11': '十一个月', '12': '十二个月'}, // 补缴期限
        fundProListTable: {
          loading: false,
          dataSource: [],
          disabledRows: {},
          columns: [
            {
              title: '单位公积金比例',
              key: 'companyPro',
              width: '50%',
              type: FormTypes.input,
              defaultValue: 0,
              placeholder: '输入比例',
              validateRules: [{ required: true, message: "单位公积金比例不能为空" }, { pattern: /^(\d|[1-9]\d|99)(\.\d{1,2})?$/, message: '100内两位小数！' }],
            },
            {
              title: '个人公积金比例',
              key: 'personalPro',
              width: '50%',
              type: FormTypes.input,
              defaultValue: 0,
              placeholder: '输入比例',
              validateRules: [{ required: true, message: "个人公积金比例不能为空" }, { pattern: /^(\d|[1-9]\d|99)(\.\d{1,2})?$/, message: '100内两位小数！' }],
            }
          ],
          infoColumns: [
            {
              title: '单位公积金比例',
              align: 'center',
              dataIndex: 'companyPro',
            },
            {
              title: '个人公积金比例',
              align: 'center',
              dataIndex: 'personalPro',
            },
          ]
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        // 公积金数据校验
        validatorFundRules: {
          lowerLimit: { initialValue: 0, rules: [{required: true, message: '不能为空!'}, { validator: this.validateFundLowerLimit }] },
          upperLimit: { initialValue: 0, rules: [{required: true, message: '不能为空!'}, { validator: this.validateFundUpperLimit }] },
          fundPayLowerLimit: { initialValue: 0, rules: [{required: true, message: '不能为空!'}, { validator: this.validateFundPayLowerLimit }] },
          fundPayUpperLimit: { initialValue: 0, rules: [{required: true, message: '不能为空!'}, { validator: this.validateFundPayUpperLimit }] },
          city: { rules: [{required: true, message: '请选择城市！'}] },
        },
        url: {
          add: 'hrSocial/sysbasesetinfo',
          edit: 'hrSocial/sysbasesetinfo',
          delete: 'hrSocial/syspayproportion/',
        },
      }
    },
    methods: {
      // 获取所有的editableTable实例
      getAllTable() {
        return Promise.all([getRefPromise(this, 'fundProListTableModal')])
      },
      add() {
        // 默认新增一条数据
        this.getAllTable().then(editableTables => {
          editableTables[0].add()
        })
        this.edit({})
      },
      edit(record) {
        this.fundForm.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        // 默认保留一行数据
        this.getAllTable().then(editableTables => {
          editableTables[0].deleteLength = 1
        })
        /************************************************* 公积金数据 *************************************************/
        if (this.model.id) {  // 编辑的时候
          this.inputLowerLimit = true // 下线可输入状态
          this.inputUpperLimit = false // 上线可输入状态
          this.inputPayLowerLimit = true // 下线可输入状态
          this.inputPayUpperLimit = false // 上线可输入状态
          this.departDisabled = true  // 户不能修改
          // 公积金适用周期时间处理
          let applyStartDate = null
          applyStartDate = !this.model.applyStartDate ? null : moment(this.model.applyStartDate, this.dateFormat)
          this.model.applyStartDate = []
          this.model.applyStartDate[0] = applyStartDate
          this.model.applyStartDate[1] = !this.model.applyEndDate ? null : moment(this.model.applyEndDate, this.dateFormat)
          this.model.fundPayPoint += ''
          this.model.fundPayType += ''

          if (this.model.fundPayType == 1) { // 省直
            delete this.validatorFundRules.city
          }
          
          this.$nextTick(() => {
            this.fundForm.setFieldsValue(pick(this.model, 'departId', 'province', 'city', 'town', 'applyStartDate', 'lowerLimit', 'upperLimit', 'fundPayLowerLimit', 'fundPayUpperLimit', 'canOverpay', 'fundPayPoint', 'fundPayType'))
          })

          if (this.model.canOverpay != 0) { // 是否可补缴公积金（不可补缴）
            this.fundCanOverpay = false
          } else {
            // 月份转字符串
            this.model.overpayNumber += ''
            this.$nextTick(() => {
              this.fundForm.setFieldsValue(pick(this.model, 'overpayNumber', 'haveThisMonth', 'insuranceIsLatestCardinality', 'payPolicy'))
            })
          }

          //比例数据
          this.fundProListTable.dataSource = this.model.fundProList ? this.model.fundProList : []
          
          // 公积金地址
          for (const p of this.AreaTrees) {
            if (String(p.id) === String(this.model.province)) {
              this.fundAreaCitys = p.children
              for (const c of this.fundAreaCitys) {
                if (String(c.id) === String(this.model.city)) {
                  this.fundAreaTowns = c.children
                  break
                }
              }
            break
            }
          }
        }
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证（公积金表单）
        this.fundForm.validateFields((err, values) => {
          if (!err) {
            let httpurl = ''
            let method = ''
            let formData = Object.assign(this.model, values)
            let applyStartDate = formData.applyStartDate[0]
            let applyEndDate = formData.applyStartDate[1]

            // 适用周期开始时间
            formData.applyStartDate = applyStartDate ? (applyStartDate.format(this.dateFormat) + '-01 00:00:00') : null
            // 适用周期结束时间
            formData.applyEndDate = applyEndDate ? moment(applyEndDate).endOf('month').format('YYYY-MM-DD HH:mm:ss') : null

            let fundProList = []
            let fundProListSub = false
            // 获取比例列表
            that.$refs.fundProListTableModal.getValues((error, values) => {
                // 错误数 = 0 则代表验证通过
                if (error === 0) {
                  // 组装数据（排除新建的）
                  if (this.model.id) { // 编辑
                    for (let i = 0; i < values.length; i++) {
                      let find = false  // 默认未找到

                      for (let j = 0; j < this.model.fundProList.length; j++) {
                        if (this.model.fundProList[j].id == values[i].id) {
                          fundProList.push(values[i])
                          find = true
                        }
                      }
                      
                      if (!find) {  // 未找到等于新建
                        let newData = values[i]
                        delete newData.id
                        fundProList.push(newData)
                      }
                    }
                  } else {  // 新建
                    for (let i = 0; i < values.length; i++) {
                      let newData = values[i]
                      delete newData.id
                      fundProList.push(newData)
                    }
                  }

                  fundProListSub = true
                } else {
                  fundProListSub = false
                }
            })

            if (fundProListSub) { // 提交
              if (this.model.id) { // 编辑
                httpurl += this.url.edit
                method += 'put'
                // 删除的行id
                let deleteIds = that.$refs.fundProListTableModal.getDeleteIds()

                for (let i = 0; i < deleteIds.length; i++) {
                  for (let j = 0; j < this.model.fundProList.length; j++) {
                    if (this.model.fundProList[j].id == deleteIds[i]) {
                      deleteAction(that.url.delete + deleteIds[i]).then((res) => {
                        if (res.code != 200) {
                          //兼容
                          that.$message.warning(res.message || res.msg)
                          return false
                        }
                      })
                    }
                  }
                }
              } else {  // 添加
                httpurl += this.url.add
                method += 'post'
              }

              // 判断是否添加比例
              if (fundProList.length <= 0) { 
                that.$message.error('请最少添加一条公积金比例！')
                return false
              }

              that.confirmLoading = true
              formData.fundProList = fundProList
              formData.baseType = 1  // 公积金
              formData.departName = this.departName ? this.departName : formData.departName  // 公积金户名称
              
              if (Array.isArray(formData.city)) {
                formData.city = null
              }
              
              if (Array.isArray(formData.town)) {
                formData.town = null
              }

              httpAction(httpurl, formData, method).then((res) => {
                if (res.code === 200) {
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
          }
        })
      },
      // 关闭按钮
      handleCancel() {
        this.close()
      },
      // 关闭功能数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.editButton = true // 保存按钮
        this.departName = '' // 户名称
        this.confirmLoading = false
        this.AreaTrees = [] // 所有地区
        this.fundAreaCitys = []  // 公积金城市
        this.fundAreaTowns = []  // 公积金区县
        this.departDisabled = false  // 编辑的时候户不能修改
        this.fundCanOverpay = true // 公积金是否可补缴
        this.fundProvidentPer = [] // 公积金比例
        this.fundIsDisabled = false // 编辑
        this.fundPayTypeBool = false // 公积金类型
        this.fundPayPointBelongs = [] // 公积金单边小数点
        this.fundHouseholdOptions = [] //公积金户
        this.inputLowerLimit = false // 下线可输入状态
        this.inputUpperLimit = true // 上线可输入状态
        this.inputPayLowerLimit = false // 下线可输入状态
        this.inputPayUpperLimit = true // 上线可输入状态
        this.fundProListTable.dataSource = [] // 清除数据
        this.getAllTable().then(editableTables => {
          editableTables[0].initialize()
        })
        this.validatorFundRules = {
          lowerLimit: { rules: [{required: true, message: '不能为空!'}, { validator: this.validateFundLowerLimit }] },
          upperLimit: { rules: [{required: true, message: '不能为空!'}, { validator: this.validateFundUpperLimit }] },
          fundPayLowerLimit: { rules: [{required: true, message: '不能为空!'}, { validator: this.validateFundPayLowerLimit }] },
          fundPayUpperLimit: { rules: [{required: true, message: '不能为空!'}, { validator: this.validateFundPayUpperLimit }] },
          city: { rules: [{required: true, message: '请选择城市！'}] },
        }
      },
      // 公积金户
      handleDepartChange(value) {
        this.departName = value.name
      },
      // 公积金缴纳地省份切换
      handleFundProvinceChange(value) {
        this.fundAreaCitys = []
        this.fundAreaTowns = []

        for (var c of this.AreaTrees[value - 1].children) {
          this.fundAreaCitys.push(c)
        }

        if (this.fundPayTypeBool) {  // 省直
          this.model.city = []
        } else {
          this.model.city = this.fundAreaCitys[0].id
        }

        for (var t of this.fundAreaCitys[0].children) {
          this.fundAreaTowns.push(t)
        }
        
        this.model.town = []
        this.fundForm.setFieldsValue(pick(this.model, 'city', 'town'))
      },
      // 公积金缴纳地城市切换
      handleFundCityChange(value) {
        this.fundAreaTowns = []

        for (var c of this.fundAreaCitys) {
          if (String(c.id) === String(value)) {
            if (c.children.length > 0) {
              for (var t of c.children) {
                this.fundAreaTowns.push(t)
              }
            }
          break
          }
        }

        if (this.fundAreaTowns.length > 0) {
          this.model.town = this.fundAreaTowns[0].id
          this.fundForm.setFieldsValue(pick(this.model, 'town'))
        } else {
          this.model.town = []
          this.fundForm.setFieldsValue(pick(this.model, 'town'))
        }
      },
      // 公积金类型转变
      handleFundPayTypeChange(value) {
        if (value == 1) { // 省直
          this.fundPayTypeBool = true
          this.validatorFundRules.city.rules = []
        } else {
          this.fundPayTypeBool = false
          this.validatorFundRules.city.rules[0] = {required: true, message: '请选择城市！'}
        }
        // 市、县数据重置
        this.$nextTick(() => {
          this.fundForm.setFieldsValue(pick({'city': [], 'town': []}, 'city', 'town'))
        })
      },
      // 社保适用周期
      handlePanelChange(value) {
        this.model.applyStartDate = value
        this.fundForm.setFieldsValue(pick(this.model, 'applyStartDate'))
      },
      // 是否可以补缴
      handleCanOverpayChange(e) {
        if (e.target.value == 0) {
          this.fundCanOverpay = true
        } else if (e.target.value == 1) {
          this.fundCanOverpay = false
        }
      },
      /******************************************* 验证规则 *******************************************/
      // 公积金基数下限
      validateFundLowerLimit(rule, value, callback) {
        if (!value) {
          this.inputUpperLimit = true // 上线可输入状态
          callback()
          return false
        }

        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          this.inputUpperLimit = true // 上线可输入状态
          callback('输入两位小数!')
          return false
        }

        // let upperLimit = this.fundForm.getFieldValue('upperLimit') * 1
        
        // if ((value * 1) > upperLimit && upperLimit >= 0) {
        //   callback('小于等于上限!')
        //   return false
        // }
      
        this.inputUpperLimit = false // 上线可输入状态
        callback()
        return true
      },
      // 公积金基数上限
      validateFundUpperLimit(rule, value, callback) {
        if (!value) {
          this.inputLowerLimit = false // 下线可输入状态
          callback()
          return false
        }

        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          this.inputLowerLimit = true // 下线可输入状态
          callback('输入两位小数!')
          return false
        }

        let lowerLimit = this.fundForm.getFieldValue('lowerLimit') * 1
        
        if ((value * 1) < lowerLimit && lowerLimit >= 0) {
          this.inputLowerLimit = true // 下线可输入状态
          callback('大于等于下限!')
          return false
        }
      
        this.inputLowerLimit = true // 下线可输入状态
        callback()
        return true
      },
      // 公积金单边缴费额下限
      validateFundPayLowerLimit(rule, value, callback) {
        if (!value) {
          this.inputPayUpperLimit = true // 上线可输入状态
          callback()
          return false
        }

        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          this.inputPayUpperLimit = true // 上线可输入状态
          callback('输入两位小数!')
          return false
        }

        // let upperLimit = this.fundForm.getFieldValue('fundPayUpperLimit') * 1
        
        // if ((value * 1) > upperLimit && upperLimit >= 0) {
        //   callback('小于等于上限!')
        //   return false
        // }
      
        this.inputPayUpperLimit = false // 上线可输入状态
        callback()
        return true
      },
      // 公积金单边缴费额上限
      validateFundPayUpperLimit(rule, value, callback) {
        if (!value) {
          this.inputPayLowerLimit = false // 下线可输入状态
          callback()
          return false
        }

        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          this.inputPayLowerLimit = true // 下线可输入状态
          callback('输入两位小数!')
          return false
        }

        let lowerLimit = this.fundForm.getFieldValue('fundPayLowerLimit') * 1
        
        if ((value * 1) < lowerLimit && lowerLimit >= 0) {
          this.inputPayLowerLimit = true // 下线可输入状态
          callback('大于等于下限!')
          return false
        }
      
        this.inputPayLowerLimit = true // 下线可输入状态
        callback()
        return true
      },
      // 验证公积金比例（统一验证）
      validateFundPro(rule, value, callback) {
        if (!value) {
            callback()
            return false
        }

        if (!new RegExp(/^(\d|[1-9]\d|99)(\.\d{1,2})?$/).test(value)) { // (0-99)验证百分比
          callback('100内两位小数！')
          return false
        }
        
        callback()
        return true
      },
      // 验证公积金金额（统一验证）
      validateFundMoney(rule, value, callback) {
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
      // 精度处理
      formatFloat(f, digit = 2) {
        const m = Math.pow(10, digit)
        return Math.round(f * m) / m
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 140px;
  }
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
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
</style>
