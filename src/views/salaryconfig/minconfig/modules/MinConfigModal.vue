<template>
  <a-modal
    :title="title"
    :width="800"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="取消"
    okText="保存"
    :visible="visible"
    :confirmLoading="loading"
    :maskClosable="false"
  >
    <a-spin
      tip="Loading..."
      :spinning="spinning"
    >
      <a-card :bordered="false">
        <a-form :form="form">
          <a-row>
            <a-col :span="8">
              <a-form-item
                label="省"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-select
                  placeholder="省"
                  @change="handleIdProvinceChange"
                  v-decorator="['province', validatorRules.province ]"
                >
                  <a-select-option
                    v-for="(item, index) in idAreaTrees"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="市"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-select
                  placeholder="市"
                  @change="handleIdTownChange"
                  v-decorator="['city', validatorRules.city ]"
                >
                  <a-select-option
                    v-for="(item, index) in idAreaCitys"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="县"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-select
                  placeholder="县"
                  v-decorator="['town' ]"
                  :allowClear="true"
                >
                  <a-select-option
                    v-for="(item, index) in idAreaTowns"
                    :key="index"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-item
                label="最低工资标准"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input v-decorator="['salaryBase', validatorRules.salaryBase ]" />
              </a-form-item>
            </a-col>
            <a-col
              :span="15"
              style="margin-left:12px"
            >
              <a-form-item
                label="起始时间"
                :labelCol="labelCol1"
                :wrapperCol="wrapperCol1"
              >
                <!-- <a-date-picker v-decorator="['startDate', validatorRules.startDate ]" /> -->
                <a-range-picker
                  @change="onChange"
                  v-decorator="['rangeDate', validatorRules.rangeDate ]"
                />
              </a-form-item>
            </a-col>
            <!-- <a-col :span="8">
              <a-form-item
                label="终止时间"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-date-picker v-decorator="['endDate', validatorRules.endDate ]" />
              </a-form-item>
            </a-col> -->

          </a-row>
          <a-row>

            <a-col
              :span="10"
              :pull="1"
            >
              <a-form-item
                label="状态"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-radio-group v-decorator="['status', validatorRules.status ]">
                  <a-radio :value="1">启用</a-radio>
                  <a-radio :value="2">停用</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-spin>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'
import Vue from 'vue'
import { httpAction } from '@/api/manage'
import moment from 'moment'
export default {
  name:'MinConfigModal',
  data() {
    return{
      visible:false,
      title:'',
      loading:false,
      spinning:false,
      form:this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      labelCol1: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol1: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      idAreaTrees:[],
      idAreaCitys:[],
      idAreaTowns: [],
      rangeDate:[],
      model:{},
      validatorRules:{
        province:{ rules: [{ required: true, message: '请选择省!' }] },
        city:{ rules: [{ required: true, message: '请选择市!' }] },
        // town:{ rules: [{ required: true, message: '请选择县!' }] },
        rangeDate:{ rules: [{ required: true, message: '请选择时间!' }] },
        //endDate:{ rules: [{ required: true, message: '请选择结束时间!' }] },
        salaryBase:{ rules: [{ required: true, message: '请输入最低工资标准!' },{validator:this.isNumber}] },
        status:{ rules: [{ required: true, message: '请选择状态!' }] },
      },
      url:{
        addUrl:'/salary/tminsalary'
      }
    }
  },
  created () {
    this.idAreaTrees = Vue.ls.get('glob_area')
  },
  methods:{
    add(){
      this.edit({})
    },
    edit(record){
      this.visible = true
      this.form.resetFields()
      this.model = Object.assign({},record)
      if(this.model.id){
        this.model.startDate = moment(this.model.startDate)
        this.model.endDate = moment(this.model.endDate)
        this.getCity(record.province)
        if(this.model.town){
          this.getTown(record.city)
          let isTown = false
          console.log(this.idAreaTowns)
          for(const c of this.idAreaTowns){
            if(c.id == this.model.town){
              isTown =true
            }
          }
          if(!isTown){
            this.model.town = null
          }
        }else{
          this.model.town = null
        }
        this.model.rangeDate = [moment(this.model.startDate),moment(this.model.endDate)]
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'province','city','town','rangeDate','salaryBase','status'))
      })
    },
    handleCancel() {
      this.close()
      this.idAreaTowns = []
      this.idAreaCitys = []
      this.idAreaCitys = []
    },
    close(){
      this.visible = false
    },
    // 保存
    handleOk() {
      this.form.validateFields((err,values) => {
        if(!err){
          this.loading = true
          this.spinning = true
          let method = ''
          if(!this.model.id){
            method = 'POST'
          }else{
            method = 'PUT'
          }
          let formData = Object.assign(this.model,values)
          formData.startDate = this.rangeDate[0]
          formData.endDate = this.rangeDate[1]
          if(formData.town == undefined){
            formData.town = ''
          }
          httpAction(this.url.addUrl,formData,method).then((res) => {
            if(res.code == 200){
              this.$message.success('保存成功')
              this.loading = false
              this.spinning = false
              this.close()
              this.$emit('ok')
            }else{
              this.$message.error(res.msg)
              this.loading = false
              this.spinning = false
            }
          })
        }
      })
    },
    // 选择市
    handleIdProvinceChange(value) {
      //this.queryParam.idCity = ''
      this.getCity(value)
      this.getTown()
      this.model.city =  this.idAreaCitys[0].id
      //this.model.town =  this.idAreaTowns[0].id
      this.form.setFieldsValue(pick(this.model,'city'))
    },
    // 选择县
    handleIdTownChange(value){
      this.idAreaTowns = []
      for(var c of this.idAreaCitys) {
        if(c.id == value){
          for(let d of c.children){
            this.idAreaTowns.push(d)
          }
        }
      }
      this.model.town =  ''
      this.form.setFieldsValue(pick(this.model,'town'))
    },
    getCity(value){
      this.idAreaCitys = []

      for(var c of this.idAreaTrees[value - 1].children) {
        this.idAreaCitys.push(c)
      }
    },
    getTown(value){
      this.idAreaTowns = []
      if(value){
        // console.log(value)
        // console.log(this.idAreaCitys)
        // for(let l of this.idAreaCitys[value-1].children) {
        //   this.idAreaTowns.push(l)
        // }
        for(let l of this.idAreaCitys){
          if(l.id == value){
            for(let c of l.children){
              this.idAreaTowns.push(c)
            }
          }
        }
      }else{
        for(let l of this.idAreaCitys[0].children) {
          this.idAreaTowns.push(l)
        }
      }
      
    },
    // 验证数字
    isNumber(rule,value,callback){
      const reg = /^[0-9]+(.[0-9]{1,2})?$/
      if(!reg.test(value) && value != ''){
        callback(new Error('请输入正确的金额'))
      }else{
        callback()
      }
    },
    onChange(date, dateString){
      console.log(date, dateString);
      this.rangeDate = dateString
    }
  }
}
</script>
