<template>
  <a-modal
    :title="title"
    :width="550"
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
        <a-row v-if="type==1">
          <a-col :span="24">
            <a-form-item
              label="审核状态"
              class="stepFormText"
            >
              <a-radio-group
                buttonStyle="solid"
                v-decorator="['auditStatus', {initialValue:'1', rules:[{required: true, message: '请选择审核状态！'}]}]"
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

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注"
              class="stepFormText"
            >
              <a-textarea
                :rows="3"
                placeholder="请填写备注"
                v-decorator="['remark', {}]"
                style="width: 320px"
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
    name: 'BillVerificationModal',
    data() {
      return {
        id: '',
        type: 0,  // 类型【0提交1审核】
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          nextUserId: { rules: [{ required: true, message: '请选择审核人！' }] },
        },
        url: {
          add: 'hrSocial/tforecastoneselfform/forecastOneselfFormSubmit',  // 提表单
          audit: 'hrSocial/tforecastoneselfform/forecastOneselfFormAudit',   // 审核
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
            let httpurl = ''
            let method = 'post'
            let formData = Object.assign(this.model, values)
            if (Number(this.type) === 1) {
              httpurl += this.url.audit
            } else {
              httpurl += this.url.add
            }
            httpurl += `?id=${this.id}`
            if (formData.auditStatus != null) {
              httpurl += `&auditStatus=${formData.auditStatus}`
            }
            if (formData.remark != null) {
              httpurl += `&remark=${formData.remark}`
            }
            httpAction(httpurl, {}, method).then((res) => {
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
        this.id = ''
        this.type = 0  // 类型【0提交1审核】
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
      },
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 120px;
  }
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
