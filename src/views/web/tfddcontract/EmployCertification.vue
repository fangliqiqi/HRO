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
                allowClear
                placeholder="请输入员工姓名"
                v-model="queryParam.name"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="身份证号">
              <a-input
                allowClear
                placeholder="请输入身份证号"
                v-model="queryParam.idCard"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="实名状态">
              <a-select v-model="queryParam.realStatus" placeholder="请选择实名状态">
                <a-select-option value="1">已认证</a-select-option>
                <a-select-option value="0">未认证</a-select-option>
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
      >
        <span slot="action" slot-scope="text, record">
          <a @click="sendInvite(record)" v-if="record.realStatus != 1">发送实名认证</a>
        </span>
      </a-table>
    </div>
    <cetificate-account-modal
      ref="CetificateAccountModalForm"
      @ok="modalFormOk"
    ></cetificate-account-modal>
    <company-list-modal
      ref="CompanyListModalForm"
      @ok="modalFormOk"
    ></company-list-modal>
    <seal-list-modal
      ref="SealListModalForm"
      @ok="modalFormOk"
    ></seal-list-modal>
    
  </a-card>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction } from '@/api/manage'

export default {
  name: 'EmployCertification',
  mixins: [JeecgListMixin],
  data() {
    return {
      description: '员工实名',
      columns: [
        {
          // width: 100,
          // ellipsis: true,
          title: '姓名',
          align: 'center',
          dataIndex: 'name',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          // width: 180,
          // ellipsis: true,
          title: '身份证',
          align: 'center',
          dataIndex: 'idCard',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          // width: 150,
          // ellipsis: true,
          title: '手机',
          align: 'center',
          dataIndex: 'moblie',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '用户类型',
          align: 'center',
          dataIndex: 'systemFlag',
          customRender: text => {
            const resultText = Number(text) ? '普通员工' : '企业用户'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          // width: 140,
          // ellipsis: true,
          title: '实名状态',
          align: 'center',
          dataIndex: 'realStatus',
          customRender: text => {
            const resultText = (text == 1) ? '已认证' : '未认证'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 180,
          ellipsis: true,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/hrBase/fddpersonaccount/page?systemFlag=1',
      }
    }
  },
  methods: {
    // 发送实名
    sendInvite(record){
      const _this = this
      this.$confirm({
        content: '确认发送实名邀请？',
        onOk() {
          httpAction(`/hrBase/fddpersonaccount/sendAuthMessage?id=${record.id}`,null,'post').then(res=>{
            if(res.code === 200){
              _this.$message.success('发送成功！')
            }else{
              _this.$message.warning(res.msg)
            }
          })
        }
      })
    },

  }
}
</script>
<style lang="less" scoped>
.ant-card-body .table-operator {
  margin-bottom: 18px;
  button {
    margin-right: 10px;
  }
}
</style>
