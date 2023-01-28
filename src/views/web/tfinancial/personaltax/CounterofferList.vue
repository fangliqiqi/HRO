<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="申报月份">
              <a-month-picker
                v-model="queryParam.declareMonth"
                @change="handleTimeBeginChange"
                style="width: 100%"
                placeholder="请选择结算月份"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>

          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="税务主体">
              <a-input
                v-model="queryParam.invoiceTitle"
                placeholder=""
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
              >查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
              <!-- <a
                @click="handleToggleSearch"
                style="margin-left: 8px"
              >
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div
      class="table-operator"
      style="margin-bottom:10px"
    >
      <a-row>
        <a-col :span="12">
          <a-button
            type="primary"
            @click="handleAdd"
          >导入</a-button>
          <a-button
            style="margin-left:20px"
            type="primary"
            @click="downloadLocalTemplate('/templates/回盘数据导入模板.xlsx')"
          >下载模板</a-button>
          <a-button
            type="primary"
            style="margin-left:20px"
            v-has="'wxhr:tstatisticscurrentreportmarket_doDeleteByDeclareMonth'"
            @click="handleDeleteBatch"
          >批量删除</a-button>
        </a-col>
        <!-- <a-col
          :span="19"
          style="font-size:20px;font-weight:bold;text-align:center"
        >2020 年 4 月份【税务主体名称】申报</a-col> -->
      </a-row>
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
        :scroll="{x: 1}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a-popconfirm
            title="确认删除吗?"
            @confirm="handleDelete(record.id)"
            okText="确定"
            cancelText="取消"
          >
            <a
              href="#"
              v-have="'wxhr:tstatisticscurrentreportmarket_del'"
            >删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>

    <a-modal
      title="批量删除"
      :width="600"
      placement="right"
      :closable="true"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭"
      okText="删除"
      :visible="visible"
      :maskClosable="false"
      :confirmLoading="deLoading"
    >

      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >

        <a-row>
          <a-col>
            <a-form-item
              label="月份"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-month-picker
                v-model="yearMonth"
                style="width: 191px"
                placeholder="请选择结算月份"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 表单区域 导入弹窗-->
    <counteroffer-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></counteroffer-modal>

  </a-card>
</template>
<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import CounterofferModal from './modules/CounterofferModal'
  import { httpAction } from '@/api/manage'

  export default {
    name: "CounterofferList",
    mixins: [JeecgListMixin],
    components: {
      CounterofferModal,
    },
    data () {
      return {
        visible:false,
        confirmLoading:false,
        queryParam: {},
        deLoading:false,
        form:this.$form.createForm(this),
        yearMonth:'',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        columns: [
          {
            title: '姓名',
            align: 'center',
            width: 120,
            dataIndex: 'empName',
          },
          {
            title: '身份证号',
            align: 'center',
            width: 120,
            dataIndex: 'empIdcard'
          },
          {
            title: '申报月份',
            align: 'center',
            width: 120,
            dataIndex: 'declareMonth',
          },
          {
            title: '税务主体',
            align: 'center',
            width: 210,
            dataIndex: 'invoiceTitle'
          },
          {
            title: '本期收入',
            align: 'center',
            width: 120,
            dataIndex: 'realSalary',
            
          },
          
          {
            title: '本期基本养老保险',
            align: 'center',
            width: 130,
            dataIndex: 'personalPensionMoney',
          },
          {
            title: '本期基本医疗保险',
            align: 'center',
            width: 130,
            dataIndex: 'personalMedicalMoney',
          },
          {
            title: '本期失业保险',
            align: 'center',
            width: 120,
            dataIndex: 'personalUnemploymentMoney',
          },
          {
            title: '本期住房公积金',
            align: 'center',
            width: 120,
            dataIndex: 'personalProvidentFee',
          },
          {
            title: '本期企业年金',
            align: 'center',
            width: 120,
            dataIndex: 'enterpriseAnnuity',
          },
          {
            title: '累计住房租金',
            align: 'center',
            width: 120,
            dataIndex: 'housingRentalinfoMoney',
          },
          {
            title: '累计应纳税所得额',
            dataIndex: 'taxable',
            align: 'center',
            width: 130,
          },
          {
            title: '累计子女教育',
            align: 'center',
            width: 120,
            dataIndex: 'childEduinfoMoney',
          },
          {
            title: '累计继续教育',
            align: 'center',
            width: 120,
            dataIndex: 'continuingEducationExpenseMoney',
          },
          {
            title: '累计住房贷款',
            align: 'center',
            width: 120,
            dataIndex: 'housingLoanInterestExpenseMoney',
          },
          {
            title: '累计赡养老人',
            align: 'center',
            width: 120,
            dataIndex: 'supportElderlyExpenseMoney',
          },
          {
            title: '累计3岁以下婴幼儿照护',
            align: 'center',
            width: 200,
            dataIndex: 'sumBabyMoney',
          },
          {
            title: '累计个人养老金',
            align: 'center',
            width: 120,
            dataIndex: 'sumPrivatePension',
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            width: 120,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: '/salary/tstatisticscurrentreportmarket/page',
          delete: '/salary/tstatisticscurrentreportmarket/',
          deleteBatch: '/salary/tstatisticscurrentreportmarket/doDeleteByDeclareMonth',
          doSumbitAll:'/salary/tnetincome/doSubmitAll',
          doSubmit:'/salary/tnetincome/doSubmit'
        },
      }
      
    },
    methods:{
      //下载模板
      downloadLocalTemplate(templateUrl) {
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
        window.location.href = url
      },
      //提交
      handleSumbit(record) {
        httpAction(this.url.doSubmit + '?id=' + record.id,{}, 'POST').then((res) => {
          if(res.code == 200){
            this.$message.success("提交成功")
            this.loadData()
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      //批量删除
      handleDeleteBatch(){
        this.visible = true
        this.deLoading = false
      },
      handleTimeBeginChange(date) {
        // 时间格式化
        this.queryParam.declareMonth = date ? (date.format("YYYYMM")) : null
      },
      handleOk(){
        if(!this.yearMonth){
          this.$message.error("请选择月份")
          return false
        }
        this.deLoading = true
        let yearMonth = this.yearMonth.format("YYYYMM")
        httpAction(this.url.deleteBatch + '?yearMonth=' + yearMonth,{},'POST').then((res) => {
          this.deLoading = false
          if(res.code == 200){
            this.$message.success("删除成功")
            this.loadData()
            this.close()
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      handleCancel(){
        this.close()
      },
      close(){
        this.visible = false
        this.yearMonth = ''
      },
    }
  }
</script>