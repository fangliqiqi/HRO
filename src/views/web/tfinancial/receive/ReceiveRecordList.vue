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
            <a-form-item label="来款单位">
              <a-input
                placeholder="请输入来款单位查询"
                v-model="queryParam.incomeBelong"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="认领状态"
              class="stepFormText"
            >
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="请选择认领状态查询"
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
              class="stepFormText"
            >
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="请选择款项用途查询"
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
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="认领金额">
                <a-input-group compact>
                  <a-input
                    style=" width: 43%; text-align: center"
                    placeholder="最小金额"
                    @change="changeReciveFee1"
                    v-model="queryParam.reciveFee1"
                  />
                  <a-input
                    style=" width: 14%; border-left: 0; pointer-events: none; background-color: #fff"
                    placeholder="~"
                    disabled
                  />
                  <a-input
                    style="width: 43%; text-align: center; border-left: 0"
                    placeholder="最大金额"
                    @change="changeReciveFee2"
                    v-model="queryParam.reciveFee2"
                  />
                </a-input-group>
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
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="款项类型"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择款项类型查询"
                  v-model="queryParam.reciveType"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in reciveTypeOptions"
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
              <a-form-item label="认领人">
                <select-page
                  :searchUrl="'admin/user/page/wxhr?nickname='"
                  :title="'nickname'"
                  placeholder="请选择认领人查询"
                  :id="'userId'"
                  v-model="queryParam.reciveUser"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="出账状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择出账状态"
                  v-model="queryParam.statusOut"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in statusOutOptions"
                    :key="key"
                    :value="key"
                  >{{ value.option }}</a-select-option>
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
        type="primary"
        icon="retweet"
        @click="handleMatchOutAccount()"
        :loading="btnLoading.outCount"
        v-has="'wxhr:tmatchingclaime_add'"
      >匹配出账</a-button>
      <a-button
        type="primary"
        icon="retweet"
        @click="handleMatchBill()"
        :loading="btnLoading.bill"
        v-has="'wxhr:tmatchingclaime_add'"
      >匹配账单</a-button>
      <a-button
        type="primary"
        icon="retweet"
        @click="handleMatchInAccountOfStatement"
        :loading="btnLoading.income"
        v-has="'wxhr:tsettlebill_updateClaim'"
      >匹配收入</a-button>
      <a-button
        type="primary"
        icon="download"
        @click="handleExport"
      >导出</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <div
        class="ant-alert ant-alert-info"
        style="margin-bottom: 16px;"
      >
        已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> 项
        <a
          style="margin-left: 24px"
          @click="onClearSelected"
        >清空</a>
      </div>
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record,index"
        >
          <a-popconfirm
            v-has="'wxhr:treciverecord_recall'"
            v-if="$store.getters.userInfo.id == record.reciveUser && record.status==0 && (record.reciveUse==0 || record.reciveUse==1) && record.statusOut==0 && record.statusIncome==0"
            title="确定撤销吗?"
            @confirm="() => handleRelease(record)"
          >
            <a>撤销</a>
          </a-popconfirm>
          <a-divider
            v-has="'wxhr:treciverecord_recall'"
            v-if="$store.getters.userInfo.id == record.reciveUser && record.status==0 && record.reciveUse==0 && record.statusOut==0 && record.statusIncome==0"
            type="vertical"
          />
          <!-- 剩余部分撤销 -->
          <template v-has="'wxhr:treciverecord_recallBackMoney'">
            <a
              v-if="$store.getters.userInfo.id == record.reciveUser && record.status==0 && record.reciveUse==0 && record.statusOut==1 && (record.reciveType==1 || record.reciveType==4) && record.reciveFeeBalance != 0"
              @click="handlePartRelease(record)"
            >撤销</a>
          </template>
          <template v-has="'wxhr:treciverecord_recallBackMoney'">
            <a-divider
              v-if="$store.getters.userInfo.id == record.reciveUser && record.status==0 && record.reciveUse==0 && record.statusOut==1 && (record.reciveType==1 || record.reciveType==4)"
              type="vertical"
            />
          </template>
          <a
            v-has="'wxhr:tmatchingclaime_add'"
            v-if="record.status==0 && record.reciveUse==0 && (record.reciveType==1 || record.reciveType==4||record.reciveType==5)"
            @click="handleMatchOutAccountAgain(record,index)"
          >{{ (record.reciveType == 1) ? '匹配出账' : '匹配账单' }}</a>
          <a-divider
            v-has="'wxhr:tmatchingclaime_add'"
            v-if="record.status==0 && record.reciveUse==0 && (record.reciveType==1 || record.reciveType==4)"
            type="vertical"
          />
          <a
            v-if="String(record.reciveUse)==='0' && (String(record.reciveType)==='1' || String(record.reciveType)==='4')"
            @click="matchOutDetail(record.id)"
          >匹配出账明细</a>
          <a
            v-has="'wxhr:tsettlebill_updateClaim'"
            v-if="record.status==0 && record.reciveUse==0 && (record.reciveType==2 || record.reciveType==3)"
            @click="handleMatchInAccountOfRecord(record)"
          >匹配收入</a>
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
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <part-release-modal
      ref="partReleaseModal"
      @ok="modalFormOk"
    ></part-release-modal>
    <match-out-account-modal
      ref="matchOutAccountModal"
      @ok="modalFormOk"
    ></match-out-account-modal>
    <match-out-account-detail
      ref="MatchOutAccountDetail"
      @ok="modalFormOk"
    ></match-out-account-detail>
    <match-in-account-modal
      ref="matchInAccountModal"
      @ok="modalFormOk"
    ></match-in-account-modal>
    <receive-record-export-modal
      ref="receiveRecordExportModal"
      @ok="modalFormOk"
    ></receive-record-export-modal>
    <match-out-account-again
      ref="matchOutAccountAgain"
      @ok="modalFormOk"
      @oks="modalBack"
    ></match-out-account-again>
    <match-in-account-of-statement-modal
      ref="matchInAccountOfStatementModal"
      @ok="modalFormOk"
    ></match-in-account-of-statement-modal>
    <match-in-account-of-net-income-modal
      ref="matchInAccountOfNetIncomeModal"
      @ok="modalFormOk"
    ></match-in-account-of-net-income-modal>
    <match-bill-modal
      ref="MatchBillModalForm"
      @ok="modalFormOk"
    ></match-bill-modal>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { httpAction,getAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import PartReleaseModal from './modules/PartReleaseModal'
  import MatchInAccountModal from './modules/MatchInAccountModal'
  import MatchOutAccountModal from './modules/MatchOutAccountModal'
  import MatchBillModal from './modules/MatchBillModal'
  import MatchOutAccountAgain from './modules/MatchOutAccountAgain'
  import MatchOutAccountDetail from './modules/MatchOutAccountDetail'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import ReceiveRecordExportModal from './modules/ReceiveRecordExportModal'
  import { getSettleDomainSelectVos } from '@/api/api'
  import MatchInAccountOfNetIncomeModal from './modules/MatchInAccountOfNetIncomeModal'
  import MatchInAccountOfStatementModal from './modules/MatchInAccountOfStatementModal'

  export default {
    name: 'ReceiveRecordList',
    mixins: [JeecgListMixin],
    components: {
      SelectPage,
      PartReleaseModal,
      MatchInAccountModal,
      MatchOutAccountModal,
      MatchBillModal,
      MatchOutAccountAgain,
      ReceiveRecordExportModal,
      MatchInAccountOfStatementModal,
      MatchInAccountOfNetIncomeModal,
      MatchOutAccountDetail
    },
    data() {
      return {
        description: '认领明细',
        // 枚举字段
        employData: {}, // 发布人
        matchingLimit: 0, // 出账限额
        settleDomainItems: [], // 结算主体(有权限的)
        customerItems:[],//客户单位
        statusOptions: {'0': {'option': '正常', 'color': 'green'}, '1': {'option': '撤销', 'color': 'red'}},
        statusOutOptions: {'0': {'option': '未出账', 'color': 'blue'}, '1': {'option': '部分出账', 'color': 'pink'}, '2': {'option': '全部出账', 'color': 'green'}},
        statusIncomeOptions: {'0': {'option': '未收入', 'color': 'blue'}, '1': {'option': '部分收入', 'color': 'pink'}, '2': {'option': '全部收入', 'color': 'green'}},
        reciveUseOptions: {'0': '款项认领', '1': '垫付还款', '2': '商险预估还款'},
        reciveTypeOptions: {'1': '薪资及其他', '2': '纯收入', '3': '事务性外包','4':'预估结算单','5':'财务账单'}, // 款项类型
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        // excel表头数据
        exportFields: [
          '进账单位', '进账卡号', '来款金额', '进账日期', '待认领金额', '已认领金额', '财务备注', '客服备注', '发布人', '发布时间', '认领状态',
          '认领结算主体', '认领金额', '认领人', '认领时间', '款项用途', '状态', '匹配出账状态', '匹配收入状态'
        ],
        // 表头
        columns: [
          {
            width: 250,
            ellipsis: true,
            title: '来款单位',
            align: 'center',
            dataIndex: 'incomeBelong',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            title: '认领时间',
            align: 'center',
            dataIndex: 'reciveDate',
            customRender: text => {
              let resultText = text ? text.substring(0, 10) : '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '进账金额',
            align: 'center',
            dataIndex: 'incomeFee',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 140,
            ellipsis: true,
            title: '认领金额',
            align: 'center',
            dataIndex: 'reciveFee',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 140,
            ellipsis: true,
            title: '可匹配金额',
            align: 'center',
            dataIndex: 'reciveFeeBalance',
            scopedSlots: { customRender: 'reciveFeeBalance' },
          },
          {
            width: 140,
            ellipsis: true,
            title: '结算主体余额',
            align: 'center',
            dataIndex: 'balance',
            customRender:(text,record) => {
              let str
              if(String(record.reciveType) === '4'){
                str = '-'
              }else{
                str = text ? text.toLocaleString() : '0'
              }
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '款项用途',
            align: 'center',
            dataIndex: 'reciveUse',
            customRender:(text) => {
              const str = this.reciveUseOptions.hasOwnProperty(text) ? this.reciveUseOptions[text] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '款项类型',
            align: 'center',
            dataIndex: 'reciveType',
            customRender:(text, record) => {
              const Str = (String(record.reciveUse) === '0') ? this.reciveTypeOptions[text] : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            }
          },
          {
            width: 180,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDomainId',
            customRender:(text) => {
              const str = ((Object.keys(this.settleDomainOptions).length) && (this.settleDomainOptions).hasOwnProperty(text)) ? (this.settleDomainOptions)[text]['departName'] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 180,
            ellipsis: true,
            title: '客户单位',
            align: 'center',
            dataIndex: 'unitId',
            customRender:(text,record) => {
              let name = '-'
              if(text){
                name = this.getCustomerName(text)
              }else{
                name = ((Object.keys(this.settleDomainOptions).length) && (this.settleDomainOptions).hasOwnProperty(record.settleDomainId)) ? (this.settleDomainOptions)[record.settleDomainId]['customerName'] : '-'
              }
              return <a-tooltip placement="topLeft" title={name}>{name}</a-tooltip>
            },
          },
          {
            width: 200,
            ellipsis: true,
            title: '客服备注',
            align: 'center',
            dataIndex: 'serverRemark',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 120,
            ellipsis: true,
            align: 'center',
            title: '认领人',
            dataIndex: 'reciveUser',
            customRender:(text) => {
              const Str = ((Object.keys(this.employData).length) && (this.employData).hasOwnProperty(text)) ? (this.employData)[text] : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '认领状态',
            align: 'center',
            dataIndex: 'status',
            customRender:(text) => {
              const color = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].color : 'blue'
              const str = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 140,
            ellipsis: true,
            title: '出账状态',
            align: 'center',
            dataIndex: 'statusOut',
            scopedSlots: { customRender: 'statusOut' },
          },
          {
            width: 140,
            ellipsis: true,
            title: '收入状态',
            align: 'center',
            dataIndex: 'statusIncome',
            scopedSlots: { customRender: 'statusIncome' },
          },
          {
            width: 220,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'salary/treciverecord/page',
          ReleaseUrl: 'salary/treciverecord/recallById',
          exportXlsUrl: 'salary/treciverecord/doexport?',
          queryAllInfoById: 'salary/treciverecord/', // 详情
          querySettleDomainById: 'hrBase/tsettledomain/', // 结算主体详情
          queryParams:'/hrBase/tsettledomain/selectSettleDomainAndCustomerMapByIds'//获取对应IDs的结算主体Map和单位信息Map
        },
        // 按钮状态
        btnLoading:{
          outCount: false,
          income: false,
          bill:false
        },
      }
    },
    created() {
      // 结算主体和所属单位（有权限的）
      getSettleDomainSelectVos().then((res) => {
        if (Number(res.code) === 200) {
          this.settleDomainItems = res.data
        } else {
          this.$message.error('有权限的结算主体和所属单位数据请求失败！')
        }
      })
     
      // 认领人员数据
      httpAction('/admin/user/userDic', '', 'GET').then((res) => {
        if (Number(res.code) === 200) {
          this.employData = res.data
        } else {
          this.$message.error('认领人员数据请求失败！')
        }
      })
    },
    methods: {
      moment,
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
            // 获取客户单位数据
            const customerIds = []
            res.data.records.reduce((acc,cur)=>{
              cur.settleDomainId&&settleDomainIds.push(cur.settleDomainId)
              cur.unitId&&customerIds.push(cur.unitId)
            },[])
        
            const ids = settleDomainIds.length>0?settleDomainIds.join(','):""
            const cuids = customerIds.length>0?customerIds.join(','):""
            const resCus = cuids&&await httpAction(`/hrBase/tcustomerinfo/getCustomerInfoByIds?ids=${cuids}`,null,'get')
            const resSet = ids&&await httpAction(`/hrBase/tsettledomain/selectSettleDomainAndCustomerMapByIds?ids=${ids}`,null,'get')

            if(Number(resSet.code) === 200) {
              this.settleDomainOptions = resSet.data.settleDomainMap
              }else {
                this.settleDomainOptions = {}
                // this.$message.error('结算主体和所属单位数据请求失败！')
              }
            if(Number(resCus.code) === 200){
              this.customerItems = resCus.data
            }else{
              this.customerItems= []
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

      formatFloat(f, digit = 2) {
        const m = Math.pow(10, digit)
        return Math.round(f * m) / m
      },
      modalBack(index,value){
        const val = this.formatFloat(parseFloat(value) + parseFloat(this.dataSource[index]['reciveFeeBalance']))
        this.$set(this.dataSource[index],`reciveFeeBalance`,val)
      },
      getCustomerName(id){
        // for(const index in this.settleDomainOptions){
        //   if(String(this.settleDomainOptions[index].customerId) === String(id)){
        //     return this.settleDomainOptions[index].customerName
        //   }
        // }
        // return ''
        const item = this.customerItems.find(item=>item.id==id)
        if(item){
          return item.customerName
        }
        return '-'
      },
      // 撤销
      handleRelease: function(record) {
        // 垫付还款 当月可以撤销，跨月还款不允许撤销
        let reciveMoment = moment(record.reciveDate).format('YYYYMM')
        let nowMoment = moment().format('YYYYMM')
        if(record.reciveUse=='1'&&reciveMoment!=nowMoment){
          this.$message.warning('当月可以撤销，跨月还款不允许撤销')
          return false
        }

         httpAction(`${this.url.ReleaseUrl}?id=${record.id}`, '', 'POST').then((res) => {
          if (Number(res.code) === 200) {
            this.$message.success('撤销成功！')
            this.loadData()
            this.onClearSelected()
          } else {
            this.$message.error(res.msg || res.message)
          }
        })
      },
      // 部分撤销
      handlePartRelease: function(record) {
        this.$refs.partReleaseModal.title = '撤销'
        this.$refs.partReleaseModal.edit(record)
      },
      // 匹配出账【结算单选认领记录】
      handleMatchOutAccount: function() {
        this.btnLoading.outCount = true
        this.$refs.matchOutAccountModal.title = '匹配出账'
        this.$refs.matchOutAccountModal.settleDomainItems = this.settleDomainItems
        this.$refs.matchOutAccountModal.settleDomainOptions = this.settleDomainOptions
        this.$refs.matchOutAccountModal.statusOutOptions = this.statusOutOptions
        this.$refs.matchOutAccountModal.statusIncomeOptions = this.statusIncomeOptions
        this.$refs.matchOutAccountModal.recordStatusOptions = this.statusOptions
        this.$refs.matchOutAccountModal.matchingLimit = this.matchingLimit

        if (Object.keys(this.settleDomainItems).length > 0 && Object.keys(this.settleDomainOptions).length > 0) {
          this.$refs.matchOutAccountModal.add()
          this.$refs.matchOutAccountModal.loadData(2)
        } else {
          if (Object.keys(this.settleDomainItems).length === 0 || Object.keys(this.settleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            this.btnLoading.outCount = false;
            return false
          }
        }
        // 防止重复点击
        setTimeout(()=>{
          this.btnLoading.outCount = false
        },2000)
      },
      matchOutDetail(id){
        this.$refs.MatchOutAccountDetail.url.list = `salary/treciverecord/getRecordMatchDetails/byId?id=${id}`
        this.$refs.MatchOutAccountDetail.show()
      },
      // 匹配账单
      handleMatchBill(){
        this.btnLoading.bill = true
        this.$refs.MatchBillModalForm.add()
        this.$refs.MatchBillModalForm.title = '匹配账单'
        this.$refs.MatchBillModalForm.statusOutOptions = this.statusOutOptions
        this.$refs.MatchBillModalForm.loadData(2)
        // 防止重复点击
        setTimeout(()=>{
          this.btnLoading.bill = false
        },2000)
      },
      // 匹配出账【认领记录选结算单】
      handleMatchOutAccountAgain(record,index){
        this.$refs.matchOutAccountAgain.title = (String(record.reciveType) === '1') ? '匹配出账' : '匹配账单'
        this.$refs.matchOutAccountAgain.settleDomainItems = this.settleDomainItems
        this.$refs.matchOutAccountAgain.settleDomainOptions = this.settleDomainOptions
        this.$refs.matchOutAccountAgain.statusOutOptions = this.statusOutOptions
        this.$refs.matchOutAccountAgain.statusIncomeOptions = this.statusIncomeOptions
        this.$refs.matchOutAccountAgain.recordStatusOptions = this.statusOptions
        this.$refs.matchOutAccountAgain.edit(record,index)
        this.$refs.matchOutAccountAgain.loadData(1)
      },
      // 匹配收入【结算单选认领记录】
      handleMatchInAccountOfStatement: function() {
        this.btnLoading.income = true
        this.$refs.matchInAccountOfStatementModal.title = '匹配收入'
        this.$refs.matchInAccountOfStatementModal.settleDomainItems = this.settleDomainItems
        this.$refs.matchInAccountOfStatementModal.settleDomainOptions = this.settleDomainOptions
        this.$refs.matchInAccountOfStatementModal.statusOutOptions = this.statusOutOptions
        this.$refs.matchInAccountOfStatementModal.statusIncomeOptions = this.statusIncomeOptions
        this.$refs.matchInAccountOfStatementModal.recordStatusOptions = this.statusOptions
        this.$refs.matchInAccountOfStatementModal.matchingLimit = 0

        if (Object.keys(this.settleDomainItems).length > 0 && Object.keys(this.settleDomainOptions).length > 0) {
          this.$refs.matchInAccountOfStatementModal.add()
        } else {
          if (Object.keys(this.settleDomainItems).length === 0 || Object.keys(this.settleDomainOptions).length === 0) {
            this.$message.error(`"结算主体"${this.loadMessage}`)
            this.btnLoading.income = false;
            return false
          }
        }
        // 防止重复点击
        setTimeout(()=>{
          this.btnLoading.income = false
        },2000)
      },
      // 匹配收入【认领记录选结算单】
      handleMatchInAccountOfRecord: function(record) {
        if (String(record.reciveType) === '3') { // 事务性外包
          this.$refs.matchInAccountModal.title = '匹配收入'
          this.$refs.matchInAccountModal.edit(record)
          this.$refs.matchInAccountModal.loadData(1)
        } else {  // 纯收入
          this.$refs.matchInAccountOfNetIncomeModal.title = '匹配收入'
          this.$refs.matchInAccountOfNetIncomeModal.edit(record)
          this.$refs.matchInAccountOfNetIncomeModal.loadData(1)
        }
      },
      // 导出
      handleExport: function() {
        let requestExportXlsUrl = this.url.exportXlsUrl
        let queryParams =  this.getQueryParams()
        // 处理查询条件
        for (const key in queryParams) {
          if (String(key) !== 'current' && String(key) !== 'size') {
            requestExportXlsUrl += `&${key}=${queryParams[key]}`
          }
        }
        // 处理选中的
        if (this.selectedRowKeys.length > 0) {
          let idStr = ''
          for (let a = 0; a < this.selectedRowKeys.length; a++) {
            if (a === this.selectedRowKeys.length - 1) {
              idStr += this.selectedRowKeys[a]
            } else {
              idStr += `${this.selectedRowKeys[a]},`
            }
          }
          requestExportXlsUrl += `&idStr=${idStr}`
        }

        this.$refs.receiveRecordExportModal.title = '款项认领明细导出'
        this.$refs.receiveRecordExportModal.exportFields = this.exportFields
        this.$refs.receiveRecordExportModal.url.exportXlsUrl = requestExportXlsUrl
        this.$refs.receiveRecordExportModal.add()
      },
      // 替换入账金额,
      changeReciveFee1(e) {
        /* eslint-disable */
        const reciveFee = e.target.value.replace(/\,/g, '')
        this.queryParam.reciveFee1 = reciveFee
      },
      // 替换入账金额,
      changeReciveFee2(e) {
        /* eslint-disable */
        const reciveFee = e.target.value.replace(/\,/g, '')
        this.queryParam.reciveFee2 = reciveFee
      },
      // 数据字典
      initDictConfig() {
        // 状态
        initDictOptions('MATCHING_LIMIT').then((res) => {
          if (Number(res.code) === 200) {
            if (res.data.length > 0) {
              this.matchingLimit = res.data[0].label  // 默认取第一个
            }
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

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
