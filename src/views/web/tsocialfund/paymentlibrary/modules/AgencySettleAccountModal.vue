<template>
  <a-card :title="settlementhFormInfo.settleDepartNo">

    <a-card :bordered="false">
      <div class="tabDiv">
        <h2>{{ settlementhFormInfo.unitName }}-{{ settlementhFormInfo.settleMonth }} - 结算单</h2>
        <table class="table1">
          <tr class="tr1">
            <td class="tit td1">单位名称</td>
            <td class="td1">{{ settlementhFormInfo.unitName }}</td>

            <td class="tit td1">皖信盖章</td>
            <td class="td1"></td>
          </tr>
          <!--<tr class="tr1">
            <td class="tit td1">结算编码名称</td>
            <td
              class="td1"
              colspan="3"
            >{{ settlementhFormInfo.deptNo }}</td>
          </tr>-->
          <tr class="tr1">
            <td class="tit td1">结算主体</td>
            <td
              class="td1"
              colspan="3"
            >{{ settlementhFormInfo.deptName }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">结算时间</td>
            <td
              class="td1"
              colspan="3"
            >{{ settlementhFormInfo.settleMonth }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >费用项目</td>
            <td class="tit td1">金额</td>
            <td class="tit td1">开票额小计</td>
          </tr>

          <tr class="tr1">
            <td
              class="tit td1"
              rowspan="4"
            ></td>
            <td class="tit td1">应缴单位社保</td>
            <td class="td1">
              <input
                style="border-radius:5px;border:1px solid gray;width:100%"
                :value="settlementhFormInfo.unitSocial"
                v-if="status==0"
                v-has="'wxhr:tagent_edit'"
                @blur="blurSettleunitSocial"
              >
              <span v-else>
                {{ settlementhFormInfo.unitSocial ? settlementhFormInfo.unitSocial.toFixed(2) : settlementhFormInfo.unitSocial }}
              </span>

            </td>

            <td class="td1">{{ settlementhFormInfo.unitSocialTicket }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴个人社保</td>
            <td class="td1">
              <input
                style="border-radius:5px;border:1px solid gray;width:100%"
                :value="settlementhFormInfo.personSocial"
                v-if="status==0"
                v-has="'wxhr:tagent_edit'"
                @blur="blurSettlepersonSocial"
              >
              <span v-else>
                {{ settlementhFormInfo.personSocial ? settlementhFormInfo.personSocial.toFixed(2) : settlementhFormInfo.personSocial }}
              </span>
            </td>

            <td class="td1">{{ settlementhFormInfo.personSocialTicket }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴单位公积金</td>
            <td class="td1">
              <input
                style="border-radius:5px;border:1px solid gray;width:100%"
                :value="settlementhFormInfo.unitFund"
                v-if="status==0"
                v-has="'wxhr:tagent_edit'"
                @blur="blurSettleunitFund"
              >
              <span v-else>
                {{ settlementhFormInfo.unitFund ? settlementhFormInfo.unitFund.toFixed(2) : settlementhFormInfo.unitFund }}
              </span>

            </td>

            <td class="td1">{{ settlementhFormInfo.unitFundTicket }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">应缴个人公积金</td>
            <td class="td1">
              <input
                style="border-radius:5px;border:1px solid gray;width:100%"
                :value="settlementhFormInfo.personFund"
                v-if="status==0"
                v-has="'wxhr:tagent_edit'"
                @blur="blurSettlepersonFund"
              >
              <span v-else>
                {{ settlementhFormInfo.personFund ? settlementhFormInfo.personFund.toFixed(2) : settlementhFormInfo.personFund }}
              </span>

            </td>

            <td class="td1">{{ settlementhFormInfo.personFundTicket }}</td>
          </tr>

          <tr class="tr1">
            <td
              class="tit td1"
              rowspan="6"
            >缴费差额</td>
            <td class="tit td1">单位社保</td>
            <td class="td1">{{ handleTextShow(settlementhFormInfo.socialSecurityCompanySum) }}</td>
            <td class="td1">{{ handleTextShow(settlementhFormInfo.socialSecurityCompanySum) }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">个人社保</td>
            <td class="td1">{{ handleTextShow(settlementhFormInfo.socialSecurityPersonalSum) }}</td>
            <td class="td1">{{ handleTextShow(settlementhFormInfo.socialSecurityPersonalSum) }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">单位公积金</td>
            <td class="td1">{{ handleTextShow(settlementhFormInfo.providentCompanyDiff) }}</td>
            <td class="td1">{{ handleTextShow(settlementhFormInfo.providentCompanyDiff) }}</td>
          </tr>

          <tr class="tr1">
            <td class="tit td1">个人公积金</td>
            <td class="td1">{{ handleTextShow(settlementhFormInfo.providentPersonalDiff) }}</td>
            <td class="td1">{{ handleTextShow(settlementhFormInfo.providentPersonalDiff) }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">管理费</td>
            <td class="td1">{{ handleTextShow(settlementhFormInfo.manageDiff) }}</td>
            <td class="td1">{{ handleTextShow(settlementhFormInfo.manageDiff) }}</td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">其他费用</td>
            <td class="td1">{{ handleTextShow(settlementhFormInfo.otherDiff) }}</td>
            <td class="td1">{{ handleTextShow(settlementhFormInfo.otherDiff) }}</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >服务人数</td>
            <td class="td1">
              <input
                style="border-radius:5px;border:1px solid gray;width:100%"
                :value="settlementhFormInfo.personNum"
                v-if="status==0"
                v-has="'wxhr:tagent_edit'"
                @blur="blurSettlepersonNum"
              >
              <span v-else>
                {{ settlementhFormInfo.personNum || 0 }}
              </span>
            </td>
            <td class="td1">-</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >服务人次</td>
            <td class="td1">
              <input
                style="border-radius:5px;border:1px solid gray;width:100%"
                :value="settlementhFormInfo.personCount"
                v-if="status==0"
                v-has="'wxhr:tagent_edit'"
                @blur="blurSettlepersonCount"
              >
              <span v-else>
                {{ settlementhFormInfo.personCount || 0 }}
              </span>
            </td>
            <td class="td1">-</td>
          </tr>
          <tr class="tr1">
            <td
              class="tit td1"
              colspan="2"
            >管理费
              <a-icon
                type="edit"
                style="color:red;cursor:pointer;margin-left:30px;font-size:18px"
                v-has="'wxhr:tagent_edit'"
                v-if="status == 0"
                @click="handleEditManage"
              />

            </td>
            <td class="td1">{{ settlementhFormInfo.management ? settlementhFormInfo.management : settlementhFormInfo.management }}</td>

            <td class="td1">{{ settlementhFormInfo.managementTicket ? settlementhFormInfo.managementTicket : settlementhFormInfo.managementTicket }}</td>
          </tr>

          <tr class="tr1">
            <td
              class="tit td1"
              colspan="3"
            >开票金额合计</td>
            <td class="td1">{{ settlementhFormInfo.settleMoney }}</td>
          </tr>

          <tr class="tr1">
            <td class="tit td1">备注</td>
            <td
              class="td1"
              colspan="3"
              v-if="status == 0"
            >
              <input
                style="border-radius:5px;border:1px solid gray;width:100%"
                :value="settlementhFormInfo.remark"
                v-has="'wxhr:tagent_edit'"
                @blur="blurSettleRemark"
              >
            </td>
            <td
              class="td1"
              colspan="3"
              v-else
            >
              {{ settlementhFormInfo.remark }}
            </td>
          </tr>

        </table>
      </div>

    </a-card>
    <a-card>
      <div class="tabDiv">
        <table
          class="table1"
          style="margin-top:30px"
        >
          <tr class="tr1">
            <td class="tit td1">发票类型</td>
            <td class="tit td1">扣除金额</td>
            <td class="tit td1">不含税金额</td>
            <td class="tit td1">税额</td>
            <td class="tit td1">发票合计金额 </td>
          </tr>
          <tr class="tr1">
            <td class="td1">
              普通发票
            </td>
            <td class="td1">
              <input
                style="border-radius:5px;border:1px solid gray;width:100%"
                :value="settlementhFormInfo.oneMoney"
                v-if="status == 0"
                v-has="'wxhr:tagent_edit'"
                @blur="blurSettleTick('oneMoney',$event)"
              >
              <span v-else>{{ settlementhFormInfo.oneMoney }}</span>
            </td>
            <td class="td1">
              <input
                style="border-radius:5px;border:1px solid gray;width:100%"
                :value="settlementhFormInfo.oneIncome"
                v-if="status == 0"
                v-has="'wxhr:tagent_edit'"
                @blur="blurSettleTick('oneIncome',$event)"
              >
              <span v-else>{{ settlementhFormInfo.oneIncome }}</span>
            </td>
            <td class="td1">
              <input
                style="border-radius:5px;border:1px solid gray;width:100%"
                :value="settlementhFormInfo.oneTax"
                v-if="status == 0"
                v-has="'wxhr:tagent_edit'"
                @blur="blurSettleTick('oneTax',$event)"
              >
              <span v-else>{{ settlementhFormInfo.oneTax }}</span>
            </td>
            <td class="td1">
              <span>{{ settlementhFormInfo.oneTicket }}</span>
            </td>
          </tr>
          <tr class="tr1">
            <td class="td1">
              专用发票
            </td>
            <td class="td1">
              <input
                style="border-radius:5px;border:1px solid gray;width:100%"
                :value="settlementhFormInfo.twoMoney"
                v-if="status == 0"
                v-has="'wxhr:tagent_edit'"
                @blur="blurSettleTwoMoney"
              >
              <span v-else>{{ settlementhFormInfo.twoMoney }}</span>
            </td>
            <td class="td1">
              <input
                style="border-radius:5px;border:1px solid gray;width:100%"
                :value="settlementhFormInfo.twoIncome"
                v-if="status == 0"
                v-has="'wxhr:tagent_edit'"
                @blur="blurSettleTwoincome"
              >
              <span v-else>{{ settlementhFormInfo.twoIncome }}</span>
            </td>
            <td class="td1">
              <input
                style="border-radius:5px;border:1px solid gray;width:100%"
                :value="settlementhFormInfo.twoTax"
                v-if="status == 0"
                v-has="'wxhr:tagent_edit'"
                @blur="blurSettleTwotax"
              >
              <span v-else>{{ settlementhFormInfo.twoTax }}</span>
            </td>
            <td class="td1">
              <span>{{ settlementhFormInfo.twoTicket }}</span>
            </td>
          </tr>
          <tr class="tr1">
            <td class="tit td1">公司地址</td>
            <td class="tit td1">纳税识别号</td>
            <td class="tit td1">公司开户号</td>
            <td class="tit td1">账户</td>
            <td class="tit td1">联系电话</td>
          </tr>
          <tr class="tr1">
            <td class="td1">
              {{ settlementhFormInfo.addr }}
            </td>
            <td class="td1">
              {{ settlementhFormInfo.taxpayerIdentificationNo }}
            </td>
            <td class="td1">
              {{ settlementhFormInfo.bankName }}
            </td>
            <td class="td1">
              <span>{{ settlementhFormInfo.bankNo }}</span>
            </td>
            <td class="td1">
              <span>{{ settlementhFormInfo.phone }}</span>
            </td>
          </tr>
        </table>
      </div>

    </a-card>

    <a-modal
      title="修改管理费"
      :width="600"
      placement="right"
      :closable="true"
      @cancel="handleCancelManage"
      @ok="handleOkMange"
      cancelText="取消"
      okText="保存"
      :visible="manageVisible"
      :confirmLoading="manageLoading"
    >
      <a-form :form="manageForm">

        <a-form-item
          label="金额"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
        >
          <a-input
            style="width: 191px"
            v-decorator="['management', { rules: [{required: true, pattern:/^(-?)[0-9]+(.[0-9]{1,2})?$/,message: '请输入正确金额!' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
export default {
  name: 'AgencySettleAccountModal',
  data() {
    return {
      columns:[
        {
          title:'结算主体',
          dataIndex:'settleDepartName'
        },
        {
          title:'结算编码名称',
          dataIndex:'settleDepartNo',
        },
        {
          title:'结算时间',
          dataIndex:'settleMonth'
        },
        {
          title:'皖信盖章',
        }
      ],
      balanceColumns:[
        {
          title:'月份',
          dataIndex:'month'
        },
        {
          title:'姓名',
          dataIndex:'name'
        },
        {
          title:'项目',
          dataIndex:'project'
        },
        {
          title:'金额',
          dataIndex:'money'
        },
        {
          title: '原因',
          dataIndex: 'cause',
          ellipsis: true,
          width:300,
          customRender:(text) => {
              const str = text ? text : '-'
              return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        }
      ],
      url:{
        editManageUrl: '/hrSocial/tagent'
      },
      manageVisible:false,
      manageForm:this.$form.createForm(this),
      salaryInfo:[],
      withholdData:[],
      balanceData:[],
      settleDeail:{},
      manageLoading: false
    }
  },
  props: {
    settlementhFormInfo:{
      type:Object,
      required:true
    },
    status
  },
  methods:{
    // 结算单页面的tab展示
    show(){
    },
    // 修改备注
    //修改备注
    blurSettleRemark(e){
      this.settleRemark = e.target.value
      if(e.target.value){
        const formData = {
          remark:'',
          idd:''
        }
        formData.remark = e.target.value
        formData.id = this.settlementhFormInfo.id
        httpAction(this.url.editManageUrl, formData, 'PUT').then((res) => {
          if(res.code == 200){
            this.$message.success("修改成功")
            this.settlementhFormInfo.remark = e.target.value
          }
        })
      }else{
        this.settlementhFormInfo.remark = e.target.value
      }
    },
    //管理费
    handleEditManage(){
      this.manageVisible = true
      this.manageForm.resetFields()
      this.$nextTick(() => {
        this.manageForm.setFieldsValue(pick({management:this.settlementhFormInfo.management},'management'))
      })
    },
    handleCancelManage(){
      this.manageVisible = false
    },
    // 修改管理费
    handleOkMange(){
      this.manageForm.validateFields((err,values) => {
        if(!err){
          let less =  parseFloat(values.management) - parseFloat(this.settlementhFormInfo.management)
          let settleMoney = (parseFloat(this.settlementhFormInfo.settleMoney) + parseFloat(less)).toFixed(2)
          const params = {
            'settleMoney':settleMoney,
            'management':values.management,
            'managementTicket': values.management,
            'id':this.settlementhFormInfo.id,
            'twoMoney':'0',
            'twoTax':'0',
            'twoIncome':values.management,
            'twoTicket':values.management
          }
          httpAction(this.url.editManageUrl, params, 'PUT').then((res) => {
          if(res.code === 200){
            this.settlementhFormInfo.management = values.management
            this.settlementhFormInfo.settleMoney = settleMoney
            this.settlementhFormInfo.twoMoney = 0
            this.settlementhFormInfo.twoTax = 0
            this.settlementhFormInfo.twoIncome = values.management
            this.settlementhFormInfo.twoTicket = values.management
            this.settlementhFormInfo.managementTicket = values.management
            this.manageVisible = false
            this.$message.success("修改成功")
          }
        })
        }
      })
    },
    // 删除数组中指定元素
    removeArr(arr,val){
      for(let i=0;i<arr.length;i++){
        if(String(arr[i]) === String(val)){
          arr.splice(i,1)
          break
        }
      }
      return arr
    },
    blurSettleTick(type,event){
      const val = event.target.value
      if(val){
        const fieldArr = ['oneMoney','oneIncome','oneTax']
        const remain = this.removeArr(fieldArr,type)
        const formData = {}
        formData[type] = val
        formData.id = this.settlementhFormInfo.id
        formData.oneTicket = (parseFloat(val) + parseFloat(this.settlementhFormInfo[remain[0]]) + parseFloat(this.settlementhFormInfo[remain[1]])).toFixed(2)
        httpAction(this.url.editManageUrl, formData, 'PUT').then((res) => {
          if(res.code === 200){
            this.$message.success("修改成功")
            this.settlementhFormInfo[type] = val
            this.settlementhFormInfo.oneTicket = formData.oneTicket
          }
        })
      }else{
        this.settlementhFormInfo[type] = val
      }
    },
    blurSettleTwoincome(e){
      const twoIncome = e.target.value
      if(e.target.value){
        const formData = {
          twoIncome:'',
          twoTicket:'',
          id:''
        }
        formData.twoIncome = twoIncome
        formData.twoTicket = (parseFloat(twoIncome) + parseFloat(this.settlementhFormInfo.twoTax) + parseFloat(this.settlementhFormInfo.twoMoney)).toFixed(2)
        formData.id = this.settlementhFormInfo.id
        httpAction(this.url.editManageUrl, formData, 'PUT').then((res) => {
          if(res.code == 200){
            this.$message.success("修改成功")
            this.settlementhFormInfo.twoIncome = e.target.value
            this.settlementhFormInfo.twoTicket = formData.twoTicket
          }
        })
      }else{
        this.settlementhFormInfo.twoIncome = e.target.value || 0
      }
    },
    blurSettleTwoMoney(e){
      const val = e.target.value
      if(val){
        const formData = {twoMoney:'',twoTicket:'',id:''}
        formData.twoMoney = val
        formData.twoTicket = (parseFloat(val) + parseFloat(this.settlementhFormInfo.twoTax) + parseFloat(this.settlementhFormInfo.twoIncome)).toFixed(2)
        formData.id = this.settlementhFormInfo.id
        httpAction(this.url.editManageUrl, formData, 'PUT').then((res) => {
          if(res.code == 200){
            this.$message.success("修改成功")
            this.settlementhFormInfo.twoMoney = val
            this.settlementhFormInfo.twoTicket = formData.twoTicket
          }
        })
      }else{
        this.settlementhFormInfo.twoMoney = 0
      }
    },
    blurSettleTwotax(e){
      let twoTax = e.target.value
      if(e.target.value){
        const formData = {
          twoTax:'',
          twoTicket:'',
          id:''
        }
        formData.twoTax = twoTax
        formData.twoTicket = (parseFloat(twoTax) + parseFloat(this.settlementhFormInfo.twoIncome) + parseFloat(this.settlementhFormInfo.twoMoney)).toFixed(2)
        formData.id = this.settlementhFormInfo.id
        httpAction(this.url.editManageUrl, formData, 'PUT').then((res) => {
          if(res.code == 200){
            this.$message.success("修改成功")
            this.settlementhFormInfo.twoTax = e.target.value
            this.settlementhFormInfo.twoTicket = formData.twoTicket
          }
        })
      }else{
        this.settlementhFormInfo.twoTax = e.target.value || 0
      }
    },
    // 应缴单位社保
    blurSettleunitSocial(e){
      let unitSocial = e.target.value
      if(e.target.value){
        let formData = {}
        formData.unitSocial = unitSocial
        formData.unitSocialTicket = unitSocial
        formData.oneMoneys = (parseFloat(unitSocial) + parseFloat(this.settlementhFormInfo.personSocial) + parseFloat(this.settlementhFormInfo.unitFund) + parseFloat(this.settlementhFormInfo.personFund)).toFixed(2)
        formData.diffMoney = (parseFloat(this.settlementhFormInfo.socialSecurityCompanySum||0) + parseFloat(this.settlementhFormInfo.socialSecurityPersonalSum ||0 ) + parseFloat(this.settlementhFormInfo.providentCompanyDiff ||0)
                              + parseFloat(this.settlementhFormInfo.providentPersonalDiff ||0) + parseFloat(this.settlementhFormInfo.manageDiff ||0)  + parseFloat(this.settlementhFormInfo.otherDiff ||0 )).toFixed(2)
        formData.settleMoney = (parseFloat(formData.oneMoneys)  + parseFloat(this.settlementhFormInfo.management) - parseFloat(formData.diffMoney)).toFixed(2)
        formData.oneTicket = (parseFloat(formData.settleMoney)  - parseFloat(this.settlementhFormInfo.management)).toFixed(2)
        formData.id = this.settlementhFormInfo.id
        formData.oneMoney = formData.oneTicket
        formData.oneIncome = '0'
        formData.oneTax = '0'
        httpAction(this.url.editManageUrl, formData, 'PUT').then((res) => {
          if(res.code == 200){
            this.$message.success("修改成功")
            this.settlementhFormInfo.unitSocial = e.target.value
            this.settlementhFormInfo.unitSocialTicket = e.target.value
            this.settlementhFormInfo.oneTicket = formData.oneTicket
            this.settlementhFormInfo.oneMoney = formData.oneTicket
            this.settlementhFormInfo.oneIncome = 0
            this.settlementhFormInfo.oneTax = 0
            this.settlementhFormInfo.settleMoney = formData.settleMoney
          }
        })
      }else{
        this.settlementhFormInfo.unitSocial = e.target.value
      }
    },
    // 应缴个人社保
    blurSettlepersonSocial(e){
      let personSocial = e.target.value
      if(e.target.value){
        let formData = {}
        formData.personSocial = personSocial
        formData.personSocialTicket = personSocial
        formData.oneMoneys = (parseFloat(this.settlementhFormInfo.unitSocial) + parseFloat(personSocial) + parseFloat(this.settlementhFormInfo.unitFund) + parseFloat(this.settlementhFormInfo.personFund)).toFixed(2)
        formData.diffMoney = (parseFloat(this.settlementhFormInfo.socialSecurityCompanySum ||0) + parseFloat(this.settlementhFormInfo.socialSecurityPersonalSum||0) + parseFloat(this.settlementhFormInfo.providentCompanyDiff||0)
                              + parseFloat(this.settlementhFormInfo.providentPersonalDiff ||0) + parseFloat(this.settlementhFormInfo.manageDiff ||0)  + parseFloat(this.settlementhFormInfo.otherDiff ||0)).toFixed(2)
        formData.settleMoney = (parseFloat(formData.oneMoneys)  + parseFloat(this.settlementhFormInfo.management) - parseFloat(formData.diffMoney)).toFixed(2)
        formData.oneTicket = (parseFloat(formData.settleMoney)  - parseFloat(this.settlementhFormInfo.management)).toFixed(2)
        formData.id = this.settlementhFormInfo.id
        formData.oneMoney = formData.oneTicket
        formData.oneIncome = '0'
        formData.oneTax = '0'

        httpAction(this.url.editManageUrl, formData, 'PUT').then((res) => {
          if(res.code == 200){
            this.$message.success("修改成功")
            this.settlementhFormInfo.personSocial = e.target.value
            this.settlementhFormInfo.personSocialTicket = personSocial
            this.settlementhFormInfo.oneTicket = formData.oneTicket
            this.settlementhFormInfo.oneMoney = formData.oneTicket
            this.settlementhFormInfo.oneIncome = 0
            this.settlementhFormInfo.oneTax = 0
            this.settlementhFormInfo.settleMoney = formData.settleMoney
          }
        })
      }else{
        this.settlementhFormInfo.personSocial = e.target.value
      }
    },
    // 应缴单位公积金
    blurSettleunitFund(e){
      let unitFund = e.target.value
      if(e.target.value){
        let formData = {}
        formData.unitFund = unitFund
        formData.unitFundTicket = unitFund
        formData.oneMoneys = (parseFloat(this.settlementhFormInfo.unitSocial) + parseFloat(this.settlementhFormInfo.personSocial) + parseFloat(unitFund) + parseFloat(this.settlementhFormInfo.personFund)).toFixed(2)
        formData.diffMoney = (parseFloat(this.settlementhFormInfo.socialSecurityCompanySum ||0 ) + parseFloat(this.settlementhFormInfo.socialSecurityPersonalSum ||0) + parseFloat(this.settlementhFormInfo.providentCompanyDiff ||0)
                              + parseFloat(this.settlementhFormInfo.providentPersonalDiff ||0) + parseFloat(this.settlementhFormInfo.manageDiff ||0)  + parseFloat(this.settlementhFormInfo.otherDiff ||0)).toFixed(2)
        formData.settleMoney = (parseFloat(formData.oneMoneys)  + parseFloat(this.settlementhFormInfo.management) - parseFloat(formData.diffMoney)).toFixed(2)
        formData.oneTicket = (parseFloat(formData.settleMoney)  - parseFloat(this.settlementhFormInfo.management)).toFixed(2)
        formData.id = this.settlementhFormInfo.id
        formData.oneMoney = formData.oneTicket
        formData.oneIncome = '0'
        formData.oneTax = '0'
        httpAction(this.url.editManageUrl, formData, 'PUT').then((res) => {
          if(res.code == 200){
            this.$message.success("修改成功")
            this.settlementhFormInfo.unitFund = e.target.value
            this.settlementhFormInfo.unitFundTicket = e.target.value
            this.settlementhFormInfo.oneTicket = formData.oneTicket
            this.settlementhFormInfo.oneMoney = formData.oneTicket
            this.settlementhFormInfo.oneIncome = 0
            this.settlementhFormInfo.oneTax = 0
            this.settlementhFormInfo.settleMoney = formData.settleMoney
          }
        })
      }else{
        this.settlementhFormInfo.unitFund = e.target.value
      }
    },
    // 应缴个人公积金
    blurSettlepersonFund(e){
      let personFund = e.target.value
      if(e.target.value){
        let formData = {}
        formData.personFund = personFund
        formData.personFundTicket = personFund
        formData.oneMoneys = (parseFloat(this.settlementhFormInfo.unitSocial) + parseFloat(this.settlementhFormInfo.personSocial) + parseFloat(this.settlementhFormInfo.unitFund) + parseFloat(personFund)).toFixed(2)
        formData.diffMoney = (parseFloat(this.settlementhFormInfo.socialSecurityCompanySum ||0) + parseFloat(this.settlementhFormInfo.socialSecurityPersonalSum ||0) + parseFloat(this.settlementhFormInfo.providentCompanyDiff ||0)
                              + parseFloat(this.settlementhFormInfo.providentPersonalDiff ||0) + parseFloat(this.settlementhFormInfo.manageDiff ||0)  + parseFloat(this.settlementhFormInfo.otherDiff ||0)).toFixed(2)
        formData.settleMoney = (parseFloat(formData.oneMoneys)  + parseFloat(this.settlementhFormInfo.management) - parseFloat(formData.diffMoney)).toFixed(2)
        formData.oneTicket = (parseFloat(formData.settleMoney)  - parseFloat(this.settlementhFormInfo.management)).toFixed(2)
        formData.id = this.settlementhFormInfo.id
        formData.oneMoney = formData.oneTicket
        formData.oneIncome = '0'
        formData.oneTax = '0'
        httpAction(this.url.editManageUrl, formData, 'PUT').then((res) => {
          if(res.code == 200){
            this.$message.success("修改成功")
            this.settlementhFormInfo.personFund = e.target.value
            this.settlementhFormInfo.personFundTicket = e.target.value
            this.settlementhFormInfo.oneTicket = formData.oneTicket
            this.settlementhFormInfo.oneMoney = formData.oneTicket
            this.settlementhFormInfo.oneIncome = 0
            this.settlementhFormInfo.oneTax = 0
            this.settlementhFormInfo.settleMoney = formData.settleMoney
          }
        })
      }else{
        this.settlementhFormInfo.personFund = e.target.value
      }
    },
    blurSettlepersonNum(e){
      let personNum = e.target.value
      if(e.target.value){
        if(!new RegExp(/((^[1-9]\d*)|^0)$/).test(personNum)){
          this.$message.warning('服务人数只能输入正整数')
          e.target.value = parseInt(e.target.value)>0?parseInt(e.target.value):0
          return false
        }
        let formData = {}
        formData.personNum = personNum
        formData.id = this.settlementhFormInfo.id
        httpAction(this.url.editManageUrl, formData, 'PUT').then((res) => {
          if(res.code == 200){
            this.$message.success("修改成功")
            this.settlementhFormInfo.personNum = e.target.value
          }
        })
      }else{
        this.settlementhFormInfo.personNum = e.target.value
      }
    },
    blurSettlepersonCount(e){
      let personCount = e.target.value
      if(e.target.value){
        if(!new RegExp(/((^[1-9]\d*)|^0)$/).test(personCount)){
          this.$message.warning('服务人次只能输入正整数')
          e.target.value = parseInt(e.target.value)>0?parseInt(e.target.value):0
          return false
        }
        let formData = {}
        formData.personCount = personCount
        formData.id = this.settlementhFormInfo.id
        httpAction(this.url.editManageUrl, formData, 'PUT').then((res) => {
          if(res.code == 200){
            this.$message.success("修改成功")
            this.settlementhFormInfo.personCount = e.target.value
          }
        })
      }else{
        console.log('没有输入')
        this.settlementhFormInfo.personCount = e.target.value
      }
    },
    // 处理表格中显示的数字
    handleTextShow(text){
      let result = text
      if(text){
        result = parseFloat(text*-1).toFixed(2)
      }else if(text === null || text === undefined) {
        result = '-'
      }
      return result
    }
  }
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
  width: 90%;
  border-collapse: collapse;
  border-spacing: 0;
  margin: 10px auto 30px;
}
.table1 .tr1 {
  margin: 0px;
  padding: 0;
  width: 100%;
}
.table1 .td1 {
  border: solid #999 1px;
  margin-left: 10px;
  height: 40px;
  padding: 10px;
  width: 20%;
  color: #000;
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
  font-weight: bolder;
  background-color: #ddd;
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
.tabDiv {
  box-shadow: 0 0 1px 1px #aaa, 3px 0 5px 0 #aaa, 0 4px 7px 0 #aaa;
  border: 1px solid;
  width: 100%;
  margin: 44px auto;
}
.tabDiv h2 {
  text-align: center;
  margin-top: 10px;
}
</style>
