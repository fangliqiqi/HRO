<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <a-input
                v-model="queryParam.departName"
                placeholder="请输入结算主体"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="发放状态">
              <a-select
                v-model="queryParam.status"
                placeholder="请选择"
                default-value="0"
              >
                <a-select-option
                  v-for="(item,index) in querySalaryStatusOptions"
                  :key="index"
                  :value="index"
                >{{ item.option }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算月份">
              <a-month-picker
                v-model="queryParam.settlementMonth"
                style="width: 100%"
                placeholder="请选择结算月份"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
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
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div
      class="table-operator"
      style="margin-bottom:10px"
    >
      <a-button
        type="primary"
        @click="handleAdd"
      >报表导入</a-button>
      <a-button
        style="margin-left:20px"
        type="primary"
        @click="handleDown"
      >下载模板</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1">
            <a-icon type="delete" />删除</a-menu-item>
          <!-- lock | unlock -->
          <a-menu-item key="2">
            <a-icon type="lock" />锁定</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

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
            @click="handleSumbit(record)"
            v-have="'wxhr:salarystandard_submit'"
          >提交</a>
          <a-divider type="vertical" />
          <a @click="handleOpen(record)">开票信息</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确认删除吗?"
            @confirm="handleDel(record)"
            okText="确定"
            cancelText="取消"
          >
            <a
              href="#"
              v-have="'wxhr:tsalarystandard_del'"
            >删除</a>
          </a-popconfirm>
        </span>
        <!-- 发放状态 -->
        <span
          slot="salaryStatus"
          slot-scope="text, record"
        >
          <template v-for="(salaryStatus, key) in salaryStatusOptions">
            <a-tag
              :key="key"
              v-if="record.status == key"
              :color="salaryStatus.color"
            >{{ salaryStatus.option }}</a-tag>
          </template>
        </span>

      </a-table>
    </div>
    <!-- 表单区域 -->
    <no-person-export
      ref="modalForm"
      @ok="modalFormOk"
    ></no-person-export>
    <no-person-detail
      ref="modalDetail"
      @ok="modalFormOk"
    ></no-person-detail>
    <open-ticket-modal
      ref="modalOpen"
      @ok="modalFormOk"
    ></open-ticket-modal>
  </a-card>
</template>
<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import NoPersonExport from './modules/NoPersonExport'
  import NoPersonDetail from './modules/NoPersonDetail'
  import OpenTicketModal from './modules/OpenTicketModal'
  import { deleteAction,httpAction } from '@/api/manage'

  export default {
    name: "NoPersonTaxList",
    mixins: [JeecgListMixin],
    components: {
      NoPersonExport,
      NoPersonDetail,
      OpenTicketModal
    },
    data () {
      return {
        queryParam: {},
        querySalaryStatusOptions: {
          '0':{'option': '待提交', 'color': 'green'},
          '5':{'option':'审核不通过', 'color': 'yellow'},
          '7':{'option':'财务退回', 'color': 'black'},
        },
        salaryStatusOptions:{
          '0':{'option': '待提交', 'color': 'green'},
          '1':{'option': '待审核', 'color': 'red'},
          '3':{'option': '待发放', 'color': 'blue'},
          '4':{'option': '已发放', 'color': 'orange'},
          '5':{'option':'审核不通过', 'color': 'yellow'},
          '6':{'option':'确认不通过', 'color': 'purple'},
          '7':{'option':'财务退回', 'color': 'black'},
          '8':{'option':'结算单调整待审核', 'color': 'pink'}, 
          '9':{'option':'结算单调整待打印', 'color': 'deepskyblue'}
        },
        columns: [
          {
            title: '发放状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'salaryStatus' },
          },
          {
            title: '结算主体',
            align: 'center',
            dataIndex: 'departName'
          },
          {
            title: '结算月份',
            width: 120,
            dataIndex: 'settlementMonth',
            align: 'center',
          },
          {
            title: '结算金额',
            align: 'center',
            dataIndex: 'settlementAmount',
            customRender: (text) => {
              return text ? text.toLocaleString() : '-'
            }
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '180px',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: '/salary/tsalarystandard/applySalaryStandardPage?type=1',
          delete: '/salary/tsalarystandard/',
          deleteBatch: '/hrBase/temployeeinfo/deleteBatch',
          openBill:'/salary/salary/openBill', // 获取详情
        },
      }
    },
    methods:{
      //下载模板
      handleDown(){
        const templateUrl = '/templates/非扣税项模板.xlsx'
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
        window.location.href = url
      },
      //提交
      handleSumbit(record) {
        const url = `${this.url.openBill}?salaryFormId=${record.id}`
        httpAction(url,{},'POST').then((res) => {
          if(Number(res.code) === 200){
            this.$refs.modalDetail.title = '工资报表'
            this.$refs.modalDetail.show(record,res.data || {} )
          }else {
            this.$message.warn(res.msg || '详情获取失败！')
          }
        })
      },
      //开票信息
      handleOpen(record){
        this.$refs.modalOpen.show(record)
      },
      //删除
      handleDel(record){
        let isOk = 0
        const that = this
        if(record.matchSort && record.advanceMoney > 0){
          isOk = 1
          this.$message.error("请先去作废匹配记录与垫付记录")
        }
        if(record.matchSort && !record.advanceMoney){
          isOk = 1
          this.$message.error("请先去作废匹配记录")
        }
        if(!record.matchSort && record.advanceMoney != 0){
          isOk = 1
          this.$message.error("请先去作废垫付记录")
        }
        if(isOk == 0){
          if(record.ticketAmount){
            this.$confirm({
              title: '信息提示',
              content: '是否清空开票信息',
              onOk() {
                deleteAction(that.url.delete + record.id).then((res) => {
                  if(Number(res.code) === 200){
                    that.$message.success('删除成功!')
                    that.loadData()
                  }else{
                    that.$message.warning(res.message || res.msg)
                  }
                })
              },
              onCancel() {},
            });
          }else{
            deleteAction(that.url.delete + record.id).then((res) => {
              if(Number(res.code) === 200){
                that.$message.success('删除成功!')
                that.loadData()
              }else{
                that.$message.warning(res.message || res.msg)
              }
            })
          }
        }
      },
    }
  }
</script>
