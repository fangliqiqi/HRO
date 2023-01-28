<template>
  <a-modal
    title="工资报表"
    :width="1200"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭"
    okText="生成结算"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
  >
    <!-- <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange"
    ></a-table> -->
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="工资明细">
        <form :autoFormCreate="(form) => this.form = form">
          <a-table
            :columns="columns"
            :dataSource="dataSource"
            :pagination="pagination"
            :loading="loading"
            :scroll="scroll"
          >
            <template
              v-for="(col, i) in colMenu"
              :slot="col"
              slot-scope="text, record"
            >
              <a-input
                :key="col"
                v-if="record.editable"
                style="margin: -5px 0"
                :value="text"
                :placeholder="columns[i].title"
                @change="e => handleChange(e.target.value, record.key, col)"
              />
              <template v-else>{{ text }}</template>
            </template>
            <template
              slot="operation"
              slot-scope="text, record"
            >
              <span>
                <a @click="toggle(record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="detail(record.key)">详情</a>
              </span>
              <!-- <template v-if="record.editable">
                <span v-if="record.isNew">
                  <a @click="saveRow(record.key)">添加</a>
                  <a-divider type="vertical" />
                  <a-popconfirm
                    title="是否要删除此行？"
                    @confirm="remove(record.key)"
                  >
                    <a>删除</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a @click="saveRow(record.key)">保存</a>
                  <a-divider type="vertical" />
                  <a @click="cancle(record.key)">取消</a>
                </span>
              </template>
              <span v-else>
                <a @click="toggle(record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="detail(record.key)">详情</a>
              </span> -->

            </template>
            <span
              slot="empName"
              slot-scope="text"
              :style="handleColumnStyle(130)"
            >
              <a-tooltip
                placement="topLeft"
                :title="text"
              >
                {{ text }}
              </a-tooltip>
            </span>
            <span
              slot="departName"
              slot-scope="text"
              :style="handleColumnStyle(130)"
            >
              <a-tooltip
                placement="topLeft"
                :title="text"
              >
                {{ text }}
              </a-tooltip>
            </span>
            <span
              slot="bankNo"
              slot-scope="text"
              :style="handleColumnStyle(60)"
            >
              <a-tooltip
                placement="topLeft"
                :title="text"
              >
                {{ text }}
              </a-tooltip>
            </span>
            <span
              slot="empIdcard"
              slot-scope="text"
              :style="handleColumnStyle(80)"
            >
              <a-tooltip
                placement="topLeft"
                :title="text"
              >
                {{ text }}
              </a-tooltip>
            </span>
          </a-table>

          <!-- <a-button
            style="width: 100%; margin-top: 16px; margin-bottom: 8px"
            type="dashed"
            icon="plus"
            @click="newMeber"
          >新增成员</a-button> -->
        </form>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      title="报表修改"
      :width="1100"
      placement="right"
      :closable="true"
      @cancel="handleEditCancel"
      @ok="handleEditOk"
      cancelText="关闭"
      okText="确定"
      :visible="editVisible"
      :maskClosable="false"
    >
      <a-form :form="form">
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="工资月份"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-month-picker
                placeholder="工资月份"
                v-decorator="['salaryDate',validatorRules.salaryDate]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              label="工资发放时间"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-radio-group
                @change="onChange"
                v-decorator="['salaryGiveTime',{'initialValue':'1',rules: [{ required: true, message: '请选择工资发放时间！' }]}]"
              >
                <a-radio value="1">暂停发</a-radio>
                <a-radio value="0">立即发</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>

        </a-row>
        <a-row>

          <a-col :span="12">
            <a-form-item
              label="开户行"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <!-- <a-select
                v-decorator="['bankName',validatorRules.bankName]"
                style="width: 191px"
              >
                <a-select-option
                  v-for="(item, index) in bankOptions"
                  :value="item.value"
                  :key="index"
                >{{ item.label }}</a-select-option>
              </a-select> -->
              <a-input
                placeholder="开户行"
                v-decorator="['bankName',validatorRules.bankName]"
                style="width:191px"
              ></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              label="银行卡号"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                placeholder="银行卡号"
                v-decorator="['bankNo',validatorRules.bankNo]"
                style="width:191px"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- <a-row>
          <a-col :span="12">
            <a-form-item
              label="是否扣除公积金"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-radio-group
                @change="onIsDeductFundChange"
                v-decorator="['isDeductFund',{'initialValue':'0',rules: [{ required: true, message: '请选择是否扣除公积金！' }]}]"
              >
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="是否扣除社保"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-radio-group
                @change="onDeduSocialMonthChange"
                v-decorator="['isDeductSocial',{'initialValue':'0',rules: [{ required: true, message: '请选择是否扣除社保！' }]}]"
              >
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="公积金扣缴月份"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-month-picker
                placeholder="公积金扣缴月份"
                v-decorator="['deduProvidentMonth', { rules: [{ required: isDeductFundFlag, message: '请选择社保扣缴月份！' }] }]"
                style="width: 191px"
                :disabled="fundMonSelectDisabled"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">

            <a-form-item
              label="社保扣缴月份"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-month-picker
                placeholder="社保扣缴月份"
                v-decorator="['deduSocialMonth', { rules: [{ required:isSocialMonSelectFlag, message: '请选择公积金扣缴月份！' }] }]"
                style="width: 191px"
                :disabled="socialMonSelectDisabled"
              />
            </a-form-item>
          </a-col>

        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="公积金优先级"
              placeholder="公积金优先级"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                v-decorator="['fundPriority', {'initialValue':'0',rules: [{ required: false, message: '请选择公积金优先级！' }]}]"
                style="width: 191px"
                :disabled="fundMonSelectDisabled"
              >
                <a-select-option value="0">生成</a-select-option>
                <a-select-option value="1">缴纳</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">

            <a-form-item
              label="社保优先级"
              placeholder="社保优先级"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                v-decorator="['socialPriority', {'initialValue':'0',rules: [{ required: false, message: '请选择社保优先级！' }]}]"
                style="width: 191px"
                :disabled="socialMonSelectDisabled"
              >
                <a-select-option value="0">生成</a-select-option>
                <a-select-option value="1">缴纳</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

        </a-row> -->
        <a-row>

        </a-row>
        <a-row>

        </a-row>

      </a-form>
    </a-modal>

    <a-modal
      title="报表详情"
      :width="800"
      placement="right"
      :closable="true"
      @cancel="handleDetailCancel"
      @ok="handleDetailOk"
      cancelText="关闭"
      :visible="detailVisible"
      :maskClosable="false"
    >
      <a-card :bordered="false">
        <detail-list title="">
          <detail-list-item
            v-for="(item, index) in saiList"
            :key="index"
            :term="item.cnName"
          >{{ item.salaryMoney }}
          </detail-list-item>
        </detail-list>
      </a-card>
    </a-modal>
  </a-modal>
