<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="客户名称">
              <a-input placeholder="客户名称" v-model="queryParam.customerName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="客户编码">
              <a-input placeholder="客户编码" v-model="queryParam.customerCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="客户性质">
              <a-select showSearch optionFilterProp="children" placeholder="客户性质" v-model="queryParam.nature">
                <a-select-option
                  v-for="(value, key) in customerNatures"
                  :key="key"
                  :value="value.value">{{ value.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="销售代表">
                <a-input placeholder="销售代表" v-model="queryParam.salesmanName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="行业类型">
                <a-select showSearch optionFilterProp="children" placeholder="行业类型" v-model="queryParam.industryBelong">
                  <a-select-option
                    v-for="(value, key) in industryBelongDictOptions"
                    :key="key"
                    :value="value.id">{{ value.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus" v-has="'wxhr:tcustomerinfo_add'">新增</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls" v-has="'unit:export'">导出</a-button>-->
      <!-- :action="importExcelUrl"  -->
      <!-- <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :beforeUpload="beforeUpload"
        @change="handleImport"
        accept=".xls,.xlsx">
        <a-button type="primary" icon="import" v-has="'unit:import'">导入</a-button>
      </a-upload> -->
      <!--<a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchSubmit" v-has="'wxhr:tcustomerinfo_batch_commit'">
            <a-icon type="check-circle"/>
            批量提交审核
          </a-menu-item>
        </a-menu>
        <a-button> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
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
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical" v-if="record.prAuditFlag == 3 || record.prAuditFlag == 1" v-has="'wxhr:tcustomerinfo_edit'"/>
          <a @click="handleEdit(record)" v-if="record.prAuditFlag == 3 || record.prAuditFlag == 1" v-has="'wxhr:tcustomerinfo_edit'">编辑</a>
          <a-divider type="vertical" v-if="record.prAuditFlag == 3" v-has="'wxhr:tcustomerinfo_batch_commit'"/>
          <a @click="doSubmit(record)" v-if="record.prAuditFlag == 3" v-has="'wxhr:tcustomerinfo_batch_commit'">提交审核</a>
          <a-divider type="vertical" v-if="record.prAuditFlag == 3 || record.prAuditFlag == 1" v-has="'wxhr:tcustomerinfo_del'"/>
          <a-dropdown v-if="record.prAuditFlag == 3 || record.prAuditFlag == 1" v-has="'wxhr:tcustomerinfo_del'">
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

        <span slot="customerName" slot-scope="text,record">
          <a-tooltip class="overflow">
            <template slot="title">
              {{ record.customerName }}
            </template>
            <span v-if="record.prAuditFlag == 1" style="color: red;">{{ record.customerName }}</span>
            <span v-else>{{ record.customerName }}</span>
          </a-tooltip>
        </span>

        <span slot="prAuditFlag" slot-scope="text, record">
          <a-tag v-if="record.prAuditFlag == 0" color="green">审核通过</a-tag>
          <a-tag v-if="record.prAuditFlag == 1" color="red" @click="stepShow(record)">审核不通过</a-tag>
          <a-tag v-if="record.prAuditFlag == 2" color="cyan" @click="stepShow(record)">待审核</a-tag>
          <a-tag v-if="record.prAuditFlag == 3" color="orange">待提交</a-tag>
        </span>

        <span
          slot="customerStatus"
          slot-scope="text, record"
        >
          <a-tag
            v-if="record.customerStatus == 0"
            color="pink"
          >合同未上传</a-tag>
          <a-tag
            v-if="record.customerStatus == 1"
            color="green"
          >合同正常</a-tag>
          <a-tag
            v-if="record.customerStatus == 2"
            color="orange"
          >合同即将到期</a-tag>
          <a-tag
            v-if="record.customerStatus == 3"
            color="red"
          >合同到期</a-tag>
        </span>

        <span slot="prAuditOpinion" slot-scope="text,record">
          <span v-if="record.prAuditOpinion != null && record.prAuditOpinion.length > 0" style="color: red;">{{ record.prAuditOpinion }}</span>
          <span v-else>-</span>
        </span>

        <span slot="label" slot-scope="text, record">
          <span v-if="record.label != null">
            <a-tag v-for="(tag, index) in record.label.split(',')" :key="index">{{ tag }}</a-tag>
          </span>
          <span v-else> - </span>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <customer-unit-modal ref="modalForm" @ok="modalFormOk"></customer-unit-modal>
    <error-modal ref="errorModal"></error-modal>
    <customer-audit-modal ref="customerAuditModal" @ok="customerAuditModalOk"></customer-audit-modal>
    <customer-contract-modal ref="customerContractModal" @ok="customerContractModalOk"></customer-contract-modal>
    <customer-simple-detail-modal ref="customerSimpleDetailModal"></customer-simple-detail-modal>
    <step-modal ref="stepModal"></step-modal>
  </a-card>
</template>

<script>
  import ErrorModal from './modules/ErrorModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import XLSX from 'xlsx'
  import { postActionHeader,httpAction } from '@/api/manage'
  import { handleImportData } from '@/utils/common'
  import {initDictOptions, filterDictText,filterDict} from '@/components/dict/JDictSelectUtil'
  import CustomerUnitModal from './modules/CustomerUnitModal'
  import Vue from 'vue'
  import CustomerAuditModal from './modules/CustomerAuditModal'
  import CustomerContractModal from './modules/CustomerContractModal'
  import CustomerSimpleDetailModal from './modules/CustomerSimpleDetailModal'
  import StepModal from '../../common/StepModal'

  export default {
    name: 'CustomerUnitList',
    mixins: [JeecgListMixin],
    components: {
      StepModal,
      CustomerSimpleDetailModal,
      CustomerContractModal,
      CustomerAuditModal,
      CustomerUnitModal,
      ErrorModal
    },
    data() {
      return {
        description: '客户信息管理界面',
        fileList: [],
        //字典数组缓存
        natureDictOptions: [],
        customerNatures: [],
        industryBelongDictOptions: [],
        industrySub: [],
        areaTrees: [],
        loading: false,
        customerTreeData:[],
        // 表头
        columns: [
          {
            title: '客户名称',
            align: 'center',
            dataIndex: 'customerName',
            scopedSlots: { customRender: 'customerName' }
          },
          {
            title: '客户编码',
            align: 'center',
            dataIndex: 'customerCode'
          },
          {
            title: '客户合同情况',
            align: 'center',
            dataIndex: 'customerStatus',
            scopedSlots: { customRender: 'customerStatus' }
          },
          {
            title: '审核状态',
            align: 'center',
            dataIndex: 'prAuditFlag',
            scopedSlots: { customRender: 'prAuditFlag' }
          },
          {
            title: '销售代表',
            align: 'center',
            dataIndex: 'salesmanName'
          },
          {
            title: '客户性质',
            align: 'center',
            dataIndex: 'nature',
            customRender: (text) => {
              return filterDictText(this.customerNatures, text);
            }
          },
          /*{
            title: '客户标识',
            align: 'center',
            dataIndex: 'label',
            scopedSlots: { customRender: 'label' }
          },*/
          {
            title: '行业类型',
            align: 'center',
            dataIndex: 'industryBelong',
            customRender: (text) => {
              return filterDict(this.industryBelongDictOptions, text);
            }
          },
          /*{
            title: '创建人',
            align: 'center',
            dataIndex: 'createUserName'
          },*/
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime'
          },
          /*{
            title: '审核意见',
            align: 'center',
            dataIndex: 'prAuditOpinion',
            scopedSlots: { customRender: 'prAuditOpinion' }
          },*/
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/hrBase/tcustomerinfo/page?selectType=1',
          delete: '/hrBase//tcustomerinfo/',
          deleteBatch: '/tcustomerunit/deleteBatch',
          exportXlsUrl: '/tcustomerunit/exportXls',
          importExcelUrl: '/tcustomerunit/importJsonString',
          queryAllInfoById: '/hrBase/tcustomerinfo/',
          add: '/tcustomerunit',
          getTreeData: '/hrBase/tcustomerinfo/ValueTree',
          submitBatch: '/hrBase/tcustomerinfo/batch/commit',
          getOneselfDepart:'/admin/organizationinfo/select/getOneselfDepart'
        }
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      }
    },
    created() {
      this.loadCustomerTreeData();
    },
    methods: {
      batchSubmit() {
        if (!this.url.submitBatch) {
          this.$message.error('请设置url.submitBatch属性!')
          return
        }
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        }
        var ids = "";
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          if(a == this.selectedRowKeys.length - 1) {
            ids += this.selectedRowKeys[a]
          } else {
            ids += this.selectedRowKeys[a] + ','
          }
        }
        const requestUrl = '/admin/user/findUserBypPrmission?permissionStr=' + 'wxhr:tcustomerinfo_batch_commit'
        httpAction(requestUrl,'wxhr:tcustomerinfo_batch_commit','GET').then((res) => {
          if(res.code === 200) {
            this.$refs.customerAuditModal.auditUsers = res.data;
            this.$refs.customerAuditModal.showModal(ids);
          }
        });
      },
      doSubmit(record) {
        httpAction('/admin/user/findUserBypPrmission?permissionStr=' + 'wxhr:tcustomerinfo_audit','wxhr:tcustomerinfo_audit','GET').then((res) => {
          if(res.code === 200) {
            this.$refs.customerAuditModal.auditUsers = res.data;
            this.$refs.customerAuditModal.showModal(record.id);
          }
        });
      },
      addCustomerContract(record) {
        this.$refs.customerContractModal.treeData = this.customerTreeData;
        this.$refs.customerContractModal.industryBelongs = this.industryBelongDictOptions;
        this.$refs.customerContractModal.customerNatures = this.customerNatures;
        this.$refs.customerContractModal.industrySub = this.industrySub;
        this.$refs.customerContractModal.areaTrees = Vue.ls.get('glob_area');
        this.$refs.customerContractModal.add(record)
        this.$refs.customerContractModal.title = '客户合同上传'
      },
      handleAdd: function() {
        this.$refs.modalForm.treeData = this.customerTreeData;
        this.$refs.modalForm.industryBelongs = this.industryBelongDictOptions;
        this.$refs.modalForm.customerNatures = this.customerNatures;
        this.$refs.modalForm.industrySub = this.industrySub;
        this.$refs.modalForm.areaTrees = this.$ls.get('glob_area');
        this.$refs.modalForm.title = '客户新增'
        httpAction(this.url.getOneselfDepart,null,'get').then((res)=>{
          if(Number(res.code) === 200){
            this.$refs.modalForm.defaultArea = {
              belongProvince:res.data.province,
              belongCity:res.data.city,
              belongTown:res.data.town
            }
            this.$refs.modalForm.add()
          }
        })
      },
      handleEdit: function(record) {
        this.$refs.modalForm.treeData = this.customerTreeData;
        this.$refs.modalForm.industryBelongs = this.industryBelongDictOptions;
        this.$refs.modalForm.customerNatures = this.customerNatures;
        this.$refs.modalForm.industrySub = this.industrySub;
        this.$refs.modalForm.title = '客户编辑'
        this.$refs.modalForm.areaTrees =  this.$ls.get('glob_area');
        httpAction(this.url.queryAllInfoById + record.id, '','GET').then((res) => {
          this.$refs.modalForm.defaultArea = {
            belongProvince:res.data.belongProvince,
            belongCity:res.data.belongCity,
            belongTown:res.data.belongTown
          }
          this.$refs.modalForm.edit(res.data)
        })
      },
      handleDetail: function(record) {
        this.$refs.customerSimpleDetailModal.treeData = this.customerTreeData;
        this.$refs.customerSimpleDetailModal.industryBelongs = this.industryBelongDictOptions;
        this.$refs.customerSimpleDetailModal.customerNatures = this.customerNatures;
        this.$refs.customerSimpleDetailModal.industrySub = this.industrySub;
        this.$refs.customerSimpleDetailModal.areaTrees =  this.$ls.get('glob_area');
        this.$refs.customerSimpleDetailModal.title = '客户详情'
        this.$refs.customerSimpleDetailModal.edit(record)
      },
      stepShow(record) {
        let flows = [];
        if(record.prAuditFlag == 1) {
          flows = [
            {title: "客户申请",status: "finish",description: record.createUserName,icon: 'user'},
            {title: "客户审核",status: "error",description: record.prAuditManName + ":" + record.prAuditOpinion,icon: 'close-circle'},
            {title: "完成创建",status: "wait",icon: 'user'}];
        }
        if(record.prAuditFlag == 2) {
          flows = [
            {title: "客户申请",status: "finish",description: record.createUserName,icon: 'user'},
            {title: "客户审核",status: "wait",description: record.prAuditManName,icon: 'user'},
            {title: "完成创建",status: "wait",icon: 'user'}];
        }
        this.$refs.stepModal.show(flows);
      },
      initDictConfig() {
        initDictOptions('nature').then((res) => {
          if (res.code === 200) {
            this.natureDictOptions = res.data;
          }
        });
        // 行业类型
        initDictOptions('industryBelong').then((res) => {
          if (res.code === 200) {
            this.industryBelongDictOptions = res.data;
          }
        });

        initDictOptions('nature').then((res) => {
          if (res.code === 200) {
            this.customerNatures = res.data;
          }
        });

        initDictOptions('industrySub').then((res) => {
          if (res.code === 200) {
            this.industrySub = res.data;
          }
        });
      },
      loadCustomerTreeData() {
        httpAction(this.url.getTreeData,null,'get').then((res) => {
          this.customerTreeData = res.data;
        });
      },
      customerAuditModalOk() {
        this.loadData()
      },
      customerContractModalOk() {
        this.loadData()
      },
      handleExportXls() {
        //console.log(this.dataSource);
      },
      beforeUpload(file) {
        this.fileList = [...this.fileList, file]
        return false
      },
      handleImport() {
        const { fileList } = this
        const formData = new FormData()
        fileList.forEach((file) => {
          formData.append('files[]', file)
        })
        this.uploadFilesChange(fileList[0])
      },
      uploadFilesChange(file) {
        // 通过FileReader对象读取文件
        const fileReader = new FileReader()
        fileReader.onload = event => {
          try {
            const { result } = event.target
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary' })
            // 存储获取到的数据
            const data = {}
            let sheetName = ''
            // 遍历每张工作表进行读取（这里默认只读取第一张表）
            for (const sheet in workbook.Sheets) {
              // esline-disable-next-line
              if (workbook.Sheets.hasOwnProperty(sheet)) {
                sheetName = sheet
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                data[sheet] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet],{defval:'',blankrows:true}))
              }
            }
            // 去除每个字段的前后空格
            const newData = handleImportData(data[sheetName])
            const contextType = {'Content-Type': 'application/json;charset=UTF-8'};
            //开始异步提交
            postActionHeader(this.importExcelUrl, JSON.stringify(newData),contextType).then((res) => {
              if (res.success) {
                this.$message.success("上传成功！")
                this.loadData();
              } else {
                if(res.entityList != null && res.entityList.length > 0) {
                  this.$refs.errorModal.title = '导入提示: ' + res.message
                  this.$refs.errorModal.message = res.message
                  this.$refs.errorModal.showModal(res.entityList)
                } else {
                  this.$message.error(res.message)
                }
              }
            })
          } catch (e) {
            console.log(e);
            // 这里可以抛出文件类型错误不正确的相关提示
            this.$message.error('文件上传错误！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file)
      }
    }
  }
</script>
<style lang="less" scoped>
  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }

  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
  .overflow{
    overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 150px;
  }
</style>
