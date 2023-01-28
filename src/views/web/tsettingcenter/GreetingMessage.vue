<template>
  <a-card :bordered="false">

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
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical"/>
          <a @click="handleSend(record)" v-if="record.sendType == 1" :loading="btnLoading">发送<a-divider type="vertical"/></a>
          <a
            @click="sendRecord(record)"
          >发送记录</a>
          <a-divider type="vertical" v-has="'wxhr:tsmsinfo_edit'"/>
          <a @click="handleEdit(record)" v-has="'wxhr:tsmsinfo_edit'">编辑</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <greeting-message-modal @ok="modalFormOk" ref="GreetingMessageForm" :showBtn="showBtn" :title="modelTitle" :industryBelongOptions="industryBelongDictOptions"></greeting-message-modal>
    <greeting-message-record-modal @ok="modalFormOk" ref="GreetingMessageRecordForm" :title="modelTitle"></greeting-message-record-modal>
    
  </a-card>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import GreetingMessageModal from './modules/GreetingMessageModal'
  import GreetingMessageRecordModal from './modules/GreetingMessageRecordModal'
  import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'


  export default {
    name: 'GreetingMessage',
    mixins: [JeecgListMixin],
    components: {
      GreetingMessageModal,
      GreetingMessageRecordModal
    },
    data() {
      return {
        description: '问候短信',
        smsTypeOption:[], // 短信类型
        industryBelongDictOptions:[],
        modelTitle:'',
        // 表头
        columns: [
          {
            title: '短信类型',
            align: 'center',
            dataIndex: 'smsType',
            customRender:(text) => {
              const str = text ? filterDictText(this.smsTypeOption, text) : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            title: '模板CODE',
            align: 'center',
            dataIndex: 'modelCode',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            title: '发送方式',
            align: 'center',
            dataIndex: 'sendType',
            customRender:(text) => {
              const str = String(text) === '1' ? '手动' : '自动'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 230,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: '/hrBase/tsmsinfo/page',
        },
        showBtn:true,
        btnLoading:false,
      }
    },
    methods: {
      sendRecord(record) {
        this.modelTitle = `${filterDictText(this.smsTypeOption, record.smsType)}-发送记录`
        this.$refs.GreetingMessageRecordForm.show(record.id)
      },
      handleSend(record){
        const _this = this
        _this.btnLoading = true
        this.$confirm({
          title: '是否确认发送？',
          onOk() {
            httpAction(`/hrBase/tsmsemployee/batchSendSmsBySmsInfoId?smsInfoId=${record.id}`,null,'post',60000).then(res=>{
              if(res.code === 200){
                _this.$message.success('发送成功!10分钟后可查看发送结果。')
              }else{
                _this.$message.warn(res.msg)
              }
            }).finally(()=>{
              _this.btnLoading = false
            })
          },
          onCancel(){
            _this.btnLoading = false
          }
        })
      },
      handleEdit(record){
        this.showBtn = true
        httpAction(`/hrBase/tsmsinfo/${record.id}`,null,'get').then(res=>{
          if(res.code === 200){
            this.modelTitle = `${filterDictText(this.smsTypeOption, record.smsType)}-编辑`
            this.$refs.GreetingMessageForm.show(res.data)
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      // 详情
      handleDetail(record) {
        this.showBtn = false
        httpAction(`/hrBase/tsmsinfo/${record.id}`,null,'get').then(res=>{
          if(res.code === 200){
            this.modelTitle = `${filterDictText(this.smsTypeOption, record.smsType)}-详情`
            this.$refs.GreetingMessageForm.show(res.data)
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      // 数据字典
      initDictConfig() {
        initDictOptions('sms_type').then((res) => {
          if (Number(res.code) === 200) {
            this.smsTypeOption = res.data
          }
        })
        // 行业类型
        initDictOptions('industryBelong').then((res) => {
          if (res.code === 200) {
            this.industryBelongDictOptions = res.data
          }
        })
      },
      
    }
  }
</script>
<style lang="less" scoped>
  .ant-btn{
    margin-bottom: 15px;
  }
</style>
