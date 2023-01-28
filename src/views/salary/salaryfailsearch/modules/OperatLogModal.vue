<template>
  <a-modal
    title="操作日志"
    :width="800"
    placement="right"
    :closable="false"
    :visible="visible"
    :maskClosable="false"
    @ok="handleCancel"
    @cancel="handleCancel"
  >
    <a-timeline>
      <a-empty description="暂无操作日志" v-if="list.length==0" />
      <a-timeline-item
        class="bottom"
        v-for="item in list"
        :key="item.id"
      >
        <p>操作内容： {{ item.operContent }}</p>
        <p>操作人： {{ item.operator }}</p>
        <p>操作时间： {{ item.operTime }}</p>
        <p>说明： {{ item.description }}</p>
        <div class="flex">
          <div>附件： </div>
          <div>
            <p
              v-for="(file,index) in item.fileList"
              :key="file"
            >
              <a-button type="link" class="underline" @click="detailFile(file)">{{ item.fileName[index] }}</a-button>
            </p>
          </div>
        </div>
      </a-timeline-item>
    </a-timeline>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'

  export default {
    name: "OperatLogModal",
    data(){
      return {
        visible: false,
        list: [],
      }
    },
    methods:{
      show(record){
        httpAction(`/salary/tfailureoperlog/${record.id}`,null,'get').then(res=>{
          if(res.code === 200){
            this.list = res.data.map(item=>{
              let temp = [];
              let names = [];
              if(item.fileId){
                temp = item.fileId.split(',');
                names = item.appendix.split(',');
              }
              item.fileList = temp;
              item.fileName = names;
              return item
            });
            console.log(this.list)
            this.visible = true;
          }else{
            this.$message.warning(res.msg);
          }
        })
      },
      detailFile(fid){
        httpAction(`/salary/tfailureoperlog/ossFileUrl/${fid}`,null,'get').then(res=>{
          if(res.code === 200){
            window.open(res.data.attaSrc,'_blank');
          }else{
            this.$message.warning(res.msg);
          }
        })
        
      },
      handleCancel(){
        this.visible = false;
        this.list = [];
      }
    }
  }
</script>

<style lang="less" scoped>
  .bottom p{
    margin-bottom: 10px;
  }
  .underline{
    padding: 0px;
    height: auto;
    border-bottom: 1px solid;
    border-radius: 0px;
  }
  .flex{
    display: flex;
    p{
      margin: 0px 0px 5px;
    }
  }
</style>