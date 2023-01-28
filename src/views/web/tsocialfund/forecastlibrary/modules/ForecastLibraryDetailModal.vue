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
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
      <a-button
        v-if="editButton"
        key="handleOk"
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >保存</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form ant-disabled-form"
      >
        <!------------------------------------- 基本数据详情 ------------------------------------->
        <a-row>
          <a-col :span="24">
            <a-form-item style="font-size: 16px; font-weight:bold; margin-bottom: 0px">
              {{ model.empName }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="身份证"
              class="stepFormText"
            >
              {{ model.empIdcard }}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="社保缴纳月份"
              class="stepFormText"
            >
              {{ model.socialPayMonth }}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="社保生成月份"
              class="stepFormText"
            >
              {{ model.socialCreateMonth }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="员工编码"
              class="stepFormText"
            >
              {{ model.empNo }}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="公积金缴纳月份"
              class="stepFormText"
            >
              {{ model.providentPayMonth }}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="公积金生成月份"
              class="stepFormText"
            >
              {{ model.providentCreateMonth }}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="结算状态"
              class="stepFormText"
            >
              {{ settleFlagOption[model.settleFlag] }}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="结算月份"
              class="stepFormText"
            >
              {{ model.settleMonth }}
            </a-form-item>
          </a-col>
        </a-row>
        <!------------------------------------- 表单数据详情 ------------------------------------->
        <a-row>
          <a-card class="staffCard">
            <a-row>
              <a-col :span="24">
                <a-form-item style="font-size: 16px;font-weight:bold;margin-bottom: 0px;margin-left: 480px;">
                  社保与公积金明细
                </a-form-item>
              </a-col>
            </a-row>
            <table class="table1" aria-describedby="社保与公积金明细">
              <tr class="tr1">
                <th
                  class="tit td1"
                  rowspan="4"
                  scope="col"
                  style="background-color: #2FA5ED; color: #fff;"
                >单位</th>
                <th class="tit td1" scope="col">类型</th>
                <th
                  class="tit td1"
                  scope="col"
                  v-if="socialShow"
                >养老保险</th>
                <th
                  class="tit td1"
                  scope="col"
                  v-if="socialShow"
                >医疗保险</th>
                <th
                  class="tit td1"
                  scope="col"
                  v-if="socialShow"
                >失业保险</th>
                <th
                  class="tit td1"
                  scope="col"
                  v-if="socialShow"
                >工伤保险</th>
                <th
                  class="tit td1"
                  scope="col"
                  v-if="socialShow"
                >生育保险</th>
                <th
                  class="tit td1"
                  scope="col"
                  v-if="socialShow"
                >大病救助</th>
                <!-- <td
                  class="tit td1"
                  v-if="socialShow"
                >补缴利息</td> -->
                <th
                  class="tit td1"
                  scope="col"
                  v-if="socialShow"
                >社保总计</th>
                <th
                  class="tit td1"
                  scope="col"
                  v-if="socialShow"
                >社保卡费</th>
                <th
                  class="tit td1"
                  scope="col"
                  v-if="fundShow"
                >住房公积金</th>
              </tr>
              <tr class="tr1">
                <td class="tit td1">单位基数</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitPensionBase }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitMedicalBase }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitUnemploymentBase }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitInjuryBase }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitBirthBase }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitBigailmentBase }}</td>
                <!-- <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td> -->
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="fundShow"
                >{{ model.unitFundBase }}</td>
              </tr>
              <tr class="tr1">
                <td class="tit td1">单位比例</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitPersionPro }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitMedicalPro }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitUnemploymentPro }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitInjuryPro }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitBirthPro }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitBigailmentPro }}</td>
                <!-- <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td> -->
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="fundShow"
                >{{ model.unitFundProp }}</td>
              </tr>
              <tr class="tr1">
                <td class="tit td1">单位金额</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-tooltip
                      v-if="editButton"
                      placement="top"
                      :title="msg"
                    >
                      <a-input
                        placeholder="金额"
                        v-decorator="['unitPensionFee', {rules: [{ validator: this.validateMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.unitPensionFee }}</span>
                  </a-form-item>
                </td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-tooltip
                      v-if="editButton"
                      placement="top"
                      :title="msg"
                    >
                      <a-input
                        placeholder="金额"
                        v-decorator="['unitMedicalFee', {rules: [{ validator: this.validateMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.unitMedicalFee }}</span>
                  </a-form-item>
                </td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-tooltip
                      v-if="editButton"
                      placement="top"
                      :title="msg"
                    >
                      <a-input
                        placeholder="金额"
                        v-decorator="['unitUnemploymentFee', {rules: [{ validator: this.validateMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.unitUnemploymentFee }}</span>
                  </a-form-item>
                </td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-tooltip
                      v-if="editButton"
                      placement="top"
                      :title="msg"
                    >
                      <a-input
                        placeholder="金额"
                        v-decorator="['unitWorkInjuryFee', {rules: [{ validator: this.validateMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.unitWorkInjuryFee }}</span>
                  </a-form-item>
                </td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-tooltip
                      v-if="editButton"
                      placement="top"
                      :title="msg"
                    >
                      <a-input
                        placeholder="金额"
                        v-decorator="['unitBirthFee', {rules: [{ validator: this.validateMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.unitBirthFee }}</span>
                  </a-form-item>
                </td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-tooltip
                      v-if="editButton"
                      placement="top"
                      :title="msg"
                    >
                      <a-input
                        placeholder="金额"
                        v-decorator="['unitBitmailmentFee', {rules: [{ validator: this.validateMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.unitBitmailmentFee }}</span>
                  </a-form-item>
                </td>
                <!-- <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <span>-</span>
                  </a-form-item>
                </td> -->
                <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-input
                      v-if="editButton"
                      :disabled="true"
                      placeholder="金额"
                      v-decorator="['unitSocialSum', {}]"
                      :style="styleWidth"
                    />
                    <span v-else>{{ model.unitSocialSum }}</span>
                  </a-form-item>
                </td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <span>-</span>
                  </a-form-item>
                </td>
                <td
                  class="tit td1"
                  v-if="fundShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-tooltip
                      v-if="editButton"
                      placement="top"
                      :title="msg"
                    >
                      <a-input
                        placeholder="金额"
                        v-decorator="['unitFundSum', {rules: [{ validator: this.validateMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.unitFundSum }}</span>
                  </a-form-item>
                </td>
              </tr>
              <!-- 个人信息 -->
              <tr class="tr1">
                <td
                  class="tit td1"
                  rowspan="3"
                  style="background-color: #2FA5ED; color: #fff;"
                >个人</td>
                <td class="tit td1">个人基数</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.personalPensionBase }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.personalMedicalBase }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.personalUnemploymentBase }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.personalBigailmentBase }}</td>
                <!-- <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td> -->
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="fundShow"
                >{{ model.personalFundBase }}</td>
              </tr>
              <tr class="tr1">
                <td class="tit td1">个人比例</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.personalPersionPro }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.personalMedicalPro }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.personalUnemploymentPro }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <!-- <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td> -->
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="fundShow"
                >{{ model.personalFundProp }}</td>
              </tr>
              <tr class="tr1">
                <td class="tit td1">个人金额</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-tooltip
                      v-if="editButton"
                      placement="top"
                      :title="msg"
                    >
                      <a-input
                        placeholder="金额"
                        v-decorator="['personalPensionFee', {rules: [{ validator: this.validateMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.personalPensionFee }}</span>
                  </a-form-item>
                </td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-tooltip
                      v-if="editButton"
                      placement="top"
                      :title="msg"
                    >
                      <a-input
                        placeholder="金额"
                        v-decorator="['personalMedicalFee', {rules: [{ validator: this.validateMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.personalMedicalFee }}</span>
                  </a-form-item>
                </td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-tooltip
                      v-if="editButton"
                      placement="top"
                      :title="msg"
                    >
                      <a-input
                        placeholder="金额"
                        v-decorator="['personalUnemploymentFee', {rules: [{ validator: this.validateMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.personalUnemploymentFee }}</span>
                  </a-form-item>
                </td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-tooltip
                      v-if="editButton"
                      placement="top"
                      :title="msg"
                    >
                      <a-input
                        placeholder="金额"
                        v-decorator="['personalBigmailmentFee', {rules: [{ validator: this.validateMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.personalBigmailmentFee }}</span>
                  </a-form-item>
                </td>
                <!-- <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td> -->
                <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-input
                      v-if="editButton"
                      :disabled="true"
                      placeholder="金额"
                      v-decorator="['personalSocialSum', {}]"
                      :style="styleWidth"
                    />
                    <span v-else>{{ model.personalSocialSum }}</span>
                  </a-form-item>
                </td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="fundShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-tooltip
                      v-if="editButton"
                      placement="top"
                      :title="msg"
                    >
                      <a-input
                        placeholder="金额"
                        v-decorator="['personalFundSum', {rules: [{ validator: this.validateMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.personalFundSum }}</span>
                  </a-form-item>
                </td>
              </tr>
            </table>
            <a-row>
              <a-col :span="10">
                <a-form-item
                  label="单位"
                  style="margin-bottom: 0px;"
                >
                  {{ model.customerName }}
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="结算主体"
                  style="margin-bottom: 0px;"
                >
                  {{ model.departName }}
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'ForecastLibraryDetailModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        fundShow: true, // 公积金是否存在
        socialShow: true, // 社保是否存在
        editButton: false, // 是否显示提交修改按钮
        confirmLoading: false,
        msg: '请输入两位有效数字！', // 提示
        styleWidth: 'width: 75px;height:23px;',
        form: this.$form.createForm(this),
        fundInfo: {}, // 公积金数据
        socialInfo: {}, // 社保数据
        dateFormat: 'YYYYMM',  // 时间格式化类型
        settleDomainBelongs: [],  // 结算主体和单位
        organizationBelongs: [],  // 社保户、公积金户
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        url: {
          add: 'hrSocial/tforecastlibrary',
        },
        settleFlagOption: []
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

        if (!this.model.socialProvince) { // 是否有社保
          this.socialShow = false
        }

        if (!this.model.fundProvince) { // 是否有公积金
          this.fundShow = false
        }

        this.model.socialPayMonth = this.model.socialPayMonth ? this.model.socialPayMonth : '-' // 社保缴纳月份
        this.model.socialCreateMonth = this.model.socialCreateMonth ? this.model.socialCreateMonth : '-'  // 社保生成月份
        this.model.providentPayMonth = this.model.providentPayMonth ? this.model.providentPayMonth : '-' // 公积金缴纳月份
        this.model.providentCreateMonth = this.model.providentCreateMonth ? this.model.providentCreateMonth : '-'  // 公积金生成月份
        this.model.customerName = this.model.departName = '-' // 单位

        if (Object.keys(this.settleDomainBelongs).length) { // 单位、结算主体
          this.model.customerName = (this.settleDomainBelongs).hasOwnProperty(this.model.settleDomainId) ? this.settleDomainBelongs[this.model.settleDomainId]['customerName'] : '-'
          this.model.departName = (this.settleDomainBelongs).hasOwnProperty(this.model.settleDomainId) ? this.settleDomainBelongs[this.model.settleDomainId]['departName'] : '-'
        }

        if (this.editButton) {
          if (this.socialShow) {
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'unitPensionFee', 'unitMedicalFee', 'unitUnemploymentFee', 'unitWorkInjuryFee', 'unitBirthFee', 'unitBitmailmentFee',
              'unitSocialSum', 'personalPensionFee', 'personalMedicalFee', 'personalUnemploymentFee', 'personalBigmailmentFee', 'personalSocialSum'
              ))
            })
          }

          if (this.fundShow) {
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'unitFundSum', 'personalFundSum'))
            })
          }

          // this.$nextTick(() => {
          //   this.form.setFieldsValue(pick(this.model, 'unitPensionFee', 'unitMedicalFee', 'unitUnemploymentFee', 'unitWorkInjuryFee', 'unitBirthFee', 'unitBitmailmentFee',
          //   'unitSocialSum', 'unitFundSum', 'personalPensionFee', 'personalMedicalFee', 'personalUnemploymentFee', 'personalBigmailmentFee', 'personalSocialSum', 'personalFundSum'
          //   ))
          // })
        }
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            const httpurl = this.url.add
            const method = 'put'
            let formData = Object.assign(this.model, values)
            let requestData = {}
            requestData.id = formData.id
            
            if (this.socialShow) {  // 有社保
              requestData.unitPensionFee = formData.unitPensionFee
              requestData.unitMedicalFee = formData.unitMedicalFee
              requestData.unitUnemploymentFee = formData.unitUnemploymentFee
              requestData.unitWorkInjuryFee = formData.unitWorkInjuryFee
              requestData.unitBirthFee = formData.unitBirthFee
              requestData.unitBitmailmentFee = formData.unitBitmailmentFee
              requestData.unitSocialSum = formData.unitSocialSum
              requestData.personalPensionFee = formData.personalPensionFee
              requestData.personalMedicalFee = formData.personalMedicalFee
              requestData.personalUnemploymentFee = formData.personalUnemploymentFee
              requestData.personalBigmailmentFee = formData.personalBigmailmentFee
              requestData.personalSocialSum = formData.personalSocialSum
            }

            if (this.fundShow) {  // 有公积金
              requestData.unitFundSum = formData.unitFundSum
              requestData.personalFundSum = formData.personalFundSum
            }

            httpAction(httpurl, requestData, method).then((res) => {
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
      // 关闭功能与数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.fundShow = true // 公积金是否存在
        this.socialShow = true // 社保是否存在
        this.editButton = false // 是否显示提交修改按钮
        this.confirmLoading = false
        this.msg = '请输入两位有效数字！' // 提示
        this.settleDomainBelongs = [] // 单位和结算主体
        this.organizationBelongs = [] // 社保户、公积金户
      },
      /******************************************* 验证规则 *******************************************/
      // 金额验证
      validateMoney(rule, value, callback) {
        if (!value) {
          callback('')
          return false
        }
        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          callback('')
          return false
        }
        callback()
        return true
      },
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 110px;
  }
  margin-bottom: 0px;
}
.tableFormItem {
  margin-bottom: 0px;
  margin-right: 0px;
  width: 75px;
  height: 23px;
  :global(.ant-form-item-control) {
    line-height: 23px;
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
.ant-advanced-search-form input {
  text-align: center;
}
</style>

<style scoped>
.table1 {
  border: 1px solid #ccc;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
.table1 .tr1 {
  margin: 0px;
  padding: 0;
  width: 100%;
}
.table1 .td1 {
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 40px;
  padding: 10px;
  text-align: center;
  /* width: 20%; */
}
.table1 .td2 {
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 40px;
  padding: 10px;
  width: 17%;
  text-align: center;
}
.table1 .tit {
  font-weight: bolder;
}
.table1 .input1 {
  height: 35px;
  width: 100%;
  padding: 0 5px;
}
.table1 .btn {
  width: 20%;
  font-size: 16px;
  border: none;
  background: red;
  color: #fff;
  float: right;
}
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
/* .staffCard{
  border:1px solid #fff;
  box-shadow:0 0 1px 1px #aaa,3px 0 5px 0 #aaa,0 4px 7px 0 #aaa;
} */
</style>
