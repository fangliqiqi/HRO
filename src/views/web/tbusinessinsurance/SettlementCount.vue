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
            <a-form-item label="结算主体">
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :id="'id'"
                :placeholder="'请输入结算主体'"
                v-model="queryParam.departId"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="6"
          >
            <a-form-item label="结算金额">
              <a-input
                placeholder="请选择结算金额"
                @change="changeMoney"
                v-model="queryParam.settlementAmount"
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
        :scroll="{x: 1}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
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
    <insurance-settlement-apply-detail-modal ref="InsuranceSettlementApplyDetailForm"></insurance-settlement-apply-detail-modal>

  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import JMonth from '@/components/jeecg/JMonth'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { httpAction } from '@/api/manage'
  import InsuranceSettlementApplyDetailModal from './modules/InsuranceSettlementApplyDetailModal' //详情

  export default {
    name: 'SettlementCount',
    mixins: [JeecgListMixin],
    components: {
      JMonth,
      SelectPage,
      InsuranceSettlementApplyDetailModal
    },
    data() {
      return {
        description: '商险单独结算出账',
        statusOptions:[], //状态
        payTypeOptions:[], //商险结算付款方式
        settleTypeOptions:[], //结算类型
        flag:['未到账','已到账'],
        color:['orange','pink','green','red','#f9033b'],
        // 表头
        columns: [
          {
            width: 140,
            ellipsis: true,
            title: '到账情况',
            align: 'center',
            dataIndex: 'accountReceiveFlag',
            customRender: (text) => {
              return this.flag[text] || '-'
            }
          },
          {
            width: 160,
            ellipsis: true,
            title: '结算主体编码',
            align: 'center',
            dataIndex:'departNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体名称',
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
            title: '开票金额',
            align: 'center',
            dataIndex: 'ticketAmountSum',
            customRender: text => {
              const resultText = text || '-'
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
              return <a-tag color="cyan">{{ text }}</a-tag> || '-'
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '差额比对',
            align: 'center',
            dataIndex: 'balanceCompare',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '部门余额',
            align: 'center',
            dataIndex: 'balance',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
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
            width: 180,
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
            width: 140,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            width: 170,
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
            width: 120,
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/tinsurancesettlementform/page/pass', //审核通过
          getDetail:'/busiInsurance/tinsurancesettlementform/getVo/'
        }
      }
    },
    methods: {
      filterDictText,
      defaultVal(val,type){
        const str = type ? [] : null
        return val || str
      },
      changeMoney(e){
        let val = e.target.value;
        const t = val.charAt(0);
        val = val.replace(/[^\d.]/g,"")
        val = val.replace(/^\./g,"")
        val = val.replace(/\.{2,}/g,".")
        val = val.replace(".","$#$").replace(/\./g,"").replace("$#$",".")
        // eslint-disable-next-line
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
        if (t === '-') {
          val = '-' + val
        }
        this.queryParam.settlementAmount = val
      },
      //查看
      handleDetail: function(record) {
        this.$refs.InsuranceSettlementApplyDetailForm.title = '详情'
        this.$refs.InsuranceSettlementApplyDetailForm.settleTypeOptions = this.settleTypeOptions
        httpAction(this.url.getDetail+record.id, '','GET').then((res) => {
          if(res.code === 200){
            // 商险结算单
            this.$refs.InsuranceSettlementApplyDetailForm.insuranceBill = res.data.insuranceBill
            // 商险派单信息表
            this.$refs.InsuranceSettlementApplyDetailForm.businessInsuranceVos = this.defaultVal(res.data.businessInsuranceVos,1)
            this.$refs.InsuranceSettlementApplyDetailForm.forcastBusinessInsuranceVos = this.defaultVal(res.data.forcastBusinessInsuranceVos,1)
            this.$refs.InsuranceSettlementApplyDetailForm.settleDomain = res.data.departName
            this.$refs.InsuranceSettlementApplyDetailForm.departNo = res.data.departNo
            if(res.data.insuranceSettlementCover && res.data.insuranceSettlementCover.length){
              for(const [index, val] of res.data.insuranceSettlementCover.entries()){
                res.data.insuranceSettlementCover[index].payType = filterDictText(this.payTypeOptions,val.payType)
              }
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
            this.$refs.InsuranceSettlementApplyDetailForm.isCanModifyInvoiceNo = true
            this.$refs.InsuranceSettlementApplyDetailForm.insuranceSettlementCover = this.defaultVal(res.data.insuranceSettlementCover,1)
            //明细
            this.$refs.InsuranceSettlementApplyDetailForm.detail = {
              id:record.id,
              settlementMonth:res.data.settlementMonth,
              departName:res.data.departName,
              departNo:res.data.departNo,
              createUser:res.data.createUser,
              createTime:res.data.createTime,
              remark:res.data.remark,
              settlementAmountSum:this.defaultVal(res.data.insuranceBill.settlementAmountSum,0),
              ticketAmountSum:this.defaultVal(res.data.insuranceBill.ticketAmountSum,0),
              settlementDate:this.defaultVal(res.data.insuranceBill.settlementDate,0),
            }
            this.$refs.InsuranceSettlementApplyDetailForm.show(res.data)
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
.formLabel {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}

</style>
