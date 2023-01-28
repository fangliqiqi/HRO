<template>
  <a-modal
    :title="title"
    :width="'90%'"
    placement="right"
    :closable="true"
    :footer="null"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    wrapClassName="dialogBig"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <div class="dialogBody">
        <a-row style="margin-bottom:15px">
          <a-col
            :span="2"
            :offset="22"
          >
            <a-switch
              checkedChildren="已结案"
              unCheckedChildren="办理中"
              @change="handleStatus"
              :checked="handleInsuranceStatus"
            />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="17">
            <ul class="record">
              <li
                v-for="(item,index) in detail.dealInfo"
                :key="index"
              >
                {{ index+1 }}、
                {{ moment(item.recordingDate).format("YYYY-MM-DD") }}

                {{ item.recordingContent }};
                <span v-if="item.payType != null">
                  理赔项目:{{ filterDictText(injuryClaimsFeeTypeDicts,item.payType) }};
                  理赔金额:{{ item.payFee }}元
                </span>
              </li>
            </ul>
          </a-col>
          <a-col
            :span="6"
            :offset="1"
          >
            <a-card>
              <p>累计成本支出</p>
              <h2>{{ detail.sumCostExpenditureFee }}元</h2>
            </a-card>
          </a-col>
        </a-row>

        <a-card
          :bordered="false"
          title="材料上交截止日期"
        >
          <a-form
            :form="deadlineForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col :span="24">
                <a-form-item label="选择日期">
                  <a-date-picker
                    placeholder="请选择日期"
                    :disabledDate="disabledDeadlineDate"
                    :disabled="disableSet"
                    style="width: 200px"
                    v-decorator="['lastInsuranceMaterialSubDate',validatorRules.lastInsuranceMaterialSubDate]"
                  />
                  （注意，设置后不可再次修改）
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="!disableSet">
              <a-col
                :span="2"
                :offset="2"
              >
                <a-button
                  type="primary"
                  @click="submitDeadline"
                >确认设置</a-button>
              </a-col>
            </a-row>
          </a-form>
        </a-card>

        <a-card
          :bordered="false"
          title="办理记录"
        >
          <a-form
            :form="handleRecordForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col :span="16">
                <a-form-item
                  label="记录日期"
                  class="stepFormText"
                >
                  <a-date-picker
                    placeholder="请选择记录日期"
                    style="width: 200px"
                    :disabledDate="disabledRecordDate"
                    v-decorator="['recordingDate',validatorRules.recordingDate]"
                  />
                </a-form-item>
                <a-form-item label="办理内容">
                  <a-textarea
                    rows="4"
                    cols="70"
                    style="resize:none"
                    placeholder="请填写具体的办理内容（必填项）"
                    v-decorator="['recordingContent',validatorRules.recordingContent]"
                  >
                  </a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="理赔费用"
                  class="stepFormText"
                >
                  <a-select
                    showSearch
                    placeholder="请选择理赔费用类型"
                    optionFilterProp="children"
                    :filterOption="filterOption"
                    style="width: 200px"
                    @select="onSelect"
                    v-decorator="['payType',validatorRules.payType]"
                  >
                    <a-select-option value="-1">无</a-select-option>
                    <a-select-option
                      v-for="(item, index) in injuryClaimsFeeTypeDicts"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="">
                  <a-input
                    v-if="show"
                    v-decorator="['payFee',validatorRules.payFee]"
                    style="width: 200px;margin-left:10px;"
                    placeholder="请填写理赔费用"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-button
                  class="textareaForm"
                  type="primary"
                  icon="plus"
                  @click="submitHandleRecord"
                >办理记录</a-button>
              </a-col>
            </a-row>
          </a-form>
        </a-card>

        <a-card
          :bordered="false"
          title="成本支出记录"
        >
          <a-form
            :form="costForm"
            layout="inline"
          >
            <a-row>
              <a-col
                :span="24"
                v-for="(item,index) in detail.costExpenditure"
                :key="index"
              >
                <a-form-item
                  label="成本支出"
                  class="stepFormText"
                >
                  <a-select
                    :defaultValue="item.costExpenditureType"
                    style="width: 200px"
                    disabled
                  >
                    <a-select-option
                      v-for="(items, indexs) in nonworkCostTypeDicts"
                      :key="indexs"
                      :value="items.value"
                    >{{ items.label }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item class="stepFormText">
                  <a-input
                    :value="item.costExpenditureFee"
                    disabled
                    style="width: 200px;margin-left:10px;"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col
                :span="24"
                v-for="(k) in costForm.getFieldValue('keys')"
                :key="k"
              >
                <a-form-item
                  label="成本支出"
                  class="stepFormText"
                >
                  <a-select
                    showSearch
                    placeholder="请选择成本支出类型"
                    optionFilterProp="children"
                    :filterOption="filterOption"
                    style="width: 200px"
                    v-decorator="[`costExpenditureType[${k}]`,{rules:[{required: true,message:'请选择成本支出类型'}]}]"
                  >
                    <a-select-option
                      v-for="(item, index) in nonworkCostTypeDicts"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item class="stepFormText">
                  <a-input
                    v-decorator="[
                      `costExpenditureFee[${k}]`,
                      {
                        validateTrigger: ['change', 'blur'],
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            pattern:/(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/,
                            message: '费用金额不正确',
                          },
                        ],
                      },
                    ]"
                    placeholder="请填写费用金额"
                    style="width: 200px;margin:0 10px;"
                  />
                  <a-icon
                    class="dynamic-delete-button"
                    type="plus"
                    v-if="k===0"
                    @click="() => add(k)"
                  />
                  <a-icon
                    class="dynamic-delete-button"
                    type="minus-circle-o"
                    v-if="k!==0"
                    :disabled="costForm.getFieldValue('keys').length === 1"
                    @click="() => remove(k)"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-top: 24px;">
              <a-col :span="4">
                <a-button
                  class="textareaForm"
                  type="primary"
                  icon="plus"
                  @click="submitCostRecord"
                >成本记录</a-button>
              </a-col>
            </a-row>
          </a-form>
        </a-card>

      </div>

      <a-modal
        title="伤残等级"
        :visible="handleVisible"
        :confirm-loading="handleConfirmLoading"
        @ok="handleSucess"
        @cancel="cancelEvent"
      >
        <a-form
          :form="handleForm"
          layout="inline"
        >
          <a-form-item label="请选择伤残等级">
            <a-select v-decorator="['disabilityLevel',{initialValue:''}]" style="width:100px">
              <a-select-option value="">无</a-select-option>
              <a-select-option value="1">1</a-select-option>
              <a-select-option value="2">2</a-select-option>
              <a-select-option value="3">3</a-select-option>
              <a-select-option value="4">4</a-select-option>
              <a-select-option value="5">5</a-select-option>
              <a-select-option value="6">6</a-select-option>
              <a-select-option value="7">7</a-select-option>
              <a-select-option value="8">8</a-select-option>
              <a-select-option value="9">9</a-select-option>
              <a-select-option value="10">10</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>

    </a-spin>
  </a-modal>
