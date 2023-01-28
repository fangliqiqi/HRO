<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :closable="false"
    :destroyOnClose="true"
    style="top: 20px;"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
    </template>
    <a-upload
      :default-file-list="defaultFileList"
      :showUploadList="{showRemoveIcon:false}"
      @preview="handlePreview"
    >
    </a-upload>
    <a-carousel
      arrows
      dotsClass="slick-dots slick-thumb"
    >
      <a
        slot="customPaging"
        slot-scope="props"
      >
        <img :src="getImgUrl(props.i)" alt="img"/>
      </a>
      <div
        v-for="item in imgList"
        :key="item.uid"
      >
        <img :src="item.url" alt="img"/>
      </div>
    </a-carousel>
  </a-modal>
</template>
<script>
const baseUrl = 'https://raw.githubusercontent.com/vueComponent/ant-design-vue/master/components/vc-slick/assets/img/react-slick/'
export default {
  name: "ImagesViewModal",
  data() {
    return {
      baseUrl,
      visible: false,
      title: "合同附件预览",
      defaultFileList: [],
      fileType:'xls,xlsx,doc,docx,ppt,pptx',
      imgList:[]
    }
  },
  methods: {
    getImgUrl(i) {
      return this.imgList[i].url
    },
    showModal(record) {
      const defaultFileList = []
      const imgList = []
      record.fileList.forEach(item=>{
        const fileExt = item.name.replace(/.+\./,"")
        const reg = new RegExp(fileExt,"gi")
        if(reg.test(this.fileType) || /pdf/gi.test(fileExt)) {
          defaultFileList.push(item)
        }else{
          imgList.push(item)
        }
      })
      this.defaultFileList = defaultFileList
      this.imgList = imgList
      this.visible = true
    },
    handlePreview(file){
      const fileExt = file.name.replace(/.+\./,"")
      const reg = new RegExp(fileExt,"gi")
      if(reg.test(this.fileType)) {
        window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url)}`, '_blank')
      }else if(/pdf/gi.test(fileExt)){
        window.open(file.url,'_blank')
      }
    },
    handleCancel() {
      this.$emit('close')
      this.visible = false
      this.defaultFileList = this.imgList = []
    }
  }
}
</script>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
.ant-carousel{
  margin-top: 30px;
}
</style>