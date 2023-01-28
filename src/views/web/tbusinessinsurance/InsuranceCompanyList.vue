<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <!-- <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col
            :md="9"
            :sm="12"
          >
            <a-form-item label="保险公司名称">
              <a-input
                placeholder="请输入保险公司名称"
                v-model="queryParam.companyName"
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
    </div> -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        @click="handleAdd"
        v-has="'wxhr:tinsurancecompany_add'"
      >新增</a-button>
      <a-dropdown v-has="'wxhr:tinsurancecompany_batch_add'">
        <a-menu slot="overlay">
          <a-menu-item @click="batchImport">
            <a-icon type="plus" />批量新增</a-menu-item>
          <a-menu-item @click="batchImportTemplate">
            <a-icon type="download" />模板下载</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量新增
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

        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:tinsurancecompany_edit'"
          >编辑</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tinsurancecompany_detail'"
          />
          <a
            @click="handleDetail(record)"
            v-has="'wxhr:tinsurancecompany_detail'"
          >详情</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tinsurancecompany_del'"
          />
          <a-popconfirm
            v-has="'wxhr:tinsurancecompany_del'"
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <insurance-company-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></insurance-company-modal>
    <insurance-company-detail-modal ref="insuranceCompanyDetailForm"></insurance-company-detail-modal>
  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import InsuranceCompanyDetailModal from './modules/InsuranceCompanyDetailModal'
  import XLSX from 'xlsx'
  import { postActionHeader,httpAction } from '@/api/manage'
  import { handleImportData } from '@/utils/common'
  import InsuranceCompanyModal from './modules/InsuranceCompanyModal'

  export default {
    name: 'InsuranceCompanyList',
    mixins: [JeecgListMixin],
    components: {
      InsuranceCompanyModal,
      InsuranceCompanyDetailModal,
    },
    data() {
      return {
        description: '保险公司管理界面',
        fileList: [],
        // 表头
        columns: [
          {
            title: '保险公司名称',
            align: 'center',
            dataIndex: 'companyName'
          },
          {
            title: '对接人',
            align: 'center',
            dataIndex:'companyDocking'
          },
          {
            title: '保险公司地址',
            align: 'center',
            dataIndex: 'companyAddr'
          },
          {
            title: '创建人',
            align: 'center',
            dataIndex: 'createUser'
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime'
          },
          {
            title: '最后更新人',
            align: 'center',
            dataIndex: 'lastUpdateUser'
          },
          {
            title: '最后更新时间',
            align: 'center',
            dataIndex: 'lastUpdateTime'
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/tinsurancecompany/page',
          delete: '/busiInsurance/tinsurancecompany/',
          queryAllInfoById: '/busiInsurance/tinsurancecompany/',
          importExcelUrl: '/hrBase/temployeeinfo/importJsonString',
        }
      }
    },
    methods: {
      // 新建
      handleAdd: function() {
        this.$refs.modalForm.title = '新建保险公司'
        this.$refs.modalForm.add()
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.modalForm.title = '编辑保险公司'
        httpAction(this.url.queryAllInfoById + record.id, '','GET').then((res) => {
          if(res.code===200){
            this.$refs.modalForm.edit(res.data)
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.insuranceCompanyDetailForm.title = '详情'
        httpAction(this.url.queryAllInfoById + record.id, record.id,'GET').then((res) => {
          if(res.code === 200){
            this.$refs.insuranceCompanyDetailForm.edit(res.data)
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      // 批量新增
      batchImport: function() {
        console.log('batchImport')
      },
      // 批量新增模板下载
      batchImportTemplate: function() {
        console.log('batchImportTemplate')
      },
      // 批量更新模板下载
      batchUpdateTemplate: function() {
        console.log('batchUpdateTemplate')
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
            const contextType = {'Content-Type': 'application/json;charset=UTF-8'}
            //开始异步提交
            postActionHeader(this.importExcelUrl, JSON.stringify(newData),contextType).then((res) => {
              if (res.success) {
                this.$message.success("上传成功！")
                this.loadData()
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
