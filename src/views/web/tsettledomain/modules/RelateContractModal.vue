<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="800"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    centered
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item label="结算主体名称" class="stepFormText">
              {{ model.departName }}
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="客户单位" class="stepFormText">
              {{ model.customerName }}
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="业务合同" class="stepFormText">
              <a-select
                placeholder="请选择业务合同"
                style="width: 500px"
                @change="changeSelect"
                v-decorator="['contractId', {rules: [{ required: true, message: '请选择业务合同!' }]} ]"
              >
                <a-select-option
                  v-for="(item,index) in contractList"
                  :key="index"
                  :value="item.id"
                >
                  <a-tooltip>
                    <template slot="title">
                      {{ item.contractName }}
                    </template>
                    {{ item.contractName }}
                  </a-tooltip>  
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'RelateContractModal',
  data() {
    return {
      visible: false,
      title: '关联合同',
      confirmLoading: false,
      form: this.$form.createForm(this),
      model: {},
      contractList:[],
      labelCol: {
        xs: { span: 12 },
        sm: { span: 18 }
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 18 }
      },
      url: {
        submitBatch: '/hrBase/tsettledomain/audit/'
      },
      prAuditFlagOption:['通过','不通过','待审核','待提交','全国业务中心审核','已办理','已归档'],
    }
  },
  methods: {
    show(record) {
      this.model = record
      httpAction(`/hrBase/tcustomercontract/page?selectType=3&size=50&customerId=${record.customerId}`,null,'get').then(res=>{
        if(res.code === 200){
          this.contractList = res.data.total ? res.data.records : []
          this.visible = true
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    changeSelect(val,option){
      const item = option['context']['contractList'][option.key]
      if(!['0','5','6'].includes(item.prAuditFlag)){
        this.$message.warning(`该合同处于${this.prAuditFlagOption[item.prAuditFlag]}状态,只有审核通过、已办理、已归档才能选择!`)
        this.$nextTick(() => {
          this.form.resetFields()
        })
        return
      }
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          
          httpAction(`/hrBase/tsettledomain/updateRelateContract?contractId=${values.contractId}&id=${this.model.id}` ,null,'put').then((res) => {
            if (Number(res.code) === 200) {
              that.$message.success(`关联成功！`)
              that.close()
              that.$emit('ok')
            } else {
              that.$message.warning(res.msg)
            }
          }).finally(() => {
            that.confirmLoading = false
          })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.visible = false
      this.contractList = []
    }
  }
}
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}

</style>