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
        @click="handleOk"
        :loading="confirmLoading"
      >确定</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
        style="padding:0px;"
      >
        <a-row>
          <a-col :span="24">
            <div>
              <div class="steps-content">
                <!-- 查询区域 -->
                <div class="table-page-search-wrapper">
                  <a-form layout="inline">
                    <a-row :gutter="24">
                      <a-col
                        :md="6"
                        :sm="8"
                      >
                        <a-form-item
                          label="结算类型"
                          class="stepFormText"
                        >
                          <a-select
                            showSearch
                            v-model="queryParam.formType"
                            optionFilterProp="children"
                            placeholder="请选择结算类型"
                            :dropdownMatchSelectWidth="false"
                            @change="handleFormTypeChange"
                          >
                            <a-select-option
                              v-for="(value, key) in formTypeOptions"
                              :key="key"
                              :value="key"
                            >{{ value }}</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col
                        :md="6"
                        :sm="8"
                      >
                        <a-form-item label="结算主体">
                          <select-page
                            :id="'id'"
                            :title="'departName'"
                            placeholder="请选择结算主体查询"
                            v-model="queryParam.settleDomainId"
                            :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                          ></select-page>
                        </a-form-item>
                      </a-col>
                      <a-col
                        :md="6"
                        :sm="8"
                        v-if="formTypeStatusType == 0 || formTypeStatusType == 2"
                      >
                        <a-form-item label="结算月份">
                          <a-month-picker
                            allowClear
                            format="YYYYMM"
                            style="width: 100%"
                            placeholder="请选择结算月份"
                            v-model="queryParam.setlleMonth"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col
                        :md="6"
                        :sm="8"
                        v-if="formTypeStatusType == 3"
                      >
                        <a-form-item label="起始时间">
                          <a-date-picker
                            style="width: 100%"
                            placeholder="请选择起始时间查询"
                            format="YYYY-MM-DD"
                            v-model="queryParam.settleDateStart"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col
                        :md="6"
                        :sm="8"
                        v-if="formTypeStatusType == 3"
                      >
                        <a-form-item label="截止时间">
                          <a-date-picker
                            style="width: 100%"
                            placeholder="请选择截止时间查询"
                            format="YYYY-MM-DD"
                            v-model="queryParam.settleDateEnd"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col
                        :md="6"
                        :sm="8"
                        v-if="formTypeStatusType == 3"
                      >
                        <a-form-item
                          label="审核状态"
                          class="stepFormText"
                        >
                          <a-select
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            placeholder="请选择审核状态查询"
                            v-model="queryParam.auditFlag"
                            :dropdownMatchSelectWidth="false"
                          >
                            <a-select-option
                              v-for="(value, key) in auditFlagOptions"
                              :key="key"
                              :value="key"
                            >{{ value.option }}</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col
                        :md="6"
                        :sm="8"
                      >
                        <span
                          style="float: left;overflow: hidden;"
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
                        </span>
                      </a-col>
                    </a-row>
                  </a-form>
                </div>
                <!--列表-->
                <a-table
                  rowKey="id"
                  size="middle"
                  :bordered="true"
                  :loading="loading"
                  v-if="formTypeStatus"
                  :dataSource="dataSource"
                  :pagination="ipagination"
                  :columns="(formTypeStatus == 2 ? netIncomeColumns : businessColumns)"
                  :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio',getCheckboxProps:getCheckboxProps}"
                  :scroll="{x:1}"
                  @change="handleTableChange"
                >
                  <span
                    slot="action"
                    slot-scope="text, record"
                    v-if="formTypeStatus == 2"
                  >
                    <a-popconfirm
                      v-if="record.matchingStatus==1"
                      title="确定撤销吗?"
                      @confirm="() => handleRelease(record)"
                    >
                      <a>撤销</a>
                    </a-popconfirm>
                    <span v-else>-</span>
                  </span>
                  <span
                    v-else
                    slot="action"
                    slot-scope="text, record"
                  >
                    <a-popconfirm
                      title="确定撤销吗?"
                      v-if="record.matchStatus != 0"
                      @confirm="() => handleRelease(record)"
                    >
                      <a>撤销</a>
                    </a-popconfirm>
                  </span>
                </a-table>
                <div
                  v-else
                  style="font-size: 18px;color: #ff4d4f"
                >请选择“结算类型”进行查询</div>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <match-in-account-of-statement-two-modal
      ref="matchInAccountOfStatementTwoModal"
      @ok="formBackOk"
    ></match-in-account-of-statement-two-modal>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import { filterObj } from '@/utils/util'
  import { getAction, httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import MatchInAccountOfStatementTwoModal from './MatchInAccountOfStatementTwoModal'

  export default {
    name: 'MatchInAccountOfStatementModal',
    components: {
      SelectPage,
      MatchInAccountOfStatementTwoModal,
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
        // 纯收入
        netIncomeColumns: [
          {
            width: 250,
            ellipsis: true,
            align: 'center',
            title: '客户单位',
            dataIndex: 'unitName',
            customRender:(text) => {
              const Str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 250,
            ellipsis: true,
            align: 'center',
            title: '结算主体',
            dataIndex: 'settleDomainName',
            customRender:(text) => {
              const Str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            align: 'center',
            title: '结算金额',
            dataIndex: 'settleDomainMoney',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            align: 'center',
            title: '结算月份',
            dataIndex: 'setlleMonth',
            customRender:(text) => {
              const Str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 150,
            align: 'center',
            title: '匹配状态',
            dataIndex: 'matchingStatus',
            customRender:(text) => {
              const color = this.matchingStatusOptions.hasOwnProperty(text) ? this.matchingStatusOptions[text].color : 'blue'
              const Str = this.matchingStatusOptions.hasOwnProperty(text) ? this.matchingStatusOptions[text].option : '-'
              return <a-tag color={color}>{Str}</a-tag>
            },
          },
          {
            title: '操作',
            key: 'operations',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          },
        ],
        // 为事务性外包
        businessColumns: [
          {
            width: 180,
            ellipsis: true,
            align: 'center',
            title: '客户单位',
            dataIndex: 'customerName',
            customRender:(text) => {
              const Str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            align: 'center',
            title: '结算主体',
            dataIndex: 'departName',
            customRender:(text) => {
              const Str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            align: 'center',
            title: '业务收入',
            dataIndex: 'income',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 60,
            ellipsis: true,
            align: 'center',
            title: '税金',
            dataIndex: 'taxAmount',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 110,
            ellipsis: true,
            align: 'center',
            title: '成本合计数据',
            dataIndex: 'costSum',
            scopedSlots: { customRender: 'sumTax' },
            customRender:(text) => {
              const res = text || 0
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            },
          },
          {
            width: 135,
            ellipsis: true,
            align: 'center',
            title: '结算金额（含税）',
            dataIndex: 'sumSettle',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            align: 'center',
            title: '结算时间',
            dataIndex: 'settleDate',
            customRender:(text) => {
              const Str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 100,
            align: 'center',
            title: '审核状态',
            dataIndex: 'auditFlag',
            customRender:(text) => {
              const color = this.auditFlagOptions.hasOwnProperty(text) ? this.auditFlagOptions[text].color : 'blue'
              const Str = this.auditFlagOptions.hasOwnProperty(text) ? this.auditFlagOptions[text].option : '-'
              return <a-tag color={color}>{Str}</a-tag>
            },
          },
          {
            width: 100,
            align: 'center',
            title: '匹配状态',
            dataIndex: 'matchStatus',
            customRender:(text) => {
              const color = this.matchingStatusOptions.hasOwnProperty(text) ? this.matchingStatusOptions[text].color : 'blue'
              const Str = this.matchingStatusOptions.hasOwnProperty(text) ? this.matchingStatusOptions[text].option : '-'
              return <a-tag color={color}>{Str}</a-tag>
            },
          },
          {
            title: '操作',
            width: 80,
            key: 'operations',
            fixed: 'right',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          },
        ],
        moment,
        model: {},
        title: '操作',
        visible: false,
        formTypeStatus: 0,  // 结算类型是否已经选择【2为纯收入，3为事务性外包】
        formTypeStatusType: 0,  // 选择结算类型
        confirmLoading: false,
        matchingLimit: 0,
        statusOutOptions: {},
        statusIncomeOptions: {},
        recordStatusOptions: {},
        settleDomainOptions: [],  // 所有的结算主体
        form: this.$form.createForm(this),
        formTypeOptions: {'2': '纯收入', '3': '事务性外包'},
        matchingStatusOptions: {'0': {'option': '未匹配', 'color': 'blue'}, '1': {'option': '已匹配', 'color': 'green'}},
        auditFlagOptions: {
          '0': {'option': '待提交', 'color': 'blue'},
          '1': {'option': '审核中', 'color': 'orange'},
          '2': {'option': '审核通过', 'color': 'green'},
          '3': {'option': '审核未通过', 'color': 'red'},
          '5': {'option': '待审核', 'color': 'orange'},
        },
        url: {
          netIncomelist: 'salary/treciverecord/getSettleDomainMatchingVosNetIncome', // 列表【纯收入】
          businesslist: 'hrOneTime/tsettlebill/getNoMatchingBill', // 列表【事务性外包】
          getRecordRelBySettlementId: 'salary/tmatchingclaime/getRecordRelBySettlementId',  // 根绝结算单id查询已匹配的认领记录【纯收入】
          getMatchingClaimIdByBill: 'hrOneTime/tsettlebill/getMatchingClaimIdByBill',  // 根绝结算单id查询已匹配的认领记录【事务性外包】
          moveRecordRelBySettlementId:'salary/tmatchingclaime/removeRecordRelBySettlementId',  // 撤销【纯收入】
          moveUpdateClaimIdById:'hrOneTime/tsettlebill/updateClaimIdById',  // 撤销【事务性外包】
        },
      }
    },
    methods: {
      getCheckboxProps(record){
        let flag = false;
        if(this.formTypeStatusType == 3){ // 事务外包
          flag = (record.auditFlag == 0 || record.auditFlag == 3) ? false : true;
        }
        return {
          props: {
            disabled: flag
          }
        }
      },
      loadData(arg) {
        let url = ''
        //加载数据 若传入参数1则加载第一页的内容
        if (Number(arg) === 1) {
          this.ipagination.current = 1  // 重置第一页
        } else if (Number(arg) === 2) {
          // 默认选项
          this.ipagination.current = 1  // 重置第一页
        }
        var params = this.getQueryParams() //查询条件
        delete params.current
        delete params.size
        if (!params.formType) { // 结算类型
          this.$message.warning('请选择“结算类型”进行查询！')
          return
        } else {
          if (params.formType == 2) { // 纯收入
            this.formTypeStatus = 2
            delete params.settleDateStart
            delete params.settleDateEnd
            delete params.auditFlag
            // 时间格式化
            if (params.setlleMonth) {
              params.setlleMonth = params.setlleMonth.format('YYYYMM')
            }
            url += this.url.netIncomelist
          } else {  // 事务性外包
            this.formTypeStatus = 3
            delete params.setlleMonth
            // 时间格式化
            if (params.settleDateStart) {
              params.settleDateStart = params.settleDateStart.format('YYYY-MM-DD')
            }
            if (params.settleDateEnd) {
              params.settleDateEnd = params.settleDateEnd.format('YYYY-MM-DD')
            }
            url += this.url.businesslist
          }
        }
        this.loading = true // 加载图标
        getAction(url, params).then((res) => {
          if (Number(res.code) === 200) {
            this.dataSource = res.data ? res.data : []
            this.ipagination.total = res.data ? res.data.length : 0
          } else {
            this.$message.error('获取数据失败！')
          }
          this.loading = false
        })
      },
      // 条件查询
      searchQuery() {
        this.selectionRows = []
        this.selectedRowKeys = []
        this.loadData(1)
      },
      // 条件重置
      searchReset() {
        this.selectionRows = []
        this.selectedRowKeys = []
        delete this.queryParam.setlleMonth
        delete this.queryParam.settleDomainId
        delete this.queryParam.settleDateStart
        delete this.queryParam.settleDateEnd
        delete this.queryParam.auditFlag
        this.loadData(1)
      },
      // 点击按钮选中
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectionRows = selectionRows
      },
      //分页、排序、筛选变化时触发
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field
          this.isorter.order = ('ascend' === String(sorter.order)) ? 'asc' : 'desc'
        }
        this.ipagination = pagination
      },
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
        this.$refs.matchInAccountOfStatementTwoModal.title = '认领记录匹配'
        if (this.selectionRows.length > 0) {
          this.$refs.matchInAccountOfStatementTwoModal.settleDomainSelected = this.selectionRows[0] // 选择的结算单
          let httpUrl = ''
          if (Number(this.formTypeStatus) === 2) { // 纯收入
            httpUrl += (`${this.url.getRecordRelBySettlementId}?settlementFormId=${this.selectionRows[0].id}`)
          } else {  // 事务性外包
            // if (String(this.selectionRows[0].auditFlag) !== '0') { // 判断是否是待提交的状态
            //   this.$message.warning('"审核状态"为"待提交"状态才可以匹配！')
            //   return false
            // }
            httpUrl += (`${this.url.getMatchingClaimIdByBill}?id=${this.selectionRows[0].id}`)
          }
          this.confirmLoading = true // 加载图标
          httpAction(httpUrl, null, 'GET').then((res) => {
            if (Number(res.code) === 200) {
              let handleData = null
              if (this.formTypeStatus == 3 && res.data && res.data.length > 0) { // 事务性外包单独处理数据类型
                handleData = []
                for (const item of res.data) {
                  handleData.push({matchId: this.selectionRows[0].id, matchingAmount: item.ontTimeMatchAmount, recordId: item.id})
                }
              }
              this.$refs.matchInAccountOfStatementTwoModal.alreadyMatched = (handleData ? handleData : res.data)  // 已经匹配的认领记录列表
              this.$refs.matchInAccountOfStatementTwoModal.statusOptions = this.recordStatusOptions // 状态
              this.$refs.matchInAccountOfStatementTwoModal.statusOutOptions = this.statusOutOptions // 出账状态
              this.$refs.matchInAccountOfStatementTwoModal.statusIncomeOptions = this.statusIncomeOptions // 收入状态
              this.$refs.matchInAccountOfStatementTwoModal.settleDomainOptions = this.settleDomainOptions // 结算主体
              this.$refs.matchInAccountOfStatementTwoModal.matchingLimit = this.matchingLimit // 出账限额
              this.$refs.matchInAccountOfStatementTwoModal.formTypeStatus = this.formTypeStatus // 结算类型是否已经选择【2为纯收入，3为事务性外包】
              this.$refs.matchInAccountOfStatementTwoModal.formTypeOptions = this.formTypeOptions // 结算单类型【纯收入，事务性外包】
              this.$refs.matchInAccountOfStatementTwoModal.add()
              this.$refs.matchInAccountOfStatementTwoModal.loadData(1)
            } else {
              this.$message.warning(res.msg || res.message)
            }
          }).finally(() => {
            this.confirmLoading = false
          })
        } else {
          this.$message.warning('请选择一张结算单！')
        }
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
        this.queryParam = {}
        this.dataSource = []
        this.selectionRows = []
        this.selectedRowKeys = []
        this.confirmLoading = false
        this.matchingLimit = 0
        this.formTypeStatus = 0  // 结算类型是否已经选择【2为纯收入，3为事务性外包】
        this.formTypeStatusType = 0  // 选择结算类型
        this.statusOutOptions = {}
        this.statusIncomeOptions = {}
        this.recordStatusOptions = {}
        this.settleDomainOptions = []  // 所有的结算主体
      },
      // 新建弹框关闭
      formBackOk() {
        this.$emit('ok')
        this.close()
      },
      // 撤销
      handleRelease(record) {
        const that = this
        if (Number(record.matchingStatus) === 1 && Number(this.formTypeStatus) === 2) { // 纯收入
          that.confirmLoading = true // 加载图标
          httpAction(`${this.url.moveRecordRelBySettlementId}?settlementFormId=${record.id}`, {}, 'GET').then((res) => {
            if (Number(res.code) === 200) {
              this.$message.success("撤销成功")
              this.loadData(1)
              this.$emit("ok")
            } else {
              this.$message.warning(res.msg || res.message)
            }
          }).finally(() => {
            that.confirmLoading = false
          })
        }
        if (Number(record.matchStatus) === 1 && Number(this.formTypeStatus) === 3) { // 事务性外包
          if(record.auditFlag !== '0' && record.auditFlag !== '3'){
            this.$message.warning('审核不通过后，才允许撤销！');
            return false;
          }
          that.confirmLoading = true // 加载图标
          httpAction(`${this.url.getMatchingClaimIdByBill}?id=${record.id}`, null, 'GET').then((res) => {
            if (Number(res.code) === 200) {
              let idStr = ''
              let reqUrl = ''
              reqUrl += (`${this.url.moveUpdateClaimIdById}?ids=${record.id}&type=2`)
              for (let item of res.data) {
                idStr += `${item.id},`
              }
              reqUrl += (`&removeFlag=1&claimIds=${idStr.substring(0, idStr.length - 1)}`)
              httpAction(reqUrl, {}, 'PUT').then((res) => {
                if (Number(res.code) === 200) {
                  this.$message.success("撤销成功")
                  this.loadData(1)
                  this.$emit("ok")
                } else {
                  this.$message.warning(res.msg || res.message)
                }
              }).finally(() => {
                that.confirmLoading = false
              })
            } else {
              this.$message.warning(res.msg || res.message)
              this.confirmLoading = false
            }
          })
        }
      },
      // 结算类型修改
      handleFormTypeChange(value) {
        this.formTypeStatusType = value
      },
      /******************************************* 验证规则 *******************************************/
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
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
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}
</style>
