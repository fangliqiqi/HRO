<template>
  <a-modal
    title="工资报表"
    :width="1500"
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
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="工资明细">
        <form :autoFormCreate="(form) => this.form = form">
          <a-table
            :columns="columns"
            :dataSource="dataSource"
            :pagination="pagination"
            :loading="loading"
            :scroll="{ x: 2300 }"
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
              <template v-if="record.editable">
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
              </span>
            </template>

            <span
              slot="departName"
              slot-scope="text"
              :style="handleColumnStyle(120)"
            >
              <a-tooltip
                placement="topLeft"
                :title="text"
              >
                {{ text }}
              </a-tooltip>
            </span>
          </a-table>
        </form>
      </a-tab-pane>
    </a-tabs>
    <a-modal
      title="报表修改"
      :width="1200"
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
          <a-col :span="12">
            <a-form-item
              label="开户行"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                placeholder="开户行"
                v-decorator="['bankName',validatorRules.bankName]"
                style="width:191px"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
        </a-row>
        <a-row>
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
          <a-col :span="12">
            <a-form-item
              label="是否扣除公积金"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-radio-group v-decorator="['isDeductFund',{'initialValue':'1',rules: [{ required: true, message: '请选择是否扣除公积金！' }]}]">
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
        </a-row>
        <a-row>
        </a-row>
        <a-row>
          <!-- <a-col :span="12">
            <a-form-item
              label="是否薪资扣税"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-radio-group v-decorator="['salaryTaxFlag',{'initialValue':'1',rules: [{ required: true, message: '请选择是否是否薪资扣税！' }]}]">
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col> -->
          <a-col :span="12">
            <a-form-item
              label="是否扣除社保"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-radio-group v-decorator="['isDeductSocial',{'initialValue':'1',rules: [{ required: true, message: '请选择是否扣除社保！' }]}]">
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 报表详情 -->
    <statement-detail-modal ref="statementDetailModal"></statement-detail-modal>
  </a-modal>
</template>
<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import StatementDetailModal from '../../salary/searchsalary/modules/StatementDetailModal'

