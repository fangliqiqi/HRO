export default {
  methods: {
    getSaveParams(arr){
      let nodeTransferConfigs = []
      if(this.sonNodeProcess && this.sonNodeProcess.length){
        let obj = {}
        this.sonNodeProcess.map(item=>{
          obj[item.processId] = item.id
        })
        arr.forEach(item=>{
          if(obj[item]){
            nodeTransferConfigs.push({
              processId:item,
              id:obj[item]
            })
          }else{
            nodeTransferConfigs.push({
              processId:item
            })
          }
        })
      }else{
        arr.forEach(item=>{
          nodeTransferConfigs.push({
            processId:item
          })
        })
      }
      return nodeTransferConfigs
    },
    // 保存节点属性
    saveNodeAttribute() {
      const nodeTransferConfigs = this.getSaveParams(this.nodeAttributeForm.nodeTransferConfigs)
      this.editor.executeCommand(() => {
        // 获取画布
        const page = this.editor.getCurrentPage();
        // 获取所选对象
        const selectedItem = page.getSelected()[0];
        // console.log(this.nodeAttributeForm,222)
        page.update(selectedItem.id, {
          label: this.nodeAttributeForm.label,
          size: this.nodeAttributeForm.width + "*" + this.nodeAttributeForm.height,
          color: this.nodeAttributeForm.color,
          description: this.nodeAttributeForm.description || "",
          countersign: this.nodeAttributeForm.countersign,
          backType: this.nodeAttributeForm.backType,
          allowDispatch: this.nodeAttributeForm.allowDispatch,
          handleAllowNext: this.nodeAttributeForm.handleAllowNext,
          allowThis: this.nodeAttributeForm.allowThis,
          nodePrimissionList: this.nodeAttributeForm.nodePrimissionList,
          nodeReaderPromissionList:this.nodeAttributeForm.nodeReaderPromissionList,
          nodeTransferConfigs: nodeTransferConfigs,
        });
      });
    },
    savePartNodeAttr(){
      const nodeTransferConfigs = this.getSaveParams(this.nodeAttributeForm.nodeTransferConfigs)
      this.editor.executeCommand(() => {
        // 获取画布
        const page = this.editor.getCurrentPage();
        // 获取所选对象
        const selectedItem = page.getSelected()[0];
        page.update(selectedItem.id, {
          label: this.nodeAttributeForm.label,
          size: this.nodeAttributeForm.width + "*" + this.nodeAttributeForm.height,
          color: this.nodeAttributeForm.color,
          description: this.nodeAttributeForm.description || "",
          countersign: this.nodeAttributeForm.countersign,
          backType: this.nodeAttributeForm.backType,
          allowDispatch: this.nodeAttributeForm.allowDispatch,
          handleAllowNext: this.nodeAttributeForm.handleAllowNext,
          allowThis: this.nodeAttributeForm.allowThis,
          nodeTransferConfigs: nodeTransferConfigs,
        })
      })
    },
    // 保存边属性
    saveEdgeAttribute() {
      this.editor.executeCommand(() => {
        // 获取画布
        const page = this.editor.getCurrentPage();
        // 获取所选对象
        const selectedItem = page.getSelected()[0];
        page.update(selectedItem.id, {
          label: this.edgeAttributeForm.label,
          shape: this.edgeAttributeForm.shape,
          description: this.edgeAttributeForm.description || "",
          opinionMustFlag: this.edgeAttributeForm.opinionMustFlag,
          opinion: this.edgeAttributeForm.opinion || "",
          priorityFlag: this.edgeAttributeForm.priorityFlag,
          sameForPrew: this.edgeAttributeForm.sameForPrew,
          routeType: this.edgeAttributeForm.routeType,
          sequenceNo: this.edgeAttributeForm.sequenceNo || "",
          timeoutRoam: this.edgeAttributeForm.timeoutRoam,
          nodeRouteConditionList:this.edgeAttributeForm.nodeRouteConditionList,
        });
      });
    },
  }
};
