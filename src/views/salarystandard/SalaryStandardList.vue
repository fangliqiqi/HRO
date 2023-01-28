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
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :placeholder="'请输入结算主体'"
                v-model="queryParam.departName"
                :id="'departName'"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="发放状态">
              <a-select
                v-model="queryParam.status"
                placeholder="请选择"
                default-value="0"
              >
                <a-select-option
                  v-for="(item,index) in querySalaryStatusOptions"
                  :key="index"
                  :value="index"
                >{{ item.option }}</a-select-option>
              </a-select>
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
                :loading="loading"
              >查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                :loading="loading"
                style="margin-left: 8px"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div
      class="table-operator"
      style="margin-bottom:10px"
    >
      <a-button
        type="primary"
        @click="handleAdd"
      >工资表导入</a-button>
      <a-button
        style="margin-left:10px"
        type="primary"
        @click="handleCheck"
      >数据校验</a-button>
      <!-- <a-button
        style="margin-left:10px"
        type="primary"
        @click="handleDown"
      >下载模板</a-button> -->
      <a-dropdown style="margin-left:10px">
        <a-menu
          slot="overlay"
        >
          <a-menu-item @click="downloadLocalTemplate('/templates/普通工资上传模板.xls')"> 
            <a-icon type="download" />普通工资上传模板
          </a-menu-item>
          <a-menu-item @click="downloadLocalTemplate('/templates/普通工资上传模板-劳务费.xls')"> 
            <a-icon type="download" />普通工资上传模板-劳务费
          </a-menu-item>
        </a-menu>
        <a-button>下载模板
          <a-icon type="down" />
        </a-button>
      </a-dropdown>

      <a-button
        style="margin-left:10px"
        type="primary"
        @click="handleSalary"
      >工资表导入-新</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1">
            <a-icon type="delete" />删除</a-menu-item>
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
            v-has="'wxhr:salarystandard_submit'"
          >提交</a>
          <a-divider type="vertical" />
          <a @click="handleOpen(record)">开票信息</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确认删除吗?"
            @confirm="handleDel(record)"
            okText="确定"
            cancelText="取消"
          >
            <a-button
              style="padding:0px;"
              type="link"
              v-has="'wxhr:tsalarystandard_del'"
            >删除</a-button>
          </a-popconfirm>
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
    <salary-standard-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></salary-standard-modal>
    <salary-standard-detail-modal
      ref="modalDetail"
      :formTypeOptions="formTypeOptions"
      @ok="modalFormOk"
    ></salary-standard-detail-modal>
    <salary-check-modal
      ref="modalCheck"
      @ok="modalFormOk"
    ></salary-check-modal>
    <open-ticket-modal
      ref="modalOpen"
      @ok="modalFormOk"
    ></open-ticket-modal>
  </a-card>
</template>

