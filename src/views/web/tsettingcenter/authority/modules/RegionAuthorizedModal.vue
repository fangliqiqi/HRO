<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="保存"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirm-loading="confirmLoading"
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
              label="用户"
              class="stepFormLabel"
            >
              <select-page
                :searchUrl="'admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                :placeholder="'请输入用户姓名'"
                :triggerChange="true"
                :id="'userId'"
                :resList="resList"
                v-decorator="['userId',{
                  validateTrigger: ['change'],
                  rules: [{
                    required: true,
                    message: '请选择用户名！',
                  }],
                }]"
                @select="selectOption"
                style="width:300px;"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="账号"
              class="stepFormLabel"
            >
              <a-input 
                v-decorator="['userName',{}]"
                style="width:300px;"
                disabled
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" style="marginBottom:10px;paddingLeft:35px">
            <h3>地区授权：</h3>
            <span style="color:rgba(0,0,0,0.4)">
              是否按照结算主体细分说明：<br/>
              勾&nbsp;&nbsp;&nbsp;&nbsp;选，则该用户可办理对应结算主体（数据权限处赋权的）派单的-缴纳地为授权地的-数据；<br/>
              不勾选，则该用户可以办理所有的缴纳地为授权地的数据。
            </span>
          </a-col>
        </a-row>
        <div style="maxHeight:420px;overflow:auto;paddingLeft:35px">
          <a-row 
            class="changeRow" 
            v-for="(k,index) in form.getFieldValue('keys')"
            :key="index"
          >
            <a-col :span="22" class="changeBox">
              <a-row>
                <a-col :span="9">
                  <a-form-item
                    label="办理范围"
                    class="stepFormLabel"
                    style="marginBottom:0"
                  >
                    <a-checkbox-group 
                      v-decorator="[
                        `rangeType[${index}]`,
                        {
                          validateTrigger: ['change'],
                          rules: [{
                            required: true,
                            message: '请选择办理范围！',
                          }],
                        }
                      ]"
                    >
                      <a-checkbox value="1">
                        社保
                      </a-checkbox>
                      <a-checkbox value="2" style="marginLeft:50px">
                        公积金
                      </a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item 
                    class="stepFormLabel" 
                    style="marginLeft:10PX;marginBottom:0">
                    <a-checkbox-group 
                      v-decorator="[
                        `settleFlag[${index}]`,
                        {}]"
                    >
                      <a-checkbox value="0">
                        是否按照结算主体细分
                      </a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                </a-col>
                <a-col :span="15">
                  <a-form-item
                    class="stepFormLabel"
                    label="区域"
                  >
                    <a-select
                      showSearch
                      placeholder="选择省份"
                      optionFilterProp="children"
                      style="width: 100px"
                      v-decorator="[
                        `province[${index}]`,
                        {
                          validateTrigger: ['change'],
                          rules: [{
                            required: true,
                            message: '请选择省份！',
                          }],
                        }]"

                      @change="(value)=>handleProvinceChange(value,index)"
                      :dropdownMatchSelectWidth="false"
                    >
                      <a-select-option
                        v-for="(item, areaindex) in areaTrees[index]"
                        :key="areaindex"
                        :value="String(item.id)"
                      >{{ item.areaName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <a-select
                      showSearch
                      placeholder="选择城市"
                      optionFilterProp="children"
                      style="width: 100px"
                      v-decorator="[`city[${index}]`,{}]"
                      @change="(value)=>handleCityChange(value,index)"
                      :dropdownMatchSelectWidth="false"
                      :allowClear="true"
                    >
                      <a-select-option
                        v-for="(item, cityindex) in areaCitys[index]"
                        :key="cityindex"
                        :value="String(item.id)"
                      >{{ item.areaName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <a-select
                      showSearch
                      placeholder="选择区县"
                      optionFilterProp="children"
                      style="width: 100px"
                      v-decorator="[`town[${index}]`,{}]"
                      :allowClear="true"
                      :dropdownMatchSelectWidth="false"
                    >
                      <a-select-option
                        v-for="(item, townindex) in areaTowns[index]"
                        :key="townindex"
                        :value="String(item.id)"
                      >{{ item.areaName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="2">
              <a-icon
                class="dynamic-delete-button"
                type="plus-circle"
                v-if="index==0"
                @click="addItem()"
              />
              <a-icon
                v-if="index!=0"
                class="dynamic-delete-button"
                type="minus-circle-o"
                @click="remove(index)"
              />
            </a-col>
          </a-row>
        </div>
      </a-form>
    </a-spin>

  </a-modal>
</template>

<script>
import SelectPage from '@/components/jeecg/SelectPage'
import pick from 'lodash.pick'
import Vue from 'vue'
import { getAreaName } from '@/utils/common'
import { httpAction } from '@/api/manage'

let index = 0;
export default {
  name: 'RegionAuthorityModal',
  components:{
    SelectPage
  },
  data() {
    return {
      title: '地区授权',
      id:'',
      visible: false,
      confirmLoading: false,
      areaList:[],
      areaTrees:[],//省
      areaCitys:[],//市
      areaTowns:[],//县区
      resList:[],
      url: {
        submit:'/hrSocial/tareapermissionconf/saveAsso',//新增、修改
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
    this.form.getFieldDecorator('keys', { initialValue: [0], preserve: true });
  },
  methods: {
    show(){
      this.visible = true;
      this.areaList = Vue.ls.get('glob_area');
      this.areaTrees = [this.areaList]
    },
    // 编辑
    edit(data) {
      this.visible = true
      this.areaList = Vue.ls.get('glob_area');
      const areaConfs = data.areaConfs;
      const areaPermissionConf = data.areaPermissionConf;
      this.id = areaPermissionConf.id;
      this.resList.push({
        id:areaPermissionConf.userId,
        title:areaPermissionConf.nickName,
      })

        // 省列表
        this.areaTrees = []
        const keys = [0]
        const proArr = []
        const cityArr =[]
        const townArr = []
        const rangeArr = []
        const settleArr = []
        areaConfs.map((item,index)=>{
          if(index>0){
            keys.push(index)
          }
          proArr.push(item.province)
          cityArr.push(item.city)
          townArr.push(item.town)
          rangeArr.push(item.rangeType.split(','))
          settleArr.push(item.settleFlag.split(','))
          this.areaTrees.push(this.areaList)
        })
        this.form.setFieldsValue({keys:keys});
         // 市列表
        this.areaCitys = []
        this.areaTrees[0].reduce((acc,cur)=>{
          proArr.map((s,i)=>{
            if(s==cur.id){
              this.areaCitys[i]=cur.children
            }
          })
        },[])
        // 县区列表
        this.areaTowns = [];
        this.areaCitys.reduce((acc,cur)=>{
          for(let t of cur){
            cityArr.map((c,i)=>{
              if(c==t.id){
                this.areaTowns[i]=t.children
              }
            })
          }
        },[])
      const _this = this
      this.$nextTick(() => {
        _this.form.setFieldsValue(
          pick({province:proArr,city:cityArr,town:townArr,userId:areaPermissionConf.userId,
                userName:areaPermissionConf.userName,rangeType:rangeArr,settleFlag:settleArr},
                'province','city','town','userId','userName','rangeType','settleFlag')
        )
      })
    },
    // 选择用户
    selectOption(val,option,list){
      const userName = list.find(liitem=>liitem.id==val).item.username
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({userId:val,userName:userName}, 'userId','userName'))
      })
    },
    // 选择省
    handleProvinceChange(val,index){
      this.areaCitys[index]= [];
      this.areaTowns[index] = [];
      if(this.areaTrees[index][val - 1].children){
        for(var c of this.areaTrees[index][val - 1].children) {
          this.areaCitys[index].push(c);
        }
      }else{
         this.areaCitys[index] = []
      }
      const {form} = this;
      const cityArr = form.getFieldValue('city')
      const townArr = form.getFieldValue('town')
      const citys = cityArr.reduce((acc,cur,i)=>{
        if(i==index){
          acc[i]=undefined
        }
        return acc
      },[])
      const towns = townArr.reduce((acc,cur,i)=>{
        if(i==index){
          acc[i]=undefined
        }
        return acc
      },[])
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({city:citys,town:towns}, 'city','town'))
      })
    },
    // 选择市
    handleCityChange(val,index){
      this.areaTowns[index] = [];
      for(let a of this.areaCitys[index]) {
          if(a.id == val){
            if(a.children.length > 0) {
              for(let t of a.children) {
                this.areaTowns[index].push(t);
              }
            }
        }
      }
      const {form} = this;
      const townArr = form.getFieldValue('town')
      const towns = townArr.reduce((acc,cur,i)=>{
        if(i==index){
          acc[i]=undefined
        }
        return acc
      },[])
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({town:towns},'town'))
      })
    },

    // 添加事件
    addItem(){
      const { form } = this;
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(index++);
      form.setFieldsValue({
        keys: nextKeys,
      })
      this.areaTrees = [...this.areaTrees,this.areaList]
    },
    // 删除事件
    remove(index){
      const { form } = this;
      const allform = form.getFieldsValue()
      const keys = allform.keys;
      const provinceArr = allform.province;
      const cityArr = allform.city;
      const townArr = allform.town;
      const rangeArr = allform.rangeType;
      const settleFlagArr = allform.settleFlag;
      if (keys.length === 1) {
        return;
      }
      this.areaTrees.splice(index,1)
      this.areaCitys.splice(index,1)
      this.areaTowns.splice(index,1)
      form.setFieldsValue({
        keys: keys.filter((key,k) => index!== k),
        province: provinceArr.filter((key,k) =>index !== k),
        city: cityArr.filter((key,k) =>index !== k), 
        town:townArr.filter((key,k) =>index !== k),
        rangeType:rangeArr.filter((key,k) =>index !== k),
        settleFlag:settleFlagArr.filter((key,k) =>index !== k)
      });
    },
    // 保存提交
    handleOk(){
      this.form.validateFields((err,values) => {
        if (!err) {
          const that = this;
          const areaPermissionConf = {
            id:that.id,
            userId:values.userId,
            userName:values.userName
          }
          const areaConfs = []
          values.keys.map((item,index)=>{
            areaConfs.push({province:values.province[index]})
            areaConfs[index].city = values.city[index]
            areaConfs[index].town = values.town[index]
            areaConfs[index].settleFlag = values.settleFlag[index]&&values.settleFlag[index][0]=='0'?'0':'1'
            areaConfs[index].rangeType =  values.rangeType[index].join(',')

            if(values.rangeType[index].length>1){
              areaConfs[index].areaContent = '社保&公积金--'+getAreaName(values.province[index],values.city[index],values.town[index],'')
            }else{
              areaConfs[index].areaContent = values.rangeType[index][0]==1?'社保--'+getAreaName(values.province[index],values.city[index],values.town[index],'')
                                          :'公积金--'+getAreaName(values.province[index],values.city[index],values.town[index],'')
                  
            }
            return areaConfs
          })  
          // 地区和办理范围去重判断
          const repArr = []
          const valueData = JSON.parse(JSON.stringify(values))
          valueData.keys.map((item,index)=>{
            repArr[index]=[]
            repArr[index+valueData.keys.length]=[]
            repArr[index].push(valueData.province[index])
            repArr[index].push(valueData.city[index])
            repArr[index].push(valueData.town[index])
            if(valueData.rangeType[index].length>1){
              repArr[index].push(valueData.rangeType[index][0])
              repArr[index+valueData.keys.length].push(valueData.province[index])
              repArr[index+valueData.keys.length].push(valueData.city[index])
              repArr[index+valueData.keys.length].push(valueData.town[index])
              repArr[index+valueData.keys.length].push(valueData.rangeType[index][1])
            }else{
              repArr[index].push(valueData.rangeType[index][0])
            }
            return repArr
          })
          let newrepArr = []

          repArr.map(item=>{
            if(item.length!=0){
              newrepArr.push(item.join(','))
            }
          })
          if(this.repFun(newrepArr)){
            that.$message.error('省市区办理范围范围重复，请检查后重新提交!');
            return false
          }

          this.confirmLoading = true
          const params = {
            areaPermissionConf:areaPermissionConf,
            areaConfs:areaConfs
          }
          httpAction(this.url.submit, params, 'POST').then((res) => {
            if(res.code == 200){
              this.$message.success("操作成功！")
              this.handleCancel()
              this.$emit('ok')
            }else{
              this.$message.warning(res.msg)
            }
          }).finally(()=>{
            this.confirmLoading = false
          })
        }
      });
    },
    // 判断数组是否有重复数据
    repFun(arr){
      const newArr = [...new Set(arr)]
      const isRep = arr.length==newArr.length?false:true
      return isRep
    },

    handleCancel() {
      this.close()
    },
    close() {
      this.resList = []
      this.areaTrees = []
      this.areaCitys =[]
      this.areaTowns = []
      this.id = ''
      this.visible = false
      this.form.resetFields()
    },
  }
}
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormLabel {
  :global(.ant-form-item-label) {
    width: 80px;
  } 
}
.changeRow{
  display: flex;
  align-items: center;
}
.dynamic-delete-button{
 font-size: 20px;
 margin-left:10px;
}
.changeBox{
  padding: 5px;
  border: 1px solid #e5e5e5;
  margin-top: 10px;
}
</style>