<template>
  <page-layout
    :avatar="avatar"
    @changeAvatar="changeAvatar"
  >
    <div
      slot="headerContent"
      style="text-align: left;"
    >
      <div class="title">
        {{ timeFix }}，{{ nickname() }}
        <span class="welcome-text">{{ welcome() }}</span>
      </div>
      <div>{{ postInfo }}</div>
    </div>
    <div slot="extra">
      <a-row :gutter="24" class="staticList">
        <a-col :span="2">
          <div class="head-info card1">
            <span>在册员工</span>
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ staticCount.allEmp }}</span>
              </template>
              <p>{{ staticCount.allEmp }}</p>
            </a-tooltip>
          </div>
        </a-col>
        <a-col :span="2">
          <div class="head-info card2">
            <span>在职员工</span>
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ staticCount.officialEmp }}</span>
              </template>
              <p>{{ staticCount.officialEmp }}</p>
            </a-tooltip>
          </div>
        </a-col>
        <a-col :span="2">
          <div class="head-info card3">
            <span>试用员工</span>
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ staticCount.tryEmp }}</span>
              </template>
              <p>{{ staticCount.tryEmp }}</p>
            </a-tooltip>
          </div>
        </a-col>
        <a-col :span="2">
          <div class="head-info card1">
            <span>本月派增</span>
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ staticCount.addEmp }}</span>
              </template>
              <p>{{ staticCount.addEmp }}</p>
            </a-tooltip>
          </div>
        </a-col>
        <a-col :span="2">
          <div class="head-info card2">
            <span>本月派减</span>
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ staticCount.minusEmp }}</span>
              </template>
              <p>{{ staticCount.minusEmp }}</p>
            </a-tooltip>
          </div>
        </a-col>
        <a-col :span="2">
          <div class="head-info card3">
            <span>临时员工</span>
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ staticCount.tempEmp }}</span>
              </template>
              <p>{{ staticCount.tempEmp }}</p>
            </a-tooltip>
          </div>
        </a-col>
        <a-col :span="2">
          <div class="head-info card1">
            <span>服务员工</span>
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ staticCount.empCount }}</span>
              </template>
              <p>{{ staticCount.empCount }}</p>
            </a-tooltip>
          </div>
        </a-col>
        <a-col :span="2">
          <div class="head-info card2">
            <span>服务客户</span>
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ staticCount.customeCount }}</span>
              </template>
              <p>{{ staticCount.customeCount }}</p>
            </a-tooltip>
          </div>
        </a-col>
        <a-col :span="3">
          <div class="head-info card3">
            <span >垫付未回款</span>
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ staticCount.payCount | NumberFormat }}</span>
              </template>
              <p>{{ staticCount.payCount | NumberFormat }}</p>
            </a-tooltip>
          </div>
        </a-col>
      </a-row>
    </div>

    <div>
      <a-row :gutter="24">
        <a-col
          :xl="16"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px;text-align: left"
            :bordered="false"
            title="待办事项"
            :body-style="{ padding: 0 }"
          >
            <a slot="extra" v-if="projects.length > 6">更多</a>
            <div
              :key="i"
              v-for="(item, i) in projects"
            >
              <a-card-grid
                class="project-card-grid"
                v-if="item.name"
              >
                <a-card
                  :bordered="false"
                  :body-style="{ padding: 0 }"
                >
                  <a-card-meta>
                    <div
                      slot="title"
                      class="card-title"
                    >
                      <a-avatar
                        size="small"
                        :src="item.cover"
                      />
                      <router-link :to="{ name: item.url,query:item.param || '' }">
                        <a>{{ item.name }}</a>
                      </router-link>
                    </div>
                    <div
                      slot="description"
                      class="card-description"
                    >
                      {{ item.message }}
                    </div>
                  </a-card-meta>
                  <!-- <div class="project-item">
                    <a href="/#/">系统消息</a>
                    <span class="datetime">9小时前</span>
                  </div> -->
                </a-card>
              </a-card-grid>
            </div>
          </a-card>

          <a-card
            :loading="loading"
            title="动态"
            :bordered="false"
            style="text-align: left"
          >
            <a-list>
              <a-list-item
                :key="index"
                v-for="(item, index) in activities"
              >
                <a-list-item-meta>
                  <a-avatar
                    slot="avatar"
                    :src="item.user.avatar"
                  />
                  <div slot="title">
                    <span>{{ item.user.nickname }}</span>&nbsp;
                    在&nbsp;<a href="#">{{ item.project.name }}</a>&nbsp;
                    <span>{{ item.project.action }}</span>&nbsp;
                    <a href="#">{{ item.project.event }}</a>
                  </div>
                  <div slot="description">{{ item.time }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <a-card
            title="便捷导航"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{padding: 0}"
          >
            <div class="item-group">
              <router-link
                v-if="activeMenus.length > 0"
                v-for="item in activeMenus"
                :key="item.id"
                :to="{ name: item.name }"
              >
                <a-tag color="cyan">{{ item.name }}</a-tag>
              </router-link>
              <a-button
                size="small"
                type="primary"
                ghost
                icon="plus"
                @click="addLink"
              >添加</a-button>
            </div>
          </a-card>
          <a-card
            title="日程"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <a-button
              slot="extra"
              @click="addMatter()"
            >添加</a-button>
            <div style="min-height: 310px;">
              <a-calendar
                :fullscreen="false"
                @select="calendarSelect"
                @panelChange="panelChange"
                @change="calendarChange"
              >
                <template
                  class="events"
                  slot="dateCellRender"
                  slot-scope="value"
                >
                  <span class="remark">
                    <a-badge
                      v-if="getListData(value)"
                      status="success"
                    />
                  </span>
                </template>
              </a-calendar>
              <!-- :scale="scale" :axis1Opts="axis1Opts" :axis2Opts="axis2Opts"  -->
              <!--<radar :data="radarData" />-->
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <add-link-modules
      ref="addLinkModal"
      @ok="addLinkModalOk"
    ></add-link-modules>
    <schedule-modules ref="ScheduleModules" @ok="addScheduleModalOk"></schedule-modules>
    <schedule-detail-modules ref="ScheduleDetailModules"></schedule-detail-modules>
  </page-layout>
</template>

<script>
  import { timeFix } from "@/utils/util"
  import {mapGetters,mapState} from "vuex"
  import { httpAction } from '@/api/manage'
  import moment from 'moment'
  import PageLayout from '@/components/page/PageLayout'
  import HeadInfo from '@/components/tools/HeadInfo'
  import Radar from '@/components/chart/Radar'
  import AddLinkModules from './modules/AddLinkModules'
  import ScheduleModules from './modules/ScheduleModules'
  import ScheduleDetailModules from './modules/ScheduleDetailModules'

  export default {
    name: "Workplace",
    components: {
      AddLinkModules,
      ScheduleModules,
      ScheduleDetailModules,
      PageLayout,
      HeadInfo,
      Radar
    },
    data() {
      return {
        timeFix: timeFix(),
        avatar: 'https://img.zcool.cn/community/01045058a578d6a801219c77f4a434.jpg',
        user: {},
        formate:'YYYY-MM-DD',
        projects: [],
        schedule:{}, //待办事项
        loading: true,
        radarLoading: false,
        activities: [],
        teams: [],
        center: null,
        navs: [{linkName: '结算主体查询'}],
        menus: [],
        activeMenus: [], //快捷导航
        postInfo:"", //当前用户职位信息
        staticCount:{
          empCount:0, //服务员工
          allEmp:0,
          tempEmp:0,
          tryEmp:0,
          addEmp:0,
          minusEmp:0,
          officialEmp:0,
          customeCount:0, //服务客户
          payCount:0, //垫付未回款
        },
        url:{
          getServiceEmployeeCount:'hrBase/temployeeinfo/workbench/getServiceEmployeeCount',
          getServiceCutsomerCount:'hrBase/tcutsomerdatapermisson/workbench/getServiceCutsomerCount',
          getNoPayBackSum:'hrApproval/tadvancepayment/workbench/getNoPayBackSum',
          getAllTypeEmployeeCount:'hrBase/temployeeinfo/workbench/getAllTypeEmployeeCount',
          getAllTypeEmpCount:'hrSocial/tdispatchinfo/workbench/getAllTypeEmployeeCount',
          getThisMonthToDoList:'hrGeneral/ttodolistdiy/getThisMonthToDoList',
          getNotes:'hrGeneral/workBanch/getNotes',
          getUserInfo:'hrGeneral/workBanch/getUserBaseInfo',
          getWorkBanchNeedHandleVo:'hrGeneral/workBanch/getWorkBanchNeedHandleVo'
        },
          // data
        axis1Opts: {
          dataKey: 'item',
          line: null,
          tickLine: null,
          grid: {
            lineStyle: {
              lineDash: null
            },
            hideFirstLine: false
          }
        },
        axis2Opts: {
          dataKey: 'score',
          line: null,
          tickLine: null,
          grid: {
            type: 'polygon',
            lineStyle: {
              lineDash: null
            }
          }
        },
        scale: [{
          dataKey: 'score',
          min: 0,
          max: 80
        }],
        axisData: [
          { item: '引用', a: 70, b: 30, c: 40 },
          { item: '口碑', a: 60, b: 70, c: 40 },
          { item: '产量', a: 50, b: 60, c: 40 },
          { item: '贡献', a: 40, b: 50, c: 40 },
          { item: '热度', a: 60, b: 70, c: 40 },
          { item: '引用', a: 70, b: 50, c: 40 }
        ],
        radarData: []
      }
    },
    computed: {
      userInfo() {
        return this.$store.getters.userInfo
      },
      ...mapState({
        // 主路由
        mainRouters: state => state.permission.addRouters,
        // 后台菜单
        permissionMenuList: state => state.user.permissionList
      })
    },
    created() {
      this.user = this.userInfo
      this.menus = this.permissionMenuList
      // this.avatar = window._CONFIG['imgDomainURL'] +"/"+ this.userInfo.avatar
    },
    mounted() {
      this.getProjects();
      this.initRadar()
      //获取服务数据
      this.getCountdata()
      //获取待办事项
      this.getScheduleList()
      //获取用户信息
      httpAction(this.url.getUserInfo,null,'get').then((res)=>{
        if(res.code === 200 && res.data){
          this.postInfo = res.data.postInfo
          if(res.data.profilePhoto){
            this.avatar = res.data.profilePhoto.attaUrl
          }
        }
      })
    },
    
    methods: {
      moment,
      ...mapGetters(["nickname", "welcome"]),
      getTodoList(value){
         let url = this.url.getThisMonthToDoList
        if(value){
          url += `?day=${moment(value).format(this.formate)}`
        }else{
          url += `?day=${moment().format(this.formate)}`
        }
        //获取待办事项
        httpAction(url,null,'get').then((res)=>{
          if(res.code === 200){
            for(const index in res.data){
              this.$set(this.schedule,moment(index).format('D'),res.data[index])
            }
          }
        }).finally(() => {
          this.removeMark()
        })
      },
      //获取待办事项
      getScheduleList(){
        //日历数据
        this.schedule = {}
        this.getTodoList()
      },
      getCountdata(){ 
        //获取快捷导航
        httpAction(this.url.getNotes,null,'post').then((res)=>{
          if(res.code === 200){
            this.activeMenus = res.data
          }
        })
        //获取统计数据 服务员工
        httpAction(this.url.getServiceEmployeeCount,null,'get').then((res)=>{
          if(res.code === 200){
            this.staticCount.empCount = res.data
          }
        })
        //服务客户
        httpAction(this.url.getServiceCutsomerCount,null,'get').then((res)=>{
          if(res.code === 200){
            this.staticCount.customeCount = res.data
          }
        })
        // 垫付未回款总额
        httpAction(this.url.getNoPayBackSum,null,'get').then((res)=>{
          if(res.code === 200){
            this.staticCount.payCount = res.data
          }
        })
        // 获取在册员工临时、试用员工
        httpAction(this.url.getAllTypeEmployeeCount,null,'get',30000).then((res)=>{
          if(res.code === 200){
            this.staticCount.allEmp = res.data.all
            this.staticCount.tempEmp = res.data.temp
            this.staticCount.tryEmp = res.data.try
          }
        })
        // 获取本月派增、派减、在职员工
        httpAction(this.url.getAllTypeEmpCount,null,'get').then((res)=>{
          if(res.code === 200){
            this.staticCount.addEmp = res.data.add
            this.staticCount.minusEmp = res.data.minus
            this.staticCount.officialEmp = res.data.offical
          }
        })
        
        //获取待办事项
        // let urls = [
        //   'hrSocial/tdispatchinfo/workbench/getSocialNeedHandle',
        //   'salary/tsalaryengineering/workbench/getNeedIssue',
        //   'busiInsurance/tbusinessinsurance/workbench/getNeedHandle',
        //   'hrOneTime/tbusinessoutsourcingmain/workbench/getNeedHandle',
        //   'hrBase/temployeecontractinfo/workbench/geNeedRenew',
        //   'hrBase/tcustomercontract/workbench/geNeedRenew'
        // ]
        // for(let [index,item] of urls.entries()){
        //   httpAction(item,null,'get').then((res)=>{
        //     if(res.code == 200){
        //       if(res.data.flag == true){
        //         this.$set(this.projects[index], 'name', res.data.name)
        //       }else{
        //         this.$set(this.projects, index, {})
        //       }
        //     }
        //   })
        // }

      },
      initRadar() {
        this.radarLoading = true
      },
      addLink() {
        this.$refs.addLinkModal.menus = this.menus
        this.$refs.addLinkModal.show(this.activeMenus)
      },
      addLinkModalOk() {
        this.activeMenus = this.$refs.addLinkModal.activeMenus;
      },
      addScheduleModalOk(){
        this.getScheduleList()
      },
      //添加待办事项
      addMatter(){
        this.$refs.ScheduleModules.show()
      },
      panelChange(value){
        this.schedule = {}
        this.getTodoList(value)
      },
      calendarChange(value){
        if(event.target.parentNode.parentNode.outerHTML.indexOf('ant-fullcalendar-last-month-cell') > -1 || event.target.parentNode.parentNode.outerHTML.indexOf('ant-fullcalendar-next-month-btn-day') > -1){
          this.schedule = {}
          this.getTodoList(value)
        }
      },
      //查看详情
      calendarSelect(value){
        const next = event.target.nextElementSibling || event.target.nextSibling
        if(next && (next.innerHTML.indexOf('ant-badge') > -1)){
          const index = value.date()
          this.$refs.ScheduleDetailModules.show(this.schedule[index],value.format(this.formate))
        }
      },
      //改变头像回调
      changeAvatar(data){
        this.avatar = data
      },
      getProjects() {
        httpAction(this.url.getWorkBanchNeedHandleVo,null,'get',30000).then((res)=>{
          if(res.code == 200){
            this.projects = res.data
          }
        })
        this.loading = false
      },
      getListData(value) {
        for(const index in this.schedule){
          if(value.date() == index){
            return true
          }
        }
        return false
      },
      //去除上个月下个月的标记
      removeMark(){
        const dateDom = document.querySelectorAll('.ant-fullcalendar-value')
        for(const item of dateDom){
          if(item.parentNode.parentNode.outerHTML.indexOf('ant-fullcalendar-last-month-cell') > -1 || item.parentNode.parentNode.outerHTML.indexOf('ant-fullcalendar-next-month-btn-day') > -1){
            const next = item.nextElementSibling || item.nextSibling
            if(next) {
              next.remove()
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}

.head-info {
  position: relative;
  text-align: center;
  margin-bottom: 10px;
  margin-left: auto;
  padding: 6px 3px;
  border-radius: 3px;
  &.center {
    text-align: center;
  }
  span {
    color: #fff;
    display: inline-block;
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 4px;
    white-space:nowrap;
  }
  p {
    color: #fff;
    font-size: 24px;
    line-height: 32px;
    margin: 0;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  em {
    background-color: #e8e8e8;
    position: absolute;
    height: 56px;
    width: 1px;
    top: 0;
    right: 0;
  }
}
.card1{
  background: #6dbaf0;
}
.card2{
  background: #5debdd;
}
.card3{
  background: #fab7e0;
}
.project-list {
  .card-title {
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
      &:hover {
        color: #1890ff;
      }
    }
  }
  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;
      &:hover {
        color: #1890ff;
      }
    }
    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }
  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}
.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;
  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
  }
}
.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;
    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }
    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}
.extra .ant-row {
  display: flex;
}
.extra .ant-row .ant-col-2 {
  flex: 1;
}
.staticList .ant-col-2,.staticList .ant-col-3{
  padding: 0px 4px !important;
}
</style>