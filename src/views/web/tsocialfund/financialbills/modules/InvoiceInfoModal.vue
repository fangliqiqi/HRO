<template>
  <div>
    <a-descriptions title="开票信息" bordered :column="2" class="invice">
      <a-descriptions-item label="单位名称" v-if="isedit">
        <a-input placeholder="请选择" style="width:100%;cursor:pointer;" :value="openInvoiceInfo.taxUnit" @click="selectInvoice" readOnly/>
      </a-descriptions-item>
      <a-descriptions-item label="单位名称" v-else>
        {{ openInvoiceInfo.taxUnit }}
      </a-descriptions-item>
      <a-descriptions-item label="纳税人识别号">
        {{ openInvoiceInfo.taxpayerIdentificationNo }}
      </a-descriptions-item>
      <a-descriptions-item label="开户行">
        {{ openInvoiceInfo.bankName }}
      </a-descriptions-item>
      <a-descriptions-item label="银行卡号">
        {{ openInvoiceInfo.bankNo }}
      </a-descriptions-item>
      <a-descriptions-item label="地址">
        {{ openInvoiceInfo.addr }}
      </a-descriptions-item>
      <a-descriptions-item label="联系方式">
        {{ openInvoiceInfo.phone }}
      </a-descriptions-item>
    </a-descriptions>
    <div class="invoiceTitle">
      <span>发票明细</span>
      <template v-if="isedit">
        <a-button type="dashed" style="margin-right:20px" @click="openInvoice">
          <a-icon type="plus" />添加发票
        </a-button>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item>
              <a-upload
                name="file"
                :showUploadList="false"
                :multiple="false"
                :beforeUpload="beforeUpload"
                @change="handleChange"
                accept=".xls,.xlsx"
              >
                <a-icon
                  type="import"
                  style="margin-right: 10px"
                />批量导入
              </a-upload>
            </a-menu-item>
            <a-menu-item @click="handleDownloadTemplate('/templates/发票明细批量导入模板.xlsx')">
              <a-icon type="download" />批量导入模板</a-menu-item>
          </a-menu>
          <a-button :loading="btnLoading">批量导入
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <a-button type="dashed" style="float:right" @click="staticInvoice">
          发票合计
        </a-button>
      </template>
    </div>
    <a-table
      class="tableContent"
      :columns="invoiceColumns"
      rowKey="id"
      :data-source="invoiceInfo.invoiceList"
      :loading="loading"
      :pagination="false"
      :scroll="{y:600}"
    >
      <span
        slot="action"
        slot-scope="text, record,index"
      >
        <a @click="modifyInvoice(null,record)">编辑</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          title="确定删除吗?"
          @confirm="() => handleDelete(`/hrSocial/tfinanceInvoice/${record.id}`,'invoiceList',index)"
        >
          <a>删除</a>
        </a-popconfirm>  
      </span>
    </a-table>
    <div class="invoiceTitle">
      <span>差余额</span>
      <a-button type="dashed" @click="openBalance()" v-if="isedit">
        <a-icon type="plus" />添加原因
      </a-button>
    </div>
    <a-table
      class="tableContent"
      :columns="balanceColumns"
      rowKey="id"
      :data-source="invoiceInfo.diffList"
      :pagination="false"
      :scroll="{y:600}"
    >
      <span
        slot="action"
        slot-scope="text, record,index"
      >
        <a @click="openBalance(record)">编辑</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          title="确定删除吗?"
          @confirm="() => handleDelete(`/hrSocial/tfinancebilldiff/${record.id}`,'diffList',index)"
        >
          <a>删除</a>
        </a-popconfirm>  
      </span>
    </a-table>
    <receipt-list-modal ref="ReceiptListForm" @ok="getInvoiceInfo"></receipt-list-modal>
    <invoice-modify-modal ref="InvoiceModifyForm" @ok="modalOk"></invoice-modify-modal>
    <balance-modify-modal ref="BalanceModifyForm" @ok="balanceOk"></balance-modify-modal>
    <error-modal ref="errorModal"></error-modal>
  </div>
</template>

