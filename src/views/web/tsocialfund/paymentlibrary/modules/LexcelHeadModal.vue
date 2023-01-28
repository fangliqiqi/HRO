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
      >保存</a-button>
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
              class="stepFormText"
              label="名称"
            >
              <a-input
                placeholder="拟定一个筛选器名称"
                v-decorator="['name', {rules: [{ required: true, message: '请填写筛选器名称！'}, {max: 10, message: '筛选器名称最多十个字符！'}]}]"
                style="width: 250px"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'

  export default {
    name: 'LexcelHeadModal',
    data() {
      return {
        model: {},
        title: '操作',
        maxMun: 3,  // 最大自定义项
        visible: false,
        reqDatas: {},  // 请求数据
        confirmLoading: false,
        form: this.$form.createForm(this),
        url: {
          addSearch: 'hrBase/lexcelheadforio',
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
            const httpurl = (`${that.url.addSearch}?maxMun=${that.maxMun}`)
            const method = 'post'
            let formData = Object.assign(that.model, values)
            that.reqDatas.name = formData.name
            httpAction(httpurl, that.reqDatas, method).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.message || res.msg)
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
        this.maxMun = 3  // 最大自定义项
        this.visible = false
        this.reqDatas = {}  // 请求数据
        this.confirmLoading = false
      }
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
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
