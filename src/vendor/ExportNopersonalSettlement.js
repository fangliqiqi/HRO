/* eslint-disable */
require('script-loader!file-saver');
import XLSX from "xlsx-style"

function Workbook() {
  if (!(this instanceof Workbook)) {
    return new Workbook()
  }
  this.SheetNames = []
  this.Sheets = {}
}

function datenum(v, date1904) {
  if (date1904) {
    v += 1462
  }
  var epoch = Date.parse(v)
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i < s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
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

function getAlpha(length,ws,data,thStyle,defaultStyle){
  for (let i = 0; i < length; i++) {
    const order = String.fromCharCode((65 + i))
    const header = order + 1
    ws[header].s = thStyle
    for (var j = 2; j < data.length + 1; j++) {
      const header2 = order + j
      ws[header2].s = defaultStyle
    }
  }
  return ws
}

function getMoreAlpha(length,ws,data,thStyle,defaultStyle){
  const number = Math.floor(length / 26); // 循环次数
  const remainder = length % 26; // 取余数
  // 93 / 26 = 3 ...15
  // A ~ Z  AA ~ AZ BA~BZ   CA~CO
  for(let i = 0; i < number; i++){ // 3次循环
    const order1 = (i === 0) ? '' : String.fromCharCode((64 + i));
    for (let i = 0; i < 26; i++) {
      const order = order1+String.fromCharCode((65 + i));
      const header = order + 1;
      ws[header].s = thStyle
      for (let j = 2; j < data.length + 1; j++) {
        const header2 = order + j
        ws[header2].s = defaultStyle
      }
    }
  }
  const start = String.fromCharCode((64 + number));
  for(let j = 0; j < remainder; j++){ // 余数循环
    const order2 = String.fromCharCode((65 + j))
    const header = `${start}${order2}1`
    ws[header].s = thStyle
    for (let k = 2; k < data.length + 1; k++) {
      const header2 = `${start}${order2}${k}`
      ws[header2].s = defaultStyle
    }
  }
  return ws
}

// 获取excel行标
function getIndex(ws,data,thStyle,defaultStyle){
  const length = data[0].length
  if (length <= 26) {
    ws = getAlpha(length,ws,data,thStyle,defaultStyle)
  } else {
    ws = getMoreAlpha(length,ws,data,thStyle,defaultStyle)
  }
  return ws
}

// 根据数据获取表格范围
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
  
  const thStyle = {
    border:defaultStyle.border,
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { sz: 9, color: { rgb: "000000" },
    outline: true,bold: true },
    fill: {fgColor: { rgb: "DDDDDD" }}
  }
  // 列表
  ws = getIndex(ws,data,thStyle,defaultStyle)

  if(autoLength.settleType){
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
      { s: { r: 1, c: 2 }, e: { r: 1, c: 8 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
      { s: { r: 2, c: 2 }, e: { r: 2, c: 8 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
      { s: { r: 3, c: 2 }, e: { r: 3, c: 8 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } },
      { s: { r: 4, c: 2 }, e: { r: 4, c: 8 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } },
      { s: { r: 5, c: 2 }, e: { r: 5, c: 8 } },
      { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } },
      { s: { r: 6, c: 2 }, e: { r: 6, c: 8 } },
      { s: { r: 7, c: 0 }, e: { r: 7, c: 1 } },
      { s: { r: 7, c: 2 }, e: { r: 7, c: 8 } },

      { s: { r: 8, c: 0 }, e: { r: 8, c: 1 } },
      { s: { r: 8, c: 2 }, e: { r: 8, c: 3 } },
      { s: { r: 8, c: 4 }, e: { r: 8, c: 5 } },
      { s: { r: 8, c: 6 }, e: { r: 8, c: 8 } },

      { s: { r: 9, c: 0 }, e: { r: 9, c: 1 } },
      { s: { r: 9, c: 2 }, e: { r: 9, c: 3 } },
      { s: { r: 9, c: 4 }, e: { r: 9, c: 5 } },
      { s: { r: 9, c: 6 }, e: { r: 9, c: 8 } },

      { s: { r: 10, c: 0 }, e: { r: 10, c: 1 } },
      { s: { r: 10, c: 2 }, e: { r: 10, c: 4 } },
      { s: { r: 10, c: 6 }, e: { r: 10, c: 8 } },
    ]
  }else{
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
      { s: { r: 1, c: 2 }, e: { r: 1, c: 8 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
      { s: { r: 2, c: 2 }, e: { r: 2, c: 8 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
      { s: { r: 3, c: 2 }, e: { r: 3, c: 8 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } },
      { s: { r: 4, c: 2 }, e: { r: 4, c: 8 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } },
      { s: { r: 5, c: 2 }, e: { r: 5, c: 8 } },
      { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } },
      { s: { r: 6, c: 2 }, e: { r: 6, c: 8 } },

      { s: { r: 7, c: 0 }, e: { r: 7, c: 1 } },
      { s: { r: 7, c: 2 }, e: { r: 7, c: 3 } },
      { s: { r: 7, c: 4 }, e: { r: 7, c: 5 } },
      { s: { r: 7, c: 6 }, e: { r: 7, c: 8 } },

      { s: { r: 8, c: 0 }, e: { r: 8, c: 1 } },
      { s: { r: 8, c: 2 }, e: { r: 8, c: 3 } },
      { s: { r: 8, c: 4 }, e: { r: 8, c: 5 } },
      { s: { r: 8, c: 6 }, e: { r: 8, c: 8 } },
    ]
    //costList 成本等长度 
    for(let k=0;k<autoLength.costList;k++){
      ws['!merges'].push({ s: { r: 9+k, c: 0 }, e: { r: 9+k, c: 1 } })
      ws['!merges'].push({ s: { r: 9+k, c: 2 }, e: { r: 9+k, c: 3 } })
      ws['!merges'].push({ s: { r: 9+k, c: 4 }, e: { r: 9+k, c: 5 } })
      ws['!merges'].push({ s: { r: 9+k, c: 6 }, e: { r: 9+k, c: 8 } })
    }
    const clength = 9+autoLength.costList;
    // 业务收入
    ws['!merges'].push({ s: { r: clength, c: 0 }, e: { r: clength, c: 1 } })
    ws['!merges'].push({ s: { r: clength, c: 2 }, e: { r: clength, c: 3 } })
    ws['!merges'].push({ s: { r: clength, c: 4 }, e: { r: clength, c: 5 } })
    ws['!merges'].push({ s: { r: clength, c: 6 }, e: { r: clength, c: 8 } })
    // 开票金额
    ws['!merges'].push({ s: { r: clength+1, c: 0 }, e: { r: clength+1, c: 1 } })
    ws['!merges'].push({ s: { r: clength+1, c: 2 }, e: { r: clength+1, c: 3 } })
    ws['!merges'].push({ s: { r: clength+1, c: 4 }, e: { r: clength+1, c: 5 } })
    ws['!merges'].push({ s: { r: clength+1, c: 6 }, e: { r: clength+1, c: 8 } })
    // 上期差余额
    ws['!merges'].push({ s: { r: clength+2, c: 0 }, e: { r: clength+2, c: 1 } })
    ws['!merges'].push({ s: { r: clength+2, c: 2 }, e: { r: clength+2, c: 3 } })
    ws['!merges'].push({ s: { r: clength+2, c: 4 }, e: { r: clength+2, c: 5 } })
    ws['!merges'].push({ s: { r: clength+2, c: 6 }, e: { r: clength+2, c: 8 } })
    // 本期差余额
    ws['!merges'].push({ s: { r: clength+3, c: 0 }, e: { r: clength+3, c: 1 } })
    ws['!merges'].push({ s: { r: clength+3, c: 2 }, e: { r: clength+3, c: 3 } })
    ws['!merges'].push({ s: { r: clength+3, c: 4 }, e: { r: clength+3, c: 5 } })
    ws['!merges'].push({ s: { r: clength+3, c: 6 }, e: { r: clength+3, c: 8 } })
    // 创建人
    ws['!merges'].push({ s: { r: clength+4, c: 0 }, e: { r: clength+4, c: 1 } })
    ws['!merges'].push({ s: { r: clength+4, c: 2 }, e: { r: clength+4, c: 4 } })
    ws['!merges'].push({ s: { r: clength+4, c: 6 }, e: { r: clength+4, c: 8 } })
    // 开票客户名称
    ws['!merges'].push({ s: { r: clength+5, c: 0 }, e: { r: clength+5, c: 2 } })
    ws['!merges'].push({ s: { r: clength+5, c: 3 }, e: { r: clength+5, c: 5 } })
    ws['!merges'].push({ s: { r: clength+5, c: 6 }, e: { r: clength+5, c: 8 } })
    //invoice 开票客户长度
    for(let m=0;m<autoLength.invoice;m++){
      ws['!merges'].push({s: { r: 6+clength+m, c: 0 }, e: { r: 6+clength+m, c: 2 }})
      ws['!merges'].push({s: { r: 6+clength+m, c: 3 }, e: { r: 6+clength+m, c: 5 }})
      ws['!merges'].push({s: { r: 6+clength+m, c: 6 }, e: { r: 6+clength+m, c: 8 }})
    }
    // 到款单位
    const ilength = 15+autoLength.costList+autoLength.invoice;
    ws['!merges'].push({ s: { r: ilength, c: 0 }, e: { r: ilength, c: 2 } })
    ws['!merges'].push({ s: { r: ilength, c: 3 }, e: { r: ilength, c: 4 } })
    ws['!merges'].push({ s: { r: ilength, c: 5 }, e: { r: ilength, c: 6 } })
    ws['!merges'].push({ s: { r: ilength, c: 7 }, e: { r: ilength, c: 8 } })

    // reciveList 到款单位
    for(let n=0;n<autoLength.reciveList;n++){
      ws['!merges'].push({s: { r: ilength+1+n, c: 0 }, e: { r: ilength+1+n, c: 2 }})
      ws['!merges'].push({s: { r: ilength+1+n, c: 3 }, e: { r: ilength+1+n, c: 4 }})
      ws['!merges'].push({s: { r: ilength+1+n, c: 5 }, e: { r: ilength+1+n, c: 6 }})
      ws['!merges'].push({s: { r: ilength+1+n, c: 7 }, e: { r: ilength+1+n, c: 8 }})
    }
    // 收入归属
    const belenght = 16+autoLength.costList+autoLength.invoice+autoLength.reciveList;
    ws['!merges'].push({ s: { r: belenght, c: 0 }, e: { r: belenght, c: 4 } })
    ws['!merges'].push({ s: { r: belenght, c: 5 }, e: { r: belenght, c: 8 } })

    const rowline = autoLength.costList+autoLength.invoice+autoLength.reciveList+17
    for(let k=0;k<autoLength.incomeList;k++){
      ws['!merges'].push({s: { r: rowline+k, c: 0 }, e: { r: rowline+k, c: 4 }})
      ws['!merges'].push({s: { r: rowline+k, c: 5 }, e: { r: rowline+k, c: 8 }})
    }
    ws['!merges'].push({ s: { r: rowline+autoLength.incomeList, c: 0 }, e: {  r: rowline+autoLength.incomeList, c: 8 } })
  }
  
  
  for (let j = 0; j < 9; j++) {
    let order = String.fromCharCode((65 + j))
    for(let i=1;i<data.length+1;i++){
      if(ws[order + i]){
        ws[order + i].s = defaultStyle
      }
      if(order == 'A'){
        if(ws[order + i]){
          ws[order + i].s = thStyle
        }
        if(i>8 && i<= 10+autoLength.costList){
          ws[order + i].s = defaultStyle
        }
        if(i>15+autoLength.costList && i< 16+autoLength.costList+autoLength.invoice){
          ws[order + i].s = defaultStyle
        }
        if(i>16+autoLength.costList+autoLength.invoice && i< 17+autoLength.costList+autoLength.reciveList+autoLength.invoice){
          ws[order + i].s = defaultStyle
        }
        if(i>17+autoLength.costList+autoLength.invoice+autoLength.reciveList){
          ws[order + i].s = defaultStyle
        }

      }
    }
  }
  
  if(!autoLength.settleType){
    ws['A8'].s= ws['A9'].s= ws['C8'].s = ws['G8'].s = ws['E8'].s = thStyle
    const length1 = autoLength.costList + 14
    ws['F'+length1].s = thStyle
    ws['D'+(length1+1)].s = ws['G'+(length1+1)].s = thStyle
    const length2 = length1 + 1 + autoLength.invoice+1
    ws['H'+length2].s = ws['F'+length2].s = ws['D'+length2].s = thStyle
    const length3 = length2 + 1 +autoLength.reciveList
    ws['F'+length3].s = thStyle
  }else{
    ws['A9'].s= ws['C9'].s = ws['E9'].s = ws['G9'].s = ws['F11'].s = thStyle
  }
  
  ws['!cols'] = [{wch: 12},{wch: 12},{wch: 12},{wch: 12},{wch: 12},{wch: 12},{wch: 12},{wch: 12},{wch: 12}]
  let wsrows = [];
  for(let i = 0; i < data.length; i++) {
    if(i == 0) {
      wsrows.push({hpx: 26})
    } else if(i>autoLength.costList+autoLength.invoice+autoLength.reciveList+17){
      wsrows.push({hpx: 30})
      ws['!cols'] = [{wch: 15},{wch: 15},{wch: 15},{wch: 15},{wch: 15},{wch: 15},{wch: 15},{wch: 15},{wch: 15}]
    }else{
      wsrows.push({hpx: 21})
    }
  }
  ws['!rows'] = wsrows;

  return ws
}

function getCols(colWidth){
  const result = colWidth[0];
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j]['wch'] < colWidth[i][j]['wch']) {
        result[j]['wch'] = colWidth[i][j]['wch'];
      }
    }
  }
  return result
}


export function export_json_to_excel_more_sheet({
  header,
  data,
  sheetname,
  filename,
  merges = [],
  autoLength=true,
  bookType = "xlsx"
} = {}) {
  /* original data */
  data = [...data]
  var wb = new Workbook(),ws = []
  // 列表 添加表头header
  header.forEach((item,index) => {
    data[index].unshift(item)
    console.log(autoLength);
    ws.push(sheet_from_array_of_arrays(data[index], index,autoLength))
  })

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
