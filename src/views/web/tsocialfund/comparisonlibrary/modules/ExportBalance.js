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

function getAlpha(length,ws,data,thStyle,defaultStyle,head){
  for (let i = 0; i < length; i++) {
    const order = String.fromCharCode((65 + i))
    const header = order + 1
    const header3 = order + 2
    const header4 = order + 3
    ws[header].s = head
    ws[header3].s = defaultStyle
    ws[header4].s = thStyle

    for (var j = 4; j < data.length + 1; j++) {
      const header2 = order + j
      ws[header2].s = defaultStyle
    }
  }
  return ws
}
function getMoreAlpha(length,ws,data,thStyle,defaultStyle,head){
  for (let i = 0; i < 26; i++) {
    const order = String.fromCharCode((65 + i))
    const header = order + 1
    const header3 = order + 2
    const header4 = order + 3

    ws[header].s = head
    ws[header3].s = defaultStyle
    ws[header4].s = thStyle
    for (let j = 4; j < data.length + 1; j++) {
      const header2 = order + j
      ws[header2].s = defaultStyle
    }
  }
  for (let i = 0; i < (length - 26); i++) {
    const order = String.fromCharCode((65 + i))
    const header = `A${order}1`
    const header3 = `A${order}2`
    const header4 = `A${order}3`
    ws[header].s = head
    ws[header3].s = defaultStyle
    ws[header4].s = thStyle
    for (let j = 4; j < data.length + 1; j++) {
      const header2 = `A${order}${j}`
      ws[header2].s = defaultStyle
    }
  }
  return ws
}

// ??????excel??????
function getIndex(ws,data,thStyle,defaultStyle,head){
  const length = data[2].length
  if (length <= 26) {
    ws = getAlpha(length,ws,data,thStyle,defaultStyle,head)
  } else {
    ws = getMoreAlpha(length,ws,data,thStyle,defaultStyle,head)
  }
  return ws
}

// ???????????????
function setMerge(data){
  const merges = []
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: data[0].length-1 } })
  merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: data[1].length-1 } })
  return merges
}

// ??????????????????????????????
function sheet_from_array_of_arrays(data, opts,autoLength) {
  var ws = getWsRange(data)
  // ????????????
  const defaultStyle = {
    border: {
      bottom: { style: "thin", color: { rgb: "000000" } }, top: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } }
    },
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '??????', sz: 10, color: { rgb: "000000" }, outline: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }
  const thStyle = {
    border:defaultStyle.border,
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '??????', sz: 10, color: { rgb: "000" }, outline: true, bold: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }
  const head = {
    border:defaultStyle.border,
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '??????', sz: 12, color: { rgb: "000" }, outline: true, bold: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }

  // ??????
  ws = getIndex(ws,data,thStyle,defaultStyle,head)
  // ???????????????
  ws['!merges'] = setMerge(data)
  // ????????????
  let wsrows = []
  wsrows.push({ hpx: 30 })
  wsrows.push({ hpx: 20 })
  ws['!rows'] = wsrows

  if (autoLength) {
    /*??????worksheet?????????????????????*/
    const colWidth = data.map(row => row.map(val => {
      /*??????????????????null/undefined*/
      if (val == null) {
        return {
          'wch': 10
        };
      }
      /*????????????????????????*/
      else if (val.toString().charCodeAt(0) > 255) {
        return {
          'wch': val.toString().length * 2
        };
      } else {
        return {
          'wch': val.toString().length
        };
      }
    }))
    ws['!cols'] = getCols(colWidth)
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
  data,
  sheetname,
  filename,
  merges = [],
  autoLength=true,
  bookType = "xlsx",
  excelHead
} = {}) {
  /* original data */
  data = [...data]
  var wb = new Workbook(),ws = []
  // ?????? ????????????header
  header.forEach((item,index) => {
    data[index].unshift(item)
    data[index].unshift(excelHead[index].unitName)
    data[index].unshift(excelHead[index].title)
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
