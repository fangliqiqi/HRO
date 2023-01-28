<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="600"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    okText="导出"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        class="ant-advanced-search-form"
      >
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="发票号"
          extra="注：支持多个发票号导出，用英文逗号隔开"
        >
          <a-textarea
            placeholder="发票号"
            v-decorator="['invoiceNo', { rules: [{ required: true, message: '发票号不能为空!' }] } ]"
            :rows="5"
            @change="changeHandle"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'

export default {
  name: 'FinancialAuditModal',
  data() {
    return {
      visible: false,
      title: '财务审核',
      confirmLoading: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    changeHandle(e){
      let str = e.target.value.replace(/\s+/g,"")
      str = str.replace(/，|；|;/g,',')
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({invoiceNo:str},'invoiceNo'))
      })
    },
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          httpAction(`/busiInsurance/tbusinessinsurance/isHaveInvoiceNo?invoiceNo=${values.invoiceNo}` , null, 'get').then((res) => {
            if (res.code === 200) {
              _this.exportExcel(values.invoiceNo)
            } else if(res.code === 1){
              _this.$message.warning(res.msg)
            }else{
              _this.$confirm({
                title: res.msg,
                okText: '继续导出',
                onOk() {
                  _this.exportExcel(values.invoiceNo)
                },
              })
            }
          })
        }
      })
    },
    exportExcel(param){
      this.confirmLoading = true
      httpAction(`/busiInsurance/tbusinessinsurance/getTakingRisksByInvoiceNo?invoiceNo=${param}`,null,'get',60000).then(res=>{
        if(res.code === 200){
          // tx05270002
          const exportList = []
          const typeLength = [0];
          if(res.data&&res.data.length>0){
            for (let items of res.data) {
              items.itemList.map((item,index)=>{
                if(index === 0){
                  typeLength.push(items.itemList.length)
                }else{
                  typeLength.push(0)
                }
                item.shouldBuyPay = items.shouldBuyPay
                exportList.push(item)
              })
            }
            console.log(exportList)
          }

          let excelDatas = [
            {
              tHeader: ["发票单号", "行业类型","单位名称","结算主体名称","结算月份","结算金额","保费金额","实发工资","应转保费(合计)","发放月份","我司到款单位"],
              filterVal: ['invoiceNo','industryBelong',"customerName","deptName","settleMonth","accountMoneySum","buyPay", "cardPay","shouldBuyPay","revenueTime","selfTomoneyUnitName"],
              tableDatas: exportList,
              sheetName: "财务审核"
            }
          ]

          this.json2excel(excelDatas, "财务审核导出", true, "xlsx",typeLength)
        }else{
          this.confirmLoading = false
          this.$message.warning(res.msg)
        }
      })
    },
    
    json2excel(tableJson, filenames, autowidth, bookTypes,typeLength) {
      var that = this
      that.confirmLoading = true
      import('@/vendor/ExportInsuranceAudit').then(excel => {
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
      }).finally(()=>{
        that.$message.success(`导出成功！`)
        that.handleCancel()
        that.confirmLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j] == null ? '-' : v[j]
      }))
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.form.resetFields()
      this.visible = false
      this.confirmLoading = false
    }
  }
}
</script>

<style scoped>
</style>