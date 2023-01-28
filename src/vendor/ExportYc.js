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
      ws[header].s = ws[order + 2].s = thStyle
      for (let j = 3; j < data.length + 1; j++) {
        const header2 = order + j
        ws[header2].s = defaultStyle
      }
    }
  }
  const start = String.fromCharCode((64 + number));
  for(let j = 0; j < remainder; j++){ // 余数循环
    const order2 = String.fromCharCode((65 + j))
    const header = `${start}${order2}1`
    const header1 = `${start}${order2}2`
    ws[header].s = ws[header1].s = thStyle
    for (let k = 3; k < data.length + 1; k++) {
      const header2 = `${start}${order2}${k}`
      if(ws[header2]){
        ws[header2].s = defaultStyle
      }
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
function sheet_from_array_of_arrays(data, opts,autoLength,length) {
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
    font: { name: '宋体', sz: 10, color: { rgb: "000" }, outline: true, bold: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }
  // 列表
  ws = getIndex(ws,data,thStyle,defaultStyle)
  if (autoLength) {
    /*设置worksheet每列的最大宽度*/
    const colWidth = data.map(row => row.map((val,index) => {
      /*先判断是否为null/undefined*/
      if (val == null) {
        return {
          'wch': 10
        };
      }
      /*再判断是否为中文*/
      else if (val.toString().charCodeAt(0) > 255) {
        if(index == 0 && opts > (length.first + 1)){
          return {
            'wch': 8
          };
        }else{
          const temp = val.toString().length * 2
          return {
            'wch': temp > 20 ? 20 : temp
          };
        }
      } else {
        return {
          'wch': val.toString().length
        };
      }
    }))
    ws['!cols'] = getCols(colWidth)
  }

  if(opts < length.first){
    // 合并单元格
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } },
      { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } },
      { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } },
      { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } },
      { s: { r: 0, c: 6 }, e: { r: 0, c: 12 } },
      { s: { r: 0, c: 13 }, e: { r: 0, c: 19 } },
      { s: { r: 0, c: 20 }, e: { r: 0, c: 26 } },
      { s: { r: 0, c: 27 }, e: { r: 0, c: 31 } },
      { s: { r: 0, c: 32 }, e: { r: 0, c: 36 } },
      { s: { r: 0, c: 37 }, e: { r: 0, c: 43 } },
      { s: { r: 0, c: 44 }, e: { r: 1, c: 44 } },
      { s: { r: 0, c: 45 }, e: { r: 1, c: 45 } },
      { s: { r: 0, c: 46 }, e: { r: 0, c: 52 } },
      { s: { r: 0, c: 53 }, e: { r: 1, c: 53 } },
      { s: { r: 0, c: 54 }, e: { r: 1, c: 54 } },
      { s: { r: 0, c: 55 }, e: { r: 1, c: 55 } },
      { s: { r: 0, c: 56 }, e: { r: 1, c: 56 } },
      { s: { r: 0, c: 57 }, e: { r: 1, c: 57 } },
      { s: { r: 0, c: 58 }, e: { r: 1, c: 58 } },
      { s: { r: 0, c: 59 }, e: { r: 1, c: 59 } }
    ]
  }else if(opts >= length.first + 2){
    
    let border2 = {
      bottom: { style: "thin", color: { rgb: "000000" } }, top: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } }
    }
    let style3 = { alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 18, color: { rgb: "ea5b5b" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
    let style4 = { font: { name: '宋体', sz: 10, color: { rgb: "333" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } } };
    let style5 = { alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 10, color: { rgb: "333" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } } };
    //边框加粗
    let style6 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 10, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
      { s: { r: 1, c: 1 }, e: { r: 1, c: 3 } },
      { s: { r: 2, c: 1 }, e: { r: 2, c: 5 } },
      { s: { r: 3, c: 1 }, e: { r: 3, c: 5 } },
      { s: { r: 4, c: 1 }, e: { r: 4, c: 2 } },
      { s: { r: 5, c: 1 }, e: { r: 11, c: 1 } },
      { s: { r: 12, c: 1 }, e: { r: 12, c: 2 } },
      { s: { r: 13, c: 1 }, e: { r: 13, c: 2 } },
      { s: { r: 14, c: 1 }, e: { r: 14, c: 2 } },
      { s: { r: 15, c: 1 }, e: { r: 15, c: 2 } },
      { s: { r: 16, c: 1 }, e: { r: 16, c: 2 } },
      { s: { r: 17, c: 1 }, e: { r: 17, c: 2 } },
      { s: { r: 18, c: 1 }, e: { r: 18, c: 2 } },
      { s: { r: 19, c: 1 }, e: { r: 19, c: 2 } },
      { s: { r: 20, c: 1 }, e: { r: 20, c: 2 } },
      { s: { r: 21, c: 1 }, e: { r: 21, c: 2 } },
      { s: { r: 22, c: 1 }, e: { r: 22, c: 2 } },
      { s: { r: 23, c: 1 }, e: { r: 23, c: 2 } },
    ]
    // 自定义项
    const customLength = length.customItemLength
    for(let m3=0;m3<customLength;m3++){
      ws['!merges'].push({ s: { r: 24+m3, c: 0 }, e: { r: 24+m3, c: 2 } })
    }

    ws['!merges'].push({ s: { r: customLength+24, c: 0 }, e: { r: customLength+24, c: 2 } })
    ws['!merges'].push({ s: { r: customLength+25, c: 0 }, e: { r: customLength+25, c: 2 } })
    ws['!merges'].push({ s: { r: customLength+25, c: 3 }, e: { r: customLength+25, c: 5 } })
    ws['!merges'].push({ s: { r: customLength+26, c: 0 }, e: { r: customLength+26, c: 2 } })
    ws['!merges'].push({ s: { r: customLength+26, c: 3 }, e: { r: customLength+26, c: 5 } })
    ws['!merges'].push({ s: { r: customLength+27, c: 0 }, e: { r: customLength+27, c: 2 } })
    ws['!merges'].push({ s: { r: customLength+27, c: 3 }, e: { r: customLength+27, c: 5 } })
    ws['!merges'].push({ s: { r: customLength+28, c: 0 }, e: { r: customLength+28, c: 2 } })
    ws['!merges'].push({ s: { r: customLength+28, c: 3 }, e: { r: customLength+28, c: 5 } })

    let nextIndex = (customLength+28)+1
    // 客户名称  标题
    ws['!merges'].push({ s: { r: nextIndex, c: 0 }, e: { r: nextIndex, c: 1 } })
    ws['!merges'].push({ s: { r: nextIndex, c: 2 }, e: { r: nextIndex, c: 3 } })
    ws['!merges'].push({ s: { r: nextIndex, c: 4 }, e: { r: nextIndex, c: 5 } })
    // 内容
    nextIndex = nextIndex +1
    const invoiceLeng = length.invoiceInfo
    for(let i=0;i<invoiceLeng;i++){
      ws['!merges'].push({ s: { r: nextIndex+i, c: 0 }, e: { r: nextIndex+i, c: 1 } })
      ws['!merges'].push({ s: { r: nextIndex+i, c: 2 }, e: { r: nextIndex+i, c: 3 } })
      ws['!merges'].push({ s: { r: nextIndex+i, c: 4 }, e: { r: nextIndex+i, c: 5 } })
    }
    // 到款单位 标题
    nextIndex = nextIndex + invoiceLeng
    ws['!merges'].push({ s: { r: nextIndex, c: 0 }, e: { r: nextIndex, c: 1 } })
    ws['!merges'].push({ s: { r: nextIndex, c: 2 }, e: { r: nextIndex, c: 3 } })
    // 内容
    nextIndex = nextIndex +1
    const reciveLength = length.reciveList
    for(let i=0;i<reciveLength;i++){
      ws['!merges'].push({ s: { r: nextIndex+i, c: 0 }, e: { r: nextIndex+i, c: 1 } })
      ws['!merges'].push({ s: { r: nextIndex+i, c: 2 }, e: { r: nextIndex+i, c: 3 } })
    }

    for (var m = 0; m < 6; m++) {
      let order = String.fromCharCode((65 + m))
      if (order == 'A' || order == 'E') {
        ws[order + '2'].s = style5
        ws[order + '3'].s = style5
        ws[order + '4'].s = style5
      } else {
        ws[order + '2'].s = style4
        ws[order + '3'].s = style4
        ws[order + '4'].s = style4
      }
      ws[order + '5'].s = style5
      for (var n = 5; n < data.length + 1; n++) {
        if (ws[order + n] != undefined) {
          ws[order + n].s = style6
        }

      }
      ws["A1"].s = style3
    }
    // 修改首行的行高
    let wsrows = [];
    wsrows.push({ hpx: 40 })
    ws['!rows'] = wsrows;
  }


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
  sheader,
  data,
  sheetname,
  filename,
  merges = [],
  autoLength=true,
  length,
  bookType = "xlsx"
} = {}) {
  /* original data */
  data = [...data]

  var wb = new Workbook(),ws = []
  
  // 列表 添加表头header
  sheader.forEach((item,index) => {
    if(index < length.first){
      data[index].unshift(item);
    }
  })
  header.forEach((item,index) => {
    if(index < header.length-1){
      data[index].unshift(item)
    }
    ws.push(sheet_from_array_of_arrays(data[index], index,autoLength,length))
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
