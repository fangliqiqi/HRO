
const customerType = ['集团客户','重点客户','一般客户','电信客户']
const chapterType = ['', '合同章', '法人章']
const companyChapterType = ['', '皖信', '柯恩', '易服','昊伦','赤道线','一册','云南润才','启智','','思创','乾坤保安']
const contractTemplate = ['', '公司模板无修改', '公司模板有修改', '客户指定', '其他模板']
const settleCycle = ['', '月结', '季度结', '半年结', '年结']
const settleType = ['', '当月结当月费用', '当月结上月费用', '当月结下月费用', '其他']

const emergeServiceModeOption = [{value:'1',label:'电话服务'},{value:'2',label:'外出服务'},{value:'3',label:'内部对接'}] // 突发事件 服务方式
const emergeSourceTypeOption = [{value:'0',label:'我司'},{value:'1',label:'客户'},{value:'2',label:'社保局'},{value:'3',label:'保险公司'}] // 突发事件 费用承担方


export default
{
  customerType,
  chapterType,
  companyChapterType,
  contractTemplate,
  settleCycle,
  settleType,
  emergeServiceModeOption,
  emergeSourceTypeOption
}