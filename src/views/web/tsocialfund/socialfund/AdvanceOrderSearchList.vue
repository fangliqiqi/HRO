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
            <a-form-item label="员工姓名">
              <a-input
                allowClear
                placeholder="请输入员工姓名"
                v-model="queryParam.empName"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="身份证号">
              <a-input
                allowClear
                placeholder="请输入身份证号"
                v-model="queryParam.empIdcard"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <a-input
                allowClear
                placeholder="请输入结算主体"
                v-model="queryParam.departNameAdd"
              ></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="单位名称">
                <a-input
                  allowClear
                  placeholder="请输入单位名称"
                  v-model="queryParam.customerName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="派单人所属部门">
                <a-input
                  allowClear
                  placeholder="请输入派单人所属部门"
                  v-model="queryParam.userDeptName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="增减类型">
                <a-select
                  allowClear
                  placeholder="请选择增减类型"
                  optionFilterProp="children"
                  v-model="queryParam.type"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option value="0">派增</a-select-option>
                  <a-select-option value="1">派减</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="单据状态">
                <a-select
                  allowClear
                  placeholder="请选择单据状态"
                  optionFilterProp="children"
                  v-model="queryParam.preStatus"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(item,index) in statusOptons"
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
              <a-form-item label="导入开始日期">
                <a-date-picker
                  format="YYYY-MM-DD HH:mm:ss"
                  style="width:100%;"
                  :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                  :disabled-date="disabledStartDate"
                  v-model="queryParam.createTimeStart"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="导入结束日期">
                <a-date-picker
                  format="YYYY-MM-DD HH:mm:ss"
                  :showTime="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }"
                  :disabled-date="disabledEndDate"
                  style="width:100%;"
                  v-model="queryParam.createTimeEnd"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8">
              <a-form-item label="资料是否提交">
                <a-select
                  allowClear
                  placeholder="请选择资料是否提交"
                  optionFilterProp="children"
                  v-model="queryParam.dataSubStatus"
                  :dropdownMatchSelectWidth="false"
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
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- 批量更新 -->
      <a-dropdown v-has="'wxhr:tpredispatchinfo_updateList1'">
        <a-menu slot="overlay">
          <a-menu-item>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleCommit(url.dispatchUpdate,2)"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 6.5px"
              />批量更新
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="downTemplate('/templates/易服批量更新预派单模板.xls')">
            <a-icon type="download" />批量更新模板
          </a-menu-item>
        </a-menu>
        <a-button>批量更新
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-button
        type="primary"
        icon="download"
        @click="exportBtnClick"
        v-has="'wxhr:tpredispatchinfo_doexportPreDispatch1'"
      >导出</a-button>
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <template
          slot="operation"
          slot-scope="text, record"
        >
          <span>
            <a @click="handleDetailClick(record)">详情</a>
            <a
              v-if="Number(record.preStatus) !== 2"
              v-has="'wxhr:tpredispatchinfo_edit1'"
              @click="handleEditBtnClick(record)"
            ><a-divider type="vertical" />修改</a>
          </span>
        </template>
      </a-table>
    </div>
    <advance-order-detail-modal ref="advanceOrderDetailModal"></advance-order-detail-modal>
    <advance-order-edit-modal
      ref="advanceOrderEditModal"
      @ok="modalFormOk"
    ></advance-order-edit-modal>
    <export-field-modal ref="exportFieldModal"></export-field-modal>
    <error-modal
      ref="errorModal"
      @ok="modalFormOk"
    ></error-modal>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction, httpActionHeader } from '@/api/manage'
