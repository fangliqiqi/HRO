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
            <a-form-item label="状态">
              <a-select
                v-model="queryParam.status"
                placeholder="请选择"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option
                  v-for="(item, index) in statusOptions"
                  :key="index"
                  :value="index"
                >{{ item }}</a-select-option>
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
        :scroll="{x:1}"
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
          <a @click="handleDetail(record)" v-if="record.status == 0">提交</a>
          <a @click="handleShow(record)" v-if="record.status == 3">查看</a>
          <a-divider
            type="vertical"
            v-if="record.status == 3"
          />
          <a-popconfirm
            title="确定删除吗?"
            v-if="record.status == 3"
            @confirm="() => handleDelete(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>

        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <back-list-modal ref="BackListModalForm" @ok="modalFormOk"></back-list-modal>
    <show-attach-modal ref="ShowAttachModalForm"></show-attach-modal>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BackListModal from './modules/BackListModal'
  import ShowAttachModal from './modules/ShowAttachModal'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'InsuranceBackSubmit',
    mixins: [JeecgListMixin],
    components: {
      BackListModal,
      ShowAttachModal
    },
    data() {
      return {
        description: '退保待提交列表',
        statusOptions: ['待提交','待审核','审核通过','审核不通过'], //状态
        color:['orange','#e08d33','green','red'],
        // 表头
        columns: [
          {
            width: 150,
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
            width:200,
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
            width:200,
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
            width:150,
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
            width:130,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            width:80,
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
            width:80,
            ellipsis: true,
            title: '审核人',
            align: 'center',
            dataIndex: 'auditUser',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:150,
            ellipsis: true,
            title: '审核时间',
            align: 'center',
            dataIndex: 'auditTime',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:100,
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed:'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/tinsurancerefund/submit/page', //列表请求地址
          queryAllInfoById: '/busiInsurance/tinsurancerefund/', //详情
          delete:'/busiInsurance/tinsurancerefund/'
        }
      }
    },
    methods: {
      // 详情
      handleDetail: function(record) {
        httpAction(this.url.queryAllInfoById+record.id,null,'get').then(res=>{
          if(res.code === 200){
            res.data.insuranceCompanyName = record.insuranceCompanyName
            res.data.insuranceTypeName = record.insuranceTypeName
            this.$refs.BackListModalForm.submitBtn = true
            this.$refs.BackListModalForm.downBtn = true
            this.$refs.BackListModalForm.title = '退保提交'
            this.$refs.BackListModalForm.show(res.data)
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      handleShow(record){
        httpAction(this.url.queryAllInfoById+record.id,null,'get').then(res=>{
          if(res.code === 200){
            this.$refs.ShowAttachModalForm.show(res.data)
          }else{
            this.$message.warning(res.msg)
          }
        })
      }
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
