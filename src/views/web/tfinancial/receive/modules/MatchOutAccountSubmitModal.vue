<template>
  <a-modal
    :title="title"
    :width="600"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >保存</a-button>
    </template>
    <a-spin :spinning="spinning">
      <a-card
        :bordered="true"
        title="结算单信息"
      >
        <detail-list :col="2">
          <detail-list-item term="客户单位">{{ settleDomainSelected.unitName ? settleDomainSelected.unitName : '-' }}</detail-list-item>
          <detail-list-item term="结算金额">{{ settleDomainSelected.settleDomainMoney ? settleDomainSelected.settleDomainMoney : 0 }}</detail-list-item>
          <detail-list-item term="结算月份">{{ settleDomainSelected.setlleMonth ? settleDomainSelected.setlleMonth : '-' }}</detail-list-item>
          <detail-list-item term="表单类型">{{ formTypeStr ? formTypeStr : '-' }}</detail-list-item>
        </detail-list>
      </a-card>
    </a-spin>

  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import DetailList from '@/components/tools/DetailList'
  const DetailListItem = DetailList.Item

  export default {
    name: 'MatchOutAccountSubmitModal',
    components: {
      DetailList,
      DetailListItem,
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        spinning: false,
        httpurl: '',
        formTypeStr: '',
        requestData: {},  // 请求的数据
        formTypeOptions: {},  // 结算表类型
        settleDomainSelected: {}, // 选中的结算单信息
      }
    },
    methods: {
      add() {
        this.edit({})
      },
      edit() {
        this.visible = true
        this.formTypeStr = this.formTypeOptions[this.settleDomainSelected.formType]
        console.log(this.requestData,44444)
      },
      // 保存按钮
      handleOk() {
        const that = this
        that.spinning = true
        that.confirmLoading = true
        httpAction(this.httpurl, this.requestData, 'POST').then((res) => {
          if (res.code === 200) {
            that.$message.success('匹配出账保存成功！')
            that.$emit('ok')
            that.close()
          } else {
            that.$message.warning(res.msg || res.message)
          }
        }).finally(() => {
          that.confirmLoading = false
          that.spinning = false
        })
      },
      // 关闭功能
      handleCancel() {
        this.close()
      },
      // 表单关闭与数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.httpurl = ''
        this.formTypeStr =  ''
        this.requestData =  {}  // 请求的数据
        this.confirmLoading = false
        this.formTypeOptions = {}  // 结算表类型
        this.settleDomainSelected = {} // 选中的结算单信息
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
  margin-bottom: 0px;
}
.ant-disabled-form {
  :global(.ant-input-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-select-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-checkbox-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-radio-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
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
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}
</style>
