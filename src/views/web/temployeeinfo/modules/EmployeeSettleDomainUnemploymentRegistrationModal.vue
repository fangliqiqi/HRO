<template>
  <a-modal
    :title="title"
    :width="500"
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
      >下载</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col>
            <a-form-item
              label="结算主体"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择结算主体"
                v-decorator="['settleDomainId', validatorRules.settleDomainId]"
                :dropdownMatchSelectWidth="false"
                style="width: 220px"
              >
                <a-select-option
                  v-for="(value, key) in settleDomainBelongs"
                  :key="key"
                  :value="value.id"
                >{{ value.departName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { downFile } from '@/api/manage'

  export default {
    name: 'EmployeeSettleDomainUnemploymentRegistrationModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        settleDomainBelongs: [],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          settleDomainId: { rules: [{ required: true, message: '请选择结算主体！' }] },
        },
        url: {
          add: 'hrBase/temployeeinfo/exportUnemploymentRegistrationForms',
        },
      }
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = this.url.add
            const formData = Object.assign(this.model, values)
            httpurl += `?settleDomainIds=${formData.settleDomainId}`
            downFile(httpurl, '').then((res) => {
              if (res.size > 0) {
                var blob = new Blob([res], {type: 'application/zip;charset=utf-8'}); // application/zip这里表示zip类型
                var downloadElement = document.createElement('a')
                var href = window.URL.createObjectURL(blob) // 创建下载的链接
                downloadElement.href = href
                downloadElement.download = `${this.settleDomainBelongs[formData.settleDomainId].departName}-失业登记表.zip` // 下载后文件名
                document.body.appendChild(downloadElement)
                downloadElement.click() // 点击下载
                document.body.removeChild(downloadElement) // 下载完成移除元素
                window.URL.revokeObjectURL(href) // 释放掉blob对象
                this.$message.success(`${this.settleDomainBelongs[formData.settleDomainId].departName}-失业登记表下载成功！`)
                that.$emit('ok')
                that.close()
              } else {
                this.$message.warning(`${(res.msg || res.message)}-失业登记表下载失败！`)
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          }
        })
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.settleDomainBelongs = []
      }
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 130px;
  }
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
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
</style>
