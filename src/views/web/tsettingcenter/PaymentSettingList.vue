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
            <a-form-item
              label="社保缴纳地"
              class="stepFormText"
            >
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="选择省份"
                v-model="queryParam.province"
                style="width: 49%"
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
                style="margin-left: 2%; width: 49%"
                @change="handleCityChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaCitys"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
              <!-- <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="选择区县"
                v-model="queryParam.town"
                style="margin-left: 2%; width: 32%"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaTowns"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select> -->
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item
              label="是否在用"
              class="stepFormText"
            >
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                v-model="queryParam.openFlag"
                placeholder="请选择是否在用查询"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(value, key) in openFlagOptions"
                  :key="key"
                  :value="key"
                >{{ value.option }}</a-select-option>
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
        @click="handleAdd"
        v-has="'wxhr:tagentconfig_add'"
      >创建新配置</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{x: 1}"
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
          <a @click="handleDetail(record)">详情</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tagentconfig_edit'"
          />
          <a
            @click="handleEdit(record)"
            v-has="'wxhr:tagentconfig_edit'"
          >编辑</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tagentconfig_del'"
          />
          <a-popconfirm
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
            v-has="'wxhr:tagentconfig_del'"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>

        <!-- 是否在用 -->
        <span
          slot="openFlag"
          slot-scope="text, record, rowIndex"
        >
          <a-popconfirm
            title="确定操作吗?"
            @confirm="() => handleOpenFlagChange(record, rowIndex)"
          >
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :checked="text==0 ? true : false"
            />
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <payment-setting-add-modal
      ref="paymentSettingAddModal"
      @ok="modalFormOk"
    ></payment-setting-add-modal>
    <error-modal ref="errorModal"></error-modal>
  </a-card>
</template>

