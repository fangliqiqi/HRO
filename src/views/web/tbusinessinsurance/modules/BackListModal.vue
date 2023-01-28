<template>
  <a-modal
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @cancel="handleCancel"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="down" type="primary" @click="handleDown" :loading="loading.submitLoading" v-if="downBtn">下载PDF</a-button>
      <a-button key="submit" type="primary" @click="handleSubmit" :loading="loading.submitLoading" v-if="submitBtn">上传附件提交审核</a-button>
      <a-button key="audit" type="primary" @click="handleAudit" :loading="loading.submitLoading" v-if="auditBtn">审核</a-button>
      
    </template>
    <a-spin :spinning="confirmLoading">
      <div class="printer">
        <h5 class="title" id="tabledesc1">退保申请</h5>
        <div class="content">
          <p>{{ model.insuranceCompanyName }}：</p>
          <p class="index">我司在你处于{{ moment(model.policyEffect).format('YYYY') }}年{{ moment(model.policyEffect).format('MM') }}月办理{{ model.insuranceTypeName }}，保单号{{ model.policyNo }}，因该批人员已经离职退保，具体人员信息如下:</p>
          <table class="list" border="1" cellspacing="0" aria-describedby="tabledesc1">
            <tr><th scope="col">序号</th><th scope="col">姓名</th><th scope="col">性别</th><th scope="col">身份证号码</th></tr>
            <tr v-for="(item,index) in model.businessInsuranceVoList" :key="index">
              <td>{{ index+1 }}</td>
              <td>{{ item.empName }}</td>
              <td>{{ getSex(item.empIdcardNo) }}</td>
              <td>{{ item.empIdcardNo }}</td>
            </tr>
          </table>
          <p class="index">请予以办理！</p>
          <p class="index">备注：投保人/被保险人已经明确保险人关于解除保险合同的相关告之义务，并且承诺对于发生在保险合同解除之日前不存在尚未结案的赔案，并且承诺对于保险合同解除后，若发现存在退保日前发生相关赔案，投保人/被保险人放弃向保险人索赔。</p>
          <p class="index">退款人名称：</p>
          <p class="index">退款人账户：</p>
          <p class="index">开户行名称：</p>
          <p style="float: right;width:200px;">
            公司盖章<br/>
            {{ moment(model.createTime).format('YYYY') }} 年 {{ moment(model.createTime).format('MM') }} 月 {{ moment(model.createTime).format('DD') }} 日
          </p>
        </div>
        <a-modal
          :visible="visibleAudit"
          title="审核"
          @ok="handleOk"
          @cancel="cancelAudit"
          :confirmLoading="confirmLoading"
        >
          <a-form
            :form="form"
            layout="inline"
          >
            <a-row>
              <a-col :span="24">
                <a-form-item label="附件" class="auditForm">
                  <a-upload
                    :defaultFileList="fileAttach"
                    listType="picture"
                    :showUploadList="{showRemoveIcon:false}"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="审核">
                  <a-radio-group v-decorator="['flag',{rules: [{ required: true, message: '请先选择!' }]}]">
                    <a-radio :value="0">通过</a-radio>
                    <a-radio :value="1">不通过</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-modal>

        <a-modal :visible="visibleSubmit" okText="上传并提交" title="提交审核" @ok="handleSubmitOk" @cancel="handleSubmit">
          <a-form
            :form="form"
            layout="vertical"
          >
            <a-form-item label="上传附件">
              <a-upload-dragger
                name="file"
                :fileList="fileList"
                @change="handleChange"
                :beforeUpload="beforeUpload"
                :remove="removeFile"
                accept="image/*,.pdf"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">点击或者拖拽上传普通附件</p>
              </a-upload-dragger>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,postActionHeader } from '@/api/manage'
  import moment from 'moment'
  import html2canvas from 'html2canvas'
  import JsPDF from 'jspdf'

  export default {
    name: 'BackListModal',
    components: {
      
    },
    data() {
      return {
        model: {},
        title: '退保列表',
        visible: false,
        confirmLoading: false,
        submitBtn: false,
        auditBtn: false,
        downBtn: false,
        visibleAudit: false,
        visibleSubmit: false,
        form: this.$form.createForm(this),
        loading:{
          submitLoading:false,
          auditLoading:false
        },
        fileList:[],
        fileAttach:[],
        isUpload:true,
        url:{
          delAttachUrl:'/busiInsurance/tinsuranceatta/',
          importUrl:'/busiInsurance/tinsuranceatta/upload',
          detailUrl:'/busiInsurance/tinsurancetype/', // 获取详情（查找名称）
        }
      }
    },
    methods: {
      moment,
      show(record) {
        this.model = record
        this.getConfigDetailInfo(record)
        this.visible = true
      },
      getSex(idcard){
        let sex
        if(String(idcard).length > 15){
          sex = parseInt(String(idcard).substr(16, 1)) % 2
        }else{
          sex = parseInt(String(idcard).substr(14, 1)) % 2
        }
        return sex > 0 ? '男' : '女'
      },
      handleCancel() {
        this.close()
      },
      close(flag) {
        if(flag){
          this.$emit('ok')
        }
        this.visible = false
        this.model = {}
        this.submitBtn = this.auditBtn = this.downBtn = false
        this.fileList = []
      },
      handleDown(){
        this.getPdf(document.getElementsByClassName('printer')[0], this.model)
      },
      getPdf(el, name){
        html2canvas(el,{scale: 2,}).then(canvas => {
          const pdf = new JsPDF('p', 'mm', 'a4') // A4纸，纵向
          pdf.setFont("SimSun");
          const ctx = canvas.getContext('2d')
          const a4w = 170; const a4h = 257 // A4大小，210mm x 297mm，四边各保留20mm的边距，显示区域170x257
          const imgHeight = Math.floor(a4h * canvas.width / a4w) // 按A4显示比例换算一页图像的像素高度
          let renderedHeight = 0
          while (renderedHeight < canvas.height) {
            var page = document.createElement('canvas')
            page.width = canvas.width
            page.height = Math.min(imgHeight, canvas.height - renderedHeight)// 可能内容不足一页
            // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
            page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0)
            pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4w, Math.min(a4h, a4w * page.height / page.width)) // 添加图像到页面，保留10mm边距
            renderedHeight += imgHeight
            if (renderedHeight < canvas.height) { pdf.addPage() }// 如果后面还有内容，添加一个空页
          }
          pdf.save(`${name.insuranceCompanyName}-${name.policyNo}.pdf`)
          if(!this.submitBtn){
            this.close(true)
          }
        })
      },
      handleSubmitOk(){
        if(this.fileList.length === 0){
          this.$message.warning('请先上传附件!')
          return false
        }
        this.loading.submitLoading = this.confirmLoading = true
        httpAction(`/busiInsurance/tinsurancerefund/submit/${this.model.id}`,null,'put').then(res=>{
          if(res.code === 200){
            this.$message.success('提交成功!')
            this.close(true)
          }else{
            this.$message.warning(res.msg)
          }
        }).finally(()=>{
          this.loading.submitLoading = this.confirmLoading = false
        })
      },
      handleSubmit(){
        this.visibleSubmit = !this.visibleSubmit
      },
      handleAudit(){
        this.fileAttach = this.model.atta.map(item=>{
          return {
            uid:item.id,
            name:item.attaName,
            url:item.attaUrl,
            status: 'done',
          }
        })
        this.visibleAudit = true
      },
      cancelAudit(){
        this.visibleAudit = false
      },
      handleChange(file) {
        if(this.isUpload) {
          this.uploadFilesChange(file.file)
        }
      },
      beforeUpload() {
        // this.fileList = [...this.fileList, file];
        return false
      },
      uploadFilesChange(file) { // 上传图片
        const _this = this
        const formData = new FormData()
        formData.append('file', file)
        const contextType = { 'Content-Type': 'multipart/form-data' }
        postActionHeader(this.url.importUrl+'?policyType=2&insuranceId='+this.model.id, formData, contextType).then((res) => {
          if(res.code == 200 && res.data){
            const obj = {
              uid:res.data.id,
              name:res.data.attaName,
              url:res.data.attaUrl,
              status: 'done',
            }
            _this.fileList = [..._this.fileList, obj]
            this.$message.success('上传附件成功')
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      removeFile(fileInfo) {
        this.isUpload = false
        const _this = this
        this.$confirm({
          title: '删除',
          content: '确定删除该附件？',
          okText: '确认',
          cancelText: '取消',
          onOk: function() {
            httpAction(_this.url.delAttachUrl + fileInfo.uid, null, 'DELETE').then(res => {
              if (res.code === 200) {
                _this.fileList.map((file, index) => {
                  if (file.uid == fileInfo.uid) {
                    //删除该附件
                    _this.fileList.splice(index, 1)
                    return
                  }
                })
                _this.$message.success('删除附件成功！')
              } else {
                _this.$message.warning(res.msg)
              }
            }).finally(()=>{
              _this.isUpload = true
            })
          }
        })
        return false
      },
      // 审核
      handleOk() {
        const _this = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            _this.confirmLoading = true
            const httpurl = `/busiInsurance/tinsurancerefund/aduit/${this.model.id}?flag=${values.flag}`
            httpAction(httpurl, null, 'put').then((res) => {
              if (Number(res.code) === 200) {
                _this.$message.success(`审核成功！`)
                _this.cancelAudit()
                _this.close(true)
              } else {
                _this.$message.warning(res.msg)
              }
            }).finally(() => {
              _this.confirmLoading = false
            })
          }
        })
      },
      // 获取商险退保记录详情
      getBackDetail(record){
        httpAction(`/busiInsurance/tinsurancerefund/${record}`,null,'get').then(res=>{
          if(res.code === 200){
            this.model = res.data
            this.visible = true
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      // 获取保险险种配置详情信息
      getConfigDetailInfo(record){
        httpAction(this.url.detailUrl + record.insuranceType, '', 'GET').then((res) => {
          if (Number(res.code) === 200 && res.data) {
            this.model.insuranceCompanyName = res.data.receiptUnitName
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.title{
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin: 0px 0px 16px;
  padding: 0px;
  font-family: '宋体','SimSun','Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.content{
  color: #000;
  font-size: 15px;
  font-family:'宋体','SimSun','Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
  .index{
    text-indent: 1cm;
  }
  p{
    margin-bottom: 10px;
    line-height: 32px;
    font-family: '宋体','SimSun','Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 18px;
  }
  .list{
    width: 80%;
    margin:14px 0px;
    border-collapse: collapse;
    border-spacing: 0;
    font-size: 14px;
    font-family: '宋体','SimSun','Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    td,th{
      text-align: center;
      font-weight: normal;
      border:1px solid #000;
    }
  }
}
.ant-upload-text{
  font-size: 14px !important;
  color: #000000a6 !important;
}
.printer{
  margin-bottom: 20px;
}
.auditForm {
  :global(.ant-form-item-control) {
    width:405px;
  }
}
</style>

