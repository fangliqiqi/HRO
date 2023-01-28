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
            <a-form-item label="垫付编号">
              <a-input
                placeholder="垫付编号"
                allowClear
                v-model="queryParam.advancePaymentNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户名称">
              <a-input
                placeholder="客户名称"
                v-model="queryParam.customerName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <select-page
                :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                :title="'departName'"
                :placeholder="'请输入结算主体'"
                v-model="queryParam.settleDomainId"
                :id="'id'"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" class="labelTxt">
            <a-form-item label="审核状态">
              <a-select
                showSearch
                placeholder="请选择审核状态"
                optionFilterProp="children"
                :allowClear="true"
                :dropdownMatchSelectWidth="false"
                :getPopupContainer="getPopupContainerFun"
                v-model="queryParam.auditStatus"
              >
                <a-select-option
                  v-for="(item,index) in auditStatusOption"
                  :key="index"
                  :value="index"
                >{{ item.text }}</a-select-option>
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        @click="add"
        type="primary"
        icon="plus"
        v-has="'wxhr:tadvancepayment_add'"
      >申请垫付</a-button>
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
        :scroll="{ x: 1500 }"
        @change="handleTableChange"
      >

        <span
          slot="customerName"
          slot-scope="text,record"
        >
          <span
            style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;"
            :title="record.customerName"
          >
            {{ record.customerName }}
          </span>
        </span>

        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleDetail(record)">详情</a>
          <a-divider
            type="vertical"
            v-if="record.auditStatus == 1"
          />
          <a
            @click="handleTermination(record)"
            v-if="record.auditStatus == 1"
          >终止</a>
          <a-divider
            type="vertical"
            v-if="record.auditStatus == 0"
            v-has="'wxhr:tpaymentapprovalrecord_submit_approve'"
          />
          <a
            @click="newSubmit(record)"
            v-if="record.auditStatus == 0"
            v-has="'wxhr:tpaymentapprovalrecord_submit_approve'"
          >提交</a>
          <a-divider
            type="vertical"
            v-if="record.auditStatus == 0 || record.auditStatus == 3"
          />
          <a-dropdown v-if="record.auditStatus == 3 || record.auditStatus == 0">
            <a class="ant-dropdown-link">更多
              <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item v-if="record.auditStatus == 3 || record.auditStatus == 0">
                <a @click="handleEdit(record)">{{ record.auditStatus == 3 ? '重新提交' : '编辑' }}</a>
              </a-menu-item>
              <a-menu-item v-if="record.auditStatus == 0">
                <a @click="handleDelete(record)">删除</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

        <span
          slot="moutsourcingItemVos"
          slot-scope="text, record"
        >
          <a-tag
            v-for="(item,index) in record.moutsourcingItemVos"
            :key="index"
            :color="color[index]"
          >{{ item.itemName }}</a-tag>
        </span>

        <span
          slot="customerType"
          slot-scope="text,record"
        >
          <a-tag color="green">{{ filterDictText(customerTypeDicts, record.customerType) }}</a-tag>
        </span>
        <span
          slot="advanceType"
          slot-scope="text,record"
        >
          <a-tag color="cyan">{{ filterDictText(advanceTypeDicts, record.advanceType) }}</a-tag>
        </span>
        <span
          slot="advanceNotPayback"
          slot-scope="text,record"
        >
          <a-tag
            v-if="record.advanceNotPayback == 0"
            color="green"
          >{{ numFormat(record.advanceNotPayback) }}</a-tag>
          <a-tag
            v-else-if="record.advanceNotPayback < 0"
            color="red"
          >{{ numFormat(record.advanceNotPayback) }}</a-tag>
        </span>
        <span
          slot="advanceMoney"
          slot-scope="text,record"
        >
          <a-tag
            v-if="record.advanceMoney < 100000"
            color="green"
          >{{ numFormat(record.advanceMoney) }}</a-tag>
          <a-tag
            v-else
            color="red"
          >{{ numFormat(record.advanceMoney) }}</a-tag>
        </span>

        <span
          slot="customerName"
          slot-scope="text,record"
        >
          <span
            style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;"
            :title="record.customerName"
          >
            {{ record.customerName }}
          </span>
        </span>

        <span
          slot="settleDate"
          slot-scope="text,record"
        >
          <a-tag
            v-if="record.settleDate == null"
            color="red"
          >未结算</a-tag>
          <span v-if="record.settleDate != null">{{ record.settleDate }}</span>
        </span>

        <span
          slot="auditStatus"
          slot-scope="text, record"
        >
          <div @click="showProcess(record)">
            <a-tag
              :color="auditStatusOption[record.auditStatus].color"
            >{{ auditStatusOption[record.auditStatus].text }}</a-tag>
          </div>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <advance-payment-module
      ref="advancePaymentModal"
      @ok="modalFormOk"
    ></advance-payment-module>
    <before-aduit-module
      ref="beforeAuditModal"
      @ok="modalFormOk"
    ></before-aduit-module>
    <advance-payment-detail-module ref="detailModal"></advance-payment-detail-module>
    <process-audit-module ref="processModal"></process-audit-module>
    <advance-payment-termination ref="terminationModal" @ok="modalFormOk"></advance-payment-termination>
    <advance-payment-overout ref="overoutModal" @ok="modalFormOk"> </advance-payment-overout>

    <a-modal
      :visible="visible"
      :confirm-loading="confirmLoading"
      :destroyOnClose="true"
      :closable="false"
      okText="提交"
      @ok="handlespNOOk"
      @cancel="handlepNOCancel"
    >
      <a-form :form="spNoform" :label-col="{ span: 7}" :wrapper-col="{ span: 15 }">
        <a-form-item label="企业微信流程编号">
          <a-input
            placeholder="请填写逾期垫付申请“已同意”的流程编号"
            v-decorator="['spNo', { rules: [{required: true, message: '请输入流程编号!'},{pattern:/^([1-9])\d{11}$/,message: '请输入正确的流程编号!' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction } from '@/api/manage'
