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
            <a-form-item label="保单号">
              <a-input
                placeholder="请输入保单号"
                v-model="queryParam.policyNo"
              ></a-input>
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
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        :scroll="{ x: 1}"
      >
        <span
          slot="status"
          slot-scope="text"
        >
          <a-tag :color="color[text]">{{ statusOptions[text] }}</a-tag>
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleAudit(record)">审核</a>
          <a-divider type="vertical"/>
          <a @click="handleAttach(record)">查看附件</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <a-modal :visible="visible" title="附件" @ok="handleOk" @cancel="handleCancel" :destroyOnClose="true">
      <a-upload
        :defaultFileList="fileAttach"
        listType="picture"
        :showUploadList="{showRemoveIcon:false}"
      >
      </a-upload>
    </a-modal>
    <!-- 表单区域 -->
    <back-list-modal ref="BackListModalForm" @ok="modalFormOk"></back-list-modal>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BackListModal from './modules/BackListModal' //派单申请详情
  
  import { httpAction } from '@/api/manage'

  export default {
    name: 'InsuranceBackAudit',
    mixins: [JeecgListMixin],
    components: {
      BackListModal,
    },
    data() {
      return {
        description: '商险派单查询',
        statusOptions: ['待提交','待审核','审核通过','审核不通过'], //状态
        color:['orange','#e08d33','green','red'],
        // 表头
        columns: [
          {
            width: 200,
            ellipsis: true,
            title: '退保编码',
            align: 'center',
            dataIndex: 'refundNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width: 200,
            ellipsis: true,
            title: '保单号',
            align: 'center',
            dataIndex: 'policyNo',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:160,
            ellipsis: true,
            title: '保险公司',
            align: 'center',
            dataIndex: 'insuranceCompanyName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:180,
            ellipsis: true,
            title: '险种',
            align: 'center',
            dataIndex: 'insuranceTypeName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:200,
            ellipsis: true,
            title: '保单生效时间',
            align: 'center',
            dataIndex: 'policyEffect',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:200,
            ellipsis: true,
            title: '保单结束时间',
            align: 'center',
            dataIndex: 'policyEnd',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:130,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            width:170,
            ellipsis: true,
            title: '创建人',
            align: 'center',
            dataIndex: 'createUser',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:170,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:120,
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed:'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/tinsurancerefund/audit/page', //列表请求地址
          queryAllInfoById: '/busiInsurance/tinsurancerefund/', //详情
        },
        fileAttach:[],
        visible:false
      }
    },
    methods: {
      
      handleAttach(record){
        httpAction(this.url.queryAllInfoById+record.id,null,'get').then(res=>{
          if(res.code === 200 && res.data){
            this.fileAttach = res.data.atta.map(item=>{
              return {
                uid:item.id,
                name:item.attaName,
                url:item.attaUrl,
                status: 'done',
              }
            })
            this.visible = true
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      handleAudit: function(record) {
        httpAction(this.url.queryAllInfoById+record.id,null,'get').then(res=>{
          if(res.code === 200){
            res.data.insuranceCompanyName = record.insuranceCompanyName
            res.data.insuranceTypeName = record.insuranceTypeName
            this.$refs.BackListModalForm.title = '退保审核'
            this.$refs.BackListModalForm.auditBtn = true
            this.$refs.BackListModalForm.show(res.data)
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      handleOk(){
        this.visible = false
      },
      handleCancel(){
        this.visible = false
        this.fileAttach = []
      },
      // 数据字典
      initDictConfig() {
        
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

</style>
