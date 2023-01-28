<template>
  <a-modal
    :title="title"
    :width="600"
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
            <a-form-item
              label="单位名称"
              class="stepFormText"
            >
              <select-page
                placeholder="请选择单位"
                style="width: 375px"
                v-decorator="['unitId']"
                :searchUrl="'/hrBase/customerBusiness/customerInfo/getCustomerOwnerPage?customerName='"
                :title="'customerName'"
                :allowClear="false"
                @select="handleUnitChange"
                :id="'customerId'"
              ></select-page>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="结算主体"
              class="stepFormText"
            >
              <a-select
                allowClear
                showSearch
                mode="multiple"
                optionFilterProp="children"
                :disabled="settleDomainDisabled"
                placeholder="请选择结算主体（可多选）"
                v-decorator="['settleDomainIds', validatorRules.settleDomainIds]"
                :dropdownMatchSelectWidth="false"
                style="width: 375px"
                @change="changeSettle"
              >
                <a-select-option
                  v-for="(value, key) in settleDomainBelongs"
                  :key="key"
                  :value="value.id"
                >{{ value.departName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-checkbox-group
                @change="onCheckBoxChange"
                :disabled="settleDomainDisabled"
                v-decorator="['checked', {}]"
              >
                <a-checkbox value="1" :indeterminate="indeterminate">全选</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="结算月份"
              class="stepFormText"
            >
              <a-month-picker
                allowClear
                placeholder="请选择结算月份"
                v-decorator="['orderMonth', validatorRules.orderMonth]"
                style="width: 180px"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="生成月份"
              class="stepFormText"
            >
              <a-select
                mode="multiple"
                placeholder="请选择生成月份（可多选）"
                v-decorator="['settleMonths', validatorRules.settleMonths]"
                :dropdownMatchSelectWidth="false"
                style="width: 450px"
              >
                <a-select-option
                  v-for="(value, key) in yearMonthArrBelongs"
                  :key="key"
                  :value="value"
                >{{ value }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="收取方式"
              class="stepFormText"
            >
              <a-radio-group
                class="fontiframe"
                name="radioGroup"
                v-decorator="['type', {initialValue: '0', rules: [{ required: true, message: '收取方式不能为空！' }]}]"
              >
                <a-radio
                  class="radioGroup"
                  v-for="(value, key) in typeOptions"
                  :key="key"
                  :value="key"
                >{{ value.option }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'ForecastBillApplyModal',
    components: {
      SelectPage
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        loading:false,
        indeterminate:false,
        settleDomainDisabled: true,
        form: this.$form.createForm(this),
        dateFormat: 'YYYYMM', // 时间格式化
        settleDomainBelongs: [], // 结算主体
        yearMonthArrBelongs: [],  // 年和月组成的字符串的数组
        typeOptions: {'0': {'option': '社保|公积金|管理费', 'color': 'green'}, '1': {'option': '管理费', 'color': 'red'}}, // 类型
        validatorRules: {
          settleMonths: {rules: [{ required: true, message: '请选择生成月份！' }]},
          orderMonth: {rules: [{ required: true, message: '请选择账单月份！' }]},
          settleDomainIds: {rules: [{ required: true, message: '请选择结算主体！' }]},
        },
        url: {
          add: 'hrSocial/tforecastform/addForecastSettle',
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
            that.loading = true
            let httpurl = ''
            const method = 'post'
            let formData = Object.assign(this.model, values)
            httpurl += this.url.add
            formData.settleDomainIds = formData.settleDomainIds.join(",") // 转字符串
            formData.settleMonths = formData.settleMonths.join(",") // 转字符串
            formData.orderMonth = formData.orderMonth.format(this.dateFormat)
            httpurl += `?settleMonths=${formData.settleMonths}&settleDomainIds=${formData.settleDomainIds}&orderMonth=${formData.orderMonth}&type=${formData.type}`
            httpAction(httpurl, {}, method, 1000*60*5).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.msg || res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.loading = false
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
        this.type = '' // 类型（锁定还是解锁）
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.settleDomainDisabled = true
        this.settleDomainBelongs = [] // 结算主体
        this.yearMonthArrBelongs = [] // 年和月组成的字符串的数组
      },
      // 单位选择变化
      handleUnitChange(value) {
        this.settleDomainBelongs = []
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({unitId:value,settleDomainIds: [], checked: ['0']}, 'unitId','settleDomainIds', 'checked'))
        })
        httpAction(`/hrBase/customerBusiness/customerInfo/getSettleDomain/${value}`, {}, 'get').then((res) => {
          if(res.code === 200){
            this.settleDomainDisabled = false
            this.settleDomainBelongs = res.data
            // 默认全选中
            let settleDomainOptions = []
            for (const item of this.settleDomainBelongs) {
              settleDomainOptions.push(item.id)
            }
            this.$nextTick(() => {
              this.indeterminate = false
              this.form.setFieldsValue(pick({settleDomainIds: settleDomainOptions, checked: ['1']}, 'settleDomainIds', 'checked'))
            })
          }else{
            this.$nextTick(() => {
              this.form.setFieldsValue(pick({settleDomainIds: []}, 'settleDomainIds'))
            })
          }
        })

      },
      // 结算主体选择
      changeSettle(value){
        if(value.length==0){
          this.$nextTick(() => {
            this.indeterminate = false
            this.form.setFieldsValue(pick({checked:[]},'checked'))
          })
        }else if(value.length < this.settleDomainBelongs.length){
          this.indeterminate = true
        }else{
          this.$nextTick(() => {
            this.indeterminate = false
            this.form.setFieldsValue(pick({checked:['1']},'checked'))
          })
        }
      },
      // 全选功能
      onCheckBoxChange(checked) {
        if (checked.length === 1) {  // 全选
          let settleDomainOptions = []
          for (const item of this.settleDomainBelongs) {
            settleDomainOptions.push(item.id)
          }
          this.$nextTick(() => {
            this.indeterminate = false
            this.form.setFieldsValue(pick({settleDomainIds: settleDomainOptions}, 'settleDomainIds'))
          })
        } else {  // 取消
          this.$nextTick(() => {
            this.indeterminate = false
            this.form.setFieldsValue(pick({settleDomainIds: []}, 'settleDomainIds'))
          })
        }
      },
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 80px;
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
