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
              label="生成月份"
              class="stepFormText"
            >
              <a-month-picker
                style="width: 450px"
                placeholder="请选择费用归属月份（单选）"
                v-decorator="['payMonths', validatorRules.payMonths]"
                format="YYYYMM"
                :allowClear="false"
                @change="handleChangeMonth"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="客户单位"
              class="stepFormText"
            >
              <!-- <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择客户单位"
                v-decorator="['unitId', validatorRules.unitId]"
                :dropdownMatchSelectWidth="false"
                style="width: 450px"
                @change="handleUnitChange"
              >
                <a-select-option
                  v-for="(value, key) in unitBelongs"
                  :key="key"
                  :value="value.id"
                >{{ value.customerName }}</a-select-option>
              </a-select> -->
              <select-page
                placeholder="请选择单位"
                style="width: 450px"
                v-decorator="['unitId']"
                :searchUrl="'/hrBase/customerBusiness/customerInfo/getCustomerOwnerPage?customerName='"
                :title="'customerName'"
                :allowClear="false"
                @select="handleUnitChange"
                :id="'customerId'"
              ></select-page>

            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="结算主体"
              class="stepFormText"
            >
              <a-select
                :disabled="settleDomainDisabled"
                placeholder="请选择结算主体"
                v-decorator="['settleDomainIds', validatorRules.settleDomainIds]"
                :dropdownMatchSelectWidth="false"
                style="width: 450px"
              >
                <a-select-option
                  v-for="value in settleDomainBelongs"
                  :key="value.id"
                  :value="value.id"
                >{{ value.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="员工编码"
              class="stepFormText"
            >
              <a-input
                placeholder="请输入员工编码"
                v-decorator="['empNo']"
                style="width: 450px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- <a-row>
          <a-col :span="24">
            <a-form-item
              label="缴纳月份"
              class="stepFormText"
            >
              <a-select
                mode="multiple"
                placeholder="请选择缴纳月份（可多选）"
                v-decorator="['payMonths', validatorRules.payMonths]"
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
        </a-row> -->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'ComparisonLibraryAddModal',
    components: {
      SelectPage
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        settleDomainDisabled: true,
        form: this.$form.createForm(this),
        unitBelongs: [],  // 单位和结算主体
        settleDomainBelongs: [], // 结算主体
        yearMonthArrBelongs: [],  // 年和月组成的字符串的数组
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          payMonths: {rules: [{ required: true, message: '请选择费用归属月份（单选）!' }]},
          settleDomainIds: {rules: [{ required: true, message: '请选择结算主体！' }]},
          unitId: {rules: [{ required: true, message: '请选择客户单位！' }]},
        },
        url: {
          add: 'hrSocial/tcomparisonlibrary/createComparisonByParams',
        },
      }
    },
    methods: {
      add() {
        // 获取当前用户所拥有的单位

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
            let httpurl = `${this.url.add}?payMonths=${values.payMonths.format('YYYYMM')}&unitId=${values.unitId}&settleDomainIds=${values.settleDomainIds}`
            if (values.empNo) {
              httpurl += `&empNo=${values.empNo}`
            }
            httpAction(httpurl, '', 'post',1000 * 60).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.msg || res.message)
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
        this.type = '' // 类型（锁定还是解锁）
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.settleDomainDisabled = true
        this.unitBelongs = []  // 单位和结算主体
        this.settleDomainBelongs = [] // 结算主体
        this.yearMonthArrBelongs = [] // 年和月组成的字符串的数组
      },
      handleChangeMonth(value){
        const unitId = this.form.getFieldValue('unitId')
        if(unitId){
          this.getSettlement(value.format('YYYYMM'),unitId)
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({settleDomainIds:[]}, 'settleDomainIds'))
        })
      },
      // 单位选择变化
      handleUnitChange(value) {
        const payMonths = this.form.getFieldValue('payMonths')
        if(payMonths){
          this.getSettlement(payMonths.format('YYYYMM'),value)
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({settleDomainIds:[],unitId:value}, 'settleDomainIds','unitId'))
        })
      },
      getSettlement(createMonth,unitId){
        httpAction(`/hrSocial/tforecastform/getByUnitIdAndCreateMonth?createMonth=${createMonth}&unitId=${unitId}`,null,'get').then(res=>{
          if(res.code === 200){
            this.settleDomainBelongs = res.data
            this.settleDomainDisabled = false
          }else{
            this.$message.warning(res.msg)
          }
        })
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
