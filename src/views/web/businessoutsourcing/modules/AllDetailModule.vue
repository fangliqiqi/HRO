<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    style="top: 20px;"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
      <a-button
        v-if="audit"
        key="audit"
        type="primary"
        @click="handleOk"
      >审核</a-button>
    </template>

    <a-tabs
      :activeKey="activeKey"
      @change="tabsChange"
    >
      <a-tab-pane
        :forceRender="true"
        tab="详情"
        key="1"
      >
        <page-layout
          :title="model.businessName"
          logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png"
        >
          <a-card
            style="margin-top: 24px"
            :bordered="false"
            title="基本信息"
          >
            <detail-list :col="2">
              <detail-list-item term="客户单位">{{ model.customerName ? model.customerName : '-' }}</detail-list-item>
              <detail-list-item term="关联合同">{{ model.unitContractId ? model.unitContractId : '-' }}</detail-list-item>
              <detail-list-item term="结算主体">{{ model.departName ? model.departName : '-' }}</detail-list-item>
              <detail-list-item term="服务项目">
                <a-tag
                  v-for="item in model.moutsourcingItemVos"
                  :key="item.id"
                >{{ item.itemName }}</a-tag>
              </detail-list-item>
              <detail-list-item term="业务对接人">{{ model.dockingPerson ? model.dockingPerson : '-' }}</detail-list-item>
              <detail-list-item term="业务创建日期">{{ model.createTime ? model.createTime : '-' }}</detail-list-item>
            </detail-list>
            <detail-list :col="2">
              <detail-list-item term="对接人联系方式">{{ model.dockingPhone ? model.dockingPhone : '-' }}</detail-list-item>
              <detail-list-item term="业务开发人">{{ model.businessPersion ? model.businessPersion : '-' }}</detail-list-item>
              <detail-list-item term="服务客服">{{ model.customerService ? model.customerService : '-' }}</detail-list-item>
              <detail-list-item term="备注">{{ model.remark ? model.remark : '-' }}</detail-list-item>
            </detail-list>
          </a-card>

          <a-card
            style="margin-top: 24px"
            :bordered="false"
            title="结算信息"
          >
            <div>
              <a-table
                bordered
                rowKey="id"
                :columns="settleBillColumns"
                :dataSource="settleBillData"
                :pagination="false"
              >
                <template
                  slot="operation"
                  slot-scope="text, record, index"
                >
                  <div class="editable-row-operations">
                    <span v-if="settleBillCostingShow">
                      <span><a @click="() => settleBillCosting(index)">成本明细</a></span>
                      <a-divider type="vertical" />
                    </span>
                    <span><a @click="() => settleBill(index)">结算单</a></span>
                  </div>
                </template>
              </a-table>
            </div>
          </a-card>

          <a-card
            style="margin-top: 24px"
            :bordered="false"
            title="收入归属"
          >
            <div>
              <a-table
                bordered
                rowKey="id"
                :columns="incomeBelonngColumns"
                :dataSource="settleBillInnerVo.incomeBelongVos"
                :pagination="false"
              >
                <template
                  slot="operation"
                  slot-scope="text, record, index"
                >
                  <div class="editable-row-operations">
                    <span v-if="(settleBillInnerVo.incomeBelongVos && (settleBillInnerVo.incomeBelongVos[index].costingPaymentIncomes).length > 0) ? true : false">
                      <a @click="() => incomeBelongCosting(index)">成本明细</a>
                    </span>
                    <span v-else> - </span>
                  </div>
                </template>
              </a-table>
            </div>
          </a-card>
        </page-layout>
      </a-tab-pane>

      <a-tab-pane
        :forceRender="true"
        tab="流程进展明细"
        key="2"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="auditForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col :span="24">
                <template v-if="auditList.length > 0">
                  <a-timeline style="margin-left: 50px">
                    <template v-for="(list, key) in auditList">
                      <a-timeline-item
                        :key="key"
                        :color="auditStatusOptions[list.auditStatus].color"
                      >
                        <p>{{ list.auditRemark ? list.auditRemark : '' }}</p>
                        <p>{{ list.auditUser ? list.auditUser : '' }}</p>
                        <p>{{ list.auditTime ? list.auditTime : '' }}</p>
                      </a-timeline-item>
                    </template>
                  </a-timeline>
                </template>
                <template v-else>
                  <section class="code-box-demo">
                    <div class="ant-empty">
                      <div class="ant-empty-image">
                        <img
                          alt="暂无数据"
                          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE1MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQgMzEuNjcpIj4KICAgICAgPGVsbGlwc2UgZmlsbC1vcGFjaXR5PSIuOCIgZmlsbD0iI0Y1RjVGNyIgY3g9IjY3Ljc5NyIgY3k9IjEwNi44OSIgcng9IjY3Ljc5NyIgcnk9IjEyLjY2OCIvPgogICAgICA8cGF0aCBkPSJNMTIyLjAzNCA2OS42NzRMOTguMTA5IDQwLjIyOWMtMS4xNDgtMS4zODYtMi44MjYtMi4yMjUtNC41OTMtMi4yMjVoLTUxLjQ0Yy0xLjc2NiAwLTMuNDQ0LjgzOS00LjU5MiAyLjIyNUwxMy41NiA2OS42NzR2MTUuMzgzaDEwOC40NzVWNjkuNjc0eiIgZmlsbD0iI0FFQjhDMiIvPgogICAgICA8cGF0aCBkPSJNMTAxLjUzNyA4Ni4yMTRMODAuNjMgNjEuMTAyYy0xLjAwMS0xLjIwNy0yLjUwNy0xLjg2Ny00LjA0OC0xLjg2N0gzMS43MjRjLTEuNTQgMC0zLjA0Ny42Ni00LjA0OCAxLjg2N0w2Ljc2OSA4Ni4yMTR2MTMuNzkyaDk0Ljc2OFY4Ni4yMTR6IiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMy41NikiLz4KICAgICAgPHBhdGggZD0iTTMzLjgzIDBoNjcuOTMzYTQgNCAwIDAgMSA0IDR2OTMuMzQ0YTQgNCAwIDAgMS00IDRIMzMuODNhNCA0IDAgMCAxLTQtNFY0YTQgNCAwIDAgMSA0LTR6IiBmaWxsPSIjRjVGNUY3Ii8+CiAgICAgIDxwYXRoIGQ9Ik00Mi42NzggOS45NTNoNTAuMjM3YTIgMiAwIDAgMSAyIDJWMzYuOTFhMiAyIDAgMCAxLTIgMkg0Mi42NzhhMiAyIDAgMCAxLTItMlYxMS45NTNhMiAyIDAgMCAxIDItMnpNNDIuOTQgNDkuNzY3aDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI0SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjR6TTQyLjk0IDYxLjUzaDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI1SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjV6TTEyMS44MTMgMTA1LjAzMmMtLjc3NSAzLjA3MS0zLjQ5NyA1LjM2LTYuNzM1IDUuMzZIMjAuNTE1Yy0zLjIzOCAwLTUuOTYtMi4yOS02LjczNC01LjM2YTcuMzA5IDcuMzA5IDAgMCAxLS4yMjItMS43OVY2OS42NzVoMjYuMzE4YzIuOTA3IDAgNS4yNSAyLjQ0OCA1LjI1IDUuNDJ2LjA0YzAgMi45NzEgMi4zNyA1LjM3IDUuMjc3IDUuMzdoMzQuNzg1YzIuOTA3IDAgNS4yNzctMi40MjEgNS4yNzctNS4zOTNWNzUuMWMwLTIuOTcyIDIuMzQzLTUuNDI2IDUuMjUtNS40MjZoMjYuMzE4djMzLjU2OWMwIC42MTctLjA3NyAxLjIxNi0uMjIxIDEuNzg5eiIgZmlsbD0iI0RDRTBFNiIvPgogICAgPC9nPgogICAgPHBhdGggZD0iTTE0OS4xMjEgMzMuMjkybC02LjgzIDIuNjVhMSAxIDAgMCAxLTEuMzE3LTEuMjNsMS45MzctNi4yMDdjLTIuNTg5LTIuOTQ0LTQuMTA5LTYuNTM0LTQuMTA5LTEwLjQwOEMxMzguODAyIDguMTAyIDE0OC45MiAwIDE2MS40MDIgMCAxNzMuODgxIDAgMTg0IDguMTAyIDE4NCAxOC4wOTdjMCA5Ljk5NS0xMC4xMTggMTguMDk3LTIyLjU5OSAxOC4wOTctNC41MjggMC04Ljc0NC0xLjA2Ni0xMi4yOC0yLjkwMnoiIGZpbGw9IiNEQ0UwRTYiLz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0OS42NSAxNS4zODMpIiBmaWxsPSIjRkZGIj4KICAgICAgPGVsbGlwc2UgY3g9IjIwLjY1NCIgY3k9IjMuMTY3IiByeD0iMi44NDkiIHJ5PSIyLjgxNSIvPgogICAgICA8cGF0aCBkPSJNNS42OTggNS42M0gwTDIuODk4LjcwNHpNOS4yNTkuNzA0aDQuOTg1VjUuNjNIOS4yNTl6Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                        >
                      </div>
                      <p class="ant-empty-description">暂无流程数据</p>
                    </div>
                  </section>
                </template>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>
    </a-tabs>
    <audit-module
      ref="auditModal"
      @ok="auditModalOk"
    ></audit-module>
    <costing-payment-detail-module ref="detalModal"></costing-payment-detail-module>
    <settle-bill-preview-detail ref="billPreviewModal"></settle-bill-preview-detail>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import { mixinDevice } from '@/utils/mixin.js'
