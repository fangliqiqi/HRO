<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleOk"
      :maskClosable="false"
    >
      <p v-for="(item, index) in entityList" :key="index">第{{ item.line }}行 - {{ item.message }}</p>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'ErrorProcessModal',
  data() {
    return {
      visible: false,
      title: '',
      entityList: []
    }
  },
  methods: {
    showModal(res) {
      this.entityList = res;
      this.visible = true
    },
    // eslint-disable-next-line no-unused-vars
    handleOk(e) {
      this.$emit('ok')
      this.visible = false
    },
  }
}
</script>

<style scoped>
p{
  margin-bottom: 8px;
}
</style>
