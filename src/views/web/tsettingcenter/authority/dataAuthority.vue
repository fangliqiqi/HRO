<template>

  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :span="6">
        <a-row>
          <a-col :span="24">
            <tree
              :nodes="treeData"
              :setting="setting"
              :gutter="6"
              @onCheck="onCheck"
              @onCreated="handleCreated"
              @onExpand="handleExpand"
            />
          </a-col>
        </a-row>

      </a-col>
      <a-col :span="18">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col
                :md="8"
                :sm="10"
              >
                <a-form-item label="姓名">
                  <a-input
                    placeholder="请输入姓名"
                    v-model="queryParam.nickname"
                  />
                </a-form-item>
              </a-col>
              <a-col
                :md="8"
                :sm="10"
              >
                <a-form-item label="用户名">
                  <a-input
                    placeholder="输入用户名查找"
                    v-model="queryParam.username"
                  />
                </a-form-item>
              </a-col>
              <a-col
                :md="6"
                :sm="8"
              >
                <span
                  style="float: left;overflow: hidden;"
                  class="table-page-search-submitButtons"
                >
                  <a-button
                    type="primary"
                    @click="searchQuery"
                    icon="search"
                  >查询</a-button>
                  <a-button
                    type="primary"
                    @click="searchReset"
                    icon="reload"
                    style="margin-left: 8px"
                  >重置</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <a-row>
          <a-col :span="24">
            <div
              class="ant-alert ant-alert-info"
              style="margin-bottom: 16px;"
            >
              已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> 项
              <a
                style="margin:0px 24px"
                @click="onClearSelected"
              >清空</a>
              <a-button
                type="primary"
                icon="check"
                v-has="'wxhr:tcustomerinfo_permission_add'"
                style="float:right"
                size="small"
                :disabled="selectedRowKeys.length==0"
                @click="handleAuthority"
              >批量授权</a-button>
              <a-button
                type="primary"
                icon="copy"
                style="float:right;margin-right:8px;"
                size="small"
                :disabled="selectedRowKeys.length==0"
                @click="copyAuthority"
              >复制权限</a-button>
            </div>
          </a-col>
        </a-row>

        <div class="tableCont">
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="userId"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            :scroll="{x:1 }"
            @change="handleTableChange"
          >
            <span
              slot="role"
              slot-scope="text, record"
            >
              <template v-for="(item, key) in record.roleList">
                <a-tag
                  :key="key"
                  color="blue"
                  style="margin-bottom:8px;"
                >{{ item.roleName }}</a-tag>
              </template>
            </span>
            <span
              slot="lockFlag"
              slot-scope="text, record"
            >
              <a-tag
                color="cyan"
                v-if="!record.lockFlag"
              >正常</a-tag>
              <a-tag
                color="red"
                v-else
              >锁定</a-tag>
            </span>
            <span
              slot="action"
              slot-scope="text, record"
            >
              <a @click="handleDetail(record)">查看权限</a>
            </span>
          </a-table>
        </div>
      </a-col>
    </a-row>
    <user-list-modal
      ref="userListModal"
      @ok="modalFormOk"
    ></user-list-modal>
    <data-auth-modal
      ref="DataAuthModalForm"
      @ok="modalFormOk"
    >
    </data-auth-modal>
  </a-card>
</template>

