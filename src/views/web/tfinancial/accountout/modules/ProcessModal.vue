<template>
  <div>
    <a-card
      title="| 上传表单详情"
      :headStyle="{color:'#1890ff'}"
    >
      <a-steps :current="current">
        <a-step
          v-for="(item,index) in auditLogArr"
          :key="index"
          :status="item.status"
        >
          <template slot="title">
            {{ item.title }}
          </template>
          <div
            slot="description"
            v-if="item.show"
          >
            <p>{{ index == 1 ? '审核人：' : '出账人：' }}{{ item.auditUser }}</p>
            <p>{{ index == 1 ? '审核时间：' : '出账时间：' }}{{ item.auditDate }}</p>
            <p>{{ index == 1 ? '审核说明：' : '出账说明：' }}{{ item.auditRemark }}</p>
          </div>
        </a-step>
      </a-steps>
    </a-card>

    <a-card
      title="| 表单详情"
      :headStyle="{color:'#1890ff'}"
      style="margin-top:20px"
    >
      <a-form>
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
        <a-row>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="无发票说明"
          >
            {{ salaryStandardInfo.diyNoAttaRemark }}
          </a-form-item>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>
<script>
export default {
  name:'PauseProgress',
  data() {
    return {
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
    userList:{
      type:Object,
      required:true
    },
    attaList:{
      type:Array,
      required:true
    },
  },
    
  methods:{
    show(){
      //  0: 待发放 1: 已发放 2：发放失败；3：待审核；4：审核退回
      switch(String(this.salaryStandardInfo.chargeStatus)){
        case '0':
          this.current = 0;
          this.auditLogArr = [
            {title:'已提交',status:'finish',show:false},
            {title:'审核通过',status:'finish',show:true,
              auditUser:this.salaryStandardInfo.auditUser ? this.userList[this.salaryStandardInfo.auditUser] : '',
              auditDate:this.salaryStandardInfo.auditDate,
              auditRemark:this.salaryStandardInfo.auditRemark,
            },
            {title:'待发放',status:'process',show:false}
          ];
          break;
        case '1':
          this.current = 2;
          this.auditLogArr = [
            {title:'已提交',status:'finish',show:false},
            {title:'审核通过',status:'finish',show:true,
              auditUser:this.salaryStandardInfo.auditUser ? this.userList[this.salaryStandardInfo.auditUser] : '',
              auditDate:this.salaryStandardInfo.auditDate,
              auditRemark:this.salaryStandardInfo.auditRemark,
            },
            {title:'已发放',status:'finish',show:true,
              auditUser:this.salaryStandardInfo.revenueUser ? this.userList[this.salaryStandardInfo.revenueUser] : '',
              auditDate:this.salaryStandardInfo.revenueDate,
              auditRemark:this.salaryStandardInfo.revenueRemark,
            }
          ];
          break;
        case '2':
          this.current = 1;
          this.auditLogArr = [
            {title:'已提交',status:'finish',show:false},
            {title:'审核通过',status:'finish',show:true,
              auditUser:this.salaryStandardInfo.auditUser ? this.userList[this.salaryStandardInfo.auditUser] : '',
              auditDate:this.salaryStandardInfo.auditDate,
              auditRemark:this.salaryStandardInfo.auditRemark,
            },
            {title:'发放失败',status:'error',show:true,
              auditUser:this.salaryStandardInfo.revenueUser ? this.userList[this.salaryStandardInfo.revenueUser] : '',
              auditDate:this.salaryStandardInfo.revenueDate,
              auditRemark:this.salaryStandardInfo.revenueRemark,
            },
          ];
          break;
        case '3':
          this.current = 1;
          this.auditLogArr = [
            {title:'已提交',status:'finish',show:false},
            {title:'待审核',status:'process',show:false},
            {title:'待发放',status:'wait',show:false}
          ];
          break;
        case '4':
          this.current = 1;
          this.auditLogArr = [
            {title:'已提交',status:'finish',show:false},
            {title:'审核不通过',status:'error',show:true,
              auditUser:this.salaryStandardInfo.auditUser ? this.userList[this.salaryStandardInfo.auditUser] : '',
              auditDate:this.salaryStandardInfo.auditDate,
              auditRemark:this.salaryStandardInfo.auditRemark,
            },
            {title:'待发放',status:'wait',show:false}
          ];
          break;
        
        default:
          this.auditLogArr = [
            {title:'已提交',status:'finish',show:false},
            {title:'待审核',status:'process',show:false},
            {title:'待发放',status:'process',show:false}
          ];
      }
      
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-steps-horizontal:not(.ant-steps-label-vertical) .ant-steps-item-description {
  max-width: 230px;
  margin-left: -36px;
  margin-top: 10px;
  p{
    margin-bottom: 0px;
  }
}
</style>
