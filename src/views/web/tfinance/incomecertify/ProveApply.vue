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
            <a-form-item label="员工编码">
              <a-input
                placeholder="请输入员工编码"
                v-model="queryParam.empNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="员工姓名">
              <a-input
                placeholder="请输入员工姓名"
                v-model="queryParam.empName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="身份证号">
              <a-input
                placeholder="请输入身份证号"
                v-model="queryParam.empIdcard"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="在职状态">
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.workFlag"
                  placeholder="请选择在职状态查询"
                >
                  <a-select-option
                    v-for="(value, key) in workFlagOptions"
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
              <a-form-item label="员工类型">
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  v-model="queryParam.empType"
                  placeholder="请选择员工类型查询"
                >
                  <a-select-option
                    v-for="(item, index) in empTypeOptions"
                    :key="index"
                    :value="item.value"
                  >{{ item.label }}</a-select-option>
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
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            v-has="'wxhr:tproveapply_apply'"
            @click="handleApply(record)"
          >申请</a>
          <br />
          <a @click="handleProbation(record,1)">试用期员工收入证明</a>
          <br />
          <a @click="handleProbation(record,0)">正式员工收入证明</a>
        </span>

        <!-- 在职状态 -->
        <span
          slot="workFlag"
          slot-scope="text, record"
        >
          <span
            v-for="(workFlag, key) in workFlagOptions"
            :key="key"
          >
            <a-tag
              v-if="record.workFlag == key"
              :color="workFlag.color"
            >{{ workFlag.option }}</a-tag>
          </span>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 弹出框 -->
    <prove-apply-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></prove-apply-modal>
    <prove-income-modal
      ref="ProveIncomeModalForm"
      @ok="modalFormOk"
    ></prove-income-modal>
  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
  import ProveApplyModal from './modules/ProveApplyModal'
  import ProveIncomeModal from './modules/ProveIncomeModal'
  import JSettlement from '@/components/jeecg/JSettlement'

  export default {
    name: 'ProveApply',
    mixins: [JeecgListMixin],
    components:{
      ProveApplyModal,
      ProveIncomeModal,
      JSettlement
    },
    data() {
      return {
        description: '员工列表',
        empTypeOptions: [], // 员工类型
        sexOptions:[{
          value:"1",
          label:'男'
        },{
          value:"2",
          label:'女'
        }],
        workFlagOptions: {'0': {'option': '在职', 'color': 'green'}, '1': {'option': '离职', 'color': 'red'}},
        // 表头
        columns: [
          {
            title: '员工编码',
            align: 'center',
            dataIndex: 'empNo',
          },
          {
            title: '员工姓名',
            align: 'center',
            dataIndex: 'empName',
          },
          {
            title: '性别',
            align: 'center',
            dataIndex: 'empSex',
            customRender: (text) => {
              return filterDictText(this.sexOptions,text)
            }
          },
          {
            title: '身份证号',
            align: 'center',
            dataIndex: 'empIdcard',
          },
          {
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDomainName',
          },
          {
            title: '联系方式',
            align: 'center',
            dataIndex: 'empPhone',
          },
          {
            title: '锁定状态',
            align: 'center',
            dataIndex: 'lockFlag',
            customRender: (text) => {
              return (text == 0) ? '锁定' : '未锁定'
            }
          },
          {
            title: '在职状态',
            align: 'center',
            dataIndex: 'workFlag',
            scopedSlots: { customRender: 'workFlag' },
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width:150,
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrBase/temployeeinfo/page?deleteFlag=0',
        },
      }
    },
    methods: {
      // 申请
      handleApply(record) {
        this.$refs.modalForm.title = '证明申请'
        this.$refs.modalForm.show(record)
      },
      // 收入证明
      handleProbation(record,type){
        if(type == 1){
          this.$refs.ProveIncomeModalForm.title = '试用期员工收入证明'
        }else{
          this.$refs.ProveIncomeModalForm.title = '正式员工收入证明'
        }
        this.$refs.ProveIncomeModalForm.type = type
        this.$refs.ProveIncomeModalForm.show(record)
      },

      // 数据字典
      initDictConfig() {
        // 性别
        // initDictOptions('sex').then((res) => {
        //   if (res.code === 200) {
        //     this.sexOptions = res.data
        //   }
        // })
        // 员工类型
        initDictOptions('personnel_type').then((res) => {
          if (res.code === 200) {
            this.empTypeOptions = res.data
          }
        })
      },
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
