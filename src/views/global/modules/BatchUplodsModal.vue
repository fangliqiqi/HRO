<template>
  <a-modal
    :title="title"
    :visible="visible"
    @ok="handleCancel"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-card :bordered="false">
        <a-row>
          <a-col :span="24">
            <a-upload-dragger
              name="file"
              @change="handleChange"
              :fileList="fileList"
              :beforeUpload="beforeUpload"
              accept=".xls,.xlsx"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">点击或拖拽上传</p>
            </a-upload-dragger>
          </a-col>
          <a-col :span="24">
            <p style="margin:1em 0em 0em">处理进度</p>
            <a-progress
              :percent="process"
              :status="status"
              :strokeColor="strokeColor"
            />
            <p style="margin:1em 0em">处理结果</p>
            <div style="height:350px;">
              <happy-scroll
                color="rgba(23, 22, 22, 0.68)"
                size="5"
                bigger-move-h="end"
                resize
                hide-horizontal
              >
                <ul style="padding-bottom: 10px;">
                  <li
                    v-for="(item,index) in resList"
                    :key="index"
                    :class="[item.result ? 'red' : 'green']"
                  >
                    第{{ parseInt(item.description) }}行：{{ item.tips }}
                  </li>
                </ul>
              </happy-scroll>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </a-spin>
    <template slot="footer">
      <a-button @click.stop="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
import XLSX from 'xlsx'
// import SockJS from  'sockjs-client'
// import  Stomp from 'stompjs'
import { httpActionHeader } from '@/api/manage'
import { handleImportData } from '@/utils/common'
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'

export default {
  name: 'BatchUplodsModal',
  components: {HappyScroll}, //在组件内注册
  data() {
    return {
      visible: false,
      confirmLoading:false,
      title: '',
      websock:{},
      fileList:[],
      resList:[],//处理结果
      process:0, //处理进度
      userId:'',
      isUpload:true,
      status:'active',
      strokeColor:'#1890ff',
      url:{
        importUrl:'/hrSocial/tpaymentinfo/analysisJsonStringImportSocial',
        method:'POST'
      },
      randomString:''
    }
  },
  watch:{
    'process':function(val){
      if(String(val) === '100'){
        const result = this.resList.find(function(val){
          return val.result > 0
        })
        if(result){
          this.strokeColor = '#e21e34'
          this.$message.error("导入失败！")
        }else{
          this.strokeColor = '#52c41a'
          this.$message.success("导入成功！")
        }
        this.out() // 关闭连接
      }
    }
  },
  methods: {
    show(random) {
      this.randomString = random
      this.visible = true
    },

    startWebSocket(){
      this.my_socket = new WebSocket(window._CONFIG['wsURL']);
      this.my_socket.onopen = this.ws_onopen;
      this.my_socket.onerror = this.ws_onerror;
      this.my_socket.onmessage = this.ws_onmessage;
      this.my_socket.onclose = this.ws_onclose;
    },
    ws_onopen() {
      console.log("连接服务器 成功...")
    },
    ws_onerror() {
      console.log("连接服务器 错误...")
    },
    ws_onmessage(e) {
      const _this = this
      const obj = JSON.parse(e.data);
      setTimeout(function(){
        if(obj.fMessageType == 4){
          _this.send(5)
        }
        if(obj.fMessageType == 6){
          _this.send(5)
        }
        if(obj[0] && obj[0].data){
          const count = obj.length - 1
          _this.process = Math.round(obj[count].description / obj[count].data * 10000) / 100.00
          _this.resList = [..._this.resList,...obj]
          if(obj[count].description == obj[count].data){
            _this.send(9)
          }
        }
      },2000)

    },
    ws_onclose() {
      console.log("连接服务器 关闭...")
    },
    send(code) {
      code = (code) ? code : 3
      const msg = {
        "registeredAlias":this.$store.getters.userInfo.id,
        "fMessageType":code
      }
      this.my_socket.send(JSON.stringify(msg));
    },
    out() {
      this.my_socket.close();
    },

    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      this.startWebSocket()
      return false
    },
    handleChange(){
      const { fileList } = this
      this.uploadFilesChange(fileList[fileList.length - 1])
    },
    // 实现导入
    uploadFilesChange(file) {
      // 通过FileReader对象读取文件
      const fileReader = new FileReader()
      fileReader.onload = event => {
        try {
          const { result } = event.target
          // 以二进制流方式读取得到整份excel表格对象
          const workbook = XLSX.read(result, { type: 'binary' })
          // 存储获取到的数据
          const data = {}
          let sheetName = ''

          // 遍历获取每张工作表 除去隐藏表
          const allSheets = workbook.Workbook.Sheets
          for(const index in allSheets){
            const name = allSheets[index].name
            if(workbook.Sheets.hasOwnProperty(name) && allSheets[index].Hidden == 0){
              sheetName = name
              // 利用 sheet_to_json 方法将 excel 转成 json 数据
              data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name],{defval:'',blankrows:true}))
              break
            }
          }
          // 去除每个字段的前后空格
          const newData = handleImportData(data[sheetName])
          const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
          //开始异步提交
          httpActionHeader(this.url.importUrl, JSON.stringify(newData), 'POST', contextType,60000).then(() => {
            // let msg = res.message || res.msg
            // console.log(res)
            // this.send()
            // if (Number(res.code) === 200) {
            //   // this.initWebSocket(res.data)
            //   this.send()
            // }
          }).finally( ()=> {
            this.send()
          })

        } catch (e) {
          // 这里可以抛出文件类型错误不正确的相关提示
          this.$message.error('文件上传错误！')
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file)
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.process = 0
      this.status = 'active'
      this.strokeColor = '#1890ff'
      this.randomString = ''
      this.resList = this.fileList = []
      this.visible = false
      if(this.my_socket){
        this.out()
      }
    },
  },
}
</script>

<style scoped>
.red {
  color: red;
}
.green {
  color: green;
}
.happy-scroll-bar {
  cursor: pointer;
}
</style>
