<template>
  <a-modal
    :title="title"
    :width="650"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <div v-if="typeSub == 1">
        <a-button @click="handleCancel">关闭</a-button>
        <a-button
          type="primary"
          @click="handleSubmit"
          :loading="confirmLoading"
        >确定</a-button>
      </div>
      <div v-else>
        <!-- <a-button
          v-if="flag"
          type="primary"
          @click="handleSubmit"
          :loading="confirmLoading"
        >确定</a-button> -->
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <!-- 社保 -->
        <a-row v-if="typeSub == 0">
          <a-col :span="24">
            <a-form-item label="办理事项" class="stepFormText" style="margin-bottom:10px;">
              <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange" :disabled="selectDisabled">
                全选
              </a-checkbox>
              <br/>
              <a-checkbox-group :disabled="selectDisabled" v-decorator="['socialType', {rules: [{required: true, message: '办理事项不能为空！'}]}]" :options="checkedArr" @change="onChange" />
            </a-form-item>
          </a-col>
          <a-col :span="20" v-if="type == 0&&!flag">
            <a-form-item label="已办理事项" class="stepFormText" style="margin-bottom:20px;">
              <span
                class="successTag"
                v-for="item in handleList.sucess"
                :key="item.value"
              >{{ item.label }}</span>
              <span
                class="errorTag"
                v-for="item in handleList.error"
                :key="item.value"
              >{{ item.label }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="办理意见"
              class="stepFormText"
            >
              <a-textarea
                :rows="3"
                placeholder="请填写办理意见"
                v-decorator="['auditRemark',{rules:[{max:100, message: '最多100个字符！'}]}]"
                style="width: 418px;resize:none;"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item class="stepFormText">
              <div style="width:500px;text-align:center;">
                <a-button
                  type="primary"
                  @click="handleOk(1)"
                  style="margin-right:20px;"
                  :loading="confirmLoading"
                >办理成功</a-button>
                <a-button
                  @click="handleOk(2)"
                  :loading="confirmLoading"
                >办理失败</a-button>
              </div>
            </a-form-item>
          </a-col>
          
          <a-divider v-if="!flag" />
          <a-col :span="24" v-if="!flag">
            <div class="history">
              历史办理记录
              <span class="toggle" @click="toggleHistory" v-if="historyList.length>2">
                {{ textBtn }}<a-icon type="caret-down" v-if="textBtn == '展开'"/><a-icon type="caret-up" v-if="textBtn == '收起'"/>
              </span>
            </div>
            <a-timeline class="remarkList" v-if="auditList.length > 0">
              <template v-for="(list, key) in auditList">
                <a-timeline-item
                  :key="key"
                  :color="auditStatusOptions[list.auditStatus].color"
                >
                  <p>{{ list.auditRemark ? list.auditRemark : '' }}</p>
                  <p>{{ list.auditUser ? list.auditUser : '' }}</p>
                  <p>{{ list.auditTime ? list.auditTime : '' }}</p>
                </a-timeline-item>
              </template>
            </a-timeline>
            <a-empty v-else description="暂无记录"/>
          </a-col>
        </a-row>

        <a-row v-else>
          <a-col :span="24">
            <a-form-item label="办理状态">
              <a-radio-group
                buttonStyle="solid"
                v-decorator="['auditStatus', {initialValue:'1', rules:[{required: true, message: '请选择办理状态！'}]}]"
              >
                <a-radio-button
                  value="1"
                  style="margin-right: 10px;border-radius: 4px;"
                >办理成功</a-radio-button>
                <a-radio-button
                  value="2"
                  style="border-radius: 4px;"
                >办理失败</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="备注"
              class="stepFormText"
            >
              <a-textarea
                :rows="3"
                placeholder="请填写备注"
                v-decorator="['auditRemark', {}]"
                style="width: 418px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        
      </a-form>
    </a-spin>
    <error-modal ref="errorModal"></error-modal>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import ErrorModal from '../../../global/modules/ErrorModal'
  import pick from 'lodash.pick'

  export default {
    name: 'DispatchAddApplyModal',
    components: {
      ErrorModal,
    },
    data() {
      return {
        ids: '', // 派单id
        typeSub: '',  // 办理类型【0社保、1公积金、2离职】
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        url: {
          add: 'hrSocial/tdispatchinfo/addApplyHandle',
        },
        indeterminate: false,
        checkAll: false,
        selectDisabled: false,
        options:[
          {label:'养老',value:'1'},
          {label:'医疗',value:'2'},
          {label:'失业',value:'3'},
          {label:'工伤',value:'4'},
          {label:'生育',value:'5'},
          {label:'大病',value:'6'}
        ],
        auditStatusOptions: {
          '0': {'option': '提交/申请', 'color': 'blue'},
          '1': {'option': '重新申请', 'color': 'pink'},
          '2': {'option': '审核成功', 'color': 'green'},
          '3': {'option': '审核失败', 'color': 'red'},
          '4': {'option': '委派', 'color': 'cyan'},
          '5': {'option': '办理失败', 'color': 'red'},
          '6': {'option': '办理成功', 'color': 'green'},
        },
        checkedArr:[],
        auditList:[],
        historyList:[],
        handleList:{ // 已经办理的
          sucess:[],
          error:[]
        },
        type:0, // 0派增1派减
        batchHandle:false,
        flag:false,
        textBtn:'展开',
      }
    },
    methods: {
      toggleHistory(){
        if(this.textBtn == '展开'){
          this.auditList = this.historyList
          this.textBtn = '收起'
        }else{
          this.auditList = this.historyList.slice(0,2)
          this.textBtn = '展开'
        }
      },
      onCheckAllChange(e){
        const check = e.target.checked
        this.checkAll = check
        this.indeterminate = false
        const list = []
        this.checkedArr.map(item=>{
          list.push(item.value)
        })
        this.$nextTick(() => {
          if(check){
            this.form.setFieldsValue(pick({socialType:list}, 'socialType'))
          }else{
            this.form.setFieldsValue(pick({socialType:[]}, 'socialType'))
          }
        })
      },
      onChange(val){
        if(val.length == 0){
          this.checkAll = false
          this.indeterminate = false
        }else if(val.length == 6){
          this.checkAll = true
          this.indeterminate = false
        }else{
          this.checkAll = false
          this.indeterminate = true
        }
      },
      getProcess(id){
        httpAction(`hrSocial/tauditinfo/getAuditInfoByIdAndType?id=${id}&type=8`, '', 'GET').then((res) => {
          if (Number(res.code) === 200 && res.data) {
            this.historyList = res.data
            this.auditList = (res.data.length > 2) ? res.data.slice(0,2) : res.data
          } else {
            this.$message.error('暂无历史办理记录！')
          }
        })
      },
      changeField(field,val){
        const obj = this.options.find(item=>item.value === String(val))
        switch(String(field)){
          case '0': // 待办理
            this.checkedArr.push(obj)
            break
          case '1': // 办理成功
            this.handleList.sucess.push(obj)
            break
          case '2': // 办理失败
            this.handleList.error.push(obj)
            break
        }
      },
      add(record,flag) {
        this.flag = flag
        // 社保 (单个社保)
        if(this.typeSub == 0 && !flag){
          this.checkedArr = []
          let rtype = null
          let option = true;
          if(record){
            this.type = record.type;
            rtype = record.type;
            this.getProcess(record.id)
            
            this.changeField(record.pensionHandle,1)
            this.changeField(record.medicalHandle,2)
            this.changeField(record.unemployHandle,3)
            this.changeField(record.workInjuryHandle,4)
            this.changeField(record.birthHandle,5)
            this.changeField(record.bigailmentHandle,6)
          }else{
            rtype = '1';
            option = false;
            this.flag = true;
            this.checkedArr = [{label: "养老",value: "1"},{label: "医疗",value: "2"},{label: "失业",value: "3"},{label: "工伤",value: "4"},{label: "生育",value: "5"},{label: "大病",value: "6"}]
          }
          
          if(rtype === '1'){
            if(option){
              this.checkedArr = this.handleList.sucess
            }
            
            let arr = []
            this.checkedArr.map(item=>{
              arr.push(item.value)
            })
            this.selectDisabled = true
            this.checkAll = true
            this.indeterminate = false
            this.$nextTick(() => {
              this.form.setFieldsValue(pick({socialType:arr}, 'socialType'))
            })
          }
        }else if(flag){
          // 社保 批量
          this.checkedArr = this.options
          let arr = []
          this.checkedArr.map(item=>{
            arr.push(item.value)
          })
          this.socialType=arr
        }else if(this.typeSub == 1){
          //公积金
          this.batchHandle = true
        }
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
      },
      // 确定
      handleSubmit(){
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            const formData = Object.assign(this.model, values)
            let httpurl = `${this.url.add}?ids=${this.ids}&typeSub=${this.typeSub}&auditStatus=${formData.auditStatus}`
            if (formData.auditRemark != null) {
              httpurl += '&auditRemark=' + formData.auditRemark
            }
            httpAction(httpurl, '', 'post').then((res) => {
              let msg = res.message || res.msg
              this.$emit('ok')
              if (res.code === 200) {
                if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  this.$refs.errorModal.title = '办理提示: ' + msg
                  this.$refs.errorModal.message = msg
                  this.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  this.close()
                  this.$message.success('办理成功！')
                }
              } else {
                if (res.data != null && res.data.length > 0) {
                  this.$refs.errorModal.title = '办理提示: ' + msg
                  this.$refs.errorModal.message = msg
                  this.$refs.errorModal.showModal(res.data)
                } else if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  this.$refs.errorModal.title = '办理提示: ' + msg
                  this.$refs.errorModal.message = msg
                  this.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  this.$message.error(msg)
                }
              }
            }).finally(() => {
              this.confirmLoading = false
            })
          }
        })
      },
      //  办理成功
      handleOk(auditStatus) {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            if(auditStatus === 2){
              if(!values.auditRemark || values.auditRemark.trim().length === 0){
                this.$message.warning('办理意见不能为空')
                return
              }
            }
            
            that.confirmLoading = true
            let formData = Object.assign(this.model, values)
            
            let httpurl = `${this.url.add}?ids=${that.ids}&typeSub=${that.typeSub}&auditStatus=${auditStatus}`
            if(String(that.typeSub) === '0'){
              httpurl += `&socialType=${formData.socialType.join(',')}`
            }
            if (formData.auditRemark != null) {
              httpurl += '&auditRemark=' + formData.auditRemark
            }
            httpAction(httpurl, '', 'post').then((res) => {
              let msg = res.message || res.msg
              that.$emit('ok')
              if (res.code === 200) {
                if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  that.$refs.errorModal.title = '办理提示: ' + msg
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  that.close()
                  that.$message.success('办理成功！')
                }
              } else {
                if (res.data != null && res.data.length > 0) {
                  that.$refs.errorModal.title = '办理提示: ' + msg
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.data)
                } else if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  that.$refs.errorModal.title = '办理提示: ' + msg
                  that.$refs.errorModal.message = msg
                  that.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  that.$message.error(msg)
                }
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          }
        })
      },
      // 关闭功能
      handleCancel() {
        this.close()
      },
      // 表单关闭与数据重置
      close() {
        this.visible = false
        this.ids = '' // 派单id
        // this.typeSub = ''  // 办理类型【0社保、1公积金】
        this.$emit('close')
        this.confirmLoading = false
        this.checkAll = false
        this.selectDisabled = false
        this.indeterminate = false
        this.model = {}
        this.checkedArr = []
        this.auditList = []
        this.handleList = { sucess:[],error:[]}
        this.textBtn = '展开'
        
      },
    }
  }
