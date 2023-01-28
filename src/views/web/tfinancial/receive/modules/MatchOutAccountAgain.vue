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
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
      <a-button
        v-if="addButton"
        key="handleOk"
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >确定关联</a-button>
    </template>

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
                <!-- 查询区域 -->
                <div class="table-page-search-wrapper">
                  <a-form layout="inline">
                    <a-row :gutter="24">
                      <!-- <a-col
                        :md="6"
                        :sm="8"
                      >
                        <a-form-item
                          label="结算主体"
                          class="stepFormText"
                        >
                          <a-select
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            placeholder="请选择结算主体查询"
                            v-model="queryParam.settleDomainName"
                            :dropdownMatchSelectWidth="false"
                          >
                            <a-select-option
                              v-for="(value, key) in settleDomainItems"
                              :key="key"
                              :value="value.departName"
                            >{{ value.departName }}</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col> -->
                      <a-col
                        :md="6"
                        :sm="8"
                        v-if="model.reciveType != 4"
                      >
                        <a-form-item
                          label="结算类型"
                          class="stepFormText"
                        >
                          <a-select
                            showSearch
                            optionFilterProp="children"
                            v-model="queryParam.formType"
                            placeholder="请选择结算类型"
                            :dropdownMatchSelectWidth="false"
                          >
                            <a-select-option
                              v-for="(value, key) in formTypeOptions"
                              :key="key"
                              :value="key"
                            >{{ value }}</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col
                        :md="6"
                        :sm="8"
                      >
                        <a-form-item label="结算月份">
                          <a-month-picker
                            allowClear
                            format="YYYYMM"
                            style="width: 100%"
                            placeholder="请选择结算月份"
                            v-model="queryParam.setlleMonth"
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
                <!--列表-->
                <a-table
                  rowKey="id"
                  size="middle"
                  :bordered="true"
                  :loading="loading"
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="ipagination"
                  :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, getCheckboxProps: getCheckboxProps}"
                >
                  <span
                    slot="action"
                    slot-scope="text, record"
                  >
                    <a-popconfirm
                      v-if="record.matchingStatus!=0&&record.formType!=7"
                      title="确定撤销吗?"
                      @confirm="() => handleRelease(record)"
                    >
                      <a>撤销</a>
                    </a-popconfirm>
                    <a v-else-if="record.matchingStatus!=0&&record.formType==7" @click="handleReleasebills(record)">撤销</a>
                    <span v-else>-</span>
                  </span>
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

                  <!-- 开票金额 -->
                  <span
                    slot="ticketMoney"
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

                  <!-- 结算金额 -->
                  <span
                    slot="settleDomainMoney"
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
  </a-modal>
</template>

