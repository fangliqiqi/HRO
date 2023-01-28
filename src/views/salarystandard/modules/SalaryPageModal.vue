<template>
  <div>
    <a-row>
      <a-col :span="3">
        <a-button
          type="primary"
          @click="add"
        >添加新封面</a-button>
      </a-col>
    </a-row>
    <a-card style="margin-top:20px;">
      <a-tabs
        v-model="activeKey"
        type="editable-card"
        @edit="onEdit"
      >
        <a-tab-pane
          v-for="pane in panes"
          :tab="pane.title"
          :key="pane.id"
          :closable="pane.closable"
        >
          <a-row type="flex">
            <a-col
              style="text-align:center;font-size:15px;font-weight:bolder;color:#333"
              :span="12"
              :offset="6"
              id="tabledesc1"
            >{{ pane.invoiceTitle }}</a-col>
            <a-col
              style="text-align:center;font-size:20px;font-weight:bolder;color:#333;margin-top:10px"
              :span="12"
              :offset="6"
            >{{ pane.payTypeText }}审批单</a-col>
          </a-row>
          <table class="table1" aria-describedby="tabledesc1">
            <tr class="tr1">
              <th
                class="td1"
                colspan="2"
                scope="col"
              ></th>
              <th
                class="td1"
                colspan="2"
                scope="col"
              >{{ pane.createDate }}</th>
              <th class="td1" scope="col">部门编码</th>
              <th class="td1" scope="col">{{ pane.settleNo }}</th>
            </tr>
            <tr class="tr1">
              <td
                class="td1"
                colspan="2"
              >
                <p class="font18">单位</p>
                <p>{{ pane.unitName }}</p>
                <p>{{ pane.settleName }}</p>
              </td>
              <td
                class="td1"
                colspan="2"
              >
                <p class="font18">项目</p>
                <p>{{ pane.itemName }}</p>
              </td>
              <td class="td1">
                <p class="font18">付款方式</p>
                <p>{{ pane.payTypeText }}</p>
              </td>
              <td class="td1">
                <p class="font18">金额</p>
                <p>¥{{ pane.money }}</p>
              </td>
            </tr>
            <tr class="tr1">
              <td
                class="td1"
                colspan="2"
              >合计人民币:</td>
              <td
                style="font-weight:bolder;text-align:left"
                class="td1"
                colspan="3"
              >{{ pane.chmoney }}</td>
              <td class="td1">¥{{ pane.money }}</td>
            </tr>
            <tr v-if="pane.payType == 1">
              <td class="td1">收款单位名称:</td>
              <td class="td1">
                <input
                  style="border-radius:5px;border:1px solid gray"
                  :value="pane.receiptUnitName"
                  @blur="blurChangeReceip"
                />
                <!-- <div
                  v-if="!pane.receiptUnitName"
                  style="color:red;font-size:10px;"
                >*收款单位不能为空</div> -->
              </td>
              <td class="td1">账户:</td>
              <td class="td1">
                <input
                  style="border-radius:5px;border:1px solid gray"
                  :value="pane.bankNo"
                  @blur="blurChangeBankNo"
                />
                <!-- <div
                  v-if="pane.errBankMsg"
                  style="color:red;font-size:10px"
                >*{{ pane.errBankMsg }}</div> -->
              </td>
              <td class="td1">开户行:</td>
              <td class="td1">
                <input
                  style="border-radius:5px;border:1px solid gray"
                  :value="pane.bankName"
                  @blur="blurChangeBankName"
                />
                <!-- <div
                  v-if="!pane.bankName"
                  style="color:red;font-size:10px"
                >*开户行不能为空</div> -->
              </td>
            </tr>
            <tr>
              <td class="td1">备注:</td>
              <td
                class="td1"
                colspan="5"
              >
                <input
                  style="border-radius:5px;border:1px solid gray;width:100%"
                  :value="pane.remark"
                  @blur="blurChangeBankRemark"
                >
              </td>
            </tr>
          </table>
          <a-row
            type="flex"
            v-if="pane.payType == 1"
          >
            <a-col :span="4">公司领导:</a-col>
            <a-col :span="4">财务负责人:{{ revenueName }}</a-col>
            <a-col :span="4">网银审核授权人:</a-col>
            <a-col :span="4">网银转账提交人:</a-col>
            <a-col :span="4">数据审核:{{ auditName }}</a-col>
            <a-col :span="4">制表人:{{ createName }}</a-col>
          </a-row>
          <a-row
            type="flex"
            v-if="pane.payType == 0"
          >
            <a-col :span="4">公司领导:</a-col>
            <a-col :span="4">财务负责人:{{ revenueName }}</a-col>
            <a-col :span="4">出纳会计::</a-col>
            <a-col :span="4">数据审核:{{ auditName }}</a-col>
            <a-col :span="4">制表人:{{ createName }}</a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-modal
      title="添加新封面"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleCancel"
      @ok="handleOk"
      cancelText="取消"
      okText="保存"
      :visible="visible"
    >
      <a-form :form="form">
        <a-form-item
          label="开票金额"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-input
            placeholder=""
            v-decorator="['money', validatorRules.money]"
          />
        </a-form-item>
        <a-form-item
          v-if="payType === 1"
          label="收款单位"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-input
            placeholder=""
            v-decorator="['receiptUnitName', validatorRules.receiptUnitName]"
          />
        </a-form-item>
        <a-form-item
          v-if="payType === 1"
          label="开户行"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-input
            placeholder=""
            v-decorator="['bankName', validatorRules.bankName]"
          />
        </a-form-item>
        <a-form-item
          v-if="payType === 1"
          label="银行卡号"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-input
            placeholder=""
            v-decorator="['bankNo', validatorRules.bankNo]"
          />
        </a-form-item>
        <a-form-item
          label="单位名称"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-input
            placeholder=""
            v-decorator="['unitName', validatorRules.unitName]"
          />
        </a-form-item>
        <a-form-item
          label="项目名称"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-input
            placeholder=""
            v-decorator="['itemName', validatorRules.itemName]"
          />
        </a-form-item>
        <a-form-item
          label="封面抬头"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-input
            placeholder=""
            v-decorator="['invoiceTitle', validatorRules.invoiceTitle]"
          />
        </a-form-item>
        <a-form-item
          label="付款方式"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-radio-group
            v-decorator="['payType',{'initialValue':1}]"
            @change="changePay"
          >
            <a-radio :value="1">银行</a-radio>
            <a-radio :value="0">现金</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="备注"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-textarea
            placeholder=""
            v-decorator="['remark']"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>

