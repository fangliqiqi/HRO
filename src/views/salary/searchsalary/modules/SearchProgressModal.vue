<template>
  <div>
    <!--
      <a-card
      v-if="current == 0 || current == 1"
      title="| 上传表单详情"
      :headStyle="{color:'#1890ff'}"
    >
      <a-steps :current="current">
        <a-step title="提交">

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
    -->
    <a-card
      title="| 上传表单详情"
      :headStyle="{color:'#1890ff'}"
    >
      <a-steps :current="current">
        <a-step v-for="(item,index) in auditLogArr" :key="index" :status="item.auditStatus">
          <template slot="title">
            {{ item.title }}
          </template>
          <div slot="description" v-if="auditLogList.length>0&&item.auditUser">
            <p>操作人：{{ item.auditUser }}</p>
            <p>操作时间：{{ item.auditTime }}</p>
            <p>审批说明：{{ item.remark }}</p>
          </div>
        </a-step>
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
            :span="24"
          >
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="结算金额"
            >
              <span>{{ salaryStandardInfo.settlementAmount }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="24">
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
          <span>{{ salaryStandardInfo.submitRemark }}</span>
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
      </a-row>
      <a-row>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="薪资原表"
        >
          <a-upload
            :fileList="fileList"
            :showUploadList="{showRemoveIcon:false}"
          >
          </a-upload>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="证明材料"
        >
          <a-upload
            :fileList="attaList"
            :showUploadList="{showRemoveIcon:false}"
          >
          </a-upload>
        </a-form-item>
      </a-row>
    </a-card>
  </div>
</template>
<script>
export default {
  name:'SearchProgressModal',
  data() {
    return {
      moneyFrom:'',
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      }, 
      current:0,
      auditLogArr:[]
    }
  },
  props: {
      salaryStandardInfo: {
        type:Object,
        required:true
      },
      auditLogList:{
        type:Array,
        required:true
      },
      attaList:{
        type:Array,
        required:true
      },
      fileList:{
        type:Array,
        required:true
      }
    },
  methods:{
    show() {
      // this.current = this.salaryStandardInfo.status
      if(this.salaryStandardInfo.moneyFrom == 0){
        this.moneyFrom = '客户到款'
      }
      if(this.salaryStandardInfo.moneyFrom == 1){
        this.moneyFrom = '垫付'
      }
      this.auditLogArr = [
            {title:'待提交'},
            {title:'待审核'},
            {title:'待发放'}
        ]
      if(this.auditLogList.length==0){
        this.current  = this.salaryStandardInfo.status
        switch(String(this.current)){
            case '0':
              this.auditLogArr[0].auditStatus = 'process'
              break;
            case '1':
              this.auditLogArr[1].auditStatus = 'process'
              break;
            case '3':
              this.auditLogArr[2].auditStatus = 'process'
              break;
            case '4':
              this.auditLogArr[2].auditStatus = 'finish'
              this.auditLogArr[2].title = '已发放'
              break;
            case '5':
              this.auditLogArr[1].auditStatus = 'error'
              this.auditLogArr[2].auditStatus = 'wait'
              this.auditLogArr[1].title = '审核未通过'
              break;
            case '7':
              this.auditLogArr[2].auditStatus = 'error'
              this.auditLogArr[2].title = '财务退回'
              break;
          }
      }else{
        this.auditLogList.map((item)=>{
          switch(item.step){
            case '0':
              this.auditLogArr[0].auditUser = item.auditUser
              this.auditLogArr[0].auditTime = item.auditTime
              this.auditLogArr[0].remark = item.remark || "无"
              this.auditLogArr[0].auditStatus = item.auditStatus=='1'?'error':'finish'
              this.auditLogArr[0].title = item.auditStatus=='1'?'待提交':'已提交'
              break;
            case '2':
              this.auditLogArr[1].auditUser = item.auditUser
              this.auditLogArr[1].auditTime = item.auditTime
              this.auditLogArr[1].remark = item.remark || "无"
              this.auditLogArr[1].auditStatus = item.auditStatus=='1'?'error':'finish'
              this.auditLogArr[1].title = item.auditStatus=='1'?'审核未通过':'审核通过'
              this.auditLogArr[2].auditStatus = 'wait'
              break;
            case '3':
              this.auditLogArr[2].auditUser = item.auditUser
              this.auditLogArr[2].auditTime = item.auditTime
              this.auditLogArr[2].remark = item.remark || "无"
              this.auditLogArr[2].auditStatus = item.auditStatus=='1'?'error':'finish'
              this.auditLogArr[2].title = item.auditStatus=='1'?'发放退回':'已发放'
              break;
          }
          return this.auditLogArr
        })
      }
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="less" scoped>
   /deep/ .ant-steps-horizontal:not(.ant-steps-label-vertical) .ant-steps-item-description{
     max-width: 230px;
    }
  </style>
