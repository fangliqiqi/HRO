
<template>
  <a-modal
    :title="title"
    :visible="visible"
    @ok="handleCancel"
    @cancel="handleCancel"
    :maskClosable="false"
    :centered="true"
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
              :showUploadList="{showRemoveIcon:false}"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">点击或拖拽上传</p>
            </a-upload-dragger>
          </a-col>
          <a-col :span="24" v-if="!errMsg">
            <p style="margin:1em 0em 0em">处理进度</p>
            <a-progress
              :percent="process"
              :status="status"
              :strokeColor="strokeColor"
            />
            <template v-if="type">
              <p style="margin:1em 0em">处理结果</p>
              <div style="height:300px;">
                <happy-scroll
                  color="rgba(23, 22, 22, 0.68)"
                  size="5"
                  bigger-move-h="end"
                  resize
                  hide-horizontal
                >
                  <ul class="msgList">
                    <li
                      v-for="(item,index) in resList"
                      :key="index"
                      :class="[isShow(item.result) ? 'red' : 'green']"
                    >
                      第{{ parseInt(item.description)+1 }}行：{{ item.tips }}
                    </li>
                  </ul>
                </happy-scroll>
              </div>
            </template>
          </a-col>
          <a-col :span="24" v-else>
            <template>
              <p style="margin:1em 0em">反馈结果：</p>
              <p style="margin:1em 0em">{{ errMsg }}</p>
            </template>
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
  import { downFile } from '@/api/manage'

  export default {
    name: 'BatchUplodsModal',
    components: {HappyScroll}, //在组件内注册
    props: {
      type:{
        type: Number,
        default: 0,
        required: false
      },
    },
    data() {
      return {
        visible: false,
        confirmLoading:false,
        title: '',
        websock:{},
        fileList:[],
        resList:[],//处理结果
        process:0, //处理进度
        errMsg:null,//上传错误的数据
        randomStr:'',
        numType:'',
        isUpload:true,
        status:'active',
        strokeColor:'#1890ff',
        url:{
          importUrl:'/busiInsurance/tbusinessinsurance/batchPolicyNoAndFee',
          method:'PUT'
        },
        fields:["社保缴纳地", "身份证号", "社保编号", "员工姓名", "社保缴纳月份", "养老基数",
        "养老单位缴费", "养老个人缴费", "个人补缴利息", "单位补缴利息", "失业基数","失业单位缴费",
        "失业个人缴费", "医保基数", "医保单位缴费", "医保个人缴费", "单位医疗救助金", "工伤基数",
        "工伤缴费", "生育基数", "生育缴费", "个人医疗救助金", "总金额", "社保生成月份"],
        fieldszero:["社保缴纳地", "身份证号","员工姓名", "社保缴纳月份", "社保生成月份",
        "参保险种","个人缴费基数","单位缴费基数","单位缴费额","个人缴费额"],
        fieldsone:["社保缴纳地", "身份证号", "社保编号", "员工姓名", "社保缴纳月份", "医保基数",
        "医保单位缴费","医保个人缴费","单位医疗救助金","个人医疗救助金","社保生成月份"],
      }
    },
    watch:{
      'process':function(val){
        if(val >= 100 && this.isUpload){
          const result = this.resList.find(function(val){
            return val.result > 0
          })
          console.log(result,this.resList)
          if(result){
            this.status = 'exception'
            this.strokeColor = '#e21e34'
            this.$message.error("导入失败！")
          }else{
            this.strokeColor = '#52c41a'
            this.status = 'success'
            this.$message.success("导入成功！")
          }
          this.out() // 关闭连接
          const _this = this
          if(_this.type === 0){
            this.$confirm({
              title: '是否下载导入反馈?',
              centered:true,
              onOk() {
                downFile(`/hrSocial/paymentInfoLog/exportPaymentInfoLog`, null).then((res) => {
                  if (res.size > 0) {
                    var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'}); // application/vnd.ms-excel这里表示xls类型
                    var downloadElement = document.createElement('a')
                    var href = window.URL.createObjectURL(blob) // 创建下载的链接
                    downloadElement.href = href
                    downloadElement.download = _this.numType=='0'?`养老三险导入反馈.xls`: _this.numType=='1'?`医保导入反馈.xls`:`社保导入反馈.xls`// 下载后文件名
                    document.body.appendChild(downloadElement)
                    downloadElement.click() // 点击下载
                    document.body.removeChild(downloadElement) // 下载完成移除元素
                    window.URL.revokeObjectURL(href) // 释放掉blob对象
                  } else {
                    _this.$message.warning(`${(res.msg || res.message)} 失败！`)
                  }
                }).finally(()=>{
                  _this.isUpload = false
                  _this.handleCancel()
                })
              },
              onCancel(){
                _this.handleCancel()
              }
            })
          }
          
        }
      }
    },
    methods: {
      show(randomStr,numType) {
        this.process = 0
        this.randomStr = randomStr
        this.numType = numType
        this.visible = true
        this.isUpload = true
      },
      isShow(type){
        if(String(type) === '0'){
          return false
        }else if(type === 'green'){
          return false
        }else{
          return true
        }
      },

      startWebSocket(){
        // const ws = "ws://127.0.0.1:9910/push"
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
        console.log(_this.process,"接收消息: " + e.data)
        
        const obj = JSON.parse(e.data);
          setTimeout(function(){
            if(obj.fMessageType == 4 || obj.fMessageType == 6){
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
          "registeredAlias":this.randomStr,
          "fMessageType":code
        }
        console.log("发送信息 >>>>" + JSON.stringify(msg));
        this.my_socket.send(JSON.stringify(msg));
      },
      out() {
        console.log("主动退出");
        this.my_socket.close();
      },

      beforeUpload() {
        this.process = 0
        this.status = 'active'
        this.strokeColor = '#1890ff'
        this.resList = this.fileList = []
        // this.fileList = [...this.fileList, file]
        this.startWebSocket()
        return false
      },
      handleChange(file){
        this.uploadFilesChange(file.file)
      },
      // 实现导入
      uploadFilesChange(file) {
        const _this = this
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
            if(_this.type === 0){
              // 判断是否为指定模板
              if(data[sheetName].length === 0){
                this.$message.warning('模板文件为空，请用标准模板！')
                return false
              }else{
                const keysArr = Object.keys(data[sheetName][0])
                const result = keysArr.filter(item=>{
                    return  _this.numType =='0'?_this.fieldszero.includes(item):_this.numType =='1'?_this.fieldsone.includes(item):_this.fields.includes(item)
                  })
                if(_this.numType =='0'&&result.length !== 10){
                    this.$message.warning('请用养老三险标准模板！')
                    return false 
                }else if(this.numType =='1'&&result.length !== 11){
                    this.$message.warning('请用医保标准模板！')
                    return false
                }else if(this.numType =='2'&&result.length !== 24){
                    this.$message.warning('请用社保-合并版标准模板！')
                    return false
                }
              }
            }
            const newData = handleImportData(data[sheetName])
            const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
            //开始异步提交
            httpActionHeader(this.url.importUrl, JSON.stringify(newData), this.url.method, contextType,3000).then((res) => {
              // let msg = res.message || res.msg
              // if (Number(res.code) === 200) {
              //   // this.$message.success('导入成功！')
              //   // this.send()
              //   // this.initWebSocket(res.data)
              // }else{
              //   this.errMsg = res.msg
              // }
              if(res.code!=200){
                this.errMsg = res.msg
              }
            }).finally(() => {                                                                                                                                                                                                                                                                                                                                                                       
              this.send()
              this.fileList = [...this.fileList, file]
            })

          } catch (e) {
            console.log(e);
            // 这里可以抛出文件类型错误不正确的相关提示
            this.$message.error('文件上传错误！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file)
      },
      handleCancel() {
        this.close()
        this.errMsg = null
      },
      close() {
        this.$emit('close')
        this.process = 0
        this.status = 'active'
        this.strokeColor = '#1890ff'
        this.resList = this.fileList = []
        this.visible = false
        if(this.my_socket) {
          this.out()
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  .happy-scroll-bar{
    cursor: pointer;
  }
  .msgList{
    padding:0px 10px 10px 0px;
    list-style-type: none;
  }

  .red{
    color: red;
  }
  .green{
    color: green;
  }
  .confirmDiv {
    :global(.ant-modal-content) {
      margin-top: 12%;
    }
  }
</style>
