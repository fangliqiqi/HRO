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
  const thBStyle = {
    border:defaultStyle.border,
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '宋体', sz: 13, color: { rgb: "000" }, outline: true, bold: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }
  for (let i = 0; i < length; i++) {
    const order = String.fromCharCode((65 + i))
    ws[order + 1].s = thStyle
    for (var j = 2; j < data.length + 1; j++) {
      const header2 = order + j
      if(i%2==0){
        ws[header2].s = thStyle
      }else{
        ws[header2].s = defaultStyle
      }
    }
  }
  ws["A1"].s = ws["A9"].s = ws["A15"].s = thBStyle
  return ws
}
function getMoreAlpha(length,ws,data,thStyle,defaultStyle){
  for (let i = 0; i < 26; i++) {
    const order = String.fromCharCode((65 + i))
    const header = order + 1
    ws[header].s = thStyle
    for (let j = 2; j < data.length + 1; j++) {
      const header2 = order + j
      if(i%2==0){
        ws[header2].s = thStyle
      }else{
        ws[header2].s = defaultStyle
      }
    }
  }
  for (let i = 0; i < (length - 26); i++) {
    const order = String.fromCharCode((65 + i))
    const header = `A${order}1`
    ws[header].s = thStyle
    for (let j = 2; j < data.length + 1; j++) {
      const header2 = `A${order}${j}`
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
function sheet_from_array_of_arrays(data, opts,autoLength,type) {
  var ws = getWsRange(data)
  // 默认样式
  const defaultStyle = {
    border: {
      bottom: { style: "thin", color: { rgb: "000000" } }, top: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } }
    },
    alignment: { horizontal: 'left', wrapText: true, vertical: "center" },
    font: { name: '宋体', sz: 10, color: { rgb: "000000" }, outline: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }
  const thStyle = {
    border:defaultStyle.border,
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '宋体', sz: 10, color: { rgb: "000" }, outline: true, bold: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }
  const thBStyle = {
    border:defaultStyle.border,
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '宋体', sz: 13, color: { rgb: "000" }, outline: true, bold: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }

  // 列表
  ws = getIndex(ws,data,thStyle,defaultStyle)
  /*设置worksheet每列的宽度*/
  const colWidth = data.map((row,i) => row.map((val,j) => {
    if(i%2==0){
      return {
        'wch': 16
      }
    }else{
      return {
        'wch': 20
      }
    }
  }))
  ws['!cols'] = getCols(colWidth,'wch')

  let wsrows = []
  let merges = []

        // 导出元素数修改时需要进行修改
        const length = data.length  - autoLength;
        let diff = 18;  // 0,1
  switch (type) {
    case 0:
    case 1:
        // 0 是工伤、1是非因工
      merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 3, c: 1 }, e: { r: 3, c: 3 } },
        { s: { r: 4, c: 1 }, e: { r: 4, c: 3 } },
        { s: { r: 5, c: 1 }, e: { r: 5, c: 3 } },
        { s: { r: 6, c: 1 }, e: { r: 6, c: 3 } },
        { s: { r: 7, c: 3 }, e: { r: 7, c: 5 } },
        { s: { r: 8, c: 0 }, e: { r: 8, c: 5 } },
        { s: { r: 13, c: 1 }, e: { r: 13, c: 5 } },
        { s: { r: 14, c: 0 }, e: { r: 14, c: 5 } },
        { s: { r: 15, c: 1 }, e: { r: 15, c: 5 } },
        { s: { r: 16, c: 1 }, e: { r: 16, c: 5 } },
        // { s: { r: 17, c: 1 }, e: { r: 17, c: 5 } },
      ]


      wsrows = [
        { hpx: 40 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },
        { hpx: 40 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 40 },{ hpx: 20 },
        { hpx: 20 },
      ]
           

      console.log('get length:', data.length,',get autoLength:',autoLength)

      // let diff = length - 18;
      if(diff && diff > 0){
        for(let i=0;i<diff;i++){
          merges.push({ s: { r: 17+i, c: 1 }, e: { r: 17+i, c: 5 } },);
          wsrows.push({ hpx: 20 })
        }
      }
      merges.push( { s: { r: length - 1, c: 0 }, e: { r: length - 1, c: 5 } },)
      wsrows.push({ hpx: 40 })

      ws[`A${length}`].s = thBStyle; //  附件位置动态下滑
      for(let i=0;i<autoLength;i++){
        merges.push({ s: { r: length+i, c: 0 }, e: { r: length+i, c: 5 } })
        ws[`A${length+1+i}`].s = defaultStyle;
        wsrows.push({ hpx: 20 })
      }
    break
    case 2:
      merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 3, c: 1 }, e: { r: 3, c: 3 } },
        { s: { r: 4, c: 1 }, e: { r: 4, c: 3 } },
        { s: { r: 5, c: 1 }, e: { r: 5, c: 3 } },
        { s: { r: 6, c: 1 }, e: { r: 6, c: 5 } },
        { s: { r: 8, c: 0 }, e: { r: 8, c: 5 } },
        { s: { r: 11, c: 1 }, e: { r: 11, c: 5 } },
        { s: { r: 12, c: 0 }, e: { r: 12, c: 5 } },
        { s: { r: 13, c: 1 }, e: { r: 13, c: 5 } },
        { s: { r: 14, c: 1 }, e: { r: 14, c: 5 } },
        // { s: { r: 15, c: 1 }, e: { r: 15, c: 5 } },
        // { s: { r: 16, c: 0 }, e: { r: 16, c: 5 } },
      ]
      wsrows = [
        { hpx: 40 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },
        { hpx: 40 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 40 },{ hpx: 20 },{ hpx: 20 },
        // { hpx: 20 },{ hpx: 40 }
      ]
      diff = length - 16;
      if(diff && diff > 0){
        for(let i=0;i<diff;i++){
          merges.push({ s: { r: 15+i, c: 1 }, e: { r: 15+i, c: 5 } },);
          wsrows.push({ hpx: 20 })
        }
      }
      merges.push( { s: { r: length - 1, c: 0 }, e: { r: length - 1, c: 5 } },)
      wsrows.push({ hpx: 40 });
      ws[`A${length}`].s = thBStyle; //  附件位置动态下滑
      for(let i=0;i<autoLength;i++){
        merges.push({ s: { r: length+i, c: 0 }, e: { r: length+i, c: 5 } })
        ws[`A${length+1+i}`].s = defaultStyle;
        wsrows.push({ hpx: 20 })
      }
      // ws["A17"].s = thBStyle
      // for(let i=0;i<autoLength;i++){
      //   merges.push({ s: { r: 17+i, c: 0 }, e: { r: 17+i, c: 5 } })
      //   ws["A"+(18+i)].s = defaultStyle
      //   wsrows.push({ hpx: 20 })
      // }
    break
    case 3:
      merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 3, c: 1 }, e: { r: 3, c: 3 } },
        { s: { r: 4, c: 1 }, e: { r: 4, c: 3 } },
        { s: { r: 5, c: 1 }, e: { r: 5, c: 3 } },
        { s: { r: 6, c: 1 }, e: { r: 6, c: 5 } },
        { s: { r: 8, c: 0 }, e: { r: 8, c: 5 } },
        { s: { r: 11, c: 1 }, e: { r: 11, c: 5 } },
        { s: { r: 12, c: 0 }, e: { r: 12, c: 5 } },
        { s: { r: 13, c: 1 }, e: { r: 13, c: 5 } },
        { s: { r: 14, c: 1 }, e: { r: 14, c: 5 } },
        { s: { r: 15, c: 0 }, e: { r: 15, c: 5 } },
      ]
      wsrows = [
        { hpx: 40 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },
        { hpx: 40 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 40 },{ hpx: 20 },{ hpx: 20 },{ hpx: 40 },
      ]
      ws["A16"].s = thBStyle
      for(let i=0;i<autoLength;i++){
        merges.push({ s: { r: 16+i, c: 0 }, e: { r: 16+i, c: 5 } })
        ws["A"+(17+i)].s = defaultStyle
        wsrows.push({ hpx: 20 })
      }
    break
    case 4:
      merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 3, c: 1 }, e: { r: 3, c: 3 } },
        { s: { r: 4, c: 1 }, e: { r: 4, c: 3 } },
        { s: { r: 5, c: 1 }, e: { r: 5, c: 3 } },
        { s: { r: 6, c: 1 }, e: { r: 6, c: 5 } },
        { s: { r: 8, c: 0 }, e: { r: 8, c: 5 } },
        { s: { r: 10, c: 1 }, e: { r: 10, c: 3 } },
        { s: { r: 12, c: 1 }, e: { r: 12, c: 5 } },
        { s: { r: 13, c: 0 }, e: { r: 13, c: 5 } },
        { s: { r: 14, c: 1 }, e: { r: 14, c: 5 } },
        { s: { r: 15, c: 0 }, e: { r: 15, c: 5 } },
      ]
      wsrows = [
        { hpx: 40 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },
        { hpx: 40 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 40 },{ hpx: 20 },{ hpx: 40 },
      ]
      ws["A16"].s = thBStyle
      for(let i=0;i<autoLength;i++){
        merges.push({ s: { r: 16+i, c: 0 }, e: { r: 16+i, c: 5 } })
        ws["A"+(17+i)].s = defaultStyle
        wsrows.push({ hpx: 20 })
      }
    break
    case 5:
      merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 3, c: 1 }, e: { r: 3, c: 3 } },
        { s: { r: 4, c: 1 }, e: { r: 4, c: 3 } },
        { s: { r: 5, c: 1 }, e: { r: 5, c: 3 } },
        { s: { r: 6, c: 1 }, e: { r: 6, c: 5 } },
        { s: { r: 8, c: 0 }, e: { r: 8, c: 5 } },
        { s: { r: 12, c: 1 }, e: { r: 12, c: 5 } },
        { s: { r: 13, c: 0 }, e: { r: 13, c: 5 } },
        { s: { r: 14, c: 1 }, e: { r: 14, c: 5 } },
        { s: { r: 15, c: 1 }, e: { r: 15, c: 5 } },
        { s: { r: 16, c: 0 }, e: { r: 16, c: 5 } },
      ]
      wsrows = [
        { hpx: 40 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },
        { hpx: 40 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 20 },{ hpx: 40 },{ hpx: 20 },{ hpx: 20 },{ hpx: 40 }
      ]
      ws["A14"].s = thBStyle
      ws["A15"].s = thStyle
      ws["A17"].s = thBStyle
      for(let i=0;i<autoLength;i++){
        merges.push({ s: { r: 17+i, c: 0 }, e: { r: 17+i, c: 5 } })
        ws["A"+(18+i)].s = defaultStyle
        wsrows.push({ hpx: 20 })
      }
    break
  }
  
  ws['!merges'] = merges
  ws['!rows'] = wsrows

  return ws
}

function getCols(colWidth,field){
  const result = colWidth[0];
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j][field] < colWidth[i][j][field]) {
        result[j][field] = colWidth[i][j][field];
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
  autoLength=0,
  type=0,
  bookType = "xlsx"
} = {}) {
  /* original data */
  data = [...data]
  
  var wb = new Workbook(),ws = []
  // 列表 添加表头header
  header.forEach((item,index) => {
    // data[index].unshift(item)
    ws.push(sheet_from_array_of_arrays(data[index], index,autoLength,type))
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
