<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="岗位/系列">
          <a-input placeholder="请输入岗位/系列" v-decorator="['job', {}]"/>
        </a-form-item>

        <!--<a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所属部门">
          <a-input placeholder="请输入所属部门" v-decorator="['belongDepart', {}]" />
        </a-form-item>-->

        <a-form-item
          label="所属部门"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-tree-select
            style="width:100%"
            :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
            :treeData="treeData"
            v-model="model.belongDepart"
            placeholder="请选择所属部门">
          </a-tree-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="部门/编制">
          <a-input-number v-decorator="[ 'compiles', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="岗位名称">
          <a-input placeholder="请输入岗位名称" v-decorator="['name', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="职务层次">
          <a-input placeholder="请输入职务层次" v-decorator="['jobLevel', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="岗级区间最小值">
          <a-input-number v-decorator="[ 'postClassIntervalMin', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="岗级区间最大值">
          <a-input-number v-decorator="[ 'postClassIntervalMax', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="薪级区间最小值">
          <a-input-number v-decorator="[ 'salaryClassIntervalMin', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="薪级区间最大值">
          <a-input-number v-decorator="[ 'salaryClassIntervalMax', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="系数">
          <a-input placeholder="请输入系数" v-decorator="['coefficient', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-input placeholder="请输入备注" v-decorator="['remark', {}]"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import {queryIdTree} from '@/api/api'
  import pick from 'lodash.pick'

  export default {
    name: 'JobsModal',
    data() {
      return {
        title: '操作',
        treeData: [],
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {},
        url: {
          add: '/sys/jobs/add',
          edit: '/sys/jobs/edit'
        }
      }
    },

    created() {
    },

    methods: {
      loadTree(){
        var that = this;
        queryIdTree().then((res)=>{
          if(res.success){
            that.treeData = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i];
              that.treeData.push(temp);
            }
          }
        })
      },
      
      add() {
        this.edit({})
      },

      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.loadTree();
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'job', 'belongDepart', 'compiles', 'name', 'jobLevel', 'postClassIntervalMin', 'postClassIntervalMax', 'salaryClassIntervalMin','salaryClassIntervalMax','coefficient', 'remark'))
          //时间格式化
        })
      },

      close() {
        this.$emit('close')
        this.visible = false
      },

      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            if (!this.model.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }
            let formData = Object.assign(this.model, values)
            //时间格式化
            if(formData.salaryClassIntervalMin >= formData.salaryClassIntervalMax){
                that.$message.warning("薪级最大值不得小于薪级最小值");
                that.confirmLoading = false
                return
            }
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                console.log("OK!");
                that.$message.success(res.message)
                that.loadTreeData();
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
            })
          }
        })
      },

      handleCancel() {
        this.close()
      }
    }
  }
</script>

<style scoped>

</style>