<template>
  <a-modal
    :title="title"
    :width="1200"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        v-if="addButton"
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >确定认领</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form ant-disabled-form"
      >
        <a-row>
          <!-- 单位账户信息 -->
          <a-col :span="9">
            <a-row>
              <a-col :span="24">
                <a-tabs defaultActiveKey="1">
                  <a-tab-pane
                    key="1"
                    tab="单位账户信息"
                  >
                    <a-row>
                      <a-col :span="24">
                        <a-form-item
                          label="来款单位"
                          class="stepFormText"
                        >
                          <a-input
                            :disabled="true"
                            placeholder="请输入来款单位"
                            v-decorator="['incomeBelong', {}]"
                            style="width: 300px"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>

                    <a-row>
                      <a-col :span="24">
                        <a-form-item
                          label="银行账号"
                          class="stepFormText"
                        >
                          <a-input
                            :disabled="true"
                            placeholder="请输入银行账号"
                            v-decorator="['incomeBank', { rules: [{ pattern:/^([0-9]{1})(\d{9,24})$/,message: '银行账号必须是10到25位数字!' }] }]"
                            style="width: 300px"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>

                    <a-row>
                      <a-col :span="24">
                        <a-form-item
                          label="进账时间"
                          class="stepFormText"
                        >
                          <a-input
                            :disabled="true"
                            placeholder="进账时间"
                            v-decorator="['incomeDate', {}]"
                            style="width: 300px;"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="24">
                        <a-form-item
                          label="到款单位"
                          class="stepFormText"
                        >
                          <a-input
                            :disabled="true"
                            placeholder="到款单位"
                            v-decorator="['paymentUnitName']"
                            style="width: 300px;"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>

                    <a-row>
                      <a-col :span="24">
                        <a-form-item
                          label="财务说明"
                          class="stepFormText"
                        >
                          <a-textarea
                            :rows="2"
                            :disabled="true"
                            placeholder="财务说明"
                            v-decorator="['financeRemark', {}]"
                            style="width: 300px;"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-tab-pane>
                </a-tabs>
              </a-col>
            </a-row>
          </a-col>

          <!-- 财务进账信息 -->
          <a-col :span="15">
            <a-row>
              <a-col :span="24">
                <a-tabs defaultActiveKey="1">
                  <a-tab-pane
                    key="1"
                    tab="财务进账信息"
                  >
                  </a-tab-pane>
                </a-tabs>
                <!-- 结算主体和认领金额 -->
                <a-row
                  v-for="(i,k) in addLength"
                  :key="i"
                >
                  <a-col :span="24">
                    <a-form-item
                      label="款项类型"
                      class="stepFormText"
                    >
                      <a-radio-group
                        class="fontiframe"
                        name="radioGroup"
                        v-decorator="[`reciveType[${k}]`, {initialValue: '1', rules: [{ required: true, message: '请选择！' }]}]"
                      >
                        <a-radio
                          class="radioGroup"
                          v-for="(value, key) in reciveTypeOptions"
                          @change="changeRadio(k,$event)"
                          :key="key"
                          :value="key"
                        >{{ value }}</a-radio>
                      </a-radio-group>
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item
                      label="结算主体"
                      class="stepFormText"
                      v-show="showDepart[k]"
                    >
                      <select-page
                        :id="'id'"
                        @change="onChange"
                        :allowClear="false"
                        :title="'departName'"
                        :triggerChange="true"
                        :style="{width: '150px'}"
                        placeholder="请选择结算主体"
                        v-decorator="[`settleDomainId[${k}]`, validatorRules.settleDomainId]"
                        :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                      ></select-page>
                    </a-form-item>
                    <a-form-item label="单位名称" v-if="showDepart[k]">
                      <a-input
                        :disabled="true"
                        placeholder="所属单位名称"
                        style="width: 150px"
                        v-decorator="[`customerName[${k}]`, {}]"
                        :title="customerNameTitle.hasOwnProperty(k) ? customerNameTitle[k].customerName : ''"
                      />
                    </a-form-item>
                    <a-form-item
                      label="单位名称"
                      class="stepFormText"
                      v-show="!showDepart[k]"
                    >
                      <select-page
                        :id="'id'"
                        :allowClear="false"
                        :title="'customerName'"
                        :triggerChange="true"
                        :style="{width: '150px'}"
                        placeholder="请选择单位名称"
                        v-decorator="[`unitId[${k}]`, validatorRules.unitId]"
                        :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                      ></select-page>
                    </a-form-item>
                    <a-form-item label="认领金额">
                      <a-input
                        placeholder="金额"
                        style="width: 90px"
                        v-decorator="[`reciveFee[${k}]`, validatorRules.reciveFee]"
                      />
                    </a-form-item>
                    <a-icon
                      class="dynamic-add-button"
                      type="plus-circle"
                      @click="addItem()"
                    />
                    <a-icon
                      v-if="addLength.length > 1"
                      class="dynamic-add-button dynamic-delete-button"
                      type="minus-circle-o"
                      :disabled="addLength.length === 1"
                      @click="remove(k)"
                    />
                  </a-col>
                </a-row>
                <!-- 客服说明 -->
                <a-row>
                  <a-col :span="24">
                    <a-form-item
                      label="客服说明"
                      class="stepFormText"
                    >
                      <a-textarea
                        :rows="2"
                        placeholder="客服说明"
                        v-decorator="['serverRemark', {}]"
                        style="width: 560px;"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
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
    name: 'WaitReceiveAddModal',
    components: {
      SelectPage,
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        addButton: true, // 添加按钮
        confirmLoading: false,
        form: this.$form.createForm(this),
        dateFormat: "YYYY-MM-DD",
        addLength: [0], // 进账列数
        customerNameTitle: [],
        reciveTypeOptions: {},  // 款项类型
        settleDomainBelongs: [],  // 结算主体
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          settleDomainId: {rules: [{ required: true, message: '请选择结算主体' }]},
          unitId: {rules: [{ required: false, message: '请选择客户单位' }]},
          reciveFee: {rules: [{ validator: this.validatReciveFee }]},
        },
        url: {
          add: 'salary/treciverecord/batchSave',
        },
        showDepart:[true],

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

        this.model.incomeDate = this.model.incomeDate.substring(0, 10)
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({'reciveFee[0]': this.model.associcationFee}, 'reciveFee[0]'))
          this.form.setFieldsValue(pick(this.model, 'incomeBelong', 'incomeBank', 'incomeDate', 'financeRemark','paymentUnitName'))
        })
      },
      changeRadio(k,e){
        if(String(e.target.value) === '5'){
          this.showDepart[k] = false
          this.validatorRules.settleDomainId.rules = []
          this.validatorRules.unitId.rules = [{ required: true, message: '请选择客户单位' }]
        }else{
          this.showDepart[k] = true
          this.validatorRules.unitId.rules = []
          this.validatorRules.settleDomainId.rules = [{ required: true, message: '请选择结算主体' }]
        }
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            let httpurl = ''
            httpurl += this.url.add
            const method = 'post'
            const formData = Object.assign(this.model, values)
            let recordList = []
            let sumReciveFee = 0
            
            // 字段数组处理
            this.showDepart.forEach((item,i)=>{
              sumReciveFee += (formData.reciveFee[i] * 1)
              if(item){
                recordList.push({'reciveId': formData.id, 'settleDomainId': formData.settleDomainId[i], 'reciveFee': formData.reciveFee[i], 'reciveType': formData.reciveType[i], 'serverRemark': formData.serverRemark})
              }else{
                recordList.push({
                  'reciveId': formData.id,
                  'unitId': formData.unitId[i],
                  'reciveFee': formData.reciveFee[i],
                  'reciveType': formData.reciveType[i],
                  'serverRemark': formData.serverRemark})
              }
            })
            // 判断金额是不是大于入账待认领总金额
            if ( this.formatFloat(sumReciveFee) > this.model.associcationFee) {
              that.$message.warning('认领金额大于待认领金额数据！')
              return false
            }

            that.confirmLoading = true

            // 拼接请求数据
            let reqFormData = {}
            reqFormData.recordList = JSON.stringify(recordList)
            httpAction(httpurl, reqFormData, method).then((res) => {
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
        this.$emit('close')
        this.visible = false
        this.addButton = true // 添加按钮
        this.confirmLoading = false
        this.addLength = [0] // 进账列数
        this.customerNameTitle = []
        this.reciveTypeOptions = {}  // 款项类型
        this.settleDomainBelongs = []  // 结算主体
        this.showDepart = [true]
      },
      // 添加行
      addItem() {
        this.addLength.push(String(new Date().getTime()));
        this.showDepart.push(true)
      },
      // 删除行
      remove(k) {
        if (k < this.addLength.length - 1) {
          this.$message.error('请从最后一个开始删除！')
          return false
        }

        if (this.addLength.length === 1) {
          this.addLength.push(String(new Date().getTime()))
        } else {
          this.addLength.splice(k, 1)
          this.customerNameTitle.splice(k, 1)
          this.showDepart.splice(k, 1)
        }
      },
      onChange(selectedValue, option) {
        if (option && this.showDepart) { // 选择
          const keyStr = option.context.$attrs.id.split('[')[1]
          const key = keyStr.substr(0, keyStr.length - 1)
          const keyName = `customerName[${key}]`
          const lists = option.context.lists
          let customerName = ''
          // 循环查找点击的list
          if (lists.length > 0) {
            for (const item of lists) {
              if (String(item.id) === String(selectedValue)) {
                customerName += item.item.customerName
                break
              }
            }
          }
          // 设置字段值
          let setValue = {}
          setValue[keyName] = customerName
          this.customerNameTitle[key] = {customerName: customerName}
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(setValue, keyName))
          })
          
        }
      },
      /******************************************* 验证规则 *******************************************/
      // 认领金额验证
      validatReciveFee(rule, value, callback) {
        if (!value) {
          callback('不能为空')
          return false
        }
        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          callback('两位小数')
          return false
        }
        callback()
        return true
      },
      // 精度处理
      formatFloat(f, digit = 2) {
        const m = Math.pow(10, digit)
        return Math.round(f * m) / m
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}
.ant-disabled-form {
  :global(.ant-input-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-select-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-checkbox-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-radio-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
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
.dynamic-add-button {
  cursor: pointer;
  position: relative;
  top: 11px;
  font-size: 17px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button {
  margin-left: 5px;
}
.dynamic-add-button:hover {
  color: #777;
}
.dynamic-add-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
