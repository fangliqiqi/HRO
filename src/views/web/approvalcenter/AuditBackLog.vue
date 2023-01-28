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
            <a-form-item label="申请时间">
              <a-range-picker
                format="YYYY-MM-DD"
                style="width:100%"
                v-model="queryParam.createTime_extra"
                @change="changeRange(arguments,'create')"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="退回时间">
              <a-range-picker
                format="YYYY-MM-DD"
                style="width:100%"
                v-model="queryParam.backTime_extra"
                @change="changeRange(arguments,'back')"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="申请人">
              <a-input
                placeholder="请输入申请人"
                v-model="queryParam.createUser"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="流程类型">
                <a-select
                  placeholder="请选择流程类型"
                  v-model="queryParam.processType"
                >
                  <a-select-option value="结算主体审核">结算主体审核</a-select-option>
                  <a-select-option value="核准表审核">核准表审核</a-select-option>
                  <a-select-option value="社保、公积金派单">社保、公积金派单</a-select-option>
                  <a-select-option value="普通薪资结算单">普通薪资结算单</a-select-option>
                  <a-select-option value="工程薪资结算单">工程薪资结算单</a-select-option>
                  <a-select-option value="非扣税类结算单">非扣税类结算单</a-select-option>
                  <a-select-option value="发放失败重新发放">发放失败重新发放</a-select-option>
                  <a-select-option value="暂停发发放|拆分发放">暂停发发放|拆分发放</a-select-option>
                  <a-select-option value="事务外包结算单">事务外包结算单</a-select-option>
                  <a-select-option value="商险派单">商险派单</a-select-option>
                  <a-select-option value="财务账单结算">财务账单结算</a-select-option>
                  <a-select-option value="商险单独结算">商险单独结算</a-select-option>
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

    <div class="table-operator" v-has="'wxhr:tapprovalbacklog_export'">
      <a-button
        @click="exportExcel"
        type="primary"
        icon="download"
        :loading="loading"
      >导出</a-button>
    </div>
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { downFilePost } from '@/api/manage'

export default {
  name: 'AuditBackLog',
  mixins: [JeecgListMixin],
  data() {
    return {
      loading: false,
      // 表头
      columns: [
        {
          title: '流程类型',
          align: 'center',
          dataIndex: 'processType',
          width: 100,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '申请人',
          align: 'center',
          dataIndex: 'createUser',
          width: 80,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '申请时间',
          align: 'center',
          dataIndex: 'createTime',
          width: 100,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '退回节点',
          align: 'center',
          dataIndex: 'fallbackNode',
          width: 100,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '退回人',
          align: 'center',
          dataIndex: 'backUser',
          width: 80,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '退回时间',
          align: 'center',
          dataIndex: 'backTime',
          width: 100,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '原因',
          align: 'center',
          dataIndex: 'reason',
          width: 150,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        }
      ],
      url: {
        list: '/salary/tapprovalbacklog/page',
        exportExcel: '/salary/tapprovalbacklog/exportApprovalBackLog'
      },
    }
  },
  methods: {
    changeRange(agrs,str){
      if(agrs[0].length){
        this.queryParam[`${str}StartTime`] = agrs[1][0] + ' 00:00:00';
        this.queryParam[`${str}EndTime`] = agrs[1][1] + ' 23:59:59';
      }else{
        delete this.queryParam[`${str}StartTime`];
        delete this.queryParam[`${str}EndTime`];
      }
    },
    exportExcel(){
      // eslint-disable-next-line
      const params = _.cloneDeep(this.queryParam)
      delete params.createTime_extra;
      delete params.backTime_extra;
      let query = {exportFields: ["流程类型", "申请人", "申请时间", "退回节点","退回人", "退回时间", "原因"]};
      let httpurl = `exportFields=`+query.exportFields;
      const qs = require('qs');
      if(Object.keys(params).length){
        httpurl += '&'+qs.stringify(params);
      }
      if(this.selectedRowKeys.length){
        httpurl += `&idArray=${this.selectedRowKeys.join(',')}`
      }
      const _this = this;
      _this.loading = true;
      downFilePost(`${_this.url.exportExcel}?${httpurl}`, null).then((res) => {
        if (res.size > 0) {
          var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = `审批退回日志.xls` // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
          _this.$message.success('导出成功！')
        } else {
          _this.$message.warning(`${res.msg} 导出失败!`)
        }
      }).finally(() => {
        _this.loading = false;
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
.table-operator{
  margin-bottom: 20px;
}
</style>
