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
            <a-form-item label="客户名称">
              <a-input
                allowClear
                placeholder="客户名称"
                v-model="queryParam.customerName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户编码">
              <a-input
                allowClear
                placeholder="客户编码"
                v-model="queryParam.customerCode"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="合同名称">
              <a-input
                allowClear
                placeholder="合同名称"
                v-model="queryParam.contractName"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="类型">
                <a-select
                  allowClear
                  placeholder="请选择类型"
                  v-model="queryParam.type"
                >
                  <a-select-option value="1">30日内到期预警</a-select-option>
                  <a-select-option value="2">已过期提醒</a-select-option>
                  <a-select-option value="3">近3个月到期提醒</a-select-option>
                  <a-select-option value="4">本月到期提醒</a-select-option>
                  <a-select-option value="5">下月到期提醒</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            
            <a-col
              :md="12"
              :sm="14"
            >
              <a-form-item label="合同开始时间">
                <a-date-picker
                  format="YYYY-MM-DD"
                  placeholder="开始时间"
                  style="width:46%"
                  v-model="queryParam.startTimeStart_extra"
                  @change="changeRange(arguments,'startTimeStart')"
                />
                ~
                <a-date-picker
                  format="YYYY-MM-DD"
                  placeholder="结束时间"
                  style="width:46%"
                  v-model="queryParam.startTimeEnd_extra"
                  @change="changeRange(arguments,'startTimeEnd')"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="12"
              :sm="14"
            >
              <a-form-item label="合同终止时间" class="stepFormText">
                <a-date-picker
                  format="YYYY-MM-DD"
                  placeholder="开始时间"
                  style="width:46%"
                  v-model="queryParam.endTimeStart_extra"
                  @change="changeRange(arguments,'endTimeStart')"
                />
                ~
                <a-date-picker
                  format="YYYY-MM-DD"
                  placeholder="结束时间"
                  style="width:46%"
                  v-model="queryParam.endTimeEnd_extra"
                  @change="changeRange(arguments,'endTimeEnd')"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="12"
              :sm="14"
            >
              <a-form-item label="合同创建时间" class="stepFormText">
                <a-date-picker
                  format="YYYY-MM-DD"
                  placeholder="开始时间"
                  style="width:46%"
                  v-model="queryParam.createTimeStart_extra"
                  @change="changeRange(arguments,'createTimeStart')"
                />
                ~
                <a-date-picker
                  format="YYYY-MM-DD"
                  placeholder="结束时间"
                  style="width:46%"
                  v-model="queryParam.createTimeEnd_extra"
                  @change="changeRange(arguments,'createTimeEnd')"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="商务主体"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  placeholder="商务主体"
                  optionFilterProp="children"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.businessSubject"
                >
                  <a-select-option
                    v-for="(item, index) in organs"
                    :key="index"
                    :value="item.id"
                  >{{ item.description }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="业务类型" class="stepFormText">
                <a-select
                  showSearch
                  placeholder="业务类型"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.businessType"
                >
                  <a-select-option v-for="(item, index) in businessTypeDicts" :key="index" :value="item.id">{{
                    item.label
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="客户类型" class="stepFormText">
                <a-select
                  showSearch
                  placeholder="请选择客户类型"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  v-model="queryParam.customerType"
                >
                  <a-select-option v-for="(item, index) in GLOBAL_CONST['customerType']" :key="index" :value="index">
                    {{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="归属部门" class="stepFormText">
                <a-select
                  showSearch
                  placeholder="归属部门"
                  optionFilterProp="children"
                  :dropdownMatchSelectWidth="false"
                  :allowClear="true"
                  v-model="queryParam.businessDeveloperOrgan"
                >
                  <a-select-option v-for="(item, index) in organs" :key="index" :value="item.id">{{
                    item.organName
                  }}</a-select-option>
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
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        @click="exportContract"
        type="primary"
        icon="download"
      >导出</a-button>
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
        :scroll="{ x: 1}"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a v-if="record.warnFlag === null || Number(record.warnFlag) === 0" @click="handleCancelNotice(record)">取消邮件<a-divider type="vertical"/></a>
          <a @click="handleShow(record)">查看</a>
          <a-divider type="vertical"/>
          <a @click="handleRenew(record)">续签</a>
        </span>

        <span
          slot="customerStatus"
          slot-scope="text, record"
        >
          <a-tag
            v-if="record.customerStatus == 0"
            color="pink"
          >合同未上传</a-tag>
          <a-tag
            v-if="record.customerStatus == 1"
            color="green"
          >合同正常</a-tag>
          <a-tag
            v-if="record.customerStatus == 2"
            color="orange"
          >合同即将到期</a-tag>
          <a-tag
            v-if="record.customerStatus == 3"
            color="red"
          >合同到期</a-tag>
        </span>

        <span
          slot="prAuditFlag"
          slot-scope="text, record"
        >
          <a-tag
            v-if="record.prAuditFlag == 0"
            color="green"
          >审核通过</a-tag>
          <a-tag
            v-if="record.prAuditFlag == 1"
            color="red"
          >审核不通过</a-tag>
          <a-tag
            v-if="record.prAuditFlag == 2"
            color="cyan"
          >待审核</a-tag>
          <a-tag
            v-if="record.prAuditFlag == 3"
            color="orange"
          >待提交</a-tag>
        </span>

        <span
          slot="labelScoped"
          slot-scope="text, record"
        >
          <span v-if="record.label != null">
            <a-tag
              v-for="(tag, index) in record.label.split(',')"
              :key="index"
            >{{ tag }}</a-tag>
          </span>
          <span v-else> - </span>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- 取消合同到期提醒弹出框 -->
    <template>
      <a-modal
        title="取消邮件提醒"
        :width="600"
        :closable="true"
        :visible="cancelTipVisible"
        @cancel="handleCancelTipClose"
        :maskClosable="false"
        :bodyStyle="{padding:'10px 24px 10px'}"
      >
        <template slot="footer">
          <a-button @click="handleCancelTipClose">关闭</a-button>
          <a-button
            type="primary"
            @click="handleCancelTipOk()"
            :loading="cancelTipLoading"
          >确定取消</a-button>
        </template>
        <a-form
          :form="cancelTipForm"
          class="ant-cancelTipForm"
        >
          <a-row style="margin-top:10px;">
            <a-col :span="24">
              <a-form-item
                label="取消邮件提醒之后本合同将不再提醒，确定取消请填写取消理由"
                class="stepFormText"
              >
                <a-textarea
                  :rows="2"
                  placeholder="请输入取消理由"
                  v-decorator="['reason', {rules: [{ required: true,max: 255, message: '请输入取消理由！'}]}]"
                  style="width: 450px"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    </template>
    <!-- 表单区域 -->
    <export-list-modal ref="exportListModal"></export-list-modal>
    <customer-contract-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></customer-contract-modal>

    <customer-contract-detail-modal ref="detailModal"></customer-contract-detail-modal>
    <customer-contract-continuous-modal ref="continuousModal"></customer-contract-continuous-modal>
    <contract-continuous-modal
      ref="customerContinuousModal"
      @ok="continuousModalOk"
    ></contract-continuous-modal>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction } from '@/api/manage'
  import {initDictOptions, filterDict} from '@/components/dict/JDictSelectUtil'
  import CustomerContractModal from './modules/CustomerContractModal'
  import { filterOrganDict1,filterSysUserDict } from '@/utils/customDict'
  import exportListModal from '../global/modules/ExportListModal'
  import CustomerContractDetailModal from './modules/CustomerContractDetailModal'
  import CustomerContractContinuousModal from './modules/CustomerContractContinuousModal'
  import ContractContinuousModal from './modules/ContractContinuousModal'
  import { getAllTree } from '@/utils/common'

  export default {
    name: 'NoticeExpireContract',
    mixins: [JeecgListMixin],
    components: {
      exportListModal,
      ContractContinuousModal,
      CustomerContractModal,
      CustomerContractDetailModal,
      CustomerContractContinuousModal,
    },
    data() {
      return {
        description: '客户信息管理界面',
        fileList: [],
        businessTypeDicts: [],
        businessSubDicts: [],
        loading: false,
        organs:[],
        customerTreeData: [],
        sysUsers: {},
        cancelTipVisible:false, // 控制取消提醒弹窗显示隐藏
        cancelTipForm: this.$form.createForm(this), // 取消提醒表单
        cancelTipLoading:false, // 取消提醒加载动画
        cancelTipRecord:{}, // 点击取消提醒的合同
        typeTitle:{'0':'续签','1':'新签','2':'重签','3':'补充协议','4':'先于合同执行','5':'虚拟合同'},
        columns: [
          {
            width: 180,
            ellipsis: true,
            title: '合同名称',
            align: 'center',
            dataIndex: 'contractName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            title: '签订类型',
            align: 'center',
            dataIndex: 'signingStatus',
            width: 100,
            customRender:(text)=>{
              const type = this.typeTitle[text]
              return (
                <a-tooltip placement="topLeft" title={type}>
                  {type}
                </a-tooltip>
              )
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '合同编号',
            align: 'center',
            dataIndex: 'contractCode',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '客户名称',
            align: 'center',
            dataIndex: 'customerName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '客户编码',
            align: 'center',
            dataIndex: 'customerCode',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 150,
            ellipsis: true,
            title: '商务主体',
            align: 'center',
            dataIndex: 'businessSubject',
            customRender: (text) => {
              return filterOrganDict1(this.organs, text) || '-';
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '合同开始时间',
            align: 'center',
            dataIndex: 'startDate',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '合同终止时间',
            align: 'center',
            dataIndex: 'endDate',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 130,
            ellipsis: true,
            title: '业务类型',
            align: 'center',
            dataIndex: 'businessType',
            customRender: (text) => {
              return filterDict(this.businessTypeDicts, text);
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '创建人',
            align: 'center',
            dataIndex: 'createUser',
            customRender: (text) => {
              return filterSysUserDict(this.sysUsers, text) || '-';
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '业务审核状态',
            align: 'center',
            dataIndex: 'prAuditFlag',
            scopedSlots: { customRender: 'prAuditFlag' }
          },
          {
            width: 180,
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/hrBase/tcustomercontract/pageOverdue',
          getOrgan: '/admin/organizationinfo/getOrgForCus?displayFlag=0&type=0',
          getTreeData: '/hrBase/tcustomerinfo/ValueTree',
          getOne: '/hrBase/tcustomercontract/',
          getSysUsers: '/admin/user/userDic',
          cancelWarn:'/hrBase/tcustomercontract/cancel/warn',//  取消客户合同到期提醒
          getBusinessDeveloperArray:'/admin/user/getUserByRoleNameAndClient',// 获得业务开发人
        },
        chapterUnitDicts:[],
        contractTypeDicts: [], // 客户合同类型
        businessDeveloperArray:[],
        businessOrgans:[],
      }
    },
    created() {
      this.loadOrgans();
      this.loadCustomerTreeData();
      this.getSysUsers();
    },
    methods: {
      changeRange(agrs,str){
        this.queryParam[str] = agrs[1]
      },
      exportContract(){
        this.$refs.exportListModal.title = '合同到期列表'
        this.$refs.exportListModal.url.exportXlsUrl = '/hrBase/tcustomercontract/export'
        this.$refs.exportListModal.url.exportFields = '/hrBase/tcustomercontract/getExportFieldName'
        this.$refs.exportListModal.params = this.getQueryParams()//查询条件
        this.$refs.exportListModal.showType = false
        this.$refs.exportListModal.add(this.selectedRowKeys)
      },
      // 续签
      handleRenew(record){
        this.$refs.continuousModal.title = '客户合同续签'
        this.$refs.continuousModal.treeData = this.customerTreeData;
        this.$refs.continuousModal.organs = this.organs;
        this.$refs.continuousModal.industryBelongs = this.industryBelongDictOptions;
        this.$refs.continuousModal.industrySub = this.industrySub;
        this.$refs.continuousModal.customerContractDict = this.contractTypeDicts
        this.$refs.continuousModal.customerBusinessTypeDict = this.businessTypeDicts
        this.$refs.continuousModal.businessDeveloper = this.businessDeveloperArray
        this.$refs.continuousModal.chapterUnitDicts = this.chapterUnitDicts
        this.$refs.continuousModal.areaTrees = this.$ls.get('glob_area')
        this.$refs.continuousModal.add(record,this.businessOrgans)
      },
      continuousModalOk() {
        this.loadData();
      },
      /**
       * 客户合同详情
       */
      handleShow(record) {
        this.$refs.detailModal.treeData = this.customerTreeData;
        this.$refs.detailModal.organs = this.organs;
        this.$refs.detailModal.industryBelongs = this.industryBelongDictOptions;
        this.$refs.detailModal.industrySub = this.industrySub;
        this.$refs.detailModal.customerBusinessTypeDict = this.businessTypeDicts;
        this.$refs.detailModal.customerContractDict = this.contractTypeDicts;
        this.$refs.detailModal.chapterUnitDicts = this.chapterUnitDicts
        // this.$refs.detailModal.customerBusinessSubTypeDict = this.businessSubDicts;
        this.$refs.detailModal.title = '客户合同查看'
        httpAction(this.url.getOne + record.id, null, "GET").then((res) => {
          if(Number(res.code) === 200){
            res.data.businessDeveloperId = filterSysUserDict(this.sysUsers, res.data.businessDeveloperId)
            this.$refs.detailModal.show(res.data)
          }else{
            this.$message.error(res.msg)
          }
        });
        
      },
      doStop(record) {
        this.$refs.customerContinuousModal.showModal(record);
      },
      /**
       * 加载数据字典
       */
      initDictConfig() {
        initDictOptions('customer_contract_type').then((res) => {
          if (res.code === 200) {
            this.contractTypeDicts = res.data;
          }
        });
        initDictOptions('chapter_unit').then((res) => {
          if (res.code === 200) {
            this.chapterUnitDicts = res.data
          }
        })
        httpAction(`/hrBase/sysdictbusinesstype/getSysDictBusinessTypeList`,null,'get').then(res=>{
          if(res.code === 200) {
            const tree = getAllTree(res.data)
            let result = []
            tree.map(item=>{
              result = result.concat(item.children)
            })
            this.businessTypeDicts = result
          }
        })
        httpAction(this.url.getBusinessDeveloperArray, '', 'GET').then((res) => {
          if (res.code === 200 && res.data.length > 0) {
            this.businessDeveloperArray=res.data
          }
        })
      },
      loadOrgans() {
        httpAction(this.url.getOrgan,'','GET').then((res) => {
          if(res.code === 200 && res.data.length > 0) {
            this.organs = res.data;
          }
        });
        httpAction(`/admin/organizationinfo/getOrgForCus?displayFlag=0&type=0&useType=3`, '', 'GET').then((res) => {
          if (res.code === 200 && res.data.length > 0) {
            this.businessOrgans = res.data
          }
        })
      },
      /**
       * 加载客户单位树形结构
       */
      loadCustomerTreeData() {
        httpAction(this.url.getTreeData,null,'get').then((res) => {
          this.customerTreeData = res.data;
        });
      },
      /**
       * 获取系统用户数据
       */
      getSysUsers() {
        httpAction(this.url.getSysUsers, null ,'GET').then((res) => {
          this.sysUsers = res.data;
        });
      },
      startDateChange(date) {
        // 时间格式化
        this.queryParam.startTimeFromHtml = date ? (date.format('YYYY-MM-DD')) : null
      },
      endDateChange(date) {
        // 时间格式化
        this.queryParam.endTimeFromHtml  = date ? (date.format('YYYY-MM-DD')) : null
      },
      // 取消合同提醒按钮点击事件
      handleCancelNotice(record){
        this.cancelTipVisible = true
        this.cancelTipRecord = record
      },
      // 取消提醒弹窗关闭按钮点击事件
      handleCancelTipClose(){
        this.cancelTipVisible = false
        this.cancelTipRecord = {}
        this.cancelTipLoading = false
        this.cancelTipForm.resetFields()
      },
      // 取消提醒弹窗点击确定取消提醒
      handleCancelTipOk(){
        const record = this.cancelTipRecord
        const that = this
        this.cancelTipForm.validateFields((err, values) => {
          if (!err) {
            const reason = values.reason
            that.cancelTipLoading = true
            httpAction(`${this.url.cancelWarn}?id=${record.id}&reason=${reason}`, null, 'get').then(res => {
              if (Number(res.code) === 200) {
                that.cancelTipLoading = false
                that.$message.success('取消提醒成功！')
                that.handleCancelTipClose()
                that.loadData()
              } else {
                that.cancelTipLoading = false
                that.$message.error(res.msg || '取消提醒失败！')
              }
            }).finally(()=>{
              that.cancelTipLoading = false
            })
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.ant-cancelTipForm {
  :global(.ant-form-item-label > label::after) {
    display: none;
  }
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

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
