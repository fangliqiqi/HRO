<template>
  <a-modal
    :title="title"
    :width="1200"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >提交</a-button>
    </template>
    <a-card
      :bordered="true"
      title="结算单信息"
    >
      <detail-list :col="3">
        <detail-list-item term="客户单位">{{ settleDomainSelected.unitName ? settleDomainSelected.unitName : '-' }}</detail-list-item>
        <detail-list-item term="结算金额">{{ settleDomainSelected.settleDomainMoney ? settleDomainSelected.settleDomainMoney : 0 }}</detail-list-item>
        <detail-list-item term="结算月份">{{ settleDomainSelected.setlleMonth ? settleDomainSelected.setlleMonth : '-' }}</detail-list-item>
        <detail-list-item term="表单类型">{{ formTypeStr ? formTypeStr : '-' }}</detail-list-item>
      </detail-list>
    </a-card>
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
        style="padding:0px;"
      >
        <a-row>
          <a-col :span="24">
            <div>
              <div class="steps-content">
                <!--列表-->
                <a-table
                  rowKey="id"
                  size="middle"
                  :bordered="true"
                  :loading="loading"
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="ipagination"
                  :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                  @change="handleTableChange"
                >
                  <!-- 列缩放隐藏模板 -->
                  <template
                    v-for="(defineColumn, key) in defineColumns"
                    :slot="key"
                    slot-scope="text, record"
                  >
                    <span
                      :key="key"
                      :style="handleColumnStyle(defineColumn.width)"
                    >
                      <!-- 结算主体或者单位 -->
                      <a-tooltip
                        v-if="defineColumn.type=='settle'"
                        placement="topLeft"
                        :title="((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[defineColumn.key])) ? (defineColumn.options)[record[defineColumn.key]][defineColumn.name] : '-'"
                      >
                        {{ ((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[defineColumn.key])) ? (defineColumn.options)[record[defineColumn.key]][defineColumn.name] : '-' }}
                      </a-tooltip>
                      <!-- 标签数据 -->
                      <template
                        v-else-if="defineColumn.type=='tag'"
                        v-for="(item, tagKey) in defineColumn.options"
                      >
                        <a-tag
                          :key="tagKey"
                          v-if="record[key] == tagKey"
                          :color="item.color"
                        >{{ item.option }}</a-tag>
                      </template>
                      <!-- 取出定义数据数据 -->
                      <template
                        v-else-if="defineColumn.type=='define'"
                        v-for="(item, defineKey) in defineColumn.options"
                      >
                        <span
                          :key="defineKey"
                          v-if="record[key] == defineKey"
                        >
                          <a-tooltip :title="item">
                            {{ item }}
                          </a-tooltip>
                        </span>
                      </template>
                      <!-- 普通数据 -->
                      <a-tooltip
                        v-else
                        placement="topLeft"
                        :title="record[key] ? record[key] : '-'"
                      >
                        {{ record[key] ? record[key] : '-' }}
                      </a-tooltip>
                    </span>
                  </template>
                  <!-- 款项用途 -->
                  <span
                    slot="reciveFee"
                    :style="handleColumnStyle(80)"
                    slot-scope="text"
                  >
                    <a-tooltip
                      placement="topLeft"
                      :title="text"
                    >
                      {{ text }}
                    </a-tooltip>
                  </span>
                  <!-- 认领金额 -->
                  <span
                    slot="reciveFee"
                    :style="handleColumnStyle(80)"
                    slot-scope="text"
                  >
                    <a-tooltip
                      placement="topLeft"
                      :title="text.toLocaleString()"
                    >
                      {{ text.toLocaleString() }}
                    </a-tooltip>
                  </span>

                  <!-- 可匹配金额 -->
                  <span
                    slot="reciveFeeBalance"
                    :style="handleColumnStyle(80)"
                    slot-scope="text"
                  >
                    <a-tooltip
                      placement="topLeft"
                      :title="text.toLocaleString()"
                    >
                      {{ text.toLocaleString() }}
                    </a-tooltip>
                  </span>
                </a-table>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <match-out-account-submit-modal
      ref="matchOutAccountSubmitModal"
      @ok="formBackOk"
    ></match-out-account-submit-modal>
  </a-modal>
</template>

