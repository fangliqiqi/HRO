
<template>
  <a-tabs default-active-key="1">
    <a-tab-pane
      key="1"
      tab="我司承担"
    >
      <div class="right">合计：{{ eventFeeDetail.companyTotal || 0 }}元</div>
      <a-table
        size="small"
        bordered
        rowKey="id"
        :columns="columnsCompany"
        :dataSource="dataCompany"
        :pagination="false"
        :loading="loading"
        :scroll="{ x: 800,y:400 }"
      >
        <span
          slot="action"
          slot-scope="text, record,index"
        >
          <a-popconfirm
            title="确定删除吗?"
            v-if="record.recordType == 0 && !disableEnd"
            @confirm="() => handleDelete(record,index,'companyBearList')"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-tab-pane>
    <a-tab-pane
      key="2"
      tab="客户承担"
    >
      <div class="right">合计：{{ eventFeeDetail.customerTotal || 0 }}元</div>
      <a-table
        size="small"
        bordered
        rowKey="id"
        :columns="columnsCustomer"
        :dataSource="dataCustomer"
        :pagination="false"
        :loading="loading"
        :scroll="{ x: 800,y:400 }"
      >
        <span
          slot="action"
          slot-scope="text,record"
        >
          <template v-if="text == 0">
            <a @click="jumpOther(text,record)">是</a>
          </template>
          <template v-else>否</template>
        </span>
      </a-table>
    </a-tab-pane>
    <a-tab-pane
      key="3"
      tab="社保局承担"
    >
      <div class="right">合计：{{ eventFeeDetail.socialTotal || 0 }}元</div>
      <a-table
        size="small"
        bordered
        rowKey="id"
        :columns="columnsSocial"
        :dataSource="dataSocial"
        :pagination="false"
        :loading="loading"
        :scroll="{ x: 800,y:400 }"
      >
        <span
          slot="action"
          slot-scope="text, record,index"
        >
          <a-popconfirm
            title="确定删除吗?"
            v-if="record.recordType == 0 && !disableEnd"
            @confirm="() => handleDelete(record,index,'socialBearList')"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-tab-pane>
    <a-tab-pane
      key="4"
      tab="保险公司承担"
    >
      <div class="right">合计：{{ eventFeeDetail.insuranceTotal || 0 }}元</div>
      <a-table
        size="small"
        bordered
        rowKey="id"
        :columns="columnsInsurance"
        :dataSource="dataInsurance"
        :pagination="false"
        :loading="loading"
        :scroll="{ x: 800,y:400 }"
      >
        <span
          slot="action"
          slot-scope="text, record,index"
        >
          <a-popconfirm
            title="确定删除吗?"
            v-if="record.recordType == 0 && !disableEnd"
            @confirm="() => handleDelete(record,index,'insuranceBearList')"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-tab-pane>
  </a-tabs>
</template>

<script>

