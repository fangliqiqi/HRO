<template>
  <a-modal
    title="工资条配置"
    :width="1000"
    placement="right"
    @cancel="handleCancel"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">关闭</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk">保存</a-button>
    </template>

    <a-card title="可见项选择" :bordered="false" :bodyStyle="{padding: '24px 24px 0px'}">
      <a-button key="preview" type="primary" slot="extra" @click="handlePreview">预览</a-button>
      <a-form :form="form" class="form">
        <a-form-item>
          <a-checkbox-group
            v-decorator="['fields']"
            @change="changeFields"
            :options="options"
          >
          </a-checkbox-group>
          <a-input type="hidden" v-decorator="['isZero',{initialValue:0}]" />
        </a-form-item>
      </a-form>
    </a-card>
    <a-card title="已选可见项" :bordered="false" :bodyStyle="{background:'#eee'}">
      <span slot="extra">可拖动调整显示顺序</span>
      <draggable
        draggable=".item"
        :list="sortFields"
      >
        <a-tag
          v-for="item in sortFields"
          :key="item"
          closable
          @close="closeTag(item)"
          class="item">{{ item }}</a-tag>
      </draggable>
    </a-card>
    <div style="padding:24px">
      <a-checkbox @change="onChange" :defaultChecked="defaultChecked">不显示空值或为0项</a-checkbox>
    </div>

    <!-- 预览 -->
    <a-modal
      title="工资明细"
      :width="375"
      :visible="prVisible"
      @cancel="preCancel"
      @ok="preCancel"
      :maskClosable="false"
      :destroyOnClose="true"
      :footer="null"
    >
      <div class="view">
        <div class="moth dividing">{{ model.record ? moment(model.record.salaryMonth).format('YYYY年MM月') : null }}</div>
        <div class="money">0000.00</div>
        <div class="money-name dividing">实发工资</div>
        <div class="money-title" v-if="preFields.length">明细</div>
        <div class="money-detail">
          <p
            class="dividing flex"
            v-for="item in preFields"
            :key="item"
          >
            <span class="name">{{ item }}</span>
            <span class="num"> </span>
          </p>
        </div>
      </div>
    </a-modal>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import draggable from "vuedraggable"
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  name: 'SalaryConfigModal',
  components: {
    draggable
  },
  data() {
    return {
      visible:false,
      form:this.$form.createForm(this),
      loading:false,
      confirmLoading:false,
      model: {},
      options:[],
      sortFields:[],
      defaultChecked: false,
      url:{
        addOrEdit:'/salary/tsalarystandardset/saveOrUptateSet',
        del:'/salary/tsalarystandardset/',
      },
      prVisible: false,
      preFields:[],
    }
  },
  methods: {
    moment,
    ascSort(a,b){
      return a.orderLine-b.orderLine
    },
    sortChinese(arr){
      arr.sort(function (item1, item2) {
        return item1.localeCompare(item2, 'zh-CN');
      })
      return arr
    },
    show(data,record) {
      this.model = Object.assign(data,{record:record})
      this.options = this.sortChinese(data.salaryItem)
      const _this = this
      if(data.salarySet){
        this.defaultChecked = data.salarySet.isZero == 1 ? true : false
        const sortFields = data.salarySet.detailList.sort(this.ascSort);
        const temp = []
        sortFields.forEach(item=>{
          const res = _this.options.find(salary=>salary === item.cnName)
          if(res){
            temp.push(item.cnName)
          }
        })
        this.sortFields = temp
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({fields:this.sortFields,isZero:data.salarySet.isZero}, 'fields','isZero'))
        })
      }
      this.visible = true
    },
    changeFields(arr){
      const _this = this
      // 新增
      if(arr.length > this.sortFields.length){
        if(this.sortFields.length === 0){
          this.sortFields = arr.map(item=>{
            return _this.options.find(opt=>opt === item)
          })
        }else{
          let addItem = ''
          arr.forEach(item => {
            // 判断item是否在this.sortFields
            const res = _this.sortFields.find(fields=>String(fields) === String(item))
            if(!res){
              addItem = item
            }
          });
          _this.sortFields.push(addItem)
        }
      }else{
        let addItem = {}
        this.sortFields.forEach(item=>{
          // 判断item是否在arr
          const res = arr.find(fields=>String(fields) === String(item))
          if(!res){
            addItem = item
          }
        })
        _this.sortFields = _this.sortFields.filter(item=>item !== addItem)
      }

    },
    closeTag(val){
      const res = this.sortFields.filter(item=>item !== val)
      this.sortFields = res
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({fields:res}, 'fields'))
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.loading = false
      this.confirmLoading = false
      this.visible = false
      this.model = {}
      this.defaultChecked = false
      this.sortFields = []
      this.options = []
      this.preFields = []
    },
    getArrItem(field,index){
      if(this.model.salarySet){
        const res = this.model.salarySet.detailList.find(item=>item.cnName === field)
        if(res){
          return {...res,...{orderLine:index}}
        }
      }
      return {cnName:field,orderLine:index}
    },
    getFieldsList(){
      const _this = this
      return this.sortFields.map((item,index)=>{
        return _this.getArrItem(item,index)
      })
    },
    handleOk() {
      const _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          // 删除
          if(!values.isZero && (values.fields === undefined || values.fields.length === 0)){
            if(this.model.salarySet){
              this.$confirm({
                title: '是否清空配置？',
                content: '清空后，新建结算单将默认获取本结算主体的上一个配置！',
                onOk() {
                  httpAction(_this.url.del+_this.model.salarySet.id,null,'DELETE').then(res=>{
                    if(res.code === 200){
                      _this.$message.success('保存成功!')
                      _this.handleCancel()
                    }else{
                      _this.$message.warn(res.msg);
                    }
                  })
                }
              });
            }else{
              this.$message.success('保存成功!')
              this.handleCancel()
            }
          }else{
            // 新增或修改
            const fields = this.getFieldsList()
            let params = {
              deptId: this.model.record.departId,
              detailList: fields,
              isZero: values.isZero,
              salaryId:this.model.record.id
            }
            if(this.model.salarySet){
              params = {...params,...{id:this.model.salarySet.id}}
            }
            httpAction(this.url.addOrEdit,params,'post').then(res=>{
              if(res.code === 200){
                this.$message.success('保存成功!')
                this.handleCancel()
              }else{
                this.$message.warn(res.msg);
              }
            })
          }
          
        }
      });
    },
    handlePreview(){
      if(this.sortFields.length === 0 && this.form.getFieldValue('isZero') === 0){
        this.preFields = this.model.salaryItem
      }
      if(this.sortFields.length){
        this.preFields = this.sortFields
      }

      this.prVisible = true
    },
    preCancel(){
      this.prVisible = false
      this.preFields = []
    },
    onChange(e){
      const val = e.target.checked ? 1 : 0
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({isZero:val}, 'isZero'))
      })
    },
    
  }
}

