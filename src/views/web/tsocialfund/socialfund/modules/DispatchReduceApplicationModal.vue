<template>
  <a-modal
    :title="title"
    :width="850"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
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
            <a-form-item class="stepFormText" style="margin-left:125px;font-weight: bold;">
              {{ model.empName }}
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="身份证号" class="stepFormText">
              {{ model.empIdcard }}
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="所属单位/结算主体" class="stepFormText">
              {{ model.belongUnit }} / {{ model.settleDomain }}
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="联系方式" class="stepFormText">
              {{ model.empPhone }}
            </a-form-item>
          </a-col>
          <a-col
            :span="8"
            v-if="employeeStatus.haveSocial || model.socialReduceDate"
          >
            <a-form-item
              label="停缴社保日期"
              class="stepFormText"
            >
              <a-date-picker
                :allowClear="id ? false : true"
                placeholder="请选择日期"
                :disabledDate="disabledDate"
                v-decorator="['socialReduceDate', validatorRules.socialReduceDate]"
                style="width: 110px"
                @change="handleempSocialReduceDate"
              />
            </a-form-item>
          </a-col>
          <a-col
            :span="8"
            v-if="employeeStatus.haveFund || model.fundReduceDate"
          >
            <a-form-item
              label="停缴公积金日期"
              class="stepFormText"
            >
              <a-date-picker
                :allowClear="id ? false : true"
                placeholder="请选择日期"
                :disabledDate="disabledDate"
                v-decorator="['fundReduceDate', validatorRules.fundReduceDate]"
                style="width: 110px"
                @change="handleempFundReduceDate"
              />
            </a-form-item>
          </a-col>
          <a-col
            :span="8"
            v-if="!employeeStatus.haveLeave || model.leaveDate"
          >
            <a-form-item
              label="离职日期"
              class="stepFormText"
            >
              <a-date-picker
                :allowClear="id ? false : true"
                placeholder="请选择日期"
                :disabledDate="disabledDate"
                v-decorator="['leaveDate', validatorRules.leaveDate]"
                @change="handleempLeaveDate"
                style="width: 110px"
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
                style="width: 110px"
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
                style="width: 300px"
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
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import { filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'DispatchReduceApplicationModal',
    data() {
      return {
        id: '',
        moment,
        model: {},
        title: '操作',
        visible: false,
        recordInfo: {}, // 提交过来的数据
        confirmLoading: false,
        form: this.$form.createForm(this),
        dateFormat: "YYYY-MM-DD", // 时间格式化类型
        chooseStatus: {social: false, fund: false, leave: false}, // 员工社保、公积金、是否离职选取状态
        employeeStatus: {haveSocial: false, haveFund: false, haveLeave: true}, // 员工社保、公积金、是否离职相关状态
        empTypeBelongs: [], // 员工类型
        reduceReasonBelongs: [],  // 减少原因
        settleDomainBelongs: [],  // 结算主体和部门
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
          leaveDate: {rules: []},
        },
        url: {
          add: 'hrSocial/tdispatchinfo/saveSocialAndFundReduce',
          edit: 'hrSocial/tdispatchinfo/updateSocialAndFundReduce',
        },
      }
    },
    methods: {
      getDefault(condition,val,dval){
        return condition ? val : dval
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        /************************************************* 员工数据 *************************************************/
        // 员工类型
        this.model.empType = filterDictText(this.empTypeBelongs, this.model.empType)
        // 结算主体
        let settleDomainTemp = this.model.settleDomain // 用于取所属单位
        this.model.settleDomain = this.model.belongUnit = '-'

        if (Object.keys(this.settleDomainBelongs).length) {
          this.model.settleDomain = this.getDefault((this.settleDomainBelongs).hasOwnProperty(settleDomainTemp),this.settleDomainBelongs[settleDomainTemp]['departName'],'-')
          this.model.belongUnit = this.getDefault((this.settleDomainBelongs).hasOwnProperty(settleDomainTemp),this.settleDomainBelongs[settleDomainTemp]['customerName'],'-')
        }
        // 联系电话
        this.model.empPhone = this.getDefault(this.model.empMobile,this.model.empMobile,this.model.empPhone)
        /************************************************* 表单数据 *************************************************/
        if (this.model.socialReduceDate) {  // 社保
          this.validatorRules.socialReduceDate.rules[0] = { required: true, message: '请选择日期！' }
          // this.model.socialReduceDate = this.model.socialReduceDate ? moment(this.model.socialReduceDate, this.dateFormat) : null // 停缴社保日期
          this.model.socialReduceDate = this.getDefault(this.model.socialReduceDate , moment(this.model.socialReduceDate, this.dateFormat) , null)
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'socialReduceDate'))
          })
        }
        if (this.model.fundReduceDate) {  // 公积金
          this.model.fundReduceDate = this.getDefault(this.model.fundReduceDate , moment(this.model.fundReduceDate, this.dateFormat) , null)
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'fundReduceDate'))
          })
        }
        // 社保公积金都不存在时，离职日期必选
        if(!this.employeeStatus.haveFund && !this.employeeStatus.haveSocial){
          this.validatorRules.leaveDate.rules[0] = { required: true, message: '请选择离职日期！' }
        }
        if (this.employeeStatus.haveLeave && this.model.leaveDate) {  // 离职
          this.model.leaveDate = this.getDefault(this.model.leaveDate , moment(this.model.leaveDate, this.dateFormat) , null)
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'leaveDate'))
          })
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'reduceReason', 'reduceRemark'))
        })
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          values.socialReduceDate = values.socialReduceDate ? values.socialReduceDate.format(this.dateFormat) : null
          values.fundReduceDate = values.fundReduceDate ? values.fundReduceDate.format(this.dateFormat) : null
          values.leaveDate = values.leaveDate ? values.leaveDate.format(this.dateFormat) : null
          if (!err) {
            if (values.socialReduceDate == null && values.fundReduceDate == null && values.leaveDate == null) {
              that.$message.error('请至少选择一个日期！')
              return false
            }
            that.confirmLoading = true
            let httpurl = ''
            let method = 'post'
            let formData = Object.assign(this.model, values)
            let requestDate = {}
            if (formData.socialReduceDate) {
              requestDate.socialReduceDate = formData.socialReduceDate
            }
            if (formData.fundReduceDate) {
              requestDate.fundReduceDate = formData.fundReduceDate
            }
            if (formData.leaveDate) {
              requestDate.leaveDate = formData.leaveDate
            } 
            requestDate.reduceReason = formData.reduceReason
            requestDate.reduceRemark = formData.reduceRemark
            if (this.id) {  // 编辑的时候
              httpurl += this.url.edit
              requestDate.id = this.id
              requestDate.empId = this.recordInfo.empId
            } else {  // 添加的时候
              httpurl += this.url.add
              requestDate.empId = formData.id
            }
            httpAction(httpurl, requestDate, method).then((res) => {
              if (res.code === 200) {
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
      // 表单关闭
      handleCancel() {
        this.close()
      },
      // 关闭功能与数据重置
      close() {
        this.id = ''
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.recordInfo = {} // 提交过来的数据
        this.chooseStatus = {social: false, fund: false, leave: false} // 员工社保、公积金、是否离职选取状态
        this.employeeStatus = {haveSocial: false, haveFund: false, haveLeave: true}
        // 状态归位
        this.model.socialReduceDate = this.model.fundReduceDate = this.model.leaveDate = null
        this.form.setFieldsValue(pick(this.model, 'socialReduceDate', 'fundReduceDate', 'leaveDate'))
        // 设置必填验证项
        this.validatorRules = {
          reduceReason: {rules: [{ required: true, message: '请选择原因！' }]},
          socialReduceDate: {rules: []},
          fundReduceDate: {rules: []},
          leaveDate: {rules: []},
        }
      },
      // 停缴社保日期
      handleempSocialReduceDate(value) {
        if (value) {
          // 选择日期// 设置必填验证项
          this.chooseStatus.social = true
        } else {
          // 清除
          this.chooseStatus.social = false
          this.validatorRules.leaveDate.rules = []
        }
      },
      // 停缴公积金日期
      handleempFundReduceDate(value) {
        if (value) {
          // 选择日期// 设置必填验证项
          this.chooseStatus.fund = true
        } else {
          // 清除
          this.chooseStatus.fund = false
          this.validatorRules.leaveDate.rules = []
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
      },
    }
  }
</script>

<style lang="less" scoped>

.tags{
  font-size: 12px;
  color:#000000a6;
  border: 1px solid #ccc;
  padding: 10px 15px;
  display: inline-block;
  margin: 10px 0px;
  span{
    position: relative;
    display: inline-block;
    border:1px solid #91d5ff;
    padding: 0px 20px;
    margin-right: 10px;
  }
  .check {
    position: absolute;
    top: -1px;
    right: 0px;
    color: #52c41a;
  }
  .close{
    position: absolute;
    top: -1px;
    right: 0px;
    color: #f50;
  }
}
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
