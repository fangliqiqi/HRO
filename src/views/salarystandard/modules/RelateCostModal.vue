<template>
  <a-modal
    :width="700"
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        class="ant-advanced-search-form"
      >
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="关联成本项"
        >
          <a-select
            mode="multiple"
            placeholder="请选择关联成本项"
            style="width: 100%"
            optionFilterProp="children"
            @change="handleChange"
            option-label-prop="label"
            v-decorator="['cost', {rules: [{ required: true, message: '请选择关联成本项!' }]} ]"
          >
            <a-select-option v-for="(item,index) in costList" :key="index" :value="item.id" :label="item.reimburseFormCode+' '+item.applyUserName+' '+item.projectMoney+'元'">
              {{ item.reimburseFormCode }}  {{ item.applyUserName }}  {{ item.projectMoney }}元
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import SelectPage from '@/components/jeecg/SelectPage'
import { httpAction } from '@/api/manage'

export default {
  name: 'RelateCostModal',
  components: {
    SelectPage,
  },
  data(){
    return {
      title: '关联项目成本',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      url:'/salary/tsettlementhformsub/saveTSettlementhFormSubByProject',
      model:{},
      costList:[],
      selectList:[]

    }
  },
  methods:{
    show(record){
      this.visible = true
      this.model = record
      const url = `/salary/tstatisticsprojectreimburse/getAllInfo?deptNo=${record.settleDepartNo}&reimburseFormStatus=0`
      httpAction(url,null,'get').then(res=>{
        if(res.code === 200){
          this.costList = res.data
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleChange(val,option){
      this.selectList = option.map(item=>{
        return item.context.costList[item.data.key]
      })
    },
    handleOk(){
      this.form.validateFields((err) => {
        if (!err) {
          this.confirmLoading = true
          const url = `${this.url}?settleFormId=${this.model.id}`
          httpAction(url,this.selectList,'post').then(res=>{
            if(res.code === 200){
              this.$message.success(res.msg)
              this.handleCancel()
              this.$emit('ok',res.data)
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
      this.model = {}
      this.costList = []
      this.selectList = []
    },
  }

}
</script>