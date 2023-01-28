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
            <a-form-item label="结算月份">
              <j-month
                placeholder="请选择结算月份"
                v-model="queryParam.settlementMonth"
                date-format="YYYYMM"
              ></j-month>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算金额">
              <a-input
                placeholder="请输入结算金额"
                v-model="queryParam.settlementAmount"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="发票号">
              <a-input
                placeholder="请输入发票号"
                v-model="queryParam.invoiceNo"
              />
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

    <!-- table区域-begin -->
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
          slot="settlementAmount"
          slot-scope="text"
        >
          <a-tag color="cyan">{{ text }}</a-tag>
        </span>
        <span
          slot="ticket"
          slot-scope="text"
        >
          <a-tag color="blue">{{ text }}</a-tag>
        </span>
        <span
          slot="status"
          slot-scope="text"
        >
          <a-tag :color="color[text]">{{ filterDictText(statusOptions, text) }}</a-tag>
        </span>

        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleDetail(record)"
          >查看</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <insurance-scan-detail-modal ref="InsuranceScanDetailForm"></insurance-scan-detail-modal>

  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import JMonth from '@/components/jeecg/JMonth'
  import { httpAction } from '@/api/manage'
  import InsuranceScanDetailModal from './modules/InsuranceScanDetailModal'

  export default {
    name: 'InsuranceScanAccount',
    mixins: [JeecgListMixin],
    components: {
      JMonth,
      InsuranceScanDetailModal
    },
    data() {
      return {
        description: '商险扫描出账',
        statusOptions:[], //状态
        settleTypeOptions:[],
        payTypeOptions:[], //商险结算付款方式
        color:['orange','pink','green','red','#f9033b'],
        // 表头
        columns: [
          {
            title: '结算月份',
            align: 'center',
            dataIndex: 'settlementMonth',
          },
          {
            title: '结算金额',
            align: 'center',
            dataIndex: 'settlementAmount',
            scopedSlots: { customRender: 'settlementAmount' }
          },
          // {
          //   title: '开票金额',
          //   align: 'center',
          //   dataIndex: 'ticketAmountSum',
          //   scopedSlots: { customRender: 'ticket' }
          // },
          {
            title: '发票号',
            align: 'center',
            dataIndex: 'invoiceNo',
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/tinsurancesettlementautoform/page/notaudit', //审核不通过和已出账状态
          getDetail:'/busiInsurance/tinsurancesettlementautoform/getVo/'
        }
      }
    },
    methods: {
      filterDictText,
      //查看
      handleDetail: function(record) {
        this.$refs.InsuranceScanDetailForm.title = '详情'
        this.$refs.InsuranceScanDetailForm.settleTypeOptions = this.settleTypeOptions
        httpAction(this.url.getDetail + record.id, '','GET').then((res) => {
          if(res.code===200){
            // 商险派单信息表
            this.$refs.InsuranceScanDetailForm.businessInsuranceVos = res.data.businessInsuranceVos || []
            // settleFormType 0普通工资发放 1工程类工资发放2预估发放
            if(res.data.settleFormType == 1){ //1工程类工资发放
              this.$refs.InsuranceScanDetailForm.type = 1
              this.$refs.InsuranceScanDetailForm.statementBill = res.data.engineerSettlementDetailVo
            }else if(res.data.settleFormType == 2){ //2预估发放
              this.$refs.InsuranceScanDetailForm.type = 2
              this.$refs.InsuranceScanDetailForm.statementBill = res.data.forecastVo
            }else if(res.data.settleFormType == 0){ //0普通工资发放
              this.$refs.InsuranceScanDetailForm.type = 0
              this.$refs.InsuranceScanDetailForm.statementBill = res.data.salaryDetailVo
            }else{
              this.$refs.InsuranceScanDetailForm.type = ''
              this.$refs.InsuranceScanDetailForm.statementBill = []
            }
            //封面信息
            res.data.insuranceSettlementCover.map(item=>{
              const arr = []
              if(/,/.test(item.customerName)){
                const customerNameArr = item.customerName.split(',')
                const departNameArr = item.departName.split(',')
                customerNameArr.forEach((items,index)=>{
                  arr[index] = `${items}-${departNameArr[index]}`
                })
              }else{
                arr[0] = `${item.customerName}-${item.departName}`
              }
              item.customerArr = arr
              return item
            })
            this.$refs.InsuranceScanDetailForm.isCanModifyInvoiceNo = true
            this.$refs.InsuranceScanDetailForm.insuranceSettlementCover = res.data.insuranceSettlementCover
            this.$refs.InsuranceScanDetailForm.payTypeOptions = this.payTypeOptions
            //明细
            this.$refs.InsuranceScanDetailForm.detail = {
              id:record.id,
              settlementMonth:res.data.settlementMonth,
              ticketAmountSum:res.data.ticketAmountSum,
              createUser:res.data.createUser,
              createTime:res.data.createTime,
            }
            this.$refs.InsuranceScanDetailForm.show(res.data)
          }else{
            this.$message.error(res.msg)
          }
        })

      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      // 数据字典
      initDictConfig() {
        // 状态
        initDictOptions('insurance_settle_status').then((res) => {
          if (res.code === 200) {
            this.statusOptions = res.data
          }
        })
        // 付款方式
        initDictOptions('insurance_payType').then((res) => {
          if (res.code === 200) {
            this.payTypeOptions = res.data
          }
        })
        //结算类型
        initDictOptions('settlementType').then((res) => {
          if (res.code === 200) {
            this.settleTypeOptions = res.data
          }
        })
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

</style>
