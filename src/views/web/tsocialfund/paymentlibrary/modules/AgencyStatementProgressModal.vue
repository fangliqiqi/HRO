<template>
  <div>
    <a-card
      v-if="current < 3"
      title="| 审核流程"
      :headStyle="{color:'#1890ff'}"
    >
      <a-steps :current="current">
        <a-step title="待提交">
        </a-step>
        <a-step title="待审核">
        </a-step>
        <a-step
          title="通过"
          :description="current == '2' ? agentInfo.auditRemark : ''"
        ></a-step>
      </a-steps>
    </a-card>
    <a-card
      v-if="current > 2"
      title="| 上传表单详情"
      :headStyle="{color:'#1890ff'}"
    >
      <a-steps :current="current">
        <a-step title="待提交">

        </a-step>
        <a-step title="待审核">
        </a-step>
        <a-step
          title="不通过"
          status="error"
          :description="current == '3' ? agentInfo.auditRemark : ''"
        ></a-step>
      </a-steps>
    </a-card>
  </div>
</template>
<script>
export default {
  name:'AgencyStatementProgressModal',
  data() {
    return {
      current:0,
      moneyFrom:'',
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      }, 
    }
  },
  props: {
      agentInfo: {
        type:Object,
        required:true
      }
    },
  methods:{
    // 表单tab展示
    show(){
      this.current = this.agentInfo.status
      
    }
  }
}
</script>
