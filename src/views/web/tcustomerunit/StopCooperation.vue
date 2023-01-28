<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="名称">
              <a-input placeholder="名称" v-model="queryParam.customerName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="编码">
              <a-input placeholder="编码" v-model="queryParam.customerCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="停止人">
              <a-input placeholder="停止人" v-model="queryParam.createUserName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="类型">
                <a-select showSearch optionFilterProp="children" placeholder="类型" v-model="queryParam.type">
                  <a-select-option
                    v-for="(value, key) in typeObj"
                    :key="key"
                    :value="key">{{ value }}</a-select-option>
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

    <!-- table区域-begin -->
    <div>
      <div
        class="ant-alert ant-alert-info"
        style="margin-bottom: 16px;"
      >
        已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length }}</a>项
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
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleGoon(record)" v-if="record.type != 1">继续合作</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <a-modal
      title="继续合作"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <a-spin :spinning="confirmLoading">
        <a-form
          :form="form"
          layout="vertical"
          class="ant-advanced-search-form margin-left-explain"
        >
          <a-form-item
            class="stepFormText"
            label="继续合作原因"
          >
            <a-textarea
              placeholder="请输入继续合作原因"
              :autoSize="{ minRows: 5, maxRows: 8 }"
              v-decorator="[ 'restoreReason', { rules:[ { required: true, message: '请输入继续合作原因!' } ] } ]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'StopCooperation',
    mixins: [JeecgListMixin],
    data() {
      return {
        description: '停止合作',
        typeObj:{
          '0':'客户',
          '1':'合同',
          '2':'结算主体',
        },
        visible:false,
        confirmLoading:false,
        form: this.$form.createForm(this),
        // 表头
        columns: [
          {
            width:120,
            ellipsis:true,
            title: '名称',
            align: 'center',
            dataIndex: 'customerName',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            width:120,
            ellipsis:true,
            title: '编码',
            align: 'center',
            dataIndex: 'customerCode',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            width:120,
            ellipsis:true,
            title: '类型',
            align: 'center',
            dataIndex: 'type',
            customRender:(text)=>{
              const type = this.typeObj[text]
              return <a-tooltip
                placement="topLeft"
                title={type}
              >{type}</a-tooltip>
            }
          },
          {
            width:140,
            ellipsis:true,
            title: '停止人',
            align: 'center',
            dataIndex: 'createUserName',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            width:160,
            ellipsis:true,
            title: '停止时间',
            align: 'center',
            dataIndex: 'createDate',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            width:180,
            ellipsis:true,
            title: '停止理由',
            align: 'center',
            dataIndex: 'stopReason',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            width:120,
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/hrBase/tcustomerstop/page?orders%5B0%5D.asc=false&orders%5B0%5D.column=CREATE_DATE',
          goon:'/hrBase/tcustomerstop/goon'
        },
        id:'',
      }
    },
    methods: {
      handleGoon(record) {
        this.visible = true
        this.id = record.id
      },
      handleOk(){
        this.form.validateFields((err, values) => {
          if (!err) {
            const url = `${this.url.goon}?id=${this.id}&restoreReason=${values.restoreReason}`
            httpAction(url,null,'post').then(res=>{
              if(res.code === 200 ){
                this.$message.success('操作成功')
                this.handleCancel()
                this.loadData()
              }else{
                this.$message.warning(res.msg)
              }
            })
          }
        })
      },
      handleCancel(){
        this.visible = false
        this.id = ''
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
