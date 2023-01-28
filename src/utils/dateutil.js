/**
 * 计算两个日期相差多少年
 * @param {日期1 - 字符串} time1
 * @param {日期2 - 字符串} time2
 */
export function getTime2Time(startDateStr, endDateStr) {
  var day = 24 * 60 * 60 * 1000;

  var sDate = new Date(Date.parse(startDateStr.replace(/-/g, "/")));
  var eDate = new Date(Date.parse(endDateStr.replace(/-/g, "/")));

  //得到前一天(算头不算尾)
  sDate = new Date(sDate.getTime() - day);

  //获得各自的年、月、日
  var sY = sDate.getFullYear();
  var sM = sDate.getMonth() + 1;
  //var sD = sDate.getDate();
  var eY = eDate.getFullYear();
  var eM = eDate.getMonth() + 1;
  //var eD = eDate.getDate();

  if (eY > sY && sM == eM) {
    return eY - sY;
  } else if (eY == sY && eM > sM) {
    return ((eM - sM) / 12).toFixed(1);
  }
}

/**
 * 计算月份差
 * @param date1
 * @param date2
 * @returns {number}
 */
export function getMonths(date1 , date2){
  //用-分成数组
  date1 = date1.split("-");
  date2 = date2.split("-");
  //获取年,月数
  let year1 = parseInt(date1[0]) ,
  month1 = parseInt(date1[1]) ,
  year2 = parseInt(date2[0]) ,
  month2 = parseInt(date2[1]) ,
  //通过年,月差计算月份差
  months = (year2 - year1) * 12 + (month2-month1);
  return months;
}

/**
 * 获取当前时间
 * 格式YYYY-MM-DD
 */
export function getNowFormatDate () {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}