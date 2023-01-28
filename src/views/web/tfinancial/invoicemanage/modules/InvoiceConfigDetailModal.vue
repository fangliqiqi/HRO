<template>
  <a-modal
    :title="title"
    :width="900"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    wrapClassName="invoiceDetailModal"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
    </template>
    <a-card :bordered="false">
      <template v-if="pageType === 1">
        <detail-list :col="2">
          <detail-list-item term="开票对象">{{ gradeType[dataInfo.grade] || '-' }}</detail-list-item>
          <detail-list-item term="发票类型">{{ invKindType[dataInfo.invKind] || '-' }}</detail-list-item>
        </detail-list>
        <detail-list :col="2">
          <detail-list-item term="客户单位">{{ dataInfo.customerName || '-' }}</detail-list-item>
          <detail-list-item term="结算主体">{{ dataInfo.settleName || '-' }}</detail-list-item>
        </detail-list>
        <detail-list :col="2">
          <detail-list-item term="购买方名称">{{ dataInfo.ticketTableHead || '-' }}</detail-list-item>
          <detail-list-item term="纳税人识别号">{{ dataInfo.taxpayerIdentificationNo || '-' }}</detail-list-item>
        </detail-list>
        <detail-list :col="2">
          <detail-list-item term="开户行">{{ dataInfo.bankName || '-' }}</detail-list-item>
          <detail-list-item term="银行卡号">{{ dataInfo.bankNo || '-' }}</detail-list-item>
        </detail-list>
        <detail-list :col="2">
          <detail-list-item term="地址">{{ dataInfo.addr || '-' }}</detail-list-item>
          <detail-list-item term="电话">{{ dataInfo.phone || '-' }}</detail-list-item>
        </detail-list>
      </template>
      <detail-list
        :col="2"
        v-else-if="pageType === 2"
      >
        <detail-list-item term="销售方名称">{{ dataInfo.company || '-' }}</detail-list-item>
        <detail-list-item term="纳税人识别号">{{ dataInfo.taxNb || '-' }}</detail-list-item>
        <detail-list-item term="开户行">{{ dataInfo.bank || '-' }}</detail-list-item>
        <detail-list-item term="银行卡号">{{ dataInfo.bankNo || '-' }}</detail-list-item>
        <detail-list-item term="开票人">{{ dataInfo.invoicePerson || '-' }}</detail-list-item>
        <detail-list-item term="审核人">{{ dataInfo.invoiceChecker || '-' }}</detail-list-item>
        <detail-list-item term="收款人">{{ dataInfo.invoicePayee || '-' }}</detail-list-item>
        <detail-list-item term="复核人">{{ dataInfo.invoiceReviewer || '-' }}</detail-list-item>
        <detail-list-item term="地址">{{ dataInfo.address || '-' }}</detail-list-item>
        <detail-list-item term="电话">{{ dataInfo.tel || '-' }}</detail-list-item>
        <detail-list-item term="状态">{{ Number(dataInfo.status) === 0?"启用":"禁用" }}</detail-list-item>
      </detail-list>
      <detail-list
        :col="2"
        v-else-if="pageType === 3"
      >
        <detail-list-item term="开票类型">{{ invKindType[dataInfo.type] || '-' }}</detail-list-item>
        <detail-list-item term="单张普票限额">{{ dataInfo.generalTicketLimit || '-' }}</detail-list-item>
        <detail-list-item term="单张专票限额">{{ dataInfo.specialTicketLimit || '-' }}</detail-list-item>
        <detail-list-item term="开票单位">{{ dataInfo.invoiceUnit }}</detail-list-item>
        <detail-list-item term="状态">{{ Number(dataInfo.status) === 0?"启用":"禁用" }}</detail-list-item>
      </detail-list>
      <detail-list
        :col="2"
        v-else-if="pageType === 4"
      >
        <detail-list-item term="公司名称">{{ dataInfo.invoiceAddressSet.company || '-' }}</detail-list-item>
        <detail-list-item term="打印人">{{ dataInfo.printUserName || '-' }}</detail-list-item>
        <detail-list-item term="证书密码">{{ dataInfo.invoiceAddressSet.certPassword || '-' }}</detail-list-item>
        <detail-list-item term="分机号">{{ dataInfo.invoiceAddressSet.fjh || '-' }}</detail-list-item>
        <detail-list-item term="访问地址">{{ dataInfo.invoiceAddressSet.url || '-' }}</detail-list-item>
        <detail-list-item term="打印机位置信息">{{ dataInfo.invoiceAddressSet.printMachineAddr || '-' }}</detail-list-item>
        <detail-list-item term="状态">{{ Number(dataInfo.invoiceAddressSet.status) === 0?"启用":"禁用" }}</detail-list-item>
      </detail-list>
    </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tools/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: {
    DetailList,
    DetailListItem
  },
  data() {
    return {
      title: '操作',
      visible: false,
      pageType: 1, // type:1:购买方 2：销售方 3：开票限额 4：公司开票打印地址 5：商品编码
      gradeType: { '0': '结算主体', '1': '客户单位' }, // 开票对象
      invKindType: {}, // 发票类型
      settlementOptions: [], // 存储所有结算主体和客户单位
      dataInfo: {} // 详情数据
    }
  },
  methods: {
    show(type) {
      this.visible = true
      this.pageType = type
      if (Number(this.pageType) === 4) {
        // 打印地址配置，处理打印人显示信息
        let printer = ''
        this.dataInfo.addrPerRelList.forEach(item => {
          printer += `${item.printUserName},`
        })
        this.dataInfo.printUserName = printer
      }
    },
    // 获取客户单位名称
    getCustomName() {
      const record = this.dataInfo
      const str =
        Object.keys(this.settlementOptions).length && this.settlementOptions.hasOwnProperty(record.settleId)
          ? this.settlementOptions[record.settleId]['customerName']
          : '-'
      return str
    },
    // 关闭
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