<script>
  
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction } from '@/api/manage'
  // import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import UserListModal from './userListModal'
  import DataAuthModal from './modules/DataAuthModal'

  export default {
    name: 'DataAuthority',
    mixins: [JeecgListMixin],
    components: {
      UserListModal,DataAuthModal,
      tree: resolve => require(["@/components/jeecg/ztree.vue"], resolve)
    },
    data() {
      return {
        description: '授权',
        treeData:[],
        sexOptions:[],
        checkedKeys:[],
        expandedKeys: [],
        dataList:[],
        searchValue:'',
        autoExpandParent: true,
        type:0, //0名称搜索1编码搜索
        isCanSub:false,
        
        params:{
          contracts:[],
          customers:[],
          settles:[],
        },
        // 表头
        columns: [
          {
            title: '姓名',
            align: 'center',
            dataIndex: 'nickname',
            ellipsis: true,
            width:80,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '登录账户名',
            align: 'center',
            dataIndex: 'username',
            width:100,
            ellipsis: true,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '角色名称',
            align: 'center',
            width:200,
            dataIndex: 'roleList',
            scopedSlots: { customRender: 'role' },
          },
          {
            title: '所属机构',
            align: 'center',
            dataIndex: 'deptName',
            ellipsis: true,
            // width:150,
            customRender:(text)=>{
              return (
                <a-tooltip title={text} placement="topLeft">
                  { text }
                </a-tooltip>
              )
            }
          },
          {
            title: '用户状态',
            align: 'center',
            dataIndex: 'lockFlag',
            width:100,
            ellipsis: true,
            scopedSlots: { customRender: 'lockFlag' },
          },
          {
            title: '查看权限',
            key: 'operation',
            align: 'center',
            fixed:'right',
            width:100,
            scopedSlots: { customRender: 'action' }
          },

        ],
        url: {
          list: 'admin/user/page/wxhr',
          getTree:'hrBase/tcustomerinfo/tree/allPermission',
          assignAuthority:'hrBase/tcustomerinfo/savePermissionVo/batch'
        },
        setting:{
          check: {
            enable: true
          },
          data: {
            key:{
              name:'title',
            },
          }
        },
        ztreeObj:{}
      }
    },
    created() {
      httpAction(this.url.getTree,null,'get').then((res)=>{
        if(res.code == 200){
          this.treeData = res.data
          // this.generateList(this.treeData)
          // this.generateData(this.treeData)
        }
      })
      
    },
    methods: {
      // 查看权限
      handleDetail(record){
        this.$refs.DataAuthModalForm.show(record)
      },
      onCheck(){
        this.params.customers = []
        this.params.contracts = []
        this.params.settles = []
        let _this = this
        let checkedKeys = this.ztreeObj.getCheckedNodes(true)
        if(checkedKeys.length){
          this.isCanSub = true
          for(let item of checkedKeys){
            switch(item.level){
              case 0 :
                _this.params.customers.push(item.id)
                break;
              case 1 :
                _this.params.contracts.push(item.id)
                break;
              case 2 :
                _this.params.settles.push(item.id)
                break;
            }
          }
        }else{
          this.isCanSub = false
        }
      },
      handleCreated(ztreeObj){
        this.ztreeObj = ztreeObj;
        // onCreated 中操作ztreeObj对象展开第一个节点
        // ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
      },
      handleExpand(event, treeId, treeNode){
        console.log(event, treeId, treeNode,11)
      },
      // onCheck(checkedKeys,e) {
      //   // console.log('onCheck', checkedKeys,e.checked)
      //   if(e.checked){
      //     for(let item of checkedKeys){
      //       this.expandedKeys.push(item)
      //     }
      //   }
      //   console.log(this.expandedKeys)
      //   // this.expandedKeys = checkedKeys

      //   this.params.customers = []
      //   this.params.contracts = []
      //   this.params.settles = []
      //   let _this = this
        
      //   if(checkedKeys.length){
      //     this.isCanSub = true
      //     for(let item of checkedKeys){
      //       let arr = item.split('_')
      //       switch(arr[0]){
      //         case '0' :
      //           _this.params.customers.push(arr[1])
      //           break;
      //         case '1' :
      //           _this.params.contracts.push(arr[1])
      //           break;
      //         case '2' :
      //           _this.params.settles.push(arr[1])
      //           break;
      //       }
      //     }
      //   }else{
      //     this.isCanSub = false
      //   }
      // },
      handleAuthority(){
        if(this.isCanSub){
          this.params.users = this.selectedRowKeys
          httpAction(this.url.assignAuthority,this.params,'post').then((res)=>{
            if(res.code == 200){
              this.checkedKeys = []
              this.onClearSelected()
              this.$message.success('授权成功！')
            }else{
              this.$message.warning(res.msg)
            }
          })
        }else{
          this.$message.warning('请先选择左边的客户单位')
        }
      },
      onExpand(expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      generateData(node){
        for(let [index,item] of node.entries()){
          this.$set(node[index],'scopedSlots',{title:'title',code:item.code})
          if(node[index].children){
            this.generateData(node[index].children)
          }
        }
      },
      generateList(data){
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          // const key = node.key;
          const key = node.key;
          this.dataList.push({ key, title:node.title,code:node.code });
          if (node.children) {
            this.generateList(node.children, node.key);
          }
        }
      },
      getParentKey(title, tree){
        
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (node.children) {
            if (node.children.some(item => item.title.indexOf(title) > -1)) {
              parentKey = node.key;
            }else if(node.children.some(item => item.code.indexOf(title) > -1)){
              parentKey = node.key;
            } else if (this.getParentKey(title, node.children)) {
              parentKey = this.getParentKey(title, node.children);
            }
          }
        }
        return parentKey;
      },
      onSearch(value){
        console.log(value)
        // const _this = this
        // const value = e.target.value;
        // const expandedKeys = this.dataList
        //   .map(item => {
        //     if (item.title.indexOf(value) > -1) {
        //       return _this.getParentKey(item.title, _this.treeData);
        //     }else if(item.code.indexOf(value) > -1){
        //       return _this.getParentKey(item.code, _this.treeData);
        //     }
        //     return null;
        //   })
        //   .filter((item, i, self) => item && self.indexOf(item) === i);
        //   this.expandedKeys = expandedKeys
        // //重新赋值  
        // Object.assign(this, {
        //   expandedKeys,
        //   searchValue: value,
        //   autoExpandParent: true,
        // })
      },
      // 复制权限
      copyAuthority(){
        // this.visible = true
        // this.$refs.userListModal.title = '员工基本信息'
        this.$refs.userListModal.showModal(this.selectedRowKeys)
      },
      // 数据字典
      // initDictConfig() {
      //   // 性别
      //   initDictOptions('sex').then((res) => {
      //     if (res.code === 200) {
      //       this.sexOptions = res.data
      //     }
      //   })
      // },

    }
  }
</script>
<style lang="less" scoped>
.ant-tree {
  border: 1px solid #91d5ff;
  overflow: scroll;
}
.tableCont {
  height: 450px;
}
</style>
