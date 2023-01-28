<template>
  <div
    class="user-wrapper"
    :class="theme"
  >
    <span
      class="action"
      @click="feedBack"
      title="用户反馈"
    >
      <a-icon type="message" />
    </span>
    <span
      class="action"
      @click="guid"
      title="用户手册"
    >
      <a-icon type="question-circle-o"></a-icon>
    </span>
    <header-notice class="action" />
    <a-dropdown>
      <span class="action action-full ant-dropdown-link user-dropdown-menu">
        <!--<a-avatar class="avatar" size="small" :src="getAvatar()"/>-->
        <span v-if="isDesktop()">欢迎您，{{ nickname() }}</span>
      </span>
      <a-menu
        slot="overlay"
        class="user-dropdown-menu-wrapper"
      >
        <!-- <a-menu-item key="0">
          <router-link :to="{ name: 'account-center' }">
            <a-icon type="user"/>
            <span>个人中心</span>
          </router-link>
        </a-menu-item> -->
        <a-menu-item
          key="1"
          @click="openDialog"
        >
          <a-icon type="setting" />
          <span>密码修改</span>
        </a-menu-item>
        <!-- <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout"/>
            <span>退出登录</span>
          </a>
        </a-menu-item> -->
      </a-menu>
    </a-dropdown>
    <span class="action">
      <a
        class="logout_title"
        href="javascript:;"
        @click="handleLogout"
      >
        <a-icon type="logout" />
        <span v-if="isDesktop()">&nbsp;退出登录</span>
      </a>
    </span>

    <a-modal
      title="修改密码"
      :width="800"
      placement="right"
      :closable="false"
      @ok="handleOk"
      @cancel="openDialog"
      cancelText="关闭"
      okText="保存"
      :visible="visible"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <a-spin :spinning="confirmLoading">
        <a-form
          :form="form"
          layout="inline"
          class="ant-advanced-search-form"
        >
        
          <a-row :gutter="24">
            <!-- <a-col :span="24">
              <a-form-item label="用户名">
                <a-input
                  placeholder="请输入用户名"
                  v-decorator="['username', validatorRules.username ]"
                />
              </a-form-item>
            </a-col> -->
            <a-col
              :span="21"
              :offset="3"
            >
              <a-form-item
                label="原密码"
                class="formLabel"
              >
                <a-input
                  placeholder="请输入原密码"
                  type="password"
                  v-decorator="['password', validatorRules.password ]"
                />
              </a-form-item>
            </a-col>
            <a-col
              :span="21"
              :offset="3"
            >
              <a-form-item
                label="新密码"
                class="formLabel"
              >
                <a-input
                  placeholder="请输入新密码"
                  type="password"
                  v-decorator="['newpassword', validatorRules.newpassword ]"
                />
              </a-form-item>
            </a-col>
            <a-col
              :span="21"
              :offset="3"
            >
              <a-form-item
                label="确认新密码"
                class="formLabel"
              >
                <a-input
                  placeholder="请输入确认新密码"
                  type="password"
                  @blur="handleConfirmBlur"
                  v-decorator="['comfirmPassword', validatorRules.comfirmPassword ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
  import HeaderNotice from './HeaderNotice'
  import { mapActions, mapGetters } from 'vuex'
  import { mixinDevice } from '@/utils/mixin.js'
  import { httpAction } from '@/api/manage'
  //import { USER_INFO} from "@/store/mutation-types"
  import Vue from 'vue'
  import IntroJs from 'intro.js'
  import 'intro.js/introjs.css'

  Vue.use(IntroJs)

  export default {
    name: "UserMenu",
    mixins: [mixinDevice],
    components: {
      HeaderNotice
    },
    props: {
      theme: {
        type: String,
        required: false,
        default: 'dark'
      }
    },
    data(){
      return {
        visible:false,
        confirmLoading: false,
        confirmDirty: false,
        form: this.$form.createForm(this),
        validatorRules:{
          username: { rules: [{ required: true, message: '请输入用户名!' },{max:50,message:'用户名最多50个字符!'}] },
          password: { rules: [{ required: true, message: '请输入原密码!' },{max:20,message:'原密码最多20位!'}] },
          newpassword: { rules: [{ required: true, message: '请输入新密码!' },{validator: this.validateToNextPassword}] },
          comfirmPassword: { rules: [{ required: true, message: '请输入确认新密码!' },{validator: this.compareToFirstPassword}] },
        }
      }
    },
    methods: {
      ...mapActions(["Logout"]),
      ...mapGetters(["nickname", "avatar","userInfo"]),
      getAvatar(){
        return window._CONFIG['imgDomainURL']+"/"+this.avatar()
      },
      openDialog(){
        this.visible = (this.visible) ? false :true
      },
      handleOk(){
        // 
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            let param = {
              userId:this.userInfo().id,
              username:this.userInfo().username,
              password:values.password,
              newpassword:values.newpassword
            }
            
            httpAction('/admin/user/updateUserPassword', param, "POST").then((res) => {
              if (res.code === 200) {
                this.$message.success('修改密码成功！')
                this.visible = false
              } else {
                this.$message.warning(res.msg)
              }
            }).finally(() => {
              this.confirmLoading = false
            })
          }
        })
      },
      handleConfirmBlur(e) {
        const value = e.target.value;
        this.confirmDirty = this.confirmDirty || !!value;
      },
      validateToNextPassword(rule, value, callback){
        const form = this.form;
        if (value && this.confirmDirty) {
          form.validateFields(['comfirmPassword'], { force: true })
        }
        if(! /^[\S]{6,20}$/.test(value) ){
          callback('新密码长度在6~20位,且不能出现空格!')
        }
        callback()
      },
      compareToFirstPassword(rule, value, callback) {
        const form = this.form
        if(! /^[\S]{6,20}$/.test(value) ){
          callback('新密码长度在6~20位,且不能出现空格!')
        }
        if (value && value !== form.getFieldValue('newpassword')) {
          callback('两次输入的密码不一致!')
        } else {
          callback()
        }
      },
      //引导
      guid(){
        window.open("https://shimo.im/docs/r6W8YqQPtkVdjPdH")
        // IntroJs().setOptions({
        //   prevLabel: "上一条",
        //   nextLabel: "下一条",
        //   skipLabel: "跳过",
        //   doneLabel: "结束"
        // }).oncomplete(function(){
        //   //点击跳过按钮后执行的事件
        // }).onexit(function(){
        //   //点击结束按钮后， 执行的事件
        // }).start();
      },
      // 用户反馈
      feedBack(){
        window.open("https://support.qq.com/product/130449")
      },
      handleLogout() {
        const that = this
        this.$confirm({
          title: '提示',
          content: '真的要注销登录吗 ?',
          onOk() {
            return that.Logout({}).then(() => {
                window.location.href="/";
              //window.location.reload()
            }).catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
          },
          onCancel() {
          },
        });
      }
    }
  }
</script>

<style lang="less" scoped>
.logout_title {
  color: inherit;
  text-decoration: none;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
.formLabel {
  :global(.ant-form-item-label) {
    width: 150px;
  }
  input {
    width: 250px;
  }
}
</style>