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
            <a-form-item label="结算月份">
              <j-month
                placeholder="请选择结算月份"
                v-model="queryParam.settlementMonth"
                date-format="YYYYMM"
              ></j-month>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="预估差额">
              <a-input
                placeholder="请输入预估差额"
                v-model="queryParam.balance"
              />
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
          slot="status"
          slot-scope="text"
        >
          <a-tag :color="color[text]">{{ statusOptions[text] }}</a-tag>
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleEdit(record)"
            v-if="record.status == 0"
            v-has="'wxhr:aloneforecastbuypayform_edit'"
          >修改结算月</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <a-modal
      title="结算月修改"
      :visible="visible"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form
          :form="form"
          layout="inline"
        >
          <a-form-item label="结算月">
            <a-month-picker
              format="YYYYMM"
              placeholder="请选择结算月!"
              v-decorator="['settlementMonth',{rules: [{ required: true, message: '请选择结算月!' }]}]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JMonth from '@/components/jeecg/JMonth'
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'EstimatedSettle',
    mixins: [JeecgListMixin],
    components: {
      JMonth,
    },
    data() {
      return {
        description: '商险预估结算',
        statusOptions: ['待结算','结算中','已结算','待审核'],
        color:['orange','blue','green'],
        visible:false,
        confirmLoading:false,
        settleId:'',
        form: this.$form.createForm(this),

        // 表头
        columns: [
          {
            title: '结算主体编码',
            align: 'center',
            dataIndex: 'settleDomainNo'
          },
          {
            title: '结算主体名称',
            align: 'center',
            dataIndex: 'settleDomainName',
          },
          {
            title: '客户名称',
            align: 'center',
            dataIndex: 'customerName',
          },
          {
            title: '预估差额',
            align: 'center',
            dataIndex: 'balance',
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '结算月份',
            align: 'center',
            dataIndex: 'settlementMonth',
          },
          {
            title: '创建人',
            dataIndex: 'createUser',
            align: 'center',
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/busiInsurance/aloneforecastbuypayform/page',
          edit:'/busiInsurance/aloneforecastbuypayform'

        }
      }
    },
    methods: {
      handleEdit(record){
        this.settleId = record.id
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({settlementMonth:moment(record.settlementMonth,'YYYYMM')}, 'settlementMonth'))
        })
      },

      handleOk(){
        this.form.validateFields((err, values) => {
          if (!err) {
            const settlementMonth = moment(values.settlementMonth).format('YYYYMM')
            httpAction(this.url.edit,{settlementMonth:settlementMonth,id:this.settleId},'PUT').then((res)=>{
              if(res.code === 200){
                this.$message.success('保存成功！')
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
        this.settleId = ''
      },

    }
  }
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

</style>
