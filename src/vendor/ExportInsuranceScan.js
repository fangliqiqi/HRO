/* eslint-disable */
require('script-loader!file-saver');
import XLSX from "xlsx-style"


function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook()
  this.SheetNames = []
  this.Sheets = {}
}

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

function setRange(range,R,C){
  if (range.s.r > R) {
    range.s.r = R
  }
  if (range.s.c > C) {
    range.s.c = C
  }
  if (range.e.r < R) {
    range.e.r = R
  }
  if (range.e.c < C) {
    range.e.c = C
  }
  return range
}
function getWsRange(data){
  const ws = {}
  var range = {s: {c: 10000000,r: 10000000},e: {c: 0,r: 0}}
  for (var R = 0; R < data.length; ++R) {
    for (var C = 0; C < data[R].length; ++C) {
      range = setRange(range,R,C)

      var cell = {v: data[R][C]}
      switch (cell.v) {
        case (typeof cell.v === 'number') :
          cell.t = 'n'
        break
        case (typeof cell.v === 'boolean') :
          cell.t = 'b'
        break
        case (cell.v instanceof Date) :
          cell.t = 'n'
          cell.z = XLSX.SSF._table[14]
          cell.v = datenum(cell.v)
        break
        case (cell.v == null):
          continue
        default:
          cell.t = 's'
        break
      }
      const cellRef = XLSX.utils.encode_cell({c: C,r: R})
      ws[cellRef] = cell
    }
  }
  if (range.s.c < 10000000) {
    ws['!ref'] = XLSX.utils.encode_range(range)
  }
  return ws
}

