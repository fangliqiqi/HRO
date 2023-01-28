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
                v-decorator="['auditStatus', {initialValue:'4', rules:[{required: true, message: '请选择审核状态！'}]}]"
              >
                <a-radio-button
                  value="4"
                  style="margin-right: 10px;border-radius: 4px;"
                >通过</a-radio-button>
                <a-radio-button
                  value="1"
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
              label="审核人"
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
                v-decorator="['remark', {}]"
                style="width: 418px"
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
    name: 'ForecastBillAuditModal',
    data() {
      return {
        id: '',
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
          nextUserId: {rules: [{ required: true, message: '请选择审核人！' }]},
        },
        url: {
          add: 'hrSocial/tforecastform/forecastFormAudit',
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
            httpurl += `?id=${that.id}&auditStatus=${formData.auditStatus}`
            if (formData.nextUserId != null) {
              httpurl += `&nextUserId=${formData.nextUserId}`
            }
            if (formData.remark != null) {
              httpurl += `&remark=${formData.remark}`
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
      // 关闭功能
      handleCancel() {
        this.close()
      },
      // 表单关闭与数据重置
      close() {
        this.id = ''
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.nextUserShow = true // 下一步操作人是否显示
        this.nextUserIdBelongs = []
      },
      // 状态改变
      auditStatusChange(e) {
        if (String(e.target.value) === '1') {
          this.nextUserShow = true
        } else if (String(e.target.value) === '2') {
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