<script>
  import Vue from 'vue'
  import SalaryStandardModal from './modules/SalaryStandardModal'
  import SalaryStandardDetailModal from './modules/SalaryStandardDetailModal'
  import SalaryCheckModal from './modules/SalaryCheckModal'
  import OpenTicketModal from './modules/OpenTicketModal'
  import moment from "moment"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction, deleteAction,httpAction } from '@/api/manage'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import { getSettlementAuthorityByUser } from '@/api/api'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: "SalaryStandardList",
    mixins: [JeecgListMixin],
    components: {
      SalaryStandardModal,
      SalaryStandardDetailModal,
      SalaryCheckModal,
      OpenTicketModal,
      SelectPage,
    },
    data () {
      return {
        visibleCreateModal:false,
        formTypeOptions:[],
        querySalaryStatusOptions: {
          '0':{'option': '待提交', 'color': 'green'},
          '5':{'option':'审核不通过', 'color': 'yellow'},
          '7':{'option':'财务退回', 'color': 'black'},
        },
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
        queryParam: {},
        //公司所有数据
        orgList:[],
        // 表头
        columns: [
          {
            title: '发放状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'salaryStatus' },
          },
          {
            title: '结算主体',
            align: 'center',
            dataIndex: 'departName'
          },
          {
            title: '结算金额',
            align: 'center',
            dataIndex: 'settlementAmount',
            customRender: (text) => {
              return text ? text.toLocaleString() : '-'
            }
          },
          {
            title: '结算月份',
            align: 'center',
            dataIndex: 'settlementMonth',
          },
          {
            title: '工资日期',
            align: 'center',
            dataIndex: 'salaryMonth',
          },
          {
            title: '报表类型',
            align: 'center',
            dataIndex: 'formType',
            customRender:(text) => {
              return filterDictText(this.formTypeOptions, text)
            }
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
          },
          {
            align:'center',
            title: '操作',
            dataIndex: 'action',
            width: '200px',
            scopedSlots: { customRender: 'action' },
          }
        ],
        selectedRowKeys: [],
        selectedRows: [],
        idAreaTrees: [],
        idAreaCitys: [],
        settlementList:[],
        url: {
          list: '/salary/tsalarystandard/applySalaryStandardPage?type=0',
          delete: '/salary/tsalarystandard/',
          deleteBatch: '/hrBase/temployeeinfo/deleteBatch',
          getOrgForCus:'/admin/organizationinfo/getOrgForCus',
          openBill:'/salary/salary/openBill', // 详情
        },
        idCity:''
      }
    },
    created () {
      //getRoleList({ t: new Date()})
      this.getOrgForCusAll()
      this.loadSettlementList()
      this.idAreaTrees = Vue.ls.get('glob_area')
    },
    methods: {
      handleSalary(){
        this.$refs.modalForm.showNextBtn = true
        this.$refs.modalForm.showImportBtn = false
        this.$refs.modalForm.add()
      },
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
          this.settlementList = res.data
        })
      },
      // 身份证地址省份切换
      handleIdProvinceChange(value) {
        this.idAreaCitys = []
        for(var c of this.idAreaTrees[value - 1].children) {
          this.idAreaCitys.push(c)
        }
        this.idCity = this.idAreaCitys[0].id
      },
      handleIdCityChange(value) {
        this.queryParam.idCity = value
      },
      handleEdit (record) {
        this.mdl = Object.assign({}, record)
        this.visible = true
      },
      //添加逻辑
      handleModalVisible(isVisible) {
        this.visibleCreateModal = isVisible;
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
      // 提交按钮点击事件
      handleSumbit(record) {
        const url = `${this.url.openBill}?salaryFormId=${record.id}`
        httpAction(url,{},'POST').then((res) => {
          if(Number(res.code) === 200){
            this.$refs.modalDetail.title = '工资报表'
            this.$refs.modalDetail.show(record,res.data )
          }else {
            this.$message.warn(res.msg || '详情获取失败！')
          }
        })
      },
      //删除
      handleDel(record){
        let isOk = 0
        const that = this
        if(record.matchSort && record.advanceMoney > 0){
          isOk = 1
          this.$message.error("请先去作废匹配记录与垫付记录")
        }
        if(record.matchSort && !record.advanceMoney){
          isOk = 1
          this.$message.error("请先去作废匹配记录")
        }
        if(!record.matchSort && record.advanceMoney != 0){
          isOk = 1
          this.$message.error("请先去作废垫付记录")
        }
        if(Number(isOk) === 0){
          that.loading = true;
          if(record.ticketAmount){
            this.$confirm({
              title: '信息提示',
              content: '是否清空开票信息',
              onOk() {
                deleteAction(that.url.delete + record.id).then((res) => {
                  if(Number(res.code) === 200){
                    that.$message.success('删除成功!')
                    that.loadData()
                  }else{
                    that.$message.warning(res.message || res.msg)
                  }
                }).finally(()=>{
                  that.loading = false;
                })
              },
              onCancel() {
                that.loading = false;
              },
            });
          }else{
            deleteAction(that.url.delete + record.id).then((res) => {
              if(Number(res.code) === 200){
                that.$message.success('删除成功!')
                that.loadData()
              }else{
                that.$message.warning(res.message || res.msg)
              }
            }).finally(()=>{
              this.loading = false;
            })
          }
        }
      },
      //开票信息
      handleOpen(record){
        this.$refs.modalOpen.show(record)
      },
      // 数据校验
      handleCheck() {
        this.$refs.modalCheck.show()
      },
      //下载模板
      downloadLocalTemplate(templateUrl) {
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
        window.location.href = url
      },
    }
  }
</script>
