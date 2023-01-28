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
                        <a-form-item label="客户单位">
                          <select-page
                            :id="'id'"
                            :allowClear="true"
                            :title="'customerName'"
                            :style="{minWidth: '150px'}"
                            placeholder="请选择单位名称"
                            v-model="queryParam.unitId"
                            :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                          ></select-page>
                        </a-form-item>
                      </a-col>
                      <a-col
                        :md="6"
                        :sm="8"
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
                  :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
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
                    <a-divider
                      v-if="record.matchingStatus==1"
                      type="vertical"
                    />
                    <a @click="showBill(record)">查看结算单</a>
                  </span>
                </a-table>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <match-out-account-two-modal
      ref="matchOutAccountTwoModal"
      @ok="formBackOk"
    ></match-out-account-two-modal>
    <settle-bill-modal
      ref="SettleBillModalForm"
      @ok="formBackOk"
    ></settle-bill-modal>

  </a-modal>
</template>

<script>
  import moment from 'moment'
  import { filterObj } from '@/utils/util'
  import { getAction, httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import MatchOutAccountTwoModal from './MatchOutAccountTwoModal'
  import SettleBillModal from './SettleBillModal'

  export default {
    name: 'MatchOutAccountModal',
    components: {
      SelectPage,
      MatchOutAccountTwoModal,
      SettleBillModal
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
          const sqp = {}
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
            width: 200,
            ellipsis: true,
            align: 'center',
            title: '客户单位',
            dataIndex: 'unitName',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            align: 'center',
            title: '结算金额',
            dataIndex: 'settleDomainMoney',
            customRender:(text) => {
              const money = text.toLocaleString()
              return <a-tooltip placement="topLeft" title={money}>{money}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            align: 'center',
            title: '结算月份',
            dataIndex: 'setlleMonth',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            align: 'center',
            title: '表单类型',
            dataIndex: 'formType',
            customRender:(text) => {
              const type = this.formTypeOptions[text]
              return <a-tooltip placement="topLeft" title={type}>{type}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            align: 'center',
            title: '匹配状态',
            dataIndex: 'matchingStatus',
            customRender:(text) => {
              const obj = this.matchingStatusOption[text]
              return <a-tag color={obj.color}>{obj.option}</a-tag>
            }
          },
          {
            title: '操作',
            key: 'operations',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          },
        ],
        moment,
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        matchingLimit: 0,
        statusOutOptions: {},
        statusIncomeOptions: {},
        recordStatusOptions: {},
        frameSearchStyleWidth: 'width: 182px', /* 输入框自定义宽度 */
        settleDomainItems: [],  // 结算主体数组
        settleDomainOptions: [],  // 所有的结算主体
        form: this.$form.createForm(this),
        formTypeOptions: {'0': '普通工资', '1': '工程工资', '2': '商险','3':'社保核准表','4':'公积金核准表','5':'纯收入','6':'预估结算单'},
        statusOptions: {'0': {'option': '未出账', 'color': 'blue'}, '1': {'option': '部分出账', 'color': 'pink'}, '2': {'option': '全部出账', 'color': 'green'}},
        matchingStatusOption: {'0': {'option': '未匹配', 'color': 'blue'}, '1': {'option': '已匹配', 'color': 'green'}},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        url: {
          list: 'salary/treciverecord/getSettleDomainMatchingVosForTForecast', // 列表
          getRecordRelBySettlementId: 'salary/tmatchingclaime/getRecordRelBySettlementId',  // 根绝结算单id查询已匹配的认领记录
          moveRecordRelBySettlementId:'salary/tmatchingclaime/removeRecordRelBySettlementId'
        },
      }
    },
    methods: {
      loadData(arg) {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性！')
          return false
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1  // 重置第一页
        }

        var params = this.getQueryParams() //查询条件
        delete params.current
        delete params.size
        if (params.setlleMonth) {
          params.setlleMonth = params.setlleMonth.format('YYYYMM')
        }
        this.loading = true // 加载图标
        getAction(this.url.list, params).then((res) => {
          if (Number(res.code) === 200) {
            this.dataSource = res.data ? res.data : []
            this.ipagination.total = res.data ? res.data.length : 0
            //this.getFrameStyleWidth() // 加载更新宽度
          } else {
            this.$message.error('获取数据失败！')
          }

          this.loading = false
        })
        return true
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
      //分页、排序、筛选变化时触发
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field
          this.isorter.order = ('ascend' === sorter.order) ? 'asc' : 'desc'
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
      // 查看结算单
      showBill(record){
        httpAction(`/hrSocial/tforecastform/getAllInfoById/${record.id}`,null,'get').then(res=>{
          if(Number(res.code) === 200){
            this.$refs.SettleBillModalForm.show(res.data)
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      // 保存按钮
      handleOk() {
        this.$refs.matchOutAccountTwoModal.title = '认领记录匹配'
        if (this.selectionRows.length > 0) {
          this.confirmLoading = true // 加载图标
          this.$refs.matchOutAccountTwoModal.settleDomainSelected = this.selectionRows[0]
          this.$refs.matchOutAccountTwoModal.settleDomainSelected.reciveType = 4
          const httpUrl = `${this.url.getRecordRelBySettlementId}?type=6&settlementFormId=${this.selectionRows[0].id}`
          httpAction(httpUrl, null, 'GET').then((res) => {
            if (res.code === 200) {
              this.$refs.matchOutAccountTwoModal.alreadyMatched = res.data
              this.$refs.matchOutAccountTwoModal.statusOptions = this.recordStatusOptions
              this.$refs.matchOutAccountTwoModal.statusOutOptions = this.statusOutOptions
              this.$refs.matchOutAccountTwoModal.statusIncomeOptions = this.statusIncomeOptions
              this.$refs.matchOutAccountTwoModal.settleDomainOptions = this.settleDomainOptions
              this.$refs.matchOutAccountTwoModal.matchingLimit = this.matchingLimit
              this.$refs.matchOutAccountTwoModal.formTypeOptions = this.formTypeOptions
              this.$refs.matchOutAccountTwoModal.url.list = 'salary/treciverecord/pageOfMatching?reciveType=4'
              this.$refs.matchOutAccountTwoModal.add(1)
              this.$refs.matchOutAccountTwoModal.loadData(1)
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
        this.confirmLoading = false
        this.settleDomainItems = []  // 结算主体数组
        this.queryParam = {}
        this.dataSource = []
        this.selectedRowKeys = []
        this.selectionRows = []
        this.loading = false
        this.statusOutOptions = {}
        this.statusIncomeOptions = {}
        this.recordStatusOptions = {}
        this.settleDomainOptions = []  // 所有的结算主体
        this.matchingLimit = 0
      },
      // 新建弹框关闭
      formBackOk() {
        this.$emit('ok')
        this.close()
      },
      // 隐藏列样式
      handleColumnStyle(width) {
        if (width) {
          return `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: ${width}px;`
        }
        return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
      },
      // 撤销
      handleRelease(record){
        const that = this
        if(String(record.matchingStatus) === '1'){
          that.confirmLoading = true // 加载图标
          httpAction(`${this.url.moveRecordRelBySettlementId}?settlementFormId=${record.id}`, {}, 'GET').then((res) => {
            if(Number(res.code) === 200){
              this.$message.success("撤销成功")
              this.loadData(1)
              this.$emit("ok")
            }else {
              this.$message.warning(res.msg || res.message)
            }
          }).finally(() => {
            that.confirmLoading = false
          })
        }
      },
      // 获取相关宽度
      getFrameStyleWidth() {
        // 检索输入框宽度
        if (this.$refs.frameInputWidth) {
          this.frameSearchStyleWidth = `width: ${(this.$refs.frameInputWidth.$el.clientWidth - 0)}px`
        }
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
