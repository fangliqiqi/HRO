
<template>
  <div>
    <a-row>
      <a-col :span="12">
        <span class="dealine">材料上交截止日期</span>   {{ dealine }}
      </a-col>
      <a-col :span="12">
        流程状态： {{ status }}
      </a-col>

      <a-col :span="24" class="lineTitle"> 处理费用 </a-col>
      <div class="border">
        <a-col :span="24" class="handleEvent">费用明细
          <span style="font-size:12px;float:right;">合计：{{ eventFeeDetail.total || 0 }}元；承担明细 - 我司：{{ eventFeeDetail.companyTotal || 0 }}元；客户：{{ eventFeeDetail.customerTotal || 0 }}元；社保局：{{ eventFeeDetail.socialTotal || 0 }}元；保险公司：{{ eventFeeDetail.insuranceTotal || 0 }}元</span>
        </a-col>
        <a-col :span="24">
          <a-tabs default-active-key="1">
            <a-tab-pane
              key="1"
              tab="我司承担"
            >
              <a-col :span="24" class="handleother">
                <span style="font-size:12px;float:right;">合计：{{ eventFeeDetail.companyTotal || 0 }}元</span>
              </a-col>
              <a-col :span="24">
                <a-table
                  size="small"
                  bordered
                  rowKey="id"
                  :columns="columnsCompany"
                  :dataSource="dataCompany"
                  :pagination="false"
                  :scroll="{ y:380 }"
                ></a-table>
              </a-col>
            </a-tab-pane>
            <a-tab-pane
              key="2"
              tab="客户承担"
            >
              <a-col :span="24" class="handleother">
                <span style="font-size:12px;float:right;">合计：{{ eventFeeDetail.customerTotal || 0 }}元</span>
              </a-col>
              <a-col :span="24">
                <a-table
                  size="small"
                  bordered
                  rowKey="id"
                  :columns="columnsCustomer"
                  :dataSource="dataCustomer"
                  :pagination="false"
                  :scroll="{ y:380 }"
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
              </a-col>
            </a-tab-pane>
            <a-tab-pane
              key="3"
              tab="社保局承担"
            >
              <a-col :span="24" class="handleother">
                <span style="font-size:12px;float:right;">合计：{{ eventFeeDetail.socialTotal || 0 }}元</span>
              </a-col>
              <a-col :span="24">
                <a-table
                  size="small"
                  bordered
                  rowKey="id"
                  :columns="columnsSocial"
                  :dataSource="dataSocial"
                  :pagination="false"
                  :scroll="{ y:380 }"
                >
                </a-table>
              </a-col>
            </a-tab-pane>
            <a-tab-pane
              key="4"
              tab="保险公司承担"
            >
              <a-col :span="24" class="handleother">
                <span style="font-size:12px;float:right;">合计：{{ eventFeeDetail.insuranceTotal || 0 }}元</span>
              </a-col>
              <a-col :span="24">
                <a-table
                  size="small"
                  bordered
                  rowKey="id"
                  :columns="columnsInsurance"
                  :dataSource="dataInsurance"
                  :pagination="false"
                  :scroll="{ y:380 }"
                >
                </a-table>
              </a-col>
            </a-tab-pane>
          </a-tabs>
        </a-col>
        
      </div>
      <a-col :span="24" class="lineTitle">办理过程</a-col>
      <div class="border">
        <a-col :span="24" class="handleEvent">办理日志</a-col>
        <a-col :span="24" class="timeLine">
          <template v-if="dealInfo.length">
            <a-timeline style="padding-top: 4px;">
              <a-timeline-item
                color="green"
                v-for="item in dealInfo"
                :key="item.id"
              >
                <p>{{ item.recordingUserName }}</p>
                <p>{{ item.recordingDate }}</p>
                <p>{{ item.serviceMode ? `${getServiceMode(item.serviceMode)}：` : '' }}{{ item.recordingContent }}</p>
              </a-timeline-item>
            </a-timeline>
          </template>
          <template v-else>
            <a-empty :image="false" description="暂无办理日志"/>
          </template>
        </a-col>
      </div>
    </a-row>
  </div>
