<template>
  <a-modal
    :title="title"
    :width="750"
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
        <a-row>
          <a-col :span="12">
            <a-form-item label="成员姓名">
              <a-input
                placeholder="请填写成员姓名"
                v-decorator="['familyName', validatorRules.familyName]"
                style="width: 200px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="与本人关系"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择关系"
                v-decorator="['relationshipSelf', validatorRules.relationshipSelf]"
                :dropdownMatchSelectWidth="false"
                style="width: 200px"
              >
                <a-select-option
                  v-for="(item, index) in relationshipSelfBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item
              label="出生日期"
              style="margin-left: 11px"
            >
              <a-date-picker
                placeholder="请选择出生日期"
                :disabledDate="disabledDate"
                v-decorator="['birthday', {}]"
                style="width: 200px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="工作单位"
              style="margin-left: 25px"
            >
              <a-input
                placeholder="请填写工作单位"
                v-decorator="['workUnit', {}]"
                style="width: 200px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item label="联系电话">
              <a-input
                placeholder="请填写联系电话"
                v-decorator="['contractTel', validatorRules.contractTel]"
                style="width: 200px"
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

  export default {
    name: 'EmployeeFamilyEditModal',
    data() {
      return {
        moment,
        model: {},
        title: '操作',
        visible: false,
        dateFormat: "YYYY-MM-DD",
        confirmLoading: false,
        form: this.$form.createForm(this),
        relationshipSelfBelongs: [],  // 所属关系列表
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          familyName: { rules: [{ required: true, message: '请填写成员姓名' }, { validator: this.validateName }] },
          relationshipSelf: { rules: [{ required: true, message: '请选择关系！' }] },
          contractTel: { rules: [{ required: true, message: '请填写联系电话！' }, { validator: this.validateContractTel }] },
        },
        url: {
          edit: 'hrBase/tempfamily',
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
        if (this.model.id) {  // 编辑
          this.model.birthday = this.model.birthday ? moment(this.model.birthday, this.dateFormat) : null
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'familyName', 'relationshipSelf', 'birthday', 'workUnit', 'contractTel'))
          })
        }
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            const httpurl = this.url.edit
            const method = 'put'
            const formData = Object.assign(this.model, values)
            formData.birthday = formData.birthday ? formData.birthday.format(this.dateFormat) : null
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
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.relationshipSelfBelongs = []
      },
      /******************************************* 验证规则 *******************************************/
      // 姓名验证
      validateName(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        const strLenght = value.length
        if (strLenght < 2 || strLenght > 10) {  // 长度验证
          callback('长度2-10个字符！')
          return false
        }
        callback()
      },
      // 禁止选择的时间范围
      disabledDate(current) {
        return current >= moment().endOf('day');
      },
      // 联系电话验证
      validateContractTel(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/^1[3-9][0-9]\d{8}$/).test(value)) {
          callback('联系电话格式不正确！')
          return false
        }
        callback()
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
