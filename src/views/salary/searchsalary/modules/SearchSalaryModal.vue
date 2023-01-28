<template>
  <a-modal
    title="更新款项来源"
    :width="900"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭"
    okText="确定"
    :visible="visible"
    :confirmLoading="loading"
  >
    <a-form
      :form="form"
      layout="inline"
    >
      <a-row>
        <a-col :span="8">
          <a-form-item label="部门信息">
            <span>{{ salaryInfo.departName }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="部门余额">
            <span> {{ settleInfo.balance }} </span>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="工资月份">
            <span>{{ salaryInfo.salaryMonth }}</span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-item label="结算金额">
            <span>{{ salaryInfo.settlementAmount }}</span>
          </a-form-item>
        </a-col>
        <!-- <a-col :span="8">
          <a-form-item label="开票金额明细">
            <a-input
              placeholder=""
              style="width: 165px;border:0"
            />
          </a-form-item>
        </a-col> -->
        <a-col :span="8">
          <a-form-item label="款项来源">
            <a-select
              style="width:191px"
              v-model="moneyForm"
            >
              <a-select-option :value="0">客户到款</a-select-option>
              <a-select-option :value="1">垫付</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import { httpAction } from '@/api/manage'
export default {
  name:'SearchSalaryModal',
  data() {
    return{
      visible:false,
      loading:false,
      form:this.$form.createForm(this),
      salaryInfo: {},
      settleInfo: {},
      moneyForm: '',
      url: {
        settleUrl: '/hrBase/tsettledomain/',
        doSubmitUrl:'/salary/tsalarystandard',
      }
    }
  },
  methods:{
    add(){
      this.edit({})
    },
    // 编辑
    edit(record){
      let url = this.url.settleUrl + record.departId
      httpAction(url,{},'GET').then((res) => {
        if(res.code == 200){
          this.settleInfo = res.data
        }
      })
      this.salaryInfo = record
      this.moneyForm = record.moneyFrom
      this.visible = true
    },
    handleCancel(){
      this.visible = false
    },
    handleOk() {
      var that = this
      this.loading = true
      httpAction(this.url.doSubmitUrl,{'moneyFrom':this.moneyForm,'id':this.salaryInfo.id},'PUT').then((res) => {
        this.loading = false
        if(res.code == 200){
          this.$message.success("提交成功")
          this.visible = false
          that.$emit('ok')
        }else{
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
