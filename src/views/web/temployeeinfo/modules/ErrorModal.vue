<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p v-for="(item, index) in entityList" :key="index">{{ item.name }} - {{ item.certificatesNo }}</p>
    </a-modal>
  </div>
</template>
<script>
  export default {
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
      handleOk() {
        this.visible = false
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
      }
    }
  }
</script>
