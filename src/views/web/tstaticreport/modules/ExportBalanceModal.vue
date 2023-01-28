<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="500"
    okText="导出"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="结算月份"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 15 }"
            >
              <a-month-picker
                v-decorator="['settlementMonth', { initialValue:moment(), rules: [{ required: false, message: '请选择结算月份!' }]} ]"
                :format="format"
                placeholder="请选择结算月份"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>

import { httpAction } from '@/api/manage'
import { groupByRepetid } from '@/utils/common'
import moment from 'moment'

export default {
  name: 'ExportBalanceModal',
  components: {
    
  },
  data(){
    return {
      title: '导出',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      format: 'YYYYMM',
      userData:{},
      url:'/salary/tstatisticsbalance/exportBalanceMainList',
    }
  },
  methods:{
    moment,
    show(data){
      this.visible = true;
      this.userData = data
    },
    // 转换上传人的id和名字
    handleUser(user,list){
      list.map(item=>{
        item.createUserName = user[item.createUser]
      })
      return list
    },
    handleOk(){
      const _this = this;
      this.form.validateFields(async (err, values) =>  {
        if (!err) {
          this.confirmLoading = true;
          const url = values.settlementMonth ? `${this.url}?settlementMonth=${values.settlementMonth.format('YYYYMM')}` : this.url;
          httpAction(url,{},'get',60000).then(res=>{
            if(res.code == 200){
              let repet = groupByRepetid(res.data,'salaryId')
              let data = this.handleUser(this.userData,res.data)
              const excelDatas = [{
                tHeader: ["客户名称", "客户编码","结算主体","结算主体编码","结算月份","上月累计差余额","本月差余额","本月累计差余额",
                          "上传人","创建时间","结算金额","开票金额","上次差余额","本期差余额","累计差余额","月份","姓名","项目","金额","原因"],
                filterVal: ['unitName','unitNo',"departName", "departNo","settlementMonth","prevPoorBalance","nowPoorBalance","curPoorBalance",
                          "createUserName","createTime","accountMoneySum","ticketMoneySum","prevPoorBalanceDetail","nowPoorBalanceDetail","curPoorBalanceDetail",
                          "month","name","project","money","cause"],
                tableDatas: data,
                sheetName: "差余额统计"
              }]
              this.json2excel(excelDatas, `差余额统计`, true, "xlsx",repet);
              this.handleCancel();
            }else{
              this.$message.warning(res.msg);
            }
          }).finally(()=>{
            setTimeout(()=>{
              _this.confirmLoading = false;
            },2000)
          })
        }
      })
    },
    handleCancel(){
      this.visible = false;
      this.confirmLoading = false;
    },
    json2excel(tableJson, filenames, autowidth, bookTypes,refetLen){
      var that = this
      //这个是引用插件
      import("@/vendor/ExportDiffer").then(excel => {
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
          refetLen:refetLen
        })
      }).finally(()=>{
        that.$message.success('导出成功！');
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j] || ''
      }))
    },
    

  }

}
</script>