</template>

<script>
import { filterDictText } from '@/components/dict/JDictSelectUtil'


export default {
  name: 'HandleRecord',
  props: {
    feeTypeOption:{
      type: Array,
      default: ()=>[],
      required: false
    },
  },
  data() {
    return {
      loading: false,
      visible: false,
      dealInfo:[],
      recordType:{
        '0':'自行添加',
        '1':'企业微信',
        '2':'结算单-非扣税项'
      },
      serviceModeOption:this.GLOBAL_CONST['emergeServiceModeOption'], // 服务方式
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
            const resultText = text || '-'
            return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '是否垫付',
          align: 'center',
          dataIndex: 'advanceFlag',
          scopedSlots: { customRender: 'action' }
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
        }
      ],
      dataCompany:[],
      dataCustomer:[],
      dataSocial:[],
      dataInsurance:[],
      eventFeeDetail:{
        companyTotal:0,
        customerTotal:0,
        insuranceTotal:0,
        socialTotal:0,
        total:0
      },
      dealine:'',
      status:'',
    }
  },
  methods: {
    getRealVal(field,list){
      return list.eventFeeDetail ? (list.eventFeeDetail[field]||[]) : []
    },
    setDefaultVal(val){
      if(val){
        this.eventFeeDetail = {
          companyTotal:val.companyTotal||0,
          customerTotal:val.customerTotal||0,
          insuranceTotal:val.insuranceTotal||0,
          socialTotal:val.socialTotal||0,
          total:val.total||0
        }
      }
    },
    getServiceMode(val){
      const res = this.serviceModeOption.find(item=>String(item.value) === String(val))
      return res ? res.label : ''
    },
    show(record,list,payMainType){
      this.dealine = payMainType === 0 ? record.lastMaterialSubDate : record.lastInsuranceMaterialSubDate
      if(payMainType === 0){
        this.dealine = record.lastMaterialSubDate
      }else{
        this.dealine = record.lastInsuranceMaterialSubDate
      }
      this.dealInfo = list.dealInfo || []
      this.setDefaultVal(list.eventFeeDetail)

      this.dataCompany = this.getRealVal('companyBearList',list)
      this.dataCustomer = this.getRealVal('customerBearList',list)
      this.dataSocial = this.getRealVal('socialBearList',list)
      this.dataInsurance = this.getRealVal('insuranceBearList',list)
      this.visible = true
    },
    jumpOther(val,record){
      if(val == 0){
        this.$router.push({path:'/iweb/AdvancePaymentSearchList',query: {departNo: record.departCode, settleMoney:record.settleFormFee}})
        this.handleCancel()
      }
    },
    handleCancel(){
      this.$emit('ok')
      this.visible = false
      this.dealInfo = []
      this.dataCompany = []
      this.dataCustomer = []
      this.dataSocial = []
      this.dataInsurance = []
      this.dealine = ''
      this.status = ''
      this.eventFeeDetail = {
        companyTotal:0,
        customerTotal:0,
        insuranceTotal:0,
        socialTotal:0,
        total:0
      }
    },
  }


}
</script>

<style lang="less" scoped>
.dealine{
  font-weight: bold;
  margin-right: 15px;
}
.lineTitle{
  color: #000000d9;
  background-color: #f2f2f2;
  line-height: 41px;
  margin: 15px 0px 10px;
  padding-left: 10px;
}

.border{
  border: 1px solid #f2f2f2;
  overflow: hidden;
  padding:0px 10px 10px;
}
.handleEvent{
  color: #000000;
  border-bottom: 1px solid #f2f2f2;
  margin: 10px 0px 15px;
  padding-bottom: 7px;
}
.handleother{
  color: #000000;
  margin: 10px 0px 18px;
  font-size: 12px;
}
.timeLine{
  height: 200px;
  overflow-y: scroll;
  p{
    margin: 0px;
  }
}

.right {
  text-align: right;
  margin-bottom: 10px;
}
</style>