/**
 * 解析已经被转化过的ExcelJSON数据
 * @param excelJson
 */
export function parsingExcel2Json (excelJson) {
  // const DATA_REG = /("姓名"|"单位"|"合计"|"应发工资及津贴"),\s*"__EMPTY_?\d?":\s*"([^"]+)/g;
  const DATA_REG = /(\S|\s*"__EMPTY_?\d?"):\s*"([^"]+)/g;
  // eslint-disable-next-line
  let jsonArrayStr, values = [], matches,pointArr = [],findPoint = false,maxLength = 0;
  try {
    for (let i = 0; i < excelJson.length; i++) {
      pointArr.push(excelJson[i]);
      for (let o in excelJson[i]) {
        console.log(o)
        if(excelJson[i][o] == '手机号' || excelJson[i][o] == '手机号码' || excelJson[i][o] == '联系电话' || excelJson[i][o] == '联系方式') {
          findPoint = true;
        }
      }
      if(findPoint) {
        break;
      }
    }
    if(!findPoint) {
      console.error("没有找到手机号！");
    }
    jsonArrayStr = JSON.stringify(pointArr);
    // eslint-disable-next-line
    while (matches = DATA_REG.exec(jsonArrayStr)) {
      if (matches && matches.length > 2) {
        values.push(matches[2]);
      }
    }
  } catch (error) {
    console.error("SheetData序列化失败");
  }
  console.log(values);
}