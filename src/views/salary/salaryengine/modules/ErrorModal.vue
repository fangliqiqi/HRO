<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    > 
      <div style="marginTop:18px;maxHeight:450px;overflow:auto">
        <p
          style="padding:10px"
          v-for="(item, index) in entityList"
          :key="index"
        >{{ item.message }}</p>
      </div>
      <a-checkbox @change="onChange" :checked="defaultChecked" v-if="checkShow" style="paddingTop:10px">
        重复数据是否允许导入
      </a-checkbox>
    </a-modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        visible: false,
        title: '',
        entityList: [],
        checkShow:false,
        defaultChecked:false,

      }
    },
    methods: {
      showModal(res) {
       if(res.repeatInfo!=null&&res.repeatInfo.length>0&&(res.errorInfo==null||res.errorInfo.length==0)){
          this.entityList = res.repeatInfo
          this.checkShow = true
        }else{
           this.entityList = res.errorInfo
           this.checkShow = false
        }
        this.visible = true
        this.defaultChecked = false
      },
      onChange(){
        this.defaultChecked = !this.defaultChecked
      },
      handleOk() {
        if(this.defaultChecked){
          this.$emit('checked', true);
        }
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
