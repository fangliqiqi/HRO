<template>
  <a-layout-sider
    :class="['sider',isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="200px"
    :collapsible="collapsible"
    v-model="collapsed" 
    :trigger="null">
    <logo />
    <s-menu
      :collapsed="collapsed"
      :menu="menus"
      :theme="theme"
      @select="onSelect"
      :mode="mode"
      style="padding: 0;"></s-menu>
  </a-layout-sider>

</template>

<script>
  import ALayoutSider from "ant-design-vue/es/layout/Sider"
  import Logo from '../tools/Logo'
  import SMenu from './index'
  import { mixin, mixinDevice } from '@/utils/mixin.js'

  export default {
    name: "SideMenu",
    components: { ALayoutSider, Logo, SMenu },
    mixins: [mixin, mixinDevice],
    props: {
      mode: {
        type: String,
        required: false,
        default: 'inline'
      },
      theme: {
        type: String,
        required: false,
        default: 'dark'
      },
      collapsible: {
        type: Boolean,
        required: false,
        default: false
      },
      collapsed: {
        type: Boolean,
        required: false,
        default: false
      },
      menus: {
        type: Array,
        required: true
      }
    },
    methods: {
      onSelect (obj) {
        this.$emit('menuSelect', obj)
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/ .ant-menu-submenu .ant-menu-submenu-inline .ant-menu-submenu-title{
    font-weight: normal;

  }
  /deep/ .ant-menu-item{
    padding-left: 60px !important;
  }
  /deep/ .ant-menu-root>.ant-menu-submenu>.ant-menu-sub>.ant-menu-item{
    padding-left: 48px !important;
  }
  /deep/ .ant-menu-item::after{
    left:0 !important;
    right: inherit !important;
  }
  /deep/ .ant-menu-submenu-title{
    font-weight: bold;
  }
  
</style>
