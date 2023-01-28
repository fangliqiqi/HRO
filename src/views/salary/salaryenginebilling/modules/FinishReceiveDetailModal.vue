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
                        <a-form-item label="认领状态">
                          <a-select
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            placeholder="请选择认领状态"
                            v-model="queryParam.status"
                          >
                            <a-select-option
                              v-for="(value, key) in statusOptions"
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
                        <a-form-item label="款项用途">
                          <a-select
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            placeholder="请选择款项用途"
                            v-model="queryParam.reciveUse"
                          >
                            <a-select-option
                              v-for="(value, key) in reciveUseOptions"
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
                  @change="handleTableChange"
                >
                  <!-- 状态 -->
                  <span
                    slot="statusSlot"
                    slot-scope="text, record"
                  >
                    <template v-for="(status, key) in statusOptions">
                      <a-tag
                        :key="key"
                        v-if="record.status == key"
                        :color="status.color"
                      >{{ status.option }}</a-tag>
                    </template>
                  </span>
                  <span
                    slot="statusOutSlot"
                    slot-scope="text, record"
                  >
                    <template v-for="(status, key) in statusOutOptions">
                      <a-tag
                        :key="key"
                        v-if="record.statusOut == key"
                        :color="status.color"
                      >{{ status.option }}</a-tag>
                    </template>
                  </span>
                  <span
                    slot="statusIncomeSlot"
                    slot-scope="text, record"
                  >
                    <template v-for="(status, key) in statusIncomeOptions">
                      <a-tag
                        :key="key"
                        v-if="record.statusIncome == key"
                        :color="status.color"
                      >{{ status.option }}</a-tag>
                    </template>
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
  import { getAction } from '@/api/manage'

  export default {
    name: 'FinishReceiveDetailModal',
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
            this.loadData()
          },
          showQuickJumper: true,
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
            align: 'center',
            title: '认领时间',
            dataIndex: 'reciveDate',
            customRender: (text) => {
              return text ? text : '-'
            },
          },
          {
            align: 'center',
            title: '认领金额',
            dataIndex: 'reciveFee',
            customRender: (text) => {
              return text ? text : '-'
            },
          },
          {
            align: 'center',
            title: '款项用途',
            dataIndex: 'reciveUse',
            customRender: (text) => {
              return this.reciveUseOptions[text]
            },
          },
          {
            align: 'center',
            title: '结算主体',
            dataIndex: 'settleDomainId',
            customRender: (text) => {
              if (Object.keys(this.settleDomainBelongs).length) {
                return (this.settleDomainBelongs).hasOwnProperty(text) ? this.settleDomainBelongs[text]['departName'] : '-'
              } else {
                return '-'
              }
            },
          },
          {
            align: 'center',
            title: '认领状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'statusSlot' },
          },
          {
            align: 'center',
            title: '出账状态',
            dataIndex: 'statusOut',
            scopedSlots: { customRender: 'statusOutSlot' },
          },
          {
            align: 'center',
            title: '收入状态',
            dataIndex: 'statusIncome',
            scopedSlots: { customRender: 'statusIncomeSlot' },
          },
        ],
        model: {},
        title: '操作',
        visible: false,
        addButton: true, // 添加按钮
        confirmLoading: false,
        form: this.$form.createForm(this),
        settleDomainBelongs: [],  // 结算主体
        statusOptions: {'0': {'option': '正常', 'color': 'green'}, '1': {'option': '撤销', 'color': 'red'}},
        statusOutOptions: {'0': {'option': '未出账', 'color': 'blue'}, '1': {'option': '已出账', 'color': 'pink'}},
        statusIncomeOptions: {'0': {'option': '未收入', 'color': 'blue'}, '1': {'option': '已收入', 'color': 'pink'}},
        reciveUseOptions: {'0': '款项认领', '1': '垫付还款'},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        url: {
          list: 'salary/treciverecord/inner/getReciveRecordBySettleId', // 列表
        },
      }
    },

    methods: {
      loadData(arg) {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性！')
          return false
        }
        const reqUrl = `${this.url.list}?settleId=${this.model.id}`
        //加载数据 若传入参数1则加载第一页的内容
        if (Number(arg) === 1) {
          this.ipagination.current = 1  // 重置第一页
        }
        var params = this.getQueryParams()//查询条件
        this.loading = true
        getAction(reqUrl, params).then((res) => {
          if (Number(res.code) === 200) {
            var listPath = this.$route.path
            var pathArr = listPath.split('/')
            this.dataSource = res.data
            if (String(pathArr[1]) === 'dispose') {
              for (let item in this.dataSource) {
                if (Number(this.dataSource[item].effectiveFlag) === 1) {
                  this.dataSource[item].effectiveFlagText = '有效'
                } else {
                  this.dataSource[item].effectiveFlagText = '无效'
                }
              }
            }
            this.ipagination.total = res.data.total
            this.loading = false
          }
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

      //分页、排序、筛选变化时触发
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field
          this.isorter.order = 'ascend' === String(sorter.order) ? 'asc' : 'desc'
        }
        this.ipagination = pagination
        this.loadData()
      },

      add() {
        this.edit({})
      },

      edit(settleId) {
        console.log(this.settleDomainBelongs)
        this.form.resetFields()
        this.model.id = settleId
        this.visible = true
      },

      // 关闭功能
      handleCancel() {
        this.close()
      },
      
      // 表单关闭与数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.addButton = true // 添加按钮
        this.confirmLoading = false
        this.settleDomainBelongs = []  // 结算主体
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
