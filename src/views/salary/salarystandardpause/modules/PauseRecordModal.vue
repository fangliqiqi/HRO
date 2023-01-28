<template>
  <a-modal
    title="普通薪酬发放记录"
    :width="1200"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭"
    :maskClosable="false"
  >
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
    </a-table>
  </a-modal>
</template>
<script>
import { getAction,httpAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
export default {
  name:'PauseRecordModal',
  data() {
    return{
      visible:false,
      loading:false,
      dataSource:[],
      employList:[],
      bankOptions:[],
      chargeStatusOption:{
        '0':'待发放',
        '1':'已发放',
        '2':'发放失败',
        '3':'待审核',
        '4':'审核不通过',
        '5':'失败待认领',
        '6':'失败待发放',
        '7':'失败已发放',
        '8':'再次失败待认领',
      },
      changeTypeOption:{'0':'现金','1':'银付','2':'线下'},
      columns:[
        {
          title: '发放人',
          align: 'center',
          dataIndex: 'chargeUser',
          customRender: (text) => {
            for(let c in this.employList){
              if(c == text){
                return this.employList[c]
              }
            }
            return '-'
          }
        },
        {
          title: '发放时间',
          align: 'center',
          dataIndex: 'chargeDate',
        },
        {
          title: '发放金额',
          align: 'center',
          dataIndex: 'chargeMoney',
        },
        {
          title: '发放方式',
          align: 'center',
          dataIndex: 'chargeType',
          customRender: (text) => {
            return this.changeTypeOption[text]
          }
        },
        {
          title: '发放状态',
          align: 'center',
          dataIndex: 'chargeStatus',
          width:120,
          customRender: (text) => {
            return <a-tag class={'tagClass'+text}>{ this.chargeStatusOption[text] }</a-tag>
          }
        },
        {
          title: '收款卡号',
          align: 'center',
          dataIndex: 'bankNo',
        },
        {
          title: '收款单位',
          align: 'center',
          dataIndex: 'orgName',
        },
        {
          title: '收款银行',
          align: 'center',
          dataIndex: 'bankName',
          customRender: (text) => {
            const bankName = filterDictText(this.bankOptions, text)
            if(bankName == '-' && text){
              return text;
            }
            return bankName
          },
        },
        {
          title: '失败理由',
          align: 'left',
          dataIndex: 'remark',
          width:150,
          ellipsis: true,
          customRender: (text,record) => {
            let res = text;
            if(record.chargeStatus == 2){
              res = record.revenueRemark || record.remark;
            }else if(record.chargeStatus == 4){
              res = record.auditRemark || record.remark;
            }
            return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
          },
        }
      ],
      pauseOne:{},
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0
      },
      url:{
        list:''
      }
    }
  },
  methods:{
    show(record){
      this.initDictConfig()
      // httpAction('admin/user/findUserBypPrmission?permissionStr=wxhr:salarystandard_submit', '', 'GET').then((res) => {
      //   if(res.code == 200){
      //     this.employList = res.data
      //   }
      // })
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if(res.code == 200){
          this.employList = res.data
        }
      })
      this.pauseOne = record
      this.url.list = '/salary/tchargerecord/getSalaryPausePage?pauseSalaryId=' + record.id
      this.visible = true
      this.loading = true
      this.loadData()
    },
    loadData(){
      let param = {}
      param.current = this.ipagination.current
      param.size = this.ipagination.pageSize
      let params = filterObj(param)
      getAction(this.url.list, params).then((res) => {
        if (res.code === 200) {
          this.dataSource = res.data.records
          this.ipagination.total = res.data.total
          this.loading = false;
        }
      })
    },
    handleTableChange(pagination) {
      this.ipagination = pagination
      this.loadData()
    },
    handleCancel(){
      this.visible = false
    },
    handleOk(){
      this.visible = false
    },
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then((res) => {
        if (res.code === 200) {
          this.bankOptions = res.data
        }
      })
    },
  }
}
</script>
<style scoped src="@/assets/less/tag.css"></style>