import AdvanceOrderDetailModal from './modules/AdvanceOrderDetailModal'
import AdvanceOrderEditModal from './modules/AdvanceOrderEditModal'
import ExportFieldModal from '../../global/modules/ExportFieldModal'
import { getHouseHold } from '@/api/api'
import XLSX from 'xlsx'
import ErrorModal from '../../global/modules/ErrorModal'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'AdvanceOrderSearchList',
  mixins: [JeecgListMixin],
  components: {
    AdvanceOrderDetailModal,
    AdvanceOrderEditModal,
    ExportFieldModal,
    ErrorModal
  },
  data() {
    return {
      description: '预派单查询',
      removeLoading: false, // 删除按钮加载动画
      oneKeyLoading: false, // 一键派单按钮loading动画
      householdOptions: [], // 社保公积金户数据
      contractTypeOptions:[], // 员工合同类型
      typeOptions: {
        '0': {'option': '增加派单', 'color': 'green'},
        '1': {'option': '减少派单', 'color': 'red'}},// 派单类型
      statusOptons: {
        '0': { option: '正常未派单', color: 'blue' },
        '1': { option: '异常未派单', color: 'orange' },
        '2': { option: '已派单', color: 'purple' }
      }, // 派单状态
      columns: [
        {
          width: 220,
          ellipsis: true,
          title: 'id',
          align: 'center',
          dataIndex: 'id',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 180,
          ellipsis: true,
          title: '员工姓名',
          align: 'center',
          dataIndex: 'empName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '身份证号',
          align: 'center',
          dataIndex: 'empIdcard',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'departNameAdd',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '单位名称',
          align: 'center',
          dataIndex: 'customerName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 200,
          ellipsis: true,
          title: '派单人所属部门',
          align: 'center',
          dataIndex: 'userDeptName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '缴费地',
          align: 'center',
          dataIndex: 'payAddress',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '增减类型',
          align: 'center',
          dataIndex: 'type',
          customRender: text => {
            const optionItem = this.typeOptions[String(text)]
            return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
          }
        },
        {
          width: 140,
          ellipsis: true,
          title: '单据状态',
          align: 'center',
          dataIndex: 'preStatus',
          customRender: text => {
            const optionItem = this.statusOptons[String(text)]
            return <a-tag color={optionItem.color}>{optionItem.option}</a-tag>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '是否派单',
          align: 'center',
          dataIndex: 'dispatchFlag',
          customRender: text => {
            const resultText = String(text) === '0'?'是':'否'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 120,
          ellipsis: true,
          title: '资料是否提交',
          align: 'center',
          dataIndex: 'dataSubStatus',
          customRender: text => {
            const resultText = String(text) === '0'?'是':'否'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '备注',
          align: 'center',
          dataIndex: 'remark',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '导入日期',
          align: 'center',
          dataIndex: 'createTime',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 150,
          ellipsis: true,
          title: '导入人',
          align: 'center',
          dataIndex: 'createUserName',
          customRender: text => {
            return <a-tooltip title={text}>{text}</a-tooltip>
          }
        },
        {
          width: 120,
          title: '操作',
          align: 'center',
          fixed: 'right',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      url: {
        list: '/hrSocial/tpredispatchinfo/pageAuth', // 列表数据
        detailUrl: '/hrSocial/tpredispatchinfo/', // 详情
        exportUrl: '/hrSocial/tpredispatchinfo/doexportPreDispatch', // 导出
        exportFieldUrl: '/hrSocial/tpredispatchinfo/getPreDispatchExportVoFieldName', // 导出中文字段
        dispatchUpdate: '/hrSocial/tpredispatchinfo/analysisJsonStringUpdate', // 批量更新
      },
    }
  },
  created() {
    // 获取社保户、公积金户
    getHouseHold().then(res => {
      if (Number(res.code) === 200) {
        this.householdOptions = res.data
      } else {
        this.$message.error('社保户数据请求失败！')
      }
    })
  },
  methods: {
    disabledStartDate(startValue) {
      const endValue = this.queryParam.createTimeEnd
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.queryParam.createTimeStart
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    // 详情
    handleDetailClick(record) {
      const detailUrl = this.url.detailUrl + record.id
      httpAction(detailUrl, '', 'GET').then(res => {
        if (Number(res.code) === 200) {
          this.$refs.advanceOrderDetailModal.title = '详情'
          this.$refs.advanceOrderDetailModal.contractTypeOptions = this.contractTypeOptions
          this.$refs.advanceOrderDetailModal.show(res.data || {})
        } else {
          this.$message.error(res.msg || '详情获取失败！')
        }
      })
    },
    // 修改,编辑
    handleEditBtnClick(record) {
      const detailUrl = this.url.detailUrl + record.id
      httpAction(detailUrl, '', 'GET').then(res => {
        if (Number(res.code) === 200) {
          this.$refs.advanceOrderEditModal.title = '编辑'
          this.$refs.advanceOrderEditModal.contractTypeOptions = this.contractTypeOptions
          this.$refs.advanceOrderEditModal.show(res.data || {})
        } else {
          this.$message.error(res.msg || '详情获取失败！')
        }
      })
    },
    // 模板下载
    downTemplate(templateUrl) {
      const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port + templateUrl}`
      window.location.href = url
    },
    // 导出
    exportBtnClick() {
      this.$refs.exportFieldModal.title = '预派单导出'
      this.$refs.exportFieldModal.url.exportXlsUrl = this.url.exportUrl
      this.$refs.exportFieldModal.url.exportFields = this.url.exportFieldUrl
      this.$refs.exportFieldModal.params = this.getQueryParams() //查询条件
      this.$refs.exportFieldModal.add(this.selectedRowKeys)
    },
    // 批量更新，派减
    handleCommit(requestUrl, type) {
      var that = this
      const { fileList } = this
      if (!fileList.length) {
        return
      }
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
              data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name], { defval: '', blankrows: true }))
              break
            }
          }
          // 去除每个字段的前后空格以及最后的空格行
          const newData = that.handleEmptyRow(data[sheetName])
          const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
          const title = type === 1?'批量减少':'批量更新'
          //开始异步提交
          httpActionHeader(requestUrl, encodeURI(JSON.stringify(newData)), 'POST', contextType, 600000).then(res => {
            const msg = res.message || res.msg
            if (res.errorMessageList !== null && res.errorMessageList.length) {
              that.loading = false
              that.$refs.errorModal.title = `${title}提示: ${msg}`
              that.$refs.errorModal.message = msg
              that.$refs.errorModal.showModal(res.errorMessageList)
              that.fileList = []
            } else {
              that.loading = false
              if (Number(res.code) === 200) {
                that.$message.success(`${title}成功！`)
              }else {
                that.$message.warn(res.msg || `${title}出错！`)
              }
              that.fileList = []
            }
          })
        } catch (e) {
          that.loading = false
          // 这里可以抛出文件类型错误不正确的相关提示
          that.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(fileList[0])
    },
    // 处理文件空行问题
    handleEmptyRow(newData) {
      // 去除最后的空格行
      for (let i = newData.length - 1; i >= 0; i--) {
        // 判断数组是否全为空
        const flag = Object.values(newData[i]).find(item => {
          return String(item).replace(/^\s*|\s*$/g,"").length
        })
        if (!flag) {
          newData.splice(i, 1)
        } else {
          break
        }
      }
      return newData
    },
    // 数据字典
    initDictConfig() {
      // 员工合同类型
      initDictOptions('employee_contract_type').then((res) => {
        if (Number(res.code) === 200) {
          this.contractTypeOptions = res.data
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
