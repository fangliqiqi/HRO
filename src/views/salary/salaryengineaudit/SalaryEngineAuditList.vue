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
                placeholder="请输入结算主体名称"
                v-model="queryParam.departName"
              >
              </a-input>
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
            @click="handleSumbit(record)"
            v-has="'wxhr:tsalaryengineering_doAudit'"
          >审核</a>
        </span>

        <!-- 发放状态 -->
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

      </a-table>
    </div>

    <!-- 表单区域 -->
    <salary-engine-audit-modal
      ref="modalCheck"
      :formTypeOptions="formTypeOptions"
      @ok="modalFormOk"
    ></salary-engine-audit-modal>

    <a-modal
      title="派单委派审核"
      :width="1200"
      placement="right"
      :closable="true"
      @cancel="handleAppointCancel"
      @ok="handleAppointOk"
      cancelText="取消"
      okText="确定"
      :visible="appointVisible"
      :confirmLoading="loading"
    >
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="请选择审批人"
        >
          <a-select
            v-decorator="['auditUser', validatorRules.auditUser ]"
            showSearch
            placeholder="被委派人"
            optionFilterProp="children"
            style="width: 200px"
          >
            <a-select-option
              v-for="(item, index) in employData"
              :key="index"
              :value="index"
            >{{ item }}</a-select-option>

          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注"
        >
          <a-textarea :rows="5"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
  import Vue from 'vue'
  import moment from "moment"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction,getAction } from '@/api/manage'
  import SalaryEngineAuditModal from './modules/SalaryEngineAuditModal'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import { getSettlementAuthorityByUser } from '@/api/api'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: "SalaryEngineAuditList",
    components: {
      SalaryEngineAuditModal,
      SelectPage
    },
    mixins: [JeecgListMixin],
    data () {
      return {
        visibleCreateModal:false,
        formTypeOptions:[],
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
        visible: false,
        loading:false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        form: this.$form.createForm(this),
        mdl: {},

        // 高级搜索 展开/关闭
        advanced: true,
        // 查询参数
        // queryParam: {
        //   town:''
        // },
        //公司所有数据
        orgList:[],
        // 表头
        columns: [
          {
            title: '发放状态',
            dataIndex: 'status',
            align:'center',
            scopedSlots: { customRender: 'salaryStatus' },
          },
          {
            title: '结算主体',
            align:'center',
            dataIndex: 'departName'
          },
          {
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
            title: '上传人',
            align:'center',
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
            title: '结算金额',
            align:'center',
            dataIndex: 'settlementAmount',
            customRender: (text) => {
              return text ? text.toLocaleString() : '-'
            }
          },
          {
            title: '结算月份',
            align:'center',
            dataIndex: 'settlementMonth',
          },
          {
            title: '工资日期',
            align: 'center',
            dataIndex: 'salaryMonth',
          },
          {
            title: '报表类型',
            align:'center',
            dataIndex: 'formType',
            customRender:(text) => {
              return filterDictText(this.formTypeOptions, text)
            }
          },
          {
            title: '操作',
            align:'center',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' },
          }
        ],
        selectedRowKeys: [],
        selectedRows: [],
        idAreaTrees:[],
        idAreaCitys:[],
        idAreaTowns: [],
        url: {
          list: '/salary/tsalaryengineering/auditSalaryEngineeringPage?status=1',
          delegateUrl:'/salary/tsalaryengineering/doDelegationAudit',
          getOrgForCus:'/admin/organizationinfo/getOrgForCus'
        },
        idCity:'',
        appointVisible:false,
        employData:[],
        settlementList:[],
        validatorRules:{
          auditUser: { rules: [{ required: true, message: '请选择审核人!' }] },
        },
        model:{},
        id:''
      }
    },
    created () {
      this.loadSettlementList()
      this.getOrgForCusAll()
      this.idAreaTrees = Vue.ls.get('glob_area')
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if(Number(res.code) === 200){
          this.employData = res.data
        }
      })
    },
    methods: {
      //获取所有公司数据
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
          console.log(res)
          this.settlementList = res.data
        })
      },
      // 身份证地址省份切换
      handleIdProvinceChange(value) {
        this.idAreaCitys = []
        for(var c of this.idAreaTrees[value - 1].children) {
          this.idAreaCitys.push(c)
        }
        delete this.queryParam.city
        delete this.queryParam.town
      },
      handleIdCityChange(value) {
        this.idAreaTowns = []
        for(var c of this.idAreaCitys) {
          if(c.id == value){
            for(let d of c.children){
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
      initDictConfig () {
        //报表类型
        initDictOptions('form_type').then((res) => {
          if (Number(res.code) === 200) {
            this.formTypeOptions = res.data
          }
        })
      },
      handleSumbit(record) {
        this.$refs.modalCheck.title = '工资报表配置'
        this.$refs.modalCheck.employData = this.employData
        this.$refs.modalCheck.show(record)
      },
      handleAppoint(id){
        this.id = id
        httpAction('admin/user/findUserBypPrmission?permissionStr=wxhr:auditinfo_check', '', 'GET').then((res) => {
          if (Number(res.code) === 200) {
            this.employData = res.data
            this.appointVisible = true
          } else {
            this.$message.error('审核人数据请求失败！')
          }
        })
      },
      handleAppointCancel(){
        this.appointVisible = false
      },
      handleAppointOk(){
        this.loading = true
        this.form.validateFields((err,values) => {
          if(!err){
            let formData = Object.assign(this.model,values)
            formData.id = this.id
            httpAction(this.url.delegateUrl,formData,'POST').then((res) => {
              this.loading = false
              if(Number(res.code) === 200){
                this.loadData()
                this.appointVisible = false
                this.form.resetFields()
                this.$message.success("委派成功")
              }else{
                this.$message.error(res.msg)
              }
            })
          }else{
            this.loading = false
          }
        })
      }
    }
  }
</script>
