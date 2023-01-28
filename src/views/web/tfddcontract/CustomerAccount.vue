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
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        @click="handleCertificate"
      >账号实名认证</a-button>
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
          <a @click="sendInvite(record)" v-if="record.realStatus != 1">发送实名</a>
          &nbsp;&nbsp;
          <a @click="handleInvite(record)" v-if="record.realStatus == 1 && !record.companyInfoId">邀请加入</a>
          &nbsp;&nbsp;
          <a-dropdown v-if="(record.companyInfoId && !record.sealId) || record.sealId">
            <a class="ant-dropdown-link">更多<a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item key="0" v-if="!record.sealId && record.companyInfoId">
                <a @click="handleAuth(record)">授权印章</a>
              </a-menu-item>
              <a-menu-item key="1" v-if="record.sealId">
                <a @click="handleAuth(record)">取消授权印章</a>
              </a-menu-item>
              <a-menu-item v-if="record.companyInfoId && !record.sealId" key="2">
                <a-popconfirm title="确定移除组织吗?" @confirm="() => handleDelete(record.id)">
                  <a>移除组织</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
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
import CetificateAccountModal from './modules/CetificateAccountModal'
import CompanyListModal from './modules/CompanyListModal'
import SealListModal from './modules/SealListModal'
import { mapGetters } from 'vuex'
import { httpAction } from '@/api/manage'

export default {
  name: 'CustomerAccount',
  mixins: [JeecgListMixin],
  components: {
    CetificateAccountModal,
    CompanyListModal,
    SealListModal

  },
  data() {
    return {
      description: '客服账号',
      columns: [
        {
          width: 80,
          ellipsis: true,
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
          width: 150,
          ellipsis: true,
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
          width: 120,
          ellipsis: true,
          title: '实名状态',
          align: 'center',
          dataIndex: 'realStatus',
          customRender: text => {
            if(text == 1){
              return <a-tag color="green">已认证</a-tag>
            }else{
              return <a-tag color="red">未认证</a-tag>
            }
          }
        },
        {
          // width: 200,
          // ellipsis: true,
          title: '组织',
          align: 'center',
          dataIndex: 'companyName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '印章',
          align: 'center',
          dataIndex: 'sealName',
          customRender: text => {
            const resultText = text || '-'
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
        list: '/hrBase/fddpersonaccount/page?systemFlag=0',
      }
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    handleCertificate(){
      this.$refs.CetificateAccountModalForm.show()
    },
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
    handleInvite(record){
      this.$refs.CompanyListModalForm.show(record.id)
    },
    async handleAuth(record){
      const res = await httpAction(`/hrBase/fddsealpersonauth/getSealId?personAccountId=${this.userInfo().id}`,null,'post');
      if(res.code === 200){
        const sealIds = res.data.map(item=>{return item.sealId})
        this.$refs.SealListModalForm.show(record.id,sealIds);
      }else{
        this.$message.warning(res.msg);
      }
    },
    async handleAuthCancel(record){
      const _this = this
      this.$confirm({
        content: '确认取消授权印章？',
        onOk() {
          httpAction(`/hrBase/fddsealinfo/cancelSealAuth?id=${record.sealId}&fddPersonAccountId=${record.id}`,null,'post').then(res=>{
            if(res.code === 200){
              _this.$message.success('取消成功！')
              _this.loadData()
            }else{
              _this.$message.warning(res.msg)
            }
          })
        }
      })
    },
    handleDelete(id){
       httpAction(`/hrBase/fddpersonaccount/delEmployee?id=${id}`,null,'post').then(res=>{
        if(res.code === 200){
          this.$message.success('移除组织成功！')
          this.loadData()
        }else{
          this.$message.warning(res.msg)
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
