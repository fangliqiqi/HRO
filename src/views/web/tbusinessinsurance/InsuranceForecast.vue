<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
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
                v-model="queryParam.settleDomainId"
                :id="'id'"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算月份">
              <a-month-picker placeholder="请选择结算月份" v-model="queryParam.settlementMonth"/>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="发票号"
              class="formLabel"
            >
              <a-input
                placeholder="请输入发票号"
                v-model="queryParam.invoiceNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="未全额还款"
                class="formLabel"
              >
                <a-select
                  placeholder="请选择未全额还款"
                  v-model="queryParam.workBranchjumpFlag"
                >
                  <a-select-option value="0">是</a-select-option>
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
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>


    <!-- table区域-begin -->
    <div>
      <div
        class="ant-alert ant-alert-info"
        style="margin-bottom: 16px;"
      >
        已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> 项
        <a
          style="margin-left: 24px"
          @click="onClearSelected"
        >清空</a>
      </div>

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
        :scroll="{ x: 1}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleDetail(record)"
          >查看</a>
          <a
            v-if="record.status==0"
            @click="handleEdit(record)"
          ><a-divider type="vertical" />修改结算月</a>
          <a-divider
            type="vertical"
          />
          <a @click="handleBack(record)">回款记录</a>

        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <insurance-forecast-detail ref="InsuranceForecastDetailForm"></insurance-forecast-detail>
    <advance-payment-back
      ref="backModal"
    ></advance-payment-back>
    <a-modal
      title="结算月修改"
      :visible="visible"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form
          :form="form"
          layout="inline"
        >
          <a-form-item label="结算月">
            <a-month-picker
              format="YYYYMM"
              placeholder="请选择结算月!"
              v-decorator="['settlementMonth',{rules: [{ required: true, message: '请选择结算月!' }]}]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

  </a-card>
</template>

<script>

  import InsuranceForecastDetail from './modules/InsuranceForecastDetail'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import AdvancePaymentBack from '../approvalcenter/modules/AdvancePaymentBack'
  import { httpAction } from '@/api/manage'
  import moment from 'moment'
  import pick from 'lodash.pick'

  export default {
    name: 'InsuranceForecast',
    mixins: [JeecgListMixin],
    components: {
      InsuranceForecastDetail,
      SelectPage,
      AdvancePaymentBack

    },
    data() {
      return {
        description: '预估差额',
        title:'预估差额',
        payTypeOptions:[], // 付款方式
        statusOptions: [], //状态
        statusDict:['待结算','结算中','已结算'],
        visible:false,
        settleId:'',
        confirmLoading:false,
        form: this.$form.createForm(this),
        // 表头
        columns: [
          {
            width:160,
            ellipsis: true,
            title: '结算主体编码',
            align: 'center',
            dataIndex: 'settleDomainNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:200,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDomainName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:200,
            ellipsis: true,
            title: '客户名称',
            align: 'center',
            dataIndex: 'customerName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:140,
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
            width:150,
            ellipsis: true,
            title: '发票号',
            align: 'center',
            dataIndex: 'invoiceNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:150,
            ellipsis: true,
            title: '回款金额',
            align: 'center',
            dataIndex: 'payBackBalance',
            customRender: text => {
              const resultText = text || (parseFloat(text) === 0?'0':'-')
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:150,
            ellipsis: true,
            title: '预估差额',
            align: 'center',
            dataIndex: 'balance',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:100,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            customRender: text => {
              const resultText = this.statusDict[text] || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:170,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:140,
            ellipsis: true,
            title: '创建人',
            align: 'center',
            dataIndex: 'createUser',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:240,
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed:'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/forecastbuypayform/page', //列表请求地址
          getDetail:'/busiInsurance/forecastbuypayform/',
          getBackRecord:'/busiInsurance/forecastbackpay/'
        }
      }
    },
    methods: {
      // 详情
      handleDetail: function(record) {
        this.$refs.InsuranceForecastDetailForm.title = '详情'
        this.$refs.InsuranceForecastDetailForm.statusOptions = this.statusOptions
        this.$refs.InsuranceForecastDetailForm.payTypeOptions = this.payTypeOptions
        httpAction(this.url.getDetail+record.id,null,'get').then((res)=>{
          if(res.code === 200){
            this.$refs.InsuranceForecastDetailForm.show(res.data)
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      handleEdit(record){
        this.settleId = record.id
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({settlementMonth:moment(record.settlementMonth,'YYYYMM')}, 'settlementMonth'))
        })
      },
      handleOk(){
        this.form.validateFields((err, values) => {
          if (!err) {
            const settlementMonth = moment(values.settlementMonth).format('YYYYMM')
            httpAction('/busiInsurance/forecastbuypayform',{settlementMonth:settlementMonth,id:this.settleId},'PUT').then((res)=>{
              if(res.code === 200){
                this.$message.success('保存成功！')
                this.handleCancel()
                this.loadData()
              }else{
                this.$message.warning(res.msg)
              }
            })
          }
        })
      },
      handleCancel(){
        this.visible = false
        this.settleId = ''
      },
      handleBack(record) {
        httpAction(this.url.getBackRecord+record.id,null,'get').then(res=>{
          if(res.code === 200){
            this.$refs.backModal.show(res.data)
          }
        })
      },
      // 数据字典
      initDictConfig() {
        initDictOptions('insurance_payType').then((res) => {
          if (res.code === 200) {
            this.payTypeOptions = res.data
          }
        })
        // 状态
        initDictOptions('Insurance_record_status').then((res) => {
          if (res.code === 200) {
            this.statusOptions = res.data
          }
        });
      },
    }
  }
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.ant-card-body .table-operator {
  margin-bottom: 18px;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}

.ant-btn-danger {
  background-color: #ffffff;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}
.formLabel {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
