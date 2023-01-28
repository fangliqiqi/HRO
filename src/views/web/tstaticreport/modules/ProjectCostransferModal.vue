
<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="800"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-form layout="horizontal" class="ant-advanced-search-form" v-if="isDetail">
        <a-row>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="操作人"
            >
              <div style="text-align:left">{{ modelForm.operatorUser }}</div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="操作时间"
            >
              <div style="text-align:left">{{ modelForm.operatorTime }}</div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>  
      <div v-else>
        <a-button @click.stop="handleCancel">取消</a-button>
        <a-button type="primary" @click.stop="handleOk">确定</a-button>
      </div>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="horizontal"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="报销单编号"
            >
              <span>{{ modelForm.reimburseFormCode }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="申请人"
            >
              <span>{{ modelForm.applyUserName || modelForm.applyUser }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="申请日期"
            >
              <span>{{ modelForm.applyDate || modelForm.applyTime	}}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="结算主体名称"
            >
              <span>{{ modelForm.settleDomainName || modelForm.departName }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="结算主体编码"
            >
              <span>{{ modelForm.settleDomainCode || modelForm.departNo }}</span>
            </a-form-item>
          </a-col>
        </a-row>    
        <a-divider />
        <a-row>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="feeTypeName"
            >
              {{ totalMoney.toFixed(2) }}
              <a-button type="primary" style="margin-left: 30px;" @click="showDetail">固资明细</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="划至结算主体名称"
            >
              <span v-if="isDetail">{{ modelForm.transferDepartName }}</span>
              <select-page
                v-else
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :placeholder="'请输入结算主体'"
                v-decorator="['transferDepartName', {rules: [{ required: true, message: '请输入结算主体!' }]} ]"
                :id="'departName'"
                :allowClear="false"
                :triggerChange="true"
                @change="settleChange"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="划转后结算首月"
            >
              <span v-if="isDetail">{{ modelForm.transferMonthStart }}</span>
              <a-month-picker
                v-else
                :disabledDate="disabledDate"
                format="YYYYMM"
                placeholder="请选择结算首月"
                @change="onChange"
                v-decorator="['transferMonthStart',{rules: [{ required: true, message: '请选择结算首月!' }]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="划转原因"
              class="labTxt"
            >
              <span v-if="isDetail">{{ modelForm.transferReason }}</span>
              <a-textarea
                v-else
                rows="4"
                style="resize:none;width:560px;"
                placeholder="请输入划转原因"
                v-decorator="['transferReason',{rules: [{ required: true, message: '请输入划转原因!' },{max:200,message:'划转原因最多200个字符!'}] }]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <assets-list-modal ref="AssetsListForm"></assets-list-modal>
  </a-modal>
</template>


<script>
import SelectPage from '@/components/jeecg/SelectPage'
import AssetsListModal from './AssetslistModal'
import { httpAction } from '@/api/manage'
import moment from 'moment'

export default {
  name: 'ProjectCostransferModal',//固资划转
  components: {
    SelectPage,
    AssetsListModal
  },
  data(){
    return {
      title: '固资划转',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      modelForm:{},
      isDetail:false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      url:'/salary/tstatisticsprojectreimburse/batchTransferByIds',
      transferDepartCode:'',
      transferMonthStart:'',
      totalMoney:0,//总金额
      assetsList:[],//固资明细
      id:'',
      feeTypeName:'',
    }
  },
  methods:{
    async show(record,boo){
      console.log(record);
      this.id = record.id
      this.feeTypeName ='未关联-'+ record.feeTypeName
      // 详情
      if(boo){
        const detailForm = await httpAction(`/salary/treimbursetransferrecord/getByDetailId?detailId=${record.id}`,null,'get')
        const assetsForm = await httpAction(`/salary/tprojectreimbursedetail/getTransferedDetailByParentIds?parentIds=${record.id}`,null,'get')
        if(detailForm.code==200){
          this.modelForm = detailForm.data[0]
          this.visible = true
          this.isDetail = true
        }else{
          this.$message.warning(detailForm.msg)
        }
        if(assetsForm.code==200){
          assetsForm.data&&assetsForm.data.map(item=>{
            this.totalMoney += item.settleFee
            this.assetsList = assetsForm.data
          })
        }else{
          this.$message.warning(assetsForm.msg)
        }
      }else{
        const assetsForm = await httpAction(`/salary/tprojectreimbursedetail/getDetailByParentIds?parentIds=${record.id}`,null,'get')
        if(assetsForm.code==200){
            assetsForm.data&&assetsForm.data.map(item=>{
              this.totalMoney += item.settleFee
              this.assetsList = assetsForm.data
            })
            this.visible = true
            this.modelForm = record
          }else{
            this.$message.warning(assetsForm.msg)
          }
        }
    },
    // 日期选择限制
    disabledDate(current) {
      return current && current < moment().endOf('month').add(-1, 'months')
    },
    onChange(value, dateString){
      this.transferMonthStart = dateString
    },
    settleChange(val,option){
      const info = option.context.lists[option.key]['item']
      this.transferDepartCode = info.departNo
    },
    // 明细
    showDetail(){
      this.$refs.AssetsListForm.show(this.totalMoney,this.assetsList,this.isDetail);
    },
    handleOk(){
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const params ={
             ids:this.modelForm.id,
             transferMonthStart:this.transferMonthStart,
             transferDepartName:values.transferDepartName,
             transferReason:values.transferReason,
             fee:this.totalMoney,
             transferDepartCode:this.transferDepartCode
          }
          const qs = require('qs')
          httpAction(this.url,qs.stringify(params),'post').then(res=>{
            if(res.code === 200){
              this.$message.success(res.msg)
              this.handleCancel()
              this.$emit('ok')
            }else{
              this.$message.warning(res.msg)
            }
          }).finally(()=>{
            this.confirmLoading = false
          })
        }
      })
    },
    handleCancel(){
      this.visible = false
      this.totalMoney = 0
      this.isDetail = false
    },
  }

}
</script>
<style lang="less" scoped>
:global(.labTxt){
  display: flex;
}
:global(.labTxt .ant-form-item-label){
  width: 142px;
}
:global(.labTxt .ant-form-item-control-wrapper){
  width: 560px;
}
</style>
