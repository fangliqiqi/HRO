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
        v-if="addButton"
        key="handleOk"
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >确定关联</a-button>
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
                        <a-form-item label="结算月份">
                          <a-month-picker
                            allowClear
                            :format="dateFormat"
                            style="width: 100%"
                            placeholder="请选择结算月份"
                            v-model="queryParam.setlleMonth"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col
                        :md="8"
                        :sm="12"
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
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="ipagination"
                  :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, getCheckboxProps: getCheckboxProps}"
                  @change="handleTableChange"
                >
                  <span
                    slot="action"
                    slot-scope="text, record"
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
                </a-table>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { filterObj } from '@/utils/util'
  import { getAction, httpAction } from '@/api/manage'

  export default {
    name: 'MatchInAccountOfNetIncomeModal',
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
            width: 80,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          },
        ],
        model: {},
        title: '操作',
        visible: false,
        addButton: true, // 添加按钮
        confirmLoading: false,
        form: this.$form.createForm(this),
        isAddData: [],  // 选中数据
        isAddDataKeys: [],  // 选中数据keys
        dateFormat: "YYYYMM",  // 时间格式化
        matchingStatusOptions: {'0': {'option': '未匹配', 'color': 'blue'}, '1': {'option': '已匹配', 'color': 'green'}},
        url: {
          add: 'salary/tmatchingclaime/batchSave',
          list: 'salary/treciverecord/getSettleDomainMatchingVosNetIncome', // 列表
          moveRecordRelBySettlementId:'salary/tmatchingclaime/removeRecordRelBySettlementId',  // 撤销【纯收入】
        },
      }
    },

    methods: {
      loadData(arg) {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性！')
          return
        }
        // 加载数据 若传入参数1则加载第一页的内容
        if (Number(arg) === 1) {
          //  数据初始化
          this.isAddData = []
          this.isAddDataKeys = []
          this.selectionRows = []
          this.selectedRowKeys = []
          this.ipagination.current = 1  // 重置第一页
        }
        // 查询条件
        var params = this.getQueryParams()
        params.settleDomainId = this.model.settleDomainId // 结算主体
        if (params.setlleMonth) {
          params.setlleMonth = params.setlleMonth.format(this.dateFormat)
        }
        // 删除不必要的字段
        delete params.current
        delete params.size
        this.loading = true // 加载图标
        getAction(this.url.list, params).then((res) => {
          if (Number(res.code) === 200) {
            this.dataSource = res.data ? res.data : []
            this.ipagination.total = res.data ? res.data.length : 0
            if (arg === 1) {  // 初始化时候
              for (const item of res.data) {
                if (Number(item.matchingStatus) === 1) {  // 选中
                  this.isAddData.push(item) // 数据
                  this.isAddDataKeys.push(item.id) // 字段id
                  this.selectionRows.push(item) // 数据
                  this.selectedRowKeys.push(item.id)  // 字段id
                }
              }
            }
          } else {
            this.$message.error('获取数据失败！')
          }
          this.loading = false
        })
      },
      // 条件查询
      searchQuery() {
        this.loadData(1)
      },
      // 条件重置
      searchReset() {
        this.queryParam = {}
        this.loadData(1)
      },
      // 点击按钮选中
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectionRows = selectionRows
      },
      // 分页、排序、筛选变化时触发
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field
          this.isorter.order = ('ascend' === String(sorter.order)) ? 'asc' : 'desc'
        }
        this.ipagination = pagination
      },
      // 禁用行
      getCheckboxProps: record => ({
        props: {
          disabled: record.matchingStatus == 1 ? true : false,
          name: record.id,
        },
      }),
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
        let httpurl = ''
        httpurl += this.url.add
        const method = 'POST'
        const returnData = this.formData()
        if (returnData.length === 0) {
          that.$message.warning('请至少选择一张结算单！')
        } else {
          let sumSettle = 0 // 结算单总额
          let matchData = []  // 数据列表
          for (const item of returnData) {
            if (String(item.removeFlag) === 'false') {
              for (const data of this.dataSource) {
                if (String(item.id) === String(data.id)) { // 已找到
                  sumSettle += data.settleDomainMoney
                  matchData.push({
                    matchId: item.id,
                    type: 5,
                    recordId: that.model.id,
                    matchingAmount: data.settleDomainMoney,
                    flag: 0,
                  })
                  break
                }
              }
            }
          }
          if (this.model.reciveFeeBalance < this.formatFloat(sumSettle)) {
            that.$message.warning('选择的结算单结算金额总额过大！')
            return false
          }
          that.confirmLoading = true
          httpAction(httpurl, {matchingClaimeList: JSON.stringify(matchData)}, method).then((res) => {
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
      },
      // 表单数据处理
      formData() {
        // 请求数据
        const reqFormData = []
        // 选中与之前对比（找出新增的）
        for (const selectedRowKey of this.selectedRowKeys) {
          if (JSON.stringify(this.isAddDataKeys).indexOf(JSON.stringify(selectedRowKey)) == -1) { // 未找到（增加）
            reqFormData.push({
              'id': selectedRowKey,
              'removeFlag': 'false',
            })
          }
        }
        // 之前与选中对比（找出删除的）
        for (const isAddDataKey of this.isAddDataKeys) {
          if (JSON.stringify(this.selectedRowKeys).indexOf(JSON.stringify(isAddDataKey)) == -1) { // 未找到（删除）
            reqFormData.push({
              'id': isAddDataKey,
              'removeFlag': 'true',
            })
          }
        }
        return reqFormData
      },
      // 撤销
      handleRelease(record) {
        const that = this
        if (String(record.matchingStatus) === '1') { // 纯收入
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
        this.queryParam = {}
        this.dataSource = []
        this.isAddData = []
        this.isAddDataKeys = []
        this.selectionRows = []
        this.selectedRowKeys = []
      },
      // 精度处理
      formatFloat(f, digit = 2) {
        const m = Math.pow(10, digit)
        return Math.round(f * m) / m
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

.range-picker-new-style {
  :global(.ant-calendar-range-picker-input) {
    font-size: 13px;
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
