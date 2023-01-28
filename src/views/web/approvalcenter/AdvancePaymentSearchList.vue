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
            <a-form-item label="垫付编号" class="labelTxt">
              <a-input
                placeholder="垫付编号"
                allowClear
                v-model="queryParam.advancePaymentNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" class="labelTxt">
            <a-form-item label="结算主体编码">
              <a-input placeholder="结算主体编码" v-model="queryParam.departNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" class="labelTxt">
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
                mode="multiple"
                placeholder="请选择审核状态"
                optionFilterProp="children"
                :allowClear="true"
                :dropdownMatchSelectWidth="false"
                :getPopupContainer="getPopupContainerFun"
                @change="changeAuditStatus"
                v-model="queryParam.auditStatus_extra"
                defaultValue="[2]"
              >
                <a-select-option value="1">待审核</a-select-option>
                <a-select-option value="2">审核通过</a-select-option>
                <a-select-option value="4">已作废</a-select-option>
                <a-select-option value="5">已终止</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8" class="labelTxt">
              <a-form-item label="客户名称">
                <a-input placeholder="客户名称" v-model="queryParam.customerName"></a-input>
              </a-form-item>
            </a-col>
          
            <a-col :md="6" :sm="8" class="labelTxt">
              <a-form-item label="客户类型">
                <a-select v-model="queryParam.customerType" placeholder="请选择客户类型">
                  <a-select-option v-for="item in customerTypeDicts" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8" class="labelTxt">
              <a-form-item label="垫付类型">
                <a-select v-model="queryParam.advanceType" placeholder="请选择垫付类型">
                  <a-select-option v-for="item in advanceTypeDicts" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8" class="labelTxt">
              <a-form-item label="申请人">
                <a-input placeholder="请输入申请人" v-model="queryParam.createUser"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8" class="labelTxt">
              <a-form-item label="开票金额">
                <a-input-number
                  placeholder="请输入开票金额"
                  v-model="queryParam.ticketMoney"
                  style="width: 100%"
                  :precision="2"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8" class="labelTxt">
              <a-form-item label="垫付金额">
                <a-input-number
                  placeholder="请输入垫付金额"
                  v-model="queryParam.advanceMoney"
                  style="width: 100%"
                  :precision="2"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8" class="labelTxt">
              <a-form-item label="结算金额">
                <a-input-number
                  placeholder="请输入结算金额"
                  v-model="queryParam.settleMoney"
                  style="width: 100%"
                  :precision="2"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8" class="labelTxt">
              <a-form-item label="期望打款日期">
                <a-range-picker
                  v-model="queryParam.rangeTime_extra"
                  @change="changeRange"
                  style="width: 100%"
                  :showTime="{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }"
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8" class="labelTxt">
              <a-form-item label="收入归属">
                <a-select
                  showSearch
                  placeholder="请选择收入归属"
                  optionFilterProp="children"
                  :dropdownMatchSelectWidth="false"
                  :allowClear="true"
                  :getPopupContainer="getPopupContainerFun"
                  v-model="queryParam.incomeBelong"
                >
                  <a-select-option
                    v-for="(item, index) in organs"
                    :key="index"
                    :value="item.id"
                  >{{ item.organName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8" class="labelTxt">
              <a-form-item label="收入归属细分">
                <a-select
                  showSearch
                  placeholder="请选择收入归属细分"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  :getPopupContainer="getPopupContainerFun"
                  v-model="queryParam.incomeBelongSub"
                >
                  <a-select-option
                    v-for="(item, index) in organs"
                    :key="index"
                    :value="item.id"
                  >{{ item.organName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8" class="labelTxt">
              <a-form-item label="回款状态">
                <a-select
                  showSearch
                  mode="multiple"
                  placeholder="请选择回款状态"
                  optionFilterProp="children"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  :getPopupContainer="getPopupContainerFun"
                  @change="changeBackPayStatus"
                  v-model="queryParam.backPayStatus_extra"
                >
                  <a-select-option
                    v-for="(item, index) in backPayStatusOption"
                    :key="index"
                    :value="item.value"
                  >{{ item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8" class="labelTxt">
              <a-form-item label="垫付申请日期">
                <a-range-picker
                  v-model="queryParam.createTime_extra"
                  @change="changecreateTime"
                  style="width: 100%"
                  :showTime="{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }"
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8" class="labelTxt">
              <a-form-item label="是否逾期">
                <a-select
                  placeholder="请选择是否逾期"
                  optionFilterProp="children"
                  :allowClear="true"
                  v-model="queryParam.isOverdue"
                >
                  <a-select-option
                    v-for="(item, index) in overdueOption"
                    :key="index"
                    :value="index"
                  >{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
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
      <a-button type="primary" icon="download" :loading="btnLoading" @click="exportList" v-has="'wxhr:payment_listexport'">导出</a-button>
      <a-button
        type="primary"
        icon="download"
        @click="exportTotalList"
        v-has="'wxhr:payment_listexport'"
        :loading="btnLoading"
      >导出汇总</a-button>
      <a-button
        type="primary"
        icon="download"
        :loading="btnLoading"
        @click="exportDetailList"
        v-has="'wxhr:payment_listexport'"
      >导出汇总明细</a-button>
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
        :scroll="{ x: 1850 }"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleBack(record)" v-has="'wxhr:tbackpay_add'">垫付回款<a-divider type="vertical" /></a>
          <a @click="handleDetail(record)">详情</a>
          <a @click="handleFaild(record)" v-has="'wxhr:tadvancepayment_invalid'" v-if="record.auditStatus != 4"><a-divider type="vertical"/>作废</a>
          <a @click="handleFeedback(record)" v-has="'wxhr:tadvancepaymentremark_add'" v-if="record.auditStatus == 2 && record.createUserId==currentUserId && record.advanceNotPayback!=0"><a-divider type="vertical"/>未回款反馈</a>
        </span>

        <span slot="moutsourcingItemVos" slot-scope="text, record">
          <a-tag v-for="(item, index) in record.moutsourcingItemVos" :key="index" :color="color[index]">{{
            item.itemName
          }}</a-tag>
        </span>

        <span slot="customerType" slot-scope="text, record">
          <a-tag color="green">{{ filterDictText(customerTypeDicts, record.customerType) }}</a-tag>
        </span>
        <span slot="advanceType" slot-scope="text, record">
          <a-tag color="cyan">{{ filterDictText(advanceTypeDicts, record.advanceType) }}</a-tag>
        </span>
        <span slot="advanceNotPayback" slot-scope="text, record">
          <a-tag v-if="record.advanceNotPayback == 0" color="green">{{ numFormat(record.advanceNotPayback) }}</a-tag>
          <a-tag v-else-if="record.advanceNotPayback < 0" color="red">{{ numFormat(record.advanceNotPayback) }}</a-tag>
        </span>
        <span slot="advanceMoney" slot-scope="text, record">
          <a-tag v-if="record.advanceMoney < 100000" color="green">{{ numFormat(record.advanceMoney) }}</a-tag>
          <a-tag v-else color="red">{{ numFormat(record.advanceMoney) }}</a-tag>
        </span>

        <span slot="settleDate" slot-scope="text, record">
          <a-tag v-if="record.settleDate == null" color="red">未结算</a-tag>
          <span v-if="record.settleDate != null">{{ record.settleDate }}</span>
        </span>

        <span slot="auditStatus" slot-scope="text, record">
          <div @click="showProcess(record)">
            <a-tag :color="auditStatusOption[record.auditStatus]['color']">{{ auditStatusOption[record.auditStatus]['text'] }}</a-tag>
          </div>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <advance-payment-detail-module ref="detailModal"></advance-payment-detail-module>
    <advance-payment-back ref="backModal" @ok="backModalOk"></advance-payment-back>
    <process-audit-module ref="processModal"></process-audit-module>
    <export-list-modal ref="exportListModal" @export="downloadExcel"></export-list-modal>
    <advance-payment-feedback ref="feedbackModal"></advance-payment-feedback>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import {downFile, httpAction } from '@/api/manage'
import { initDictOptions, filterDictText,filterDict} from '@/components/dict/JDictSelectUtil'
import { numFormat } from '@/utils/util'
import AdvancePaymentDetailModule from './modules/AdvancePaymentDetailModule'
import AdvancePaymentBack from './modules/AdvancePaymentBack'
import ProcessAuditModule from './modules/ProcessAuditModule'
import exportListModal from '../global/modules/ExportListModal'
import SelectPage from '@/components/jeecg/SelectPage'
import AdvancePaymentFeedback from './modules/AdvancePaymentFeedback'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'AdvancePaymentSearchList',
  mixins: [JeecgListMixin],
  components: {
    AdvancePaymentBack,
    AdvancePaymentDetailModule,
    ProcessAuditModule,
    exportListModal,
    SelectPage,
    AdvancePaymentFeedback,
  },
  data() {
    return {
      loading: false,
      //字典数组缓存
      color: ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'],
      serviceItems: ['招聘', '培训', '咨询', '招考', '代账', '变更/注册', '补贴', '其他'],
      overdueOption:['否','是'],
      sysUsers: [],
      customerTypeDicts: [],
      advanceTypeDicts: [],
      industryBelongDictOptions: [],
      rangeTime: null,
      queryParam:{
        auditStatus_extra:'2',
        auditStatus:'2'
      },
      auditStatusOption:[
        {text:'待提交',color:'cyan'},
        {text:'待审核',color:'orange'},
        {text:'审核通过',color:'green'},
        {text:'审核不通过',color:'red'},
        {text:'已作废',color:'#969494'},
        {text:'已终止',color:'#8F20FF'},
      ],
      // 表头
      columns: [
        {
          title: '垫付编号',
          align: 'center',
          width: 180,
          ellipsis: true,
          dataIndex: 'advancePaymentNo',
          customRender:(text) => {
            const resText = text?text:'-'
            return <a-tooltip placement="topLeft" title={resText}>{resText}</a-tooltip>
          }
        },
        {
          title: '客户名称',
          align: 'center',
          width: 180,
          ellipsis: true,
          dataIndex: 'customerName',
          customRender:(text) => {
            return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '行业类型',
          align: 'center',
          width: 180,
          ellipsis: true,
          dataIndex: 'industryBelong',
          customRender:(text) => {
            const res = filterDict(this.industryBelongDictOptions, text)
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '结算主体名称',
          align: 'center',
          dataIndex: 'departName',
          width: 180,
          ellipsis: true,
          customRender:(text) => {
            return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'departNo',
          width: 110,
          ellipsis: true,
          customRender:(text) => {
            return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '商务主体',
          align: 'center',
          dataIndex: 'applyUnitName',
          width: 180,
          ellipsis: true,
          customRender:(text) => {
            const resText = text?text:'-'
            return <a-tooltip placement="topLeft" title={resText}>{resText}</a-tooltip>
          }
        },
        {
          title: '申请人',
          align: 'center',
          dataIndex: 'createUser',
          width: 100,
          ellipsis: true,
          customRender:(text) => {
            return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
          }
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
          scopedSlots: { customRender: 'advanceType' },
          width: 120,
          ellipsis: true,
        },
        {
          title: '期望打款日期',
          align: 'center',
          dataIndex: 'applyAdvanceDate',
          width: 110,
          ellipsis: true,
          customRender:(text) => {
            return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
          }
        },
        {
          title: '审核状态',
          align: 'center',
          dataIndex: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' },
          width: 85,
          ellipsis: true,
        },
        {
          title: '回款状态',
          align: 'center',
          dataIndex: 'backPayStatus',
          width: 85,
          ellipsis: true,
          customRender:(text) => {
            const res = this.backPayStatusOption.find(item=>item.value == text)
            const str = res ? res['label'] : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          title: '垫付未回款金额',
          align: 'center',
          dataIndex: 'advanceNotPayback',
          scopedSlots: { customRender: 'advanceNotPayback' },
          width: 180,
          ellipsis: true,
        },
        {
          title: '结算金额',
          align: 'center',
          dataIndex: 'settleMoney',
          width: 80,
          ellipsis: true,
          customRender: (text) => {
            const res = numFormat(text)
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          }
        },
        {
          title: '开票金额',
          align: 'center',
          dataIndex: 'ticketMoney',
          width: 80,
          ellipsis: true,
          customRender: (text) => {
            const res = numFormat(text)
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          },
        },
        {
          title: '垫付金额',
          width: 100,
          ellipsis: true,
          align: 'center',
          dataIndex: 'advanceMoney',
          scopedSlots: { customRender: 'advanceMoney' },
        },
        {
          title: '已回款本金',
          align: 'center',
          width: 90,
          ellipsis: true,
          dataIndex: 'paymentReceivedCapital',
          customRender:(text,record) => {
            const str = text == 0 ? ((record.auditStatus != 2 && record.auditStatus != 4) ? '-' : '0') : text
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          title: '已回款收益',
          align: 'center',
          width: 90,
          ellipsis: true,
          dataIndex: 'paymentReceivedIncome',
          customRender:(text,record) => {
            const str = text == 0 ? ((record.auditStatus != 2 && record.auditStatus != 4) ? '-' : '0') : text
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          }
        },
        {
          title: '垫付申请日期',
          align: 'center',
          dataIndex: 'createTime',
          width: 150,
          ellipsis: true,
          customRender:(text) => {
            const str = text?text.substring(0,10):'-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          }
        },
        {
          title: '是否逾期',
          align: 'center',
          dataIndex: 'isOverdue',
          width: 150,
          ellipsis: true,
          customRender:(text) => {
            const str = this.overdueOption[text]
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 170,
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/hrApproval/tadvancepayment/query/page',
        getSysUsers: '/admin/user/findWxUsers',
        getContractInfo: '/hrBase/tcustomercontract/',
        getAttaInfos: '/hrApproval/tpaymentattainfo/geteAttas/',
        getBackRecord: '/hrApproval/tbackpay/getRecordByadvancePaymentId/', //查询查询回款记录
        process: '/hrApproval/tapproveauditinfo/getAllAuditInfo/',
        invalid: '/hrApproval/tadvancepayment/invalid?id=',
        getDetail: '/hrApproval/tadvancepayment/',
        getTotal: '/hrApproval/tincomebelongbackpay/list', //获得垫付回款统计表所有记录
        getOrganAll: '/admin/organizationinfo/getOrgForCus?type=0',
        exportUrl: '/hrApproval/tadvancepayment/getlist/exportData'
      },
      organs: [],
      backPayStatusOption:[{value:'0',label:'未回款'},{value:'1',label:'部分回款'},{value:'2',label:'已回款'}],
      btnLoading: false
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    currentUserId: function(){
      return this.userInfo().id
    }
  },
  created() {
    this.getSysUsers()      
    httpAction(this.url.getOrganAll,'','GET').then((res) => {
      if(res.code === 200 && res.data.length > 0) {
        this.organs = res.data
      }
    });
  },
  methods: {
    ...mapGetters(["userInfo"]),
    filterDictText,
    numFormat,
    handleFeedback(record) {
      this.$refs.feedbackModal.title = '未回款反馈'
      httpAction(`/admin/user/userDic`, null ,'GET').then((res) => {
        if(res.code === 200){
          this.$refs.feedbackModal.show(record,res.data)
        }else{
          this.$message.warn(res.msg)
        }
      })
    },
    changeBackPayStatus(val){
      if(val.length){
        this.queryParam.backPayStatus = val.join(',')
      }else{
        delete this.queryParam.backPayStatus
      }
    },
    changeAuditStatus(val){
      if(val.length){
        this.queryParam.auditStatus = val.join(',')
      }else{
        delete this.queryParam.auditStatus
      }
    },
    getPopupContainerFun(triggerNode){
      const wid = getComputedStyle(triggerNode).width
      triggerNode.setAttribute('style','width:'+wid)
      return triggerNode.parentNode
    },
    // 导出汇总明细
    exportDetailList(){
      this.$refs.exportListModal.title = '导出汇总明细'
      this.$refs.exportListModal.url.exportXlsUrl = '/hrApproval/tadvancepayment/getlist/export?type=2'
      this.$refs.exportListModal.url.exportFields = '/hrApproval/tadvancepayment/getExportFieldNameDetail'
      this.$refs.exportListModal.params = this.getQueryParams() //查询条件
      this.$refs.exportListModal.add(this.selectedRowKeys)
    },
    // 导出汇总
    exportTotalList() {
      this.btnLoading = true
      const exportFields =  ['收入归属细分名称', '回款率', '垫付总额', '垫付回款金额', '创建时间']
       const httpurl = `${this.url.getTotal}?exportFields=${exportFields}`
        downFile(httpurl, {}).then((res) => {
          if (res.size > 0) {
            var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
            var downloadElement = document.createElement('a')
            var href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.href = href
            downloadElement.download = '导出汇总.xls' // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象

            this.$message.success('导出成功！')
          } else {
            this.$message.warning(res.msg)
          }
        }).finally(() => {
          this.btnLoading = false
        })
    },
    json2excel(tableJson, filenames, autowidth, bookTypes, typeLength) {
      var that = this
      import('@/vendor/Export2Excel.js').then((excel) => {
        var tHeader = []
        var dataArr = []
        var sheetnames = []
        for (var i in tableJson) {
          tHeader.push(tableJson[i].tHeader)
          dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
          sheetnames.push(tableJson[i].sheetName)
        }
        excel.export_json_to_excel_more_sheet({
          header: tHeader,
          data: dataArr,
          sheetname: sheetnames,
          filename: filenames,
          autoWidth: autowidth,
          bookType: bookTypes,
          autoLength: typeLength, // 所有类型长度
        })
        // that.confirmLoading = false;
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j] == null ? '' : v[j]
        })
      )
    },
    handleBack(record) {
      httpAction(this.url.getBackRecord + record.id, null, 'get').then((res) => {
        if (Number(res.code) === 200) {
          this.$refs.backModal.show(res.data)
        }
      })
    },
    showProcess(record) {
      //查看流程
      httpAction(this.url.getDetail + record.id, null, 'get').then((res) => {
        if (Number(res.code) === 200) {
          this.$refs.processModal.show(record.id, res.data.oldProcesFlag)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    //作废
    handleFaild(record) {
      const _this = this
      this.$confirm({
        title: '确定作废么?',
        onOk() {
          httpAction(_this.url.invalid + record.id, null, 'PUT').then((res) => {
            if (Number(res.code) === 200) {
              _this.$message.success('操作成功!')
              _this.loadData()
            } else {
              _this.$message.warning(res.msg)
            }
          })
        },
      })
    },
    handleDetail(record) {
      this.$refs.detailModal.title = '详情'
      this.$refs.detailModal.customerTypeDicts = this.customerTypeDicts
      this.$refs.detailModal.advanceTypeDicts = this.advanceTypeDicts
      httpAction(this.url.getAttaInfos + record.id, null, 'GET').then((re) => {
        this.$refs.detailModal.fileList = re.data
        this.$refs.detailModal.show(record,this.backPayStatusOption)
      })
      
    },
    backModalOk() {
      this.loadData()
    },
    /**
     * 获取系统用户数据
     */
    getSysUsers() {
      httpAction(this.url.getSysUsers, null, 'GET').then((res) => {
        this.sysUsers = res.data
      })
    },
    businessNewModalOk() {
      this.loadData()
    },
    auditModalOk() {
      this.loadData()
    },
    // 导出
    exportList() {
      this.$refs.exportListModal.title = '垫付列表'
      this.$refs.exportListModal.exportType = 1
      this.$refs.exportListModal.url.exportFields = '/hrApproval/tadvancepayment/getExportFieldName'
      this.$refs.exportListModal.add(this.selectedRowKeys)
    },
    async downloadExcel(allFields){
      const objFields = {'垫付编码':'advancePaymentNo','客户名称':'customerName','行业类型':'industryBelongName','结算主体名称':'departName',
      '结算主体编码':'departNo','申请单位名称':'applyUnitName','客户类型':'customerTypeName','垫付客户类型':'customerTypeName',
      '垫付类型':'advanceTypeName','垫付申请日期':'createTime','期望打款日期':'applyAdvanceDate','承诺回款日期':'paybackDate',
      '垫付原因':'advanceReason','已垫付未回款金额':'advanceNotPayback','已回款总额':'payBackSum','回款总额明细':'payBackMoneyDetail',
      '回款日期明细':'payBackDateDetail','结算金额':'settleMoney','开票金额':'ticketMoney','垫付金额':'advanceMoney',
      '是否逾期':'isOverdueName','申请部门':'organName','申请人':'createUser','审批状态':'auditStatusName','回款状态':'backPayStatusName',
      '收入归属':'incomeBelongName','收入归属细分':'incomeBelongSubName','垫付未回款原因':'noPayBackResion','修改未回款备注':'modifyNobackRemark',
      '已回款本金':'paymentReceivedCapital','已回款收益':'paymentReceivedIncome','已回款金额':'paymentReceivedSum',
      '本金':'capital','收益':'income','出账时间':'revenueTime'};
      const filterArr = allFields.map(item=> objFields[item]);

      this.btnLoading = true;
      const _this = this;
      const qs = require('qs');
      const url = `${this.url.exportUrl}?${qs.stringify(this.getQueryParams())}`;
      const res = await httpAction(url,null,'get');
      if(res.code !== 200){
        this.$message.warning(res.msg);
        this.btnLoading = false;
        return;
      }
      // 获取当年到目前每个月份
      let start = Number(moment().format('M'))-1;
      const month = [];
      const fields = [];
      for(; start>0 ; start--){
        const key = moment().subtract(start, 'months').format('YYYYMM');
        month.push({key:key,value:`${key}回款`});
        fields.push(`${key}回款`);
      }
      month.push({key:moment().format('YYYYMM'),value:`${moment().format('YYYYMM')}回款`});
      fields.push(`${moment().format('YYYYMM')}回款`);
      const arr = res.data.map(item=>{
        item.auditStatusName = _this.auditStatusOption[item.auditStatus].text;
        item.backPayStatusName = _this.backPayStatusOption[item.backPayStatus].label;
        item.isOverdueName = item.isOverdue == 1 ? '是' : '否';
        item.advanceTypeName = _this.filterDictText(_this.advanceTypeDicts, item.advanceType);
        item.industryBelongName = filterDict(_this.industryBelongDictOptions, item.industryBelong);
        const temp = item.backPayExportVos || [];
        month.forEach(ele=>{
          const element = temp.find(k=>k.month == ele.key);
          item[ele.value] = element ? element.sum : '';
        })
        return item;
      })
      const excelDatas = [
        {
          tHeader: allFields.concat(fields),
          // tHeader: ['垫付编码', '客户名称', '行业类型', '结算主体名称', '结算主体编码','申请单位名称','客户类型',
          // '垫付客户类型','垫付类型','垫付申请日期','期望打款日期','承诺回款日期','垫付原因','已垫付未回款金额','已回款总额',
          // '回款总额明细','回款日期明细','结算金额','开票金额','垫付金额','是否逾期','申请部门','申请人','审批状态',
          // '回款状态','收入归属','收入归属细分','垫付未回款原因','修改未回款备注','已回款本金','已回款收益','已回款金额',
          // '本金','收益','出账时间'].concat(fields),
          filterVal: filterArr.concat(fields),
          tableDatas: arr,
          sheetName: '垫付',
        },
      ]
      
      this.jsonToexcel(excelDatas, '垫付导出', true, 'xlsx', 0)
    },
    
    jsonToexcel(tableJson, filenames, autowidth, bookTypes, typeLength) {
      var that = this
      import('@/vendor/ExportCommonExcel.js').then((excel) => {
        var tHeader = []
        var dataArr = []
        var sheetnames = []
        for (var i in tableJson) {
          tHeader.push(tableJson[i].tHeader)
          dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
          sheetnames.push(tableJson[i].sheetName)
        }
        excel.export_json_to_excel_more_sheet({
          header: tHeader,
          data: dataArr,
          sheetname: sheetnames,
          filename: filenames,
          autoWidth: autowidth,
          bookType: bookTypes,
          autoLength: typeLength, // 所有类型长度
        })
      }).finally(()=>{
        that.btnLoading = false;
      })
    },
    changeRange(value, dateString) {
      this.queryParam.applyAdvanceDateStart = dateString[0]
      this.queryParam.applyAdvanceDateEnd = dateString[1]
    },
    changecreateTime(value, dateString){
      this.queryParam.createTimeStart = dateString[0]
      this.queryParam.createTimeEnd = dateString[1]
    },
    initDictConfig() {
      initDictOptions('ADVANCE_CUSTOMER_TYPE').then((res) => {
        if (res.code === 200) {
          this.customerTypeDicts = res.data
        }
      })
      initDictOptions('ADVANCE_ADVANCE_TYPE').then((res) => {
        if (res.code === 200) {
          this.advanceTypeDicts = res.data
        }
      })
      initDictOptions('industryBelong').then((res) => {
        if (res.code === 200) {
          this.industryBelongDictOptions = res.data;
        }
      });
    },
  },
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
.ant-tag {
  cursor: pointer;
}
.searchForm .labelTxt {
  :global(.ant-form-item-label) {
    width: 105px;
    text-align: right;
  }
}
</style>
