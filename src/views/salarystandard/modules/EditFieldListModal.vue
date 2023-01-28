<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      :width="1300"
      okText="开始导入"
      cancelText="上一步"
      @ok="handleOk"
      :maskClosable="false"
      :destroyOnClose="true"
      :closable="false"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form
        :form="form"
        layout="inline"
        class="form"
      >
        <a-table
          bordered
          rowKey="empIdcard"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
        >
          
          <template
            slot="bankName"
            slot-scope="text, record, index"
          >
            <a-form-item v-if="!record.empId">
              <a-input class="input" v-decorator="[`bankName[${index}]`,{initialValue:text}]"/>
            </a-form-item>
            <span v-else>
              <a-tooltip :title="text">
                {{ text }}
              </a-tooltip>
            </span>
          </template>
          <template
            slot="bankNo"
            slot-scope="text, record, index"
          >
            <a-form-item v-if="!record.empId">
              <a-input class="input" v-decorator="[`bankNo[${index}]`,{initialValue:text}]"/>
            </a-form-item>
            <span v-else>
              <a-tooltip :title="text">
                {{ text }}
              </a-tooltip>
            </span>
          </template>
          <template
            slot="taxMonth"
            slot-scope="text, record, index"
          >
            <a-form-item v-if="!record.empId">
              <j-month format="YYYYMM" :disabledDate="disabledDate" :triggerChange="true" v-decorator="[`taxMonth[${index}]`,{initialValue:text}]"/>
            </a-form-item>
            <span v-else>
              <a-tooltip :title="text">
                {{ text }}
              </a-tooltip>
            </span>
          </template>
          <template
            slot="empPhone"
            slot-scope="text, record, index"
          >
            <a-form-item v-if="!record.empId">
              <a-input 
                class="input" 
                v-decorator="[`empPhone[${index}]`,{initialValue:text}]"
              />
            </a-form-item>
            <span v-else>
              <a-tooltip :title="text">
                {{ text }}
              </a-tooltip>
            </span>
          </template>
          <!-- <template
            slot="salaryTaxFlag"
            slot-scope="text, record, index"
          >
            <a-form-item>
              <a-switch v-decorator="[`salaryTaxFlag[${index}]`,{initialValue:text,valuePropName: 'checked'}]"/>
            </a-form-item>
          </template> -->
          <template
            slot="isDeductSocial"
            slot-scope="text, record, index"
          >
            <a-form-item>
              <a-switch v-decorator="[`isDeductSocial[${index}]`,{initialValue:text,valuePropName: 'checked'}]"/>
            </a-form-item>
          </template>
          <template
            slot="isDeductFund"
            slot-scope="text, record, index"
          >
            <a-form-item>
              <a-switch v-decorator="[`isDeductFund[${index}]`,{initialValue:text,valuePropName: 'checked'}]"/>
            </a-form-item>
          </template>
          <template
            slot="salaryStyle"
            slot-scope="text, record, index"
          >
            <a-form-item>
              <a-select v-decorator="[`salaryStyle[${index}]`,{initialValue:Number(text)}]">
                <a-select-option :value="i" v-for="(item,i) in salaryStyleOption" :key="i">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </template>
          <template
            slot="salaryGiveTime"
            slot-scope="text, record, index"
          >
            <a-form-item>
              <a-select v-decorator="[`salaryGiveTime[${index}]`,{initialValue:Number(text)}]">
                <a-select-option :value="0">立即发</a-select-option>
                <a-select-option :value="1">暂停发</a-select-option>
              </a-select>
            </a-form-item>
          </template>
          
          <template
            slot="operation"
            slot-scope="text, record,index"
            v-if="!record.empId"
          >
            <a @click="handleSave(record,index)">保存</a>
          </template>
        </a-table>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import { httpAction } from '@/api/manage'
  import JMonth from '@/components/jeecg/JMonth'
  import moment from "moment"

  export default {
    name:'EditFieldListModal',
    components: {
      JMonth
    },
    data() {
      return {
        title: '报表制作',
        visible: false,
        confirmLoading: false,
        salaryStyleOption:['现金','银行'],
        dataSource:[],
        settleDepartInfo:{},
        form:this.$form.createForm(this),
        validatorRules:{
          empPhone:{rules: [{ validator: this.validatePhone }]},
        },
        columns:[
          {
            title: '员工性质',
            width: 80,
            ellipsis: true,
            align: 'center',
            key: 'empId',
            dataIndex: 'empId',
            customRender: text => {
              const resultText = text ? '老员工' : '新员工'
              return (
                <a-tooltip placement="topLeft" title={resultText}>{resultText}</a-tooltip>
              )
            }
          },
          {
            title: '姓名',
            width: 60,
            ellipsis: true,
            align: 'center',
            key: 'empName',
            dataIndex: 'empName',
            customRender: text => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            }
          },
          {
            title: '身份证号',
            align: 'center',
            width: 120,
            ellipsis: true,
            key: 'empIdcard',
            dataIndex: 'empIdcard',
            customRender: text => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            }
          },
          {
            title: '开户行',
            width: 80,
            ellipsis: true,
            align: 'center',
            key: 'bankName',
            dataIndex: 'bankName',
            scopedSlots: { customRender: 'bankName' },
          },
          {
            title: '银行卡号',
            width: 80,
            ellipsis: true,
            align: 'center',
            key: 'bankNo',
            dataIndex: 'bankNo',
            scopedSlots: { customRender: 'bankNo' },
          },
          {
            title: '计税月份',
            width: 110,
            ellipsis: true,
            align: 'center',
            key: 'taxMonth',
            dataIndex: 'taxMonth',
            scopedSlots: { customRender: 'taxMonth' },
          },
          {
            title: '手机号码',
            align: 'center',
            width: 80,
            ellipsis: true,
            key: 'empPhone',
            dataIndex: 'empPhone',
            scopedSlots: { customRender: 'empPhone' }
          },
          {
            title: '发放方式',
            width: 80,
            ellipsis: true,
            align: 'center',
            key: 'salaryStyle',
            dataIndex: 'salaryStyle',
            scopedSlots: { customRender: 'salaryStyle' },
            // customRender: text => {
            //   const res = this.salaryStyleOption[text]
            //   return (
            //     <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            //   )
            // }
          },
          // {
          //   title: '薪资扣税',
          //   width: 100,
          //   ellipsis: true,
          //   align: 'center',
          //   key: 'salaryTaxFlag',
          //   dataIndex: 'salaryTaxFlag', // 1
          //   scopedSlots: { customRender: 'salaryTaxFlag' },
          // },
          {
            title: '扣除社保',
            width: 100,
            ellipsis: true,
            align: 'center',
            key: 'isDeductSocial',
            dataIndex: 'isDeductSocial', // 1
            scopedSlots: { customRender: 'isDeductSocial' },
          },
          {
            title: '扣除公积金',
            width: 110,
            ellipsis: true,
            align: 'center',
            key: 'isDeductFund',
            dataIndex: 'isDeductFund', // 1
            scopedSlots: { customRender: 'isDeductFund' },
          },
          {
            title: '工资发放时间',
            width: 120,
            ellipsis: true,
            align: 'center',
            key: 'salaryGiveTime',
            dataIndex: 'salaryGiveTime',
            scopedSlots: { customRender: 'salaryGiveTime' },
            // customRender: text => {
            //   const res = Number(text) ? '暂停发' : '立即发'
            //   return (
            //     <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            //   )
            // }

          },
          {
            title: '操作',
            width: 120,
            ellipsis: true,
            align: 'center',
            dataIndex: 'operation',
            key: 'operation',
            scopedSlots: { customRender: 'operation' },
          }
        ],
      }
    },
    methods: {
      disabledDate:(current)=>{
        return current && current > moment().endOf('day');
      },
      show(record,settleDepartInfo) {
        this.visible = true
        this.settleDepartInfo = settleDepartInfo
        this.dataSource = record.map(item=>{
          // item.salaryTaxFlag = (item.salaryTaxFlag === null || Number(item.salaryTaxFlag) === 1) ? true : false
          item.isDeductSocial = (item.isDeductSocial === null || Number(item.isDeductSocial) === 1) ? true : false
          item.isDeductFund = (item.isDeductFund === null || Number(item.isDeductFund) === 1) ? true : false
          return item
        })
      },
      changeInput(e,index){
        console.log(e,index)
      },
      changeSwitch(e,index){
        console.log(e,index)
      },
      handleSave(record,index){
        const bankNames = this.form.getFieldValue('bankName')
        const bankNos = this.form.getFieldValue('bankNo')
        const taxMonths = this.form.getFieldValue('taxMonth')
        const empPhones = this.form.getFieldValue('empPhone')
        const salaryGiveTimes = this.form.getFieldValue('salaryGiveTime')
        const salaryStyles = this.form.getFieldValue('salaryStyle')
        if(String(salaryStyles[index]) === '1'){
          if(!bankNames[index] || !bankNos[index]){
            this.$message.warning('开户行和银行卡号必填!')
            return false
          }
        }
        
        if(record.salaryGiveTime === '0'){
          if(!bankNames[index] || !bankNos[index] || !taxMonths[index]|| !empPhones[index]){
            this.$message.warning('开户行、银行卡号、计税月份、手机号码必填!')
            return false
          }
        }
        
        let url = `/salary/salaryTwo/saveEmpInfo?settleId=${this.settleDepartInfo.settleId}`
        let params = {
          empBankName:bankNames[index],
          empBankNo:bankNos[index],
          empIdcard:this.dataSource[index]['empIdcard'],
          empPhone:empPhones[index],
          taxationMonth:taxMonths[index],
          empName:this.dataSource[index]['empName'],
          salaryGiveTime:salaryGiveTimes[index],
          salaryStyle:salaryStyles[index],
        }
        if(record.empId){
          url = `/hrBase/temployeeinfo/updateEmpBankInfoById`
          params = Object.assign(params,{id:this.dataSource[index]['empId']})
        }
        httpAction(url,params,'post').then(res=>{
          if(res.code === 200){
            const obj = Object.assign(this.dataSource[index],{empId:res.data.id,bankName:res.data.empBankName,taxMonth:taxMonths[index],bankNo:res.data.empBankNo,empPhone:res.data.empPhone})
            this.$set(this.dataSource,index,obj)
            this.$message.success('保存成功')
          }else{
            this.$message.warning(res.msg)
          }
        }).finally(()=>{
          return true
        })
      },

      handleOk() {
        let params = []
        const fields = this.form.getFieldsValue()
        let flag = true
        try{
          // 检测手机号是否重复
          // const objMap = {}
          this.dataSource.forEach((item,index) =>{
            // eslint-disable-next-line
            const temp = _.cloneDeep(item)
            if(!item.empId){
              if(item.salaryStyle === '1'){
                if(!fields.bankName[index] || !fields.bankNo[index]){
                  flag = false;
                  throw `第${index+1}行开户行和银行卡号必填!`;
                }
              }
              if(item.salaryGiveTime === '0'){
                if(!fields.bankName[index] || !fields.bankNo[index] || !fields.taxMonth[index] || !fields.empPhone[index]){
                  flag = false;
                  throw `第${index+1}行开户行、银行卡号、计税月份、手机号码必填!`;
                }
              }
              temp.bankName = fields.bankName[index]
              temp.bankNo = fields.bankNo[index]
              temp.empPhone = fields.empPhone[index]
              temp.taxMonth = fields.taxMonth[index]
              temp.salaryGiveTime = fields.salaryGiveTime[index]
              temp.salaryStyle = fields.salaryStyle[index]
            }
            // objMap[temp.empPhone] = temp.empPhone
            temp.isDeductFund = fields.isDeductFund[index] ? '1' : '0'
            temp.isDeductSocial = fields.isDeductSocial[index] ? '1' : '0'
            temp.salaryTaxFlag = '1';
            temp.salaryGiveTime = fields.salaryGiveTime[index]
            temp.salaryStyle = fields.salaryStyle[index]
            params[index] = temp
            
          })
          
        }catch(e){
          console.log(e);
          this.$message.warning(e);
        }
        
        if(flag){
          this.confirmLoading = true
          httpAction('/salary/salaryTwo/secondUpload',params,'post',300000).then(res=>{
            if(res.code === 200){
              this.$message.success('导入成功')
              this.handleCancel()
              this.$emit('ok',1)
            }else if(res.code==2){
              const htm = res.data.replace(/\|\|/g,'<br/>')
              this.$warning({
                title: res.msg,
                width:'520px',
                content: (
                  <p ref='error' style="line-height:25px;"></p>
                ),
              });
              this.$nextTick(()=>{
                this.$refs && (this.$refs.error.innerHTML = htm)
              })
              
            }else{
              this.$message.warning(res.msg)
            }
          }).finally(()=>{
            this.confirmLoading = false
          })
        }
      },
      handleCancel() {
        this.visible = false
      },
    }
  }
</script>

<style lang="less" scoped>
  .form{
    :global(td) {
      padding:10px 10px;
      font-size: 13px;
    }
    :global(th) {
      font-size: 13px;
      padding:10px 10px;
    }
    :global(.ant-form-item) {
      margin: 0px;
    }
  }
</style>