import { httpAction } from '@/api/manage'
import { filterDictText } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'UndertakerModal',
  props: {
    title:{
      type: String,
      default: '商险理赔',
      required: false
    },
    eventFeeDetail:{
      type: Object,
      default: ()=>{},
      required: false
    },
    feeTypeOption:{
      type: Array,
      default: ()=>[],
      required: true
    },
    disableEnd:{
      type: Boolean,
      default: false,
      required: true
    },
    dataCompany:{
      type: Array,
      default: ()=>[],
      required: true
    },
    dataCustomer:{
      type: Array,
      default: ()=>[],
      required: true
    },
    dataSocial:{
      type: Array,
      default: ()=>[],
      required: true
    },
    dataInsurance:{
      type: Array,
      default: ()=>[],
      required: true
    },
  },
  data() {
    return {
      loading: false,
      // dataCompany:this.eventFeeDetail.companyBearList||[],
      // dataCustomer:this.eventFeeDetail.customerBearList||[],
      // dataSocial:this.eventFeeDetail.socialBearList||[],
      // dataInsurance:this.eventFeeDetail.insuranceBearList||[],
      recordType:{
        '0':'自行添加',
        '1':'企业微信',
        '2':'结算单-非扣税项'
      },
      columnsCompany:[
        {
          // width: 100,
          ellipsis: true,
          title: '数据来源',
          align: 'center',
          dataIndex: 'recordType',
          customRender: text => {
            const resultText = text != null ? this.recordType[text] : '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '费用类型',
          align: 'center',
          dataIndex: 'feeType',
          customRender: text => {
            const resultText = text ? filterDictText(this.feeTypeOption,text) : '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '金额',
          align: 'center',
          dataIndex: 'fee',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '费用发生时间',
          align: 'center',
          dataIndex: 'feeHappenTime',
          customRender: text => {
            const resultText = text ? text.substring(0, 10) : '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '添加人',
          align: 'center',
          dataIndex: 'addUser',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '添加时间',
          align: 'center',
          dataIndex: 'addTime',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '备注',
          align: 'center',
          dataIndex: 'remark',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width:100,
          title: '操作',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columnsCustomer:[
        {
          ellipsis: true,
          title: '数据来源',
          align: 'center',
          dataIndex: 'recordType',
          customRender: text => {
            const resultText = text != null ? this.recordType[text] : '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'departName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'departCode',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '费用类型',
          align: 'center',
          dataIndex: 'feeType',
          customRender: text => {
            const resultText = text ? filterDictText(this.feeTypeOption,text) : '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '结算金额',
          align: 'center',
          dataIndex: 'fee',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width:150,
          ellipsis: true,
          title: '结算申请日期',
          align: 'center',
          dataIndex: 'feeHappenTime',
          customRender: text => {
            const resultText = text ? text.substring(0, 10) : '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '是否垫付',
          align: 'center',
          dataIndex: 'advanceFlag',
          scopedSlots: { customRender: 'action' }
          // customRender: text => {
          //   const resultText = text == 1 ? '否' : '是'
          //   return <a-tooltip placement="topLeft" title={resultText}><a>{resultText}</a></a-tooltip>
          // }
        },
        {
          ellipsis: true,
          title: '备注',
          align: 'center',
          dataIndex: 'remark',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
      ],
      columnsSocial:[
        {
          ellipsis: true,
          title: '数据来源',
          align: 'center',
          dataIndex: 'recordType',
          customRender: text => {
            const resultText = text != null ? this.recordType[text] : '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '费用类型',
          align: 'center',
          dataIndex: 'feeType',
          customRender: text => {
            const resultText = text ? filterDictText(this.feeTypeOption,text) : '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '金额',
          align: 'center',
          dataIndex: 'fee',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '费用发生时间',
          align: 'center',
          dataIndex: 'feeHappenTime',
          customRender: text => {
            const resultText = text ? text.substring(0, 10) : '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '添加人',
          align: 'center',
          dataIndex: 'addUser',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '添加时间',
          align: 'center',
          dataIndex: 'addTime',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '备注',
          align: 'center',
          dataIndex: 'remark',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width:100,
          title: '操作',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columnsInsurance:[
        {
          ellipsis: true,
          title: '数据来源',
          align: 'center',
          dataIndex: 'recordType',
          customRender: text => {
            const resultText = text != null ? this.recordType[text] : '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '费用类型',
          align: 'center',
          dataIndex: 'feeType',
          customRender: text => {
            const resultText = text ? filterDictText(this.feeTypeOption,text) : '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '金额',
          align: 'center',
          dataIndex: 'fee',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '费用发生时间',
          align: 'center',
          dataIndex: 'feeHappenTime',
          customRender: text => {
            const resultText = text ? text.substring(0, 10) : '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '添加人',
          align: 'center',
          dataIndex: 'addUser',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '添加时间',
          align: 'center',
          dataIndex: 'addTime',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '备注',
          align: 'center',
          dataIndex: 'remark',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width:100,
          title: '操作',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
    }
  },
  methods: {

    jumpOther(val,record){
      if(val == 0){
        this.$router.push({path:'/iweb/AdvancePaymentSearchList',query: {departNo: record.departCode, settleMoney:record.settleFormFee}})
        this.$emit('cancel')
      }
    },
    handleDelete(record,index,field){
      httpAction(`/hrEmergency/teventfeedetail/${record.id}`,null,'delete').then(res=>{
        if(res.code === 200){
          this.$message.success('删除成功!')
          this.eventFeeDetail.total = Math.round((parseFloat(this.eventFeeDetail.total) - parseFloat(record.fee)) * 100)/100
          // 减去费用
          switch(field){
            case 'companyBearList':
              this.dataCompany.splice(index,1)
              this.eventFeeDetail.companyTotal = Math.round((parseFloat(this.eventFeeDetail.companyTotal) - parseFloat(record.fee)) * 100)/100
              break
            case 'customerBearList':
              this.dataCustomer.splice(index,1)
              this.eventFeeDetail.customerTotal = Math.round((parseFloat(this.eventFeeDetail.customerTotal) - parseFloat(record.fee)) * 100)/100
              break
            case 'socialBearList':
              this.dataSocial.splice(index,1)
              this.eventFeeDetail.socialTotal = Math.round((parseFloat(this.eventFeeDetail.socialTotal) - parseFloat(record.fee)) * 100)/100
              break
            case 'insuranceBearList':
              this.dataInsurance.splice(index,1)
              this.eventFeeDetail.insuranceTotal = Math.round((parseFloat(this.eventFeeDetail.insuranceTotal) - parseFloat(record.fee)) * 100)/100
              break
          }

        }else{
          this.$message.warning(res.msg)
        }
      })
    },
  }


}
</script>

<style lang="less" scoped>
.right {
  text-align: right;
  margin-bottom: 10px;
}
</style>
