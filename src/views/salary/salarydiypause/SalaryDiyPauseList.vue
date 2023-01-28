<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="项目名称">
              <a-input
                v-model="queryParam.itemName"
                placeholder="请输入项目名称"
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算主体">
              <a-select
                v-model="queryParam.settleId"
                showSearch
                optionFilterProp="children"
                :dropdownMatchSelectWidth="false"
                placeholder="选择结算主体"
                allowClear
              >
                <a-select-option
                  v-for="(item, index) in settlementList"
                  :key="index"
                  :value="item.id"
                >{{ item.departName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="8"
          >
            <a-form-item label="结算月份">
              <a-month-picker
                v-model="queryParam.settleDate"
                style="width: 100%"
                placeholder="请输入结算月份"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="结算类型">
                <a-select
                  v-model="queryParam.formType"
                  placeholder="请选择"
                >
                  <a-select-option value="0">普通薪资</a-select-option>
                  <a-select-option value="1">工程薪资</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>

          <a-col
            :md="6"
            :sm="8"
          >
            <span
              style="float: left;overflow: hidden;"
              class="table-page-search-submitButtons"
            >
              <a-button
                type="primary"
                @click="searchQuery"
                icon="search"
              >查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
              <a
                @click="handleToggleSearch"
                style="margin-left: 8px"
              >
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 列表 -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a
            @click="handleGrant(record)"
            v-has="'wxhr:tpausediyinfo_edit'"
          >发放方式</a>
          <a-divider type="vertical" />
          <a
            @click="handleConGrant(record)"
            v-has="'wxhr:tpausediyinfo_doIssue'"
          >发放</a>
          <a-divider type="vertical" />
          <a
            @click="handleSplit(record)"
            v-has="'wxhr:tpausediyinfo_doIssue'"
          >拆分发放</a>
          <a-divider type="vertical" />
          <a @click="handleRecord(record)">发放记录</a>
        </span>

      </a-table>
    </div>

    <!-- 发放方式弹框 -->
    <a-modal
      title="发放方式"
      :width="700"
      placement="right"
      :closable="true"
      @cancel="handleGrantCancel"
      @ok="handleGrantOk"
      :ok-button-props="{ props: { disabled: confirmLoading } }"
      cancelText="取消"
      okText="确定"
      :visible="visible"
      :confirmLoading="confirmLoading"
    >
      <a-spin :spinning="spinning">
        <a-form :form="form">
          <a-form-item
            label="发放方式"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-radio-group
              v-decorator="['salaryStyle', {initialValue:'1'} ]"
              buttonStyle="solid"
              @change="changeRadio"
            >
              <a-radio-button :value="1">银行</a-radio-button>
              <a-radio-button
                :value="0"
                style="margin-left:10px"
              >现金</a-radio-button>
              <a-radio-button
                :value="9"
                style="margin-left:10px"
              >不发放</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="备注"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-textarea v-decorator="['remark',{rules: [{ max: 200, message: '最多200个字符！',required:false }]}] "></a-textarea>
          </a-form-item>
          <a-form-item
            v-if="grantType == 1"
            label="收款单位"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              placeholder="如果转账个人,可填写个人姓名"
              v-decorator="['orgName', validatorRules.orgName ]"
            />
          </a-form-item>
          <a-form-item
            v-if="grantType == 1"
            label="银行账户"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="['bankNo', validatorRules.bankNo ]" />
          </a-form-item>
          <a-form-item
            v-if="grantType == 1"
            label="开户行"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="['bankName', validatorRules.bankName ]" />
          </a-form-item>
          <a-form-item
            label="转款方式"
            v-if="grantType == 1"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select
              v-decorator="['payStyle', {initialValue:0} ]"
              @change="changePay"
            >
              <a-select-option :value="0">单位</a-select-option>
              <a-select-option :value="1">个人</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            v-if="payStyle == 1"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="附件上传"
          >
            <a-upload
              v-decorator="['attaId', {} ]"
              @change="handleUpload"
              :fileList="fileList"
              :beforeUpload="beforeUpload"
              :remove="handleRemove"
            >
              <a-button>
                <a-icon type="upload" /> 上传附件 </a-button>
            </a-upload>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <!-- 是否发放弹框 -->
    <a-modal
      title="发放工资"
      :width="600"
      :visible="confirmVisible"
      @ok="handleConOk"
      @cancel="handleConCancel"
      cancelText="取消"
      okText="确定"
      :confirmLoading="conLoading"
    >
      <a-form :form="grantForm">
        <p style="text-align: center;color: #000;font-weight: bold;font-size: 15px;">确定全额发放工资吗？</p>
        <a-form-item
          label="证明材料"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-upload
            :beforeUpload="handleBeforeUpload"
            :fileList="uploadFiles"
            :remove="(file)=>remove(file)"
          >
            <a-button><a-icon type="upload" />点击上传</a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
          label="无发票说明"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea v-decorator="['diyNoAttaRemark',{rules: [{ max: 250, message: '最多250个字符！' }]}]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 拆分发放 -->
    <a-modal
      title="拆分发放"
      :visible="spiltVisible"
      @ok="handleSplitOk"
      @cancel="handleSplitCancel"
      cancelText="取消"
      okText="确定"
      :confirmLoading="splitLoading"
    >
      <a-spin :spinning="splitSpinning">
        <a-form :form="splitForm">
          <a-form-item
            label="余额"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <span>{{ grantOne.balance }}</span>
          </a-form-item>
          <a-form-item
            label="发放金额"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="['issueMoney', validatorSplitRules.balanceSpilit ]" />
          </a-form-item>
          <a-form-item
            label="证明材料"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-upload
              :beforeUpload="handleBeforeUpload"
              :fileList="uploadFiles"
              :remove="(file)=>remove(file)"
            >
              <a-button><a-icon type="upload" />点击上传</a-button>
            </a-upload>
          </a-form-item>
          <a-form-item
            label="无发票说明"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-textarea v-decorator="['diyNoAttaRemark',{rules: [{ max: 250, message: '最多250个字符！' }]}]"></a-textarea>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <!-- 发放记录 -->
    <pause-record-modal
      ref="pauseModal"
      :bankOptions="bankOptions"
    ></pause-record-modal>

  </a-card>
</template>
<script>
import pick from 'lodash.pick'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import PauseRecordModal from './modules/PauseRecordModal'
import { getSettlementAuthorityByUser } from '@/api/api'
import { mapGetters } from 'vuex'
import { httpAction, postActionHeader } from '@/api/manage'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
export default {
  name: 'SalaryDiyPauseList',//自定义暂停发
  mixins: [JeecgListMixin],
  components: {
    PauseRecordModal
  },
  data() {
    return {
      visible: false,
      spinning: false, // 发放方式弹窗spinning
      confirmVisible: false,
      spiltVisible: false,
      splitSpinning: false,
      confirmLoading: false, // 发放方式弹窗loading
      splitLoading: false, // 拆分发放弹窗loading
      conLoading: false, // 发放工资弹窗loading
      isUpload: false, // 判断附件是否上传成功
      form: this.$form.createForm(this),
      splitForm: this.$form.createForm(this),
      grantForm: this.$form.createForm(this),
      columns: [
        {
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleName',
          customRender:(text)=>{
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '自定义项目名称',
          align: 'center',
          dataIndex: 'itemName',
          customRender:(text)=>{
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '项目类别',
          align: 'center',
          dataIndex: 'itemTypeName',
          customRender:(text)=>{
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '项目金额',
          align: 'center',
          dataIndex: 'money',
          customRender: text => {
            return text ? text.toLocaleString() : '-'
          }
        },
        {
          title: '结算月份',
          align: 'center',
          dataIndex: 'settleDate',
          customRender:(text)=>{
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '创建日期',
          align: 'center',
          dataIndex: 'createDate',
          customRender:(text)=>{
            const result = text || '-'
            return <a-tooltip title={result}>{result}</a-tooltip>
          }
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createUser',
          customRender: text => {
            for (const item of this.userData) {
              if (String(text) === String(item.userId)) {
                return item.nickname
              }
            }
            return '-'
          }
        },
        {
          title: '余额',
          align: 'center',
          dataIndex: 'balance',
          customRender: text => {
            return text ? text.toLocaleString() : '-'
          }
        },
        {
          width:300,
          title: '操作',
          dataIndex: 'action',
          align:'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      url: {
        list: '/salary/tpausediyinfo/getTPauseDiyInfoPageByIssue',
        editPause: '/salary/tpausediyinfo',
        doIssueAll: '/salary/tpausediyinfo/doIssueAll',
        doIssueSplit: '/salary/tpausediyinfo/doIssueSplit',
        attachmentUploadUrl: '/salary/tsalaryatta/ossUploadFile', //上传接口
        attachmentListUrl: '/salary/tsalaryatta/ossFileUrl/', //预览文件列表
        attachmentDelUrl: '/salary/tsalaryatta/ossFileDelete/' //删除文件
      },
      grantType: 1,
      payStyle: 0,
      grantOne: {},
      settlementList: [],
      bankOptions: [],
      validatorRules: {
        orgName: { rules: [{ required: true, message: '请输入收款单位!' }] },
        bankName: { rules: [{ required: true, message: '请输入开户行!' }] },
        bankNo: { rules: [{ required: true, message: '请输入银行账户!' }] },
        attaId: { rules: [{ required: true, message: '请请选择附件!' }] }
      },
      validatorSplitRules: {
        balanceSpilit: { rules: [{required: true, validator: this.isNumber }] }
      },
      userData: [],
      fileList: [],
      uploading: false,
      attaId: '',
      conAttaid: '',
      uploadData: {},
      isSelecte: '',
      attaList:[],
      canUpload:false,
      uploadFiles:[],

    }
  },
  created() {
    this.initDictConfig()
    this.loadSettlementList()
    this.loadUserList()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    handleGrant(record) {
      this.visible = true
      this.form.resetFields()
      this.grantOne = record
      this.grantType = record.salaryStyle
      this.payStyle = record.payStyle
      console.log(record);
      
      this.fileList = []
      this.attaId = record.attaId
      if (Number(record.payStyle) === 1 && record.attaId) {
        httpAction(this.url.attachmentListUrl + record.attaId, {}, 'GET').then(res => {
          if (res.data) {
            this.fileList = [
              {
                uid: res.data.id, // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
                name: res.data.attaName, // 文件名
                status: 'done', // 状态有：uploading done error removed
                url: res.data.attaUrl
              }
            ]
          }
        })
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(record, 'bankNo', 'bankName', 'orgName', 'payStyle', 'salaryStyle', 'attaId', 'remark')
        )
      })
    },
    handleGrantCancel() {
      this.visible = false
      this.confirmLoading = false
      this.spinning = false
    },
    // 修改发放方式
    handleGrantOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          this.spinning = true
          let formData = Object.assign({}, values)
          formData.id = this.grantOne.id
          httpAction(this.url.editPause, formData, 'PUT').then(res => {
            if (Number(res.code) === 200) {
              if (this.conAttaid) {
                httpAction(this.url.attachmentDelUrl + this.conAttaid, {}, 'GET').then(result => {
                  if (Number(result.code) === 200) {
                    this.conAttaid = ''
                  }
                })
              }

              this.loadData()
              this.confirmLoading = false
              this.spinning = false
              this.$message.success('修改成功')
              this.visible = false
            } else {
              this.confirmLoading = false
              this.spinning = false
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    changeRadio(e) {
      this.grantType = e.target.value
    },
    // 确定发放弹框取消
    handleConCancel() {
      this.confirmVisible = false;
      this.uploadFiles = [];
    },
    // 确定发放弹框提示
    handleConGrant(record) {
      this.grantOne = record
      this.confirmVisible = true
    },
    // 确定发放表单提交
    handleConOk() {
      let isSend = true;
      if (Number(this.grantOne.salaryStyle) === 1) {
        if (String(this.grantOne.bankName) === '' || String(this.grantOne.bankNo) === '') {
          isSend = false;
          this.$message.error('没有开户行!不能发放');
        }
      }
      if (isSend) {
        this.grantForm.validateFields((err, values) => {
          if (!err) {
            // 判断证明材料和无发票说明是否存在一项
            if(!values['diyNoAttaRemark'] && this.uploadFiles.length===0){
              this.$message.warning('证明材料和无发票说明不能同时为空！');
              return false;
            }
            const formData = new FormData();
            formData.append('id', this.grantOne.id);
            if(values['diyNoAttaRemark']){
              formData.append('diyNoAttaRemark', values['diyNoAttaRemark']);
            }
            this.uploadFiles.forEach(file=>{
              formData.append('files', file);
            })
            const contextType = { 'Content-Type': 'multipart/form-data' };
            this.conLoading = true;
            postActionHeader(`/salary/tpausediyinfo/doIssueAll`, formData, contextType, 60000).then(res => {
              if (200 === res.code) {
                this.$message.success(res.msg);
                this.loadData();
                this.handleConCancel();
              }else{
                this.$message.warning(res.msg);
              }
            }).finally(()=>{
              setTimeout(() => {
                this.conLoading = false;
              }, 2000);
            })

          }
        })

      }
    },
    // 拆分发放弹框
    handleSplit(record) {
      this.grantOne = record
      this.spiltVisible = true
      this.splitForm.resetFields()
    },
    // 拆分弹框取消
    handleSplitCancel() {
      this.spiltVisible = false;
      this.uploadFiles = [];
    },
    // 拆分发放提交
    handleSplitOk() {
      this.splitForm.validateFields((err, values) => {
        if (!err) {
          // 判断证明材料和无发票说明是否存在一项
          if(!values['diyNoAttaRemark'] && this.uploadFiles.length===0){
            this.$message.warning('证明材料和无发票说明不能同时为空！');
            return false;
          }
          const formData = new FormData();
          formData.append('id', this.grantOne.id);
          if(values['diyNoAttaRemark']){
            formData.append('diyNoAttaRemark', values['diyNoAttaRemark']);
          }
          formData.append('issueMoney', values['issueMoney']);
          this.uploadFiles.forEach(file=>{
            formData.append('files', file);
          })
          const contextType = { 'Content-Type': 'multipart/form-data' };
          this.splitLoading = true;
          postActionHeader(`/salary/tpausediyinfo/doIssueSplit`, formData, contextType, 60000).then(res => {
            if (200 === res.code) {
              this.$message.success(res.msg);
              this.loadData();
              this.handleSplitCancel();
            }else{
              this.$message.warning(res.msg);
            }
          }).finally(()=>{
            setTimeout(() => {
              this.splitLoading = false;
            }, 2000);
          })
        }
      })
    },
    // 发放记录
    handleRecord(record) {
      this.$refs.pauseModal.show(record)

    },
    // // 工资表详情
    // handleDetail(record){
    //   this.$refs.salaryDetailModal.show(record)
    //   this.$refs.salaryDetailModal.title = '工资表'
    // },
    // 获取结算列表
    loadSettlementList() {
      getSettlementAuthorityByUser({}).then(res => {
        this.settlementList = res.data
      })
    },
    // 获取用户列表
    loadUserList() {
      httpAction('admin/user/findUserBypPrmission?permissionStr=wxhr:hr_salary_diy_pause', '', 'GET').then(res => {
        if (Number(res.code) === 200) {
          this.userData = res.data
        }
      })
    },
    // 修改转款方式
    changePay(value) {
      this.payStyle = value
    },
    // 验证银行卡号
    isBankNo(rule, value, callback) {
      if (value.length > 25) {
        callback(new Error('银行卡号不能超过25位！'))
      } else {
        callback()
      }
    },
    // 验证数字
    isNumber(rule, value, callback) {
      const reg = /^[0-9]+(.[0-9]{1,2})?$/
      if (!reg.test(value) && value != '') {
        callback(new Error('请输入正确的金额'))
      } else {
        if (value > this.grantOne.balance) {
          callback(new Error('发放金额不能大于余额'))
        } else {
          callback()
        }
      }
    },
    handleBeforeUpload(file){
      if(file.size / 1024 / 1024 > 5){
        this.$message.error('附件不能超过5MB!');
        return false;
      }
      this.uploadFiles = [...this.uploadFiles,file];
      return false;
    },
    handleUploadFile(obj){
      if(obj.size / 1024 / 1024 > 5){
        this.$message.warning(`文件${obj.name}大于5M!`);
        return false;
      }
      const formData = new FormData();
      formData.append('file', obj);
      formData.append('linkId', '');
      formData.append('linkType', 6);
      formData.append('engineerType', 3);
      const contextType = { 'Content-Type': 'multipart/form-data' };
      postActionHeader(`/salary/tsalaryatta/ossUploadFile`, formData, contextType, 60000)
        .then(res => {
          if (200 === res.code) {
            this.$message.success('上传成功！');
            this.attaList.push({
              uid: res.data.uid,
              name: res.data.name,
              status: 'done',
              url: res.data.url
            })
          }else{
            this.$message.warning(res.msg);
          }
        })
    },
    remove(file){
      const res = this.uploadFiles.filter(item=>item.uid !== file.uid);
      this.uploadFiles = res;
    },

    // 上传前
    beforeUpload() {
      return false
    },
    // 开始上传
    handleUpload(file) {
      if(file.file.size/ 1024 / 1024 > 5){
        this.$message.warning(`文件${file.file.name}大于5M,请把文件控制在5M以内!`);
        return false;
      }
      if (!this.isUpload) {
        const formData = new FormData()
        formData.append('linkId', this.grantOne.id)
        formData.append('linkType', 3) //类型：0工资；1工程工资；2暂停发；3自定义项暂停发
        formData.append('engineerType', 3)
        formData.append('file', file.file)
        const contextType = { 'Content-Type': 'multipart/form-data' }
        this.spinning = true
        this.confirmLoading = true
        const _this = this
        postActionHeader(_this.url.attachmentUploadUrl, formData, contextType,10000)
          .then(res => {
            if (Number(res.code) === 200) {
              _this.fileList = [..._this.fileList, res.data]
              _this.attaId = res.data.uid
              _this.form.setFieldsValue({ attaId: res.data.uid })
              _this.$message.success('上传附件成功')
            } else {
              _this.$message.error(res.msg || '附件上传失败！')
            }
          })
          .finally(() => {
            console.log('------finally')
            _this.spinning = false
            _this.confirmLoading = false
          })
      }
    },

    // 删除文件
    handleRemove(file) {
      this.isUpload = true
      const _this = this
      this.$confirm({
        title: '删除',
        content: '确定删除该附件？',
        okText: '确认',
        cancelText: '取消',
        onOk: function() {
          _this.spinning = true
          _this.confirmLoading = true
          httpAction(_this.url.attachmentDelUrl + _this.attaId, {}, 'GET')
            .then(result => {
              if (Number(result.code) === 200) {
                // 清除filelist中的文件
                const index = _this.fileList.indexOf(file)
                const newFileList = _this.fileList.slice()
                newFileList.splice(index, 1)
                _this.fileList = newFileList
                _this.conAttaid = _this.attaId
                _this.attaId = ''
                _this.form.setFieldsValue({ attaId: '' })
              } else {
                _this.$message.error(result.msg || '附件删除失败！')
              }
            })
            .finally(() => {
              _this.isUpload = false
              _this.spinning = false
              _this.confirmLoading = false
            })
        }
      })
    },

    // 文件预览
    previewFile(attaUrl) {
      window.open(attaUrl)
    },
    // 数据字典
    initDictConfig() {
      // 开户行
      initDictOptions('bank').then(res => {
        if (Number(res.code) === 200) {
          this.bankOptions = res.data
        }
      })
    }
  }
}
</script>
