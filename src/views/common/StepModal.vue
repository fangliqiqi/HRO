<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="800"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-steps>
      <a-step v-for="f in flows" :status="f.status" :key="f.title" :title="f.title" :description="f.description" >
        <a-icon :type="f.icon" slot="icon" />
      </a-step>
      <!--<a-step title="In Progress" description="This is a description." />
      <a-step title="Waiting" description="This is a description." />-->
    </a-steps>
  </a-modal>
</template>

<script>
export default {
  name: 'StepModal',
  data() {
    return {
      visible: false,
      title: '流程详情',
      flows: [],
      status: '',
      current: 0,
    }
  },
  methods: {
    show(flow) {
      this.visible = true;
      this.flows = flow;
    },
    handleOk() {
      this.close()
    },
    handleCancel() {
      this.close();
    },
    close() {
      this.visible = false
      this.$emit('close')
    }
  },
}
</script>

<style scoped>

</style>