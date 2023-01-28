<template>
  <a-modal
    :title="title"
    :width="1200"
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
          <a-col :span="4">
            <a-button
              style="margin-bottom: 10px; margin-left: 0px; float: left;"
              @click="addRowNum"
              type="primary"
              icon="plus"
            >添加一行</a-button>
          </a-col>
          <a-col :span="20">
            <a-form-item
              label="选择员工"
              style="margin-left: 14px"
            >
              <select-page
                :id="'empNo'"
                @change="onChange"
                :allowClear="false"
                :title="'empName'"
                :triggerChange="true"
                :style="{width: '95px'}"
                placeholder="请选择"
                v-decorator="['empNo', validatorRules.empNo]"
                :searchUrl="'/hrBase/temployeeinfo/page?deleteFlag=0&empName='"
              ></select-page>
            </a-form-item>
            <a-form-item label="结算主体">
              <a-input
                disabled
                placeholder="结算主体由选择员工姓名所带出"
                v-decorator="['settleDomainName']"
                style="width: 346px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row
          v-for="n in rowNum"
          :key="n"
        >
          <a-col :span="24">
            <a-form-item label="成员姓名">
              <a-input
                placeholder="成员姓名"
                v-decorator="[familyName + n, validatorRules[familyName + n]]"
                style="width: 95px"
              />
            </a-form-item>
            <a-form-item
              label="与本人关系"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择"
                v-decorator="[relationshipSelf + n, validatorRules[relationshipSelf + n]]"
                :dropdownMatchSelectWidth="false"
                style="width: 95px"
              >
                <a-select-option
                  v-for="(item, index) in relationshipSelfBelongs"
                  :key="index"
                  :value="item.label"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="出生日期">
              <a-date-picker
                placeholder="请选择"
                :disabledDate="disabledDate"
                v-decorator="[birthday + n, {}]"
                style="width: 116px"
              />
            </a-form-item>
            <a-form-item label="工作单位">
              <a-input
                placeholder="工作单位"
                v-decorator="[workUnit + n, {}]"
                style="width: 221px"
              />
            </a-form-item>
            <a-form-item label="联系电话">
              <a-input
                placeholder="联系电话"
                v-decorator="[contractTel + n, validatorRules[contractTel + n]]"
                style="width: 108px"
              />
            </a-form-item>
            <a-form-item v-if="n === rowNum && rowNum > 1">
              <a-popconfirm
                title="确定删除吗?"
                @confirm="() => rowDelete()"
              >
                <a>删除</a>
              </a-popconfirm>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <error-modal ref="errorModal"></error-modal>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import ErrorModal from '../../global/modules/ErrorModal'

  export default {
    name: 'EmployeeFamilyModal',
    components: {
      ErrorModal,
      SelectPage,
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        rowNum: 1,  // 默认一条数据
        birthday: 'birthday', // 出生日期
        workUnit: 'workUnit',  // 工作单位
        familyName: 'familyName', //家庭成员姓名
        contractTel: 'contractTel', // 联系电话
        relationshipSelf: 'relationshipSelf', // 所属关系
        dateFormat: "YYYY-MM-DD",
        settleDomainBelongs: [], // 结算主体与所属单位
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
          empNo: { rules: [{ required: true, message: '选择员工！' }] },
          familyName1: { rules: [{ required: true, message: '填写姓名！' }, { validator: this.validateName }] },
          relationshipSelf1: { rules: [{ required: true, message: '选择关系！' }] },
          contractTel1: { rules: [{ required: true, message: '填写联系电话！' }, { validator: this.validateContractTel }] },
        },
        url: {
          add: 'hrBase/tempfamily/importListAdd',
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
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            const httpurl = this.url.add
            const method = 'post'
            let formData = Object.assign(this.model, values)
            // 处理表单数据
            var jsonData = []

            for (var i = 1; i <= this.rowNum; i++) {
              var jsonDataTemp = {}
              jsonDataTemp.员工编码 = formData.empNo
              jsonDataTemp.家庭成员姓名 = formData[this.familyName + i]
              jsonDataTemp.出生日期 = formData[this.birthday + i] ? (formData[this.birthday + i]).format(this.dateFormat) : null
              jsonDataTemp.与本人关系 = formData[this.relationshipSelf + i]
              jsonDataTemp.工作单位 = formData[this.workUnit + i]
              jsonDataTemp.联系电话 = formData[this.contractTel + i]
              jsonData.push(jsonDataTemp)
            }
            httpAction(httpurl, jsonData, method).then((res) => {
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
      // 表单关闭
      handleCancel() {
        this.close()
      },
      // 数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.rowNum = 1
        this.validatorRules = {
          empNo: { rules: [{ required: true, message: '选择员工！' }] },
          familyName1: { rules: [{ required: true, message: '填写姓名！' }, { validator: this.validateName }] },
          relationshipSelf1: { rules: [{ required: true, message: '选择关系！' }] },
          contractTel1: { rules: [{ required: true, message: '填写联系电话！' }, { validator: this.validateContractTel }] },
        }
        this.settleDomainBelongs = []
        this.relationshipSelfBelongs = []
      },
      // 增加行
      addRowNum() {
        this.rowNum++
        this.validatorRules[this.familyName + this.rowNum] = { rules: [{ required: true, message: '填写姓名！' }, { validator: this.validateName }] }
        this.validatorRules[this.relationshipSelf + this.rowNum] = { rules: [{ required: true, message: '选择关系！' }] }
        this.validatorRules[this.contractTel + this.rowNum] = { rules: [{ required: true, message: '填写联系电话！' }, { validator: this.validateContractTel }] }
      },
      // 删除行
      rowDelete() {
        this.rowNum--
        delete this.validatorRules[this.familyName + (this.rowNum + 1)]
        delete this.validatorRules[this.relationshipSelf + (this.rowNum + 1)]
        delete this.validatorRules[this.contractTel + (this.rowNum + 1)]
      },
      // 员工选择改变
      handleIdEmployeeChange(value) {
        this.model.settleDomainName = '-'
        if (Object.keys(this.settleDomainBelongs).length) {
          this.model.settleDomainName = (this.settleDomainBelongs).hasOwnProperty(value.settleDomainId) ? this.settleDomainBelongs[value.settleDomainId]['departName'] : '-'
        }
        this.form.setFieldsValue(pick(this.model, 'settleDomainName'))
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
      /******************************************* 验证规则 *******************************************/
      // 姓名验证
      validateName(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        const strLenght = value.length
        if (strLenght < 2 || strLenght > 10) {  // 长度验证
          callback('2-10个字符！')
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
          callback('格式不正确！')
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