</template>
    
  
<script>

import moment from 'moment'
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import { filterDictText } from '@/components/dict/JDictSelectUtil'

let index = 0;
export default {
  name: 'NonworkClaimsModal',
  data() {
    return {
      id: '',
      model: {},
      title: '商险理赔',
      visible: false,
      handleVisible: false,
      handleConfirmLoading: false,
      confirmLoading: false,
      disableSet:false, //禁止设置材料截止日期
      handleInsuranceStatus:false, //商险办理状态
      detail:{},
      injuryClaimsFeeTypeDicts:[], //商险理赔费用类型
      nonworkCostTypeDicts:[], //工伤成本类型
      deadlineForm:this.$form.createForm(this),
      handleRecordForm:this.$form.createForm(this),
      handleForm:this.$form.createForm(this),
      flag:1,
      show:true,
      validatorRules: {
        lastInsuranceMaterialSubDate: { rules: [{ required: true, message: '请选择商险理赔材料上交截止日期!' }] },
        recordingDate: { rules: [{ required: true, message: '请选择记录日期日期!' }] },
        recordingContent: { rules: [{ required: true, message: '请填写具体的办理内容!' }] },
        payType: { rules: [{ required: true, message: '请选择理赔费用类型!' }] },
        payFee:{ rules: [{ required: true,message:'请输入理赔费用'},{pattern:/(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/, message: '理赔费用格式不正确!' }] },
        disabilityLevel:{rules: [{ required: true, message: '请选择伤残等级!' }]}
        // costExpenditureType: { rules: [{ required: true, message: '请选择成本支出类型!' }] },
        // costExpenditureFee: { rules: [{ required: true, message: '请输入成本支出费用!' }] },
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      url: {
        // getDetailById: '/hrEmergency/tworkinjuryevent/', //获取当条记录详情
        deadlineUrl:'/hrEmergency/tnonworkevent/lastInsuranceMaterialSubDate', //设置截止日期
        addRecordUrl:'/hrEmergency/tdealinfo', //添加记录
        batchAddCost:'/hrEmergency/tcostexpenditure/batchSave', //批量添加成本记录
        endInjury:'/hrEmergency/tnonworkevent/end/', //办结
      }
    }
  },
  beforeCreate() {
    this.costForm = this.$form.createForm(this, { name: 'costExpenditureType' });
    this.costForm.getFieldDecorator('keys', { initialValue: [0], preserve: true });
  },
  methods: {
    moment,
    filterDictText,
    edit(record) {
      this.id = record.id
      this.handleInsuranceStatus = (record.auditStatus == 7) ? true : false //商险办理状态
      this.visible = true
      if(record.lastInsuranceMaterialSubDate || record.lastMaterialSubDate){
        this.disableSet = true
        this.$nextTick(() => {
          this.deadlineForm.setFieldsValue(pick({lastInsuranceMaterialSubDate:moment(record.lastInsuranceMaterialSubDate || record.lastMaterialSubDate)}, 'lastInsuranceMaterialSubDate'))
        })
      }
    },
    onSelect(val){
      this.show = (val > -1) ? true : false
    },
    //设置截止时间
    submitDeadline(){
      this.deadlineForm.validateFields((err, values) => {
        if (!err) {
          let lastInsuranceMaterialSubDate = moment(values.lastInsuranceMaterialSubDate).format("YYYY-MM-DD")
          let param
          if(this.flag == 1){
            param = '&lastInsuranceMaterialSubDate='+lastInsuranceMaterialSubDate
          }else if(this.flag == 2 || this.flag == 3 || this.flag == 4 || this.flag == 5){
            param = '&lastMaterialSubDate='+lastInsuranceMaterialSubDate
          }

          httpAction(this.url.deadlineUrl+'?id='+this.id+param,null,'post').then((res) => {
            if(res.code == 200 ){
              this.disableSet = true
              this.$message.success('设置成功')
            }else{
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    //添加办理记录
    submitHandleRecord(){
      this.handleRecordForm.validateFields((err, values) => {
        if (!err) {
          if(this.flag == 1){
            values.nonWorkId = this.id
            values.payMainType = 1
          }else if(this.flag == 2){
            values.retiredWorkId = this.id
            values.payMainType = 0
          }else if(this.flag == 3){
            values.arbitrationId = this.id
            values.payMainType = 0
          }else if(this.flag == 4){
            values.litigationId = this.id
            values.payMainType = 0
          }else if(this.flag == 5){
            values.complaintId = this.id
            values.payMainType = 0
          }
          values.recordingDate = moment(values.recordingDate).format("YYYY-MM-DD HH:mm:ss")
          values.payType = (values.payType < 0) ? null : values.payType
          httpAction(this.url.addRecordUrl,values,'post').then((res)=>{
            if(res.code == 200 ){
              this.$message.success('保存成功')
              this.handleRecordForm.resetFields()
              this.detail.dealInfo.push({
                payFee:values.payFee,
                payType:values.payType,
                recordingContent:values.recordingContent,
                recordingDate:moment().format("YYYY-MM-DD")
              })
            }else{
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    //提交成本记录
    submitCostRecord(){
      this.costForm.validateFields((err, values) => {
        if(!err){
          let params = []
          let total = 0
          if(this.flag == 1){
            for (let item of values.keys){
              params.push({
                nonWorkId:this.id,
                costExpenditureType:values.costExpenditureType[item],
                costExpenditureFee:values.costExpenditureFee[item],
                payMainType:1
              })
              total = parseFloat(total) + parseFloat(values.costExpenditureFee[item])
            }
          }else if(this.flag == 2){
            for (let item of values.keys){
              params.push({
                retiredWorkId:this.id,
                costExpenditureType:values.costExpenditureType[item],
                costExpenditureFee:values.costExpenditureFee[item],
                payMainType:0
              })
              total = parseFloat(total) + parseFloat(values.costExpenditureFee[item])
            }
          }else if(this.flag == 3){
            for (let item of values.keys){
              params.push({
                arbitrationId:this.id,
                costExpenditureType:values.costExpenditureType[item],
                costExpenditureFee:values.costExpenditureFee[item],
                payMainType:0
              })
              total = parseFloat(total) + parseFloat(values.costExpenditureFee[item])
            }
          }else if(this.flag == 4){
            for (let item of values.keys){
              params.push({
                litigationId:this.id,
                costExpenditureType:values.costExpenditureType[item],
                costExpenditureFee:values.costExpenditureFee[item],
                payMainType:0
              })
              total = parseFloat(total) + parseFloat(values.costExpenditureFee[item])
            }
          }else if(this.flag == 5){
            for (let item of values.keys){
              params.push({
                complaintId:this.id,
                costExpenditureType:values.costExpenditureType[item],
                costExpenditureFee:values.costExpenditureFee[item],
                payMainType:0
              })
              total = parseFloat(total) + parseFloat(values.costExpenditureFee[item])
            }
          }
          
          httpAction(this.url.batchAddCost,params,'post').then((res)=>{
            if(res.code == 200){
              for(let item of params){
                if(this.detail.costExpenditure){
                  this.detail.costExpenditure.push(item)
                }else{
                  this.detail.costExpenditure = [item]
                }
              }
              this.detail.sumCostExpenditureFee = parseFloat(this.detail.sumCostExpenditureFee) + parseFloat(total)
              this.$message.success('保存成功')
              this.costForm.resetFields()
            }else{
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    // 办结
    handleStatus(checked){
      if(String(this.flag) === '0' || String(this.flag) === '1'){
        this.handleVisible = true
      }else{
        const _this = this
        if(checked){
          this.$confirm({
            title: '确认提交办结么?',
            content: '注意：提交后无法再次修改',
            onOk() {
              const type = (_this.flag > 1) ? 0 : 1
              httpAction(`${_this.url.endInjury}${type}/${_this.id}`,null,'post').then((res)=>{
                if(res.code === 200){
                  _this.$message.success('操作成功')
                  _this.handleInsuranceStatus = true
                  _this.handleCancel()
                }else{
                  _this.$message.error(res.msg)
                  _this.handleInsuranceStatus = false
                }
              })
            },
          });
        }
      }
    },
    // 提交办结
    handleSucess(){
      this.handleForm.validateFields((err, values) => {
        if (!err) {
          this.handleConfirmLoading = true
          let type = 1
          if(this.flag >= 2 && this.flag <= 5){
            type = 0 //退工
          }
          httpAction(`${this.url.endInjury}${type}/${this.id}?disabilityLevel=${values.disabilityLevel || ''}`,null,'post').then((res)=>{
            if(res.code === 200){
              this.$message.success('操作成功')
              this.handleInsuranceStatus = true
              this.cancelEvent()
              this.handleCancel()
            }else{
              this.$message.error(res.msg)
              this.handleInsuranceStatus = false
            }
          }).finally(()=>{
            this.handleConfirmLoading = false
          })
        }
      })
    },
    cancelEvent(){
      this.handleConfirmLoading = this.handleVisible = false
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('ok')
      this.costForm.resetFields()
      this.deadlineForm.resetFields()
      this.handleRecordForm.resetFields()
      this.detail={}
      this.disableSet=false
      this.visible = false
    },
    remove(k) {
      const { costForm } = this;
      const keys = costForm.getFieldValue('keys');
      costForm.setFieldsValue({
        keys: keys.filter(key => key !== k),
      });
    },
    add() {
      const { costForm } = this;
      const keys = costForm.getFieldValue('keys');
      const nextKeys = keys.concat(++index);
      costForm.setFieldsValue({
        keys: nextKeys,
      });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    disabledDeadlineDate(current){ //获取今天之前的时间
      return current < moment().startOf('day');
    },
    disabledRecordDate(current){
      return current > moment().endOf('day');
    },
  }
}
</script>
  
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}

.dialogBig .ant-card-wider-padding .ant-card-body {
  padding: 0px 5% !important;
}
.ant-skeleton-title {
  width: 50% !important;
}
.stepFormText {
  :global(.ant-form-item-label) {
    width: 75px;
  }
}
.textareaForm {
  margin-left: 75px;
}
.record {
  height: 127px;
  overflow-y: scroll;
  border: 1px solid #e8e8e8;
  margin-bottom: 0px;
  padding: 8px 15px;
}
.record li {
  list-style: none;
}
.dialogBody {
  height: 700px;
  overflow-y: scroll;
}
.wrapClass .ant-modal-footer {
  overflow: hidden;
}
.wrapClass .ant-form-item {
  margin-bottom: 0px !important;
}
</style>

