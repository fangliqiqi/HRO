
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
        <p>{{ item.status }}</p>
        <p>调整人： {{ userMap[item.createUser] }}</p>
        <p>调整时间： {{ item.createTime }}</p>
        <p>说明： {{ item.remark }}</p>
        <div class="flex">
          <div>附件： </div>
          <div>
            <p
              v-for="file in item.attaList"
              :key="file.id"
            >
              <a-button type="link" class="underline" @click="detailFile(file.attaUrl)">{{ file.attaName }}</a-button>
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
    name: "OperateLogModal",
    data(){
      return {
        visible: false,
        list: [],
        userMap:{}
      }
    },
    created(){
      httpAction('/admin/user/userDic', '', 'GET').then(res=>{
        if(res.code === 200){
          this.userMap = res.data;
        }
      })
    },
    methods:{
      show(record){
        httpAction(`/hrSocial/tfinanceprocessrecord/getListByIdType?mainId=${record.id}&type=1`,null,'get').then(res=>{
          if(res.code === 200){
            this.list = res.data;
            this.visible = true;
          }else{
            this.$message.warning(res.msg);
          }
        })
      },
      detailFile(url){
        window.open(url,'_blank');
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