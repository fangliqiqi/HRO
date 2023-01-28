<template>
  <a-modal
    :title="title"
    :width="1200"
    :closable="false"
    :visible="visible"
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
          <a-col :span="4">
            <a-button
              style="margin-bottom: 10px; margin-left: 0px; float: left;"
              @click="handleAdd"
              type="primary"
              icon="plus"
            >新增</a-button>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <div>
              <div class="steps-content">
                <!--列表-->
                <a-table
                  rowKey="id"
                  ref="table"
                  size="middle"
                  :bordered="true"
                  :columns="columns"
                  :loading="loading"
                  :dataSource="dataSource"
                  :pagination="ipagination"
                  @change="handleTableChange"
                >
                  <span
                    slot="action"
                    slot-scope="text, record"
                  >
                    <a
                      @click="handleEdit(record)"
                      v-has="'wxhr:temployeecontractinfo_edit'"
                    >编辑</a>
                    <a-divider
                      type="vertical"
                      v-has="'wxhr:temployeecontractinfo_edit'"
                    />
                    <a
                      @click="handleContractinfoRenewal(record)"
                      v-has="'wxhr:temployeecontractinfo_Renewal'"
                    >续签</a>
                    <a-divider
                      type="vertical"
                      v-has="'wxhr:temployeecontractinfo_del'"
                    />
                    <a
                      @click="handleContractDelete(record)"
                      v-has="'wxhr:temployeecontractinfo_del'"
                    >作废</a>
                  </span>
                </a-table>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <employee-contract-box-modal
      ref="employeeContractBoxModal"
      @ok="employeeContractBoxModalFormOk"
    ></employee-contract-box-modal>
    <employee-contract-delete-modal
      ref="employeeContractDeleteModal"
      @ok="employeeContractDeleteModalFormOk"
    ></employee-contract-delete-modal>
  </a-modal>
</template>

<script>
import { filterObj } from '@/utils/util'
import { getAction, httpAction } from '@/api/manage'
import EmployeeContractBoxModal from './EmployeeContractBoxModal'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import EmployeeContractDeleteModal from './EmployeeContractDeleteModal'

export default {
  name: 'EmployeeContractListModal',
  components: {
    EmployeeContractBoxModal,
    EmployeeContractDeleteModal,
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
          width: 150,
          ellipsis: true,
          title: '合同名称',
          align: 'center',
          dataIndex: 'contractName',
          customRender:(text) => {
            const str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          width: 150,
          ellipsis: true,
          title: '合同编码',
          align: 'center',
          dataIndex: 'contractNo',
          customRender:(text) => {
            const str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          width: 100,
          ellipsis: true,
          title: '合同类型',
          align: 'center',
          dataIndex: 'contractType',
          customRender:(text) => {
            const str = filterDictText(this.employeeContractTypeBelongs, text)
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          width: 130,
          ellipsis: true,
          title: '开始时间',
          align: 'center',
          dataIndex: 'contractStart',
          customRender:(text) => {
            const str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          width: 130,
          ellipsis: true,
          title: '到期时间',
          align: 'center',
          dataIndex: 'contractEnd',
          customRender:(text) => {
            const str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          width: 140,
          ellipsis: true,
          title: '单位名称',
          align: 'center',
          dataIndex: 'subjectUnit',
          customRender:(text) => {
            const str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          width: 140,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'subjectDepart',
          customRender:(text) => {
            const str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          width: 140,
          ellipsis: true,
          title: '操作',
          key: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      empId: '',
      title: '操作',
      visible: false,
      filterDictText,
      confirmLoading: false,
      form: this.$form.createForm(this),
      settleDomainBelongs: [],  // 结算主体和部门
      workingHoursBelongs: [],  // 工时制
      situationTypeBelongs: [], // 签订情况
      employeeContractTypeBelongs: [], // 员工合同类型
      url: {
        list: '', // 员工合同列表
        queryAllInfoById: 'hrBase/temployeecontractinfo/vo/',  // 合同详情
      },
    }
  },
  methods: {
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性！')
        return
      }
      if (Number(arg) === 1) {
        this.ipagination.current = 1  // 重置第一页
      }
      var params = this.getQueryParams()//查询条件
      this.loading = true
      getAction(this.url.list, params).then((res) => {
        if (Number(res.code) === 200 && res.data) {
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

        } else {
          this.loading = false
          this.$message.error(res.msg || res.message)
        }
      })
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
    // 添加
    add(record) {
      this.model = Object.assign({}, record)
      this.visible = true
    },
    // 合同新建弹框
    handleAdd: function() {
      this.$refs.employeeContractBoxModal.empId = this.empId
      this.$refs.employeeContractBoxModal.title = '员工合同新增'
      this.$refs.employeeContractBoxModal.workingHoursBelongs = this.workingHoursBelongs  // 工时制
      this.$refs.employeeContractBoxModal.situationTypeBelongs = this.situationTypeBelongs
      this.$refs.employeeContractBoxModal.employeeContractTypeBelongs = this.employeeContractTypeBelongs  // 员工合同类型
      this.$refs.employeeContractBoxModal.add()
    },
    // 编辑
    handleEdit: function(record) {
      this.$refs.employeeContractBoxModal.id = record.id
      this.$refs.employeeContractBoxModal.title = '员工合同编辑'
      this.$refs.employeeContractBoxModal.workingHoursBelongs = this.workingHoursBelongs
      this.$refs.employeeContractBoxModal.situationTypeBelongs = this.situationTypeBelongs
      this.$refs.employeeContractBoxModal.employeeContractTypeBelongs = this.employeeContractTypeBelongs
      httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.employeeContractBoxModal.edit(res.data)
        } else {
          this.$message.error('数据不完整！')
        }
      })
    },
    // 续签合同
    handleContractinfoRenewal: function(record) {
      this.$refs.employeeContractBoxModal.id = record.id
      this.$refs.employeeContractBoxModal.renewal = true
      this.$refs.employeeContractBoxModal.empId = this.empId
      this.$refs.employeeContractBoxModal.title = '员工合同续签'
      this.$refs.employeeContractBoxModal.workingHoursBelongs = this.workingHoursBelongs
      this.$refs.employeeContractBoxModal.situationTypeBelongs = this.situationTypeBelongs
      this.$refs.employeeContractBoxModal.employeeContractTypeBelongs = this.employeeContractTypeBelongs
      httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.employeeContractBoxModal.edit(res.data)
        } else {
          this.$message.error('数据不完整！')
        }
      })
    },
    // 作废
    handleContractDelete: function(record) {
      this.$refs.employeeContractDeleteModal.title = '员工合同作废'
      httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.employeeContractDeleteModal.edit(res.data)
        } else {
          this.$message.error('数据请求失败！')
        }
      })
    },
    // 合同新建弹框关闭
    employeeContractBoxModalFormOk() {
      this.loadData(1)
    },
    // 作废后刷新列表
    employeeContractDeleteModalFormOk() {
      this.loadData(1)
    },
    // 表单关闭
    handleCancel() {
      this.close()
      this.$emit('ok')
    },
    // 关闭功能实现
    close() {
      this.empId = ''
      this.$emit('close')
      this.visible = false
      this.confirmLoading = false
      this.ipagination.current = 1
    },
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
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}
</style>
