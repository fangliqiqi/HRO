<template>
  <a-modal
    :title="title"
    :width="700"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >解锁申请</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="选择结算主体"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择结算主体"
                v-decorator="['ids', validatorRules.settleDomainId]"
                :dropdownMatchSelectWidth="false"
                style="width: 201px"
              >
                <a-select-option
                  v-for="(value, key) in settleDomainBelongs"
                  :key="key"
                  :value="value.id"
                >{{ value.departName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="解锁原因"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择解锁原因"
                v-decorator="['reason', validatorRules.unlockReason]"
                :dropdownMatchSelectWidth="false"
                style="width: 201px"
              >
                <a-select-option
                  v-for="(item, index) in unlockReasonBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="审核人"
              style="margin-left: 42px"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择审核人"
                v-decorator="['nextUserId', validatorRules.nextUserId]"
                :dropdownMatchSelectWidth="false"
                style="width: 201px"
              >
                <a-select-option
                  v-for="(item, index) in nextUserIdBelongs"
                  :key="index"
                  :value="item.userId"
                >{{ item.nickname }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注"
              style="margin-left: 67px"
            >
              <a-textarea
                :rows="3"
                placeholder="请填写备注"
                v-decorator="['remark', {}]"
                style="width: 500px"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <error-modal ref="errorModal"></error-modal>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import ErrorModal from '../../global/modules/ErrorModal'

  export default {
    name: 'EmployeeSettleDomainUnlockApplyModal',
    components: {
      ErrorModal,
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        nextUserIdBelongs: [],
        settleDomainBelongs: [],
        unlockReasonBelongs: [],
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          settleDomainId: { rules: [{ required: true, message: '请选择结算主体！' }] },
          unlockReason: { rules: [{ required: true, message: '请选择解锁原因！' }] },
          nextUserId: { rules: [{ required: true, message: '请选择审核人！' }] },
        },
        url: {
          add: 'hrBase/temployeeinfo/unLockApplyBySettleDomain',
        },
      }
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = this.url.add
            const method = 'post'
            const formData = Object.assign(this.model, values)
            httpurl += `?ids=${formData.ids}&reason=${formData.reason}&nextUserId=${formData.nextUserId}`
            if (formData.remark != null) {
              httpurl += `&remark=${formData.remark}`
            }
            httpAction(httpurl, '', method).then((res) => {
              const msg = res.message || res.msg
              that.$emit('ok')
              if (Number(res.code) === 200) {
                if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  that.$refs.errorModal.title = `提示信息: ${msg}`
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  that.close()
                  that.$message.success(`${that.title}成功！`)
                }
              } else {
                if (res.data != null && res.data.length > 0) {
                  that.$refs.errorModal.title = `提示信息: ${msg}`
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.data)
                } else if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  that.$refs.errorModal.title = `提示信息: ${msg}`
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  that.$message.error(msg)
                }
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
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.nextUserIdBelongs = []
        this.settleDomainBelongs = []
        this.unlockReasonBelongs = []
      },
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>

<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
</style>
