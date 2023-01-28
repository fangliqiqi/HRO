<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="4"
            :sm="6"
          >
            <a-form-item label="城市">
              <a-input
                allowClear
                placeholder="请输入城市"
                v-model="queryParam.areaName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="10"
            :sm="8"
          >
            <a-form-item
              label="缴纳地市"
              class="stepFormText"
            >
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="选择省份"
                v-model="queryParam.province"
                style="width: 32%"
                @change="handleProvinceChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaTrees"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="选择城市"
                v-model="queryParam.city"
                style="margin-left: 2%; width: 32%"
                @change="handleCityChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in cityList"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="选择区县"
                v-model="queryParam.town"
                style="margin-left: 2%; width: 32%"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in townList"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="截止日期">
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择截止日期"
                v-model="queryParam.day"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="count in 31"
                  :key="count"
                  :value="count"
                >{{ `${count}号` }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="4"
            :sm="6"
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
        @click="addBtnClick"
        v-has="'wxhr:tdispatchdayconf_add'"
      >添加</a-button>
      <a-button
        type="danger"
        icon="minus"
        :disabled="!selectedRowKeys.length"
        :loading="removeLoading"
        @click="removeBtnClick"
        v-has="'wxhr:tdispatchdayconf_del'"
      >删除</a-button>
    </div>
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
        <template
          slot="operation"
          slot-scope="text, record"
        >
          <span>
            <a
              v-has="'wxhr:tdispatchdayconf_edit'"
              @click="handleEditBtnClick(record)"
            >修改</a>
            <a-popconfirm
              title="确定删除吗?"
              @confirm="handleDelete(record.id)"
              v-has="'wxhr:tdispatchdayconf_del'"
            >
              <a-divider type="vertical" />
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
    </div>
    <limit-config-modal
      ref="limitConfigModal"
      @ok="modalFormOk"
    ></limit-config-modal>
  </a-card>
</template>
<script>
import Vue from 'vue'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import LimitConfigModal from './modules/LimitConfigModal'
import { httpAction } from '@/api/manage'
import { getAreaName } from '@/utils/common'

export default {
  name: 'AdvanceLimitConfig',
  mixins: [JeecgListMixin],
  components: {
    LimitConfigModal
  },
  data() {
    return {
      description: '预派限制',
      removeLoading: false, // 删除按钮加载动画
      dayList: [], // 截止日期
      areaTrees:[], // 省
      cityList:[], // 市
      townList:[], // 区
      columns: [
        {
          ellipsis: true,
          title: '省',
          align: 'center',
          dataIndex: 'province',
          customRender: text => {
            const resultText = getAreaName(text) || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '市',
          align: 'center',
          dataIndex: 'city',
          customRender: (text, record) => {
            const array = this.packetAreaData(record.province, record.city, record.town)
            if (array.length > 1) {
              return <a-tooltip title={array[1]}>{array[1]}</a-tooltip>
            }
            return '-'
          }
        },
        {
          ellipsis: true,
          title: '县',
          align: 'center',
          dataIndex: 'town',
          customRender: (text, record) => {
            const array = this.packetAreaData(record.province, record.city, record.town)
            if (array.length > 2) {
              return <a-tooltip title={array[2]}>{array[2]}</a-tooltip>
            }
            return '-'
          }
        },
        {
          ellipsis: true,
          title: '截止日期',
          align: 'center',
          dataIndex: 'day',
          customRender: text => {
            const resultText = text ? `${text}号` : '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          title: '操作',
          align: 'center',
          fixed: 'right',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      url: {
        list: '/hrSocial/tdispatchdayconf/page', // 列表数据
        delete: '/hrSocial/tdispatchdayconf/', // 删除
        detailUrl: '/hrSocial/tdispatchdayconf/', // 获取详情
        batchRemoveUrl: '/hrSocial/tdispatchdayconf/removeByIds' // 批量删除
      }
    }
  },
  created() {
    // 地区
    this.areaTrees = Vue.ls.get('glob_area')
  },
  methods: {
    packetAreaData(province, city, town) {
      const result = getAreaName(province, city, town)
      if (result) {
        return result.split('-')
      }
      return []
    },
    // 添加按钮事件
    addBtnClick() {
      this.$refs.limitConfigModal.title = '添加预派限制'
      this.$refs.limitConfigModal.provinceList = this.areaTrees
      this.$refs.limitConfigModal.show()
    },
    // 批量删除按钮事件
    removeBtnClick() {
      const that = this
      this.$confirm({
        title: '确定删除所选项?',
        content: '删除后数据无法恢复，请谨慎操作！',
        okText: '删除',
        onOk() {
          that.batchDetail()
        },
        onCancel() {}
      })
    },
    batchDetail() {
      const idStr = this.selectedRowKeys.join(',')
      const that = this
      that.removeLoading = true
      const url = `${this.url.batchRemoveUrl}?&ids=${idStr}`
      httpAction(url, {}, 'POST').then(res => {
        if (Number(res.code) === 200) {
          that.$message.success('删除成功！')
          that.removeLoading = false
          that.selectedRowKeys = []
          that.loadData()
        } else {
          that.removeLoading = false
          that.$message.error(res.msg || '删除失败！')
        }
      })
    },
    // 修改
    handleEditBtnClick(record) {
      const detailUrl = this.url.detailUrl + record.id
      httpAction(detailUrl, '', 'GET').then(res => {
        if (Number(res.code) === 200) {
          this.$refs.limitConfigModal.title = '修改预派限制'
          this.$refs.limitConfigModal.provinceList = this.areaTrees
          this.$refs.limitConfigModal.edit(res.data)
        } else {
          this.$message.error(res.msg || '详情获取失败！')
        }
      })
    },
    // 切换省份
    handleProvinceChange(value){
      this.cityList = []
      this.townList = []
      if (value) {
        for (const city of this.areaTrees[value - 1].children) {
          this.cityList.push(city)
        }
      }
      delete this.queryParam.city
      delete this.queryParam.town
    },
    // 切换城市
    handleCityChange(value){
      this.townList = []
      if (value) {
        for (const city of this.cityList) {
          if (String(city.id) === String(value)) {
            if (city.children.length > 0) {
              for (const town of city.children) {
                this.townList.push(town)
              }
            }
          break
          }
        }
      }
      delete this.queryParam.town
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
