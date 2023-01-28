<template>
  <a-modal
    :title="title"
    :width="850"
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
          <a-col
            :span="8"
            v-if="employeeStatus.haveSocial"
          >
            <a-form-item
              label="停缴社保日期"
              class="stepFormText"
            >
              <a-date-picker
                placeholder="请选择日期"
                :disabledDate="disabledDate"
                v-decorator="['socialReduceDate', validatorRules.socialReduceDate]"
                style="width: 120px"
                @change="handleempSocialReduceDate"
              />
            </a-form-item>
          </a-col>
          <a-col
            :span="8"
            v-if="employeeStatus.haveFund"
          >
            <a-form-item
              label="停缴公积金日期"
              class="stepFormText"
            >
              <a-date-picker
                placeholder="请选择日期"
                :disabledDate="disabledDate"
                v-decorator="['fundReduceDate', validatorRules.fundReduceDate]"
                style="width: 120px"
                @change="handleempFundReduceDate"
              />
            </a-form-item>
          </a-col>
          <a-col
            :span="8"
            v-if="!employeeStatus.haveLeave"
          >
            <a-form-item
              label="离职日期"
              class="stepFormText"
            >
              <a-date-picker
                placeholder="请选择日期"
                :disabledDate="disabledDate"
                v-decorator="['empLeaveDate', validatorRules.empLeaveDate]"
                style="width: 120px;"
                @change="handleempLeaveDate"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item
              label="减少原因"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择原因"
                v-decorator="['reduceReason', validatorRules.reduceReason]"
                :dropdownMatchSelectWidth="false"
                style="width: 120px"
              >
                <a-select-option
                  v-for="(item, index) in reduceReasonBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="16">
            <a-form-item
              label="备注"
              class="stepFormText"
            >
              <a-textarea
                :rows="1"
                placeholder="备注"
                v-decorator="['reduceRemark', {}]"
                style="width: 390px"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'EmployeeDepletionModal',
    data() {
      return {
        id: '',
        moment,
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        employeeStatus: {}, // 员工社保、公积金、是否离职相关状态
        reduceReasonBelongs: [],  // 减少原因
        dateFormat: "YYYY-MM-DD", // 时间格式化类型
        chooseStatus: {social: false, fund: false, leave: false}, // 员工社保、公积金、是否离职选取状态
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          reduceReason: {rules: [{ required: true, message: '请选择原因！' }]},
          socialReduceDate: {rules: []},
          fundReduceDate: {rules: []},
          empLeaveDate: {rules: []},
        },
        url: {
          add: 'hrBase/temployeeinfo/reduce',
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
            if (values.socialReduceDate == null && values.fundReduceDate == null && values.empLeaveDate == null) {
              that.$message.error('请至少选择一个日期！')
              return false
            }
            if (values.empLeaveDate) { // 离职
              if (this.employeeStatus.haveSocial && !this.employeeStatus.haveFund) { // 社保存在、公积金不存在
                  if (values.socialReduceDate == null) {
                    that.$message.error('停缴社保日期必须选择！')
                    return false
                  }
              }
              if (!this.employeeStatus.haveSocial && this.employeeStatus.haveFund) { // 社保不存在、公积金存在
                if (values.fundReduceDate == null) {
                  that.$message.error('停缴公积金日期必须选择！')
                  return false
                }
              }
              if (this.employeeStatus.haveSocial && this.employeeStatus.haveFund) { // 社保存在、公积金存在
                if (values.socialReduceDate == null || values.fundReduceDate == null) {
                  that.$message.error('停缴社保日期、停缴公积金日期必须选择！')
                  return false
                }
              }
            }
            if ((this.employeeStatus.haveSocial && values.socialReduceDate) && !this.employeeStatus.haveFund) {  // 社保存在、公积金不存在【社保已选择】
              if (values.empLeaveDate == null) {
                that.$message.error('离职日期必须选择！')
                return false
              }
            }
            if ((this.employeeStatus.haveFund && values.fundReduceDate) && !this.employeeStatus.haveSocial) {  // 社保不存在、公积金存在【公积金已选择】
              if (values.empLeaveDate == null) {
                that.$message.error('离职日期必须选择！')
                return false
              }
            }
            if ((values.socialReduceDate && values.fundReduceDate) && values.empLeaveDate == null) { // 社保存在、公积金存在【都已选择】
              that.$message.error('离职日期必须选择！')
              return false
            }
            that.confirmLoading = true
            const httpurl = this.url.add
            const method = 'post'
            values.socialReduceFlag = values.socialReduceDate ? true : false
            values.fundReduceFlag = values.fundReduceDate ? true : false
            values.empLeaveFlag = values.empLeaveDate ? true : false
            values.socialReduceDate = values.socialReduceDate ? values.socialReduceDate.format(this.dateFormat) : null
            values.fundReduceDate = values.fundReduceDate ? values.fundReduceDate.format(this.dateFormat) : null
            values.empLeaveDate = values.empLeaveDate ? values.empLeaveDate.format(this.dateFormat) : null
            const formData = Object.assign(this.model, values)
            formData.empId = this.id
            httpAction(httpurl, formData, method).then((res) => {
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
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.employeeStatus = {}
        this.chooseStatus = {social: false, fund: false, leave: false} // 员工社保、公积金、是否离职选取状态
        // 设置必填验证项
        this.validatorRules = {
          reduceReason: {rules: [{ required: true, message: '请选择原因！' }]},
          socialReduceDate: {rules: []},
          fundReduceDate: {rules: []},
          empLeaveDate: {rules: []},
        }
      },
      // 停缴社保日期
      handleempSocialReduceDate(value) {
        if (value) {
          // 选择日期// 设置必填验证项
          this.chooseStatus.social = true
          if (this.employeeStatus.haveFund && this.chooseStatus.fund) { // 公积金存在并且已经选择日期
            this.validatorRules.empLeaveDate.rules[0] = { required: true, message: '请选择日期！' }
          } else if (!this.employeeStatus.haveFund) { // 公积金不存在
            this.validatorRules.empLeaveDate.rules[0] = { required: true, message: '请选择日期！' }
          }
        } else {
          // 清除
          this.chooseStatus.social = false
          this.validatorRules.empLeaveDate.rules = []
        }
      },
      // 停缴公积金日期
      handleempFundReduceDate(value) {
        if (value) {
          // 选择日期 // 设置必填验证项
          this.chooseStatus.fund = true
          if (this.employeeStatus.haveSocial && this.chooseStatus.social) { // 社保存在并且已经选择日期
            this.validatorRules.empLeaveDate.rules[0] = { required: true, message: '请选择日期！' }
          } else if (!this.employeeStatus.haveSocial) { // 社保不存在
            this.validatorRules.empLeaveDate.rules[0] = { required: true, message: '请选择日期！' }
          }
        } else {
          // 清除
          this.chooseStatus.fund = false
          this.validatorRules.empLeaveDate.rules = []
        }
      },
      // 离职日期
      handleempLeaveDate(value) {
        if (value) {
          // 选择日期// 设置必填验证项
          this.validatorRules.socialReduceDate.rules[0] = { required: true, message: '请选择日期！' }
          this.validatorRules.fundReduceDate.rules[0] = { required: true, message: '请选择日期！' }
        } else {
          // 清除
          this.validatorRules.socialReduceDate.rules = []
          this.validatorRules.fundReduceDate.rules = []
        }
      },
      disabledDate(current) {
        return !current
      }
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 125px;
  }
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
.stepFormTextOfLeaveDate {
  :global(.ant-form-item-label) {
    width: 90px;
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
