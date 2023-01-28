<template>
  <a-modal
    :title="title"
    :width="900"
    placement="right"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="保存"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="成本名称"
              class="stepFormText"
            >
              <a-input
                style="width:250px"
                placeholder="请输入成本名称"
                v-decorator="['costName',validatorRules.costName]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="申请金额"
              class="stepFormText"
            >
              <a-input
                style="width:250px"
                placeholder="请输入申请金额"
                v-decorator="['costAmount',validatorRules.costAmount]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="申请单位"
              class="stepFormText"
            >
              <a-select
                style="width:250px"
                placeholder="请选择申请单位"
                @change="organChange"
                v-decorator="['applyOrgan',validatorRules.applyOrgan]"
              >
                <a-select-option
                  v-for="(item, index) in organs"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.organName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="结算主体"
              class="stepFormText"
            >
              <a-select
                style="width:250px"
                placeholder="请选择结算主体"
                :showSearch="true"
                optionFilterProp="children"
                :notFoundContent="null"
                :defaultActiveFirstOption="false"
                :showArrow="false"
                :filterOption="false"
                @change="settleDomainChange"
                @search="handleSearch"
                v-decorator="['settleDomainId',validatorRules.settleDomainId]"
              >
                <a-select-option
                  v-for="d in settleDomains"
                  :key="d.id"
                  :value="d.id"
                >{{ d.departName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="来源类型"
              class="stepFormText"
            >
              <a-select
                style="width:250px"
                placeholder="请选择来源类型"
                v-decorator="['fromType',validatorRules.fromType]"
              >
                <a-select-option
                  v-for="d in fromTypeOption"
                  :key="d.id"
                  :value="d.value"
                >{{ d.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="客户单位"
              class="stepFormText"
            >
              <a-input
                disabled
                style="width:250px"
                placeholder="请选择客户单位"
                v-decorator="['customerName']"
              />
              <a-input
                type="hidden"
                style="width:250px"
                v-decorator="['customerId']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="付款方式"
              class="stepFormText"
            >
              <a-select
                style="width:250px"
                placeholder="请选择付款方式"
                @change="changePayType"
                v-decorator="['payType',validatorRules.payType]"
              >
                <a-select-option value="0">现金</a-select-option>
                <a-select-option value="1">银付</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="收款人"
              class="stepFormText"
            >
              <a-input
                style="width:250px"
                placeholder="请输入收款人"
                v-decorator="['payee',validatorRules.payee]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :span="12"
            v-if="isShow"
          >
            <a-form-item
              label="收款人开户银行"
              class="stepFormText"
            >
              <a-input
                style="width:250px"
                placeholder="请输入收款人开户银行"
                v-decorator="['payeeBankName',validatorRules.payeeBankName]"
              />
            </a-form-item>
          </a-col>
          <a-col
            :span="12"
            v-if="isShow"
          >
            <a-form-item
              label="收款人账号"
              class="stepFormText"
            >
              <a-input
                style="width:250px"
                placeholder="请输入收款人账号"
                v-decorator="['payeeBankNo',validatorRules.payeeBankNo]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="成本结算类型"
              class="stepFormText"
            >
              <a-select
                style="width:250px"
                placeholder="请选择成本结算类型"
                v-decorator="['settleType',validatorRules.settleType]"
              >
                <a-select-option
                  v-for="(item,index) in settleTypeOptions"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="用途说明"
              class="stepFormText"
            >
              <a-textarea
                style="resize:none;width:250px"
                :cols="35"
                placeholder="请填写用途说明"
                v-decorator="['useRemark',validatorRules.useRemark]"
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
import pick from 'lodash.pick'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'CostApplyModule',
  data() {
    return {
      title: '支出申请',
      visible: false,
      model: {},
      confirmLoading: false,
      isShow: true,
      form: this.$form.createForm(this),
      organs:[], //申请单位
      settleDomains: [], //结算主体
      settleTypeOptions:[],
      orgin:{organName:"",id:""},
      fromTypeOption:[],
      validatorRules: {
        settleDomainId: { rules: [{ required: true, message: '请选择结算主体!' }] },
        payee: { rules: [{ required: true, message: '收款人格式不正确',max:5 }] },
        payeeBankNo: { rules: [{required:false,message:'请输入收款银行账号!'},{pattern:/^([0-9]{1})(\d{9,24})$/,message: '银行账号必须是10到25位数字!' }] },
        payeeBankName: { rules: [{required:false,message:'请输入收款人开户银行!'},{ max:15, message: '收款人开户银行不超过15个字符!' }] },
        useRemark: { rules: [{ required: true, message: '请填写正确的用途说明!'},{max:50,message:'用途说明最多50个字符!'}] },
        applyOrgan: { rules: [{ required: true, message: '请选择申请单位!' }] },
        costAmount: { rules: [{ required: true,pattern:/(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/, message: '申请金额格式不正确!' }] },
        costName: { rules: [{ required: true, message: '请输入正确的成本名称!'},{max:20,message:'成本名称最多20个字符!'}] },
        fromType: { rules: [{ required: true, message: '请选择来源类型!' }] },
        payType: { rules: [{ required: true, message: '请选择付款方式!' }] },
        settleType: { rules: [{ required: true, message: '请选择成本结算类型!' }] },
      },
      url: {
        getOrgan: '/admin/organizationinfo/getUserAllOrgan',
        getSettleDomainList: '/hrBase/tsettledomain/getSettleDomainSelectVosDomainNameOrCode',
        submit:'/hrApproval/tcostinfo',
      }
    }
  },
  created() {
    this.getOrgans();
    this.initDictConfig()
  },
  methods: {
    
    edit(record) {
      this.visible = true
      this.form.resetFields()
      if(record){
        this.model = Object.assign(record,{applyOrgan:record.applyOrgan,customerId:record.customerId})
        this.changePayType(this.model.payType)
        this.settleDomains = [{id:record.settleDomainId,departName:record.departName}] //结算主体
        this.orgin = {id:record.applyOrgan,organName:record.applyUnitName} //申请单位
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'payType', 'fromType','costName','costAmount','customerName',
            'applyOrgan','useRemark','payeeBankName','payeeBankNo','payee','settleDomainId','customerId','settleType'))
        })
      }
    },
    changePayType(val,option){
      if(val == 1){
        this.isShow = true
        this.$set(this.validatorRules.payeeBankName.rules,0,{required:true,message:'请输入收款人开户银行!'})
        this.$set(this.validatorRules.payeeBankNo.rules,0,{required:true,message:'请输入收款人账号!'})
        // this.$set(this.validatorRules.payeeBankNo.rules[0],`required`,true)
      }else{
        this.isShow = false
        this.$set(this.validatorRules.payeeBankName.rules[0],`required`,false)
        this.$set(this.validatorRules.payeeBankNo.rules[0],`required`,false)
      }
      if(option){
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({payeeBankName:'',payeeBankNo:''}, 'payeeBankName','payeeBankNo'))
        })
      }

    },
    //申请单位
    getOrgans() {
      httpAction(this.url.getOrgan,'','GET').then((res) => {
        if(res.code === 200 && res.data.length > 0) {
          this.organs = res.data;
        }
      });
    },
    settleDomainChange(v) {
      for (const item of this.settleDomains) {
        if(item.id == v) {
          this.settleDomain = item
          break
        }
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({customerName:this.settleDomain.customerName,customerId:this.settleDomain.customerId}, 'customerName','customerId'))
      })
    },
    handleSearch(value) {
      this.settleDomains = [];
      httpAction(this.url.getSettleDomainList + "?departName=" + value + "&departNo=" + value,null,'GET').then((res) => {
        if(res.data != null && res.data.length > 0) {
          this.settleDomains = res.data;
        }
      });
    },
    organChange(value,option){
      this.orgin.organName = this.organs[option.key].organName
      this.orgin.id = this.organs[option.key].id
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({settleDomainId:undefined,customerName:'',customerId:''},'settleDomainId','customerName','customerId'))
      })
      this.settleDomains = []
    },
    
    handleOk() { //提交
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          let method = 'post'
          _this.confirmLoading = true
          values.applyOrgan = _this.orgin.id
          values.applyUnitName = _this.orgin.organName
          if(_this.model.id){
            values.id = _this.model.id
            method = 'put'
          }
          httpAction(_this.url.submit, values, method).then((res) => {
            if (res.code === 200) {
              _this.$message.success(res.msg)
              _this.close()
            } else {
              _this.$message.warning(res.msg)
            }
          }).finally(() => {
            _this.confirmLoading = false
          })
        }
      })
    },
    // 数据字典
    initDictConfig() {
      // 状态
      initDictOptions('cost_settle_type').then((res) => {
        if (res.code === 200) {
          this.settleTypeOptions = res.data
        }
      });
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.orgin={}
      this.model={}
      this.visible = false;
      this.$emit('ok');
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

.stepFormText {
  :global(.ant-form-item-label) {
    width: 120px;
  }
}
.ant-upload-drag-icon {
  width: 250px;
  text-align: center;
}
</style>