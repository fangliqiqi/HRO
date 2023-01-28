<template>
  <global-layout @dynamicRouterShow="dynamicRouterShow">
    <contextmenu
      :itemList="menuItemList"
      :visible.sync="menuVisible"
      @select="onMenuSelect"
    />
    <a-tabs
      @contextmenu.native="e => onContextmenu(e)"
      v-if="multipage"
      :active-key="activePage"
      class="tab-layout-tabs"
      style="height:52px;"
      :hide-add="true"
      type="editable-card"
      @change="changePage"
      @edit="editPage"
    >
      <a-tab-pane
        :id="page.fullPath"
        :key="page.fullPath"
        v-for="page in pageList"
      >
        <!-- <span
          slot="tab"
          :pagekey="page.fullPath"
        >{{ page.meta.title }}</span> -->
        <span
          slot="tab"
          :pagekey="page.fullPath"
        >{{ page.name }}</span>
      </a-tab-pane>
    </a-tabs>
    <div style="margin: 24px 24px 0;">
      <transition name="page-toggle">
        <keep-alive v-if="multipage">
          <!-- <router-view v-if="reloadFlag" /> -->
          <router-view v-if="isTrue" />
        </keep-alive>
        <template v-else>
          <!-- <router-view v-if="reloadFlag" /> -->
          <router-view v-if="isTrue" />
        </template>
      </transition>
    </div>
  </global-layout>
</template>

