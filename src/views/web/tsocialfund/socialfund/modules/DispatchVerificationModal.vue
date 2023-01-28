<template>
  <a-modal
    :title="title"
    :width="600"
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
          <a-col :span="10">
            <a-form-item label="审核状态">
              <a-radio-group
                buttonStyle="solid"
                @change="auditStatusChange"
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
          <!-- <a-col
            :span="14"
            v-if="nextUserShow"
          >
            <a-form-item
              label="办理人"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择办理人"
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
          </a-col> -->
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
                style="width: 418px"
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
  import ErrorModal from '../../../global/modules/ErrorModal'

  export default {
    name: 'DispatchVerificationModal',
    components: {
      ErrorModal,
    },
    data() {
      return {
        ids: '',  // 派单id
        Type: '', // 类型
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        nextUserShow: true, // 下一步操作人是否显示
        nextUserIdBelongs: [], //下一步操作人
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          nextUserId: {rules: [{ required: true, message: '请选择办理人！' }]},
        },
        url: {
          add: 'hrSocial/tdispatchinfo/addApplyAudit',
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
            let formData = Object.assign(this.model, values)
            httpurl += '?ids=' + that.ids  + '&type=' + that.Type + '&auditStatus=' + formData.auditStatus
            
            // if (formData.nextUserId != null) {
            //   httpurl += '&nextUserId=' + formData.nextUserId
            // }

            if (formData.auditRemark != null) {
              httpurl += '&auditRemark=' + formData.auditRemark
            }

            httpAction(httpurl, '', method).then((res) => {
              let msg = res.message || res.msg
              that.$emit('ok')

              if (res.code === 200) {
                if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  that.$refs.errorModal.title = '审核提示: ' + msg
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  that.close()
                  that.$message.success('审核成功！')
                }
              } else {
                if (res.data != null && res.data.length > 0) {
                  that.$refs.errorModal.title = '审核提示: ' + msg
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.data)
                } else if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  that.$refs.errorModal.title = '审核提示: ' + msg
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
      // 关闭功能
      handleCancel() {
        this.close()
      },
      // 表单关闭与数据重置
      close() {
        this.$emit('close')
        this.ids = '' //派单id
        this.Type = '' // 类型
        this.visible = false
        this.confirmLoading = false
        this.nextUserShow = true // 下一步操作人是否显示
        this.nextUserIdBelongs = []
      },
      // 状态改变
      auditStatusChange(e) {
        if (e.target.value == 1) {
          this.nextUserShow = true
        } else if (e.target.value == 2) {
          this.nextUserShow = false
        }
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