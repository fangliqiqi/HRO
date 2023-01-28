<template>
  <a-modal
    :title="title"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    cancelText="关闭"
  >

    <a-form
      :form="form"
      layout="inline"
      class="ant-advanced-search-form"
    >
      <happy-scroll
        color="rgba(23, 22, 22, 0.68)"
        size="5"
        resize
        hide-horizontal
      >
        <a-row :gutter="24">
          <a-tree
            checkable
            :treeData="treeData"
            :defaultExpandAll="true"
            :replaceFields="replaceFields"
            :defaultCheckedKeys="defaultCheckedKeys"
            @check="onCheck"
          />

          <!-- <a-col
            :md="4"
            :sm="6"
            v-for="item in menuNames"
            :key="item.id"
          >
            <a-form-item label="">
              <a-checkbox-group v-decorator="['menus',{ initialValue: activeMenus ,rules: [{ required: true, message: '请选择!' }] }]">
                <a-checkbox :value="item.id">{{ item.linkName }}</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col> -->
        </a-row>
      </happy-scroll>
    </a-form>
  </a-modal>
</template>

<script>

import { httpAction } from '@/api/manage'
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
import { searchFromTree,reTree } from '@/utils/common'

export default {
  name: 'AddLinkModules',
  components: {HappyScroll}, //在组件内注册
  data() {
    return {
      title: '添加便捷导航',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      activeMenus: [],
      menus: [],
      menuNames: [],
      treeData:[],
      replaceFields:{title:'name',key:'id'},
      defaultCheckedKeys:[],
      selectedKeys:[],
      saveData:[],
    }
  },
  methods: {
    show(record) {
      this.treeData = reTree(this.menus)
      //获取选中的菜单
      if(record && record.length){
        for(const item of record){
          this.defaultCheckedKeys.push(item.id)
        }
      }
      this.visible = true;
    },
    onCheck(checkedKeys){
      this.saveData = []
      this.selectedKeys = checkedKeys
      for(const item of checkedKeys){
        this.saveData.push({
          id:item,
          name:searchFromTree(this.treeData,item)
        })
      }
    },
    handleOk() {
      httpAction('hrGeneral/workBanch/addNotes',this.saveData,'post').then((res)=>{
        if(res.code == 200){
          this.$message.success('提交成功！')
          this.activeMenus = this.saveData
          this.visible = false
          this.$emit('ok')
          this.menuNames = []
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    handleCancel() {
      this.close();
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.menuNames = []
    }
  }
}
</script>

<style scoped>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 150px;
  }
}
.ant-checkbox-wrapper {
  white-space: nowrap;
  margin-bottom: 8px;
}
.ant-advanced-search-form {
  height: 400px;
}
.ant-advanced-search-form .ant-form-item {
  margin-bottom: 0px;
}
</style>