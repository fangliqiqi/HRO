<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="员工姓名" class="labTxt">
              <a-input
                allowClear
                v-model="queryParam.empName"
                placeholder="员工姓名"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="身份证号" class="labTxt">
              <a-input
                allowClear
                v-model="queryParam.empIdcard"
                placeholder="身份证号"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体" class="labTxt">
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :placeholder="'请输入结算主体'"
                v-model="queryParam.settleDepartId"
                :id="'id'"
              ></select-page>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算主体编码" class="labTxt">
                <a-input
                  allowClear
                  v-model="queryParam.settleDepartNo"
                  placeholder="结算主体编码"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算月份" class="labTxt">
                <a-month-picker
                  v-model="queryParam.settlementMonth"
                  style="width: 100%"
                  placeholder="请选择结算月份"
                  format="YYYYMM"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="银行账号" class="labTxt">
                <a-input
                  allowClear
                  v-model="queryParam.bankNo"
                  placeholder="银行账号"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="收款单位" class="labTxt">
                <a-input
                  allowClear
                  v-model="queryParam.orgName"
                  placeholder="收款单位"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="失败标记人" class="labTxt">
                <select-page
                  :searchUrl="'admin/user/page/wxhr?nickname='"
                  :title="'nickname'"
                  placeholder="请选择失败标记人查询"
                  :id="'userId'"
                  v-model="queryParam.createUser"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="失败标记时间" class="labTxt">
                <a-range-picker @change="changeDate" v-model="queryParam.chargeDate_extra"/>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="发放金额" class="labTxt">
                <a-input-number
                  allowClear
                  v-model="queryParam.money"
                  placeholder="发放金额"
                  :parser="limitAccount"
                  style="width:100%"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="数据来源" class="labTxt">
                <a-select
                  v-model="queryParam.pauseDataType_extra"
                  placeholder="请选择数据来源"
                  @change="changeType"
                >
                  <template v-for="(item, index) in typeOption">
                    <a-select-option
                      :key="index"
                      :value="index"
                    >{{ item }}</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="状态" class="labTxt">
                <a-select
                  v-model="queryParam.status"
                  placeholder="请选择状态"
                >
                  <template v-for="(item, index) in statusOptions">
                    <a-select-option
                      :key="index"
                      :value="index"
                    >{{ item.option }}</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
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
              <a
                @click="handleToggleSearch"
                style="margin-left: 8px"
              >
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
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
        :scroll="{x: 1}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span
          slot="status"
          slot-scope="text, record"
        >
          <a-tag
            v-if="record.status == 1"
            color="pink"
          >待发放</a-tag>
          <a-tag
            v-if="record.status == 2"
            color="green"
          >已发放</a-tag>
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleLog(record)">日志查询</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <operat-log-modal ref="OperatLogForm"></operat-log-modal>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import { limitAccount } from '@/utils/common'
  import OperatLogModal from './modules/OperatLogModal'

  export default {
    name: 'SalarySearchFailList',
    mixins: [JeecgListMixin],
    components:{
      SelectPage,
      OperatLogModal
    },
    data() {
      return {
        description: '发放失败出账',
        // 枚举字段
        statusOptions: {
          '0': {'option': '待认领', 'color': 'blue'},
          '1': {'option': '待出账', 'color': 'cyan'},
          '2': {'option': '已发放', 'color': 'purple'},
          '3': {'option': '再次失败待认领', 'color': 'green'},
          '4': {'option': '不发放', 'color': 'orange'},
        },
        typeOption:['普通薪资','工程薪资','非扣税类','普通薪资暂停发','自定义暂停发','工程薪资暂停发','工程批量暂停发'],
        // excel表头数据
        exportFields: [],
        // 银行字典
        bankOptions:[],
        employData:[],
        // 表头
        columns: [
          {
            width: 120,
            ellipsis: true,
            title: '表单对应',
            align: 'center',
            dataIndex: 'accountType',
            customRender: (text,record) => {
              let res = '-';
              if(text == 3 && record.pauseDataType == 0){
                res = '普通薪资暂停发';
              }else if(text == 3 && record.pauseDataType == 1){
                res = '工程薪资暂停发';
              }else if(text == 3 && record.pauseDataType == 3){
                res = '工程批量暂停发';
              }else if(text == 0){
                res = '普通薪资';
              }else if(text == 1){
                res = '工程薪资';
              }else if(text == 2){
                res = '非扣税类';
              }else if(text == 4){
                res = '自定义暂停发';
              }
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '自定义项名称',
            align: 'center',
            dataIndex: 'empName1',
            customRender: (text,record) => {
              let res = '-';
              if(record.accountType == 4){
                res = record.empName || '-';
              }
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
          {
            width: 100,
            ellipsis: true,
            title: '员工姓名',
            align: 'center',
            dataIndex: 'empName',
            customRender: (text,record) => {
              let res = '-';
              if(record.accountType != 4){
                res = record.empName || '-';
              }
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            }
          },
          {
            width: 130,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            customRender: (text) => {
              return <a-tag color={this.statusOptions[text]['color']}>{this.statusOptions[text]['option']}</a-tag>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcard',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDepartName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 100,
            ellipsis: true,
            title: '结算月份',
            align: 'center',
            dataIndex: 'settlementMonth',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '开户行',
            align: 'center',
            dataIndex: 'bankName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '收款单位/个人',
            align: 'center',
            dataIndex: 'orgName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '银行账号',
            align: 'center',
            dataIndex: 'bankNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '发放金额',
            align: 'center',
            dataIndex: 'money',
            customRender: (text) => {
              const resultText = text || (parseFloat(text) === 0?'0':'-')
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '认领人',
            align: 'center',
            dataIndex: 'claimUser',
            customRender: text => {
              const resultText = this.employData[text] || '-';
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 170,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createDate',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 100,
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: '/salary/lostandfoundinfo/page',
          userUrl:'/admin/user/userDic'
        },
      }
    },
    created() {
      this.initDictConfig()
      httpAction(this.url.userUrl,'','GET').then((res) => {
        if(Number(res.code) === 200){
          this.employData = res.data
        }
      })
    },
    methods: {
      limitAccount,
      changeType(val){
        switch (val){
          case 3:
            this.queryParam.accountType = 3;
            this.queryParam.pauseDataType = 0;
          break;
          case 5:
            this.queryParam.accountType = 3;
            this.queryParam.pauseDataType = 1;
          break;
          case 6:
            this.queryParam.accountType = 3;
            this.queryParam.pauseDataType = 3;
          break;
          default:
            this.queryParam.accountType = val;
            delete this.queryParam.pauseDataType;
          break;
        }
      },
      changeDate(val,dateString){
        this.queryParam.createDateStart = dateString[0]
        this.queryParam.createDateEnd = dateString[1]
      },
      // 添加
      handleBilling: function(record) {
        this.$refs.salaryFailModal.show(record)
      },
      // 标记发放失败
      handleSalaryFail: function(record) {
        this.$refs.billingSalaryFailAddModal.title = '发放失败登记'
        this.$refs.billingSalaryFailAddModal.edit(record)
      },
      handleLog(record){
        this.$refs.OperatLogForm.show(record);
      },
      // 数据字典
      initDictConfig() {
        // 开户行
        initDictOptions('bank').then((res) => {
          if (Number(res.code) === 200) {
            this.bankOptions = res.data
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>
.labTxt{
  :global(.ant-form-item-label){
    width: 97px !important;
  }
}
:global(.ant-tag){
  margin-right: 0px;
}


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
