<template>
  <div>
    <!--
      <a-card
      v-if="current < 4"
      title="| 上传表单详情"
      :headStyle="{color:'#1890ff'}"
    >
      <a-steps :current="1">
        <a-step title="待提交">

        </a-step>
        <a-step
          title="待审核"
          :description="salaryStandardInfo.remark"
        >
        </a-step>
        <a-step title="待发放"></a-step>
        <a-step title="已发放"></a-step>
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
          <a-col>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="结算金额"
            >
              <span>{{ salaryStandardInfo.settlementAmount }}</span>
            </a-form-item>
          </a-col>
          <!-- <a-col>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="开票金额明细"
            >
              <span>1111</span>
            </a-form-item>
          </a-col> -->

          <a-col>
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
          label="附件(可预览)"
          v-if="subject.isNeedUpload == 1"
        >
          <div id="attachment-list">
            <ul class="attach">
              <li>
                <div class="title">三方协议</div>
                <div>
                  <a-upload
                    :defaultFileList="attaList['0']"
                    :showUploadList="{showRemoveIcon:false}"
                  ></a-upload>
                </div>
              </li>
              <li>
                <div class="title">委托付款函</div>
                <div>
                  <a-upload
                    :defaultFileList="attaList['1']"
                    :showUploadList="{showRemoveIcon:false}"
                  ></a-upload>
                </div>
              </li>
              <li>
                <div class="title">劳务费</div>
                <div>
                  <a-upload
                    :defaultFileList="attaList['2']"
                    :showUploadList="{showRemoveIcon:false}"
                  ></a-upload>
                </div>
              </li>
              <li>
                <div class="title">其他证明材料</div>
                <div>
                  <a-upload
                    :defaultFileList="attaList['3']"
                    :showUploadList="{showRemoveIcon:false}"
                  ></a-upload>
                </div>
              </li>
            </ul>
            <!-- <div
              v-for="(file,index) in fileList"
              :key="index"
            >
              <a-tag
                v-if="file.uid"
                @click="previewFile(file.uid)"
                style="margin-bottom: 10px"
                color="#108ee9"
              > {{ file.typeName }}【已上传】</a-tag>
              <a-tag
                v-else
                style="margin-bottom: 10px"
                color="orange"
              > {{ file.typeName }}【未上传】</a-tag>
            </div> -->
          </div>
        </a-form-item>

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
import { httpAction } from '@/api/manage'
export default {
  name:'EngineAuditProgressModal',
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
      fileList:[],
      fileType:['三方协议','委托付款函','劳务费'],
      tagColor:'#108ee9',
      preViewUlr:'/salary/tsalaryatta/ossFileUrl/',//附件预览
      moneyFrom:'',
      current:0,
      auditLogArr:[]
    }
  },
  props: {
    salaryStandardInfo: {
      type:Object,
      required:true
    },
    subject:{
      type:Object,
      default:null
    },
    attaList:{
      type:Object,
      default:null
    },
    auditLogList:{
        type:Array,
        required:true
     },
  },
  methods: {
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

    },
    previewFile(uid){
      httpAction(this.preViewUlr+uid,{},'GET').then((res)=>{
        if(Number(res.code) === 200){
          window.open(res.data.attaUrl)
        }
      })
    },
  },
}
</script>
<style>
#attachment-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 200px;
}
.attach li{
  list-style: none;
  display: flex;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.attach li .title{
  font-weight: bold;
  width:100px;
}
</style>
<style lang="less" scoped>
   /deep/ .ant-steps-horizontal:not(.ant-steps-label-vertical) .ant-steps-item-description{
     max-width: 230px;
    }
  </style>