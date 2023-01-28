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
            <a-form-item label="提醒类型">
              <a-input
                allowClear
                placeholder="提醒类型"
                v-model="queryParam.type"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="提醒人">
              <a-input
                allowClear
                placeholder="提醒人"
                v-model="queryParam.userName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="提醒时间">
              <a-range-picker
                v-model="queryParam.createDate_extra"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="changeRange"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="提醒内容">
                <a-input
                  allowClear
                  placeholder="提醒内容"
                  v-model="queryParam.message"
                />
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
    <!-- 操作按钮区域 -->
    <!-- <div class="table-operator">
      <a-button
        @click="exportContract"
        type="primary"
        icon="download"
      >导出</a-button>
    </div> -->
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
        :scroll="{ x: 1}"
      > 
      </a-table>
    </div>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: 'LimitDispatchRemind',
    mixins: [JeecgListMixin],
    data() {
      return {
        description: '未结算提醒',
        dataSource:[],
        settleOption:['未结算','已结算',],
        loading: false,
        columns: [
          {
            width: 120,
            ellipsis: true,
            title: '提醒类型',
            align: 'center',
            dataIndex: 'type',
            customRender: text => {
              return <a-tooltip title={text}>{text}</a-tooltip>
            }
          },
          {
            width: 100,
            ellipsis: true,
            title: '提醒人',
            align: 'center',
            dataIndex: 'userName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
          width: 100,
          ellipsis: true,
          title: '提醒时间',
          align: 'center',
          dataIndex: 'createDate',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
            }
          },
          {
          ellipsis: true,
          title: '提醒内容',
          align: 'center',
          dataIndex: 'message',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
            }
          }
        ],
        url: {
          list: '/hrSocial/tfinancemessage/page?orders%5B0%5D.asc=false&orders%5B0%5D.column=create_date',
          exportExcel:'/hrBase/TSettleAlertSysMsg/getList'
        },
      }
    },
    methods: {
      changeRange(date, dateString){
        if(Object.keys(date).length){
          this.queryParam.createDateStart = dateString[0]
          this.queryParam.createDateEnd = dateString[1]
        }else{
          delete this.queryParam.createDateStart
          delete this.queryParam.createDateEnd
        }
      },
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

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
