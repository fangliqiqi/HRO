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
                        <a-form-item label="起始时间">
                          <a-date-picker
                            style="width: 100%"
                            placeholder="请选择起始时间查询"
                            :format="dateFormat"
                            v-model="queryParam.settleDateStart"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col
                        :md="6"
                        :sm="8"
                      >
                        <a-form-item label="截止时间">
                          <a-date-picker
                            style="width: 100%"
                            placeholder="请选择截止时间查询"
                            :format="dateFormat"
                            v-model="queryParam.settleDateEnd"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col
                        :md="6"
                        :sm="8"
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
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="ipagination"
                  :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps:getCheckboxProps}"
                  @change="handleTableChange"
                >
                  <span
                    slot="action"
                    slot-scope="text, record"
                  >
                    <a-popconfirm
                      title="确定撤销吗?"
                      v-if="record.claimId"
                      @confirm="() => handleRelease(record)"
                    >
                      <a>撤销</a>
                    </a-popconfirm>
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
    name: 'MatchInAccountModal',
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
            width: 100,
            ellipsis: true,
            align: 'center',
            title: '业务收入',
            dataIndex: 'income',
            customRender:(text) => {
              const Str = text.toLocaleString()
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            align: 'center',
            title: '税金',
            dataIndex: 'taxAmount',
            customRender:(text) => {
              const Str = text ? text : 0
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            align: 'center',
            title: '成本合计数据',
            dataIndex: 'costSum',
            customRender:(text) => {
              const Str = text ? text : 0
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            align: 'center',
            title: '结算金额（含税）',
            dataIndex: 'sumSettle',
            customRender:(text) => {
              const Str = text.toLocaleString()
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 140,
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
            width: 80,
            ellipsis: true,
            align: 'center',
            title: '匹配状态',
            dataIndex: 'claimId',
            customRender:(text, record) => {
              const Str = !record.claimId ? '未匹配' : '已匹配'
              const color = !record.claimId ? 'blue' : 'green'
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
        dateFormat: "YYYY-MM-DD",  // 时间格式化
        auditFlagOptions: {
          '0': {'option': '待提交', 'color': 'blue'},
          '1': {'option': '审核中', 'color': 'orange'},
          '2': {'option': '审核通过', 'color': 'green'},
          '3': {'option': '审核未通过', 'color': 'red'},
          '5': {'option': '待审核', 'color': 'orange'},
        },
        url: {
          add: 'hrOneTime/tsettlebill/updateClaimIdById',
          list: 'hrOneTime/tsettlebill/getBillByDomainId', // 列表
          moveUpdateClaimIdById:'hrOneTime/tsettlebill/updateClaimIdById',  // 撤销【事务性外包】
          getMatchingClaimIdByBill: 'hrOneTime/tsettlebill/getMatchingClaimIdByBill',  // 根绝结算单id查询已匹配的认领记录【事务性外包】
        },
      }
    },
    methods: {
      loadData(arg) {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性！')
          return false
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
        params.claimId = this.model.id // 记录id
        if (params.settleDateStart) {
          params.settleDateStart = params.settleDateStart.format(this.dateFormat)
        }
        if (params.settleDateEnd) {
          params.settleDateEnd = params.settleDateEnd.format(this.dateFormat)
        }
        // 删除不必要的字段
        delete params.current
        delete params.size
        this.loading = true // 加载图标
        getAction(this.url.list, params).then((res) => {
          if (Number(res.code) === 200) {
            this.dataSource = res.data ? res.data : []
            this.ipagination.total = res.data ? res.data.length : 0
            if (Number(arg) === 1) {  // 初始化时候
              for (const item of res.data) {
                if (item.claimId) {  // 选中
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
          disabled: record.claimId ? true : false,
          name: record.claimId,
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
        const method = 'PUT'
        const returnData = this.formData()
        if (returnData.length === 0) {
          that.$message.warning('请至少选择一张结算单！')
        } else {
          let sumSettle = 0 // 结算单总额
          let ids = ''
          for (const item of returnData) {
            if (String(item.removeFlag) === 'false') {
              for (const data of this.dataSource) {
                if (String(item.id) === String(data.id)) { // 已找到
                  sumSettle += data.sumSettle
                  ids += (`${item.id},`)
                  break
                }
              }
            }
          }
          if (this.model.reciveFeeBalance < this.formatFloat(sumSettle)) {
            that.$message.warning('选择的结算单结算金额总额过大！')
            return false
          }
          ids = ids ? ids.substring(0, ids.length - 1) : ''
          httpurl += (`?claimIds=${this.model.id}&type=1`) // 认领记录id, 1一个认领记录对应多个结算单。2 多个认领记录对应一个结算单
          httpurl += (`&removeFlag=0&ids=${ids}`) // 移除标识(0:匹配 1:移除)
          that.confirmLoading = true
          httpAction(httpurl, {}, method).then((res) => {
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
          if (JSON.stringify(this.isAddDataKeys).indexOf(JSON.stringify(selectedRowKey)) === -1) { // 未找到（增加）
            reqFormData.push({
              'id': selectedRowKey,
              'removeFlag': 'false',
            })
          }
        }
        // 之前与选中对比（找出删除的）
        for (const isAddDataKey of this.isAddDataKeys) {
          if (JSON.stringify(this.selectedRowKeys).indexOf(JSON.stringify(isAddDataKey)) === -1) { // 未找到（删除）
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
        if (record.claimId) { // 事务性外包
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
              for (const item of res.data) {
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
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
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