<script>
  import XLSX from 'xlsx'
  import { handleImportData } from '@/utils/common'
  import { httpAction,httpActionHeader } from '@/api/manage'
  import ErrorModal from '@/views/web/global/modules/ErrorModal'
  import ReceiptListModal from './ReceiptListModal'
  import InvoiceModifyModal from './InvoiceModifyModal'
  import BalanceModifyModal from './BalanceModifyModal'

  export default {
    name: 'InvoiceInfoModal',
    components: {
      ReceiptListModal,
      InvoiceModifyModal,
      BalanceModifyModal,
      ErrorModal
    },
    props: {
      billId:{
        type:String,
        required:true
      },
      invoiceInfo:{
        type:Object,
        required:true
      },
      openInvoiceInfo:{
        type:Object,
        required:true
      },
      isedit:{
        type:Boolean,
        required:true
      },
    },
    data() {
      return {
        invKindType: { '0': '专用发票', '2': '普通发票', '51': '电子发票' },
        invoiceColumns: [
          {
            width: 150,
            ellipsis: true,
            title: '发票类型',
            align: 'center',
            dataIndex: 'invoiceType',
            customRender:(text) => {
              const res = this.invKindType[text];
              return <a-tooltip placement="topLeft" title={res}>{res}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '扣除金额',
            align: 'center',
            dataIndex: 'deductionAmount',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '不含税收入',
            align: 'center',
            dataIndex: 'incomeExcludingTax',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '税额',
            align: 'center',
            dataIndex: 'taxFee',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '发票金额',
            align: 'center',
            dataIndex: 'invoiceFee',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '备注',
            align: 'center',
            dataIndex: 'remark',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            fixed: 'right',
            title: '操作',
            key: 'operations',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          }
        ],
        invoiceData: {},
        balanceColumns: [
          {
            width: 100,
            ellipsis: true,
            title: '产生月份',
            align: 'center',
            dataIndex: 'createMonth',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 150,
            ellipsis: true,
            title: '项目',
            align: 'center',
            dataIndex: 'subject',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '金额',
            align: 'center',
            dataIndex: 'money',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            title: '原因',
            align: 'center',
            dataIndex: 'reason',
            customRender:(text) => {
              return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
            },
          },
          {
            width: 100,
            ellipsis: true,
            fixed: 'right',
            title: '操作',
            key: 'operations',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          }
        ],
        balanceData: [],
        loading: false,
        btnLoading: false,
        ipagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },

      }
    },
    methods: {
      setColumn(){
        const field = {
          width: 100,
          ellipsis: true,
          title: '操作',
          key: 'operations',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
        const res1 = this.invoiceColumns.filter(item=>item.key !== 'operations');
        const res2 = this.balanceColumns.filter(item=>item.key !== 'operations');
        
        if(this.isedit){
          res1.push(field);
          res2.push(field);
        }
        this.invoiceColumns = res1;
        this.balanceColumns = res2;
      },
      selectInvoice(){
        this.$refs.ReceiptListForm.show(this.billId);
      },
      getInvoiceInfo(record){
        this.$emit('mok',record);
      },
      openInvoice(){
        this.$refs.InvoiceModifyForm.show(this.billId,{});
      },
      openBalance(record){
        if(record){
          this.$refs.BalanceModifyForm.show(this.billId,record);
        }else{
          this.$refs.BalanceModifyForm.show(this.billId,{});
        }
      },
      modalOk(){
        httpAction(`/hrSocial/tfinanceInvoice/getFinanceInvoiceByBillId?id=${this.billId}`,null,'get').then(res=>{
          if(res.code === 200){
            this.$emit('ok',res.data,'invoiceList');
          }else{
            this.$message.warning(res.msg);
          }
        })
      },
      balanceOk(){
        httpAction(`/hrSocial/tfinancebilldiff/getFinanceBillDiffByBillId?financeBillId=${this.billId}`,null,'get').then(res=>{
          if(res.code === 200){
            this.$emit('ok',res.data,'diffList');
          }else{
            this.$message.warning(res.msg);
          }
        })
      },
      staticInvoice(){
        this.$emit('ok',this.invoiceInfo.total);
      },
      modifyInvoice(record,data){
        if(record){
          // 刷新发票明细
          this.modalOk();
          return false;
        }
        // 编辑
        this.$refs.InvoiceModifyForm.show(this.billId,data);
      },
      handleDelete(url,field,index){
        httpAction(url,null,'DELETE').then(res=>{
          if(res.code === 200){
            this.$message.success('删除成功!');
            const arr = this.invoiceInfo[field].filter((item,i)=> i != index);
            this.$emit('ok',arr,field);
          }else{
            this.$message.warning(res.msg);
          }
        })
      },
      handleDownloadTemplate(templateUrl){
        const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${templateUrl}`;
        window.location.href = url;
      },
      beforeUpload() {
        return false
      },
      //上传
      handleChange(file) {
        this.uploadFilesChange(file.file)
      },
      uploadFilesChange(file,timeOut){
        const _this = this
        // 通过FileReader对象读取文件
        const fileReader = new FileReader()
        fileReader.onload = event => {
          try {
            _this.btnLoading = true
            const { result } = event.target
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary' })
            // 存储获取到的数据
            const data = {}
            let sheetName = ''
            // 遍历获取每张工作表 除去隐藏表
            const allSheets = workbook.Workbook.Sheets
            for (const index in allSheets) {
              const name = allSheets[index].name
              if (workbook.Sheets.hasOwnProperty(name) && allSheets[index].Hidden === 0) {
                sheetName = name
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                data[name] = [].concat(XLSX.utils.sheet_to_json(workbook.Sheets[name],{defval:'',blankrows:true}))
                break
              }
            }
            // 去除每个字段的前后空格以及最后的空格行
            const newData = handleImportData(data[sheetName])
            const fields = {'发票类型':'invoiceType','扣除金额':'deductionAmount','不含税收入':'incomeExcludingTax','税额':'taxFee','发票金额':'invoiceFee','备注':'remark'};
            let errorArr = []
            const params = newData.map((item,index)=>{
              const field = {}
              for(const key in item){
                if(key === '发票类型'){
                  field[fields[key]] = item[key] === '普票' ? '2' : '0';
                }else{
                  field[fields[key]] = item[key];
                }
              }
              // eslint-disable-next-line
              let validateField = _.cloneDeep(field);
              delete validateField.remark;
              if(Object.values(validateField).length != 5){
                errorArr.push({line:index+1,color:'red',message:'除备注非必填，其他项必填!'});
              }
              return {...field,...{billId:_this.billId}};
            })
            if(errorArr.length){
              _this.$refs.errorModal.title = `导入提示`
              _this.$refs.errorModal.message = 'error';
              _this.$refs.errorModal.showModal(errorArr);
              _this.btnLoading = false;
              return false;
            }
            const contextType = { 'Content-Type': 'application/json;charset=UTF-8' }
            const requestTimeOut = timeOut ? timeOut : 600000  // 请求过期时间
            
            //开始异步提交
            httpActionHeader('/hrSocial/tfinanceInvoice/saveBatch', JSON.stringify(params), 'post', contextType, requestTimeOut).then((res) => {
              const msg = res.message || res.msg
              if (Number(res.code) === 200) {
                if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  _this.$refs.errorModal.title = `导入提示: ${msg}`
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.errorMessageList)
                  _this.modalOk()
                } else {
                  _this.$message.success("导入成功！")
                  _this.modalOk()
                }
              } else {
                if (res.data != null && res.data.length > 0) {
                  _this.$refs.errorModal.title = `导入提示: ${msg}`
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.data)
                } else if (res.errorMessageList != null && res.errorMessageList.length > 0) {
                  _this.$refs.errorModal.title = `导入提示: ${msg}`
                  _this.$refs.errorModal.message = msg
                  _this.$refs.errorModal.showModal(res.errorMessageList)
                } else {
                  _this.$message.error(msg)
                }
              }
            }).finally(()=>{
              _this.btnLoading = false
            })
          } catch (e) {
            _this.btnLoading = false
            // 这里可以抛出文件类型错误不正确的相关提示
            this.$message.error('文件上传错误！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file)
      },

    }

  }
</script>

<style lang="less" scoped>
.invoiceTitle{
  margin: 40px 0px 20px;
  span{
    margin-right: 50px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
    font-size: 16px;
    line-height: 1.5;
  }
}
.invice{
  :global(.ant-descriptions-item-label) {
    width: 150px;
    text-align: center;
  }
  :global(.ant-descriptions-item-content){
    width: 300px;
  }
}
.tableContent{
  :global(.ant-table-body-inner) {
    overflow: hidden;
  }
}

</style>

