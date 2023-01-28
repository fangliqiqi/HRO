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
              <!-- <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择单位"
                v-decorator="['unitId', {}]"
                :dropdownMatchSelectWidth="false"
                style="width: 180px"
              >
                <a-select-option
                  v-for="(value, key) in unitBelongs"
                  :key="key"
                  :value="value.id"
                  @click="handleUnitChange(value)"
                >{{ value.customerName }}</a-select-option>
              </a-select>
              :resList="resList"
              -->
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
                mode="multiple"
                :disabled="settleDomainDisabled"
                placeholder="请选择结算主体（可多选）"
                v-decorator="['settleDomainIds', validatorRules.settleDomainIds]"
                :dropdownMatchSelectWidth="false"
                style="width: 375px"
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
                <a-checkbox value="1">全选</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="员工身份证"
              class="stepFormText"
            >
              <a-input
                placeholder="请输入员工身份证"
                v-decorator="['empIdCard', validatorRules.empIdCard]"
                style="width: 180px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="缴纳月份"
              class="stepFormText"
              v-if="createType==1"
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
            <a-form-item
              label="截止月份"
              class="stepFormText"
              v-if="createType==2"
            >
              <a-select
                placeholder="请选择截止月份"
                v-decorator="['payMonths', validatorRules.payMonths]"
                :dropdownMatchSelectWidth="false"
                style="width: 180px"
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
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'ForecastLibraryAfreshModal',
    components: {
      SelectPage
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        createType: 1,  // 生成方式【1：缴纳月份；2：截止月份】
        confirmLoading: false,
        settleDomainDisabled: true,
        form: this.$form.createForm(this),
        unitBelongs: [],  // 单位和结算主体
        settleDomainBelongs: [], // 结算主体
        yearMonthArrBelongs: [],  // 年和月组成的字符串的数组
        validatorRules: {
          payMonths: {rules: [{ required: true, message: '请选择月份！' }]},
          settleDomainIds: {rules: [{ required: true, message: '请选择结算主体！' }]},
          empIdCard: { rules: [{ validator: this.validateEmpIdCard }] },
        },
        url: {
          add: 'hrSocial/tforecastlibrary/createForecastlibaryByParam',
          createForecastlibaryByParam2: 'hrSocial/tforecastlibrary/createForecastlibaryByParam2',
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
            const method = 'post'
            let formData = Object.assign(this.model, values)
            if (Number(this.createType) === 1) { // 按缴纳月份
              httpurl += this.url.add
              formData.payMonths = formData.payMonths.join(",") // 转字符串
              httpurl += `?payMonths=${formData.payMonths}`
            } else {  // 截止月份
              httpurl += this.url.createForecastlibaryByParam2
              httpurl += `?createMonths=${formData.payMonths}`
            }
            formData.settleDomainIds = formData.settleDomainIds ? formData.settleDomainIds.join(",") : '' // 转字符串
            if (formData.settleDomainIds != null && formData.settleDomainIds != '') {
              if (formData.unitId != null) {
                httpurl += `&unitId=${formData.unitId}`
              }
              httpurl += `&settleDomainIds=${formData.settleDomainIds}`
            }
            if (formData.empIdCard != null && formData.empIdCard != '') {
              httpurl += `&empIdCard=${formData.empIdCard}`
            }
            httpAction(httpurl, {}, method, 1000*60*10).then((res) => {
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
        this.createType = 1  // 生成方式【1：缴纳月份；2：截止月份】
        this.confirmLoading = false
        this.settleDomainDisabled = true
        this.unitBelongs = []  // 单位和结算主体
        this.settleDomainBelongs = [] // 结算主体
        this.yearMonthArrBelongs = [] // 年和月组成的字符串的数组
        this.validatorRules.settleDomainIds = {rules: [{ required: true, message: '请选择结算主体！' }]}
      },
      // 单位选择变化
      handleUnitChange(value) {
        this.settleDomainBelongs = []
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({unitId:value, checked: ['0']}, 'unitId', 'checked'))
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
              this.form.setFieldsValue(pick({settleDomainIds: settleDomainOptions, checked: ['1']}, 'settleDomainIds', 'checked'))
            })
          }else{
            this.$nextTick(() => {
              this.form.setFieldsValue(pick({settleDomainIds: []}, 'settleDomainIds'))
            })
          }
        })
      },
      // 全选功能
      onCheckBoxChange(checked) {
        if (checked.length === 1) {  // 全选
          let settleDomainOptions = []
          for (const item of this.settleDomainBelongs) {
            settleDomainOptions.push(item.id)
          }
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({settleDomainIds: settleDomainOptions}, 'settleDomainIds'))
          })
        } else {  // 取消
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({settleDomainIds: []}, 'settleDomainIds'))
          })
        }
      },
      /******************************************* 验证规则 *******************************************/
      // 身份证验证
      validateEmpIdCard(rule, value, callback) {
        // 是否为空
        if (!value) {
          this.validatorRules.settleDomainIds = {rules: [{ required: true, message: '请选择结算主体！' }]}
          callback()
          return false
        }
        // 18位
        if (value.length !== 18) {
          callback('请填写18位身份证号！')
          return false
        }

        // var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
        // //号码规则校验

        // if (!format.test(value)) {
        //   callback('身份证号有误！')
        //   return false
        // }

        //区位码校验
        //出生年月日校验  前正则限制起始年份为1900;
        var year = value.substr(6, 4),//身份证年
          month = value.substr(10, 2),//身份证月
          date = value.substr(12, 2),//身份证日
          time = Date.parse(`${month}-${date}-${year}`),//身份证日期时间戳date
          now_time = Date.parse(new Date()),//当前时间戳
          dates = (new Date(year, month, 0)).getDate()//身份证当月天数
        if (time > now_time || date > dates) {
          callback('身份证号有误！')
          return false
        }
        this.validatorRules.settleDomainIds = {}
        callback()
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