</script>

<style lang="less" scoped>
  .form {
    :global(.ant-checkbox-group) {
      width: 100%;
    }
    :global(.ant-form-item) {
      margin-bottom: 0px;
    }
    :global(.ant-checkbox-wrapper) {
      margin-bottom: 15px;
      margin-left:0px;
      margin-right: 10px;
    }
  }
  .ant-tag{
    padding: 4px 5px;
    background: #fff;
    color: #333333;
    cursor: pointer;
    margin-bottom: 10px;
  }
  .view{
    .moth{
      min-height: 46px;
      font-size: 15px;
      line-height: 20px;
      color: #1a1a1a;
      padding-left: 18px;
    }
    .dividing{
      border-bottom: 1px solid #eaeaea;
    }
    .money{
      color: #333;
      font-size: 51px;
      font-weight: bold;
      text-align: center;
      line-height: 70px;
      margin: 13px;
    }
    .money-name{
      text-align: center;
      color: #1a1a1a;
      font-size: 15px;
      line-height: 20px;
      padding: 10px 0px 20px;
    }
    .money-title{
      margin-top: 14px;
      font-size: 16px;
      color: rgb(26, 26, 26);
      text-align: center;
      font-weight: 600;
    }
    .money-detail{
      .flex{
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 65px;
        box-sizing: border-box;
        padding: 0 18px;
        background-color: white;
      }
      .name{
        font-size: 16px;
        color: #1a1a1a;
        line-height: 21px;
        font-weight: 600;
      }
      .num{
        font-size: 14px;
        color: #999;
        line-height: 18px;
        align-items: center;
      }

    }
  }
</style>
