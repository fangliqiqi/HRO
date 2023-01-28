<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="false"
    >
      <a-spin :spinning="confirmLoading">
        <a-form
          :form="form"
          layout="vertical"
          class="ant-advanced-search-form margin-left-explain"
        >
          <a-form-item
            class="stepFormText"
            label="停止原因"
          >
            <a-textarea
              placeholder="请输入停止原因"
              :autoSize="{ minRows: 5, maxRows: 8 }"
              v-decorator="[ 'stopReason', { rules:[ { required: true, message: '请输入停止原因!' } ] } ]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>

  import { httpAction } from '@/api/manage'

  export default {
    name: 'StopCooperaModal',
    data() {
      return {
        title: '停止合作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        model:{},
        type:0, //类型 0客户 1合同 2结算主体
        url:'/hrBase/tcustomerstop'
      }
    },
    methods: {
      showModal(record,type) {
        console.log(record,333)
        this.model = Object.assign({},record)
        this.type = type
        this.visible = true
        this.form.resetFields()

      },
      handleOk() {
        this.form.validateFields((err, values) => {
          if (!err) {
            values.type = this.type
            switch(this.type){
              case 0:
                values.customerCode = this.model.customerCode
                values.customerName = this.model.customerName
                values.customerId = this.model.id
              break
              case 1:
                values.customerCode = this.model.crmNo
                values.customerName = this.model.contractName
                values.customerId = this.model.id
                break
              case 2:
                values.customerCode = this.model.departNo
                values.customerName = this.model.departName
                values.customerId = this.model.id
                break
            }
            httpAction(this.url,values,'post').then(res=>{
              if(res.code === 200 ){
                this.$message.success('操作成功')
                this.handleCancel()
                this.$emit('ok')
              }else{
                this.$message.warning(res.msg)
              }
            })
          }
        })
      },
      handleCancel(){
        this.visible = false
      },
    }
  }
</script>
