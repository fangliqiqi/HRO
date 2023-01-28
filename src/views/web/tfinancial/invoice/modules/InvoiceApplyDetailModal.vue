<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleBack"
        v-if="backButton"
        style="background-color: rgba(255, 51, 51, 1); border-color: rgba(255, 51, 51, 1);"
      >退回</a-button>
      <a-button
        type="primary"
        v-if="invoiceButton"
        @click="handleInvoice"
        :loading="confirmLoading"
      >确认开票</a-button>
      <a-button
        v-if="addConfirmButton"
        type="primary"
        :loading="confirmLoading"
        @click="handleOk('addConfirm')"
      >保存</a-button>
      <a-button
        v-if="addReleaseButton"
        type="primary"
        :loading="confirmLoading"
        @click="handleOk('addRelease')"
      >提交开票申请</a-button>
    </template>

    <a-tabs
      :activeKey="activeKey"
      @change="tabsChange"
    >
      <a-tab-pane
        :forceRender="true"
        tab="开票详情"
        key="1"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="form"
            layout="inline"
            class="ant-advanced-search-form ant-disabled-form"
          >
            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="申请开票金额"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="!addConfirmButton && addReleaseButton"
                    placeholder="请输入开票金额"
                    v-decorator="['invoiceMoney']"
                    style="width: 250px"
                  />
                </a-form-item>
                <a-form-item
                  label="开票类型"
                  class="stepFormText"
                >
                  <a-select
                    :disabled="true"
                    placeholder="请选择开票类型"
                    v-decorator="['invoiceType', {}]"
                    style="width: 250px"
                  >
                    <a-select-option
                      v-for="(value, key) in invoiceTypeOptions"
                      :key="key"
                      :value="key"
                    >{{ value }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="客户名称"
                  class="stepFormText"
                >
                  <!-- <a-select
                    showSearch
                    :disabled="!addConfirmButton"
                    optionFilterProp="children"
                    placeholder="请选择客户名称"
                    v-decorator="['unitId', {}]"
                    style="width: 250px"
                  >
                    <a-select-option
                      v-for="(value, key) in unitBelongs"
                      :key="key"
                      :value="value.id"
                      @click="handleUnitChange(value)"
                    >{{ value.customerName }}</a-select-option>
                  </a-select> -->
                  <a-input
                    :disabled="true"
                    v-decorator="['unitName']"
                    style="width: 250px"
                    :title="this.model.tinvoice ? this.model.tinvoice.unitName : ''"
                  />
                </a-form-item>
                <a-form-item
                  label="结算主体"
                  class="stepFormText"
                >
                  <!-- <a-select
                    showSearch
                    optionFilterProp="children"
                    placeholder="请选择结算主体"
                    v-decorator="['settleDomainId', validatorRules.settleDomainId]"
                    style="width: 250px"
                    :disabled="settleDomainDisabled || !addConfirmButton"
                  >
                    <a-select-option
                      v-for="(value, key) in settleDomainBelongs"
                      :key="key"
                      :value="value.id"
                      @click="handleGetList(value)"
                    >{{ value.departName }}</a-select-option>
                  </a-select> -->
                  <a-input
                    :disabled="true"
                    v-decorator="['settleDomainName']"
                    style="width: 250px"
                    :title="this.model.tinvoice ? this.model.tinvoice.settleDomainName : ''"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="抬头名称"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请输入抬头名称"
                    v-decorator="['headerName', validatorRules.headerName]"
                    style="width: 250px"
                    :title="this.model.tinvoice ? this.model.tinvoice.headerName : ''"
                  />
                </a-form-item>
                <a-form-item
                  label="纳税人识别号"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请输入纳税人识别号"
                    v-decorator="['taxIdentificationNum', validatorRules.taxIdentificationNum]"
                    style="width: 250px"
                    :title="this.model.tinvoice ? this.model.tinvoice.taxIdentificationNum : ''"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="商品名称"
                  class="stepFormText"
                >
                  <a-select
                    showSearch
                    :disabled="true"
                    optionFilterProp="children"
                    placeholder="请选择商品名称"
                    v-decorator="['goodsName', {}]"
                    style="width: 250px"
                  >
                    <a-select-option
                      v-for="(item, index) in goodsNameOptions"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="发票类型"
                  class="stepFormText"
                >
                  <a-select
                    showSearch
                    :disabled="true"
                    optionFilterProp="children"
                    placeholder="请选择发票类型"
                    v-decorator="['invKind', {}]"
                    style="width: 250px"
                  >
                    <a-select-option
                      v-for="(value, key) in invKindOptions"
                      :key="key"
                      :value="key"
                    >{{ value }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <!-- <a-row>
              <a-col :span="24">
                <a-form-item
                  label="地址"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请输入地址"
                    v-decorator="['address', validatorRules.address]"
                    style="width: 250px"
                    :title="this.model.tinvoice ? this.model.tinvoice.address : ''"
                  />
                </a-form-item>
                <a-form-item
                  label="电话"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请输入电话"
                    v-decorator="['tel', validatorRules.tel]"
                    style="width: 250px"
                    :title="this.model.tinvoice ? this.model.tinvoice.tel : ''"
                  />
                </a-form-item>
              </a-col>
            </a-row> -->

            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="税收分类"
                  class="stepFormText"
                >
                  <a-select
                    :disabled="true"
                    placeholder="请选择税收分类"
                    v-decorator="['classCode', {}]"
                    style="width: 250px"
                  >
                    <a-select-option
                      v-for="(item, index) in taxClassificationOptions"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="税率"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请输入税率"
                    v-decorator="['goodsTaxRate', {}]"
                    style="width: 250px"
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
                    :disabled="true"
                    placeholder="请输入开户行"
                    v-decorator="['bankName', validatorRules.bankName]"
                    style="width: 250px"
                    :title="this.model.tinvoice ? this.model.tinvoice.bankName : ''"
                  />
                </a-form-item>
                <a-form-item
                  label="银行卡号"
                  class="stepFormText"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请输入银行卡号"
                    v-decorator="['bankNo', validatorRules.bankNo]"
                    style="width: 250px"
                    :title="this.model.tinvoice ? this.model.tinvoice.bankNo : ''"
                  />
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
                    :disabled="!addConfirmButton"
                    :rows="2"
                    placeholder="请输入备注"
                    v-decorator="['remark', {rules: [{ max: 500, message: '最大长度500个字符！'}]}]"
                    style="width: 450px"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="24">
                <div class="steps-content">
                  <!--列表-->
                  <a-table
                    v-if="addConfirmButton"
                    rowKey="settleFormId"
                    size="middle"
                    :bordered="true"
                    :columns="columns"
                    :loading="loading"
                    :customRow="rowSelect"
                    :dataSource="dataSource"
                    :pagination="ipagination"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
                  >

                    <!-- 结算金额 -->
                    <span
                      slot="settleMoney"
                      :style="handleColumnStyle(100)"
                      slot-scope="text"
                    >
                      <a-tooltip
                        placement="topLeft"
                        :title="text"
                      >
                        {{ text }}
                      </a-tooltip>
                    </span>

                    <!-- 结算单类型 -->
                    <span
                      slot="settleFormType"
                      :style="handleColumnStyle(100)"
                      slot-scope="text"
                    >
                      <a-tooltip
                        placement="topLeft"
                        :title="text ? formTypeOptions[text] : '-'"
                      >
                        {{ text ? formTypeOptions[text] : '-' }}
                      </a-tooltip>
                    </span>

                    <!-- 结算日期 -->
                    <span
                      slot="settleMonth"
                      :style="handleColumnStyle(100)"
                      slot-scope="text"
                    >
                      <a-tooltip
                        placement="topLeft"
                        :title="text ? text : '-'"
                      >
                        {{ text ? text : '-' }}
                      </a-tooltip>
                    </span>
                  </a-table>
                  <!-- 编辑 -->
                  <a-table
                    v-if="!addConfirmButton"
                    rowKey="id"
                    :columns="columns"
                    :dataSource="editDataSource"
                  >
                    <span
                      slot="action"
                      slot-scope="text, record"
                    >
                      <a
                        v-if="record.settleFormType == 1 || record.settleFormType == 0"
                        @click="handleDetail(record)"
                        v-have="'wxhr:check_salary'"
                      >详情</a>
                    </span>
                    <!-- 结算金额 -->
                    <span
                      slot="settleMoney"
                      :style="handleColumnStyle(100)"
                      slot-scope="text"
                    >
                      <a-tooltip
                        placement="topLeft"
                        :title="text"
                      >
                        {{ text }}
                      </a-tooltip>
                    </span>

                    <!-- 结算单类型 -->
                    <span
                      slot="settleFormType"
                      :style="handleColumnStyle(100)"
                      slot-scope="text"
                    >
                      <a-tooltip
                        placement="topLeft"
                        :title="text ? formTypeOptions[text] : '-'"
                      >
                        {{ text ? formTypeOptions[text] : '-' }}
                      </a-tooltip>
                    </span>

                    <!-- 结算日期 -->
                    <span
                      slot="settleMonth"
                      :style="handleColumnStyle(100)"
                      slot-scope="text"
                    >
                      <a-tooltip
                        placement="topLeft"
                        :title="text ? text : '-'"
                      >
                        {{ text ? text : '-' }}
                      </a-tooltip>
                    </span>
                  </a-table>
                </div>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        v-if="false"
        :forceRender="true"
        tab="开票详情"
        key="2"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="invoiceForm"
            layout="inline"
            class="ant-advanced-search-form ant-disabled-form"
          >
            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="开票类型"
                  class="stepFormTextDisabled"
                >
                  <a-select
                    :disabled="true"
                    placeholder="请选择开票类型"
                    v-decorator="['invoiceType', {}]"
                    style="width: 250px"
                  >
                    <a-select-option
                      v-for="(value, key) in invoiceTypeOptions"
                      :key="key"
                      :value="key"
                    >{{ value }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="抬头名称"
                  class="stepFormTextDisabled"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请输入抬头名称"
                    v-decorator="['ticketTableHead', {}]"
                    style="width: 250px"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="纳税人识别号"
                  class="stepFormTextDisabled"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请输入纳税人识别号"
                    v-decorator="['taxpayerIdentificationNo', {}]"
                    style="width: 250px"
                  />
                </a-form-item>
                <a-form-item
                  label="地址"
                  class="stepFormTextDisabled"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请输入地址"
                    v-decorator="['addr', {}]"
                    style="width: 250px"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="开户行"
                  class="stepFormTextDisabled"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请输入开户行"
                    v-decorator="['bankName', {}]"
                    style="width: 250px"
                  />
                </a-form-item>
                <a-form-item
                  label="银行卡号"
                  class="stepFormTextDisabled"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请输入银行卡号"
                    v-decorator="['bankNo', {rules:[{max:25,message: '银行卡号不能超过25位！' }]}]"
                    style="width: 250px"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="电话"
                  class="stepFormTextDisabled"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请输入电话"
                    v-decorator="['phone', {}]"
                    style="width: 250px"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-divider />

            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="复核人"
                  class="stepFormTextDisabled"
                >
                  <a-select
                    :disabled="true"
                    placeholder="请选择复核人"
                    v-decorator="['checker', {}]"
                    style="width: 250px"
                  >
                    <a-select-option
                      v-for="(item, index) in model.nextUserIdBelongs"
                      :key="index"
                      :value="item.userId"
                    >{{ item.nickname }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="收款人"
                  class="stepFormTextDisabled"
                >
                  <a-select
                    :disabled="true"
                    placeholder="请选择收款人"
                    v-decorator="['cashier', {}]"
                    style="width: 250px"
                  >
                    <a-select-option
                      v-for="(item, index) in model.nextUserIdBelongs"
                      :key="index"
                      :value="item.userId"
                    >{{ item.nickname }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="商品名称"
                  class="stepFormTextDisabled"
                >
                  <a-select
                    showSearch
                    :disabled="true"
                    optionFilterProp="children"
                    placeholder="请选择商品名称"
                    v-decorator="['goodsName', {}]"
                    style="width: 250px"
                  >
                    <a-select-option
                      v-for="(item, index) in goodsNameOptions"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="发票类型"
                  class="stepFormTextDisabled"
                >
                  <a-select
                    showSearch
                    :disabled="true"
                    optionFilterProp="children"
                    placeholder="请选择发票类型"
                    v-decorator="['invKind', {}]"
                    style="width: 250px"
                  >
                    <a-select-option
                      v-for="(value, key) in invKindOptions"
                      :key="key"
                      :value="key"
                    >{{ value }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="税收分类"
                  class="stepFormTextDisabled"
                >
                  <a-select
                    :disabled="true"
                    placeholder="请选择税收分类"
                    v-decorator="['classCode', {}]"
                    style="width: 250px"
                  >
                    <a-select-option
                      v-for="(item, index) in taxClassificationOptions"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="税率"
                  class="stepFormTextDisabled"
                >
                  <a-input
                    :disabled="true"
                    placeholder="请输入税率"
                    v-decorator="['goodsTaxRate', {}]"
                    style="width: 250px"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        :forceRender="true"
        tab="流程进展明细"
        key="3"
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
                        :color="auditStatusOptions[list.processStatus].color"
                      >
                        <p>{{ list.processContent ? list.processContent : '' }}</p>
                        <p>{{ list.processOperator ? list.processOperator : '' }}</p>
                        <p>{{ list.processTime ? list.processTime : '' }}</p>
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
    <back-modal
      ref="backModal"
      @ok="formOk"
    ></back-modal>
    <open-invoice-modal
      ref="openInvoiceModal"
      @ok="formOk"
    ></open-invoice-modal>
    <salary-engine-search-detail-modal ref="modalDetail"></salary-engine-search-detail-modal>
    <search-detail-modal ref="modalSalaryDetail"></search-detail-modal>
  </a-modal>

</template>

<script>
  import pick from 'lodash.pick'
  import BackModal from './BackModal'
  import { filterObj } from '@/utils/util'
  import OpenInvoiceModal from './OpenInvoiceModal'
  import { getAction, httpAction } from '@/api/manage'
  import SalaryEngineSearchDetailModal from './SalaryEngineSearchDetailModal'
  import SearchDetailModal from './SearchDetailModal'

  export default {
    name: 'InvoiceApplyDetailModal',
    components: {
      BackModal,
      OpenInvoiceModal,
      SalaryEngineSearchDetailModal,
      SearchDetailModal,
    },
    data() {
      return {
        /* 查询条件 */
        queryParam: {},
        /* 数据源 */
        dataSource: [],
        /* 分页参数 */
        ipagination: {
          current: 1,
          pageSize: 10,
          onChange: (page, pageSize) => {
            this.ipagination.current = page
            this.ipagination.pageSize = pageSize
          },
        },
        loading: false,
        /* table选中keys*/
        selectedRowKeys: [],
        /* table选中records*/
        selectionRows: [],
        /* 高级查询条件生效状态 */
        superQueryFlag: false,
        /* 高级查询条件 */
        superQueryParams: '',
        getQueryParams() {
          //获取查询条件
          let sqp = {}
          if (this.superQueryParams) {
            sqp['superQueryParams'] = encodeURI(this.superQueryParams)
          }
          var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
          param.current = this.ipagination.current
          param.size = this.ipagination.pageSize
          return filterObj(param)
        },
        columns: [
          {
            title: '结算金额',
            align: 'center',
            dataIndex: 'settleMoney',
            scopedSlots: { customRender: 'settleMoney' },
          },
          {
            title: '结算单类型',
            align: 'center',
            dataIndex: 'settleFormType',
            scopedSlots: { customRender: 'settleFormType' },
          },
          {
            title: '结算日期',
            align: 'center',
            dataIndex: 'settleMonth',
            scopedSlots: { customRender: 'settleMonth' },
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' },
          }
        ],
        model: {},
        title: '操作',
        visible: false,
        activeKey: '1', // 默认第一个tab
        backButton: false,  // 退回
        invoiceButton: false,  // 开票
        addConfirmButton: true, // 保存
        addReleaseButton: true, // 提交开票申请
        confirmLoading: false,
        invoiceFormStatus: false, // 开票详情默认不显示
        settleDomainDisabled: true, // 结算主体禁止选择
        form: this.$form.createForm(this),
        invoiceForm: this.$form.createForm(this),
        auditForm: this.$form.createForm(this),
        unitNo: '', // 客户Code
        unitName: '', // 客户单位
        auditList: [],  // 审核流程数据
        unitBelongs: [],  // 客户单位
        editDataSource: [], // 编辑的时候列表数据
        settleDomainNo: '', // 结算主体Code
        settleDomainName: '', // 结算主体
        settleDomainBelongs: [],  // 结算主体
        invoiceTypeOptions: {}, // 开票类型
        goodsNameOptions: [], // 商品名称
        taxClassificationOptions: [], // 税收分类
        invKindOptions: {}, // 发票类型
        formTypeOptions: {'0': '普通工资', '1': '工程工资', '2': '商险', '3': '预估结算单', '4': '一次性业务结算单'},
        auditStatusOptions: {
          '0': {'option': '待提交', 'color': 'blue'},
          '1': {'option': '待审核', 'color': 'cyan'},
          '2': {'option': '审核通过', 'color': 'purple'},
          '3': {'option': '审核未通过', 'color': 'red'},
          '4': {'option': '已开票', 'color': 'green'},
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          invoiceMoney: {rules: [{ required: true, message: '请输入开票金额！' }, { validator: this.validatInvoiceMoney }]},
          settleDomainId: {rules: [{ required: true, message: '请选择结算主体！' }]},
        },
        url: {
          list: 'salary/tinvoice/getTInvoiceList', // 列表
          add: 'salary/tinvoice/saveInvoice',  // 保存
          ReleaseUrl: 'salary/tinvoice/doSubmit', // 发布
          tticketconfig: 'hrBase/tticketconfig/getBySettleDomainId?settleDomainId=',
          findUserBypPrmission: 'admin/user/findUserBypPrmission?permissionStr=wxhr:temployeeinfo_unLockAudit',
          tdepartsettlementinfo: 'hrBase/tdepartsettlementinfo/getBySettlementId?settlementId=',
          getSalarySelttleForm: 'salary/tsettlementhform/',
          getEnginnerSelttleForm: 'salary/tengineeringsettlementform/',
          invoice: 'salary/tinvoice/audit',  // 确认开票
        },
      }
    },

    methods: {
      // 数据加载
      loadData() {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性！')
          return
        }
        this.selectionRows = []
        this.selectedRowKeys = []
        this.ipagination.current = 1  // 重置第一页
        var params = this.getQueryParams() //查询条件
        delete params.dateTemp
        delete params.current
        delete params.size
        this.loading = true // 加载图标
        getAction(this.url.list, params).then((res) => {
          if (Number(res.code) === 200) {
            this.dataSource = res.data
          } else {
            this.$message.error('获取数据失败！')
          }
          this.loading = false
        })
      },

      // 点击按钮选中
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectionRows = selectionRows
        this.$nextTick(() => {
          this.model.invoiceMoney = this.selectionRows[0]['settleMoney']
          this.form.setFieldsValue(pick(this.model, 'invoiceMoney'))
        })
      },

      // 点击整行选中
      rowSelect(record) {
        return {
          on: {
            click: () => {
              this.selectionRows = [record]
              this.selectedRowKeys = [record.settleFormId]  // 点击行选中
              this.$nextTick(() => {
                this.model.invoiceMoney = this.selectionRows[0]['settleMoney']
                this.form.setFieldsValue(pick(this.model, 'invoiceMoney'))
              })
            }
          }
        }
      },

      add() {
        this.edit({})
      },

      edit(record, auditProcessUrl = '') {
        this.form.resetFields()
        this.invoiceForm.resetFields()
        this.auditForm.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        // 流程进展明细
        if (auditProcessUrl) {
          httpAction(auditProcessUrl +  this.model.tinvoice.id, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.auditList = res.data
            } else {
              this.$message.error('流程进展数据不完整！')
            }
          })
        }

        if (this.model.tinvoice) {  // 编辑
          for (const item of this.unitBelongs) {  // 处理结算主体数据
            if (String(item.id) === String(this.model.tinvoice.unitId)) {
              this.settleDomainBelongs = item.settleDomainList
              break
            }
          }
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({'invoiceMoney': this.model.tinvoice.invoiceMoney, invoiceType: this.model.tinvoice.invoiceType, 'unitName': this.model.tinvoice.unitName, 'settleDomainName': this.model.tinvoice.settleDomainName, 'remark': this.model.tinvoice.remark,
            'headerName': this.model.tinvoice.headerName, 'taxIdentificationNum': this.model.tinvoice.taxIdentificationNum, 'address': this.model.tinvoice.address, 'tel': this.model.tinvoice.tel,
            'bankName': this.model.tinvoice.bankName, 'bankNo': this.model.tinvoice.bankNo, 'goodsName': this.model.tinvoice.goodsName, 'invKind': this.model.tinvoice.invKind, 'classCode': this.model.tinvoice.classCode, 'goodsTaxRate': this.model.tinvoice.goodsTaxRate},
            'invoiceMoney', 'invoiceType', 'unitName', 'settleDomainName', 'remark', 'headerName', 'taxIdentificationNum', 'bankName', 'bankNo', 'goodsName', 'invKind', 'classCode', 'goodsTaxRate'))
          })
          this.editDataSource = this.selectionRows = this.model.mlist
          // auditFlag为审核通过或者已开票的时候
          // if (this.model.tinvoice.auditFlag == 2 || this.model.tinvoice.auditFlag == 4) {
          //   this.invoiceFormStatus = true
          //   // 获取权限的用户
          //   httpAction(this.url.findUserBypPrmission, '', 'GET').then((res) => {
          //     if (Number(res.code) === 200 && res.data) {
          //       this.model.nextUserIdBelongs = res.data
          //       this.$nextTick(() => {
          //         this.invoiceForm.setFieldsValue(pick({invoiceType: this.model.tinvoice.invoiceType, ticketTableHead: this.model.tinvoice.headerName, taxpayerIdentificationNo: this.model.tinvoice.taxIdentificationNum, addr: this.model.tinvoice.address, bankName: this.model.tinvoice.bankName, phone: this.model.tinvoice.tel, bankNo: this.model.tinvoice.bankNo}, 'invoiceType', 'ticketTableHead', 'taxpayerIdentificationNo', 'addr', 'bankName', 'phone', 'bankNo'))
          //       })
          //       this.model.tinvoice.checker = this.model.tinvoice.checker*1
          //       this.model.tinvoice.cashier = this.model.tinvoice.cashier*1
          //       this.$nextTick(() => {
          //         this.invoiceForm.setFieldsValue(pick(this.model.tinvoice, 'checker', 'cashier', 'goodsName', 'invKind', 'classCode', 'goodsTaxRate'))
          //       })
          //     } else {
          //       this.$message.error('复核人数据为空！')
          //       return false
          //     }
          //   })
          // }
        }
      },

      // 保存按钮
      handleOk(type) {
        const that = this
        if (that.selectionRows.length > 0) {
          // 触发表单验证
          this.form.validateFields((err, values) => {
            if (!err) {
              that.confirmLoading = true
              let httpurl = ''
              const method = 'post'
              const formData = Object.assign(this.model, values)
              if (this.model.tinvoice) {  // 编辑
                httpurl += this.url.ReleaseUrl
                httpurl += `?tInvoiceId=${this.model.tinvoice.id}&invoiceMoney=${formData.invoiceMoney}`
                httpAction(httpurl, '', method).then((res) => {
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
              } else {
                httpurl += this.url.add
                let tinvoiceData = {}
                let requestData = {}
                tinvoiceData.unitNo = this.unitNo
                tinvoiceData.unitId = formData.unitId
                tinvoiceData.unitName = this.unitName
                tinvoiceData.invoiceMoney = formData.invoiceMoney
                tinvoiceData.headerName   = formData.headerName
                tinvoiceData.taxIdentificationNum = formData.taxIdentificationNum
                // tinvoiceData.address      = formData.address
                // tinvoiceData.tel          = formData.tel   
                tinvoiceData.bankName     = formData.bankName
                tinvoiceData.bankNo       = formData.bankNo
                tinvoiceData.settleDomainNo = this.settleDomainNo
                tinvoiceData.settleDomainId = formData.settleDomainId
                tinvoiceData.settleDomainName = this.settleDomainName
                tinvoiceData.remark = formData.remark
                if (String(type) === 'addConfirm') {  // 保存
                  tinvoiceData.auditFlag = 0
                } else if (String(type) === 'addRelease') {  // 提交开票申请
                  tinvoiceData.auditFlag = 1
                }
                requestData.isRes = this.selectionRows
                requestData.tinvoice = tinvoiceData
                httpAction(httpurl, requestData, method).then((res) => {
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
            }
          })
        } else {
          that.$message.error('请选择结算单！')
        }
      },

      // 退回
      handleBack() {
        this.$refs.backModal.title = '确认退回'
        this.$refs.backModal.tinvoiceInfo = this.model.tinvoice
        this.$refs.backModal.add()
      },

      // 确认开票
      handleInvoice() {
        const that = this
        that.confirmLoading = true
        let httpurl = ''
        httpurl += this.url.invoice
        let requestData = {}
        requestData.id = this.model.tinvoice.id
        requestData.settleDomainId = this.model.tinvoice.settleDomainId
        requestData.auditFlag = 2
        httpAction(httpurl, requestData, 'POST').then((res) => {
          if (Number(res.code) === 200) {
            that.$message.success('确认开票成功！')
            that.$emit('ok')
            that.close()
          } else {
            that.$message.warning(res.msg || res.message)
          }
        }).finally(() => {
          that.confirmLoading = false
        })
        // this.$refs.openInvoiceModal.title = '开票编辑'
        // this.$refs.openInvoiceModal.unitBelongs = this.unitBelongs
        // this.$refs.openInvoiceModal.invoiceTypeOptions = this.invoiceTypeOptions
        // this.$refs.openInvoiceModal.goodsNameOptions = this.goodsNameOptions
        // this.$refs.openInvoiceModal.taxClassificationOptions = this.taxClassificationOptions
        // // 税点
        // httpAction(this.url.tdepartsettlementinfo + this.model.tinvoice.settleDomainId, '', 'POST').then((res) => {
        //   if (Number(res.code) === 200 && res.data) {
        //     this.model.departSettlementInfo = res.data
        //     // 开户行
        //     httpAction(this.url.tticketconfig + this.model.tinvoice.settleDomainId, '', 'GET').then((res) => {
        //       if (Number(res.code) === 200 && res.data) {
        //         this.model.ticketConfig = res.data
        //         // 获取权限的用户
        //         httpAction(this.url.findUserBypPrmission, '', 'GET').then((res) => {
        //           if (Number(res.code) === 200 && res.data) {
        //             this.model.nextUserIdBelongs = res.data
        //             this.$refs.openInvoiceModal.edit(this.model)
        //           } else {
        //             this.$message.error('复核人数据为空！')
        //             return false
        //           }
        //         })
        //       } else {
        //         this.$message.error('请在结算主体设置中完善“开票信息”！')
        //         return false
        //       }
        //     })
        //   } else {
        //     this.$message.error('请在结算主体设置中完善“结算配置”！')
        //     return false
        //   }
        // })
      },
      
      // 关闭功能
      handleCancel() {
        this.close()
      },

      // 表单关闭与数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.activeKey = '1' // 默认第一个tab
        this.backButton = false  // 退回
        this.invoiceButton = false  // 开票
        this.addConfirmButton = true // 保存
        this.addReleaseButton = true // 提交开票申请
        this.confirmLoading = false
        this.invoiceFormStatus = false // 开票详情默认不显示
        this.settleDomainDisabled = true // 结算主体禁止选择
        this.unitNo = '' // 客户单位code
        this.unitName = '' // 客户单位
        this.auditList = []  // 审核流程数据
        this.unitBelongs = []  // 客户单位
        this.settleDomainNo = '' // 结算主体code
        this.settleDomainName = '' // 结算主体
        this.settleDomainBelongs = []  // 结算主体
        this.selectionRows = []
        this.selectedRowKeys = []
        this.ipagination.current = 1  // 重置第一页
        this.queryParam = {}
        this.dataSource = []
        this.invKindOptions = {} // 发票类型
        this.editDataSource = [] // 编辑的时候列表数据
        this.invoiceTypeOptions = {} // 开票类型
        this.goodsNameOptions = [] // 商品名称
        this.taxClassificationOptions = [] // 税收分类
      },
      
      handleDetail(record){
        if(String(record.settleFormType) === '1'){
          httpAction(this.url.getEnginnerSelttleForm + record.settleFormId,{},'GET').then((res) => {
            if(Number(res.code) === 200){
              this.$refs.modalDetail.show(res.data)
              this.$refs.modalDetail.title = '详情'
            }
          })
        }
        if(String(record.settleFormType) === '0'){
          httpAction(this.url.getSalarySelttleForm + record.settleFormId,{},'GET').then((res) => {
            if(Number(res.code) === 200){
              this.$refs.modalSalaryDetail.show(res.data)
              this.$refs.modalSalaryDetail.title = '详情'
            }
          })
        }
      },

      // tab切换
      tabsChange(e) {
        this.activeKey = e
      },

      // 单位选择变化
      handleUnitChange(value) {
        this.unitName = value.customerName
        this.model.settleDomainId = []
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'settleDomainId'))
        })
        this.settleDomainDisabled = false
        this.settleDomainBelongs = value.settleDomainList
      },

      // 选择结算主体后请求列表
      handleGetList(value) {
        this.unitNo = value.customerCode
        this.settleDomainNo = value.departNo
        this.settleDomainName = value.departName
        this.url.list = (this.url.list).split("?")[0] + '?deptId=' + (value.id + '')
        this.loadData()
      },

      // 表单回调
      formOk() {
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
      // 金额验证
      validatInvoiceMoney(rule, value, callback) {
        if (!value) {
          callback()
          return false
        }
        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          callback('输入两位小数！')
          return false
        }
        callback()
        return true
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 120px;
  }
}
.stepFormTextDisabled {
  margin-bottom: 0px;
  :global(.ant-form-item-label) {
    width: 110px;
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
</style>
