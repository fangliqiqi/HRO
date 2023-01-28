<template>
  <a-modal
    :title="title"
    :width="800"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    cancelText="关闭"
    :visible="visible"
    :footer="null"
    :destroyOnClose="true"
  >

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item label="客户名称" class="overflow">
              {{ model.customerName }}
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="上级机构" class="overflow">
              {{ model.parentId }}
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item label="行业类型" class="overflow">
              {{ model.industryBelong }}
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="行业细分" class="overflow">
              {{ model.industrySub }}
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item label="客户地址" class="overflow">
              {{ model.province }}
            </a-form-item>

            <a-form-item>
              {{ model.city }}
            </a-form-item>

            <a-form-item>
              {{ model.town }}
            </a-form-item>

            <a-form-item>
              {{ model.address }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="服务归属地" class="overflow">
              {{ model.belongArea }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="客户性质" class="overflow">
              {{ model.nature }}
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="客户类型" class="overflow">
              {{ getCustomerType(model.customerType) }}
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getAreaName } from '@/utils/common'

export default {
  name: 'CustomerSimpleDetailModal',
  data() {
    return {
      title: '操作',
      visible: false,
      treeData:[],
      industryBelongs:[],
      industrySub:[],
      customerNatures: [],
      model: {},
      areaTrees: [],
      areaCitys: [],
      areaTowns: [],
      confirmLoading: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      }
    }
  },
  methods: {
    getCustomerType(val){
      const arr = ['集团客户','重点客户','一般客户','电信客户']
      return arr[val]
    },
    add() {
      this.edit({})
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.model.belongArea = getAreaName(this.model.belongProvince,this.model.belongCity,this.model.belongTown,' ')
      for(let i of this.industryBelongs) {
        if(i.id == this.model.industryBelong) {
          this.model.industryBelong = i.label;
        }
      }
      for(let i of this.industrySub) {
        if(i.id == this.model.industrySub) {
          this.model.industrySub = i.label;
        }
      }
      for(let i of this.customerNatures) {
        if(i.value == this.model.nature) {
          this.model.nature = i.label;
        }
      }
      for(let p of this.areaTrees) {
        if(p.id == this.model.province) {
          this.model.province = p.areaName;
          this.areaCitys = p.children;
          for(var c of this.areaCitys) {
            if(c.id == this.model.city) {
              this.model.city = c.areaName;
              this.areaTowns = c.children;
              for(let t of this.areaTowns) {
                if(t.id == this.model.town) {
                  this.model.town = t.areaName;
                }
              }
            }
          }
        }
      }
      for(let i of this.treeData) {
        if(i.value == this.model.parentId) {
          this.model.parentId = i.title;
        } else {
          if(i.children && i.children != null && i.children.length > 0) {
            for (let j of i.children) {
              if(j.value == this.model.parentId) {
                this.model.parentId = j.title;
              } else {
                if(j.children && j.children != null && j.children.length > 0) {
                  for(let l of j.children) {
                    if(l.value == this.model.parentId) {
                      this.model.parentId = l.title;
                    }
                  }
                }
              }
            }
          }
        }
      }
      if(this.model.parentId == 0){
        this.model.parentId = '--'
      }
      this.visible = true
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close');
      this.visible = false;
      this.disableSubmit = false;
      this.treeData = null;
      this.industryBelongs = null;
      this.model = {}
    }
  }
}
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
.overflow{
  overflow: hidden;
}
</style>