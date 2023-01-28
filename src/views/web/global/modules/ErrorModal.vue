<template>

  <a-modal
    :title="title"
    :visible="visible"
    :width="800"
    @ok="handleOk"
    @cancel="handleOk"
    :maskClosable="false"
  >
    <div style="maxWidth:800px;maxHeight:380px;overflow:auto">
      <p
        v-for="(item, index) in entityList"
        :key="index"
      >
        <template v-if="showLine">
          <span v-if="item.color" :class="getColor(item.color)">第{{ item.line }}行 - {{ item.message }}</span>
          <span v-else>第{{ item.line }}行 - {{ item.message }}</span>
        </template>
        <template v-else>
          <span v-if="item.color" :class="getColor(item.color)">{{ item.message }}</span>
          <span v-else>{{ item.message }}</span>
        </template>
      </p>
    </div>
    <!-- <happy-scroll
    :bodyStyle="{'height':'350px'}"
      color="rgba(23, 22, 22, 0.68)"
      size="5"
      resize
      hide-horizontal
    >
      <a-spin :spinning="confirmLoading">
        <p
          v-for="(item, index) in entityList"
          :key="index"
        >
          <template v-if="showLine">
            <span v-if="item.color" :class="getColor(item.color)">第{{ item.line }}行 - {{ item.message }}</span>
            <span v-else>第{{ item.line }}行 - {{ item.message }}</span>
          </template>
          <template v-else>
            <span v-if="item.color" :class="getColor(item.color)">{{ item.message }}</span>
            <span v-else>{{ item.message }}</span>
          </template>
        </p>
      </a-spin>
    </happy-scroll> -->
  </a-modal>
</template>
<script>
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
export default {
  name: 'ErrorModal',
  components: { HappyScroll }, //在组件内注册
  data() {
    return {
      visible: false,
      confirmLoading: false,
      title: '',
      showLine:true,
      entityList: []
    }
  },
  methods: {
    showModal(res) {
      this.entityList = res
      this.visible = true
    },
    getColor(val) {
      let color = ''
      switch (val) {
        case 'red':
          color = 'red'
          break
        case 'green':
          color = 'green'
          break
      }
      return color
    },
    // eslint-disable-next-line no-unused-vars
    handleOk(e) {
      this.$emit('ok')
      this.visible = false
      this.showLine = true
    }
  }
}
</script>

<style scoped>
p {
  margin-bottom: 8px;
}
.green {
  color: green;
}
.red {
  color: red;
}
</style>