function sheet_from_array_of_arrays(data, opts,autoLength) {
  var ws = getWsRange(data)
  // 默认样式
  const defaultStyle = { 
    border: {
      bottom: { style: "thin", color: { rgb: "000000" } }, top: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } }
    },
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '宋体', sz: 10, color: { rgb: "000000" }, outline: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }
  const titleStyle ={
    border:defaultStyle.border,
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '宋体', sz: 18, color: { rgb: "ea5b5b" }, outline: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }
  const thStyle = {
    border:defaultStyle.border,
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '宋体', sz: 10, color: { rgb: "000" }, outline: true, bold: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }
  const tdStyle = {
    border:defaultStyle.border,
    font: { name: '宋体', sz: 10, color: { rgb: "333" }, outline: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }

  // 列表
  if (opts == 0 || opts == 1) {
    let length = data[0].length
    length = (length > 26) ? 26 : length
    for (var i = 0; i < length; i++) {
      const order = String.fromCharCode((65 + i)) // A
      let header = order + 1 // A1
      ws[header].s = thStyle
      for (var j = 2; j < data.length + 1; j++) {
        let header2 = order + j
        if (ws[header2] != undefined) {
          ws[header2].s = defaultStyle
        }
      }
    }
  }
  if (opts > 1 ){
    // 修改首行的行高
    let wsrows = [];
    // 普通薪资结算单
    if(autoLength.salaryLength){
      if(opts < autoLength.salaryLength+2){
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
          { s: { r: 1, c: 1 }, e: { r: 1, c: 2 } },
          { s: { r: 2, c: 1 }, e: { r: 2, c: 4 } },
          { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
          { s: { r: 4, c: 0 }, e: { r: 7, c: 0 } },
          { s: { r: 8, c: 0 }, e: { r: 11, c: 0 } },
          { s: { r: 12, c: 0 }, e: { r: 15, c: 0 } },
          { s: { r: 16, c: 0 }, e: { r: 19, c: 0 } },
          { s: { r: 20, c: 0 }, e: { r: 20, c: 1 } },
          { s: { r: 21, c: 0 }, e: { r: 21, c: 1 } },
        ]
        const index = 21+autoLength.salarySub[opts-2]
        for(let j1=21;j1<=index;j1++){
          ws['!merges'].push(
            { s: { r: j1, c: 0 }, e: { r: j1, c: 1 } }
          )
        }
        ws['!merges'].push({ s: { r: index+1, c: 0 }, e: { r: index+1, c: 1 } })
        ws['!merges'].push({ s: { r: index+2, c: 0 }, e: { r: index+2, c: 1 } })
        ws['!merges'].push({ s: { r: index+3, c: 0 }, e: { r: index+3, c: 1 } })
        ws['!merges'].push({ s: { r: index+4, c: 0 }, e: { r: index+4, c: 1 } })
        ws['!merges'].push({ s: { r: index+5, c: 0 }, e: { r: index+5, c: 1 } })
        ws['!merges'].push({ s: { r: index+6, c: 0 }, e: { r: index+6, c: 1 } })
        ws['!merges'].push({ s: { r: index+7, c: 0 }, e: { r: index+7, c: 1 } })
        ws['!merges'].push({ s: { r: index+8, c: 0 }, e: { r: index+8, c: 1 } })
        ws['!merges'].push({ s: { r: index+9, c: 0 }, e: { r: index+9, c: 1 } })
        ws['!merges'].push({ s: { r: index+10, c: 0 }, e: { r: index+10, c: 1 } })
        ws['!merges'].push({ s: { r: index+11, c: 0 }, e: { r: index+11, c: 1 } })
        ws['!merges'].push({ s: { r: index+12, c: 0 }, e: { r: index+12, c: 1 } })

        for(let n=1;n<index+14;n++){
          for(let m=0;m<5;m++){
            const order1 = String.fromCharCode((65+m))
            ws[order1+String(n)].s = defaultStyle
          }
        }
        ws["A1"].s = titleStyle
      }
      wsrows.push({ hpx: 40 })
      ws['!rows'] = wsrows
    }
    
    // 工程薪资
    if(autoLength.engineerSalaryLength){
      if(opts >= autoLength.salaryLength+2 && opts < autoLength.salaryLength+autoLength.engineerSalaryLength+2){
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
          { s: { r: 1, c: 1 }, e: { r: 1, c: 3 } },
          { s: { r: 2, c: 1 }, e: { r: 2, c: 3 } },
          { s: { r: 3, c: 1 }, e: { r: 3, c: 3 } },
          { s: { r: 10, c: 0 }, e: { r: 10, c: 1 } },
          { s: { r: 11, c: 0 }, e: { r: 11, c: 1 } },
          { s: { r: 12, c: 0 }, e: { r: 12, c: 1 } },
        ]
        // 当前有几个循环数据
        const leng = autoLength.salaryEngineerSub[opts-2]
        // 默认样式
        for(let n=1;n<leng+20;n++){
          for(let m=0;m<4;m++){
            const order2 = String.fromCharCode((65 + m))
            ws[order2+String(n)].s = defaultStyle
          }
        }
        for(let i=13;i<leng+13;i++){
          ws["A"+String(i)].s = thStyle
          ws['!merges'].push({ s: { r: i, c: 0 }, e: { r: i, c: 1 } })
        }
        for (let m = leng+13; m < leng+19; m++) {
          ws['!merges'].push({ s: { r: m, c: 0 }, e: { r: m, c: 1 } })
          ws["A"+String(m)].s = thStyle
        }
        ws["A1"].s = titleStyle
        ws["A2"].s = ws["A3"].s = ws["A4"].s = ws["A11"].s = ws["A12"].s = thStyle
        ws["A5"].s = ws["B5"].s = ws["C5"].s = ws["D5"].s = thStyle
        ws["B6"].s = ws["B7"].s = ws["B8"].s = ws["B9"].s = ws["B10"].s = thStyle
      }
      wsrows.push({ hpx: 40 })
      ws['!rows'] = wsrows
    }

    if(autoLength.forecastVoLength){
      if(opts >= autoLength.salaryLength+autoLength.engineerSalaryLength+2 && opts < autoLength.salaryLength+autoLength.engineerSalaryLength+autoLength.forecastVoLength+2){
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
          { s: { r: 1, c: 1 }, e: { r: 1, c: 2 } },
          { s: { r: 2, c: 1 }, e: { r: 2, c: 4 } },
          { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
          { s: { r: 4, c: 0 }, e: { r: 5, c: 0 } },
          { s: { r: 6, c: 0 }, e: { r: 7, c: 0 } },
          { s: { r: 8, c: 0 }, e: { r: 8, c: 1 } },
          { s: { r: 9, c: 0 }, e: { r: 9, c: 1 } },
          { s: { r: 10, c: 0 }, e: { r: 10, c: 1 } },
          { s: { r: 11, c: 0 }, e: { r: 11, c: 1 } },
          { s: { r: 12, c: 0 }, e: { r: 12, c: 1 } },
          { s: { r: 13, c: 0 }, e: { r: 13, c: 1 } },
          { s: { r: 14, c: 0 }, e: { r: 14, c: 1 } },
          { s: { r: 15, c: 0 }, e: { r: 15, c: 1 } },
          { s: { r: 16, c: 0 }, e: { r: 16, c: 1 } },
          { s: { r: 17, c: 0 }, e: { r: 17, c: 1 } },
          { s: { r: 18, c: 0 }, e: { r: 18, c: 1 } },

          // { s: { r: 19, c: 0 }, e: { r: 19, c: 1 } },
          // { s: { r: 20, c: 0 }, e: { r: 20, c: 1 } },
          // { s: { r: 21, c: 0 }, e: { r: 21, c: 1 } },
          // { s: { r: 21, c: 2 }, e: { r: 21, c: 4 } },
        ]
        const tforecastBillSubList = autoLength['tforecastBillSubList'][opts-2]
        for(let k=0;k<tforecastBillSubList;k++){
          ws['!merges'].push({ s: { r: 19+k, c: 0 }, e: { r: 19+k, c: 1 } })
        }
        ws['!merges'].push({ s: { r: 19+tforecastBillSubList, c: 0 }, e: { r: 19+tforecastBillSubList, c: 1 } })
        ws['!merges'].push({ s: { r: 20+tforecastBillSubList, c: 0 }, e: { r: 20+tforecastBillSubList, c: 1 } })
        ws['!merges'].push({ s: { r: 21+tforecastBillSubList, c: 0 }, e: { r: 21+tforecastBillSubList, c: 1 } })
        ws['!merges'].push({ s: { r: 21+tforecastBillSubList, c: 2 }, e: { r: 21+tforecastBillSubList, c: 4 } })
        
        for(let n1=1;n1<23+tforecastBillSubList;n1++){
          for(let m1=0;m1<5;m1++){
            const order3 = String.fromCharCode((65 + m1))
            ws[order3+String(n1)].s = defaultStyle
          }
        }
        ws["A1"].s = titleStyle
      }
      wsrows.push({ hpx: 40 })
      ws['!rows'] = wsrows
    }

    if(opts >= autoLength.salaryLength+autoLength.engineerSalaryLength+autoLength.forecastVoLength+2){
      const itemLength = data.length-9
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
        { s: { r: 0, c: 4 }, e: { r: 9, c: 4 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
        { s: { r: 5+itemLength, c: 1 }, e: { r: 5+itemLength, c: 2 } },
        { s: { r: 6+itemLength, c: 0 }, e: { r: 6+itemLength, c: 3 } },
        { s: { r: 7+itemLength, c: 1 }, e: { r: 7+itemLength, c: 3 } },
        { s: { r: 8+itemLength, c: 0 }, e: { r: 8+itemLength, c: 3 } },
      ]
      for (let m = 0; m < 5; m++) {
        const order = String.fromCharCode((65 + m))
        for(let n = 1; n < 10+itemLength; n++){
          ws[order+String(n)].s = defaultStyle
        }
      }
      ws["A1"].s = titleStyle
      ws['C3'].s = ws['A4'].s = ws['B4'].s = ws['C4'].s = ws['D4'].s = ws['A'+String(6+itemLength)].s = ws['A'+String(8+itemLength)].s = thStyle
      wsrows.push({ hpx: 40 })
      ws['!rows'] = wsrows
    }

  }
  
  return ws
}

