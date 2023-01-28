<template>
  <a-drawer
    title="流程图"
    placement="right"
    :visible="drawerVisible"
    :destroyOnClose="true"
    :maskClosable="false"
    :width="1200"
    :bodyStyle="{padding:0}"
    @close="onClose"
  >
    <VueG6Editor
      :id="id"
      @onSave="handleSave"
      :dataSource="dataSource"
      :oprator="oprator"
      ref="G6EditorForm"
    />
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import VueG6Editor from "@/components/g6edit/index";

  export default {
    name: 'ProcessDetailModal',
    components:{
      VueG6Editor
    },
    data() {
      return {
        drawerVisible:false,
        id:"",
        oprator:0, //当前操作
        url: {
          detail: '/process/tprocess/getProcessVoById?id=',
          add: '/process/tprocess/saveProcessVo'
        },
        dataSource:{},
      }
    },
    methods: {
      show(id){
        this.id = id
        httpAction(this.url.detail+this.id,null,'get').then((res)=>{
          if(res.code === 200){
            this.oprator = (res.data.processNodeList.length) ? 1 : 0
            this.dataSource = this.formatData(res.data)
            this.drawerVisible = true
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      handleSave(data){
        httpAction(this.url.add,data,'post').then((res)=>{
          if(res.code === 200){
            this.$message.success('保存成功！')
            this.drawerVisible = false
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      onClose(){
        this.drawerVisible = false
        this.id = ''
        this.dataSource = {}
      },
      formatData(data){
        const dataSource = {
          edges:[],
          nodes:[],
        }
        dataSource.nodes = data.processNodeList.map((item)=>{
          return {
            id:item.logoTitle,
            tid:item.id,
            label:item.name,
            x:parseFloat(item.coordinatex),
            y:parseFloat(item.coordinatey),
            nodetype:item.type,
            shape:item.shape,
            size:item.size,
            handleAllowNext:item.handleAllowNext,
            description:item.description,
            countersign:item.countersign,
            color:item.color,
            backType:item.backType,
            allowThis:item.allowThis,
            allowDispatch:item.allowDispatch,
            processId:this.id,
            nodePrimissionList:item.nodePrimissionList,
            nodeReaderPromissionList:item.nodeReaderPromissionList,
            nodeTransferConfigs:item.nodeTransferConfigs
          }
        })
        dataSource.edges = data.nodeRouteList.map((item)=>{
          return {
            label:item.name,
            source:item.prewNode,
            sourceAnchor:Number(item.preNodeAnchor),
            target:item.nextNode,
            targetAnchor:Number(item.nextNodeAnchor),
            id:item.id,
            logoTitle:item.logoTitle,
            // tid:item.id,
            processId:this.id,
            description:item.description,
            opinion:item.opinion,
            opinionMustFlag:item.opinionMustFlag,
            priorityFlag:item.priorityFlag,
            routeType:item.routeType,
            sameForPrew:item.sameForPrew,
            sequenceNo:item.sequenceNo,
            shape:item.shape || 'flow-polyline',
            timeoutRoam:item.timeoutRoam,
            nodeRouteConditionList:item.nodeRouteConditionList,
          }
        })
        return dataSource
      },
    }

  }
</script>
