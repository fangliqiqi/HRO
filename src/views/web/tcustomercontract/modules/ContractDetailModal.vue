<template>
  <a-modal
    title="合同详情"
    :width="800"
    :visible="visible"
    @ok="handleCancel"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-form layout="inline" class="contractItem">
      <a-row>
        <a-divider>合同基本信息</a-divider>
        <a-col :span="12">
          <a-form-item label="合同名称" class="stepFormText">{{ model.contractName }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="起止日期" class="stepFormText">{{ model.startDate }}~{{ model.endDate }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="客户单位" class="stepFormText">{{ model.customerName }}({{ serviceSideString[Number(model.serviceSide)] }})</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="客户类型" class="stepFormText">{{ getCustomerType(model.customerType) || '-' }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="CRM合同编号" class="stepFormText">{{ model.crmNo }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="商务主体" class="stepFormText">{{ model.businessSubjectName }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="用章类型" class="stepFormText">{{ getChapterType(model.chapterType) }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="用章单位" class="stepFormText">{{ model.chapterUnitText }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="客户先行盖章" class="stepFormText">{{ generalJudge[Number(model.chapterCustomerPre)] }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否外带" class="stepFormText">{{ generalJudge[Number(model.outWithFlag)] }}</a-form-item>
        </a-col>
      </a-row>
      <a-divider>业务信息</a-divider>
      <a-row>
        <a-col :span="12">
          <a-form-item label="合同模板" class="stepFormText">{{ contractTemplateString[model.contractTemplate] }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="业务类别" class="stepFormText">{{ model.businessTypeText }} / {{ model.businessSubText }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="业务开发人" class="stepFormText">{{ model.businessDeveloperName }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="开发部门/分公司" class="stepFormText">{{ model.businessDeveloperOrganText }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="收入预估" class="stepFormText">{{ model.estimatedIncome }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="合同金额" class="stepFormText">{{ model.money||'-' }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="服务人数" class="stepFormText">{{ model.servicePeopleNum||'-' }}</a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="合同要点" class="stepFormText lineOver">{{ model.remark||'-' }}</a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item class="stepFormText" label="合同附件">
            <div class="clearfix">
              <a-upload
                listType="picture-card"
                :fileList="model.fileList"
                @preview="handlePreview"
                :multiple="true"
                :showUploadList="{ showRemoveIcon: false }"
                accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx,.rar,.zip"
              ></a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviwCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item class="stepFormText" label="归档附件">
            <div class="clearfix">
              <a-upload
                listType="picture-card"
                :fileList="model.fileArchiveList"
                @preview="handlePreview"
                :showUploadList="{ showRemoveIcon: false }"
                accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx"
              ></a-upload>
            </div>
          </a-form-item>
        </a-col>

      </a-row>
    </a-form>
  </a-modal>
</template>


<script>
  import { httpAction } from '@/api/manage'
  import { filterSysUserDict } from '@/utils/customDict'
  import { getNameFromArr } from '@/utils/common'

  export default {
    name: 'ContractDetailModal',
    props: {
      chapterUnitDicts:{
        type: Array,
        default:()=>[],
        required: true
      },
      data:{
        type: Object,
        required: true
      },
    },
    data() {
      return {
        confirmLoading:false,
        visible:false,
        model:{},
        previewVisible:false,
        previewImage: '',
        generalJudge: ['否', '是'],
        serviceSideString: ['', '甲方', '乙方'],
        contractTemplateString: ['', '公司模板无修改', '公司模板有修改', '客户指定', '其他模板'],
        settleCycleString: ['', '月结', '季度结', '半年结', '年结'],
        settleTypeString: ['', '当月结当月费用', '当月结上月费用', '当月结下月费用', '其他'],

        url: {
          getOne: '/hrBase/tcustomercontract/',
        },
      }
    },
    methods: {
      getChapterType(str){
        const chapterTypeString = ['', '合同章', '法人章']
        const arr = str ? str.split(',') : []
        const res = arr.map(item=>{
          return chapterTypeString[item]
        })
        return res.join(',')
      },
      getCustomerType(val){
        const arr = ['集团客户','重点客户','一般客户','电信客户']
        return arr[val]
      },
      handleCancel(){
        this.visible = false
      },
      handlePreview(file) {
        const fileExt = file.name.replace(/.+\./, '')
        const reg = new RegExp(fileExt, 'gi')
        if (reg.test('xls,xlsx,doc,docx,ppt,pptx')) {
          this.previewVisible = false
          window.open(
            `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url || file.thumbUrl)}`,
            '_blank'
          )
        } else if (/(pdf|zip|rar)/gi.test(fileExt)) {
          window.open(file.url || file.thumbUrl, '_blank')
        } else {
          this.previewImage = file.url || file.thumbUrl
          this.previewVisible = true
        }
      },
      handlePreviwCancel() {
        this.previewVisible = false
      },
      /**
       * 客户合同详情
       */
      show(id) {
        httpAction(this.url.getOne + id, null, "GET").then((res) => {
          if(res.code == 200){
            if(!res.data){
              this.$message.warning('该合同不存在或已删除!')
              return
            }
            res.data.businessDeveloperId = filterSysUserDict(this.data.sysUsers, res.data.businessDeveloperId)
            res.data.businessTypeText = getNameFromArr(this.data.customerBusinessTypeDict,res.data.businessType,'id','label')
            const arr = this.data.customerBusinessTypeDict.filter(item=>String(item.id) === res.data.businessType)
            const temp = arr[0] ? arr[0]['children'] : []
            res.data.businessSubText = getNameFromArr(temp,res.data.businessSub,'id','label')
            res.data.businessDeveloperOrganText = getNameFromArr(this.data.organs,res.data.businessDeveloperOrgan,'id','organName')
            res.data.chapterUnitText = this.GLOBAL_CONST['companyChapterType'][res.data.chapterUnit]
            this.model = res.data
            this.visible = true
          }else{
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
</script>