</template>
<script>
import { httpAction } from '@/api/manage'
import moment from 'moment'

export default {
  name:'SalaryPageModal',
  data () {
    return {
      activeKey: '',
      panes:[],
      newTabIndex: 0,
      visible:false,
      form:this.$form.createForm(this),
      validatorRules: {
        money:{ rules: [{ required: true, message: '请选择开票金额!' },{validator:this.isNumber}] },
        receiptUnitName: { rules: [{ required: true, message: '请填写收款单位!' }] },
        bankName: { rules: [{ required: true, message: '请填写开户行!' }] },
        bankNo: { rules: [{ required: true, message: '请填写银行卡号!没有输入空字符' }] },
        invoiceTitle: { rules: [{ required: true, message: '请填写封面抬头!' }] },
        unitName:{ rules: [{ required: true, message: '请填写单位!' }] },
        itemName:{ rules: [{ required: true, message: '请填写项目!' }] },
      },
      url:{
        addUrl:'/salary/tsalarycover/saveSalaryCover',
        editUrl:'/salary/tsalarycover',
        deleteUrl:'/salary/tsalarycover/'
      },
      model:{},
      payType:1,
      employData:{},
      createName:'',
      auditName:'',
      revenueName:'',
      receipName:'', //收款单位
      bankName:'',//银行名称
      bankNo:'', //银行卡号
    }
  },
  props: {
    salaryStandardInfo:{
      type:Object,
      required:true
    },
    coverList:{
      type:Array,
      required:true
    },
    bankOptions: {
      type:Array,
      required:true
    },
    // employData:{
    //   type:Object,
    //   required:true
    // }
  },
  methods: {
    show(){
      for(var d in this.employData){
        if(this.salaryStandardInfo.createUser == d){
          this.createName = this.employData[d]
        }
        if(this.salaryStandardInfo.auditUser == d){
          this.auditName = this.employData[d]
        }
        if(this.salaryStandardInfo.revenueUser == d){
          this.revenueName = this.employData[d]
        }
      }
      this.panes = this.coverList
      for(var c in this.panes){
        if(c == 0){
          this.activeKey = this.panes[0].id
        }
        this.panes[c].auditName = ''
        this.panes[c].createName = ''
        this.panes[c].title = this.panes[c].payType == 1 ? '银行转账' : '现金付款'
        this.panes[c].key = this.panes[c].id
        this.panes[c].payTypeText = this.panes[c].payType == 1 ? '银行转账' : '现金付款'
        if(!this.panes[c].bankNo){
          this.panes[c].errBankMsg = '卡号必填,没有则输入空字符!'
        }else{
          this.panes[c].errBankMsg = ''
        }
      }
  
    },
    callback (key) {
      console.log(key)
    },
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    add () {
      this.form.resetFields()
      this.payType = 1
      this.visible = true
    },
    remove (targetKey) {
      var that = this
      this.$confirm({
        centered: true,
        maskClosable: true,
        title: '确认吗？',
        content: (  
          <div>
            <p>是否确认删除?</p>
          </div>
        ),
        onOk () {
          httpAction(that.url.deleteUrl + targetKey,{},'DELETE').then((res) => {
            if(Number(res.code) === 200){
              let activeKey = that.activeKey
              let lastIndex
              that.panes.forEach((pane, i) => {
                if (pane.key === targetKey) {
                  lastIndex = i - 1
                }
              })
              const panes = that.panes.filter(pane => pane.key !== targetKey)
              if (lastIndex >= 0 && activeKey === targetKey) {
                activeKey = panes[lastIndex].key
              }
              that.panes = panes
              that.activeKey = activeKey
            }
          })
        },
        onCancel() {}
      })
     
    },
    handleCancel() {
      this.visible = false
    },
    changePay(e){
      this.payType = e.target.value
    },
    handleOk() {
      this.form.validateFields((err,values) => {
        if(!err){
          let formData = Object.assign(this.model,values)
          formData.settleId = this.salaryStandardInfo.departId
          formData.settleName = this.salaryStandardInfo.departName
          formData.settleNo = this.salaryStandardInfo.departNo
          formData.salaryFormId = this.salaryStandardInfo.id
          httpAction(this.url.addUrl,formData,'POST').then((res) => {
            if(Number(res.code) === 200){
              //const len = this.panes.length + 1
              this.visible = false
              const panes = this.panes
              //const activeKey = `${this.newTabIndex++}`
              res.data.title = (res.data.payType == 1) ? '银行转账' : '现金付款'
              res.data.key = res.data.id
              res.data.createDate = moment().format("YYYY年MM月DD日")
              res.data.payTypeText = (res.data.payType == 1) ? '银行转账' : '现金付款'
              panes.push(res.data)
              this.panes = panes
              this.activeKey = res.data.id
            }
          })
        }
      })
      
    },
    blurChangeReceip(e){
      this.receipName= e.target.value
      if(e.target.value){
        console.log(e.target.value)
        let formData = {}
        formData.receiptUnitName = e.target.value
        formData.id = this.activeKey
        httpAction(this.url.editUrl,formData,'PUT').then((res) => {
          if(Number(res.code) === 200){
            for(var c in this.panes){
              if(this.panes[c].id == this.activeKey){
                this.panes[c].receiptUnitName = e.target.value
              }
            }
            this.$message.success("修改成功")
          }else{
            this.$message.console.error("修改失败")
          }
        })
      }else{
        for(var c in this.panes){
          if(this.panes[c].id == this.activeKey){
            this.panes[c].receiptUnitName = e.target.value
          }
        }
      }
    },
    blurChangeBankNo(e){
      //const reg = /^([1-9]{1})(\d{9,24})$/
      this.bankNo = e.target.value
      if(e.target.value){
        let formData = {}
        formData.bankNo = e.target.value
        formData.id = this.activeKey
        httpAction(this.url.editUrl,formData,'PUT').then((res) => {
          if(Number(res.code) === 200){
            for(var c in this.panes){
              if(this.panes[c].id == this.activeKey){
                this.panes[c].bankNo = e.target.value
                this.panes[c].errBankMsg = ''
              }
            }
            this.$message.success("修改成功")
          }else{
            this.$message.console.error("修改失败")
          }
        })
      }else{
        for(var c in this.panes){
          if(this.panes[c].id == this.activeKey){
            this.panes[c].bankNo = e.target.value
            this.panes[c].errBankMsg = '卡号必填,没有则输入空字符!'
          }
        }
      }
    },
    blurChangeBankName(e){
      this.bankName = e.target.value
      if(e.target.value){
        let formData = {}
        formData.bankName = e.target.value
        formData.id = this.activeKey
        httpAction(this.url.editUrl,formData,'PUT').then((res) => {
          if(Number(res.code) === 200){
            for(var c in this.panes){
              if(this.panes[c].id == this.activeKey){
                this.panes[c].bankName = e.target.value
              }
            }
            this.$message.success("修改成功")
          }else{
            this.$message.console.error("修改失败")
          }
        })
      }else{
        for(var c in this.panes){
          if(this.panes[c].id == this.activeKey){
            this.panes[c].bankName = e.target.value
          }
        }
      }
    },
    blurChangeBankRemark(e){
      if(e.target.value){
        let formData = {}
        formData.remark = e.target.value
        formData.id = this.activeKey
        httpAction(this.url.editUrl,formData,'PUT').then((res) => {
          if(Number(res.code) === 200){
            for(var c in this.panes){
              if(this.panes[c].id == this.activeKey){
                this.panes[c].remark = e.target.value
              }
            }
            this.$message.success("修改成功")
          }else{
            this.$message.console.error("修改失败")
          }
        })
      }
      
    },
    // 验证银行卡号
    isBankNo(rule,value,callback){
      if( value !== '' && value.length>25){
        callback(new Error('不能超过25位！'))
      }else{
        callback()
      }
    },
    // 验证数字
    isNumber(rule,value,callback){
      const reg = /(^([1-9]{1}[0-9]{0,8})|^0)(\.[0-9]{1,2})?$/
      if(!reg.test(value) && value != ''){
        callback(new Error('请输入正确的金额'))
      }else{
        callback()
      }
    }
  },
}
</script>
<style scoped>
.tablePage {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  width: 100%;
}
.table1 {
  border: 1px solid #ccc;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 20px;
}
.table1 .tr1 {
  margin: 0px;
  padding: 0;
  width: 100%;
}
.table1 th{
  font-weight: normal;
}
.table1 .td1 {
  border: 1px solid #333;
  text-align: center;
  height: 40px;
  padding: 10px;
  width: 17%;
}
.table1 .td2 {
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 40px;
  padding: 10px;
  width: 17%;
  text-align: center;
}
.table1 .tit {
  background: #e6f7ff;
  font-weight: bolder;
}
.table1 .input1 {
  height: 35px;
  width: 100%;
  padding: 0 5px;
}
.table1 .btn {
  width: 20%;
  font-size: 16px;
  border: none;
  background: red;
  color: #fff;
  float: right;
}
.table2 {
  text-align: center;
  display: block;
  width: 83%;
  margin: 20px auto 10px;
}
.num {
  margin-top: 20px;
}
.font18 {
  font-size: 18px;
  font-weight: bolder;
}
</style>
