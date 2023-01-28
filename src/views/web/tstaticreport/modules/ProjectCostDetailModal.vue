
<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="800"
    @ok="handleCancel"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-form :label-col="{span:8}" :wrapper-col="{ span:16}">
      <a-row>
        <a-col :span="12">
          <a-form-item
            label="报销单编号"
          >
            <span>{{ modelInfo.reimburseFormCode }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="申请人"
          >
            <span>{{ modelInfo.applyUserName }}</span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item
            label="申请日期"
          >
            <span>{{ modelInfo.applyDate }}</span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item
            label="结算主体名称"
          >
            <span>{{ modelInfo.settleDomainName }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="结算主体编码"
          >
            <span>{{ modelInfo.settleDomainCode }}</span>
          </a-form-item>
        </a-col>
      </a-row>    
    </a-form>
    <a-divider />
    <a-table :columns="columns" :data-source="dataSource" :pagination="false" rowKey="id" :scroll="{ y: 280 }">
      <template
        slot="settleFee"
        slot-scope="text,record">
        <span v-if="record.type==1||record.status=='0'">{{ text }}</span>
        <a v-else style="text-decoration:underline" @click="handlePage(record)">{{ text }}</a>
      </template>
    </a-table>
    
    <!-- 普通薪资的结算信息 -->
    <search-detail-modal
      ref="modalDetail"
      :formTypeOptions="formTypeOptions"
    ></search-detail-modal>
    <!-- 事务外包的结算信息 -->
    <settlement-document-detail-modal 
      ref="SettlementDocumentDetailForm" 
      :organAll="organAll">
    </settlement-document-detail-modal>
    <!-- 划转日志 -->
    <project-costransfer-modal 
      ref="ProjectCostransferFrom">
    </project-costransfer-modal>
    
  </a-modal>
</template>


<script>

import { httpAction } from '@/api/manage'
import { initDictOptions, } from '@/components/dict/JDictSelectUtil' 
import SearchDetailModal from '../../../salary/searchsalary/modules/SearchDetailModal'//普通薪资
import SettlementDocumentDetailModal from '../../tsettledomain/modules/SettlementDocumentDetailModal' //事务外包
import ProjectCostransferModal from './ProjectCostransferModal' //划转日志
export default {
  name: 'ProjectCostDetailModal',
  components: {
    SearchDetailModal,
    SettlementDocumentDetailModal,
    ProjectCostransferModal
  },
  data(){
    return {
      title: '',
      visible: false,
      confirmLoading: false,
      modelInfo:{},
      formTypeOptions:[],
      organAll:[],
      statusOptions:['未关联','结算中','已结算','划转完结'],
      columns:[
        {
          ellipsis: true,
          title: '结算月份',
          align: 'center',
          dataIndex: 'settleMonth',
          customRender: text => {
            const resText = text?text:'-'
            return <a-tooltip title={resText}>{resText}</a-tooltip>
          } 
        },
        {
          ellipsis: true,
          title: '结算金额',
          align: 'center',
          dataIndex: 'settleFee',
          scopedSlots: { customRender: 'settleFee' },
        },
        {
          ellipsis: true,
          title: '结算状态',
          align: 'center',
          dataIndex: 'status',
          customRender: text => {
            const res =this.statusOptions[text]
            return <a-tooltip title={res}>{res}</a-tooltip>
          } 
        },
      ],
      dataSource: []

    }
  },
  created(){
    //报表类型
    initDictOptions('form_type').then((res) => {
      if (res.code === 200) {
        this.formTypeOptions = res.data
      }
    })
    httpAction('/admin/organizationinfo/getOrgForCus?type=0','','GET').then((res) => {
      if(res.code === 200 && res.data.length > 0) {
        this.organAll = res.data
      }
    });
  },
  methods:{
    show(record){
      this.modelInfo = record
      httpAction(`/salary/tprojectreimbursedetail/getByParentId?parentId=${record.id}`,null,'get').then(res=>{
        this.visible = true
        const obj = {
          settleMonth:'合计',
          settleFee:0,
          status:'',
          type:1
        }
      
        if(res.code==200&&res.data.length>0){
            let newArr = []
            res.data.map(item=>{
              newArr.push(item.status)
              obj.settleFee+=item.settleFee
              item.settleMonth= this.modelInfo.feeType=='3'?item.settleMonth:item.installmentMonth
            })
            res.data.sort((a,b)=>{return a.settleMonth - b.settleMonth})
            obj.settleFee = obj.settleFee.toFixed(2)
            newArr = [...new Set(newArr)].sort()
            const status0 = newArr.find(item=>item=='0') //未关联
            const status1 = newArr.find(item=>item=='1') //结算中
            const status2 = newArr.find(item=>item=='2') //已完结
            const status3 = newArr.find(item=>item=='3') //划转完结
            if(newArr.length==1){
              obj.status = newArr[0]
            }else if(newArr.length==2&&status3){
              obj.status = newArr[0]
            }else if(newArr.length==2&&status0&&status2){
              obj.status = '1'
            }else if(newArr.length==3&&status0&&status2&&status3){
              obj.status = '1'
            }else if(newArr.length>1&&status1){
              obj.status = '1'
            }

            this.dataSource = record.feeTypeName=='增值服务费'?[obj]:[obj,...res.data]
        }
      })
    },
    handleCancel(){
      this.visible = false;
    },
    handlePage(record){
      if(record.status == '3'){
        const data= {
          id:record.sprId,
          feeTypeName:record.feeDesc
        }
        this.$refs.ProjectCostransferFrom.title = '划转日志'
        this.$refs.ProjectCostransferFrom.show(data,true)
      }else if(record.settleFormType == '0'){
        const data = {id:record.settleFormId}
        this.$refs.modalDetail.show(data,1)
      }else if(record.settleFormType == '1'){
        // record.settleFormId = '1476073838291763201'
        httpAction(`/hrOneTime/tnewsettle/getTNewSettleVoByFormId?billId=${record.settleFormId}`,null,'post').then(res=>{
          if(res.code === 200){
            const type = res.data.bill.wxNo ? 1 : 0
            this.$refs.SettlementDocumentDetailForm.show(type,res.data,1)
          }else{
            this.$message.warning(res.msg)
          }
        })
      }
      // 
      
    }
  }

}
</script>
<style lang="less" scoped>
.oprate{
  margin-bottom: 15px;
  color: #333;
  span{
    margin-right: 100px;
  }
}
</style>