export default {
  name: 'SalaryExportListModal',
  components: {
    StatementDetailModal
  },
  data() {
    return {
      visible:false,
      editVisible:false,
      columns:[],
      form:this.$form.createForm(this),
      model:{},
      dataSource:[],
      bankOptions:[],
      dateFormat:"YYYY-MM",
      pagination:{
        pageSize: 20,
      },
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 17},
      },
      loading:true,
      confirmLoading:false,
      colMenu:[],
      url:'/salary/salary/saveAndSubmit',
      key:'',
      validatorRules: {
        salaryDate: { rules: [{ required: true, message: '请填写姓名！' }] },
        bankNo: { rules: [{ required: true, message: '请填写银行卡号！' },{max:25,message: '银行卡号不能超过25位！' }] },
        bankName: { rules: [{ required: true, message: '请填写开户行！' }] },
        deduSocialMonth: { rules: [{ required: true, message: '请选择社保扣缴月份！' }] },
        deduProvidentMonth: { rules: [{ required: true, message: '请选择公积金扣缴月份！' }] },
      },
      isFlag:{'0':'否','1':'是'},
      salaryStyleOption:{'0':'现金','1':'转账'},
      socialPriorityOption:{'0':'生成','1':'缴纳'},
      fundPriorityOption:{'0':'生成','1':'缴纳'},
      annualBonusTypeOption:{'0':'合并','1':'单独','2':'自动计算'},
      salaryGiveTimeOption:{'0':'立即发','1':'暂停发'},
      saiList:[]
    }
  },
  methods: {
    show(list) {
      this.visible = true
      this.initDictConfig()
      this.$nextTick(()=>{
        this.loadData(list)
      })
      this.confirmLoading = false
      this.loading = false
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.confirmLoading = false
      this.loading = false
      this.$emit('close')
      this.visible = false
    },
    handleSubmit (e) {
      e.preventDefault()
    },
    newMeber () {
      this.dataSource.push({
        key: '99',
        name: '',
        workId: '',
        department: '',
        editable: true,
        isNew: true
      })
    },
    remove (key) {
      const newData = this.dataSource.filter(item => item.key !== key)
      this.dataSource = newData
    },
    saveRow (key) {
      let target = this.dataSource.filter(item => item.key === key)[0]
      for(var i = 0; i < this.dataSource[key].saiList.length; i++){
        for(var sourceOne of target.saiList){
          if(this.dataSource[key].saiList[i].javaFiedName == sourceOne.javaFiedName){
            this.dataSource[key].saiList[i].salaryMoney = target[sourceOne.javaFiedName]
          }
        }
      }
      target.editable = false
      target.isNew = false
    },
    toggle (record) {
      this.key = record.key
      this.form.resetFields()
      this.model = Object.assign({}, record)
      if(this.model.salaryGiveTime == 1){
        this.validatorRules.bankNo = {}
        this.validatorRules.bankName = {}
      }
      if(this.model.salaryGiveTime == 0){
        this.validatorRules.bankNo = { rules: [{ required: true, message: '请填写银行卡号！！' },{max:25,message: '银行卡号不能超过25位！' }] }
        this.validatorRules.bankName = { rules: [{ required: true, message: '请填写开户行！' }] }
      }
      this.editVisible = true
      this.model.deduSocialMonth = this.model.deduSocialMonth ? moment(this.model.deduSocialMonth, this.dateFormat) : null
      this.model.deduProvidentMonth = this.model.deduProvidentMonth ? moment(this.model.deduProvidentMonth, this.dateFormat) : null
      this.model.salaryDate = this.model.salaryDate ? moment(this.model.salaryDate, this.dateFormat) : null
      this.model.isDeductFund = this.model.isDeductFund ? this.model.isDeductFund : '1'
      this.model.isDeductSocial = this.model.isDeductSocial ? this.model.isDeductSocial : '1'
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'bankNo', 'bankName', 'salaryGiveTime', 'isDeductFund','salaryTaxFlag','isDeductSocial'))
      })
    },
    getRowByKey (key, newData) {
      const data = this.dataSource
      return (newData || data).filter(item => item.key === key)[0]
    },
    cancle (key) {
      let target = this.dataSource.filter(item => item.key === key)[0]
      target.editable = false
    },
    handleChange (value, key, column) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.dataSource = newData
      }
    },
    //修改工资发放时间开户行做相应变化
    onChange(e){
      if(e.target.value == 1){
        this.validatorRules.bankNo = {}
        this.validatorRules.bankName = {}
      }
      if(e.target.value == 0){
        this.validatorRules.bankNo = { rules: [{ required: true, message: '请填写银行卡号！' },{max:25,message: '银行卡号不能超过25位！' }] }
        this.validatorRules.bankName = { rules: [{ required: true, message: '请填写开户行！' }] }
      }
    },
    // 生成结算单
    handleOk(){
      this.confirmLoading = true
      // 剔除子列表的数据
      let data = this.dataSource
      for(var c in data){
        delete data[c]['key']
        for(var d of data[c].saiList){
          for(var m in data[c]){
            if(d.javaFiedName == m){
              delete data[c][m]
            }
          }
        }
      }
      // 生成结算单提交
      httpAction(this.url,data,'POST', 10000 * 6 * 5).then((res) => {
        this.confirmLoading = false
        if(Number(res.code) === 200){
          this.visible = false
          this.$emit('ok')
          this.$message.success("生成结算单成功")
        }else if(Number(res.code) === 2){
          this.visible = false
          const htm = res.data.replace(/\|\|/g,'<br/>')
          this.$warning({
            title: res.msg,
            width:'520px',
            content: (
              <p ref='error' style="line-height:25px;"></p>
            ),
          });
          this.$nextTick(()=>{
            this.$refs.error.innerHTML = htm
          })
        }else{
          this.visible = false
          this.$message.error(res.msg)
        }
      })
    },
    loadData(list) {
      //this.listData = list
      this.colMenu = []
      this.columns = [
        {
          title: '姓名',
          width: 120,
          fixed: 'left',
          align: 'center',
          dataIndex: 'empName',
          key: 'empName',
        },
        {
          title: '工资发放方式',
          width: 120,
          fixed: 'left',
          align: 'center',
          dataIndex: 'salaryStyle',
          key: 'salaryStyle',
          customRender:(text) => {
            return this.salaryStyleOption[text]
          }
        },
        {
          title: '身份证号',
          width: 120,
          align: 'center',
          dataIndex: 'empIdcard',
          key: 'empIdcard',
        },
        {
          title: '手机号码',
          width: 120,
          align: 'center',
          dataIndex: 'empPhone',
          key: 'empPhone',
        },
        {
          title: '银行卡号',
          width: 120,
          align: 'center',
          dataIndex: 'bankNo',
          key: 'bankNo',
        },
        {
          title: '开户行',
          width: 120,
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
          width: 120,
          align: 'center',
          dataIndex: 'salaryGiveTime',
          key: 'salaryGiveTime',
          customRender:(text) => {
            return this.salaryGiveTimeOption[text]
          }
        },
        {
          title: '社保扣缴月份',
          width: 120,
          align: 'center',
          dataIndex:'deduSocialMonth',
          key:'deduSocialMonth'
        },
        {
          title: '公积金扣缴月份',
          width: 120,
          align: 'center',
          dataIndex:'deduProvidentMonth',
          key:'deduProvidentMonth'
        },
        {
          title: '是否薪资扣税',
          width: 120,
          align: 'center',
          dataIndex:'salaryTaxFlag',
          key:'salaryTaxFlag',
          customRender:(text) => {
            return this.isFlag[text]
          }
        },
        {
          title: '社保优先级',
          width: 120,
          align: 'center',
          dataIndex:'socialPriority',
          key:'socialPriority',
          customRender:(text) => {
            return this.socialPriorityOption[text]
          }
        },
        {
          title: '公积金优先级',
          width: 120,
          align: 'center',
          dataIndex:'fundPriority',
          key:'fundPriority',
          customRender:(text) => {
            return this.fundPriorityOption[text]
          }
        },
        {
          title: '年终奖扣税方案',
          width: 120,
          align: 'center',
          dataIndex:'annualBonusType',
          key:'annualBonusType',
          customRender:(text) => {
            return this.annualBonusTypeOption[text]
          }
        },
        {
          title: '是否扣除社保',
          width: 120,
          align: 'center',
          dataIndex:'isDeductSocial',
          key:'isDeductSocial',
          customRender:(text) => {
            if(!text){
              return '是'
            }else{
              return this.isFlag[text]
            }
          }
        },
        {
          title: '是否扣除公积金',
          width: 120,
          align: 'center',
          dataIndex:'isDeductFund',
          key:'isDeductFund',
          customRender:(text) => {
            if(!text){
              return '是'
            }else{
              return this.isFlag[text]
            }
          }
        },
        {
          title: '工资月份',
          width: 120,
          align: 'center',
          dataIndex: 'salaryDate',
          key: 'salaryDate',
        },
        {
          title: '结算月份',
          width: 120,
          align: 'center',
          dataIndex: 'settlementMonth',
          key: 'settlementMonth',
        },
        {
          title: '结算主体',
          width: 120,
          align: 'center',
          dataIndex: 'settleDepartName',
          key: 'settleDepartName',
          scopedSlots: { customRender: 'departName' }
        },
      ]
      this.columns.push({
        title: '操作',
        width: 120,
        align: 'center',
        key: 'action',
        fixed: 'right',
        scopedSlots: { customRender: 'operation' }
      })
      for(var j = 0; j < list.length; j++){
        list[j]['key'] = j
      }
      this.dataSource = list
      this.loading = false
    },
    handleEditCancel(){
      this.editVisible = false
    },
    handleEditOk(){
      this.form.validateFields((err, values) => {
        if(!err){
          console.log(values)
          let key = this.key
          this.dataSource[key] = Object.assign(this.model, values)
          this.dataSource[key].deduSocialMonth = this.dataSource[key].deduSocialMonth ? this.dataSource[key].deduSocialMonth.format("YYYYMM") : null
          this.dataSource[key].deduProvidentMonth = this.dataSource[key].deduProvidentMonth ? this.dataSource[key].deduProvidentMonth.format("YYYYMM") : null
          this.dataSource[key].salaryDate = this.dataSource[key].salaryDate ? this.dataSource[key].salaryDate.format("YYYYMM") : null
          this.editVisible = false
        }
      })
    },
    detail(key){
      const salaryList = this.dataSource[key]['saiList'] || []
      this.$refs.statementDetailModal.title = '报表详情'
      this.$refs.statementDetailModal.saiList = salaryList
      this.$refs.statementDetailModal.show()
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