import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
import { numFormat } from '@/utils/util'
import AdvancePaymentModule from './modules/AdvancePaymentModule'
import BeforeAduitModule from './modules/BeforeAduitModule'
import ProcessAuditModule from './modules/ProcessAuditModule'
import AdvancePaymentDetailModule from './modules/AdvancePaymentDetailModule'
import SelectPage from '@/components/jeecg/SelectPage'
import AdvancePaymentTermination from './modules/AdvancePaymentTermination'
import AdvancePaymentOverout from './modules/AdvancePaymentOverout'

export default {
  name: 'AdvancePaymentNewList',
  mixins: [JeecgListMixin],
  components: {
    AdvancePaymentDetailModule,
    BeforeAduitModule,
    AdvancePaymentModule,
    ProcessAuditModule,
    SelectPage,
    AdvancePaymentTermination,
    AdvancePaymentOverout,
  },
  data() {
    return {
      loading: false,
      //字典数组缓存
      customerTreeData: [],
      color: ['pink','red','orange','green','cyan','blue','purple'],
      serviceItems: ['招聘','培训','咨询','招考','代账','变更/注册','补贴','其他'],
      sysUsers: [],
      customerTypeDicts: [],
      advanceTypeDicts: [],
      organs: [],
      spNoform:this.$form.createForm(this),
      model:{},
      confirmLoading:false,
      visible:false,
      auditStatusOption:{
        '0':{color:'cyan',text:'待提交'},
        '1':{color:'orange',text:'待审核'},
        '2':{color:'green',text:'审核通过'},
        '3':{color:'red',text:'审核不通过'},
        '4':{color:'#969494',text:'已作废'},
        '5':{color:'#8F20FF',text:'已终止'},
      },
      dpAuditFlagOption:['审核通过','审核不通过','待审核','待提交','经理通过','经理不通过'],
      // 表头
      columns: [
        {
          width: 140,
          ellipsis: true,
          title: '垫付编号',
          align: 'center',
          dataIndex: 'advancePaymentNo',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'customerName',
          scopedSlots: { customRender: 'customerName' }
        },
        {
          title: '结算主体名称',
          align: 'center',
          dataIndex: 'departName'
        },
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'departNo'
        },
        {
          title: '商务主体',
          align: 'center',
          dataIndex: 'applyUnitName'
        },
        {
          title: '申请人',
          align: 'center',
          dataIndex: 'createUser',
        },
        // {
        //   title: '垫付客户类型',
        //   align: 'center',
        //   dataIndex: 'customerType',
        //   scopedSlots: { customRender: 'customerType' }
        // },
        {
          title: '垫付类型',
          align: 'center',
          dataIndex: 'advanceType',
          scopedSlots: { customRender: 'advanceType' }
        },
        {
          title: '期望打款日期',
          align: 'center',
          dataIndex: 'applyAdvanceDate'
        },
        {
          title: '审核状态',
          align: 'center',
          dataIndex: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
        },
        {
          title: '本次已垫付未回款金额',
          align: 'center',
          dataIndex: 'advanceNotPayback',
          scopedSlots: { customRender: 'advanceNotPayback' }
        },
        {
          title: '结算金额',
          align: 'center',
          dataIndex: 'settleMoney',
          customRender: (text) => {
            return numFormat(text);
          }
        },
        {
          title: '开票金额',
          align: 'center',
          dataIndex: 'ticketMoney',
          customRender: (text) => {
            return numFormat(text);
          }
        },
        {
          title: '垫付金额',
          align: 'center',
          dataIndex: 'advanceMoney',
          scopedSlots: { customRender: 'advanceMoney' }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width:110,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/hrApproval/tadvancepayment/page',
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        getSysUsers: '/admin/user/findWxUsers',
        getCustomerInfo: '/hrBase/tcustomerinfo/vo/',
        getSettleDomainInfo: '/hrBase/tsettledomain/vo/',
        getOrgan: '/admin/organizationinfo/getOrgForCus?type=1',
        getContractInfo: '/hrBase/tcustomercontract/',
        approvalSubmit: '/hrApproval/tpaymentapprovalrecord/submit',
        getAttaInfos: '/hrApproval/tpaymentattainfo/geteAttas/',
        delete: '/hrApproval/tadvancepayment/',
        process:'/hrApproval/tapproveauditinfo/getAllAuditInfo/',
        submit: '/hrApproval/tpaymentapprovalrecord/submit',
        getDetail:'/hrApproval/tadvancepayment/',
      }
    }
  },
  created() {
    this.getSysUsers();
    this.loadCustomerTreeData();
    this.loadOrgans();
  },
  methods: {
    handleTermination(record){
      this.$refs.terminationModal.title = '终止原因'
      this.$refs.terminationModal.show(record)
    },
    filterDictText,
    numFormat,
    add() {
      this.$refs.advancePaymentModal.title = '申请垫付'
      this.$refs.advancePaymentModal.customerTypeDicts = this.customerTypeDicts
      this.$refs.advancePaymentModal.advanceTypeDicts = this.advanceTypeDicts
      this.$refs.advancePaymentModal.add();
    },
    changeAuditStatus(val){
      if(val.length){
        this.queryParam.auditStatus = val.join(',')
      }else{
        delete this.queryParam.auditStatus
      }
    },
    showProcess(record){ //查看流程
      httpAction(this.url.getDetail+record.id,null,'get').then(res=>{
        if(res.code == 200){
          this.$refs.processModal.show(record.id,res.data.oldProcesFlag)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    async handleEdit(record) {
      this.$refs.advancePaymentModal.title = '申请垫付修改'
      this.$refs.advancePaymentModal.customerTypeDicts = this.customerTypeDicts
      this.$refs.advancePaymentModal.advanceTypeDicts = this.advanceTypeDicts
      this.$refs.advancePaymentModal.advancePaymentNo = record.advancePaymentNo
      // 退回编辑
      if(record.auditStatus === '3'){
        const res = await httpAction(`/hrBase/tcustomercontract/getVoBySettleId?settleId=${record.settleDomainId}`, null, 'GET');
        if(res.code === 200){
          this.$refs.advancePaymentModal.settleDomain.contractName = res.data.contractName;
          record.contractId = res.data.id;
        }else{
          record.contractId = null;
          record.applyUnit = null;
          record.applyUnitName = null;
          this.$message.warning(res.msg);
        }
        const res3 = await httpAction(`/hrBase/tsettledomain/${record.settleDomainId}`, null, 'GET');
        if(res3.code === 200){
          // existAdvancePayment 1 业务约定性垫付 0 偶发性垫付 advanceType 1业务约定垫付2偶发性垫付
          record.advanceType = String(res3.data.existAdvancePayment) === '1' ? '1' : '2';
          record.backPayCycle = res3.data.backPayCycle;
          if(res3.data.dpAuditFlag !== '0'){
            this.$message.warning(`结算主体处于“${this.dpAuditFlagOption[res3.data.dpAuditFlag]}”状态，请审核通过后再发起垫付申请!`);
            return false;
          }
        }
      }else{
        if(record.contractId){
          const res1 = await httpAction(this.url.getContractInfo + record.contractId, null, 'GET');
          if(res1.code === 200 && res1.data){
            this.$refs.advancePaymentModal.settleDomain.contractName = res1.data.contractName;
          }
        }else{
          this.$refs.advancePaymentModal.settleDomain.contractName = '-';
        }
      }
      
      const res2 = await httpAction(this.url.getAttaInfos + record.id, null, 'GET');
      if(res2.code === 200){
        this.$refs.advancePaymentModal.fileList = res2.data;
      }
      this.$refs.advancePaymentModal.edit(record);
    },
    handleDelete(record){
      let that = this;
      this.$confirm({
        title: '确定删除该条记录吗?',
        onOk() {
          httpAction(`/hrApproval/tadvancepayment/${record.id}`, null, 'DELETE').then((res) => {
            if(res.code === 200){
              that.$message.success('删除成功!')
              that.loadData()
            }else{
              that.$message.warning(res.msg)
            }
          })
        }
      });
    },
    handleDetail(record) {
      console.log(record);
      this.$refs.detailModal.title = '详情'
      this.$refs.detailModal.customerTypeDicts = this.customerTypeDicts
      this.$refs.detailModal.advanceTypeDicts = this.advanceTypeDicts
      this.$refs.detailModal.title = '详情'
      this.$refs.detailModal.customerTypeDicts = this.customerTypeDicts
      this.$refs.detailModal.advanceTypeDicts = this.advanceTypeDicts

      httpAction(this.url.getAttaInfos + record.id, null, 'GET').then((re) => {
        this.$refs.detailModal.fileList = re.data
        this.$refs.detailModal.show(record)
      })
    },
    doSubmit(record) {
      this.$refs.beforeAuditModal.show(record,1);
    },
    // 提交
    newSubmit(record){
      const _this = this
      // 查询该结算主体下是否有逾期
      const val = record.settleDomainId
      this.model = Object.assign({},{settleDomainId:record.settleDomainId},{advancePaymentId:record.id})
      httpAction(`/hrApproval/tadvancepayment/isExistOverduePayment/${val}`, null, 'get').then((res) => {
        if(Number(res.code) === 200&&res.data){
            _this.$refs.overoutModal.show(record.settleDomainId,this.model)
          // const text = <p>当前结算主体存在逾期未还款的数据，<span style="color:red">禁止发起新的垫付</span>!</p>
          // this.$confirm({
          //   icon:()=><a-icon type="exclamation-circle" style="color:red"/>,
          //   content:text,
          //   cancelText:'放弃申请',
          //   okText:'仍要发起',
          //   onOk() {
          //     _this.visible = true
          //   }
          // });
        }else{
          this.$confirm({
          content: '确认提交？',
          onOk() {
            httpAction(_this.url.submit,{advancePaymentId:record.id,oldType:3},'post').then(res=>{
              if(res.code === 200){
                _this.$message.success('提交成功')
                _this.loadData()
              }else{
                _this.$message.warning(res.msg)
              }
            })
          }
        });
        }
      })
    },

    // 逾期仍要提交 
    handlespNOOk(){
      this.spNoform.validateFields((err, values) => {
        if (!err) {
          const num = values.spNo
          // 校验逾期编号
          httpAction(`/hrApproval/tadvancepayment/checkQywxProcessNoIsExist?spNo=${num}`, null, 'get').then((res) => {
            if(res.code === 200){
              this.confirmLoading = true;
              let formData = Object.assign(this.model, values)
              // 提交
              httpAction(this.url.submit,{...formData,oldType:3},'post').then(res=>{
                if(res.code === 200){
                  this.confirmLoading = false;
                  this.$message.success('提交成功')
                  this.visible = false
                  this.loadData()
                }else{
                  this.$message.warning(res.msg)
                  this.confirmLoading = false;
                }
              })
            }else{
              this.$message.error(res.msg)
            }
          })
          
        }
      })
    },
    handlepNOCancel(){
      this.visible = false
      this.confirmLoading = false
    },
    loadOrgans() {
      httpAction(this.url.getOrgan,'','GET').then((res) => {
        if(res.code === 200 && res.data.length > 0) {
          this.organs = res.data;
        }
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
    initDictConfig() {
      initDictOptions('ADVANCE_CUSTOMER_TYPE').then((res) => {
        if (res.code === 200) {
          this.customerTypeDicts = res.data;
        }
      });
      initDictOptions('ADVANCE_ADVANCE_TYPE').then((res) => {
        if (res.code === 200) {
          this.advanceTypeDicts = res.data;
        }
      });
    },
    /**
     * 加载客户单位树形结构
     */
    loadCustomerTreeData() {
      httpAction(this.url.getTreeData,null,'get').then((res) => {
        this.customerTreeData = res.data;
      });
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
.ant-tag{
  cursor: pointer;
}
</style>