<script>
  import Vue from 'vue'
  import { areaMapTrees } from '@/api/api'
  import { httpAction, postAction } from '@/api/manage'
  import ErrorModal from '../global/modules/ErrorModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import PaymentSettingAddModal from './modules/PaymentSettingAddModal'

  export default {
    name: 'PaymentSettingList',
    mixins: [JeecgListMixin],
    components: {
      ErrorModal,
      PaymentSettingAddModal,
    },
    data() {
      return {
        description: '政策配置表',
        //枚举字段
        year: [],  // 年限数组
        areaTrees: [],  // 地区
        areaCitys: [],  // 档案城市
        areaTowns: [],  // 档案区县
        areaMapTrees:[],
        loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
        openFlagOptions: {'0': {'option': '是', 'color': 'green'}, '1': {'option': '否', 'color': 'red'}},
        userTypeOption: {'0': {'option': '单位', 'color': 'blue'}, '1': {'option': '个人', 'color': 'red'}, '2': {'option': '全部', 'color': 'green'}},
        policyTypeOption: {'0': {'option': '全额', 'color': 'green'}, '1': {'option': '减半', 'color': 'red'}, '2': {'option': '免缴', 'color': 'blue'}},
        // excel表头数据
        exportFields: [
        ],
        // 表头
        columns: [
          {
            width: 165,
            ellipsis: true,
            title: '社保缴纳地',
            align: 'center',
            dataIndex: 'province',
            customRender:(text, record) => {
              const name = this.getAreaMapName(record.province, record.city, null)
              const str = name ? name : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '适用范围',
            align: 'center',
            dataIndex: 'target',
            customRender:(text) => {
              const str = this.userTypeOption.hasOwnProperty(text) ? this.userTypeOption[text].option : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '适用年份',
            align: 'center',
            dataIndex: 'year',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '生效月份',
            align: 'center',
            dataIndex: 'startMonth',
            customRender:(text, record) => {
              const str = (text ? text : '-') + '~' + (record.endMonth ? record.endMonth : '-')
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '养老',
            align: 'center',
            dataIndex: 'pension',
            customRender:(text) => {
              const color = this.policyTypeOption.hasOwnProperty(text) ? this.policyTypeOption[text].color : 'blue'
              const str = this.policyTypeOption.hasOwnProperty(text) ? this.policyTypeOption[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '医疗',
            align: 'center',
            dataIndex: 'medical',
            customRender:(text) => {
              const color = this.policyTypeOption.hasOwnProperty(text) ? this.policyTypeOption[text].color : 'blue'
              const str = this.policyTypeOption.hasOwnProperty(text) ? this.policyTypeOption[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '生育',
            align: 'center',
            dataIndex: 'bear',
            customRender:(text) => {
              const color = this.policyTypeOption.hasOwnProperty(text) ? this.policyTypeOption[text].color : 'blue'
              const str = this.policyTypeOption.hasOwnProperty(text) ? this.policyTypeOption[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '失业',
            align: 'center',
            dataIndex: 'unemployed',
            customRender:(text) => {
              const color = this.policyTypeOption.hasOwnProperty(text) ? this.policyTypeOption[text].color : 'blue'
              const str = this.policyTypeOption.hasOwnProperty(text) ? this.policyTypeOption[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '工伤',
            align: 'center',
            dataIndex: 'injury',
            customRender:(text) => {
              const color = this.policyTypeOption.hasOwnProperty(text) ? this.policyTypeOption[text].color : 'blue'
              const str = this.policyTypeOption.hasOwnProperty(text) ? this.policyTypeOption[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '是否在用',
            align: 'center',
            dataIndex: 'openFlag',
            scopedSlots: { customRender: 'openFlag' },
          },
          {
            width: 160,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            customRender:(text) => {
              const Str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 170,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: 'hrSocial/tagentconfig/page',
          delete: 'hrSocial/tagentconfig/',
          queryAllInfoById: 'hrSocial/tagentconfig/',
          updateOpenFlagById: 'hrSocial/tagentconfig/updateOpenFlagById',
        },
      }
    },
    created() {
      // 地区
      this.areaTrees = Vue.ls.get('glob_area')
      areaMapTrees().then((res) => {
        if (Number(res.code) === 200) {
          this.areaMapTrees = res.data
        }
      })
      // 年份
      const cYear = 2020 // 当前年份
      const tYear = cYear + 10
      for(let i = cYear; i <= tYear; i++) {
        this.year.push(i + '')
      }
    },
    methods: {
      // 新建
      handleAdd: function() {
        this.$refs.paymentSettingAddModal.title = '社保临时政策配置'
        this.$refs.paymentSettingAddModal.year = this.year
        this.$refs.paymentSettingAddModal.areaTrees = this.areaTrees
        this.$refs.paymentSettingAddModal.userTypeOption = this.userTypeOption
        this.$refs.paymentSettingAddModal.policyTypeOption = this.policyTypeOption
        this.$refs.paymentSettingAddModal.add()
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.paymentSettingAddModal.id = record.id
        this.$refs.paymentSettingAddModal.title = '社保临时政策配置'
        this.$refs.paymentSettingAddModal.year = this.year
        this.$refs.paymentSettingAddModal.areaTrees = this.areaTrees
        this.$refs.paymentSettingAddModal.userTypeOption = this.userTypeOption
        this.$refs.paymentSettingAddModal.policyTypeOption = this.policyTypeOption
        httpAction(this.url.queryAllInfoById + record.id, {}, 'GET').then((res) => {
          if (Number(res.code) === 200 && res.data) {
            this.$refs.paymentSettingAddModal.edit(res.data)
          } else {
            this.$message.error('数据不完整！')
          }
        })
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.paymentSettingAddModal.id = record.id
        this.$refs.paymentSettingAddModal.title = '社保临时政策配置'
        this.$refs.paymentSettingAddModal.year = this.year
        this.$refs.paymentSettingAddModal.isDetail = true
        this.$refs.paymentSettingAddModal.areaTrees = this.areaTrees
        this.$refs.paymentSettingAddModal.userTypeOption = this.userTypeOption
        this.$refs.paymentSettingAddModal.policyTypeOption = this.policyTypeOption
        httpAction(this.url.queryAllInfoById + record.id, {}, 'GET').then((res) => {
          if (Number(res.code) === 200 && res.data) {
            this.$refs.paymentSettingAddModal.edit(res.data)
          } else {
            this.$message.error('数据不完整！')
          }
        })
      },
      // 是否在用
      handleOpenFlagChange(record, index) { 
        const url = `${this.url.updateOpenFlagById}?id=${record.id}`
        const openFlag = String(record.openFlag) === '0' ? 1 : 0  // 修改状态
        postAction(url, {}).then((res) => {
          if (Number(res.code) === 200) {
            this.$set(this.dataSource[index], 'openFlag', openFlag)
            this.$message.success('状态修改成功！')
          } else {
            this.$message.warning(res.msg || res.message)
          }
        }).finally(() => {
          this.loadData()
        })
      }, 
      // 省份切换
      handleProvinceChange(value) {
        this.areaCitys = []
        this.areaTowns = []
        if (value) {
          for (const c of this.areaTrees[value - 1].children) {
            this.areaCitys.push(c)
          }
        }
        delete this.queryParam.city
      },
      // 城市切换
      handleCityChange(value) {
        this.areaTowns = []
        if (value) {
          for (const c of this.areaCitys) {
            if (String(c.id) === String(value)) {
              if (c.children.length > 0) {
                for (const t of c.children) {
                  this.areaTowns.push(t)
                }
              }
            break
            }
          }
        }
        delete this.queryParam.town
      },
      // 地区渲染显示
      getAreaMapName(pid, cid, aid) {
        let area = ''
        if(pid){
          area += this.areaMapTrees.hasOwnProperty(pid) ? this.areaMapTrees[pid].areaName : '-'
        }
        if(cid){
          area += `-${(this.areaMapTrees.hasOwnProperty(cid) ? this.areaMapTrees[cid].areaName : '-')}`
        }
        if(aid){
          area += `-${(this.areaMapTrees.hasOwnProperty(aid) ? this.areaMapTrees[aid].areaName : '-')}`
        }
        return area
      },
      // 重置按钮
      searchReset() {
        this.queryParam = {}
        this.areaCitys = []
        this.areaTowns = []
        this.loadData(1)
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