</template>
<script>
  import DetailList from '@/components/tools/DetailList'
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from 'moment'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  const DetailListItem = DetailList.Item

  export default {
    name: 'SalaryEngineExportListModal',
    components: {
      DetailList,
      DetailListItem
    },
    data() {
      return {
        visible: false,
        editVisible: false,
        detailVisible: false,
        columns: [],
        form: this.$form.createForm(this),
        fundMonSelectDisabled:true,//公积金月份禁用
        socialMonSelectDisabled:true,//社保月份禁用
        model: {},
        dataSource: [],
        dateFormat: 'YYYY-MM',
        isDeductFundFlag:false,
        isSocialMonSelectFlag:false,
        pagination: {
          pageSize: 20
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        loading: true,
        confirmLoading: false,
        colMenu: [],
        bankOptions:[],
        url: '/salary/engineer/saveAndSubmit',
        key: '',
        validatorRules: {
          salaryDate: { rules: [{ required: true, message: '请填写姓名！' }] },
          bankNo: { rules: [{ required: true, message: '请填写银行卡号！！' },{max:25,message: '收款银行账号最多25位!' }] },
          bankName: { rules: [{ required: true, message: '请填写开户行！' }] },
          deduSocialMonth: { rules: [{ required: this.socialMonSelectDisabled, message: '请选择社保扣缴月份！' }] },
          deduProvidentMonth: { rules: [{ required: this.isSocialMonSelectFlag, message: '请选择公积金扣缴月份！' }] }
        },
        isFlag: { '0': '否', '1': '是' },
        salaryStyleOption: { '0': '现金', '1': '转账' },
        socialPriorityOption: { '0': '生成', '1': '缴纳' },
        fundPriorityOption: { '0': '生成', '1': '缴纳' },
        annualBonusTypeOption: { '0': '单独', '1': '合并' },
        salaryGiveTimeOption: { '0': '立即发', '1': '暂停发' },
        saiList: [],
        scroll:{}
      }
    },
    methods: {
      show(list) {
        this.visible = true
        this.initDictConfig()
        this.$nextTick(()=>{
          this.loadData(list)
        })
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleSubmit(e) {
        e.preventDefault()
      },
      newMeber() {
        this.dataSource.push({
          key: '99',
          name: '',
          workId: '',
          department: '',
          editable: true,
          isNew: true
        })
      },
      remove(key) {
        const newData = this.dataSource.filter(item => item.key !== key)
        this.dataSource = newData
      },
      saveRow(key) {
        let target = this.dataSource.filter(item => item.key === key)[0]
        for (var i = 0; i < this.dataSource[key].saiList.length; i++) {
          for (var sourceOne of target.saiList) {
            if (this.dataSource[key].saiList[i].javaFiedName == sourceOne.javaFiedName) {
              this.dataSource[key].saiList[i].salaryMoney = target[sourceOne.javaFiedName]
            }
          }
        }
        target.editable = false
        target.isNew = false
      },
      toggle(record) {
        this.editVisible = true
        this.key = record.key
        this.form.resetFields()
        this.model = Object.assign({}, record)
        //暂停发
        if(String(this.model.salaryGiveTime) === '1'){
          this.validatorRules.bankNo = {}
          this.validatorRules.bankName = {}
        }
        //立即发
        if(String(this.model.salaryGiveTime) === '0'){
          this.validatorRules.bankNo = { rules: [{ required: true, message: '请填写银行卡号！' },{max:25,message: '银行卡号不能超过25位！' }] }
          this.validatorRules.bankName = { rules: [{ required: true, message: '请填写开户行！' }] }
        }
        this.model.deduSocialMonth = this.model.deduSocialMonth ? moment(this.model.deduSocialMonth, this.dateFormat) : null
        this.model.deduProvidentMonth = this.model.deduProvidentMonth ? moment(this.model.deduProvidentMonth, this.dateFormat) : null
        this.model.salaryDate = this.model.salaryDate ? moment(this.model.salaryDate, this.dateFormat) : null
        this.model.isDeductFund= this.model.isDeductFund ? this.model.isDeductFund:'0'
        this.model.isDeductSocial= this.model.isDeductSocial ?this.model.isDeductSocial:'0'
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'salaryDate', 'bankNo', 'bankName', 'socialPriority',
            'fundPriority', 'isDeductSocial', 'isDeductFund', 'salaryGiveTime', 'deduSocialMonth', 'deduProvidentMonth'))
        })
      },
      getRowByKey(key, newData) {
        const data = this.dataSource
        return (newData || data).filter(item => item.key === key)[0]
      },
      cancle(key) {
        let target = this.dataSource.filter(item => item.key === key)[0]
        target.editable = false
      },
      handleChange(value, key, column) {
        const newData = [...this.dataSource]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          target[column] = value
          this.dataSource = newData
        }
      },
      //修改工资发放时间开户行做相应变化
      onChange(e){
        if(String(e.target.value) === '1'){
          this.validatorRules.bankNo = {}
          this.validatorRules.bankName = {}
        }
        if(String(e.target.value) === '0'){
          this.validatorRules.bankNo = { rules: [{ required: true, message: '请填写银行卡号！！' },{max:25,message: '银行卡号不能超过25位！' }] }
          this.validatorRules.bankName = { rules: [{ required: true, message: '请填写开户行！' }] }
        }
      },
      // 生成结算单
      handleOk() {
        this.confirmLoading = true
        // 剔除子列表的数据
        let data = this.dataSource
        for (const c in data) {
          delete data[c]['key']
          for (const d of data[c].saiList) {
            for (const m in data[c]) {
              if (String(d.javaFiedName) === String(m)) {
                delete data[c][m]
              }
            }
          }
        }
        // 生成结算单提交
        httpAction(this.url, data, 'POST').then((res) => {
          console.log(res)
          this.confirmLoading = false
          if (Number(res.code) === 200) {
            this.visible = false
            this.$emit('ok')
            this.$message.success('生成结算单成功')
          } else {
            this.visible = false
            this.$message.error(res.msg)
          }
        }).finally(()=>{
          this.confirmLoading = false
        })
      },
      loadData(list) {
        this.colMenu = []
        this.columns = [
          {
            title: '姓名',
            dataIndex: 'empName',
            width: 130,
            fixed: 'left',
            align: 'center',
            key: 'empName',
            scopedSlots: { customRender: 'empName' }
          },
          {
            title: '身份证号',
            width: 130,
            align: 'center',
            dataIndex: 'empIdcard',
            key: 'empIdcard',
            scopedSlots: { customRender: 'empIdcard' }
          },
          {
            title: '手机号码',
            width: 130,
            align: 'center',
            dataIndex: 'empPhone',
            key: 'empPhone',
            scopedSlots: { customRender: 'empPhone' }
          },
          {
            title: '银行卡号',
            width: 130,
            align: 'center',
            dataIndex: 'bankNo',
            key: 'bankNo',
            scopedSlots: { customRender: 'bankNo' }
          },
          {
            title: '开户行',
            width: 130,
            align: 'center',
            dataIndex: 'bankName',
            key: 'bankName',
            customRender: (text) => {
              let bankName = filterDictText(this.bankOptions, text)
              if(bankName == '-' && text){
                return text;
              }
              return bankName
            },
          },
          {
            title: '工资发放时间',
            width: 130,
            align: 'center',
            dataIndex: 'salaryGiveTime',
            key: 'salaryGiveTime',
            customRender: (text) => {
              return this.salaryGiveTimeOption[text]
            }
          },
          
          {
            title: '工资月份',
            width: 130,
            align: 'center',
            dataIndex: 'salaryDate',
            key: 'salaryDate'
          },
          {
            title: '结算月份',
            width: 130,
            align: 'center',
            dataIndex: 'settlementMonth',
            key: 'settlementMonth'
          },
          {
            title: '结算主体',
            width: 130,
            align: 'center',
            dataIndex: 'settleDepartName',
            key: 'settleDepartName',
            scopedSlots: { customRender: 'departName' }
          }
        ]
        if(list[0]['isDeductSocial'] == 1){
          this.columns.push(
            {
              title: '社保扣缴月份',
              width: 130,
              align: 'center',
              dataIndex: 'deduSocialMonth',
              key: 'deduSocialMonth'
            },
          )
          this.columns.push(
            {
              title: '社保优先级',
              width: 130,
              align: 'center',
              dataIndex: 'socialPriority',
              key: 'socialPriority',
              customRender: (text) => {
                return this.socialPriorityOption[text]
              }
            },
          )
          this.columns.push(
            {
              title: '是否扣除社保',
              width: 130,
              align: 'center',
              dataIndex: 'isDeductSocial',
              key: 'isDeductSocial',
              customRender: (text) => {
                if(!text){
                  return '否'
                }else{
                  return this.isFlag[text]
                }
              }
            },
          )
          this.scroll = {x : 1560}
        }else{
           this.scroll = {x : 1170}
        }
        this.columns.push({
          title: '操作',
          width: 130,
          align: 'center',
          key: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' }
        })
        for (var j = 0; j < list.length; j++) {
          list[j]['key'] = j
        }
        this.dataSource = list
        this.loading = false
      },
      handleEditCancel() {
        this.editVisible = false
      },
      handleEditOk() {
        this.form.validateFields((err, values) => {
          console.log(values)
          if (!err) {
            let key = this.key
            this.dataSource[key] = Object.assign(this.model, values)
            this.dataSource[key].deduSocialMonth = this.dataSource[key].deduSocialMonth ? this.dataSource[key].deduSocialMonth.format('YYYYMM') : null
            this.dataSource[key].deduProvidentMonth = this.dataSource[key].deduProvidentMonth ? this.dataSource[key].deduProvidentMonth.format('YYYYMM') : null
            this.dataSource[key].salaryDate = this.dataSource[key] ? this.dataSource[key].salaryDate.format('YYYYMM') : null
            this.editVisible = false
          }
        })
      },
      detail(key) {
        this.saiList = this.dataSource[key]['saiList']
        this.detailVisible = true
      },
      handleDetailOk() {
        this.detailVisible = false
      },
      handleDetailCancel() {
        this.detailVisible = false
      },
      onIsDeductFundChange(e){
        this.fundMonSelectDisabled = String(e.target.value)==='0'?true:false
        this.isDeductFundFlag = !this.fundMonSelectDisabled
        if(!this.isDeductFundFlag){
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({deduProvidentMonth:null}, 'deduProvidentMonth'))
          })
        }
      },
      onDeduSocialMonthChange(e){
        this.socialMonSelectDisabled = String(e.target.value)==='0'?true:false
        this.isSocialMonSelectFlag=!this.socialMonSelectDisabled
        if(!this.isSocialMonSelectFlag){
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({deduSocialMonth:null}, 'deduSocialMonth'))
          })
        }
      },
      // 隐藏列样式
      handleColumnStyle(width) {
        if (width) {
          return `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: ${width}px;`
        }
        return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
      },
      // 数据字典
      initDictConfig() {
        // 开户行
        initDictOptions('bank').then((res) => {
          if (Number(res.code) === 200) {
            this.bankOptions = res.data
          }
        })
      },
    }
  }
</script>