<script>
  import { filterObj } from '@/utils/util'
  import { getAction, httpAction } from '@/api/manage'

  export default {
    name: 'MatchOutAccountAgain',
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
          onChange: (page, pageSize) => {
            this.ipagination.current = page
            this.ipagination.pageSize = pageSize
          },
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
        columns: [
          {
            align: 'center',
            title: '客户单位',
            dataIndex: 'unitName',
            scopedSlots: { customRender: 'unitName' },
          },
          {
            align: 'center',
            title: '结算主体',
            dataIndex: 'settleDomainName',
            scopedSlots: { customRender: 'settleDomainName' },
          },
          // {
          //   align: 'center',
          //   title: '开票金额',
          //   dataIndex: 'ticketMoney',
          //   scopedSlots: { customRender: 'ticketMoney' },
          // },
          {
            align: 'center',
            title: '结算金额',
            dataIndex: 'settleDomainMoney',
            scopedSlots: { customRender: 'settleDomainMoney' },
          },
          {
            align: 'center',
            title: '结算月份',
            dataIndex: 'setlleMonth',
            scopedSlots: { customRender: 'setlleMonth' },
          },
          {
            align: 'center',
            title: '表单类型',
            dataIndex: 'formType',
            scopedSlots: { customRender: 'formType' },
          },
          {
            align: 'center',
            title: '匹配状态',
            dataIndex: 'matchingStatus',
            scopedSlots: { customRender: 'matchingStatus' },
          },
          {
            title: '操作',
            key: 'operations',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          },
        ],
        model: {},
        title: '操作',
        visible: false,
        addButton: true, // 添加按钮
        confirmLoading: false,
        form: this.$form.createForm(this),
        statusOutOptions: {},
        statusIncomeOptions: {},
        recordStatusOptions: {},
        frameSearchStyleWidth: 'width: 182px', /* 输入框自定义宽度 */
        settleDomainItems: [],  // 结算主体数组
        settleDomainOptions: [],  // 所有的结算主体
        formTypeOptions:{},
        statusOptions: {'0': {'option': '未出账', 'color': 'blue'}, '1': {'option': '部分出账', 'color': 'pink'}, '2': {'option': '全部出账', 'color': 'green'}},
        defineColumns: {unitName: {width: 140}, settleDomainName: {width: 140}, setlleMonth: {width: 80}, formType: {width: 80, type: 'define', options: []}, matchingStatus: {width: 80, type: 'tag', options: []}},  // 隐藏列字段数组
        isAddData: [],  // 选中数据
        isAddDataKeys: [],  // 选中数据keys
        dateFormat: "YYYY-MM-DD",  // 时间格式化
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        url: {
          add: 'hrOneTime/tsettlebill/updateClaimIdById',
          list: 'salary/treciverecord/getSettleDomainMatchingVos', // 列表
          getSelectRecord: 'salary/tmatchingclaime/getRecordRelByRecordId', // 列表
          batchSave: 'salary/tmatchingclaime/batchSave',
          moveRecordRelBySettlementId:'salary/tmatchingclaime/removeRecordRelBySettlementId'
        },
        index:0
      }
    },
    methods: {
      loadData(arg) {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性！')
          return false
        }
        this.isAddData = []
        this.isAddDataKeys = []
        this.selectionRows = []
        this.selectedRowKeys = []
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1  // 重置第一页
        }

        var params = this.getQueryParams() //查询条件
        if(String(this.model.reciveType) === '4'||String(this.model.reciveType) === '5'){
          this.url.list = '/salary/treciverecord/getSettleDomainMatchingVosForTForecast'
          params.unitId = this.model.unitId
         
        }else{
          this.url.list = '/salary/treciverecord/getSettleDomainMatchingVos'
          params.settleDomainId = this.model.settleDomainId // 结算主体
        
        }
        //params.recordId = this.model.id // 记录id
        delete params.current
        delete params.size
        
        if (params.setlleMonth) {
          params.setlleMonth = params.setlleMonth.format('YYYYMM')
        }
        if(this.model.reciveType == '5'&&!params.formType){
          return false
        }
        this.loading = true // 加载图标
        getAction(this.url.list, params).then((res) => {
          if (res.code === 200) {
            if(this.model.reciveFeeBalance==0){
              res.data.map(item=>{
               item.dis = true
              })
            }
            this.dataSource = res.data
            // console.log(this.dataSource);
            // httpAction(this.url.getSelectRecord + '?recordId=' + this.model.id,{},'GET').then((res) => {
            //   console.log(res)
            // })
            // 处理选中的数据
            // for (let index = 0; index < res.data.length; index++) {
            //   if (res.data[index].claimId) {  // 选中
            //     this.isAddData.push(res.data[index])
            //     this.isAddDataKeys.push(res.data[index].id)
            //     this.selectionRows.push(res.data[index])
            //     this.selectedRowKeys.push(res.data[index].id)
            //   }
            // }
          } else {
            this.$message.error('获取数据失败！')
            this.dataSource = []
          }
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
      getCheckboxProps: record => ({
        props: {
          disabled: record.matchingStatus === '2'||record.dis, // Column configuration not to be checked
          name: record.matchingStatus
        },
      }),
      add() {
        this.edit({})
      },
      edit(record,index) {
        this.index = index
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        if( record.reciveType === '1'){
          this.formTypeOptions = {'0': '普通工资', '1': '工程工资', '2': '商险'}
          this.defineColumns.matchingStatus.options = {'0': {'option': '未匹配', 'color': 'blue'}, '1': {'option': '已匹配', 'color': 'green'}}
        }else if(record.reciveType === '4'){
          this.formTypeOptions = {'6':'预估结算单','7':'财务账单'}
          this.defineColumns.matchingStatus.options = {'0': {'option': '未匹配', 'color': 'blue'}, '1': {'option': '已匹配', 'color': 'green'}}
        }else if(record.reciveType === '5'){
          this.formTypeOptions = {'6':'预估结算单','7':'财务账单'}
          this.defineColumns.matchingStatus.options = {'0': {'option': '未匹配', 'color': 'blue'}, '1': {'option': '部分匹配', 'color': 'yellow'},'2': {'option': '已匹配', 'color': 'green'}}
        }
        // 赋值标签数据
        this.defineColumns.formType.options = this.formTypeOptions
      },
      // 保存按钮
      handleOk() {
        const that = this
        if(this.selectionRows.length == 0 ){
          that.$message.warning('请选择匹配项！')
        }else{
          let money = 0
          for(let c of this.selectionRows){
            money = money + c.settleDomainMoney -c.advanceMoney
          }

          if(this.queryParam.formType!=7&&this.model.reciveFeeBalance < money ){
            that.$message.warning('结算金额之和大于可匹配金额')
          }else{
            that.confirmLoading = true
            let matchData = []
            for(let d of this.selectionRows){
              matchData.push({
                matchId: d.id,
                type: d.formType,
                recordId: that.model.id,
                matchingAmount: d.matchingStatus=='1'?(d.settleDomainMoney-d.advanceMoney-d.matchingAmount).toFixed(2):(d.settleDomainMoney-d.advanceMoney).toFixed(2),
                flag: 0,
              })
            }
            
            httpAction(this.url.batchSave,{matchingClaimeList:JSON.stringify(matchData)},'post').then((res) => {
              if(res.code == 200){
                that.$message.success("匹配成功")
                that.visible = false
                that.handleCancel()
                that.$emit('ok')
              }else{
                that.$message.error(res.msg)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.handleCancel()
            })
          }
        }
        
      },
      formatFloat(f, digit = 2) {
        const m = Math.pow(10, digit)
        return Math.round(f * m) / m
      },
      handleRelease(record){
        const that = this
        httpAction(that.url.moveRecordRelBySettlementId + '?settlementFormId=' + record.id, {}, 'GET').then((res) => {
          if(res.code == 200){
            that.$message.success("撤销成功")
            that.loadData(1)
            that.model.reciveFeeBalance = that.formatFloat(parseFloat(that.model.reciveFeeBalance)+parseFloat(record.settleDomainMoney))
            that.$emit('oks',that.index,record.settleDomainMoney)
          }else {
            that.$message.warning(res.msg || res.message)
          }
        }).finally(() => {
          that.confirmLoading = false
        })
      },
      // 撤销
      handleReleasebills(record){
        const that = this
        this.confirmLoading = true
        this.$confirm({
          title: '提示',
          content: `此次撤销金额${record.matchingAmount}元,是否撤销？`,
          onOk() {
            that.handleRelease(record)
          },
          onCancel() {
            that.confirmLoading = false
          },
        });

      },
      // 关闭功能
      handleCancel() {
        this.close()
      },
      // 表单关闭与数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.addButton = true // 添加按钮
        this.confirmLoading = false
        this.queryParam ={}
        this.dataSource = []
      },
      // 起始时间选择
      handleTimeBeginChange(date) {
        // 时间格式化
        this.queryParam.settleDateStart = date ? (date.format(this.dateFormat)) : null
      },
      // 截止时间选择
      handleTimeEndChange(date) {
        // 时间格式化
        this.queryParam.settleDateEnd = date ? (date.format(this.dateFormat)) : null
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

.range-picker-new-style {
  :global(.ant-calendar-range-picker-input) {
    font-size: 13px;
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
