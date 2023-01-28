<template>
  <a-modal
    :title="title"
    :width="1000"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        v-if="!isDetail"
        :loading="confirmLoading"
        @click="handleOk"
      >保存</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="政策适用范围"
              class="stepFormText"
            >
              <a-radio-group
                :disabled="isDetail"
                v-decorator="['target', {rules: [{required: true, message: '请选政策适用范围！'}]}]"
              >
                <a-radio
                  v-for="(value, key) in userTypeOption"
                  :key="key"
                  :value="key"
                >{{ value.option }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="政策适用年份"
              class="stepFormText"
            >
              <a-select
                :disabled="isDetail"
                placeholder="选择年份"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['year', { rules: [{ required: true, message: '选择政策适用年份！' }] }]"
                @change="handleYearChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in year"
                  :key="index"
                  :value="item"
                >{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="生效月份"
              class="stepFormText"
            >
              <a-select
                :disabled="isDetail"
                placeholder="起始月"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['startMonth', { rules: [{ required: true, message: '选择起始月！' }] }]"
                @change="handleStartMonthChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in startMonthOption"
                  :key="index"
                  :value="item"
                >{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                :disabled="isDetail"
                placeholder="截止月"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['endMonth', { rules: [{ required: true, message: '选择截止月！' }] }]"
                :dropdownMatchSelectWidth="false"
              >
                <template v-for="(item, index) in endMonthOption">
                  <a-select-option
                    disabled
                    :key="index"
                    :value="item"
                    v-if="item < endMonthDisabled"
                  >{{ item }}</a-select-option>
                  <a-select-option
                    v-else
                    :key="index"
                    :value="item"
                  >{{ item }}</a-select-option>
                </template>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="社保缴纳地"
              class="stepFormText"
            >
              <a-select
                showSearch
                :disabled="isDetail"
                placeholder="选择省份"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['province', { rules: [{ required: true, message: '选择省份！' }] }]"
                @change="handleProvinceChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaTrees"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                showSearch
                :allowClear="true"
                :disabled="isDetail"
                placeholder="选择城市"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['city', {}]"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaCitys"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <!-- <a-form-item>
              <a-select
                allowClear
                showSearch
                placeholder="选择区县"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['town', {}]"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaTowns"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item> -->
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item
              label="养老"
              class="stepFormText"
            >
              <a-radio-group
                buttonStyle="solid"
                :disabled="isDetail"
                v-decorator="['pension', {rules:[{required: true, message: '请选择养老政策！'}]}]"
              >
                <a-radio-button
                  v-for="(item, index) in policyTypeOption"
                  :key="index"
                  :value="index"
                >{{ item.option }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="医疗"
              class="stepFormText"
            >
              <a-radio-group
                buttonStyle="solid"
                :disabled="isDetail"
                v-decorator="['medical', {rules:[{required: true, message: '请选择医疗政策！'}]}]"
              >
                <a-radio-button
                  v-for="(item, index) in policyTypeOption"
                  :key="index"
                  :value="index"
                >{{ item.option }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="生育"
              class="stepFormText"
            >
              <a-radio-group
                buttonStyle="solid"
                :disabled="isDetail"
                v-decorator="['bear', {rules:[{required: true, message: '请选择生育政策！'}]}]"
              >
                <a-radio-button
                  v-for="(item, index) in policyTypeOption"
                  :key="index"
                  :value="index"
                >{{ item.option }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item
              label="失业"
              class="stepFormText"
            >
              <a-radio-group
                buttonStyle="solid"
                :disabled="isDetail"
                v-decorator="['unemployed', {rules:[{required: true, message: '请选择失业政策！'}]}]"
              >
                <a-radio-button
                  v-for="(item, index) in policyTypeOption"
                  :key="index"
                  :value="index"
                >{{ item.option }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="工伤"
              class="stepFormText"
            >
              <a-radio-group
                buttonStyle="solid"
                :disabled="isDetail"
                v-decorator="['injury', {rules:[{required: true, message: '请选择工伤政策！'}]}]"
              >
                <a-radio-button
                  v-for="(item, index) in policyTypeOption"
                  :key="index"
                  :value="index"
                >{{ item.option }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'

  export default {
    name: 'PaymentSettingAddModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        dateFormat: 'YYYYMM',  // 时间格式化类型
        form: this.$form.createForm(this),
        year: [],
        areaTrees: [],
        areaCitys: [],
        areaTowns: [],
        isDetail: false,
        endMonthDisabled: '', // 截止月禁止选择项目开始
        userTypeOption: {},
        endMonthOption: [],
        startMonthOption: [],
        policyTypeOption: {},
        url: {
          add: 'hrSocial/tagentconfig',
          edit: 'hrSocial/tagentconfig',
        },
      }
    },
    methods: {
      // 添加
      add() {
        this.edit({})
      },
      // 编辑
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        if (this.model.id) { // 续签合同
          for (const p of this.areaTrees) {
            if (String(p.id) === String(this.model.province)) {
              this.areaCitys = p.children
              break
            }
          }
          // 时间处理
          for (let i = 1; i <= 12; i++) {
            if (i < 10) {
              this.startMonthOption.push(this.model.year + '0' + i)
            } else {
              this.startMonthOption.push(this.model.year + i)
            }
          }
          this.endMonthDisabled = this.model.startMonth // 截止月禁止选择项目开始
          this.endMonthOption = this.startMonthOption
          this.model.target += ''
          this.model.province *= 1
          this.model.city = this.model.city ? (this.model.city * 1) : []
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'target', 'year', 'startMonth', 'endMonth' , 'province', 'city', 'pension', 'medical', 'bear', 'unemployed', 'injury'))
          }) 
        }
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            if (!this.model.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }
            let formData = Object.assign(this.model, values)
            if (Array.isArray(formData.city)) {
              formData.city = null
            }
            httpAction(httpurl, formData, method).then((res) => {
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
      // 表单关闭
      handleCancel() {
        this.close()
      },
      // 数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.year = []
        this.areaTrees = []
        this.areaCitys = []
        this.areaTowns = []
        this.isDetail = false
        this.endMonthDisabled = '' // 截止月禁止选择项目开始
        this.userTypeOption = {}
        this.endMonthOption = []
        this.startMonthOption = []
        this.policyTypeOption = {}
      },
      // 省份切换
      handleProvinceChange(value) {
        this.areaCitys = []
        this.areaTowns = []
        for (const c of this.areaTrees[value - 1].children) {
          this.areaCitys.push(c)
        }
        this.model.city = []
        this.form.setFieldsValue(pick(this.model, 'city'))
      },
      // 城市切换
      handleCityChange(value) {
        this.areaTowns = []
        for (const c of this.areaCitys) {
          if (String(c.id) === String(value)) {
            if (c.children.length > 0) {
              for (const t of c.children) {
                this.areaTowns.push(t)
              }
            }
          break
          }
        }
        this.model.town = []
        this.form.setFieldsValue(pick(this.model, 'town'))
      },
      // 政策适用年份
      handleYearChange(value) {
        this.endMonthOption = []
        this.startMonthOption = []
        this.endMonthDisabled = '' // 截止月禁止选择项目开始
        for (let i = 1; i <= 12; i++) {
          if (i < 10) {
            this.startMonthOption.push(value + '0' + i)
          } else {
            this.startMonthOption.push(value + i)
          }
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({startMonth: [], endMonth: []}, 'startMonth', 'endMonth'))
        })
      },
      // 生效月份->起始月
      handleStartMonthChange(value) {
        this.endMonthDisabled = value // 截止月禁止选择项目开始
        this.endMonthOption = this.startMonthOption
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({endMonth: []}, 'endMonth'))
        })
      },
      /******************************************* 验证规则 *******************************************/
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 120px;
  }
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
  }
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
</style>
