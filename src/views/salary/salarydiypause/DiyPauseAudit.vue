<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :placeholder="'请输入结算主体'"
                v-model="queryParam.settleDepartId"
                :id="'id'"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体编码">
              <a-input
                v-model="queryParam.settleDepartNo"
                placeholder="请输入结算主体编码"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算月份">
              <a-month-picker
                v-model="queryParam.settleDate"
                style="width: 100%"
                placeholder="请选择结算月份"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="提交人">
                <select-page
                  :searchUrl="'admin/user/page/wxhr?nickname='"
                  :title="'nickname'"
                  placeholder="请输入提交人"
                  :id="'userId'"
                  v-model="queryParam.chargeUser"
                ></select-page>
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

    <!-- 列表 -->
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
          <a @click="handleAudit(record)">审核</a>
        </span>

      </a-table>
    </div>

    <customize-salary-pause-modal
      ref="customizeSalaryPauseModal"
      :bankOptions="bankOptions"
      @ok="modalFormOk"
    ></customize-salary-pause-modal>

  </a-card>
</template>
<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import CustomizeSalaryPauseModal from '@/views/web/tfinancial/accountout/modules/CustomizeSalaryPauseModal'

import SelectPage from '@/components/jeecg/SelectPage'
import { mapGetters } from 'vuex'
import { httpAction } from '@/api/manage'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
export default {
  name: 'DiyPauseAudit',
  mixins: [JeecgListMixin],
  components: {
    SelectPage,
    CustomizeSalaryPauseModal
  },
  data() {
    return {
      visible: false,
      confirmLoading: false, // 发放方式弹窗loading
      chargeTypeOption:{
        '0':'现金',
        '1':'银付',
        '2':'线下',
      },
      columns: [
        {
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleDepartName',
          customRender:(text)=>{
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'settleDepartNo',
          customRender:(text)=>{
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '结算月份',
          align: 'center',
          dataIndex: 'settleDate',
          customRender:(text)=>{
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '自定义项名称',
          align: 'center',
          dataIndex: 'name',
          customRender:(text)=>{
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '发放金额',
          align: 'center',
          dataIndex: 'chargeMoney',
          customRender: text => {
            return text ? text : '-'
          }
        },
        {
          title: '发放方式',
          align: 'center',
          dataIndex: 'chargeType',
          customRender: text => {
            return this.chargeTypeOption[text];
          }
        },
        {
          title: '收款卡号',
          align: 'center',
          dataIndex: 'bankNo',
          customRender: text => {
            return text ? text : '-'
          }
        },
        {
          title: '收款银行',
          align: 'center',
          dataIndex: 'bankName',
          customRender: text => {
            return text ? text : '-'
          }
        },
        {
          title: '提交人',
          align: 'center',
          dataIndex: 'chargeUser',
          customRender:(text)=>{
            const result = text ? this.userData[text] : '-';
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '提交时间',
          align: 'center',
          dataIndex: 'chargeDate',
          customRender: text => {
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          width:80,
          title: '操作',
          dataIndex: 'action',
          align:'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      url: {
        list: '/salary/tchargerecord/getAuditDiyPausePage',
        editPause: '/salary/tpausediyinfo',
        doIssueAll: '/salary/tpausediyinfo/doIssueAll',
        doIssueSplit: '/salary/tpausediyinfo/doIssueSplit',
        attachmentUploadUrl: '/salary/tsalaryatta/ossUploadFile', //上传接口
        attachmentListUrl: '/salary/tsalaryatta/ossFileUrl/', //预览文件列表
        attachmentDelUrl: '/salary/tsalaryatta/ossFileDelete/' //删除文件
      },
      
      bankOptions: [],
      userData: [],
      
    }
  },
  created() {
    this.initDictConfig()
    this.loadUserList()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    
    // 审核
    handleAudit(record) {
      this.$refs.customizeSalaryPauseModal.title = '自定义薪资暂停发审核';
      this.$refs.customizeSalaryPauseModal.isAudit = true;
      this.$refs.customizeSalaryPauseModal.show(record);

    },
    // 获取用户列表
    loadUserList() {
      httpAction('/admin/user/userDic', '', 'GET').then(res => {
        if (Number(res.code) === 200) {
          this.userData = res.data;
        }
      })
    },
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then(res => {
        if (Number(res.code) === 200) {
          this.bankOptions = res.data
        }
      })
    }
  }
}
</script>
