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
                        <a-form-item
                          label="认领状态"
                          class="searchStepFormText"
                        >
                          <a-select
                            allowClear
                            showSearch
                            placeholder="请选择认领状态"
                            optionFilterProp="children"
                            v-model="queryParam.status"
                            :dropdownMatchSelectWidth="false"
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
                        <a-form-item
                          label="款项用途"
                          class="searchStepFormText"
                        >
                          <a-select
                            allowClear
                            showSearch
                            placeholder="请选择款项用途"
                            optionFilterProp="children"
                            v-model="queryParam.reciveUse"
                            :dropdownMatchSelectWidth="false"
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
                  :pagination="ipagination"
                  @change="handleTableChange"
                >
                  <!-- 列缩放隐藏模板 -->
                  <template
                    v-for="(defineColumn, key) in defineColumns"
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
                      <!-- 标签数据 -->
                      <template
                        v-else-if="defineColumn.type=='tag'"
                        v-for="(item, tagKey) in defineColumn.options"
                      >
                        <a-tag
                          :key="tagKey"
                          v-if="record[key] == tagKey"
                          :color="item.color"
                        >{{ item.option }}</a-tag>
                      </template>
                      <!-- 取出定义数据数据 -->
                      <template
                        v-else-if="defineColumn.type=='define'"
                        v-for="(item, defineKey) in defineColumn.options"
                      >
                        <span
                          :key="defineKey"
                          v-if="record[key] == defineKey"
                        >
                          <a-tooltip :title="item">
                            {{ item }}
                          </a-tooltip>
                        </span>
                      </template>
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

                  <!-- 认领金额 -->
                  <span
                    slot="reciveFee"
                    slot-scope="text"
                  >
                    <a-tooltip
                      placement="topLeft"
                      :title="text.toLocaleString()"
                    >
                      {{ text.toLocaleString() }}
                    </a-tooltip>
                  </span>

                  <!-- 可匹配金额 -->
                  <span
                    slot="reciveFeeBalance"
                    slot-scope="text, record"
                  >
                    <a-tooltip
                      placement="topLeft"
                      :title="record.reciveUse==0 ? text.toLocaleString() : '-'"
                    >
                      {{ record.reciveUse==0 ? text.toLocaleString() : '-' }}
                    </a-tooltip>
                  </span>

                  <!-- 出账状态 -->
                  <span
                    slot="statusOut"
                    slot-scope="text, record"
                  >
                    <template v-if="record.reciveUse==0 && (record.reciveType==1 || record.reciveType==4)">
                      <a-tag :color="statusOutOptions[text].color">{{ statusOutOptions[text].option }}</a-tag>
                    </template>
                    <span v-else>-</span>
                  </span>

                  <!-- 收入状态 -->
                  <span
                    slot="statusIncome"
                    slot-scope="text, record"
                  >
                    <template v-if="record.reciveUse==0 && (record.reciveType==2 || record.reciveType==3)">
                      <a-tag :color="statusIncomeOptions[text].color">{{ statusIncomeOptions[text].option }}</a-tag>
                    </template>
                    <span v-else>-</span>
                  </span>

                  <!-- 款项类型 -->
                  <span
                    slot="reciveType"
                    slot-scope="text, record"
                  >
                    <a-tooltip
                      placement="topLeft"
                      :title="record.reciveUse==0 ? reciveTypeOptions[text] : '-'"
                    >
                      {{ record.reciveUse==0 ? reciveTypeOptions[text] : '-' }}
                    </a-tooltip>
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
            width: 150,
            ellipsis: true,
            align: 'center',
            title: '认领时间',
            dataIndex: 'reciveDate',
            scopedSlots: { customRender: 'reciveDate' },
          },
          {
            width: 80,
            ellipsis: true,
            align: 'center',
            title: '认领金额',
            dataIndex: 'reciveFee',
            scopedSlots: { customRender: 'reciveFee' },
          },
          {
            width: 90,
            ellipsis: true,
            title: '可匹配金额',
            align: 'center',
            dataIndex: 'reciveFeeBalance',
            scopedSlots: { customRender: 'reciveFeeBalance' },
          },
          {
            width: 80,
            ellipsis: true,
            align: 'center',
            title: '款项用途',
            dataIndex: 'reciveUse',
            scopedSlots: { customRender: 'reciveUse' },
          },
          {
            width: 90,
            ellipsis: true,
            title: '款项类型',
            align: 'center',
            dataIndex: 'reciveType',
            scopedSlots: { customRender: 'reciveType' },
          },
          {
            align: 'center',
            title: '结算主体',
            dataIndex: 'settleDomainId',
            scopedSlots: { customRender: 'settleDomainId' },
          },
          {
            title: '客户单位',
            align: 'center',
            dataIndex: 'unitId',
            customRender:(text,record) => {
              const name = this.getCustomerName(record.settleDomainId) || '-'
              return <a-tooltip placement="topLeft" title={name}>{name}</a-tooltip>
            },
          },
          {
            width: 60,
            ellipsis: true,
            title: '认领人',
            align: 'center',
            dataIndex: 'reciveUser',
            customRender:(text) => {
              const str = this.employData.hasOwnProperty(text) ? this.employData[text] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 70,
            ellipsis: true,
            align: 'center',
            title: '认领状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            width: 80,
            ellipsis: true,
            align: 'center',
            title: '出账状态',
            dataIndex: 'statusOut',
            scopedSlots: { customRender: 'statusOut' },
          },
          {
            width: 80,
            ellipsis: true,
            align: 'center',
            title: '收入状态',
            dataIndex: 'statusIncome',
            scopedSlots: { customRender: 'statusIncome' },
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
        statusOutOptions: {'0': {'option': '未出账', 'color': 'blue'}, '1': {'option': '部分出账', 'color': 'pink'}, '2': {'option': '全部出账', 'color': 'green'}},
        statusIncomeOptions: {'0': {'option': '未收入', 'color': 'blue'}, '1': {'option': '部分收入', 'color': 'pink'}, '2': {'option': '全部收入', 'color': 'green'}},
        reciveUseOptions: {'0': '款项认领', '1': '垫付还款', '2': '商险预估还款'},
        reciveTypeOptions: {'1': '薪资及其他', '2': '纯收入', '3': '事务性外包','4':'预估结算单','5':'财务账单'}, // 款项类型
        defineColumns: {reciveDate: {width: 130}, reciveUse: {width: 90, type: 'define', options: []}, settleDomainId: {key: 'settleDomainId', width: 140, type: 'settle', options: [], name: 'departName'}, status: {width: 80, type: 'tag', options: []}},  // 隐藏列字段数组
        url: {
          list: 'salary/treciverecord/page', // 列表
        },
        employData:{}
      }
    },

    methods: {
      getCustomerName(id){
        return this.settleDomainBelongs[id] ? this.settleDomainBelongs[id]['customerName'] : ''
      },
      loadData(arg) {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性！')
          return
        }
        const reqUrl = `${this.url.list}?reciveId=${this.model.id}`
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
            this.dataSource = res.data.records
            if (String(pathArr[1]) === 'dispose') {
              for (const item in this.dataSource) {
                if (String(this.dataSource[item].effectiveFlag) === '1') {
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
      edit(record,employData) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.employData = employData
        this.visible = true
        // 赋值标签数据
        this.defineColumns.settleDomainId.options = this.settleDomainBelongs
        this.defineColumns.reciveUse.options = this.reciveUseOptions
        this.defineColumns.status.options = this.statusOptions
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
        this.dataSource = []
        this.queryParam = {}
        this.confirmLoading = false
        this.settleDomainBelongs = []  // 结算主体
      },
      // 隐藏列样式
      handleColumnStyle(width) {
        if (width) {
          return `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: ${width}px;`
        }
        return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
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
.searchStepFormText {
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
