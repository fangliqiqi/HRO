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
      >确定</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item label="审核状态">
              <a-radio-group
                buttonStyle="solid"
                v-decorator="['auditStatus', {initialValue:'1', rules:[{required: true, message: '请选择审核状态！'}]}]"
                @change="handleChange"
              >
                <a-radio-button
                  value="1"
                  style="margin-right: 10px;border-radius: 4px;"
                >通过</a-radio-button>
                <a-radio-button
                  value="2"
                  style="border-radius: 4px;"
                >退回</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row v-if="auditReasonStatus">
          <a-col :span="24">
            <a-form-item
              label="审核原因"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择退回原因"
                v-decorator="['auditReason', validatorRules.auditReason]"
                :dropdownMatchSelectWidth="false"
                style="width: 229px"
              >
                <a-select-option
                  v-for="(item, index) in auditReasonBelongs"
                  :key="index"
                  @click="handleAuditReason(item)"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="审核意见"
              style="margin-left: 11px;"
            >
              <a-textarea
                :rows="3"
                placeholder="请填写审核意见"
                v-decorator="['auditRemark', {}]"
                style="width: 450px"
              />
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
    name: 'EmployeeUnlockingAuditModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        unlockApplyId: 0,
        confirmLoading: false,
        auditReasonStatus: false,
        auditReasonStr: '',
        auditReasonBelongs: [],
        form: this.$form.createForm(this),
        isBatch: 0,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          auditReason: { rules: [{ required: true, message: '请选择退回原因！' }] },
        },
        url: {
          add: 'hrBase/tunlockapplyinfo/unLockAudit',
          batchAudit: 'hrBase//tunlockapplyinfo/unLockBatchAudit'
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
            let httpurl
            const method = 'post'
            const formData = Object.assign(this.model, values)
            //单个审核
            if(this.isBatch == 0){
              httpurl = this.url.add
              httpurl += `?id=${that.unlockApplyId}&auditStatus=${formData.auditStatus}`
            }
            //批量审核
            if(this.isBatch == 1){
              httpurl = this.url.batchAudit
              httpurl += `?ids=${that.unlockApplyId}&auditStatus=${formData.auditStatus}`
            }
            if (formData.auditReason != null) {
              httpurl += `&auditRemark=${this.auditReasonStr}`
            }
            if (formData.auditReason != null && formData.auditRemark != null) {
              httpurl += `,${formData.auditRemark}`
            } else if (formData.auditReason == null && formData.auditRemark != null) {
              httpurl += `&auditRemark=${formData.auditRemark}`
            }
            httpAction(httpurl, '', method).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.message || res.msg)
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
        this.unlockApplyId = 0
        this.confirmLoading = false
        this.auditReasonStr = ''
        this.auditReasonBelongs = []
        this.auditReasonStatus = false
      },
      handleChange(e) {
        if (String(e.target.value) === '1') {
          this.auditReasonStatus = false
        } else if (String(e.target.value) === '2') {
          this.auditReasonStatus = true
        }
      },
      handleAuditReason(value) {
        this.auditReasonStr = value.label
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