import PageLayout from '@/components/page/PageLayout'
import DetailList from '@/components/tools/DetailList'
import CostingPaymentDetailModule from './CostingPaymentDetailModule'
import SettleBillPreviewDetail from './SettleBillPreviewDetail'
import AuditModule from './AuditModule'

const DetailListItem = DetailList.Item

const settleBillColumns = [
  {
    title: '业务收入',
    dataIndex: 'income',
    width: '25%',
    align: 'center',
    scopedSlots: { customRender: 'income' },
  },
  {
    title: '税金',
    dataIndex: 'taxAmount',
    width: '20%',
    align: 'center',
    scopedSlots: { customRender: 'taxAmount' },
  },
  {
    title: '开票金额',
    dataIndex: 'ticketAmount',
    align: 'center',
    scopedSlots: { customRender: 'ticketAmount' },
    width: '15%',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '25%',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
  },
];

const incomeBelonngColumns = [
  {
    title: '收入归属',
    dataIndex: 'incomeBelong',
    width: '55%',
    align: 'center',
  },
  {
    title: '分成比例',
    dataIndex: 'devidedProp',
    width: '15%',
    align: 'center',
    scopedSlots: { customRender: 'devidedProp' },
  },
  {
    title: '分成金额',
    dataIndex: 'incomeAmount',
    scopedSlots: { customRender: 'incomeAmount' },
    width: '15%',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '15%',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
  },
];

