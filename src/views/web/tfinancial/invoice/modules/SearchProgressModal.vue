<template>
  <div>
    <a-card
      v-if="current == 0 || current == 1"
      title="| 上传表单详情"
      :headStyle="{color:'#1890ff'}"
    >
      <a-steps :current="current">
        <a-step title="待提交">

        </a-step>
        <a-step title="待审核">
        </a-step>
        <a-step title="待发放"></a-step>
        <a-step title="已发放"></a-step>
      </a-steps>
    </a-card>
    <a-card
      v-if="current == 3"
      title="| 上传表单详情"
      :headStyle="{color:'#1890ff'}"
    >
      <a-steps :current="1">
        <a-step title="待提交"></a-step>
        <a-step
          title="审核通过"
          :description="salaryStandardInfo.remark"
        >
        </a-step>
        <a-step title="待发放"></a-step>
        <a-step title="已发放"></a-step>
      </a-steps>
    </a-card>
    <a-card
      v-if="current == 4"
      title="| 上传表单详情"
      :headStyle="{color:'#1890ff'}"
    >
      <a-steps :current="3">
        <a-step title="待提交"></a-step>
        <a-step title="审核通过">
        </a-step>
        <a-step title="待发放"></a-step>
        <a-step
          title="已发放"
          :description="salaryStandardInfo.remark"
        ></a-step>
      </a-steps>
    </a-card>
    <a-card
      v-if="current == 5"
      title="| 上传表单详情"
      :headStyle="{color:'#1890ff'}"
    >
      <a-steps :current="2">
        <a-step title="待提交">

        </a-step>
        <a-step title="待审核">
        </a-step>
        <a-step
          title="审核不通过"
          status="error"
          :description="salaryStandardInfo.remark"
        ></a-step>
        <a-step title="财务退回"></a-step>
      </a-steps>
    </a-card>
    <a-card
      v-if="current == 7"
      title="| 上传表单详情"
      :headStyle="{color:'#1890ff'}"
    >
      <a-steps :current="3">
        <a-step title="待提交">

        </a-step>
        <a-step title="待审核">
        </a-step>
        <a-step title="审核通过"></a-step>
        <a-step
          title="财务退回"
          status="error"
          :description="salaryStandardInfo.remark"
        ></a-step>
      </a-steps>
    </a-card>
    <a-card
      title="| 表单详情"
      :headStyle="{color:'#1890ff'}"
      style="margin-top:20px"
    >
      <a-row>
        <a-form>
          <a-col
            :span="10"
            :offset="3"
          >
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="结算金额"
            >
              <span>{{ salaryStandardInfo.settlementAmount }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="款项来源"
            >
              <span>{{ moneyFrom }}</span>
            </a-form-item>
          </a-col>
        </a-form>
      </a-row>
      <a-row>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注"
        >
          <span>{{ salaryStandardInfo.remark }}</span>
        </a-form-item>
      </a-row>
      <a-row align="bottom">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注2"
        >
          <span v-html="salaryStandardInfo.excelRemark"></span>
        </a-form-item>
        <!-- <a-col
          :span="12"
          style="text-align:left"
        >
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="备注2"
          >
            <span v-html="salaryStandardInfo.excelRemark"></span>
          </a-form-item>
        </a-col> -->
      </a-row>
    </a-card>
  </div>
</template>
<script>
export default {
  name:'SearchProgressModal',
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
      salaryStandardInfo: {
        type:Object,
        required:true
      }
    },
  methods:{
    show() {
      this.current = this.salaryStandardInfo.status
      if(this.salaryStandardInfo.moneyFrom == 0){
        this.moneyFrom = '客户到款'
      }
      if(this.salaryStandardInfo.moneyFrom == 1){
        this.moneyFrom = '垫付'
      }
    }
  }
}
</script>
