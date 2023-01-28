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
        :loading="downLoading"
        @click="handleExport"
      >导出</a-button>
      <a-button
        v-if="isVerify"
        type="primary"
        @click="handleOk(1)"
      >提交审核</a-button>
      <a-button
        v-if="isAudit"
        type="primary"
        @click="handleOk(2)"
      >审核</a-button>
    </template>

    <!-- 警示提示圆点 -->
    <div style="float: left; height: 0;">
      <a-badge
        dot
        :offset="offset.offsetOne"
        v-if="offsetStatus.offsetOne"
        style="height: 0px; width: 0px"
      ></a-badge>
      <a-badge
        dot
        :offset="offset.offsetTwo"
        v-if="offsetStatus.offsetTwo"
        style="height: 0px; width: 0px"
      ></a-badge>
      <a-badge
        dot
        :offset="offset.offsetThree"
        v-if="offsetStatus.offsetThree"
        style="height: 0px; width: 0px"
      ></a-badge>
      <a-badge
        dot
        :offset="offset.offsetFour"
        v-if="offsetStatus.offsetFour"
        style="height: 0px; width: 0px"
      ></a-badge>
    </div>

    <a-tabs
      :activeKey="activeKey"
      @change="tabsChange"
    >
      <a-tab-pane
        :forceRender="true"
        tab="申请表"
        key="1"
      >
        <a-spin :spinning="confirmLoading">
          <a-button
            v-if="isVerify"
            type="primary"
            style="margin-bottom:18px"
            @click="handleDiy"
          >添加自定义项</a-button>
          <a-form
            :form="tabPaneOne"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col :span="24">
                <a-table
                  rowKey="id"
                  :columns="columns"
                  :dataSource="dataSource"
                  :scroll="{ x: 1320, y: 400 }"
                >
                  <span
                    slot="action"
                    slot-scope="text, record"
                  >
                    <a-popconfirm
                      title="确定删除吗?"
                      v-if="record.newAdd == 1"
                      @confirm="() => handleDiyDelete(record)"
                    >
                      <a>删除</a>
                    </a-popconfirm>
                  </span>
                  <!-- 列缩放隐藏模板 -->
                  <template
                    v-for="(defineColumn, key) in tabPaneOneDefineColumns"
                    :slot="key"
                    slot-scope="text, record"
                  >
                    <span
                      :key="key"
                      :style="handleColumnStyle(defineColumn.width)"
                    >
                      <!-- 结算主体或者单位 -->
                      <a-tooltip
                        v-if="defineColumn.type=='settle'"
                        placement="topLeft"
                        :title="((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[defineColumn.key])) ? (defineColumn.options)[record[defineColumn.key]][defineColumn.name] : '-'"
                      >
                        {{ ((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[defineColumn.key])) ? (defineColumn.options)[record[defineColumn.key]][defineColumn.name] : '-' }}
                      </a-tooltip>
                      <!-- 普通数据 -->
                      <a-tooltip
                        v-else
                        placement="topLeft"
                        :title="record[key] ? record[key] : '-'"
                      >
                        {{ record[key] ? record[key] : '-' }}
                      </a-tooltip>
                    </span>
                  </template>
                </a-table>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        :forceRender="true"
        tab="增减记录"
        key="2"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="tabPaneTwo"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="上月汇缴人数"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="!isVerify"
                    placeholder="请填写上月缴纳人数"
                    v-decorator="['lastMonthNum', {rules: [{ validator: this.validatelastMonthNum }]}]"
                    style="width: 191px"
                    @change="editMonthNum"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="本月汇缴人数"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请填写本月汇缴人数"
                    v-decorator="['thisMonthNum', {}]"
                    style="width: 191px"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="本月减少人数"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="!isVerify"
                    placeholder="请填写本月减少人数"
                    v-decorator="['thisMonthReduce', {rules: [{ validator: this.validateThisMonthReduce }]}]"
                    style="width: 191px"
                    @change="editMonthReduce"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="本月增加人数"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="!isVerify"
                    placeholder="请填写本月增加人数"
                    v-decorator="['thisMonthAdd', {rules: [{ validator: this.validateThisMonthAdd }]}]"
                    style="width: 191px"
                    @change="editMonthAdd"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        :forceRender="true"
        tab="封面"
        key="3"
      >
        <a-button
          v-if="isVerify"
          type="primary"
          @click="handleAddCover"
        >添加自定义封面</a-button>
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="tabPaneThree"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col :span="24">
                <a-tabs
                  :activeKey="tabsPaneThreeActiveKey"
                  @change="tabsPaneThreeChange"
                >
                  <a-tab-pane
                    :forceRender="true"
                    v-for="(value, key) in tabPaneThreeData"
                    :key="key+1"
                  >
                    <span slot="tab">
                      <a-icon
                        type="close"
                        v-if="value.master == 2"
                      />
                      {{ tabName+(key+1) }}
                    </span>
                    <a-card>
                      <a-row type="flex">
                        <a-col
                          style="text-align:center;font-size:15px;font-weight:bolder;color:#333"
                          :span="12"
                          :offset="6"
                        >
                          <a-form-item
                            class="tableFormItem"
                            v-if="isVerify"
                          >
                            <a-tooltip
                              placement="top"
                              title="请输入抬头名称！"
                            >
                              <a-input
                                style="height:30px; width: 375px;"
                                :name="'tableHead_'+key"
                                v-decorator="['tableHead_'+key]"
                                @change="changeTableData"
                              />
                            </a-tooltip>
                          </a-form-item>
                          <span v-else>{{ value.tableHead ? value.tableHead : '' }}</span>
                        </a-col>

                        <a-col
                          style="text-align:center;font-size:20px;font-weight:bolder;color:#333;margin-top:10px"
                          :span="12"
                          :offset="6"
                        >银行转账审批单
                          <a-popconfirm
                            title="确定删除此封面吗?"
                            v-if="value.master==2"
                            @confirm="() => handleRemove(key,value.id)"
                          >
                            <a-tag
                              color="#f50"
                              style="cursor:pointer"
                            >删除</a-tag>
                          </a-popconfirm>
                        </a-col>
                      </a-row>
                      <table class="table1" aria-describedby="转账审批单">
                        <tr class="tr1">
                          <th
                            class="td1"
                            colspan="2"
                            scope="col"
                          ></th>
                          <th
                            class="td1"
                            colspan="2"
                            scope="col"
                          >{{ value.createTime ? moment(value.createTime).format(dateFormat) : '' }}</th>
                          <th class="td1" scope="col">部门编码</th>
                          <th class="td1" scope="col">{{ value.departNo ? value.departNo : '' }}</th>
                        </tr>
                        <tr class="tr1">
                          <td
                            class="td1"
                            colspan="2"
                          >
                            <p class="font18">单位</p>
                            <p>{{ value.unitName ? value.unitName : '' }}</p>
                          </td>
                          <td
                            class="td1"
                            colspan="2"
                          >
                            <p class="font18">项目</p>
                            <p>{{ value.itemName ? value.itemName : '' }}</p>
                          </td>
                          <td class="td1">
                            <p class="font18">付款方式</p>
                            <p
                              v-for="(item, index) in payTypeBelongs"
                              :key="index"
                            ><span v-if="value.payType==item.value">{{ item.label }}</span></p>
                          </td>
                          <td class="td1">
                            <p class="font18">金额</p>
                            <!--<p>¥{{ value.amount }}</p>-->
                            <a-form-item class="tableFormItem">
                              <a-tooltip
                                v-if="isVerify"
                                placement="top"
                                title="请输入最多两位有效数字！"
                              >
                                <a-input
                                  :disabled="!isVerify"
                                  :style="editTableStyle"
                                  :name="'amount_'+key"
                                  v-decorator="['amount_'+key, validatorRules.inputStr]"
                                  @change="changeTableData"
                                />
                              </a-tooltip>
                              <a-tooltip
                                v-else
                                placement="top"
                                :title="value.amount ? value.amount : '-'"
                              >
                                <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 170px;">{{ value.amount ? value.amount : '-' }}</span>
                              </a-tooltip>
                            </a-form-item>
                          </td>
                        </tr>
                        <tr class="tr1">
                          <td
                            class="td1"
                            colspan="2"
                          >合计人民币:</td>
                          <td
                            style="font-weight:bolder;text-align:left"
                            class="td1"
                            colspan="3"
                          >{{ value.amountRmb ? value.amountRmb : '' }}</td>
                          <td class="td1">¥{{ value.amount }}</td>
                        </tr>
                        <tr>
                          <td class="td1">收款单位名称:</td>
                          <td class="td1">
                            <a-form-item class="tableFormItem">
                              <a-tooltip
                                v-if="isVerify"
                                placement="top"
                                title="请输入收款单位名称！"
                              >
                                <a-input
                                  :disabled="!isVerify"
                                  :style="editTableStyle"
                                  :name="'receiptName_'+key"
                                  v-decorator="['receiptName_'+key,{ rules: [{ max: 50, message: '不超过50个字符!' }] }]"
                                  @change="changeTableData"
                                />
                              </a-tooltip>
                              <a-tooltip
                                v-else
                                placement="top"
                                :title="value.receiptName ? value.receiptName : '-'"
                              >
                                <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 170px;">{{ value.receiptName ? value.receiptName : '-' }}</span>
                              </a-tooltip>
                            </a-form-item>
                          </td>
                          <td class="td1">账户:</td>
                          <td class="td1">
                            <a-form-item class="tableFormItem">
                              <a-tooltip
                                v-if="isVerify"
                                placement="top"
                                title="请正确输入账户！"
                              >
                                <a-input
                                  :disabled="!isVerify"
                                  :style="editTableStyle"
                                  :name="'receiptBankNo_'+key"
                                  v-decorator="['receiptBankNo_'+key,{ rules: [{ max: 30, message: '不超过30个字符!' }] }]"
                                  @change="changeTableData"
                                />
                              </a-tooltip>
                              <a-tooltip
                                v-else
                                placement="top"
                                :title="value.receiptBankNo ? value.receiptBankNo : '-'"
                              >
                                <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 170px;">{{ value.receiptBankNo ? value.receiptBankNo : '-' }}</span>
                              </a-tooltip>
                            </a-form-item>
                          </td>
                          <td class="td1">开户行:</td>
                          <td class="td1">
                            <a-form-item class="tableFormItem">
                              <a-tooltip
                                v-if="isVerify"
                                placement="top"
                                title="请输入开户行！"
                              >
                                <a-input
                                  :disabled="!isVerify"
                                  :style="editTableStyle"
                                  :name="'receiptBankName_'+key"
                                  v-decorator="['receiptBankName_'+key,{ rules: [{ max: 50, message: '不超过50个字符!' }] }]"
                                  @change="changeTableData"
                                />
                              </a-tooltip>
                              <a-tooltip
                                v-else
                                placement="top"
                                :title="value.receiptBankName ? value.receiptBankName : '-'"
                              >
                                <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 170px;">{{ value.receiptBankName ? value.receiptBankName : '-' }}</span>
                              </a-tooltip>
                            </a-form-item>
                          </td>
                        </tr>
                        <tr>
                          <td class="td1">备注:</td>
                          <td
                            class="td1"
                            colspan="5"
                          >
                            <a-form-item class="tableFormItem">
                              <input
                                :disabled="!isVerify"
                                style="border:0;width:870px;height:23px;background-color: #ffffff;"
                                :value="value.remark"
                                :name="'remark_'+key"
                                @change="changeTableData"
                              >
                            </a-form-item>
                          </td>
                        </tr>
                      </table>
                      <a-row type="flex">
                        <a-col :span="4">公司领导：</a-col>
                        <a-col :span="4">财务负责人：</a-col>
                        <a-col :span="4">网银审核授权人：</a-col>
                        <a-col :span="5">网银转账提交人：{{ tabPaneFourData.lssueUserName }}</a-col>
                        <a-col :span="4">数据审核：{{ tabPaneFourData.auditUserName }}</a-col>
                        <a-col :span="3">制表人：{{ tabPaneFourData.createUserName }}</a-col>
                      </a-row>
                    </a-card>
                  </a-tab-pane>
                </a-tabs>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        :forceRender="true"
        tab="核准"
        key="4"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="tabPaneFour"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="是否转账"
                  class="stepFormText"
                >
                  <a-radio-group
                    :disabled="!isVerify"
                    class="fontiframe"
                    name="radioGroup"
                    v-decorator="['tranferFlaf', {initialValue: '0', rules: [{ validator: this.validateTranferFlaf }]}]"
                  >
                    <a-radio
                      class="radioGroup"
                      v-for="(value, key) in statusOptions"
                      :key="key"
                      :value="key"
                    >{{ value.option }}</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="结算金额"
                  class="stepFormText"
                >
                  {{ tabPaneFourData.settlementAmount }}
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="开票金额"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="!isVerify"
                    placeholder="请填写开票金额"
                    v-decorator="['ticketAmount', {rules: [{ validator: this.validateTicketAmount }]}]"
                    style="width: 191px"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="16">
                <a-form-item
                  label="备注"
                  class="stepFormText"
                >
                  <a-textarea
                    :disabled="!isVerify"
                    :rows="1"
                    placeholder="请填写备注"
                    v-decorator="['remark', {rules: [{ validator: this.validateRemark }]}]"
                    style="width: 400px"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>
    </a-tabs>
    <social-fund-verification-modal
      ref="socialFundVerificationModal"
      @ok="socialFundVerificationModalFormOk"
    ></social-fund-verification-modal>

    <a-modal
      title="添加自定义项"
      :width="550"
      :closable="true"
      :visible="diyDisible"
      @cancel="handleDiyCancel"
      @ok="handleDiyOk"
      :confirmLoading="diyLoading"
      :maskClosable="false"
    >
      <a-form
        :form="diyForm"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="单位应缴金额"
              class="stepFormText"
            >
              <a-input
                placeholder="请填写单位应缴金额"
                v-decorator="['unitAmount', { rules: [{required: true, pattern:/^(-?)[0-9]+(.[0-9]{1,2})?$/,message: '请输入正确金额!' }] }]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="个人应缴金额"
              class="stepFormText"
            >
              <a-input
                placeholder="请填写个人应缴金额"
                v-decorator="['personalAmount', { rules: [{required: true, pattern:/^(-?)[0-9]+(.[0-9]{1,2})?$/,message: '请输入正确金额!' }] }]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="所属部门"
              class="stepFormText"
            >
              <select-page
                :id="'id'"
                :title="'departName'"
                placeholder="请选择结算主体查询"
                v-model="departId"
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                style="width:191px"
                validateStatus="error"
              ></select-page>

            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="我司到款单位"
              class="stepFormText"
            >
              <a-input
                placeholder="请填写我司到款单位"
                v-decorator="['paymentUnitOfOurCompany']"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注说明"
              class="stepFormText"
            >
              <a-textarea
                :rows="3"
                placeholder="请填写备注说明"
                v-decorator="['remark', {}]"
                style="width: 332px"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 添加自定义封面 -->
    <a-modal
      title="添加自定义封面"
      :width="550"
      :closable="true"
      :visible="coverDisible"
      @cancel="handleCoverCancel"
      @ok="handleCoverOk"
      :confirmLoading="coverLoading"
      :maskClosable="false"
    >
      <a-form
        :form="coverForm"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="金额"
              class="stepFormText"
            >
              <a-input
                placeholder="请填写单位应缴金额"
                v-decorator="['amount', { rules: [{required: true, pattern:/^(-?)[0-9]+(.[0-9]{1,2})?$/,message: '请输入正确金额!' }] }]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="收款单位名称"
              class="stepFormText"
            >
              <a-input
                placeholder="请填写收款单位名称"
                v-decorator="['receiptName', { rules: [{required: true,message: '请输入收款单位名称!'},{max:50,message:'不超过50个字符!'}] }]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="开户行"
              class="stepFormText"
            >
              <a-input
                placeholder="请填写开户行"
                v-decorator="['receiptBankName',{ rules: [{required: true, message: '请输入开户行!'},{max:50,message:'不超过50个字符!'}] }]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="银行卡号"
              class="stepFormText"
            >
              <a-input
                placeholder="请填写银行卡号"
                v-decorator="['receiptBankNo', { rules: [{required: true, message: '请输入银行卡号!'},{max:30,message:'不超过30个字符!'}] }]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="封面抬头"
              class="stepFormText"
            >
              <a-input
                placeholder="请填写封面抬头"
                v-decorator="['tableHead', { rules: [{required: true, message: '请输入封面抬头!'}] }]"
                style="width: 191px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="付款方式"
              class="stepFormText"
            >
              <a-select
                style="width: 191px"
                v-decorator="['payType', { rules: [{required: true, message: '请选择付款方式!'}], initialValue:'0' }]"
                placeholder="请选择付款方式"
              >
                <a-select-option
                  v-for="(item, index) in payTypeBelongs"
                  :key="index"
                  :value="String(item.value)"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注"
              class="stepFormText"
            >
              <a-textarea
                :rows="3"
                placeholder="请填写备注说明"
                v-decorator="['remark', {}]"
                style="width: 332px"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { httpAction } from '@/api/manage'
  import SocialFundVerificationModal from './SocialFundVerificationModal'
  //import { getAllSettleDomainSelectVos } from '@/api/api'

  export default {
    name: 'FundApprovalApplyDetailModal',
    components: {
      SocialFundVerificationModal,
      SelectPage
    },
    data() {
      return {
        id: '',
        moment,
        model: {},
        title: '操作',
        tabName: '封面',  // 封面名称
        visible: false,
        isAudit: false, // 提交出账
        isVerify: false, // 提交审核
        diyDisible: false,
        diyLoading: false,
        defaultVisible:false,
        coverDisible: false,
        coverLoading: false,
        downLoading: false,
        activeKey: '1', // 默认第一个tab
        okStatusOfSubmit: 0, // 记录第几次点击提交按钮
        tabsPaneThreeActiveKey: 1, // 默认第一个tab
        confirmLoading: false,
        tabPaneOne: this.$form.createForm(this),
        tabPaneTwo: this.$form.createForm(this),
        tabPaneThree: this.$form.createForm(this),
        tabPaneFour: this.$form.createForm(this),
        diyForm: this.$form.createForm(this),
        coverForm: this.$form.createForm(this),
        diyFormModel:{},
        offset: {'offsetOne': [52, 0], 'offsetTwo': [172, 0], 'offsetThree': [265, 0], 'offsetFour': [356, 0]},
        offsetStatus: {'offsetOne': false, 'offsetTwo': false, 'offsetThree': false, 'offsetFour': false},
        columns: [],  // 行
        dataSource: [], // 数据
        tabPaneTwoData: {}, // 增减记录数据
        tabPaneThreeData: {}, // 封面数据
        editTableData: {}, // 表单可修改数据
        editTableStyle: 'border:0;height:23px;', // 表单样式（查看的时候输入框隐藏）
        tabPaneFourData: {}, // 核准数据
        dateFormat: "YYYY年MM月DD日",
        payTypeBelongs: [], // 付款方式
        nextUserIdBelongs: [], // 下一办理人
        statusOptions: {'0': {'option': '是', 'color': 'green'}, '1': {'option': '否', 'color': 'red'}}, // 状态
        tabPaneOneDefineColumns: {unitName: {width: 160}, departName: {width: 140}, remark: {width: 160}, paymentUnitOfOurCompany: {width: 160}},  // 隐藏列字段数组
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          receiptName: { rules: [{ validator: this.validateTable }] },
          receiptBankNo: { rules: [{ validator: this.validateReceiptBankNo }] },
          receiptBankName: { rules: [{ validator: this.validateTable }] },
          inputStr: { rules: [{ validator: this.validatAmount }] },
        },
        url: {
          taprovalrecord: 'hrSocial/taprovalrecord',  //  核准表新增、减少人数记录表
          taprovalcover: 'hrSocial/taprovalcover',  //  社保、公积金核准标封面
          tprovidentaprovalform: 'hrSocial/tprovidentaprovalform',  // 公积金核准表修改
          saveDefine: 'hrSocial/tprovidentaprovalformreport/saveDefine',
          queryAllInfoById: 'hrSocial/tprovidentaprovalform/getProvidentAprovalAllInfo',
          deleteDefineById:'hrSocial/tprovidentaprovalformreport/deleteDefineById',
          saveCover: 'hrSocial/taprovalcover/saveDiyTAmountCover',
          deleteCover:'hrSocial/taprovalcover/'
        },
        departId:'',
        settleDomainOptions:[]
      }
    },
    methods: {
      edit(record) {
        this.tabPaneOne.resetFields()
        this.tabPaneTwo.resetFields()
        this.tabPaneThree.resetFields()
        this.tabPaneFour.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true

        if (this.isVerify) {
          this.editTableStyle = 'height:23px;' // 表单样式（查看的时候输入框隐藏）
        }

        /**************************************************** 申请表数据 ****************************************************/
        this.dataSource = this.model.providentAprovalFormReportList
        this.dataSource = this.model.providentAprovalFormReportList
        let sumAmount = 0
        for(let d of this.model.providentAprovalFormReportList){
          sumAmount = sumAmount + d.sumAmount
        }
        this.dataSource.push({
          'unitName':'统计',
          'id':1,
          'sumAmount':sumAmount.toFixed(2)
        })
        this.columns = [
          { title: '单位名称', dataIndex: 'unitName', key: 'unitName', fixed: 'left', width: 200, align: 'center', scopedSlots: { customRender: 'unitName' } },
          { title: '结算主体', dataIndex: 'departName', key: 'departName', fixed: 'left', width: 180, align: 'center', scopedSlots: { customRender: 'departName' } },
          { title: '应交人数', dataIndex: 'personCount', key: 'personCount', width: 90, align: 'center' },
          { title: '单位应缴纳金额', dataIndex: 'unitAmount', key: 'unitAmount', width: 150, align: 'center' },
          { title: '个人应缴纳金额', dataIndex: 'personalAmount', key: 'personalAmount', width: 150, align: 'center' },
          { title: '合计应缴纳金额', dataIndex: 'sumAmount', key: 'sumAmount', width: 150, align: 'center' },
          { title: '备注', dataIndex: 'remark', key: 'remark', width: 200, align: 'center', scopedSlots: { customRender: 'remark' } },
          { title: '我司到款单位', dataIndex: 'paymentUnitOfOurCompany', key: 'paymentUnitOfOurCompany', width: 200, align: 'center', scopedSlots: { customRender: 'paymentUnitOfOurCompany' } },
          { title: '操作', key: 'operations', width: 100, align: 'center', scopedSlots: { customRender: 'action' } },
        ]
        /**************************************************** 增减记录数据 ****************************************************/
        this.tabPaneTwoData = this.model.aprovalRecord
        this.$nextTick(() => {
          this.tabPaneTwo.setFieldsValue(pick(this.tabPaneTwoData, 'lastMonthNum', 'thisMonthNum', 'thisMonthReduce', 'thisMonthAdd'))
        })
        /**************************************************** 封面数据 ****************************************************/
        let aprovalCoverList = this.model.aprovalCoverList
        this.tabPaneThreeData = aprovalCoverList
        if (this.isVerify && Object.keys(aprovalCoverList).length > 0) {
          for (let i=0; i<Object.keys(aprovalCoverList).length; i++) {
            let tableHead = 'tableHead_' + i
            this.editTableData[tableHead] = aprovalCoverList[i]['tableHead']
            let receiptName = 'receiptName_' + i
            this.editTableData[receiptName] = aprovalCoverList[i]['receiptName']
            let receiptBankNo = 'receiptBankNo_' + i
            this.editTableData[receiptBankNo] = aprovalCoverList[i]['receiptBankNo']
            let receiptBankName = 'receiptBankName_' + i
            this.editTableData[receiptBankName] = aprovalCoverList[i]['receiptBankName']
            let amount = 'amount_' + i
            this.editTableData[amount] = aprovalCoverList[i]['amount']

            this.$nextTick(() => {
              this.tabPaneThree.setFieldsValue(pick(this.editTableData, tableHead, receiptName, receiptBankNo, receiptBankName,amount))
            })
          }
        }

        /**************************************************** 核准数据 ****************************************************/
        this.tabPaneFourData = this.model.providentAprovalForm
        this.$nextTick(() => {
          this.tabPaneFour.setFieldsValue(pick(this.tabPaneFourData, 'tranferFlaf', 'ticketAmount', 'remark'))
        })

        // 结算主体和所属单位
        // getAllSettleDomainSelectVos().then((res) => {
        //   if (res.code === 200) {
        //     this.settleDomainOptions = res.data
        //   }
        // })
      },
      // 确定按钮
      handleOk(type) {
        let tabPaneTwoForm = false
        let tabPaneThreeForm = false
        let tabPaneFourForm = false
        // 编辑状态1
        this.okStatusOfSubmit = 1
        // 触发表单验证（tabPaneTwo）
        this.tabPaneTwo.validateFields((err) => {
          if (!err) {
            tabPaneTwoForm = true
            this.offsetStatus.offsetTwo = false
          } else {
            this.offsetStatus.offsetTwo = true
          }
        })
        // 触发表单验证（tabPaneThree）
        this.tabPaneThree.validateFields((err) => {
          if (!err) {
            tabPaneThreeForm = true
            this.offsetStatus.offsetThree = false
          } else {
            this.offsetStatus.offsetThree = true
          }
        })
        // 触发表单验证（tabPaneFour）
        this.tabPaneFour.validateFields((err) => {
          if (!err) {
            tabPaneFourForm = true
            this.offsetStatus.offsetFour = false
          } else {
            this.offsetStatus.offsetFour = true
          }
        })
        // 编辑状态0
        this.okStatusOfSubmit = 0

        if (tabPaneTwoForm && tabPaneThreeForm && tabPaneFourForm) {
          this.$refs.socialFundVerificationModal.Type = '1' // 0社保 1公积金
          this.$refs.socialFundVerificationModal.OkType = type // 1 提交审核 2 审核
          this.$refs.socialFundVerificationModal.title = '确认提交'
          this.$refs.socialFundVerificationModal.ids = this.id
          this.$refs.socialFundVerificationModal.nextUserIdBelongs = this.nextUserIdBelongs
          this.$refs.socialFundVerificationModal.edit()
        }
      },
      // tab切换
      tabsChange(e) {
        this.activeKey = e
      },
      // tab切换
      tabsPaneThreeChange(e) {
        this.tabsPaneThreeActiveKey = e
      },
      // 关闭按钮
      handleCancel() {
        this.close()
      },
      // 关闭功能数据重置
      close() {
        this.id = ''
        this.$emit('close')
        this.tabName = '封面'  // 封面名称
        this.visible = false
        this.isAudit = false, // 提交出账
        this.isVerify = false, // 提交审核
        this.activeKey = '1'  //默认第一个tab
        this.tabsPaneThreeActiveKey = 1 // 默认第一个tab
        this.confirmLoading = false
        this.offsetStatus = {'offsetOne': false, 'offsetTwo': false, 'offsetThree': false, 'offsetFour': false}
        this.offset = {'offsetOne': [52, 0], 'offsetTwo': [172, 0], 'offsetThree': [265, 0], 'offsetFour': [356, 0]}
        this.columns = []  // 行
        this.dataSource = [] // 数据
        this.tabPaneTwoData = {} // 增减记录数据
        this.tabPaneThreeData = {} // 封面数据
        this.editTableData = {} // 表单可修改数据
        this.editTableStyle = 'border:0;height:23px;' // 表单样式（查看的时候输入框隐藏）
        this.tabPaneFourData = {} // 核准数据
        this.okStatusOfSubmit = 0 // 记录第几次点击提交按钮
      },
      // 表单回调
      socialFundVerificationModalFormOk() {
        this.close()
        this.$emit('ok')
      },
      // 隐藏列样式
      handleColumnStyle(width) {
        if (width) {
          return `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: ${width}px;`
        }
        return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
      },
      /******************************************* 验证规则 *******************************************/
      // 上月汇缴人数
      validatelastMonthNum(rule, value, callback) {
        if (this.validateAddReduce(rule, value, callback) && this.okStatusOfSubmit == 0) {
          let httpurl = this.url.taprovalrecord
          let method = 'PUT'
          let formData = {}
          formData.id = this.tabPaneTwoData.id
          formData.lastMonthNum = isNaN(parseInt(value)) ? 0 : parseInt(value)
          httpAction(httpurl, formData, method).then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }
      },
      // 本月汇缴人数
      validateThisMonthNum(value) {
        let httpurl = this.url.taprovalrecord
        let method = 'PUT'
        let formData = {}
        formData.id = this.tabPaneTwoData.id
        formData.thisMonthNum = isNaN(parseInt(value)) ? 0 : parseInt(value)
        httpAction(httpurl, formData, method).then((res) => {
          if (Number(res.code) !== 200) {
            this.$message.warning(res.message || res.msg)
          }
        })
      },
      // 本月减少人数
      validateThisMonthReduce(rule, value, callback) {
        if (this.validateAddReduce(rule, value, callback) && this.okStatusOfSubmit == 0) {
          let httpurl = this.url.taprovalrecord
          let method = 'PUT'
          let formData = {}
          formData.id = this.tabPaneTwoData.id
          formData.thisMonthReduce = isNaN(parseInt(value)) ? 0 : parseInt(value)
          httpAction(httpurl, formData, method).then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }
      },
      // 本月增加人数
      validateThisMonthAdd(rule, value, callback) {
        if (this.validateAddReduce(rule, value, callback)  && this.okStatusOfSubmit == 0) {
          let httpurl = this.url.taprovalrecord
          let method = 'PUT'
          let formData = {}
          formData.id = this.tabPaneTwoData.id
          formData.thisMonthAdd = isNaN(parseInt(value)) ? 0 : parseInt(value)
          httpAction(httpurl, formData, method).then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }
      },
      // 验证增减记录（统一验证）
      validateAddReduce(rule, value, callback) {
        if (!value && value !== 0) {
          callback('不能为空！')
          return false
        }

        if (!new RegExp(/((^[1-9]\d*)|^0)$/).test(value)) { // 正整数验证
          callback('输入整数！')
          return false
        }

        callback()
        return true
      },
      // 收款单位名称、账户、开户行、备注
      changeTableData(e) {
        let name = e.target.name  // 名称
        let value = e.target.value  // 值
        let receiptName = []
        receiptName = name.split("_")
        let inputName = receiptName[0]  // 输入时候的name
        let httpurl = this.url.taprovalcover
        let method = 'PUT'
        let formData = {}

        if (receiptName[0] == 'receiptBankNo') {  // 账户
          // let rule = ''
          // let callback = function() {}
          // if (this.validateReceiptBankNo(rule, value, callback)) {  // 验证通过
            
          // }
          formData.id = this.tabPaneThreeData[receiptName[1]]['id']
          formData[inputName] = value
          httpAction(httpurl, formData, method).then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        } else if (receiptName[0] == 'amount') {
          if (this.validatAmount('', value, function() {})) {
            formData.id = this.tabPaneThreeData[receiptName[1]]['id']
            formData[inputName] = value
            httpAction(httpurl, formData, method).then((res) => {
              if (Number(res.code) !== 200) {
                this.$message.warning(res.message || res.msg)
              } else {
                this.tabPaneThreeData[receiptName[1]]['amountRmb'] = res.data.amountRmb
                this.tabPaneThreeData[receiptName[1]]['amount'] = res.data.amount
              }
            })
          }
        } else {
          formData.id = this.tabPaneThreeData[receiptName[1]]['id']
          formData[inputName] = value
          httpAction(httpurl, formData, method).then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }else{
              if (receiptName[0] == 'remark') {
                this.tabPaneThreeData[receiptName[1]]['remark'] = res.data.remark
              } else if (receiptName[0] == 'tableHead') {
                this.tabPaneThreeData[receiptName[1]]['tableHead'] = res.data.tableHead
              }
            }
          })
        }
      },
      handleDiy(){
        this.diyDisible = true
        this.departId = ''
        this.diyForm.resetFields()
      },
      handleDiyCancel(){
        this.diyDisible = false
      },
      // 保存自顶一下项
      handleDiyOk(){
        // if(!this.departId){
        //   this.$message.error('所属部门必选');
        //   return
        // }
        this.diyForm.validateFields((err, values) => {
          if(!err){
            this.diyLoading = true
            let formData = Object.assign({}, values)
            formData.aprovalFormId = this.id
            formData.departId = this.departId
            httpAction(this.url.saveDefine,formData,'POST').then((res) => {
              if(Number(res.code) === 200){
                httpAction(`${this.url.queryAllInfoById}?id=${this.id}`, '', 'GET').then((res) => {
                  if (Number(res.code) === 200 && res.data) {
                    //this.dataSource = res.data.providentAprovalFormReportList
                    this.edit(res.data)
                  }
                })
                this.$message.success("新增成功")
                this.diyDisible = false
                
              }else{
                this.$message.error(res.msg)
              }
              this.diyLoading = false
            })
          }
        })
      },
      handleDiyDelete(record){
        httpAction(this.url.deleteDefineById + '?id=' + record.id, {},'DELETE').then((res) => {
          if(Number(res.code) === 200){
            httpAction(this.url.queryAllInfoById + '?id=' + this.id, '', 'GET').then((res) => {
              if (Number(res.code) === 200 && res.data) {
                this.edit(res.data)
              }
            })
            this.$message.success("删除成功")
          }
        })
      },
      //添加自定义封面
      handleAddCover(){
        this.coverDisible = true
        this.coverForm.resetFields()
      },
      handleCoverCancel(){
        this.coverDisible = false
      },
      //保存自定义封面
      handleCoverOk(){
        this.coverForm.validateFields((err, values) => {
          if(!err){
            this.coverLoading = true
            let formData = Object.assign({}, values)
            formData.aprovalProvidentFormId = this.id
            httpAction(this.url.saveCover, formData, 'POST').then((res) => {
              if(Number(res.code) === 200){
                this.tabPaneThreeData.push(res.data)
                for (let i=0; i<Object.keys(this.tabPaneThreeData).length; i++) {
                  let receiptName = 'receiptName_' + i
                  this.editTableData[receiptName] = this.tabPaneThreeData[i]['receiptName']
                  let receiptBankNo = 'receiptBankNo_' + i
                  this.editTableData[receiptBankNo] = this.tabPaneThreeData[i]['receiptBankNo']
                  let receiptBankName = 'receiptBankName_' + i
                  this.editTableData[receiptBankName] = this.tabPaneThreeData[i]['receiptBankName']
                  let amount = 'amount_' + i
                  this.editTableData[amount] = this.tabPaneThreeData[i]['amount']

                  this.$nextTick(() => {
                    this.tabPaneThree.setFieldsValue(pick(this.editTableData, receiptName, receiptBankNo, receiptBankName,amount))
                  })
                }
                this.$message.success("添加成功")
              }else{
                this.$message.error(res.msg)
              }
              this.coverLoading = false
              this.coverDisible = false
            })
          }
        })
      },
      //删除封面
      handleRemove(key,id){
        httpAction(this.url.deleteCover + id, {}, 'DELETE').then((res) => {
          if(Number(res.code) === 200){
            this.tabPaneThreeData.splice(key,1)
            this.$message.success("删除成功")
            let activeKey = this.tabsPaneThreeActiveKey - 1
            this.tabsPaneThreeActiveKey = activeKey
          }
        })
      },
      // 收款单位名称、开户行（统一验证）
      validateTable(rule, value, callback) {
        if (!value) {
          callback('')
          return false
        }

        callback()
      },
      // 账户
      validateReceiptBankNo(rule, value, callback) {
        if (!value) {
          callback('')
          return false
        }

        if (!new RegExp(/^([0-9]{1})(\d{9,24})$/).test(value)) {
          callback('')
          return false
        }

        callback()
        return true
      },
      // 是否转账
      validateTranferFlaf(rule, value, callback) {
        if (this.okStatusOfSubmit == 0) {
          let httpurl = this.url.tprovidentaprovalform
          let method = 'PUT'
          let formData = {}
          formData.id = this.tabPaneFourData.id
          formData.tranferFlaf = value
          httpAction(httpurl, formData, method).then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }

        callback()
      },
      // 开票金额
      validateTicketAmount(rule, value, callback) {
        if (!value && value !== 0) {
          callback('开票金额不能为空！')
          return false
        }

        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 验证数字
          callback('开票金额为1或2位有效数字！')
          return false
        }

        if (this.okStatusOfSubmit == 0) {
          let httpurl = this.url.tprovidentaprovalform
          let method = 'PUT'
          let formData = {}
          formData.id = this.tabPaneFourData.id
          formData.ticketAmount = value
          httpAction(httpurl, formData, method).then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }

        callback()
      },
      // 备注
      validateRemark(rule, value, callback) {
        if (this.okStatusOfSubmit == 0) {
          let httpurl = this.url.tprovidentaprovalform
          let method = 'PUT'
          let formData = {}
          formData.id = this.tabPaneFourData.id
          formData.remark = value
          httpAction(httpurl, formData, method).then((res) => {
            if (res.code != 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }

        callback()
      },
      // 导出
      handleExport() {
        let url = `hrSocial/tprovidentaprovalform/getProvidentAprovalAllInfoForExport?id=${this.tabPaneFourData.id}`
        this.downLoading = true
        httpAction(url, {}, 'GET', 1000 * 60 * 5).then((res) => {
          if (Number(res.code) === 200 && res.data) {
            // let lockStatusOption = ['未锁定', '锁定']
            // let socialSettlementFlagOption = ['未结算', '待结算', '已结算']
            // let fundSettlementFlagOption = ['未结算', '待结算', '已结算']
            this.itemListLenght = res.data.itemList ? res.data.itemList.length : 0 // 分项长度

            let auditName = res.data.providentAprovalForm.auditUserName ? res.data.providentAprovalForm.auditUserName : '' // 数据审核人
            let createName = res.data.providentAprovalForm.createUserName ? res.data.providentAprovalForm.createUserName : '' // 制表人
            let revenueName = res.data.providentAprovalForm.lssueUserName ? res.data.providentAprovalForm.lssueUserName : '' // 财务负责人
            //let submitUserName = res.data.providentAprovalForm.submitUserName ? res.data.providentAprovalForm.submitUserName : '' // 网银转账提交人
            var excelDatas = []
            // 核准表
            let providentAprovalFormReportList = [
              {'unitName': res.data.providentAprovalForm.householName + res.data.providentAprovalForm.providentCreateMonth + '月份应交公积金金额预核准申请表', 'departName': '', 'personCount': '', 'unitAmount': '', 'personalAmount': '', 'sumAmount': '', 'remark': '', 'paymentUnitOfOurCompany': ''},
              {'unitName': '单位名称', 'departName': '结算主体', 'personCount': '应交人数', 'unitAmount': '单位应缴纳金额', 'personalAmount': '个人应缴纳金额', 'sumAmount': '合计应缴纳金额', 'remark': '备注', 'paymentUnitOfOurCompany': '我司到款单位'}
            ]
            let fundSum = {unitName: '合计', departName: '', remark: '', paymentUnitOfOurCompany: ''} // 申请表累计

            for (let item of res.data.providentAprovalFormReportList) {  // 处理数据
              item.remark = (item.remark ? item.remark : '')

              if (!item.paymentUnitOfOurCompany) {
                item.paymentUnitOfOurCompany = ''
              }
              // 计算合计
              fundSum.personCount = this.formatFloat((fundSum.personCount ? fundSum.personCount * 1 : 0) + item.personCount * 1)
              fundSum.unitAmount = this.formatFloat((fundSum.unitAmount ? fundSum.unitAmount * 1 : 0) + item.unitAmount * 1)
              fundSum.personalAmount = this.formatFloat((fundSum.personalAmount ? fundSum.personalAmount * 1 : 0) + item.personalAmount * 1)
              fundSum.sumAmount = this.formatFloat((fundSum.sumAmount ? fundSum.sumAmount * 1 : 0) + item.sumAmount * 1)

              providentAprovalFormReportList.push(item)
            }

            providentAprovalFormReportList.push(fundSum)

            excelDatas.push({
              tHeader: ['1', '2', '3', '4', '5', '6', '7', '8'],
              filterVal: ['unitName', 'departName', 'personCount', 'unitAmount', 'personalAmount', 'sumAmount', 'remark', 'paymentUnitOfOurCompany'],
              tableDatas: providentAprovalFormReportList,
              sheetName: '核准表'
            })

            // 核准表-分项
            if(this.itemListLenght > 0){
              for (let item of res.data.itemList) {  // 处理数据
                let itemList = [
                  {'unitName': res.data.providentAprovalForm.householName + res.data.providentAprovalForm.providentCreateMonth + '月份应交公积金金额预核准申请表', 'departName': '', 'personCount': '', 'unitAmount': '', 'personalAmount': '', 'sumAmount': '', 'remark': '', 'paymentUnitOfOurCompany': ''},
                  {'unitName': '单位名称', 'departName': '结算主体', 'personCount': '应交人数', 'unitAmount': '单位应缴纳金额', 'personalAmount': '个人应缴纳金额', 'sumAmount': '合计应缴纳金额', 'remark': '备注', 'paymentUnitOfOurCompany': '我司到款单位'}
                ]
                let companyName = ''
                let fundSum = {unitName: '合计', departName: '', remark: '', paymentUnitOfOurCompany: ''} // 申请表累计
                for (const value of item) {
                  value.remark = (value.remark ? value.remark : '')
                  if (!value.paymentUnitOfOurCompany) {
                    value.paymentUnitOfOurCompany = ''
                  }
                  companyName = value.paymentUnitOfOurCompany
                  // 计算合计
                  fundSum.personCount = this.formatFloat((fundSum.personCount ? fundSum.personCount * 1 : 0) + value.personCount * 1)
                  fundSum.unitAmount = this.formatFloat((fundSum.unitAmount ? fundSum.unitAmount * 1 : 0) + value.unitAmount * 1)
                  fundSum.personalAmount = this.formatFloat((fundSum.personalAmount ? fundSum.personalAmount * 1 : 0) + value.personalAmount * 1)
                  fundSum.sumAmount = this.formatFloat((fundSum.sumAmount ? fundSum.sumAmount * 1 : 0) + value.sumAmount * 1)
                  itemList.push(value)
                }
                itemList.push(fundSum)
                excelDatas.push({
                  tHeader: ['1', '2', '3', '4', '5', '6', '7', '8'],
                  filterVal: ['unitName', 'departName', 'personCount', 'unitAmount', 'personalAmount', 'sumAmount', 'remark', 'paymentUnitOfOurCompany'],
                  tableDatas: itemList,
                  sheetName: '核准表分项' + '-' + companyName
                })
              }
            }
            // 汇缴统计
            excelDatas.push({
              tHeader: ['上月汇缴人数', '本月增加汇缴人数', '本月减少汇缴人数', '本月汇缴人数'],
              filterVal: ['lastMonthNum', 'thisMonthAdd', 'thisMonthReduce', 'thisMonthNum'],
              tableDatas: [res.data.aprovalRecord],
              sheetName: '汇缴统计'
            })

            // 缴费库
            let paymentInfoList = res.data.paymentAllInfoExportVoList ? res.data.paymentAllInfoExportVoList : []
            for(let index in  paymentInfoList){
              paymentInfoList[index]['no'] = ''
              let providentPayAddr = paymentInfoList[index]['providentPayAddr']
              let addr = providentPayAddr.split('-')
              paymentInfoList[index]['fundProvince'] = addr[0] ? addr[0] : ''
              paymentInfoList[index]['fundCity'] = addr[1] ? addr[1] : ''
              paymentInfoList[index]['fundTown'] = addr[2] ? addr[2] : ''
              paymentInfoList[index]['inauguralTeam'] = paymentInfoList[index]['inauguralTeam'] ? paymentInfoList[index]['inauguralTeam'] : ''
              paymentInfoList[index]['telecomNumber'] = paymentInfoList[index]['telecomNumber'] ? paymentInfoList[index]['telecomNumber'] : ''
             // paymentInfoList[index]['unitId'] = paymentInfoList[index]['settleDomainId'] ? this.settleDomainOptions[paymentInfoList[index]['settleDomainId']]['customerName'] : ''
              //paymentInfoList[index]['settleDomainId'] = paymentInfoList[index]['settleDomainId'] ? this.settleDomainOptions[paymentInfoList[index]['settleDomainId']]['departName'] : ''
            }
            // for (let item of res.data.paymentAllInfoExportVoList) {
            //   item.empName = item.empName ? item.empName : ''
            //   item.empIdcard = item.empIdcard ? item.empIdcard : ''
            //   item.empNo = item.empNo ? item.empNo : ''
            //   item.socialCreateMonth = item.socialCreateMonth ? item.socialCreateMonth : ''
            //   item.socialPayMonth = item.socialPayMonth ? item.socialPayMonth : ''
            //   item.unitSocialSum = item.unitSocialSum ? item.unitSocialSum : ''
            //   item.socialSecurityPersonalSum = item.socialSecurityPersonalSum ? item.socialSecurityPersonalSum : ''
            //   item.socialSum = item.socialSum ? item.socialSum : ''
            //   item.providentCreateMonth = item.providentCreateMonth ? item.providentCreateMonth : ''
            //   item.providentPayMonth = item.providentPayMonth ? item.providentPayMonth : ''
            //   item.providentSum = item.providentSum ? item.providentSum : ''
            //   item.sumAll = item.sumAll ? item.sumAll : ''
            //   item.lockStatus = (item.lockStatus !== null) ? lockStatusOption[item.lockStatus] : ''
            //   item.socialSettlementFlag = (item.socialSettlementFlag !== null) ? socialSettlementFlagOption[item.socialSettlementFlag] : ''
            //   item.fundSettlementFlag = (item.fundSettlementFlag !== null) ? fundSettlementFlagOption[item.fundSettlementFlag] : ''
            //   paymentInfoList.push(item)
            // }

            // excelDatas.push({
            //   tHeader: ['员工姓名', '身份证号', '员工编码', '锁定状态', '社保生成月份', '社保缴纳月份', '单位社保合计', '个人社保合计', '社保合计', '社保结算状态', '公积金生成月份', '公积金缴纳月份', '公积金总合计', '公积金结算状态', '总合计'],
            //   filterVal: ['empName', 'empIdcard', 'empNo', 'lockStatus', 'socialCreateMonth', 'socialPayMonth', 'unitSocialSum', 'socialSecurityPersonalSum', 'socialSum', 'socialSettlementFlag', 'providentCreateMonth', 'providentPayMonth', 'providentSum', 'fundSettlementFlag', 'sumAll'],
            //   tableDatas: paymentInfoList,
            //   sheetName: '缴费库'
            // })
            excelDatas.push({
              tHeader: ['我司到款单位','员工姓名',	'身份证号',	'就值班组',	'电信编号',	'单位名称',	'部门名称',	'公积金缴纳所属省份',	'公积金缴纳所属城市',	'公积金缴纳所属区县',	'公积金缴纳月份',	
                '公积金生成月份',	'单位公积金合计',	'个人公积金合计',	'公积金编号',	'公积金基数',	'单边公积金比例',	'公积金户',	
                '社保合计',	'公积金合计',	'总合计',
              ],
              filterVal: ['no','empName','empIdcard','inauguralTeam','telecomNumber','unitId','settleDomainId','fundProvince','fundCity','fundTown','providentPayMonth',
              'providentCreateMonth','unitProvidentSum','personalProvidentSum','providentNo','unitProvidentSet','providentPercent','providentHousehold',
              'socialSum','providentSum','sumAll'],
              tableDatas: paymentInfoList,
              sheetName: '缴费库'
            })
            // 封面
            let i = 1
            for (let d of res.data.aprovalCoverList) {
              d.tableHead = d.tableHead ? d.tableHead : ''
              d.createTime = d.createTime ? moment(d.createTime).format(this.dateFormat) : ''
              d.departNo = d.departNo ? d.departNo : ''
              d.unitName = d.unitName ? d.unitName : ''
              d.itemName = d.itemName ? d.itemName : ''
              d.payType = d.payType ? d.payType : ''

              for (let type of this.payTypeBelongs) {
                if (d.payType == type.value) {
                  d.payType = type.label
                  break
                }
              }

              d.amount = d.amount ? d.amount : 0
              d.amountRmb = d.amountRmb ? d.amountRmb : 0
              d.receiptName = d.receiptName ? d.receiptName : ''
              d.receiptBankNo = d.receiptBankNo ? d.receiptBankNo : ''
              d.receiptBankName = d.receiptBankName ? d.receiptBankName : ''
              d.remark = d.remark ? d.remark : ''
              let coverData = [
                {'company': d.tableHead, 'project': '', 'payType': '', 'money': '', 'no': `附件${res.data.aprovalCoverList.length}张`},
                {'company': "银行转账审批单", 'project': '', 'payType': '', 'money': '', 'no': ''},
                {'company': "", 'project': d.createTime, 'payType': '部门编码', 'money': d.departNo, 'no': ''},
                {'company': "单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
                {'company': d.unitName,'project':d.itemName,'payType':d.payType,'money':'¥' + d.amount,'no':''},
                {'company': "合计人民币：",'project':d.amountRmb,'payType':'','money':'¥' + d.amount,'no':''},
                {'company': "收款单位名称：" + d.receiptName + "    账号：" + d.receiptBankNo + "    开户行：" + d.receiptBankName,'project':'','payType':'','money':'','no':''},
                {'company': "备注:",'project': d.remark,'payType':'','money':'','no':''},
                {'company': '公司领导:       财务负责人：       网银审核授权人：       网银转账提交人：' + revenueName + '       数据审核：' + auditName + '       制表人：' + createName,'project':'','payType':'','money':'','no':''},
              ]
              excelDatas.push({
                tHeader: ["序号", "名字", "描述", "金钱", "地位"],
                filterVal: ["company", "project", "payType", "money",'no'],
                tableDatas: coverData,
                sheetName: '封面' + i
              })
              i++
            }
            let householdName =  res.data.providentAprovalForm.householdName ? res.data.providentAprovalForm.householdName : ''
            this.json2excel(excelDatas, householdName + res.data.providentAprovalForm.providentCreateMonth + '月份公积金核准表', true, "xlsx")
          } else {
            this.$message.error('数据请求失败！')
          }
          this.downLoading = false
        })
      },
      // 导出
      json2excel (tableJson, filenames, autowidth, bookTypes) {
        var that = this
        //这个是引用插件
        import("@/vendor/FundApprovalSalaryExport").then(excel => {
          var tHeader = []
          var dataArr = []
          var sheetnames = []
          for (var i in tableJson) {
            tHeader.push(tableJson[i].tHeader)
            dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
            sheetnames.push(tableJson[i].sheetName)
          }

          excel.export_json_to_excel_more_sheet({
            header: tHeader,
            data: dataArr,
            sheetname: sheetnames,
            filename: filenames,
            autoWidth: autowidth,
            bookType: bookTypes,
            itemListLenght: that.itemListLenght,
          })
        })
      },
      // 处理数据
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
      // 精度处理
      formatFloat(f, digit = 2) {
        const m = Math.pow(10, digit)
        return Math.round(f * m) / m
      },
      // 上月汇缴人数
      editMonthNum(e) {
        if (this.validateAddReduce('', e.target.value, function(){})  && this.okStatusOfSubmit == 0) {
          let value = isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)  // 值
          let thisMonthReduce = isNaN(parseInt(this.tabPaneTwo.getFieldValue('thisMonthReduce'))) ? 0 : parseInt(this.tabPaneTwo.getFieldValue('thisMonthReduce'))
          let thisMonthAdd = isNaN(parseInt(this.tabPaneTwo.getFieldValue('thisMonthAdd'))) ? 0 : parseInt(this.tabPaneTwo.getFieldValue('thisMonthAdd'))
          let sum = isNaN(parseInt(value - thisMonthReduce + thisMonthAdd)) ? 0 : parseInt(value - thisMonthReduce + thisMonthAdd)
          this.tabPaneTwoData.thisMonthNum = sum
          this.validateThisMonthNum(sum)

          this.$nextTick(() => {
            this.tabPaneTwo.setFieldsValue(pick(this.tabPaneTwoData, 'thisMonthNum'))
          })
        }
      },
      // 本月减少人数
      editMonthReduce(e) {
        if (this.validateAddReduce('', e.target.value, function(){})  && this.okStatusOfSubmit == 0) {
          let value = isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)  // 值
          let lastMonthNum = isNaN(parseInt(this.tabPaneTwo.getFieldValue('lastMonthNum'))) ? 0 : parseInt(this.tabPaneTwo.getFieldValue('lastMonthNum'))
          let thisMonthAdd = isNaN(parseInt(this.tabPaneTwo.getFieldValue('thisMonthAdd'))) ? 0 : parseInt(this.tabPaneTwo.getFieldValue('thisMonthAdd'))
          let sum = isNaN(parseInt(lastMonthNum + thisMonthAdd - value)) ? 0 : parseInt(lastMonthNum + thisMonthAdd - value)
          this.tabPaneTwoData.thisMonthNum = sum
          this.validateThisMonthNum(sum)

          this.$nextTick(() => {
            this.tabPaneTwo.setFieldsValue(pick(this.tabPaneTwoData, 'thisMonthNum'))
          })
        }
      },
      // 本月增加人数
      editMonthAdd(e) {
        if (this.validateAddReduce('', e.target.value, function(){})  && this.okStatusOfSubmit == 0) {
          let value = isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value) // 值
          let lastMonthNum = isNaN(parseInt(this.tabPaneTwo.getFieldValue('lastMonthNum'))) ? 0 : parseInt(this.tabPaneTwo.getFieldValue('lastMonthNum'))
          let thisMonthReduce = isNaN(parseInt(this.tabPaneTwo.getFieldValue('thisMonthReduce'))) ? 0 : parseInt(this.tabPaneTwo.getFieldValue('thisMonthReduce'))
          let sum = isNaN(parseInt(lastMonthNum + value - thisMonthReduce)) ? 0 : parseInt(lastMonthNum + value - thisMonthReduce)
          this.tabPaneTwoData.thisMonthNum = sum
          this.validateThisMonthNum(sum)

          this.$nextTick(() => {
            this.tabPaneTwo.setFieldsValue(pick(this.tabPaneTwoData, 'thisMonthNum'))
          })
        }
      },
      // 金额验证
      validatAmount(rule, value, callback) {
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
.table1 {
  border: 1px solid #ccc;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 20px;
}
.table1 .tr1 {
  margin: 0px;
  padding: 0;
  width: 100%;
}
.table1 .td1 {
  border: 1px solid #333;
  text-align: center;
  height: 40px;
  padding: 10px;
  width: 17%;
  font-weight: normal;
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
  background: #e6f7ff;
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
.table2 {
  text-align: center;
  display: block;
  width: 83%;
  margin: 20px auto 10px;
}
.num {
  margin-top: 20px;
}
.font18 {
  font-size: 18px;
  font-weight: bolder;
}
</style>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 125px;
  }
  :global(.ant-input-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-radio-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
}
.tableFormItem {
  margin-bottom: 0px;
  margin-right: 0px;
  :global(.ant-form-item-control) {
    line-height: 23px;
  }
  :global(.ant-form-explain) {
    min-height: 0px;
  }
  :global(.ant-input-disabled) {
    color: rgba(0, 0, 0, 0.65);
    background-color: #ffffff;
  }
}
</style>
