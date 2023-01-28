<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      :width="800"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="false"
      :destroyOnClose="true"
      :ok-button-props="{ props: { disabled: !isEdit } }"
    >
      <a-form :form="form">
        <a-row style="margin-bottom: 10px;" :gutter="24">
          <a-col :span="8">一级指标归属</a-col>
          <a-col :span="8">二级指标归属</a-col>
          <a-col :span="8">金额(元)</a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item>
              <a-input class="inputRow" :value="settleInfo.incomeBelongName" :disabled="true"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input class="inputRow" :value="settleInfo.incomeBelongSubName" :disabled="true"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input style="width:150px;margin-right:15px;" :value="money" :disabled="true"/>
              <a-button shape="round" v-if="isEdit" @click="addItem">+</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row
          :gutter="24"
          v-for="(k) in form.getFieldValue('keys')"
          :key="k"
        >
          <a-col :span="8">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择一级指标归属"
                optionFilterProp="children"
                style="width: 100%"
                :dropdownMatchSelectWidth="false"
                :disabled="!isEdit"
                v-decorator="[`incomeBelong[${k}]`,{ rules: [{required: true,message:'请选择一级指标归属!'}] }]"
              >
                <a-select-option
                  v-for="(items, j) in organFirst[k]"
                  :key="j"
                  :value="String(items.id)"
                >{{ items.organName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择二级指标归属"
                optionFilterProp="children"
                :dropdownMatchSelectWidth="false"
                :disabled="!isEdit"
                v-decorator="[`incomeBelongSub[${k}]`,{ rules: [{required: true,message:'请选择二级指标归属!'}] }]"
                @change="(val)=>changeIncomeBelong(val,k)"
              >
                <a-select-option
                  v-for="(items, j) in organSecond[k]"
                  :key="j"
                  :value="String(items.id)"
                >{{ items.organName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                placeholder="金额(元)"
                style="width: 150px;margin-right:15px;"
                :disabled="!isEdit"
                v-decorator="[`incomeAmount[${k}]`,{ validateTrigger: 'blur',rules: [{required: true,message:'请输入金额!'},{pattern:/^(-?[0-9]+)(\.\d{1,2})?$/,message: '请输入正确金额!' }] }]"
                @change="(val)=>changeIncome(val,k)"
              />
              <a-button shape="round" v-if="isEdit" @click="removeItem(k)">-</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import { httpAction } from '@/api/manage'
  
  export default {
    name:'IncomeBelongModal',
    props:{
      amoutInfo: {
        type:Object,
        required:true
      },
    },
    data() {
      return {
        visible: false,
        title: '收入归属拆分',
        // form: this.$form.createForm(this),
        settleInfo:{}, // 结算主体信息
        belongOrgan:{
          first: [],
          second: []
        },
        organFirst:[],
        organSecond:[],
        sumMoney: 100,
        money:0,
        index:0,
        isEdit: true,
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, { name: 'income' });
      this.form.getFieldDecorator('keys', { initialValue: [0], preserve: true });
    },
    methods: {
      // 兼容老数据
      getAllBelongs(list,id,field,all){
        const res = list.find(item=>String(item.id) === String(id));
        if(!res){
          const res1 = all.find(item=>String(item.id) === String(id));
          if(res1){
            this.belongOrgan[field].push(res1);
          }
        }
      },
      changeIncomeBelong(val,k){
        this.organSecond.forEach((item,key)=>{
          if(key !== k){
            const row = item.filter(ele=>String(ele.id) !== val);
            this.$set(this.organSecond,key,row);
          }
        })
      },
      changeIncome(e,k){
        const fields = this.form.getFieldsValue();
        let total = 0;
        fields.incomeAmount.forEach((item,key)=>{
          if(key !== k){
            total += parseFloat(item||0)
          }
        })
        const arr = fields.incomeAmount;
        const val = Math.round((parseFloat(this.sumMoney) - parseFloat(total) - parseFloat(e.target.value||0))*100)/100;
        this.money = val;
        
        arr[k] = e.target.value;
        this.$nextTick(() => {
          this.form.setFieldsValue({incomeAmount:arr});
        })
      },
      getOptions(arr){
        // eslint-disable-next-line
        let res = _.cloneDeep(arr);
        if(this.index == 0){
          return res;
        }
        // 获取已选择的下拉项
        const fields = this.form.getFieldsValue();
        if(fields.incomeBelongSub){
          fields.incomeBelongSub.forEach(item=>{
            res = res.filter(ele=>String(ele.id) !== item)
          })
        }
        return res;
      },
      addItem(){
        const { form } = this;
        this.$set(this.organFirst,this.index,this.belongOrgan.first);
        this.$set(this.organSecond,this.index,this.getOptions(this.belongOrgan.second,this.index));
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(this.index++);
        form.setFieldsValue({
          keys: nextKeys,
        })
      },
      removeItem(i){
        const { form } = this;
        const fields = form.getFieldsValue();
        const keys = fields.keys;
        const j = keys.findIndex(item=>item==i);
        keys.splice(j,1);
        // 金额处理
        // this.sumMoney;
        let total = 0;
        keys.forEach(item=>{
          total += parseFloat(fields.incomeAmount[item]||0);
        })
        this.money = Math.round((parseFloat(this.sumMoney) - parseFloat(total))*100)/100;
        this.$nextTick(() => {
          form.setFieldsValue({'keys':keys});
        })
        const val = fields.incomeBelongSub[i];
        if(val){
          const res = this.belongOrgan.second.find(item=>String(item.id) == val);
          if(res){
            this.organSecond.forEach((item,k)=>{
              if(k!==i){
                item.push(res)
                this.$set(this.organSecond,k,item);
              }
            })
          }
        }
      },
      filterOption(arr,list,index){
        // 获取除自身外的incomeBelongSub
        const otherArr = [];
        list.map((item,i)=>{
          if(i != index){
            otherArr.push(item.incomeBelongSub);
          }
        })
        // eslint-disable-next-line
        let res = _.cloneDeep(arr);

        // 获取已选择的下拉项
        if(list){
          list.forEach(()=>{
            res = res.filter(ele=>!otherArr.includes(String(ele.id)))
          })
        }
        return res;
      },
      async getBelongData(salaryInfo,incomeBelongList){
        let arr = [];
        let settleInfo = null;
        // 获取结算主体信息
        const res = await httpAction(`/hrBase/tsettledomain/${salaryInfo.departId}`,'','GET');
        if(res.code === 200){
          settleInfo = res.data;
          this.settleInfo = res.data;
        }
        this.index = incomeBelongList.length
        // 获取所有收入归属
        const res1 = await httpAction(`/admin/organizationinfo/getOrgForCus?type=0`,'','GET');
        if(res1.code === 200){
          arr = res1.data;
          const _this = this;
          arr.forEach(item => {
            if(String(item.id) === settleInfo.incomeBelong){
              _this.settleInfo.incomeBelongName = item.organName;
            }
            if(String(item.id) === settleInfo.incomeBelongSub){
              _this.settleInfo.incomeBelongSubName = item.organName;
            }
          });
        }
        // 获取一级收入归属
        const res2 = await httpAction(`/admin/organizationinfo/getOrgForCus?type=0&useType=1`,'','GET');
        if(res2.code === 200){
          this.belongOrgan.first = res2.data;
          // if(settleInfo){
          //   this.getAllBelongs(res2.data,settleInfo.incomeBelong,'first',arr);
          // }
        }
        // 获取二级收入归属
        const res3 = await httpAction(`/admin/organizationinfo/getOrgForCus?type=0&useType=2`,'','GET');
        if(res3.code === 200){
          this.belongOrgan.second = res3.data
          // this.belongOrgan.second = res3.data.filter(item=>String(item.id) !== this.settleInfo.incomeBelongSub);
          // if(settleInfo){
          //   this.getAllBelongs(res3.data,settleInfo.incomeBelongSub,'second',arr);
          // }
          if(this.index){
            for(let j=0;j<this.index;j++){
              this.$set(this.organFirst,j,res2.data);
              this.$set(this.organSecond,j,this.filterOption(this.belongOrgan.second,incomeBelongList,j));
            }
          }else{
            this.$set(this.organFirst,0,arr);
            this.$set(this.organSecond,0,arr);
          }

        }
        this.visible = true;
        this.sumMoney = this.amoutInfo.incomeSum;
        // eslint-disable-next-line
        this.money = _.cloneDeep(this.sumMoney);
        let defaultVal = {keys:[],incomeAmount:[],incomeBelongSub:[],settleFormId:[],incomeBelong:[]};
        
        if(incomeBelongList.length){
          let firstNum = 0;
          incomeBelongList.forEach((item,j)=>{
            defaultVal.keys.push(j);
            defaultVal.incomeAmount.push(item.incomeAmount);
            defaultVal.incomeBelong.push(item.incomeBelong);
            defaultVal.incomeBelongSub.push(item.incomeBelongSub);
            defaultVal.settleFormId.push(item.settleFormId);
            firstNum += parseFloat(item.incomeAmount||0)
          })
          this.money = Math.round((parseFloat(this.money) - parseFloat(firstNum))*100)/100;
          this.form.setFieldsValue({keys:defaultVal.keys});
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(defaultVal);
        })
      },
      handleOk() {
        this.form.validateFields((err,values)=>{
          if(!err){
            let flag = false;
            const params = values.keys.map((item)=>{
              if(this.settleInfo.incomeBelongSub === values.incomeBelongSub[item]){
                flag = true;
              }
              let temp = {
                incomeAmount:String(values.incomeAmount[item]),
                incomeBelong:values.incomeBelong[item],
                incomeBelongSub:values.incomeBelongSub[item],
                settleFormId:this.amoutInfo.id
              }
              return temp;
            })
            if(flag){
              this.$message.warning('二级归属指标不能重复!');
              return false;
            }

            httpAction(`/salary/tsalaryincomebelong/saveAndUpdateList`,params,'POST').then(res=>{
              if(res.code === 200){
                this.handleCancel();
                this.$emit('ok',res.data);
              }else{
                this.$message.warning(res.msg);
              }
            })
          }
        })
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.form.resetFields();
        this.visible = false;
        this.isEdit = true;
        this.settleInfo = {};
        this.index = 0;
        this.organFirst = [];
        this.organSecond = [];
        this.belongOrgan = {
          first: [],
          second: []
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.inputRow{
  width: 233px;
}
</style>
