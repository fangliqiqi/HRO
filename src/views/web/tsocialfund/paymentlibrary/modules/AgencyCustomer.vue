<template>
  <a-modal
    :title="title"
    :width="600"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >导出</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="单位名称"
              class="stepFormText"
            >
              <select-page
                placeholder="请选择单位"
                style="width: 375px"
                v-decorator="['unitId']"
                :searchUrl="'/hrBase/customerBusiness/customerInfo/getCustomerOwnerPage?customerName='"
                :title="'customerName'"
                :allowClear="false"
                @select="handleUnitChange"
                :id="'customerId'"
              ></select-page>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="结算月份"
              class="stepFormText"
            >
              <a-month-picker
                allowClear
                placeholder="请选择结算月份"
                v-decorator="['settleMonth', validatorRules.settleMonth]"
                style="width: 180px"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>

    <a-modal
      title="数据校验信息"
      :width="600"
      :closable="true"
      :visible="msgvisible"
      @cancel="handleErrorCancel"
      @ok="handleErrorOk"
      :maskClosable="false"
    >
      <p
        v-for="(item, index) in errData"
        :key="index"
      >{{ item }}</p>
    </a-modal>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'AgencyCustomer',
    components: {
      SelectPage
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        msgvisible: false,
        confirmLoading: false,
        loading:false,
        settleDomainDisabled: true,
        form: this.$form.createForm(this),
        dateFormat: 'YYYYMM', // 时间格式化
        settleDomainBelongs: [], // 结算主体
        yearMonthArrBelongs: [],  // 年和月组成的字符串的数组
        typeOptions: {'0': {'option': '否', 'color': 'green'}, '1': {'option': '是', 'color': 'red'}}, // 类型
        validatorRules: {
          createMonth: {rules: [{ required: true, message: '请选择生成月份！' }]},
          settleMonth: {rules: [{ required: true, message: '请选择账单月份！' }]},
          settleDomainIds: {rules: [{ required: true, message: '请选择结算主体！' }]},
        },
        url: {
          add: 'hrSocial/tagent/doCreate',
          exportUrl: 'hrSocial/tagent/doExportByUnit'
        },
        errData: [],
      }
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            that.loading = true
            let httpurl = ''
            let method = 'get'
            let formData = Object.assign(this.model, values)
            
            
            formData.settleMonth = formData.settleMonth.format(this.dateFormat)
            httpurl += this.url.exportUrl + '?settleMonth=' + formData.settleMonth + '&unitId=' + formData.unitId
            // httpurl += '?settleMonths=' + formData.settleMonths + '&settleDomainIds=' + formData.settleDomainIds + '&orderMonth=' + formData.orderMonth + '&type=' + formData.type

            httpAction(httpurl, {}, method,10000*3).then((res) => {
              if (res.code === 200) {
                this.inauguarlExport(res.data)
              } else {
                if(res.data&&res.data.length){
                  that.errData = res.data
                  that.msgvisible = true
                }else{
                  that.$message.warning(res.msg || res.message)
                }
                // that.$message.warning(res.msg || res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.loading = false
            })
          }
        })
      },
      //导出
      inauguarlExport(data){
        this.downloading = true
        let settleForm = data.agent
        let paymentMap = data.paymentMap

        let settelData = [
          {'index':settleForm.settleMonth + '结算单','data':'','project':'','money':'','account':' '},
          {'index':'结算名称:','data':settleForm.deptName,'project':'','money':'','account':' '},
          {'index':'结算编码:','data':settleForm.deptNo,'project':'','money':'','account':' '},
          {'index':'结算时间:','data':settleForm.settleMonth,'project':'','money':'','account':' '},
          {'index':'序号','data':'费用项目','project':'','money':'金额','account':'开票额小计'},
          {'index':1,'data':settleForm.settleMonth,'project':'应缴单位社保','money':settleForm.unitSocial,'account':settleForm.unitSocialTicket},
          {'index':2,'data':'','project':'应缴个人社保','money':settleForm.personSocial,'account':settleForm.personSocialTicket},
          {'index':3,'data':settleForm.settleMonth,'project':'应缴单位公积金','money':settleForm.unitFund,'account':settleForm.unitFundTicket},
          {'index':4,'data':'','project':'应缴个人公积金','money':settleForm.personFund,'account':settleForm.personFundTicket},
        ];

        let num = 5
        settelData.push({'index':num++,'data':'服务人数','project':'','money':settleForm.personNum,'account':''})
        settelData.push({'index':num++,'data':'服务人次','project':'','money':settleForm.personCount,'account':''})
        settelData.push({'index':num++,'data':'管理费','project':'','money':settleForm.management,'account':settleForm.managementTicket})
        settelData.push({'index':num++,'data':'开票金额合计','project':'','money':'','account': settleForm.settleMoney})

        settelData.push({'index':"",'data':'','project':'','money':"",'account':''})
        settelData.push({'index':"",'data':'','project':'','money':"",'account':''})

        settelData.push({'index':"发票类型",'data':'扣除金额','project':'不含税收入','money':"税额",'account':'发票合计金额'})
        settelData.push({'index':"普通发票",'data':settleForm.oneMoney,'project':settleForm.oneIncome,'money':settleForm.oneTax,'account':settleForm.oneTicket})
        settelData.push({'index':"专用发票",'data':settleForm.twoMoney,'project':settleForm.twoIncome,'money':settleForm.twoTax,'account':settleForm.twoTicket})
        
        settelData.push({'index':"",'data':'','project':'','money':"",'account':''})
        settelData.push({'index':"",'data':'','project':'','money':"",'account':''})

        settelData.push({'index':"公司地址",'data':'纳税识别号','project':'公司开户行','money':"账号",'account':'联系电话'})
        settelData.push({'index':settleForm.addr,'data':settleForm.taxpayerIdentificationNo,'project':settleForm.bankName,'money':settleForm.bankNo,'account':settleForm.phone})

        settelData.push({'index':"",'data':'','project':'','money':"",'account':''})
        settelData.push({'index':"",'data':settleForm.remark,'project':'','money':"",'account':''})

        var excelDatas = [
          {
            tHeader: ["序号",null,"费用项目", "金额", "开票额小计"],
            filterVal: ['index','data',"project", "money", "account"],
            tableDatas: settelData,
            sheetName: "结算单"
          },
        ];

        for(let c in paymentMap){
          let i = 1
          for(let d in paymentMap[c]){
            paymentMap[c][d]['num'] = i
            i++
          }
          excelDatas.push({
            tHeader: ['序号','部门','姓名', '单位','服务类别','社保缴纳地','公积金缴纳地','身份证号码','缴费月份',	'缴费基数',"养老单位(16％)",	
            "养老个人(8％)",	"失业单位(0.05％)",	"失业个人(0.5％)",	'医疗单位(6.9%)',	'医疗个人(2%)',	'大病医疗单位',	'大病医疗个人',	"工伤(0.2%)",	"生育(0%)",	
            '单位社保小计',	'个人社保小计',	'公积金基数',	'单位缴存额',	'个人缴存额',	'单位合计',	'个人合计',	'服务费',	'社保号码',	'补退历史差额',	'合计',																																																																																																																																																																																																								
            ],
            filterVal: ['num','deptName','empName', 'unitName','serviceType','socialPayAddr','providentPayAddr','empIdcard','socialPayMonth','unitPensionSet','unitPensionMoney',
            'personalPensionMoney','unitUnemploymentMoney','personalUnemploymentMoney','unitMedicalMoney','personalMedicalMoney','unitBigmailmentMoney','personalBigmailmentMoney','unitInjuryMoney','unitBirthMoney',
            'unitSocialSum','socialSecurityPersonalSum','unitProvidentSet','unitProvidentSum','personalProvidentSum','unitSum','personalSum','managementFee','socialSecurityNo','','allSum'
            ],
            tableDatas: paymentMap[c],
            sheetName: c
          })
        }

        let excelName = settleForm.settleMonth + settleForm.deptName + "代理结算单" + settleForm.deptNo + '(' + settleForm.settleMoney + ')'
        this.json2excel(excelDatas, excelName, true, "xlsx")
        this.downloading = false
      },
      json2excel(tableJson, filenames, autowidth, bookTypes){
        var that = this
        //这个是引用插件
        import("@/vendor/AgentExcel").then(excel => {
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
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
      // 关闭功能
      handleCancel() {
        this.close()
      },
      handleErrorCancel() {
        this.msgvisible = false
      },
      handleErrorOk() {
        this.msgvisible = false
      },
      // 表单关闭与数据重置
      close() {
        this.type = '' // 类型（锁定还是解锁）
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.settleDomainDisabled = true
        this.settleDomainBelongs = [] // 结算主体
        this.yearMonthArrBelongs = [] // 年和月组成的字符串的数组
      },
      // 单位选择变化
      handleUnitChange(value) {
        this.$nextTick(() => {
          let unitId = undefined
          this.settleDomainBelongs = []
          if(value){
            unitId = value
            httpAction(`/hrBase/customerBusiness/customerInfo/getSettleDomain/${value}`, {}, 'get').then((res) => {
              if(res.code === 200){
                this.settleDomainDisabled = false
                this.settleDomainBelongs = res.data
              }
            })
          }
          this.form.setFieldsValue(pick({settleDomainIds: [], checked: ['0'],unitId:unitId}, 'settleDomainIds', 'checked','unitId'))
        })
      },
      // 全选功能
      onCheckBoxChange(checked) {
        if (checked.length === 1) {  // 全选
          let settleDomainOptions = []
          for (let item of this.settleDomainBelongs) {
            settleDomainOptions.push(item.id)
          }
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({settleDomainIds: settleDomainOptions}, 'settleDomainIds'))
          })
        } else {  // 取消
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({settleDomainIds: []}, 'settleDomainIds'))
          })
        }
      },
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
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
</style>