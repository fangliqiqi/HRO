<template>

  <iframe
    :id="id"
    :src="url"
    frameborder="0"
    width="100%"
    height="800px"
    title="iframe"
    scrolling="auto"></iframe>

</template>

<script>
  
  export default {
    name: "IframePageContent",
    data () {
      return {
        url: "",
        id:""
      }
    },
    created () {
      this.goUrl()
    },
    updated () {
      this.goUrl()
    },
    watch: {
      $route() {
        this.goUrl();
      }
    },
    methods: {
      goUrl () {
        let url = this.$route.meta.url
        let id = this.$route.path
        this.id = id
        if (url !== null && url !== undefined) {
          this.url = url
        }
      }
    }
  }
</script>

<style>
</style>