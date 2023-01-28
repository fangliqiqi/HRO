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
              label="社保编号"
              class="stepFormText"
            >
              {{ model.socialSecurityNo }}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="公积金编号"
              class="stepFormText"
            >
              {{ model.providentNo }}
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
              label="社保户"
              class="stepFormText"
            >
              <a-tooltip
                placement="topLeft"
                :title="model.socialHousehold"
                style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 250px;"
              >
                {{ model.socialHousehold }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="公积金户"
              class="stepFormText"
            >
              <a-tooltip
                placement="topLeft"
                :title="model.providentHousehold"
                style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 250px;"
              >
                {{ model.providentHousehold }}
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="socialShow">
          <a-col :span="8">
            <a-form-item
              label="社保缴纳地"
              class="stepFormText"
            >
              <a-tooltip
                placement="topLeft"
                :title="model.socialPayAddr"
                style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 250px;"
              >
                {{ model.socialPayAddr }}
              </a-tooltip>
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
        <a-row v-if="fundShow">
          <a-col :span="8">
            <a-form-item
              label="公积金缴纳地"
              class="stepFormText"
            >
              <a-tooltip
                placement="topLeft"
                :title="model.providentPayAddr"
                style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 250px;"
              >
                {{ model.providentPayAddr }}
              </a-tooltip>
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
            <table class="table1">
              <tr class="tr1">
                <td
                  class="tit td1"
                  rowspan="4"
                  style="background-color: #2FA5ED; color: #fff;"
                >单位</td>
                <td class="tit td1">类型</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >养老保险</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >医疗保险</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >失业保险</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >工伤保险</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >生育保险</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >大病救助</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >补缴利息</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >社保总计</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >社保卡费</td>
                <td
                  class="tit td1"
                  v-if="fundShow"
                >住房公积金</td>
              </tr>
              <tr class="tr1">
                <td class="tit td1">单位基数</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitPensionSet }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitMedicalSet }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitUnemploymentSet }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitInjurySet }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitBirthSet }}</td>
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
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="fundShow"
                >{{ model.unitProvidentSet }}</td>
              </tr>
              <tr class="tr1">
                <td class="tit td1">单位比例</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitPensionPer }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitMedicalPer }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitUnemploymentPer }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitInjuryPer }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.unitBirthPer }}</td>
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
                <td
                  class="tit td1"
                  v-if="socialShow"
                >-</td>
                <td
                  class="tit td1"
                  v-if="fundShow"
                >{{ model.providentPercent }}</td>
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
                        v-decorator="['unitPensionMoney', {rules: [{validator: this.validateUnitPensionMoney}]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.unitPensionMoney }}</span>
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
                        v-decorator="['unitMedicalMoney', {rules: [{ validator: this.validateUnitMedicalMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.unitMedicalMoney }}</span>
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
                        v-decorator="['unitUnemploymentMoney', {rules: [{ validator: this.validateUnitUnemploymentMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.unitUnemploymentMoney }}</span>
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
                        v-decorator="['unitInjuryMoney', {rules: [{ validator: this.validateUnitInjuryMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.unitInjuryMoney }}</span>
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
                        v-decorator="['unitBirthMoney', {rules: [{ validator: this.validateUnitBirthMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.unitBirthMoney }}</span>
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
                        v-decorator="['unitBigmailmentMoney', {rules: [{ validator: this.validateUnitBigmailmentMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.unitBigmailmentMoney }}</span>
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
                        v-decorator="['companyAccrual', {rules: [{ validator: this.validateCompanyAccrual }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.companyAccrual }}</span>
                  </a-form-item>
                </td>
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
                        v-decorator="['unitProvidentSum', {rules: [{ validator: this.validateMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.unitProvidentSum }}</span>
                  </a-form-item>
                </td>
              </tr>
              <!-- 个人数据 -->
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
                >{{ model.personalPensionSet }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.personalMedicalSet }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.personalUnemploymentSet }}</td>
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
                <td
                  class="tit td1"
                  v-if="fundShow"
                >{{ model.personalProidentSet }}</td>
              </tr>
              <tr class="tr1">
                <td class="tit td1">个人比例</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.personalPensionPer }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.personalMedicalPer }}</td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >{{ model.personalUnemploymentPer }}</td>
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
                <td
                  class="tit td1"
                  v-if="fundShow"
                >{{ model.providentPercent }}</td>
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
                        v-decorator="['personalPensionMoney', {rules: [{ validator: this.validatePersonalPensionMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.personalPensionMoney }}</span>
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
                        v-decorator="['personalMedicalMoney', {rules: [{ validator: this.validatePersonalMedicalMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.personalMedicalMoney }}</span>
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
                        v-decorator="['personalUnemploymentMoney', {rules: [{ validator: this.validatePersonalUnemploymentMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.personalUnemploymentMoney }}</span>
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
                        v-decorator="['personalBigmailmentMoney', {rules: [{ validator: this.validatePersonalBigmailmentMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.personalBigmailmentMoney }}</span>
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
                        v-decorator="['personalAccrual', {rules: [{ validator: this.validatePersonalAccrual }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.personalAccrual }}</span>
                  </a-form-item>
                </td>
                <td
                  class="tit td1"
                  v-if="socialShow"
                >
                  <a-form-item class="tableFormItem">
                    <a-input
                      v-if="editButton"
                      :disabled="true"
                      placeholder="金额"
                      v-decorator="['socialSecurityPersonalSum', {}]"
                      :style="styleWidth"
                    />
                    <span v-else>{{ model.socialSecurityPersonalSum }}</span>
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
                        v-decorator="['personalProvidentSum', {rules: [{ validator: this.validateMoney }]}]"
                        :style="styleWidth"
                      />
                    </a-tooltip>
                    <span v-else>{{ model.personalProvidentSum }}</span>
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
    name: 'PaymentDetailModal',
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
          add: 'hrSocial/tpaymentinfo',
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
        if (!this.model.socialId) { // 是否有社保
          this.socialShow = false
        }
        if (!this.model.fundId) { // 是否有公积金
          this.fundShow = false
        }
        this.model.socialSecurityNo = this.model.socialSecurityNo ? this.model.socialSecurityNo : '-' // 社保编号
        this.model.providentNo = this.model.providentNo ? this.model.providentNo : '-'  // 公积金编号
        this.model.customerName = this.model.departName = '-' // 单位、结算主体
        if (Object.keys(this.settleDomainBelongs).length) { // 单位、结算主体
          this.model.customerName = (this.settleDomainBelongs).hasOwnProperty(this.model.settleDomainId) ? this.settleDomainBelongs[this.model.settleDomainId]['customerName'] : '-'
          this.model.departName = (this.settleDomainBelongs).hasOwnProperty(this.model.settleDomainId) ? this.settleDomainBelongs[this.model.settleDomainId]['departName'] : '-'
        }
        if (this.model.socialHousehold) { // 社保户
          for (const organization of this.organizationBelongs) {
            if (String(organization.id) === String(this.model.socialHousehold)) {
              this.model.socialHousehold = organization.name
              break
            }
          }
        } else {
          this.model.socialHousehold = '-'
        }
        if (this.model.providentHousehold) { // 公积金户
          for (const organization of this.organizationBelongs) {
            if (String(organization.id) === String(this.model.providentHousehold)) {
              this.model.providentHousehold = organization.name
              break
            }
          }
        } else {
          this.model.providentHousehold = '-'
        }
        if (this.editButton) {
          if (this.socialShow) {
            // yhy优化
            if(!this.model.companyAccrual){
              this.model.companyAccrual = 0
            }
            if(!this.model.personalAccrual){
              this.model.personalAccrual = 0
            }
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'unitPensionMoney', 'unitMedicalMoney', 'unitUnemploymentMoney',
              'unitInjuryMoney', 'unitBirthMoney', 'unitBigmailmentMoney', 'companyAccrual',
              'unitSocialSum', 'personalPensionMoney', 'personalMedicalMoney', 'personalUnemploymentMoney',
              'personalBigmailmentMoney', 'personalAccrual', 'socialSecurityPersonalSum'
              ))
            })
          }
          if (this.fundShow) {
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'unitProvidentSum', 'personalProvidentSum'))
            })
          }
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
            const formData = Object.assign(this.model, values)
            const requestData = {}
            requestData.id = formData.id
            if (this.socialShow) {  // 有社保
              requestData.socialId = formData.socialId
              requestData.unitPensionMoney = formData.unitPensionMoney
              requestData.unitMedicalMoney = formData.unitMedicalMoney
              requestData.unitUnemploymentMoney = formData.unitUnemploymentMoney
              requestData.unitInjuryMoney = formData.unitInjuryMoney
              requestData.unitBirthMoney = formData.unitBirthMoney
              requestData.unitBigmailmentMoney = formData.unitBigmailmentMoney
              requestData.companyAccrual = formData.companyAccrual
              requestData.unitSocialSum = formData.unitSocialSum
              requestData.personalPensionMoney = formData.personalPensionMoney
              requestData.personalMedicalMoney = formData.personalMedicalMoney
              requestData.personalUnemploymentMoney = formData.personalUnemploymentMoney
              requestData.personalBigmailmentMoney = formData.personalBigmailmentMoney
              requestData.personalAccrual = formData.personalAccrual
              requestData.socialSecurityPersonalSum = formData.socialSecurityPersonalSum
            }
            if (this.fundShow) {  // 有公积金
              requestData.fundId = formData.fundId
              requestData.unitProvidentSum = formData.unitProvidentSum
              requestData.personalProvidentSum = formData.personalProvidentSum
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
      // 单位养老保险
      validateUnitPensionMoney(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.unitSocialSum = this.formatFloat(value*1 + this.form.getFieldValue('unitMedicalMoney')*1 + this.form.getFieldValue('unitUnemploymentMoney')*1 + this.form.getFieldValue('unitInjuryMoney')*1 + this.form.getFieldValue('unitBirthMoney')*1 + this.form.getFieldValue('unitBigmailmentMoney')*1 + this.form.getFieldValue('companyAccrual')*1)
          this.form.setFieldsValue(pick(this.model, 'unitSocialSum'))
        }
      },
      // 单位医疗保险
      validateUnitMedicalMoney(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.unitSocialSum = this.formatFloat(value*1 + this.form.getFieldValue('unitPensionMoney')*1 + this.form.getFieldValue('unitUnemploymentMoney')*1 + this.form.getFieldValue('unitInjuryMoney')*1 + this.form.getFieldValue('unitBirthMoney')*1 + this.form.getFieldValue('unitBigmailmentMoney')*1 + this.form.getFieldValue('companyAccrual')*1)
          this.form.setFieldsValue(pick(this.model, 'unitSocialSum'))
        }
      },
      // 单位失业保险
      validateUnitUnemploymentMoney(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.unitSocialSum = this.formatFloat(value*1 + this.form.getFieldValue('unitPensionMoney')*1 + this.form.getFieldValue('unitMedicalMoney')*1 + this.form.getFieldValue('unitInjuryMoney')*1 + this.form.getFieldValue('unitBirthMoney')*1 + this.form.getFieldValue('unitBigmailmentMoney')*1 + this.form.getFieldValue('companyAccrual')*1)
          this.form.setFieldsValue(pick(this.model, 'unitSocialSum'))
        }
      },
      // 单位工伤保险
      validateUnitInjuryMoney(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.unitSocialSum = this.formatFloat(value*1 + this.form.getFieldValue('unitPensionMoney')*1 + this.form.getFieldValue('unitMedicalMoney')*1 + this.form.getFieldValue('unitUnemploymentMoney')*1 + this.form.getFieldValue('unitBirthMoney')*1 + this.form.getFieldValue('unitBigmailmentMoney')*1 + this.form.getFieldValue('companyAccrual')*1)
          this.form.setFieldsValue(pick(this.model, 'unitSocialSum'))
        }
      },
      // 单位生育保险
      validateUnitBirthMoney(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.unitSocialSum = this.formatFloat(value*1 + this.form.getFieldValue('unitPensionMoney')*1 + this.form.getFieldValue('unitMedicalMoney')*1 + this.form.getFieldValue('unitUnemploymentMoney')*1 + this.form.getFieldValue('unitInjuryMoney')*1 + this.form.getFieldValue('unitBigmailmentMoney')*1 + this.form.getFieldValue('companyAccrual')*1)
          this.form.setFieldsValue(pick(this.model, 'unitSocialSum'))
        }
      },
      // 单位大病救助
      validateUnitBigmailmentMoney(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.unitSocialSum = this.formatFloat(value*1 + this.form.getFieldValue('unitPensionMoney')*1 + this.form.getFieldValue('unitMedicalMoney')*1 + this.form.getFieldValue('unitUnemploymentMoney')*1 + this.form.getFieldValue('unitInjuryMoney')*1 + this.form.getFieldValue('unitBirthMoney')*1 + this.form.getFieldValue('companyAccrual')*1)
          this.form.setFieldsValue(pick(this.model, 'unitSocialSum'))
        }
      },
      // 单位补缴利息
      validateCompanyAccrual(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.unitSocialSum = this.formatFloat(value*1 + this.form.getFieldValue('unitPensionMoney')*1 + this.form.getFieldValue('unitMedicalMoney')*1 + this.form.getFieldValue('unitUnemploymentMoney')*1 + this.form.getFieldValue('unitInjuryMoney')*1 + this.form.getFieldValue('unitBirthMoney')*1 + this.form.getFieldValue('unitBigmailmentMoney')*1)
          this.form.setFieldsValue(pick(this.model, 'unitSocialSum'))
        }
      },
      // 个人养老保险
      validatePersonalPensionMoney(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityPersonalSum = this.formatFloat(value*1 + this.form.getFieldValue('personalMedicalMoney')*1 + this.form.getFieldValue('personalUnemploymentMoney')*1 + this.form.getFieldValue('personalBigmailmentMoney')*1 + this.form.getFieldValue('personalAccrual')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityPersonalSum'))
        }
      },
      // 个人医疗保险
      validatePersonalMedicalMoney(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityPersonalSum = this.formatFloat(value*1 + this.form.getFieldValue('personalPensionMoney')*1 + this.form.getFieldValue('personalUnemploymentMoney')*1 + this.form.getFieldValue('personalBigmailmentMoney')*1 + this.form.getFieldValue('personalAccrual')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityPersonalSum'))
        }
      },
      // 个人失业保险
      validatePersonalUnemploymentMoney(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityPersonalSum = this.formatFloat(value*1 + this.form.getFieldValue('personalPensionMoney')*1 + this.form.getFieldValue('personalMedicalMoney')*1 + this.form.getFieldValue('personalBigmailmentMoney')*1 + this.form.getFieldValue('personalAccrual')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityPersonalSum'))
        }
      },
      // 个人大病救助
      validatePersonalBigmailmentMoney(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityPersonalSum = this.formatFloat(value*1 + this.form.getFieldValue('personalPensionMoney')*1 + this.form.getFieldValue('personalMedicalMoney')*1 + this.form.getFieldValue('personalUnemploymentMoney')*1 + this.form.getFieldValue('personalAccrual')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityPersonalSum'))
        }
      },
      // 个人补缴利息
      validatePersonalAccrual(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityPersonalSum = this.formatFloat(value*1 + this.form.getFieldValue('personalPensionMoney')*1 + this.form.getFieldValue('personalMedicalMoney')*1 + this.form.getFieldValue('personalUnemploymentMoney')*1 + this.form.getFieldValue('personalBigmailmentMoney')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityPersonalSum'))
        }
      },
      // 金额验证（统一验证）
      validateMoney(rule, value, callback) {
        value = value.toString()
        if (!new RegExp(/((^[1-9-]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          callback('')
          return false
        } else if (value.length === 1 && ((value.split('-')).length - 1) === 1) {
          callback('')
          return false
        } else if (value.indexOf('-') === 0 && value.indexOf('.') === 1) {
          callback('')
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
.stepFormText {
  :global(.ant-form-item-label) {
    width: 110px;
  }
  :global(.ant-form-item-children) {
    height: 0px;
    float: left;
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
</style>
