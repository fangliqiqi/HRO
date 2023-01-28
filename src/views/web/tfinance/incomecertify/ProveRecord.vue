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
            <a-form-item label="员工姓名">
              <a-input
                placeholder="请输入员工姓名"
                v-model="queryParam.employeeName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="身份证号">
              <a-input
                placeholder="请输入身份证号"
                v-model="queryParam.employeeIdCard"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="作废状态">
              <a-select
                style="width: 150px"
                v-model="queryParam.isInvalid"
                placeholder="请选择作废状态"
              >
                <a-select-option value="0">未作废</a-select-option>
                <a-select-option value="1">已作废</a-select-option>
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
        icon="download"
        :loading="confirmLoading"
        v-has="'wxhr:tproveRecord_export'"
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
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >

        <span
          slot="time"
          slot-scope="text, record"
        >
          {{ text }} ~ {{ record.endMonth }}
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            v-has="'wxhr:prove_record_detail'"
            @click="handleDetial(record)"
          >查看</a>
          <a-divider
            type="vertical"
            v-if="record.number < 2 && record.isInvalid != 1"
            v-has="'wxhr:tproveapply_invalid'"
          />
          <a
            v-has="'wxhr:tproveapply_invalid'"
            v-if="record.number < 2 && record.isInvalid != 1"
            @click="handleDisable(record)"
          >作废</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!--预览弹出框-->
    <a-modal
      :title="titlePreview"
      :width="'80%'"
      :centered="true"
      :footer="null"
      @cancel="closePreview"
      :visible="isOpen"
      :maskClosable="false"
    >
      <iframe
        frameborder="0"
        width="100%"
        height="580"
        :src="iframeSrc"
        title="iframe"
      ></iframe>
    </a-modal>
    <a-modal
      title="作废"
      :visible="isRepeal"
      @cancel="closeRepeal"
      @ok="handleRepeal"
      :destroyOnClose="true"
      :bodyStyle="{height:'160px'}"
    >
      <a-form
        layout="inline"
        :form="repealForm"
      >
        <a-form-item label="作废理由">
          <a-textarea
            style="resize:none"
            rows="4"
            cols="55"
            placeholder="请输入作废理由"
            v-decorator="['invalidReason',{ rules: [{ required: true, message: '请输入作废理由!' }] }]"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { downFilePost,httpAction } from '@/api/manage'
  
  export default {
    name: 'ProveRecord',
    mixins: [JeecgListMixin],
    data() {
      return {
        description: '证明记录',
        sumTypeOption: ['实发平均','应发平均'], // 员工类型
        titlePreview:'工资证明详情',
        isOpen:false,
        isRepeal:false,
        iframeSrc:'',
        id:'',
        repealForm:this.$form.createForm(this),
        // 表头
        columns: [
          {
            title: '姓名',
            align: 'center',
            dataIndex: 'employeeName',
          },
          {
            title: '身份证号',
            align: 'center',
            dataIndex: 'employeeIdCard',
          },
          {
            title: '证明编号',
            align: 'center',
            dataIndex: 'no',
          },
          // {
          //   title: '身份证',
          //   align: 'center',
          //   dataIndex: 'employeeIdCard',
          // },
          {
            title: '结算主体',
            align: 'center',
            dataIndex: 'employeeSettleDepartName',
          },
          {
            title: '工资提取时间',
            align: 'center',
            dataIndex: 'startMonth',
            scopedSlots: { customRender: 'time' },
          },
          {
            title: '计算类型',
            align: 'center',
            dataIndex: 'sumType',
            customRender: (text) => {
              return this.sumTypeOption[text]
            }
          },
          {
            title: '平均工资',
            align: 'center',
            dataIndex: 'proveSalary',
          },
          {
            title: '开具人',
            align: 'center',
            dataIndex: 'creatUserName',
          },
          {
            title: '开具日期',
            align: 'center',
            dataIndex: 'creatDate',
          },
          {
            title: '用途',
            align: 'center',
            dataIndex: 'purpose',
          },
          {
            title: '打印次数',
            align: 'center',
            dataIndex: 'number',
          },
          {
            title: '作废原因',
            align: 'center',
            dataIndex: 'invalidReason',
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width:100,
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrBase/salaryProve/findProveRecordPage',
          repeal:'hrBase/salaryProve/updateStatus',
          exportUrl:'hrBase/salaryProve/exportProveRecord'
        },
        confirmLoading:false
        
      }
    },
    methods: {
      // 查看
      handleDetial(record) {
        this.titlePreview = (record.proveType == 0) ? '正式员工收入证明详情' : '试用期员工收入证明详情'
        let isCanPrint = (record.isInvalid == 0 ) ? 1 : 0
        this.iframeSrc = window.location.protocol+'//'+window.location.hostname+':'+window.location.port+'/pdf/salaryprove?type='+record.proveType+'&id='+record.id+'&isCanPrint='+isCanPrint
        this.isOpen = true
      },
      // 打开作废弹框
      handleDisable(record){
        this.isRepeal = true
        this.id = record.id
      },
      //导出记录
      handleExport(){
        const _this = this
        _this.confirmLoading = true
        downFilePost(_this.url.exportUrl+'?idArray='+_this.selectedRowKeys, _this.queryParam).then((res) => {
          if (res.size > 0) {
            var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
            var downloadElement = document.createElement('a')
            var href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.href = href
            downloadElement.download = '证明记录.xls' // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
            _this.$message.success('导出成功！')
          } else {
            _this.$message.warning(`${res.msg} 导出失败!`)
          }
        }).finally(()=>{
           _this.confirmLoading = false
        })
      },
      handleRepeal(){
        const _this = this
        this.repealForm.validateFields((err, values) => {
          if (!err) {
            let url = _this.url.repeal+'?id='+_this.id+'&invalidReason='+values.invalidReason+'&status='+1
            httpAction(url,null,'post').then((res)=>{
              if(res.code == 200){
                _this.$message.success('操作成功！')
                _this.isRepeal = false
                _this.modalFormOk()
              }else{
                _this.$message.warning(res.msg)
              }
            })
          }
        })
      },
      closePreview(){
        this.isOpen = false
        this.iframeSrc = ''
      },
      // 关闭作废弹窗
      closeRepeal(){
        this.id = ''
        this.isRepeal = false
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
</style>
