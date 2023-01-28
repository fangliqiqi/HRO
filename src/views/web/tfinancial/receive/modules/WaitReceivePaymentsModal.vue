<template>
  <a-modal
    :title="title"
    :width="1100"
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
      >确定还款</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form ant-disabled-form"
      >
        <a-row>
          <a-col :span="12">
            <!-- 财务进账信息 -->
            <a-row>
              <a-col :span="24">
                <a-tabs defaultActiveKey="1">
                  <a-tab-pane
                    key="1"
                    tab="财务进账信息"
                  >
                    <a-row>
                      <a-col :span="24">
                        <a-form-item
                          label="来款单位"
                          class="stepFormText"
                        >
                          <a-input
                            :disabled="true"
                            placeholder="来款单位"
                            v-decorator="['incomeBelong', {}]"
                            style="width: 370px;"
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
                            placeholder="银行账号"
                            v-decorator="['incomeBank', { rules: [{ pattern:/^([0-9]{1})(\d{9,24})$/,message: '银行账号必须是10到25位数字!' }] }]"
                            style="width: 370px;"
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
                            style="width: 370px;"
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
                            style="width: 370px;"
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
                            style="width: 370px;"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-tab-pane>
                </a-tabs>
              </a-col>
            </a-row>

            <!-- 垫付还款信息 -->
            <a-row>
              <a-col :span="24">
                <a-tabs defaultActiveKey="1">
                  <a-tab-pane
                    key="1"
                    :tab="paymentsStatus == 2 ? '商险预估还款信息' : '垫付还款信息'"
                    style="height: 330px;"
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
                            showSearch
                            optionFilterProp="children"
                            placeholder="请选择结算主体"
                            v-decorator="['settleDomainId', validatorRules.settleDomainId]"
                            style="width: 370px;"
                            :dropdownMatchSelectWidth="false"
                            :disabled="settleDomainDisabled"
                            @change="handleGetList"
                          >
                            <a-select-option
                              v-for="(value, key) in settleDomainBelongs"
                              :key="key"
                              :value="value.id"
                            >{{ value.departName }}</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                    </a-row>

                    <a-row>
                      <a-col :span="24">
                        <a-form-item
                          label="待认领金额"
                          class="stepFormText"
                        >
                          <a-input
                            :disabled="true"
                            placeholder="待认领金额"
                            v-decorator="['associcationFee', {}]"
                            style="width: 143px;"
                          />
                        </a-form-item>
                        <a-form-item
                          label="回款金额"
                          class="stepFormText2"
                        >
                          <a-input
                            placeholder="回款金额"
                            v-decorator="['reciveFee', validatorRules.reciveFee]"
                            style="width: 142px;"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>

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
                            style="width: 370px;"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-tab-pane>
                </a-tabs>
              </a-col>
            </a-row>
          </a-col>

          <a-col :span="12">
            <!-- 垫付审批流程列表 -->
            <a-row>
              <a-col :span="24">
                <a-tabs defaultActiveKey="1">
                  <a-tab-pane
                    key="1"
                    :tab="paymentsStatus == 2 ? '商险审批流程列表' : '垫付审批流程列表'"
                  >
                    <a-row>
                      <a-col :span="24">
                        <!--列表-->
                        <a-table
                          :columns="paymentsStatus == 1 ? columns : columnsOfBusiInsurance"
                          :dataSource="dataSource"
                          :bordered="true"
                          ref="table"
                          size="middle"
                          rowKey="id"
                          :pagination="ipagination"
                          :loading="loading"
                          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                          @change="handleTableChange"
                          :scroll="{x:1}"
                        >
                        </a-table>
                      </a-col>
                    </a-row>
                  </a-tab-pane>
                </a-tabs>
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
  import { filterObj } from '@/utils/util'
  import { getAction, httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'WaitReceivePaymentsModal',
    components: {
      SelectPage
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
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return `${range[0]}-${range[1]} 共${total}条`
          },
          onChange: (page, pageSize) => {
            this.ipagination.current = page
            this.ipagination.pageSize = pageSize
          },
          showQuickJumper: false,
          showSizeChanger: true,
          total: 0
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
            width: 105,
            ellipsis: true,
            title: '单位名称',
            align: 'center',
            dataIndex: 'applyUnitName',
            customRender: (text) => {
              const textStr = text ? text : '-'
              return <a-tooltip placement="topLeft" title={textStr}>{textStr}</a-tooltip>
            },
          },
          {
            width: 90,
            ellipsis: true,
            title: '未回款金额',
            align: 'center',
            dataIndex: 'advanceNotPayback',
            customRender: (text) => {
              const textStr = text.toLocaleString()
              return <a-tooltip placement="topLeft" title={textStr}>{textStr}</a-tooltip>
            },
          },
          {
            width: 90,
            ellipsis: true,
            title: '垫付金额',
            align: 'center',
            dataIndex: 'advanceMoney',
            customRender: (text) => {
              const textStr = text.toLocaleString()
              return <a-tooltip placement="topLeft" title={textStr}>{textStr}</a-tooltip>
            },
          },
          {
            width: 90,
            ellipsis: true,
            title: '开票金额',
            align: 'center',
            dataIndex: 'ticketMoney',
            customRender: (text) => {
              const textStr = text.toLocaleString()
              return <a-tooltip placement="topLeft" title={textStr}>{textStr}</a-tooltip>
            },
          },
          {
            width: 90,
            ellipsis: true,
            title: '结算金额',
            align: 'center',
            dataIndex: 'settleMoney',
            customRender: (text) => {
              const textStr = text.toLocaleString()
              return <a-tooltip placement="topLeft" title={textStr}>{textStr}</a-tooltip>
            },
          },
          {
            width: 110,
            ellipsis: true,
            title: '垫付申请日期',
            align: 'center',
            dataIndex: 'createTime',
            customRender: (text) => {
              const textStr = text?text.substring(0,10):'-'
              return <a-tooltip placement="topLeft" title={textStr}>{textStr}</a-tooltip>
            },
          },
        ],
        columnsOfBusiInsurance: [
          {
            width: 105,
            ellipsis: true,
            title: '单位名称',
            align: 'center',
            dataIndex: 'customerName',
            customRender: (text) => {
              const textStr = text ? text : '-'
              return <a-tooltip placement="topLeft" title={textStr}>{textStr}</a-tooltip>
            },
          },
          {
            width: 90,
            ellipsis: true,
            title: '总金额',
            align: 'center',
            dataIndex: 'balance',
            customRender: (text) => {
              const textStr = text.toLocaleString()
              return <a-tooltip placement="topLeft" title={textStr}>{textStr}</a-tooltip>
            },
          },
          {
            width: 90,
            ellipsis: true,
            title: '已回款金额',
            align: 'center',
            dataIndex: 'payBackBalance',
            customRender: (text) => {
              const textStr = text.toLocaleString()
              return <a-tooltip placement="topLeft" title={textStr}>{textStr}</a-tooltip>
            },
          },
          {
            width: 90,
            ellipsis: true,
            title: '未回款金额',
            align: 'center',
            dataIndex: 'settleDomainId',
            customRender: (text, record) => {
              const textStr = (record.balance - record.payBackBalance).toLocaleString()
              return <a-tooltip placement="topLeft" title={textStr}>{textStr}</a-tooltip>
            },
          },
          {
            width: 90,
            ellipsis: true,
            title: '结算月份',
            align: 'center',
            dataIndex: 'settlementMonth',
            customRender: (text) => {
              const textStr = text ? text : '-'
              return <a-tooltip placement="topLeft" title={textStr}>{textStr}</a-tooltip>
            },
          },
        ],
        model: {},
        title: '操作',
        visible: false,
        addButton: true, // 添加按钮
        loadDataSource: [], // 已经加载的选项
        paymentsStatus: 1,  // 1 垫付还款 2 商险预估还款
        confirmLoading: false,
        form: this.$form.createForm(this),
        settleDomainBelongs: [],  // 结算主体
        settleDomainDisabled: true,
        selectionReciveFeeStatus: 1,  // 选中的回款状态（0为正常 可提交）
        selectionReciveFeeErrorMsg: {'1': '请选择审批流程！', '2': '‘回款金额’不能大于单选的‘未回款金额’！', '3': '‘回款金额’必须等于多选的‘未回款金额’总和！'},
        validatorRules: {
          settleDomainId: {rules: [{ validator: this.validatSettleDomainId }]},
          reciveFee: {rules: [{ validator: this.validatReciveFee }]},
        },
        url: {
          list: 'hrApproval/tadvancepayment/query/noBack/page', // 列表
          busiInsuranceList: 'busiInsurance/forecastbuypayform/query/noBack/page',  // 商险预估还款
          add: 'salary/treciverecord/addAdvancePayment',
          addInsurance: '/salary/treciverecord/addInsurance'
        },
      }
    },
    methods: {
      // 数据加载
      loadData(arg) {
        if (!this.url.list && !this.url.busiInsuranceList) {
          this.$message.error('请设置url.list属性！')
          return
        }
        let reqUrl = ''
        if (Number(arg) === 1) {
          this.ipagination.current = 1  // 重置第一页
        }
        if (String(this.paymentsStatus) === '1') { // 垫付还款
          reqUrl += this.url.list
        } else if (String(this.paymentsStatus) === '2') {  // 商险预估还款
          reqUrl += this.url.busiInsuranceList
        }
        var params = this.getQueryParams()//查询条件
        this.loading = true
        getAction(reqUrl, params).then((res) => {
          if (Number(res.code) === 200) {
            this.dataSource = res.data.records
            // 处理加载的数据
            for (const record of this.dataSource) {
              if (JSON.stringify(this.loadDataSource).indexOf(JSON.stringify(record.id)) === -1) {
                this.loadDataSource.push(record) // 进行动态的操作
              }
            }
          } else {
            this.$message.error('获取数据失败！')
          }
          this.ipagination.total = res.data.total
          this.loading = false
        })
      },
      //分页、排序、筛选变化时触发
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field
          this.isorter.order = ('ascend' === String(sorter.order))? 'asc' : 'desc'
        }
        this.ipagination = pagination
        this.loadData()
      },
      // 点击按钮选中
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectionRows = selectionRows
        let selectionReciveFeeSum = 0
        if (this.selectedRowKeys.length > 0) {
          const reciveFee = this.form.getFieldValue('reciveFee')
          // 循环取出‘未回款金额’进行累加
          for (const selectedRowKey of this.selectedRowKeys) {
            for (const item of this.loadDataSource) {
              if (String(selectedRowKey) === String(item.id)) {
                if (String(this.paymentsStatus) === '1') { // 垫付还款
                  selectionReciveFeeSum += (0 - (item.advanceNotPayback) * 1)  // 负数转换
                } else if (String(this.paymentsStatus) === '2') {  // 商险预估还款
                  selectionReciveFeeSum += (item.balance * 1 - item.payBackBalance * 1)  // 待回款金额
                }
                break
              }
            }
          }
          // 精度处理
          selectionReciveFeeSum = this.formatFloat(selectionReciveFeeSum)
          // 已填写回款金额的情况下
          if (!(typeof(reciveFee) == 'undefined')) {
            if (this.selectedRowKeys.length === 1) { // 单选
              if (selectionReciveFeeSum < reciveFee * 1) {
                this.$message.error(this.selectionReciveFeeErrorMsg[2])
                this.selectionReciveFeeStatus = 2
                return false
              }
              this.selectionReciveFeeStatus = 0

            } else {  // 多选
              if (selectionReciveFeeSum != reciveFee * 1) {
                this.$message.error(this.selectionReciveFeeErrorMsg[3])
                this.selectionReciveFeeStatus = 3
                return false
              }
              this.selectionReciveFeeStatus = 0
            }
          }
        } else {  // 为选择提示必选
          this.selectionReciveFeeStatus = 1
          this.$message.error(this.selectionReciveFeeErrorMsg[1])
        }
      },
      add() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.model.incomeDate = this.model.incomeDate.substring(0, 10)
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'incomeBelong', 'incomeBank', 'incomeDate', 'financeRemark', 'associcationFee','paymentUnitName'))
        })
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            const associcationFee = values.associcationFee * 1
            const reciveFee = values.reciveFee * 1
            if (reciveFee > associcationFee) {
              that.$message.error('回款金额不能大于‘待认领金额’！')
              return false
            }
            // 验证选中行
            if (this.selectedRowKeys.length > 0) {
              let selectionReciveFeeSum = 0
              // 循环取出‘未回款金额’进行累加
              for (const selectedRowKey of this.selectedRowKeys) {
                for (const item of this.loadDataSource) {
                  if (String(selectedRowKey) === String(item.id)) {
                    if (Number(this.paymentsStatus) === 1) { // 垫付还款
                      selectionReciveFeeSum += (0 - (item.advanceNotPayback) * 1)  // 负数转换
                    } else if (Number(this.paymentsStatus) === 2) {  // 商险预估还款
                      selectionReciveFeeSum += (item.balance * 1 - item.payBackBalance * 1)  // 待回款金额
                    }
                    break
                  }
                }
              }
              // 精度处理
              selectionReciveFeeSum = this.formatFloat(selectionReciveFeeSum)
              if (this.selectedRowKeys.length === 1) { // 单选
                if (selectionReciveFeeSum < reciveFee) {
                  that.$message.error(this.selectionReciveFeeErrorMsg[2])
                  this.selectionReciveFeeStatus = 2
                  return false
                }
                this.selectionReciveFeeStatus = 0
              } else {  // 多选
                if (selectionReciveFeeSum != reciveFee) {
                  that.$message.error(this.selectionReciveFeeErrorMsg[3])
                  this.selectionReciveFeeStatus = 3
                  return false
                }
                this.selectionReciveFeeStatus = 0
              }
            }
            // 验证通过
            if (this.selectionReciveFeeStatus == 0) {
              that.confirmLoading = true
              let httpurl = ''
              if (this.paymentsStatus == 1) { // 垫付还款
                httpurl += this.url.add
              } else if (this.paymentsStatus == 2) {  // 商险预估还款
                httpurl += this.url.addInsurance
              }
              const method = 'post'
              const formData = Object.assign(this.model, values)
              const advanceIds = (this.selectedRowKeys).join(',')
              // 拼接请求数据
              const reqFormData = {
                reciveId : formData.id,
                advanceIds : advanceIds,
                settleDomainId : formData.settleDomainId,
                reciveFee : formData.reciveFee,
                serverRemark : formData.serverRemark
              }
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
            } else {
              that.$message.error(this.selectionReciveFeeErrorMsg[this.selectionReciveFeeStatus])
            }
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
        this.loading = false
        this.addButton = true // 添加按钮
        this.confirmLoading = false
        this.settleDomainBelongs = []  // 结算主体
        this.selectionReciveFeeStatus = 1  // 选中的回款状态（0为正常 可提交）
        this.paymentsStatus = 1  // 1 垫付还款 2 商险预估还款
        this.dataSource = []
        this.queryParam = {}
        this.selectionRows = []
        this.selectedRowKeys = []
        this.ipagination.current = 1
        this.settleDomainDisabled = true
        this.loadDataSource = []
      },
      // 单位选择变化
      handleUnitChange(value) {
        this.settleDomainBelongs = []
        if (value) {
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({unitId:value,settleDomainId:undefined}, 'unitId','settleDomainId'))
          })
          httpAction(`/hrBase/customerBusiness/customerInfo/getSettleDomain/${value}`, {}, 'get').then((res) => {
            if(res.code === 200){
              this.settleDomainDisabled = false
              this.settleDomainBelongs = res.data
            }
          })
        } else {
          this.settleDomainDisabled = true
          this.model.settleDomainId = []
          this.$nextTick(() => {
            const obj = Object.assign(this.model,{unitId:undefined})
            this.form.setFieldsValue(pick(obj, 'settleDomainId','unitId'))
          })
        }
      },
      // 选择结算主体后请求列表
      handleGetList(value) {
        if (Number(this.paymentsStatus) === 1) { // 垫付还款
          this.url.list = (this.url.list).split("?")[0] + '?settleDomainId=' + (value + '')
        } else if (Number(this.paymentsStatus) === 2) {  // 商险预估还款
          this.url.busiInsuranceList = (this.url.busiInsuranceList).split("?")[0] + '?settleDomainId=' + (value + '')
        }
        this.selectionReciveFeeStatus = 1  // 选中的回款状态（0为正常 可提交）
        this.loadDataSource = []
        this.loadData(1)
      },
      // 精度处理
      formatFloat(f, digit = 2) {
        const m = Math.pow(10, digit)
        return Math.round(f * m) / m
      },
      /******************************************* 验证规则 *******************************************/
      // 结算主体验证
      validatSettleDomainId(rule, value, callback) {
        if (!value) {
          callback('请选择结算主体！')
          return false
        }
        if (value.length === 0) {
          callback('请选择结算主体！')
          return false
        }
        callback()
      },
      // 认领金额验证
      validatReciveFee(rule, value, callback) {
        if (!value) {
          callback('金额不能为空！')
          //this.$message.error('回款金额不能为空！')
          return false
        }
        if (!new RegExp(/((^[1-9]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          callback('两位有效数字！')
          //this.$message.error('回款金额只能为两位小数的有效数字！')
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
    width: 100px;
  }
}
.stepFormText2 {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
  :global(.ant-form-explain) {
    min-height: 0px;
  }
  margin-bottom: 0px;
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
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}
</style>
