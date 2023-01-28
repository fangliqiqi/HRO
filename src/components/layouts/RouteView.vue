<template>
  <keep-alive v-if="keepAlive" :include="includes">
    <router-view />
  </keep-alive>
  <router-view v-else />
</template>

<script>
  import Vue from "vue"

  export default {
    name: "RouteView",
    computed: {
      keepAlive() {
        this.getIncludes()
        console.log(this.$route.meta.keepAlive)
        return true
        // if (this.getIncludes()) { // 确保先执行
        //   return this.$route.meta.keepAlive ? true : true // 全部缓存
        // } else {
        //   return this.$route.meta.keepAlive ? true : true // 全部缓存
        // }
      }
    },
    data() {
      return {
        includes: [], // 需要缓存的页面
      }
    },
    methods: {
      getIncludes() {
        this.includes = Vue.ls.get('global_includes') ? Vue.ls.get('global_includes') : []
        return true
      },
    },
  }
</script>