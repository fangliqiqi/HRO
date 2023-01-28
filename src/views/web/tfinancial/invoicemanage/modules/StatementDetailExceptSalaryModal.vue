<template>
  <a-modal
    :title="title"
    :width="1000"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    :forceRender="true"
  >
    <settle-for-salary-modal
      :type="settleFormType"
      ref="SettleForSalaryModalForm"
      :settleFormId="settleFormId"
    ></settle-for-salary-modal>
  </a-modal>
</template>
<script>
import SettleForSalaryModal from './SettleForSalaryModal'
import { httpAction } from '@/api/manage'

export default {
  components: {
    SettleForSalaryModal
  },
  data() {
    return {
      description: '工资类结算单以外的结算单详情', // 商险，预估单，一次性业务
      title:'操作',
      visible: false, // 控制显示
      settleFormType:'',
      settleFormId:'',
      // item:{
      //   settleFormType:'',
      //   settleFormId:''
      // }, // 请求结算单需要的参数id和类型
    }
  },
  methods: {
    show(item,settleDomainId) {
      // this.item = item
      this.settleFormType = item.settleFormType
      this.settleFormId = item.settleFormId
      this.visible = true
      httpAction(`hrBase/tsettledomain/vo/${settleDomainId}`,null,'get').then(res=>{
        if(res.code === 200){
          this.$nextTick(() => {
            this.$refs.SettleForSalaryModalForm.show(res.data)
          })
        }else{
          this.$message.warning(res.msg)
        }
      })

    },
    handleCancel() {
      this.visible = false
      this.settleFormType = this.settleFormId = ""
    }
  }
}
</script>
