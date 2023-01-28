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
      v-if="formTypeStatus==2"
    >
      <detail-list :col="3">
        <detail-list-item term="客户单位">{{ settleDomainSelected.unitName ? settleDomainSelected.unitName : '-' }}</detail-list-item>
        <detail-list-item term="结算主体">{{ settleDomainSelected.settleDomainName ? settleDomainSelected.settleDomainName : '-' }}</detail-list-item>
        <detail-list-item term="结算金额">{{ settleDomainSelected.settleDomainMoney ? settleDomainSelected.settleDomainMoney : 0 }}</detail-list-item>
        <detail-list-item term="结算月份">{{ settleDomainSelected.setlleMonth ? settleDomainSelected.setlleMonth : '-' }}</detail-list-item>
      </detail-list>
    </a-card>
    <a-card
      :bordered="true"
      title="结算单信息"
      v-if="formTypeStatus==3"
    >
      <detail-list :col="3">
        <detail-list-item term="客户单位">{{ settleDomainSelected.customerName ? settleDomainSelected.customerName : '-' }}</detail-list-item>
        <detail-list-item term="结算主体">{{ settleDomainSelected.departName ? settleDomainSelected.departName : '-' }}</detail-list-item>
        <detail-list-item term="结算金额（含税）">{{ settleDomainSelected.sumSettle ? settleDomainSelected.sumSettle : 0 }}</detail-list-item>
        <detail-list-item term="税金">{{ settleDomainSelected.taxAmount ? settleDomainSelected.taxAmount : 0 }}</detail-list-item>
        <detail-list-item term="业务收入">{{ settleDomainSelected.income ? settleDomainSelected.income : 0 }}</detail-list-item>
        <detail-list-item term="成本合计数据">{{ settleDomainSelected.costSum ? settleDomainSelected.costSum : 0 }}</detail-list-item>
        <detail-list-item term="结算时间">{{ settleDomainSelected.settleDate ? settleDomainSelected.settleDate : 0 }}</detail-list-item>
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
                </a-table>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <match-in-account-of-statement-submit-modal
      ref="matchInAccountOfStatementSubmitModal"
      @ok="formBackOk"
    ></match-in-account-of-statement-submit-modal>
  </a-modal>
</template>

