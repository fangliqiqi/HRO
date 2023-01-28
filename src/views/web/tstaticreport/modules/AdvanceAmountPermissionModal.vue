<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="800"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item label="二级归属部门">
              <a-select
                :disabled="model.id?true:false"
                :allowClear="true"
                placeholder="请选择二级归属部门" 
                show-search 
                option-filter-prop="children" 
                @change="settleChange"
                v-decorator="['incomeBelongSub', {rules: [{ required: true, message: '请选择二级归属部门!' }]} ]"
              >
                <a-select-option
                  v-for="item in incomeBelongSubOptions"
                  :key="item.incomeBelongSub"
                  :value="item.incomeBelongSub"
                >
                  {{ item.incomeBelongSubName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="查阅人">  
              <a-transfer
                :data-source="mockData"
                :target-keys="targetKeys"
                :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
                :show-select-all="true"
                show-search
                :list-style="{
                  width:'250px',
                }"

                @change="onChange"
                v-decorator="['selectData', {rules: [{ required: true, message: '请选择查阅人!' }]} ]"
              >
                <template
                  slot="children"
                  slot-scope="{
                    props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
                    on: { itemSelectAll, itemSelect },
                  }"
                >
                  <a-table
                    :row-selection="
                      getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
                    "
                    :columns="direction === 'left' ? leftColumns : rightColumns"
                    :data-source="filteredItems"
                    size="small"
                    :style="{ pointerEvents: listDisabled ? 'none' : null }"
                    :custom-row="
                      ({ key, disabled: itemDisabled }) => ({
                        on: {
                          click: () => {
                            if (itemDisabled || listDisabled) return;
                            itemSelect(key, !selectedKeys.includes(key));
                          },
                        },
                      })
                    "
                  />
                </template>
              </a-transfer>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import difference from 'lodash/difference';

const leftTableColumns = [
  {
    dataIndex: 'title',
    title: '人员',
  },
];
const rightTableColumns = [
  {
    dataIndex: 'title',
    title: '已选择人员',
  },
];

import pick from 'lodash.pick'
import { httpAction } from '@/api/manage'

export default {
  name: 'AdvanceAmountPermissionModal',
 
  data(){
    return {
      title:'垫付额度查询赋权',
      visible: false,
      confirmLoading: false,
      isOpen:false,
      form: this.$form.createForm(this),
      incomeBelongSubOptions:[],
      incomeBelongSub:'',
      model:{},
      
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
        
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      },
      mockData:[],
      targetKeys: [],
      disabled: false,
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
      loading:false,
      url:{
        peopleUrl:'/admin/user/userDicByClientId?clientId=wxhr',
        detailUrl:'/hrApproval/tadvanceuseauth/getBySubId',
        addUrl:'/hrApproval/tadvanceuseauth/updateUseAuthInfo',
      }
    }
  },
  // mounted(){
  //   this.getMock()
  // },
  created(){
    this.getMock()
  },
  methods:{
    // 数据请求
    async getMock(){
      this.loading = true
  
      let mockData = []
      let res = await httpAction(this.url.peopleUrl,null,'GET')
      if(res.code==200){
        for(let r in res.data){
          mockData.push({
            key:r.toString(),
            title:res.data[r],
          })
        }
          this.mockData = mockData
          this.loading = false
      }else{
        this.mockData = []
        this.loading = false
        this.$message.warning(res.msg)
      }
    
    },
    
    // 移动
    onChange(nextTargetKeys) {
      this.targetKeys = nextTargetKeys 
    },
    
    // 列表项是配置
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    },
    
    show(){
      this.visible = true;
    },
    
    // 编辑
    edit(data){
      this.show()
      this.model = Object.assign({},data)
      this.$nextTick(()=>{
        this.form.setFieldsValue(pick({
          incomeBelongSub:data.incomeBelongSub,
          selectData:data.userId},
          'incomeBelongSub','selectData'))
          this.targetKeys = data.userId?data.userId.split(','):[]
      })
    },
    
    
    // 选择二级归属部门
    settleChange(val){
      if(val){
        this.model.incomeBelongSubName = this.incomeBelongSubOptions.find(item=>item.incomeBelongSub==val)['incomeBelongSubName']
      }
      // 选择部门后查询历史查阅人数据  detailUrl
       httpAction(`${this.url.detailUrl}?incomeBelongSub=${val}`,null,'get').then(res=>{
         if(res.code==200){
           let selectData = []
           res.data.map(item=>{
             selectData.push(item.userId)
           })
           this.$nextTick(()=>{
              this.form.setFieldsValue(pick({
                selectData:selectData},'selectData'))
                this.targetKeys = selectData
              })
         }else{
           this.$message.warning(res.msg)
         }
       })
    },
    
    handleOk(){
      const _this = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          let selectData = []
          for(let m of this.mockData){
            for(let t of this.targetKeys){
              if(m.key == t){
                selectData.push({
                  userId:m.key,
                  userName:m.title,
                })
              }
            }
          }
          this.confirmLoading = true;
          let url = `${this.url.addUrl}?incomeBelongSub=${values.incomeBelongSub}&incomeBelongSubName=${this.model.incomeBelongSubName}`
          httpAction(url,selectData,'post').then(res=>{
            if(res.code === 200){
              this.$message.success(res.msg);
              this.handleCancel();
              this.$emit('ok');
              this.confirmLoading = false;
            }else{
              this.$message.warning(res.msg);
            }
          }).finally(()=>{
            setTimeout(()=>{
              _this.confirmLoading = false;
            },2000)
          })
        }
      })
    },

    handleCancel(){
      this.visible = false;
      this.confirmLoading = false
      this.model = {}
      this.form.resetFields()
      this.targetKeys = []
    },
  }

}
</script>