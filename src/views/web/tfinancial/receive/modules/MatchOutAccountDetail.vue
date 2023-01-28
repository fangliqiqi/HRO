<template>
  <a-modal
    :title="title"
    :width="1200"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >

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
                <!--列表-->
                <a-table
                  rowKey="id"
                  size="middle"
                  :bordered="true"
                  :loading="loading"
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="ipagination"
                >
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
    name: 'MatchOutAccountAgain',
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
            title: '客户单位',
            align:"center",
            dataIndex: 'unitName',
            width:200,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: '结算主体',
            align:"center",
            dataIndex: 'settleDomainName',
            width:200,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: '结算金额',
            align:"center",
            dataIndex: 'settleDomainMoney',
            width:100,
            ellipsis: true,
            customRender:(text)=>{
              const money = text.toLocaleString()
              return <a-tooltip
                placement="topLeft"
                title={money}
              >{money}</a-tooltip>
            }
          },
          {
            title: '结算月份',
            align:"center",
            dataIndex: 'setlleMonth',
            width:100,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: '表单类型',
            align:"center",
            dataIndex: 'formType',
            width:150,
            ellipsis: true,
            customRender:(text)=>{
              const type = this.formTypeOptions[text]
              return <a-tooltip
                placement="topLeft"
                title={type}
              >{type}</a-tooltip>
            }
          },
          {
            title: '匹配状态',
            align:"center",
            dataIndex: 'matchingStatus',
            width:120,
            ellipsis: true,
            customRender:(text)=>{
              const status = this.matchingStatusOptions[text]
              return <a-tag color={status.color}>{status.option}</a-tag>
            }
          },
          {
            title: '匹配金额',
            align:"center",
            dataIndex: 'matchingAmount',
            width:150,
            ellipsis: true,
            customRender:(text)=>{
              const money = text.toLocaleString()
              return <a-tooltip
                placement="topLeft"
                title={money}
              >{money}</a-tooltip>
            }
          }
        ],
        model: {},
        title: '匹配出账明细',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        formTypeOptions: {'0': '普通工资', '1': '工程工资', '2': '商险','3':'社保核准表','4':'公积金核准表','5':'纯收入','6':'预估结算单'},
        matchingStatusOptions: {'0': {'option': '未匹配', 'color': 'blue'}, '1': {'option': '已匹配', 'color': 'green'}},
        url: {
          list: 'salary/treciverecord/getRecordMatchDetails/byId?id=', // 列表
        },
      }
    },
    methods: {
      loadData(arg) {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性！')
          return false
        }
        this.selectionRows = []
        this.selectedRowKeys = []
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1  // 重置第一页
        }
        const params = this.getQueryParams() //查询条件
        delete params.current
        delete params.size
        this.loading = true // 加载图标
        getAction(this.url.list, params).then((res) => {
          if (res.code === 200) {
            this.dataSource = res.data
          } else {
            this.$message.error('获取数据失败！')
          }
        }).finally(()=>{
          this.loading = false
        })
      },
      show(){
        this.visible = true
        this.loadData(1)
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
      },
    }
  }
</script>
