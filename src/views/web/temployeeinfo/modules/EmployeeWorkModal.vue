<template>
  <a-modal
    :title="title"
    :width="800"
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
      >保存</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row v-if="!id">
          <a-col :span="8">
            <a-form-item label="选择员工">
              <select-page
                :id="'id'"
                @change="onChange"
                :allowClear="false"
                :title="'empName'"
                :triggerChange="true"
                :style="{width: '154px'}"
                placeholder="请选择员工姓名"
                v-decorator="['empId', validatorRules.empId]"
                :searchUrl="'/hrBase/temployeeinfo/page?deleteFlag=0&empName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :span="16">
            <a-form-item
              label="结算主体"
              style="margin-left: 11px;"
            >
              <a-input
                disabled
                placeholder="结算主体由选择员工姓名所带出"
                v-decorator="['settleDomainName']"
                style="width: 240px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item label="工作单位">
              <a-input
                placeholder="请填写工作单位"
                v-decorator="['workUnit', validatorRules.workUnit]"
                style="width: 154px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="工作部门">
              <a-input
                placeholder="请填写工作部门"
                v-decorator="['workDepart', validatorRules.workDepart]"
                style="width: 154px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="工作岗位">
              <a-input
                placeholder="请填写工作岗位"
                v-decorator="['workJob', {}]"
                style="width: 165px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item
              label="工作类型"
              style="margin-left: 11px;"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择工作类型"
                v-decorator="['workingType', {}]"
                :dropdownMatchSelectWidth="false"
                style="width: 154px"
              >
                <a-select-option
                  v-for="(item, index) in workTypeBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="在职状态"
              style="margin-left: 0px;"
            >
              <a-radio-group
                class="fontiframe"
                name="radioGroup"
                v-decorator="['workingStatus', {initialValue: '1', rules: [{ required: true, message: '在职状态！' }]}]"
              >
                <a-radio
                  class="radioGroup"
                  v-for="(value, key) in workingStatusBelongs"
                  :key="key"
                  :value="key"
                >{{ value.option }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item label="开始日期">
              <a-date-picker
                :disabledDate="disabledStartDate"
                @change="startDateChange"
                placeholder="请选择开始日期"
                v-decorator="['startDate', {initialValue: !model.startDate ? null : moment(model.startDate, dateFormat), rules:[{required: true, message: '请选择开始工作日期！'}]}]"
                style="width: 154px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="结束日期"
              style="margin-left: 11px;"
            >
              <a-date-picker
                placeholder="请选择结束日期"
                :disabledDate="disabledEndDate"
                v-decorator="['endDate', {initialValue: !model.endDate ? null : moment(model.endDate, dateFormat)}]"
                style="width: 154px"
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
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'EmployeeWorkModal',
    components: {
      SelectPage,
    },
    data() {
      return {
        id: 0,
        moment,
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        workTypeBelongs: [], // 工作类型
        settleDomainBelongs: [], // 结算主体与所属单位
        workingStatusBelongs: {}, // 在职状态
        dateFormat: "YYYY-MM-DD", // 时间格式化类型
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          empId: { rules: [{ required: true, message: '请选择员工！' }] },
          workUnit: { rules: [{ required: true, message: '请填写工作单位！' }] },
          workDepart: { rules: [{ required: true, message: '请填写工作部门！' }] },
        },
        url: {
          add: 'hrBase/tempworkrecording',
          edit: 'hrBase/tempworkrecording',
        },
      }
    },
    methods: {
      // 添加
      add() {
        this.edit({})
      },
      // 编辑
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'workUnit', 'workDepart', 'workJob', 'workingType', 'workingStatus'))
        })
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            if (!this.model.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }
            // 开始工作日期格式转换
            values.startDate = values.startDate ? values.startDate.format(this.dateFormat) : null
            // 结束工作日期格式转换
            values.endDate = values.endDate ? values.endDate.format(this.dateFormat) : null
            let formData = Object.assign(this.model, values)
            // 删除结算主体字段
            delete formData.settleDomainName
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
      // 表单关闭
      handleCancel() {
        this.close()
      },
      // 数据重置
      close() {
        this.id = 0
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.workTypeBelongs = []
        this.settleDomainBelongs = []
        this.workingStatusBelongs = {}
      },
      // 员工选择改变
      handleIdEmployeeChange(value) {
        this.model.settleDomainName = '-'
        if (Object.keys(this.settleDomainBelongs).length) {
          this.model.settleDomainName = (this.settleDomainBelongs).hasOwnProperty(value.settleDomainId) ? this.settleDomainBelongs[value.settleDomainId]['departName'] : '-'
        }
        this.form.setFieldsValue(pick(this.model, 'settleDomainName'))
      },
      // 开始日期
      startDateChange() {
        this.model.endDate = null
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'endDate'))
        })
      },
      // 开始日期
      disabledStartDate(current) {
        return current && current > moment().endOf('day')
      },
      // 结束日期
      disabledEndDate(current) {
        const startDate = this.form.getFieldValue('startDate')
        if (!current || !startDate) {
          return current
        } else {
          return startDate.valueOf() > current.valueOf()
        }
      },
      // 员工选择改变
      onChange(selectedValue, option) {
        if (option) { // 选择
          const lists = option.context.lists
          let settleDomainName = ''
          // 循环查找点击的list
          if (lists.length > 0) {
            for (const item of lists) {
              if (String(item.id) === String(selectedValue)) {
                settleDomainName += item.item.settleDomainName
                break
              }
            }
          }
          // 设置字段值
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({'settleDomainName': settleDomainName}, 'settleDomainName'))
          })
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