export function export_json_to_excel_more_sheet({
  header,
  data,
  sheetname,
  filename,
  merges = [],
  autoWidth = true,
  autoLength=0,
  bookType = "xlsx"
} = {}) {
  /* original data */
  filename = filename || "excel-list"
  data = [...data]

  var wb = new Workbook(),ws = []
  // 列表 添加表头header
  header.forEach((item,index) => {
    if(index<2){
      data[index].unshift(item)
    }
    ws.push(sheet_from_array_of_arrays(data[index], index,autoLength))
  })

  if (merges.length > 0) {
    if (!ws["!merges"]) ws["!merges"] = []
    merges.forEach(item => {
      ws["!merges"].push(XLSX.utils.decode_range(item))
    })
  }
  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    var colWidth = []
    for (var k = 0; k < header.length; k++) {
      colWidth.push(
        data[k].map(row =>
          row.map(val => {
            /*先判断是否为null/undefined*/
            if (val == null) {
              return {
                wch: 10
              }
            } else if (val.toString().charCodeAt(0) > 255) {
              /*再判断是否为中文*/
              return {
                wch: val.toString().length * 2
              }
            } else {
              return {
                wch: val.toString().length
              }
            }
          })
        )
      )
    }
    
    /*以第一行为初始值*/
    let result = []
    for (var k = 0; k < colWidth.length; k++) {
      result[k] = colWidth[k][0]
      for (let i = 1; i < colWidth[k].length; i++) {
        for (let j = 0; j < colWidth[k][i].length; j++) {
          if (result[k][j]["wch"] < colWidth[k][i][j]["wch"]) {
            result[k][j]["wch"] = colWidth[k][i][j]["wch"] + 5
          }
          if (k == 0) {
            result[k][j]["wch"] = 12
            if (j == 2) {
              result[k][j]["wch"] = 20
            }
            if (j == 4) {
              result[k][j]["wch"] = 17
            }
            if (j == 5) {
              result[k][j]["wch"] = 18
            }
            if (j == 7) {
              result[k][j]["wch"] = 16
            }
          } else if (k == 1) {
            result[k][j]["wch"] = 13.75
          }else if (k >= 2 && k < (autoLength.salaryLength+autoLength.engineerSalaryLength+autoLength.forecastVoLength+2)) {
            if (j == 0) {
              result[k][j]["wch"] = 10
            } else {
              result[k][j]["wch"] = 18
            }
          }else{
            if (j == 0) {
              result[k][j]["wch"] = 40
            } else if(j == 4) {
              result[k][j]["wch"] = 2
            }else{
              result[k][j]["wch"] = 25
            }
          }
        }
      }
    }
    // 分别给sheet表设置宽度
    for (var l = 0; l < result.length; l++) {
      ws[l]["!cols"] = result[l]
    }
  }
  /* add worksheet to workbook */
  for (var k = 0; k < header.length; k++) {
    wb.SheetNames.push(sheetname[k])
    wb.Sheets[sheetname[k]] = ws[k]
  }

  var wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: "binary"
  })
  saveAs(
    new Blob([s2ab(wbout)], {
      type: "application/octet-stream"
    }),
    `${filename}.${bookType}`
  )
}