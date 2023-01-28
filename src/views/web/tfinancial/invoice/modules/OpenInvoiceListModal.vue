<template>
  <a-modal
    :title="title"
    :width="1200"
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
      >确定</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-row>
        <a-col :span="24">
          <div class="steps-content">
            <!--列表-->
            <a-table
              rowKey="id"
              size="middle"
              :scroll="{x: 1}"
              :bordered="true"
              :columns="columns"
              :customRow="rowSelect"
              :dataSource="dataSource"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
            >
              <span
                slot="invKind"
                slot-scope="text"
              >
                <template v-for="(invKind, key) in invKindOptions">
                  <span
                    :key="key"
                    v-if="key==text"
                  >{{ invKind }}</span>
                </template>
              </span>
              <span
                slot="classCode"
                slot-scope="text"
              >
                {{ filterDictText(taxClassificationOptions, text) }}
              </span>
            </a-table>
          </div>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
  import { filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'OpenInvoiceListModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        filterDictText,
        confirmLoading: false,
        form: this.$form.createForm(this),
        dataSource: [],
        selectedRowKeys: [],
        selectionRows: [],
        invKindOptions: {}, // 发票类型
        taxClassificationOptions: [], // 税收分类
        columns: [
          {
            width: 180,
            ellipsis: true,
            title: '抬头名称',
            align: 'center',
            dataIndex: 'ticketTableHead',
            scopedSlots: { customRender: 'ticketTableHead' },
          },
          {
            width: 150,
            ellipsis: true,
            title: '商品名称',
            align: 'center',
            dataIndex: 'goodsName',
            scopedSlots: { customRender: 'goodsName' },
          },
          {
            width: 150,
            ellipsis: true,
            title: '发票类型',
            align: 'center',
            dataIndex: 'invKind',
            scopedSlots: { customRender: 'invKind' },
          },
          {
            width: 150,
            ellipsis: true,
            title: '税收分类',
            align: 'center',
            dataIndex: 'classCode',
            scopedSlots: { customRender: 'classCode' },
          },
          {
            width: 80,
            ellipsis: true,
            title: '税率',
            align: 'center',
            dataIndex: 'goodsTaxRate',
            scopedSlots: { customRender: 'goodsTaxRate' },
          },
          {
            width: 170,
            ellipsis: true,
            title: '纳税人识别号',
            align: 'center',
            dataIndex: 'taxpayerIdentificationNo',
            scopedSlots: { customRender: 'taxpayerIdentificationNo' },
          },
          {
            width: 180,
            ellipsis: true,
            title: '开户行',
            align: 'center',
            dataIndex: 'bankName',
            scopedSlots: { customRender: 'bankName' },
          },
          {
            width: 150,
            ellipsis: true,
            title: '银行卡号',
            align: 'center',
            dataIndex: 'bankNo',
            scopedSlots: { customRender: 'bankNo' },
          },
        ],
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
        this.selectedRowKeys = []
        this.selectionRows = []
      },
      // 确定按钮
      handleOk() {
        if (this.selectedRowKeys.length > 0) {
          this.$emit('ok')
          this.close()
        } else {
          this.$message.error('请选择一条开票信息配置项！')
        }
      },
      // 点击按钮选中
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectionRows = selectionRows
      },
      // 点击整行选中
      rowSelect(record) {
        return {
          on: {
            click: () => {
              this.selectionRows = [record]
              this.selectedRowKeys = [record.id]  // 点击行选中
            }
          }
        }
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.dataSource = []
        this.taxClassificationOptions = [] // 税收分类
        this.invKindOptions = {} // 发票类型
      },
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
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}
</style>
