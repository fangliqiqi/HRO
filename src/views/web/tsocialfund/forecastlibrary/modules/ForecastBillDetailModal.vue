<template>
  <a-modal
    :title="title"
    :width="1200"
    :closable="false"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
  
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
        :loading="downLoading"
      >关闭</a-button>
      <a-button
        type="primary"
        v-if="btnStatus.refrash && isEdit"
        v-has="'wxhr:tforecastform_refresh'"
        @click="handleRefrash"
        :loading="downLoading"
      >刷新</a-button>
      <a-button
        type="primary"
        :loading="exportLoading"
        @click="handleDownload"
      >导出</a-button>
      <a-button
        :type="ycprimary"
        :disabled="downDisabled"
        :loading="ycexportLoading"
        readonly
        v-if="hasOperatePermission('wxhr:yc_export')"
        @click="handleBeforeExport"
      >易才导出</a-button>
      <a-button
        v-if="btnStatus.submit && isEdit"
        key="handleOk"
        type="primary"
        @click="handleOk"
        :loading="downLoading"
      >提交</a-button>
      <a-button
        v-if="btnStatus.audit && isEdit"
        key="handleAudit"
        type="primary"
        @click="handleOk"
      >审核</a-button>
      <a-button
        v-if="btnStatus.confirm && isEdit"
        v-has="'wxhr:tforecastform_confirm'"
        type="primary"
        :loading="downLoading"
        @click="handleConfirm"
      >客户已确认</a-button>
    </template>
    <a-alert message="对于已经生成账单之后，再调整派单（如派减，调基）的情况，请先删除账单重新生成" type="info" show-icon />
    <a-spin :spinning="ycexportLoading">
      <a-tabs
        :activeKey="activeKey"
        @change="tabsChange"
      >
        <a-tab-pane
          v-if="tabPaneOneShow"
          :forceRender="true"
          tab="预估明细表"
          key="1"
        >
          <a-spin :spinning="confirmLoading">
            <a-form
              :form="tabPaneOne"
              layout="inline"
              class="ant-advanced-search-form"
            >
              <a-row>
                <a-col :span="24">
                  <a-table
                    rowKey="id"
                    :columns="tabPaneOneColumns"
                    :dataSource="tabPaneOneDataSource"
                    :scroll="{ x: 3130, y: 400 }"
                  >
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
          v-if="tabPaneTwoShow"
          :forceRender="true"
          tab="商险明细表"
          key="2"
        >
          <a-spin :spinning="confirmLoading">
            <a-form
              :form="tabPaneTwo"
              layout="inline"
              class="ant-advanced-search-form"
            >
              <a-row>
                <a-col :span="24">
                  <a-table
                    rowKey="id"
                    :columns="tabPaneTwoColumns"
                    :dataSource="tabPaneTwoDataSource"
                    :scroll="{ x: 2600, y: 400 }"
                  >
                    <!-- 列缩放隐藏模板 -->
                    <template
                      v-for="(defineColumn, key) in tabPaneTwoDefineColumns"
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
          v-if="tabPaneThreeShow"
          :forceRender="true"
          tab="对比库明细表"
          key="3"
        >
          <a-spin :spinning="confirmLoading">
            <a-form
              :form="tabPaneThree"
              layout="inline"
            >
              <a-row :gutter="24">
                <a-col
                  :md="5"
                  :sm="7"
                >
                  <a-form-item label="缴纳月">
                    <a-month-picker
                      allowClear
                      placeholder="请选择缴纳月"
                      v-model="queryParam.socialSecurityMonth"
                      format="YYYYMM"
                      style="width: 148px"
                    />
                  </a-form-item>
                </a-col>
                <a-col
                  :md="5"
                  :sm="7"
                >
                  <a-form-item label="身份证">
                    <a-input
                      placeholder="请输入身份证"
                      style="width: 148px"
                      v-model="queryParam.empIdcard"/>
                  </a-form-item>
                </a-col>
                <a-col
                  :md="5"
                  :sm="7"
                >
                  <a-form-item label="姓名">
                    <a-input placeholder="请输入姓名" v-model="queryParam.empName" style="width: 148px"/>
                  </a-form-item>
                </a-col>
                <template v-if="toggleSearchStatus">
                  <a-col
                    :md="5"
                    :sm="7"
                  >
                    <a-form-item label="缴纳地">
                      <a-input
                        placeholder="请输入社保缴纳地"
                        style="width: 148px"
                        v-model="queryParam.socialSecurityAddr"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                </template>
                <a-col
                  :md="6"
                  :sm="8"
                >
                  <span
                    style="float: left;overflow: hidden;margin-bottom:10px;"
                    class="table-page-search-submitButtons"
                  >
                    <a-button
                      type="primary"
                      @click="searchQuery"
                      icon="search"
                    >查询</a-button>
                    <a-button
                      type="primary"
                      @click="searchReset"
                      icon="reload"
                      style="margin-left: 8px"
                    >重置</a-button>
                    <a
                      @click="()=>{toggleSearchStatus = !toggleSearchStatus}"
                      style="margin-left: 8px"
                    >
                      {{ toggleSearchStatus ? '收起' : '展开' }}
                      <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                    </a>
                  </span>
                </a-col>
              </a-row>
              <a-row style="margin-top:10px">
                <a-col :span="24" v-if="btnStatus.confirm && isEdit && ipagination.total">
                  <a-button style="margin-bottom:10px;" type="primary" :loading="loadingDel" @click="handleDelete(0)"><a-icon type="delete" />批量移除</a-button>
                </a-col>
                <a-col :span="24">
                  <a-table
                    rowKey="id"
                    :columns="tabPaneThreeColumns"
                    :dataSource="tabPaneThreeDataSource"
                    :scroll="{ x: 1 }"
                    :pagination="ipagination"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    @change="handleTableChange"
                  >
                    <span slot="action" slot-scope="text, record">
                      <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                        <a>删除</a>
                      </a-popconfirm>
                    </span>
                    <!-- 列缩放隐藏模板 -->
                    <template
                      v-for="(defineColumn, key) in tabPaneThreeDefineColumns"
                      :slot="key"
                      slot-scope="text, record"
                    >
                      <span :key="key">
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
          v-if="tabPaneFourShow"
          :forceRender="true"
          tab="结算表"
          key="4"
        >
          <div v-if="isEdit" class="operateBtnWrap">
            <a-button
              type="primary"
              @click="addCustomItem()"
            >添加自定义项</a-button>
          </div>
          <a-spin :spinning="confirmLoading">
            <a-form
              :form="tabPaneFour"
              layout="inline"
              class="ant-advanced-search-form"
            >
              <a-row>
                <a-card class="staffCard">
                  <table class="table1" aria-describedby="结算表">
                    <tr class="tr1">
                      <th class="td1" scope="col">单位名称</th>
                      <td
                        class="td2"
                        colspan="3"
                        style="text-align: left;"
                      >{{ forecastFormData.unitName }}</td>
                      <th class="td1" scope="col">皖信盖章</th>
                      <td></td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">结算主体</td>
                      <td
                        class="td2"
                        colspan="5"
                        style="text-align: left;"
                      >{{ forecastFormData.departName }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">结算时间</td>
                      <td
                        class="td2"
                        colspan="5"
                        style="text-align: left;"
                      >{{ forecastBillData.billDate }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">序号</td>
                      <td
                        class="td1"
                        colspan="2"
                      >费用项目</td>
                      <td class="td1">金额</td>
                      <td class="td1">增值税金</td>
                      <td class="td1">开票金额</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">1</td>
                      <td
                        class="td2"
                        rowspan="7"
                      >
                        <div
                          style="width:150px;white-space: nowrap;text-overflow:ellipsis;overflow:hidden;"
                          :title="forecastBillData.payMonths"
                        >{{ forecastBillData.payMonths }}</div>
                      </td>
                      <td class="td1">应缴单位社保</td>
                      <td class="td2">{{ forecastBillData.unitSocial * 1 }}</td>
                      <td class="td2">{{ forecastBillData.unitSocialTax * 1 }}</td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.unitSocial * 1 + forecastBillData.unitSocialTax * 1) }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">2</td>
                      <td class="td1">代扣个人社保</td>
                      <td class="td2">{{ forecastBillData.personalSocial * 1 }}</td>
                      <td class="td2">{{ forecastBillData.personalSocialTax * 1 }}</td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.personalSocial * 1 + forecastBillData.personalSocialTax * 1) }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">3</td>
                      <td class="td1">应缴单位公积金</td>
                      <td class="td2">{{ forecastBillData.unitProvident * 1 }}</td>
                      <td class="td2">{{ forecastBillData.unitProvidentTax * 1 }}</td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.unitProvident * 1 + forecastBillData.unitProvidentTax * 1) }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">4</td>
                      <td class="td1">代扣个人公积金</td>
                      <td class="td2">{{ forecastBillData.personalProvident * 1 }}</td>
                      <td class="td2">{{ forecastBillData.personalProvidentTax * 1 }}</td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.personalProvident * 1 + forecastBillData.personalProvidentTax * 1) }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">5</td>
                      <td class="td1">社保缴纳总合计</td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.socialSum * 1) }}</td>
                      <td class="td2">-</td>
                      <td class="td2">-</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">6</td>
                      <td class="td1">公积金缴纳总合计</td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.fundSum * 1) }}</td>
                      <td class="td2">-</td>
                      <td class="td2">-</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">7</td>
                      <td class="td1">总合计</td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.sum * 1) }}</td>
                      <td class="td2">-</td>
                      <td class="td2">-</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">8</td>
                      <td
                        class="td1"
                        colspan="2"
                      >单位社保差额</td>
                      <td class="td2">{{ forecastBillData.unitSocialDiff * 1 }}</td>
                      <td class="td2">{{ forecastBillData.unitSocialDiffTax * 1 }}</td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.unitSocialDiff * 1 + forecastBillData.unitSocialDiffTax * 1) }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">9</td>
                      <td
                        class="td1"
                        colspan="2"
                      >个人社保差额</td>
                      <td class="td2">{{ forecastBillData.personalSocialDiff * 1 }}</td>
                      <td class="td2">{{ forecastBillData.personalSocialDiffTax * 1 }}</td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.personalSocialDiff * 1 + forecastBillData.personalSocialDiffTax * 1) }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">10</td>
                      <td
                        class="td1"
                        colspan="2"
                      >单位公积金差额</td>
                      <td class="td2">{{ forecastBillData.unitPrividentDiff * 1 }}</td>
                      <td class="td2">{{ forecastBillData.unitPrividentDiffTax * 1 }}</td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.unitPrividentDiff * 1 + forecastBillData.unitPrividentDiffTax * 1) }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">11</td>
                      <td
                        class="td1"
                        colspan="2"
                      >个人公积金差额</td>
                      <td class="td2">{{ forecastBillData.personalProvidentDiff * 1 }}</td>
                      <td class="td2">{{ forecastBillData.personalProvidentDiffTax * 1 }}</td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.personalProvidentDiff * 1 + forecastBillData.personalProvidentDiffTax * 1) }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">12</td>
                      <td
                        class="td1"
                        colspan="2"
                      >管理费差额</td>
                      <td class="td2">{{ forecastBillData.managementFeeDiff * 1 }}</td>
                      <td class="td2">{{ forecastBillData.managementFeeDiffTax * 1 }}</td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.managementFeeDiff * 1 + forecastBillData.managementFeeDiffTax * 1) }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">13</td>
                      <td
                        class="td1"
                        colspan="2"
                      >服务人数</td>
                      <!--<td class="td2">{{ forecastBillData.serverPeopleNum * 1 }}</td>-->
                      <td class="td2">
                        <div v-if="serverPeopleNumFlag">
                          <a-form-item class="tableFormItem">
                            <a-tooltip
                              placement="top"
                              :title="msg"
                            >
                              <a-input
                                placeholder="人数"
                                onkeyup="this.value=this.value.replace(/^(0+)|[^\d]+/g,'')"
                                v-decorator="['serverPeopleNum',validatorRules.serverPeopleNum]"
                                :style="{'width':'80px','height':'27px','marginRight':'8px'}"
                              />
                            </a-tooltip>
                          </a-form-item>
                          <a-icon type="check" style="cursor: pointer;" @click="saveserverPeopleNum(1)"/>&nbsp;
                          <a-icon type="close" style="cursor: pointer;" @click="editserverPeopleNum(1)"/>
                        </div>
                        <span v-else>
                          {{ forecastBillData.serverPeopleNum*1 }}
                          <a-icon type="edit" style="cursor: pointer;" @click="editserverPeopleNum(1)" v-if="isEdit && forecastFormData.status == 0"/>
                        </span>
                      </td>
                      <td class="td2">-</td>
                      <td class="td2">-</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">14</td>
                      <td
                        class="td1"
                        colspan="2"
                      >服务人次</td>
                      <!--<td class="td2">{{ forecastBillData.serverPeople * 1 }}</td>-->
                      <td class="td2">
                        <div v-if="serverPeopleFlag">
                          <a-form-item class="tableFormItem">
                            <a-tooltip
                              placement="top"
                              :title="msg"
                            >
                              <a-input
                                placeholder="人次"
                                onkeyup="this.value=this.value.replace(/^(0+)|[^\d]+/g,'')"
                                v-decorator="['serverPeople',validatorRules.serverPeopleNum]"
                                :style="{'width':'80px','height':'27px','marginRight':'8px'}"
                              />
                            </a-tooltip>
                          </a-form-item>
                          <a-icon type="check" style="cursor: pointer;" @click="saveserverPeopleNum(2)"/>&nbsp;
                          <a-icon type="close" style="cursor: pointer;" @click="editserverPeopleNum(2)"/>
                        </div>
                        <span v-else>
                          {{ forecastBillData.serverPeople*1 }}
                          <a-icon type="edit" style="cursor: pointer;" @click="editserverPeopleNum(2)" v-if="isEdit && forecastFormData.status == 0"/>
                        </span>
                      </td>
                      <td class="td2">-</td>
                      <td class="td2">-</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">15</td>
                      <td
                        class="td1"
                        colspan="2"
                      >社保卡费</td>
                      <td class="td2">{{ forecastBillData.socialCardFee * 1 }}</td>
                      <td class="td2">-</td>
                      <td class="td2">-</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">16</td>
                      <td
                        class="td1"
                        colspan="2"
                      >商险</td>
                      <td class="td2">{{ forecastBillData.businessInsurance * 1 }}</td>
                      <td class="td2">{{ forecastBillData.businessInsuranceTax * 1 }}</td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.businessInsurance * 1 + forecastBillData.businessInsuranceTax * 1) }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">17</td>
                      <td
                        class="td1"
                        colspan="2"
                      >商险差额</td>
                      <td class="td2">{{ forecastBillData.takingBalance * 1 }}</td>
                      <td class="td2">{{ forecastBillData.takingBalanceTax * 1 }}</td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.takingBalance * 1 + forecastBillData.takingBalanceTax * 1) }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">18</td>
                      <td
                        class="td1"
                        colspan="2"
                      >管理费</td>
                      <!--
                        <td class="td2">{{ forecastBillData.managementFee * 1 }}</td>
                        <td class="td2">{{ forecastBillData.managementFeeTax * 1 }}</td>
                        <td class="td2">{{ this.formatFloat(forecastBillData.managementFee * 1 + forecastBillData.managementFeeTax * 1) }}</td>
                      -->
                      <td class="td2">
                        <div v-if="managementFeeFlag">
                          <a-form-item class="tableFormItem">
                            <a-tooltip
                              placement="top"
                              :title="msg"
                            >
                              <a-input
                                placeholder="管理费"
                                v-decorator="['managementFee',validatorRules.managementFeeTwo]"
                                :style="{'width':'80px','height':'27px','marginRight':'8px'}"
                              />
                            </a-tooltip>
                          </a-form-item>
                          <a-icon type="check" style="cursor: pointer;" @click="saveManagementFee(1)"/>&nbsp;
                          <a-icon type="close" style="cursor: pointer;" @click="editManagementFee(1)"/>
                        </div>
                        <span v-else>
                          {{ forecastBillData.managementFee*1 }}
                          <a-icon type="edit" style="cursor: pointer;" @click="editManagementFee(1)" v-if="isEdit && forecastFormData.status == 0"/>
                        </span>
                      </td>
                      <!--<td class="td2">{{ forecastBillData.managementFeeTax * 1 }}</td>--> 
                      <td class="td2">
                        <div v-if="managementFeeTaxFlag">
                          <a-form-item class="tableFormItem">
                            <a-tooltip
                              placement="top"
                              :title="msg"
                            >
                              <a-input
                                placeholder="增值税金"
                                v-decorator="['managementFeeTax',validatorRules.managementFeeTwo]"
                                :style="{'width':'80px','height':'27px','marginRight':'8px'}"
                              />
                            </a-tooltip>
                          </a-form-item>
                          <a-icon type="check" style="cursor: pointer;" @click="saveManagementFee(2)"/>&nbsp;
                          <a-icon type="close" style="cursor: pointer;" @click="editManagementFee(2)"/>
                        </div>
                        <span v-else>
                          {{ forecastBillData.managementFeeTax*1 }}
                          <a-icon type="edit" style="cursor: pointer;" @click="editManagementFee(2)" v-if="isEdit && forecastFormData.status == 0"/>
                        </span>
                      </td>
                      <td class="td2">{{ this.formatFloat(forecastBillData.managementFee * 1 + forecastBillData.managementFeeTax * 1) }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1">19</td>
                      <td
                        class="td1"
                        colspan="2"
                      >管理费2</td>
                      <td class="td2">
                        <div v-if="managementFeeTwoFlag">
                          <a-form-item class="tableFormItem">
                            <a-tooltip
                              placement="top"
                              :title="msg"
                            >
                              <a-input
                                placeholder="金额"
                                v-decorator="['managementFeeTwo',validatorRules.managementFeeTwo]"
                                :style="{'width':'80px','height':'27px','marginRight':'8px'}"
                              />
                            </a-tooltip>
                          </a-form-item>
                          <a-icon type="check" style="cursor: pointer;" @click="saveManagementFeeTwo"/>&nbsp;
                          <a-icon type="close" style="cursor: pointer;" @click="editManagementFeeTwo"/>
                        </div>
                        <span v-else>
                          {{ forecastBillData.managementFeeTwo*1 }}
                          <a-icon type="edit" style="cursor: pointer;" @click="editManagementFeeTwo" v-if="isEdit && forecastFormData.status == 0"/>
                        </span>
                      </td>
                      <td class="td2">-</td>
                      <td class="td2">{{ forecastBillData.managementFeeTwo * 1 }}</td>
                    </tr>

                    <tr
                      v-for="(item, index) in withholdData"
                      :key="index"
                      class="tr1"
                    >
                      <td
                        class="tit td1"
                        colspan="3"
                      >{{ getItemName(item.itemTypeName,item.subName) }}
                        <a-popconfirm
                          v-if="isEdit"
                          title="确定删除吗?"
                          @confirm="() => deleteCustomItem(index)"
                        >
                          <a-icon
                            type="delete"
                            style="color:red;cursor:pointer"
                          />
                        </a-popconfirm>
                      </td>
                      <td class="td2">{{ item.money ? item.money : item.money }}</td>
                      <td class="td2">{{ item.tax ? item.tax : item.tax }}</td>
                      <td class="td2">{{ item.ticket ? item.ticket : item.ticket }}</td>
                    </tr>


                    <tr class="tr1">
                      <td
                        class="td1"
                        colspan="3"
                      >结算金额合计</td>
                      <td class="td2">-</td>
                      <td class="td2">-</td>
                      <td class="td2">{{ forecastFormData.billFee * 1 }}</td>
                    </tr>
                    <tr class="tr1">
                      <td
                        class="td1"
                        colspan="3"
                      >
                        开票金额合计
                        <a-icon
                          v-if="btnStatus.submit && isEdit"
                          type="edit"
                          style="color:red;cursor:pointer;font-size:18px"
                          @click="handleInvoiceInfo"
                        />
                      </td>
                      <td class="td2">-</td>
                      <td class="td2">-</td>
                      <td class="td2">{{ forecastFormData.ticketFee * 1 }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1" colspan="3">上次差余额</td>
                      <td class="td2" colspan="3">
                        <div v-if="prevPoorBalanceFlag">
                          <a-form-item class="tableFormItem">
                            <a-tooltip
                              placement="top"
                              :title="msg"
                            >
                              <a-input
                                placeholder="上次差余额"
                                v-decorator="['prevPoorBalance',validatorRules.prevPoorBalance]"
                                :style="{'width':'150px','height':'27px','marginRight':'8px'}"
                              />
                            </a-tooltip>
                          </a-form-item>
                          <a-icon type="check" @click="savePoorBalance"/>&nbsp;&nbsp;
                          <a-icon type="close" @click="editPrePoorBalance"/>
                        </div>
                        <span v-else>
                          {{ forecastFormData.prevPoorBalance * 1 }}
                          <a-icon type="edit" style="cursor: pointer;" @click="editPrePoorBalance" v-if="isEdit && forecastFormData.status<4"/>
                        </span>
                      </td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1" colspan="3">本次差余额</td>
                      <td class="td2" colspan="3">{{ forecastFormData.curPoorBalance * 1 }}</td>
                    </tr>
                    <tr class="tr1">
                      <td class="tit td1" colspan="3">备注</td>
                      <td
                        class="td2"
                        colspan="3"
                      >
                        <input
                          v-if="isEdit"
                          style="border-radius:5px;border:1px solid gray;width:100%"
                          :value="forecastBillData.remark"
                          maxLength="50"
                          @blur="blurSettleRemark"
                        >
                        <span v-else>{{ forecastBillData.remark }}</span>
                      </td>
                    </tr>
                    <tr class="tr1">
                      <td class="td1" colspan="2">开票客户名称</td>
                      <td class="td1" colspan="2">开票金额</td>
                      <td class="td1" colspan="2">开票时间</td>
                    </tr>
                    <tr
                      v-for="item in invoiceInfo"
                      :key="item.id"
                    >
                      <td colspan="2" class="td2">{{ item.unitName }}</td>
                      <td colspan="2" class="td2">{{ item.invoiceMoney }}</td>
                      <td colspan="2" class="td2">{{ item.applyDate }}</td>
                    </tr>
                    <tr>
                      <td class="td1" colspan="2">到款单位</td>
                      <td class="td1" colspan="2">到款时间</td>
                      <td class="td1">来款金额</td>
                      <td class="td1">认领金额</td>
                    </tr>
                    <tr
                      v-for="item in reciveList"
                      :key="item.id"
                    >
                      <td colspan="2" class="td2">{{ item.reciveRecordList[0].incomeBelong }}</td>
                      <td colspan="2" class="td2">{{ item.releaseDate }}</td>
                      <td class="td2">{{ item.incomeFee }}</td>
                      <td class="td2">{{ item.reciveRecordList[0].reciveFee }}</td>
                    </tr>
                  </table>
                </a-card>
              </a-row>
            </a-form>
          </a-spin>
        </a-tab-pane>

        <a-tab-pane
          :forceRender="true"
          tab="流程进展明细"
          key="6"
        >
          <a-spin :spinning="confirmLoading">
            <a-form
              :form="auditForm"
              layout="inline"
              class="ant-advanced-search-form"
            >
              <a-row>
                <a-col :span="24">
                  <template v-if="auditList.length > 0">
                    <a-timeline style="margin-left: 50px">
                      <template v-for="(list, key) in auditList">
                        <a-timeline-item
                          :key="key"
                          :color="auditStatusOptions[list.auditStatus].color"
                        >
                          <p>{{ list.auditRemark ? list.auditRemark : '' }}</p>
                          <p>{{ list.auditUser ? list.auditUser : '' }}</p>
                          <p>{{ list.auditTime ? list.auditTime : '' }}</p>
                        </a-timeline-item>
                      </template>
                    </a-timeline>
                  </template>
                  <template v-else>
                    <section class="code-box-demo">
                      <div class="ant-empty">
                        <div class="ant-empty-image">
                          <img
                            alt="暂无数据"
                            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE1MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQgMzEuNjcpIj4KICAgICAgPGVsbGlwc2UgZmlsbC1vcGFjaXR5PSIuOCIgZmlsbD0iI0Y1RjVGNyIgY3g9IjY3Ljc5NyIgY3k9IjEwNi44OSIgcng9IjY3Ljc5NyIgcnk9IjEyLjY2OCIvPgogICAgICA8cGF0aCBkPSJNMTIyLjAzNCA2OS42NzRMOTguMTA5IDQwLjIyOWMtMS4xNDgtMS4zODYtMi44MjYtMi4yMjUtNC41OTMtMi4yMjVoLTUxLjQ0Yy0xLjc2NiAwLTMuNDQ0LjgzOS00LjU5MiAyLjIyNUwxMy41NiA2OS42NzR2MTUuMzgzaDEwOC40NzVWNjkuNjc0eiIgZmlsbD0iI0FFQjhDMiIvPgogICAgICA8cGF0aCBkPSJNMTAxLjUzNyA4Ni4yMTRMODAuNjMgNjEuMTAyYy0xLjAwMS0xLjIwNy0yLjUwNy0xLjg2Ny00LjA0OC0xLjg2N0gzMS43MjRjLTEuNTQgMC0zLjA0Ny42Ni00LjA0OCAxLjg2N0w2Ljc2OSA4Ni4yMTR2MTMuNzkyaDk0Ljc2OFY4Ni4yMTR6IiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMy41NikiLz4KICAgICAgPHBhdGggZD0iTTMzLjgzIDBoNjcuOTMzYTQgNCAwIDAgMSA0IDR2OTMuMzQ0YTQgNCAwIDAgMS00IDRIMzMuODNhNCA0IDAgMCAxLTQtNFY0YTQgNCAwIDAgMSA0LTR6IiBmaWxsPSIjRjVGNUY3Ii8+CiAgICAgIDxwYXRoIGQ9Ik00Mi42NzggOS45NTNoNTAuMjM3YTIgMiAwIDAgMSAyIDJWMzYuOTFhMiAyIDAgMCAxLTIgMkg0Mi42NzhhMiAyIDAgMCAxLTItMlYxMS45NTNhMiAyIDAgMCAxIDItMnpNNDIuOTQgNDkuNzY3aDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI0SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjR6TTQyLjk0IDYxLjUzaDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI1SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjV6TTEyMS44MTMgMTA1LjAzMmMtLjc3NSAzLjA3MS0zLjQ5NyA1LjM2LTYuNzM1IDUuMzZIMjAuNTE1Yy0zLjIzOCAwLTUuOTYtMi4yOS02LjczNC01LjM2YTcuMzA5IDcuMzA5IDAgMCAxLS4yMjItMS43OVY2OS42NzVoMjYuMzE4YzIuOTA3IDAgNS4yNSAyLjQ0OCA1LjI1IDUuNDJ2LjA0YzAgMi45NzEgMi4zNyA1LjM3IDUuMjc3IDUuMzdoMzQuNzg1YzIuOTA3IDAgNS4yNzctMi40MjEgNS4yNzctNS4zOTNWNzUuMWMwLTIuOTcyIDIuMzQzLTUuNDI2IDUuMjUtNS40MjZoMjYuMzE4djMzLjU2OWMwIC42MTctLjA3NyAxLjIxNi0uMjIxIDEuNzg5eiIgZmlsbD0iI0RDRTBFNiIvPgogICAgPC9nPgogICAgPHBhdGggZD0iTTE0OS4xMjEgMzMuMjkybC02LjgzIDIuNjVhMSAxIDAgMCAxLTEuMzE3LTEuMjNsMS45MzctNi4yMDdjLTIuNTg5LTIuOTQ0LTQuMTA5LTYuNTM0LTQuMTA5LTEwLjQwOEMxMzguODAyIDguMTAyIDE0OC45MiAwIDE2MS40MDIgMCAxNzMuODgxIDAgMTg0IDguMTAyIDE4NCAxOC4wOTdjMCA5Ljk5NS0xMC4xMTggMTguMDk3LTIyLjU5OSAxOC4wOTctNC41MjggMC04Ljc0NC0xLjA2Ni0xMi4yOC0yLjkwMnoiIGZpbGw9IiNEQ0UwRTYiLz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0OS42NSAxNS4zODMpIiBmaWxsPSIjRkZGIj4KICAgICAgPGVsbGlwc2UgY3g9IjIwLjY1NCIgY3k9IjMuMTY3IiByeD0iMi44NDkiIHJ5PSIyLjgxNSIvPgogICAgICA8cGF0aCBkPSJNNS42OTggNS42M0gwTDIuODk4LjcwNHpNOS4yNTkuNzA0aDQuOTg1VjUuNjNIOS4yNTl6Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                          >
                        </div>
                        <p class="ant-empty-description">暂无流程数据</p>
                      </div>
                    </section>
                  </template>
                </a-col>
              </a-row>
            </a-form>
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
    
    <forecast-bill-audit-modal
      ref="forecastBillAuditModal"
      @ok="forecastBillAuditModalFormOk"
    ></forecast-bill-audit-modal>
    <forecast-bill-verification-modal
      ref="forecastBillVerificationModal"
      @ok="forecastBillVerificationModalFormOk"
    ></forecast-bill-verification-modal>
    <add-custom-item-modal
      ref="addCustomItemModal"
      @ok="addCustomItemModalCallback">
    </add-custom-item-modal>
    <!-- 修改开票合计金额 -->
    <other-invoice-apply-entrance-modal
      ref="otherInvoiceApplyEntranceModal"
      @ok="otherInvoiceApplyEntranceModalOk"
    ></other-invoice-apply-entrance-modal>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import { getAreaName,getItemName,hasOperatePermission,getAreaData } from '@/utils/common'
  import ForecastBillAuditModal from './ForecastBillAuditModal'
  import { filterDictText } from '@/components/dict/JDictSelectUtil'
  import ForecastBillVerificationModal from './ForecastBillVerificationModal'
  import AddCustomItemModal from './AddCustomItemModal'
  import OtherInvoiceApplyEntranceModal from '../../../tfinancial/invoicemanage/modules/OtherInvoiceApplyEntranceModal'
  import moment from 'dayjs'

  export default {
    name: 'ForecastBillDetailModal',
    components: {
      ForecastBillAuditModal,
      ForecastBillVerificationModal,
      AddCustomItemModal,
      OtherInvoiceApplyEntranceModal
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        isVerify: false, // 是否显示确定按钮
        activeKey: '1', // 默认第一个tab
        auditStatus: false, // 是否是审核
        downLoading: false,
        okStatusOfSubmit: 0, // 记录第几次点击提交按钮
        tabPaneOneShow: true, // 第一个tab是否显示
        tabPaneTwoShow: true, // 第二个tab是否显示
        tabPaneThreeShow: true, // 第三个tab是否显示
        tabPaneFourShow: true, // 第四个tab是否显示
        confirmLoading: false,
        tabPaneOne: this.$form.createForm(this),
        tabPaneTwo: this.$form.createForm(this),
        tabPaneThree: this.$form.createForm(this),
        tabPaneFour: this.$form.createForm(this),
        auditForm: this.$form.createForm(this),
        invoiceForm: this.$form.createForm(this),
        msg: '请输入有效数字！', // 提示
        inputStyle: 'width:80px;height:23px;', // 表单样式（查看的时候输入框隐藏）
        inputDisabledStyle: 'border:0;width:80px;height:23px;', // 表单样式（查看的时候输入框隐藏）
        auditList: [],  // 审核流程数据
        buyTypeBelongs: [], // 购买类型
        settleTypeBelongs: [],  // 结算类型
        dispatchStatusBelongs: [],  // 商险状态
        tabPaneOneColumns: [],  // 第一个tab行
        tabPaneOneDataSource: [], // 第一个tab数据
        tabPaneTwoColumns: [],  // 第二个tab行
        tabPaneTwoDataSource: [], // 第二个tab数据
        tabPaneThreeColumns: [],  // 第三个tab行
        tabPaneThreeDataSource: [], // 第三个tab数据
        forecastBillData: {}, // 结算单数据
        forecastFormData: {}, // 结算单主表数据
        settleDomainBelongs: [],  // 结算主体和所属单位
        organizationBelongs: [],  // 社保户、公积金户
        withholdData:[], // 自定义项数据
        auditStatusOptions: {
          '0': {'option': '待提交', 'color': 'blue'},
          '1': {'option': '待审核', 'color': 'pink'},
          '2': {'option': '待开票', 'color': 'cyan'},
          '3': {'option': '已结算', 'color': 'green'},
          '4': {'option': '退回', 'color': 'red'},
        },
        invoiceSource: [], // 编辑的时候列表数据
        invoiceColumns: [
          {
            title: '结算金额',
            align: 'center',
            dataIndex: 'settleMoney',
            customRender: (text) => {
              return text ? text : '-'
            },
          },
        ],
        tabPaneOneDefineColumns: {empNo: {width: 140}, empName: {width: 60}, empIdcard: {width: 140}, unitId: {key: 'settleDomainId', width: 140, type: 'settle', options: [], name: 'customerName'}, settleDomainId: {key: 'settleDomainId', width: 140, type: 'settle', options: [], name: 'departName'}},  // 隐藏列字段数组
        tabPaneTwoDefineColumns: {empNo: {width: 140}, empName: {width: 60}, empIdcardNo: {width: 140}, unitId: {key: 'settlementOrgan', width: 140, type: 'settle', options: [], name: 'customerName'}, settlementOrgan: {key: 'settlementOrgan', width: 140, type: 'settle', options: [], name: 'departName'}, insuranceCompanyName: {width: 160}, policyNo: {width: 160}, insuranceTypeName: {width: 160}},  // 隐藏列字段数组
        tabPaneThreeDefineColumns: {empNo: {width: 120}, empName: {width: 140},empIdcard:{width:160}, unitId: {key: 'departId', width: 180, type: 'settle', options: [], name: 'customerName'}, departId: {key: 'departId', width: 180, type: 'settle', options: [], name: 'departName'}},  // 隐藏列字段数组
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          managementFeeTwo:{rules: [
            { required: true, message: '不能为空!' },
            {pattern:/((^[1-9]\d*)|^0|-[1-9]\d*|-0\.\d{1,2}?$)(\.\d{1,2})?$/,message:'格式不正确!'},
          ]},
          prevPoorBalance: { rules: [
            { required: true, message: '上次差余额不能为空!' },
            {pattern:/((^[1-9]\d*)|^0|-[1-9]\d*|-0\.\d{1,2}?$)(\.\d{1,2})?$/,message:'上次差余额格式不正确!'},
          ] }, //上次差余额
          serverPeopleNum: {
            rules: [{pattern:/^[1-9]\d*$/,message:'必须为正整数!'}]
          }
        },
        url: {
          managementFeeEdit: 'hrSocial/tforecastbill/managerTwoFeeEdit',  //  管理费2修改
          ticketFeeSumEdit: 'hrSocial/tforecastbill',  //  开票金额合计修改
          refrash:'hrSocial/tforecastform/refreshForecastSettle',
          confirm:'hrSocial/tforecastform/forecastFormConfirm',
          edit:'hrSocial/tforecastform',
          serverEdit:'hrSocial/tforecastform/updatePeopleCount',//服务人次、人数、管理费、管理费税的修改
          editBillRemark:'hrSocial/tforecastbill', // 编辑结算单备注
          deleteCustomItemUrl:'/hrSocial/tforecastbillsub/', // 删除自定义项
        },
        invoiceInfo:[], // 开票信息
        reciveList:[], // 到款信息
        btnStatus:{ // 按钮状态
          refrash:false, //刷新
          upload:false,
          confirm:false,
          audit:false,
          submit:false,
        },
        downDisabled:false,
        auditProcessUrl:'',
        status:'',
        prevPoorBalanceFlag:false, // 上次差余额是否可修改
        managementFeeTwoFlag:false, // 管理费2是否可修改
        managementFeeFlag:false, // 管理费是否可修改
        managementFeeTaxFlag:false, // 管理费税是否可修改
        serverPeopleNumFlag:false,//服务人数是否可修改
        serverPeopleFlag:false,//服务人次是否可修改
        isEdit:false, // 是否可编辑
        toggleSearchStatus: false,
        queryParam:{},
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30', '50', '100'],
          showTotal: (total, range) => {
            return `${range[0]}-${range[1]} 共${total}条`
          },
          showQuickJumper: false,
          showSizeChanger: true,
          total: 0,
        },
        selectedRowKeys:[],
        selectionRows:[],
        loadingDel:false,
        exportLoading:false,//导出
        ycexportLoading:false,// 易才导出
        ycprimary:'primary',
        addressMap: {}
      }
    },
    created(){
      this.addressMap = this.treeToList(getAreaData() || []);
    },
    methods: {
      hasOperatePermission,
      getItemName,
      treeToList(tree){
        let list = {};
        function depAppend(node){
          node.forEach(item=>{
            list[item.id] = item;
            if(item.children && item.children.length > 0){
              depAppend(item.children)
            }
          })
        }
        depAppend(tree)
        return list;
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectionRows = selectionRows
      },
      edit(record, auditProcessUrl,status) {
        this.auditProcessUrl = auditProcessUrl
        this.status = status
        // 自定义项数据
        this.withholdData = record.tforecastBillSubList || []
        // 按钮状态
        switch(Number(status)){
          case 0:
            this.btnStatus.refrash = true
            this.btnStatus.confirm = true
            break
          case 1:
            this.btnStatus.upload = true
            this.btnStatus.submit = true
            break
          case 2:
            this.btnStatus.upload = true
            this.btnStatus.submit = true
            break
          case 3:
            this.btnStatus.audit = true
            break
        }
        this.tabPaneOne.resetFields()
        this.tabPaneTwo.resetFields()
        this.tabPaneThree.resetFields()
        this.tabPaneFour.resetFields()
        this.auditForm.resetFields()
        this.invoiceForm.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        // 流程进展明细
        if (auditProcessUrl) {
          httpAction(`${auditProcessUrl}?id=${this.model.forecastForm.id}&type=4`, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.auditList = res.data
            } else {
              this.$message.error('流程进展数据不完整！')
            }
          })
        }
        /**************************************************** 预估明细表数据 ****************************************************/
        if (this.model.forecastLibraryList) {
          this.tabPaneOneDefineColumns.unitId.options = this.tabPaneOneDefineColumns.settleDomainId.options = this.settleDomainBelongs
          this.tabPaneOneDataSource = this.model.forecastLibraryList
          this.tabPaneOneColumns = [
            { title: '员工编码', fixed: 'left', width: 180, align: 'center', scopedSlots: { customRender: 'empNo' } },
            { title: '员工姓名', fixed: 'left', width: 100, align: 'center', scopedSlots: { customRender: 'empName' } },
            { title: '身份证号', dataIndex: 'empIdcard', width: 180, align: 'center', scopedSlots: { customRender: 'empIdcard' } },
            { title: '单位名称', dataIndex: 'unitId', align: 'center',width: 200, scopedSlots: { customRender: 'unitId' } },
            { title: '结算主体', dataIndex: 'settleDomainId', align: 'center', width: 200,scopedSlots: { customRender: 'settleDomainId' } },
            { title: '社保缴纳地', dataIndex: 'socialProvince', key: 'socialProvince', width: 180, align: 'center',customRender:(text,record)=>{
              return getAreaName(text,record.socialCity,record.socialTown,'-')
            } },
            { title: '公积金缴纳地', dataIndex: 'fundProvince', key: 'fundProvince', width: 180, align: 'center',customRender:(text,record)=>{
              return getAreaName(text,record.fundCity,record.fundTown,'-')
            } },
            { title: '社保缴纳月份', dataIndex: 'socialPayMonth', key: 'socialPayMonth', width: 120, align: 'center' },
            { title: '社保生成月份', dataIndex: 'socialCreateMonth', key: 'socialCreateMonth', width: 120, align: 'center' },
            { title: '公积金缴纳月份', dataIndex: 'providentPayMonth', key: 'providentPayMonth', width: 140, align: 'center' },
            { title: '公积金生成月份', dataIndex: 'providentCreateMonth', key: 'providentCreateMonth', width: 140, align: 'center' },
            { title: '单位养老保险', dataIndex: 'unitPensionFee', key: 'unitPensionFee', width: 120, align: 'center',customRender:(text,record)=>{
              return (record.forecastSocialFormId == this.model.forecastForm.id) ? text : 0
            } },
            { title: '单位医疗保险', dataIndex: 'unitMedicalFee', key: 'unitMedicalFee', width: 120, align: 'center' ,customRender:(text,record)=>{
              return (record.forecastSocialFormId == this.model.forecastForm.id) ? text : 0
            }},
            { title: '单位失业保险', dataIndex: 'unitUnemploymentFee', key: 'unitUnemploymentFee', width: 120, align: 'center',customRender:(text,record)=>{
              return (record.forecastSocialFormId == this.model.forecastForm.id) ? text : 0
            }},
            { title: '单位工伤保险', dataIndex: 'unitWorkInjuryFee', key: 'unitWorkInjuryFee', width: 120, align: 'center',customRender:(text,record)=>{
              return (record.forecastSocialFormId == this.model.forecastForm.id) ? text : 0
            } },
            { title: '单位生育保险', dataIndex: 'unitBirthFee', key: 'unitBirthFee', width: 120, align: 'center',customRender:(text,record)=>{
              return (record.forecastSocialFormId == this.model.forecastForm.id) ? text : 0
            } },
            { title: '单位大病救助', dataIndex: 'unitBitmailmentFee', key: 'unitBitmailmentFee', width: 120, align: 'center',customRender:(text,record)=>{
              return (record.forecastSocialFormId == this.model.forecastForm.id) ? text : 0
            } },
            { title: '单位社保总计', dataIndex: 'unitSocialSum', key: 'unitSocialSum', width: 120, align: 'center',customRender:(text,record)=>{
              return (record.forecastSocialFormId == this.model.forecastForm.id) ? text : 0
            } },
            { title: '单位住房公积金', dataIndex: 'unitFundSum', key: 'unitFundSum', width: 140, align: 'center',customRender:(text,record)=>{
              return (record.forecastFundFormId == this.model.forecastForm.id) ? text : 0
            } },
            { title: '个人养老保险', dataIndex: 'personalPensionFee', key: 'personalPensionFee', width: 130, align: 'center',customRender:(text,record)=>{
              return (record.forecastSocialFormId == this.model.forecastForm.id) ? text : 0
            } },
            { title: '个人医疗保险', dataIndex: 'personalMedicalFee', key: 'personalMedicalFee', width: 130, align: 'center',customRender:(text,record)=>{
              return (record.forecastSocialFormId == this.model.forecastForm.id) ? text : 0
            } },
            { title: '个人失业保险', dataIndex: 'personalUnemploymentFee', key: 'personalUnemploymentFee', width: 130, align: 'center',customRender:(text,record)=>{
              return (record.forecastSocialFormId == this.model.forecastForm.id) ? text : 0
            } },
            { title: '个人大病救助', dataIndex: 'personalBigmailmentFee', key: 'personalBigmailmentFee', width: 130, align: 'center',customRender:(text,record)=>{
              return (record.forecastSocialFormId == this.model.forecastForm.id) ? text : 0
            } },
            { title: '个人社保总计', dataIndex: 'personalSocialSum', key: 'personalSocialSum', width: 130, align: 'center',customRender:(text,record)=>{
              return (record.forecastSocialFormId == this.model.forecastForm.id) ? text : 0
            } },
            { title: '个人住房公积金', dataIndex: 'personalFundSum', key: 'personalFundSum', width: 140, align: 'center',customRender:(text,record)=>{
              return (record.forecastFundFormId == this.model.forecastForm.id) ? text : 0
            } },
          ]
        } else {
          this.tabPaneOneShow = false
          this.activeKey = '2'
        }
        /**************************************************** 商险明细表数据 ****************************************************/
        if (this.model.businessInsuranceList) {
          this.tabPaneTwoDefineColumns.unitId.options = this.tabPaneTwoDefineColumns.settlementOrgan.options = this.settleDomainBelongs
          this.tabPaneTwoDataSource = this.model.businessInsuranceList
          this.tabPaneTwoColumns = [
            { title: '员工编码', dataIndex: 'empNo', key: 'empNo', fixed: 'left', width: 180, align: 'center', scopedSlots: { customRender: 'empNo' } },
            { title: '员工姓名', dataIndex: 'empName', key: 'empName', fixed: 'left', width: 100, align: 'center', scopedSlots: { customRender: 'empName' } },
            { title: '身份证号', dataIndex: 'empIdcardNo', key: 'empIdcardNo', width: 200, align: 'center', scopedSlots: { customRender: 'empIdcardNo' } },
            { title: '单位名称', dataIndex: 'unitId', align: 'center', scopedSlots: { customRender: 'unitId' } },
            { title: '结算主体', dataIndex: 'settlementOrgan', align: 'center', scopedSlots: { customRender: 'settlementOrgan' } },
            { title: '保险公司', dataIndex: 'insuranceCompanyName', key: 'insuranceCompanyName', width: 200, align: 'center', scopedSlots: { customRender: 'insuranceCompanyName' } },
            { title: '保单号', dataIndex: 'policyNo', key: 'policyNo', width: 200, align: 'center', scopedSlots: { customRender: 'policyNo' } },
            { title: '险种', dataIndex: 'insuranceTypeName', key: 'insuranceTypeName', width: 200, align: 'center', scopedSlots: { customRender: 'insuranceTypeName' } },
            { title: '购买类型', dataIndex: 'buyType', customRender: (text) => {
              return filterDictText(this.buyTypeBelongs, text)
            }, key: 'buyType', width: 100, align: 'center' },
            { title: '购买标准', dataIndex: 'buyStandard', key: 'buyStandard', width: 100, align: 'center' },
            { title: '实际保费', dataIndex: 'buyPay', key: 'buyPay', width: 100, align: 'center' },
            { title: '结算类型', dataIndex: 'settleType', customRender: (text) => {
              return filterDictText(this.settleTypeBelongs, text)
            }, key: 'settleType', width: 150, align: 'center' },
            { title: '身故或残疾金', dataIndex: 'deathDisabilityMoney', key: 'deathDisabilityMoney', width: 120, align: 'center' },
            { title: '保单开始时间', dataIndex: 'policyStart', key: 'policyStart', width: 120, align: 'center' },
            { title: '保单结束时间', dataIndex: 'policyEnd', key: 'policyEnd', width: 120, align: 'center' },
            { title: '保单生效时间', dataIndex: 'policyEffect', key: 'policyEffect', width: 120, align: 'center' },
            { title: '结算月份', dataIndex: 'settleMonth', key: 'settleMonth', width: 100, align: 'center' },
            { title: '状态', dataIndex: 'status', customRender: (text) => {
              return filterDictText(this.dispatchStatusBelongs, text)
            }, key: 'status', width: 150, align: 'center' },
          ]
        } else {
          this.tabPaneTwoShow = false
          this.activeKey = '3'
        }
        /**************************************************** 对比库明细表数据 ****************************************************/
        if (this.model.comparisonLibraryList) {
          this.tabPaneThreeDefineColumns.unitId.options = this.tabPaneThreeDefineColumns.departId.options = this.settleDomainBelongs
          this.tabPaneThreeDataSource = this.model.comparisonLibraryList
          this.ipagination.total = this.model.comparisonLibraryList.length
          this.ipagination.current = 1
          this.tabPaneThreeColumns = [
            { title: '员工编码', dataIndex: 'empNo', fixed: 'left',ellipsis: true, width: 120, align: 'center', scopedSlots: { customRender: 'empNo' } },
            { title: '员工姓名', dataIndex: 'empName', fixed: 'left', ellipsis: true,width: 140, align: 'center', scopedSlots: { customRender: 'empName' } },
            { title: '身份证号', dataIndex: 'empIdcard', align: 'center',ellipsis: true,width: 160,scopedSlots: { customRender: 'empIdcard' }},
            { title: '单位名称', dataIndex: 'unitId', align: 'center',width: 180, scopedSlots: { customRender: 'unitId' }},
            { title: '结算主体', dataIndex: 'departId', align: 'center', width: 180,scopedSlots: { customRender: 'departId' } },
            { title: '缴纳月份', dataIndex: 'socialSecurityMonth', key: 'socialSecurityMonth', width: 140, align: 'center' },
            { title: '社保生成月份', dataIndex: 'socialSecurityMonthCreate', key: 'socialSecurityMonthCreate', width: 140, align: 'center' },
            { title: '公积金生成月份', dataIndex: 'fundCreateMonth', key: 'fundCreateMonth', width: 150, align: 'center' },
            { title: '单位社保合计差额', dataIndex: 'socialSecurityCompanySum', key: 'socialSecurityCompanySum', width: 160, align: 'center' },
            { title: '单位住房公积金差额', dataIndex: 'providentCompanyDiff', key: 'providentCompanyDiff', width: 160, align: 'center' },
            { title: '单位合计差额', dataIndex: 'companySumDiff', key: 'companySumDiff', width: 150, align: 'center' },
            { title: '个人社保合计差额', dataIndex: 'socialSecurityPersonalSum', key: 'socialSecurityPersonalSum', width: 160, align: 'center' },
            { title: '个人住房公积金差额', dataIndex: 'providentPersonalDiff', key: 'providentPersonalDiff',width: 180, align: 'center' },
            { title: '个人合计差额', dataIndex: 'personalSumDiff', key: 'personalSumDiff', width: 140, align: 'center' },
            { title: '总合计差额', dataIndex: 'sumDiff', key: 'sumDiff',width: 150, align: 'center' },
          ]
          if(this.btnStatus.confirm && this.isEdit){
            this.tabPaneThreeColumns.push(
              { title: '操作', dataIndex: 'action', key: 'action', width: 80, align: 'center',fixed: 'right',scopedSlots: { customRender: 'action' },}
            )
          }
        } else {
          this.tabPaneThreeShow = false
          this.activeKey = '4'
        }

        /**************************************************** 结算表数据 ****************************************************/
        this.forecastFormData = this.model.forecastForm // 结算单主表数据
        this.forecastBillData = this.model.forecastBill // 结算单数据

        if (this.isVerify) {  // 编辑的时候
          this.forecastBillData.managementFeeTwo *= 1 // 管理费2开票金额
          this.forecastBillData.managementFeeTwoSum = this.forecastBillData.managementFeeTwo  // 管理费2开票金额合计
          this.forecastBillData.billFeeSum *= 1 // 开票金额合计
          this.forecastBillData.ticketFeeSum = this.forecastBillData.ticketFeeSum * 1 // 开票金额合计
          this.$nextTick(() => {
            // this.tabPaneFour.setFieldsValue(pick(this.forecastBillData, 'billFeeSum'))
          })
        }
        // 开票明细
        httpAction(`salary/tinvoice/openTInvoiceBySettleFormId?salaryId=${this.model.forecastForm.id}&settleFormType=3`,null,'get').then(res=>{
          if(Number(res.code) === 200){
            this.invoiceInfo = res.data
          }else{
            this.$message.warning(res.msg)
          }
        })
        // 匹配信息
        httpAction(`salary/treciverecord/getTReciveByBillId?matchId=${this.model.forecastForm.id}&type=6`,null,'get').then(res=>{
          if(Number(res.code) === 200){
            this.reciveList = res.data
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      handleDelete(id){
        const param = {ids:'',formId:this.model.forecastForm.id}
        if(id){
          param.ids = id
        }else{
          if(this.selectedRowKeys.length === 0){
            this.$message.warning('至少选择一项移除！')
            return false
          }
          param.ids = this.selectedRowKeys.join(',')
        }
        this.confirmLoading = this.loadingDel = true
        const qs = require('qs')
        httpAction(`/hrSocial/tforecastform/removeComparisonLibraryByIds?${qs.stringify(param)}`,null,'get').then(res=>{
          if(res.code === 200){
            this.forecastBillData = res.data
            this.$message.success('移除成功！')
            this.queryParam.current = this.ipagination.current
            this.queryParam.size = this.ipagination.pageSize
            this.queryParam.forecastFormId = this.model.forecastForm.id
            this.selectedRowKeys = []
            this.loadData(this.handleParams())
            this.updateBill()
          }else{
            this.$message.warning(res.msg)
          }
        }).finally(()=>{
          this.confirmLoading = this.loadingDel = false
        })
      },
      handleParams(){
        const qs = require('qs')
        const param = {}
        for(const key in this.queryParam){
          if(String(key) === 'socialSecurityMonth'){
            param.socialSecurityMonth = this.queryParam[key].format('YYYYMM')
          }else{
            param[key] = this.queryParam[key]
          }
        }
        return qs.stringify(param)
      },
      handleTableChange(pagination) {
        //分页、排序、筛选变化时触发
        this.ipagination = pagination
        this.queryParam.forecastFormId = this.model.forecastForm.id
        this.queryParam.current = pagination.current
        this.queryParam.size = pagination.pageSize
        this.loadData(this.handleParams())
      },
      // 更新结算表
      updateBill(){
        httpAction(`/hrSocial/tforecastform/getAllInfoById/${this.model.forecastBill.forecastFormId}`, '', 'GET').then((res) => {
          if (Number(res.code) === 200 && res.data) {
            this.forecastBillData = res.data.forecastBill
            this.forecastFormData = res.data.forecastForm
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      loadData(query){
        httpAction(`hrSocial/tcomparisonlibrary/pageOfForecastForm?${query}`,null,'get').then(res=>{
          if(res.code === 200){
            this.tabPaneThreeDataSource = res.data.records
            this.ipagination.total = res.data.total
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      searchQuery(){
        this.queryParam.forecastFormId = this.model.forecastForm.id
        this.loadData(this.handleParams())
      },
      searchReset(){
        this.queryParam = {}
        const qs = require('qs')
        const query = qs.stringify({forecastFormId:this.model.forecastForm.id})
        this.loadData(query)
      },
      
      // 编辑上次差余额
      editPrePoorBalance(){
        this.prevPoorBalanceFlag = this.prevPoorBalanceFlag ? false : true
        this.$nextTick(() => {
          this.tabPaneFour.setFieldsValue(pick({prevPoorBalance:this.forecastFormData.prevPoorBalance},'prevPoorBalance'))
        })
      },
      // 保存上次差余额
      savePoorBalance(){
        this.tabPaneFour.validateFields((err, values) => {
          if (!err) {
            this.forecastFormData.curPoorBalance = this.formatFloat(this.forecastFormData.ticketFee*1 - this.forecastBillData.billFeeSum*1 + values.prevPoorBalance*1)
            httpAction(this.url.edit, {id:this.forecastFormData.id,prevPoorBalance:values.prevPoorBalance,curPoorBalance:this.forecastFormData.curPoorBalance}, 'put').then((res) => {
              if (Number(res.code) === 200) {
                this.forecastFormData.prevPoorBalance = values.prevPoorBalance
                this.prevPoorBalanceFlag = false
                this.$message.success('保存成功')
              }else{
                this.$message.warning(res.msg)
              }
            })
          }
        })
      },
      // 编辑服务人数/人次
      editserverPeopleNum(e){
        if(e == 1){
          // console.log('服务人数')
          this.serverPeopleNumFlag = this.serverPeopleNumFlag ? false : true 
          this.$nextTick(() => {
            this.tabPaneFour.setFieldsValue(pick({serverPeopleNum:this.forecastBillData.serverPeopleNum},'serverPeopleNum'))
          })
        }else if(e == 2){
          // console.log('服务人次')
          this.serverPeopleFlag = this.serverPeopleFlag ? false : true 
          this.$nextTick(() => {
            this.tabPaneFour.setFieldsValue(pick({serverPeople:this.forecastBillData.serverPeople},'serverPeople'))
          })
        }

      },
      // 保存 服务人数/人次的修改
      saveserverPeopleNum(e){
        this.tabPaneFour.validateFields((err, values) => {
          if (!err) {
            if(e == 1){
              const qs = require('qs')
              const param = {
                formId:this.forecastFormData.id,
                peopleNum:values.serverPeopleNum,
                peopleCount:this.forecastBillData.serverPeople,
                managerFee:this.forecastBillData.managementFee,
                managerFeeTax:this.forecastBillData.managementFeeTax
              }
              httpAction(`/hrSocial/tforecastform/updatePeopleCount?${qs.stringify(param)}`,null,'get').then((res) => {
                if (Number(res.code) === 200) {
                  this.forecastBillData.serverPeopleNum = values.serverPeopleNum
                  this.serverPeopleNumFlag = false
                  this.$message.success('保存成功')
                }else{
                  this.$message.warning(res.msg)
                }
              })
            }else if(e == 2){
              const qs = require('qs')
              const param = {
                formId:this.forecastFormData.id,
                peopleNum:this.forecastBillData.serverPeopleNum,
                peopleCount:values.serverPeople,
                managerFee:this.forecastBillData.managementFee ,
                managerFeeTax:this.forecastBillData.managementFeeTax
              }
              httpAction(`/hrSocial/tforecastform/updatePeopleCount?${qs.stringify(param)}`,null, 'get').then((res) => {
                if (Number(res.code) === 200) {
                  this.forecastBillData.serverPeople = values.serverPeople
                  this.serverPeopleFlag = false
                  this.$message.success('保存成功')
                }else{
                  this.$message.warning(res.msg)
                }
              })
            }
          }
        })
      },

      // 编辑管理费2、管理税
      editManagementFee(e){
        if(e == 1){
          // console.log('管理费')
          this.managementFeeFlag = this.managementFeeFlag ? false : true
          if(this.managementFeeFlag){
            this.$nextTick(() => {
              this.tabPaneFour.setFieldsValue(pick({managementFee:this.forecastBillData.managementFee},'managementFee'))
            })
          }
        }else if(e == 2){
          // console.log('管理税')
          this.managementFeeTaxFlag = this.managementFeeTaxFlag ? false : true
          if(this.managementFeeTaxFlag){
            this.$nextTick(() => {
              this.tabPaneFour.setFieldsValue(pick({managementFeeTax:this.forecastBillData.managementFeeTax},'managementFeeTax'))
            })
          }
        }
       },
      // 保存管理费2、管理税
      saveManagementFee(e){
        this.tabPaneFour.validateFields((err, values) => {
          if (!err) {
            if(e == 1){
              let forecastBillDataTemp = {}
              forecastBillDataTemp.managementFeeSum = this.formatFloat(values.managementFee * 1)
              const billFeeSum = this.forecastBillData.billFeeSum * 1 + forecastBillDataTemp.managementFeeSum - this.forecastBillData.managementFee*1
              forecastBillDataTemp.billFeeSum = this.formatFloat(billFeeSum) // 解决精度问题
              this.forecastFormData.curPoorBalance = this.formatFloat(this.forecastFormData.ticketFee*1 - billFeeSum*1 + this.forecastFormData.prevPoorBalance*1)
              
              const qs = require('qs')
              const param = {
                formId:this.forecastFormData.id,
                peopleNum:this.forecastBillData.serverPeopleNum ,
                peopleCount:this.forecastBillData.serverPeople ,
                managerFee:values.managementFee ,
                managerFeeTax:this.forecastBillData.managementFeeTax 
              }

              httpAction(`/hrSocial/tforecastform/updatePeopleCount?${qs.stringify(param)}`,null, 'get').then((res) => {
                  if (Number(res.code) === 200) {
                    this.forecastBillData.managementFee = values.managementFee
                    this.forecastBillData.billFeeSum = forecastBillDataTemp.billFeeSum
                    this.forecastFormData.billFee = forecastBillDataTemp.billFeeSum
                    // this.forecastFormData.ticketFee = forecastBillDataTemp.billFeeSum
                    this.managementFeeFlag = false
                    this.$message.success('保存成功')
                  }else{
                    this.$message.warning(res.msg)
                  }
                })
            }else if(e == 2){
              let forecastBillDataTemp = {}
              forecastBillDataTemp.managementFeeTaxSum = this.formatFloat(values.managementFeeTax * 1)
              const billFeeSum = this.forecastBillData.billFeeSum * 1 + forecastBillDataTemp.managementFeeTaxSum - this.forecastBillData.managementFeeTax*1
              forecastBillDataTemp.billFeeSum = this.formatFloat(billFeeSum) // 解决精度问题
              this.forecastFormData.curPoorBalance = this.formatFloat(this.forecastFormData.ticketFee*1 - billFeeSum*1 + this.forecastFormData.prevPoorBalance*1)
              
              const qs = require('qs')
              const param = {
                formId:this.forecastFormData.id,
                peopleNum:this.forecastBillData.serverPeopleNum ,
                peopleCount:this.forecastBillData.serverPeople ,
                managerFee:this.forecastBillData.managementFee,
                managerFeeTax:values.managementFeeTax || 0
              }
              httpAction(`/hrSocial/tforecastform/updatePeopleCount?${qs.stringify(param)}`,null, 'get').then((res) => {
                if (Number(res.code) === 200) {
                  this.forecastBillData.managementFeeTax = values.managementFeeTax
                  this.forecastBillData.billFeeSum = forecastBillDataTemp.billFeeSum
                  this.forecastFormData.billFee = forecastBillDataTemp.billFeeSum
                  // this.forecastFormData.ticketFee = forecastBillDataTemp.billFeeSum
                  this.managementFeeTaxFlag = false
                  this.$message.success('保存成功')
                }else{
                  this.$message.warning(res.msg)
                }
              })
            }
          }
        })
      },

      // 编辑管理费
      editManagementFeeTwo(){
        this.managementFeeTwoFlag = this.managementFeeTwoFlag ? false : true
        if(this.managementFeeTwoFlag){
          this.$nextTick(() => {
            this.tabPaneFour.setFieldsValue(pick({managementFeeTwo:this.forecastBillData.managementFeeTwo},'managementFeeTwo'))
          })
        }
      },
      // 保存管理费
      saveManagementFeeTwo(){
        this.tabPaneFour.validateFields((err, values) => {
          if (!err) {
            let forecastBillDataTemp = {}
            forecastBillDataTemp.managementFeeTwoSum = this.formatFloat(values.managementFeeTwo * 1)
            const billFeeSum = this.forecastBillData.billFeeSum * 1 + forecastBillDataTemp.managementFeeTwoSum - this.forecastBillData.managementFeeTwo*1
            forecastBillDataTemp.billFeeSum = this.formatFloat(billFeeSum) // 解决精度问题
            this.forecastFormData.curPoorBalance = this.formatFloat(this.forecastFormData.ticketFee*1 - billFeeSum*1 + this.forecastFormData.prevPoorBalance*1)
            const httpurl = `${this.url.managementFeeEdit}?id=${this.forecastBillData.id}&managerTwo=${forecastBillDataTemp.managementFeeTwoSum}`
            httpAction(httpurl, null, 'put').then((res) => {
              if (Number(res.code) === 200) {
                this.forecastBillData.managementFeeTwo = values.managementFeeTwo
                this.forecastBillData.billFeeSum = forecastBillDataTemp.billFeeSum
                this.forecastFormData.billFee = forecastBillDataTemp.billFeeSum
                // this.forecastFormData.ticketFee = forecastBillDataTemp.billFeeSum
                this.managementFeeTwoFlag = false
                this.$message.success('保存成功')
              }else{
                this.$message.warning(res.msg)
              }
            })
          }
        })
      },
      // 刷新
      handleRefrash(){
        const _this = this
        const refreshTime = _this.forecastFormData.refreshTime === null?'无':_this.forecastFormData.refreshTime
        this.$confirm({
          title: '是否确定刷新?',
          content:`上次刷新时间：${refreshTime}`,
          onOk() {
            _this.downLoading = true
            httpAction(`${_this.url.refrash}?billId=${_this.model.forecastBill.id}`,null,'post').then(res=>{
              if(Number(res.code) === 200){
                // 刷新成功，当前刷新时间为上次刷新时间
                const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                _this.forecastFormData.refreshTime = currentTime

                if(res.data){
                  _this.model={}
                  // 刷新数据
                  _this.edit(res.data,_this.auditProcessUrl,_this.status)
                }
                _this.downDisabled = false
                _this.$message.success('刷新成功')
              }else{
                _this.$message.warning(res.msg)
              }
            }).finally(()=>{
              _this.downLoading = false
            })
          },
        })
      },
      // 客户已确定
      handleConfirm(){
        const _this = this
        this.$confirm({
          title: '客户确认后，表单不可退回，删除！请实际确认无误后再点击！',
          onOk() {
            _this.downLoading = true
            httpAction(`${_this.url.confirm}?formId=${_this.model.forecastForm.id}`,null,'post').then(res=>{
              if(Number(res.code) === 200){
                _this.$message.success(res.msg)
                _this.$emit('ok')
                _this.handleCancel()
              }else{
                _this.$message.warning(res.msg)
              }
            }).finally(()=>{
              _this.downLoading = false
            })
          },
        })
      },
      // 确定按钮
      handleOk() {
        // 编辑状态1
        this.okStatusOfSubmit = 1
        // 触发表单验证（tabPaneFour）
        this.tabPaneFour.validateFields((err) => {
          if (!err) {
            if (this.auditStatus) { // 审核
              this.$refs.forecastBillAuditModal.title = '确认审核'
              this.$refs.forecastBillAuditModal.id = this.forecastFormData.id
              this.$refs.forecastBillAuditModal.nextUserIdBelongs = this.nextUserIdBelongs
              this.$refs.forecastBillAuditModal.add()
            } else {
              this.$refs.forecastBillVerificationModal.title = '确认提交'
              this.$refs.forecastBillVerificationModal.id = this.forecastFormData.id
              this.$refs.forecastBillVerificationModal.nextUserIdBelongs = this.nextUserIdBelongs
              this.$refs.forecastBillVerificationModal.edit()
            }
          }
        })
        // 编辑状态0
        this.okStatusOfSubmit = 0
      },
      // tab切换
      tabsChange(e) {
        this.activeKey = e
      },
      // 关闭按钮
      handleCancel() {
        this.close()
      },
      // 关闭功能数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.isVerify = false // 是否显示确定按钮
        this.activeKey = '1'  //默认第一个tab
        this.auditList = []  // 审核流程数据
        this.auditStatus = false // 是否是审核
        this.okStatusOfSubmit = 0 // 记录第几次点击提交按钮
        this.tabPaneOneShow = true // 第一个tab是否显示
        this.tabPaneTwoShow = true // 第二个tab是否显示
        this.tabPaneThreeShow = true // 第三个tab是否显示
        this.tabPaneFourShow = true // 第四个tab是否显示
        this.disableSubmit = false
        this.buyTypeBelongs = [] // 购买类型
        this.settleTypeBelongs = []  // 结算类型
        this.dispatchStatusBelongs = []  // 商险状态
        this.tabPaneOneColumns = []  // 第一个tab行
        this.tabPaneOneDataSource = [] // 第一个tab数据
        this.tabPaneTwoColumns = []  // 第二个tab行
        this.tabPaneTwoDataSource = [] // 第二个tab数据
        this.tabPaneThreeColumns = []  // 第三个tab行
        this.tabPaneThreeDataSource = [] // 第三个tab数据
        this.forecastBillData = {} // 结算单数据
        this.forecastFormData = {} // 结算单主表数据
        this.nextUserIdBelongs = []  // 下一步审核人
        this.settleDomainBelongs = []  // 结算主体和所属单位
        this.organizationBelongs = []  // 社保户、公积金户
        this.invoiceSource = [] // 编辑的时候列表数据
        this.downLoading = this.prevPoorBalanceFlag = false
        this.invoiceInfo = this.reciveList = this.selectedRowKeys = []
        this.btnStatus = {
          refrash:false,
          upload:false,
          confirm:false,
          audit:false,
          submit:false,
        }
        this.auditProcessUrl = this.status = ''
        this.ipagination.current = 1
        this.downDisabled = false
      },
      // 表单回调
      forecastBillAuditModalFormOk() {
        this.close()
        this.$emit('ok')
      },
      // 表单回调
      forecastBillVerificationModalFormOk() {
        this.close()
        this.$emit('ok')
      },
      // 开票入口点击
      handleInvoiceInfo(){
        // 购买方信息
        const buyerSetting = {
          settleDomainId: this.forecastFormData.departId,
          settleDomainName: this.forecastFormData.departName,
          settleDomainNo: this.forecastFormData.departNo,
          unitId: this.forecastFormData.unitId,
          unitName: this.forecastFormData.unitName,
          unitNo: this.forecastFormData.unitNo,
        }
        // 结算单
        const settleList = [
          {
            settleFormId: this.forecastFormData.id,
            settleFormType: '3', // 0普通工资、0非扣税类、1工程工资,3预估结算单
            settleMoney: this.forecastFormData.billFee || 0,
            settleMonth: this.forecastBillData.billDate
          }
        ]
        this.$refs.otherInvoiceApplyEntranceModal.title = '申请预估开票 - 新建'
        this.$refs.otherInvoiceApplyEntranceModal.pageType = 3
        this.$refs.otherInvoiceApplyEntranceModal.buyerSetting = buyerSetting
        this.$refs.otherInvoiceApplyEntranceModal.selectionRows = settleList
        this.$refs.otherInvoiceApplyEntranceModal.show()
      },
      // 开票申请回调
      otherInvoiceApplyEntranceModalOk(data){
        // 开票金额合计
        const total = parseFloat(this.forecastFormData.ticketFee) + parseFloat(data.ticketMoney)
        this.forecastFormData.ticketFee = total.toFixed(2)
        // 本次差余额 本次差余额= 新开票金额合计 - 结算金额 + 上次差余额
        const restTotal =
          parseFloat(total) - parseFloat(this.forecastFormData.billFee) + parseFloat(this.forecastFormData.prevPoorBalance)
        this.forecastFormData.curPoorBalance = restTotal.toFixed(2)
      },
      /******************************************* 验证规则 *******************************************/
      // 管理费2
      validateManagementFeeTwo(rule, value, callback) {
        if (Number(this.okStatusOfSubmit) === 0) {
          /**** 数据验证 ****/
          let forecastBillDataTemp = {}
          if (!value) {
            forecastBillDataTemp.managementFeeTwo = value = 0
            this.$nextTick(() => {
              this.tabPaneFour.setFieldsValue(pick(forecastBillDataTemp, 'managementFeeTwo'))
            })
          }
          if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 验证数字（1到2位小数）
            callback('')
            return false
          }
          forecastBillDataTemp.managementFeeTwoSum = this.formatFloat(value * 1)
          forecastBillDataTemp.billFeeSum = this.formatFloat(this.forecastBillData.billFeeSum * 1 + forecastBillDataTemp.managementFeeTwoSum - this.forecastBillData.managementFeeTwo) // 解决精度问题
          this.$nextTick(() => {
            this.tabPaneFour.setFieldsValue(pick(forecastBillDataTemp, 'managementFeeTwoSum', 'billFeeSum', 'ticketFeeSum'))
          })
          let httpurl = this.url.managementFeeEdit
          httpurl += `?id=${this.forecastBillData.id}&managerTwo=${forecastBillDataTemp.managementFeeTwoSum}`
          // 管理费2
          httpAction(httpurl, '', 'PUT').then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }
        callback()
      },

      // 开票金额合计
      validateTicketFeeSum(rule, value, callback) {
        if (this.okStatusOfSubmit == 0) {
          /**** 数据验证 ****/
          if (!value && value !== 0) {
            callback('')
            return false
          }

          if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 验证数字（1到2位小数）
            callback('')
            return false
          }

          let httpurl = this.url.ticketFeeSumEdit
          let method = 'PUT'
          let formData = {}
          formData.id = this.forecastBillData.id
          formData.ticketFeeSum = value * 1
          httpAction(httpurl, formData, method).then((res) => {
            if (Number(res.code) !== 200) {
              this.$message.warning(res.message || res.msg)
            }
          })
        }
        callback()
      },
      // 精度处理
      formatFloat(f, digit = 2) {
        const m = Math.pow(10, digit)
        return Math.round(f * m) / m
      },
      getSum(a,b){
        return parseFloat(Number(a)+Number(b)).toFixed(2)
      },
      getAllTotal(formId,a,b){
        return (formId == this.model.forecastForm.id) ? parseFloat(Number(a)+Number(b)).toFixed(2) : 0
      },
      getDefaultValue(conditVal,value){
        return (conditVal == this.model.forecastForm.id) ? value : 0
      },
      getTotal(socialAll,fundAll,forecastSocialFormId,forecastFundFormId){
        let all = 0
        if(this.model.forecastForm.id === forecastSocialFormId){
          all += Number(socialAll || 0)
        }
        if(this.model.forecastForm.id === forecastFundFormId){
          all += Number(fundAll || 0)
        }
        return parseFloat(all).toFixed(2)
      },
      areaName(province,city,town,flag){
        let name = [];
        if(province && province != 'null'){
          name.push(this.addressMap[province].areaName)
        }
        if(city && city != 'null'){
          name.push(this.addressMap[city].areaName)
        }
        if(town && town != 'null'){
          name.push(this.addressMap[town].areaName)
        }
        return name.join(flag)
      },
      getClassify(){
        let result = [];
        if(this.model.forecastLibraryList){
          result = this.model.forecastLibraryList.reduce((pre, cur, index) => {
            let obj = {}
            if (index == 0) {
              // 社保省市县全为空时取公积金省市县
              if(!cur.socialTown && !cur.socialCity && !cur.socialProvince){
                obj.class = `${cur.fundTown}${cur.fundCity}${cur.fundProvince}`
              }else{
                obj.class = `${cur.socialTown}${cur.socialCity}${cur.socialProvince}`
              }
              obj.name = this.areaName(cur.socialProvince,cur.socialCity,cur.socialTown,'-');
              obj.fundname = this.areaName(cur.fundProvince,cur.fundCity,cur.fundTown,'-');
              obj.detail = [cur];
              pre.push(obj);
            } else {
              const i = pre.findIndex(item => {
                return (item.class == `${cur.socialTown}${cur.socialCity}${cur.socialProvince}` || item.class == `${cur.fundTown}${cur.fundCity}${cur.fundProvince}`)
              })
              if (i > -1) {
                pre[i].detail.push(cur)
              } else {
                if(!cur.socialTown && !cur.socialCity && !cur.socialProvince){
                  obj.class = `${cur.fundTown}${cur.fundCity}${cur.fundProvince}`
                }else{
                  obj.class = `${cur.socialTown}${cur.socialCity}${cur.socialProvince}`
                }
                obj.detail = [cur];
                obj.name = this.areaName(cur.socialProvince,cur.socialCity,cur.socialTown,'-');
                obj.fundname = this.areaName(cur.fundProvince,cur.fundCity,cur.fundTown,'-');
                pre.push(obj);
              }
            }
            return pre
          }, [])
        }
        return result;
      },
      handleBeforeExport(){
        const element = { 
          tHeader: ['序号','姓名','身份证','客户名称','起缴时间','服务月份',
            '养老保险','','','','','','',
            '医疗保险','','','','','','',
            '失业保险','','','','','','',
            '工伤保险','','','','',
            '生育保险','','','','',
            '大病保险','','','','','','',
            '滞纳金（单位）','滞纳金（个人）',
            '住房公积金','','','','','','',
            '服务费','单位社保','个人社保','社保合计','公积金合计','总计','备注'
          ],
          sHeader: ['','','','','','',
            '城市','基数','总额','单位比例','单位金额','个人比例','个人金额',
            '城市','基数','总额','单位比例','单位金额','个人比例','个人金额',
            '城市','基数','总额','单位比例','单位金额','个人比例','个人金额',
            '城市','基数','总额','单位比例','单位金额',
            '城市','基数','总额','单位比例','单位金额',
            '城市','基数','总额','单位比例','单位金额','个人比例','个人金额',
            '','',
            '城市','基数','总额','单位比例','单位金额','个人比例','个人金额',
            '','','','','','',''
          ],
          filterVal: ['index','empName','empIdcard', 'unitName','socialPayMonth','socialCreateMonth',
            'ylcity','unitPensionBase','yltotal','unitPersionPro','unitPensionFee','personalPersionPro','personalPensionFee',
            'yllcity','unitMedicalBase','ylltotal','unitMedicalPro','unitMedicalFee','personalMedicalPro','personalMedicalFee',
            'syycity','unitUnemploymentBase','sytotal','unitUnemploymentPro','unitUnemploymentFee','personalUnemploymentPro','personalUnemploymentFee',
            'gscity','unitInjuryBase','unitWorkInjuryFee','unitInjuryPro','unitWorkInjuryFee',
            'sycity','unitBirthBase','unitBirthFee','unitBirthPro','unitBirthFee',
            'dbcity','unitBigailmentBase','dbtotal','unitBigailmentPro','unitBitmailmentFee','personalBigailmentPro','personalBigmailmentFee',
            'znjdw','znjgr',
            'fundname','unitFundBase','gjjtotal','unitFundProp','unitFundSum','personalFundProp','personalFundSum',
            'fuw','unitSocialSum','personalSocialSum','sbhjtotal','gjjhjtotal','total','remark'
          ],
          tableDatas: [],
          sheetName: ''
        }
        let excelDatas = [];
        const _this = this;
        this.ycexportLoading = true;
        httpAction(`/hrSocial/tforecastform/getAllInfoForYiCaiById/${this.model.forecastForm.id}`,null,'get').then(res=>{
          if(res.code === 200){
            let index = 0;
            for(const key in res.data){
              // const arr = key.split('_').filter(item=>item != 'null');
              const arr = key.split('_');
              const resArr = res.data[key].map((ele,i)=>{
                const nametemp = (!ele.socialTown && !ele.socialCity && !ele.socialProvince) ? '' : _this.areaName(ele.socialProvince,ele.socialCity,ele.socialTown,'-');
                ele.index = i+1;
                ele.ylcity = nametemp;
                ele.yltotal = _this.formatFloat(ele.unitPensionFee + ele.personalPensionFee);
                ele.ylltotal = _this.formatFloat(ele.unitMedicalFee + ele.personalMedicalFee);
                ele.syycity = nametemp;
                ele.sytotal = _this.formatFloat(ele.unitUnemploymentFee + ele.personalUnemploymentFee);
                ele.gscity = nametemp;
                ele.sycity = nametemp;
                ele.dbcity = nametemp;
                ele.yllcity = nametemp;
                ele.dbtotal = _this.formatFloat(ele.unitBitmailmentFee + ele.personalBigmailmentFee);
                ele.znjdw = '';
                ele.znjgr = '';
                ele.fundname = (!ele.fundTown && !ele.fundCity && !ele.fundProvince) ? '' : _this.areaName(ele.fundProvince,ele.fundCity,ele.fundTown,'-');
                ele.unitName = _this.model.forecastForm.unitName;
                ele.gjjtotal = _this.formatFloat(ele.unitFundSum + ele.personalFundSum);
                ele.fuw = _this.formatFloat((_this.forecastBillData.managementFee * 1 + _this.forecastBillData.managementFeeTax * 1 + _this.forecastBillData.managementFeeTwo * 1)/_this.forecastBillData.serverPeople);
                ele.sbhjtotal = _this.formatFloat(ele.unitSocialSum + ele.personalSocialSum);
                ele.gjjhjtotal = _this.formatFloat(ele.personalFundSum + ele.unitFundSum);
                ele.total = _this.formatFloat(ele.unitSocialSum + ele.personalSocialSum + ele.personalFundSum + ele.unitFundSum + ele.fuw);
                return ele;
              })
              excelDatas[index] = {...element,...{tableDatas:resArr,sheetName:_this.areaName(arr[0],arr[1],arr[2],'-')}};
              index++;
            }
            const obj = this.commonExport();
            obj.listLength.first = excelDatas.length;
            excelDatas.push({
              tHeader: ["结算主体编码", "结算类型","结算主体名称","姓名","身份证号码","险种","起保时间","截止时间","保单号","购买标准","实际保费","预估保费","差额","医疗","身故或残疾","备注"],
              sHeader: [],
              filterVal: ['settlementOrganNo','settleType',"settlementOrganName", "empName","empIdcardNo", "insuranceTypeName","policyStart","policyEnd","policyNo","buyStandard","buyPay","forecastBuyPay","balance","medicalMoney","deathDisabilityMoney","remark"],
              tableDatas: obj.insuranceData,
              sheetName: "商险派单明细"
            });
            excelDatas.push({
              tHeader: ["员工编码", "员工姓名","身份证号","单位名称","结算主体","缴纳月份","社保生成月份","公积金生成月份","单位社保合计差额","单位住房公积金差额","单位合计差额","个人社保合计差额","个人住房公积金差额","个人合计差额","总合计差额"],
              sHeader: [],
              filterVal: ['empNo','empName','empIdcard',"unitIdName", "departIdName","socialSecurityMonth", "socialSecurityMonthCreate","fundCreateMonth","socialSecurityCompanySum","providentCompanyDiff","companySumDiff","socialSecurityPersonalSum","providentPersonalDiff","personalSumDiff","sumDiff"],
              tableDatas: obj.comparisonLibraryList,
              sheetName: "对比库明细"
            });
            excelDatas.push({
              tHeader: ["序号","名称","费用项目", "金额", "增值税", "开票额小计"],
              sHeader: [],
              filterVal: ['index','data',"project", "money", "tax", "account"],
              tableDatas: obj.settelData,
              sheetName: "结算单"
            })
            
            //这个是引用插件
            import("@/vendor/ExportYc").then(excel => {
              var tHeader = []
              var dataArr = []
              var sheetnames = []
              var sHeader = []
              for (var i in excelDatas) {
                tHeader.push(excelDatas[i].tHeader)
                sHeader.push(excelDatas[i].sHeader)
                dataArr.push(_this.formatJson(excelDatas[i].filterVal, excelDatas[i].tableDatas))
                sheetnames.push(excelDatas[i].sheetName)
              }
              excel.export_json_to_excel_more_sheet({
                header: tHeader,
                sheader: sHeader,
                data: dataArr,
                sheetname: sheetnames,
                filename: '易才预估账单',
                autoWidth: true,
                bookType: 'xlsx',
                length:obj.listLength,
              })
            }).finally(()=>{
              setTimeout(()=>{
                _this.ycexportLoading = false
              },1000)
            
            })
          }
        })

        // this.ycexportLoading = true;
        // const _this =this;
        // setTimeout(function(){
        //   _this.handleExport()
        // },1000)
      },
      handleExport(){
        const _this = this;
        const result = _this.getClassify();
        console.log(result);
        // return false
        let excelDatas = [];
        const element = { 
          tHeader: ['序号','姓名','身份证','客户名称','起缴时间','服务月份',
            '养老保险','','','','','','',
            '医疗保险','','','','','','',
            '失业保险','','','','','','',
            '工伤保险','','','','',
            '生育保险','','','','',
            '大病保险','','','','','','',
            '滞纳金（单位）','滞纳金（个人）',
            '住房公积金','','','','','','',
            '服务费','单位社保','个人社保','社保合计','公积金合计','总计','备注'
          ],
          sHeader: ['','','','','','',
            '城市','基数','总额','单位比例','单位金额','个人比例','个人金额',
            '城市','基数','总额','单位比例','单位金额','个人比例','个人金额',
            '城市','基数','总额','单位比例','单位金额','个人比例','个人金额',
            '城市','基数','总额','单位比例','单位金额',
            '城市','基数','总额','单位比例','单位金额',
            '城市','基数','总额','单位比例','单位金额','个人比例','个人金额',
            '','',
            '城市','基数','总额','单位比例','单位金额','个人比例','个人金额',
            '','','','','','',''
          ],
          filterVal: ['index','empName','empIdcard', 'unitName','socialPayMonth','socialCreateMonth',
            'ylcity','unitPensionBase','yltotal','unitPersionPro','unitPensionFee','personalPersionPro','personalPensionFee',
            'yllcity','unitMedicalBase','ylltotal','unitMedicalPro','unitMedicalFee','personalMedicalPro','personalMedicalFee',
            'syycity','unitUnemploymentBase','sytotal','unitUnemploymentPro','unitUnemploymentFee','personalUnemploymentPro','personalUnemploymentFee',
            'gscity','unitInjuryBase','unitWorkInjuryFee','unitInjuryPro','unitWorkInjuryFee',
            'sycity','unitBirthBase','unitBirthFee','unitBirthPro','unitBirthFee',
            'dbcity','unitBigailmentBase','dbtotal','unitBigailmentPro','unitBitmailmentFee','personalBigailmentPro','personalBigmailmentFee',
            'znjdw','znjgr',
            'fundname','unitFundBase','gjjtotal','unitFundProp','unitFundSum','personalFundProp','personalFundSum',
            'fuw','unitSocialSum','personalSocialSum','sbhjtotal','gjjhjtotal','total','remark'
          ],
          tableDatas: [],
          sheetName: ''
        }
        result.forEach((item,index)=>{
          const arrList = item.detail.map((ele,i)=>{
            const nametemp = (!ele.socialTown && !ele.socialCity && !ele.socialProvince) ? '' : this.areaName(ele.socialProvince,ele.socialCity,ele.socialTown,'-');
            ele.index = i+1;
            ele.ylcity = nametemp;
            ele.yltotal = _this.formatFloat(ele.unitPensionFee + ele.personalPensionFee);
            ele.ylltotal = _this.formatFloat(ele.unitMedicalFee + ele.personalMedicalFee);
            ele.syycity = nametemp;
            ele.sytotal = _this.formatFloat(ele.unitUnemploymentFee + ele.personalUnemploymentFee);
            ele.gscity = nametemp;
            ele.sycity = nametemp;
            ele.dbcity = nametemp;
            ele.yllcity = nametemp;
            ele.dbtotal = _this.formatFloat(ele.unitBitmailmentFee + ele.personalBigmailmentFee);
            ele.znjdw = '';
            ele.znjgr = '';
            ele.fundname = (!ele.fundTown && !ele.fundCity && !ele.fundProvince) ? '' : this.areaName(ele.fundProvince,ele.fundCity,ele.fundTown,'-');
            ele.unitName = _this.model.forecastForm.unitName;
            ele.gjjtotal = _this.formatFloat(ele.unitFundSum + ele.personalFundSum);
            ele.fuw = _this.formatFloat((_this.forecastBillData.managementFee * 1 + _this.forecastBillData.managementFeeTax * 1 + _this.forecastBillData.managementFeeTwo * 1)/_this.forecastBillData.serverPeople);
            ele.sbhjtotal = _this.formatFloat(ele.unitSocialSum + ele.personalSocialSum);
            ele.gjjhjtotal = _this.formatFloat(ele.personalFundSum + ele.unitFundSum);
            ele.total = _this.formatFloat(ele.unitSocialSum + ele.personalSocialSum + ele.personalFundSum + ele.unitFundSum + ele.fuw);
            return ele;
          })
          excelDatas[index] = {...element,...{tableDatas:arrList,sheetName:item.name||item.fundname}}
        })
        const obj = this.commonExport();
        obj.listLength.first = excelDatas.length;
        excelDatas.push({
          tHeader: ["结算主体编码", "结算类型","结算主体名称","姓名","身份证号码","险种","起保时间","截止时间","保单号","购买标准","实际保费","预估保费","差额","医疗","身故或残疾","备注"],
          sHeader: [],
          filterVal: ['settlementOrganNo','settleType',"settlementOrganName", "empName","empIdcardNo", "insuranceTypeName","policyStart","policyEnd","policyNo","buyStandard","buyPay","forecastBuyPay","balance","medicalMoney","deathDisabilityMoney","remark"],
          tableDatas: obj.insuranceData,
          sheetName: "商险派单明细"
        });
        excelDatas.push({
          tHeader: ["员工编码", "员工姓名","身份证号","单位名称","结算主体","缴纳月份","社保生成月份","公积金生成月份","单位社保合计差额","单位住房公积金差额","单位合计差额","个人社保合计差额","个人住房公积金差额","个人合计差额","总合计差额"],
          sHeader: [],
          filterVal: ['empNo','empName','empIdcard',"unitIdName", "departIdName","socialSecurityMonth", "socialSecurityMonthCreate","fundCreateMonth","socialSecurityCompanySum","providentCompanyDiff","companySumDiff","socialSecurityPersonalSum","providentPersonalDiff","personalSumDiff","sumDiff"],
          tableDatas: obj.comparisonLibraryList,
          sheetName: "对比库明细"
        });
        excelDatas.push({
          tHeader: ["序号","名称","费用项目", "金额", "增值税", "开票额小计"],
          sHeader: [],
          filterVal: ['index','data',"project", "money", "tax", "account"],
          tableDatas: obj.settelData,
          sheetName: "结算单"
        })
        
        //这个是引用插件
        import("@/vendor/ExportYc").then(excel => {
          var tHeader = []
          var dataArr = []
          var sheetnames = []
          var sHeader = []
          for (var i in excelDatas) {
            tHeader.push(excelDatas[i].tHeader)
            sHeader.push(excelDatas[i].sHeader)
            dataArr.push(_this.formatJson(excelDatas[i].filterVal, excelDatas[i].tableDatas))
            sheetnames.push(excelDatas[i].sheetName)
          }
          excel.export_json_to_excel_more_sheet({
            header: tHeader,
            sheader: sHeader,
            data: dataArr,
            sheetname: sheetnames,
            filename: '易才预估账单',
            autoWidth: true,
            bookType: 'xlsx',
            length:obj.listLength,
          })
        }).finally(()=>{
          setTimeout(()=>{
            _this.ycexportLoading = false
          },1000)
         
        })

      },
      commonExport(){
        // 结算单数据
        let forecastBillData = this.forecastBillData
        let settelData = [
          {'index':this.forecastFormData.unitName + '结算单','data':'','project':'','money':'','tax':'','account':''},
          {'index':'单位名称:','data':this.forecastFormData.unitName,'project':'','money':'','tax':'皖信盖章','account':''},
          {'index':'结算主体:','data':this.forecastFormData.departName,'project':'','money':'','tax':':','account':''},
          {'index':'结算时间:','data':forecastBillData.billDate,'project':'','money':'','tax':'','account':''},
          {'index':'序号','data':'费用项目','project':'','money':'金额','tax':'税费','account':'开票额小计'},
          {'index':1,'data':forecastBillData.payMonths,'project':'应缴单位社保','money':forecastBillData.unitSocial * 1,'tax':forecastBillData.unitSocialTax * 1,'account':this.formatFloat(forecastBillData.unitSocial * 1 + forecastBillData.unitSocialTax * 1)},
          {'index':2,'data':'','project':'代扣个人社保','money':forecastBillData.personalSocial * 1,'tax':forecastBillData.personalSocialTax * 1,'account':this.formatFloat(forecastBillData.personalSocial * 1 + forecastBillData.personalSocialTax * 1)},
          {'index':3,'data':'','project':'应缴单位公积金','money':forecastBillData.unitProvident * 1,'tax':forecastBillData.unitProvidentTax * 1,'account':this.formatFloat(forecastBillData.unitProvident * 1 + forecastBillData.unitProvidentTax * 1)},
          {'index':4,'data':'','project':'代扣个人公积金','money':forecastBillData.personalProvident * 1 ,'tax':forecastBillData.personalProvidentTax * 1,'account':this.formatFloat(forecastBillData.personalProvident * 1 + forecastBillData.personalProvidentTax * 1)},
          {'index':5,'data':'','project':'社保缴纳总合计','money':'-' ,'tax':'-','account':this.formatFloat(forecastBillData.socialSum * 1)},
          {'index':6,'data':'','project':'公积金缴纳总合计','money':'-' ,'tax':'-','account':this.formatFloat(forecastBillData.fundSum * 1)},
          {'index':7,'data':'','project':'总合计','money':'-' ,'tax':'-','account':this.formatFloat(forecastBillData.sum * 1)},
          {'index':8,'data':'单位社保差额','project':'','money':forecastBillData.unitSocialDiff * 1,'tax':forecastBillData.unitSocialDiffTax * 1,'account':this.formatFloat(forecastBillData.unitSocialDiff * 1 + forecastBillData.unitSocialDiffTax * 1)},
          {'index':9,'data':'个人社保差额','project':'','money':forecastBillData.personalSocialDiff * 1,'tax':forecastBillData.personalSocialDiffTax * 1,'account':this.formatFloat(forecastBillData.personalSocialDiff * 1 + forecastBillData.personalSocialDiffTax * 1)},
          {'index':10,'data':'单位公积金差额','project':'','money':forecastBillData.unitPrividentDiff * 1,'tax':forecastBillData.unitPrividentDiffTax * 1,'account':this.formatFloat(forecastBillData.unitPrividentDiff * 1 + forecastBillData.unitPrividentDiffTax * 1)},
          {'index':11,'data':'个人公积金差额','project':'','money':forecastBillData.personalProvidentDiff * 1,'tax':forecastBillData.personalProvidentDiffTax * 1,'account':this.formatFloat(forecastBillData.personalProvidentDiff * 1 + forecastBillData.personalProvidentDiffTax * 1)},
          {'index':12,'data':'管理费差额','project':'','money':forecastBillData.managementFeeDiff * 1,'tax':forecastBillData.managementFeeDiffTax * 1,'account':this.formatFloat(forecastBillData.managementFeeDiff * 1 + forecastBillData.managementFeeDiffTax * 1)},
          {'index':13,'data':'服务人数','project':'','money':forecastBillData.serverPeopleNum * 1,'tax':'','account':''},
          {'index':14,'data':'服务人次','project':'','money':forecastBillData.serverPeople * 1,'tax':'','account':''},
          {'index':15,'data':'社保卡费','project':'','money':forecastBillData.socialCardFee * 1,'tax':'','account':''},
          {'index':16,'data':'商险','project':'','money':forecastBillData.businessInsurance * 1,'tax':forecastBillData.businessInsuranceTax * 1,'account':this.formatFloat(forecastBillData.businessInsurance * 1 + forecastBillData.businessInsuranceTax * 1)},
          {'index':17,'data':'商险差额','project':'','money':forecastBillData.takingBalance * 1,'tax':forecastBillData.takingBalanceTax * 1,'account':this.formatFloat(forecastBillData.takingBalance * 1 + forecastBillData.takingBalanceTax * 1)},
          {'index':18,'data':'管理费','project':'','money':forecastBillData.managementFee * 1,'tax':forecastBillData.managementFeeTax * 1,'account':this.formatFloat(forecastBillData.managementFee * 1 + forecastBillData.managementFeeTax * 1)},
          {'index':19,'data':'管理费2','project':'','money':forecastBillData.managementFeeTwo * 1,'tax':'-','account':forecastBillData.managementFeeTwo * 1},
        ]
        // 自定义项
        this.withholdData.map((item)=>{
          settelData.push({'index':getItemName(item.itemTypeName,item.subName),'data':'','project':'','money':item.money,'tax':item.tax,'account':item.ticket})
        })
        settelData.push({'index':'结算金额合计','data':'','project':'','money':'-','tax':'-','account':this.forecastFormData.billFee * 1})
        settelData.push({'index':'开票金额合计','data':'','project':'','money':this.forecastFormData.ticketFee * 1,'tax':'','account':''})
        settelData.push({'index':'上次差余额','data':'','project':'','money':this.forecastFormData.prevPoorBalance * 1,'tax':'','account':''})
        settelData.push({'index':'本次差余额','data':'','project':'','money':this.forecastFormData.curPoorBalance * 1,'tax':'','account':''})
        settelData.push({'index':'备注','data':'','project':'','money':forecastBillData.remark || '','tax':'','account':''})
        settelData.push({'index':'开票客户名称','data':'','project':'开票金额','money':'','tax':'开票时间','account':''})
        this.invoiceInfo.forEach(item=>{
          settelData.push({'index':item.unitName,'data':'','project':item.invoiceMoney,'money':'','tax':item.applyDate,'account':''})
        })
        settelData.push({'index':'到款单位','data':'','project':'到款时间','money':'','tax':'来款金额','account':'认领金额'})
        this.reciveList.forEach(item=>{
          settelData.push({'index':item.reciveRecordList[0].incomeBelong,'data':'','project':item.releaseDate,'money':'','tax':item.incomeFee,'account':item.reciveRecordList[0].reciveFee})
        })
        const listLength = {invoiceInfo:this.invoiceInfo.length,reciveList:this.reciveList.length,customItemLength:this.withholdData.length}
        // 预估明细表
        let forecastLibraryList = []
        if(this.model.forecastLibraryList && this.model.forecastLibraryList.length){
          forecastLibraryList = this.model.forecastLibraryList.map(item=>{
            item.fundArea = this.areaName(item.fundProvince,item.fundCity,item.fundTown,'-') //公积金缴纳地
            item.socialArea = this.areaName(item.socialProvince,item.socialCity,item.socialTown,'-')
            item.socialAll = this.getAllTotal(item.forecastSocialFormId,item.unitSocialSum,item.personalSocialSum)
            item.fundAll = this.getAllTotal(item.forecastFundFormId,item.unitFundSum,item.personalFundSum)
            item.allSum = this.getTotal(item.socialAll,item.fundAll,item.forecastSocialFormId,item.forecastFundFormId)
            item.unitIdName = this.settleDomainBelongs[item.settleDomainId]['customerName']
            item.settleDomainIdName = this.settleDomainBelongs[item.settleDomainId]['departName']
            item.unitMedicalFee = this.getDefaultValue(item.forecastSocialFormId,item.unitMedicalFee)
            item.unitUnemploymentFee = this.getDefaultValue(item.forecastSocialFormId,item.unitUnemploymentFee)
            item.unitWorkInjuryFee = this.getDefaultValue(item.forecastSocialFormId,item.unitWorkInjuryFee)
            item.unitBirthFee = this.getDefaultValue(item.forecastSocialFormId,item.unitBirthFee)
            item.unitBitmailmentFee = this.getDefaultValue(item.forecastSocialFormId,item.unitBitmailmentFee)
            item.unitSocialSum = this.getDefaultValue(item.forecastSocialFormId,item.unitSocialSum)
            item.unitPensionFee = this.getDefaultValue(item.forecastSocialFormId,item.unitPensionFee)
            item.personalPensionFee = this.getDefaultValue(item.forecastSocialFormId,item.personalPensionFee)
            item.personalMedicalFee = this.getDefaultValue(item.forecastSocialFormId,item.personalMedicalFee)
            item.personalUnemploymentFee = this.getDefaultValue(item.forecastSocialFormId,item.personalUnemploymentFee)
            item.personalBigmailmentFee = this.getDefaultValue(item.forecastSocialFormId,item.personalBigmailmentFee)
            item.personalSocialSum = this.getDefaultValue(item.forecastSocialFormId,item.personalSocialSum)
            item.unitFundSum = this.getDefaultValue(item.forecastFundFormId,item.unitFundSum)
            item.personalFundSum = this.getDefaultValue(item.forecastFundFormId,item.personalFundSum)
            return item
          })
        }
        // 对比库明细
        let comparisonLibraryList = []
        if(this.model.comparisonLibraryList && this.model.comparisonLibraryList.length){
          comparisonLibraryList = this.model.comparisonLibraryList.map(item=>{
            item.departIdName = this.settleDomainBelongs[item.departId]['departName']
            item.unitIdName = this.settleDomainBelongs[item.departId] ? this.settleDomainBelongs[item.departId]['customerName'] : ''
            return item
          })
        }
        let insuranceData = []
        if(this.model.businessInsuranceList){
          insuranceData = this.model.businessInsuranceList.map(item=>{
            item.remark = item.remark || ''
            item.forecastBuyPay = item.forecastBuyPay || ''
            item.balance = Number(item.buyPay) - Number(item.forecastBuyPay)
            item.settleType = filterDictText(this.settleTypeBelongs,item.settleType)
            item.policyNo = item.policyNo ? item.policyNo : ''
            item.buyPay = item.buyPay ? item.buyPay : ''
            return item
          })
        }
        return {listLength:listLength,forecastLibraryList:forecastLibraryList,comparisonLibraryList:comparisonLibraryList,insuranceData:insuranceData,settelData:settelData}
      },
      handleDownload() {
        this.exportLoading = true
        const obj = this.commonExport();
        var excelDatas = [
          {
            tHeader: ["员工编码","员工姓名","身份证号","单位名称","结算主体","社保缴纳月份","社保生成月份","公积金缴纳月份","公积金生成月份",
            "单位养老保险","单位医疗保险","单位失业保险","单位工伤保险","单位生育保险","单位大病救助","单位社保总计","单位住房公积金",
            "个人养老保险","个人医疗保险","个人失业保险","个人大病救助","个人社保总计","个人住房公积金","公积金缴纳地","社保缴纳地",
            "创建时间","单位养老基数","单位医疗基数","单位失业基数","单位工伤基数","单位生育基数","个人养老基数","个人医疗基数","个人失业基数",
            "单位养老比例","单位医疗比例","单位失业比例","单位工伤比例","单位生育比例","个人养老比例","个人医疗比例","个人失业比例","个人大病缴纳基数",
            "单位大病缴纳基数","个人大病比例","单位大病缴纳比例","单位公积金缴纳基数","个人公积金缴纳基数","单位公积金缴纳比例","个人公积金缴纳比例",
            "社保合计","公积金合计","总合计","备注"], // 表一的数据字段
            filterVal: ["empNo", "empName", "empIdcard", "unitIdName", "settleDomainIdName", "socialPayMonth", "socialCreateMonth","providentPayMonth","providentCreateMonth",
            "unitPensionFee","unitMedicalFee","unitUnemploymentFee","unitWorkInjuryFee","unitBirthFee","unitBitmailmentFee","unitSocialSum","unitFundSum",
            "personalPensionFee","personalMedicalFee","personalUnemploymentFee","personalBigmailmentFee","personalSocialSum","personalFundSum","fundArea","socialArea",
            "createTime","unitPensionBase","unitMedicalBase","unitUnemploymentBase","unitInjuryBase","unitBirthBase","personalPensionBase","personalMedicalBase","personalUnemploymentBase",
            "unitPersionPro","unitMedicalPro","unitUnemploymentPro","unitInjuryPro","unitBirthPro","personalPersionPro","personalMedicalPro","personalUnemploymentPro","personalBigailmentBase",
            "unitBigailmentBase","personalBigailmentPro","unitBigailmentPro","unitFundBase","personalFundBase","unitFundProp","personalFundProp",
            "socialAll","fundAll","allSum","remark"], // sheet表一头部
            tableDatas: obj.forecastLibraryList, // 表一的整体json数据
            sheetName: "预估明细表"// 表一的sheet名字
          },
          
          { 
            tHeader: ["结算主体编码", "结算类型","结算主体名称","姓名","身份证号码","险种","起保时间","截止时间","保单号","购买标准","实际保费","预估保费","差额","医疗","身故或残疾","备注"],
            filterVal: ['settlementOrganNo','settleType',"settlementOrganName", "empName","empIdcardNo", "insuranceTypeName","policyStart","policyEnd","policyNo","buyStandard","buyPay","forecastBuyPay","balance","medicalMoney","deathDisabilityMoney","remark"],
            tableDatas: obj.insuranceData,
            sheetName: "商险派单明细"
          },
          { 
            tHeader: ["员工编码", "员工姓名","身份证号","单位名称","结算主体","缴纳月份","社保生成月份","公积金生成月份","单位社保合计差额","单位住房公积金差额","单位合计差额","个人社保合计差额","个人住房公积金差额","个人合计差额","总合计差额"],
            filterVal: ['empNo','empName','empIdcard',"unitIdName", "departIdName","socialSecurityMonth", "socialSecurityMonthCreate","fundCreateMonth","socialSecurityCompanySum","providentCompanyDiff","companySumDiff","socialSecurityPersonalSum","providentPersonalDiff","personalSumDiff","sumDiff"],
            tableDatas: obj.comparisonLibraryList,
            sheetName: "对比库明细"
          },
          {
            tHeader: ["序号","名称","费用项目", "金额", "增值税", "开票额小计"],
            filterVal: ['index','data',"project", "money", "tax", "account"],
            tableDatas: obj.settelData,
            sheetName: "结算单"
          },
        ]
        this.json2excel(excelDatas, "预估账单", true, "xlsx",obj.listLength)
      },
      json2excel(tableJson, filenames, autowidth, bookTypes,length){
        var that = this
        //这个是引用插件
        import("@/vendor/ExportForecastExcel").then(excel => {
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
            length:length,
          })
          
        }).finally(()=>{
          setTimeout(()=>{
              this.exportLoading = false
          },1000)
          
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j] || ''
        }))
      },
      // 隐藏列样式
      handleColumnStyle(width) {
        if (width) {
          return `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: ${width}px;`
        }
        return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
      },
      // 点击添加自定义项按钮
      addCustomItem(){
        this.$refs.addCustomItemModal.forecastBillId = this.forecastBillData.id || ''
        this.$refs.addCustomItemModal.show()
      },
      // 添加自定义项modal回调
      addCustomItemModalCallback(callData){
        if(callData && callData.forecastBillSub){
          this.withholdData.push(callData.forecastBillSub)
          this.forecastFormData = callData.forecastForm
        }
      },
      // 删除自定义项
      deleteCustomItem(index){
        const url = this.url.deleteCustomItemUrl + this.withholdData[index].id
        httpAction(url, {}, 'DELETE').then(res => {
          if (Number(res.code) === 200) {
            this.withholdData.splice(index, 1)
            this.forecastFormData = res.data
          }else {
            this.$message.error(res.msg || '删除自定义项失败！')
          }
        })
      },
      // 修改备注
      blurSettleRemark(e){
        const value = e.target.value || ''
        if(String(value) === String(this.forecastBillData.remark)){
          return
        }
        const billId = this.forecastBillData.id || ''
        const parameter = {id:billId,remark:value}
        httpAction(this.url.editBillRemark, parameter, 'PUT').then((res) => {
          if (Number(res.code) === 200) {
            this.forecastBillData.remark = value
            this.$message.success('修改成功')
          }else{
            this.$message.warning(res.msg)
          }
        })
      }
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
.ant-advanced-search-form .code-box-demo {
  padding: 42px 24px 50px;
  color: rgba(0, 0, 0, 0.65);
}
.ant-advanced-search-form .ant-empty {
  margin: 0 8px;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
}
.ant-advanced-search-form .ant-empty-description {
  margin: 0;
}
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}
.table1 {
  border: 1px solid #ccc;
  width: 80%;
  border-collapse: collapse;
  border-spacing: 0;
  margin: 0 auto;
}
.table1 .tr1 {
  margin: 0px;
  padding: 0;
  width: 100%;
}
.table1 .td1 {
  border: 1px solid #ccc;
  margin-left: 10px;
  padding: 5px;
  text-align: center;
  background-color: #d5e7f2;
  font-weight: bolder;
  width: 150px;
}
.table1 .td2 {
  border: 1px solid #ccc;
  margin-left: 10px;
  padding: 5px;
  width: 150px;
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
  input {
    text-align: center;
  }
}
.tableFormItem {
  :global(.ant-input-disabled) {
    color: rgba(0, 0, 0, 0.65);
    background-color: #ffffff;
  }
}
.operateBtnWrap {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  margin-bottom: 10px;
}
</style>
