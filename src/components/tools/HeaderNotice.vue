<template>
  <a-popover
    trigger="click"
    placement="bottomRight"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    overlayClassName="header-notice-wrapper"
    :overlayStyle="{ width: '300px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loadding">
        <a-tabs>
          <a-tab-pane
            tab="通知"
            key="0"
          >
            <a-list class="warn">
              <a-list-item
                v-for="(item,index) in warnList"
                :key="index"
              >
                <a slot="actions">
                  <router-link :to="{ name: item.url }">
                    <a-badge :count="item.count" />
                  </router-link>
                </a>
                <router-link :to="{ name: item.url }">
                  <a-list-item-meta :title="item.mesage">
                    <a-avatar
                      style="background-color: white"
                      slot="avatar"
                      src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"
                    />
                  </a-list-item-meta>
                </router-link>
              </a-list-item>
              <a-list-item
                v-for="(item) in alertList"
                :key="item.id"
              >
                <a slot="actions">
                  <router-link :to="{ name: item.url }">
                    <a-badge :count="item.count" />
                  </router-link>
                </a>
                <router-link :to="{ name: item.url }">
                  <a-list-item-meta :title="item.mesage">
                    <a-avatar
                      style="background-color: white"
                      slot="avatar"
                      src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"
                    />
                  </a-list-item-meta>
                </router-link>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane
            tab="待办"
            key="1"
          >
            <a-list>
              <a-list-item
                v-for="(item,index) in todoList"
                :key="index"
              >
                <a-list-item-meta
                  :title="item.todoName"
                  :description="item.todoName"
                >
                  <a-avatar
                    style="background-color: white"
                    slot="avatar"
                    src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"
                  />
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span
      @click="fetchNotice"
      class="header-notice"
    >
      <a-badge :count="total+alertNum">
        <a-icon
          style="font-size: 16px; padding: 4px"
          type="bell"
        />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
  import { httpAction } from '@/api/manage'

  export default {
    name: "HeaderNotice",
    data () {
      return {
        loadding: false,
        total:0,
        warnList:[],
        todoList:[],
        alertList:[],
        alertNum:0,
        url:{
          getWorkBanchWarn:'hrGeneral/workBanch/getWorkBanchWarn',
          getWranMonthToDoList:'hrGeneral/ttodolistdiy/getWranMonthToDoList',
          getAlertList:'/hrBase/TSettleAlertSysMsg/getAlertCountByUser'
        },
      }
    },
    mounted(){
      //提醒
      httpAction(this.url.getWorkBanchWarn,null,'get',30000).then((res)=>{
        if(res.code == 200 && res.data){
          this.warnList = res.data
          for(let item of res.data){
            this.total += item.count
          }
        }
      })

      httpAction(this.url.getAlertList,null,'get',30000).then((res)=>{
        if(res.code == 200 && res.data){
          this.alertNum = res.data
          this.alertList = [{count: res.data,mesage: `${res.data}个服务项目未结算`,url:'未结算提醒',id:999}]
        }
      })

      // 待办事件
      httpAction(this.url.getWranMonthToDoList,null,'get').then((res)=>{
        if(res.code == 200 && res.data){
          this.todoList = res.data
        }
      })
    },
    methods: {
      fetchNotice () {
        // if (this.loadding) {
        //   this.loadding = false
        //   return
        // }
        // this.loadding = true
        // setTimeout(() => {
        //   this.loadding = false
        // },1000)
      }
    }
  }
</script>

<style lang="less" scoped>
.header-notice-wrapper {
  top: 50px !important;
}
/deep/ .ant-list-item-action {
  margin-left: 8px !important;
}
.header-notice {
  display: inline-block;
  transition: all 0.3s;

  span {
    vertical-align: initial;
  }
}
</style>