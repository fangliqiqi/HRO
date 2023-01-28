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
            <a-form-item label="导入人">
              <select-page
                :searchUrl="'admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                placeholder="请选择导入人"
                :id="'userId'"
                v-model="queryParam.diyReceiptUser"
                style="width:100%"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="导入时间">
              <a-range-picker 
                v-model="queryParam.diyReceiptTime_extra"
                @change="changeRange"
                style="width:100%" 
              />
            </a-form-item>
            <!-- @change="onChange"  -->
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="备注">
              <a-input
                allowClear 
                placeholder="请输入备注查询"
                v-model="queryParam.remark"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="回执及流水名称">
              <a-input
                allowClear
                placeholder="请输入回执及流水名称"
                v-model="queryParam.receiptName"
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
    <!-- 头部按钮操作 -->
    <div class="table-operator">
      <a-button
        type="primary"
        v-has="'wxhr:treceiptinfo_add'"
        @click="handleImport"
      >导入</a-button>
    </div>
    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{x: 1}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        @change="handleTableChange"
        :loading="loading"
      >
        <!-- 附件 -->
        <span
          slot="receiptName"
          slot-scope="text, record"
        >
          <a-tooltip>
            <template slot="title">
              {{ record.receiptName }}
            </template>
            <a @click="handleDown(record)" class="down-ess">{{ record.receiptName }}</a>
          </a-tooltip>
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a-popconfirm
            v-has="'wxhr:treceiptinfo_del'"
            title="确认删除吗?"
            @confirm="handleDelete(record.id)"
            okText="确定"
            cancelText="取消"
          >
            <a
              href="#"
            >删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <receipt-import-model ref="receiptImportModel" @ok="modalFormOk"></receipt-import-model>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { httpAction } from '@/api/manage'

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ReceiptImportModel from './modules/ReceiptImportModel'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'ReturnReceiptList',
    mixins: [JeecgListMixin],
    components: {
      SelectPage,
      ReceiptImportModel
    },
    data() {
      return {
        description: '财务出账凭证',
        employData: {}, 
        loading:false,
  
        // 表头
        columns: [
          {
            ellipsis: true,
            title: '回执及流水名称',
            align: 'center',
            dataIndex: 'receiptName',
            scopedSlots: { customRender: 'receiptName' },
          },
          {
            ellipsis: true,
            title: '导入人',
            align: 'center',
            dataIndex: 'diyReceiptUser',
            customRender:(text) => {
              const str = this.employData.hasOwnProperty(text) ? this.employData[text] : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            ellipsis: true,
            title: '导入时间',
            align: 'center',
            dataIndex: 'diyReceiptTime',
            customRender:(text) => {
              const str = text ? text:'-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            ellipsis: true,
            title: '备注',
            align: 'center',
            dataIndex: 'remark',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 200,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: '/salary/treceiptinfo/page',
          delete: '/salary/treceiptinfo/',
          down:'/salary/treceiptinfo/ossFileUrl/'
        },
      }
    },
    created() {
      // 员数据
      httpAction('/admin/user/userDic','','GET').then((res) => {
        if (Number(res.code) === 200) {
          this.employData = res.data
        } else {
          this.$message.error('发布人数据请求失败！')
        }
      })
    },
    methods: {
      moment,
      // 时间
      changeRange(value, dateString){
        if(Object.keys(value).length){
          this.queryParam.createTimeStart =  dateString[0] + ' 00:00:00'
          this.queryParam.createTimeEnd = dateString[1] + ' 23:59:59'
        }else{
          delete this.queryParam.createTimeStart
          delete this.queryParam.createTimeEnd
        } 
      },
      
      // 导入
      handleImport(){
        this.$refs.receiptImportModel.show()
      },
      // 下载
      handleDown(record){
        httpAction(this.url.down+record.fileId,'','GET').then(res=>{
          if(res.code==200){
            let src = res.data.attaName.lastIndexOf('.')
            let srcName = res.data.attaName.substring(src+1)
            let srcArr = ['jpg','jpeg','png','JPG','JPEG','pdf']
            if(srcArr.indexOf(srcName)== -1){
              window.location.href = res.data.attaSrc
            }else{
              window.open(res.data.attaSrc)
            }
          }
        })
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

.range-picker-new-style {
  :global(.ant-calendar-range-picker-input) {
    font-size: 13px;
  }
}

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}

.down-ess{
  display:inline-block;
  width:100%;
  overflow: hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}
</style>
