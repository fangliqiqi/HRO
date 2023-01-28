<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <a-input
                v-model="queryParam.departName"
                placeholder="请输入算主体"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体编码">
              <a-input
                placeholder="请输入结算主体编码"
                v-model="queryParam.departNo"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算月份">
              <a-month-picker
                v-model="queryParam.settlementMonth"
                style="width: 100%"
                placeholder="请选择结算月份"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="上传人">
                <select-page
                  :searchUrl="'admin/user/page/wxhr?nickname='"
                  :title="'nickname'"
                  placeholder="请选择上传人"
                  :id="'userId'"
                  v-model="queryParam.createUser"
                  style="width:100%"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="选省市区">
                <a-select
                  placeholder="省"
                  style="width: 32%"
                  @change="handleIdProvinceChange"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.province"
                >
                  <a-select-option
                    v-for="(item, index) in idAreaTrees"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
                <a-select
                  placeholder="市"
                  style="margin-left: 2%; width: 32%"
                  @change="handleIdCityChange"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.city"
                >
                  <a-select-option
                    v-for="(item, index) in idAreaCitys"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
                <a-select
                  placeholder="区县"
                  style="margin-left: 2%; width: 32%"
                  v-model="queryParam.town"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  <a-select-option
                    v-for="(item, index) in idAreaTowns"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算金额">
                <a-input
                  placeholder="请输入结算金额"
                  @change="changeMoney"
                  v-model="queryParam.settlementAmount"
                />
              </a-form-item>
            </a-col>
          </template>
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
              <a
                @click="handleToggleSearch"
                style="margin-left: 8px"
              >
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div
      class="table-operator"
      style="margin-bottom:10px"
    >
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1">
            <a-icon type="delete" />删除</a-menu-item>
          <!-- lock | unlock -->
          <a-menu-item key="2">
            <a-icon type="lock" />锁定</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{x: 1}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            type="primary"
            v-has="'wxhr:tsalarystandard_goBack'"
            @click="handleBack(record)"
          >撤销</a>
        </span>
        <!-- 到账状态 -->
        <span
          slot="salaryStatus"
          slot-scope="text, record"
        >
          <template v-if="record.moneyFrom == 1">
            <a-tag
              v-if="record.advanceMoney == 0"
              color="pink"
            >垫付未申请</a-tag>
            <a-tag
              v-else-if="record.advanceMoney != 0 && record.advanceMoney < record.settlementAmount"
              color="orange"
            >差额垫付</a-tag>
            <a-tag
              v-else-if="record.advanceMoney != 0 && record.advanceMoney >= record.settlementAmount"
              color="cyan"
            >全额垫付</a-tag>
            <a-tag
              v-else
              color="blue"
            >垫付</a-tag>
          </template>
          <template v-else>
            <template v-if="record.matchSort == 1">
              <a-tag
                v-if="(record.balance * 1 + 10) < record.settlementAmount"
                color="black"
              >余额不足</a-tag>
              <a-tag
                v-else
                color="green"
              >已到账</a-tag>
            </template>
            <template v-else>
              -
            </template>
          </template>
        </span>
        <span
          slot="matchBalance"
          slot-scope="text"
        >
          <template>
            <a-tag
              v-if="text < 0"
              color="red"
            >
              {{ text }}
            </a-tag>
            <a-tag
              v-if="text >= 0"
              color="green"
            >
              {{ text }}
            </a-tag>
          </template>
        </span>
      </a-table>
    </div>

    <!-- 表单区域 -->
    <!-- 退回 -->
    <a-modal
      title="退回理由"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleBackCancel"
      @ok="handleBackOk"
      cancelText="关闭"
      :visible="backVisible"
      :maskClosable="false"
    >
      <a-form :form="backform">
        <a-form-item
          label="理由"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea placeholder="请输入理由" v-decorator="['remark',validatorRules.remark]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 表单区域 -->
    <audit-info-modal
      ref="modalCheck"
      :formTypeOptions="formTypeOptions"
      @ok="modalFormOk"
    ></audit-info-modal>
  </a-card>
</template>