export default {
  name: 'AllDetailModule',
  components: {
    SettleBillPreviewDetail,
    CostingPaymentDetailModule,
    PageLayout,
    DetailList,
    DetailListItem,
    AuditModule,
  },
  props: {
    rowKey: {
      type: String,
      default: ''
    },
  },
  mixins: [mixinDevice],
  data() {
    return {
      title: "详情",
      visible: false,
      model: {},
      audit: false,
      sysUsers: [],
      organs: [],
      activeKey: '1', // 默认第一个tab
      settleBillData: [],
      settleBillCostingShow: false,  // 结算信息‘成本明细’是否显示
      auditForm: this.$form.createForm(this),
      settleBillColumns,
      incomeBelonngColumns,
      settleDomainInfo: {},
      settleBillInnerVo: {},
      confirmLoading: false,
      auditList: [],  // 列表数据
      auditStatusOptions: {
        '0': {'option': '申请', 'color': 'blue'},
        '1': {'option': '审核通过', 'color': 'green'},
        '2': {'option': '审核不通过', 'color': 'red'},
        '3': {'option': '待审核', 'color': 'orange'},
      },
      url:{
        settleBillDetail:'/salary/tinvoice/openOneTimeInvoiceBySettleBillId', // 查看结算单
      }
    }
  },
  methods: {
    show(record, auditProcessUrl = '') {
      this.auditForm.resetFields()
      this.model = Object.assign({}, record)
      if(this.model.settleBillVo != null) {
        this.settleBillData.push(this.model.settleBillVo)

        if(this.settleBillData.length > 0) {
          this.settleBillData[0].tax = this.settleDomainInfo.departSettlementInfo.taxFee + "%"
        }

        if ((this.settleBillData[0].costingPayments).length > 0) {
          this.settleBillCostingShow = true
        }
      }

      if(this.model.settleBillInnerVo != null) {
        this.settleBillInnerVo = this.model.settleBillInnerVo;
        if (this.settleBillInnerVo.incomeBelongVos) {
          for (let i = 0; i < (this.settleBillInnerVo.incomeBelongVos).length; i++) {
            (this.settleBillInnerVo.incomeBelongVos)[i].devidedProp += "%"
            for (const item of this.organs) {
              if (String((this.settleBillInnerVo.incomeBelongVos)[i].incomeBelong) === String(item.id)) {
                (this.settleBillInnerVo.incomeBelongVos)[i].incomeBelong = item.organName
                break
              }
            }
          }
        } else {
          this.settleBillInnerVo.incomeBelongVos = []
        }
      }
      for(let i = 0; i < this.sysUsers.length; i++) {
        if(String(this.model.businessPersion) === String(this.sysUsers[i].userId)) {
          this.model.businessPersion = this.sysUsers[i].nickname;
        }
        if(String(this.model.customerService) === String(this.sysUsers[i].userId)) {
          this.model.customerService = this.sysUsers[i].nickname;
        }
      }
      // 流程进展明细
      if (auditProcessUrl) {
        httpAction(auditProcessUrl + this.model.id, '', 'GET').then((res) => {
          if (Number(res.code) === 200 && res.data) {
            this.auditList = res.data
          }
        })
      }
      this.visible = true;
    },
    handleOk() {
      this.$refs.auditModal.showModal(this.model.id);
    },
    handleCancel() {
      this.$emit('close')
      this.audit = false
      this.visible = false;
      this.activeKey = '1'  //默认第一个tab
      this.settleBillData = []
      this.auditList = []  // 列表数据
      this.settleBillCostingShow = false  // 结算信息‘成本明细’是否显示
    },
    settleBillCosting() {
      let columns = [
        {
          title: '支出名目',
          dataIndex: 'name',
          width: '30%',
          align: 'center',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '支出金额（不含税）',
          dataIndex: 'amount',
          width: '30%',
          align: 'center',
          scopedSlots: { customRender: 'amount' },
        },
      ]
      this.$refs.detalModal.costingData = this.settleBillData[0].costingPayments;
      this.$refs.detalModal.costingColumns = columns;
      this.$refs.detalModal.show();
    },
    // 点击查看结算单
    settleBill() {
      const requestUrl = `${this.url.settleBillDetail}?settleBillId=${this.model.settleBillVo.id}&settleFormType=4`
      httpAction(requestUrl,{},'GET').then((res) => {
        if(Number(res.code) === 200){
          this.$refs.billPreviewModal.show(this.model,this.model,res.data);
        }else{
          this.$message.warning(res.msg || '结算单数据获取失败')
        }
      })
    },
    incomeBelongCosting(index) {
      let columns = [
        {
          title: '支出名目',
          dataIndex: 'name',
          width: '30%',
          align: 'center',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '支出金额（不含税）',
          dataIndex: 'amount',
          width: '30%',
          align: 'center',
          scopedSlots: { customRender: 'amount' },
        },
      ]
      this.$refs.detalModal.costingData = this.settleBillInnerVo.incomeBelongVos[index].costingPaymentIncomes;
      this.$refs.detalModal.costingColumns = columns;
      this.$refs.detalModal.show();
    },
    auditModalOk() {
      this.$emit('ok')
      this.audit = false
      this.visible = false;
      this.activeKey = '1'  //默认第一个tab
      this.settleBillData = []
      this.auditList = []  // 列表数据
    },
    // tab切换
    tabsChange(e) {
      this.activeKey = e
    },
  }
}
</script>

<style scoped>
.ant-advanced-search-form .code-box-demo {
  padding: 42px 24px 50px;
  color: rgba(0, 0, 0, 0.65);
}
.ant-advanced-search-form .ant-empty {
  margin: 0 8px;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
}
.ant-advanced-search-form .ant-empty-description {
  margin: 0;
}
</style>
