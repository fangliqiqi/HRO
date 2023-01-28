<template>
  <a-modal
    :title="title"
    :width="1000"
    :closable="true"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="false"
    @cancel="handleCancel"
    @ok="handleCancel"
  >
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24" type="flex" justify="end">
            <a-col
              :md="8"
              :sm="10"
            >
              <a-form-item label="单位">
                <select-page
                  :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                  :title="'customerName'"
                  :placeholder="'请输入单位'"
                  v-model="queryParam.unitId"
                  :id="'id'"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col
              :md="8"
              :sm="10"
            >
              <a-form-item label="姓名">
                <a-input v-model="queryParam.empName" placeholder="请输入姓名" />
              </a-form-item>
            </a-col>
            <a-col
              :md="8"
              :sm="10"
            >
              <a-form-item label="身份证号">
                <a-input v-model="queryParam.empIdcard" placeholder="请输入身份证号" />
              </a-form-item>
            </a-col>
            <a-col
              :md="8"
              :sm="10"
            >
              <a-form-item label="联系方式">
                <a-input v-model="queryParam.empPhone" placeholder="请输入联系方式" />
              </a-form-item>
            </a-col>
            <a-col
              :md="8"
              :sm="10"
            >
              <a-form-item label="发送时间">
                <a-range-picker @change="changeRange" v-model="queryParam.range" style="width: 100%" format="YYYY-MM-DD" :placeholder="['开始时间','结束时间']"/>
              </a-form-item>
            </a-col>
            <a-col
              :md="8"
              :sm="10"
            >
              <a-form-item label="发送状态">
                <a-select style="width: 100%" placeholder="请选择发送状态" v-model="queryParam.sendStatus">
                  <a-select-option
                    v-for="(item,key) in sendStatusOption"
                    :key="key"
                    :value="key">{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="5"
              :sm="7"
            >
              <span
                style="float: left;overflow: hidden;text-align:right;"
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
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="column"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="confirmLoading"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleSend(record)">再次发送</a>
        </span>
      </a-table>
    </a-card>
  </a-modal>
</template>

<script>
import { httpAction,getAction } from '@/api/manage'
import SelectPage from '@/components/jeecg/SelectPage'
import { filterObj } from '@/utils/util'

export default {
  name: 'GreetingMessageRecordModal',
  props: {
    title:{
      type: String,
      default: '操作',
      required: false
    },
  },
  components:{
    SelectPage
  },
  data() {
    return {
      model: {},
      visible: false,
      confirmLoading: false,
      dataSource:[],
      queryParam:{orders:[]},
      ipagination:{
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0
      },
      column:[
        {
          title: '单位',
          align: 'center',
          dataIndex: 'unitName',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'empName',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '身份证',
          align: 'center',
          dataIndex: 'empIdcard',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '联系方式',
          align: 'center',
          dataIndex: 'empPhone',
          customRender: text => {
            return (
              <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            )
          }
        },
        {
          title: '发送时间',
          align: 'center',
          dataIndex: 'sendDate',
          customRender: text => {
            let res = text ? text.substring(0, 10) : '-'
            return (
              <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            )
          }
        },
        {
          title: '发送状态',
          align: 'center',
          dataIndex: 'sendStatus',
          customRender: text => {
            const res = this.sendStatusOption[text]
            return (
              <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            )
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list:'/hrBase/tsmsemployee/page',
      },
      sendStatusOption:{
        '3': '发送成功',
        '2': '发送失败',
        '1': '等待回执',
      }
    }
  },
  methods: {
    show(id){
      this.url.list = `/hrBase/tsmsemployee/page?smsInfoId=${id}`
      this.visible = true
      this.loadRemoteData(1)
    },
    handleSend(record){
      const _this = this
       this.$confirm({
        title: '是否确认发送？',
        onOk() {
          const param = {id:record.id,smsInfoId:record.smsInfoId}
          httpAction(`/hrBase/tsmsemployee/sendSms`,param,'post',60000).then(res=>{
            if(res.code === 200){
              _this.$message.success('发送成功!')
              _this.loadRemoteData()
            }else{
              _this.$message.warn(res.msg)
            }
          })
        },
      })
    },
    // eslint-disable-next-line
    changeRange(date, dateString){
      this.queryParam.sendDateStart = dateString[0]
      this.queryParam.sendDateEnd = dateString[1]
    },
    handleTableChange(pagination){
      this.ipagination = pagination
      this.loadRemoteData(pagination.current)
    },
    searchQuery(){
      this.loadRemoteData()
    },
    searchReset(){
      this.queryParam = {}
      this.loadRemoteData()
    },
    handleParams(){
      this.queryParam.current = this.ipagination.current
      this.queryParam.size = this.ipagination.pageSize
      // eslint-disable-next-line
      return filterObj(_.cloneDeep(this.queryParam))
    },
    loadRemoteData(page){
      this.ipagination.current = page ? page : 1
      const param = this.handleParams()
      delete param.range
      this.confirmLoading = true
      const qs = require('qs')
      const params = qs.stringify(param)
      
      httpAction(`${this.url.list}&orders%5B0%5D.asc=false&orders%5B0%5D.column=send_date&${params}`,null,'get').then((res) => {
        if(res.code === 200){
          this.dataSource = res.data.records
          this.ipagination.total = res.data.total
        }else{
          this.$message.warn(res.msg)
        }
      }).finally(()=>{
        this.confirmLoading = false
      })
    },
    handleCancel(){
      this.visible = false
      this.queryParam = {}
      this.dataSource = []
    }
  }

}
</script>