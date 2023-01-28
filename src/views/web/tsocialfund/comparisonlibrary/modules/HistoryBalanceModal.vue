<template>

  <a-spin :spinning="confirmLoading">
    <a-row>
      <a-col
        :span="24"
        class="export"
      >
        <a-button
          @click="handleAdd"
          :loading="confirmLoading"
          style="margin-right:10px"
          v-if="status == 0"
        >添加</a-button>
        <a-button
          @click="handleExport"
          :loading="confirmLoading"
        >导出</a-button>
      </a-col>
      <a-col
        class="titleCenter"
        :span="24"
      >历史遗留明细</a-col>
    </a-row>
    <a-table
      :columns="columns"
      size="middle"
      rowKey="id"
      :pagination="false"
      :data-source="dataSource"
      bordered
    >
      <template v-slot:action="text,record,index">
        <a-popconfirm
          title="确定删除吗?"
          v-if="status == 0 && record.type == 1"
          @confirm="() => handleDelete(record,index)"
        >
          <a-button type="link" :loading="confirmLoading">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal
      :title="title"
      :width="700"
      :closable="false"
      :visible="visible"
      @cancel="handleCancel"
      @ok="handleOk"
      :maskClosable="false"
      :destroyOnClose="false"
      centered
    >
      <a-form
        :form="form"
        layout="inline"
        class="form"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item label="项目说明">
              <a-input placeholder="请输入项目说明" v-decorator="['feeType',{ rules: [{required: true,message:'请输入项目说明!'},{max:20,message: '项目说明最多20个字符!'}] }]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="金额">
              <a-input v-decorator="['fee',{ rules: [{required: true,message:'金额不能为空!'},{pattern:/(^(-)?[1-9]([0-9]{1,9})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^(-)?[0-9]\.[0-9]([0-9])?$)/,message: '请输入正确金额!'}] }]" />
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </a-modal>
  </a-spin>

</template>

<script>
  
  import { httpAction } from '@/api/manage'

  export default {
    name: 'HistoryBalanceModal',
    props: {
      balanceInfo:{
        type: Object,
        default: ()=>{},
        required: true
      },
      status:{
        type: String,
        default: '',
        required: true
      },
    },
    data() {
      return {
        model: {},
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        title:'',
        columns:[
          {
            title: '费用类型',
            align: 'center',
            dataIndex: 'feeType',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            title: '结算月份',
            align: 'center',
            dataIndex: 'settleMoth',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            title: '差余额',
            align: 'center',
            dataIndex: 'fee',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            title: '操作',
            align: 'center',
            dataIndex: 'unitFundFee',
            scopedSlots: { customRender: 'action' }
          }
        ],
        dataSource:[],
        url: {
          exportXlsUrl: '', // 导出地址
        },
      }
    },
    methods: {
      sortArr(arr){
        arr.sort(function(a, b){return b.settleMoth - a.settleMoth})
        return arr
      },
      handleFieldSort(arr){
        let total = 0
        let first = []
        let second = []
        arr.forEach(item=>{
          if(item.type == '0'){
            first.push(item)
          }else{
            second.push(item)
          }
          total += parseFloat(item.fee||0)
        })
        const list = this.sortArr(second).concat(this.sortArr(first))
        list.push({
          feeType: '差余额合计',
          settleMoth:'-',
          fee:Math.round(parseFloat(total*100))/100,
          unitFundFee:'',
          type:0
        })
        return list
      },
      show(){
        httpAction(`/hrSocial/tbalancehistorydiff/getHisDiffByFormId?formId=${this.balanceInfo.id}`,null,'get').then(res=>{
          if(res.code === 200){
            this.dataSource = this.handleFieldSort(res.data.reverse())
          }else{
            this.dataSource = []
          }
        })
      },
      handleDelete(record,index){
        this.confirmLoading = true
        httpAction(`/hrSocial/tbalancehistorydiff/${record.id}`,null,'DELETE').then(res=>{
          if(res.code === 200){
            this.$message.success('删除成功！')
            this.dataSource.splice(index,1)
            const sum = parseFloat(this.dataSource[this.dataSource.length-1]['fee']) - parseFloat(record.fee)
            this.$set(this.dataSource[this.dataSource.length-1],`fee`,Math.round(parseFloat(sum*100))/100)
            this.$emit('ok')
          }else{
            this.$message.warning(res.msg)
          }
        }).finally(()=>{
          this.confirmLoading = false
        })
      },
      handleAdd(){
        this.visible = true
        this.form.resetFields()
      },
      handleExport(){
        const params = {
          excelName: '历史遗留明细',
          excelHead: [{title:['历史遗留明细','',''],unitName:[this.balanceInfo.unitName,'','']}],
          excelDatas:[{
            tHeader: ["费用类型","结算月份","差余额"],
            filterVal: ['feeType','settleMoth','fee'],
            tableDatas: this.dataSource,
            sheetName: `历史遗留差额`
          }],
        }
        this.$emit('export',params)
      },
      handleOk(){
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            values.balanceFormId = this.balanceInfo.id
            values.settleMoth = this.balanceInfo.month
            httpAction(`/hrSocial/tbalancehistorydiff`,values,'post').then(res=>{
              if(res.code === 200){
                this.$emit('ok')
                this.$message.success('添加成功！')
                // const length = this.dataSource.length - 1
                // this.dataSource.splice(length,1,res.data)
                this.dataSource.unshift(res.data)
                const sum = parseFloat(this.dataSource[this.dataSource.length-1]['fee']) + parseFloat(res.data.fee)
                this.$set(this.dataSource[this.dataSource.length-1],`fee`,Math.round(parseFloat(sum*100))/100)
                this.visible = false
              }else{
                this.$message.warning(res.msg)
              }
            }).finally(()=>{
              this.confirmLoading = false
            })
          }
        })
      },
      // 表单关闭
      handleCancel() {
        this.visible = false
        this.confirmLoading = false
      },
    }
  }
</script>

<style lang="less" scoped>
.export {
  text-align: right;
}
.titleCenter {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin: 8px 0px 10px;
}
</style>
