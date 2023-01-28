<template>
  <div>
    <a-modal
      title="导入字段列表"
      :width="800"
      placement="right"
      :closable="false"
      @cancel="handleCancel"
      :visible="visible"
      :maskClosable="false"
      :confirmLoading="confirmLoading"
      :destroyOnClose="true"
    >
      <template slot="footer">
        <a-button @click="handleCancel">关闭</a-button>
        <a-button type="primary" :loading="confirmLoading" @click="handlePre">上一步</a-button>
        <a-button type="primary" :loading="confirmLoading" @click="handleNext">下一步</a-button>
      </template>
      <a-spin
        :spinning="confirmLoading"
        tip="加载中..."
      >
        <a-form
          :form="form"
          layout="inline"
          class="fieldListForm"
        >
          <a-row :gutter="24">
            <a-col :span="4" class="th">序号</a-col>
            <a-col :span="8" class="th">原表表头</a-col>
            <a-col :span="8" class="th">系统表头</a-col>
          </a-row>
          <a-row
            :gutter="24"
            v-for="(i,k) in fields"
            :key="i"
          >
            <a-col :span="4">
              <a-form-item class="stepFormText">{{ k+1 }}</a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item class="stepFormText">
                <a-input class="input" v-decorator="[`oldFields[${k}]`,{initialValue:i}]" :readOnly="true"/>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item class="stepFormText">
                <a-select
                  placeholder="请选择系统字段"
                  show-search
                  :allowClear="true"
                  optionFilterProp="children"
                  style="width: 234px;"
                  @change="changeSelect($event,k)"
                  v-decorator="[`newFields[${k}]`]"
                >
                  <a-select-option
                    v-for="(item,index) in cacheSystemFields[k]"
                    :key="index"
                    :value="item.id"
                  >
                    {{ item.dbFiedName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item><a-checkbox @change="checkChange" :checked="!saveType"/>&nbsp;&nbsp;是否保存</a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </a-modal>
    <edit-field-list-modal ref="EditFieldListModalForm" @ok="handleCancel"></edit-field-list-modal>
    <error-modal ref="errorModal" @checked="checkedFlag"></error-modal>
  </div>

</template>

<script>
  import { httpAction } from '@/api/manage'
  import { getNameFromArr } from '@/utils/common'
  import pick from 'lodash.pick'
  import ErrorModal from './ErrorModal'
  import EditFieldListModal from './EditFieldListModal'

  export default {
    name:'ExportFieldsListModal',
    components: {
      EditFieldListModal,
      ErrorModal
    },
    data(){
      return {
        visible:false,
        confirmLoading:false,
        form: this.$form.createForm(this),
        fields:[],
        systemFields:[],
        cacheSystemFields:[],
        saveType:1,
        settleDepartInfo:{},
        defaultFieldsValue:[],
        formFields:{},
        excelData:[],
        selectVal:[],
        paramList:[]
      }

    },
    methods: {
      getDefaultField(arr,field){
        const res = []
        this.fields.map((item,index)=>{
          arr.forEach(items=>{
            if(items.excelTitle === item){
              res[index] = items[field]
            }
          })
        })
        return res
      },
      show(excelData,fields,settleDepartInfo,formFields){
        const _this = this
        this.fields = fields
        this.settleDepartInfo = settleDepartInfo
        this.formFields = formFields
        this.excelData = excelData
        httpAction('salary/tsalaryconfigstandard/getTSalaryConfigStandardList',null,'get').then(res=>{
          if(res.code === 200){
            this.systemFields = res.data
            for(let i=0;i<this.fields.length;i++){
              this.cacheSystemFields[i] = res.data
            }
            this.visible = true
          }else{
            this.$message.warning(res.msg)
          }
        }).finally(()=>{
          httpAction(`salary/mtitleconfig/getMTitleConfigList?settleId=${this.settleDepartInfo.settleId}`,null,'get').then(res=>{
            if(res.code === 200 && res.data){
              const arr = _this.getDefaultField(res.data,'configId')
              this.selectVal = arr
              if(arr.length){
                _this.saveType = 0
              }
              _this.defaultFieldsValue = _this.getDefaultField(res.data,'id')
              _this.$nextTick(() => {
                _this.form.setFieldsValue(pick({newFields:arr},'newFields'))
                setTimeout(()=>{
                  _this.form.getFieldValue('newFields').forEach((item,index)=>{
                    _this.changeSelect(item,index)
                  })
                })
              })
            }
          })
        })
      },

      changeSelect(e,k){
        const _this = this
        // 获取已选中的值 需要去除
        const newFields = _this.form.getFieldValue('newFields')
        newFields[k] = undefined
        const selectArr = []
        newFields.map(item=>{
          if(item &&String(item) != '93'&&String(item) != '102'&&String(item) != '103'){
            selectArr.push(item)
          }
        })

        if(e){

          for(let i=0;i<_this.fields.length;i++){
            if(k != i){
              // eslint-disable-next-line
              const temp = _.cloneDeep(_this.systemFields)
              
              if(e!= '93'&&e!= '102'&&e!= '103'){
                temp.splice(_this.getIndexFromArr(temp,e),1)
              }
              
              selectArr.forEach(item=>{
                if(e != item){
                  // 判断选中的值在第几个
                  const temp1 = newFields.findIndex((n) => (n && n == item))
                  if(i != temp1){
                    temp.splice(_this.getIndexFromArr(temp,item),1)
                  }
                }
              })
              _this.$set(_this.cacheSystemFields,i,temp)
            }
          }

        }
      },
      getIndexFromArr(arr,value){
        for(let i=0;i<arr.length;i++){
          if(arr[i].id && arr[i]['id'] == value){
            return i
          }
        }
      },
      checkChange(e){
        this.saveType = e.target.checked ? 0 : 1
      },
      handlePre(){
        this.visible = false
        this.$emit('ok',1)
      },
      handleExcelData(){
        const arr = []
        this.excelData.forEach((item,index)=>{
          arr[index] = []
          for(const key in item){
            arr[index].push({title:key,content:item[key]})
          }
        })
        return arr
      },
      checkedFlag(data){
        if(data){
          this.importData(1)
        }
      },
      importData(repeatFlag){
        const _this = this;
        new Promise((resolve, reject) => {
              httpAction('/salary/mtitleconfig/saveOrUpdate',_this.paramList,'post').then(res=>{
                if(res.code === 200){
                  resolve(res.data)
                }else{
                  reject(res.msg)
                }
              })
            }).then(result=>{
              const params = {
                contentList:_this.handleExcelData(),
                mtitleConfigList:result,
                salaryType:_this.formFields.salaryType,
                settleId:_this.formFields.settleDepart,
                configId:_this.formFields.configId,
              }
              httpAction(`/salary/salaryTwo/firstUpload?repeatFlag=${repeatFlag}`,params,'post').then(res=>{
                if(res.code === 200){
                  _this.$refs.EditFieldListModalForm.show(res.data,_this.settleDepartInfo)
                }else if(res.code==1){
                  // _this.$message.warning(res.msg)
                  if(res.data){
                      this.$refs.errorModal.noNew = false
                      this.$refs.errorModal.showModal(res.data)
                    }else{
                      this.$message.error(res.msg);
                    }
                }
              })
            },error=>{
              this.$message.warning(error)
            })
      },
      handleNext(){
        const _this = this
        this.form.validateFields((err,values) => {
          if(!err){
            const param = values.oldFields.map((item,index)=>{
              let obj = {
                configId:values.newFields[index],
                configName:getNameFromArr(_this.systemFields,values.newFields[index],'id','dbFiedName'),
                excelTitle:item,
                saveType:_this.saveType,
                settleId:_this.settleDepartInfo.settleId,
                settleName:_this.settleDepartInfo.settleName,
                settleNo:_this.settleDepartInfo.settleNo
              }
              if(_this.defaultFieldsValue[index]){
                obj = Object.assign(obj,{id:_this.defaultFieldsValue[index]})
              }
              return obj
            })
            _this.paramList = param
            _this.importData(0)
            // new Promise((resolve, reject) => {
            //   httpAction('/salary/mtitleconfig/saveOrUpdate',param,'post').then(res=>{
            //     if(res.code === 200){
            //       resolve(res.data)
            //     }else{
            //       reject(res.msg)
            //     }
            //   })
            // }).then(result=>{
            //   const params = {
            //     contentList:_this.handleExcelData(),
            //     mtitleConfigList:result,
            //     salaryType:_this.formFields.salaryType,
            //     settleId:_this.formFields.settleDepart,
            //     configId:_this.formFields.configId,
            //   }
            //   httpAction(`/salary/salaryTwo/firstUpload?repeatFlag=0`,params,'post').then(res=>{
            //     if(res.code === 200){
            //       _this.$refs.EditFieldListModalForm.show(res.data,_this.settleDepartInfo)
            //     }else if(res.code==1){
            //       // _this.$message.warning(res.msg)
            //       if(res.data){
            //           this.$refs.errorModal.showModal(res.data)
            //         }else{
            //           this.$message.error(res.msg);
            //         }
            //     }
            //   })
            // },error=>{
            //   this.$message.warning(error)
            // })
          }
        })
      },
      handleCancel(flag){
        this.visible = false
        this.saveType = 1
        this.defaultFieldsValue = this.excelData = this.selectVal = []
        this.formFields = {}
        if(flag){
          this.$emit('ok')
        }
      },
    },

  }
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom:0px;
    height: 59px;
    :global(.has-error) {
      text-align: left;
    }
  }
  .fieldListForm{
    width: 700px;
    padding:10px;
    border: 1px solid #d5d5d5;
    margin: 0 auto;
    text-align: center;
    .th{
      font-weight: bold;
      margin-bottom: 10px;
    }
    .input{
      width: 200px;
    }
  }
</style>