<script>
  import { filterObj } from '@/utils/util'
  import { getAction, httpAction } from '@/api/manage'
  import DetailList from '@/components/tools/DetailList'
  import MatchInAccountOfStatementSubmitModal from './MatchInAccountOfStatementSubmitModal'
  const DetailListItem = DetailList.Item

  export default {
    name: 'MatchInAccountOfStatementTwoModal',
    components: {
      DetailList,
      DetailListItem,
      MatchInAccountOfStatementSubmitModal,
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
          const sqp = {}
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
            width: 130,
            ellipsis: true,
            title: '认领时间',
            align: 'center',
            dataIndex: 'reciveDate',
            customRender:(text) => {
              const Str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '认领金额',
            align: 'center',
            dataIndex: 'reciveFee',
            customRender:(text) => {
              const Str = text.toLocaleString()
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '可匹配金额',
            align: 'center',
            dataIndex: 'reciveFeeBalance',
            customRender:(text) => {
              const Str = text.toLocaleString()
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDomainId',
            customRender:(text) => {
              const Str = ((Object.keys(this.settleDomainOptions).length) && (this.settleDomainOptions).hasOwnProperty(text)) ? (this.settleDomainOptions)[text]['departName'] : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '款项用途',
            align: 'center',
            dataIndex: 'reciveUse',
            customRender:(text) => {
              const Str = this.reciveUseOptions.hasOwnProperty(text) ? this.reciveUseOptions[text] : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 130,
            ellipsis: true,
            title: '客服说明',
            align: 'center',
            dataIndex: 'serverRemark',
            customRender:(text) => {
              const Str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={Str}>{Str}</a-tooltip>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '认领状态',
            align: 'center',
            dataIndex: 'status',
            customRender:(text) => {
              const color = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].color : 'blue'
              const Str = this.statusOptions.hasOwnProperty(text) ? this.statusOptions[text].option : '-'
              return <a-tag color={color}>{Str}</a-tag>
            },
          },
          {
            width: 80,
            ellipsis: true,
            title: '收入状态',
            align: 'center',
            dataIndex: 'statusIncome',
            customRender:(text) => {
              const color = this.statusIncomeOptions.hasOwnProperty(text) ? this.statusIncomeOptions[text].color : 'blue'
              const Str = this.statusIncomeOptions.hasOwnProperty(text) ? this.statusIncomeOptions[text].option : '-'
              return <a-tag color={color}>{Str}</a-tag>
            },
          },
        ],
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        matchingLimit: 0,
        loadDataSource: [], // 已经加载的选项
        formTypeOptions: {},
        alreadyMatched: [], // 已匹配的列表
        alreadyMatchedIds: [], // 已匹配的ID
        settleDomainSelected: {}, // 选中的结算单信息
        statusOptions: {},
        formTypeStatus: 2,  // 纯收入
        statusOutOptions: {},
        statusIncomeOptions: {},
        settleDomainOptions: {},
        form: this.$form.createForm(this),
        url: {
          list: 'salary/treciverecord/pageOfMatching', // 认领记录【纯收入】
          oneTimeList: 'salary/treciverecord/getOneTimePageOfMatching', // 认领记录【事务性外包】
          getTreciverecordInfo: 'salary/treciverecord/getReciveRecordByIds',  // 认领记录详情
        },
      }
    },
    methods: {
      loadData(arg) {
        if (!this.url.list && !this.url.oneTimeList) {
          this.$message.error('请设置url.list属性！')
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (Number(arg) === 1) {
          this.ipagination.current = 1  // 重置第一页
        }
        let httpUrl = ''
        let params = this.getQueryParams() //查询条件
        params.reciveType = this.formTypeStatus // 认领类型【纯收入和事务性外包】
        params.settleDomainId = this.settleDomainSelected.settleDomainId // 结算主体
        if (Number(this.formTypeStatus) === 2) { // 纯收入
          httpUrl += this.url.list
          if (String(this.settleDomainSelected.matchingStatus) === '1') {  // 已匹配的时候（编辑）【纯收入】
            params.matchId = this.settleDomainSelected.id // 结算单ID
          }
        } else {  // 事务性外包
          httpUrl += this.url.oneTimeList
          if (String(this.settleDomainSelected.matchStatus) === '1') {  // 已匹配的时候（编辑）【事务性外包】
            let i = 1
            for (const item of this.alreadyMatched) {
              if (i === 1) {
                httpUrl += (`?idList=${item.recordId}`)
              } else {
                httpUrl += (`&idList=${item.recordId}`)
              }
              i++
            }
          }
        }
        this.loading = true // 加载图标
        getAction(httpUrl, params).then((res) => {
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
      add() {
        this.edit({})
      },
      edit(record) {
        console.log(this.settleDomainSelected)
        const that = this
        this.form.resetFields()
        this.model = Object.assign({}, record)
        // 处理选中的数据
        let ids = ''
        for (const alreadyMatche of this.alreadyMatched) {  // 已匹配的认领记录列表
          this.alreadyMatchedIds.push(alreadyMatche.recordId) // 已匹配的ID
          this.selectedRowKeys.push(alreadyMatche.recordId)
          // 处理选中的数据
          if (JSON.stringify(this.loadDataSource).indexOf(JSON.stringify(alreadyMatche.recordId)) === -1) {
            ids += `${alreadyMatche.recordId},`
          }
        }
        if (ids != '') {
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
      saveData(){
        let reciveFeeBalanceClaimSum = 0
        let isOk = 1
        let requestMatchingClaimeList = []
        let returnData = {}
        let errMsg = ''
        const settleDomainMoney = (Number(this.formTypeStatus) === 2 ? this.settleDomainSelected.settleDomainMoney : this.settleDomainSelected.sumSettle)
        if (this.alreadyMatched.length === 0) { // 新增
          returnData = this.formIsAdd()
          reciveFeeBalanceClaimSum = this.formatFloat(returnData.reciveFeeBalanceClaimSum)
          requestMatchingClaimeList = returnData.requestMatchingClaimeList
          const mustMoney = settleDomainMoney - this.formatFloat(this.matchingLimit)
          if (reciveFeeBalanceClaimSum < this.formatFloat(mustMoney)) {
            isOk = 0
            errMsg += '选择的款项认领可匹配金额总和过小！'
          }
        } else {  // 编辑
          returnData = this.formIsEdit()
          reciveFeeBalanceClaimSum = this.formatFloat(returnData.reciveFeeBalanceClaimSum)
          requestMatchingClaimeList = returnData.requestMatchingClaimeList
          const mustMoney = settleDomainMoney - this.formatFloat(this.matchingLimit)
          if (reciveFeeBalanceClaimSum < this.formatFloat(mustMoney)) {
            isOk = 0
            errMsg += '选择的款项认领可匹配金额总和过小！'
          }
        }
        if (isOk === 1) {  // 验证通过
          let requestData = {}
          requestData.matchingMoney = settleDomainMoney
          requestData.matchingClaimeList = requestMatchingClaimeList
          this.$refs.matchInAccountOfStatementSubmitModal.title = '确认提交'
          this.$refs.matchInAccountOfStatementSubmitModal.requestData = requestData
          this.$refs.matchInAccountOfStatementSubmitModal.formTypeStatus = this.formTypeStatus
          this.$refs.matchInAccountOfStatementSubmitModal.settleDomainSelected = this.settleDomainSelected
          this.$refs.matchInAccountOfStatementSubmitModal.add()
        } else {
          this.$message.warning(errMsg)
        }
        this.confirmLoading = false
      },
      // 保存按钮
      handleOk() {
        
        if(this.selectedRowKeys.length === 0){ // 未选择
          const _this = this
          if(this.alreadyMatched.length){ // 撤销已匹配的
            this.$confirm({
              title: '未选择认领记录，确定取消所有已关联的“认领记录”？',
              onOk() {
                _this.confirmLoading = true
                const idArr = _this.alreadyMatched.map(item=>item.recordId)
                httpAction(`/hrOneTime/tsettlebill/updateClaimIdById?claimIds=${idArr.join(',')}&ids=${_this.settleDomainSelected.id}&removeFlag=1&type=2`,null,'put').then(res=>{
                  if(res.code === 200){
                    _this.$message.success('撤销成功!')
                    _this.handleCancel()
                  }else{
                    _this.$message.warning(res.msg)
                  }
                }).finally(()=>{
                  _this.confirmLoading = false
                })
              },
              onCancel(){
                _this.confirmLoading = false
              }
            })
          }else{
            this.$message.warning('请选择一条认领记录！')
            this.confirmLoading = false
          }
        }else{
          this.saveData()
        }

        // if (this.selectedRowKeys.length === 0 && this.alreadyMatched.length === 0) {
        //   this.$message.warning('请选择一条认领记录！')
        // } else {
        //   let reciveFeeBalanceClaimSum = 0
        //   let isOk = 1
        //   let requestMatchingClaimeList = []
        //   let returnData = {}
        //   let errMsg = ''
        //   const settleDomainMoney = (Number(this.formTypeStatus) === 2 ? this.settleDomainSelected.settleDomainMoney : this.settleDomainSelected.sumSettle)
        //   if (this.alreadyMatched.length === 0) { // 新增
        //     returnData = this.formIsAdd()
        //     reciveFeeBalanceClaimSum = this.formatFloat(returnData.reciveFeeBalanceClaimSum)
        //     requestMatchingClaimeList = returnData.requestMatchingClaimeList
        //     const mustMoney = settleDomainMoney - this.formatFloat(this.matchingLimit)
        //     if (reciveFeeBalanceClaimSum < this.formatFloat(mustMoney)) {
        //       isOk = 0
        //       errMsg += '选择的款项认领可匹配金额总和过小！'
        //     }
        //   } else {  // 编辑
        //     returnData = this.formIsEdit()
        //     reciveFeeBalanceClaimSum = this.formatFloat(returnData.reciveFeeBalanceClaimSum)
        //     requestMatchingClaimeList = returnData.requestMatchingClaimeList
        //     const mustMoney = settleDomainMoney - this.formatFloat(this.matchingLimit)
        //     if (reciveFeeBalanceClaimSum < this.formatFloat(mustMoney)) {
        //       isOk = 0
        //       errMsg += '选择的款项认领可匹配金额总和过小！'
        //     }
        //   }
        //   if (isOk === 1) {  // 验证通过
        //     let requestData = {}
        //     requestData.matchingMoney = settleDomainMoney
        //     requestData.matchingClaimeList = requestMatchingClaimeList
        //     this.$refs.matchInAccountOfStatementSubmitModal.title = '确认提交'
        //     this.$refs.matchInAccountOfStatementSubmitModal.requestData = requestData
        //     this.$refs.matchInAccountOfStatementSubmitModal.formTypeStatus = this.formTypeStatus
        //     this.$refs.matchInAccountOfStatementSubmitModal.settleDomainSelected = this.settleDomainSelected
        //     this.$refs.matchInAccountOfStatementSubmitModal.add()
        //   } else {
        //     this.$message.warning(errMsg)
        //   }
        // }
        
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
        this.dataSource = []
        this.selectedRowKeys = []
        this.selectionRows = []
        this.loadDataSource = [] // 已经加载的选项
        this.alreadyMatchedIds = [] // 已匹配的ID
        this.formTypeStatus = 2  // 纯收入
      },
      // 新增
      formIsAdd () {
        let reciveFeeBalanceClaimSum = 0 // 认领可匹配金额
        let requestMatchingClaimeList = []
        for (const selectedRowKey of this.selectedRowKeys) {  // 循环取出选中的
          for (const data of this.loadDataSource) {
            if (String(selectedRowKey) === String(data.id)) {
              reciveFeeBalanceClaimSum += data.reciveFeeBalance // 累加认领可匹配金额
              requestMatchingClaimeList.push({
                matchId: this.settleDomainSelected.id,
                type: Number(this.formTypeStatus) === 2 ? 5 : 6,
                recordId: selectedRowKey,
                matchingAmount: 0,
                flag: 0,
              })
              break
            }
          }
        }
        return {reciveFeeBalanceClaimSum: reciveFeeBalanceClaimSum, requestMatchingClaimeList: requestMatchingClaimeList}
      },
      // 编辑
      formIsEdit () {
        let reciveFeeBalanceClaimSum = 0 //认领可匹配金额
        let requestMatchingClaimeList = []
        // flag 是否新增 0：新增，1：减少， 2：不变
        for (const selectedRowKey of this.selectedRowKeys) {  // 循环取出选中的id
          let isFind = 0
          for (const alreadyMatche of this.alreadyMatched) {
            if (String(selectedRowKey) === String(alreadyMatche.recordId)) { // 已找到（不增不减）
              reciveFeeBalanceClaimSum += alreadyMatche.matchingAmount // 累加认领可匹配金额
              for (const data of this.loadDataSource) {
                // 还要查找认领记录里面的可用金额
                if (String(selectedRowKey) === String(data.id)) {
                  reciveFeeBalanceClaimSum += data.reciveFeeBalance // 累加认领可匹配金额
                  break
                }
              }
              requestMatchingClaimeList.push({
                matchId: this.settleDomainSelected.id,
                type: Number(this.formTypeStatus) === 2 ? 5 : 6,
                recordId: selectedRowKey,
                matchingAmount: alreadyMatche.matchingAmount,
                flag: 2,
              })
              isFind = 2
              break
            }
          }
          if (isFind === 0) {  // 未找到（增加）
            for (const data of this.loadDataSource) {
              if (String(selectedRowKey) === String(data.id)) {
                reciveFeeBalanceClaimSum += data.reciveFeeBalance // 累加认领可匹配金额
                requestMatchingClaimeList.push({
                  matchId: this.settleDomainSelected.id,
                  type: Number(this.formTypeStatus) === 2 ? 5 : 6,
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
          if (JSON.stringify(this.selectedRowKeys).indexOf(JSON.stringify(alreadyMatchedId)) == -1) { // 说明删除的
            for (const alreadyMatche of this.alreadyMatched) {
              if (String(alreadyMatche.recordId) === String(alreadyMatchedId)) { // 删除
                requestMatchingClaimeList.push({
                  matchId: this.settleDomainSelected.id,
                  type: Number(this.formTypeStatus) === 2 ? 5 : 6,
                  recordId: alreadyMatchedId,
                  matchingAmount: alreadyMatche.matchingAmount,
                  flag: 1,
                })
                break
              }
            }
          }
        }
        return {reciveFeeBalanceClaimSum: reciveFeeBalanceClaimSum, requestMatchingClaimeList: requestMatchingClaimeList}
      },
      // 新建弹框关闭
      formBackOk() {
        this.$emit('ok')
        this.close()
      },
      // 精度处理
      formatFloat(f, digit = 2) {
        const m = Math.pow(10, digit)
        return Math.round(f * m) / m
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
