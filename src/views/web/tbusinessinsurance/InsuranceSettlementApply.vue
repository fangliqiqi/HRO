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
            <a-form-item label="部门编码">
              <a-input
                placeholder="请输入部门编码"
                v-model="queryParam.departNo"
              ></a-input>
            </a-form-item>
          </a-col>
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
            :md="4"
            :sm="6"
          >
            <a-form-item label="状态">
              <a-select
                v-model="queryParam.status"
                placeholder="请选择"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option
                  v-for="(item, index) in statusOptions"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        type="primary"
        icon="download"
        @click="handleGenerateSettlementBill"
        v-has="'wxhr:busi_generateSettlementBill'"
      >生成结算单</a-button>
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
        @change="handleTableChange"
      >
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
            v-has="'wxhr:insurancesettlementform_detail'"
          >详情</a>
          <a-divider
            type="vertical"
            v-if="record.status != 1"
            v-has="'wxhr:insurancesettlementform_del'"
          />
          <a-popconfirm
            v-if="record.status != 1"
            v-has="'wxhr:insurancesettlementform_del'"
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>

        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <error-modal ref="errorModal"></error-modal>
    <insurance-settlement-apply-detail-modal ref="InsuranceSettlementApplyDetailForm"></insurance-settlement-apply-detail-modal>
    <generate-settlement-bill-modal
      ref="GenerateSettlementBillForm"
      @ok="modalFormOk"
    ></generate-settlement-bill-modal>
    <assignment-modal
      ref="AssignmentModalForm"
      @ok="modalFormOk"
    ></assignment-modal>

  </a-card>
</template>

<script>
  import ErrorModal from './modules/ErrorModal'
  import JMonth from '@/components/jeecg/JMonth'
  import { httpAction } from '@/api/manage'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import InsuranceSettlementApplyDetailModal from './modules/InsuranceSettlementApplyDetailModal'
  import GenerateSettlementBillModal from './modules/GenerateSettlementBillModal'
  import AssignmentModal from './modules/AssignmentModal' //指派
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'InsuranceSettlementApply',
    mixins: [JeecgListMixin],
    components: {
      JMonth,
      InsuranceSettlementApplyDetailModal,
      GenerateSettlementBillModal,
      AssignmentModal,
      SelectPage,
      ErrorModal
    },
    data() {
      return {
        description: '商险结算申请',
        statusOptions: [], //状态
        payTypeOptions:[], //商险结算付款方式
        settleTypeOptions:[],
        flag:['未到账','已到账'],
        color:['orange','#e08d33','green','red','red','blue','#72bd4d','#f1a95c','##ffc107','##aeec94'],
        // 表头
        columns: [
          {
            title: '到账情况',
            align: 'center',
            dataIndex: 'accountReceiveFlag',
            customRender: (text) => {
              return this.flag[text]
            }
          },
          {
            title: '结算主体编码',
            align: 'center',
            dataIndex: 'departNo'
          },
          {
            title: '结算主体名称',
            align: 'center',
            dataIndex:'departName'
          },
          {
            title: '结算金额',
            align: 'center',
            dataIndex: 'settlementAmount'
          },
          {
            title: '结算月份',
            align: 'center',
            dataIndex: 'settlementMonth'
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
            // customRender: (text) => {
            //   return filterDictText(this.statusOptions, text)
            // }
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime'
          },
          {
            title: '创建人',
            align: 'center',
            dataIndex: 'createUser'
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/tinsurancesettlementform/page',
          delete: '/busiInsurance/tinsurancesettlementform/',
          queryAllInfoById: '/busiInsurance/tinsurancesettlementform/getVo/',
          submitApplyUrl:'/busiInsurance/tinsurancesettlementform/submit'
        }
      }
    },
    methods: {
      filterDictText,
      // 生成结算单
      handleGenerateSettlementBill: function() {
        this.$refs.GenerateSettlementBillForm.title = '生成结算单'
        this.$refs.GenerateSettlementBillForm.edit()
      },
      // 提交
      handleDelegate: function(record) {
        const _this = this
        this.$confirm({
          content: '确认提交？',
          onOk() {
            httpAction(_this.url.submitApplyUrl,{id:record.id},'put').then(res=>{
              if(res.code == 200){
                _this.$message.success('提交成功！')
                _this.loadData()
              }else{
                _this.$message.warning(res.msg)
              }
            })
          },
        })
      },
      // 详情
      handleDetail: function(record) {
        console.log(record)
        this.$refs.InsuranceSettlementApplyDetailForm.title = '详情'
        httpAction(this.url.queryAllInfoById+record.id, '','GET').then((res) => {
          if(res.code===200){
            // 商险结算单
            this.$refs.InsuranceSettlementApplyDetailForm.insuranceBill = res.data.insuranceBill
            this.$refs.InsuranceSettlementApplyDetailForm.settleTypeOptions = this.settleTypeOptions
            // 商险派单信息表
            this.$refs.InsuranceSettlementApplyDetailForm.businessInsuranceVos = res.data.businessInsuranceVos
            this.$refs.InsuranceSettlementApplyDetailForm.settleDomain = res.data.departName
            this.$refs.InsuranceSettlementApplyDetailForm.departNo = res.data.departNo
            if(res.data.insuranceSettlementCover.length){
              for(const [index, val] of res.data.insuranceSettlementCover.entries()){
                res.data.insuranceSettlementCover[index].payType = filterDictText(this.payTypeOptions,val.payType)
              }
            }
            //封面信息
            this.$refs.InsuranceSettlementApplyDetailForm.isCanModifyInvoiceNo = false
            this.$refs.InsuranceSettlementApplyDetailForm.insuranceSettlementCover = res.data.insuranceSettlementCover
            //明细
            this.$refs.InsuranceSettlementApplyDetailForm.detail = {
              id:record.id,
              settlementMonth:res.data.settlementMonth,
              departName:res.data.departName,
              departNo:res.data.departNo,
              createUser:res.data.createUser,
              createTime:res.data.createTime,
              remark:res.data.remark,
              settlementAmountSum:(res.data.insuranceBill) ? res.data.insuranceBill.settlementAmountSum : null,
              ticketAmountSum:(res.data.insuranceBill) ? res.data.insuranceBill.ticketAmountSum : null,
              settlementDate:(res.data.insuranceBill) ? res.data.insuranceBill.settlementDate : null,
            }
            this.$refs.InsuranceSettlementApplyDetailForm.show(res.data)
          }else{
            this.$message.error(res.msg)
          }
        })
      },

      // 数据字典
      initDictConfig() {
        // 状态
        initDictOptions('insurance_settle_status').then((res) => {
          if (res.code === 200) {
            this.statusOptions = res.data
          }
        });
        // 付款方式
        initDictOptions('insurance_payType').then((res) => {
          if (res.code === 200) {
            this.payTypeOptions = res.data
          }
        });
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