</script>

<style lang="less" scoped>
.successTag{
  display: inline-block;
  width: 70px;
  height: 30px;
  line-height: 30px;
  color: #37B655;
  text-align: center;
  background: url('/images/check_icon.png');
  background-size: 100% 100%;
  margin-right: 8px;
}
.errorTag{
  display: inline-block;
  width: 70px;
  height: 30px;
  line-height: 30px;
  color: #E84E4E;
  text-align: center;
  background: url('/images/error_icon.png');
  background-size: 100% 100%;
  margin-right: 8px;
}
.stepFormText {
  :global(.ant-form-item-label) {
    width: 80px;
  }
}
.ant-divider{
  margin-bottom: 10px;
}
.history{
  margin-bottom: 15px;
  color: #222;
  font-size: 15px;
  .toggle{
    float: right;
    color: #1890FF;
    cursor: pointer;
    font-size: 14px;
  }
}
.anticon-down{
  cursor: pointer;
}
.anticon-up{
  cursor: pointer;
}
.remarkList{
  p{
    margin-bottom: 10px;
  }
  .ant-timeline-item{
    padding-bottom: 5px;
  } 
}
/deep/ .ant-timeline-item-head-red{
  background: url(/images/time_error_icon.png) center center;
  width: 14px;
  height: 14px;
  border: none;
}
/deep/ .ant-timeline-item-head-green{
  background: url(/images/time_check_icon.png) center center;
  width: 14px;
  height: 14px;
  border: none;
}
/deep/ .ant-timeline-item-tail{
  left: 6px;
}
</style>
