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
            <a-form-item label="结算主体编码">
              <a-input
                allowClear
                placeholder="请输入结算主体编码"
                v-model="queryParam.departNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体名称">
              <a-input
                allowClear
                placeholder="请输入结算主体名称"
                v-model="queryParam.departName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="客户名称">
              <a-input
                allowClear
                placeholder="请输入客户名称"
                v-model="queryParam.customerName"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="审核状态">
                <a-select
                  placeholder="请选择状态"
                  v-model="queryParam.dpAuditFlag"
                >
                  <a-select-option
                    v-for="(item,index) in statusOption"
                    :key="index"
                    :value="index"
                  >{{ item.text }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="创建类型">
                <a-select
                  placeholder="请选择创建类型"
                  optionFilterProp="children"
                  v-model="queryParam.createType"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option value="0">合同之后</a-select-option>
                  <a-select-option value="1">合同之前</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="合同关联">
                <a-select
                  placeholder="请选择合同关联"
                  v-model="queryParam.relateFlag"
                >
                  <a-select-option value="0">是</a-select-option>
                  <a-select-option value="1">否</a-select-option>
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

    <div class="table-operator">
      <a-button
        @click="handleAdd"
        type="primary"
        icon="plus"
        v-has="'wxhr:tsettledomain_add'"
      >新增</a-button>
      <a-dropdown v-has="'wxhr:tsettledomain_edit'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImportExcel(url.importExcelBatchAddUrl,'post',1)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />批量更新核准表开票信息
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/核准表开票信息批量添加和更新.xlsx')">
            <a-icon type="download" />模板下载
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量更新核准表开票信息
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-dropdown v-has="'wxhr:tsettledomain_edit'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleImportExcel(url.returnVistUrl,'post',2)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />批量新增对接信息和客户约定
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/批量新增对接信息和客户约定.xlsx')">
            <a-icon type="download" />模板下载
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量新增对接信息和客户约定
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
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
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">查看</a>
          <a @click="handleEdit(record)" v-if="record.dpAuditFlag == 0 || record.dpAuditFlag == 5 || record.dpAuditFlag == 1 || record.dpAuditFlag == 3" v-has="'wxhr:tsettledomain_edit'"><a-divider type="vertical"/>修改</a>
          <a @click="handleRelate(record)" v-has="'wxhr:tsettledomain_edit'" v-if="record.relateFlag == 1"><a-divider type="vertical"/>关联合同</a>
          <a @click="handleAddDockingPeople(record)"><a-divider type="vertical"/>对接信息</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <settlement-add-modal ref="SettlementAddForm" @ok="modalFormOk"></settlement-add-modal>
    <settlement-detail-modal ref="SettlementDetailForm"></settlement-detail-modal>
    <relate-contract-modal ref="RelateContractForm" @ok="modalFormOk"></relate-contract-modal>
    <docking-people-modal
      ref="dockingPeopleModal"
      @ok="modalFormOk"
    ></docking-people-modal>
  </a-card>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SettlementAddModal from './modules/SettlementAddModal'
import SettlementDetailModal from './modules/SettlementDetailModal'
import DockingPeopleModal from  './modules/DockingPeopleModal'
import RelateContractModal from  './modules/RelateContractModal'
import { handleImportData } from '@/utils/common'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { httpAction } from '@/api/manage'
import XLSX from 'xlsx'


export default {
  name: 'SettlementList',
  mixins: [JeecgListMixin],
  components: {
    SettlementAddModal,
    SettlementDetailModal,
    DockingPeopleModal,
    RelateContractModal
  },
  data() {
    return {
      description: '结算主体列表',
      serverItemDicts: [],
      organAll: [],
      belongOrgan:{ // 指标归属
        first:[],
        second:[]
      },
      
      statusOption:[
        {
          color:'green',
          text:'通过'
        },
        {
          color:'red',
          text:'不通过'
        },
        {
          color:'cyan',
          text:'待审核'
        },
        {
          color:'orange',
          text:'待提交'
        },
        {
          color:'blue',
          text:'经理通过'
        },
        {
          color:'red',
          text:'经理不通过'
        },
      ],
      // 表头
      columns: [
        {
          title: '审核状态',
          align: 'center',
          width: 100,
          dataIndex: 'dpAuditFlag',
          customRender: val => {
            const res = this.statusOption[val]
            return (
              <a-tag color={res.color}>{res.text}</a-tag>
            )
          }
        },
        {
          ellipsis: true,
          title: '结算主体名称',
          align: 'center',
          dataIndex: 'departName',
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '结算主体编码',
          align: 'center',
          dataIndex: 'departNo',
          width: 120,
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '服务项目',
          align: 'center',
          dataIndex: 'serverItem',
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '客户',
          align: 'center',
          dataIndex: 'customerName',
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>
                {resultText}
              </a-tooltip>
            )
          }
        },
        {
          title: '创建类型',
          align: 'center',
          dataIndex: 'createType',
          ellipsis: true,
          customRender: text => {
            const resultText = (text == '1') ? '合同之前' : '合同之后'
            return (
              <a-tooltip placement="topLeft" title={resultText}>
                {resultText}
              </a-tooltip>
            )
          }
        },
        {
          title: '合同关联',
          align: 'center',
          dataIndex: 'relateFlag',
          ellipsis: true,
          customRender: text => {
            const resultText = (text == '1') ? '否' : '是'
            return (
              <a-tooltip placement="topLeft" title={resultText}>
                {resultText}
              </a-tooltip>
            )
          }
        },
        {
          title: '合同名称',
          align: 'center',
          dataIndex: 'contractName',
          ellipsis: true,
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>
                {resultText}
              </a-tooltip>
            )
          }
        },
        {
          width: 90,
          ellipsis: true,
          title: '创建人',
          align: 'center',
          dataIndex: 'createUserName',
          customRender: text => {
            const resultText = text || '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          width: 150,
          ellipsis: true,
          customRender: text => {
            const resultText = text ? text.substring(0, 10) : '-'
            return (
              <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
            )
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
          width:200,
        }
      ],
      url: {
        list: '/hrBase/tsettledomain/page',
        getdetail: 'hrBase/tsettledomain/vo/',
        getOrganAll: '/admin/organizationinfo/getOrgForCus?type=0',
        importExcelBatchAddUrl:'/hrBase/tsettledomain/bactchSaveByExcel',
        returnVistUrl:'/hrBase/tsettledomain/returnVisitImport',
      },
      key:0,
      importFieldsList:{
        '邮寄地址':'address',
        '结算主体':'departName',
        '结算主体编码':'departNo',
        '对接人姓名':'people',
        '职位':'stations',
        '办公电话':'tel',
        '手机':'phone',
        '工资发放方式':'salaryType',
        '工资发放日（每月×号）':'salaryGrantTime',
        '首次结算时间':'firstSettlementTime',
      },
    }
  },
  created() {
    this.loadOrganAll()
    httpAction(`/admin/organizationinfo/getOrgForCus?type=0&useType=1`,'','GET').then((res) => {
      if(res.code === 200 && res.data.length > 0) {
        this.belongOrgan.first = res.data
      }
    })
    httpAction(`/admin/organizationinfo/getOrgForCus?type=0&useType=2`,'','GET').then((res) => {
      if(res.code === 200 && res.data.length > 0) {
        this.belongOrgan.second = res.data
      }
    })
    
  },
  methods: {
    handleAdd(){
      this.$refs.SettlementAddForm.title = '添加'
      this.$refs.SettlementAddForm.serverItemDicts = this.serverItemDicts
      // this.$refs.SettlementAddForm.organAll = this.organAll
      this.$refs.SettlementAddForm.belongOrgan = this.belongOrgan
      this.$refs.SettlementAddForm.showModal()
    },
    handleRelate(record){
      this.$refs.RelateContractForm.show(record)
    },
    handleEdit(record){
      this.$refs.SettlementAddForm.title = '编辑'
      this.$refs.SettlementAddForm.serverItemDicts = this.serverItemDicts
      this.$refs.SettlementAddForm.organAll = this.organAll
      httpAction(this.url.getdetail + record.id, null, 'GET').then(res => {
        if(res.code === 200){
          this.$refs.SettlementAddForm.edit(res.data,this.belongOrgan)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleAddDockingPeople(record) {
      this.$refs.dockingPeopleModal.title = '对接信息'
      this.$refs.dockingPeopleModal.organAll = this.organAll
      httpAction(`/admin/organizationinfo/getOrgForCus?type=0&useType=4`,'','GET').then((res) => {
        if(res.code === 200 ) {
          this.$refs.dockingPeopleModal.newOrganAll = res.data
          this.$refs.dockingPeopleModal.add(record)    
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleDetail(record){
      this.$refs.SettlementDetailForm.title = '详情'
      this.$refs.SettlementDetailForm.statusOption = this.statusOption
      this.$refs.SettlementDetailForm.serverItemDicts = this.serverItemDicts
      this.$refs.SettlementDetailForm.organAll = this.organAll
      httpAction(this.url.getdetail + record.id, null, 'GET').then(res => {
        if(res.code === 200){
          this.$refs.SettlementDetailForm.show(res.data)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleDownloadTemplate(templateUrl){
      const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
      window.location.href = url
    },
    // 导入
    handleImportExcel(importUrl,method,type){
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('files[]', file)
      })
      this.uploadFilesChange(fileList[0], importUrl,method,type)
    },
    // 实现导入
    uploadFilesChange(file, importUrl, method,type) {
      var that = this
      // 通过FileReader对象读取文件
      const fileReader = new FileReader()
      fileReader.onload = event => {
        try {
          that.loading = true
          const { result } = event.target
          // 以二进制流方式读取得到整份excel表格对象
          const workbook = XLSX.read(result, { type: 'binary' })
          // 存储获取到的数据
          const data = {}
          let sheetName = ''
          // 遍历获取每张工作表 除去隐藏表
          const allSheets = workbook.Workbook.Sheets
          for (const index in allSheets) {
            const name = allSheets[index].name
            if (workbook.Sheets.hasOwnProperty(name) && allSheets[index].Hidden === 0) {
              sheetName = name
              // 利用 sheet_to_json 方法将 excel 转成 json 数据
              data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name],{defval:'',blankrows:true}))
              break
            }
          }
          let params
          if(String(type) === '2'){
            params = this.handleParams(data[sheetName])
          }else{
            params = handleImportData(data[sheetName])
          }
          httpAction(importUrl,params,method,600000).then(res=>{
            if(res.code === 200){
              that.$message.success("导入成功！")
            }else if (res.data) {
              that.$refs.errorModal.title = `导入提示: ${res.msg}`
              that.$refs.errorModal.message = res.msg
              that.$refs.errorModal.showModal(res.data)
            }else if(res.errorMessageList){
              that.$refs.errorModal.title = `导入提示: ${res.msg}`
              that.$refs.errorModal.message = res.msg
              that.$refs.errorModal.showModal(res.errorMessageList)
            }else{
              that.$message.error(res.msg)
            }
          }).finally(()=>{
            that.loading = false
          })
        } catch (e) {
          console.log(e);
          // 这里可以抛出文件类型错误不正确的相关提示
          this.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
    },
    handleParams(data){
      const params = data.map((item)=>{
        const obj = {}
        const keys = Object.keys(item)
        for(const key of keys){
          const tkey = (typeof(key)==='string') ? key.trim() : key
          obj[this.importFieldsList[tkey]] = (typeof(item[key])==='string') ? item[key].trim() : item[key]
          if(obj[this.importFieldsList[tkey]] === ''){
            delete obj[this.importFieldsList[tkey]]
          }
        }
        return obj
      })
      // 去除最后的空格行
      for (let i=(params.length-1); i>=0; i--) {
        // 判断数组是否全为空
        const flag = Object.values(params[i]).find(item=>{
          return String(item).replace(/^\s*|\s*$/g,"").length
        })
        if(!flag){
          params.splice(i, 1)
        }else{
          break
        }
      }
      return {list:params}
    },
    loadOrganAll() {
      httpAction(this.url.getOrganAll,'','GET').then((res) => {
        if(res.code === 200 && res.data.length > 0) {
          this.organAll = res.data
        }
      })
    },
    initDictConfig() {
      initDictOptions('server_items').then((res) => {
        if (res.code === 200) {
          this.serverItemDicts = res.data;
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
.formLabel {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
