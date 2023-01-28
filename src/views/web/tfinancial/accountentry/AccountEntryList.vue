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
            <a-form-item label="来款单位">
              <a-input
                placeholder="请输入来款单位查询"
                v-model="queryParam.incomeUnit"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="起始时间">
              <a-date-picker
                placeholder="请选择起始时间查询"
                format="YYYY-MM-DD HH:mm:ss"
                v-model="queryParam.dateTemp"
                @change="handleTimeBeginChange"
                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="截止时间">
              <a-date-picker
                placeholder="请选择截止时间查询"
                format="YYYY-MM-DD HH:mm:ss"
                v-model="queryParam.dateTemp1"
                @change="handleTimeEndChange"
                :showTime="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item
                label="状态"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择状态查询"
                  v-model="queryParam.status"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="(value, key) in statusOptions"
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
              <a-form-item
                label="到款单位"
                class="stepFormText"
              >
                <a-select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择到款单位查询"
                  v-model="queryParam.paymentUnit"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option
                    v-for="value in paymentUnitOption"
                    :key="value.id"
                    :value="value.value"
                  >{{ value.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="进账金额">
                <a-input-group compact>
                  <a-input
                    style=" width: 43%; text-align: center"
                    placeholder="最小金额"
                    @change="changeIncomFee1"
                    v-model="queryParam.incomeFee1"
                  />
                  <a-input
                    style=" width: 14%; border-left: 0; pointer-events: none; background-color: #fff"
                    placeholder="~"
                    disabled
                  />
                  <a-input
                    style="width: 43%; text-align: center; border-left: 0"
                    placeholder="最大金额"
                    @change="changeIncomFee2"
                    v-model="queryParam.incomeFee2"
                  />
                </a-input-group>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="记账人">
                <a-input
                  placeholder="请输入记账人查询"
                  v-model="queryParam.createUserName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="财务备注">
                <a-input
                  placeholder="请输入财务备注查询"
                  v-model="queryParam.remark"
                ></a-input>
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
      <a-button
        type="primary"
        icon="plus"
        @click="handleAdd"
        v-has="'wxhr:tincome_add'"
      >添加入账</a-button>
      <a-button
        type="primary"
        icon="export"
        @click="handleExport"
        v-has="'wxhr:tincome_export'"
        v-if="selectedRowKeys.length || Object.keys(queryParam).length"
      >导出</a-button>
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item :disabled="btnLoading">
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :beforeUpload="beforeUpload"
              @change="handleChange"
              accept=".xls,.xlsx"
            >
              <a-icon
                type="import"
                style="margin-right: 10px"
              />批量入账并发布认领
            </a-upload>
          </a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/标准财务入账批量导入模板.xlsx')">
            <a-icon type="download" />标准模板下载</a-menu-item>
          <a-menu-item @click="handleDownloadTemplate('/templates/易服财务入账批量导入模板.xlsx')">
            <a-icon type="download" />易服模板下载</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">批量入账
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
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
        :scroll="{x: 1}"
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
          <a @click="handleDetail(record)">详情</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tincome_edit'"
            v-if="record.status==0 || record.status==1"
          />
          <a
            v-has="'wxhr:tincome_edit'"
            v-if="record.status==0 || record.status==1"
            @click="handleEdit(record)"
          >编辑</a>
          <a-divider
            type="vertical"
            v-has="'wxhr:tincome_release'"
            v-if="record.status==0"
          />
          <a-popconfirm
            v-if="record.status==0"
            title="确定发布吗?"
            @confirm="() => handleRelease(record)"
            v-has="'wxhr:tincome_release'"
          >
            <a>发布认领</a>
          </a-popconfirm>
          <a
            v-has="'wxhr:tincome_del'"
            v-if="Number(record.status) === 0 || Number(record.status) === 1"
            @click="handleIncomeBack(record)"
          ><a-divider type="vertical"/>入账退回</a>
          <a-divider
            v-if="record.status==0 || record.status==1"
            type="vertical"
            v-has="'wxhr:tincome_del'"
          />
          <a-popconfirm
            v-if="record.status==0 || record.status==1"
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
            v-has="'wxhr:tincome_del'"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <account-entry-add-modal
      ref="accountEntryAddModal"
      @ok="modalFormOk"
    ></account-entry-add-modal>
    <error-modal
      ref="errorModal"
      @ok="modalFormOk"
    ></error-modal>
    <entry-return-modal ref="entryReturnModal" @ok="modalFormOk"></entry-return-modal>
  </a-card>
</template>

<script>
  import { httpAction,httpActionHeader } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import AccountEntryAddModal from './modules/AccountEntryAddModal'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import XLSX from 'xlsx'
  import { handleImportData,getNameFromArr } from '@/utils/common'
  import ErrorModal from '../../global/modules/ErrorModal'
  import EntryReturnModal from './modules/EntryReturnModal'

  export default {
    name: 'AccountEntryList',
    mixins: [JeecgListMixin],
    components: {
      AccountEntryAddModal,
      ErrorModal,
      EntryReturnModal
    },
    data() {
      return {
        description: '入账',
        // 枚举字段
        dateFormat: "YYYY-MM-DD HH:mm:ss",  // 时间格式化
        statusOptions: {
          '0': {'option': '确认入账', 'color': 'blue'},
          '1': {'option': '发布认领', 'color': 'cyan'},
          '2': {'option': '部分认领', 'color': 'purple'},
          '3': {'option': '全部认领', 'color': 'green'},
          '4': {'option': '入账退回', 'color': 'red'}
        },
        statusArr:[
          '确认入账','确认入账并发布认领','部分认领','全部认领','入账退回'
        ],
        // excel表头数据
        exportFields: [],
        // 表头
        columns: [
          {
            width: 350,
            ellipsis: true,
            title: '来款单位',
            align: 'center',
            dataIndex: 'incomeUnit',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 300,
            ellipsis: true,
            title: '到款单位',
            align: 'center',
            dataIndex: 'paymentUnit',
            customRender:(text) => {
              const str = text ? getNameFromArr(this.paymentUnitOption,text,'value','label') : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          // {
          //   width: 200,
          //   ellipsis: true,
          //   title: '银行账号',
          //   align: 'center',
          //   dataIndex: 'incomeBank',
          //   customRender:(text) => {
          //     const str = text ? text : '-'
          //     return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          //   },
          // },
          {
            width: 120,
            ellipsis: true,
            title: '进账金额',
            align: 'center',
            dataIndex: 'incomeFee',
            customRender:(text) => {
              const str = text ? text.toLocaleString() : '0'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '进账时间',
            align: 'center',
            dataIndex: 'incomeDate',
            customRender:(text) => {
              const str = text ? text.substring(0, 10) : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
            ellipsis: true,
            title: '财务备注',
            align: 'center',
            dataIndex: 'remark',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            customRender:(text) => {
              const color = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].color : 'blue'
              const str = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].option : '-'
              return <a-tag color={color}>{str}</a-tag>
            },
          },
          {
            width: 120,
            ellipsis: true,
            title: '记账人',
            align: 'center',
            dataIndex: 'createUserName',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 170,
            ellipsis: true,
            title: '创建时间',
            align: 'center',
            dataIndex: 'createDate',
            customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
            },
          },
          {
            width: 220,
            ellipsis: true,
            title: '操作',
            key: 'operations',
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        isUpload:true,
        btnLoading:false,
        importFields:{
          '入账时间':'incomeDate',
          '来款单位':'incomeUnit',
          '到款单位':'paymentUnit',
          '入账金额':'incomeFee',
          '财务备注':'remark',
          '银行账号':'incomeBank',
          '账户类型':'accountType'
        },
        url: {
          list: 'salary/tincome/page',
          delete: 'salary/tincome/',
          ReleaseUrl: 'salary/tincome/release', // 发布
          queryAllInfoById: 'salary/tincome/', // 详情
          exportUrl:'salary/tincome/doExportIncome',
        },
        paymentUnitOption: []
      }
    },
    methods: {
      handleDownloadTemplate(templateUrl){
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`
        window.location.href = url
      },
      // 添加
      handleAdd: function() {
        this.$refs.accountEntryAddModal.title = '入账添加'
        this.$refs.accountEntryAddModal.paymentUnitOption = this.paymentUnitOption
        this.$refs.accountEntryAddModal.add()
      },
      beforeUpload() {
        return false
      },
      //上传
      handleChange(file) {
        if(this.isUpload) this.uploadFilesChange(file.file)
      },
      formatData(arr){
        return arr.map((item)=>{
          let obj = {}
          for(const key in item) {
            if(this.importFields[key] === 'incomeDate'){
              obj[this.importFields[key]] = `${item[key]} 00:00:00`
            }else{
              obj[this.importFields[key]] = item[key]
            }
          }
          return obj
        })
      },
      uploadFilesChange(file,timeOut){
        const _this = this
        // 通过FileReader对象读取文件
        const fileReader = new FileReader()
        fileReader.onload = event => {
          try {
            _this.btnLoading = true
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
            // 去除每个字段的前后空格以及最后的空格行
            const newData = handleImportData(data[sheetName])
            const formatNewData = this.formatData(newData)
            const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
            const requestTimeOut = timeOut ? timeOut : 600000  // 请求过期时间
            //开始异步提交
            httpActionHeader('/salary/tincome/uploadSds', JSON.stringify({data:formatNewData}), 'post', contextType, requestTimeOut).then((res) => {
              const msg = res.message || res.msg
              if (Number(res.code) === 200) {
                if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  _this.$refs.errorModal.title = `导入提示: ${msg}`
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.errorMessageList)
                  _this.loadData()
                } else {
                  _this.$message.success("导入成功！")
                  _this.loadData()
                }
              } else {
                if (res.data != null && res.data.length > 0) {
                  _this.$refs.errorModal.title = `导入提示: ${msg}`
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.data)
                } else if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  _this.$refs.errorModal.title = `导入提示: ${msg}`
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  _this.$message.error(msg)
                }
              }
            }).finally(()=>{
              _this.btnLoading = false
            })
          } catch (e) {
            _this.btnLoading = false
            console.log(e);
            // 这里可以抛出文件类型错误不正确的相关提示
            this.$message.error('文件上传错误！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file)
      },
      getEmpty(val){
        return val ? val : ''
      },
      handleExport(){
        // eslint-disable-next-line
        let param = _.cloneDeep(this.queryParam)
        delete param.dateTemp1
        delete param.dateTemp
        const qs = require('qs')
        let httpurl = `${this.url.exportUrl}?${qs.stringify(param)}`
        if(this.selectedRowKeys.length){
          httpurl += `&idStr=${this.selectedRowKeys.join(',')}`
        }
        httpAction(httpurl,null,'get').then(res=>{
          if(res.code === 200){
            if(res.data.length === 0){
              this.$message.warning('无数据')
              return false
            }
            const tableDatas = res.data.map(item=>{
              item['status'] = this.statusArr[item.status]
              item['paymentUnit'] = getNameFromArr(this.paymentUnitOption,item.paymentUnit,'value','label')
              item['incomeBank'] = this.getEmpty(item['incomeBank'])
              item['remark'] = this.getEmpty(item['remark'])
              return item
            })
            const excelDatas = [
              {
                tHeader: ["进账单位", "到款单位", "进账卡号","进账金额","进账时间","财务备注","状态","记账人","创建时间"],
                filterVal: ['incomeUnit','paymentUnit','incomeBank',"incomeFee", "incomeDate","remark", "status","createUserName","createDate"],
                tableDatas: tableDatas,
                sheetName: "入账"
              }
            ]
            this.json2excel(excelDatas, "入账", true, "xlsx",0)
            this.$message.success('导出成功')
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      json2excel(tableJson, filenames, autowidth, bookTypes,typeLength) {
        var that = this
        import('../../temergency/xlsx/ExportToExcel').then(excel => {
          var tHeader = []
          var dataArr = []
          var sheetnames = []
          for (var i in tableJson) {
            tHeader.push(tableJson[i].tHeader)
            dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
            sheetnames.push(tableJson[i].sheetName)
          }
          excel.export_json_to_excel_more_sheet({
            header: tHeader,
            data: dataArr,
            sheetname: sheetnames,
            filename: filenames,
            autoWidth: autowidth,
            bookType: bookTypes,
            autoLength: typeLength // 所有类型长度
          })
        });
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
      // 编辑
      handleEdit: function(record) {
        this.$refs.accountEntryAddModal.title = '入账编辑'
        this.$refs.accountEntryAddModal.addButton = false
        this.$refs.accountEntryAddModal.editButton = true
        this.$refs.accountEntryAddModal.paymentUnitOption = this.paymentUnitOption
        httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
          if (Number(res.code) === 200 && res.data) {
            this.$refs.accountEntryAddModal.edit(res.data)
          } else {
            this.$message.error('数据请求失败！')
          }
        })
      },
      // 详情
      handleDetail: function(record) {
        this.$refs.accountEntryAddModal.title = '入账详情'
        this.$refs.accountEntryAddModal.addButton = false
        this.$refs.accountEntryAddModal.editButton = false
        this.$refs.accountEntryAddModal.disabledStyle = true
        this.$refs.accountEntryAddModal.paymentUnitOption = this.paymentUnitOption
        httpAction(this.url.queryAllInfoById + record.id, '', 'GET').then((res) => {
          if (Number(res.code) === 200 && res.data) {
            this.$refs.accountEntryAddModal.edit(res.data)
          } else {
            this.$message.error('数据请求失败！')
          }
        })
      },
      // 发布
      handleRelease: function(record) {
        httpAction(`${this.url.ReleaseUrl}?id=${record.id}`, '', 'POST').then((res) => {
          if (Number(res.code) === 200) {
            this.$message.success('发布认领成功！')
            this.loadData()
            this.onClearSelected()
          } else {
            this.warning(res.msg || res.message)
          }
        })
      },
      // 起始时间选择
      handleTimeBeginChange(date) {
        // 时间格式化
        this.queryParam.createDateStart = date ? (date.format(this.dateFormat)) : null
      },
      // 截止时间选择
      handleTimeEndChange(date) {
        // 时间格式化
        this.queryParam.createDateEnd = date ? (date.format(this.dateFormat)) : null
      },
      // 替换入账金额,
      changeIncomFee1(e) {
        /* eslint-disable */
        const incomeFee = e.target.value.replace(/\,/g, '')
        this.queryParam.incomeFee1 = incomeFee
      },
      // 替换入账金额,
      changeIncomFee2(e) {
        /* eslint-disable */
        const incomeFee = e.target.value.replace(/\,/g, '')
        this.queryParam.incomeFee2 = incomeFee
      },
      // 数据字典
      initDictConfig() {
        initDictOptions('PAYMENT_UNIT_NAME').then(res => {
          if (res.code === 200) {
            this.paymentUnitOption = res.data
            let aa = res.data.map(item=>item.label)
            console.log(aa.join('\n'))
          }
        })
      },
      // 入账退回
      handleIncomeBack(record){
        this.$refs.entryReturnModal.record = record
        this.$refs.entryReturnModal.show()
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

.range-picker-new-style {
  :global(.ant-calendar-range-picker-input) {
    font-size: 13px;
  }
}

.stepFormText {
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
}
</style>