<script>
  import Vue from "vue"
  import GlobalLayout from '@/components/page/GlobalLayout'
  import Contextmenu from '@/components/menu/Contextmenu'
  import { mixin, mixinDevice } from '@/utils/mixin.js'
  import { topNavScrollToSelectItem } from '@/utils/util'
  import store from '@/store'
  const indexKey = '/dashboard/analysis'

  export default {
    name: 'TabLayout',
    components: {
      GlobalLayout,
      Contextmenu
    },
    mixins: [mixin, mixinDevice],
    data() {
      return {
        pageList: [], //tab title
        linkList: [], //跳转url fullPath列表
        activePage: '', //当前url fullPath
        menuVisible: false,
        menuItemList: [
          { key: '1', icon: 'arrow-left', text: '关闭左侧' },
          { key: '2', icon: 'arrow-right', text: '关闭右侧' },
          { key: '3', icon: 'close', text: '关闭其它' },
          { key: '4', icon: 'reload', text: '刷 新' },
        ],
        reloadFlag:true
      }
    },
    computed: {
      multipage() {
        //判断如果是手机模式，自动切换为单页面模式
        if (this.isMobile()) {
          return false
        } else {
          return this.$store.state.app.multipage
        }
      },
      isTrue() {
        this.permissionList()
        return true
        // if (this.permissionList()) {  // 确保先执行
        //   return this.$route.meta.keepAlive ? true : true // 全部缓存
        // } else {
        //   return this.$route.meta.keepAlive ? true : true // 全部缓存
        // }
      },
    },
    created() {
      let allmenus = store.getters.addRouters[0].children
      // 首页和工作台不能共存
      let keyObj = {num:0,index:0,key1:'首页',key2:'工作台'}
      for(let j = 0,len=allmenus.length; j < len; j++) {
        if(allmenus[j].name == keyObj.key1){
          keyObj.num++
        }
        if(allmenus[j].name == keyObj.key2){
          keyObj.num++
          keyObj.index = j
        }
      }
      if(keyObj.num == 2){
        this.$delete(allmenus,keyObj.index)
      }

      let index = ''
      if(store.getters.addRouters[0]){
        for(let item of allmenus){
          if(item.path == store.getters.addRouters[0].redirect.substr(1)){
            index = item.name
            break
          }
        }
      }
      if (this.$route.path != indexKey) {
        this.pageList.push({
          name: index || '首页',
          path: indexKey,
          fullPath: indexKey,
          meta: {
            icon: 'dashboard',
            title: index || '首页'
          }
        })
        this.linkList.push(indexKey)
      }
      
      this.pageList.push(this.$route)
      this.linkList.push(this.$route.fullPath)
      this.activePage = this.$route.fullPath
    },
    watch: {
      '$route': function(newRoute) {
        this.activePage = newRoute.fullPath //当前地址
        if (!this.multipage) {
          this.linkList = [newRoute.fullPath]
          this.pageList = [newRoute]
        } else if (this.linkList.indexOf(newRoute.fullPath) >= 0) {
          let oldIndex = this.linkList.indexOf(newRoute.fullPath)
          let oldPositionRoute = this.pageList[oldIndex]
          this.pageList.splice(oldIndex, 1, Object.assign({},newRoute,{meta:oldPositionRoute.meta}))
          // this.pageList.splice(oldIndex, 1, newRoute)
        } else if (this.linkList.indexOf(newRoute.fullPath) < 0) { //新增tab
          //this.linkList ["/dashboard/analysis", "/iweb/CustomerContractSearchList", "/iweb/CustomerContractStopList", "/iweb/CustomerContractSearchList?workBranchjumpFlag=0"]
          let res = this.strInArr(newRoute.path,this.linkList)
          if(res.flag){
            this.linkList.push(newRoute.fullPath)
            this.pageList.push(newRoute)
          }else{
            // this.$set(this.linkList,res.index,newRoute.fullPath)
            // this.$set(this.pageList,res.index,newRoute)
            this.linkList.splice(res.index,1,newRoute.fullPath)
            this.pageList.splice(res.index,1,newRoute)
          }
        }

      },
      'activePage': function(key) {
        // 当前页的位置
        let index = this.linkList.lastIndexOf(key)
        let parm = {}
        if(index > -1){
          let waitRouter = this.pageList[index]
          parm = {
            fullPath:waitRouter.fullPath,
            path: waitRouter.path,
            name: waitRouter.name,
            params: waitRouter.params,
            query: waitRouter.query,
          }
        }else{
          let res = this.strInArr(key,this.linkList)
          if(res.index != '' && !res.flag){
            let waitRouter = this.pageList[res.index]
            parm = {
              fullPath:waitRouter.path,
              path: waitRouter.path,
              name: waitRouter.name,
              params: waitRouter.params,
            }
            this.$set(this.pageList,res.index,parm)
          }
        }
        this.$router.push(parm)
      },
      'multipage': function(newVal) {
        if (!newVal) {
          // 防止刷新丢失首页故注释掉
          // this.linkList = [this.$route.fullPath]
          // this.pageList = [this.$route]
        }
      }
    },
    methods: {
      //判断数组元素是否包含指定字符串
      strInArr(str,arr){
        for(let [index, item] of arr.entries()){
          if(item.indexOf(str) > -1){
            return {flag:false,index:index}
          }
        }
        return {flag:true,index:''}
      },
      changePage(key) {
        this.activePage = key
        // 只有当前模式是顶部菜单时才执行定位
        if (this.layoutMode === 'topmenu') {
          setTimeout(() => {
            topNavScrollToSelectItem(document)
          }, 100)
        }
      },
      editPage(key, action) {
        this[action](key)
      },
      remove(key) {
        if (key == indexKey) {
          this.$message.warning('首页不能关闭!')
          return
        }
        if (this.pageList.length === 1) {
          this.$message.warning('这是最后一页，不能再关闭了啦')
          return
        }
        this.pageList = this.pageList.filter(item => item.fullPath !== key)
        // let index = this.linkList.indexOf(key)
        let index = this.strInArr(key,this.linkList).index
        // this.linkList = this.linkList.filter(item => item !== key)
        this.linkList = this.linkList.filter(item => item.indexOf(key) < 0)
        index = index >= this.linkList.length ? this.linkList.length - 1 : index
        this.activePage = this.linkList[index]
      },
      onContextmenu(e) {
        const pagekey = this.getPageKey(e.target)
        if (pagekey !== null) {
          e.preventDefault()
          this.menuVisible = true
        }
      },
      getPageKey(target, depth) {
        depth = depth || 0
        if (depth > 2) {
          return null
        }
        let pageKey = target.getAttribute('pagekey')
        pageKey = pageKey || (target.previousElementSibling ? target.previousElementSibling.getAttribute('pagekey') : null)
        return pageKey || (target.firstElementChild ? this.getPageKey(target.firstElementChild, ++depth) : null)
      },
      onMenuSelect(key, target) {
        let pageKey = this.getPageKey(target)
        switch (key) {
          case '1':
            this.closeLeft(pageKey)
            break
          case '2':
            this.closeRight(pageKey)
            break
          case '3':
            this.closeOthers(pageKey)
            break
          case '4':
            this.routeReload()
            break
          default:
            break
        }
      },
      closeOthers(pageKey) {
        let index = this.linkList.indexOf(pageKey)
        if (pageKey == indexKey) {
          this.linkList = this.linkList.slice(index, index + 1)
          this.pageList = this.pageList.slice(index, index + 1)
          this.activePage = this.linkList[0]
        } else {
          let indexContent = this.pageList.slice(0, 1)[0]
          this.linkList = this.linkList.slice(index, index + 1)
          this.pageList = this.pageList.slice(index, index + 1)
          this.linkList.unshift(indexKey)
          this.pageList.unshift(indexContent)
          this.activePage = this.linkList[1]
        }
      },
      closeLeft(pageKey) {
        if (pageKey == indexKey) {
          return
        }
        let tempList = [...this.pageList]
        let indexContent = tempList.slice(0, 1)[0]
        let index = this.linkList.indexOf(pageKey)
        this.linkList = this.linkList.slice(index)
        this.pageList = this.pageList.slice(index)
        this.linkList.unshift(indexKey)
        this.pageList.unshift(indexContent)
        if (this.linkList.indexOf(this.activePage) < 0) {
          this.activePage = this.linkList[0]
        }
      },
      closeRight(pageKey) {
        let index = this.linkList.indexOf(pageKey)
        this.linkList = this.linkList.slice(0, index + 1)
        this.pageList = this.pageList.slice(0, index + 1)
        if (this.linkList.indexOf(this.activePage < 0)) {
          this.activePage = this.linkList[this.linkList.length - 1]
        }
      },
      dynamicRouterShow(key,title){
        let keyIndex = this.linkList.indexOf(key)
        if(keyIndex>=0){
          let currRouter = this.pageList[keyIndex]
          let meta = Object.assign({},currRouter.meta,{title:title})
          this.pageList.splice(keyIndex, 1, Object.assign({},currRouter,{meta:meta}))
        }
      },
      routeReload(){
        this.reloadFlag = false
        let ToggleMultipage = "ToggleMultipage"
        this.$store.dispatch(ToggleMultipage,false)
        this.$nextTick(()=>{
          this.$store.dispatch(ToggleMultipage,true)
          this.reloadFlag = true
        })
      },
      permissionList() {
        // 新组菜单
        let menu = {}
        // 处理tab数据
        let includes = []
        // 菜单列表
        let permissionList = this.$store.state.user.permissionList
        // 处理后的列表缓存
        let globalPermissionList = Vue.ls.get('global_permissionList')
        
        if (globalPermissionList) {  // 有缓存
          menu = globalPermissionList
        } else {  // 没有缓存
          // 处理数据
          for (let item of permissionList) {
            if (item.children && item.children.length > 0) {
              for (let item1 of item.children) {
                if (item1.children && item1.children.length > 0) {
                  for (let item2 of item1.children) {
                    if (item2.children && item2.children.length > 0) {  // 目前只到第三级菜单

                    } else {
                      menu[item2.path] = item2.component.substring(item2.component.lastIndexOf("/") + 1)
                    }
                  }
                } else {
                  menu[item1.path] = item1.component.substring(item1.component.lastIndexOf("/") + 1)
                }
              }
            } else {
              menu[item.path] = item.component.substring(item.component.lastIndexOf("/") + 1)
            }
          }

          Vue.ls.set('global_permissionList', menu, 2 * 60 * 60 * 1000) // 缓存2个小时
        }
        

        if (this.pageList.length > 0) {
          for (let list of this.pageList) {
            if (menu[list.fullPath]) {
              includes.push(menu[list.fullPath])
            }
          }
        }
        Vue.ls.set('global_includes', includes, 2 * 60 * 60 * 1000) // 缓存2个小时

        return true
      },
    }
  }
</script>

<style lang="scss">
/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

/*美化弹出Tab样式*/
.ant-tabs-nav-container {
  margin-top: 4px;
}

/* 修改 ant-tabs 样式 */
.tab-layout-tabs.ant-tabs {
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  background-color: white;
  padding: 0 20px;

  .ant-tabs-bar {
    margin: 4px 0 0;
    border: none;
  }
}

.ant-tabs {
  &.ant-tabs-card .ant-tabs-tab {
    padding: 0 24px !important;
    background-color: white !important;
    margin-right: 10px !important;

    .ant-tabs-close-x {
      width: 12px !important;
      height: 12px !important;
      opacity: 0 !important;
      cursor: pointer !important;
      font-size: 12px !important;
      margin: 0 !important;
      position: absolute;
      top: 36%;
      right: 6px;
    }

    &:hover .ant-tabs-close-x {
      opacity: 1 !important;
    }
  }
}

.ant-tabs.ant-tabs-card > .ant-tabs-bar {
  .ant-tabs-tab {
    border: none !important;
    border-bottom: 1px solid transparent !important;
  }
  .ant-tabs-tab-active {
    border-color: #1890ff !important;
  }
}
</style>