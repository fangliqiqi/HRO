<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    cancelText="关闭"
  >
    <a-tabs default-active-key="1">
      <a-tab-pane
        key="1"
        tab="流程记录"
      >
        <a-timeline class="statusStep" v-if="recordList.length">
          <a-timeline-item
            v-for="(item,index) in recordList"
            :key="index"
            :color="color[item.auditStatus]"
          >
            <p><strong>{{ item.nodeName }}</strong></p>
            <p>状态：{{ status[item.auditStatus] }}</p>
            <p>操作人：{{ item.auditUser }}&nbsp;&nbsp;&nbsp;审核意见：{{ item.auditRemark }}</p>
            <p>操作时间：{{ item.auditTime }}</p>
            <a-divider dashed/>
          </a-timeline-item>
        </a-timeline>
        <a-empty :description="'暂无流程记录'" v-else/>
      </a-tab-pane>
      <a-tab-pane
        key="2"
        tab="抄送记录"
        v-if="copyInfo.length"
      >
        <a-timeline class="statusStep">
          <a-timeline-item
            v-for="(item,index) in copyInfo"
            :key="index"
          >
            <p>抄送人：{{ item.auditUser }}</p>
            <p>抄送时间：{{ item.createTime }}</p>
            <a-divider dashed/>
          </a-timeline-item>
        </a-timeline>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'ProcessAuditModule',
  data() {
    return {
      title: '审批流程抄送记录',
      visible: false,
      confirmLoading: false,
      status:['提交审核','审核通过','审核不通过','待审核'],
      color:['blue','green','red','#fa8c16'],
      recordList:[],
      copyInfo:[]
    }
  },
  methods: {
    show(id,oldProcesFlag) {
      this.visible = true
      if(String(oldProcesFlag) === '2' || String(oldProcesFlag) === '3'){ //新流程
        httpAction(`/hrApproval/tapproveauditinfo/getNewAllAuditInfo/${id}`,null,'get').then((res)=>{
          if(res.code === 200){
            this.recordList = res.data.auditInfo
            //抄送人
            this.copyInfo = res.data.copyInfo
          }else{
            this.$message.warning(res.msg)
          }
        })
      }else if(String(oldProcesFlag) === '1'){
        httpAction(`/hrApproval/tapproveauditinfo/getAllAuditInfo/${id}`,null,'get').then((res)=>{
          if(res.code === 200){
            this.recordList = res.data
          }else{
            this.$message.warning(res.msg)
          }
        })
      }
    },
    handleCancel() {
      this.close();
    },
    close() {
      this.$emit('close')
      this.recordList = this.copyInfo = []
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
p {
  margin: 0px;
}
.statusStep {
  :global(.ant-timeline-item) {
    padding:0;
  }
}
.ant-divider{
  margin: 10px 0;
}

</style>