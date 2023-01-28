<template>
  <div class="editable-cell">
    <div
      v-if="editable"
      class="editable-cell-input-wrapper"
    >
      <a-input-number
        :value="selfValue"
        :precision="2"
        @change="handleChange"
        @pressEnter="check"
        @blur="inputBlur"
      />
    </div>
    <div
      v-else
      class="editable-cell-text-wrapper"
    >
      {{ text || '0' }}
      <a-icon
        type="edit"
        class="editable-cell-icon"
        @click="edit"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      description: '可编辑单元格-修改开票申请中商品金额',
      selfValue: this.text,
      editable: false
    }
  },
  methods: {
    handleChange(value) {
      this.selfValue = value?String(value):'0'
    },
    check() {
      this.editable = false
      this.$emit('change', this.selfValue || '0')
    },
    inputBlur(){
      this.editable = false
      this.$emit('change', this.selfValue || '0')
    },
    edit() {
      this.editable = true
    }
  }
}
</script>

<style scoped>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  /* position: absolute;
  right: 0; */
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
