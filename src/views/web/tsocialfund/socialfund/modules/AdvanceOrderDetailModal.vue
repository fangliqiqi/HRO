<template>
  <a-modal
    :title="title"
    :width="1200"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :bodyStyle="{height:'500px',overflowY: 'scroll',padding:'18px'}"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
    </template>
    <div v-if="isDispatchAdd" class="configInfoWrap">
      <detail-list :col="3">
        <detail-list-item term="id">{{ detailInfo.id || '-' }}</detail-list-item>
        <detail-list-item term="日期"> {{ detailInfo.date || '-' }} </detail-list-item>
        <detail-list-item term="接单分公司"> {{ detailInfo.company || '-' }} </detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="缴费地"> {{ detailInfo.payAddress || '-' }} </detail-list-item>
        <detail-list-item term="客户名称"> {{ detailInfo.customerName || '-' }} </detail-list-item>
        <detail-list-item term="员工姓名">{{ detailInfo.empName || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="身份证号"> {{ detailInfo.empIdcard || '-' }} </detail-list-item>
        <detail-list-item term="联系电话1"> {{ detailInfo.telOne || '-' }} </detail-list-item>
        <detail-list-item term="联系电话2">{{ detailInfo.telTwo || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="入职日期"> {{ detailInfo.entryDate || '-' }} </detail-list-item>
        <detail-list-item term="正式工资">{{ detailInfo.formalSalary || '-' }}</detail-list-item>
        <detail-list-item term="派遣开始日期">{{ detailInfo.dispatchStart || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="派遣结束日期">{{ detailInfo.dispatchEnd || '-' }}</detail-list-item>
        <detail-list-item term="合同开始日期">{{ detailInfo.contractStart || '-' }}</detail-list-item>
        <detail-list-item term="合同终止日期">{{ detailInfo.contractEnd || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="试用开始日期">{{ detailInfo.trialStart || '-' }}</detail-list-item>
        <detail-list-item term="试用结束日期">{{ detailInfo.trialEnd || '-' }}</detail-list-item>
        <detail-list-item term="试用期工资">{{ detailInfo.trialSalary || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="工作制">{{ detailInfo.workingSystem || '-' }}</detail-list-item>
        <detail-list-item term="合同版本">{{ detailInfo.contractVersion || '-' }}</detail-list-item>
        <detail-list-item term="是否电话通知">{{ detailInfo.telNotice || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="实际工作地">{{ detailInfo.workingAddress || '-' }}</detail-list-item>
        <detail-list-item term="备注说明1">{{ detailInfo.remarkOne || '-' }}</detail-list-item>
        <detail-list-item term="备注说明2">{{ detailInfo.remarkTwo || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="养老城市"> {{ detailInfo.pensionAddress || '-' }} </detail-list-item>
        <detail-list-item term="养老基数"> {{ detailInfo.pensionBase || '-' }} </detail-list-item>
        <detail-list-item term="养老起缴月">{{ detailInfo.pensionStart || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="医疗城市">{{ detailInfo.medicalAddress || '-' }}</detail-list-item>
        <detail-list-item term="医疗基数"> {{ detailInfo.medicalBase || '-' }} </detail-list-item>
        <detail-list-item term="医疗起缴月">{{ detailInfo.medicalStart || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="工伤城市">{{ detailInfo.injuryAddress || '-' }}</detail-list-item>
        <detail-list-item term="工伤基数"> {{ detailInfo.injuryBase || '-' }} </detail-list-item>
        <detail-list-item term="工伤起缴月">{{ detailInfo.injuryStart || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="生育城市"> {{ detailInfo.birthAddress || '-' }} </detail-list-item>
        <detail-list-item term="生育基数"> {{ detailInfo.birthBase || '-' }} </detail-list-item>
        <detail-list-item term="生育起缴月">{{ detailInfo.birthStart || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="失业城市">{{ detailInfo.unemploymentAddress || '-' }}</detail-list-item>
        <detail-list-item term="失业基数"> {{ detailInfo.unemploymentBase || '-' }} </detail-list-item>
        <detail-list-item term="失业起缴月">{{ detailInfo.unemploymentStart || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="公积金城市">{{ detailInfo.fundAddress || '-' }}</detail-list-item>
        <detail-list-item term="公积金基数">{{ detailInfo.fundBase || '-' }}</detail-list-item>
        <detail-list-item term="公积金个人比例">{{ detailInfo.fundPersonalPer || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="公积金企业比例">{{ detailInfo.fundCompanyPer || '-' }}</detail-list-item>
        <detail-list-item term="公积金起缴月">{{ detailInfo.fundStart || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="派单分公司"> {{ detailInfo.dispatchCompany || '-' }} </detail-list-item>
        <detail-list-item term="派单客服">{{ detailInfo.customerService || '-' }}</detail-list-item>
        <detail-list-item term="小合同名称">{{ detailInfo.contractMinorName || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="唯一号">{{ detailInfo.uniqueNumber || '-' }}</detail-list-item>
        <detail-list-item term="客户编号">{{ detailInfo.customerNumber || '-' }}</detail-list-item>
        <detail-list-item term="服务类别">{{ detailInfo.serviceType || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="合同类型">{{ detailInfo.contractType || '-' }}</detail-list-item>
        <detail-list-item term="导入时间"> {{ detailInfo.createTime || '-' }} </detail-list-item>
        <detail-list-item term="导入人"> {{ detailInfo.createUserName || '-' }} </detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="资料是否提交">{{ String(detailInfo.dataSubStatus) === '0'?'是':'否' }}</detail-list-item>
        <detail-list-item term="单据类型">{{ statusType[String(detailInfo.type)] || '-' }}</detail-list-item>
        <detail-list-item term="单据状态">{{ detailInfo.preStatus?(statusOptons[String(detailInfo.preStatus)].option || '-'):'-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="备注">{{ detailInfo.remark || '-' }}</detail-list-item>
        <detail-list-item term="取消原因">{{ detailInfo.cancelRemark || '-' }}</detail-list-item>
      </detail-list>
    </div>

    <div v-else class="configInfoWrap">
      <detail-list :col="3">
        <detail-list-item term="id">{{ detailInfo.id || '-' }}</detail-list-item>
        <detail-list-item term="日期"> {{ detailInfo.date || '-' }} </detail-list-item>
        <detail-list-item term="接单分公司"> {{ detailInfo.company || '-' }} </detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="缴费地"> {{ detailInfo.payAddress || '-' }} </detail-list-item>
        <detail-list-item term="客户名称"> {{ detailInfo.customerName || '-' }} </detail-list-item>
        <detail-list-item term="员工姓名">{{ detailInfo.empName || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="身份证号"> {{ detailInfo.empIdcard || '-' }} </detail-list-item>
        <detail-list-item term="离职日期"> {{ detailInfo.leaveDate || '-' }} </detail-list-item>
        <detail-list-item term="离职原因">{{ detailInfo.leaveReason || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="联系电话1"> {{ detailInfo.telOne || '-' }} </detail-list-item>
        <detail-list-item term="联系电话2">{{ detailInfo.telTwo || '-' }}</detail-list-item>
        <detail-list-item term="备注说明1"> {{ detailInfo.remarkOne || '-' }} </detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="养老截止城市"> {{ detailInfo.pensionAddressReduce || '-' }} </detail-list-item>
        <detail-list-item term="养老截止时间">{{ detailInfo.pensionEndReduce || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="医疗截止城市"> {{ detailInfo.medicalAddressReduce || '-' }} </detail-list-item>
        <detail-list-item term="医疗截止时间"> {{ detailInfo.medicalEndReduce || '-' }} </detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="工伤截止城市">{{ detailInfo.injuryAddressReduce || '-' }}</detail-list-item>
        <detail-list-item term="工伤截止时间"> {{ detailInfo.injuryEndReduce || '-' }} </detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="生育截止城市">{{ detailInfo.birthAddressReduce || '-' }}</detail-list-item>
        <detail-list-item term="生育截止时间"> {{ detailInfo.birthEndReduce || '-' }} </detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="失业截止城市"> {{ detailInfo.unemploymentAddressReduce || '-' }} </detail-list-item>
        <detail-list-item term="失业截止时间">{{ detailInfo.unemploymentEndReduce || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="公积金截止城市"> {{ detailInfo.fundAddressReduce || '-' }} </detail-list-item>
        <detail-list-item term="公积金截止时间"> {{ detailInfo.fundEndReduce || '-' }} </detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="派单分公司">{{ detailInfo.dispatchCompany || '-' }}</detail-list-item>
        <detail-list-item term="派单客服"> {{ detailInfo.customerService || '-' }} </detail-list-item>
        <detail-list-item term="小合同名称"> {{ detailInfo.contractMinorName || '-' }} </detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="合同类型">{{ detailInfo.contractType || '-' }}</detail-list-item>
        <detail-list-item term="导入时间"> {{ detailInfo.createTime || '-' }} </detail-list-item>
        <detail-list-item term="导入人"> {{ detailInfo.createUserName || '-' }} </detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="资料是否提交">{{ String(detailInfo.dataSubStatus) === '0'?'是':'否' }}</detail-list-item>
        <detail-list-item term="单据类型">{{ statusType[String(detailInfo.type)] || '-' }}</detail-list-item>
        <detail-list-item term="单据状态">{{ statusOptons[String(detailInfo.preStatus)].option || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="备注">{{ detailInfo.remark || '-' }}</detail-list-item>
        <detail-list-item term="取消原因">{{ detailInfo.cancelRemark || '-' }}</detail-list-item>
      </detail-list>
    </div>
    <a-divider orientation="left">合同信息</a-divider>
    <div class="configInfoWrap">
      <detail-list :col="3">
        <detail-list-item term="合同类型">{{ filterDictText(contractTypeOptions, detailInfo.contractTypeAdd) }}</detail-list-item>
        <detail-list-item term="合同名称"> {{ detailInfo.contractNameAdd || '-' }} </detail-list-item>
        <detail-list-item term="合同期限"> {{ detailInfo.contractTermAdd || '-' }} </detail-list-item>
      </detail-list>
      <detail-list :col="3">
        <detail-list-item term="合同开始时间"> {{ detailInfo.contractStartAdd || '-' }} </detail-list-item>
        <detail-list-item term="合同截止时间"> {{ detailInfo.contractEndAdd || '-' }} </detail-list-item>
      </detail-list>
    </div>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tools/DetailList'
import { filterDictText } from '@/components/dict/JDictSelectUtil'

const DetailListItem = DetailList.Item
export default {
  components:{
    DetailList,
    DetailListItem
  },
  data(){
    return{
      title: '详情',
      visible: false,
      detailInfo:{}, // 详情数据
      isDispatchAdd: true, // 区分是派增还是派减，默认派增
      contractTypeOptions:[], // 员工合同类型
      statusOptons: {
        '0': { option: '正常未派单', color: 'blue' },
        '1': { option: '异常未派单', color: 'orange' },
        '2': { option: '已派单', color: 'purple' }
      }, // 派单状态
      statusType:{ '0': '派增', '1': '派减' }, // 单据类型
    }
  },
  methods:{
    filterDictText,
    // 显示
    show(data){
      this.detailInfo = data.preDispatchInfo || {}
      // 判断是派增还是派减type	派单类型:0 派增 1 派减
      if(Number(this.detailInfo.type) === 1){
        this.isDispatchAdd = false
        this.title = '派减-详情'
      }else {
        this.isDispatchAdd = true
        this.title = '派增-详情'
      }
      this.visible = true
    },
    // 取消、关闭
    handleCancel(){
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 125px;
  }
}
.configInfoWrap {
  border: 1px dashed #e9e9e9;
  padding: 10px 15px;
  background: #fefefe;
}
</style>
