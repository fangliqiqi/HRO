<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="16"
            :sm="12"
          >
            <a-form-item label="地区">
              <select-area
                :triggerChange="true"
                @change="changeArea"
                ref="selectArea"
                :count="2"
              ></select-area>
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
      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <a-button
          type="primary"
          icon="plus"
          @click="handleAdd"
        >新增</a-button>
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
          <a @click="handlePreview(record)" v-if="record.fddTemplateId && record.modifyUploadStatus == 1">模板预览</a>
          <a-divider type="vertical" v-if="record.fddTemplateId && record.modifyUploadStatus == 1"/>
          <a @click="handleModify(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-upload
            v-if="!record.fddTemplateId"
            name="file"
            @change="handleImport(record,$event)"
            :showUploadList="false"
            :beforeUpload="beforeUpload"
            accept=".pdf, .doc, .docx,"
          >
            <a>上传模板</a>
          </a-upload>
          <a-divider type="vertical" v-if="!record.fddTemplateId"/>

          <a @click="handleEdit(record)" v-if="record.fddTemplateId">维护模板</a>
        </span>
      </a-table>
    </div>
    <contract-template-edit-modal
      ref="ContractTemplateEditModalForm"
      @ok="modalFormOk"
    ></contract-template-edit-modal>
    
  </a-card>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { getAreaName } from '@/utils/common'
import { httpAction, postActionHeader } from '@/api/manage'
import SelectArea from '@/components/jeecg/SelectArea'
import ContractTemplateEditModal from './modules/ContractTemplateEditModal'

export default {
  name: 'ElectronicContractTemplate',
  mixins: [JeecgListMixin],
  components: {
    SelectArea,
    ContractTemplateEditModal
  },
  data() {
    return {
      description: '电子合同模板',
      empTypeOptions: [], // 员工类型
      columns: [
        {
          title: '地区',
          align: 'center',
          dataIndex: 'province',
          customRender: (text,record) => {
            const resultText = getAreaName(text,record.city)
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '员工类型',
          align: 'center',
          dataIndex: 'type',
          customRender: text => {
            const str = filterDictText(this.empTypeOptions, text)
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          }
        },
        {
          title: '合同定稿状态',
          align: 'center',
          dataIndex: 'modifyUploadStatus',
          customRender: text => {
            const resultText = (text == 1) ? '成功' : '未定稿'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '是否有加班工资',
          align: 'center',
          dataIndex: 'overtimeWageFlag',
          customRender: text => {
            const resultText = (Number(text) == 1) ? '有' : '无'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          // width: 150,
          // ellipsis: true,
          title: '创建人',
          align: 'center',
          dataIndex: 'createUser',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 200,
          ellipsis: true,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/hrBase/fddcontracttemplate/page',
        importUrl:'/hrBase/fddcontracttemplate/upload?id='
      }
    }
  },
  methods: {
    changeArea(val,type){
      if(String(type) === '1'){
        this.queryParam.province = val
        delete this.queryParam.city
        delete this.queryParam.town
      }else if(String(type) === '2'){
        this.queryParam.city = val
        delete this.queryParam.town
      }else{
        this.queryParam.town = val
      }
    },
    searchReset(){
      this.queryParam = {}
      this.selectedRowKeys = []
      this.$refs.selectArea.clearSelect()
      this.$router.push({
        query: {}
      })
      this.loadData(1)
    },
    handleModify(record){
      this.$refs.ContractTemplateEditModalForm.saveMethod = 'put'
      this.$refs.ContractTemplateEditModalForm.title = '合同模板编辑'
      this.$refs.ContractTemplateEditModalForm.empTypeOptions = this.empTypeOptions
      this.$refs.ContractTemplateEditModalForm.show(record)
    },
    handleAdd(){
      this.$refs.ContractTemplateEditModalForm.saveMethod = 'post'
      this.$refs.ContractTemplateEditModalForm.title = '合同模板添加'
      this.$refs.ContractTemplateEditModalForm.empTypeOptions = this.empTypeOptions
      this.$refs.ContractTemplateEditModalForm.add()
    },
    handlePreview(record){
      httpAction(`/hrBase/fddcontracttemplate/getCompanyTemplatePreviewUrl?id=${record.id}`,null,'get').then(res=>{
        if(res.code === 200){
          window.open(res.data)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleImport(record,file) {
      this.uploadFilesChange(file.file,record)
    },
    uploadFilesChange(file,record) {
      const _this = this
      const formData = new FormData()
      formData.append('file', file)
      const contextType = { 'Content-Type': 'multipart/form-data' }
      postActionHeader(this.url.importUrl+record.id, formData, contextType,60000).then((res) => {
        if (res.code === 200) {
          _this.$message.success('上传附件成功')
          _this.loadData()
        } else {
          _this.$message.warning(res.msg)
        }
      })
    },
    handleEdit(record){
      httpAction(`/hrBase/fddcontracttemplate/getTemplateMainUrl?id=${record.id}`,null,'get').then(res=>{
        if(res.code === 200){
          window.open(res.data)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    beforeUpload() {
      return false
    },
    initDictConfig() {
      
      // 员工类型
      initDictOptions('personnel_type').then((res) => {
        if (Number(res.code) === 200) {
          this.empTypeOptions = res.data
        }
      })
    }

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