<script>
  import { filterObj } from '@/utils/util'
  import { getAction, httpAction } from '@/api/manage'
  import DetailList from '@/components/tools/DetailList'
  import MatchOutAccountSubmitModal from './MatchOutAccountSubmitModal'
  const DetailListItem = DetailList.Item

  export default {
    name: 'MatchOutAccountTwoModal',
    components: {
      DetailList,
      DetailListItem,
      MatchOutAccountSubmitModal,
    },
    data() {
      return {
        /* 查询条件 */
        queryParam: {},
        /* 数据源 */
        dataSource: [],
        /* 分页参数 */
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return `${range[0]}-${range[1]} 共${total}条`
          },
          onChange: (page, pageSize) => {
            this.ipagination.current = page
            this.ipagination.pageSize = pageSize
          },
          showQuickJumper: false,
          showSizeChanger: true,
          total: 0
        },
        loading: false,
        /* table选中keys*/
        selectedRowKeys: [],
        /* table选中records*/
        selectionRows: [],
        /* 高级查询条件生效状态 */
        superQueryFlag: false,
        /* 高级查询条件 */
        superQueryParams: '',
        getQueryParams() {
          //获取查询条件
          let sqp = {}
          if (this.superQueryParams) {
            sqp['superQueryParams'] = encodeURI(this.superQueryParams)
          }
          var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
          param.current = this.ipagination.current
          param.size = this.ipagination.pageSize
          return filterObj(param)
        },
        reciveUseOptions: {'0': '款项认领', '1': '垫付还款'},
        columns: [
          {
            title: '认领时间',
            align: 'center',
            dataIndex: 'reciveDate',
            scopedSlots: { customRender: 'reciveDate' },
          },
          {
            title: '认领金额',
            align: 'center',
            dataIndex: 'reciveFee',
            scopedSlots: { customRender: 'reciveFee' },
          },
          {
            title: '可匹配金额',
            align: 'center',
            dataIndex: 'reciveFeeBalance',
            scopedSlots: { customRender: 'reciveFeeBalance' },
          },
          // {
          //   title: '结算主体',
          //   align: 'center',
          //   dataIndex: 'settleDomainId',
          //   scopedSlots: { customRender: 'settleDomainId' },
          // },
          {
            title: '款项用途',
            align: 'center',
            dataIndex: 'reciveUse',
            scopedSlots: { customRender: 'reciveUse' },
          },
          {
            title: '客服说明',
            align: 'center',
            dataIndex: 'serverRemark',
            scopedSlots: { customRender: 'serverRemark' },
          },
          {
            title: '认领状态',
            align: 'center',
            dataIndex: 'status',
            // scopedSlots: { customRender: 'status' },
            customRender:(text) => {
              const color = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].color : 'blue'
              const str = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].option : '-'
              return (str === '-') ? '-' : (<a-tag color={color}>{str}</a-tag>)
            },
          },
          {
            title: '出账状态',
            align: 'center',
            dataIndex: 'statusOut',
            // scopedSlots: { customRender: 'statusOut' },
            customRender:(text,record) => {
              if(String(record.reciveUse)==='0' && (String(record.reciveType)==='1' || String(record.reciveType)==='4')){
                return (
                  <a-tag color={this.statusOutOptions[text].color}>{ this.statusOutOptions[text].option }</a-tag>
                )
              }else{
                return '-'
              }
            },
          },
          // {
          //   title: '收入状态',
          //   align: 'center',
          //   dataIndex: 'statusIncome',
          //   scopedSlots: { customRender: 'statusIncome' },
          // },
        ],
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        matchingLimit: 0,
        formTypeStr: '',
        loadDataSource: [], // 已经加载的选项
        formTypeOptions: {},
        alreadyMatched: [], // 已匹配的列表
        alreadyMatchedIds: [], // 已匹配的ID
        settleDomainSelected: {}, // 选中的结算单信息
        statusOptions: {},
        statusOutOptions: {},
        statusIncomeOptions: {},
        settleDomainOptions: {},
        form: this.$form.createForm(this),
        defineColumns: {reciveDate: {width: 130}, reciveUse: {width: 80, type: 'define', options: []}, settleDomainId: {key: 'settleDomainId', width: 140, type: 'settle', options: [], name: 'departName'}, status: {width: 80, type: 'tag', options: []}, statusOut: {width: 80, type: 'tag', options: []}, statusIncome: {width: 80, type: 'tag', options: []}, serverRemark: {width: 130}},  // 隐藏列字段数组
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        url: {
          add: 'salary/tmatchingclaime/saveSingle',
          list: 'salary/treciverecord/pageOfMatching?reciveType=1', // 列表【薪资与其他类型】
          getTreciverecordInfo: 'salary/treciverecord/getReciveRecordByIds',  // 认领记录详情
        },
        type:0,  // 1 预估结算单
      }
    },
    methods: {
      loadData(arg) {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性！')
          return false
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (Number(arg) === 1) {
          this.ipagination.current = 1  // 重置第一页
        }
        var params = this.getQueryParams() //查询条件
        if(Number(this.type) === 1){
          params.unitId = this.settleDomainSelected.unitId // 结算主体
        }else{
          params.settleDomainId = this.settleDomainSelected.settleDomainId // 结算主体
        }
        if (String(this.settleDomainSelected.matchingStatus) === '1') {  // 已匹配的时候（编辑）
          params.matchId = this.settleDomainSelected.id // 结算单ID
        }
        this.loading = true // 加载图标
        getAction(this.url.list, params).then((res) => {
          if (Number(res.code) === 200) {
            this.dataSource = res.data.records
            // 处理加载的数据
            for (const record of this.dataSource) {
              if (JSON.stringify(this.loadDataSource).indexOf(JSON.stringify(record.id)) === -1) {
                this.loadDataSource.push(record) // 进行动态的操作
              }
            }
          } else {
            this.$message.error('获取数据失败！')
          }
          this.ipagination.total = res.data.total
          this.loading = false
        })
      },

      // 条件查询
      searchQuery() {
        this.loadData(1)
      },

      // 条件重置
      searchReset() {
        this.queryParam = {}
        this.loadData(1)
      },

      // 点击按钮选中
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectionRows = selectionRows
      },

      //分页、排序、筛选变化时触发
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field
          this.isorter.order = ('ascend' === String(sorter.order)) ? 'asc' : 'desc'
        }
        this.ipagination = pagination
        this.loadData()
      },

      add(type) {
        this.type = (Number(type) === 1) ? 1 : 0
        this.edit({})
      },

      edit(record) {
        const that = this
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.formTypeStr = this.formTypeOptions[this.settleDomainSelected.formType]
        // 赋值标签数据
        this.defineColumns.status.options = this.statusOptions
        this.defineColumns.statusOut.options = this.statusOutOptions
        this.defineColumns.statusIncome.options = this.statusIncomeOptions
        this.defineColumns.settleDomainId.options = this.settleDomainOptions
        this.defineColumns.reciveUse.options = this.reciveUseOptions
        // 处理选中的数据
        let ids = ''
        for (const alreadyMatche of this.alreadyMatched) {
          this.alreadyMatchedIds.push(alreadyMatche.recordId) // 已匹配的ID
          this.selectedRowKeys.push(alreadyMatche.recordId)
          // 处理选中的数据
          if (JSON.stringify(this.loadDataSource).indexOf(JSON.stringify(alreadyMatche.recordId)) === -1) {
            ids += `${alreadyMatche.recordId},`
          }
        }
        if (String(ids) !== '') {
          httpAction(`${this.url.getTreciverecordInfo}?ids=${ids}`, null, 'GET').then((res) => {
            if (Number(res.code) === 200) {
              for (const data of res.data) {
                if (JSON.stringify(this.loadDataSource).indexOf(JSON.stringify(data.id)) === -1) {
                  this.loadDataSource.push(data) // 进行动态的操作
                }
              }
            } else {
              that.$message.warning(res.msg || res.message)
            }
          })
        }
        this.visible = true
      },

      // 保存按钮
      handleOk() {
        let httpurl = ''
        httpurl += this.url.add
        this.confirmLoading = true
        this.settleDomainSelected.advanceMoney = this.settleDomainSelected.advanceMoney ? this.settleDomainSelected.advanceMoney : 0
        if (this.selectedRowKeys.length === 0 && this.alreadyMatched.length === 0) {
          this.$message.warning('请选择一条认领记录！')
        } else {
          //let reciveFeeBalanceSum = 0
          //let reciveFeeBalancePaySum = 0
          let reciveFeeBalanceClaimSum = 0
          let isOk = 1
          let requestMatchingClaimeList = []
          let returnData = {}
          let errMsg = ''
          // console.log(this.alreadyMatched)
          // return
          if (this.alreadyMatched.length === 0) { // 新增
            returnData = this.formIsAdd()
            //reciveFeeBalancePaySum = returnData.reciveFeeBalancePaySum
            reciveFeeBalanceClaimSum = returnData.reciveFeeBalanceClaimSum
            requestMatchingClaimeList = returnData.requestMatchingClaimeList
            // if(reciveFeeBalancePaySum < this.settleDomainSelected.advanceMoney){
            //   isOk = 0
            //   errMsg += '选择的垫付还款可匹配金额总和过小！ '
            // }
            let mustMoney = this.settleDomainSelected.settleDomainMoney - parseFloat(this.matchingLimit).toFixed(2) - this.settleDomainSelected.advanceMoney
            if(reciveFeeBalanceClaimSum < mustMoney.toFixed(2)){
              isOk = 0
              errMsg += ' 选择的款项认领可匹配金额总和过小！'
            }
          } else {  // 编辑
            returnData = this.formIsEdit()
            //reciveFeeBalancePaySum = returnData.reciveFeeBalancePaySum
            reciveFeeBalanceClaimSum = returnData.reciveFeeBalanceClaimSum
            requestMatchingClaimeList = returnData.requestMatchingClaimeList
            // if((reciveFeeBalancePaySum - returnData.alreadyPaySum) < (this.settleDomainSelected.advanceMoney - returnData.alreadyPaySum)){
            //   isOk = 0
            //   errMsg += '选择的垫付还款可匹配金额总和过小！ '
            // }
            let mustMoney = this.settleDomainSelected.settleDomainMoney - parseFloat(this.matchingLimit).toFixed(2) - this.settleDomainSelected.advanceMoney - returnData.alreadyClaimSum
            if((reciveFeeBalanceClaimSum - returnData.alreadyClaimSum) < mustMoney.toFixed(2)){
              isOk = 0
              errMsg += ' 选择的款项认领可匹配金额总和过小！'
            }
          }
          if(String(isOk) === '0'){
            this.$message.warning(errMsg)
          }
          // if ((this.settleDomainSelected.settleDomainMoney - this.matchingLimit) > reciveFeeBalanceSum) {
          //   this.$message.warning('选择的可匹配金额总和过小！')
          // } else {  // 金额通过
          if(String(isOk) === '1'){
            let requestData = {}
            requestData.matchingMoney = parseFloat(this.settleDomainSelected.settleDomainMoney).toFixed(2)  - parseFloat(this.settleDomainSelected.advanceMoney).toFixed(2) 
            requestData.advanceMoney = this.settleDomainSelected.advanceMoney
            requestData.matchingClaimeList = JSON.stringify(requestMatchingClaimeList)
            this.$refs.matchOutAccountSubmitModal.title = '确认提交'
            this.$refs.matchOutAccountSubmitModal.httpurl = httpurl
            this.$refs.matchOutAccountSubmitModal.requestData = requestData
            this.$refs.matchOutAccountSubmitModal.formTypeOptions = this.formTypeOptions
            this.$refs.matchOutAccountSubmitModal.settleDomainSelected = this.settleDomainSelected
            this.$refs.matchOutAccountSubmitModal.add()
            // httpAction(httpurl, requestData, method).then((res) => {
            //   if (res.code === 200) {
            //     that.$message.success(`${that.title}成功！`)
            //     that.$emit('ok')
            //     that.close()
            //   } else {
            //     that.$message.warning(res.msg || res.message)
            //   }
            // }).finally(() => {
            //   that.confirmLoading = false
            // })
          }
        }
        this.confirmLoading = false
      },

      // 关闭功能
      handleCancel() {
        this.close()
      },

      // 表单关闭与数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.alreadyMatched = [] // 已匹配的列表
        this.settleDomainSelected = {} // 选中的结算单信息
        this.statusOptions = {}
        this.statusOutOptions = {}
        this.statusIncomeOptions = {}
        this.settleDomainOptions = {}
        this.matchingLimit = 0
        this.formTypeStr = ''
        this.dataSource = []
        this.selectedRowKeys = []
        this.selectionRows = []
        this.loadDataSource = [] // 已经加载的选项
        this.alreadyMatchedIds = [] // 已匹配的ID
        this.url.list = 'salary/treciverecord/pageOfMatching?reciveType=1'
      },

      // 新增
      formIsAdd () {
        let reciveFeeBalancePaySum = 0 //垫付可匹配金额
        let reciveFeeBalanceClaimSum = 0 //认领可匹配金额
        let requestMatchingClaimeList = []
        for (const selectedRowKey of this.selectedRowKeys) {  // 循环取出选中的
          for (const data of this.loadDataSource) {
            if (String(selectedRowKey) === String(data.id)) {
              if(String(data.reciveUse) === '1'){
                reciveFeeBalancePaySum += data.reciveFeeBalance  // 累加垫付可匹配金额
              }
              if(String(data.reciveUse) === '0'){
                reciveFeeBalanceClaimSum += data.reciveFeeBalance // 累加认领可匹配金额
              }
              requestMatchingClaimeList.push({
                matchId: this.settleDomainSelected.id,
                type: this.settleDomainSelected.formType,
                recordId: selectedRowKey,
                matchingAmount: 0,
                flag: 0,
              })
              break
            }
          }
        }
        return {reciveFeeBalancePaySum: reciveFeeBalancePaySum, reciveFeeBalanceClaimSum: reciveFeeBalanceClaimSum, requestMatchingClaimeList: requestMatchingClaimeList}
      },

      // 编辑
      formIsEdit () {
        //let reciveFeeBalanceSum = 0
        let reciveFeeBalancePaySum = 0 //垫付可匹配金额
        let reciveFeeBalanceClaimSum = 0 //认领可匹配金额
        const alreadyPaySum = 0
        const alreadyClaimSum = 0
        let requestMatchingClaimeList = []
        // flag 是否新增 0：新增，1：减少， 2：不变
        for (const selectedRowKey of this.selectedRowKeys) {
          // 循环取出选中的id
          let isFind = 0
          for (const alreadyMatche of this.alreadyMatched) {
            if (String(selectedRowKey) === String(alreadyMatche.recordId)) {
              // 已找到（不增不减）
              // reciveFeeBalanceSum += alreadyMatche.matchingAmount  // 累加金额
              if(String(alreadyMatche.reciveUse) === '1'){
                reciveFeeBalancePaySum += alreadyMatche.matchingAmount// 累加垫付可匹配金额
              }
              if(String(alreadyMatche.reciveUse) === '0'){
                reciveFeeBalanceClaimSum += alreadyMatche.matchingAmount // 累加认领可匹配金额
              }
              // 还要查找认领记录里面的可用金额
              for (const data of this.loadDataSource) {
                if (String(selectedRowKey) === String(data.id)) {
                  // reciveFeeBalanceSum += data.reciveFeeBalance  // 累加金额
                  if(String(data.reciveUse) === '1'){
                    reciveFeeBalancePaySum += data.reciveFeeBalance  // 累加垫付可匹配金额
                  }
                  if(String(data.reciveUse) === '0'){
                    reciveFeeBalanceClaimSum += data.reciveFeeBalance // 累加认领可匹配金额
                  }
                  break
                }
              }
              requestMatchingClaimeList.push({
                matchId: this.settleDomainSelected.id,
                type: this.settleDomainSelected.formType,
                recordId: selectedRowKey,
                matchingAmount: alreadyMatche.matchingAmount,
                flag: 2,
              })
              isFind = 2
              break
            }
          }
          if (Number(isFind) === 0) {  // 未找到（增加）
            for (const data of this.loadDataSource) {
              if (String(selectedRowKey) === String(data.id)) {
                // reciveFeeBalanceSum += data.reciveFeeBalance  // 累加金额
                if(String(data.reciveUse) === '1'){
                  reciveFeeBalancePaySum += data.reciveFeeBalance  // 累加垫付可匹配金额
                }
                if(String(data.reciveUse) === '0'){
                  reciveFeeBalanceClaimSum += data.reciveFeeBalance // 累加认领可匹配金额
                }
                requestMatchingClaimeList.push({
                  matchId: this.settleDomainSelected.id,
                  type: this.settleDomainSelected.formType,
                  recordId: selectedRowKey,
                  matchingAmount: 0,
                  flag: 0,
                })
                break
              }
            }
          }
        }
        // 之前与选中对比（找出删除的）
        for (const alreadyMatchedId of this.alreadyMatchedIds) {
          if (JSON.stringify(this.selectedRowKeys).indexOf(JSON.stringify(alreadyMatchedId)) === -1) { // 说明删除的
            for (const alreadyMatche of this.alreadyMatched) {
              if (String(alreadyMatche.recordId) === String(alreadyMatchedId)) { // 删除
                requestMatchingClaimeList.push({
                  matchId: this.settleDomainSelected.id,
                  type: this.settleDomainSelected.formType,
                  recordId: alreadyMatchedId,
                  matchingAmount: alreadyMatche.matchingAmount,
                  flag: 1,
                })
                break
              }
            }
          }
        }
        return {reciveFeeBalancePaySum: reciveFeeBalancePaySum, reciveFeeBalanceClaimSum: reciveFeeBalanceClaimSum, requestMatchingClaimeList: requestMatchingClaimeList, alreadyPaySum:alreadyPaySum, alreadyClaimSum:alreadyClaimSum}
      },
      
      // 新建弹框关闭
      formBackOk() {
        this.$emit('ok')
        this.close()
      },
      
      // 隐藏列样式
      handleColumnStyle(width) {
        if (width) {
          return `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: ${width}px;`
        }
        return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
      },
      /******************************************* 验证规则 *******************************************/
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
  margin-bottom: 0px;
}
.ant-disabled-form {
  :global(.ant-input-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-select-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-checkbox-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-radio-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}
</style>
