<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="员工编码">
              <a-input placeholder="请输入员工编码" v-model="queryParam.empCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="员工姓名">
              <a-input placeholder="请输入员工姓名" v-model="queryParam.empName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{ x: 1 }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" v-has="'wxhr:tempunemployementregistration_edit'">失业登记</a>
          <a-divider type="vertical" v-has="'wxhr:tempunemployementregistration_edit'" />
          <a
            @click="exportUnemploymentRegistrationForm(record)"
            v-has="'wxhr:temployeeinfo_exportUnemploymentRegistrationForm'">下载附件</a>
          <a-divider type="vertical" v-has="'wxhr:temployeeinfo_exportUnemploymentRegistrationForm'" />
          <a-popconfirm
            title="确定撤销吗?"
            @confirm="() => handleDelete(record.id)"
            v-has="'wxhr:tempunemployementregistration_del'"
          >
            <a>撤销</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <employee-unemployment-modal ref="employeeUnemploymentModal" @ok="modalFormOk"></employee-unemployment-modal>
    <error-modal ref="errorModal"></error-modal>
  </a-card>
</template>

<script>
import ErrorModal from './modules/ErrorModal'
// import { getAllSettleDomainSelectVos } from '@/api/api'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction, deleteAction, downFile ,getAction} from '@/api/manage'
import EmployeeUnemploymentModal from './modules/EmployeeUnemploymentModal'

export default {
  name: 'EmployeeUnemploymentInfoList',
  mixins: [JeecgListMixin],
  components: {
    ErrorModal,
    EmployeeUnemploymentModal
  },
  data() {
    return {
      description: '失业人员登记信息',
      //枚举字段
      allSettleDomainOptions: {}, // 结算主体和所属单位
      loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
      // 表头
      columns: [
        {
          width: 165,
          ellipsis: true,
          title: '员工编码',
          align: 'center',
          dataIndex: 'empCode',
          customRender: text => {
            const str = text ? text : '-'
            return (
              <a-tooltip placement="topLeft" title={str}>
                {str}
              </a-tooltip>
            )
          }
        },
        {
          width: 80,
          ellipsis: true,
          title: '员工姓名',
          align: 'center',
          dataIndex: 'empName',
          customRender: text => {
            const str = text ? text : '-'
            return (
              <a-tooltip placement="topLeft" title={str}>
                {str}
              </a-tooltip>
            )
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleDomain',
          customRender: text => {
            const str =
              Object.keys(this.allSettleDomainOptions).length &&this.allSettleDomainOptions.hasOwnProperty(text)
                ? this.allSettleDomainOptions[text]['departName']
                : '-'
            return (
              <a-tooltip placement="topLeft" title={str}>
                {str}
              </a-tooltip>
            )
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '优惠证号',
          align: 'center',
          dataIndex: 'favorableNo',
          customRender: text => {
            const str = text ? text : '-'
            return (
              <a-tooltip placement="topLeft" title={str}>
                {str}
              </a-tooltip>
            )
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '就失业证号',
          align: 'center',
          dataIndex: 'unemployementNo',
          customRender: text => {
            const str = text ? text : '-'
            return (
              <a-tooltip placement="topLeft" title={str}>
                {str}
              </a-tooltip>
            )
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '失业金',
          align: 'center',
          dataIndex: 'unemploymentMoney',
          customRender: text => {
            const str = text.toLocaleString()
            return (
              <a-tooltip placement="topLeft" title={str}>
                {str}
              </a-tooltip>
            )
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '创建时间',
          align: 'center',
          dataIndex: 'createDate',
          customRender: text => {
            const str = text ? text : '-'
            return (
              <a-tooltip placement="topLeft" title={str}>
                {str}
              </a-tooltip>
            )
          }
        },
        {
          width: 220,
          ellipsis: true,
          title: '操作',
          key: 'operations',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: 'hrBase/tempunemployementregistration/page?deleteFlag=0',
        delete: 'hrBase/tempunemployementregistration/',
        queryAllInfoById: 'hrBase/tempunemployementregistration/vo/'
      }
    }
  },
  created() {
    // 结算主体和所属单位（所有的）
    // getAllSettleDomainSelectVos().then(res => {
    //   if (Number(res.code) === 200) {
    //     this.allSettleDomainOptions = res.data
    //   } else {
    //     this.$message.error('结算主体和所属单位数据请求失败！')
    //   }
    // })
  },
  methods: {
    // 数据请求
    async loadData(arg) {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性!')
          return false
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1
        }
        var params = this.getQueryParams()//查询条件
        this.loading = true;
        let res = await getAction(this.url.list, params);
        if (Number(res.code) === 200) {
          if (res.data && res.data.records && res.data.records.length > 0) {             
            // 获取结算主体数据
            const settleDomainIds = []
            res.data.records.reduce((acc,cur)=>{
              settleDomainIds.push(cur.settleDomain)
            },[])
            const ids = settleDomainIds.join(',')
            const resSet = await httpAction(`/hrBase/tsettledomain/selectSettleDomainAndCustomerMapByIds?ids=${ids}`,null,'get')
            if(Number(resSet.code) === 200) {
              this.allSettleDomainOptions = resSet.data.settleDomainMap
              }else {
                this.$message.error('结算主体和所属单位数据请求失败！')
              }
            this.dataSource = res.data.records
            this.ipagination.total = res.data.total
            this.loading = false
          } else {
            this.dataSource = []
            this.ipagination.total = 0
            this.loading = false
            if (String(res.msg) !== 'success') {
              this.$message.warn(res.msg)
            }
          }
        } else {
          this.loading = false;
          this.$message.error(res.msg);
        }
      },
    // 失业登记证
    handleEdit: function(record) {
      this.$refs.employeeUnemploymentModal.id = record.id
      this.$refs.employeeUnemploymentModal.title = '失业登记信息'
      httpAction(this.url.queryAllInfoById + record.id, {}, 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.employeeUnemploymentModal.edit(res.data)
        } else {
          this.$message.error('数据不完整！')
        }
      })
    },
    // 失业登记表
    exportUnemploymentRegistrationForm: function(record) {
      const httpurl = `hrBase/temployeeinfo/exportUnemploymentRegistrationForm?id=${record.empId}`
      downFile(httpurl, '').then(res => {
        if (res.size > 0) {
          var blob = new Blob([res], { type: 'application/msword;charset=utf-8' }) // application/msword这里表示doc类型
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = `${record.empName}失业登记表.doc` // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
          this.$message.success(`${record.empName}失业登记表导出成功！`)
        } else {
          this.$message.warning(`${(res.msg || res.message)} 导出失败！`)
        }
      })
    },
    // 撤销
    handleDelete: function(id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }

      var that = this
      deleteAction(that.url.delete + id).then(res => {
        if (Number(res.code) === 200) {
          that.$message.success('撤销成功!')
          that.loadData()
        } else {
          //兼容
          that.$message.warning(res.message || res.msg)
        }
      })
    },
    // 数据字典
    initDictConfig() {}
  }
}
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.ant-card-body .table-operator {
  margin-bottom: 18px;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}

.ant-btn-danger {
  background-color: #ffffff;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}
</style>
