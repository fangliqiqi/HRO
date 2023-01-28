<template>
  <a-modal
    title="上传头像"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :okText="'上传'"
    :width="1000"
    :destroyOnClose="true"
    @ok="handleOk"
  >
    <a-row :gutter="24">
      <a-col :span="12">
        <a-upload
          name="file"
          accept="image/*"
          :beforeUpload="beforeUpload"
          :fileList="[]"
        >
          <a-button type="primary">重新选择头像</a-button>
        </a-upload>
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :centerBox="option.centerBox"
          :infoTrue="option.infoTrue"
          :fixedBox="option.fixedBox"
          crossOrigin="anonymous"
          @realTime="realTime"
        ></vueCropper>
        <div class="obtn">
          <a-button @click="refreshCrop">重置</a-button>
          <a-button @click="changeScale(1)">+</a-button>
          <a-button @click="changeScale(-1)">-</a-button>
          <a-button @click="rotateImg(1)">↺</a-button>
          <a-button @click="rotateImg(2)">↻</a-button>
        </div>
      </a-col>
      <a-col :span="12">
        <div style="margin-top: 52px;">
          <div
            class="show-preview"
            :style="{'overflow': 'hidden', 'margin': '5px','textAlign':'center'}"
          >
            <div
              :style="previews.div"
              class="preview"
            >
              <img
                :src="previews.url"
                :style="previews.img"
                alt="预览"
              >
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
  import { postActionHeader } from '@/api/manage'
  import VueCropper from 'vue-cropper'
  import Vue from 'vue'

  Vue.use(VueCropper)

  export default {
    name: "UploadAvatarModules",
    data () {
      return {
        title:'上传头像',
        visible:false,
        avatar:'',
        fileList:[],
        previews:{},
        url:{
          importUrl:'hrGeneral/tprofilephotoatta/upload'
        },
        // 裁剪组件的基础配置option
        option: {
          img: 'https://img.zcool.cn/community/01045058a578d6a801219c77f4a434.jpg', // 裁剪图片的地址
          info: true, // 裁剪框的大小信息
          outputSize: 0.8, // 裁剪生成图片的质量
          outputType: 'jpeg', // 裁剪生成图片的格式
          canScale: true, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          // autoCropWidth: 300, // 默认生成截图框宽度
          // autoCropHeight: 200, // 默认生成截图框高度
          fixedBox: false, // 固定截图框大小 不允许改变
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: [7, 7], // 截图框的宽高比例
          full: true, // 是否输出原图比例的截图
          canMoveBox: true, // 截图框能否拖动
          original: false, // 上传图片按照原始比例渲染
          centerBox: false, // 截图框是否被限制在图片里面
          infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        },
      }
    },
    created(){
      
    },
    methods:{
      show(avatar){
        this.avatar = avatar
        this.visible = true
        this.option.img = avatar
      },
      // 重置
      refreshCrop(){
        this.$refs.cropper.refresh()
      },
      //放大/缩小
      changeScale(num) { 
        num = num || 1; 
        this.$refs.cropper.changeScale(num); 
      }, 
      //坐旋转
      rotateImg(type) {
        if(type == 1){
          this.$refs.cropper.rotateLeft()
        }else{
          this.$refs.cropper.rotateRight()
        }
      }, 
      // 实时预览函数 
      realTime(data) {
        this.previews = data
      },
      beforeUpload(file) {
        this.fileList = [...this.fileList, file]
        //获取window的URL工具
        const url = window.URL || window.webkitURL
        //通过file生成目标url
        this.option.img = url.createObjectURL(file)
        return false
      },
      handleOk(){
        const { fileList } = this
        const name = (fileList.length) ? fileList[0].name : this.getFileName(this.option.img)
        this.$refs.cropper.getCropData((data) => {
          const formData = new FormData()
          formData.append('file', this.dataURLtoFile(data,name))
          const contextType = { 'Content-Type': 'multipart/form-data' }
          postActionHeader(this.url.importUrl, formData, contextType).then(res => {
            if(res.code == 200){
              this.avatar = res.data.attaUrl
              this.$message.success('上传成功！')
              this.handleCancel()
            }else{
              this.$message.warning(res.msg)
            }
          })
        })

        
      },
      handleCancel() {
        this.close();
      },
      close() {
        this.$emit('ok')
        this.visible = false
      },
      getFileName(url){
        // eslint-disable-next-line
        const pos = url.lastIndexOf("\/");
        //截取最后一个/位置到字符长度，也就是截取文件
        return url.substring(pos + 1);
      },
      //将base64转换为文件对象
      dataURLtoFile(dataurl, filename) {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length; 
        const u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        //转换成file对象
        return new File([u8arr], filename, {type:mime})
      }
    },
  }
</script>

<style lang="scss" scoped>
.vue-cropper {
  height: 400px;
  margin: 20px 0px;
}
.obtn {
  text-align: center;
}
.obtn .ant-btn {
  margin-right: 5px;
}
</style>