<template>
  <a-modal
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @cancel="handleCancel"
    @ok="handleCancel"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-upload
      :defaultFileList="fileAttach"
      listType="picture"
      :showUploadList="{showRemoveIcon:false}"
    >
    </a-upload>
  </a-modal>
</template>

<script>

  export default {
    name: 'ShowAttachModal',
    data() {
      return {
        title:'附件',
        visible:false,
        fileAttach:[]

      }
    },
    methods: {
      show(record){
        this.visible = true
        this.fileAttach = record.atta.map(item=>{
          return {
            uid:item.id,
            name:item.attaName,
            url:item.attaUrl,
            status: 'done',
          }
        })
      },
      handleCancel(){
        this.visible = false
        this.fileAttach = []
      }
    }
  }

</script>