<script>
  import Vue from 'vue'
  import moment from "moment"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction,httpAction } from '@/api/manage'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import { getSettlementAuthorityByUser } from '@/api/api'
  import AuditInfoModal from '../auditinfo/modules/AuditInfoModal'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: "SalaryBillingRecallList",
    mixins: [JeecgListMixin],
    components: {
      AuditInfoModal,
      SelectPage
    },
    data () {
      return {
        visibleCreateModal:false,
        backVisible:false,
        formTypeOptions:[],
        salaryStatusOptions:{
          '0':{'option': '已到账', 'color': 'green'},
          '1':{'option': '垫付', 'color': 'red'},
          '2':{'option': '客户到款', 'color': 'pink'},
          '3':{'option': '未匹配', 'color': 'blue'},
          '4':{'option': '余额不足', 'color': 'orange'},
          '5':{'option':'垫付未申请', 'color': 'yellow'},
          '6':{'option':'全额垫付', 'color': 'purple'},
          '7':{'option':'差额垫付', 'color': 'black'},
        },
        settlementhFormInfo:{},
        backform:this.$form.createForm(this),
        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        form: null,
        mdl: {},

        // 高级搜索 展开/关闭
        advanced: true,
        // 查询参数
        queryParam: {
          town:'',
          settlementAmount:''
        },
        //结算主体所有数据
        settleList:[],
        //公司所有数据
        orgList:[],
        // 表头
        columns: [
          {
            width: 140,
            ellipsis: true,
            title: '到账情况',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'salaryStatus' },
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'departName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '结算主体编码',
            align: 'center',
            dataIndex: 'departNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '省市区',
            align:'center',
            dataIndex: 'province',
            customRender:(text,record) => {
              let area = '-'
              if(text){
                for(const c of this.idAreaTrees) {
                  if(String(c.id) === String(text)){
                    area = c.areaName
                    for(const m of c.children){
                      if(String(m.id) === String(record.city)){
                        area = `${area}-${m.areaName}`
                        for(const n of m.children){
                          if(String(n.id) === String(record.town)){
                            area = `${area}-${n.areaName}`
                            break
                          }
                        }
                        break
                      }
                    }
                    break
                  }
                }
              }
              return area
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '垫付金额',
            align: 'center',
            dataIndex: 'advanceMoney',
            customRender: text => {
              const resultText = text || (parseFloat(text) === 0?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '结算金额',
            align: 'center',
            dataIndex: 'settlementAmount',
            customRender: text => {
              const resultText = text || (parseFloat(text) === 0?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          // {
          //   width: 150,
          //   ellipsis: true,
          //   title: '差额对比',
          //   align: 'center',
          //   dataIndex: 'difference',
          //   scopedSlots: { customRender: 'matchBalance' },
          // },
          // {
          //   width: 150,
          //   ellipsis: true,
          //   title: '客户余额',
          //   align: 'center',
          //   dataIndex: 'balance',
          //   customRender: text => {
          //     const resultText = text || (parseFloat(text) === 0?'0':'-')
          //     return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          //   }
          // },
          {
            width: 140,
            ellipsis: true,
            title: '结算月份',
            align: 'center',
            dataIndex: 'settlementMonth',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '工资月份',
            align: 'center',
            dataIndex: 'salaryMonth',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '上传人',
            align: 'center',
            dataIndex: 'createUser',
            customRender:(text) => {
              for(const c in this.employData){
                if(String(c) === String(text)){
                  return this.employData[c]
                }
              }
              return '-'
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '报表类型',
            align: 'center',
            dataIndex: 'formType',
            customRender:(text) => {
              return filterDictText(this.formTypeOptions, text) || '-'
            }
          },
          {
            width: 120,
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          }
        ],
        validatorRules: {
          remark: { rules: [{ required: true, message: '请填写理由!' }] },
        },
        selectedRowKeys: [],
        selectedRows: [],
        idAreaTrees:[],
        idAreaCitys:[],
        idAreaTowns: [],
        employData: [],
        settlementList:[],
        url: {
          list: '/salary/tsalarystandard/gobackSalaryStandardPage?type=0',
          settleList:'/hrBase/tsettledomain/getSettleDomainBalance',
          getOrgForCus:'/admin/organizationinfo/getOrgForCus',
          userUrl:'/admin/user/userDic',
          backUrl:'/salary/tsalarystandard/goBack',
          openBill:'/salary/salary/openBill',
        },
        idCity:'',
        balanceVar: [],
        salaryStandardInfo:{}
      }
    },
    created () {
      this.getSettleList()
      this.getOrgForCusAll()
      this.loadSettlementList()
      this.idAreaTrees = Vue.ls.get('glob_area')
      httpAction(this.url.userUrl,'','GET').then((res) => {
        if(Number(res.code) === 200){
          this.employData = res.data
        }
      })
    },
    methods: {
      getSettleList(){
        this.settleList = []
      },
      getOrgForCusAll(){
        getAction(this.url.getOrgForCus).then((res) => {
          if(Number(res.code) === 200){
            this.orgList = res.data
          }
        })
      },
      // 获取结算主体列表
      loadSettlementList() {
        getSettlementAuthorityByUser({}).then((res) => {
          this.settlementList = res.data
        })
      },
      handleIdProvinceChange(value) {
        this.idAreaCitys = []
        for(const c of this.idAreaTrees[value - 1].children) {
          this.idAreaCitys.push(c)
        }
        delete this.queryParam.city
        delete this.queryParam.town
      },
      handleIdCityChange(value) {
        this.idAreaTowns = []
        for(const c of this.idAreaCitys) {
          if(String(c.id) === String(value)){
            for(const d of c.children){
              this.idAreaTowns.push(d)
            }
          }
        }
      },
      handleEdit (record) {
        this.mdl = Object.assign({}, record)
        this.visible = true
      },
      handleOk () {

      },
      //添加逻辑
      handleModalVisible(isVisible) {
        this.visibleCreateModal = isVisible;
      },
      handleCreateModalOk() {

      },
      handleCreateModalCancel() {
        this.visibleCreateModal = false;
      },
      onChange (row) {
        this.selectedRowKeys = row.selectedRowKeys
        this.selectedRows = row.selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      resetSearchForm () {
        this.queryParam = {
          date: moment(new Date())
        }
      },
      changeMoney(e){
        // eslint-disable-next-line
        const settlementAmount = e.target.value.replace(/\,/g,'')
        const reg = /\./g
        const matchArr = settlementAmount.match(reg)
        if(matchArr){
          if(matchArr.length > 1){
            this.queryParam.settlementAmount = ''
          }
          if(matchArr.length === 1){
            let str = settlementAmount.split(".")[1]
            const reg2 = /^[0-9]*$/
            if(!reg2.test(str)){
              this.queryParam.settlementAmount = ''
            }else{
              this.queryParam.settlementAmount = settlementAmount
            }
          }
        }else{
          const reg1 = /^(-?)[0-9]*(.[0-9]{1,2})?$/
          if(!reg1.test(settlementAmount)){
            this.queryParam.settlementAmount = ''
          }else{
            this.queryParam.settlementAmount = settlementAmount
          }
        }
      },
      initDictConfig () {
        //报表类型
        initDictOptions('form_type').then((res) => {
          if (res.code === 200) {
            this.formTypeOptions = res.data
          }
        })
      },
      //撤回
      handleBack(record){
        this.$refs.modalCheck.title = '撤回'
        this.$refs.modalCheck.employData = this.employData
        this.$refs.modalCheck.footSide = true
        this.$refs.modalCheck.show(record,0)

        // this.backform.resetFields()
        // this.backVisible = true
        // this.salaryStandardInfo = record
        // const url = `${this.url.openBill}?salaryFormId=${record.id}`
        // httpAction(url,{},'POST').then((res) => {
        //   if(Number(res.code) === 200){
        //     this.settlementhFormInfo = res.data.settlementhForm
        //   }
        // })
      },
      // 提交退回理由
      handleBackOk() {
        var that = this
        this.backform.validateFields((err,values) => {
          if(!err){
            const url = `${this.url.backUrl}?tSettlementhFormId=${this.settlementhFormInfo.id}`
            httpAction(url,{'id':this.salaryStandardInfo.id,'status':7,'remark':values.remark},'POST').then((res) => {
              if(Number(res.code) === 200){
                this.backVisible = false
                this.$message.success("撤销成功")
                that.loadData()
              }else{
                this.$message.error(res.msg)
              }
            })
          }
        })
      },
      handleBackCancel() {
        this.backVisible = false
        this.backform.resetFields()
      },
      watchList(id){
        this.balanceVar[id] = 1
      }
    }
  }
</script>
