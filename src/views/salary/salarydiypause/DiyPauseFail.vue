<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="员工姓名">
              <a-input
                allowClear
                v-model="queryParam.name"
                placeholder="员工姓名"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="身份证号">
              <a-input
                allowClear
                v-model="queryParam.idCard"
                placeholder="身份证号"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <a-select
                v-model="queryParam.settleDepartName"
                showSearch
                placeholder="选择结算主体"
                allowClear
                optionFilterProp="children"
              >
                <a-select-option
                  v-for="(item, index) in settlementList"
                  :key="index"
                  :value="item.departName"
                >{{ item.departName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <span
              style="float: left;overflow: hidden;"
              class="table-page-search-submitButtons"
            >
              <a-button
                type="primary"
                @click="searchQuery"
                icon="search"
              >查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div style="margin-bottom:10px">
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-button
          type="primary"
          icon="plus"
          @click="handleBatchBilling"
          v-has="'wxhr:tpausesalary_doIssueAllByBatch'"
        >批量发放</a-button>
      </a-dropdown>
    </div>
    <!-- 列表 -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span
          slot="salaryStatus"
          slot-scope="text, record"
        >
          <template v-for="(salaryStatus, key) in salaryStatusOptions">
            <a-tag
              :key="key"
              v-if="record.status == key"
              :color="salaryStatus.color"
            >{{ salaryStatus.option }}</a-tag>
          </template>
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleGrant(record)"
            v-have="'wxhr:tpausesalary_edit'"
          >发放方式</a>
          <a-divider type="vertical" />
          <a
            @click="handleConGrant(record)"
            v-have="'wxhr:tpausesalary_doIssue'"
          >发放</a>
          <a-divider type="vertical" />
          <a
            @click="handleSplit(record)"
            v-have="'wxhr:tpausesalary_doIssue'"
          >拆分发放</a>
          <a-divider type="vertical" />
          <a @click="handleRecord(record)">发放记录</a>
          <a-divider type="vertical" />
          <a @click="handleDetail(record)">工资表</a>
        </span>

      </a-table>
    </div>

    <!-- 发放方式弹框 -->
    <a-modal
      title="发放方式"
      :width="700"
      placement="right"
      :closable="true"
      @cancel="handleGrantCancel"
      @ok="handleGrantOk"
      cancelText="取消"
      okText="确定"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :maskClosable="false"
    >
      <a-spin :spinning="spinning">
        <a-form :form="form">
          <a-form-item
            label="发放方式"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-radio-group
              v-decorator="['salaryStyle', {initialValue:'1'} ]"
              buttonStyle="solid"
              @change="changeRadio"
            >
              <a-radio-button :value="1">银行</a-radio-button>
              <a-radio-button
                :value="0"
                style="margin-left:10px"
              >现金</a-radio-button>
              <a-radio-button
                :value="2"
                style="margin-left:10px"
              >线下</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="grantType == 1"
            label="银行账户"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="['bankNo', validatorRules.bankNo ]" />
          </a-form-item>
          <a-form-item
            v-if="grantType == 1"
            label="开户行"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <!-- <a-select
              placeholder="请选择"
              v-decorator="['bankName', validatorRules.bankName ]"
            >
              <a-select-option
                v-for="(item,index) in bankOptions"
                :value="item.value"
                :key="index"
              >{{ item.label }}</a-select-option>
            </a-select> -->
            <a-input v-decorator="['bankName', validatorRules.bankName ]" />
          </a-form-item>
          <a-form-item
            v-if="isDiy"
            label="收款单位"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="['organNameOne', validatorRules.organNameOne ]" />
          </a-form-item>
          <a-card
            v-if="isDiy"
            title="添加自定义封面"
            :bordered="true"
          >
            <a-form-item
              label="封面抬头"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['titleTwo', validatorRules.titleTwo ]" />
            </a-form-item>
            <a-form-item
              label="收款单位"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['organNameTwo', validatorRules.organNameTwo ]" />
            </a-form-item>
            <a-form-item
              label="银行账号"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['bankNoTwo', validatorRules.bankNoTwo ]" />
            </a-form-item>
            <a-form-item
              label="开户行"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['bankNameTwo', validatorRules.bankNameTwo ]" />
            </a-form-item>
            <a-form-item
              label="备注"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-textarea
                v-decorator="['remarkTwo' ]"
                :autoSize="{minRows:2,maxRows:6}"
                style="resize:none"
              />
            </a-form-item>
          </a-card>
          <a-button
            v-if="!isDiy"
            type="primary"
            style="margin-top: 16px"
            @click="handleClick"
          >添加自定义封面</a-button>
          <a-button
            v-if="isDiy"
            type="primary"
            style="margin-top: 16px"
            @click="handleCancleClick"
          >关闭自定义封面</a-button>
        </a-form>
      </a-spin>
    </a-modal>

    <!-- 是否发放弹框 -->
    <a-modal
      title="发放工资"
      :width="600"
      :visible="confirmVisible"
      @ok="handleConOk"
      @cancel="handleConCancel"
      cancelText="取消"
      okText="确定"
      :maskClosable="false"
      :confirmLoading="conLoading"
    >
      <p>确定全额发放工资吗？</p>
    </a-modal>

    <!-- 拆分发放 -->
    <a-modal
      title="拆分发放"
      :visible="spiltVisible"
      @ok="handleSplitOk"
      @cancel="handleSplitCancel"
      cancelText="取消"
      okText="确定"
      :maskClosable="false"
      :confirmLoading="splitLoading"
    >
      <a-spin :spinning="splitSpinning">
        <a-form :form="splitForm">
          <a-form-item
            label="余额"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <span>{{ grantOne.balance }}</span>
          </a-form-item>
        </a-form>
        <a-form :form="splitForm">
          <a-form-item
            label="发放金额"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="['issueMoney', validatorSplitRules.balanceSpilit ]" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <a-modal
      title="批量发放"
      :width="700"
      placement="right"
      :closable="true"
      @cancel="handleBatchCancel"
      @ok="handleBatchOk"
      cancelText="取消"
      okText="确定"
      :visible="batchVisible"
      :confirmLoading="confirmBatchLoading"
      :maskClosable="false"
    >
      <a-spin :spinning="batchSpinning">
        <a-form :form="batchform">
          <a-form-item
            label="银行账户"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="['bankNo',{}]" />
          </a-form-item>
          <a-form-item
            label="开户行"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="['bankName',{}]" />
          </a-form-item>
          <a-form-item
            label="收款单位"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="['organName',{}]" />
          </a-form-item>
          <a-form-item
            label="记录名称"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="['chargeName', validatorRules.chargeName ]" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    
  </a-card>
</template>
<script>
import pick from 'lodash.pick'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getSettlementAuthorityByUser } from '@/api/api'
import {mapGetters} from 'vuex'
import { httpAction } from '@/api/manage'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import SelectPage from '@/components/jeecg/SelectPage'

export default {
  name: 'DiyPauseFail', //自定义发失败标记
  mixins: [JeecgListMixin],
  components:{
    
    SelectPage
  },
  data(){
    return{
      visible:false,
      spinning:false,
      confirmVisible:false,
      spiltVisible:false,
      splitSpinning:false,
      confirmLoading:false,
      splitLoading:false,
      conLoading:false,
      confirmBatchLoading:false,
      batchSpinning:false,
      batchVisible:false,
      isDiy:false,
      bankOptions:[],
      form:this.$form.createForm(this),
      splitForm:this.$form.createForm(this),
      batchform:this.$form.createForm(this),
      columns:[
        {
          title: '工资表状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'salaryStatus' },
        },
        {
          title: '员工姓名',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'idCard',
        },
        {
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleDepartName',
        },
        {
          title: '工资日期',
          align: 'center',
          dataIndex: 'salaryDate',
        },
        // {
        //   title: '拆分发金额',
        //   align: 'center',
        //   dataIndex: 'balanceSpilit',
        // },
        {
          title: '余额',
          align: 'center',
          dataIndex: 'balance',
          customRender: (text) => {
            return text ? text.toLocaleString() : 0
          }
        },
        {
          title: '创建日期',
          align: 'center',
          dataIndex: 'createDate',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '350px',
          scopedSlots: { customRender: 'action' },
        }
      ],
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      url:{
        list: '/salary/tchargerecord/getPauseDiyTagPage',
        editPause: '/salary/tpausesalary',
        doIssueAll: '/salary/tpausesalary/doIssueAll',
        doIssueSplit: '/salary/tpausesalary/doIssueSplit',
        doIssueAllByBatch:'/salary/tpausesalary/doIssueAllByBatch'
      },
      grantType:1,
      grantOne:{},
      settlementList: [],
      validatorRules: {
        bankName: { rules: [{ required: true, message: '请输入开户行!' }] },
        bankNameTwo: { rules: [{ required: true, message: '请输入封面开户行!' }] },
        chargeName: { rules: [{ required: true, message: '请输入记录名称!' }] },
        bankNo : { rules: [{ required: true, message: '请输入银行账户!' }] },
        bankNoTwo : { rules: [{ required: true, message: '请输入封面银行账户!' }] },
        organNameOne: { rules: [{ required: true, message: '请输入收款单位!' }] },
        organNameTwo: { rules: [{ required: true, message: '请输入封面收款单位!' }] },
        titleTwo: { rules: [{ required: true, message: '请输入封面抬头!' }] },
      },
      validatorSplitRules: {
        balanceSpilit: { rules: [{ required: true, message: '请输入金额!' },{validator:this.isNumber}] },
      },
      model:{},
      ids:'',
      salaryStatusOptions:{
        '0':{'option': '待提交', 'color': 'green'},
        '1':{'option': '待审核', 'color': 'red'},
        '3':{'option': '待发放', 'color': 'blue'},
        '4':{'option': '已发放', 'color': 'orange'},
        '5':{'option':'审核不通过', 'color': 'yellow'},
        '6':{'option':'确认不通过', 'color': 'purple'},
        '7':{'option':'财务退回', 'color': 'black'},
        '8':{'option':'结算单调整待审核', 'color': 'pink'},
        '9':{'option':'结算单调整待打印', 'color': 'deepskyblue'}
      },
    }
  },
  created() {
    this.initDictConfig()
    this.loadSettlementList()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    handleGrant(record){
      this.visible = true
      this.form.resetFields()
      this.grantOne = record
      record.organNameOne ? this.isDiy = true : this.isDiy = false
      this.grantType = record.salaryStyle
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(record,'bankNo','bankName','salaryStyle','organNameOne','organNameTwo','titleTwo',
        'bankNoTwo','bankNameTwo','remarkTwo'))
      })
    },
    handleGrantCancel(){
      this.visible = false
    },
    // 修改发放方式
    handleGrantOk(){
      this.form.validateFields((err,values) => {
        if(!err){
          this.confirmLoading = true
          this.spinning = true
          let formData = Object.assign({}, values)
          formData.id = this.grantOne.id
          httpAction(this.url.editPause,formData,'PUT').then((res) => {
            if(res.code == 200){
              this.loadData()
              this.confirmLoading = false
              this.spinning = false
              this.$message.success("修改成功")
              this.visible = false
            }else{
              this.confirmLoading = false
              this.spinning = false
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    changeRadio(e){
      this.grantType = e.target.value
    },
    // 确定发放弹框取消
    handleConCancel(){
      this.confirmVisible = false
    },
    // 确定发放弹框提示
    handleConGrant(record){
      this.grantOne = record
      this.confirmVisible = true
    },
    // 确定发放表单提交
    handleConOk(){
      let isSend = true
      // if(!this.grantOne.salaryStyle){
      //   isSend = false
      //   this.$message.error("当前发放方式为空")
      // }else{
        
      // }
      if(this.grantOne.salaryStyle == 1){
        if(this.grantOne.bankName == '' || this.grantOne.bankNo == ''){
          isSend = false
          this.$message.error("没有开户行!不能发放")
        }
      }
      if(isSend){
        this.conLoading = true
        const formData = new FormData()
        formData.append('id', this.grantOne.id)
        formData.append('engineerType', 1)
        httpAction(this.url.doIssueAll,formData,'POST').then((res) => {
          if(res.code == 200){
            this.$message.success("成功")
            this.confirmVisible = false
            this.loadData()
          }else{
            this.$message.error(res.msg)
          }
        }).finally(()=>{
          setTimeout(() => {
            this.conLoading = false
          }, 2000);
        })
      }
      
    },
    // 拆分发放弹框
    handleSplit(record){
      this.grantOne = record
      this.spiltVisible = true
      this.splitForm.resetFields()
    },
    // 拆分弹框取消
    handleSplitCancel(){
      this.spiltVisible = false
    },
    // 拆分发放提交
    handleSplitOk(){
      this.splitForm.validateFields((err,values) => {
        if(!err){
          this.splitLoading = true
          const formData = new FormData()
          formData.append('issueMoney', values.issueMoney)
          formData.append('id', this.grantOne.id)
          formData.append('engineerType', 1)
          httpAction(this.url.doIssueSplit,formData,'POST').then((res) => {
            
            if(res.code == 200){
              this.spiltVisible = false
              this.$message.success("提交成功")
              this.loadData()
            }else{
              this.$message.error(res.msg)
            }
          }).finally(()=>{
            setTimeout(() => {
              this.splitLoading = false
            }, 2000);
          })
        }
      })
    },
    //批量发放弹框
    handleBatchBilling(){
      let ids = '';
      if (this.selectedRowKeys.length <= 1) {
        this.$message.warning('请选择多条记录！')
        return
      } else {
        for (let a = 0; a < this.selectedRowKeys.length; a++) {
          if (a == this.selectedRowKeys.length - 1) {
            ids += this.selectedRowKeys[a]
          } else {
            ids += this.selectedRowKeys[a] + ','
          }
        }
      }
      if(ids){
        this.batchform.resetFields()
        this.batchVisible = true
        this.ids = ids
      }
    },
    handleBatchCancel(){
      this.batchVisible = false
    },
    //批量发放
    handleBatchOk(){
      this.batchform.validateFields((err,values) => {
        if(!err){
          this.batchSpinning = true
          this.confirmBatchLoading = true
          let formData = Object.assign({},values)
          formData.idStr = this.ids
          formData.bankName = formData.bankName ? formData.bankName : ''
          formData.bankNo = formData.bankNo ? formData.bankNo : ''
          formData.chargeName = formData.chargeName ? formData.chargeName : ''
          formData.organName = formData.organName ? formData.organName : ''
          let url = this.url.doIssueAllByBatch + '?bankName=' + formData.bankName + '&bankNo=' + formData.bankNo +
          '&chargeName=' + formData.chargeName + '&organName=' + formData.organName + '&idStr=' + this.ids
          httpAction(url,formData,'POST').then((res) => {
            this.batchSpinning = false
            this.confirmBatchLoading = false
            if(res.code == 200){
              this.$message.success("批量发放成功")
              this.batchVisible = false
              this.loadData()
            }else{
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    // 发放记录
    handleRecord(record){
      this.$refs.pauseModal.show(record)
    },
    // 工资表详情
    handleDetail(record){
      this.$refs.salaryDetailModal.show(record)
      this.$refs.salaryDetailModal.title = '工资表'
    },
    //显示添加自定义封面
    handleClick(){
      this.isDiy = true
      
    },
    handleCancleClick(){
      this.isDiy = false
      
    },
    // 获取结算列表
    loadSettlementList() {
      getSettlementAuthorityByUser({}).then((res) => {
          this.settlementList = res.data
        })
    },
    // 验证银行卡号
    isBankNo(rule,value,callback){
      if( value !== '' && value.length>25){
        callback(new Error('银行卡号不能超过25位！！'))
      }else{
        callback()
      }
    },
    // 验证数字
    isNumber(rule,value,callback){
      const reg = /^[0-9]+(.[0-9]{1,2})?$/
      if(!reg.test(value) && value != ''){
        callback(new Error('请输入正确的金额'))
      }else{
        callback()
      }
    },
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then((res) => {
        if (res.code === 200) {
          this.bankOptions = res.data
        }
      })
    },
  }
  
}
</script>
